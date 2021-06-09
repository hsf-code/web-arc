---
title: 模块化
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---
# 模块化

在有 Babel 的情况下，我们可以直接使用 ES6 的模块化

```
// file a.jsexport function a() {}export function b() {}// file b.jsexport default function() {}import {a, b} from './a.js'import XXX from './b.js'
```

## CommonJS

`CommonJs` 是 Node 独有的规范，浏览器中使用就需要用到 `Browserify` 解析了。

```
// a.jsmodule.exports = {    a: 1}// orexports.a = 1// b.jsvar module = require('./a.js')module.a // -> log 1
```

在上述代码中，`module.exports` 和 `exports` 很容易混淆，让我们来看看大致内部实现

```
var module = require('./a.js')module.a// 这里其实就是包装了一层立即执行函数，这样就不会污染全局变量了，// 重要的是 module 这里，module 是 Node 独有的一个变量module.exports = {    a: 1}// 基本实现var module = {  exports: {} // exports 就是个空对象}// 这个是为什么 exports 和 module.exports 用法相似的原因var exports = module.exportsvar load = function (module) {    // 导出的东西    var a = 1    module.exports = a    return module.exports};
```

再来说说 `module.exports` 和 `exports`，用法其实是相似的，但是不能对 `exports` 直接赋值，不会有任何效果。

对于 `CommonJS` 和 ES6 中的模块化的两者区别是：

- 前者支持动态导入，也就是 `require(${path}/xx.js)`，后者目前不支持，但是已有提案
- 前者是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
- 前者在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是后者采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化
- 后者会编译成 `require/exports` 来执行的

## AMD

AMD 是由 `RequireJS` 提出的

```
 复制代码// AMDdefine(['./a', './b'], function(a, b) {    a.do()    b.do()})define(function(require, exports, module) {       var a = require('./a')      a.doSomething()       var b = require('./b')    b.doSomething()})
```

当下模块化主要就是 CommonJS 和 ES6 的 ESM 了，其它什么的 AMD、UMD 了解下就行了。

ESM 我想应该没啥好说的了，主要我们来聊聊 CommonJS 以及 ESM 和 CommonJS 的区别。



### CommonJS

CommonJs 是 Node 独有的规范，当然 Webpack 也自己实现了这套东西，让我们能在浏览器里跑起来这个规范。

```js
1// a.js
2module.exports = {
3    a: 1
4}
5// or
6exports.a = 1
7
8// b.js
9var module = require('./a.js')
10module.a // -> log 1
```

在上述代码中，`module.exports` 和 `exports` 很容易混淆，让我们来看看大致内部实现

```js
1// 基本实现
2var module = {
3  exports: {} // exports 就是个空对象
4}
5// 这个是为什么 exports 和 module.exports 用法相似的原因
6var exports = module.exports
7var load = function (module) {
8    // 导出的东西
9    var a = 1
10    module.exports = a
11    return module.exports
12};
```

根据上面的大致实现，我们也能看出为什么对 `exports` 直接赋值不会有任何效果。

对于 CommonJS 和 ESM 的两者区别是：

- 前者支持动态导入，也就是 `require(${path}/xx.js)`，后者使用 `import()`
- 前者是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
- 前者在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是后者采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化