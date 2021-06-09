---
title: 函数
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

函数是 JavaScript 中的基本组件之一。 一个函数是 JavaScript 过程 — 一组执行任务或计算值的语句。要使用一个函数，你必须将其定义在你希望调用它的作用域内。

一个JavaScript 函数用`function`关键字定义，后面跟着函数名和圆括号。

查看 [JavaScript 函数详细参考文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions) 了解更多。

## 定义函数

### 函数声明

一个**函数定义**（也称为**函数声明**，或**函数语句**）由一系列的`[function](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Statements/function>)`关键字组成，依次为：

- 函数的名称。
- 函数参数列表，包围在括号中并由逗号分隔。
- 定义函数的 JavaScript 语句，用大括号`{}`括起来。

例如，以下的代码定义了一个简单的`square`函数：

```
function square(number) {
  return number * number;
}
```

函数`square`使用了一个参数，叫作`number`。这个函数只有一个语句，它说明该函数将函数的参数（即`number`）自乘后返回。函数的`[return](<https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Statements/return>)`语句确定了函数的返回值：

```
return number * number;
```

原始参数（比如一个具体的数字）被作为**值**传递给函数；值被传递给函数，如果被调用函数改变了这个参数的值，这样的改变不会影响到全局或调用函数。

如果你传递一个对象（即一个非原始值，例如`[Array](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array>)`或用户自定义的对象）作为参数，而函数改变了这个对象的属性，这样的改变对函数外部是可见的，如下面的例子所示：

```
function myFunc(theObject) {
  theObject.make = "Toyota";
}

var mycar = {make: "Honda", model: "Accord", year: 1998};
var x, y;

x = mycar.make;     // x获取的值为 "Honda"

myFunc(mycar);
y = mycar.make;     // y获取的值为 "Toyota"
                    // (make属性被函数改变了)
```

### 函数表达式

虽然上面的函数声明在语法上是一个语句，但函数也可以由函数表达式创建。这样的函数可以是**匿名**的；它不必有一个名称。例如，函数`square`也可这样来定义：

```
const square = function(number) { return number * number; };
var x = square(4); // x gets the value 16
```

然而，函数表达式也可以提供函数名，并且可以用于在函数内部代指其本身，或者在调试器堆栈跟踪中识别该函数：

```
const factorial = function fac(n) {return n<2 ? 1 : n*fac(n-1)};

console.log(factorial(3));
```

当将函数作为参数传递给另一个函数时，函数表达式很方便。下面的例子演示了一个叫`map`的函数如何被定义，而后使用一个表达式函数作为其第一个参数进行调用：

```
function map(f,a) {
  let result = []; // 创建一个数组
  let i; // 声明一个值，用来循环
  for (i = 0; i != a.length; i++)
    result[i] = f(a[i]);
  return result;
}
```

下面的代码：

```
function map(f, a) {
  let result = []; // 创建一个数组
  let i; // 声明一个值，用来循环
  for (i = 0; i != a.length; i++) 
    result[i] = f(a[i]);
  return result;
}
const f = function(x) {
   return x * x * x; 
}
let numbers = [0,1, 2, 5,10];
let cube = map(f,numbers);
console.log(cube);
```

返回 [0, 1, 8, 125, 1000]。

在 JavaScript 中，可以根据条件来定义一个函数。比如下面的代码，当`num` 等于 0 的时候才会定义 `myFunc` ：

```
var myFunc;
if (num == 0){
  myFunc = function(theObject) {
    theObject.make = "Toyota"
  }
}
```

除了上述的定义函数方法外，你也可以在运行时用 `[Function](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Function>)` 构造器由一个字符串来创建一个函数 ，很像 `[eval()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval>)` 函数。

当一个函数是一个对象的属性时，称之为**方法**。了解更多关于对象和方法的知识 [使用对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Working_with_Objects)。

## 调用函数

定义一个函数并不会自动的执行它。定义了函数仅仅是赋予函数以名称并明确函数被调用时该做些什么。**调用**函数才会以给定的参数真正执行这些动作。例如，一旦你定义了函数`square`，你可以如下这样调用它：

```
square(5);
```

上述语句通过提供参数 5 来调用函数。函数执行完它的语句会返回值25。

函数一定要处于调用它们的域中，但是函数的声明可以被提升(出现在调用语句之后)，如下例：

```
console.log(square(5));
/* ... */
function square(n) { return n*n } 
```

函数域是指函数声明时的所在的地方，或者函数在顶层被声明时指整个程序。

**提示：**注意只有使用如上的语法形式（即 `function funcName(){}`）才可以。而下面的代码是无效的。就是说，函数提升仅适用于函数声明，而不适用于函数表达式。

```
console.log(square); // square is hoisted with an initial value undefined.
console.log(square(5)); // Uncaught TypeError: square is not a function
const square = function (n) { 
  return n * n; 
}
```

