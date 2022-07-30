<script>
import { createFocusTrap } from 'focus-trap'
import {
  noop,
  uniqueId,
  UniversalLifecyleNamesMap,
  universalSlotAccessProp
} from './utils.js'

// @see [FT3]
const AUTOFOCUS_QUERY = 'input[autofocus], button[autofocus], select[autofocus], textarea[autofocus]'

/**
 * @see spyMouseDown|spyMouseUp - [1]
 */
const getInitialState = () => ({
  id: null,
  dialogEl: null,
  closeEl: null,
  focusRef: null,
  trap: null,
  portalTarget: null,
  siblingsCount: 0,
  mouseDownOrigin: null // [1]
})

export const VALID_ROLES = ["dialog", "alertdialog"];

export default {
  compatConfig: {
    MODE: 3 // opt-in to Vue 3 if loaded in compat mode
  },
  name: "a11y-dialog",
  emits: ['show', 'hide', 'close'],
  props: {
    /**
     * @desc control's dialog visibility
     */
    open: {
      type: Boolean,
      default: false
    },
    /**
     * @desc accessibilty attribute: possible usage as modal. If "alertdialog"
     * will not close on backdrop click.
     * @see https://github.com/edenspiekermann/a11y-dialog#usage-as-a-modal
     */
    role: {
      type: String,
      default: "dialog",
      validator: (role) => VALID_ROLES.indexOf(role) > -1
    },
    /**
     * @desc accessibilty attribute: hide content from screen readers
     * when dialog is open. if null, defaults to siblings of portal-target element
     */
    contentRoot: {
      type: [String, null],
      default: null
    },
    /**
     * @desc focus-trap package configuration object
     * @see {@link https://github.com/focus-trap/focus-trap#usage}
     */
    focusTrapCreateOptions: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => getInitialState(),
  watch: {
    open: {
      immediate: true,
      handler: function(open) {
        if (open) {
          this.handleOpen()
        } else {
          this.handleClose()
        }
      }
    }
  },
  methods: {
    /**
     * "open" prop watcher side effects. Orchestrates everything DOM related
     * with the open state of the dialog. nextTick because dom is conditionally
     * rendered with v-if on root node.
     *
     * @todo [1] - kind of embarassing but i need to investigate the need of
     * double nextTick, otherwise it will fail to get DOM refs from data-attrs.
     * I get that we need one, But two? Maybe due portal mount as well? Investigate.
     *
     * If found, please write a test to it,
     */
    handleOpen() {
      this.$nextTick(() => {
        this.$nextTick(() => {
          const hasRefs = this.getDOMRefs();
          // do no perform DOM actions if no DOM references
          if (!hasRefs) return;

          this.toggleFocusTrap(true);
          this.lookForSiblings();
          this.toggleVisibilityEvents(true);
          this.toggleContentAriaAttrs(true);
        })
      })
    },
     /**
     * "open" prop watcher side effects. Orchestrates everything DOM related
     * when dialog is closed, removing observers and added attributes
     */
    handleClose() {
      this.toggleFocusTrap(false);
      this.toggleVisibilityEvents(false);
      this.toggleContentAriaAttrs(false);

      this.resetData();
    },

    /**
     * Handle keyboard events on dialoRef element an manage which
     * method to call accordingly
     *
     * @param {Event} e - Javascript keyboard event
     */
    handleKeyboard(e) {
      e.stopPropagation();

      const { key, target } = e;

      if (key === 'Escape') {
        // do not interfere with native input behaviour
        if (target.type === 'search' && target.value !== '') return

        this.close(e)
      }
    },

    /**
     * @event Close - event for closing the dialog on the parent.
     * Internal side-effects are handled in "open" prop watcher
     */
    close(event) {
      this.$emit('close', event);
    },

    /**
     * Usefull events for side-effects on open/close like preventing
     * background content scroll with a custom solution.
     * Overflow:hidden on body might not produce the desired effects
     * within nested contained content.
     * @event show
     * @event hide
     */
    toggleVisibilityEvents(isOpen) {
      const hasSiblings = this.siblingsCount > 1

      return isOpen
        ? this.$emit('show', hasSiblings)
        : this.$emit('hide', hasSiblings)
    },

    /**
     * We can't use vue refs bindings with scopedSlots so we look for the attached
     * ref data-attributes on elements instead.
     * @returns {Boolean} performs checks for other ref dependend methods
     */
    getDOMRefs() {
      this.dialogRoot = document.querySelector(`[data-id="${this.id}"]`);

      if (this.dialogRoot) {
        this.dialogEl = this.dialogRoot.querySelector('[data-ref="dialog"]');
        this.closeEl = this.dialogRoot.querySelector('[data-ref="close"]');
        this.focusRef = this.dialogRoot.querySelector('[data-ref="focus"]');
        return true
      }

      return false
    },

    /**
     * Cleans component internal state (data object).
     * @todo implement a cache mechanism in case component wasn't destroyed.
     * #perf
     */
    resetData() {
      // eslint-disable-next-line
      const { id, ...resetData} = getInitialState()
      Object.assign(this.$data, resetData)
    },

    /**
     * @see [FT1] - provided initial focus not found, it won't get the first focusable children
     *   {@link https://github.com/focus-trap/focus-trap/issues/113}
     * @see [FT2] - if click outside an focusable element, but inside dialog body, (do not focus
     *   first focus element (close button), it's weird. But keep focus within dialog. It's overrideable
     *   via focusTrapCreateOptions
     * @see [FT3]
     *   Some input components wrappers might inheriting attributes, meaning
     *   some <div autofocus> — this is an invalid focusable element — but we
     *   were getting it anyways, and focus-trap doesn't validate (and i agree)
     *   element so we changed our query to only select valid ones.
     *   @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes}
     */
    toggleFocusTrap(toggle) {
      if (toggle) {
        this.trap = createFocusTrap(
          this.dialogEl,
          {
            escapeDeactivates: false,
            allowOutsideClick: true,
            initialFocus: this.focusRef || this.dialogEl.querySelector(AUTOFOCUS_QUERY) || undefined, // [FT1] [FT3]
            fallbackFocus: this.dialogEl, // [FT2]
            ...this.focusTrapCreateOptions
          }
        )
        this.trap.activate()
      } else {
        if (this.trap) this.trap.deactivate()
      }
    },

    /**
     * Toggling aria-hidden on content other than dialog.
     * This is kind tricky and maybe we should just
     */

    // experimental for multiple modals
    lookForSiblings() {
      this.portalTarget = this.dialogRoot.parentElement;
      this.siblingsCount = this.portalTarget.children.length;
    },

    /**
     * https://gomakethings.com/an-es6-way-to-get-all-sibling-elements-with-vanilla-js/
     */
    getSiblings (elem) {
      return Array.from(elem.parentNode.children)
        .filter(sibling => sibling !== elem);
    },

    toggleContentAriaAttrs(isOpen){
      // if theres already one open dialog, we don't need to toggle everything again.
      if(this.siblingsCount > 1) return;

      const contentRoot = this.contentRoot;
      let contentRootSiblings = [];

      // check if content-root prop is not null, in affirmative case
      // we just want to target it, nothing else
      if (contentRoot) {
        contentRootSiblings.push(document.querySelector(contentRoot))
      } else if (this.portalTarget) {
        // if not, we default to find the same level elements (siblings)
        // of portalTarget (where the focus is) and apply aria-attributes to hide
        // the rest of the contetn
        contentRootSiblings = this.getSiblings(this.portalTarget);
      }


      if (isOpen) {
        contentRootSiblings.forEach(s => s && s.setAttribute('aria-hidden', 'true'))
      } else {
        contentRootSiblings.forEach(s => s && s.removeAttribute('aria-hidden'))
      }
    },

    /**
    * Internals.
    *
    * mostly created for testing, because i didn't figure out a
    * away of mock funtions that are defined, inline into the scopedSlots
    * returned Object
    */
    _stopPropagation(e) {
      e.stopPropagation()
    },

    /**
     * Prevents mouseup that started inside (dialogRef mousedown) to bubble
     * and trigger backdrop click, consequentially closing the dialog.
     *
     * ⚠️ Note: for cases when backdropRef wraps the dialog content,
     *    so it's also our root, that's why it's affected by children
     *    events bubbling
     *
     * This prevents a default browser behaviour, when the mouse click is released,
     * both the mouseup and click events are fired. Since consumers might define
     * backdrop as root (picture a pseudo element as the overlay for example)
     *
     * Setting as separate element inside the root doens't require this, but
     * we must remain unopinionated in relation to markup.
     *
     * @see https://stackoverflow.com/a/20290312/2801012
     * @see https://codesandbox.io/s/click-drag-selection-outside-still-triggers-click-after-mouseup-t0742
     *
     * @see captureMouseUp
     * @see spyMouseDown
     * @see spyMouseUp
     */
    captureMouseUp(e) {
      e.stopPropagation(); // Stop the click from being propagated.
      window.removeEventListener('click', this.captureMouseUp, true); // cleanup
      this.mouseDownOrigin = null
    },
    spyMouseDown(e) {
      e.stopPropagation()
      this.mouseDownOrigin = e.target
    },
    spyMouseUp(e) {
      e.stopPropagation()
      if (this.mouseDownOrigin !== e.target) {
        // capture it: was triggered somewhere else
        window.addEventListener('click', this.captureMouseUp, true)
      }
    }
  },

  /**
   * @todo Lifecyle methods go crazy when called with nested modals pattern.
   * in default mode, destroyed is not called (and reasonably since it's the)
   * portal that is toggled with v-if not this one. But when nested is always
   * called. Needs investigation
   */
  created() {
    this.id = uniqueId()
  },

  [UniversalLifecyleNamesMap.beforeUnmount]() {
    this.handleClose()
  },

  /**
   * @slot binding to be applied to the defined elements. Each ref suffixed
   * binding is an object that contains a "props" and "listeners" keys to be
   * attached to elements via v-bind and v-on respectively
   *
   * @binding {Boolean} open - prop forwarding for portal v-if
   * @binding {Function} close - method forwarding for closing the dialog
   * @binding {Object} backdropRef - for the backdrop element
   * @binding {Object} dialogRef - for the main dialog element
   * @binding {Object} closeRef - for attching close buttons/actions
   * @binding {Object} titleRef - For attaching dialog title, for accessiblity
   *
   * @todo [1] - If some one selects text from the dialog, document.activeElement is
   *  set to the backdrop, even with tabindex="-1", so we need to bind keyboard events
   *  there as well so that dialog keeps closing on escape click. Not sure if
   *  the best way, but shipable for now
   *
   * @see [2] - It is strongly recommended that the tab sequence of all
   *  dialogs include a visible element with role button that closes the
   *  dialog, such as a close icon or cancel button.
   *  {@link https://www.w3.org/TR/wai-aria-practices/#dialog_modal}
   */
  render() {
    return this[universalSlotAccessProp].default({
      open: this.open,
      closeFn: this.close,
      backdropRef: {
        props: {
          'tabindex': '-1',
          'data-id': this.id,
          'data-ref': 'backdrop',
        },
        listeners: {
          click: this.role !== 'alertdialog' ? this.close : noop,
          keydown: this.handleKeyboard, // [1]
          mousedown: this.spyMouseDown,
          mouseup: this.spyMouseUp,
        }
      },
      dialogRef: {
        props: {
          role: this.role,
          'data-ref': 'dialog',
          'aria-labelledby': `${this.id}-title`,
          tabindex: '-1' // [FT2]
        },
        listeners: {
          click: this._stopPropagation,
          keydown: this.handleKeyboard,
          mousedown: this.spyMouseDown,
          mouseup: this.spyMouseUp,
        }
      },
      // [2]
      closeRef: {
        props: {
          'data-ref': 'close'
        },
        listeners: {
          click: this.close
        }
      },
      titleRef: {
        props: {
          id: `${this.id}-title`
        }
      },
      focusRef: {
        props: {
          'data-ref': 'focus'
        }
      }
    })
  }
}
</script>
