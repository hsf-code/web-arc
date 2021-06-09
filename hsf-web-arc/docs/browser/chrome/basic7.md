---
title: 搞定Chrome运行时的性能、内存问题
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

### **初诊**

### **打开Chrome隐身模式**

- 主要是为了确保有一个干净的测试环境, 不被其它因素所影响.

> 打开测试地址

- 谷歌性能测试地址 `https://googlechrome.github.io/devtools-samples/jank/`
- 国内性能测试地址:`https://gitee.com/hellojameszhang/vue-example/tree/master/vue-javascript/public/performanceTest.html`
- 可以看到如下画面:

> 可以看到页面蓝色小方块在运动

https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfvwibPZNr3zOkfzhJUiaFqwKUJsjdJcvKh4PnSibSgxqR3oU5W1QItLcfIQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

### **限制CPU速度**

- 有些用户电脑的CPU性能很好, 可能无法较好的分析问题(难以发现低端配置设备的性能问题), 所以需要降速.

- 在Chrome浏览器控制台中找到"Performance" => "CPU"选项, 选择降低4/6倍性能

  https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfvAEyVqr3jDG3Qw8uxOaHA5V4ezTzMtR8hL5bWibuL6suEkNvCfL7PJGg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 添加更好小方块, 找到性能瓶颈

- 上面已经限制了CPU的性能, 接下来需要寻找性能瓶颈了.

- 多次点击"Add 10", 向页面中添加小块, 直到感觉页面上小块运动时出现明显卡顿即可.

  https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfv7FzthRNoNdgefr37XzRibCLsQBDHrOwjrQHBXsVCuNmveD3ib8ibfQJHQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 此时, 已经可以明显感觉到页面很卡顿了.

### **优化前后的效果对比**

- 通过点击"Optimize"按钮, 可以提前感受下优化前后的效果对比

  https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfvhMKqK9JD0EZutP3V21pvjuAbKpDO0verkKvapicTrjzHKhXjOHI1zvg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 可以明显感受到优化前后页面的流畅度明显不一样.

- 了解Performance各模块

- 如何分析问题, 肯定是要依赖数据, 这里需要使用到Chrome的Performance功能.

