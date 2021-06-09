---
title: js++（一）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# DOM 变动观察器：Mutation observer

`MutationObserver` 是一个内建对象，它观察 DOM 元素，并在检测到更改时触发回调。

我们将首先看一下语法，然后探究一个实际的用例，以了解它在什么地方有用。

## 语法

`MutationObserver` 使用简单。

首先，我们创建一个带有回调函数的观察器：

```
let observer = new MutationObserver(callback);
```

然后将其附加到一个 DOM 节点：

```
observer.observe(node, config);
```

`config` 是一个具有布尔选项的对象，该布尔选项表示“将对哪些更改做出反应”：

- `childList` —— `node` 的直接子节点的更改，
- `subtree` —— `node` 的所有后代的更改，
- `attributes` —— `node` 的特性（attribute），
- `attributeFilter` —— 特性名称数组，只观察选定的特性。
- `characterData` —— 是否观察 `node.data`（文本内容），

其他几个选项：

- `attributeOldValue` —— 如果为 `true`，则将特性的旧值和新值都传递给回调（参见下文），否则只传新值（需要 `attributes` 选项），
- `characterDataOldValue` —— 如果为 `true`，则将 `node.data` 的旧值和新值都传递给回调（参见下文），否则只传新值（需要 `characterData` 选项）。

然后，在发生任何更改后，将执行“回调”：更改被作为一个**MutationRecord**[1] 对象列表传入第一个参数，而观察器自身作为第二个参数。

**MutationRecord**[2] 对象具有以下属性：

- `type` —— 变动类型，以下类型之一：

- - `"attributes"`：特性被修改了，
  - `"characterData"`：数据被修改了，用于文本节点，
  - `"childList"`：添加/删除了子元素。

- `target` —— 更改发生在何处：`"attributes"` 所在的元素，或 `"characterData"` 所在的文本节点，或 `"childList"` 变动所在的元素，

- `addedNodes/removedNodes` —— 添加/删除的节点，

- `previousSibling/nextSibling` —— 添加/删除的节点的上一个/下一个兄弟节点，

- `attributeName/attributeNamespace` —— 被更改的特性的名称/命名空间（用于 XML），

- `oldValue` —— 之前的值，仅适用于特性或文本更改，如果设置了相应选项 `attributeOldValue`/`characterDataOldValue`。

例如，这里有一个 `<div>`，它具有 `contentEditable` 特性。该特性使我们可以聚焦和编辑元素。

```
<div contentEditable id="elem">Click and <b>edit</b>, please</div>

<script>
let observer = new MutationObserver(mutationRecords => {
  console.log(mutationRecords); // console.log(the changes)
});

// 观察除了特性之外的所有变动
observer.observe(elem, {
  childList: true, // 观察直接子节点
  subtree: true, // 及其更低的后代节点
  characterDataOldValue: true // 将旧的数据传递给回调
});
</script>
```

如果我们在浏览器中运行上面这段代码，并聚焦到给定的 `<div>` 上，然后更改 `<b>edit</b>` 中的文本，`console.log` 将显示一个变动：

```
mutationRecords = [{
  type: "characterData",
  oldValue: "edit",
  target: <text node>,
  // 其他属性为空
}];
```

如果我们进行更复杂的编辑操作，例如删除 `<b>edit</b>`，那么变动事件可能会包含多个变动记录：

```
mutationRecords = [{
  type: "childList",
  target: <div#elem>,
  removedNodes: [<b>],
  nextSibling: <text node>,
  previousSibling: <text node>
  // 其他属性为空
}, {
  type: "characterData"
  target: <text node>
  // ...变动的详细信息取决于浏览器如何处理此类删除
  // 它可能是将两个相邻的文本节点 "edit " 和 ", please" 合并成一个节点，
  // 或者可能将它们留在单独的文本节点中
}];
```

因此，`MutationObserver` 允许对 DOM 子树中的任何更改作出反应。

## 用于集成

在什么时候可能有用？

