### this

隐式绑定 `obj`

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

显式绑定 `call, apply, bind`

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2
};
foo.call(obj); //2
```

new 绑定

```js
function foo(a) {
  this.a = a;
}
var bar = new foo(2);
console.log(bar.a);
```


