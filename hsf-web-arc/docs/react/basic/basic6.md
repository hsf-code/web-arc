---
title: 基础（六）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# redux-saga

## 1. redux-saga

- [redux-saga](https://redux-saga-in-chinese.js.org/) 是一个 redux 的中间件，而中间件的作用是为 redux 提供额外的功能。
- 在 reducers 中的所有操作都是同步的并且是纯粹的，即 reducer 都是纯函数，纯函数是指一个函数的返回结果只依赖于它的参数，并且在执行过程中不会对外部产生副作用，即给它传什么，就吐出什么。
- 但是在实际的应用开发中，我们希望做一些异步的（如Ajax请求）且不纯粹的操作（如改变外部的状态），这些在函数式编程范式中被称为“副作用”。

> redux-saga 就是用来处理上述副作用（异步任务）的一个中间件。它是一个接收事件，并可能触发新事件的过程管理者，为你的应用管理复杂的流程。

## 2. redux-saga工作原理

- sages 采用 Generator 函数来 yield Effects（包含指令的文本对象）
- Generator 函数的作用是可以暂停执行，再次执行的时候从上次暂停的地方继续执行
- Effect 是一个简单的对象，该对象包含了一些给 middleware 解释执行的信息。
- 你可以通过使用 effects API 如 fork，call，take，put，cancel 等来创建 Effect。

## 3. redux-saga分类

- worker saga 做左右的工作，如调用API，进行异步请求，获取异步封装结果
- watcher saga 监听被dispatch的actions,当接受到action或者知道其被触发时，调用worker执行任务
- root saga 立即启动saga的唯一入口

## 4. 计数器

### 4.1 index.js

src/index.js

```js
import React from 'react'
import ReactDOM from 'react-dom';
import Counter from './components/Counter';
import {Provider} from 'react-redux';
import store from './store';
ReactDOM.render(<Provider store={store}>
  <Counter/>
</Provider>,document.querySelector('#root'));
```

### 4.2 sagas.js

src\store\sagas.js

```js
import {put,take} from 'redux-saga/effects';
import * as types from './action-types';

export default function* rootSaga() {
    for (let i=0;i<3;i++){
        yield take(types.ASYNC_ADD);
        yield put({type:types.ADD});
    }
    console.log('已经达到最大值');
}
```

### 4.3 Counter.js

src/components/Counter.js

```js
import React,{Component} from 'react'
import {connect} from 'react-redux';
import actions from '../store/actions';
class Counter extends Component{
    render() {
        return (
            <div>
                <p>{this.props.number}</p>
                <button onClick={this.props.add}>+</button>
            </div>
      )
  }
}
export default connect(
    state => state,
    actions
)(Counter);
```

### 4.4 index.js

src/store/index.js

```js
import {createStore, applyMiddleware} from 'redux';
import reducer from './reducer';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
let sagaMiddleware=createSagaMiddleware();
let store=applyMiddleware(sagaMiddleware)(createStore)(reducer);
sagaMiddleware.run(rootSaga);
window.store=store;
export default store;
```

### 4.5 actions.js

src/store/actions.js

```js
import * as types from './action-types';
const actions = {
    add() {
        return {type:types.ASYNC_ADD}
    }
}
export default  actions
```

### 4.6 action-types.js

src/store/action-types.js

```js
export const ASYNC_ADD='ASYNC_ADD';
export const ADD='ADD';
```

### 4.7 reducer.js

src/store/reducer.js

```js
import * as types from './action-types';
export default function reducer(state={number:0},action) {
    switch(action.type){
        case types.ADD:
            return {number: state.number+1};
        default:
            return state;
    }
}
```

## 5. 实现take

- [runSaga.js](https://github.com/redux-saga/redux-saga/blob/master/packages/core/src/internal/runSaga.js)

### 5.1 effectTypes.js

src\redux-saga\effectTypes.js

```js
export const TAKE = 'TAKE';
export const PUT = 'PUT';
```

### 5.2 effects.js

src\redux-saga\effects.js

```js
import * as effectTypes from './effectTypes'
export function take(actionType) {
    return { type: effectTypes.TAKE, actionType}
}

export function put(action) {
    return { type: effectTypes.PUT, action }
}
```

### 5.2 channel.js

src\redux-saga\channel.js

```js
export default function stdChannel() {
    let currentTakers = [];
    function take(actionType,taker) {
        taker.actionType = actionType;
        taker.cancel = () => {
            currentTakers = currentTakers.filter(item => item !== taker);
        }
        currentTakers.push(taker);
    }

    function put(action) {
        currentTakers.forEach(taker => {
            if (taker.actionType === action.type) {
                taker.cancel();
                taker(action);
            }
        });
    }

    return { take, put };
}
```

### 5.3 runSaga.js

src\redux-saga\runSaga.js

```js
import * as effectTypes from './effectTypes'
export default function runSaga(env, saga) {
    let { channel, dispatch } = env;
    let it = saga();
    function next(value) {
        let {value:effect,done} = it.next(value);
        if (!done) {
            switch (effect.type) {
                case effectTypes.TAKE:
                    channel.take(effect.actionType,next);
                    break;
                case effectTypes.PUT:
                    dispatch(effect.action);
                    next();
                    break;
                default:
                    break;
            }
        }
    }
    next();
}
```

### 5.4 index.js

redux-saga/index.js

```js
import stdChannel from './channel';
import runSaga from './runSaga';
export default function createSagaMiddleware() {
    const channel = stdChannel();
    let boundRunSaga;
    function sagaMiddleware({getState,dispatch}) {
        boundRunSaga=runSaga.bind(null,{channel,dispatch,getState});
        return function (next) {
            return function (action) {
                const result = next(action);
                channel.put(action);
                return result;
            }
        }
    }
    sagaMiddleware.run = (saga)=>boundRunSaga(saga);
    return sagaMiddleware;
}
```

## 6.支持产出iterator

### 6.1 sagas.js

```diff
import { put, take } from '../redux-saga/effects';
import * as types from './action-types';
+export function* add() {
+    yield put({ type: types.ADD });
+}
export default function* rootSaga() {
    for (let i = 0; i < 3; i++) {
        yield take(types.ASYNC_ADD);
+        yield add();
    }
    console.log('已经达到最大值');
}
```

### 6.2 runSaga.js

src\redux-saga\runSaga.js

```diff
import * as effectTypes from './effectTypes'
export default function runSaga(env, saga) {
    let { channel, dispatch } = env;
+    let it = typeof saga == 'function' ? saga() : saga;
    function next(value) {
        let { value: effect, done } = it.next(value);
        if (!done) {
+            if (typeof effect[Symbol.iterator] == 'function') {
+                runSaga(env,effect);
+                next();
+            } else {
                switch (effect.type) {
                    case effectTypes.TAKE:
                        channel.take(effect.actionType, next);
                        break;
                    case effectTypes.PUT:
                        dispatch(effect.action);
                        next();
                        break;
                    default:
                        break;
                }
            }

        }
    }
    next();
}
```

## 7. 支持takeEvery

- 一个 task 就像是一个在后台运行的进程，在基于redux-saga的应用程序中，可以同时运行多个task
- 通过 fork 函数来创建 task

### 7.1 sagas.js

```diff
+import { put, takeEvery } from '../redux-saga/effects';
import * as actionTypes from './action-types';
export function* add() {
    yield put({ type: actionTypes.ADD });
}
export default function* rootSaga() {
+    yield takeEvery(actionTypes.ASYNC_ADD,add);
}
```

### 7.2 effectTypes.js

src\redux-saga\effectTypes.js

```diff
export const TAKE = 'TAKE';
export const PUT = 'PUT';
+export const FORK = 'FORK';
```

### 7.3 effects.js

src\redux-saga\effects.js

```diff
import * as effectTypes from './effectTypes'
export function take(actionType) {
    return { type: effectTypes.TAKE, actionType }
}

export function put(action) {
    return { type: effectTypes.PUT, action }
}

+export function fork(saga) {
+    return { type: effectTypes.FORK, saga };
+}

+export function takeEvery(pattern, saga) {
+    function* takeEveryHelper() {
+        while (true) {
+            yield take(pattern);
+            yield fork(saga);
+        }
+    }
+    return fork(takeEveryHelper);
+}
```

### 7.4 runSaga.js

src\redux-saga\runSaga.js

```diff
import * as effectTypes from './effectTypes'
export default function runSaga(env, saga) {
    let { channel, dispatch } = env;
    let it = typeof saga == 'function' ? saga() : saga;
    function next(value) {
        let { value: effect, done } = it.next(value);
        if (!done) {
            if (typeof effect[Symbol.iterator] == 'function') {
                runSaga(env,effect);
                next();
            } else {
                switch (effect.type) {
                    case effectTypes.TAKE:
                        channel.take(effect.actionType, next);
                        break;
                    case effectTypes.PUT:
                        dispatch(effect.action);
                        next();
                        break;
+                    case effectTypes.FORK:
+                        runSaga(env,effect.saga);
+                        next();
+                        break;
                    default:
                        break;
                }
            }

        }
    }
    next();
}
```

## 8. 支持promise

### 8.1 sagas.js

```diff
import { put, takeEvery } from '../redux-saga/effects';
import * as actionTypes from './action-types';
+const delay = ms => new Promise((resolve, reject) => {
+    setTimeout(() => {
+        resolve();
+    }, ms);
+});
export function* add() {
+    yield delay(1000);
    yield put({ type: actionTypes.ADD });
}
export default function* rootSaga() {
    yield takeEvery(actionTypes.ASYNC_ADD, add);
}
```

### 8.2 redux-saga/index.js

```diff
import * as effectTypes from './effectTypes'
export default function runSaga(env, saga) {
    let { channel, dispatch } = env;
    let it = typeof saga == 'function' ? saga() : saga;
    function next(value) {
        let { value: effect, done } = it.next(value);
        if (!done) {
            if (typeof effect[Symbol.iterator] == 'function') {
                runSaga(env,effect);
                next();
+            }else if(effect.then){
+                effect.then(next);
+            } else {
                switch (effect.type) {
                    case effectTypes.TAKE:
                        channel.take(effect.actionType, next);
                        break;
                    case effectTypes.PUT:
                        dispatch(effect.action);
                        next();
                        break;
                    case effectTypes.FORK:
                        runSaga(env,effect.saga);
                        next();
                        break;
                    default:
                        break;
                }
            }

        }
    }
    next();
}
```

## 9. 支持 call

### 9.1 sagas.js

src\store\sagas.js

```diff
+import { put, takeEvery,call } from '../redux-saga/effects';
import * as actionTypes from './action-types';
const delay = ms => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve();
    }, ms);
});
export function* add() {
+    yield call(delay,1000);
    yield put({ type: actionTypes.ADD });
}
export default function* rootSaga() {
    yield takeEvery(actionTypes.ASYNC_ADD, add);
}
```

### 9.2 effectTypes.js

src\redux-saga\effectTypes.js

```diff
export const TAKE = 'TAKE';
export const PUT = 'PUT';
export const FORK = 'FORK';
+export const CALL = 'CALL';
```

### 9.3 effects.js

src\redux-saga\effects.js

```diff
import * as effectTypes from './effectTypes'
export function take(actionType) {
    return { type: effectTypes.TAKE, actionType }
}

export function put(action) {
    return { type: effectTypes.PUT, action }
}

export function fork(saga) {
    return { type: effectTypes.FORK, saga };
}

export function takeEvery(pattern, saga) {
    function* takeEveryHelper() {
        while (true) {
            yield take(pattern);
            yield fork(saga);
        }
    }
    return fork(takeEveryHelper);
}
+export function call(fn, ...args) {
+    return { type: effectTypes.CALL, fn, args };
+}
```

### 9.4 runSaga.js

src\redux-saga\runSaga.js

```diff
import * as effectTypes from './effectTypes'
export default function runSaga(env, saga) {
    let { channel, dispatch } = env;
    let it = typeof saga == 'function' ? saga() : saga;
    function next(value) {
        let { value: effect, done } = it.next(value);
        if (!done) {
            if (typeof effect[Symbol.iterator] == 'function') {
                runSaga(env,effect);
                next();
            }else if(effect.then){
                effect.then(next);
            } else {
                switch (effect.type) {
                    case effectTypes.TAKE:
                        channel.take(effect.actionType, next);
                        break;
                    case effectTypes.PUT:
                        dispatch(effect.action);
                        next();
                        break;
                    case effectTypes.FORK:
                        runSaga(env,effect.saga);
                        next();
                        break;
+                    case effectTypes.CALL:
+                        effect.fn(...effect.args).then(next);
+                        break;
                    default:
                        break;
                }
            }

        }
    }
    next();
}
```

## 10. 支持 cps

### 10.1 sagas.js

src\store\sagas.js

```diff
+import { put, takeEvery,call,cps} from '../redux-saga/effects';
import * as actionTypes from './action-types';
+const delay = (ms,callback)=>{
+    setTimeout(() => {
+        callback(null,'ok');
+    },ms);
+}
export function* add() {
+    let data = yield cps(delay,1000);
+    console.log(data);
    yield put({ type: actionTypes.ADD });
}
export default function* rootSaga() {
    yield takeEvery(actionTypes.ASYNC_ADD, add);
}
```

### 10.2 effectTypes.js

src\redux-saga\effectTypes.js

```diff
export const TAKE = 'TAKE';
export const PUT = 'PUT';
export const FORK = 'FORK';
export const CALL = 'CALL';
+export const CPS = 'CPS';
```

### 10.3 effects.js

src\redux-saga\effects.js

```diff
import * as effectTypes from './effectTypes'
export function take(actionType) {
    return { type: effectTypes.TAKE, actionType }
}

export function put(action) {
    return { type: effectTypes.PUT, action }
}

export function fork(saga) {
    return { type: effectTypes.FORK, saga };
}

export function takeEvery(pattern, saga) {
    function* takeEveryHelper() {
        while (true) {
            yield take(pattern);
            yield fork(saga);
        }
    }
    return fork(takeEveryHelper);
}
export function call(fn, ...args) {
    return { type: effectTypes.CALL, fn, args };
}
+export function cps(fn, ...args) {
+    return { type: effectTypes.CPS, fn, args };
+}
```

### 10.4 runSaga.js

src\redux-saga\runSaga.js

```diff
import * as effectTypes from './effectTypes'
export default function runSaga(env, saga) {
    let { channel, dispatch } = env;
    let it = typeof saga == 'function' ? saga() : saga;
+    function next(value,isErr) {
+        let result;
+        if (isErr) {
+            result = it.throw(value);
+          } else {
+            result = it.next(value);
+          }
+        let { value: effect, done } = result;
        if (!done) {
            if (typeof effect[Symbol.iterator] == 'function') {
                runSaga(env,effect);
                next();
            }else if(effect.then){
                effect.then(next);
            } else {
                switch (effect.type) {
                    case effectTypes.TAKE:
                        channel.take(effect.actionType, next);
                        break;
                    case effectTypes.PUT:
                        dispatch(effect.action);
                        next();
                        break;
                    case effectTypes.FORK:
                        runSaga(env,effect.saga);
                        next();
                        break;
                    case effectTypes.CALL:
                        effect.fn(...effect.args).then(next);
                        break;
+                    case effectTypes.CPS:
+                        effect.fn(...effect.args,(err,data)=>{
+                            if(err){
+                                next(err,true);
+                            }else{
+                                next(data);
+                            }
+                        });
+                        break;    
                    default:
                        break;
                }
            }

        }
    }
    next();
}
```

## 12. 支持all

### 12.1 saga

src\store\sagas.js

```diff
import { put, takeEvery, call, cps, take,all } from '../redux-saga/effects';
import * as actionTypes from './action-types';
+export function* add1() {
+    for (let i = 0; i < 3; i++) {
+        yield take(actionTypes.ASYNC_ADD);
+        yield put({ type: actionTypes.ADD });
+    }
+    return 'add1';
+}
+export function* add2() {
+    for (let i = 0; i < 3; i++) {
+        yield take(actionTypes.ASYNC_ADD);
+        yield put({ type: actionTypes.ADD });
+    }
+    return 'add2';
+}
export default function* rootSaga() {
+    let result = yield all([add1(), add2()]);
+    console.log('done', result);
}
```

### 12.2 effectTypes.js

src\redux-saga\effectTypes.js

```js
export const TAKE = 'TAKE';
export const PUT = 'PUT';
export const FORK = 'FORK';
export const CALL = 'CALL';
export const CPS = 'CPS';
export const ALL = 'ALL';
```

### 12.3 effects.js

src\redux-saga\effects.js

```diff
import * as effectTypes from './effectTypes'
export function take(actionType) {
    return { type: effectTypes.TAKE, actionType }
}

export function put(action) {
    return { type: effectTypes.PUT, action }
}

export function fork(saga) {
    return { type: effectTypes.FORK, saga };
}

export function takeEvery(pattern, saga) {
    function* takeEveryHelper() {
        while (true) {
            yield take(pattern);
            yield fork(saga);
        }
    }
    return fork(takeEveryHelper);
}
export function call(fn, ...args) {
    return { type: effectTypes.CALL, fn, args };
}
export function cps(fn, ...args) {
    return { type: effectTypes.CPS, fn, args };
}
+export function all(effects) {
+    return { type: effectTypes.ALL, effects };
+}
```

### 12.4 runSaga.js

src\redux-saga\runSaga.js

```diff
import * as effectTypes from './effectTypes'
+export default function runSaga(env, saga,callback) {
    let { channel, dispatch } = env;
    let it = typeof saga == 'function' ? saga() : saga;
    function next(value, isErr) {
        let result;
        if (isErr) {
            result = it.throw(value);
        } else {
            result = it.next(value);
        }
        let { value: effect, done } = result;
        if (!done) {
            if (typeof effect[Symbol.iterator] == 'function') {
                runSaga(env, effect);
                next();
            } else if (effect.then) {
                effect.then(next);
            } else {
                switch (effect.type) {
                    case effectTypes.TAKE:
                        channel.take(effect.actionType, next);
                        break;
                    case effectTypes.PUT:
                        dispatch(effect.action);
                        next();
                        break;
                    case effectTypes.FORK:
                        runSaga(env, effect.saga);
                        next();
                        break;
                    case effectTypes.CALL:
                        effect.fn(...effect.args).then(next);
                        break;
                    case effectTypes.CPS:
                        effect.fn(...effect.args, (err, data) => {
                            if (err) {
                                next(err, true);
                            } else {
                                next(data);
                            }
                        });
                        break;
+                    case effectTypes.ALL:
+                        let effects=effect.effects;
+                        let result = [];
+                        let complete=0;
+                        effects.forEach((effect,index)=>runSaga(env,effect,(res)=>{
+                            result[index]=res;
+                            if(++complete === effects.length)
+                                next(result);
+                        }));
+                        break;
                    default:
                        break;
                }
            }
        } else {
+            callback && callback(effect);
        }
    }
    next();
}
```

## 13. 取消任务

### 13.1 sagas.js

src\store\sagas.js

```diff
+import { put, takeEvery, call, cps, all, take, cancel, fork, delay } from '../redux-saga/effects';
+import * as actionTypes from './action-types';
+export function* add() {
+    while (true) {
+        yield delay(1000);
+        yield put({ type: actionTypes.ADD });
+    }
+}
+export function* addWatcher() {
+    const task = yield fork(add);
+    console.log(task);
+    yield take(actionTypes.STOP_ADD);
+    yield cancel(task);
+}

+export default function* rootSaga() {
+    yield addWatcher();
+}
```

### 13.2 effectTypes.js

src\redux-saga\effectTypes.js

```diff
export const TAKE = 'TAKE';
export const PUT = 'PUT';
export const FORK = 'FORK';
export const CALL = 'CALL';
export const CPS = 'CPS';
export const ALL = 'ALL';
+export const CANCEL = 'CANCEL';
```

### 13.3 effects.js

src\redux-saga\effects.js

```diff
import * as effectTypes from './effectTypes'
export function take(actionType) {
    return { type: effectTypes.TAKE, actionType }
}

export function put(action) {
    return { type: effectTypes.PUT, action }
}

export function fork(saga) {
    return { type: effectTypes.FORK, saga };
}

export function takeEvery(pattern, saga) {
    function* takeEveryHelper() {
        while (true) {
            yield take(pattern);
            yield fork(saga);
        }
    }
    return fork(takeEveryHelper);
}
export function call(fn, ...args) {
    return { type: effectTypes.CALL, fn, args };
}
export function cps(fn, ...args) {
    return { type: effectTypes.CPS, fn, args };
}
export function all(effects) {
    return { type: effectTypes.ALL, effects };
}
+export function cancel(task) {
+    return { type: effectTypes.CANCEL, task };
+}

+export default function delayP(ms, val = true) {
+    const promise = new Promise(resolve => {
+        setTimeout(resolve, ms, val);
+    })
+    return promise
+}
+export const delay = call.bind(null, delayP);
```

### 13.4 symbols.js

src\redux-saga\symbols.js

```diff
export const  TASK_CANCEL = Symbol('TASK_CANCEL');
```

### 13.5 runSaga.js

src\redux-saga\runSaga.js

```diff
import * as effectTypes from './effectTypes';
+import {TASK_CANCEL} from './symbols';
export default function runSaga(env, saga,callback) {
+    let task = {cancel:()=>next(TASK_CANCEL)};
    let { channel, dispatch } = env;
    let it = typeof saga == 'function' ? saga() : saga;
    function next(value, isErr) {
        let result;
        if (isErr) {
            result = it.throw(value);
+        }else if(value === TASK_CANCEL){
+            result = it.return(value);
        } else {
            result = it.next(value);
        }
        let { value: effect, done } = result;
        if (!done) {
            if (typeof effect[Symbol.iterator] == 'function') {
                runSaga(env, effect);
                next();
            } else if (effect.then) {
                effect.then(next);
            } else {
                switch (effect.type) {
                    case effectTypes.TAKE:
                        channel.take(effect.actionType, next);
                        break;
                    case effectTypes.PUT:
                        dispatch(effect.action);
                        next();
                        break;
                    case effectTypes.FORK:
+                        let forkTask = runSaga(env, effect.saga);
+                        next(forkTask);
                        break;
                    case effectTypes.CALL:
                        effect.fn(...effect.args).then(next);
                        break;
                    case effectTypes.CPS:
                        effect.fn(...effect.args, (err, data) => {
                            if (err) {
                                next(err, true);
                            } else {
                                next(data);
                            }
                        });
                        break;
                    case effectTypes.ALL:
                        let effects=effect.effects;
                        let result = [];
                        let complete=0;
                        effects.forEach((effect,index)=>runSaga(env,effect,(res)=>{
                            result[index]=res;
                            if(++complete === effects.length)
                                next(result);
                        }));
                        break;
+                    case effectTypes.CANCEL:
+                        effect.task.cancel();
+                        next();
+                        break;    
                    default:
                        break;
                }
            }
        } else {
            callback && callback(effect);
        }
    }
    next();
+    return task;
}
```

### 13.6 action-types.js

src\store\action-types.js

```diff
export const ASYNC_ADD='ASYNC_ADD';
export const ADD='ADD';
+export const STOP_ADD='STOP_ADD';
```

### 13.7 Counter.js

src\components\Counter.js

```diff
import React,{Component} from 'react'
import {connect} from 'react-redux';
import actions from '../store/actions';
class Counter extends Component{
    render() {
        return (
            <div>
                <p>{this.props.number}</p>
+                <button onClick={this.props.stop}>stop</button>
            </div>
      )
  }
}
export default connect(
    state => state,
    actions
)(Counter);
```

### 13.8 actions.js

src\store\actions.js

```diff
import * as actionTypes from './action-types';
const actions = {
    add() {
        return { type: actionTypes.ASYNC_ADD }
    },
+    stop() {
+        return { type: actionTypes.STOP_ADD }
+    }
}
export default actions
```

# 8.dva

## 1.dva介绍

- [dva](https://github.com/dvajs/dva)首先是一个基于 `redux` 和 `redux-saga` 的数据流方案，然后为了简化开发体验,dva 还额外内置了 `react-router` 和 `fetch`,所以也可以理解为一个轻量级的应用框架

![dva](https://zos.alipayobjects.com/rmsportal/PPrerEAKbIoDZYr.png)

### 1.1 前置知识

- react
- react-router-dom
- redux
- react-redux
- connected-react-router
- history

## 2. 初始化项目

- history的最新版为5.0，而connect-react-router使用的history版本为4.7，不兼容
- 不显示安装history或者指定老版本history进行安装。否则自己安装的history是使用history5

```js
create-react-app zhufeng-dva-source
cd  zhufeng-dva-source
cnpm install dva  redux react-redux redux-saga react-router-dom connected-react-router  --save
npm start
```

## 3. 基本计数器

### 3.1 使用

#### 3.1.1 index.js

```js
import React from 'react';
import dva, { connect } from './dva';
const app = dva();
app.model({
    namespace: 'counter',
    state: { number: 0 },
    reducers: {
        add(state) {
            return { number: state.number + 1 };
        }
    }
});
function Counter(props) {
    return (
        <div>
            <p>{props.number}</p>
            <button onClick={() => props.dispatch({ type: "counter/add" })}>+</button>
        </div>
    )
}
const ConnectedCounter = connect(
    (state) => state.counter
)(Counter);
app.router(() => <ConnectedCounter />);
app.start('#root');
```

### 3.2 实现

#### 3.2.1 dva\index.js

src\dva\index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';
import prefixNamespace from './prefixNamespace';
export { connect };

function dva() {
    const app = {
        _models: [],
        model,
        router,
        _router: null,
        start
    }
    const initialReducers = {};
    function model(model) {
        const prefixedModel = prefixNamespace(model);
        app._models.push(prefixedModel);
        return prefixedModel;
    }
    function router(router) {
        app._router = router;
    }

    function start(root) {
        for (const model of app._models) {
            initialReducers[model.namespace] = getReducer(model);
        }
        let rootReducer = createReducer();
        let store = createStore(rootReducer);
        ReactDOM.render(<Provider store={store}>{app._router()}</Provider>, document.querySelector(root));
        function createReducer() {
            return combineReducers(initialReducers);
        }
    }

    return app;
}

function getReducer(model) {
    let { reducers, state: defaultState } = model;
    let reducer = (state = defaultState, action) => {
        let reducer = reducers[action.type];
        if (reducer) {
            return reducer(state, action);
        }
        return state;
    }
    return reducer;
}

export default dva;
```

#### 3.2.2 prefixNamespace.js

src\dva\prefixNamespace.js

```js
import { NAMESPACE_SEP } from './constants';
function prefix(obj, namespace) {
    return Object.keys(obj).reduce((memo, key) => {
        const newKey = `${namespace}${NAMESPACE_SEP}${key}`;
        memo[newKey] = obj[key];
        return memo;
    }, {});
}
export default function prefixNamespace(model) {
    if (model.reducers)
        model.reducers = prefix(model.reducers, model.namespace);
    return model;
}
```

#### 3.2.3 constants.js

src\dva\constants.js

```js
export const NAMESPACE_SEP = '/';
```

## 4. 支持effects

### 4.1 使用

#### 4.1.1 src\index.js

src\index.js

```diff
import React from 'react';
import dva, { connect } from './dva';
const app = dva();
app.model({
    namespace: 'counter',
    state: { number: 0 },
    reducers: {
        add(state) {
            return { number: state.number + 1 };
        }
    },
+    effects: {
+        *asyncAdd(action, { call, put }) {
+            yield call(delay, 1000);
+            yield put({ type: 'counter/add' });
+        }
+    }
});
function Counter(props) {
    return (
        <div>
            <p>{props.number}</p>
            <button onClick={() => props.dispatch({ type: "counter/add" })}>+</button>
+            <button onClick={() => props.dispatch({ type: "counter/asyncAdd" })}>异步+</button>
        </div>
    )
}
const ConnectedCounter = connect(
    (state) => state.counter
)(Counter);
app.router(() => <ConnectedCounter />);
app.start('#root');

+function delay(ms) {
+    return new Promise((resolve) => {
+        setTimeout(function () {
+            resolve();
+        }, ms);
+    });
+}
```

### 4.2 实现

#### 4.2.1 dva\index.js

src\dva\index.js

```diff
import React from 'react';
import ReactDOM from 'react-dom';
+import { createStore, combineReducers, applyMiddleware } from 'redux';
+import createSagaMiddleware from 'redux-saga';
+import * as sagaEffects from 'redux-saga/effects';
+import { NAMESPACE_SEP } from './constants';
import { connect, Provider } from 'react-redux';
import prefixNamespace from './prefixNamespace';
export { connect };

function dva() {
    const app = {
        _models: [],
        model,
        router,
        _router: null,
        start
    }
    const initialReducers = {};
    function model(model) {
        const prefixedModel = prefixNamespace(model);
        app._models.push(prefixedModel);
        return prefixedModel;
    }
    function router(router) {
        app._router = router;
    }

    function start(root) {
        for (const model of app._models) {
            initialReducers[model.namespace] = getReducer(model);
        }
        let rootReducer = createReducer();
+        const sagas = getSagas(app);
+        const sagaMiddleware = createSagaMiddleware();
+        let store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
+        sagas.forEach(saga => sagaMiddleware.run(saga));
        ReactDOM.render(<Provider store={store}>{app._router()}</Provider>, document.querySelector(root));
        function createReducer() {
            return combineReducers(initialReducers);
        }
    }
+    function getSagas(app) {
+        let sagas = [];
+        for (const model of app._models) {
+            sagas.push(getSaga(model.effects, model));
+        }
+        return sagas;
+    }
    return app;
}
+function getSaga(effects, model) {
+    return function* () {
+        for (const key in effects) {
+            const watcher = getWatcher(key, model.effects[key], model);
+            yield sagaEffects.fork(watcher);
+        }
+    };
+}
+function getWatcher(key, effect, model) {
+    return function* () {
+        yield sagaEffects.takeEvery(key, function* sagaWithCatch(...args) {
+            yield effect(...args, { ...sagaEffects, put: action => sagaEffects.put({ ...action, +type: prefixType(action.type, model) }) });
+        });
+    };
+}
+function prefixType(type, model) {
+    if (type.indexOf('/') === -1) {
+        return `${model.namespace}${NAMESPACE_SEP}${type}`;
+    }
+    return type;
+}
function getReducer(model) {
    let { reducers, state: defaultState } = model;
    let reducer = (state = defaultState, action) => {
        let reducer = reducers[action.type];
        if (reducer) {
            return reducer(state, action);
        }
        return state;
    }
    return reducer;
}

export default dva;
```

#### 4.2.2 prefixNamespace.js

src\dva\prefixNamespace.js

```diff
import { NAMESPACE_SEP } from './constants';
function prefix(obj, namespace) {
    return Object.keys(obj).reduce((memo, key) => {
        const newKey = `${namespace}${NAMESPACE_SEP}${key}`;
        memo[newKey] = obj[key];
        return memo;
    }, {});
}
export default function prefixNamespace(model) {
    if (model.reducers)
        model.reducers = prefix(model.reducers, model.namespace);
+    if (model.effects) {
+       model.effects = prefix(model.effects, model.namespace);
+    }    
    return model;
}
```

## 5. 支持路由

### 5.1 使用

#### 5.1.1 src\index.js

src\index.js

```diff
import React from 'react';
import dva, { connect } from './dva';
+import { Router, Route,Link } from './dva/router';
const app = dva();
app.model({
    namespace: 'counter',
    state: { number: 0 },
    reducers: {
        add(state) {
            return { number: state.number + 1 };
        }
    },
    effects: {
        *asyncAdd(action, { call, put }) {
            yield call(delay, 1000);
            yield put({ type: 'counter/add' });
        }
    }
});
function Counter(props) {
    return (
        <div>
            <p>{props.number}</p>
            <button onClick={() => props.dispatch({ type: "counter/add" })}>+</button>
            <button onClick={() => props.dispatch({ type: "counter/asyncAdd" })}>异步+</button>
        </div>
    )
}
const ConnectedCounter = connect(
    (state) => state.counter
)(Counter);
+const Home = () => <div>Home</div>
+app.router((api) => (
+    <Router history={api.history}>
+        <>
+            <Link to="/">Home</Link>
+            <Link to="/counter">Counter</Link>
+            <Route path="/" exact={true} component={Home} />
+            <Route path="/counter" component={ConnectedCounter} />
+        </>
+    </Router>
+));
app.start('#root');

function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve();
        }, ms);
    });
}
```

### 5.2 实现

#### 5.2.1 dva\index.js

src\dva\index.js

```diff
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as sagaEffects from 'redux-saga/effects';
import { NAMESPACE_SEP } from './constants';
import { connect, Provider } from 'react-redux';
import prefixNamespace from './prefixNamespace';
+import { createHashHistory } from 'history';
+let history = createHashHistory();
export { connect };

