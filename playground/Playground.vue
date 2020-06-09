<template>
  <div id="playground">
    <main id="main">
      <button @click="isOpen = !isOpen">Default</button>
      <button style="visibility:hidden">Default</button>
      <DialogExample 
        :open="isOpen" 
        @close="isOpen = false" 
        key="lonely"
        #default="{ focusRef }">
         <div v-if="submit2" style="margin-bottom: 20px">
          <button disabled>prev</button>
          <button disabled>other prev</button>
          <button>Me</button>
          <a href="#asd">I'm prev</a>
          <button>Last preve</button>
        </div>
        <button @click="asyncAction2" :disabled="submitting2" v-if="!submit2">Remove me: prefix content</button>

        <button :disabled="last">Simpaty prev disabled</button>
        <button @click="last = true" :disabled="last">I tur me and sibling disabled</button>
        <button v-if="!last">Simpaty disabled</button>

        <button @click="asyncAction" :disabled="submitting " v-if="!submit">Remove Me on submit</button>
        <div v-if="submit" style="margin-top: 20px">
          <button disabled>I'm nex</button>
          <button disabled>other</button>
          <button>Me</button>
          <a href="#asd" v-bind="focusRef.props">I'm next ref</a>
          <button>Last</button>
        </div>
      </DialogExample>

      <button @click="exOpen = !exOpen">Nexted Example</button>
      <DialogExample :open="exOpen" @close="exOpen = false" key="parent">
        <button @click="exOpenTwo = !exOpenTwo">Open nested</button>
        <DialogExample :open="exOpenTwo" @close="exOpenTwo = false" role="alertdialog" key="nested">
          <h3>This wont' close with escape since it's an alertdialog</h3>
        </DialogExample>
      </DialogExample>
    </main>
    

    <!-- render at end of root -->
    <portal-target name="a11y-vue-dialogs" multiple />
  </div>
</template>

<script>
/** eslint-disable */
import 'focus-visible'
import { PortalTarget } from "portal-vue";
import DialogExample from "./DialogExample";


export default {
  name: "Playground",
  components: {
    DialogExample,
    PortalTarget,
    // A11yVueDialogRenderless
  },
  data: () => ({
    last: false,
    exOpen: false,
    exOpenTwo: false,
    isOpen: false,
    showThis: false,
    submit: false,
    submitting: false,
    submit2: false,
    submitting2: false
  }),
  methods: {
    asyncAction() {
      this.submitting = true

      setTimeout(() => {
        this.submitting = false
        this.submit = true
      }, 2000)
    },
    asyncAction2() {
      this.submitting2 = true

      setTimeout(() => {
        this.submitting2 = false
        this.submit2 = true
      }, 2000)
    }
  }
}
</script>

<style>
button:focus,
a:focus {
  outline: 2px solid red
}
</style>