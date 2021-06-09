---
title: 数组
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

## 数组对象(Array object)

数组(array)是一个有序的数据集合，我们可以通过数组名称(name)和索引(index)进行访问。例如，我们定义了一个数组emp，数组中的每个元素包含了一个雇员的名字以及其作为索引的员工号。那么emp[1]将会代表1号员工，emp[2]将会代表2号员工，以此类推。

JavaScript中没有明确的数组数据类型。但是，我们可以通过使用内置Array对象和它的方法对数组进行操作。Array对象有很多操作数组的方法，比如合并、反转、排序等。数组对象有一个决定数组长度和使用正则表达式操作其他属性的属性。

### 创建数组(creating an array)

以下语句创建等效的数组:

```
var arr = new Array(element0, element1, ..., elementN);
var arr = Array(element0, element1, ..., elementN);
var arr = [element0, element1, ..., elementN];

// 译者注: var arr=[4] 和 var arr=new Array(4)是不等效的，
// 后者4指数组长度，所以使用字面值(literal)的方式应该不仅仅是便捷，同时也不易踩坑
```

`element0, element1, ..., elementN` 是数组元素的值的列表。当这些值被指定后，数组将被初始化，他们将被作为数组元素。数组的length属性也会被设为参数的个数。

括号语法被称为 "数组字面值" 或 "数组初始化器", 它比其他创建数组的方式更便捷，所以通常是首选。详细内容参见 [Array literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Array_literals) 。

为了创建一个长度不为0，但是又没有任何元素的数组，可选以下任何一种方式：

```
var arr = new Array(arrayLength);
var arr = Array(arrayLength);

// 这样有同样的效果
var arr = [];
arr.length = arrayLength;
```

**注意:** 以上代码，数组长度（arrayLength）必须为一个数字（Number）。否则，将会创建一个只有单个（所输入的）元素的数组。 调用 `arr.length` 会返回数组长度，但是数组实际上包含了空的（`undefined`）元素。 因此在数组上使用 `[for...in](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in>)` 循环，将不会返回任何的值 。

除了如上所示创建新定义的变量，数组(array)也可以作为一个属性(property)分配给一个新的或者已存在的对象(object)：

```
var obj = {};
// ...
obj.prop = [element0, element1, ..., elementN];

// OR
var obj = {prop: [element0, element1, ...., elementN]}
```

如果你希望用单个元素初始化一个数组，而这个元素恰好又是数字(`Number`)，那么你必须使用括号语法。当单个的数字(`Number`)传递给Array()构造函数时，将会被解释为数组长度，并非单个元素。

```
var arr = [42];      // 创建一个只有唯一元素的数组:
                     // the number 42.
var arr = Array(42); // 创建一个没有元素的数组, 
                     // 但是数组的长度被设置成42.

// 上面的代码与下面的代码等价
var arr = [];
arr.length = 42;
```

如果N不是一个整数，调用`Array(N)`将会报`RangeError`错误， 以下方法说明了这种行为：

```
var arr = Array(9.3);  // RangeError: Invalid array length
```

如果你需要创建任意类型的单元素数组，安全的方式是使用字面值。或者在向数组添加单个元素之前先创建一个空的数组。

### 填充数组(populating an array)

你可以通过给元素赋值来填充数组，例如：

```
var emp = [];
emp[0] = "Casey Jones";
emp[1] = "Phil Lesh";
emp[2] = "August West";
```

**注意：**如果你在以上代码中给数组操作符的是一个非整形数值，那么将作为一个代表数组的对象的属性(property)创建，而非作为数组的元素。

```
var arr = [];
arr[3.4] = "Oranges";
console.log(arr.length);                // 0
console.log(arr.hasOwnProperty(3.4));   // true
```

你也可以在创建数组的时候去填充它：

```
var myArray = new Array("Hello", myVar, 3.14159);
var myArray = ["Mango", "Apple", "Orange"]
```

### 引用数组元素(referring to array elements)

您通过可以使用元素的序号来引用数组的元素。例如，假设你定义了如下数组：

```
var myArray = ["Wind", "Rain", "Fire"];
```

你可以用 `myArray[0]`引用第一个元素，`myArray[1]`引用第二个元素。元素的索引是从`0`开始的。

**注意：**数组操作符（方括号 [ ]）也可以用来访问数组的属性(在 JavaScript 中，数组也是对象)。例如：

