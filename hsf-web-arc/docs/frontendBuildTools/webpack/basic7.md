---
title: webpack进阶（二）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# webpack-3.源码流程

## 1. webpack编译流程

- 初始化参数：从配置文件和`Shell`语句中读取与合并参数，得出最终的参数；
- 开始编译：用上一步得到的参数初始化`Compiler`对象，加载所有配置的插件，执行对象的`run`方法开始执行编译； 确定入口：根据配置中的`entry`找出所有的入口文件
- 编译模块：从入口文件出发，调用所有配置的`Loader`对模块进行编译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
- 完成模块编译：在经过第4步使用`Loader`翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
- 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 `Chunk`，再把每个`Chunk`转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
- 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

> 在以上过程中，`Webpack` 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果

![webpackflowes](http://img.zhufengpeixun.cn/webpackflow2.png)

## 2.调试webpack

- [cli](https://webpack.js.org/api/cli)

### 2.1 如何生成调试文件

- 打开工程目录，点击调试按钮，再点击小齿轮的配置按钮系统就会生成launch.json配置文件
- 修改好了以后直接点击F5就可以启动调试

.vscode\launch.json

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "debug webpack",
            "cwd":"${workspaceFolder}",
            "program":"${workspaceFolder}/node_modules/webpack-cli/bin/cli.js"
        }
    ]
}
```

### 2.2 webpack.cmd

- `webpack-source\node_modules\.bin\webpack.cmd`
- `%~dp0`是批处理文件所在的盘符:+路径(%~dp0 C:\vipdata\vipproject\webpack-source\node_modules.bin)
- `SETLOCAL`主要针对临时环境变量，不会影响到系统的变量环境设置，应与endlocal联用
- `PATHEXT`当在一个相同的目录结构下，有相同的多个主文件名，不同的文件后缀名时，系统会根据PATHEXT中的后缀名，选择其中顺序最靠前的那一个

```js
@IF EXIST "%~dp0\node.exe" (//如果当前盘符的根目录下存在node.exe,用当前的node执行
  "%~dp0\node.exe"  "%~dp0\..\_webpack@4.39.3@webpack\bin\webpack.js" %*
) ELSE (//如果当前的盘符没有node.exe
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\_webpack@4.39.3@webpack\bin\webpack.js" %*
)
```

### 2.3 webpack.js

- node_modules\webpack\bin\webpack.js

```js
const path = require("path");
const pkgPath = require.resolve(`${installedClis[0].package}/package.json`);
const pkg = require(pkgPath);
require(path.resolve(
    path.dirname(pkgPath),
    pkg.bin[installedClis[0].binName]
));
const path = require("path");
const pkgPath = require.resolve(`webpack-cli/package.json`);
const pkg = require(pkgPath);
require(path.resolve(path.dirname(pkgPath),pkg.bin['webpack-cli']));
npx webpack = node ./node_modules/webpack-cli/bin/cli.js
```

### 2.4 cli.js

```js
const webpack = require("webpack");
const webpackOptions = require("./webpack.config");
const compiler = webpack(webpackOptions);
compiler.run((err, stats) => {
  console.log(err);
  console.log(stats.toJson({
    entries:true,
    chunks:true,
    modules:true,
    _modules:true,
    assets:true
  }));
});
```

## 3.Stats 对象

- 在 Webpack 的回调函数中会得到stats对象
- 这个对象实际来自于`Compilation.getStats()`，返回的是主要含有`modules`、`chunks`和`assets`三个属性值的对象。
- Stats对象本质上来自于[lib/Stats.js](https://github.com/webpack/webpack/blob/v4.39.3/lib/Stats.js)的类实例

| 字段    | 含义                   |
| :------ | :--------------------- |
| modules | 记录了所有解析后的模块 |
| chunks  | 记录了所有chunk        |
| assets  | 记录了所有要生成的文件 |

```js
npx webpack --profile --json > stats.json
{
  "errors": [],// 错误字符串 (error string) 的数组
  "warnings": [],//警告字符串 (warning string) 的数组
  "version": "4.39.3",// 用来编译的 webpack 的版本
  "hash": "3e945ec6b2c56d0b010e",//编译使用的 hash
  "time": 66, // 编译耗时 (ms)
  "builtAt": 1567225465347,//编译的时间
  "publicPath": "",//资源访问路径
  "outputPath": "C:\\vipdata\\vipproject\\webpack-source\\dist",//webpack输出目录
  "assetsByChunkName": {//用作映射的 chunk 的名称
    "lazy": "lazy.bundle.js",//chunk的名字叫lazy,lazy.bundle.js
    "main": "bundle.js"//chunk的名字叫main,打包出来了bundle.js
  },
  "assets": [//asset 对象 (asset objects) 的数组
    {
      "name": "bundle.js",//文件名
      "size": 9043,//大小
      "chunks": [//包含的代码块
        "main"
      ],
      "chunkNames": [//包含的代码块名称
        "main"
      ],
      "emitted": true//是否要生成
    },
    {
      "name": "lazy.bundle.js", // 输出的文件名
      "size": 336,// 文件的大小
      "chunks": [ // 这个 asset 包含的 chunk 的 id
        "lazy"
      ],
      "chunkNames": [// 这个 asset 包含的 chunk
        "lazy"
      ],
      "emitted": true  // 表示这个 asset 是否会让它输出到 output 目录
    }
  ],
  "filteredAssets": 0,
  "entrypoints": {
    "main": {
      "chunks": [
        "main"
      ],
      "assets": [
        "bundle.js"
      ],
      "children": {},
      "childAssets": {}
    }
  },
  "namedChunkGroups": {
    "main": {
      "chunks": [
        "main"
      ],
      "assets": [
        "bundle.js"
      ],
      "children": {},
      "childAssets": {}
    },
    "lazy": {
      "chunks": [
        "lazy"
      ],
      "assets": [
        "lazy.bundle.js"
      ],
      "children": {},
      "childAssets": {}
    }
  },
  "chunks": [ //chunk 对象 (chunk objects) 的数组
    {
      "id": "lazy", // 这个 chunk 的id
      "rendered": true,// 表示这个 chunk 是否会参与进编译
      "initial": false,
      "entry": false,// 表示这个 chunk 是否包含 webpack 的运行时
      "size": 24,//预估的模块大小
      "names": [// 包含在这个 chunk 内的 chunk 的名字的数组
        "lazy"
      ],
      "files": [
        "lazy.bundle.js"
      ],
      "hash": "d08a8b502d30324f81e1",
      "siblings": [],
      "parents": [// 父 chunk 的 ids
        "main"
      ],
      "children": [],
      "childrenByOrder": {},
      "modules": [
        {
          "id": "./src/lazy.js",
          "identifier": "C:\\vipdata\\vipproject\\webpack-source\\src\\lazy.js",
          "name": "./src/lazy.js",
          "index": 2,
          "index2": 2,
          "size": 24,
          "cacheable": true,
          "built": true,
          "optional": false,
          "prefetched": false,
          "chunks": [
            "lazy"
          ],
          "issuer": "C:\\vipdata\\vipproject\\webpack-source\\src\\index.js",
          "issuerId": "./src/index.js",
          "issuerName": "./src/index.js",
          "issuerPath": [
            {
              "id": "./src/index.js",
              "identifier": "C:\\vipdata\\vipproject\\webpack-source\\src\\index.js",
              "name": "./src/index.js",
              "profile": {
                "factory": 18,
                "building": 14
              }
            }
          ],
          "profile": {
            "factory": 4,
            "building": 2
          },
          "failed": false,
          "errors": 0,
          "warnings": 0,
          "assets": [],
          "reasons": [// 生成 assets 的原因
            {
              "moduleId": "./src/index.js",//模块的ID
              "moduleIdentifier": "C:\\vipdata\\vipproject\\webpack-source\\src\\index.js",//唯一标识
              "module": "./src/index.js",//模块
              "moduleName": "./src/index.js",//模块名称
              "type": "import()",//类型
              "userRequest": "./lazy",//用户请求方式
              "loc": "2:0-46"//在父模块中的位置
            }
          ],
          "providedExports": null,
          "optimizationBailout": [],
          "depth": 1,
          "source": "module.exports = 'lazy';"
        }
      ],
      "filteredModules": 0,
      "origins": [
        {
          "moduleId": "./src/index.js",// 模块的ID
          "module": "C:\\vipdata\\vipproject\\webpack-source\\src\\index.js",// 模块的位置
          "moduleIdentifier": "C:\\vipdata\\vipproject\\webpack-source\\src\\index.js",// 模块的地址
          "moduleName": "./src/index.js",//模块的相对地址
          "loc": "2:0-46",
          "request": "./lazy",
          "reasons": [] // 具体是哪行生成了这个chunk
        }
      ]
    },
    {
      "id": "main",
      "rendered": true,
      "initial": true,
      "entry": true,
      "size": 162,
      "names": [
        "main"
      ],
      "files": [
        "bundle.js"
      ],
      "hash": "263cadc0459e8470151b",
      "siblings": [],
      "parents": [],
      "children": [// 自己引用哪些chunk
        "lazy"
      ],
      "childrenByOrder": {}, // 引用的顺序
      "modules": [
        {
          "id": "./src/hello.js",
          "identifier": "C:\\vipdata\\vipproject\\webpack-source\\src\\hello.js",
          "name": "./src/hello.js",
          "index": 1,
          "index2": 0,
          "size": 25,
          "cacheable": true,
          "built": true,
          "optional": false,
          "prefetched": false,
          "chunks": [
            "main"
          ],
          "issuer": "C:\\vipdata\\vipproject\\webpack-source\\src\\index.js",
          "issuerId": "./src/index.js",
          "issuerName": "./src/index.js",
          "issuerPath": [
            {
              "id": "./src/index.js",
              "identifier": "C:\\vipdata\\vipproject\\webpack-source\\src\\index.js",
              "name": "./src/index.js",
              "profile": {
                "factory": 18,
                "building": 14
              }
            }
          ],
          "profile": {
            "factory": 4,
            "building": 2
          },
          "failed": false,
          "errors": 0,
          "warnings": 0,
          "assets": [],
          "reasons": [
            {
              "moduleId": "./src/index.js",
              "moduleIdentifier": "C:\\vipdata\\vipproject\\webpack-source\\src\\index.js",
              "module": "./src/index.js",
              "moduleName": "./src/index.js",
              "type": "cjs require",
              "userRequest": "./hello",
              "loc": "1:12-30"
            }
          ],
          "providedExports": null,
          "optimizationBailout": [],
          "depth": 1,
          "source": "module.exports = 'hello';"
        },
        {
          "id": "./src/index.js",
          "identifier": "C:\\vipdata\\vipproject\\webpack-source\\src\\index.js",
          "name": "./src/index.js",
          "index": 0,
          "index2": 1,
          "size": 137,
          "cacheable": true,
          "built": true,
          "optional": false,
          "prefetched": false,
          "chunks": [
            "main"
          ],
          "issuer": null,
          "issuerId": null,
          "issuerName": null,
          "issuerPath": null,
          "profile": {
            "factory": 18,
            "building": 14
          },
          "failed": false,
          "errors": 0,
          "warnings": 0,
          "assets": [],
          "reasons": [
            {
              "moduleId": null,
              "moduleIdentifier": null,
              "module": null,
              "moduleName": null,
              "type": "single entry",
              "userRequest": "./src/index.js",
              "loc": "main"
            }
          ],
          "providedExports": null,
          "optimizationBailout": [],
          "depth": 0,
          "source": "let hello = require('./hello');\r\nimport(/* webpackChunkName: \"lazy\" */'./lazy').then(result=>{\r\n    console.log(hello,resut.default)\r\n});"
        }
      ],
      "filteredModules": 0,
      "origins": [
        {
          "module": "",
          "moduleIdentifier": "",
          "moduleName": "",
          "loc": "main",
          "request": "./src/index.js",
          "reasons": []
        }
      ]
    }
  ],
  "modules": [// 模块对象 (module objects) 的数组
    {
      "id": "./src/hello.js",//模块ID
      "identifier": "C:\\vipdata\\vipproject\\webpack-source\\src\\hello.js",//webpack内部使用的唯一的标识
      "name": "./src/hello.js",// 实际文件的地址
      "index": 1,//索引
      "index2": 0,//索引
      "size": 25,// 预估模块的大小 (byte)
      "cacheable": true,// 表示这个模块是否会被缓存
      "built": true,// 表示这个模块会参与 Loaders , 解析, 并被编译
      "optional": false,// 每一个对这个模块的请求都会包裹在 `try... catch` 内
      "prefetched": false,// 表示这个模块是否会被 prefetched
      "chunks": [//此模块在哪个代码块内
        "main"
      ],
      "issuer": "C:\\vipdata\\vipproject\\webpack-source\\src\\index.js",//使用者唯一标识
      "issuerId": "./src/index.js",//使用者ID
      "issuerName": "./src/index.js",//使用者名称
      "issuerPath": [//使用者路径
        {
          "id": "./src/index.js",
          "identifier": "C:\\vipdata\\vipproject\\webpack-source\\src\\index.js",
          "name": "./src/index.js",
          "profile": { //这个模块特有的编译时间数据(ms)
            "factory": 18,// 解决依赖的时间
            "building": 14 // 载入和解析的时间
          }
        }
      ],
      "profile": {
        "factory": 4,// 解决依赖的时间
        "building": 2// 载入和解析的时间
      },
      "failed": false,//是否失败
      "errors": 0,// 处理模块时错误的数量
      "warnings": 0,// 处理模块时警告的数量
      "assets": [],//在哪个资源内
      "reasons": [
        {
          "moduleId": "./src/index.js",// 模块的 ID
          "moduleIdentifier": "C:\\vipdata\\vipproject\\webpack-source\\src\\index.js",// 模块的地址
          "module": "./src/index.js",// 所基于模块的相对地址 context
          "moduleName": "./src/index.js",
          "type": "cjs require",// 使用的请求的种类 (require或import)
          "userRequest": "./hello",// 用来 `import` 或者 `require` 的源字符串
          "loc": "1:12-30" // 导致这个被加入依赖图标的代码行数
        }
      ],
      "providedExports": null,//提供的导出对象
      "optimizationBailout": [],//失败时的优化
      "depth": 1,//模块深度
      "source": "module.exports = 'hello';"// 字符串化的输入
    },
    {
      "id": "./src/index.js",
      "identifier": "C:\\vipdata\\vipproject\\webpack-source\\src\\index.js",
      "name": "./src/index.js",
      "index": 0,
      "index2": 1,
      "size": 137,
      "cacheable": true,
      "built": true,
      "optional": false,
      "prefetched": false,
      "chunks": [
        "main"
      ],
      "issuer": null,
      "issuerId": null,
      "issuerName": null,
      "issuerPath": null,
      "profile": {
        "factory": 18,
        "building": 14
      },
      "failed": false,
      "errors": 0,
      "warnings": 0,
      "assets": [],
      "reasons": [
        {
          "moduleId": null,
          "moduleIdentifier": null,
          "module": null,
          "moduleName": null,
          "type": "single entry",
          "userRequest": "./src/index.js",
          "loc": "main"
        }
      ],
      "providedExports": null,
      "optimizationBailout": [],
      "depth": 0,
      "source": "let hello = require('./hello');\r\nimport(/* webpackChunkName: \"lazy\" */'./lazy').then(result=>{\r\n    console.log(hello,resut.default)\r\n});"
    },
    {
      "id": "./src/lazy.js",
      "identifier": "C:\\vipdata\\vipproject\\webpack-source\\src\\lazy.js",
      "name": "./src/lazy.js",
      "index": 2,
      "index2": 2,
      "size": 24,
      "cacheable": true,
      "built": true,
      "optional": false,
      "prefetched": false,
      "chunks": [
        "lazy"
      ],
      "issuer": "C:\\vipdata\\vipproject\\webpack-source\\src\\index.js",
      "issuerId": "./src/index.js",
      "issuerName": "./src/index.js",
      "issuerPath": [
        {
          "id": "./src/index.js",
          "identifier": "C:\\vipdata\\vipproject\\webpack-source\\src\\index.js",
          "name": "./src/index.js",
          "profile": {
            "factory": 18,
            "building": 14
          }
        }
      ],
      "profile": {
        "factory": 4,
        "building": 2
      },
      "failed": false,
      "errors": 0,
      "warnings": 0,
      "assets": [],
      "reasons": [
        {
          "moduleId": "./src/index.js",
          "moduleIdentifier": "C:\\vipdata\\vipproject\\webpack-source\\src\\index.js",
          "module": "./src/index.js",
          "moduleName": "./src/index.js",
          "type": "import()",
          "userRequest": "./lazy",
          "loc": "2:0-46"
        }
      ],
      "providedExports": null,
      "optimizationBailout": [],
      "depth": 1,
      "source": "module.exports = 'lazy';"
    }
  ],
  "filteredModules": 0,
  "logging": {
    "webpack.buildChunkGraph.visitModules": {
      "entries": [],
      "filteredEntries": 5,
      "debug": false
    }
  },
  "children": []
}
```

## 4. 主要工作流程

- Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：
- `初始化参数`：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
- 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的run方法开始执行编译； 确定入口：根据配置中的 entry 找出所有的入口文件
- 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行编译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
- 完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
- 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
- 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。
- 在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

![webpackcode](http://img.zhufengpeixun.cn/webpackcode.jpg)

Powered by [idoc](https://github.com/jaywcjlove/idoc). Dependence [Node.js](https://nodejs.org/) run.



# webpack-4.tapable

## 1. webpack的插件机制

- 在具体介绍webpack内置插件与钩子可视化工具之前，我们先来了解一下webpack中的插件机制。 webpack实现插件机制的大体方式是：
  - 创建 - webpack在其内部对象上创建各种钩子；
  - 注册 - 插件将自己的方法注册到对应钩子上，交给webpack；
  - 调用 - webpack编译过程中，会适时地触发相应钩子，因此也就触发了插件的方法。
- Webpack本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是Tapable，webpack中最核心的负责编译的Compiler和负责创建bundle的Compilation都是Tapable的实例
- 通过事件和注册和监听，触发webpack生命周期中的函数方法

```js
const {
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook
} = require('tapable');
```

## 2. tapable分类

### 2.1 按同步异步分类

- Hook 类型可以分为`同步Sync`和`异步Async`，异步又分为`并行`和`串行`

![asynctapablesync](http://img.zhufengpeixun.cn/asynctapablesync.jpg)

### 2.1 按返回值分类

![mytapable](http://img.zhufengpeixun.cn/mytapable.jpg)

#### 2.1.1 Basic

- 执行每一个事件函数，不关心函数的返回值,有 SyncHook、AsyncParallelHook、AsyncSeriesHook

![BasicTapable](http://img.zhufengpeixun.cn/BasicTapable.jpg)

#### 2.1.2 Bail

- 执行每一个事件函数，遇到第一个结果 `result !== undefined` 则返回，不再继续执行。有：SyncBailHook、AsyncSeriesBailHook, AsyncParallelBailHook

![BailTapables](http://img.zhufengpeixun.cn/BailTapables.jpg)

#### 2.1.3 Waterfall

- 如果前一个事件函数的结果 `result !== undefined`,则 result 会作为后一个事件函数的第一个参数,有SyncWaterfallHook，AsyncSeriesWaterfallHook

![waterfallTapables](http://img.zhufengpeixun.cn/waterfallTapables.jpg)

#### 2.1.4 Loop

- 不停的循环执行事件函数，直到所有函数结果 `result === undefined`,有SyncLoopHook 和 AsyncSeriesLoopHook

![LoopTapables2](http://img.zhufengpeixun.cn/LoopTapables2.jpg)

## 3.使用

### 3.1 SyncHook

- 所有的构造函数都接收一个可选参数，参数是一个参数名的字符串数组
- 参数的名字可以任意填写，但是参数数组的长数必须要根实际接受的参数个数一致
- 如果回调函数不接受参数，可以传入空数组
- 在实例化的时候传入的数组长度长度有用，值没有用途
- 执行call时，参数个数和实例化时的数组长度有关
- 回调的时候是按先入先出的顺序执行的，先放的先执行

```js
const {SyncHook} = require('tapable');
const hook = new SyncHook(['name','age']);
hook.tap('1',(name,age)=>{
    console.log(1,name,age);
    return 1;
});
hook.tap('2',(name,age)=>{
    console.log(2,name,age);
    return 2;
});
hook.tap('3',(name,age)=>{
    console.log(3,name,age);
    return 3;
});

