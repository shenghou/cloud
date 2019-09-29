# 装饰器模式

装饰者模式可以动态地给某个对象添加一些额外属性的职责，而不会影响从这个类中派生的其他对象.


## 飞机的例子

给对象动态增加职责，其并未真正改动对象自身，而是将对象放入另一个对象之中，这些对象以一条链的方式进行引用，形成一个聚合。

```js
    const Plane = () => {};

    Plane.prototype.fire = () => {
        console.log('发射普通子弹')
    }；

    const MissileDecorator = plane => {
        this.plane = palne;
    };

    MissileDecorator.prototype.fire = () => {
        this.plane.fire();
        console.log('发射导弹')；
    }；

    const AtomDecorator = plane => {
        this.plane = plane;
    };

    AtomDecorator.prototype.fire = () => {
        this.plane.fire();
        console.log('发射原子弹');
    };

    let plane = new Plane();

    plane = new MissileDecorator(plane);

    plane = new AtomDecorator(plane);

    plane.fire();
```


## js中装饰器

```js   
    const plane = {
        fire: () => {
            console.log('发射普通子弹')；
        }
    }

    const missleDecorator = () => {
        console.log('发射导弹');
    }

    const atomDecorator = () => {
        console.log('发射原子弹')
    }

    const fire1 = plane.fire;

    plane.fire = () => {
        fire1();
        missleDecorator();
    }

    const fire2 = plane.fire;

    plane.fire = () => {
        fire2();
        missleDecorator();
    }

    plane.fire()
```

## 使用AOP装饰函数

```js
    Function.prototype.before = beforefn => {
        let self = this;
        return () => {
            beforefn.apply(this, arguments);
            return self.apply(this, arguments);
        }
    }

    Function.prototype.after = afterfn => {
        let self = this;
        return () => {
            let ret = self.apply(this, arguments);
            afterfn.aplly(this, arguments);
            return retp
        }
    }
```
