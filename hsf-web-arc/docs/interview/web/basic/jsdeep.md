---
title: js 高级
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---
## 事件循环

1. 为什么会有Event Loop?

JS的任务分为两种：同步和异步，他们的处理方式也各自不同，同步任务是直接放在主线程上排队依次执行，异步任务会放在任务队列中，若有多个异步任务则需要在任务队列中排队等待，任务队列类似于缓存区，任务下一步会被移到调用栈然后主线程执行调用栈的任务

调用栈：调用栈是一个栈结构，函数调用会形成一个栈帧，帧中包含了当前执行函数的参数和局部变量等上下文信息，函数执行完后，它的执行上下文会从栈中弹出

JS是单线程的，单线程是指js引擎中解析和执行js代码的线程只有一个(主进程)，每次只能做一件事情，而ajax请求中，主线程在等待响应的过程中回去做其他事情，浏览器先在事件注册ajax的回调函数，响应回来后回调函数被添加到任务队列中等待执行，不会造成线程阻塞，所以说js处理ajax请求方式是异步的

综上所述，检查调用栈是否为空以及讲某个任务添加到调用栈中的过程就是event loop，这就是JS实现异步的核心

2. 浏览器中的Event Loop

Micro-Task 与 Macro-Task 浏览器端事件循环中的异步队列有两种：macro(宏任务)队列和micro(微任务)队列 常见的macro-task:setTimeout、setInterval、script(整体代码)、I/O操作、UI渲染等 常见的micro-task：new Promise().then(回调)、MutationObserve等

requestAnimationFrame requestAnimationFrame也属于异步执行的方法，但是该方法既不属于宏任务也不属于微任务，按照MDN定义：

window.requestAnimationFrame()告诉浏览器---希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行 requestAnimationFrame是GUI渲染之前执行，但是在Micro-Task之后，不过requestAnimationFrame不一定会在当前帧必须执行，由浏览器根据当前的策略自行决定在哪一帧执行

Event Loop过程

- 1.检查macro-task是否为空，非空到达2，为空到达3
- 2.执行macro-task中的一个任务
- 3.继续检查micro-task队列是否为空，若是空到达4，否则是到达5
- 4.取出micro-task中的任务执行，执行完成返回到达3
- 5.执行试图更新

当某个宏任务执行完后,会查看是否有微任务队列。如果有，先执行微任务队列中的所有任务，如果没有，会读取宏任务队列中排在最前的任务，执行宏任务的过程中，遇到微任务，依次加入微任务队列。栈空后，再次读取微任务队列里的任务，依次类推。

3. node中的Event Loop

node中的Event Loop和浏览器中的是完全不相同的东西。node.js采用v8作为js的解析引擎，而I/O处理方面使用了自己设计的libuv，libuv是一件基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的API，事件循环机制也是这里面的实现

- 1.v8引擎解析JS脚本

- 2.解析后的代码，调用node API

- 3.libuv库负责node API的执行。它将不同的任务分配给不同的线程，形成一个Event Loop(事件循环)，以异步的方式将任务的执行结果返回给V8引擎

- 4.v8引擎在将结果返回给用户


六大阶段

其中libuv引擎中的事件循环分为六个阶段，它们会按照顺序反复运行。每当进入一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量达到系统设定的阈值，就会进入下一个阶段

```js
1.timer阶段：这个阶段执行timer(setTimeout、setInterval)的回调，并且是由poll阶段控制的
2.I/O callbacks阶段：处理一些上一轮循环中的少数未执行的I/O回调
3.idle,prepare阶段：仅node内部使用
4.poll阶段：获取新的I/O事件，适当的条件下node将阻塞在这里
5.check阶段：执行setImmediate()的回调
6.close callbacks阶段：执行socket的close事件回调

```

poll阶段

poll是一个至关重要的阶段，这一阶段中，系统会做两件事情 1.回到timmer阶段执行回调 2.执行I/O回调，并且在进入该阶段时如果没有设定timer的话，会发生以下两件事情

