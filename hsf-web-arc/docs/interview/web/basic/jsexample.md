---
title: js 手写例子
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---
# JS判断一个元素是否在可视区域中的几种方案

## 一、用途

可视区域即我们浏览网页的设备肉眼可见的区域，如下图

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/gH31uF9VIibSdRGEqCvdOpwR3OGHrUg7dFibPcfiaL0pMwyBj282fsVzbKSEMric8g6uWZhDtVn3HPBia1z05PtlR7w/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

在日常开发中，我们经常需要判断目标元素是否在视窗之内或者和视窗的距离小于一个值（例如 100 px），从而实现一些常用的功能，例如：

- 图片的懒加载
- 列表的无限滚动
- 计算广告元素的曝光情况
- 可点击链接的预加载

## 二、实现方式

判断一个元素是否在可视区域，我们常用的有三种办法：

- offsetTop、scrollTop
- getBoundingClientRect
- Intersection Observer

### offsetTop、scrollTop

`offsetTop`，元素的上外边框至包含元素的上内边框之间的像素距离，其他`offset`属性如下图所示：

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibSdRGEqCvdOpwR3OGHrUg7dU8lsaJPJprvdwY0z8ruNP57GwCbqRJSQ8EO8f4gGV9auAznRSvAxzA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

下面再来了解下`clientWidth`、`clientHeight`：

- `clientWidth`：元素内容区宽度加上左右内边距宽度，即`clientWidth = content + padding`
- `clientHeight`：元素内容区高度加上上下内边距高度，即`clientHeight = content + padding`

这里可以看到`client`元素都不包括外边距

最后，关于`scroll`系列的属性如下：

- `scrollWidth` 和 `scrollHeight` 主要用于确定元素内容的实际大小

- `scrollLeft` 和 `scrollTop` 属性既可以确定元素当前滚动的状态，也可以设置元素的滚动位置

- 

- - 垂直滚动 `scrollTop > 0`
  - 水平滚动 `scrollLeft > 0`

- 将元素的 `scrollLeft` 和 `scrollTop` 设置为 0，可以重置元素的滚动位置

#### 注意

- 上述属性都是只读的，每次访问都要重新开始

下面再看看如何实现判断：

公式如下：

```
el.offsetTop - document.documentElement.scrollTop <= viewPortHeight
```

代码实现：

```
function isInViewPortOfOne (el) {
    // viewPortHeight 兼容所有浏览器写法
    const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight 
    const offsetTop = el.offsetTop
    const scrollTop = document.documentElement.scrollTop
    const top = offsetTop - scrollTop
    return top <= viewPortHeight
}
```

### getBoundingClientRect

返回值是一个 `DOMRect`对象，拥有`left`, `top`, `right`, `bottom`, `x`, `y`, `width`, 和 `height`属性

```
const target = document.querySelector('.target');
const clientRect = target.getBoundingClientRect();
console.log(clientRect);

// {
//   bottom: 556.21875,
//   height: 393.59375,
//   left: 333,
//   right: 1017,
//   top: 162.625,
//   width: 684
// }
```

属性对应的关系图如下所示：

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibSdRGEqCvdOpwR3OGHrUg7d15CqjO9ibSg2wp8mJ9udGtENFVy2rglGN7QYvVlH42AmbrNHPYumCIQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

当页面发生滚动的时候，`top`与`left`属性值都会随之改变

如果一个元素在视窗之内的话，那么它一定满足下面四个条件：

- top 大于等于 0
- left 大于等于 0
- bottom 小于等于视窗高度
- right 小于等于视窗宽度

实现代码如下：

```
function isInViewPort(element) {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  const {
    top,
    right,
    bottom,
    left,
  } = element.getBoundingClientRect();

  return (
    top >= 0 &&
    left >= 0 &&
    right <= viewWidth &&
    bottom <= viewHeight
  );
}
```

### Intersection Observer

`Intersection Observer` 即重叠观察者，从这个命名就可以看出它用于判断两个元素是否重叠，因为不用进行事件的监听，性能方面相比`getBoundingClientRect`会好很多

使用步骤主要分为两步：创建观察者和传入被观察者

#### 创建观察者

```
const options = {
  // 表示重叠面积占被观察者的比例，从 0 - 1 取值，
  // 1 表示完全被包含
  threshold: 1.0, 
  root:document.querySelector('#scrollArea') // 必须是目标元素的父级元素
};

const callback = (entries, observer) => { ....}

const observer = new IntersectionObserver(callback, options);
```

通过`new IntersectionObserver`创建了观察者 `observer`，传入的参数 `callback` 在重叠比例超过 `threshold` 时会被执行`

关于`callback`回调函数常用属性如下：

```
// 上段代码中被省略的 callback
const callback = function(entries, observer) { 
    entries.forEach(entry => {
        entry.time;               // 触发的时间
        entry.rootBounds;         // 根元素的位置矩形，这种情况下为视窗位置
        entry.boundingClientRect; // 被观察者的位置举行
        entry.intersectionRect;   // 重叠区域的位置矩形
        entry.intersectionRatio;  // 重叠区域占被观察者面积的比例（被观察者不是矩形时也按照矩形计算）
        entry.target;             // 被观察者
    });
};
```

#### 传入被观察者

通过 `observer.observe(target)` 这一行代码即可简单的注册被观察者

```
const target = document.querySelector('.target');
observer.observe(target);
```

### 三、案例分析

实现：创建了一个十万个节点的长列表，当节点滚入到视窗中时，背景就会从红色变为黄色

`Html`结构如下：

```
<div class="container"></div>
```

`css`样式如下：

```
.container {
    display: flex;
    flex-wrap: wrap;
}
.target {
    margin: 5px;
    width: 20px;
    height: 20px;
    background: red;
}
```

往`container`插入1000个元素

```
const $container = $(".container");