想象一下，你需要添加一个第三方脚本，该脚本不仅包含有用的功能，还会执行一些我们不想要的操作，例如显示广告 `<div class="ads">Unwanted ads</div>`。

当然，第三方脚本没有提供删除它的机制。

使用 `MutationObserver`，我们可以监测到我们不需要的元素何时出现在我们的 DOM 中，并将其删除。

还有一些其他情况，例如第三方脚本会将某些内容添加到我们的文档中，并且我们希望检测出这种情况何时发生，以调整页面，动态调整某些内容的大小等。

`MutationObserver` 使我们能够实现这种需求。

## 用于架构

从架构的角度来看，在某些情况下，`MutationObserver` 有不错的作用。

假设我们正在建立一个有关编程的网站。自然地，文章和其他材料中可能包含源代码段。

在 HTML 标记（markup）中的此类片段如下所示：

```
...
<pre class="language-javascript"><code>
  // 这里是代码
  let hello = "world";
</code></pre>
...
```

为了提高可读性，同时对其进行美化，我们将在我们的网站上使用 JavaScript 语法高亮显示库，例如 **Prism.js**[3]。为了使用 Prism 对以上代码片段进行语法高亮显示，我们调用了 `Prism.highlightElem(pre)`，它会检查此类 `pre` 元素的内容，并为这些元素添加特殊的标签（tag）和样式，以进行彩色语法高亮显示，类似于你在本文的示例中看到的那样。

那么，我们应该在什么时候执行该高亮显示方法呢？我们可以在 `DOMContentLoaded` 事件中执行，或者将脚本放在页面的底部。DOM 就绪后，我们可以搜索元素 `pre[class*="language"]` 并对其调用`Prism.highlightElem`：

```
// 高亮显示页面上的所有代码段
document.querySelectorAll('pre[class*="language"]').forEach(Prism.highlightElem);
```

到目前为止，一切都很简单，对吧？我们找到 HTML 中的代码片段并高亮显示它们。

现在让我们继续。假设我们要从服务器动态获取资料。我们将 **在本教程的后续章节**[4] 中学习进行此操作的方法。目前，只需要关心我们从网络服务器获取 HTML 文章并按需显示：

```
let article = /* 从服务器获取新内容 */
articleElem.innerHTML = article;
```

新的 `article` HTML 可能包含代码段。我们需要对其调用 `Prism.highlightElem`，否则它们将不会被高亮显示。

**对于动态加载的文章，应该在何处何时调用 `Prism.highlightElem`？**

我们可以将该调用附加到加载文章的代码中，如下所示：

```
let article = /* 从服务器获取新内容 */
articleElem.innerHTML = article;

let snippets = articleElem.querySelectorAll('pre[class*="language-"]');
snippets.forEach(Prism.highlightElem);
```

……但是，想象一下，如果代码中有很多地方都是在加载内容：文章，测验和论坛帖子等。我们是否需要在每个地方都附加一个高亮显示调用，以在内容加载完成后，高亮内容中的代码。那很不方便。

并且，如果内容是由第三方模块加载的，该怎么办？例如，我们有一个由其他人编写的论坛，该论坛可以动态加载内容，并且我们想为其添加语法高亮显示。没有人喜欢修补第三方脚本。

幸运的是，还有另一种选择。

我们可以使用 `MutationObserver` 来自动检测何时在页面中插入了代码段，并高亮显示它们。

因此，我们在一个地方处理高亮显示功能，从而使我们无需集成它。

### 动态高亮显示示例

这是一个工作示例。

如果你运行这段代码，它将开始观察下面的元素，并高亮显示现在此处的所有代码段：

```
let observer = new MutationObserver(mutations => {

  for(let mutation of mutations) {
    // 检查新节点，有什么需要高亮显示的吗？

    for(let node of mutation.addedNodes) {
      // 我们只跟踪元素，跳过其他节点（例如文本节点）
      if (!(node instanceof HTMLElement)) continue;

      // 检查插入的元素是否为代码段
      if (node.matches('pre[class*="language-"]')) {
        Prism.highlightElement(node);
      }

      // 或者可能在子树的某个地方有一个代码段？
      for(let elem of node.querySelectorAll('pre[class*="language-"]')) {
        Prism.highlightElement(elem);
      }
    }
  }

});

let demoElem = document.getElementById('highlight-demo');

observer.observe(demoElem, {childList: true, subtree: true});
```

