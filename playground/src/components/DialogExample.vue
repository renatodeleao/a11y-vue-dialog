<template>
  <a11y-vue-dialog-renderless
    v-bind="$props"
    v-on="$listeners"
    #default="{ open, backdropRef, dialogRef, titleRef, closeRef, focusRef }"
  >
    <portal to="a11y-vue-dialogs">
      <transition name="fade" mode="out-in" appear>
        <div class="d" v-bind="backdropRef.props" v-on="backdropRef.listeners" v-if="open">
          <div class="d__inner" v-bind="dialogRef.props" v-on="dialogRef.listeners">
            <header>
              <h1 v-bind="titleRef.props">Title</h1>
              <button
                v-bind="closeRef.props"
                v-on="closeRef.listeners"
              >x
              </button>
            </header>

            <section>
              <h2>Content</h2>
              <!-- still focus the input since it ignore invalid -->
              <div autofocus="autofocus">
                <input type="text" autofocus placeholder="test" />
              </div>
              <button @click="innerTest = !innerTest">Show this</button>
              <div v-if="innerTest">
                with dynamic <a href="#asda">focusable elements</a> to check if the focus trap is still working
              </div>
              <slot v-bind="{ focusRef }"/>
            </section>
          </div>
        </div>
      </transition>
    </portal>
  </a11y-vue-dialog-renderless>
</template>

<script>
import { A11yVueDialogRenderless } from '../../../src/index'
import { Portal } from "portal-vue";

export default {
  name: 'DialogExample',
  components: {
    A11yVueDialogRenderless,
    Portal
  },
  extends: {A11yVueDialogRenderless},
  props: ['open', 'role'],
  data: () => ({
    innerTest: false
  })
}
</script>

<style lang="scss">
.d {
  position: fixed;
  top:0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  place-items: center;
  place-content: center;
}

.d__inner {
  background: white;
  padding: 20px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>