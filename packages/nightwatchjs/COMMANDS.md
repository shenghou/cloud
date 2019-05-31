# 自定义指令使用方法

nightwatch 提供的指令可以满足 wizard 中大部分的测试需求，但个别情况下我们仍然需要自定义更加抽象、功能强大的指令简化测试用例的编写过程。

以下将说明部分常用自定义指令的 API 及使用场景。

## waitForModalOperable

针对部分 modal 存在初始 animation 或二次加载导致 modal 内元素 `waitElementVisible` 通过但无法准确操作，增加 `waitForModalOperable` command，用于表单渲染后延迟一定时间再进行后续操作；

`waitForModalOperable` 接收选传参数 delay ，延迟毫秒数；不传默认延迟 300ms 再进行 modal 内操作。

在所有存在 animation 或二次加载的表单操作场景中都应该使用 `waitForModalOperable`；注意避免跟 `safeClick` 的延迟重复使用。

#### 使用方法

```javascript
modal.waitForModalOperable().setValue("@element", "xxx");
```

## safeClick

nightwatch 本身提供的 click 没有对 selenium 的异常做处理，因此当点击的元素不存在时 click 指令也不会有任何提示。

这在点击异步出现的元素时可能造成问题并且难以 debug。`safeClick` 是对 click 的封装，执行 click 之前先调用 waitElementVisible，保证元素可见后再进行点击。

在所有元素可能异步出现的场景中都应该使用 `safeClick`。

#### 使用方法

```javascript
client.safeClick("@element");
```

## select/selectRow

`selectRow` 是自定义的通用表格中选择某一行的方法，`select` 则是为了兼容过去的 `resTable.select` 调用方式的 alias，两者行为一致。

界面中在操作资源时往往需要根据资源属性选择一个可以执行某种操作的资源实例，而测试用例需要同时保证真实环境和 mock 环境中都能够选择正确的资源，因此不能写死选择某个 index 资源进行操作，而应该根据表格中各列的属性进行判断。对应的判断较为复杂，因此封装 `selectRow` 避免重复的代码编写。

#### 使用方法

`selectRow` 接收两个参数，分别是 selector 和 options，其中 options 可配置内容如下：

```typescript
interface Options {
  // cb 是 selectRow 的回调函数，第一个参数为 error，第二个参数为返回的 index 数组
  // 大部分情况下 selectRow 已经处理好所需操作，不需要定义 cb
  cb: (error, indexes) => {};
  // 默认会选择第一个匹配的 .wizard-table 进行操作，当界面上有超过一个 Table 时，可以选择传入 cssPrefix 精确选择对应 Table
  cssPrefix: String;
  // Table 中可能有多个满足选择条件的资源，这时可以选择不同的策略。除了三种预置策略以外，还可以自定义选择函数。
  // 默认策略为 'first'
  picker: 'first' | 'all' | 'random' | (indexes) => {};
  // selector 将对单元格中的文本内容进行比对，但有的时候我们也需要对其中的 HTML 内容进行比对，如 icon 等。
  // 这种情况下可以通过 html: true 声明对 HTML 内容进行判断。
  html: Boolean;
  // selectRow 默认会在 mock 模式下忽略个别列的选择条件，例如名称。如需在 mock 模式下继续保留所有的选择条件，需要设置 keepSelector: true。
  keepSelector: Boolean;
  // 当 selectRow 行为不符合预期或者不确定如何设置 selector 时，可以打开 debug 模式查看更多的打印信息。
  debug: Boolean;
}
```

selector 则是 `selectRow` 的核心，包含了如何选择某一行的条件。为了使用方便，selector 提供了一些简写，常见的用法如下：

