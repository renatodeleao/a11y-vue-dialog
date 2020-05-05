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
        <button :disabled="submitting" @click="fakeSubmit" v-if="!submitted">Submit one</button>
        <button :disabled="submitting" @click="fakeSubmit">Next</button>
        <button v-if="submitted">Close</button>
      
      </DialogExample>

      <button @click="exOpen = !exOpen">Nexted Example</button>
      <DialogExample :open="exOpen" @close="exOpen = false" key="parent">
        <button @click="openNested" :disabled="openingNested">Open nested</button>
        <DialogExample :open="nestedOpen" @close="nestedOpen = false" role="alertdialog" key="nested">
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
    exOpen: false,
    openingNested: false,
    nestedOpen: false,
    isOpen: false,
    showThis: false,
    submitted: false,
    submitting: false
  }),
  methods: {
    fakeSubmit() {
      this.submitting = true

      setTimeout(() => {
        this.submitting = false
        this.submitted = true
      }, 2000)
    },
    openNested() {
      this.openingNested = true
      setTimeout(() => {
        this.nestedOpen = true
        this.openingNested = false
      }, 2000);
    }
  }
}
</script>

<style>
button:focus {
  outline: 2px solid red
}
</style>