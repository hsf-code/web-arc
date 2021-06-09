---
title: html+css（一）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

### 1、前端的SEO

- 合理的 title 、 description 、 keywords ：搜索对着三项的权重逐个减⼩， title 值强调重点即可，重要关键词出现不要超过2次，⽽且要靠前，不同⻚⾯ title 要有所不 同； description 把⻚⾯内容⾼度概括，⻓度合适，不可过分堆砌关键词，不同⻚⾯ description 有所不同； keywords 列举出重要关键词即可 ；
- 语义化的 HTML 代码，符合W3C规范：语义化代码让搜索引擎容易理解⽹⻚ ，例如：一些标签（<h1></h1> <head></head>）等等；
- 重要内容 HTML 代码放在最前：搜索引擎抓取 HTML 顺序是从上到下，有的搜索引擎对抓 取⻓度有限制，保证重要内容⼀定会被抓取 ；
- 重要内容不要⽤ js 输出：爬⾍不会执⾏js获取内容 ，个人理解是搜索引擎的爬虫只是针对网页的静态标签的内容进行爬取，对于一些未知的动态内容，则无效；
- 少⽤ iframe ：搜索引擎不会抓取 iframe 中的内容，对于这个开启了一个窗口，不会被爬取； 
- ⾮装饰性图⽚必须加 alt ，对于alt的作用是：这是对此坑位的图片的展示内容进行一个详细的描述，当一些屏幕的阅读器就可以方便的读取该图片的内容；
- 提⾼⽹站速度：⽹站速度是搜索引擎排序的⼀个重要指标；

### 2、从浏览器地址栏输⼊url到显示⻚⾯的步骤

##### 基础版本 

1. 浏览器根据请求的 URL 交给 DNS 域名解析，找到真实 IP ，向服务器发起请求； 
2. 服务器交给后台处理完成后返回数据，浏览器接收⽂件（ HTML、JS、CSS 、图象等）； 
3. 浏览器对加载到的资源（ HTML、JS、CSS 等）进⾏语法解析，建⽴相应的内部数据结构 （如 HTML 的 DOM ）； 
4. 载⼊解析到的资源⽂件，渲染⻚⾯，完成。 

##### 详细版 

1. 在浏览器地址栏输⼊URL 

2. 浏览器查看缓存，如果请求资源在缓存中并且新鲜，跳转到转码步骤 

   1. 如果资源未缓存，发起新请求 

   2. 如果已缓存，检验是否⾜够新鲜，⾜够新鲜直接提供给客户端，否则与服务器进⾏验 证。 

   3. 检验新鲜通常有两个HTTP头进⾏控制 Expires 和 Cache-Control ： 

      ​	1、HTTP1.0提供Expires，值为⼀个绝对时间表示缓存新鲜⽇期 

      ​	2、HTTP1.1增加了Cache-Control: max-age=,值为以秒为单位的最⼤新鲜时间

3. 浏览器解析URL获取协议，主机，端⼝，path 

4. 浏览器组装⼀个HTTP（GET）请求报⽂ 

5. 浏览器获取主机ip地址，过程如下： 

   	1. 浏览器缓存 
    	2. 本机缓存 
    	3. hosts⽂件 
    	4. 路由器缓存 
    	5. ISP DNS缓存 
    	6. DNS递归查询（可能存在负载均衡导致每次IP不⼀样）

6. 打开⼀个socket与⽬标IP地址，端⼝建⽴TCP链接，三次握⼿如下： 

   		1. 客户端发送⼀个TCP的SYN=1，Seq=X的包到服务器端⼝ 
     		2. 服务器发回SYN=1， ACK=X+1， Seq=Y的响应包 
     		3. 客户端发送ACK=Y+1， Seq=Z 

7. TCP链接建⽴后发送HTTP请求 

8. 服务器接受请求并解析，将请求转发到服务程序，如虚拟主机使⽤HTTP Host头部判断请求的服务程序 

9. 服务器检查HTTP请求头是否包含缓存验证信息如果验证缓存新鲜，返回304等对应状态码 

10. 处理程序读取完整请求并准备HTTP响应，可能需要查询数据库等操作 

