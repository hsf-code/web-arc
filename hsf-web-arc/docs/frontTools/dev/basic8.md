---
title: JS技巧（一）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# Object deep copy

在处理日常的业务开发当中，数据拷贝是经常需要用到的。但是 javascript 提供的数据操作 Api 当中能实现对象克隆的都是浅拷贝，比如 Object.assign 和 ES6 新增的对象扩展运算符（...）,这两个 Api 只能实现对象属性的一层拷贝，对于复制的属性其值如果是引用类型的情况下，拷贝过后的新对象还是会保留对它们的引用。

## **简单粗暴的深拷贝**

ESMAScript 给我们提供了关于操作 JSON 数据的两个 APi，通过把 javascript 对象先转换为 JSON 数据，之后再把 JSON 数据转换为 Javascript 对象，这样就简单粗暴的实现了一个 javascript 对象的深拷贝，不论这个对象层级有多深，都会完全与源对象没有任何联系，切断其属性的引用，现在看一下这两个 API 用代码是怎么实现的。

```jsx
// 现创建一个具有深度嵌套的源对象const sourceObj = {
  nested: {
    name: 'KongLingWen',
  },
}

// 把源对象转化为JSON格式的字符串const jsonTarget = JSON.stringify(sourceObj)

// 以解析json数据的方式转换为javascript对象let target
try {
  target = JSON.parse(jsonTarget) //数据如果不符合JSON对象格式会抛错，这里加一个错误处理
} catch (err) {
  console.error(err)
}

target.nested.name = ''

console.log(soruceObj.nested.name) //KongLingWen
```

代码最后通过更改新拷贝对象的 name 属性 ，输出源对象此属性的值不变，这说明我们以这种方式就实现了一个对象深拷贝。

## **JSON.parse 和 JSON.stringify 转换属性值前后的不一致性**

- 函数无法序列化函数，属性值为函数的属性转换之后丢失
- 日期 Date 对象javascript Date 对象转换到 JSON 对象之后无法反解析为 原对象类型，解析后的值仍然是 JSON 格式的字符串
- 正则 RegExp 对象RegExp 对象序列化后为一个普通的 javascript 对象，同样不符合预期
- undefined序列化之后直接被过滤掉，丢失拷贝的属性
- NaN序列化之后为 null，同样不符合预期结果

此方式拷贝对象因为有以上这么多缺陷，所以我们不如自己封装一个属于自己的 javascript 对象深拷贝的函数，反而一劳永逸。

```jsx
export default function deepCopy (obj) {
  if (typeof obj !== 'object') {
    // 对基本类型进行判断
    return obj
  } else if (Object.prototype.toString.call(obj) === '[object Null]') {
    // typeof null = object, 需要单独判断
    return obj
  } else {
    // 实现对数组及对象的深拷贝
    let result = Array.isArray(obj) ? [] : {}
    // for in 遍历对象和原型链上的属性和方法
    for (let key in obj) {
      // 判断是否是对象的自身内容，如果是才去做深拷贝
      // hasOwnPropertys()方法返回一个布尔值，判断对象是否包含特定的自身非继承属性
      if (obj.hasOwnProperty(key)) {
        // 判断是否是对象
        if (obj[key] && typeof obj[key] === 'object') {
          result[key] = deepCopy(obj[key])
        } else {
          result[key] = obj[key]
        }
      }
    }
 
    return result
  }
}
// 深拷贝对象
export function deepClone(obj) {
  const _toString = Object.prototype.toString

  // null, undefined, non-object, function
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  // DOM Node
  if (obj.nodeType && 'cloneNode' in obj) {
    return obj.cloneNode(true)
  }

  // Date
  if (_toString.call(obj) === '[object Date]') {
    return new Date(obj.getTime())
  }

  // RegExp
  if (_toString.call(obj) === '[object RegExp]') {
    const flags = []
    if (obj.global) { flags.push('g') }
    if (obj.multiline) { flags.push('m') }
    if (obj.ignoreCase) { flags.push('i') }

    return new RegExp(obj.source, flags.join(''))
  }

  const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}

  for (const key in obj) {
    result[key] = deepClone(obj[key])
  }

  return result
}
```



# Data type judge

```jsx
/*global toString:true*/

var toString = Object.prototype.toString;
```

1、字符串的判别

```jsx
export function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}
```

2、数字的判别

```jsx
function isNumber(val) {
  return typeof val === 'number';
}
```

3、对象的判别

```jsx
export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * Determine if a value is a plain Object
 * 确定一个值是否是普通对象
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }
  // getPrototypeOf 返回指定对象的原型，如果给的对象没有继承属性，则返回null
  // 当你在创建写一个{}的时候，其实在内部是由Object构造函数创建的，所以该对象的原型就会默认继承Object.prototype
  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}
```

4、数组的判断

```jsx
/**
 * Determine if a value is an Array
 * toString会被每一个对象继承，返回的值是 '[object type]' 一段字符串，其中包含该调用对象的类型
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}
```

5、函数的判别

```jsx
export const isFunction = (functionToCheck) => {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false 如果值是缓冲区，则为真，否则为假
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}
```

6、是否定义

```jsx
export const isUndefined = (val)=> {
  return val === void 0;
};

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

// 是否被定义
export const isDefined = (val) => {
  return val !== undefined && val !== null;
};
```

7、其他构造函数类型

```jsx
/**
 * Determine if a value is a FormData
 * instanceof 可以判断是某个对象的实例
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 * 确定一个值是否是一个Blob
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a Stream
 * 确定一个值是否为流
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 * 确定一个值是否为URLSearchParams对象
 * URLSearchParams 接口定义了一些实用的方法来处理 URL 的查询字符串。
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}
```

8、修剪字符串开头和结尾的多余空格

```jsx
/**
 * Trim excess whitespace off the beginning and end of a string
 * 修剪字符串开头和结尾的多余空格
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\\s*/, '').replace(/\\s*$/, '');
}
```

9、确定我们是否在标准的浏览器环境中运行

```jsx
/**
 * Determine if we're running in a standard browser environment
 * 确定我们是否在标准的浏览器环境中运行
 * This allows axios to run in a web worker, and react-native. 这允许axios在web worker、react-native中运行
 * Both environments support XMLHttpRequest, but not fully standard globals.这两个环境都支持XMLHttpRequest，但不支持完全标准的全局变量。
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}
```

10、首字母大写键盘输入小写

```jsx
// 小写转化
export const kebabCase = function(str) {
  const hyphenateRE = /([^-])([A-Z])/g;
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase();
};
// 首字母大写
export const capitalize = function(str) {
  if (!isString(str)) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
```

11、对象自身属性的判断

```jsx
// 是否为对象自身属性的判断
const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
};

// 对象属性的扩展
function extend(to, _from) {
  for (let key in _from) {
    to[key] = _from[key];
  }
  return to;
};

// 数组向对象的转化
export function toObject(arr) {
  var res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
};

export const isEmpty = function(val) {
  // null or undefined
  if (val == null) return true;

  if (typeof val === 'boolean') return false;

  if (typeof val === 'number') return !val;

  if (val instanceof Error) return val.message === '';

  switch (Object.prototype.toString.call(val)) {
    // String or Array
    case '[object String]':
    case '[object Array]':
      return !val.length;

    // Map or Set or File
    case '[object File]':
    case '[object Map]':
    case '[object Set]': {
      return !val.size;
    }
    // Plain Object
    case '[object Object]': {
      return !Object.keys(val).length;
    }
  }

  return false;
};
// 对象转化为数组
export function objToArray(obj) {
  if (Array.isArray(obj)) {
    return obj;
  }
  return isEmpty(obj) ? [] : [obj];
}
```

12、判断两个值是否相等

```jsx
// 对数组值的简单比较，数组的每一项不是引用类型
export const valueEquals = (a, b) => {
  if (a === b) return true;
  if (!(a instanceof Array)) return false;
  if (!(b instanceof Array)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i !== a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
// 对于这个判断是不包含值为数组的情况
export const looseEqual = function(a, b) {
  const isObjectA = isObject(a);
  const isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    return JSON.stringify(a) === JSON.stringify(b);
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
};

// 对于数组值的比较
export const arrayEquals = function(arrayA, arrayB) {
  arrayA = arrayA || [];
  arrayB = arrayB || [];

  if (arrayA.length !== arrayB.length) {
    return false;
  }

  for (let i = 0; i < arrayA.length; i++) {
    if (!looseEqual(arrayA[i], arrayB[i])) {
      return false;
    }
  }

  return true;
};

// 集合版
export const isEqual = function(value1, value2) {
  if (Array.isArray(value1) && Array.isArray(value2)) {
    return arrayEquals(value1, value2);
  }
  return looseEqual(value1, value2);
};
```

13、浏览器相关的

```jsx
export function rafThrottle(fn) {
  let locked = false;
  return function(...args) {
    if (locked) return;
    locked = true;
    window.requestAnimationFrame(_ => {
      fn.apply(this, args);
      locked = false;
    });
  };
}

export const isIE = function() {
  return !Vue.prototype.$isServer && !isNaN(Number(document.documentMode));
};

export const isEdge = function() {
  return !Vue.prototype.$isServer && navigator.userAgent.indexOf('Edge') > -1;
};

export const isFirefox = function() {
  return !Vue.prototype.$isServer && !!window.navigator.userAgent.match(/firefox/i);
};

// 在css添加前缀
export const autoprefixer = function(style) {
  if (typeof style !== 'object') return style;
  const rules = ['transform', 'transition', 'animation'];
  const prefixes = ['ms-', 'webkit-'];
  rules.forEach(rule => {
    const value = style[rule];
    if (rule && value) {
      prefixes.forEach(prefix => {
        style[prefix + rule] = value;
      });
    }
  });
  return style;
};

// 是否为html标签元素
export function isHtmlElement(node) {
  return node && node.nodeType === Node.ELEMENT_NODE;
}
```

14、值是否为空

```jsx
export const isEmpty = function(val) {
  // null or undefined
  if (val == null) return true;

  if (typeof val === 'boolean') return false;

  if (typeof val === 'number') return !val;

  if (val instanceof Error) return val.message === '';

  switch (Object.prototype.toString.call(val)) {
    // String or Array
    case '[object String]':
    case '[object Array]':
      return !val.length;

    // Map or Set or File
    case '[object File]':
    case '[object Map]':
    case '[object Set]': {
      return !val.size;
    }
    // Plain Object
    case '[object Object]': {
      return !Object.keys(val).length;
    }
  }

  return false;
};
```

15、数组去重的技巧

```jsx
// 双层for循环去重
function unique(arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] == arr[j]) {
        arr.splice(j, 1);
        j--;
      }
    }
  }
  return arr;
}

// 利用indexOf去重
function unique(arr) {
  if (!Array.isArray(arr)) {
    console.log("type error!");
    return;
  }
  var array = [];
  for (var i = 0; i < arr.length; i++) {
    if (array.indexOf(arr[i]) === -1) {
      array.push(arr[i]);
    }
  }
  return array;
}

// 利用Array.from与set去重
function unique(arr) {
  if (!Array.isArray(arr)) {
    console.log("type error!");
    return;
  }
  return Array.from(new Set(arr));
}
```

16、数组转化为对象（Array to Object)