// 插入 100000 个 <div class="target"></div>
function createTargets() {
  const htmlString = new Array(100000)
    .fill('<div class="target"></div>')
    .join("");
  $container.html(htmlString);
}
```

这里，首先使用`getBoundingClientRect`方法进行判断元素是否在可视区域

```
function isInViewPort(element) {
    const viewWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewHeight =
          window.innerHeight || document.documentElement.clientHeight;
    const { top, right, bottom, left } = element.getBoundingClientRect();

    return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
}
```

然后开始监听`scroll`事件，判断页面上哪些元素在可视区域中，如果在可视区域中则将背景颜色设置为`yellow`

```
$(window).on("scroll", () => {
    console.log("scroll !");
    $targets.each((index, element) => {
        if (isInViewPort(element)) {
            $(element).css("background-color", "yellow");
        }
    });
});
```

通过上述方式，可以看到可视区域颜色会变成黄色了，但是可以明显看到有卡顿的现象，原因在于我们绑定了`scroll`事件，`scroll`事件伴随了大量的计算，会造成资源方面的浪费

下面通过`Intersection Observer`的形式同样实现相同的功能

首先创建一个观察者

```
const observer = new IntersectionObserver(getYellow, { threshold: 1.0 });
```

`getYellow`回调函数实现对背景颜色改变，如下：

```
function getYellow(entries, observer) {
    entries.forEach(entry => {
        $(entry.target).css("background-color", "yellow");
    });
}
```

最后传入观察者，即`.target`元素

```
$targets.each((index, element) => {
    observer.observe(element);
});
```

可以看到功能同样完成，并且页面不会出现卡顿的情况

## 参考文献

- https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect
- https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API





**推荐阅读：**

```
JavaScript 中的内存泄漏Vue3 + Vite2 + TypeScript 开发复盘总结一张动图理解Vue3的Composition Api推荐 130 个令你眼前一亮的网站，总有一个用得着深入浅出 33 道 Vue 99% 出镜率的面试题
```

# 手写代码

### new 操作符

```
var New = function(Fn) {
  var obj = {}; // 创建空对象
  var arg = Array.prototype.slice.call(arguments, 1);
  obj.__proto__ = Fn.prototype; // 将obj的原型链__proto__指向构造函数的原型prototype
  obj.__proto__.constructor = Fn; // 在原型链 __proto__上设置构造函数的构造器constructor，为了实例化Fn
  Fn.apply(obj, arg); // 执行Fn，并将构造函数Fn执行obj
  return obj; // 返回结果
};
```

### 深拷贝

```
const getType = data => {
  // 获取数据类型
  const baseType = Object.prototype.toString
    .call(data)
    .replace(/^\[object\s(.+)\]$/g, "$1")
    .toLowerCase();
  const type = data instanceof Element ? "element" : baseType;
  return type;
};
const isPrimitive = data => {
  // 判断是否是基本数据类型
  const primitiveType = "undefined,null,boolean,string,symbol,number,bigint,map,set,weakmap,weakset".split(
    ","
  ); // 其实还有很多类型
  return primitiveType.includes(getType(data));
};
const isObject = data => getType(data) === "object";
const isArray = data => getType(data) === "array";
const deepClone = data => {
  let cache = {}; // 缓存值，防止循环引用
  const baseClone = _data => {
    let res;
    if (isPrimitive(_data)) {
      return data;
    } else if (isObject(_data)) {
      res = { ..._data };
    } else if (isArray(_data)) {
      res = [..._data];
    }
    // 判断是否有复杂类型的数据，有就递归
    Reflect.ownKeys(res).forEach(key => {
      if (res[key] && getType(res[key]) === "object") {
        // 用cache来记录已经被复制过的引用地址。用来解决循环引用的问题
        if (cache[res[key]]) {
          res[key] = cache[res[key]];
        } else {
          cache[res[key]] = res[key];
          res[key] = baseClone(res[key]);
        }
      }
    });
    return res;
  };
  return baseClone(data);
};
```

### 手写 bind

```
Function.prototype.bind2 = function(context) {
  if (typeof this !== "function") {
    throw new Error("...");
  }
  var that = this;
  var args1 = Array.prototype.slice.call(arguments, 1);
  var bindFn = function() {
    var args2 = Array.prototype.slice.call(arguments);
    var that2 = this instanceof bindFn ? this : context; // 如果当前函数的this指向的是构造函数中的this 则判定为new 操作。如果this是构造函数bindFn new出来的实例，那么此处的this一定是该实例本身。
    return that.apply(that2, args1.concat(args2));
  };
  var Fn = function() {}; // 连接原型链用Fn
  // 原型赋值
  Fn.prototype = this.prototype; // bindFn的prototype指向和this的prototype一样，指向同一个原型对象
  bindFn.prototype = new Fn();
  return bindFn;
};
```

### 手写函数柯里化

```
const curry = fn => {
  if (typeof fn !== "function") {
    throw Error("No function provided");
  }
  return function curriedFn(...args) {
    if (args.length < fn.length) {
      return function() {
        return curriedFn.apply(null, args.concat([].slice.call(arguments)));
      };
    }
    return fn.apply(null, args);
  };
};
```

### 手写 Promise

```
// 来源于 https://github.com/bailnl/promise/blob/master/src/promise.js
const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