11. 服务器将响应报⽂通过TCP连接发送回浏览器

12. 浏览器接收HTTP响应，然后根据情况选择关闭TCP连接或者保留重⽤，关闭TCP连接的四 次握⼿如下： 

    	1. 主动⽅发送Fin=1， Ack=Z， Seq= X报⽂ 
     	2. 被动⽅发送ACK=X+1， Seq=Z报⽂ 
     	3. 被动⽅发送Fin=1， ACK=X， Seq=Y报⽂ 
     	4. 主动⽅发送ACK=Y， Seq=X报⽂ 

13. 浏览器检查响应状态吗：是否为1XX，3XX， 4XX， 5XX，这些情况处理与2XX不同 

14. 如果资源可缓存，进⾏缓存 

15. 对响应进⾏解码（例如gzip压缩）

16. 根据资源类型决定如何处理（假设资源为HTML⽂档）

17. 解析HTML⽂档，构件DOM树，下载资源，构造CSSOM树，执⾏js脚本，这些操作没有严 格的先后顺序，以下分别解释 

18. 构建DOM树：

    	 1. Tokenizing：根据HTML规范将字符流解析为标记
      	 2. Lexing：词法分析将标记转换为对象并定义属性和规则
      	 3. DOM construction：根据HTML标记关系将对象组成DOM树 

19. 解析过程中遇到图⽚、样式表、js⽂件，启动下载

20. 构建CSSOM树： 

    	1. Tokenizing：字符流转换为标记流 
     	2. Node：根据标记创建节点
     	3. CSSOM：节点创建CSSOM树 

21. 根据DOM树和CSSOM树构建渲染树 : 

     1. 从DOM树的根节点遍历所有可⻅节点，不可⻅节点包括：

        1） script , meta 这样本身 不可⻅的标签。

        2)被css隐藏的节点，如 display: none

     2. 对每⼀个可⻅节点，找到恰当的CSSOM规则并应⽤ 

     3. 发布可视节点的内容和计算样式 

22. js解析如下： 

    	1. 浏览器创建Document对象并解析HTML，将解析到的元素和⽂本节点添加到⽂档中，此 时document.readystate为loading 
     	2. HTML解析器遇到没有async和defer的script时，将他们添加到⽂档中，然后执⾏⾏内 或外部脚本。这些脚本会同步执⾏，并且在脚本下载和执⾏时解析器会暂停。这样就可 以⽤document.write()把⽂本插⼊到输⼊流中。同步脚本经常简单定义函数和注册事件 处理程序，他们可以遍历和操作script和他们之前的⽂档内容 
     	3. 当解析器遇到设置了async属性的script时，开始下载脚本并继续解析⽂档。脚本会在它 下载完成后尽快执⾏，但是解析器不会停下来等它下载。异步脚本禁⽌使⽤ document.write()，它们可以访问⾃⼰script和之前的⽂档元素 
     	4. 当⽂档完成解析，document.readState变成interactive
     	5. 所有defer脚本会按照在⽂档出现的顺序执⾏，延迟脚本能访问完整⽂档树，禁⽌使⽤ document.write()
     	6. 浏览器在Document对象上触发DOMContentLoaded事件
     	7. 此时⽂档完全解析完成，浏览器可能还在等待如图⽚等内容加载，等这些内容完成载⼊ 并且所有异步脚本完成载⼊和执⾏，document.readState变为complete，window触发 load事件 

