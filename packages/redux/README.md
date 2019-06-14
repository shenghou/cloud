# redux & react-redux & react context

基于最近的两个项目对 redux、 react-redux 和 react context 做总结

## react-redux

redux 中有三大核心，分别是 `store`、 `reducer`、`action`。其中 store 全局唯一，用于保存 app 里的 state,reducer 控制 state 状态，action 用于描述如何改变 state，compose 用于多个函数参数调用，middleware 中间件，如下所示：

```js
import {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  compose
  //   __DO_NOT_USE__ActionTypes
} from "redux";
```

### 创建 store

redux 中`createStore`函数用于创建 store，store 为一对象，其功能包括维持应用的 state，获取 state（getState），更新 state（dispatch），添加 listener（subscribe），第二个参数为初始值，第三个参数用于增强服务，多用于中间件，需要说明的是整个应用应该就只有一个 store，当需要拆分数据处理时候需要拆分 reducer 而不是创建多个 store。

```js
//@param{Func}   reducer         为一个返回下一个state的函数
//@param{any}  preloadedState    初始state
//@param{Func}  enhancer         可用于第三方的
const store = createStore(reducer, preloadedState, enhancer);
//store 返回四个方法
//dispatch,      更新state
//subscribe,
//getState,      获取state
//replaceReducer
```

### 创建 reducer

