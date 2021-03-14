import A11yVueDialogRenderless from "./A11yVueDialogRenderless.vue";

const DEFAULTS = {
  componentName: "a11y-vue-dialog",
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
      Object.keys(A11yVueDialogRenderless.props).map(propName => {
        if(options.props[propName]) {
          A11yVueDialogRenderless.props[propName]['default'] = options.props[propName];
        }
      });
    }

    Vue.component(this.componentName, A11yVueDialogRenderless)
  }
}

export { A11yVueDialogRenderless };
export default Plugin;
