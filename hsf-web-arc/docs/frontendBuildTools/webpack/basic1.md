---
title: webpack基础（一）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

#webpack-1-base

## 1. 什么是WebPack

​		WebPack可以看做是模块打包机：它做的事情是，分析你的项目结构，找到JavaScript模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其打包为合适的格式以供浏览器使用。

![webpack](http://img.zhufengpeixun.cn/webpack.jpeg)

webpack主体功能:

​	1、构建就是把源代码转换成发布到线上的可执行 JavaScrip、CSS、HTML 代码，包括如下内容。

- 代码转换：TypeScript 编译成 JavaScript、SCSS 编译成 CSS 等。
- 文件优化：压缩 JavaScript、CSS、HTML 代码，压缩合并图片等。
- 代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载。
- 模块合并：在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件。
- 自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器。
- 代码校验：在代码被提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过。
- 自动发布：更新完代码后，自动构建出线上发布代码并传输给发布系统。

构建其实是工程化、自动化思想在前端开发中的体现，把一系列流程用代码去实现，让代码自动化地执行这一系列复杂的流程。 构建给前端开发注入了更大的活力，解放了我们的生产力。

## 2. 初始化项目

```js
mkdir webpack-demo
cd webpack-demo
npm init -y
```

## 3. 快速上手

### 3.1 webpack核心概念

- Entry：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入，也就是以哪个文件为入口文件，构建一颗文件树,
- Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
- Plugin：扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
- Output：输出结果，在 Webpack 经过一系列处理并得出最终想要的代码后输出结果。
- context: context即是项目打包的路径上下文，如果指定了context,那么entry和output都是相对于上下文路径的，contex必须是一个绝对路径

> ​		Webpack 启动后会从`Entry`里配置的`Module`开始递归解析 Entry 依赖的所有 Module。 每找到一个 Module， 就会根据配置的`Loader`去找出对应的转换规则，对 Module 进行转换后，再解析出当前 Module 依赖的 Module。 这些模块会以 Entry 为单位进行分组，一个 Entry 和其所有依赖的 Module 被分到一个组也就是一个 `Chunk`。最后 Webpack 会把所有 Chunk 转换成文件输出。 在整个流程中 Webpack 会在恰当的时机执行 Plugin 里定义的逻辑。
>
> webpack打包的顺序是：1、根据entry文件和找到其依赖的模块，在module的查找过程中，会是用loader进行转化一些文件，例如：css、ts、gif等等，解析出整个依赖树；2、
>
> 对于每个chunk来说，就是之前由入口文件和module构建的树，3、

### 3.2 配置webpack

```js
npm install webpack webpack-cli -D   (主要解析用户参数 yargs) 
```

#### 3.2.1 创建src目录

```js
mkdir src
```

#### 3.2.2 创建dist目录

```js
mkdir dist
```

#### 3.2.3 基本配置文件

webpack.config.js

```js
// 这个文件是webpack-cli脚手架包启动时，默认查找的配置文件，在内部实际是已经定义好的
const path=require('path');
module.exports={
  context:process.cwd(),
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname,'dist'),
        filename:'bundle.js'
    },
    module: {},
    plugins: [],
    devServer: {}
}
```

- 创建dist
  - 创建index.html
- 配置文件webpack.config.js
  - entry：配置入口文件的地址
  - output：配置出口文件的地址
  - module：配置模块,主要用来配置不同文件的加载器
  - plugins：配置插件
  - devServer：配置开发服务器

#### 3.2.4 创建index.html文件

在dist目录下创建index.html文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
<div id="root"></div>
    打包之后的js模块
<script src="bundle.js"></script>
</body>
</html>
```

#### 3.2.5 mode

​	webpack的[mode](https://webpack.js.org/configuration/mode/#root)配置用于提供模式配置选项告诉webpack相应地使用其内置的优化，mode有以下三个可选值

- development
- production
- none

下面是会根据你选择的 [`mode`](https://webpack.docschina.org/concepts/mode/) 来执行不同的优化， 不过所有的优化还是可以手动配置和重写，利用optimization的配置项：

common

```js
//parent chunk中解决了的chunk会被删除
optimization.removeAvailableModules:true
//删除空的chunks
optimization.removeEmptyChunks:true
//合并重复的chunk
optimization.mergeDuplicateChunks:true
```

development

```js
//调试
devtool:eval
//缓存模块, 避免在未更改时重建它们。
cache:true
//缓存已解决的依赖项, 避免重新解析它们。
module.unsafeCache:true
//在 bundle 中引入「所包含模块信息」的相关注释
output.pathinfo:true
//在可能的情况下确定每个模块的导出,被用于其他优化或代码生成。
optimization.providedExports:true
//找到chunk中共享的模块,取出来生成单独的chunk
optimization.splitChunks:true
//为 webpack 运行时代码创建单独的chunk
optimization.runtimeChunk:true
//编译错误时不写入到输出
optimization.noEmitOnErrors:true
//给模块有意义的名称代替ids
optimization.namedModules:true
//给模chunk有意义的名称代替ids
optimization.namedChunks:true
```

production

```js
//性能相关配置
performance:{hints:"error"....}
//某些chunk的子chunk已一种方式被确定和标记,这些子chunks在加载更大的块时不必加载
optimization.flagIncludedChunks:true
//给经常使用的ids更短的值
optimization.occurrenceOrder:true
//确定每个模块下被使用的导出
optimization.usedExports:true
//识别package.json or rules sideEffects 标志
optimization.sideEffects:true
//尝试查找模块图中可以安全连接到单个模块中的段。- -
optimization.concatenateModules:true
//使用uglify-js压缩代码
optimization.minimize:true
```

## 4. 配置开发服务器

```js
npm i webpack-dev-server –D

// 如果出现这个错误是Error: Cannot find module 'webpack-cli/bin/config-yargs'
// 其实是webpack-cli4.x的版本删除了config-yargs文件，就是版本不兼容，webpack-dev-server的版本是3.x
```

- contentBase 配置开发服务运行时的文件根目录
- host：开发服务器监听的主机地址
- compress 开发服务器是否启动gzip等压缩
- port：开发服务器监听的端口

```diff
+ devServer:{
+        contentBase:path.resolve(__dirname,'dist'),
+        host:'localhost',
+        compress:true,
+        port:8080
+ }
+  "scripts": {
+    "build": "webpack",
+    "dev": "webpack-dev-server --open "
+  }
```

## 5. 支持加载css文件

### 5.1 什么是Loader

通过使用不同的Loader，Webpack可以把不同的文件都转成JS文件,比如CSS、ES6/7、JSX等。

- test：匹配处理文件的扩展名的正则表达式
- use：loader名称，就是你要使用模块的名称
- include/exclude:手动指定必须处理的文件夹或屏蔽不需要处理的文件夹
- query：为loaders提供额外的设置选项

### 5.2 loader三种写法

- [css-loader](https://www.npmjs.com/package/css-loader)
- [style-loader](https://www.npmjs.com/package/style-loader)

#### 5.2.1 loader

加载CSS文件，CSS文件有可能在node_modules里，比如bootstrap和antd

```diff
module: {
        rules: [
            {
                test: /\.css/,
+                loader:['style-loader','css-loader']
            }
        ]
    }
```

#### 5.2.2 use

```diff
module: {
        rules: [
            {
                test: /\.css/,
+                use:['style-loader','css-loader']
            }
        ]
    },
```

#### 5.2.3 use+loader

```js
    module: {
        rules: [
            {
                test: /\.css/,
                include: path.resolve(__dirname,'src'),
                exclude: /node_modules/,
                use: [{
                    loader: 'style-loader',
                    options: {
                        insert:'top'
                    }
                },'css-loader']
            }
        ]
    }
```

## 6. 插件

- 在 webpack 的构建流程中，plugin 用于处理更多其他的一些构建任务
- 模块代码转换的工作由 loader 来处理
- 除此之外的其他任何工作都可以交由 plugin 来完成

### 6.1 自动产出html

- 我们希望自动能产出HTML文件，并在里面引入产出后的资源

- chunksSortMode

  还可以控制引入的顺序

  ```js
  cnpm i html-webpack-plugin -D
  ```

- minify 是对html文件进行压缩，removeAttrubuteQuotes是去掉属性的双引号

- hash 引入产出资源的时候加上查询参数，值为哈希避免缓存

- template 模版路径

```diff
+    +entry:{
+        index:'./src/index.js',  // chunk名字 index
+        common:'./src/common.js' //chunk名字 common
+    },

    plugins: [
+       new HtmlWebpackPlugin({
+            template:'./src/index.html',//指定模板文件
+            filename:'index.html',//产出后的文件名
+            inject:false,
+            hash:true,//为了避免缓存，可以在产出的资源后面添加hash值
+            chunks:['common','index'],
+            chunksSortMode:'manual'//对引入代码块进行排序的模式
+        }),
    )]
