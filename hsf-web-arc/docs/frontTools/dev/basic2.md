---
title: 前端异常的捕获与处理
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

按键无法点击、元素不展示、页面白屏，这些都是我们前端不想看到的场景。在计算机程序运行的过程中，也总是会出现各种各样的异常。下面就让我们聊一聊有哪些异常以及怎么处理它们。

## **一、前言**

什么是异常，异常就是预料之外的事件，往往影响了程序的正确运行。例如下面几种场景：

- 页面元素异常（例如按钮无法点击、元素不展示）
- 页面卡顿
- 页面白屏

这些情况都是极其影响用户体验的。对于前端来说，异常虽然不会导致计算机宕机，但是往往会导致用户的操作被阻塞。虽然异常不可完全杜绝，但是我们有充分的理由去理解异常、学习处理异常。

异常处理在程序设计中的重要性是毋庸置疑的。任何有影响力的 Web 应用程序都需要一套完善的异常处理机制，但实际上，通常只有服务端团队会在异常处理机制上投入较大精力。虽然客户端应用程序的异常处理也同样重要，但真正受到重视，还是最近几年的事。作为新世纪的杰出前端开发人员，我们必须理解有哪些异常，当发生异常时我们有哪些手段和工具可以利用。

## **二、异常分类**

从根本上来说，异常就是一个数据结构，它存了异常发生时相关信息，譬如错误码、错误信息等。其中 message 属性是唯一一个能够保证所有浏览器都支持的属性，除此之外，IE、Firefox、Safari、Chrome 以及 Opera 都为事件对象添加了其它相关信息。譬如 IE 添加了与 message 属性完全相同的 description 属性，还添加了保存这内部错误数量的 number 属性。Firefox 添加了 fileName、lineNumber 和 stack（包含堆栈属性）。所以，在考虑浏览器兼容性时，最好还是只使用 message 属性。

执行 JS 期间可能会发生的错误有很多类型。每种错误都有对应的错误类型，而当错误发生的时候就会抛出响应的错误对象。ECMA-262 中定义了下列 7 种错误类型：

- Error：错误的基类，其他错误都继承自该类型
- EvalError：Eval 函数执行异常
- RangeError：数组越界
- ReferenceError：尝试引用一个未被定义的变量时，将会抛出此异常
- SyntaxError：语法解析不合理
- TypeError：类型错误，用来表示值的类型非预期类型时发生的错误
- URIError：以一种错误的方式使用全局 URI 处理函数而产生的错误

## **三、异常处理**

ECMA-262 第 3 版中引入了 try-catch 语句，作为 JavaScript 中处理异常的一种标准方式，基本的语法如下所示。这和 Java 中的 try-catch 语句是全完相同的。

```
try {
// 可能会导致错误的代码
} catch (error) {
// 在错误发生时怎么处理
}
```

如果 try 块中的任何代码发生了错误，就会立即退出代码执行过程，然后执行 catch 块。此时 catch 块会接收到一个包含错误信息的对象，这个对象中包含的信息因浏览器而异，但共同的是有一个保存着错误信息的 message 属性。

finally 子句在 try-catch 语句中是可选的，但是 finally 子句一经使用，其代码无论如何都会执行。换句话说，try 语句块中代码全部正常执行，finally 子句会执行；如果因为出错执行了 catch 语句，finally 子句照样会执行。只要代码中包含 finally 子句，则无论 try 或 catch 语句中包含什么代码——甚至是 return 语句，都不会阻止 finally 子句执行。来看下面函数的执行结果：

```
function testFinally {
  try {
    return "出去玩";
  } catch (error) {
    return "看电视";
  } finally {
    return "做作业";
  }
  return "睡觉";
}
```

表面上调用这个函数会返回 "出去玩"，因为返回 "出去玩" 的语句位于 try 语句块中，而执行此语句又不会出错。实际上返回 "做作业"，因为最后还有 finally 子句，结果就会导致 try 块里的 return 语句被忽略，也就是说调用的结果只能返回 "做作业"。如果把 finally 语句拿掉，这个函数将返回 "出去玩"。因此，在使用 finally 子句之前，一定要非常清楚你想让代码怎么样。（思考一下如果 catch 块和 finally 块都抛出异常，catch 块的异常是否能抛出）

