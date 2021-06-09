---
title: 基础（五）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

#  connected-react-router

## 1.生成项目

```js
create-react-app zhufeng_connected_router
cd zhufeng_connected_router
cnpm i redux react-redux  react-router-dom connected-react-router -S
```

## 2.跑通项目

### 2.1 src\index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Counter from './components/Counter';
import { ConnectedRouter } from 'connected-react-router'
import history from './history';
import store from './store';
import { Provider } from 'react-redux'
ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <>
                <Link to="/">Home</Link>
                <Link to="/counter">Counter</Link>
                <Route exact={true} path="/" component={Home} />
                <Route path="/counter" component={Counter} />
            </>
        </ConnectedRouter>
    </Provider>
    , document.getElementById('root'));
```

### 2.2 history.js

src\history.js

```js
import { createBrowserHistory } from 'history'
let history = createBrowserHistory();
export default history;
```

### 2.3 action-types.js

src\store\action-types.js

```js
export const ADD = 'ADD';
export const MINUS = 'MINUS';
```

### 2.4 reducers\counter.js

src\reducers\counter.js

```js
import * as types from '../action-types';
let initialState = { number: 0 }
export default function (state = initialState, action) {
    switch (action.type) {
        case types.ADD:
            return { number: state.number + 1 };
        case types.MINUS:
            return { number: state.number - 1 };
        default:
            return state;
    }
}
```

### 2.5 reducers\index.js

src\store\reducers\index.js

```js
import { combineReducers} from 'redux'
import { connectRouter } from 'connected-react-router'
import counter from './counter';
import history from '../../history';
let reducers = {
    router: connectRouter(history),
    counter
};
let rootReducer = combineReducers(reducers);
export default rootReducer;
```

### 2.6 actions\counter.js

src\store\actions\counter.js

```js
import * as types from '../action-types';
import { push } from 'connected-react-router';
export default {
    increment() {
        return { type: types.ADD }
    },
    decrement() {
        return { type: types.MINUS }
    },
    go(path) {
        return push(path);
    }
}
```

### 2.7 store\index.js

src\store\index.js

```js
import { applyMiddleware, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import history from '../history';
import reducers from './reducers';
const store = applyMiddleware(routerMiddleware(history))(createStore)(reducers);
window.store = store;
export default store;
```

### 2.8 Counter.js

src\components\Counter.js

```js
import React from 'react'
import { connect } from 'react-redux';
import actions from '../store/actions/counter';
class Counter extends React.Component {
    render() {
        return (
            <>
                <p>{this.props.number}</p>
                <button onClick={this.props.increment}>+</button>
                <button onClick={this.props.decrement}>-</button>
                <button onClick={() => this.props.go('/')}>Home</button>
            </>
        )
    }
}
let mapStateToProps = (state) => state.counter;
export default connect(
    mapStateToProps,
    actions
)(Counter);
```

### 2.9 components\Home.js

src\components\Home.js

```js
import React, { Component } from 'react';
export default class Home extends Component{
    render() {
        return (
            <div>
                <h1>Home</h1>
                <button onClick={() => this.props.history.go(-1)}>返回</button>
            </div>
        )
    }
}
```

## 3.实现connected-react-router

### 3.1 index.js

- [index.js](https://gitee.com/zhufengpeixun/connected-react-router/blob/master/src/index.js)

```js
export {default as ConnectedRouter} from "./ConnectedRouter";
export {default as connectRouter} from "./reducer";
export {default as routerMiddleware } from "./middleware";
export { LOCATION_CHANGE, CALL_HISTORY_METHOD, push, replace, go, goBack, goForward} from "./actions";
```

### 3.2 actions.js

src\connected-react-router\actions.js

- [actions.js](https://gitee.com/zhufengpeixun/connected-react-router/blob/master/src/actions.js)

```js
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

export const onLocationChanged = (location, action) => ({
  type: LOCATION_CHANGE,
  payload: {
    location,
    action
  }
});

export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD'

const updateLocation = (method) => {
  return (...args) => ({
    type: CALL_HISTORY_METHOD,
    payload: {
      method,
      args
    }
  })
}

export const push = updateLocation('push');
export const replace = updateLocation('replace');
export const go = updateLocation('go');
export const goBack = updateLocation('goBack');
export const goForward = updateLocation('goForward');
```

### 3.3 middleware.js

src\connected-react-router\middleware.js

- [middleware.js](https://gitee.com/zhufengpeixun/connected-react-router/blob/master/src/middleware.js)

```js
import { CALL_HISTORY_METHOD } from './actions'

const routerMiddleware = (history) => store => next => action => {
  if (action.type !== CALL_HISTORY_METHOD) {
    return next(action)
  }
  const { payload: { method, args } } = action
  history[method](...args)
}

export default routerMiddleware
```

### 3.4 ConnectedRouter.js

src\connected-react-router\ConnectedRouter.js

- [ConnectedRouter.js](https://gitee.com/zhufengpeixun/connected-react-router/blob/master/src/ConnectedRouter.js)

```js
import React, { PureComponent } from 'react'
import { connect, ReactReduxContext } from 'react-redux';
import { Router } from 'react-router';
import { onLocationChanged } from './actions';

class ConnectedRouter extends PureComponent {
    static contextType = ReactReduxContext;
    constructor(props) {
        super(props);
        const {history,onLocationChanged } = props;
        this.unlisten = history.listen(onLocationChanged);
    }

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        const { history, children } = this.props
        return (
            <Router history={history}>
                {children}
            </Router>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onLocationChanged: (location, action) => dispatch(onLocationChanged(location, action))
})

export default  connect(null, mapDispatchToProps)(ConnectedRouter)
```

### 3.5 reducer.js

src\connected-react-router\reducer.js

- [reducer.js](https://gitee.com/zhufengpeixun/connected-react-router/blob/master/src/reducer.js)

```js
import { LOCATION_CHANGE } from './actions';

const createRouterReducer = (history) => {
    const initialRouterState = {
        location: history.location,
        action: history.action,
    }
    return (state = initialRouterState, { type, payload } = {}) => {
        if (type === LOCATION_CHANGE) {
            const { location, action } = payload;
            return { ...state, location, action };
        }
        return state
    }
}

export default createRouterReducer;
```



