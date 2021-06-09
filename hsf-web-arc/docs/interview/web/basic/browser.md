---
title: 浏览器
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---
## Chrome 浏览器进程

> 在资源不足的设备上，将服务合并到浏览器进程中

### 浏览器主进程

- 负责浏览器界面显示
- 各个页面的管理，创建以及销毁
- 将渲染进程的结果绘制到用户界面上
- 网络资源管理

### GPU 进程

- 用于 3D 渲染绘制

### 网络进程

- 发起网络请求

### 插件进程

- 第三方插件处理，运行在沙箱中

### 渲染进程

- 页面渲染
- 脚本执行
- 事件处理

## 网络传输流程

### 生成 HTTP 请求消息

1. 输入网址

2. 浏览浏览器解析 URL

3. 生成 HTTP 请求信息

   ![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

   ![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

4. 收到响应

   | 状态码 | 含义                     |
   | :----- | :----------------------- |
   | 1xx    | 告知请求的处理进度和情况 |
   | 2xx    | 成功                     |
   | 3xx    | 表示需要进一步操作       |
   | 4xx    | 客户端错误               |
   | 5xx    | 服务端错误               |

### 向 DNS 服务器查询 Web 服务器的 IP 地址

1. Socket 库提供查询 IP 地址的功能
2. 通过解析器向 DNS 服务器发出查询

### 全世界 DNS 服务器的大接力

1. 寻找相应的 DNS 服务器并获取 IP 地址
2. 通过缓存加快 DNS 服务器的响应

### 委托协议栈发送消息

> 协议栈通过 TCP 协议收发数据的操作。

1. 创建套接字

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

- 浏览器，邮件等一般的应用程序收发数据时用 TCP
- DNS 查询等收发较短的控制数据时用 UDP

1. 连接服务器

> 浏览器调用 Socket.connect

- 在 TCP 模块处创建表示连接控制信息的头部
- 通过 TCP 头部中的发送方和接收方端口号找到要连接的套接字

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

1. 收发数据

> 浏览器调用 Socket.write

- 将 HTTP 请求消息交给协议栈

- 对较大的数据进行拆分，拆分的每一块数据加上 TCP 头，由 IP 模块来发送

- 使用 ACK 号确认网络包已收到

- 根据网络包平均往返时间调整 ACK 号等待时间

- 使用窗口有效管理 ACK 号

  ![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

- ACK 与窗口的合并

- 接收 HTTP 响应消息

1. 断开管道并删除套接字

> 浏览器调用 Socket.close

- 数据发送完毕后断开连接

  ![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

- 删除套接字

- 1. 客户端发送 FIN
  2. 服务端返回 ACK 号
  3. 服务端发送 FIN
  4. 客户端返回 ACK 号

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

![图片](https://mmbiz.qpic.cn/mmbiz_png/y0rsINPrlZwiaiaDhnq7zdoCEsbMhMzSk7d7gS9bmwv4o0tFJlQJCN8qYvDhENHGr6YnF8T2PVsL3YSrqVWtxiaKw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 跨域

### 同源策略

> 同源策略是一个重要的安全策略，它用于限制一个origin的文档或者它加载的脚本如何能与另一个源的资源进行交互。它能帮助阻隔恶意文档，减少可能被攻击的媒介。

如果两个 URL 的 **protocol** 、 **port** (如果有指定的话)和 **host** 都相同的话，则这两个 URL 是同源。

例如：

| URL                                               | 结果 | 原因                               |
| :------------------------------------------------ | :--- | :--------------------------------- |
| `http://store.company.com/dir2/other.html`        | 同源 | 只有路径不同                       |
| `http://store.company.com/dir/inner/another.html` | 同源 | 只有路径不同                       |
| `https://store.company.com/secure.html`           | 失败 | 协议不同                           |
| `http://store.company.com:81/dir/etc.html`        | 失败 | 端口不同 ( `http://` 默认端口是80) |
| `http://news.company.com/dir/other.html`          | 失败 | 主机不同                           |

### 主要的跨域处理

**JSONP**

JSONP的原理是：静态资源请求不受同源策略影响。实现如下：

```
const script = document.createElement('script')
script.type = 'text/javascript'
script.src = 'https://www.domain.com/a?data=1&callback=cb'
const cb = res => {
    console.log(JSON.stringify(res))
}
```

**CORS**

CORS：跨域资源共享(CORS) 是一种机制，它使用额外的 HTTP 头来告诉浏览器  让运行在一个 origin (domain) 上的Web应用被准许访问来自不同源服务器上的指定的资源。

在各种服务端代码实现如下：

```
// 根据不同语言规则，具体语法有所不同，此处以NodeJs的express为例
//设置跨域访问  
app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();  
});   
```

Nginx实现如下：

```
server {
    ...
    
    add_header Access-Control-Allow-Credentials true;
    add_header Access-Control-Allow-Origin $http_origin;
    
        
    location /file {
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin $http_origin;
            add_header Access-Control-Allow-Methods $http_access_control_request_method;
            add_header Access-Control-Allow-Credentials true;
            add_header Access-Control-Allow-Headers $http_access_control_request_headers;
            add_header Access-Control-Max-Age 1728000;
            return 204;
        }   
    }

    ...
}
```

## 网络协议

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

### TCP

传输控制协议（TCP，Transmission Control Protocol）是一种面向连接的、可靠的、基于字节流的传输层通信协议，由 IETF 的 RFC 793 定义。

- 基于流的方式
- 面向连接
- 丢包重传
- 保证数据顺序

### UDP

Internet 协议集支持一个无连接的传输协议，该协议称为用户数据报协议（UDP，User Datagram Protocol）。UDP 为应用程序提供了一种无需建立连接就可以发送封装的 IP 数据包的方法。RFC 768 描述了 UDP。

- UDP 是非连接的协议，也就是不会跟终端建立连接
- UDP 包信息只有 8 个字节
- UDP 是面向报文的。既不拆分，也不合并，而是保留这些报文的边界
- UDP 可能丢包
- UDP 不保证数据顺序

### HTTP

- HTTP/0.9：GET，无状态的特点形成

- HTTP/1.0：支持 POST，HEAD，添加了请求头和响应头，支持任何格式的文件发送，添加了状态码、多字符集支持、多部分发送、权限、缓存、内容编码等

- HTTP/1.1：默认长连接，同时 6 个 TCP 连接，CDN 域名分片

- HTTPS：HTTP + TLS（ **非对称加密** 与 **对称加密** ）

- 1. 客户端发出 https 请求，请求服务端建立 SSL 连接
  2. 服务端收到 https 请求，申请或自制数字证书，得到公钥和服务端私钥，并将公钥发送给客户端
  3. 户端验证公钥，不通过验证则发出警告，通过验证则产生一个随机的客户端私钥
  4. 客户端将公钥与客户端私钥进行对称加密后传给服务端
  5. 服务端收到加密内容后，通过服务端私钥进行非对称解密，得到客户端私钥
  6. 服务端将客户端私钥和内容进行对称加密，并将加密内容发送给客户端
  7. 客户端收到加密内容后，通过客户端私钥进行对称解密，得到内容

- HTTP/2.0：多路复用（一次 TCP 连接可以处理多个请求），服务器主动推送，stream 传输。

- HTTP/3：基于 UDP 实现了 QUIC 协议

- - 建立好 HTTP2 连接
  - 发送 HTTP2 扩展帧
  - 使用 QUIC 建立连接
  - 如果成功就断开 HTTP2 连接
  - 升级为 HTTP3 连接

**注：RTT = Round-trip time**

## 页面渲染流程

> 构建 DOM 树、样式计算、布局阶段、分层、绘制、分块、光栅化和合成

1. 创建 DOM tree

2. - 遍历 DOM 树中的所有可见节点，并把这些节点加到布局树中。
   - 不可见的节点会被布局树忽略掉。

3. 样式计算

4. - 创建 CSSOM tree
   - 转换样式表中的属性值
   - 计算出 DOM 节点样式

5. 生成 layout tree

6. 分层

7. - 生成图层树（LayerTree）
   - 拥有层叠上下文属性的元素会被提升为单独的一层
   - 需要剪裁（clip）的地方也会被创建为图层
   - 图层绘制

8. 将图层转换为位图

9. 合成位图并显示在页面中

## 页面更新机制

- 更新了元素的几何属性（重排）

- 更新元素的绘制属性（重绘）

- 直接合成

- - CSS3 的属性可以直接跳到这一步

## JS 执行机制

### 代码提升（为了编译）

- 变量提升
- 函数提升（优先级最高）

### 编译代码

**V8 编译 JS 代码的过程**

1. 生成抽象语法树（AST）和执行上下文

2. 第一阶段是分词（tokenize），又称为词法分析

3. 第二阶段是解析（parse），又称为语法分析

4. 生成字节码

   字节码就是介于 AST 和机器码之间的一种代码。但是与特定类型的机器码无关，字节码需要通过解释器将其转换为机器码后才能执行。

5. 执行代码

**高级语言编译器步骤：**

1. 输入源程序字符流
2. 词法分析
3. 语法分析
4. 语义分析
5. 中间代码生成
6. 机器无关代码优化
7. 代码生成
8. 机器相关代码优化
9. 目标代码生成

### 执行代码

- 执行全局代码时，创建全局上下文
- 调用函数时，创建函数上下文
- 使用 eval 函数时，创建 eval 上下文
- 执行局部代码时，创建局部上下文

## 浏览器安全

### 攻击方式

- xss：将代码注入到网页

- - **持久型** ：写入数据库
  - **非持久型** ：修改用户代码

- csrf：跨站请求伪造。攻击者会虚构一个后端请求地址，诱导用户通过某些途径发送请求。

- 中间人攻击：中间人攻击是攻击方同时与服务端和客户端建立起了连接，并让对方认为连接是安全的，但是实际上整个通信过程都被攻击者控制了。攻击者不仅能获得双方的通信信息，还能修改通信信息。

- - DNS 欺骗：入侵 DNS 来将用户访问目标改为入侵者指定机器
  - 会话劫持：在一次正常的通信过程中，攻击者作为第三方参与到其中，或者是在数据里加入其他信息，甚至将双方的通信模式暗中改变，即从直接联系变成有攻击者参与的联系。

### 防御措施

1. 预防 XSS

- 使用转义字符过滤 html 代码

  ```
  const escapeHTML = value => {
    if (!value || !value.length) {
      return value;
    }
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };
  ```

- 过滤 SQL 代码

  ```
  const replaceSql = value => {
    if (!value || !value.length) {
      return value;
    }
    return value.replace(/select|update|delete|exec|count|'|"|=|;|>|<|%/gi, "");
  };
  ```

1. 预防 CSRF

2. - 验证 HTTP Referer 字段
   - 在请求地址中添加 token 并验证
   - 在 HTTP 头中自定义属性并验证
   - Get 请求不对数据进行修改
   - 接口防跨域处理
   - 不让第三方网站访问用户 cookie

3. 预防中间人攻击

- 对于 DNS 欺骗：检查本机的 HOSTS 文件
- 对于会话劫持：使用交换式网络代替共享式网络，还必须使用静态 ARP、捆绑 MAC+IP 等方法来限制欺骗，以及采用认证方式的连接等。

1. 内容安全策略（CSP）

内容安全策略 (CSP) 是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本 (XSS) 和数据注入攻击等。无论是数据盗取、网站内容污染还是散发恶意软件，这些攻击都是主要的手段。

措施如下：

- HTTP Header 中的 `Content-Security-Policy`

- <meta http-equiv="Content-Security-Policy">

## 浏览器性能

### DNS 预解析

- `<link rel="dns-prefetch" href="" />`
- Chrome 和 Firefox 3.5+ 能自动进行预解析
- 关闭 DNS 预解析：`<meta http-equiv="x-dns-prefetch-control" content="off|on">`

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

### 强缓存

1. Expires

2. - 缓存过期时间，用来指定资源到期的时间，是服务器端的具体的时间点。
   - Expires 是 HTTP/1 的产物，受限于本地时间，如果修改了本地时间，可能会造成缓存失效。

3. Cache-Control

   ![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

   ![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

### 协商缓存

> 协商缓存就是强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程。

- 服务器响应头：Last-Modified，Etag
- 浏览器请求头：If-Modified-Since，If-None-Match

**Last-Modified** 与 **If-Modified-Since** 配对。`Last-Modified` 把 Web 应用最后修改时间告诉客户端，客户端下次请求之时会把 `If-Modified-Since` 的值发生给服务器，服务器由此判断是否需要重新发送资源，如果不需要则返回 304，如果有则返回 200。这对组合的缺点是只能精确到秒，而且是根据本地打开时间来记录的，所以会不准确。

**Etag** 与 **If-None-Match** 配对。它们没有使用时间作为判断标准，而是使用了一组特征串。`Etag`把此特征串发生给客户端，客户端在下次请求之时会把此特征串作为`If-None-Match`的值发送给服务端，服务器由此判断是否需要重新发送资源，如果不需要则返回 304，如果有则返回 200。

