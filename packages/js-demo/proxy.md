# proxy

proxy 用来修改某些操作的默认行为，可以理解在目标对象前架设一层`拦截`，对该对象的访问，都必须先通过这次拦截，因此可以对外界的访问进行过滤和改写。

- eg

```js
let origin = {
  a: 5,
  b: 10
};
const handleFuc = {
  get: function(target, thisArg, argumentList) {
    return target;
  },
  set: function(target, thisArg, argumentList) {
    console.log(targe, "thisArg", thisArg);
  },
  has: function(){

  }, 
};
let proxyObj = new Proxy(origin, handleFuc);

```

### jsproxy 的实用例子

- [https://github.com/gergob/jsProxy](https://github.com/gergob/jsProxy)
