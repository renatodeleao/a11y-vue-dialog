## Install
```bash
npm i a11y-vue-dialog

# or

yarn add a11y-vue-dialog
```

```js
// portal vue is installed as dependency, and it's required
import PortalVue from "portal-vue";
Vue.use(PortalVue);

// add the component
import A11yVueDialog from "a11y-vue-dialog";
// if you want to register globally
Vue.use(A11yVueDialog);
```
::: tip
If your wondering why we use portal-vue [check here](/guide/portal-vue.md)
:::

## Usage

``` vue
<template>
  <div>
  <button @click="dialogOpen = true">Open Dialog</button>
  <a11y-vue-dialog :open="dialogOpen" @close="dialogOpen = false">
    <p>This slot content will be rendered wherever the <portal-target> with name 'a11y-vue-dialogs'
      is  located.</p>
  </a11y-vue-dialog>
  </div>
</template>
```
```js
export default {
  data(){
    return {
      dialogOpen: false
    }
  }
}
```

```html
<portal-target name="a11y-vue-dialogs" multiple />
```

::: tip
Both component name, portal-target can be costumized, see more in the next section
:::


Voilá :tada: