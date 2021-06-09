---
title: webpack进阶（一）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# webpack-1.文件分析

## 1. webpack介绍

- `Webpack`是一个前端资源加载/打包工具。它将根据模块的依赖关系进行静态分析，然后将这些模块按照指定的规则生成对应的静态资源。

![webpack_intro](http://img.zhufengpeixun.cn/webpack_intro.gif)

## 2. 预备知识

### 2.1 toStringTag

- `Symbol.toStringTag` 是一个内置 symbol，它通常作为对象的属性键使用，对应的属性值应该为字符串类型，这个字符串用来表示该对象的自定义类型标签，通常只有内置的 `Object.prototype.toString()` 方法会去读取这个标签并把它包含在自己的返回值里。

```js
console.log(Object.prototype.toString.call('foo'));     // "[object String]"
console.log(Object.prototype.toString.call([1, 2]));    // "[object Array]"
console.log(Object.prototype.toString.call(3));         // "[object Number]"
console.log(Object.prototype.toString.call(true));      // "[object Boolean]"
console.log(Object.prototype.toString.call(undefined)); // "[object Undefined]"
console.log(Object.prototype.toString.call(null));      // "[object Null]"
let myExports={};
Object.defineProperty(myExports, Symbol.toStringTag, { value: 'Module' });
console.log(Object.prototype.toString.call(myExports));
```

### 2.2 Object.create(null)

- 使用`create`创建的对象，没有任何属性,把它当作一个非常纯净的map来使用，我们可以自己定义`hasOwnProperty`、`toString`方法,完全不必担心会将原型链上的同名方法覆盖掉
- 在我们使用`for..in`循环的时候会遍历对象原型链上的属性，使用`create(null)`就不必再对属性进行检查了

```js
var ns = Object.create(null);
if (typeof Object.create !== "function") {
    Object.create = function (proto) {
        function F() {}
        F.prototype = proto;
        return new F();
    };
}
console.log(ns)
console.log(Object.getPrototypeOf(ns));
```

### 2.3 getter

- defineProperty

   

  方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。

  - obj 要在其上定义属性的对象。
  - prop 要定义或修改的属性的名称。
  - descriptor 将被定义或修改的属性描述符。

### 2.3.1 描述符可同时具有的键值

|            | configurable | enumerable | value | writable | get  | set  |
| :--------- | :----------- | :--------- | :---- | :------- | :--- | :--- |
| 数据描述符 | Yes          | Yes        | Yes   | Yes      | No   | No   |
| 存取描述符 | Yes          | Yes No     | No    | Yes      | Yes  |      |

### 2.3.2 示例

```js
var ageValue;
Object.defineProperty(obj, "age", {
  value : 10,//数据描述符和存取描述符不能混合使用
  get(){
    return ageValue;
  },
  set(newValue){
    ageValue = newValue;
  }
  writable : true,//是否可修改
  enumerable : true,//是否可枚举
  configurable : true//是否可配置可删除
});
```

## 2. 同步加载

```js
cnpm i webpack webpack-cli html-webpack-plugin clean-webpack-plugin -D
```

### 2.1 webpack.config.js

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    mode: 'development',
    devtool: 'none',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {},
    plugins: [
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*'] }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        })],
    devServer: {}
}
```

### 2.2 index.js

src\index.js

```js
let title = require('./title.js');
console.log(title);
```

### 2.3 title.js

src\title.js

```js
module.exports = "title";
```

### 2.4 打包文件分析

```js
(function(modules) {
  // webpack的启动函数
  //模块的缓存
  var installedModules = {};

  //定义在浏览器中使用的require方法
  function __webpack_require__(moduleId) {
    //检查模块是否在缓存中
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    //创建一个新的模块并且放到模块的缓存中
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    });

    //执行模块函数
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    //把模块设置为已经加载
    module.l = true;

    //返回模块的导出对象
    return module.exports;
  }

  //暴露出模块对象
  __webpack_require__.m = modules;

  //暴露出模块缓存
  __webpack_require__.c = installedModules;

  //为harmony导出定义getter函数
  __webpack_require__.d = function(exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  //在导出对象上定义__esModule属性
  __webpack_require__.r = function(exports) {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
  };

  /**
   * 创建一个模拟的命名空间对象
   * mode & 1 value是模块ID直接用__webpack_require__加载
   * mode & 2 把所有的属性合并到命名空间ns上
   * mode & 4 当已经是命名空间的时候(__esModule=true)可以直接返回值
   * mode & 8|1 行为类似于require
   */
  __webpack_require__.t = function(value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if (mode & 4 && typeof value === "object" && value && value.__esModule)
      return value;
    var ns = Object.create(null); //定义一个空对象
    __webpack_require__.r(ns);
    Object.defineProperty(ns, "default", { enumerable: true, value: value });
    if (mode & 2 && typeof value != "string")
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function(key) {
            return value[key];
          }.bind(null, key)
        );
    return ns;
  };

  // getDefaultExport函数为了兼容那些非non-harmony模块
  __webpack_require__.n = function(module) {
    var getter =
      module && module.__esModule
        ? function getDefault() {
            return module["default"];
          }
        : function getModuleExports() {
            return module;
          };
    __webpack_require__.d(getter, "a", getter);
    return getter;
  };

  //判断对象身上是否拥有此属性
  __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };

  //公共路径
  __webpack_require__.p = "";

  //加载入口模块并且返回导出对象
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
  "./src/index.js": function(module, exports, __webpack_require__) {
    var title = __webpack_require__("./src/title.js");
    console.log(title);
  },
  "./src/title.js": function(module, exports) {
    module.exports = "title";
  }
});
```

### 2.5 实现

```js
(function(modules){
    var installedModules = {};
    function __webpack_require__(moduleId){
        if(installedModules[moduleId]){
            return installedModules[moduleId];
        }
        var module = installedModules[moduleId] = {
            i:moduleId,
            l:false,
            exports:{}
        }
        modules[moduleId].call(modules.exports,module,module.exports,__webpack_require__);
        module.l = true;
        return module.exports;
    }
    return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
    "./src/index.js":function(module,exports,__webpack_require__){
        var title = __webpack_require__('./src/title.js');
        console.log(title);
    },
    "./src/title.js":function(module,exports){
       module.exports = "title";
    }
})
```

## 3. harmony

### 3.1 common.js加载 common.js

#### 3.1.1 index.js

```js
let title = require('./title');
console.log(title.name);
console.log(title.age);
```

#### 3.1.2 title.js

```js
exports.name = 'title_name';
exports.age = 'title_age';
```

#### 3.1.3 bundle.js

```js
{
"./src/index.js":
  (function(module, exports, __webpack_require__) {
    var title = __webpack_require__("./src/title.js");
    console.log(title.name);
    console.log(title.age);
  }),
"./src/title.js":
  (function(module, exports) {
    exports.name = 'title_name';
    exports.age = 'title_age';
  })
}
```

### 3.2 common.js加载 ES6 modules

#### 3.2.1 index.js

```js
let title = require('./title');
console.log(title.name);
console.log(title.age);
```

#### 3.2.2 title.js

```js
exports.name = 'title_name';
exports.age = 'title_age';
```

#### 3.2.3 bundle.js

```js
{
 "./src/index.js":
 (function(module, exports, __webpack_require__) {
    var title = __webpack_require__("./src/title.js");
    console.log(title["default"]);
    console.log(title.age);
 }),
 "./src/title.js":
 (function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__);//__esModule=true
    __webpack_require__.d(__webpack_exports__, "age", function() { return age; });
    __webpack_exports__["default"] = 'title_name';
    var age = 'title_age';
 })
}
```

### 3.3 ES6 modules 加载 ES6 modules

#### 3.3.1 index.js

```js
import name,{age} from './title';
console.log(name);
console.log(age);
```

#### 3.3.2 title.js

```js
export default name  = 'title_name';
export const age = 'title_age';
```

#### 3.3.3 bundle.js

```js
{
 "./src/index.js":
 (function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__);//__esModule=true
    var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/title.js");
    console.log(_title__WEBPACK_IMPORTED_MODULE_0__["default"]);
    console.log(_title__WEBPACK_IMPORTED_MODULE_0__["age"]);
 }),
 "./src/title.js":
 (function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__);//__esModule=true
    __webpack_require__.d(__webpack_exports__, "age", function() { return age; });
    __webpack_exports__["default"] = 'title_name';
    var age = 'title_age';
 })
}
```

### 3.4 ES6 modules 加载 common.js

#### 3.4.1 index.js

```js
import name,{age} from './title';
console.log(name);
console.log(age);
```

#### 3.4.2 title.js

```js
export default name  = 'title_name';
export const age = 'title_age';
```

#### 3.4.3 bundle.js

```js
{
"./src/index.js":
(function(module, __webpack_exports__, __webpack_require__) {
  __webpack_require__.r(__webpack_exports__);//__esModule=true
  /* 兼容common.js导出 */ var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/title.js");
  /* 兼容common.js导出 */ var _title__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_title__WEBPACK_IMPORTED_MODULE_0__);
  console.log(_title__WEBPACK_IMPORTED_MODULE_0___default.a.name);
  console.log(_title__WEBPACK_IMPORTED_MODULE_0___default.a.age);
}),
"./src/title.js":
(function(module, __webpack_exports__,__webpack_require__) {
  __webpack_exports__.name = 'title_name';
  __webpack_exports__.age = 'title_age';
}),
"./src/title_esm.js":
(function(module, __webpack_exports__,__webpack_require__) {
  __webpack_require__.r(__webpack_exports__);//__esModule=true
  __webpack_exports__.name = 'title_name';
  __webpack_exports__.age = 'title_age';
  __webpack_exports__.default = {name:'default_name',age:'default_age'};
})
}
```

## 4.异步加载

### 4.1 webpack.config.js

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    mode: 'development',
    devtool: 'none',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {},
    plugins: [
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*'] }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['main1']
        })],
    devServer: {}
}
```