const isFunction = fn => typeof fn === "function";
const isObject = obj => obj !== null && typeof obj === "object";
const noop = () => {};

const nextTick = fn => setTimeout(fn, 0);

const resolve = (promise, x) => {
  if (promise === x) {
    reject(promise, new TypeError("You cannot resolve a promise with itself"));
  } else if (x && x.constructor === Promise) {
    if (x._stauts === PENDING) {
      const handler = statusHandler => value => statusHandler(promise, value);
      x.then(handler(resolve), handler(reject));
    } else if (x._stauts === FULFILLED) {
      fulfill(promise, x._value);
    } else if (x._stauts === REJECTED) {
      reject(promise, x._value);
    }
  } else if (isFunction(x) || isObject(x)) {
    let isCalled = false;
    try {
      const then = x.then;
      if (isFunction(then)) {
        const handler = statusHandler => value => {
          if (!isCalled) {
            statusHandler(promise, value);
          }
          isCalled = true;
        };
        then.call(x, handler(resolve), handler(reject));
      } else {
        fulfill(promise, x);
      }
    } catch (e) {
      if (!isCalled) {
        reject(promise, e);
      }
    }
  } else {
    fulfill(promise, x);
  }
};

const reject = (promise, reason) => {
  if (promise._stauts !== PENDING) {
    return;
  }
  promise._stauts = REJECTED;
  promise._value = reason;
  invokeCallback(promise);
};

const fulfill = (promise, value) => {
  if (promise._stauts !== PENDING) {
    return;
  }
  promise._stauts = FULFILLED;
  promise._value = value;
  invokeCallback(promise);
};

const invokeCallback = promise => {
  if (promise._stauts === PENDING) {
    return;
  }
  nextTick(() => {
    while (promise._callbacks.length) {
      const {
        onFulfilled = value => value,
        onRejected = reason => {
          throw reason;
        },
        thenPromise
      } = promise._callbacks.shift();
      let value;
      try {
        value = (promise._stauts === FULFILLED ? onFulfilled : onRejected)(
          promise._value
        );
      } catch (e) {
        reject(thenPromise, e);
        continue;
      }
      resolve(thenPromise, value);
    }
  });
};

class Promise {
  static resolve(value) {
    return new Promise((resolve, reject) => resolve(value));
  }
  static reject(reason) {
    return new Promise((resolve, reject) => reject(reason));
  }
  constructor(resolver) {
    if (!(this instanceof Promise)) {
      throw new TypeError(
        `Class constructor Promise cannot be invoked without 'new'`
      );
    }

    if (!isFunction(resolver)) {
      throw new TypeError(`Promise resolver ${resolver} is not a function`);
    }

    this._stauts = PENDING;
    this._value = undefined;
    this._callbacks = [];

    try {
      resolver(value => resolve(this, value), reason => reject(this, reason));
    } catch (e) {
      reject(this, e);
    }
  }