23. 显示⻚⾯（HTML解析过程中会逐步显示⻚⾯） 详细简版:

    	1. 从浏览器接收 url 到开启⽹络请求线程（这⼀部分可以展开浏览器的机制以及进程与线程 之间的关系） 
     	2. 开启⽹络线程到发出⼀个完整的 HTTP 请求（这⼀部分涉及到dns查询， TCP/IP 请求， 五层因特⽹协议栈等知识）
     	3. 从服务器接收到请求到对应后台接收到请求（这⼀部分可能涉及到负载均衡，安全拦截以 及后台内部的处理等等）
     	4. 后台和前台的 HTTP 交互（这⼀部分包括 HTTP 头部、响应码、报⽂结构、 cookie 等知 识，可以提下静态资源的 cookie 优化，以及编码解码，如 gzip 压缩等）
     	5. 单独拎出来的缓存问题， HTTP 的缓存（这部分包括http缓存头部， ETag ， catchcontrol 等） 
     	6. 浏览器接收到 HTTP 数据包后的解析流程（解析 html -词法分析然后解析成 dom 树、解 析 css ⽣成 css 规则树、合并成 render 树，然后 layout 、 painting 渲染、复合图层的合成、 GPU 绘制、外链资源的处理、 loaded 和 DOMContentLoaded 等） 
     	7. CSS 的可视化格式模型（元素的渲染规则，如包含块，控制框， BFC ， IFC 等概念）
     	8. JS 引擎解析过程（ JS 的解释阶段，预处理阶段，执⾏阶段⽣成执⾏上下⽂， VO ，作⽤域链、回收机制等等） 
     	9. 其它（可以拓展不同的知识模块，如跨域，web安全， hybrid 模式等等内容



### 3、网站性能优化

- content ⽅⾯ 

  减少 HTTP 请求：合并⽂件、 CSS 精灵、 inline Image 

  减少 DNS 查询： DNS 缓存、将资源分布到恰当数量的主机名 

  减少 DOM 元素数量 

- Server ⽅⾯ 

  使⽤ CDN 

  配置 ETag 

  对组件使⽤ Gzip 压缩 

- Cookie ⽅⾯ 

  减⼩ cookie ⼤⼩ 

- css ⽅⾯ 

  将样式表放到⻚⾯顶部 

  不使⽤ CSS 表达式 使⽤`<link>`不使⽤ @import 

- Javascript ⽅⾯ 

  将脚本放到⻚⾯底部 

  将 javascript 和 css 从外部引⼊ 

  压缩 javascript 和 css 

  删除不需要的脚本 

  减少 DOM 访问 

- 图⽚⽅⾯ 

  优化图⽚：根据实际颜⾊需要选择⾊深、压缩 

  优化 css 精灵 

  不要在 HTML 中拉伸图⽚

### 4、HTTP状态码及其含义

1、1XX ：信息状态码 

- ​		100 Continue 继续，⼀般在发送 post 请求时，已发送了 http header 之后服务端 将返回此信息，表示确认，之后发送具体参数信息 

2、2XX ：成功状态码 

- ​		200 OK 正常返回信息 
- ​		201 Created 请求成功并且服务器创建了新的资源 
- ​		202 Accepted 服务器已接受请求，但尚未处理 

3、3XX ：重定向 

- ​		301 Moved Permanently 请求的⽹⻚已永久移动到新位置。 
- ​		302 Found 临时性重定向。 
- ​		303 See Other 临时性重定向，且总是使⽤ GET 请求新的 URI 。 
- ​		304 Not Modified ⾃从上次请求后，请求的⽹⻚未修改过。 

4、4XX ：客户端错误 

- ​		400 Bad Request 服务器⽆法理解请求的格式，客户端不应当尝试再次使⽤相同的内 容发起请求。 
- ​		401 Unauthorized 请求未授权。 
- ​		403 Forbidden 禁⽌访问。 
- ​		404 Not Found 找不到如何与 URI 相匹配的资源。 

5、5XX: 服务器错误 

- ​		500 Internal Server Error 最常⻅的服务器端错误。 
- ​		503 Service Unavailable 服务器端暂时⽆法处理请求（可能是过载或维护）。



### 5、请描述⼀下 cookies ， sessionStorage 和 localStorage 的区别？

1、cookie 是⽹站为了标示⽤户身份⽽储存在⽤户本地终端（Client Side）上的数据（通常 经过加密） 

2、cookie数据始终在同源的http请求中携带（即使不需要），记会在浏览器和服务器间来回 传递 

3、sessionStorage 和 localStorage 不会⾃动把数据发给服务器，仅在本地保存 

4、存储⼤⼩： 

- cookie 数据⼤⼩不能超过4k 
- sessionStorage 和 localStorage 虽然也有存储⼤⼩的限制，但⽐ cookie ⼤得 多，可以达到5M或更⼤ 

