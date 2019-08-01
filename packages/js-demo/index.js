export const Quene = function() {
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
};

export const Stack = function() {
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
};

export const LinkedList = function() {
  var Node = function(element) {
    this.element = element;
    this.next = null;
  };
  var length = 0;
  var head = null;
  //   this.append = function(element) {}; //尾部添加
  //   this.insert = function(position, element) {}; //特定插入
  //   this.removeAt = function(postion) {}; //特定移除
  //   this.remove = function(element) {}; //移除
  //   this.indexof = function(element) {}; //索引
  this.isEmpty = function() {};
  this.size = function() {};
  this.toString = function() {};
  this.print = function() {};
  this.append = function(element) {
    var node = new Node(element),
      current;
    //当没有的时候就设置为第一个
    if (head === null) {
      head = node;
      //current 从头往后循环，直到找到最后一项，
    } else {
      //设置为一项
      current = head;
      //循环找到最后一项，即此时next为null；
      while (current.next) {
        current = current.next;
      }
      //添加最后一项
      current.next = node;
    }
    length++;
  };
  this.removeAt = function(postion) {
    if (position > -1 && postion < length) {
      //设置当前值为第一个，如果移除第一个就直接把head指向head.next,如果不是第一个就删除指定位置
      var current = head,
        prevoius,
        index = 0;
      //删除头的时候直接把head指向head.next
      if (position === 0) {
        head = current.next;
        //删除其中一项，*需要把前一项的next指到当前项的next*
      } else {
        //循环找到postion项的位置
        while (index++ < postion) {
          previous = current;
          current = current.next;
        }
        //把前一项的next指到当前项的next
        previous.next = current.next;
      }
      length--;
      return current.element;
    } else {
      return null;
    }
  };
  this.insert = function(postion, element) {
    if (position >= 0 && position <= length) {
      //设置当前值为第一个，如果插入第一个则是node.next=head;
      var node = new Node(element),
        current = head,
        previous,
        index = 0;
      //第一个值则head为插入值，node.next = head;
      if (position === 0) {
        node.next = current;
        head = node;
        //插入某个位置的时候， 则previous.next为插入值，node.next为当前值，
      } else {
        //迭代找到current和previous
        while (index++ < position) {
          previous = current;
          current = current.next;
        }
        node.next = current;
        previous.next = node;
      }
    } else {
      return false;
    }
  };
  this.toString = function() {
    var current = head,
      string = "";
    while (current) {
      string = current.element;
      current = current.next;
    }
    return string;
  };
  this.indexof = function() {
    var current = head,
      index = -1;
    while (current) {
      if (element === current.element) {
        return index;
      }
      index++;
      current = current.next;
    }
    return -1;
  };
};

export const DoublyLinkedList = function() {
  var Node = function(element) {
    this.element;
    this.next = null;
    this.prev = null; //新增
  };
  var length = 0;
  var haad = null;
  var tail = null; //新增
  this.insert = function(position, element) {
    //与单向的区别是要控制个prev指针
    if (position >= 0 && position <= length) {
      var node = new Node(element),
        current = head,
        previous,
        index = 0;
      if (position === 0) {
        if (!head) {
          head = node;
          tail = node;
        } else {
          node.next = current;
          current.prev = node;
          head = node;
        }
      } else if (position === length) {
        current = tail;
        current.next = node;
        node.prev = current;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }
        node.next = current;
        previous.next = node;

        current.prev = node;
        node.prev = prevoous;
      }
      length++;
      return true;
    } else {
      return false;
    }
  };
  this.removeAt = function(position) {
    if (position > -1 && position < length) {
      var current = head,
        previous,
        index = 0;
      if (position === 0) {
        head = current.next;
        if (length === 0) {
          tail = null;
        } else {
          head.prev = null;
        }
      } else if (position === length - 1) {
        current = tail;
        tail = current.prev;
        tail.next = null;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }
        previous.next = current.next;
        current.next.prev = previous;
      }
      length--;
      return current.element;
    } else {
      return null;
    }
  };
};

export const Set = function() {
  var items = {};
  //   this.add = function(value) {};
  //   this.remove = function(value) {};
  //   this.has = function(value) {};
  //   this.clear = function() {};
  //   this.size = function() {};
  //   this.values = function() {};
  this.has = function(value) {
    return value in items;
    //对象属性fnagf
    // return items.hasOwnProperty(value);
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
};

export const Dictionary = function() {
  var items = {};
  // this.set = function(key, value) {};
  // this.remove = function(key) {};
  // this.has = function(key) {};
  // this.get = function(key) {};
  // this.clear = function() {};
  // this.size = function() {};
  // this.keys = function() {};
  // this.values = function() {};
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
};

export const HashTable = function() {
  var table = [];
//   this.put = function(key, value) {};
//   this.remove = function(key) {};
//   this.get = function() {};
  //实现个简单的hash函数
  var loseloseHashCode = function(key) {
    var hash = 0;
    for (var i = 0; i < key.lenght; i++) {
      hash += key.charCodeAt(i);
    }
    return has % 33;
  };
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
};
