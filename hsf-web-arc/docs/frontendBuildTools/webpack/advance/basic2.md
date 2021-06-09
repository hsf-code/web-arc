---
title: webpack分析（二）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# 3.webpack-bundle

## 1. webpack 介绍

- `Webpack`是一个前端资源加载/打包工具。它将根据模块的依赖关系进行静态分析，然后将这些模块按照指定的规则生成对应的静态资源。

![webpack_intro](http://img.zhufengpeixun.cn/webpack_intro.gif)

## 2. 预备知识

### 2.1 toStringTag

- `Symbol.toStringTag` 是一个内置 symbol，它通常作为对象的属性键使用，对应的属性值应该为字符串类型，这个字符串用来表示该对象的自定义类型标签
- 通常只有内置的 `Object.prototype.toString()` 方法会去读取这个标签并把它包含在自己的返回值里。

```js
console.log(Object.prototype.toString.call("foo")); // "[object String]"
console.log(Object.prototype.toString.call([1, 2])); // "[object Array]"
console.log(Object.prototype.toString.call(3)); // "[object Number]"
console.log(Object.prototype.toString.call(true)); // "[object Boolean]"
console.log(Object.prototype.toString.call(undefined)); // "[object Undefined]"
console.log(Object.prototype.toString.call(null)); // "[object Null]"
let myExports = {};
Object.defineProperty(myExports, Symbol.toStringTag, { value: "Module" });
console.log(Object.prototype.toString.call(myExports)); //[object Module]
[object String]
[object Array]
[object Number]
[object Boolean]
[object Undefined]
[object Null]
[object Module]
```

### 2.2 defineProperty

- defineProperty

   

  方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。

  - obj 要在其上定义属性的对象。
  - prop 要定义或修改的属性的名称。
  - descriptor 将被定义或修改的属性描述符。

```js
let obj = {};
var ageValue = 10;

Object.defineProperty(obj, "age", {
  //writable: true, //是否可修改
  //value: 10, //writeable 和 set不能混用
  get() {
    return ageValue;
  },
  set(newValue) {
    ageValue = newValue;
  },

  enumerable: true, //是否可枚举
  configurable: true, //是否可配置可删除
});

console.log(obj.age);
obj.age = 20;
console.log(obj.age);
```

## 3. 同步加载

### 3.1 安装模块

```js
cnpm i webpack webpack-cli html-webpack-plugin clean-webpack-plugin -D
```

### 3.2 webpack.config.js

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {},
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ["**/*"] }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
  ],
  devServer: {},
};
```

### 3.2 index.js

src\index.js

```js
let title = require("./title.js");
console.log(title);
```

### 3.3 title.js

src\title.js

```js
module.exports = "title";
```

### 3.4 index.html

src\index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>webpack</title>
  </head>
  <body></body>
</html>
```

### 3.5 package.json

package.json

```json
  "scripts": {
    "build": "webpack"
  }
```

### 3.6 打包文件

```js
(() => {
  var modules = ({
    "./src/title.js":
      ((module) => {
        module.exports = "title";
      })
  });
  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = cache[moduleId] = {
      exports: {}
    };
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  (() => {
    let title = require("./src/title.js");
    console.log(title);
  })();
})();
```

## 4. 兼容性实现

### 4.1 common.js 加载 common.js

#### 4.1.1 index.js

```js
let title = require("./title");
console.log(title.name);
console.log(title.age);
```

#### 4.1.2 title.js

```js
exports.name = "title_name";
exports.age = "title_age";
```

#### 4.1.3 main.js

```js
(() => {
  var modules = ({
    "./src/title.js":
      ((module, exports) => {
        exports.name = "title_name";
        exports.age = "title_age";
      })
  });
  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = cache[moduleId] = {
      exports: {}
    };
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  (() => {
    let title = require("./src/title.js");
    console.log(title.name);
    console.log(title.age);
  })();
})();
```

### 4.2 common.js 加载 ES6 modules

#### 4.2.1 index.js

```js
let title = require("./title");
console.log(title);
console.log(title.age);
```

#### 4.2.2 title.js

```js
export default "title_name";
export const age = "title_age";
```

#### 4.2.3 main.js

```js
(() => {
  var modules = ({
    "./src/title.js":
      ((module, exports, require) => {
        require.renderEsModule(exports);
        require.defineProperties(exports, {
          "default": () => DEFAULT_EXPORT,
          "age": () => age
        });
        const DEFAULT_EXPORT = "title_name";
        const age = "title_age";
      })
  });
  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = cache[moduleId] = {
      exports: {}
    };
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  require.defineProperties = (exports, definition) => {
    for (var key in definition) {
      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
    }
  };
  require.renderEsModule = (exports) => {
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(exports, '__esModule', { value: true });
  };
  (() => {
    let title = require("./src/title.js");
    console.log(title);
    console.log(title.age);
  })();
})();
```

