---
title: webpack分析（三）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# 5.webpack-flow

## 1.调试 webpack

### 1.1 通过chrome调试

```js
node --inspect-brk ./node_modules/webpack-cli/bin/cli.js
```

### 1.2 通过执行命令调试

- 打开工程目录，点击调试按钮，再点击小齿轮的配置按钮系统就会生成 `launch.json` 配置文件
- 修改好了以后直接点击 F5 就可以启动调试

.vscode\launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "debug webpack",
      "cwd": "${workspaceFolder}",
      "program": "${workspaceFolder}/node_modules/webpack-cli/bin/cli.js"
    }
  ]
}
```

### 1.3 debugger.js

```js
const webpack = require("webpack");
const webpackOptions = require("./webpack.config");
const compiler = webpack(webpackOptions);
//4.执行对象的run方法开始执行编译
compiler.run((err, stats) => {
    console.log(err);
    console.log(stats.toJson(
        {
            assets: true,
            chunks: true,
            modules: true,
            entries: true,
        }
    ));
});
```

### 1.4 调试webpack-cli源码

```js
git clone https://github.com/webpack/webpack.git
git reset --hard vx.x.x
yarn 
yarn link

git clone https://github.com/webpack/webpack-cli.git
git reset --hard webpack-cli@x.x.x
cd packages\webpack-cli
yarn link webpack
yarn link
yarn link webpack
yarn link webpack-cli

yarn unlink webpack
yarn unlink webpack-cli
```

## 2. tapable.js

- tapable 是一个类似于 Node.js 中的 EventEmitter的库，但更专注于自定义事件的触发和处理
- webpack 通过 tapable 将实现与流程解耦，所有具体实现通过插件的形式存在

```js
class SyncHook {
    constructor() {
        this.taps = []
    }
    tap(name, fn) {
        this.taps.push(fn);
    }
    call() {
        this.taps.forEach(tap => tap());
    }
}

let hook = new SyncHook();
hook.tap('some name',()=>{
    console.log("some name");
});


class Plugin {
    apply() {
        hook.tap('Plugin', () => {
            console.log('Plugin ');
        });
    }
}
new Plugin().apply();
hook.call();
```

## 3. webpack 编译流程

1. 初始化参数：从配置文件和Shell语句中读取并合并参数,得出最终的配置对象
2. 用上一步得到的参数初始化Compiler对象
3. 加载所有配置的插件
4. 执行对象的run方法开始执行编译
5. 根据配置中的`entry`找出入口文件
6. 从入口文件出发,调用所有配置的`Loader`对模块进行编译
7. 再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
8. 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
9. 再把每个Chunk转换成一个单独的文件加入到输出列表
10. 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

> 在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果

![2020webpackflow](http://img.zhufengpeixun.cn/webpackflow2020.jpg)

### 3.1 plugins\run-plugin.js

plugins\run-plugin.js

```js
class RunPlugin{
    constructor(options){
        this.options = options;
    }
    //每个插件定死了有一个apply方法
    apply(compiler){
        //监听感兴趣的钩子
        compiler.hooks.run.tap('RunPlugin',()=>{
            console.log('RUN~~~~~~~~~~~~~~~~~~~');
        });
    }
}
module.exports = RunPlugin;
```

### 3.2 plugins\done-plugin.js

plugins\done-plugin.js

```js
class DonePlugin{
    constructor(options){
        this.options = options;
    }
    //每个插件定死了有一个apply方法
    apply(compiler){
        //监听感兴趣的钩子 注册监听函数
        compiler.hooks.done.tap('DonePlugin',()=>{
            console.log('DONE~~~~~~~~~~~~~~~~~~~');
        });
    }
}
module.exports = DonePlugin;
```

### 3.3 readme-plugin.js

plugins\readme-plugin.js

```js
class ReadmePlugin{
    constructor(options){
        this.options = options;
    }
    //每个插件定死了有一个apply方法
    apply(compiler){
        //监听感兴趣的钩子 注册监听函数
        compiler.hooks.emit.tap('ReadmePlugin',()=>{
            //让你在可以在插件改变输出的结果
            compiler.assets['README.md']="读我";
        });
    }
}
module.exports = ReadmePlugin;
```

### 3.4 logger1-loader.js

loaders\logger1-loader.js

```js
function loader(source){
    console.log('logger1-loader');
    return source+'//1';
}
module.exports = loader;
```

### 3.5 logger5-loader.js

loaders\logger5-loader.js

```js
function loader(source){
    console.log('logger5-loader');
    return source+'//5';
}
module.exports = loader;
```

### 3.6 webpack.config.js

```js
const path = require('path');
const RunPlugin = require('./plugins/run-plugin')
const DonePlugin = require('./plugins/done-plugin')
const READMEPlugin = require('./plugins/readme-plugin')
module.exports = {
    mode:'development',
    devtool:'inline-source-map',
    //C:\aproject\zhufengwebpack202011\5.flow
    context:process.cwd(),//根目录 current working directory
    entry:{
        page1:'./src/page1.js',
        page2:'./src/page2.js'
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'[name].js'
    },
    resolve:{
        extensions:['.js','.jsx','.json']
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:[
                    path.resolve(__dirname,'loaders','logger1-loader.js'),
                    path.resolve(__dirname,'loaders','logger2-loader.js'),
                ]
            }
        ]
    },
    plugins:[
        new Run1Plugin(),
        new DonePlugin(),  
        new READMEPlugin()
    ]
}
```

### 3.7 debugger.js

```diff
+const webpack = require("./webpack");
const webpackOptions = require("./webpack.config");
const compiler = webpack(webpackOptions);
//4.执行对象的run方法开始执行编译
compiler.run((err, stats) => {
    console.log(err);
    console.log(stats.toJson(
        {
            assets: true,
            chunks: true,
            modules: true,
            entries: true,
        }
    ));
});
```

### 3.8 webpack\index.js

webpack\index.js

```js
let Compiler = require('./Compiler');
/**
 * process.argv 命令行参数
 * @param {*} options 
 */
