## Teleporting 
This component should work with any `portal|teleport` solution. We don't ship one as a dependency because it's not a requirement from a wai-aria guidelines standpoint. That being said, I could not recommend enough the usage of one, to escape common rendering gotchas with dialogs — the overflow trap.

| Package | When |
|---------|------|
| [vue-simple-portal](https://github.com/LinusBorg/vue-simple-portal) | The lightweight (`3kb`) portal package for vue 2. If don't have any other portal solution on your app, this is the way to go |
| [vue-portal](https://github.com/LinusBorg/portal-vue) | From the same creator, more robust than the previous and intended for more advanced usecases than simple dialogs. |

if you already have any of the packages mentioned above or are using a custom solution, see the "usage with portal" chapter for instructions.


## Prevent background scrolling
Before `v0.6.x` the plugin exposed a `preventBackgroundScrolling` boolean prop that basically toggled `overflow:hidden` on body when open/close. It sounds like a reasonable default but: 
- it's very very opinionated. Can actually break custom layouts that don't use `body` as their default scroller element. 
- also it's fairly known that iOS safari doesn't respond to `overflow:hidden` on body so a more powerful js solution is usually required to make it work.

By these reasons i decided to deprecate this default implementation (which are just a few lines that you can add to your custom wrapper anyways), and replaced it with event emits: 

``` vue
<template>
  <a11y-vue-dialog 
    :open="dialogOpen" 
    @close="dialogOpen = false"
    @show="preventScroll(true, $event)"
    @hide="preventScroll(false, $event)"
  >
    <p>This slot content will be rendered wherever the <portal-target> with name 'a11y-vue-dialogs'
      is  located.</p>
  </a11y-vue-dialog>
</template>
```
```js
export default {
  data(){
    return {
      dialogOpen: false
    }
  },
  /**
   * Similar to legacy preventBackgroundScrolling implementation
   * @param {Boolean} prevent - add/remove style body
   * @param {Boolean} hasSiblings - if it's not the only dialog open
   */
  preventScroll(prevent, hasSiblings) {
    if (hasSiblings) return    

    if (prevent) document.body.setProperty('overflow', 'hidden')
    else document.body.removeProperty('overflow')
  }
}
```

So when creating your custom wrapper you can add your own `preventBackgroundScrolling` prop and apply your own custom implementation using events.