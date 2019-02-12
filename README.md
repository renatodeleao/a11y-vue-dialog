## Install

add the package
```
npm i a11y-vue-dialog

# or

yarn add a11y-vue-dialog
```

```js
// portal vue is installed as dependency
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
  <p>This slot content will be rendered wherever the <portal-target> with name 'destination'
    is  located.</p>
</a11y-vue-dialog>
```

```html
<!-- in your app.vue -->
<portal-target name="dialogs" multiple />
```


## Why another modal/dialog plugin

✅ Accessibility first — Focus trap + keybindings + plus aria-hidden
✅ Fully controlled component
✅ Pure vue, no wrapping.
✅ Simplicity + size


## Inspiration && thanks

- [portal-vue](https://github.com/LinusBorg/portal-vue) from [@LinusBorg](https://github.com/LinusBorg) wich makes escape overflow traps like breeze
- [a11y-dialog (vanilla)](http://edenspiekermann.github.io/a11y-dialog/) from [@HugoGiraudel](https://github.com/HugoGiraudel) to lead the path that ended here
- [vue-a11y-dialog (wrapper around ^)](https://github.com/morkro/vue-a11y-dialog) from [@morkro](https://github.com/morkro) for the motivation to build a pure js alternative to it.