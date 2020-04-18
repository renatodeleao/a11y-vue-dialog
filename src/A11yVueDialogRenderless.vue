<script>
const noop = () => {};

const FOCUSABLE_ELEMENTS = [
  'a[href]:not([tabindex^="-"]):not([inert])',
  'area[href]:not([tabindex^="-"]):not([inert])',
  'input:not([disabled]):not([inert])',
  'select:not([disabled]):not([inert])',
  'textarea:not([disabled]):not([inert])',
  'button:not([disabled]):not([inert])',
  'iframe:not([tabindex^="-"]):not([inert])',
  'audio:not([tabindex^="-"]):not([inert])',
  'video:not([tabindex^="-"]):not([inert])',
  '[contenteditable]:not([tabindex^="-"]):not([inert])',
  '[tabindex]:not([tabindex^="-"]):not([inert])'
];

const getInitialState = () => ({
  id: null,
  dialogEl: null,
  closeEl: null,
  focusable: [],
  trigger: null,
  portalTarget: null,
  siblingsCount: 0
})

export const VALID_ROLES = ["dialog", "alertdialog"];

export default {
  name: "a11y-vue-dialog-renderless",
  props: {
    /**
     * @desc control's dialog visibility
     */
    open: {
      type: Boolean,
      default: false
    },
    /**
     * @desc add overflow hidden to app root
     */
    preventBackgroundScrolling: {
      type: Boolean,
      default: true
    },
    /**
     * @desc accessibilty attribute: possible usage as modal. If "alertdialog"
     * will not close on "Escape" key or backdrop click.
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
          
          // focus on close button
          this.closeEl.focus();

          this.toggleBackgroundScroll(true);
          this.lookForSiblings();
          this.getFocusableChildren();
          this.toggleMutationObserver(true);
          this.toggleContentAriaAttrs(true);
        })
      })
    },
     /**
     * "open" prop watcher side effects. Orchestrates everything DOM related
     * when dialog is closed, removing observers and added attributes
     */
    handleClose() {
      this.toggleMutationObserver(false);
      this.toggleBackgroundScroll(false);
      this.toggleContentAriaAttrs(false);

      if (this.trigger) {
        this.trigger.focus();
      }

      this.resetData();
    },

    /**
     * Handle keyboard events on dialoRef element an manage which
     * method to call accordingly
     * 
     * @param {Event} e - Javascript keyboard event 
     */
    handleKeyboard(e) {
      if (e.key === 'Escape' && this.role !== 'alertdialog' ) {
        this.close(e)
      }

      if (e.key === 'Tab') {
        this.trapFocus(e)
      }
    },

    /**
     * @event Close - event for closing the dialog on the parent.
     * Internal side-effects are handled in "open" prop watcher
     */
    close() {
      this.$emit('close');
    },

    /**
     * @see [1] Prevents scrollbar jump
     */
    toggleBackgroundScroll(isOpen) {
      if (this.preventBackgroundScrolling) {
        // if (this.siblingsCount > 1) return; // legacy ?

        const body = document.body.style;
        const app = this.$root.$el.style;

        if(isOpen) {
          body.setProperty("overflow", "hidden");
          app.setProperty("overflow-y", "scroll"); // [1]
        } else {
          body.removeProperty("overflow", "hidden")
          app.removeProperty("overflow-y", "scroll"); // [1]
        }
      }
    },
    
    /**
     * We can't use vue refs bindings with scopedSlots so we look for the attached 
     * ref data-attributes on elements instead.
     * @returns {Boolean} performs checks for other ref dependend methods
     */
    getDOMRefs() {
      this.trigger = document.activeElement;
      this.dialogRoot = document.querySelector(`[data-id="a11y-vue-dialog-${this._uid}"]`);

      if (this.dialogRoot) {
        this.dialogEl = this.dialogRoot.querySelector('[data-ref="dialog"]');
        this.closeEl = this.dialogRoot.querySelector('[data-ref="close"]');
        return true
      }

      return false
    },

    /**
     * Cleans component internal state (data object), while caching static elements 
     * references to avoid querySelector them all the time.
     */
    resetData(destroy = false) {
      if (destroy) {
        Object.assign(this.$data, getInitialState())
      } else {
        const { trigger, focusable, siblingsCount } = getInitialState()
        Object.assign(this.$data, { trigger, focusable, siblingsCount })
      }
    },

    //-////////////////////////////////////////////////////////////////////////
    // ACESSIBILITY
    // 
    // All credits to Hugo Giraudel for this
    // https://github.com/edenspiekermann/a11y-dialog
    // 
    //-///////////////////////////////////////////////////////////////////////
      
    /**
     * Get all focusable element inside dialog
     */
    getFocusableChildren(){
      this.focusable = Array.from(
        this.dialogEl.querySelectorAll(FOCUSABLE_ELEMENTS.join(','))
      );
    },
    
    /**
     * Trap the focus inside the dialog to allow user to navigation dialog content
     * using the keyboard without loosing focus.
     *
     * @param {Event} event - keydown event.
     */
    trapFocus(event) {
      const focusedItemIndex = this.focusable.indexOf(document.activeElement);
      const lastIndex = this.focusable.length - 1

      // If the SHIFT key is being pressed while tabbing (moving backwards) and
      // the currently focused item is the first one, move the focus to the last
      // focusable item from the dialog element
      if (event.shiftKey && focusedItemIndex === 0) {
        this.focusable[lastIndex].focus();
        event.preventDefault();
        // If the SHIFT key is not being pressed (moving forwards) and the currently
        // focused item is the last one, move the focus to the first focusable item
        // from the dialog element
      } else if (
        !event.shiftKey &&
        focusedItemIndex === lastIndex
      ) {
        this.focusable[0].focus();
        event.preventDefault();
      }
    },

    /**
     * A default MutationObserver to watch for dynamically added content
     * and possibly new focusable elements. Common usecases are dialogs
     * with asynchronous content and/or content hidden with v-if.
     */
    toggleMutationObserver(isOpen){
      if (isOpen) {
        const callback = (mutationsList) => {
          for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
              this.getFocusableChildren();
            }
          }
        };

        this.observer = new MutationObserver(callback);
        this.observer.observe( this.dialogEl, {
          childList: true,
          subtree: true
        });
      } else {
        if (this.observer) {
          this.observer.disconnect();
          this.$delete(this.observer);
        }
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
    }
  },

  /**
   * @todo Lifecyle methods go crazy when called with nested modals pattern.
   * in default mode, destroyed is not called (and reasonably since it's the)
   * portal that is toggled with v-if not this one. But when nested is always
   * called. Needs investigation
   */
  created() {
    this.id = !this.id && `a11y-vue-dialog-${this._uid}`
  },

  destroyed() {
    this.resetData(true)
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
   */
  render() {
    return this.$scopedSlots.default({
      open: this.open,
      closeFn: this.close,
      backdropRef: {
        props: {
          'tabindex': '-1',
          'data-id': this.id,
          'data-ref': 'backdrop',
        },
        listeners: {
          click: this.role !== 'alertdialog' ? this.close : noop
        }
      },
      dialogRef: {
        props: {
          role: this.role,
          'data-ref': 'dialog',
          'aria-labelledby': `${this.id}-title`,
        },
        listeners: {
          click: this._stopPropagation,
          keydown: this.handleKeyboard
        }
      },
      closeRef: {
        props: {
          'data-ref': 'close',          
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
    })
  }
}
</script>