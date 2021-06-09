---
title: 基础（二）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# react_hooks

## 1. React Hooks

- Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性
- 如果你在编写函数组件并意识到需要向其添加一些 state，以前的做法是必须将其它转化为 class。现在你可以在现有的函数组件中使用 Hook

## 2. 解决的问题

- 在组件之间复用状态逻辑很难,可能要用到render props和高阶组件，React 需要为共享状态逻辑提供更好的原生途径，Hook 使你在无需修改组件结构的情况下复用状态逻辑
- 复杂组件变得难以理解，Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）
- 难以理解的 class,包括难以捉摸的`this`

## 3. 注意事项

- 只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。
- 只能在 React 的函数组件中调用 Hook。不要在其他 JavaScript 函数中调用

## 4. useState

- useState 就是一个 Hook
- 通过在函数组件里调用它来给组件添加一些内部 state,React 会在重复渲染时保留这个 state
- useState 会返回一对值：当前状态和一个让你更新它的函数，你可以在事件处理函数中或其他一些地方调用这个函数。它类似 class 组件的 this.setState，但是它不会把新的 state 和旧的 state 进行合并
- useState 唯一的参数就是初始 state
- 返回一个 state，以及更新 state 的函数
  - 在初始渲染期间，返回的状态 (state) 与传入的第一个参数 (initialState) 值相同
  - setState 函数用于更新 state。它接收一个新的 state 值并将组件的一次重新渲染加入队列

```js
const [state, setState] = useState(initialState);
```

### 4.1 计数器

```js
import React,{useState} from 'react';
class Counter extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          number: 0
      };
  }
  render() {
      return (
          <div>
              <p>{this.state.number}</p>
              <button onClick={() => this.setState({ number: this.state.number + 1 })}>
                  +
        </button>
          </div>
      );
  }
}
function Counter2(){
  const [number,setNumber] = useState(0);
  return (
      <>
          <p>{number}</p>
          <button onClick={()=>setNumber(number+1)}>+</button>
      </>
  )
}
export default Counter2;
```

### 4.2 每次渲染都是独立的闭包

