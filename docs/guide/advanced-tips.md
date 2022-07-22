## Teleporting 
This component should work with any `portal|teleport` solution. We don't ship one as a dependency because it's not a requirement from a wai-aria guidelines standpoint. That being said, I could not recommend enough the usage of one, to escape common rendering gotchas with dialogs — the overflow trap.

| Package | When |
|---------|------|
| [vue-simple-portal](https://github.com/LinusBorg/vue-simple-portal) | The lightweight (`3kb`) portal package for vue 2. If don't have any other portal solution on your app, this is the way to go |
| [vue-portal](https://github.com/LinusBorg/portal-vue) | From the same creator, more robust than the previous and intended for more advanced usecases than simple dialogs. |

if you already have any of the packages mentioned above or are using a custom solution, see the "usage with portal" chapter for instructions.

### Usage with `vue-simple-portal`

This demo uses [vue-simple-portal](https://github.com/LinusBorg/vue-simple-portal#transitions), but it would be more or less the same with any `portal` solution

```vue
<template>
  <portal v-if="open">
    <a11y-dialog>
      <!-- your implementation like above -->
    </a11y-dialog>
  </portal>
</template>

<script>
import { Portal } from '@linusborg/vue-simple-portal'

export default {
  components: { Portal, A11yDialog }
}
</script>
```

### Combine with `<transition>`


>When you use a `<transition>` as the root element of the portal and then remove the portal (i.e. with v-if) or set its disabled prop to true, no leave transition will happen.
>While this is to expected, as the same thing would happen if you removed a div that contains a `<transition>`, it often trips people up, which is why it's mentioned here.
> — [vue-simple-portal](https://github.com/LinusBorg/vue-simple-portal#transitions)

_if you really need to apply the `v-if` to portal, check the example in the link above_

But based on the info above, this also works fine: 

```vue
<template>
  <portal>
    <!-- 
      [1] note the v-if is applied to transition not portal.
          could also be applied to the component itself
    -->
    <transition name="fade" appear v-if="open">
      <a11y-dialog 
        :open="open"
        v-bind="$attrs"
        v-on="$listeners"
        #default="slotProps"
      >
        <!-- your implementation -->
      </a11y-dialog>
    </transition>
  </portal>
</template>
```

## Prevent background scrolling
Before `v0.6.x` the plugin exposed a `preventBackgroundScrolling` boolean prop that basically toggled `overflow:hidden` on body when open/close. It sounds like a reasonable default but: 
- it's very very opinionated. Can actually break custom layouts that don't use `body` as their default scroller element. 
- also it's fairly known that iOS safari doesn't respond to `overflow:hidden` on body so a more powerful js solution is usually required to make it work.

By these reasons i decided to deprecate this default implementation (which are just a few lines that you can add to your custom wrapper anyways), and replaced it with event emits: 

``` vue
<template>
  <a11y-dialog 
    :open="dialogOpen" 
    @close="dialogOpen = false"
    @show="preventScroll(true, $event)"
    @hide="preventScroll(false, $event)"
  >
    <p>This slot content will be rendered wherever the <portal-target> with name 'a11y-dialogs'
      is  located.</p>
  </a11y-dialog>
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