  then(onFulfilled, onRejected) {
    const thenPromise = new this.constructor(noop);
    this._callbacks = this._callbacks.concat([
      {
        onFulfilled: isFunction(onFulfilled) ? onFulfilled : void 0,
        onRejected: isFunction(onRejected) ? onRejected : void 0,
        thenPromise
      }
    ]);
    invokeCallback(this);
    return thenPromise;
  }
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
}
```

### 手写防抖函数

```
const debounce = (fn = {}, wait = 50, immediate) => {
  let timer;
  return function() {
    if (immediate) {
      fn.apply(this, arguments);
    }
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, wait);
  };
};
```

### 手写节流函数

```
var throttle = (fn = {}, wait = 0) => {
  let prev = new Date();
  return function() {
    const args = arguments;
    const now = new Date();
    if (now - prev > wait) {
      fn.apply(this, args);
      prev = new Date();
    }
  };
};
```

### 手写 instanceOf

```
const instanceOf = (left, right) => {
  let proto = left.__proto__;
  let prototype = right.prototype;
  while (true) {
    if (proto === null) {
      return false;
    } else if (proto === prototype) {
      return true;
    }
    proto = proto.__proto__;
  }
};
```

## 其它知识

### typeof vs instanceof

`instanceof` 运算符用来检测 `constructor.prototype`是否存在于参数 `object` 的原型链上。

`typeof` 操作符返回一个字符串，表示未经计算的操作数的类型。

在 JavaScript 最初的实现中，JavaScript 中的值是由一个表示类型的标签和实际数据值表示的。对象的类型标签是 0。由于 `null` 代表的是空指针（大多数平台下值为 0x00），因此，null 的类型标签是 0，`typeof null` 也因此返回 `"object"`。

### 递归

> 递归（英语：Recursion），又译为递回，在数学与计算机科学中，是指在函数的定义中使用函数自身的方法。
>
> 例如：
>
> 大雄在房里，用时光电视看着未来的情况。电视画面中的那个时候，他正在房里，用时光电视，看着未来的情况。电视画面中的电视画面的那个时候，他正在房里，用时光电视，看着未来的情况……
>
> 简单来说，就是 **无限套娃**

我们以斐波那契数列（Fibonacci sequence）为例，看看输入结果会为正无穷的值的情况下，各种递归的情况。

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

首先是普通版

```
const fib1 = n => {
  if (typeof n !== "number") {
    throw new Error("..");
  }
  if (n < 2) {
    return n;
  }
  return fib1(n - 1) + fib1(n - 2);
};
```

从上面的代码分析，我们不难发现，在`fib1`里，JS 会不停创建执行上下文，压入栈内，而且在得出结果前不会销毁，所以数大了之后容易爆栈。

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

所以我们可以对其进行优化，就是利用 **尾调用** 进行优化。

尾调用是指函数的最后一步只返回一个纯函数的调用，而没有别的数据占用引用。代码如下：

```
const fib2 = (n, a = 0, b = 1) => {
  if (typeof n !== "number") {
    throw new Error("..");
  }
  if (n === 0) {
    return a;
  }
  return fib2(n - 1, b, a + b);
};
```

不过很遗憾，在 Chrome 83.0.4103.61 里还是会爆。

![图片](https://mmbiz.qpic.cn/mmbiz_png/y0rsINPrlZwiaiaDhnq7zdoCEsbMhMzSk7CTmtENaFaWpco5TfC0GM3aPAoCQycrADXNc1fJJRGVZrKJrK7MzMbw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

然后我们还有备忘录递归法，就是另外申请空间去存储每次递归的值，是个自顶向下的算法。

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

可惜，还是挂了。

不过在一些递归问题上，我们还可以利用动态规划（Dynamic programming，简称 DP）来解决。

动态规划是算法里比较难掌握的一个概念之一，但是基本能用递归来解决的问题，都能用动态规划来解决。

动态规划背后的基本思想非常简单。大致上，若要解一个给定问题，我们需要解其不同部分（即子问题），再根据子问题的解以得出原问题的解。

跟备忘录递归刚好相反，是自底向上的算法。具体代码如下：

```
const fib3 = n => {
  if (typeof n !== "number") {
    throw new Error("..");
  }
  if (n < 2) {
    return n;
  }
  let a = 0;
  let b = 1;
  while (n--) {
    [a, b] = [b, a + b];
  }
  return a;
};
```

![图片](https://mmbiz.qpic.cn/mmbiz_png/y0rsINPrlZwiaiaDhnq7zdoCEsbMhMzSk7G0QGujzicKeQTKgDibn03VrqBSQGnLY3eHbicBKRVuAjVhjxvZWkRqwEw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)





##  手写 Pollyfill 都在这里了

## new

测试用例：

```
function Fn (name) {
  this.name = name
}
console.log(myNew(Fn('lulu')))
```

实现：

```
function myNew () {
  const obj = {}
  const Fn = Array.prototype.shift.call(arguments)
  // eslint-disable-next-line no-proto
  obj.__proto__ = Fn.prototype
  const returnVal = Fn.apply(obj, arguments)
  return typeof returnVal === 'object' ? returnVal : obj
}
```



## bind

测试用例：

```
this.x = 9
const obj = {
  x: 81,
  getX: function () {
    return this.x
  }
}
console.log(obj.getX()) // 81

const retrieveX = obj.getX
console.log(retrieveX()) // 9