### 4.3 ES6 modules 加载 ES6 modules

#### 4.3.1 index.js

```js
import name, { age } from "./title";
console.log(name);
console.log(age);
```

#### 4.3.2 title.js

```js
export default name = "title_name";
export const age = "title_age";
```

#### 4.3.3 main.js

```js
(() => {
  var modules = ({
    "./src/index.js":
      ((module, exports, require) => {
        require.renderEsModule(exports);
        var title = require("./src/title.js");
        console.log(title.default);
        console.log(title.age);
      }),
    "./src/title.js":
      ((module, exports, require) => {
        require.renderEsModule(exports);
        require.defineProperties(exports, {
          "default": () => DEFAULT_EXPORT,
          "age": () => age
        });
        const DEFAULT_EXPORT = (name = "title_name");
        const age = "title_age";
      })
  });
  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = cache[moduleId] = {
      exports: {}
    };
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  require.defineProperties = (exports, definition) => {
    for (var key in definition) {
      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
    }
  };
  require.renderEsModule = (exports) => {
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(exports, '__esModule', { value: true });
  };
  require("./src/index.js");
})();
```

### 4.4 ES6 modules 加载 common.js

#### 4.4.1 index.js

```js
import name, { age } from "./title";
console.log(name);
console.log(age);
```

#### 4.4.2 title.js

```js
module.exports = {
  name: "title_name",
  age: "title_age",
};
```

#### 4.4.3 main.js

```js
(() => {
  var modules = ({
    "./src/index.js":
      ((module, exports, require) => {
        require.renderEsModule(exports);
        var title = require("./src/title.js");
        var title_default = require.n(title);
        console.log((title_default()));
        console.log(title.age);
      }),
    "./src/title.js":
      ((module) => {
        module.exports = {
          name: "title_name",
          age: "title_age",
        };
      })
  });
  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = cache[moduleId] = {
      exports: {}
    };
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  require.n = (module) => {
    var getter = module && module.__esModule ?
      () => module['default'] :
      () => module;
    return getter;
  };;
  require.defineProperties = (exports, definition) => {
    for (var key in definition) {
      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
    }
  };
  require.renderEsModule = (exports) => {
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(exports, '__esModule', { value: true });
  };
  require("./src/index.js");
})();
```

## 5.异步加载