### 4.3 src\main.js

```js
import(/* webpackChunkName: "c" */'./c').then(c => {
    console.log(c)
})
```

### 4.4 src\c.js

```js
export default {
    name: 'zhufeng'
}
```

### 4.5 dist\main.js

```js
(function (modules) {
  function webpackJsonpCallback(data) {
    var chunkIds = data[0];
    var moreModules = data[1];
    var moduleId, chunkId, i = 0, resolves = [];
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
        resolves.push(installedChunks[chunkId][0]);
      }
      installedChunks[chunkId] = 0;
    }
    for (moduleId in moreModules) {
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        modules[moduleId] = moreModules[moduleId];
      }
    }
    if (parentJsonpFunction) parentJsonpFunction(data);
    while (resolves.length) {
      resolves.shift()();
    }
  };
  var installedModules = {};
  var installedChunks = {
    "main": 0
  };
  function jsonpScriptSrc(chunkId) {
    return __webpack_require__.p + "" + ({ "c": "c" }[chunkId] || chunkId) + ".js"
  }
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    module.l = true;
    return module.exports;
  }
  __webpack_require__.e = function requireEnsure(chunkId) {
    var promises = [];
    var installedChunkData = installedChunks[chunkId];
    if (installedChunkData !== 0) {
      if (installedChunkData) {
        promises.push(installedChunkData[2]);
      } else {
        var promise = new Promise(function (resolve, reject) {
          installedChunkData = installedChunks[chunkId] = [resolve, reject];
        });
        promises.push(installedChunkData[2] = promise);
        var script = document.createElement('script');
        var onScriptComplete;
        script.charset = 'utf-8';
        script.timeout = 120;
        if (__webpack_require__.nc) {
          script.setAttribute("nonce", __webpack_require__.nc);
        }
        script.src = jsonpScriptSrc(chunkId);
        var error = new Error();
        onScriptComplete = function (event) {
          script.onerror = script.onload = null;
          clearTimeout(timeout);
          var chunk = installedChunks[chunkId];
          if (chunk !== 0) {
            if (chunk) {
              var errorType = event && (event.type === 'load' ? 'missing' : event.type);
              var realSrc = event && event.target && event.target.src;
              error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
              error.name = 'ChunkLoadError';
              error.type = errorType;
              error.request = realSrc;
              chunk[1](error);
            }
            installedChunks[chunkId] = undefined;
          }
        };
        var timeout = setTimeout(function () {
          onScriptComplete({ type: 'timeout', target: script });
        }, 120000);
        script.onerror = script.onload = onScriptComplete;
        document.head.appendChild(script);
      }
    }
    return Promise.all(promises);
  };
  __webpack_require__.m = modules;
  __webpack_require__.c = installedModules;
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };
  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
    return ns;
  };
  __webpack_require__.n = function (module) {
    var getter = module && module.__esModule ?
      function getDefault() { return module['default']; } :
      function getModuleExports() { return module; };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };
  __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  __webpack_require__.p = "";
  __webpack_require__.oe = function (err) { console.error(err); throw err; };
  var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
  var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
  jsonpArray.push = webpackJsonpCallback;
  jsonpArray = jsonpArray.slice();
  for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
  var parentJsonpFunction = oldJsonpFunction;
  return __webpack_require__(__webpack_require__.s = "./src/main.js");
})
  ({
    "./src/main.js":
      (function (module, exports, __webpack_require__) {
        __webpack_require__.e("c").then(__webpack_require__.bind(null, "./src/c.js")).then(c => {
          console.log(c)
        })
      })
  });
```