- 如果poll队列不为空，会遍历回调队列并同步执行，直到队列为空或者到达系统限制

- 如果 poll 队列为空时，会有两件事发生

  + 如果有 setImmediate 回调需要执行，poll 阶段会停止并且进入到 check 阶段执行回调

  + 如果没有 setImmediate 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去 当然设定了 timer 的话且 poll 队列为空，则会判断是否有 timer 超时，如果有的话会回到 timer 阶段执行回调。

Micro-Task 与 Macro-Task

Node端事件循环中的异步队列也是这两种：macro（宏任务）队列和 micro（微任务）队列。

- 常见的 macro-task 比如：setTimeout、setInterval、 setImmediate、script（整体代码）、 I/O 操作等

- 常见的 micro-task 比如: process.nextTick、new Promise().then(回调)等

setTimeout 和 setImmediate

二者非常相似，区别主要在于调用时机不同。

- setImmediate 设计在poll阶段完成时执行，即check阶段

- setTimeout 设计在poll阶段为空闲时，且设定时间到达后执行，但它在timer阶段执行

```js
setTimeout(function timeout () {
  console.log('timeout');
},0);
setImmediate(function immediate () {
  console.log('immediate');
});
```

对于以上代码来说，setTimeout 可能执行在前，也可能执行在后。 2.首先 setTimeout(fn, 0) === setTimeout(fn, 1)，这是由源码决定的 进入事件循环也是需要成本的，如果在准备时候花费了大于 1ms 的时间，那么在 timer 阶段就会直接执行 setTimeout 回调 3.如果准备时间花费小于 1ms，那么就是 setImmediate 回调先执行了

process.nextTick

这个函数其实是独立于 Event Loop 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其他 microtask 执行


4. node与浏览器的Event Loop差异

- Node端，microtask 在事件循环的各个阶段之间执行
- 浏览器端，microtask 在事件循环的 macrotask 执行完之后执行



​	在开始讲事件循环之前，我们一定要牢记一点：**JS 是一门单线程语言，在执行过程中永远只能同时执行一个任务，任何异步的调用都只是在模拟这个过程，或者说可以直接认为在 JS 中的异步就是延迟执行的同步代码**。另外别的什么 Web worker、浏览器提供的各种线程都不会影响这个点。

大家应该都知道执行 JS 代码就是往执行栈里 `push` 函数（不知道的自己搜索吧），那么当遇到异步代码的时候会发生什么情况？

其实当遇到异步的代码时，只有当遇到 Task、Microtask 的时候才会被挂起并在需要执行的时候加入到 Task（有多种 Task） 队列中。

