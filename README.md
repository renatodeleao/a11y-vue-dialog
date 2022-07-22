## Why another modal/dialog plugin

- ✅ Renderless/headless: no assumptions about styles or markup. You have full control.
- ✅ Accessibility first — Focus trap<sup>[1]</sup> + keyboard navigation + aria-attributes
- ✅ Fully controlled component
- ✅ Pure vue, no wrapping.
- ✅ Simplicity + size
- 🕸 Nested dialogs ([questionable pattern](https://github.com/edenspiekermann/a11y-dialog#nested-dialogs), not recommended, but possible because [it happens](https://cl.ly/be43f69393f7)) and it's actually in WAI-ARIA [examples](https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html) so...

Detailed documentation and additional info is available [at documentation site](https://renatodeleao.github.io/a11y-vue-dialog/)

## Install

```
npm i a11y-vue-dialog

# or

yarn add a11y-dialog 
```

## Usage

A renderless/headless component provides all the functionality required to build a proper `Dialog`, but gives zero f*cks about your markup and styles. As such you have full control over it and have to DYI. Here's a basic example on how to do it:

```vue
<!-- AppBaseDialog.vue -->
<template>
  <a11y-dialog 
    v-bind="$attrs" 
    v-on="$listeners"
    v-slot:default="{ titleRef, closeRef }"
  > 
    <!-- Bindings do the accessibility attributes for you -->
    <h1 v-bind="titleRef.props">{{ title }}</h1>
    <button v-bind="closeRef.props" v-on="closeRef.listeners">
    ...
    <slot />
  </a11y-dialog>
</template>

<script>
import { A11yDialog } from 'a11y-dialog'

export default {
  name: 'AppBaseDialog',
  components: { A11yDialog },
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
```
```vue
<!-- At any View.vue, after import AppBaseDialog -->
<template>
  <div id="page">
    <button @click="isDialogOpen = true">
    <app-base-dialog
      title="Hello world"
      :open="isDialogOpen" 
      @close="openMyModal = false" 
      @confirm="handSubmit"
    >
      My markup, my rules.
    </app-base-dialog>
  </div>
</template>
```

Voilá, checkout a [working example on CodeSandbox](https://codesandbox.io/s/renderless-a11y-vue-dialog-q5lqk?file=/src/components/DialogConfirm.vue).

### Teleporting outside of document flow
This component should work with any `portal|teleport` solution. We don't ship one as a dependency because it's not a requirement from a wai-aria guidelines standpoint. That being said, I could not recommend enough the usage of one, to escape common rendering gotchas with dialogs — the overflow trap.

| Package | When |
|---------|------|
| [vue-simple-portal](https://github.com/LinusBorg/vue-simple-portal) | The lightweight (`3kb`) portal package for vue 2. If don't have any other portal solution on your app, this is the way to go |
| [vue-portal](https://github.com/LinusBorg/portal-vue) | From the same creator, more robust than the previous and intended for more advanced usecases than simple dialogs. |

if you already have any of the packages mentioned above or are using a custom solution, see the "usage with portal" chapter for instructions.

## Configuration
### Props
| Prop                   | type        | default  | desc |
| -----------------------| ------------| ---------| ---- |
| open                   | Boolean     | false    | control's dialog visibility
| role                   | String      | 'dialog' | values: 'dialog|alertdialog'. Accessibilty attribute for possible usage as a modal, if "alertdialog" will not close on backdrop click if a backdrop is used. 
| contentRoot            | String|Null | null     |  accessibilty attribute: hide content from screen readers
| focusTrapCreateOptions | Object      | {}       | `focus-trap` package configuration object — https://github.com/focus-trap/focus-trap#usage

### Default Slot Props
The default `scopedSlot` props help you bind the accessibility attributes and event listeners to your markup elements, but semantics and styling layer it's now your (the consumer)responsibility.

> Each `ref` suffixed slotProp is an object that contains a "props" and "listeners" keys to be attached to elements via `v-bind` and `v-on` respectively

| slotProp    | type     | desc
| ------------| -------- | ---- |
| closeFn     | Function | method forwarding for closing the dialog   
| backdropRef | Object   | for the backdrop element
| dialogRef   | Object   | for the main dialog element
| closeRef    | Object   | for attaching close buttons/actions
| titleRef    | Object   | For attaching dialog title, accessibility 
| focusRef    | Object   | For cherry-picking the first focusable element on open

### A complete example
```vue
<!-- compose into you own markup, MyDialog.vue -->
<template>
  <a11y-dialog 
    v-bind="$attrs"
    v-bind="$listeners"
    #default="{ closeFn, backdropRef, dialogRef, titleRef, closeRef, focusRef }"
  >
    <div class="your-class" 
      v-bind="backdropRef.props" 
      v-on="backdropRef.listeners"
    >
      <div 
        class="your-class__element" 
        v-bind="dialogRef.props" 
        v-on="dialogRef.listeners"
      >
        <h1 v-bind="titleRef.props">Title</h1> 
        <button 
          v-bind="closeRef.props" 
          v-on="closeRef.listeners"
        >
          x
        </button>
        <section>
          <!-- autofocus would also work on this case, but not every focusable element supports it -->
          <input 
            type="text" 
            placeholder="I will get focused first because i'm the focus ref" 
            v-bind="focusRef.props"
          />
          <slot />
        </section>
        <footer>
          <button @click="closeFn">Cancel</button>
          <button @click="emit('confirm')">Confirm</button>
        </footer>
      </div>
    </div>
  </a11y-dialog>
</template>

<script>
import { A11yDialog } from "a11y-vue-dialog";

export default {
  name: 'AppDialog',
  components: { A11yDialog },
}
</script>
```

```vue
<!-- page.vue -->
<template>
  <div id="page">
    <button @click="isDialogOpen = true">
    <app-dialog
      :open="isDialogOpen" 
      @close="isDialogOpen = false" 
      @confirm="handleSubmit"
    />
      My markup, my rules.
    </app-dialog>
  </div>
</template>
```

- Checkout [this example](https://github.com/edenspiekermann/a11y-dialog#expected-dom-structure) for what's the minimum expected markup for an accessible dialog


## Advanced Usage
### Usage with `Portal`

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
### Usage with `<transition>`
> When you use a `<transition>` as the root element of the portal and then remove the portal (i.e. with v-if) or set its disabled prop to true, no leave transition will happen.
> While this is to expected, as the same thing would happen if you removed a div that contains a <transition>, it often trips people up, which is why it's mentioned here.
> [vue-simple-portal](https://github.com/LinusBorg/vue-simple-portal#transitions)

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
        v-bind="$attrs"
        v-bind="$listeners"
        #default="slotProps"
      >
        <!-- your implementation -->
      </a11y-dialog>
    </transition>
  </portal>
</template>
```

## Play

A playground is used to test the component locally. It uses [`vue/cli` instant prototyping feature](https://cli.vuejs.org/guide/prototyping.html), so the downside is that you have to install it globally. 

- Clone this repo
- `yarn install`
- Then, just run `yarn play` 

## Colophon
Thanks to all this packages for inspiration and guidance.

#### Dependencies

1. Since `v0.5.0` focus trap is powered by the awesome [`focus-trap`](https://github.com/focus-trap/focus-trap) — go and give them some ✨

#### Acknowledgements
- `portal-vue|vue-simple-portal` from [@LinusBorg](https://github.com/LinusBorg) which makes escaping overflow traps easy peasy
- a11y-dialog (vanilla) from @KittyGiraudel to lead the path that ended here
- vue-a11y-dialog (wrapper around ^) from @morkro for the motivation to build a pure vue alternative to it.
- vue-js-dialog a fully fledge massive dialog

## License
MIT © Renato de Leão