### 4.6 dist\c.js

```js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["c"], {
  "./src/c.js":
    (function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__);
      __webpack_exports__["default"] = ({
        name: 'zhufeng'
      });
    })
}]);
```

### 4.7 实现

```js
(function (modules) {
  function webpackJsonpCallback(data) {
    var chunkIds = data[0];
    var moreModules = data[1];
    var moduleId, chunkId, i = 0, resolves = [];
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if (installedChunks[chunkId]) {
        resolves.push(installedChunks[chunkId][0]);
      }
      installedChunks[chunkId] = 0;
    }
    for (moduleId in moreModules) {
      modules[moduleId] = moreModules[moduleId];
    }
    while (resolves.length) {
      resolves.shift()();
    }
  }
  var installedModules = {};
  var installedChunks = { main: 0 };
  __webpack_require__.p = "";
  function jsonpScriptSrc(chunkId) {
    return __webpack_require__.p + "" + chunkId + ".bundle.js";
  }
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = (installedModules[moduleId] = { i: moduleId, l: false, exports: {} });
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    module.l = true;
    return module.exports;
  }
  __webpack_require__.t = function (value, mode) {
    value = __webpack_require__(value);
    var ns = Object.create(null);
    Object.defineProperty(ns, "__esModule", { value: true });
    Object.defineProperty(ns, "default", { enumerable: true, value: value });
    return ns;
  };

  __webpack_require__.e = function requireEnsure(chunkId) {
    var promises = [];
    var installedChunkData = installedChunks[chunkId];
    var promise = new Promise(function (resolve, reject) {
      installedChunkData = installedChunks[chunkId] = [resolve, reject];
    });
    promises.push((installedChunkData[2] = promise));
    var script = document.createElement("script");
    script.src = jsonpScriptSrc(chunkId);
    document.head.appendChild(script);
    return Promise.all(promises);
  }
  var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);
  jsonpArray.push = webpackJsonpCallback;
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
  "./src/main.js":
    (function (module, exports, __webpack_require__) {
      __webpack_require__.e("c").then(__webpack_require__.bind(null, "./src/c.js")).then(c => {
        console.log(c)
      })
    })
});
```

## 5.异步加载