```jsx
// 1、简单的实现方式
var obj = {};
var arr = ["1", "2", "3"];
for (var key in arr) {
  obj[key] = arr[key];
}
console.log(obj)

// 2、更简单
const arr = [1, 2, 3]
const obj = {
  ...arr
}
console.log(obj)

// 转换为数字类型（Convert to Number）
// 这种是很常见的，大家用的比较多的可能是parseInt()、Number()这种
const age = "69";
const ageConvert = parseInt(age);
console.log(typeof ageConvert);

Output: number;

const age = "69";
const ageConvert = +age;
console.log(typeof ageConvert);

Output: number;

// 转换为字符串类型（Convert to String）
let a = 123;

a.toString(); // '123'

let a = 123;

a + ""; // '123'

// 性能追踪
let start = performance.now();
let sum = 0;
for (let i = 0; i < 100000; i++) {
  sum += 1;
}
let end = performance.now();
console.log(start);
console.log(end);

// 合并对象（Combining Objects）
const obj1 = {
  a: 1
}
const obj2 = {
  b: 2
}
console.log(Object.assign(obj1, obj2))

// Output: {
//   a: 1,
//   b: 2
// }

// 或者
const obj1 = {
  a: 1
}
const obj2 = {
  b: 2
}
const combinObj = {
  ...obj1,
  ...obj2
}
console.log(combinObj)

// Output:
// { a: 1, b: 2 }

// 短路运算(Short-circuit evaluation)
if (isOnline) {
  postMessage();
}
// 使用&&
isOnline && postMessage();

// 使用||
let name = null || "森林";

// 数组扁平化（Flattening an array）
// 数组的扁平化，我们一般会用递归或reduce去实现
// 递归
var arr = [1, [2, [3, 4]]];

function flatten(arr) {
  var result = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

console.log(flatten(arr));

// reduce
var arr = [1, [2, [3, 4]]];

function flatten(arr) {
  return arr.reduce(function(prev, next) {
    return prev.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}

console.log(flatten(arr));

// 但是es6提供了一个新方法 flat(depth)，参数depth，代表展开嵌套数组的深度，默认是1
let arr = [1, [2, 3, [4, [5]]]];
arr.flat(3); // [1,2,3,4,5]

// 浮点数转为整数（Float to Integer）
// 我们一般将浮点数转化为整数会用到Math.floor()、Math.ceil()、Math.round()。但其实有一个更快的方式：也就是使用~, >>, <<, >>>, |这些位运算符来实现取整
console.log(~~6.95); // 6
console.log(6.95 >> 0); // 6
console.log(6.95 << 0); // 6
console.log(6.95 | 0); // 6
// >>>不可对负数取整
console.log(6.95 >>> 0); // 6

/***
 * 拷贝数组
 */
const arr = [1, 2, 3, 4, 5];
const copyArr = arr.slice();

const arr = [1, 2, 3, 4, 5];
const copyArr = [...arr];

const arr = [1, 2, 3, 4, 5];
const copyArr = new Array(...arr);

const arr = [1, 2, 3, 4, 5];
const copyArr = arr.concat();
```



# ES6的fun method

```jsx
// 1.如何隐藏所有指定的元素
const hide = (el) => Array.from(el).forEach(e => (e.style.display = 'none'));

// 事例:隐藏页面上所有`<img>`元素?
hide(document.querySelectorAll('img'))

// 2.如何检查元素是否具有指定的类？
// 页面DOM里的每个节点上都有一个classList对象，程序员可以使用里面的方法新增、删除、修改节点上的CSS类。使用classList，程序员还可以用它来判断某个节点是否被赋予了某个CSS类。
const hasClass = (el, className) => el.classList.contains(className)

// 事例
hasClass(document.querySelector('p.special'), 'special') // true

// 3.如何切换一个元素的类?
const toggleClass = (el, className) => el.classList.toggle(className)

// 事例 移除 p 具有类`special`的 special 类
toggleClass(document.querySelector('p.special'), 'special')

// 4.如何获取当前页面的滚动位置？
const getScrollPosition = (el = window) => ({
  x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
  y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
});

// 事例
getScrollPosition(); // {x: 0, y: 200}

// 5.如何平滑滚动到页面顶部
const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
}

// 事例
scrollToTop()
/**
 * window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。
 * 该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。
 * requestAnimationFrame：优势：由系统决定回调函数的执行时机。60Hz的刷新频率，那么每次刷新的间隔中会执行一次回调函数，不会引起丢帧，不会卡顿。
 */

//  6.如何检查父元素是否包含子元素？
const elementContains = (parent, child) => parent !== child && parent.contains(child);

// 事例
elementContains(document.querySelector('head'), document.querySelector('title'));
// true
elementContains(document.querySelector('body'), document.querySelector('body'));
// false

// 7.如何检查指定的元素在视口中是否可见？
const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
  const {
    top,
    left,
    bottom,
    right
  } = el.getBoundingClientRect();
  const {
    innerHeight,
    innerWidth
  } = window;
  return partiallyVisible ?
    ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
    ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth)) :
    top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

// 事例
elementIsVisibleInViewport(el); // 需要左右可见
elementIsVisibleInViewport(el, true); // 需要全屏(上下左右)可以见

// 8.如何获取元素中的所有图像？
const getImages = (el, includeDuplicates = false) => {
  const images = [...el.getElementsByTagName('img')].map(img => img.getAttribute('src'));
  return includeDuplicates ? images : [...new Set(images)];
};

// 事例：includeDuplicates 为 true 表示需要排除重复元素
getImages(document, true); // ['image1.jpg', 'image2.png', 'image1.png', '...']
getImages(document, false); // ['image1.jpg', 'image2.png', '...']

// 9.如何确定设备是移动设备还是台式机/笔记本电脑？
const detectDeviceType = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ?
  'Mobile' :
  'Desktop';

// 事例
detectDeviceType(); // "Mobile" or "Desktop"

// 10.How to get the current URL?
const currentURL = () => window.location.href

// 事例
currentURL() // '<https://google.com>'

// 11.如何创建一个包含当前URL参数的对象？
const getURLParameters = url =>
  (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
    (a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a), {}
  );

// 事例
getURLParameters('<http://url.com/page?n=Adam&s=Smith>'); // {n: 'Adam', s: 'Smith'}
getURLParameters('google.com'); // {}

// 12.如何将一组表单元素转化为对象？
const formToObject = form =>
  Array.from(new FormData(form)).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value
    }), {}
  );

// 事例
formToObject(document.querySelector('#form'));
// { email: 'test@email.com', name: 'Test Name' }

// 13.如何从对象检索给定选择器指示的一组属性？
const get = (from, ...selectors) => [...selectors].map(s =>
  s
  .replace(/\\[([^\\[\\]]*)\\]/g, '.$1.')
  .split('.')
  .filter(t => t !== '')
  .reduce((prev, cur) => prev && prev[cur], from)
);
const obj = {
  selector: {
    to: {
      val: 'val to select'
    }
  },
  target: [1, 2, {
    a: 'test'
  }]
};

// Example
get(obj, 'selector.to.val', 'target[0]', 'target[2].a');
// ['val to select', 1, 'test']

// 14.如何在等待指定时间后调用提供的函数？
const delay = (fn, wait, ...args) => setTimeout(fn, wait, ...args);
delay(
  function(text) {
    console.log(text);
  },
  1000,
  'later'
);

// 1秒后打印 'later'

// 15.如何在给定元素上触发特定事件且能选择地传递自定义数据？
const triggerEvent = (el, eventType, detail) =>
  el.dispatchEvent(new CustomEvent(eventType, {
    detail
  }));

// 事例
triggerEvent(document.getElementById('myId'), 'click');
triggerEvent(document.getElementById('myId'), 'click', {
  username: 'bob'
});
// 自定义事件的函数有 Event、CustomEvent 和 dispatchEvent
// 向 window派发一个resize内置事件
window.dispatchEvent(new Event('resize'))

// 直接自定义事件，使用 Event 构造函数：
var event = new Event('build');
var elem = document.querySelector('#id')
// 监听事件
// elem.addEventListener('build', function(e) {
//   ...
// }, false);
// 触发事件.
elem.dispatchEvent(event);

// CustomEvent 可以创建一个更高度自定义事件，还可以附带一些数据，具体用法如下：
// var myEvent = new CustomEvent(eventname, options);
// 其中 options 可以是： {
//   detail: {
//     ...
//   },
//   bubbles: true, //是否冒泡
//   cancelable: false //是否取消默认事件
// }
/**
 * 其中 detail 可以存放一些初始化的信息，可以在触发的时候调用。其他属性就是定义该事件是否具有冒泡等等功能。
 * 内置的事件会由浏览器根据某些操作进行触发，自定义的事件就需要人工触发。 dispatchEvent 函数就是用来触发某个事件：
 */
element.dispatchEvent(customEvent);
// 上面代码表示，在 element 上面触发 customEvent 这个事件。
// add an appropriate event listener
obj.addEventListener("cat", function(e) {
  process(e.detail)
});

// create and dispatch the event
var event = new CustomEvent("cat", {
  "detail": {
    "hazcheeseburger": true
  }
});
obj.dispatchEvent(event);
// 使用自定义事件需要注意兼容性问题，而使用 jQuery 就简单多了：

// 绑定自定义事件
$(element).on('myCustomEvent', function() {});

// 触发事件
$(element).trigger('myCustomEvent');
// 此外，你还可以在触发自定义事件时传递更多参数信息：

$("p").on("myCustomEvent", function(event, myName) {
  $(this).text(myName + ", hi there!");
});
$("button").click(function() {
  $("p").trigger("myCustomEvent", ["John"]);
});

// 16.如何从元素中移除事件监听器?
const off = (el, evt, fn, opts = false) => el.removeEventListener(evt, fn, opts);

const fn = () => console.log('!');
document.body.addEventListener('click', fn);
off(document.body, 'click', fn);

// 17.如何获得给定毫秒数的可读格式？
const formatDuration = ms => {
  if (ms < 0) ms = -ms;
  const time = {
    day: Math.floor(ms / 86400000),
    hour: Math.floor(ms / 3600000) % 24,
    minute: Math.floor(ms / 60000) % 60,
    second: Math.floor(ms / 1000) % 60,
    millisecond: Math.floor(ms) % 1000
  };
  return Object.entries(time)
    .filter(val => val[1] !== 0)
    .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
    .join(', ');
};

// 事例
formatDuration(1001); // '1 second, 1 millisecond'
formatDuration(34325055574);
// '397 days, 6 hours, 44 minutes, 15 seconds, 574 milliseconds'

// 18.如何获得两个日期之间的差异（以天为单位）？
const getDaysDiffBetweenDates = (dateInitial, dateFinal) =>
  (dateFinal - dateInitial) / (1000 * 3600 * 24);

// 事例
getDaysDiffBetweenDates(new Date('2017-12-13'), new Date('2017-12-22')); // 9

// 19.如何向传递的URL发出GET请求？
const httpGet = (url, callback, err = console.error) => {
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = () => callback(request.responseText);
  request.onerror = () => err(request);
  request.send();
};

httpGet(
  '<https://jsonplaceholder.typicode.com/posts/1>',
  console.log
);

// {"userId": 1, "id": 1, "title": "sample title", "body": "my text"}

// 20.如何对传递的URL发出POST请求？
const httpPost = (url, data, callback, err = console.error) => {
  const request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  request.onload = () => callback(request.responseText);
  request.onerror = () => err(request);
  request.send(data);
};

const newPost = {
  userId: 1,
  id: 1337,
  title: 'Foo',
  body: 'bar bar bar'
};
const data = JSON.stringify(newPost);
httpPost(
  '<https://jsonplaceholder.typicode.com/posts>',
  data,
  console.log
);

// {"userId": 1, "id": 1337, "title": "Foo", "body": "bar bar bar"}

// 21.如何为指定选择器创建具有指定范围，步长和持续时间的计数器？

const counter = (selector, start, end, step = 1, duration = 2000) => {
  let current = start,
    _step = (end - start) * step < 0 ? -step : step,
    timer = setInterval(() => {
      current += _step;
      document.querySelector(selector).innerHTML = current;
      if (current >= end) document.querySelector(selector).innerHTML = end;
      if (current >= end) clearInterval(timer);
    }, Math.abs(Math.floor(duration / (end - start))));
  return timer;
};

// 事例
counter('#my-id', 1, 1000, 5, 2000);
// 让 `id=“my-id”`的元素创建一个2秒计时器

// 22.如何将字符串复制到剪贴板？
const el = document.createElement('textarea');
el.value = str;
el.setAttribute('readonly', '');
el.style.position = 'absolute';
el.style.left = '-9999px';
document.body.appendChild(el);
const selected =
  document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
el.select();
document.execCommand('copy');
document.body.removeChild(el);
if (selected) {
  document.getSelection().removeAllRanges();
  document.getSelection().addRange(selected);
};

// 事例
copyToClipboard('Lorem ipsum');
// 'Lorem ipsum' copied to clipboard

// 23.如何确定页面的浏览器选项卡是否聚焦？
const isBrowserTabFocused = () => !document.hidden;

// 事例
isBrowserTabFocused(); // true

// 24.如何创建目录（如果不存在）？
const fs = require('fs');
const createDirIfNotExists = dir => (!fs.existsSync(dir) ? fs.mkdirSync(dir) : undefined);

// 事例
createDirIfNotExists('test');

```

# Regexp