function webpack(options){
  //1.初始化参数：从配置文件和Shell语句中读取并合并参数,得出最终的配置对象
  //console.log(process.argv);
  //shell命令行参数对象 
  let shellConfig = process.argv.slice(2).reduce((shellConfig,item)=>{
    let [key,value]= item.split('=');//item='--mode=development',
    shellConfig[key.slice(2)]=value;
    return  shellConfig;
  },{});
  let finalOptions = {...options,...shellConfig};//得出最终的配置对象
  //2.用上一步得到的参数初始化Compiler对象
  let compiler = new Compiler(finalOptions);
  //3.加载所有配置的插件
  //finalOptions.plugins.forEach();
  if(finalOptions.plugins&&Array.isArray(finalOptions.plugins)){
     for(let plugin of finalOptions.plugins){
       //刚开始的时候，就会执行所有的插件实例的apply方法，并传递compiler实例
       //所以说插件是在webpack开始编译之前全部挂载的
       //但是要到插件关注的钩子触发的时候才会执行
        plugin.apply(compiler);
     }
  }
  return compiler;
}
module.exports = webpack;
```

### 3.9 webpack\Compiler.js

webpack\Compiler.js

```js
let {SyncHook} = require('tapable');
const path = require('path');
const fs = require('fs');
const types = require('babel-types');
const parser = require('@babel/parser');//源代码转成AST抽象语法树
const traverse = require('@babel/traverse').default;//遍历语法树
const generator = require('@babel/generator').default;//把语法树重新生成代码
//path.posix.sep / path.sep不同操作系统的路径分隔符 \/
function toUnixPath(filePath){
  return filePath.replace(/\\/g,'/');
}
//根目录，当前工作目录
let baseDir  = toUnixPath(process.cwd());
class Compiler{
    constructor(options){
        this.options = options;
        this.hooks = {
            run:new SyncHook(),//会在开始编译的时候触发
            emit:new SyncHook(),//会在将要写入文件的时候触发
            done:new SyncHook()//会在完成编译的时候触发
        }
        this.entries = new Set();//这个数组存放着所有的入口
        this.modules = new Set();//这里存放着所有的模块
        this.chunks = new Set();//webpack5 this.chunks = new Set();
        this.assets = {};//输出列表 存放着将要产出的资源文件
        this.files = new Set();//表示本次编译的所有产出的文件名
    }
    //4.执行对象的run方法开始执行编译
    run(callback){
       //当调用run方法的时候会触发run这个钩子, 进而执行它的回调函调 
       this.hooks.run.call(); 
       //5.根据配置中的entry找出入口文件,得到entry的绝对路径
       //C:\aproject\zhufengwebpack202011\5.flow\src\index.js
       //打包后的文件，所有的路径都是\ => /
       let entry = {};
       if(typeof this.options.entry === 'string'){
          entry.main=this.options.entry;
       }else{
         entry=this.options.entry;
       }
       for(let entryName in entry){
        let entryFilePath =toUnixPath(path.join(this.options.context,entry[entryName]));
        //6.从入口文件出发,调用所有配置的Loader对模块进行编译
        let entryModule =  this.buildModule(entryName,entryFilePath);
        //this.modules.add(entryModule);
        //7.根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
        let chunk = {name:entryName,entryModule,modules:this.modules.filter(module=>module.name===entryName)}; 
        this.chunks.add(chunk);
        this.entries.add(chunk);//也是入口代码块
       }

       //8.再把每个Chunk转换成一个单独的文件加入到输出列表
       //一个 chunk会成为this.assets对象的一个key value
       //一个chunk对应this.assets的一个属性，而每个assets属性会对应一个文件file
      /*  this.chunks.forEach(chunk=>{
        //key文件名 值是打包后的内容
        let filename = this.options.output.filename.replace('[name]',chunk.name);   
        let targetPath = path.join(this.options.output.path,filename);//page1.js page2.js
        fs.writeFileSync(targetPath,getSource(chunk));
      }); */

       this.chunks.forEach(chunk=>{
           //key文件名 值是打包后的内容
         let filename = this.options.output.filename.replace('[name]',chunk.name);   
         this.assets[filename]=getSource(chunk);
       });
       this.hooks.emit.call();    
       //8.在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
       this.files = Object.keys(this.assets);//['main.js']
       //存放本次编译输出的目标文件路径
       for(let file in this.assets){
          let targetPath = path.join(this.options.output.path,file);//page1.js page2.js
          fs.writeFileSync(targetPath,this.assets[file]);
       }
       this.hooks.done.call();    
       callback(null,{//此对象stats 统计信息，表示本次编译结果的描述信息对象
        toJson:()=>{
           return {
            entries:this.entries,
            chunks:this.chunks,
            modules:this.modules,
            files:this.files,
            assets:this.assets
           }
         }
       });
    }
    /**
     * 编译模块 1.读取模块文件
     * @param {*} modulePath 
     */
    buildModule=(name,modulePath)=>{
        //读取原始源代码
        let sourceCode = fs.readFileSync(modulePath,'utf8');
        //查找此模块对应的loader对代码进行转换
        let rules = this.options.module.rules;
        let loaders = [];
        for(let i=0;i<rules.length;i++){
            //正则匹配上了模块的路径
            if(rules[i].test.test(modulePath)){
                loaders=[...loaders,...rules[i].use];
            }
        }
        //loaders=['logger1-loader.js','logger2-loader.js','logger3-loader.js','logger4-loader.js']
        for(let i=loaders.length-1;i>=0;i--){
            let loader = loaders[i];
            sourceCode=require(loader)(sourceCode);
        }
        let moduleId = './'+path.posix.relative(baseDir,modulePath);
        //webpack最核心 的几个概念要出场了 module 模块ID ，依赖的数组
        let module = {id:moduleId,dependencies:[],name};
        //现在我们已经得到转换后的代码 babel-loader es6=>es5
        //再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
        let astTree = parser.parse(sourceCode,{sourceType:'module'});
        //遍历语法树，并找出require节点
        traverse(astTree,{
            CallExpression:({node})=>{
                if(node.callee.name === 'require'){
                    //1.相对路径 2.相对当前模块  
                    //2.绝对路径
                    let moduleName = node.arguments[0].value;
                    //要判断一个moduleName绝对还是相对，相对路径才需要下面的处理
                    //获取路径所有的目录
                    //C:\aproject\zhufengwebpack202011\5.flow\src
                    let dirname = path.posix.dirname(modulePath);
                    //C:\aproject\zhufengwebpack202011\5.flow\src\title
                    let depModulePath = path.posix.join(dirname,moduleName);
                    let extensions = this.options.resolve.extensions;
                    //C:\aproject\zhufengwebpack202011\5.flow\src\title.js
                    depModulePath = tryExtensions(depModulePath,extensions,moduleName,dirname);
                    //模块ID的问题 每个打包后的模块都会有一个moduleId
                    //"./src/title.js"  depModulePath=/a/b/c  baseDir=/a/b relative=>c ./c
                    let depModuleId = './'+path.posix.relative(baseDir,depModulePath);//./src/title.js
                    //修改抽象语法树
                    node.arguments = [types.stringLiteral(depModuleId)];
                    //判断现有的已经编译过的modules里有没有这个模块，如果有不用添加依赖了，没有则需要添加
                    let alreadyModuleIds = Array.from(this.modules).map(module=>module.id);
                    //如果已经编译过的模块的里不包含这个依赖模块的话才添加，如果已经包含了，就不要添加了
                    if(!alreadyModuleIds.includes(depModuleId)){
                        module.dependencies.push(depModulePath);
                    }
                }
            }
        });
        //根据新的语法树生成新代码
        let {code}=generator(astTree);
        module._source = code;//转换后的代码 module moduleId dependencies _source
        //再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
        module.dependencies.forEach(dependency=>{
            let dependencyModule = this.buildModule(name,dependency);
            this.modules.add(dependencyModule);
        });
        return module;
    }
}
//let chunk = {name:'main',entryModule,modules:this.modules}; 
function getSource(chunk){
   return `
   (() => {
    var modules = {
      ${
          chunk.modules.map(module=>`
          "${module.id}": (module,exports,require) => {
            ${module._source}
          }`).join(',')
      }
    };
    var cache = {};
    function require(moduleId) {
      if (cache[moduleId]) {
        return cache[moduleId].exports;
      }
      var module = (cache[moduleId] = {
        exports: {},
      });
      modules[moduleId](module, module.exports, require);
      return module.exports;
    }
    (() => {
     ${chunk.entryModule._source}
    })();
  })();
   `;
}
function tryExtensions(modulePath,extensions,originalModulePath,moduleContext){
    extensions.unshift('');
    for(let i=0;i<extensions.length;i++){
       if(fs.existsSync(modulePath+extensions[i])){
        return modulePath+extensions[i];
       }
    }
    throw new Error(`Module not found: Error: Can't resolve '${originalModulePath}' in '${moduleContext}'`);
}
module.exports = Compiler;
```

## 3.Stats 对象

- 在 Webpack 的回调函数中会得到 stats 对象
- 这个对象实际来自于`Compilation.getStats()`，返回的是主要含有`modules`、`chunks`和`assets`三个属性值的对象。
- Stats 对象本质上来自于[lib/Stats.js](https://github.com/webpack/webpack/blob/v4.39.3/lib/Stats.js)的类实例

| 字段    | 含义                   |
| :------ | :--------------------- |
| modules | 记录了所有解析后的模块 |
| chunks  | 记录了所有 chunk       |
| assets  | 记录了所有要生成的文件 |

```js
npx webpack --profile --json > stats.json
{
  "hash": "780231fa9b9ce4460c8a",     //编译使用的 hash
  "version": "5.8.0",                 // 用来编译的 webpack 的版本
  "time": 83,                         // 编译耗时 (ms)
  "builtAt": 1606538839612,           //编译的时间
  "publicPath": "auto",               //资源访问路径
  "outputPath": "C:\\webpack5\\dist", //输出目录
  "assetsByChunkName": {              //代码块和文件名的映射
    "main": ["main.js"]
  },
  "assets": [                         //资源数组
    {
      "type": "asset",                //资源类型
      "name": "main.js",              //文件名称
      "size": 2418,                   //文件大小
      "chunkNames": [                 //对应的代码块名称
        "main"
      ],
      "chunkIdHints": [],
      "auxiliaryChunkNames": [],
      "auxiliaryChunkIdHints": [],
      "emitted": false,
      "comparedForEmit": true,
      "cached": false,
      "info": {
        "javascriptModule": false,
        "size": 2418
      },
      "related": {},
      "chunks": [
        "main"
      ],
      "auxiliaryChunks": [],
      "isOverSizeLimit": false
    }
  ],
  "chunks": [                      //代码块数组
    {
      "rendered": true,
      "initial": true,
      "entry": true,
      "recorded": false,
      "size": 80,
      "sizes": {
        "javascript": 80
      },
      "names": [
        "main"
      ],
      "idHints": [],
      "runtime": [
        "main"
      ],
      "files": [
        "main.js"
      ],
      "auxiliaryFiles": [],
      "hash": "d25ad7a8144077f69783",
      "childrenByOrder": {},
      "id": "main",
      "siblings": [],
      "parents": [],
      "children": [],
      "modules": [
        {
          "type": "module",
          "moduleType": "javascript/auto",
          "identifier": "C:\\webpack5\\src\\index.js",
          "name": "./src/index.js",
          "nameForCondition": "C:\\webpack5\\src\\index.js",
          "index": 0,
          "preOrderIndex": 0,
          "index2": 1,
          "postOrderIndex": 1,
          "size": 55,
          "sizes": {
            "javascript": 55
          },
          "cacheable": true,
          "built": true,
          "codeGenerated": true,
          "cached": false,
          "optional": false,
          "orphan": false,
          "dependent": false,
          "issuer": null,
          "issuerName": null,
          "issuerPath": null,
          "failed": false,
          "errors": 0,
          "warnings": 0,
          "profile": {
            "total": 38,
            "resolving": 26,
            "restoring": 0,
            "building": 12,
            "integration": 0,
            "storing": 0,
            "additionalResolving": 0,
            "additionalIntegration": 0,
            "factory": 26,
            "dependencies": 0
          },
          "id": "./src/index.js",
          "issuerId": null,
          "chunks": [
            "main"
          ],
          "assets": [],
          "reasons": [
            {
              "moduleIdentifier": null,
              "module": null,
              "moduleName": null,
              "resolvedModuleIdentifier": null,
              "resolvedModule": null,
              "type": "entry",
              "active": true,
              "explanation": "",
              "userRequest": "./src/index.js",
              "loc": "main",
              "moduleId": null,
              "resolvedModuleId": null
            }
          ],
          "usedExports": null,
          "providedExports": null,
          "optimizationBailout": [],
          "depth": 0
        },
        {
          "type": "module",
          "moduleType": "javascript/auto",
          "identifier": "C:\\webpack5\\src\\title.js",
          "name": "./src/title.js",
          "nameForCondition": "C:\\webpack5\\src\\title.js",
          "index": 1,
          "preOrderIndex": 1,
          "index2": 0,
          "postOrderIndex": 0,
          "size": 25,
          "sizes": {
            "javascript": 25
          },
          "cacheable": true,
          "built": true,
          "codeGenerated": true,
          "cached": false,
          "optional": false,
          "orphan": false,
          "dependent": true,
          "issuer": "C:\\webpack5\\src\\index.js",
          "issuerName": "./src/index.js",
          "issuerPath": [
            {
              "identifier": "C:\\webpack5\\src\\index.js",
              "name": "./src/index.js",
              "profile": {
                "total": 38,
                "resolving": 26,
                "restoring": 0,
                "building": 12,
                "integration": 0,
                "storing": 0,
                "additionalResolving": 0,
                "additionalIntegration": 0,
                "factory": 26,
                "dependencies": 0
              },
              "id": "./src/index.js"
            }
          ],
          "failed": false,
          "errors": 0,
          "warnings": 0,
          "profile": {
            "total": 0,
            "resolving": 0,
            "restoring": 0,
            "building": 0,
            "integration": 0,
            "storing": 0,
            "additionalResolving": 0,
            "additionalIntegration": 0,
            "factory": 0,
            "dependencies": 0
          },
          "id": "./src/title.js",
          "issuerId": "./src/index.js",
          "chunks": [
            "main"
          ],
          "assets": [],
          "reasons": [
            {
              "moduleIdentifier": "C:\\webpack5\\src\\index.js",
              "module": "./src/index.js",
              "moduleName": "./src/index.js",
              "resolvedModuleIdentifier": "C:\\webpack5\\src\\index.js",
              "resolvedModule": "./src/index.js",
              "type": "cjs require",
              "active": true,
              "explanation": "",
              "userRequest": "./title.js",
              "loc": "1:12-33",
              "moduleId": "./src/index.js",
              "resolvedModuleId": "./src/index.js"
            },
            {
              "moduleIdentifier": "C:\\webpack5\\src\\title.js",
              "module": "./src/title.js",
              "moduleName": "./src/title.js",
              "resolvedModuleIdentifier": "C:\\webpack5\\src\\title.js",
              "resolvedModule": "./src/title.js",
              "type": "cjs self exports reference",
              "active": true,
              "explanation": "",
              "userRequest": null,
              "loc": "1:0-14",
              "moduleId": "./src/title.js",
              "resolvedModuleId": "./src/title.js"
            }
          ],
          "usedExports": null,
          "providedExports": null,
          "optimizationBailout": [
            "CommonJS bailout: module.exports is used directly at 1:0-14"
          ],
          "depth": 1
        }
      ],
      "origins": [
        {
          "module": "",
          "moduleIdentifier": "",
          "moduleName": "",
          "loc": "main",
          "request": "./src/index.js"
        }
      ]
    }
  ],
  "modules": [                              //模块数组
    {
      "type": "module",
      "moduleType": "javascript/auto",
      "identifier": "C:\\webpack5\\src\\index.js",
      "name": "./src/index.js",
      "nameForCondition": "C:\\webpack5\\src\\index.js",
      "index": 0,
      "preOrderIndex": 0,
      "index2": 1,
      "postOrderIndex": 1,
      "size": 55,
      "sizes": {
        "javascript": 55
      },
      "cacheable": true,
      "built": true,
      "codeGenerated": true,
      "cached": false,
      "optional": false,
      "orphan": false,
      "issuer": null,
      "issuerName": null,
      "issuerPath": null,
      "failed": false,
      "errors": 0,
      "warnings": 0,
      "profile": {
        "total": 38,
        "resolving": 26,
        "restoring": 0,
        "building": 12,
        "integration": 0,
        "storing": 0,
        "additionalResolving": 0,
        "additionalIntegration": 0,
        "factory": 26,
        "dependencies": 0
      },
      "id": "./src/index.js",
      "issuerId": null,
      "chunks": [
        "main"
      ],
      "assets": [],
      "reasons": [
        {
          "moduleIdentifier": null,
          "module": null,
          "moduleName": null,
          "resolvedModuleIdentifier": null,
          "resolvedModule": null,
          "type": "entry",
          "active": true,
          "explanation": "",
          "userRequest": "./src/index.js",
          "loc": "main",
          "moduleId": null,
          "resolvedModuleId": null
        }
      ],
      "usedExports": null,
      "providedExports": null,
      "optimizationBailout": [],
      "depth": 0
    },
    {
      "type": "module",
      "moduleType": "javascript/auto",
      "identifier": "C:\\webpack5\\src\\title.js",
      "name": "./src/title.js",
      "nameForCondition": "C:\\webpack5\\src\\title.js",
      "index": 1,
      "preOrderIndex": 1,
      "index2": 0,
      "postOrderIndex": 0,
      "size": 25,
      "sizes": {
        "javascript": 25
      },
      "cacheable": true,
      "built": true,
      "codeGenerated": true,
      "cached": false,
      "optional": false,
      "orphan": false,
      "issuer": "C:\\webpack5\\src\\index.js",
      "issuerName": "./src/index.js",
      "issuerPath": [
        {
          "identifier": "C:\\webpack5\\src\\index.js",
          "name": "./src/index.js",
          "profile": {
            "total": 38,
            "resolving": 26,
            "restoring": 0,
            "building": 12,
            "integration": 0,
            "storing": 0,
            "additionalResolving": 0,
            "additionalIntegration": 0,
            "factory": 26,
            "dependencies": 0
          },
          "id": "./src/index.js"
        }
      ],
      "failed": false,
      "errors": 0,
      "warnings": 0,
      "profile": {
        "total": 0,
        "resolving": 0,
        "restoring": 0,
        "building": 0,
        "integration": 0,
        "storing": 0,
        "additionalResolving": 0,
        "additionalIntegration": 0,
        "factory": 0,
        "dependencies": 0
      },
      "id": "./src/title.js",
      "issuerId": "./src/index.js",
      "chunks": [
        "main"
      ],
      "assets": [],
      "reasons": [
        {
          "moduleIdentifier": "C:\\webpack5\\src\\index.js",
          "module": "./src/index.js",
          "moduleName": "./src/index.js",
          "resolvedModuleIdentifier": "C:\\webpack5\\src\\index.js",
          "resolvedModule": "./src/index.js",
          "type": "cjs require",
          "active": true,
          "explanation": "",
          "userRequest": "./title.js",
          "loc": "1:12-33",
          "moduleId": "./src/index.js",
          "resolvedModuleId": "./src/index.js"
        },
        {
          "moduleIdentifier": "C:\\webpack5\\src\\title.js",
          "module": "./src/title.js",
          "moduleName": "./src/title.js",
          "resolvedModuleIdentifier": "C:\\webpack5\\src\\title.js",
          "resolvedModule": "./src/title.js",
          "type": "cjs self exports reference",
          "active": true,
          "explanation": "",
          "userRequest": null,
          "loc": "1:0-14",
          "moduleId": "./src/title.js",
          "resolvedModuleId": "./src/title.js"
        }
      ],
      "usedExports": null,
      "providedExports": null,
      "optimizationBailout": [
        "CommonJS bailout: module.exports is used directly at 1:0-14"
      ],
      "depth": 1
    }
  ],
  "entrypoints": {                        //入口点
    "main": {
      "name": "main",
      "chunks": [
        "main"
      ],
      "assets": [
        {
          "name": "main.js",
          "size": 2418
        }
      ],
      "filteredAssets": 0,
      "assetsSize": 2418,
      "auxiliaryAssets": [],
      "filteredAuxiliaryAssets": 0,
      "auxiliaryAssetsSize": 0,
      "children": {},
      "childAssets": {},
      "isOverSizeLimit": false
    }
  },
  "namedChunkGroups": {                   //命名代码块组
    "main": {
      "name": "main",
      "chunks": [
        "main"
      ],
      "assets": [
        {
          "name": "main.js",
          "size": 2418
        }
      ],
      "filteredAssets": 0,
      "assetsSize": 2418,
      "auxiliaryAssets": [],
      "filteredAuxiliaryAssets": 0,
      "auxiliaryAssetsSize": 0,
      "children": {},
      "childAssets": {},
      "isOverSizeLimit": false
    }
  },
  "errors": [],
  "errorsCount": 0,
  "warnings": [],
  "warningsCount": 0,
  "children": []
}
```





# 6.webpack-loader

## 1.loader

- 所谓 loader 只是一个导出为函数的 JavaScript 模块。它接收上一个 loader 产生的结果或者资源文件(resource file)作为入参。也可以用多个 loader 函数组成 loader chain
- compiler 需要得到最后一个 loader 产生的处理结果。这个处理结果应该是 String 或者 Buffer（被转换为一个 string）

### 1.1 loader 运行的总体流程

![webpackflowloader](http://img.zhufengpeixun.cn/webpackflowloader.jpg)

![loader-runner2](http://img.zhufengpeixun.cn/loader-runner2.jpg)

### 1.2 loader-runner

- [loader-runner](https://github.com/webpack/loader-runner#readme)是一个执行loader链条的的模块

#### 1.2.1 loader 类型

- [loader 的叠加顺序](https://github.com/webpack/webpack/blob/v4.39.3/lib/NormalModuleFactory.js#L159-L339) = post(后置)+inline(内联)+normal(正常)+pre(前置)

#### 1.2.2 特殊配置

- [loaders/#configuration](https://webpack.js.org/concepts/loaders/#configuration)

| 符号 | 变量                 | 含义                                    |                                                              |
| :--- | :------------------- | :-------------------------------------- | ------------------------------------------------------------ |
| `-!` | noPreAutoLoaders     | 不要前置和普通 loader                   | Prefixing with -! will disable all configured preLoaders and loaders but not postLoaders |
| `!`  | noAutoLoaders        | 不要普通 loader                         | Prefixing with ! will disable all configured normal loaders  |
| `!!` | noPrePostAutoLoaders | 不要前后置和普通 loader,只要内联 loader | Prefixing with !! will disable all configured loaders (preLoaders, loaders, postLoaders) |

#### 1.2.3 pitch

- 比如 a!b!c!module, 正常调用顺序应该是 c、b、a，但是真正调用顺序是 a(pitch)、b(pitch)、c(pitch)、c、b、a,如果其中任何一个 pitching loader 返回了值就相当于在它以及它右边的 loader 已经执行完毕
- 比如如果 b 返回了字符串"result b", 接下来只有 a 会被系统执行，且 a 的 loader 收到的参数是 result b
- loader 根据返回值可以分为两种，一种是返回 js 代码（一个 module 的代码，含有类似 module.export 语句）的 loader，还有不能作为最左边 loader 的其他 loader
- 有时候我们想把两个第一种 loader chain 起来，比如 style-loader!css-loader! 问题是 css-loader 的返回值是一串 js 代码，如果按正常方式写 style-loader 的参数就是一串代码字符串
- 为了解决这种问题，我们需要在 style-loader 里执行 require(css-loader!resources)

pitch 与 loader 本身方法的执行顺序图

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

#### 1.2.4 执行流程

##### 1.2.4.1 runner.js

```js
let {runLoaders} = require('loader-runner')
//let runLoaders = require('./loader-runner')
let path = require('path');
let fs = require('fs');
let filePath = path.resolve(__dirname, 'src', 'index.js');//入口模块
//定在require方法里的 inline Loader
let request = `!!inline1-loader!inline2-loader!${filePath}`;
//不同的loader并不loader的类型属性，而是你在使用 的使用了什么样的enforce
let rules = [
    {
        test: /\.js$/,
        use: ['normal1-loader', 'normal2-loader']//普通的loader
    },
    {
        test: /\.js$/,
        enforce: 'post',
        use: ['post1-loader', 'post2-loader']//post的loader 后置
    },
    {
        test: /\.js$/,
        enforce: 'pre',
        use: ['pre1-loader', 'pre2-loader']//pre的loader 前置 
    },
]
//loader执行的真正顺序是
// post pitch inline pitch normal pitch pre pitch=>pre loader normal loader inline loader post loader
// pitch很少使用
//顺序是 post(后置)+inline(内联)+normal(普通)+pre(前置)
//parts=['inline1-loader','inline2-loader','src/index.js']
let parts = request.replace(/^-?!+/,'').split('!');
let resource = parts.pop();//'src/index.js'
//解析loader的绝对路径 C:\5.loader\loaders\inline1-loader.js
let resolveLoader = loader => path.resolve(__dirname, 'loaders', loader);
//inlineLoaders=[inline1-loader绝对路径，inline2-loader绝对路径]
let inlineLoaders = parts;
let preLoaders = [], normalLoaders = [], postLoaders = [];
for(let i=0;i<rules.length;i++){
    let rule = rules[i];
    if(rule.test.test(resource)){
        if(rule.enforce==='pre'){
            preLoaders.push(...rule.use);
        }else if(rule.enforce==='post'){
            postLoaders.push(...rule.use);
        }else{
            normalLoaders.push(...rule.use);
        }
    }
}