![webpacklazyload2](http://img.zhufengpeixun.cn/webpacklazyload2.jpg)

### 5.1 src\index.html

```js
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
    <title>import</title>
</head>
<body>
<button id="main1-loadC1">main1中加载c1模块</button>
<button id="main1-loadC2">main1中加载c2模块</button>
<button id="loadMain2">main2.js文件</button>
<button id="main2-loadC1">main2中加载c1模块</button>
<button id="main2-loadC2">main2中加载c2模块</button>
</body>
</html>
```

### 5.2 webpack.config.js

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    mode: 'development',
    devtool: 'none',
    entry: {
        main1: './src/main1.js',
        main2: './src/main2.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {},
    plugins: [
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*'] }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['main1']
        })],
    devServer: {}
}
```

### 5.3 src\main1.js

```js
document.getElementById('main1-loadC1').addEventListener('click', () => {
    import(/* webpackChunkName: "c1" */'./c1').then(c1 => {
        console.log(c1.default)
    })
});
document.getElementById('main1-loadC2').addEventListener('click', () => {
    import(/* webpackChunkName: "c2" */'./c2').then(c1 => {
        console.log(c1.default)
    })
});
document.getElementById('loadMain2').addEventListener('click', () => {
    let script = document.createElement('script');
    script.src = 'main2.js';
    document.body.appendChild(script);
});
```

### 5.4 src\main2.js

```js
document.getElementById('main2-loadC1').addEventListener('click', () => {
    import(/* webpackChunkName: "c1" */'./c1').then(c1 => {
        console.log(c1.default)
    })
});
document.getElementById('main2-loadC2').addEventListener('click', () => {
    import(/* webpackChunkName: "c2" */'./c2').then(c1 => {
        console.log(c1.default)
    })
});
```

### 5.5 src\c1.js

```js
export default {
    name: 'c1'
}
```

### 5.6 src\c2.js

```js
export default {
    name: 'c2'
}
```

### 5.7 dist\main1.js

```js
(function (modules) {
    function webpackJsonpCallback(data) {
        var chunkIds = data[0];
        var moreModules = data[1];
        var moduleId, chunkId, i = 0, resolves = [];
        for (; i < chunkIds.length; i++) {
            chunkId = chunkIds[i];
            if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
                resolves.push(installedChunks[chunkId][0]);
            }
            installedChunks[chunkId] = 0;
        }
        for (moduleId in moreModules) {
            if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
                modules[moduleId] = moreModules[moduleId];
            }
        }
        if (parentJsonpFunction) parentJsonpFunction(data);
        while (resolves.length) {
            resolves.shift()();
        }
    };
    var installedModules = {};
    var installedChunks = {
        "main1": 0
    };
    function jsonpScriptSrc(chunkId) {
        return __webpack_require__.p + "" + ({ "c1": "c1", "c2": "c2" }[chunkId] || chunkId) + ".js"
    }
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }
    __webpack_require__.e = function requireEnsure(chunkId) {
        var promises = [];
        var installedChunkData = installedChunks[chunkId];
        if (installedChunkData !== 0) {
            if (installedChunkData) {
                promises.push(installedChunkData[2]);
            } else {
                var promise = new Promise(function (resolve, reject) {
                    installedChunkData = installedChunks[chunkId] = [resolve, reject];
                });
                promises.push(installedChunkData[2] = promise);
                var script = document.createElement('script');
                var onScriptComplete;
                script.charset = 'utf-8';
                script.timeout = 120;
                if (__webpack_require__.nc) {
                    script.setAttribute("nonce", __webpack_require__.nc);
                }
                script.src = jsonpScriptSrc(chunkId);
                var error = new Error();
                onScriptComplete = function (event) {
                    script.onerror = script.onload = null;
                    clearTimeout(timeout);
                    var chunk = installedChunks[chunkId];
                    if (chunk !== 0) {
                        if (chunk) {
                            var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                            var realSrc = event && event.target && event.target.src;
                            error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
                            error.name = 'ChunkLoadError';
                            error.type = errorType;
                            error.request = realSrc;
                            chunk[1](error);
                        }
                        installedChunks[chunkId] = undefined;
                    }
                };
                var timeout = setTimeout(function () {
                    onScriptComplete({ type: 'timeout', target: script });
                }, 120000);
                script.onerror = script.onload = onScriptComplete;
                document.head.appendChild(script);
            }
        }
        return Promise.all(promises);
    };
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function (exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, { enumerable: true, get: getter });
        }
    };
    __webpack_require__.r = function (exports) {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        }
        Object.defineProperty(exports, '__esModule', { value: true });
    };
    __webpack_require__.t = function (value, mode) {
        if (mode & 1) value = __webpack_require__(value);
        if (mode & 8) return value;
        if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
        var ns = Object.create(null);
        __webpack_require__.r(ns);
        Object.defineProperty(ns, 'default', { enumerable: true, value: value });
        if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
        return ns;
    };
    __webpack_require__.n = function (module) {
        var getter = module && module.__esModule ?
            function getDefault() { return module['default']; } :
            function getModuleExports() { return module; };
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };
    __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    __webpack_require__.p = "";
    __webpack_require__.oe = function (err) { console.error(err); throw err; };
    var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
    var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
    jsonpArray.push = webpackJsonpCallback;
    jsonpArray = jsonpArray.slice();
    for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
    var parentJsonpFunction = oldJsonpFunction;
    return __webpack_require__(__webpack_require__.s = "./src/main1.js");
})
    ({
        "./src/main1.js":
            (function (module, exports, __webpack_require__) {
                document.getElementById('main1-loadC1').addEventListener('click', () => {
                    __webpack_require__.e("c1").then(__webpack_require__.bind(null, "./src/c1.js")).then(c1 => {
                        console.log(c1.default)
                    })
                });
                document.getElementById('main1-loadC2').addEventListener('click', () => {
                    __webpack_require__.e("c2").then(__webpack_require__.bind(null, "./src/c2.js")).then(c1 => {
                        console.log(c1.default)
                    })
                });
                document.getElementById('loadMain2').addEventListener('click', () => {
                    let script = document.createElement('script');
                    script.src = 'main2.js';
                    document.body.appendChild(script);
                });
            })
    });
```

### 5.8 dist\main2.js

```js
(function (modules) {
    function webpackJsonpCallback(data) {
        var chunkIds = data[0];
        var moreModules = data[1];
        var moduleId, chunkId, i = 0, resolves = [];
        for (; i < chunkIds.length; i++) {
            chunkId = chunkIds[i];
            if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
                resolves.push(installedChunks[chunkId][0]);
            }
            installedChunks[chunkId] = 0;
        }
        for (moduleId in moreModules) {
            if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
                modules[moduleId] = moreModules[moduleId];
            }
        }
        if (parentJsonpFunction) parentJsonpFunction(data);
        while (resolves.length) {
            resolves.shift()();
        }
    };
    var installedModules = {};
    var installedChunks = {
        "main2": 0
    };
    function jsonpScriptSrc(chunkId) {
        return __webpack_require__.p + "" + ({ "c1": "c1", "c2": "c2" }[chunkId] || chunkId) + ".js"
    }
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }
    __webpack_require__.e = function requireEnsure(chunkId) {
        var promises = [];
        var installedChunkData = installedChunks[chunkId];
        if (installedChunkData !== 0) {
            if (installedChunkData) {
                promises.push(installedChunkData[2]);
            } else {
                var promise = new Promise(function (resolve, reject) {
                    installedChunkData = installedChunks[chunkId] = [resolve, reject];
                });
                promises.push(installedChunkData[2] = promise);
                var script = document.createElement('script');
                var onScriptComplete;
                script.charset = 'utf-8';
                script.timeout = 120;
                if (__webpack_require__.nc) {
                    script.setAttribute("nonce", __webpack_require__.nc);
                }
                script.src = jsonpScriptSrc(chunkId);
                var error = new Error();
                onScriptComplete = function (event) {
                    script.onerror = script.onload = null;
                    clearTimeout(timeout);
                    var chunk = installedChunks[chunkId];
                    if (chunk !== 0) {
                        if (chunk) {
                            var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                            var realSrc = event && event.target && event.target.src;
                            error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
                            error.name = 'ChunkLoadError';
                            error.type = errorType;
                            error.request = realSrc;
                            chunk[1](error);
                        }
                        installedChunks[chunkId] = undefined;
                    }
                };
                var timeout = setTimeout(function () {
                    onScriptComplete({ type: 'timeout', target: script });
                }, 120000);
                script.onerror = script.onload = onScriptComplete;
                document.head.appendChild(script);
            }
        }
        return Promise.all(promises);
    };
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function (exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, { enumerable: true, get: getter });
        }
    };
    __webpack_require__.r = function (exports) {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        }
        Object.defineProperty(exports, '__esModule', { value: true });
    };
    __webpack_require__.t = function (value, mode) {
        if (mode & 1) value = __webpack_require__(value);
        if (mode & 8) return value;
        if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
        var ns = Object.create(null);
        __webpack_require__.r(ns);
        Object.defineProperty(ns, 'default', { enumerable: true, value: value });
        if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
        return ns;
    };
    __webpack_require__.n = function (module) {
        var getter = module && module.__esModule ?
            function getDefault() { return module['default']; } :
            function getModuleExports() { return module; };
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };
    __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    __webpack_require__.p = "";
    __webpack_require__.oe = function (err) { console.error(err); throw err; };
    var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
    var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
    jsonpArray.push = webpackJsonpCallback;
    jsonpArray = jsonpArray.slice();
    for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
    var parentJsonpFunction = oldJsonpFunction;
    return __webpack_require__(__webpack_require__.s = "./src/main2.js");
})
    ({
        "./src/main2.js":
            (function (module, exports, __webpack_require__) {
                document.getElementById('main2-loadC1').addEventListener('click', () => {
                    __webpack_require__.e("c1").then(__webpack_require__.bind(null, "./src/c1.js")).then(c1 => {
                        console.log(c1.default)
                    })
                });
                document.getElementById('main2-loadC2').addEventListener('click', () => {
                    __webpack_require__.e("c2").then(__webpack_require__.bind(null, "./src/c2.js")).then(c1 => {
                        console.log(c1.default)
                    })
                });
            })
    });