hook.call('zhufeng',10);
1 zhufeng 10
2 zhufeng 10
3 zhufeng 10
```

### 3.2 SyncBailHook

- BailHook中的回调函数也是顺序执行的
- 调用call时传入的参数也可以传给回调函数
- 当回调函数返回非undefined值的时候会停止调用后续的回调

```js
const {SyncBailHook} = require('tapable');
const hook = new SyncBailHook(['name','age']);
hook.tap('1',(name,age)=>{
    console.log(1,name,age);
    //return 1;
});
hook.tap('2',(name,age)=>{
    console.log(2,name,age);
    return 2;
});
hook.tap('3',(name,age)=>{
    console.log(3,name,age);
    return 3;
});

hook.call('zhufeng',10);
```

### 3.3 SyncWaterfallHook

- SyncWaterfallHook表示如果上一个回调函数的结果不为undefined,则可以作为下一个回调函数的第一个参数
- 回调函数接受的参数来自于上一个函数的结果
- 调用call传入的第一个参数，会被上一个函数的非undefined结果替换
- 当回调函数返回非undefined不会停止回调栈的调用

```js
const {SyncWaterfallHook} = require('tapable');

const hook = new SyncWaterfallHook(['name','age']);
hook.tap('1',(name,age)=>{
    console.log(1,name,age);
    return 1;
});
hook.tap('2',(name,age)=>{
    console.log(2,name,age);
    return ;
});
hook.tap('3',(name,age)=>{
    console.log(3,name,age);
    return 3;
});