下面有一个 HTML 元素，以及使用 `innerHTML` 动态填充它的 JavaScript。

请先运行前面那段代码（上面那段，观察元素），然后运行下面这段代码。你将看到 `MutationObserver` 是如何检测并高亮显示代码段的。

```
<p id="highlight-demo" style="border: 1px solid #ddd">一个具有 <code>id="highlight-demo"</code> 的示例元素，运行上面那段代码来观察它。</p>
```

下面这段代码填充了其 `innerHTML`，这导致 `MutationObserver` 作出反应，并突出显示其内容：

```
let demoElem = document.getElementById('highlight-demo');

// 动态插入带有代码段的内容
demoElem.innerHTML = `下面是一个代码段：
  <pre class="language-javascript"><code> let hello = "world!"; </code></pre>
  <div>另一个代码段：</div>
  <div>
    <pre class="language-css"><code>.class { margin: 5px; } </code></pre>
  </div>
`;
```

现在我们有了 `MutationObserver`，它可以跟踪观察到的元素中的，或者整个 `document` 中的所有高亮显示。我们可以在 HTML 中添加/删除代码段，而无需考虑高亮问题。

## 其他方法

有一个方法可以停止观察节点：

- `observer.disconnect()` —— 停止观察。

当我们停止观察时，观察器可能尚未处理某些更改。在种情况下，我们使用：

- `observer.takeRecords()` —— 获取尚未处理的变动记录列表，表中记录的是已经发生，但回调暂未处理的变动。

这些方法可以一起使用，如下所示：

```
// 如果你关心可能未处理的近期的变动
// 那么，应该在 disconnect 前调用获取未处理的变动列表
let mutationRecords = observer.takeRecords();

// 停止跟踪变动
observer.disconnect();
...
```

> **`observer.takeRecords()` 返回的记录被从处理队列中移除：**
>
> 回调函数不会被 `observer.takeRecords()` 返回的记录调用。

> **垃圾回收：**
>
> 观察器在内部对节点使用弱引用。也就是说，如果一个节点被从 DOM 中移除了，并且该节点变得不可访问，那么它就可以被垃圾回收。
>
> 观察到 DOM 节点这一事实并不能阻止垃圾回收。

## 总结

`MutationObserver` 可以对 DOM 的变化作出反应 —— 特性（attribute），文本内容，添加/删除元素。

我们可以用它来跟踪代码其他部分引入的更改，以及与第三方脚本集成。

`MutationObserver` 可以跟踪任何更改。`config` “要观察的内容”选项用于优化，避免不必要的回调调用以节省资源。



# JavaScript 如何检测文件的类型？

在日常工作中，文件上传是一个很常见的功能。在某些情况下，我们希望能限制文件上传的类型，比如限制只能上传 PNG 格式的图片。针对这个问题，我们会想到通过 `input` 元素的 `accept` 属性来限制上传的文件类型：

```
<input type="file" id="inputFile" accept="image/png" />
```

这种方案虽然可以满足大多数场景，但如果用户把 JPEG 格式的图片后缀名更改为 `.png` 的话，就可以成功突破这个限制。那么应该如何解决这个问题呢？其实我们可以通过读取文件的二进制数据来识别正确的文件类型。在介绍具体的实现方案前，阿宝哥先以图片类型的文件为例，来介绍一下相关的知识。

### 一、如何查看图片的二进制数据