- 每一次渲染都有它自己的 Props and State
- 每一次渲染都有它自己的事件处理函数
- alert会“捕获”我点击按钮时候的状态。
- 我们的组件函数每次渲染都会被调用，但是每一次调用中number值都是常量，并且它被赋予了当前渲染中的状态值
- 在单次渲染的范围内，props和state始终保持不变
- [making-setinterval-declarative-with-react-hooks](https://overreacted.io/making-setinterval-declarative-with-react-hooks/)

```js
function Counter2(){
  const [number,setNumber] = useState(0);
  function alertNumber(){
    setTimeout(()=>{
      alert(number);
    },3000);
  }
  return (
      <>
          <p>{number}</p>
          <button onClick={()=>setNumber(number+1)}>+</button>
          <button onClick={alertNumber}>alertNumber</button>
      </>
  )
}
```

- 如何在异步中获取最新的值

```js
function Counter() {
    const [number, setNumber] = useState(0);
    const savedCallback = useRef();
    function alertNumber() {
        setTimeout(() => {
            alert(savedCallback.current);
        }, 3000);
    }
    return (
        <>
            <p>{number}</p>
            <button onClick={() => {
                setNumber(number + 1);
                savedCallback.current = number + 1;
            }}>+</button>
            <button onClick={alertNumber}>alertNumber</button>
        </>
    )
}
```

### 4.3 函数式更新

- 如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给 setState。该函数将接收先前的 state，并返回一个更新后的值

```diff
function Counter2(){
  const [number,setNumber] = useState(0);
  let numberRef = useRef(number);
  numberRef.current = number;
  function alertNumber(){
    setTimeout(()=>{
      alert(numberRef.current);
    },3000);
  }
+  function lazy(){
+    setTimeout(()=>{
+      setNumber(number+1);
+    },3000);
+  }
+  function lazyFunc(){
+    setTimeout(()=>{
+      setNumber(number=>number+1);
+    },3000);
+  }
  return (
      <>
          <p>{number}</p>
          <button onClick={()=>setNumber(number+1)}>+</button>
          <button onClick={lazy}>lazy+</button>
          <button onClick={lazyFunc}>lazyFunc+</button>
          <button onClick={alertNumber}>alertNumber</button>
      </>
  )
}
```

### 4.4 惰性初始 state

- initialState 参数只会在组件的初始渲染中起作用，后续渲染时会被忽略
- 如果初始 state 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 state，此函数只在初始渲染时被调用
- 与 class 组件中的 setState 方法不同，useState 不会自动合并更新对象。你可以用函数式的 setState 结合展开运算符来达到合并更新对象的效果

```js
function Counter(){
  const [{name,number},setValue] = useState(()=>{
    return {name:'计数器',number:0};
  });
  return (
      <>
          <p>{name}:{number}</p>
          <button onClick={()=>setValue({number:number+1})}>+</button>
      </>
  )
}
```

### 4.5 性能优化

#### 4.5.1 Object.is

- 调用 State Hook 的更新函数并传入当前的 state 时，React 将跳过子组件的渲染及 effect 的执行。（React 使用 Object.is 比较算法 来比较 state。）

  ```js
  function Counter4(){
  const [counter,setCounter] = useState({name:'计数器',number:0});
  console.log('render Counter')
  return (
      <>
          <p>{counter.name}:{counter.number}</p>
          <button onClick={()=>setCounter({...counter,number:counter.number+1})}>+</button>
          <button onClick={()=>setCounter(counter)}>-</button>
      </>
  )
  }
  ```

#### 4.5.2 减少渲染次数

- 把内联回调函数及依赖项数组作为参数传入 `useCallback`，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新
- 把创建函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算

```js
function Child({onButtonClick,data}){
  console.log('Child render');
  return (
    <button onClick={onButtonClick} >{data.number}</button>
  )
}
Child = memo(Child);
function App(){
  const [number,setNumber] = useState(0);
  const [name,setName] = useState('zhufeng');
  const addClick = useCallback(()=>setNumber(number+1),[number]);
  const  data = useMemo(()=>({number}),[number]);
  return (
    <div>
      <input type="text" value={name} onChange={e=>setName(e.target.value)}/>
      <Child onButtonClick={addClick} data={data}/>
    </div>
  )
}
```

### 4.6 useState+useCallback+useMemo实现

```js
import React from 'react';
import ReactDOM from 'react-dom';
let hookStates = [];
let hookIndex = 0;
function useState(initialState){
  hookStates[hookIndex] = hookStates[hookIndex]||initialState;
  let currentIndex = hookIndex; 
  function setState(newState){
    hookStates[currentIndex]=newState;
    render();
  }
  return [hookStates[hookIndex++],setState];
}
function useMemo(factory,deps){
  if(hookStates[hookIndex]){
    let [lastMemo,lastDeps] = hookStates[hookIndex];
    let same = deps.every((item,index)=>item === lastDeps[index]);
    if(same){
      hookIndex++;
      return lastMemo;
    }else{
      let newMemo = factory();
      hookStates[hookIndex++]=[newMemo,deps];
      return newMemo;
    }
  }else{//如果取不到，说明第一次调用
    let newMemo = factory();
    hookStates[hookIndex++]=[newMemo,deps];
    return newMemo;
  }
}
function useCallback(callback,deps){
  if(hookStates[hookIndex]){
    let [lastCallback,lastDeps] = hookStates[hookIndex];
    let same = deps.every((item,index)=>item === lastDeps[index]);
    if(same){
      hookIndex++;
      return lastCallback;
    }else{
      hookStates[hookIndex++]=[callback,deps];
      return callback;
    }
  }else{//如果取不到，说明第一次调用
    hookStates[hookIndex++]=[callback,deps];
    return callback;
  }
}

let  Child = ({data,handleClick})=>{
  console.log('Child render');
  return (
     <button onClick={handleClick}>{data.number}</button>
  )
}
class PureComponent extends React.Component {
  shouldComponentUpdate(newProps,nextState) {
    return !shallowEqual(this.props, newProps)||!shallowEqual(this.state, nextState);
  }
}
function shallowEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }
  if (typeof obj1 != "object" ||obj1 === null ||typeof obj2 != "object" ||obj2 === null) {
    return false;
  }
  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let key of keys1) {
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}
function memo(OldComponent){
  return class extends PureComponent{
    render(){
      return <OldComponent {...this.props}/>
    }
  }
}
Child = memo(Child);

function App(){
  console.log('App render');
  const[name,setName]=useState('zhufeng');
  const[number,setNumber]=useState(0);
  let data = useMemo(()=>({number}),[number]);
  let handleClick = useCallback(()=> setNumber(number+1),[number]);
  return (
    <div>
      <input type="text" value={name} onChange={event=>setName(event.target.value)}/>
      <Child data={data} handleClick={handleClick}/>
    </div>
  )
}

function render(){
  hookIndex=0;
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
}
render();
```

### 4.7 注意事项

- 只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。

  ```js
  import React, { useEffect, useState, useReducer } from 'react';
  import ReactDOM from 'react-dom';
  function App() {
    const [number, setNumber] = useState(0);
    const [visible, setVisible] = useState(false);
    if (number % 2 == 0) {
        useEffect(() => {
            setVisible(true);
        }, [number]);
    } else {
        useEffect(() => {
            setVisible(false);
        }, [number]);
    }
    return (
        <div>
            <p>{number}</p>
            <p>{visible && <div>visible</div>}</p>
            <button onClick={() => setNumber(number + 1)}>+</button>
        </div>
    )
  }
  ReactDOM.render(<App />, document.getElementById('root'));
  ```

## 5. useReducer

- useState 的替代方案。它接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法
- 在某些场景下，useReducer 会比 useState 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等

### 5.1 基本用法

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
import React from 'react';
import ReactDOM from 'react-dom';
function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return {number: state.number + 1};
    case 'minus':
      return {number: state.number - 1};
    default:
      return state;
  }
}
function init(initialState){
    return {number:initialState};
}
function Counter1(){
  const [state, setState] = React.useState({number:0});
  return (
      <>
        Count: {state.number}
        <button onClick={() => setState({number:state.number+1})}>+</button>
        <button onClick={() => setState({number:state.number-1})}>-</button>
      </>
  )
}
function Counter2(){
    const [state, dispatch] = React.useReducer(reducer, 0,init);
    return (
        <>
          Count: {state.number}
          <button onClick={() => dispatch({type: 'add'})}>+</button>
          <button onClick={() => dispatch({type: 'minus'})}>-</button>
        </>
    )
}

function render(){
  ReactDOM.render(
    <>
     <Counter1 />
     <Counter2 />
    </>,
    document.getElementById('root')
  );
}
render();
```

实现

```js
import React from 'react';
import ReactDOM from 'react-dom';
let hookStates = [];
let hookIndex = 0;
function useReducer(reducer, initialState,init) {
  hookStates[hookIndex]=hookStates[hookIndex]||(init?init(initialState):initialState);
  let currentIndex = hookIndex;
  function dispatch(action) {
    hookStates[currentIndex]=reducer?reducer(hookStates[currentIndex],action):action;
    render();
  }
  return [hookStates[hookIndex++], dispatch];
}
function useState(initialState){
  return useReducer(null,initialState);
}
function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return {number: state.number + 1};
    case 'minus':
      return {number: state.number - 1};
    default:
      return state;
  }
}
function init(initialState){
    return {number:initialState};
}
function Counter1(){
  const [state, setState] = useState({number:0});
  return (
      <>
        Count: {state.number}
        <button onClick={() => setState({number:state.number+1})}>+</button>
        <button onClick={() => setState({number:state.number-1})}>-</button>
      </>
  )
}
function Counter2(){
    const [state, dispatch] = useReducer(reducer, 0,init);
    return (
        <>
          Count: {state.number}
          <button onClick={() => dispatch({type: 'add'})}>+</button>
          <button onClick={() => dispatch({type: 'minus'})}>-</button>
        </>
    )
}

function render(){
  hookIndex=0;
  ReactDOM.render(
    <>
     <Counter1 />
     <Counter2 />
    </>,
    document.getElementById('root')
  );
}
render();



