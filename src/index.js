import A11yDialog from "./A11yDialog.vue";

const DEFAULTS = {
  componentName: "a11y-dialog",
}

var Plugin = {
  install (Vue, options = {}) {
    /**
     * Makes sure that plugin can be installed only once
     */
    if (this.installed) {
      return
    }

    this.installed = true;
    this.componentName = options.componentName || DEFAULTS.componentName;

    // is there a better way of doing this
    // (extend default prop value on component registration)*
    if( options.props) {
      Object.keys(A11yDialog.props).map(propName => {
        if(options.props[propName]) {
          A11yDialog.props[propName]['default'] = options.props[propName];
        }
      });
    }

    Vue.component(this.componentName, A11yDialog)
  }
}

export { A11yDialog };
export default Plugin;
