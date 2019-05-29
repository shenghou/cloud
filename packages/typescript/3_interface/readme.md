# 接口

由于 typescript 的核心是进行类型检查，故可以定义接口在约定代码类型；

```ts
interface labelValue {
  label: string;
}
function pageLable(labelObject: labelValue) {
  const label = labelObjec.label;
}
const myObject = { size: 10, label: "string label" };
pageLable(myObject);
```

### 可选属性

```ts
    interface SquareConfig{
        color?: string;
        width?:number;
    }
    function creatSuare(config: SquareConfig:{color:string, width:number}){
        //Do something
    }
    let mySquare = creatSuare({color:'back'})

```

### 只读属性

```ts
interface Point {
  readonly x: number;
  readonly y: number;
}
let p: Point = { x: 10, y: 20 };
p.x = 30; //error
//ReadonlyArrat<T> 可用于数组只读
let a: number[] = [1, 2, 3];
let ro: RadonlyArray<number> = a;
ro[0] = 12; //error
ro.push(2); //errot
//类型断言可以重新该数组
a = ro as number[];
```

### 额外属性检查

- 最佳的方式是添加字符串索引签名

```ts
interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: any; //可以用于额外属性
}
```

### 函数类型

- 接口不仅可以描述对象还可以描述函数类型，即给函数定义一个调用签名

```ts
interface SearchFunc {
  (source: string, substring: string): boolean;
}
let mySearch = SearchFunc;
mySearch = function({ src: string, sub: string }): boolean {
  let result = src.search(sub);
  return result > -1;
};
```

### 索引类型

```ts
interface StringArray {
  [index: number]: string;
}
let myArray: StringArray;
myArray = ["Bob", "Fred"];
let myStr: string = myArray[0];
```

- ts 支持字符串和数字索引，但是数字索引的返回值必须是字符串索引返回值的子类型，当使用 100 时会转为‘100’ ?

```ts
class Animal {
  name: string;
}
class Dog extends Animal {
  breed: string;
}
interface Nop {
  [x: number]: Animal; //error
  [x: string]: Dog;
}
```

- 索引签名函数可以设置为只读，防止给索引赋值

```ts
interface ReadonlyStringArray {
  readonly [index: number]: string; //只读
}
let myArray: ReadonlyStringArray = ["bei", "jing"];
myArray[2] = "nan"; // error 只读签名
```

### 类接口继承 (`implements`)

```ts
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date);
}

class Clock implements ClockInterface {
  currentTime: Date; //属性
  setTime(d: Date) {
    // 方法
    this.currentTime = d;
  }
  constructor(h: number, m: number) {}
}
```

### 继承接口

- 单个

```ts
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
```

- 多个

```ts
interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
f;
```
