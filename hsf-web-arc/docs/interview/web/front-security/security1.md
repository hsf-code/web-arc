---
title: 工程化（一）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

### 有哪些可能引起前端安全的的问题?

- 跨站脚本 (Cross-Site Scripting, XSS): ⼀种代码注⼊⽅式, 为了与 CSS 区分所以被称作 XSS. 早期常⻅于⽹络论坛, 起因是⽹站没有对⽤户的输⼊进⾏严格的限制, 使得攻击者可以将脚本上传到帖⼦让其他⼈浏览到有恶意脚本的⻚ ⾯, 其注⼊⽅式很简单包括但不限于 JavaScript / VBScript / CSS / Flash 等 
- iframe的滥⽤: iframe中的内容是由第三⽅来提供的，默认情况下他们不受我们的控制，他们可以在iframe中运⾏ JavaScirpt脚本、Flash插件、弹出对话框等等，这可能会破坏前端⽤户体验 
- 跨站点请求伪造（Cross-Site Request Forgeries，CSRF）: 指攻击者通过设置好的陷阱，强制对已完成认证的⽤ 户进⾏⾮预期的个⼈信息或设定信息等某些状态更新，属于被动攻击 
- 恶意第三⽅库: ⽆论是后端服务器应⽤还是前端应⽤开发，绝⼤多数时候我们都是在借助开发框架和各种类库进⾏ 快速开发,⼀旦第三⽅库被植⼊恶意代码很容易引起安全问题,⽐如event-stream的恶意代码事件,2018年11⽉21⽇， 名为 FallingSnow的⽤户在知名JavaScript应⽤库event-stream在github Issuse中发布了针对植⼊的恶意代码的疑 问，表示event-stream中存在⽤于窃取⽤户数字钱包的恶意代码

### XSS分为哪⼏类?

根据攻击的来源，XSS 攻击可分为存储型、反射型和 DOM 型三种。 

- 存储区：恶意代码存放的位置。 
- 插⼊点：由谁取得恶意代码，并插⼊到⽹⻚上。

##### 存储型 XSS

存储型 XSS 的攻击步骤： 

1. 攻击者将恶意代码提交到⽬标⽹站的数据库中。 
2. ⽤户打开⽬标⽹站时，⽹站服务端将恶意代码从数据库取出，拼接在 HTML 中返回给浏览器。 
3. ⽤户浏览器接收到响应后解析执⾏，混在其中的恶意代码也被执⾏。 
4. 恶意代码窃取⽤户数据并发送到攻击者的⽹站，或者冒充⽤户的⾏为，调⽤⽬标⽹站接⼝执⾏攻击者指定的操作。 

这种攻击常⻅于带有⽤户保存数据的⽹站功能，如论坛发帖、商品评论、⽤户私信等。

##### 反射型 XSS

反射型 XSS 的攻击步骤： 

1. 攻击者构造出特殊的 URL，其中包含恶意代码。 
2. ⽤户打开带有恶意代码的 URL 时，⽹站服务端将恶意代码从 URL 中取出，拼接在 HTML 中返回给浏览器。 
3. ⽤户浏览器接收到响应后解析执⾏，混在其中的恶意代码也被执⾏。 
4. 恶意代码窃取⽤户数据并发送到攻击者的⽹站，或者冒充⽤户的⾏为，调⽤⽬标⽹站接⼝执⾏攻击者指定的操作。 

反射型 XSS 跟存储型 XSS 的区别是：存储型 XSS 的恶意代码存在数据库⾥，反射型 XSS 的恶意代码存在 URL ⾥。 

反射型 XSS 漏洞常⻅于通过 URL 传递参数的功能，如⽹站搜索、跳转等。 

由于需要⽤户主动打开恶意的 URL 才能⽣效，攻击者往往会结合多种⼿段诱导⽤户点击。

POST 的内容也可以触发反射型 XSS，只不过其触发条件⽐较苛刻（需要构造表单提交⻚⾯，并引导⽤户点击），所 以⾮常少⻅。