但令人遗憾的是，try-catch 无法处理异步代码和一些其他场景。接下来让我具体分析几种异常场景及其处理方案。

## **四、异常分析**

### **1. JS 代码错误**

下面为我司内部错误监控平台一次日常报错的调用堆栈截图：

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

错误还是比较明显的，this 指向导致的问题。onOk 使用普通函数时，函数内执行语句的 this 上下文为 Antd.Modal 组件的实例，而 Antd.Modal 组件不存在 changeFilterType 这个方法。将 onOK 方法像 onCancel 方法一样改成箭头函数，将 this 指向父组件即可。

**TypeError** 类型在 JavaScript 中会经常遇到，在变量中保存着意外类型时，或者在访问不存在的方法时，都会导致这种错误。错误的原因虽然多种多样，但归根结底还是由于在执行特定类型的操作时，变量的类型并不符合要求所致。再看几个例子：

```
class People {
  constructor(name) {
    this.name = name;
  }
  sing() {}
}
const xiaoming = new People("小明");
xiaoming.dance();// 抛出 TypeError
xiaoming.girlfriend.name;// 抛出 TypeError
```

代码错误一般在开发和测试阶段就能发现。用 try-catch 也能捕获到：

```
// 代码
try {
  xiaoming.girlfriend.name;
} catch (error) {
  console.log(xiaoming.name + "没有女朋友", error);
}
// 运行结果
// 小明没有女朋友 TypeError: Cannot read property 'name' of undefined
```

### **2. JS 语法错误**

我们修改一下代码，我们把英文分号改成中文分号:

```
try {
  xiaoming.girlfriend.name；// 结尾是中文分号
} catch(error) {
  console.log(xiaoming.name + "没有女朋友", error);
}
// 运行结果
// Uncaught SyntaxError: Invalid or unexpected token
```

**SyntaxError** 语法错误我们无法通过 try-catch 捕获到，不过语法错误在我们开发阶段就可以看到，应该不会顺利上到线上环境。

不过凡事总有例外，线上还是能收到一些语法错误的告警，但多半是 JSON 解析出错和浏览器兼容性导致。

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

再看几个例子：

```
JSON.parse('{name:xiaoming}');// Uncaught SyntaxError: Unexpected token n in JSON at position 1
JSON.parse('{"name":xiaoming}');// Uncaught SyntaxError: Unexpected token x in JSON at position 8
JSON.parse('{"name":"xiaoming"}');// 正常
var testFunc () => { };// 在 IE 下会抛出 SyntaxError，因为 IE 不支持箭头函数，需要通过Babel等工具事先转译下
```

使用 JSON.parse 解析时出现异常就是一个很好的使用 try-catch 的场景：

```
try {
  JSON.parse(remoteData);// remoteData 为服务端返回的数据
} catch {
  console.error("服务端数据格式返回异常，无法解析", remoteData);
}
```

并不是捕获到错误就结束了，捕获到错误后，我们需要思考当错误发生时：

- 错误是否是致命的，会不会导致其它连带错误
- 后续的代码逻辑还能不能继续执行，用户还能不能继续操作
- 是不是需要将错误信息反馈给用户，提示用户如何处理该错误
- 是不是需要将错误上报服务端

对应上面的问题这里就会有很多解决方案了，譬如：

1. 如果是服务器未知异常导致，可以阻塞用户操作，弹窗提示用户"服务器异常，请稍后重试"。并提供给用户一个刷新的按钮；

```
try {
  return JSON.parse(remoteData);
} catch (error) {
  Modal.fail("服务器异常，请稍后重试");
  return false;
}
```

1. 如果是数据异常导致，可阻塞用户操作，弹窗提示用户"服务器异常，请联系客服处理~"，同时将错误信息上报异常服务器，开发人员通过异常堆栈和用户埋点定位问题原因；

```
try {
  return JSON.parse(remoteData);
} catch (error) {
  Modal.fail("服务器异常，请联系客服处理~");
  logger.error("JSON数据解析出现异常", error);
  return false;
}
```