```jsx
// 火车车次
let reg = /^[GCDZTSPKXLY1-9]\\d{1,4}$/
// 复制代码手机机身码(IMEI)
let reg = /^\\d{15,17}$/
// 复制代码必须带端口号的网址(或ip)
let reg = /^((ht|f)tps?:\\/\\/)?[\\w-]+(\\.[\\w-]+)+:\\d{1,5}\\/?$/
// 复制代码网址(url,支持端口和"?+参数"和"#+参数)
let reg = /^(((ht|f)tps?):\\/\\/)?[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?$/
// 复制代码统一社会信用代码
let reg = /^[0-9A-HJ-NPQRTUWXY]{2}\\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/
// 复制代码迅雷链接
let reg = /^thunderx?:\\/\\/[a-zA-Z\\d]+=$/
// 复制代码ed2k链接(宽松匹配)
let reg = /^ed2k:\\/\\/\\|file\\|.+\\|\\/$/
// 复制代码磁力链接(宽松匹配)
let reg = /^magnet:\\?xt=urn:btih:[0-9a-fA-F]{40,}.*$/
// 复制代码子网掩码
let reg = /^(?:\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(?:\\.(?:\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$/
// 复制代码linux"隐藏文件"路径
let reg = /^\\/(?:[^/]+\\/)*\\.[^/]*/
// 复制代码linux文件夹路径
let reg = /^\\/(?:[^/]+\\/)*$/
// 复制代码linux文件路径
let reg = /^\\/(?:[^/]+\\/)*[^/]+$/
// 复制代码window"文件夹"路径
let reg = /^[a-zA-Z]:\\\\(?:\\w+\\\\?)*$/
// 复制代码window下"文件"路径
let reg = /^[a-zA-Z]:\\\\(?:\\w+\\\\)*\\w+\\.\\w+$/
// 复制代码股票代码(A股)
let reg = /^(s[hz]|S[HZ])(000[\\d]{3}|002[\\d]{3}|300[\\d]{3}|600[\\d]{3}|60[\\d]{4})$/
// 复制代码大于等于0, 小于等于150, 支持小数位出现5, 如145.5, 用于判断考卷分数
let reg = /^150$|^(?:\\d|[1-9]\\d|1[0-4]\\d)(?:.5)?$/
// 复制代码html注释
let reg = /^<!--[\\s\\S]*?-->$/
// 复制代码md5格式(32位)
let reg = /^([a-f\\d]{32}|[A-F\\d]{32})$/
// 复制代码版本号(version)格式必须为X.Y.Z
let reg = /^\\d+(?:\\.\\d+){2}$/
// 复制代码视频(video)链接地址（视频格式可按需增删）
let reg = /^https?:\\/\\/(.+\\/)+.+(\\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4))$/i
// 复制代码图片(image)链接地址（图片格式可按需增删）
let reg = /^https?:\\/\\/(.+\\/)+.+(\\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i
// 复制代码24小时制时间（HH:mm:ss）
let reg = /^(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$/
// 复制代码12小时制时间（hh:mm:ss）
let reg = /^(?:1[0-2]|0?[1-9]):[0-5]\\d:[0-5]\\d$/
// 复制代码base64格式
let reg = /^\\s*data:(?:[a-z]+\\/[a-z0-9-+.]+(?:;[a-z-]+=[a-z0-9-]+)?)?(?:;base64)?,([a-z0-9!$&',()*+;=\\-._~:@/?%\\s]*?)\\s*$/i
// 复制代码数字/货币金额（支持负数、千分位分隔符）
let reg = /^-?\\d+(,\\d{3})*(\\.\\d{1,2})?$/
// 复制代码数字/货币金额 (只支持正数、不支持校验千分位分隔符)
let reg = /(?:^[1-9]([0-9]+)?(?:\\.[0-9]{1,2})?$)|(?:^(?:0){1}$)|(?:^[0-9]\\.[0-9](?:[0-9])?$)/
// 复制代码银行卡号（10到30位, 覆盖对公/私账户, 参考微信支付）
let reg = /^[1-9]\\d{9,29}$/
// 复制代码中文姓名
let reg = /^(?:[\\u4e00-\\u9fa5·]{2,16})$/
// 复制代码英文姓名
let reg = /(^[a-zA-Z]{1}[a-zA-Z\\s]{0,20}[a-zA-Z]{1}$)/
// 复制代码车牌号(新能源)
let reg = /[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(([0-9]{5}[DF])|([DF][A-HJ-NP-Z0-9][0-9]{4}))$/
// 复制代码车牌号(非新能源)
let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
// 复制代码车牌号(新能源+非新能源)
let reg = /^(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(?:(?:[0-9]{5}[DF])|(?:[DF](?:[A-HJ-NP-Z0-9])[0-9]{4})))|(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/
// 复制代码手机号(mobile phone)中国(严谨), 根据工信部2019年最新公布的手机号段
let reg = /^(?:(?:\\+|00)86)?1(?:(?:3[\\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\\d])|(?:9[1|8|9]))\\d{8}$/
// 复制代码手机号(mobile phone)中国(宽松), 只要是13,14,15,16,17,18,19开头即可
let reg = /^(?:(?:\\+|00)86)?1[3-9]\\d{9}$/
// 复制代码手机号(mobile phone)中国(最宽松), 只要是1开头即可, 如果你的手机号是用来接收短信, 优先建议选择这一条
let reg = /^(?:(?:\\+|00)86)?1\\d{10}$/
// 复制代码date(日期)
let reg = /^\\d{4}(-)(1[0-2]|0?\\d)\\1([0-2]\\d|\\d|30|31)$/
// 复制代码email(邮箱)
let reg = /^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/
// 复制代码座机(tel phone)电话(国内),如: 0341-86091234
let reg = /^\\d{3}-\\d{8}$|^\\d{4}-\\d{7,8}$/
// 复制代码身份证号(1代,15位数字)
let reg = /^[1-9]\\d{7}(?:0\\d|10|11|12)(?:0[1-9]|[1-2][\\d]|30|31)\\d{3}$/
// 复制代码身份证号(2代,18位数字),最后一位是校验位,可能为数字或字符X
let reg = /^[1-9]\\d{5}(?:18|19|20)\\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\\d|30|31)\\d{3}[\\dXx]$/
// 复制代码身份证号, 支持1/2代(15位/18位数字)
let reg = /(^\\d{8}(0\\d|10|11|12)([0-2]\\d|30|31)\\d{3}$)|(^\\d{6}(18|19|20)\\d{2}(0[1-9]|10|11|12)([0-2]\\d|30|31)\\d{3}(\\d|X|x)$)/
// 复制代码护照（包含香港、澳门）
let reg = /(^[EeKkGgDdSsPpHh]\\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\\d{7}$)/
// 复制代码帐号是否合法(字母开头，允许5-16字节，允许字母数字下划线组合
let reg = /^[a-zA-Z]\\w{4,15}$/
// 复制代码中文/汉字
let reg = /^(?:[\\u3400-\\u4DB5\\u4E00-\\u9FEA\\uFA0E\\uFA0F\\uFA11\\uFA13\\uFA14\\uFA1F\\uFA21\\uFA23\\uFA24\\uFA27-\\uFA29]|[\\uD840-\\uD868\\uD86A-\\uD86C\\uD86F-\\uD872\\uD874-\\uD879][\\uDC00-\\uDFFF]|\\uD869[\\uDC00-\\uDED6\\uDF00-\\uDFFF]|\\uD86D[\\uDC00-\\uDF34\\uDF40-\\uDFFF]|\\uD86E[\\uDC00-\\uDC1D\\uDC20-\\uDFFF]|\\uD873[\\uDC00-\\uDEA1\\uDEB0-\\uDFFF]|\\uD87A[\\uDC00-\\uDFE0])+$/
// 复制代码小数
let reg = /^\\d+\\.\\d+$/
// 复制代码数字
let reg = /^\\d{1,}$/
// 复制代码html标签(宽松匹配)
let reg = /<(\\w+)[^>]*>(.*?<\\/\\1>)?/
// 复制代码qq号格式正确
let reg = /^[1-9][0-9]{4,10}$/
// 复制代码数字和字母组成
let reg = /^[A-Za-z0-9]+$/
// 复制代码英文字母
let reg = /^[a-zA-Z]+$/
// 复制代码小写英文字母组成
let reg = /^[a-z]+$/
// 复制代码大写英文字母
let reg = /^[A-Z]+$/
// 复制代码密码强度校验，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
let reg = /^\\S*(?=\\S{6,})(?=\\S*\\d)(?=\\S*[A-Z])(?=\\S*[a-z])(?=\\S*[!@#$%^&*? ])\\S*$/
// 复制代码用户名校验，4到16位（字母，数字，下划线，减号）
let reg = /^[a-zA-Z0-9_-]{4,16}$/
// 复制代码ip-v4
let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
// 复制代码ip-v6
let reg = /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b)\\.){3}(\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b)\\.){3}(\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b)\\.){3}(\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i
// 复制代码16进制颜色
let reg = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
// 复制代码微信号(wx)，6至20位，以字母开头，字母，数字，减号，下划线
let reg = /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/
// 复制代码邮政编码(中国)
let reg = /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\\d{4}$/
// 复制代码中文和数字
let reg = /^((?:[\\u3400-\\u4DB5\\u4E00-\\u9FEA\\uFA0E\\uFA0F\\uFA11\\uFA13\\uFA14\\uFA1F\\uFA21\\uFA23\\uFA24\\uFA27-\\uFA29]|[\\uD840-\\uD868\\uD86A-\\uD86C\\uD86F-\\uD872\\uD874-\\uD879][\\uDC00-\\uDFFF]|\\uD869[\\uDC00-\\uDED6\\uDF00-\\uDFFF]|\\uD86D[\\uDC00-\\uDF34\\uDF40-\\uDFFF]|\\uD86E[\\uDC00-\\uDC1D\\uDC20-\\uDFFF]|\\uD873[\\uDC00-\\uDEA1\\uDEB0-\\uDFFF]|\\uD87A[\\uDC00-\\uDFE0])|(\\d))+$/
// 复制代码不能包含字母
let reg = /^[^A-Za-z]*$/
// 复制代码java包名
let reg = /^([a-zA-Z_][a-zA-Z0-9_]*)+([.][a-zA-Z_][a-zA-Z0-9_]*)+$/
// 复制代码mac地址
let reg = /^((([a-f0-9]{2}:){5})|(([a-f0-9]{2}-){5}))[a-f0-9]{2}$/i
// 复制代码匹配连续重复的字符
let reg = /(.)\\1+/
```



# JSArrayUseMethods

## **数组**

先来看使用数组中常用的一些小技巧。

### **数组去重**

ES6提供了几种简洁的数组去重的方法，但该方法并不适合处理非基本类型的数组。对于基本类型的数组去重，可以使用`... new Set()`来过滤掉数组中重复的值，创建一个只有唯一值的新数组。

```
const array = [1, 1, 2, 3, 5, 5, 1]
const uniqueArray = [...new Set(array)];
console.log(uniqueArray); 

> Result:(4) [1, 2, 3, 5]
```

这是ES6中的新特性，在ES6之前，要实现同样的效果，我们需要使用更多的代码。该技巧适用于包含基本类型的数组：`undefined`、`null`、`boolean`、`string`和`number`。如果数组中包含了一个`object`,`function`或其他数组，那就需要使用另一种方法。

除了上面的方法之外，还可以使用`Array.from(new Set())`来实现：

```
const array = [1, 1, 2, 3, 5, 5, 1]
Array.from(new Set(array))
> Result:(4) [1, 2, 3, 5]
```

另外，还可以使用`Array`的`.filter`及`indexOf()`来实现：

```
const array = [1, 1, 2, 3, 5, 5, 1]
array.filter((arr, index) => array.indexOf(arr) === index)

> Result:(4) [1, 2, 3, 5]
```

注意，`indexOf()`方法将返回数组中第一个出现的数组项。这就是为什么我们可以在每次迭代中将`indexOf()`方法返回的索引与当索索引进行比较，以确定当前项是否重复。

### **确保数组的长度**

在处理网格结构时，如果原始数据每行的长度不相等，就需要重新创建该数据。为了确保每行的数据长度相等，可以使用`Array.fill`来处理：

```
let array = Array(5).fill('');
console.log(array); 

> Result: (5) ["", "", "", "", ""]
```

### **数组映射**

不使用`Array.map`来映射数组值的方法。

```
const array = [
    {
        name: '大漠',
        email: 'w3cplus@hotmail.com'
    },
    {
        name: 'Airen',
        email: 'airen@gmail.com'
    }
]

const name = Array.from(array, ({ name }) => name)

> Result: (2) ["大漠", "Airen"]
```

### **数组截断**

如果你想从数组末尾删除值（删除数组中的最后一项），有比使用`splice()`更快的替代方法。

