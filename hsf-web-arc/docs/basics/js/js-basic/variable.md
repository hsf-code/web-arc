---
title: 变量
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

## 基础

JavaScript 借鉴了 Java 的大部分语法，但同时也受到 *Awk，Perl* 和 *Python*的影响。

JavaScript 是**区分大小写**的，并使用 **Unicode** 字符集。举个例子，可以将单词 Früh （在德语中意思是“早”）用作变量名。

```jsx
var Früh = "foobar";
```

但是，由于 JavaScript 是大小写敏感的，因此变量 `früh` 和 `Früh` 则是两个不同的变量。

在 JavaScript 中，指令被称为语句 （[Statement](https://developer.mozilla.org/zh-CN/docs/Glossary/Statement)），并用分号（;）进行分隔。

如果一条语句独占一行的话，那么分号是可以省略的。（译者注：并不建议这么做。）但如果一行中有多条语句，那么这些语句必须以分号分开。 ECMAScript 规定了在语句的末尾自动插入分号（[ASI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Automatic_semicolon_insertion)）。（如果想要了解更多信息，请参阅 JavaScript [词法语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Lexical_grammar) 。）虽然不是必需的，但是在一条语句的末尾加上分号是一个很好的习惯。这个习惯可以大大减少代码中产生 bug 的可能性。

Javascript 源码从左往右被扫描并转换成一系列由 token 、控制字符、行终止符、注释和空白字符组成的输入元素。空白字符指的是空格、制表符和换行符等。

## 注释

**Javascript 注释**的语法和 C++ 或许多其他语言类似：

```jsx
// 单行注释

/* 这是一个更长的,
   多行注释
*/

/* 然而, 你不能, /* 嵌套注释 */ 语法错误 */
```

在代码执行过程中，注释将被自动跳过（不执行）。

## 声明

JavaScript有三种声明方式。

**`[var](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/var>)`**声明一个变量，可选初始化一个值。**`[let](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let>)`**声明一个块作用域的局部变量，可选初始化一个值。**`[const](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const>)`**声明一个块作用域的只读常量。

### 变量

在应用程序中，使用变量来作为值的符号名。变量的名字又叫做[标识符](https://developer.mozilla.org/zh-CN/docs/Glossary/Identifier)，其需要遵守一定的规则。

一个 JavaScript 标识符必须以字母、下划线（_）或者美元符号（$）开头；后续的字符也可以是数字（0-9）。因为 JavaScript 语言是区分大小写的，所以字母可以是从“A”到“Z”的大写字母和从“a”到“z”的小写字母。

你可以使用大部分 ISO 8859-1 或 Unicode 编码的字符作标识符，例如 å 和 ü（详情可查看[这篇博客文章](https://mathiasbynens.be/notes/javascript-identifiers-es6)）。你也可以使用 [Unicode 转义字符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#String_literals) 作标识符。

合法的标识符示例：`Number_hits`，`temp99`，`$credit` 和 `_name`。

### 声明变量

你可以用以下三种方式声明变量：

- 使用关键词 `var` 。例如 `var x = 42`。这个语法可以用来声明局部变量和全局变量。
- 直接赋值。例如`x = 42`。在函数外使用这种形式赋值，会产生一个全局变量。在严格模式下会产生错误。因此你不应该使用这种方式来声明变量。
- 使用关键词 `let` 。例如 `let y = 13`。这个语法可以用来声明块作用域的局部变量。參考下方[变量的作用域(Variable scope)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types#变量的作用域) 。

### 变量求值

用 `var` 或 `let` 语句声明的变量，如果没有赋初始值，则其值为 `undefined` 。

如果访问一个未声明的变量会导致抛出一个引用错误（ReferenceError）异常：

```jsx
var a;
console.log("The value of a is " + a); // a 的值是 undefined

console.log("The value of b is " + b);// b 的值是 undefined 
var b;
// 在你阅读下面的‘变量声明提升’前你可能会疑惑

console.log("The value of c is " + c); // 未捕获的引用错误： c 未被定义

let x;
console.log("The value of x is " + x); // x 的值是 undefined

console.log("The value of y is " + y);// 未捕获的引用错误： y 未被定义
let y;
```

你可以使用 `undefined` 来判断一个变量是否已赋值。在以下的代码中，变量`input`未被赋值，因此 `[if](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Statements/if...else>)` 条件语句的求值结果是 `true` 。

```jsx
var input;
if(input === undefined){
  doThis();
} else {
  doThat();
}
```

`undefined` 值在布尔类型环境中会被当作 `false` 。例如，下面的代码将会执行函数 `myFunction`，因为数组 `myArray` 中的元素未被赋值：

```jsx
var myArray = [];
if (!myArray[0])   myFunction(); 
```

数值类型环境中 `undefined` 值会被转换为 `NaN`。

```jsx
var a;
a + 2;    // 计算为 NaN
```

当你对一个 `null` 变量求值时，空值 `null` 在数值类型环境中会被当作0来对待，而布尔类型环境中会被当作 `false`。例如：

```jsx
var n = null;
console.log(n * 32); // 在控制台中会显示 0
```

### 变量的作用域

在函数之外声明的变量，叫做*全局*变量，因为它可被当前文档中的任何其他代码所访问。在函数内部声明的变量，叫做*局部*变量，因为它只能在当前函数的内部访问。

ECMAScript 6 之前的 JavaScript 没有 [语句块](https://developer.mozilla.org/zh-CN/docs/JavaScript/Guide/Statements#Block_Statement) 作用域；相反，语句块中声明的变量将成为语句块所在函数（或全局作用域）的局部变量。例如，如下的代码将在控制台输出 5，因为 `x` 的作用域是声明了 `x` 的那个函数（或全局范围），而不是 `if` 语句块。

```jsx
if (true) {
  var x = 5;
}
console.log(x); // 5
```

如果使用 ECMAScript 6 中的 `let` 声明，上述行为将发生变化。

```jsx
if (true) {
  let y = 5;
}
console.log(y); // ReferenceError: y 没有被声明
```

### 变量提升

JavaScript 变量的另一个不同寻常的地方是，你可以先使用变量稍后再声明变量而不会引发异常。这一概念称为变量提升；JavaScript 变量感觉上是被“提升”或移到了函数或语句的最前面。但是，提升后的变量将返回 undefined 值。因此在使用或引用某个变量之后进行声明和初始化操作，这个被提升的变量仍将返回 undefined 值。

```jsx
/**
 * 例子1
 */
console.log(x === undefined); // true
var x = 3;

/**
 * 例子2
 */
// will return a value of undefined
var myvar = "my value";

(function() {
  console.log(myvar); // undefined
  var myvar = "local value";
})();
```

上面的例子，也可写作：

```jsx
/**
 * 例子1
 */
var x;
console.log(x === undefined); // true
x = 3;
 
/**
 * 例子2
 */
var myvar = "my value";
 
(function() {
  var myvar;
  console.log(myvar); // undefined
  myvar = "local value";
})();
```

由于存在变量提升，一个函数中所有的`var`语句应尽可能地放在接近函数顶部的地方。这个习惯将大大提升代码的清晰度。

在 ECMAScript 6 中，let（const）同样**会被提升**变量到代码块的顶部但是不会被赋予初始值。在变量声明之前引用这个变量，将抛出引用错误（ReferenceError）。这个变量将从代码块一开始的时候就处在一个“暂时性死区”，直到这个变量被声明为止。

```jsx
console.log(x); // ReferenceError
let x = 3;
```

### 函数提升

对于函数来说，只有函数声明会被提升到顶部，而函数表达式不会被提升。

```jsx
/* 函数声明 */

foo(); // "bar"

function foo() {
  console.log("bar");
}

/* 函数表达式 */

baz(); // 类型错误：baz 不是一个函数

var baz = function() {
  console.log("bar2");
};
```

### 全局变量

实际上，全局变量是*全局对象*的属性。在网页中，（译注：缺省的）全局对象是 `window` ，所以你可以用形如 `window.*variable`* 的语法来设置和访问全局变量。

因此，你可以通过指定 window 或 frame 的名字，在当前 window 或 frame 访问另一个 window 或 frame 中声明的变量。例如，在文档里声明一个叫 `phoneNumber` 的变量，那么你就可以在子框架里使用 `parent.phoneNumber` 的方式来引用它。

### 常量(Constants)

你可以用关键字 `const` 创建一个只读的常量。常量标识符的命名规则和变量相同：必须以字母、下划线（_）或美元符号（$）开头并可以包含有字母、数字或下划线。

```jsx
const PI = 3.14;
```

常量不可以通过重新赋值改变其值，也不可以在代码运行时重新声明。它必须被初始化为某个值。

常量的作用域规则与 `let` 块级作用域变量相同。若省略`const`关键字，则该标识符将被视为变量。

在同一作用域中，不能使用与变量名或函数名相同的名字来命名常量。例如：

```jsx
// 这会造成错误
function f() {};
const f = 5;

// 这也会造成错误
function f() {
  const g = 5;
  var g;

  //语句
}
```

然而，对象属性被赋值为常量是不受保护的，所以下面的语句执行时不会产生错误。

```jsx
const MY_OBJECT = {"key": "value"};
MY_OBJECT.key = "otherValue";
```

同样的，数组的被定义为常量也是不受保护的，所以下面的语句执行时也不会产生错误。

```jsx
const MY_ARRAY = ['HTML','CSS'];
MY_ARRAY.push('JAVASCRIPT');
console.log(MY_ARRAY); //logs ['HTML','CSS','JAVASCRIPT'];
```

## 数据结构和类型

### 数据类型

最新的 ECMAScript 标准定义了8种数据类型：

- 七种基本数据类型:
  - 布尔值（Boolean），有2个值分别是：`true` 和 `false`.
  - null ， 一个表明 null 值的特殊关键字。 JavaScript 是大小写敏感的，因此 `null` 与 `Null`、`NULL`或变体完全不同。
  - undefined ，和 null 一样是一个特殊的关键字，undefined 表示变量未赋值时的属性。
  - 数字（Number），整数或浮点数，例如： `42` 或者 `3.14159`。
  - 任意精度的整数 (BigInt) ，可以安全地存储和操作大整数，甚至可以超过数字的安全整数限制。
  - 字符串（String），字符串是一串表示文本值的字符序列，例如："Howdy" 。
  - 代表（Symbol） ( 在 ECMAScript 6 中新添加的类型).。一种实例是唯一且不可改变的数据类型。
- 以及对象（Object）。

虽然这些数据类型相对来说比较少，但是通过他们你可以在程序中开发有用的功能。对象（[Objects](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Object)）和函数（[functions](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Function)）是这门语言的另外两个基本元素。你可以把对象当作存放值的一个命名容器，然后将函数当作你的程序能够执行的步骤。

### 数据类型的转换

JavaScript是一种动态类型语言(dynamically typed language)。这意味着你在声明变量时可以不必指定数据类型，而数据类型会在代码执行时会根据需要自动转换。因此，你可以按照如下方式来定义变量：

```jsx
var answer = 42;
```

然后，你还可以给同一个变量赋予一个字符串值，例如：

```jsx
answer = "Thanks for all the fish...";
```

因为 JavaScript 是动态类型的，这种赋值方式并不会提示出错。

在包含的数字和字符串的表达式中使用加法运算符（+），JavaScript 会把数字转换成字符串。例如，观察以下语句：

```jsx
x = "The answer is " + 42 // "The answer is 42"
y = 42 + " is the answer" // "42 is the answer"
```

在涉及其它运算符（译注：如下面的减号'-'）时，JavaScript语言不会把数字变为字符串。例如（译注：第一例是数学运算，第二例是字符串运算）：

```jsx
"37" - 7 // 30
"37" + 7 // "377"
```

### 字符串转换为数字

有一些方法可以将内存中表示一个数字的字符串转换为对应的数字。

### `parseInt()`和`parseFloat()`

参见：`[parseInt()](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/parseInt>)`和`[parseFloat()](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/parseFloat>)`的相关页面。

`parseInt` 方法只能返回整数，所以使用它会丢失小数部分。另外，调用 parseInt 时最好总是带上进制(radix) 参数，这个参数用于指定使用哪一种进制。

将字符串转换为数字的另一种方法是使用一元**加法运算符**。

```jsx
"1.1" + "1.1" = "1.11.1"
(+"1.1") + (+"1.1") = 2.2   
// 注意：加入括号为清楚起见，不是必需的。
```

## 字面量 (Literals)

（译注：字面量是由语法表达式定义的常量；或，通过由一定字词组成的语词表达式定义的常量）

在JavaScript中，你可以使用各种字面量。这些字面量是脚本中按字面意思给出的固定的值，而不是变量。（译注：字面量是常量，其值是固定的，而且在程序脚本运行中不可更改，比如*false*，3.1415，thisIsStringOfHelloworld **，invokedFunction: myFunction("myArgument")。本节将介绍以下类型的字面量：

- [数组字面量(Array literals)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types#数组字面量(Array_literals))
- [布尔字面量(Boolean literals)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types#布尔字面量(Boolean_literals))
- [浮点数字面量(Floating-point literals)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types#浮点数字面量(Floating-point_literals))
- [整数(Integers)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types#整数(Integers))
- [对象字面量(Object literals)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types#对象字面量(Object_literals))
- [RegExp literals](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types#RegExp_literals)
- [字符串字面量(String literals)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types#字符串字面量(String_literals))

### 数组字面量 (Array literals)

数组字面值是一个封闭在方括号对([])中的包含有零个或多个表达式的列表，其中每个表达式代表数组的一个元素。当你使用数组字面值创建一个数组时，该数组将会以指定的值作为其元素进行初始化，而其长度被设定为元素的个数。

下面的示例用3个元素生成数组`coffees`，它的长度是3。

```jsx
var coffees = ["French Roast", "Colombian", "Kona"];

var a=[3];

console.log(a.length); // 1

console.log(a[0]); // 3
```

**注意** 这里的数组字面值也是一种对象初始化器。参考[对象初始化器的使用](https://developer.mozilla.org/zh-CN/docs/JavaScript/Guide/Working_with_Objects#Using_Object_Initializers)。

若在顶层（全局）脚本里用字面值创建数组，JavaScript语言将会在每次对包含该数组字面值的表达式求值时解释该数组。另一方面，在函数中使用的数组，将在每次调用函数时都会被创建一次。

数组字面值同时也是数组对象。有关数组对象的详情请参见[数组对象](https://developer.mozilla.org/zh-CN/docs/JavaScript/Guide/Predefined_Core_Objects#Array_Object)一文。

### 数组字面值中的多余逗号

（译注：声明时）你不必列举数组字面值中的所有元素。若你在同一行中连写两个逗号（,），数组中就会产生一个没有被指定的元素，其初始值是`undefined`。以下示例创建了一个名为`fish`的数组：

```jsx
var fish = ["Lion", , "Angel"];
```

在这个数组中，有两个已被赋值的元素，和一个空元素（fish[0]是"Lion"，fish[1]是undefined，而fish[2]是"Angel"；译注：此时数组的长度属性fish.length是3)。

如果你在元素列表的尾部添加了一个逗号，它将会被忽略。在下面的例子中，数组的长度是3，并不存在myList[3]这个元素（译注：这是指数组的第4个元素噢，作者是在帮大家复习数组元素的排序命名方法）。元素列表中其它所有的逗号都表示一个新元素（的开始）。

**注意：**尾部的逗号在早期版本的浏览器中会产生错误，因而编程时的最佳实践方式就是移除它们。

(译注：而“现代”的浏览器似乎鼓励这种方式，这也很好解释原因。尾部逗号可以减少向数组的最后添加元素时，因为忘记为这最后一个元素加逗号 所造成的错误。)

```jsx
var myList = ['home', , 'school', ];
```

在下面的例子中，数组的长度是4，元素`myList[0]`和`myList[2]`缺失（译注：没被赋值，因而是undefined）。

```jsx
var myList = [ , 'home', , 'school'];
```

再看一个例子。在这里，该数组的长度是4，元素`myList[1]`和`myList[3]`被漏掉了。（但是）只有最后的那个逗号被忽略。

```jsx
var myList = ['home', , 'school', , ];
```

理解多余的逗号（在脚本运行时会被如何处理）的含义，对于从语言层面理解JavaScript是十分重要的。但是，在你自己写代码时：**显式地将缺失的元素声明为`undefined`，将大大提高你的代码的清晰度和可维护性**。

### 布尔字面量 (Boolean literals)

（译注：即逻辑字面量）

布尔类型有两种字面量：`true`和`false`。

不要混淆作为布尔对象的真和假与布尔类型的原始值true和false。布尔对象是原始布尔数据类型的一个包装器。参见 [布尔对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)。

### 整数 (Integers)

（译注：原文如此，没写成“整数字面量”，这里指的是整数字面量。）

整数可以用十进制（基数为10）、十六进制（基数为16）、八进制（基数为8）以及二进制（基数为2）表示。

- 十进制整数字面量由一串数字序列组成，且没有前缀0。
- 八进制的整数以 0（或0O、0o）开头，只能包括数字0-7。
- 十六进制整数以0x（或0X）开头，可以包含数字（0-9）和字母 a~f 或 A~F。
- 二进制整数以0b（或0B）开头，只能包含数字0和1。

严格模式下，八进制整数字面量必须以0o或0O开头，而不能以0开头。

整数字面量举例：

```jsx
0, 117 and -345 (十进制, 基数为10)
015, 0001 and -0o77 (八进制, 基数为8) 
0x1123, 0x00111 and -0xF1A7 (十六进制, 基数为16或"hex")
0b11, 0b0011 and -0b11 (二进制, 基数为2)
```

### 浮点数字面量 (Floating-point literals)

浮点数字面值可以有以下的组成部分：

- 一个十进制整数，可以带正负号（即前缀“+”或“ - ”），
- 小数点（“.”），
- 小数部分（由一串十进制数表示），
- 指数部分。

指数部分以“e”或“E”开头，后面跟着一个整数，可以有正负号（即前缀“+”或“-”）。浮点数字面量至少有一位数字，而且必须带小数点或者“e”（大写“E”也可）。

简言之，其语法是：

```jsx
[(+|-)][digits][.digits][(E|e)[(+|-)]digits]
```

例如：

```jsx
3.14      
-.2345789 // -0.23456789
-3.12e+12  // -3.12*1012
.1e-23    // 0.1*10-23=10-24=1e-24
```

### 对象字面量 (Object literals)

对象字面值是封闭在花括号对({})中的一个对象的零个或多个"属性名-值"对的（元素）列表。你不能在一条语句的开头就使用对象字面值，这将导致错误或产生超出预料的行为， 因为此时左花括号（{）会被认为是一个语句块的起始符号。（译者：这 里需要对语句statement、块block等基本名词的解释）

以下是一个对象字面值的例子。对象car的第一个元素（译注：即一个属性/值对）定义了属性myCar；第二个元素，属性getCar，引用了一个函数（即CarTypes("Honda")）；第三个元素，属性special，使用了一个已有的变量（即Sales）。

```jsx
var Sales = "Toyota";

function CarTypes(name) {
  return (name === "Honda") ?
    name :
    "Sorry, we don't sell " + name + "." ;
}

var car = { myCar: "Saturn", getCar: CarTypes("Honda"), special: Sales };

console.log(car.myCar);   // Saturn
console.log(car.getCar);  // Honda
console.log(car.special); // Toyota 
```

更进一步的，你可以使用数字或字符串字面值作为属性的名字，或者在另一个字面值内嵌套上一个字面值。如下的示例中使用了这些可选项。

```jsx
var car = { manyCars: {a: "Saab", "b": "Jeep"}, 7: "Mazda" };

console.log(car.manyCars.b); // Jeep
console.log(car[7]); // Mazda
```

对象属性名字可以是任意字符串，包括空串。如果对象属性名字不是合法的javascript标识符，它必须用""包裹。属性的名字不合法，那么便不能用.访问属性值，而是通过类数组标记("[]")访问和赋值。

```jsx
var unusualPropertyNames = {
  "": "An empty string",
  "!": "Bang!"
}
console.log(unusualPropertyNames."");   // 语法错误: Unexpected string
console.log(unusualPropertyNames[""]);  // An empty string
console.log(unusualPropertyNames.!);    // 语法错误: Unexpected token !
console.log(unusualPropertyNames["!"]); // Bang!
```

### 增强的对象字面量 (Enhanced Object literals)

在ES2015，对象字面值扩展支持在创建时设置原型，简写了 foo: foo 形式的属性赋值，方法定义，支持父方法调用，以及使用表达式动态计算属性名。总之，这些也使对象字面值和类声明更加紧密地联系起来，让基于对象的设计从这些便利中更加受益。

```
var obj = {
    // __proto__
    __proto__: theProtoObj,
    // Shorthand for ‘handler: handler’
    handler,
    // Methods
    toString() {
     // Super calls
     return "d " + super.toString();
    },
    // Computed (dynamic) property names
    [ 'prop_' + (() => 42)() ]: 42
};
```

请注意：

```
var foo = {a: "alpha", 2: "two"};
console.log(foo.a);    // alpha
console.log(foo[2]);   // two
//console.log(foo.2);  // SyntaxError: missing ) after argument list
//console.log(foo[a]); // ReferenceError: a is not defined
console.log(foo["a"]); // alpha
console.log(foo["2"]); // two
```

### RegExp 字面值

一个正则表达式是字符被斜线（译注：正斜杠“/”）围成的表达式。下面是一个正则表达式文字的一个例子。

```
var re = /ab+c/;
```

### 字符串字面量 (String literals)

字符串字面量是由双引号（"）对或单引号（'）括起来的零个或多个字符。字符串被限定在同种引号之间；也即，必须是成对单引号或成对双引号。下面的例子都是字符串字面值：

```
"foo"
'bar'
"1234"
"one line \\n another line"
"John's cat"
```

你可以在字符串字面值上使用字符串对象的所有方法——JavaScript会自动将字符串字面值转换为一个临时字符串对象，调用该方法，然后废弃掉那个临时的字符串对象。你也能用对字符串字面值使用类似String.length的属性：

```
console.log("John's cat".length) 
// 将打印字符串中的字符个数（包括空格） 
// 结果为：10
```

在ES2015中，还提供了一种模板字面量（template literals），模板字符串提供了一些语法糖来帮你构造字符串。这与Perl、Python还有其他语言中的字符串插值（string interpolation）的特性非常相似。除此之外，你可以在通过模板字符串前添加一个tag来自定义模板字符串的解析过程，这可以用来防止注入攻击，或者用来建立基于字符串的高级数据抽象。

```
// Basic literal string creation
`In JavaScript '\\n' is a line-feed.`// Multiline strings
`In JavaScript this is
 not legal.`// String interpolation
var name = "Bob", time = "today";
`Hello ${name}, how are you ${time}?`// Construct an HTTP request prefix is used to interpret the replacements and construction
POST`http://foo.org/bar?a=${a}&b=${b}
     Content-Type: application/json
     X-Credentials: ${credentials}
     { "foo": ${foo},
       "bar": ${bar}}`(myOnReadyStateChangeHandler);
```

除非有特别需要使用字符串对象，否则,你应当始终使用字符串字面值。要查看字符串对象的有关细节，请参见[字符串对象](https://developer.mozilla.org/zh-CN/docs/JavaScript/Guide/Predefined_Core_Objects#String_Object)。

### 在字符串中使用的特殊字符

作为一般字符的扩展，你可以在字符串中使用特殊字符，如下例所示。

```
"one line \\n another line"
```

以下表格列举了你能在JavaScript的字符串中使用的特殊字符。

[Untitled](https://www.notion.so/0079d70109a64da28ef73adacb6a5bad)

译注：严格模式下，不能使用八进制转义字符。

### 转义字符

对于那些未出现在表2.1中的字符，其所带的前导反斜线'\'将被忽略。但是，这一用法已被废弃，应当避免使用。

通过在引号前加上反斜线'\'，可以在字符串中插入引号，这就是*引号转义*。例如:

```
var quote = "He read \\"The Cremation of Sam McGee\\" by R.W. Service.";
console.log(quote);
```

代码的运行结果为:

```
He read "The Cremation of Sam McGee" by R.W. Service.
```

要在字符串中插入'\'字面值，必须转义反斜线。例如，要把文件路径 c:\temp 赋值给一个字符串，可以采用如下方式:

```
var home = "c:\\\\temp";
```

也可以在换行之前加上反斜线以转义换行（译注：实际上就是一条语句拆成多行书写），这样反斜线和换行都不会出现在字符串的值中。

```
var str = "this string \\
is broken \\
across multiple\\
lines."
console.log(str);   // this string is broken across multiplelines.
```

Javascript没有“heredoc”语法，但可以用行末的换行符转义和转义的换行来近似实现

```
var poem = 
"Roses are red,\\n\\
Violets are blue.\\n\\
Sugar is sweet,\\n\\
and so is foo."
```

ECMAScript 2015 增加了一种新的字面量，叫做模板字面量 **[template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings)。**它包含一些新特征，包括了多行字符串！

```
var poem =
`Roses are red,
Violets are blue.
Sugar is sweet,
and so is foo.`
```



## 语句块

最基本的语句是用于组合语句的语句块。该块由一对大括号界定：

```
{
   statement_1;   
   statement_2;
   statement_3;
   .
   .
   .
   statement_n;
}
```

### **示例**

语句块通常用于流程控制，如`if`，`for`，`while`等等。

```
while (x < 10) { x++; }
```

这里`{ x++; }`就是语句块。

**重要**：在ECMAScript 6标准之前，Javascript没有块作用域。在一个块中引入的变量的作用域是包含函数或脚本，并且设置它们的效果会延续到块之外。换句话说，块语句不定义范围。JavaScript中的“独立”块会产生与C或Java中完全不同的结果。示例：

```
var x = 1;
{
  var x = 2;
}
alert(x); // 输出的结果为 2
```

这段代码的输出是**2**，这是因为块级作用域中的 var x变量声明与之前的声明在同一个作用域内。在C语言或是Java语言中，同样的代码输出的结果是1。

从 ECMAScript 2015 开始，使用 `let` 和`const`变量是块作用域的。 更多信息请参考 `[let](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let>)` 和 `[const](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const>)`。

## 条件判断语句

条件判断语句指的是根据指定的条件所返回的结果（真或假或其它预定义的），来执行特定的语句。JavaScript 支持两种条件判断语句：`if...else`和`switch`。

### `if...else` 语句

当一个逻辑条件为真，用if语句执行一个语句。当这个条件为假，使用可选择的 else 从句来执行这个语句。if 语句如下所示：

```
if (condition) {
  statement_1;
}else {
  statement_2;
} //推荐使用严格的语句块模式，语句else可选
```

条件可以是任何返回结果被计算为true 或 false的表达式。如果条件表达式返回的是 true，statement_1 语句会被执行；否则，statement_2 被执行。statement_1 和 statement_2 可以是任何语句，甚至你可以将另一个if语句嵌套其中。

你也可以组合语句通过使用 `else if` 来测试连续多种条件判断，就像下面一样:

```
if (condition_1) {
  statement_1;
}else if (condition_2) {
  statement_2;
}else if (condition_n_1) {
  statement_n;
}else {
  statement_last;
}
```

要执行多个语句，可以使用语句块({ ... }) 来分组这些语句。通常，总是使用语句块是一个好的习惯，特别是在代码涉及比较多的 if 语句时:

```
if (条件) {
  当条件为真的时候，执行语句1;
  当条件为真的时候，执行语句2;
} else {
  当条件为假的时候，执行语句3;
  当条件为假的时候，执行语句4;
}
```

不建议在条件表达式中使用赋值语句，因为在快速查阅代码时容易把它看成等值比较。例如，不要使用下面的代码：

if(x = y){

/* 语句 */

}

如果你需要在条件表达式中使用赋值，通常在赋值语句前后额外添加一对括号。例如：

```
if ((x = y)) {
  /* statements here */
}
```

### 错误的值

下面这些值将被计算出 false (also known as [Falsy](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy) values):

- `false`
- `undefined`
- `null`
- `0`
- `NaN`
- 空字符串（`""`）

当传递给条件语句所有其他的值，包括所有对象会被计算为真 。

请不要混淆原始的布尔值`true`和`false` 与 `[Boolean](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Boolean>)`对象的真和假。例如：

```
var b = new Boolean(false);
if (b) //结果视为真
if (b == true) // 结果视为假
```

### **示例**

在以下示例中，如果`Text`对象中的字符数为3，函数`checkData`将返回`true`；否则，显示警报并返回`false`。

```
function checkData() {
  if (document.form1.threeChar.value.length == 3) {
    return true;
  } else {
    alert("Enter exactly three characters. " +
      document.form1.threeChar.value + " is not valid.");
    return false;
  }
}
```

### `switch` 语句

`switch` 语句允许一个程序求一个表达式的值并且尝试去匹配表达式的值到一个 `case` 标签。如果匹配成功，这个程序执行相关的语句。`switch` 语句如下所示：

```
switch (expression) {
   case label_1:
      statements_1
      [break;]
   case label_2:
      statements_2
      [break;]
   ...
   default:
      statements_def
      [break;]
}
```

程序首先查找一个与 `expression` 匹配的 `case` 语句，然后将控制权转移到该子句，执行相关的语句。如果没有匹配值， 程序会去找 `default` 语句，如果找到了，控制权转移到该子句，执行相关的语句。如果没有找到 `default`，程序会继续执行 `switch` 语句后面的语句。`default` 语句通常出现在switch语句里的最后面，当然这不是必须的。

`可选的 break` 语句与每个 `case` 语句相关联， 保证在匹配的语句被执行后程序可以跳出 `switch` 并且继续执行 `switch` 后面的语句。如果break被忽略，则程序将继续执行switch语句中的下一条语句。

**示例**在如下示例中, 如果 `fruittype` 等于 "Bananas", 程序匹配到对应 "Bananas" 的`case` 语句，并执行相关语句。 当执行到 `break` 时，程序结束了 `switch` 并执行 `switch` 后面的语句。 如果不写 `break` ，那么程序将会执行 `case "Cherries"` 下的语句。

```
switch (fruittype) {
   case "Oranges":
      document.write("Oranges are $0.59 a pound.<br>");
      break;
   case "Apples":
      document.write("Apples are $0.32 a pound.<br>");
      break;
   case "Bananas":
      document.write("Bananas are $0.48 a pound.<br>");
      break;
   case "Cherries":
      document.write("Cherries are $3.00 a pound.<br>");
      break;
   case "Mangoes":
   case "Papayas":
      document.write("Mangoes and papayas are $2.79 a pound.<br>");
      break;
   default:
      document.write("Sorry, we are out of " + fruittype + ".<br>");
}
document.write("Is there anything else you'd like?<br>");
```

## 异常处理语句

你可以用 `throw` 语句抛出一个异常并且用 `try...catch` 语句捕获处理它。

- `[throw`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Control_flow_and_error_handling$edit#throw_statement) 语句
- `[try...catch`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Control_flow_and_error_handling$edit#try...catch_statement) 语句

### 异常类型

JavaScript 可以抛出任意对象。然而，不是所有对象能产生相同的结果。尽管抛出数值或者字母串作为错误信息十分常见，但是通常用下列其中一种异常类型来创建目标更为高效：

- [ECMAScript exceptions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Error_types)
- `[DOMException](<https://developer.mozilla.org/zh-CN/docs/Web/API/DOMException>)` and `[DOMError](<https://developer.mozilla.org/zh-CN/docs/Web/API/DOMError>)`

### `throw` 语句

使用`throw`语句抛出一个异常。当你抛出异常，你规定一个含有值的表达式要被抛出。

```
throw expression;
```

你可以抛出任意表达式而不是特定一种类型的表达式。下面的代码抛出了几个不同类型的表达式：

```
throw "Error2";   // String type
throw 42;         // Number type
throw true;       // Boolean type
throw {toString: function() { return "I'm an object!"; } };
```

**注意：**你可以在抛出异常时声明一个对象。那你就可以在catch块中查询到对象的属性。

```
// Create an object type UserException
function UserException (message){
  this.message=message;
  this.name="UserException";
}

// Make the exception convert to a pretty string when used as
// a string (e.g. by the error console)
UserException.prototype.toString = function (){
  return this.name + ': "' + this.message + '"';
}

// Create an instance of the object type and throw it
throw new UserException("Value too high");
```

### `try...catch` 语句

`try...catch` 语句标记一块待尝试的语句，并规定一个以上的响应应该有一个异常被抛出。如果我们抛出一个异常，`try...catch`语句就捕获它。

`try...catch` 语句有一个包含一条或者多条语句的try代码块，0个或1个的`catch`代码块，catch代码块中的语句会在try代码块中抛出异常时执行。 换句话说，如果你在try代码块中的代码如果没有执行成功，那么你希望将执行流程转入catch代码块。如果try代码块中的语句（或者`try` 代码块中调用的方法）一旦抛出了异常，那么执行流程会立即进入`catch` 代码块。如果try代码块没有抛出异常，catch代码块就会被跳过。`finally` 代码块总会紧跟在try和catch代码块之后执行，但会在try和catch代码块之后的其他代码之前执行。

下面的例子使用了`try...catch`语句。示例调用了一个函数用于从一个数组中根据传递值来获取一个月份名称。如果该值与月份数值不相符，会抛出一个带有`"InvalidMonthNo"`值的异常，然后在捕捉块语句中设`monthName`变量为`unknown`。

```
function getMonthName(mo) {
  mo = mo - 1; // Adjust month number for array index (1 = Jan, 12 = Dec)
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul",
                "Aug","Sep","Oct","Nov","Dec"];
  if (months[mo]) {
    return months[mo];
  } else {
    throw "InvalidMonthNo"; //throw keyword is used here
  }
}

try { // statements to try
  monthName = getMonthName(myMonth); // function could throw exception
}
catch (e) {
  monthName = "unknown";
  logMyErrors(e); // pass exception object to error handler -> your own function
}
```

### `catch` 块

你可以使用`catch`块来处理所有可能在`try`块中产生的异常。

```
catch (catchID) {
  statements
}
```

捕捉块指定了一个标识符（上述语句中的`catchID`）来存放抛出语句指定的值；你可以用这个标识符来获取抛出的异常信息。在插入`throw`块时JavaScript创建这个标识符；标识符只存在于`catch`块的存续期间里；当`catch`块执行完成时，标识符不再可用。

举个例子，下面代码抛出了一个异常。当异常出现时跳到`catch`块。

```
try {
   throw "myException" // generates an exception
}
catch (e) {
// statements to handle any exceptions
   logMyErrors(e) // pass exception object to error handler
}
```

### `finally`块

`finally`块包含了在try和catch块完成后、下面接着try...catch的语句之前执行的语句。`finally`块无论是否抛出异常都会执行。如果抛出了一个异常，就算没有异常处理，`finally`块里的语句也会执行。

你可以用`finally`块来令你的脚本在异常发生时优雅地退出；举个例子，你可能需要在绑定的脚本中释放资源。接下来的例子用文件处理语句打开了一个文件（服务端的JavaScript允许你进入文件）。如果在文件打开时一个异常抛出，`finally`块会在脚本错误之前关闭文件。

```
openMyFile();
try {
    writeMyFile(theData); //This may throw a error
}catch(e){
    handleError(e); // If we got a error we handle it
}finally {
    closeMyFile(); // always close the resource
}
```

如果`finally`块返回一个值，该值会是整个`try-catch-finally`流程的返回值，不管在`try`和`catch`块中语句返回了什么：

```
function f() {
  try {
    console.log(0);
    throw "bogus";
  } catch(e) {
    console.log(1);
    return true; // this return statement is suspended
                 // until finally block has completed
    console.log(2); // not reachable
  } finally {
    console.log(3);
    return false; // overwrites the previous "return"
    console.log(4); // not reachable
  }
  // "return false" is executed now  
  console.log(5); // not reachable
}
f(); // console 0, 1, 3; returns false
```

用`finally`块覆盖返回值也适用于在`catch`块内抛出或重新抛出的异常：

```
function f() {
  try {
    throw 'bogus';
  } catch(e) {
    console.log('caught inner "bogus"');
    throw e; // this throw statement is suspended until 
             // finally block has completed
  } finally {
    return false; // overwrites the previous "throw"
  }
  // "return false" is executed now
}

try {
  f();
} catch(e) {
  // this is never reached because the throw inside
  // the catch is overwritten
  // by the return in finally
  console.log('caught outer "bogus"');
}

// OUTPUT
// caught inner "bogus"
```

### 嵌套 try...catch 语句

你可以嵌套一个或多个`try ... catch`语句。如果一个内部`try ... catch`语句没有`catch`块，它需要有一个`finally`块，并且封闭的`try ... catch`语句的`catch`块被检查匹配。有关更多信息，请参阅[try... catch](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/try...catch)参考页上的[嵌套try-blocks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch#Nested_try-blocks)。

### 使用`Error`对象

根据错误类型，你也许可以用'name'和'message'获取更精炼的信息。'name'提供了常规的错误类（如 'DOMException' 或 'Error'），而'message'通常提供了一条从错误对象转换成字符串的简明信息。

在抛出你个人所为的异常时，为了充分利用那些属性（比如你的`catch`块不能分辨是你个人所为的异常还是系统的异常时），你可以使用 Error 构造函数。比如：

```
function doSomethingErrorProne () {
  if (ourCodeMakesAMistake()) {
    throw (new Error('The message'));
  } else {
    doSomethingToGetAJavascriptError();
  }
}
....
try {
  doSomethingErrorProne();
}
catch (e) {
  console.log(e.name); // logs 'Error'
  console.log(e.message); // logs 'The message' or a JavaScript error message)
}
```

## Promises

从 ECMAScript 6 开始，JavaScript 增加了对 `[Promise](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise>)` 对象的支持，它允许你对延时和异步操作流进行控制。

`Promise` 对象有以下几种状态：

- *pending：*初始的状态，即正在执行，不处于 fulfilled 或 rejected 状态。
- *fulfilled：*成功的完成了操作。
- *rejected：*失败，没有完成操作。
- *settled：*Promise 处于 fulfilled 或 rejected 二者中的任意一个状态, 不会是 pending。

![https://mdn.mozillademos.org/files/8633/promises.png](https://mdn.mozillademos.org/files/8633/promises.png)

### 通过 XHR 加载图片

你可以在 MDN GitHub [promise-test](https://github.com/mdn/js-examples/tree/master/promises-test) 中找到这个简单的例子，它使用了 Promise 和 `[XMLHttpRequest](<https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest>)` 来加载一张图片，你也可以直接在[这个页面](https://mdn.github.io/js-examples/promises-test/)查看他的效果。同时为了让你更清楚的了解 Promise 和 XHR 的结构，代码中每一个步骤后都附带了注释。

这里有一个未注释的版本，展现了 `Promise` 的工作流，希望可以对你的理解有所帮助。

```
function imgLoad(url) {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'blob';
    request.onload = function() {
      if (request.status === 200) {
        resolve(request.response);
      } else {
        reject(Error('Image didn\\'t load successfully; error code:' 
                     + request.statusText));
      }
    };
    request.onerror = function() {
      reject(Error('There was a network error.'));
    };
    request.send();
  });
}
```



## `for` 语句

一个 `[for](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/statements/for>)` 循环会一直重复执行，直到指定的循环条件为 false。 JavaScript 的 for 循环，和 Java、C 的 for 循环，是很相似的。一个 for 语句是这个样子的：

```
for ([initialExpression]; [condition]; [incrementExpression])
  statement
```

当一个 `for` 循环执行的时候，会发生以下过程：

1. 如果有初始化表达式 `initialExpression`，它将被执行。这个表达式通常会初始化一个或多个循环计数器，但语法上是允许一个任意复杂度的表达式的。这个表达式也可以声明变量。
2. 计算 `condition` 表达式的值。如果 `condition` 的值是 true，循环中的语句会被执行。如果 `condition` 的值是 false，`for` 循环终止。如果 `condition` 表达式整个都被省略掉了，condition的值会被认为是true。
3. 循环中的 `statement` 被执行。如果需要执行多条语句，可以使用块（`{ ... }`）来包裹这些语句。
4. 如果有更新表达式 `incrementExpression`，执行更新表达式。
5. 回到步骤 2。

### **例子**

下面的函数包含一个含有 `for` 循环去计算一个滑动列表中被选中项目的个数（一个 `[<select>](<https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/select>)` 元素允许选择多项）。`for` 循环声明了变量i并将它的初始值设为 0。它检查 `i` 是否比 `<select>` 元素中的选项数量少，执行了随后的 `if` 语句，然后在每次完成循环后，`i` 的值增加 1。

```
<form name="selectForm"><p><label for="musicTypes">Choose some music types, then click the button below:</label><select id="musicTypes" name="musicTypes" multiple="multiple"><option selected="selected">R&B</option><option>爵士</option><option>布鲁斯</option><option>新纪元</option><option>古典</option><option>歌剧</option></select></p><p><input id="btn" type="button" value="选择了多少个选项?" /></p></form><script>
function howMany(selectObject) {
  var numberSelected = 0;
  for (var i = 0; i < selectObject.options.length; i++) {
    if (selectObject.options[i].selected) {
      numberSelected++;
    }
  }
  return numberSelected;
}

var btn = document.getElementById("btn");
btn.addEventListener("click", function(){
  alert('选择选项的数量是: ' + howMany(document.selectForm.musicTypes))
});
</script>
```

## `do...while` 语句

`[do...while](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/statements/do...while>)` 语句一直重复直到指定的条件求值得到假值（false）。 一个 do...while 语句看起来像这样：

```
do
  statement
while (condition);
```

`statement` 在检查条件之前会执行一次。要执行多条语句（语句块），要使用块语句（`{ ... }`）包括起来。 如果 `condition` 为真（true），`statement` 将再次执行。 在每个执行的结尾会进行条件的检查。当 `condition` 为假（false），执行会停止并且把控制权交回给 `do...while` 后面的语句。

### **例子**

在下面的例子中， 这个 `do` 循环将至少重复一次，并且一直重复直到 `i` 不再小于 5。

```
var i = 0;
do {
  i += 1;
  console.log(i);
} while (i < 5);
```

## `while` 语句

一个 `[while](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/statements/while>)` 语句只要指定的条件求值为真（true）就会一直执行它的语句块。一个 `while` 语句看起来像这样：

```
while (condition)
  statement
```

如果这个条件变为假，循环里的 `statement` 将会停止执行并把控制权交回给 `while` 语句后面的代码。

条件检测会在每次 `statement` 执行之前发生。如果条件返回为真， `statement` 会被执行并紧接着再次测试条件。如果条件返回为假，执行将停止并把控制权交回给 while 后面的语句。

要执行多条语句（语句块），要使用语句块 (`{ ... }`) 包括起来。

### **例子 1**

只要 `n` 小于 3，下面的 `while` 循环就会一直执行：

```
var n = 0;
var x = 0;
while (n < 3) {
  n++;
  x += n;
}
```

在每次循环里， `n` 会增加 1，并被加到 `x` 上。所以， x 和 n 的变化是：

- 第一次完成后：`n` = 1，`x` = 1
- 第二次完成后：`n` = 2，`x` = 3
- 第三次完成后：`n` = 3，`x` = 6

在三次完成后， 条件 `n < 3` 的结果不再为真，所以循环终止了。

### **例子 2**

避免无穷循环（无限循环）。保证循环的条件结果最终会变成假；否则，循环永远不会停止。因为条件永远不会变成假值，下面这个 while 循环将会永远执行：

```
while (true) {
  console.log("Hello, world");
}
```

## `label` 语句

一个 `[label](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/statements/label>)` 提供了一个让你在程序中其他位置引用它的标识符。例如，你可以用 label 标识一个循环， 然后使用 `break` 或者 `continue` 来指出程序是否该停止循环还是继续循环。

label 语句的语法看起来像这样：

```
label :
   statement
```

`label` 的值可以是任何的非保留字的 JavaScript 标识符， `statement` 可以是任意你想要标识的语句（块）。

### **例子**

在这个例子里，标记 `markLoop` 标识了一个 `while` 循环。

```
markLoop:
while (theMark == true) {
   doSomething();
}
```

举一个比较典型的例子，看完后即明白 Label 的应用：

未添加 Label：

```
var num = 0;
for (var i = 0 ; i < 10 ; i++) {   // i 循环
  for (var j = 0 ; j < 10 ; j++) { // j 循环
    if( i == 5 && j == 5 ) {
       break; // i = 5，j = 5 时，会跳出 j 循环
    } // 但 i 循环会继续执行，等于跳出之后又继续执行更多次 j 循环
  num++;
  }
}

alert(num); // 输出 95
```

添加 Label 后：

```
var num = 0;
outPoint:
for (var i = 0 ; i < 10 ; i++){
  for (var j = 0 ; j < 10 ; j++){
    if( i == 5 && j == 5 ){
      break outPoint; // 在 i = 5，j = 5 时，跳出所有循环，
                      // 返回到整个 outPoint 下方，继续执行
    }
    num++;
  }
}

alert(num); // 输出 55
```

使用 continue 语句，则可达到与未添加 label 相同的效果，但在这种有多层循环的情况下，循环的跳出进入流程更为明晰一些：

```
var num = 0;
outPoint:
for(var i = 0; i < 10; i++) {
  for(var j = 0; j < 10; j++) {
    if(i == 5 && j == 5) {
      continue outPoint;
    }
    num++;
  }
}
alert(num);  // 95
```

从alert(num)的值可以看出，continue outPoint; 语句的作用是跳出当前循环，并跳转到outPoint（标签）下的 for 循环继续执行。

## `break` 语句

使用 `[break](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/statements/break>)` 语句来终止循环，`switch`， 或者是链接到 label 语句。

- 当你使用不带 label 的 `break` 时， 它会立即终止当前所在的 `while`，`do-while`，`for`，或者 `switch` 并把控制权交回这些结构后面的语句。
- 当你使用带 label 的 `break` 时，它会终止指定的带标记（label）的语句。

`break` 语句的语法看起来像这样：

```
break [label];
```

在语法中，被 `[]` 包裹的内容是可省略的，也就是 `label` 可以省略。若省略，则终止当前所在的循环或 `switch`；若不省略，则终止指定的 label 语句。

### **例子** **1**

下面的例子循环数组里的元素，直到找到一个等于 `theValue` 的值：

```
for (i = 0; i < a.length; i++) {
  if (a[i] == theValue) {
    break;
  }
}
```

### **例子 2:** 终止一个 label

```
var x = 0;
var z = 0
labelCancelLoops: while (true) {
  console.log("外部循环: " + x);
  x += 1;
  z = 1;
  while (true) {
    console.log("内部循环: " + z);
    z += 1;
    if (z === 10 && x === 10) {
      break labelCancelLoops;
    } else if (z === 10) {
      break;
    }
  }
}
```

## `continue` 语句

`[continue](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/statements/continue>)` 语句可以用来继续执行（跳过代码块的剩余部分并进入下一循环）一个 `while`、`do-while`、`for`，或者 `label` 语句。

- 当你使用不带 label 的 `continue` 时， 它终止当前 `while`，`do-while`，或者 for 语句到结尾的这次的循环并且继续执行下一次循环。
- 当你使用带 label 的 `continue` 时， 它会应用被 label 标识的循环语句。

`continue` 语句的语法看起来像这样：

```
continue [label];
```

### **例子 1**

The following example shows a `while` loop with a `continue` statement that executes when the value of `i` is three. Thus, `n` takes on the values one, three, seven, and twelve.

```
var i = 0;
var n = 0;
while (i < 5) {
  i++;
  if (i == 3) {
    continue;
  }
  n += i;
  console.log(n);
}
//1,3,7,12
var i = 0; 
var n = 0; 
while (i < 5) { 
  i++; 
  if (i == 3) { 
     // continue; 
  } 
  n += i; 
  console.log(n);
}
// 1,3,6,10,15
```

### **例子 2**

一个被标签为 `checkiandj` 的语句包含了一个标签为 `checkj` 的语句。

如果遇到 `continue` 语句，程序会结束当前 `chechj` 的迭代并开始下一轮的迭代。

每次遇到 `continue` 语句时，`checkj` 语句会一直重复执行，直到 `checkj` 语句的条件为 `false`。

当返回 `false` 后，将会执行 `checkiandj` 的剩余语句，`checkiandj` 会一直执行，直到 `checkiandj` 的条件为 `false`。

当 `checkiandj` 的返回值为 `false` 时，将会执行 `checkiandj` 的下面的语句。

如果 `continue` 有一个标记 `checkiandj`， 程序将会从 `checkiandj` 语句块的顶部继续执行。

```
var i = 0;
var j = 10;
checkiandj:
  while (i < 4) {
    console.log(i);
    i += 1;
    checkj:
      while (j > 4) {
        console.log(j);
        j -= 1;
        if ((j % 2) == 0) {
          continue checkj;
        }
        console.log(j + ' 是奇数。');
      }
      console.log('i = ' + i);
      console.log('j = ' + j);
  }
```

## `for...in` 语句

`[for...in](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/statements/for...in>)` 语句循环一个指定的变量来循环一个对象所有可枚举的属性。JavaScript 会为每一个不同的属性执行指定的语句。

```
for (variable in object) {
  statements
}
```

### **例子**

下面的函数通过它的参数得到一个对象和这个对象的名字。然后循环这个对象的所有属性并且返回一个列出属性名和该属性值的字符串。

```
function dump_props(obj, obj_name) {
  var result = "";
  for (var i in obj) {
    result += obj_name + "." + i + " = " + obj[i] + "<br>";
  }
  result += "<hr>";
  return result;
}
```

对于一个拥有 `make` 和 `model` 属性的 `car` 对象来说，执行结果 `result` 是：

```
car.make = Ford
car.model = Mustang
```

### **数组**

虽然使用 **for...in** 来迭代数组 `[Array](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array>)` 元素听起来很诱人，但是它返回的东西除了数字索引外，还有可能是你自定义的属性名字。因此还是用带有数字索引的传统的 `[for](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/statements/for>)` 循环来迭代一个数组比较好，因为，如果你想改变数组对象，比如添加属性或者方法，**for...in** 语句迭代的是自定义的属性，而不是数组的元素。（译者注：下面的 `for...of` 语句，和 `[forEach()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach>)`，也是理想的选择。）

## `for...of` 语句

`[for...of](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/statements/for...of>)` 语句在[可迭代对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/iterable)（包括`[Array](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array>)`、`[Map](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Map>)`、`[Set](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set>)`、`[arguments](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/functions/arguments>)` 等等）上创建了一个循环，对值的每一个独特属性调用一次迭代。

```
for (variable of object) {
  statement
}
```

下面的这个例子展示了 `for...of` 和 `[for...in](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/statements/for...in>)` 两种循环语句之间的区别。 `for...in` 循环遍历的结果是数组元素的下标，而 `for...of` 遍历的结果是元素的值：

```
let arr = [3, 5, 7];
arr.foo = "hello";

for (let i in arr) {
   console.log(i); // 输出 "0", "1", "2", "foo"
}

for (let i of arr) {
   console.log(i); // 输出 "3", "5", "7"
}

// 注意 for...of 的输出没有出现 "hello"
// 译者：官方文档不知为何在此使用三个空格来缩进…
```



#  Data_structure

编程语言都具有内建的数据结构，但各种编程语言的数据结构常有不同之处。本文试图列出 JavaScript 语言中内建的数据结构及其属性，它们可以用来构建其他的数据结构；同时尽可能地描述与其他语言的不同之处。

## 动态类型

JavaScript 是一种**弱类型**或者说**动态**语言。这意味着你不用提前声明变量的类型，在程序运行过程中，类型会被自动确定。这也意味着你可以使用同一个变量保存不同类型的数据：

```
var foo = 42;    // foo is a Number now
foo = "bar"; // foo is a String now
foo = true;  // foo is a Boolean now
```

## 数据类型

最新的 ECMAScript 标准定义了 8 种数据类型:

- 7 种

  原始类型

  :

  - [Boolean](https://developer.mozilla.org/zh-CN/docs/Glossary/Boolean)
  - [Null](https://developer.mozilla.org/zh-CN/docs/Glossary/Null)
  - [Undefined](https://developer.mozilla.org/zh-CN/docs/Glossary/undefined)
  - [Number](https://developer.mozilla.org/zh-CN/docs/Glossary/Number)
  - [BigInt](https://developer.mozilla.org/zh-CN/docs/Glossary/BigInt)
  - [String](https://developer.mozilla.org/zh-CN/docs/Glossary/字符串)
  - [Symbol](https://developer.mozilla.org/zh-CN/docs/Glossary/Symbol)

- 和 [Object](https://developer.mozilla.org/zh-CN/docs/Glossary/Object)

## 原始值( primitive values )

除 Object 以外的所有类型都是不可变的（值本身无法被改变）。例如，与 C 语言不同，JavaScript 中字符串是不可变的（译注：如，JavaScript 中对字符串的操作一定返回了一个新字符串，原始字符串并没有被改变）。我们称这些类型的值为“原始值”。

### 布尔类型

布尔表示一个逻辑实体，可以有两个值：`true` 和 `false`。

### Null 类型

Null 类型只有一个值： `null`，更多详情可查看 `[null](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null>)` 和 [Null](https://developer.mozilla.org/zh-CN/docs/Glossary/Null) 。

### Undefined 类型

一个没有被赋值的变量会有个默认值 `undefined`，更多详情可查看 `[undefined](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined>)` 和 [Undefined](https://developer.mozilla.org/zh-CN/docs/Glossary/undefined)。

### 数字类型

根据 ECMAScript 标准，JavaScript 中只有一种数字类型：基于 IEEE 754 标准的双精度 64 位二进制格式的值（-(253 -1) 到 253 -1）。**它并没有为整数给出一种特定的类型**。除了能够表示浮点数外，还有一些带符号的值：`+Infinity`，`-Infinity` 和 `NaN` (非数值，Not-a-Number)。

要检查值是否大于或小于 `+/-Infinity`，你可以使用常量 `[Number.MAX_VALUE](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_VALUE>)` 和 `[Number.MIN_VALUE](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_VALUE>)`。另外在 ECMAScript 6 中，你也可以通过 `[Number.isSafeInteger()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger>)` 方法还有 `[Number.MAX_SAFE_INTEGER](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER>)` 和 `[Number.MIN_SAFE_INTEGER](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER>)` 来检查值是否在双精度浮点数的取值范围内。 超出这个范围，JavaScript 中的数字不再安全了，也就是只有 second mathematical interger 可以在 JavaScript 数字类型中正确表现。

数字类型中只有一个整数有两种表示方法： 0 可表示为 -0 和 +0（"0" 是 +0 的简写）。 在实践中，这也几乎没有影响。 例如 `+0 === -0` 为真。 但是，你可能要注意除以0的时候：

```
42 / +0; // Infinity
42 / -0; // -Infinity
```

尽管一个数字常常仅代表它本身的值，但JavaScript提供了一些[位运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators)。 这些位运算符和一个单一数字通过位操作可以用来表现一些布尔值。然而自从 JavaScript 提供其他的方式来表示一组布尔值（如一个布尔值数组或一个布尔值分配给命名属性的对象）后，这种方式通常被认为是不好的。位操作也容易使代码难以阅读，理解和维护， 在一些非常受限的情况下，可能需要用到这些技术，比如试图应付本地存储的存储限制。 位操作只应该是用来优化尺寸的最后选择。

### BigInt 类型

`[BigInt](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt>)`类型是 JavaScript 中的一个基础的数值类型，可以用任意精度表示整数。使用 BigInt，您可以安全地存储和操作大整数，甚至可以超过数字的安全整数限制。BigInt是通过在整数末尾附加 `n` 或调用构造函数来创建的。

通过使用常量`[Number.MAX_SAFE_INTEGER](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER>)`，您可以获得可以用数字递增的最安全的值。通过引入 BigInt，您可以操作超过`[Number.MAX_SAFE_INTEGER](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER>)`的数字。您可以在下面的示例中观察到这一点，其中递增`[Number.MAX_SAFE_INTEGER](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER>)`会返回预期的结果:

```
> const x = 2n ** 53n;
9007199254740992n
> const y = x + 1n; 
9007199254740993n
```

可以对`BigInt`使用运算符`+、*、-、**`和`%`，就像对数字一样。BigInt 严格来说并不等于一个数字，但它是松散的。

在将`BigInt`转换为`Boolean`时，它的行为类似于一个数字：`if、||、&&、Boolean 和!。`

`BigInt`不能与数字互换操作。否则，将抛出`[TypeError](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError>)`。

### 字符串类型

JavaScript的字符串类型用于表示文本数据。它是一组16位的无符号整数值的“元素”。在字符串中的每个元素占据了字符串的位置。第一个元素的索引为0，下一个是索引1，依此类推。字符串的长度是它的元素的数量。

不同于类 C 语言，JavaScript 字符串是不可更改的。这意味着字符串一旦被创建，就不能被修改。但是，可以基于对原始字符串的操作来创建新的字符串。例如：

- 获取一个字符串的子串可通过选择个别字母或者使用 `[String.substr()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/substr>)`.
- 两个字符串的连接使用连接操作符 (`+`) 或者 `[String.concat()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/concat>)`.

### 注意代码中的“字符串类型”！

可以使用字符串来表达复杂的数据。以下是一些很好的性质：

- 容易连接构造复杂的字串符
- 字符串容易被调试(你看到的往往在字符串里)
- 字符串通常是许多APIs的常见标准 ([input fields](https://developer.mozilla.org/en/DOM/HTMLInputElement), [local storage](https://developer.mozilla.org/en/Storage) values, `[XMLHttpRequest](<https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest>)`当使用`responseText等`的时候回应) 而且他只能与字符串一同使用。

使用约定，字符串一般可以用来表达任何数据结构。这不是一个好主意。例如，使用一个分隔符，可以模拟一个列表（而 JavaScript 数组可能更适合）。不幸的是，当分隔符用于列表中的元素时，列表就会被破坏。 可以选择转义字符，等等。所有这些都需要约定，并造成不必要的维护负担。

表达文本数据和符号数据时候推荐使用字符串。当表达复杂的数据时，使用字符串解析和适当的缩写。

### 符号类型

符号(Symbols)是ECMAScript 第6版新定义的。符号类型是唯一的并且是不可修改的, 并且也可以用来作为Object的key的值(如下). 在某些语言当中也有类似的原子类型(Atoms). 你也可以认为为它们是C里面的枚举类型. 更多细节请看 [Symbol](https://developer.mozilla.org/zh-CN/docs/Glossary/Symbol) 和 `[Symbol](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol>)` 。

## 对象

在计算机科学中, 对象是指内存中的可以被 [标识符](https://developer.mozilla.org/zh-CN/docs/Glossary/Identifier)引用的一块区域.

### 属性

在 Javascript 里，对象可以被看作是一组属性的集合。用[对象字面量语法](https://developer.mozilla.org/en/JavaScript/Guide/Values,_variables,_and_literals#Object_literals)来定义一个对象时，会自动初始化一组属性。（也就是说，你定义一个var a = "Hello"，那么a本身就会有a.substring这个方法，以及a.length这个属性，以及其它；如果你定义了一个对象，var a = {}，那么a就会自动有a.hasOwnProperty及a.constructor等属性和方法。）而后，这些属性还可以被增减。属性的值可以是任意类型，包括具有复杂数据结构的对象。属性使用键来标识，它的键值可以是一个字符串或者符号值（Symbol）。

ECMAScript定义的对象中有两种属性：数据属性和访问器属性。

### 数据属性

数据属性是键值对，并且每个数据属性拥有下列特性:

**数据属性的特性(Attributes of a data property)**

[Untitled](https://www.notion.so/b5623cb8102141d68a0769ac2e7618e9)

[Untitled](https://www.notion.so/1a73e7d5a5bb4938aad4bd1f138d3f21)

### 访问器属性

访问器属性有一个或两个访问器函数 (get 和 set) 来存取数值，并且有以下特性:

[Untitled](https://www.notion.so/2823c79a775c49ae8481716828e4e4ac)

注意：这些特性只有 JavaScript 引擎才用到，因此你不能直接访问它们。所以特性被放在两对方括号中，而不是一对。

### "标准的" 对象, 和函数

一个 Javascript 对象就是键和值之间的映射.。键是一个字符串（或者 `[Symbol](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol>)`） ，值可以是任意类型的值。 这使得对象非常符合 [哈希表](http://en.wikipedia.org/wiki/Hash_table)。

函数是一个附带可被调用功能的常规对象。

### 日期

当你想要显示日期时，毋庸置疑，使用内建的 [Date](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date) 对象。

### 有序集: 数组和类型数组

[数组](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array)是一种使用整数作为键(integer-key-ed)属性和长度(length)属性之间关联的常规对象。此外，数组对象还继承了 Array.prototype 的一些操作数组的便捷方法。例如, `[indexOf](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf>)` (搜索数组中的一个值) or `[push](<https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/push>)` (向数组中添加一个元素)，等等。 这使得数组是表示列表或集合的最优选择。

[类型数组(Typed Arrays)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)是ECMAScript Edition 6中新定义的 JavaScript 内建对象，提供了一个基本的二进制数据缓冲区的类数组视图。下面的表格能帮助你找到对等的 C 语言数据类型：

### TypedArray objects

[Untitled](https://www.notion.so/c6a5055b34ef47e69dee46d2f8d2d227)

### 键控集: Maps, Sets, WeakMaps, WeakSets

这些数据结构把对象的引用当作键，其在ECMAScript第6版中有介绍。当 `[Map](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Map>)` 和 `[WeakMap](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/WeakMap>)` 把一个值和对象关联起来的时候， `[Set](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set>)` 和 `[WeakSet](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet>)` 表示一组对象。 Map和WeakMaps之间的差别在于，在前者中，对象键是可枚举的。这允许垃圾收集器优化后面的枚举(This allows garbage collection optimizations in the latter case)。

在纯ECMAScript 5下可以实现Maps和Sets。然而，因为对象并不能进行比较（就对象“小于”示例来讲），所以查询必定是线性的。他们本地实现（包括WeakMaps）查询所花费的时间可能是对数增长。

通常，可以通过直接在对象上设置属性或着使用data-*属性，来绑定数据到DOM节点。然而缺陷是在任何的脚本里，数据都运行在同样的上下文中。Maps和WeakMaps方便将数据私密的绑定到一个对象。

### 结构化数据: JSON

JSON (JavaScript Object Notation) 是一种轻量级的数据交换格式，来源于 JavaScript 同时也被多种语言所使用。 JSON 用于构建通用的数据结构。参见 [JSON](https://developer.mozilla.org/zh-CN/docs/Glossary/JSON) 以及 `[JSON](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON>)` 了解更多。

### 标准库中更多的对象

JavaScript 有一个内置对象的标准库。请查看[参考](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)来了解更多对象。

## 使用 typeof 操作符判断对象类型

typeof 运算符可以帮助你查询变量的类型。要了解更多细节和注意事项请阅读[参考页](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)。



# Equality_comparisons_and_sameness

ES2015中有四种相等算法：

- 抽象（非严格）相等比较 (`==`)
- 严格相等比较 (`===`): 用于 `Array.prototype.indexOf`, `Array.prototype.lastIndexOf`, 和 `case`matching
- 同值零: 用于 `%TypedArray%` 和 `ArrayBuffer` 构造函数、以及`Map`和`Set`操作, 并将用于 ES2016/ES7 中的`String.prototype.includes`
- 同值: 用于所有其他地方

JavaScript提供三种不同的值比较操作：

- 严格相等比较 (也被称作"strict equality", "identity", "triple equals")，使用 [===](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Identity) ,
- 抽象相等比较 ("loose equality"，"double equals") ，使用 [==](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Equality)
- 以及 `[Object.is](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is>)` （ECMAScript 2015/ ES6 新特性）

选择使用哪个操作取决于你需要什么样的比较。

简而言之，在比较两件事情时，双等号将执行类型转换; 三等号将进行相同的比较，而不进行类型转换 (如果类型不同, 只是总会返回 false ); 而Object.is的行为方式与三等号相同，但是对于NaN和-0和+0进行特殊处理，所以最后两个不相同，[而Object.is](http://xn--Object-ou0q.is)（NaN，NaN）将为 `true`。(通常使用双等号或三等号将NaN与NaN进行比较，结果为false，因为IEEE 754如是说.) 请注意，所有这些之间的区别都与其处理原语有关; 这三个运算符的原语中，没有一个会比较两个变量是否结构上概念类似。对于任意两个不同的非原始对象，即便他们有相同的结构， 以上三个运算符都会计算得到 false 。

## 严格相等 `===`

全等操作符比较两个值是否相等，两个被比较的值在比较前都不进行隐式转换。如果两个被比较的值具有不同的类型，这两个值是不全等的。否则，如果两个被比较的值类型相同，值也相同，并且都不是 number 类型时，两个值全等。最后，如果两个值都是 number 类型，当两个都不是 NaN，并且数值相同，或是两个值分别为 +0 和 -0 时，两个值被认为是全等的。

```
var num = 0;
var obj = new String("0");
var str = "0";
var b = false;

console.log(num === num); // true
console.log(obj === obj); // true
console.log(str === str); // true

console.log(num === obj); // false
console.log(num === str); // false
console.log(obj === str); // false
console.log(null === undefined); // false
console.log(obj === null); // false
console.log(obj === undefined); // false
```

在日常中使用全等操作符几乎总是正确的选择。对于除了数值之外的值，全等操作符使用明确的语义进行比较：一个值只与自身全等。对于数值，全等操作符使用略加修改的语义来处理两个特殊情况：第一个情况是，浮点数 0 是不分正负的。区分 +0 和 -0 在解决一些特定的数学问题时是必要的，但是大部分情况下我们并不用关心。全等操作符认为这两个值是全等的。第二个情况是，浮点数包含了 NaN 值，用来表示某些定义不明确的数学问题的解，例如：正无穷加负无穷。全等操作符认为 NaN 与其他任何值都不全等，包括它自己。（等式 `(x !== x)` 成立的唯一情况是 x 的值为 NaN）

## 非严格相等 `==`

相等操作符比较两个值是否相等，在比较前将两个被比较的值转换为相同类型。在转换后（等式的一边或两边都可能被转换），最终的比较方式等同于全等操作符 === 的比较方式。 相等操作符满足交换律。

相等操作符对于不同类型的值，进行的比较如下图所示：

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fa6f8402-efd6-46f2-be03-2e3101cfcca7/.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fa6f8402-efd6-46f2-be03-2e3101cfcca7/.jpg)

在上面的表格中，`ToNumber(A)` 尝试在比较前将参数 A 转换为数字，这与 +A（单目运算符+）的效果相同。`ToPrimitive(A)`通过尝试调用 A 的`A.toString()` 和 `A.valueOf()` 方法，将参数 A 转换为原始值（Primitive）。

一般而言，根据 ECMAScript 规范，所有的对象都与 `undefined` 和 `null` 不相等。但是大部分浏览器允许非常窄的一类对象（即，所有页面中的 `document.all` 对象），在某些情况下，充当效仿 `undefined` 的角色。相等操作符就是在这样的一个背景下。因此，`IsFalsy(A)` 方法的值为 `true` ，当且仅当 `A` 效仿 `undefined`。在其他所有情况下，一个对象都不会等于 `undefined` 或 `null`。

```
var num = 0;
var obj = new String("0");
var str = "0";
var b = false;

console.log(num == num); // true
console.log(obj == obj); // true
console.log(str == str); // true

console.log(num == obj); // true
console.log(num == str); // true
console.log(obj == str); // true
console.log(null == undefined); // true

// both false, except in rare cases
console.log(obj == null);
console.log(obj == undefined);
```

有些开发者认为，最好永远都不要使用相等操作符。全等操作符的结果更容易预测，并且因为没有隐式转换，全等比较的操作会更快。

## 同值相等

同值相等解决了最后一个用例：确定两个值是否在任何情况下功能上是相同的。（这个用例演示了[里氏替换原则](http://zh.wikipedia.org/zh-cn/里氏替换原则)的实例。）当试图对不可变（immutable）属性修改时发生出现的情况：

```
// 向 Nmuber 构造函数添加一个不可变的属性 NEGATIVE_ZERO
Object.defineProperty(Number, "NEGATIVE_ZERO",
                      { value: -0, writable: false, configurable: false, enumerable: false });

function attemptMutation(v)
{
  Object.defineProperty(Number, "NEGATIVE_ZERO", { value: v });
}
```

`Object.defineProperty` 在试图修改不可变属性时，如果这个属性确实被修改了则会抛出异常，反之什么都不会发生。例如如果 v 是 -0 ，那么没有发生任何变化，所以也不会抛出任何异常。但如果 v 是 +0 ，则会抛出异常。不可变属性和新设定的值使用 same-value 相等比较。

同值相等由 `[Object.is](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is>)` 方法提供。

## 零值相等

与同值相等类似，不过会认为 +0 与 -0 相等。

## 规范中的相等、严格相等以及同值相等

在 ES5 中， `[==](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators>)` 相等在 [Section 11.9.3, The Abstract Equality Algorithm](http://ecma-international.org/ecma-262/5.1/#sec-11.9.3)； `[===](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators>)` 相等在 [11.9.6, The Strict Equality Algorithm](http://ecma-international.org/ecma-262/5.1/#sec-11.9.6)。（请参考这两个链接，他们很简洁易懂。提示：请先阅读严格相等的算法）ES5 也提供了 same-value 相等， [Section 9.12, The SameValue Algorithm](http://ecma-international.org/ecma-262/5.1/#sec-9.12) ，用在 JS 引擎内部。除了 11.9.6.4 和 9.12.4 在处理数字上的不同外，它基本和严格相等算法相同。ES6 简单地通过 `[Object.is](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is>)` 暴露了这个算法。

我们可以看到，使用双等或三等时，除了 11.9.6.1 类型检查，严格相等算法是相等算法的子集因为 11.9.6.2–7 对应 11.9.3.1.a–f。

## 理解相等比较的模型

在 ES2015 以前，你可能会说双等和三等是“扩展”的关系。比如有人会说双等是三等的扩展版，因为他处理三等所做的，还做了类型转换。例如 6 == "6" 。反之另一些人可能会说三等是双等的扩展，因为他还要求两个参数的类型相同，所以增加了更多的限制。怎样理解取决于你怎样看待这个问题。

但是这种比较的方式没办法把 ES2015 的 `[Object.is](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is>)` 排列到其中。因为 `[Object.is](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is>)` 并不比双等更宽松，也并不比三等更严格，当然也不是在他们中间。从下表中可以看出，这是由于 `[Object.is](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is>)` 处理 `[NaN](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN>)` 的不同。注意假如 `Object.is(NaN, NaN)` 被计算成 `false` ，我们就可以说他比三等更为严格，因为他可以区分 `-0` 和 `+0` 。但是对 `[NaN](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN>)` 的处理表明，这是不对的。 `[Object.is](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is>)` 应该被认为是有其特殊的用途，而不应说他和其他的相等更宽松或严格。

[Untitled](https://www.notion.so/37773bef5539487fa648969ddf7a5bd9)

## 什么时候使用 `[Object.is](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is>)` 或是三等

总的来说，除了对待[NaN](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN>)的方式，[Object.is](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is>)唯一让人感兴趣的，是当你需要一些元编程方案时，它对待0的特殊方式，特别是关于属性描述器，即你的工作需要去镜像[Object.defineProperty](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty>)的一些特性时。如果你的工作不需要这些，那你应该避免使用[Object.is](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is>)，使用[===](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators>)来代替。即使你需要比较两个[NaN](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN>)使其结果为true，总的来说编写使用[NaN](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN>) 检查的特例函数(用旧版本ECMAScript的[isNaN方法](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN>))也会比想出一些计算方法让[Object.is](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is>)不影响不同符号的0的比较更容易些。

这里是一个会区别对待-0和+0的内置方法和操作符不完全列表：

- `[(一元负)](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#-_.28Unary_Negation.29>)`

显而易见，对`0一元负操作得到-0`。但表达式的抽象化可能在你没有意识到得情况下导致-0延续传播。例如当考虑下例时:

`let stoppingForce = obj.mass * -obj.velocity` 如果`obj.velocity`是`0` (或计算结果为`0`), `一个-0`就在上处产生并被赋值为`stoppingForce的值`.

**`[Math.atan2](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2>)[Math.ceil](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil>)[Math.pow](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow>)[Math.round](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round>)`**

即使传入的参数中没有-0，这些方法的返回值都有可能是-0。例如当用 `[Math.pow](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow>)`计算`-[Infinity](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity>)`的任何负奇指数的幂都会得到`-0`。详情请参见这些方法各自的文档。

**`[Math.floor](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor>)[Math.max](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max>)[Math.min](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min>)[Math.sin](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin>)[Math.sqrt](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt>)[Math.tan](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/tan>)`**

当传入参数中有-0时，这些方法也可能返回-0。例如， `Math.min(-0, +0)` 得出 `-0`。详情请参见这些方法各自的文档。

**`[~<<>>](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators>)`**这些操作符内部都使用了ToInt32算法。因为内部32位整数类型只有一个0（没有符号区别），-0的符号在反操作后并不会保留下来。例如`Object.is(~~(-0), -0)`和`Object.is(-0 << 2 >> 2, -0)` `都会得到false`.

在未考虑0的符号的情况下依赖于`[Object.is](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is>)是危险的。当然，如果本意就是区分-0和+0的话，[Object.is](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is>)能按照期望完成工作。`