```
var arr = ["one", "two", "three"];
arr[2];  // three
arr["length"];  // 3
```

### 理解 length

在实施层面， JavaScript实际上是将元素作为标准的对象属性来存储，把数组索引作为属性名。长度属性是特殊的，它总是返回最后一个元素的索引值加1(下例中， Dusty 的索引是30，所以cats.length 返回 30 + 1)。记住， JavaScript 数组索引是基于0的: 他们从0开始，而不是1。这意味着数组长度属性将比最大的索引值大1:

```
var cats = [];
cats[30] = ['Dusty'];
console.log(cats.length); // 31
```

你也可以分配`length`属性。写一个小于数组元素数量的值会缩短数组，写0会彻底清空数组：

```
var cats = ['Dusty', 'Misty', 'Twiggy'];
console.log(cats.length); // 3

cats.length = 2;
console.log(cats); // logs "Dusty,Misty" - Twiggy has been removed

cats.length = 0;
console.log(cats); // logs nothing; the cats array is empty

cats.length = 3;
console.log(cats); // [undefined, undefined, undefined]
```

### 遍历数组(interating over array)

遍历数组元素并以某种方式处理每个元素是一个常见的操作。以下是最简单的方式：

```
var colors = ['red', 'green', 'blue'];
for (var i = 0; i < colors.length; i++) {
  console.log(colors[i]);
}
```