- 将页面切换至非优化的状态, 点击"Record".

  [data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

- 录制的结果如下图所示:

  [data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

  [data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

- 以上数据初学者可能看不明白, 没关系, 我们来一步步了解各部分的含义

- FPS

  - fps, 指页面每秒帧数

  - fps = 60性能最佳

  - fps < 24会让用户感觉到卡顿, 因为人眼的识别主要是24帧

    https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfv3c7To1rNTsZukC9W5wyyvz8tzLJgFic4yjBhD5CJpUwpLNxCh6ibvia7g/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

### **图中蓝色标记出的区域, 即FPS记录的信息**

### **放大某一区域, 可以看到, FPS由两部分组成:**

- 红色的条

- 绿色的半透明条

  https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfvWvzLuw9icOFWb5AiaT43ZfdVDS9jcJBHu29KLC53kECpmPErAvwAKHZw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 切换至优化状态

- 切换至已优化状态, 再进行录制后, 得到FPS数据如下:

  https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfvgC1fIFRwOjzibRdqEYb14puYRWTznXu9UmTKs3O2YgNmARGzfKZE95w/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 可以看出:

  - 没有了红色条
  - 绿色半透明条的高度, 明显比没有优化时高不少

### **小结**

- 红色, 即帧数已经下降到影响用户体验的程度, Chrome已经标注出来, 这块有问题

- 绿色, 即FPS指数, 所有绿色柱体高度越高, 性能越好###了解CPU

  https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfv470WD0c2SoJzt4CQcb9ML8H7K7n1l1kG4Eicj8ibicGq5jl50P45aen6A/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 上图中FPS下的位置, 即CPU信息

- 我们采集些一个真实业务的CPU数据, 这里我抓取的是个人简书的performance, 如下图所示：

  https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfvySN0Q6SBaJtIpeh6T4hBINMbTRhNCBiaMvzDwKibaWjiafbETPPQyq6Lw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 对比可以发现, CPU数据的一些特性:

- CPU包括两种状态

  - 充满颜色
  - 不充满颜色

### **CPU是否充满颜色和FPS存在联系**

- 了解NET

  [data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

- NET部分可以将屏幕逐帧录制下来, 能帮忙观察页面的状态, 分析首屏渲染速度

- 了解Frames

- 查看特定帧的FPS

- Frames部分, 主要用于查看特定帧的FPS, 可以查看特定的帧情况, 悬停其上, 可以查看数据.

  [data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

### **可以看到:**

- 这一帧的时间间隔是: 327ms

- 当前FPS是1000ms/327ms = 3fps

- 这里主要体现的是页面两次刷新之间间隔了327ms

- 查看某个Frames块更详细的信息

- 点击某个Frames块, 可以查看到更加详细的数据

  https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfveH3sfrREwGnVLticgtYdtYoY6D3rvoZo1Phs5JCeKCJVXdWkv2q8NnA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- Duration, 是当前帧从1.02s开始等待, 1.02s+326.97ms后进行了一次渲染fps, 1000ms/326.97ms = 3fps

- 最下面的是当前帧的视图画像

### **了解FPS快捷工具**

- 在Chrome中, 还有一个More Tools选项, 选中"Rendering"选项

  https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfv939P9JkB394q0ICMC1JbYicRmRNlRSqjBBdXUNEhWNa3NplQ3TDvagA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 接着, 开启"FPS meter"选项

  https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfvrlzyB0mNLmLYc8QtYtHslIoHOtjOJnia1jtaFM5XmEfsib0cHVm1JicdQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 勾选后, 在页面上会出现一个FPS统计器, 如上图左上角.

- 暂时先不勾选"FPS meter", 不利于系统性学习

### **找到瓶颈**

- 通过前面的内容, 我们已经知道页面有性能问题, 那接下来就要开始寻找原因了.

- 了解 Summary

- 对性能进行录制完成时, 会默认在底部显示一个 Summary摘要, 显示全局信息.

  https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfvg60qxpAxVjAyLlMtviaQCRebjpjMH2K2uXEpvwbEexqvlIKIVSIicvKg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 上面展示了0~4.90s录制时间的具体耗时:

  - script, 耗时1534ms
  - rendering, 耗时2557ms
  - Painting, 耗时281ms

- 主要了解这3个耗时, 但了解这3个耗时, 对于哪有问题, 还需要进一步的排查.

### **了解 Main**

https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfvjFauuGdlLnl1w5fjkLxvTiawibEHQd6q8QERibrEL08QT3fp1xv6zhsibA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 上图红色框出部分, 就是Main, 其中每一块是每一帧中所做的事情

  https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfvcicIfPoEsqXreDcsJ4NHSjPY1lotoic66aNXpibBW85b6YvceOdNjvjpg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 目前仍看不出什么. 为了方便观看, 我们可在fps, cpu, net模块, 点击一下, 缩小时间区间:

  [data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

- 如上图所示, 通过缩小时间区间, 来实现放大Main中的内容. 现在已经能够看到, Main中展示的"火焰图", 即函数调用的堆栈. 其中:

- x轴表示时间

- y轴表示调用函数, 函数中还包含依次调用的函数, y轴只占用x轴的一个时间维度

- 识别问题, 红色三角号

  [data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

- 上图中, 可以看到Animation Frame Fired右上角有一个红色三角号, 这是Chrome自动帮助识别出有问题的部分, 就像FPS中的红色一样, 用来识别问题

  https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfvLPicsAJlOkMWwVtkiaicYlnc3y8pEDxxwq5jjEsMnG0LNwic5iavpBndJ8w/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 上图可以到提示"Warning: Recurring handler took 318.21 ms", 即重复处理程序耗时318.21ms

### **追溯问题, 定位代码问题**

- 点击Animation Frame Fired下面的"Function Call"

  https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfvuxb3dfFZH6aVe8EcDr1mV7U2pVbp7cvKV4bQ8d4YvPSz0vfcjvma1Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 如上图, 可以看到函数调用代码中的位置, 可以点击进行查看:

  https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfvI8cs3QpNIhYCtnKNZGCBuDkxWJ0jrbrTBeDFgYeiathg2BIVicfJcByw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 虽然定位到了, 是方法 update造成的问题, 但不够明确, 所以需要进一步探索

### **进一步分析问题位置**

https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfvXYIMOAkDLd5OpO4vTgickqgzqN18Ue8HhvQNkO9DjBPFeYXFlia21EQw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 继续查看Main, 可以看到app.update下面有很多"紫色"的条, 紫色条本身表示渲染. 但请注意!!!的是紫色条上还有更小的, 运用前面学过的放大功能, 调整时间区间.

  https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfvcclDf0ibn7o66chKXnf3bOEFP3frrfdDXKGo5H6HtoNL1cjp3BdybicA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 可以看到, 每个紫色条都有一个红色的小三角, 前面提到"红色三角是Chrome帮助自动识别有问题的地方", 查看提示信息: "Forced reflow is a likely performance bottleneck.", 即强制回流可能是性能瓶颈

- 点击查看摘要.

  [data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

- 可以看到, 问题定位在了 performanceTest.html的第136行, 点击查看, 能够看到是对每一个元素进行样式修改.

  [data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

- 这段代码的问题在于, 在每个动画帧中, 它会更改每个方块的样式, 然后查询页面上每个方块的位置. 由于样式发生了变化, 浏览器不知道每个方块的位置是否发生了变化, 因此必须重新布局方块以计算其位置.

- 避免这种情况的出现, 可以参考: 避免大型、复杂的布局和布局抖动

### **对比优化的效果**

https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfvUjhuXiaR9WZRkFn8z4W6SabLsQvogDhURv89SCOfVBLY1xxrghDDRYw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 可以看到, 优化后的状态, script, render的时间都大大减少了, 因此fps明显提高.性能优化知识储备
- 使用 rail 模型测量性能

### **前端巅峰公众号小编补充**

> 由于链接是gw的，这边有的人可能访问不了

### **优化思路**

### **避免强制同步布局**

https://mmbiz.qpic.cn/mmbiz_png/iawKicic66ubH4yqj2XQueEkxZicIdeyOyfvRGicNkxOZuQfbSnZz6iaP50GD2Lw0Gk7Ye4xgJju2Qszf8pwsGolTV2A/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 首先 JavaScript 运行，然后计算样式，然后布局。但是，可以使用 JavaScript 强制浏览器提前执行布局。这被称为强制同步布局。
- 要记住的第一件事是，在 JavaScript 运行时，来自上一帧的所有旧布局值是已知的，并且可供您查询。因此，如果（例如）您要在帧的开头写出一个元素（让我们称其为“框”）的高度，可能编写一些如下代码：

```
requestAnimationFrame(logBoxHeight);

function logBoxHeight() {
  // Gets the height of the box in pixels and logs it out.
  console.log(box.offsetHeight);
}
```

- 如果在请求此框的高度之前，已更改其样式，就会出现问题：

```
function logBoxHeight() {

  box.classList.add('super-big');

  // Gets the height of the box in pixels
  // and logs it out.
  console.log(box.offsetHeight);
}
```

### **避免布局抖动**

- 有一种方式会使强制同步布局甚至更糟：接二连三地执行大量这种布局。看看这个代码：

```
function resizeAllParagraphsToMatchBlockWidth() {

  // Puts the browser into a read-write-read-write cycle.
  for (var i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.width = box.offsetWidth + 'px';
  }
}
```

- 此代码循环处理一组段落，并设置每个段落的宽度以匹配一个称为“box”的元素的宽度。这看起来没有害处，但问题是循环的每次迭代读取一个样式值 (box.offsetWidth)，然后立即使用此值来更新段落的宽度 (paragraphs[i].style.width)。在循环的下次迭代时，浏览器必须考虑样式已更改这一事实，因为 offsetWidth 是上次请求的（在上一次迭代中），因此它必须应用样式更改，然后运行布局。每次迭代都将出现此问题！
- 此示例的修正方法还是先读取值，然后写入值：

```
// Read.
var width = box.offsetWidth;

function resizeAllParagraphsToMatchBlockWidth() {
  for (var i = 0; i < paragraphs.length; i++) {
    // Now write.
    paragraphs[i].style.width = width + 'px';
  }
}
```

### **特别提示**

- 这篇文章核心点有两个
  - 怎么运行时调试浏览器
  - 告诉你为什么这次会出现性能问题

### **这次出现性能问题的关键点：读取了dom的offsetWidth、offsetTop等属性，会造成浏览器强制更新渲染队列并且重排-重绘**



