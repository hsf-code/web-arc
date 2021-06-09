---
title: 其他
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# Strict_mode

[ECMAScript 5](http://www.ecma-international.org/publications/standards/Ecma-262.htm)的**严格模式**是采用具有限制性JavaScript变体的一种方式，从而使代码显示地 脱离“马虎模式/稀松模式/懒散模式“（sloppy）模式。

严格模式不仅仅是一个子集：它的产生是为了形成与正常代码不同的语义。

不支持严格模式与支持严格模式的浏览器在执行严格模式代码时会采用不同行为。

所以在没有对运行环境展开**特性测试**来验证对于严格模式相关方面支持的情况下，就算采用了严格模式也不一定会取得预期效果。严格模式代码和非严格模式代码可以共存，因此项目脚本可以渐进式地采用严格模式。

严格模式对正常的 JavaScript语义做了一些更改。

1. 严格模式通过**抛出错误**来消除了一些原有**静默错误**。
2. 严格模式修复了一些导致 JavaScript引擎难以执行优化的缺陷：有时候，相同的代码，严格模式可以比非严格模式下**运行得更快**。
3. 严格模式**禁用了**在ECMAScript的未来版本中可能会定义的一些语法。

如果你想改变你的代码，让其工作在具有限制性JavaScript环境中，请参阅[转换成严格模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode/Transitioning_to_strict_mode)。

## 调用严格模式

严格模式可以应用到整个脚本或个别函数中。不要在封闭大括弧 `{}` 内这样做，在这样的上下文中这么做是没有效果的。在 `eval` 、`Function` 、内联事件处理属性、 `[WindowTimers.setTimeout()](<https://developer.mozilla.org/zh-CN/docs/Web/API/WindowTimers/setTimeout>)` 方法中传入的脚本字符串，其行为类似于开启了严格模式的一个单独脚本，它们会如预期一样工作。

### 为脚本开启严格模式

为整个脚本文件开启严格模式，需要在所有语句之前放一个特定语句 `"use strict";` （或 `'use strict';`）

```
// 整个脚本都开启严格模式的语法
"use strict";
var v = "Hi!  I'm a strict mode script!";
```

这种语法存在陷阱，有一个[大型网站](https://bugzilla.mozilla.org/show_bug.cgi?id=627531)已经被它[坑倒](https://bugzilla.mozilla.org/show_bug.cgi?id=579119)了：不能盲目的合并冲突代码。试想合并一个严格模式的脚本和一个非严格模式的脚本：合并后的脚本代码看起来是严格模式。反之亦然：非严格合并严格看起来是非严格的。合并均为严格模式的脚本或均为非严格模式的都没问题，只有在合并严格模式与非严格模式有可能有问题。建议按一个个函数去开启严格模式（至少在学习的过渡期要这样做）.

您也可以将整个脚本的内容用一个函数包括起来，然后在这个外部函数中使用严格模式。这样做就可以消除合并的问题，但是这就意味着您必须要在函数作用域外声明一个全局变量。

### 为函数开启严格模式

同样的，要给某个函数开启严格模式，得把 `"use strict";` (或 `'use strict';` )声明*一字不漏地*放在函数体所有语句之前。

```
function strict() {
  // 函数级别严格模式语法
  'use strict';
  function nested() { 
    return "And so am I!"; 
  }
  return "Hi!  I'm a strict mode function!  " + nested();
}

function notStrict() { 
  return "I'm not strict."; 
}
```

## 严格模式中的变化

严格模式同时改变了语法及运行时行为。变化通常分为这几类：将问题直接转化为错误（如语法错误或运行时错误）, 简化了如何为给定名称的特定变量计算，简化了 `eval` 以及 `arguments`, 将写"安全“JavaScript的步骤变得更简单，以及改变了预测未来ECMAScript行为的方式。

### 将过失错误转成异常

在严格模式下, 某些先前被接受的过失错误将会被认为是异常. JavaScript被设计为能使新人开发者更易于上手, 所以有时候会给本来错误操作赋予新的不报错误的语义(non-error semantics). 有时候这可以解决当前的问题, 但有时候却会给以后留下更大的问题. 严格模式则把这些失误当成错误, 以便可以发现并立即将其改正.

第一，严格模式下无法再意外创建全局变量。在普通的JavaScript里面给一个错误命名的变量名赋值会使全局对象新增一个属性并继续“工作”（尽管将来可能会失败：在现代的JavaScript中有可能）。严格模式中意外创建全局变量被抛出错误替代：

```
"use strict";
                       // 假如有一个全局变量叫做mistypedVariable
mistypedVaraible = 17; // 因为变量名拼写错误
                       // 这一行代码就会抛出 ReferenceError
```

第二, 严格模式会使引起静默失败(silently fail,注:不报错也没有任何效果)的赋值操作抛出异常. 例如, `NaN` 是一个不可写的全局变量. 在正常模式下, 给 `NaN` 赋值不会产生任何作用; 开发者也不会受到任何错误反馈. 但在严格模式下, 给 `NaN` 赋值会抛出一个异常. 任何在正常模式下引起静默失败的赋值操作 (给不可写属性赋值, 给只读属性(getter-only)赋值, 给不可扩展对象([non-extensible](https://developer.mozilla.org/zh-CN/JavaScript/Reference/Global_Objects/Object/preventExtensions) object)的新属性赋值) 都会抛出异常:

```
"use strict";

// 给不可写属性赋值
var obj1 = {};
Object.defineProperty(obj1, "x", { value: 42, writable: false });
obj1.x = 9; // 抛出TypeError错误

// 给只读属性赋值
var obj2 = { get x() { return 17; } };
obj2.x = 5; // 抛出TypeError错误

// 给不可扩展对象的新属性赋值
var fixed = {};
Object.preventExtensions(fixed);
fixed.newProp = "ohai"; // 抛出TypeError错误
```

第三, 在严格模式下, 试图删除不可删除的属性时会抛出异常(之前这种操作不会产生任何效果):

```
"use strict";
delete Object.prototype; // 抛出TypeError错误
```

第四，在Gecko版本34之前，严格模式要求一个对象内的所有属性名在对象内必须唯一。正常模式下重名属性是允许的，最后一个重名的属性决定其属性值。因为只有最后一个属性起作用，当代码要去改变属性值而不是修改最后一个重名属性的时候，复制这个对象就产生一连串的bug。在严格模式下，重名属性被认为是语法错误：

这个问题在ECMAScript6中已经不复存在([bug 1041128](https://bugzilla.mozilla.org/show_bug.cgi?id=1041128))。

```
"use strict";
var o = { p: 1, p: 2 }; // !!! 语法错误
```

第五, 严格模式要求函数的参数名唯一. 在正常模式下, 最后一个重名参数名会掩盖之前的重名参数. 之前的参数仍然可以通过 `arguments[i] 来访问`, 还不是完全无法访问. 然而, 这种隐藏毫无意义而且可能是意料之外的 (比如它可能本来是打错了), 所以在严格模式下重名参数被认为是语法错误:

```
function sum(a, a, c) { // !!! 语法错误
  "use strict";
  return a + a + c; // 代码运行到这里会出错
}
```

第六, 严格模式禁止八进制数字语法. ECMAScript并不包含八进制语法, 但所有的浏览器都支持这种以零(`0`)开头的八进制语法: `0644 === 420` 还有 `"\\045" === "%"`.在ECMAScript 6中支持为一个数字加"`0`o"的前缀来表示八进制数.

```
var a = 0o10; // ES6: 八进制
```

有些新手开发者认为数字的前导零没有语法意义, 所以他们会用作对齐措施 — 但其实这会改变数字的意义! 八进制语法很少有用并且可能会错误使用, 所以严格模式下八进制语法会引起语法错误:

```
"use strict";
var sum = 015 + // !!! 语法错误
          197 +
          142;
```

第七，ECMAScript 6中的严格模式禁止设置[primitive](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive)值的属性.不采用严格模式,设置属性将会简单忽略(no-op),采用严格模式,将抛出`[TypeError](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError>)`错误

```
(function() {
  "use strict";

  false.true = "";              //TypeError
  (14).sailing = "home";        //TypeError
  "with".you = "far away";      //TypeError
})();
```

### 简化变量的使用

严格模式简化了代码中变量名字映射到变量定义的方式. 很多编译器的优化是依赖存储变量X位置的能力：这对全面优化JavaScript代码至关重要. JavaScript有些情况会使得代码中名字到变量定义的基本映射只在运行时才产生. 严格模式移除了大多数这种情况的发生, 所以编译器可以更好的优化严格模式的代码.

第一, 严格模式禁用 `with`. `with`所引起的问题是块内的任何名称可以映射(map)到with传进来的对象的属性, 也可以映射到包围这个块的作用域内的变量(甚至是全局变量), 这一切都是在运行时决定的: 在代码运行之前是无法得知的. 严格模式下, 使用 `with` 会引起语法错误, 所以就不会存在 with 块内的变量在运行时才决定引用到哪里的情况了:

```
"use strict";
var x = 17;
with (obj) { // !!! 语法错误
  // 如果没有开启严格模式，with中的这个x会指向with上面的那个x，还是obj.x？
  // 如果不运行代码，我们无法知道，因此，这种代码让引擎无法进行优化，速度也就会变慢。
  x;
}
```

一种取代 `with`的简单方法是，将目标对象赋给一个短命名变量，然后访问这个变量上的相应属性.

第二, `[严格模式下的 eval 不再为上层范围(surrounding scope,注:包围eval代码块的范围)引入新变量](<http://whereswalden.com/2011/01/10/new-es5-strict-mode-support-new-vars-created-by-strict-mode-eval-code-are-local-to-that-code-only/>)`. 在正常模式下,  代码 `eval("var x;")` 会给上层函数(surrounding function)或者全局引入一个新的变量 `x` . 这意味着, 一般情况下,  在一个包含 `eval` 调用的函数内所有没有引用到参数或者局部变量的名称都必须在运行时才能被映射到特定的定义 (因为 `eval` 可能引入的新变量会覆盖它的外层变量). 在严格模式下 `eval` 仅仅为被运行的代码创建变量, 所以 `eval` 不会使得名称映射到外部变量或者其他局部变量:

```
var x = 17;
var evalX = eval("'use strict'; var x = 42; x");
console.assert(x === 17);
console.assert(evalX === 42);
```

相应的, 如果函数 `eval` 被在严格模式下的`eval(...)`以表达式的形式调用时, 其代码会被当做严格模式下的代码执行. 当然也可以在代码中显式开启严格模式, 但这样做并不是必须的.

```
function strict1(str) {
  "use strict";
  return eval(str); // str中的代码在严格模式下运行
}
function strict2(f, str) {
  "use strict";
  return f(str); // 没有直接调用eval(...): 当且仅当str中的代码开启了严格模式时
                 // 才会在严格模式下运行
}
function nonstrict(str) {
  return eval(str); // 当且仅当str中的代码开启了"use strict"，str中的代码才会在严格模式下运行
}

strict1("'Strict mode code!'");
strict1("'use strict'; 'Strict mode code!'");
strict2(eval, "'Non-strict code.'");
strict2(eval, "'use strict'; 'Strict mode code!'");
nonstrict("'Non-strict code.'");
nonstrict("'use strict'; 'Strict mode code!'");
```

因此，在 eval 执行的严格模式代码下，变量的行为与严格模式下非 eval 执行的代码中的变量相同。

第三, 严格模式禁止删除声明变量。`delete name` 在严格模式下会引起语法错误：

```
"use strict";

var x;
delete x; // !!! 语法错误

eval("var y; delete y;"); // !!! 语法错误
```

### 让`eval`和`arguments`变的简单

严格模式让`arguments`和`eval`少了一些奇怪的行为。两者在通常的代码中都包含了很多奇怪的行为： `eval`会添加删除绑定，改变绑定好的值，还会通过用它索引过的属性给形参取别名的方式修改形参. 虽然在未来的ECMAScript版本解决这个问题之前，是不会有补丁来完全修复这个问题，但严格模式下将eval和arguments作为关键字对于此问题的解决是很有帮助的。

第一, 名称 `eval` 和 `arguments` 不能通过程序语法被绑定(be bound)或赋值. 以下的所有尝试将引起语法错误:

```
"use strict";
eval = 17;
arguments++;
++eval;
var obj = { set p(arguments) { } };
var eval;
try { } catch (arguments) { }
function x(eval) { }
function arguments() { }
var y = function eval() { };
var f = new Function("arguments", "'use strict'; return 17;");
```

第二，严格模式下，参数的值不会随 arguments 对象的值的改变而变化。在正常模式下，对于第一个参数是 arg 的函数，对 arg 赋值时会同时赋值给 arguments[`0`]，反之亦然（除非没有参数，或者 arguments[`0`] 被删除）。严格模式下，函数的 arguments 对象会保存函数被调用时的原始参数。arguments[i] 的值不会随与之相应的参数的值的改变而变化，同名参数的值也不会随与之相应的 arguments[i] 的值的改变而变化。

```
function f(a) {
  "use strict";
  a = 42;
  return [a, arguments[0]];
}
var pair = f(17);
console.assert(pair[0] === 42);
console.assert(pair[1] === 17);
```

第三，不再支持 `arguments.callee`。正常模式下，`arguments.callee` 指向当前正在执行的函数。这个作用很小：直接给执行函数命名就可以了！此外，`arguments.callee` 十分不利于优化，例如内联函数，因为 `arguments.callee` 会依赖对非内联函数的引用。在严格模式下，`arguments.callee` 是一个不可删除属性，而且赋值和读取时都会抛出异常：

```
"use strict";
var f = function() { return arguments.callee; };
f(); // 抛出类型错误
```

### "安全的" JavaScript

严格模式下更容易写出“安全”的JavaScript。现在有些网站提供了方式给用户编写能够被网站其他用户执行的JavaScript代码。在浏览器环境下，JavaScript能够获取用户的隐私信息，因此这类Javascript必须在运行前部分被转换成需要申请访问禁用功能的权限。没有很多的执行时检查的情况，Javascript的灵活性让它无法有效率地做这件事。一些语言中的函数普遍出现，以至于执行时检查他们会引起严重的性能损耗。做一些在严格模式下发生的小改动，要求用户提交的JavaScript开启严格模式并且用特定的方式调用，就会大大减少在执行时进行检查的必要。

第一，在严格模式下通过`this`传递给一个函数的值不会被强制转换为一个对象。对一个普通的函数来说，`this`总会是一个对象：不管调用时`this`它本来就是一个对象；还是用布尔值，字符串或者数字调用函数时函数里面被封装成对象的`this`；还是使用`undefined`或者`null`调用函数式`this`代表的全局对象（使用`[call](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call>)`, `[apply](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply>)`或者`[bind](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind>)`方法来指定一个确定的`this`）。这种自动转化为对象的过程不仅是一种性能上的损耗，同时在浏览器中暴露出全局对象也会成为安全隐患，因为全局对象提供了访问那些所谓安全的JavaScript环境必须限制的功能的途径。所以对于一个开启严格模式的函数，指定的`this`不再被封装为对象，而且如果没有指定`this`的话它值是`undefined`：

```
"use strict";
function fun() { return this; }
console.assert(fun() === undefined);
console.assert(fun.call(2) === 2);
console.assert(fun.apply(null) === null);
console.assert(fun.call(undefined) === undefined);
console.assert(fun.bind(true)() === true);
```

第二，在严格模式中再也不能通过广泛实现的ECMAScript扩展“游走于”JavaScript的栈中。在普通模式下用这些扩展的话，当一个叫`fun`的函数正在被调用的时候，`fun.caller`是最后一个调用`fun`的函数，而且`fun.arguments`包含调用`fun`时用的形参。这两个扩展接口对于“安全”JavaScript而言都是有问题的，因为他们允许“安全的”代码访问"专有"函数和他们的（通常是没有经过保护的）形参。如果`fun`在严格模式下，那么`fun.caller`和`fun.arguments`都是不可删除的属性而且在存值、取值时都会报错：

```
function restricted() {
  "use strict";
  restricted.caller;    // 抛出类型错误
  restricted.arguments; // 抛出类型错误
}

function privilegedInvoker() {
  return restricted();
}

privilegedInvoker();
```

第三，严格模式下的`arguments`不会再提供访问与调用这个函数相关的变量的途径。在一些旧时的ECMAScript实现中`arguments.caller`曾经是一个对象，里面存储的属性指向那个函数的变量。这是一个[安全隐患](http://stuff.mit.edu/iap/2008/facebook/)，因为它通过函数抽象打破了本来被隐藏起来的保留值；它同时也是引起大量优化工作的原因。出于这些原因，现在的浏览器没有实现它。但是因为它这种历史遗留的功能，`arguments.caller`在严格模式下同样是一个不可被删除的属性，在赋值或者取值时会报错：

```
"use strict";
function fun(a, b) {
  "use strict";
  var v = 12;
  return arguments.caller; // 抛出类型错误
}
fun(1, 2); // 不会暴露v（或者a，或者b）
```

### 为未来的ECMAScript版本铺平道路

未来版本的ECMAScript很有可能会引入新语法，ECMAScript5中的严格模式就提早设置了一些限制来减轻之后版本改变产生的影响。如果提早使用了严格模式中的保护机制，那么做出改变就会变得更容易。

第一，在严格模式中一部分字符变成了保留的关键字。这些字符包括`implements`, `interface`, `let`, `package`, `private`, `protected`, `public`, `static`和`yield`。在严格模式下，你不能再用这些名字作为变量名或者形参名。

```
function package(protected) { // !!!
  "use strict";
  var implements; // !!!

  interface: // !!!
  while (true) {
    break interface; // !!!
  }

  function private() { } // !!!
}
function fun(static) { 'use strict'; } // !!!
```

两个针对Mozilla开发的警告：第一，如果你的JavaScript版本在1.7及以上（你的chrome代码或者你正确使用了`<script type="">`）并且开启了严格模式的话，因为`let`和`yield`是最先引入的关键字，所以它们会起作用。但是网络上用`<script src="">`或者`<script>...</script>`加载的代码，`let`或者`yield`都不会作为关键字起作用；第二，尽管ES5无条件的保留了`class`, `enum`, `export`, `extends`, `import`和`super`关键字，在Firefox 5之前，Mozilla仅仅在严格模式中保留了它们。

第二，[严格模式禁止了不在脚本或者函数层面上的函数声明](http://whereswalden.com/2011/01/24/new-es5-strict-mode-requirement-function-statements-not-at-top-level-of-a-program-or-function-are-prohibited/)。在浏览器的普通代码中，在“所有地方”的函数声明都是合法的。这并不在ES5规范中（甚至是ES3）！这是一种针对不同浏览器中不同语义的一种延伸。未来的ECMAScript版本很有希望制定一个新的，针对不在脚本或者函数层面进行函数声明的语法。[在严格模式下禁止这样的函数声明](http://wiki.ecmascript.org/doku.php?id=conventions:no_non_standard_strict_decls)对于将来ECMAScript版本的推出扫清了障碍：

```
"use strict";
if (true) {
  function f() { } // !!! 语法错误
  f();
}

for (var i = 0; i < 5; i++) {
  function f2() { } // !!! 语法错误
  f2();
}

function baz() { // 合法
  function eit() { } // 同样合法
}
```

这种禁止放到严格模式中并不是很合适，因为这样的函数声明方式从ES5中延伸出来的。但这是ECMAScript委员会推荐的做法，浏览器就实现了这一点。

## 浏览器的严格模式

主流浏览器现在实现了严格模式。但是不要盲目的依赖它，因为市场上仍然有大量的浏览器版本只部分支持严格模式或者根本就不支持（比如IE10之前的版本）。*严格模式改变了语义。\*依赖这些改变可能会导致没有实现严格模式的浏览器中出现问题或者错误。谨慎地使用严格模式，通过检测相关代码的功能保证严格模式不出问题。最后，记得\*在支持或者不支持严格模式的浏览器中测试你的代码*。如果你只在不支持严格模式的浏览器中测试，那么在支持的浏览器中就很有可能出问题，反之亦然。

# Memory_Management

像C语言这样的底层语言一般都有底层的内存管理接口，比如 `malloc()`和`free()`。相反，JavaScript是在创建变量（对象，字符串等）时自动进行了分配内存，并且在不使用它们时“自动”释放。 释放的过程称为垃圾回收。这个“自动”是混乱的根源，并让JavaScript（和其他高级语言）开发者错误的感觉他们可以不关心内存管理。

## 内存生命周期

不管什么程序语言，内存生命周期基本是一致的：

1. 分配你所需要的内存
2. 使用分配到的内存（读、写）
3. 不需要时将其释放\归还

所有语言第二部分都是明确的。第一和第三部分在底层语言中是明确的，但在像JavaScript这些高级语言中，大部分都是隐含的。

### JavaScript 的内存分配

### 值的初始化

为了不让程序员费心分配内存，JavaScript 在定义变量时就完成了内存分配。

```
var n = 123; // 给数值变量分配内存
var s = "azerty"; // 给字符串分配内存

var o = {
  a: 1,
  b: null
}; // 给对象及其包含的值分配内存

// 给数组及其包含的值分配内存（就像对象一样）
var a = [1, null, "abra"]; 

function f(a){
  return a + 2;
} // 给函数（可调用的对象）分配内存

// 函数表达式也能分配一个对象
someElement.addEventListener('click', function(){
  someElement.style.backgroundColor = 'blue';
}, false);
```

### 通过函数调用分配内存

有些函数调用结果是分配对象内存：

```
var d = new Date(); // 分配一个 Date 对象

var e = document.createElement('div'); // 分配一个 DOM 元素
```

有些方法分配新变量或者新对象：

```
var s = "azerty";
var s2 = s.substr(0, 3); // s2 是一个新的字符串
// 因为字符串是不变量，
// JavaScript 可能决定不分配内存，
// 只是存储了 [0-3] 的范围。

var a = ["ouais ouais", "nan nan"];
var a2 = ["generation", "nan nan"];
var a3 = a.concat(a2); 
// 新数组有四个元素，是 a 连接 a2 的结果
```

### 使用值

使用值的过程实际上是对分配内存进行读取与写入的操作。读取与写入可能是写入一个变量或者一个对象的属性值，甚至传递函数的参数。

### 当内存不再需要使用时释放

大多数内存管理的问题都在这个阶段。在这里最艰难的任务是找到“哪些被分配的内存确实已经不再需要了”。它往往要求开发人员来确定在程序中哪一块内存不再需要并且释放它。

高级语言解释器嵌入了“垃圾回收器”，它的主要工作是跟踪内存的分配和使用，以便当分配的内存不再使用时，自动释放它。这只能是一个近似的过程，因为要知道是否仍然需要某块内存是[无法判定的](http://en.wikipedia.org/wiki/Decidability_(logic))（无法通过某种算法解决）。

## 垃圾回收

如上文所述自动寻找是否一些内存“不再需要”的问题是无法判定的。因此，垃圾回收实现只能有限制的解决一般问题。本节将解释必要的概念，了解主要的垃圾回收算法和它们的局限性。

### 引用

垃圾回收算法主要依赖于引用的概念。在内存管理的环境中，一个对象如果有访问另一个对象的权限（隐式或者显式），叫做一个对象引用另一个对象。例如，一个Javascript对象具有对它[原型](https://developer.mozilla.org/en/JavaScript/Guide/Inheritance_and_the_prototype_chain)的引用（隐式引用）和对它属性的引用（显式引用）。

在这里，“对象”的概念不仅特指 JavaScript 对象，还包括函数作用域（或者全局词法作用域）。

### 引用计数垃圾收集

这是最初级的垃圾收集算法。此算法把“对象是否不再需要”简化定义为“对象有没有其他对象引用到它”。如果没有引用指向该对象（零引用），对象将被垃圾回收机制回收。

### 示例

```
var o = { 
  a: {
    b:2
  }
}; 
// 两个对象被创建，一个作为另一个的属性被引用，另一个被分配给变量o
// 很显然，没有一个可以被垃圾收集

var o2 = o; // o2变量是第二个对“这个对象”的引用

o = 1;      // 现在，“这个对象”只有一个o2变量的引用了，“这个对象”的原始引用o已经没有

var oa = o2.a; // 引用“这个对象”的a属性
               // 现在，“这个对象”有两个引用了，一个是o2，一个是oa

o2 = "yo"; // 虽然最初的对象现在已经是零引用了，可以被垃圾回收了
           // 但是它的属性a的对象还在被oa引用，所以还不能回收

oa = null; // a属性的那个对象现在也是零引用了
           // 它可以被垃圾回收了
```

### 限制：循环引用

该算法有个限制：无法处理循环引用的事例。在下面的例子中，两个对象被创建，并互相引用，形成了一个循环。它们被调用之后会离开函数作用域，所以它们已经没有用了，可以被回收了。然而，引用计数算法考虑到它们互相都有至少一次引用，所以它们不会被回收。

```
function f(){
  var o = {};
  var o2 = {};
  o.a = o2; // o 引用 o2
  o2.a = o; // o2 引用 o

  return "azerty";
}

f();
```

### 实际例子

IE 6, 7 使用引用计数方式对 DOM 对象进行垃圾回收。该方式常常造成对象被循环引用时内存发生泄漏：

```
var div;
window.onload = function(){
  div = document.getElementById("myDivElement");
  div.circularReference = div;
  div.lotsOfData = new Array(10000).join("*");
};
```

在上面的例子里，`myDivElement` 这个 DOM 元素里的 `circularReference 属性`引用了 `myDivElement`，造成了循环引用。如果该属性没有显示移除或者设为 null，引用计数式垃圾收集器将总是且至少有一个引用，并将一直保持在内存里的 DOM 元素，即使其从DOM 树中删去了。如果这个 DOM 元素拥有大量的数据 (如上的 `lotsOfData` 属性)，而这个数据占用的内存将永远不会被释放。

### 标记-清除算法

这个算法把“对象是否不再需要”简化定义为“对象是否可以获得”。

这个算法假定设置一个叫做根（root）的对象（在Javascript里，根是全局对象）。垃圾回收器将定期从根开始，找所有从根开始引用的对象，然后找这些对象引用的对象……从根开始，垃圾回收器将找到所有可以获得的对象和收集所有不能获得的对象。

这个算法比前一个要好，因为“有零引用的对象”总是不可获得的，但是相反却不一定，参考“循环引用”。

从2012年起，所有现代浏览器都使用了标记-清除垃圾回收算法。所有对JavaScript垃圾回收算法的改进都是基于标记-清除算法的改进，并没有改进标记-清除算法本身和它对“对象是否不再需要”的简化定义。

### 循环引用不再是问题了

在上面的示例中，函数调用返回之后，两个对象从全局对象出发无法获取。因此，他们将会被垃圾回收器回收。第二个示例同样，一旦 div 和其事件处理无法从根获取到，他们将会被垃圾回收器回收。

### 限制: 那些无法从根对象查询到的对象都将被清除

尽管这是一个限制，但实践中我们很少会碰到类似的情况，所以开发者不太会去关心垃圾回收机制。



# 面向切面的编程

AOP(面向切面编程)的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，这些跟业务逻辑无关的功能通常包括日志统计、安全控制、异常处理等。把这些功能抽离出来之后， 再通过“动态织入”的方式掺入业务逻辑模块中。

**AOP能给我们带来什么好处？**

AOP的好处首先是可以保持业务逻辑模块的纯净和高内聚性，其次是可以很方便地复用日志统计等功能模块。

**JavaScript实现AOP的思路？**

通常，在 JavaScript 中实现 AOP，都是指把一个函数“动态织入”到另外一个函数之中，具体的实现技术有很多，下面我用扩展 Function.prototype 来做到这一点。

主要就是两个函数，在Function的原型上加上before与after，作用就是字面的意思，在函数的前面或后面执行，相当于**无侵入**把一个函数插入到另一个函数的前面或后面，应用得当可以很好的实现代码的解耦。

```jsx
//Aop构造器
function Aop(options){
    this.options = options
}
//业务方法执行前钩子
Aop.prototype.before = function(cb){
    cb.apply(this)
}
//业务方法执行后钩子
Aop.prototype.after = function(cb){
    cb.apply(this)
}
//业务方法执行器
Aop.prototype.execute = function(beforeCb,runner,afterCb){
    this.before(beforeCb)
    runner.apply(this)
    this.after(afterCb)
}

var aop = new Aop({
    afterInfo:'执行后',
    runnerInfo:'执行中',
    beforeInfo:'执行前'
})

var beforeCb = function(){
    console.log(this.options.beforeInfo)
}
var afterCb = function(){
    console.log(this.options.afterInfo)
}
var runnerCb = function(){
    console.log(this.options.runnerInfo)
}

aop.execute(beforeCb,runnerCb,afterCb)
```

应用的一些例子：

1. 为window.onload添加方法，防止window.onload被二次覆盖
2. 无侵入统计某个函数的执行时间
3. 表单校验
4. 统计埋点
5. 防止csrf攻击

# 高阶函数

高阶函数英文叫Higher-order function：JavaScript的函数其实都指向某个变量。既然变量可以指向函数，函数的参数能接收变量，那么一个函数就可以接收另一个函数作为参数，这种函数就称之为高阶函数。

```jsx
## Array中的高阶函数
map其实就是就是传入一个函数，操作原数组；
'use strict';

function pow(x) {
    return x * x;
}
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var results = arr.map(pow); // [1, 4, 9, 16, 25, 36, 49, 64, 81]
console.log(results);
```

# async原理解析

# **目录**

- async函数是什么
- async函数原理
- 常见的关于`async`的笔试题

# **async函数**

```
const fs = require('fs');

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error){
          return reject(error);
        }
        resolve(data);
    });
  });
};

const foo = function* () {
  const f1 = yield readFile('/src/lib');
  const f2 = yield readFile('/src/utils');

  console.log(f1.toString());
  console.log(f2.toString());
};
```

把上面代码的`Generator`函数 `foo` 可以写成 `async` 函数，就是这样：

```
  const asyncReadFile = async function () {
  const f1 = await readFile('/src/lib');
  const f2 = await readFile('/src/utils');

  console.log(f1.toString());
  console.log(f2.toString());
};
```

可以发现，`async`函数就是将`Generator`函数的星号(`*`)替换成`async`，将 `yield`替换成 `await`，仅此而已。

`async`函数是基于 `Generator`的改进，体现在以下4点

1. 内置执行器。`Generator`函数的执行必须靠执行器。所以才有了 `Thunk`函数和`co`模块，而 `async`函数自带执行器。`async`函数的执行和普通函数一样。

```
asyncReadFile();
```

1. 更好的语义。`async`和 `await`，比起星号和`yield`，语义更清楚了。`async`表示函数里有异步操作，`await`表示紧跟在后面的表达式需要等待结果。
2. 更广的适应性。即使 `Generator`函数可以借助`co`模块自动执行，但是`co`模块后面只能是`Thunk`函数或`Promise`对象，而`async`函数的`await`命令后面，可以是 Promise对象和原始类型的值（数值、字符串和布尔值，但这是会自动转成立即 `resolved`的 `Promise对象`）
3. 返回值是 `Promise`。aysnc函数返回值为 `Promise`，这比`Generator`函数的返回值是`Iterator`对象方便多了。

`async`函数完全可以看作多个异步操作，包装成的一个`Promise` 对象，而await命令就是内部`then`命令的语法糖。

> 总是就是 Generator 函数虽然是JS借鉴其他语言，根据JS本身单线程的特点实现的协程，但是使用起来会麻烦很多，而 async函数就是为了解决这些重复的事情而生的。其实  async函数就是将Generaor函数和自动执行器包装了在了一起，然后润色了一下。

# **async函数的实现原理**

就是将Generator函数和自动执行器，包装在一个函数里。

```
async function fn(args) {
// ...
}
function fn(args) {
    return spawn(function* () {
// ...
    })
}
```

所有的 `async` 函数都可以写成上面的第二种形式，其中 spawn 函数就是自动执行器。

```
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch(e) {
        return reject(e);
      }
      if(next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    step(function() { return gen.next(undefined); });
  });
}
```

# **常见的关于`async`的笔试题**

- 实现一个`sleep`
- 实现一个红绿灯：红灯2秒，黄灯1秒，绿灯3秒
- 使用 `async` 实现`Promise.all()`的效果

# **实现一个 sleep**

每隔1秒输出 1， 2， 3， 4， 5

```
function sleep(interval) {
    return new Promise(resolve => {
        setTimeout(resolve, interval);
    })
}

// 用法
async function one2FiveInAsync() {
    for (let i = 1; i <= 5; i++) {
        console.log(i);
        await sleep(1000);
    }
}
one2FiveInAsync();
```

### **实现一个红绿灯**

红灯2秒，黄灯1秒，绿灯3秒

```
function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    })
}
async function changeColor(color, duration) {
    console.log('当前颜色', color);
    await sleep(duration);
}
async function main() {
    await changeColor('红色', 2000);
    await changeColor('黄色', 1000);
    await changeColor('绿色', 3000);
}
main();
```

### **使用 async 实现 Promise.all()的效果**

```
// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法二
let fooPromise = getFoo();
let barPromise = getBar();

let foo = await fooPromise;
let foo = await barPromise;
```

上面两种写法，getFoo 和 getBar 都是同时触发的，这样就会缩短程序的执行时间。

