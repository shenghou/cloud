### 非I/O异步API

* precess.nextTick() 方法
* setImmediate() 方法

`precess.nextTick()`的回调函数保存在一个数组中，每轮循环会全部执行完；
`setImmediate()`的回调函数则是保存在链表中，每轮循环执行一个；