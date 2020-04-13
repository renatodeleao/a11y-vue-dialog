## Why another modal/dialog plugin

- ✅ Accessibility first — Focus trap + keyboard navigation + aria-attributes
- ✅ Fully controlled component
- ✅ Pure vue, no wrapping.
- ✅ Simplicity + size
- 🕸 Nested dialogs ([questionable pattern](https://github.com/edenspiekermann/a11y-dialog#nested-dialogs), not recommended, but possible because [it happens](https://cl.ly/be43f69393f7))
- 🚧 _renderless version_

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

## Renderless version
A renderless version provides all the functionality required to build a proper `Dialog`, but gives zero f*cks about your markup and styles. The default `scopedSlot` props help you bind the accessibility attributes and event listeners to your markup elements, but semantics and styling layer it's now the consumer full responsibility.

> Each `ref` suffixed slotProp is an object that contains a "props" and "listeners" keys to be attached to elements via `v-bind` and `v-on` respectively

| slotProp    | type     | desc
| ------------| -------- | ---- |
| open        | Boolean  | prop forwarding for portal v-if   
| close       | Function | method forwarding for closing the dialog   
| backdropRef | Object   | for the backdrop element
| dialogRef   | Object   | for the main dialog element
| closeRef    | Object   | for attaching close buttons/actions
| titleRef    | Object   | For attaching dialog title, accessibility 


### Example
```html
<!-- compose into you own markup, MyDialog.vue -->
<template>
  <a11y-vue-dialog-renderless 
    v-bind="$props"
    @close="$emit('close')"
    #default="{ open, closeFn, backdropRef, dialogRef, titleRef, closeRef }"
  >
    <portal to="a11y-vue-dialogs" v-if="open">
      <div class="youclasses" 
        v-bind="backdropRef.props" 
        v-on="backdropRef.listeners"
      >
        <div 
          class="youclasses__element" 
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
            <slot />
          </section>
          <footer>
            <button @click="closeFn">Cancel</button>
            <button @click="emit('confirm')">Confirm</button>
          </footer>
        </div>
      </div>
    </portal>
  </a11y-vue-dialog-renderless>
</template>

<script>
import { A11yVueDialogRenderless } from "a11y-vue-dialog";
import { Portal } from "portal-vue";

export default {
  name: 'MyDialog',
  components: {
    A11yVueDialogRenderless,
    Portal
  },
  extends: { A11yVueDialogRenderless },
  props: ['open', 'role'],
}
<script>
```

### Then re-use and conquer

```html
<!-- page.vue -->
<template>
  <div id="page">

    <button @click="openMyModal = true">
    <my-dialog :
      open="openMyModal" 
      @close="openMyModal = false" 
      @confirm="handSubmit"
    />
      My markup, my rules.
    </my-dialog>
  </div>
</template>
```

Checkout [this example](https://github.com/edenspiekermann/a11y-dialog#expected-dom-structure) for what's the minimum expected markup for an accessible dialog

## Play

A playground is used to test the component locally. It uses [`vue/cli` instant prototyping feature](https://cli.vuejs.org/guide/prototyping.html), so the downside is that you have to install it globally. 

- Then, just run `yarn play` 

## License
MITq