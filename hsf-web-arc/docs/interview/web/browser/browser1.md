---
title: 浏览器（一）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# 浏览器 一

### 常⻅的浏览器内核有哪些?

| 浏览器/RunTime | 内核（渲染引擎）                 | JavaScript 引擎        |
| -------------- | -------------------------------- | ---------------------- |
| Chrome         | Blink（28~） Webkit（Chrome 27） | V8                     |
| FireFox        | Gecko                            | SpiderMonkey           |
| Safari         | Webkit                           | JavaScriptCore         |
| Edge           | EdgeHTML                         | Chakra(for JavaScript) |
| IE             | Trident                          | Chakra(for JScript)    |
| PhantomJS      | Webkit                           | JavaScriptCore         |
| Node.js        | -                                | V8                     |

### 浏览器的主要组成部分是什么？

1. **⽤户界⾯** - 包括地址栏、前进/后退按钮、书签菜单等。除了浏览器主窗⼝显示的您请求的⻚⾯外，其他显示的各个 部分都属于⽤户界⾯。 
2. **浏览器引擎** - 在⽤户界⾯和呈现引擎之间传送指令。 
3. **呈现引擎** - 负责显示请求的内容。如果请求的内容是 HTML，它就负责解析 HTML 和 CSS 内容，并将解析后的内 容显示在屏幕上。 
4. **⽹络** - ⽤于⽹络调⽤，⽐如 HTTP 请求。其接⼝与平台⽆关，并为所有平台提供底层实现。 
5. **⽤户界⾯后端** - ⽤于绘制基本的窗⼝⼩部件，⽐如组合框和窗⼝。其公开了与平台⽆关的通⽤接⼝，⽽在底层使⽤ 操作系统的⽤户界⾯⽅法。 
6. **JavaScript 解释器**。⽤于解析和执⾏ JavaScript 代码。 
7. **数据存储**。这是持久层。浏览器需要在硬盘上保存各种数据，例如 Cookie。新的 HTML 规范 (HTML5) 定义了“⽹ 络数据库”，这是⼀个完整（但是轻便）的浏览器内数据库。

值得注意的是，和⼤多数浏览器不同，Chrome 浏览器的每个标签⻚都分别对应⼀个呈现引擎实例。每个标签⻚都是⼀ 个独⽴的进程。

### 浏览器是如何渲染UI的？

1. 浏览器获取HTML⽂件，然后对⽂件进⾏解析，形成DOM Tree 
2. 与此同时，进⾏CSS解析，⽣成Style Rules 
3. 接着将DOM Tree与Style Rules合成为 Render Tree 
4. 接着进⼊布局（Layout）阶段，也就是为每个节点分配⼀个应出现在屏幕上的确切坐标 
5. 随后调⽤GPU进⾏绘制（Paint），遍历Render Tree的节点，并将元素呈现出来

![](D:\resDoc\hsf-web-arc\docs\interview\web\browser\img\webkit-parse.jpg)

### 浏览器如何解析css选择器？

浏览器会『从右往左』解析CSS选择器。 

我们知道DOM Tree与Style Rules合成为 Render Tree，实际上是需要将Style Rules附着到DOM Tree上，因此需要根 据选择器提供的信息对DOM Tree进⾏遍历，才能将样式附着到对应的DOM元素上。 

以下这段css为例

```css
.mod-nav h3 span {font-size: 16px;}
```

![](D:\resDoc\hsf-web-arc\docs\interview\web\browser\img\css-parse1.jpg)

若从左向右的匹配，过程是： 

1. 从 .mod-nav 开始，遍历⼦节点 header 和⼦节点 div 
2. 然后各⾃向⼦节点遍历。在右侧 div 的分⽀中 
3. 最后遍历到叶⼦节点 a ，发现不符合规则，需要回溯到 ul 节点，再遍历下⼀个 li-a，⼀颗DOM树的节点动不动上 千，这种效率很低。 

如果从右⾄左的匹配：