![img](https://yck-1254263422.file.myqcloud.com/2021/04/04/16175397496891.jpg)

从图上我们得出两个疑问：

1. 什么任务会被丢到 Microtask Queue 和 Task Queue 中？它们分别代表了什么？
2. Event loop 是如何处理这些 task 的？

首先我们来解决问题一。

Task（宏任务）：同步代码、`setTimeout` 回调、`setInteval` 回调、IO、UI 交互事件、`postMessage`、`MessageChannel`。

MicroTask（微任务）：`Promise` 状态改变以后的回调函数（`then` 函数执行，如果此时状态没变，回调只会被缓存，只有当状态改变，缓存的回调函数才会被丢到任务队列）、`Mutation observer` 回调函数、`queueMicrotask` 回调函数（新增的 API）。

​	1、宏任务会被丢到下一次事件循环，并且宏任务队列每次只会执行一个任务。

​	2、微任务会被丢到本次事件循环，并且微任务队列每次都会执行任务直到队列为空。

**假如**每个微任务都会产生一个微任务，那么宏任务永远都不会被执行了。

接下来我们来解决问题二。

Event Loop 执行顺序如下所示：

1. 执行同步代码
2. 执行完所有同步代码后且执行栈为空，判断是否有微任务需要执行
3. 执行所有微任务且微任务队列为空
4. 是否有必要渲染页面
5. 执行一个宏任务

如果你觉得上面的表述不大理解的话，接下来我们通过代码示例来巩固理解上面的知识：

```javascript
console.log('script start');

setTimeout(function() {
    console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
    queueMicrotask(() => console.log('queueMicrotask'))
    console.log('promise');
});

console.log('script end');
```

1. 遇到 `console.log` 执行并打印
2. 遇到 `setTimeout`，将回调加入宏任务队列
3. 遇到 `Promise.resolve()`，此时状态已经改变，因此将 `then` 回调加入微任务队列
4. 遇到 `console.log` 执行并打印

此时同步任务全部执行完毕，分别打印了 'script start' 以及 'script end'，开始判断是否有微任务需要执行。

1. 微任务队列存在任务，开始执行 `then` 回调函数
2. 遇到 `queueMicrotask`，将回到加入微任务队列
3. 遇到 `console.log` 执行并打印
4. 检查发现微任务队列存在任务，执行 `queueMicrotask` 回调
5. 遇到 `console.log` 执行并打印

此时发现微任务队列已经清空，判断是否需要进行 UI 渲染。

1. 执行宏任务，开始执行 `setTimeout` 回调
2. 遇到 `console.log` 执行并打印

执行一个宏任务即结束，寻找是否存在微任务，开始循环判断...

其实事件循环没啥难懂的，理解 JS 是个单线程语言，明白哪些是微宏任务、循环的顺序就好了。

最后需要注意的一点：正是因为 JS 是门单线程语言，只能同时执行一个任务。因此所有的任务都可能因为之前任务的执行时间过长而被延迟执行，尤其对于一些定时器而言。

#### 总结：

​		1、js是单线程的，不管在什么时候只能执行一个任务，所谓的异步也就是延迟执行，

​		2、事件环：

​				（1）、开始执行的同步代码;

​				（2）、如果遇到宏任务就放到宏任务 (MacroTask) 队列，如果遇到微任务（MicroTask）就放到微任务队列;

​				（3）、当同步代码执行完成之后，开始执行微任务队列中的任务，一直到微任务队列为空;

​				（4）、当微任务队列执行完成之后，判断是否需要进行UI的渲染， 下一次事件环开始了;

​				（5）、渲染过后开始执行宏任务队列中的任务，（宏任务在一次事件循环中只是执行一个，但是微任务在一次循环将队列中的任务执行完毕）;

​	简单来说是：

​		执行同步代码，这属于宏任务执行栈为空，查询是否有微任务需要执行必要的话渲染 UI然后开始下一轮 Event loop，执行宏任务中的异步代码;

#### 微任务（microtask）

- process.nextTick
- promise
- Object.observe （已废弃）
- MutationObserver

#### 宏任务（macrotask）

- script
- setTimeout
- setInterval
- setImmediate
- I/O
- UI rendering

## 

## 垃圾回收

本小结内容建立在 V8 引擎之上。

首先聊垃圾回收之前我们需要知道堆栈到底是存储什么数据的，当然这块内容上文已经讲过，这里就不再赘述了。

接下来我们先来聊聊栈是如何垃圾回收的。其实栈的回收很简单，简单来说就是一个函数 push 进栈，执行完毕以后 pop 出来就当可以回收了。当然我们往深层了讲深层了讲就是汇编里的东西了，操作 esp 和 ebp 指针，了解下即可。

然后就是堆如何回收垃圾了，这部分的话会分为两个空间及多个算法。

两个空间分别为新生代和老生代，我们分开来讲每个空间中涉及到的算法。

### 新生代

新生代中的对象一般存活时间较短，空间也较小，使用 Scavenge GC 算法。

在新生代空间中，内存空间分为两部分，分别为 From 空间和 To 空间。在这两个空间中，必定有一个空间是使用的，另一个空间是空闲的。新分配的对象会被放入 From 空间中，当 From 空间被占满时，新生代 GC 就会启动了。算法会检查 From 空间中存活的对象并复制到 To 空间中，如果有失活的对象就会销毁。当复制完成后将 From 空间和 To 空间互换，这样 GC 就结束了。

### 老生代

老生代中的对象一般存活时间较长且数量也多，使用了两个算法，分别是标记清除和标记压缩算法。

在讲算法前，先来说下什么情况下对象会出现在老生代空间中：

- 新生代中的对象是否已经经历过一次以上 Scavenge 算法，如果经历过的话，会将对象从新生代空间移到老生代空间中。
- To 空间的对象占比大小超过 25 %。在这种情况下，为了不影响到内存分配，会将对象从新生代空间移到老生代空间中。

老生代中的空间很复杂，有如下几个空间

```c++
1enum AllocationSpace {
2  // TODO(v8:7464): Actually map this space's memory as read-only.
3  RO_SPACE,    // 不变的对象空间
4  NEW_SPACE,   // 新生代用于 GC 复制算法的空间
5  OLD_SPACE,   // 老生代常驻对象空间
6  CODE_SPACE,  // 老生代代码对象空间
7  MAP_SPACE,   // 老生代 map 对象
8  LO_SPACE,    // 老生代大空间对象
9  NEW_LO_SPACE,  // 新生代大空间对象
10
11  FIRST_SPACE = RO_SPACE,
12  LAST_SPACE = NEW_LO_SPACE,
13  FIRST_GROWABLE_PAGED_SPACE = OLD_SPACE,
14  LAST_GROWABLE_PAGED_SPACE = MAP_SPACE
15};
```

在老生代中，以下情况会先启动标记清除算法：

- 某一个空间没有分块的时候
- 空间中被对象超过一定限制
- 空间不能保证新生代中的对象移动到老生代中

在这个阶段中，会遍历堆中所有的对象，然后标记活的对象，在标记完成后，销毁所有没有被标记的对象。在标记大型对内存时，可能需要几百毫秒才能完成一次标记。这就会导致一些性能上的问题。为了解决这个问题，2011 年，V8 从 stop-the-world 标记切换到增量标志。在增量标记期间，GC 将标记工作分解为更小的模块，可以让 JS 应用逻辑在模块间隙执行一会，从而不至于让应用出现停顿情况。但在 2018 年，GC 技术又有了一个重大突破，这项技术名为并发标记。该技术可以让 GC 扫描和标记对象时，同时允许 JS 运行，你可以点击 [该博客](https://v8project.blogspot.com/2018/06/concurrent-marking.html) 详细阅读。

清除对象后会造成堆内存出现碎片的情况，当碎片超过一定限制后会启动压缩算法。在压缩过程中，将活的对象像一端移动，直到所有对象都移动完成然后清理掉不需要的内存。

## 栈和堆的区别

栈：其操作系统自动分配释放，存放函数的参数值和局部变量的值等。其操作方式类似于数据结构中的栈。简单的理解就是当定义一个变量的时候，计算机会在内存中开辟一块存储空间来存放这个变量的值，这块空间叫做栈，然而栈中一般存放的是基本数据类型，栈的特点就是先进后出(或者后进先出)

堆：一般由程序员分配释放，若程序员不释放，程序结束时可能由OS回收，分配方式倒是类似于链表。其实在堆中一般存放变量的是一些对象类型

>1.存储大小
>栈内存的存储大小是固定的，申请时由系统自动分配内存空间，运行的效率比较快，但是因为存储的大小固定，所以容易存储的大小超过存储的大小，导致溢栈。

堆内存的存储的值是大小不定，是由程序员自己申请并指明大小。因为堆内存是new分配的内存，所以运行的效率会比较低

>2.存储对象
>栈内存存储的是基础数据类型，并且是按值访问的，因为栈是一块连续的内存区域，以后进先出的原则存储调用的，所以是连续存储的

堆内存是向高地址扩展的数据结构，是不连续的内存区域，系统也是用链表来存储空闲的内存地址，所以是不连续的。因为是记录的内存地址，所以获取是通过引用，存储的是对象居多

>3.回收
>栈的回收是系统控制实现的

堆内存的回收是人为控制的，当程序结束后，系统会自动回收

## 垃圾回收栈和堆的区别

栈内存中的数据只要结束，则直接回收

堆内存中的对象回收标准是否可达，在V8中对象先分配到新生代的From中，如果不可达直接释放，如果可达，就复制到TO中，然后将TO和From互换。当多次复制后依然没有回收，则放入老生代中，进行标记回收。之后将内存碎片进行整合放到一端。

## 事件代理

了解相关概念

- 1.什么是事件代理？

事件委托或事件代理：根据红宝书来说：就是利用事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件。举例：dom需要事件处理程序，我们都会直接给它设置事件处理程序。但是在ul中1000个li全部需要添加事件处理程序，其具有相同的点击事件，那么可以根据for来进行遍历，也可以在ul上来进行添加。在性能的角度上来看，在ul建立事件会减少dom的交互次数，提高性能。

- 2.事件代理原理

事件委托就是利用事件的冒泡原理来实现的，就是事件从最深的节点开始，然后逐步向上传播事件。

举例：页面上有这么一个节点树，div>ul>li>a;比如给最里面的a加一个click点击事件，那么这个事件就会一层一层的往外执行，执行顺序a>li>ul>div,有这样一个机制，那么我们给最外面的div加点击事件，那么里面的ul、li、a做点击事件的时候，都会冒泡到最外层的div上，所以都会触发，这就是事件委托，委托它们父级代为执行事件

代码实现

1.实现ul中li的事件代理

```js
    window.onload=function(){
    var oBtn=document.getElementById('btn');
    var oUl=document.getElementById('ul1');
    var aLi=oUl.getElementsByTagName('li');
    var num=4;
    //事件委托，添加的子元素也有事件
    oUl.onmouseover=function(e){
        var e=e||window.event;
        var target=e.target||e.srcElement;
        if(target.nodeName.toLowerCase()==='li'){
            target.style.background="red";
        }
    };
    oUl.onmouseout=function(e){
        var e=e||window.event;
        var target=e.target||e.srcElement;
        if(target.nodeName.toLowerCase()==='li'){
            target.style.background="blue"
        }
    };
    //添加新节点
    oBtn.onclick=function(){
        num++;
        var oLi=document.createElement('li');
        oLi.innerHTML=111*num;
        oUl.appendChild(oLi)
    };
}
```

- 2.简单封装一个事件代理通用代码

```js
!function(root,doc){
    class Delegator(selector){
        this.root=document.querySelector(selector);//父级dom
        this.delegatorEvents={}//代理元素及事件
        //代理逻辑
        this.delegator=e=>{
            let currentNode=e.target//目标节点
            const targetEventList=this.delegatorEvents[e.type];
            //如果当前目标节点等于事件目前所在的节点，不再往上冒泡
            while(currentNode !== e.currentTarget){
                targetEventList.forEach(target=>{
                    if(currentNode.matches(target.matcher)){
                        //开始委托并把当前目标节点的event对象传过去
                        target.callback.call(currentNode,e)
                    }
                })
                currentNode=currentNode.parentNode;
            }
        }
    }
    //绑定事件  event---绑定事件类型  selector---需要被代理的选择器  fn---触发函数
    on(event,selector,fn){
        //相同事件只能添加一次，如果存在，则在对应的代理事件里添加
        if(!this.delegatorEvents[event]){
            this.delegatorEvents[event]=[{
                matcher:selector,
                callback:fn
            }]
            this.root.addEventListener(event,this.delegator)
        }else{
            this.delegatorEvents[event].push({
                matcher:seletor,
                callback:fn
            })
        }
        return this;
    }
    // 移除事件
    destory(){
        Object.keys(this.delegatorEvents).forEach(eventName=>{
            this.root.removeEventListener(eventName,this.delegator)
        })
    }
    root.Delegator=Delegator;
}(window,document)

```

