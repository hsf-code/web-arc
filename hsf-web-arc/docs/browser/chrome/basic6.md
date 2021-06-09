---
title: AST
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

## **什么是 AST**

抽象语法树（`Abstract Syntax Tree`）简称 `AST`，是源代码的抽象语法结构的树状表现形式。`webpack`、`eslint` 等很多工具库的核心都是通过抽象语法书这个概念来实现对代码的检查、分析等操作。今天我为大家分享一下 JavaScript 这类解释型语言的抽象语法树的概念

我们常用的浏览器就是通过将 js 代码转化为抽象语法树来进行下一步的分析等其他操作。所以将 js 转化为抽象语法树更利于程序的分析。

https://mmbiz.qpic.cn/mmbiz_jpg/YBFV3Da0NwuMvuciay2aF4N32mM9ASbIz1Yx4kg7XWBfcjw5tGLvZfLfxlqlzCwcQhKoKH3tWHIDP0oaWvnr1AA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

如上图中变量声明语句，转换为 AST 之后就是右图中显示的样式

左图中对应的：

- `var` 是一个关键字
- `AST` 是一个定义者
- `=` 是 Equal 等号的叫法有很多形式，在后面我们还会看到
- `is tree` 是一个字符串
- `;` 就是 Semicoion

首先一段代码转换成的抽象语法树是一个对象，该对象会有一个顶级的 type 属性 `Program`；第二个属性是 `body` 是一个数组。

`body` 数组中存放的每一项都是一个对象，里面包含了所有的对于该语句的描述信息

```
type:         描述该语句的类型  --> 变量声明的语句
kind:         变量声明的关键字  --> var
declaration:  声明内容的数组，里面每一项也是一个对象
            type: 描述该语句的类型
            id:   描述变量名称的对象
                type: 定义
                name: 变量的名字
            init: 初始化变量值的对象
                type:   类型
                value:  值 "is tree" 不带引号
                row:    "\\"is tree"\\" 带引号
```

## **词法分析和语法分析**

`JavaScript` 是解释型语言，一般通过 词法分析 -> 语法分析 -> 语法树，就可以开始解释执行了

词法分析：也叫`扫描`，是将字符流转换为记号流(`tokens`)，它会读取我们的代码然后按照一定的规则合成一个个的标识

比如说：`var a = 2` ，这段代码通常会被分解成 `var、a、=、2`

```
;[
  { type: 'Keyword', value: 'var' },
  { type: 'Identifier', value: 'a' },
  { type: 'Punctuator', value: '=' },
  { type: 'Numeric', value: '2' },
]
```

当词法分析源代码的时候，它会一个一个字符的读取代码，所以很形象地称之为扫描 - `scans`。当它遇到空格、操作符，或者特殊符号的时候，它会认为一个话已经完成了。

语法分析：也称`解析器`，将词法分析出来的数组转换成树的形式，同时验证语法。语法如果有错的话，抛出语法错误。

```
{  ...  "type": "VariableDeclarator",  "id": {    "type": "Identifier",    "name": "a"  },  ...}
```

语法分析成 AST ，我们可以在这里在线看到效果 http://esprima.org

## **AST 能做什么**

- 语法检查、代码风格检查、格式化代码、语法高亮、错误提示、自动补全等
- 代码混淆压缩
- 优化变更代码，改变代码结构等

比如说，有个函数 `function a() {}` 我想把它变成 `function b() {}`

比如说，在 `webpack` 中代码编译完成后 `require('a') --> __webapck__require__("*/**/a.js")`

下面来介绍一套工具，可以把代码转成语法树然后改变节点以及重新生成代码

## **AST 解析流程**

准备工具：

- esprima：code => ast 代码转 ast
- estraverse: traverse ast 转换树
- escodegen: ast => code

在推荐一个常用的 AST 在线转换网站：https://astexplorer.net/