const boundGetX = retrieveX.mybind(obj)
console.log(boundGetX()) // 81
```

实现：

```
Function.prototype.mybind = function () {
  const outerArgs = Array.from(arguments)
  const ctx = outerArgs.shift()
  const self = this
  return function () {
    const innerArgs = Array.from(arguments)
    return self.apply(ctx, [...outerArgs, ...innerArgs])
  }
}
```

## instanceof

测试用例：

```
console.log(myInstanceof("111", String)); //false
console.log(myInstanceof(new String("111"), String));//true
```

实现：

```
function myInstanceof(left, right) {
    //基本数据类型直接返回false
    if(typeof left !== 'object' || left === null) return false;
    //getProtypeOf是Object对象自带的一个方法，能够拿到参数的原型对象
    let proto = Object.getPrototypeOf(left);
    while(true) {
        //查找到尽头，还没找到
        if(proto == null) return false;
        //找到相同的原型对象
        if(proto == right.prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
}
```



## debounce

在规定时间内函数只会触发一次，如果再次触发，会重新计算时间。

```
/*** 
 * @description 防抖函数
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate 是否立即执行
 * */
function debouncing(func, wait = 1000, immediate = true) {
    let timer = null;
    return function () {
        let args = arguments;
        let context = this;
        if (timer) {
            clearTimeout(timer);
        }
        if (!immediate) {
            //第一种：n秒之后执行，n秒内再次触发会重新计算时间
            timer = setTimeout(() => {
                //确保this指向不会改变
                func.apply(context, [...args]);
            }, wait);
        } else {
            //第二种：立即执行，n秒内不可再次触发
            let callnew = !timer;
            timer = setTimeout(() => {
                timer = null;
                console.log('kaka')
            }, wait);
            if (callnew) func.apply(context, [...args])
        }
    }
}

function fn() {
    console.log('debluncing')
}

let f1 = debouncing(fn, 1000);

setInterval(() => {
    f1()
}, 1000);
```



## throttle

节流指的是函数一定时间内不会再次执行，用作稀释函数的执行频率。

```
/**
 * @description 节流函数
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1：时间戳版本 2: 定时器版本
 *  */
function throttle(func, wait = 1000, type = 1) {
    if (type === 1) {
        let timeout = null;
        return function () {
            const context = this;
            const args = arguments;
            if (!timeout) {
                timeout = setTimeout(() => {
                    timeout = null;
                    func.apply(context, [...args]);
                }, wait);
            }
        }
    } else {
        let previous = 0;
        return function () {
            const context = this;
            const args = arguments;
            let newDate = new Date().getTime();
            if (newDate - previous > wait) {
                func.apply(context, [...args]);
                previous = newDate;
            }
        }
    }

}

function fn() {
    console.log('throttle')
}

const f1 = throttle(fn);

setInterval(() => {
    f1()
}, 100);
```



## deepClone

测试用例：

```
const map = new Map()
map.set('key', 'value')
map.set('name', 'kaka')

const set = new Set()
set.add('11').add('12')

const target = {
  field1: 1,
  field2: undefined,
  field3: {
    child: 'child'
  },
  field4: [
    2, 8
  ],
  empty: null,
  map,
  set
}
target.target = target
const target1 = deepClone(target)
target1.a = 'a'
console.log('🍎', target)
console.log('🍌', target1)
```

实现：

```
// 判断类型
function getType (target) {
  return Object.prototype.toString.call(target).slice(8, -1)
}
// 判断是否是原始类型类型.
// 对应可引用的数据类型，需要递归遍历；对应不可引用的数据类型，直接复制即可
function isReferenceType (target) {
  let type = typeof target
  return (target !== null && (type === 'object' || type === 'function'))
}
// 获取原型上的方法
function getInit (target) {
  let ClassNames = target.constructor
  return new ClassNames()
}
// 引用类型
const mapTag = 'Map'
const setTag = 'Set'
const arrayTag = 'Array'
const objectTag = 'Object'

// 不可引用类型
const boolTag = 'Boolean'
const dateTag = 'Date'
const errorTag = 'Error'
const numberTag = 'Number'
const regexpTag = 'RegExp'
const stringTag = 'String'
const symbolTag = 'Symbol'
const bufferTag = 'Uint8Array'

let deepTag = [mapTag, setTag, arrayTag, objectTag]
function deepClone (target, map = new WeakMap()) {
  let type = getType(target)
  let isOriginType = isReferenceType(target)
  if (!isOriginType) { return target } // 对于不可引用的数据类型，直接复制即可

  let cloneTarget
  if (deepTag.includes(type)) {
    cloneTarget = getInit(target)
  }

  // 防止循环引用
  if (map.get(target)) {
    return map.get(target)
  }
  map.set(target, cloneTarget)

  // 如果是 mapTag 类型
  if (type === mapTag) {
    console.log(target, cloneTarget, 'target')
    target.forEach((v, key) => {
      cloneTarget.set(key, deepClone(v, map))
    })
    return cloneTarget
  }

  // 如果是 setTag 类型
  if (type === setTag) {
    target.forEach((v) => {
      cloneTarget.add(deepClone(v, map))
    })
    return cloneTarget
  }

  // 如果是 arrayTag 类型
  if (type === arrayTag) {
    target.forEach((v, i) => {
      cloneTarget[i] = deepClone(v, map)
    })
    return cloneTarget
  }

  // 如果是 objectTag 类型
  if (type === objectTag) {
    let array = Object.keys(target)
    array.forEach((i, v) => {
      cloneTarget[i] = deepClone(target[i], map)
    })
    return cloneTarget
  }
}
```



## reduce

测试用例：

```
console.log([1, 2, 3, 4].myReduce((total, cur) => total + cur, 0))
```

实现：

```
/* eslint-disable no-extend-native */
Array.prototype.myReduce = function (callback, initialVal) {
  const arr = this
  let base = initialVal == null ? 0 : initialVal
  let startPoint = initialVal == null ? 0 : 1
  for (let i = 0; i < arr.length; i++) {
    base = callback(base, arr[i], i + startPoint, arr)
  }
  return base
}
```



## promise

```
// Promise 是一个可以 new 的类
class Promise {
  constructor (executor) {
    this.status = 'PENDING' // promise 默认是pending态
    this.reason = this.val = undefined // val 用于储存 resolve 函数的参数,reason 用于储存 reject 函数的参数
    /**
         * 这里用数组进行回调函数的存储 是因为一种场景，即同一个 promisee 多次调用 then 函数
         * let p = new Promise((resolve)=>resolve())
         * p.then()...
         * p.then()...
         * p.then()...
         * 这里数组就应储存三个函数 当状态从 pending 改变时，数组遍历执行
         *  */
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []
    const resolve = (val) => {
      // 如果一个promise resolve 了一个新的 promise
      // 则会等到内部的 promise 执行完, 获取它返回的结果
      if (val instanceof Promise) {
        return val.then(resolve, reject)
      }
      // 这里必须进行一次状态判断, 因为一个 promise 只能变一次状态
      // 当在调用 resolve 之前调用了 reject, 则 status 已经改变,这里应不再执行
      if (this.status === 'PENDING') {
        this.status = 'FULLFILLD'
        this.val = val
        this.onResolvedCallbacks.forEach(cb => cb())
      }
    }
    const reject = (reason) => {
      // 如果是 reject 的, 不用考虑 reason 是不是 promise 了，直接错误跑出
      if (this.status === 'PENDING') {
        this.status = 'REJECTED'
        this.reason = reason
        this.onRejectedCallbacks.forEach(cb => cb())
      }
    }
    // promise 必定会执行函数参数, 也算是一个缺点
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  static resolve (value) {
    return new Promise((resolve, reject) => {
      resolve(value)
    })
  }
  static reject (reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }
  static all (promises) {
    return new Promise((resolve, reject) => {
      let resolvedResult = []
      let resolvedCounter = 0
      for (let i = 0; i < promises.length; i++) {
        promises[i].then((val) => {
          resolvedCounter++
          resolvedResult[i] = val
          if (resolvedCounter === promises.length) {
            return resolve(resolvedResult)
          }
        }, e => reject(e))
      }
    })
  }
  static race (promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        // 只要有一个成功就成功，或者只要一个失败就失败
        promises[i].then(resolve, reject)
      }
    })
  }
  then (onFullFilled, onRejected) {
    // 可选参数需要为函数，如果不传或不是函数 则给出默认参数
    onFullFilled = typeof onFullFilled === 'function' ? onFullFilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
    // then 方法调用要返回 promise，即支持链式调用
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === 'FULLFILLD') {
        // 当前的onFulfilled, onRejected不能在这个上下文执行，要确保promise2存在，所以使用setTimeout
        setTimeout(() => {
          try {
            let x = onFullFilled(this.value)
            // 当前的onFulfilled, onRejected不能在这个上下文执行，要确保promise2存在，所以使用setTimeout
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.status === 'REJECTED') {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      // pending 状态就将函数收集到数组中去
      if (this.status === 'PENDING') {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFullFilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    })
    return promise2
  }
}

// 在Promise的静态方法上加如下方法可以通过一个npm模块测试是否符合A+规范
// https://github.com/promises-aplus/promises-tests 首先全局安装promises-aplus-tests
// -> npm i promises-aplus-tests -g 再进行测试 promises-aplus-tests myPromise.js
Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}
// promise 返回值处理函数
// 处理成功回调和失败回调返回的 x 的类型
// 返回类型有3种情况 1、普通值 2、普通对象 3、promise对象
function resolvePromise (promise2, x, resolve, reject) {
  // 返回值不能是promise2,自己等待自己完成
  // 比如 p = new Promise((resolve)=> resolve()).then(()=>p);
  if (promise2 === x) {
    return new TypeError('返回自身会导致死循环')
  }
  if ((typeof x === 'object' && x != null) || typeof x === 'function') {
    let called // 控制 resolve 和 reject 只执行一次，多次调用没有任何作用
    try {
      let then = x.then
      if (typeof then === 'function') { // x 返回的是一个 promise 对象
        /**
          * 这里不用x.then的原因 是x.then会取then方法的get
          * 如 Object.defineProperty(x,'then',{
          *     get () {
          *        throw new Error()
          *    }
          * })
          *
          *  */
        then.call(x,
          y => { // 此处 y 还有可能返回一个 promise 所以用递归直到返回值为一个普通值为止
            if (called) return
            called = true // 没有调用过则 called 赋值为 true 来终止下次的调用
            resolvePromise(promise2, y, resolve, reject)
          },
          r => {
            if (called) return
            called = true
            reject(r) // 直接用 reject 处理错误就会直接断掉 promise 的执行
          }
        )
      } else {
        resolve(x) // x 可能是一个普通的对象而非promise对象直接resolve
      }
    } catch (e) {
      if (called) return // 防止多次调用
      called = true
      reject(e)
    }
  } else {
    resolve(x) // x 可能是一个普通的值直接resolve
  }
}
/**
 * 创建promise
 * @param {Number} value
 */
function makePromise (value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value)
    }, Math.random() * 1000)
  })
}
/**
 * 打印结果
 * @param {Number} value
 */
