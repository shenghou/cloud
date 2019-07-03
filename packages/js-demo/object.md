### object

```js
//object create
if (!Object.create) {
  Object.create = function(o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}
```

### 对象委托 `Object.create()` 代替传统的 call

```js
var widget = {
  init: function(a) {
    this.a = a;
  },
  insert: function(b) {
    this.b = b;
  }
};
var botton = Object.create(widget);
button.setup = function() {
  this.init();
};
button.onclick = function() {
  this.insert();
};
```
此对象无 `prototype`  没有`valueof`, `toSting`