1. 如果数据解析出错属于预料之中的情况，也有替代的默认值，那么当解析出错时直接使用默认值也可以；

```
try {
  return JSON.parse(remoteData);
} catch (error) {
  console.error("服务端数据格式返回异常，使用本地缓存数据", erorr);
  return localData;
}
```

任何错误处理策略中最重要的一个部分，就是确定错误是否致命。

### **3. 异步错误**

```
try {
  setTimeout(() => {
    undefined.map(v => v);
  }, 1000)
} catch(e) {
  console.log("捕获到异常：", e);
}

Uncaught TypeError: Cannot read property 'map' of undefined
  at <anonymous>:3:15
```

并没有捕获到异常，`try-catch` 对语法和异步错误却无能为力，捕获不到，这是需要我们特别注意的地方。

## **五、异常捕获**

### **5.1 window.onerror**

当 `JS` 运行时错误发生时，`window` 会触发一个 `ErrorEvent` 接口的 `error` 事件，并执行`window.onerror()`。

```
/**
 * @param {String}  message    错误信息
 * @param {String}  source     出错文件
 * @param {Number}  lineno     行号
 * @param {Number}  colno      列号
 * @param {Object}  error      Error对象（对象）
 */
window.onerror = function (message, source, lineno, colno, error) {
  console.log("捕获到异常：", { message, source, lineno, colno, error });
};
```

同步错误可以捕获到，但是，请注意 `window.error` 无法捕获静态资源异常和 JS 代码错误。

### **5.2 静态资源加载异常**

**方法一：onerror 来捕获**

```
<script>
  function errorHandler(error) {
    console.log("捕获到静态资源加载异常", error);
  }
</script>
<script src="<http://cdn.xxx.com/js/test.js>" onerror="errorHandler(this)"></script>
<link rel="stylesheet" href="<http://cdn.xxx.com/styles/test.css>" onerror="errorHandler(this)">
```

这样可以拿到静态资源的错误，但缺点很明显，代码的侵入性太强了，每一个静态资源标签都要加上 onerror 方法。

**方法二：addEventListener("error")**

```
<!DOCTYPE html><html lang="zh"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>error</title> <script>  window.addEventListener('error', (error) => {   console.log('捕获到异常：', error);  }, true) </script></head> <body> <img src="<https://itemcdn.zcycdn.com/15af41ec-e6cb-4478-8fad-1a47402f0f25.png>"></body> </html>
```

由于网络请求异常不会事件冒泡，因此必须在捕获阶段将其捕捉到才行，但是这种方式虽然可以捕捉到网络请求的异常，但是无法判断 HTTP 的状态是 404 还是其他比如 500 等等，所以还需要配合服务端日志才进行排查分析才可以。

### **5.3 Promise 异常**

Promise 中的异常不能被 try-catch 和 window.onerror 捕获，这时候我们就需要监听 unhandledrejection 来帮我们捕获这部分错误。

```
window.addEventListener("unhandledrejection", function (e) {
  e.preventDefault();
  console.log("捕获到 promise 错误了");
  console.log("错误的原因是", e.reason);
  console.log("Promise 对象是", e.promise);
  return true;
});

Promise.reject("promise error");
new Promise((resolve, reject) => {
  reject("promise error");
});
new Promise((resolve) => {
  resolve();
}).then(() => {
  throw "promise error";
});
```

### **5.4 React 异常**

React 处理异常的方式不同。虽然 try-catch 适用于许多非普通 JavaScript 应用程序，但它只适用于命令式代码。因为 React 组件是声明性的，所以 try-catch 不是一个可靠的选项。为了弥补这一点，React 实现了所谓的错误边界。错误边界是 React 组件，它“捕获子组件树中的任何地方的 JavaScript 错误”，同时还记录错误并显示回退用户界面。