##### DOM 型 XSS

DOM 型 XSS 的攻击步骤： 

1. 攻击者构造出特殊的 URL，其中包含恶意代码。 
2. ⽤户打开带有恶意代码的 URL。 
3. ⽤户浏览器接收到响应后解析执⾏，前端 JavaScript 取出 URL 中的恶意代码并执⾏。 
4. 恶意代码窃取⽤户数据并发送到攻击者的⽹站，或者冒充⽤户的⾏为，调⽤⽬标⽹站接⼝执⾏攻击者指定的操作。 

DOM 型 XSS 跟前两种 XSS 的区别：DOM 型 XSS 攻击中，取出和执⾏恶意代码由浏览器端完成，属于前端 JavaScript ⾃身的安全漏洞，⽽其他两种 XSS 都属于服务端的安全漏洞。

### 如何预防XSS?

XSS 攻击有两⼤要素： 

1. 攻击者提交恶意代码。 
2. 浏览器执⾏恶意代码。 

针对第⼀个要素：我们是否能够在⽤户输⼊的过程，过滤掉⽤户输⼊的恶意代码呢？

##### 输⼊过滤

在⽤户提交时，由前端过滤输⼊，然后提交到后端。这样做是否可⾏呢？ 

答案是不可⾏。⼀旦攻击者绕过前端过滤，直接构造请求，就可以提交恶意代码了。 

那么，换⼀个过滤时机：后端在写⼊数据库前，对输⼊进⾏过滤，然后把“安全的”内容，返回给前端。这样是否可⾏ 呢？ 

我们举⼀个例⼦，⼀个正常的⽤户输⼊了 5 < 7 这个内容，在写⼊数据库前，被转义，变成了 

```
5 &lt; 7
```

问题是：在提交阶段，我们并不确定内容要输出到哪⾥。 这⾥的“并不确定内容要输出到哪⾥”有两层含义：

1. ⽤户的输⼊内容可能同时提供给前端和客户端，⽽⼀旦经过了 escapeHTML() ，客户端显示的内容就变成了乱码 

   ```
   5 &lt; 7
   ```

   

2. 在前端中，不同的位置所需的编码也不同。 

- [ ] 当 `5 &lt; 7`  作为 HTML 拼接⻚⾯时，可以正常显示：

```
<div title="comment">5 &lt; 7</div>
```

- [ ] 当 `5 &lt; 7` 通过 Ajax 返回，然后赋值给 JavaScript 的变量时，前端得到的字符串就是转义后的字符。这个 内容不能直接⽤于 Vue 等模板的展示，也不能直接⽤于内容⻓度计算。不能⽤于标题、alert 等

所以，输⼊过滤能够在某些情况下解决特定的 XSS 问题，但会引⼊很⼤的不确定性和乱码问题。在防范 XSS 攻击时 应避免此类⽅法 

当然，对于明确的输⼊类型，例如数字、URL、电话号码、邮件地址等等内容，进⾏输⼊过滤还是必要的 

既然输⼊过滤并⾮完全可靠，我们就要通过“防⽌浏览器执⾏恶意代码”来防范 XSS。这部分分为两类：

- 防⽌ HTML 中出现注⼊
- 防⽌ JavaScript 执⾏时，执⾏恶意代码

##### 预防存储型和反射型 XSS 攻击

存储型和反射型 XSS 都是在服务端取出恶意代码后，插⼊到响应 HTML ⾥的，攻击者刻意编写的“数据”被内嵌到“代 码”中，被浏览器所执⾏。 

预防这两种漏洞，有两种常⻅做法： 

- 改成纯前端渲染，把代码和数据分隔开。 
- 对 HTML 做充分转义。

###### 纯前端渲染

纯前端渲染的过程： 

1. 浏览器先加载⼀个静态 HTML，此 HTML 中不包含任何跟业务相关的数据。 
2. 然后浏览器执⾏ HTML 中的 JavaScript。 
3. JavaScript 通过 Ajax 加载业务数据，调⽤ DOM API 更新到⻚⾯上。 

