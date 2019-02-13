## Install

add the package
```
npm i a11y-vue-dialog

# or

yarn add a11y-vue-dialog
```

```js
// portal vue is binstalled as dependency, and it's required
import PortalVue from "portal-vue";
Vue.use(PortalVue);

// add the component
import A11yVueDialog from "a11y-vue-dialog";
// if you want to register globally
Vue.use(A11yVueDialog);
```

## Usage

```html
<a11y-vue-dialog :open="true">
  <p>This slot content will be rendered wherever the <portal-target> with name 'a11y-vue-dialogs'
    is  located.</p>
</a11y-vue-dialog>
```

```html
<!-- in your app.vue, name can be costumized via portalTargetName prop locally or global -->
<portal-target name="a11y-vue-dialogs" multiple />
```

## Customization
#### Custom global installation
```js
// GLOBAL
import Portal from "portal-vue";
import A11yVueDialog from "a11y-vue-dialog";

Vue.use(Portal, {
  portalName: "black-hole", //[1]
  portalTargetName: "black-holes-meeting" //[2]
});
Vue.use(A11yVueDialog, {
  componentName: "AppNameDialog", // [3] custom registered namee
  // override default prop values on global registration
  props: {
    // ⚠️needs to match portal ⚠️
    portalName: "black-hole", //[1]
    portalTargetName: "my-dialogs-contaner" //[4]
  }
});
```

```html
<!-- [3] -->
<app-name-dialog :open="true">
  <p>This slot content will be rendered wherever the <black-holes-meeting> with name 'my-dialogs-container'
    is  located.</p>
</app-name-dialog>
```

```html
<!--  [2, 4] -->
<black-holes-meeting name="my-dialogs-contaner" multiple />
```
#### Custom local installation

```html
<script>
// assuming portal global default installation
// note the named export!
import { A11yVueDialog } from "a11y-vue-dialog";

export default {
  name: "your-component",
  components: {
    dialog: A11yVueDialog
  },
  data () => ({
    open: false
  })
}
</script>

<template>
  <dialog :open="open">
    <p>This slot content will be rendered wherever the <portal-target> with name 'a11y-vue-dialogs'
    is  located.</p>
  </dialog>
</template>

```

#### Props

```js
props: {
  /**
   * @desc must match to globally/locall registered portal-vue portalName
   */
  portalName: {
    type: String,
    default: "portal"
  },
  /**
   * @desc must mach an existent portal-vue portal-target
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
   * @desc add overflow hidden to app root
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
   */
  baseClassname: {
    type: [String],
    default: "c-dialog"
  },
}


## Why another modal/dialog plugin

- ✅ Accessibility first — Focus trap + keyboard navigation + aria-attributes
- ✅ Fully controlled component
- ✅ Pure vue, no wrapping.
- ✅ Simplicity + size
- 🕸 Nested dialogs ([questionable pattern](https://github.com/edenspiekermann/a11y-dialog#nested-dialogs), not recommended, but possible because [it happens](https://cl.ly/be43f69393f7))
- 🔜 _renderless version_

## Why use portal-vue?
Because accessibility is at the core of this plugin, and rendering the dialog in the middle of your content cause aria-attributes to be misplaced and probably a couple of other issues (overflow trap, stacking context caused by transforms)).

Portal-vue was choosen because it is actively maintained and the _de facto_ solution for portals in vue.js.

#### But i have my own portal
Althought technically possible, there will be no public instructions on how to do it. (hint: we use `<component :is="portalName" />` to allow custom `portal-vue` component registrations).
If you're considering this case, you probably can figure it out yourself by looking at the source code. But not guarantees of compatibility are give. If this becomes a common request, it's not difficult for me to decouple `a11y-vue-dialog` from `portal-vue`, but after that i'm not sure if I could still probably call it _accessible_. I'll promise to think about it for future versions, but not planned.


## Inspiration && thanks

- [portal-vue](https://github.com/LinusBorg/portal-vue) from [@LinusBorg](https://github.com/LinusBorg) wich makes escape overflow traps like breeze
- [a11y-dialog (vanilla)](http://edenspiekermann.github.io/a11y-dialog/) from [@HugoGiraudel](https://github.com/HugoGiraudel) to lead the path that ended here
- [vue-a11y-dialog (wrapper around ^)](https://github.com/morkro/vue-a11y-dialog) from [@morkro](https://github.com/morkro) for the motivation to build a pure js alternative to it.