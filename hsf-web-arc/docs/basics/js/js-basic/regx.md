---
title: 正则
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

正则表达式是用于匹配字符串中字符组合的模式。在 JavaScript中，正则表达式也是对象。这些模式被用于 RegExp 的 exec 和 test 方法, 以及 String 的 match、matchAll、replace、search 和 split 方法。本章介绍 JavaScript 正则表达式。

## 创建一个正则表达式

你可以使用以下两种方法构建一个正则表达式：

使用一个正则表达式字面量，其由包含在斜杠之间的模式组成，如下所示：

```
var re = /ab+c/;
```

脚本加载后，正则表达式字面量就会被编译。当正则表达式保持不变时，使用此方法可获得更好的性能。

或者调用`[RegExp](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/RegExp>)`对象的构造函数，如下所示：

```
var re = new RegExp("ab+c");
```

在脚本运行过程中，用构造函数创建的正则表达式会被编译。如果正则表达式将会改变，或者它将会从用户输入等来源中动态地产生，就需要使用构造函数来创建正则表达式。

## 编写一个正则表达式的模式

一个正则表达式模式是由简单的字符所构成的，比如 `/abc/`；或者是简单和特殊字符的组合，比如 `/ab*c/` 或 `/Chapter (\\d+)\\.\\d*/`。最后的例子中用到了括号，它在正则表达式中常用作记忆设备。即这部分所匹配的字符将会被记住以备后续使用，例如[使用括号的子字符串匹配](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions#使用括号的子字符串匹配)。

### 使用简单模式

简单模式是由你想直接找到的字符构成。比如，`/abc/` 这个模式就能且仅能匹配 "abc" 字符按照顺序同时出现的情况。例如在 "Hi, do you know your abc's?" 和 "The latest airplane designs evolved from slabcraft." 中会匹配成功。在上述两个例子中，匹配的子字符串是 "abc"。但是在 "Grab crab" 中会匹配失败，因为它虽然包含子字符串 "ab c"，但并不是准确的 "abc"。

### 使用特殊字符

当你需要匹配一个不确定的字符串时，比如寻找一个或多个 "b"，或者寻找空格，可以在模式中使用特殊字符。比如，你可以使用 `/ab*c/` 去匹配一个单独的 "a" 后面跟了零个或者多个 "b"，同时后面跟着 "c" 的字符串：`*`的意思是前一项出现零次或者多次。在字符串 "cbbabbbbcdebc" 中，这个模式匹配了子字符串 "abbbbc"。

下面的页面与表格列出了一个正则表达式中可以利用的特殊字符的完整列表和描述。

**[断言（Assertions）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions/Assertions)**表示一个匹配在某些条件下发生。断言包含先行断言、后行断言和条件表达式。**[字符类（Character Classes）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes)**区分不同类型的字符，例如区分字母和数字。**[组和范围（Groups and Ranges）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Ranges)**表示表达式字符的分组和范围。**[量词（Quantifiers）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions/Quantifiers)**表示匹配的字符或表达式的数量。**[Unicode 属性转义（Unicode Property Escapes）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes)**基于 unicode 字符属性区分字符。例如大写和小写字母、数学符号和标点。

[Untitled](https://www.notion.so/dff24f8c671b4f658ad744a0908089c6)

Escaping

如果你需要使用任何特殊字符的字面值（例如，搜索字符'*'），你必须通过在它前面放一个反斜杠来转义它。 例如，要搜索'a'后跟'*'后跟'b'，你应该使用`/a\\*b/`- 反斜杠“转义”字符'*'，使其成为文字而非特殊符号。

类似地，如果您正在编写正则表达式文字并且需要匹配斜杠（'/'），那么需要转义它（否则，斜杠是正则终止符）。 例如，要搜索字符串“/ example /”后跟一个或多个字母字符，您需要使用`/\\/example\\/[a-z]+/i`——每个斜杠之前使用反斜杠使它们成为普通字符。

要匹配文本符号反斜杠，您需要转义反斜杠。 例如，要匹配字符串“C:\”，其中“C”可以是任何字母，您将使用`/[A-Z]:\\\\/` —— 第一个反斜杠转义后面的那个反斜杠，因此表达式搜索单个普通字符反斜杠。

如果将RegExp构造函数与字符串文字一起使用，请记住反斜杠是字符串文字中的转义，因此要在正则表达式中使用它，您需要在字符串文字级别转义它。 `/a\\*b/` 和`new RegExp("a\\\\*b")`创建的表达式是相同的，搜索“a”后跟文字“*”后跟“b”。

将用户输入转义为正则表达式中的一个字面字符串, 可以通过简单的替换来实现：

```
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&"); 
  //$&表示整个被匹配的字符串
}
```

正则表达式后的"g"是一个表示全局搜索选项或标记，将在整个字符串查找并返回所有匹配结果。这将在下面的[通过标志进行高级搜索](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions#通过标志进行高级搜索)详述。

为什么这个没有内建在JavaScript中？之前有计划在RegExp对象中添加一个Function，但在[TC39](https://github.com/benjamingr/RegExp.escape/issues/37)中被否决了。

使用插入语

任何正则表达式的插入语都会使这部分匹配的副字符串被记忆。一旦被记忆，这个副字符串就可以被调用于其它用途，如同 [使用括号的子字符串匹配](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions#使用括号的子字符串匹配)之中所述。

比如， `/Chapter (\\d+)\\.\\d*/` 解释了额外转义的和特殊的字符，并说明了这部分pattern应该被记忆。它精确地匹配后面跟着一个以上数字字符的字符 'Chapter ' (`\\d` 意为任何数字字符，`+ 意为1次以上`)，跟着一个小数点（在这个字符中本身也是一个特殊字符；小数点前的 \ 意味着这个pattern必须寻找字面字符 '.')，跟着任何数字字符0次以上。 (`\\d` 意为数字字符， `*` 意为0次以上)。另外，插入语也用来记忆第一个匹配的数字字符。

此模式可以匹配字符串"Open Chapter 4.3, paragraph 6"，并且'4'将会被记住。此模式并不能匹配"Chapter 3 and 4"，因为在这个字符串中'3'的后面没有点号'.'。

括号中的"?:"，这种模式匹配的子字符串将不会被记住。比如，(?:\d+)匹配一次或多次数字字符，但是不能记住匹配的字符。

使用正则表达式

正则表达式可以被用于 [RegExp](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/RegExp>) 的 [exec](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/RegExp/exec>) 和 [test](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/RegExp/test>) 方法以及 [String](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/String>) 的 [match](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/String/match>)、[replace](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/String/replace>)、[search](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/String/search>) 和 [split](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/String/split>) 方法。这些方法在 JavaScript 手册中有详细的解释。

[Untitled](https://www.notion.so/c5255efdbb0d489ead00fdaf4a085473)

当你想要知道在一个字符串中的一个匹配是否被找到，你可以使用 test 或 search 方法；想得到更多的信息（但是比较慢）则可以使用 exec 或 match 方法。如果你使用exec 或 match 方法并且匹配成功了，那么这些方法将返回一个数组并且更新相关的正则表达式对象的属性和预定义的正则表达式对象（详见下）。如果匹配失败，那么 exec 方法返回 null（也就是false）。

在接下来的例子中，脚本将使用exec方法在一个字符串中查找一个匹配。

```
var myRe = /d(b+)d/g;
var myArray = myRe.exec("cdbbdbsbz");
```

如果你不需要访问正则表达式的属性，这个脚本通过另一个方法来创建myArray：

```
var myArray = /d(b+)d/g.exec("cdbbdbsbz");
// 和 "cdbbdbsbz".match(/d(b+)d/g); 相似。
// 但是 "cdbbdbsbz".match(/d(b+)d/g) 输出数组 [ "dbbd" ]，
// 而 /d(b+)d/g.exec('cdbbdbsbz') 输出数组 [ "dbbd", "bb", index: 1, input: "cdbbdbsbz" ].
```

如果你想通过一个字符串构建正则表达式，那么这个脚本还有另一种方法：

```
var myRe = new RegExp("d(b+)d", "g");
var myArray = myRe.exec("cdbbdbsbz");
```

通过这些脚本，匹配成功后将返回一个数组并且更新正则表达式的属性，如下表所示。

正则表达式执行后的返回信息

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d54fff36-e9be-476f-8863-48021ba12108/.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d54fff36-e9be-476f-8863-48021ba12108/.jpg)

如这个例子中的第二种形式所示，你可以使用对象初始器创建一个正则表达式实例，但不分配给变量。如果你这样做，那么，每一次使用时都会创建一个新的正则表达式实例。因此，如果你不把正则表达式实例分配给一个变量，你以后将不能访问这个正则表达式实例的属性。例如，假如你有如下脚本：

```
var myRe = /d(b+)d/g;
var myArray = myRe.exec("cdbbdbsbz");
console.log("The value of lastIndex is " + myRe.lastIndex);
```

这个脚本输出如下：

```
The value of lastIndex is 5
```

然而，如果你有如下脚本：

```
var myArray = /d(b+)d/g.exec("cdbbdbsbz");
console.log("The value of lastIndex is " + /d(b+)d/g.lastIndex);
```

它显示为：

```
The value of lastIndex is 0
```

当发生/d(b+)d/g使用两个不同状态的正则表达式对象，lastIndex属性会得到不同的值。如果你需要访问一个正则表达式的属性，则需要创建一个对象初始化生成器，你应该首先把它赋值给一个变量。

### 使用括号的子字符串匹配

一个正则表达式模式使用括号，将导致相应的子匹配被记住。例如，/a(b)c /可以匹配字符串“abc”，并且记得“b”。回调这些括号中匹配的子串，使用数组元素[1],……[n]。

使用括号匹配的子字符串的数量是无限的。返回的数组中保存所有被发现的子匹配。下面的例子说明了如何使用括号的子字符串匹配。

下面的脚本使用replace()方法来转换字符串中的单词。在匹配到的替换文本中，脚本使用替代的$ 1,$ 2表示第一个和第二个括号的子字符串匹配。

```
var re = /(\\w+)\\s(\\w+)/;
var str = "John Smith";
var newstr = str.replace(re, "$2, $1");
console.log(newstr);
```

这个表达式输出 "Smith, John"。

### 通过标志进行高级搜索

正则表达式有六个可选参数 (`flags`) 允许全局和不分大小写搜索等。这些参数既可以单独使用也能以任意顺序一起使用, 并且被包含在正则表达式实例中。

[Untitled](https://www.notion.so/413a6191211748898ec69e713336813a)

为了在正则表达式中包含标志，请使用以下语法：

```
var re = /pattern/flags;
```

或者

```
var re = new RegExp("pattern", "flags");
```

值得注意的是，标志是一个正则表达式的一部分，它们在接下来的时间将不能添加或删除。

例如，re = /\w+\s/g 将创建一个查找一个或多个字符后有一个空格的正则表达式，或者组合起来像此要求的字符串。

```
var re = /\\w+\\s/g;
var str = "fee fi fo fum";
var myArray = str.match(re);
console.log(myArray);

// ["fee ", "fi ", "fo "]
```

这段代码将输出 ["fee ", "fi ", "fo "]。在这个例子中，你可以将：

```
var re = /\\w+\\s/g;
```

替换成：

```
var re = new RegExp("\\\\w+\\\\s", "g");
```

并且能获取到相同的结果。

使用`.exec()`方法时，与'`g`'标志关联的行为是不同的。 （“class”和“argument”的作用相反：在`.match()`的情况下，字符串类（或数据类型）拥有该方法，而正则表达式只是一个参数，而在`.exec()`的情况下，它是拥有该方法的正则表达式，其中字符串是参数。对比*`str.match(re)`*与*`re.exec(str)`* ), '`g`'标志与`.exec()`方法一起使用获得迭代进展。

```
var xArray; while(xArray = re.exec(str)) console.log(xArray);
// produces: 
// ["fee ", index: 0, input: "fee fi fo fum"]
// ["fi ", index: 4, input: "fee fi fo fum"]
// ["fo ", index: 7, input: "fee fi fo fum"]
```

m标志用于指定多行输入字符串应该被视为多个行。如果使用m标志，^和$匹配的开始或结束输入字符串中的每一行，而不是整个字符串的开始或结束。

## 例子

以下例子说明了一些正则表达式的用途。

### 改变输入字符串的顺序

以下例子解释了正则表达式的构成和 `string.split()` 以及 `string.replace()`的用途。它会整理一个只有粗略格式的含有全名（名字首先出现）的输入字符串，这个字符串被空格、换行符和一个分号分隔。最终，它会颠倒名字顺序（姓氏首先出现）和list的类型。

```
// 下面这个姓名字符串包含了多个空格和制表符，
// 且在姓和名之间可能有多个空格和制表符。
var names = "Orange Trump ;Fred Barney; Helen Rigby ; Bill Abel ; Chris Hand ";

var output = ["---------- Original String\\n", names + "\\n"];

// 准备两个模式的正则表达式放进数组里。
// 分割该字符串放进数组里。

// 匹配模式：匹配一个分号及紧接其前后所有可能出现的连续的不可见符号。
var pattern = /\\s*;\\s*/;

// 把通过上述匹配模式分割的字符串放进一个叫做nameList的数组里面。
var nameList = names.split(pattern);

// 新建一个匹配模式：匹配一个或多个连续的不可见字符及其前后紧接着由
// 一个或多个连续的基本拉丁字母表中的字母、数字和下划线组成的字符串
// 用一对圆括号来捕获该模式中的一部分匹配结果。
// 捕获的结果稍后会用到。
pattern = /(\\w+)\\s+(\\w+)/;

// 新建一个数组 bySurnameList 用来临时存放正在处理的名字。
var bySurnameList = [];

// 输出 nameList 的元素并且把 nameList 里的名字
// 用逗号接空格的模式把姓和名分割开来然后存放进数组 bySurnameList 中。
//
// 下面的这个替换方法把 nameList 里的元素用 $2, $1 的模式
// （第二个捕获的匹配结果紧接着一个逗号一个空格然后紧接着第一个捕获的匹配结果）替换了
// 变量 $1 和变量 $2 是上面所捕获的匹配结果。

output.push("---------- After Split by Regular Expression");

var i, len;
for (i = 0, len = nameList.length; i < len; i++) {
  output.push(nameList[i]);
  bySurnameList[i] = nameList[i].replace(pattern, "$2, $1");
}

// 输出新的数组
output.push("---------- Names Reversed");
for (i = 0, len = bySurnameList.length; i < len; i++){
  output.push(bySurnameList[i]);
}

// 根据姓来排序，然后输出排序后的数组。
bySurnameList.sort();
output.push("---------- Sorted");
for (i = 0, len = bySurnameList.length; i < len; i++){
  output.push(bySurnameList[i]);
}

output.push("---------- End");

console.log(output.join("\\n"));
```

### 用特殊字符检验输入

在以下例子中，我们期望用户输入一个电话号码。当用户点击“Check”按钮，我们的脚本开始检查这些数字是否合法。如果数字合法（匹配正则表达式所规定的字符序列），脚本显示一条感谢用户的信息并确认该数字。如果这串数字不合法，脚本提示用户电话号码不合法。.

包含非捕获括号 `(?:` 这个正则表达式寻找三个数字字符`\\d{3}` 或者 `|` 一个左半括号`\\(`跟着三位数字`\\d{3}`, 跟着一个封闭括号 `\\)`, (结束非捕获括号 `)`)， 后跟着一个短破折号或正斜杠或小数点，随后跟随三个数字字符，当记忆字符 `([-\\/\\.])捕获并记住，后面跟着三位小数` `\\d{3}，再后面跟随记住的破折号、正斜杠或小数点` `\\1，最后跟着四位小数` `\\d{4}。`

当用户按下 Enter 设置 RegExp.input，这些变化也能被激活。

```
<!DOCTYPE html>
<html><head><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><meta http-equiv="Content-Script-Type" content="text/javascript"><script type="text/javascript">  
      var re = /(?:\\d{3}|\\(\\d{3}\\))([-\\/\\.])\\d{3}\\1\\d{4}/;  
      function testInfo(phoneInput) {  
        var OK = re.exec(phoneInput.value);  
        if (!OK)  
          window.alert(phoneInput.value + ' isn\\'t a phone number with area code!');  
        else
          window.alert('Thanks, your phone number is ' + OK[0]);  
      }  
    </script></head><body><p>Enter your phone number (with area code) and then click "Check".
        <br>The expected format is like ###-###-####.</p><form action="#"><input id="phone"><button onclick="testInfo(document.getElementById('phone'));">Check</button></form></body></html>
```



