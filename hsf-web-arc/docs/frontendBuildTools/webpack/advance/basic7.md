---
title: webpack分析（七）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# 13.webpack5

## 1. webpack5新特性介绍

- 启动命令
- 持久化缓存
- 资源模块
- `moduleIds` & `chunkIds`的优化
- 更智能的`tree shaking`
- nodeJs的`polyfill`脚本被移除
- 模块联邦

## 2.启动命令

### 2.1 安装

```js
npm install webpack webpack-cli webpack-dev-server html-webpack-plugin babel-loader @babel/core  @babel/preset-env @babel/preset-react style-loader css-loader --save-dev
npm install react react-dom --save
```

### 2.2 webpack.config.js

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development',
    devtool: false,
    module:{
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                "@babel/preset-react"
                            ]
                        },

                    }
                ],
                exclude:/node_modules/
            }
        ]
    },
    devServer:{},
    plugins:[
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        })
    ]
}
```

### 2.3 public\index.html

public\index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>webpack5</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

### 2.4 src\index.js

src\index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
ReactDOM.render(<h1>hello</h1>,root);
```

### 2.5 package.json

package.json

```json
{
  "scripts": {
    "build": "webpack",
    "start": "webpack serve"
  }
}
```

## 3.持久化缓存

- webpack会[缓存](https://webpack.docschina.org/configuration/other-options/#cache)生成的webpack模块和chunk,来改善构建速度
- 缓存在webpack5中默认开启，缓存默认是在内存里,但可以对`cache`进行设置
- webpack 追踪了每个模块的依赖，并创建了文件系统快照。此快照会与真实文件系统进行比较，当检测到差异时，将触发对应模块的重新构建

### 3.1 webpack.config.js

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development',
+   cache: {
+       type: 'filesystem',  //'memory' | 'filesystem'
+       cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack'),
+   },
    devtool: false,
    module:{
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                "@babel/preset-react"
                            ]
                        },

                    }
                ],
                exclude:/node_modules/
            }
        ]
    },
    devServer:{},
    plugins:[
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        })
    ]
}
```

## 4.资源模块

- 资源模块是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader
- `raw-loader` => `asset/source` 导出资源的源代码
- `file-loader` => `asset/resource` 发送一个单独的文件并导出 URL
- `url-loader` => `asset/inline` 导出一个资源的 data URI
- asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 `url-loader`，并且配置资源体积限制实现
- [Rule.type](https://webpack.js.org/configuration/module/#rule)
- [asset-modules](https://webpack.js.org/guides/asset-modules/)

### 4.1 webpack.config.js

```diff
module.exports = {
    module:{
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                "@babel/preset-react"
                            ]
                        },

                    }
                ],
                exclude:/node_modules/
            },
