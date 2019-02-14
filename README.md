## Why another modal/dialog plugin

- ✅ Accessibility first — Focus trap + keyboard navigation + aria-attributes
- ✅ Fully controlled component
- ✅ Pure vue, no wrapping.
- ✅ Simplicity + size
- 🕸 Nested dialogs ([questionable pattern](https://github.com/edenspiekermann/a11y-dialog#nested-dialogs), not recommended, but possible because [it happens](https://cl.ly/be43f69393f7))
- 🔜 _renderless version_

Detailed documentation and additional info is available [at documentation site](https://renatodeleao.github.io/a11y-vue-dialog/)

## Install

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
  <p>This slot content will be rendered wherever the <portal-target name="a11y-vue-dialogs">
    is located. (we adivse at the bottom of your root component)</p>
</a11y-vue-dialog>
```

```html
<portal-target name="a11y-vue-dialogs" multiple />
```


## License
MIT