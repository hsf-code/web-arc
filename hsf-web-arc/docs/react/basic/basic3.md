---
title: 基础（三）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# react_router

## 1. React路由原理

- 不同的路径渲染不同的组件
- 有两种实现方式
  - HashRouter:利用hash实现路由切换
  - BrowserRouter:实现h5 Api实现路由的切换

### 1.1 HashRouter

- 利用hash实现路由切换

public\index.html

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        #root{
            border:1px solid red;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <ul>
        <li><a href="#/a">/a</a></li>
        <li><a href="#/b">/b</a></li>
    </ul>
    <script>
        window.addEventListener('hashchange',()=>{
            console.log(window.location.hash);
            let pathname = window.location.hash.slice(1);//把最前面的那个#删除 
            root.innerHTML = pathname;
        });

    </script>
</body>
</html>
```

### 1.2 BrowserRouter

- 利用h5 Api实现路由的切换

#### 1.2.1 history

- HTML5规范给我们提供了一个[history](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/history)接口
- HTML5 History API包括2个方法：`history.pushState()`和`history.replaceState()`，和1个事件`window.onpopstate`

##### 1.2.1.1 pushState

- history.pushState(stateObject, title, url)，包括三个参数
  - 第一个参数用于存储该url对应的状态对象，该对象可在onpopstate事件中获取，也可在history对象中获取
  - 第二个参数是标题，目前浏览器并未实现
  - 第三个参数则是设定的url
- pushState函数向浏览器的历史堆栈压入一个url为设定值的记录，并改变历史堆栈的当前指针至栈顶

##### 1.2.1.2 replaceState

- 该接口与pushState参数相同，含义也相同
- 唯一的区别在于`replaceState`是替换浏览器历史堆栈的当前历史记录为设定的url
- 需要注意的是`replaceState`不会改动浏览器历史堆栈的当前指针

##### 1.2.1.3 onpopstate

- 该事件是window的属性
- 该事件会在调用浏览器的前进、后退以及执行`history.forward`、`history.back`、和`history.go`触发，因为这些操作有一个共性，即修改了历史堆栈的当前指针
- 在不改变document的前提下，一旦当前指针改变则会触发`onpopstate`事件

##### 1.2.1.4 案例

- 浏览器针对每个页面维护一个`History`栈,执行`pushState`函数可压入设定的`url`至栈顶,同时修改当前指针
- 当执行`back`和`forward`操作时，history栈大小并不会改变（history.length不变），仅仅移动当前指针的位置
- 若当前指针在history栈的中间位置(非栈顶)，此时执行pushState会在指针当前的位置添加此条目,并成为新的栈顶

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        #root{
            border:1px solid red;
            height:20px;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <script>
        var historyObj = window.history;
        //监听路径改变事件 表示将当前的状态变更了，弹出了
        window.onpushstate = (event) => {
            console.log(event.type,event.detail.state);
            root.innerHTML = window.location.pathname;
        }
        window.addEventListener('popstate', (event) => {
            console.log(event.type,event.state);
            root.innerHTML = window.location.pathname;
        });

        (function (historyObj) {
            let oldPushState = history.pushState;//缓存原生的pushState
            historyObj.pushState = function (state, title, pathname) {
                let result = oldPushState.apply(history, arguments);
                if (typeof window.onpushstate === 'function') {
                    window.onpushstate(new CustomEvent('pushstate',{detail:{pathname,state}}));
                }
                return result;
            }
        })(historyObj);
        let oldHistoryLength = historyObj.length;
        setTimeout(() => {
            historyObj.pushState({ page: 1 }, { title: 'page1' }, '/page1');//page1
            console.log(historyObj.length-oldHistoryLength);
        }, 1000);
        setTimeout(() => {
            historyObj.pushState({ page: 2 }, { title: 'page2' }, '/page2');//page2
            console.log(historyObj.length-oldHistoryLength);
        }, 2000);
        setTimeout(() => {
            historyObj.pushState({ page: 3 }, { title: 'page3' }, '/page3');//page3
            console.log(historyObj.length-oldHistoryLength);
        }, 3000);
        setTimeout(() => {
            historyObj.back();//historyObj.go(-1);//page2
            setTimeout(()=>console.log(historyObj.length-oldHistoryLength),100);

        }, 4000);
        setTimeout(() => {
            historyObj.pushState({ page:4 }, { title: 'page4' }, '/page4');//page4
            console.log(historyObj.length-oldHistoryLength);
        }, 5000);
        setTimeout(() => {
            historyObj.go(1);
            console.log(historyObj.length-oldHistoryLength);//page4
        }, 6000);
    </script>
</body>
</html>
```

## 2.基本路由

### 2.1 安装

```js
npm i react-router-dom --save
```

### 2.2 src\index.js

src\index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router,Route} from 'react-router-dom';
import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';
ReactDOM.render(
    <Router>
        <div>
          <Route path="/" component={Home} exact/>
          <Route path="/user" component={User} />
          <Route path="/profile" component={Profile}/>
        </div>
    </Router>
,document.getElementById('root'));
```

### 2.3 Home.js

src\components\Home.js

```js
import React,{Component} from 'react';
export default class Home extends Component{
    render() {
        return (
            <div>Home</div>
        )
    }
}
```

### 2.4 Home.js

src\components\User.js

```js
import React,{Component} from 'react';
export default class User extends Component{
    render() {
        console.log(JSON.stringify(this.props));
        return (
            <div>User</div>
        )
    }
}
/**
{
    "history": {
        "length": 3,
        "action": "POP",
        "location": {
            "pathname": "/user",
            "search": "",
            "hash": ""
        }
    },
    "location": {
        "pathname": "/user",
        "search": "",
        "hash": ""
    },
    "match": {
        "path": "/user",
        "url": "/user",
        "isExact": true,
        "params": {}
    }
}
 */