5、有期时间： 

- localStorage 存储持久数据，浏览器关闭后数据不丢失除⾮主动删除数据 
- sessionStorage 数据在当前浏览器窗⼝关闭后⾃动删除 
- cookie 设置的 cookie 过期时间之前⼀直有效，即使窗⼝或浏览器关闭

### 6、iframe有那些缺点？

- iframe 会阻塞主⻚⾯的 Onload 事件 
- 搜索引擎的检索程序⽆法解读这种⻚⾯，不利于 SEO 
- iframe 和主⻚⾯共享连接池，⽽浏览器对相同域的连接有限制，所以会影响⻚⾯的并⾏ 加载 
- 使⽤ iframe 之前需要考虑这两个缺点。如果需要使⽤ iframe ，最好是通过 javascript 动态给 iframe 添加 src 属性值，这样可以绕开以上两个问题

### 7、 Doctype作⽤? 严格模式与混杂模式如何区分？它们有何意义?

- ⻚⾯被加载的时， link 会同时被加载，⽽ @imort ⻚⾯被加载的时， link 会同时被加载，⽽ @import 引⽤的 CSS 会等到⻚⾯被加载完再加载， import 只在 IE5 以上才能识 别，⽽ link 是 XHTML标签，⽆兼容问题， link ⽅式的样式的权重⾼于 @import 的权重 
- `<!DOCTYPE>`声明位于⽂档中的最前⾯，处于 `<html>` 标签之前。告知浏览器的解析器， ⽤什么⽂档类型 规范来解析这个⽂档 
- 严格模式的排版和 JS 运作模式是 以该浏览器⽀持的最⾼标准运⾏ 
- 在混杂模式中，⻚⾯以宽松的向后兼容的⽅式显示。模拟⽼式浏览器的⾏为以防⽌站点⽆ 法⼯作。 DOCTYPE 不存在或格式不正确会导致⽂档以混杂模式呈现

### 8、 HTML全局属性(global attribute)有哪些

- class :为元素设置类标识 
- data-* : 为元素增加⾃定义属性 
- draggable : 设置元素是否可拖拽 
- id : 元素 id ，⽂档内唯⼀ 
- lang : 元素内容的的语⾔ 
- style : ⾏内 css 样式 
- title : 元素相关的建议信息

### 9、Canvas和SVG有什么区别？

- svg 绘制出来的每⼀个图形的元素都是独⽴的 DOM 节点，能够⽅便的绑定事件或⽤来修 改。 canvas 输出的是⼀整幅画布
- svg 输出的图形是⽮量图形，后期可以修改参数来⾃由放⼤缩⼩，不会失真和锯⻮。⽽ canvas 输出标量画布，就像⼀张图⽚⼀样，放⼤会失真或者锯⻮

### 10、 HTML5 为什么只需要写 `<!DOCTYPE HTML>`

- HTML5 不基于 SGML ，因此不需要对 DTD 进⾏引⽤，但是需要 doctype 来规范浏览器 的⾏为 
- ⽽ HTML4.01 基于 SGML ,所以需要对 DTD 进⾏引⽤，才能告知浏览器⽂档所使⽤的⽂档 类型

### 11、viewport

```html
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimu
 // width 设置viewport宽度，为⼀个正整数，或字符串‘device-width’
 // device-width 设备宽度
 // height 设置viewport⾼度，⼀般设置了宽度，会⾃动解析出⾼度，可以不⽤设置
 // initial-scale 默认缩放⽐例（初始缩放⽐例），为⼀个数字，可以带⼩数
 // minimum-scale 允许⽤户最⼩缩放⽐例，为⼀个数字，可以带⼩数
 // maximum-scale 允许⽤户最⼤缩放⽐例，为⼀个数字，可以带⼩数
 // user-scalable 是否允许⼿动缩放
```

延伸提问 

​	怎样处理 移动端 1px 被 渲染成 2px 问题

###### 局部处理 

