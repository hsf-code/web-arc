---
title: webpack分析（六）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# 12.webpack-optimize1

## 1. 缩小范围

### 1.1 extensions

指定extension之后可以不用在`require`或是`import`的时候加文件扩展名,会依次尝试添加扩展名进行匹配

```js
resolve: {
  extensions: [".js",".jsx",".json",".css"]
},
```

### 1.2 alias

配置别名可以加快webpack查找模块的速度

- 每当引入bootstrap模块的时候，它会直接引入`bootstrap`,而不需要从`node_modules`文件夹中按模块的查找规则查找

```diff
const bootstrap = path.resolve(__dirname,'node_modules/_bootstrap@3.3.7@bootstrap/dist/css/bootstrap.css');
resolve: {
+    alias:{
+        "bootstrap":bootstrap
+    }
},
```

### 1.3 modules

- 对于直接声明依赖名的模块（如 react ），webpack 会类似 Node.js 一样进行路径搜索，搜索`node_modules`目录

- 这个目录就是使用

  ```
  resolve.modules
  ```

  字段进行配置的 默认配置

  ```js
  resolve: {
  modules: ['node_modules'],
  }
  ```

  如果可以确定项目内所有的第三方依赖模块都是在项目根目录下的 node_modules 中的话

  ```js
  resolve: {
  modules: [path.resolve(__dirname, 'node_modules')],
  }
  ```

### 1.4 mainFields [#](http://www.zhufengpeixun.com/grow/html/103.12.webpack-optimize1.html#t41.4 mainFields)

默认情况下package.json 文件则按照文件中 main 字段的文件名来查找文件

```js
resolve: {
  // 配置 target === "web" 或者 target === "webworker" 时 mainFields 默认值是：
  mainFields: ['browser', 'module', 'main'],
  // target 的值为其他时，mainFields 默认值为：
  mainFields: ["module", "main"],
}
```

### 1.5 mainFiles

当目录下没有 package.json 文件时，我们说会默认使用目录下的 index.js 这个文件，其实这个也是可以配置的

```js
resolve: {
  mainFiles: ['index'], // 你可以添加其他默认使用的文件名
},
```

### 1.6 resolveLoader

`resolve.resolveLoader`用于配置解析 loader 时的 resolve 配置,默认的配置：

```js
module.exports = {
  resolveLoader: {
    modules: [ 'node_modules' ],
    extensions: [ '.js', '.json' ],
    mainFields: [ 'loader', 'main' ]
  }
};
```

## 2. noParse

- `module.noParse` 字段，可以用于配置哪些模块文件的内容不需要进行解析

- 不需要解析依赖（即无依赖） 的第三方大型类库等，可以通过这个字段来配置，以提高整体的构建速度

  ```js
  module.exports = {
  // ...
  module: {
    noParse: /jquery|lodash/, // 正则表达式
    // 或者使用函数
    noParse(content) {
      return /jquery|lodash/.test(content)
    },
  }
  }...
  ```

  > 使用 noParse 进行忽略的模块文件中不能使用 import、require、define 等导入机制

## 3. DefinePlugin

`DefinePlugin`创建一些在编译时可以配置的全局常量

```js
let webpack = require('webpack');
new webpack.DefinePlugin({
    PRODUCTION: JSON.stringify(true),
    VERSION: "1",
    EXPRESSION: "1+2",
    COPYRIGHT: {
        AUTHOR: JSON.stringify("珠峰培训")
    }
})
console.log(PRODUCTION);
console.log(VERSION);
console.log(EXPRESSION);
console.log(COPYRIGHT);
```

- 如果配置的值是字符串，那么整个字符串会被当成代码片段来执行，其结果作为最终变量的值
- 如果配置的值不是字符串，也不是一个对象字面量，那么该值会被转为一个字符串，如 true，最后的结果是 'true'
- 如果配置的是一个对象字面量，那么该对象的所有 key 会以同样的方式去定义
- JSON.stringify(true) 的结果是 'true'

## 4. IgnorePlugin

IgnorePlugin用于忽略某些特定的模块，让 webpack 不把这些指定的模块打包进去

```js
import moment from  'moment';
console.log(moment);
new webpack.IgnorePlugin(/^\.\/locale/,/moment$/)
```

- 第一个是匹配引入模块路径的正则表达式
- 第二个是匹配模块的对应上下文，即所在目录名

## 5. 区分环境变量

- 日常的前端开发工作中，一般都会有两套构建环境
- 一套开发时使用，构建结果用于本地开发调试，不进行代码压缩，打印 debug 信息，包含 sourcemap 文件
- 一套构建后的结果是直接应用于线上的，即代码都是压缩后，运行时不打印 debug 信息，静态文件不包括 sourcemap
- webpack 4.x 版本引入了 `mode` 的概念
- 当你指定使用 production mode 时，默认会启用各种性能优化的功能，包括构建结果优化以及 webpack 运行性能优化
- 而如果是 development mode 的话，则会开启 debug 工具，运行时打印详细的错误信息，以及更加快速的增量编译构建

