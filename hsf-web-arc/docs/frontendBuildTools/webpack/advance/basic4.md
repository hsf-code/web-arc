---
title: webpack分析（四）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# 8.webpack-source

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

## 2.webpack流程

- Compiler 对象包含了Webpack环境所有的的配置信息，包含 options，loaders，plugins 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的
- Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建
- Compiler 和 Compilation 的区别在于： Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译

![5076d044e0e211c3330581d4048613c8](https://img.zhufengpeixun.com/5076d044e0e211c3330581d4048613c8)

## 3.所有的钩子

- "version": "5.34.0"
- [Compiler Hooks](https://webpack.js.org/api/compiler-hooks/)
- [Compilation Hooks](https://webpack.js.org/api/compilation-hooks/)
- [NormalModuleFactory Hooks](https://webpack.js.org/api/normalmodulefactory-hooks/)
- [ContextModuleFactory Hooks](https://webpack.js.org/api/contextmodulefactory-hooks/)
- [JavascriptParser Hooks](https://webpack.js.org/api/parser/)

| 对象                | 钩子名称                            | 钩子类型 | 参数                               |
| :------------------ | :---------------------------------- | :------- | :--------------------------------- |
| Compiler            | environment                         | Hook     |                                    |
| Compiler            | afterEnvironment                    | Hook     |                                    |
| Compiler            | entryOption                         | Hook     | context,entry                      |
| Compiler            | afterPlugins                        | Hook     | compiler                           |
| Compiler            | afterResolvers                      | Hook     | compiler                           |
| Compiler            | initialize                          | Hook     |                                    |
| Compiler            | beforeRun                           | Hook     | compiler                           |
| Compiler            | run                                 | Hook     | compiler                           |
| Compiler            | normalModuleFactory                 | Hook     | normalModuleFactory                |
| Compiler            | contextModuleFactory                | Hook     | contextModuleFactory               |
| Compiler            | beforeCompile                       | Hook     | params                             |
| Compiler            | compile                             | Hook     | params                             |
| Compiler            | thisCompilation                     | Hook     | compilation,params                 |
| Compiler            | compilation                         | Hook     | compilation,params                 |
| Compiler            | make                                | Hook     | compilation                        |
| Compilation         | addEntry                            | Hook     | entry,options                      |
| NormalModuleFactory | beforeResolve                       | Hook     | resolveData                        |
| NormalModuleFactory | factorize                           | Hook     | resolveData                        |
| NormalModuleFactory | resolve                             | Hook     | resolveData                        |
| NormalModuleFactory | afterResolve                        | Hook     | resolveData                        |
| NormalModuleFactory | createModule                        | Hook     | createData,resolveData             |
| NormalModuleFactory | module                              | Hook     | module,createData,resolveData      |
| Compilation         | buildModule                         | Hook     | module                             |
| Compilation         | normalModuleLoader                  | Hook     | loaderContext,module               |
| JavascriptParser    | program                             | Hook     | ast,comments                       |
| JavascriptParser    | preStatement                        | Hook     | statement                          |
| JavascriptParser    | blockPreStatement                   | Hook     | declaration                        |
| JavascriptParser    | statement                           | Hook     | statement                          |
| JavascriptParser    | finish                              | Hook     | ast,comments                       |
| Compilation         | succeedModule                       | Hook     | module                             |
| Compilation         | succeedEntry                        | Hook     | entry,options,module               |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compiler            | finishMake                          | Hook     | compilation                        |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | finishModules                       | Hook     | modules                            |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | seal                                | Hook     |                                    |
| Compilation         | optimizeDependencies                | Hook     | modules                            |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | afterOptimizeDependencies           | Hook     | modules                            |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | beforeChunks                        | Hook     |                                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | afterChunks                         | Hook     | chunks                             |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | optimize                            | Hook     |                                    |
| Compilation         | optimizeModules                     | Hook     | modules                            |
| Compilation         | afterOptimizeModules                | Hook     | modules                            |
| Compilation         | optimizeChunks                      | Hook     | chunks,chunkGroups                 |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | afterOptimizeChunks                 | Hook     | chunks,chunkGroups                 |
| Compilation         | optimizeTree                        | Hook     | chunks,modules                     |
| Compilation         | afterOptimizeTree                   | Hook     | chunks,modules                     |
| Compilation         | optimizeChunkModules                | Hook     | chunks,modules                     |
| Compilation         | afterOptimizeChunkModules           | Hook     | chunks,modules                     |
| Compilation         | shouldRecord                        | Hook     |                                    |
| Compilation         | reviveModules                       | Hook     | modules,records                    |
| Compilation         | beforeModuleIds                     | Hook     | modules                            |
| Compilation         | moduleIds                           | Hook     | modules                            |
| Compilation         | optimizeModuleIds                   | Hook     | modules                            |
| Compilation         | afterOptimizeModuleIds              | Hook     | modules                            |
| Compilation         | reviveChunks                        | Hook     | chunks,records                     |
| Compilation         | beforeChunkIds                      | Hook     | chunks                             |
| Compilation         | chunkIds                            | Hook     | chunks                             |
| Compilation         | optimizeChunkIds                    | Hook     | chunks                             |
| Compilation         | afterOptimizeChunkIds               | Hook     | chunks                             |
| Compilation         | recordModules                       | Hook     | modules,records                    |
| Compilation         | recordChunks                        | Hook     | chunks,records                     |
| Compilation         | optimizeCodeGeneration              | Hook     | modules                            |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | beforeModuleHash                    | Hook     |                                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | afterModuleHash                     | Hook     |                                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | beforeCodeGeneration                | Hook     |                                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | afterCodeGeneration                 | Hook     |                                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | beforeRuntimeRequirements           | Hook     |                                    |
| Compilation         | additionalModuleRuntimeRequirements | Hook     | module,runtimeRequirements,context |
| Compilation         | additionalChunkRuntimeRequirements  | Hook     | chunk,runtimeRequirements,context  |
| Compilation         | additionalTreeRuntimeRequirements   | Hook     | chunk,runtimeRequirements,context  |
| Compilation         | afterRuntimeRequirements            | Hook     |                                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | beforeHash                          | Hook     |                                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | chunkHash                           | Hook     | chunk,chunkHash,ChunkHashContext   |
| Compilation         | contentHash                         | Hook     | chunk                              |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | fullHash                            | Hook     | hash                               |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | afterHash                           | Hook     |                                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | recordHash                          | Hook     | records                            |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | beforeModuleAssets                  | Hook     |                                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | shouldGenerateChunkAssets           | Hook     |                                    |
| Compilation         | beforeChunkAssets                   | Hook     |                                    |
| Compilation         | renderManifest                      | Hook     | result,options                     |
| Compilation         | assetPath                           | Hook     | path,options,assetInfo             |
| Compilation         | chunkAsset                          | Hook     | chunk,filename                     |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | additionalChunkAssets               | Object   | undefined                          |
| Compilation         | additionalAssets                    | Object   | undefined                          |
| Compilation         | optimizeAssets                      | Hook     | assets                             |
| Compilation         | processAssets                       | Hook     | assets                             |
| Compilation         | optimizeChunkAssets                 | Object   | undefined                          |
| Compilation         | afterOptimizeChunkAssets            | Object   | undefined                          |
| Compilation         | afterOptimizeAssets                 | Hook     | assets                             |
| Compilation         | afterProcessAssets                  | Hook     | assets                             |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | record                              | Hook     | compilation,records                |
| Compilation         | needAdditionalSeal                  | Hook     |                                    |
| Compilation         | afterSeal                           | Hook     |                                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compiler            | afterCompile                        | Hook     | compilation                        |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compiler            | shouldEmit                          | Hook     | compilation                        |
| Compiler            | emit                                | Hook     | compilation                        |
| Compilation         | assetPath                           | Hook     | path,options,assetInfo             |
| Compiler            | afterEmit                           | Hook     | compilation                        |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | needAdditionalPass                  | Hook     |                                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compiler            | done                                | Hook     | stats                              |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compilation         | log                                 | Hook     | origin,logEntry                    |
| Compiler            | afterDone                           | Hook     | stats                              |

## 4.钩子代码

- [webpack仓库](https://gitee.com/zhufengpeixun/webpack/blob/master)

| 类型        | 事件名称                    | 类型              | 参数                                  | 说明                                                         | 发射事件码                                                   | 对应插件                                                     |
| :---------- | :-------------------------- | :---------------- | :------------------------------------ | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| compiler    | environment                 | SyncHook          | 空                                    | 准备编译环境，webpack plugins 配置初始化完成之后             | [webpack.js#L80](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/webpack.js#L80) | [NodeEnvironmentPlugin](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/node/NodeEnvironmentPlugin.js) |
| compiler    | afterEnvironment            | SyncHook          | 空                                    | 编译环境准备好之后                                           | [webpack.js#L81](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/webpack.js#L81) |                                                              |
| compiler    | entryOption                 | SyncBailHook      | context,entry                         | 在 webpack 中的 entry 配置处理过之后                         | [WebpackOptionsApply.js#L284](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/WebpackOptionsApply.js#L284) | [EntryOptionPlugin](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/EntryOptionPlugin.js),[SingleEntryPlugin](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/SingleEntryPlugin.js) |
| compiler    | afterPlugins                | SyncHook          | compiler                              | 初始化完内置插件之后                                         | [WebpackOptionsApply.js#L606](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/WebpackOptionsApply.js#L606) |                                                              |
| compiler    | afterResolvers              | SyncHook          | compiler                              | resolver 完成之后                                            | [WebpackOptionsApply.js#L626](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/WebpackOptionsApply.js#L626) |                                                              |
| compiler    | beforeRun                   | AsyncSeriesHook   | compiler                              | 开始正式编译之前                                             | [Compiler.js#L508](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compiler.js#L508) |                                                              |
| compiler    | run                         | AsyncSeriesHook   | compiler                              | 开始编译之后，读取 records 之前；监听模式触发 watch-run      | [Compiler.js#L511](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compiler.js#L511) |                                                              |
| compiler    | normalModuleFactory         | SyncHook          | normalModuleFactory                   | NormalModuleFactory 创建之后                                 | [Compiler.js#L063](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compiler.js#L063) |                                                              |
| compiler    | contextModuleFactory        | SyncHook          | contextModulefactory                  | ContextModuleFactory 创建之后                                | [Compiler.js#L069](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compiler.js#L069) |                                                              |
| compiler    | beforeCompile               | AsyncSeriesHook   | params                                | compilation 实例化需要的参数创建完毕之后                     | [Compiler.js#1088](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compiler.js#1088) |                                                              |
| compiler    | compile                     | SyncHook          | params                                | 一次 compilation 编译创建之前                                | [Compiler.js#L1091](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compiler.js#L1091) |                                                              |
| compiler    | thisCompilation             | SyncHook          | compilation,params                    | 触发 compilation 事件之前执行                                | [Compiler.js#L1049](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compiler.js#L1049) |                                                              |
| compiler    | compilation                 | SyncHook          | compilation,params                    | compilation 创建成功之后                                     | [Compiler.js#L1050](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compiler.js#L1050) |                                                              |
| compiler    | make                        | AsyncParallelHook | compilation                           | 完成编译之前                                                 | [Compiler.js#L1098](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compiler.js#L1098) | [SingleEntryPlugin](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/SingleEntryPlugin.js) |
| compilation | addEntry                    | SyncHook          | entry,name                            | 增加入口                                                     | [Compilation.js#L1948](https://github.com/webpack/webpack/blob/master/lib/Compilation.js#L1948) |                                                              |
| compilation | buildModule                 | SyncHook          | module                                | 在模块构建开始之前触发                                       | [Compilation.js#L1347](https://github.com/webpack/webpack/blob/master/lib/Compilation.js#L1347) |                                                              |
| compilation | succeedModule               | SyncHook          | module                                | 模块构建成功时执行                                           | [Compilation.js#L1374](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L1374) |                                                              |
| compilation | succeedEntry                | SyncHook          | entry,name,module                     |                                                              | [Compilation.js#L1964](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L1964) |                                                              |
| compilation | finishModules               | AsyncSeriesHook   | modules                               | 所有模块都完成构建                                           | [Compilation.js#L2209](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2209) |                                                              |
| compilation | seal                        | SyncHook          |                                       | 编译（compilation）停止接收新模块时触发                      | [Compilation.js#L2271](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2271) |                                                              |
| compilation | optimizeDependencies        | SyncBailHook      | modules                               | 依赖优化开始时触发                                           | [Compilation.js#L2274](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2274) |                                                              |
| compilation | beforeChunks                | SyncHook          |                                       | 开始生成代码块                                               | [Compilation.js#L2281](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2281) |                                                              |
| compilation | dependencyReferencedExports | SyncWaterfallHook | dependencyReference,dependency,module | 依赖引用                                                     | [Compilation.js#L3084](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L3084) |                                                              |
| compilation | log                         | SyncBailHook      | origin,logEntry                       | 打印日志                                                     | [Compilation.js#L1149](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L1149) |                                                              |
| compilation | afterChunks                 | SyncHook          | chunks                                | 代码块生成之后                                               | [Compilation.js#L2411](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2411) |                                                              |
| compilation | optimize                    | SyncHook          |                                       | 优化阶段开始时触发                                           | [Compilation.js#L2415](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2415) |                                                              |
| compilation | optimizeModules             | SyncBailHook      | modules                               | 模块的优化                                                   | [Compilation.js#L2417](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2417) |                                                              |
| compilation | afterOptimizeModules        | SyncHook          | modules                               | 模块优化结束时触发                                           | [Compilation.js#L2420](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2420) |                                                              |
| compilation | optimizeChunks              | SyncBailHook      | chunks,chunkGroups                    | 优化 chunks                                                  | [Compilation.js#L2422](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2422) |                                                              |
| compilation | afterOptimizeChunks         | SyncHook          | chunks,chunkGroups                    | chunk 优化完成之后触发                                       | [Compilation.js#L2425](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2425) |                                                              |
| compilation | optimizeTree                | AsyncSeriesHook   | chunks,modules                        | 异步优化依赖树                                               | [Compilation.js#L2427](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2427) |                                                              |
| compilation | afterOptimizeTree           | SyncHook          | chunks,modules                        | 异步优化依赖树完成时                                         | [Compilation.js#L2434](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2434) |                                                              |
| compilation | shouldRecord                | SyncBailHook      |                                       | 是否应该记录                                                 | [Compilation.js#L2448](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2448) |                                                              |
| compilation | reviveModules               | SyncHook          | modules,records                       | 从 records 中恢复模块信息                                    | [Compilation.js#L2450](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2450) |                                                              |
| compilation | beforeModuleIds             | SyncHook          | modules                               | 处理 modulesId 之前                                          | [Compilation.js#L2451](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2451) |                                                              |
| compilation | moduleIds                   | SyncHook          | modules                               | 处理 modulesId                                               | [Compilation.js#L2452](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2452) |                                                              |
| compilation | optimizeModuleIds           | SyncHook          | modules                               | 优化 modulesId                                               | [Compilation.js#L2454](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2454) |                                                              |
| compilation | afterOptimizeModuleIds      | SyncHook          | modules                               | 优化 modulesId 之后                                          | [Compilation.js#L2455](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2455) |                                                              |
| compilation | reviveChunks                | SyncHook          | chunks,records                        | 从 records 中恢复 chunk 信息                                 | [Compilation.js#L2457](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2457) |                                                              |
| compilation | beforeChunkIds              | SyncHook          | chunks                                | chunk id 优化之前触发                                        | [Compilation.js#L2458](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2458) |                                                              |
| compilation | optimizeChunkIds            | SyncHook          | chunks                                | chunk id 优化开始触发                                        | [Compilation.js#L2460](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2460) |                                                              |
| compilation | afterOptimizeChunkIds       | SyncHook          | chunks                                | chunk id 优化结束触发                                        | [Compilation.js#L2461](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2461) |                                                              |
| compilation | recordModules               | SyncHook          | modules,records                       | 将模块信息存储到 records                                     | [Compilation.js#L2468](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2468) |                                                              |
| compilation | recordChunks                | SyncHook          | chunks,records                        | 将 chunk 信息存储到 records                                  | [Compilation.js#L2469](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2469) |                                                              |
| compilation | beforeHash                  | SyncHook          |                                       | 在编译被哈希（hashed）之前                                   | [Compilation.js#L2498](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2498) |                                                              |
| compilation | chunkHash                   | SyncHook          | chunk,chunkHash                       | 生成 chunkHash                                               | [Compilation.js#L3465](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L3465) |                                                              |
| compilation | contentHash                 | SyncHook          | chunk                                 | 生成 contentHash                                             | [Compilation.js#L3482](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L3482) |                                                              |
| compilation | afterHash                   | SyncHook          |                                       | 在编译被哈希（hashed）之后                                   | [Compilation.js#L2499](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2499) |                                                              |
| compilation | recordHash                  | SyncHook          | records                               | 记录 hash                                                    | [Compilation.js#L2510](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2510) |                                                              |
| compilation | beforeModuleAssets          | SyncHook          |                                       | 在创建模块的资源之前                                         | [Compilation.js#L2517](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2517) |                                                              |
| compilation | shouldGenerateChunkAssets   | SyncBailHook      |                                       | 是否要生成 chunk 资源                                        | [Compilation.js#L2563](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2563) |                                                              |
| compilation | beforeChunkAssets           | SyncHook          |                                       | 在创建 chunk 资源（asset）之前                               | [Compilation.js#L2564](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2564) |                                                              |
| compilation | chunkAsset                  | SyncHook          | chunk,filename                        | 一个 chunk 中的一个资源被添加到编译中                        | [Compilation.js#L3950](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L3950) |                                                              |
| compilation | record                      | SyncHook          | compilation,records                   | 将 compilation 相关信息存储到 records 中                     | [Compilation.js#L2543](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2543) |                                                              |
| compilation | needAdditionalSeal          | SyncBailHook      |                                       | 是否需要额外的 seal                                          | [Compilation.js#L2546](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2546) |                                                              |
| compilation | afterSeal                   | AsyncSeriesHook   |                                       | seal 之后                                                    | [Compilation.js#L2550](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compilation.js#L2550) |                                                              |
| compiler    | afterCompile                | AsyncSeriesHook   | compilation                           | 完成编译和封存（seal）编译产出之后                           | [Compiler.js#L1119](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compiler.js#L1119) |                                                              |
| compiler    | shouldEmit                  | SyncBailHook      | compilation                           | 发布构建后资源之前触发，回调必须返回 true/false，true 则继续 | [Compiler.js#L444](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compiler.js#L444) |                                                              |
| compiler    | emit                        | AsyncSeriesHook   | compilation                           | 生成资源到 output 目录之前                                   | [Compiler.js#L866](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compiler.js#L866) |                                                              |
| compiler    | assetEmitted                | AsyncSeriesHook   | file,content                          | assetEmitted                                                 | [Compiler.js#L718](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compiler.js#L718) |                                                              |
| compiler    | afterEmit                   | AsyncSeriesHook   | compilation                           | 生成资源到 output 目录之后                                   | [Compiler.js#L857](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compiler.js#L857) |                                                              |
| compilation | needAdditionalPass          | SyncBailHook      |                                       | 是否需要额外的                                               | [Compiler.js#L462](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compiler.js#L462) |                                                              |
| compiler    | done                        | AsyncSeriesHook   | stats                                 | compilation 完成之后                                         | [Compiler.js#L470](https://gitee.com/zhufengpeixun/webpack/blob/master/lib/Compiler.js#L470) |                                                              |

![2020webpackflow](http://img.zhufengpeixun.cn/webpackflow2.jpg)

Powered by [idoc](https://github.com/jaywcjlove/idoc). Dependence [Node.js](https://nodejs.org/) run.



#  9.webpack-plugin

## 1. plugin

插件向第三方开发者提供了 webpack 引擎中完整的能力。使用阶段式的构建回调，开发者可以引入它们自己的行为到 webpack 构建流程中。创建插件比创建 loader 更加高级，因为你将需要理解一些 webpack 底层的内部特性来做相应的钩子

### 1.1 为什么需要一个插件

- webpack 基础配置无法满足需求
- 插件几乎能够任意更改 webpack 编译结果
- webpack 内部也是通过大量内部插件实现的

### 1.2 可以加载插件的常用对象

| 对象                                                         | 钩子                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [Compiler](https://github.com/webpack/webpack/blob/v4.39.3/lib/Compiler.js) | run,compile,compilation,make,emit,done                       |
| [Compilation](https://github.com/webpack/webpack/blob/v4.39.3/lib/Compilation.js) | buildModule,normalModuleLoader,succeedModule,finishModules,seal,optimize,after-seal |
| [Module Factory](https://github.com/webpack/webpack/blob/master/lib/ModuleFactory.js) | beforeResolver,afterResolver,module,parser                   |
| Module                                                       |                                                              |
| [Parser](https://github.com/webpack/webpack/blob/master/lib/Parser.js)] | program,statement,call,expression                            |
| [Template](https://github.com/webpack/webpack/blob/master/lib/Template.js) | hash,bootstrap,localVars,render                              |

## 2. 创建插件

webpack 插件由以下组成：

- 一个 JavaScript 命名函数。
- 在插件函数的 prototype 上定义一个 apply 方法。
- 指定一个绑定到 webpack 自身的事件钩子。
- 处理 webpack 内部实例的特定数据。
- 功能完成后调用 webpack 提供的回调。

## 3. Compiler 和 Compilation

在插件开发中最重要的两个资源就是`compiler`和`compilation`对象。理解它们的角色是扩展 webpack 引擎重要的第一步。

- compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。
- compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

## 4. 基本插件架构

- 插件是由「具有 apply 方法的 prototype 对象」所实例化出来的
- 这个 apply 方法在安装插件时，会被 webpack compiler 调用一次
- apply 方法可以接收一个 webpack compiler 对象的引用，从而可以在回调函数中访问到 compiler 对象

### 4.1 使用插件代码

- [使用插件]https://github.com/webpack/webpack/blob/master/lib/webpack.js#L60-L69)

```js
if (options.plugins && Array.isArray(options.plugins)) {
  for (const plugin of options.plugins) {
    plugin.apply(compiler);
  }
}
```

### 4.2 Compiler 插件

- [done: new AsyncSeriesHook(["stats"\])](https://github.com/webpack/webpack/blob/master/lib/Compiler.js#L105)

#### 4.2.1 同步

```js
class DonePlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.done.tap("DonePlugin", (stats) => {
      console.log("Hello ", this.options.name);
    });
  }
}
module.exports = DonePlugin;
```

#### 4.2.2 异步

```js
class DonePlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.done.tapAsync("DonePlugin", (stats, callback) => {
      console.log("Hello ", this.options.name);
      callback();
    });
  }
}
module.exports = DonePlugin;
```

### 4.3 使用插件

- 要安装这个插件，只需要在你的 webpack 配置的 plugin 数组中添加一个实例

```js
const DonePlugin = require("./plugins/DonePlugin");
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve("build"),
    filename: "bundle.js",
  },
  plugins: [new DonePlugin({ name: "zfpx" })],
};
```

### 4.4 触发钩子执行

- [done](https://github.com/webpack/webpack/blob/master/lib/Compiler.js#L360-L363)

```diff
if (this.hooks.shouldEmit.call(compilation) === false) {
                const stats = new Stats(compilation);
                stats.startTime = startTime;
                stats.endTime = Date.now();
+                this.hooks.done.callAsync(stats, err => {
+                    if (err) return finalCallback(err);
+                    return finalCallback(null, stats);
+                });
                return;
            }
```

## 5. compilation 插件

- 使用 compiler 对象时，你可以绑定提供了编译 compilation 引用的回调函数，然后拿到每次新的 compilation 对象。这些 compilation 对象提供了一些钩子函数，来钩入到构建流程的很多步骤中

### 5.1 asset-plugin.js

plugins\asset-plugin.js

```js
class AssetPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap("AssetPlugin", function (compilation) {
      compilation.hooks.chunkAsset.tap("AssetPlugin", function (
        chunk,
        filename
      ) {
        console.log("filename=", filename);
      });
    });
  }
}
module.exports = AssetPlugin;
```

### 5.2 compilation.call

- [Compiler.js](https://github.com/webpack/webpack/blob/master/lib/Compiler.js#L853-L860)

```js
newCompilation(params) {
        const compilation = this.createCompilation();
        this.hooks.compilation.call(compilation, params);
        return compilation;
    }
```

### 5.3 chunkAsset.call

- [chunkAsset.call](https://github.com/webpack/webpack/blob/v4.39.3/lib/Compilation.js#L2019)

```diff
chunk.files.push(file);
+this.hooks.chunkAsset.call(chunk, file);
```

> 关于 compiler, compilation 的可用回调，和其它重要的对象的更多信息，请查看 [插件](https://webpack.docschina.org/api/compiler-hooks/) 文档。

## 6. 打包 zip

- [webpack-sources](https://www.npmjs.com/package/webpack-sources)

### 6.1 zip-plugin.js

plugins\zip-plugin.js

```js
const { RawSource } = require("webpack-sources");
const JSZip = require("jszip");
const path = require("path");
class ZipPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    let that = this;
    compiler.hooks.emit.tapAsync("ZipPlugin", (compilation, callback) => {
      var zip = new JSZip();
      for (let filename in compilation.assets) {
        const source = compilation.assets[filename].source();
        zip.file(filename, source);
      }
      zip.generateAsync({ type: "nodebuffer" }).then((content) => {
        compilation.assets[that.options.filename] = new RawSource(content);
        callback();
      });
    });
  }
}
module.exports = ZipPlugin;
```

### 6.2 webpack.config.js

webpack.config.js

```diff
  plugins: [
+    new zipPlugin({
+      filename: 'assets.zip'
+    })
]
```

## 7.自动外链

### 7.1 使用外部类库

- 手动指定 `external`
- 手动引入 `script`

> 能否检测代码中的 import 自动处理这个步骤?

```js
{
  externals:{
    //key jquery是要require或import 的模块名,值 jQuery是一个全局变量名
  'jquery':'$'
}, 
  module:{}
}
```

### 7.2 思路

- 解决 import 自动处理`external`和`script`的问题，需要怎么实现，该从哪方面开始考虑
- `依赖` 当检测到有`import`该`library`时，将其设置为不打包类似`exteral`,并在指定模版中加入 script,那么如何检测 import？这里就用`Parser`
- `external依赖` 需要了解 external 是如何实现的，webpack 的 external 是通过插件`ExternalsPlugin`实现的，ExternalsPlugin 通过`tap` `NormalModuleFactory` 在每次创建 Module 的时候判断是否是`ExternalModule`
- webpack4 加入了模块类型之后，`Parser`获取需要指定类型 moduleType,一般使用`javascript/auto`即可

### 7.3 使用 plugins

```js
plugins: [
  new HtmlWebpackPlugin({
    template: "./src/index.html",
    filename: "index.html",
  }),
  new AutoExternalPlugin({
    jquery: {
      expose: "$",
      url: "https://cdn.bootcss.com/jquery/3.1.0/jquery.js",
    },
  }),
];
```

### 7.4 AutoExternalPlugin

- [ExternalsPlugin.js](https://github.com/webpack/webpack/blob/0d4607c68e04a659fa58499e1332c97d5376368a/lib/ExternalsPlugin.js)
- [ExternalModuleFactoryPlugin](https://github.com/webpack/webpack/blob/eeafeee32ad5a1469e39ce66df671e3710332608/lib/ExternalModuleFactoryPlugin.js)
- [ExternalModule.js](https://github.com/webpack/webpack/blob/eeafeee32ad5a1469e39ce66df671e3710332608/lib/ExternalModule.js)
- [parser](https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModuleFactory.js#L87)
- [factory](https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModuleFactory.js#L66)
- [htmlWebpackPluginAlterAssetTags](https://github.com/jantimon/html-webpack-plugin/blob/v3.2.0/index.js#L62)

AsyncSeriesBailHook factorize

```js
let { AsyncSeriesBailHook } = require("tapable");
let factorize = new AsyncSeriesBailHook(["resolveData"]);
factorize.tapAsync("tap1", (resolveData, callback) => {
    if (resolveData === "jquery") {
        callback(null, { externalModule: "jquery" });
    } else {
        callback();
    }
});
factorize.tapAsync("tap2", (resolveData, callback) => {
    callback(null, { normalModule: resolveData });
});
//由tap1返回
factorize.callAsync("jquery", (err, module) => {
    console.log(module);
});
//由tap2返回
factorize.callAsync("jquery2", (err, module) => {
    console.log(module);
});
const { ExternalModule } = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
/**
 * 1.如果你加载的 jquery要走类似于external模块的逻辑 
 * 2. 生产html文件的时候，要注意自动添加CDN的链接，知道 我依赖没有依赖这个模块
 */
class AutoExternalPlugin {
    constructor(options) {
        this.options = options;
        this.importedModules = new Set();//放着所有的导入的并依赖的模块
        this.externalModules = Object.keys(this.options);//[jquery,lodash]
    }
    apply(compiler) {
        //获取 普通模块工厂
        compiler.hooks.normalModuleFactory.tap('AutoExternalPlugin',(normalModuleFactory)=>{
            //获取JS模块的parser 
            normalModuleFactory.hooks.parser
            .for('javascript/auto')//可以兼容import es 和 commonjs require
            .tap('AutoExternalPlugin',parser=>{
                //如果真的导入了一个任何一个模块的话，都会添加到importedModules 里
                parser.hooks.import.tap('AutoExternalPlugin',(statement,source)=>{
                  /*   console.log(statement);
                    console.log(source); */
                    if(this.externalModules.includes(source)){
                        this.importedModules.add(source);
                    }
                });
                //如果通过require方法引入了个模块的话
                parser.hooks.call.for('require').tap('AutoExternalPlugin',(expression)=>{
                    let value = expression.arguments[0].value;
                    if(this.externalModules.includes(value)){
                        this.importedModules.add(value);//lodash
                    }
                })
            })
            //这是真正用来生产模块的钩子
            normalModuleFactory.hooks.factorize.tapAsync('AutoExternalPlugin',(resolveData,callback)=>{
                let request = resolveData.request;//你将要加载的资源 ./src/index.js jquery lodash
                //let externalModules = Object.keys(this.options);//['jquery','lodash']
                if(this.externalModules.includes(request)){
                    //constructor(request?: any, type?: any, userRequest?: any);
                    let expose = this.options[request].expose;//jquery=>jQuery lodash=>_
                    //如果第二个参数不为空，则表示返回了函数 factorize SerialBailHook 相当这个工厂就直接生产出了这个模块，，跳过后续的所有钩子
                    //callback(null,new ExternalModule(expose,'window',request));
                    callback(null);
                }else{//不传参，走真正的原始的生产模块的逻辑 ，就会生产出来个NormalModule
                    callback(null);
                }
            });
        });
        compiler.hooks.compilation.tap('AutoExternalPlugin',(compilation)=>{
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('AutoExternalPlugin',(htmlData,callback)=>{
                let {assetTags} =htmlData;
                let importedExternalModules = Object.keys(this.options).filter(item=>this.importedModules.has(item));
                importedExternalModules.forEach(key=>{
                    assetTags.scripts.unshift({
                        tagName: 'script',//标签类型
                        voidTag: false,//是否为空
                        attributes: {
                            src:this.options[key].url,defer:false
                        }
                      });
                });
                //传给下一个钩子或者回调
                callback(null,htmlData);
            });
        });
    }
}
module.exports = AutoExternalPlugin;
/**
 * Node {
  type: 'ImportDeclaration',
  start: 0,
  end: 23,
  loc: SourceLocation {
    start: Position { line: 1, column: 0 },
    end: Position { line: 1, column: 23 }
  },
  range: [ 0, 23 ],
  specifiers: [
    Node {
      type: 'ImportDefaultSpecifier',
      start: 7,
      end: 8,
      loc: [SourceLocation],
      range: [Array],
      local: [Node]
    }
  ],
  source: Node {
    type: 'Literal',
    start: 14,
    end: 22,
    loc: SourceLocation { start: [Position], end: [Position] },
    range: [ 14, 22 ],
    value: 'jquery',
    raw: "'jquery'"
  }
}
jquery
 */
```

## 8.HashPlugin

- 可以自己修改各种hash值

```js
class HashPlugin{
    constructor(options){
        this.options = options;
    }
    apply(compiler){
        compiler.hooks.compilation.tap('HashPlugin',(compilation,params)=>{
            //如果你想改变hash值，可以在hash生成这后修改
            compilation.hooks.afterHash.tap('HashPlugin',()=>{
                let fullhash = 'fullhash';//时间戳
                console.log('本次编译的compilation.hash',compilation.hash);
                compilation.hash= fullhash;//output.filename [fullhash]
                for(let chunk of compilation.chunks){
                    console.log('chunk.hash',chunk.hash);
                    chunk.renderedHash = 'chunkHash';//可以改变chunkhash
                    console.log('chunk.contentHash',chunk.contentHash);
                    chunk.contentHash= { javascript: 'javascriptContentHash','css/mini-extract':'cssContentHash' }
                }
            });
        });
    }
}
module.exports = HashPlugin;
/**
 * 三种hash
 * 1. hash compilation.hash 
 * 2. chunkHash 每个chunk都会有一个hash
 * 3. contentHash 内容hash 每个文件会可能有一个hash值
 */
```

webpack.config.js

```diff
const path = require('path');
const DonePlugin = require('./plugins/DonePlugin');
const AssetPlugin = require('./plugins/AssetPlugin');
const ZipPlugin = require('./plugins/ZipPlugin');
const HashPlugin = require('./plugins/HashPlugin');
const AutoExternalPlugin = require('./plugins/AutoExternalPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
+                   MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
+       new HashPlugin(),
    ]
}
```

## 9.AsyncQueue

### 9.1 AsyncQueue

```js
let AsyncQueue = require('webpack/lib/util/AsyncQueue');
let AsyncQueue = require('./AsyncQueue');
function processor(item, callback) {
    setTimeout(() => {
        console.log('process',item);
        callback(null, item);
    }, 3000);
}
const getKey = (item) => {
    return item.key;
}
let queue  = new AsyncQueue({
    name:'createModule',parallelism:3,processor,getKey
});
const start = Date.now();
let item1 = {key:'module1'};
queue.add(item1,(err,result)=>{
    console.log(err,result);
    console.log(Date.now() - start);
});
queue.add(item1,(err,result)=>{
    console.log(err,result);
    console.log(Date.now() - start);
});
queue.add({key:'module2'},(err,result)=>{
    console.log(err,result);
    console.log(Date.now() - start);
});
queue.add({key:'module3'},(err,result)=>{
    console.log(err,result);
    console.log(Date.now() - start);
});
queue.add({key:'module4'},(err,result)=>{
    console.log(err,result);
    console.log(Date.now() - start);
});
```

### 9.2 use.js

use.js

```js
const QUEUED_STATE = 0;//已经 入队，待执行
const PROCESSING_STATE = 1;//处理中
const DONE_STATE = 2;//处理完成
class ArrayQueue {
    constructor() {
        this._list = [];
    }
    enqueue(item) {
        this._list.push(item);//[1,2,3]
    }
    dequeue() {
        return this._list.shift();//移除并返回数组中的第一个元素
    }
}
class AsyncQueueEntry {
    constructor(item, callback) {
        this.item = item;//任务的描述
        this.state = QUEUED_STATE;//这个条目当前的状态
        this.callback = callback;//任务完成的回调
    }
}
class AsyncQueue {
    constructor({ name, parallelism, processor, getKey }) {
        this._name = name;//队列的名字
        this._parallelism = parallelism;//并发执行的任务数
        this._processor = processor;//针对队列中的每个条目执行什么操作
        this._getKey = getKey;//函数，返回一个key用来唯一标识每个元素
        this._entries = new Map();
        this._queued = new ArrayQueue();//将要执行的任务数组队列 
        this._activeTasks = 0;//当前正在执行的数，默认值1
        this._willEnsureProcessing = false;//是否将要开始处理
    }
    add = (item, callback) => {
        const key = this._getKey(item);//获取这个条目对应的key
        const entry = this._entries.get(key);//获取 这个key对应的老的条目
        if (entry !== undefined) {
            if (entry.state === DONE_STATE) {
                process.nextTick(() => callback(entry.error, entry.result));
            } else if (entry.callbacks === undefined) {
                entry.callbacks = [callback];
            } else {
                entry.callbacks.push(callback);
            }
            return;
        }
        const newEntry = new AsyncQueueEntry(item, callback);//创建一个新的条目
        this._entries.set(key, newEntry);//放到_entries
        this._queued.enqueue(newEntry);//把这个新条目放放队列
        if (this._willEnsureProcessing === false) {
            this._willEnsureProcessing = true;
            setImmediate(this._ensureProcessing);
        }
    }
    _ensureProcessing = () => {
        //如果当前的激活的或者 说正在执行任务数行小于并发数
        while (this._activeTasks < this._parallelism) {
            const entry = this._queued.dequeue();//出队 先入先出
            if (entry === undefined) break;
            this._activeTasks++;//先让正在执行的任务数++
            entry.state = PROCESSING_STATE;//条目的状态设置为执行中
            this._startProcessing(entry);
        }
        this._willEnsureProcessing = false;
    }
    _startProcessing = (entry) => {
        this._processor(entry.item, (e, r) => {
            this._handleResult(entry, e, r);
        });
    }
    _handleResult = (entry, error, result) => {
        const callback = entry.callback;
        const callbacks = entry.callbacks;
        entry.state = DONE_STATE;//把条目的状态设置为已经完成
        entry.callback = undefined;//把callback
        entry.callbacks = undefined;
        entry.result = result;//把结果赋给entry
        entry.error = error;//把错误对象赋给entry
        callback(error, result);
        if (callbacks !== undefined) {
            for (const callback of callbacks) {
                callback(error, result);
            }
        }
        this._activeTasks--;
        if (this._willEnsureProcessing === false) {
            this._willEnsureProcessing = true;
            setImmediate(this._ensureProcessing);
        }
    }
}
module.exports = AsyncQueue;
```

## 10. module

### 9.1 CommonJS

- 模块运行时动态加载
- node中模块导入require是一个内置的函数，因此只有在运行后我们才可以得知模块导出内容，无法做静态分析

```js
const fileName = 'title';
const result = require(fileName+'.js');
```

### 10.2 ESModule

- 静态解析
- 只能作为模块顶层的语句出现,不能出现在 `function` 里面或是 `if` 里面
- import 的模块名只能是字符串常量
- import 声明提前在模块顶层

```js
//export.js
export function a1(){alert('a1')};
export function a2(){alert('a2')};
//import.js
import {a1} from './export.js'
a1('arguments')
```

### 10.3 Tree Shaking

- `Tree Shaking`可以利用ES2015(es6)模块语法静态解析的特性，删除没有使用的代码，减小文件大小，对代码进行优化
- webpack Tree Shaking 开启条件:
  - 使用es2015模块语法(import 与 export)
  - 使用支持无用代码移除(dead code removal)的插件，如 UglifyJSPlugin
  - 去除babel-loader的模块转换插件，交给webpack来做模块转换babel 6.0+ 配置
- 浏览器端代码使用es2015 module，模块化使用灵活，且可充分利用Tree Shaking减小代码体积
- 服务端node适合动态引入且不需要过多考虑代码体积所以使用commonjs规范，同时可以拥有更好的debug支持，提高开发效率

## 11. 参考

- [Node.js SDK](https://developer.qiniu.com/kodo/sdk/1289/nodejs)
- [writing-a-plugin](https://webpack.js.org/contribute/writing-a-plugin/)
- [api/plugins](https://webpack.js.org/api/plugins/)



# 10.webpack-hand

## 1.跑通webpack

![workflow2](http://img.zhufengpeixun.cn/workflow2.jpg)

### 1.1 webpack.config.js

```js
const path = require('path');
module.exports = {
    context: process.cwd(),
    mode: 'development',
    devtool: 'none',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
}
```

### 1.2 src\index.js

src\index.js

```js
let title = require('./title');
console.log(title);
```

### 1.3 src\title.js

src\title.js

```js
module.exports = 'title';
```

### 1.4 cli.js

```js
node cli.js
const webpack = require("webpack");
const webpackOptions = require("./webpack.config");
const compiler = webpack(webpackOptions);
compiler.run((err, stats) => {
    console.log(err);
    console.log(
        stats.toJson({
            entries: true,
            chunks: true,
            modules: true,
            assets: true
        })
    );
});
{
  errors: [],
  warnings: [],
  version: '4.43.0',
  hash: 'b8d9a2a39e55e9ed6360',
  time: 64,
  builtAt: 1589509767224,
  publicPath: '',
  outputPath: 'C:\\vipdata\\prepare12\\zhufengwebpackprepare\\dist',
  assetsByChunkName: { main: 'main.js' },
  assets: [
    {
      name: 'main.js',
      size: 4126,
      chunks: [Array],
      chunkNames: [Array]
    }
  ],
  entrypoints: {
    main: {
      chunks: [Array],
      assets: [Array],
    }
  },
  namedChunkGroups: {
    main: {
      chunks: [Array],
      assets: [Array]
    }
  },
  chunks: [
    {
      id: 'main',
      rendered: true,
      initial: true,
      entry: true,
      size: 77,
      names: [Array],
      files: [Array],
      hash: '1e1215aa688e72e663af',
      siblings: [],
      parents: [],
      children: [],
      childrenByOrder: [Object: null prototype] {},
      modules: [Array],
      filteredModules: 0,
      origins: [Array]
    }
  ],
  modules: [
    {
      id: './src/index.js',
      identifier: 'C:\\vipdata\\prepare12\\zhufengwebpackprepare\\src\\index.js',
      name: './src/index.js',
      index: 0,
      index2: 1,
      size: 52,
      cacheable: true,
      built: true,
      optional: false,
      prefetched: false,
      chunks: [Array]
      assets: [],
      reasons: [Array],
      source: "let title = require('./title');\r\nconsole.log(title);"
    },
    {
      id: './src/title.js',
      identifier: 'C:\\vipdata\\prepare12\\zhufengwebpackprepare\\src\\title.js',
      name: './src/title.js',
      index: 1,
      index2: 0,
      size: 25,
      cacheable: true,
      built: true,
      optional: false,
      prefetched: false,
      chunks: [Array],
      issuer: 'C:\\vipdata\\prepare12\\zhufengwebpackprepare\\src\\index.js',
      issuerId: './src/index.js',
      issuerName: './src/index.js',
      errors: 0,
      warnings: 0,
      assets: [],
      reasons: [Array],
      source: "module.exports = 'title';"
    }
  ]
}
```

### 1.5 main.js

- ^\s*(?=\r?$)\n

```js
(function (modules) {
  var installedModules = {};
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    module.l = true;
    return module.exports;
  }
  __webpack_require__.m = modules;
  __webpack_require__.c = installedModules;
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };
  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
    return ns;
  };
  __webpack_require__.n = function (module) {
    var getter = module && module.__esModule ?
      function getDefault() { return module['default']; } :
      function getModuleExports() { return module; };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };
  __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  __webpack_require__.p = "";
  return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
  ({
    "./src/index.js":
      (function (module, exports, __webpack_require__) {
        let title = __webpack_require__(/*! ./title */ "./src/title.js");
        console.log(title);
      }),
    "./src/title.js":
      (function (module, exports) {
        module.exports = 'title';
      })
  });
```

## 2. Compiler.run

### 2.1 cli.js

```diff
+const webpack = require("./webpack");
const webpackOptions = require("./webpack.config");
const compiler = webpack(webpackOptions);
compiler.run((err, stats) => {
    console.log(
        stats.toJson({
            entries: true,
            chunks: true,
            modules: true,
            assets: true
        })
    );
});
```

### 2.2 webpack\index.js

webpack\index.js

```js
const NodeEnvironmentPlugin = require("./plugins/NodeEnvironmentPlugin");
const Compiler = require("./Compiler");
function webpack(options) {
    options.context = options.context || path.resolve(process.cwd());
    //创建compiler
    let compiler = new Compiler(options.context);
    //给compiler指定options
    compiler.options = Object.assign(compiler.options, options);
    //插件设置读写文件的API
    new NodeEnvironmentPlugin().apply(compiler);
    //调用配置文件里配置的插件并依次调用
    if (options.plugins && Array.isArray(options.plugins)) {
        for (const plugin of options.plugins) {
            plugin.apply(compiler);
        }
    }
    return compiler;
}

module.exports = webpack;
```

### 2.3 Compiler.js

webpack\Compiler.js

```js
const { Tapable } = require("tapable");
class Compiler extends Tapable {
    constructor(context) {
        super();
        this.options = {};
        this.context = context; //设置上下文路径
        this.hooks = {};
    }
    run(callback) {
        console.log("Compiler run");
        callback(null, {
            toJson() {
                return {
                    entries: true,
                    chunks: true,
                    modules: true,
                    assets: true
                }
            }
        });
    }
}
module.exports = Compiler;
```

### 2.4 NodeEnvironmentPlugin.js

webpack\plugins\NodeEnvironmentPlugin.js

```js
const fs = require("fs");
class NodeEnvironmentPlugin {
    apply(compiler) {
        compiler.inputFileSystem = fs; //设置读文件的模块
        compiler.outputFileSystem = fs; //设置写文件的模块
    }
}
module.exports = NodeEnvironmentPlugin;
```

## 3. 监听make事件

### 3.1 Compiler.js

webpack\Compiler.js

```diff
+const { Tapable, SyncBailHook, AsyncParallelHook } = require("tapable");
class Compiler extends Tapable {
    constructor(context) {
        super();
        this.options = {};
        this.context = context; //设置上下文路径
+       this.hooks = {
+            entryOption: new SyncBailHook(["context", "entry"]),
+            make: new AsyncParallelHook(["compilation"])
+       };
    }
    run(callback) {
        console.log("Compiler run");
        callback(null, {
            toJson() {
                return {
                    entries: true,
                    chunks: true,
                    modules: true,
                    assets: true
                }
            }
        });
    }
}
module.exports = Compiler;
```

### 3.2 webpack\index.js

webpack\index.js

```diff
const NodeEnvironmentPlugin = require("./plugins/NodeEnvironmentPlugin");
+const WebpackOptionsApply = require("./WebpackOptionsApply");
const Compiler = require("./Compiler");
function webpack(options) {
    options.context = options.context || path.resolve(process.cwd());
    //创建compiler
    let compiler = new Compiler(options.context);
    //给compiler指定options
    compiler.options = Object.assign(compiler.options, options);
    //插件设置读写文件的API
    new NodeEnvironmentPlugin().apply(compiler);
    //调用配置文件里配置的插件并依次调用
    if (options.plugins && Array.isArray(options.plugins)) {
        for (const plugin of options.plugins) {
            plugin.apply(compiler);
        }
    }
+    new WebpackOptionsApply().process(options, compiler); //处理参数
    return compiler;
}

module.exports = webpack;
```

### 3.3 WebpackOptionsApply.js

webpack\WebpackOptionsApply.js

```js
const EntryOptionPlugin = require("./plugins/EntryOptionPlugin");
module.exports = class WebpackOptionsApply {
    process(options, compiler) {
        //挂载入口文件插件
        new EntryOptionPlugin().apply(compiler);
        //触发entryOption事件执行
        compiler.hooks.entryOption.call(options.context, options.entry);
    }
};
```

### 3.4 EntryOptionPlugin.js

webpack\plugins\EntryOptionPlugin.js

```js
const SingleEntryPlugin = require("./SingleEntryPlugin");
class EntryOptionPlugin {
    apply(compiler) {
        compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
            new SingleEntryPlugin(context, entry, "main").apply(compiler);
        });
    }
}

module.exports = EntryOptionPlugin;
```

### 3.5 SingleEntryPlugin.js

webpack\plugins\SingleEntryPlugin.js

```js
class EntryOptionPlugin {
    constructor(context, entry, name) {
        this.context = context;
        this.entry = entry;
        this.name = name;
    }
    apply(compiler) {
        compiler.hooks.make.tapAsync(
            "SingleEntryPlugin",
            (compilation, callback) => {
                //入口文件 代码块的名称 context上下文绝对路径
                const { entry, name, context } = this;
                compilation.addEntry(context, entry, name, callback);
            }
        );
    }
};
module.exports = EntryOptionPlugin;
```

## 4. make编译

### 4.1 Compiler.js

webpack\Compiler.js

```diff
+const { Tapable, SyncHook, SyncBailHook, AsyncParallelHook, AsyncSeriesHook } = require("tapable");
+const Compilation = require('./Compilation');
+const NormalModuleFactory = require('./NormalModuleFactory');
+const Stats = require('./Stats');
class Compiler extends Tapable {
    constructor(context) {
        super();
        this.options = {};
        this.context = context; //设置上下文路径
        this.hooks = {
            entryOption: new SyncBailHook(["context", "entry"]),
+            beforeRun: new AsyncSeriesHook(["compiler"]),
+            run: new AsyncSeriesHook(["compiler"]),
+            beforeCompile: new AsyncSeriesHook(["params"]),
+            compile: new SyncHook(["params"]),
+            make: new AsyncParallelHook(["compilation"]),
+            thisCompilation: new SyncHook(["compilation", "params"]),
+            compilation: new SyncHook(["compilation", "params"]),
+            done: new AsyncSeriesHook(["stats"])
        };
    }
+    run(finalCallback) {
+        //编译完成后的回调
+        const onCompiled = (err, compilation) => {
+            console.log('onCompiled');
+            finalCallback(err, new Stats(compilation));
+        };
+        //准备运行编译
+        this.hooks.beforeRun.callAsync(this, err => {
+            //运行
+            this.hooks.run.callAsync(this, err => {
+                this.compile(onCompiled); //开始编译,编译完成后执行conCompiled回调
+            });
+        });
+    }
+    compile(onCompiled) {
+        const params = this.newCompilationParams();
+        this.hooks.beforeCompile.callAsync(params, err => {
+            this.hooks.compile.call(params);
+            const compilation = this.newCompilation(params);
+            this.hooks.make.callAsync(compilation, err => {
+                console.log('make完成');
+                onCompiled(err, compilation);
+            });
+        });
+    }
+    newCompilationParams() {
+        const params = {
+            normalModuleFactory: new NormalModuleFactory()
+        };
+        return params;
+    }
+    newCompilation(params) {
+        const compilation = new Compilation(this);
+        this.hooks.thisCompilation.call(compilation, params);
+        this.hooks.compilation.call(compilation, params);
+        return compilation;
+    }
}
module.exports = Compiler;
```

### 4.2 Compilation.js

webpack\Compilation.js

```js
const NormalModuleFactory = require('./NormalModuleFactory');
const { Tapable, SyncHook } = require("tapable");
const Parser = require('./Parser');
const parser = new Parser();
const path = require('path');
class Compilation extends Tapable {
    constructor(compiler) {
        super();
        this.compiler = compiler;
        this.options = compiler.options;
        this.context = compiler.context;
        this.inputFileSystem = compiler.inputFileSystem;
        this.outputFileSystem = compiler.outputFileSystem;
        this.entries = [];
        this.modules = [];
        this.hooks = {
            succeedModule: new SyncHook(["module"])
        }
    }
    //context ./src/index.js main callback(终级回调)
    addEntry(context, entry, name, callback) {
        this._addModuleChain(context, entry, name, (err, module) => {
            callback(err, module);
        });
    }
    _addModuleChain(context, entry, name, callback) {
        const moduleFactory = new NormalModuleFactory();
        let module = moduleFactory.create(
            {
                name,  //模块所属的代码块的名称
                context: this.context,//上下文
                rawRequest: entry,
                resource: path.posix.join(context, entry),
                parser
            });//模块完整路径

        this.modules.push(module);
        this.entries.push(module);//把编译好的模块添加到入口列表里面
        const afterBuild = () => {
            if (module.dependencies) {
                this.processModuleDependencies(module, err => {
                    callback(null, module);
                });
            } else {
                return callback(null, module);
            }
        };
        this.buildModule(module, afterBuild);

    }
    buildModule(module, afterBuild) {
        module.build(this, (err) => {
            this.hooks.succeedModule.call(module);
            return afterBuild();
        });
    }
}
module.exports = Compilation;
```

### 4.3 NormalModuleFactory.js

webpack\NormalModuleFactory.js

```js
const NormalModule = require('./NormalModule');
class NormalModuleFactory {
    create(data) {
        return new NormalModule(data);
    }
}
module.exports = NormalModuleFactory;
```

### 4.4 NormalModule.js

webpack\NormalModule.js

```js
class NormalModule {
    constructor({ name, context, rawRequest, resource, parser }) {
        this.name = name;
        this.context = context;
        this.rawRequest = rawRequest;
        this.resource = resource;
        this.parser = parser;
        this._source = null;
        this._ast = null;
    }
    //解析依赖
    build(compilation, callback) {
        this.doBuild(compilation, err => {
            this._ast = this.parser.parse(this._source);
            callback();
        });
    }
    //获取模块代码
    doBuild(compilation, callback) {
        let originalSource = this.getSource(this.resource, compilation);
        this._source = originalSource;
        callback();
    }
    getSource(resource, compilation) {
        let originalSource = compilation.inputFileSystem.readFileSync(resource, 'utf8');
        return originalSource;
    }
}
module.exports = NormalModule;
```

### 4.5 Parser.js

webpack\Parser.js

```js
const babylon = require('babylon');
const { Tapable } = require("tapable");
class Parser extends Tapable {
    constructor() {
        super();
    }
    parse(source) {
        return babylon.parse(source, { sourceType: 'module', plugins: ['dynamicImport'] });
    }
}
module.exports = Parser;
```

### 4.6 Stats.js

webpack\Stats.js

```js
class Stats {
    constructor(compilation) {
        this.entries = compilation.entries;
        this.modules = compilation.modules;
    }
    toJson() {
        return this;
    }
}
module.exports = Stats;
```

## 5. 编译模块和依赖

### 5.1 webpack\Compilation.js

webpack\Compilation.js

```diff
const NormalModuleFactory = require('./NormalModuleFactory');
+const async = require('neo-async');
const { Tapable, SyncHook } = require("tapable");
const Parser = require('./Parser');
const parser = new Parser();
const path = require('path');
class Compilation extends Tapable {
    constructor(compiler) {
        super();
        this.compiler = compiler;
        this.options = compiler.options;
        this.context = compiler.context;
        this.inputFileSystem = compiler.inputFileSystem;
        this.outputFileSystem = compiler.outputFileSystem;
        this.entries = [];
        this.modules = [];
        this.hooks = {
            succeedModule: new SyncHook(["module"])
        }
    }
    //context ./src/index.js main callback(终级回调)
+    _addModuleChain(context,entry,name,callback){
+        this.createModule({
+            name,//所属的代码块的名称 main
+            context:this.context,//上下文
+            rawRequest:entry,// ./src/index.js
+            resource:path.posix.join(context,entry),//此模块entry的的绝对路径
+            parser,
+        },module=>{this.entries.push(module)},callback);
+    }
+    createModule(data,addEntry,callback){
+        //先创建模块工厂
+        const moduleFactory = new NormalModuleFactory();
+        let module = moduleFactory.create(data);
+        //非常非常重要 模块的ID如何生成? 模块的ID是一个相对于根目录的相对路径
+        //index.js ./src/index.js title.js ./src/title.js
+        //relative返回一个相对路径 从根目录出出到模块的绝地路径 得到一个相对路径
+        module.moduleId = '.'+path.posix.sep+path.posix.relative(this.context,module.resource);
+        addEntry&&addEntry(module);
+        this.modules.push(module);//把模块添加到完整的模块数组中
+        const afterBuild = (err,module)=>{
+            if(module.dependencies){//如果一个模块编译完成,发现它有依赖的模块,那么递归编译它的依赖模块
+                this.processModuleDependencies(module,(err)=>{
+                    //当这个入口模块和它依赖的模块都编译完成了,才会让调用入口模块的回调
+                    callback(err,module);
+                });
+            }else{
+                callback(err,module);
+            }
+        }
+        this.buildModule(module,afterBuild);
+    }
+    processModuleDependencies(module,callback){
+        let dependencies= module.dependencies;
+        //因为我希望可以并行的同时开始编译依赖的模块,然后等所有依赖的模块全部编译完成后才结束
+        async.forEach(dependencies,(dependency,done)=>{
+            let {name,context,rawRequest,resource,moduleId} = dependency;
+            this.createModule({
+                name,
+                context,
+                rawRequest,
+                resource,
+                moduleId,
+                parser
+            },null,done);
+        },callback);
+    }
    buildModule(module,afterBuild){
        module.build(this,(err)=>{
            this.hooks.succeedModule.call(module)
            afterBuild(null,module);
        });
    }
}
module.exports = Compilation;
```

### 5.2 NormalModule.js

webpack\NormalModule.js

```diff
+const path = require('path');
+const types = require('babel-types');
+const generate = require('babel-generator').default;
+const traverse = require('babel-traverse').default;
class NormalModule {
+    constructor({ name, context, rawRequest, resource, parser, moduleId }) {
        this.name = name;
        this.context = context;
        this.rawRequest = rawRequest;
        this.resource = resource;
+        this.moduleId = moduleId||('./'+path.posix.relative(context,resource));
        this.parser = parser;
        this._source = null;
        this._ast = null;
+        this.dependencies = [];
    }
    //解析依赖
    build(compilation, callback) {
        this.doBuild(compilation, err => {
+            let originalSource = this.getSource(this.resource, compilation);
+            // 将 当前模块 的内容转换成 AST
+            const ast = this.parser.parse(originalSource);
+            traverse(ast, {
+                // 如果当前节点是一个函数调用时
+                CallExpression: (nodePath) => {
+                    let node = nodePath.node;
+                    // 当前节点是 require 时
+                    if (node.callee.name === 'require') {
+                        //修改require为__webpack_require__
+                        node.callee.name = '__webpack_require__';
+                        //获取要加载的模块ID
+                        let moduleName = node.arguments[0].value;
+                        //获取扩展名
+                        let extension = moduleName.split(path.posix.sep).pop().indexOf('.') == -1 ? '.js' : '';
+                        //获取依赖模块的绝对路径
+                        let dependencyResource = path.posix.join(path.posix.dirname(this.resource), moduleName + extension);
+                        //获取依赖模块的模块ID
+                        let dependencyModuleId = '.' + path.posix.sep + path.posix.relative(this.context, dependencyResource);
+                        //添加依赖
+                        this.dependencies.push({
+                            name: this.name, context: this.context, rawRequest: moduleName,
+                            moduleId: dependencyModuleId, resource: dependencyResource
+                        });
+                        node.arguments = [types.stringLiteral(dependencyModuleId)];
+                    }
+                }
+            });
+            let { code } = generate(ast);
+            this._source = code;
+            this._ast = ast;
            callback();
        });
    }
    //获取模块代码
    doBuild(compilation, callback) {
        let originalSource = this.getSource(this.resource, compilation);
        this._source = originalSource;
        callback();
    }
    getSource(resource, compilation) {
        let originalSource = compilation.inputFileSystem.readFileSync(resource, 'utf8');
        return originalSource;
    }
}
module.exports = NormalModule;
```

## 6. seal

### 6.1 Compiler.js

webpack\Compiler.js

```diff
const { Tapable, SyncHook, SyncBailHook, AsyncParallelHook, AsyncSeriesHook } = require("tapable");
const Compilation = require('./Compilation');
const NormalModuleFactory = require('./NormalModuleFactory');
const Stats = require('./Stats');
class Compiler extends Tapable {
    constructor(context) {
        super();
        this.options = {};
        this.context = context; //设置上下文路径
        this.hooks = {
            entryOption: new SyncBailHook(["context", "entry"]),
            beforeRun: new AsyncSeriesHook(["compiler"]),
            run: new AsyncSeriesHook(["compiler"]),
            beforeCompile: new AsyncSeriesHook(["params"]),
            compile: new SyncHook(["params"]),
            make: new AsyncParallelHook(["compilation"]),
            thisCompilation: new SyncHook(["compilation", "params"]),
            compilation: new SyncHook(["compilation", "params"]),
+           afterCompile:new AsyncSeriesHook(["compilation"]),
            done: new AsyncSeriesHook(["stats"])
        };
    }
    run(finalCallback) {
        //编译完成后的回调
        const onCompiled = (err, compilation) => {
            console.log('onCompiled');
            finalCallback(err, new Stats(compilation));
        };
        //准备运行编译
        this.hooks.beforeRun.callAsync(this, err => {
            //运行
            this.hooks.run.callAsync(this, err => {
                this.compile(onCompiled); //开始编译,编译完成后执行conCompiled回调
            });
        });
    }
    compile(onCompiled) {
        const params = this.newCompilationParams();
        this.hooks.beforeCompile.callAsync(params, err => {
            this.hooks.compile.call(params);
            const compilation = this.newCompilation(params);
            this.hooks.make.callAsync(compilation, err => {
+                compilation.seal(err => {
+                    this.hooks.afterCompile.callAsync(compilation, err => {
+                        return onCompiled(null, compilation);
+                    });
+                });
            });
        });
    }
    newCompilationParams() {
        const params = {
            normalModuleFactory: new NormalModuleFactory()
        };
        return params;
    }
    newCompilation(params) {
        const compilation = new Compilation(this);
        this.hooks.thisCompilation.call(compilation, params);
        this.hooks.compilation.call(compilation, params);
        return compilation;
    }

}
module.exports = Compiler;
```

### 6.2 Compilation.js

webpack\Compilation.js

```diff
const NormalModuleFactory = require('./NormalModuleFactory');
const async = require('neo-async');
const { Tapable, SyncHook } = require("tapable");
const Parser = require('./Parser');
const parser = new Parser();
const path = require('path');
+let Chunk = require('./Chunk');
class Compilation extends Tapable {
    constructor(compiler) {
        super();
        this.compiler = compiler;
        this.options = compiler.options;
        this.context = compiler.context;
        this.inputFileSystem = compiler.inputFileSystem;
        this.outputFileSystem = compiler.outputFileSystem;
        this.entries = [];
        this.modules = [];
        this.chunks = [];
        this.hooks = {
            succeedModule: new SyncHook(["module"]),
+            seal: new SyncHook([]),
+            beforeChunks: new SyncHook([]),
+            afterChunks: new SyncHook(["chunks"])
        }
    }
+    seal(callback) {
+        this.hooks.seal.call();
+        this.hooks.beforeChunks.call();//生成代码块之前
+        for (const module of this.entries) {//循环入口模块
+            const chunk = new Chunk(module);//创建代码块
+            this.chunks.push(chunk);//把代码块添加到代码块数组中
+            //把代码块的模块添加到代码块中
+            chunk.modules = this.modules.filter(module => module.name == chunk.name);
+        }
+        this.hooks.afterChunks.call(this.chunks);//生成代码块之后
+        callback();//封装结束
+    }
    //context ./src/index.js main callback(终级回调)
    _addModuleChain(context,entry,name,callback){
        this.createModule({
            name,//所属的代码块的名称 main
            context:this.context,//上下文
            rawRequest:entry,// ./src/index.js
            resource:path.posix.join(context,entry),//此模块entry的的绝对路径
            parser,
        },module=>{this.entries.push(module)},callback);
    }
    createModule(data,addEntry,callback){
        //先创建模块工厂
        const moduleFactory = new NormalModuleFactory();
        let module = moduleFactory.create(data);
        //非常非常重要 模块的ID如何生成? 模块的ID是一个相对于根目录的相对路径
        //index.js ./src/index.js title.js ./src/title.js
        //relative返回一个相对路径 从根目录出出到模块的绝地路径 得到一个相对路径
        module.moduleId = '.'+path.posix.sep+path.posix.relative(this.context,module.resource);
        addEntry&&addEntry(module);
        this.modules.push(module);//把模块添加到完整的模块数组中
        const afterBuild = (err,module)=>{
            if(module.dependencies){//如果一个模块编译完成,发现它有依赖的模块,那么递归编译它的依赖模块
                this.processModuleDependencies(module,(err)=>{
                    //当这个入口模块和它依赖的模块都编译完成了,才会让调用入口模块的回调
                    callback(err,module);
                });
            }else{
                callback(err,module);
            }
        }
        this.buildModule(module,afterBuild);
    }
    processModuleDependencies(module,callback){
        let dependencies= module.dependencies;
        //因为我希望可以并行的同时开始编译依赖的模块,然后等所有依赖的模块全部编译完成后才结束
        async.forEach(dependencies,(dependency,done)=>{
            let {name,context,rawRequest,resource,moduleId} = dependency;
            this.createModule({
                name,
                context,
                rawRequest,
                resource,
                moduleId,
                parser
            },null,done);
        },callback);
    }
    buildModule(module,afterBuild){
        module.build(this,(err)=>{
            this.hooks.succeedModule.call(module)
            afterBuild(null,module);
        });
    }
}
module.exports = Compilation;
```

### 6.3 webpack\Chunk.js

webpack\Chunk.js

```js
class Chunk {
    constructor(module) {
        this.entryModule = module;
        this.name = module.name;
        this.files = [];
        this.modules = [];
    }
}

module.exports = Chunk;
```

### 6.4 Stats.js

webpack\Stats.js

```diff
class Stats {
    constructor(compilation) {
        this.entries = compilation.entries;
        this.modules = compilation.modules;
+        this.chunks = compilation.chunks;
    }
    toJson() {
        return this;
    }
}
module.exports = Stats;
```

## 7.emit

### 7.1 Compilation.js

webpack\Compilation.js

```diff
const NormalModuleFactory = require('./NormalModuleFactory');
const async = require('neo-async');
const { Tapable, SyncHook } = require("tapable");
const Parser = require('./Parser');
const parser = new Parser();
const path = require('path');
+const Chunk = require('./Chunk');
+const ejs = require('ejs');
+const fs = require('fs');
+const mainTemplate = fs.readFileSync(path.join(__dirname,'template', 'main.ejs'), 'utf8');
+const mainRender = ejs.compile(mainTemplate);
class Compilation extends Tapable {
    constructor(compiler) {
        super();
        this.compiler = compiler;
        this.options = compiler.options;
        this.context = compiler.context;
        this.inputFileSystem = compiler.inputFileSystem;
        this.outputFileSystem = compiler.outputFileSystem;
        this.entries = [];
        this.modules = [];
        this.chunks = [];
+       this.files = [];  //生成的文件
+       this.assets = {}; //资源 
        this.hooks = {
            succeedModule: new SyncHook(["module"]),
            seal: new SyncHook([]),
            beforeChunks: new SyncHook([]),
            afterChunks: new SyncHook(["chunks"])
        }
    }
    seal(callback) {
        this.hooks.seal.call();
        this.hooks.beforeChunks.call();//生成代码块之前
        for (const module of this.entries) {//循环入口模块
            const chunk = new Chunk(module);//创建代码块
            this.chunks.push(chunk);//把代码块添加到代码块数组中
            //把代码块的模块添加到代码块中
            chunk.modules = this.modules.filter(module => module.name == chunk.name);
        }
        this.hooks.afterChunks.call(this.chunks);//生成代码块之后
+       this.createChunkAssets();
        callback();//封装结束
    }
+    createChunkAssets() {
+        for (let i = 0; i < this.chunks.length; i++) {
+            const chunk = this.chunks[i];
+            chunk.files = [];
+            const file = chunk.name + '.js';
+            const source = mainRender({ entryId: chunk.entryModule.moduleId, modules: chunk.modules });
+            chunk.files.push(file);
+            this.emitAsset(file, source);
+        }
+    }
+    emitAsset(file, source) {
+        this.assets[file] = source;
+        this.files.push(file);
+    }
    //context ./src/index.js main callback(终级回调)
    addEntry(context, entry, name, finalCallback) {
        this._addModuleChain(context, entry, name, (err, module) => {
        finalCallback(err, module);
        });
    }
    _addModuleChain(context, rawRequest, name, callback) {
        this.createModule({
        name,context,rawRequest,parser,
        resource:path.posix.join(context,rawRequest),
        moduleId:'./'+path.posix.relative(context,path.posix.join(context,rawRequest))
        },entryModule=>this.entries.push(entryModule),callback);
    }
    /**
    * 创建并编译一个模块
    * @param {*} data 要编译的模块信息
    * @param {*} addEntry  可选的增加入口的方法 如果这个模块是入口模块,如果不是的话,就什么不做
    * @param {*} callback 编译完成后可以调用callback回调
    */
    createModule(data, addEntry, callback) {
        //通过模块工厂创建一个模块
        let module = normalModuleFactory.create(data);
        addEntry&&addEntry(module);//如果是入口模块,则添加入口里去
        this.modules.push(module);//给普通模块数组添加一个模块
        const afterBuild = (err, module) => {
        //如果大于0,说明有依赖
        if (module.dependencies.length > 0) {
            this.processModuleDependencies(module, err => {
            callback(err, module);
            });
        } else {
            callback(err, module);
        }
        }
        this.buildModule(module, afterBuild);
    }
    /**
    * 处理编译模块依赖
    * @param {*} module ./src/index.js
    * @param {*} callback 
    */
    processModuleDependencies(module, callback) {
        //1.获取当前模块的依赖模块
        let dependencies = module.dependencies;
        //遍历依赖模块,全部开始编译,当所有的依赖模块全部编译完成后才调用callback
        async.forEach(dependencies, (dependency, done) => {
        let { name, context, rawRequest, resource, moduleId } = dependency;
        this.createModule({
            name,context,rawRequest,parser,
            resource,moduleId
        },null,done);
        }, callback);
    }
    buildModule(module,afterBuild){
        module.build(this,(err)=>{
            this.hooks.succeedModule.call(module)
            afterBuild(null,module);
        });
    }
}
module.exports = Compilation;
```

### 7.2 Compiler.js

webpack\Compiler.js

```diff
const { Tapable, SyncHook, SyncBailHook, AsyncParallelHook, AsyncSeriesHook } = require("tapable");
const Compilation = require('./Compilation');
const NormalModuleFactory = require('./NormalModuleFactory');
const Stats = require('./Stats');
+const mkdirp = require('mkdirp');
+const path = require('path');
class Compiler extends Tapable {
    constructor(context) {
        super();
        this.options = {};
        this.context = context; //设置上下文路径
        this.hooks = {
            entryOption: new SyncBailHook(["context", "entry"]),
            beforeRun: new AsyncSeriesHook(["compiler"]),
            run: new AsyncSeriesHook(["compiler"]),
            beforeCompile: new AsyncSeriesHook(["params"]),
            compile: new SyncHook(["params"]),
            make: new AsyncParallelHook(["compilation"]),
            thisCompilation: new SyncHook(["compilation", "params"]),
            compilation: new SyncHook(["compilation", "params"]),
            afterCompile:new AsyncSeriesHook(["compilation"]),
+            emit: new AsyncSeriesHook(["compilation"]),
            done: new AsyncSeriesHook(["stats"])
        };
    }
+    emitAssets(compilation, callback) {
+        const emitFiles = (err)=>{
+              const assets = compilation.assets;
+              let outputPath = this.options.output.path;//dist
+              for(let file in assets){
+                let source = assets[file];//得到文件名和文件内容 
+                let targetPath = path.posix.join(outputPath,file);//得到输出的路径 targetPath
+                this.outputFileSystem.writeFileSync(targetPath,source,'utf8');//NodeEnvironmentPlugin
+              }
+            callback();
+        }
+        this.hooks.emit.callAsync(compilation, err => {
+            mkdirp(this.options.output.path, emitFiles);
+        });
+    }
    run(finalCallback) {
        //编译完成后的回调
        const onCompiled = (err, compilation) => {
+            this.emitAssets(compilation,err=>{
+                 let stats = new Stats(compilation);//stats是一 个用来描述打包后结果的对象
+                  this.hooks.done.callAsync(stats,err=>{//done表示整个流程结束了
+                  callback(err,stats);
+                  });
+            });
        };
        //准备运行编译
        this.hooks.beforeRun.callAsync(this, err => {
            //运行
            this.hooks.run.callAsync(this, err => {
                this.compile(onCompiled); //开始编译,编译完成后执行conCompiled回调
            });
        });
    }
    compile(onCompiled) {
        const params = this.newCompilationParams();
        this.hooks.beforeCompile.callAsync(params, err => {
            this.hooks.compile.call(params);
            const compilation = this.newCompilation(params);
            this.hooks.make.callAsync(compilation, err => {
                compilation.seal(err => {
                    this.hooks.afterCompile.callAsync(compilation, err => {
                        return onCompiled(null, compilation);
                    });
                });
            });
        });
    }
    newCompilationParams() {
        const params = {
            normalModuleFactory: new NormalModuleFactory()
        };
        return params;
    }
    newCompilation(params) {
        const compilation = new Compilation(this);
        this.hooks.thisCompilation.call(compilation, params);
        this.hooks.compilation.call(compilation, params);
        return compilation;
    }

}
module.exports = Compiler;
```

### 7.3 main.ejs

webpack\main.ejs

```js
(function (modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
      }
      var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
      };
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      module.l = true;
      return module.exports;
    }
    return __webpack_require__("<%-entryModuleId%>");
  })
    ({
      <%
        for(let module of modules)
        {%>
            "<%-module.moduleId%>":
            (function (module, exports, __webpack_require__) {
              <%-module._source%>
            }),
        <%}
      %> 
    });
```

## 8.动态import

### 8.1 webpack.config.js

```diff
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'[name].js',
+        chunkFilename:'[name].js'
    }
```

### 8.2 src\index.js

src\index.js

```js
require('./sync');
//如果遇到了import,那么import的模块会成为一个单独的入口,会生成一个单独的代码块,会生成一个单独的文件
//如果import调用了一个模 块,那么这个模块和它依赖的模块会成一个单独的的异步代码块,里面所有的模块async=true
import(/*webpackChunkName: 'title'*/ './title').then(result=>{
    console.log(result.default);
});
import(/*webpackChunkName: 'sum'*/ './sum').then(result=>{
    console.log(result.default);
});
```

### 8.3 Chunk.js

webpack\Chunk.js

```diff
class Chunk {
    constructor(entryModule) {
        this.entryModule = entryModule;
        this.name = entryModule.name;
        this.files = [];
        this.modules = [];
+       this.async = entryModule.async;
    }
}

module.exports = Chunk;
```

### 8.4 Compilation.js

webpack\Compilation.js

```diff
const NormalModuleFactory = require('./NormalModuleFactory');
const async = require('neo-async');
const { Tapable, SyncHook } = require("tapable");
const Parser = require('./Parser');
const parser = new Parser();
const path = require('path');
const Chunk = require('./Chunk');
const ejs = require('ejs');
const fs = require('fs');
+const mainTemplate = fs.readFileSync(path.join(__dirname, 'template', 'mainTemplate.ejs'), 'utf8');
+const mainRender = ejs.compile(mainTemplate);
+const chunkTemplate = fs.readFileSync(path.join(__dirname, 'template', 'chunkTemplate.ejs'), 'utf8');
+const chunkRender = ejs.compile(chunkTemplate);
class Compilation extends Tapable {
    constructor(compiler) {
        super();
        this.compiler = compiler;
        this.options = compiler.options;
        this.context = compiler.context;
        this.inputFileSystem = compiler.inputFileSystem;
        this.outputFileSystem = compiler.outputFileSystem;
        this.entries = [];
        this.modules = [];
        this.chunks = [];
        this.files = [];  //生成的文件
        this.assets = {}; //资源 
        this.hooks = {
            succeedModule: new SyncHook(["module"]),
            seal: new SyncHook([]),
            beforeChunks: new SyncHook([]),
            afterChunks: new SyncHook(["chunks"])
        }
    }
    seal(callback) {
        this.hooks.seal.call();
        this.hooks.beforeChunks.call();//生成代码块之前
        for (const entryModule of this.entries) {//循环入口模块
            const chunk = new Chunk(entryModule);//创建代码块
            this.chunks.push(chunk);//把代码块添加到代码块数组中
            //把代码块的模块添加到代码块中
            chunk.modules = this.modules.filter(module => module.name == chunk.name);
        }
        this.hooks.afterChunks.call(this.chunks);//生成代码块之后
        this.createChunkAssets();
        callback();//封装结束
    }
    createChunkAssets() {
        for (let i = 0; i < this.chunks.length; i++) {
            const chunk = this.chunks[i];
            chunk.files = [];
            const file = chunk.name + '.js';
+            let source;
+            if (chunk.async) {
+                source = chunkRender({ chunkName: chunk.name, modules: chunk.modules });
+            } else {
+                source = mainRender({ entryModuleId: chunk.entryModule.moduleId, modules: chunk.modules });
+            }
            chunk.files.push(file);
            this.emitAsset(file, source);
        }
    }
    emitAsset(file, source) {
        this.assets[file] = source;
        this.files.push(file);
    }
    //context ./src/index.js main callback(终级回调)
    addEntry(context, entry, name, finalCallback) {
        this._addModuleChain(context, entry, name,false, (err, module) => {
        finalCallback(err, module);
        });
    }
    _addModuleChain(context, rawRequest, name,async, callback) {
        this.createModule({
        name,context,rawRequest,parser,
        resource:path.posix.join(context,rawRequest),
        moduleId:'./'+path.posix.relative(context,path.posix.join(context,rawRequest)),
        async
        },entryModule=>this.entries.push(entryModule),callback);
    }
    /**
    * 创建并编译一个模块
    * @param {*} data 要编译的模块信息
    * @param {*} addEntry  可选的增加入口的方法 如果这个模块是入口模块,如果不是的话,就什么不做
    * @param {*} callback 编译完成后可以调用callback回调
    */
    createModule(data, addEntry, callback) {
        //通过模块工厂创建一个模块
        let module = normalModuleFactory.create(data);
        addEntry&&addEntry(module);//如果是入口模块,则添加入口里去
        this.modules.push(module);//给普通模块数组添加一个模块
        const afterBuild = (err, module) => {
        //如果大于0,说明有依赖
        if (module.dependencies.length > 0) {
            this.processModuleDependencies(module, err => {
            callback(err, module);
            });
        } else {
            callback(err, module);
        }
        }
        this.buildModule(module, afterBuild);
    }
    /**
    * 处理编译模块依赖
    * @param {*} module ./src/index.js
    * @param {*} callback 
    */
    processModuleDependencies(module, callback) {
        //1.获取当前模块的依赖模块
        let dependencies = module.dependencies;
        //遍历依赖模块,全部开始编译,当所有的依赖模块全部编译完成后才调用callback
        async.forEach(dependencies, (dependency, done) => {
        let { name, context, rawRequest, resource, moduleId } = dependency;
        this.createModule({
            name,context,rawRequest,parser,
            resource,moduleId
        },null,done);
        }, callback);
    }
    buildModule(module, afterBuild) {
        module.build(this, (err) => {
            this.hooks.succeedModule.call(module);
            return afterBuild();
        });
    }
}
module.exports = Compilation;
```

### 8.5 NormalModule.js

webpack\NormalModule.js

```diff
const types = require('babel-types');
const generate = require('babel-generator').default;
const traverse = require('babel-traverse').default;
const path = require('path');
const async = require('neo-async');
class NormalModule {
+    constructor({ name, context, rawRequest, resource, parser, moduleId, async }) {
        this.name = name;
        this.context = context;
        this.rawRequest = rawRequest;
        this.resource = resource;
         this.moduleId = moduleId||('./'+path.posix.relative(context,resource));
        this.parser = parser;
        this._source = null;
        this._ast = null;
        this.dependencies = [];
+       this.blocks = [];
+       this.async = async;
    }
    //解析依赖
    build(compilation, callback) {
        this.doBuild(compilation, err => {
            let originalSource = this.getSource(this.resource, compilation);
            // 将 当前模块 的内容转换成 AST
            const ast = this.parser.parse(originalSource);
            traverse(ast, {
                // 如果当前节点是一个函数调用时
                CallExpression: (nodePath) => {
                    let node = nodePath.node;
                    // 当前节点是 require 时
                    if (node.callee.name === 'require') {
                        //修改require为__webpack_require__
                        node.callee.name = '__webpack_require__';
                        //获取要加载的模块ID
                        let moduleName = node.arguments[0].value;
                        //获取扩展名
                        let extension = moduleName.split(path.posix.sep).pop().indexOf('.') == -1 ? '.js' : '';
                        //获取依赖模块的绝对路径
                        let dependencyResource = path.posix.join(path.posix.dirname(this.resource), moduleName + extension);
                        //获取依赖模块的模块ID
                        let dependencyModuleId = '.' + path.posix.sep + path.posix.relative(this.context, dependencyResource);
                        //添加依赖
                        this.dependencies.push({
                            name: this.name, context: this.context, rawRequest: moduleName,
                            moduleId: dependencyModuleId, resource: dependencyResource
                        });
                        node.arguments = [types.stringLiteral(dependencyModuleId)];
+                    } else if (types.isImport(nodePath.node.callee)) {
+                        //获取要加载的模块ID
+                        let moduleName = node.arguments[0].value;
+                        //获取扩展名
+                        let extension = moduleName.split(path.posix.sep).pop().indexOf('.') == -1 ? '.js' : '';
+                        //获取依赖模块的绝对路径
+                        let dependencyResource = path.posix.join(path.posix.dirname(this.resource), moduleName + extension);
+                        //获取依赖模块的模块ID
+                        let dependencyModuleId = '.' + path.posix.sep + path.posix.relative(this.context, dependencyResource);
+                        //获取代码块的ID
+                      let chunkName = compilation.asyncChunkCounter++;
+                        if(Array.isArray(node.arguments[0].leadingComments)&&
+                        node.arguments[0].leadingComments.length>0){
+                            let leadingComments = node.arguments[0].leadingComments[0].value;
+                            let regexp = /webpackChunkName:\s*['"]([^'"]+)['"]/;
+                            chunkName = leadingComments.match(regexp)[1];
+                        }
+                        nodePath.replaceWithSourceString(`__webpack_require__.e("${chunkName}").then(__webpack_require__.t.bind(null,"${depModuleId}", 7))`);
+                        `);
+                        this.blocks.push({
+                            context: this.context,
+                            entry: dependencyModuleId,
+                            name: dependencyChunkId,
+                            async: true
+                        });
                    }
                },
            });
            let { code } = generate(ast);
            this._source = code;
            this._ast = ast;
+           async.forEach(this.blocks, ({ context, entry, name, async }, done) => {
+                compilation._addModuleChain(context, entry, name, async, done);
+           }, callback);
        });
    }
    //获取模块代码
    doBuild(compilation, callback) {
        let originalSource = this.getSource(this.resource, compilation);
        this._source = originalSource;
        callback();
    }
    getSource(resource, compilation) {
        let originalSource = compilation.inputFileSystem.readFileSync(resource, 'utf8');
        return originalSource;
    }
}
module.exports = NormalModule;
```

### 8.6 webpack\mainTemplate.ejs

webpack\mainTemplate.ejs

```js
(function (modules) {
    function webpackJsonpCallback(data) {
      var chunkIds = data[0];
      var moreModules = data[1];
      var moduleId, chunkId, i = 0, resolves = [];
      for (; i < chunkIds.length; i++) {
        chunkId = chunkIds[i];
        if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
          resolves.push(installedChunks[chunkId][0]);
        }
        installedChunks[chunkId] = 0;
      }
      for (moduleId in moreModules) {
        if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
          modules[moduleId] = moreModules[moduleId];
        }
      }
      if (parentJsonpFunction) parentJsonpFunction(data);
      while (resolves.length) {
        resolves.shift()();
      }
    };
    var installedModules = {};
    var installedChunks = {
      "main": 0
    };
    function jsonpScriptSrc(chunkId) {
      return __webpack_require__.p + "" + ({ "sum": "sum", "title": "title" }[chunkId] || chunkId) + ".js"
    }
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
      }
      var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
      };
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      module.l = true;
      return module.exports;
    }
    __webpack_require__.e = function requireEnsure(chunkId) {
      var promises = [];
      var installedChunkData = installedChunks[chunkId];
      if (installedChunkData !== 0) {
        if (installedChunkData) {
          promises.push(installedChunkData[2]);
        } else {
          var promise = new Promise(function (resolve, reject) {
            installedChunkData = installedChunks[chunkId] = [resolve, reject];
          });
          promises.push(installedChunkData[2] = promise);
          var script = document.createElement('script');
          var onScriptComplete;
          script.charset = 'utf-8';
          script.timeout = 120;
          if (__webpack_require__.nc) {
            script.setAttribute("nonce", __webpack_require__.nc);
          }
          script.src = jsonpScriptSrc(chunkId);
          var error = new Error();
          onScriptComplete = function (event) {
            script.onerror = script.onload = null;
            clearTimeout(timeout);
            var chunk = installedChunks[chunkId];
            if (chunk !== 0) {
              if (chunk) {
                var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                var realSrc = event && event.target && event.target.src;
                error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
                error.name = 'ChunkLoadError';
                error.type = errorType;
                error.request = realSrc;
                chunk[1](error);
              }
              installedChunks[chunkId] = undefined;
            }
          };
          var timeout = setTimeout(function () {
            onScriptComplete({ type: 'timeout', target: script });
          }, 120000);
          script.onerror = script.onload = onScriptComplete;
          document.head.appendChild(script);
        }
      }
      return Promise.all(promises);
    };
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function (exports, name, getter) {
      if (!__webpack_require__.o(exports, name)) {
        Object.defineProperty(exports, name, { enumerable: true, get: getter });
      }
    };
    __webpack_require__.r = function (exports) {
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
      }
      Object.defineProperty(exports, '__esModule', { value: true });
    };
    __webpack_require__.t = function (value, mode) {
      if (mode & 1) value = __webpack_require__(value);
      if (mode & 8) return value;
      if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
      var ns = Object.create(null);
      __webpack_require__.r(ns);
      Object.defineProperty(ns, 'default', { enumerable: true, value: value });
      if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
      return ns;
    };
    __webpack_require__.n = function (module) {
      var getter = module && module.__esModule ?
        function getDefault() { return module['default']; } :
        function getModuleExports() { return module; };
      __webpack_require__.d(getter, 'a', getter);
      return getter;
    };
    __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    __webpack_require__.p = "";
    __webpack_require__.oe = function (err) { console.error(err); throw err; };
    var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
    var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
    jsonpArray.push = webpackJsonpCallback;
    jsonpArray = jsonpArray.slice();
    for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
    var parentJsonpFunction = oldJsonpFunction;
    return __webpack_require__(__webpack_require__.s = "<%-entryModuleId%>");
  })
    ({
        <%
        for(let module of modules)
        {%>
            "<%-module.moduleId%>":
            (function (module, exports, __webpack_require__) {
              <%-module._source%>
            }),
        <%}
      %> 
    });
```

### 8.7 chunkTemplate.ejs

webpack\chunkTemplate.ejs

```js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["<%-chunkName%>"], {
    <%
    for(let module of modules)
    {%>
        "<%-module.moduleId%>":
        (function (module, exports, __webpack_require__) {
          <%-module._source%>
        }),
    <%}
  %> 
  }]);
```

### 8.8 dist\main.js

dist\main.js

```js
(function (modules) {
  function webpackJsonpCallback(data) {
    var chunkIds = data[0];
    var moreModules = data[1];
    var moduleId, chunkId, i = 0, resolves = [];
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
        resolves.push(installedChunks[chunkId][0]);
      }
      installedChunks[chunkId] = 0;
    }
    for (moduleId in moreModules) {
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        modules[moduleId] = moreModules[moduleId];
      }
    }
    if (parentJsonpFunction) parentJsonpFunction(data);
    while (resolves.length) {
      resolves.shift()();
    }
  };
  var installedModules = {};
  var installedChunks = {
    "main": 0
  };
  function jsonpScriptSrc(chunkId) {
    return __webpack_require__.p + "" + ({ "sum": "sum", "title": "title" }[chunkId] || chunkId) + ".js"
  }
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    module.l = true;
    return module.exports;
  }
  __webpack_require__.e = function requireEnsure(chunkId) {
    var promises = [];
    var installedChunkData = installedChunks[chunkId];
    if (installedChunkData !== 0) {
      if (installedChunkData) {
        promises.push(installedChunkData[2]);
      } else {
        var promise = new Promise(function (resolve, reject) {
          installedChunkData = installedChunks[chunkId] = [resolve, reject];
        });
        promises.push(installedChunkData[2] = promise);
        var script = document.createElement('script');
        var onScriptComplete;
        script.charset = 'utf-8';
        script.timeout = 120;
        if (__webpack_require__.nc) {
          script.setAttribute("nonce", __webpack_require__.nc);
        }
        script.src = jsonpScriptSrc(chunkId);
        var error = new Error();
        onScriptComplete = function (event) {
          script.onerror = script.onload = null;
          clearTimeout(timeout);
          var chunk = installedChunks[chunkId];
          if (chunk !== 0) {
            if (chunk) {
              var errorType = event && (event.type === 'load' ? 'missing' : event.type);
              var realSrc = event && event.target && event.target.src;
              error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
              error.name = 'ChunkLoadError';
              error.type = errorType;
              error.request = realSrc;
              chunk[1](error);
            }
            installedChunks[chunkId] = undefined;
          }
        };
        var timeout = setTimeout(function () {
          onScriptComplete({ type: 'timeout', target: script });
        }, 120000);
        script.onerror = script.onload = onScriptComplete;
        document.head.appendChild(script);
      }
    }
    return Promise.all(promises);
  };
  __webpack_require__.m = modules;
  __webpack_require__.c = installedModules;
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };
  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
    return ns;
  };
  __webpack_require__.n = function (module) {
    var getter = module && module.__esModule ?
      function getDefault() { return module['default']; } :
      function getModuleExports() { return module; };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };
  __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  __webpack_require__.p = "";
  __webpack_require__.oe = function (err) { console.error(err); throw err; };
  var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
  var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
  jsonpArray.push = webpackJsonpCallback;
  jsonpArray = jsonpArray.slice();
  for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
  var parentJsonpFunction = oldJsonpFunction;
  return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
  ({

    "./src/index.js":
      (function (module, exports, __webpack_require__) {
        __webpack_require__("./src/sync.js");
        //如果遇到了import,那么import的模块会成为一个单独的入口,会生成一个单独的代码块,会生成一个单独的文件
        //如果import调用了一个模 块,那么这个模块和它依赖的模块会成一个单独的的异步代码块,里面所有的模块async=true
        __webpack_require__.e("title").then(__webpack_require__.t.bind(null, "./src/title.js", 7)).then(result => {
          console.log(result.default);
        });
        __webpack_require__.e("sum").then(__webpack_require__.t.bind(null, "./src/sum.js", 7)).then(result => {
          console.log(result.default);
        });
      }),

    "./src/sync.js":
      (function (module, exports, __webpack_require__) {
        module.exports = 'sync';
      }),

  });
```

### 8.9 sum.js

dist\sum.js

```js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["sum"], {
        "./src/sum.js":
        (function (module, exports, __webpack_require__) {
          module.exports = 'sum';
        }),
  }]);
```

### 8.10 title.js

dist\title.js

```js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["title"], {
  "./src/title.js":
    (function (module, exports, __webpack_require__) {
      let inner_title = __webpack_require__("./src/inner_title.js");
      module.exports = inner_title;
    }),
  "./src/inner_title.js":
    (function (module, exports, __webpack_require__) {
      module.exports = 'inner_title';
    }),
}]);
```

## 9.加载第三方模块

### 9.1 src\index.js

```js
let _ = require('lodash');
console.log(_.join([1, 2, 3]));
```

### 9.2 NormalModule.js

webpack\NormalModule.js

```diff
const types = require('babel-types');
const generate = require('babel-generator').default;
const traverse = require('babel-traverse').default;
const path = require('path');
const async = require('neo-async');
class NormalModule {
    constructor({ name, context, rawRequest, resource, parser, moduleId, async }) {
        this.name = name;
        this.context = context;
        this.rawRequest = rawRequest;
        this.resource = resource;
        this.moduleId = moduleId||('./'+path.posix.relative(context,resource));
        this.parser = parser;
        this._source = null;
        this._ast = null;
        this.dependencies = [];
        this.blocks = [];
        this.async = async;
    }
    //解析依赖
    build(compilation, callback) {
        this.doBuild(compilation, err => {
            let originalSource = this.getSource(this.resource, compilation);
            // 将 当前模块 的内容转换成 AST
            const ast = this.parser.parse(originalSource);
            traverse(ast, {
                // 如果当前节点是一个函数调用时
                CallExpression: (nodePath) => {
                    let node = nodePath.node;
                    debugger
                    // 当前节点是 require 时
                    if (node.callee.name === 'require') {
                        //修改require为__webpack_require__
                        node.callee.name = '__webpack_require__';
                        //获取要加载的模块ID
                        let moduleName = node.arguments[0].value;
+                        let dependencyResource;
+                        if (moduleName.startsWith('.')) {
+                            //获取扩展名
+                            let extension = moduleName.split(path.posix.sep).pop().indexOf('.') == -1 ? '.js' : '';
+                            //获取依赖模块的绝对路径
+                            dependencyResource = path.posix.join(path.posix.dirname(this.resource), moduleName + extension);
+                        } else {
+                            dependencyResource = require.resolve(path.posix.join(this.context, 'node_modules', moduleName));
+                            dependencyResource = dependencyResource.replace(/\\/g, path.posix.sep);
+                        }
+                        //获取依赖模块的模块ID
+                        let dependencyModuleId = '.' + dependencyResource.slice(this.context.length);
                        //添加依赖
                        this.dependencies.push({
                            name: this.name, context: this.context, rawRequest: moduleName,
                            moduleId: dependencyModuleId, resource: dependencyResource
                        });
                        node.arguments = [types.stringLiteral(dependencyModuleId)];
                    } else if (types.isImport(nodePath.node.callee)) {
                        //获取要加载的模块ID
                        let moduleName = node.arguments[0].value;
                        //获取扩展名
                        let extension = moduleName.split(path.posix.sep).pop().indexOf('.') == -1 ? '.js' : '';
                        //获取依赖模块的绝对路径
                        let dependencyResource = path.posix.join(path.posix.dirname(this.resource), moduleName + extension);
                        //获取依赖模块的模块ID
                        let dependencyModuleId = '.' + path.posix.sep + path.posix.relative(this.context, dependencyResource);
                        //获取代码块的ID
                        let dependencyChunkId = dependencyModuleId.slice(2, dependencyModuleId.lastIndexOf('.')).replace(path.posix.sep, '_', 'g');
                        // chunkId 不需要带 .js 后缀
                        nodePath.replaceWithSourceString(`
                            __webpack_require__.e("${dependencyChunkId}").then(__webpack_require__.t.bind(null,"${dependencyModuleId}",7))
                        `);
                        this.blocks.push({
                            context: this.context,
                            entry: dependencyModuleId,
                            name: dependencyChunkId,
                            async: true
                        });
                    }
                },
            });
            let { code } = generate(ast);
            this._source = code;
            this._ast = ast;
            async.forEach(this.blocks, ({ context, entry, name, async }, done) => {
                compilation._addModuleChain(context, entry, name, async, done);
            }, callback);
        });
    }
    //获取模块代码
    doBuild(compilation, callback) {
        let originalSource = this.getSource(this.resource, compilation);
        this._source = originalSource;
        callback();
    }
    getSource(resource, compilation) {
        let originalSource = compilation.inputFileSystem.readFileSync(resource, 'utf8');
        return originalSource;
    }
}
module.exports = NormalModule;
```

## 10.分离commons和vendor

### 10.1 webpack.config.js

```diff
const path = require('path');
module.exports = {
    context: process.cwd(),
    mode: 'development',
    devtool: 'none',
+   entry: {
+       entry1: './src/entry1.js',
+       entry2: './src/entry2.js',
+   },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
}
```

### 10.2 src\entry1.js

src\entry1.js

```js
let title = require('./title');
let _ = require('lodash');
console.log(_.upperCase(title));
```

### 10.3 src\entry2.js

src\entry2.js

```js
let title = require('./title');
let _ = require('lodash');
console.log(_.upperCase(title));
```

### 10.4 EntryOptionPlugin.js

webpack\plugins\EntryOptionPlugin.js

```diff
const SingleEntryPlugin = require("./SingleEntryPlugin");
class EntryOptionPlugin {
    apply(compiler) {
        compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
+            if (typeof entry == 'string') {
+                new SingleEntryPlugin(context, entry, 'main').apply(compiler);
+            } else {
+                // 处理多入口
+                for (let entryName in entry) {
+                    new SingleEntryPlugin(context, entry[entryName], entryName).apply(compiler);
+                }
+            }
        });
    }
}
module.exports = EntryOptionPlugin;
```

### 10.5 Compilation.js

webpack\Compilation.js

```diff
const NormalModuleFactory = require('./NormalModuleFactory');
const async = require('neo-async');
const { Tapable, SyncHook } = require("tapable");
const Parser = require('./Parser');
const parser = new Parser();
const path = require('path');
const Chunk = require('./Chunk');
const ejs = require('ejs');
const fs = require('fs');
+const mainTemplate = fs.readFileSync(path.join(__dirname, 'template', 'mainDeferTemplate.ejs'), 'utf8');
const mainRender = ejs.compile(mainTemplate);
const chunkTemplate = fs.readFileSync(path.join(__dirname, 'template', 'chunkTemplate.ejs'), 'utf8');
const chunkRender = ejs.compile(chunkTemplate);
class Compilation extends Tapable {
    constructor(compiler) {
        super();
        this.compiler = compiler;
        this.options = compiler.options;
        this.context = compiler.context;
        this.inputFileSystem = compiler.inputFileSystem;
        this.outputFileSystem = compiler.outputFileSystem;
        this.entries = [];
        this.modules = [];
        this.chunks = [];
        this.files = [];  //生成的文件
        this.assets = {}; //资源 
+        this.vendors = [];//第三方模块
+        this.commons = [];//不在node_modules,调用次数大于1的模块
+        this.commonsCountMap = {};//map
        this.hooks = {
            succeedModule: new SyncHook(["module"]),
            seal: new SyncHook([]),
            beforeChunks: new SyncHook([]),
            afterChunks: new SyncHook(["chunks"])
        }
    }
    seal(callback) {
        this.hooks.seal.call();
        this.hooks.beforeChunks.call();//生成代码块之前
+        for (const module of this.modules) {//循环入口模块
+            if (/node_modules/.test(module.moduleId)) {
+                module.name = 'vendors';
+                this.vendors.push(module);
+            } else {
+                if (this.commonsCountMap[module.moduleId]) {
+                    this.commonsCountMap[module.moduleId].count++;
+                } else {
+                    this.commonsCountMap[module.moduleId] = { count: 1, module };
+                }
+            }
+        }
+        for (let moduleId in this.commonsCountMap) {
+            const moduleCount = this.commonsCountMap[moduleId];
+            let { module, count } = moduleCount;
+            if (count >= 2) {
+                module.name = 'commons';
+                this.commons.push(module);
+            }
+        }
+        let excludeModuleIds = [...this.vendors, ...this.commons].map(item => item.moduleId);
+        this.modules = this.modules.filter(item => !excludeModuleIds.includes(item.moduleId));

        for (const module of this.entries) {//循环入口模块
            const chunk = new Chunk(module);//创建代码块
            this.chunks.push(chunk);//把代码块添加到代码块数组中
            //把代码块的模块添加到代码块中
            chunk.modules = this.modules.filter(module => module.name == chunk.name);
        }
+        if (this.vendors.length) {
+            const chunk = new Chunk(this.vendors[0]);
+            chunk.async = true;
+            this.chunks.push(chunk);
+            chunk.modules = this.vendors;
+        }
+        if (this.commons.length) {
+            const chunk = new Chunk(this.commons[0]);
+            chunk.async = true;
+            this.chunks.push(chunk);
+            chunk.modules = this.commons;
+        }
        this.hooks.afterChunks.call(this.chunks);//生成代码块之后
        this.createChunkAssets();
        callback();//封装结束
    }
    createChunkAssets() {
        for (let i = 0; i < this.chunks.length; i++) {
            const chunk = this.chunks[i];
            chunk.files = [];
            const file = chunk.name + '.js';
            let source;
            if (chunk.async) {
                source = chunkRender({ chunkName: chunk.name, modules: chunk.modules });
            } else {
+                let deferredChunks = [];
+                if (this.commons.length) deferredChunks.push('commons');
+                if (this.vendors.length) deferredChunks.push('vendors');
+                source = mainRender({ entryId: chunk.entryModule.moduleId, modules: chunk.modules, deferredChunks });
            }
            chunk.files.push(file);
            this.emitAsset(file, source);
        }

    }
    emitAsset(file, source) {
        this.assets[file] = source;
        this.files.push(file);
    }
    //context ./src/index.js main callback(终级回调)
    _addModuleChain(context,entry,name,async,callback){
        this.createModule({
            name,//所属的代码块的名称 main
            context:this.context,//上下文
            rawRequest:entry,// ./src/index.js
            resource:path.posix.join(context,entry),//此模块entry的的绝对路径
            parser,
            async
        },module=>{this.entries.push(module)},callback);
    }
    createModule(data,addEntry,callback){
        //先创建模块工厂
        const moduleFactory = new NormalModuleFactory();
        let module = moduleFactory.create(data);
        //非常非常重要 模块的ID如何生成? 模块的ID是一个相对于根目录的相对路径
        //index.js ./src/index.js title.js ./src/title.js
        //relative返回一个相对路径 从根目录出出到模块的绝地路径 得到一个相对路径
        module.moduleId = '.'+path.posix.sep+path.posix.relative(this.context,module.resource);
        addEntry&&addEntry(module);
        this.modules.push(module);//把模块添加到完整的模块数组中
        const afterBuild = (err,module)=>{
            if(module.dependencies){//如果一个模块编译完成,发现它有依赖的模块,那么递归编译它的依赖模块
                this.processModuleDependencies(module,(err)=>{
                    //当这个入口模块和它依赖的模块都编译完成了,才会让调用入口模块的回调
                    callback(err,module);
                });
            }else{
                callback(err,module);
            }
        }
        this.buildModule(module,afterBuild);
    }
    processModuleDependencies(module,callback){
        let dependencies= module.dependencies;
        //因为我希望可以并行的同时开始编译依赖的模块,然后等所有依赖的模块全部编译完成后才结束
        async.forEach(dependencies,(dependency,done)=>{
            let {name,context,rawRequest,resource,moduleId} = dependency;
            this.createModule({
                name,
                context,
                rawRequest,
                resource,
                moduleId,
                parser
            },null,done);
        },callback);
    }
    buildModule(module,afterBuild){
        module.build(this,(err)=>{
            this.hooks.succeedModule.call(module)
            afterBuild(null,module);
        });
    }
}
module.exports = Compilation;
```

### 10.6 mainDeferTemplate.ejs

webpack\template\mainDeferTemplate.ejs

```js
(function (modules) {
  function webpackJsonpCallback(data) {
    var chunkIds = data[0];
    var moreModules = data[1];
    var executeModules = data[2];
    var moduleId, chunkId, i = 0, resolves = [];
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
        resolves.push(installedChunks[chunkId][0]);
      }
      installedChunks[chunkId] = 0;
    }
    for (moduleId in moreModules) {
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        modules[moduleId] = moreModules[moduleId];
      }
    }
    if (parentJsonpFunction) parentJsonpFunction(data);
    while (resolves.length) {
      resolves.shift()();
    }
    deferredModules.push.apply(deferredModules, executeModules || []);
    return checkDeferredModules();
  };
  function checkDeferredModules() {
    debugger
    var result;
    for (var i = 0; i < deferredModules.length; i++) {
      var deferredModule = deferredModules[i];
      var fulfilled = true;
      for (var j = 1; j < deferredModule.length; j++) {
        var depId = deferredModule[j];
        if (installedChunks[depId] !== 0) fulfilled = false;
      }
      if (fulfilled) {
        deferredModules.splice(i--, 1);
        result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
      }
    }
    return result;
  }
  var installedModules = {};
  var installedChunks = {
    "entry1": 0
  };
  var deferredModules = [];
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    module.l = true;
    return module.exports;
  }
  __webpack_require__.m = modules;
  __webpack_require__.c = installedModules;
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };
  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
    return ns;
  };
  __webpack_require__.n = function (module) {
    var getter = module && module.__esModule ?
      function getDefault() { return module['default']; } :
      function getModuleExports() { return module; };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };
  __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  __webpack_require__.p = "";
  var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
  var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
  jsonpArray.push = webpackJsonpCallback;
  jsonpArray = jsonpArray.slice();
  for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
  var parentJsonpFunction = oldJsonpFunction;
  deferredModules.push(["<%=entryId%>"<%-deferredChunks.length>0?',"'+deferredChunks.join('","')+'"':""%>]);
  return checkDeferredModules();
})
  ({
    <%
          for(let id in modules){
              let {moduleId,_source} = modules[id];%>
              "<%-moduleId%>":
              (function (module, exports,__webpack_require__) {
                <%-_source%>
              }),
           <%}
        %>
  });
```

## 11.支持loader

### 11.1 webpack.config.js

```diff
const path = require('path');
module.exports = {
    context: process.cwd(),
    mode: 'development',
    devtool: 'none',
+    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ['style-loader', 'less-loader']
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
}
```

### 11.2 src\index.js

src\index.js

```diff
+require('./index.less');
let title = require('./title');
let _ = require('lodash');
console.log(_.upperCase(title));
```

### 11.3 NormalModule.js

webpack\NormalModule.js

```diff
const types = require('babel-types');
const generate = require('babel-generator').default;
const traverse = require('babel-traverse').default;
const path = require('path');
const async = require('neo-async');
const runLoaders = require('./loader-runner');
const fs = require('fs');
class NormalModule {
    constructor({ name, context, rawRequest, resource, parser, moduleId, async }) {
        this.name = name;
        this.context = context;
        this.rawRequest = rawRequest;
        this.resource = resource;
        this.moduleId = moduleId||('./'+path.posix.relative(context,resource));
        this.parser = parser;
        this._source = null;
        this._ast = null;
        this.dependencies = [];
        this.blocks = [];
        this.async = async;
    }
    //解析依赖
    build(compilation, callback) {
        this.doBuild(compilation, err => {
+            const afterSource = (err, source) => {
                // 将 当前模块 的内容转换成 AST
                const ast = this.parser.parse(source);
                traverse(ast, {
                    // 如果当前节点是一个函数调用时
                    CallExpression: (nodePath) => {
                        let node = nodePath.node;
                        // 当前节点是 require 时
                        if (node.callee.name === 'require') {
                            //修改require为__webpack_require__
                            node.callee.name = '__webpack_require__';
                            //获取要加载的模块ID
                            let moduleName = node.arguments[0].value;
                            let dependencyResource;
                            if (moduleName.startsWith('.')) {
                                //获取扩展名
                                let extension = moduleName.split(path.posix.sep).pop().indexOf('.') == -1 ? '.js' : '';
                                //获取依赖模块的绝对路径
                                dependencyResource = path.posix.join(path.posix.dirname(this.resource), moduleName + extension);
                            } else {
                                dependencyResource = require.resolve(path.posix.join(this.context, 'node_modules', moduleName));
                                dependencyResource = dependencyResource.replace(/\\/g, path.posix.sep);
                            }
                            //获取依赖模块的模块ID
                            let dependencyModuleId = '.' + dependencyResource.slice(this.context.length);
                            //添加依赖
                            this.dependencies.push({
                                name: this.name, context: this.context, rawRequest: moduleName,
                                moduleId: dependencyModuleId, resource: dependencyResource
                            });
                            node.arguments = [types.stringLiteral(dependencyModuleId)];
                        } else if (types.isImport(nodePath.node.callee)) {
                            //获取要加载的模块ID
                            let moduleName = node.arguments[0].value;
                            //获取扩展名
                            let extension = moduleName.split(path.posix.sep).pop().indexOf('.') == -1 ? '.js' : '';
                            //获取依赖模块的绝对路径
                            let dependencyResource = path.posix.join(path.posix.dirname(this.resource), moduleName + extension);
                            //获取依赖模块的模块ID
                            let dependencyModuleId = '.' + path.posix.sep + path.posix.relative(this.context, dependencyResource);
                            //获取代码块的ID
                            let dependencyChunkId = dependencyModuleId.slice(2, dependencyModuleId.lastIndexOf('.')).replace(path.posix.sep, '_', 'g');
                            // chunkId 不需要带 .js 后缀
                            nodePath.replaceWithSourceString(`
                 __webpack_require__.e("${dependencyChunkId}").then(__webpack_require__.t.bind(null,"${dependencyModuleId}",7))
             `);
                            this.blocks.push({
                                context: this.context,
                                entry: dependencyModuleId,
                                name: dependencyChunkId,
                                async: true
                            });
                        }
                    },
                });
                let { code } = generate(ast);
                this._source = code;
                this._ast = ast;
                async.forEach(this.blocks, ({ context, entry, name, async }, done) => {
                    compilation._addModuleChain(context, entry, name, async, done);
                }, callback);
            }
+            this.getSource(this.resource, compilation, afterSource);
        });
    }
    //获取模块代码
    doBuild(compilation, callback) {
+        this.getSource(this.resource, compilation, (err, source) => {
+            this._source = source;
+            callback();
+        });
    }
+    getSource(resource, compilation, callback) {
+        let { module: { rules } } = compilation.options;
+        let loaders = [];
+        for (let i = 0; i < rules.length; i++) {
+            let rule = rules[i];
+            if (rule.test.test(resource)) {
+                let useLoaders = rule.use;
+                loaders = [...loaders, ...useLoaders];
+            }
+        }
+        loaders = loaders.map(loader => require.resolve(path.posix.join(this.context, 'loaders', loader)));
+        let source = runLoaders({
+            resource,
+            loaders,
+            context: {},
+            readResource: fs
+        }, function (err, result) {
+            callback(err, result);
+        });
+        return source;
    }
}
module.exports = NormalModule;
```

### 11.4 less-loader.js

loaders\less-loader.js

```js
var less = require('less');
module.exports = function (source) {
    let css;
    less.render(source, (err, output) => {
        css = output.css;
    });
    return css;
}
```

### 11.5 style-loader.js

loaders\style-loader.js

```js
module.exports = function (source) {
    let str = `
      let style = document.createElement('style');
      style.innerHTML = ${JSON.stringify(source)};
      document.head.appendChild(style);
    `;
    return str;
}
```

### 11.6 index.less

src\index.less

```js
@color:red;
body{
    background-color:@color;
}
```

### 11.7 loader-runner.js

webpack\loader-runner.js

```js
const fs = require('fs');
const path = require('path');
const readFile = fs.readFile.bind(fs);
const PATH_QUERY_FRAGMENT_REGEXP = /^([^?#]*)(\?[^#]*)?(#.*)?$/;

function parsePathQueryFragment(resource){//resource =./src/index.js?name=zhufeng#top
  let result = PATH_QUERY_FRAGMENT_REGEXP.exec(resource);
  return {
      path:result[1],  //路径名 ./src/index.js
      query:result[2],  //   ?name=zhufeng
      fragment:result[3]// #top
  }
}
function loadLoader(loaderObject){
  let normal = require(loaderObject.path);
  loaderObject.normal = normal;
  loaderObject.pitch = normal.pitch;
  loaderObject.raw = normal.raw;
}
function convertArgs(args,raw){
  if(raw&&!Buffer.isBuffer(args[0])){//如果这个loader需要 buffer,args[0]不是,需要转成buffer
    args[0] = Buffer.from(args[0],'utf8');
  }else if(!raw && Buffer.isBuffer(args[0])){
    args[0] = args[0].toString('utf8');
  }
}
//loader绝对路径 C:\aproject\zhufeng202009webpack\3.loader\loaders\inline-loader1.js
function createLoaderObject(loader){
  let obj = {
      path:'',//当前loader的绝对路径
      query:'',//当前loader的查询参数
      fragment:'',//当前loader的片段
      normal:null,//当前loader的normal函数
      pitch:null,//当前loader的pitch函数
      raw:null,//是否是Buffer
      data:{},//自定义对象 每个loader都会有一个data自定义对象
      pitchExecuted:false,//当前 loader的pitch函数已经执行过了,不需要再执行了
      normalExecuted:false//当前loader的normal函数已经执行过了,不需要再执行
  }
  Object.defineProperty(obj,'request',{
      get(){
          return obj.path + obj.query+obj.fragment;
      },
      set(value){
        let splittedRequest = parsePathQueryFragment(value);
        obj.path = splittedRequest.path;
        obj.query = splittedRequest.query;
        obj.fragment = splittedRequest.fragment;
      }
  });
  obj.request = loader;
  return obj;
}
function processResource(options,loaderContext,callback){
    //重置loaderIndex 改为loader长度减1
    loaderContext.loaderIndex = loaderContext.loaders.length-1;
    let resourcePath = loaderContext.resourcePath;
    //调用 fs.readFile方法读取资源内容
    options.readResource(resourcePath,function(err,buffer){
        if(err) return callback(error);
        options.resourceBuffer = buffer;//resourceBuffer放的是资源的原始内容
        iterateNormalLoaders(options,loaderContext,[buffer],callback);
    });
}
function iterateNormalLoaders(options,loaderContext,args,callback){
    if(loaderContext.loaderIndex<0){//如果正常的normal loader全部执行完了
        return callback(null,args);
    }
    let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
    //如果说当这个normal已经执行过了,让索引减少1
    if(currentLoaderObject.normalExecuted){
        loaderContext.loaderIndex--;
        return iterateNormalLoaders(options,loaderContext,args,callback)
    }
    let normalFn = currentLoaderObject.normal;
    currentLoaderObject.normalExecuted=true;
    convertArgs(args,currentLoaderObject.raw);
    runSyncOrAsync(normalFn,loaderContext,args,function(err){
        if(err) return callback(err);
        let args = Array.prototype.slice.call(arguments,1);
        iterateNormalLoaders(options,loaderContext,args,callback);
    });
}
function iteratePitchingLoaders(options,loaderContext,callback){
    if(loaderContext.loaderIndex>=loaderContext.loaders.length){
        return processResource(options,loaderContext,callback);
    }
    //获取当前的loader loaderIndex=0 loader1
   let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
   if(currentLoaderObject.pitchExecuted){
    loaderContext.loaderIndex++;
    return iteratePitchingLoaders(options,loaderContext,callback)
   }
   loadLoader(currentLoaderObject);
   let pitchFunction = currentLoaderObject.pitch;
   currentLoaderObject.pitchExecuted = true;
   if(!pitchFunction){
    return iteratePitchingLoaders(options,loaderContext,callback)
   }
   runSyncOrAsync(
    pitchFunction,//要执行的pitch函数
    loaderContext,//上下文对象
    //这是要传递给pitchFunction的参数数组
    [loaderContext.remainingRequest,loaderContext.previousRequest,loaderContext.data={}],
    function(err,...args){
        if(args.length>0){//如果 args有值,说明这个pitch有返回值
            loaderContext.loaderIndex--;//索引减1,开始回退了
            iterateNormalLoaders(options,loaderContext,args,callback);
        }else{//如果没有返回值,则执行下一个loader的pitch函数
            iteratePitchingLoaders(options,loaderContext,callback)
        }
    }
   );
}
function runSyncOrAsync(fn,context,args,callback){
   let isSync = true;//默认是同步
   let isDone = false;//是否完成,是否执行过此函数了,默认是false
   //调用context.async this.async 可以把同步把异步,表示这个loader里的代码是异步的
   context.async = function(){
      isSync = false;//改为异步
      return innerCallback;
   }
   const innerCallback = context.callback = function(){
       isDone = true;//表示当前函数已经完成
       isSync=false;//改为异步
       callback.apply(null,arguments);//执行 callback
   }
   //第一次fn=pitch1,执行pitch1
   let result = fn.apply(context,args);
   //在执行pitch2的时候,还没有执行到pitch1 这行代码
   if(isSync){
       isDone = true;
       return callback(null,result);
   }
}
exports.runLoaders = function(options,callback){
  //要加载的资源的绝对路径 C:\aproject\zhufeng202009webpack\3.loader\src\index.js
  let resource = options.resource||'';
  //loaders的数组   loader的绝对路径的数组 
  let loaders = options.loaders ||[];
  //loader执行时候的上下文对象 这个对象将会成为loader执行的时候的this指针
  let loaderContext = {};
  //此方法用来读文件的
  let readResource = options.readResource|| readFile;
  let splittedResource = parsePathQueryFragment(resource);
  let resourcePath = splittedResource.path;//文件路径
  let resourceQuery = splittedResource.query;//查询参数
  let resourceFragment = splittedResource.fragment;//片段
  let contextDirectory = path.dirname(resourcePath);//此文件所在的上下文目录
  //准备loader对象数组
  loaders=loaders.map(createLoaderObject);
  //要加载的资源的所在目录
  loaderContext.context = contextDirectory;
  loaderContext.loaderIndex = 0;//当前的 loader的索引
  loaderContext.loaders = loaders;
  loaderContext.resourcePath = resourcePath;
  loaderContext.resourceQuery = resourceQuery;
  loaderContext.resourceFragment = resourceFragment;
  loaderContext.async = null;//是一个方法,可以loader的执行从同步改成异步
  loaderContext.callback = null;//调用下一个loader
  //loaderContext.request代表要加载的资源 ./src/index.js路径里不包含loader
  Object.defineProperty(loaderContext,'resource',{
      get(){
          return loaderContext.resourcePath+loaderContext.resourceQuery+loaderContext.resourceFragment;
      }
  });
  //request =loader1!loader2!loader3!resource.js
  Object.defineProperty(loaderContext,'request',{
    get(){
        return loaderContext.loaders.map(l=>l.request).concat(loaderContext.resource).join('!')
    }
  });
  //剩下的loader 从当前的下一个loader开始取,加上resource
  Object.defineProperty(loaderContext,'remainingRequest',{
    get(){
        return loaderContext.loaders.slice(loaderContext.loaderIndex+1).map(l=>l.request).concat(loaderContext.resource).join('!')
    }
  });
  //当前loader 从当前的loader开始取,加上resource
  Object.defineProperty(loaderContext,'currentRequest',{
    get(){
        return loaderContext.loaders.slice(loaderContext.loaderIndex).map(l=>l.request).concat(loaderContext.resource).join('!')
    }
  });
  //之前loader 
  Object.defineProperty(loaderContext,'previousRequest',{
    get(){
        return loaderContext.loaders.slice(0,loaderContext.loaderIndex).map(l=>l.request)
    }
  });
  //当前loader的query
  Object.defineProperty(loaderContext,'query',{
    get(){
       let loader = loaderContext.loaders[loaderContext.loaderIndex];
       return loader.options||loader.query;
    }
  });
  //当前loader的data
  Object.defineProperty(loaderContext,'data',{
    get(){
       let loader = loaderContext.loaders[loaderContext.loaderIndex];
       return loader.data;
    }
  });
  let processOptions = {
      resourceBuffer :null,//最后我们会把loader执行的Buffer结果放在这里
      readResource
  }
  iteratePitchingLoaders(processOptions,loaderContext,function(err,result){
    if(err){
        return callback(err,{});
    }
    callback(null,{
        result,
        resourceBuffer:processOptions.resourceBuffer
    });
  });
}
```