function dva() {
    const app = {
        _models: [],
        model,
        router,
        _router: null,
        start
    }
    const initialReducers = {};
    function model(model) {
        const prefixedModel = prefixNamespace(model);
        app._models.push(prefixedModel);
        return prefixedModel;
    }
    function router(router) {
        app._router = router;
    }

    function start(root) {
        for (const model of app._models) {
            initialReducers[model.namespace] = getReducer(model);
        }
        let rootReducer = createReducer();
        const sagas = getSagas(app);
        const sagaMiddleware = createSagaMiddleware();
        let store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
        sagas.forEach(saga => sagaMiddleware.run(saga));
+        ReactDOM.render(<Provider store={store}>{app._router({ history })}</Provider>, document.querySelector(root))
        function createReducer() {
            return combineReducers(initialReducers);
        }
    }
    function getSagas(app) {
        let sagas = [];
        for (const model of app._models) {
            sagas.push(getSaga(model.effects, model));
        }
        return sagas;
    }
    return app;
}
function getSaga(effects, model) {
    return function* () {
        for (const key in effects) {
            const watcher = getWatcher(key, model.effects[key], model);
            yield sagaEffects.fork(watcher);
        }
    };
}
function getWatcher(key, effect, model) {
    return function* () {
        yield sagaEffects.takeEvery(key, function* sagaWithCatch(...args) {
            yield effect(...args, { ...sagaEffects, put: action => sagaEffects.put({ ...action, type: prefixType(action.type, model) }) });
        });
    };
}
function prefixType(type, model) {
    if (type.indexOf('/') === -1) {
        return `${model.namespace}${NAMESPACE_SEP}${type}`;
    }
    return type;
}
function getReducer(model) {
    let { reducers, state: defaultState } = model;
    let reducer = (state = defaultState, action) => {
        let reducer = reducers[action.type];
        if (reducer) {
            return reducer(state, action);
        }
        return state;
    }
    return reducer;
}

