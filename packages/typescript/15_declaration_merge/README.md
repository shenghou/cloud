# 声明合并

编译器将同一个名字的两个独立声明合并成为单一声明，合并后的声明同时拥有原先两个声明的特性。

### 接口合并

非函数成员应该是唯一，不唯一的话必须是相同类型，同名的非函数成员会报错

```ts
interface Box {
  height: number;
  width: number;
}

interface Box {
  scale: number;
  //width: number;  必须唯一
}

let box: Box = { height: 5, width: 6, scale: 10 };
```

函数成员同名的则是重载

```ts
interface Cloner {
  clone(animal: Animal): Animal;
}

interface Cloner {
  clone(animal: Sheep): Sheep;
}

interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
}

interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
  clone(animal: Sheep): Sheep;
  clone(animal: Animal): Animal;
}
```

### 命名空间合并

同名的命名空间会合并成员。模块导出的同名接口合并，组成的单一的命名空间，其包括合并后的接口。

```ts
namespace Animals {
  export class Zebra {}
}

namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }
  export class Dog {}
}
namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }

  export class Zebra {}
  export class Dog {}
}
```

- 注： 非导出成员是无法访问的

```ts
namespace Animal {
  let haveMuscles = true; //非导出
  export function animalsHaveMuscles() {
    return haveMuscles;
  }
}

namespace Animal {
  export function doAnimalsHaveMuscles() {
    return haveMuscles; // Error, because haveMuscles is not accessible here
  }
}
```

### 命名空间与类的合并

用于表示内部类

```ts
class Album {
  label: Album.AlbumLabel;
}
namespace Album {
  export class AlbumLabel {}
}
```