```

### 2.4 Profile.js

src\components\Profile.js

```js
import React,{Component} from 'react';
export default class Profile extends Component{
    render() {
        return (
            <div>Profile</div>
        )
    }
}
```

## 3.实现基本路由

### 3.1 src\index.js

- [react-router-dom/modules/index.js](https://gitee.com/zhufengpeixun/react-router/blob/master/packages/react-router-dom/modules/index.js)

```diff
import React from 'react';
import ReactDOM from 'react-dom';
+import {HashRouter as Router,Route} from './react-router-dom';
import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';
ReactDOM.render(
    <Router>
        <div>
          <Route path="/" component={Home} exact/>
          <Route path="/user" component={User} />
          <Route path="/profile" component={Profile}/>
        </div>
    </Router>
,document.getElementById('root'));
```

### 3.2 RouterContext.js

src\react-router\RouterContext.js

```js
import React from 'react'
export default React.createContext({});
```

### 3.3 Router.js

src\react-router\Router.js

```js
import React from 'react'
import RouterContext from './RouterContext';
class Router extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            location:props.history.location
        }
        //当路径发生的变化的时候执行回调
        this.unlisten = props.history.listen((location)=>{
            this.setState({location});
        });
    }
    componentWillUnmount(){
        this.unlisten&&this.unlisten();
    }
    render(){
        let value = {//通过value向下层传递数据
            location:this.state.location,
            history:this.props.history
        }
        return (
            <RouterContext.Provider value={value}>
                {this.props.children}
            </RouterContext.Provider>
        )
    }
}

export default Router;
```

### 3.4 Route.js

src\react-router\Route.js

```js
import React from 'react'
import RouterContext from './RouterContext';
class Route extends React.Component{
    static contextType = RouterContext
    render(){
        const {history,location} = this.context;
        const {path,component:RouteComponent} = this.props;
        const match = location.pathname === path;
        let routeProps = {history,location};
        let element=null;
        if(match){
            element= <Component {...routeProps}/>
        }
        return element;
    }
}
export default Route;
```

### 3.5 react-router\index.js

src\react-router\index.js

```js
export {default as Route} from './Route';
export {default as Router} from './Router';
export {default as __RouterContext} from './RouterContext';
```

### 3.6 BrowserRouter.js

src\react-router-dom\BrowserRouter.js

```js
import React from 'react'
import {Router} from '../react-router';
import {createBrowserHistory} from 'history';
//创建相应的历史对象，并且传入Router组件，原样渲染子组件
class BrowserRouter extends React.Component{
    //不管是哪种创建历史对象的方法，得到的history 长的都一样，都像window.history
    history = createBrowserHistory(this.props)//window.history
    render(){
        return (
            <Router history={this.history}>
                {this.props.children}
            </Router>
        )
    }
}
export default BrowserRouter;
```

### 3.7 HashRouter.js

src\react-router-dom\HashRouter.js

```js
import React from 'react'
import {Router} from '../react-router';
import {createHashHistory} from 'history';
class HashRouter extends React.Component{
    history = createHashHistory()//hash实现
    render(){
        return (
            <Router history={this.history}>
                {this.props.children}
            </Router>
        )
    }
}
export default HashRouter;
```

### 3.8 react-router-dom\index.js

src\react-router-dom\index.js

```js
export * from '../react-router';
export {default as HashRouter} from './HashRouter';
export {default as BrowserRouter} from './BrowserRouter';
```

## 3.实现history

### 3.1 createBrowserHistory.js

src\history\createBrowserHistory.js

```js
function createBrowserHistory(props){
    let globalHistory = window.history;
    let listeners = [];
    function go(n){
        globalHistory.go(n);
    }
    function goBack(){
        go(-1)
    }
    function goForward(){
        go(1)
    }
    function listen(listener){
        listeners.push(listener);
        return function(){//unlisten
            listeners = listeners.filter(l=>l!==listener);
        }
    }
    function setState(newState){
        Object.assign(history,newState);
        history.length = globalHistory.length;
        listeners.forEach(listener=>listener(history.location));
    }
    /**
     * @param {*} pathname 可能是对象，也可能是字符串
     * @param {*} state 这个路径的状态对象是什么,只是一个路径的描述信息，可以放任何
     */
    function push(pathname, state){
        const action = 'PUSH';//表示发了什么动作引起了路径变化 POP PUSH
        if(typeof pathname === 'object'){
            state=pathname.state;
            pathname= pathname.pathname;
        }
        globalHistory.pushState(state,null,pathname);
        let location = {state,pathname};
        setState({action,location});
    }
    const history = {
        action: "POP",
        go,
        goBack,
        goForward,
        listen,
        location:{pathname:window.location.pathname,state:globalHistory.state},
        push
    }
    return history;
}