+           {
+               test: /\.png$/,
+               type: 'asset/resource'
+           },
+           {
+               test: /\.ico$/,
+               type: 'asset/inline'
+           },
+           {
+               test: /\.txt$/,
+               type: 'asset/source'
+           },
+           {
+               test: /\.jpg$/,
+               type: 'asset',
+               parser: {
+                   dataUrlCondition: {
+                     maxSize: 4 * 1024 // 4kb
+                   }
+               }
+           }
        ]
    },
  experiments: {
    asset: true
  },
};
```

### 4.2 src\index.js

src\index.js

```diff
+ import png from './assets/logo.png';
+ import ico from './assets/logo.ico';
+ import jpg from './assets/logo.jpg';
+ import txt from './assets/logo.txt';
+ console.log(png,ico,jpg,txt);
```

## 5.URIs

- [experiments](https://webpack.js.org/configuration/experiments/#experiments)
- Webpack 5 支持在请求中处理协议
- 支持data 支持 Base64 或原始编码,`MimeType`可以在`module.rule`中被映射到加载器和模块类型

### 5.1 src\index.js

src\index.js

```js
import data from "data:text/javascript,export default 'title'";
console.log(data);
```

## 6.moduleIds & chunkIds的优化

### 6.1 概念和选项

- module: 每一个文件其实都可以看成一个 module
- chunk: webpack打包最终生成的代码块，代码块会生成文件，一个文件对应一个chunk
- 在webpack5之前，没有从entry打包的chunk文件，都会以1、2、3...的文件命名方式输出,删除某些些文件可能会导致缓存失效
- 在生产模式下，默认启用这些功能chunkIds: "deterministic", moduleIds: "deterministic"，此算法采用`确定性`的方式将短数字 ID(3 或 4 个字符)短hash值分配给 modules 和 chunks
- chunkId设置为deterministic，则output中chunkFilename里的[name]会被替换成确定性短数字ID
- 虽然chunkId不变(不管值是deterministic | natural | named)，但更改chunk内容，chunkhash还是会改变的

| 可选值        | 含义                         | 示例          |
| :------------ | :--------------------------- | :------------ |
| natural       | 按使用顺序的数字ID           | 1             |
| named         | 方便调试的高可读性id         | src_two_js.js |
| deterministic | 根据模块名称生成简短的hash值 | 915           |
| size          | 根据模块大小生成的数字id     | 0             |

### 6.2 webpack.config.js

webpack.config.js

```diff
const path = require('path');
module.exports = {
    mode: 'development',
    devtool:false,
+   optimization:{
+       moduleIds:'deterministic',
+       chunkIds:'deterministic'
+   }
}
```

### 6.3 src\index.js

src\index.js

```js
import('./one');
import('./two');
import('./three');
```

## 7.移除Node.js的polyfill

- `webpack4`带了许多Node.js核心模块的`polyfill`,一旦模块中使用了任何核心模块(如crypto)，这些模块就会被自动启用
- `webpack5`不再自动引入这些`polyfill`

### 7.1 安装

```js
cnpm i crypto-js crypto-browserify stream-browserify buffer -D
```

### 7.2 src\index.js

```js
import CryptoJS from 'crypto-js';
console.log(CryptoJS.MD5('zhufeng').toString());
```

### 7.3 webpack.config.js

```js
    resolve:{
        /* fallback:{ 
            "crypto": require.resolve("crypto-browserify"),
            "buffer": require.resolve("buffer"),
            "stream":require.resolve("stream-browserify")
        }, */
        fallback:{ 
            "crypto":false,
            "buffer": false,
            "stream":false
        }
    },
```

## 8.更强大的tree-shaking

- [tree-shaking](https://webpack.js.org/guides/tree-shaking/#root)就在打包的时候剔除没有用到的代码
- webpack4 本身的 tree shaking 比较简单,主要是找一个 `import` 进来的变量是否在这个模块内出现过
- webpack5可以进行根据作用域之间的关系来进行优化
- [webpack-deep-scope-demo](https://diverse.space/webpack-deep-scope-demo/)

### 8.1 webpack4

```js
import { isNumber, isNull } from 'lodash';

export isNull(...args) {
  return isNull(...args);
}
```

![1608975584282](https://img.zhufengpeixun.com/1608975584282)

### 8.2 deep-scope

#### 8.2.1 src\index.js

src\index.js

```js
import {function1} from './module1';
console.log(function1);
```

#### 8.2.2 src\module1.js

src\module1.js

```js
export function function1(){
    console.log('function1');
}
export function function2(){
    console.log('function2');
}
```

#### 8.2.3 src\module2.js

src\module2.js

```js
export function function3(){
    console.log('function3');
}
export function function4(){
    console.log('function4');
}
```

#### 8.2.4 webpack.config.js

webpack.config.js

```diff
module.exports = {
+   mode: 'development',
    optimization:{
+       usedExports:true
    }
}
```

## 8.3 sideEffects

- 函数副作用指当调用函数时，除了返回函数值之外，还产生了附加的影响,例如修改全局变量
- 严格的函数式语言要求函数必须无副作用

### 8.3.1 sideEffects:false

#### 8.3.1.1 src\index.js

src\index.js

```js
import './title.js';
```

#### 8.3.1.2 src\title.js

src\title.js

```js
document.title = "改标题";
export function getTitle(){
    console.log('getTitle');
}
```

#### 8.3.1.3 package.json

package.json

```json
"sideEffects": false,
```

### 8.3.2 sideEffects:["*.css"]

#### 8.3.2.1 src\index.css

src\index.css

```css
body{
    background-color: green;
}
```

#### 8.3.2.2 src\index.css

src\index.css

```js
import './index.css';
```

#### 8.3.2.3 package.json

package.json

```json
"sideEffects": ["*.css"],
```

## 9.模块联邦

### 9.1.动机

- Module Federation的动机是为了不同开发小组间共同开发一个或者多个应用
- 应用将被划分为更小的应用块，一个应用块，可以是比如头部导航或者侧边栏的前端组件，也可以是数据获取逻辑的逻辑组件
- 每个应用块由不同的组开发
- 应用或应用块共享其他其他应用块或者库

![1608392171072](https://img.zhufengpeixun.com/1608392171072)

### 9.2.Module Federation

- 使用Module Federation时，每个应用块都是一个独立的构建，这些构建都将编译为容器
- 容器可以被其他应用或者其他容器应用
- 一个被引用的容器被称为`remote`, 引用者被称为`host`，`remote`暴露模块给`host`, `host`则可以使用这些暴露的模块，这些模块被成为`remote`模块

![1608722799323](https://img.zhufengpeixun.com/1608722799323)

### 9.3.实战

#### 9.3.1 配置参数

| 字段     | 类型   | 含义                                                         |
| :------- | :----- | :----------------------------------------------------------- |
| name     | string | 必传值，即输出的模块名，被远程引用时路径为${name}/${expose}  |
| library  | object | 声明全局变量的方式，name为umd的name                          |
| filename | string | 构建输出的文件名                                             |
| remotes  | object | 远程引用的应用名及其别名的映射，使用时以key值作为name        |
| exposes  | object | 被远程引用时可暴露的资源路径及其别名                         |
| shared   | object | 与其他应用之间可以共享的第三方依赖，使你的代码中不用重复加载同一份依赖 |

#### 9.3.2 remote

##### 9.3.2.1 remote\webpack.config.js

```js
let path = require("path");
let webpack = require("webpack");
let HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        publicPath: "http://localhost:3000/",
    },
    devServer: {
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-react"]
                    },
                },
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        }),
        new ModuleFederationPlugin({
            filename: "remoteEntry.js",
            name: "remote",
            exposes: {
                "./NewsList": "./src/NewsList",
            }
          })
    ]
}
```

##### 9.3.2.2 remote\src\index.js

remote\src\index.js

```js
import("./bootstrap");
```

##### 9.3.2.3 remote\src\bootstrap.js

remote\src\bootstrap.js

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
ReactDOM.render(<App />, document.getElementById("root"));
```

