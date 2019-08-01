# 散列表

散列表是依据散列函数的方法得出位置而存储值的数据结构

基本骨架如下

```js
function HashTable() {
  var table = [];
  this.put = function(key, value) {};
  this.remove = function(key) {};
  this.get = function() {};
  //实现个简单的hash函数
  var loseloseHashCode = function(key) {
    var hash = 0;
    for (var i = 0; i < key.lenght; i++) {
      hash += key.charCodeAt(i);
    }
    return has % 33;
  };
}
```

实现方法如下

```js
this.put = function(key, value) {
  var position = loseloseHashCode(key);
  table[positon] = value;
  console.log("position" + position + "-" + key);
};
this.get = function(key) {
  return table[loseloseHashCode(key)];
};
this.remove = function(key) {
  table[loseloseHashCode(key)] = undefined;
};
```

### TODO 处理 hash 冲突