在纯前端渲染中，我们会明确的告诉浏览器：下⾯要设置的内容是⽂本（ .innerText ），还是属性 （ .setAttribute ），还是样式（ .style ）等等。

浏览器不会被轻易的被欺骗，执⾏预期外的代码了。 但纯前端渲染还需注意避免 DOM 型 XSS 漏洞（例如 onload 事件和 href 中的 javascript:xxx 等，请参考下⽂”预 防 DOM 型 XSS 攻击“部分）。

 在很多内部、管理系统中，采⽤纯前端渲染是⾮常合适的。但对于性能要求⾼，或有 SEO 需求的⻚⾯，我们仍然要⾯ 对拼接 HTML 的问题。

###### 转义 HTML

如果拼接 HTML 是必要的，就需要采⽤合适的转义库，对 HTML 模板各处插⼊点进⾏充分的转义。

常⽤的模板引擎，如 doT.js、ejs、FreeMarker 等，对于 HTML 转义通常只有⼀个规则，就是把 & < > " ' / 这⼏个 字符转义掉，确实能起到⼀定的 XSS 防护作⽤，但并不完善： |XSS 安全漏洞|简单转义是否有防护作⽤| |-|-| |HTML 标签⽂字内容|有| |HTML 属性值|有| |CSS 内联样式|⽆| |内联 JavaScript|⽆| |内联 JSON|⽆| |跳转链接|⽆| 所以要完善 XSS 防护措施，我们要使⽤更完善更细致的转义策略。 

例如 Java ⼯程⾥，常⽤的转义库为 org.owasp.encoder 。以下代码引⽤⾃ org.owasp.encoder 的官⽅说明。

```html
<!-- HTML 标签内⽂字内容 -->
<div><%= Encode.forHtml(UNTRUSTED) %></div>
<!-- HTML 标签属性值 -->
<input value="<%= Encode.forHtml(UNTRUSTED) %>" />
<!-- CSS 属性值 -->
<div style="width:<= Encode.forCssString(UNTRUSTED) %>">
<!-- CSS URL -->
<div style="background:<= Encode.forCssUrl(UNTRUSTED) %>">
<!-- JavaScript 内联代码块 -->
<script>
var msg = "<%= Encode.forJavaScript(UNTRUSTED) %>";
alert(msg);
</script>
<!-- JavaScript 内联代码块内嵌 JSON -->
<script>
var __INITIAL_STATE__ = JSON.parse('<%= Encoder.forJavaScript(data.to_json) %>');
</script>
<!-- HTML 标签内联监听器 -->
<button
onclick="alert('<%= Encode.forJavaScript(UNTRUSTED) %>');">
click me
</button>
<!-- URL 参数 -->
<a href="/search?value=<%= Encode.forUriComponent(UNTRUSTED) %>&order=1#top">
<!-- URL 路径 -->
<a href="/page/<%= Encode.forUriComponent(UNTRUSTED) %>">
<!--
URL.
注意：要根据项⽬情况进⾏过滤，禁⽌掉 "javascript:" 链接、⾮法 scheme 等
-->
<a href='<%=
urlValidator.isValid(UNTRUSTED) ?
Encode.forHtml(UNTRUSTED) :
"/404"
%>'>
link
</a>
```

可⻅，HTML 的编码是⼗分复杂的，在不同的上下⽂⾥要使⽤相应的转义规则。

### 预防 DOM 型 XSS 攻击

DOM 型 XSS 攻击，实际上就是⽹站前端 JavaScript 代码本身不够严谨，把不可信的数据当作代码执⾏了。 

在使⽤ .innerHTML 、 .outerHTML 、 document.write() 时要特别⼩⼼，不要把不可信的数据作为 HTML 插到⻚⾯上， ⽽应尽量使⽤ .textContent 、 .setAttribute() 等。 

如果⽤ Vue/React 技术栈，并且不使⽤ v-html / dangerouslySetInnerHTML 功能，就在前端 render 阶段避免 innerHTML 、 outerHTML 的 XSS 隐患。 

