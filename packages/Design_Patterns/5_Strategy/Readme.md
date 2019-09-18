# 策略模式

定义一系列的算法，把他们一个个封装起来，并且使他们可以相互替换

## 使用策略模式计算奖金

- 简单实现

```js
    const calculateBonus = (level, salary) => {
        if(level === 'S') {
            return salary * 4;
        }
        if(level === 'A') {
            return salary * 3;
        }
        if(level === 'B') {
            return salary * 2;
        }
    };
    calculateBonus('B', 20000);
```

- 使用组合

```js
    const performS = (salary) => {
        return salary * 4;
    };
    const performA = (salary) => {
        return salary * 3;
    };
    const performB = (salary) => {
        return salary * 2;
    };
    const calculateBonus = (level, salary) => {
        if(level === 'S') {
            return performS(salary);
        }
        if(level === 'A') {
            return performA(salary);
        }
        if(level === 'B') {
            return performB(salary);
        }
    };
    calculateBonus( 'A', 20000);
```

- 使用策略

```js
    const performS = () => {};
    performS.prototype.caluate = (salary) => {
        return salary * 4;
    };
    const performA = () => {};
    performS.prototype.caluate = (salary) => {
        return salary * 3;
    };
    const performB = () => {};
    performS.prototype.caluate = (salary) => {
        return salary * 2;
    };
    //定义奖金类
    const Bouns = () => {
        this.salary = null;      //原始值
        this.strategy = null;    //绩效等级对应的策略
    }；
    Bouns.prototype.setSalary = (salary) => {
        this.salary = salary;    //设置原始工资
    };
    Bouns.prototype.setStrategy = (strategy) => {
        this.strategy = strategy;   //设置工资策略
    };
    Bouns.prototype.getBouns = () => {
        return this.strategy.calculate(this.salary);
    };
    const bouns = new Bouns();
    bouns.setSalary(100000);
    bouns.setStrategy(new performA());
    console.log(bouns.getBouns())
```

## js版的策略模式

```js
   //把`strategy`直接定义成类
   const strategies  = {
       'S': (salary) => {
           return salary * 4;
       };
       'A': (salary) => {
           return salary * 3;
       };
       'B': (salary) => {
           return salary * 2;
       };
   };
   const calculateBouns = (level, salary) => {
       return strategies[level](salary);
   };
   console.log(calculateBouns( 'S', 30000));
```

*通过使用策略模式重构代码，可以消除原程序中大片的条件分支语句。所有跟计算奖金有关的逻辑不再放在`Context`中，而是分布在各个策略对象中。将计算相关的委托个某个策略对象*

