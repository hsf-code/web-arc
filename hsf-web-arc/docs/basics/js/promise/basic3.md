---
title: Promise.all()
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

Promise.all() 方法接收一个promise的idterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入，并且只返回一个Promise实例， 那个输入的所有promise的resolve回调的结果是一个数组。这个Promise的resolve回调执行是在所有输入的promise的resolve回调都结束，或者输入的iterable里没有promise了的时候。它的reject回调执行是，只要任何一个输入的promise的reject回调执行或者输入不合法的promise就会立即抛出错误，并且reject的是第一个抛出的错误信息。

## 语法

```
Promise.all(iterable);
```

### 参数

**iterable**一个[可迭代](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol)对象，如 `[Array](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array>)` 或 `[String](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String>)`。

### 返回值

- 如果传入的参数是一个空的可迭代对象，则返回一个**已完成（already resolved）**状态的 `[Promise](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise>)`。
- 如果传入的参数不包含任何 `promise`，则返回一个**异步完成（asynchronously resolved）** `[Promise](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise>)`。注意：Google Chrome 58 在这种情况下返回一个**已完成（already resolved）**状态的 `[Promise](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise>)`。
- 其它情况下返回一个**处理中（pending）\**的`[Promise](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise>)`。这个返回的 `promise` 之后会在所有的 `promise` 都完成或有一个 `promise` 失败时\**异步**地变为完成或失败。 见下方关于“Promise.all 的异步或同步”示例。返回值将会按照参数内的 `promise` 顺序排列，而不是由调用 `promise` 的完成顺序决定。

## 说明

此方法在集合多个 `promise` 的返回结果时很有用。

完成（Fulfillment）：如果传入的可迭代对象为空，`Promise.all` 会同步地返回一个已完成（resolved）状态的`promise`。如果所有传入的 `promise` 都变为完成状态，或者传入的可迭代对象内没有 `promise`，`Promise.all` 返回的 `promise` 异步地变为完成。在任何情况下，`Promise.all` 返回的 `promise` 的完成状态的结果都是一个数组，它包含所有的传入迭代参数对象的值（也包括非 `promise` 值）。

失败/拒绝（Rejection）：如果传入的 `promise` 中有一个失败（rejected），`Promise.all` 异步地将失败的那个结果给失败状态的回调函数，而不管其它 `promise` 是否完成。

## 示例

### `Promise.all` 的使用

`Promise.all` 等待所有都完成（或第一个失败）。

```
var p1 = Promise.resolve(3);
var p2 = 1337;
var p3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
}); 

Promise.all([p1, p2, p3]).then(values => { 
  console.log(values); // [3, 1337, "foo"] 
});
```

如果参数中包含非 `promise` 值，这些值将被忽略，但仍然会被放在返回数组中（如果 `promise` 完成的话）：

```
// this will be counted as if the iterable passed is empty, so it gets fulfilled
var p = Promise.all([1,2,3]);
// this will be counted as if the iterable passed contains only the resolved promise with value "444", so it gets fulfilled
var p2 = Promise.all([1,2,3, Promise.resolve(444)]);
// this will be counted as if the iterable passed contains only the rejected promise with value "555", so it gets rejected
var p3 = Promise.all([1,2,3, Promise.reject(555)]);

// using setTimeout we can execute code after the stack is empty
setTimeout(function(){
    console.log(p);
    console.log(p2);
    console.log(p3);
});

// logs
// Promise { <state>: "fulfilled", <value>: Array[3] }
// Promise { <state>: "fulfilled", <value>: Array[4] }
// Promise { <state>: "rejected", <reason>: 555 }
```

### `Promise.all` 的异步和同步

下面的例子中演示了 `Promise.all` 的异步性（如果传入的可迭代对象是空的，就是同步）：

```
// we are passing as argument an array of promises that are already resolved,
// to trigger Promise.all as soon as possible
var resolvedPromisesArray = [Promise.resolve(33), Promise.resolve(44)];

var p = Promise.all(resolvedPromisesArray);
// immediately logging the value of p
console.log(p);

// using setTimeout we can execute code after the stack is empty
setTimeout(function(){
    console.log('the stack is now empty');
    console.log(p);
});

// logs, in order:
// Promise { <state>: "pending" } 
// the stack is now empty
// Promise { <state>: "fulfilled", <value>: Array[2] }
```

如果 `Promise.all` 失败，也是一样的：

```
var mixedPromisesArray = [Promise.resolve(33), Promise.reject(44)];
var p = Promise.all(mixedPromisesArray);
console.log(p);
setTimeout(function(){
    console.log('the stack is now empty');
    console.log(p);
});

// logs
// Promise { <state>: "pending" } 
// the stack is now empty
// Promise { <state>: "rejected", <reason>: 44 }
```

但是，`Promise.all` **当且仅当**传入的可迭代对象为空时为同步：

