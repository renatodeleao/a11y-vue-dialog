The default `scopedSlot` exposed props help you bind the accessibility attributes and event listeners to your markup elements, but semantics and styling layer it's now your (the consumer) responsibility.

> Each `ref` suffixed slotProp is an object that contains a "props" and "listeners" keys to be attached to elements via `v-bind` and `v-on` respectively

| slotProp    | type     | desc
| ------------| -------- | ---- |
| closeFn     | Function | method forwarding for closing the dialog   
| rootRef     | Object   | (⚠️required) for the root dialog element
| backdropRef | Object   | for the backdrop element
| dialogRef   | Object   | (⚠️required) for the main dialog element
| closeRef    | Object   | for attaching close buttons/actions
| titleRef    | Object   | For attaching dialog title, accessibility 
| focusRef    | Object   | For cherry-picking the first focusable element on open