- mate 标签中的 viewport 属性 ， initial-scale 设置为 1 
- rem 按照设计稿标准⾛，外加利⽤ transfrome 的 scale(0.5) 缩⼩⼀倍即可；

###### 全局处理 

- mate 标签中的 viewport 属性 ， initial-scale 设置为 0.5 
- rem 按照设计稿标准⾛即可

### 12、meta viewport相关

```html
<!DOCTYPE html> <!--H5标准声明，使⽤ HTML5 doctype，不区分⼤⼩写-->
<head lang=”en”> <!--标准的 lang 属性写法-->
<meta charset=’utf-8′> <!--声明⽂档使⽤的字符编码-->
<meta http-equiv=”X-UA-Compatible” content=”IE=edge,chrome=1″/> <!--优先使
<meta name=”description” content=”不超过150个字符”/> <!--⻚⾯描述-->
<meta name=”keywords” content=””/> <!-- ⻚⾯关键词-->
<meta name=”author” content=”name, email@gmail.com”/> <!--⽹⻚作者-->
<meta name=”robots” content=”index,follow”/> <!--搜索引擎抓取-->
<meta name=”viewport” content=”initial-scale=1, maximum-scale=3, minimum-sc
<meta name=”apple-mobile-web-app-title” content=”标题”> <!--iOS 设备 begin-->
<meta name=”apple-mobile-web-app-capable” content=”yes”/> <!--添加到主屏后的标
是否启⽤ WebApp 全屏模式，删除苹果默认的⼯具栏和菜单栏-->
<meta name=”apple-itunes-app” content=”app-id=myAppStoreID, affiliate-data=
<!--添加智能 App ⼴告条 Smart App Banner（iOS 6+ Safari）-->
<meta name=”apple-mobile-web-app-status-bar-style” content=”black”/>
<meta name=”format-detection” content=”telphone=no, email=no”/> <!--设置苹果
<meta name=”renderer” content=”webkit”> <!-- 启⽤360浏览器的极速模式(webkit)-->
<meta http-equiv=”X-UA-Compatible” content=”IE=edge”> <!--避免IE使⽤兼容模
<meta http-equiv=”Cache-Control” content=”no-siteapp” /> <!--不让百度转码-
<meta name=”HandheldFriendly” content=”true”> <!--针对⼿持设备优化，主要是针
<meta name=”MobileOptimized” content=”320″> <!--微软的⽼式浏览器-->
<meta name=”screen-orientation” content=”portrait”> <!--uc强制竖屏-->
<meta name=”x5-orientation” content=”portrait”> <!--QQ强制竖屏-->
<meta name=”full-screen” content=”yes”> <!--UC强制全屏-->
<meta name=”x5-fullscreen” content=”true”> <!--QQ强制全屏-->
<meta name=”browsermode” content=”application”> <!--UC应⽤模式-->
<meta name=”x5-page-mode” content=”app”> <!-- QQ应⽤模式-->
<meta name=”msapplication-tap-highlight” content=”no”> <!--windows phone
设置⻚⾯不缓存-->
<meta http-equiv=”pragma” content=”no-cache”>
<meta http-equiv=”cache-control” content=”no-cache”>
<meta http-equiv=”expires” content=”0″>
```

### 13、渲染优化

1、禁⽌使⽤ iframe （阻塞⽗⽂档 onload 事件） 

- iframe 会阻塞主⻚⾯的 Onload 事件 
- 搜索引擎的检索程序⽆法解读这种⻚⾯，不利于SEO 
- iframe 和主⻚⾯共享连接池，⽽浏览器对相同域的连接有限制，所以会影响⻚⾯的并 ⾏加载 
- 使⽤ iframe 之前需要考虑这两个缺点。如果需要使⽤ iframe ，最好是通过 javascript 
- 动态给 iframe 添加 src 属性值，这样可以绕开以上两个问题 

2、禁⽌使⽤ gif 图⽚实现 loading 效果（降低 CPU 消耗，提升渲染性能） 

3、使⽤ CSS3 代码代替 JS 动画（尽可能避免重绘重排以及回流） 

3、对于⼀些⼩图标，可以使⽤base64位编码，以减少⽹络请求。但不建议⼤图使⽤，⽐较耗 费 CPU 

