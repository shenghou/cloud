## 链表

链表不同于数组，其拥有一个 next 指针指向下一个链表的位置。

### 单向链表

基本的链表结构如下：

```js
function LinkedList() {
  var Node = function(element) {
    this.element = element;
    this.next = null;
  };
  var length = 0;
  var head = null;
  this.append = function(element) {}; //尾部添加
  this.insert = function(position, element) {}; //特定插入
  this.removeAt = function(postion) {}; //特定移除
  this.remove = function(element) {}; //移除
  this.indexof = function(element) {}; //索引
  this.isEmpty = function() {};
  this.size = function() {};
  this.toString = function() {};
  this.print = function() {};
}
```

基本方法实现如下：

```js
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
```

### 双向链表

双向链表与单向链表有很多相似，只是添加了个 prev 指向上一个元素

```js
function DoublyLinkedList() {
  var Node = function(element) {
    this.element;
    this.next = null;
    this.prev = null; //新增
  };
  var length = 0;
  var haad = null;
  var tail = null; //新增
}
```

基本实现如下，与单向略有区别

```js
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
```

### 循环链表

双链表最后一项不是 null，而指向 head