<head>
+ <% for (var css in htmlWebpackPlugin.files.css) { %>
+        <link href="<%= htmlWebpackPlugin.files.css[css] %>" rel="stylesheet">
+ <% } %>
</head>
<body>
+ <% for (var chunk in htmlWebpackPlugin.files.chunks) { %>
+ <script src="<%= htmlWebpackPlugin.files.chunks[chunk].entry %>"></script>
+ <% } %>
</body>
```

## 7. 支持图片

### 7.1 手动添加图片

```js
npm i file-loader url-loader -D
```

- [file-loader](http://npmjs.com/package/file-loader) 解决CSS等文件中的引入图片路径问题
- [url-loader](https://www.npmjs.com/package/url-loader) 当图片小于limit的时候会把图片BASE64编码，大于limit参数的时候还是使用file-loader 进行拷贝

### 7.2 JS中引入图片

#### 7.2.1 JS

```js
let logo=require('./images/logo.png');
let img=new Image();
img.src=logo;
document.body.appendChild(img);
```

#### 7.2.2 webpack.config.js

```js
{
  test:/\.(jpg|png|bmp|gif|svg)/,
    use:[
    {
       loader:'url-loader',
       options:{limit:4096}
    }
  ]
}
```

### 7.3 在CSS中引入图片

还可以在CSS文件中引入图片

#### 7.3.1 CSS

```css
.logo{
    width:355px;
    height:133px;
    background-image: url(./images/logo.png);
    background-size: cover;
}
```

#### 7.3.2 HTML

```html
<div class="logo"></div>
```

## 8. 分离CSS

因为CSS的下载和JS可以并行,当一个HTML文件很大的时候，我们可以把CSS单独提取出来加载

- [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)
- filename 打包入口文件
- chunkFilename 用来打包`import('module')`方法中引入的模块

### 8.1 安装依赖模块

```js
npm install --save-dev mini-css-extract-plugin
```

### 8.2 配置webpack.config.js

```diff
plugins: [
       //参数类似于webpackOptions.output
+        new MiniCssExtractPlugin({
+            filename: '[name].css',
+            chunkFilename:'[id].css'
+        }),

{
                test: /\.css/,
                include: path.resolve(__dirname,'src'),
                exclude: /node_modules/,
                use: [{
+                    loader: MiniCssExtractPlugin.loader
                },'css-loader']
            }
```

### 8.3 内联CSS

- 注意此插件要放在`HtmlWebpackPlugin`的下面
- HtmlWebpackPlugin的`inject`设置为`true`

```js
cnpm i html-inline-css-webpack-plugin -D
+const HtmlInlineCssWebpackPlugin= require('html-inline-css-webpack-plugin').default;

plugins:[
  new HtmlWebpackPlugin({}),
+  new HtmlInlineCssWebpackPlugin()
]
```

### 8.4 压缩JS和CSS

- 用`terser-webpack-plugin`替换掉`uglifyjs-webpack-plugin`解决uglifyjs不支持es6语法问题

```js
cnpm i uglifyjs-webpack-plugin terser-webpack-plugin optimize-css-assets-webpack-plugin -D
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
module.exports = {
    mode: 'production',
    optimization: {
        minimizer: [
           /*  new UglifyJsPlugin({
                cache: true,//启动缓存
                parallel: true,//启动并行压缩
                //如果为true的话，可以获得sourcemap
                sourceMap: true // set to true if you want JS source maps
            }), */
            new TerserPlugin({
                 parallel: true,
                 cache: true
            }),
            //压缩css资源的
            new OptimizeCSSAssetsPlugin({
                 assetNameRegExp:/\.css$/g,
                 //cssnano是PostCSS的CSS优化和分解插件。cssnano采用格式很好的CSS，并通过许多优化，以确保最终的生产环境尽可能小。
                 cssProcessor:require('cssnano')
            })
        ]
    },
```

### 8.5 css和image存放单独目录

- 去掉`HtmlInlineCssWebpackPlugin`
- outputPath 输出路径
- publicPath指定的是构建后在html里的路径
- 如果在CSS文件中引入图片，而图片放在了image目录下，就需要配置图片的publicPath为`/images`,或者

```js
{
   loader:MiniCssExtractPlugin.loader,
      options:{
+        publicPath:'/'
      }        
{
  test:/\.(jpg|jpeg|png|bmp|gif|svg|ttf|woff|woff2|eot)/,
  use:[
        {
          loader:'url-loader',
          options:{
              limit: 4096,
+              outputPath: 'images',
+              publicPath:'/images'
          }
        }
     ]
}
output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'bundle.js',
+        publicPath:'/'
    },
{
  test:/\.(jpg|jpeg|png|bmp|gif|svg|ttf|woff|woff2|eot)/,
  use:[
        {
          loader:'url-loader',
          options:{
              limit: 4096,
+              outputPath: 'images',
+              publicPath:'/images'
          }
        }
     ]
}

plugins: [
    new MiniCssExtractPlugin({
-       //filename: '[name].css',
-       //chunkFilename: '[id].css',
+       chunkFilename: 'css/[id].css',
+       filename: 'css/[name].[hash].[chunkhash].[contenthash].css',//name是代码码chunk的名字
    }),
```

### 8.6 文件指纹

- 打包后输出的文件名和后缀
- hash一般是结合CDN缓存来使用，通过webpack构建之后，生成对应文件名自动带上对应的MD5值。如果文件内容改变的话，那么对应文件哈希值也会改变，对应的HTML引用的URL地址也会改变，触发CDN服务器从源服务器上拉取对应数据，进而更新本地缓存。

#### 8.6.1 文件指纹如何生成

- Hash 是整个项目的hash值，其根据每次编译内容计算得到，每次编译之后都会生成新的hash,即修改任何文件都会导致所有文件的hash发生改变，在一个项目中虽然入口不同，但是hash是相同的，hash无法实现前端静态资源的浏览器长缓存，如果有这个需求应该使用chunkhash
- chunkhash 采用hash计算的话，每一次构建后生成的哈希值都不一样，即使文件内容压根没有改变。这样子是没办法实现缓存效果，我们需要换另一种哈希值计算方式，即chunkhash,chunkhash和hash不一样，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。我们在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用chunkhash的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响
- contenthash 使用chunkhash存在一个问题，就是当在一个JS文件中引入CSS文件，编译后它们的hash是相同的，而且只要js文件发生改变 ，关联的css文件hash也会改变,这个时候可以使用`mini-css-extract-plugin`里的`contenthash`值，保证即使css文件所处的模块里就算其他文件内容改变，只要css文件内容不变，那么不会重复构建

指纹占位符

| 占位符名称  | 含义                         |
| :---------- | :--------------------------- |
| ext         | 资源后缀名                   |
| name        | 文件名称                     |
| path        | 文件的相对路径               |
| folder      | 文件所在的文件夹             |
| contenthash | 文件的内容hash,默认是md5生成 |
| hash        | 文件内容的hash,默认是md5生成 |
| emoji       | 一个随机的指代文件内容的emoj |

## 9. 编译less 和 sass

### 9.1 安装less

```js
npm i less less-loader -D
npm i node-sass sass-loader -D
```

### 9.2 编写样式

less

```less
@color:red;
.less-container{
    color:@color;
}
```

scss

```scss
$color:green;
.sass-container{
    color:$color;
}
```

webpack.config.js

```js
   {
        test: /\.less/,
        include: path.resolve(__dirname,'src'),
        exclude: /node_modules/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
        },'css-loader','less-loader']
    },
    {
        test: /\.scss/,
        include: path.resolve(__dirname,'src'),
        exclude: /node_modules/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
        },'css-loader','sass-loader']
    },