hook.call('zhufeng',10);
```

### 3.4 SyncLoopHook

- SyncLoopHook的特点是不停的循环执行回调函数，直到函数结果等于undefined
- 要注意的是每次循环都是从头开始循环的

```js
const { SyncLoopHook } = require('tapable');
//当回调函数返回非undefined值的时候会停止调用后续的回调

let hook = new SyncLoopHook(['name', 'age']);
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
hook.tap('1', (name, age) => {
    console.log(1, 'counter1', counter1);
    if (++counter1 == 1) {
        counter1 = 0
        return;
    }
    return true;
});
hook.tap('2', (name, age) => {
    console.log(2, 'counter2', counter2);
    if (++counter2 == 2) {
        counter2 = 0
        return;
    }
    return true;
});
hook.tap('3', (name, age) => {
    console.log(3, 'counter3', counter3);
    if (++counter3 == 3) {
        counter3 = 0
        return;
    }
    return true;
});
hook.call('zhufeng', 10);
1 counter1 0
2 counter2 0
1 counter1 0
2 counter2 1
3 counter3 0
1 counter1 0
2 counter2 0
1 counter1 0
2 counter2 1
3 counter3 1
1 counter1 0
2 counter2 0
1 counter1 0
2 counter2 1
3 counter3 2
```

### 3.5 AsyncParallelHook

- 异步并行执行钩子

#### 3.5.1 tap

- 同步注册

  ```js
  let {AsyncParallelHook}=require('tapable');
  let queue = new AsyncParallelHook(['name']);
  console.time('cost');
  queue.tap('1',function(name){
    console.log(1);
  });
  queue.tap('2',function(name){
    console.log(2);
  });
  queue.tap('3',function(name){
    console.log(3);
  });
  queue.callAsync('zfpx',err=>{
    console.log(err);
    console.timeEnd('cost');
  });
  ```

#### 3.5.2 tapAsync

- 异步注册，全部任务完成后执行最终的回调

  ```js
  let {AsyncParallelHook}=require('tapable');
  let queue = new AsyncParallelHook(['name']);
  console.time('cost');
  queue.tapAsync('1',function(name,callback){
    setTimeout(function(){
        console.log(1);
        callback();
    },1000)
  });
  queue.tapAsync('2',function(name,callback){
    setTimeout(function(){
        console.log(2);
        callback();
    },2000)
  });
  queue.tapAsync('3',function(name,callback){
    setTimeout(function(){
        console.log(3);
        callback();
    },3000)
  });
  queue.callAsync('zfpx',err=>{
    console.log(err);
    console.timeEnd('cost');
  });
  ```

#### 3.5.3 tapPromise

- promise注册钩子
- 全部完成后执行才算成功

```js
let {AsyncParallelHook}=require('tapable');
let queue = new AsyncParallelHook(['name']);
console.time('cost');
queue.tapPromise('1',function(name){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log(1);
            resolve();
        },1000)
    });

});
queue.tapPromise('2',function(name){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log(2);
            resolve();
        },2000)
    });
});
queue.tapPromise('3',function(name){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log(3);
            resolve();
        },3000)
    });
});
queue.promise('zfpx').then(()=>{
    console.timeEnd('cost');
})
```

### 3.6 AsyncParallelBailHook

- 带保险的异步并行执行钩子
- 有一个任务返回值不为空就直接结束

#### 3.6.1 tap

- 如果有一个任务有返回值则调用最终的回调

  ```js
  let {AsyncParallelBailHook} = require('tapable');
  let queue=new AsyncParallelBailHook(['name']);
  console.time('cost');
  queue.tap('1',function(name){
    console.log(1);
    return "Wrong";
  });
  queue.tap('2',function(name){
    console.log(2);
  });
  queue.tap('3',function(name){
    console.log(3);
  });
  queue.callAsync('zfpx',err=>{
    console.log(err);
    console.timeEnd('cost');
  });
  ```

  #### 3.6.2 tapAsync

- 有一个任务返回错误就直接调最终的回调

  ```js
  let {AsyncParallelBailHook} = require('tapable');
  let queue=new AsyncParallelBailHook(['name']);
  console.time('cost');
  queue.tapAsync('1',function(name,callback){
    console.log(1);
    callback('Wrong');
  });
  queue.tapAsync('2',function(name,callback){
    console.log(2);
    callback();
  });
  queue.tapAsync('3',function(name,callback){
    console.log(3);
    callback();
  });
  queue.callAsync('zfpx',err=>{
    console.log(err);
    console.timeEnd('cost');
  });
  ```

#### 3.6.3 tapPromise

- 只要有一个任务有resolve或者reject值，不管成功失败都结束

```js
let { AsyncParallelBailHook } = require('tapable');
let queue = new AsyncParallelBailHook(['name']);
console.time('cost');
queue.tapPromise('1', function (name) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log(1);
            resolve(1);
        }, 1000)
    });
});
queue.tapPromise('2', function (name) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log(2);
            resolve();
        }, 2000)
    });
});

