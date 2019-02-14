# Advanced usage
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