比如说一段代码 `function getUser() {}`，我们把函数名字更改为 `hello`，看代码流程

看以下代码，简单说明 `AST` 遍历流程

```
const esprima = require('esprima')
const estraverse = require('estraverse')
const code = `function getUser() {}`
// 生成 AST
const ast = esprima.parseScript(code)
// 转换 AST，只会遍历 type 属性
// traverse 方法中有进入和离开两个钩子函数
estraverse.traverse(ast, {
  enter(node) {
    console.log('enter -> node.type', node.type)
  },
  leave(node) {
    console.log('leave -> node.type', node.type)
  },
})
```

输出结果如下：

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

由此可以得到 AST 遍历的流程是深度优先，遍历过程如下：

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

## **修改函数名字**

此时我们发现函数的名字在 `type` 为 `Identifier` 的时候就是该函数的名字，我们就可以直接修改它便可实现一个更改函数名字的 `AST` 工具

https://mmbiz.qpic.cn/mmbiz_jpg/YBFV3Da0NwuMvuciay2aF4N32mM9ASbIzRTYV4VKdIRRvh67dIVXFzgaxibkDWaUmGjwibRtkKMaGjENWB0tW78CA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

```
// 转换树
estraverse.traverse(ast, {
  // 进入离开修改都是可以的
  enter(node) {
    console.log('enter -> node.type', node.type)
    if (node.type === 'Identifier') {
      node.name = 'hello'
    }
  },
  leave(node) {
    console.log('leave -> node.type', node.type)
  },
})
// 生成新的代码
const result = escodegen.generate(ast)
console.log(result)
// function hello() {}
```

## **babel 工作原理**

提到 AST 我们肯定会想到 babel，自从 Es6 开始大规模使用以来，babel 就出现了，它主要解决了就是一些浏览器不兼容 Es6 新特性的问题，其实就把 Es6 代码转换为 Es5 的代码，兼容所有浏览器，babel 转换代码其实就是用了 AST，babel 与 AST 就有着很一种特别的关系。

那么我们就在 babel 的中来使用 AST，看看 babel 是如何编译代码的（不讲源码啊）

需要用到两个工具包 `@babel/core`、`@babel/preset-env`

当我们配置 babel 的时候，不管是在 `.babelrc` 或者`babel.config.js` 文件里面配置的都有 `presets` 和 `plugins` 两个配置项（还有其他配置项，这里不做介绍）

### **插件和预设的区别**

```
// .babelrc
{
  "presets": ["@babel/preset-env"],
  "plugins": []
}
```

当我们配置了 `presets` 中有 `@babel/preset-env`，那么 `@babel/core`就会去找 `preset-env` 预设的插件包，它是一套

babel 核心包并不会去转换代码，核心包只提供一些核心 API，真正的代码转换工作由插件或者预设来完成，比如要转换箭头函数，会用到这个 plugin，`@babel/plugin-transform-arrow-functions`，当需要转换的要求增加时，我们不可能去一一配置相应的 plugin，这个时候就可以用到预设了，也就是 presets。presets 是 plugins 的集合，一个 presets 内部包含了很多 plugin。

### **babel 插件的使用**

现在我们有一个箭头函数，要想把它转成普通函数，我们就可以直接这么写：

```
const babel = require('@babel/core')
const code = `const fn = (a, b) => a + b`
// babel 有 transform 方法会帮我们自动遍历，使用相应的预设或者插件转换相应的代码
const r = babel.transform(code, {
  presets: ['@babel/preset-env'],
})
console.log(r.code)
// 打印结果如下
// "use strict";
// var fn = function fn() { return a + b; };
```

此时我们可以看到最终代码会被转成普通函数，但是我们，只需要箭头函数转通函数的功能，不需要用这么大一套包，只需要一个箭头函数转普通函数的包，我们其实是可以在 `node_modules` 下面找到有个叫做`plugin-transform-arrow-functions` 的插件，这个插件是专门用来处理 箭头函数的，我们就可以这么写：

