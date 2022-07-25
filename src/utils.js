/** @type {string} */
const version = require('vue').version || require('vue').default.version

/** @type {boolean} */
export const isVue3 = /^3\./.test(version)

/** @type {object} */
export const UniversalLifecyleNamesMap = {
  beforeUnmount: isVue3 ? 'beforeUnmount' : 'beforeDestroy',
  unmounted: isVue3 ? 'unmounted' : 'destroyed'
}

/** @type {function} */
export const noop = () => {};

/**
 * poor-mans lodash-like uniqueId. Avoid using internal vue ._uid property.
 */
let idCounter = 0
export function uniqueId() {
  const id = ++idCounter
  return `a11y-dialog-${id}`
}