export default createBrowserHistory;
```

### 3.2 createHashHistory.js

src\history\createHashHistory.js

```js
function createHashHistory(){
    let stack = [];
    let index = -1;
    let action;//最新的动作
    let state;//这是最新的状态
    let listeners = [];
    function listen(listener){
        listeners.push(listener);
        return function(){//unlisten
            listeners = listeners.filter(l=>l!==listener);
        }
    }
    function go(n){
        action = 'POP';
        index += n;
        let nextLocation = stack[index];
        state = nextLocation.state;
        window.location.hash = nextLocation.pathname;
    }
    function goBack(){
        go(-1);
    }
    function goForward(){
        go(1);
    }
    window.addEventListener('hashchange',()=>{
        let pathname = window.location.hash.slice(1);
        Object.assign(history,{action,location:{pathname,state}});
        if(action === 'PUSH'){
            stack[++index]= history.location;
        }
        listeners.forEach(listener=>listener(history.location));
    });
    function push(pathname,nextState){
        action = 'PUSH';
        if(typeof pathname === 'object'){
            state=pathname.state;
            pathname= pathname.pathname;
        }else{
            state = nextState;
        }
        window.location.hash = pathname;
    }
    const history = {
        action: "POP",//默认是POP
        go,
        goBack,
        goForward,
        push,
        listen,
        location:{pathname:'/',state:undefined},
    }
    window.location.hash = window.location.hash?window.location.hash.slice(1):'/';
    return history;
}

export default createHashHistory;
```

### 3.3 history\index.js

src\history\index.js

```js
export {default as createBrowserHistory} from './createBrowserHistory';
export {default as createHashHistory} from './createHashHistory';
```

### 3.4 BrowserRouter.js

src\react-router-dom\BrowserRouter.js

```diff
import React from 'react'
import {Router} from '../react-router';
+import {createBrowserHistory} from '../history';
//创建相应的历史对象，并且传入Router组件，原样渲染子组件
class BrowserRouter extends React.Component{
    //不管是哪种创建历史对象的方法，得到的history 长的都一样，都像window.history
    history = createBrowserHistory(this.props)//window.history
    render(){
        return (
            <Router history={this.history}>
                {this.props.children}
            </Router>
        )
    }
}
export default BrowserRouter;
```

### 3.5 HashRouter.js

src\react-router-dom\HashRouter.js

```diff
import React from 'react'
import {Router} from '../react-router';
import {createHashHistory} from '../history';
class HashRouter extends React.Component{
    history = createHashHistory()//hash实现
    render(){
        return (
            <Router history={this.history}>
                {this.props.children}
            </Router>
        )
    }
}
export default HashRouter;
```

## 4. path-to-regexp

- [regulex](https://jex.im/regulex)
- path-to-regexp
  - sensitive 是否大小写敏感 (默认值: false)
  - strict 是否允许结尾有一个可选的/ (默认值: false)
  - end 是否匹配整个字符串 (默认值: true)

### 4.1 /home结束

```js
let pathToRegExp = require('path-to-regexp');
let regxp = pathToRegExp('/home',[],{end:true});
console.log(regxp);//   /^\/home\/?$/i
console.log(regxp.test('/home'));
console.log(regxp.test('/home/2'));
```

![homereg](http://img.zhufengpeixun.cn/homereg.png)

### 4.2 /home非结束

```js
let pathToRegExp = require('path-to-regexp');
let regExp = pathToRegExp('/home',[],{end:false});
console.log(regExp);//   /^\/home\/?(?=\/|$)/i
console.log(regExp.test('/home'));
console.log(regExp.test('/home/'));
console.log(regExp.test('/home//'));
console.log(regExp.test('/home/2'));
```

![homereg2](http://img.zhufengpeixun.cn/homereg2.png)

### 4.3 路径参数

```js
let params = [];
let regExp = pathToRegExp('/user/:id',params,{end:true});
console.log(regExp,params);
/**
/^\/user\/(?:([^\/]+?))\/?$/i
[ { name: 'id', optional: false, offset: 7 } ]
**/
```

![uerreg](http://img.zhufengpeixun.cn/uerreg.png)

### 4.4 正则匹配

- 是否捕获

| 表达式 | 含义                                                         |
| :----- | :----------------------------------------------------------- |
| ()     | 表示捕获分组，()会把每个分组里的匹配的值保存起来，使用$n(n是一个数字，表示第n个捕获组的内容) |
| (?:)   | 表示非捕获分组，和捕获分组唯一的区别在于，非捕获分组匹配的值不会保存起来 |
| (?...) | 表示命名捕获分组,反向引用一个命名分组的语法是 \k,在 replace() 方法的替换字符串中反向引用是用 $ |

- 前瞻和后顾 |表达式|含义| |:----|:----| |(?=pattern)|正向肯定查找(前瞻),后面必须跟着什么| |(?!pattern)|正向否定查找(前瞻)，后面不能跟着什么| |(?<=pattern)|反向肯定条件查找(后顾),不捕获| |(?<!pattern)|反向否定条件查找（后顾）|

```js
//会消耗掉字符的
//console.log('1a'.match(/\d[a-z][a-z]/));
//?= 正向肯定查找 不消费字符 正向前瞻
//console.log('1a'.match(/\d(?=[a-z])[a-z]/));

//匹配分组捕获
console.log('1ab'.match(/1([a-z])([a-z])/));
//非捕获分组
console.log('1ab'.match(/1(?:[a-z])([a-z])/));
//正向肯定前瞻
console.log('1a'.match(/\d(?=[a-z])[a-z]/));
//正向否定前瞻
console.log('1a'.match(/\d(?![A-Z])[a-z]/));
//反向肯定前瞻
console.log('1a'.match(/(?<=[a-z])\d[a-z]/));
//反向否定前瞻
console.log('1a'.match(/(?<![A-Z])\d[a-z]/));

