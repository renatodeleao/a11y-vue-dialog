## Install
```bash
npm i a11y-vue-dialog

# or

yarn add a11y-vue-dialog
```

## Usage
### Locally (recommended)

A renderless/headless component provides all the functionality required to build a proper `Dialog`, but gives zero f*cks about your markup and styles. As such you have full control over it and have to DYI. Here's a basic example on how to do it:

```vue
<!-- AppBaseDialog.vue -->
<template>
  <a11y-vue-dialog-renderless 
    v-bind="$attrs" 
    v-on="$listeners"
    v-slot:default="{ titleRef, closeRef }"
  > 
    <!-- Bindings do the accessibility attributes for you -->
    <h1 v-bind="titleRef.props">{{ title }}</h1>
    <button v-bind="closeRef.props" v-on="closeRef.listeners">
    ...
    <slot />
  </a11y-vue-dialog>
</template>

<script>
import { A11yVueDialogRenderless } from 'a11y-vue-dialog'

export default {
  name: 'AppBaseDialog',
  components: { A11yVueDialogRenderless },
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
    >
      My markup, my rules.
    </app-base-dialog>
  </div>
</template>
```

Voilá, checkout a [working example on CodeSandbox](https://codesandbox.io/s/renderless-a11y-vue-dialog-q5lqk?file=/src/components/DialogConfirm.vue).

### Globally
It's not very useful, because you don't want to render the raw version without composing it with your markup and styles in order to show it to users. But if you prefer:

```js
import Plugin from "a11y-vue-dialog";

// if you want to register globally
Vue.use(Plugin);
// exposes a component name <a11y-vue-dialog> by default, but configurable
```