例如，你知道原始数组的大小，可以重新定义数组的`length`属性的值，就可以实现从数组末尾删除值：

```
let array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(array.length)
> Result: 10

array.length = 4
console.log(array)
> Result: (4) [0, 1, 2, 3]
```

这是一个特别简洁的解决方案。但是，`slice()`方法运行更快，性能更好：

```
let array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
array = array.slice(0, 4);

console.log(array); 
> Result: [0, 1, 2, 3]
```

### **过滤掉数组中的falsy值**

如果你想过滤数组中的**falsy**值，比如`0`、`undefined`、`null`、`false`，那么可以通过`map`和`filter`方法实现：

```
const array = [0, 1, '0', '1', '大漠', 'w3cplus.com', undefined, true, false, null, 'undefined', 'null', NaN, 'NaN', '1' + 0]
array.map(item => {
    return item
}).filter(Boolean)

> Result: (10) [1, "0", "1", "大漠", "w3cplus.com", true, "undefined", "null", "NaN", "10"]
```

### **获取数组的最后一项**

数组的`slice()`取值为正值时，从数组的开始处截取数组的项，如果取值为负整数时，可以从数组末属开始获取数组项。

```
let array = [1, 2, 3, 4, 5, 6, 7]

const firstArrayVal = array.slice(0, 1)
> Result: [1]

const lastArrayVal = array.slice(-1)
> Result: [7]

console.log(array.slice(1))
> Result: (6) [2, 3, 4, 5, 6, 7]

console.log(array.slice(array.length))
> Result: []
```

正如上面示例所示，使用`array.slice(-1)`获取数组的最后一项，除此之外还可以使用下面的方式来获取数组的最后一项：

```
console.log(array.slice(array.length - 1))
> Result: [7]
```

### **过滤并排序字符串列表**

你可能有一个很多名字组成的列表，需要过滤掉重复的名字并按字母表将其排序。

在我们的例子里准备用不同版本语言的JavaScript 保留字的列表，但是你能发现，有很多重复的关键字而且它们并没有按字母表顺序排列。所以这是一个完美的字符串列表(数组)来测试我们的JavaScript小知识。

```
var keywords = ['do', 'if', 'in', 'for', 'new', 'try', 'var', 'case', 'else', 'enum', 'null', 'this', 'true', 'void', 'with', 'break', 'catch', 'class', 'const', 'false', 'super', 'throw', 'while', 'delete', 'export', 'import', 'return', 'switch', 'typeof', 'default', 'extends', 'finally', 'continue', 'debugger', 'function', 'do', 'if', 'in', 'for', 'int', 'new', 'try', 'var', 'byte', 'case', 'char', 'else', 'enum', 'goto', 'long', 'null', 'this', 'true', 'void', 'with', 'break', 'catch', 'class', 'const', 'false', 'final', 'float', 'short', 'super', 'throw', 'while', 'delete', 'double', 'export', 'import', 'native', 'public', 'return', 'static', 'switch', 'throws', 'typeof', 'boolean', 'default', 'extends', 'finally', 'package', 'private', 'abstract', 'continue', 'debugger', 'function', 'volatile', 'interface', 'protected', 'transient', 'implements', 'instanceof', 'synchronized', 'do', 'if', 'in', 'for', 'let', 'new', 'try', 'var', 'case', 'else', 'enum', 'eval', 'null', 'this', 'true', 'void', 'with', 'break', 'catch', 'class', 'const', 'false', 'super', 'throw', 'while', 'yield', 'delete', 'export', 'import', 'public', 'return', 'static', 'switch', 'typeof', 'default', 'extends', 'finally', 'package', 'private', 'continue', 'debugger', 'function', 'arguments', 'interface', 'protected', 'implements', 'instanceof', 'do', 'if', 'in', 'for', 'let', 'new', 'try', 'var', 'case', 'else', 'enum', 'eval', 'null', 'this', 'true', 'void', 'with', 'await', 'break', 'catch', 'class', 'const', 'false', 'super', 'throw', 'while', 'yield', 'delete', 'export', 'import', 'public', 'return', 'static', 'switch', 'typeof', 'default', 'extends', 'finally', 'package', 'private', 'continue', 'debugger', 'function', 'arguments', 'interface', 'protected', 'implements', 'instanceof'];
```

因为我们不想改变我们的原始列表，所以我们准备用高阶函数叫做`filter`，它将基于我们传递的回调方法返回一个新的过滤后的数组。回调方法将比较当前关键字在原始列表里的索引和新列表中的索引，仅当索引匹配时将当前关键字push到新数组。

最后我们准备使用`sort`方法排序过滤后的列表，sort只接受一个比较方法作为参数，并返回按字母表排序后的列表。

在ES6下使用箭头函数看起来更简单:

```
const filteredAndSortedKeywords = keywords
    .filter((keyword, index) => keywords.lastIndexOf(keyword) === index)
    .sort((a, b) => a < b ? -1 : 1);
```

这是最后过滤和排序后的JavaScript保留字列表：

```
console.log(filteredAndSortedKeywords);

> Result: ['abstract', 'arguments', 'await', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else', 'enum', 'eval', 'export', 'extends', 'false', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 'yield']
```

### **清空数组**

如果你定义了一个数组，然后你想清空它。 通常，你会这样做：

```
let array = [1, 2, 3, 4];
function emptyArray() {
    array = [];
}
emptyArray();
```

但是，这有一个效率更高的方法来清空数组。 你可以这样写:

```
let array = [1, 2, 3, 4];
function emptyArray() {
    array.length = 0;
}
emptyArray();
```

### **拍平多维数组**

使用`...`运算符，将多维数组拍平：

```
const arr = [1, [2, '大漠'], 3, ['blog', '1', 2, 3]]
const flatArray = [].concat(...arr)

console.log(flatArray)
> Result: (8) [1, 2, "大漠", 3, "blog", "1", 2, 3]
```

不过上面的方法只适用于二维数组。不过通过递归调用，可以使用它适用于二维以下的数组：

```
function flattenArray(arr) {  
    const flattened = [].concat(...arr);  
    return flattened.some(item => Array.isArray(item)) ? flattenArray(flattened) : flattened;
}

const array = [1, [2, '大漠'], 3, [['blog', '1'], 2, 3]]
const flatArr = flattenArray(array)
console.log(flatArr)
> Result: (8) [1, 2, "大漠", 3, "blog", "1", 2, 3]
```

### **从数组中获取最大值和最小值**

可以使用`Math.max`和`Math.min`取出数组中的最大小值和最小值：

```
const numbers = [15, 80, -9, 90, -99]
const maxInNumbers = Math.max.apply(Math, numbers)
const minInNumbers = Math.min.apply(Math, numbers)

console.log(maxInNumbers)
> Result: 90

console.log(minInNumbers)
> Result: -99
```

另外还可以使用ES6的`...`运算符来完成：

```
const numbers = [1, 2, 3, 4];
Math.max(...numbers) 
> Result: 4

Math.min(...numbers) 
> > Result: 1
```

## **对象**

在操作对象时也有一些小技巧。

### **使用`...`运算符合并对象或数组中的对象**

同样使用ES的`...`运算符可以替代人工操作，合并对象或者合并数组中的对象。

```
// 合并对象
const obj1 = {
    name: '大漠',
    url: 'w3cplus.com'
}

const obj2 = {
    name: 'airen',
    age: 30
}

const mergingObj = {...obj1, ...obj2}

> Result: {name: "airen", url: "w3cplus.com", age: 30}

// 合并数组中的对象
const array = [
    {
        name: '大漠',
        email: 'w3cplus@gmail.com'
    },
    {
        name: 'Airen',
        email: 'airen@gmail.com'
    }
]

const result = array.reduce((accumulator, item) => {
    return {
        ...accumulator,
        [item.name]: item.email
    }
}, {})

> Result: {大漠: "w3cplus@gmail.com", Airen: "airen@gmail.com"}
```

### **有条件的添加对象属性**

不再需要根据一个条件创建两个不同的对象，以使它具有特定的属性。为此，使用`...`操作符是最简单的。

```
const getUser = (emailIncluded) => {
    return {
        name: '大漠',
        blog: 'w3cplus',
        ...emailIncluded && {email: 'w3cplus@hotmail.com'}
    }
}

const user = getUser(true)
console.log(user)
> Result: {name: "大漠", blog: "w3cplus", email: "w3cplus@hotmail.com"}

const userWithoutEmail = getUser(false)
console.log(userWithoutEmail)
> Result: {name: "大漠", blog: "w3cplus"}
```

### **解构原始数据**

你可以在使用数据的时候，把所有数据都放在一个对象中。同时想在这个数据对象中获取自己想要的数据。在这里可以使用ES6的Destructuring特性来实现。比如你想把下面这个`obj`中的数据分成两个部分：

```
const obj = {
    name: '大漠',
    blog: 'w3cplus',
    email: 'w3cplus@hotmail.com',
    joined: '2019-06-19',
    followers: 45
}

let user = {}, userDetails = {}

({name: user.name, email: user.email, ...userDetails} = obj)
> {name: "大漠", blog: "w3cplus", email: "w3cplus@hotmail.com", joined: "2019-06-19", followers: 45}

console.log(user)
> Result: {name: "大漠", email: "w3cplus@hotmail.com"}

console.log(userDetails)
> Result: {blog: "w3cplus", joined: "2019-06-19", followers: 45}
```

### **动态更改对象的key**

在过去，我们首先必须声明一个对象，然后在需要动态属性名的情况下分配一个属性。在以前，这是不可能以声明的方式实现的。不过在ES6中，我们可以实现：

```
const dynamicKey = 'email'

let obj = {
    name: '大漠',
    blog: 'w3cplus',
    [dynamicKey]: 'w3cplus@hotmail.com'
}

console.log(obj)
> Result: {name: "大漠", blog: "w3cplus", email: "w3cplus@hotmail.com"}
```

### **判断对象的数据类型**

使用`Object.prototype.toString`配合闭包来实现对象数据类型的判断：

```
const isType = type => target => `[object ${type}]` === Object.prototype.toString.call(target)
const isArray = isType('Array')([1, 2, 3])

console.log(isArray)
> Result: true
```

上面的代码相当于：

```
function isType(type){
    return function (target) {
        return `[object ${type}]` === Object.prototype.toString.call(target)
    }
}

isType('Array')([1,2,3])
> Result: true
```

或者：

```
const isType = type => target => `[object ${type}]` === Object.prototype.toString.call(target)
const isString = isType('String')
const res = isString(('1'))

console.log(res)
> Result: true
```

### **检查某对象是否有某属性**

当你需要检查某属性是否存在于一个对象，你可能会这样做：

```
var obj = {
    name: '大漠'
};

if (obj.name) { 
    console.log(true) // > Result: true
}
```

这是可以的，但是你需要知道有两种原生方法可以解决此类问题。`in` 操作符 和 `Object.hasOwnProperty`，任何继承自`Object`的对象都可以使用这两种方法。

```
var obj = {
    name: '大漠'
};

obj.hasOwnProperty('name');     // > true
'name' in obj;                  // > true

obj.hasOwnProperty('valueOf');  // > false, valueOf 继承自原型链
'valueOf' in obj;               // > true
```

两者检查属性的深度不同，换言之`hasOwnProperty`只在本身有此属性时返回`true`,而`in`操作符不区分属性来自于本身或继承自原型链。

这是另一个例子:

```
var myFunc = function() {
    this.name = '大漠';
};

myFunc.prototype.age = '10 days';
var user = new myFunc();

user.hasOwnProperty('name'); 
> Result: true

user.hasOwnProperty('age'); 
> Result: false, 因为age来自于原型链
```

### **创造一个纯对象**

使用`Object.create(null)`可以创建一个纯对象，它不会从`Object`类继承任何方法（例如：构造函数、`toString()` 等）：

```
const pureObject = Object.create(null);

console.log(pureObject);                //=> {}
console.log(pureObject.constructor);    //=> undefined
console.log(pureObject.toString);       //=> undefined
console.log(pureObject.hasOwnProperty); //=> undefined
```

## **数据类型转换**

JavaScript中数据类型有`Number`、`String`、`Boolean`、`Object`、`Array`和`Function`等，在实际使用时会碰到数据类型的转换。在转换数据类型时也有一些小技巧。

### **转换为布尔值**

布尔值除了`true`和`false`之外，JavaScript还可以将所有其他值视为“**真实的**”或“**虚假的**”。除非另有定义，JavaScript中除了`0`、`''`、`null`、`undefined`、`NaN`和`false`之外的值都是**真实的**。

