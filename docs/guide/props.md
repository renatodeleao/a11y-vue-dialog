# Props

```js
props: {
  /**
   * @desc control's dialog visibility
   */
  open: {
    type: Boolean,
    default: false
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
   * @note NOT PRESENT IN RENDERLESS VERSION
   */
  contentRoot: {
    type: [String, null],
    default: null
  },
  /**
   * @desc focus-trap package configuration object
   * @note We use focus-trap package to handle our trapping needs. 
   * It's awesome give them an high-five. You can use this to provide any options
   * that the library would accept.
   * @since 0.5.x
   * @see {@link https://github.com/focus-trap/focus-trap#usage} 
   */
  focusTrapCreateOptions: {
    type: Object,
    default: () => ({})
  }
}