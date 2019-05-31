## Wizard E2E tests tutorial

> 这份tutorial将讲解一个基础的nightwatch测试用例是如何一步步被抽象／改进成一个wizard中合格的测试用例。因此其中将很少重复出现nightwatch官方文档中已有的部分，重在讲解wizard测试代码的编写思路。

#### 准备工作

为保证测试代码在各种模式下都能正常运行，需要配置以下环境：

- Node.js v6.9.0+
- Java v1.8+
- Docker
- Wizard项目代码

#### 读懂 `nightwatch.conf.js`

Wizard的E2E测试代码基于nightwatch框架编写，而`nightwatch.conf.js`文件则是其配置文件，包含了**文件路径配置、selenium配置以及测试配置**这几部分。

文件路径配置如下，决定了nightwatch从哪些文件系统中读取我们的测试代码以及输出测试结果，也可以清晰的看到测试部分代码的目录结构。

```json
"src_folders": ["test/e2e/specs"],
"output_folder": "test/e2e/reports",
"custom_assertions_path": ["test/e2e/custom-assertions"],
"custom_commands_path": ["test/e2e/custom-commands"],
"page_objects_path": ["test/e2e/page-objects"],
"globals_path": "test/e2e/globals.js",
```

selenium配置如下，帮助nightwatch找到selenium server的启动文件和浏览器的驱动，并决定是否新建selenium进程以及连接的端口等。nightwatch、selenium、浏览器驱动几者间的关系请参考附录［Linux系统下运行Selenium］。

```json
"selenium": {
  "start_process": C.IS_GUI,
  "server_path": "node_modules/selenium-server/lib/runner/selenium-server-standalone-3.0.1.jar",
  "port": C.SLM_PORT,
  "cli_args": {
    "webdriver.chrome.driver": `bin/chromedriver_${C.PLATFORM}`,
    "webdriver.gecko.driver": `bin/geckodriver_${C.PLATFORM}`,
  }
}
```

测试配置较多，包含浏览器配置、test worker配置、输出格式以及重试机制等。以下仅列出与编写测试代码相关的`launch_url`配置，这将决定浏览器从什么url开始我们的测试。

```json
"launch_url": `http://${C.APP_HOST}:${C.APP_PORT}?PROXY=${C.API_HOST}:${C.API_PORT}`
```

#### 编写第一个测试

根据nightwacth的api文档，编写wizard项目的登陆测试

```javascript
// login_test.v1.js
// v1 means this is the first version of our login test
module.exports = {
  'Test login' (client) {
    client
      .url(this.api.launchUrl + '/login')
      .waitForElementVisible('input[name=name]')
      .setValue('input[name=name]', 'admin')
      .setValue('input[name=password]', 'admin')
      .click('button[type=submit]')
      .waitForElementNotPresent('input[name=name]')
      .end();
  },
};
```

运行成功！但仍然存在一些潜在的问题需要解决。

#### 使用Page object

在`login_test.v1.js`里我们直接使用css选择器来定位需要操作的dom元素，其中`input[name=name]`被使用了3次。一旦wizard代码中对应部分进行修改，我们可能就需要在测试代码中大批量的修改对应css选择器，这显然难以维护。

一个简单的维护方法是在测试代码中用`const nameInputSelector = 'input[name=name]'`这样的方式将相同的css选择器统一成一个变量，但nightwatch提供了一个拓展性更强的方案——Page object来解决这个问题。

以下代码就是用Page object将`login_test.v1.js`所有用到的选择器以及launchUrl都封装进Page object中。

```javascript
// login.js
// 登录页Page object
module.exports = {
  url() {
    return this.api.launchUrl + '/login';
  },
  elements: {
    name: 'input[name=name]',
    password: 'input[name=password]',
    submit: 'button[type=submit]',
  },
};
```

之后在登录测试中我们就可以调用Page object改进我们的代码：

```javascript
// login_test.v2.js
module.exports = {
  'Test login' (client) {
    const loginPage = this.page.login();
    loginPage.navigate()
      .waitForElementVisible('@name')
      .setValue('@name', 'admin')
      .setValue('@password', 'admin')
      .click('@submit')
      .waitForElementNotPresent('@name')
      .end();
  },
};
```

这就帮助我们把所有css选择器统一管理，并且能够为css选择器增加更加语意化的命名，这在css选择器非常冗长、难以辨认时显得尤为重要。

#### 拓展Page object

一个Page object下包含`url`,`elements`,`sections`,`commands`这几个部分，其中`sections`可以继续深层嵌套`elements`和`commands`，这就让Page object自身的拓展性大大提高。

**每个`section`自身有对应的css选择器，并且该选择器会作为父级选择器继续作用在其子级elements的选择器上**，善用`section`可以避免写出过长的css选择器，也能在测试代码中调用时更直接的表现每个操作的实际含义。

```javascript
// Bad

