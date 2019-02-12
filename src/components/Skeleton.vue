<template>
	<component :is="tag" :class="classList" v-on="$listeners">
    <slot name="outisde-skeleton-elements" />
		<div class="o-skeleton__tip" v-if="$slots['skeleton-head']"><slot name="skeleton-head" /></div>
		<div class="o-skeleton__body"><slot /></div>
		<div class="o-skeleton__tip" v-if="$slots['skeleton-feet']"><slot name="skeleton-feet" /></div>
	</component>
</template>

<script>
const MODES = [false, true, 'auto'];

export default {
  name: "Skeleton",
  props: {
    scrollable: {
      type: [Boolean, String],
      default: false,
      validator: (v) => MODES.indexOf(v) > -1
    },
    tag: {
      type: String,
      default: "div"
    }
  },
  computed: {
    scrollableClass(){
      return this.scrollable
        ? (this.scrollable === "auto"
          ? 'o-skeleton--scrollable-auto'
          : 'o-skeleton--scrollable' )
        : null
    },
    classList(){
      return [
        'o-skeleton',
        {[this.scrollableClass]: this.scrollable}
      ]
    }
  }
};
</script>
