### 二叉树和二叉搜索树

一个树结构包含一系列存在父子关系的节点，其顶部叫根节点，有子节点的叫内部节点否则就是外部节点或叶节点。

节点的深度取决于祖先节点的数量，树的高度取决于所有节点深度的最大值。

其基本骨架如下：

```js
function BinarySearchTree() {
  var Node = function(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  };
  var root = null;
  this.insert = function(key) {};
  this.search = function(key) {}; //boolean
  this.remove = function(key) {};
  this.inOrderTraverse = function() {}; //中序遍历
  this.preOrderTraverse = function() {}; //先序遍历
  this.postOrderTraverse = function() {}; //后序遍历
  this.min = function() {};
  this.max = function() {};
}
```

具体实现如下：

```js
this.insert = function(key) {
  //创建新节点实例
  //是否是根节点
  //不是的话插入节点
  var newNode = new Node(key);
  if (root === null) {
    root = newNode;
  } else {
    insertNode(root, newNode);
  }
  //如果小于的话插入左边，左边没值的话直接插入，有的话继续递归查找
  //大于的话插入右边，方式类似
  function insertNode(node, newNode) {
    if (newNode.key < node.key) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        insertNode(node.right, newNode);
      }
    }
  }
};

this.inOrderTraverse = function(callback) {
  //中序遍历是以从最小到最大的顺序访问所有的节点
  inOrderTraverseNode(root, callback);
  function inOrderTraverseNode(node, callback) {
    //只要不是最外层节点就执行遍历
    if (node !== null) {
      //先执行坐边
      inOrderTraverseNode(node.left, callback);
      callback(node.key);
      inOrderTraverseNode(node.right, callback);
    }
  }
};

this.preOrderTraverse = function(callback) {
  //先序遍历是以优先与后代
  preOrderTraverseNode(root, callback);
  function preOrderTraverseNode(node, callback) {
    //只要不是最外层节点就执行遍历
    if (node !== null) {
      //先打印，执行完左边再执行右边
      callback(node.key);
      inOrderTraverseNode(node.left, callback);
      inOrderTraverseNode(node.right, callback);
    }
  }
};
this.postOrderTraverse = function(callback) {
  //后序遍历是以从最大到最小的顺序访问所有的节点
  postOrderTraversNode(root, callback);
  function postOrderTraversNode() {
    if (root !== null) {
      //先执行右边
      inOrderTraverseNode(node.left, callback);
      inOrderTraverseNode(node.right, callback);
      callback(node.key);
    }
  }
};

this.min = function() {
  return minNode(root);
  function minNode() {
    if (node) {
      while (node && node.left !== null) {
        node = node.left;
      }
      return node.key;
    }
    return null;
  }
};

this.max = function() {
  return maxNode(root);
  function maxNode() {
    if (node) {
      while (node && node.right !== null) {
        node = node.right;
      }
    }
    return mull;
  }
};

this.search = function(key) {
  return searchNode(root, key);
  function searchNode(node, key) {
    if (node === null) {
      return false;
    }
    if (key < node.key) {
      searchNode(node.left, key);
    } else if (key > node.key) {
      searchNode(node.right, key);
    } else {
      return true;
    }
  }
};

this.remove = function(key) {
  root = removeNode(root, key);
  function removeNode(node, key) {
    if (node === null) {
      return null;
    }
    if (key < node.key) {
      node.left = removeNode(node.left, node);
      return node;
    } else if (key > node.key) {
      node.right = removeNode(node.right, node);
      return node;
    } else {
      //一个叶节点
      if (node.left === null && node.right === null) {
        node = null;
        return node;
      }
      //只有一个子节点
      if (node.left === null) {
        node = node.right;
        return node;
      } else if (node.right === null) {
        node = node.left;
        return node;
      }
      //有两个字节点
      var aux = findMinNode(node.right);
      node.key = aux.key;
      node.right = removeNode(node.right, aux.key);
      return node;
    }
  }
};
```
