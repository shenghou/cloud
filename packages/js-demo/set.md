## Set 集合

由一组无序且唯一的项组成。

基本骨架如下；

```js
function Set() {
  var items = {};
  this.add = function(value) {};
  this.remove = function(value) {};
  this.has = function(value) {};
  this.clear = function() {};
  this.size = function() {};
  this.values = function() {};
}
```

实现方法如下

```js
this.has = function(value) {
  return value in items;
  //对象属性fnagf
  return items.hasOwnProperty(value);
};
this.add = function(value) {
  //由于唯一性所以需判断是否存在
  if (!this.has(value)) {
    items[value] = value;
    return true;
  }
  return false;
};
this.remove = function(value) {
  if (this.has(value)) {
    delete items[value];
    return true;
  }
  return false;
};
this.clear = function() {
  items = {};
};
this.size = function() {
  //es5+
  return Object.keys(items).length;
  //any
  var count = 0;
  for (var prop in items) {
    if (items.hasOwnProperty(prop)) {
      ++count;
    }
  }
  return count;
};
this.values = function() {
  //return array
  return Object.keys(items);
  //any
  var keys = [];
  for (var key in items) {
    keys.push(key);
  }
  return keys;
};
```
