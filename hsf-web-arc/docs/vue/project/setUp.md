---
title: vue项目搭建
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

## 一.vue-cli项目创建

​	官方的脚手架教程： https://cli.vuejs.org/zh/

​			node-sass和dart-sass的对比node-sass是自动编译实时的，dart-sass需要保存后才会生效。如果您在Dart-VM内运行Dart-Sass，它的运行速度很快，但它表示可以编译为纯JS，`dart-sass`只是一个编译版本，比`node-sass和``native dart-sass慢`。个人使用感受：在大型项目中 使用`dart-sass`比 `node-sass`（`js`本机`C`库的包装）要慢于很多 ；

Vue + TS搭建开发环境使用官网的vue-cli进行项目的创建https://cli.vuejs.org/zh/guide/creating-a-project.html项目的创建的时候的配置选择；

```bash
vue create hello-world // 创建项目
 ​
 // 选择自定义配置
   default (babel, eslint)
 > Manually select features
 ​
 // 结合当前环境选择自己需要的配置
  (*) Babel
  (*) TypeScript // JavaScript的一个超集（添加了可选的静态类型和基于类的面向对象编程：类型批注和编译时类型检查、类、接口、模块、lambda 函数）
  ( ) Progressive Web App (PWA) Support // 渐进式Web应用程序
  (*) Router // vue-router（vue路由）
  (*) Vuex  // vuex（vue的状态管理模式）
  (*) CSS Pre-processors  // CSS 预处理器（如：less、sass）
 >(*) Linter / Formatter // 代码风格检查和格式化（如：ESlint）
  ( ) Unit Testing    // 单元测试（unit tests）
  ( ) E2E Testing     // e2e（end to end） 测试
 ​
 // 选择自己的配置（一路 Y 就行）
 ? Use class-style component syntax? Yes // 检测组件样式的语法
 ​
 // 对TS，以及一些ES6以上的语法和api进行降低，和垫片处理
 ? Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)? Yes
 ​
 /**
     路由选择：
 首先会让你选择是否使用history router：Vue-Router 利用了浏览器自身的hash 模式和 history 模式的特性来实现前端路由（通过调用浏览器提供的接口）
 hash： 浏览器url址栏 中的 # 符号（如这个 URL：http://www.abc.com/#/hello，hash 的值为“ #/hello”），hash 不被包括在 HTTP 请求中（对后端完全没有影响），因此改变 hash 不会重新加载页面
 history：利用了 HTML5 History Interface 中新增的 pushState() 和 replaceState() 方法（需要特定浏览器支持）
 */ 
 ? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
 ​
 /**
 CSS 选自己熟悉的预编译语言
 Sass安装需要Ruby环境，是在服务端处理的，SCSS 是 Sass3新语法（完全兼容 CSS3且继承Sass功能）
   LESS       
 Less最终会通过编译处理输出css到浏览器，Less 既可以在客户端上运行，也可在服务端运行 (借助 Node.js)
   Stylus     
 Stylus主要用来给Node项目进行CSS预处理支持，Stylus功能上更为强壮，和js联系更加紧密，可创建健壮的、动态的的CSS。
 */ 
 ? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): Less
  Sass/SCSS (with dart-sass)
 /**
 node-sass 是用 node(调用 cpp 编写的 libsass)来编译 sass；
 dart-sass 是用 drat VM 来编译 sass；
 node-sass是自动编译实时的，dart-sass需要保存后才会生效
 推荐 dart-sass 性能更好（也是 sass 官方使用的），而且 node-sass 因为国情问题经常装不上
 */
  Sass/SCSS (with node-sass)
  Less
  Stylus  
 ​
 // lint 自选
 ? Pick a linter / formatter config: (Use arrow keys)
 > ESLint with error prevention only  //只有错误预防
   ESLint + Airbnb config   //Airbnb 配置
   ESLint + Standard config  //标准配置
   ESLint + Prettier         //使用较多  (漂亮的配置)
 ​
 // lint触发时机，建议两个都选
 ? Pick additional lint features:
  (*) Lint on save  // 保存就检测
 >(*) Lint and fix on commit // fix和commit时候检查
   
 // 单元测试 ：
   ? Pick a unit testing solution: (Use arrow keys)
 > Mocha + Chai  //mocha灵活,只提供简单的测试结构，如果需要其他功能需要添加其他库/插件完成。必须在全局环境中安装
   Jest          //安装配置简单，容易上手。内置Istanbul，可以查看到测试覆盖率，相较于Mocha:配置简洁、测试代码简洁、易于和babel集成、内置丰富的expect
 ​
 // 最好选择在单独文件添加配置，在package.json中css编译会出问题
 ? Where do you prefer placing config for Babel, ESLint, etc.? (Use arrow keys)
 > In dedicated config files // 独立文件放置
   In package.json  // 放package.json里
 ​
 // 可以保存一下自己的默认配置。以后可以直接使用
 ? Save this as a preset for future projects? (y/N) y
 // y:记录本次配置，然后需要你起个名; n：不记录本次配置
```

