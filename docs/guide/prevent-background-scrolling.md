# Prevent background scrolling
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