/**
 * 正常 post(后置)+inline(内联)+normal(普通)+pre(前置)
 * Prefixing with ! will disable all configured normal loaders
 * post(后置)+inline(内联)+pre(前置)
 * Prefixing with !! will disable all configured loaders (preLoaders, loaders, postLoaders)
 * inline(内联)
 * Prefixing with -! will disable all configured preLoaders and loaders but not postLoaders
 * post(后置)+inline(内联)
 */
let loaders = [];//表示最终生效的loader
if(request.startsWith('!!')){
    loaders = [...inlineLoaders];
}else if(request.startsWith('-!')){
    loaders = [...postLoaders,...inlineLoaders];
}else if(request.startsWith('!')){
    loaders = [...postLoaders,...inlineLoaders,...preLoaders];
}else{
    loaders = [...postLoaders,...inlineLoaders,...normalLoaders,...preLoaders];
}
loaders  = loaders.map(resolveLoader);
//我们已经 收到了所有的loader绝对路径组成的数组
runLoaders({
    resource,//要加载和转换的模块
    loaders,//loader的数组
    context:{name:'zhufeng'}, //基础上下文件对象
    readResource:fs.readFile.bind(fs) //读取硬盘文件的方法

},(err,result)=>{
  console.log(err);
  console.log(result);
  console.log(result.resourceBuffer.toString('utf8'));
});
```

#### 1.2.5 loaders

##### 1.2.5.1 pre-loader1.js

loaders\pre-loader1.js

```js
function loader(source) {
  console.log("pre1");
  return source + "//pre1";
}
module.exports = loader;
```

##### 1.2.5.2 pre-loader2.js

loaders\pre-loader2.js

```js
function loader(source) {
  console.log("pre2");
  return source + "//pre2";
}
module.exports = loader;
```

##### 1.2.5.3 normal-loader1.js

loaders\normal-loader1.js

```js
function loader(source) {
  console.log("normal1");
  return source + "//normal1";
}
loader.pitch = function(){
  return 'normal1pitch';
}
module.exports = loader;
```

##### 1.2.5.4 normal-loader2.js

loaders\normal-loader2.js

```js
function loader(source) {
  console.log("normal2");
  return source + "//normal2";
}
/* loader.pitch = function(){
  return 'normal-loader2-pitch';
} */
module.exports = loader;
```

##### 1.2.5.5 inline-loader1.js

loaders\inline-loader1.js

```js
function loader(source) {
  console.log("inline1");
  return source + "//inline1";
}

