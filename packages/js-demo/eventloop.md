### 事件轮询

宏任务： script setTimeout setInterval
微任务： promise.then process.nextTick

```js
console.log("1");
setTimeout(function() {
  console.log("2");
  process.nextTick(function() {
    console.log("3");
  });
  new Promise(function(resolve) {
    console.log("4");
    resolve();
  }).then(function() {
    console.log("5");
  });
});
process.nextTick(function() {
  console.log("6");
});
new Promise(function(resolve) {
  console.log("7");
  resolve();
}).then(function() {
  console.log("8");
});

setTimeout(function() {
  console.log("9");
  process.nextTick(function() {
    console.log("10");
  });
  new Promise(function(resolve) {
    console.log("11");
    resolve();
  }).then(function() {
    console.log("12");
  });
});
1  7  6  8  2  4  3  5  9  11  10  12
```

第一轮
整体 script 作为第一个宏任务进入主线程，遇到 console.log，输出 1。
遇到 setTimeout，其回调函数被分发到宏任务 Event Queue 中。我们暂且记为 setTimeout1。
遇到 process.nextTick()，其回调函数被分发到微任务 Event Queue 中。我们记为 process1。
遇到 Promise，new Promise 直接执行，输出 7。then 被分发到微任务 Event Queue 中。我们记为 then1。

又遇到了 setTimeout，其回调函数被分发到宏任务 Event Queue 中，我们记为 setTimeout2。
我们发现了 process1 和 then1 两个微任务。
执行 process1,输出 6。
执行 then1，输出 8。

好了，第一轮事件循环正式结束，这一轮的结果是输出 1，7，6，8。那么第二轮时间循环从 setTimeout1 宏任务开始：

首先输出 2。接下来遇到了 process.nextTick()，同样将其分发到微任务 Event Queue 中，记为 process2。new Promise 立即执行输出 4，then 也分发到微任务 Event Queue 中，记为 then2。

第二轮事件循环宏任务结束，我们发现有 process2 和 then2 两个微任务可以执行。
输出 3。
输出 5。
第二轮事件循环结束，第二轮输出 2，4，3，5。
第三轮事件循环开始，此时只剩 setTimeout2 了，执行。
直接输出 9。
将 process.nextTick()分发到微任务 Event Queue 中。记为 process3。
直接执行 new Promise，输出 11。
将 then 分发到微任务 Event Queue 中，记为 then3。

第三轮事件循环宏任务执行结束，执行两个微任务 process3 和 then3。
输出 10。
输出 12。
第三轮事件循环结束，第三轮输出 9，11，10，12。

- 参考[https://juejin.im/post/59e85eebf265da430d571f89#heading-4](https://juejin.im/post/59e85eebf265da430d571f89#heading-4)

### 带 `async await`

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
console.log("script start");
setTimeout(function() {
  console.log("setTimeout");
}, 0);
async1();
new Promise(function(resolve) {
  console.log("promise1");
  resolve();
}).then(function() {
  console.log("promise2");
});
console.log("script end");

"script start"    "async1 start"  "async2"  "promise1"  "script end"  "async1 end" "promise2"  "setTimeout"
```

第一轮
先整体 `script` 打印 `script start`
将 `setTimeout` 放入宏任务队列
调用`async1`打印同步代码 `async1 start`

再执行 `await async2()`
打印同步代码 `async2` 并且返回 `Promise.resolve(undefind)`
`await` 后让出线程，执行 `async` 之外的

执行 new Promise() 打印同步代码 `promise1`
程序运行至 promise.then()，推入至微任务队列
打印同步代码`script end`

此时又回到`await`哪里， 返回值为`Promise.resolve(undefind)`
首先的明白 _如果一个 Promise 被传递给一个 await 操作符，await 将等待 Promise 正常处理完成并返回其处理结果。_ 上面`Promise.resolve(undefind)`就是正常处理的结果，即`async2`就算执行完成

继续执行`async1`打印`async1 end`

最后执行微任务 `promise.then()` 打印`promise2`

- 参考[https://segmentfault.com/a/1190000017224799](https://segmentfault.com/a/1190000017224799)