```
const r = babel.transform(code, {
  plugins: ['@babel/plugin-transform-arrow-functions'],
})
console.log(r.code)
// 打印结果如下
// const fn = function () { return a + b; };
```

我们可以从打印结果发现此时并没有转换我们变量的声明方式还是 const 声明，只是转换了箭头函数

## **编写自己的插件**

> 此时，我们就可以自己来写一些插件，来实现代码的转换，中间处理代码的过程就是使用前面提到的 AST 的处理逻辑

现在我们来个实战把 `const fn = (a, b) => a + b` 转换为 `const fn = function(a, b) { return a + b }`

### **分析 AST 结构**

首先我们在在线分析 AST 的网站上分析 `const fn = (a, b) => a + b`和 `const fn = function(a, b) { return a + b }`看两者语法树的区别

https://mmbiz.qpic.cn/mmbiz_jpg/YBFV3Da0NwuMvuciay2aF4N32mM9ASbIzzWbQIGOPNNiaaHZUMDAVkvgGNicREYV1LGM11U1hVU84ch7ynfZsunIQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

根据我们分析可得：

1. 变成普通函数之后他就不叫箭头函数了`ArrowFunctionExpression`，而是函数表达式了`FunctionExpression`
2. 所以首先我们要把 `箭头函数表达式(ArrowFunctionExpression)` 转换为 `函数表达式(FunctionExpression)`
3. 要把 `二进制表达式(BinaryExpression)` 放到一个 `代码块中(BlockStatement)`
4. 其实我们要做就是把一棵树变成另外一颗树，说白了其实就是拼成另一颗树的结构，然后生成新的代码，就可以完成代码的转换

### **访问者模式**

在 babel 中，我们开发 plugins 的时候要用到访问者模式，就是说在访问到某一个路径的时候进行匹配，然后在对这个节点进行修改，比如说上面的当我们访问到 `ArrowFunctionExpression` 的时候，对 `ArrowFunctionExpression` 进行修改，变成普通函数

那么我们就可以这么写：

```
const babel = require('@babel/core')
const code = `const fn = (a, b) => a + b` // 转换后 const fn = function(a, b) { return a + b }
const arrowFnPlugin = {
  // 访问者模式
  visitor: {
    // 当访问到某个路径的时候进行匹配
    ArrowFunctionExpression(path) {
      // 拿到节点
      const node = path.node
      console.log('ArrowFunctionExpression -> node', node)
    },
  },
}

const r = babel.transform(code, {
  plugins: [arrowFnPlugin],
})

console.log(r)
```

### **修改 AST 结构**

此时我们拿到的结果是这样的节点结果是 这样的，其实就是 `ArrowFunctionExpression` 的 AST，此时我们要做的是把 `ArrowFunctionExpression` 的结构替换成 `FunctionExpression`的结构，但是需要我们组装类似的结构，这么直接写很麻烦，但是 babel 为我们提供了一个工具叫做 `@babel/types`

`@babel/types` 有两个作用：

1. 判断这个节点是不是这个节点（ArrowFunctionExpression 下面的 path.node 是不是一个 ArrowFunctionExpression）
2. 生成对应的表达式

然后我们使用的时候，需要经常查文档，因为里面的节点类型特别多，不是做编译相关工作的是记不住怎么多节点的

那么接下来我们就开始生成一个 `FunctionExpression`，然后把之前的 `ArrowFunctionExpression` 替换掉，我们可以看 `types` 文档，找到 `functionExpression`，该方法接受相应的参数我们传递过去即可生成一个 `FunctionExpression`

```
t.functionExpression(id, params, body, generator, async)
```

