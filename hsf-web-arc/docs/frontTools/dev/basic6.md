---
title: Loading 制作方案
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

## **简介**

Loading几乎是每个应用都会用到的一个组件。很多组件库都会提供相应的Loading组件，但是有的时候我们可能**需要自定义Loading效果**，掌握Loading组件制作的基础知识将变得非常必要。Loading主要就是**一个旋转的圆环**，而旋转部分则比较简单，直接通过CSS动画即可实现，所以**关键部分就是得到Loading的圆环**。

## **一、通过border-radius绘制圆环**

我们通常让一个元素变成圆形是先**将一个元素设置为长和宽相等的正方形**，然后**给这个元素设置一个border-radius值为50%**。需要注意的是，**border-radius: 50%是让整个正方形元素都变成圆形**，即**包括边框和内容区**。所以我们可以通过**控制元素边框和内容区的大小**，**将元素的内容区域作为内圆**，**将元素的边框区域作为外圆**，从而绘制出一个圆环。

```
<div class="loading-css"></div>
.loading-css {
    width: 50px; /*先将loading区域变成正方形*/
    height: 50px;
    display: inline-block; /*将loading区域变成行内元素，防止旋转的时候，100%宽度都在旋转*/
    border: 3px solid#f3f3f3; /*设置四周边框大小，并将颜色设置为浅白色*/
    border-top: 3px solid red; /*将上边框颜色设置为红色高亮，以便旋转的时候能够看到旋转的效果*/
    border-radius: 50%; /*将边框和内容区域都变成圆形*/
}
```

此时效果如下:

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHpA6Sjz1YcP4f5qfPrSnNP9d0yqibamgV7eMKqomxZRo6vl5iaT0xZEWhlaQHR5F4l5VibEyfPT9YnKQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

圆环效果已经出来了，接下来让圆环旋转起来即可，如:

```
@keyframes loading-360 {
    0% {
        transform: rotate(0deg); /*动画起始的时候旋转了0度*/
    }
    100% {
        transform: rotate(360deg); /*动画结束的时候旋转了360度*/
    }
}
.loading-css { /*在之前的CSS中加上动画效果即可*/
    animation: loading-360 0.8s infinite linear; /*给圆环添加旋转360度的动画，并且是无限次*/
}
```

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHpA6Sjz1YcP4f5qfPrSnNP9XAzU6lngF8rafQOQTRsrHOTpnDb9R5TiacicSAAQfgdZook0vlic77ibNQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

## **二、通过svg来绘制圆环**

SVG 意为**可缩放矢量图形**（**Scalable Vector Graphics**），其**使用 XML 格式定义图像**，**<circle> 标签可用来创建一个圆**，同时**外面必须嵌套一个<svg>标签**。

```
<svg viewBox="0 0 50 50" class="loading-svg">
    <circle cx="25" cy="25" r="20" fill="none" class="path"></circle>
</svg>
.loading-svg {
    width: 50px; /*设置svg显示区域大小*/
    height: 50px;
}
```

<svg>标签的width和height设置的是svg图形可显示区域大小。而viewBox表示的是截取图形的区域，因为矢量图的绘制区域可以是无限大的，具体绘制在哪里根据具体的设置而定，比如上面的circle就绘制在圆心坐标为(25,25)，半径为20的圆形区域中，而viewBox设置为0 0 50 50，表示截图区域为左上角坐标为(0, 0)，右下角坐标为(50,50)的矩形区域内，即会截取这个区域内的矢量图，然后将截取的矢量图放到svg的可显示区域内，同时会根据svg可显示区域的大小等比例进行缩放，但是截取的图片必须在svg可显示区域内完整显示。假如，现在讲svg的大小设置为60px，如:

```
.loading-svg {
    width: 60px; /*设置svg显示区域大小*/
    height: 60px;
}
```