function print (value) {
  console.log(value)
  return value
}

let promises = [1, 3, 4, 5, 6].map((item, index) => {
  return makePromise(item)
})

// 并行执行
Promise
  .all(promises)
  .then(() => {
    console.log('done')
  })
  .catch(() => {
    console.log('error')
  })

// 串行执行
let parallelPromises = promises.reduce((total, currentValue) => total.then(() => currentValue.then(print)), Promise.resolve())

parallelPromises.then(() => {
  console.log('done')
}).catch(() => {
  console.log('done')
})
```



## compose

- `compose` 的参数是函数数组，返回的也是一个函数
- `compose` 的参数是任意长度的，所有的参数都是函数，执行方向是自右向左的，因此初始函数一定放到参数的最右面
- `compose` 执行后返回的函数可以接收参数，这个参数将作为初始函数的参数，所以初始函数的参数是多元的，初始函数的返回结果将作为下一个函数的参数，以此类推。因此除了初始函数之外，其他函数的接收值是一元的。
- compose 和 pipe 的区别在于调用顺序的不同

```
let funcs = [fn1, fn2, fn3, fn4]
let composeFunc = compose(...funcs)
let pipeFunc = pipe(...funcs)

// compose
fn1(fn2(fn3(fn4(args))))
// pipe
fn4(fn3(fn2(fn1(args))))
function reduceFunc (prev, curr) {
  return (...args) => {
    curr.call(this, prev.apply(this, args))
  }
}