let array = ['1ab'];
array.index = 0;
array.input = '1ab';
array.groups = undefined;
console.log(array);
```

- 命名捕获分组

```js
console.log(/(?<x>\d{2})-(?<y>\d{2})/.exec('11-22'));
console.log('11-22'.match(/(?<x>\d{2})-(?<y>\d{2})/));
console.log('11-11'.match(/(?<x>\d{2})-\k<x>/));
console.log('11-22'.replace(/(?<x>\d{2})-(?<y>\d{2})/, "$<y>-$<x>"));
```

## 5. 正则匹配

### 5.1 matchPath.js

src\react-router\matchPath.js

```js
import pathToRegexp from 'path-to-regexp';
function compilePath(path,options){
    const keys = [];
    const regexp = pathToRegexp(path,keys,options);
    return {keys,regexp};
}
/**
 * @param {*} pathname 浏览器栏中的真实路径
 * @param {*} options 匹配的参数 path exact strict sensitive
 */
function matchPath(pathname,options = {}){
    let {path='/',exact=false,strict=false,sensitive=false}=options;
    let {keys,regexp} = compilePath(path,{
        end:exact,
        strict,
        sensitive
    }); // /post/:id  keys=["id"] regexp= /\/post\/([^\/]+?)/
    const match = regexp.exec(pathname);
    if(!match) return null;
    const [url,...values] = match;//['/post/1','1'] url=/post/1 values=['1']
    // pathname /post/1/name !== /post/1
    const isExact = pathname === url;
    //需要精确匹配，但是匹配的不精确，没有完全相等，也相当于没匹配上
    if(exact && !isExact) return null;
    return { //路由组件中props.match
        path,//Route原始path
        url,//正则匹配到的浏览器的pathname的部分
        isExact,
        params:keys.reduce((memo,key,index)=>{
            memo[key.name] = values[index];
            return memo;
        },{})
    }
}

export default matchPath;
```

### 5.2 Router.js

src\react-router\Router.js

```diff
import React from 'react'
import RouterContext from './RouterContext';
class Router extends React.Component{
+    static computeRootMatch(pathname) {
+        return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
+    }
    constructor(props){
        super(props);
        this.state = {
            location:props.history.location
        }
        //当路径发生的变化的时候执行回调
        this.unlisten = props.history.listen((location)=>{
            this.setState({location});
        });
    }
    componentWillUnmount(){
        this.unlisten&&this.unlisten();
    }
    render(){
        let value = {//通过value向下层传递数据
            location:this.state.location,
            history:this.props.history,
+            match: Router.computeRootMatch(this.state.location.pathname)
        }
        return (
            <RouterContext.Provider value={value}>
                {this.props.children}
            </RouterContext.Provider>
        )
    }
}

export default Router;
```

### 5.3 Route.js

src\react-router\Route.js

```diff
import React from 'react'
import RouterContext from './RouterContext';
+import matchPath from './matchPath';
class Route extends React.Component{
    static contextType = RouterContext
    render(){
        const {history,location} = this.context;
        const {component:RouteComponent} = this.props;
+        const match = matchPath(location.pathname, this.props);
        let routeProps = {history,location};
        let element=null;
        if (match) {
+           routeProps.match = match;
            element = <RouteComponent {...routeProps} />
        }
        return (
            <RouterContext.Provider value={routeProps}>
                {element}
            </RouterContext.Provider>
        )
    }
}
export default Route;
```

### 5.4 react-router\index.js

src\react-router\index.js

```diff
export {default as Route} from './Route';
export {default as Router} from './Router';
export {default as __RouterContext} from './RouterContext';
+export {default as matchPath} from './matchPath';
```

## 6. 实现Switch

### 6.1 Switch.js

src\react-router\Switch.js

```js
import React from 'react'
import RouterContext from './RouterContext';
import matchPath from './matchPath';
class Switch extends React.Component {
    static contextType = RouterContext
    render() {
        const { location } = this.context;
        let element, match;
        React.Children.forEach(this.props.children, child => {
            if (!match && React.isValidElement(child)) {
                element = child;
                match = matchPath(location.pathname, child.props);
            }
        });
        return match ? React.cloneElement(element, {computedMatch: match }) : null
    }
}
export default Switch;
```

### 6.2 Route.js

src\react-router\Route.js

```diff
import React from 'react'
import RouterContext from './RouterContext';
import matchPath from './matchPath';
class Route extends React.Component{
    static contextType = RouterContext
    render(){
        const {history,location} = this.context;
+        const {component:RouteComponent,computedMatch} = this.props;
+        const match = computedMatch ? computedMatch : matchPath(location.pathname, this.props);
        let routeProps = {history,location};
        let element=null;
        if (match) {
            routeProps.match = match;
            element = <RouteComponent {...routeProps} />
        }
        return (
            <RouterContext.Provider value={routeProps}>
                {element}
            </RouterContext.Provider>
        )
    }
}
export default Route;
```

### 6.3 react-router\index.js

src\react-router\index.js

```diff
export {default as Route} from './Route';
export {default as Router} from './Router';
export {default as __RouterContext} from './RouterContext';
export {default as matchPath} from './matchPath';
+export {default as Switch} from './Switch';
```

### 6.4 src\index.js

src\index.js

```diff
import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router,Route,Switch} from './react-router-dom';
import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';
ReactDOM.render(
    <Router>
+        <Switch>
          <Route path="/" component={Home} exact/>
          <Route path="/user" component={User} />
          <Route path="/profile" component={Profile}/>
+        </Switch>
    </Router>
,document.getElementById('root'));
```

## 7. Redirect

### 7.1 Redirect.js

src\react-router\Redirect.js

```js
import React from 'react'
import RouterContext from './RouterContext';
import Lifecycle from './Lifecycle';

