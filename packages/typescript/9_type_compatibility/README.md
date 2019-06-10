# 类型兼容性

类型兼容是基于结构子类型，即假如要使得 X 兼容 Y，则 Y 至少具有与 X 相同的属性。
eg

```ts
interface names {
  name: string;
}
let x: names;
let y = { name: "bi", age: 10 };
x = y; // 原属性x都能在y中找到
```

### 比较函数

函数比较有函数的参数列表和函数返回值两种

- 参数列表

```ts
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; //  ok     x中的参数y中都有
x = y; //  error  y中的string参数x中没有
```

- 返回值类型

```ts
let x = () => ({ name: "Alice" });
let y = () => ({ name: "Alice", location: "Seattle" });

x = y; // OK
y = x; // Error, y不是x的子类型
```

- 可选参数与剩余参数
  源类型上有额外的可选参数不是错误，目标类型的可选参数在源类型里没有对应的参数也不是错误，且当一个函数有剩余参数时，它被当做无限个可选参数。

例如当我们使用一个带回调函数的参数

```ts
function invokeLater(args: any[], callback: (...args: any[]) => void) {
  /* ... Invoke callback with 'args' ... */
}
// Unsound - invokeLater "might" provide any number of arguments
invokeLater([1, 2], (x, y) => console.log(x + ", " + y));

// Confusing (x and y are actually required) and undiscoverable
invokeLater([1, 2], (x?, y?) => console.log(x + ", " + y));
```

### 枚举

枚举类型与数字类型兼容，数字也与枚举兼容，但是枚举是不兼容的

```ts
enum Status {
  Ready,
  Waiting
}
enum Color {
  Red,
  Blue,
  Green
}

let status = Status.Ready;
status = Color.Green; // Error
```

### 类

类只会比较实例属性，而且静态属性和构造函数不比较，私有和保护属性会比较

```ts
class Animal {
  feet: number;
  constructor(name: string, numFeet: number) {}
}

class Size {
  static page: string;
  feet: number;
  constructor(numFeet: number) {}
}

let a: Animal;
let s: Size;

a = s; // OK
s = a; // OK
```

### 泛型

未指定泛型参数时，会把所有参数当`any`比较，有参数时候就得比较参数类型

- 无参数

```ts
interface Empty<T> {}
let x: Empty<number>;
let y: Empty<string>;

x = y; // OK, because y matches structure of x
```

- 有参数

```ts
interface NotEmpty<T> {
  data: T; //指定参数data
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y; // Error, because x and y are not compatible
```