```

### 5.9 dist\c1.js

```js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["c1"], {
  "./src/c1.js":
    (function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__);
      __webpack_exports__["default"] = ({
        name: 'c1'
      });
    })
}]);
```

### 5.10 dist\c2.js

```js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["c2"], {
    "./src/c2.js":
        (function (module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_exports__["default"] = ({
                name: 'c2'
            });
        })
}]);
```

### 5.11 实现

```diff
(function (modules) {
    function webpackJsonpCallback(data) {
        var chunkIds = data[0];
        var moreModules = data[1];
        var moduleId, chunkId, i = 0, resolves = [];
        for (; i < chunkIds.length; i++) {
            chunkId = chunkIds[i];
            if (installedChunks[chunkId]) {
                resolves.push(installedChunks[chunkId][0]);
            }
            installedChunks[chunkId] = 0;
        }
        for (moduleId in moreModules) {
            modules[moduleId] = moreModules[moduleId];
        }
+       if (parentJsonpFunction) parentJsonpFunction(data);
        while (resolves.length) {
            resolves.shift()();
        }
    }
    var installedModules = {};
    var installedChunks = { main: 0 };
    __webpack_require__.p = "";
    function jsonpScriptSrc(chunkId) {
        return __webpack_require__.p + "" + chunkId + ".js";
    }
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = (installedModules[moduleId] = { i: moduleId, l: false, exports: {} });
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }
    __webpack_require__.r = function (exports) {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        }
        Object.defineProperty(exports, '__esModule', { value: true });
    };
    __webpack_require__.t = function (value, mode) {
        value = __webpack_require__(value);
        var ns = Object.create(null);
        Object.defineProperty(ns, "__esModule", { value: true });
        Object.defineProperty(ns, "default", { enumerable: true, value: value });
        return ns;
    };

    __webpack_require__.e = function requireEnsure(chunkId) {
        var promises = [];
        var installedChunkData = installedChunks[chunkId];
        var promise = new Promise(function (resolve, reject) {
            installedChunkData = installedChunks[chunkId] = [resolve, reject];
        });
        promises.push((installedChunkData[2] = promise));
        var script = document.createElement("script");
        script.src = jsonpScriptSrc(chunkId);
        document.head.appendChild(script);
        return Promise.all(promises);
    }
    var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);
    var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
    jsonpArray.push = webpackJsonpCallback;
+    jsonpArray = jsonpArray.slice();
+    for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
+    var parentJsonpFunction = oldJsonpFunction;
    return __webpack_require__(__webpack_require__.s = "./src/main1.js");
})
    ({
        "./src/main1.js":
            (function (module, exports, __webpack_require__) {
                document.getElementById('main1-loadC1').addEventListener('click', () => {
                    __webpack_require__.e("c1").then(__webpack_require__.bind(null, "./src/c1.js")).then(c1 => {
                        console.log(c1.default)
                    })
                });
                document.getElementById('main1-loadC2').addEventListener('click', () => {
                    __webpack_require__.e("c2").then(__webpack_require__.bind(null, "./src/c2.js")).then(c1 => {
                        console.log(c1.default)
                    })
                });
                document.getElementById('loadMain2').addEventListener('click', () => {
                    let script = document.createElement('script');
                    script.src = 'main2.js';
                    document.body.appendChild(script);
                });
            })
    })
