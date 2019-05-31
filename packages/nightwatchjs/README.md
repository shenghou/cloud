## E2E测试

#### 编写测试

1. 通过[Nightwatch文档](http://nightwatchjs.org/) 熟悉相关api
2. 阅读[`TUTORIAL.md`](TUTORIAL.md)

#### 执行测试

统一通过运行`scripts/e2e.sh`启动测试，环境变量可在命令行传入或在`test/e2e/.env`中配置，配置模版参考`test/e2e/.env-tpl`。

在本地运行E2E测试可选`gui`或`headless`模式，但不论使用哪种模式，都需要先执行`npm run start`启动一个dev server。

在`scripts/e2e.sh`也会将接收到的参数传入nightwatch的命令行中，因此可以通过`--group`等参数筛选并执行对应的测试用例，也可以穿入`--suiteRetries`等参数控制测试行为。

#### 筛选、顺序执行测试

nightwatch提供了`--tag`,`--skiptags`,`--group`,`--skipgroups`,`--test`参数用于筛选测试用例，需要注意的是同一级别的正选与反选（skip）不能同时使用。

目前wizard中通过tag标明用例所对应的环境需求，如`init`，`eos-only`等，通过group对应各种资源。

通过`--group`连接多个资源时，会在资源级别按顺序执行，但具体用例文件只能按字母顺序执行。

因此需要更细颗粒度的筛选、顺序执行时，可以用nightwatch-picker项目进行case级别的挑选与拼接。

#### 测试用例编写原则

Wizard项目的E2E测试用例围绕各类资源及其相关API编写。为了保证测试可以在真实环境和mock server中都正常运行，因此编写时要避免出现断言(assertion)依赖持久化存储（如数据库）的情况，因为mock server不会实现这部分的逻辑。

例如：创建硬盘测试，如果在提交表单后通过资源列表做创建成功的断言，就将`POST`和`GET`接口耦合在了一起。因此改为通过对Notification中的状态设置断言，从而去耦合。

#### 运行环境

- Node.js v6.9.0+
- Java v1.8+
- Docker

E2E测试直接运行于Node.js中，没有经过babel转换。因此建议使用最新版本的Node.js保证语法兼容性。

#### 清理残留selenium session

由于我们在测试中开启了`end_session_on_fail = false`的参数，因此不论测试成功或失败我们都需要调用`client.end()`来主动关闭selenium session。
大部分情况下我们全局的`afterEach hook`会承担这个工作，但如果出线手动终止进程则可能会导致session残留，这将导致下次启动测试时selenium端口被占用。出现这种情况时可以通过类似`lsof -i tcp:4444`的方式查询selenium进程的pid并手动kill。