### 5.1 环境差异

- 生产环境
  - 可能需要分离 CSS 成单独的文件，以便多个页面共享同一个 CSS 文件
  - 需要压缩 HTML/CSS/JS 代码
  - 需要压缩图片
- 开发环境
  - 需要生成 sourcemap 文件
  - 需要打印 debug 信息
  - 需要 live reload 或者 hot reload 的功能...

### 5.2 获取mode参数

```js
npm install --save-dev optimize-css-assets-webpack-plugin
  "scripts": {
+    "dev": "webpack-dev-server --env=development --open"
  },
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports=(env,argv) => ({
    optimization: {
        minimizer: argv.mode == 'production'?[            
            new TerserWebpackPlugin({
               parallel:true,//开启多进程并行压缩
               cache:true//开启缓存
      }),
            new OptimizeCssAssetsWebpackPlugin({})
        ]:[]
    }
})
```

### 5.3 封装log方法

- webpack 时传递的 mode 参数，是可以在我们的应用代码运行时，通过 process.env.NODE_ENV 这个变量获取

```js
export default function log(...args) {
    if (process.env.NODE_ENV == 'development') {
        console.log.apply(console,args);
    }
}
```

## 6. 对图片进行压缩和优化

[image-webpack-loader](https://www.npmjs.com/package/image-webpack-loader)可以帮助我们对图片进行压缩和优化

```js
npm install image-webpack-loader --save-dev
 {
          test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
          use: [
            'file-loader',
+           {
+             loader: 'image-webpack-loader',
+             options: {
+               mozjpeg: {
+                 progressive: true,
+                 quality: 65
+               },
+               optipng: {
+                 enabled: false,
+               },
+               pngquant: {
+                 quality: '65-90',
+                 speed: 4
+               },
+               gifsicle: {
+                 interlaced: false,
+               },
+               webp: {
+                 quality: 75
+               }
+             }
+           },
          ]
        }
```

## 7. 日志优化

- 日志太多太少都不美观
- 可以修改stats

| 预设        | 替代  | 描述                     |
| :---------- | :---- | :----------------------- |
| errors-only | none  | 只在错误时输出           |
| minimal     | none  | 发生错误和新的编译时输出 |
| none        | false | 没有输出                 |
| normal      | true  | 标准输出                 |
| verbose     | none  | 全部输出                 |

### 7.1 friendly-errors-webpack-plugin

- [friendly-errors-webpack-plugin](https://www.npmjs.com/package/friendly-errors-webpack-plugin)
- success 构建成功的日志提示
- warning 构建警告的日志提示
- error 构建报错的日志提示

```js
cnpm i friendly-errors-webpack-plugin
+ stats:'verbose',
  plugins:[
+   new FriendlyErrorsWebpackPlugin()
  ]
```

> 编译完成后可以通过`echo $?`获取错误码，0为成功，非0为失败

## 8. 日志输出

```diff
  "scripts": {
    "build": "webpack",
+    "build:stats":"webpack --json > stats.json",
    "dev": "webpack-dev-server --open"
  },
const webpack = require('webpack');
const config = require('./webpack.config.js');
webpack(config,(err,stats)=>{
  if(err){
    console.log(err);
  }
  if(stats.hasErrors()){
    return console.error(stats.toString("errors-only"));
  }
  console.log(stats);
});
```

## 9.费时分析

```js
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smw = new SpeedMeasureWebpackPlugin();
module.exports =smw.wrap({
});
```

## 10.webpack-bundle-analyzer

- 是一个webpack的插件，需要配合webpack和webpack-cli一起使用。这个插件的功能是生成代码分析报告，帮助提升代码质量和网站性能

```js
cnpm i webpack-bundle-analyzer -D
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports={
  plugins: [
    new BundleAnalyzerPlugin()  // 使用默认配置
    // 默认配置的具体配置项
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: '8888',
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: true,
    //   generateStatsFile: false,
    //   statsFilename: 'stats.json',
    //   statsOptions: null,
    //   excludeAssets: null,
    //   logLevel: info
    // })
  ]
}
{
 "scripts": {
    "dev": "webpack --config webpack.dev.js --progress"
  }
}
```

webpack.config.js

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports={
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      generateStatsFile: true, // 是否生成stats.json文件
    }),
  ]
}
{
 "scripts": {
    "generateAnalyzFile": "webpack --profile --json > stats.json", // 生成分析文件
    "analyz": "webpack-bundle-analyzer --port 8888 ./dist/stats.json" // 启动展示打包报告的http服务器
  }
}
npm run generateAnalyzFile
npm run analyz
```

## 11. libraryTarget 和 library

- [outputlibrarytarget](https://webpack.js.org/configuration/output/#outputlibrarytarget)
- 当用 Webpack 去构建一个可以被其他模块导入使用的库时需要用到它们
- `output.library` 配置导出库的名称
- `output.libraryExport` 配置要导出的模块中哪些子模块需要被导出。 它只有在 output.libraryTarget 被设置成 commonjs 或者 commonjs2 时使用才有意义
- `output.libraryTarget` 配置以何种方式导出库,是字符串的枚举类型，支持以下配置

| libraryTarget | 使用者的引入方式                   | 使用者提供给被使用者的模块的方式         |
| :------------ | :--------------------------------- | :--------------------------------------- |
| var           | 只能以script标签的形式引入我们的库 | 只能以全局变量的形式提供这些被依赖的模块 |
| commonjs      | 只能按照commonjs的规范引入我们的库 | 被依赖模块需要按照commonjs规范引入       |
| amd           | 只能按amd规范引入                  | 被依赖的模块需要按照amd规范引入          |
| umd           | 可以用script、commonjs、amd引入    | 按对应的方式引入                         |

### 10.1 var (默认)

编写的库将通过`var`被赋值给通过`library`指定名称的变量。

#### 10.1.1 index.js

```js
module.exports =  {
    add(a,b) {
        return a+b;
    }
}
```

#### 10.1.2 bundle.js

```js
var calculator=(function (modules) {}({})
```

#### 10.1.3 index.html

```js
    <script src="bundle.js"></script>
    <script>
        let ret = calculator.add(1,2);
        console.log(ret);
    </script>
```

### 10.2 commonjs

编写的库将通过 CommonJS 规范导出。

#### 10.2.1 导出方式

```js
exports["calculator"] = (function (modules) {}({})
```

#### 10.2.2 使用方式

```js
require('npm-name')['calculator'].add(1,2);
```

> npm-name是指模块发布到 Npm 代码仓库时的名称

### 10.3 commonjs2

编写的库将通过 CommonJS 规范导出。

#### 10.3.1 导出方式

```js
module.exports = (function (modules) {}({})
```

#### 10.3.2 使用方式

```js
require('npm-name').add();
```

> 在 output.libraryTarget 为 commonjs2 时，配置 output.library 将没有意义。

### 10.4 this

编写的库将通过 this 被赋值给通过 library 指定的名称，输出和使用的代码如下：

#### 10.4.1 导出方式

```js
this["calculator"]= (function (modules) {}({})
```

#### 10.4.2 使用方式

```js
this.calculator.add();
```

### 10.5 window

编写的库将通过 window 被赋值给通过 library 指定的名称，即把库挂载到 window 上，输出和使用的代码如下：

#### 10.5.1 导出方式

```js
window["calculator"]= (function (modules) {}({})
```

#### 10.5.2 使用方式

```js
window.calculator.add();
```

### 10.6 global

编写的库将通过 global 被赋值给通过 library 指定的名称，即把库挂载到 global 上，输出和使用的代码如下：

#### 10.6.1 导出方式

```js
global["calculator"]= (function (modules) {}({})
```

#### 10.6.2 使用方式

```js
global.calculator.add();
```

### 10.6 umd

```js
(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  else if(typeof exports === 'object')
    exports['MyLibrary'] = factory();
  else
    root['MyLibrary'] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
  return _entry_return_;
});
```



# 12.webpack-optimize2

## . purgecss-webpack-plugin

- [purgecss-webpack-plugin](https://www.npmjs.com/package/purgecss-webpack-plugin)
- [mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin)
- [purgecss](https://www.purgecss.com/)
- 可以去除未使用的 css，一般与 glob、glob-all 配合使用
- 必须和`mini-css-extract-plugin`配合使用
- `paths`路径是绝对路径

```js
npm i  purgecss-webpack-plugin mini-css-extract-plugin css-loader glob -D
```

webpack.config.js

```diff
const path = require("path");
+const glob = require("glob");
+const PurgecssPlugin = require("purgecss-webpack-plugin");
+const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PATHS = {
  src: path.join(__dirname, 'src')
}
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.js/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
+      {
+        test: /\.css$/,
+        include: path.resolve(__dirname, "src"),
+        exclude: /node_modules/,
+        use: [
+          {
+            loader: MiniCssExtractPlugin.loader,
+          },
+          "css-loader",
+        ],
+      },
    ],
  },
  plugins: [
+    new MiniCssExtractPlugin({
+      filename: "[name].css",
+    }),
+    new PurgecssPlugin({
+      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
+    })
  ],
};
```

## 2.DLL

- `.dll`为后缀的文件称为动态链接库，在一个动态链接库中可以包含给其他模块调用的函数和数据
- 把基础模块独立出来打包到单独的动态连接库里
- 当需要导入的模块在动态连接库里的时候，模块不能再次被打包，而是去动态连接库里获取
- [dll-plugin](https://webpack.js.org/plugins/dll-plugin/)

### 2.1 定义Dll

- DllPlugin插件： 用于打包出一个个动态连接库
- DllReferencePlugin: 在配置文件中引入DllPlugin插件打包好的动态连接库

webpack.dll.config.js

```js
const path = require("path");

const DllPlugin = require("webpack/lib/DllPlugin");
module.exports = {
  mode: "development",
  entry: {
    react: ["react", "react-dom"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].dll.js", //react.dll.js
    library: "_dll_[name]",
  },
  plugins: [
    new DllPlugin({
      name: "_dll_[name]",
      path: path.join(__dirname, "dist", "[name].manifest.json"), //react.manifest.json
    }),
  ],
};
webpack --config webpack.dll.config.js --mode=development
```

### 2.2 使用动态链接库文件

```diff
const path = require("path");
const glob = require("glob");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
+const DllReferencePlugin = require("webpack/lib/DllReferencePlugin.js");
const PATHS = {
  src: path.join(__dirname, 'src')
}
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.js/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
+    new DllReferencePlugin({
+      manifest: require("./dist/react.manifest.json"),
+    }),
  ],
};
webpack --config webpack.config.js --mode development
```

### 2.3 html中使用

```html
<script src="react.dll.js"></script>
<script src="bundle.js"></script>
```

### 2.4 实现

DllPlugin.js

```js
const path = require("path");

class DllPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync("DllPlugin", (compilation, callback) => {
      compilation.chunks.forEach((chunk) => {
        const name = this.options.name;
        const targetPath = this.options.path;
        const manifest = {
          name,
          content: Array.from(chunk.modulesIterable, (module) => {
            if (module.libIdent) {
              return { ident: module.id, data: { id: module.id } };
            }
          })
            .filter(Boolean)
            .reduce((obj, item) => {
              obj[item.ident] = item.data;
              return obj;
            }, Object.create(null)),
        };
        let manifestContent = JSON.stringify(manifest);
        const content = Buffer.from(manifestContent, "utf8");
        compiler.outputFileSystem.mkdirp(path.dirname(targetPath), (err) => {
          compiler.outputFileSystem.writeFile(targetPath, content, callback);
        });
      });
    });
  }
}
module.exports = DllPlugin;
```

DllReferencePlugin.js

```js
const ExternalModule = require('webpack/lib/ExternalModule');
const path = require('path');
//const resolver = require('resolver');
class DllReferencePlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap(
      "DllReferencePlugin",
      (normalModuleFactory) => {
        normalModuleFactory.hooks.factory.tap(
          "DllReferencePlugin",
          (factory) => (data, callback) => {
            let request = data.request;
            if(!request.startsWith('.')){
                let resource = require.resolve(request);
                let ident = "."+resource.slice(compiler.context.length).replace(/\\/g,'/');
                if (this.options.manifest.content[ident]) {
                  callback(null, new ExternalModule(ident, `window[${this.options.name}]`, request));
                } else {
                  factory(data, callback);
                }
            }else{
                factory(data, callback);
            }
          }
        );
      }
    );
  }
}

