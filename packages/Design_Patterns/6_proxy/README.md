# 代理模式

代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问

## 送花的例子

```js
    //不用代理
    const Flower = () => {};

    const xiaoming = {
        sendFlower: (target) => {
            const flower = new Flower();
            target.receiveFlower(flower);
        };
    };

    const A = {
        receiveFlower: (flower) => {
            console.log('shou dao hua' + flower);
        };
    };
    xiaoming.sendFlower(A);


    //引入代理B，即通过B来给A送花
    const Flower = () => {};

    const xiaoming = {
        sendFlower: (target) => {
            const flower = new Flower();
            target.receiveFlower(flower);
        };
    };

    const B = {
        receiveFlower: (flower) => {
            //此处还可以添加其他的功能，比如监听A的好坏
            A.receiveFloer(flower);
        };
    }

    const A = {
        receiveFlower: (flower) => {
            console.log('shou dao hua' + flower);
        };
    };
    xiaoming.sendFlower(A);
``` 

## 现实中图片加载的例子

```js
    const myImage = (()=>{
        const imageNode = document.createElement('img');
        document.body.appendChild(imageNode);

        return {
            setSrc: src => {
                imgNode.src = src;
            }
        }
    })();
    myImage.setSrc('htt://xxxxxxxx.jpg');


    //使用代理
    const myImage = (()=>{
        const imageNode = document.createElement('img');
        document.body.appendChild(imageNode);

        return {
            setSrc: src => {
                imgNode.src = src;
            }
        }
    })();
    const proxyImage = (()=> {
        let img = new Image;
        img.onload = () => {
            myImage.setSrc(this.src);
        }
        return {
            setSrc: src => {
                //图片装载前显示loading
                myImage.setSrc('http://xxxx.gif');
                img.src = src;
            }
        }
    })();
    proxyImage.setSrc('http://xxxxx.jpg')
```

## 用高阶函数动态创建代理

```js
    const plus = () => {};
    const mult = () => {};
    const createProxyFactory = fn => {
        let cash = {};
        return () => {
            const args = Array.prototype.join.call(arguments, ',');
            if(args in cache) {
                return cache[args];
            }
            return cache[args] = fn.apply(this, arguments);
        }
    };
    const proxyMult = createProxyFactory(mult);
    proxyPlus = createProxyFactory(plus);
    console.log( proxyMult(1,2,3,4));  //24
    console.log( proxyMult(1,2,3,4));  //24
    console.log( proxyPlus(1,2,3,4));  //10
    console.log( proxyPlus(1,2,3,4));  //10
``` 