function Redirect({to}){
    return (
        <RouterContext.Consumer>
            {
                contextValue=>{
                    const {history}= contextValue;
                    return (
                        <Lifecycle
                           onMount={()=>history.push(to)}
                        />
                    );
                }
            }
        </RouterContext.Consumer>
    );
}
export default Redirect;
```

### 7.2 Lifecycle.js

src\react-router\Lifecycle.js

```js
import React from 'react';
class Lifecycle extends React.Component{
    componentDidMount(){
        if(this.props.onMount)
            this.props.onMount(this);
    }
    componentWillUnmount(){
        if(this.props.onUnmount)
            this.props.onUnmount(this);
    }
    render(){
        return null;
    }
}
export default Lifecycle;
```

### 7.3 react-router\index.js

src\react-router\index.js

```diff
export {default as Route} from './Route';
export {default as Router} from './Router';
export {default as __RouterContext} from './RouterContext';
export {default as matchPath} from './matchPath';
export {default as Switch} from './Switch';
+export {default as Redirect} from './Redirect';
```

### 7.4 src\index.js

src\index.js

```diff
import React from 'react';
import ReactDOM from 'react-dom';
+import {HashRouter as Router,Route,Switch,Redirect} from './react-router-dom';
import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';
ReactDOM.render(
    <Router>
        <Switch>
          <Route path="/" component={Home} exact/>
          <Route path="/user" component={User} />
          <Route path="/profile" component={Profile}/>
+         <Redirect to="/"/>
        </Switch>
    </Router>
,document.getElementById('root'));
```

## 8.Link

### 8.1 Link.js

src\react-router-dom\Link.js

```js
import React from 'react';
import {__RouterContext as RouterContext} from '../react-router';
export default function Link(props){
    return (
        <RouterContext.Consumer>
            {
                contextValue=>{
                    return (
                        <a
                           {...props}
                           onClick={(event)=>{
                              event.preventDefault();
                              contextValue.history.push(props.to);
                           }}
                        >{props.children}</a>
                    )
                }
            }
        </RouterContext.Consumer>
    )
}
```

### 8.2 react-router-dom\index.js

src\react-router-dom\index.js

```diff
export * from '../react-router';
export {default as HashRouter} from './HashRouter';
export {default as BrowserRouter} from './BrowserRouter';
+export {default as Link} from './Link';
```

### 8.3 src\index.js

src\index.js

```diff
import React from 'react';
import ReactDOM from 'react-dom';
+import {HashRouter as Router,Route,Switch,Redirect,Link} from './react-router-dom';
import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';
ReactDOM.render(
    <Router>
+      <ul>
+          <li><Link to="/">首页</Link></li>
+          <li><Link to="/user" >用户管理</Link></li>
+          <li><Link to="/profile" >个人中心</Link></li>
+      </ul>
        <Switch>
          <Route path="/" component={Home} exact/>
          <Route path="/user" component={User} />
          <Route path="/profile" component={Profile}/>
          <Redirect to="/"/>
        </Switch>
    </Router>
,document.getElementById('root'));
```

## 9.嵌套路由

### 9.1 utils.js

src\utils.js

```js
export const UserAPI = {
    list(){
        let usersStr = localStorage.getItem('users');
        let users= usersStr ? JSON.parse(usersStr) : [];
        return users;
    },
    add(user){
        let users = UserAPI.list();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    },
    find(id){
        let users = UserAPI.list();
        return users.find((user) => user.id === id);
    }
}
```

### 9.2 User.js

src\components\User.js

```diff
import React from 'react';
import { Link, Route } from '../react-router-dom';
+import UserAdd from './UserAdd';
+import UserDetail from './UserDetail';
+import UserList from './UserList';
export default function User() {
    return (
+        <div>
+             <ul>
+                    <li><Link to="/user/list">用户列表</Link></li>
+                    <li><Link to="/user/add">添加用户</Link></li>
+                </ul>
+            <div>
+                <Route path="/user/add" component={UserAdd} />
+                <Route path="/user/list" component={UserList} />
+                <Route path="/user/detail/:id" component={UserDetail} />
+            </div>
+        </div>
    )
}
```

### 9.3 UserAdd.js

src\components\UserAdd.js

```js
import React, { Component } from 'react';
import {UserAPI} from '../utils';
export default class UserAdd extends Component {
    usernameRef
    constructor(props) {
        super(props);
        this.usernameRef = React.createRef();
    }
    handleSubmit = (event) => {
        event.preventDefault();
        let username = this.usernameRef.current.value;
        UserAPI.add({ id: Date.now() + '', username });
        this.props.history.push('/user/list');
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input  type="text" ref={this.usernameRef} />
                <button type="submit" >提交</button>
            </form>
        )
    }
}
```

### 9.4 UserList.js

src\components\UserList.js

```js
import React, { Component } from 'react'
import { Link } from '../react-router-dom';
import {UserAPI} from '../utils';
export default class UserList extends Component {
    state = { users: [] }
    componentDidMount() {
        let users = UserAPI.list();
        this.setState({ users });
    }
    render() {
        return (
            <ul >
                {
                    this.state.users.map((user, index) => (
                        <li  key={index}>
                            <Link to={{ pathname: `/user/detail/${user.id}`, state: user }}>{user.username}</Link>
                        </li>
                    ))
                }
            </ul>
        )
    }
}
```

### 9.5 UserDetail.js

src\components\UserDetail.js

```js
import React, { Component } from 'react';
import {UserAPI} from '../utils';
export default class UserDetail extends Component {
    state = {
        user: {}
    }
    componentDidMount() {
        let user = this.props.location.state;
        if (!user) {
            let id = this.props.match.params.id;
            user = UserAPI.find(id);
        }
        if (user) this.setState({ user });
    }
    render() {
        let user = this.state.user;
        return (
            <div>
                {user.id}:{user.username}
            </div>
        )
    }
}
```

## 10.受保护路由

### 10.1 src\index.js

src\index.js

```diff
import React from 'react';
import ReactDOM from 'react-dom';
+import {HashRouter as Router,Route,Switch,Redirect,Link} from './react-router-dom';
import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';
+import Protected from './components/Protected';
+import Login from './components/Login';
ReactDOM.render(
    <Router>
      <ul>
          <li><Link to="/">首页</Link></li>
          <li><Link to="/user" >用户管理</Link></li>
          <li><Link to="/profile" >个人中心</Link></li>
      </ul>
        <Switch>
          <Route path="/" component={Home} exact/>
          <Route path="/user" component={User} />
+         <Protected path="/profile" component={Profile}/>
+         <Route path="/login" component={Login}/>
          <Redirect to="/"/>
        </Switch>
    </Router>
,document.getElementById('root'));
```

### 10.2 Route.js

src\react-router\Route.js

```diff
import React from 'react'
import RouterContext from './RouterContext';
import matchPath from './matchPath';
class Route extends React.Component{
    static contextType = RouterContext
    render(){
        const {history,location} = this.context;
+       const {component:RouteComponent,computedMatch,render} = this.props;
        const match = computedMatch ? computedMatch : matchPath(location.pathname, this.props);
        let routeProps = {history,location};
        let element=null;
+       if (match) {
+           routeProps.match = match;
+           if (RouteComponent) {
+               element = <RouteComponent {...routeProps} />
+           } else if (render) {
+               element=  render(routeProps);
+           } else {
+               element=  null;
+           }
+       }else {
+            element=  null;
+       }
        return (
            <RouterContext.Provider value={routeProps}>
                {element}
            </RouterContext.Provider>
        )
    }
}
export default Route;
```

### 10.3 Login.js

src\components\Login.js

```js
import React from 'react';
class Login extends React.Component{
    login = ()=>{
        localStorage.setItem('login','true');
        let to='/';
        if(this.props.location.state){
            to=this.props.location.state.from||'/';
        }
        this.props.history.push(to);
    }
    render(){
        return (
            <button onClick={this.login}>登录</button>
        )
    }
}
export default Login;
```

### 10.4 Protected.js

src\components\Protected.js

```js
import React from 'react';
import {Route,Redirect} from '../react-router-dom';
const Protected =  (props)=>{
    let {component:RouteComponent,path} = props;
    return (
        <Route path={path} render={
            (routeProps)=>(
                localStorage.getItem('login')?<RouteComponent {...routeProps}/>:
                <Redirect to={{pathname:'/login',state:{from:path}}}/>
            )
        }/>
    )
}
export default Protected;
```

## 11.NavLink

### 11.1 public\index.html

public\index.html

```diff
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
    <style>