function compose (...args) {
  return args.reverse().reduce(reduceFunc, args.shift())
}
```



## eventEmitter

```
const wrapCb = (fn, once = false) => ({ callback: fn, once })
class EventEmitter {
  constructor () {
    this.events = new Map()
  }
  // 绑定事件
  on (event, listener, once = false) {
    let handler = this.events.get(event)
    if (!handler) {
      this.events.set(event, wrapCb(listener, once))
    } else if (handler && typeof handler.callback === 'function') {
      // 如果只绑定一个回调
      this.events.set(event, [handler, wrapCb(listener, once)])
    } else {
      // 绑定了多个回调
      this.events.set(event, [...handler, wrapCb(listener, once)])
    }
  }
  // 解绑事件
  off (event, listener) {
    let handler = this.events.get(event)
    if (!handler) return
    if (!Array.isArray(handler)) {
      // 简单比较回调函数是否相同
      if (String(handler.callback) === String(listener)) {
        this.events.delete(event)
      } else {

      }
    } else {
      // 循环函数回调队列
      for (let i = 0; i < handler.length; i++) {
        const item = handler[i]
        if (String(item.callback) === String(listener)) {
          handler.splice(i, 1)
          i--
        }
      }
    }
  }
  // 注册一个单次监听器
  once (event, listener) {
    this.on(event, listener, true)
  }
  // 触发事件，按监听器的顺序执行执行每个监听器
  emit (event, ...args) {
    let handler = this.events.get(event)
    if (Array.isArray(handler)) {
      // 拷贝到一个数组中，防止后续数组长度出现变化，对数组的访问出错
      let eventsArr = []
      for (let i = 0; i < handler.length; i++) {
        eventsArr.push(handler[i])
      }
      // 遍历队列，触发每一个回调队列
      for (let i = 0; i < eventsArr.length; i++) {
        const item = eventsArr[i]
        item.callback.apply(this, args)
        if (item.once) {
          // 如果回调函数只运行一次，则删除该回调函数
          this.off(event, item.callback)
        }
      }
    } else {
      // 否则直接执行即可
      handler.callback.apply(this, args)
    }
    return true
  }
}

const myEvent = new EventEmitter()

const listener1 = (name) => {
  if (name) {
    console.log(`监听器 ${name} 执行。`)
  } else {
    console.log('监听器 listener1 执行。')
  }
}

const listener2 = () => {
  console.log('监听器 listener2 执行。')
}

const listener3 = () => {
  console.log('监听器 listener3 执行。')
}
myEvent.on('load', listener1)
myEvent.on('load', listener2)
myEvent.once('load', listener3)
myEvent.emit('load')
myEvent.off('load', listener2)
myEvent.emit('load', 'custom')
// 执行结果如下：
// 监听器 listener1 执行。
// 监听器 listener2 执行。
// 监听器 listener3 执行。
// 监听器 custom 执行。
```



## offset

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)
`getBoundingClientRect`通过 DOM React 来描述一个元素的具体位置。

```
const offset = ele => {
    let result = {
        top: 0,
        left: 0
    }
    // 当前为 IE11 以下，直接返回 {top: 0, left: 0}
    if (!ele.getClientRects().length) {
        return result
    }

    // 当前 DOM 节点的 display === 'none' 时，直接返回 {top: 0, left: 0}
    if (window.getComputedStyle(ele)['display'] === 'none') {
        return result
    }

    result = ele.getBoundingClientRect()
    // ownerDocument 返回当前节点的顶层的 document 对象。
    // ownerDocument 是文档，documentElement 是根节点
    var docElement = ele.ownerDocument.documentElement 
    return {
        top: result.top + window.pageYOffset - docElement.clientTop,
        left: result.left + window.pageXOffset - docElement.clientLeft
    }
}
```



## Scheduler

```
class Scheduler {
  constructor (num) {
    this.num = num // 允许同时运行的异步函数的最大个数
    this.list = [] // 用来承载还未执行的异步
    this.count = 0 // 用来计数
  }