/*
useMemo<{
  number: number;
}>(factory: () => {
  number: number;
}, deps: React.DependencyList): {
  number: number;
} */
```

## 6. useContext

- 接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值
- 当前的 context 值由上层组件中距离当前组件最近的 <MyContext.Provider> 的 value prop 决定
- 当组件上层最近的 <MyContext.Provider> 更新时，该 Hook 会触发重渲染，并使用最新传递给 MyContext provider 的 context value 值
- useContext(MyContext) 相当于 class 组件中的 `static contextType = MyContext` 或者 `<MyContext.Consumer>`
- useContext(MyContext) 只是让你能够读取 context 的值以及订阅 context 的变化。你仍然需要在上层组件树中使用 <MyContext.Provider> 来为下层组件提供 context

```js
import React from 'react';
import ReactDOM from 'react-dom';

const CounterContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return {number: state.number + 1};
    case 'minus':
      return {number: state.number - 1};
    default:
      return state;
  }
}
function Counter(){
  let {state,dispatch} = React.useContext(CounterContext);
  return (
      <>
        <p>{state.number}</p>
        <button onClick={() => dispatch({type: 'add'})}>+</button>
        <button onClick={() => dispatch({type: 'minus'})}>-</button>
      </>
  )
}
function App(){
    const [state, dispatch] = React.useReducer(reducer, {number:0});
    return (
        <CounterContext.Provider value={{state,dispatch}}>
          <Counter/>
        </CounterContext.Provider>
    )
}

ReactDOM.render(<App/>,document.getElementById('root'));
function useContext(context){
  return context._currentValue;
}
```

## 7. useEffect

- 在函数组件主体内（这里指在 React 渲染阶段）改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性
- 使用 useEffect 完成副作用操作。赋值给 useEffect 的函数会在组件渲染到屏幕之后执行。你可以把 effect 看作从 React 的纯函数式世界通往命令式世界的逃生通道
- useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 具有相同的用途，只不过被合并成了一个 API
- 该 Hook 接收一个包含命令式、且可能有副作用代码的函数

```js
useEffect(didUpdate);
```

### 7.1 通过class实现修改标题

```js
class Counter extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        number: 0
      };
    }

    componentDidMount() {
        document.title = `你点击了${this.state.number}次`;
    }

    componentDidUpdate() {
        document.title = `你点击了${this.state.number}次`;
    }

    render() {
      return (
        <div>
          <p>{this.state.number}</p>
          <button onClick={() => this.setState({ number: this.state.number + 1 })}>
            +
          </button>
        </div>
      );
    }
  }