- id: Identifier (default: null) id 可传递 null
- params: Array<LVal> (required) 函数参数，可以把之前的参数拿过来
- body: BlockStatement (required) 函数体，接受一个 `BlockStatement` 我们需要生成一个
- generator: boolean (default: false) 是否为 generator 函数，当然不是了
- async: boolean (default: false) 是否为 async 函数，肯定不是了

还需要生成一个 `BlockStatement`，我们接着看文档找到 `BlockStatement` 接受的参数

```
t.blockStatement(body, directives)
```

看文档说明，blockStatement 接受一个 body，那我们把之前的 body 拿过来就可以直接用，不过这里 body 接受一个数组

我们细看 AST 结构，函数表达式中的 `BlockStatement` 中的 `body` 是一个 `ReturnStatement`，所以我们还需要生成一个 `ReturnStatement`

现在我们就可以改写 AST 了

```
const babel = require('@babel/core')
const t = require('@babel/types')
const code = `const fn = (a, b) => a + b` // const fn = function(a, b) { return a + b }
const arrowFnPlugin = {
  // 访问者模式
  visitor: {
    // 当访问到某个路径的时候进行匹配
    ArrowFunctionExpression(path) {
      // 拿到节点然后替换节点
      const node = path.node
      console.log('ArrowFunctionExpression -> node', node)
      // 拿到函数的参数
      const params = node.params
      const body = node.body
      const functionExpression = t.functionExpression(null, params, t.blockStatement([body]))
      // 替换原来的函数
      path.replaceWith(functionExpression)
    },
  },
}
const r = babel.transform(code, {
  plugins: [arrowFnPlugin],
})
console.log(r.code) // const fn = function (a, b) { return a + b; };
```

### **特殊情况**

我们知道在剪头函数中是可以省略 `return` 关键字，我们上面是处理了省略关键字的写法，但是如果用户写了 return 关键字后，我们写的这个插件就有问题了，所以我们可以在优化一下

```
const fn = (a, b) => { retrun a + b }` -> `const fn = function(a, b) { return a + b }
```

观察代码我们发现，我们就不需要把 body 转换成 blockStatement 了，直接放过去就可以了，那么我们就可以这么写

```
ArrowFunctionExpression(path) {
  // 拿到节点然后替换节点
  const node = path.node
  console.log("ArrowFunctionExpression -> node", node)
  // 拿到函数的参数
  const params = node.params
  let body = node.body
  // 判断是不是 blockStatement，不是的话让他变成 blockStatement
  if (!t.isBlockStatement(body)) {
    body = t.blockStatement([body])
  }
  const functionExpression = t.functionExpression(null, params, body)
  // 替换原来的函数
  path.replaceWith(functionExpression)
}
```

## **按需引入**

在开发中，我们引入 UI 框架，比如 vue 中用到的 `element-ui`，`vant` 或者 `React` 中的 `antd` 都支持全局引入和按需引入，默认是全局引入，如果需要按需引入就需要安装一个 `babel-plugin-import` 的插件，将全局的写法变成按需引入的写法。

就拿我最近开发移动端用的 vant 为例， `import { Button } from 'vant'` 这种写法经过这个插件之后会变成 `import Button from 'vant/lib/Button'` 这种写法，引用整个 vant 变成了我只用了 vant 下面的某一个文件，打包后的文件会比全部引入的文件大小要小很多

### **分析语法树**

> import { Button, Icon } from 'vant' 写法转换为 import Button from 'vant/lib/Button'; import Icon from 'vant/lib/Icon'

看一下两个语法树的区别

https://mmbiz.qpic.cn/mmbiz_jpg/YBFV3Da0NwuMvuciay2aF4N32mM9ASbIzyTXUgVEmO22ChGeRtxqmyDkEqoTyQdEzJF64jiaibLMgCvFImT2MxG3g/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

根据两张图分析我们可以得到一些信息：