+      .strong{
+        font-size: 20px;
+      }
+      .active{
+        background-color: green;
+      }
    </style>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

### 11.2 src\index.js

src\index.js

```diff
import React from 'react';
import ReactDOM from 'react-dom';
+import {HashRouter as Router,Route,Switch,Redirect,NavLink} from './react-router-dom';
import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';
import Protected from './components/Protected';
import Login from './components/Login';
ReactDOM.render(
    <Router>
      <ul>
+        <li><NavLink className="strong" style={{textDecoration: 'line-through'}} activeStyle={{color:'red'}} to="/" exact>Home</NavLink></li>
+        <li><NavLink activeStyle={{color:'red'}}  to="/user">User</NavLink></li>
+        <li><NavLink activeStyle={{color:'red'}}  to="/profile">Profile</NavLink></li>
      </ul>
        <Switch>
          <Route path="/" component={Home} exact/>
          <Route path="/user" component={User} />
          <Protected path="/profile" component={Profile}/>
          <Route path="/login" component={Login}/>
          <Redirect to="/"/>
        </Switch>
    </Router>
,document.getElementById('root'));
```

### 11.3 NavLink.js

src\react-router-dom\NavLink.js

```js
import React from 'react';
import {Link} from './';
import {__RouterContext as RouterContext,matchPath} from '../react-router';
function NavLink(props){
    let context = React.useContext(RouterContext);
    let {pathname}= context.location;
    const {
        to:path,//Link的to属性，指的对应的路径
        className:classNameProp='',//自定义类名
        activeClassName='active',//激活类名
        style:styleProp={},//普通样式
        activeStyle={},//只有路径匹配的才会生效
        children,
        exact
    }= props;
    let isActive = matchPath(pathname,{path,exact});
    let className = isActive?joinClassnames(classNameProp,activeClassName):classNameProp;
    let style = isActive?{...styleProp,...activeStyle}:styleProp;
    let linkProps = {
        className,
        style,
        to:path,
        children
    }
    return <Link {...linkProps}/>

}
function joinClassnames(...classnames){
    return classnames.filter(c=>c).join(' ');
}
export default NavLink;
```

### 11.4 react-router-dom\index.js

src\react-router-dom\index.js

