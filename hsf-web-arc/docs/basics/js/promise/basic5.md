---
title: Promise.any()
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

`Promise.any()` 接收一个`[Promise](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise>)`可迭代对象，只要其中的一个 `promise` 成功，就返回那个已经成功的 `promise` 。如果可迭代对象中没有一个 `promise` 成功（即所有的 `promises` 都失败/拒绝），就返回一个失败的 `promise` 和`[AggregateError](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AggregateError>)`类型的实例，它是 `[Error](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error>)` 的一个子类，用于把单一的错误集合在一起。本质上，这个方法和`[Promise.all()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all>)`是相反的。

**注意！** `Promise.any()` 方法依然是实验性的，尚未被所有的浏览器完全支持。它当前处于 [TC39 第四阶段草案（Stage 4）](https://github.com/tc39/proposal-promise-any)

## 语法

```
Promise.any(iterable);
```

### 参数

**`iterable`**一个[可迭代](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol)的对象, 例如 [Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)。

### 返回值

- 如果传入的参数是一个空的可迭代对象，则返回一个 **已失败（already rejected）** 状态的 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)。

- 如果传入的参数不包含任何 `promise`一个 **异步完成** （**asynchronously resolved**）的 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)。

  *，则返回*

- 其他情况下都会返回一个**处理中（pending）** 的 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)。 只要传入的迭代对象中的任何一个 `promise` 变成成功（resolve）状态，或者其中的所有的 `promises` 都失败，那么返回的 `promise` 就会 **异步地**（当调用栈为空时） ****变成成功/失败（resolved/reject）状态。

## 说明

这个方法用于返回第一个成功的 `promise` 。只要有一个 `promise` 成功此方法就会终止，它不会等待其他的 `promise` 全部完成。

不像 [Promise.all()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 会返回一组完成值那样（resolved values），我们只能得到一个成功值（假设至少有一个 `promise` 完成）。当我们只需要一个 `promise` 成功，而不关心是哪一个成功时此方法很有用的。

同时, 也不像 [Promise.race()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) 总是返回第一个结果值（resolved/reject）那样，这个方法返回的是第一个 *成功的* 值。这个方法将会忽略掉所有被拒绝的 `promise`，直到第一个 `promise` 成功。

### 成功（Fulfillment）：

当任何一个被传入的 `promise` 成功的时候, 无论其他的 `promises` 成功还是失败，此函数会将那个成功的 `promise` 作为返回值 。

- 如果传入的参数是一个空的可迭代对象, 这个方法将会同步返回一个已经完成的 `promise`。
- 如果传入的任何一个 `promise` 已成功, 或者传入的参数不包括任何 `promise`, 那么 `Promise.any` 返回一个异步成功的 `promise`。

### 失败/拒绝（Rejection）：

如果所有传入的 `promises` 都失败, `Promise.any` 将返回异步失败，和一个 [AggregateError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError) 对象，它继承自 [Error](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error)，有一个 `error` 属性，属性值是由所有失败值填充的数组。

## 示例

### First to fulfil

即使第一个返回的 promise 是失败的，`Promise.any()` 依然使用第一个成功状态的 promise 来返回。这与使用首个（无论 rejected 还是 fullfiled）promise 来返回的 `[Promise.race()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race>)` 相反。

```
const pErr = new Promise((resolve, reject) => {
  reject("总是失败");
});

const pSlow = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, "最终完成");
});

const pFast = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "很快完成");
});

Promise.any([pErr, pSlow, pFast]).then((value) => {
  console.log(value);
  // pFast fulfils first
})
// 期望输出: "很快完成"
```

### Rejections with AggregateError

如果没有 fulfilled (成功的) promise，`Promise.any()` 返回 `[AggregateError](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AggregateError>)` 错误。

```
const pErr = new Promise((resolve, reject) => {
  reject('总是失败');
});

Promise.any([pErr]).catch((err) => {
  console.log(err);
})
// 期望输出: "AggregateError: No Promise in Promise.any was resolved"
```

### 显示第一张已加载的图片

在这个例子，我们有一个获取图片并返回 blob 的函数，我们使用 `Promise.any()` 来获取一些图片并显示第一张有效的图片（即最先 resolved 的那个 promise）。

```
function fetchAndDecode(url) {
  return fetch(url).then(response => {
    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      return response.blob();
    }
  })
}

let coffee = fetchAndDecode('coffee.jpg');
let tea = fetchAndDecode('tea.jpg');

Promise.any([coffee, tea]).then(value => {
  let objectURL = URL.createObjectURL(value);
  let image = document.createElement('img');
  image.src = objectURL;
  document.body.appendChild(image);
})
.catch(e => {
  console.log(e.message);
});
//  any 会忽略掉所有的失败，只返回第一个成功的promise
// const pErr = new Promise((resolve, reject) => {
//   reject("总是失败");
// });

// const pSlow = new Promise((resolve, reject) => {
//   setTimeout(resolve, 500, "最终完成");
// });

// const pFast = new Promise((resolve, reject) => {
//   setTimeout(resolve, 100, "很快完成");
// });

// Promise.any([pErr, pSlow, pFast]).then((value) => {
//   console.log(value);
//   // pFast fulfils first
// })
// 接收一个Promise对象的集合，当其中的一个 promise 成功，就返回那个成功的promise的值。
console.log('promise', Promise);
```