##### 9.3.2.4 remote\src\App.js

remote\src\App.js

```js
import React from "react";
import NewsList from './NewsList';
const App = () => (
  <div>
    <h2>本地组件NewsList</h2>
    <NewsList />
  </div>
);

export default App;
```

##### 9.3.2.5 remote\src\NewsList.js

remote\src\NewsList.js

```js
import React from "react";
export default ()=>(
    <div>新闻列表</div>
)
```

#### 9.3.3 host

##### 9.3.3.1 host\webpack.config.js

host\webpack.config.js

```js
let path = require("path");
let webpack = require("webpack");
let HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        publicPath: "http://localhost:8000/",
    },
    devServer: {
        port: 8000
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-react"]
                    },
                },
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new ModuleFederationPlugin({
            filename: "remoteEntry.js",
            name: "host",
            remotes: {
                remote: "remote@http://localhost:3000/remoteEntry.js"
            }
        })
    ]
}
```

##### 9.3.3.2 host\src\index.js

host\src\index.js

```js
import("./bootstrap");
```

##### 9.3.3.3 host\src\bootstrap.js

host\src\bootstrap.js

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
ReactDOM.render(<App />, document.getElementById("root"));
```

##### 9.3.3.4 host\src\App.js

host\src\App.js

```js
import React from "react";
import Slides from './Slides';
const RemoteNewsList = React.lazy(() => import("remote/NewsList"));

const App = () => (
  <div>
    <h2 >本地组件Slides, 远程组件NewsList</h2>
    <Slides />
    <React.Suspense fallback="Loading NewsList">
      <RemoteNewsList />
    </React.Suspense>
  </div>
);
export default App;
```

##### 9.3.3.5 host\src\Slides.js

host\src\Slides.js

```js
import React from "react";
export default ()=>(
    <div>轮播图</div>
)
```

### 9.4.shared

- `shared`配置主要是用来避免项目出现多个公共依赖

#### 9.4.1 remote\webpack.config.js

```diff
    plugins: [
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        }),
        new ModuleFederationPlugin({
            filename: "remoteEntry.js",
            name: "remote",
            exposes: {
                "./NewsList": "./src/NewsList",
            },
+            shared:{
+                react: { singleton: true },
+                "react-dom": { singleton: true }
+              }
          })
    ]
```

#### 9.4.2 host\webpack.config.js

```diff
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new ModuleFederationPlugin({
            filename: "remoteEntry.js",
            name: "host",
            remotes: {
                remote: "remote@http://localhost:3000/remoteEntry.js"
            },
+           shared:{
+                react: { singleton: true },
+                "react-dom": { singleton: true }
+           }
        })
    ]