DOM 中的内联事件监听器，如 location 、 onclick 、 onerror 、 onload 、 onmouseover 等，  标签的 href 属 性，JavaScript 的 eval() 、 setTimeout() 、 setInterval() 等，都能把字符串作为代码运⾏。

如果不可信的数据拼接 到字符串中传递给这些 API，很容易产⽣安全隐患，请务必避免。

```html
<!-- 内联事件监听器中包含恶意代码 -->
![](https://awps-assets.meituan.net/mit-x/blog-images-bundle-2018b/3e724ce0.data:image/png,)
<!-- 链接内包含恶意代码 -->
<a href="UNTRUSTED">1</a>
<script>
// setTimeout()/setInterval() 中调⽤恶意代码
setTimeout("UNTRUSTED")
setInterval("UNTRUSTED")
// location 调⽤恶意代码
location.href = 'UNTRUSTED'
// eval() 中调⽤恶意代码
eval("UNTRUSTED")
</script>
```

如果项⽬中有⽤到这些的话，⼀定要避免在字符串中拼接不可信数据。

### 其他 XSS 防范措施

虽然在渲染⻚⾯和执⾏ JavaScript 时，通过谨慎的转义可以防⽌ XSS 的发⽣，但完全依靠开发的谨慎仍然是不够的。 以下介绍⼀些通⽤的⽅案，可以降低 XSS 带来的⻛险和后果

##### Content Security Policy 

严格的 CSP 在 XSS 的防范中可以起到以下的作⽤： 

- 禁⽌加载外域代码，防⽌复杂的攻击逻辑 
- 禁⽌外域提交，⽹站被攻击后，⽤户的数据不会泄露到外域
- 禁⽌内联脚本执⾏（规则较严格，⽬前发现 GitHub 使⽤） 
- 禁⽌未授权的脚本执⾏（新特性，Google Map 移动版在使⽤） 
- 合理使⽤上报可以及时发现 XSS，利于尽快修复问题

##### 输⼊内容⻓度控制

对于不受信任的输⼊，都应该限定⼀个合理的⻓度。虽然⽆法完全防⽌ XSS 发⽣，但可以增加 XSS 攻击的难度。

##### 其他安全措施

- HTTP-only Cookie: 禁⽌ JavaScript 读取某些敏感 Cookie，攻击者完成 XSS 注⼊后也⽆法窃取此 Cookie。 
- 验证码：防⽌脚本冒充⽤户提交危险操作。

**过滤 Html 标签能否防⽌ XSS? 请列举不能的情况?**

⽤户除了上传

```html
<script>alert('xss');</script>
```

还可以使⽤图⽚ url 等⽅式来上传脚本进⾏攻击

```html
<table background="javascript:alert(/xss/)"></table>
<img src="javascript:alert('xss')">
```

还可以使⽤各种⽅式来回避检查, 例如空格, 回⻋, Tab

```html
<img src="javas cript:
alert('xss')">
```

还可以通过各种编码转换 (URL 编码, Unicode 编码, HTML 编码, ESCAPE 等) 来绕过检查

```html
<img%20src=%22javascript:alert('xss');%22>
<img src="javascrip&#116&#58alert(/xss/)">
```

### CSRF是什么?

CSRF（Cross-site request forgery）跨站请求伪造：攻击者诱导受害者进⼊第三⽅⽹站，在第三⽅⽹站中，向被攻击⽹ 站发送跨站请求。利⽤受害者在被攻击⽹站已经获取的注册凭证，绕过后台的⽤户验证，达到冒充⽤户对被攻击的⽹站 执⾏某项操作的⽬的。 

⼀个典型的CSRF攻击有着如下的流程： 

- 受害者登录 a.com ，并保留了登录凭证（Cookie） 
- 攻击者引诱受害者访问了 b.com 
- b.com 向 a.com 发送了⼀个请求： a.com/act=xx 浏览器会默认携带a.com的Cookie 
- a.com接收到请求后，对请求进⾏验证，并确认是受害者的凭证，误以为是受害者⾃⼰发送的请求 
- a.com以受害者的名义执⾏了act=xx 
- 攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让a.com执⾏了⾃⼰定义的操作