我们可以很容易地在真和假之间使用`!`运算符进行切换，它也会将类型转换为`Boolean`。比如：

```
const isTrue = !0;
const isFasle = !1;
const isFasle = !!0 // !0 => true，true的反即是false

console.log(isTrue)
> Result: true

console.log(typeof isTrue)
> Result: 'boolean'
```

这种类型的转换在条件语句中非常方便，比如将`!1`当作`false`。

### **转换为字符串**

我们可以使用运算符`+`后紧跟一组空的引号`''`快速地将数字或布尔值转为字符串：

```
const val = 1 + ''
const val2 = false + ''

console.log(val)
>  Result: "1"

console.log(typeof val)
> Result: "string"

console.log(val2)
> Result: "false"

console.log(typeof val2)
> Result: "string"
```

### **转换为数值**

上面我们看到了，使用`+`紧跟一个空的字符串`''`就可以将数值转换为字符串。相反的，使用加法运算符`+`可以快速实现相反的效果。

```
let int = '12'
int = +int

console.log(int)
> Result: 12

console.log(typeof int)
> Result: 'number'
```

用同样的方法可以将布尔值转换为数值：

```
console.log(+true)
> Return: 1

console.log(+false)
> Return: 0
```

在某些上下文中，`+`会被解释为**连接操作符**，而不是**加法**运算符。当这种情况发生时，希望返回一个整数，而不是浮点数，那么可以使用两个波浪号`~~`。双波浪号`~~`被称为**按位不运算符**，它和`-n \\- 1`等价。例如， `~15 = \\-16`。这是因为`- (-n \\- 1) \\- 1 = n + 1 \\- 1 = n`。换句话说，`~ \\- 16 = 15`。

我们也可以使用`~~`将数字字符串转换成整数型：

```
const int = ~~'15'

console.log(int)
> Result: 15

console.log(typeof int)
> Result: 'number'
```

同样的，`NOT`操作符也可以用于布尔值： `~true = \\-2`，`~false = \\-1`。

### **浮点数转换为整数**

平常都会使用`Math.floor()`、`Math.ceil()`或`Math.round()`将浮点数转换为整数。在JavaScript中还有一种更快的方法，即使用`|`（位或运算符）将浮点数截断为整数。

```
console.log(23.9 | 0);  
> Result: 23

console.log(-23.9 | 0); 
> Result: -23
```

`|`的行为取决于处理的是正数还是负数，所以最好只在确定的情况下使用这个快捷方式。

如果`n`是正数，则`n | 0`有效地向下舍入。如果`n`是负数，它有效地四舍五入。更准确的说，该操作删除小数点后的内容，将浮点数截断为整数。还可以使用`~~`来获得相同的舍入效果，如上所述，实际上任何位操作符都会强制浮点数为整数。这些特殊操作之所以有效，是因为一旦强制为整数，值就保持不变。

`|`还可以用于从整数的末尾删除任意数量的数字。这意味着我们不需要像下面这样来转换类型：

```
let str = "1553"; 
Number(str.substring(0, str.length - 1));
> Result: 155
```

我们可以像下面这样使用`|`运算符来替代：

```
console.log(1553 / 10   | 0)  
> Result: 155

console.log(1553 / 100  | 0)  
> Result: 15

console.log(1553 / 1000 | 0)  
> Result: 1
```

### **使用`!!`操作符转换布尔值**

有时候我们需要对一个变量查检其是否存在或者检查值是否有一个有效值，如果存在就返回`true`值。为了做这样的验证，我们可以使用`!!`操作符来实现是非常的方便与简单。对于变量可以使用`!!variable`做检测，只要变量的值为:`0`、`null`、`" "`、`undefined`或者`NaN`都将返回的是`false`，反之返回的是`true`。比如下面的示例：

```
function Account(cash) {
    this.cash = cash;
    this.hasMoney = !!cash;
}

var account = new Account(100.50);
console.log(account.cash); 
> Result: 100.50

console.log(account.hasMoney); 
> Result: true

var emptyAccount = new Account(0);
console.log(emptyAccount.cash); 
> Result: 0

console.log(emptyAccount.hasMoney); 
> Result: false
```

在这个示例中，只要`account.cash`的值大于`0`，那么`account.hasMoney`返回的值就是`true`。

还可以使用`!!`操作符将**truthy**或**falsy**值转换为布尔值：

```
!!""        // > false
!!0         // > false
!!null      // > false
!!undefined  // > false
!!NaN       // > false

!!"hello"   // > true
!!1         // > true
!!{}        // > true
!![]        // > true
```



# JavaScript工具函数大全

# **为元素添加on方法**

```
Element.prototype.on = Element.prototype.addEventListener;

NodeList.prototype.on = function (event, fn) {、
    []['forEach'].call(this, function (el) {
        el.on(event, fn);
    });
    return this;
};
```

# **为元素添加trigger方法**

```
Element.prototype.trigger = function(type, data) {
  var event = document.createEvent("HTMLEvents");
  event.initEvent(type, true, true);
  event.data = data || {};
  event.eventName = type;
  event.target = this;
  this.dispatchEvent(event);
  return this;
};

NodeList.prototype.trigger = function(event) {
  []["forEach"].call(this, function(el) {
    el["trigger"](event);
  });
  return this;
};
```

# **转义html标签**

```
function HtmlEncode(text) {
  return text
    .replace(/&/g, "&")
    .replace(/\\"/g, '"')
    .replace(/</g, "<")
    .replace(/>/g, ">");
}
```

# **HTML标签转义**

```
// HTML 标签转义
// @param {Array.<DOMString>} templateData 字符串类型的tokens
// @param {...} ..vals 表达式占位符的运算结果tokens
//
function SaferHTML(templateData) {
  var s = templateData[0];
  for (var i = 1; i < arguments.length; i++) {
    var arg = String(arguments[i]);
    // Escape special characters in the substitution.
    s += arg
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    // Don't escape special characters in the template.
    s += templateData[i];
  }
  return s;
}
// 调用
var html = SaferHTML`<p>这是关于字符串模板的介绍</p>`;
```

# **跨浏览器绑定事件**

```
function addEventSamp(obj, evt, fn) {
  if (!oTarget) {
    return;
  }
  if (obj.addEventListener) {
    obj.addEventListener(evt, fn, false);
  } else if (obj.attachEvent) {
    obj.attachEvent("on" + evt, fn);
  } else {
    oTarget["on" + sEvtType] = fn;
  }
}
```

# **加入收藏夹**

```
function addFavorite(sURL, sTitle) {
  try {
    window.external.addFavorite(sURL, sTitle);
  } catch (e) {
    try {
      window.sidebar.addPanel(sTitle, sURL, "");
    } catch (e) {
      alert("加入收藏失败，请使用Ctrl+D进行添加");
    }
  }
}
```

# **提取页面代码中所有网址**

```
var aa = document.documentElement.outerHTML
  .match(
    /(url\\(|src=|href=)[\\"\\']*([^\\"\\'\\(\\)\\<\\>\\[\\] ]+)[\\"\\'\\)]*|(http:\\/\\/[\\w\\-\\.]+[^\\"\\'\\(\\)\\<\\>\\[\\] ]+)/gi
  )
  .join("\\r\\n")
  .replace(/^(src=|href=|url\\()[\\"\\']*|[\\"\\'\\>\\) ]*$/gim, "");
alert(aa);
```

# **动态加载脚本文件**

```
function appendscript(src, text, reload, charset) {
  var id = hash(src + text);
  if (!reload && in_array(id, evalscripts)) return;
  if (reload && $(id)) {
    $(id).parentNode.removeChild($(id));
  }

  evalscripts.push(id);
  var scriptNode = document.createElement("script");
  scriptNode.type = "text/javascript";
  scriptNode.id = id;
  scriptNode.charset = charset
    ? charset
    : BROWSER.firefox
    ? document.characterSet
    : document.charset;
  try {
    if (src) {
      scriptNode.src = src;
      scriptNode.onloadDone = false;
      scriptNode.onload = function() {
        scriptNode.onloadDone = true;
        JSLOADED[src] = 1;
      };
      scriptNode.onreadystatechange = function() {
        if (
          (scriptNode.readyState == "loaded" ||
            scriptNode.readyState == "complete") &&
          !scriptNode.onloadDone
        ) {
          scriptNode.onloadDone = true;
          JSLOADED[src] = 1;
        }
      };
    } else if (text) {
      scriptNode.text = text;
    }
    document.getElementsByTagName("head")[0].appendChild(scriptNode);
  } catch (e) {}
}
```

# **返回顶部的通用方法**

```
function backTop(btnId) {
  var btn = document.getElementById(btnId);
  var d = document.documentElement;
  var b = document.body;
  window.onscroll = set;
  btn.style.display = "none";
  btn.onclick = function() {
    btn.style.display = "none";
    window.onscroll = null;
    this.timer = setInterval(function() {
      d.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
      b.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
      if (d.scrollTop + b.scrollTop == 0)
        clearInterval(btn.timer, (window.onscroll = set));
    }, 10);
  };
  function set() {
    btn.style.display = d.scrollTop + b.scrollTop > 100 ? "block" : "none";
  }
}
backTop("goTop");
```

# **实现base64解码**

```
function base64_decode(data) {
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var o1,
    o2,
    o3,
    h1,
    h2,
    h3,
    h4,
    bits,
    i = 0,
    ac = 0,
    dec = "",
    tmp_arr = [];
  if (!data) {
    return data;
  }
  data += "";
  do {
    h1 = b64.indexOf(data.charAt(i++));
    h2 = b64.indexOf(data.charAt(i++));
    h3 = b64.indexOf(data.charAt(i++));
    h4 = b64.indexOf(data.charAt(i++));
    bits = (h1 << 18) | (h2 << 12) | (h3 << 6) | h4;
    o1 = (bits >> 16) & 0xff;
    o2 = (bits >> 8) & 0xff;
    o3 = bits & 0xff;
    if (h3 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1);
    } else if (h4 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1, o2);
    } else {
      tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
    }
  } while (i < data.length);
  dec = tmp_arr.join("");
  dec = utf8_decode(dec);
  return dec;
}
```

# **确认是否是键盘有效输入值**

```
function checkKey(iKey) {
  if (iKey == 32 || iKey == 229) {
    return true;
  } /*空格和异常*/
  if (iKey > 47 && iKey < 58) {
    return true;
  } /*数字*/
  if (iKey > 64 && iKey < 91) {
    return true;
  } /*字母*/
  if (iKey > 95 && iKey < 108) {
    return true;
  } /*数字键盘1*/
  if (iKey > 108 && iKey < 112) {
    return true;
  } /*数字键盘2*/
  if (iKey > 185 && iKey < 193) {
    return true;
  } /*符号1*/
  if (iKey > 218 && iKey < 223) {
    return true;
  } /*符号2*/
  return false;
}
```

# **全角半角转换**

```
//iCase: 0全到半，1半到全，其他不转化
function chgCase(sStr, iCase) {
  if (
    typeof sStr != "string" ||
    sStr.length <= 0 ||
    !(iCase === 0 || iCase == 1)
  ) {
    return sStr;
  }
  var i,
    oRs = [],
    iCode;
  if (iCase) {
    /*半->全*/
    for (i = 0; i < sStr.length; i += 1) {
      iCode = sStr.charCodeAt(i);
      if (iCode == 32) {
        iCode = 12288;
      } else if (iCode < 127) {
        iCode += 65248;
      }
      oRs.push(String.fromCharCode(iCode));
    }
  } else {
    /*全->半*/
    for (i = 0; i < sStr.length; i += 1) {
      iCode = sStr.charCodeAt(i);
      if (iCode == 12288) {
        iCode = 32;
      } else if (iCode > 65280 && iCode < 65375) {
        iCode -= 65248;
      }
      oRs.push(String.fromCharCode(iCode));
    }
  }
  return oRs.join("");
}
```

# **版本对比**

```
function compareVersion(v1, v2) {
  v1 = v1.split(".");
  v2 = v2.split(".");

  var len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push("0");
  }

  while (v2.length < len) {
    v2.push("0");
  }

  for (var i = 0; i < len; i++) {
    var num1 = parseInt(v1[i]);
    var num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }
  return 0;
}
```

# **压缩CSS样式代码**

