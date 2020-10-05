# Props

```js
props: {
  /**
   * @desc must match to globally/locall registered portal-vue portalName
   * NOT PRESENT IN RENDERLESS VERSION
   */
  portalName: {
    type: String,
    default: "portal"
  },
  /**
   * @desc must mach an existent portal-vue portal-target
   * NOT PRESENT IN RENDERLESS VERSION
   */
  portalTargetName: {
    type: [String, null],
    default: "a11y-vue-dialogs"
  },
  /**
   * @desc control's dialog visibility
   */
  open: {
    type: Boolean,
    default: false
  },
  /**
   * @desc add overflow hidden to body
   */
  preventBackgroundScrolling: {
    type: Boolean,
    default: true
  },
  /**
   * @desc accessibilty attribute: possible usage as modal
   * @url https://github.com/edenspiekermann/a11y-dialog#usage-as-a-modal
   */
  role: {
    type: String,
    default: "dialog",
    validator: (v) => ["dialog", "alertdialog"].indexOf(v) > -1
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
   * @desc classname that will prefix all HTML element
   * @note opininated, BEM selectors will be created for each element.
   * if using with sass, you should also match $avd-classname variable
   * before import styles. More on styling
   * NOT PRESENT IN RENDERLESS VERSION
   */
  baseClassname: {
    type: [String],
    default: "c-dialog"
  },
  /**
   * @desc focus-trap package configuration object
   * @note We use focus-trap pacakge to handle our trapping needs. It's awesome,
   * give them an high-five. You can use this to provide any options
   * that the library would accept. Note that we do not use active/deactive
   * since it will be active if dialog is shown and deactivated otherwise
   * ONLY PRESENT IN RENDERLESS VERSION
   * @see {@link https://github.com/focus-trap/focus-trap#usage} 
   */
  focusTrapCreateOptions: {
    type: Object,
    default: () => ({})
  }
}