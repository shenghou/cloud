### 栈

后进先出结构，可以利用数组的`pop,push`来模拟栈

```js
function Stack() {
  let items = [];
  this.push = function(item) {
    items.push(item);
  };
  this.pop = function(item) {
    return items.pop(item);
  };
  this.peek = function(item) {
    return items[items.length - 1];
  };
  this.isEmpty = function(item) {
    return items.length === 0;
  };
  this.size = function(item) {
    return items.length;
  };
  this.clear = function(item) {
    items = [];
  };
  this.print = function(item) {
    console.log(items.toString());
  };
}
```
