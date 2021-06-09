---
title: 使用 Performance 看看浏览器在做些什么
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

## **前言**

Chrome 浏览器的 Performance 面板为我们提供了检测页面性能的能力，但其提供的远不止一些性能数据。本文将从工作原理的视角，结合实际工程的录制结果，探一探性能面板向我们透露的其他信息。

## **性能面板**

> 关于面板的功能与使用方法，可以参考这篇文章。本节主要介绍浏览器架构与性能面板的关系。

因为尚未决出最终的标准架构，各大浏览器的实现细节各有不同。这里我们以 Chrome 的架构为例，对照其架构与性能面板的关系。

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHr1qBlVQgmiaVxbW0dhaiaLo995UV1HnibynJAzEy8iaT6Iqia5ibkKEfprQfEh2ELA8TSibkaNkYsHpCkjw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHr1qBlVQgmiaVxbW0dhaiaLo916MbdvRPyGBpo8IlLAibwxCdJtRCMS83MZrsgSgzTu205uDC0RMNgzA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

由下图我们可以看到性能面板呈现的几个主要线程。性能面板并不包含架构中全部的线程，主要还是与页面渲染过程相关的部分。

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHr1qBlVQgmiaVxbW0dhaiaLo9lkfb9Gjrg6W7BYL8fDpAOv4QCt1dltZJe82umPubJhknrAicbjdm5IQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

### **Network**

Network 代表浏览器进程中的网络线程，我们可以看到时间轴上包含了所有的网络请求和文件下载的调用信息，并以不同颜色标识不同类型的资源。

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHr1qBlVQgmiaVxbW0dhaiaLo9ROyMWqiaCXSATfYd5xONdQlfYB2YK8Joeyvibs8D2ibFfco8uEYLYpJvA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

### **Main**

Main 代表渲染进程中的主线程，渲染相关的事情基本都是它来做，脚本执行、样式计算、布局计算、绘制等等。

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

### **Compositor & Raster**

Compositor 代表渲染进程中的合成线程，Raster 代表渲染进程中的栅格线程。如今浏览器绘制一个页面，可以分为以下几步：

- 主线程将页面分成若干图层（后文中会提及 Update Layer Tree）
- 栅格线程分别对每一个层进行栅格化处理
- 合成线程将栅格化的图块合并成一个页面

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

我们可以看到，在性能面板中主线程在最后调用了栅格线程做实际的渲染。

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

### **GPU**

显然，这部分就是 GPU Process 中的 GPU 线程。

## **浏览器的工作报告**

接下来我们将大致从时间维度，看看浏览器录制下来的「工作报告」。

### **文档的下载解析**

我们旅途的起点将从点击 Chrome Performance Panel 的 Reload 按钮（形如刷新）开始。当前页面首先进行卸载，伴随着几个日志上报，浏览器开始了 index.html 的下载工作。

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHr1qBlVQgmiaVxbW0dhaiaLo9k50dvcXGm3EHtIpgQOwuU6ymqbjqqdogib9FiajOcgKia5SsPdvB2GiaDw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

HTML 文档下载完成后，浏览器开始按照 HTML 标准对 index.html 进行解析，在主线程中将接收到的文本字符串解析为 DOM 。我们可以注意到，HTML 的解析过程并不是一气呵成，这是因为 HTML 通常还包括了其他外部资源，如图片、CSS、JS 等。这些文件需要通过网络请求或缓存来获取。其中，当 HTML 解析器解析到

```
<script>
```

标签时，HTML 文档的解析过程就会中止，转而去加载、解析和执行脚本。因此，从主线程的时间轴可以看出，Parse HTML 的过程是断断续续的。

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHr1qBlVQgmiaVxbW0dhaiaLo9a0c8VXaryDwVq5U2ZuzlhzwUdORJ5icVrJlyaeEJKslo4MnepBRWfKQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

### **不同资源的处理**

> 以下处理策略都可以在主线程中看到，但是不同资源的处理条长短差距较大，截图困难，这里不做呈现。

那么浏览器对不同资源的处理策略是怎样的呢？

