# arguments 

类数组对象，即拥有一个 length 属性和若干索引属性的对象

eg:

```js
var array = ['name', 'age', 'sex'];
var arrayLike = {
    0: 'name',
    1: 'age',
    2: 'sex',
    length: 3,
}
```

## 属性

```js
 // 读取
console.log(array[0]); // name
console.log(arrayLike[0]); // name

array[0] = 'new name';
arrayLike[0] = 'new name';


// 长度
console.log(array.length); // 3
console.log(arrayLike.length); // 3


// 遍历
for(var i = 0, len = array.length; i < len; i++) {
   ……
}
for(var i = 0, len = arrayLike.length; i < len; i++) {
    ……
}

```

## 调用数组方法

直接调用会出错，需用数组方法调用

```js
    var arrayLike = {0: 'name', 1:'age', 2:'sex', length:3};
    Array.prototype.join.call(arrayLike, '&');

    Array.prototype.slice.call(arrayLike, 0);

    Array.prototype.map.call(arrayLike, item => item.upperCase);

    Array.from(arrayLike);

    Array.prototype.concat.apply([], arrayLike)

```


## Arguments 对象

Arguments 对象只定义在函数体中，包括了函数的参数和其他属性。在函数体中， arguments 指代该函数的 Arguments 对象

eg:

```js
    function foo(name, age, sex) {
        console.log(arguments);    // 0: "name" 1: "age" 2: "sex" length: 3  caller
    }
    foo('name', 'age', 'sex')
```

### length 属性

Arguments 对象的 length 属性，表示实参的长度，

```js

    function foo(b, c, d) {
        console.log('实参长度:' + arguments.length );     // 1
    } 
    console.log('形参的长度:'+ foo.length);               // 3

    foo(1)

```

### callee 属性

Arguments 对象的 callee 属性，通过它可以调用函数自身。

```js
var data = [];

for (var i = 0; i < 3; i++) {
    (data[i] = function () {
       console.log(arguments.callee.i);
    }).i = i;
}

data[0]();
data[1]();
data[2]();

// 0
// 1
// 2
```

### arguments 和对参数的绑定

```js
function foo(name, age, sex, hobbit) {

    console.log(name, arguments[0]); // name name

    // 改变形参
    name = 'new name';

    console.log(name, arguments[0]); // new name new name

    // 改变arguments
    arguments[1] = 'new age';

    console.log(age, arguments[1]); // new age new age

    // 测试未传入的是否会绑定
    console.log(sex); // undefined

    sex = 'new sex';

    console.log(sex, arguments[2]); // new sex undefined

    arguments[3] = 'new hobbit';

    console.log(hobbit, arguments[3]); // undefined new hobbit

}

foo('name', 'age')
```

传入的参数，实参和 arguments 的值会共享，当没有传入时，实参与 arguments 值不会共享

除此之外，以上是在非严格模式下，如果是在严格模式下，实参和 arguments 是不会共享的。


### 传递参数

将参数从一个函数传递到另一个函数

```js
    function foo() {
        // 将 foo 参数传递到 bar
        bar.apply(this, arguments);
    }
    function bar(a, b, c) {
        console.log(a, b, c)
    }
    foo(1, 2, 3)
```

### es6 arguments

```js
    function func(...arguments) {
        console.log(arguments)   //[1, 2, 3]
    }
    func(1, 2, 3)
```

下一篇  创建对象的优缺点