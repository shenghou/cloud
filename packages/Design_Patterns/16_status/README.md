# 状态模式

允许一个对象在其内部状态改变时改变他的行为，对象看起来似乎修改了它的类。

```js
    const Light = function() {
        this.currState = FSM.off;
        this.button = null;
    }

    Light.prototype.init = function() {
        let button = document.createElement('button'),
            self = this;
        
        button.innerHTML = '已关等';
        this.button = document.body.appendChild(button);

        this.button.onclick = function() {
            self.currState.buttonWasPressed.call(self);
        }
    }

    const FSM = {
        off: {
            buttonWasPressed: function() {
                console.log('关等');
                this.button.innerHTML = '下一此按我是开灯';
                this.currState = FSM.on;
            }
        },
        on: {
            buttonWasPressed: function() {
                console.log('开灯');
                this.button.innerHTML = '下一次按我是关掉';
                this.currState = FSM.off;
            }
        }
    }

    const light = new Light();
    light.init()
```