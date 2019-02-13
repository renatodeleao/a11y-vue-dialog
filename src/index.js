import A11yVueDialog from "./A11yVueDialog.vue";
// optional stylesheet
import "./styles/a11y-vue-dialog.scss";

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
      Object.keys(A11yVueDialog.props).map(propName => {
        if(options.props[propName]) {
          A11yVueDialog.props[propName]['default'] = options.props[propName];
        }
      });
    }

	  Vue.component(this.componentName, A11yVueDialog)
	}
}

export { A11yVueDialog };
export default Plugin;
