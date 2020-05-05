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
        <button style="visibility:hidden">adasd</button>
        <button v-show="submit" :class="{'remove': !submit}" @click="submit = !submit">Remove Me on submit</button>
        <div v-show="!submit" style="margin-top: 20px">
          <button >I'm nex</button>
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
    exOpenTwo: false,
    isOpen: false,
    showThis: false,
    submit: true
  })
}
</script>

<style>
button:focus {
  outline: 2px solid red
}
</style>