### 5.1 webpack.config.js

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {},
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ["**/*"] }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
  ],
  devServer: {},
};
```

### 5.2 src\index.js

src\index.js

```js
import(/* webpackChunkName: "hello" */ "./hello").then((result) => {
    console.log(result.default);
});
```

### 5.3 hello.js

src\hello.js

```js
export default 'hello';
```

### 5.4 dist\main.js

```js
(() => {
  var modules = ({});
  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = cache[moduleId] = {
      exports: {}
    };
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  require.m = modules;
  require.defineProperties = (exports, definition) => {
    for (var key in definition) {
      if (require.ownProperty(definition, key) && !require.ownProperty(exports, key)) {
        Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
      }
    }
  };
  require.find = {};
  require.ensure = (chunkId) => {
    let promises = [];
    require.find.jsonp(chunkId, promises);
    return Promise.all(promises);
  };
  require.unionFileName = (chunkId) => {
    return "" + chunkId + ".main.js";
  };
  require.ownProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
  require.load = (url) => {
    var script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);
  };
  require.renderEsModule = (exports) => {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };
  require.publicPath = '';
  var installedChunks = {
    "main": 0
  };
  require.find.jsonp = (chunkId, promises) => {
    var promise = new Promise((resolve, reject) => {
      installedChunkData = installedChunks[chunkId] = [resolve, reject];
    });
    promises.push(installedChunkData[2] = promise);
    var url = require.publicPath + require.unionFileName(chunkId);
    require.load(url);
  };
  var webpackJsonpCallback = (data) => {
    var [chunkIds, moreModules] = data;
    var moduleId, chunkId, i = 0, resolves = [];
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      resolves.push(installedChunks[chunkId][0]);
      installedChunks[chunkId] = 0;
    }
    for (moduleId in moreModules) {
      require.m[moduleId] = moreModules[moduleId];
    }
    while (resolves.length) {
      resolves.shift()();
    }
  }
  var chunkLoadingGlobal = window["webpack5"] = window["webpack5"] || [];
  chunkLoadingGlobal.push = webpackJsonpCallback;
  require.ensure("hello").then(require.bind(require, "./src/hello.js")).then((result) => {
    console.log(result.default);
  });
})();
```

### 5.5 hello.main.js

hello.main.js

```js
(window["webpack5"] = window["webpack5"] || []).push([["hello"], {
  "./src/hello.js":
    ((module, exports, __webpack_require__) => {
      "use strict";
      __webpack_require__.renderEsModule(exports);
      __webpack_require__.defineProperties(exports, {
        "default": () => DEFAULT_EXPORT
      });
      const DEFAULT_EXPORT = ('hello');
    })
}]);
```





# 4.webpack-ast

## 1.抽象语法树(Abstract Syntax Tree)

- `webpack`和`Lint`等很多的工具和库的核心都是通过`Abstract Syntax Tree`抽象语法树这个概念来实现对代码的检查、分析等操作的

## 2.抽象语法树用途

- 代码语法的检查、代码风格的检查、代码的格式化、代码的高亮、代码错误提示、代码自动补全等等
  - 如 JSLint、JSHint 对代码错误或风格的检查，发现一些潜在的错误
  - IDE 的错误提示、格式化、高亮、自动补全等等
- 代码混淆压缩
  - UglifyJS2 等
- 优化变更代码，改变代码结构使达到想要的结构
  - 代码打包工具 webpack、rollup 等等
  - CommonJS、AMD、CMD、UMD 等代码规范之间的转化
  - CoffeeScript、TypeScript、JSX 等转化为原生 Javascript

## 3.抽象语法树定义

- 这些工具的原理都是通过`JavaScript Parser`把代码转化为一颗抽象语法树（AST），这颗树定义了代码的结构，通过操纵这颗树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作

![ast](http://img.zhufengpeixun.cn/ast.jpg)

## 4. JavaScript Parser

- `JavaScript Parser`是把JavaScript源码转化为抽象语法树的解析器。
- 浏览器会把JavaScript源码通过解析器转为抽象语法树,再进一步转化为字节码或直接生成机器码。
- 一般来说每个JavaScript引擎都会有自己的抽象语法树格式，Chrome 的 v8 引擎，firefox 的 SpiderMonkey 引擎等等，MDN 提供了详细[SpiderMonkey AST format](https://developer.mozilla.org/zh-CN/docs/MDN/Doc_status/SpiderMonkey) 的详细说明，算是业界的标准。

### 4.1 常用的 JavaScript Parser

- esprima
- traceur
- acorn
- shift

### 4.2 遍历

```js
cnpm i esprima estraverse- S
let esprima = require('esprima');//把JS源代码转成AST语法树
let estraverse = require('estraverse');///遍历语法树,修改树上的节点
let escodegen = require('escodegen');//把AST语法树重新转换成代码
let code = `function ast(){}`;
let ast = esprima.parse(code);
let indent = 0;
const padding = ()=>" ".repeat(indent);
estraverse.traverse(ast,{
    enter(node){
        console.log(padding()+node.type+'进入');
        if(node.type === 'FunctionDeclaration'){
            node.id.name = 'newAst';
        }
        indent+=2;
    },
    leave(node){
        indent-=2;
        console.log(padding()+node.type+'离开');
    }
});
Program进入
  FunctionDeclaration进入
    Identifier进入
    Identifier离开
    BlockStatement进入
    BlockStatement离开
  FunctionDeclaration离开