### CSRF的攻击类型?

GET类型的CSRF利⽤⾮常简单，只需要⼀个HTTP请求，⼀般会这样利⽤：

```http
https://awps-assets.meituan.net/mit-x/blog-images-bundle-2018b/ff0cdbee.example/withdraw?amount=10000&for=hacke
```

在受害者访问含有这个img的⻚⾯后，浏览器会⾃动向 http://bank.example/withdraw? account=xiaoming&amount=10000&for=hacker 发出⼀次HTTP请求。bank.example就会收到包含受害者登录信息的⼀次跨域 请求。

POST类型的CSRF

这种类型的CSRF利⽤起来通常使⽤的是⼀个⾃动提交的表单，如：

```html
<form action="http://bank.example/withdraw" method=POST>
<input type="hidden" name="account" value="xiaoming" />
<input type="hidden" name="amount" value="10000" />
<input type="hidden" name="for" value="hacker" />
</form>
<script> document.forms[0].submit(); </script>
```

访问该⻚⾯后，表单会⾃动提交，相当于模拟⽤户完成了⼀次POST操作。 

POST类型的攻击通常⽐GET要求更加严格⼀点，但仍并不复杂。任何个⼈⽹站、博客，被⿊客上传⻚⾯的⽹站都有可 能是发起攻击的来源，后端接⼝不能将安全寄托在仅允许POST上⾯。

链接类型的CSRF

链接类型的CSRF并不常⻅，⽐起其他两种⽤户打开⻚⾯就中招的情况，这种需要⽤户点击链接才会触发。这种类型通 常是在论坛中发布的图⽚中嵌⼊恶意链接，或者以⼴告的形式诱导⽤户中招，攻击者通常会以⽐较夸张的词语诱骗⽤户 点击，例如：

```html
<a href="http://test.com/csrf/withdraw.php?amount=1000&for=hacker" taget="_blank">
重磅消息！！
<a/>
```

由于之前⽤户登录了信任的⽹站A，并且保存登录状态，只要⽤户主动访问上⾯的这个PHP⻚⾯，则表示攻击成功。

### 如何预防CSRF?

CSRF通常从第三⽅⽹站发起，被攻击的⽹站⽆法防⽌攻击发⽣，只能通过增强⾃⼰⽹站针对CSRF的防护能⼒来提升 安全性。 

CSRF的两个特点： 

- CSRF（通常）发⽣在第三⽅域名。 
- CSRF攻击者不能获取到Cookie等信息，只是使⽤。 

针对这两点，我们可以专⻔制定防护策略，如下： 

- 阻⽌不明外域的访问 
- - [ ] 同源检测 
  - [ ] Samesite Cookie 
- 提交时要求附加本域才能获取的信息 
- - [ ] CSRF Token 
  - [ ] 双重Cookie验证 

因此我们可以针对性得进⾏预防

###### 同源检测

既然CSRF⼤多来⾃第三⽅⽹站，那么我们就直接禁⽌外域（或者不受信任的域名）对我们发起请求: 

- 使⽤Origin Header确定来源域名: 在部分与CSRF有关的请求中，请求的Header中会携带Origin字段,如果Origin存 在，那么直接使⽤Origin中的字段确认来源域名就可以 
- 使⽤Referer Header确定来源域名: 根据HTTP协议，在HTTP头中有⼀个字段叫Referer，记录了该HTTP请求的来 源地址

###### CSRF Token

CSRF的另⼀个特征是，攻击者⽆法直接窃取到⽤户的信息（Cookie，Header，⽹站内容等），仅仅是冒⽤Cookie中的 信息。 

⽽CSRF攻击之所以能够成功，是因为服务器误把攻击者发送的请求当成了⽤户⾃⼰的请求。那么我们可以要求所有的 ⽤户请求都携带⼀个CSRF攻击者⽆法获取到的Token。服务器通过校验请求是否携带正确的Token，来把正常的请求 和攻击的请求区分开，也可以防范CSRF的攻击: 

