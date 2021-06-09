---
title: 简介
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

## 1. Node能够解决什么问题?

- Node的首要目标是提供一种简单的，用于创建高性能服务器的开发工具
- Web服务器的瓶颈在于并发的用户量，对比Java和Php的实现方式

## 2. Node是什么?

- Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境,让JavaScript的执行效率与低端的C语言的相近的执行效率。。
- Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。
- Node.js 的包管理器 npm，是全球最大的开源库生态系统。

## 3. Node特点

### 3.1 为什么JavaScript是单线程？

- 这是由 Javascript 这门脚本语言的用途决定的。
- Web Worker并没有改变 JavaScript 单线程的本质。

### 3.2 浏览器模型

- 用户界面-包括地址栏、前进/后退按钮、书签菜单等
- 浏览器引擎-在用户界面和呈现引擎之间传送指令
- 呈现引擎-又称渲染引擎，也被称为浏览器内核，在线程方面又称为UI线程
- 网络-用于网络调用，比如 HTTP 请求
- 用户界面后端-用于绘制基本的窗口小部件,UI线程和JS共用一个线程
- JavaScript解释器-用于解析和执行 JavaScript 代码
- 数据存储-这是持久层。浏览器需要在硬盘上保存各种数据，例如 Cookie

![浏览器](http://img.zhufengpeixun.cn/browser.jpg)

### 3.3 除JS线程和UI线程之外的其它线程

- 浏览器事件触发线程
- 定时触发器线程
- 异步HTTP请求线程

### 3.4 任务队列

1. 所有同步任务都在主线程上执行，形成一个执行栈
2. 主线程之外，还存在一个任务队列。只要异步任务有了运行结果，就在任务队列之中放置一个事件。
3. 一旦执行栈中的所有**同步任务**执行完毕，系统就会读取**任务队列**，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
4. 主线程不断重复上面的第三步。

### 3.5. Event Loop

主线程从**任务队列**中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为Event Loop(事件循环)

![eventloop](http://img.zhufengpeixun.cn/eventloop.png)

### 3.6. Node.js的Event Loop

![eventloop](http://img.zhufengpeixun.cn/nodesystem.png)

1. V8引擎解析JavaScript脚本。
2. 解析后的代码，调用Node API。
3. libuv库负责Node API的执行。它将不同的任务分配给不同的线程，形成一个Event Loop（事件循环），以异步的方式将任务的执行结果返回给V8引擎。
4. V8引擎再将结果返回给用户。

### 3.7. 同步与异步

同步和异步关注的是消息通知机制

- 同步就是发出调用后，没有得到结果之前，该调用不返回，一旦调用返回，就得到返回值了。 简而言之就是调用者主动等待这个调用的结果
- 而异步则相反，调用者在发出调用后这个调用就直接返回了，所以没有返回结果。换句话说当一个异步过程调用发出后，调用者不会立刻得到结果，而是调用发出后，被调用者通过状态、通知或回调函数处理这个调用。

### 3.8. 阻塞与非阻塞

阻塞和非阻塞关注的是程序在等待调用结果（消息，返回值）时的状态.

- 阻塞调用是指调用结果返回之前，当前线程会被挂起。调用线程只有在得到结果之后才会返回。
- 非阻塞调用指在不能立刻得到结果之前，该调用不会阻塞当前线程。

### 3.9. 组合

同步异步取决于被调用者，阻塞非阻塞取决于调用者

- 同步阻塞
- 异步阻塞
- 同步非阻塞
- 异步非阻塞

## 4.什么场合下应该考虑使用Node框架

当应用程序需要处理大量并发的输入输出，而在向客户端响应之前，应用程序并不需要进行非常复杂的处理。

- 聊天服务器
- 电子商务网站



## 1. Node.js 安装配置

本章节我们将向大家介绍在window、Mac和Linux上安装Node.js的方法

- 偶数位为稳定版本，奇数位为非稳定版本
- 稳定版本中已经发布的API是不会改变的

### 1.1. 打开官网主页

首页会推荐你合适的版本 https://nodejs.org/en/ ![img](http://img.zhufengpeixun.cn/download.jpg)

### 1.2. 如果推荐的版本不合适可以进入下载页面

https://nodejs.org/en/download/ ![img](http://img.zhufengpeixun.cn/downloadlist.jpg) 根据不同平台系统选择你需要的Node.js安装包。 注意：Linux上安装Node.js需要安装Python 2.6 或 2.7 ，不建议安装Python 3.0以上版本。

## 2.windows

### 2.1 步骤 1 : 双击下载后的安装包 node-v4.2.1-x64.msi运行安装程序：

![img](http://img.zhufengpeixun.cn/install_1.jpg)

### 2.2 步骤 2 : 勾选接受协议选项，点击 next（下一步） 按钮 :

![img](http://img.zhufengpeixun.cn/install_2.jpg)

### 2.3 步骤 3 : Node.js默认安装目录为 "C:\Program Files\nodejs\" , 你可以修改目录，并点击 next（下一步）：

![img](http://img.zhufengpeixun.cn/install3.jpg)

### 2.4 步骤 4 : 点击树形图标来选择你需要的安装模式 , 然后点击下一步 next（下一步）

![img](http://img.zhufengpeixun.cn/install4.jpg)

### 2.5 步骤 6 :点击 Install（安装） 开始安装Node.js。你也可以点击 Back（返回）来修改先前的配置。 然后并点击 next（下一步）：

![img](http://img.zhufengpeixun.cn/install5.jpg)

### 2.6 点击 Finish（完成）按钮退出安装向导。

![img](http://img.zhufengpeixun.cn/install6.jpg)

### 2.7 检测PATH环境变量是否配置了Node.js

- 点击开始菜单,点击运行 ![img](http://img.zhufengpeixun.cn/run1.jpg)
- 输入 `cmd` ![img](http://img.zhufengpeixun.cn/run2.jpg)
- 输入命令`path`输出结果 ![img](http://img.zhufengpeixun.cn/run3.jpg)

如果有`node`的路径的话就表示配置正确，可以在命令行下执行 `node` 命令 检查node.js版本 `node -v`

![img](http://img.zhufengpeixun.cn/node%E7%89%88%E6%9C%AC.jpg)

### 2.8 如果没有的话就需要手工再次配置环境变量

1. 打开资源管理器
2. 在计算机上点击右键，显示菜单后点击属性
3. 选择高级系统设置
4. 选择高级页签下的环境变量
5. 在用户变量中找到path,如果没有就新建一个
6. 在path的最前面添加node.js的安装路径，如 `C:\Program Files\nodejs`

![img](http://img.zhufengpeixun.cn/run4.jpg) ![img](http://img.zhufengpeixun.cn/run5.jpg)

## 3. MAC安装

### 3.1 安装包安装

下载Mac安装后结束后，单击下载的文件，运行它，会出现一个向导对话框。 单击continue按钮开始安装，紧接着向导会向你询问系统用户密码，输入密码后就开始安装。不一会儿就会看见一个提示Node已经被安装到计算机上的确认窗口

### 3.2 homebrew安装

1. 先安装homebrew 打开网站 http://brew.sh/

2. 在terminal下安装

   ```
   Homebrew
   ```

   ```
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
   ```

   homebrew依赖ruby,如果安装出错检查一下ruby的版本以及路径

   ```
    ruby -v
   ```

   3.通过homebrew安装node.js

   ```
    brew install node
   ```

   4.其它软件也都可以通过homebrew安装

   ```
    brew install mongodb redis git
   ```

### 3.3 n模块安装

切换版本或升级node可以安装 `n` 模块

```
    npm install n -g
```

直接输入 `n` 即可上下切换不同的版本

- [n源码](https://github.com/tj/n)
- [n的npm安装包](https://www.npmjs.com/package/n)

![n](http://nimit.io/images/n/n.gif)

## 4. 源代码安装

### 4.1 安装依赖库

Node依赖一些第三方代码库，但幸运的是大多数第三方库已经随Node一起发行，如果想从源码编译，需要以下两项工具

- python(2.4及以上版本)

- libssl-dev 如果计划使用SSL/TLS加密，则必须安装它。libssl是openssl工具中用到的库，在linux和UNIX系统中，通常可以用你喜欢的包管理器安装libssl,而在Mac OS X系统中已经预置了。

  ### 4.2 下载源代码

  选择好版本后，你就可以到nodejs.org网站上复制对应的tar压缩包进行下载，比如你用的mac或linux,可以输入以下命令下载

  ```
  wget https://nodejs.org/dist/v8.9.4/node-v8.9.4.tar.gz
  ```

  ```
  curl -O https://nodejs.org/dist/v8.9.4/node-v8.9.4.tar.gz
  ```

  如果这二种工具都没有可以下载这二个工具或者从网站上点击链接下载

### 4.3 编译源码

对tar压缩包进行解压缩

- x extract 解包
- f file 要解包的是个文件
- z gzip 这个包是压缩过的，需要解压缩
- v verbose把解包过程告诉你

```
tar xfz node-v8.9.4.tar.gz
```

进入源代码目录

```
cd node-v8.9.4
```

对其进行配置

```
./configure
```

现在就开始编译了

```
make
```

编译生成Node可执行文件后，就可以按以下的指令开始安装

```
make install
```

以上指令会将Node可执行文件复制到/user/local/bin/node目录下

执行以上指令如果遇到权限问题，可以以root用户权限执行

```
sudo make install
```





## 1.REPL

在Node.js中为了使开发者方便测试JavaScript代码，提供了一个名为REPL的可交互式运行环境。开发者可以在该运行环境中输入任何JavaScript表达式，当用户按下回车键后，REPL运行环境将显示该表达式的运行结果。

## 2.如何进入REPL

在命令行容器中输入node命令并按下回车键，即可进入REPL运行环境。

## 3.REPL操作

- 变量的操作,声明普通变量和对象

- eval

- 函数的书写

- 下划线访问最近使用的表达式

- 多行书写

- REPL运行环境中的上下文对象

  ```
  let repl = require('repl');
  let con = repl.start().context;
  con.msg = 'hello';
  con.hello = function(){
  console.log(con.msg);
  }
  ```

## 4.REPL运行环境的基础命令

- .break 退出当前命令
- .clear 清除REPL运行环境上下文对象中保存的所有变量与函数
- .exit 退出REPL运行环境
- .save 把输入的所有表达式保存到一个文件中
- .load 把所有的表达式加载到REPL运行环境中
- .help 查看帮助命令



## 1. 控制台

在Node.js中，使用`console`对象代表控制台(在操作系统中表现为一个操作系统指定的字符界面，比如 Window中的命令提示窗口)。

- console.log
- console.info
- console.error 重定向到文件
- console.warn
- console.dir
- console.time
- console.timeEnd
- console.trace
- console.assert

## 2. 全局作用域

- 全局作用域(global)可以定义一些不需要通过任何模块的加载即可使用的变量、函数或类
- 定义全局变量时变量会成为global的属性。
- 永远不要不使用var关键字定义变量，以免污染全局作用域
- setTimeout clearTimeout
- setInterval clearInterval
- unref和ref

```
let test = function(){
  console.log('callback');
}
let timer = setInterval(test,1000);
timer.unref();
setTimeout(function(){
  timer.ref();
},3000)
```

## 3. 函数

- require

- 模块加载过程

- require.resolve

- 模板缓存(require.cache)

- require.main

- 模块导出

  ```
  module.exports, require, module, filename, dirname
  ```

## 4. process

### 4.1 process对象

在node.js里，process 对象代表node.js应用程序，可以获取应用程序的用户，运行环境等各种信息

```
process.argv.forEach(function(item){
  console.log(item);
});
process.on('exit',function(){
  console.log('clear');
});

process.on('uncaughtException',function(err){
  console.log(err);
})

console.log(process.memoryUsage());
console.log(process.cwd());
console.log(__dirname);
process.chdir('..');
console.log(process.cwd());
console.log(__dirname);

function err(){
 throw new Error('报错了');
}
err();
```

### 4.2 process.nextTick & setImmediate

- process.nextTick()方法将 callback 添加到"next tick 队列"。 一旦当前事件轮询队列的任务全部完成，在next tick队列中的所有callbacks会被依次调用。
- setImmediate预定立即执行的 callback，它是在 I/O 事件的回调之后被触发

```
setImmediate(function(){
  console.log('4');
});
setImmediate(function(){
  console.log('5');
});
process.nextTick(function(){
  console.log('1');
  process.nextTick(function(){
    console.log('2');
    process.nextTick(function(){
      console.log('3');
    });
  });
});

console.log('next');
```

## 5. EventEmitter

在Node.js的用于实现各种事件处理的event模块中，定义了EventEmitter类，所以可能触发事件的对象都是一个继承自EventEmitter类的子类实例对象。

| 方法名和参数                    | 描述                                                         |
| :------------------------------ | :----------------------------------------------------------- |
| addListener(event,listener)     | 对指定事件绑定事件处理函数                                   |
| on(event,listener)              | 对指定事件绑定事件处理函数                                   |
| once(event,listener)            | 对指定事件指定只执行一次的事件处理函数                       |
| removeListener(event,listener)  | 对指定事件解除事件处理函数                                   |
| removeAllListeners([event])     | 对指定事件解除所有的事件处理函数                             |
| setMaxListeners(n)              | 指定事件处理函数的最大数量.n为整数值，代表最大的可指定事件处理函数的数量 |
| listeners(event)                | 获取指定事件的所有事件处理函数                               |
| emit(event,[arg1],[arg2],[...]) | 手工触发指定事件                                             |

```
let EventEmitter = require('./events');
let util = require('util');
util.inherits(Bell,EventEmitter);
function Bell(){
  EventEmitter.call(this);
}
let bell = new Bell();
bell.on('newListener',function(type,listener){
  console.log(`对 ${type}  事件增加${listener}`);
});
bell.on('removeListener',function(type,listener){
  console.log(`对${type} 事件删除${listener}`);
});
function teacherIn(thing){
  console.log(`老师带${thing}进教室`);
}
function studentIn(thing){
  console.log(`学生带${thing}进教室`);
}
function masterIn(thing){
  console.log(`校长带${thing}进教室`);
}
bell.on('响',teacherIn);
bell.on('响',studentIn);
bell.once('响',masterIn);
bell.emit('响','书');
console.log('==============');
bell.emit('响','书');
console.log('==============');
bell.removeAllListeners('响');
console.log('==============');
bell.emit('响','书');
function EventEmitter(){
  this.events = {};//会把所有的事件监听函数放在这个对象里保存
  //指定给一个事件类型增加的监听函数数量最多有多少个
  this._maxListeners = 10;
}
EventEmitter.prototype.setMaxListeners = function(maxListeners){
  this._maxListeners = maxListeners;
}
EventEmitter.prototype.listeners = function(event){
  return this.events[event];
}
//给指定的事件绑定事件处理函数，1参数是事件类型 2参数是事件监听函数
EventEmitter.prototype.on = EventEmitter.prototype.addListener = function(type,listener){
  if(this.events[type]){
    this.events[type].push(listener);
    if(this._maxListeners!=0&&this.events[type].length>this._maxListeners){
      console.error(`MaxListenersExceededWarning: Possible EventEmitter memory leak detected. ${this.events[type].length} ${type} listeners added. Use emitter.setMaxListeners() to increase limit`);
    }
  }else{
    //如果以前没有添加到此事件的监听函数，则赋一个数组
    this.events[type] = [listener];
  }
}
EventEmitter.prototype.once = function(type,listener){
  //用完即焚
 let  wrapper = (...rest)=>{
   listener.apply(this);//先让原始的监听函数执行
   this.removeListener(type,wrapper);
 }
 this.on(type,wrapper);
}
EventEmitter.prototype.removeListener = function(type,listener){
  if(this.events[type]){
    this.events[type] = this.events[type].filter(l=>l!=listener)
  }
}
//移除某个事件的所有监听函数
EventEmitter.prototype.removeAllListeners = function(type){
  delete this.events[type];
}
EventEmitter.prototype.emit = function(type,...rest){
  this.events[type]&&this.events[type].forEach(listener=>listener.apply(this,rest));
}
module.exports = EventEmitter;
```

## util

```
var util = require('util');
//util.inherit();
console.log(util.inspect({name:'zfpx'}));
console.log(util.isArray([]));
console.log(util.isRegExp(/\d/));
console.log(util.isDate(new Date()));
console.log(util.isError(new Error));
```

## 6. node断点调试

V8 提供了一个强大的调试器，可以通过 TCP 协议从外部访问。Nodejs提供了一个内建调试器来帮助开发者调试应用程序。想要开启调试器我们需要在代码中加入debugger标签，当Nodejs执行到debugger标签时会自动暂停（debugger标签相当于在代码中开启一个断点）。

```
var a = 'a';
var b = 'b';

debugger;

var all = a + ' ' + b;
console.log(all);
```

| 命令                     | 用途                              |
| :----------------------- | :-------------------------------- |
| c                        | 继续执行到下一个断点处            |
| next,n                   | 单步执行                          |
| step,s                   | 单步进入函数                      |
| out,o                    | 退出当前函数                      |
| setBreakpoint(10),sb(10) | 在第10行设置断点                  |
| repl                     | 打开求值环境，ctrl_c退回debug模式 |
| watch(exp)               | 把表达式添加监视列表              |
| watchers                 | 显示所有表达式的值                |

[debugger](https://nodejs.org/api/debugger.html)



## 1. JS模块化方面的不足

- JS没有模块系统，不支持封闭的作用域和依赖管理
- 没有标准库，没有文件系统和IO流API
- 也没有包管理系统

## 2. CommonJS规范

- 封装功能
- 封闭作用域
- 可能解决依赖问题
- 工作效率更高，重构方便

## 3. Node中的CommonJS

- 在node.js 里，模块划分所有的功能，每个JS都是一个模块

- 实现require方法,NPM实现了模块的自动加载和安装依赖

  ```
  (function(exports,require,module,__filename,__dirname){
    exports = module.exports={}
    exports.name = 'zfpx';
    exports = {name:'zfpx'};
    return module.exports;
  })
  ```

## 4. 模块分类

### 4.1 原生模块

`http` `path` `fs` `util` `events` 编译成二进制,加载速度最快，原来模块通过名称来加载

### 4.2 文件模块

在硬盘的某个位置，加载速度非常慢，文件模块通过名称或路径来加载 文件模块的后缀有三种

- 后缀名为.js的JavaScript脚本文件,需要先读入内存再运行

- 后缀名为.json的JSON文件,fs 读入内存 转化成JSON对象

- 后缀名为.node的经过编译后的二进制C/C++扩展模块文件,可以直接使用

  > 一般自己写的通过路径来加载,别人写的通过名称去当前目录或全局的node_modules下面去找

### 4.3 第三方模块

- 如果require函数只指定名称则视为从node_modules下面加载文件，这样的话你可以移动模块而不需要修改引用的模块路径
- 第三方模块的查询路径包括module.paths和全局目录

#### 4.3.1 . 全局目录

window如果在环境变量中设置了`NODE_PATH`变量，并将变量设置为一个有效的磁盘目录，require在本地找不到此模块时向在此目录下找这个模块。 UNIX操作系统中会从 $HOME/.node_modules $HOME/.node_libraries目录下寻找

### 4.4 模块的加载策略

![lookmodule](http://img.zhufengpeixun.cn/lookmodule.png)

### 4.5 文件模块查找规则

![lookmodule](http://img.zhufengpeixun.cn/lookfile.png)

## 5. 从模块外部访问模块内的成员

- 使用exports对象
- 使用module.exports导出引用类型

## 6. 模块对象的属性

- module.id
- module.filename
- module.loaded
- module.parent
- module.children
- module.paths

## 7. 包

在Node.js中，可以通过包来对一组具有相互依赖关系的模块进行统一管理，通过包可以把某个独立功能封装起来 每个项目的根目录下面，一般都有一个package.json文件，定义了这个项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等元数据）。npm install命令根据这个配置文件，自动下载所需的模块，也就是配置项目所需的运行和开发环境

| 项目                | 描述                             |
| :------------------ | :------------------------------- |
| name                | 项目名称                         |
| version             | 版本号                           |
| description         | 项目描述                         |
| keywords: {Array}   | 关键词，便于用户搜索到我们的项目 |
| homepage            | 项目url主页                      |
| bugs                | 项目问题反馈的Url或email配置     |
| license             | 项目许可证                       |
| author,contributors | 作者和贡献者                     |
| main                | 主文件                           |
| bin                 | 项目用到的可执行文件配置         |
| repository          | 项目代码存放地方                 |
| scripts             | 声明一系列npm脚本指令            |
| dependencies        | 项目在生产环境中依赖的包         |
| devDependencies     | 项目在生产环境中依赖的包         |
| peerDependencies    | 应用运行依赖的宿主包             |

[package.json](https://docs.npmjs.com/files/package.json) [packagejson](http://javascript.ruanyifeng.com/nodejs/packagejson.html)

## 8. NPM

- 安装完node之后只能使用Node语言特性及核心函数，我们还需要一个系统来下载、安装和管理第三方模块
- 在Node里这个系统被称为Node包管理器(Node Package Manager,NPM)

### 8.1 npm提供的功能

- 公共注册服务，用户可以把自己写的包上传到服务器上
- 命令行下载工具，用户可以通过npm命令把别人写的包下载到自己电脑上，还可以管理自己模块依赖的其它模块

搜索第三方包的地址

```
https://www.npmjs.com/search
```

### 8.2 npm命令

##### 8.2.1 (npm install)安装包

- 打开命令行或终端，进入要安装包的目录,然后执行以下命令安装依赖的模块

```
npm install <package-name>
npm i mime
```

> 此命令会从服务器上下载此模块到当前目录下的node_modules目录下，如果node_modules目录不存在则会创建一个

- 也可以安装特定的版本

  ```
  npm install <package name>@<version spec>
  npm i mime@2.1
  ```

- 还可以使用一个版本号范围来替换点位符

```
npm i mime@2.x
```

##### 8.2.2 卸载包

```
npm uninstall <package name>
```

##### 8.2.3 更新包

我们还可以通过以下指令更新已经安装的包

```
npm update <package name>
```

### 8.3 包的安装模式

#### 8.3.1 本地安装

- 默认情况下安装命令会把对应的包安装到当前目录下，这叫本地安装，如果包里有可执行的文件NPM会把可执行文件安装到`./node_modules/.bin`目录下
- 本地安装的模块只能在当前目录和当前目录的子目录里面使用

#### 8.3.2 全局安装

- 如果希望安装的包能够在计算机机的所有目录下面都能使用就需要全局安装

```js
npm install <package-name> -g
npm install mime -g
C:\Users\zhufeng\AppData\Roaming\npm\node_modules\mime
```

- 在全局安装的模式下，npm会把包安装到全局目录，通过此命令可以查看当前全局目录的位置

```js
npm root -g
C:\Users\Administrator\AppData\Roaming\npm\node_modules
```

- 如果包里有可执行文件，会把可执行文件安装到此node_modules的上一级目录中。

```js
C:\Users\Administrator\AppData\Roaming\npm
```

- 全局安装的一般是需要在任意目录下面执行的命令，比如`babel`

```js
npm install babel-cli -g
```

- 如果全局安装的命令不能用则可能是没有正确配置用户变量`PATH`,需要在系统变量中为`PATH`变量添加全局安装目录

### 8.3 注册、登录和发布模块

1. 注册npm账号

[npmjs](https://www.npmjs.com/)

1. 登录

```js
npm login
```

1. 发布

```js
npm publish
```

### 8.4 npx

- npm 从5.2版开始，增加了 npx 命令

#### 8.4.1 调用项目安装的模块

- npx 想要解决的主要问题，就是调用项目内部安装的模块

```js
npm install -D mocha
```

> 一般来说，调用mocha只能在`package.json`的scripts字段里面使用

```js
"scripts": {
    "test": "mocha -version"
}
npx mocha --version
```

> npx 的原理很简单，就是运行的时候，会到node_modules/.bin路径和环境变量$PATH里面，检查命令是否存在

#### 8.4.2 避免全局安装模块

- 除了调用项目内部模块，npx 还能避免全局安装的模块。比如，`create-react-app`这个模块是全局安装,npx 可以运行它,而且不进行全局安装

```js
$ npx create-react-app my-react-app
```

> 上面代码运行时，npx 将create-react-app下载到一个临时目录，使用以后再删除

#### 8.4.3 --no-install 参数和--ignore-existing 参数

- 如果想让 npx 强制使用本地模块，不下载远程模块，可以使用`--no-install`参数。如果本地不存在该模块，就会报错
- 反过来，如果忽略本地的同名模块，强制安装使用远程模块，可以使用`--ignore-existing`参数

## 9. yarn

Yarn 是一个依赖管理工具。它能够管理你的代码，并与全世界的开发者分享代码。 代码是通过包（有时也被称为模块）进行共享的。 在每一个包中包含了所有需要共享的代码，另外还定义了一个`package.json`文件，用来描述这个包。

### 9.1 初始化一个新的项目

```
yarn init
```

### 9.2 添加一个依赖包

```
yarn add [package]
yarn add [package]@[version]
yarn add [package]@[tag]
```

### 9.3 更新一个依赖包

```
yarn upgrade [package]
yarn upgrade [package]@[version]
yarn upgrade [package]@[tag]
```

### 9.4 删除一个依赖包

```
yarn remove [package]
```

### 9.5 安装所有的依赖包

```
yarn
```

或者

```
yarn install
```

## 参考

- [yarn](https://yarn.bootcss.com/)

## 参考资料

- [npm官方手册](https://docs.npmjs.com/getting-started/what-is-npm)
- [npm总结](http://www.tuicool.com/articles/VB7nYn)