```



# webpack-2.loader

## 1. loader运行的总体流程

- `Compiler.js`中会为将用户配置与默认配置合并，其中就包括了`loader`部分
- webpack就会根据配置创建`NormalModuleFactory`,它可以用来创建`NormalModule`
- 在工厂创建NormalModule实例之前还要通过loader的resolver来解析loader路径
- 在NormalModule实例创建之后，则会通过其`build`方法来进行模块的构建。构建模块的第一步就是使用`loader`来加载并处理模块内容。而`loader-runner`这个库就是`webpack`中`loade`r的运行器
- 最后，将loader处理完的模块内容输出，进入后续的编译流程

![loader](http://img.zhufengpeixun.cn/loader.jpg)

## 2.babel-loader

- [babel-loader](https://github.com/babel/babel-loader/blob/master/src/index.js)
- [@babel/core](https://babeljs.io/docs/en/next/babel-core.html)
- [babel-plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx/)

| 属性              | 值                                     |
| :---------------- | :------------------------------------- |
| this.request      | /loaders/babel-loader.js!/src/index.js |
| this.userRequest  | /src/index.js                          |
| this.rawRequest   | ./src/index.js                         |
| this.resourcePath | /src/index.js                          |

```js
$ cnpm i @babel/preset-env @babel/core -D
const babel = require("@babel/core");
function loader(source,inputSourceMap) {
    //C:\webpack-analysis2\loaders\babel-loader.js!C:\webpack-analysis2\src\index.js
    const options = {
        presets: ['@babel/preset-env'],
        inputSourceMap:inputSourceMap,
        sourceMaps: true,//ourceMaps: true 是告诉 babel 要生成 sourcemap
        filename:this.request.split('!')[1].split('/').pop()
    }
    //在webpack.config.js中 增加devtool: 'eval-source-map'
    let {code,map,ast}=babel.transform(source,options);
    return this.callback(null,code,map,ast);
}
module.exports = loader;
resolveLoader: {
    alias: {//可以配置别名
      "babel-loader": resolve('./build/babel-loader.js')
    },//也可以配置loaders加载目录
    modules: [path.resolve('./loaders'), 'node_modules']
},
{
    test: /\.js$/,
    use:['babel-loader']
}
```

## 3.pitch

- 比如a!b!c!module, 正常调用顺序应该是c、b、a，但是真正调用顺序是 a(pitch)、b(pitch)、c(pitch)、c、b、a,如果其中任何一个pitching loader返回了值就相当于在它以及它右边的loader已经执行完毕
- 比如如果b返回了字符串"result b", 接下来只有a会被系统执行，且a的loader收到的参数是result b
- loader根据返回值可以分为两种，一种是返回js代码（一个module的代码，含有类似module.export语句）的loader，还有不能作为最左边loader的其他loader
- 有时候我们想把两个第一种loader chain起来，比如style-loader!css-loader! 问题是css-loader的返回值是一串js代码，如果按正常方式写style-loader的参数就是一串代码字符串
- 为了解决这种问题，我们需要在style-loader里执行require(css-loader!resources)

pitch与loader本身方法的执行顺序图

```js
|- a-loader `pitch`
  |- b-loader `pitch`
    |- c-loader `pitch`
      |- requested module is picked up as a dependency
    |- c-loader normal execution
  |- b-loader normal execution
|- a-loader normal execution
```

![loader_pitch](http://img.zhufengpeixun.cn/loader_pitch.jpg)

### 3.1 loaders\loader1.js

loaders\loader1.js

```js
function loader(source) {
    console.log('loader1',this.data);
    return source+"//loader1";
}
loader.pitch = function (remainingRequest,previousRequest,data) {
    data.name = 'pitch1';
    console.log('pitch1');
}
module.exports = loader;
```

### 3.2 loaders\loader2.js

loaders\loader2.js

```js
function loader(source) {
    console.log('loader2');
    return source+"//loader2";
}
loader.pitch = function (remainingRequest,previousRequest,data) {
    console.log('remainingRequest=',remainingRequest);
    console.log('previousRequest=',previousRequest);
    console.log('pitch2');
    //return 'console.log("pitch2")';
}
module.exports = loader;
```

### 3.3 loaders\loader3.js

loaders\loader3.js

```js
function loader(source) {
    console.log('loader3');
    return source+"//loader3";
}
loader.pitch = function () {
    console.log('pitch3');
}
module.exports = loader;
```

### 3.4 webpack.config.js

```js
 {
    test: /\.js$/,
    use: ['loader1', 'loader2', 'loader3']
 }
```

## 4.loader-runner

### 4.1 loader类型

- [loader的叠加顺序](https://github.com/webpack/webpack/blob/v4.39.3/lib/NormalModuleFactory.js#L159-L339) = post(后置)+inline(内联)+normal(正常)+pre(前置)

### 4.2 特殊配置

- [loaders/#configuration](https://webpack.js.org/concepts/loaders/#configuration)

| 符号 | 变量                 | 含义                                  |                                                              |
| :--- | :------------------- | :------------------------------------ | ------------------------------------------------------------ |
| `-!` | noPreAutoLoaders     | 不要前置和普通loader                  | Prefixing with -! will disable all configured preLoaders and loaders but not postLoaders |
| `!`  | noAutoLoaders        | 不要普通loader                        | Prefixing with ! will disable all configured normal loaders  |
| `!!` | noPrePostAutoLoaders | 不要前后置和普通loader,只要内联loader | Prefixing with !! will disable all configured loaders (preLoaders, loaders, postLoaders) |

### 4.2 查找规则执行

```js
let path = require("path");
let nodeModules = path.resolve(__dirname, "node_modules");
let request = "-!inline-loader1!inline-loader2!./styles.css";
//首先解析出所需要的 loader，这种 loader 为内联的 loader
let inlineLoaders = request
  .replace(/^-?!+/, "")
  .replace(/!!+/g, "!")
  .split("!");
let resource = inlineLoaders.pop();//// 获取资源的路径
let resolveLoader = loader => path.resolve(nodeModules, loader);
//从相对路径变成绝对路径
inlineLoaders = inlineLoaders.map(resolveLoader);
let rules = [
  {
    enforce: "pre",
    test: /\.css?$/,
    use: ["pre-loader1", "pre-loader2"]
  },
  {
    test: /\.css?$/,
    use: ["normal-loader1", "normal-loader2"]
  },
  {
    enforce: "post",
    test: /\.css?$/,
    use: ["post-loader1", "post-loader2"]
  }
];
let preLoaders = [];
let postLoaders = [];
let normalLoaders = [];
for(let i=0;i<rules.length;i++){
    let rule = rules[i];
    if(rule.test.test(resource)){
        if(rule.enforce=='pre'){
          preLoaders.push(...rule.use);
        }else if(rule.enforce=='post'){
          postLoaders.push(...rule.use);
        }else{
          normalLoaders.push(...rule.use);   
        }
    }
}
preLoaders = preLoaders.map(resolveLoader);
postLoaders= postLoaders.map(resolveLoader);
normalLoaders = normalLoaders.map(resolveLoader);