```javascript
// 选择 index
client.selectRow(1);

// 选择多个 index
client.selectRow([1, 3, 5]);

// 选择资源名称，mock 环境默认忽略这一条件
client.selectRow("my-res-name");

// 匹配方式可以为正则
client.selectRow(/^my-prefix-\d$/);

// 可以匹配多个条件，每个条件依然可以为字符串或正则
client.selectRow(["iSCSI-volume", /v3-/]);

// 匹配指定列的内容
// key 为对应列，value 部分依然可以为字符串、正则或包含字符串和正则的数组
client.selectRow({
  名称: "my-res-name",
  状态: ["健康", "维护中"],
  网关服务器: /[^\s+]/
});

// 结合 options.html = true 匹配 HTML 内容
client.selectRow(
  {
    高级功能: /BlockVolume__AdapterFormat--advanced/,
    快照数: /0/,
    关联快照: /暂无/
  },
  {
    html: true
  }
);
```

# selectCrossTabs

在有些场景中，我们需要从同个资源列表的不同 tab 中过滤某些属性，确定可选择的资源。因此基于 `selectRow` 进行二次封装，提供了一个 `selectCrossTabs` 方法。

#### 使用方法

`selectCrossTabs` 的 API 如下：

```typescript
interface TabOption {
  // selector 为和 selectRow 第一个参数一致的 selector 对象
  selector: Selector;
  // options 为和 selectRow 第二个参数一致的 options 对象
  options: Options;
  // tab 对应的选择器，即切换 tab 时点击的元素
  tabSelector?: string;
}

selectCrossTabs(TabOption[]);
```

用法如下：

```javascript
// 在卷的默认 tab 和同步复制 tab 中同时判断属性，选择可用的资源
resTable.selectCrossTabs([
  {
    selector: {
      高级功能: /BlockVolume__AdapterFormat--advanced/,
      快照数: /0/,
      卷类型: /独立克隆/
    },
    options: {
      html: true
    }
  },
  {
    selector: {
      复制状态: "暂无"
    },
    tabSelector: replicationTab.selector
  }
]);
```

# notification assertion

wizard e2e 测试中大部分用例的断言都是围绕右上角的通知展开，通常我们断言的内容包括两类：

1. 同步操作成功，弹出绿色通知。
2. 异步操作执行中，弹出蓝色通知，执行成功后变为绿色通知。

我们对应的在 notifications element 中提供了几种方法，用来快速完成断言。

#### 使用方法

同步操作断言：

```javascript
// 第一个参数为通知类型，第二个参数为通知内容
// 通知类型可以为 'success' 或 'info'，通知内容可以为字符串或正则，下同
notifications.hasNotification("success", "成功编辑块存储卷");
```

异步操作断言：

```javascript
// 异步的断言实际上为两次判断，第一次判断蓝色通知出现，第二次判断通知被替换
// replaceByNotification 接收的参数为一个类型和内容的对象，类型默认为 'success'
notifications
  .hasNotification("info", "正在创建快照")
  .replaceByNotification({ content: "创建卷快照成功" });

// 事实上这种两步式的实现保证了很强的可读性的同时也存在一定的弊端，最大的问题就是我们无法判断批量异步操作产生的通知是否正确变化
// 因此为了保证批量通知的情况可以被正确断言，还提供了另一个 API 用于启发式的监听通知的变化情况
// watchNotifications 的两个参数也都为类型和内容的对象，第一个参数中的类型默认为 'info'，第二个参数中的类型默认为 'success'
notifications.watchNotifications(
  { content: "正在关联网关服务器" },
  { content: "挂载网关服务器成功" }
);

// 不过不必担心在批量的场景中误用 replaceByNotification 造成问题，因为 replaceByNotification 监测到超过一条通知时也会提示应该改用 watchNotifications 获得更准确的结果。
```

除此之外还有一种特殊情况，即一个操作可能为同步或异步。例如客户端组初次设置 CHAP 时为异步操作，之后均为同步，测试用例中我们可以同时兼容两种场景：

```javascript
// oneOfNotifications 的参数为数组，里面每一项都是一个描述 notification 变化的对象
// from 表示起始状态，to 表示结束状态，值均为类型和内容的对象
// from.type 默认为 'info'，to.type 默认为 'success'
notifications.oneOfNotifications([
  {
    from: { content: "正在修改CHAP" },
    to: { content: "更新访问路径成功" }
  },
  {
    from: null,
    to: { content: "成功修改CHAP" }
  }
]);
```