Program离开
```

## 5.babel

- Babel 能够转译 `ECMAScript 2015+` 的代码，使它在旧的浏览器或者环境中也能够运行
- 工作过程分为三个部人
  - Parse(解析) 将源代码转换成抽象语法树，树上有很多的[estree节点](https://github.com/estree/estree)
  - Transform(转换) 对抽象语法树进行转换
  - Generate(代码生成) 将上一步经过转换过的抽象语法树生成新的代码

![ast-compiler-flow.jpg](https://img.zhufengpeixun.com/ast-compiler-flow.jpg)

### 5.1 AST遍历

- AST是深度优先遍历
- 访问者模式 Visitor 对于某个对象或者一组对象，不同的访问者，产生的结果不同，执行操作也不同
- Visitor 的对象定义了用于 AST 中获取具体节点的方法
- Visitor 上挂载以节点 `type` 命名的方法，当遍历 AST 的时候，如果匹配上 type，就会执行对应的方法

### 5.2 babel 插件

- [@babel/core](https://www.npmjs.com/package/@babel/core) Babel 的编译器，核心 API 都在这里面，比如常见的 transform、parse
- [babylon](http://www.zhufengpeixun.com/grow/html/103.4.webpack-ast.html) Babel 的解析器
- [babel-types](https://github.com/babel/babel/tree/master/packages/babel-types) 用于 AST 节点的 Lodash 式工具库, 它包含了构造、验证以及变换 AST 节点的方法，对编写处理 AST 逻辑非常有用
- [babel-traverse](https://www.npmjs.com/package/babel-traverse)用于对 AST 的遍历，维护了整棵树的状态，并且负责替换、移除和添加节点
- [babel-types-api](https://babeljs.io/docs/en/next/babel-types.html)
- [Babel 插件手册](https://github.com/brigand/babel-plugin-handbook/blob/master/translations/zh-Hans/README.md#asts)
- [babeljs.io](https://babeljs.io/en/repl.html) babel 可视化编译器

#### 5.2.1 转换箭头函数

- [babel-plugin-transform-es2015-arrow-functions](https://www.npmjs.com/package/babel-plugin-transform-es2015-arrow-functions)
- [babeljs.io](https://babeljs.io/en/repl.html) babel 可视化编译器
- [babel-handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md)
- [babel-types-api](https://babeljs.io/docs/en/next/babel-types.html)

转换前

```js
const sum = (a,b)=>{
    console.log(this);
    return a+b;
}
```

转换后

```js
var _this = this;

const sum = function (a, b) {
  console.log(_this);
  return a + b;
};
npm i @babel/core babel-types -D
```

实现

```js
let core = require('@babel/core');
let types = require('babel-types');
let  BabelPluginTransformEs2015ArrowFunctions = require('babel-plugin-transform-es2015-arrow-functions');
const sourceCode = `
const sum = (a,b)=>{
    console.log(this);
    return a+b;
}
`;
//babel插件其实是一个对象，它会有一个visitor访问器
let BabelPluginTransformEs2015ArrowFunctions2 = {
    //每个插件都会有自己的访问器
    visitor:{
        //属性就是节点的类型，babel在遍历到对应类型的节点的时候会调用此函数
        ArrowFunctionExpression(nodePath){//参数是节点的数据
            let node = nodePath.node;//获取 当前路径上的节点
            //处理this指针的问题
            hoistFunctionEnvironment(nodePath);
            node.type = 'FunctionExpression';
        }
    }
}
function hoistFunctionEnvironment(fnPath){
   const thisEnvFn = fnPath.findParent(p=>{
       //是一个函数，不能是箭头函数 或者 是根节点也可以
       return (p.isFunction() && !p.isArrowFunctionExpression())||p.isProgram()
   });
   //找一找当前作用域哪些地方用到了this的路径
   let thisPaths = getScopeInfoInformation(fnPath);
   //声明了一个this的别名变量，默认是_this __this
   let thisBinding = '_this';
   if(thisPaths.length>0){
       //在thisEnvFn的作用域内添加一个变量，变量名_this,初始化的值为this
    thisEnvFn.scope.push({
        id:types.identifier(thisBinding),
        init:types.thisExpression()    
    });
    thisPaths.forEach(item=>{
        //创建一个_this的标识符  
        let thisBindingRef = types.identifier(thisBinding);
        //把老的路径 上的节点替换成新节点
        item.replaceWith(thisBindingRef);
    });
   }
}
function getScopeInfoInformation(fnPath){
  let thisPaths = [];
  //遍历当前path所有的子节点路径，
  //告诉 babel我请帮我遍历fnPath的子节点，遇到ThisExpression节点就执行函数，并且把对应的路径传进去 
  fnPath.traverse({
    ThisExpression(thisPath){
        thisPaths.push(thisPath);
    }
  });
  return thisPaths;
}

