<template>
  <div>Hello World</div>
</template>

<script>
const testVar = "test";

export default {
  name: "a11y-vue-dialog",
  methods: {
    test(){
      const a = {a: "a" };
      const b = {b: "b"}
      const c = {...a, ...b, c: testVar};

      const add = (a,b) => {
        return a + b;
      }

      setTimeout(()=> {
        console.log(c);
        add(2,3);
      })

    }
  }
}
</script>

<style lang="postcss">
div {
  color: lime;
  appearance: none;
  display: flex;
  display: grid;
}
</style>