export default dva;
```

#### 5.2.2 router.js

src\dva\router.js

```diff
export * from 'react-router-dom';
```

## 6. 跳转路径

### 6.1 使用

#### 6.1.1 src\index.js

src\index.js

```diff
import React from 'react';
import dva, { connect } from './dva';
+import { Router, Route,Link,routerRedux } from './dva/router';
+import { ConnectedRouter } from 'connected-react-router';
const app = dva();
app.model({
    namespace: 'counter',
    state: { number: 0 },
    reducers: {
        add(state) {
            return { number: state.number + 1 };
        }
    },
    effects: {
        *asyncAdd(action, { call, put }) {
            yield call(delay, 1000);
            yield put({ type: 'counter/add' });
        },
+       *goto({ to }, { put }) {
+          yield put(routerRedux.push(to));
+       }
    }
});
function Counter(props) {
    return (
        <div>
            <p>{props.number}</p>
            <button onClick={() => props.dispatch({ type: "counter/add" })}>+</button>
            <button onClick={() => props.dispatch({ type: "counter/asyncAdd" })}>异步+</button>
+            <button onClick={() => props.dispatch({ type: "counter/goto", to: '/' })}>跳转到/</button>
        </div>
    )
}
const ConnectedCounter = connect(
    (state) => state.counter
)(Counter);
const Home = () => <div>Home</div>
app.router((api) => (
+    <ConnectedRouter  history={api.history}>
        <>
            <Link to="/">Home</Link>
            <Link to="/counter">Counter</Link>
            <Route path="/" exact={true} component={Home} />
            <Route path="/counter" component={ConnectedCounter} />
        </>
    </ConnectedRouter >
));
app.start('#root');