​	⼩图标优势在于 

​			减少 HTTP 请求 

​			避免⽂件跨域 

​			修改及时⽣效 

4、⻚⾯头部的 `<style></style>` `<script></script>`  会阻塞⻚⾯；（因为 Renderer 进程中 JS 线程和渲染线程是互斥的） 

5、⻚⾯中空的 href 和 src 会阻塞⻚⾯其他资源的加载 (阻塞下载进程) 

6、⽹⻚ gzip ， CDN 托管， data 缓存 ，图⽚服务器 

7、前端模板 JS+数据，减少由于 HTML 标签导致的带宽浪费，前端⽤变量保存AJAX请求结 果，每次操作本地变量，不⽤请求，减少请求次数 

8、⽤ innerHTML 代替 DOM 操作，减少 DOM 操作次数，优化 javascript 性能 

9、当需要设置的样式很多时设置 className ⽽不是直接操作 style 

10、少⽤全局变量、缓存 DOM 节点查找的结果。减少 IO 读取操作 

11、图⽚预加载，将样式表放在顶部，将脚本放在底部 加上时间戳 

12、对普通的⽹站有⼀个统⼀的思路，就是尽量向前端优化、减少数据库操作、减少磁盘 IO

### 14、为什么利⽤多个域名来存储⽹站资源会更有效？

1. CDN 缓存更⽅便 
2. 突破浏览器并发限制 
3. 节约 cookie 带宽 
4. 节约主域名的连接数，
5. 优化⻚⾯响应速度 
6. 防⽌不必要的安全问题

### 15、简述⼀下src与href的区别

```
1、src ⽤于替换当前元素，href⽤于在当前⽂档和引⽤资源之间确⽴联系。
2、src 是 source 的缩写，指向外部资源的位置，指向的内容将会嵌⼊到⽂档中当前标签所
在位置；在请求 src 资源时会将其指向的资源下载并应⽤到⽂档内，例如 js 脚本，
img 图⽚和 frame 等元素
3、<script src ="js.js"></script> 当浏览器解析到该元素时，会暂停其他
资源的下载和处理，直到将该资源加载、编译、执⾏完毕，图⽚和框架等元素
也如此，类似于将所指向资源嵌⼊当前标签内。这也是为什么将js脚本放在底
部⽽不是头部
4、href 是 Hypertext Reference 的缩写，指向⽹络资源所在位置，建⽴和当前元素（锚
点）或当前⽂档（链接）之间的链接，如果我们在⽂档中添加
5、<link href="common.css" rel="stylesheet"/> 那么浏览器会识别该⽂档为 css ⽂
件，就会并⾏下载资源并且不会停⽌对当前⽂档的处理。这也是为什么建议使⽤ link ⽅
式来加载 css ，⽽不是使⽤ @import ⽅式
```

### 16、优化图片的加载

- 图⽚懒加载，在⻚⾯上的未可视区域可以添加⼀个滚动事件，判断图⽚位置与浏览器顶端 的距离与⻚⾯的距离，如果前者⼩于后者，优先加载。
- 如果为幻灯⽚、相册等，可以使⽤图⽚预加载技术，将当前展示图⽚的前⼀张和后⼀张优 先下载。 
- 如果图⽚为css图⽚，可以使⽤ CSSsprite ， SVGsprite ， Iconfont 、 Base64 等技 术。 
- 如果图⽚过⼤，可以使⽤特殊编码的图⽚，加载时会先加载⼀张压缩的特别厉害的缩略 图，以提⾼⽤户体验。 
- 如果图⽚展示区域⼩于图⽚的真实⼤⼩，则因在服务器端根据业务需要先⾏进⾏图⽚压 缩，图⽚压缩后⼤⼩与展示⼀致。

### 17、 HTTP request 和 response报⽂结构