```

### 9.5.双向依赖

- Module Federation 的共享可以是双向的

#### 9.5.1 remote\webpack.config.js

```diff
    plugins: [
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        }),
        new ModuleFederationPlugin({
            filename: "remoteEntry.js",
            name: "remote",
+            remotes: {
+                host: "host@http://localhost:8000/remoteEntry.js"
+            },
            exposes: {
                "./NewsList": "./src/NewsList",
            },
            shared:{
                react: { singleton: true },
                "react-dom": { singleton: true }
              }
          })
    ]
```

#### 9.5.2 host\webpack.config.js

```diff
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new ModuleFederationPlugin({
            filename: "remoteEntry.js",
            name: "host",
            remotes: {
                remote: "remote@http://localhost:3000/remoteEntry.js"
            },
+           exposes: {
+                "./Slides": "./src/Slides",
+           },
            shared:{
                react: { singleton: true },
                "react-dom": { singleton: true }
              }
        })
    ]
```

#### 9.5.3 remote\src\App.js

remote\src\App.js

```diff
import React from "react";
import NewsList from './NewsList';
+const RemoteSlides = React.lazy(() => import("host/Slides"));
const App = () => (
  <div>
+    <h2>本地组件NewsList,远程组件Slides</h2>
    <NewsList />
+    <React.Suspense fallback="Loading Slides">
+      <RemoteSlides />
+    </React.Suspense>
  </div>
);

export default App;
```

### 9.6.多个remote

#### 9.6.1 all\webpack.config.js

```js
let path = require("path");
let webpack = require("webpack");
let HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        publicPath: "http://localhost:3000/",
    },
    devServer: {
        port: 5000
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-react"]
                    },
                },
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        }),
        new ModuleFederationPlugin({
            filename: "remoteEntry.js",
            name: "all",
            remotes: {
                remote: "remote@http://localhost:3000/remoteEntry.js",
                host: "host@http://localhost:8000/remoteEntry.js",
            },
            shared:{
                react: { singleton: true },
                "react-dom": { singleton: true }
              }
          })
    ]
}
```

#### 9.6.2 remote\src\index.js

remote\src\index.js

```js
import("./bootstrap");
```

#### 9.6.3 remote\src\bootstrap.js

remote\src\bootstrap.js

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
ReactDOM.render(<App />, document.getElementById("root"));
```

#### 9.6.4 remote\src\App.js

remote\src\App.js

```js
import React from "react";
const RemoteSlides = React.lazy(() => import("host/Slides"));
const RemoteNewsList = React.lazy(() => import("remote/NewsList"));
const App = () => (
  <div>
    <h2>远程组件Slides,远程组件NewsList</h2>
    <React.Suspense fallback="Loading Slides">
      <RemoteSlides />
    </React.Suspense>
    <React.Suspense fallback="Loading NewsList">
      <RemoteNewsList />
    </React.Suspense>
  </div>
);

export default App;
```

## 11.参考

