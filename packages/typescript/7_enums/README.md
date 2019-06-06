# 枚举

- 我们可以利用关键词`enum`来定义一些带名字的常量

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right
}
//如上我们定义了未设置值的枚举，所以对应的值为0，1，2，3

enum Direction {
  Up = 10,
  Down,
  Left,
  Right
}
//当我们设置初始值的时候就则从初始值开始递增

enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = Left
}
//字符串枚举要求每个成员都必须是字符串字面量同时也不建议混合枚举

//枚举成员使用常亮枚举表达式来初始化：字面量、之前定义常量的引用、一元或二元运算符
enum EunmConstant {
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  G = "aeg".length
}
```

### 运行时候枚举

- 枚举是在运行时真正存在的对象

```ts
enum E {
  X,
  Y,
  Z
}
function getEnumValue(obj: { X: number }) {
  return obj.X; //X为真实存在的值0
}
getEnumValue(E);
```

- 也可以利用反向推断枚举属性

```ts
enum Enum {
  A
}
const a = Enum.A;
const name = Enum[a]; //A
//编译成ES5为
var Enum;
(function(Enum) {
  Enum[(Enum["A"] = 0)] = "A";
})(Enum || (Enum = {}));
var a = Enum.A;
var name = Enum[a]; //A
```

- `const`常量枚举

```ts
const enum Enum {
  A = 1,
  B = A * 2
}
```

常亮枚举在`编译阶段会删除`，

### 外部枚举

```ts
declare enum Enum {
  A = 1,
  B,
  C = 2
}
```

外部枚举和非外部枚举之间有一个重要的区别，在正常的枚举里，没有初始化方法的成员被当成常数成员。 对于非常数的外部枚举而言，没有初始化方法时被当做需要经过计算的。