```http
1. ⾸⾏是Request-Line包括：请求⽅法，请求URI，协议版本，CRLF
2. ⾸⾏之后是若⼲⾏请求头，包括general-header，request-header或者entity-header，
每个⼀⾏以CRLF结束
3. 请求头和消息实体之间有⼀个CRLF分隔
GET /Protocols/rfc2616/rfc2616-sec5.html HTTP/1.1
Host: www.w3.org
Connection: keep-alive
Cache-Control: max-age=0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML,
Referer: https://www.google.com.hk/
Accept-Encoding: gzip,deflate,sdch
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6
Cookie: authorstyle=yes
If-None-Match: "2cc8-3e3073913b100"
If-Modified-Since: Wed, 01 Sep 2004 13:24:52 GMT
name=qiu&age=25

1、⾸⾏是状态⾏包括：HTTP版本，状态码，状态描述，后⾯跟⼀个CRLF
2、⾸⾏之后是若⼲⾏响应头，包括：通⽤头部，响应头部，实体头部
3、响应头部和响应实体之间⽤⼀个CRLF空⾏分隔

HTTP/1.1 200 OK
Date: Tue, 08 Jul 2014 05:28:43 GMT
Server: Apache/2
Last-Modified: Wed, 01 Sep 2004 13:24:52 GMT
ETag: "40d7-3e3073913b100"
Accept-Ranges: bytes
Content-Length: 16599
Cache-Control: max-age=21600
Expires: Tue, 08 Jul 2014 11:28:43 GMT
P3P: policyref="http://www.w3.org/2001/05/P3P/p3p.xml"
Content-Type: text/html; charset=iso-8859-1
{"name": "qiu", "age": 25}
```

## CSS部分

### 1、display: none; 与 visibility: hidden; 的区别

联系：它们都能让元素不可⻅ 

区别： 

- display:none ;会让元素完全从渲染树中消失，渲染的时候不占据任何空间； visibility: hidden ;不会让元素从渲染树消失，渲染师元素继续占据空间，只是内 容不可⻅ 
- display: none ;是⾮继承属性，⼦孙节点消失由于元素从渲染树消失造成，通过修改 ⼦孙节点属性⽆法显示 ；visibility: hidden; 是继承属性，⼦孙节点消失由于继承 了 hidden ，通过设置 visibility: visible; 可以让⼦孙节点显式 
- 修改常规流中元素的 display 通常会造成⽂档重排。修改 visibility 属性只会造成 本元素的重绘。 
- 读屏器不会读取 display: none ;元素内容；会读取 visibility: hidden; 元素内容



### 2、link 与 @import 的区别

1. link 是 HTML ⽅式， @import 是CSS⽅式
2. link 最⼤限度⽀持并⾏下载， @import 过多嵌套导致串⾏下载，出现 FOUC (⽂档样式 短暂失效)
3. link 可以通过 rel="alternate stylesheet" 指定候选样式
4. 浏览器对 link ⽀持早于 @import ，可以使⽤ @import 对⽼浏览器隐藏样式
5. @import 必须在样式规则之前，可以在css⽂件中引⽤其他⽂件
6. 总体来说： link 优于 @import



### 3、如何创建块级格式化上下⽂(block formatting context),BFC有什么用

创建规则： 

- 根元素 
- 浮动元素（ float 不取值为 none ） 
- 绝对定位元素（ position 取值为 absolute 或 fixed ） display 取值为 inline-block 、 table-cell 、 table-caption 、 flex 、 inline-flex 之⼀的元素 
- overflow 不取值为 visible 的元素

作⽤： 

- 可以包含浮动元素 
- 不被浮动元素覆盖 
- 阻⽌⽗⼦元素的 margin 折叠



### 4、display、float、position的关系

- 如果 display 取值为 none ，那么 position 和 float 都不起作⽤，这种情况下元素不 产⽣框 
- 否则，如果 position 取值为 absolute 或者 fixed ，框就是绝对定位的， float 的计 算值为 none ， display 根据下⾯的表格进⾏调整。 
- 否则，如果 float 不是 none ，框是浮动的， display 根据下表进⾏调整 
- 否则，如果元素是根元素， display 根据下表进⾏调整 其他情况下 display 的值为指定值 
- 总结起来：绝对定位、浮动、根元素都需要调整 display

### 5、清除浮动的⼏种⽅式，各⾃的优缺点