```

## 10. 处理CSS3属性前缀

- 为了浏览器的兼容性，有时候我们必须加入-webkit,-ms,-o,-moz这些前缀
  - Trident内核：主要代表为IE浏览器, 前缀为-ms
  - Gecko内核：主要代表为Firefox, 前缀为-moz
  - Presto内核：主要代表为Opera, 前缀为-o
  - Webkit内核：产要代表为Chrome和Safari, 前缀为-webkit
- [caniuse](https://caniuse.com/)

```js
npm i postcss-loader autoprefixer -D
```

- PostCSS 的主要功能只有两个
  - 第一个就是前面提到的把 CSS 解析成 JavaScript 可以操作的 抽象语法树结构(Abstract Syntax Tree，AST)
  - 第二个就是调用插件来处理 AST 并得到结果

[postcss-loader](https://github.com/postcss/postcss-loader)

index.css

```css
::placeholder {
    color: red;
}
```

postcss.config.js

```js
module.exports={
    plugins:[require('autoprefixer')]
}
```

webpack.config.js

```js
{
   test:/\.css$/,
   use:[MiniCssExtractPlugin.loader,'css-loader','postcss-loader'],
   include:path.join(__dirname,'./src'),
   exclude:/node_modules/
}
```

## 11. 转义ES6/ES7/JSX

- Babel其实是一个编译JavaScript的平台,可以把ES6/ES7,React的JSX转义为ES5
- [babel-plugin-proposal-decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators)

### 11.1 安装依赖包

```js
npm i babel-loader @babel/core @babel/preset-env  @babel/preset-react  -D
npm i @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D
```

### 11.2 decorator

```js
//Option+Shift+A
function readonly(target,key,discriptor) {
    discriptor.writable=false;
}

class Person{
    @readonly PI=3.14;
}
let p1=new Person();
p1.PI=3.15;
console.log(p1)
```

jsconfig.json

```json
{
    "compilerOptions": {
        "experimentalDecorators": true
    }
}
```

### 11.3 webpack.config.js

```js
{
    test: /\.jsx?$/,
    use: {
        loader: 'babel-loader',
        options:{
         "presets": ["@babel/preset-env"],
         "plugins": [
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
            ["@babel/plugin-proposal-class-properties", { "loose" : true }]
         ]
        }
    },
    include: path.join(__dirname,'src'),
    exclude:/node_modules/
}
```

.babelrc

```js
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
  ]
}
```

### 11.4 babel runtime

- babel 在每个文件都插入了辅助代码，使代码体积过大
- babel 对一些公共方法使用了非常小的辅助代码，比如 `_extend`
- 默认情况下会被添加到每一个需要它的文件中。你可以引入 `@babel/runtime` 作为一个独立模块，来避免重复引入
- [babel-plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime)
- [babel-plugin-proposal-decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators)
- [babel-plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties)
- loose为true的时候,属性是直接赋值,loose为false的时候会使用`Object.defineProperty`
- `@babel/preset-env` 中的 useBuiltIns 选项，如果你设置了 usage，babel 编绎的时候就不用整个 polyfills , 只加载你使用 polyfills，这样就可以减少包的大小
- `@babel/plugin-transform-runtime` 是开发时引入, `@babel/runtime` 是运行时引用
- plugin-transform-runtime 已经默认包括了 @babel/polyfill，因此不用在独立引入
- corejs 是一个给低版本的浏览器提供接口的库，如 Promise、Map和Set 等
- 在 babel 中你设置成 false 或者不设置，就是引入的是 corejs 中的库，而且在全局中引入，也就是说侵入了全局的变量

```js
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime
```

.babelrc

```js
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
    [
         "@babel/plugin-transform-runtime",
         {
            "corejs": false,
            "helpers": true,
            "regenerator": true,
            "useESModules": true
        }
    ]
  ]
}
```

> webpack打包的时候，会自动优化重复引入公共方法的问题

#### 11.4.1 区别

- [区别](https://www.arayzou.com/2019/10/15/plugin-transform-runtime与polyfill/)

### 11.5 ESLint校验代码格式规范

- [eslint](https://eslint.org/docs/developer-guide/nodejs-api#cliengine)
- [eslint-loader](https://www.npmjs.com/package/eslint-loader)
- [configuring](https://eslint.org/docs/user-guide/configuring)
- [babel-eslint](https://www.npmjs.com/package/babel-eslint)
- [Rules](https://cloud.tencent.com/developer/chapter/12618)
- [ESlint 语法检测配置说明](https://segmentfault.com/a/1190000008742240)

#### 11.5.1 标准配置

- 建议制定团队的eslint规范
- 基于eslint:recommend配置进行改进
- 发现代码错误的规则尽可能多的开启
- 帮助保持团队的代码风格统一而不要限制开发体验

```js
npm install eslint eslint-loader babel-eslint --D
```

.eslintrc.js

```js
module.exports = {
    root: true,
    //指定解析器选项
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2015
    },
    //指定脚本的运行环境
    env: {
        browser: true,
    },
    // 启用的规则及其各自的错误级别
    rules: {
        "indent": ["error", 4],//缩进风格
        "quotes": ["error", "double"],//引号类型 
        "semi": ["error", "always"],//关闭语句强制分号结尾
        "no-console": "error",//禁止使用console
        "arrow-parens": 0 //箭头函数用小括号括起来
    }
}
```

webpack.config.js

```js
module: {
        //配置加载规则
        rules: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                enforce: "pre",
                include: [path.resolve(__dirname, 'src')], // 指定检查的目录
                options: { fix: true } // 这里的配置项参数将会被传递到 eslint 的 CLIEngine   
            },
```

#### 11.5.2 继承airbnb

- [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)

```js
cnpm i eslint-config-airbnb eslint-loader eslint eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks and eslint-plugin-jsx-a11y -D
```

.eslintrc.js

```js
module.exports = {
    "parser":"babel-eslint",
    "extends":"airbnb",
    "rules":{
        "semi":"error",
        "no-console":"off",
        "linebreak-style":"off",
        "eol-last":"off"
        //"indent":["error",2]
    },
    "env":{
        "browser":true,
        "node":true
    }
}
```

### 11.6 引入字体

- OTF—— opentype 苹果机与PC机都能很好应用的兼容字体
- [HabanoST](http://img.zhufengpeixun.cn/HabanoST.otf)

#### 11.6.1 配置loader

```js
{
 test:/\.(woff|ttf|eot|svg|otf)$/,
     use:{
                    //url内部内置了file-loader
        loader:'url-loader',
        options:{//如果要加载的图片大小小于10K的话，就把这张图片转成base64编码内嵌到html网页中去
       limit:10*1024
       }
   }
 },
```

#### 11.6.2 使用字体

```less
@font-face {
    src: url('./fonts/HabanoST.otf') format('truetype');
    font-family: 'HabanoST';
}