```
function compressCss(s) {
  //压缩代码
  s = s.replace(/\\/\\*(.|\\n)*?\\*\\//g, ""); //删除注释
  s = s.replace(/\\s*([\\{\\}\\:\\;\\,])\\s*/g, "$1");
  s = s.replace(/\\,[\\s\\.\\#\\d]*\\{/g, "{"); //容错处理
  s = s.replace(/;\\s*;/g, ";"); //清除连续分号
  s = s.match(/^\\s*(\\S+(\\s+\\S+)*)\\s*$/); //去掉首尾空白
  return s == null ? "" : s[1];
}
```

# **获取当前路径**

```
var currentPageUrl = "";
if (typeof this.href === "undefined") {
  currentPageUrl = document.location.toString().toLowerCase();
} else {
  currentPageUrl = this.href.toString().toLowerCase();
}
```

# **字符串长度截取**

```
function cutstr(str, len) {
    var temp,
        icount = 0,
        patrn = /[^\\x00-\\xff]/，
        strre = "";
    for (var i = 0; i < str.length; i++) {
        if (icount < len - 1) {
            temp = str.substr(i, 1);
                if (patrn.exec(temp) == null) {
                   icount = icount + 1
            } else {
                icount = icount + 2
            }
            strre += temp
            } else {
            break;
        }
    }
    return strre + "..."
}
```

# **时间日期格式转换**

```
Date.prototype.format = function(formatStr) {
  var str = formatStr;
  var Week = ["日", "一", "二", "三", "四", "五", "六"];
  str = str.replace(/yyyy|YYYY/, this.getFullYear());
  str = str.replace(
    /yy|YY/,
    this.getYear() % 100 > 9
      ? (this.getYear() % 100).toString()
      : "0" + (this.getYear() % 100)
  );
  str = str.replace(
    /MM/,
    this.getMonth() + 1 > 9
      ? (this.getMonth() + 1).toString()
      : "0" + (this.getMonth() + 1)
  );
  str = str.replace(/M/g, this.getMonth() + 1);
  str = str.replace(/w|W/g, Week[this.getDay()]);
  str = str.replace(
    /dd|DD/,
    this.getDate() > 9 ? this.getDate().toString() : "0" + this.getDate()
  );
  str = str.replace(/d|D/g, this.getDate());
  str = str.replace(
    /hh|HH/,
    this.getHours() > 9 ? this.getHours().toString() : "0" + this.getHours()
  );
  str = str.replace(/h|H/g, this.getHours());
  str = str.replace(
    /mm/,
    this.getMinutes() > 9
      ? this.getMinutes().toString()
      : "0" + this.getMinutes()
  );
  str = str.replace(/m/g, this.getMinutes());
  str = str.replace(
    /ss|SS/,
    this.getSeconds() > 9
      ? this.getSeconds().toString()
      : "0" + this.getSeconds()
  );
  str = str.replace(/s|S/g, this.getSeconds());
  return str;
};

// 或
Date.prototype.format = function(format) {
  var o = {
    "M+": this.getMonth() + 1, //month
    "d+": this.getDate(), //day
    "h+": this.getHours(), //hour
    "m+": this.getMinutes(), //minute
    "s+": this.getSeconds(), //second
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
    S: this.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format))
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  }
  return format;
};
alert(new Date().format("yyyy-MM-dd hh:mm:ss"));
```

# **跨浏览器删除事件**

```
function delEvt(obj, evt, fn) {
  if (!obj) {
    return;
  }
  if (obj.addEventListener) {
    obj.addEventListener(evt, fn, false);
  } else if (oTarget.attachEvent) {
    obj.attachEvent("on" + evt, fn);
  } else {
    obj["on" + evt] = fn;
  }
}
```

# **判断是否以某个字符串结束**

```
String.prototype.endWith = function(s) {
  var d = this.length - s.length;
  return d >= 0 && this.lastIndexOf(s) == d;
};
```

# **返回脚本内容**

```
function evalscript(s) {
  if (s.indexOf("<script") == -1) return s;
  var p = /<script[^\\>]*?>([^\\x00]*?)<\\/script>/gi;
  var arr = [];
  while ((arr = p.exec(s))) {
    var p1 = /<script[^\\>]*?src=\\"([^\\>]*?)\\"[^\\>]*?(reload=\\"1\\")?(?:charset=\\"([\\w\\-]+?)\\")?><\\/script>/i;
    var arr1 = [];
    arr1 = p1.exec(arr[0]);
    if (arr1) {
      appendscript(arr1[1], "", arr1[2], arr1[3]);
    } else {
      p1 = /<script(.*?)>([^\\x00]+?)<\\/script>/i;
      arr1 = p1.exec(arr[0]);
      appendscript("", arr1[2], arr1[1].indexOf("reload=") != -1);
    }
  }
  return s;
}
```

# **格式化CSS样式代码**

```
function formatCss(s) {
  //格式化代码
  s = s.replace(/\\s*([\\{\\}\\:\\;\\,])\\s*/g, "$1");
  s = s.replace(/;\\s*;/g, ";"); //清除连续分号
  s = s.replace(/\\,[\\s\\.\\#\\d]*{/g, "{");
  s = s.replace(/([^\\s])\\{([^\\s])/g, "$1 {\\n\\t$2");
  s = s.replace(/([^\\s])\\}([^\\n]*)/g, "$1\\n}\\n$2");
  s = s.replace(/([^\\s]);([^\\s\\}])/g, "$1;\\n\\t$2");
  return s;
}
```

# **获取cookie值**

```
function getCookie(name) {
  var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
  if (arr != null) return unescape(arr[2]);
  return null;
}
```

# **获得URL中GET参数值**

```
// 用法：如果地址是 test.htm?t1=1&t2=2&t3=3, 那么能取得：GET["t1"], GET["t2"], GET["t3"]
function getGet() {
  querystr = window.location.href.split("?");
  if (querystr[1]) {
    GETs = querystr[1].split("&");
    GET = [];
    for (i = 0; i < GETs.length; i++) {
      tmp_arr = GETs.split("=");
      key = tmp_arr[0];
      GET[key] = tmp_arr[1];
    }
  }
  return querystr[1];
}
```

# **获取移动设备初始化大小**

```
function getInitZoom() {
  if (!this._initZoom) {
    var screenWidth = Math.min(screen.height, screen.width);
    if (this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()) {
      screenWidth = screenWidth / window.devicePixelRatio;
    }
    this._initZoom = screenWidth / document.body.offsetWidth;
  }
  return this._initZoom;
}
```

# **获取页面高度**

```
function getPageHeight() {
  var g = document,
    a = g.body,
    f = g.documentElement,
    d = g.compatMode == "BackCompat" ? a : g.documentElement;
  return Math.max(f.scrollHeight, a.scrollHeight, d.clientHeight);
}
```

# **获取页面scrollLeft**

```
function getPageScrollLeft() {
  var a = document;
  return a.documentElement.scrollLeft || a.body.scrollLeft;
}
```

# **获取页面scrollTop**

```
function getPageScrollTop() {
  var a = document;
  return a.documentElement.scrollTop || a.body.scrollTop;
}
```

# **获取页面可视高度**

```
function getPageViewHeight() {
  var d = document,
    a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
  return a.clientHeight;
}
```

# **获取页面可视宽度**

```
function getPageViewWidth() {
  var d = document,
    a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
  return a.clientWidth;
}
```

# **获取页面宽度**

```
function getPageWidth() {
  var g = document,
    a = g.body,
    f = g.documentElement,
    d = g.compatMode == "BackCompat" ? a : g.documentElement;
  return Math.max(f.scrollWidth, a.scrollWidth, d.clientWidth);
}
```

# **获取移动设备屏幕宽度**

```
function getScreenWidth() {
  var smallerSide = Math.min(screen.width, screen.height);
  var fixViewPortsExperiment =
    rendererModel.runningExperiments.FixViewport ||
    rendererModel.runningExperiments.fixviewport;
  var fixViewPortsExperimentRunning =
    fixViewPortsExperiment && fixViewPortsExperiment.toLowerCase() === "new";
  if (fixViewPortsExperiment) {
    if (this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()) {
      smallerSide = smallerSide / window.devicePixelRatio;
    }
  }
  return smallerSide;
}
```

# **获取网页被卷去的位置**

```
function getScrollXY() {
  return document.body.scrollTop
    ? {
        x: document.body.scrollLeft,
        y: document.body.scrollTop
      }
    : {
        x: document.documentElement.scrollLeft,
        y: document.documentElement.scrollTop
      };
}
```

# **获取URL上的参数**

```
// 获取URL中的某参数值,不区分大小写
// 获取URL中的某参数值,不区分大小写,
// 默认是取'hash'里的参数，
// 如果传其他参数支持取‘search’中的参数
// @param {String} name 参数名称
export function getUrlParam(name, type = "hash") {
  let newName = name,
    reg = new RegExp("(^|&)" + newName + "=([^&]*)(&|$)", "i"),
    paramHash = window.location.hash.split("?")[1] || "",
    paramSearch = window.location.search.split("?")[1] || "",
    param;

  type === "hash" ? (param = paramHash) : (param = paramSearch);

  let result = param.match(reg);

  if (result != null) {
    return result[2].split("/")[0];
  }
  return null;
}
```

# **检验URL链接是否有效**

```
function getUrlState(URL) {
  var xmlhttp = new ActiveXObject("microsoft.xmlhttp");
  xmlhttp.Open("GET", URL, false);
  try {
    xmlhttp.Send();
  } catch (e) {
  } finally {
    var result = xmlhttp.responseText;
    if (result) {
      if (xmlhttp.Status == 200) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
```

# **获取窗体可见范围的宽与高**

```
function getViewSize() {
  var de = document.documentElement;
  var db = document.body;
  var viewW = de.clientWidth == 0 ? db.clientWidth : de.clientWidth;
  var viewH = de.clientHeight == 0 ? db.clientHeight : de.clientHeight;
  return Array(viewW, viewH);
}
```

# **获取移动设备最大化大小**

```
function getZoom() {
  var screenWidth =
    Math.abs(window.orientation) === 90
      ? Math.max(screen.height, screen.width)
      : Math.min(screen.height, screen.width);
  if (this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()) {
    screenWidth = screenWidth / window.devicePixelRatio;
  }
  var FixViewPortsExperiment =
    rendererModel.runningExperiments.FixViewport ||
    rendererModel.runningExperiments.fixviewport;
  var FixViewPortsExperimentRunning =
    FixViewPortsExperiment &&
    (FixViewPortsExperiment === "New" || FixViewPortsExperiment === "new");
  if (FixViewPortsExperimentRunning) {
    return screenWidth / window.innerWidth;
  } else {
    return screenWidth / document.body.offsetWidth;
  }
}
```

# **判断是否安卓移动设备访问**

```
function isAndroidMobileDevice() {
  return /android/i.test(navigator.userAgent.toLowerCase());
}
```

# **判断是否苹果移动设备访问**

```
function isAppleMobileDevice() {
  return /iphone|ipod|ipad|Macintosh/i.test(navigator.userAgent.toLowerCase());
}
```

# **判断是否为数字类型**

```
function isDigit(value) {
  var patrn = /^[0-9]*$/;
  if (patrn.exec(value) == null || value == "") {
    return false;
  } else {
    return true;
  }
}
```

# **是否是某类手机型号**

```
// 用devicePixelRatio和分辨率判断
const isIphonex = () => {
  // X XS, XS Max, XR
  const xSeriesConfig = [
    {
      devicePixelRatio: 3,
      width: 375,
      height: 812
    },
    {
      devicePixelRatio: 3,
      width: 414,
      height: 896
    },
    {
      devicePixelRatio: 2,
      width: 414,
      height: 896
    }
  ];
  // h5
  if (typeof window !== "undefined" && window) {
    const isIOS = /iphone/gi.test(window.navigator.userAgent);
    if (!isIOS) return false;
    const { devicePixelRatio, screen } = window;
    const { width, height } = screen;
    return xSeriesConfig.some(
      item =>
        item.devicePixelRatio === devicePixelRatio &&
        item.width === width &&
        item.height === height
    );
  }
  return false;
};
```

# **判断是否移动设备**

```
function isMobile() {
  if (typeof this._isMobile === "boolean") {
    return this._isMobile;
  }
  var screenWidth = this.getScreenWidth();
  var fixViewPortsExperiment =
    rendererModel.runningExperiments.FixViewport ||
    rendererModel.runningExperiments.fixviewport;
  var fixViewPortsExperimentRunning =
    fixViewPortsExperiment && fixViewPortsExperiment.toLowerCase() === "new";
  if (!fixViewPortsExperiment) {
    if (!this.isAppleMobileDevice()) {
      screenWidth = screenWidth / window.devicePixelRatio;
    }
  }
  var isMobileScreenSize = screenWidth < 600;
  var isMobileUserAgent = false;
  this._isMobile = isMobileScreenSize && this.isTouchScreen();
  return this._isMobile;
}
```

