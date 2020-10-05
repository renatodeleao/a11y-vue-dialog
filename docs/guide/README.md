---
title: Introduction
---
## Why another modal/dialog plugin

- ✅ Accessibility first — Focus trap<sup>[1]</sup> keyboard navigation + aria-attributes
- ✅ Fully controlled component
- ✅ Pure vue, no wrapping.
- ✅ Simplicity + size
- 🕸 Nested dialogs ([questionable pattern](https://github.com/edenspiekermann/a11y-dialog#nested-dialogs), not recommended, but possible because [it happens](https://cl.ly/be43f69393f7)) and it's actually in WAI-ARIA [examples](https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html) so...
- 🚧 _renderless version_

#### Footnotes
1. Since `v0.5.0` focus trap is powered by the awesome [`focus-trap`](https://github.com/focus-trap/focus-trap) — go and give them some ✨


## Why Not ...?

My inspiration for this package was accessibility-first. There are a lot of vue dialog/modals out there that treat accessibility as sideeffect not a feature. A11y-vue-dialog provides you an out-of-the-box accessible dialog, with just enought functionallity to get you running in seconds, and just enough props and events to make it adaptable to any usecase.

There are a lot of dialog/modal plugins out there, if your looking for a fully fledged plugin, theres a list in the thanks you section that might help :)
