# 迭代器模式

迭代器模式是指提供一种方法顺序访问一个聚合对象中个元素，而又不需要暴露该对象的内部表示。

## each

```js
    //实现简单的迭代器
    const each = (array, callback) => {
        for(let i =0, l = array.length; i < l; i++) {
            callback.call(arrayp[i], i, array[i]);
        }
    };
    each([1,2,3,4], function(i, n) {
        console.log(i, n)
    });
```

## 外部迭代器

```js
    const Iterator = obj => {
        let current = 0;
        const next = ()=> {
            current +=1;
        };
        const isDone = () => {
            return current >= obj.length;
        };
        const getCurrItem = () => {
            return obj[current];
        };
        return {
            next,
            isDone,
            getCurrItem,
        }
    };
    const compare = (iterator1, iterator2) => {
        while(!iterator1.isDone() && !iteratior2.isDone()){
            if(iterator1.getCurrItem() !== iterator2.getCurrItem()) {
                throw new Error('1 he 2 bu deng')
            }
            iterator1.next();
            iterator2.next();
        }
        alert('1 he 2 xiang deng')
    };
    const iterator1 = Iterator([1,2,3,4]);
    const iterator2 = Iterator([1,2,3,4]);
    compare(iterator1, iterator2);
```

## 倒序迭代器

```js
    const reverseEach = (ary, callback) => {
        for (let i = ary.length -1; i >=0; i--) {
            callback(i, ary[i]);
        }
    };
    reverseEach([0,1,3], function(i, n){
        console.log(i,n)
    });
```