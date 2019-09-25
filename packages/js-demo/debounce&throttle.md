# debounce & throttle

### debounce 防抖

当持续触发时，合并事件且不会触发，一定时间内没触发才真正触发事件。

```js
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this;
    let arg = arguments;
    if (timeout) {
      clearTimeout(timeout);
    }
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(function() {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(function() {
        func.apply(context.args);
      }, wait);
    }
  };
}
```

### throttle 节流

定时触发

```js
    function throttle(func, wait, type) {
        if(type ===1){
            let previous = 0;
        }else if(type ===2) {
            let timeout;
        }
        return function() {
            let context = this;
            let arg = arguments;
            if(type ====1) {
                let now = Date.now();
                if(now - previous > wait) {
                    func.apply(context, arg)
                    previous = now;
                }
            }else if(type ===2){
                if(!timeout ){
                    timeout = setTimeout(function() {
                        timeout = null;
                        func.apply(context, args)
                    },wait)
                }
            }
        }
    }
```

[https://juejin.im/post/5b8de829f265da43623c4261](https://juejin.im/post/5b8de829f265da43623c4261)
[https://juejin.im/post/5b7b88d46fb9a019e9767405](https://juejin.im/post/5b7b88d46fb9a019e9767405)