- [changelog-v5](https://github.com/webpack/changelog-v5/blob/master/README.md)



# 14.webpack-sourcemap

## 1. sourcemap

### 1.1 什么是sourceMap

- sourcemap是为了解决开发代码与实际运行代码不一致时帮助我们debug到原始开发代码的技术
- webpack通过配置可以自动给我们`source maps`文件，`map`文件是一种对应编译文件和源文件的方法
- [source-map](https://github.com/mozilla/source-map)

![source-map](http://img.zhufengpeixun.cn/source-map.jpg)

| 类型                         | 含义                                                         |
| :--------------------------- | :----------------------------------------------------------- |
| source-map                   | 原始代码 最好的sourcemap质量有完整的结果，但是会很慢         |
| eval-source-map              | 原始代码 同样道理，但是最高的质量和最低的性能                |
| cheap-module-eval-source-map | 原始代码（只有行内） 同样道理，但是更高的质量和更低的性能    |
| cheap-eval-source-map        | 转换代码（行内） 每个模块被eval执行，并且sourcemap作为eval的一个dataurl |
| eval                         | 生成代码 每个模块都被eval执行，并且存在@sourceURL,带eval的构建模式能cache SourceMap |
| cheap-source-map             | 转换代码（行内） 生成的sourcemap没有列映射，从loaders生成的sourcemap没有被使用 |
| cheap-module-source-map      | 原始代码（只有行内） 与上面一样除了每行特点的从loader中进行映射 |
| hidden-source-map            | 隐藏sourcemap                                                |
| nosources-source-map         | 控制台能正确提示报错的位置而不暴露源码                       |

### 1.2 配置项

- 配置项其实只是五个关键字eval、source-map、cheap、module和inline的组合

| 关键字     | 含义                                                         |
| :--------- | :----------------------------------------------------------- |
| source-map | 产生.map文件                                                 |
| eval       | 使用eval包裹模块代码                                         |
| cheap      | 不包含列信息（关于列信息的解释下面会有详细介绍)也不包含loader的sourcemap |
| module     | 包含loader的sourcemap（比如jsx to js ，babel的sourcemap）,否则无法定义源文件 |
| inline     | 将.map作为DataURI嵌入，不单独生成.map文件                    |

#### 1.2.1 source-map

src\index.js

```js
let a=1;
let b=2;
let c=3;
```

dist\main.js

```js
   ({
     "./src/index.js":
       (function (module, exports) {
         let a = 1;
         let b = 2;
         let c = 3;
       })
   });
//# sourceMappingURL=main.js.map
```

#### 1.2.2 eval

- 用`eval`执行代码
- [whyeval](https://github.com/webpack/docs/wiki/build-performance#sourcemaps)

```js
  ({
    "./src/index.js":
      (function (module, exports) {
        eval("let a=1;\r\nlet b=2;\r\nlet c=3;\n\n//# sourceURL=webpack:///./src/index.js?");
      })
  });
```

- `eval-source-map`就会带上源码的sourceMap
- 加了eval的配置生成的sourceMap会作为DataURI嵌入，不单独生成`.map`文件
- 官方比较推荐开发场景下使用eval的构建模式，因为它能`cache sourceMap`,从而rebuild的速度会比较快

```js
  ({
    "./src/index.js":
      (function (module, exports) {
        eval("let a=1;\r\nlet b=2;\r\nlet c=3;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,In0=\n//# sourceURL=webpack-internal:///./src/index.js\n");
      })
  });
```

> devtool: "eval-source-map" is really as good as devtool: "source-map", but can cache SourceMaps for modules. It’s much faster for rebuilds.

#### 1.2.3 inline

- `inline`就是将map作为DataURI嵌入，不单独生成.map文件
- `inline-source-map`

```js
({
    "./src/index.js":
      (function (module, exports) {
        let a = 1;
        let b = 2;
        let c = 3;
      })
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIj
```

#### 1.2.4 cheap(低开销)

- `cheap(低开销)`的sourcemap，因为它没有生成列映射(column mapping),只是映射行数
- 开发时我们有行映射也够用了,开发时可以使用cheap
- `cheap-source-map`

#### 1.2.5 module

- Webpack会利用loader将所有非js模块转化为webpack可处理的js模块,而增加上面的cheap配置后也不会有loader模块之间对应的sourceMap
- 什么是模块之间的sourceMap呢？比如jsx文件会经历loader处理成js文件再混淆压缩， 如果没有loader之间的sourceMap，那么在debug的时候定义到上图中的压缩前的js处，而不能追踪到jsx中
- 所以为了映射到loader处理前的代码，我们一般也会加上module配置
- `cheap-module-source-map`

### 1.3 演示

#### 1.3.1 安装

```js
cnpm i webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env style-loader css-loader less-loader less file-loader url-loader -D
```

#### 1.3.2 webpack.config.js

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode:'development',
  devtool:'cheap-module-source-map',
  entry:'./src/index.js',
  module: {
      rules: [
        {
          test: /\.js$/,
          use: [{
            loader:'babel-loader',
            options:{
              presets:["@babel/preset-env"]
            }
          }]
        } 
      ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:'./src/index.html'
    })
  ]
}
```

#### 1.3.3 src\index.js

```js
import './sum';
sum(1,2);
//console.log(window.a.b);
```

### 1.4 最佳实践

#### 1.4.1 开发环境

- 我们在开发环境对sourceMap的要求是：快（eval），信息全（module），
- 且由于此时代码未压缩，我们并不那么在意代码列信息(cheap),
- 所以开发环境比较推荐配置：`devtool: cheap-module-eval-source-map`

#### 1.4.2 生产环境

- 一般情况下，我们并不希望任何人都可以在浏览器直接看到我们未编译的源码，
- 所以我们不应该直接提供sourceMap给浏览器。但我们又需要sourceMap来定位我们的错误信息，
- 这时我们可以设置`hidden-source-map`
- 一方面webpack会生成sourcemap文件以提供给错误收集工具比如sentry，另一方面又不会为 bundle 添加引用注释，以避免浏览器使用。

## 2. sourcemap

- [compiler官方下载](https://developers.google.com/closure/compiler)
- [compiler珠峰镜像](http://img.zhufengpeixun.cn/compiler.jar)
- [base64vlq在线转换](http://murzwin.com/base64vlq.html)

### 2.1 生成sourcemap

script.js

```js
let a=1;
let b=2;
let c=3;
java -jar compiler.jar --js script.js --create_source_map ./script-min.js.map --source_map_format=V3 --js_output_file script-min.js
```

script-min.js

```js
var a=1,b=2,c=3;
```

script-min.js.map

```js
{
"version":3,
"file":"script-min.js",
"lineCount":1,
"mappings":"AAAA,IAAIA,EAAE,CAAN,CACIC,EAAE,CADN,CAEIC,EAAE;",
"sources":["script.js"],
"names":["a","b","c"]
}
```

| 字段                   | 含义                                                         |
| :--------------------- | :----------------------------------------------------------- |
| version：Source        | Source map的版本，目前为3                                    |
| file：转换后的文件名。 | 转换后的文件名                                               |
| sourceRoot             | 转换前的文件所在的目录。如果与转换前的文件在同一目录，该项为空 |
| sources                | 转换前的文件,该项是一个数组,表示可能存在多个文件合并         |
| names                  | 转换前的所有变量名和属性名                                   |
| mappings               | 记录位置信息的字符串                                         |

### 2.2 mappings属性

- 关键就是map文件的mappings属性。这是一个很长的字符串，它分成三层

| 对应             | 含义                                                         |
| :--------------- | :----------------------------------------------------------- |
| 第一层是行对应   | 以分号（;）表示，每个分号对应转换后源码的一行。所以，第一个分号前的内容，就对应源码的第一行，以此类推。 |
| 第二层是位置对应 | 以逗号（,）表示，每个逗号对应转换后源码的一个位置。所以，第一个逗号前的内容，就对应该行源码的第一个位置，以此类推。 |
| 第三层是位置转换 | 以VLQ编码表示，代表该位置对应的转换前的源码位置。            |

```js
"mappings":"AAAA,IAAIA,EAAE,CAAN,CACIC,EAAE,CADN,CAEIC,EAAE;",
```

### 2.3 位置对应的原理

- 每个位置使用五位，表示五个字段

| 位置   | 含义                                      |
| :----- | :---------------------------------------- |
| 第一位 | 表示这个位置在（转换后的代码的）的第几列  |
| 第二位 | 表示这个位置属于sources属性中的哪一个文件 |
| 第三位 | 表示这个位置属于转换前代码的第几行        |
| 第四位 | 表示这个位置属于转换前代码的第几列        |
| 第五位 | 表示这个位置属于names属性中的哪一个变量   |

> 首先，所有的值都是以0作为基数的。其次，第五位不是必需的，如果该位置没有对应names属性中的变量，可以省略第五位,再次，每一位都采用VLQ编码表示；由于VLQ编码是变长的，所以每一位可以由多个字符构成

> 如果某个位置是AAAAA，由于A在VLQ编码中表示0，因此这个位置的五个位实际上都是0。它的意思是，该位置在转换后代码的第0列，对应sources属性中第0个文件，属于转换前代码的第0行第0列，对应names属性中的第0个变量。

![mappings1](http://img.zhufengpeixun.cn/mappings1.jpg)

### 2.4 相对位置

- 对于输出后的位置来说，到后边会发现它的列号特别大，为了避免这个问题，采用相对位置进行描述
- 第一次记录的输入位置和输出位置是绝对的，往后的输入位置和输出位置都是相对上一次的位置移动了多少

![mappings2](http://img.zhufengpeixun.cn/mappings2.jpg)

### 2.5 VLQ编码

- VLQ是Variable-length quantity 的缩写，是一种通用的、使用任意位数的二进制来表示一个任意大的数字的一种编码方式
- 这种编码需要用最高位表示连续性，如果是1，代表这组字节后面的一组字节也属于同一个数；如果是0，表示该数值到这就结束了
- 如何对数值137进行VLQ编码
  - 将137改写成二进制形式 10001001
  - 七位一组做分组，不足的补0 0000001 0001001
  - 最后一组开头补0，其余补1 10000001 00001001
  - 137的VLQ编码形式为10000001 00001001

```js
let binary = 137..toString(2);
console.log(binary);//10001001
let padded = binary.padStart(Math.ceil(binary.length / 7) * 7, '0');
console.log(padded);//00000010001001
let groups = padded.match(/\d{7}/g);
groups = groups.map((group,index)=>(index==0?'1':'0')+group);
console.log(groups);// ['10000001','00001001']
```

### 2.6 Base64 VLQ

- 一个Base64字符只能表示6bit(2^6)的数据
- Base64 VLQ需要能够表示负数,于是用最后一位来作为符号标志位
- 由于只能用6位进行存储，而第一位表示是否连续的标志，最后一位表示正数/负数。中间只有4位，因此一个单元表示的范围为[-15,15]，如果超过了就要用连续标识位了
- 表示正负的方式
  - 如果这组数是某个数值的VLQ编码的第一组字节，那它的最后一位代表"符号"，0为正，1为负；
  - 如果不是，这个位没有特殊含义，被算作数值的一部分
- 在Base64 VLQ中，编码顺序是从低位到高位,而在VLQ中，编码顺序是从高位到低位

![base64](http://img.zhufengpeixun.cn/base64.png)

```js
let base64 = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'
];
/**
 * 1. 将137改写成二进制形式  10001001
 * 2. 127是正数，末位补0 100010010
 * 3. 五位一组做分组，不足的补0 01000 10010
 * 4. 将组倒序排序 10010 01000
 * 5. 最后一组开头补0，其余补1 110010 001000
 * 6. 转64进制 y和I
 */
