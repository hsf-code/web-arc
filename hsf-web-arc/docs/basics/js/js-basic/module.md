---
title: 模块化
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

## 1. 模块化

模块化是指把一个复杂的系统分解到多个模块以方便编码。

### 1.1 命名空间

开发网页要通过命名空间的方式来组织代码

```
<script src="jquery.js">
```

- 命名空间冲突，两个库可能会使用同一个名称
- 无法合理地管理项目的依赖和版本；
- 无法方便地控制依赖的加载顺序。

### 1.2 CommonJS

CommonJS 是一种使用广泛的`JavaScript`模块化规范，核心思想是通过`require`方法来同步地加载依赖的其他模块，通过 module.exports 导出需要暴露的接口。

#### 1.2.1 用法

采用 CommonJS 导入及导出时的代码如下：

```
// 导入
const someFun= require('./moduleA');
someFun();

// 导出
module.exports = someFunc;
```

#### 1.2.2 原理

a.js

```javascript
let fs = require('fs');
let path = require('path');
let b = req('./b.js');
function req(mod) {
    let filename = path.join(__dirname, mod);
    let content = fs.readFileSync(filename, 'utf8');
    let fn = new Function('exports', 'require', 'module', '__filename', '__dirname', content + '\n return module.exports;');
    let module = {
        exports: {}
    };

    return fn(module.exports, req, module, __filename, __dirname);
}
```

b.js

```javascript
console.log('bbb');
exports.name = 'zfpx';
```

### 1.3 AMD

AMD 也是一种 JavaScript 模块化规范，与 CommonJS 最大的不同在于它采用异步的方式去加载依赖的模块。 AMD 规范主要是为了解决针对浏览器环境的模块化问题，最具代表性的实现是 requirejs。

AMD 的优点

- 可在不转换代码的情况下直接在浏览器中运行
- 可加载多个依赖
- 代码可运行在浏览器环境和 Node.js 环境下

AMD 的缺点

- JavaScript 运行环境没有原生支持 AMD，需要先导入实现了 AMD 的库后才能正常使用。

#### 1.3.1 用法

```javascript
// 定义一个模块
define('a', [], function () {
    return 'a';
});
define('b', ['a'], function (a) {
    return a + 'b';
});
// 导入和使用
require(['b'], function (b) {
    console.log(b);
});
```

#### 1.3.2 原理

```javascript
let factories = {};
function define(modName, dependencies, factory) {
    factory.dependencies = dependencies;
    factories[modName] = factory;
}
function require(modNames, callback) {
    let loadedModNames = modNames.map(function (modName) {
        let factory = factories[modName];
        let dependencies = factory.dependencies;
        let exports;
        require(dependencies, function (...dependencyMods) {
            exports = factory.apply(null, dependencyMods);
        });
        return exports;
    })
    callback.apply(null, loadedModNames);
}
```

### 1.4 ES6 模块化

ES6 模块化是`ECMA`提出的`JavaScript`模块化规范，它在语言的层面上实现了模块化。浏览器厂商和`Node.j`s `都宣布要原生支持该规范。它将逐渐取代`CommonJS`和`AMD`规范，成为浏览器和服务器通用的模块解决方案。 采用 ES6 模块化导入及导出时的代码如下

```javascript
// 导入
import { name } from './person.js';
// 导出
export const name = 'zfpx';
```

ES6模块虽然是终极模块化方案，但它的缺点在于目前无法直接运行在大部分 JavaScript 运行环境下，必须通过工具转换成标准的 ES5 后才能正常运行。

## 2. 自动化构建

构建就是做这件事情，把源代码转换成发布到线上的可执行 JavaScrip、CSS、HTML 代码，包括如下内容。

- 代码转换：ECMASCRIPT6 编译成 ECMASCRIPT5、LESS 编译成 CSS 等。
- 文件优化：压缩 JavaScript、CSS、HTML 代码，压缩合并图片等。
- 代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载。
- 模块合并：在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件。
- 自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器。
- 代码校验：在代码被提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过。
- 自动发布：更新完代码后，自动构建出线上发布代码并传输给发布系统。

## 3. Webpack

Webpack 是一个打包模块化 JavaScript 的工具，在 Webpack 里一切文件皆模块，通过 Loader 转换文件，通过 Plugin 注入钩子，最后输出由多个模块组合成的文件。Webpack 专注于构建模块化项目。

一切文件：JavaScript、CSS、SCSS、图片、模板，在 Webpack 眼中都是一个个模块，这样的好处是能清晰的描述出各个模块之间的依赖关系，以方便 Webpack 对模块进行组合和打包。 经过 Webpack 的处理，最终会输出浏览器能使用的静态资源。

## 3.1 安装 Webpack

在用 Webpack 执行构建任务时需要通过 webpack 可执行文件去启动构建任务，所以需要安装 webpack 可执行文件

## 3.1.1 安装 Webpack 到本项目

```javascript
# 安装最新稳定版
npm i -D webpack

