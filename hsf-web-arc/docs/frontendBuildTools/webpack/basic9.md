---
title: webpack进阶（四）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# webpack-8.module

## 1.module [#](http://www.zhufengpeixun.com/grow/html/75.webpack-8.module.html#t01.module)

- 对于`webpack`来说每个文件都是一个`module`
- webpack会从配置中`entry`定义开始，找到全部的文件，并转化为 `module`

## 2.build流程

![modulebuild3](http://img.zhufengpeixun.cn/modulebuild3.jpg)

## 3.编译队列控制

![semaphore](http://img.zhufengpeixun.cn/semaphore.jpg)

## 4.entry配置

### 4.1 字符串

```js
entry: './index.js',
```

### 4.2 字符串数组

```js
entry: ['./index1.js', './index2.js']
```

### 4.3 对象

```js
 entry: {
    main: './main.js'
 }
```

### 4.4 函数

```js
entry: () => './index.js'
entry: () => new Promise((resolve) => resolve('./index.js'))
```

## 5.SingleEntryPlugin

- [entryOption](https://github.com/webpack/webpack/blob/v4.43.0/lib/WebpackOptionsApply.js#L290-L291)
- [SingleEntryPlugin.js](https://github.com/webpack/webpack/blob/v4.43.0/lib/SingleEntryPlugin.js)

![EntryOptionPlugin](http://img.zhufengpeixun.cn/EntryOptionPlugin.jpg)

### 5.1 注册模块工厂

```js
compiler.hooks.compilation.tap("SingleEntryPlugin",
    (compilation, { normalModuleFactory }) => {
        compilation.dependencyFactories.set(SingleEntryDependency,normalModuleFactory);
    }
);
```

### 5.2 make

- 注册了`make`事件回调，在`make`阶段的时候调用`addEntry`方法，然后进入`_addModuleChain`进入正式的编译阶段
- [compile](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/Compiler.js#660)
- [newCompilationParams](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/Compiler.js#651-L658)
- [this.hooks.compilation.call](https://github.com/webpack/webpack/blob/v4.43.0/lib/Compiler.js#L631)
- [this.dependencyFactories.get(Dep)](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/Compilation.js#L1054-L1063)

## 6.dependency

- [dependencies](https://github.com/webpack/webpack/tree/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/dependencies)
- 生成`chunk`时会依靠`dependency`来得到依赖关系图
- 生成最终文件时会依赖`dependency`中方法和保存的信息将源文件中的`import`等语句替换成最终输出的可执行的JS语句

```js
module: {
  dependencies: [
    dependency: {
      module
    }
  ]
}
```

## 7.文件转 module

- create 创建 module 实例
- add module保存到 Compilation 实例上
- build 分析文件内容,并分析依赖项
- processDep 处理依赖，并添加到编译链条中

### 7.1 create

- [NormalModuleFactory.create](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/NormalModuleFactory.js#L373-L414)

![NormalModuleFactory.create](http://img.zhufengpeixun.cn/NormalModuleFactorycreate.jpg)

### 7.2 addModule

- add 阶段是将 module 的所有信息保存到 Compilation 中，以便于在最后打包成 chunk 的时候使用
  - 保存到全局的 `Compilation.modules` 数组中
  - 保存到`Compilation._modules` 对象
  - 添加 `reason`
  - 添加`Compilation.entries`
- [moduleFactory.create.callback](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/Compilation.js#L1073-L1132)

```js
addModule(module) {
  const identifier = module.identifier();
  this._modules.set(identifier, module);
  this.modules.push(module);
  this.entries.push(module);
  module.reasons.push(new ModuleReason(module, dependency, explanation));
}
```

### 7.3 buildModule

- [buildModule](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/NormalModule.js#L427-L506)

```js
build(options, compilation, resolver, fs, callback) {
  return this.doBuild(options, compilation, resolver, fs, err => {
        // 处理 source 这里会将 source 转为 AST，分析出所有的依赖
        const result = this.parser.parse(this._ast || this._source.source());
        handleParseResult(result);
  })
}

//获取 source
doBuild(options, compilation, resolver, fs, callback) {
    runLoaders(
        {
            resource: this.resource,
            loaders: this.loaders,
            context: loaderContext,
            readResource: fs.readFile.bind(fs)
        },
        (err, result) => {
            // createSource 会将 runLoader 得到的结果转为字符串以便后续处理
            this._source = this.createSource(
                this.binary ? asBuffer(source) : asString(source),
                resourceBuffer,
                sourceMap
            );
              return callback();
        }
    );
}
```

### 7.4 parse

- [astexplorer](https://astexplorer.net/)
- 将 source 转为 AST(如果 source 是字符串类型)
- 遍历 AST，遇到 import 语句就增加相关依赖
  - 树的遍历 program事件 -> detectStrictMode -> preWalkStatements -> walkStatements
  - 遍历过程中会给`module`增加`dependency`实例,每个 `dependency` 类都会有一个 `template` 方法，并且保存了原来代码中的字符位置 `range`,在最后生成打包后的文件时，会用 `template` 的结果替换 `range` 部分的内容
  - 最终得到的 `dependency` 不仅包含了文件中所有的依赖信息，还被用于最终生成打包代码时对原始内容的修改和替换
- [parse](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/Parser.js#L2265-L2303)
- [HarmonyImportDependencyParserPlugin](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/dependencies/HarmonyImportDependencyParserPlugin.js)
- 得到的依赖
  - [HarmonyCompatibilityDependency](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/dependencies/HarmonyCompatibilityDependency.js) 添加`__webpack_require__.r(__webpack_exports__)` [RuntimeTemplate](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/RuntimeTemplate.js#L333)
  - [HarmonyInitDependency](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/dependencies/HarmonyInitDependency.js) `var _title_js__WEBPACK_IMPORTED_MODULE_0__`
  - [ConstDependency](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/dependencies/ConstDependency.js) 放置一个占位符,在最后生成打包文件的时候将其再转为 `use strict`
  - [HarmonyImportSideEffectDependency](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/dependencies/HarmonyImportSideEffectDependency.js) `var _title_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./title.js */ "./src/title.js");`
  - [HarmonyImportSpecifierDependency](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/dependencies/HarmonyImportSpecifierDependency.js) `console.log(_title_js__WEBPACK_IMPORTED_MODULE_0__["message"]);`

title.js

```js
export const message = 'zhufeng';
```

lazy.js

```js
export const message = 'zhufeng';
```

index.js

```js
import { message } from './title.js';
console.log(message);
import('./lazy.js').then(result => {
    console.log(result);
})
console.log(__resourceQuery);
prewalkStatements(statements) {
    for (let index = 0, len = statements.length; index < len; index++) {
        const statement = statements[index];
        this.prewalkStatement(statement);
    }
}
prewalkImportDeclaration(statement) {
        const source = statement.source.value;//./title.js
        this.hooks.import.call(statement, source);
        for (const specifier of statement.specifiers) {
            const name = specifier.local.name;//name
            this.scope.renames.set(name, null);
            this.scope.definitions.add(name);
            switch (specifier.type) {
                case "ImportDefaultSpecifier":
                    this.hooks.importSpecifier.call(statement, source, "default", name);
                    break;
                case "ImportSpecifier":
                    this.hooks.importSpecifier.call(
                        statement,
                        source,
                        specifier.imported.name,
                        name
                    );
                    break;
            }
        }
}
```

HarmonyImportDependencyParserPlugin

```js
const sideEffectDep = new HarmonyImportSideEffectDependency(
    source,
    parser.state.module,
    parser.state.lastHarmonyImportOrder,
    parser.state.harmonyParserScope
);
sideEffectDep.loc = statement.loc;
parser.state.module.addDependency(sideEffectDep);
```

### 7.5 依赖处理

- 对 `dependencies` 按照代码在文件中出现的先后顺序排序
- [Compilation.js](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/Compilation.js#L1093-L1102)

![_preparedEntrypoints](http://img.zhufengpeixun.cn/_preparedEntrypoints.jpg)

```js
const afterBuild = () => {
    if (addModuleResult.dependencies) {
        this.processModuleDependencies(module, err => {
            if (err) return callback(err);
            callback(null, module);
        });
    } else {
        return callback(null, module);
    }
};
dependencies={
    NormalModuleFactory: {
    "module./title.js": [
       HarmonyImportSideEffectDependency,
       HarmonyImportSpecifierDependency
    ],
    "module./lazy.js": [
       HarmonyImportSideEffectDependency,
       HarmonyImportSpecifierDependency
    ]
  }
}
sortedDependencies = [
  {
    factory: NormalModuleFactory,
    dependencies: [
      HarmonyImportSideEffectDependency,
      HarmonyImportSpecifierDependency
    ]
  },
   {
    factory: NormalModuleFactory,
    dependencies: [
      HarmonyImportSideEffectDependency,
      HarmonyImportSpecifierDependency
    ]
  }
]
addModuleDependencies(
  module,
  dependencies,
  bail,
  cacheGroup,
  recursive,
  callback
) {
  asyncLib.forEach(
    dependencies,
    (item, callback) => {
      //获取依赖
      const dependencies = item.dependencies;
      //获取工厂
       const factory = item.factory;
      //创建模块 
      factory.create(
          (err, dependentModule) => {
            const addModuleResult = this.addModule(dependentModule);
            dependentModule = addModuleResult.module;
            // 将 module 信息写入依赖中
            iterationDependencies(dependencies);
            // build 阶段
            const afterBuild = () => {
              // build 阶段结束后有依赖的话继续处理依赖
              this.processModuleDependencies(dependentModule, callback);
            };
            this.buildModule(afterBuild);
          }
        );
    }
  );
}
dependencies{
    HarmonyImportSideEffectDependency(request:"./title.js")
}
blocks{
    ImportDependenciesBlock(request:"./lazy.js")
}
```

### 7.6 流程

![moduleflow](http://img.zhufengpeixun.cn/moduleflow.jpg)

Powered by [idoc](https://github.com/jaywcjlove/idoc). Dependence [Node.js](https://nodejs.org/) run.



# webpack-9.chunk

## 1.chunk

- chunkGroup 由 chunk 组成，一个 chunkGroup 可以包含多个 chunk，在生成/优化 chunk graph 时会用到
- chunk 由 module 组成，一个 chunk 可以包含多个 module,它是 webpack 编译打包后输出的最终文件
- module 就是不同的资源文件，包含了你的代码中提供的例如：js/css/图片 等文件，在编译环节，webpack 会根据不同 module 之间的依赖关系去组合生成 chunk

## 2.seal

- 根据 addEntry 方法中收集到入口文件组成的 _preparedEntrypoints 数组

```js
seal(callback) {
        this.hooks.beforeChunks.call();
        for (const preparedEntrypoint of this._preparedEntrypoints) {
            const module = preparedEntrypoint.module;//入口模块
            const name = preparedEntrypoint.name;//入口点名称 main
            const chunk = this.addChunk(name);//新建chunk并添加到chunks中 
            const entrypoint = new Entrypoint(name);//生成入口点，其实是一个chunkGroup
            entrypoint.setRuntimeChunk(chunk);//设置运行时chunk
            entrypoint.addOrigin(null, name, preparedEntrypoint.request);//增加来源 ./src/index.js
            this.namedChunkGroups.set(name, entrypoint);//key为chunk名称，值为chunkGroup
            this.entrypoints.set(name, entrypoint);//入口点key为chunk名称，值为chunkGroup
            this.chunkGroups.push(entrypoint);//添加一个新的chunkGroup
            GraphHelpers.connectChunkGroupAndChunk(entrypoint, chunk);//建立起 chunkGroup 和 chunk 之间的关系
            GraphHelpers.connectChunkAndModule(chunk, module);//建立起 chunk 和 module 之间的关系
            chunk.entryModule = module;//代码块的入口模块
            chunk.name = name;//代码块的名称
            this.assignDepth(module);
        }
}
```

## 3.buildChunkGraph

- 遍历 `module graph` 模块依赖图建立起 `basic chunk graph` 依赖图
- 遍历第一步创建的 `chunk graph` 依赖图，依据之前的 `module graph` 来优化 `chunk graph`

### 3.1 文件

#### 3.1.1 index.js

```js
import common from './common.js';
import('./lazy.js').then(result => console.log(result))
```

#### 3.1.2 common.js

```js
import title from './title.js'
```

#### 3.1.3 lazy.js

```js
import title from './title.js';
import('./common.js').then(result => console.log(result))
export const lazy = 'lazy';
```

#### 3.1.4 title.js

```js
export const title = 'title';
```

### 3.2 module graph

- 对这次 compilation 收集到的 modules 进行一次遍历
- 在遍历 module 的过程中，会对这个 module 的 dependencies 依赖进行处理
- 同时还会处理这个 module 的 blocks(即在你的代码通过异步 API 加载的模块),个异步 block 都会被加入到遍历的过程当中，被当做一个 module 来处理
- 遍历的过程结束后会建立起基本的 module graph，包含普通的 module 及异步 module(block)，最终存储到一个 map 表(blockInfoMap)当中
- [buildChunkGraph](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/buildChunkGraph.js#L138)

![extraceBlockInfoMap](http://img.zhufengpeixun.cn/extraceBlockInfoMap.jpg)

```js
const extraceBlockInfoMap = compilation => {
    const iteratorDependency = d => {
        const ref = compilation.getDependencyReference(currentModule, d);
        if (!ref) {
            return;
        }
        //没有模块的跳过
        const refModule = ref.module;
        if (!refModule) {
            return;
        }
        blockInfoModules.add(refModule);
    };

    const iteratorBlockPrepare = b => {
        blockInfoBlocks.push(b);
        blockQueue.push(b);//将 block 加入到 blockQueue 当中，从而进入到下一次的遍历过程当中
    };

    let currentModule;
    let block;
    let blockQueue;
    let blockInfoModules;
    let blockInfoBlocks;

    for (const module of compilation.modules) {//循环所有的模块
        blockQueue = [module];//基于此模块创建一个数组blockQueue
        currentModule = module;//当前模块等于此模块
        while (blockQueue.length > 0) {
            block = blockQueue.pop();//取出一个模块
            blockInfoModules = new Set();//唯一的模块集合
            blockInfoBlocks = [];//块数组

            if (block.variables) {//变量
                for (const variable of block.variables) {
                    for (const dep of variable.dependencies) iteratorDependency(dep);
                }
            }

            if (block.dependencies) {//普通依赖
                for (const dep of block.dependencies) iteratorDependency(dep);
            }

            if (block.blocks) {//异步代码块依赖
                for (const b of block.blocks) iteratorBlockPrepare(b);
            }

            const blockInfo = {
                modules: blockInfoModules,
                blocks: blockInfoBlocks
            };
            blockInfoMap.set(block, blockInfo);
        }
    }

    return blockInfoMap;
};
```

blockInfoMap

```js
class NormalModule extends Module {  }   index.js
class ImportDependenciesBlock extends AsyncDependenciesBlock {  } lazy.js
class NormalModule extends Module {  } common.js
class NormalModule extends Module {  } title.js
class ImportDependenciesBlock extends AsyncDependenciesBlock {  } common.js
class NormalModule extends Module {  } title.js
```

### 3.3 生成chunk graph

- [buildChunkGraph PART ONE](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/buildChunkGraph.js#L702)

![buildChunkGraph2](http://img.zhufengpeixun.cn/buildChunkGraph2.jpg)

#### 3.3.1 创建queue

- 将传入的 entryPoint(chunkGroup) 转化为一个新的 `queue`
- chunkGroupInfoMap chunkGroup信息
- minAvailableModules 最小可跟踪的模块集合
- skippedItems 可以跳过的模块
- chunkGroupCounters key为chunkGroup,值为索引
- blockChunkGroups key为依赖块，值为chunkGroup
- allCreatedChunkGroups 所有创建的chunkGroup
- chunkDependencies key为chunkGroup,值为依赖的chunkGroup数组 {block,chunkGroup}
- queueConnect key为chunkGroup,值为一个依赖的chunkGroup数组
- availableModulesToBeMerged 父chunkGroup的模块
- outdatedChunkGroupInfo 过期的chunkGroup信息

```js
const module = chunk.entryModule;
queue.push({
    action: ENTER_MODULE, //(需要被处理的模块类型，不同的处理类型的模块会经过不同的流程处理，初始为 ENTER_MODULE(1))
    block: module,//k (入口 module)
    module,//(入口 module)
    chunk,// (seal 阶段一开始为每个入口 module 创建的空 chunk)
    chunkGroup//(entryPoint 即 chunkGroup 类型)
});
const visitModules = (
    compilation,
    inputChunkGroups,
    chunkGroupInfoMap,
    chunkDependencies,
    blocksWithNestedBlocks,
    allCreatedChunkGroups
) => {
    const logger = compilation.getLogger("webpack.buildChunkGraph.visitModules");
    const { namedChunkGroups } = compilation;

    logger.time("prepare");
    const blockInfoMap = extraceBlockInfoMap(compilation);

    /** @type {Map<ChunkGroup, { index: number, index2: number }>} */
    const chunkGroupCounters = new Map();//计数器
    for (const chunkGroup of inputChunkGroups) {
        chunkGroupCounters.set(chunkGroup, {//每个chunkGroup有两个索引，默认值都是0
            index: 0,
            index2: 0
        });
    }

    let nextFreeModuleIndex = 0;//下一个空闲的模块索引
    let nextFreeModuleIndex2 = 0;//下一个空闲的模块索引

    /** @type {Map<DependenciesBlock, ChunkGroup>} */
    const blockChunkGroups = new Map();

    const ADD_AND_ENTER_MODULE = 0;//增加并进入模块
    const ENTER_MODULE = 1;//进入模块
    const PROCESS_BLOCK = 2;//处理代码块
    const LEAVE_MODULE = 3;//离开模块

    /**
     * @param {QueueItem[]} queue the queue array (will be mutated)
     * @param {ChunkGroup} chunkGroup chunk group
     * @returns {QueueItem[]} the queue array again
     */
    const reduceChunkGroupToQueueItem = (queue, chunkGroup) => {
        for (const chunk of chunkGroup.chunks) {
            const module = chunk.entryModule;
            queue.push({
                action: ENTER_MODULE,
                block: module,
                module,
                chunk,
                chunkGroup
            });
        }
        chunkGroupInfoMap.set(chunkGroup, {
            chunkGroup,
            minAvailableModules: new Set(),
            minAvailableModulesOwned: true,
            availableModulesToBeMerged: [],
            skippedItems: [],
            resultingAvailableModules: undefined,
            children: undefined
        });
        return queue;
    };

    // Start with the provided modules/chunks  把entryPoint(chunkGroup) 转化为一个新的 queue
    /** @type {QueueItem[]} */
    let queue = inputChunkGroups
        .reduce(reduceChunkGroupToQueueItem, [])
        .reverse();
    /** @type {Map<ChunkGroup, Set<ChunkGroup>>} */
    const queueConnect = new Map();
    /** @type {Set<ChunkGroupInfo>} */
    const outdatedChunkGroupInfo = new Set();
    /** @type {QueueItem[]} */
    let queueDelayed = [];

    logger.timeEnd("prepare");

    /** @type {Module} */
    let module;
    /** @type {Chunk} */
    let chunk;
    /** @type {ChunkGroup} */
    let chunkGroup;
    /** @type {DependenciesBlock} */
    let block;
    /** @type {Set<Module>} */
    let minAvailableModules;
    /** @type {QueueItem[]} */
    let skippedItems;

    // For each async Block in graph
    /**
     * @param {AsyncDependenciesBlock} b iterating over each Async DepBlock
     * @returns {void}
     */
    const iteratorBlock = b => {
        // 1. We create a chunk for this Block
        // but only once (blockChunkGroups map)
        let c = blockChunkGroups.get(b);
        if (c === undefined) {
            c = namedChunkGroups.get(b.chunkName);
            if (c && c.isInitial()) {
                compilation.errors.push(
                    new AsyncDependencyToInitialChunkError(b.chunkName, module, b.loc)
                );
                c = chunkGroup;
            } else {
                //调用addChunkInGroup为这个异步的 block 新建一个 chunk 以及 chunkGroup
                c = compilation.addChunkInGroup(
                    b.groupOptions || b.chunkName,
                    module,
                    b.loc,
                    b.request
                );
                //调用 GraphHelpers 模块提供的 connectChunkGroupAndChunk 建立起这个新建的 chunk 和 chunkGroup 之间的联系
                //这里新建的 chunk 也就是在你的代码当中使用异步API 加载模块时，webpack 最终会单独给这个模块输出一个 chunk，但是此时这个 chunk 为一个空的 chunk，没有加入任何依赖的 module
                chunkGroupCounters.set(c, { index: 0, index2: 0 });
                blockChunkGroups.set(b, c);
                allCreatedChunkGroups.add(c);
            }
        } else {
            // TODO webpack 5 remove addOptions check
            if (c.addOptions) c.addOptions(b.groupOptions);
            c.addOrigin(module, b.loc, b.request);
        }

        // 2. We store the Block+Chunk mapping as dependency for the chunk
        //建立起当前 module 所属的 chunkGroup 和 block 以及这个 block 所属的 chunkGroup 之间的依赖关系，并存储至 chunkDependencies Map 表中，
        //这个 Map 表主要用于后面优化 chunk graph
        let deps = chunkDependencies.get(chunkGroup);
        if (!deps) chunkDependencies.set(chunkGroup, (deps = []));
        deps.push({
            block: b,
            chunkGroup: c
        });

        // 3. We create/update the chunk group info
        let connectList = queueConnect.get(chunkGroup);
        if (connectList === undefined) {
            connectList = new Set();
            queueConnect.set(chunkGroup, connectList);
        }
        connectList.add(c);

        // 4. We enqueue the DependenciesBlock for traversal
        //向queueDelayed 中添加一个 action 类型为 PROCESS_BLOCK,module 为当前所属的 module，block 为当前 module 依赖的异步模块
        //chunk(chunkGroup 当中的第一个 chunk) 及 chunkGroup 都是处理异步模块生成的新项，而这里向 queueDelayed 数据集当中添加的新项主要就是用于 queue 的外层遍历
        queueDelayed.push({
            action: PROCESS_BLOCK,
            block: b,
            module: module,
            chunk: c.chunks[0],
            chunkGroup: c
        });
    };

    // Iterative traversal of the Module graph
    // Recursive would be simpler to write but could result in Stack Overflows
    //开始进入到外层的遍历当中，即对 queueDelayed 数据集进行处理
    while (queue.length) {
        logger.time("visiting");
        //每一轮的内层遍历都对应于同一个 chunkGroup，即每一轮内层的遍历都是对这个 chunkGroup 当中所包含的所有的 module 进行处理
        while (queue.length) {
            const queueItem = queue.pop();
            module = queueItem.module;
            block = queueItem.block;
            chunk = queueItem.chunk;
            if (chunkGroup !== queueItem.chunkGroup) {
                chunkGroup = queueItem.chunkGroup;
                const chunkGroupInfo = chunkGroupInfoMap.get(chunkGroup);
                minAvailableModules = chunkGroupInfo.minAvailableModules;
                skippedItems = chunkGroupInfo.skippedItems;
            }

            switch (queueItem.action) {
                case ADD_AND_ENTER_MODULE: {
                    if (minAvailableModules.has(module)) {
                        // already in parent chunks
                        // skip it for now, but enqueue for rechecking when minAvailableModules shrinks
                        skippedItems.push(queueItem);
                        break;
                    }
                    // We connect Module and Chunk when not already done
                    if (chunk.addModule(module)) {
                        module.addChunk(chunk);
                    } else {
                        // already connected, skip it
                        break;
                    }
                }
                // fallthrough
                //在 queue 中新增一个 action 为 LEAVE_MODULE 的项会在后面遍历的流程当中使用
                case ENTER_MODULE: {
                    if (chunkGroup !== undefined) {
                        const index = chunkGroup.getModuleIndex(module);
                        if (index === undefined) {
                            chunkGroup.setModuleIndex(
                                module,
                                chunkGroupCounters.get(chunkGroup).index++
                            );
                        }
                    }

                    if (module.index === null) {
                        module.index = nextFreeModuleIndex++;
                    }

                    queue.push({
                        action: LEAVE_MODULE,
                        block,
                        module,
                        chunk,
                        chunkGroup
                    });
                }
                // fallthrough
                //当 ENTRY_MODULE 的阶段进行完后，立即进入到了 PROCESS_BLOCK 阶段
                case PROCESS_BLOCK: {
                    // 根据 module graph 依赖图保存的模块映射 blockInfoMap 获取这个 module（称为A） 的同步依赖 modules 及异步依赖 blocks
                    const blockInfo = blockInfoMap.get(block);

                    // Buffer items because order need to be reverse to get indicies correct
                    const skipBuffer = [];
                    const queueBuffer = [];
                    // Traverse all referenced modules
                    for (const refModule of blockInfo.modules) {
                        /**
                         * 判断当前这个 module(A) 所属的 chunk 当中是否包含了其依赖 modules 当中的 module(B)，
                         * 如果不包含的话，那么会在 queue 当中加入新的项，新加入的项目的 action 为 ADD_AND_ENTER_MODULE，
                         * 即这个新增项在下次遍历的时候，首先会进入到 ADD_AND_ENTER_MODULE 阶段
                         */
                        if (chunk.containsModule(refModule)) {
                            // skip early if already connected
                            continue;
                        }
                        if (minAvailableModules.has(refModule)) {
                            // already in parent chunks, skip it for now
                            skipBuffer.push({
                                action: ADD_AND_ENTER_MODULE,
                                block: refModule,
                                module: refModule,
                                chunk,
                                chunkGroup
                            });
                            continue;
                        }
                        // enqueue the add and enter to enter in the correct order
                        // this is relevant with circular dependencies
                        queueBuffer.push({
                            action: ADD_AND_ENTER_MODULE,
                            block: refModule,
                            module: refModule,
                            chunk,
                            chunkGroup
                        });
                    }
                    // Add buffered items in reversed order
                    for (let i = skipBuffer.length - 1; i >= 0; i--) {
                        skippedItems.push(skipBuffer[i]);
                    }
                    for (let i = queueBuffer.length - 1; i >= 0; i--) {
                        queue.push(queueBuffer[i]);
                    }

                    //调用iteratorBlock方法来处理这个 module(A) 依赖的所有的异步 blocks
                    for (const block of blockInfo.blocks) iteratorBlock(block);

                    if (blockInfo.blocks.length > 0 && module !== block) {
                        blocksWithNestedBlocks.add(block);
                    }
                    break;
                }
                case LEAVE_MODULE: {
                    if (chunkGroup !== undefined) {
                        const index = chunkGroup.getModuleIndex2(module);
                        if (index === undefined) {
                            chunkGroup.setModuleIndex2(
                                module,
                                chunkGroupCounters.get(chunkGroup).index2++
                            );
                        }
                    }

                    if (module.index2 === null) {
                        module.index2 = nextFreeModuleIndex2++;
                    }
                    break;
                }
            }
        }
        logger.timeEnd("visiting");

        while (queueConnect.size > 0) {
            logger.time("calculating available modules");
            //计算出这个chunkGroup新的父模块，以便这些子chunkGroup可以获取新的模块
            // Figure out new parents for chunk groups
            // to get new available modules for these children
            for (const [chunkGroup, targets] of queueConnect) {
                const info = chunkGroupInfoMap.get(chunkGroup);//当前信息
                let minAvailableModules = info.minAvailableModules;//(chunkGroup 可追踪的最小 module 数据集)

                //为这个点创建一个新的模块数据集,添加所有的本chunkgroup所有的chunk里的模块
                const resultingAvailableModules = new Set(minAvailableModules);
                for (const chunk of chunkGroup.chunks) {
                    for (const m of chunk.modulesIterable) {
                        resultingAvailableModules.add(m);
                    }
                }
                info.resultingAvailableModules = resultingAvailableModules;
                if (info.children === undefined) {
                    info.children = targets;
                } else {
                    for (const target of targets) {
                        info.children.add(target);
                    }
                }

                // 2. Update chunk group info 更新chunkGroup信息
                for (const target of targets) {
                    let chunkGroupInfo = chunkGroupInfoMap.get(target);
                    if (chunkGroupInfo === undefined) {
                        chunkGroupInfo = {
                            chunkGroup: target,
                            minAvailableModules: undefined,
                            minAvailableModulesOwned: undefined,
                            availableModulesToBeMerged: [],
                            skippedItems: [],
                            resultingAvailableModules: undefined,
                            children: undefined
                        };
                        chunkGroupInfoMap.set(target, chunkGroupInfo);
                    }
                    chunkGroupInfo.availableModulesToBeMerged.push(
                        resultingAvailableModules
                    );
                    outdatedChunkGroupInfo.add(chunkGroupInfo);
                }
            }
            queueConnect.clear();
            logger.timeEnd("calculating available modules");

            if (outdatedChunkGroupInfo.size > 0) {
                logger.time("merging available modules");//合并模块
                // Execute the merge
                for (const info of outdatedChunkGroupInfo) {
                    const availableModulesToBeMerged = info.availableModulesToBeMerged;//父模块
                    let cachedMinAvailableModules = info.minAvailableModules;//最小化模块集

                    // 1. Get minimal available modules
                    // It doesn't make sense to traverse a chunk again with more available modules.
                    // This step calculates the minimal available modules and skips traversal when
                    // the list didn't shrink.
                    if (availableModulesToBeMerged.length > 1) {
                        availableModulesToBeMerged.sort(bySetSize);
                    }
                    let changed = false;
                    for (const availableModules of availableModulesToBeMerged) {
                        if (cachedMinAvailableModules === undefined) {
                            cachedMinAvailableModules = availableModules;
                            info.minAvailableModules = cachedMinAvailableModules;
                            info.minAvailableModulesOwned = false;
                            changed = true;
                        } else {
                            if (info.minAvailableModulesOwned) {
                                // We own it and can modify it
                                for (const m of cachedMinAvailableModules) {
                                    if (!availableModules.has(m)) {
                                        cachedMinAvailableModules.delete(m);
                                        changed = true;
                                    }
                                }
                            } else {
                                for (const m of cachedMinAvailableModules) {
                                    if (!availableModules.has(m)) {
                                        // cachedMinAvailableModules need to be modified
                                        // but we don't own it
                                        // construct a new Set as intersection of cachedMinAvailableModules and availableModules
                                        /** @type {Set<Module>} */
                                        const newSet = new Set();
                                        const iterator = cachedMinAvailableModules[
                                            Symbol.iterator
                                        ]();
                                        /** @type {IteratorResult<Module>} */
                                        let it;
                                        while (!(it = iterator.next()).done) {
                                            const module = it.value;
                                            if (module === m) break;
                                            newSet.add(module);
                                        }
                                        while (!(it = iterator.next()).done) {
                                            const module = it.value;
                                            if (availableModules.has(module)) {
                                                newSet.add(module);
                                            }
                                        }
                                        cachedMinAvailableModules = newSet;
                                        info.minAvailableModulesOwned = true;
                                        info.minAvailableModules = newSet;

                                        // Update the cache from the first queue
                                        // if the chunkGroup is currently cached
                                        if (chunkGroup === info.chunkGroup) {
                                            minAvailableModules = cachedMinAvailableModules;
                                        }

                                        changed = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    availableModulesToBeMerged.length = 0;
                    if (!changed) continue;

                    // 2. Reconsider skipped items
                    for (const queueItem of info.skippedItems) {
                        queue.push(queueItem);
                    }
                    info.skippedItems.length = 0;

                    // 3. Reconsider children chunk groups
                    if (info.children !== undefined) {
                        const chunkGroup = info.chunkGroup;
                        for (const c of info.children) {
                            let connectList = queueConnect.get(chunkGroup);
                            if (connectList === undefined) {
                                connectList = new Set();
                                queueConnect.set(chunkGroup, connectList);
                            }
                            connectList.add(c);
                        }
                    }
                }
                outdatedChunkGroupInfo.clear();
                logger.timeEnd("merging available modules");
            }
        }

        //当队列中所有的元素处理完成后处理queueDelayed
        //这个对获取合局正确的索引非常重要
        //异步blocks应该在所有的同步blocks处理完成后再处理
        if (queue.length === 0) {
            const tempQueue = queue;
            queue = queueDelayed.reverse();
            queueDelayed = tempQueue;
        }
    }
};
```

### 3.4 优化chunk graph

- [buildChunkGraph PART TWO](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/buildChunkGraph.js#L713)
- [afterChunks](https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/Compilation.js#L1320)

```js
/**
 *
 * @param {Set<DependenciesBlock>} blocksWithNestedBlocks block拥有子block的标识
 * @param {Map<ChunkGroup, ChunkGroupDep[]>} chunkDependencies chunk groups的依赖
 * @param {Map<ChunkGroup, ChunkGroupInfo>} chunkGroupInfoMap chunkgroup到可用的modules的映射
 */
const connectChunkGroups = (
    blocksWithNestedBlocks,
    chunkDependencies,
    chunkGroupInfoMap
) => {
    /** @type {Set<Module>} */
    let resultingAvailableModules;

    /**
     * 帮助函数，检查是否代码块中是否已经有了所有模块
     * @param {ChunkGroup} chunkGroup  要检查的chunkGroup
     * @param {Set<Module>} availableModules 模块集合
     * @returns {boolean} 如果所有的模块都在这个chunk中存在就返回true
     */
    const areModulesAvailable = (chunkGroup, availableModules) => {
        for (const chunk of chunkGroup.chunks) {
            for (const module of chunk.modulesIterable) {
                if (!availableModules.has(module)) return false;
            }
        }
        return true;
    };

    // For each edge in the basic chunk graph
    /**
     * @param {ChunkGroupDep} dep the dependency used for filtering
     * @returns {boolean} used to filter "edges" (aka Dependencies) that were pointing
     * to modules that are already available. Also filters circular dependencies in the chunks graph
     */
    const filterFn = dep => {
        const depChunkGroup = dep.chunkGroup;
        // TODO is this needed?
        if (blocksWithNestedBlocks.has(dep.block)) return true;
        if (areModulesAvailable(depChunkGroup, resultingAvailableModules)) {
            return false; // break all modules are already available
        }
        return true;
    };

    //遍历所有的deps,检查是否这个chunkGroup是否需要连接
    for (const [chunkGroup, deps] of chunkDependencies) {
        if (deps.length === 0) continue;

        // 1.从map中获取到chunkGroup的信息对象
        const info = chunkGroupInfoMap.get(chunkGroup);
        resultingAvailableModules = info.resultingAvailableModules;

        // 2. Foreach edge
        for (let i = 0; i < deps.length; i++) {
            const dep = deps[i];

            // Filter inline, rather than creating a new array from `.filter()`
            // TODO check if inlining filterFn makes sense here
            //判断 chunkGroup 提供的 newAvailableModules(可以将 newAvailableModules 理解为这个 chunkGroup 所有 module 的集合setA)和
            // deps 依赖中的 chunkGroup (由异步 block 创建的 chunkGroup)所包含的 chunk 当中所有的 module 集合(setB)包含关系：
            if (!filterFn(dep)) {
                continue;
            }
            const depChunkGroup = dep.chunkGroup;
            const depBlock = dep.block;

            // 5. 建立起 deps 依赖中的异步 block 和 chunkGroup 的依赖关系
            GraphHelpers.connectDependenciesBlockAndChunkGroup(
                depBlock,
                depChunkGroup
            );

            // 6. chunkGroup 和 deps 依赖中的 chunkGroup 之间的依赖关系 
            //（这个依赖关系也决定了在 webpack 编译完成后输出的文件当中是否会有 deps 依赖中的 chunkGroup 所包含的 chunk）
            GraphHelpers.connectChunkGroupParentAndChild(chunkGroup, depChunkGroup);
        }
    }
};

/**
 * Remove all unconnected chunk groups
 * @param {Compilation} compilation the compilation
 * @param {Iterable<ChunkGroup>} allCreatedChunkGroups all chunk groups that where created before
 */
const cleanupUnconnectedGroups = (compilation, allCreatedChunkGroups) => {
    for (const chunkGroup of allCreatedChunkGroups) {
        if (chunkGroup.getNumberOfParents() === 0) {//开始处理没有依赖关系的 chunkGroup
            for (const chunk of chunkGroup.chunks) {
                const idx = compilation.chunks.indexOf(chunk);
                if (idx >= 0) compilation.chunks.splice(idx, 1);
                chunk.remove("unconnected");
            }
            chunkGroup.remove("unconnected");
        }
    }
};
```

![finalchunkgraphs](http://img.zhufengpeixun.cn/finalchunkgraphs.jpg)

Powered by [idoc](https://github.com/jaywcjlove/idoc). Dependence [Node.js](https://nodejs.org/) run.



# webpack-10.asset

## 1. applyModuleIds

```js
    applyModuleIds() {
        const unusedIds = [];//找到当前未使用的 id 
        let nextFreeModuleId = 0;//已经使用的最大的 id
        const usedIds = new Set();
        if (this.usedModuleIds) {
            for (const id of this.usedModuleIds) {
                usedIds.add(id);
            }
        }

        const modules1 = this.modules;
        for (let indexModule1 = 0; indexModule1 < modules1.length; indexModule1++) {
            const module1 = modules1[indexModule1];
            if (module1.id !== null) {
                usedIds.add(module1.id);
            }
        }

        if (usedIds.size > 0) {
            let usedIdMax = -1;
            for (const usedIdKey of usedIds) {
                if (typeof usedIdKey !== "number") {
                    continue;
                }

                usedIdMax = Math.max(usedIdMax, usedIdKey);
            }

            let lengthFreeModules = (nextFreeModuleId = usedIdMax + 1);

            while (lengthFreeModules--) {
                if (!usedIds.has(lengthFreeModules)) {
                    unusedIds.push(lengthFreeModules);
                }
            }
        }

        const modules2 = this.modules;
        for (let indexModule2 = 0; indexModule2 < modules2.length; indexModule2++) {
            const module2 = modules2[indexModule2];
            if (module2.id === null) {
                if (unusedIds.length > 0) {
                    module2.id = unusedIds.pop();
                } else {
                    module2.id = nextFreeModuleId++;
                }
            }
        }
    }
```

## 2. applyChunkIds

```js
    applyChunkIds() {
        /** @type {Set<number>} */
        const usedIds = new Set();

        // Get used ids from usedChunkIds property (i. e. from records)
        if (this.usedChunkIds) {
            for (const id of this.usedChunkIds) {
                if (typeof id !== "number") {
                    continue;
                }

                usedIds.add(id);
            }
        }

        // Get used ids from existing chunks
        const chunks = this.chunks;
        for (let indexChunk = 0; indexChunk < chunks.length; indexChunk++) {
            const chunk = chunks[indexChunk];
            const usedIdValue = chunk.id;

            if (typeof usedIdValue !== "number") {
                continue;
            }

            usedIds.add(usedIdValue);
        }

        // Calculate maximum assigned chunk id
        let nextFreeChunkId = -1;
        for (const id of usedIds) {
            nextFreeChunkId = Math.max(nextFreeChunkId, id);
        }
        nextFreeChunkId++;

        // Determine free chunk ids from 0 to maximum
        /** @type {number[]} */
        const unusedIds = [];
        if (nextFreeChunkId > 0) {
            let index = nextFreeChunkId;
            while (index--) {
                if (!usedIds.has(index)) {
                    unusedIds.push(index);
                }
            }
        }

        // Assign ids to chunk which has no id
        for (let indexChunk = 0; indexChunk < chunks.length; indexChunk++) {
            const chunk = chunks[indexChunk];
            if (chunk.id === null) {
                if (unusedIds.length > 0) {
                    chunk.id = unusedIds.pop();
                } else {
                    chunk.id = nextFreeChunkId++;
                }
            }
            if (!chunk.ids) {
                chunk.ids = [chunk.id];
            }
        }
    }
```

## 3. hash

### 3.1 module hash

![modulehash](http://img.zhufengpeixun.cn/modulehash.jpg)

Module.js

```js
    updateHash(hash) {
        hash.update(`${this.id}`);
        hash.update(JSON.stringify(this.usedExports));
        super.updateHash(hash);
    }
```

### 3.2 chunk hash

Chunk.js

```js
    updateHash(hash) {
        hash.update(`${this.id} `);
        hash.update(this.ids ? this.ids.join(",") : "");
        hash.update(`${this.name || ""} `);
        for (const m of this._modules) {
            hash.update(m.hash);
        }
    }
```

## 4. createChunkAssets

- [JavascriptModulesPlugin](http://www.zhufengpeixun.com/grow/html/JavascriptModulesPlugin)
- [MainTemplate.js](http://www.zhufengpeixun.com/grow/html/MainTemplate.js)
- [JsonpMainTemplatePlugin.js](http://www.zhufengpeixun.com/grow/html/JsonpMainTemplatePlugin.js)
- hash 值生成之后，会调用 `createChunkAssets` 方法来决定最终输出到每个 chunk 当中对应的文本内容
- 获取对应的渲染模板
- 然后通过 getRenderManifest 获取到 render 需要的内容
- 执行 `render()` 得到最终的代码
- 获取文件路径，保存到 `assets` 中

![emitfiles](http://img.zhufengpeixun.cn/emitfiles.jpg)

## 4.hash

- hash 每次编译会生成一个hash,代表这次编译 代码: https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/Compilation.js#L1985
- chunkhash 每个chunk代码块对应的哈希值，各个chunk之间独立 代码: https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/Compilation.js#L1976
- contenthash 文件内容级别的哈希值,文件内容变了，那么hash值才改变 代码: https://github.com/webpack/webpack/blob/c9d4ff7b054fc581c96ce0e53432d44f9dd8ca72/lib/Compilation.js#L1979