```diff
export * from '../react-router';
export {default as HashRouter} from './HashRouter';
export {default as BrowserRouter} from './BrowserRouter';
export {default as Link} from './Link';
+export { default as NavLink } from "./NavLink";
```

## 12.withRouter

### 12.1 src\index.js

src\index.js

```diff
import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router,Route,Switch,Redirect,NavLink} from './react-router-dom';
import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';
import Protected from './components/Protected';
import Login from './components/Login';
+import NavHeader from './components/NavHeader';
ReactDOM.render(
    <Router>
      <>
+      <NavHeader title="欢迎光临"/>
      <ul>
        <li><NavLink className="strong" style={{textDecoration: 'line-through'}} activeStyle={{color:'red'}} to="/" exact>Home</NavLink></li>
        <li><NavLink activeStyle={{color:'red'}}  to="/user">User</NavLink></li>
        <li><NavLink activeStyle={{color:'red'}}  to="/profile">Profile</NavLink></li>
      </ul>
      <Switch>
          <Route path="/" component={Home} exact/>
          <Route path="/user" component={User} />
          <Protected path="/profile" component={Profile}/>
          <Route path="/login" component={Login}/>
          <Redirect to="/"/>
      </Switch>
      </>
    </Router>
,document.getElementById('root'));
```

### 12.2 NavHeader.js

src\components\NavHeader.js

```js
import React from 'react';
import {withRouter} from '../react-router-dom';
class NavHeader extends React.Component{
    render(){
        return (
            <div onClick={()=>this.props.history.push('/')} >{this.props.title}</div>
        )
    }
}

export default withRouter(NavHeader);
```

### 12.3 withRouter.js

src\react-router\withRouter.js

```js
import React from 'react';
import RouterContext from './RouterContext';
function withRouter(OldComponent){
    return props => {
        return (
            <RouterContext.Consumer>
                {
                    contextValue =>{
                        return <OldComponent {...props} {...contextValue}/>
                    }
                }
            </RouterContext.Consumer>
        )
    }
}

export default withRouter;
```

### 12.4 react-router\index.js

src\react-router\index.js

```diff
export {default as Route} from './Route';
export {default as Router} from './Router';
export {default as __RouterContext} from './RouterContext';
export {default as matchPath} from './matchPath';
export {default as Switch} from './Switch';
export {default as Redirect} from './Redirect';
+export {default as withRouter} from './withRouter';
```

## 13.Prompt

### 13.1 src\index.js

src\index.js

```diff
import React from 'react';
import ReactDOM from 'react-dom';
+import {BrowserRouter as Router,Route,Switch,Redirect,NavLink} from './react-router-dom';
import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';
import Protected from './components/Protected';
import Login from './components/Login';
import NavHeader from './components/NavHeader';
ReactDOM.render(
+    <Router getUserConfirmation={()=>window.confirm}>
      <>
      <NavHeader title="欢迎光临"/>
      <ul>
        <li><NavLink className="strong" style={{textDecoration: 'line-through'}} activeStyle={{color:'red'}} to="/" exact>Home</NavLink></li>
        <li><NavLink activeStyle={{color:'red'}}  to="/user">User</NavLink></li>
        <li><NavLink activeStyle={{color:'red'}}  to="/profile">Profile</NavLink></li>
      </ul>
      <Switch>
          <Route path="/" component={Home} exact/>
          <Route path="/user" component={User} />
          <Protected path="/profile" component={Profile}/>
          <Route path="/login" component={Login}/>
          <Redirect to="/"/>
      </Switch>
      </>
    </Router>
,document.getElementById('root'));
```

### 13.2 UserAdd.js

src\components\UserAdd.js

```diff
import React, { Component } from 'react';
import {UserAPI} from '../utils';
import {Prompt} from '../react-router-dom';
export default class UserAdd extends Component {
    usernameRef
+    state = {isBlocking:false}
    constructor(props) {
        super(props);
        this.usernameRef = React.createRef();
    }
    handleSubmit = (event) => {
        event.preventDefault();
+        this.setState({
+            isBlocking:false
+        },()=>{
            let username = this.usernameRef.current.value;
            UserAPI.add({ id: Date.now() + '', username });
            this.props.history.push('/user/list');
+        });
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
+                 <Prompt
+                   when={this.state.isBlocking}
+                   message = {
+                       (location)=>`请问你确定要跳转到${location.pathname}吗?`
+                   }
+                />
+               <input  type="text" ref={this.usernameRef}  onChange={(event) => {
+                   this.setState({ isBlocking: event.target.value.length > 0 });
+               }} />
                <button type="submit" >提交</button>
            </form>
        )
    }
}
```

### 13.3 Prompt.js

src\react-router\Prompt.js

```js
import React from 'react';
import RouterContext from './RouterContext';
import Lifecycle from './Lifecycle';
function Prompt({when,message}){
  return (
    <RouterContext.Consumer>
    {
        contextValue =>{
            //如果不需要阻止，则直接返回null 什么都不干 什么都不渲染
            if(!when) return null;
            const block = contextValue.history.block;//需要给history添加一个 block方法
            return (
                <Lifecycle
                   onMount={
                       self=>self.release = block(message)
                   }
                   onUnmount={
                       self=>self.release()
                   }
                />
            )
        }
    }
    </RouterContext.Consumer>
  )
}
export default Prompt;
```

### 13.4 react-router\index.js

src\react-router\index.js

```diff
export {default as Route} from './Route';
export {default as Router} from './Router';
export {default as __RouterContext} from './RouterContext';
export {default as matchPath} from './matchPath';
export {default as Switch} from './Switch';
export {default as Redirect} from './Redirect';
export {default as withRouter} from './withRouter';
+export {default as Prompt} from './Prompt';
```