# 安装指定版本
npm i -D webpack@<version>

# 安装最新体验版本
npm i -D webpack@beta
```

> npm i -D 是 `npm install --save-dev` 的简写，是指安装模块并保存到 `package.json` 的 `devDependencies`

## 3.1.2 安装 Webpack 到全局

安装到全局后你可以在任何地方共用一个 Webpack 可执行文件，而不用各个项目重复安装

```javascript
npm i -g webpack
```

> 推荐安装到当前项目，原因是可防止不同项目依赖不同版本的 Webpack 而导致冲突

## 3.1.2 使用 Webpack

## 3.1.3 使用 Webpack

```javascript
(function (modules) {
    function require(moduleId) {
        var module = {
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, require);
        return module.exports;

    }
    return require("./index.js");
})
    ({
        "./index.js":
            (function (module, exports, require) {
                eval("console.log('hello');\n\n");
            })
    });
#! /usr/bin/env node
const pathLib = require('path');
const fs = require('fs');
let ejs = require('ejs');
let cwd = process.cwd();
let { entry, output: { filename, path } } = require(pathLib.join(cwd, './webpack.config.js'));
let script = fs.readFileSync(entry, 'utf8');
let bundle = `
(function (modules) {
    function require(moduleId) {
        var module = {
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, require);
        return module.exports;

    }
    return require("<%-entry%>");
})
    ({
        "<%-entry%>":
            (function (module, exports, require) {
                eval("<%-script%>");
            })
    });
`
let bundlejs = ejs.render(bundle, {
    entry,
    script
});
try {
    fs.writeFileSync(pathLib.join(path, filename), bundlejs);
} catch (e) {
    console.error('编译失败 ', e);
}
console.log('compile sucessfully!');
```

## 3.1.4 依赖其它模块

```javascript
#! /usr/bin/env node
const pathLib = require('path');
const fs = require('fs');
let ejs = require('ejs');
let cwd = process.cwd();
let { entry, output: { filename, path } } = require(pathLib.join(cwd, './webpack.config.js'));
let script = fs.readFileSync(entry, 'utf8');
let modules = [];
script.replace(/require\(['"](.+?)['"]\)/g, function () {
    let name = arguments[1];
    let script = fs.readFileSync(name, 'utf8');
    modules.push({
        name,
        script
    });
});
let bundle = `
(function (modules) {
    function require(moduleId) {
        var module = {
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, require);
        return module.exports;
    }
    return require("<%-entry%>");
})
    ({
        "<%-entry%>":
            (function (module, exports, require) {
                eval(\`<%-script%>\`);
            })
       <%if(modules.length>0){%>,<%}%>
        <%for(let i=0;i<modules.length;i++){
            let module = modules[i];%>   
            "<%-module.name%>":
            (function (module, exports, require) {
                eval(\`<%-module.script%>\`);
            })
        <% }%>    
    });
`
let bundlejs = ejs.render(bundle, {
    entry,
    script,
    modules
});
try {
    fs.writeFileSync(pathLib.join(path, filename), bundlejs);
} catch (e) {
    console.error('编译失败 ', e);
}
console.log('compile sucessfully!');
```

# **Modules**

这篇指南会给你入门 Javascript 模块的全部信息。

## 模块化的背景

Javascript 程序本来很小——在早期，它们大多被用来执行独立的脚本任务，在你的 web 页面需要的地方提供一定交互，所以一般不需要多大的脚本。过了几年，我们现在有了运行大量 Javascript 脚本的复杂程序，还有一些被用在其他环境（例如 [Node.js](https://developer.mozilla.org/en-US/docs/Glossary/Node.js)）。

因此，近年来，有必要开始考虑提供一种将 JavaScript 程序拆分为可按需导入的单独模块的机制。Node.js 已经提供这个能力很长时间了，还有很多的 Javascript 库和框架 已经开始了模块的使用（例如， [CommonJS](https://en.wikipedia.org/wiki/CommonJS) 和基于 [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) 的其他模块系统 如 [RequireJS](https://requirejs.org/), 以及最新的 [Webpack](https://webpack.github.io/) 和 [Babel](https://babeljs.io/)）。

好消息是，最新的浏览器开始原生支持模块功能了，这是本文要重点讲述的。这会是一个好事情 — 浏览器能够最优化加载模块，使它比使用库更有效率：使用库通常需要做额外的客户端处理。

## 浏览器支持

使用JavaScript 模块依赖于`import`和 `export`，浏览器兼容性如下（绿色方框中的数字对应相应平台上支持该功能的发布版本）：

### import

[Update compatibility data on GitHub](https://github.com/mdn/browser-compat-data)

[Untitled](https://www.notion.so/38e96311dc2f484eb09d00073e5feeb4)

------

**[What are we missing?](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules#)**

**LegendFull support** Full support**No support** No support**See implementation notes.**See implementation notes.**User must explicitly enable this feature.**User must explicitly enable this feature.

### export

[Update compatibility data on GitHub](https://github.com/mdn/browser-compat-data)

[Untitled](https://www.notion.so/2d07288e2aca4bbb9d4536d231e56d21)

**LegendFull support** Full support**No support** No support**See implementation notes.**See implementation notes.**User must explicitly enable this feature.**User must explicitly enable this feature.

## 介绍一个例子

为了演示模块的使用，我们创建了一个 [simple set of examples](https://github.com/mdn/js-examples/tree/master/modules) ，你可以在Github上找到。这个例子演示了一个简单的模块的集合用来在web页面上创建了一个`[<canvas>](<https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas>)` 标签,在canvas上绘制 (并记录有关的信息) 不同形状。

这的确有点简单，但是保持足够简单能够清晰地演示模块。

**Note**: 如果你想去下载这个例子在本地运行，你需要通过本地web 服务器去运行。

## 基本的示例文件的结构

在我们的第一个例子 (see [basic-modules](https://github.com/mdn/js-examples/tree/master/modules/basic-modules)) 文件结构如下:

```
index.html
main.mjs
modules/
    canvas.mjs
    square.mjs
```

**Note**: 在这个指南的全部示例项目的文件结构是基本相同的； 需要熟悉上面的内容

modules 目录下的两个模块的描述如下:

- ```
  canvas.mjs
  ```

   — 包含与设置画布相关的功能:

  - `create()` —在指定ID的包装器`[<div>](<https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/div>)`内创建指定`width` 和`height` 的画布，该ID本身附加在指定的父元素内。 返回包含画布的2D上下文和包装器ID的对象。
  - `createReportList()` — 创建一个附加在指定包装器元素内的无序列表，该列表可用于将报告数据输出到。 返回列表的ID。

- ```
  square.mjs
  ```

   — 包含:

  - `name` — 包含字符串'square'的常量。
  - `draw()` — 在指定画布上绘制一个正方形，具有指定的大小，位置和颜色。 返回包含正方形大小，位置和颜色的对象。
  - `reportArea()` — 在给定长度的情况下，将正方形区域写入特定报告列表。
  - `reportPerimeter()` — 在给定长度的情况下，将正方形的周长写入特定的报告列表。

**Note**: 在原生JavaScript模块中, 扩展名 `.mjs` 非常重要，因为使用 MIME-type 为`javascript/esm` 来导入文件(其他的JavaScript 兼容 MIME-type 像 `application/javascript` 也可以), 它避免了严格的 MIME 类型检查错误，像 "The server responded with a non-JavaScript MIME type". 除此之外, `.mjs` 的扩展名很明了(比如这个就是一个模块，而不是一个传统 JavaScript文件)，还能够和其他工具互相适用. 看这个 [Google's note for further details](https://v8.dev/features/modules#mjs).

## `.mjs` 与 `.js`

纵观此文，我们使用 `.js` 扩展名的模块文件，但在其它一些文章中，你可能会看到 `.mjs` 扩展名的使用。[V8推荐了这样的做法](https://v8.dev/features/modules#mjs)，比如有下列理由：

- 比较清晰，这可以指出哪些文件是模块，哪些是常规的 JavaScript。
- 这能保证你的模块可以被运行时环境和构建工具识别，比如 [Node.js](https://nodejs.org/api/esm.html#esm_enabling) 和 [Babel](https://babeljs.io/docs/en/options#sourcetype)。

但是我们决定继续使用 `.js` 扩展名，未来可能会更改。为了使模块可以在浏览器中正常地工作，你需要确保你的服务器能够正常地处理 `Content-Type` 头，其应该包含 Javascript 的MIME 类型 `text/javascript`。如果没有这么做，你可能会得到 一个严格 MIME 类型检查错误：“The server responded with a non-JavaScript MIME type （服务器返回了非 JavaScript MIME 类型）”，并且浏览器会拒绝执行相应的 JavaScript 代码。多数服务器可以正确地处理 `.js` 文件的类型，但是 `.mjs` 还不行。已经可以正常响应 `.mjs` 的服务器有 [GitHub 页面](https://pages.github.com/) 和 Node.js 的 `[http-server](<https://github.com/http-party/http-server#readme>)`。

如果你已经在使用相应的环境了，那么一切正常。或者如果你还没有，但你知道你在做什么（比如你可以配置服务器以为 `.mjs` 设置正确的 `Content-Type`）。但如果你不能控制提供服务，或者用于公开文件发布的服务器，这可能会导致混乱。

为了学习和保证代码的可移植的目的，我们建议使用 `.js`。

如果你认为使用 `.mjs` 仅用于模块带来的清晰性非常重要，但不想引入上面描述的相应问题，你可以仅在开发过程中使用 `.mjs`，而在构建过程中将其转换为 `.js`。

另注意：

- 一些工具不支持 `.mjs`，比如 [TypeScript](https://www.typescriptlang.org/)。
- `<script type="module">` 属性用于指示引入的模块，你会在下面看到。

## 导出模块的功能

为了获得模块的功能要做的第一件事是把它们导出来。使用 `[export](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export>)` 语句来完成。

最简单的方法是把它（指上面的export语句）放到你想要导出的项前面，比如：

```
export const name = 'square';

export function draw(ctx, length, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, length, length);

  return {
    length: length,
    x: x,
    y: y,
    color: color
  };
}
```

你能够导出函数，`var`，`let`，`const`, 和等会会看到的类。export要放在最外层；比如你不能够在函数内使用`export`。

一个更方便的方法导出所有你想要导出的模块的方法是在模块文件的末尾使用一个export 语句， 语句是用花括号括起来的用逗号分割的列表。比如：

```
export { name, draw, reportArea, reportPerimeter };
```

## 导入功能到你的脚本

你想在模块外面使用一些功能，那你就需要导入他们才能使用。最简单的就像下面这样的：

```
import { name, draw, reportArea, reportPerimeter } from '/js-examples/modules/basic-modules/modules/square.mjs';
```

使用 `[import](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import>)` 语句，然后你被花括号包围的用逗号分隔的你想导入的功能列表，然后是关键字from，然后是模块文件的路径。模块文件的路径是相对于站点根目录的相对路径，对于我们的`basic-modules` 应该是 `/js-examples/modules/basic-modules`。

当然，我们写的路径有一点不同---我们使用点语法意味 “当前路径”，跟随着包含我们想要找的文件的路径。这比每次都要写下整个相对路径要好得多，因为它更短，使得URL 可移植 ---如果在站点层中你把它移动到不同的路径下面仍然能够工作。（修订版 1889482）

那么看看例子吧：

```
/js/examples/modules/basic-modules/modules/square.mjs
```

变成了

```
./modules/square.mjs
```

你可以在`[main.mjs](<https://github.com/mdn/js-examples/blob/master/modules/basic-modules/main.js>)`中看到这些。

**Note**:在一些模块系统中你可以忽略文件扩展名（比如`'/model/squre'` .这在原生JavaScript 模块系统中不工作。此外，记住你需要包含最前面的正斜杠。  （修订版 1889482）

因为你导入了这些功能到你的脚本文件，你可以像定义在相同的文件中的一样去使用它。下面展示的是在 `main.mjs` 中的import 语句下面的内容。

```
let myCanvas = create('myCanvas', document.body, 480, 320);
let reportList = createReportList(myCanvas.id);

let square1 = draw(myCanvas.ctx, 50, 50, 100, 'blue');
reportArea(square1.length, reportList);
reportPerimeter(square1.length, reportList);
```

## 应用模块到你的HTML

现在我们只需要将main.mjs模块应用到我们的HTML页面。 这与我们将常规脚本应用于页面的方式非常相似，但有一些显着的差异。

首先，你需要把 `type="module"` 放到 `[<script>](<https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script>)` 标签中, 来声明这个脚本是一个模块:

```
<script type="module" src="main.mjs"></script>
```

你导入模块功能的脚本基本是作为顶级模块。 如果省略它，Firefox就会给出错误“SyntaxError: import declarations may only appear at top level of a module。

你只能在模块内部使用 `import` 和`export` 语句 ；不是普通脚本文件。

**Note**: 您还可以将模块导入内部脚本，只要包含 `type="module"`，例如 `<script type="module"> //include script here </script>`.

## 其他模块与标准脚本的不同

- 你需要注意本地测试 — 如果你通过本地加载Html 文件 (比如一个 `file://` 路径的文件), 你将会遇到 CORS 错误，因为Javascript 模块安全性需要。你需要通过一个服务器来测试。
- 另请注意，您可能会从模块内部定义的脚本部分获得不同的行为，而不是标准脚本。 这是因为模块自动使用严格模式。
- 加载一个模块脚本时不需要使用 `defer` 属性 (see `[<script>` attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#Attributes)) 模块会自动延迟加载。
- 最后一个但不是不重要，你需要明白模块功能导入到单独的脚本文件的范围 — 他们无法在全局获得。因此，你只能在导入这些功能的脚本文件中使用他们，你也无法通过Javascript console 中获取到他们，比如，在DevTools 中你仍然能够获取到语法错误，但是你可能无法像你想的那样使用一些debug 技术

## 默认导出 versus 命名导出

到目前为止我们导出的功能都是由**named exports** 组成— 每个项目（无论是函数，常量等）在导出时都由其名称引用，并且该名称也用于在导入时引用它。

还有一种导出类型叫做 **default export** —这样可以很容易地使模块提供默认功能，并且还可以帮助JavaScript模块与现有的CommonJS和AMD模块系统进行互操作（正如[ES6 In Depth: Modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/) by Jason Orendorff的模块中所解释的那样;搜索“默认导出”“）。

看个例子来解释它如何工作。在我们的基本模块`square.mjs`中，您可以找到一个名为`randomSquare()`的函数，它创建一个具有随机颜色，大小和位置的正方形。我们想作为默认导出，所以在文件的底部我们这样写 ：

```
export default randomSquare;
```

注意，不要大括号。

我们可以把 `export default` 放到函数前面，定义它为一个匿名函数，像这样：

```
export default function(ctx) {
  ...
}
```

在我们的`main.mjs` 文件中，我们使用以下行导入默认函数：

```
import randomSquare from './modules/square.mjs';
```

同样，没有大括号，因为每个模块只允许有一个默认导出, 我们知道 `randomSquare` 就是需要的那个。上面的那一行相当于下面的缩写：

```
import {default as randomSquare} from './modules/square.mjs';
```

**Note**: 重命名导出项的as语法在下面的[Renaming imports and exports](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules#Renaming_imports_and_exports)部分中进行了说明。

## 避免命名冲突

到目前为止，我们的canvas 图形绘制模块看起来工作的很好。但是如果我们添加一个绘制其他形状的比如圆形或者矩形的模块会发生什么？这些形状可能会有相关的函数比如 `draw()`、`reportArea()`，等等；如果我们用相同的名字导入不同的函数到顶级模块文件中，我们会收到冲突和错误。

幸运的是，有很多方法来避免。我们将会在下一个节看到。

## 重命名导出与导入

在你的 `import` 和 `export` 语句的大括号中，可以使用 `as` 关键字跟一个新的名字，来改变你在顶级模块中将要使用的功能的标识名字。因此，例如，以下两者都会做同样的工作，尽管方式略有不同：

```
// inside module.mjs
export {
  function1 as newFunctionName,
  function2 as anotherNewFunctionName
};

// inside main.mjs
import { newFunctionName, anotherNewFunctionName } from '/modules/module.mjs';
// inside module.mjs
export { function1, function2 };

// inside main.mjs
import { function1 as newFunctionName,
         function2 as anotherNewFunctionName } from '/modules/module.mjs';
```

让我们看一个真实的例子。在我们的[重命名](https://github.com/mdn/js-examples/tree/master/modules/renaming)目录中，您将看到与上一个示例中相同的模块系统，除了我们添加了`circle.mjs`和`triangle.mjs`模块以绘制和报告圆和三角形。

在每个模块中，我们都有`export` 相同名称的功能，因此每个模块底部都有相同的导出语句：

```
export { name, draw, reportArea, reportPerimeter };
```

将它们导入`main.mjs`时，如果我们尝试使用

```
import { name, draw, reportArea, reportPerimeter } from './modules/square.mjs';
import { name, draw, reportArea, reportPerimeter } from './modules/circle.mjs';
import { name, draw, reportArea, reportPerimeter } from './modules/triangle.mjs';
```

浏览器会抛出一个错误，例如“SyntaxError: redeclaration of import name”（Firefox）。

相反，我们需要重命名导入，使它们是唯一的：

```
import { name as squareName,
         draw as drawSquare,
         reportArea as reportSquareArea,
         reportPerimeter as reportSquarePerimeter } from './modules/square.mjs';

import { name as circleName,
         draw as drawCircle,
         reportArea as reportCircleArea,
         reportPerimeter as reportCirclePerimeter } from './modules/circle.mjs';

import { name as triangleName,
        draw as drawTriangle,
        reportArea as reportTriangleArea,
        reportPerimeter as reportTrianglePerimeter } from './modules/triangle.mjs';
```

请注意，您可以在模块文件中解决问题，例如

```
// in square.mjs
export { name as squareName,
         draw as drawSquare,
         reportArea as reportSquareArea,
         reportPerimeter as reportSquarePerimeter };
// in main.mjs
import { squareName, drawSquare, reportSquareArea, reportSquarePerimeter } from '/js-examples/modules/renaming/modules/square.mjs';
```

它也会起作用。 你使用什么样的风格取决于你，但是单独保留模块代码并在导入中进行更改可能更有意义。 当您从没有任何控制权的第三方模块导入时，这尤其有意义。

## 创建模块对象

上面的方法工作的挺好，但是有一点点混乱、亢长。一个更好的解决方是，导入每一个模块功能到一个模块功能对象上。可以使用以下语法形式：

```
import * as Module from '/modules/module.mjs';
```

这将获取`module.mjs`中所有可用的导出，并使它们可以作为对象模块的成员使用，从而有效地为其提供自己的命名空间。 例如：

```
Module.function1()
Module.function2()
etc.
```

再次，让我们看一个真实的例子。如果您转到我们的[module-objects](https://github.com/mdn/js-examples/tree/master/modules/module-objects)目录，您将再次看到相同的示例，但利用上述的新语法进行重写。在模块中，导出都是以下简单形式：

```
export { name, draw, reportArea, reportPerimeter };
```

另一方面，导入看起来像这样：

```
import * as Canvas from './modules/canvas.mjs';

import * as Square from '/./modules/square.mjs';
import * as Circle from './modules/circle.mjs';
import * as Triangle from './modules/triangle.mjs';
```

在每种情况下，您现在可以访问指定对象名称下面的模块导入

```
let square1 = Square.draw(myCanvas.ctx, 50, 50, 100, 'blue');
Square.reportArea(square1.length, reportList);
Square.reportPerimeter(square1.length, reportList);
```

因此，您现在可以像以前一样编写代码（只要您在需要时包含对象名称），并且导入更加整洁。

## 模块与类（class）

正如我们之前提到的那样，您还可以导出和导入类; 这是避免代码冲突的另一种选择，如果您已经以面向对象的方式编写了模块代码，那么它尤其有用。

您可以在我们的[classes](https://github.com/mdn/js-examples/tree/master/modules/classes) 目录中看到使用ES类重写的形状绘制模块的示例。 例如，`[square.mjs](<https://github.com/mdn/js-examples/blob/master/modules/classes/modules/square.js>)` 文件现在包含单个类中的所有功能：

```
class Square {
  constructor(ctx, listId, length, x, y, color) {
    ...
  }

  draw() {
    ...
  }

  ...
}
```

然后我们导出：

```
export { Square };
```

在`[main.mjs](<https://github.com/mdn/js-examples/blob/master/modules/classes/main.js>)`中，我们像这样导入它：

```
import { Square } from './modules/square.mjs';
```

然后使用该类绘制我们的方块：

```
let square1 = new Square(myCanvas.ctx, myCanvas.listId, 50, 50, 100, 'blue');
square1.draw();
square1.reportArea();
square1.reportPerimeter();
```

## 合并模块

有时你会想要将模块聚合在一起。 您可能有多个级别的依赖项，您希望简化事物，将多个子模块组合到一个父模块中。 这可以使用父模块中以下表单的导出语法：

```
export * from 'x.mjs'
export { name } from 'x.mjs'
```

**Note**: 这实际上是导入后跟导出的简写，即“我导入模块`x.mjs`，然后重新导出部分或全部导出”。

有关示例，请参阅我们的[module-aggregation](https://github.com/mdn/js-examples/tree/master/modules/module-aggregation)。 在这个例子中（基于我们之前的类示例），我们有一个名为`shapes.mjs`的额外模块，它将`circle.mjs`，`square.mjs`和`riangle.mjs`中的所有功能聚合在一起。 我们还将子模块移动到名为shapes的modules目录中的子目录中。 所以模块结构现在是这样的：

```
modules/
  canvas.mjs
  shapes.mjs
  shapes/
    circle.mjs
    square.mjs
    triangle.mjs
```

在每个子模块中，输出具有相同的形式，例如，

```
export { Square };
```

接下来是聚合部分。 在`[shapes.mjs](<https://github.com/mdn/js-examples/blob/master/modules/module-aggregation/modules/shapes.js>)`里面，我们包括以下几行：

```
export { Square } from '/js-examples/modules/module-aggregation/modules/shapes/square.mjs';
export { Triangle } from '/js-examples/modules/module-aggregation/modules/shapes/triangle.mjs';
export { Circle } from '/js-examples/modules/module-aggregation/modules/shapes/circle.mjs';
```

它们从各个子模块中获取导出，并有效地从`shapes.mjs`模块中获取它们。

**Note**: 即使`shapes.mjs`文件位于modules目录中，我们仍然需要相对于模块根目录编写这些URL，因此需要`/modules/`。 这是使用JavaScript模块时混淆的常见原因。

**Note**: `shapes.mjs`中引用的导出基本上通过文件重定向，并且实际上并不存在，因此您将无法在同一文件中编写任何有用的相关代码。

所以现在在`main.mjs` 文件中，我们可以通过替换来访问所有三个模块类

```
import { Square } from './modules/square.mjs';
import { Circle } from './modules/circle.mjs';
import { Triangle } from './modules/triangle.mjs';
```

使用以下单行：

```
import { Square, Circle, Triangle } from './modules/shapes.mjs';
```

## 动态加载模块

浏览器中可用的JavaScript模块功能的最新部分是动态模块加载。 这允许您仅在需要时动态加载模块，而不必预先加载所有模块。 这有一些明显的性能优势; 让我们继续阅读，看看它是如何工作的。

这个新功能允许您将`import()`作为函数调用，将其作为参数传递给模块的路径。 它返回一个 [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)，它用一个模块对象来实现（参见[Creating a module object](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules#Creating_a_module_object)），让你可以访问该对象的导出，例如

```
import('/modules/myModule.mjs')
  .then((module) => {
    // Do something with the module.
  });
```

我们来看一个例子。 在[dynamic-module-imports](https://github.com/mdn/js-examples/tree/master/modules/dynamic-module-imports) 目录中，我们有另一个基于类示例的示例。 但是这次我们在示例加载时没有在画布上绘制任何东西。 相反，我们包括三个按钮 - “圆形”，“方形”和“三角形” - 按下时，动态加载所需的模块，然后使用它来绘制相关的形状。

在这个例子中，我们只对[index.html](https://github.com/mdn/js-examples/blob/master/modules/dynamic-module-imports/index.html) 和[main.mjs](https://github.com/mdn/js-examples/blob/master/modules/dynamic-module-imports/main.js)文件进行了更改 - 模块导出保持与以前相同。

在`main.mjs`中，我们使用`[document.querySelector()](<https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector>)`调用获取了对每个按钮的引用，例如：

```
let squareBtn = document.querySelector('.square');
```

然后，我们为每个按钮附加一个事件监听器，以便在按下时，相关模块被动态加载并用于绘制形状：

```
squareBtn.addEventListener('click', () => {
  import('/js-examples/modules/dynamic-module-imports/modules/square.mjs').then((Module) => {
    let square1 = new Module.Square(myCanvas.ctx, myCanvas.listId, 50, 50, 100, 'blue');
    square1.draw();
    square1.reportArea();
    square1.reportPerimeter();
  })
});
```

请注意，由于promise履行会返回一个模块对象，因此该类成为对象的子特征，因此我们现在需要使用 `Module`访问构造函数。 在它之前，例如 `Module.Square( ... )`。

## 故障排除

如果为了你的模块有问题，这里有一些提示有可能帮助到你。如果你发现更多的内容欢迎添加进来！

- 在前面已经提到了，在这里再重申一次： `.mjs` 后缀的文件需要以 MIME-type 为 `javascript/esm` 来加载(或者其他的JavaScript 兼容的 MIME-type ，比如 `application/javascript`), 否则，你会一个严格的 MIME 类型检查错误，像是这样的 "The server responded with a non-JavaScript MIME type".
- 如果你尝试用本地文件加载HTML 文件 (i.e. with a `file://` URL), 由于JavaScript 模块的安全性要求，你会遇到CORS 错误。你需要通过服务器来做你的测试。GitHub pages is ideal as it also serves `.mjs` files with the correct MIME type.
- 因为`.mjs` 是一个相当新的文件后缀, 一些操作系统可能无法识别，或者尝试把它替换成别的。比如，我们发现macOS悄悄地该我们的 `.mjs` 后缀的文件后面添加上 `.js` 然后自动隐藏这个后缀。所以我们的文件实际上都是 `x.mjs.js`. 当我们关闭自动隐藏文件后缀名，让它去接受认可 `.mjs`。问题解决。