let loaders = [];
//noPrePostAutoLoaders  忽略所有的 preLoader / normalLoader / postLoader
if(request.startsWith('!!')){
  loaders = inlineLoaders;//只保留inline
//noPreAutoLoaders 是否忽略 preLoader 以及 normalLoader
}else if(request.startsWith('-!')){
  loaders = [...postLoaders,...inlineLoaders];//只保留post和inline
//是否忽略 normalLoader  
}else if(request.startsWith('!')){
  loaders = [...postLoaders,...inlineLoaders,...preLoaders];//保留post inline pre
}else{
  loaders = [...postLoaders,...inlineLoaders,...normalLoaders,...preLoaders];
}
console.log(loaders);
```

### 4.4 run-loader

- [LoaderRunner](https://github.com/webpack/loader-runner/blob/v2.4.0/lib/LoaderRunner.js)
- [NormalModuleFactory-noPreAutoLoaders](https://github.com/webpack/webpack/blob/v4.39.3/lib/NormalModuleFactory.js#L180)
- [NormalModule-runLoaders](https://github.com/webpack/webpack/blob/v4.39.3/lib/NormalModule.js#L292)

```js
let readFile = require("fs");
let path = require("path");
function createLoaderObject(loader) {
  let obj = { data: {} };
  obj.request = loader;
  obj.normal = require(loader);
  obj.pitch = obj.normal.pitch;
  return obj;
}
function runLoaders(options, callback) {
  let loaderContext = {};
  let resource = options.resource;
  let loaders = options.loaders;
  loaders = loaders.map(createLoaderObject);
  loaderContext.loaderIndex = 0;
  loaderContext.readResource = readFile;
  loaderContext.resource = resource;
  loaderContext.loaders = loaders;
  let isSync = true;
  var innerCallback = (loaderContext.callback = function(err, args) {
    loaderContext.loaderIndex--;
    iterateNormalLoaders(loaderContext, args, callback);
  });
  loaderContext.async = function async() {
    isSync = false;
    return innerCallback;
  };
  Object.defineProperty(loaderContext, "request", {
    get: function() {
      return loaderContext.loaders
        .map(function(o) {
          return o.request;
        })
        .concat(loaderContext.resource)
        .join("!");
    }
  });
  Object.defineProperty(loaderContext, "remainingRequest", {
    get: function() {
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex + 1)
        .map(function(o) {
          return o.request;
        })
        .concat(loaderContext.resource || "")
        .join("!");
    }
  });
  Object.defineProperty(loaderContext, "currentRequest", {
    enumerable: true,
    get: function() {
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex)
        .map(function(o) {
          return o.request;
        })
        .concat(loaderContext.resource || "")
        .join("!");
    }
  });
  Object.defineProperty(loaderContext, "previousRequest", {
    get: function() {
      return loaderContext.loaders
        .slice(0, loaderContext.loaderIndex)
        .map(function(o) {
          return o.request;
        })
        .join("!");
    }
  });
  Object.defineProperty(loaderContext, "data", {
    get: function() {
      return loaderContext.loaders[loaderContext.loaderIndex].data;
    }
  });
  iteratePitchingLoaders(loaderContext, callback);
  function iteratePitchingLoaders(loaderContext, callback) {
    if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
      loaderContext.loaderIndex--;
      return processResource(loaderContext, callback);
    }

    let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
    let fn = currentLoaderObject.pitch;
    if (!fn) return iteratePitchingLoaders(options, loaderContext, callback);

    let args = fn.apply(loaderContext, [
      loaderContext.remainingRequest,
      loaderContext.previousRequest,
      currentLoaderObject.data
    ]);
    if (args) {
      loaderContext.loaderIndex--;
      return iterateNormalLoaders(loaderContext, args, callback);
    } else {
      loaderContext.loaderIndex++;
      iteratePitchingLoaders(loaderContext, callback);
    }
    function processResource(loaderContext, callback) {
      let buffer = loaderContext.readResource.readFileSync(
        loaderContext.resource,
        "utf8"
      );
      iterateNormalLoaders(loaderContext, buffer, callback);
    }
  }
  function iterateNormalLoaders(loaderContext, args, callback) {
    if (loaderContext.loaderIndex < 0) return callback(null, args);

    var currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
    var fn = currentLoaderObject.normal;
    if (!fn) {
      loaderContext.loaderIndex--;
      return iterateNormalLoaders(loaderContext, args, callback);
    }
    args = fn.apply(loaderContext, [args]);
    if (isSync) {
      loaderContext.loaderIndex--;
      iterateNormalLoaders(loaderContext, args, callback);
    }
  }
}

let entry = "./src/world.js";

let options = {
  resource: path.join(__dirname, entry),
  loaders: [
    path.join(__dirname, "loaders/loader1.js"),
    path.join(__dirname, "loaders/loader2.js"),
    path.join(__dirname, "loaders/loader3.js")
  ]
};