```

> 在这个 class 中，我们需要在两个生命周期函数中编写重复的代码,这是因为很多情况下，我们希望在组件加载和更新时执行同样的操作。我们希望它在每次渲染之后执行，但 React 的 class 组件没有提供这样的方法。即使我们提取出一个方法，我们还是要在两个地方调用它。useEffect会在第一次渲染之后和每次更新之后都会执行

### 7.2 通过effect实现

```js
import React,{Component,useState,useEffect} from 'react';
import ReactDOM from 'react-dom';
function Counter(){
    const [number,setNumber] = useState(0);
    // 相当于 componentDidMount 和 componentDidUpdate:
    useEffect(() => {
        // 使用浏览器的 API 更新页面标题
        document.title = `你点击了${number}次`;
    });
    return (
        <>
            <p>{number}</p>
            <button onClick={()=>setNumber(number+1)}>+</button>
        </>
    )
}
ReactDOM.render(<Counter />, document.getElementById('root'));
```

> 每次我们重新渲染，都会生成新的 effect，替换掉之前的。某种意义上讲，effect 更像是渲染结果的一部分 —— 每个 effect 属于一次特定的渲染。

### 7.3 跳过 Effect 进行性能优化

- 如果某些特定值在两次重渲染之间没有发生变化，你可以通知 React 跳过对 effect 的调用，只要传递数组作为 useEffect 的第二个可选参数即可
- 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行

```js
function Counter(){
  const [number,setNumber] = useState(0);
  // 相当于componentDidMount 和 componentDidUpdate
  useEffect(() => {
     console.log('开启一个新的定时器')
     const $timer = setInterval(()=>{
      setNumber(number=>number+1);
     },1000);
  },[]);
  return (
      <>
          <p>{number}</p>
      </>
  )
}
```

### 7.4 清除副作用

- 副作用函数还可以通过返回一个函数来指定如何清除副作用
- 为防止内存泄漏，清除函数会在组件卸载前执行。另外，如果组件多次渲染，则在执行下一个 effect 之前，上一个 effect 就已被清除
- React只会在浏览器绘制后运行effects。这使得你的应用更流畅因为大多数effects并不会阻塞屏幕的更新。Effect的清除同样被延迟了。上一次的effect会在重新渲染后被清除：

```js
import React, { useEffect, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';
function Counter() {
    const [number, setNumber] = useState(0);
    useEffect(() => {
        console.log('开启一个新的定时器')
        const $timer = setInterval(() => {
            setNumber(number => number + 1);
        }, 1000);
        return () => {
            console.log('销毁老的定时器');
            clearInterval($timer);
        }
    });
    return (
        <>
            <p>{number}</p>
        </>
    )
}
function App() {
    let [visible, setVisible] = useState(true);
    return (
        <div>
            {visible && <Counter />}
            <button onClick={() => setVisible(false)}>stop</button>
        </div>
    )
}
ReactDOM.render(<App />, document.getElementById('root'));
```

- useEffect的执行时机
- 同步才是理解effects的心智模型

```js
import React,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom';
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log('setInterval',count);
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('clearInterval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>{count}</h1>;
}
```

- 干掉对`count`的依赖

  ```js
  function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(count=>count + 1);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);
  
  return <h1>{count}</h1>;
  }
  ```

### 7.6 竞态

- 请求更早但返回更晚的情况会错误地覆盖状态值

```js
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
const API = {
  async fetchArticle(id){
    return new Promise((resolve)=>{
        setTimeout(()=>{
          resolve({id,title:`title_${id}`});
        },1000*(5-id));
    });
  }
}
function Article({ id }) {
  const [article, setArticle] = useState({});
  useEffect(() => {
    let didCancel = false;
    async function fetchData() {
      const article = await API.fetchArticle(id);
      if (!didCancel) {
        setArticle(article);
      }
    }
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [id]);
  return (
    <div>
      <p>{article.title}</p>
    </div>
  )
}
function App(){
  let [id,setId] = useState(1);
  return (
    <div>
      <p>id:{id}</p>
       <Article id={id}/>
       <button onClick={()=>setId(id+1)}>改变id</button>
    </div>
  )
}
function render() {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
}
render();
```

### 7.7 effect回调里读取最新的值

- 有时候你可能想在effect的回调函数里读取最新的值而不是捕获的值。最简单的实现方法是使用refs

index.js

```js
import React,{useEffect,useRef,useState} from 'react';
import ReactDOM from 'react-dom';
function Counter() {
  const [count, setCount] = useState(0);
  const latestCount = useRef(count);

  useEffect(() => {
    latestCount.current = count;
    setTimeout(() => {
      console.log(`You clicked ${latestCount.current} times`);
    }, 3000);
  });
  return (
    <div>
      <p>{count}</p>
      <button onClick={()=>setCount(count+1)}>+</button>
    </div>
  )
}
function render(){
  ReactDOM.render(
    <Counter/>,
    document.getElementById('root')
  );
}
render();
```

### 7.8 useEffect 实现

```diff
+let hookStates = [];
+let hookIndex = 0;
+function useState(initialState){
+  hookStates[hookIndex]=hookStates[hookIndex]||initialState;
+  let currentIndex = hookIndex;
+  function setState(newState){
+    hookStates[currentIndex]=newState;
+    render();
+  }
+  return [hookStates[hookIndex++],setState];
+} 

+function useEffect(callback,dependencies){
+  if(hookStates[hookIndex]){
+      let lastDeps = hookStates[hookIndex];
+      let same = dependencies.every((item,index)=>item === lastDeps[index]);
+      if(same){
+        hookIndex++;
+      }else{
+        hookStates[hookIndex++]=dependencies;
+        setTimeout(callback);
+      }
+  }else{
+     hookStates[hookIndex++]=dependencies;
+      setTimeout(callback);
+  }
+}
```

## 9. useRef

- useRef 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（initialValue）
- 返回的 ref 对象在组件的整个生命周期内保持不变

```js
const refContainer = useRef(initialValue);
```

### 9.1 使用useRef

```js
import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
function Parent() {
    let [number, setNumber] = useState(0);
    return (
        <>
            <Child />
            <button onClick={() => setNumber({ number: number + 1 })}>+</button>
        </>
    )
}
let input;
function Child() {
    const inputRef = useRef();
    console.log('input===inputRef', input === inputRef);
    input = inputRef;
    function getFocus() {
        inputRef.current.focus();
    }
    return (
        <>
            <input type="text" ref={inputRef} />
            <button onClick={getFocus}>获得焦点</button>
        </>
    )
}
ReactDOM.render(<Parent />, document.getElementById('root'));
```

### 9.2 forwardRef

- 将ref从父组件中转发到子组件中的dom元素上
- 子组件接受props和ref作为参数

```js
function Child(props,ref){
  return (
    <input type="text" ref={ref}/>
  )
}
Child = forwardRef(Child);
function Parent(){
  let [number,setNumber] = useState(0); 
  const inputRef = useRef();
  function getFocus(){
    inputRef.current.value = 'focus';
    inputRef.current.focus();
  }
  return (
      <>
        <Child ref={inputRef}/>
        <button onClick={()=>setNumber({number:number+1})}>+</button>
        <button onClick={getFocus}>获得焦点</button>
      </>
  )
}
```

### 9.3 useImperativeHandle

- `useImperativeHandle` 可以让你在使用 ref 时自定义暴露给父组件的实例值
- 在大多数情况下，应当避免使用 ref 这样的命令式代码。useImperativeHandle 应当与 forwardRef 一起使用

```js
function Child(props,ref){
  const inputRef = useRef();
  useImperativeHandle(ref,()=>(
    {
      focus(){
        inputRef.current.focus();
      }
    }
  ));
  return (
    <input type="text" ref={inputRef}/>
  )
}
Child = forwardRef(Child);
function Parent(){
  let [number,setNumber] = useState(0); 
  const inputRef = useRef();
  function getFocus(){
    console.log(inputRef.current);
    inputRef.current.value = 'focus';
    inputRef.current.focus();
  }
  return (
      <>
        <Child ref={inputRef}/>
        <button onClick={()=>setNumber({number:number+1})}>+</button>
        <button onClick={getFocus}>获得焦点</button>
      </>
  )
}
```

### 9.4 实现

```js
import React from 'react';
import ReactDOM from 'react-dom';

let hookStates = [];
let hookIndex = 0;
function useState(initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] || initialState;
  let currentIndex = hookIndex;
  function setState(newState) {
    hookStates[currentIndex] = newState;
    render();
  }
  return [hookStates[hookIndex++], setState];
}
function useRef(initialState) {
  hookStates[hookIndex] =  hookStates[hookIndex] || { current: initialState };
  return hookStates[hookIndex++];
}

