/** @type {string} */
const version = require('vue').version || require('vue').default.version

/** @type {boolean} */
export const isVue3 = /^3\./.test(version)

/** @type {object} */
export const UniversalLifecyleNamesMap = {
  beforeCreate: 'beforeCreate',
  created: 'created',
  beforeUpdate: 'beforeUpdate',
  updated: 'updated',
  mounted: 'mounted',
  beforeMount: 'beforeMount',
  mounted: 'mounted',
  beforeUnmount: isVue3 ? 'beforeUnmount' : 'beforeDestroy',
  unmounted: isVue3 ? 'unmounted' : 'destroyed'
}