要查看图片对应的二进制数据，我们可以借助一些现成的编辑器，比如 Windows 平台下的 **WinHex** 或 macOS 平台下的 **Synalyze It! Pro** 十六进制编辑器。这里我们使用 **Synalyze It! Pro** 这个编辑器，以十六进制的形式来查看阿宝哥头像对应的二进制数据。

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/jQmwTIFl1V0ynx75suKHDSxvibic1iaia8G6lBdQicLO0kCZ1xU4eicHq8Nm6FEpx0g6ZQEMAhGl7gFIyYIrkfXehusA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

### 二、如何区分图片的类型

**计算机并不是通过图片的后缀名来区分不同的图片类型，而是通过 “魔数”（Magic Number）来区分。** 对于某一些类型的文件，起始的几个字节内容都是固定的，根据这几个字节的内容就可以判断文件的类型。

常见图片类型对应的魔数如下表所示：

| 文件类型 | 文件后缀 | 魔数                      |
| :------- | :------- | :------------------------ |
| JPEG     | jpg/jpeg | 0xFF D8 FF                |
| PNG      | png      | 0x89 50 4E 47 0D 0A 1A 0A |
| GIF      | gif      | 0x47 49 46 38（GIF8）     |
| BMP      | bmp      | 0x42 4D                   |

同样使用 **Synalyze It! Pro** 这个编辑器，来验证一下阿宝哥的头像（abao.png）的类型是否正确：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/jQmwTIFl1V0ynx75suKHDSxvibic1iaia8G6MVVv9CP26zVI1emO8kLCoKxwOFfps1Uv9Ux2oDuZGdWPZlJ4dEsjpw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

由上图可知，PNG 类型的图片前 8 个字节是 **0x89 50 4E 47 0D 0A 1A 0A**。当你把 `abao.png` 文件修改为 `abao.jpeg` 后，再用编辑器打开查看图片的二进制内容，你会发现文件的前 8 个字节还是保持不变。但如果使用 `input[type="file"]` 输入框的方式来读取文件信息的话，将会输出以下结果：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/jQmwTIFl1V0ynx75suKHDSxvibic1iaia8G6Acm9PWQZzp7zvBwShjJV4wpCVN2dRBonI67w5sqicsAqGResmEQyEBQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

很明显通过 **文件后缀名或文件的 MIME 类型** 并不能识别出正确的文件类型。接下来，阿宝哥将介绍在上传图片时，如何通过读取图片的二进制信息来确保正确的图片类型。

### 三、如何检测图片的类型

#### 3.1 定义 readBuffer 函数

在获取文件对象后，我们可以通过 FileReader API 来读取文件的内容。因为我们并不需要读取文件的完整信息，所以阿宝哥封装了一个 `readBuffer` 函数，用于读取文件中指定范围的二进制数据。

```
function readBuffer(file, start = 0, end = 2) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file.slice(start, end));
  });
}
```

对于 PNG 类型的图片来说，该文件的前 8 个字节是 **0x89 50 4E 47 0D 0A 1A 0A**。因此，我们在检测已选择的文件是否为 PNG 类型的图片时，只需要读取前 8 个字节的数据，并逐一判断每个字节的内容是否一致。

#### 3.2 定义 check 函数

为了实现逐字节比对并能够更好地实现复用，阿宝哥定义了一个 `check`函数：

```
function check(headers) {
  return (buffers, options = { offset: 0 }) =>
    headers.every(
      (header, index) => header === buffers[options.offset + index]
    );
}
```

#### 3.3 检测 PNG 图片类型

基于前面定义的 `readBuffer` 和 `check` 函数，我们就可以实现检测 PNG 图片的功能：

##### 3.3.1 html 代码

```
<div>
   选择文件：<input type="file" id="inputFile" accept="image/*"
              onchange="handleChange(event)" />
   <p id="realFileType"></p>
</div>
```

##### 3.3.2 JS 代码

```
const isPNG = check([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]); // PNG图片对应的魔数
const realFileElement = document.querySelector("#realFileType");

async function handleChange(event) {
  const file = event.target.files[0];
  const buffers = await readBuffer(file, 0, 8);
  const uint8Array = new Uint8Array(buffers);
  realFileElement.innerText = `${file.name}文件的类型是：${
    isPNG(uint8Array) ? "image/png" : file.type
  }`;
}
```