如上分析，viewBox截图区域中，**绘制的圆的圆心正好在截图区域的中心**，所以截图区域四周边框与绘制的圆之间有5px的距离，而圆的半径为20px，所以**比例为1:4**，现在将svg显示区域变为60px，所以也需要**将截图区域等比例放大并占满整个svg显示区域**，截图区域经过拉伸后，**圆心位置变为了(30,30)**，即半径变为了30，按1:4比例，半径变为24，外围变为了6，所以整个圆也会跟着变大。

需要注意的时候，**<cicle>绘制的圆目前是看不到的**，因为**没有给画笔设置上颜色**，如:

```
.path {
    stroke:#409eff; /*给画笔设置一个颜色*/
    stroke-width: 2; /*设置线条的宽度*/
}
```

https://mmbiz.qpic.cn/mmbiz_png/qkxhvoHGVKBZ4ZlaJdURCU7EmqhvoZJwyMfZibR8THiapluyibQj1ibs2Zicy0lIca626actwG3KBJz5qc1nvtAajCA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

此时可以看到绘制出的圆环了。为了给圆环添加转动效果，我们需要绘制带缺口的圆环，后面通过改变缺口的位置大小来实现转动效果，如:

```
.path {
    stroke-dasharray: 95, 126; /*设置实现长95，虚线长126*/
    stroke-dashoffset: 0; /*设置虚线的偏移位置*/
}
```

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

如图所示，圆环的绘制起点是**在水平方向最右边的那个点**，然后进行**顺时针**绘制。因为该圆环的周长为2_3.14_20=125.6，约等于126，stroke-dasharray设置了实线(可见部分)长为95，约等于圆的3/4，所以只能绘制到圆环的最高点位置，接下来是126的虚线，但是**圆环周长只有126**，所以**只能显示31的虚线**。可以看做是一根**无限循环的水平线条**，实线(-221,0)---虚线(-126,0)---**目前起点为(0,0)**---实线(95,0)---虚线(221,0)---实线(316,0)，然后**让水平线的起点(0,0)位置与圆环的起点位置重合**，**水平线顺时针沿着圆环绕**即可，**随着stroke-dashoffset起点位置的偏移**，**左侧的(-126,0)的虚线就可以慢慢显示出来**。当stroke-dashoffset值为**负数**的时候，**上面的线往右拉**，当stroke-dashoffset值为**正数**的时候，**下面的线往右拉**。

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHpA6Sjz1YcP4f5qfPrSnNP9PR907jXy1tbbQxPFkXzveEMUEDYsgTZHqJ0BpcX1SIVVEQ6JiaGSicjg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

接下来就是添加圆环的转动效果，分别设置三个动画状态，如:

```
// 0%
{
    stroke-dasharray: 1, 126; /*实线部分1，虚线部分126*/
    stroke-dashoffset: 0; /*前面1/126显示实线，后面125显示空白*/
}
```

从圆环最右边作为起点绘制1个像素的距离的实线，接下来绘制126像素的虚线(空白)，因为圆周长为126，所以剩余部分全部为空白，如图所示，

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHpA6Sjz1YcP4f5qfPrSnNP9f4iaAUQ3ibfia6YVupkUwheM11QufhsEDU9v4jpqstcxEW7IKxsyZfdHw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

```
// 50%
{
    stroke-dasharray: 95, 126; /*实线部分95，虚线部分126*/
    stroke-dashoffset: -31px; /*顺时针偏移31/126，即前31/126显示空白，后面3/4显示线条*/
}
```

从圆环的最右边作为起点，并且顺时针移动31像素，即圆环的1/4，所以实线起点变为了圆环的最底部，实线长度为95像素，即圆环的3/4，如图所示，

https://mmbiz.qpic.cn/mmbiz_png/qkxhvoHGVKBZ4ZlaJdURCU7EmqhvoZJwwnibbqNlN2IX8f69oNyKgMHLEVZicxSUtrUdMX4d8ic1qxQSy7q4dcusA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