module.exports = loader;
```

##### 1.2.5.6 inline-loader2.js

loaders\inline-loader2.js

```js
function loader(source) {
  console.log("inline2");
  return source + "//inline2";
}
module.exports = loader;
```

##### 1.2.5.7 post-loader1.js

loaders\post-loader1.js

```js
function loader(source) {
  console.log("post1");
  return source + "//post1";
}
module.exports = loader;
```

##### 1.2.5.8 post-loader2.js

loaders\post-loader2.js

```js
function loader(source) {
  console.log("post2");
  return source + "//post2";
}
module.exports = loader;
```

![pitchloaderexec](http://img.zhufengpeixun.cn/pitchloaderexec.png)

## 2.babel-loader

- [babel-loader](https://github.com/babel/babel-loader/blob/master/src/index.js)
- [@babel/core](https://babeljs.io/docs/en/next/babel-core.html)
- [babel-plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx/)
- previousRequest 前面的loader
- remainingRequest 后面的loader+资源路径
- data: 和普通的loader函数的第三个参数一样,而且loader执行的全程用的是同一个对象

| 属性              | 值                                     |
| :---------------- | :------------------------------------- |
| this.request      | /loaders/babel-loader.js!/src/index.js |
| this.resourcePath | /src/index.js                          |

```js
$ cnpm i @babel/preset-env @babel/core -D
const babel = require("@babel/core");
function loader(source, inputSourceMap,data) {
  //C:\webpack-analysis2\loaders\babel-loader.js!C:\webpack-analysis2\src\index.js
  const options = {
    presets: ["@babel/preset-env"],
    inputSourceMap: inputSourceMap,
    sourceMaps: true, //sourceMaps: true 是告诉 babel 要生成 sourcemap
    filename: this.request.split("!")[1].split("/").pop(),
  };
  //在webpack.config.js中 增加devtool: 'eval-source-map'
  let { code, map, ast } = babel.transform(source, options);
  return this.callback(null, code, map, ast);
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

## 3. file

- `file-loader` 并不会对文件内容进行任何转换，只是复制一份文件内容，并根据配置为他生成一个唯一的文件名。

### 3.1 file-loader

- [loader-utils](https://github.com/webpack/loader-utils)
- [file-loader](https://github.com/webpack-contrib/file-loader/blob/master/src/index.js)
- [public-path](https://webpack.js.org/guides/public-path/#on-the-fly)

```js
const { getOptions, interpolateName } = require("loader-utils");
function loader(content) {
  let options = getOptions(this) || {};
  let url = interpolateName(this, options.filename || "[hash].[ext]", {
    content,
  });
  this.emitFile(url, content);
  return `module.exports = ${JSON.stringify(url)}`;
}
loader.raw = true;
module.exports = loader;
```

- 通过 `loaderUtils.interpolateName` 方法可以根据 options.name 以及文件内容生成一个唯一的文件名 url（一般配置都会带上 hash，否则很可能由于文件重名而冲突）
- 通过 `this.emitFile(url, content)` 告诉 webpack 我需要创建一个文件，webpack 会根据参数创建对应的文件，放在 `public path` 目录下
- 返回 `module.exports = ${JSON.stringify(url)}`,这样就会把原来的文件路径替换为编译后的路径

### 3.2 url-loader

```js
let { getOptions } = require("loader-utils");
var mime = require("mime");
function loader(source) {
  let options = getOptions(this) || {};
  let { limit, fallback = "file-loader" } = options;
  if (limit) {
    limit = parseInt(limit, 10);
  }
  const mimetype = mime.getType(this.resourcePath);
  if (!limit || source.length < limit) {
    let base64 = `data:${mimetype};base64,${source.toString("base64")}`;
    return `module.exports = ${JSON.stringify(base64)}`;
  } else {
    let fileLoader = require(fallback || "file-loader");
    return fileLoader.call(this, source);
  }
}
loader.raw = true;
module.exports = loader;
```

### 3.3 样式处理

- [css-loader](https://github.com/webpack-contrib/css-loader/blob/master/lib/loader.js) 的作用是处理 css 中的 @import 和 url 这样的外部资源
- [style-loader](https://github.com/webpack-contrib/style-loader/blob/master/index.js) 的作用是把样式插入到 DOM 中，方法是在 head 中插入一个 style 标签，并把样式写入到这个标签的 innerHTML 里
- [less-loader](https://github.com/webpack-contrib/less-loader) 把 less 编译成 css
- [pitching-loader](https://webpack.js.org/api/loaders/#pitching-loader)
- [loader-utils](https://github.com/webpack/loader-utils)
- [!!](https://webpack.js.org/concepts/loaders/#configuration)

```js
$ cnpm i less postcss css-selector-tokenizer -D
```

#### 3.3.2 使用 less-loader

##### 3.3.2.1 index.js

src\index.js

```js
import "./index.less";
```

##### 3.3.2.2 src\index.less

src\index.less

```less
@color: red;
#root {
  color: @color;
}
```

##### 3.3.2.3 src\index.html

src\index.html

```html
<div id="root">hello</div>
<div class="avatar"></div>
```

##### 3.3.2.4 webpack.config.js

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

##### 3.3.2.5 less-loader.js

```js
let less = require("less");
function loader(source) {
  let callback = this.async();
  less.render(source, { filename: this.resource }, (err, output) => {
    callback(err, output.css);
  });
}
module.exports = loader;
```

##### 3.3.2.6 style-loader

```js
function loader(source) {
  let script = `
      let style = document.createElement("style");
      style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style);
    module.exports = "";
    `;
  return script;
}
module.exports = loader;
```

#### 3.3.5 两个左侧模块连用

##### 3.3.5.1 less-loader.js

```js
let less = require("less");
function loader(source) {
  let callback = this.async();
  less.render(source, { filename: this.resource }, (err, output) => {
    callback(err, `module.exports = ${JSON.stringify(output.css)}`);
  });
}
module.exports = loader;
```

##### 3.3.5.2 style-loader.js

```js
let loaderUtils = require("loader-utils");
function loader(source) {}
//https://github.com/webpack/webpack/blob/v4.39.3/lib/NormalModuleFactory.js#L339
loader.pitch = function (remainingRequest, previousRequest, data) {
  //C:\webpack-analysis2\loaders\less-loader.js!C:\webpack-analysis2\src\index.less
  console.log("previousRequest", previousRequest); //之前的路径
  //console.log('currentRequest', currentRequest);//当前的路径
  console.log("remainingRequest", remainingRequest); //剩下的路径
  console.log("data", data);
  // !! noPrePostAutoLoaders 不要前后置和普通loader
  //__webpack_require__(/*! !../loaders/less-loader.js!./index.less */ "./loaders/less-loader.js!./src/index.less");
  let style = `
    var style = document.createElement("style");
    style.innerHTML = require(${loaderUtils.stringifyRequest(
      this,
      "!!" + remainingRequest
    )});
    document.head.appendChild(style);
 `;
  return style;
};
module.exports = loader;
```

## 4. loader-runner实现

- [LoaderRunner.js](https://github.com/webpack/loader-runner/blob/v2.4.0/lib/LoaderRunner.js)
- [NormalModuleFactory.js](https://github.com/webpack/webpack/blob/v4.39.3/lib/NormalModuleFactory.js#L180)
- [NormalModule.js](https://github.com/webpack/webpack/blob/v4.39.3/lib/NormalModule.js#L292)

![img](https://img.zhufengpeixun.com/3f34c35da4cc3049ed2c414abbae9b99)

![img](https://img.zhufengpeixun.com/72bd5f659d64616ea7990c5de87bfe21)

```js
let fs = require('fs');

function createLoaderObject(loader) {
  let loaderObj = {
    path:loader,//loader的绝对路径
    normal: null,//loader函数本身
    pitch: null,//loader的pitch函数
    raw: false,//是否要转成字符串 raw=true表示传递给loader是一个buffer,加载图片的 默认值是false,表示把内容转成字符串后才传递给loader
    data: {},//每一个loader都会自有一个自定义数据对象，用来存一些自定义信息
    pitchExecuted: false,//这个loader的pitch方法是不是已经 执行这了
    normalExecuted: false,//这个loader的normal方法是不是已经 执行过
  }
  return loaderObj;
}
function processResource(options, loaderContext, callback) {
  loaderContext.loaderIndex = loaderContext.loaders.length - 1;debugger
  options.readResource(loaderContext.resource, function (err, buffer) {
    options.resourceBuffer = buffer;
    iterateNormalLoaders(options, loaderContext, [buffer], callback);
  });
}
/**
 * 从右向左执行normal函数
 * @param {*} processOptions 选项对象
 * @param {*} loaderContext 上下文对象
 * @param {*} args 上一个loader传递给我的参数
 * @param {*} finalCallback 最终的回调
 * @returns 
 */
function iterateNormalLoaders(options, loaderContext, args, callback) {
  if (loaderContext.loaderIndex < 0)
    return callback(null, args);
  var currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoaderObject.normalExecuted) {
    loaderContext.loaderIndex--;
    return iterateNormalLoaders(options, loaderContext, args, callback);
  }
  var fn = currentLoaderObject.normal;
  currentLoaderObject.normalExecuted = true;
  if (!fn) {
    return iterateNormalLoaders(options, loaderContext, args, callback);
  }
  convertArgs(args, currentLoaderObject.raw);
  //args传给iterateNormalLoaders的时候都要转成数组
  runSyncOrAsync(fn, loaderContext, args, function (err,...args) {
    if (err) return callback(err);
    iterateNormalLoaders(options, loaderContext, args, callback);
  });
}
function convertArgs(args, raw) {
  if (raw && !Buffer.isBuffer(args[0])) {
    args[0] = Buffer.from(args[0]);//如果这个normal函数想要buffer,但是参数不是Buffer
  } else if (!raw && Buffer.isBuffer(args[0])) {//想要字符串，但是是个buffer
    args[0] = args[0].toString('utf8');
  }
}

function iteratePitchingLoaders(options, loaderContext, callback) {
  if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
    return processResource(options, loaderContext, callback);
  }
  let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoaderObject.pitchExecuted) {
    loaderContext.loaderIndex++;
    return iteratePitchingLoaders(options, loaderContext, callback);
  }
  loadLoader(currentLoaderObject, () => {
    let fn = currentLoaderObject.pitch;
    currentLoaderObject.pitchExecuted = true;//表示pitch函数已经执行过了
    if (!fn) {//如果说此loader没有提供pitch方法
      return iteratePitchingLoaders(options, loaderContext, callback);
    }
    //以同步或者异步的方式运行
    runSyncOrAsync(fn, loaderContext,
      [loaderContext.remainingRequest, loaderContext.previousRequest, loaderContext.data = {}],
      (err,...args) => {
        if (args.length > 0) {
          loaderContext.loaderIndex--;
          iterateNormalLoaders(options, loaderContext, args, callback);
        } else {
          iteratePitchingLoaders(options, loaderContext, callback);
        }
      }
    );
  });
}
function loadLoader(loader, callback) {
  var module = require(loader.path);
  loader.normal = module;
  loader.pitch = module.pitch;
  loader.raw = module.raw;
  callback();
}
function runSyncOrAsync(fn, context, args, callback) {
  var isSync = true;
  var isDone = false;
  context.async = function async() {
    isSync = false;
    return innerCallback;
  };
  var innerCallback = context.callback = function (...args) {
    isDone = true;
    isSync = false;
    callback.apply(null, args);
  };
  var result = fn.apply(context, args);
  if (isSync) {
    isDone = true;
    if (result === undefined)
      return callback();
    return callback(null, result);
  }
}

function runLoaders(options, callback) {
  let resource = options.resource;//获取 要到加载的资源 src/index.js
  let loaders = options.loaders || [];//要经过哪些loader进行处理
  let loaderContext = options.context || {};//loader执行上下文
  let readResource = options.readResource || fs.readFile;//读取文件内容的方法
  //把每个loader从一个loader 绝对路径默认成一个loader对象
  let loaderObjects = loaders.map(createLoaderObject);
  loaderContext.resource = resource;
  loaderContext.readResource = readResource;
  loaderContext.loaderIndex = 0;//当前 正在执行的loader的索引 0 1 2
  loaderContext.loaders = loaderObjects;//loader对象的数组
  loaderContext.callback = null;
  loaderContext.async = null;
  Object.defineProperty(loaderContext, 'request', {
    get() {
      return loaderContext.loaders.map(l => l.request).concat(loaderContext.resource).join('!')
    }
  });
  Object.defineProperty(loaderContext, 'remainingRequest', {
    get() {
      return loaderContext.loaders.slice(loaderContext.loaderIndex + 1).map(l => l.request).concat(loaderContext.resource).join('!')
    }
  });
  Object.defineProperty(loaderContext, 'currentRequest', {
    get() {
      return loaderContext.loaders.slice(loaderContext.loaderIndex).map(l => l.request).concat(loaderContext.resource).join('!')
    }
  });
  Object.defineProperty(loaderContext, 'previousRequest', {
    get() {
      return loaderContext.loaders.slice(0, loaderContext.loaderIndex).map(l => l.request).join('!')
    }
  });
  Object.defineProperty(loaderContext, 'data', {
    get() {
      return loaderContext.loaders[loaderContext.loaderIndex].data;
    }
  });
  let processOptions = {
    resourceBuffer: null, //要读取的资源的二进制内容 转换前的要加载的文件的内容 
    readResource
  }
  iteratePitchingLoaders(processOptions, loaderContext, (err, result) => {
    callback(err, {
      result,
      resourceBuffer: processOptions.resourceBuffer
    });
  });
}

exports.runLoaders = runLoaders;
```



# 7.webpack-tapable

## 1. webpack 的插件机制

- 在具体介绍 webpack 内置插件与钩子可视化工具之前，我们先来了解一下 webpack 中的插件机制。 webpack 实现插件机制的大体方式是：
  - 创建 - webpack 在其内部对象上创建各种钩子；
  - 注册 - 插件将自己的方法注册到对应钩子上，交给 webpack；
  - 调用 - webpack 编译过程中，会适时地触发相应钩子，因此也就触发了插件的方法。
- Webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 Tapable，webpack 中最核心的负责编译的 Compiler 和负责创建 bundle 的 Compilation 都是 Tapable 的实例
- 通过事件和注册和监听，触发 webpack 生命周期中的函数方法

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
  AsyncSeriesWaterfallHook,
} = require("tapable");
```

## 2. tapable 分类

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

- 如果前一个事件函数的结果 `result !== undefined`,则 result 会作为后一个事件函数的第一个参数,有 SyncWaterfallHook，AsyncSeriesWaterfallHook

![waterfallTapables](http://img.zhufengpeixun.cn/waterfallTapables.jpg)

#### 2.1.4 Loop

- 不停的循环执行事件函数，直到所有函数结果 `result === undefined`,有 SyncLoopHook 和 AsyncSeriesLoopHook

![LoopTapables3](https://img.zhufengpeixun.com/LoopTapables3.jpg)

## 3.使用

### 3.1 SyncHook

- 所有的构造函数都接收一个可选参数，参数是一个参数名的字符串数组
- 参数的名字可以任意填写，但是参数数组的长数必须要根实际接受的参数个数一致
- 如果回调函数不接受参数，可以传入空数组
- 在实例化的时候传入的数组长度长度有用，值没有用途
- 执行 call 时，参数个数和实例化时的数组长度有关
- 回调的时候是按先入先出的顺序执行的，先放的先执行

```js
const { SyncHook } = require("tapable");
const hook = new SyncHook(["name", "age"]);
hook.tap("1", (name, age) => {
  console.log(1, name, age);
  return 1;
});
hook.tap("2", (name, age) => {
  console.log(2, name, age);
  return 2;
});
hook.tap("3", (name, age) => {
  console.log(3, name, age);
  return 3;
});

hook.call("zhufeng", 10);
1 zhufeng 10
2 zhufeng 10
3 zhufeng 10
```

### 3.2 SyncBailHook

- BailHook 中的回调函数也是顺序执行的
- 调用 call 时传入的参数也可以传给回调函数
- 当回调函数返回非 undefined 值的时候会停止调用后续的回调

```js
const { SyncBailHook } = require("tapable");
const hook = new SyncBailHook(["name", "age"]);
hook.tap("1", (name, age) => {
  console.log(1, name, age);
  //return 1;
});
hook.tap("2", (name, age) => {
  console.log(2, name, age);
  return 2;
});
hook.tap("3", (name, age) => {
  console.log(3, name, age);
  return 3;
});

hook.call("zhufeng", 10);
```

### 3.3 SyncWaterfallHook

- SyncWaterfallHook 表示如果上一个回调函数的结果不为 undefined,则可以作为下一个回调函数的第一个参数
- 回调函数接受的参数来自于上一个函数的结果
- 调用 call 传入的第一个参数，会被上一个函数的非 undefined 结果替换
- 当回调函数返回非 undefined 不会停止回调栈的调用

```js
const { SyncWaterfallHook } = require("tapable");

const hook = new SyncWaterfallHook(["name", "age"]);
hook.tap("1", (name, age) => {
  console.log(1, name, age);
  return 1;
});
hook.tap("2", (name, age) => {
  console.log(2, name, age);
  return;
});
hook.tap("3", (name, age) => {
  console.log(3, name, age);
  return 3;
});

hook.call("zhufeng", 10);
```

### 3.4 SyncLoopHook

- SyncLoopHook 的特点是不停的循环执行回调函数，直到函数结果等于 undefined
- 要注意的是每次循环都是从头开始循环的

```js
const { SyncLoopHook } = require("tapable");
//当回调函数返回非undefined值的时候会停止调用后续的回调

let hook = new SyncLoopHook(["name", "age"]);
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
hook.tap("1", (name, age) => {
  console.log(1, "counter1", counter1);
  if (++counter1 == 1) {
    counter1 = 0;
    return;
  }
  return true;
});
hook.tap("2", (name, age) => {
  console.log(2, "counter2", counter2);
  if (++counter2 == 2) {
    counter2 = 0;
    return;
  }
  return true;
});
hook.tap("3", (name, age) => {
  console.log(3, "counter3", counter3);
  if (++counter3 == 3) {
    counter3 = 0;
    return;
  }
  return true;
});
hook.call("zhufeng", 10);
//一共15次 12120 12121 12123
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
let { AsyncParallelHook } = require("tapable");
let queue = new AsyncParallelHook(["name"]);
console.time("cost");
queue.tap("1", function (name) {
  console.log(1);
});
queue.tap("2", function (name) {
  console.log(2);
});
queue.tap("3", function (name) {
  console.log(3);
});
queue.callAsync("zhufeng", (err) => {
  console.log(err);
  console.timeEnd("cost");
});
```

#### 3.5.2 tapAsync

- 异步注册，全部任务完成后执行最终的回调

```js
let { AsyncParallelHook } = require("tapable");
let queue = new AsyncParallelHook(["name"]);
console.time("cost");
queue.tapAsync("1", function (name, callback) {
  setTimeout(function () {
    console.log(1);
    callback();
  }, 1000);
});
queue.tapAsync("2", function (name, callback) {
  setTimeout(function () {
    console.log(2);
    callback();
  }, 2000);
});
queue.tapAsync("3", function (name, callback) {
  setTimeout(function () {
    console.log(3);
    callback();
  }, 3000);
});
queue.callAsync("zhufeng", (err) => {
  console.log(err);
  console.timeEnd("cost");
});
```

#### 3.5.3 tapPromise

- promise 注册钩子
- 全部完成后执行才算成功

```js
let { AsyncParallelHook } = require("tapable");
let queue = new AsyncParallelHook(["name"]);
console.time("cost");
queue.tapPromise("1", function (name) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log(1);
      resolve();
    }, 1000);
  });
});
queue.tapPromise("2", function (name) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log(2);
      resolve();
    }, 2000);
  });
});
queue.tapPromise("3", function (name) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log(3);
      resolve();
    }, 3000);
  });
});
queue.promise("zhufeng").then(() => {
  console.timeEnd("cost");
});
```

### 3.6 AsyncParallelBailHook

- 带保险的异步并行执行钩子
- 有一个任务返回值不为空就直接结束
- 对于promise来说，resolve还reject并没有区别
  - 区别在于你是否传给它们的参数

#### 3.6.1 tap

- 如果有一个任务有返回值则调用最终的回调

```js
let { AsyncParallelBailHook } = require("tapable");
let queue = new AsyncParallelBailHook(["name"]);
console.time("cost");
queue.tap("1", function (name) {
  console.log(1);
  return "Wrong";
});
queue.tap("2", function (name) {
  console.log(2);
});
queue.tap("3", function (name) {
  console.log(3);
});
queue.callAsync("zhufeng", (err) => {
  console.log(err);
  console.timeEnd("cost");
});
```

#### 3.6.2 tapAsync

- 有一个任务返回错误就直接调最终的回调

```js
let { AsyncParallelBailHook } = require("tapable");
let queue = new AsyncParallelBailHook(["name"]);
console.time("cost");
queue.tapAsync("1", function (name, callback) {
  console.log(1);
  callback("Wrong");
});
queue.tapAsync("2", function (name, callback) {
  console.log(2);
  callback();
});
queue.tapAsync("3", function (name, callback) {
  console.log(3);
  callback();
});
queue.callAsync("zhufeng", (err) => {
  console.log(err);
  console.timeEnd("cost");
});
```

#### 3.6.3 tapPromise

- 只要有一个任务有 resolve 或者 reject 值，不管成功失败都结束

```js
let { AsyncParallelBailHook } = require("tapable");
let queue = new AsyncParallelBailHook(["name"]);
console.time("cost");
queue.tapPromise("1", function (name) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log(1);
      //对于promise来说，resolve还reject并没有区别
      //区别在于你是否传给它们的参数
      resolve(1);
    }, 1000);
  });
});
queue.tapPromise("2", function (name) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log(2);
      resolve();
    }, 2000);
  });
});