.welcome {
    font-size:100px;
    font-family: 'HabanoST';
}
```

## 12. 如何调试打包后的代码

- sourcemap是为了解决开发代码与实际运行代码不一致时帮助我们debug到原始开发代码的技术
- webpack通过配置可以自动给我们`source maps`文件，`map`文件是一种对应编译文件和源文件的方法
- [whyeval](https://github.com/webpack/docs/wiki/build-performance#sourcemaps)
- [source-map](https://github.com/mozilla/source-map)
- [javascript_source_map算法](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)

| 类型                         | 含义                                                         |
| :--------------------------- | :----------------------------------------------------------- |
| source-map                   | 原始代码 最好的sourcemap质量有完整的结果，但是会很慢         |
| eval-source-map              | 原始代码 同样道理，但是最高的质量和最低的性能                |
| cheap-module-eval-source-map | 原始代码（只有行内） 同样道理，但是更高的质量和更低的性能    |
| cheap-eval-source-map        | 转换代码（行内） 每个模块被eval执行，并且sourcemap作为eval的一个dataurl |
| eval                         | 生成代码 每个模块都被eval执行，并且存在@sourceURL,带eval的构建模式能cache SourceMap |
| cheap-source-map             | 转换代码（行内） 生成的sourcemap没有列映射，从loaders生成的sourcemap没有被使用 |
| cheap-module-source-map      | 原始代码（只有行内） 与上面一样除了每行特点的从loader中进行映射 |

看似配置项很多， 其实只是五个关键字eval、source-map、cheap、module和inline的任意组合

| 关键字     | 含义                                                         |
| :--------- | :----------------------------------------------------------- |
| eval       | 使用eval包裹模块代码                                         |
| source-map | 产生.map文件                                                 |
| cheap      | 不包含列信息（关于列信息的解释下面会有详细介绍)也不包含loader的sourcemap |
| module     | 包含loader的sourcemap（比如jsx to js ，babel的sourcemap）,否则无法定义源文件 |
| inline     | 将.map作为DataURI嵌入，不单独生成.map文件                    |

- eval eval执行
- eval-source-map 生成sourcemap
- cheap-module-eval-source-map 不包含列
- cheap-eval-source-map 无法看到真正的源码

### 12.1 sourcemap

- [compiler官方下载](https://developers.google.com/closure/compiler)
- [compiler珠峰镜像](http://img.zhufengpeixun.cn/compiler.jar)

#### 12.1 生成sourcemap

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
| sourceRoot             | 转换前的文件所在的目录。如果与转换前的文件在同一目录，该项为空。 |
| sources                | 转换前的文件。该项是一个数组，表示可能存在多个文件合并。     |
| names                  | 转换前的所有变量名和属性名                                   |
| mappings               | 记录位置信息的字符串                                         |

#### 12.2 mappings属性

- 关键就是map文件的mappings属性。这是一个很长的字符串，它分成三层

| 对应             | 含义                                                         |
| :--------------- | :----------------------------------------------------------- |
| 第一层是行对应   | 以分号（;）表示，每个分号对应转换后源码的一行。所以，第一个分号前的内容，就对应源码的第一行，以此类推。 |
| 第二层是位置对应 | 以逗号（,）表示，每个逗号对应转换后源码的一个位置。所以，第一个逗号前的内容，就对应该行源码的第一个位置，以此类推。 |
| 第三层是位置转换 | 以VLQ编码表示，代表该位置对应的转换前的源码位置。            |

```js
"mappings":"AAAA,IAAIA,EAAE,CAAN,CACIC,EAAE,CADN,CAEIC,EAAE;",
```

#### 12.3 位置对应的原理

- 每个位置使用五位，表示五个字段

| 位置   | 含义                                      |
| :----- | :---------------------------------------- |
| 第一位 | 表示这个位置在（转换后的代码的）的第几列  |
| 第二位 | 表示这个位置属于sources属性中的哪一个文件 |
| 第三位 | 表示这个位置属于转换前代码的第几行        |
| 第四位 | 表示这个位置属于转换前代码的第几          |
| 第五位 | 表示这个位置属于names属性中的哪一个变量   |

> 首先，所有的值都是以0作为基数的。其次，第五位不是必需的，如果该位置没有对应names属性中的变量，可以省略第五位,再次，每一位都采用VLQ编码表示；由于VLQ编码是变长的，所以每一位可以由多个字符构成

> 如果某个位置是AAAAA，由于A在VLQ编码中表示0，因此这个位置的五个位实际上都是0。它的意思是，该位置在转换后代码的第0列，对应sources属性中第0个文件，属于转换前代码的第0行第0列，对应names属性中的第0个变量。

#### 12.4 VLQ编码

- VLQ 是 Variable-length quantity 的缩写,它的特点就是可以非常精简地表示很大的数值
- VLQ编码是变长的。如果（整）数值在-15到+15之间（含两个端点），用一个字符表示；超出这个范围，就需要用多个字符表示。它规定，每个字符使用6个两进制位，正好可以借用Base 64编码的字符表

![base64](http://img.zhufengpeixun.cn/base64.png)

- 在这6个位中，左边的第一位（最高位）表示是否"连续"（continuation）。如果是1，代表这６个位后面的6个位也属于同一个数；如果是0，表示该数值到这6个位结束。
- 这6个位中的右边最后一位（最低位）的含义，取决于这6个位是否是某个数值的VLQ编码的第一个字符。如果是的，这个位代表"符号"（sign），0为正，1为负（Source map的符号固定为0）；如果不是，这个位没有特殊含义，被算作数值的一部分。

[base64vlq在线转换](http://murzwin.com/base64vlq.html)

以16来做示例吧

1. 将16改写成二进制形式10000
2. 在最右边补充符号位。因为16大于0，所以符号位为0，整个数变成100000
3. 从右边的最低位开始，将整个数每隔5位，进行分段，即变成1和00000两段。如果最高位所在的段不足5位，则前面补0，因此两段变成00001和00000
4. 将两段的顺序倒过来，即00000和00001
5. 在每一段的最前面添加一个"连续位"，除了最后一段为0，其他都为1，即变成100000和000001
6. 将每一段转成Base 64编码。
7. 查表可知，100000为g，000001为B。因此，数值16的VLQ编码为gB

```js
let base64 = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'
];

function encode(num) {
    debugger;
    let binary = (num).toString(2);// 10000 转成二进制 
    binary = num > 0 ? binary + '0' : binary + '1';//正数最后边补0，负数最右边补1   100000
    //00001 00000
    let zero = 5 - (binary.length % 5);//4
    if (zero > 0) {
        binary = binary.padStart(Math.ceil(binary.length / 5) * 5, '0');
    }// 00001 00000
    let parts = [];
    for (let i = 0; i < binary.length; i += 5) {
        parts.push(binary.slice(i, i + 5));
    }
    parts.reverse();// ['00000','00001']
    for (let i = 0; i < parts.length; i++) {
        if (i === parts.length - 1) {
            parts[i] = '0' + parts[i];// ['100000','000001']
        } else {
            parts[i] = '1' + parts[i];
        }
    }
    let chars = [];
    for (let i = 0; i < parts.length; i++) {
        chars.push(base64[parseInt(parts[i], 2)]);
    }
    return chars.join('')
}
//16需要二个字符
let ret = encode(16);
console.log(ret);

function getValue(char) {
    let index = base64.findIndex(item => item == char);
    let str = (index).toString(2);
    str = str.padStart(6, '0');
    str = str.slice(1, -1);
    return parseInt(str, 2);
}

function decode(chars) {
    let values = [];
    for (let i = 0; i < chars.length; i++) {
        values.push(getValue(chars[i]));
    }
    return values;
}
function desc(values) {
    return `
    第${values[1] + 1}个源文件中
    的第1行
    第${values[0] + 1}列,
    对应转换后的第${values[2] + 1}行
    第${values[3] + 1}列,
    对应第${values[4] + 1}个变量`;
}
let ret2 = decode('IAAIA');
let message = desc(ret2);
console.log(ret2, message);
```

## 13.打包第三方类库

### 13.1 直接引入

```js
import _ from 'lodash';
alert(_.join(['a','b','c'],'@'));
```

### 13.2 插件引入

- webpack配置ProvidePlugin后，在使用时将不再需要import和require进行引入，直接使用即可
- _ 函数会自动添加到当前模块的上下文，无需显示声明

```diff
+ new webpack.ProvidePlugin({
+     _:'lodash'
+ })
```

> 没有全局的`$`函数，所以导入依赖全局变量的插件依旧会失败

### 13.3 expose-loader

- The expose loader adds modules to the global object. This is useful for debugging

- 不需要任何其他的插件配合，只要将下面的代码添加到所有的loader之前

  ```js
  require("expose-loader?libraryName!./file.js");
  ```

  ```js
  { 
    test: require.resolve("jquery"), 
    loader: "expose-loader?jQuery"
  }
  ```

  ```js
  require("expose-loader?$!jquery");
  ```

### 13.4 externals

如果我们想引用一个库，但是又不想让webpack打包，并且又不影响我们在程序中以CMD、AMD或者window/global全局等方式进行使用，那就可以通过配置externals

```js
 const jQuery = require("jquery");
 import jQuery from 'jquery';
