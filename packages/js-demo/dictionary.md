# 字典

字典和集合相似，都是表示一组互不相同的元素，集合以【值，值】的形式存储元素，字典是以【键，值】的形式来存储元素，字典也称为映射 map

基本骨架如下

```js
function Dictionary() {
  var items = {};
  this.set = function(key, value) {};
  this.remove = function(key) {};
  this.has = function(key) {};
  this.get = function(key) {};
  this.clear = function() {};
  this.size = function() {};
  this.keys = function() {};
  this.values = function() {};
}
```

其具体实现方法如下

```js
this.has = function(key) {
  return key in items;
};
this.set = function(key, values) {
  items[key] = value;
};
this.remove = function(key) {
  if (this.has(key)) {
    delete items[key];
    return true;
  }
  return false;
};
this.get = function(key) {
  return this.has(key) ? items[key] : undefined;
};
this.values = function() {
  var values = [];
  for (var k in itmes) {
    if (this.has(key)) {
      values.push(items[k]);
    }
  }
  return values;
};
this.clear = function() {
  items = {};
};
this.size = function() {
  return Object.keys(items).length;
};
this.keys = function() {
  return Object.keys(items);
};
this.getItems = function() {
  return items;
};
```