1. 我们发现解构方式引入的模块只有 import 声明，第二张图是两个 import 声明
2. 解构方式引入的详细说明里面(`specifiers`)是两个`ImportSpecifier`，第二张图里面是分开的，而且都是 `ImportDefaultSpecifier`
3. 他们引入的 `source` 也不一样
4. 那我们要做的其实就是要把单个的 `ImportDeclaration` 变成多个 `ImportDeclaration`, 然后把单个 import 解构引入的 `specifiers` 部分 `ImportSpecifier` 转换成多个 `ImportDefaultSpecifier` 并修改对应的 `source` 即可

### **分析类型**

为了方便传递参数，这次我们写到一个函数里面，可以方便传递转换后拼接的目录

这里我们需要用到的几个类型，也需要在 types 官网上找对应的解释

- 首先我们要生成多个 `importDeclaration` 类型

  ```
  /**
   * @param {Array<ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier>} specifiers  (required)
   * @param {StringLiteral} source (required)
   */
  t.importDeclaration(specifiers, source)
  ```

- 在 `importDeclaration` 中需要生成 `ImportDefaultSpecifier`

  ```
  /**
   * @param {Identifier} local  (required)
   */
  t.importDefaultSpecifier(local)
  ```

- 在 `importDeclaration` 中还需要生成一个 `StringLiteral`

  ```
  /**
   * @param {string} value  (required)
   */
  t.stringLiteral(value)
  ```

### **上代码**

按照上面的分析，我们开始上代码

```
const babel = require('@babel/core')
const t = require('@babel/types')
const code = `import { Button, Icon } from 'vant'`
// import Button from 'vant/lib/Button'
// import Icon from 'vant/lib/Icon'
function importPlugin(opt) {
  const { libraryDir } = opt
  return {
    visitor: {
      ImportDeclaration(path) {
        const node = path.node
        // console.log("ImportDeclaration -> node", node)
        // 得到节点的详细说明，然后转换成多个的 import 声明
        const specifiers = node.specifiers
        // 要处理这个我们做一些判断，首先判断不是默认导出我们才处理，要考虑 import vant, { Button, Icon } from 'vant' 写法
        // 还要考虑 specifiers 的长度，如果长度不是 1 并且不是默认导出我们才需要转换
        if (!(specifiers.length === 1 && t.isImportDefaultSpecifier(specifiers[0]))) {
          const result = specifiers.map((specifier) => {
            const local = specifier.local
            const source = t.stringLiteral(`${node.source.value}/${libraryDir}/${specifier.local.name}`)
            // console.log("ImportDeclaration -> specifier", specifier)
            return t.importDeclaration([t.importDefaultSpecifier(local)],source)
          })
          console.log('ImportDeclaration -> result', result)
          // 因为这次要替换的 AST 不是一个，而是多个的，所以需要 `path.replaceWithMultiple(result)` 来替换，但是一执行发现死循环了
          path.replaceWithMultiple(result)
        }
      },
    },
  }
}
const r = babel.transform(code, {
  plugins: [importPlugin({ libraryDir: 'lib' })],
})
console.log(r.code)
```

看打印结果和转换结果似乎没什么问题，这个插件几乎就实现了

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

### **特殊情况**

但是我们考虑一种情况，如果用户不全部按需加载了，按需加载只是一种选择，如果用户这么写了 `import vant, { Button, Icon } from 'vant'`，那么我们这个插件就出现问题了

https://mmbiz.qpic.cn/mmbiz_jpg/YBFV3Da0NwuMvuciay2aF4N32mM9ASbIzwbD0vZ80DdqIdNgPhgVXp6T26fJybME1eFyRkBTiaVAKIkVM3j4MX7g/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

如果遇到这种写法，那么默认导入的他的 `source` 应该是不变的，我们要把原来的 `source` 拿出来

所以还需要判断一下，每一个 `specifier` 是不是一个 `ImportDefaultSpecifier` 然后处理不同的 `source`，完整处理逻辑应该如下