1. 先找到所有的最右节点 span，对于每⼀个 span，向上寻找节点 h3 
2. 由 h3再向上寻找 class=mod-nav 的节点 
3. 最后找到根元素 html 则结束这个分⽀的遍历。 后者匹配性能更好，是因为从右向左的匹配在第⼀步就筛选掉了⼤量的不符合条件的最右节点（叶⼦节点）；⽽从左向 右的匹配规则的性能都浪费在了失败的查找上⾯。



### DOM Tree是如何构建的？

1. 转码: 浏览器将接收到的⼆进制数据按照指定编码格式转化为HTML字符串 
2. ⽣成Tokens: 之后开始parser，浏览器会将HTML字符串解析成Tokens 
3. 构建Nodes: 对Node添加特定的属性，通过指针确定 Node 的⽗、⼦、兄弟关系和所属 treeScope 
4. ⽣成DOM Tree: 通过node包含的指针确定的关系构建出DOM Tree

### 浏览器的重绘和重流（重排）

**浏览器的渲染分为四个阶段**

1. 将html解析成dom树,将css解析成样式书
2. 将dom树和样式树合并成 渲染树 render tree
3. 计算出渲染树的页面布局 layout
4. 将渲染树绘制到屏幕上.

这四步不是按顺序执行的,有可能第一步没执行完,后边的就开始执行了

- **流和绘**
   流:渲染树到布局的过程叫流flow
   绘制:布局到页面这个过程叫做绘制
- **流和绘会占用大量的资源**
   他们具有阻塞效应,会消耗很多事件和计算资源
- **重流和重绘的关系 :重流必然导致重绘,重绘,不一定会重流.**
   比如改变某个元素的颜色,会导致重绘,但是不会导致重流.改变页面布局一定会导致重流重绘
   浏览器会将重流和重绘控制在相关的子渲染树上,避免不必要的性能消耗.

-**避免减少重流和重绘的方法**
 作为开发者,我们应当尽量减少重流和重绘

1. 避免操作高层dom
2. flex布局和table布局消耗很大,能不动就不动
3. 使用requestAnimationFrame 将重绘放到下次重流集中处理.

### 浏览器重绘与重排的区别？

- 重排: 部分渲染树（或者整个渲染树）需要重新分析并且节点尺⼨需要重新计算，表现为重新⽣成布局，重新排列 元素 
- 重绘: 由于节点的⼏何属性发⽣改变或者由于样式发⽣改变，例如改变元素背景⾊时，屏幕上的部分内容需要更 新，表现为某些元素的外观被改变

单单改变元素的外观，肯定不会引起⽹⻚重新⽣成布局，但当浏览器完成重排之后，将会重新绘制受到此次重排影响的 部分 

重排和重绘代价是⾼昂的，它们会破坏⽤户体验，并且让UI展示⾮常迟缓，⽽相⽐之下重排的性能影响更⼤，在两者⽆ 法避免的情况下，⼀般我们宁可选择代价更⼩的重绘。 

『重绘』不⼀定会出现『重排』，『重排』必然会出现『重绘』。

### 如何触发重排和重绘？

- 任何改变⽤来构建渲染树的信息都会导致⼀次重排或重绘：
- 添加、删除、更新DOM节点 
- 通过display: none隐藏⼀个DOM节点-触发重排和重绘 
- 通过visibility: hidden隐藏⼀个DOM节点-只触发重绘，因为没有⼏何变化 
- 移动或者给⻚⾯中的DOM节点添加动画 
- 添加⼀个样式表，调整样式属性 
- ⽤户⾏为，例如调整窗⼝⼤⼩，改变字号，或者滚动。

### 如何避免重绘或者重排？

##### 集中改变样式

我们往往通过改变class的⽅式来集中改变样式

```js
// 判断是否是⿊⾊系样式
const theme = isDark ? 'dark' : 'light'
// 根据判断来设置不同的class
ele.setAttribute('className', theme)
```

### 使⽤DocumentFragment

我们可以通过createDocumentFragment创建⼀个游离于DOM树之外的节点，然后在此节点上批量操作，最后插⼊ DOM树中，因此只触发⼀次重排

