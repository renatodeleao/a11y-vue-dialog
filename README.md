## Why another modal/dialog plugin

- ✅ Universal: works in `vue@2` and `vue@3` 🚧
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

Voilá, checkout a [working example on CodeSandbox](https://codesandbox.io/s/renderless-a11y-vue-dialog-demo-0-8-0-beta-1-3igsm9).


## Docs

Detailed documentation and additional info is available [at documentation site](https://renatodeleao.github.io/a11y-vue-dialog/)

## Play

A playground is used to test the component locally. It uses [`vue/cli` instant prototyping feature](https://cli.vuejs.org/guide/prototyping.html), so the downside is that you have to install it globally. 

- Clone this repo
- `yarn install`
- Then, just run `yarn play` 

## Colophon
Thanks to all this packages for inspiration and guidance.

- `portal-vue|vue-simple-portal` from [@LinusBorg](https://github.com/LinusBorg) which makes escaping overflow traps easy peasy
- `a11y-dialog` (vanilla) from `@KittyGiraudel` to lead the path that ended here
- `vue-a11y-dialog` (wrapper around ^) from `@morkro` for the motivation to build a pure vue alternative to it.
- All build tools used to make this a reality!
## License
MIT © Renato de Leão
