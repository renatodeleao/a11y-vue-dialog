import A11yVueDialog from "./A11yVueDialog.vue";
// optional stylesheet
import "./styles/a11y-vue-dialog.scss";

var COMPONENT_NAME = "component-name"
var Plugin = {
  install (Vue, options = {}) {
    /**
     * Makes sure that plugin can be installed only once
     */
    if (this.installed) {
      return
		}

		this.installed = true;
		this.componentName = options.componentName || COMPONENT_NAME;

		var testing = () => {
			return COMPONENT_NAME;
		}
		var ref = testing;
		Vue.component(this.componentName, A11yVueDialog);
	}
}

export default Plugin;