```
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
// 展示出错的UI
    this.setState({ hasError: true });
// 将错误信息上报到日志服务器
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
// 可以展示自定义的错误样式
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

但是需要注意的是， error boundaries 并不会捕捉下面这些错误：

- 事件处理器
- 异步代码
- 服务端的渲染代码
- 在 error boundaries 区域内的错误

我们可以这样使用 ErrorBoundary：

```
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary
```

### **5.5 Vue 异常**

```
Vue.config.errorHandler = (err, vm, info) => {
  console.error("通过vue errorHandler捕获的错误");
  console.error(err);
  console.error(vm);
  console.error(info);
};
```

### **5.6 请求异常**

以最常用的 HTTP 请求库 axios 为例，模拟接口响应 401 的情况：

```
// 请求
axios.get(/api/test/401")
// 结果
Uncaught (in promise) Error: Request failed with status code 401
at createError (axios.js:1207)
at settle (axios.js:1177)
at XMLHttpRequest.handleLoad (axios.js:1037)
```

可以看出来 axios 的异常可以当做 Promise 异常来处理：

```
// 请求
axios.get("<http://localhost:3000/api/uitest/sentry/401>")
.then(data => console.log('接口请求成功', data))
.catch(e => console.log('接口请求出错', e));
// 结果
接口请求出错 Error: Request failed with status code 401
at createError (createError.js:17)
at settle (settle.js:18)
at XMLHttpRequest.handleLoad (xhr.js:62)
```

一般接口 401 就代表用户未登录，就需要跳转到登录页，让用户进行重新登录，但如果每个请求方法都需要写一遍跳转登录页的逻辑就很麻烦了，这时候就会考虑使用 axios 的拦截器来做统一梳理，同理能统一处理的异常也可以在放在拦截器里处理。

```
// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
// Any status codes that falls outside the range of 2xx cause this function to trigger
// Do something with response error
  },
  function (error) {
    if (error.response.status === 401) {
      goLogin();// 跳转登录页
    } else if (error.response.status === 502) {
      alert(error.response.data.message || "系统升级中，请稍后重试");
    }
    return Promise.reject(error.response);
  }
);
```

### **5.7 总结**

异常一共七大类，处理时需分清是致命错误还是非致命错误。

- 可疑区域增加 `try-catch`
- 全局监控 `JS` 异常 `window.onerror`
- 全局监控静态资源异常 `window.addEventListener`
- 捕获没有 `catch` 的 `Promise` 异常用 `unhandledrejection`
- `Vue errorHandler` 和 `React componentDidCatch`
- `Axios` 请求统一异常处理用拦截器 `interceptors`
- 使用日志监控服务收集用户错误信息

## **六、异常上报**

即使我们前端开发完成后，会有一系列的 Web 应用的上线前的验证，如自测、QA 测试、code review 等，以确保应用能在生产上没有事故。

但是事与愿违，很多时候我们都会接到客户反馈的一些线上问题，这些问题有时候可能是你自己代码的问题。这样的问题一般能够在测试环境重现，我们很快的能定位到问题关键位置。但是，很多时候有一些问题，我们在测试中并未发现，可是在线上却有部分人出现了，问题确确实实存在的，这个时候我们测试环境又不能重现，还有一些偶现的生产的偶现问题，这些问题都很难定位到问题的原因，让我们前端工程师头疼不已。

而我们不可能每次都远程给用户解决问题，或者让用户按 F12 打开浏览器控制台把错误信息截图给我们吧。这时候，我们不得不借助一些工具来解决这一系列令人头疼的问题。

前端错误监控日志系统就应用而生。当前端代码在生产运行中出现错误的时候，第一时间传递给监控系统，从而第一时间定位并且解决问题。

有很多成熟的方案可供选择：ARMS、fundebug、BadJS、Sentry。政采云当前使用的是 Sentry 的开源版本，并结合业务进行一些改造：

- 与构建系统结合，构建项目时自动生成 Sentry 项目，注入 Sentry 脚本
- 客服端注入 Sentry 客户端脚本后，按项目、页面等不同粒度配置告警事件的过滤规则
- 对接钉钉消息系统，将告警消息推送到订阅群
- 过滤接口错误和优化 Promise 错误上报信息

后续也可以单开一篇介绍介绍，如何结合开源的错误监控系统，搭建具有公司特色的监控体系。



