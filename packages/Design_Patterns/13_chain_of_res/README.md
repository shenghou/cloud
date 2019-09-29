# 责任链模式

使多个对象都有机会处理请求，从而避免请求的发送者之间的耦合关系，将这些对象链成一条链，并沿着这条链传递该请求，直到有一个对象处理为止。


## 购买手机的例子

```js
    /**
    *  orderType  订单类型 1=>500   2=>200   3=>普通
    *  pay 是否支付
    *  stock 库存
    */


    // 普通的，多次判断
    const order = (orderType, pay, stock) => {
        if(orderType === 1) {
            if(pay === true) {
                console.log('500, 有优惠')
            } else {
                if(stock > 0 ) {
                    console.log('普通购买，无哟嚯')
                } else {
                    console.log('库存不足')
                }
            }
        }else if(orderType === 2) {
            if(pay === true) {
                console.log('200, 有优惠')
            } else {
                if(stock > 0 ) {
                    console.log('普通购买，无哟嚯')
                } else {
                    console.log('库存不足')
                }
            }
        }else if(orderType === 3) {
            if(stock > 0 ) {
                console.log('普通购买，无哟嚯')
            } else {
                console.log('库存不足')
            }
        }
    }；


    //采用职责链，拆分订单函数
    const order500 = (oderType, pay, stock) => {
        if(orderTpye === 1 && pay) {
            console.log('500, 有优惠')
        } else {
            order200(oderType, pay, stock);   //虽然拆开，单还是耦合
        }
    };

    const order200 = (oderType, pay, stock) => {
        if(orderTpye === 1 && pay) {
            console.log('200, 有优惠')
        } else {
            orderNormal(oderType, pay, stock);
        }
    };

    const orderNormal = (oderType, pay, stock) => {
        if(stock > 1) {
            console.log('普通购买，无优惠券')
        } else {
            console.log('库存不足')
        }
    };


    //灵活可拆分的职责链节点
    //将函数包装进职责链，定义构造函数Chain, 在new Chain的时候传递的参数即为需要被包装的函数，同时还有实例属性 this.successor
    //  Chain.prototype.setNextSuccessor   指定在链中的下一个节点
    //  Chain.prototype.passRequest        传递请求给某个节点
     const order500 = (oderType, pay, stock) => {
        if(orderTpye === 1 && pay) {
            console.log('500, 有优惠')
        } else {
            return 'nextSuccessor'
        }
    };

    const order200 = (oderType, pay, stock) => {
        if(orderTpye === 1 && pay) {
            console.log('200, 有优惠')
        } else {
            return 'nextSuccessor'
        }
    };

    const orderNormal = (oderType, pay, stock) => {
        if(stock > 1) {
            console.log('普通购买，无优惠券')
        } else {
            console.log('库存不足')
        }
    };

    const Chain = fn => {
        this.fn = fn;
        this.successor = null;
    };

    Chain.prototype.setNextSuccessor = successor => {
        return this.successor = successor;
    };

    Chain.prototype.passRequest = () => {
        let ret = this.fn.apply(this, arguments);
        if(ret === 'nextSuccessor') {
            return this.successor && this.successor.passRequest.apply(this.successor, arguments);
        }
        return ret;
    }

    const charinOrder500 = new Chain(order500);
    const charinOrder200 = new Chain(order200);
    const charinOrderNormal = new Chain(order500);
    
    charinOrder500.setNextSuccessor(charinOrder200);
    charinOrder200.setNextSuccessor(charinOrderNormal);

    charinOrder500.passRequest(1, true, 500);
    charinOrder500.passRequest(2, true, 500); 
```


## 用AOP实现

```js
    Function.prototype.after = fn => {
        let self = this;
        return () => {
            let ret = self.apply(this, arguments);
            if(ret === 'nextSueccessor') {
                return fn.apply(this, arguments);
            }
            return ret;
        }
    }

    const order = order500.after(order200).after(orderNormal);
    order(1, true, 500);
```