# **判断吗是否手机号码**

```
function isMobileNumber(e) {
  var i =
      "134,135,136,137,138,139,150,151,152,157,158,159,187,188,147,182,183,184,178",
    n = "130,131,132,155,156,185,186,145,176",
    a = "133,153,180,181,189,177,173,170",
    o = e || "",
    r = o.substring(0, 3),
    d = o.substring(0, 4),
    s =
      !!/^1\\d{10}$/.test(o) &&
      (n.indexOf(r) >= 0
        ? "联通"
        : a.indexOf(r) >= 0
        ? "电信"
        : "1349" == d
        ? "电信"
        : i.indexOf(r) >= 0
        ? "移动"
        : "未知");
  return s;
}
```

# **判断是否是移动设备访问**

```
function isMobileUserAgent() {
  return /iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(
    window.navigator.userAgent.toLowerCase()
  );
}
```

# **判断鼠标是否移出事件**

```
function isMouseOut(e, handler) {
  if (e.type !== "mouseout") {
    return false;
  }
  var reltg = e.relatedTarget
    ? e.relatedTarget
    : e.type === "mouseout"
    ? e.toElement
    : e.fromElement;
  while (reltg && reltg !== handler) {
    reltg = reltg.parentNode;
  }
  return reltg !== handler;
}
```

# **判断是否Touch屏幕**

```
function isTouchScreen() {
  return (
    "ontouchstart" in window ||
    (window.DocumentTouch && document instanceof DocumentTouch)
  );
}
```

# **判断是否为网址**

```
function isURL(strUrl) {
  var regular = /^\\b(((https?|ftp):\\/\\/)?[-a-z0-9]+(\\.[-a-z0-9]+)*\\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\\d)|(1\\d\\d)|([1-9]\\d)|\\d))\\b(\\/[-a-z0-9_:\\@&?=+,.!\\/~%\\$]*)?)$/i;
  if (regular.test(strUrl)) {
    return true;
  } else {
    return false;
  }
}
```

# **判断是否打开视窗**

```
function isViewportOpen() {
  return !!document.getElementById("wixMobileViewport");
}
```

# **加载样式文件**

```
function loadStyle(url) {
  try {
    document.createStyleSheet(url);
  } catch (e) {
    var cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";
    cssLink.href = url;
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(cssLink);
  }
}
```

# **替换地址栏**

```
function locationReplace(url) {
  if (history.replaceState) {
    history.replaceState(null, document.title, url);
    history.go(0);
  } else {
    location.replace(url);
  }
}
```

# **解决offsetX兼容性问题**

```
// 针对火狐不支持offsetX/Y
function getOffset(e) {
  var target = e.target, // 当前触发的目标对象
    eventCoord,
    pageCoord,
    offsetCoord;

  // 计算当前触发元素到文档的距离
  pageCoord = getPageCoord(target);

  // 计算光标到文档的距离
  eventCoord = {
    X: window.pageXOffset + e.clientX,
    Y: window.pageYOffset + e.clientY
  };

  // 相减获取光标到第一个定位的父元素的坐标
  offsetCoord = {
    X: eventCoord.X - pageCoord.X,
    Y: eventCoord.Y - pageCoord.Y
  };
  return offsetCoord;
}

function getPageCoord(element) {
  var coord = { X: 0, Y: 0 };
  // 计算从当前触发元素到根节点为止，
  // 各级 offsetParent 元素的 offsetLeft 或 offsetTop 值之和
  while (element) {
    coord.X += element.offsetLeft;
    coord.Y += element.offsetTop;
    element = element.offsetParent;
  }
  return coord;
}
```

# **打开一个窗体通用方法**

```
function openWindow(url, windowName, width, height) {
  var x = parseInt(screen.width / 2.0) - width / 2.0;
  var y = parseInt(screen.height / 2.0) - height / 2.0;
  var isMSIE = navigator.appName == "Microsoft Internet Explorer";
  if (isMSIE) {
    var p = "resizable=1,location=no,scrollbars=no,width=";
    p = p + width;
    p = p + ",height=";
    p = p + height;
    p = p + ",left=";
    p = p + x;
    p = p + ",top=";
    p = p + y;
    retval = window.open(url, windowName, p);
  } else {
    var win = window.open(
      url,
      "ZyiisPopup",
      "top=" +
        y +
        ",left=" +
        x +
        ",scrollbars=" +
        scrollbars +
        ",dialog=yes,modal=yes,width=" +
        width +
        ",height=" +
        height +
        ",resizable=no"
    );
    eval("try { win.resizeTo(width, height); } catch(e) { }");
    win.focus();
  }
}
```

# **将键值对拼接成URL带参数**

```
export default const fnParams2Url = obj=> {
      let aUrl = []
      let fnAdd = function(key, value) {
        return key + '=' + value
      }
      for (var k in obj) {
        aUrl.push(fnAdd(k, obj[k]))
      }
      return encodeURIComponent(aUrl.join('&'))
 }
```

# **去掉url前缀**

```
function removeUrlPrefix(a) {
  a = a
    .replace(/：/g, ":")
    .replace(/．/g, ".")
    .replace(/／/g, "/");
  while (
    trim(a)
      .toLowerCase()
      .indexOf("http://") == 0
  ) {
    a = trim(a.replace(/http:\\/\\//i, ""));
  }
  return a;
}
```

# **替换全部**

```
String.prototype.replaceAll = function(s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2);
};
```

# **resize的操作**

```
(function() {
  var fn = function() {
    var w = document.documentElement
        ? document.documentElement.clientWidth
        : document.body.clientWidth,
      r = 1255,
      b = Element.extend(document.body),
      classname = b.className;
    if (w < r) {
      //当窗体的宽度小于1255的时候执行相应的操作
    } else {
      //当窗体的宽度大于1255的时候执行相应的操作
    }
  };
  if (window.addEventListener) {
    window.addEventListener("resize", function() {
      fn();
    });
  } else if (window.attachEvent) {
    window.attachEvent("onresize", function() {
      fn();
    });
  }
  fn();
})();
```

# **滚动到顶部**

```
// 使用document.documentElement.scrollTop 或 document.body.scrollTop 获取到顶部的距离，从顶部
// 滚动一小部分距离。使用window.requestAnimationFrame()来滚动。
// @example
// scrollToTop();
function scrollToTop() {
  var c = document.documentElement.scrollTop || document.body.scrollTop;

  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
}
```

# **设置cookie值**

```
function setCookie(name, value, Hours) {
  var d = new Date();
  var offset = 8;
  var utc = d.getTime() + d.getTimezoneOffset() * 60000;
  var nd = utc + 3600000 * offset;
  var exp = new Date(nd);
  exp.setTime(exp.getTime() + Hours * 60 * 60 * 1000);
  document.cookie =
    name +
    "=" +
    escape(value) +
    ";path=/;expires=" +
    exp.toGMTString() +
    ";domain=360doc.com;";
}
```

# **设为首页**

```
function setHomepage() {
  if (document.all) {
    document.body.style.behavior = "url(#default#homepage)";
    document.body.setHomePage("<http://w3cboy.com>");
  } else if (window.sidebar) {
    if (window.netscape) {
      try {
        netscape.security.PrivilegeManager.enablePrivilege(
          "UniversalXPConnect"
        );
      } catch (e) {
        alert(
          "该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true"
        );
      }
    }
    var prefs = Components.classes[
      "@mozilla.org/preferences-service;1"
    ].getService(Components.interfaces.nsIPrefBranch);
    prefs.setCharPref("browser.startup.homepage", "<http://w3cboy.com>");
  }
}
```

# **按字母排序，对每行进行数组排序**

```
function setSort() {
  var text = K1.value
    .split(/[\\r\\n]/)
    .sort()
    .join("\\r\\n"); //顺序
  var test = K1.value
    .split(/[\\r\\n]/)
    .sort()
    .reverse()
    .join("\\r\\n"); //反序
  K1.value = K1.value != text ? text : test;
}
```

# **延时执行**

```
// 比如 sleep(1000) 意味着等待1000毫秒，还可从 Promise、Generator、Async/Await 等角度实现。
// Promise
const sleep = time => {
  return new Promise(resolve => setTimeout(resolve, time));
};

sleep(1000).then(() => {
  console.log(1);
});

// Generator
function* sleepGenerator(time) {
  yield new Promise(function(resolve, reject) {
    setTimeout(resolve, time);
  });
}

sleepGenerator(1000)
  .next()
  .value.then(() => {
    console.log(1);
  });

//async
function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function output() {
  let out = await sleep(1000);
  console.log(1);
  return out;
}

output();

function sleep(callback, time) {
  if (typeof callback === "function") {
    setTimeout(callback, time);
  }
}

function output() {
  console.log(1);
}

sleep(output, 1000);
```

# **判断是否以某个字符串开头**

```
String.prototype.startWith = function(s) {
  return this.indexOf(s) == 0;
};
```

# **清除脚本内容**

```
function stripscript(s) {
  return s.replace(/<script.*?>.*?<\\/script>/gi, "");
}
```

# **时间个性化输出功能**

```
/*
1、< 60s, 显示为“刚刚”
2、>= 1min && < 60 min, 显示与当前时间差“XX分钟前”
3、>= 60min && < 1day, 显示与当前时间差“今天 XX:XX”
4、>= 1day && < 1year, 显示日期“XX月XX日 XX:XX”
5、>= 1year, 显示具体日期“XXXX年XX月XX日 XX:XX”
*/
function timeFormat(time) {
  var date = new Date(time),
    curDate = new Date(),
    year = date.getFullYear(),
    month = date.getMonth() + 10,
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    curYear = curDate.getFullYear(),
    curHour = curDate.getHours(),
    timeStr;

  if (year < curYear) {
    timeStr = year + "年" + month + "月" + day + "日 " + hour + ":" + minute;
  } else {
    var pastTime = curDate - date,
      pastH = pastTime / 3600000;

    if (pastH > curHour) {
      timeStr = month + "月" + day + "日 " + hour + ":" + minute;
    } else if (pastH >= 1) {
      timeStr = "今天 " + hour + ":" + minute + "分";
    } else {
      var pastM = curDate.getMinutes() - minute;
      if (pastM > 1) {
        timeStr = pastM + "分钟前";
      } else {
        timeStr = "刚刚";
      }
    }
  }
  return timeStr;
}
```

# **全角转换为半角函数**

```
function toCDB(str) {
  var result = "";
  for (var i = 0; i < str.length; i++) {
    code = str.charCodeAt(i);
    if (code >= 65281 && code <= 65374) {
      result += String.fromCharCode(str.charCodeAt(i) - 65248);
    } else if (code == 12288) {
      result += String.fromCharCode(str.charCodeAt(i) - 12288 + 32);
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}
```

# **半角转换为全角函数**

```
function toDBC(str) {
  var result = "";
  for (var i = 0; i < str.length; i++) {
    code = str.charCodeAt(i);
    if (code >= 33 && code <= 126) {
      result += String.fromCharCode(str.charCodeAt(i) + 65248);
    } else if (code == 32) {
      result += String.fromCharCode(str.charCodeAt(i) + 12288 - 32);
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}
```

# **金额大写转换函数**