queue.tapPromise('3', function (name) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log(3);
            resolve();
        }, 3000)
    });
});

queue.promise('zfpx').then((result) => {
    console.log('成功', result);
    console.timeEnd('cost');
}, err => {
    console.error('失败', err);
    console.timeEnd('cost');
})
```

### 3.7 AsyncSeriesHook

- 异步串行钩子
- 任务一个一个执行,执行完上一个执行下一个

#### 3.7.1 tap

```js
let { AsyncSeriesHook } = require('tapable');
let queue = new AsyncSeriesHook(['name']);
console.time('cost');
queue.tap('1', function (name) {
    console.log(1);
});
queue.tap('2', function (name) {
    console.log(2);
});
queue.tap('3', function (name) {
    console.log(3);
});
queue.callAsync('zhufeng', err => {
    console.log(err);
    console.timeEnd('cost');
});
```

#### 3.7.2 tapAsync

```js
let { AsyncSeriesHook } = require('tapable');
let queue = new AsyncSeriesHook(['name']);
console.time('cost');
queue.tapAsync('1',function(name,callback){
   setTimeout(function(){
       console.log(1);
   },1000)
});
queue.tapAsync('2',function(name,callback){
    setTimeout(function(){
        console.log(2);
        callback();
    },2000)
});
queue.tapAsync('3',function(name,callback){
    setTimeout(function(){
        console.log(3);
        callback();
    },3000)
});
queue.callAsync('zfpx',err=>{
    console.log(err);
    console.timeEnd('cost');
});
```

#### 3.7.3 tapPromise

```js
let { AsyncSeriesHook } = require('tapable');
let queue = new AsyncSeriesHook(['name']);
console.time('cost');
queue.tapPromise('1', function (name) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log(1, name);
            resolve();
        }, 1000)
    });
});
queue.tapPromise('2', function (name) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log(2, name);
            resolve();
        }, 2000)
    });
});
queue.tapPromise('3', function (name) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log(3, name);
            resolve();
        }, 3000)
    });
});
queue.promise('zfpx').then(data => {
    console.log(data);
    console.timeEnd('cost');
});
```

### 3.8 AsyncSeriesBailHook

- 只要有一个返回了不为undefined的值就直接结束

  #### 3.8.1 tap

  ```js
  let {AsyncSeriesBailHook} = require('tapable');
  let queue = new AsyncSeriesBailHook(['name']);
  console.time('cost');
  queue.tap('1',function(name){
    console.log(1);
    return "Wrong";
  });
  queue.tap('2',function(name){
    console.log(2);
  });
  queue.tap('3',function(name){
    console.log(3);
  });
  queue.callAsync('zfpx',err=>{
    console.log(err);
    console.timeEnd('cost');
  });
  ```

  #### 3.8.1 tapAsync

  ```js
  let {AsyncSeriesBailHook}=require('tapable');
  let queue = new AsyncSeriesBailHook(['name']);
  console.time('cost');
  queue.tapAsync('1',function(name,callback){
   setTimeout(function(){
       console.log(1);
       callback('wrong');
   },1000)
  });
  queue.tapAsync('2',function(name,callback){
    setTimeout(function(){
        console.log(2);
        callback();
    },2000)
  });
  queue.tapAsync('3',function(name,callback){
    setTimeout(function(){
        console.log(3);
        callback();
    },3000)
  });
  queue.callAsync('zfpx',err=>{
    console.log(err);
    console.timeEnd('cost');
  });
  ```

  #### 3.8.1 tapPromise

  ```js
  let {AsyncSeriesBailHook} = require('tapable');
  let queue = new AsyncSeriesBailHook(['name']);
  console.time('cost');
  queue.tapPromise('1',function(name){
   return new Promise(function(resolve){
       setTimeout(function(){
           console.log(1);
           resolve();
       },1000)
   });
  });
  queue.tapPromise('2',function(name,callback){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log(2);
            reject('失败了');
        },2000)
    });
  });
  queue.tapPromise('3',function(name,callback){
    return new Promise(function(resolve){
        setTimeout(function(){
            console.log(3);
            resolve();
        },3000)
    });
  });
  queue.promise('zfpx').then(data=>{
    console.log(data);
    console.timeEnd('cost');
  },error=>{
    console.log(error);
    console.timeEnd('cost');
  });
  ```

### 3.9 AsyncSeriesWaterfallHook

- 只要有一个返回了不为undefined的值就直接结束

  #### 3.9.1 tap

  ```js
  let { AsyncSeriesWaterfallHook } = require('tapable');
  let queue = new AsyncSeriesWaterfallHook(['name', 'age']);
  console.time('cost');
  queue.tap('1', function (name, age) {
    console.log(1, name, age);
    return 'return1';
  });
  queue.tap('2', function (data, age) {
    console.log(2, data, age);
    return 'return2';
  });
  queue.tap('3', function (data, age) {
    console.log(3, data, age);
  });
  queue.callAsync('zfpx', 10, err => {
    console.log(err);
    console.timeEnd('cost');
  });
  ```

  #### 3.9.1 tapAsync

  ```js
  let { AsyncSeriesWaterfallHook } = require('tapable');
  let queue = new AsyncSeriesWaterfallHook(['name', 'age']);
  console.time('cost');
  queue.tapAsync('1', function (name, age, callback) {
    setTimeout(function () {
        console.log(1, name, age);
        callback(null, 1);
    }, 1000)
  });
  queue.tapAsync('2', function (data, age, callback) {
    setTimeout(function () {
        console.log(2, data, age);
        callback(null, 2);
    }, 2000)
  });
  queue.tapAsync('3', function (data, age, callback) {
    setTimeout(function () {
        console.log(3, data, age);
        callback(null, 3);
    }, 3000)
  });
  queue.callAsync('zfpx', 10, (err, data) => {
    console.log(err, data);
    console.timeEnd('cost');
  });
  ```

  #### 3.9.1 tapPromise

  ```js
  let {AsyncSeriesWaterfallHook} = require('tapable');
  let queue = new AsyncSeriesWaterfallHook(['name']);
  console.time('cost');
  queue.tapPromise('1', function (name) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log(name, 1);
            resolve(1);
        }, 1000);
    });
  });
  queue.tapPromise('2', function (data) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log(data, 2);
            resolve(2);
        }, 2000);
    });
  });
  queue.tapPromise('3', function (data) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log(data, 3);
            resolve(3);
        }, 3000);
    });
  });
  queue.promise('zfpx').then(err => {
    console.timeEnd('cost');
  });
  ```

## 4.SyncHook

1. 所有的构造函数都接收一个可选参数，参数是一个参数名的字符串数组
2. 参数的名字可以任意填写，但是参数数组的长数必须要根实际接受的参数个数一致
3. 如果回调函数不接受参数，可以传入空数组
4. 在实例化的时候传入的数组长度长度有用，值没有用途
5. 执行call时，参数个数和实例化时的数组长度有关
6. 回调的时候是按先入先出的顺序执行的，先放的先执行

### 4.1 使用

```js
//const { SyncHook } = require("./tapable");
const { SyncHook } = require('tapable');
let syncHook = new SyncHook(["name", "age"]);
syncHook.tap("1", (name, age) => {
    console.log(1, name, age);
});
syncHook.tap("2", (name, age) => {
    console.log(2, name, age);
});
syncHook.call("zhufeng", 10);
(function anonymous(name, age
) {
"use strict";
var _context;
var _x = this._x;
var _fn0 = _x[0];
_fn0(name, age);
var _fn1 = _x[1];
_fn1(name, age);
})
```

### 4.2 实现

#### 4.2.1 index.js

tapable\index.js

```js
let SyncHook = require('./SyncHook');
module.exports = {
    SyncHook
}
```

#### 4.2.2 Hook.js

tapable\Hook.js

```js
class Hook {
    constructor(args) {
        if (!Array.isArray(args)) args = []; //参数
        this.args = args; // 这里存入初始化的参数
        this.taps = []; //这里就是回调栈用到的数组
        this._x = undefined; //这个比较重要，后面拼代码会用
    }
    tap(options, fn) {
        if (typeof options === "string") options = { name: options };
        options.fn = fn;
        this._insert(options); //参数处理完之后，调用_insert，这是关键代码
    }
    _insert(item) {
        this.taps[this.taps.length] = item;
    }
    call(...args) {
        let callMethod = this._createCall();
        return callMethod.apply(this, args);
    }
    _createCall() {
        return this.compile({
            taps: this.taps,
            args: this.args
        });
    }
}