- 浏览器下载 HTML 并解析，如果遇到外部 CSS 等资源，就会由 Browser 进程中的 network 线程下载
- 当 CSS 下载时，HTML 的解析过程可以继续
- 当解析遇到了外部 Script 标签（不包含 async、defer 属性）时，解析停止，直到脚本下载并执行完成

总的来说，浏览器对 HTML 的解析过程不会被 CSS、IMG 等资源的下载阻塞，但脚本的加载和执行会终止 HTML 的解析。这主要是因为 JS 可能会改变 DOM 的结构，或者是 JS 动态加载其他 JS 再改变 DOM 等潜在问题。

显然，尽管浏览器可以并发几个 network 线程下载资源，但如果仅像上述策略这样处理，当解析到 `<script>` 时，如果文件较大或者延迟较高，可能会发生「脚本独占线程而没有其他资源在下载」的空窗期（idle network）。因此，pre-loader （或者 preload scanner 等叫法）将会在主线程之外，扫描余下的标签，充分利用 network 线程下载其他资源。这种机制可以优化 19% 的加载时长。

### **脚本的解析执行**

对于重业务逻辑的复杂中后台应用而言，脚本带来的性能开销，往往是占主要地位的。我们从下图的例子就可以看出，去除 beforeunload 之前的卸载，脚本本身的时间开销占比已过半。解析 HTML 在其次，至于其他样式计算、微任务、垃圾回收等等，倒不是最痛的地方。当然，该例子工程本身重业务逻辑，JavaScript 代码量决定着其高成本。

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHr1qBlVQgmiaVxbW0dhaiaLo9wC0C1RypYqscWDYdM1wdm6RRkc5lopVDk7LRojrPkNyBt9V81NcLWg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

有时我们可以考虑使用

```
async
```

或者

```
defer
```

属性来提高页面性能，二者的差异不再赘述。需要专门说明的是动态添加脚本的情况。如下面示例代码所示，脚本被 append 到文档中后就会开始下载，并且默认和

```
async
```

具有一样的行为，即「先加载完的先执行」。

```
let script = document.createElement('script');
script.src = "/xxx/a.js";
document.body.append(script);
```

如果专门设置了 `async` 属性，则会按照 `defer` 的行为来，即「先加载到的先执行」。

```
function loadScript(src) {
  let script = document.createElement('script');
  script.src = src;
  script.async = false;
  document.body.append(script);
}

// 因为 async = false，所以按顺序先执行 big；否则（一般会先）执行 small
loadScript("/xxx/big.js");
loadScript("/xxx/small.js");
```

从下图中可以看到，调用栈中执行的 appendChild 方法动态添加了

```
script
```

脚本，之后很快开始了下载动作。动态加载的脚本完成下载后，又第一时间开始了脚本执行。

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

### **lifecycle 和 paint timing**

下图展示的是文章中提及的页面生命周期流程图。本节我们结合 Performance，对照该图进行观察。

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHr1qBlVQgmiaVxbW0dhaiaLo9980jUZvpntgGkZHPaeSwtOtd1WwSq7gSXNiaYagYK6LiaoYRKicP4zF2A/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

### **beforeunload**

因为 Performance 的录制是在已有页面上进行 reload，所以记录的生命周期从页面的卸载开始。如下图 Main 所示，beforeunload 事件首先被浏览器触发。可以注意到，黄色条 Event: beforeunload 是浏览器自身触发的活动，我们称之为根活动（Root activities）。

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHr1qBlVQgmiaVxbW0dhaiaLo9micoGQnVeAtLDywG3OnGvAFarbKaaBDBewde0uddy4iam2paFPwr2PUQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

### **pagehide**

从下图中我们可以注意到，为什么事件的触发顺序和上面的生命周期流程图不一致，是 pagehide -> visibilitychange -> unload 呢？事实上，在浏览器之前的设计中，如果页面在卸载阶段可视，visibilitychange 就会在 pagehide 之后触发，正如下图截图中一样。这就使得页面的卸载在不同可视情况下，有着不一致的生命周期与事件顺序，给开发者带来复杂性。

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHr1qBlVQgmiaVxbW0dhaiaLo9vQberKLTgtnzZ16YlibfwvNkmt70pqG2ZLaXq5vhXxpZX5ia6fcYQkKw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

