### 队列

先进先出数据结构，可以利用数组的`shift,unshift`来模拟栈

```js
function Quene() {
  let items = [];
  this.enque = function(item) {
    items.push(item);
  };
  this.deque = function(item) {
    return items.shift();
  };
  this.front = function(item) {
    return items[0];
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
