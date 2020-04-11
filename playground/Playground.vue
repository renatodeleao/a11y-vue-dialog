<template>
  <div id="playground">
    <main id="main">
      <button @click="isOpen = !isOpen">Default</button>
      <DialogExample :open="isOpen" @close="isOpen = false"  />

      <button @click="exOpen = !exOpen">Nexted Example</button>
      <DialogExample :open="exOpen" @close="exOpen = false">
        <button @click="exOpenTwo = !exOpenTwo">Open nested</button>
        <DialogExample :open="exOpenTwo" @close="exOpenTwo = false" role="alertdialog">
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
    showThis: false
  })
}
</script>

<style>
button:focus {
  outline: 2px solid red
}
</style>