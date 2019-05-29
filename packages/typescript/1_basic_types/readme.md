# 基本类型

与 js 相同，增加了枚举类型

### boolean

```ts
let isDone: boolean = false;
```

### number

```ts
let page: number = 10;
```

### string

```ts
let name: string = "bob";
```

### array

```ts
let list: number[] = [1, 2, 3];

let list: Array<number> = [1, 2, 3]; //泛型
```

### tuple

允许表示一个已知元素数量和类型的数组，各元素的类型不必相同，`[string, number]`

```ts
let x: [string, number];
x = ["bi", 10];
x = [10, "bi"]; //error
```

### enum

```ts
enum Color {
  Red,
  Green,
  Blue
}
let c: Color = Color.Green;
```

元素编号可以赋值

```ts
enum Color {
  Red = 10,
  Green = 20,
  Blue = 30
}
let c: Color = Color.Green;
```

可以反向获取名字

```ts
enum Color {
  Red = 1,
  Green,
  Blue
}
let colorName: string = Color[2];

console.log(colorName); // 显示'Green'因为上面代码里它的值是2
```

### any

用于不确定名字的

```ts
let notSure: any = 4;
```

### 类型断言

```ts
let value: any = "this is a string";
let length: number = (<string>value).length;
或者;
let length: number = (value as string).length;
```
