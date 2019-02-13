<template>
  <portal to="dialogs" v-if="open">
    <div
      :id="`dialog-${_uid}`"
      :class="classObj"
      :content-root="contentRoot"
      ref="backdrop"
      @click="handleBackdropClick"
    >
      <skeleton
        :class="`${baseClass}__inner`"
        :role="role"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-desc"
        scrollable="auto"
        @keydown.esc="dismiss"
        @keydown.tab="trapFocus"
        ref="dialog"
      >
        <header :class="`${baseClass}__header`" slot="skeleton-head">
          <h1 id="dialog-title" :class="`${baseClass}__title`">
            <slot name="title">Dialog Title</slot>
          </h1>
          <div
            ref="close"
            :class="`${baseClass}__close`"
            tabindex="0"
            type="button"
            aria-label="Close this dialog window"
            @click="dismiss"
            @keydown.enter.prevent="dismiss"
            @keydown.space="dismiss"
          >
            <slot name="close-button">
              &times;
            </slot>
          </div>
        </header>

        <section :class="`${baseClass}__body`" id="dialog-desc">
          <slot />
        </section>

        <footer slot="skeleton-feet" :class="`${baseClass}__footer`" v-if="$slots['dialog-footer']">
          <slot name="dialog-footer" />
        </footer>
      </skeleton>
    </div>
  </portal>
</template>

<script>
import Skeleton from "./components/Skeleton.vue";

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
  dialogEl: null,
  focusable: [],
  trigger: null,
  portalTarget: null,
  siblingsCount: 0
})

export default {
  name: "dialog-base",
  components: {
    Skeleton
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    preventBackgroundScrolling: {
      type: Boolean,
      default: true
    },
    /**
     * possible usage as modal
     * https://github.com/edenspiekermann/a11y-dialog#usage-as-a-modal
     */
    role: {
      type: String,
      default: "dialog",
      validator: (v) => ["dialog", "alertdialog"].indexOf(v) > -1
    },
    contentRoot: {
      type: [String, null],
      default: null
    },
    theme: {
      type: [String, null],
      default: null
    },
    size: {
      type: [String, null],
      default: null
    }
  },
  data: () => getInitialState(),
  computed: {
    baseClass(){
      return "c-dialog"
    },
    classObj(){
      return {
        [this.baseClass]: true,
        [`${this.baseClass}--${this.theme}`]: this.theme,
        [`${this.baseClass}--${this.size}`]: this.size
      }
    }
  },
  watch: {
    open: {
      immediate: true,
      handler: function(open) {
        if( open ) {
          this.handleBackgroundScrolling(true);
          this.openDuties();
        } else {
          this.handleBackgroundScrolling(false);
          this.resetData();
        }
      }
    }
  },
  methods: {
    openDuties() {
      this.trigger = document.activeElement;

      this.$nextTick(() => {
        this.dialogEl = this.$refs.dialog.$el;
        this.lookForSiblings();
        this.$refs.close.focus()
        this.getFocusableChildren();
        this.observeContents(true);
        this.ariaHandler(true)
      })
    },

    dismiss() {
      this.observeContents();
      this.ariaHandler(false);
      if(this.trigger){
        this.trigger.focus();
      }
      this.$emit('close');
    },

    handleBackdropClick(e) {
      if (e.target === this.$refs.backdrop) {
        this.dismiss()
      }
    },

    /**
     * [1] fix jump due removal of scrollbar
     * only works beacause neither body or #app has height 100%;
     */
    handleBackgroundScrolling(open){
      if(this.preventBackgroundScrolling) {
        if( this.siblingsCount > 1) return;

        let body = document.body.style;
        let app = this.$root.$el.style;

        if(open) {
          body.setProperty("overflow", "hidden");
          app.setProperty("overflow-y", "scroll"); // [1]
        } else {
          body.removeProperty("overflow", "hidden")
          app.removeProperty("overflow-y", "scroll"); // [1]
        }
      }
    },

    resetData() {
      Object.assign(this.$data, getInitialState())
    },

    // experimental for multiple modals
    lookForSiblings() {
      this.portalTarget = this.$refs.backdrop.parentElement;
      this.siblingsCount = this.portalTarget.children.length;
    },

    //----------------
    // All credits to Hugo Giraudel for this
    // https://github.com/edenspiekermann/a11y-dialog/blob/master/a11y-dialog.js
    //
    // Copied and adptade to this instance
    // ----------------

    /**
     * Get all focusable element inside dialog
     */
    getFocusableChildren(){
      this.focusable = [].slice.call( this.dialogEl.querySelectorAll(FOCUSABLE_ELEMENTS.join(',')) );
    },
    /**
     * Trap the focus inside the given element
     *
     * @param {Event} event
     */
    trapFocus(event) {
      this.getFocusableChildren(); // maybe we can cache and apply MutationObserver to watch for new ones
      var focusedItemIndex = this.focusable.indexOf(document.activeElement);

      // If the SHIFT key is being pressed while tabbing (moving backwards) and
      // the currently focused item is the first one, move the focus to the last
      // focusable item from the dialog element
      if (event.shiftKey && focusedItemIndex === 0) {
        this.focusable[this.focusable.length - 1].focus();
        event.preventDefault();
        // If the SHIFT key is not being pressed (moving forwards) and the currently
        // focused item is the last one, move the focus to the first focusable item
        // from the dialog element
      } else if (
        !event.shiftKey &&
        focusedItemIndex === this.focusable.length - 1
      ) {
        this.focusable[0].focus();
        event.preventDefault();
      }
    },

    /**
     * A default MutationObserver to watch for newly
     * added content and possibly new focusable elements
     */
    observeContents(bool){
      if (bool) {
        const callback = (mutationsList, observer) => {
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
      } else {
        if (this.observer) this.observer.disconnect();
      }
    },


    //-------------------------
    // ACESSIBILITY ATTRIBUTES
    //-------------------------

    /**
     * https://gomakethings.com/an-es6-way-to-get-all-sibling-elements-with-vanilla-js/
     */
    getSiblings (elem) {
      return [].filter.call(elem.parentNode.children, (sibling) => sibling !== elem );
    },

    ariaHandler(bool){
      // if theres already one open dialog, we don't need to toggle everything again.
      if(this.siblingsCount > 1) return;

      const contentRoot = this.contentRoot;
      let contentRootSiblings = [];

      if (contentRoot) {
        contentRootSiblings.push(document.querySelector(contentRoot))
      } else if (this.portalTarget) {
        contentRootSiblings = this.getSiblings(this.portalTarget);
      }

      if( bool ){
        contentRootSiblings.map(s => s.setAttribute('aria-hidden', 'true'))
      } else {
        contentRootSiblings.map( s => s.removeAttribute('aria-hidden'))
      }
    }
  }
}
</script>
