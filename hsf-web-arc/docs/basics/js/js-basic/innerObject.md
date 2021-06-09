---
title: 内置对象
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

#  Meta_programming

从ECMAScript 2015 开始，JavaScript 获得了 `[Proxy](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy>)` 和 `[Reflect](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect>)` 对象的支持，允许你拦截并定义基本语言操作的自定义行为（例如，属性查找，赋值，枚举，函数调用等）。借助这两个对象，你可以在 JavaScript 元级别进行编程。

## 代理

在 ECMAScript 6 中引入的 `[Proxy](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy>)` 对象可以拦截某些操作并实现自定义行为。例如获取一个对象上的属性：

```
let handler = {
  get: function(target, name){
    return name in target ? target[name] : 42;
}};

let p = new Proxy({}, handler);
p.a = 1;

console.log(p.a, p.b); // 1, 42
```

`Proxy` 对象定义了一个目标（这里是一个空对象）和一个实现了 `get` 陷阱的 handler 对象。这里，代理的对象在获取未定义的属性时不会返回 `undefined`，而是返回 42。

更多例子参见 `[Proxy](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy>)` 页面 。

### 术语

在讨论代理的功能时会用到以下术语。

**`[handler](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler>)`**包含陷阱的占位符对象。**traps**提供属性访问的方法。这类似于操作系统中陷阱的概念。**target**代理虚拟化的对象。它通常用作代理的存储后端。根据目标验证关于对象不可扩展性或不可配置属性的不变量（保持不变的语义）。**invariants**实现自定义操作时保持不变的语义称为不变量。如果你违反处理程序的不变量，则会抛出一个 `[TypeError](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError>)`。

## 句柄和陷阱

以下表格中总结了 `Proxy` 对象可用的陷阱。详细的解释和例子请看[参考页](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler)。

[Untitled](https://www.notion.so/5cf3e96366674630b936ab3220a93de0)

## 撤销 `Proxy`

`[Proxy.revocable()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/revocable>)` 方法被用来创建可撤销的 `Proxy` 对象。这意味着 proxy 可以通过 `revoke` 函数来撤销，并且关闭代理。此后，代理上的任意的操作都会导致`[TypeError](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError>)`。

```
var revocable = Proxy.revocable({}, {
  get: function(target, name) {
    return "[[" + name + "]]";
  }
});
var proxy = revocable.proxy;
console.log(proxy.foo); // "[[foo]]"

revocable.revoke();

console.log(proxy.foo); // TypeError is thrown
proxy.foo = 1           // TypeError again
delete proxy.foo;       // still TypeError
typeof proxy            // "object", typeof doesn't trigger any trap
```

## 反射

`[Reflect](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect>)` 是一个内置对象，它提供了可拦截 JavaScript 操作的方法。该方法和`[代理句柄](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler>)`类似，但 `Reflect` 方法并不是一个函数对象。

`Reflect` 有助于将默认操作从处理程序转发到目标。

以 `[Reflect.has()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/has>)` 为例，你可以将 `[in` 运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in)作为函数：

```
Reflect.has(Object, "assign"); // true
```

### 更好的 `apply` 函数

在 ES5 中，我们通常使用 `[Function.prototype.apply()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply>)` 方法调用一个具有给定 `this` 值和 `arguments` 数组（或[类数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#Working_with_array-like_objects)）的函数。

```
Function.prototype.apply.call(Math.floor, undefined, [1.75]);
```

使用 `[Reflect.apply](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/apply>)`，这变得不那么冗长和容易理解：

```
Reflect.apply(Math.floor, undefined, [1.75]); 
// 1;

Reflect.apply(String.fromCharCode, undefined, [104, 101, 108, 108, 111]);
// "hello"

Reflect.apply(RegExp.prototype.exec, /ab/, ['confabulation']).index;
// 4

Reflect.apply(''.charAt, 'ponies', [3]);
// "i"
```

### 检查属性定义是否成功

使用 `[Object.defineProperty](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty>)`，如果成功返回一个对象，否则抛出一个 `[TypeError](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError>)`，你将使用 `[try...catch](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/try...catch>)` 块来捕获定义属性时发生的任何错误。因为 `[Reflect.defineProperty](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/defineProperty>)` 返回一个布尔值表示的成功状态，你可以在这里使用 `[if...else](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/if...else>)` 块：

```
if (Reflect.defineProperty(target, property, attributes)) {
  // success
} else {
  // failure
}
```



