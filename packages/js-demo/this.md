# this

## types

ES 类型分为**语言类型**和**规范类型**

语言类型是开发者直接使用的es可以操作的，即 `Undefined, Null, Boolean, String, Number, Object, Symbol, Bigint`

规范类型相当于 `meta-values`,是用来用算法描述ES语言结构和ES语言类型，包括`Reference, List, Completion, Property Descriptor, Property Indetifier, Lexical Environment， Environment Record`

而**Reference**类型则与**this**有着密切的关联


## Refercence

Reference 类型就是用来解释诸如 `delete, typeof`以及赋值等操作行为的。由 `base value, referenced name, strict reference`组成。

**base value**就是属性所在的对象或者就是`environmentRecord`，它的值只可能是 `undefined, an Object, a Boolean, a String, a Number,  or an environment record`其中的一种

eg:

```js
var foo = 1
var fooReference = {
  base: EnvironmentRecord,
  name: 'foo',
  strict: false,
}


var foo = {
  bar: function() {
    return this
  }
}
foo.bar()
var BarReference = {
  base: foo,
  propertyName: 'bar',
  strict: false,
}
```

而且规范中还提供了获取 `Reference` 组成部分的方法，比如 `GetBase` 和 `IsPropertyReference`

**GetBase**： 返回 reference 的 base value
**IsPropertyReference**：如果 base value 是一个对象就返回 true


### 函数调用

产生式 CallExpression : MemberExpression Arguments 按照下面的过程执行 :

1. 令 ref 为解释执行 MemberExpression 的结果 .
2. 令 func 为 GetValue(ref).
3. 令 argList 为解释执行 Arguments 的结果 , 产生参数值们的内部列表 (see 11.2.4).
4. 如果 Type(func) is not Object ，抛出一个 TypeError 异常 .
5. 如果 IsCallable(func) is false ，抛出一个 TypeError 异常 .
6. 如果 Type(ref) 为 Reference，那么 如果 IsPropertyReference(ref) 为 true，那么 令 thisValue 为 GetBase(ref). 否则 , ref的基值是一个环境记录项 令 thisValue 为调用 GetBase(ref) 的 ImplicitThisValue 具体方法的结果
7. 否则 , 假如 Type(ref) 不是 Reference. 令 thisValue 为 undefined.
8. 返回调用 func 的 [[Call]] 内置方法的结果 , 传入 thisValue 作为 this 值和列表 argList 作为参数列表

**MemberExpression:**

* PrimaryExpression // 原始表达式 可以参见《JavaScript权威指南第四章》
* FunctionExpression // 函数定义表达式
* MemberExpression [ Expression ] // 属性访问表达式
* MemberExpression . IdentifierName // 属性访问表达式
* new MemberExpression Arguments // 对象创建表达式

eg:

```js
function foo() {
    console.log(this)
}
foo(); // MemberExpression 是 foo

function foo() {
    return function() {
        console.log(this)
    }
}
foo()(); // MemberExpression 是 foo()

var foo = {
    bar: function () {
        return this;
    }
}
foo.bar(); // MemberExpression 是 foo.bar
```
即 MemberExpression 为 () 左边的部分



## this 调用场景

### 隐式绑定 `obj`

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};
obj.foo();
//对象属性引用链只有最后一层才起作用
function foo() {
  console.log(this.a);
}
var obj2 = {
  a: 42,
  foo: foo
};
var obj1 = {
  a: 2,
  obj2: obj2
};
obj1.obj2.foo(); //42 最后一层obj2起作用

//隐式丢失   引用函数本身
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};
var bar = obj.foo; //新取的函数ming
var a = "global";
bar(); // 'globar'     bar是新定义的函数，所以引用的是全局
//参数传递也是隐式赋值
function foo() {
  console.log(this.a);
}
function doFoo() {
  fn();
}
var obj = {
  a: 2,
  foo: foo
};
var a = "global";
doFoo(obj.foo); //global  其实和上面的意思是一样
```

### 显式绑定 `call, apply, bind`

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2
};
foo.call(obj); //2
```

### new 绑定

```js
function foo(a) {
  this.a = a;
}
var bar = new foo(2);
console.log(bar.a);
```


下一篇  执行上下文