<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.js"></script>
+ externals: {
+         jquery: 'jQuery'//如果要在浏览器中运行，那么不用添加什么前缀，默认设置就是global
+ },
module: {
```

### 13.5 html-webpack-externals-plugin

- 外链CDN

```diff
+ const htmlWebpackExternalsPlugin= require('html-webpack-externals-plugin');
new htmlWebpackExternalsPlugin({
            externals:[
                {
                    module:'react',
                    entry:'https://cdn.bootcss.com/react/15.6.1/react.js',
                    global:'React'
                },
                 {
                    module:'react-dom',
                    entry:'https://cdn.bootcss.com/react/15.6.1/react-dom.js',
                    global:'ReactDOM'
                }
            ]
}) 
```

## 14. watch

当代码发生修改后可以自动重新编译

```js
module.exports = {
    //默认false,也就是不开启
    watch:true,
    //只有开启监听模式时，watchOptions才有意义
    watchOptions:{
        //默认为空，不监听的文件或者文件夹，支持正则匹配
        ignored:/node_modules/,
        //监听到变化发生后会等300ms再去执行，默认300ms
        aggregateTimeout:300,
        //判断文件是否发生变化是通过不停的询问文件系统指定议是有变化实现的，默认每秒问1000次
        poll:1000
    }
}
```

- webpack定时获取文件的更新时间，并跟上次保存的时间进行比对，不一致就表示发生了变化,poll就用来配置每秒问多少次
- 当检测文件不再发生变化，会先缓存起来，等待一段时间后之后再通知监听者，这个等待时间通过`aggregateTimeout`配置
- webpack只会监听entry依赖的文件
- 我们需要尽可能减少需要监听的文件数量和检查频率，当然频率的降低会导致灵敏度下降

## 15. 添加商标

```js
+ new webpack.BannerPlugin('hsf测试'),
```

## 16. 拷贝静态文件

有时项目中没有引用的文件也需要打包到目标目录

```js
npm i copy-webpack-plugin -D
new CopyWebpackPlugin(
            {
                patterns: [
                  { 
                    //静态资源目录源地址
                    from: path.resolve(__dirname,'src/static'), 
                    // 目标地址，相对于output的path目录
                    to: path.resolve(__dirname,'dist/static') },
                ],
 })
```

## 17. 打包前先清空输出目录

- [clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin)

```js
npm i  clean-webpack-plugin -D
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
plugins:[
new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ['**/*', '!static-files*'],})
]
```

## 18. 服务器代理

如果你有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求 ，那么代理某些 URL 会很有用。

### 18.1 不修改路径

- 请求到 /api/users 现在会被代理到请求 http://localhost:3000/api/users。

```js
proxy: {
  "/api": 'http://localhost:3000'
}
```

### 18.2 修改路径

```js
proxy: {
    "/api": {
       target: 'http://localhost:3000',
       pathRewrite:{"^/api":""}        
    }            
}
```

### 18.3 before after

before 在 webpack-dev-server 静态资源中间件处理之前，可以用于拦截部分请求返回特定内容，或者实现简单的数据 mock。

```js
before(app){
  app.get('/api/users', function(req, res) { 
    res.json([{id:1,name:'zfpx1'}])
  })
}
```

### 18.4 webpack-dev-middleware

[webpack-dev-middleware](https://www.npmjs.com/package/)就是在 Express 中提供 webpack-dev-server 静态服务能力的一个中间件

```js
npm install webpack-dev-middleware --save-dev
const express = require('express');
const app = express();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackOptions = require('./webpack.config');
webpackOptions.mode = 'development';
const compiler = webpack(webpackOptions);
app.use(webpackDevMiddleware(compiler, {}));
app.listen(3000);
```

- webpack-dev-server 的好处是相对简单，直接安装依赖后执行命令即可
- 而使用`webpack-dev-middleware`的好处是可以在既有的 Express 代码基础上快速添加 webpack-dev-server 的功能，同时利用 Express 来根据需要添加更多的功能，如 mock 服务、代理 API 请求等

## 19. resolve解析

### 19.1 extensions

指定extension之后可以不用在`require`或是`import`的时候加文件扩展名,会依次尝试添加扩展名进行匹配

```js
resolve: {
  extensions: [".js",".jsx",".json",".css"]
},
```

### 19.2 alias

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

### 19.3 modules

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

### 19.4 mainFields

默认情况下package.json 文件则按照文件中 main 字段的文件名来查找文件

```js
resolve: {
  // 配置 target === "web" 或者 target === "webworker" 时 mainFields 默认值是：
  mainFields: ['browser', 'module', 'main'],
  // target 的值为其他时，mainFields 默认值为：
  mainFields: ["module", "main"],
}
```

### 19.5 mainFiles

当目录下没有 package.json 文件时，我们说会默认使用目录下的 index.js 这个文件，其实这个也是可以配置的

```js
resolve: {
  mainFiles: ['index'], // 你可以添加其他默认使用的文件名
},
```

### 19.6 resolveLoader

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

## 20. noParse

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

## 21. DefinePlugin

`DefinePlugin`创建一些在编译时可以配置的全局常量

```js
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

## 22. IgnorePlugin

IgnorePlugin用于忽略某些特定的模块，让 webpack 不把这些指定的模块打包进去

```js
import moment from  'moment';
console.log(moment);
new webpack.IgnorePlugin(/^\.\/locale/,/moment$/)
```

- 第一个是匹配引入模块路径的正则表达式
- 第二个是匹配模块的对应上下文，即所在目录名

## 20. 区分环境变量

- 日常的前端开发工作中，一般都会有两套构建环境
- 一套开发时使用，构建结果用于本地开发调试，不进行代码压缩，打印 debug 信息，包含 sourcemap 文件
- 一套构建后的结果是直接应用于线上的，即代码都是压缩后，运行时不打印 debug 信息，静态文件不包括 sourcemap
- webpack 4.x 版本引入了 `mode` 的概念
- 当你指定使用 production mode 时，默认会启用各种性能优化的功能，包括构建结果优化以及 webpack 运行性能优化
- 而如果是 development mode 的话，则会开启 debug 工具，运行时打印详细的错误信息，以及更加快速的增量编译构建

### 20.1 环境差异

- 生产环境
  - 可能需要分离 CSS 成单独的文件，以便多个页面共享同一个 CSS 文件
  - 需要压缩 HTML/CSS/JS 代码
  - 需要压缩图片
- 开发环境
  - 需要生成 sourcemap 文件
  - 需要打印 debug 信息
  - 需要 live reload 或者 hot reload 的功能...

### 20.2 获取mode参数

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

### 20.3 封装log方法

- webpack 时传递的 mode 参数，是可以在我们的应用代码运行时，通过 process.env.NODE_ENV 这个变量获取

```js
export default function log(...args) {
    if (process.env.NODE_ENV == 'development') {
        console.log.apply(console,args);
    }
}
```

### 20.4 拆分配置

可以把 webpack 的配置按照不同的环境拆分成多个文件，运行时直接根据环境变量加载对应的配置即可

