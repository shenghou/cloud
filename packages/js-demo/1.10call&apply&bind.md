# call&apply&bind

## call

call()方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法

eg:

```js
    var foo = {
        value:1
    };
    function bar() {
        console.log(this.value)
    }
    bar.all(foo);
```

1. call 改变了 this 的指向， 指向到 foo
2. bar 函数执行了

### call 模拟实现

```js
    Function.prototype.call2 = function(cxt) {
        var cxt = cxt || window;
        cxt.fn = this;
        var args = [];
        for(var i = 1, l = arguments.length; i < l; i++){
            args.push('arguments[' + i + ']')
        }
        var result = eval('cxt.fn('+ args +')');
        delete cxt.fn
        return result;
    }

    var value = 2;
    var obj = {
        value:1
    }
    function bar(name, age) {
        console.log(this.value)
        return {
            value:this.value,
            name:name,
            age:age,
        }
    }
    bar.call2(null);
    console.log(bar.call2(obj, 'kevin', 18))
```

## apply 模拟实现

```js
    Function.prototype.apply = function(cxt, arr) {
        var cxt = Object(cxt) || window;
        cxt.fn = this;
        var result;
        if(!arr) {
            result = cxt.fn();
        } else {
            var args = [];
            for(var i =0, l = arr.length; i < l; i++) {
                args.push('arr[' + i + ']')
            }
            result = eval('cxt.fn(' + args + ')')
        }
        delete cxt.fn
        return result
    }

```

## bind 模拟实现

`bind()`方法会创建一个新函数，当这个新函数被调用时，`bind()` 的第一个参数将作为它运行时的 `this`， 之后的一序列参数将会在传递的实参前传入作为它的参数：传入参数，返回函数。


eg:

```js
    var foo = {
        value: 1
    };
    function bar() {
        console.log(this.value)
    };
    var bindFoo = bar.bind(foo);
    bindFoo();
```

### 模式实现

可以用 apply 来实现，返回一个函数

```js
    // 不传参
    Function.prototype.bind2 = function(cxt) {
        var self = this;
        return function() {
            return self.apply(cxt)
        }
    }

    // 传参
    Function.prototype.bind3 = function(cxt) {
        var self = this;
        var args = Array.prototype.slice.call(arguments, 1);
        return function() {
            var bindArags = Array.prototype.slice.call(arguments)
            return self.apply(cxt, args.concat(bindArgs))
        }
    }

    // 构造函数
    Function.prototype.bind4 = function(cxt) {
        var self = this;
        var args = Array.prototype.slice.call(arguments,1);
        var fBound = function() {
            // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
            // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : context`，实例只是一个空对象，将 null 改成 this ，实例会具有 habit 属性
            // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
            var bindArags = Array.prototype.slice.call(arguments);
            return self.apply(this instanceof fBound ? this : cxt, args.concat(bindArgs));
        };
        fBound.prototype = this.prototype;
        return fBound;
    }
```

最终代码

```js
    Function.prototype.bind2 = function(cxt) {
        var self = this;
        var args = Array.prototype.slice.call(arguments, 1);
        var fNOP = function(){};
        var fBound = function() {
            var bindArgs = Array.prototype.slice.call(arguments);
            return self.apply(this instanceof fNOP ? this : cxt, args.concat(bindArgs));
        };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    }
```



下一篇 new 