let lastInput;
function App() {
  let [number, setNumber] = useState(0);
  const inputRef = useRef();
  console.log('input===inputRef', lastInput === inputRef);
  lastInput = inputRef;
  return (
    <>
      <input type="text" ref={inputRef} />
      <button onClick={()=>setNumber(number+1)}>{number}</button>
    </>
  )
}
function render() {
  hookIndex = 0;
  ReactDOM.render(<App />, document.getElementById('root'));
}
render();
```

## 10. useLayoutEffect

- 其函数签名与 `useEffect` 相同，但它会在所有的 `DOM` 变更之后同步调用 effect
- `useEffect`不会阻塞浏览器渲染，而 `useLayoutEffect` 会浏览器渲染
- `useEffect`会在浏览器渲染结束后执行,`useLayoutEffect` 则是在 `DOM` 更新完成后,浏览器绘制之前执行

### 10.1 事件循环

- 1. 从宏任务队列中取出一个宏任务执行
- 1. 检查微任务队列,执行并清空微任务队列,如果在微任务的执行中又加入了新的微任务,则会继续执行新的微任务
- 1. 进入更新渲染阶段,判断是否需要渲染,要根据屏幕刷新率、页面性能、页面是否在后台运行来共同决定,通常来说这个渲染间隔是固定的,一般为60帧/秒
- 1. 如果确定要更新会进入下面的步骤,否则本循环结束
  2. 1. 如果窗口大小发生了变化,执行监听的`resize`事件
  3. 1. 如果页面发生了滚动,执行`scroll`方法
  4. 1. 执行帧动画回调,也就是 `requestAnimationFrame` 的回调
  5. 1. 重新渲染用户界面
- 1. 判断是否宏任务和微任务队列为空则判断是否执行`requestIdleCallback`的回调函数

![img](http://img.zhufengpeixun.cn/useLayoutEffect.jpg)

### 10.2 使用

```js
import React, {useRef } from 'react';
import ReactDOM from 'react-dom';
let lastDependencies;
function useEffect(callback,dependencies){
    if(lastDependencies){
        let changed = !dependencies.every((item,index)=>item==lastDependencies[index]);
        if(changed){
            setTimeout(callback)
            lastDependencies=dependencies;
        }
    }else{
        setTimeout(callback)
        lastDependencies=dependencies;
    }
}

let lastLayoutDependencies;
function useLayoutEffect(callback,dependencies){
    if(lastLayoutDependencies){
        let changed = !dependencies.every((item,index)=>item==lastLayoutDependencies[index]);
        if(changed){
            queueMicrotask(callback);
            lastLayoutDependencies=dependencies;
        }
    }else{
        Promise.resolve().then(callback);
        lastLayoutDependencies=dependencies;
    }
}
const Animate = ()=>{
    const ref = useRef();
    useLayoutEffect(()=>{
        ref.current.style.WebkitTransform = `translate(500px)`;
        ref.current.style.transition  = `all 500ms`;
    });
    let style = {
        width:'100px',
        height:'100px',
        backgroundColor:'red'
    }
    return (
        <div>
            <div style={style} ref={ref}></div>
        </div>
    )
}
function render(){
    ReactDOM.render(<Animate/>,document.getElementById('root'));
}
render();
```

### 10.3 useEffect 实现

```diff
function useLayoutEffect(callback,dependencies){
  if(hookStates[hookIndex]){
      let lastDeps = hookStates[hookIndex];
      let same = dependencies.every((item,index)=>item === lastDeps[index]);
      if(same){
        hookIndex++;
      }else{
        hookStates[hookIndex++]=dependencies;
+       queueMicrotask(callback);
      }
  }else{
     hookStates[hookIndex++]=dependencies;
     queueMicrotask(callback);
  }
}
```

## 9. 自定义 Hook

- 有时候我们会想要在组件之间重用一些状态逻辑
- 自定义 Hook 可以让你在不增加组件的情况下达到同样的目的
- Hook 是一种复用状态逻辑的方式，它不复用 state 本身
- 事实上 Hook 的每次调用都有一个完全独立的 state
- 自定义 Hook 更像是一种约定，而不是一种功能。如果函数的名字以 use 开头，并且调用了其他的 Hook，则就称其为一个自定义 Hook

### 9.1.自定义计数器

```js
function useNumber(){
  const [number,setNumber] = useState(0);
  useEffect(() => {
     console.log('开启一个新的定时器')
     const $timer = setInterval(()=>{
      setNumber(number+1);
     },1000);
     return ()=>{
      console.log('销毁老的定时器')
         clearInterval($timer);
     }
  });
  return number;
}
function Counter1(){
  let number1 = useNumber();
  return (
      <>
          <p>{number1}</p>
      </>
  )
}
function Counter2(){
  let number = useNumber();
  return (
      <>
          <p>{number}</p>
      </>
  )
}
function App(){
  return <><Counter1/><Counter2/></>
}
```

### 9.2 ajax

```js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
function useRequest(url) {
    let limit = 5;
    let [offset, setOffset] = useState(0);
    let [data, setData] = useState([]);
    function loadMore() {
        setData(null);
        fetch(`${url}?offset=${offset}&limit=${limit}`)
            .then(response => response.json())
            .then(pageData => {
                setData([...data, ...pageData]);
                setOffset(offset + pageData.length);
            });
    }
    useEffect(loadMore, []);
    return [data, loadMore];
}

function App() {
    const [users, loadMore] = useRequest('http://localhost:8000/api/users');
    if (users === null) {
        return <div>正在加载中....</div>
    }
    return (
        <>
            <ul>
                {
                    users.map((item, index) => <li key={index}>{item.id}:{item.name}</li>)
                }
            </ul>
            <button onClick={loadMore}>加载更多</button>
        </>
    )
}
ReactDOM.render(<App />, document.getElementById('root'));
```

async+await

```js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
function useRequest(url) {
    let limit = 5;
    let [offset, setOffset] = useState(0);
    let [data, setData] = useState([]);
    async function loadMore() {
        setData(null);
        let pageData = await fetch(`${url}?offset=${offset}&limit=${limit}`)
            .then(response => response.json());
        setData([...data, ...pageData]);
        setOffset(offset + pageData.length);
    }
    useEffect(loadMore, []);
    return [data, loadMore];
}

function App() {
    const [users, loadMore] = useRequest('http://localhost:8000/api/users');
    if (users === null) {
        return <div>正在加载中....</div>
    }
    return (
        <>
            <ul>
                {
                    users.map((item, index) => <li key={index}>{item.id}:{item.name}</li>)
                }
            </ul>
            <button onClick={loadMore}>加载更多</button>
        </>
    )
}
ReactDOM.render(<App />, document.getElementById('root'));
let express = require('express');
let app = express();
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
});
app.get('/api/users', function (req, res) {
    let offset = parseInt(req.query.offset);
    let limit = parseInt(req.query.limit);
    let result = [];
    for (let i = offset; i < offset + limit; i++) {
        result.push({ id: i + 1, name: 'name' + (i + 1) });
    }
    res.json(result);
});
app.listen(8000);
```

### 9.3 动画

```js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function useMove(initialClassName) {
    const [className, setClassName] = useState(initialClassName);
    const [state, setState] = useState('');
    function start() {
        setState('bigger');
    }
    useEffect(() => {
        if (state === 'bigger') {
            setClassName(`${initialClassName} ${initialClassName}-bigger`);
        }
    }, [state]);
    return [className, start];
}