queue.tapPromise("3", function (name) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log(3);
      resolve();
    }, 3000);
  });
});

queue.promise("zhufeng").then(
  (result) => {
    console.log("成功", result);
    console.timeEnd("cost");
  },
  (err) => {
    console.error("失败", err);
    console.timeEnd("cost");
  }
);
```

### 3.7 AsyncSeriesHook

- 异步串行钩子
- 任务一个一个执行,执行完上一个执行下一个

#### 3.7.1 tap

```js
let { AsyncSeriesHook } = require("tapable");
let queue = new AsyncSeriesHook(["name"]);
console.time("cost");
queue.tap("1", function (name) {
  console.log(1);
});
queue.tap("2", function (name) {
  console.log(2);
});
queue.tap("3", function (name) {
  console.log(3);
});
queue.callAsync("zhufeng", (err) => {
  console.log(err);
  console.timeEnd("cost");
});
```

#### 3.7.2 tapAsync

```js
let { AsyncSeriesHook } = require("tapable");
let queue = new AsyncSeriesHook(["name"]);
console.time("cost");
queue.tapAsync("1", function (name, callback) {
  setTimeout(function () {
    console.log(1);
  }, 1000);
});
queue.tapAsync("2", function (name, callback) {
  setTimeout(function () {
    console.log(2);
    callback();
  }, 2000);
});
queue.tapAsync("3", function (name, callback) {
  setTimeout(function () {
    console.log(3);
    callback();
  }, 3000);
});
queue.callAsync("zhufeng", (err) => {
  console.log(err);
  console.timeEnd("cost");
});
```

#### 3.7.3 tapPromise

```js
let { AsyncSeriesHook } = require("tapable");
let queue = new AsyncSeriesHook(["name"]);
console.time("cost");
queue.tapPromise("1", function (name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(1, name);
      resolve();
    }, 1000);
  });
});
queue.tapPromise("2", function (name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(2, name);
      resolve();
    }, 2000);
  });
});
queue.tapPromise("3", function (name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(3, name);
      resolve();
    }, 3000);
  });
});
queue.promise("zhufeng").then((data) => {
  console.log(data);
  console.timeEnd("cost");
});
```

### 3.8 AsyncSeriesBailHook

- 只要有一个返回了不为 undefined 的值就直接结束

#### 3.8.1 tap

```js
let { AsyncSeriesBailHook } = require("tapable");
let queue = new AsyncSeriesBailHook(["name"]);
console.time("cost");
queue.tap("1", function (name) {
  console.log(1);
  return "Wrong";
});
queue.tap("2", function (name) {
  console.log(2);
});
queue.tap("3", function (name) {
  console.log(3);
});
queue.callAsync("zhufeng", (err) => {
  console.log(err);
  console.timeEnd("cost");
});
```

#### 3.8.1 tapAsync

```js
let { AsyncSeriesBailHook } = require("tapable");
let queue = new AsyncSeriesBailHook(["name"]);
console.time("cost");
queue.tapAsync("1", function (name, callback) {
  setTimeout(function () {
    console.log(1);
    callback("wrong");
  }, 1000);
});
queue.tapAsync("2", function (name, callback) {
  setTimeout(function () {
    console.log(2);
    callback();
  }, 2000);
});
queue.tapAsync("3", function (name, callback) {
  setTimeout(function () {
    console.log(3);
    callback();
  }, 3000);
});
queue.callAsync("zhufeng", (err) => {
  console.log(err);
  console.timeEnd("cost");
});
```

#### 3.8.1 tapPromise

```js
let { AsyncSeriesBailHook } = require("tapable");
let queue = new AsyncSeriesBailHook(["name"]);
console.time("cost");
queue.tapPromise("1", function (name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(1);
      resolve();
    }, 1000);
  });
});
queue.tapPromise("2", function (name, callback) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log(2);
      reject("失败了");
    }, 2000);
  });
});
queue.tapPromise("3", function (name, callback) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(3);
      resolve();
    }, 3000);
  });
});
queue.promise("zhufeng").then(
  (data) => {
    console.log(data);
    console.timeEnd("cost");
  },
  (error) => {
    console.log(error);
    console.timeEnd("cost");
  }
);
```

### 3.9 AsyncSeriesWaterfallHook

- 只要有一个返回了不为 undefined 的值就直接结束

#### 3.9.1 tap

```js
let { AsyncSeriesWaterfallHook } = require("tapable");
let queue = new AsyncSeriesWaterfallHook(["name", "age"]);
console.time("cost");
queue.tap("1", function (name, age) {
  console.log(1, name, age);
  return "return1";
});
queue.tap("2", function (data, age) {
  console.log(2, data, age);
  return "return2";
});
queue.tap("3", function (data, age) {
  console.log(3, data, age);
});
queue.callAsync("zhufeng", 10, (err) => {
  console.log(err);
  console.timeEnd("cost");
});
```

#### 3.9.1 tapAsync

```js
let { AsyncSeriesWaterfallHook } = require("tapable");
let queue = new AsyncSeriesWaterfallHook(["name", "age"]);
console.time("cost");
queue.tapAsync("1", function (name, age, callback) {
  setTimeout(function () {
    console.log(1, name, age);
    callback(null, 1);
  }, 1000);
});
queue.tapAsync("2", function (data, age, callback) {
  setTimeout(function () {
    console.log(2, data, age);
    callback(null, 2);
  }, 2000);
});
queue.tapAsync("3", function (data, age, callback) {
  setTimeout(function () {
    console.log(3, data, age);
    callback(null, 3);
  }, 3000);
});
queue.callAsync("zhufeng", 10, (err, data) => {
  console.log(err, data);
  console.timeEnd("cost");
});
```

#### 3.9.1 tapPromise

```js
let { AsyncSeriesWaterfallHook } = require("tapable");
let queue = new AsyncSeriesWaterfallHook(["name"]);
console.time("cost");
queue.tapPromise("1", function (name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(name, 1);
      resolve(1);
    }, 1000);
  });
});
queue.tapPromise("2", function (data) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(data, 2);
      resolve(2);
    }, 2000);
  });
});
queue.tapPromise("3", function (data) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(data, 3);
      resolve(3);
    }, 3000);
  });
});
queue.promise("zhufeng").then((err) => {
  console.timeEnd("cost");
});
```

## 4.SyncHook

1. 所有的构造函数都接收一个可选参数，参数是一个参数名的字符串数组
2. 参数的名字可以任意填写，但是参数数组的长数必须要根实际接受的参数个数一致
3. 如果回调函数不接受参数，可以传入空数组
4. 在实例化的时候传入的数组长度长度有用，值没有用途
5. 执行 call 时，参数个数和实例化时的数组长度有关
6. 回调的时候是按先入先出的顺序执行的，先放的先执行

### 4.1 使用

```js
const { SyncHook } = require("./tapable");
let syncHook = new SyncHook(["name", "age"]);
let fn1 = (name, age) => {
    console.log(1, name, age);
}
syncHook.tap({name:'1'},fn1 );
let fn2 =  (name, age) => {
    console.log(2, name, age);
}
syncHook.tap("2",fn2);
syncHook.call("zhufeng", 10);

