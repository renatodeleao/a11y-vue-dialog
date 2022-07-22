# Events <Badge text="in-progress" type="warn" />

As any controlled component, `a11y-dialog` uses the props down events up flow to communicate.


### `@close`
After dialog becomes visible
```html
<a11y-dialog :open="dialogOpen" @close="handleClose">
 this goes to the default slots
</a11-vue-dialog>
```

```js
export default {
  data(){
    return {
      dialogOpen: true;
    }
  },
  methods: {
    handleClose(e){
      console.log("I'm going to close this!")
       // Maybe validate a form here
      this.dialogOpen = false;
    }
  }
}
```
### `@show`
When dialog becomes visible
```html
<a11y-dialog :open="dialogOpen" @show="onShow">
this goes to the default slots
</a11-vue-dialog>
```

```js
export default {
  methods: {
    onShow(e, hasSiblings){
      console.log("I'm alive!")
    }
  }
}
```

### `@hide`
When dialog becomes visible
```html
<a11y-dialog :open="dialogOpen" @hide="onHide">
this goes to the default slots
</a11-vue-dialog>
```

```js
export default {
  methods: {
    onHide(e, hasSiblings){
      console.log("I'm alive!")
    }
  }
}
```
