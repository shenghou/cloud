# Set 集合

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

### set 集合概览

_并集_
新建副本把其他的添加进去

```js
this.union = function(otherSet) {
  var unionSet = new Set();
  var values = this.values();
  for (var i = 0; i < values.length; i++) {
    unionSet.push(values[i]);
  }
  //unionSet = values.map(item => item);
  values = otherSet.values();
  for (var i = 0; i < values.length; i++) {
    unionSet.push(values[i]);
  }
  return unionSet;
};
```

_交集_
新建副本把另外的有的添加进去

```js
this.intersection = function(otherSet) {
  var intersectionSet = new Set();
  var values = this.values();
  for (var i = 0; i < values.lengt; i++) {
    if (otherSet.has(values[i])) {
      intersectionSet.add(values[i]);
    }
  }
  return intersectionSet;
};
```

_差集_
新建副本把另外的没有有的添加进去

```js
this.difference = function(otherSet) {
  var differenceSet = new Set();
  var values = this.values();
  for (var i = 0; i < values.lengt; i++) {
    if (!otherSet.has(values[i])) {
      differenceSet.add(values[i]);
    }
  }
  return differenceSet;
};
```

_子集_
首先判断长度是不是长，在判断元素如果都存在于另一个则是子集，否则不是

```js
this.subset = function(otherSet) {
  if (this.size() > other.size()) {
    return false;
  } else {
    var values = this.values();
    for (var i = 0; i < values.lengt; i++) {
      if (!otherSet.has(values[i])) {
        return fasle;
      }
    }
    return true;
  }
};
```
