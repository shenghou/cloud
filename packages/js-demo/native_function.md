- 原生函数，即 js 内建函数

```js
String();
Number();
Boolean();
Array();
Object();
Function();
RegExp();
Date();
Error();
Symbol();
```

## 内部属性 class

所有`typeof`返回值为`object`的对象都包含一个内部属性`class`，无法访问，一般通过`Object.prototype.toString()`来查看

```js
Object.prototype.toString.call([1, 2, 3]); //[Object Array]

Object.prototype.toString.call(null); //[Object Null]

//包装类型   被各自的封装对象自动包装
Object.prototype.toString.call(42); //[Object  Number]
```

## 封装对象包装

由于基本类型没有`.length .toString()`这样的属性，需要通过封装对象才能访问，

```js
var a = "abc";
var b = new String(a);
var c = Object(a);
typeof a; //string
typeof b; //object
typeof c; //object
b instanceof String; //true              instanceof 需要为一个对象
c instanceof String; //true
Object.prototype.toString.call(b); //[object  String]
Object.prototype.toString.call(c); //[object  String]
```

## 拆封 `tostring`

```js
var a = new String("addd");
a.valueOf(); // 'addd'
```

## 原生函数作为构造函数

不建议
