---
title: webpack进阶（三）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# webpack-5.prepare

## 1. yargs

- [yargs](http://yargs.js.org/)模块能够解决如何处理命令行参数

### 1.1 安装

```js
cnpm install yargs --save
```

### 1.2 读取命令行参数

- yargs模块提供了argv对象，用来读取命令行参数

hello.js

~~~js
#!/usr/bin/env node
let argv = require('yargs')
    .alias('n', 'name')//还可以指定参数别名  -n的别名是--name
    .demand(['n'])//是否必填
    .default({ name: 'zhufeng' })//默认值
    .describe({ name: '你的姓名' })// 参数描述
    .boolean(['private'])
    .argv;
console.log(process.argv);
console.log(argv);
console.log('hello', argv.name);
console.log(argv._);//argv对象有一个下划线属性，可以获取非连词线开头的参数

```js
node hello.js --private  A B C
[
  'C:\\Program Files\\nodejs\\node.exe',
  'C:\\vipdata\\prepare6\\zhufeng_loader\\5.js',
  '--private',
  'A',
  'B',
  'C'
]
{
  _: [ 'A', 'B', 'C' ],
  private: true,
  name: 'zhufeng',
  n: 'zhufeng',
  '$0': '5.js'
}
hello zhufeng
[ 'A', 'B', 'C' ]
#!/usr/bin/env node
let argv = require('yargs')
    .option('n',//参数n
        {
            alias: 'name',//别名name
            demand: true,//必填
            default: 'zhufeng',//默认值
            describe: '你的姓名',//描述
            type: 'string',//参数类型
        }).usage('Usage: hello [options]')// 用法格式
    .example('hello -n zhufeng', 'hello zhufeng')//示例
    .help('h')//显示帮助 信息
    .alias('h', 'help')//显示帮助信息
    .epilog('copyright 2019')//出现在帮助信息的结尾
    .argv
console.log(process.argv);
console.log(argv);
console.log('hello', argv.name);
console.log(argv._);//argv对象有一个下划线属性，可以获取非连词线开头的参数

```js
node hello.js -n jiagou
[
  'C:\\Program Files\\nodejs\\node.exe',
  'C:\\vipdata\\prepare6\\zhufeng_loader\\6.js',
  '-n',
  'jiagou'
]
{ _: [], n: 'jiagou', name: 'jiagou', '$0': '6.js' }
hello jiagou
[]
~~~

## 2. Semaphore

- [this.semaphore](https://github.com/webpack/webpack/blob/v4.39.3/lib/Compilation.js#L857-L971)
- [Semaphore.js](https://github.com/webpack/webpack/blob/94929a59a79bc79cab789804d5592c3ec0605cc4/lib/util/Semaphore.js)
- [Semaphore](https://www.npmjs.com/package/semaphore)
- Semaphore(信号量)控制并发访问量

### 2.1 使用Semaphore

```js
let Semaphore = require('semaphore');
let semaphore = new Semaphore(2);
console.time('cost');
semaphore.take(function () {
    setTimeout(() => {
        console.log(1);
        semaphore.leave();
    }, 1000);
});
semaphore.take(function () {
    setTimeout(() => {
        console.log(1);
        semaphore.leave();
    }, 2000);
});
semaphore.take(function () {
    console.log(3);
    semaphore.leave();
    console.timeEnd('cost');
});
```

### 2.2 实现Semaphore

```js
class Semaphore {
    constructor(available) {
        this.available = available;
        this.waiters = [];
        this._continue = this._continue.bind(this);
    }

    take(callback) {
        if (this.available > 0) {
            this.available--;
            callback();
        } else {
            this.waiters.push(callback);
        }
    }

    leave() {
        this.available++;
        if (this.waiters.length > 0) {
            process.nextTick(this._continue);
        }
    }

    _continue() {
        if (this.available > 0) {
            if (this.waiters.length > 0) {
                this.available--;
                const callback = this.waiters.pop();
                callback();
            }
        }
    }
}
```

### 2.3 webpack中的Semaphore

```diff
class Semaphore {
    constructor(available) {
        this.available = available;
        this.waiters = [];
        this._continue = this._continue.bind(this);
    }

+    acquire(callback) {
        if (this.available > 0) {
            this.available--;
            callback();
        } else {
            this.waiters.push(callback);
        }
    }

+    release() {
        this.available++;
        if (this.waiters.length > 0) {
            process.nextTick(this._continue);
        }
    }

    _continue() {
        if (this.available > 0) {
            if (this.waiters.length > 0) {
                this.available--;
                const callback = this.waiters.pop();
                callback();
            }
        }
    }
}
```

## 3. neo-async

- [webpack\lib\Compilation.js](https://github.com/webpack/webpack/blob/v4.39.3/lib/Compilation.js#L836)
- [neo-async](https://www.npmjs.com/package/neo-async)
- neo-async库和async库类似，都是为异步编程提供一些工具方法，但是会比async库更快

### 3.1 使用

```js
let {forEach} = require('neo-async');
console.time('cost');
let array = [1, 2, 3];
forEach(array, function (num, done) {
    setTimeout(function () {
        console.log(num);
        done();
    }, num * 1000);
}, function (err) {
    console.timeEnd('cost');
});
```

### 3.2 实现

```js
function forEach(array, iterator, callback) {
    let length = array.length;
    function done() {
        if (--length == 0)
            callback();
    }
    array.forEach((item, index) => {
        iterator(item, done);
    });
}
```

## 4.acorn

### 4.1 介绍

- [astexplorer](https://astexplorer.net/)可以把代码转成语法树
- [acorn](https://github.com/acornjs/acorn) A small, fast, JavaScript-based JavaScript parser
- `acorn` 解析结果符合[The Estree Spec](https://github.comb/estree/estree)规范(（这是 Mozilla 的工程师给出的 SpiderMonkey 引擎输出的 JavaScript AST 的规范文档[SpiderMonkey](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API))

![ast](http://img.zhufengpeixun.cn/ast.jpg)

```js
const ast = acorn.parse(code, options);
```

### 4.2 配置项

- ecmaVersion 你要解析的 JavaScript 的 ECMA 版本,默认是 ES7
- sourceType 这个配置项有两个值：module 和 script，默认是 script.主要是严格模式和 import/export 的区别.
- locations 默认值是 false，设置为 true 之后会在 AST 的节点中携带多一个 loc 对象来表示当前的开始和结束的行数和列数。
- onComment 传入一个回调函数，每当解析到代码中的注释时会触发，可以获取当年注释内容，参数列表是：[block, text, start, end],block 表示是否是块注释，text 是注释内容，start 和 end 是注释开始和结束的位置

### 4.2 查找依赖

```js
const acorn = require("acorn")
const walk = require("acorn-walk");
const escodegen = require('escodegen');
const ast = acorn.parse(`
import $ from 'jquery';
let _ = require('lodash');
`, { locations: true, ranges: true, sourceType: 'module', ecmaVersion: 8 });
let resources = [];
walk.simple(ast, {
    CallExpression(node) {
        if (
            node.type === 'CallExpression' &&
            node.callee.type === 'Identifier' &&
            node.callee.name === 'require' &&
            node.arguments.length === 1 &&
            node.arguments[0].type === 'Literal'
        ) {
            const args = node.arguments;
            resources.push({
                module: args[0].value
            })
        }
    },
    ImportDeclaration(node) {
        node.specifiers[0].local.name = 'jQuery';
        resources.push({
            module: node.source.value
        })
    }
})
console.log('resources', resources);
let result = escodegen.generate(ast);
console.log(result);
```



# webpack-6.resolve

## 1. webpack整体工作流程

- [resolve](https://webpack.docschina.org/configuration/resolve/#resolve)

![resolve](http://img.zhufengpeixun.cn/resolve.jpg)

## 2. resolve入口

![resovlerequest](http://img.zhufengpeixun.cn/resovlerequest.jpg)

- resolve 流程开始的入口在 `factory` 阶段
- [NormalModuleFactory](https://github.com/webpack/webpack/blob/v4.43.0/lib/NormalModuleFactory.js#L123-L158)

```js
this.hooks.factory.tap("NormalModuleFactory", () => (result, callback) => {
    let resolver = this.hooks.resolver.call(null);
    resolver(result, (err, data) => {
        this.hooks.afterResolve.callAsync(data, (err, result) => {    });
    });
});
```

- [NormalModuleFactory](https://github.com/webpack/webpack/blob/v4.43.0/lib/NormalModuleFactory.js#L159-L371)

```js
this.hooks.resolver.tap("NormalModuleFactory", () => (data, callback) => {
    // import '!style-loader!css-loader!./index.css';
    let elements = request.split("!");
    let resource = elements.pop();
    const loaderResolver = this.getResolver("loader");
    const normalResolver = this.getResolver("normal");
    let loaders = loaderResolver.resolve(elements);
    let request = normalResolver.resolve(resource);
})
```

[ResolverFactory](https://github.com/webpack/webpack/blob/v4.43.0/lib/ResolverFactory.js#L44-L52)

![getResolver](http://img.zhufengpeixun.cn/getResolver.jpg)

```js
    get(type, resolveOptions) {
        const newResolver = this._create(type, resolveOptions);
        return newResolver;
    }
```

![Resolver](https://github.com/webpack/enhanced-resolve/blob/v4.1.1/lib/Resolver.js#L151-L218)

```js
resolve(context, path, request, resolveContext, callback) {
    return this.doResolve(this.hooks.resolve,obj);
}
```

## 3. resolve流程

- [UnsafeCachePlugin](https://github.com/webpack/enhanced-resolve/blob/v4.1.1/lib/UnsafeCachePlugin.js) 增加缓存
- [ParsePlugin](https://github.com/webpack/enhanced-resolve/blob/v4.1.1/lib/ParsePlugin.js) 初步解析路径
- [DescriptionFilePlugin](https://github.com/webpack/enhanced-resolve/blob/v4.1.1/lib/DescriptionFilePlugin.js) 查看package.json文件
- [AliasFieldPlugin](https://github.com/webpack/enhanced-resolve/blob/v4.1.1/lib/AliasFieldPlugin.js) 读取package.json中的别名
- [AliasPlugin](https://github.com/webpack/enhanced-resolve/blob/v4.1.1/lib/AliasPlugin.js)取配置项中的别名
- [ModuleKindPlugin](https://github.com/webpack/enhanced-resolve/blob/v4.1.1/lib/ModuleKindPlugin.js) 判断是模块
- [ModulesInHierachicDirectoriesPlugin](https://github.com/webpack/enhanced-resolve/blob/v4.1.1/lib/ModulesInHierachicDirectoriesPlugin.js)
- [JoinRequestPlugin](https://github.com/webpack/enhanced-resolve/blob/v4.1.1/lib/JoinRequestPlugin.js) 连接得到两个完整的路径
- [FileKindPlugin](https://github.com/webpack/enhanced-resolve/blob/v4.1.1/lib/FileKindPlugin.js) 判断是否为一个 directory
- [DirectoryExistsPlugin](https://github.com/webpack/enhanced-resolve/blob/v4.1.1/lib/DirectoryExistsPlugin.js) 判断directory是否存在
- [MainFieldPlugin](https://github.com/webpack/enhanced-resolve/blob/v4.1.1/lib/MainFieldPlugin.js) 读取package.json中的main字段
- [UseFilePlugin](https://github.com/webpack/enhanced-resolve/blob/v4.1.1/lib/UseFilePlugin.js) 试图读取目录下的index文件
- [FileExistsPlugin](https://github.com/webpack/enhanced-resolve/blob/v4.1.1/lib/FileExistsPlugin.js) 读取 request.path 所在的文件，看文件是否存在
- [ResultPlugin](https://github.com/webpack/enhanced-resolve/blob/v4.1.1/lib/ResultPlugin.js) 生成结果

![resolveflow3](http://img.zhufengpeixun.cn/resolveflow3.jpg)

### 3.1 doResolve

- [Resolver.js](https://github.com/webpack/enhanced-resolve/blob/v4.1.1/lib/Resolver.js)

```js
let { AsyncSeriesBailHook } = require('tapable');
let resolveHook = new AsyncSeriesBailHook(["request", "innerContext"]);
let resultHook = new AsyncSeriesBailHook(["content", "innerContext"]);
let resolver = {
    doResolve(resolveHook, request, callback) {
        return resolveHook.callAsync(request, (err, result) => {
            if (err) return callback(err);
            if (result) return callback(null, result);
        });
    }
}
resultHook.tapAsync('resultHook', (content, callback) => {
    console.log('resultHook');
    callback(null, content);
});
resolveHook.tapAsync('resolveHook', (request, callback) => {
    console.log('resolveHook');
    let content = request + '的内容';
    resolver.doResolve(resultHook, content, (err, result) => {
        callback(err, result);
    });
});
resolver.doResolve(resolveHook, './src/index.js', (err, result) => {
    console.log(result);
    console.log('完成');
})
```

### 3.1 resolve流程

- node_modules_[enhanced-resolve@4.1.1](mailto:enhanced-resolve@4.1.1)@enhanced-resolve

#### 3.1.1 index.js

index.js

```js
let a = 10;
```

#### 3.1.2 cli.js

```js
const webpack = require("webpack");
const webpackOptions = require("./webpack.config");
const compiler = webpack(webpackOptions);
compiler.run((err, stats) => {
    console.log(err);
    console.log(stats);
});
```

#### 3.1.3 流程

```js
//{path:"c:\vipdata\webpackdemo",request:"./src/index.js"}
const obj = {path: path,request: request};
```

UnsafeCachePlugin

```js
resolver.doResolve('newResolve');
```

ParsePlugin

```js
/**
 obj = {
    directory:false
    file:false
    module:false
    query:""
    request:"./src/index.js"
 }
 */
resolver.doResolve('parsedResolve', obj);
```

DescriptionFilePlugin

```js
/*
obj={
descriptionFileData:Object {name: "webpackdemo", version: "1.0.0", description: "", …}
descriptionFilePath:"c:\vipdata\webpackdemo\package.json"
descriptionFileRoot:"c:\vipdata\webpackdemo"
directory:false
file:false
module:false
path:"c:\vipdata\webpackdemo"
query:""
relativePath:"."
request:"./src/index.js"
}
*/
resolver.doResolve('describedResolve',obj);
```

AliasFieldPlugin

```js
browser
```

AliasPlugin

```js
alias
/***
 obj = {
    __innerRequest:"./src/index.js"
    __innerRequest_relativePath:"./src/index.js"
    descriptionFileData:Object {name: "webpackdemo", version: "1.0.0", description: "", …}
    descriptionFilePath:"c:\vipdata\webpackdemo\package.json"
    descriptionFileRoot:"c:\vipdata\webpackdemo"
    file:false
    module:false
    path:"c:\vipdata\webpackdemo\src\index.js"
    relativePath:"./src/index.js"
 }
 * /
```



# webpack-7.loader

## 1.loader 的配置

### 1.1 webpack config

```js
module: {
        rules: [
            {
                test: /\.css/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            }
        ]
}
```

### 1.2 inline内联

```js
import 'style-loader!css-loader!style.css';
```

## 2.RuleSet

- RuleSet 类主要作用于过滤加载 module 时符合匹配条件规则的 loader
- RuleSet 在内部会有一个默认的 module.defaultRules 配置
- 在真正加载 module 之前会和你在 webpack config 配置文件当中的自定义 module.rules 进行合并，然后转化成对应的匹配过滤器
- [WebpackOptionsDefaulter](https://github.com/webpack/webpack/blob/v4.43.0/lib/WebpackOptionsDefaulter.js#L60)
- [RuleSet](https://github.com/webpack/webpack/blob/v4.43.0/lib/RuleSet.js#L104)

```js
[
    { type: 'javascript/auto', resolve: {} },
    { test: /\.mjs$/i,type: 'javascript/esm',resolve: { mainFields: [Array] } },
    { test: /\.json$/i, type: 'json' },
    { test: /\.wasm$/i, type: 'webassembly/experimental' }
]
class NormalModuleFactory {
    this.ruleSet = new RuleSet(options.defaultRules.concat(options.rules));
}
```

### 2.1 rule配置

- test 用以匹配满足条件的 loader
- include 用以匹配满足条件的 loader
- exclude 排除满足条件 loader
- resource [condition](https://github.com/webpack/webpack/blob/v4.43.0/lib/RuleSet.js#L183)
- resourceQuery 在路径中带 query 参数的匹配规则
- [normalizeRule](https://github.com/webpack/webpack/blob/v4.43.0/lib/RuleSet.js#L183)作用实际就是对传入的 rules 配置进行序列化(格式化)的处理为统一的格式
- [normalizeCondition](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/RuleSet.js#L413) 函数执行后始终返回的是一个函数，这个函数的用途就是接受模块的路径，然后使用你所定义的匹配使用去看是否满足对应的要求，如果满足那么会使用这个 loader，如果不满足那么便会过滤掉
- 在 RuleSet 构造函数内部使用静态方法[normalizeUse](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/RuleSet.js#L351) 方法来输出最终和 condition 对应的 rule 结果
- 经过 normalizeUse 函数的格式化处理，最终的 rule 结果为一个数组，内部的 object 元素都包含 loader/options 等字段

```js
static normalizeRule(rule, refs, ident) {
    let condition = {
        test: rule.test,
        include: rule.include,
        exclude: rule.exclude
    };
    newRule.resource = RuleSet.normalizeCondition(condition);
}
static normalizeCondition(condition) {
    if (typeof condition === "string") {
        return str => str.indexOf(condition) === 0;
    }
    if (typeof condition === "function") {
        return condition;
    }
    if (condition instanceof RegExp) {
        return condition.test.bind(condition);
    }
}
static normalizeUse(use, ident) {
    if (typeof use === "function") {
            return data => RuleSet.normalizeUse(use(data), ident);
    }
}
```

normalizeUse结果

```js
[
    {loader:'style-loader'},
    {loader:'css-loader'}
]
```

rules:

```js
 [
  {
    resource: [Function],
    resourceQuery: [Function],
    use: [  
      {loader:'style-loader'},
      {loader:'css-loader'}
    ]
  }
]
```

[ruleSet.exec](https://github.com/webpack/webpack/blob/v4.43.0/lib/NormalModuleFactory.js#L270)

```js
const result = this.ruleSet.exec({
    resource: resourcePath,
    resourceQuery
});
[
    {
        type: 'use',
        value: {
            loader: 'style-loader',
            options: {}
        },
        enforce: undefined
    },
    {
        type: 'use',
        value: {
            loader: 'css-loader',
            options: {}
        },
        enforce: undefined
    }
]
```

## 3.创建模块

- [实例化ruleSet](https://github.com/webpack/webpack/blob/v4.43.0/lib/NormalModuleFactory.js#L115)
- [RuleSet](https://github.com/webpack/webpack/blob/v4.43.0/lib/RuleSet.js)
- [Compilation.moduleFactory.create](https://github.com/webpack/webpack/blob/v4.43.0/lib/Compilation.js)
- [NormalModuleFactory.create](https://github.com/webpack/webpack/blob/v4.43.0/lib/NormalModuleFactory.js#L373)
- [resolver](https://github.com/webpack/webpack/blob/v4.43.0/lib/NormalModuleFactory.js#L159-L371)

![webpackloaderflow](http://img.zhufengpeixun.cn/webpackloaderflow.jpg)

## 4.编译模块

- [Compilation.buildModule](https://github.com/webpack/webpack/blob/v4.43.0/lib/Compilation.js#L1111)
- [Compilation.module.build](https://github.com/webpack/webpack/blob/v4.43.0/lib/Compilation.js#L739)
- [NormalModule.js.build](https://github.com/webpack/webpack/blob/v4.43.0/lib/NormalModule.js#L427)
- [NormalModule.doBuild](https://github.com/webpack/webpack/blob/v4.43.0/lib/NormalModule.js#L287)
- [NormalModule.runLoaders](https://github.com/webpack/webpack/blob/v4.43.0/lib/NormalModule.js#L295)
- [NormalModule.parser](https://github.com/webpack/webpack/blob/v4.43.0/lib/NormalModule.js#L482)

![ruleloader](http://img.zhufengpeixun.cn/ruleloader.jpg)

Powered by [idoc](https://github.com/jaywcjlove/idoc). Dependence [Node.js](https://nodejs.org/) run.