```
// 100%
{
    stroke-dasharray: 6, 120; /*实线部分6，虚线部分120*/
    stroke-dashoffset: -120px; /*最后顺时针偏移120/126，即前120/126显示空白，后面6点显示线条部分*/
}
```

从圆环的最右边作为起点，并且顺时针移动120像素，所以实线长度仅剩下6像素了，如图所示，

https://mmbiz.qpic.cn/mmbiz_png/qkxhvoHGVKBZ4ZlaJdURCU7EmqhvoZJwJ5JjCaLaGVDg5uyRO6tRSQdoAFO8PUh6H2ib0I1Itqg88BicMPJsJm5g/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

给圆环加上动画效果，如:

```
.path {
    animation: loading-dash 1.5s ease-in-out infinite;
}
@keyframes loading-dash {
    0% {
        stroke-dasharray: 1, 126; /*实线部分1，虚线部分126*/
        stroke-dashoffset: 0; /*前面1/126显示实线，后面125显示空白*/
    }

    50% {
        stroke-dasharray: 95, 126; /*实线部分95，虚线部分126*/
        stroke-dashoffset: -31px /*顺时针偏移31/126，即前31/126显示空白，后面3/4显示线条*/
    }

    to {
        stroke-dasharray: 6, 120; /*实线部分6，虚线部分120*/
        stroke-dashoffset: -120px; /*最后顺时针偏移120/126，即前120/126显示空白，后面6点显示线条部分*/
    }
}
```

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

为了让Loading动画更加生动细腻，我们还可以给svg标签也加上一个旋转动画，如:

```
.loading-svg {
    width: 50px; /*设置svg显示区域大小*/
    height: 50px;
    animation: loading-rotate 1.5s infinite ease-in-out; /*给svg也加上一个旋转动画*/
}
@keyframes loading-rotate {
    to {
        transform: rotate(1turn); // 旋转1圈
    }
}
```

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

## **三、通过iconfont字体图标**

我们可以直接**通过iconfont字体图标代替圆环的绘制**，**直接以字体的形式显示出圆环**，然后给其加上旋转动画即可，如：我们可以在iconfont网站上下载喜欢的Loading图案。字体图标下载后，**将解压后的内容拷贝到项目中**，并**引入其中的iconfont.css到页面中**，**给要显示字体图标的元素加上iconfont类样式**，字体图标会有一个对应的unicode编码，**通过::before设置content为该unicode编码即可显示对应的字体图标了**，或者直接在unicode码前加上\&#x，并作为元素内容。

```
<link rel="stylesheet" href="icon/iconfont.css">
<style>
.icon-loading {
    display: inline-block; /*需要设置为行内块元素动画才会生效*/
    font-size: 56px;
    color: grey;
}
.icon-loading::before {
    content: "\\e65b"; /*显示字体图内容，值为\\unicode*/
}
</style>
<i class="icon-loading iconfont"></i>
<!--或者-->
<i class="iconfont">&#xe65b</i><!--值为&#xunicode-->
```

https://mmbiz.qpic.cn/mmbiz_png/qkxhvoHGVKBZ4ZlaJdURCU7EmqhvoZJwg89T1R8sibAOunENK3jZF4zpYSDTmcVpoN7AuIibia2wcEQ5W4FZhwGxA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

接下来让字体图标旋转起来即可，如:

```
.icon-loading {
    animation: rotating 2s infinite linear;
}
@keyframes rotating {
    0% {
        transform: rotate(0deg) /*动画起始位置为旋转0度*/
    }

    to {
        transform: rotate(1turn) /*动画结束位置为旋转1圈*/
    }
}
```

https://mmbiz.qpic.cn/mmbiz_gif/qkxhvoHGVKBZ4ZlaJdURCU7EmqhvoZJwvMkugMmQJPbicz8d70DLqGqv1cnQclO21rOflPCgqmAk1t1roiaB3Bfw/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1