CSRF Token的防护策略分为三个步骤： 

- 将CSRF Token输出到⻚⾯中 
- ⻚⾯提交的请求携带这个Token 
- 服务器验证Token是否正确



###### 双重Cookie验证

在会话中存储CSRF Token⽐较繁琐，⽽且不能在通⽤的拦截上统⼀处理所有的接⼝ 

那么另⼀种防御措施是使⽤双重提交Cookie。利⽤CSRF攻击不能获取到⽤户Cookie的特点，我们可以要求Ajax和表单 请求携带⼀个Cookie中的值 

双重Cookie采⽤以下流程： 

- 在⽤户访问⽹站⻚⾯时，向请求域名注⼊⼀个Cookie，内容为随机字符串（例如 csrfcookie=v8g9e4ksfhw ）。 
- 在前端向后端发起请求时，取出Cookie，并添加到URL的参数中（接上例 POST https://www.a.com/comment? csrfcookie=v8g9e4ksfhw ）。 
- 后端接⼝验证Cookie中的字段与URL参数中的字段是否⼀致，不⼀致则拒绝。

###### Samesite Cookie属性

Google起草了⼀份草案来改进HTTP协议，那就是为Set-Cookie响应头新增Samesite属性，它⽤来标明这个 Cookie是 个“同站 Cookie”，同站Cookie只能作为第⼀⽅Cookie，不能作为第三⽅Cookie，Samesite 有两个属性值: 

- Samesite=Strict: 这种称为严格模式，表明这个 Cookie 在任何情况下都不可能作为第三⽅ Cookie 
- Samesite=Lax: 这种称为宽松模式，⽐ Strict 放宽了点限制,假如这个请求是这种请求且同时是个GET请求，则这个 Cookie可以作为第三⽅Cookie

### ⽹络劫持有哪⼏种?

⽹络劫持⼀般分为两种: 

- DNS劫持: (输⼊京东被强制跳转到淘宝这就属于dns劫持) 

- [ ] ​	DNS强制解析: 通过修改运营商的本地DNS记录，来引导⽤户流量到缓存服务器 
- [ ] ​	302跳转的⽅式: 通过监控⽹络出⼝的流量，分析判断哪些内容是可以进⾏劫持处理的,再对劫持的内存发起302 跳转的回复，引导⽤户获取内容 

- HTTP劫持: (访问⾕歌但是⼀直有贪玩蓝⽉的⼴告),由于http明⽂传输,运营商会修改你的http响应内容(即加⼴告)

### 如何应对⽹络劫持?

DNS劫持由于涉嫌违法,已经被监管起来,现在很少会有DNS劫持,⽽http劫持依然⾮常盛⾏. 最有效的办法就是全站HTTPS,将HTTP加密,这使得运营商⽆法获取明⽂,就⽆法劫持你的响应内容.

### 中间⼈攻击

中间⼈ (Man-in-the-middle attack, MITM) 是指攻击者与通讯的两端分别创建独⽴的联系, 并交换其所收到的数据, 使通 讯的两端认为他们正在通过⼀个私密的连接与对⽅直接对话, 但事实上整个会话都被攻击者完全控制. 在中间⼈攻击中, 攻击者可以拦截通讯双⽅的通话并插⼊新的内容. 

⼀般的过程如下: 

- 客户端发送请求到服务端，请求被中间⼈截获 
- 服务器向客户端发送公钥 
- 中间⼈截获公钥，保留在⾃⼰⼿上。然后⾃⼰⽣成⼀个【伪造的】公钥，发给客户端 
- 客户端收到伪造的公钥后，⽣成加密hash值发给服务器 
- 中间⼈获得加密hash值，⽤⾃⼰的私钥解密获得真秘钥,同时⽣成假的加密hash值，发给服务器 
- 服务器⽤私钥解密获得假密钥,然后加密数据传输给客户端

