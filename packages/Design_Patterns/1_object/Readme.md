### 鸭子辩形，看起来像，听起来像就是

```ts
const duck = {
	duckSinging: () => {
		console.log('gagag');
	},
};

const chicken = {
	duckSinging: () => {
		console.log('gagag');
	},
};

let choir = [];

const joinChoir = animal => {
	if (animal && typeof animal.duckSinging === 'function') {
		choir.push(animal);
		console.log('join');
	}
};

joinChoir(duck);
joinChoir(chicken);
```

### 多态， 同一操作作用于不同的对象上面，可以产生不同的解释和不同的执行结果

```ts
const makeSound = animal => {
	animal.sound();
};
const Duck = () => {};
Duck.prototype.sound = () => {
	console.log('duck');
};

const Chicken = () => {};
Chicken.prototype.sound = () => {
	console.log('chicken');
};
makeSound(new Chicken());
makeSound(new Duck());

//原型模式
const Plane = () => {
	this.boold = 100;
	this.level = 1;
	this.defense = 1;
};

const plane = new Plane();
plane.boold = 200;
plane.level = 2;
plane.defense = 2;

const clonePlane = Object.create(plane);
console.log(clonePlane);
```

### **proto**指向构造器的原型对象，即(Constructor.prototype)

```ts
function Person(name) {
this.name = name;
}

Person.prototype.getName = () => {
return this.name;
};

const objectFactory = () => {
let obj = new Object(),
Constructor = [].shift.call(arguments);
obj.**proto** = Constructor.prototype;
const ret = Constructor.apply(obj, arguments);
return typeof ret === 'object' ? ret : obj;
};

const a = objectFactory(Person, 'seven');
console.log(a.name);
console.log(a.getName());
console.log(Object.getPrototypeOf(a) === Person.prototype);




-  1.尝试变量 a 的所有属性，但没有
-  2.查找 name 属性的请求被委托给对象 a 的构造器的原型，它被`a.__proto__`记录着，并且指向`A.prototype`,而f`A.prototype`被设置为对象`obj`
const obj = {name: 'housheng'};
let A = () => {};
A.prototype = obj;

let aa = new A();
console.log(aa.name);
```