function encode(num) {
    //1. 将137改写成二进制形式,如果是负数的话是绝对值转二进制
    let binary = (Math.abs(num)).toString(2);
    //2.正数最后边补0,负数最右边补1,127是正数,末位补0 100010010
    binary = num >= 0 ? binary + '0' : binary + '1';
    //3.五位一组做分组，不足的补0   01000 10010 
    let zero = 5 - (binary.length % 5);
    if (zero > 0) {
        binary = binary.padStart(Math.ceil(binary.length / 5) * 5, '0');
    }
    let parts = [];
    for (let i = 0; i < binary.length; i += 5) {
        parts.push(binary.slice(i, i + 5));
    }// 01000 10010
    //4. 将组倒序排序 10010 01000
    parts.reverse();// ['00000','00001']
    //5. 最后一组开头补0,其余补1 110010 001000
    for (let i = 0; i < parts.length; i++) {
        if (i === parts.length - 1) {
            parts[i] = '0' + parts[i];
        } else {
            parts[i] = '1' + parts[i];
        }
    }
    //6.转64进制 y和I
    let chars = [];
    for (let i = 0; i < parts.length; i++) {
        chars.push(base64[parseInt(parts[i], 2)]);
    }
    return chars.join('')
}
let result = encode(137);
console.log(result);
```

### 2.7 计算位移

```js
let base64 = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'
];
function getValue(char) {
    let index = base64.findIndex(item => item == char);//先找这个字符的索引
    let str = (index).toString(2);//索引转成2进制
    str = str.padStart(6, '0');//在前面补0补到6位
    //最后一位是符号位,正数最后一位是0,负数最后一位为1
    let sign = str.slice(-1)=='0'?1:-1;
    //最后一组第一位为0,其它的第一位为1
    str = str.slice(1, -1);
    return parseInt(str, 2)*sign;
}
function decode(values) {
    let parts = values.split(',');//分开每一个位置
    let positions = [];
    for(let i=0;i<parts.length;i++){
        let part = parts[i];
        let chars = part.split('');//得到每一个字符
        let position = [];
        for (let i = 0; i < chars.length; i++) {
            position.push(getValue(chars[i]));//获取此编写对应的值
        }
        positions.push(position);
    }
    return positions;
}
let positions = decode('AAAA,IAAIA,EAAE,CAAN,CACIC,EAAE,CADN,CAEIC,EAAE');
//后列,哪个源文件,前行,前列,变量
console.log('positions',positions);
let offsets = positions.map(item=>[item[2],item[3],0,item[0],]);
console.log('offsets',offsets);
let origin = {x:0,y:0};
let target = {x:0,y:0};
let mapping=[];
for(let i=0;i<offsets.length;i++){
    let [originX,originY,targetX,targetY] = offsets[i];
    origin.x += originX;
    origin.y += originY;
    target.x += targetX;
    target.y += targetY;
    mapping.push(`[${origin.x},${origin.y}]=>[${target.x},${target.y}]`);
}
console.log('mapping',mapping);
positions [
  [ 0, 0, 0, 0 ],
  [ 4, 0, 0, 4, 0 ],
  [ 2, 0, 0, 2 ],
  [ 1, 0, 0, -6 ],
  [ 1, 0, 1, 4, 1 ],
  [ 2, 0, 0, 2 ],
  [ 1, 0, -1, -6 ],
  [ 1, 0, 2, 4, 1 ],
  [ 2, 0, 0, 2 ]
]
offsets [
  [ 0, 0, 0, 0 ],
  [ 0, 4, 0, 4 ],
  [ 0, 2, 0, 2 ],
  [ 0, -6, 0, 1 ],
  [ 1, 4, 0, 1 ],
  [ 0, 2, 0, 2 ],
  [ -1, -6, 0, 1 ],
  [ 2, 4, 0, 1 ],
  [ 0, 2, 0, 2 ]
]
mapping [
  '[0,0]=>[0,0]',
  '[0,4]=>[0,4]',
  '[0,6]=>[0,6]',
  '[0,0]=>[0,7]',
  '[1,4]=>[0,8]',
  '[1,6]=>[0,10]',
  '[0,0]=>[0,11]',
  '[2,4]=>[0,12]',
  '[2,6]=>[0,14]'
]
```

![sourcemapmove](http://img.zhufengpeixun.cn/sourcemapmove.png)

## 3.调试代码

### 3.1 测试环境调试

![enablesourcemap](http://img.zhufengpeixun.cn/enablesourcemap.png)

webpack.config.js

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const webpack = require('webpack');
module.exports = {
  mode: 'production',
  devtool: false,
  entry: './src/index.js',
  resolveLoader:{
    modules:['node_modules','loaders']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env"]
          }
        }]
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
             options: { 
              sourceMap: true,
              importLoaders:2
             }
          },
          //{ loader: "resolve-url-loader" },
          { loader: "resolve-scss-url-loader" },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|bmp)$/,
        use: [
          { loader: 'url-loader' }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.SourceMapDevToolPlugin({
      append: '//# sourceMappingURL=http://127.0.0.1:8081/[url]',
      filename: '[file].map',
    }),
    new FileManagerPlugin({
      onEnd: {
        copy: [{
          source: './dist/*.map',
          destination: 'C:/aprepare/zhufengsourcemap/sourcemap',
        }],
        delete: ['./dist/*.map'],
        archive: [{ 
          source: './dist',
          destination: './dist/dist.zip',
        }]
      }
    })
  ]
}
```