1. ⽗级 div 定义 height 
2. 结尾处加空 div 标签 clear:both 
3. ⽗级 div 定义伪类 :after 和 zoom 
4. ⽗级 div 定义 overflow:hidden 
5. ⽗级 div 也浮动，需要定义宽度 
6. 结尾处加 br 标签 clear:both
7. ⽐较好的是第3种⽅式，好多⽹站都这么⽤

### 6、CSS的盒⼦模型？

### 7、display:inline-block 什么时候不会显示间隙？(携程)

移除空格 

- 使⽤ margin 负值 
- 使⽤ font-size:0 
- letter-spacing 
- word-spacing

### 8、⾏内元素float:left后是否变为块级元素？

⾏内元素设置成浮动之后变得更加像是 inline-block （⾏内块级元素，设置 成这个属性的元素会同时拥有⾏内和块级的特性，最明显的不同是它的默认宽 度不是 100% ），这时候给⾏内元素设置 padding-top 和 padding-bottom 或者 width 、 height 都是有效果的

### 9、::before 和 :after中双冒号和单冒号 有什么区别？解释⼀下这2个 伪元素的作⽤

- 单冒号( : )⽤于 CSS3 伪类，双冒号( :: )⽤于 CSS3 伪元素 
- ⽤于区分伪类和伪元素

### 10、CSS不同选择器的权重(CSS层叠的规则)

- ！important 规则最重要，⼤于其它规则 
- ⾏内样式规则，加 1000 
- 对于选择器中给定的各个 ID 属性值，加 100 
- 对于选择器中给定的各个类属性、属性选择器或者伪类选择器，加 10 
- 对于选择其中给定的各个元素标签选择器，加1 
- 如果权值⼀样，则按照样式规则的先后顺序来应⽤，顺序靠后的覆盖靠前的规则

### 11、stylus/sass/less区别

1. 均具有“变量”、“混合”、“嵌套”、“继承”、“颜⾊混合”五⼤基本特性 
2. Scss 和 LESS 语法较为严谨， LESS 要求⼀定要使⽤⼤括号“{}”， Scss 和 Stylus 可 以通过缩进表示层次与嵌套关系 
3. Scss ⽆全局变量的概念， LESS 和 Stylus 有类似于其它语⾔的作⽤域概念 
4. Sass 是基于 Ruby 语⾔的，⽽ LESS 和 Stylus 可以基于 NodeJS NPM 下载相应库后 进⾏编译；

### 12、postcss的作用

- 可以直观的理解为：它就是⼀个平台。为什么说它是⼀个平台呢？因为我们直接⽤它，感 觉不能⼲什么事情，但是如果让⼀些插件在它上⾯跑，那么将会很强⼤ 
- PostCSS 提供了⼀个解析器，它能够将 CSS 解析成抽象语法树 
- 通过在 PostCSS 这个平台上，我们能够开发⼀些插件，来处理我们的 CSS ，⽐如热⻔ 的： autoprefixer 
- postcss 可以对sass处理过后的 css 再处理 最常⻅的就是 autoprefixer

### 13、什么是外边距重叠？重叠的结果是什么？

在CSS当中，相邻的两个盒⼦（可能是兄弟关系也可能是祖先关系）的外边距可以结合成 ⼀个单独的外边距。这种合并外边距的⽅式被称为折叠，并且因⽽所结合成的外边距称为 折叠外边距。 折叠结果遵循下列计算规则： 

- 两个相邻的外边距都是正数时，折叠结果是它们两者之间较⼤的值。 
- 两个相邻的外边距都是负数时，折叠结果是两者绝对值的较⼤值。 
- 两个外边距⼀正⼀负时，折叠结果是两者的相加的和。

### 14、px和em的区别

px 和 em 都是⻓度单位，区别是， px 的值是固定的，指定是多少就是多少，计算⽐较 容易。 em 得值不是固定的，并且 em 会继承⽗级元素的字体⼤⼩。

浏览器的默认字体⾼都是 16px 。所以未经调整的浏览器都符合: 1em=16px 。那么 12px=0.75em , 10px=0.625em 。