// testPage.js
module.exports = {
  elements: {
    modal: '.modal-dialog',
    submit: 'button[type="submit"]',
  },
};
// test.js
module.exports = {
  'Test submit a form in modal' (client) {
    const page = client.page.testPage();
    // This is bad because we could not realize we are submitting a form in a modal.
    page
      .waitForElementVisible('@modal')
      .click('@submit')
      .waitForElementNotVisible('@modal');
  }
}

// Good
// testPage.js
module.exports = {
  sections: {
    selector: '.modal-dialog',
    elements: {
      submit: 'button[type="submit"]',
    },
  },
};
// test.js
module.exports = {
  'Test submit a form in modal' (client) {
    const page = client.page.testPage();
    page.waitForElementVisible('@modal');

    const modal = page.section.modal;
    modal.click('@submit');
    page.waitForElementNotVisible('@modal');
  }
}
```

除了Page object本身的拓展性之外，我们还需要提供跨文件级别的拓展性。一些常用的`section`，例如`navigation`,`modal`等，我们需要在各个多个Page object中复用。因此在`test/e2e/utils`文件系统下我们提供了`page-object-generator.js`用于编写和存放多个Page object中需要复用的`section`片段。

#### 自定义command

当登录这一操作作为一个测试用例时，`login_test.v2.js`中的写法是令人满意的。但当登录作为一个单独的指令，需要在每一个测试用例开始前被执行的话我们则需要把它封装为一个与nightwatch command平级的command以满足我们的需求。

nightwatch提供了custom-commands的功能，我们通过它来进行封装：

```javascript
// login.v1.js
// custom command: login
exports.command = function () {
  // 'this' point to client
  const loginPage = this.page.login();
  loginPage.navigate()
    .waitForElementVisible('@name')
    .setValue('@name', 'admin')
    .setValue('@password', 'admin')
    .click('@submit')
    .waitForElementNotPresent('@name');

  // remember to return 'this' after all then we could call commands chainable
  return this;
};
```

在这之后，我们就可以在任何测试用例代码中直接使用`client.login()`来进行登录这一操作了。

```javascript
// login_test.v3.js
module.exports = {
  'Test login' (client) {
    client.login().end();
  },
};
```

#### 使用hook

和大部分测试框架一样，nightwatch也提供了`before`,`beforeEach`,`after`,`afterEach`等hook给我们调用。以登录为例，我们可以将登陆操作看为一个测试用例的前置操作，所以我们可以将它放在测试用例的`before` hook内。

```javascript
// visit_dashboard_test.js 
module.exports = {
  before (client) {
    client.login();
  },
  'Test check dashboard lookks ok' (client) {
    // do you test here
    // after test
    client.end();
  },
};
```

事实上，nightwatch除了文件级别的hook，还提供全局级别的hook。我们没有将登陆放在全局hook是因为部分测试如初始化并不需要登陆。但每个测试结束之后我们都需要调用`client.end()`关闭浏览器，这一操作适合放在全局hook中。

```javascript
// globals.js
module.exports = {
  afterEach (client) {
    client.end();
  },
};