runLoaders(options, (err, result) => {
  console.log(result);
});
```

## 5. file

- `file-loader` 并不会对文件内容进行任何转换，只是复制一份文件内容，并根据配置为他生成一个唯一的文件名。

### 5.1 file-loader

- [loader-utils](https://github.com/webpack/loader-utils)
- [file-loader](https://github.com/webpack-contrib/file-loader/blob/master/src/index.js)
- [public-path](https://webpack.js.org/guides/public-path/#on-the-fly)

```js
const { getOptions, interpolateName } = require('loader-utils');
function loader(content) {
  let options=getOptions(this)||{};
  let url = interpolateName(this, options.filename || "[hash].[ext]", {content});
  this.emitFile(url, content);
  return `module.exports = ${JSON.stringify(url)}`;
}
loader.raw = true;
module.exports = loader;
```

- 通过 `loaderUtils.interpolateName` 方法可以根据 options.name 以及文件内容生成一个唯一的文件名 url（一般配置都会带上hash，否则很可能由于文件重名而冲突）
- 通过 `this.emitFile(url, content)` 告诉 webpack 我需要创建一个文件，webpack会根据参数创建对应的文件，放在 `public path` 目录下
- 返回 `module.exports = ${JSON.stringify(url)}`,这样就会把原来的文件路径替换为编译后的路径

### 5.2 url-loader

```js
let { getOptions } = require('loader-utils');
var mime = require('mime');
function loader(source) {
    let options=getOptions(this)||{};
    let { limit, fallback='file-loader' } = options;
    if (limit) {
      limit = parseInt(limit, 10);
    }
    const mimetype=mime.getType(this.resourcePath);
    if (!limit || source.length < limit) {
        let base64 = `data:${mimetype};base64,${source.toString('base64')}`;
        return `module.exports = ${JSON.stringify(base64)}`;
    } else {
        let fileLoader = require(fallback || 'file-loader');
        return fileLoader.call(this, source);
    }
}
loader.raw = true;
module.exports = loader;
```

### 5.3 样式处理

- [css-loader](https://github.com/webpack-contrib/css-loader/blob/master/lib/loader.js) 的作用是处理css中的 @import 和 url 这样的外部资源
- [style-loader](https://github.com/webpack-contrib/style-loader/blob/master/index.js) 的作用是把样式插入到 DOM中，方法是在head中插入一个style标签，并把样式写入到这个标签的 innerHTML里
- [less-loader](https://github.com/webpack-contrib/less-loader) 把less编译成css
- [pitching-loader](https://webpack.js.org/api/loaders/#pitching-loader)
- [loader-utils](https://github.com/webpack/loader-utils)
- [!!](https://webpack.js.org/concepts/loaders/#configuration)

```js
$ cnpm i less postcss css-selector-tokenizer -D
```

#### 5.3.2 使用less-loader

##### 5.3.2.1 index.js

src\index.js

```js
import './index.less';
```

##### 5.3.2.2 src\index.less

src\index.less

```less
@color:red;
#root{
    color:@color;
}
```

##### 5.3.2.3 src\index.html

src\index.html

```html
<div id="root">hello</div>
<div class="avatar"></div>
```

##### 5.3.2.4 webpack.config.js

webpack.config.js

```js
{
  test: /\.less$/,
  use: [
    'style-loader',
    'less-loader'
  ]
}
```

##### 5.3.2.5 less-loader.js

```js
let less = require('less');
function loader(source) {
    let callback = this.async();
    less.render(source, { filename: this.resource }, (err, output) => {
        callback(err, output.css);
    });
}
module.exports = loader;
```

##### 5.3.2.6 style-loader

```js
 function loader(source) {
    let script=(`
      let style = document.createElement("style");
      style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style);
    module.exports = "";
    `);
    return script;
} 
module.exports = loader;
```

#### 5.3.5 两个左侧模块连用

##### 5.3.5.1 less-loader.js

```js
let less = require('less');
function loader(source) {
    let callback = this.async();
    less.render(source, { filename: this.resource }, (err, output) => {
        callback(err, `module.exports = ${JSON.stringify(output.css)}`);
    });
}
module.exports = loader;
```

##### 5.3.5.2 style-loader.js

```js
let loaderUtils = require("loader-utils");
function loader(source) {

}
//https://github.com/webpack/webpack/blob/v4.39.3/lib/NormalModuleFactory.js#L339
loader.pitch = function (remainingRequest, previousRequest, data) {
  //C:\webpack-analysis2\loaders\less-loader.js!C:\webpack-analysis2\src\index.less
  console.log('previousRequest', previousRequest);//之前的路径
  //console.log('currentRequest', currentRequest);//当前的路径
  console.log('remainingRequest', remainingRequest);//剩下的路径
  console.log('data', data);
  // !! noPrePostAutoLoaders 不要前后置和普通loader
  //__webpack_require__(/*! !../loaders/less-loader.js!./index.less */ "./loaders/less-loader.js!./src/index.less");
  let style = `
    var style = document.createElement("style");
    style.innerHTML = require(${loaderUtils.stringifyRequest(this, "!!" + remainingRequest)});
    document.head.appendChild(style);
 `;
  return style;
}
module.exports = loader;
```

#### 5.3.6 css-loader.js

- `css-loader` 的作用是处理css中的 `@import` 和 `url` 这样的外部资源
- [postcss](https://github.com/postcss/postcss#usage)
- Avoid CSS @import CSS @importallows stylesheets to import other stylesheets. When CSS @import isused from an external stylesheet, the browser is unable to downloadthe stylesheets in parallel, which adds additional round-trip timesto the overall page load.

##### 5.3.6.1 src\index.js

src\index.js

```js
require('./style.css');
```

##### 5.3.6.2 src\style.css

```css
@import './global.css';
.avatar {
  width: 100px;
  height: 100px;
  background-image: url('./baidu.png');
  background-size: cover;
}
div{
  color:red;
}
```

##### 5.3.6.3 src\global.css

```css
body {
    background-color: green;
}
```

##### 5.3.6.4 webpack.config.js

```diff
+      {
+        test: /\.css$/,
+        use: [
+          'style-loader',
+          'css-loader'
+        ]
+      },
+      {
+        test: /\.png$/,
+        use: [
+          'file-loader'
+        ]
+      }
```

##### 5.3.6.5 css-loader.js

loaders\css-loader.js

```js
var postcss = require("postcss");
var loaderUtils = require("loader-utils");
var Tokenizer = require("css-selector-tokenizer");

const cssLoader = function (inputSource) {
    const cssPlugin = (options) => {
        return (root) => {
            root.walkAtRules(/^import$/i, (rule) => {
                rule.remove();
                options.imports.push(rule.params.slice(1, -1));
            });
            root.walkDecls((decl) => {
                var values = Tokenizer.parseValues(decl.value);
                values.nodes.forEach(function (value) {
                    value.nodes.forEach(item => {
                        if (item.type === "url") {
                            item.url = "`+require(" + loaderUtils.stringifyRequest(this, item.url) + ")+`";
                        }
                    });
                });
                decl.value = Tokenizer.stringifyValues(values);
                console.log(decl);
            });
        };
    }

    let callback = this.async();
    let options = { imports: [] };
    let pipeline = postcss([cssPlugin(options)]);
    pipeline.process(inputSource).then((result) => {
        let importCss = options.imports.map(url => "`+require(" + loaderUtils.stringifyRequest(this, "!!css-loader!" + url) + ")+`").join('\r\n');
        callback(
            null,
            'module.exports=`' + importCss + '\n' + result.css + '`'
        );
    });
};

module.exports = cssLoader;
```



