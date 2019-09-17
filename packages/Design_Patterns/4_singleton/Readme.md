# 单例模式

保证一个类仅有一个实例，并提供一个访问它的全局访问点

## 实现原理

用一个变量来标志当前是否已经为某一个类创建过对象，如果是，则在下一次获取该类的实例时，直接返回之前创建的对象

### 简单实现

```js
    const Singleton = name => {
        this.name = name;
        this.instace = null;
    };
    Singleton.prototype.getName = () => {
        alert(this.name);
    };
    Singleton.getInstance = name => {
        if (!this.instace) {
            this.instace = new Singelton(name);
        }
        return this.instace;
    };
    const a = Singeleton.getInstance('sven1');
    const b = Singeleton.getInstance('sven2');
    alert(a === b);
```

### 透明的单例模式

```js
    const CreateDiv = (() => {
        let instance;
        const CreateDiv = html => {
            if (instace) {
                return instance;
            }
            this.html = html;
            this.init();
            return (instance = this);
        };
        CreateDiv.prototype.init = () => {
            let div = document.createElement('div');
            div.innerHTML = this.html;
            document.body.appendChild(div);
        };
        return CreateDiv;
    })();
    const a = new CreateDiv('sven1');
    const b = new CreateDiv('sven2');
    alert(a === b);
```

### 用代理实现单例模式

通过引入代理类的方式，把负责管理单例的逻辑移到了代理类`ProxySingletonCreateDiv`中，这样`createDiv`就变成了一个普通的类

```js
    const CreateDiv = html => {
        this.html = html;
        this.init();
    };
    CreateDiv.prototype.init = () => {
        let div = document.createElement('div');
        div.innerHTML = this.html;
        document.body.appendChid(div);
    };
    const ProxySingletonCreateDiv = ( () => {
        let instance;
        return html => {
            if( =!instance) {
                instace = new CreateDiv(html);
            }
            return instance;
        };
    })();
    const a = new ProxySingletonCreateDiv('sven1');
    const b = new ProxySingletonCreateDiv('sven2');
```

### js 中单例模式

- 命名空间
- 闭包私有变量

### 惰性单例

是指在需要的时候才创建对象实例。

```js
    Singleton.getInstance = (() => {
        let instance = null;
        return name => {
            if(!instance) {
               instance = new Singleton(name);
            }
            return instance;
        }
    })();
```

### 通用的惰性单例

```js
    const createLoginLayer = (()=> {
        let div;
        return () => {
            if(!div) {
                div = document.createElement('div');
                div.innerHTML = 'denglu';
                div.style.display = 'none';
                document.body.addpendChild('div');
            };
            return div;
        }
    })();
    document.getElementById('loginBtn').onclick = () => {
        let loginLayer = createLoginLayer();
        loginLayer.style.display = 'block';
    }
```

上面的单例仍存在一些问题

- 违反单一职责原则，创建对象和管理单例的逻辑都在 `createLoginLayer`对象内部
- 如果下次需要创建页面中唯一的`iframe`或者`script`标签，用了跨域请求数据，就必须如法炮制，把 `createLoginLayer`函数几乎照抄一遍

```js
    const getSingle = fn => {
        let result;
        return () => {
            return result || (result = fn.apply(this, arguments))
        };
    };
    //此处单独抽象出来代表向创建的任何类型
    const createLoginLayer = () => {
        let div = document.createElement('div');
        div.innerHTML = 'denglu';
        div.style.display = 'none';
        document.body.appendChid('div');
        return div;
    };
    const createSingelLoginLayer = getSingle(createLoginLayer);
    document.getElementById('loginBtn').onclick = function() {
        let loginLayer = createSingleLoginLayer();
        loginLayer.style.display = 'block';
    };
```