// login_test.v4.js
module.exports = {
  'Test login' (client) {
    client.login();
  },
};
```

#### 动态外部输入

在我们自定义的login command中，我们依然使用这样的方式输入值：

```javascript
setValue('@name', 'admin')
setValue('@password', 'admin')
```

这一方面会导致各种变量散落在各个测试用例文件中难以维护，另一方面也限制了我们无法动态的传入变量，因此我们将所有变量统一写在`globals.js`中，并且允许在环境变量中定义路径并将整个外部输入的配置文件合入`globals.js`中。

**需要注意的是，`globals.js`是nightwatch可识别的文件，该模块下的值会被挂载在nightwatch实例上，因此我们需要将自定义的变量放在一个统一命名空间下，避免与nightwatch自身变量发生冲突。**

```javascript
// globals.js
const lodash = require('lodash');
const path = require('path');
let inputs = {};
// read external input file from process.env.INPUT_PATH
if (process.env.INPUT_PATH) {
  inputs = require(path.join(__dirname, process.env.INPUT_PATH));
}

const DEFAULT_INPUTS = {
  username: 'admin',
  password: 'admin',
};

module.exports = {
  defaultInputs: lodash.merge(DEFAULT_INPUTS, inputs),
  afterEach (client) {
    client.end();
  },
};

// login.v2.js
exports.command = function () {
  // We can access global module in any test spec via client.globals.
  const { username, password } = this.globals.defaultInputs;

  const loginPage = this.page.login();
  loginPage.navigate()
    .waitForElementVisible('@name')
    .setValue('@name', username)
    .setValue('@password', password)
    .click('@submit')
    .waitForElementNotPresent('@name');

  return this;
};
```

#### execute & executeAsync

当我们需要在测试浏览器中执行js代码时，可以使用`execute`和`executeAsync`命令，这让我们可以更灵活的编写测试，补充nightwatch缺失的一些功能。

例如我们希望判断一个dom元素是否存在，如果存在则执行另一个操作，如果不存在则终止。但不论元素是否存在都是正常的测试结果，这时候我们就不希望用`waitForElementPresent(el)`或`expect(el).to.be.present()`，因为当元素不存在时这会抛出一次失败的断言，将用例测试结果标为失败。而nightwatch自身的`isVisible`又只能判断元素是否可见，所以我们可以通过`execute`拓展出一个相似的`isPresent`指令。

```javascript
// Check whether an element is present by css selector.
exports.command = function(selector, cb) {
  this.execute(function(selector) {
    const el = document.querySelector(selector);
    return !!el;
  }, [selector], cb);
  return this;
};
```

而如果我们在浏览器中执行的js代码需要异步的返回一个结果时，我们可以使用`executeAsync`。

```javascript
// Check whether an element is present by css selector.
// With a 5 seconds wait time
exports.command = function(selector, cb) {
  this.executeAsync(function(selector, done) {
    const waitTime = 5000;
    const tick = 500;
    let count = 0;
    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      count += tick;

      if (el || count >= waitTime) {
        clearInterval(timer);
        done(!!el);
      }
    }, tick);
  }, [selector], cb);
  return this;
};
```

nightwatch中支持异步的指令或hook都是通过提供一个额外的`done`参数，用于确定异步执行完毕以及结果。

**需要注意的是execute和executeAsync传入浏览器的js代码不会被babel之类的工具处理，因此需要保证一定的兼容性。**

#### 正式编写测试用例

在理解以上内容以及熟悉nightwatch相关api后，就可以遵循以下步骤正式编写测试用例了。

1. 启动开发环境或部署好的真实环境，明确测试用例对应的操作步骤。
2. 新建或更新对应页面的Page object，按照正确的层级关系将所需用到的css选择器存放在Page object中。
3. 将需要输入的外部变量存放在`globals.js`的`DEFAULT_INPUTS`中。
4. 在`test/e2e/specs`内对应的资源文件系统下新建或更新测试用例代码，一般我们将创建相关测试统一写在`create_xxx_test.js`中，操作相关测试写在`operate_xxx_test.js`中，删除相关测试写在`delete_xxx_test.js`中。
5. 运行编写的测试用例，确保与测试目的表现一致。
6. 在mock环境中再次运行编写的测试用例，确保测试用例可以通过mock环境下的CI测试。如果出现mock server模拟数据不正确导致的测试用例无法通过，可以在**Mana**项目中通过pull request或者issue的方式提出并修正。
7. 提交代码，等待review后合入。

#### 通过Launch Url输入proxy

在测试过程中，我们可以通过url中的query string向wizard输入proxy server，从而实现API访问Mana等需求。
这是因为redux-demon在打包过程中会对当前build环境进行检测，当TEST_ENV为'jenkins'时，将会识别proxy。[redux-demon pr](http://github.xsky.com/front-end/redux-demon/pull/23)

```javascript
// login.js
// 通过setUrl设置launchUrl
const setUrl = require('test/e2e/utils/setUrl');

