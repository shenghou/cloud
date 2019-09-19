# 发布-订阅模式

又叫`观察者模式`，定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖它的对象都将得到通知，js中一般用事件模型来代替传统的发布-订阅模式

**实现步骤**

- 指定好谁充当发布者
- 给发布者添加一个缓存列表，用于存放回调函数以便通知订阅者
- 最后发布消息的时候，发布者会遍历整个缓存列表，依次触发里面存放的订阅者回调函数


## 售楼处买房例子

```js
    let salesOffices = {};               //定义售楼处
    salesOffices.clientList = [];        //缓存列表
    salesOffices.listen = fn => {        //订阅者
        this.clentList.push(fn);         //订阅的消息添加进缓存列表
    };
    salesOffices.trigger = () => {       //发布消息
        for(let i =0, l = this.clientList.length; i < l ; i++) {
            fn.apply(this, arguments);
        }
    };

    //测试
    salesOffices.listen( (price, squareMeter) => {
        console.log('jia ge' + price);
        console.log('mian ji' + squareMeter);
    });
    salesOffices.trigger(2000000, 100);
    salesOffices.trigger(3000000, 110);


    //上面的发布信息会将接收到的所有信息就发送出去，故需要这增加KEY来订阅只有自己感兴趣的信息
    let salesOffices = {};               //定义售楼处
    salesOffices.clientList = {};        //缓存列表
    salesOffices.listen = (key,fn) => {        //订阅者
        if(!this.clientList[key]) {
            this.clientList[key] = [];
        }
        this.clentList[key].push(fn);  
    };
    salesOffices.trigger = () => {       //发布消息
        const key = Array.prototype.shift.call(arguments),    //取出消息类型
              fns = this.clientList[key];                     //取出该消息类型的回调函数
        if(!fns || fns.length === 0) {
            return false;
        }
        for(let i =0, l = this.clientList.length; i < l ; i++) {
            fn.apply(this, arguments);
        }
    };

    //测试
    salesOffices.listen( '100ping' price=> {
        console.log('jia ge' + price);
    });
    salesOffices.listen( '80ping' ,price => {
        console.log('jia ge' + price);
    });
    salesOffices.trigger('100ping', 100);
    salesOffices.trigger('80ping', 110);
```

## 通用的发布-订阅例子

把发布-订阅的功能取出来，放在一个单独的对象内，再定义一个`installEvent`例子，给所有的对象都动态安装发布-订阅功能

```js
    const Event = {
        clientList: [],
        listen: (key, fn) => {
            if(!this.clientList[key]) {
                this.clientList[key] = [];
            }
            this.clientList[key].push(fn);
        },
        trigger: () => {
             const key = Array.prototype.shift.call(arguments),    //取出消息类型
              fns = this.clientList[key];                     //取出该消息类型的回调函数
            if(!fns || fns.length === 0) {
                return false;
            }
            for(let i =0, l = this.clientList.length; i < l ; i++) {
                fn.apply(this, arguments);
            }
        },
    };

    const installEvent = obj => {
        for(let i in Event) {
            obj[i] = Event[i];
        }
    };
    let salesOffices = {};
    installEvent(salesOffices);
    salesOffices.listen('90ping', price => {
        console.log('jiage'+ price);
    });
    salesOffices.listen('80ping', price => {
        console.log('jiage'+ price);
    });
    salesOffices.trigger('90ping', 2000000)
    salesOffices.trigger('80ping', 2000000)
```

## 取消订阅

增加`remove`模块,删除订阅者的回调函数

```js
    Event.remove = (key, fn) => {
        let fns = this.clientList[key];
        if(!fns) {          //如果Key对应的消息没被人订阅，则直接返回
            return false;
        }
        if(!fn){            //如果没有传入具体的回调函数，表示需要取消key对应消息的所有订阅
            fns && (fns.length === 0)
        } else {
            for(let l = fns.length -1; l >= 0; l--){
                const _fn = fns[l];
                if(_fn === fn) {
                    fns.splice(l, 1)       //删除订阅者的回调函数
                }
            }
        }
    };
```