/**
(function anonymous(name, age) {
    var _x = this._x;
    var _fn0 = _x[0];
    _fn0(name, age);
    var _fn1 = _x[1];
    _fn1(name, age);
})
*/
```

![tapableImpl.jpg](https://img.zhufengpeixun.com/1608282448504)

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
class Hook{
    constructor(args){
     if(!Array.isArray(args)) args=[];
     this.args = args;
     this.taps = [];
     this.call = CALL_DELEGATE;
    }
    tap(options,fn){
        this._tap("sync", options, fn);
    }
    _tap(type, options, fn) {
        if(typeof options === 'string') 
            options={name:options};
        let tapInfo ={...options,type,fn};
        this._insert(tapInfo);
    }
    _resetCompilation(){
        this.call = CALL_DELEGATE;
    }
    _insert(tapInfo){
        this._resetCompilation();
        this.taps.push(tapInfo);
    }
    compile(options) {
        throw new Error("Abstract: should be overridden");
    }
    _createCall(type){
        return this.compile({
            taps:this.taps,
            args:this.args,
            type
        });
    }
}
const CALL_DELEGATE = function(...args) {
    this.call = this._createCall("sync");
    return this.call(...args);
};
module.exports = Hook;
```

#### 4.2.3 SyncHook.js

tapable\SyncHook.js

```js
let Hook = require('./Hook');
const HookCodeFactory = require('./HookCodeFactory');
class SyncHookCodeFactory extends HookCodeFactory{
    content(){
        return this.callTapsSeries()
    }
}
let factory = new SyncHookCodeFactory();
class SyncHook extends Hook{
    compile(options) {
        factory.setup(this,options);
        return factory.create(options);
    }
}
module.exports = SyncHook;
```

#### 4.2.4 HookCodeFactory.js

HookCodeFactory.js

```js
class HookCodeFactory {
    setup(hookInstance, options) {
        hookInstance._x = options.taps.map(item => item.fn);
    }
    init(options) {
        this.options = options;
    }
    deinit() {
        this.options = null;
    }
    args(options = {}) {
        let { before, after } = options;
        let allArgs = this.options.args || [];
        if (before) allArgs = [before, ...allArgs];
        if (after) allArgs = [...allArgs, after];
        if (allArgs.length > 0)
            return allArgs.join(', ');
        return "";
    }
    header() {
        let code = "";
        code += "var _x = this._x;\n";
        return code;
    }
    create(options) {
        this.init(options);
        let fn;
        switch (this.options.type) {
            case 'sync':
                fn = new Function(
                    this.args(),
                    this.header() + this.content()
                )
                break;
            default:
                break;    
        }
        this.deinit();
        return fn;
    }
    callTapsSeries() {
        if (this.options.taps.length === 0) {
            return '';
        }
        let code = "";
        for (let j =0;j< this.options.taps.length ; j++) {
            const content = this.callTap(j);
            code += content;
        }
        return code;
    }
    callTap(tapIndex) {
        let code = "";
        code += `var _fn${tapIndex} = _x[${tapIndex}];\n`
        let tap = this.options.taps[tapIndex];
        switch (tap.type) {
            case 'sync':
                code += `_fn${tapIndex}(${this.args()});\n`;
                break;
            default:
                break;
        }
        return code;
    }
}
module.exports = HookCodeFactory;
```

## 5.AsyncParallelHook.callAsync

### 5.1 使用

```js
const { AsyncParallelHook } = require('tapable');
const hook = new AsyncParallelHook(['name', 'age']);
console.time('cost');

hook.tapAsync('1', (name, age, callback) => {
    setTimeout(() => {
        console.log(1, name, age);
        callback();
    }, 1000);
});
hook.tapAsync('2', (name, age,callback) => {
    setTimeout(() => {
        console.log(2, name, age);
        callback();
    }, 2000);
});
hook.tapAsync('3', (name, age,callback) => {
    setTimeout(() => {
        console.log(3, name, age);
        callback();
    }, 3000);
});
debugger
hook.callAsync('zhufeng', 10, (err) => {
    console.log(err);
    console.timeEnd('cost');
});
/**
(function anonymous(name, age, _callback) {
  var _x = this._x;
  var _counter = 3;
  var _done = function () {
    _callback();
  };
  var _fn0 = _x[0];
  _fn0(name, age, function (_err0) {
    if (--_counter === 0) _done();
  });
  var _fn1 = _x[1];
  _fn1(name, age, function (_err1) {
    if (--_counter === 0) _done();
  });
  var _fn2 = _x[2];
  _fn2(name, age, function (_err2) {
    if (--_counter === 0) _done();
  });
});
 */
```

### 5.2 实现

#### 5.2.1 index.js

tapable\index.js

```diff
let SyncHook = require('./SyncHook');
+let AsyncParallelHook = require('./AsyncParallelHook');
module.exports = {
    SyncHook,
+   AsyncParallelHook
}
```

#### 5.2.2 AsyncParallelHook.js

tapable\AsyncParallelHook.js

```js
let Hook = require('./Hook');
const HookCodeFactory = require('./HookCodeFactory');
class AsyncParallelHookCodeFactory extends HookCodeFactory{
    content(){
        return this.callTapsParallel()
    }
}
let factory = new AsyncParallelHookCodeFactory();
class AsyncParallelHook extends Hook{
    compile(options) {
        factory.setup(this,options);
        return factory.create(options);
    }
}
module.exports = AsyncParallelHook;
```

#### 5.2.3 Hook.js

tapable\Hook.js

```diff
class Hook{
    constructor(args){
     if(!Array.isArray(args)) args=[];
     this.args = args;
     this.taps = [];
     this.call = CALL_DELEGATE;
+     this.callAsync = CALL_ASYNC_DELEGATE;
    }
    tap(options,fn){
        this._tap("sync", options, fn);
    }
+    tapAsync(options,fn){
+        this._tap("async", options, fn);
+    }
    _tap(type, options, fn) {
        if(typeof options === 'string') 
            options={name:options};
        let tapInfo ={...options,type,fn};
        this._insert(tapInfo);
    }
    _resetCompilation(){
        this.call = CALL_DELEGATE;
    }
    _insert(tapInfo){
        this._resetCompilation();
        this.taps.push(tapInfo);
    }
    compile(options) {
        throw new Error("Abstract: should be overridden");
    }
    _createCall(type){
        return this.compile({
            taps:this.taps,
            args:this.args,
            type
        });
    }
}
const CALL_DELEGATE = function(...args) {
    this.call = this._createCall("sync");
    return this.call(...args);
};
+const CALL_ASYNC_DELEGATE = function(...args) {
+    this.callAsync = this._createCall("async");
+    return this.callAsync(...args);
+};
module.exports = Hook;
```

#### 5.2.4 HookCodeFactory.js

tapable\HookCodeFactory.js

```diff
class HookCodeFactory {
    setup(hookInstance, options) {
        hookInstance._x = options.taps.map(item => item.fn);
    }
    init(options) {
        this.options = options;
    }
    deinit() {
        this.options = null;
    }
    args(options = {}) {
        let { before, after } = options;
        let allArgs = this.options.args || [];
        if (before) allArgs = [before, ...allArgs];
        if (after) allArgs = [...allArgs, after];
        if (allArgs.length > 0)
            return allArgs.join(', ');
        return "";
    }
    header() {
        let code = "";
        code += "var _x = this._x;\n";
        return code;
    }
    create(options) {
        this.init(options);
        let fn;
        switch (this.options.type) {
            case 'sync':
                fn = new Function(
                    this.args(),
                    this.header() + this.content()
                )
                break;
+            case 'async':
+                fn = new Function(
+                    this.args({after:'_callback'}),
+                    this.header()+this.content()
+                )    
+                break;     
            default:
                break;    
        }
        this.deinit();
        return fn;
    }
+    callTapsParallel(){
+        let code = `var _counter = ${this.options.taps.length};\n`;
+        code+=`
+            var _done = function () {
+                _callback();
+            };
+        `;
+        for (let j =0;j< this.options.taps.length ; j++) {
+            const content = this.callTap(j);
+            code += content;
+        }
+        return code;
+    }
    callTapsSeries() {
        if (this.options.taps.length === 0) {
            return '';
        }
        let code = "";
        for (let j =0;j< this.options.taps.length ; j++) {
            const content = this.callTap(j);
            code += content;
        }
        return code;
    }
    callTap(tapIndex) {
        let code = "";
        code += `var _fn${tapIndex} = _x[${tapIndex}];\n`
        let tap = this.options.taps[tapIndex];
        switch (tap.type) {
            case 'sync':
                code += `_fn${tapIndex}(${this.args()});\n`;
                break;
+            case 'async':
+                code += ` 
+                    _fn${tapIndex}(${this.args({after:`function (_err${tapIndex}) {
+                        if (--_counter === 0) _done();
+                    }`})});
+                `;
+                break;    
            default:
                break;
        }
        return code;
    }
}
module.exports = HookCodeFactory;
```

## 6.AsyncParallelHook.callPromise

### 6.1 使用

```js
//let { AsyncParallelHook } = require("tapable");
let { AsyncParallelHook } = require("./tapable2");
let queue = new AsyncParallelHook(["name", "age"]);
console.time("cost");
queue.tapPromise("1", function (name, age) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(1, name, age);
      resolve();
    }, 1000);
  });
});
queue.tapPromise("2", function (name, age) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(2, name, age);
      resolve();
    }, 2000);
  });
});
queue.tapPromise("3", function (name, age) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(3, name, age);
      resolve();
    }, 3000);
  });
});
queue.promise("zhufeng", 10).then(
  (result) => {
    console.timeEnd("cost");
  },
  (error) => {
    console.log(error);
    console.timeEnd("cost");
  }
);
/**
 (function anonymous(name, age) {
    var _x = this._x;
    return new Promise(function (_resolve, _reject) {
        var _counter = 3;
        var _done = function () {
            _resolve();
        };

        var _fn0 = _x[0];
        var _promise0 = _fn0(name, age);
        _promise0.then(
            function () {
                if (--_counter === 0) _done();
            }
        );

        var _fn1 = _x[1];
        var _promise1 = _fn1(name, age);
        _promise1.then(
            function () {
                if (--_counter === 0) _done();
            }
        );

        var _fn2 = _x[2];
        var _promise2 = _fn0(name, age);
        _promise2.then(
            function () {
                if (--_counter === 0) _done();
            }
        );
    });
});
 */
```

### 6.2 实现

#### 6.2.1 Hook.js

tapable\Hook.js

```diff
class Hook{
    constructor(args){
     if(!Array.isArray(args)) args=[];
     this.args = args;
     this.taps = [];
     this.call = CALL_DELEGATE;
     this.callAsync = CALL_ASYNC_DELEGATE;
+     this.promise = PROMISE_DELEGATE;
    }
    tap(options,fn){
        this._tap("sync", options, fn);
    }
    tapAsync(options,fn){
        this._tap("async", options, fn);
    }
+    tapPromise(options,fn){
+        this._tap("promise", options, fn);
+    }
    _tap(type, options, fn) {
        if(typeof options === 'string') 
            options={name:options};
        let tapInfo ={...options,type,fn};
        this._insert(tapInfo);
    }
    _resetCompilation(){
        this.call = CALL_DELEGATE;
    }
    _insert(tapInfo){
        this._resetCompilation();
        this.taps.push(tapInfo);
    }
    compile(options) {
        throw new Error("Abstract: should be overridden");
    }
    _createCall(type){
        return this.compile({
            taps:this.taps,
            args:this.args,
            type
        });
    }
}
const CALL_DELEGATE = function(...args) {
    this.call = this._createCall("sync");
    return this.call(...args);
};
const CALL_ASYNC_DELEGATE = function(...args) {
    this.callAsync = this._createCall("async");
    return this.callAsync(...args);
};
+const PROMISE_DELEGATE = function(...args) {
+    this.promise = this._createCall("promise");
+    return this.promise(...args);
+};
module.exports = Hook;
```

#### 6.2.2 AsyncParallelHook.js

