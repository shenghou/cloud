# 享元模式

其要求将对象的属性划分为内部状态和外部状态，其目标是尽量减少共享对象的数量，

- 内部状态存储于对象内部
- 内部状态可以被一些对象共享
- 内部状态独立于具体的场景，通常不会改变
- 外部状态取决于具体的场景，并依据场景二变化，外部状态不能被共享


## 模特例子

```js
    //不优化的情形
    const Model = (sex, wear) => {
        this.sex = sex;
        this.wear = wear;
    };

    Model.prototype.takePhoto = () => {
        console.log('sex=' + this.sex + 'wear=' + this.wear);
    };

    for( let i = 1; i <= 50; i++) {
        const maleModel = new Model('male', 'wear' + i);
        maleModel.takePhoto();
    }
    //male  &  female 会有重复
    for( let j = 1; j <= 50; j++) {
        const femaleModel = new Model('female', 'wear' + j);
        femaleModel.takePhoto();
    }



    //使用享元模式
    const Model = sex => {
        this.sex = sex;
    };

    Model.prototype.takePhoto = () => {
        console.log('sex=' + this.sex + 'wear=' + this.wear);
    };

    const maleModel = new Model('male'),
          femaleModel = new Model('female');

    for( let i = 1; i <= 50; i++) {
        maleModel.wear = 'wear' + i;
        maleModel.takePhoto();
    }
    //male  &  female 会有重复
    for( let j = 1; j <= 50; j++) {
        famaleModel.wear = 'wear' + j;
        femaleModel.takePhoto();
    }

```


使用场景

- 一个程序中使用了大量的相似对象
- 由于使用了大佬对象，造成很大的内存开销
- 对象的大多数状态都可以变为外部状态
- 剥离出对象的外部状态之后，可以用相对较少的共享对象取代大量对象