module.exports = Hook;
```

#### 4.2.3 SyncHook

tapable\SyncHook.js

```js
const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");
const factory = new HookCodeFactory();
class SyncHook extends Hook {
    constructor(args) {
        super(args);
    }
    compile(options) {
        factory.setup(this, options);
        return factory.create(options);
    }
}
module.exports = SyncHook;
```

#### 4.2.4 HookCodeFactory.js

tapable\HookCodeFactory.js

```js
class HookCodeFactory {
    args() {
        return this.options.args.join(",");
    }
    setup(instance, options) {
        this.options = options;
        instance._x = options.taps.map(t => t.fn);
    }
    header() {
        return "var _x = this._x;\n";
    }
    content() {
        let code = "";
        for (let idx = 0; idx < this.options.taps.length; idx++) {
            code += `var _fn${idx} = _x[${idx}];\n
                 _fn${idx}(${this.args()});\n`;
        }
        return code;
    }
    create() {
        return new Function(this.args(), this.header() + this.content());
    }
}
module.exports = HookCodeFactory;
```

## 5. AsyncParallelHook

### 5.1 使用

```js
let { AsyncParallelHook } = require('./tapable');
let queue = new AsyncParallelHook(['name', 'age']);
console.time('cost');
queue.tapAsync('1', function (name, age, callback) {
    setTimeout(function () {
        console.log(1, name, age);
        callback();
    }, 1000)
});
queue.tapAsync('2', function (name, age, callback) {
    setTimeout(function () {
        console.log(2, name, age);
        callback();
    }, 2000)
});
queue.tapAsync('3', function (name, age, callback) {
    setTimeout(function () {
        console.log(3, name, age);
        callback();
    }, 3000)
});
queue.callAsync('zhufeng', 10, err => {
    console.timeEnd('cost');
});
(function anonymous(name, age, _callback
) {
    "use strict";
    var _x = this._x;
    do {
        var _counter = 3;
        var _done = () => {
            _callback();
        };
        if (_counter <= 0) break;
        var _fn0 = _x[0];
        _fn0(name, age, _err0 => {
            if (_err0) {
                if (_counter > 0) {
                    _callback(_err0);
                    _counter = 0;
                }
            } else {
                if (--_counter === 0) _done();
            }
        });
        if (_counter <= 0) break;
        var _fn1 = _x[1];
        _fn1(name, age, _err1 => {
            if (_err1) {
                if (_counter > 0) {
                    _callback(_err1);
                    _counter = 0;
                }
            } else {
                if (--_counter === 0) _done();
            }
        });
        if (_counter <= 0) break;
        var _fn2 = _x[2];
        _fn2(name, age, _err2 => {
            if (_err2) {
                if (_counter > 0) {
                    _callback(_err2);
                    _counter = 0;
                }
            } else {
                if (--_counter === 0) _done();
            }
        });
    } while (false);

})
```

### 5.2 实现

#### 5.2.1 tapable\index.js

tapable\index.js

```diff
let SyncHook = require('./SyncHook');
+let AsyncParallelHook = require('./AsyncParallelHook');
module.exports = {
    SyncHook,
+    AsyncParallelHook
}
```

#### 5.2.2 AsyncParallelHookCodeFactory.js

AsyncParallelHookCodeFactory.js

```js
const HookCodeFactory = require("./HookCodeFactory");
class AsyncParallelHookCodeFactory extends HookCodeFactory {
    args({ before, after } = {}) {
        let allArgs = this.options.args || [];
        if (before) allArgs = [before, ...allArgs];
        if (after) allArgs = [...allArgs, after];
        if (allArgs.length === 0) {
            return "";
        } else {
            return allArgs.join(",");
        }
    }
    create() {
        return new Function(
            this.args({ after: "_callback" }),
            this.header() + this.content()
        );
    }
    content() {
        let code = ``;
        code += `
                var _counter = ${this.options.taps.length};
                var _done = () =>{
                    _callback();
                };
                `;
        for (let idx = 0; idx < this.options.taps.length; idx++) {
            code += `
                    var _fn${idx} = _x[${idx}];
                    _fn${idx}(${this.args()}, _err${idx} =>{
                        if (--_counter === 0) _done();
                    });
                `;
        }
        return code;
    }
}
module.exports = AsyncParallelHookCodeFactory;
```

#### 5.2.3 AsyncParallelHook.js

AsyncParallelHook.js

```js
const Hook = require("./Hook");
let AsyncParallelHookCodeFactory = require('./AsyncParallelHookCodeFactory');

