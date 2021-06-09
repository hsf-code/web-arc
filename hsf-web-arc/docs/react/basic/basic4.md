---
title: 基础（四）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# redux

## 1. Redux应用场景

- 随着 JavaScript 单页应用开发日趋复杂,管理不断变化的 state 非常困难
- Redux的出现就是为了解决state里的数据问题
- 在React中，数据在组件中是单向流动的
- 数据从一个方向父组件流向子组件(通过props)，由于这个特征，两个非父子关系的组件（或者称作兄弟组件）之间的通信就比较麻烦

![redux-wrong](http://img.zhufengpeixun.cn/redux-wrong.png)

## 2. Redux设计思想

- Redux是将整个应用状态存储到到一个地方，称为store
- 里面保存一棵状态树state tree
- 组件可以派发dispatch行为action给store,而不是直接通知其它组件
- 其它组件可以通过订阅store中的状态(state)来刷新自己的视图

![redux-flow](http://img.zhufengpeixun.cn/redux-flow.png)

## 3. Redux三大原则

- 整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中
- State 是只读的，惟一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象 使用纯函数来执行修改，为了描述action如何改变state tree ，你需要编写 reducers
- 单一数据源的设计让React的组件之间的通信更加方便，同时也便于状态的统一管理

## 4. 原生计数器

- [redux](https://github.com/reduxjs/redux)
- [createStore.ts](https://gitee.com/zhufengpeixun/redux/blob/master/src/createStore.ts)

```js
create-react-app zhufeng_redux_prepare
cd zhufeng_redux_prepare
cnpm install redux -S
yarn start
```

### 4.1 public\index.html

public\index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <div id="counter">
      <p id="counter-value">0</p>
      <button id="add-btn">+</button>
      <button id="minus-btn">-</button>
    </div>
  </body>
</html>
```

### 4.2 src\index.js

src\index.js

```js
import { createStore} from './redux';
let counterValue = document.getElementById('counter-value');
let incrementBtn = document.getElementById('add-btn');
let decrementBtn = document.getElementById('minus-btn');

const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
let initState = { number: 0 };

const reducer = (state = initState, action) => {
    switch (action.type) {
        case INCREMENT:
            return { number: state.number + 1 };
        case DECREMENT:
            return { number: state.number - 1 };
        default:
            return state;
    }
}
let store = createStore(reducer);
function render() {
    counterValue.innerHTML = store.getState().number + '';
}
store.subscribe(render);
render();
incrementBtn.addEventListener('click', function () {
    store.dispatch({ type: INCREMENT });
});
decrementBtn.addEventListener('click', function () {
    store.dispatch({ type: DECREMENT });
});
```

### 4.3 redux\index.js

src\redux\index.js

```js
import createStore from './createStore'
export {
    createStore
}
```

### 4.4 redux\createStore.js

src\redux\createStore.js

```js
import ActionTypes from './utils/actionTypes'

export default function createStore(reducer,preloadedState){

  let currentReducer = reducer;
  let currentState = preloadedState;
  let currentListeners = [];
  function getState() {
    return currentState;
  }

  function subscribe(listener) {
    currentListeners.push(listener)

    return function unsubscribe() {
      const index = currentListeners.indexOf(listener)
      currentListeners.splice(index, 1)
    }
  }

  function dispatch(action) {
    currentState = currentReducer(currentState, action)
    for (let i = 0; i < currentListeners.length; i++) {
      const listener = currentListeners[i];
      listener();
    }
    return action;
  }

  dispatch({ type: ActionTypes.INIT });

  const store = ({
    dispatch,
    subscribe,
    getState
  })
  return store
}
```

### 4.5 actionTypes.js

src\redux\utils\actionTypes.js

```js
const randomString = () =>
  Math.random().toString(36).substring(7).split('').join('.')

const ActionTypes = {
  INIT: `@@redux/INIT${randomString()}`
}

export default ActionTypes
```

## 5. React计数器

### 5.1 src\index.js

src\index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import Counter1 from './components/Counter1';

ReactDOM.render(<Counter1 />, document.getElementById('root'));
```

### 5.2 Counter1.js

src\components\Counter1.js

```js
import React, { Component } from 'react';
import { createStore} from '../redux';
const INCREMENT = 'ADD';
const DECREMENT = 'MINUS';
const reducer = (state = initState, action) => {
    switch (action.type) {
        case INCREMENT:
            return { number: state.number + 1 };
        case DECREMENT:
            return { number: state.number - 1 };
        default:
            return state;
    }
}
let initState = { number: 0 };
const store = createStore(reducer, initState);
export default class Counter extends Component {
    unsubscribe;
    constructor(props) {
        super(props);
        this.state = { number: 0 };
    }
    componentDidMount() {
        this.unsubscribe = store.subscribe(() => this.setState({ number: store.getState().number }));
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        return (
            <div>
                <p>{this.state.number}</p>
                <button onClick={() => store.dispatch({ type: 'ADD' })}>+</button>
                <button onClick={() => store.dispatch({ type: 'MINUS' })}>-</button>
                <button onClick={
                    () => {
                        setTimeout(() => {
                            store.dispatch({ type: 'ADD' });
                        }, 1000);
                    }
                }>1秒后加1</button>
            </div>
        )
    }
}
```

## 6. bindActionCreators

- [bindActionCreators](https://gitee.com/zhufengpeixun/redux/blob/master/src/bindActionCreators.ts)

### 6.1 Counter1.js

src\components\Counter1.js

```diff
import React, { Component } from 'react';
+import { createStore,bindActionCreators} from '../redux';
const INCREMENT = 'ADD';
const DECREMENT = 'MINUS';
const reducer = (state = initState, action) => {
    switch (action.type) {
        case INCREMENT:
            return { number: state.number + 1 };
        case DECREMENT:
            return { number: state.number - 1 };
        default:
            return state;
    }
}
let initState = { number: 0 };
const store = createStore(reducer, initState);
+function add() {
+    return { type: 'ADD' };
+}
+function minus() {
+    return { type: 'MINUS' };
+}
+const actions = { add, minus };
+const boundActions = bindActionCreators(actions, store.dispatch);
export default class Counter extends Component {
    unsubscribe;
    constructor(props) {
        super(props);
        this.state = { number: 0 };
    }
    componentDidMount() {
        this.unsubscribe = store.subscribe(() => this.setState({ number: store.getState().number }));
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        return (
            <div>
                <p>{this.state.number}</p>
+               <button onClick={boundActions.add}>+</button>
+               <button onClick={boundActions.minus}>-</button>
                <button onClick={
                    () => {
                        setTimeout(() => {
+                         boundActions.add();
                        }, 1000);
                    }
                }>1秒后加1</button>
            </div>
        )
    }
}
```

### 6.2 bindActionCreators.js

src\redux\bindActionCreators.js

```js
function bindActionCreator(actionCreator, dispatch) {
    return function (...args) {
        return dispatch(actionCreator.apply(this, args))
    }
}

export default function bindActionCreators(actionCreators, dispatch) {
    if (typeof actionCreators === 'function') {
        return bindActionCreator(actionCreators, dispatch)
    }
    const boundActionCreators = {}
    for (const key in actionCreators) {
        const actionCreator = actionCreators[key]
        if (typeof actionCreator === 'function') {
            boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
        }
    }
    return boundActionCreators
}
```

### 6.3 src\redux\index.js

src\redux\index.js

```diff
export {default as createStore} from './createStore'
export {default as bindActionCreators} from './bindActionCreators'
```

## 7. combineReducers.js

src\redux\combineReducers.js -[combineReducers](https://gitee.com/zhufengpeixun/redux/blob/master/src/combineReducers.ts)

### 7.1 src\index.js

src\index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import Counter1 from './components/Counter1';
import Counter2 from './components/Counter2';
ReactDOM.render(<div><Counter1/><Counter2/></div>, document.getElementById('root'));
```

### 7.2 action-types.js

src\store\action-types.js

```js
export const ADD1 = 'ADD1';
export const MINUS1 = 'MINUS1';

export const ADD2 = 'ADD2';
export const MINUS2 = 'MINUS2';
```

### 7.3 counter1.js

src\store\reducers\counter1.js

```js
import * as types from '../action-types';

let initialState = { number: 0 }

export default function (state=initialState, action) {
    switch (action.type) {
        case types.ADD1:
            return { number: state.number + 1 };
        case types.MINUS1:
            return { number: state.number - 1 };
        default:
            return state;
    }
}
```

### 7.4 counter2.js

src\store\reducers\counter2.js

```js
import * as types from '../action-types';

let initialState = { number: 0 };

export default function (state=initialState, action) {
    switch (action.type) {
        case types.ADD2:
            return { number: state.number + 1 };
        case types.MINUS2:
            return { number: state.number - 1 };
        default:
            return state;
    }
}
```

### 7.5 reducers\index.js

src\store\reducers\index.js

```js
import { combineReducers} from '../../redux';
import counter1 from './counter1';
import counter2 from './counter2';
let rootReducer = combineReducers({
    counter1,
    counter2
});
export default rootReducer;
```

### 7.6 store\index.js

src\store\index.js

```js
import { createStore } from '../redux';
import reducer from './reducers';
const store = createStore(reducer, { counter1: { number: 0 }, counter2: { number: 0 } });
export default store;
```

### 7.7 actions\counter1.js

src\store\actions\counter1.js

```js
import * as types from '../action-types';

const actions = {
    add1() {
        return { type: types.ADD1 };
    },
    minus1() {
        return { type: types.MINUS1 };
    }
}
export default actions;
```

### 7.8 actions\counter2.js

src\store\actions\counter2.js

```js
import * as types from '../action-types';

const actions = {
    add2() {
        return { type: types.ADD2 };
    },
    minus2() {
        return { type: types.MINUS2 };
    }
}
export default actions;
```

### 7.9 Counter1.js

src\components\Counter1.js

```diff
import React, { Component } from 'react';
+import { bindActionCreators} from '../redux';
+import actions from '../store/actions/counter1';
+import store from '../store';
+const boundActions = bindActionCreators(actions, store.dispatch);
export default class Counter extends Component {
    unsubscribe;
    constructor(props) {
        super(props);
        this.state = { number: 0 };
    }
    componentDidMount() {
+        this.unsubscribe = store.subscribe(() => this.setState({ number: store.getState().counter1.number }));
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        return (
            <div>
                <p>{this.state.number}</p>
+                <button onClick={boundActions.add1}>+</button>
+                <button onClick={boundActions.minus1}>-</button>
                <button onClick={
                    () => {
                        setTimeout(() => {
+                            boundActions.add1();
                        }, 1000);
                    }
                }>1秒后加1</button>
            </div>
        )
    }
}
```

### 7.10 Counter2.js

src\components\Counter2.js

```diff
import React, { Component } from 'react';
+import { bindActionCreators} from '../redux';
+import actions from '../store/actions/counter2';
+import store from '../store';
+const boundActions = bindActionCreators(actions, store.dispatch);
export default class Counter extends Component {
    unsubscribe;
    constructor(props) {
        super(props);
        this.state = { number: 0 };
    }
    componentDidMount() {
+        this.unsubscribe = store.subscribe(() => this.setState({ number: store.getState().counter2.number }));
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        return (
            <div>
                <p>{this.state.number}</p>
+                <button onClick={boundActions.add2}>+</button>
+                <button onClick={boundActions.minus2}>-</button>
                <button onClick={
                    () => {
                        setTimeout(() => {
+                            boundActions.add2();
                        }, 1000);
                    }
                }>1秒后加1</button>
            </div>
        )
    }
}
```

### 7.11 combineReducers.js

src\redux\combineReducers.js

```js
function combineReducers(reducers){
    return function combination(state={},action){
       let nextState = {};
       for(let key in reducers){//key=x
         nextState[key]=reducers[key](state[key],action);
       }
       return nextState;
    }
}
export default combineReducers;
```

### 7.12 redux\index.js

src\redux\index.js

```diff
export {default as createStore} from './createStore'
export {default as bindActionCreators} from './bindActionCreators';
+export {default as combineReducers} from './combineReducers';
```

## 8. react-redux

- [Provider.js](https://gitee.com/zhufengpeixun/react-redux/blob/master/src/components/Provider.js)
- [connect.js](https://gitee.com/zhufengpeixun/react-redux/blob/master/src/connect/connect.js)

### 8.1 src\index.js

src\index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import Counter1 from './components/Counter1';
import Counter2 from './components/Counter2';
import store from './store';
import { Provider } from './react-redux';
ReactDOM.render(
<Provider store={store}>
    <Counter1 />
    <Counter2 />
</Provider>, document.getElementById('root'));
```

### 8.2 Counter1.js

src\components\Counter1.js

```js
import React, { Component } from 'react';
import actions from '../store/actions/counter1';
import { connect } from '../react-redux';
class Counter1 extends Component {
    render() {
        let { number, add1, minus1 } = this.props;
        return (
            <div>
                <p>{number}</p>
                <button onClick={add1}>+</button>
                <button onClick={minus1}>-</button>
                <button onClick={
                    () => setTimeout(() => add1(), 1000)
                }>1秒后加1</button>
            </div>
        )
    }
}
let mapStateToProps = (state) => state.counter1;
export default connect(
    mapStateToProps,
    actions
)(Counter1)
```

### 8.3 Counter2.js

src\components\Counter2.js

```js
import React from 'react';
import { useSelector,useDispatch} from '../react-redux';
const Counter2 =  (props) => {
   const counter2 = useSelector(state => state.counter2);
   const dispatch = useDispatch();
        return (
            <div>
                <p>{counter2.number}</p>
                <button onClick={()=>dispatch({type:'ADD2'})}>+</button>
                <button onClick={()=>dispatch({type:'MINUS2'})}>-</button>
            </div>
        )
}
export default Counter2;
```

### 8.4 Provider.js

src\react-redux\Provider.js

```js
import React from 'react'
import ReactReduxContext from './ReactReduxContext';

export default function(props){
  return (
    <ReactReduxContext.Provider value={{ store: props.store }}>
      {props.children}
    </ReactReduxContext.Provider>
  )
}
```

### 8.5 ReactReduxContext.js

src\react-redux\ReactReduxContext.js

```js
import React from 'react';
export const ReactReduxContext = React.createContext(null)
export default ReactReduxContext;
```

### 8.6 connect.js

src\react-redux\connect.js

```js
import React, { useContext, useMemo, useLayoutEffect, useReducer } from "react";
import { bindActionCreators } from "../redux";
import ReactReduxContext from "./ReactReduxContext";
export default function (mapStateToProps, mapDispatchToProps) {
  return function (WrappedComponent) {
    return function (props) {
      const { store } = useContext(ReactReduxContext);
      const { getState, dispatch, subscribe } = store;
      const prevState = getState();
      const stateProps = useMemo(() => mapStateToProps(prevState), [prevState]);
      const dispatchProps = useMemo(() => {
        let dispatchProps;
        if (typeof mapDispatchToProps === "object") {
          dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
        } else if (typeof mapDispatchToProps === "function") {
          dispatchProps = mapDispatchToProps(dispatch, props);
        } else {
          dispatchProps = { dispatch };
        }
        return dispatchProps;
      }, [dispatch,props]);
      const [, forceUpdate] = useReducer(x => x + 1, 0)
      useLayoutEffect(() => subscribe(forceUpdate), [subscribe]);
      return <WrappedComponent {...props} {...stateProps} {...dispatchProps} />;
    }
  };
}
```

### 8.7 hooks

#### 8.7.1 useDispatch.js

src\react-redux\hooks\useDispatch.js

```js
import {useContext} from 'react';
import ReactReduxContext from '../ReactReduxContext';

const  useDispatch = ()=>{
    const {store} = useContext(ReactReduxContext);
    return store.dispatch;
}
export default  useDispatch 
```

#### 8.7.2 useSelector.js

src\react-redux\hooks\useSelector.js

```js
import {useContext, useLayoutEffect, useReducer} from 'react';
import ReactReduxContext from '../ReactReduxContext';
function useSelectorWithStore(selector,store){
    let [,forceRender] = useReducer(x=>x+1,0);//useState
    let storeState = store.getState();//获取总状态
    let selectedState = selector(storeState);
    useLayoutEffect(()=>{
        return store.subscribe(forceRender);
    },[store]);
    return selectedState;
}
function useSelector(selector){
  const {store} = useContext(ReactReduxContext);
  const selectedState = useSelectorWithStore(
      //选择器 比较两个值是否相等
      selector,store
  );
  return selectedState;
}

export default useSelector;
```

#### 8.7.3 hooks\index.js

src\react-redux\hooks\index.js

```js
export {default as useDispatch} from './useDispatch';
export {default as useSelector} from './useSelector';
```

#### 8.7.4 react-redux\index.js

src\react-redux\index.js

```js
export {default as Provider} from './Provider';
export {default as connect} from './connect';
export {useDispatch,useSelector} from './hooks';
```

#### 8.7.5 Counter1.js

src\components\Counter1.js

```js
import React from 'react';
import {useDispatch,useSelector} from '../react-redux';
function Counter1(){
    let state = useSelector(state=>state.counter1);//状态映射函数 connect(mapStateToProps)
    let dispatch = useDispatch();
    return (
        <div>
               <p>{state.number}</p>
               <button onClick={()=>dispatch({type:'ADD1'})}>+</button>
           </div>
    )
}
export default Counter1;
```



# redux_middleware

## 1. Redux中间件

- 如果没有中间件的运用,redux 的工作流程是这样 `action -> reducer`，这是相当于同步操作，由dispatch 触发action后，直接去reducer执行相应的动作
- 但是在某些比较复杂的业务逻辑中，这种同步的实现方式并不能很好的解决我们的问题。比如我们有一个这样的需求，点击按钮 -> 获取服务器数据 -> 渲染视图，因为获取服务器数据是需要异步实现，所以这时候我就需要引入中间件改变redux同步执行的流程，形成异步流程来实现我们所要的逻辑，有了中间件，redux 的工作流程就变成这样 action -> middlewares -> reducer，点击按钮就相当于dispatch 触发action，接下去获取服务器数据 middlewares 的执行，当 middlewares 成功获取到服务器就去触发reducer对应的动作，更新需要渲染视图的数据
- 中间件的机制可以让我们改变数据流，实现如异步 action ，action 过滤，日志输出，异常报告等功能。

![redux-saga-flow2](https://img.zhufengpeixun.com/redux-saga-flow2.jpg)

![react-redux-flow.jpg](https://img.zhufengpeixun.com/react-redux-flow.jpg)

## 2. 日志中间件

- 我们改写了`dispatch`方法,实现了在更改状态时打印前后的状态
- 但是这种方案并不好。所以我们可以采用中间的方式

### 2.1 实现日志

src\store\index.tsx

```js
import { createStore} from '../redux';
import reducer from './reducers';
const store = createStore(reducer, { 
    counter1: { number: 0 },
    counter2: { number: 0 }
 });
let dispatch = store.dispatch;
store.dispatch = function (action) {
    console.log(store.getState());
    dispatch(action);
    console.log(store.getState());
    return action;
};
export default store;
```

### 2.2 实现异步

src\store\index.tsx

```js
import { createStore} from '../redux';
import reducer from './reducers';
const store = createStore(reducer, { counter1: { number: 0 }, counter2: { number: 0 } });
let dispatch = store.dispatch;
store.dispatch = function (action) {
    setTimeout(() => {
        dispatch(action);
    }, 1000);
    return action;
};
export default store;
```

## 3. 单个日志中间件

### 3.1 store\index.tsx

src\store\index.tsx

```diff
import { createStore } from '../redux';
import reducer from './reducers';
+function applyMiddleware(logger){
+    return function(createStore){
+        return function(reducer){
+            let store = createStore(reducer);
+            dispatch = logger(store)(store.dispatch);
+            return {
+                ...store,
+                dispatch
+            };
+        }
+    }
+}
+function logger({getState,dispatch}){
+    return function(next){
+        return function(action){//就是我们最终调用store.dispatch(action)
+            console.log('prev',getState());
+            next(action);
+            console.log('next',getState());
+        }
+    }
+}
let store = applyMiddleware(logger)(createStore)(reducer);
export default store;
```

### 3.2 redux\index.tsx

src\redux\index.tsx

```diff
export {default as createStore} from './createStore'
export {default as bindActionCreators} from './bindActionCreators';
export {default as combineReducers} from './combineReducers';
```

## 4. 级联中间件

![middleware](http://img.zhufengpeixun.cn/middleware.jpg)

## 4.1 compose

src\redux\compose.js

- [compose](https://gitee.com/zhufengpeixun/redux/blob/master/src/compose.ts)

```js
function add1(str){
    return '1'+str;
}
function add2(str){
    return '2'+str;
}
function add3(str){
    return '3'+str;
}

function compose(...funcs){
    return funcs.reduce((a,b)=>(...args)=>a(b(...args)));
}

let result = compose(add3,add2,add1)('zhufeng');
console.log(result);
```

## 4.2 applyMiddleware

src\redux\applyMiddleware.js

```js
import compose from './compose';
function applyMiddleware(...middlewares){
    return function(createStore){
        return function(reducer){
            let store = createStore(reducer);
            let dispatch;
            let middlewareAPI= {
                getState:store.getState,
                dispatch:(action)=>dispatch(action);
            let chain = middlewares.map(middleware=>middleware(middlewareAPI));
            dispatch  = compose(...chain)(store.dispatch);
            return {
                ...store,
                dispatch
            };
        }
    }
}
export default applyMiddleware;
```

## 4.3 redux\index.js

src\redux\index.js

```diff
export {default as createStore} from './createStore';
export {default as bindActionCreators} from './bindActionCreators';
export {default as combineReducers} from './combineReducers';
+export {default as compose} from './compose';
+export {default as applyMiddleware} from './applyMiddleware';
```

### 4.4 redux-logger\index.js

src\redux-logger\index.js

- [redux-logger](https://gitee.com/zhufengpeixun/redux-logger/blob/master/src/index.js)

```js
export default  (api) => (next) => (action) => {
  console.log(api.getState());
  next(action);
  console.log(api.getState());
  return action;
};
```

### 4.5 redux-promise\index.js

src\redux-promise\index.js

- [redux-promise](https://gitee.com/zhufengpeixun/redux-promise/blob/master/src/index.js)

```js
function promise({getState,dispatch}){
    return function(next){//原生的store.dispatch
        let returnDispatch =  function(action){//=改造后最终的store.dispatch
            console.log('promise returnDispatch');
            if(typeof action.then ==='function'){
                action.then((newAction)=>{
                    dispatch(newAction);//重新派发
                });
            }else{
                next(action);
            }
        }
        return returnDispatch;
    }
}
```

### 4.6 src\redux-thunk\index.js

src\redux-thunk\index.js

- redux-thunk

  ```js
  export default ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
        return action(dispatch, getState);
    }
    return next(action);
  };
  ```

### 4.7 actions\counter1.js

src\store\actions\counter1.js

```diff
import * as types from '../action-types';

const actions = {
    add1() {
        return { type: types.ADD1 };
    },
    minus1() {
        return { type: types.MINUS1 };
    },
+   thunkAdd1() {
+        return function (dispatch) {
+            setTimeout(() => {
+                dispatch({ type: types.ADD1 });
+            }, 1000);
+        }
+    },
+    promiseAdd1() {
+        return {
+            type: types.ADD1,
+            payload: new Promise((resolve, reject) => {
+                setTimeout(() => {
+                    let result = Math.random();
+                    if (result > .5) {
+                        resolve(result);
+                    } else {
+                        reject(result);
+                    }
+                }, 1000);
+            })
+        }
+    },
}
export default actions;
```

### 4.8 src\store\index.js

src\store\index.js

```diff
import { createStore, applyMiddleware } from '../redux';
import reducer from './reducers';
+import logger from '../redux-logger';
+import promise from '../redux-promise';
+import thunk from '../redux-thunk';
+let store = applyMiddleware(promise,thunk,logger)(createStore)(combinedReducer);
export default store;
```

### 4.9 components\Counter1.js

src\components\Counter1.js

```diff
import React, { Component } from 'react';
import actions from '../store/actions/counter1';
import { connect } from '../react-redux';
class Counter1 extends Component {
    render() {
        let { number, add1,addThunk1,addPromise1 } = this.props;
        return (
            <div>
                <p>{number}</p>
                <button onClick={add1}>+</button>
+               <button onClick={thunkAdd1}>thunk+1</button>
+               <button onClick={promiseAdd1}>promise+1</button>
            </div>
        )
    }
}
let mapStateToProps = (state) => state.counter1;
export default connect(
    mapStateToProps,
    actions
)(Counter1)
```