##### 项目结构

```bash
// 生成的项目结构，然后在项目的根目录新加两个文件 vue.config.js和.env.uat
 hello-word
 |--public/
 |--src
     |--assets/
     |--components/
     |--router/
     |--store/
     |--views/
     |--App.vue
     |--main.ts
     |--shims-tsx.d.ts
     |--shims-vue.d.ts
 |--browserslistrc
 |--.env.uat // 添加环境配置文件
 |--eslintrc.js
 |--gitignore
 |--babel.config.js
 |--package.json
 |--package-lock.json
 |--README.md
 |--tsconfig.json
 |--vue.config.js // 添加配置文件，本地代理、打包路径，webpack相关等
```

##### tsconfig.json 文件中指定了用来编译这个项目的根文件和编译选项。

```json
{
     // 编译选项
   "compilerOptions": {
     // 编译输出目标 ES 版本
     "target": "esnext",
     // 采用的模块系统
     "module": "esnext",
     // 以严格模式解析
     "strict": true,
     "jsx": "preserve",
     // 从 tslib 导入外部帮助库: 比如__extends，__rest等
     "importHelpers": true,
     // 如何处理模块
     "moduleResolution": "node",
     // 启用装饰器
     "experimentalDecorators": true,
     "esModuleInterop": true,
     // 允许从没有设置默认导出的模块中默认导入
     "allowSyntheticDefaultImports": true,
     // 定义一个变量就必须给它一个初始值
     "strictPropertyInitialization" : false,
     // 允许编译javascript文件
     "allowJs": true,
     // 是否包含可以用于 debug 的 sourceMap
     "sourceMap": true,
     // 忽略 this 的类型检查, Raise error on this expressions with an implied any type.
     "noImplicitThis": false,
     // 解析非相对模块名的基准目录 
     "baseUrl": ".",
     // 给错误和消息设置样式，使用颜色和上下文。
     "pretty": true,
     // 设置引入的定义文件
     "types": ["webpack-env", "mocha", "chai"],
     // 指定特殊模块的路径
     "paths": {
       "@/*": ["src/*"]
     },
     // 编译过程中需要引入的库文件的列表
     "lib": ["esnext", "dom", "dom.iterable", "scripthost"]
   },
   // ts 管理的文件
   "include": [
     "src/**/*.ts",
     "src/**/*.tsx",
     "src/**/*.vue",
     "tests/**/*.ts",
     "tests/**/*.tsx"
   ],
   // ts 排除的文件
   "exclude": ["node_modules"]
 }
```

##### vue.config.js:

```javascript
 const path = require("path");
 const sourceMap = process.env.NODE_ENV === "development";
  
 module.exports = {
   // 基本路径
   publicPath: "./",
   // 输出文件目录
   outputDir: "dist",
   // eslint-loader 是否在保存的时候检查
   lintOnSave: false,
   // webpack配置
   // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
   chainWebpack: () => {},
   configureWebpack: config => {
     if (process.env.NODE_ENV === "production") {
       // 为生产环境修改配置...
       config.mode = "production";
     } else {
       // 为开发环境修改配置...
       config.mode = "development";
     }
  
     Object.assign(config, {
       // 开发生产共同配置
       resolve: {
         extensions: [".js", ".vue", ".json", ".ts", ".tsx"],
         alias: {
           vue$: "vue/dist/vue.js",
           "@": path.resolve(__dirname, "./src")
         }
       }
     });
   },
   // 生产环境是否生成 sourceMap 文件
   productionSourceMap: sourceMap,
   // css相关配置
   css: {
     // 是否使用css分离插件 ExtractTextPlugin
     extract: true,
     // 开启 CSS source maps?
     sourceMap: false,
     // css预设器配置项
     loaderOptions: {},
     // 启用 CSS modules for all css / pre-processor files.
     modules: false
   },
   // use thread-loader for babel & TS in production build
   // enabled by default if the machine has more than 1 cores
   parallel: require("os").cpus().length > 1,
   // PWA 插件相关配置
   // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
   pwa: {},
   // webpack-dev-server 相关配置
   devServer: {
     open: process.platform === "darwin",
     host: "localhost",
     port: 3001, //8080,
     https: false,
     hotOnly: false,
     proxy: {
       // 设置代理
       // proxy all requests starting with /api to jsonplaceholder
       "/api": {
         // target: "https://emm.cmccbigdata.com:8443/",
         target: "http://localhost:3000/",
         // target: "http://47.106.136.114/",
         changeOrigin: true,
         ws: true,
         pathRewrite: {
           "^/api": ""
         }
       }
     },
     before: app => {}
   },
   // 第三方插件配置
   pluginOptions: {
     // ...
   }
 };

```