const factory = new AsyncParallelHookCodeFactory();
class AsyncParallelHook extends Hook {
    constructor(args) {
        super(args);
    }
    tapAsync(options, fn) {
        if (typeof options === "string") options = { name: options };
        options.fn = fn;
        this._insert(options);
    }
    callAsync(...args) {
        let callMethod = this._createCall();
        return callMethod.apply(this, args);
    }
    compile(options) {
        factory.setup(this, options);
        return factory.create(options);
    }
}
module.exports = AsyncParallelHook;
```

## 6. AsyncParallelHook promise

### 6.1 使用

```js
let { AsyncParallelHook } = require('tapable');
let queue = new AsyncParallelHook(['name', 'age']);
console.time('cost');
queue.tapPromise('1', function (name, age) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log(1, name, age);
            resolve();
        }, 1000)
    });
});
queue.tapPromise('2', function (name, age) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log(2, name, age);
            resolve();
        }, 2000)
    });
});
queue.tapPromise('3', function (name, age) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log(3, name, age);
            resolve();
        }, 3000)
    });
});
queue.promise('zhufeng', 10).then(result => {
    console.timeEnd('cost');
}, error => {
    console.log(error);
    console.timeEnd('cost');
});
(function anonymous(name, age
) {
    "use strict";
    return new Promise((_resolve, _reject) => {
        var _sync = true;
        function _error(_err) {
            if (_sync)
                _resolve(Promise.resolve().then(() => { throw _err; }));
            else
                _reject(_err);
        };
        var _x = this._x;
        do {
            var _counter = 3;
            var _done = () => {
                _resolve();
            };
            if (_counter <= 0) break;
            var _fn0 = _x[0];
            var _hasResult0 = false;
            var _promise0 = _fn0(name, age);
            if (!_promise0 || !_promise0.then)
                throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise0 + ')');
            _promise0.then(_result0 => {
                _hasResult0 = true;
                if (--_counter === 0) _done();
            }, _err0 => {
                if (_hasResult0) throw _err0;
                if (_counter > 0) {
                    _error(_err0);
                    _counter = 0;
                }
            });
            if (_counter <= 0) break;
            var _fn1 = _x[1];
            var _hasResult1 = false;
            var _promise1 = _fn1(name, age);
            if (!_promise1 || !_promise1.then)
                throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise1 + ')');
            _promise1.then(_result1 => {
                _hasResult1 = true;
                if (--_counter === 0) _done();
            }, _err1 => {
                if (_hasResult1) throw _err1;
                if (_counter > 0) {
                    _error(_err1);
                    _counter = 0;
                }
            });
            if (_counter <= 0) break;
            var _fn2 = _x[2];
            var _hasResult2 = false;
            var _promise2 = _fn2(name, age);
            if (!_promise2 || !_promise2.then)
                throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise2 + ')');
            _promise2.then(_result2 => {
                _hasResult2 = true;
                if (--_counter === 0) _done();
            }, _err2 => {
                if (_hasResult2) throw _err2;
                if (_counter > 0) {
                    _error(_err2);
                    _counter = 0;
                }
            });
        } while (false);
        _sync = false;
    });

})
```

### 6.2 实现

#### 6.2.1 tapable\index.js

tapable\index.js

```diff
let SyncHook = require('./SyncHook');
let AsyncParallelHook = require('./AsyncParallelHook');
+let AsyncParallelHookForPromise = require('./AsyncParallelHookForPromise');
module.exports = {
    SyncHook,
    AsyncParallelHook,
+   AsyncParallelHookForPromise
}
```

#### 6.2.2 AsyncParallelHookCodeFactoryForPromise.js

doc\tapable\AsyncParallelHookCodeFactoryForPromise.js

```js
const HookCodeFactory = require("./HookCodeFactory");
class AsyncParallelHookCodeFactory extends HookCodeFactory {
    args({ before, after } = {}) {
        let allArgs = this.options.args || [];
        if (before) allArgs = [before, ...allArgs];
        if (after) allArgs = [...allArgs, after];
        if (allArgs.length === 0) {
            return "";
        } else {
            return allArgs.join(",");
        }
    }
    create() {
        return new Function(this.args(), this.header() + this.content());
    }
    content() {
        let code = ``;
        code += `
                return new Promise((_resolve)=>{
                    var _counter = ${this.options.taps.length};
                    var _done = ()=>{
                        _resolve();
                    };
                `;

        for (let idx = 0; idx < this.options.taps.length; idx++) {
            code += `
                    var _fn${idx} = _x[${idx}];
                    var _promise${idx} = _fn${idx}(${this.args()});
                    _promise${idx}.then(_result${idx} =>{
                        if (--_counter === 0) _done();
                    });
                `;
        }
        code += `
    });
    `;
        return code;
    }
}
module.exports = AsyncParallelHookCodeFactory;
```

#### 6.2.3 AsyncParallelHookForPromise.js

AsyncParallelHookForPromise.js

```js
let AsyncParallelHookCodeFactoryForPromise = require('./AsyncParallelHookCodeFactoryForPromise');
let Hook = require('./Hook');
const factory = new AsyncParallelHookCodeFactoryForPromise();
class AsyncParallelHookForPromise extends Hook {
    constructor(args) {
        super(args);
    }
    tapPromise(options, fn) {
        if (typeof options === "string") options = { name: options };
        options.fn = fn;
        this._insert(options);
    }
    promise(...args) {
        let callMethod = this._createCall();
        return callMethod.apply(this, args);
    }
    compile(options) {
        factory.setup(this, options);
        return factory.create(options);
    }
}
module.exports = AsyncParallelHookForPromise;
```