- webpack.base.js：基础部分，即多个文件中共享的配置
- webpack.development.js：开发环境使用的配置
- webpack.production.js：生产环境使用的配置
- webpack.test.js：测试环境使用的配置...
- [webpack-merge](https://github.com/survivejs/webpack-merge)

```js
const { smart } = require('webpack-merge')
const webpack = require('webpack')
const base = require('./webpack.base.js')
module.exports = smart(base, {
  module: {
    rules: [],
  }
})
```

## 21. 对图片进行压缩和优化

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

## 22. 多入口MPA

- 有时候我们的页面可以不止一个HTML页面，会有多个页面，所以就需要多入口
- 每一次页面跳转的时候，后台服务器都会返回一个新的html文档，这种类型的网站就是多页网站，也叫多页应用

```js
const path=require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const htmlWebpackPlugins=[];
const glob = require('glob');
const entry={};
const entryFiles = glob.sync('./src/**/index.js');
entryFiles.forEach((entryFile,index)=>{
    let entryName = path.dirname(entryFile).split('/').pop();
    entry[entryName]=entryFile;
    htmlWebpackPlugins.push(new HtmlWebpackPlugin({
        template:`./src/${entryName}/index.html`,
        filename:`${entryName}/index.html`,
        chunks:[entryName],
        inject:true,
        minify:{
            html5:true,
            collapseWhitespace:true,
            preserveLineBreaks:false,
            minifyCSS:true,
            minifyJS:true,
            removeComments:false
        }
    }));
}); 

module.exports={
    entry,
    plugins: [
        //other plugins
        ...htmlWebpackPlugins
    ]
}
```

## 23. 日志优化

- 日志太多太少都不美观
- 可以修改stats

| 预设        | 替代  | 描述                     |
| :---------- | :---- | :----------------------- |
| errors-only | none  | 只在错误时输出           |
| minimal     | none  | 发生错误和新的编译时输出 |
| none        | false | 没有输出                 |
| normal      | true  | 标准输出                 |
| verbose     | none  | 全部输出                 |

### 22.1 friendly-errors-webpack-plugin

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

## 24. 日志输出

```js
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

## 25.费时分析

```js
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smw = new SpeedMeasureWebpackPlugin();
module.exports =smw.wrap({
});
```

## 26.webpack-bundle-analyzer

- 是一个webpack的插件，需要配合webpack和webpack-cli一起使用。这个插件的功能是生成代码分析报告，帮助提升代码质量和网站性能

  ```js
  cnpm i webpack-bundle-analyzer -D
  ```

```js
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

## 27.polyfill

### 27.1 babel-polyfill

- babel-polyfill是React官方推荐，缺点是体积大
- babel-polyfill用正确的姿势安装之后，引用方式有三种：
- 1. require("babel-polyfill");
- 1. import "babel-polyfill";
- 1. module.exports = { 　　entry: ["babel-polyfill", "./app/js"] };

### 27.2 polyfill-service

- 自动化的 JavaScript Polyfill 服务
- Polyfill.io 通过分析请求头信息中的 UserAgent 实现自动加载浏览器所需的 polyfills
- [polyfill-service](https://polyfill.io/v3/)
- [polyfill-io](https://c7sky.com/polyfill-io.html)

```js
<script src="https://polyfill.io/v3/polyfill.min.js"></script>
```

## 28. libraryTarget 和 library

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

### 28.1 var (默认)

编写的库将通过`var`被赋值给通过`library`指定名称的变量。

#### 28.1.1 index.js

```js
module.exports =  {
    add(a,b) {
        return a+b;
    }
}
```

#### 28.1.2 bundle.js

```js
var calculator=(function (modules) {}({})
```

#### 29.1.3 index.html

```js
    <script src="bundle.js"></script>
    <script>
        let ret = calculator.add(1,2);
        console.log(ret);
    </script>
```

### 28.2 commonjs

编写的库将通过 CommonJS 规范导出。

#### 28.2.1 导出方式

```js
exports["calculator"] = (function (modules) {}({})
```

#### 28.2.2 使用方式

```js
require('npm-name')['calculator'].add(1,2);
```

> npm-name是指模块发布到 Npm 代码仓库时的名称

### 28.3 commonjs2

编写的库将通过 CommonJS 规范导出。

#### 28.3.1 导出方式

```js
module.exports = (function (modules) {}({})
```

#### 28.3.2 使用方式

```js
require('npm-name').add();
```

> 在 output.libraryTarget 为 commonjs2 时，配置 output.library 将没有意义。

### 28.4 this

编写的库将通过 this 被赋值给通过 library 指定的名称，输出和使用的代码如下：

#### 28.4.1 导出方式

```js
this["calculator"]= (function (modules) {}({})
```

#### 28.4.2 使用方式

```js
this.calculator.add();
```

### 28.5 window

编写的库将通过 window 被赋值给通过 library 指定的名称，即把库挂载到 window 上，输出和使用的代码如下：

#### 28.5.1 导出方式

```js
window["calculator"]= (function (modules) {}({})
```

#### 28.5.2 使用方式

```js
window.calculator.add();
```

### 28.6 global

编写的库将通过 global 被赋值给通过 library 指定的名称，即把库挂载到 global 上，输出和使用的代码如下：

#### 28.6.1 导出方式

```js
global["calculator"]= (function (modules) {}({})
```

#### 28.6.2 使用方式

```js
global.calculator.add();
```

### 28.6 umd

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

## 29. 打包库和组件

- webpack还可以用来打包JS库
- 打包成压缩版和非压缩版
- 支持AMD/CJS/ESM方式导入

### 29.1 编写库文件

#### 29.1.1 webpack.config.js

```js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    mode:'none',
    entry:{
        'zhufengmath':'./src/index.js',
        'zhufengmath.min':'./src/index.js'
    },
    optimization:{
        minimize:true,
        minimizer:[
            //可以支持es6,默认的使用TerserPlugin
            new TerserPlugin({
                include:/\.min\.js/
            })
        ]
    },
    output:{
        filename:'[name].js',
        library:'zhufengmath',//配置导出库的名称
        libraryExport:'default',
        libraryTarget:'umd'//配置以何种方式导出库,是字符串的枚举类型
    }
};
```

#### 29.1.2 package.json

```diff
 "scripts": {
+    "build": "webpack",
```

#### 29.1.3 index.js

```js
//zhufengnodejs zhufengjiagou
if(process.env.NODE_ENV == 'production'){
    module.exports = require('./dist/zhufengmath.min.js');
}else{
    module.exports = require('./dist/zhufengmath.js');
}
```

#### 29.1.4 src\index.js

```js
export function add(a,b){
  return a+b;
}
export function minus(a,b){
  return a-b;
}
export function multiply(a,b){
  return a*b;
}
export function divide(a,b){
  return a/b;
}
export default {
  add,minus,multiply,divide
}
```

### 29.2 git规范和changelog

#### 29.2.1 良好的git commit好处

- 可以加快code review 的流程
- 可以根据git commit 的元数据生成changelog
- 可以让其它开发者知道修改的原因

#### 29.2.2 良好的commit

- [commitizen](https://www.npmjs.com/package/commitizen)
- [validate-commit-msg](https://www.npmjs.com/package/validate-commit-msg)
- [conventional-changelog-cli](https://www.npmjs.com/package/conventional-changelog-cli)
- [commit_message_change_log](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
- 统一团队的git commit 标准
- 可以使用angular的git commit日志作为基本规范
  - 提交的类型限制为 feat、fix、docs、style、refactor、perf、test、chore、revert等
  - 提交信息分为两部分，标题(首字母不大写，末尾不要加标点)、主体内容(描述修改内容)
- 日志提交友好的类型选择提示 使用commitize工具
- 不符合要求格式的日志拒绝提交 的保障机制
  - 需要使用validate-commit-msg工具
- 统一changelog文档信息生成
  - 使用conventional-changelog-cli工具

```js
cnpm i commitizen  validate-commit-msg conventional-changelog-cli -S
commitizen init cz-conventional-changelog --save --save-exact
git cz
```

#### 29.2.3 提交的格式

```js
<type>(<scope>):<subject/>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

- 代表某次提交的类型，比如是修复bug还是增加feature
- 表示作用域，比如一个页面或一个组件
- 主题 ，概述本次提交的内容
- 详细的影响内容
- 修复的bug和issue链接

| 类型     | 含义                                                 |
| :------- | :--------------------------------------------------- |
| feat     | 新增feature                                          |
| fix      | 修复bug                                              |
| docs     | 仅仅修改了文档，比如README、CHANGELOG、CONTRIBUTE等  |
| style    | 仅仅修改了空格、格式缩进、偏好等信息，不改变代码逻辑 |
| refactor | 代码重构，没有新增功能或修复bug                      |
| perf     | 优化相关，提升了性能和体验                           |
| test     | 测试用例，包括单元测试和集成测试                     |
| chore    | 改变构建流程，或者添加了依赖库和工具                 |
| revert   | 回滚到上一个版本                                     |
| ci       | CI 配置，脚本文件等更新                              |

#### 29.2.4 precommit钩子

```js
cnpm i husky validate-commit-msg conventional-changelog-cli --save-dev
"scripts": {
    "commitmsg": "validate-commit-msg",
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
}
```

##### 29.2.4.1 conventional-changelog-cli

- `conventional-changelog-cli` 默认推荐的 commit 标准是来自angular项目

```js
$ conventional-changelog -p angular -i CHANGELOG.md -s
```

- 参数`-i CHANGELOG.md`表示从 `CHANGELOG.md` 读取 `changelog`
- 参数 -s 表示读写 `changelog` 为同一文件
- 这条命令产生的 changelog 是基于上次 tag 版本之后的变更（Feature、Fix、Breaking Changes等等）所产生的

如果你想生成之前所有 commit 信息产生的 changelog 则需要使用这条命令

```js
conventional-changelog -p angular -i CHANGELOG.md -s -r 0
```

- 其中 -r 表示生成 changelog 所需要使用的 release 版本数量，默认为1，全部则是0。

### 29.3 semver版本规范

- 可以避免循环依赖并减少依赖冲突
- 开源项目的版本号通常由三位组件，比如`x.y.z`

#### 29.3.1 版本号说明

- 主版本号`x`： 重大升级，做了不兼容的API修改
- 次版本号`y`： 做了向下的兼容的功能新增
- 修订号`z`: 做了向下兼容和问题修复
- 版本是严格递增的，比如1.1.1 -> 1.1.2 -> 1.2.1

#### 29.3.2 先行版本

- 在发布重要版本的时候，可以先发布alpha,rc等先行版本
- 格式是在修订版本后面加上一个连接号(-),再加上一连串以(.)分割的标识符，标识符可以由英文、数字和连接号([0-9A-Za-z-])组成
  - alpha: 是内部测试版，一般不向外发表，会有比较多的Bug,只给测试人员用
  - bate: 也是测试版，这个阶段版本会增加新的功能，在Alpha之后推出
  - rc(Release Candidate) 候选版本，这个阶段不会再加入新的功能，主要是用于解决错误
- 15.0.0 -> 16.0.0-alpha.0 -> 16.0.0-alpha.1-> 16.0.0-bate.0 -> 16.0.0-bate.1-> 16.0.0-rc.1-> 16.0.0-rc.2

#### 29.3.3 升级版本

```js
npm version
npm version patch 升级补丁版本号
npm version minor 升级小版本号
npm version major 升级大版本号
```

#### 29.3.4 发布

```js
npm adduser
npm login
npm publish
```

### 29.4 使用

UMD=ES Module + CJS + AMD CDN

```js
<script src="zhufengmath.js"></script>
<script>
console.log(window.zhufengmath);
</script>
```

## 30. px 自动转成rem

- 使用px2rem-loader
- 页面渲染时计算根元素的`font-size`值
- [lib-flexible](https://github.com/amfe/lib-flexible)

### 30.1 安装

```js
cnpm i px2rem-loader lib-flexible -D
```

### 30.2 index.html

index.html

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>主页</title>
    <script>
      let docEle = document.documentElement;
      function setRemUnit () {
        //750/10=75   375/10=37.5
        docEle.style.fontSize = docEle.clientWidth / 10 + 'px';
      }
      setRemUnit();
      window.addEventListener('resize', setRemUnit);
    </script>
</head>
<body>
    <div id="root"></div>
</body>
```

### 30.3 reset.css

```css
*{
    padding: 0;
    margin: 0;
}
#root{
    width:375px;
    height:375px;
    border:1px solid red;
    box-sizing: border-box;
}
```

### 30.4 webpack.config.js

```diff
 {
        test:/\.css$/,//如果要require或import的文件是css的文件的话
        //从右向左处理CSS文件,loader是一个函数
        use:[{
                loader:MiniCssExtractPlugin.loader,
                options:{
                     publicPath: (resourcePath, context) => {
                        return '/';
                    }
                    //publicPath: '/'
                }
        },{
                    loader:'css-loader',
                    options:{
                        //Enables/Disables or setups number of loaders applied before CSS loader.
                        importLoaders:0
                    }
                },{
                    loader:'postcss-loader',
                    options:{
                        plugins:[
                            require('autoprefixer')
                        ]
                    }
                },{
+                    loader:'px2rem-loader',
+                    options:{
+                        remUnit:75,
+                        remPrecesion:8
+                    }
+                }]
+            },
```

## 31. 内联资源

- 可以在页面框架加载时进行初始化
- 可以上报打点数据
- CSS的内联可以避免页面闪动
- 可以减少HTTP网络请求的数量

### 31.1 webpack.config.js

```js
const path = require('path');
const HtmlWebpackPlugin  = require("html-webpack-plugin");
module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins:[
        new HtmlWebpackPlugin({
            title: "实现 Html、JavaScript、CSS 内联",
            template:"./src/index.html",//指定首页模板
        }),
    ]
};
```

### 31.2 安装raw-loader

```js
cnpm install raw-loader --save-dev
```

### 31.3 内联

```js
<!--  内联html  -->
${require("raw-loader!./inline.html").default}
<!--  内联js  -->
<script>
${require("raw-loader!./inline.js").default}
</script>
<!--  内联css  -->
<style>
${require("!!raw-loader!./inline.css").default}
</style>
```

## 32.参考

### 32.1 参考文档

- [webpack-start](https://gitee.com/zhufengpeixun/webpack-start/commits/master)
- [resolve](https://webpack.docschina.org/configuration/resolve/)

### 32.2 常用loader列表

- webpack 可以使用 loader 来预处理文件。这允许你打包除 JavaScript 之外的任何静态资源。你可以使用 Node.js 来很简单地编写自己的 loader。
- [awesome-loaders](https://github.com/webpack-contrib/awesome-webpack#loaders)

#### 32.3 文件

- raw-loader 加载文件原始内容（utf-8）
- val-loader 将代码作为模块执行，并将 exports 转为 JS 代码
- url-loader 像 file loader 一样工作，但如果文件小于限制，可以返回 data URL
- file-loader 将文件发送到输出文件夹，并返回（相对）URL

#### 32.4 JSON

- json-loader 加载 JSON 文件（默认包含）
- json5-loader 加载和转译 JSON 5 文件
- cson-loader 加载和转译 CSON 文件

#### 32.4 转换编译(Transpiling)

- script-loader 在全局上下文中执行一次 JavaScript 文件（如在 script 标签），不需要解析
- babel-loader 加载 ES2015+ 代码，然后使用 Babel 转译为 ES5
- buble-loader 使用 Bublé 加载 ES2015+ 代码，并且将代码转译为 ES5
- traceur-loader 加载 ES2015+ 代码，然后使用 Traceur 转译为 ES5
- ts-loader 或 awesome-typescript-loader 像 JavaScript 一样加载 TypeScript 2.0+
- coffee-loader 像 JavaScript 一样加载 CoffeeScript

#### 32.5 模板(Templating)

- html-loader 导出 HTML 为字符串，需要引用静态资源
- pug-loader 加载 Pug 模板并返回一个函数
- jade-loader 加载 Jade 模板并返回一个函数
- markdown-loader 将 Markdown 转译为 HTML
- react-markdown-loader 使用 markdown-parse parser(解析器) 将 Markdown 编译为 React 组件
- posthtml-loader 使用 PostHTML 加载并转换 HTML 文件
- handlebars-loader 将 Handlebars 转移为 HTML
- markup-inline-loader 将内联的 SVG/MathML 文件转换为 HTML。在应用于图标字体，或将 CSS 动画应用于 SVG 时非常有用

#### 32.6 样式

- style-loader 将模块的导出作为样式添加到 DOM 中
- css-loader 解析 CSS 文件后，使用 import 加载，并且返回 CSS 代码
- less-loader 加载和转译 LESS 文件
- sass-loader 加载和转译 SASS/SCSS 文件
- postcss-loader 使用 PostCSS 加载和转译 CSS/SSS 文件
- stylus-loader 加载和转译 Stylus 文件

#### 32.7 清理和测试(Linting && Testing)

- mocha-loader 使用 mocha 测试（浏览器/NodeJS）
- eslint-loader PreLoader，使用 ESLint 清理代码
- jshint-loader PreLoader，使用 JSHint 清理代码
- jscs-loader PreLoader，使用 JSCS 检查代码样式
- coverjs-loader PreLoader，使用 CoverJS 确定测试覆盖率

#### 32.8 框架(Frameworks)

- vue-loader 加载和转译 Vue 组件
- polymer-loader 使用选择预处理器(preprocessor)处理，并且 require() 类似一等模块(first-class)的 Web 组件
- angular2-template-loader 加载和转译 Angular 组件

# webpack-2-optimize

## 1. purgecss-webpack-plugin

- [purgecss](https://www.purgecss.com/)
- 可以去除未使用的 css，一般与 glob、glob-all 配合使用
- 必须和`mini-css-extract-plugin`配合使用
- `paths`路径是绝对路径

```js
npm i -D purgecss-webpack-plugin mini-css-extract-plugin glob
```

webpack.config.js

```diff
+ const glob = require('glob');
+ const PurgecssPlugin = require('purgecss-webpack-plugin');

module.exports = {
  mode: 'development',
  plugins: [
+    new PurgecssPlugin({
+      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`
+    }),
  ],
}
plugins: [
+        new MiniCssExtractPlugin({
+            filename: '[name].css',
+            chunkFilename:'[id].css'
+        }),

{
                test: /\.css/,
                include: path.resolve(__dirname,'src'),
                exclude: /node_modules/,
                use: [{
+                    loader: MiniCssExtractPlugin.loader
                },'css-loader']
            }
```

## 2.DLL

- `.dll`为后缀的文件称为动态链接库，在一个动态链接库中可以包含给其他模块调用的函数和数据
- 把基础模块独立出来打包到单独的动态连接库里
- 当需要导入的模块在动态连接库里的时候，模块不能再次被打包，而是去动态连接库里获取
- [dll-plugin](https://webpack.js.org/plugins/dll-plugin/)

### 2.1 定义Dll

- DllPlugin插件： 用于打包出一个个动态连接库
- DllReferencePlugin: 在配置文件中引入DllPlugin插件打包好的动态连接库

```js
const path=require('path');
const DllPlugin=require('webpack/lib/DllPlugin');
module.exports={
    entry: {
        react:['react','react-dom']
    },// 把 React 相关模块的放到一个单独的动态链接库
    output: {
        path: path.resolve(__dirname,'dist'),// 输出的文件都放到 dist 目录下
        filename: '[name].dll.js',//输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称
        library: '_dll_[name]',//存放动态链接库的全局变量名称,例如对应 react 来说就是 _dll_react
    },
    plugins: [
        new DllPlugin({
            // 动态链接库的全局变量名称，需要和 output.library 中保持一致
            // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
            // 例如 react.manifest.json 中就有 "name": "_dll_react"
            name: '_dll_[name]',
            // 描述动态链接库的 manifest.json 文件输出时的文件名称
            path: path.join(__dirname, 'dist', '[name].manifest.json')
        })
    ]
}
webpack --config webpack.dll.config.js --mode development
```

### 2.2 使用动态链接库文件

```js
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')
plugins: [
  new DllReferencePlugin({
    manifest:require('./dist/react.manifest.json')
  })
]
webpack --config webpack.config.js --mode development
```

### 2.3 html中使用

```html
<script src="react.dll.js"></script>
<script src="bundle.js"></script>
```

## 3. 多进程处理

### 3.1 thread-loader

- 把这个 loader 放置在其他 loader 之前， 放置在这个 loader 之后的 loader 就会在一个单独的 worker 池(worker pool)中运行
- [thread-loader](https://webpack.js.org/loaders/thread-loader/)

```js
{
        test: /\.(js)$/,
        use: [
           {
            loader:'thread-loader',
            options:{
              workers:3
            }
          }, 
          {
            loader:'babel-loader'
          }
        ],
      }
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
    output: {
        path: path.resolve(__dirname, 'dist'),
+        filename: '[name]_[hash:8].js',
+        publicPath: 'http://img.zhufengpeixun.cn'
    },
```

## 5.Tree Shaking

- 一个模块可以有多个方法，只要其中某个方法使用到了，则整个文件都会被打到bundle里面去，tree shaking就是只把用到的方法打入bundle,没用到的方法会uglify阶段擦除掉
- 原理是利用es6模块的特点,只能作为模块顶层语句出现,import的模块名只能是字符串常量

### 5.1 开启

- webpack默认支持，在.babelrc里设置`module:false`即可在`production mode`下默认开启
- 还要注意把devtool设置为null

.babelrc

```diff
    "presets":[
+        ["@babel/preset-env",{"modules":false}],//转译 ES6 ES7
        "@babel/preset-react"//转译JSX语法
    ],
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

## 6.代码分割

### 6.1 代码分割的意义

- 对于大的Web应用来讲，将所有的代码都放在一个文件中显然是不够有效的，特别是当你的某些代码块是在某些特殊的时候才会被用到。
- webpack有一个功能就是将你的代码库分割成chunks语块，当代码运行到需要它们的时候再进行加载。 适用的场景
- 抽离相同代码到一个共享块
- 脚本懒加载，使得初始下载的代码更小

### 6.2 Entry Points

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

- 用户当前需要用什么功能就只加载这个功能对应的代码，也就是所谓的按需加载 在给单页应用做按需加载优化时，一般采用以下原则：
  - 对网站功能进行划分，每一类一个chunk
  - 对于首次打开页面需要的功能直接加载，尽快展示给用户,某些依赖大量代码的功能点可以按需加载
  - 被分割出去的代码需要一个按需加载的时机

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

```js
<button id="clickBtn">点我</button>
```

### 6.3 提取公共代码

### 6.1 为什么需要提取公共代码

大网站有多个页面，每个页面由于采用相同技术栈和样式代码，会包含很多公共代码，如果都包含进来会有问题

- 相同的资源被重复的加载，浪费用户的流量和服务器的成本；
- 每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。
- 如果能把公共代码抽离成单独文件进行加载能进行优化，可以减少网络传输流量，降低服务器成本

### 6.2 如何提取

- 基础类库，方便长期缓存
- 页面之间的公用代码
- 各个页面单独生成文件
- [文档](https://www.webpackjs.com/plugins/split-chunks-plugin/)
- [common-chunk-and-vendor-chunk](https://github.com/webpack/webpack/tree/master/examples/common-chunk-and-vendor-chunk)
- webpack将会基于以下条件自动分割代码块:
  - 新的代码块被共享或者来自node_modules文件夹
  - 新的代码块大于30kb(在min+giz之前)
  - 按需加载代码块的请求数量应该<=5
  - 页面初始化时加载代码块的请求数量应该<=3

默认配置

```js
optimization: {
        splitChunks: {
            chunks: "all",//默认作用于异步chunk，值为all/initial/async
            minSize: 30000,  //默认值是30kb,代码块的最小尺寸
            minChunks: 1,  //被多少模块共享,在分割之前模块的被引用次数
            maxAsyncRequests: 5,  //按需加载最大并行请求数量
            maxInitialRequests: 3,  //一个入口的最大并行请求数量
            name: true,  //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔开，如vendor~
            automaticNameDelimiter: '~',//默认webpack将会使用入口名和代码块的名称生成命名,比如 'vendors~main.js'
            cacheGroups: { //设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
                vendors: {
                    chunks: "initial",
                    test: /node_modules/,//条件
                    priority: -10 ///优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中,为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
                },
                commons: {
                    chunks: "initial",
                    minSize: 0,//最小提取字节数
                    minChunks: 2, //最少被几个chunk引用
                    priority: -20,
                    reuseExistingChunk: true//    如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
                }
            }
        },
}
```

### 6.3 提取公共代码

pageA.js

```js
import utils1 from './utils1';
import utils2 from './utils2';
import $ from 'jquery';
console.log(utils1,utils2,$);
```

pageB.js

```js
import utils1 from './utils1';
import utils2 from './utils2';
import $ from 'jquery';
console.log(utils1,utils2,$);;
```

pageC.js

```js
import utils3 from './utils3';
import utils1 from './utils1';
import $ from 'jquery';
console.log(utils1,utils3,$);
```

utils1.js

```js

```

utils2.js

```js

```

utils3.js

```js

```

webpack.config.js

```js
    entry: {
        pageA: './src/pageA',
        pageB: './src/pageB',
        pageC: './src/pageC'
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: '[name].js'
    },
  plugins:[
       new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'pageA.html',
            excludeChunks: ['pageB','pageC']
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'pageB.html',
            excludeChunks: ['pageA','pageC']
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'pageC.html',
            excludeChunks: ['pageA','pageB']
        })
    ]
```

![splitchunks](http://img.zhufengpeixun.cn/splitchunks.png)

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

### 7.1 开发环境插件配置

```js
module.exports = {
  resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main']
  },
  plugins: [
    // 开启 Scope Hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};
```

### 7.2 代码

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

## 8. 用 HMR 提高开发效率

- HMR 全称是 Hot Module Replacement，即模块热替换
- Hot Reloading，当代码变更时通知浏览器刷新页面，以避免频繁手动刷新浏览器页面
- HMR 可以理解为增强版的 Hot Reloading，但不用整个页面刷新，而是局部替换掉部分模块代码并且使其生效
- 原理是当一个源码发生变化时，只重新编译发生变化的模块，再用新输出的模块替换掉浏览器中对应的老模块
- 模块热替换技术的优势有：
  - 实时预览反应更快，等待时间更短。
  - 不刷新浏览器能保留当前网页的运行状态，例如在使用 Redux 来管理数据的应用中搭配模块热替换能做到代码更新时Redux 中的数据还保持不变

### 8.1 模块热替换原理

- 模块热替换的原理和自动刷新原理类似，都需要往要开发的网页中注入一个代理客户端用于连接 DevServer 和网页

![hotupdate](http://img.zhufengpeixun.cn/webpackhmr.png)

### 8.2 配置

#### 8.2.1 配置hot

- DevServer 默认不会开启模块热替换模式，要开启该模式，只需在启动时带上参数

   

  ```
  --hot
  ```

  ```js
  const webpack = require('webpack');
  module.exports = {
  entry:{
    main:'./src/index.js',
  },
  plugins: [
    // 该插件的作用就是实现模块热替换，实际上当启动时带上 `--hot` 参数，会注入该插件，生成 .hot-update.json 文件。
    new webpack.NamedModulesPlugin(), // 用于启动 HMR 时可以显示模块的相对路径
    new webpack.HotModuleReplacementPlugin(), // Hot Module Replacement 的插件
  ],
  devServer:{
    // 告诉 DevServer 要开启模块热替换模式
    hot: true,      
  }  
  };
  ```

  > 在启动 Webpack 时带上参数 --hot 其实就是自动为你完成以上配置。

#### 8.2.2 代码实现

```js
import React from 'react';
import { render } from 'react-dom';
import App from './App';
import './index.css';
render(<App/>, document.getElementById('root'));

// 只有当开启了模块热替换时 module.hot 才存在
if (module.hot) {
  // accept 函数的第一个参数指出当前文件接受哪些子模块的替换，这里表示只接受 ./AppComponent 这个子模块
  // 第2个参数用于在新的子模块加载完毕后需要执行的逻辑
  module.hot.accept(['./App'], () => {
    // 新的 AppComponent 加载成功后重新执行下组建渲染逻辑
    let App=require('./App').default;  
    render(<App/>, document.getElementById('root'));
  });
}
```

- module.hot 是当开启模块热替换后注入到全局的 API，用于控制模块热替换的逻辑
- 当子模块发生更新时，更新事件会一层层往上传递，也就是从`App.js`文件传递到`index.js`文件， 直到有某层的文件接受了当前变化的模块
- 如果事件一直往上抛到最外层都没有文件接受它，就会直接刷新网页
- `.css`文件都会触发模块热替换的原因是`style-loader`会注入用于接受 CSS 的代码