### 3.2 生产环境调试

- webpack打包仍然生成sourceMap，但是将map文件挑出放到本地服务器，将不含有map文件的部署到服务器，借助第三方软件（例如fiddler），将浏览器对map文件的请求拦截到本地服务器，就可以实现本地sourceMap调试

```js
regex:(?inx)http:\/\/localhost:8080\/(?<name>.+)$
*redir:http://127.0.0.1:8081/${name}
```

![fiddleproxy](http://img.zhufengpeixun.cn/fiddleproxy.png)

## 4.source-map-loader

- [source-map-loader](https://www.webpackjs.com/loaders/source-map-loader)从当前存在的源码(从sourceMappingURL)中提供出map源码

```js
cnpm i source-map-loader -D
```

### 4.1 script.js

```js
let a=1;
let b=2;
let c=3;
java -jar compiler.jar --js script.js --create_source_map ./script-min.js.map --source_map_format=V3 --js_output_file script-min.js
```

### 4.2 script.min.js

```js
var a=1,b=2,c=3;
//# sourceMappingURL=script-min.js.map
```

### 4.3 script.min.map.js

```json
{
"version":3,
"file":"script-min.js",
"lineCount":1,
"mappings":"AAAA,IAAIA,EAAE,CAAN,CACIC,EAAE,CADN,CAEIC,EAAE;",
"sources":["script.js"],
"names":["a","b","c"]
}
```

### 4.4 src\index.js

```js
import './script-min.js';
```

### 4.5 webpack.config.js

webpack.config.js

```diff
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const webpack = require('webpack');
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/index.js',
  resolveLoader:{
    modules:['node_modules','loaders']
  },
  module: {
    rules: [
+      {
+        test: /\.js$/,
+        use: ["source-map-loader"],
+        enforce: "pre"
+      },
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env"]
          }
        }]
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
             options: { 
              sourceMap: true,
              importLoaders:2
             }
          },
          //{ loader: "resolve-url-loader" },
+          { loader: "resolve-scss-url-loader" },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|bmp)$/,
        use: [
          { loader: 'url-loader' }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}
```

## 3.参考

- [javascript_source_map算法](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)
- [devtool](https://www.webpackjs.com/configuration/devtool/)