```
function importPlugin(opt) {
  const { libraryDir } = opt
  return {
    visitor: {
      ImportDeclaration(path) {
        const node = path.node
        // console.log("ImportDeclaration -> node", node)
        // 得到节点的详细说明，然后转换成多个的 import 声明
        const specifiers = node.specifiers
        // 要处理这个我们做一些判断，首先判断不是默认导出我们才处理，要考虑 import vant, { Button, Icon } from 'vant' 写法
        // 还要考虑 specifiers 的长度，如果长度不是 1 并且不是默认导出我们才需要转换
        if (
          !(
            specifiers.length === 1 && t.isImportDefaultSpecifier(specifiers[0])
          )
        ) {
          const result = specifiers.map((specifier) => {
            let local = specifier.local,
              source
            // 判断是否存在默认导出的情况
            if (t.isImportDefaultSpecifier(specifier)) {
              source = t.stringLiteral(node.source.value)
            } else {
              source = t.stringLiteral(
                `${node.source.value}/${libraryDir}/${specifier.local.name}`
              )
            }
            return t.importDeclaration(
              [t.importDefaultSpecifier(local)],
              source
            )
          })
          path.replaceWithMultiple(result)
        }
      },
    },
  }
}
```

## **babylon**

> 在 babel 官网上有一句话 Babylon is a JavaScript parser used in Babel.

### **babylon 与 babel 的关系**

`babel` 使用的引擎是 `babylon`，`Babylon` 并非 `babel` 团队自己开发的，而是 fork 的 `acorn` 项目，`acorn` 的项目本人在很早之前在兴趣部落 1.0 在构建中使用，为了是做一些代码的转换，是很不错的一款引擎，不过 `acorn` 引擎只提供基本的解析 `ast` 的能力，遍历还需要配套的 `acorn-travesal`, 替换节点需要使用 acorn-，而这些开发，在 Babel 的插件体系开发下，变得一体化了（摘自 AlloyTeam 团队的剖析 babel）

### **使用 babylon**

使用 babylon 编写一个数组 rest 转 Es5 语法的插件

把 `const arr = [ ...arr1, ...arr2 ]` 转成 `var arr = [].concat(arr1, arr2)`

我们使用 babylon 的话就不需要使用 `@babel/core` 了，只需要用到他里面的 `traverse` 和 `generator`，用到的包有 `babylon、@babel/traverse、@babel/generator、@babel/types`

### **分析语法树**

先来看一下两棵语法树的区别

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

根据上图我们分析得出：

1. 两棵树都是变量声明的方式，不同的是他们声明的关键字不一样
2. 他们初始化变量值的时候是不一样的，一个数组表达式（ArrayExpression）另一个是调用表达式（CallExpression）
3. 那我们要做的就很简单了，就是把 数组表达式转换为调用表达式就可以

### **分析类型**

这段代码的核心生成一个 callExpression 调用表达式，所以对应官网上的类型，我们分析需要用到的 api

- 先来分析 init 里面的，首先是 callExpression

  ```
  /**
   * @param {Expression} callee  (required)
   * @param {Array<Expression | SpreadElement | JSXNamespacedName>} source (required)
   */
  t.callExpression(callee, arguments)
  ```

- 对应语法树上 callee 是一个 MemberExpression，所以要生成一个成员表达式

  ```
  /**
   * @param {Expression} object  (required)
   * @param {if computed then Expression else Identifier} property (required)
   * @param {boolean} computed (default: false)
   * @param {boolean} optional (default: null)
   */
  t.memberExpression(object, property, computed, optional)
  ```

- 在 callee 的 object 是一个 ArrayExpression 数组表达式，是一个空数组

  ```
  /**
   * @param {Array<null | Expression | SpreadElement>} elements  (default: [])
   */
  t.arrayExpression(elements)
  ```