reducer 用于指定应用状态的变化如何响应 actions 并发送到 store，其为一个纯函数，接收旧的 state 和 action，返回新的 state，关于纯函数可以参考[react pure function](https://reactjs.org/docs/components-and-props.html#props-are-read-only)

```js
const todoReducer = (state, action) => {
  return state;
};
```

当然对于初始化的页面，我们一般会给 state 个默认值或给空，

```js
const initState = {
  page: 10
};
const initState = null;
const todoReducer = (state = initState, action) => {
  const type = action.type
  if(type === 'a') {
      return state + 'a';
  }
  if(type === 'b'){
      return {...state, {limit:2}}
  }
  return
};
```

redux 还提供了个 combineReducers 方法，调用没个子 reducer，合并他们的结果到一个 state 中，用对象字面量来写如下，

```js
import { combineReducers } from "redux";
const todoApp = combineReducers({
  reducer1,
  reducer2
});
export default todoApp;
```

**注意：**

- 不要直接修改 state，使用 object.assign() 或`...`
- 可能 action 未知，需传入 default

### redux dispatch

在我们创建 store 时候，store 会提供 dispath 函数，dispatch 会传入一个带 type 的 action，执行一个 listeners，并返回一个 action，dispatch 是唯一一个可以改变 state 的方式。当然 redux 还支持 dispatch 个 promise, observable 等，你需要使用第三方中间件包装你的 store。例如[`redux-thunk`](https://github.com/reduxjs/redux-thunk)

```js
function dispath(action) {
  //check  is plain object
  //check  action type
  //check  is dispatching
  listener();
  //call   listener
  return action;
}
dispatch({ type: ActionTypes.INIT });
```

### actions

既然我们知道 action 是一个带 type 的对象，那么我们可以把 action 抽象出来

```js
export const UPDATE_ALERT_RES = "UPDATE_ALERT_RES";
export function todoAction(alertRes, ...rest) {
  return {
    type: UPDATE_ALERT_RES,
    payload: alertRes,
    ...rest
  };
}
```

至此 redux 相关的就创建成功了，但是为了和 react 结合，我们需要引入[`react-redux`](https://github.com/reduxjs/react-redux)，react-redux 提供多个方法可供我们使用

### react-redux

```js
import {
  Provider,
  connectAdvanced,
  ReactReduxContext,
  connect,
  batch,
  useDispatch,
  useSelector,
  useStore,
  shallowEqual
} from "react-redux";
```

其中`provider`能让组件层级中的 connet()方法都能获得到 redux store，我们一般把这个置于根组件中，

```js
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import todoApp from "./reducers";
import App from "./components/App";
let store = createStore(todoApp);
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

另一个我们常用的函数`connect`能够连接 react 组件与 redux store，并返回一个与 store 连接的新组件

```js
connect(
  [mapStateToProps],
  [mapDispatchToProps],
  [mergeProps],
  [options]
);
```

根据以上这些，我们就可以创建一个简单的基于 redux 的 app

index.js

```js
import * as React from "react";
import { render } from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Counter from "./counter";
const initStatus = {
  count: 0
};
function reducer(state = initStatus, action) {
  switch (action.type) {
    case "INCREMENT_COUNT":
      return { count: state.count + 5 };
    case "DECREMENT_COUNT":
      return { count: state.count - 1 };
    case "RESET_COUNT":
      return { count: 0 };
    default:
      return state;
  }
}
class App extends React.Component {
  render() {
    const store = createStore(reducer);
    return (
      <Provider store={store}>
        <Counter />
      </Provider>
    );
  }
}
const rootElement = document.getElementById("root");
render(<App />, rootElement);
```

counter.js

```js
import * as React from "react";
import { connect } from "react-redux";
import { incrementCount } from "./action";
function mapStateToProps(state) {
  return {
    count: state.count
  };
}
class Counter extends React.Component {
  decreCount = () => {
    this.props.dispatch({ type: "DECREMENT_COUNT" });
  };
  increCount = () => {
    this.props.dispatch(incrementCount());
  };
  resetCount = () => {
    this.props.dispatch({ type: "RESET_COUNT" });
  };

  render() {
    return (
      <div className="App">
        <h2>Count</h2>
        <div>
          <div>
            <button onClick={this.decreCount}>-</button>
          </div>
          <div>
            <span className="count">{this.props.count}</span>
          </div>
          <div>
            <button onClick={this.increCount}>+</button>
          </div>
          <div>
            <button onClick={this.resetCount}>重置</button>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps)(Counter);
```

action.js

```js
const INCREMENT_COUNT = "INCREMENT_COUNT";
export function incrementCount() {
  return { type: INCREMENT_COUNT };
}
```

一个简单版的 react-redux 就介绍完毕，然而我们的项目一般都会比较复杂，这样简单的并不适用，故此我们做些改造

### 合并多个 reducer `combineReducers`

考虑到多个 reducer 不易操作，我们把多个 reducer 合并成一个 reduer 来方便管理（其中`APIReducer`为与 API 操作有关的 reducer，我们把与 API 相关的也抽象成一个 reducer，稍后介绍）
rootReducer.js

```js
import { routerReducer as routing } from "react-router-redux";
import { combineReducers } from "redux";
import reducer1 from "./reducer1";
import reducer2 from "./reducer2";
import reducer3 from "./reducer3";
import {
  reducer as formReducer,
  actionTypes as formActionTypes
} from "redux-form";
import { reducer as uiReducer } from "redux-ui";
import { reducers as APIReducer } from "~/API";
const rootReducer = combineReducers({
  APIReducer,
  reducer1,
  reducer2,
  reducer3,
  form: formReducer.plugin({
    HostForm: (state, action) => {
      if (!state || lodash.get(action, "XX") !== "XX") return state;
      //TODO SOMETHIN
      return state;
    }
  }),
  ui: uiReducer
});

export default rootReducer;
```

### 合并多个 action

同样与 API 相关的也抽象成 Actions 方便管理，以防 action 错误，我们使用个过滤器过滤未定义的 action
rootActions.js

```js
import lodash from "lodash";
import * as action1 from "./action1";
import * as action2 from "./action2";
import * as action3 from "./action3";
import { actions as APIActions } from "~/API";
const actions = Object.assign({}, APIActions, action1, action2, action3);
export function filterDispatchers(...args) {
  args.forEach(v => {
    if (!actions.hasOwnProperty(v)) {
      throw new Error(`filterDispatchers: No dispatcher named: ${v}`);
    }
  });
  return lodash.pick(actions, args);
}
export default actions;
```

### 配置 store

```js
import { createStore } from "redux";
import rootReducer from "../reducers";
import rootEnhancer from "./enhancer"; //处理token  license等中间件
export default function configureStore(preloadedState) {
  const store = createStore(rootReducer, preloadedState, rootEnhancer);
  if (module.hot) {
    module.hot.accept("../reducers", () => {
      const nextRootReducer = require("../reducers").default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
```

### 配置 selectors

[`reselect`](https://github.com/reduxjs/reselect)可以用于创建可记忆的、可组合的 selector 函数，高效计算衍生数据

componets.js

```js
export const selector1 = state => state.selector1;
export const selector2 = state => state.selector2;
export const selector3 = state => state.selector3;
```

selectors.js

```js
import lodash from "lodash";
import { createSelector } from "reselect";
import * as componentSelectors from "./components";
import { selectors as APISelectors } from "~/API";
const selectors = Object.assign(componentSelectors, APISelectors);
export function filterSelectors(...args) {
  return function mapStateToProps(state) {
    const inputSelectors = args.map(v => {
      const selector = `${v}Selector`;
      if (!selectors.hasOwnProperty(selector)) {
        throw new Error(`filterSelectors: No selector named: ${selector}`);
      }
      return selectors[selector];
    });
    return createSelector(
      inputSelectors,
      (...selected) => lodash.zipObject(args, selected)
    )(state);
  };
}

export default selectors;
```

常见页面结构如下，connect 多个 state、action， 再用 compose 组合，其他 HOC,socket,page 等
page.js

```js
import { compose } from "redux";
import { connect } from "react-redux";
import { filterSelectors } from "~/selectors";
import { filterDispatchers } from "~/actions";
const connector = compose(
  connect(
    filterSelectors("state"),
    filterDispatchers("action")
  ),
  Hoc()
);
class Page extends React.Componet {}
export default connector(Page);
```

### API redux

异步 redux 类似于同步，只需添加中间件处理 fetch 数据，reducer 为 fetching(state, action)，action 状态为 RESTFul API 加上返回状态
例如

```js
  const resultType = ['REQUEST','SUCCESS', 'FAILURE']；
  const methodd = ['PATCH','GET','POST','PUT']
  const actionType = PATCH_SOMEAPI_SUCCESS;

```

callAPI 可参考官方示例[`redux-promise`](https://github.com/redux-utilities/redux-promise)和[`reddid API`](https://redux.js.org/advanced/example-reddit-api)

## react context

`context`是由 react 原生的跨组件数据传输方案，其 API 包括 `React.creatContext, Context.Provider, Context.Consumer`,

### creatContext

创建 context，可以指定默认值，也可在初始页面 fetch，我们选择基本的 createContext 创建方式，指定一个共享的对象 something 和一个更新改对象的方法，updateSomething()

context.js

```js
import React from "react";
export const GlobalContext = React.createContext({
  user: {},
  updateUser() {},
  something: {},
  updateSomething: {}
});
```

在要共享的页面提供该 context，把要共享的值传出去， provider props，一般用于 dashsboard 页面，让子组件都能共享
provider.js

```js
    import {GlobalContext} from '/context'
    class page extends React.componet{
        updateUser() {
            return update
        }
        render() {
            const response  = this.fetch();
            return (
            <GlobalContext.Provider
                value={
                    user:this.response.user,
                    updateUser: this.updateUser
                }
            >
            <GlobalContext.Provider>
            )
        }
    }

```

子组件作为消费者拿到 context
consumer.js

```js
import { GlobalContext } from "/context";
class page extends React.componet {
  render() {
    <div>111</div>;
  }
}
export default props => (
  <GlobalContext.Consumer>
    {({ user, updateUser }) => (
      <Resources {...props} user={user} updateUser={updateUser} />
    )}
  </GlobalContext.Consumer>
);
```