函数的参数并不局限于字符串或数字。你也可以将整个对象传递给函数。函数 `show_props`（其定义参见 [用对象编程](https://developer.mozilla.org/en-US/docs/JavaScript/Guide/Working_with_Objects#Objects_and_Properties)）就是一个将对象作为参数的例子。

函数可以被递归，就是说函数可以调用其本身。例如，下面这个函数就是用递归计算阶乘：

```
function factorial(n){
  if ((n == 0) || (n == 1))
    return 1;
  else
    return (n * factorial(n - 1));
}
```

你可以计算1-5的阶乘如下：

```
var a, b, c, d, e;

a = factorial(1); // 1赋值给a
b = factorial(2); // 2赋值给b
c = factorial(3); // 6赋值给c
d = factorial(4); // 24赋值给d
e = factorial(5); // 120赋值给e
```

还有其它的方式来调用函数。常见的一些情形是某些地方需要动态调用函数，或者函数的实参数量是变化的，或者调用函数的上下文需要指定为在运行时确定的特定对象。显然，函数本身就是对象，因此这些对象也有方法（参考`[Function](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Function>)` ）。作为此中情形之一，`[apply()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply>)`方法可以实现这些目的。

## 函数作用域

在函数内定义的变量不能在函数之外的任何地方访问，因为变量仅仅在该函数的域的内部有定义。相对应的，一个函数可以访问定义在其范围内的任何变量和函数。换言之，定义在全局域中的函数可以访问所有定义在全局域中的变量。在另一个函数中定义的函数也可以访问在其父函数中定义的所有变量和父函数有权访问的任何其他变量。

```
// 下面的变量定义在全局作用域(global scope)中
var num1 = 20,
    num2 = 3,
    name = "Chamahk";

// 本函数定义在全局作用域
function multiply() {
  return num1 * num2;
}

multiply(); // 返回 60

// 嵌套函数的例子
function getScore() {
  var num1 = 2,
      num2 = 3;
  
  function add() {
    return name + " scored " + (num1 + num2);
  }
  
  return add();
}

getScore(); // 返回 "Chamahk scored 5"
```

## 作用域和函数堆栈

### 递归

一个函数可以指向并调用自身。有三种方法可以达到这个目的：

1. 函数名
2. `[arguments.callee](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/callee>)`
3. 作用域下的一个指向该函数的变量名

例如，思考一下如下的函数定义：

```
var foo = function bar() {
   // statements go here
};
```

在这个函数体内，以下的语句是等价的：

1. `bar()`
2. `arguments.callee()` **（译者注：ES5禁止在严格模式下使用此属性）**
3. `foo()`

调用自身的函数我们称之为*递归函数*。在某种意义上说，递归近似于循环。两者都重复执行相同的代码，并且两者都需要一个终止条件（避免无限循环或者无限递归）。例如以下的循环：

```
var x = 0;
while (x < 10) { // "x < 10" 是循环条件
   // do stuff
   x++;
}
```

可以被转化成一个递归函数和对其的调用：

```
function loop(x) {
  if (x >= 10) // "x >= 10" 是退出条件（等同于 "!(x < 10)"）
    return;
  // 做些什么
  loop(x + 1); // 递归调用
}
loop(0);
```

不过，有些算法并不能简单的用迭代来实现。例如，获取树结构中所有的节点时，使用递归实现要容易得多：

```
function walkTree(node) {
  if (node == null) // 
    return;
  // do something with node
  for (var i = 0; i < node.childNodes.length; i++) {
    walkTree(node.childNodes[i]);
  }
}
```

跟`loop`函数相比，这里每个递归调用都产生了更多的递归。

将递归算法转换为非递归算法是可能的，不过逻辑上通常会更加复杂，而且需要使用堆栈。事实上，递归函数就使用了堆栈：函数堆栈。

这种类似堆栈的行为可以在下例中看到：

```
function foo(i) {
  if (i < 0)
    return;
  console.log('begin:' + i);
  foo(i - 1);
  console.log('end:' + i);
}
foo(3);

// 输出:

// begin:3
// begin:2
// begin:1
// begin:0
// end:0
// end:1
// end:2
// end:3
```

### 嵌套函数和闭包

你可以在一个函数里面嵌套另外一个函数。嵌套（内部）函数对其容器（外部）函数是私有的。它自身也形成了一个闭包。一个闭包是一个可以自己拥有独立的环境与变量的表达式（通常是函数）。

既然嵌套函数是一个闭包，就意味着一个嵌套函数可以”继承“容器函数的参数和变量。换句话说，内部函数包含外部函数的作用域。

可以总结如下：

- 内部函数只可以在外部函数中访问。
- 内部函数形成了一个闭包：它可以访问外部函数的参数和变量，但是外部函数却不能使用它的参数和变量。

下面的例子展示了嵌套函数：

```
function addSquares(a, b) {
  function square(x) {
    return x * x;
  }
  return square(a) + square(b);
}
a = addSquares(2, 3); // returns 13
b = addSquares(3, 4); // returns 25
c = addSquares(4, 5); // returns 41
```

由于内部函数形成了闭包，因此你可以调用外部函数并为外部函数和内部函数指定参数：

```
function outside(x) {
  function inside(y) {
    return x + y;
  }
  return inside;
}
fn_inside = outside(3); // 可以这样想：给一个函数，使它的值加3
result = fn_inside(5); // returns 8

result1 = outside(3)(5); // returns 8
```

### 保存变量

注意到上例中 `inside` 被返回时 `x` 是怎么被保留下来的。一个闭包必须保存它可见作用域中所有参数和变量。因为每一次调用传入的参数都可能不同，每一次对外部函数的调用实际上重新创建了一遍这个闭包。只有当返回的 `inside` 没有再被引用时，内存才会被释放。

这与在其他对象中存储引用没什么不同，但是通常不太明显，因为并不能直接设置引用，也不能检查它们。

### 多层嵌套函数

函数可以被多层嵌套。例如，函数A可以包含函数B，函数B可以再包含函数C。B和C都形成了闭包，所以B可以访问A，C可以访问B和A。因此，闭包可以包含多个作用域；他们递归式的包含了所有包含它的函数作用域。这个称之为作用*域链*。（稍后会详细解释）

思考一下下面的例子：

```
function A(x) {
  function B(y) {
    function C(z) {
      console.log(x + y + z);
    }
    C(3);
  }
  B(2);
}
A(1); // logs 6 (1 + 2 + 3)
```

在这个例子里面，C可以访问B的y和A的x。这是因为：

1. B形成了一个包含A的闭包，B可以访问A的参数和变量
2. C形成了一个包含B的闭包
3. B包含A，所以C也包含A，C可以访问B和A的参数和变量。换言之，C用这个顺序链接了B和A的作用域

反过来却不是这样。A不能访问C，因为A看不到B中的参数和变量，C是B中的一个变量，所以C是B私有的。

### 命名冲突

当同一个闭包作用域下两个参数或者变量同名时，就会产生命名冲突。更近的作用域有更高的优先权，所以最近的优先级最高，最远的优先级最低。这就是作用域链。链的第一个元素就是最里面的作用域，最后一个元素便是最外层的作用域。

看以下的例子：

```
function outside() {
  var x = 5;
  function inside(x) {
    return x * 2;
  }
  return inside;
}

outside()(10); // returns 20 instead of 10
```

命名冲突发生在`return x`上，`inside`的参数`x`和`outside`变量`x`发生了冲突。这里的作用链域是{`inside`, `outside`, 全局对象}。因此`inside`的`x`具有最高优先权，返回了20（`inside`的`x`）而不是10（`outside`的`x`）。

## 闭包

闭包是 JavaScript 中最强大的特性之一。JavaScript 允许函数嵌套，并且内部函数可以访问定义在外部函数中的所有变量和函数，以及外部函数能访问的所有变量和函数。

但是，外部函数却不能够访问定义在内部函数中的变量和函数。这给内部函数的变量提供了一定的安全性。

此外，由于内部函数可以访问外部函数的作用域，因此当内部函数生存周期大于外部函数时，外部函数中定义的变量和函数的生存周期将比内部函数执行时间长。当内部函数以某一种方式被任何一个外部函数作用域访问时，一个闭包就产生了。

```
var pet = function(name) {          //外部函数定义了一个变量"name"
  var getName = function() {            
    //内部函数可以访问 外部函数定义的"name"
    return name; 
  }
  //返回这个内部函数，从而将其暴露在外部函数作用域
  return getName;               
};
myPet = pet("Vivie");
    
myPet();                            // 返回结果 "Vivie"
```

实际上可能会比上面的代码复杂的多。在下面这种情形中，返回了一个包含可以操作外部函数的内部变量方法的对象。

```
var createPet = function(name) {
  var sex;
  
  return {
    setName: function(newName) {
      name = newName;
    },
    
    getName: function() {
      return name;
    },
    
    getSex: function() {
      return sex;
    },
    
    setSex: function(newSex) {
      if(typeof newSex == "string" 
        && (newSex.toLowerCase() == "male" || newSex.toLowerCase() == "female")) {
        sex = newSex;
      }
    }
  }
}

var pet = createPet("Vivie");
pet.getName();                  // Vivie

pet.setName("Oliver");
pet.setSex("male");
pet.getSex();                   // male
pet.getName();                  // Oliver
```

在上面的代码中，外部函数的`name`变量对内嵌函数来说是可取得的，而除了通过内嵌函数本身，没有其它任何方法可以取得内嵌的变量。内嵌函数的内嵌变量就像内嵌函数的保险柜。它们会为内嵌函数保留“稳定”——而又安全——的数据参与运行。而这些内嵌函数甚至不会被分配给一个变量，或者不必一定要有名字。

```
var getCode = (function(){
  var secureCode = "0]Eal(eh&2";    // A code we do not want outsiders to be able to modify...
  
  return function () {
    return secureCode;
  };
})();

getCode();    // Returns the secret code
```

尽管有上述优点，使用闭包时仍然要小心避免一些陷阱。如果一个闭包的函数定义了一个和外部函数的某个变量名称相同的变量，那么这个闭包将无法引用外部函数的这个变量。

```
var createPet = function(name) {  // Outer function defines a variable called "name"
  return {
    setName: function(name) {    // Enclosed function also defines a variable called "name"
      name = name;               // ??? How do we access the "name" defined by the outer function ???
    }
  }
}
```

## 使用 arguments 对象

函数的实际参数会被保存在一个类似数组的arguments对象中。在函数内，你可以按如下方式找出传入的参数：

```
arguments[i]
```

其中`i`是参数的序数编号（译注：数组索引），以0开始。所以第一个传来的参数会是`arguments[0]`。参数的数量由`arguments.length`表示。

使用arguments对象，你可以处理比声明的更多的参数来调用函数。这在你事先不知道会需要将多少参数传递给函数时十分有用。你可以用`arguments.length`来获得实际传递给函数的参数的数量，然后用`arguments`对象来取得每个参数。

例如，设想有一个用来连接字符串的函数。唯一事先确定的参数是在连接后的字符串中用来分隔各个连接部分的字符（译注：比如例子里的分号“；”）。该函数定义如下：

```
function myConcat(separator) {
   var result = ''; // 把值初始化成一个字符串，这样就可以用来保存字符串了！！
   var i;
   // iterate through arguments
   for (i = 1; i < arguments.length; i++) {
      result += arguments[i] + separator;
   }
   return result;
}
```

你可以给这个函数传递任意数量的参数，它会将各个参数连接成一个字符串“列表”：

```
// returns "red, orange, blue, "
myConcat(", ", "red", "orange", "blue");

// returns "elephant; giraffe; lion; cheetah; "
myConcat("; ", "elephant", "giraffe", "lion", "cheetah");

// returns "sage. basil. oregano. pepper. parsley. "
myConcat(". ", "sage", "basil", "oregano", "pepper", "parsley");
```

**提示：**`arguments`变量只是 *”***类数组对象**“，并不是一个数组。称其为类数组对象是说它有一个索引编号和`length`属性。尽管如此，它并不拥有全部的Array对象的操作方法。

更多信息请阅读JavaScript参考里的`[Function](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Function>)`一文。

## 函数参数

从ECMAScript 6开始，有两个新的类型的参数：默认参数，剩余参数。

### 默认参数

在JavaScript中，函数参数的默认值是`undefined`。然而，在某些情况下设置不同的默认值是有用的。这时默认参数可以提供帮助。

在过去，用于设定默认参数的一般策略是在函数的主体中测试参数值是否为`undefined`，如果是则赋予这个参数一个默认值。如果在下面的例子中，调用函数时没有实参传递给`b`，那么它的值就是`undefined`，于是计算`a*b`得到、函数返回的是 `NaN`。但是，在下面的例子中，这个已经被第二行获取处理：

```
function multiply(a, b) {
  b = (typeof b !== 'undefined') ?  b : 1;

  return a*b;
}

multiply(5); // 5
```

使用默认参数，在函数体的检查就不再需要了。现在，你可以在函数头简单地把1设定为`b`的默认值：

```
function multiply(a, b = 1) {
  return a*b;
}

multiply(5); // 5
```

了解更多[默认参数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters)的信息。

### 剩余参数

[剩余参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/rest_parameters)语法允许将不确定数量的参数表示为数组。在下面的例子中，使用剩余参数收集从第二个到最后参数。然后，我们将这个数组的每一个数与第一个参数相乘。这个例子是使用了一个箭头函数，这将在下一节介绍。

```
function multiply(multiplier, ...theArgs) {
  return theArgs.map(x => multiplier * x);
}

var arr = multiply(2, 1, 2, 3);
console.log(arr); // [2, 4, 6]
```

## 箭头函数

[箭头函数表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)（也称胖箭头函数）相比函数表达式具有较短的语法并以词法的方式绑定 `this`。箭头函数总是匿名的。另见 [hacks.mozilla.org](http://hacks.mozilla.org) 的博文：“[深度了解ES6：箭头函数](https://hacks.mozilla.org/2015/06/es6-in-depth-arrow-functions/)”。

有两个因素会影响引入箭头函数：更简洁的函数和 `this`。

### 更简洁的函数

在一些函数模式中，更简洁的函数很受欢迎。对比一下：

```
var a = [
  "Hydrogen",
  "Helium",
  "Lithium",
  "Beryllium"
];

var a2 = a.map(function(s){ return s.length });

console.log(a2); // logs [ 8, 6, 7, 9 ]

var a3 = a.map( s => s.length );

console.log(a3); // logs [ 8, 6, 7, 9 ]
```

### `this` 的词法

在箭头函数出现之前，每一个新函数都重新定义了自己的 [this](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this) 值（在构造函数中是一个新的对象；在严格模式下是未定义的；在作为“对象方法”调用的函数中指向这个对象；等等）。以面向对象的编程风格，这样着实有点恼人。

```
function Person() {
  // 构造函数Person()将`this`定义为自身
  this.age = 0;

  setInterval(function growUp() {
    // 在非严格模式下，growUp()函数将`this`定义为“全局对象”，
    // 这与Person()定义的`this`不同，
    // 所以下面的语句不会起到预期的效果。
    this.age++;
  }, 1000);
}

var p = new Person();
```

在ECMAScript 3/5里，通过把`this`的值赋值给一个变量可以修复这个问题。

```
function Person() {
  var self = this; // 有的人习惯用`that`而不是`self`，
                   // 无论你选择哪一种方式，请保持前后代码的一致性
  self.age = 0;

  setInterval(function growUp() {
    // 以下语句可以实现预期的功能
    self.age++;
  }, 1000);
}
```

另外，创建一个[约束函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)可以使得 `this`值被正确传递给 `growUp()` 函数。

箭头函数捕捉闭包上下文的`this`值，所以下面的代码工作正常。

```
function Person(){
  this.age = 0;

  setInterval(() => {
    this.age++; // 这里的`this`正确地指向person对象
  }, 1000);
}

var p = new Person();
```

## 预定义函数

JavaScript语言有好些个顶级的内建函数：

[eval()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval>)eval()方法会对一串字符串形式的JavaScript代码字符求值。[uneval()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/uneval>) uneval()方法创建的一个[Object](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object>)的源代码的字符串表示。[isFinite()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isFinite>)isFinite()函数判断传入的值是否是有限的数值。 如果需要的话，其参数首先被转换为一个数值。[isNaN()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN>)isNaN()函数判断一个值是否是[NaN](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN>)。注意：isNaN函数内部的[强制转换规则](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN#Description>)十分有趣； 另一个可供选择的是ECMAScript 6 中定义[Number.isNaN()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN>) , 或者使用 [typeof](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof>)来判断数值类型。[parseFloat()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseFloat>)parseFloat() 函数解析字符串参数，并返回一个浮点数。[parseInt()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt>)parseInt() 函数解析字符串参数，并返回指定的基数（基础数学中的数制）的整数。[decodeURI()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/decodeURI>)decodeURI() 函数对先前经过[encodeURI](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURI>)函数或者其他类似方法编码过的字符串进行解码。[decodeURIComponent()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent>)decodeURIComponent()方法对先前经过[encodeURIComponent](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent>)函数或者其他类似方法编码过的字符串进行解码。[encodeURI()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURI>)encodeURI()方法通过用以一个，两个，三个或四个转义序列表示字符的UTF-8编码替换统一资源标识符（URI）的某些字符来进行编码（每个字符对应四个转义序列，这四个序列组了两个”替代“字符）。[encodeURIComponent()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent>)encodeURIComponent() 方法通过用以一个，两个，三个或四个转义序列表示字符的UTF-8编码替换统一资源标识符（URI）的每个字符来进行编码（每个字符对应四个转义序列，这四个序列组了两个”替代“字符）。[escape()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/escape>) 已废弃的 escape() 方法计算生成一个新的字符串，其中的某些字符已被替换为十六进制转义序列。使用 [encodeURI](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURI>)或者[encodeURIComponent](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent>)替代本方法。[unescape()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/unescape>) 已废弃的 unescape() 方法计算生成一个新的字符串，其中的十六进制转义序列将被其表示的字符替换。上述的转义序列就像[escape](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/escape>)里介绍的一样。因为 unescape 已经废弃，建议使用[decodeURI()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/decodeURI>)或者[decodeURIComponent](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent>) 替代本方法。

# 运算符



JavaScript 拥有二元和一元运算符， 和一个特殊的三元运算符（条件运算符）。一个二元运算符需要两个操作数，分别在运算符的前面和后面：

```
操作数1 运算符 操作数2
```

例如, `3+4` 或 `x*y`。

一个一元运算符需要一个操作数，在运算符前面或后面：

```
运算符 操作数
```

或

```
操作数 运算符
```

例如, `x++` 或 `++x`。

### 赋值运算符

一个 [赋值运算符(assignment operator)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Assignment_Operators) 将它右边操作数的值赋给它左边的操作数。最简单的赋值运算符是等于（`=`），它将右边的操作数值赋给左边的操作数。那么 `x = y` 就是将 y 的值赋给 x。

还有一些复合赋值操作符，它们是下表列出的这些操作的缩写：

[Untitled](https://www.notion.so/48ed322635f34f6a8312235277e6abae)

### 解构

对于更复杂的赋值，[解构赋值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)语法是一个能从数组或对象对应的数组结构或对象字面量里提取数据的 Javascript 表达式。

```
var foo = ["one", "two", "three"];

// 不使用解构
var one   = foo[0];
var two   = foo[1];
var three = foo[2];

// 使用解构
var [one, two, three] = foo;
```

### 比较运算符

[比较运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators)比较它的操作数并返回一个基于表达式是否为真的逻辑值。操作数可以是数字，字符串，逻辑，对象值。字符串比较是基于标准的字典顺序，使用Unicode值。在多数情况下，如果两个操作数不是相同的类型， JavaScript 会尝试转换它们为恰当的类型来比较。这种行为通常发生在数字作为操作数的比较。类型转换的例外是使用 `===` 和 `!==` 操作符，它们会执行严格的相等和不相等比较。这些运算符不会在检查相等之前转换操作数的类型。下面的表格描述了该示例代码中的各比较运算符

```
var var1 = 3;
var var2 = 4;
```

[Untitled](https://www.notion.so/699ff0cc896a4865ae7c00e39bd74ee4)

**注意:** （**=>**） 不是运算符，而是[箭头函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)的标记符号 。

### 算术运算符

算术运算符使用数值(字面量或者变量)作为操作数并返回一个数值.标准的算术运算符就是加减乘除(+ - * /)。当操作数是浮点数时，这些运算符表现得跟它们在大多数编程语言中一样（特殊要注意的是，除零会产生`[Infinity](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Infinity>)`）。例如：

```
1 / 2;  // 0.5
1 / 2 == 1.0 / 2.0; // true 
```

除了标准的算术运算符（+， - ，* /），JavaScript还提供了下表中的算术运算符。

[Untitled](https://www.notion.so/9de5e24ac4664be682d4f46bd0412b89)

### 位运算符

位运算符将它的操作数视为32位元的二进制串（0和1组成）而非十进制八进制或十六进制数。例如：十进制数字9用二进制表示为1001，位运算符就是在这个二进制表示上执行运算，但是返回结果是标准的JavaScript数值。

下表总结了 JavaScript 的位运算符。

[Untitled](https://www.notion.so/f8ad17c144994345ac10edd88918bad8)

### 位逻辑运算符

概念上来讲, 位逻辑运算符工作流程如下:

- 操作数被转换为32bit整數，以位序列（0和1组成）表示.若超過32bits，則取低位32bit，如下所示：

**`Before: 11100110111110100000000000000110000000000001 After: 10100000000000000110000000000001`**

- 第一个操作数的每一位都与第二个操作数的对应位组对: 第一位对应第一位,第二位对应第二位,以此类推.
- 运算符被应用到每一对"位"上, 最终的运算结果由每一对“位”的运算结果组合起来.

例如,十进制数9的二进制表示是1001,十进制数15的二进制表示是1111.因此,当位运算符应用到这两个值时,结果如下:

[Untitled](https://www.notion.so/1cd8928574b14f2aa8c45a6729291651)

注意位运算符“非”将所有的32位取反，而值的最高位(最左边的一位)为1则表示负数(2-补码表示法)。

### 移位运算符

移位运算符带两个操作数：第一个是待移位的数，第二个是指定第一个数要被移多少位的数。移位的方向由运算符来控制.

移位运算符把操作数转为32bit整数，然后得出一个与待移位数相同种类的值。

移位运算符列表如下。

**移位运算符**

[Untitled](https://www.notion.so/b6c0a880b70843fc99c9fde6066d3c63)

### 逻辑运算符

逻辑运算符常用于布尔（逻辑）值之间; 当操作数都是布尔值时，返回值也是布尔值。 不过实际上`&&`和`||`返回的是一个特定的操作数的值，所以当它用于非布尔值的时候，返回值就可能是非布尔值。 逻辑运算符的描述如下。

**逻辑运算符**

[Untitled](https://www.notion.so/e17fca94caad4058800ca7d6d95f354f)

能被转换为`false`的值有`null`, `0`, `NaN`, 空字符串("")和`undefined`。（译者注：也可以称作”falsy“）

下面是&&（逻辑"与"）操作符的示例。

```
var a1 =  true && true;     // t && t returns true
var a2 =  true && false;    // t && f returns false
var a3 = false && true;     // f && t returns false
var a4 = false && (3 == 4); // f && f returns false
var a5 = "Cat" && "Dog";    // t && t returns Dog
var a6 = false && "Cat";    // f && t returns false
var a7 = "Cat" && false;    // t && f returns false
```

下面是||（逻辑"或"）操作符的示例。

```
var o1 =  true || true;     // t || t returns true
var o2 = false || true;     // f || t returns true
var o3 =  true || false;    // t || f returns true
var o4 = false || (3 == 4); // f || f returns false
var o5 = "Cat" || "Dog";    // t || t returns Cat
var o6 = false || "Cat";    // f || t returns Cat
var o7 = "Cat" || false;    // t || f returns Cat
```

下面是！（逻辑"非"）操作符的示例。

```
var n1 = !true;  // !t returns false
var n2 = !false; // !f returns true
var n3 = !"Cat"; // !t returns false
```

### 短路求值

作为逻辑表达式进行求值是从左到右，它们是为可能的“短路”的出现而使用以下规则进行测试：

- `false` && *anything* // 被短路求值为false
- `true` || *anything* // 被短路求值为true

逻辑的规则，保证这些评估是总是正确的。请注意，上述表达式的`anything`部分不会被求值，所以这样做不会产生任何副作用。

### 字符串运算符

除了比较操作符，它可以在字符串值中使用，连接操作符（+）连接两个字符串值相连接，返回另一个字符串，它是两个操作数串的结合。

例如，

```
console.log("my " + "string"); // console logs the string "my string".
```

简写操作符 `+=` 也可以用来拼接字符串，例如：

```
var myString = "alpha";myString += "bet"; // 返回 "alphabet"  
```

### 条件（三元）运算符

[条件运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)是JavaScript中唯一需要三个操作数的运算符。运算的结果根据给定条件在两个值中取其一。语法为：

```
条件 ? 值1 : 值2
```

如果`条件`为真，则结果取`值1`。否则为`值2`。你能够在任何允许使用标准运算符的地方使用条件运算符。

例如，

```
var status = (age >= 18) ? "adult" : "minor";
```

当 `age` 大于等于18的时候，将“adult”赋值给 `status`；否则将“minor”赋值给 `status`。

### 逗号操作符

[逗号操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comma_Operator)（`,`）对两个操作数进行求值并返回最终操作数的值。它常常用在 `for` 循环中，在每次循环时对多个变量进行更新。

例如，假如 `a` 是一个二维数组，每个维度各有10个元素，以下代码利用逗号操作符来同时改变两个变量的值。这段代码的功能是打印出该二维数组的对角线元素的值：

```
var x = [0,1,2,3,4,5,6,7,8,9]
var a = [x, x, x, x, x];

for (var i = 0, j = 9; i <= j; i++, j--)
  console.log('a[' + i + '][' + j + ']= ' + a[i][j]);
```

### 一元操作符

一元操作符仅对应一个操作数。

### `delete`

`[delete](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete>)`操作符，删除一个对象的属性或者一个数组中某一个键值。语法如下:

```
delete objectName.property;
delete objectName[index];
delete property; // legal only within a with statement
```

`objectName`是一个对象名，`property` 是一个已经存在的属性，`index`是数组中的一个已经存在的键值的索引值。

第四行的形式只在`[with](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with>)`声明的状态下是合法的， 从对象中删除一个属性。

你能使用 `delete` 删除各种各样的隐式声明， 但是被`var`声明的除外。

如果 `delete` 操作成功，属性或者元素会变成 `undefined`。如果 `delete`可行会返回`true`，如果不成功返回`false`。

```
x = 42;
var y = 43;
myobj = new Number();
myobj.h = 4;    // create property h
delete x;       // returns true (can delete if declared implicitly)
delete y;       // returns false (cannot delete if declared with var)
delete Math.PI; // returns false (cannot delete predefined properties)
delete myobj.h; // returns true (can delete user-defined properties)
delete myobj;   // returns true (can delete if declared implicitly)
```

### 删除数组元素

删除数组中的元素时，数组的长度是不变的，例如删除`a[3]`, `a[4]`，`a[4]和a[3]` 仍然存在变成了`undefined`。

`delete` 删除数组中的一个元素，这个元素就不在数组中了。例如，`trees[3]`被删除，`trees[3]` 仍然可寻址并返回`undefined`。

```
var trees = new Array("redwood", "bay", "cedar", "oak", "maple");
delete trees[3];
if (3 in trees) {
  // 不会被执行
}
```

如果想让数组中存在一个元素但是是`undefined`值，使用`undefined`关键字而不是`delete`操作. 如下： `trees[3]分配一个undefined`,但是这个数组元素仍然存在:

```
var trees = new Array("redwood", "bay", "cedar", "oak", "maple");
trees[3] = undefined;
if (3 in trees) {
  // this gets executed（会被执行）
}
```

### `typeof`

[typeof操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof) 可通过下面2种方式使用：

```
typeof operand
typeof (operand)
```

typeof 操作符返回一个表示 operand 类型的字符串值。operand 可为字符串、变量、关键词或对象，其类型将被返回。operand 两侧的括号为可选。

假设你定义了如下的变量：

```
var myFun = new Function("5 + 2");
var shape = "round";
var size = 1;
var today = new Date();
```

typeof 操作符将会返回如下的结果：

```
typeof myFun;     // returns "function"
typeof shape;     // returns "string"
typeof size;      // returns "number"
typeof today;     // returns "object"
typeof dontExist; // returns "undefined"
```

对于关键词 `true` 和 `null， typeof` 操作符将会返回如下结果：

```
typeof true; // returns "boolean"
typeof null; // returns "object"
```

对于一个数值或字符串`， typeof` 操作符将会返回如下结果：

```
typeof 62;            // returns "number"
typeof 'Hello world'; // returns "string"
```

对于属性值，typeof 操作符将会返回属性所包含值的类型：

```
typeof document.lastModified; // returns "string"
typeof window.length;         // returns "number"
typeof Math.LN2;              // returns "number"
```

对于方法和函数，typeof 操作符将会返回如下结果：

```
typeof blur;        // returns "function"
typeof eval;        // returns "function"
typeof parseInt;    // returns "function"
typeof shape.split; // returns "function"
```

对于预定义的对象，typeof 操作符将会返回如下结果：

```
typeof Date;     // returns "function"
typeof Function; // returns "function"
typeof Math;     // returns "object"
typeof Option;   // returns "function"
typeof String;   // returns "function"
```

### `void`

void 运算符运用方法如下：

```
void (expression)
void expression
```

void运算符,表明一个运算没有返回值。expression是javaScript表达式，括号中的表达式是一个可选项，当然使用该方式是一种好的形式。

你可以使用void运算符指明一个超文本链接。该表达式是有效的，但是并不会在当前文档中进行加载。

如下创建了一个超链接文本，当用户单击该文本时，不会有任何效果。

```
<a href="javascript:void(0)">Click here to do nothing</a>
```

下面的代码创建了一个超链接，当用户单击它时，提交一个表单。

```
<a href="javascript:void(document.form.submit())">
Click here to submit</a>
```

### 关系操作符

关系操作符对操作数进行比较，根据比较结果真或假，返回相应的布尔值。

### `in`

`[in`操作符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in)，如果所指定的**属性**确实存在于所指定的对象中，则会返回`true`，语法如下：

```
propNameOrNumber in objectName
```

在这里 `propNameOrNumber`可以是一个代表着属性名的字符串或者是一个代表着数组索引的数值表达式，而`objectName`则是一个对象名。

下面的例子是 `in` 操作的常见用法。

```
// Arrays
var trees = new Array("redwood", "bay", "cedar", "oak", "maple");
0 in trees;        // returns true
3 in trees;        // returns true
6 in trees;        // returns false
"bay" in trees;    // returns false (you must specify the index number,
                   // not the value at that index)
"length" in trees; // returns true (length is an Array property)

// Predefined objects
"PI" in Math;          // returns true
var myString = new String("coral");
"length" in myString;  // returns true

// Custom objects
var mycar = {make: "Honda", model: "Accord", year: 1998};
"make" in mycar;  // returns true
"model" in mycar; // returns true
```

### `instanceof`

如果所判别的对象确实是所指定的类型，则返回`true`。其语法如下：

```
objectName instanceof objectType
```

`objectName` 是需要做判别的对象的名称,而`objectType`是假定的对象的类型, 例如`[Date](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Date>)`或 `[Array](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array>)`.

当你需要确认一个对象在运行时的类型时，可使用`instanceof`. 例如，需要 catch 异常时，你可以针对抛出异常的类型，来做不同的异常处理。

例如, 下面的代码使用`instanceof`去判断 `theDay`是否是一个 `Date` 对象. `因为theDay`是一个`Date`对象, `所以if`中的代码会执行.

```
var theDay = new Date(1995, 12, 17);
if (theDay instanceof Date) {
  // statements to execute
}
```

### 运算符优先级

运算符的优先级，用于确定一个表达式的计算顺序。在你不能确定优先级时，可以通过使用括号显式声明运算符的优先级。

下表列出了描述符的优先级，从最高到最低。

**运算符优先级**

[Untitled](https://www.notion.so/d80885a4e13543789eb84200e01e8f91)

上表有一个更详细的版本，它包含了各操作符更详细的说明，可在 [JavaScript 参考手册](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Operators/Operator_Precedence#Table) 中找到。

## 表达式

表达式是一组代码的集合，它返回一个值。（译注：定义比较不好理解，看下面的举例就很好懂了。）

每一个合法的表达式都能计算成某个值，但从概念上讲，有两种类型的表达式：有副作用的（比如赋值）和单纯计算求值的。

表达式x=7是第一类型的一个例子。该表达式使用=运算符将值7赋予变量x。这个表达式自己的值等于7。

代码3 + 4是第二个表达式类型的一个例子。该表达式使用+运算符把3和4加到一起但并没有把结果（7）赋值给一个变量。

JavaScript有以下表达式类型：

- 算数: 得出一个数字, 例如 3.14159. (通常使用 [arithmetic operators](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Expressions_and_Operators#Arithmetic_operators).)
- 字符串: 得出一个字符串, 例如, "Fred" 或 "234". (通常使用 [string operators](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Expressions_and_Operators#String_operators).)
- 逻辑值: 得出true或者false. (经常涉及到 [logical operators](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Expressions_and_Operators#Logical_operators).)
- 基本表达式: javascript中基本的关键字和一般表达式。
- 左值表达式: 分配给左值。

### 基本表达式

### `this`

`[this](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this>)`关键字被用于指代当前的对象，通常，`this`指代的是方法中正在被调用的对象。用法如下：

```
this["propertyName"]
this.propertyName
```

假设一个用于验证对象`value`属性的`validate`函数，传参有对象，最高值和最低值。

```
function validate(obj, lowval, hival){
  if ((obj.value < lowval) || (obj.value > hival))
    console.log("Invalid Value!");
}
```

你可以在任何表单元素的`onchange`事件处理中调用`validat`函数，用`this`来指代当前的表单元素，用例如下：

```
<p>Enter a number between 18 and 99:</p><input type="text" name="age" size=3 onChange="validate(this, 18, 99);">
```

### 分组操作符

分组操作符（）控制了表达式中计算的优先级. 举例来说, 你可以改变先乘除后加减的顺序，转而先计算加法。

```
var a = 1;
var b = 2;
var c = 3;

// 默认优先级
a + b * c     // 7
// 默认是这样计算的
a + (b * c)   // 7

// 现在使加法优先于乘法
(a + b) * c   // 9

// 这等价于
a * c + b * c // 9
```

### 数值推导

Comprehensions 是一个带有实验性质的JavaScript特性, 计划将在未来的ECMAScript版本中加入该特性. 有两种类型的comprehensions:

**`[[for (x of y) x]](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Array_comprehensions>)`**数列数值推导 （非标准用法） **`[(for (x of y) y)](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Generator_comprehensions>)`**生成器数值推导 （译者注：生成器数值推导标准化可能不大，推荐使用 [生成器函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Generator_comprehensions)）

Comprehensions特性被许多编程语言所采用，该特性能够使你快速地通过一个已有的数组来创建出一个新的数组，比如：

```
[for (i of [ 1, 2, 3 ]) i*i ]; 
// [ 1, 4, 9 ]

var abc = [ "A", "B", "C" ];
[for (letters of abc) letters.toLowerCase()];
// [ "a", "b", "c" ]
```

### 左值表达式

左值可以作为赋值的目标。

### `new`

你可以使用`[new` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) 创建一个自定义类型或者是`预置类型`的对象实例。用法如下：

```
var objectName = new objectType([param1, param2, ..., paramN]);
```

super

[super](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super) 关键字可以用来调用一个对象父类的函数，它在用来调用一个[类](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)的父类的构造函数时非常有用，比如：

```
super([arguments]); // calls the parent constructor. super.functionOnParent([arguments]);
```

### 扩展语句

[扩展语句](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_operator)符允许一个表达式在原地展开， 当需要多个参数 (比如函数调用时) 或者多个值(比如字面量数组) 。

**例如：**现在你有一个数组，你想创建一个新数组，并将刚才那个作为它的一部分，用array的字面语法是不够的，你不得不写一些代码实现它，比如用些`push`, `splice`, `concat等等。但是用`spread syntax就没问题了：

```
var parts = ['shoulder', 'knees'];
var lyrics = ['head', ...parts, 'and', 'toes'];
```

类似的，扩展语句也可以用在函数调用的时候:

```
function f(x, y, z) { }
var args = [0, 1, 2];
f(...args);
```



# Numbers_and_dates

## 数字

在 JavaScript 里面，数字均为双精度浮点类型（[double-precision 64-bit binary format IEEE 754](https://en.wikipedia.org/wiki/Double-precision_floating-point_format)），即一个介于±2−1023和±2+1024之间的数字，或约为±10−308到±10+308，数字精度为53位。整数数值仅在±(253 - 1)的范围内可以表示准确。

除了能够表示浮点数，数字类型也还能表示三种符号值: `+[Infinity](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Infinity>)`（正无穷）、`-[Infinity](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Infinity>)`（负无穷）和 `[NaN](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN>)` (not-a-number，非数字)。

JavaScript最近添加了 `[BigInt](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt>)` 的支持，能够用于表示极大的数字。使用 BigInt 的时候有一些注意事项，例如，你不能让 BigInt 和 `[Number](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number>)` 直接进行运算，你也不能用 `[Math](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math>)` 对象去操作 BigInt 数字。

请参见Javascript指南中的 [JavaScript 数据类型和数据结构](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures) ，了解其他更多的基本类型。

您可以使用四种数字进制：十进制，二进制，八进制和十六进制。

### 十进制数字(Decimal numbers)

```
1234567890
42
// 以零开头的数字的注意事项：
0888 // 888 将被当做十进制处理
0777 // 在非严格格式下会被当做八进制处理 (用十进制表示就是511)
```

请注意，十进制可以以0开头，后面接其他十进制数字，但是假如下一个接的十进制数字小于8，那么该数字将会被当做八进制处理。

### 二进制数字(Binary numbers)

二进制数字语法是以零为开头，后面接一个小写或大写的拉丁文字母B(`0b或者是0B`)。 假如0b后面的数字不是0或者1，那么就会提示这样的语法错误（ `[SyntaxError](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError>)）：` "Missing binary digits after 0b(0b之后缺失二有效的二进制数据)"。

```
var FLT_SIGNBIT  = 0b10000000000000000000000000000000; // 2147483648
var FLT_EXPONENT = 0b01111111100000000000000000000000; // 2139095040
var FLT_MANTISSA = 0B00000000011111111111111111111111; // 8388607
```

### 八进制数字(Octal numbers)

八进制数字语法是以0为开头的。假如0后面的数字不在0到7的范围内，该数字将会被转换成十进制数字。

```
var n = 0755; // 493
var m = 0644; // 420
```

在ECMAScript 5 严格模式下禁止使用八进制语法。八进制语法并不是ECMAScript 5规范的一部分，但是通过在八进制数字添加一个前缀0就可以被所有的浏览器支持：0644 === 420 而且 "\045" === "%"。在ECMAScript 6中使用八进制数字是需要给一个数字添加前缀"0o"。

```
var a = 0o10; // ES6 :八进制
```

### 十六进制(Hexadecimal numbers)

十六进制数字语法是以零为开头，后面接一个小写或大写的拉丁文字母X(`0x或者是0X`)。假如`0x`后面的数字超出规定范围(0123456789ABCDEF)，那么就会提示这样的语法错误(`[SyntaxError](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError>))：`"Identifier starts immediately after numeric literal".

```
0xFFFFFFFFFFFFFFFFF // 295147905179352830000
0x123456789ABCDEF   // 81985529216486900
0XA                 // 10
```

### 指数形式(Exponentiation)

```
1E3   // 1000
2e6   // 2000000
0.1e2 // 10
```

## `数字对象`

内置的`[Number](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number>)`对象有一些有关数字的常量属性，如最大值、不是一个数字和无穷大的。你不能改变这些属性，但可以按下边的方式使用它们：

```
var biggestNum = Number.MAX_VALUE;
var smallestNum = Number.MIN_VALUE;
var infiniteNum = Number.POSITIVE_INFINITY;
var negInfiniteNum = Number.NEGATIVE_INFINITY;
var notANum = Number.NaN;
```

你永远只用从Number对象引用上边显示的属性，而不是你自己创建的Number对象的属性。

下面的表格汇总了数字对象的属性：

**数字的属性**

[Untitled](https://www.notion.so/707c2550ed0c4d598455b273f10b1fc7)

[Untitled](https://www.notion.so/157239a85007421997b4184a77cb62eb)

数字的类型提供了不同格式的方法以从数字对象中检索信息。以下表格总结了 `数字类型原型上的方法。`

[Untitled](https://www.notion.so/3b5c3bfe3eeb445da190f3fecad7585f)

## 数学对象（Math）

对于内置的`[Math](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math>)`数学常项和函数也有一些属性和方法。 比方说， `Math对象的` `PI` 属性会有属性值 pi (3.141...)，你可以像这样调用它：

```
Math.PI // π
```

同理，标准数学函数也是Math的方法。 这些包括三角函数，对数，指数，和其他函数。比方说你想使用三角函数 `sin`， 你可以这么写：

```
Math.sin(1.56) 
```

需要注意的是Math的所有三角函数参数都是弧度制。

下面的表格总结了 `Math` 对象的方法。

Math的方法

[Untitled](https://www.notion.so/4d00e2516d17480186239dc66c7f4eb4)

和其他对象不同，你不能够创建一个自己的Math对象。你只能使用内置的Math对象。

## 日期对象

JavaScript没有日期数据类型。但是你可以在你的程序里使用 `[Date](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Date>)` 对象和其方法来处理日期和时间。Date对象有大量的设置、获取和操作日期的方法。 它并不含有任何属性。

JavaScript 处理日期数据类似于Java。这两种语言有许多一样的处理日期的方法，也都是以1970年1月1日00:00:00以来的毫秒数来储存数据类型的。

`Date` 对象的范围是相对距离 UTC 1970年1月1日 的前后 100,000,000 天。

创建一个日期对象：

```
var dateObjectName = new Date([parameters]);
```

这里的 dateObjectName 对象是所创建的Date对象的一个名字，它可以成为一个新的对象或者已存在的其他对象的一个属性。

不使用 *new* 关键字来调用Date对象将返回当前时间和日期的字符串

前边的语法中的参数（parameters）可以是一下任何一种：

- 无参数 : 创建今天的日期和时间，例如： `today = new Date();`.
- 一个符合以下格式的表示日期的字符串: "月 日, 年 时:分:秒." 例如： `var Xmas95 = new Date("December 25, 1995 13:30:00")。`如果你省略时、分、秒，那么他们的值将被设置为0。
- 一个年，月，日的整型值的集合，例如： `var Xmas95 = new Date(1995, 11, 25)。`
- 一个年，月，日，时，分，秒的集合，例如： `var Xmas95 = new Date(1995, 11, 25, 9, 30, 0);`.

### `Date对象的方法`

处理日期时间的Date对象方法可分为以下几类：

- "set" 方法, 用于设置Date对象的日期和时间的值。
- "get" 方法,用于获取Date对象的日期和时间的值。
- "to" 方法,用于返回Date对象的字符串格式的值。
- parse 和UTC 方法, 用于解析Date字符串。

通过“get”和“set”方法，你可以分别设置和获取秒，分，时，日，星期，月份，年。这里有个getDay方法可以返回星期，但是没有相应的setDay方法用来设置星期，因为星期是自动设置的。这些方法用整数来代表以下这些值：

- 秒，分： 0 至 59
- 时： 0 至 23
- 星期： 0 (周日) 至 6 (周六)
- 日期：1 至 31
- 月份： 0 (一月) to 11 (十二月)
- 年份： 从1900开始的年数

例如, 假设你定义了如下日期：

```
var Xmas95 = new Date("December 25, 1995");
```

Then `Xmas95.getMonth()` 返回 11, and `Xmas95.getFullYear()` 返回 1995.

`getTime` 和 `setTime` 方法对于比较日期是非常有用的。`getTime`方法返回从1970年1月1日00:00:00的毫秒数。

例如，以下代码展示了今年剩下的天数：

```
var today = new Date();
var endYear = new Date(1995, 11, 31, 23, 59, 59, 999); // 设置日和月，注意，月份是0-11
endYear.setFullYear(today.getFullYear()); // 把年设置为今年
var msPerDay = 24 * 60 * 60 * 1000; // 每天的毫秒数
var daysLeft = (endYear.getTime() - today.getTime()) / msPerDay;
var daysLeft = Math.round(daysLeft); //返回今年剩下的天数
```

这个例子中，创建了一个包含今天的日期的`Date`对象，并命名为`today`，然后创建了一个名为`endYear`的`Date`对象，并把年份设置为当前年份，接着使用`today`和`endYear`的`getTime`分别获取今天和年底的毫秒数，再根据每一天的毫秒数，计算出了今天到年底的天数，最后四舍五入得到今年剩下的天数。

parse方法对于从日期字符串赋值给现有的Date对象很有用，例如：以下代码使用`parse`和`setTime`分配了一个日期值给`IPOdate`对象：

```
var IPOdate = new Date();
IPOdate.setTime(Date.parse("Aug 9, 1995"));
```

### 例子：

在下边的例子中，JSClock()函数返回了用数字时钟格式的时间：

```
function JSClock() {
  var time = new Date();
  var hour = time.getHours();
  var minute = time.getMinutes();
  var second = time.getSeconds();
  var temp = "" + ((hour > 12) ? hour - 12 : hour);
  if (hour == 0)
    temp = "12";
  temp += ((minute < 10) ? ":0" : ":") + minute;
  temp += ((second < 10) ? ":0" : ":") + second;
  temp += (hour >= 12) ? " P.M." : " A.M.";
  return temp;
}
JSClock函数首先创建了一个叫做time的新的Date对象，因为没有参数，所以time代表了当前日期和时间。然后调用了getHours`, `getMinutes以及getSeconds方法把当前的时分秒分别赋值给了hour`, `minute`,`second。
```

接下来的4句在time的基础上创建了一个字符串，第一句创建了一个变量temp，并通过一个条件表达式进行了赋值，如果小时大于12，就为 (`hour - 12`), 其他情况就为 hour, 除非 hour 为 0, 这种情况下，它会变成 12.

接下来的语句拼接了`minute`的值到`temp后。如果minute小于10，条件表达式就会在minute前边加个0，其他情况下加一个分号。然后按同样的方式在temp后拼接上了秒。`

最后，如果hour是12或者更大，条件表达式会在temp后拼接"P.M."，否则拼接"A.M." 。

# 字符串



## 字符串

JavaScript中的 [String](https://developer.mozilla.org/zh-CN/docs/Glossary/字符串) 类型用于表示文本型的数据. 它是由无符号整数值（16bit）作为元素而组成的集合. 字符串中的每个元素在字符串中占据一个位置. 第一个元素的index值是0, 下一个元素的index值是1, 以此类推. 字符串的长度就是字符串中所含的元素个数.你可以通过String字面值或者String对象两种方式创建一个字符串。

### String字面量

可以使用单引号或双引号创建简单的字符串:

```
'foo'
"bar"
```

可以使用转义序列来创建更复杂的字符串:

### 16进制转义序列

\x之后的数值将被认为是一个16进制数.

```
'\\xA9' // "©"
```

### Unicode转义序列

Unicode转义序列在\u之后需要至少4个字符.

```
'\\u00A9' // "©"
```

### Unicode字元逸出

这是ECMAScript 6中的新特性。有了Unicode字元逸出，任何字符都可以用16进制数转义, 这使得通过Unicode转义表示大于`0x10FFFF`的字符成为可能。使用简单的Unicode转义时通常需要分别写字符相应的两个部分（译注：大于0x10FFFF的字符需要拆分为相应的两个小于0x10FFFF的部分）来达到同样的效果。

请参阅 `[String.fromCodePoint()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint>)` 或 `[String.prototype.codePointAt()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt>)`。

```
'\\u{2F804}'

// the same with simple Unicode escapes
'\\uD87E\\uDC04'
```

### 字符串对象

`[String](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String>)` 对象是对原始string类型的封装 .

```
const foo = new String('foo'); // 创建一个 String 对象
console.log(foo); // 输出: [String: 'foo']
typeof foo; // 返回 'object'
```

你可以在String字面值上使用String对象的任何方法—JavaScript自动把String字面值转换为一个临时的String对象, 然后调用其相应方法,最后丢弃此临时对象.在String字面值上也可以使用String.length属性.

除非必要, 应该尽量使用 String 字面值，因为String对象的某些行为可能并不与直觉一致。举例：

```
const firstString = '2 + 2'; //创建一个字符串字面量
const secondString = new String('2 + 2'); // 创建一个字符串对象
eval(firstString); // 返回数字 4
eval(secondString); // 返回字符串 "2 + 2"
```

`String` 对象有一个属性 `length`，标识了字符串中 UTF-16 的码点个数。举例，下面的代码把 13 赋值给了`helloLength`，因为 "Hello, World!" 包含 13 个字符，每个字符用一个 UTF-16 码点表示。你可以通过数组的方式访问每一个码点，但你不能修改每个字符，因为字符串是不变的类数组对象：

```
const hello = 'Hello, World!';
const helloLength = hello.length;
hello[0] = 'L'; // 无效，因为字符串是不变的
hello[0]; // 返回 "H"
```

Characters whose Unicode scalar values are greater than U+FFFF (such as some rare Chinese/Japanese/Korean/Vietnamese characters and some emoji) are stored in UTF-16 with two surrogate code units each. For example, a string containing the single character U+1F600 "Emoji grinning face" will have length 2. Accessing the individual code units in such a string using brackets may have undesirable consequences such as the formation of strings with unmatched surrogate code units, in violation of the Unicode standard. (Examples should be added to this page after MDN bug 857438 is fixed.) See also `[String.fromCodePoint()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint>)` or `[String.prototype.codePointAt()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt>)`.

`String`对象有许多方法: 举例来说有些方法返回字符串本身的变体, 如 `substring` 和`toUpperCase`.

下表总结了 `[String](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String>)` 对象的方法.

[Untitled](https://www.notion.so/2143b0ed2488489abe978e4ef3af1b6f)

### 多行模板字符串

模板字符串是一种允许内嵌表达式的String字面值. 可以用它实现多行字符串或者字符串内插等特性.

模板字符串使用反勾号 (``) ([grave accent](https://en.wikipedia.org/wiki/Grave_accent)) 包裹内容而不是单引号或双引号. 模板字符串可以包含占位符. 占位符用美元符号和花括号标识 (`${expression}`).

### 多行

源代码中插入的任何新行开始字符都作为模板字符串的内容. 使用一般的字符串时, 为了创建多行的字符串不得不用如下语法:

```
console.log("string text line 1\\n\\
string text line 2");
// "string text line 1
// string text line 2"
```

为了实现同样效果的多行字符串, 现在可以写成如下形式:

```
console.log(`string text line 1
string text line 2`);
// "string text line 1
// string text line 2"
```

### 嵌入表达式

为了在一般的字符串中嵌入表达式, 需要使用如下语法:

```
const five = 5;
const ten = 10;
console.log('Fifteen is ' + (five + ten) + ' and not ' + (2 * five + ten) + '.');
// "Fifteen is 15 and not 20."
```

现在, 使用模板字符串, 可以使用语法糖让类似功能的实现代码更具可读性:

```
const five = 5;
const ten = 10;
console.log(`Fifteen is ${five + ten} and not ${2 * five + ten}.`);
// "Fifteen is 15 and not 20."
```

更多信息, 请阅读 [JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference) 中的 [Template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings)。

## 国际化

`[Intl](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl>)` 对象是ECMAScript国际化API的命名空间, 它提供了语言敏感的字符串比较，数字格式化和日期时间格式化功能.  `[Collator](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Collator>)`, `[NumberFormat](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat>)`, 和 `[DateTimeFormat](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat>)` 对象的构造函数是`Intl`对象的属性.

### 日期和时间格式化

`[DateTimeFormat](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat>)` 对象在日期和时间的格式化方面很有用. 下面的代码把一个日期格式化为美式英语格式. (不同时区结果不同.)

```
const msPerDay = 24 * 60 * 60 * 1000;
 
// July 17, 2014 00:00:00 UTC.
const july172014 = new Date(msPerDay * (44 * 365 + 11 + 197));//2014-1970=44年
//这样创建日期真是醉人。。。还要自己计算天数。。。11是闰年中多出的天数。。。
//197是6×30+16(7月的16天)+3(3个大月)-2(2月少2天)

const options = { year: "2-digit", month: "2-digit", day: "2-digit",
                hour: "2-digit", minute: "2-digit", timeZoneName: "short" };
const americanDateTime = new Intl.DateTimeFormat("en-US", options).format;
 
console.log(americanDateTime(july172014)); // 07/16/14, 5:00 PM PDT
```

### 数字格式化

`[NumberFormat](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat>)` 对象在数字的格式化方面很有用, 比如货币数量值.

```
var gasPrice = new Intl.NumberFormat("en-US",
                        { style: "currency", currency: "USD",
                          minimumFractionDigits: 3 });
 
console.log(gasPrice.format(5.259)); // $5.259

var hanDecimalRMBInChina = new Intl.NumberFormat("zh-CN-u-nu-hanidec",
                        { style: "currency", currency: "CNY" });
 
console.log(hanDecimalRMBInChina.format(1314.25)); // ￥ 一,三一四.二五
```

### 定序

`[Collator](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Collator>)` 对象在字符串比较和排序方面很有用.

举例, 德语中*有两种不同的排序方式 电话本（phonebook）* 和 字典（*dictionary）*. 电话本排序强调发音, 比如在排序前 “ä”, “ö”等被扩展为 “ae”, “oe”等发音.

```
var names = ["Hochberg", "Hönigswald", "Holzman"];
 
var germanPhonebook = new Intl.Collator("de-DE-u-co-phonebk");
 
// as if sorting ["Hochberg", "Hoenigswald", "Holzman"]:
console.log(names.sort(germanPhonebook.compare).join(", "));
// logs "Hochberg, Hönigswald, Holzman"
```

有些德语词包含变音, 所以在字典中忽略变音进行排序是合理的 (除非待排序的单词只有变音部分不同: *schon* 先于 *schön*).

```
var germanDictionary = new Intl.Collator("de-DE-u-co-dict");
 
// as if sorting ["Hochberg", "Honigswald", "Holzman"]:
console.log(names.sort(germanDictionary.compare).join(", "));
// logs "Hochberg, Holzman, Hönigswald"
```



# **Closures**

一个函数和对其周围状态（**lexical environment，词法环境**）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是**闭包**（**closure**）。也就是说，闭包让你可以在一个内层函数中访问到其外层函数的作用域。在 JavaScript 中，每当创建一个函数，闭包就会在函数创建的同时被创建出来。

## **词法作用域**

请看下面的代码：

```
function init() { var name = "Mozilla"; // name 是一个被 init 创建的局部变量 function displayName() { // displayName() 是内部函数，一个闭包 alert(name); // 使用了父函数中声明的变量 } displayName(); } init();
```

`init()` 创建了一个局部变量 `name` 和一个名为 `displayName()` 的函数。`displayName()` 是定义在 `init()` 里的内部函数，并且仅在 `init()` 函数体内可用。请注意，`displayName()` 没有自己的局部变量。然而，因为它可以访问到外部函数的变量，所以 `displayName()` 可以使用父函数 `init()` 中声明的变量 `name` 。

使用[这个 JSFiddle 链接](http://jsfiddle.net/xAFs9/3/)运行该代码后发现， `displayName()` 函数内的 `alert()` 语句成功显示出了变量 `name` 的值（该变量在其父函数中声明）。这个*词法作用域*的例子描述了分析器如何在函数嵌套的情况下解析变量名。词法（lexical）一词指的是，词法作用域根据源代码中声明变量的位置来确定该变量在何处可用。嵌套函数可访问声明于它们外部作用域的变量。

## **闭包**

现在来考虑以下例子 ：

```
function makeFunc() {
    var name = "Mozilla";
    function displayName() {
        alert(name);
    }
    return displayName;
}

var myFunc = makeFunc();
myFunc();
```

运行这段代码的效果和之前 `init()` 函数的示例完全一样。其中不同的地方（也是有意思的地方）在于内部函数 `displayName()` *在执行前*，从外部函数返回。

第一眼看上去，也许不能直观地看出这段代码能够正常运行。在一些编程语言中，一个函数中的局部变量仅存在于此函数的执行期间。一旦 `makeFunc()` 执行完毕，你可能会认为 `name` 变量将不能再被访问。然而，因为代码仍按预期运行，所以在 JavaScript 中情况显然与此不同。

原因在于，JavaScript中的函数会形成了闭包。 *闭包*是由函数以及声明该函数的词法环境组合而成的。该环境包含了这个闭包创建时作用域内的任何局部变量。在本例子中，`myFunc` 是执行 `makeFunc` 时创建的 `displayName` 函数实例的引用。`displayName` 的实例维持了一个对它的词法环境（变量 `name` 存在于其中）的引用。因此，当 `myFunc` 被调用时，变量 `name` 仍然可用，其值 `Mozilla` 就被传递到`alert`中。

下面是一个更有意思的示例 — 一个 `makeAdder` 函数：

```
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

var add5 = makeAdder(5);
var add10 = makeAdder(10);

console.log(add5(2));  // 7
console.log(add10(2)); // 12
```

在这个示例中，我们定义了 `makeAdder(x)` 函数，它接受一个参数 `x` ，并返回一个新的函数。返回的函数接受一个参数 `y`，并返回`x+y`的值。

从本质上讲，`makeAdder` 是一个函数工厂 — 他创建了将指定的值和它的参数相加求和的函数。在上面的示例中，我们使用函数工厂创建了两个新函数 — 一个将其参数和 5 求和，另一个和 10 求和。

`add5` 和 `add10` 都是闭包。它们共享相同的函数定义，但是保存了不同的词法环境。在 `add5` 的环境中，`x` 为 5。而在 `add10` 中，`x` 则为 10。

## 实用的闭包

闭包很有用，因为它允许将函数与其所操作的某些数据（环境）关联起来。这显然类似于面向对象编程。在面向对象编程中，对象允许我们将某些数据（对象的属性）与一个或者多个方法相关联。

因此，通常你使用只有一个方法的对象的地方，都可以使用闭包。

在 Web 中，你想要这样做的情况特别常见。大部分我们所写的 JavaScript 代码都是基于事件的 — 定义某种行为，然后将其添加到用户触发的事件之上（比如点击或者按键）。我们的代码通常作为回调：为响应事件而执行的函数。

假如，我们想在页面上添加一些可以调整字号的按钮。一种方法是以像素为单位指定 `body` 元素的 `font-size`，然后通过相对的 `em` 单位设置页面中其它元素（例如`header`）的字号：

```
body {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 12px;
}

h1 {
  font-size: 1.5em;
}

h2 {
  font-size: 1.2em;
}
```

我们的文本尺寸调整按钮可以修改 `body` 元素的 `font-size` 属性，由于我们使用相对单位，页面中的其它元素也会相应地调整。

以下是 JavaScript：

```
function makeSizer(size) {
  return function() {
    document.body.style.fontSize = size + 'px';
  };
}

var size12 = makeSizer(12);
var size14 = makeSizer(14);
var size16 = makeSizer(16);
```

`size12`，`size14` 和 `size16` 三个函数将分别把 `body` 文本调整为 12，14，16 像素。我们可以将它们分别添加到按钮的点击事件上。如下所示：

```
document.getElementById('size-12').onclick = size12;
document.getElementById('size-14').onclick = size14;
document.getElementById('size-16').onclick = size16;
<a href="#" id="size-12">12</a><a href="#" id="size-14">14</a><a href="#" id="size-16">16</a>
```

## 用闭包模拟私有方法

编程语言中，比如 Java，是支持将方法声明为私有的，即它们只能被同一个类中的其它方法所调用。

而 JavaScript 没有这种原生支持，但我们可以使用闭包来模拟私有方法。私有方法不仅仅有利于限制对代码的访问：还提供了管理全局命名空间的强大能力，避免非核心的方法弄乱了代码的公共接口部分。

下面的示例展现了如何使用闭包来定义公共函数，并令其可以访问私有函数和变量。这个方式也称为 [模块模式（module pattern）：](http://www.google.com/search?q=javascript+module+pattern)

```
var Counter = (function() {
  var privateCounter = 0;
  function changeBy(val) {
    privateCounter += val;
  }
  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    }
  }   
})();

console.log(Counter.value()); /* logs 0 */
Counter.increment();
Counter.increment();
console.log(Counter.value()); /* logs 2 */
Counter.decrement();
console.log(Counter.value()); /* logs 1 */
```

在之前的示例中，每个闭包都有它自己的词法环境；而这次我们只创建了一个词法环境，为三个函数所共享：`Counter.increment，Counter.decrement` 和 `Counter.value`。

该共享环境创建于一个立即执行的匿名函数体内。这个环境中包含两个私有项：名为 `privateCounter` 的变量和名为 `changeBy` 的函数。这两项都无法在这个匿名函数外部直接访问。必须通过匿名函数返回的三个公共函数访问。

这三个公共函数是共享同一个环境的闭包。多亏 JavaScript 的词法作用域，它们都可以访问 `privateCounter` 变量和 `changeBy` 函数。

你应该注意到我们定义了一个匿名函数，用于创建一个计数器。我们立即执行了这个匿名函数，并将他的值赋给了变量`Counter`。我们可以把这个函数储存在另外一个变量`makeCounter`中，并用他来创建多个计数器。

```
var makeCounter = function() {
  var privateCounter = 0;
  function changeBy(val) {
    privateCounter += val;
  }
  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    }
  }  
};

var Counter1 = makeCounter();
var Counter2 = makeCounter();
console.log(Counter1.value()); /* logs 0 */
Counter1.increment();
Counter1.increment();
console.log(Counter1.value()); /* logs 2 */
Counter1.decrement();
console.log(Counter1.value()); /* logs 1 */
console.log(Counter2.value()); /* logs 0 */
```

请注意两个计数器 `Counter1` 和 `Counter2` 是如何维护它们各自的独立性的。每个闭包都是引用自己词法作用域内的变量 `privateCounter` 。

每次调用其中一个计数器时，通过改变这个变量的值，会改变这个闭包的词法环境。然而在一个闭包内对变量的修改，不会影响到另外一个闭包中的变量。

以这种方式使用闭包，提供了许多与面向对象编程相关的好处 —— 特别是数据隐藏和封装。

## 在循环中创建闭包：一个常见错误

在 ECMAScript 2015 引入 `[let` 关键字](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Statements/let) 之前，在循环中有一个常见的闭包创建问题。参考下面的示例：

```
<p id="help">Helpful notes will appear here</p><p>E-mail: <input type="text" id="email" name="email"></p><p>Name: <input type="text" id="name" name="name"></p><p>Age: <input type="text" id="age" name="age"></p>
function showHelp(help) {
  document.getElementById('help').innerHTML = help;
}

function setupHelp() {
  var helpText = [
      {'id': 'email', 'help': 'Your e-mail address'},
      {'id': 'name', 'help': 'Your full name'},
      {'id': 'age', 'help': 'Your age (you must be over 16)'}
    ];

  for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i];
    document.getElementById(item.id).onfocus = function() {
      showHelp(item.help);
    }
  }
}

setupHelp(); 
```

数组 `helpText` 中定义了三个有用的提示信息，每一个都关联于对应的文档中的`input` 的 ID。通过循环这三项定义，依次为相应`input`添加了一个 `onfocus` 事件处理函数，以便显示帮助信息。

运行这段代码后，您会发现它没有达到想要的效果。无论焦点在哪个`input`上，显示的都是关于年龄的信息。

原因是赋值给 `onfocus` 的是闭包。这些闭包是由他们的函数定义和在 `setupHelp` 作用域中捕获的环境所组成的。这三个闭包在循环中被创建，但他们共享了同一个词法作用域，在这个作用域中存在一个变量item。这是因为变量item使用var进行声明，由于变量提升，所以具有函数作用域。当`onfocus`的回调执行时，`item.help`的值被决定。由于循环在事件触发之前早已执行完毕，变量对象`item`（被三个闭包所共享）已经指向了`helpText`的最后一项。

解决这个问题的一种方案是使用更多的闭包：特别是使用前面所述的函数工厂：

```
function showHelp(help) {
  document.getElementById('help').innerHTML = help;
}

function makeHelpCallback(help) {
  return function() {
    showHelp(help);
  };
}

function setupHelp() {
  var helpText = [
      {'id': 'email', 'help': 'Your e-mail address'},
      {'id': 'name', 'help': 'Your full name'},
      {'id': 'age', 'help': 'Your age (you must be over 16)'}
    ];

  for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i];
    document.getElementById(item.id).onfocus = makeHelpCallback(item.help);
  }
}

setupHelp(); 
```

这段代码可以如我们所期望的那样工作。所有的回调不再共享同一个环境， `makeHelpCallback` 函数为每一个回调创建一个新的词法环境。在这些环境中，`help` 指向 `helpText` 数组中对应的字符串。

另一种方法使用了匿名闭包：

```
function showHelp(help) {
  document.getElementById('help').innerHTML = help;
}

function setupHelp() {
  var helpText = [
      {'id': 'email', 'help': 'Your e-mail address'},
      {'id': 'name', 'help': 'Your full name'},
      {'id': 'age', 'help': 'Your age (you must be over 16)'}
    ];

  for (var i = 0; i < helpText.length; i++) {
    (function() {
       var item = helpText[i];
       document.getElementById(item.id).onfocus = function() {
         showHelp(item.help);
       }
    })(); // 马上把当前循环项的item与事件回调相关联起来
  }
}

setupHelp();
```

如果不想使用过多的闭包，你可以用ES2015引入的let关键词：

```
function showHelp(help) {
  document.getElementById('help').innerHTML = help;
}

function setupHelp() {
  var helpText = [
      {'id': 'email', 'help': 'Your e-mail address'},
      {'id': 'name', 'help': 'Your full name'},
      {'id': 'age', 'help': 'Your age (you must be over 16)'}
    ];

  for (var i = 0; i < helpText.length; i++) {
    let item = helpText[i];
    document.getElementById(item.id).onfocus = function() {
      showHelp(item.help);
    }
  }
}

setupHelp();
```

这个例子使用`let`而不是`var`，因此每个闭包都绑定了块作用域的变量，这意味着不再需要额外的闭包。

另一个可选方案是使用 `forEach()`来遍历`helpText`数组并给每一个`[<p>](<https://wiki.developer.mozilla.org/en-US/docs/Web/HTML/Element/p>)`添加一个监听器，如下所示：

```
function showHelp(help) {
  document.getElementById('help').innerHTML = help;
}

function setupHelp() {
  var helpText = [
      {'id': 'email', 'help': 'Your e-mail address'},
      {'id': 'name', 'help': 'Your full name'},
      {'id': 'age', 'help': 'Your age (you must be over 16)'}
    ];

  helpText.forEach(function(text) {
    document.getElementById(text.id).onfocus = function() {
      showHelp(text.help);
    }
  });
}

setupHelp();
```

## 性能考量

如果不是某些特定任务需要使用闭包，在其它函数中创建函数是不明智的，因为闭包在处理速度和内存消耗方面对脚本性能具有负面影响。

例如，在创建新的对象或者类时，方法通常应该关联于对象的原型，而不是定义到对象的构造器中。原因是这将导致每次构造器被调用时，方法都会被重新赋值一次（也就是说，对于每个对象的创建，方法都会被重新赋值）。

考虑以下示例：

```
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
  this.getName = function() {
    return this.name;
  };

  this.getMessage = function() {
    return this.message;
  };
}
```

在上面的代码中，我们并没有利用到闭包的好处，因此可以避免使用闭包。修改成如下：

```
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
}
MyObject.prototype = {
  getName: function() {
    return this.name;
  },
  getMessage: function() {
    return this.message;
  }
};
```

但我们不建议重新定义原型。可改成如下例子：

```
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
}
MyObject.prototype.getName = function() {
  return this.name;
};
MyObject.prototype.getMessage = function() {
  return this.message;
};
```

在前面的两个示例中，继承的原型可以为所有对象共享，不必在每一次创建对象时定义方法。参见 [对象模型的细节](https://developer.mozilla.org/zh-CN/docs/JavaScript/Guide/Details_of_the_Object_Model) 一章可以了解更为详细的信息。