```
var p = Promise.all([]); // will be immediately resolved
var p2 = Promise.all([1337, "hi"]); // non-promise values will be ignored, but the evaluation will be done asynchronously
console.log(p);
console.log(p2)
setTimeout(function(){
    console.log('the stack is now empty');
    console.log(p2);
});

// logs
// Promise { <state>: "fulfilled", <value>: Array[0] }
// Promise { <state>: "pending" }
// the stack is now empty
// Promise { <state>: "fulfilled", <value>: Array[2] }
```

### `Promise.all` 的快速返回失败行为

`Promise.all` 在任意一个传入的 `promise` 失败时返回失败。例如，如果你传入的 `promise`中，有四个 `promise` 在一定的时间之后调用成功函数，有一个立即调用失败函数，那么 `Promise.all` 将立即变为失败。

```
var p1 = new Promise((resolve, reject) => { 
  setTimeout(resolve, 1000, 'one'); 
}); 
var p2 = new Promise((resolve, reject) => { 
  setTimeout(resolve, 2000, 'two'); 
});
var p3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 3000, 'three');
});
var p4 = new Promise((resolve, reject) => {
  setTimeout(resolve, 4000, 'four');
});
var p5 = new Promise((resolve, reject) => {
  reject('reject');
});

Promise.all([p1, p2, p3, p4, p5]).then(values => { 
  console.log(values);
}, reason => {
  console.log(reason)
});

//From console:
//"reject"

//You can also use .catch
Promise.all([p1, p2, p3, p4, p5]).then(values => { 
  console.log(values);
}).catch(reason => { 
  console.log(reason)
});

//From console: 
//"reject"
// //  executor执行器，在promise实例创建的时候，就会执行，不存在异步
// var promise = new Promise(function(resolved, rejected) {
//   console.log('昵称的');
//   // if (t === 1) {
//   //   resolved('数据请求成功！');
//   // } else {
//   //   rejected('数据请求失败！');
//   // }
//   throw '11111';
// });

// var t = 2;

// //  对于异步的处理的时候是在实例产生的时候，执行器的pending状态，变成了
// /**
//  * fulfilled 或者是 rejected的状态的时候，调用then是一个异步的操作
//  * */
// promise.then(function(res) {
//   console.log('333', res);
// }, function(err) {
//   console.log('444', err);
// }).catch(function(err) {
//   console.log('666', err);
// });

// // console.log('其余的');

// all
// 当我们在处理任务是需要并发执行的时候使用all
// var p1 = new Promise(function executor(resolve, reject) {
//   resolve(1)
// });
// var p2 = new Promise(function executor(resolve, reject) {
//   setTimeout(() => {
//     resolve(2)
//   }, 1000);
// });
// var p3 = new Promise(function executor(resolve, reject) {
//   // resolve(3)
//   reject(3);
// });

// Promise.all([p1, p2, p3]).then(
//   function fullfilled(res) {
//     console.log('success', res);
//   }, function rejected(err) {
//     console.log('error', err);
//   }
// )
// Promise.all([]).then(
//   function fullfilled(res) {
//     console.log('success1', res);
//   }, function rejected(err) {
//     console.log('error1', err);
//   }
// )
// console.log('测试同步');

// var p1 = Promise.resolve(3);
// var p2 = 1337;
// var p3 = new Promise((resolve, reject) => {
//   setTimeout(resolve, 100, 'foo');
// });

// Promise.all([p1, p2, p3]).then(values => {
//   console.log(values); // [3, 1337, "foo"] 
// });
/**
 *  参数是一个可迭代的对象的形式，返回的结果会按照你传入的并发的执行器的顺序，不是那个
 *  先返回数据，就会在结果的前面，也就是说结果的顺序，也是按照传入参数的顺序的结果
 *  但是如果返回的结果出现reject的情况下，就会立即抛出错误，并且reject的是第一个抛出的错误信息。
 *  但是不会返回其他的迭代对象的信息
 * */

// var p = Promise.all([1, 2, 3]);
// var p2 = Promise.all([1, 2, 3, Promise.resolve(444)]);
// var p3 = Promise.all([1, 2, 3, Promise.reject(555)]);
// setTimeout(function() {
//   console.log(p);
//   console.log(p2);
//   console.log(p3);
// });
// var resolvedPromisesArray = [Promise.resolve(33), Promise.resolve(44)];

// var p = Promise.all(resolvedPromisesArray);
// // immediately logging the value of p
// console.log(p);

// using setTimeout we can execute code after the stack is empty
// setTimeout(function() {
//   console.log(p);
//   console.log('the stack is now empty');
// });

// var mixedPromisesArray = [Promise.resolve(33), Promise.reject(44)];
// var p = Promise.all(mixedPromisesArray);
// console.log(p);
// setTimeout(function() {
//   console.log('the stack is now empty');
//   console.log(p);
// });

var p = Promise.all([]); // will be immediately resolved
var p2 = Promise.all([1337, "hi"]); // non-promise values will be ignored, but the evaluation will be done asynchronously
console.log(p);
console.log(p2)
setTimeout(function() {
  console.log('the stack is now empty');
  console.log(p2);
});
```