  async add (fn) {
    if (this.count >= this.num) {
      // 通过 await 阻塞 Promise 但是又不执行 resolve ,
      // 而是将 resolve 保存到数组当中去,
      // 这样就达到了当异步任务超过 max 个时线程就会阻塞在第一行.

      await new Promise((resolve) => { this.list.push(resolve) })
    }
    this.count++
    const result = await fn()
    this.count--
    if (this.list.length > 0) {
      // 每执行完一个异步任务就会去数组中查看一下有没有还处于阻塞当中的异步任务,
      // 如果有的话就执行最前面的那个异步任务.
      this.list.shift()()
    }
    return result
  }
}
const schedule = new Scheduler(2)// 最多同一时间让它执行3个异步函数

const timeout = (time) => new Promise(resolve => setTimeout(resolve, time))
const addTask = (time, order) => {
  schedule.add(() => timeout(time)).then(() => console.log(order))
}
addTask(1000, 1)
addTask(500, 2)
addTask(300, 3)
addTask(400, 4)
console.dir(schedule, 3)
// output: 2,3,1,4
// 一开始1、2 两个任务进入队列
// 500ms 时，2完成，输出2，任务3进队
// 800ms 时，3完成，输出3，任务4进队
// 1000ms 时， 1完成
// 1200ms 时，4完成
```



## useFetch

```
function useFetch(fetch, params, visible = true) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false); // fetch 数据时页面 loading
  const [newParams, setNewParams] = useState(params);

  const fetchApi = useCallback(async () => {
    console.log('useCallback');
    if (visible) {
      setLoading(true);
      const res = await fetch(newParams);
      if (res.code === 1) {
        setData(res.data);
      }
      setLoading(false);
    }
  }, [fetch, newParams, visible]);

  useEffect(() => {
    console.log('useEffect');
    fetchApi();
  }, [fetchApi]);

  const doFetch = useCallback(rest => {
    setNewParams(rest);
  }, []);

  const reFetch = () => {
    setNewParams(Object.assign({}, newParams)); // 用户点击modal后加载数据，或者当请求参数依赖某个数据的有无才会fetch数据
  };
  return { loading, data, doFetch, reFetch };
}
```



## useReducer

```
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```



## combineReducers

```
/**
 * Description: 组合不同的 Reducer
 * 
 * @param reducers
 * @return {Function} finalReducer
 */

rootReducer = combineReducers({potato: potatoReducer, tomato: tomatoReducer})
// rootReducer 将返回如下的 state 对象
{
  potato: {
    // ... potatoes, 和一些其他由 potatoReducer 管理的 state 对象 ...
  },
  tomato: {
    // ... tomatoes, 和一些其他由 tomatoReducer 管理的 state 对象，比如说 sauce 属性 ...
  }
}
function combineReducers(reducers) {
  // 返回合并后的新的 reducer 函数
  return function combination(state = {}, action) {
    const newState = {}
    Object.keys(reducers).map((key, i) => {
      const reducer = reducers[key]
      // 执行分 reducer，获得 newState
      newState[key] = reducer(state[key], action) // 这里通过 state[key] 来获取分模块的state，因此可知reducer的模块名字要和state中保持一致
    })
    return newState
  }
}
```



## ErrorBoundary

```
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
 
  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }
 
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```



## 双向数据绑定

### HOC

```
const Input = props => (
  <>
    <p>{props.value}</p>
    <input placeholder='input' {...props}/>
  </>
)
const HocInput = HocBind(Input)
const App = () => (
    <HocInput initialValue='init' onChange={val => { console.log("HocInput", val) }} />
)
const HocBind = WrapperComponent => {
  return class extends React.Component {
    state = {
      value: this.props.initialValue
    }
    onChange = e => {
      const { onChange } = this.props;
      this.setState({ value: e.target.value });
      if (onChange) {
        onChange(e.target.value);
      }
    }
    render() {
      const newProps = {
        value: this.state.props,
        onChange: this.onChange
      };
      return <WrapperComponent {...newProps} />;
    }
  };
};
```



### Render Props

```
const App = () => (
  <HocInput initialValue="init" onChange={val => { console.log('HocInput', val) }}>
    {props => (
      <div>
        <p>{props.value}</p>
        <input placeholder="input" {...props} />
      </div>
    )}
  </HocInput>
);
class HocInput extends React.Component {
  state={
    value: this.props.initialValue
  }
  onChange = (e) => {
    const { onChange } = this.props
    this.setState({ value: e.target.value })
    if (onChange) {
      onChange(this.state.value)
    }
  }

  render() {
    const newProps = {
      value: this.state.value,
      onChange: this.onChange
    };
    return (<div>
      {this.props.children({...newProps})}
    </div>)
  }

}
```



### Hook

```
function useBind(initialValue) {
  const [value, setValue] = useState(initialValue)
  const onChange = e => {
    setValue(e.target.val)
  }
  return { value, onChange }
}


function InputBind() {
  const { value, onChange } = useBind('init')
  return (
    <div>
      <p>{value}</p>
      <input onChange={onChange}/>
    </div>
  )
}
```



总结：我是一个不太愿意造这种小轮子的人，所以面试的时候是比较排斥的，我觉得能说出基本的思路即可。自己完整整理了一遍，发现细节才是体现水平的地方，是对底层的深入理解。这是一个刻意练习的过程。