如果你确定数组中没有一个元素的求值是false —— 如果你的数组只包含[DOM](https://developer.mozilla.org/en-US/docs/DOM)节点，如下,你可以选择一个更高效的土法子:

```
var divs = document.getElementsByTagName('div');
for (var i = 0, div; div = divs[i]; i++) {
  /* Process div in some way */
}
```

这样避免了检测数组长度的开销，额外的好处是确保了div变量当前在每次循环中都被重新赋值为当前项。

`[forEach()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach>)` 方法提供了遍历数组元素的其他方法：

```
var colors = ['red', 'green', 'blue'];
colors.forEach(function(color) {
  console.log(color);
});
```

被传递给forEach的函数会在数组的每个元素像上执行一次，元素作为参数传递给该函数。未赋值的值不会在forEach循环迭代。

注意，在数组定义时省略的元素不会在forEach遍历时被列出，但是手动赋值为undefined的元素是会被列出的：

```
var array = ['first', 'second', , 'fourth'];

// returns ['first', 'second', 'fourth'];
array.forEach(function(element) {
  console.log(element);
})

if(array[2] === undefined) { console.log('array[2] is undefined'); } // true

var array = ['first', 'second', undefined, 'fourth'];

// returns ['first', 'second', undefined, 'fourth'];
array.forEach(function(element) {
  console.log(element);
})
```

一旦 JavaScript 元素被保存为标准的对象属性，通过`[for...in](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in>)` 循环来迭代数组将变得不明智，因为正常元素和所有可枚举的属性都会被列出。

### 数组的方法(array methods)

`[Array](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array>)` 对象具有下列方法：

`[concat()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat>)` 连接两个数组并返回一个新的数组。

```
var myArray = new Array("1", "2", "3");
myArray = myArray.concat("a", "b", "c"); 
// myArray is now ["1", "2", "3", "a", "b", "c"]
```

`[join(deliminator = ',')](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/join>)` 将数组的所有元素连接成一个字符串。

```
var myArray = new Array("Wind", "Rain", "Fire");
var list = myArray.join(" - "); // list is "Wind - Rain - Fire"
```

`[push()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/push>)` 在数组末尾添加一个或多个元素，并返回数组操作后的长度。

```
var myArray = new Array("1", "2");
myArray.push("3"); // myArray is now ["1", "2", "3"]
```

`[pop()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/pop>)` 从数组移出最后一个元素，并返回该元素。

```
var myArray = new Array("1", "2", "3");
var last = myArray.pop(); 
// myArray is now ["1", "2"], last = "3"
```

`[shift()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/shift>)` 从数组移出第一个元素，并返回该元素。

```
var myArray = new Array ("1", "2", "3");
var first = myArray.shift(); 
// myArray is now ["2", "3"], first is "1"
```

`[unshift()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/shift>)` 在数组开头添加一个或多个元素，并返回数组的新长度。

```
var myArray = new Array ("1", "2", "3");
myArray.unshift("4", "5"); 
// myArray becomes ["4", "5", "1", "2", "3"]
```

`[slice(start_index, upto_index)](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice>)` 从数组提取一个片段，并作为一个新数组返回。

```
var myArray = new Array ("a", "b", "c", "d", "e");
myArray = myArray.slice(1, 4); // 包含索引1，不包括索引4
                               // returning [ "b", "c", "d"]
```

`[splice(index, count_to_remove, addElement1, addElement2, ...)](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice>)`从数组移出一些元素，（可选）并替换它们。

```
var myArray = new Array ("1", "2", "3", "4", "5");
myArray.splice(1, 3, "a", "b", "c", "d"); 
// myArray is now ["1", "a", "b", "c", "d", "5"]
// This code started at index one (or where the "2" was), 
// removed 3 elements there, and then inserted all consecutive
// elements in its place.
```

`[reverse()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse>)` 颠倒数组元素的顺序：第一个变成最后一个，最后一个变成第一个。

```
var myArray = new Array ("1", "2", "3");
myArray.reverse(); 
// transposes the array so that myArray = [ "3", "2", "1" ]
```

`[sort()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort>)` 给数组元素排序。

```
var myArray = new Array("Wind", "Rain", "Fire");
myArray.sort(); 
// sorts the array so that myArray = [ "Fire", "Rain", "Wind" ]
```

`sort()` 也可以带一个回调函数来决定怎么比较数组元素。这个回调函数比较两个值，并返回3个值中的一个：

例如，下面的代码通过字符串的最后一个字母进行排序：

```
var sortFn = function(a, b){
  if (a[a.length - 1] < b[b.length - 1]) return -1;
  if (a[a.length - 1] > b[b.length - 1]) return 1;
  if (a[a.length - 1] == b[b.length - 1]) return 0;
}
myArray.sort(sortFn); 
// sorts the array so that myArray = ["Wind","Fire","Rain"]
```

- 如果 a 小于 b ，返回 -1(或任何负数)
- 如果 `a` 大于 `b` ，返回 1 (或任何正数)
- 如果 `a` 和 `b` 相等，返回 0。

`[indexOf(searchElement[, fromIndex])](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf>)` 在数组中搜索`searchElement` 并返回第一个匹配的索引。

```
var a = ['a', 'b', 'a', 'b', 'a'];
console.log(a.indexOf('b')); // logs 1
// Now try again, starting from after the last match
console.log(a.indexOf('b', 2)); // logs 3
console.log(a.indexOf('z')); // logs -1, because 'z' was not found
[lastIndexOf(searchElement[, fromIndex])](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf>)` 和 `indexOf 差不多，但这是从结尾开始，并且是反向搜索。
var a = ['a', 'b', 'c', 'd', 'a', 'b'];
console.log(a.lastIndexOf('b')); // logs 5
// Now try again, starting from before the last match
console.log(a.lastIndexOf('b', 4)); // logs 1
console.log(a.lastIndexOf('z')); // logs -1
```

`[forEach(callback[, thisObject])](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach>)` 在数组每个元素项上执行`callback`。

```
var a = ['a', 'b', 'c'];
a.forEach(function(element) { console.log(element);} ); 
// logs each item in turn
```

`[map(callback[, thisObject])](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map>)` 在数组的每个单元项上执行callback函数，并把返回包含回调函数返回值的新数组（译者注：也就是遍历数组，并通过callback对数组元素进行操作，并将所有操作结果放入数组中并返回该数组）。

```
var a1 = ['a', 'b', 'c'];
var a2 = a1.map(function(item) { return item.toUpperCase(); });
console.log(a2); // logs A,B,C
```

`[filter(callback[, thisObject])](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter>)` 返回一个包含所有在回调函数上返回为true的元素的新数组（译者注：callback在这里担任的是过滤器的角色，当元素符合条件，过滤器就返回true，而filter则会返回所有符合过滤条件的元素）。

```
var a1 = ['a', 10, 'b', 20, 'c', 30];
var a2 = a1.filter(function(item) { return typeof item == 'number'; });
console.log(a2); // logs 10,20,30
```

`[every(callback[, thisObject])](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every>)` 当数组中每一个元素在callback上被返回true时就返回true（译者注：同上，every其实类似filter，只不过它的功能是判断是不是数组中的所有元素都符合条件，并且返回的是布尔值）。

```
function isNumber(value){
  return typeof value == 'number';
}
var a1 = [1, 2, 3];
console.log(a1.every(isNumber)); // logs true
var a2 = [1, '2', 3];
console.log(a2.every(isNumber)); // logs false
```

`[some(callback[, thisObject])](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some>)` 只要数组中有一项在callback上被返回true，就返回true（译者注：同上，类似every，不过前者要求都符合筛选条件才返回true，后者只要有符合条件的就返回true）。

```
function isNumber(value){
  return typeof value == 'number';
}
var a1 = [1, 2, 3];
console.log(a1.some(isNumber)); // logs true
var a2 = [1, '2', 3];
console.log(a2.some(isNumber)); // logs true
var a3 = ['1', '2', '3'];
console.log(a3.some(isNumber)); // logs false
```

以上方法都带一个被称为迭代方法的的回调函数，因为他们以某种方式迭代整个数组。都有一个可选的第二参数 `thisObject`，如果提供了这个参数，`thisObject` 变成回调函数内部的 this 关键字的值。如果没有提供，例如函数在一个显示的对象上下文外被调用时，this 将引用全局对象(`[window](<https://developer.mozilla.org/zh-CN/docs/Web/API/Window>)`).

实际上在调用回调函数时传入了3个参数。第一个是当前元素项的值，第二个是它在数组中的索引，第三个是数组本身的一个引用。 JavaScript 函数忽略任何没有在参数列表中命名的参数，因此提供一个只有一个参数的回调函数是安全的，例如 `alert` 。

`[reduce(callback[, initialValue])](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce>)` 使用回调函数 `callback(firstValue, secondValue)` 把数组列表计算成一个单一值（译者注：他数组元素两两递归处理的方式把数组计算成一个值）

```
var a = [10, 20, 30];
var total = a.reduce(function(first, second) { return first + second; }, 0);
console.log(total) // Prints 60
[reduceRight(callback[, initalvalue])](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight>)` 和 `reduce()相似，但这从最后一个元素开始的。
```

`reduce` 和 `reduceRight` 是迭代数组方法中最不被人熟知的两个函数.。他们应该使用在那些需要把数组的元素两两递归处理，并最终计算成一个单一结果的算法。

### 多维数组(multi-dimensional arrays)

数组是可以嵌套的, 这就意味着一个数组可以作为一个元素被包含在另外一个数组里面。利用JavaScript数组的这个特性, 可以创建多维数组。

以下代码创建了一个二维数组。

```
var a = new Array(4);
for (i = 0; i < 4; i++) {
  a[i] = new Array(4);
  for (j = 0; j < 4; j++) {
    a[i][j] = "[" + i + "," + j + "]";
  }
}
```

这个例子创建的数组拥有以下行数据:

```
Row 0: [0,0] [0,1] [0,2] [0,3]
Row 1: [1,0] [1,1] [1,2] [1,3]
Row 2: [2,0] [2,1] [2,2] [2,3]
Row 3: [3,0] [3,1] [3,2] [3,3]
```

### 数组和正则表达式

当一个数组作为字符串和正则表达式的匹配结果时，该数组将会返回相关匹配信息的属性和元素。 `[RegExp.exec()](<https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/RegExp/exec>)`, `[String.match()](<https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/match>) 和` `[String.split()](<https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/split>) 的返回值是一个数组。` 使用数组和正则表达式的的更多信息, 请看 [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).

### 使用类数组对象(array-like objects)

一些 JavaScript 对象, 例如 `[document.getElementsByTagName()](<https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementsByTagName>)` 返回的 `[NodeList](<https://developer.mozilla.org/zh-CN/docs/Web/API/NodeList>)` 或者函数内部可用的 `[arguments](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments>)` 对象，他们表面上看起来，外观和行为像数组，但是不共享他们所有的方法。例如 `arguments` 对象就提供一个 `[length](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length>)` 属性，但是不实现 `[forEach()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach>)` 方法。

Array的原生(prototype)方法可以用来处理类似数组行为的对象，例如： :

```
function printArguments() {
  Array.prototype.forEach.call(arguments, function(item) {
    console.log(item);
  });
}
```

Array的常规方法也可以用于处理字符串，因为它提供了序列访问字符转为数组的简单方法：

```
Array.prototype.forEach.call("a string", function(chr) {
  console.log(chr);
});
```

## 数组推导式（Array comprehensions）

在[JavaScript 1.7](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/1.7) 被介绍并计划在 [ECMAScript 7](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_7_support_in_Mozilla), [array comprehensions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Array_comprehensions) 被规范化并提供一个有用的快捷方式，用来实现如何在另一个数组的基础上构造一个新的数组。推导式可以经常被用在那些需要调用 `map()` 和 `filter()函数的地方，`或作为一种结合这两种方式。

下面的推导式创建一个数字数组并且创建一个新的数组，数组的每个元素都是原来数值的两倍（译者注：这种形式类似于Python的列表推导式）。

```
var numbers = [1, 2, 3, 4];
var doubled = [for (i of numbers) i * 2];
console.log(doubled); // logs 2,4,6,8
```

这跟下面的map()方法的操作是等价的。

```
var doubled = numbers.map(function(i){return i * 2;});
```

推导式也可以用来筛选满足条件表达式的元素. 下面的推导式用来筛选是2的倍数的元素:

```
var numbers = [1, 2, 3, 21, 22, 30];
var evens = [i for (i of numbers) if (i % 2 === 0)];
console.log(evens); // logs 2,22,30
```

`filter()` 也可以达到相同的目的：

```
var evens = numbers.filter(function(i){return i % 2 === 0;});
```

`map()` `和filter()` 类型的操作可以被组合（等效）为单个数组推导式。这里就有一个过滤出偶数，创建一个它的倍数数组的例子：

```
var numbers = [1, 2, 3, 21, 22, 30];
var doubledEvens = [i * 2 for (i of numbers) if (i % 2 === 0)];
console.log(doubledEvens); // logs 4,44,60
```

数组推导式隐含了块作用域。新的变量(如例子中的i)类似于是采用 `[let](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let>)`声明的。这意味着他们不能在推导式以外访问。

数组推导式的输入不一定必须是数组; [迭代器和生成器](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) 也是可以的。

甚至字符串也可以用来作为输入; 实现filter或者map行为 (参考上面类似数组行为的对象)如下:

```
var str = 'abcdef';
var consonantsOnlyStr = [c for (c of str) if (!(/[aeiouAEIOU]/).test(c))  ].join(''); // 'bcdf'
var interpolatedZeros = [c+'0' for (c of str) ].join(''); // 'a0b0c0d0e0f0'
```

不过，输入形式是不能保存的，所以我们要使用join()回复到一个字符串。

## 类型化数组(Typed Arrays )

[JavaScript typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) 是类数组对象（array-like object），其提供访问原始二进制数据的机制。 就像你知道的那样, `[Array](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array>)` 对象动态增长和收缩，可以有任何JavaScript值。但对于类型化数组，JavaScript引擎执行优化使得这些数组访问速度快速。 随着Web应用程序变得越来越强大，添加音频和视频处理等功能、可以使用 [WebSockets](https://developer.mozilla.org/en-US/docs/WebSockets) 、使用原始数据， 这都需要访问原始的二进制数据，所以专门的优化将有助于JavaScript代码能够快速和容易地操纵原始二进制数据类型的数组。

### 缓冲区和视图：类型化的数组结构

为了实现最大的灵活性和效率，JavaScript类型数组被分解为缓冲(Buffer)和视图(views)。缓冲(由`[ArrayBuffer](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer>)` 实现)是代表数据块的对象，它没有格式可言，并没有提供任何机制来访问其内容。为了访问包含在缓冲区中的内存，您需要使用视图。视图提供了一个上下文，即数据类型、起始偏移量和元素数，这些元素将数据转换为实际类型数组。

![https://mdn.mozillademos.org/files/8629/typed_arrays.png](https://mdn.mozillademos.org/files/8629/typed_arrays.png)

### ArrayBuffer

`[ArrayBuffer](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer>)`是一种数据类型，用于表示一个通用的、固定长度的二进制数据缓冲区。你不能直接操纵一个ArrayBuffer中的内容；你需要创建一个数组类型视图或`[DataView](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView>)`来代表特定格式的缓冲区，并从而实现读写缓冲区的内容。

### 类型数组视图(Typed array views)

类型数组视图具有自描述性的名字，并且提供数据类型信息，例如`Int8`, `Uint32`, `Float64等等。`如一个特定类型数组视图`Uint8ClampedArray`. 它意味着数据元素只包含0到255的整数值。它通常用于[Canvas数据处理](https://developer.mozilla.org/en-US/docs/Web/API/ImageData),例如.

[Untitled](https://www.notion.so/bd18bc05972b4022bd2be5149b441571)

更多信息参考 [JavaScript typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) 与参考文档中 `[TypedArray](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray>)`对象的不同



# Keyed_Collections

这一章介绍由key值标记的数据容器；Map 和 Set 对象承载的数据元素可以按照插入时的顺序被迭代遍历。

## 映射

### `Map`对象

ECMAScript 2015 引入了一个新的数据结构来将一个值映射到另一个值。一个`[Map](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Map>)`对象就是一个简单的键值对映射集合，可以按照数据插入时的顺序遍历所有的元素。

下面的代码演示了使用`Map`进行的一些基本操作。请参考`[Map](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Map>)`以获取更多的样例和完整的 API。你可以使用`[for...of](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of>)`循环来得到所有的`[key, value]`。

```
var sayings = new Map();
sayings.set('dog', 'woof');
sayings.set('cat', 'meow');
sayings.set('elephant', 'toot');
sayings.size; // 3
sayings.get('fox'); // undefined
sayings.has('bird'); // false
sayings.delete('dog');
sayings.has('dog'); // false

for (var [key, value] of sayings) {
  console.log(key + ' goes ' + value);
}
// "cat goes meow"
// "elephant goes toot"

sayings.clear();
sayings.size; // 0
```

### `Object`和`Map`的比较

一般地，[objects](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)会被用于将字符串类型映射到数值。`Object`允许设置键值对、根据键获取值、删除键、检测某个键是否存在。而`Map`具有更多的优势。

- `Object`的键均为`Strings`类型，在`Map`里键可以是任意类型。

- 必须手动计算`Object`的尺寸，但是可以很容易地获取使用`Map`的尺寸。

- `Map`的遍历遵循元素的插入顺序。

- `Object`有原型，所以映射中有一些缺省的键。可以用 `map = Object.create(null) 回避`）。

  （

这三条提示可以帮你决定用`Map`还是`Object`：

- 如果键在运行时才能知道，或者所有的键类型相同，所有的值类型相同，那就使用`Map`。
- 如果需要将原始值存储为键，则使用`Map`，因为`Object`将每个键视为字符串，不管它是一个数字值、布尔值还是任何其他原始值。
- 如果需要对个别元素进行操作，使用`Object`。

### `WeakMap`对象

`[WeakMap](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/WeakMap>)`对象也是键值对的集合。它的**键必须是对象类型**，值可以是任意类型。它的键被弱保持，也就是说，当其键所指对象没有其他地方引用的时候，它会被GC回收掉。`WeakMap`提供的接口与`Map`相同。

与`Map`对象不同的是，`WeakMap`的键是不可枚举的。不提供列出其键的方法。列表是否存在取决于垃圾回收器的状态，是不可预知的。

可以在"Why *Weak*Map?"`[WeakMap](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/WeakMap>)`查看更多信息和示例。

`WeakMap`对象的一个用例是存储一个对象的私有数据或隐藏实施细节。Nick Fitzgerald 的博文["Hiding Implementation Details with ECMAScript 6 WeakMaps"](http://fitzgeraldnick.com/weblog/53/)提供了一个例子。对象内部的私有数据和方法被存储在`WeakMap`类型的`privates`变量中。所有暴露出的原型和情况都是公开的，而其他内容都是外界不可访问的，因为模块并未导出`privates`对象。

```
const privates = new WeakMap();

function Public() {
  const me = {
    // Private data goes here
  };
  privates.set(this, me);
}

Public.prototype.method = function () {
  const me = privates.get(this);
  // Do stuff with private data in `me`...
};

module.exports = Public;
```

## 集合

### `Set`对象

`[Set](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set>)`对象是一组值的集合，这些值是不重复的，可以按照添加顺序来遍历。

这里演示了`Set`的基本操作，更多示例和完整API可以参考`[Set](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set>)`。

```
var mySet = new Set();
mySet.add(1);
mySet.add("some text");
mySet.add("foo");

mySet.has(1); // true
mySet.delete("foo");
mySet.size; // 2

for (let item of mySet) console.log(item);
// 1
// "some text"
```

### 数组和集合的转换

可以使用`[Array.from](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from>)`或[展开操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_operator)来完成集合到数组的转换。同样，`Set`的构造器接受数组作为参数，可以完成从`Array`到`Set`的转换。需要重申的是，`Set`对象中的值不重复，所以数组转换为集合时，所有重复值将会被删除。

```
Array.from(mySet);
[...mySet2];

mySet2 = new Set([1,2,3,4]);
```

### `Array`和`Set`的对比

一般情况下，在JavaScript中使用数组来存储一组元素，而新的集合对象有这些优势：

- 数组中用于判断元素是否存在的`[indexOf](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf>)` 函数效率低下。
- `Set`对象允许根据值删除元素，而数组中必须使用基于下标的 splice 方法。
- 数组的`indexOf`方法无法找到`[NaN](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN>)`值。
- `Set`对象存储不重复的值，所以不需要手动处理包含重复值的情况。

### `WeakSet`对象

`[WeakSet](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet>)`对象是一组对象的集合。`WeakSet`中的对象不重复且不可枚举。

与`[Set](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set>)`对象的主要区别有：

- `WeakSets`中的值必须是对象类型，不可以是别的类型
- `WeakSet`的“*weak*”指的是，对集合中的对象，如果不存在其他引用，那么该对象将可被垃圾回收。于是不存在一个当前可用对象组成的列表，所以`WeakSets`不可枚举

`WeakSet`的用例很有限，比如使用DOM元素作为键来追踪它们而不必担心内存泄漏。

## `Map`的键和`Set`的值的等值判断

`Map`的键和`Set`的值的等值判断都基于[same-value-zero algorithm](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)：

- 判断使用与`===`相似的规则。
- `0`和`+0`相等。
- `[NaN](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN>)`与自身相等（与`===`有所不同）。



# Typed_arrays

JavaScript类型化数组是一种类似数组的对象，并提供了一种用于访问原始二进制数据的机制。 正如你可能已经知道，`[Array](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array>)` 存储的对象能动态增多和减少，并且可以存储任何JavaScript值。JavaScript引擎会做一些内部优化，以便对数组的操作可以很快。然而，随着Web应用程序变得越来越强大，尤其一些新增加的功能例如：音频视频编辑，访问WebSockets的原始数据等，很明显有些时候如果使用JavaScript代码可以快速方便地通过类型化数组来操作原始的二进制数据将会非常有帮助。

但是，不要把类型化数组与正常数组混淆，因为在类型数组上调用  `[Array.isArray()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray>)` 会返回`false`。此外，并不是所有可用于正常数组的方法都能被类型化数组所支持（如 push 和 pop）。

## 缓冲和视图：类型数组架构

为了达到最大的灵活性和效率，JavaScript 类型数组（[Typed Arrays](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Typed_arrays)）将实现拆分为**缓冲**和**视图**两部分。一个缓冲（由 `[ArrayBuffer](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer>)` 对象实现）描述的是一个数据块。缓冲没有格式可言，并且不提供机制访问其内容。为了访问在缓冲对象中包含的内存，你需要使用视图。视图提供了上下文 — 即数据类型、起始偏移量和元素数 — 将数据转换为实际有类型的数组。

![https://mdn.mozillademos.org/files/8629/typed_arrays.png](https://mdn.mozillademos.org/files/8629/typed_arrays.png)

### ArrayBuffer

`[ArrayBuffer](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer>)` 是一种数据类型，用来表示一个通用的、固定长度的二进制数据缓冲区。你不能直接操纵一个ArrayBuffer中的内容；你需要创建一个类型化数组的视图或一个描述缓冲数据格式的`[DataView](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView>)`，使用它们来读写缓冲区中的内容.

### 类型数组视图

类型化数组视图具有自描述性的名字和所有常用的数值类型像`Int8`，`Uint32`，`Float64` 等等。有一种特殊类型的数组`Uint8ClampedArray`。它仅操作0到255之间的数值。例如，这对于[Canvas数据处理](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData)非常有用。

[Untitled](https://www.notion.so/53ddc81d6d22436085aec5cbc3e2cf9b)

### 数据视图

`[DataView](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView>)` 是一种底层接口，它提供有可以操作缓冲区中任意数据的读写接口。这对操作不同类型数据的场景很有帮助，例如：类型化数组视图都是运行在本地字节序模式(参考 [Endianness](https://developer.mozilla.org/zh-CN/docs/Glossary/Endianness))，可以通过使用 `DataView` 来控制字节序。默认是大端字节序(Big-endian)，但可以调用读写接口改为小端字节序(Little-endian)。

## 使用类型数组的Web API

**`[FileReader.prototype.readAsArrayBuffer()](<https://developer.mozilla.org/en-US/docs/Web/API/FileReader#readAsArrayBuffer()>)\**FileReader.prototype.readAsArrayBuffer()` 读取对应的`[Blob](<https://developer.mozilla.org/en-US/docs/Web/API/Blob>)` 或 `[File](<https://developer.mozilla.org/en-US/docs/Web/API/File>)`的内容**`[XMLHttpRequest.prototype.send()](<https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#send()>)**XMLHttpRequest` 实例的 `send()` 方法现在使用支持类型化数组和 `[ArrayBuffer](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer>)` 对象作为参数。**`[ImageData.data](<https://developer.mozilla.org/en-US/docs/Web/API/ImageData>)`**是一个 `[Uint8ClampedArray](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray>)` 对象，用来描述包含按照RGBA序列的颜色数据的一维数组，其值的范围在`0`到`255`（包含255）之间。

## 示例

### 使用视图和缓冲

首先，我们创建一个16字节固定长度的缓冲：

```
var buffer = new ArrayBuffer(16);
```

现在我们有了一段初始化为0的内存，目前还做不了什么太多操作。让我们确认一下数据的字节长度：

```
if (buffer.byteLength === 16) {
  console.log("Yes, it's 16 bytes.");
} else {
  console.log("Oh no, it's the wrong size!");
}
```

在实际开始操作这个缓冲之前，需要创建一个视图。我们将创建一个视图，此视图将把缓冲内的数据格式化为一个32位的有符号整数数组：

```
var int32View = new Int32Array(buffer);
```

现在我们可以像普通数组一样访问该数组中的元素：

```
for (var i = 0; i < int32View.length; i++) {
  int32View[i] = i * 2;
}
```

该代码会将数组以0, 2, 4和6填充 （一共4个4字节元素，所以总长度为16字节）。

### 同一数据的多个视图

更有意思的是，你可以在同一数据上创建多个视图。例如：基于上文的代码，我们可以添加如下代码处理：

```
var int16View = new Int16Array(buffer);

for (var i = 0; i < int16View.length; i++) {
  console.log("Entry " + i + ": " + int16View[i]);
}
```

这里我们创建了一个2字节整数视图，该视图共享上文的4字节整数视图的缓冲，然后以2字节整数打印出缓冲里的数据，这次我们会得到0, 0, 2, 0, 4, 0, 6, 0这样的输出。

那么，这样呢？

```
int16View[0] = 32;
console.log("Entry 0 in the 32-bit array is now " + int32View[0]);
```

这次的输出是"Entry 0 in the 32-bit array is now 32"。也就是，这2个数组都是同一数据的以不同格式展示出来的视图。你可以使用任何一种 [view types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#TypedArray_objects) 中的定义的视图。

### 使用复杂的数据结构

通过将缓冲与不同类型视图组合，以及修改内存访问的偏移位置，你可以操作包含更多更复杂数据结构的数据。你可以使用[js-ctypes](https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes)操作诸如[WebGL](https://developer.mozilla.org/en-US/docs/Web/WebGL)，数据文件或C语言结构体这些复杂的数据结构。

请看如下的C语言结构:

```
struct someStruct {
  unsigned long id;
  char username[16];
  float amountDue;
};
```

你可以采用如下代码访问一个包含此类结构体的缓冲：

```
var buffer = new ArrayBuffer(24);

// ... read the data into the buffer ...

var idView = new Uint32Array(buffer, 0, 1);
var usernameView = new Uint8Array(buffer, 4, 16);
var amountDueView = new Float32Array(buffer, 20, 1);
```

现在你就可以通过`amountDueView[0]`的方式访问数量。

**提示：**C语言结构体的[数据对齐](http://en.wikipedia.org/wiki/Data_structure_alignment)与平台相关。因此需要防范和考虑不同平台的字节填充对齐。

### 转换为普通数组

在处理完一个类型化数组后，有时需要把它转为普通数组，以便可以可以像普通数据一种操作访问。可以调用 `[Array.from](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from>)`实现这种转换，如果 `Array.from` 不支持的话，也可以通过如下代码实现：

```
var typedArray = new Uint8Array([1, 2, 3, 4]),
    normalArray = Array.prototype.slice.call(typedArray);
normalArray.length === 4;
normalArray.constructor === Array;
```