module.exports = DllReferencePlugin;
```

## 3. 多进程处理

### 3.1 thread-loader

- 把这个 loader 放置在其他 loader 之前， 放置在这个 loader 之后的 loader 就会在一个单独的 worker 池(worker pool)中运行
- [thread-loader](https://webpack.js.org/loaders/thread-loader/)

```js
cnpm  i thread-loader- D
const path = require("path");
const glob = require("glob");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DllReferencePlugin = require("webpack/lib/DllReferencePlugin.js");
const PATHS = {
  src: path.join(__dirname, 'src')
}
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.js/,
        include: path.resolve(__dirname, "src"),
        use: [
+          {
+            loader:'thread-loader',
+            options:{
+              workers:3
+            }
+          },
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
    new DllReferencePlugin({
      manifest: require("./dist/react.manifest.json"),
    }),
  ],
};
```

## 4. CDN

- [qiniu](https://www.qiniu.com/)
- CDN 又叫内容分发网络，通过把资源部署到世界各地，用户在访问时按照就近原则从离用户最近的服务器获取资源，从而加速资源的获取速度。

![cdn](http://img.zhufengpeixun.cn/cdn2.jpg)

- HTML文件不缓存，放在自己的服务器上，关闭自己服务器的缓存，静态资源的URL变成指向CDN服务器的地址
- 静态的JavaScript、CSS、图片等文件开启CDN和缓存，并且文件名带上HASH值
- 为了并行加载不阻塞，把不同的静态资源分配到不同的CDN服务器上

### 4.1 使用缓存

- 由于 CDN 服务一般都会给资源开启很长时间的缓存，例如用户从 CDN 上获取到了 index.html 这个文件后， 即使之后的发布操作把 index.html 文件给重新覆盖了，但是用户在很长一段时间内还是运行的之前的版本，这会新的导致发布不能立即生效 解决办法
- 针对 HTML 文件：不开启缓存，把 HTML 放到自己的服务器上，而不是 CDN 服务上，同时关闭自己服务器上的缓存。自己的服务器只提供 HTML 文件和数据接口。
- 针对静态的 JavaScript、CSS、图片等文件：开启 CDN 和缓存，上传到 CDN 服务上去，同时给每个文件名带上由文件内容算出的 Hash 值
- 带上 Hash 值的原因是文件名会随着文件内容而变化，只要文件发生变化其对应的 URL 就会变化，它就会被重新下载，无论缓存时间有多长。
- 启用CDN之后 相对路径，都变成了绝对的指向 CDN 服务的 URL 地址

### 4.2 域名限制

- 同一时刻针对同一个域名的资源并行请求是有限制
- 可以把这些静态资源分散到不同的 CDN 服务上去
- 多个域名后会增加域名解析时间
- 可以通过在 HTML HEAD 标签中 加入`<link rel="dns-prefetch" href="http://img.zhufengpeixun.cn">`去预解析域名，以降低域名解析带来的延迟

### 4.3 接入CDN

要给网站接入 CDN，需要把网页的静态资源上传到 CDN 服务上去，在服务这些静态资源的时候需要通过 CDN 服务提供的 URL 地址去访问

```diff
{
        output: {
        path: path.resolve(__dirname, 'dist'),
+       filename: '[name]_[hash:8].js',
+       publicPath: 'http://img.zhufengpeixun.cn'
    },
}
```

### 4.4 文件指纹

- 打包后输出的文件名和后缀
- hash一般是结合CDN缓存来使用，通过webpack构建之后，生成对应文件名自动带上对应的MD5值。如果文件内容改变的话，那么对应文件哈希值也会改变，对应的HTML引用的URL地址也会改变，触发CDN服务器从源服务器上拉取对应数据，进而更新本地缓存。

指纹占位符

| 占位符名称  | 含义                                                   |
| :---------- | :----------------------------------------------------- |
| ext         | 资源后缀名                                             |
| name        | 文件名称                                               |
| path        | 文件的相对路径                                         |
| folder      | 文件所在的文件夹                                       |
| hash        | 每次webpack构建时生成一个唯一的hash值                  |
| chunkhash   | 根据chunk生成hash值，来源于同一个chunk，则hash值就一样 |
| contenthash | 根据内容生成hash值，文件内容相同hash值就相同           |

#### 4.4.1 hash

- Hash 是整个项目的hash值，其根据每次编译内容计算得到，每次编译之后都会生成新的hash,即修改任何文件都会导致所有文件的hash发生改变

```diff
const path = require("path");
const glob = require("glob");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PATHS = {
  src: path.join(__dirname, 'src')
}
module.exports = {
  mode: "production",
+  entry: {
+    main: './src/index.js',
+    vender:['lodash']
+  },
  output:{
    path:path.resolve(__dirname,'dist'),
+    filename:'[name].[hash].js'
  },
  devServer:{
    hot:false
  },
  module: {
    rules: [
      {
        test: /\.js/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader:'thread-loader',
            options:{
              workers:3
            }
          },
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
+      filename: "[name].[hash].css"
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
  ],
};
```

#### 4.4.2 chunkhash

- chunkhash 采用hash计算的话，每一次构建后生成的哈希值都不一样，即使文件内容压根没有改变。这样子是没办法实现缓存效果，我们需要换另一种哈希值计算方式，即chunkhash,chunkhash和hash不一样，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。我们在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用chunkhash的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响

```diff
const path = require("path");
const glob = require("glob");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PATHS = {
  src: path.join(__dirname, 'src')
}
module.exports = {
  mode: "production",
  entry: {
    main: './src/index.js',
    vender:['lodash']
  },
  output:{
    path:path.resolve(__dirname,'dist'),
+    filename:'[name].[chunkhash].js'
  },
  devServer:{
    hot:false
  },
  module: {
    rules: [
      {
        test: /\.js/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader:'thread-loader',
            options:{
              workers:3
            }
          },
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
+      filename: "[name].[chunkhash].css"
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
  ],
};
```

#### 4.4.3 contenthash

- 使用chunkhash存在一个问题，就是当在一个JS文件中引入CSS文件，编译后它们的hash是相同的，而且只要js文件发生改变 ，关联的css文件hash也会改变,这个时候可以使用`mini-css-extract-plugin`里的`contenthash`值，保证即使css文件所处的模块里就算其他文件内容改变，只要css文件内容不变，那么不会重复构建

```diff
const path = require("path");
const glob = require("glob");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PATHS = {
  src: path.join(__dirname, 'src')
}
module.exports = {
  mode: "production",
  entry: {
    main: './src/index.js',
    vender:['lodash']
  },
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'[name].[chunkhash].js'
  },
  devServer:{
    hot:false
  },
  module: {
    rules: [
      {
        test: /\.js/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader:'thread-loader',
            options:{
              workers:3
            }
          },
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
+      filename: "[name].[contenthash].css"
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
  ],
};
```

## 5.Tree Shaking

- 一个模块可以有多个方法，只要其中某个方法使用到了，则整个文件都会被打到bundle里面去，tree shaking就是只把用到的方法打入bundle,没用到的方法会uglify阶段擦除掉
- 原理是利用es6模块的特点,只能作为模块顶层语句出现,import的模块名只能是字符串常量

### 5.1 开启

- webpack默认支持，在.babelrc里设置`module:false`即可在`production mode`下默认开启
- 还要注意把devtool设置为null 在 package.json 中配置：
- "sideEffects": false 所有的代码都没有副作用（都可以进行 tree shaking）
  - 可能会把 css / @babel/polyfill文件干掉 可以设置`"sideEffects":["*.css"]`

webpack.config.js

```diff
const path = require("path");
const glob = require("glob");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PATHS = {
  src: path.join(__dirname, 'src')
}
module.exports = {
+  mode: "production",
+  devtool:false,
  entry: {
    main: './src/index.js'
  },
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.js/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader:'thread-loader',
            options:{
              workers:3
            }
          },
          {
            loader: "babel-loader",
            options: {
+              presets: [["@babel/preset-env",{"modules":false}], "@babel/preset-react"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css"
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
  ],
};
```

### 5.2 没有导入和使用

functions.js

```js
function func1(){
  return 'func1';
}
function func2(){
     return 'func2';
}
export {
  func1,
  func2
}
import {func2} from './functions';
var result2 = func2();
console.log(result2);
```

### 5.3 代码不会被执行，不可到达

```js
if(false){
 console.log('false')
}
```

### 5.4 代码执行的结果不会被用到

```js
import {func2} from './functions';
func2();
```

### 5.4 代码中只写不读的变量

```js
var aabbcc='aabbcc';
aabbcc='eeffgg';
```

## 6 代码分割

- 对于大的Web应用来讲，将所有的代码都放在一个文件中显然是不够有效的，特别是当你的某些代码块是在某些特殊的时候才会被用到。
- webpack有一个功能就是将你的代码库分割成chunks语块，当代码运行到需要它们的时候再进行加载

### 6.1 入口点分割

- Entry Points：入口文件设置的时候可以配置
- 这种方法的问题
  - 如果入口 chunks 之间包含重复的模块(lodash)，那些重复模块都会被引入到各个 bundle 中
  - 不够灵活，并且不能将核心应用程序逻辑进行动态拆分代码

```js
entry: {
        index: "./src/index.js",
        login: "./src/login.js"
}
```

### 6.2 动态导入和懒加载

- 用户当前需要用什么功能就只加载这个功能对应的代码，也就是所谓的按需加载 在给单页应用做按需加载优化时
- 一般采用以下原则：
  - 对网站功能进行划分，每一类一个chunk
  - 对于首次打开页面需要的功能直接加载，尽快展示给用户,某些依赖大量代码的功能点可以按需加载
  - 被分割出去的代码需要一个按需加载的时机

#### 6.2.1 hello.js

hello.js

```js
module.exports = "hello";
```

index.js

```js
document.querySelector('#clickBtn').addEventListener('click',() => {
    import('./hello').then(result => {
        console.log(result.default);
    });
});
```

index.html

```html
<button id="clickBtn">点我</button>
```

#### 6.2.2 按需加载

- 如何在react项目中实现按需加载？

##### 6.2.2.1 index.js

index.js

```js
import React, { Component, Suspense } from "react";
import ReactDOM from "react-dom";
import Loading from "./components/Loading";
/* function lazy(loadFunction) {
  return class LazyComponent extends React.Component {
    state = { Comp: null };
    componentDidMount() {
      loadFunction().then((result) => {
        this.setState({ Comp: result.default });
      });
    }
    render() {
      let Comp = this.state.Comp;
      return Comp ? <Comp {...this.props} /> : null;
    }
  };
} */
const AppTitle = React.lazy(() =>
  import(/* webpackChunkName: "title" */ "./components/Title")
);

class App extends Component {
  constructor(){
    super();
    this.state = {visible:false};
  }
  show(){
    this.setState({ visible: true });
  };
  render() {
    return (
      <>
        {this.state.visible && (
          <Suspense fallback={<Loading />}>
            <AppTitle />
          </Suspense>
        )}
        <button onClick={this.show.bind(this)}>加载</button>
      </>
    );
  }
}
ReactDOM.render(<App />, document.querySelector("#root"));
```

##### 6.2.2.2 Loading.js

src\components\Loading.js

```js
import React, { Component, Suspense } from "react";
export default (props) => {
  return <p>Loading</p>;
};
```

##### 6.2.2.3 Title.js

src\components\Title.js

```js
import React, { Component, Suspense } from "react";
export default props=>{
  return <p>Title</p>;
}
```

#### 6.2.3 preload(预先加载)

- preload通常用于本页面要用到的关键资源，包括关键js、字体、css文件
- preload将会把资源得下载顺序权重提高，使得关键数据提前下载好,优化页面打开速度
- 在资源上添加预先加载的注释，你指明该模块需要立即被使用
- 一个资源的加载的优先级被分为五个级别,分别是
  - Highest 最高
  - High 高
  - Medium 中等
  - Low 低
  - Lowest 最低
- 异步/延迟/插入的脚本（无论在什么位置）在网络优先级中是 `Low`

![prefetchpreload](http://img.zhufengpeixun.cn/prefetchpreload.png)

```js
<link rel="preload" as="script" href="utils.js">
import(
  `./utils.js`
  /* webpackPreload: true */
  /* webpackChunkName: "utils" */
)
```

#### 6.2.4 prefetch(预先拉取)

- prefetch 跟 preload 不同，它的作用是告诉浏览器未来可能会使用到的某个资源，浏览器就会在闲时去加载对应的资源，若能预测到用户的行为，比如懒加载，点击到其它页面等则相当于提前预加载了需要的资源

```html
<link rel="prefetch" href="utils.js" as="script">
button.addEventListener('click', () => {
  import(
    `./utils.js`
    /* webpackPrefetch: true */
    /* webpackChunkName: "utils" */
  ).then(result => {
    result.default.log('hello');
  })
});
```

#### 6.2.5 preload vs prefetch

- preload 是告诉浏览器页面必定需要的资源，浏览器一定会加载这些资源
- 而 prefetch 是告诉浏览器页面可能需要的资源，浏览器不一定会加载这些资源
- 所以建议：对于当前页面很有必要的资源使用 preload,对于可能在将来的页面中使用的资源使用 prefetch

~~~js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="prefetch" href="prefetch.js?k=1" as="script">
    <link rel="prefetch" href="prefetch.js?k=2" as="script">
    <link rel="prefetch" href="prefetch.js?k=3" as="script">
    <link rel="prefetch" href="prefetch.js?k=4" as="script">
    <link rel="prefetch" href="prefetch.js?k=5" as="script">

</head>
<body>

</body>
<link rel="preload"  href="preload.js" as="script">
</html>
``
#### 6.2.6 提取公共代码
- [common-chunk-and-vendor-chunk](https://github.com/webpack/webpack/tree/master/examples/common-chunk-and-vendor-chunk)
- [split-chunks-plugin](https://www.webpackjs.com/plugins/split-chunks-plugin)
- 怎么配置单页应用?怎么配置多页应用?

##### 6.2.6.1 为什么需要提取公共代码
- 大网站有多个页面，每个页面由于采用相同技术栈和样式代码，会包含很多公共代码，如果都包含进来会有问题
- 相同的资源被重复的加载，浪费用户的流量和服务器的成本；
- 每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。
- 如果能把公共代码抽离成单独文件进行加载能进行优化，可以减少网络传输流量，降低服务器成本

##### 6.2.6.2 如何提取
- 基础类库，方便长期缓存
- 页面之间的公用代码
- 各个页面单独生成文件

##### 6.2.6.3 splitChunks

###### 6.2.6.3.1 module chunk  bundle
- module：就是js的模块化webpack支持commonJS、ES6等模块化规范，简单来说就是你通过import语句引入的代码
- chunk: chunk是webpack根据功能拆分出来的，包含三种情况
  - 你的项目入口（entry）
  - 通过import()动态引入的代码
  - 通过splitChunks拆分出来的代码
- bundle：bundle是webpack打包之后的各个文件，一般就是和chunk是一对一的关系，bundle就是对chunk进行编译压缩打包等处理之后的产出

###### 6.2.6.3.2  默认配置
webpack.config.js

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
{
  entry: {
    page1: "./src/page1.js",
    page2: "./src/page2.js",
    page3: "./src/page3.js",
  },
 optimization: {
  splitChunks: {
      chunks: "all", //默认作用于异步chunk，值为all/initial/async
      minSize: 0, //默认值是30kb,代码块的最小尺寸
      minChunks: 1, //被多少模块共享,在分割之前模块的被引用次数
      maxAsyncRequests: 3, //限制异步模块内部的并行最大请求数的，说白了你可以理解为是每个import()它里面的最大并行请求数量
      maxInitialRequests: 5, //限制入口的拆分数量
      name: true, //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔开，如vendor~
      automaticNameDelimiter: "~", //默认webpack将会使用入口名和代码块的名称生成命名,比如 'vendors~main.js'
      cacheGroups: {
        //设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
        vendors: {
          chunks: "all",
          test: /node_modules/, //条件
          priority: -10, ///优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中,为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
        },
        default: {
          chunks: "all",
          minSize: 0, //最小提取字节数
          minChunks: 2, //最少被几个chunk引用
          priority: -20,
          reuseExistingChunk: false
        }
      },
      runtimeChunk:true
    },
  plugins:[
        new HtmlWebpackPlugin({
                template:'./src/index.html',
                chunks:["page1"],
                filename:'page1.html'
        }),
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            chunks:["page2"],
            filename:'page2.html'
    }),
    new HtmlWebpackPlugin({
            template:'./src/index.html',
            chunks:["page3"],
            filename:'page3.html'
    })
    ]
    }
~~~

src\page1.js

```js
import module1 from "./module1";
import module2 from "./module2";
import $ from "jquery";
console.log(module1, module2, $);
import(/* webpackChunkName: "asyncModule1" */ "./asyncModule1");
```

src\page2.js

```js
import module1 from "./module1";
import module2 from "./module2";
import $ from "jquery";
console.log(module1, module2, $);
```

src\page3.js

```js
import module1 from "./module1";
import module3 from "./module3";
import $ from "jquery";
console.log(module1, module3, $);
```

src\module1.js

```js
console.log("module1");
```

src\module2.js

```js
console.log("module2");
```

src\module3.js

```js
console.log("module3");
```

src\asyncModule1.js

```js
import _ from 'lodash';
console.log(_);
```

![splitChunks](http://img.zhufengpeixun.com/splitChunks.jpg)

## 7.开启 Scope Hoisting

- Scope Hoisting 可以让 Webpack 打包出来的代码文件更小、运行的更快， 它又译作 "作用域提升"，是在 Webpack3 中新推出的功能。
- 初webpack转换后的模块会包裹上一层函数,import会转换成require
- 代码体积更小，因为函数申明语句会产生大量代码
- 代码在运行时因为创建的函数作用域更少了，内存开销也随之变小
- 大量作用域包裹代码会导致体积增大
- 运行时创建的函数作用域变多，内存开销增大
- scope hoisting的原理是将所有的模块按照引用顺序放在一个函数作用域里，然后适当地重命名一些变量以防止命名冲突
- 这个功能在mode为production下默认开启,开发环境要用 `webpack.optimize.ModuleConcatenationPlugin`插件
- 也要使用ES6 Module,CJS不支持

hello.js

```js
export default 'Hello';
```

index.js

```js
import str from './hello.js';
console.log(str);
```

输出的结果main.js

```js
"./src/index.js":
(function(module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
var hello = ('hello');
console.log(hello);
 })
```

> 函数由两个变成了一个，hello.js 中定义的内容被直接注入到了 main.js 中

## 8.利用缓存

- webpack中利用缓存一般有以下几种思路：
  - babel-loader开启缓存
  - 使用cache-loader
  - 使用hard-source-webpack-plugin

### 8.1 babel-loader

- Babel在转义js文件过程中消耗性能较高，将babel-loader执行的结果缓存起来，当重新打包构建时会尝试读取缓存，从而提高打包构建速度、降低消耗

```js
 {
    test: /\.js$/,
    exclude: /node_modules/,
    use: [{
      loader: "babel-loader",
      options: {
        cacheDirectory: true
      }
    }]
  },
```

### 8.2 cache-loader

- 在一些性能开销较大的 loader 之前添加此 loader,以将结果缓存到磁盘里
- 存和读取这些缓存文件会有一些时间开销,所以请只对性能开销较大的 loader 使用此 loader

```js
cnpm i  cache-loader -D
const loaders = ['babel-loader'];
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'cache-loader',
          ...loaders
        ],
        include: path.resolve('src')
      }
    ]
  }
}
```

### 8.3 hard-source-webpack-plugin

- `HardSourceWebpackPlugin`为模块提供了中间缓存,缓存默认的存放路径是 `node_modules/.cache/hard-source`。`
- 配置 hard-source-webpack-plugin后，首次构建时间并不会有太大的变化，但是从第二次开始，构建时间大约可以减少 80%左右
- webpack5中会内置`hard-source-webpack-plugin`

```js
yarn add -D hard-source-webpack-plugin
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  entry: // ...
  output: // ...
  plugins: [
    new HardSourceWebpackPlugin()
  ]
}
```

### 8.4 oneOf

- 每个文件对于rules中的所有规则都会遍历一遍，如果使用oneOf就可以解决该问题，只要能匹配一个即可退出。(注意：在oneOf中不能两个配置处理同一种类型文件)

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        //优先执行
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
      {
        // 以下 loader 只会匹配一个
        oneOf: [
          ...,
          {},
          {}
        ]
      }
    ]
  }
}
```

