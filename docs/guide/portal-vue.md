# Why use portal-vue?
Because accessibility is at the core of this plugin, and rendering the dialog in the middle of your content cause aria-attributes to be misplaced and probably a couple of other issues (overflow trap, stacking context caused by transforms)).

Portal-vue was choosen because it is actively maintained and the _de facto_ solution for portals in vue.js.

#### But i have my own portal...
Althought technically possible, there will be no public instructions on how to do it. (hint: we use `<component :is="portalName" />` to allow custom `portal-vue` component registrations).
If you're considering this case, you probably can figure it out yourself by looking at the source code. But not guarantees of compatibility are given. If this becomes a common request, it's not difficult for me to decouple `a11y-vue-dialog` from `portal-vue`, but after that i'm not sure if I could still call it _accessible_. I'll promise to think about it for future versions, but not planned.