- 对了里面的东西分析完了，我们还要生成 VariableDeclarator 和 VariableDeclaration 最终生成新的语法树

  ```
  /**
   * @param {LVal} id  (required)
   * @param {Expression} init (default: null)
   */
  t.variableDeclarator(id, init)
  
  /**
   * @param {"var" | "let" | "const"} kind  (required)
   * @param {Array<VariableDeclarator>} declarations (required)
   */
  t.variableDeclaration(kind, declarations)
  ```

- 其实倒着分析语法树，分析完怎么写也就清晰了，那么我们开始上代码吧

### **上代码**

```
const babylon = require('babylon')
// 使用 babel 提供的包，traverse 和 generator 都是被暴露在 default 对象上的
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const t = require('@babel/types')

const code = `const arr = [ ...arr1, ...arr2 ]` // var arr = [].concat(arr1, arr2)

const ast = babylon.parse(code, {
  sourceType: 'module',
})

// 转换树
traverse(ast, {
  VariableDeclaration(path) {
    const node = path.node
    const declarations = node.declarations
    console.log('VariableDeclarator -> declarations', declarations)
    const kind = 'var'
    // 边界判定
    if (node.kind !== kind && declarations.length === 1 && t.isArrayExpression(declarations[0].init)) {
      // 取得之前的 elements
      const args = declarations[0].init.elements.map((item) => item.argument)
      const callee = t.memberExpression(t.arrayExpression(), t.identifier('concat'), false)
      const init = t.callExpression(callee, args)
      const declaration = t.variableDeclarator(declarations[0].id, init)
      const variableDeclaration = t.variableDeclaration(kind, [declaration])
      path.replaceWith(variableDeclaration)
    }
  },
})
```

## **具体语法书**

和抽象语法树相对的是具体语法树（`Concrete Syntax Tree`）简称`CST`（通常称作分析树）。一般的，在源代码的翻译和编译过程中，语法分析器创建出分析树。一旦 AST 被创建出来，在后续的处理过程中，比如语义分析阶段，会添加一些信息。可参考抽象语法树和具体语法树有什么区别？

## **补充**

关于 node 类型，全集大致如下：

```
(parameter) node: Identifier | SimpleLiteral | RegExpLiteral | Program | FunctionDeclaration | FunctionExpression | ArrowFunctionExpression | SwitchCase | CatchClause | VariableDeclarator | ExpressionStatement | BlockStatement | EmptyStatement | DebuggerStatement | WithStatement | ReturnStatement | LabeledStatement | BreakStatement | ContinueStatement | IfStatement | SwitchStatement | ThrowStatement | TryStatement | WhileStatement | DoWhileStatement | ForStatement | ForInStatement | ForOfStatement | VariableDeclaration | ClassDeclaration | ThisExpression | ArrayExpression | ObjectExpression | YieldExpression | UnaryExpression | UpdateExpression | BinaryExpression | AssignmentExpression | LogicalExpression | MemberExpression | ConditionalExpression | SimpleCallExpression | NewExpression | SequenceExpression | TemplateLiteral | TaggedTemplateExpression | ClassExpression | MetaProperty | AwaitExpression | Property | AssignmentProperty | Super | TemplateElement | SpreadElement | ObjectPattern | ArrayPattern | RestElement | AssignmentPattern | ClassBody | MethodDefinition | ImportDeclaration | ExportNamedDeclaration | ExportDefaultDeclaration | ExportAllDeclaration | ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier | ExportSpecifier
```

Babel 有文档对 AST 树的详细定义，可参考这里

## **配套源码地址**

代码以存放到 GitHub，地址：https://github.com/fecym/ast-share

## 

## 

## 

## **参考链接**

1. JavaScript 语法解析、AST、V8、JIT
2. 详解 AST 抽象语法树
3. AST 抽象语法树 ps: 这个里面有 class 转 Es5 构造函数的过程，有兴趣可以看一下
4. 剖析 Babel——Babel 总览 | AlloyTeam
5. @babel/types



