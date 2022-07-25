<template>
  <div id="playground">
    <main id="main">
      <button @click="basicDialog = true">Open basic Dialog</button>
      <button @click="isOpen = !isOpen">Default</button>
      <button style="visibility: hidden">Default</button>

      <BasicDialog
        :open="basicDialog"
        @close="basicDialog = false"
        @confirm="basicDialog = false"
      >
        <template v-slot:title>
          Your markup,
          <strong>your rules</strong>
        </template>
        <template v-slot:default>
          Are you sure you want to be overriding CSS or pass a thousand props
          again?
        </template>
      </BasicDialog>

      <DialogExample
        :open="isOpen"
        @close="isOpen = false"
        key="lonely"
        #default="{ focusRef }"
      >
        <div v-if="submit2" style="margin-bottom: 20px">
          <button disabled>prev</button>
          <button disabled>other prev</button>
          <button>Me</button>
          <a href="#asd">I'm prev</a>
          <button>Last preve</button>
        </div>
        <button @click="asyncAction2" :disabled="submitting2" v-if="!submit2">
          Remove me: prefix content
        </button>

        <button :disabled="last">Simpaty prev disabled</button>
        <button @click="last = true" :disabled="last">
          I tur me and sibling disabled
        </button>
        <button v-if="!last">Simpaty disabled</button>

        <button @click="asyncAction" :disabled="submitting" v-if="!submit">
          Remove Me on submit
        </button>
        <div v-if="submit" style="margin-top: 20px">
          <button disabled>I'm nex</button>
          <button disabled>other</button>
          <button>Me</button>
          <a href="#asd" v-bind="focusRef.props">I'm next ref</a>
          <button>Last</button>
        </div>
      </DialogExample>

      <button @click="exOpen = !exOpen">Nested Example</button>
      <DialogExample
        :open="exOpen"
        @close="exOpen = false"
        key="parent"
        @show="preventBodyScroll(true, $event)"
        @hide="preventBodyScroll(false, $event)"
        :use-simple-portal="true"
      >
        <button @click="exOpenTwo = !exOpenTwo">Open nested</button>
        <DialogExample
          :open="exOpenTwo"
          @close="exOpenTwo = false"
          role="alertdialog"
          key="nested"
          :use-simple-portal="true"
          @show="preventBodyScroll(true, $event)"
          @hide="preventBodyScroll(false, $event)"
        >
          <h3>
            This wont' on backdrop click since it's an alertdialog, and backdrop
            is outside dialog
          </h3>
        </DialogExample>
      </DialogExample>

      <h1>{{ "make it scroll".repeat(100) }}</h1>

      <button @click="showDialog('preventScroll')">Nexted Example</button>
      <DialogExample
        :open="examples.preventScroll"
        @close="closeDialog('preventScroll')"
        @show="preventBodyScroll(true, $event)"
        @hide="preventBodyScroll(false, $event)"
      >
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate,
        velit?
      </DialogExample>

      <button @click="showDialog('useSimplePortal')">Use simple portal</button>
      <DialogExample
        :open="examples.useSimplePortal"
        :use-simple-portal="true"
        @close="closeDialog('useSimplePortal')"
      >
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate,
        velit?
      </DialogExample>

      <button @click="showDialog('useSimplePortalNested')">
        Use simple portal with nest
      </button>
      <DialogExample
        :open="examples.useSimplePortalNested"
        :use-simple-portal="true"
        @close="closeDialog('useSimplePortalNested')"
      >
        qweqexw
        <button @click="showDialog('useSimplePortalNestedChild')">
          Open nested
        </button>
        <DialogExample
          :open="examples.useSimplePortalNestedChild"
          @close="closeDialog('useSimplePortalNestedChild')"
          role="alertdialog"
          key="nested"
          :use-simple-portal="true"
        >
          <h3>
            This wont' on backdrop click since it's an alertdialog, and backdrop
            is outside dialog
          </h3>
        </DialogExample>
      </DialogExample>

      <h1>{{ "make it scroll".repeat(100) }}</h1>
    </main>

    <!-- render at end of root -->
    <portal-target name="a11y-dialogs" multiple />
    <div id="a11y-dialogs" />
  </div>
</template>

<script>
/** eslint-disable */
import "focus-visible";
import { PortalTarget } from "portal-vue";
import DialogExample from "./components/DialogExample.vue";
import BasicDialog from "./components/BasicDialog.vue";

export default {
  name: "Playground",
  components: {
    BasicDialog,
    DialogExample,
    PortalTarget,
    // A11yDialog
  },
  data: () => ({
    basicDialog: false,
    last: false,
    exOpen: false,
    exOpenTwo: false,
    isOpen: false,
    showThis: false,
    submit: false,
    submitting: false,
    submit2: false,
    submitting2: false,
    examples: {
      preventScroll: false,
      useSimplePortal: false,
      useSimplePortalNested: false,
      useSimplePortalNestedChild: false,
    },
  }),
  methods: {
    asyncAction() {
      this.submitting = true;

      setTimeout(() => {
        this.submitting = false;
        this.submit = true;
      }, 2000);
    },
    asyncAction2() {
      this.submitting2 = true;

      setTimeout(() => {
        this.submitting2 = false;
        this.submit2 = true;
      }, 2000);
    },
    showDialog(key) {
      this.$set(this.examples, key, true);
    },
    closeDialog(key) {
      this.$set(this.examples, key, false);
    },

    preventBodyScroll(bool, hasSiblings) {
      if (hasSiblings) return; // do nothing

      bool
        ? (document.body.style.overflow = "hidden")
        : (document.body.style.overflow = "");
    },
  },
};
</script>

<style>
button:focus,
a:focus {
  outline: 2px solid red;
}
</style>
