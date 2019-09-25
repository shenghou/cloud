# 命令模式

将一些功能做些封装，是回调函数的一个面向对象的替代品



## js中的命令模式

点击的例子，点击按钮执行功能

```js
    const bindClick = (button, func) => {
        button.onclick = func;
    }；

    const MenuBar = {
        refresh: () => {
            console.log('刷新菜单页面');
        }
    };

    const SubMenu = {
        add: () => {
            console.log('增加子菜单');
        },
        del: () => {
            console.log('删除子菜单');
        },
    }；
    bindClick(button1, MenuBar.refresh);
    bindClick(button2, MenuBar.add);
    bindClick(button3, MenuBar.del);



    //对于在使用闭包的命令模式实现中，接收者被封闭在闭包产生的环境中，执行命令的操作可以更加简单，仅仅执行回调函数即可。
    const setCommand = (button, func) => {
        button.onclick = () => {
            func();
        }
    };

    const MenuBar = {
        refresh: () => {
            console.log('刷新菜单页面');
        }
    };

    const RefreshMenuBarCommand = receiver => {
        return () => {
            receiver.refresh();
        }
    };

    const refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);

    setCommand(button1, refreshMenuBarCommand);


    //由于可能存在撤销等，最好将执行函数改为调用`execute`方法
    const setCommand = (button, command) => {
        button.onclick = () => {
            command.execute();
        }
    };

    const MenuBar = {
        refresh: () => {
            console.log('刷新菜单页面');
        }
    };

    const RefreshMenuBarCommand = receiver => {
        return {
            execute: () => {
                receiver.refresh();
            }
        }
    };

    const refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);

    setCommand(button1, refreshMenuBarCommand);

```


## 撤销与重做

原理是利用一个历史列表堆栈，重复执行

```js
    const Ryu = {
        attack: () => {console.log('攻击')},
        defense: () => {console.log('防御')},
        jump: () => {console.log('跳')},
        crouch: () => {console.log('蹲下')},
    };

    const makeCommand = (receiver, state) => {   //创建命令
        return () => {
            receiver[state]();
        }
    };

    const commands = {
        '119', 'jump',
        '115', 'crouch',
        '97', 'defense',
        '100', 'attack',
    };

    let commandStack = [];  //保存命令

    document.onkeypress = ev => {
        const keyCode = ev.keyCode,
              command = makeCommand(Ryu, commands[keyCode]);
        if(command) {
            command();
            commandStack.push(command);
        }
    };

    document.getElementById('replay').onclick = () => {
        let command;
        while(command = commandStack.shift()){
            command();
        }
    };
```

## 宏命令

是一组命令的集合，通过执行宏命令的方式，可以一次执行一批命令

```js
    const colseDoorCommand = {
        execute: () => {
            console.log('关门')
        }
    };

    const openPcCommand = {
        execute: () => {
            console.log('开电脑')
        }
    }

    const openQQCommand = {
        execute: () => {
            console.log('登录QQ')
        }
    };

    const MacroCommand = () => {
        return {
            commandList: [],
            add: command => {
                this.commandList.push(command);
            },
            execute: () => {
                for(let i = 0, command; command = this.commandList[i++]){
                    command.execute()
                }
            }
        }
    };
    const macroCommand = MacroCommand();
    macroCommand.add(closeDoorCommand);
    macroCommand.add(openPcCommand);
    macroCommand.add(openQQCommand);

    macroCommand.execute();
```