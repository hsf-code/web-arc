---
title: Promise.reject()
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

## 语法

```
Promise.reject(reason);
```

### 参数

**reason**表示`Promise`被拒绝的原因。

### 返回值

一个给定原因了的被拒绝的 `[Promise](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise>)`。

## 描述

静态函数`Promise.reject`返回一个被拒绝的`Promise对象`。通过使用`[Error](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error>)`的实例获取错误原因`reason`对调试和选择性错误捕捉很有帮助。

## 示例

### 使用静态`Promise.reject()`方法

```
Promise.reject(new Error('fail')).then(function() {
  // not called
}, function(error) {
  console.error(error); // Stacktrace
});
```