function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve();
        }, ms);
    });
}
```

### 6.2 实现

#### 6.2.1 dva\index.js

src\dva\index.js

```diff
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as sagaEffects from 'redux-saga/effects';
import { NAMESPACE_SEP } from './constants';
import { connect, Provider } from 'react-redux';
import prefixNamespace from './prefixNamespace';
import { createHashHistory } from 'history';
+import { routerMiddleware, connectRouter, ConnectedRouter } from "connected-react-router";
let history = createHashHistory();
export { connect };

function dva() {
    const app = {
        _models: [],
        model,
        router,
        _router: null,
        start
    }
+    const initialReducers = { router: connectRouter(history) };
    function model(model) {
        const prefixedModel = prefixNamespace(model);
        app._models.push(prefixedModel);
        return prefixedModel;
    }
    function router(router) {
        app._router = router;
    }

    function start(root) {
        for (const model of app._models) {
            initialReducers[model.namespace] = getReducer(model);
        }
        let rootReducer = createReducer();
        const sagas = getSagas(app);
        const sagaMiddleware = createSagaMiddleware();
+        let store = createStore(rootReducer, applyMiddleware(routerMiddleware(history), sagaMiddleware));
        sagas.forEach(saga => sagaMiddleware.run(saga));
        ReactDOM.render(<Provider store={store}>{app._router({ history })}</Provider>, document.querySelector(root))
        function createReducer() {
            return combineReducers(initialReducers);
        }
    }
    function getSagas(app) {
        let sagas = [];
        for (const model of app._models) {
            sagas.push(getSaga(model.effects, model));
        }
        return sagas;
    }
    return app;
}
function getSaga(effects, model) {
    return function* () {
        for (const key in effects) {
            const watcher = getWatcher(key, model.effects[key], model);
            yield sagaEffects.fork(watcher);
        }
    };
}
function getWatcher(key, effect, model) {
    return function* () {
        yield sagaEffects.takeEvery(key, function* sagaWithCatch(...args) {
            yield effect(...args, { ...sagaEffects, put: action => sagaEffects.put({ ...action, type: prefixType(action.type, model) }) });
        });
    };
}
function prefixType(type, model) {
    if (type.indexOf('/') === -1) {
        return `${model.namespace}${NAMESPACE_SEP}${type}`;
    }
    return type;
}
function getReducer(model) {
    let { reducers, state: defaultState } = model;
    let reducer = (state = defaultState, action) => {
        let reducer = reducers[action.type];
        if (reducer) {
            return reducer(state, action);
        }
        return state;
    }
    return reducer;
}

export default dva;
```

#### 6.2.2 src\dva\router.js

src\dva\router.js

```diff
import * as routerRedux from 'connected-react-router';
export * from 'react-router-dom';
export {
    routerRedux
}
```



