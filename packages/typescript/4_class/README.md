# class

- typescript 中的类和 es6 类似，但增加了些 ts 特有的属性校验

### 受保护的修饰符

- `public`

* 在 ts 的类中，我们默认所有的成员都是`public`的，例如我们可以对常见的类进行修改

```ts
class testPublic {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  changeName(name: string) {
    console.log(`${name} is change`);
  }
}
//add public
class testPublic {
  public name: string;
  public constructor(name: string) {
    this.name = name;
  }
  public changeName(name: string) {
    console.log(`${name} is change`);
  }
}
```

- `private`

* 有时候我们并不想对外暴露类的一些属性，这时候我们就可以使用`private`标记

```ts
class testPrivate {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
}
const readName = new testPrivate("lomean");
console.log(readName.name); // name is private and readonly in testPrivate
```

- 对于 ts 来说，比较两种不同类型的时候其并不会关注来自何处，类型兼容就行，但是如有带有`private`或`protected`的则必须是两个类型都存在这个成员才可以.

```ts
class Animal {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

class Rhino extends Animal {
  constructor() {
    super("Rhino");
  }
}

class Employee {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
animal = employee; // employee 的name与animal的name不同
```

- `protected`

* 与`private`基本相同，只是 protected 的成员在派生类中仍然可以访问只是不可修改

```ts
class Person {
  protected name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Employee extends Person {
  private department: string;

  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  public getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
console.log(howard.name); // 错误
```

- 构造函数也可以被标记，意味着不能再包含他的类外被实例化，但是能被继承

```ts
class Person {
  protected name: string;
  protected constructor(theName: string) {
    this.name = theName;
  }
}

// Employee 能够继承 Person
class Employee extends Person {
  private department: string;

  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  public getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard = new Employee("Howard", "Sales");
let john = new Person("John"); // 错误: 'Person' 的构造函数是被保护的.F
```

- `readonly`

* 表示只读属性，在生命时或构造函数里被初始化

```ts
class TestReadonly {
  readonly name: string;
  constructor(name: string) {
    this.name = name;
  }
}
const ddd = new TestReadonly("lomean");
ddd.name = "lomeans"; // can not assign because is readonly

//参数属性可以方便定义并初始化
class TestReadonly2 {
  constructor(readonly name: string) {}
}
```

- `get set` getter & setter

### 静态属性

- `static`可以直接访问

### 抽象类

- `abstract` 抽象类作为其他派生类的基类使用，一般不直接被实例化,抽象类的方法不具体实现，必须在派生类中实现， _只定义签名_。

```ts
abstract class Department {
  constructor(public name: string) {}

  printName(): void {
    console.log("Department name: " + this.name);
  }

  abstract printMeeting(): void; // 必须在派生类中实现
}

class AccountingDepartment extends Department {
  constructor() {
    super("Accounting and Auditing"); // 在派生类的构造函数中必须调用 super()
  }

  printMeeting(): void {
    console.log("The Accounting Department meets each Monday at 10am.");
  }

  generateReports(): void {
    console.log("Generating accounting reports...");
  }
}

let department: Department; // 允许创建一个对抽象类型的引用
department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
department.generateReports(); // 错误: 方法在声明的抽象类中不存在
```