tapable\AsyncParallelHook.js

```diff
let Hook = require('./Hook');
const HookCodeFactory = require('./HookCodeFactory');
class AsyncParallelHookCodeFactory extends HookCodeFactory{
+    content({onDone}){
+        return this.callTapsParallel({onDone})
    }
}
let factory = new AsyncParallelHookCodeFactory();
class AsyncParallelHook extends Hook{
    compile(options) {
        factory.setup(this,options);
        return factory.create(options);
    }
}
module.exports = AsyncParallelHook;
```

#### 6.2.3 HookCodeFactory.js

tapable\HookCodeFactory.js

```diff
class HookCodeFactory {
    setup(hookInstance, options) {
        hookInstance._x = options.taps.map(item => item.fn);
    }
    init(options) {
        this.options = options;
    }
    deinit() {
        this.options = null;
    }
    args(options = {}) {
        let { before, after } = options;
        let allArgs = this.options.args || [];
        if (before) allArgs = [before, ...allArgs];
        if (after) allArgs = [...allArgs, after];
        if (allArgs.length > 0)
            return allArgs.join(', ');
        return "";
    }
    header() {
        let code = "";
        code += "var _x = this._x;\n";
        return code;
    }
    create(options) {
        this.init(options);
        let fn;
        switch (this.options.type) {
            case 'sync':
                fn = new Function(
                    this.args(),
                    this.header() + this.content()
                )
                break;
            case 'async':
                fn = new Function(
                    this.args({after:'_callback'}),
+                    this.header()+this.content({ onDone:()=>" _callback();\n"})
                )    
                break;    
+            case 'promise':
+                 let tapsContent = this.content({ onDone:()=>" _resolve();\n"});
+                 let content = `return new Promise(function (_resolve, _reject) {
+                     ${tapsContent}
+                 })`;
+                 fn = new Function(
+                     this.args(),
+                     this.header()+content
+                 )    
+                break;      
            default:
                break;    
        }
        this.deinit();
        return fn;
    }
+    callTapsParallel({onDone}){
        let code = `var _counter = ${this.options.taps.length};\n`;
        code+=`
            var _done = function () {
+                ${onDone()}
            };
        `;
        for (let j =0;j< this.options.taps.length ; j++) {
            const content = this.callTap(j);
            code += content;
        }
        return code;
    }
    callTapsSeries() {
        if (this.options.taps.length === 0) {
            return '';
        }
        let code = "";
        for (let j =0;j< this.options.taps.length ; j++) {
            const content = this.callTap(j);
            code += content;
        }
        return code;
    }
    callTap(tapIndex) {
        let code = "";
        code += `var _fn${tapIndex} = _x[${tapIndex}];\n`
        let tap = this.options.taps[tapIndex];
        switch (tap.type) {
            case 'sync':
                code += `_fn${tapIndex}(${this.args()});\n`;
                break;
            case 'async':
                code += ` 
                    _fn${tapIndex}(${this.args({after:`function (_err${tapIndex}) {
                        if (--_counter === 0) _done();
                    }`})});
                `;
                break;   
+           case 'promise':
+              code = `
+                  var _fn${tapIndex} = _x[${tapIndex}];
+                  var _promise${tapIndex} = _fn${tapIndex}(${this.args()});
+                  _promise${tapIndex}.then(
+                      function () {
+                       if (--_counter === 0) _done();
+                      }
+                  );
+              `;       
            default:
                break;
        }
        return code;
    }
}
module.exports = HookCodeFactory;
```

## 7 AsyncSeriesHook

### 7.1 使用

```js
let { AsyncSeriesHook } = require('./tapable');
let hook = new AsyncSeriesHook(['name', 'age']);
console.time('cost');
hook.tapAsync('1', (name, age, callback) => {
    setTimeout(() => {
        console.log(1, name, age);
        callback();
    }, 1000);
});
hook.tapAsync('2', (name, age, callback) => {
    setTimeout(() => {
        console.log(2, name, age);
        callback();
    }, 2000);
});
hook.tapAsync('3', (name, age, callback) => {
    setTimeout(() => {
        console.log(3, name, age);
        callback();
    }, 3000);
});
hook.callAsync('zhufeng',10,err=>{
    console.log(err);
    console.timeEnd('cost');
});
(function anonymous(name, age, _callback) {
    var _x = this._x;

    function _next1() {
        var _fn2 = _x[2];
        _fn2(name, age, (function (_err2) {
            _callback();
        }));
    }
    function _next0() {
        var _fn1 = _x[1];
        _fn1(name, age, (function () {
            _next1();
        }));
    }
    var _fn0 = _x[0];
    _fn0(name, age, (function () {
        _next0();
    }));
})
```

### 7.2 实现

#### 7.2.1 HookCodeFactory.js

tapable\HookCodeFactory.js

```diff
class HookCodeFactory {
    //就是把事件函数变成数组赋给hook实例的_x属性
    setup(hookInstance, options) {
        hookInstance._x = options.taps.map(tapInfo => tapInfo.fn);
    }
    init(options) {
        this.options = options;
    }
    deinit() {
        this.options = null;
    }
    args(options = {}) {
        //before是在原始参数之前增加的参数，after是在原始参数之后增加的参数
        let { before, after } = options;
        let allArgs = this.options.args || [];
        if (before) allArgs = [before, ...allArgs];
        if (after) allArgs = [...allArgs, after];
        return allArgs.join(',');//[name,age]=>name,age
    }
    header() {
        let code = ``;
        code += `var _x = this._x;\n`;
        let { interceptors = [] } = this.options;
        if (interceptors.length > 0) {
            code += `var _taps = this.taps;\n`;
            code += `var _interceptors = this.interceptors;\n`;
            for (let i = 0; i < interceptors.length; i++) {
                let interceptor = interceptors[i];
                if (interceptor.call)
                    code += `_interceptors[${i}].call(${this.args()});\n`;
            }
        }

        return code;
    }
    //options={type:'sync',taps,args}
    //options={type:'async',taps,args}
    create(options) {
        this.init(options);
        let fn;
        switch (this.options.type) {
            case 'sync':
                fn = new Function(
                    this.args(),
                    this.header() + this.content()
                );
                break;
            case 'async':
                fn = new Function(
                    this.args({ after: '_callback' }),
                    this.header() + this.content({
                        onDone: () => `_callback();\n`
                    })
                );
                break;
            case 'promise':
                let tapsContent = this.content({
                    onDone: () => `_resolve();\n`
                });
                let content = `
                return new Promise((function (_resolve, _reject) {
                    ${tapsContent}
                }));
                `;
                fn = new Function(
                    this.args(),
                    this.header() + content
                );
                break;
        }
        this.deinit();
        return fn;
    }
    callTapsParallel({ onDone }) {//不同的钩子会调用不同的方法进行组合
        let { taps } = this.options;
        let code = `var _counter = ${taps.length}\n;`;
        code += `var _done = (function () {\n${onDone()}});`;
        for (let j = 0; j < taps.length; j++) {
            const content = this.callTap(j);//获取每一个事件函数对应拼出来的代码
            code += content;
        }
        return code;
    }
+   callTapsSeries({ onDone }) {
+       let { taps } = this.options;
+       if (taps.length === 0) return onDone();
+       let code = "";
+       let current = onDone;
+       for (let j = taps.length - 1; j >= 0; j--) {
+           const unroll = current !== onDone;
+           if (unroll) {
+                    code += `function _next${j}() {\n`;
+                    code += current();
+                    code += `}\n`;
+                    current = () => `_next${j}();\n`;
+                }
+           const done = current;
+           const content = this.callTap(j, { onDone: done });
+           current = () => content;
+       }
+       code += current();
+       return code;
+   }
    callTap(tapIndex,{onDone}) {//调用事件函数的代码是什么样子的,注册时候类型不同，执行时候执行方式也不行
        let code = '';
        let { interceptors = [] } = this.options;
        if (interceptors.length > 0) {
            code += `var _tap${tapIndex} = _taps[${tapIndex}];\n`;
            for (let i = 0; i < interceptors.length; i++) {
                let interceptor = interceptors[i];
                if (interceptor.tap)
                    code += `_interceptors[${i}].tap(_tap${tapIndex});\n`;
            }
        }
        code += `var _fn${tapIndex} = _x[${tapIndex}];\n`;
        let tap = this.options.taps[tapIndex];
        switch (tap.type) {//这个钩子注册的方式不一样，返回的代码也不一样
            case 'sync':
                code += `_fn${tapIndex}(${this.args()});\n`;
                break;
            case 'async':
                code += `_fn${tapIndex}(${this.args({
                    after: `function () {
+                       ${onDone()}
                }`})});`;
                break;
            case 'promise':
                code += `
                    var _promise${tapIndex} = _fn${tapIndex}(${this.args()});
                    _promise${tapIndex}.then((function () {
                        if (--_counter === 0) _done();
                    }));
                `;
                break;
            default:
                break;
        }
        return code;
    }
}
module.exports = HookCodeFactory;
```

## 7. interceptor

- 所有钩子都提供额外的拦截器API
  - call:(...args) => void当你的钩子触发之前,(就是call()之前),就会触发这个函数,你可以访问钩子的参数.多个钩子执行一次
  - tap: (tap: Tap) => void 每个钩子执行之前(多个钩子执行多个),就会触发这个函数
  - register:(tap: Tap) => Tap | undefined 每添加一个Tap都会触发 你interceptor上的register,你下一个拦截器的register 函数得到的参数 取决于你上一个register返回的值,所以你最好返回一个 tap 钩子.
- Context(上下文) 插件和拦截器都可以选择加入一个可选的 context对象, 这个可以被用于传递随意的值到队列中的插件和拦截器

### 7.1 使用

```js
const {SyncHook} = require('tapable');
const syncHook = new SyncHook(["name","age"]);
syncHook.intercept({
    register:(tapInfo)=>{//当你新注册一个回调函数的时候触发
        console.log(`拦截器1开始register`);
        return tapInfo;
    },
    tap:(tapInfo)=>{//每个回调函数都会触发一次
        console.log(`拦截器1开始tap`);
    },
    call:(name,age)=>{//每个call触发，所有的回调只会总共触发一次
        console.log(`拦截器1开始call`,name,age);
    }
});
syncHook.intercept({
    register:(tapInfo)=>{//当你新注册一个回调函数的时候触发
        console.log(`拦截器2开始register`);
        return tapInfo;
    },
    tap:(tapInfo)=>{//每个回调函数都会触发一次
        console.log(`拦截器2开始tap`);
    },
    call:(name,age)=>{//每个call触发，所有的回调只会总共触发一次
        console.log(`拦截器2开始call`,name,age);
    }
});


syncHook.tap({name:'回调函数A'},(name,age)=>{
   console.log(`回调A`,name,age);
});
//console.log(syncHook.taps[0]);
syncHook.tap({name:'回调函数B'},(name,age)=>{
    console.log('回调B',name,age);
});
debugger
syncHook.call('zhufeng',10);

/**
拦截器1开始register
拦截器2开始register
拦截器1开始register
拦截器2开始register

拦截器1开始call zhufeng 10
拦截器2开始call zhufeng 10

拦截器1开始tap
拦截器2开始tap
回调A zhufeng 10

拦截器1开始tap
拦截器2开始tap
回调B zhufeng 10
*/
(function anonymous(name, age) {
  var _x = this._x;
  var _taps = this.taps;

  var _interceptors = this.interceptors;
  _interceptors[0].call(name, age);
  _interceptors[1].call(name, age);

  var _tap0 = _taps[0];
  _interceptors[0].tap(_tap0);
  _interceptors[1].tap(_tap0);
  var _fn0 = _x[0];
  _fn0(name, age);

  var _tap1 = _taps[1];
  _interceptors[0].tap(_tap1);
  _interceptors[1].tap(_tap1);
  var _fn1 = _x[1];
  _fn1(name, age);
});
```

### 7.2 实现

#### 7.2.1 Hook.js

tapable\Hook.js