### 13.5 createBrowserHistory.js

src\history\createBrowserHistory.js

```diff
function createBrowserHistory(props){
+   let confirm =props.getUserConfirmation?props.getUserConfirmation():window.confirm;
    let globalHistory = window.history;
    let listeners = [];
+   let message;
    function go(n){
        globalHistory.go(n);
    }
    function goBack(){
        go(-1)
    }
    function goForward(){
        go(1)
    }
    function listen(listener){
        listeners.push(listener);
        return function(){//unlisten
            listeners = listeners.filter(l=>l!==listener);
        }
    }
    function setState(newState){
        Object.assign(history,newState);
        history.length = globalHistory.length;
        listeners.forEach(listener=>listener(history.location));
    }
    /**
     * @param {*} pathname 可能是对象，也可能是字符串
     * @param {*} state 这个路径的状态对象是什么,只是一个路径的描述信息，可以放任何
     */
    function push(pathname, state){
        const action = 'PUSH';//表示发了什么动作引起了路径变化 POP PUSH
        if(typeof pathname === 'object'){
            state=pathname.state;
            pathname= pathname.pathname;
        }
+        if(message){
+            let showMessage = message({pathname});
+            let allow = confirm(showMessage);
+            if(!allow){
+                return;
+            }
+        }
        globalHistory.pushState(state,null,pathname);
        let location = {state,pathname};
        setState({action,location});
    }
+    function block(newMessage){
+        message=newMessage;
+        return ()=> message=null;
+    }
    const history = {
        action: "POP",
        go,
        goBack,
        goForward,
        listen,
        location:{pathname:window.location.pathname,state:globalHistory.state},
        push,
+        block
    }
    return history;
}

export default createBrowserHistory;
```

## 15.hooks

### 15.1 src\index.js

src\index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router,Route,Link,
useParams,
useLocation,
useHistory,
useRouteMatch
} from './react-router-dom';
function Home(){
  return <div>首页</div>;
}
function UserDetail(){
  let params = useParams();
  console.log('params',params);
  let location = useLocation();
  console.log('location',location);
  let history = useHistory();
  console.log('history',history);
return <div>User id:{params.id} <br/>name:{location.state.name}</div>;
}

function Post(){
  let match = useRouteMatch({
    path:'/post/:id',
    strict:true,
    sensitive:true
  });
  console.log('match',match);
  return match?<div>id:{match.params.id}</div>:<div>Not Found</div>
}
 ReactDOM.render(
  <Router>
    <div>
    <ul>
        <li><Link to="/">首页</Link></li>
        <li><Link  to={{pathname:"/user/detail/1",state:{id:1,name:'珠峰架构'}}}>用户1详情</Link></li>
        <li><Link to="/post/1">贴子</Link></li>
    </ul>
    <Route path="/" component={Home}/>
    <Route path="/user/detail/:id" component={UserDetail}/>   
    <Route path="/post/:id" component={Post}/>   
    </div>
  </Router>,
  document.getElementById('root')
);
```

### 15.2 hooks.js

src\react-router\hooks.js

```js
import React from 'react';
import RouterContext from './RouterContext';
import matchPath from './matchPath';
export function useParams(){
    let match = React.useContext(RouterContext).match;
    return match?match.params:{};
}
export function useLocation(){
    return React.useContext(RouterContext).location;
}
export function useHistory(){
    return React.useContext(RouterContext).history;
}
export function useRouteMatch(path){
   const location = useLocation();//获取当前的路径pathname代表当前的路径名
   let match = React.useContext(RouterContext).match;//获得匹配结果
   return path?matchPath(location.pathname,path):match;
}
```

### 15.3 react-router\index.js

src\react-router\index.js

```diff
export {default as Route} from './Route';
export {default as Router} from './Router';
export {default as __RouterContext} from './RouterContext';
export {default as matchPath} from './matchPath';
export {default as Switch} from './Switch';
export {default as Redirect} from './Redirect';
export {default as withRouter} from './withRouter';
export {default as Prompt} from './Prompt';
+export {useHistory,useLocation,useParams,useRouteMatch} from './hooks';
```

## 16.路由懒加载

### 16.1 src\index.js

src\index.js

```js
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router, Route,Link
} from 'react-router-dom';

function lazy(load) {
  return class extends React.Component {
    state = { InnerComponent: null }
    componentDidMount() {
      load().then(result => {
        this.setState({ InnerComponent: result.default || result });
      });
    }
    render() {
      let { InnerComponent } = this.state;
      return InnerComponent ? <InnerComponent /> : null;
    }
  }
}
const LazyHome = React.lazy(() => import(/* webpackChunkName: "Home" */'./components/Home'));
const LazyLogin = React.lazy(() => import(/* webpackChunkName: "Login" */'./components/Login'));
function Loading() {
  return <div>加载中......</div>
}
function SuspenseHome() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyHome />
    </Suspense>
  )
}
function SuspenseLogin() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyLogin />
    </Suspense>
  )
}
//webpack chunkFilename
ReactDOM.render(
  <Router>
    <div>
       <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">User</Link></li>
      </ul>
      <Route exact path="/" component={SuspenseHome} />
      <Route path="/login" component={SuspenseLogin} />
    </div>
  </Router>,
  document.getElementById('root')
);
```

## 链接

- [zhufeng_react_router](https://gitee.com/zhufengpeixun/zhufeng_react_router_20201106_prepare)

