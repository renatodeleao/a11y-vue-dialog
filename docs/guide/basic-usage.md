## Install
```bash
npm i a11y-vue-dialog

# or

yarn add a11y-vue-dialog
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
import { A11yDialog } from 'a11y-vue-dialog'

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
    >
      My markup, my rules.
    </app-base-dialog>
  </div>
</template>
```

Voilá, checkout a [working example on CodeSandbox](https://codesandbox.io/s/renderless-a11y-vue-dialog-demo-0-8-0-beta-1-3igsm9).