module.exports = {
  url() {
    return setUrl(this.api.launchUrl, {
      pathname: '/login',
    });
  },
  elements: {
    name: 'input[name=name]',
    password: 'input[name=password]',
    submit: 'button[type=submit]',
  },
};
```

#### Trouble shooting

- WaitForElementPresent VS WaitForElementVisible

  Nightwatch中将可能存在的异步操作进行了简化，主要通过`WaitForElementPresent`和`WaitForElementVisible`方法来“等待”需要异步操作的元素出现，其内在实现是通过轮询不断检查元素是否符合断言条件。

  **需要注意的是**这两个方法并不等价，错误的使用可能会导致测试失败。

  Nightwatch中受限于Selenium，不允许操作**不可见**的节点。例如Notification有一个进场动画，如果通过`WaitForElementPresent`判断，那么也许DOM节点中已经创建了对应的元素，但是`click`操作会执行失败，因为元素还不可见。

  同理，一个多级DropDown中所有MenuItem本身是存在的，因此`WaitForElementPresent`会判断元素已经存在，但直接执行`click`等操作依然失败，需要通过点击多级菜单使目标MenuItem可见时才可正常执行。

- 在非mock环境中等待时间不足

  在环境变量中我们通过`API_ENV=mock|production`来区分测试是否运行在mock环境下。如果在非mock环境中运行测试，需确认`API_ENV=production`，这将会给`waitForElementXXX`类型的指令提供更长的等待时间。

- css选择器没有生效

  nightwatch中的css选择器与浏览器中的完全一致，因此可以在浏览器的console中进行调试，验证css选择器是否正确的选择了目标dom元素。

- 测试用例卡住无法确认原因

  如果没有显式的用断言确认，那么可能会出现测试用例超时后失败但没有明确的错误断言。例如`click`某个dom元素前没有`waitForElementPresent`确认该元素存在，那么log输出中不会提示`click`操作失败。

  因此遇到这类问题时，一方面可以增加更详细的断言，定位执行失败的代码位置，另一方面则可以在运行时增加`--verbose`参数，这会在log中打印所有selenium日志，可以通过每一个API请求的request和response更好的定位问题。

#### 附录

1. [E2E测试及Mock Server方案规划]: http://wiki.xsky.com/pages/viewpage.action?pageId=19936854

2. [Linux系统下运行Selenium]: http://wiki.xsky.com/pages/viewpage.action?pageId=20679311

3. [E2E 测试基础设施 FAQ]: http://wiki.xsky.com/pages/viewpage.action?pageId=20684224

4. [Nightwatch文档]: http://nightwatchjs.org/