```diff
class Hook{
    constructor(args){
     if(!Array.isArray(args)) args=[];
     this.args = args;
     this.taps = [];
     this.call = CALL_DELEGATE;
     this.callAsync = CALL_ASYNC_DELEGATE;
     this.promise = PROMISE_DELEGATE;
+     this.interceptors = [];
    }
    tap(options,fn){
        this._tap("sync", options, fn);
    }
    tapAsync(options,fn){
        this._tap("async", options, fn);
    }
    tapPromise(options,fn){
        this._tap("promise", options, fn);
    }
    _tap(type, options, fn) {
        if(typeof options === 'string') 
            options={name:options};
        let tapInfo ={...options,type,fn};
+        tapInfo=this._runRegisterInterceptors(tapInfo);
        this._insert(tapInfo);
    }
+    _runRegisterInterceptors(tapInfo){
+        for(const interceptor of this.interceptors){
+            if(interceptor.register){
+             let newTapInfo = interceptor.register(tapInfo);
+             if(newTapInfo){
+                 tapInfo=newTapInfo;
+             }
+            }
+        }
+        return tapInfo;
+     }
+     intercept(interceptor){
+         this.interceptors.push(interceptor);
+     }
    _resetCompilation(){
        this.call = CALL_DELEGATE;
    }
    _insert(tapInfo){
        this._resetCompilation();
        this.taps.push(tapInfo);
    }
    compile(options) {
        throw new Error("Abstract: should be overridden");
    }
    _createCall(type){
        return this.compile({
            taps:this.taps,
            args:this.args,
+            interceptors:this.interceptors,
            type
        });
    }
}
const CALL_DELEGATE = function(...args) {
    this.call = this._createCall("sync");
    return this.call(...args);
};
const CALL_ASYNC_DELEGATE = function(...args) {
    this.callAsync = this._createCall("async");
    return this.callAsync(...args);
};
const PROMISE_DELEGATE = function(...args) {
    this.promise = this._createCall("promise");
    return this.promise(...args);
};
module.exports = Hook;
```

#### 7.2.2 HookCodeFactory.js

tapable\HookCodeFactory.js

```diff
class HookCodeFactory {
    setup(hookInstance, options) {
        hookInstance._x = options.taps.map(item => item.fn);
    }
    init(options) {
        this.options = options;
    }
    deinit() {
        this.options = null;
    }
    args(options = {}) {
        let { before, after } = options;
        let allArgs = this.options.args || [];
        if (before) allArgs = [before, ...allArgs];
        if (after) allArgs = [...allArgs, after];
        if (allArgs.length > 0)
            return allArgs.join(', ');
        return "";
    }
    header() {
        let code = "";
        code += "var _x = this._x;\n";
+        if(this.options.interceptors.length>0){
+            code += `var _taps = this.taps;\n`;
+            code += `var _interceptors = this.interceptors;\n`;
+        }
+        for(let k=0;k<this.options.interceptors.length;k++){
+            const interceptor=this.options.interceptors[k];
+            if(interceptor.call)
+                code += `_interceptors[${k}].call(${this.args()});\n`;
+        }
        return code;
    }
    create(options) {
        this.init(options);
        let fn;
        switch (this.options.type) {
            case 'sync':
                fn = new Function(
                    this.args(),
                    this.header() + this.content()
                )
                break;
            case 'async':
                fn = new Function(
                    this.args({after:'_callback'}),
                    this.header()+this.content({ onDone:()=>" _callback();\n"})
                )    
                break;    
            case 'promise':
                 let tapsContent = this.content({ onDone:()=>" _resolve();\n"});
                 let content = `return new Promise(function (_resolve, _reject) {
                     ${tapsContent}
                 })`;
                 fn = new Function(
                     this.args(),
                     this.header()+content
                 )    
                break;      
            default:
                break;    
        }
        this.deinit();
        return fn;
    }
    callTapsParallel({onDone}){
        let code = `var _counter = ${this.options.taps.length};\n`;
        code+=`
            var _done = function () {
                ${onDone()}
            };
        `;
        for (let j =0;j< this.options.taps.length ; j++) {
            const content = this.callTap(j);
            code += content;
        }
        return code;
    }
    callTapsSeries() {
        if (this.options.taps.length === 0) {
            return '';
        }
        let code = "";
        for (let j =0;j< this.options.taps.length ; j++) {
            const content = this.callTap(j);
            code += content;
        }
        return code;
    }
    callTap(tapIndex) {
        let code = "";
+        if(this.options.interceptors.length>0){
+         code += `var _tap${tapIndex} = _taps[${tapIndex}];`;
+         for(let i=0;i<this.options.interceptors.length;i++){
+            let interceptor = this.options.interceptors[i];
+            if(interceptor.tap){
+                code += `_interceptors[${i}].tap(_tap${tapIndex});`;
+            }
+         }        
+        }

        code += `var _fn${tapIndex} = _x[${tapIndex}];\n`
        let tap = this.options.taps[tapIndex];
        switch (tap.type) {
            case 'sync':
                code += `_fn${tapIndex}(${this.args()});\n`;
                break;
            case 'async':
                code += ` 
                    _fn${tapIndex}(${this.args({after:`function (_err${tapIndex}) {
                        if (--_counter === 0) _done();
                    }`})});
                `;
                break;   
            case 'promise':
               code = `
                   var _fn${tapIndex} = _x[${tapIndex}];
                   var _promise${tapIndex} = _fn${tapIndex}(${this.args()});
                   _promise${tapIndex}.then(
                       function () {
                        if (--_counter === 0) _done();
                       }
                   );
               `;       
            default:
                break;
        }
        return code;
    }
}
module.exports = HookCodeFactory;
```

## 8. HookMap

- A HookMap is a helper class for a Map with Hooks

#### 8.1 HookMap

```js
let {SyncHook,HookMap} = require('./tapable');
const keyedHookMap = new HookMap(()=>new SyncHook(["name"]));
keyedHookMap.for('key1').tap('plugin1',(name)=>{console.log(1,name);});
keyedHookMap.for('key1').tap('plugin2',(name)=>{console.log(2,name);});
const hook1 = keyedHookMap.get('key1');
hook1.call('zhufeng');
```

#### 8.2 tapable\index.js

tapable\index.js

```diff
let SyncHook = require('./SyncHook');
let AsyncParallelHook = require('./AsyncParallelHook');
+let HookMap = require('./HookMap');
module.exports = {
    SyncHook,
    AsyncParallelHook,
+    HookMap
}
```

#### 8.3 HookMap

```js
class HookMap {
  constructor(factory) {
    this._map = new Map();
    this._factory = factory;
  }
  get(key) {
    return this._map.get(key);
  }
  tapAsync(key, options, fn) {
    return this.for(key).tapAsync(options, fn);
  }
  tapPromise(key, options, fn) {
    return this.for(key).tapPromise(options, fn);
  }
  for(key) {
    const hook = this.get(key);
    if (hook) return hook;
    let newHook = this._factory();
    this._map.set(key, newHook);
    return newHook;
  }
}
module.exports = HookMap;
```

## 9. stage

### 9.1 stage

```js
let {SyncHook} = require('tapable');
let hook = new SyncHook(['name']);
debugger
hook.tap({name:'tap1',stage:1},(name)=>{
   console.log(1,name);
});
hook.tap({name:'tap3',stage:3},(name)=>{
   console.log(3,name);
});
hook.tap({name:'tap5',stage:5},(name)=>{
   console.log(4,name);
});
hook.tap({name:'tap2',stage:2},(name)=>{
   console.log(2,name);
});

hook.call('zhufeng');
```

### 9.2 tapable\Hook.js

tapable\Hook.js

```diff
class Hook{
    constructor(args){
     if(!Array.isArray(args)) args=[];
     this.args = args;
     this.taps = [];
     this.call = CALL_DELEGATE;
     this.callAsync = CALL_ASYNC_DELEGATE;
     this.promise = PROMISE_DELEGATE;
     this.interceptors = [];
    }
    tap(options,fn){
        this._tap("sync", options, fn);
    }
    tapAsync(options,fn){
        this._tap("async", options, fn);
    }
    tapPromise(options,fn){
        this._tap("promise", options, fn);
    }
    _tap(type, options, fn) {
        if(typeof options === 'string') 
            options={name:options};
        let tapInfo ={...options,type,fn};
        tapInfo=this._runRegisterInterceptors(tapInfo);
        this._insert(tapInfo);
    }
    _runRegisterInterceptors(tapInfo){
        for(const interceptor of this.interceptors){
            if(interceptor.register){
             let newTapInfo = interceptor.register(tapInfo);
             if(newTapInfo){
                 tapInfo=newTapInfo;
             }
            }
        }
        return tapInfo;
     }
     intercept(interceptor){
         this.interceptors.push(interceptor);
     }
    _resetCompilation(){
        this.call = CALL_DELEGATE;
    }
    _insert(tapInfo){
        this._resetCompilation();
+            let stage = 0;
+            if (typeof tapInfo.stage === "number") {
+                stage = tapInfo.stage;
+            }
+            let i = this.taps.length;
+            while (i > 0) {
+                i--;
+                const x = this.taps[i];
+                this.taps[i + 1] = x;
+                const xStage = x.stage || 0;
+                if (xStage > stage) {
+                    continue;
+                }
+                i++;
+                break;
+            }
+            this.taps[i] = tapInfo;
    }
    compile(options) {
        throw new Error("Abstract: should be overridden");
    }
    _createCall(type){
        return this.compile({
            taps:this.taps,
            args:this.args,
            interceptors:this.interceptors,
            type
        });
    }
}
const CALL_DELEGATE = function(...args) {
    this.call = this._createCall("sync");
    return this.call(...args);
};
const CALL_ASYNC_DELEGATE = function(...args) {
    this.callAsync = this._createCall("async");
    return this.callAsync(...args);
};
const PROMISE_DELEGATE = function(...args) {
    this.promise = this._createCall("promise");
    return this.promise(...args);
};
module.exports = Hook;
```

## 10. before

### 10.1 before.js

```js
let {SyncHook} = require('tapable');
let hook = new SyncHook(['name']);
debugger
hook.tap({name:'tap1'},(name)=>{
   console.log(1,name);
});
hook.tap({name:'tap3'},(name)=>{
   console.log(3,name);
});
hook.tap({name:'tap5'},(name)=>{
   console.log(4,name);
});
hook.tap({name:'tap2',before:['tap3','tap5']},(name)=>{
   console.log(2,name);
});

hook.call('zhufeng');
```

### 10.2 Hook.js

```diff
class Hook{
    constructor(args){
     if(!Array.isArray(args)) args=[];
     this.args = args;
     this.taps = [];
     this.call = CALL_DELEGATE;
     this.callAsync = CALL_ASYNC_DELEGATE;
     this.promise = PROMISE_DELEGATE;
     this.interceptors = [];
    }
    tap(options,fn){
        this._tap("sync", options, fn);
    }
    tapAsync(options,fn){
        this._tap("async", options, fn);
    }
    tapPromise(options,fn){
        this._tap("promise", options, fn);
    }
    _tap(type, options, fn) {
        if(typeof options === 'string') 
            options={name:options};
        let tapInfo ={...options,type,fn};
        tapInfo=this._runRegisterInterceptors(tapInfo);
        this._insert(tapInfo);
    }
    _runRegisterInterceptors(tapInfo){
        for(const interceptor of this.interceptors){
            if(interceptor.register){
             let newTapInfo = interceptor.register(tapInfo);
             if(newTapInfo){
                 tapInfo=newTapInfo;
             }
            }
        }
        return tapInfo;
     }
     intercept(interceptor){
         this.interceptors.push(interceptor);
     }
    _resetCompilation(){
        this.call = CALL_DELEGATE;
    }
    _insert(tapInfo){
        this._resetCompilation();
+       let before;
+            if (typeof tapInfo.before === "string") {
+                before = new Set([tapInfo.before]);
+            } else if (Array.isArray(tapInfo.before)) {
+                before = new Set(tapInfo.before);
+            }
        let stage = 0;
        if (typeof tapInfo.stage === "number") {
            stage = tapInfo.stage;
        }
        let i = this.taps.length;
        while (i > 0) {
            i--;
            const x = this.taps[i];
            this.taps[i + 1] = x;
      const xStage = x.stage || 0;
+     if (before) {
+                if (before.has(x.name)) {
+                    before.delete(x.name);
+                    continue;
+                }
+                if (before.size > 0) {
+                    continue;
+                }
            }
            if (xStage > stage) {
                continue;
            }
            i++;
            break;
        }
        this.taps[i] = tapInfo;
    }
    compile(options) {
        throw new Error("Abstract: should be overridden");
    }
    _createCall(type){
        return this.compile({
            taps:this.taps,
            args:this.args,
            interceptors:this.interceptors,
            type
        });
    }
}
const CALL_DELEGATE = function(...args) {
    this.call = this._createCall("sync");
    return this.call(...args);
};
const CALL_ASYNC_DELEGATE = function(...args) {
    this.callAsync = this._createCall("async");
    return this.callAsync(...args);
};
const PROMISE_DELEGATE = function(...args) {
    this.promise = this._createCall("promise");
    return this.promise(...args);
};
module.exports = Hook;
```