在未来新版本浏览器中，卸载阶段的事件顺序会进行统一，目前进度在这一 issue 下。也正因为这部分的调整，unload 已经不建议在代码实现中使用了。

### **first paint**

首先区分下以下两个时间点：

- first paint：指的是首个像素开始绘制到屏幕上的时机，例如一个页面的背景色
- first contentful paint：指的是开始绘制内容的时机，如文字或图片

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHr1qBlVQgmiaVxbW0dhaiaLo99aRDEtLZ3Picuiab6g02d0EprhY0yyqP2HzzlYd1sSERFkXHonnyclyw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

image.png

从 Performance 中，我们可以看出首次绘制的一系列动作（有些过程啪的一下很快啊，截图就省了）：

1. CSS 加载完成
2. Parse Stylesheet：解析样式表，构建出 CSSOM
3. Recalculate Style：重新计算样式，确定样式规则
4. Layout：根据计算结果进行布局，确定元素的大小和位置
5. Update Layer Tree：更新渲染层树
6. Paint：根据 Layer Tree 绘制页面（位置、大小、颜色、边框、阴影等）
7. Composite Layers：组合层，浏览器将图层合并后输出到屏幕

### 

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHr1qBlVQgmiaVxbW0dhaiaLo9Ezo4FJ75cvpt4guiadjwo1vm6J3icfuhzyWZDT9djebibEBmiaFBqAE7Gw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

Layout 之后的过程很快，这里放大些倍数来查看：

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHr1qBlVQgmiaVxbW0dhaiaLo9X9dvf52kGecmzvUhwqViahZRGAVoACRNXSpljMedVsmLFFpSRs7Aj7g/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

### **DOMContentLoaded**

DOMContentLoaded 表示 HTML 已经完全被加载和解析，当然样式表、图片等资源还不一定已经完成加载。从下图中可以看到，经过多段 HTML 解析后，DCL 之后就没有其他的 Parse HTML 了。

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHr1qBlVQgmiaVxbW0dhaiaLo9bNJs7q7WRkcPFFVrE7R0VNDgLZKY01vvJW7BbcDfRZsEE5pNQMDOgQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

### **pageshow/load**

因导航而使得浏览器在窗口内呈现文档时，浏览器会在 window 上触发 pageshow 事件，具体的时机可参考这里。不仅如此，当页面是初次加载时，pageshow 事件会在 load 事件后触发。

那么回到 Performance 的时间轴，从下图我们可以看到，在红色虚线（标志着 load）之后，浏览器触发了 pageshow 事件，也就是上文提及的根活动。

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHr1qBlVQgmiaVxbW0dhaiaLo9lia67b29kUnMp4QSicBf5Yue1X9mkIcMwe3eGqOibiaKQiaVvPyEVL3Q55Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

### **任务与性能问题**

比较可惜的是，Performance 还无法清晰的看出 Event Loop。下图中灰色的 Task 并不是指宏任务，其代表的是「当前主线程忙碌，无法响应用户交互」；Run Microtasks 则确实是在一次任务的末尾执行的微任务。当我们点开调用栈观察时，可以看到源码中的回调函数以及对应的源码位置。

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHr1qBlVQgmiaVxbW0dhaiaLo9DialJn2VpvcU5Nj6RggnXgS0p5q3BRh6MqpXQTmKhsbRKia1QIVsL1ZA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

通过 Task 可以定位性能出现问题的地方。RAIL 模型告诉我们需要重点关注占用 CPU 超出 50ms 的复杂任务，以提供连贯的交互体验。当然，这里更多的是对交互阶段的响应的要求，而不一定是对初始加载阶段的要求。

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHr1qBlVQgmiaVxbW0dhaiaLo9ujol7d06cNcrG5ylsj6v4LuicHgbfObqkIrjmGicewomLdtBtrtVCeLA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

## **总结**

本文从工作原理的视角，结合实际工程的录制结果，进行了一次实践对理论知识的检验。Performance 不仅是性能分析工具，还是探究浏览器工作原理的小霸王学习机。总的来说，浏览器的工作是充实且复杂的，与我们打工人的摸鱼日常形成了对比，还是需要进一步加深学习与思考呀。