```
function transform(tranvalue) {
  try {
    var i = 1;
    var dw2 = new Array("", "万", "亿"); //大单位
    var dw1 = new Array("拾", "佰", "仟"); //小单位
    var dw = new Array(
      "零",
      "壹",
      "贰",
      "叁",
      "肆",
      "伍",
      "陆",
      "柒",
      "捌",
      "玖"
    );
    //整数部分用
    //以下是小写转换成大写显示在合计大写的文本框中
    //分离整数与小数
    var source = splits(tranvalue);
    var num = source[0];
    var dig = source[1];
    //转换整数部分
    var k1 = 0; //计小单位
    var k2 = 0; //计大单位
    var sum = 0;
    var str = "";
    var len = source[0].length; //整数的长度
    for (i = 1; i <= len; i++) {
      var n = source[0].charAt(len - i); //取得某个位数上的数字
      var bn = 0;
      if (len - i - 1 >= 0) {
        bn = source[0].charAt(len - i - 1); //取得某个位数前一位上的数字
      }
      sum = sum + Number(n);
      if (sum != 0) {
        str = dw[Number(n)].concat(str); //取得该数字对应的大写数字，并插入到str字符串的前面
        if (n == "0") sum = 0;
      }
      if (len - i - 1 >= 0) {
        //在数字范围内
        if (k1 != 3) {
          //加小单位
          if (bn != 0) {
            str = dw1[k1].concat(str);
          }
          k1++;
        } else {
          //不加小单位，加大单位
          k1 = 0;
          var temp = str.charAt(0);
          if (temp == "万" || temp == "亿")
            //若大单位前没有数字则舍去大单位
            str = str.substr(1, str.length - 1);
          str = dw2[k2].concat(str);
          sum = 0;
        }
      }
      if (k1 == 3) {
        //小单位到千则大单位进一
        k2++;
      }
    }
    //转换小数部分
    var strdig = "";
    if (dig != "") {
      var n = dig.charAt(0);
      if (n != 0) {
        strdig += dw[Number(n)] + "角"; //加数字
      }
      var n = dig.charAt(1);
      if (n != 0) {
        strdig += dw[Number(n)] + "分"; //加数字
      }
    }
    str += "元" + strdig;
  } catch (e) {
    return "0元";
  }
  return str;
}
//拆分整数与小数
function splits(tranvalue) {
  var value = new Array("", "");
  temp = tranvalue.split(".");
  for (var i = 0; i < temp.length; i++) {
    value = temp;
  }
  return value;
}
```

# **清除空格**

```
String.prototype.trim = function() {
  var reExtraSpace = /^\\s*(.*?)\\s+$/;
  return this.replace(reExtraSpace, "$1");
};

// 清除左空格
function ltrim(s) {
  return s.replace(/^(\\s*|　*)/, "");
}

// 清除右空格
function rtrim(s) {
  return s.replace(/(\\s*|　*)$/, "");
}
```

# **随机数时间戳**

```
function uniqueId() {
  var a = Math.random,
    b = parseInt;
  return (
    Number(new Date()).toString() + b(10 * a()) + b(10 * a()) + b(10 * a())
  );
}
```

# **实现utf8解码**

```
function utf8_decode(str_data) {
  var tmp_arr = [],
    i = 0,
    ac = 0,
    c1 = 0,
    c2 = 0,
    c3 = 0;
  str_data += "";
  while (i < str_data.length) {
    c1 = str_data.charCodeAt(i);
    if (c1 < 128) {
      tmp_arr[ac++] = String.fromCharCode(c1);
      i++;
    } else if (c1 > 191 && c1 < 224) {
      c2 = str_data.charCodeAt(i + 1);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      c2 = str_data.charCodeAt(i + 1);
      c3 = str_data.charCodeAt(i + 2);
      tmp_arr[ac++] = String.fromCharCode(
        ((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
      );
      i += 3;
    }
  }
  return tmp_arr.join("");
}
```

以下是Puxiao投稿推荐的几个函数，用作常见的输入值校验和替换操作，主要针对中国大陆地区的校验规则：

# **校验是否为一个数字，以及该数字小数点位数是否与参数floats一致**

校验规则：

- 若参数floats有值，则校验该数字小数点后的位数。
- 若参数floats没有值，则仅仅校验是否为数字。

```
function isNum(value,floats=null){
    let regexp = new RegExp(`^[1-9][0-9]*.[0-9]{${floats}}$|^0.[0-9]{${floats}}$`);
    return typeof value === 'number' && floats?regexp.test(String(value)):true;
}
function anysicIntLength(minLength,maxLength){
    let result_str = '';
    if(minLength){
        switch(maxLength){
            case undefined:
                result_str = result_str.concat(`{${minLength-1}}`);
                break;
            case null:
                result_str = result_str.concat(`{${minLength-1},}`);
                break;
            default:
                result_str = result_str.concat(`{${minLength-1},${maxLength-1}}`);
        }
    }else{
        result_str = result_str.concat('*');
    }

    return result_str;
}
```

# **校验是否为非零的正整数**

```
function isInt(value,minLength=null,maxLength=undefined){
    if(!isNum(value)) return false;

    let regexp = new RegExp(`^-?[1-9][0-9]${anysicIntLength(minLength,maxLength)}$`);
    return regexp.test(value.toString());
}
```

# **校验是否为非零的正整数**

```
function isPInt(value,minLength=null,maxLength=undefined) {
    if(!isNum(value)) return false;

    let regexp = new RegExp(`^[1-9][0-9]${anysicIntLength(minLength,maxLength)}$`);
    return regexp.test(value.toString());
}
```

# **校验是否为非零的负整数**

```
function isNInt(value,minLength=null,maxLength=undefined){
    if(!isNum(value)) return false;
    let regexp = new RegExp(`^-[1-9][0-9]${anysicIntLength(minLength,maxLength)}$`);
    return regexp.test(value.toString());
}
```

# **校验整数是否在取值范围内**

校验规则：

- minInt为在取值范围中最小的整数
- maxInt为在取值范围中最大的整数

```
function checkIntRange(value,minInt,maxInt=9007199254740991){
    return Boolean(isInt(value) && (Boolean(minInt!=undefined && minInt!=null)?value>=minInt:true) && (value<=maxInt));
}
```

# **校验是否为中国大陆手机号**

```
function isTel(value) {
    return /^1[3,4,5,6,7,8,9][0-9]{9}$/.test(value.toString());
}
```

# **校验是否为中国大陆传真或固定电话号码**

```
function isFax(str) {
    return /^([0-9]{3,4})?[0-9]{7,8}$|^([0-9]{3,4}-)?[0-9]{7,8}$/.test(str);
}
```

# **校验是否为邮箱地址**

```
function isEmail(str) {
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$/.test(str);
}
```

# **校验是否为QQ号码**

校验规则：

- 非0开头的5位-13位整数

```
function isQQ(value) {
    return /^[1-9][0-9]{4,12}$/.test(value.toString());
}
```

# **校验是否为网址**

校验规则：

- 以https://、http://、ftp://、rtsp://、mms://开头、或者没有这些开头
- 可以没有www开头(或其他二级域名)，仅域名
- 网页地址中允许出现/%*?@&等其他允许的符号

```
function isURL(str) {
    return /^(https:\\/\\/|http:\\/\\/|ftp:\\/\\/|rtsp:\\/\\/|mms:\\/\\/)?[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+[\\/=\\?%\\-&_~`@[\\]\\':+!]*([^<>\\"\\"])*$/.test(str);
}
```

# **校验是否为不含端口号的IP地址**

校验规则：

- [IP格式为xxx.xxx.xxx.xxx](http://xn--IPxxx-fq1hm91h5lp.xxx.xxx.xxx)，每一项数字取值范围为0-255
- 除0以外其他数字不能以0开头，比如02

```
function isIP(str) {
    return /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/.test(str);
}
```

# **校验是否为IPv6地址**

校验规则：

- 支持IPv6正常格式
- 支持IPv6压缩格式

```
function isIPv6(str){
    return Boolean(str.match(/:/g)?str.match(/:/g).length<=7:false && /::/.test(str)?/^([\\da-f]{1,4}(:|::)){1,6}[\\da-f]{1,4}$/i.test(str):/^([\\da-f]{1,4}:){7}[\\da-f]{1,4}$/i.test(str));
}
```

# **校验是否为中国大陆第二代居民身份证**

校验规则：

- 共18位，最后一位可为X(大小写均可)
- 不能以0开头
- 出生年月日会进行校验：年份只能为18/19/2*开头，月份只能为01-12，日只能为01-31

```
function isIDCard(str){
    return /^[1-9][0-9]{5}(18|19|(2[0-9]))[0-9]{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)[0-9]{3}[0-9Xx]$/.test(str);
}
```

# **校验是否为中国大陆邮政编码**

参数value为数字或字符串

校验规则：

- 共6位，且不能以0开头

```
function isPostCode(value){
    return /^[1-9][0-9]{5}$/.test(value.toString());
}
```

# **校验两个参数是否完全相同，包括类型**

校验规则：

- 值相同，数据类型也相同

```
function same(firstValue,secondValue){
    return firstValue===secondValue;
}
```

# **校验字符的长度是否在规定的范围内**

校验规则：

- minInt为在取值范围中最小的长度
- maxInt为在取值范围中最大的长度

```
function lengthRange(str,minLength,maxLength=9007199254740991) {
    return Boolean(str.length >= minLength && str.length <= maxLength);
}
```

# **校验字符是否以字母开头**

校验规则：

- 必须以字母开头
- 开头的字母不区分大小写

```
function letterBegin(str){
    return /^[A-z]/.test(str);
}
```

# **校验字符是否为纯数字(整数)**

校验规则：

- 字符全部为正整数(包含0)
- 可以以0开头

```
function pureNum(str) {
    return /^[0-9]*$/.test(str);
}
function anysicPunctuation(str){
    if(!str) return null;
    let arr = str.split('').map(item => {
        return item = '\\\\' + item;
    });
    return arr.join('|');
}
function getPunctuation(str){
    return anysicPunctuation(str) || '\\\\~|\\\\`|\\\\!|\\\\@|\\\\#|\\\\$|\\\\%|\\\\^|\\\\&|\\\\*|\\\\(|\\\\)|\\\\-|\\\\_|\\\\+|\\\\=|\\\\||\\\\\\|\\\\[|\\\\]|\\\\{|\\\\}|\\\\;|\\\\:|\\\\"|\\\\\\'|\\\\,|\\\\<|\\\\.|\\\\>|\\\\/|\\\\?';
}
function getExcludePunctuation(str){
    let regexp = new RegExp(`[${anysicPunctuation(str)}]`,'g');
    return getPunctuation(' ~`!@#$%^&*()-_+=\\[]{};:"\\',<.>/?'.replace(regexp,''));
}
```

# **返回字符串构成种类(字母，数字，标点符号)的数量**

LIP缩写的由来：L(letter 字母) + I(uint 数字) + P(punctuation 标点符号)

参数punctuation的说明：

- punctuation指可接受的标点符号集
- 若需自定义符号集，例如“仅包含中划线和下划线”，将参数设置为"-_"即可
- 若不传值或默认为null，则内部默认标点符号集为除空格外的其他英文标点符号：~`!@#$%^&*()-_+=[]{};:"',<.>/?

```
function getLIPTypes(str,punctuation=null){
    let p_regexp = new RegExp('['+getPunctuation(punctuation)+']');
    return /[A-z]/.test(str) + /[0-9]/.test(str) + p_regexp.test(str);
}
```

# **校验字符串构成的种类数量是否大于或等于参数num的值。通常用来校验用户设置的密码复杂程度。**

校验规则：

- 参数num为需要构成的种类(字母、数字、标点符号)，该值只能是1-3。
- 默认参数num的值为1，即表示：至少包含字母，数字，标点符号中的1种
- 若参数num的值为2，即表示：至少包含字母，数字，标点符号中的2种
- 若参数num的值为3，即表示：必须同时包含字母，数字，标点符号
- 参数punctuation指可接受的标点符号集，具体设定可参考getLIPTypes()方法中关于标点符号集的解释。

```
function pureLIP(str,num=1,punctuation=null){
    let regexp = new RegExp(`[^A-z0-9|${getPunctuation(punctuation)}]`);
    return Boolean(!regexp.test(str) && getLIPTypes(str,punctuation)>= num);
}
```

# **清除所有空格**

```
function clearSpaces(str){
    return str.replace(/[ ]/g,'');
}
```

# **清除所有中文字符(包括中文标点符号)**

```
function clearCNChars(str){
    return str.replace(/[\\u4e00-\\u9fa5]/g,'');
}
```

# **清除所有中文字符及空格**

```
function clearCNCharsAndSpaces(str){
    return str.replace(/[\\u4e00-\\u9fa5 ]/g,'');
}
```

# **除保留标点符号集以外，清除其他所有英文的标点符号(含空格)**

全部英文标点符号为：~`!@#$%^&*()-_+=[]{};:"',<.>/?

参数excludePunctuation指需要保留的标点符号集，例如若传递的值为'_'，即表示清除_以外的其他所有英文标点符号。

```
function clearPunctuation(str,excludePunctuation=null){
    let regexp = new RegExp(`[${getExcludePunctuation(excludePunctuation)}]`,'g');
    return str.replace(regexp,'');
}
```

# **校验是否包含空格**

```
function haveSpace(str) {
    return /[ ]/.test(str);
}
```

# **校验是否包含中文字符(包括中文标点符号)**

```
function haveCNChars(str){
    return /[\\u4e00-\\u9fa5]/.test(str);
}
```



