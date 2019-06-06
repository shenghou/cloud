# 泛型，

- 用于支持多种类型的数据

```ts
function identity<T>(arg: T): T {
  return arg;
}
//其中<T>代表这类型变量 number string array ...
//我们调用时候传入类型变量
const output = identity<string>('beijing');  // ture
const output = identity<number>('beijing');  // error beijing is not a numher

//TS编译器也会依据传入的参数自动地帮助我们确定T的类型
const output = identity('beijing);
//没有使用尖括号来明确地传入类型，编译器会检查beijing的类型然后将T设置为他的类型

```

### 使用泛型变量

- 当使用泛型创建函数时候，必须把参数当做成是任意或所有类型

```ts
function generic<T>(arg: T): T {
  console.log(arg.length); // property length does not exist on type T
  return arg;
}
//说明T类没有length属性,所以需要我们显性的传入T类型 Array<T>或 T:[]
function generic<T>(arg: Array<T>): Array<T> {
  console.log(arg.length); // true
  return arg;
}
```

### 泛型类型

- 定义一个类型参数在最前面

```ts
function generic<T>(arg: T): T {
  return arg;
}
const myGeneric: <T>(arg: T) => T = generic;
//定义 变量myGeneric，并且将generic赋值给它
//其中generic为一个函数，函数类型为T,函数返回值的类型也为T，函数参数为arg

//上面代码编译为es5后为：
function generic(arg) {
  return arg;
}
var myGeneric = generic;

//我们把类型参数可以当一个对象字面量签名来使用
const myGeneric: { <T>(arg: T): T } = generic;

//所以我们可以定义个接口在处理对象签名
interface GenericFn {
  <T>(arg: T): T;
}
const myGeneric: GenericFn = generic;

//我们还可以把整个接口当做泛型的一个参数
interface GenericFn<T> {
  (arg: T): T;
}
```

### 泛型类

- 使用<>跟着类名后面

```ts
class GenerciClass<T> {
  value: T;
  add: (x: T, y: T) => T;
}
let myGenericClass = new GenerciClass<number>();
myGenericClass.value = 0;
myGenericClass = (x, y) => {
  return x + y;
};
//当然我们也可以吧number换成string
let myGenericClass = new GenerciClass<string>();
```

### 泛型约束

- 我们可以使用 extends 关键字来实现泛型约束

```ts
interface LengthWis {
  length: number;
}

function limitGeneric<T extends LengthWis>(arg: T): T {
  console.log(arg.length);
  return arg;
}
limitGeneric({ length: 10, value: 3 });  //可以定义更多属性
```
