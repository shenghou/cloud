# pubsubjs 介绍

pubsubjs 是一个发布/订阅的 js 库，支持异步,其对外暴露的方法有

```js
{
  publish; // 发布消息传递到订阅者
  publishSync; //异步发送
  subscribe; // 订阅消息 返回token
  subscribeOnce; //订阅一次
  clearAllSubscriptions; //清除所有订阅
  clearSubscriptions; //清除指定订阅
  unsubscribe; // 删除订阅
}
```

### 发送消息

其中发送消息有两个`publish`和`publishSync`,都是调用 publish 方法，只是是否异步的区别

```js
PubSub.publish = function(message, data) {
  return publish(message, data, false, PubSub.immediateExceptions);
};

PubSub.publishSync = function(message, data) {
  return publish(message, data, true, PubSub.immediateExceptions);
};
```

其中 `publish` 方法为

```js
function publish(message, data, sync, immediateExceptions) {
  //接收字符串类型
  message = typeof message === "symbol" ? message.toString() : message;
  //注册任务分发、检查是否订阅、是否异步
  var deliver = createDeliveryFunction(message, data, immediateExceptions),
    hasSubscribers = messageHasSubscribers(message);
  if (!hasSubscribers) {
    return false;
  }
  if (sync === true) {
    deliver();
  } else {
    setTimeout(deliver, 0);
  }
  return true;
}
```

而`createDeliveryFunction`为

```js
function createDeliveryFunction(message, data, immediateExceptions) {
  return function deliverNamespaced() {
    var topic = String(message),
      position = topic.lastIndexOf(".");
    //分发信息
    deliverMessage(message, message, data, immediateExceptions);
    //逐层下发   a.b   a.c     a.b.c
    while (position !== -1) {
      topic = topic.substr(0, position);
      position = topic.lastIndexOf(".");
      deliverMessage(message, topic, data, immediateExceptions);
    }
  };
}
```

再看 `deliverMessage`

```js
function deliverMessage(
  originalMessage,
  matchedMessage,
  data,
  immediateExceptions
) {
  //多个订阅
  var subscribers = messages[matchedMessage],
    //是否立即执行
    callSubscriber = immediateExceptions
      ? callSubscriberWithImmediateExceptions
      : callSubscriberWithDelayedExceptions,
    s;

  if (!messages.hasOwnProperty(matchedMessage)) {
    return;
  }

  for (s in subscribers) {
    if (subscribers.hasOwnProperty(s)) {
      //执行订阅相关的任务
      callSubscriber(subscribers[s], originalMessage, data);
    }
  }
}
```

其中 `callSubscriber` 有两个 `callSubscriberWithDelayedExceptions` 、`callSubscriberWithImmediateExceptions`都是具体执行订阅任务

```js
function callSubscriberWithImmediateExceptions(subscriber, message, data) {
  subscriber(message, data);
}
function callSubscriberWithDelayedExceptions(subscriber, message, data) {
  try {
    subscriber(message, data);
  } catch (ex) {
    setTimeout(throwException(ex), 0);
  }
}
```

### 订阅消息

**subscribe**

```js
PubSub.subscribe = function(message, func) {
  //订阅时候需是个执行动作
  if (typeof func !== "function") {
    return false;
  }
  message = typeof message === "symbol" ? message.toString() : message;
  //处理未注册的消息
  if (!messages.hasOwnProperty(message)) {
    messages[message] = {};
  }
  var token = "uid_" + String(++lastUid);
  messages[message][token] = func;
  return token;
};
```

**subscribeOnce**

```js
PubSub.subscribeOnce = function(message, func) {
  var token = PubSub.subscribe(message, function() {
    //取消订阅，然后执行
    PubSub.unsubscribe(token);
    func.apply(this, arguments);
  });
  return PubSub;
};
```

### 取消订阅

**clearAllSubscriptions**

```js
PubSub.clearAllSubscriptions = function clearAllSubscriptions() {
  //messages重置
  messages = {};
};
PubSub.clearSubscriptions = function clearSubscriptions(topic) {
  var m;
  for (m in messages) {
    // 找到topic并删除该message
    if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0) {
      delete messages[m];
    }
  }
};
```

### 清除订阅

**unsubscribe**

```js
PubSub.unsubscribe = function(value) {
  //多层清除
  var descendantTopicExists = function(topic) {
      var m;
      for (m in messages) {
        if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0) {
          return true;
        }
      }
      return false;
    },
    isTopic =
      typeof value === "string" &&
      (messages.hasOwnProperty(value) || descendantTopicExists(value)),
    isToken = !isTopic && typeof value === "string",
    isFunction = typeof value === "function",
    result = false,
    m,
    message,
    t;
  // topic的清除
  if (isTopic) {
    PubSub.clearSubscriptions(value);
    return;
  }

  for (m in messages) {
    if (messages.hasOwnProperty(m)) {
      message = messages[m];
      //token清除
      if (isToken && message[value]) {
        delete message[value];
        result = value;
        break;
      }
      //function 清除
      if (isFunction) {
        for (t in message) {
          if (message.hasOwnProperty(t) && message[t] === value) {
            delete message[t];
            result = true;
          }
        }
      }
    }
  }
  return result;
};
```