```js
var fragment = document.createDocumentFragment();
for (let i = 0;i<10;i++){
let node = document.createElement("p");
node.innerHTML = i;
fragment.appendChild(node);
}
document.body.appendChild(fragment);
```

### 提升为合成层

将元素提升为合成层有以下优点： 

- 合成层的位图，会交由 GPU 合成，⽐ CPU 处理要快 
- 当需要 repaint 时，只需要 repaint 本身，不会影响到其他的层 
- 对于 transform 和 opacity 效果，不会触发 layout 和 paint 

提升合成层的最好⽅式是使⽤ CSS 的 will-change 属性：

```js
#target {
will-change: transform;
}
```

### 前端如何实现即时通讯？

#####短轮询 

短轮询的原理很简单，每隔⼀段时间客户端就发出⼀个请求，去获取服务器最新的数据，⼀定程度上模拟实现了即时通 讯。

- 优点：兼容性强，实现⾮常简单 
- 缺点：延迟性⾼，⾮常消耗请求资源，影响性能 

##### comet 

comet有两种主要实现⼿段，

​	⼀种是基于 AJAX 的⻓轮询（long-polling）⽅式，

​	另⼀种是基于 Iframe 及 htmlfile 的流 （streaming）⽅式，通常被叫做⻓连接。 

`具体两种⼿段的操作⽅法请移步Comet技术详解：基于HTTP⻓连接的Web端实时通信技术` 

⻓轮询优缺点： 

​	优点：兼容性好，资源浪费较⼩ 

​	缺点：服务器hold连接会消耗资源，返回数据顺序⽆保证，难于管理维护

⻓连接优缺点： 

​	优点：兼容性好，消息即时到达，不发⽆⽤请求 

​	缺点：服务器维护⻓连接消耗资源

##### SSE 

`使⽤指南请看Server-Sent Events 教程` 

​	SSE（Server-Sent Event，服务端推送事件）是⼀种允许服务端向客户端推送新数据的HTML5技术。 

优点：基于HTTP⽽⽣，因此不需要太多改造就能使⽤，使⽤⽅便，⽽websocket⾮常复杂，必须借助成熟的库或 框架 

缺点：基于⽂本传输效率没有websocket⾼，不是严格的双向通信，客户端向服务端发送请求⽆法复⽤之前的连 接，需要重新发出独⽴的请求



Websocket 

`使⽤指南请看WebSocket 教程` 

​	Websocket是⼀个全新的、独⽴的协议，基于TCP协议，与http协议兼容、却不会融⼊http协议，仅仅作为html5的⼀部 分，其作⽤就是在服务器和客户端之间建⽴实时的双向通信。 

优点：真正意义上的实时双向通信，性能好，低延迟 

缺点：独⽴与http的协议，因此需要额外的项⽬改造，使⽤复杂度⾼，必须引⼊成熟的库，⽆法兼容低版本浏览器



Web Worker 

后⾯性能优化部分会⽤到，先做了解 

Web Worker 的作⽤，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将⼀些任务分配给后者运⾏ 



Service workers 

后⾯性能优化部分会⽤到，先做了解 

Service workers 本质上充当Web应⽤程序与浏览器之间的代理服务器，也可以在⽹络可⽤时作为浏览器和⽹络间的代 理，创建有效的离线体验。 





### 什么是浏览器同源策略？

同源策略限制了从同⼀个源加载的⽂档或脚本如何与来⾃另⼀个源的资源进⾏交互。这是⼀个⽤于隔离潜在恶意⽂件的 重要安全机制。 

同源是指"协议+域名+端⼝"三者相同，即便两个不同的域名指向同⼀个ip地址，也⾮同源。 

下表给出了相对http://store.company.com/dir/page.html同源检测的示例:

浏览器中的⼤部分内容都是受同源策略限制的，但是以下三个标签可以不受限制： 

```
1、<img src=XXX>
2、<link href=XXX>
3、<script src=XXX>

```