function App() {
    const [className, start] = useMove('circle');
    return (
        <div>
            <button onClick={start}>start</button>
            <div className={className}></div>
        </div>
    )
}
ReactDOM.render(<App />, document.getElementById('root'));
.circle {
    width : 50px;
    height : 50px;
    border-radius: 50%;
    background : red;
    transition: all .5s;
  }
.circle-bigger {
    width : 200px;
    height : 200px;
}

```

# react_hooks_source

## 1. React Hooks

- Hook可以让你在不编写 `class` 的情况下使用 `state` 以及其他的 React 特性

## 2. useState

- useState 就是一个 Hook
- 通过在函数组件里调用它来给组件添加一些内部 state,React 会在重复渲染时保留这个 state
- useState 会返回一对值：当前状态和一个让你更新它的函数，你可以在事件处理函数中或其他一些地方调用这个函数。它类似 class 组件的 this.setState，但是它不会把新的 state 和旧的 state 进行合并
- useState 唯一的参数就是初始 state
- 返回一个 state，以及更新 state 的函数
  - 在初始渲染期间，返回的状态 (state) 与传入的第一个参数 (initialState) 值相同
  - setState 函数用于更新 state。它接收一个新的 state 值并将组件的一次重新渲染加入队列

### 2.1 计数器

```js
import React from './react';
import ReactDOM from './react-dom';

