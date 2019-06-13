# react-redux && react context

基于最近参与的两个项目对 react-redux 和 react context 做总结

redux 中有三大核心 store、 reducer、action

其中 store 全局唯一，用于保存 app 里的 state，

### 创建 store

```js
import {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  compose,
  __DO_NOT_USE__ActionTypes
} from "redux";
//@param{Func}   reducer          为一个返回下一个state的函数
//@param{any}  preloadedState   初始state
//@param{Func}  enhancer         可用于第三方的
const store = createStore(reducer, preloadedState, enhancer);
//store 返回四个方法
//dispatch,      更新state
//subscribe,
//getState,      获取state
//replaceReducer
```

至此 store 就创建成功了，但是为了和 react 结合，我们需要引入`react-redux`；
react-redux 提供多个方法可供我们使用

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

其中`provider`能让所有容器组件都可以访问 store

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

从 createStore 函数的参数中我们可以看出需要传入三个参数，reducer，preloadedState，enhancer，那么 reduer 函数是啥呢，认识 reducer 之前我们先看看 js 函数中的 reduce 方法

array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
其中第一个参数为执行每个数组元素的函数，第二个为初始值；

### 创建 reducer

reducer 也与其类型，接收一个旧的 state 和 action，返回新的 state

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

**注意：**

- 不要直接修改 state，使用 object.assign() 或`...`
- 可能 action 未知，需传入 default

### redux dispatch

在我们创建 store 时候，store 内置有 dispath 函数，dispatch 会传入一个带 type 的 action，执行一个 listeners，并返回一个 action

```js
function dispath(action) {
  //check  is plain object
  //check  action type
  //check  is dispatching
  listener();
  //call   listener
  return action;
}
```

### actions

既然我们知道 action 是一个带 type 的对象，那么我们可以吧 action 抽象出来

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

根据以上这些，我们就可以创建一个简单的 app

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

一个简单版的 react-redux 就介绍完毕

然而我们的项目都会比较复杂，这样简单的并不适用

### 合并多个 reducer `combineReducers`

考虑到多个 reducer 不易操作，我们把多个 reducer 合并成一个 reduer 来方便管理（APIReducer，我们把与 API 相关的也抽象成一个 reducer，稍后介绍）
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

同样与 API 相关的也抽象成 Actions 方便管理
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
