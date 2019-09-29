# 模板方法模式

其通常由两部分组成，第一部分是抽象父类，第二部分是具体的实现子类，在父类中封装子类的算法框架，子类继承抽象类。

```js
    const Beverage = () => {};

    Beverage.prototype.boil = () => {};

    Beverage.prototype.brew = () => {};

    Beverage.prototype.poureIn = () => {};

    Beverage.prototype.addCondi = () => {};

    Beverage.prototype.init = () => {
        this.boil();
        this.brew();
        this.poureIn();
        this.addCondi();
    };

    //子类继承
    const Coffee = () => {};

    Coffee.prototype = new Beverage();

    Coffee.prototype.boli = () => {console.log('重新 boil')}；

    const coffee = new Coffee();
    coffee.init();

       //子类继承
    const Tea = () => {};

    Tea.prototype = new Beverage();

    Tea.prototype.boli = () => {console.log('重新 boil')}；
```


也可封装成传入参数 P163