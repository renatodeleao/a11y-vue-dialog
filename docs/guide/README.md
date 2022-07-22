---
title: Introduction
---
## Why another modal/dialog plugin

- ✅ Renderless/headless: no assumptions about styles or markup. You have full control.
- ✅ Accessibility first — Focus trap<sup>[1]</sup> keyboard navigation + aria-attributes
- ✅ Fully controlled component
- ✅ Pure vue, no wrapping.
- ✅ Simplicity + size
- 🕸 Nested dialogs ([questionable pattern](https://github.com/edenspiekermann/a11y-dialog#nested-dialogs), not recommended, but possible because [it happens](https://cl.ly/be43f69393f7)) and it's actually in WAI-ARIA [examples](https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html) so...

#### Footnotes
1. Since `v0.5.0` focus trap is powered by the awesome [`focus-trap`](https://github.com/focus-trap/focus-trap) — go and give them some ✨


## Why Not ...?

Because there are a lot of vue dialog/modals out there that treat accessibility as side-effect not a feature. Also most of them ship with preset markup/styles and you can't use your own components markup with them: this makes this package a little bit more verbose to setup, but way more flexible to adapt to almost any scenario.