以上示例成功运行后，对应的检测结果如下图所示：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/jQmwTIFl1V0ynx75suKHDSxvibic1iaia8G6TE48GXk7lhiabTqttscvQJ2CE5XZb4t86UiaibZFZ9G3ibuPkyYIicyvFzg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

由上图可知，我们已经可以成功地检测出正确的图片格式。如果你要检测 JPEG 文件格式的话，你只需要定义一个 `isJPEG` 函数：

```
const isJPEG = check([0xff, 0xd8, 0xff])
```

然而，如果你要检测其他类型的文件，比如 PDF 文件的话，应该如何处理呢？这里我们先使用 **Synalyze It! Pro** 编辑器来浏览一下 PDF 文件的二进制内容：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/jQmwTIFl1V0ynx75suKHDSxvibic1iaia8G6zYhqcHHzhN9WBMBOqwarHiatoZQl9Mqb3iafU0VrFgUvzW4pyFe9fltg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

观察上图可知，PDF 文件的头 4 个字节的是 **0x25 50 44 46**，对应的字符串是 **%PDF**。为了让用户能更直观地辨别出检测的类型，阿宝哥定义了一个 `stringToBytes` 函数：

```
function stringToBytes(string) {
  return [...string].map((character) => character.charCodeAt(0));
}
```

基于 `stringToBytes` 函数，我们就可以很容易的定义一个 `isPDF` 函数，具体如下所示：

```
const isPDF = check(stringToBytes("%PDF"));
```

有了 `isPDF` 函数，你就实现 PDF 文件检测的功能了。但在实际工作中，遇到的文件类型是多种多样的，针对这种情形，你可以使用现成的第三库来实现文件检测的功能，比如 file-type 这个库。

其实基于文件的二进制数据，除了可以检测文件的类型之外，我们还可以读取文件相关的元信息，比如图片的尺寸、位深度、色彩类型和压缩算法等，我们继续以阿宝哥的头像（abao.png）为例，来看一下实际的情况：

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/jQmwTIFl1V0ynx75suKHDSxvibic1iaia8G6ufRe1iagNCOMMShI5c9GYBCIsicZqicGpqQXgZRXaYN9ThvJswJ7zWmww/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

好的，在前端如何检测文件类型就介绍到这里。在实际项目中，对于文件上传的场景，出于安全考虑，建议小伙伴们在开发过程中，都限制一下文件上传的类型。对于更严格的场景来说，就可以考虑使用阿宝哥介绍的方法来做文件类型的校验。此外，如果你对前端如何处理二进制数据感兴趣可以阅读 [玩转前端二进制](https://mp.weixin.qq.com/s?__biz=MzI2MjcxNTQ0Nw==&mid=2247485357&idx=1&sn=97f2ac5a7a3ab5b9033fc934c6a0ae14&scene=21#wechat_redirect)。

### 四、参考资源

- [玩转前端二进制](https://mp.weixin.qq.com/s?__biz=MzI2MjcxNTQ0Nw==&mid=2247485357&idx=1&sn=97f2ac5a7a3ab5b9033fc934c6a0ae14&scene=21#wechat_redirect)
- MDN - FileReader



# JS获取浏览器可视区域尺寸

浏览器窗口的可视区域大小，不是浏览器窗口大小，也非页面尺寸。在没有声明`DOCTYPE`的`IE`中，浏览器显示窗口大小只能以下获取：

```
document.body.offsetWidth
document.body.offsetHeight
```

在声明了`DOCTYPE`的浏览器中，可以用以下来获取浏览器显示窗口大小：

```
document.documentElement.clientWidth
document.documentElement.clientHeight
```

IE，FF，Safari皆支持该方法，opera虽支持该属性，但是返回的是页面尺寸；同时，除了IE以外的所有浏览器都将此信息保存在`window`对象中，可以用以下获取：

```
window.innerWidth
window.innerHeight
```



