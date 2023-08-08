<template>
  <a11y-dialog
    v-bind="$attrs"
    v-on="$listeners"
    #default="{
      open,
      rootRef,
      closeFn,
      backdropRef,
      dialogRef,
      titleRef,
      closeRef,
    }"
  >
    <portal to="a11y-vue-dialogs">
      <div class="dialog" v-bind="rootRef.props" v-if="open">
        <div
          class="dialog__backdrop"
          v-bind="backdropRef.props"
          v-on="backdropRef.listeners"
        />
        <div
          class="dialog__inner"
          v-bind="dialogRef.props"
          v-on="dialogRef.listeners"
        >
          <header class="dialog__header">
            <h1 v-bind="titleRef.props">
              <slot name="title" />
            </h1>
            <button v-bind="closeRef.props" v-on="closeRef.listeners">x</button>
          </header>
          <section class="dialog__body">
            <slot />
          </section>
          <footer class="dialog__footer">
            <button @click="closeFn" class="btn btn-danger">Cancel</button>
            <button
              class="btn btn-sucess"
              @click="$emit('confirm', { life: 42 })"
            >
              Confirm
            </button>
          </footer>
        </div>
      </div>
    </portal>
  </a11y-dialog>
</template>

<script>
import { A11yDialog } from "../../../src/index";
import { Portal } from "@linusborg/vue-simple-portal";
export default {
  name: "BasicDialog",
  components: {
    A11yDialog,
    Portal,
  },
  props: {
    title: {
      type: String,
    },
  },
};
</script>

<style lang="scss">
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  place-items: center;
  place-content: center;
  text-align: left;
}

.dialog__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.dialog__inner {
  position: relative;
  background: white;
  max-width: 400px;
}

.dialog__header,
.dialog__body,
.dialog__footer {
  padding: 10px 20px;
}

.dialog__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid whitesmoke;

  h1 {
    font-size: 20px;
    margin-right: 20px;
    margin-bottom: 0px;
    margin-top: 0px;
  }
}

.dialog__body {
  padding: 30px 20px;
}

.dialog__footer {
  display: flex;
  justify-content: flex-end;
  background-color: whitesmoke;
}

.btn-sucess {
  background-color: lime;
}
</style>