function App(){
  const[number,setNumber]=React.useState(0);
  let handleClick = ()=> setNumber(number+1)
  return (
    <div>
      <p>{number}</p>
      <button onClick={handleClick}>+</button>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

### 2.2 src\react-dom.js

src\react-dom.js

```diff
+let hookStates = [];
+let hookIndex = 0;
+let scheduleUpdate;
+function render(vdom, container) {
+    mount(vdom,container);
+    scheduleUpdate = ()=>{
+      hookIndex = 0;
+      compareTwoVdom(container,vdom,vdom);
+    }
+}
+export function useState(initialState){
+    hookStates[hookIndex] = hookStates[hookIndex]||initialState;
+    let currentIndex = hookIndex; 
+    function setState(newState){
+      if(typeof newState === 'function') newState=newState(hookStates[currentIndex]);
+      hookStates[currentIndex]=newState;
+      scheduleUpdate();
+    }
+    return [hookStates[hookIndex++],setState];
+}
```

### 2.3 src\react.js

src\react.js

```diff
+import {useState} from './react-dom';

const React = {
    createElement,
    Component,
    PureComponent,
    createRef,
    createContext,
    cloneElement,
    memo,
+   useState
};
export default React;
```

## 3.useCallback+useMemo

- 把内联回调函数及依赖项数组作为参数传入 `useCallback`，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新
- 把创建函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算

### 3.1 src\index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';


let  Child = ({data,handleClick})=>{
  console.log('Child render');
  return (
     <button onClick={handleClick}>{data.number}</button>
  )
}
Child = React.memo(Child);

function App(){
  console.log('App render');
  const[name,setName]=React.useState('zhufeng');
  const[number,setNumber]=React.useState(0);
  let data = React.useMemo(()=>({number}),[number]);
  let handleClick = React.useCallback(()=> setNumber(number+1),[number]);
  return (
    <div>
      <input type="text" value={name} onChange={event=>setName(event.target.value)}/>
      <Child data={data} handleClick={handleClick}/>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

### 3.2 src\react-dom.js

src\react-dom.js

```diff
let hookStates = [];
let hookIndex = 0;
let scheduleUpdate;
function render(vdom,container){
   mount(vdom,container);
   scheduleUpdate = ()=>{
    hookIndex = 0;
    compareTwoVdom(container,vdom,vdom);
   }
}
export function useState(initialState){
    hookStates[hookIndex] = hookStates[hookIndex]||initialState;
    let currentIndex = hookIndex; 
    function setState(newState){
      if(typeof newState === 'function') newState=newState(hookStates[currentIndex]);
      hookStates[currentIndex]=newState;
      scheduleUpdate();
    }
    return [hookStates[hookIndex++],setState];
  }
+export  function useMemo(factory,deps){
+    if(hookStates[hookIndex]){
+      let [lastMemo,lastDeps] = hookStates[hookIndex];
+      let same = deps.every((item,index)=>item === lastDeps[index]);
+      if(same){
+        hookIndex++;
+        return lastMemo;
+      }else{
+        let newMemo = factory();
+        hookStates[hookIndex++]=[newMemo,deps];
+        return newMemo;
+      }
+    }else{
+      let newMemo = factory();
+      hookStates[hookIndex++]=[newMemo,deps];
+      return newMemo;
+    }
+}
+export function useCallback(callback,deps){
+    if(hookStates[hookIndex]){
+      let [lastCallback,lastDeps] = hookStates[hookIndex];
+      let same = deps.every((item,index)=>item === lastDeps[index]);
+      if(same){
+        hookIndex++;
+        return lastCallback;
+      }else{
+        hookStates[hookIndex++]=[callback,deps];
+        return callback;
+      }
+    }else{
+      hookStates[hookIndex++]=[callback,deps];
+      return callback;
+    }
+}
const ReactDOM =  {
    render
};
export default ReactDOM;
```

### 3.3 src\react.js

src\react.js

```diff
import {wrapToVdom} from './utils';
import {Component,PureComponent} from './Component';
+import {useState,useMemo,useCallback} from './react-dom';
const React = {
    createElement,
    Component,
    PureComponent,
    createRef,
    createContext,
    cloneElement,
    memo,
+   useMemo,
+   useCallback,
    useState
};
export default React;
```

## 4. useReducer

- useState 的替代方案。它接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法
- 在某些场景下，useReducer 会比 useState 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等

### 4.1 src\index.js

src\index.js

```js
import React from './react';
import ReactDOM from './react-dom';
function reducer(state={number:0}, action) {
  switch (action.type) {
    case 'ADD':
      return {number: state.number + 1};
    case 'MINUS':
      return {number: state.number - 1};
    default:
      return state;
  }
}

function Counter(){
    const [state, dispatch] = React.useReducer(reducer,{number:0});
    return (
        <div>
          Count: {state.number}
          <button onClick={() => dispatch({type: 'ADD'})}>+</button>
          <button onClick={() => dispatch({type: 'MINUS'})}>-</button>
        </div>
    )
}
ReactDOM.render(
  <Counter/>,
  document.getElementById('root')
);
```

### 4.2 src\react-dom.js

src\react-dom.js

```diff
+export function useReducer(reducer, initialState) {
+    hookStates[hookIndex]=hookStates[hookIndex]||initialState;
+    let currentIndex = hookIndex;
+    function dispatch(action) {
+      hookStates[currentIndex]=reducer?reducer(hookStates[currentIndex],action):action;
+      scheduleUpdate();
+    }
+    return [hookStates[hookIndex++], dispatch];
+}
const ReactDOM =  {
    render
};
export default ReactDOM;
```

### 4.3 src\react.js

src\react.js

```diff
+import {useState,useMemo,useCallback,useReducer} from './react-dom';
const React = {
    createElement,
    Component,
    PureComponent,
    createRef,
    createContext,
    cloneElement,
    memo,
    useMemo,
    useCallback,
    useState,
+   useReducer
};
export default React;
```

## 5. useContext

- 接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值
- 当前的 context 值由上层组件中距离当前组件最近的 <MyContext.Provider> 的 value prop 决定
- 当组件上层最近的 <MyContext.Provider> 更新时，该 Hook 会触发重渲染，并使用最新传递给 MyContext provider 的 context value 值
- useContext(MyContext) 相当于 class 组件中的 `static contextType = MyContext` 或者 `<MyContext.Consumer>`
- useContext(MyContext) 只是让你能够读取 context 的值以及订阅 context 的变化。你仍然需要在上层组件树中使用 <MyContext.Provider> 来为下层组件提供 context

### 5.1 src\index.js

src\index.js

```js
import React from './react';
import ReactDOM from './react-dom';

const CounterContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return {number: state.number + 1};
    case 'minus':
      return {number: state.number - 1};
    default:
      return state;
  }
}
function Counter(){
  let {state,dispatch} = React.useContext(CounterContext);
  return (
      <div>
        <p>{state.number}</p>
        <button onClick={() => dispatch({type: 'add'})}>+</button>
        <button onClick={() => dispatch({type: 'minus'})}>-</button>
      </div>
  )
}
function App(){
    const [state, dispatch] = React.useReducer(reducer, {number:0});
    return (
        <CounterContext.Provider value={{state,dispatch}}>
          <Counter/>
        </CounterContext.Provider>
    )
}

ReactDOM.render(<App/>,document.getElementById('root'));
```

### 5.2 src\react.js

src\react.js

```diff
import {wrapToVdom} from './utils';
import {Component,PureComponent} from './Component';
import {useState,useMemo,useCallback,useReducer} from './react-dom';
function createElement(type, config, children) {
    let ref;
    if (config) {
        delete config._owner;
        delete config._store;
        delete config.__self;
        delete config.__source;
        ref=config.ref;
        delete config.ref;
    }
    let props = { ...config };
    if (arguments.length > 3) {
        props.children = Array.prototype.slice.call(arguments,2).map(wrapToVdom);
    }else{
        props.children = wrapToVdom(children);
    }
    return {
        type,
        ref,
        props
    };
}
function createRef() {
    return { current: null };
}
function createContext(initialValue={}){
    let context = {Provider,Consumer};
    function Provider(props){
      context._currentValue=context._currentValue||initialValue;
      Object.assign(context._currentValue,props.value);
      return props.children;
    }
    function Consumer(props){
      return props.children(context._currentValue);
    }
    return context;
}
function cloneElement(element,newProps,...newChildren){
  let oldChildren = element.props&&element.props.children;
  let children = [...(Array.isArray(oldChildren)?oldChildren:[oldChildren]),...newChildren]
  .filter(item=>item!==undefined)
  .map(wrapToVdom);
  if(children.length===1) children=children[0];
  let props = {...element.props,...newProps,children};
  return {...element,props};
}
function memo(OldComponent){
    return class extends React.PureComponent{
      render(){
        return <OldComponent {...this.props}/>
      }
    }
}
+function useContext(context){
+  return context._currentValue;
+}
const React = {
    createElement,
    Component,
    PureComponent,
    createRef,
    createContext,
    cloneElement,
    memo,
    useMemo,
    useCallback,
    useState,
    useReducer,
+   useContext
};
export default React;
```

## 6. useEffect

- 在函数组件主体内（这里指在 React 渲染阶段）改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性
- 使用 useEffect 完成副作用操作。赋值给 useEffect 的函数会在组件渲染到屏幕之后执行。你可以把 effect 看作从 React 的纯函数式世界通往命令式世界的逃生通道
- useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 具有相同的用途，只不过被合并成了一个 API
- 该 Hook 接收一个包含命令式、且可能有副作用代码的函数

### 6.1 src\index.js

src\index.js

```js
import React from './react';
import ReactDOM from './react-dom';
function Counter() {
    const [number, setNumber] = React.useState(0);
    React.useEffect(() => {
        console.log('开启一个新的定时器')
        const $timer = setInterval(() => {
            setNumber(number => number + 1);
        }, 1000);
        return () => {
            console.log('销毁老的定时器');
            clearInterval($timer);
        }
    });
    return (
        <p>{number}</p>
    )
}
ReactDOM.render(<Counter />, document.getElementById('root'));
```

### 6.2 src\react-dom.js

src\react-dom.js

```diff
+export function useEffect(callback,dependencies){
+  if(hookStates[hookIndex]){
+      let [lastCallback,lastDeps] = hookStates[hookIndex];
+      let same = dependencies&&dependencies.every((item,index)=>item === lastDeps[index]);
+      if(same){
+        hookIndex++;
+      }else{
+        lastCallback&&lastCallback();
+        setTimeout(()=>{
+            lastCallback = callback();
+            hookStates[hookIndex++]=[lastCallback,dependencies];
+        });
+      }
+  }else{
+    setTimeout(()=>{
+        hookStates[hookIndex++]=[callback(),dependencies];
+    });
+  }
+}
const ReactDOM =  {
    render
};
export default ReactDOM;
```

### 6.3 src\react.js

src\react.js

```diff
import {wrapToVdom} from './utils';
import {Component,PureComponent} from './Component';
+import {useState,useMemo,useCallback,useReducer,useEffect} from './react-dom';
const React = {
    createElement,
    Component,
    PureComponent,
    createRef,
    createContext,
    cloneElement,
    memo,
    useMemo,
    useCallback,
    useState,
    useReducer,
    useContext,
+   useEffect
};
export default React;
```

## 7. useLayoutEffect+useRef

- 其函数签名与 `useEffect` 相同，但它会在所有的 `DOM` 变更之后同步调用 effect
- `useEffect`不会阻塞浏览器渲染，而 `useLayoutEffect` 会浏览器渲染
- `useEffect`会在浏览器渲染结束后执行,`useLayoutEffect` 则是在 `DOM` 更新完成后,浏览器绘制之前执行

### 7.1 事件循环

![img](http://img.zhufengpeixun.cn/useLayoutEffect.jpg)

### 7.2 src\index.js

src\index.js

```js
import React from './react';
import ReactDOM from './react-dom';

const Animate = ()=>{
    const ref = React.useRef();
    React.useLayoutEffect(()=>{
        ref.current.style.WebkitTransform = `translate(500px)`;
        ref.current.style.transition  = `all 500ms`;
    });
    let style = {
        width:'100px',
        height:'100px',
        backgroundColor:'red'
    }
    return (
        <div style={style} ref={ref}>我是内容</div>
    )
}
ReactDOM.render(<Animate/>,document.getElementById('root'));
```

### 7.3 src\react-dom.js

src\react-dom.js

```diff
+export function useLayoutEffect(callback,dependencies){
+    if(hookStates[hookIndex]){
+        let [lastCallback,lastDeps] = hookStates[hookIndex];
+        let same = dependencies&&dependencies.every((item,index)=>item === lastDeps[index]);
+        if(same){
+          hookIndex++;
+        }else{
+          lastCallback&&lastCallback();
+          queueMicrotask(()=>{
+              lastCallback = callback();
+              hookStates[hookIndex++]=[lastCallback,dependencies];
+          });
+        }
+    }else{
+        queueMicrotask(()=>{
+          hookStates[hookIndex++]=[callback(),dependencies];
+      });
+    }
+}
+export function useRef(initialState) {
+    hookStates[hookIndex] =  hookStates[hookIndex] || { current: initialState };
+    return hookStates[hookIndex++];
+}
```

### 7.4 src\react.js

src\react.js

```diff
import {wrapToVdom} from './utils';
import {Component,PureComponent} from './Component';
+import {useState,useMemo,useCallback,useReducer,useEffect,useRef,useLayoutEffect} from './react-dom';
const React = {
    createElement,
    Component,
    PureComponent,
    createRef,
    createContext,
    cloneElement,
    memo,
    useMemo,
    useCallback,
    useState,
    useReducer,
    useContext,
    useEffect,
    useRef,
+   useLayoutEffect
};
export default React;
```

## 8. forwardRef+useImperativeHandle

- forwardRef将ref从父组件中转发到子组件中的dom元素上,子组件接受props和ref作为参数
- `useImperativeHandle` 可以让你在使用 ref 时自定义暴露给父组件的实例值

### 8.1 src\index.js

```js
import React from './react';
import ReactDOM from './react-dom';

function Child(props, ref) {
    const inputRef = React.useRef();
    React.useImperativeHandle(ref, () => (
        {
            focus() {
                inputRef.current.focus();
            }
        }
    ));
    return (
        <input type="text" ref={inputRef} />
    )
}
const ForwardChild = React.forwardRef(Child);
function Parent() {
    let [number, setNumber] = React.useState(0);
    const inputRef = React.useRef();
    function getFocus() {
        console.log(inputRef.current);
        inputRef.current.value = 'focus';
        inputRef.current.focus();
    }
    return (
        <div>
            <ForwardChild ref={inputRef} />
            <button onClick={getFocus}>获得焦点</button>
            <p>{number}</p>
            <button onClick={() => {
                debugger
                setNumber( number + 1)
            }}>+</button>
        </div>
    )
}
ReactDOM.render(<Parent/>,document.getElementById('root'));
```

### 8.2 src\react-dom.js

src\react-dom.js

```diff
function mountClassComponent(vdom){
+    const {type, props,ref} = vdom;
    const classInstance = new type(props);
+   if(ref){
+       ref.current = classInstance;
+       classInstance.ref = ref;
+   }
    vdom.classInstance=classInstance;
    if(type.contextType){
        classInstance.context = type.contextType.Provider._value;
    }
    if(classInstance.componentWillMount)
       classInstance.componentWillMount();
    classInstance.state = getDerivedStateFromProps(classInstance,classInstance.props,classInstance.state)   
    const renderVdom = classInstance.render();
    classInstance.oldRenderVdom=vdom.oldRenderVdom=renderVdom;
    const dom = createDOM(renderVdom);
    if(classInstance.componentDidMount)
      dom.componentDidMount=classInstance.componentDidMount.bind(classInstance);
    return dom;
}

+export function useImperativeHandle(ref,handler){
+    ref.current = handler();
+}
const ReactDOM =  {
    render
};
export default ReactDOM;
```

### 8.3 src\react.js

src\react.js

```diff
import {wrapToVdom} from './utils';
import {Component,PureComponent} from './Component';
+import {useState,useMemo,useCallback,useReducer,useEffect,useRef,useLayoutEffect,useImperativeHandle} from './react-dom';

+function forwardRef(FunctionComponent){
+  return class extends Component{
+    render(){
+      return FunctionComponent(this.props,this.ref);
+    }
+  }
+}
const React = {
    createElement,
    Component,
    PureComponent,
    createRef,
    createContext,
    cloneElement,
    memo,
    useMemo,
    useCallback,
    useState,
    useReducer,
    useContext,
    useEffect,
    useRef,
    useLayoutEffect,
+   forwardRef,
+   useImperativeHandle
};
export default React;
```