let targetCode = core.transform(sourceCode,{
    plugins:[BabelPluginTransformEs2015ArrowFunctions2]
});
console.log(targetCode.code);
```

#### 5.2.2 把类编译为 Function

- [@babel/plugin-transform-classes](https://www.npmjs.com/package/@babel/plugin-transform-classes)

es6

```js
class Person {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}
```

![classast](http://img.zhufengpeixun.cn/classast.png)

es5

```js
function Person(name) {
  this.name = name;
}
Person.prototype.getName = function () {
  return this.name;
};
```

![es5class1](http://img.zhufengpeixun.cn/es5class1.png) ![es5class2](http://img.zhufengpeixun.cn/es5class2.png)

实现

```js
//核心库，提供了语法树的生成和遍历的功能
let babel = require('@babel/core');
//工具类，可能帮我们生成相应的节点
let t = require('babel-types');
//babel_plugin-transform-classes
let TransformClasses = require('@babel/plugin-transform-classes');
let es6Code = `class Person{
    constructor(name){
        this.name = name;
    }
    getName(){
        return this.name;
    }
}
`;
let transformClasses2 = {
    visitor: {
        ClassDeclaration(nodePath) {
            let {node} = nodePath;
            let id = node.id;//{type:'Identifier',name:'Person'}
            console.log(id);
            let methods = node.body.body;
            let nodes = [];
            methods.forEach(classMethod=>{
                if(classMethod.kind === 'constructor'){
                    let constructorFunction = t.functionDeclaration(
                        id, classMethod.params, classMethod.body,
                         classMethod.generator, classMethod.async);
                         nodes.push(constructorFunction);
                }else{
                    let prototypeMemberExpression = t.memberExpression(id, t.identifier('prototype'));
                    let keyMemberExpression = t.memberExpression(prototypeMemberExpression, classMethod.key);
                    let memberFunction = t.functionExpression(
                        id, classMethod.params, classMethod.body,
                         classMethod.generator, classMethod.async);
                    let assignmentExpression=t.assignmentExpression("=", 
                    keyMemberExpression,
                    memberFunction);
                    nodes.push(assignmentExpression);
                }
            });
            if(nodes.length==1){
                nodePath.replaceWith(nodes[0]);
            }else if(nodes.length>1){
                nodePath.replaceWithMultiple(nodes);
            }
        }
    }
}


let es5Code = babel.transform(es6Code,{
    plugins:[transformClasses2]
});
console.log(es5Code.code);
```

## 6. webpack TreeShaking插件

```js
var babel = require("@babel/core");
let { transform } = require("@babel/core");
```

### 6.1 实现按需加载

- [lodashjs](https://www.lodashjs.com/docs/4.17.5.html#concat)
- [babel-core](https://babeljs.io/docs/en/babel-core)
- [babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import)

```js
import { flatten, concat } from "lodash";
```

![treeshakingleft](http://img.zhufengpeixun.cn/treeshakingleft.png)

转换为

```js
import flatten from "lodash/flatten";
import concat from "lodash/flatten";
```

![treeshakingright](http://img.zhufengpeixun.cn/treeshakingright.png)

### 6.2 webpack 配置

```js
cnpm i webpack webpack-cli -D
const path = require("path");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve("dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options:{
                   plugins:[
                     [
                       path.resolve(__dirname,'plugins/babel-plugin-import.js'),
                       {
                         library:'lodash'
                       }
                     ]
                   ]
                }
        },
      },
    ],
  },
};
```

> 编译顺序为首先`plugins`从左往右,然后`presets`从右往左

### 6.3 babel 插件

plugins\babel-plugin-import.js

```js
let babel = require("@babel/core");
let types = require("babel-types");
const visitor = {
  ImportDeclaration: {
    enter(path, state = { opts }) {
      const specifiers = path.node.specifiers;
      const source = path.node.source;
      if (
        state.opts.library == source.value &&
        !types.isImportDefaultSpecifier(specifiers[0])
      ) {
        const declarations = specifiers.map((specifier, index) => {
          return types.ImportDeclaration(
            [types.importDefaultSpecifier(specifier.local)],
            types.stringLiteral(`${source.value}/${specifier.local.name}`)
          );
        });
        path.replaceWithMultiple(declarations);
      }
    },
  },
};
module.exports = function (babel) {
  return {
    visitor,
  };
};
```

## 7. 参考

- [Babel 插件手册](https://github.com/brigand/babel-plugin-handbook/blob/master/translations/zh-Hans/README.md#asts)
- [babel-types](https://github.com/babel/babel/tree/master/packages/babel-types)
- [不同的 parser 解析 js 代码后得到的 AST](https://astexplorer.net/)
- [在线可视化的看到 AST](http://resources.jointjs.com/demos/javascript-ast)
- [babel 从入门到入门的知识归纳](https://zhuanlan.zhihu.com/p/28143410)
- [Babel 内部原理分析](https://octman.com/blog/2016-08-27-babel-notes/)
- [babel-plugin-react-scope-binding](https://github.com/chikara-chan/babel-plugin-react-scope-binding)
- [transform-runtime](https://www.npmjs.com/package/babel-plugin-transform-runtime) Babel 默认只转换新的 JavaScript 语法，而不转换新的 API。例如，Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转译,启用插件 `babel-plugin-transform-runtime` 后，Babel 就会使用 babel-runtime 下的工具函数
- [ast-spec](https://github.com/babel/babylon/blob/master/ast/spec.md)
- [babel-handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md)



