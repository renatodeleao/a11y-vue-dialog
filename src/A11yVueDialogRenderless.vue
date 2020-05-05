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

/**
 * @see spyMouseDown|spyMouseUp - [1] 
 */
const getInitialState = () => ({
  id: null,
  dialogEl: null,
  closeEl: null,
  focusRef: null,
  focusable: [],
  focusedIndex: -1,
  trigger: null,
  mutating: false,
  caralho: null,
  portalTarget: null,
  siblingsCount: 0,
  mouseDownOrigin: null // [1]
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

          this.toggleBackgroundScroll(true);
          this.toggleFocusListener(true);
          this.getFocusableChildren();
          this.setInitialFocus(); 

          this.lookForSiblings();
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
      this.toggleFocusListener(false)
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
      e.stopPropagation();
      
      const { key, target } = e;

      if (key === 'Escape' && this.role !== 'alertdialog') {
        // do not interfere with native input behaviour
        if (target.type === 'search' && target.value !== '') return

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
        if (this.siblingsCount > 1) return; // translates to: one dialog is already open
        
        const bodyStyle = document.body.style;

        isOpen 
          ? bodyStyle.setProperty("overflow", "hidden")
          : bodyStyle.removeProperty("overflow", "hidden")
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

    //-////////////////////////////////////////////////////////////////////////
    // ACESSIBILITY
    // 
    // All credits to Hugo Giraudel for this
    // https://github.com/edenspiekermann/a11y-dialog
    // 
    //-///////////////////////////////////////////////////////////////////////
      
    /**
     * Get all focusable element inside dialog
     * @see [1] - Authors SHOULD ensure that all dialogs (both modal and 
     *  non-modal) have at least one focusable descendant element. Authors 
     *  SHOULD focus an element in the modal dialog when it is displayed, 
     *   and authors SHOULD manage focus of modal dialogs.
     *  {@link https://www.w3.org/TR/wai-aria-1.1/#dialog}
     */
    getFocusableChildren() {
      this.focusable = Array.from(
        this.dialogEl.querySelectorAll(FOCUSABLE_ELEMENTS.join(','))
      ).filter(this._isFocusable)

      // [1]
      if (!this.focusable.length) {
        console.warn('All dialogs must have at least on focusable descendent: https://www.w3.org/TR/wai-aria-1.1/#dialog')
      }
    },
    
    /**
     * Unless a condition where doing otherwise is advisable, focus is initially set on the 
     * first focusable element:
     *   ”first non-inert focusable area in subject’s control group whose DOM anchor has an 
     *   autofocus attribute specified“
     * 
     * @see FOCUSABLE_ELEMENTS
     * @see https://www.w3.org/TR/html52/interactive-elements.html#elementdef-dialog
     * @see https://www.w3.org/TR/wai-aria-practices/#dialog_modal
     */
    setA11yFocus() {
      const firstAutoFocusEl = this.focusable.find(el => el.autofocus)
      firstAutoFocusEl 
        ? firstAutoFocusEl.focus()
        : this.focusable[0].focus()
    },

    /**
     * If a valid focusRef is provided, we'll move focus on that, else
     * we fallback to WAI ARIA guidelines. (<span></span> is not focusable )
     * @see https://www.w3.org/TR/wai-aria-practices/#dialog_modal
     */
    setInitialFocus() {
      if (this.focusRef && this._isFocusable(this.focusRef)) {
        this.focusRef.focus() 
      } else {
        this.setA11yFocus()
      }
    },
    
    /**
     * Trap the focus inside the dialog to allow user to navigation dialog content
     * using the keyboard without loosing focus.
     *
     * @param {Event} event - keydown event.
     */
    trapFocus(event) {
      const lastIndex = this.focusable.length - 1

      // If the SHIFT key is being pressed while tabbing (moving backwards) and
      // the currently focused item is the first one, move the focus to the last
      // focusable item from the dialog element
      if (event.shiftKey && this.focusedIndex === 0) {
        this.focusable[lastIndex].focus();
        event.preventDefault();
        // If the SHIFT key is not being pressed (moving forwards) and the currently
        // focused item is the last one, move the focus to the first focusable item
        // from the dialog element
      } else if (
        !event.shiftKey &&
        this.focusedIndex === lastIndex
      ) {
        this.focusable[0].focus();
        event.preventDefault();
      }
    },

    /**
     * Update state with current active element index on our internal
     * focusable. This is used to trap focus and
     * @see trapFocus
     * @see toggleMutationObserver
     */
    handleFocus() {
      console.log('handlefocus')


      if (this.mutating) {
        console.log('is mutating no handlefocus so focus index is saved to the prev')
        return;
      }

      this.focusedIndex = this.focusable.indexOf(document.activeElement)
    },

    /**
     * add/remove focus listenser based on on open state. Note that watcher
     * runs immediatly, so dom elements might not be in place.
     * Does use window events so we can keep it locally scoped (nested dialogs)
     */
    toggleFocusListener(isOpen) {
      if (!this.dialogRoot) return

      isOpen 
        ? this.dialogRoot.addEventListener('focus', this.handleFocus, true)
        : this.dialogRoot.removeEventListener('focus', this.handleFocus, true)
    },
    test(e) {
      e.stopPropagation()

      this.lookForSiblings();
      if (this.siblingsCount > 1) {
        this.mutating = false
        console.log('nope')
        this.focusedIndex = this.focusable.indexOf(this.mouseDownOrigin)
        this.dialogRoot.addEventListener('focus', this.handleFocus, true);
        window.removeEventListener('keydown', this.test, true)
        

        return false;
      }

      console.log('nope')

      if(e.key === 'Escape') {

        window.removeEventListener('keydown', this.test, true)

        this.close()                    
      }

      if (e.key === 'Tab') {
        console.log('tabbb capture')
        this.mutating = true

        let next = e.shiftKey ? this.focusedIndex - 1 : this.focusedIndex

        if(this.focusable[next]) {
        
          console.log('Nnext')
          setTimeout(() => {
            this.focusable[next].focus()
            this.mutating = false
            window.removeEventListener('keydown', this.test, true)
            this.dialogRoot.addEventListener('focus', this.handleFocus, true);

          })

        } else {
          console.log('first')
          console.log(this.focusable[0].textContent)
          setTimeout(() => {
            this.focusable[0].focus()
            console.log('setupsasd')
            this.mutating = false
            window.removeEventListener('keydown', this.test, true)
            this.dialogRoot.addEventListener('focus', this.handleFocus, true);


          })
        }
      
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
          for (var [i, mutation] of mutationsList.entries()) {
            if (mutation.type == 'childList' || mutation.type === 'attributes') {
              // v-if might have happend, so listen for tick
              this.getFocusableChildren();

              if (document.activeElement === this.focusable[this.focusedIndex]) {
                // don't do anythig else if our focus  element stays intact
                return;
              }
            }


            if ( i === mutationsList.length - 1) {

              // button was disabled on removed
                // remove immediatlly because capture might have not been used
                // to self clean
           
                if( document.activeElement === document.body) {
                  console.log('body')
                  this.mutating = true
                  this.dialogRoot.removeEventListener('focus', this.handleFocus, true);
                  window.removeEventListener('keydown', this.test, true)
                  window.addEventListener('keydown', this.test, true)
                  console.log('higjack')
                } else {
                  console.log('else')
                  this.lookForSiblings() 

                  if (this.siblingsCount > 1)  return;

                  window.removeEventListener('keydown', this.test, true)
                  this.mutating = false
                  this.handleFocus()
                }
            }
          }
        };

        this.observer = new MutationObserver(callback);
        this.observer.observe( this.dialogEl, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeOldValue: true
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
    },

    /**
     * Straight from jQuery :visible. Also accounts for cases where a parent
     * wrapper might be hidden (v-show) and no the element itself
     * @author jQuery
     * @see https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
     * @see https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
     */
   _isVisible(element) {
      return !!(
        element.offsetWidth ||
        element.offsetHeight ||
        element.getClientRects().length
      );
    },

    _isNotInert(element) {
      return element.matches(FOCUSABLE_ELEMENTS)
    },

    /**
     * If the element is present in the gathered DOM focusable elements
     * collection. If yes than it is considered Focusable
     * @param {HTMLElement} element
     */
    _isFocusable(element) {
      return (
        this._isNotInert(element) &&
        this._isVisible(element)
      )
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
    this.id = `a11y-vue-dialog-${this._uid}`
  },

  destroyed() {
    this.resetData()
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
