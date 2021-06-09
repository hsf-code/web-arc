---
title: 基础
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---
# JS基础 一

## [常见问题](https://www.nodejs.red/#/javascript/base?id=常见问题)

- `JavaScript`七种内置类型: `number、string、boolean、undefined、null、object、symbol`(ES6新增加)
- `基本类型：`指保存在栈内存中的数据，`引用类型：`([对象引用](https://www.nodejs.red/#/))指保存在堆内存中的对象，传递的是引用的地址
- `弱类型：`变量没有类型, 变量持有的值有类型
- `(typeof null === 'object') = true`，正确的返回值应该是`null`，但是这个`bug`由来已久。 `(undefined == null) = true`
- `indexOf`为`ECMAScript5`新方法，`IE8`及以下不支持
- `setTimeout(callback, 100)`，`setTimeout`只接受一个函数做为参数不接受闭包，因为闭包会自执行，Nodejs 下最小延迟 `1ms` 参见 [v12.x timers.js#L167](https://github.com/nodejs/node/blob/v12.x/lib/internal/timers.js#L167)

### 内置类型

JS 中分为七种内置类型，七种内置类型又分为两大类型：基本类型和对象（Object）。

基本类型有六种： `null`，`undefined`，`boolean`，`number`，`string`，`symbol`。

其中 JS 的数字类型是浮点类型的，没有整型。并且浮点类型基于 IEEE 754标准实现，在使用中会遇到某些 [Bug](https://www.bookstack.cn/read/CS-Interview-Knowledge-Map/spilt.1.JS-JS-ch.md#为什么-01--02--03)。`NaN` 也属于 `number` 类型，并且 `NaN` 不等于自身。

对于基本类型来说，如果使用字面量的方式，那么这个变量只是个字面量，只有在必要的时候才会转换为对应的类型

```javascript
let a = 111 // 这只是字面量，不是 number 类型a.toString() // 使用时候才会转换为对象类型
```

对象（Object）是引用类型，在使用过程中会遇到浅拷贝和深拷贝的问题。

```javascript
let a = { name: 'FE' }let b = ab.name = 'EF'console.log(a.name) // EF
```

## **问：JS 数据类型**

基本类型：Number、Boolean、String、null、undefined、symbol（ES6 新增的），BigInt（ES2020） 引用类型：Object，对象子类型（Array，Function）

### **参考链接**

- https://juejin.im/post/5b2b0a6051882574de4f3d96
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures

## **问：JS 整数是怎么表示的？**

- 通过 Number 类型来表示，遵循 IEEE754 标准，通过 64 位来表示一个数字，（1 + 11 + 52），最大安全数字是 Math.pow(2, 53) - 1，对于 16 位十进制。（符号位 + 指数位 + 小数部分有效位）

## **问：Number() 的存储空间是多大？如果后台发送了一个超过最大自己的数字怎么办**

Math.pow(2, 53) ，53 为有效数字，会发生截断，等于 JS 能支持的最大数字。

### Typeof

`typeof` 对于基本类型，除了 `null` 都可以显示正确的类型

```javascript
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
typeof b // b 没有声明，但是还会显示 undefined
typeof` 对于对象，除了函数都会显示 `object
typeof [] // 'object'
typeof {} // 'object'
typeof console.log // 'function'
```

对于 `null` 来说，虽然它是基本类型，但是会显示 `object`，这是一个存在很久了的 Bug

```javascript
typeof null // 'object'
```

​	PS：为什么会出现这种情况呢？因为在 JS 的最初版本中，使用的是 32 位系统，为了性能考虑使用低位存储了变量的类型信息，`000` 开头代表是对象，然而 `null` 表示为全零，所以将它错误的判断为 `object` 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来。

​	如果我们想获得一个变量的正确类型，可以通过 `Object.prototype.toString.call(xx)`。这样我们就可以获得类似 `[object Type]` 的字符串。

```javascript
let a // 我们也可以这样判断 undefined 
a === undefined 
// 但是 undefined 不是保留字，能够在低版本浏览器被赋值
let undefined = 1
// 这样判断就会出错
// 所以可以用下面的方式来判断，并且代码量更少
// 因为 void 后面随便跟上一个组成表达式
// 返回就是 undefined a === void 0
```

### typeof

原始类型中除了 `null`，其它类型都可以通过 `typeof` 来判断。

![img](https://yck-1254263422.file.myqcloud.com/2021/03/26/16167245597616.jpg)

`typeof null` 的值为 `object`，这是因为一个久远的 Bug，没有细究的必要，了解即可。如果想具体判断 `null` 类型的话直接 `xxx === null` 即可。

对于对象类型来说，`typeof` 只能具体判断函数的类型为 `function`，其它均为 `object`。

### instanceof

`instanceof` 内部通过原型链的方式来判断是否为构建函数的实例，常用于判断具体的对象类型。

```js
1[] instanceof Array
```

都说 `instanceof` 只能判断对象类型，其实这个说法是不准确的，我们是可以通过 hake 的方式得以实现，虽然不会有人这样去玩吧。

```js
1class CheckIsNumber {
2  static [Symbol.hasInstance](number) {
3    return typeof number === 'number'
4  }
5}
6
7// true
81 instanceof CheckIsNumber
```

另外其实我们还可以直接通过构建函数来判断类型：

```js
1// true
2[].constructor === Array
```

### Object.prototype.toString

前几种方式或多或少都存在一些缺陷，`Object.prototype.toString` 综合来看是最佳选择，能判断的类型最完整。

![img](https://yck-1254263422.file.myqcloud.com/2021/03/26/16167262728324.jpg)

上图是一部分类型判断，更多的就不列举了，`[object XXX]` 中的 `XXX` 就是判断出来的类型。

### isXXX API

同时还存在一些判断特定类型的 API，选了两个常见的：

![img](https://yck-1254263422.file.myqcloud.com/2021/03/26/16167498169233.jpg)

### 常见考点

- JS 类型如何判断，有哪几种方式可用
- `instanceof` 原理
- 手写 `instanceof`

### 类型转换

##### 转Boolean

在条件判断时，除了 `undefined`， `null`， `false`， `NaN`， `''`， `0`， `-0`，其他所有值都转为 `true`，包括所有对象。

#####对象转基本类型

对象在转换基本类型时，首先会调用 `valueOf` 然后调用 `toString`。并且这两个方法你是可以重写的。

```javascript
let a = {    valueOf() {        return 0    }}
```

当然你也可以重写 `Symbol.toPrimitive` ，该方法在转基本类型时调用优先级最高。

```javascript
let a = {  valueOf() {    return 0;  },  toString() {    return '1';  },  [Symbol.toPrimitive]() {    return 2;  }}1 + a // => 3'1' + a // => '12'
```

## 隐式转换规则

### 基本情况

- 转换为布尔值
- 转换为数字
- 转换为字符串

### 转换为原始类型

对象在转换类型的时候，会执行原生方法 **ToPrimitive** 。

其算法如下：

1. 如果已经是 **原始类型**，则返回当前值；
2. 如果需要转 **字符串** 则先调用`toSting`方法，如果此时是 **原始类型** 则直接返回，否则再调用`valueOf`方法并返回结果；
3. 如果不是 **字符串**，则先调用`valueOf`方法，如果此时是 **原始类型** 则直接返回，否则再调用`toString`方法并返回结果；
4. 如果都没有 **原始类型** 返回，则抛出 **TypeError** 类型错误。

当然，我们可以通过重写`Symbol.toPrimitive`来制定转换规则，此方法在转原始类型时调用优先级最高。

```
const data = {
  valueOf() {
    return 1;
  },
  toString() {
    return "1";
  },
  [Symbol.toPrimitive]() {
    return 2;
  }
};
data + 1; // 3
```

### 转换为布尔值

对象转换为布尔值的规则如下表：

| 参数类型  | 结果                                                         |
| :-------- | :----------------------------------------------------------- |
| Undefined | 返回 `false`。                                               |
| Null      | 返回 `false`。                                               |
| Boolean   | 返回 当前参数。                                              |
| Number    | 如果参数为`+0`、`-0`或`NaN`，则返回 `false`；其他情况则返回 `true`。 |
| String    | 如果参数为空字符串，则返回 `false`；否则返回 `true`。        |
| Symbol    | 返回 `true`。                                                |
| Object    | 返回 `true`。                                                |

### 转换为数字

对象转换为数字的规则如下表：

| 参数类型  | 结果                                                         |
| :-------- | :----------------------------------------------------------- |
| Undefined | 返回 `NaN`。                                                 |
| Null      | Return +0.                                                   |
| Boolean   | 如果参数为 `true`，则返回 `1`；`false`则返回 `+0`。          |
| Number    | 返回当前参数。                                               |
| String    | 先调用 **ToPrimitive** ，再调用 **ToNumber** ，然后返回结果。 |
| Symbol    | 抛出 `TypeError`错误。                                       |
| Object    | 先调用 **ToPrimitive** ，再调用 **ToNumber** ，然后返回结果。 |

### 转换为字符串

对象转换为字符串的规则如下表：

| 参数类型  | 结果                                                         |
| :-------- | :----------------------------------------------------------- |
| Undefined | 返回 `"undefined"`。                                         |
| Null      | 返回 `"null"`。                                              |
| Boolean   | 如果参数为 `true` ,则返回 `"true"`；否则返回 `"false"`。     |
| Number    | 调用 **NumberToString** ，然后返回结果。                     |
| String    | 返回 当前参数。                                              |
| Symbol    | 抛出 `TypeError`错误。                                       |
| Object    | 先调用 **ToPrimitive** ，再调用 **ToString** ，然后返回结果。 |

### 四则运算符

​	只有当加法运算时，其中一方是字符串类型，就会把另一个也转为字符串类型。

​	其他运算只要其中一方是数字，那么另一方就转为数字。并且加法运算会触发三种类型转换：将值转换为原始值，转换为数字，转换为字符串。

```javascript
1 + '1' // '11'
2 * '2' // 4
[1, 2] + [2, 1] // '1,22,1'
// [1, 2].toString() -> '1,2'
// [2, 1].toString() -> '2,1'
// '1,2' + '2,1' = '1,22,1'
```

对于加号需要注意这个表达式 `'a' + + 'b'`

```javascript
'a' + + 'b' // -> "aNaN"// 因为 + 'b' -> NaN// 你也许在一些代码中看到过 + '1' -> 1

```

### `==` 操作符

![类型转换 - 图1](https://static.sitestack.cn/projects/CS-Interview-Knowledge-Map/ddac9fbbceb04ea02aa1b37548f43155.png)

上图中的 `toPrimitive` 就是对象转基本类型。

这里来解析一道题目 `[] == ![] // -> true` ，下面是这个表达式为何为 `true` 的步骤

```JavaScript
// [] 转成 true，然后取反变成 false[] == false
// 根据第 8 条得出[] == ToNumber(false)[] == 0
// 根据第 10 条得出ToPrimitive([]) == 0
// [].toString() -> '''' == 0
// 根据第 6 条得出0 == 0 
// -> true
```

## **问：NaN 是什么，用 typeof 会输出什么？**

Not a Number，表示非数字，typeof NaN === 'number'

## **（2）问：JS 隐式转换，显示转换**

一般非基础类型进行转换时会先调用 valueOf，如果 valueOf 无法返回基本类型值，就会调用 toString

### **字符串和数字**

- "+" 操作符，如果有一个为字符串，那么都转化到字符串然后执行字符串拼接
- "-" 操作符，转换为数字，相减 (-a, a * 1 a/1) 都能进行隐式强制类型转换

```
[] + {} 和 {} + []
```

### **布尔值到数字**

- 1 + true = 2
- 1 + false = 1

### **转换为布尔值**

- for 中第二个
- while
- if
- 三元表达式
- || （逻辑或） && （逻辑与）左边的操作数

### **符号**

- 不能被转换为数字
- 能被转换为布尔值（都是 true）
- 可以被转换成字符串 "Symbol(cool)"

### **宽松相等和严格相等**

宽松相等允许进行强制类型转换，而严格相等不允许

### **字符串与数字**

转换为数字然后比较

### **其他类型与布尔类型**

- 先把布尔类型转换为数字，然后继续进行比较

### **对象与非对象**

- 执行对象的 ToPrimitive(对象）然后继续进行比较

### **假值列表**

- undefined
- null
- false
- +0, -0, NaN
- ""

### 比较运算符

1. 如果是对象，就通过 `toPrimitive` 转换对象
2. 如果是字符串，就通过 `unicode` 字符索引来比较

### undefined与undeclared的区别

**`undefined：`** 已在作用域中声明但还没有赋值的变量是undefined。

**`undeclared：`** 还没有在作用域中声明过的变量是undeclared，对于undeclared这种情况typeof处理的时候返回的是undefined。

### 欺骗词法作用域

> 词法作用域由写代码期间函数所声明的位置来定义，javascript有两种机制(eval()、with)在运行时来修改词法作用域，这样做通常会导致性能下降，内存泄漏问题。

- **eval函数接收一个字符串为参数，解析字符串生成代码并运行**

```js
function test(str, b){
    eval(str);

    console.log(a, b);
}

var a = 1;

test("var a = 3", 2); // 3 2

console.log(a); // 1
```

上面这段代码示例，eval调用的str相当于在test函数作用域内部声明了一个新的变量b，当console.log()在打印时会在foo函数内部找到a和b，将无法找到外部的a，因此最终输出结果是3和2，最外层a仍就输出是1，两者比较可以看到效果。

- **with通常被当作重复引用同一个对象中的多个属性的快捷方式**

```js
{
function withObj(obj){
    with(obj){
        a = 2
    }
}

let o1 = {
    a: 1,
}

let o2 = {
    b: 1,
}

withObj(o1);
console.log(o1.a); // 2

withObj(o2);
console.log(o2.a); // undefined
console.log(a); // 2
}
```

以上示例中withObj(obj)函数接受一个obj参数，该参数是一个对象引用，执行了with，o1传进去，a=2赋值操作找到了o1.a并将2赋值给它，o2传进去，因为o2没有a属性，就不会创建这个属性，o2.a保持undefined，这个时候就会创建一个新的全局变量a。

- **对性能的影响**

javascript引擎在编译阶段会进行性能优化，很多优化依赖于能够根据代码词法进行静态分析，预先确定了变量和函数的定义位置，才能快速找到标识符，但是在词法分析阶段遇到了with或eval无法明确知道它们会接收什么代码，也就无法判断标识符的位置，最简单的做法就是遇到with或eval不做任何优化，使用其中一个都会导致代码运行变慢，因此，请不要使用他们。

### 类型检测

- `typeof`：基本类型用`typeof`来检测
- `instanceof`：用来检测是否为数组、对象、正则

```js
let box = [1,2,3];
console.log(box instanceof Array); //true

let box1={};
console.log(box1 instanceof Object); //true

let box2=/g/;
console.log(box2 instanceof RegExp); //true
```

### 错误

- **ReferenceError错误**

> 如果在所有嵌套的作用域中遍寻不到所需的变量，引擎会抛出ReferenceError错误，意味这，这是一个未声明的变量，这个错误是一个非常重要的异常类型。

```js
console.log('a: ', a); // Uncaught ReferenceError: a is not defined
let a = 2;
```

- **TypeError错误**

> 这种错误表示作用域判别成功，但是进行了非法的操作，例如，对一个非函数类型的值进行函数调用，或者引用null、undefined类型的值中的属性，将会抛出TypeError异常错误。

```js
let a = null; // 或者a = undefined
console.log(a.b); // Uncaught TypeError: Cannot read property 'b' of null
```

对一个非函数类型的值进行函数调用

```js
let a = 2;
a(); // TypeError: a is not a function
```

### 为什么 0.1 + 0.2 != 0.3

​		因为 JS 采用 IEEE 754 双精度版本（64位），并且只要采用 IEEE 754 的语言都有该问题。

我们都知道计算机表示十进制是采用二进制表示的，所以 `0.1` 在二进制表示为

```
// (0011) 表示循环0.1 = 2^-4 * 1.10011(0011)
```

那么如何得到这个二进制的呢，我们可以来演算下

![为什么 0.1 + 0.2 != 0.3 - 图1](https://static.sitestack.cn/projects/CS-Interview-Knowledge-Map/06bcba980976dba2f691b38fd32dd657.png)

​		小数算二进制和整数不同。乘法计算时，只计算小数位，整数位用作每一位的二进制，并且得到的第一位为最高位。所以我们得出 `0.1 = 2^-4 * 1.10011(0011)`，那么 `0.2` 的演算也基本如上所示，只需要去掉第一步乘法，所以得出 `0.2 = 2^-3 * 1.10011(0011)`。

​		回来继续说 IEEE 754 双精度。六十四位中符号位占一位，整数位占十一位，其余五十二位都为小数位。因为 `0.1` 和 `0.2` 都是无限循环的二进制了，所以在小数位末尾处需要判断是否进位（就和十进制的四舍五入一样）。

​		所以 `2^-4 * 1.10011...001` 进位后就变成了 `2^-4 * 1.10011(0011 * 12次)010` 。那么把这两个二进制加起来会得出 `2^-2 * 1.0011(0011 * 11次)0100` , 这个值算成十进制就是 `0.30000000000000004`

下面说一下原生解决办法，如下代码所示

```JavaScript
 复制代码parseFloat((0.1 + 0.2).toFixed(10))
```

## **问：0.1 + 0.2 === 0.3 嘛？为什么？**

JavaScirpt 使用 Number 类型来表示数字（整数或浮点数），遵循 IEEE 754 标准，通过 64 位来表示一个数字（1 + 11 + 52）

- 1 符号位，0 表示正数，1 表示负数 s
- 11 指数位（e）
- 52 尾数，小数部分（即有效数字）

最大安全数字：Number.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1，转换成整数就是 16 位，所以 0.1 === 0.1，是因为通过 toPrecision(16) 去有效位之后，两者是相等的。

在两数相加时，会先转换成二进制，0.1 和 0.2 转换成二进制的时候尾数会发生无限循环，然后进行对阶运算，JS 引擎对二进制进行截断，所以造成精度丢失。

所以总结：**精度丢失可能出现在进制转换和对阶运算中**

### **参考链接**

- https://juejin.im/post/5b90e00e6fb9a05cf9080dff

# JS基础 二

### 执行上下文

1、当执行 JS 代码时，会产生三种执行上下文

- 全局执行上下文
- 函数执行上下文
- eval 执行上下文

2、每个执行上下文中都有三个重要的属性

- 变量对象（VO），包含变量、函数声明和函数的形参，该属性只能在全局上下文中访问
- 作用域链（JS 采用词法作用域，也就是说变量的作用域是在定义时就决定了）
- this

```javascript
var a = 10
function foo(i) {  var b = 20}
foo()
```

（1）对于上述代码，执行栈中有两个上下文：全局上下文和函数 `foo` 上下文。

```js
// 执行上下文是放在栈中，在模拟中是利用数组的形式，浏览器也是类似（具体可以参考）
stack = [    globalContext,    fooContext]
```

（2）对于全局上下文来说，VO 大概是这样的

```JavaScript
// 对于函数声明之后，变量也是放在VO中，但是函数体也是作为值赋值进去，所以说在JS的扫描阶段，变量只是提升，但是没有赋值，所以值为undefined，
// 但是对于函数的声明来说，是将整体提升到VO中;
globalContext.VO === globeglobalContext.VO = {    a: undefined,    foo: <Function>,}
```

（3）对于函数 `foo` 来说，VO 不能访问，只能访问到活动对象（AO）

```JavaScript
// 对于函数执行上下文的解析，函数在执行的时候才会有AO，（可以被访问）
fooContext.VO === foo.AOfooContext.AO {    i: undefined,    b: undefined,    arguments: <>}
// arguments 是函数独有的对象(箭头函数没有)，该对象是一个伪数组，有 `length` 属性且可以通过下标访问元素， 该对象中的 `callee` 属性代表函数本身
// `caller` 属性代表函数的调用者 
```

（4）对于作用域链，可以把它理解成包含自身变量对象和上级变量对象的列表，通过 `[[Scope]]` 属性查找上级变量

```JavaScript
fooContext.[[Scope]] = [    globalContext.VO ]
fooContext.Scope = fooContext.[[Scope]] + fooContext.VOfooContext.Scope = [    fooContext.VO,    globalContext.VO]
```

例子：接下来让我们看一个老生常谈的例子，`var`

```
b() // call b
console.log(a) // undefined
var a = 'Hello world'
function b() {    console.log('call b') }
```

​	想必以上的输出大家肯定都已经明白了，这是因为函数和变量提升的原因。通常提升的解释是说将声明的代码移动到了顶部，这其实没有什么错误，便于大家理解。但是更准确的解释应该是：在生成执行上下文时，会有两个阶段：

​				第一个阶段是创建的阶段（具体步骤是创建 VO），JS 解释器会找出需要提升的变量和函数，并且给他们提前在内存中开辟好空间，函数的话会将整个函数存入内存中，变量只声明并且赋值为 undefined，

​			   第二个阶段，也就是代码执行阶段，我们可以直接提前使用。

​	**提示**：在提升的过程中，相同的函数会覆盖上一个函数，并且函数优先于变量提升

```JavaScript
b() // call b second
function b() {    console.log('call b fist')}
function b() {    console.log('call b second')}
var b = 'Hello world'
```

**提示：**`var` 会产生很多错误，所以在 ES6中引入了 `let`。`let` 不能在声明前使用，但是这并不是常说的 `let` 不会提升，`let` 提升了声明但没有赋值，因为临时死区导致了并不能在声明前使用。

对于非匿名的立即执行函数需要注意以下一点

```JavaScript
var foo = 1
(function foo() {    foo = 10    console.log(foo)}()) // -> ƒ foo() { foo = 10 ; console.log(foo) }
```

​		因为当 JS 解释器在遇到非匿名的立即执行函数时，会创建一个辅助的特定对象，然后将函数名称作为这个对象的属性，因此函数内部才可以访问到 `foo`，但是这个值又是只读的，所以对它的赋值并不生效，所以打印的结果还是这个函数，并且外部的值也没有发生更改。

```JavaScript
specialObject = {};Scope = specialObject + Scope;foo = new FunctionExpression;foo.[[Scope]] = Scope;specialObject.foo = foo; // {DontDelete}, {ReadOnly}delete Scope[0]; // remove specialObject from the front of scope chain
```

# JS基础 三

### new 的时候发生了什么？

1. 新生成了一个对象
2. 链接到原型
3. 绑定 this
4. 返回新对象

在调用 `new` 的过程中会发生以上四件事情，我们也可以试着来自己实现一个 `new`

```JavaScript
function create() {    
        // 创建一个空的对象    
	let obj = new Object()   
        // 获得构造函数    
	let Con = [].shift.call(arguments)   
        // 链接到原型  
       obj.__proto__ = Con.prototype    
      // 绑定 this，执行构造函数    
      let result = Con.apply(obj, arguments)    
      // 确保 new 出来的是个对象    
      return typeof result === 'object' ? result : obj
}
```

​	对于实例对象来说，都是通过 `new` 产生的，无论是 `function Foo()` 还是 `let a = { b : 1 }` 。

​	对于创建一个对象来说，更推荐使用字面量的方式创建对象（无论性能上还是可读性）。因为你使用 `new Object()` 的方式创建对象需要通过作用域链一层层找到 `Object`，但是你使用字面量的方式就没这个问题。

```JavaScript
function Foo() {}
// function 就是个语法糖
// 内部等同于 new Function( ) 
let a = { b: 1 } // 这个字面量内部也是使用了 new Object()
```

​	对于 `new` 来说，还需要注意下运算符优先级。

```javascript
function Foo() {    return this; }
Foo.getName = function () {    console.log('1');};
Foo.prototype.getName = function () {    console.log('2');};
new Foo.getName();   // -> 1
new Foo().getName(); // -> 2
```

![new - 图1](https://static.sitestack.cn/projects/CS-Interview-Knowledge-Map/93756ae1219763798aa53f7088b4ec4a.png)

​	从上图可以看出，`new Foo()` 的优先级大于 `new Foo` ，所以对于上述代码来说可以这样划分执行顺序

```JavaScript
new (Foo.getName());   
(new Foo()).getName();
```

​	对于第一个函数来说，先执行了 `Foo.getName()` ，所以结果为 1；对于后者来说，先执行 `new Foo()` 产生了一个实例，然后通过原型链找到了 `Foo` 上的 `getName` 函数，所以结果为 2。

### instanceof

​	`instanceof` 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型链中是不是能找到类型的 `prototype`。

我们也可以试着实现一下 `instanceof`

```JavaScript
 function instanceof(left, right) {   
 	// 获得类型的原型   
       let prototype = right.prototype    
       // 获得对象的原型    
       left = left.__proto__    
       // 判断对象的类型是否等于类型的原型   
       while (true) {        
       		if (left === null)           
                	 return false        i
                 f (prototype === left)           
                 	return true        
                 left = left.__proto__    
     }}
```

### this

​	`this` 是很多人会混淆的概念，但是其实他一点都不难，你只需要记住几个规则就可以了。

```JavaScript
function foo() {    
	console.log(this.a)
}
var a = 1
foo()
var obj = {    a: 2,    foo: foo }
obj.foo()
// 以上两者情况 `this` 只依赖于调用函数前的对象，优先级是第二个情况大于第一个情况

// 以下情况是优先级最高的，`this` 只会绑定在 `c` 上，不会被任何方式修改 `this` 指向
var c = new foo()
c.a = 3
console.log(c.a)
// 还有种就是利用 call，apply，bind 改变 this，这个优先级仅次于 new
```

​	以上几种情况明白了，很多代码中的 `this` 应该就没什么问题了，下面让我们看看箭头函数中的 `this`

```JavaScript
function a() {    
	return () => {       
    	return () => {           
        		console.log(this)        
        		}   
                }}
console.log(a()()())
```

​	箭头函数其实是没有 `this` 的，这个函数中的 `this` 只取决于他外面的第一个不是箭头函数的函数的 `this`。在这个例子中，因为调用 `a` 符合前面代码中的第一个情况，所以 `this` 是 `window`。并且 `this` 一旦绑定了上下文，就不会被任何代码改变。

#### 详解 JavaScript 中的 this

相信 Javascript 中的 this 会使很多同学在工作学习中产生困惑，笔者也同样是，经过阅读各种资料及实际工作中的应用，做了以下梳理，主要内容包括长期以来大家对 this 的错误认识及 this 的绑定规则，箭头函数、实际工作场景中遇到的问题，希望对于有此困惑的你能有所帮助。

#####两种错误认识

（1）指向自身

**this 的第一个错误认识是，很容易把 this 理解成指向函数自身**，其实this 的指向在函数定义阶段是无法确定的，只有函数执行时才能确定 this 到底指向谁，实际 this 的最终指向是调用它的那个对象。

下面示例，声明函数 foo()，执行 foo.count=0 时，像函数对象 foo 添加一个属性 count。但是函数 foo 内部代码 this.count 中的 this 并不是指向那个函数对象，for 循环中的 foo(i) 掉用它的对象是 window，等价于 window.foo(i)，因此函数 foo 里面的 this 指向的是 window。

```js
function foo(num){
  this.count++; // 记录 foo 被调用次数
}
foo.count = 0;
window.count = 0;
for(let i=0; i<10; i++){
  if(i > 5){
    foo(i);
  }
}
console.log(foo.count, window.count); // 0 4
```

（2）指向函数的作用域

**对 this 的第二种误解就是 this 指向函数的作用域**

以下这段代码，在 foo 中试图调用 bar 函数，是否成功调用，取决于环境。

- **浏览器**：在浏览器环境里是没有问题的，全局声明的函数放在了 window 对象下，foo 函数里面的 this 代指的是 window 对象，在全局环境中并没有声明变量 a，因此在 bar 函数中的 this.a 自然没有定义，输出 undefined。
- **Node.js**：在 Node.js 环境下，声明的 function 不会放在 global 全局对象下，因此在 foo 函数里调用 this.bar 函数会报 `TypeError: this.bar is not a function` 错误。要想运行不报错，调用 bar 函数时省去前面的 this。

```js
function foo(){
  var a = 2;
  this.bar();
}
function bar(){
  console.log(this.a);
}
foo();
```

#### This 四种绑定规则

（1）默认绑定

当函数调用属于**独立调用**（不带函数引用的调用），无法调用其他的绑定规则，我们给它一个称呼 “默认绑定”，在非严格模式下绑定到全局对象，在使用了严格模式 (use strict) 下绑定到 undefined。

**严格模式下调用**

```js
'use strict'
function demo(){
  // TypeError: Cannot read property 'a' of undefined
  console.log(this.a);
}
const a = 1;
demo();
```

**非严格模式下调用**

在浏览器环境下会将 a 绑定到 window.a，以下代码使用 var 声明的变量 a 会输出 1。

```js
function demo(){
  console.log(this.a); // 1
}
var a = 1;
demo();
```

以下代码使用 let 或 const 声明变量 a 结果会输出 undefined

```js
function demo(){
  console.log(this.a); // undefined
}
let a = 1;
demo();
```

在举例子的时候其实想要重点说明 this 的默认绑定关系的，但是你会发现上面两种代码因为分别使用了 var、let 进行声明导致的结果也是不一样的，归其原因涉及到 **顶层对象的概念**

在 [Issue: Nodejs-Roadmap/issues/11](https://github.com/Q-Angelo/Nodejs-Roadmap/issues/11) 里有童鞋提到这个疑问，也是之前的疏忽，再简单聊下顶层对象的概念，**顶层对象（浏览器环境指 window、Node.js 环境指 Global）的属性和全局变量属性的赋值是相等价的**，使用 var 和 function 声明的是顶层对象的属性，而 let 就属于 ES6 规范了，但是 ES6 规范中 let、const、class 这些声明的全局变量，不再属于顶层对象的属性。

（2）隐式绑定

在函数的调用位置处被某个对象包含，拥有上下文，看以下示例：

```js
function child() {
  console.log(this.name);
}
let parent = {
  name: 'zhangsan',
  child,
}
parent.child(); // zhangsan
```

函数在调用时会使用 parent 对象上下文来引用函数 child，可以理解为child 函数被调用时 parent 对象拥有或包含它。

**隐式绑定的隐患**

被隐式绑定的函数，因为一些不小心的操作会丢失绑定对象，此时就会应用最开始讲的绑定规则中的默认绑定，看下面代码:

```js
function child() {
  console.log(this.name);
}
let parent = {
  name: 'zhangsan',
  child,
}
let parent2 = parent.child;
var name = 'lisi';
parent2();
```

将 parent.child 函数本身赋给 parent2，调用 parent2() 其实是一个不带任何修饰的函数调用，因此会应用默认绑定。

（3）显示绑定

显示绑定和隐式绑定从字面意思理解，有一个相反的对比，一个表现的更直接，一个表现的更委婉，下面在看下两个规则各自的含义:

- **隐式绑定**：在一个对象的内部通过属性间接引用函数，从而把 this 隐式绑定到对象内部属性所指向的函数（例如上例中的对象 parent 的 child 属性引用函数 function child(){}）。
- **显示绑定**：需要引用一个对象时进行强制绑定调用，js 有提供 call()、apply() 方法，ES5 中也提供了内置的方法 `Function.prototype.bind`。

call()、apply() 这两个函数的第一个参数都是设置 this 对象，区别是 apply 传递参数是按照数组传递，call 是一个一个传递。

```js
function fruit(...args){
  console.log(this.name, args);
}
var apple = {
  name: '苹果'
}
var banana = {
  name: '香蕉'
}
fruit.call(banana, 'a', 'b')  // [ 'a', 'b' ]
fruit.apply(apple, ['a', 'b']) // [ 'a', 'b' ]
```

下面是 bind 绑定的示例，只是将一个值绑定到函数的 this 上，并将绑定好的函数返回，只有在执行 fruit 函数时才会输出信息，例：

```js
function fruit(){
  console.log(this.name);
}
var apple = {
  name: '苹果'
}
fruit = fruit.bind(apple);
fruit(); // 苹果
```

除了以上 call、apply、bind 还可以通过上下文 context，例:

```js
function fruit(name){
  console.log(`${this.name}: ${name}`);
}
const obj = {
  name: '这是水果',
}
const arr = ['苹果', '香蕉'];
arr.forEach(fruit, obj);
// 这是水果: 苹果
// 这是水果: 香蕉
```

（4）new-绑定

new 绑定也可以影响 this 调用，它是一个构造函数，每一次 new 绑定都会创建一个新对象。

```js
function Fruit(name){
  this.name = name;
}

const f1 = new Fruit('apple');
const f2 = new Fruit('banana');
console.log(f1.name, f2.name); // apple banana
```

##### 优先级

如果 this 的调用位置同时应用了多种绑定规则，它是有优先级的：new 绑定 -> 显示绑定 -> 隐式绑定 -> 默认绑定。

##### 箭头函数

箭头函数并非使用 function 关键字进行定义，也不会使用上面所讲解的 this 四种标准规范，箭头函数会继承自外层函数调用的 this 绑定。

执行 ` fruit.call(apple)` 时，箭头函数 this 已被绑定，无法再次被修改。

```js
function fruit(){
  return () => {
    console.log(this.name);
  }
}
var apple = {
  name: '苹果'
}
var banana = {
  name: '香蕉'
}
var fruitCall = fruit.call(apple);
fruitCall.call(banana); // 苹果
```

##### This 使用常见问题

###### 通过函数和原型链模拟类

以下示例，定义函数 Fruit，之后在原型链上定义 info 方法，实例化对象 f1 和定义对象 f2 分别调用 info 方法。

```js
function Fruit(name) {
  this.name = name;
}
Fruit.prototype.info = function() {
  console.log(this.name);
}
const f1 = new Fruit('Apple');
f1.info();
const f2 = { name: 'Banana' };
f2.info = f1.info;
f2.info()
```

输出之后，两次结果是不一样的，原因是 info 方法里的 this 对应的不是定义时的上下文，而是调用时的上下文，根据我们上面讲的几种绑定规则，对应的是隐式绑定规则。

```
Apple
Banana
```

###### 原型链上使用箭头函数

如果使用构造函数和原型链模拟类，不能在原型链上定义箭头函数，因为箭头函数的里的 this 会继承外层函数调用的 this 绑定。

```js
function Fruit(name) {
  this.name = name;
}
Fruit.prototype.info = () => {
  console.log(this.name);
}
var name = 'Banana'
const f1 = new Fruit('Apple');
f1.info();
```

###### 在事件中的使用

举一个 Node.js 示例，在事件中使用时，当我们的监听器被调用时，如果声明的是普通函数，this 会被指向监听器所绑定的 EventEmitter 实例，如果使用的箭头函数方式 this 不会指向 EventEmitter 实例。

```js
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    this.name = 'myEmitter';
  }
}
const func1 = () => console.log(this.name);
const func2 = function () { console.log(this.name); };
const myEmitter = new MyEmitter();
myEmitter.on('event', func1); // undefined
myEmitter.on('event', func2); // myEmitter
myEmitter.emit('event');
```



### 闭包

​	闭包的定义很简单：函数 A 返回了一个函数 B，并且函数 B 中使用了函数 A 的变量，函数 B 就被称为闭包。

```JavaScript
function A() {  
    let a = 1  
    function B() {      
        console.log(a)  
    }  
    return B
}
```

​	你是否会疑惑，为什么函数 A 已经弹出调用栈了，为什么函数 B 还能引用到函数 A 中的变量。因为函数 A 中的变量这时候是存储在堆上的。现在的 JS 引擎可以通过逃逸分析辨别出哪些变量需要存储在堆上，哪些需要存储在栈上。

​	经典面试题，循环中使用闭包解决 `var` 定义函数的问题

```JavaScript
for ( var i=1; i<=5; i++) {   
	setTimeout( function timer() {
    	console.log( i );    
    	}, i*1000 );}
```

​	首先因为 `setTimeout` 是个异步函数，所有会先把循环全部执行完毕，这时候 `i` 就是 6 了，所以会输出一堆 6。

解决办法两种，第一种使用闭包

```
for (var i = 1; i <= 5; i++) {  (function(j) {    setTimeout(function timer() {      console.log(j);    }, j * 1000);  })(i);}
```

​	第二种就是使用 `setTimeout` 的第三个参数

```
for ( var i=1; i<=5; i++) {    setTimeout( function timer(j) {        console.log( j );    }, i*1000, i);}
```

​	第三种就是使用 `let` 定义 `i` 了

```
for ( let i=1; i<=5; i++) {    setTimeout( function timer() {        console.log( i );    }, i*1000 );}
```

​	因为对于 `let` 来说，他会创建一个块级作用域，相当于

```
 { // 形成块级作用域  let i = 0  {    let ii = i    setTimeout( function timer() {        console.log( ii );    }, i*1000 );  }  i++  {    let ii = i  }  i++  {    let ii = i  }  ...}
```

### call, apply, bind 区别

首先说下前两者的区别。

​	`	call` 和 `apply` 都是为了解决改变 `this` 的指向。作用都是相同的，只是传参的方式不同。

除了第一个参数外，`call` 可以接收一个参数列表，`apply` 只接受一个参数数组。

```JavaScript
let a = {    value: 1}
function getValue(name, age) {    
    console.log(name)   
    console.log(age)    
    console.log(this.value)
}
getValue.call(a, 'yck', '24')
getValue.apply(a, ['yck', '24'])
```

##### 模拟实现 call 和 apply

可以从以下几点来考虑如何实现

- 不传入第一个参数，那么默认为 `window`
- 改变了 this 指向，让新的对象可以执行该函数。那么思路是否可以变成给新的对象添加一个函数，然后在执行完以后删除？

```JavaScript
Function.prototype.myCall = function (context) {  
	var context = context || window  
	// 给 context 添加一个属性  
	// getValue.call(a, 'yck', '24') => a.fn = getValue  
       context.fn = this 
       // 将 context 后面的参数取出来 
       var args = [...arguments].slice(1)  
       // getValue.call(a, 'yck', '24') => a.fn('yck', '24')  
       var result = context.fn(...args)  
       // 删除 fn  
       delete context.fn  
       return result
   }
```

以上就是 `call` 的思路，`apply` 的实现也类似

```JavaScript
Function.prototype.myApply = function (context) {  
    var context = context || window  
    context.fn = this 
    var result  
    // 需要判断是否存储第二个参数 
    // 如果存在，就将第二个参数展开 
    if (arguments[1]) {    
        result = context.fn(...arguments[1])  
    } else {    
        result = context.fn()  
    }  
    delete context.fn  
    return result
}
```

​	`bind` 和其他两个方法作用也是一致的，只是该方法会返回一个函数。并且我们可以通过 `bind` 实现柯里化。

同样的，也来模拟实现下 `bind`

```JavaScript
Function.prototype.myBind = function (context) { 
    if (typeof this !== 'function') {    
        throw new TypeError('Error')  
    }  
    var _this = this  
    var args = [...arguments].slice(1)  
    // 返回一个函数 
    return function F() {    
        // 因为返回了一个函数，我们可以 new F()，所以需要判断    
        if (this instanceof F) {      
            return new _this(...args, ...arguments)    
        }   
        return _this.apply(context, args.concat(...arguments))  
    }}
```

## [数组去重的三种实现方式](https://www.nodejs.red/#/javascript/base?id=数组去重的三种实现方式)

- **Set数组去重**

> ES6新的数据结构Set，类似于数组，它的元素都是唯一的。

```js
{
let arr = [1, 22, 33, 44, 22, 44];

console.log([...new Set(arr)]); //[1, 22, 33, 44]
}
```

- **reduce数组对象去重**

> reduce对数组中的每一个元素依次执行回调函数，不含数组中未赋值、被删除的元素，回调函数接收四个参数

- ```
  callback
  ```

  ：执行数组中每个值的函数，包含四个参数

  - `previousValue`：上一次调用回调返回的值，或者是提供的初始值`（initialValue）`
  - `currentValue`：数组中当前被处理的元素
  - `index`：当前元素在数组中的索引
  - `array`：调用 `reduce` 的数组

- `initialValue`：可选，作为第一次调用 `callback` 的第一个参数。

示例：

```js
let hash = {};

function unique(arr, initialValue){
    return arr.reduce(function(previousValue, currentValue, index, array){
        hash[currentValue.name] ? '' : hash[currentValue.name] = true && previousValue.push(currentValue);

        return previousValue
    }, initialValue);
}

const uniqueArr = unique([{name: 'zs', age: 15}, {name: 'lisi'}, {name: 'zs'}], []);

console.log(uniqueArr); // uniqueArr.length == 2
```

- **[参考lodash](https://lodash.com/docs/4.17.5#uniqBy)**

```js
_.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');

// => [{ 'x': 1 }, { 'x': 2 }]
```

## [数组降维](https://www.nodejs.red/#/javascript/base?id=数组降维)

- **方法一：将数组字符串化**

> 利用数组与字符串的隐式转换，使用+符号链接一个对象，javascript会默认调用toString方法转为字符串，再使用字符串分割成字符串数组，最后转成数值形数组

```js
let arr = [[222, 333, 444], [55, 66, 77], 11, ]
arr += '';
arr = arr.split(',');
arr = arr.map(item => Number(item));

console.log(arr); // [222, 333, 444, 55, 66, 77, 11]
```

- **方法二：利用apply和concat转换**

> concat() 方法用于连接两个或多个数组。该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本。

```js
{
    function reduceDimension(arr) {
        return Array.prototype.concat.apply([], arr);
    }

    console.log(reduceDimension([[123], 4, [7, 8],[9, [111]]]));
    // [123, 4, 7, 8, 9, Array(1)]
}
```

- **方法三 自定义函数实现**

> 推荐使用，经测试这个是执行效率最高的。

```js
function reduceDimension(arr){
    let ret = [];

    let toArr = function(arr){
        arr.forEach(function(item){
            item instanceof Array ? toArr(item) : ret.push(item);
        });
    }

    toArr(arr);

    return ret;
}

let arr = [[12], 4, [333, [4444, 5555]], [9, [111, 222]]];

for(let i = 0; i < 100000; i++){
    arr.push(i);
}

let start = new Date().getTime();

console.log('reduceDimension: ', reduceDimension(arr));
console.log('耗时: ', new Date().getTime() - start);。
```



## 手写题

### 防抖

你是否在日常开发中遇到一个问题，在滚动事件中需要做个复杂计算或者实现一个按钮的防二次点击操作。

这些需求都可以通过函数防抖动来实现。尤其是第一个需求，如果在频繁的事件回调中做复杂计算，很有可能导致页面卡顿，不如将多次计算合并为一次计算，只在一个精确点做操作。

PS：防抖和节流的作用都是防止函数多次调用。区别在于，假设一个用户一直触发这个函数，且每次触发函数的间隔小于阈值，防抖的情况下只会调用一次，而节流会每隔一定时间调用函数。

我们先来看一个袖珍版的防抖理解一下防抖的实现：

```js
1// func是用户传入需要防抖的函数
2// wait是等待时间
3const debounce = (func, wait = 50) => {
4  // 缓存一个定时器id
5  let timer = 0
6  // 这里返回的函数是每次用户实际调用的防抖函数
7  // 如果已经设定过定时器了就清空上一次的定时器
8  // 开始一个新的定时器，延迟执行用户传入的方法
9  return function(...args) {
10    if (timer) clearTimeout(timer)
11    timer = setTimeout(() => {
12      func.apply(this, args)
13    }, wait)
14  }
15}
16// 不难看出如果用户调用该函数的间隔小于 wait 的情况下，上一次的时间还未到就被清除了，并不会执行函数
```

这是一个简单版的防抖，但是有缺陷，这个防抖只能在最后调用。一般的防抖会有immediate选项，表示是否立即调用。这两者的区别，举个栗子来说：

- 例如在搜索引擎搜索问题的时候，我们当然是希望用户输入完最后一个字才调用查询接口，这个时候适用**延迟执行**的防抖函数，它总是在一连串（间隔小于wait的）函数触发之后调用。
- 例如用户给interviewMap点star的时候，我们希望用户点第一下的时候就去调用接口，并且成功之后改变star按钮的样子，用户就可以立马得到反馈是否star成功了，这个情况适用`立即执行`的防抖函数，它总是在第一次调用，并且下一次调用必须与前一次调用的时间间隔大于wait才会触发。

下面我们来实现一个带有立即执行选项的防抖函数

```js
1// 这个是用来获取当前时间戳的
2function now() {
3  return +new Date()
4}
5/**
6 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
7 *
8 * @param  {function} func        回调函数
9 * @param  {number}   wait        表示时间窗口的间隔
10 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
11 * @return {function}             返回客户调用函数
12 */
13function debounce (func, wait = 50, immediate = true) {
14  let timer, context, args
15
16  // 延迟执行函数
17  const later = () => setTimeout(() => {
18    // 延迟函数执行完毕，清空缓存的定时器序号
19    timer = null
20    // 延迟执行的情况下，函数会在延迟函数中执行
21    // 使用到之前缓存的参数和上下文
22    if (!immediate) {
23      func.apply(context, args)
24      context = args = null
25    }
26  }, wait)
27
28  // 这里返回的函数是每次实际调用的函数
29  return function(...params) {
30    // 如果没有创建延迟执行函数（later），就创建一个
31    if (!timer) {
32      timer = later()
33      // 如果是立即执行，调用函数
34      // 否则缓存参数和调用上下文
35      if (immediate) {
36        func.apply(this, params)
37      } else {
38        context = this
39        args = params
40      }
41    // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
42    // 这样做延迟函数会重新计时
43    } else {
44      clearTimeout(timer)
45      timer = later()
46    }
47  }
48}
```

整体函数实现的不难，总结一下。

- 对于按钮防点击来说的实现：如果函数是立即执行的，就立即调用，如果函数是延迟执行的，就缓存上下文和参数，放到延迟函数中去执行。一旦我开始一个定时器，只要我定时器还在，你每次点击我都重新计时。一旦你点累了，定时器时间到，定时器重置为 `null`，就可以再次点击了。
- 对于延时执行函数来说的实现：清除定时器ID，如果是延迟调用就调用函数

### 节流

防抖动和节流本质是不一样的。防抖动是将多次执行变为最后一次执行，节流是将多次执行变成每隔一段时间执行。

```js
1/**
2 * underscore 节流函数，返回函数连续调用时，func 执行频率限定为 次 / wait
3 *
4 * @param  {function}   func      回调函数
5 * @param  {number}     wait      表示时间窗口的间隔
6 * @param  {object}     options   如果想忽略开始函数的的调用，传入{leading: false}。
7 *                                如果想忽略结尾函数的调用，传入{trailing: false}
8 *                                两者不能共存，否则函数不能执行
9 * @return {function}             返回客户调用函数
10 */
11_.throttle = function(func, wait, options) {
12    var context, args, result;
13    var timeout = null;
14    // 之前的时间戳
15    var previous = 0;
16    // 如果 options 没传则设为空对象
17    if (!options) options = {};
18    // 定时器回调函数
19    var later = function() {
20      // 如果设置了 leading，就将 previous 设为 0
21      // 用于下面函数的第一个 if 判断
22      previous = options.leading === false ? 0 : _.now();
23      // 置空一是为了防止内存泄漏，二是为了下面的定时器判断
24      timeout = null;
25      result = func.apply(context, args);
26      if (!timeout) context = args = null;
27    };
28    return function() {
29      // 获得当前时间戳
30      var now = _.now();
31      // 首次进入前者肯定为 true
32	  // 如果需要第一次不执行函数
33	  // 就将上次时间戳设为当前的
34      // 这样在接下来计算 remaining 的值时会大于0
35      if (!previous && options.leading === false) previous = now;
36      // 计算剩余时间
37      var remaining = wait - (now - previous);
38      context = this;
39      args = arguments;
40      // 如果当前调用已经大于上次调用时间 + wait
41      // 或者用户手动调了时间
42 	  // 如果设置了 trailing，只会进入这个条件
43	  // 如果没有设置 leading，那么第一次会进入这个条件
44	  // 还有一点，你可能会觉得开启了定时器那么应该不会进入这个 if 条件了
45	  // 其实还是会进入的，因为定时器的延时
46	  // 并不是准确的时间，很可能你设置了2秒
47	  // 但是他需要2.2秒才触发，这时候就会进入这个条件
48      if (remaining <= 0 || remaining > wait) {
49        // 如果存在定时器就清理掉否则会调用二次回调
50        if (timeout) {
51          clearTimeout(timeout);
52          timeout = null;
53        }
54        previous = now;
55        result = func.apply(context, args);
56        if (!timeout) context = args = null;
57      } else if (!timeout && options.trailing !== false) {
58        // 判断是否设置了定时器和 trailing
59	    // 没有的话就开启一个定时器
60        // 并且不能不能同时设置 leading 和 trailing
61        timeout = setTimeout(later, remaining);
62      }
63      return result;
64    };
65  };
```

### Event Bus

```js
1class Events {
2  constructor() {
3    this.events = new Map();
4  }
5
6  addEvent(key, fn, isOnce, ...args) {
7    const value = this.events.get(key) ? this.events.get(key) : this.events.set(key, new Map()).get(key)
8    value.set(fn, (...args1) => {
9        fn(...args, ...args1)
10        isOnce && this.off(key, fn)
11    })
12  }
13
14  on(key, fn, ...args) {
15    if (!fn) {
16      console.error(`没有传入回调函数`);
17      return
18    }
19    this.addEvent(key, fn, false, ...args)
20  }
21
22  fire(key, ...args) {
23    if (!this.events.get(key)) {
24      console.warn(`没有 ${key} 事件`);
25      return;
26    }
27    for (let [, cb] of this.events.get(key).entries()) {
28      cb(...args);
29    }
30  }
31
32  off(key, fn) {
33    if (this.events.get(key)) {
34      this.events.get(key).delete(fn);
35    }
36  }
37
38  once(key, fn, ...args) {
39    this.addEvent(key, fn, true, ...args)
40  }
41}
```

### instanceof

`instanceof` 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型链中是不是能找到类型的 `prototype`。

```js
1function instanceof(left, right) {
2    // 获得类型的原型
3    let prototype = right.prototype
4    // 获得对象的原型
5    left = left.__proto__
6    // 判断对象的类型是否等于类型的原型
7    while (true) {
8    	if (left === null)
9    		return false
10    	if (prototype === left)
11    		return true
12    	left = left.__proto__
13    }
14}
```

### call

```js
1Function.prototype.myCall = function(context, ...args) {
2  context = context || window
3  let fn = Symbol()
4  context[fn] = this
5  let result = context[fn](...args)
6  delete context[fn]
7  return result
8}
```

### apply

```js
1Function.prototype.myApply = function(context) {
2  context = context || window
3  let fn = Symbol()
4  context[fn] = this
5  let result
6  if (arguments[1]) {
7    result = context[fn](...arguments[1])
8  } else {
9    result = context[fn]()
10  }
11  delete context[fn]
12  return result
13}
```

### bind

```js
1Function.prototype.myBind = function (context) {
2  var _this = this
3  var args = [...arguments].slice(1)
4  // 返回一个函数
5  return function F() {
6    // 因为返回了一个函数，我们可以 new F()，所以需要判断
7    if (this instanceof F) {
8      return new _this(...args, ...arguments)
9    }
10    return _this.apply(context, args.concat(...arguments))
11  }
12}
```



## JavaScript 中哪一种循环最快呢？

**究竟哪一种循环更快？**

答案其实是：for（倒序）

最让我感到惊讶的事情是，当我在本地计算机上进行测试之后，我不得不接受 for（倒序）是所有 for 循环中最快的这一事实。下面我会举个对一个包含超过一百万项元素的数组执行一次循环遍历的例子。

声明：console.time() 结果的准确度在很大程度上取决于我们运行测试的系统配置。你可以在此处对准确度作进一步了解。

```
const million = 1000000; const arr = Array(million);console.time('⏳');for (let i = arr.length; i > 0; i--) {} // for(倒序) :- 1.5msfor (let i = 0; i < arr.length; i++) {} // for     :- 1.6msarr.forEach(v => v)           // foreach   :- 2.1msfor (const v of arr) {}         // for...of   :- 11.7msconsole.timeEnd('⏳');
```

造成这样结果的原因很简单，在代码中，正序和倒序的 for 循环几乎花费一样的时间，仅仅相差了 0.1 毫秒。原因是，for（倒序）只需要计算一次起始变量 let i = arr.length，而在正序的 for 循环中，它在每次变量增加后都会检查条件 i<arr.length。这个细微的差别不是很重要，你可以忽略它。

而 forEach 是 Array 原型的一个方法，与普通的 for 循环相比，forEach 和 for…of 需要花费更多的时间进行数组迭代。（译者注：但值得注意的是，for…of 和 forEach 都从对象中获取了数据，而原型并没有，因此没有可比性。）

**循环的类型，以及我们应该在何处使用它们**

**1. For 循环（正序和倒序）**

我想，也许大家都应该对这个基础循环非常熟悉了。我们可以在任何我们需要的地方使用 for 循环，按照核定的次数运行一段代码。最基础的 for 循环运行最迅速的，那我们每一次都应该使用它，对吗？并不然，性能不仅仅只是唯一尺度，代码可读性往往更加重要，就让我们选择适合我们应用程序的变形即可。

**2. forEach**

这个方法需要接受一个回调函数作为输入参数，遍历数组的每一个元素，并执行我们的回调函数（以元素本身和它的索引（可选参数）作为参数赋予给回调函数）。forEach 还允许在回调函数中使用一个可选参数 this。

```
const things = ['have', 'fun', 'coding'];const callbackFun = (item, idex) => {  console.log(`${item} - ${index}`);}things.foreach(callbackFun); /* 输出 have - 0fun - 1coding - 2 */
```

**3. for…of**

for…of 是在 ES6（ECMAScript 6）中实现标准化的。它会对一个可迭代的对象（例如 array、map、set、string 等）创建一个循环，并且有一个突出的优点，即优秀的可读性。

```
const arr = [3, 5, 7];const str = 'hello';for (let i of arr) {  console.log(i); // 输出 3, 5, 7}for (let i of str) {  console.log(i); // 输出 'h', 'e', 'l', 'l', 'o'}
```

需要注意的是，请不要在生成器中使用 for……of，即便 for……of 循环提前终止。在退出循环后，生成器被关闭，并尝试再次迭代，不会产生任何进一步的结果。

**4. for in**

for…in 会在对象的所有可枚举属性上迭代指定的变量。对于每个不同的属性，for…in 语句除返回数字索引外，还将返回用户定义的属性的名称。因此，在遍历数组时最好使用带有数字索引的传统 for 循环。因为 for…in 语句还会迭代除数组元素之外的用户定义属性，就算我们修改了数组对象（例如添加自定义属性或方法），依然如此。

```
const details = {firstName: 'john', lastName: 'Doe'};let fullName = '';for (let i in details) {  fullName += details[i] + ' '; // fullName: john doe}
```

for…of 和 for…in

for…of 和 for…in 之间的主要区别是它们迭代的内容。for…in 循环遍历对象的属性，而 for…of 循环遍历可迭代对象的值。

```
let arr= [4, 5, 6];for (let i in arr) {  console.log(i); // '0', '1', '2'}for (let i of arr) {  console.log(i); // '4', '5', '6'}
```

**结论**

for 最快，但可读性比较差

foreach 比较快，能够控制内容

for...of 比较慢，但香

for...in 比较慢，没那么方便

