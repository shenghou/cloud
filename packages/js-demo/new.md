# new

new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一

eg:

```js
    function Otaku(name, age) {
        this.name = name;
        this.age  = age;
        this.habit = 'Games';
    }
    Otaku.prototype.strength = 60;
    Otaku.prototype.sayYourName = function() {
        console.log('I am' + this.name);
    }
    var person = new Otaku('kevin', 18);
```

实例 person 可以：
1. 访问到 Otaku 构造函数的属性；
2. 访问到 Otaku.prototype 中的属性

## 初步实现

分析：

因为 new 的结果是一个新对象，所以在模拟实现的时候，需建立一个新对象，假设这个对象叫 obj, 因为 obj 具有 Otaku 构造函数里的属性，可以使用 `Otaku.apply(obj, arguments)` 来给obj添加新属性;

在原型与原型链中，我们知道实例的 \__proto__ 属性会指向构造函数的 prototype 

**第一版**

```js
    function objectFactory() {
        var obj = new Object();
        Constructor = [].shift.call(arguments);
        obj.__proto__ = Counstructor.prototype;
        Constructor.apply(obj, arguments);
        return obj;
    }
```

然后有时候构造函数还有返回值

**第二版**

```js
    function objectFatory() {
        // 从 object.prototype 上克隆一个对象
        var obj = new Object();
        // 取得外部传入的构造器
        Constructor = [].shift.call(arguments);
        // 指向正确的原型
        obj.__proto__ = Constructor.prototype;
        // 借用外部传入的构造器给 obj 设置属性
        var ret = Constructor.apply(obj, arguments);
        return typeof ret === 'object' ? ret : obj;
    }
```


下一篇   arguments