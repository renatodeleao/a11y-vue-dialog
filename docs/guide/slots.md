# Slots

### `default`
Use to render the body of the dialog
```html
<a11y-vue-dialog>this goes to the default slots</a11-vue-dialog>
```

### `a11y-vue-dialog-title`
to add text(and html) to the title that lives in dialog header
```html
<a11y-vue-dialog>
  <template slot="a11y-vue-dialog-title">Yei an <strong>html</strong>title</template>
</a11-vue-dialog>
```

### `a11y-vue-dialog-close`
```html
<a11y-vue-dialog>
  <button slot="a11y-vue-dialog-close" class="my-custom-button">Close</button>
</a11-vue-dialog>
```
::: tip
clicks on this slot content always fire the [@close event](/guide/events.md#close)
:::

### `a11y-vue-dialog-footer`
```html
<a11y-vue-dialog>
  <template slot="a11y-vue-dialog-footer">
    <button class="my-custom-button" @click="$emit('close')">Cancel</button>
    <button class="my-custom-button" @click="someAction">Submit</button>
  </template>
</a11-vue-dialog>
```