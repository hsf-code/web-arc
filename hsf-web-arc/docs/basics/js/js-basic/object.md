---
title: 对象
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

JavaScript 的设计是一个简单的基于对象的范式。一个对象就是一系列属性的集合，一个属性包含一个名和一个值。一个属性的值可以是函数，这种情况下属性也被称为*方法*。除了浏览器里面预定义的那些对象之外，你也可以定义你自己的对象。本章节讲述了怎么使用对象、属性、函数和方法，怎样实现自定义对象。

## 对象概述

javascript 中的对象(物体)，和其它编程语言中的对象一样，可以比照现实生活中的对象(物体)来理解它。 javascript 中对象(物体)的概念可以比照着现实生活中实实在在的物体来理解。

在javascript中，一个对象可以是一个单独的拥有属性和类型的实体。我们拿它和一个杯子做下类比。一个杯子是一个对象(物体)，拥有属性。杯子有颜色，图案，重量，由什么材质构成等等。同样，javascript对象也有属性来定义它的特征。

## 对象和属性

一个 javascript 对象有很多属性。一个对象的属性可以被解释成一个附加到对象上的变量。对象的属性和普通的 javascript 变量基本没什么区别，仅仅是属性属于某个对象。属性定义了对象的特征(译注：动态语言面向对象的鸭子类型)。你可以通过点符号来访问一个对象的属性。

```
objectName.propertyName
```

和其他 javascript 变量一样，对象的名字(可以是普通的变量)和属性的名字都是大小写敏感的。你可以在定义一个属性的时候就给它赋值。例如，我们创建一个myCar的对象然后给他三个属性，make，model，year。具体如下所示：

```
var myCar = new Object();
myCar.make = "Ford";
myCar.model = "Mustang";
myCar.year = 1969; 
```

对象中未赋值的属性的值为`[undefined](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined>)`（而不是`[null](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null>)`）。

```
myCar.noProperty; // undefined
```

JavaScript 对象的属性也可以通过方括号访问或者设置（更多信息查看 [property accessors](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Property_Accessors)）. 对象有时也被叫作关联数组, 因为每个属性都有一个用于访问它的字符串值。例如，你可以按如下方式访问 `myCar` 对象的属性：

```
myCar["make"] = "Ford";
myCar["model"] = "Mustang";
myCar["year"] = 1969;
```

一个对象的属性名可以是任何有效的 JavaScript 字符串，或者可以被转换为字符串的任何类型，包括空字符串。然而，一个属性的名称如果不是一个有效的 JavaScript 标识符（例如，一个由空格或连字符，或者以数字开头的属性名），就只能通过方括号标记访问。这个标记法在属性名称是动态判定（属性名只有到运行时才能判定）时非常有用。例如：

```
// 同时创建四个变量，用逗号分隔
var myObj = new Object(),
    str = "myString",
    rand = Math.random(),
    obj = new Object();

myObj.type              = "Dot syntax";
myObj["date created"]   = "String with space";
myObj[str]              = "String value";
myObj[rand]             = "Random Number";
myObj[obj]              = "Object";
myObj[""]               = "Even an empty string";

console.log(myObj);
```

请注意，方括号中的所有键都将转换为字符串类型，因为JavaScript中的对象只能使用String类型作为键类型。 例如，在上面的代码中，当将键obj添加到myObj时，JavaScript将调用obj.toString()方法，并将此结果字符串用作新键。

你也可以通过存储在变量中的字符串来访问属性：

`var propertyName = "make"; myCar[propertyName] = "Ford";

propertyName = "model"; myCar[propertyName] = "Mustang";`

你可以在 [for...in](https://developer.mozilla.org/zh-CN/docs/JavaScript/Guide/Statements#for...in_Statement) 语句中使用方括号标记以枚举一个对象的所有属性。为了展示它如何工作，下面的函数当你将对象及其名称作为参数传入时，显示对象的属性：

```
function showProps(obj, objName) {
  var result = "";
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
        result += objName + "." + i + " = " + obj[i] + "\\n";
    }
  }
  return result;
}
```

因而，对于函数调用 `showProps(myCar, "myCar")` 将返回以下值：

```
myCar.make = Ford
myCar.model = Mustang
myCar.year = 1969
```

## 枚举一个对象的所有属性

从 [ECMAScript 5](https://developer.mozilla.org/zh-CN/docs/JavaScript/ECMAScript_5_support_in_Mozilla) 开始，有三种原生的方法用于列出或枚举对象的属性：

- [for...in](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Statements/for...in) 循环该方法依次访问一个对象及其原型链中所有可枚举的属性。
- [Object.keys(o)](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Object/keys)该方法返回对象 `o` 自身包含（不包括原型中）的所有可枚举属性的名称的数组。
- [Object.getOwnPropertyNames(o)](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)该方法返回对象 `o` 自身包含（不包括原型中）的所有属性(无论是否可枚举)的名称的数组。

在 ECMAScript 5 之前，没有原生的方法枚举一个对象的所有属性。然而，可以通过以下函数完成：

```
function listAllProperties(o){     
	var objectToInspect;     
	var result = [];
	
	for(objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)){  
		result = result.concat(Object.getOwnPropertyNames(objectToInspect));  
	}
	
	return result; 
}
```

这在展示 “隐藏”（在原型中的不能通过对象访问的属性，因为另一个同名的属性存在于原型链的早期）的属性时很有用。如果只想列出可访问的属性，那么只需要去除数组中的重复元素即可。

## 创建新对象

JavaScript 拥有一系列预定义的对象。另外，你可以创建你自己的对象。从  JavaScript 1.2 之后，你可以通过对象初始化器（Object Initializer）创建对象。或者你可以创建一个构造函数并使用该函数和 `new` 操作符初始化对象。

### 使用对象初始化器

除了通过构造函数创建对象之外，你也可以通过对象初始化器创建对象。使用对象初始化器也被称作通过字面值创建对象。对象初始化器与 C++ 术语相一致。

通过对象初始化器创建对象的语法如下：

```
var obj = { property_1:   value_1,   // property_# 可以是一个标识符...
            2:            value_2,   // 或一个数字...
           ["property" +3]: value_3,  //  或一个可计算的key名... 
            // ...,
            "property n": value_n }; // 或一个字符串
```

这里 `obj` 是新对象的名称，每一个 `property_*i*` 是一个标识符（可以是一个名称、数字或字符串字面量），并且每个 `value_*i*` 是一个其值将被赋予 property_*i* 的表达式。`obj` 与赋值是可选的；如果你不需要在其他地方引用对象，你就不需要将它赋给一个变量。（注意在接受一条语句的地方，你可能需要将对象字面量括在括号里，从而避免将字面量与块语句相混淆）

如果一个对象是通过在顶级脚本的对象初始化器创建的，则 JavaScript 在每次遇到包含该对象字面量的表达式时都会创建对象。同样的，在函数中的初始化器在每次函数调用时也会被创建。

下面的语句只有当 `cond` 表达式的值为 `true` 时创建对象并将其赋给变量 `x`。

```
if (cond) var x = {hi: "there"};
```

下例创建了有三个属性的 `myHonda` 对象。注意它的 `engine` 属性也是一个拥有自己属性的对象。

```
var myHonda = {color: "red", wheels: 4, engine: {cylinders: 4, size: 2.2}};
```

你也可以用对象初始化器来创建数组。参见 [array literals](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Values%2C_variables%2C_and_literals#Array_literals).

在 JavaScript 1.1 及更早版本中，你不能使用对象初始化器。你只能通过使用构造函数或其他对象的函数来创建对象。参见 [使用构造函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Working_with_Objects#使用构造函数).

### 使用构造函数

作为另一种方式，你可以通过两步来创建对象：

1. 通过创建一个构造函数来定义对象的类型。首字母大写是非常普遍而且很恰当的惯用法。
2. 通过 `new` 创建对象实例。

为了定义对象类型，为对象类型创建一个函数以声明类型的名称、属性和方法。例如，你想为汽车创建一个类型，并且将这类对象称为 `car` ，并且拥有属性 make, model, 和 year，你可以创建如下的函数：

```
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}
```

注意通过使用 this 将传入函数的值赋给对象的属性。

现在你可以象这样创建一个 `mycar` 对象：

```
var mycar = new Car("Eagle", "Talon TSi", 1993);
```

该创建了 `mycar` 并且将指定的值赋给它的属性。因而 `mycar.make` 的值是字符串 "Eagle"， `mycar.year` 的值是整数 1993，依此类推。

你可以通过调用 `new` 创建任意数量的 `car` 对象。例如：

```
var kenscar = new Car("Nissan", "300ZX", 1992);
var vpgscar = new Car("Mazda", "Miata", 1990);
```

一个对象的属性值可以是另一个对象。例如，假设你按如下方式定义了 `person` 对象:

```
function Person(name, age, sex) {
  this.name = name;
  this.age = age;
  this.sex = sex;
}
```

然后按如下方式创建了两个 `person` 实例:

```
var rand = new Person("Rand McKinnon", 33, "M");
var ken = new Person("Ken Jones", 39, "M");
```

那么，你可以重写 `car` 的定义以包含一个拥有它的 `owner` 属性，如：

```
function Car(make, model, year, owner) {
  this.make = make;
  this.model = model;
  this.year = year;
  this.owner = owner;
}
```

你可以按如下方式创建新对象：

```
var car1 = new Car("Eagle", "Talon TSi", 1993, rand);
var car2 = new Car("Nissan", "300ZX", 1992, ken);
```

注意在创建新对象时，上面的语句将 `rand` 和 `ken` 作为 `owner` 的参数值，而不是传入字符串字面量或整数值。接下来你如果想找出 car2 的拥有者的姓名，你可以访问如下属性：

```
car2.owner.name
```

注意你总是可以为之前定义的对象增加新的属性。例如，语句

```
car1.color = "black";
```

为 `car1` 增加了 `color` 属性，并将其值设为 "black." 然而，这并不影响其他的对象。想要为某个类型的所有对象增加新属性，你必须将属性加入到 `car` 对象类型的定义中。

### 使用 Object.create 方法

对象也可以用 `[Object.create()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create>)` 方法创建。该方法非常有用，因为它允许你为创建的对象选择一个原型对象，而不用定义构造函数。

```
// Animal properties and method encapsulation
var Animal = {
  type: "Invertebrates", // 属性默认值
  displayType : function() {  // 用于显示type属性的方法
    console.log(this.type);
  }
}

// 创建一种新的动物——animal1 
var animal1 = Object.create(Animal);
animal1.displayType(); // Output:Invertebrates

// 创建一种新的动物——Fishes
var fish = Object.create(Animal);
fish.type = "Fishes";
fish.displayType(); // Output:Fishes
```

该函数更多的信息及详细用法，参见 [Object.create method](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Object/create)

### **继承**

所有的 JavaScript 对象至少继承于一个对象。被继承的对象被称作原型，并且继承的属性可通过构造函数的 `prototype` 对象找到。查看更多详细 [Inheritance and the prototype chain](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

### **对象属性索引**

在 JavaScript 1.0 中，你可以通过名称或序号访问一个属性。但是在 JavaScript 1.1 及之后版本中，如果你最初使用名称定义了一个属性，则你必须通过名称来访问它；而如果你最初使用序号来定义一个属性，则你必须通过索引来访问它。

这个限制发生在你通过构造函数创建一个对象和它的属性（就象我们之前通过 `Car` 对象类型所做的那样）并且显式地定义了单独的属性（如 `m`yCar.color = "red"）之时。如果你最初使用索引定义了一个对象属性，例如 `myCar[5] = "25"`，则你只可能通过 `myCar[5]` 引用它。

这条规则的例外是从与HTML对应的对象，例如 `forms` 数组。对于这些数组的元素，你总是既可以通过其序号（依据其在文档中出现的顺序），也可以按照其名称（如果有的话）访问它。举例而言，如果文档中的第二个 `<form>` 标签有一个 `NAME` 属性且值为 `"myForm"，访问该 form 的方式可以是 document.forms[1]，document.forms["myForm"]或 document.myForm。`

为对象类型定义属性

你可以通过 `prototype` 属性为之前定义的对象类型增加属性。这为该类型的所有对象，而不是仅仅一个对象增加了一个属性。下面的代码为所有类型为 `car` 的对象增加了 `color` 属性，然后为对象 `car1` 的 `color` 属性赋值：

```
Car.prototype.color = null;
car1.color = "black";
```

参见 [JavaScript Reference](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference) 中 Function 对象的 `[prototype` 属性](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Function/prototype) 。

### 定义方法

一个*方法* 是关联到某个对象的函数，或者简单地说，一个方法是一个值为某个函数的对象属性。定义方法就像定义普通的函数，除了它们必须被赋给对象的某个属性。查看 [method definitions](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Method_definitions)了解更多详情例如：

```
objectName.methodname = function_name;

var myObj = {
  myMethod: function(params) {
    // ...do something
  }
  
  // 或者 这样写也可以
  
  myOtherMethod(params) {
    // ...do something else
  }
};
```

这里 `objectName` 是一个已经存在的对象，`methodname` 是方法的名称，而 `function_name` 是函数的名称。

你可以在对象的上下文中象这样调用方法：

```
object.methodname(params);
```

你可以在对象的构造函数中包含方法定义来为某个对象类型定义方法。例如，你可以为之前定义的 `car` 对象定义一个函数格式化并显示其属性：

```
function displayCar() {
  var result = `A Beautiful ${this.year} ${this.make} ${this.model}`;
  pretty_print(result);
}
```

这里 `pretty_print` 是一个显示横线和一个字符串的函数。注意使用 this 指代方法所属的对象。

你可以在对象定义中通过增加下述语句将这个函数变成 `Car` 的方法：

```
this.displayCar = displayCar;
```

因此，`Car` 的完整定义看上去将是：

```
function Car(make, model, year, owner) {
  this.make = make;
  this.model = model;
  this.year = year;
  this.owner = owner;
  this.displayCar = displayCar;
}
```

然后你可以按如下方式为每个对象调用 `displayCar` 方法：

```
car1.displayCar();
car2.displayCar();
```

### 通过 `this` 引用对象

JavaScript 有一个特殊的关键字 `this`，它可以在方法中使用以指代当前对象。例如，假设你有一个名为 `validate` 的函数，它根据给出的最大与最小值检查某个对象的 `value` 属性：

```
function validate(obj, lowval, hival) {
  if ((obj.value < lowval) || (obj.value > hival)) {
    alert("Invalid Value!");
  }
}
```

然后，你可以在每个元素的 `onchange` 事件处理器中调用 `validate`，并通过 `this` 传入相应元素，代码如下：

```
<input type="text" name="age" size="3"onChange="validate(this, 18, 99)">
```

总的说来， `this` 在一个方法中指调用的对象。

当与 `form` 属性一起使用时，`this` 可以指代当前对象的父窗体。在下面的例子中，窗体 `myForm` 包含一个 `Text` 对象和一个按钮，当用户点击按键，`Text` 对象的值被设为窗体的名称。按钮的 `onclick` 事件处理器使用 `this.form` 以指代其父窗体，即 `myForm`。

```
<form name="myForm"><p><label>Form name:<input type="text" name="text1" value="Beluga"></label><p><input name="button1" type="button" value="Show Form Name"onclick="this.form.text1.value = this.form.name"></p></form>
```

### **定义 getters 与 setters**

一个 [getter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/get) 是一个获取某个特定属性的值的方法。一个 [setter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/set) 是一个设定某个属性的值的方法。你可以为预定义的或用户定义的对象定义 getter 和 setter 以支持新增的属性。定义 getter 和 setter 的语法采用对象字面量语法。

下面例子描述了getters 和 setters 是如何为用户定义的对象 `o` 工作的。

```
var o = {
  a: 7,
  get b() { 
    return this.a + 1;
  },
  set c(x) {
    this.a = x / 2
  }
};

console.log(o.a); // 7
console.log(o.b); // 8
o.c = 50;
console.log(o.a); // 25
```

`o` 对象的属性如下：

- `o.a` — 数字
- `o.b` — 返回 `o.a` + 1 的 getter
- `o.c` — 由 `o.c 的值所设置 o.a 值的` setter

请注意在一个对象字面量语法中定义getter和setter使用"[gs]et property()"的方式（相比较于__define[GS]etter__)时，并不是获取和设置某个属性自身，容易让人误以为是"[gs]et propertyName(){ }"这样错误的使用方法。定义一个getter或setter函数使用语法"[gs]et property()"，定义一个已经声明的函数作为的getter和setter方法，使用`[Object.defineProperty](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Object/defineProperty>)`(或者 `[Object.prototype.__defineGetter__](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Object/defineGetter>)` 旧语法回退)

下面这个例子展示使用getter和setter方法扩展 `[Date](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Date>)`原型，为预定义好的Date类添加一个year的属性。定义属性year的getter和setter方法用到了Date类中已存在的getFullYear和setFullYear方法。

定义属性year的getter和setter：

```
var d = Date.prototype;
Object.defineProperty(d, "year", {
  get: function() { return this.getFullYear() },
  set: function(y) { this.setFullYear(y) }
});
```

通过一个Date对象使用getter和setter:

```
var now = new Date();
console.log(now.year); // 2000
now.year = 2001; // 987617605170
console.log(now);
// Wed Apr 18 11:13:25 GMT-0700 (Pacific Daylight Time) 2001
```

原则上，getter 和 setter 既可以：

- 使用 [使用对象初始化器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Working_with_Objects#使用对象初始化器) 定义
- 也可以之后随时使用 getter 和 setter 添加方法添加到任何对象

当使用 [使用对象初始化器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Working_with_Objects#使用对象初始化器) 的方式定义getter和setter时，只需要在getter方法前加get，在setter方法前加set，当然，getter方法必须是无参数的，setter方法只接受一个参数(设置为新值），例如：

```
var o = {
  a: 7,
  get b() { return this.a + 1; },
  set c(x) { this.a = x / 2; }
};
```

使用Object.defineProperties的方法，同样也可以对一个已创建的对象在任何时候为其添加getter或setter方法。这个方法的第一个参数是你想定义getter或setter方法的对象，第二个参数是一个对象，这个对象的属性名用作getter或setter的名字，属性名对应的属性值用作定义getter或setter方法的函数，下面是一个例子定义了和前面例子一样的getter和setter方法：

```
var o = { a:0 }

Object.defineProperties(o, {
    "b": { get: function () { return this.a + 1; } },
    "c": { set: function (x) { this.a = x / 2; } }
});

o.c = 10 // Runs the setter, which assigns 10 / 2 (5) to the 'a' property
console.log(o.b) // Runs the getter, which yields a + 1 or 6
```

这两种定义方式的选择取决于你的编程风格和手头的工作量。当你定义一个原型准备进行初始化时，可以选择第一种方式，这种方式更简洁和自然。但是，当你需要添加getter和setter方法 —— 因为并没有编写原型或者特定的对象 ——使用第二种方式更好。第二种方式可能更能表现JavaScript语法的动态特性——但也会使代码变得难以阅读和理解。

### 删除属性

你可以用 [delete](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete) 操作符删除一个**不是继承而来**的属性。下面的例子说明如何删除一个属性：

```
//Creates a new object, myobj, with two properties, a and b.
var myobj = new Object;
myobj.a = 5;
myobj.b = 12;

//Removes the a property, leaving myobj with only the b property.
delete myobj.a;
```

如果一个全局变量不是用 `var` 关键字声明的话，你也可以用 `delete` 删除它：

```
g = 17;
delete g;
```

参见`[delete](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Expressions_and_operators#delete>)` 以获取更多信息。

### 比较对象

在 JavaScript 中 objects 是一种引用类型。两个独立声明的对象永远也不会相等，即使他们有相同的属性，只有在比较一个对象和这个对象的引用时，才会返回true.

```js
// 两个变量, 两个具有同样的属性、但不相同的对象
var fruit = {name: "apple"};
var fruitbear = {name: "apple"};

fruit == fruitbear // return false
fruit === fruitbear // return false
```

**注意:** "===" 运算符用来检查数值是否相等: 1 === "1"返回false，而1 == "1" 返回true

```js
// 两个变量, 同一个对象
var fruit = {name: "apple"};
var fruitbear = fruit;  // 将fruit的对象引用(reference)赋值给 fruitbear
                        // 也称为将fruitbear“指向”fruit对象
// fruit与fruitbear都指向同样的对象
fruit == fruitbear // return true
fruit === fruitbear // return true
```

了解更多关于比较操作符的用法，查看 [Comparison operators](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators).

## 附加参考

- 想要深入了解，请阅读[details of javaScript's objects model](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Details_of_the_Object_Model)。
- 想要学习 ECMAScript 2015中类（一种创建对象的新方式），请阅读 [JavaScript classes](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes) 章节。



# Details_of_the_Object_Model

JavaScript 是一种基于原型而不是基于类的基于对象(object-based)语言。正是由于这一根本的区别，其如何创建对象的层级结构以及对象的属性与属性值是如何继承的并不是那么清晰。本节试着阐明。

本节假设您已经有一些 JavaScript 基础，并且用 JavaScript 函数创建过简单的对象。

## 基于类 vs 基于原型的语言

基于类的面向对象语言，比如 Java 和 C++，是构建在两个不同实体之上的：类和实例。

- 一个*类(class)*定义了某一对象集合所具有的特征性属性（可以将 Java 中的方法和域以及 C++ 中的成员都视作属性）。类是抽象的，而不是其所描述的对象集合中的任何特定的个体。例如 `Employee` 类可以用来表示所有雇员的集合。
- 另一方面，一个*实例(instance)\*是一个\*类*的实例化。例如， `Victoria` 可以是 `Employee` 类的一个实例，表示一个特定的雇员个体。实例具有和其父类完全一致的属性，不多也不少。

基于原型的语言（如 JavaScript）并不存在这种区别：它只有对象。基于原型的语言具有所谓*原型对象(prototypical object)\*的概念。原型对象可以作为一个模板，新对象可以从中获得原始的属性。任何对象都可以指定其自身的属性，既可以是创建时也可以在运行时创建。而且，任何对象都可以作为另一个对象的\*原型(prototype)*，从而允许后者共享前者的属性。

### 定义类

在基于类的语言中，需要专门的*类定义(class definition)*来定义类。在定义类时，允许定义被称为*构造器(constructor)*的特殊的方法来创建该类的实例。在构造器方法中，可以指定实例的属性的初始值并做一些其他的操作。你可以通过使用 `new` 操作符来创建类的实例。

JavaScript 大体上与之类似，但并没有专门的*类定义*，你通过定义构造函数的方式来创建一系列有着特定初始值和方法的对象。任何JavaScript函数都可以被用作构造函数。你也可以使用 `new` 操作符来创建一个新对象。

**提示：**在ES6中引入了 [类定义](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes) ，但它实际上是已有的原型继承方式的语法糖而已，并没有引入新的面向对象继承模型。

### 子类和继承

基于类的语言是通过对类的定义中构建类的层级结构的。在类定义中，可以指定新的类是一个现存的类的子类。子类将继承父类的全部属性，并可以添加新的属性或者修改继承的属性。例如，假设 `Employee` 类只有 `name` 和 `dept` 属性，而 `Manager` 是 `Employee` 的子类并添加了 `reports` 属性。这时，`Manager` 类的实例将具有所有三个属性：`name`，`dept`和`reports`。

JavaScript 通过将构造器函数与原型对象相关联的方式来实现继承。这样，您可以创建完全一样的 `Employee` — `Manager` 示例，不过需要使用略微不同的术语。首先，定义Employee构造函数，在该构造函数内定义name、dept属性；接下来，定义Manager构造函数，在该构造函数内调用Employee构造函数，并定义reports属性；最后，将一个获得了Employee.prototype(Employee构造函数原型)的新对象赋予manager构造函数，以作为Manager构造函数的原型。之后当你创建新的Manager对象实例时，该实例会从Employee对象继承name、dept属性。

### 添加和移除属性

在基于类的语言中，通常在编译时创建类，然后在编译时或者运行时对类的实例进行实例化。一旦定义了类，无法对类的属性进行更改。然而，在 JavaScript 中，允许运行时添加或者移除任何对象的属性。如果您为一个对象中添加了一个属性，而这个对象又作为其它对象的原型，则以该对象作为原型的所有其它对象也将获得该属性。

### 差异总结

下面的表格摘要给出了上述区别。本节的后续部分将描述有关使用 JavaScript 构造器和原型创建对象层级结构的详细信息，并将其与在 Java 中的做法加以对比。

[Untitled](https://www.notion.so/98f32a4737294a559e2474eb4ff98199)

## Employee 示例

本节的余下部分将使用如下图所示的 Employee 层级结构。

![https://mdn.mozillademos.org/files/3060/figure8.1.png](https://mdn.mozillademos.org/files/3060/figure8.1.png)

- `Employee` 具有 `name` 属性（默认值为空的字符串）和 `dept` 属性（默认值为 "general"）。
- `Manager` 是 `Employee`的子类。它添加了 `reports` 属性（默认值为空的数组，以 `Employee` 对象数组作为它的值）。
- `WorkerBee` 是 `Employee`的子类。它添加了 `projects` 属性（默认值为空的数组，以字符串数组作为它的值）。
- `SalesPerson` 是 `WorkerBee`的子类。它添加了 `quota` 属性（其值默认为 100）。它还重载了 `dept` 属性值为 "sales"，表明所有的销售人员都属于同一部门。
- `Engineer` 基于 `WorkerBee`。它添加了 `machine` 属性（其值默认为空字符串）同时重载了 `dept` 属性值为 "engineering"。

## 创建层级结构

可以有几种不同的方式来定义适当的构造器函数，从而实现雇员的层级结构。如何选择很大程度上取决于您希望在您的应用程序中能做到什么。

本节介绍了如何使用非常简单的（同时也是相当不灵活的）定义，使得继承得以实现。在定义完成后，就无法在创建对象时指定属性的值。新创建的对象仅仅获得了默认值，当然允许随后加以修改。图例 8.2 展现了这些简单的定义形成的层级结构。

在实际应用程序中，您很可能想定义构造器，以允许您在创建对象时指定属性值。（参见[More flexible constructors](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Details_of_the_Object_Model#More_flexible_constructors)）。当前，这些简单的定义只是说明了继承是如何实现的。

下面关于 `Employee` 的 Java 和 JavaScript 的定义是非常类似的。唯一的不同是在 Java 中需要指定每个属性的类型，而在 JavaScript 中则不需要（这是因为Java是 [强类型](https://zh.wikipedia.org/wiki/強弱型別) 语言，而 JavaScript 是弱类型语言）。

[Untitled](https://www.notion.so/4b9e8fe4968a494ea7a302bc936b1d98)

```
Manager 和 WorkerBee 的定义表示在如何指定继承链中上一层对象时，两者存在不同点。在 JavaScript 中，您会添加一个原型实例作为构造器函数prototype 属性的值，然后将该构造函数原型的构造器重载为其自身。这一动作可以在构造器函数定义后的任意时刻执行。而在 Java 中，则需要在类定义中指定父类，且不能在类定义之外改变父类。
```

[Untitled](https://www.notion.so/a51813c8620e4a2aba7a94d285424b13)

在对`Engineer` 和 `SalesPerson` 定义时，创建了继承自 `WorkerBee` 的对象，该对象会进而继承自`Employee`。这些对象会具有在这个链之上的所有对象的属性。另外，它们在定义时，又重载了继承的 `dept` 属性值，赋予新的属性值。

[Untitled](https://www.notion.so/3c49166a2b374709b85f25b39c790f49)

使用这些定义，您可以创建这些对象的实例，以获取其属性的默认值。下图说明了如何使用这些 JavaScript 定义创建新对象并显示新对象的属性值。

**提示：**实例在基于类的语言中具有特定的技术含义。在这些语言中，一个实例是一个类的单独实例化，与一个类本质上是不同的。在 JavaScript 中，“实例”没有这个技术含义，因为JavaScript在类和实例之间不存在这样的区别。然而，在讨论 JavaScript 时，可以非正式地使用“实例”来表示使用特定构造函数创建的对象。 所以，在这个例子中，你可以非正式地说`jane` 是 `Engineer`的一个实例。同样，虽然术语 parent，child，ancestor 和 descendant 在 JavaScript 中没有正式含义；你可以非正式地使用它们来引用原型链中较高或更低的对象。

### 用简单的定义创建对象

### 对象层次结构

使用右侧的代码创建以下层次结构。

![https://mdn.mozillademos.org/files/10412/=figure8.3.png](https://mdn.mozillademos.org/files/10412/=figure8.3.png)

### 个别对象

```
var jim = new Employee; // 如构造函数无须接受任何参数，圆括号可以省略。
// jim.name is ''
// jim.dept is 'general'

var sally = new Manager;
// sally.name is ''
// sally.dept is 'general'
// sally.reports is []

var mark = new WorkerBee;
// mark.name is ''
// mark.dept is 'general'
// mark.projects is []

var fred = new SalesPerson;
// fred.name is ''
// fred.dept is 'sales'
// fred.projects is []
// fred.quota is 100

var jane = new Engineer;
// jane.name is ''
// jane.dept is 'engineering'
// jane.projects is []
// jane.machine is ''
```

## 对象的属性

本节将讨论对象如何从原型链中的其它对象中继承属性，以及在运行时添加属性的相关细节。

### 继承属性

假设您通过如下语句创建一个`mark`对象作为 `WorkerBee`的实例：

```
var mark = new WorkerBee;
```

当 JavaScript 执行 `new` 操作符时，它会先创建一个普通对象，并将这个普通对象中的 [[prototype]] 指向 `WorkerBee.prototype` ，然后再把这个普通对象设置为执行 `WorkerBee` 构造函数时 `this` 的值。该普通对象的 [[Prototype]] 决定其用于检索属性的原型链。当构造函数执行完成后，所有的属性都被设置完毕，JavaScript 返回之前创建的对象，通过赋值语句将它的引用赋值给变量 `mark`。

这个过程不会显式的将 `mark`所继承的原型链中的属性作为本地属性存放在 `mark` 对象中。当访问属性时，JavaScript 将首先检查对象自身中是否存在该属性，如果有，则返回该属性的值。如果不存在，JavaScript会检查原型链（使用内置的 [[Prototype]] ）。如果原型链中的某个对象包含该属性，则返回这个属性的值。如果遍历整条原型链都没有找到该属性，JavaScript 则认为对象中不存在该属性，返回一个 `undefined`。这样，`mark` 对象中将具有如下的属性和对应的值：

```
mark.name = "";
mark.dept = "general";
mark.projects = [];
```

`mark` 对象从 `mark.__proto__` 中保存的原型对象里继承了 `name` 和 `dept` 属性。并由 `WorkerBee` 构造函数为 `projects` 属性设置了本地值。 这就是 JavaScript 中的属性和属性值的继承。这个过程的一些微妙之处将在 [Property inheritance revisited](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Details_of_the_Object_Model#Property_inheritance_revisited) 中进一步讨论。

由于这些构造器不支持为实例设置特定的值，所以这些属性值仅仅是创建自 `WorkerBee` 的所有对象所共享的默认值。当然这些属性的值是可以修改的，所以您可以为 `mark`指定特定的信息，如下所示：

```
mark.name = "Doe, Mark";
mark.dept = "admin";
mark.projects = ["navigator"];
```

### 添加属性

在 JavaScript 中，您可以在运行时为任何对象添加属性，而不必受限于构造函数提供的属性。添加特定于某个对象的属性，只需要为该对象指定一个属性值，如下所示：

```
mark.bonus = 3000;
```

这样 `mark` 对象就有了 `bonus` 属性，而其它 `WorkerBee` 则没有该属性。

如果您向某个构造函数的原型对象中添加新的属性，那么该属性将添加到从这个原型中继承属性的所有对象的中。例如，可以通过如下的语句向所有雇员中添加 `specialty` 属性：

```
Employee.prototype.specialty = "none";
```

只要 JavaScript 执行了该语句，则 `mark` 对象也将具有 `specialty` 属性，其值为 `"none"`。下图则表示了在 `Employee` 原型中添加该属性，然后在 `Engineer` 的原型中重载该属性的效果。

![https://developer.mozilla.org/@api/deki/files/4422/=figure8.4.png](https://developer.mozilla.org/@api/deki/files/4422/=figure8.4.png)

**添加属性**

## 更灵活的构造器

到目前为止，本文所展示的构造函数都不能让你在创建新实例时为其制定属性值。其实我们也可以像 Java 一样，为构造器提供参数以初始化实例的属性值。下图展示了一种实现方式。

![https://developer.mozilla.org/@api/deki/files/4423/=figure8.5.png](https://developer.mozilla.org/@api/deki/files/4423/=figure8.5.png)

**Specifying properties in a constructor, take 1**

下面的表格中罗列了这些对象在 Java 和 JavaScript 中的定义。

[Untitled](https://www.notion.so/45df29e15ac145158c97a7181917ad24)

上面使用 JavaScript 定义过程使用了一种设置默认值的特殊惯用法：

```
this.name = name || "";
```

JavaScript 的逻辑或操作符（`||`）会对第一个参数进行判断。如果该参数值运算后结果为真，则操作符返回该值。否则，操作符返回第二个参数的值。因此，这行代码首先检查 `name` 是否是对`name` 属性有效的值。如果是，则设置其为 `this.name` 的值。否则，设置 `this.name` 的值为空的字符串。尽管这种用法乍看起来有些费解，为了简洁起见，本章将使用这种习惯用法。

**提示：**如果调用构造函数时，指定了可以转换为 `false` 的参数（比如`0`和空字符串），结果可能出乎调用者意料。此时，将使用默认值（译注：不是指定的参数值 0 和 ""）。

使用这些定义，当创建对象的实例时，可以为本地定义的属性指定值。你可以使用以下语句创建一个新的`Engineer`：

```
var jane = new Engineer("belau");
```

此时，`Jane` 的属性如下所示：

```
jane.name == "";
jane.dept == "engineering";
jane.projects == [];
jane.machine == "belau"
```

注意，由上面对类的定义，您无法为诸如 `name` 这样的继承属性指定初始值。如果想在 JavaScript 中为继承的属性指定初始值，您需要在构造函数中添加更多的代码。

到目前为止，构造函数已经能够创建一个普通对象，然后为新对象指定本地的属性和属性值。您还可以通过直接调用原型链上的更高层次对象的构造函数，让构造器添加更多的属性。下图即实现了这一功能。

![https://developer.mozilla.org/@api/deki/files/4430/=figure8.6.png](https://developer.mozilla.org/@api/deki/files/4430/=figure8.6.png)

**Specifying properties in a constructor, take 2**

我们来详细看一下这些定义。这是`Engineer`构造函数的新定义：

```
function Engineer (name, projs, mach) {
  this.base = WorkerBee;
  this.base(name, "engineering", projs);
  this.machine = mach || "";
}
```

假设您创建了一个新的 `Engineer` 对象，如下所示：

```
var jane = new Engineer("Doe, Jane", ["navigator", "javascript"], "belau");
```

JavaScript 会按以下步骤执行：

1. `new` 操作符创建了一个新的对象，并将其 `__proto__` 属性设置为 `Engineer.prototype`。
2. `new` 操作符将该新对象作为 `this` 的值传递给 `Engineer` 构造函数。
3. 构造函数为该新对象创建了一个名为 `base` 的新属性，并指向 `WorkerBee` 的构造函数。这使得 `WorkerBee` 构造函数成为 `Engineer` 对象的一个方法。`base` 属性的名称并没有什么特殊性，我们可以使用任何其他合法的名称来代替；`base` 仅仅是为了贴近它的用意。
4. 构造函数调用 `base` 方法，将传递给该构造函数的参数中的两个，作为参数传递给 `base` 方法，同时还传递一个字符串参数 `"engineering"。显式地在构造函数中使用` `"engineering"` 表明所有 `Engineer` 对象继承的 `dept` 属性具有相同的值，且该值重载了继承自 `Employee` 的值。
5. 因为 `base` 是 `Engineer` 的一个方法，在调用 `base` 时，JavaScript 将在步骤 1 中创建的对象绑定给 `this` 关键字。这样，`WorkerBee` 函数接着将 `"Doe, Jane"` 和 `"engineering"` 参数传递给 `Employee` 构造函数。当从 `Employee` 构造函数返回时，`WorkerBee` 函数用剩下的参数设置 `projects` 属性。
6. 当从 `base` 方法返回后，`Engineer` 构造函数将对象的 `machine` 属性初始化为 `"belau"`。
7. 当从构造函数返回时，JavaScript 将新对象赋值给 `jane` 变量。

你可以认为，在 `Engineer` 的构造器中调用了 `WorkerBee` 的构造器，也就为 `Engineer` 对象设置好了继承关系。事实并非如此。调用 `WorkerBee` 构造器确保了`Engineer` 对象以所有在构造器中所指定的属性被调用。但是，如果后续在 `Employee` 或者 `WorkerBee` 原型中添加了属性，那些属性不会被 `Engineer` 对象继承。例如，假设如下语句：

```
function Engineer (name, projs, mach) {
  this.base = WorkerBee;
  this.base(name, "engineering", projs);
  this.machine = mach || "";
}
var jane = new Engineer("Doe, Jane", ["navigator", "javascript"], "belau");
Employee.prototype.specialty = "none";
```

对象 `jane` 不会继承 `specialty` 属性。您必须显式地设置原型才能确保动态的继承。如果修改成如下的语句：

```
function Engineer (name, projs, mach) {
  this.base = WorkerBee;
  this.base(name, "engineering", projs);
  this.machine = mach || "";
}
Engineer.prototype = new WorkerBee;
var jane = new Engineer("Doe, Jane", ["navigator", "javascript"], "belau");
Employee.prototype.specialty = "none";
```

现在 `jane` 对象的 `specialty` 属性为 "none" 了。

继承的另一种途径是使用`[call()](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Function/call>)` / `[apply()](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Function/apply>)` 方法。下面的方式都是等价的：

```
function Engineer (name, projs, mach) {
  this.base = WorkerBee;
  this.base(name, "engineering", projs);
  this.machine = mach || "";
}
```

使用 javascript 的 `call()` 方法相对明了一些，因为无需 `base` 方法了。

## 再谈属性的继承

前面的小节中描述了 JavaScript 构造器和原型如何提供层级结构和继承的实现。本节中对之前未讨论的一些细节进行阐述。

### 本地值和继承值

正如本章前面所述，在访问一个对象的属性时，JavaScript 将执行下面的步骤：

1. 检查对象自身是否存在。如果存在，返回值。
2. 如果本地值不存在，检查原型链（通过 `__proto__` 属性）。
3. 如果原型链中的某个对象具有指定属性，则返回值。
4. 如果这样的属性不存在，则对象没有该属性，返回 undefined。

以上步骤的结果依赖于你是如何定义的。最早的例子中有如下定义：

```
function Employee () {
  this.name = "";
  this.dept = "general";
}

function WorkerBee () {
  this.projects = [];
}
WorkerBee.prototype = new Employee;
```

基于这些定义，假定通过如下的语句创建 `WorkerBee` 的实例 `amy`：

```
var amy = new WorkerBee;
```

则 `amy` 对象将具有一个本地属性 `projects`。`name`和 `dept` 则不是 `amy` 对象的本地属性，而是从 `amy` 对象的 `__proto__` 属性获得的。因此，`amy` 将具有如下的属性值：

```
amy.name == "";
amy.dept == "general";
amy.projects == [];
```

现在，假设修改了与 `Employee` 的相关联原型中的 `name` 属性的值：

```
Employee.prototype.name = "Unknown"
```

乍一看，你可能觉得新的值会传播给所有 `Employee` 的实例。然而，并非如此。

在创建 `Employee` 对象的*任意*实例时，该实例的 `name` 属性将获得一个**本地值**（空的字符串）。这就意味着在创建一个新的 `Employee` 对象作为 `WorkerBee` 的原型时，`WorkerBee.prototype` 的 `name` 属性将具有一个本地值。因此，当 JavaScript 查找 `amy` 对象（`WorkerBee` 的实例）的 `name` 属性时，JavaScript 将找到 `WorkerBee.prototype` 中的本地值。因此，也就不会继续在原型链中向上找到 `Employee.prototype` 了。

如果想在运行时修改一个对象的属性值并且希望该值被所有该对象的后代所继承，您就不能在该对象的构造器函数中定义该属性。而应该将该属性添加到该对象所关联的原型中。例如，假设将前面的代码作如下修改：

```
function Employee () {
  this.dept = "general";
}
Employee.prototype.name = "";

function WorkerBee () {
  this.projects = [];
}
WorkerBee.prototype = new Employee;

var amy = new WorkerBee;

Employee.prototype.name = "Unknown";
```

在这种情况下，`amy` 的 `name` 属性将为 "Unknown"。

正如这些例子所示，如果希望对象的属性具有默认值，并且希望在运行时修改这些默认值，应该在对象的原型中设置这些属性，而不是在构造器函数中。

### 判断实例的关系

JavaScript 的属性查找机制首先在对象自身的属性中查找，如果指定的属性名称没有找到，将在对象的特殊属性 `__proto__` 中查找。这个过程是递归的；被称为“在原型链中查找”。

特殊的 `__proto__` 属性是在构建对象时设置的；设置为构造器的 `prototype` 属性的值。所以表达式 `new Foo()` 将创建一个对象，其 `__proto__ == Foo.prototype`。因而，修改 `Foo.prototype` 的属性，将改变所有通过 `new Foo()` 创建的对象的属性的查找。

每个对象都有一个 `__proto__` 对象属性（除了 `Object）；每个函数都有一个` `prototype` 对象属性。因此，通过“原型继承”，对象与其它对象之间形成关系。通过比较对象的 `__proto__` 属性和函数的 `prototype` 属性可以检测对象的继承关系。JavaScript 提供了便捷方法：`instanceof` 操作符可以用来将一个对象和一个函数做检测，如果对象继承自函数的原型，则该操作符返回真。例如：

```
var f = new Foo();
var isTrue = (f instanceof Foo);
```

作为详细一点的例子，假定我们使用和在 [Inheriting properties](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Details_of_the_Object_Model#Inheriting_properties) 中相同的一组定义。创建 `Engineer` 对象如下：

```
var chris = new Engineer("Pigman, Chris", ["jsd"], "fiji");
```

对于该对象，以下所有语句均为真：

```
chris.__proto__ == Engineer.prototype;
chris.__proto__.__proto__ == WorkerBee.prototype;
chris.__proto__.__proto__.__proto__ == Employee.prototype;
chris.__proto__.__proto__.__proto__.__proto__ == Object.prototype;
chris.__proto__.__proto__.__proto__.__proto__.__proto__ == null;
```

基于此，可以写出一个如下所示的 `instanceOf` 函数：

```
function instanceOf(object, constructor) {
   while (object != null) {
      if (object == constructor.prototype)
         return true;
      if (typeof object == 'xml') {
        return constructor.prototype == XML.prototype;
      }
      object = object.__proto__;
   }
   return false;
}
```

**Note:** 在上面的实现中，检查对象的类型是否为 "xml" 的目的在于解决新近版本的 JavaScript 中表达 XML 对象的特异之处。如果您想了解其中琐碎细节，可以参考 [bug 634150](https://bugzilla.mozilla.org/show_bug.cgi?id=634150)。

使用上面定义的 instanceOf 函数，这些表达式为真：

```
instanceOf (chris, Engineer)
instanceOf (chris, WorkerBee)
instanceOf (chris, Employee)
instanceOf (chris, Object)
```

但如下表达式为假：

```
instanceOf (chris, SalesPerson)
```

### 构造器中的全局信息

在创建构造器时，在构造器中设置全局信息要小心。例如，假设希望为每一个雇员分配一个唯一标识。可能会为 `Employee` 使用如下定义：

```
var idCounter = 1;

function Employee (name, dept) {
   this.name = name || "";
   this.dept = dept || "general";
   this.id = idCounter++;
}
```

基于该定义，在创建新的 `Employee` 时，构造器为其分配了序列中的下一个标识符。然后递增全局的标识符计数器。因此，如果，如果随后的语句如下，则 `victoria.id` 为 1 而 `harry.id` 为 2：

```
var victoria = new Employee("Pigbert, Victoria", "pubs")
var harry = new Employee("Tschopik, Harry", "sales")
```

乍一看似乎没问题。但是，无论什么目的，在每一次创建 `Employee` 对象时，`idCounter` 都将被递增一次。如果创建本章中所描述的整个 `Employee` 层级结构，每次设置原型的时候，`Employee` 构造器都将被调用一次。假设有如下代码：

```
var idCounter = 1;

function Employee (name, dept) {
   this.name = name || "";
   this.dept = dept || "general";
   this.id = idCounter++;
}

function Manager (name, dept, reports) {...}
Manager.prototype = new Employee;

function WorkerBee (name, dept, projs) {...}
WorkerBee.prototype = new Employee;

function Engineer (name, projs, mach) {...}
Engineer.prototype = new WorkerBee;

function SalesPerson (name, projs, quota) {...}
SalesPerson.prototype = new WorkerBee;

var mac = new Engineer("Wood, Mac");
```

还可以进一步假设上面省略掉的定义中包含 `base` 属性而且调用了原型链中高于它们的构造器。即便在现在这个情况下，在 `mac` 对象创建时，`mac.id` 为 5。

依赖于应用程序，计数器额外的递增可能有问题，也可能没问题。如果确实需要准确的计数器，则以下构造器可以作为一个可行的方案：

```
function Employee (name, dept) {
   this.name = name || "";
   this.dept = dept || "general";
   if (name)
      this.id = idCounter++;
}
```

在用作原型而创建新的 `Employee` 实例时，不会指定参数。使用这个构造器定义，如果不指定参数，构造器不会指定标识符，也不会递增计数器。而如果想让 `Employee` 分配到标识符，则必需为雇员指定姓名。在这个例子中，`mac.id` 将为 1。

或者，您可以创建一个 Employee 的原型对象的副本以分配给 WorkerBee：

```
WorkerBee.prototype = Object.create(Employee.prototype);
// instead of WorkerBee.prototype = new Employee
```

### 没有多重继承

某些面向对象语言支持多重继承。也就是说，对象可以从无关的多个父对象中继承属性和属性值。JavaScript 不支持多重继承。

JavaScript 属性值的继承是在运行时通过检索对象的原型链来实现的。因为对象只有一个原型与之关联，所以 JavaScript 无法动态地从多个原型链中继承。

在 JavaScript 中，可以在构造器函数中调用多个其它的构造器函数。这一点造成了多重继承的假象。例如，考虑如下语句：

```
function Hobbyist (hobby) {
   this.hobby = hobby || "scuba";
}

function Engineer (name, projs, mach, hobby) {
   this.base1 = WorkerBee;
   this.base1(name, "engineering", projs);
   this.base2 = Hobbyist;
   this.base2(hobby);
   this.machine = mach || "";
}
Engineer.prototype = new WorkerBee;

var dennis = new Engineer("Doe, Dennis", ["collabra"], "hugo")
```

进一步假设使用本章前面所属的 `WorkerBee` 的定义。此时 `dennis` 对象具有如下属性：

```
dennis.name == "Doe, Dennis"
dennis.dept == "engineering"
dennis.projects == ["collabra"]
dennis.machine == "hugo"
dennis.hobby == "scuba"
```

`dennis` 确实从 `Hobbyist` 构造器中获得了 `hobby` 属性。但是，假设添加了一个属性到 `Hobbyist` 构造器的原型：

```
Hobbyist.prototype.equipment = ["mask", "fins", "regulator", "bcd"]
```

`dennis` 对象不会继承这个新属性。



# Inheritance_and_the_prototype_chain

对于使用过基于类的语言 (如 Java 或 C++) 的开发人员来说，JavaScript 有点令人困惑，因为它是动态的，并且本身不提供一个 `class` 实现。（在 ES2015/ES6 中引入了 `class` 关键字，但那只是语法糖，JavaScript 仍然是基于原型的）。

当谈到继承时，JavaScript 只有一种结构：对象。每个实例对象（ object ）都有一个私有属性（称之为 **proto** ）指向它的构造函数的原型对象（**prototype** ）。该原型对象也有一个自己的原型对象( **proto** ) ，层层向上直到一个对象的原型对象为 `null`。根据定义，`null` 没有原型，并作为这个**原型链**中的最后一个环节。

几乎所有 JavaScript 中的对象都是位于原型链顶端的 `[Object](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object>)` 的实例。

尽管这种原型继承通常被认为是 JavaScript 的弱点之一，但是原型继承模型本身实际上比经典模型更强大。例如，在原型模型的基础上构建经典模型相当简单。

## 基于原型链的继承

### 继承属性

JavaScript 对象是动态的属性“包”（指其自己的属性）。JavaScript 对象有一个指向一个原型对象的链。当试图访问一个对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或到达原型链的末尾。

遵循ECMAScript标准，`someObject.[[Prototype]]` 符号是用于指向 `someObject` 的原型。从 ECMAScript 6 开始，`[[Prototype]]` 可以通过 `[Object.getPrototypeOf()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf>)` 和 `[Object.setPrototypeOf()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf>)` 访问器来访问。这个等同于 JavaScript 的非标准但许多浏览器实现的属性 `__proto__`。

但它不应该与构造函数 `func` 的 `prototype` 属性相混淆。被构造函数创建的实例对象的 `[[Prototype]]` 指向 `func` 的 `prototype` 属性。**`Object.prototype`** 属性表示 `[Object](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object>)` 的原型对象。

这里演示当尝试访问属性时会发生什么：

```
// 让我们从一个函数里创建一个对象o，它自身拥有属性a和b的：
let f = function () {
   this.a = 1;
   this.b = 2;
}
/* 这么写也一样
function f() {
  this.a = 1;
  this.b = 2;
}
*/
let o = new f(); // {a: 1, b: 2}

// 在f函数的原型上定义属性
f.prototype.b = 3;
f.prototype.c = 4;

// 不要在 f 函数的原型上直接定义 f.prototype = {b:3,c:4};这样会直接打破原型链
// o.[[Prototype]] 有属性 b 和 c
//  (其实就是 o.__proto__ 或者 o.constructor.prototype)
// o.[[Prototype]].[[Prototype]] 是 Object.prototype.
// 最后o.[[Prototype]].[[Prototype]].[[Prototype]]是null
// 这就是原型链的末尾，即 null，
// 根据定义，null 就是没有 [[Prototype]]。

// 综上，整个原型链如下: 

// {a:1, b:2} ---> {b:3, c:4} ---> Object.prototype---> null

console.log(o.a); // 1
// a是o的自身属性吗？是的，该属性的值为 1

console.log(o.b); // 2
// b是o的自身属性吗？是的，该属性的值为 2
// 原型上也有一个'b'属性，但是它不会被访问到。
// 这种情况被称为"属性遮蔽 (property shadowing)"

console.log(o.c); // 4
// c是o的自身属性吗？不是，那看看它的原型上有没有
// c是o.[[Prototype]]的属性吗？是的，该属性的值为 4

console.log(o.d); // undefined
// d 是 o 的自身属性吗？不是，那看看它的原型上有没有
// d 是 o.[[Prototype]] 的属性吗？不是，那看看它的原型上有没有
// o.[[Prototype]].[[Prototype]] 为 null，停止搜索
// 找不到 d 属性，返回 undefined
```

代码来源链接：https://repl.it/@khaled_hossain_code/prototype

给对象设置属性会创建自有属性。获取和设置属性的唯一限制是内置 [getter 或 setter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Working_with_Objects#Defining_getters_and_setters) 的属性。

### 继承方法

JavaScript 并没有其他基于类的语言所定义的“方法”。在 JavaScript 里，任何函数都可以添加到对象上作为对象的属性。函数的继承与其他的属性继承没有差别，包括上面的“属性遮蔽”（这种情况相当于其他语言的方法重写）。

当继承的函数被调用时，[this](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this) 指向的是当前继承的对象，而不是继承的函数所在的原型对象。

```
var o = {
  a: 2,
  m: function(){
    return this.a + 1;
  }
};

console.log(o.m()); // 3
// 当调用 o.m 时，'this' 指向了 o.

var p = Object.create(o);
// p是一个继承自 o 的对象

p.a = 4; // 创建 p 的自身属性 'a'
console.log(p.m()); // 5
// 调用 p.m 时，'this' 指向了 p
// 又因为 p 继承了 o 的 m 函数
// 所以，此时的 'this.a' 即 p.a，就是 p 的自身属性 'a' 
```

## 在 JavaScript 中使用原型

接下去，来仔细分析一下这些应用场景下， JavaScript 在背后做了哪些事情。

正如之前提到的，在 JavaScript 中，函数（function）是允许拥有属性的。所有的函数会有一个特别的属性 —— `prototype` 。请注意，以下的代码是独立的（出于严谨，假定页面没有其他的JavaScript代码）。为了最佳的学习体验，我们强烈建议阁下打开浏览器的控制台（在Chrome和火狐浏览器中，按Ctrl+Shift+I即可），进入“console”选项卡，然后把如下的JavaScript代码复制粘贴到窗口中，最后通过按下回车键运行代码。

```
function doSomething(){}
console.log( doSomething.prototype );
// 和声明函数的方式无关，
// JavaScript 中的函数永远有一个默认原型属性。
var doSomething = function(){};
console.log( doSomething.prototype );
```

在控制台显示的JavaScript代码块中，我们可以看到doSomething函数的一个默认属性prototype。而这段代码运行之后，控制台应该显示类似如下的结果：

```
{
    constructor: ƒ doSomething(),
    __proto__: {
        constructor: ƒ Object(),
        hasOwnProperty: ƒ hasOwnProperty(),
        isPrototypeOf: ƒ isPrototypeOf(),
        propertyIsEnumerable: ƒ propertyIsEnumerable(),
        toLocaleString: ƒ toLocaleString(),
        toString: ƒ toString(),
        valueOf: ƒ valueOf()
    }
}
```

我们可以给doSomething函数的原型对象添加新属性，如下：

```
function doSomething(){}
doSomething.prototype.foo = "bar";
console.log( doSomething.prototype );
```

可以看到运行后的结果如下：

```
{
    foo: "bar",
    constructor: ƒ doSomething(),
    __proto__: {
        constructor: ƒ Object(),
        hasOwnProperty: ƒ hasOwnProperty(),
        isPrototypeOf: ƒ isPrototypeOf(),
        propertyIsEnumerable: ƒ propertyIsEnumerable(),
        toLocaleString: ƒ toLocaleString(),
        toString: ƒ toString(),
        valueOf: ƒ valueOf()
    }
}
```

现在我们可以通过new操作符来创建基于这个原型对象的doSomething实例。使用new操作符，只需在调用doSomething函数语句之前添加new。这样，便可以获得这个函数的一个实例对象。一些属性就可以添加到该原型对象中。

请尝试运行以下代码：

```
function doSomething(){}
doSomething.prototype.foo = "bar"; // add a property onto the prototype
var doSomeInstancing = new doSomething();
doSomeInstancing.prop = "some value"; // add a property onto the object
console.log( doSomeInstancing );
```

运行的结果类似于以下的语句。

```
{
    prop: "some value",
    __proto__: {
        foo: "bar",
        constructor: ƒ doSomething(),
        __proto__: {
            constructor: ƒ Object(),
            hasOwnProperty: ƒ hasOwnProperty(),
            isPrototypeOf: ƒ isPrototypeOf(),
            propertyIsEnumerable: ƒ propertyIsEnumerable(),
            toLocaleString: ƒ toLocaleString(),
            toString: ƒ toString(),
            valueOf: ƒ valueOf()
        }
    }
}
```

如上所示, `doSomeInstancing` 中的`__proto__`是 `doSomething.prototype`. 但这是做什么的呢？当你访问`doSomeInstancing` 中的一个属性，浏览器首先会查看`doSomeInstancing` 中是否存在这个属性。

如果 `doSomeInstancing` 不包含属性信息, 那么浏览器会在 `doSomeInstancing` 的 `__proto__` 中进行查找(同 doSomething.prototype). 如属性在 `doSomeInstancing` 的 `__proto__` 中查找到，则使用 `doSomeInstancing` 中 `__proto__` 的属性。

否则，如果 `doSomeInstancing` 中 `__proto__` 不具有该属性，则检查`doSomeInstancing` 的 `__proto__` 的  `__proto__` 是否具有该属性。默认情况下，任何函数的原型属性 `__proto__` 都是 `window.Object.prototype.` 因此, 通过`doSomeInstancing` 的 `__proto__` 的  `__proto__` ( 同 doSomething.prototype 的 `__proto__` (同 `Object.prototype`)) 来查找要搜索的属性。

如果属性不存在 `doSomeInstancing` 的 `__proto__` 的  `__proto__` 中， 那么就会在`doSomeInstancing` 的 `__proto__` 的  `__proto__` 的  `__proto__` 中查找。然而, 这里存在个问题：`doSomeInstancing` 的 `__proto__` 的  `__proto__` 的  `__proto__` 其实不存在。因此，只有这样，在 `__proto__` 的整个原型链被查看之后，这里没有更多的 `__proto__` ， 浏览器断言该属性不存在，并给出属性值为 `undefined` 的结论。

让我们在控制台窗口中输入更多的代码，如下：

```
function doSomething(){}
doSomething.prototype.foo = "bar";
var doSomeInstancing = new doSomething();
doSomeInstancing.prop = "some value";
console.log("doSomeInstancing.prop:      " + doSomeInstancing.prop);
console.log("doSomeInstancing.foo:       " + doSomeInstancing.foo);
console.log("doSomething.prop:           " + doSomething.prop);
console.log("doSomething.foo:            " + doSomething.foo);
console.log("doSomething.prototype.prop: " + doSomething.prototype.prop);
console.log("doSomething.prototype.foo:  " + doSomething.prototype.foo);
```

结果如下：

```
doSomeInstancing.prop:      some value
doSomeInstancing.foo:       bar
doSomething.prop:           undefined
doSomething.foo:            undefined
doSomething.prototype.prop: undefined
doSomething.prototype.foo:  bar
```

## 使用不同的方法来创建对象和生成原型链

### 使用语法结构创建的对象

```
var o = {a: 1};

// o 这个对象继承了 Object.prototype 上面的所有属性
// o 自身没有名为 hasOwnProperty 的属性
// hasOwnProperty 是 Object.prototype 的属性
// 因此 o 继承了 Object.prototype 的 hasOwnProperty
// Object.prototype 的原型为 null
// 原型链如下:
// o ---> Object.prototype ---> null

var a = ["yo", "whadup", "?"];

// 数组都继承于 Array.prototype 
// (Array.prototype 中包含 indexOf, forEach 等方法)
// 原型链如下:
// a ---> Array.prototype ---> Object.prototype ---> null

function f(){
  return 2;
}

// 函数都继承于 Function.prototype
// (Function.prototype 中包含 call, bind等方法)
// 原型链如下:
// f ---> Function.prototype ---> Object.prototype ---> null
```

### 使用构造器创建的对象

在 JavaScript 中，构造器其实就是一个普通的函数。当使用 [new 操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 来作用这个函数时，它就可以被称为构造方法（构造函数）。

```
function Graph() {
  this.vertices = [];
  this.edges = [];
}

Graph.prototype = {
  addVertex: function(v){
    this.vertices.push(v);
  }
};

var g = new Graph();
// g 是生成的对象，他的自身属性有 'vertices' 和 'edges'。
// 在 g 被实例化时，g.[[Prototype]] 指向了 Graph.prototype。
```

### 使用 `Object.create` 创建的对象

ECMAScript 5 中引入了一个新方法：`[Object.create()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create>)`。可以调用这个方法来创建一个新对象。新对象的原型就是调用 create 方法时传入的第一个参数：

```
var a = {a: 1}; 
// a ---> Object.prototype ---> null

var b = Object.create(a);
// b ---> a ---> Object.prototype ---> null
console.log(b.a); // 1 (继承而来)

var c = Object.create(b);
// c ---> b ---> a ---> Object.prototype ---> null

var d = Object.create(null);
// d ---> null
console.log(d.hasOwnProperty); // undefined, 因为d没有继承Object.prototype
```

### 使用 `class` 关键字创建的对象

ECMAScript6 引入了一套新的关键字用来实现 [class](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)。使用基于类语言的开发人员会对这些结构感到熟悉，但它们是不同的。JavaScript 仍然基于原型。这些新的关键字包括 `[class](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/class>)`, `[constructor](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/constructor>)`，`[static](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/static>)`，`[extends](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/extends>)` 和 `[super](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/super>)`。

```
"use strict";

class Polygon {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}

class Square extends Polygon {
  constructor(sideLength) {
    super(sideLength, sideLength);
  }
  get area() {
    return this.height * this.width;
  }
  set sideLength(newLength) {
    this.height = newLength;
    this.width = newLength;
  }
}

var square = new Square(2);
```

### 性能

在原型链上查找属性比较耗时，对性能有副作用，这在性能要求苛刻的情况下很重要。另外，试图访问不存在的属性时会遍历整个原型链。

遍历对象的属性时，原型链上的**每个**可枚举属性都会被枚举出来。要检查对象是否具有自己定义的属性，而不是其原型链上的某个属性，则必须使用所有对象从 `Object.prototype` 继承的 `[hasOwnProperty](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Object/hasOwnProperty>)` 方法。下面给出一个具体的例子来说明它：

```
console.log(g.hasOwnProperty('vertices'));
// true

console.log(g.hasOwnProperty('nope'));
// false

console.log(g.hasOwnProperty('addVertex'));
// false

console.log(g.__proto__.hasOwnProperty('addVertex'));
// true
```

`[hasOwnProperty](<https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Object/hasOwnProperty>)` 是 JavaScript 中唯一一个处理属性并且**不会**遍历原型链的方法。（译者注：原文如此。另一种这样的方法：`[Object.keys()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys>)`）

注意：检查属性是否为 `[undefined](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined>)` 是**不能够**检查其是否存在的。该属性可能已存在，但其值恰好被设置成了 `undefined`。

### 错误实践：扩展原生对象的原型

经常使用的一个错误实践是扩展 `Object.prototype` 或其他内置原型。

这种技术被称为猴子补丁并且会破坏封装。尽管一些流行的框架（如 Prototype.js）在使用该技术，但仍然没有足够好的理由使用附加的非标准方法来混入内置原型。

扩展内置原型的**唯一**理由是支持 JavaScript 引擎的新特性，如 `Array.forEach`。

### 总结：4 个用于拓展原型链的方法

下面列举四种用于拓展原型链的方法，以及他们的优势和缺陷。下列四个例子都创建了完全相同的 `inst` 对象（所以在控制台上的输出也是一致的），为了举例，唯一的区别是他们的创建方法不同。

[Untitled](https://www.notion.so/15e1124678b94175a3db99a9e45f738e)

## `prototype` 和 `Object.getPrototypeOf`

对于从 Java 或 C++ 转过来的开发人员来说，JavaScript 会有点让人困惑，因为它完全是动态的，都是运行时，而且不存在类（class）。所有的都是实例（对象）。即使我们模拟出的 “类”，也只是一个函数对象。

你可能已经注意到我们的 function A 有一个叫做 `prototype` 的特殊属性。该特殊属性可与 JavaScript 的 `new` 操作符一起使用。对原型对象的引用被复制到新实例的内部 `[[Prototype]]` 属性。例如，当执行 `var a1 = new A();` 时，JavaScript（在内存中创建对象之后，和在运行函数 `A()` 把 `this` 指向对象之前）设置 `a1.[[Prototype]] = A.prototype;`。然后当您访问实例的属性时，JavaScript 首先会检查它们是否直接存在于该对象上，如果不存在，则会 `[[Prototype]]` 中查找。这意味着你在 `prototype` 中定义的所有内容都可以由所有实例有效地共享，你甚至可以稍后更改部分 `prototype`，并在所有现有实例中显示更改（如果有必要的话）。

像上面的例子中，如果你执行 `var a1 = new A(); var a2 = new A();` 那么 `a1.doSomething` 事实上会指向 `Object.getPrototypeOf(a1).doSomething`，它就是你在 `A.prototype.doSomething` 中定义的内容。也就是说：`Object.getPrototypeOf(a1).doSomething == Object.getPrototypeOf(a2).doSomething == A.prototype.doSomething`（补充：实际上，执行 `a1.doSomething()` 相当于执行 `Object.getPrototypeOf(a1).doSomething.call(a1)==A.prototype.doSomething.call(a1)`）

简而言之， `prototype` 是用于类的，而 `Object.getPrototypeOf()` 是用于实例的（instances），两者功能一致。

`[[Prototype]]` 看起来就像**递归**引用， 如 `a1.doSomething`、`Object.getPrototypeOf(a1).doSomething`、`Object.getPrototypeOf(Object.getPrototypeOf(a1)).doSomething` 等等等， 直到它被找到或 `Object.getPrototypeOf` 返回 `null`。

因此，当你执行：

```
var o = new Foo();
```

JavaScript 实际上执行的是：

```
var o = new Object();
o.__proto__ = Foo.prototype;
Foo.call(o);
```

（或者类似上面这样的），然后，当你执行：

```
o.someProp;
```

它检查 o 是否具有 `someProp` 属性。如果没有，它会查找 `Object.getPrototypeOf(o).someProp`，如果仍旧没有，它会继续查找 `Object.getPrototypeOf(Object.getPrototypeOf(o)).someProp`。

## 结论

在使用原型继承编写复杂代码之前，理解原型继承模型是**至关重要**的。此外，请注意代码中原型链的长度，并在必要时将其分解，以避免可能的性能问题。此外，原生原型**不应该**被扩展，除非它是为了与新的 JavaScript 特性兼容。

**译者注：**在英文原版中，以下内容已被移除。保留仅作参考。

## 示例

`B` 继承自 `A`：

```
function A(a){
  this.varA = a;
}

// 以上函数 A 的定义中，既然 A.prototype.varA 总是会被 this.varA 遮蔽，
// 那么将 varA 加入到原型（prototype）中的目的是什么？
A.prototype = {
  varA : null,
/*
既然它没有任何作用，干嘛不将 varA 从原型（prototype）去掉 ? 
也许作为一种在隐藏类中优化分配空间的考虑 ?
<https://developers.google.com/speed/articles/optimizing-javascript> 
如果varA并不是在每个实例中都被初始化，那这样做将是有效果的。
*/
  doSomething : function(){
    // ...
  }
}

function B(a, b){
  A.call(this, a);
  this.varB = b;
}
B.prototype = Object.create(A.prototype, {
  varB : {
    value: null, 
    enumerable: true, 
    configurable: true, 
    writable: true 
  },
  doSomething : { 
    value: function(){ // override
      A.prototype.doSomething.apply(this, arguments); 
      // call super
      // ...
    },
    enumerable: true,
    configurable: true, 
    writable: true
  }
});
B.prototype.constructor = B;

var b = new B();
b.doSomething();
```

最重要的部分是：

- 类型被定义在 `.prototype` 中
- 用 `Object.create()` 来继承



# Using_promises

`[Promise](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise>)` 是一个对象，它代表了一个异步操作的最终完成或者失败。因为大多数人仅仅是使用已创建的 Promise 实例对象，所以本教程将首先说明怎样使用 Promise，再说明如何创建 Promise。

本质上 Promise 是一个函数返回的对象，我们可以在它上面绑定回调函数，这样我们就不需要在一开始把回调函数作为参数传入这个函数了。

假设现在有一个名为 `createAudioFileAsync()` 的函数，它接收一些配置和两个回调函数，然后异步地生成音频文件。一个回调函数在文件成功创建时被调用，另一个则在出现异常时被调用。

以下为使用 `createAudioFileAsync()` 的示例：

```
// 成功的回调函数
function successCallback(result) {
  console.log("音频文件创建成功: " + result);
}

// 失败的回调函数
function failureCallback(error) {
  console.log("音频文件创建失败: " + error);
}

createAudioFileAsync(audioSettings, successCallback, failureCallback)
```

更现代的函数会返回一个 Promise 对象，使得你可以将你的回调函数绑定在该 Promise 上。

如果函数 `createAudioFileAsync()` 被重写为返回 Promise 的形式，那么我们可以像下面这样简单地调用它：

```
const promise = createAudioFileAsync(audioSettings); 
promise.then(successCallback, failureCallback);
```

或者简写为：

```
createAudioFileAsync(audioSettings).then(successCallback, failureCallback);
```

我们把这个称为 *异步函数调用*，这种形式有若干优点，下面我们将会逐一讨论。

## 约定

不同于“老式”的传入回调，在使用 Promise 时，会有以下约定：

- 在本轮 [事件循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop#执行至完成) 运行完成之前，回调函数是不会被调用的。
- 即使异步操作已经完成（成功或失败），在这之后通过 `[then()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) 添加的回调函数也会被调用。
- 通过多次调用 `[then()](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then>)` 可以添加多个回调函数，它们会按照插入顺序进行执行。

Promise 很棒的一点就是**链式调用**（**chaining**）。

## 链式调用

连续执行两个或者多个异步操作是一个常见的需求，在上一个操作执行成功之后，开始下一个的操作，并带着上一步操作所返回的结果。我们可以通过创造一个 **Promise 链**来实现这种需求。

见证奇迹的时刻：`then()` 函数会返回一个和原来不同的**新的 Promise**：

```
const promise = doSomething();
const promise2 = promise.then(successCallback, failureCallback);
```

或者

```
const promise2 = doSomething().then(successCallback, failureCallback);
```

`promise2` 不仅表示 `doSomething()` 函数的完成，也代表了你传入的 `successCallback` 或者 `failureCallback` 的完成，这两个函数也可以返回一个 Promise 对象，从而形成另一个异步操作，这样的话，在 `promise2` 上新增的回调函数会排在这个 Promise 对象的后面。

基本上，每一个 Promise 都代表了链中另一个异步过程的完成。

在过去，要想做多重的异步操作，会导致经典的回调地狱：

```
doSomething(function(result) {
  doSomethingElse(result, function(newResult) {
    doThirdThing(newResult, function(finalResult) {
      console.log('Got the final result: ' + finalResult);
    }, failureCallback);
  }, failureCallback);
}, failureCallback);
```

现在，我们可以把回调绑定到返回的 Promise 上，形成一个 Promise 链：

```
doSomething().then(function(result) {
  return doSomethingElse(result);
})
.then(function(newResult) {
  return doThirdThing(newResult);
})
.then(function(finalResult) {
  console.log('Got the final result: ' + finalResult);
})
.catch(failureCallback);
```

then 里的参数是可选的，`catch(failureCallback)` 是 `then(null, failureCallback)` 的缩略形式。如下所示，我们也可以用[箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)来表示：

```
doSomething()
.then(result => doSomethingElse(result))
.then(newResult => doThirdThing(newResult))
.then(finalResult => {
  console.log(`Got the final result: ${finalResult}`);
})
.catch(failureCallback);
```

**注意：**一定要有返回值，否则，callback 将无法获取上一个 Promise 的结果。(如果使用箭头函数，`() => x` 比 `() => { return x; }` 更简洁一些，但后一种保留 `return` 的写法才支持使用多个语句。）。

### Catch 的后续链式操作

有可能会在一个回调失败之后继续使用链式操作，即，使用一个 `catch`，这对于在链式操作中抛出一个失败之后，再次进行新的操作会很有用。请阅读下面的例子：

```
new Promise((resolve, reject) => {
    console.log('初始化');

    resolve();
})
.then(() => {
    throw new Error('有哪里不对了');
        
    console.log('执行「这个」”');
})
.catch(() => {
    console.log('执行「那个」');
})
.then(() => {
    console.log('执行「这个」，无论前面发生了什么');
});
```

输出结果如下：

```
初始化
执行“那个”
执行“这个”，无论前面发生了什么
```

**注意：**因为抛出了错误 有哪里不对了，所以前一个 执行「这个」 没有被输出。

## 错误传递

在之前的回调地狱示例中，你可能记得有 3 次 `failureCallback` 的调用，而在 Promise 链中只有尾部的一次调用。

```
doSomething()
.then(result => doSomethingElse(result))
.then(newResult => doThirdThing(newResult))
.then(finalResult => console.log(`Got the final result: ${finalResult}`))
.catch(failureCallback);
```

通常，一遇到异常抛出，浏览器就会顺着 Promise 链寻找下一个 `onRejected` 失败回调函数或者由 `.catch()` 指定的回调函数。这和以下同步代码的工作原理（执行过程）非常相似。

```
try {
  let result = syncDoSomething();
  let newResult = syncDoSomethingElse(result);
  let finalResult = syncDoThirdThing(newResult);
  console.log(`Got the final result: ${finalResult}`);
} catch(error) {
  failureCallback(error);
}
```

在 ECMAScript 2017 标准的 `[async/await](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function>)` 语法糖中，这种异步代码的对称性得到了极致的体现：

```
async function foo() {
  try {
    const result = await doSomething();
    const newResult = await doSomethingElse(result);
    const finalResult = await doThirdThing(newResult);
    console.log(`Got the final result: ${finalResult}`);
  } catch(error) {
    failureCallback(error);
  }
}
```

这个例子是在 Promise 的基础上构建的，例如，`doSomething()` 与之前的函数是相同的。你可以在[这里](https://developers.google.com/web/fundamentals/getting-started/primers/async-functions)阅读更多的与此语法相关的文章。

通过捕获所有的错误，甚至抛出异常和程序错误，Promise 解决了回调地狱的基本缺陷。这对于构建异步操作的基础功能而言是很有必要的。

## Promise 拒绝事件

当 Promise 被拒绝时，会有下文所述的两个事件之一被派发到全局作用域（通常而言，就是`[window](<https://developer.mozilla.org/zh-CN/docs/Web/API/Window>)`；如果是在 web worker 中使用的话，就是 `[Worker](<https://developer.mozilla.org/zh-CN/docs/Web/API/Worker>)` 或者其他 worker-based 接口）。这两个事件如下所示：

**`[rejectionhandled](<https://developer.mozilla.org/zh-CN/docs/Web/API/Window/rejectionhandled_event>)`**当 Promise 被拒绝、并且在 `reject` 函数处理该 rejection 之后会派发此事件。**`[unhandledrejection](<https://developer.mozilla.org/zh-CN/docs/Web/API/Window/unhandledrejection_event>)`**当 Promise 被拒绝，但没有提供 `reject` 函数来处理该 rejection 时，会派发此事件。

以上两种情况中，`[PromiseRejectionEvent](<https://developer.mozilla.org/zh-CN/docs/Web/API/PromiseRejectionEvent>)` 事件都有两个属性，一个是 `[promise](<https://developer.mozilla.org/zh-CN/docs/Web/API/PromiseRejectionEvent/promise>)` 属性，该属性指向被驳回的 Promise，另一个是 `[reason](<https://developer.mozilla.org/zh-CN/docs/Web/API/PromiseRejectionEvent/reason>)` 属性，该属性用来说明 Promise 被驳回的原因。

因此，我们可以通过以上事件为 Promise 失败时提供补偿处理，也有利于调试 Promise 相关的问题。在每一个上下文中，该处理都是全局的，因此不管源码如何，所有的错误都会在同一个处理函数中被捕捉并处理。

一个特别有用的例子：当你使用 [Node.js](https://developer.mozilla.org/zh-CN/docs/Glossary/Node.js) 时，有些依赖模块可能会有未被处理的 rejected promises，这些都会在运行时打印到控制台。你可以在自己的代码中捕捉这些信息，然后添加与 `[unhandledrejection](<https://developer.mozilla.org/zh-CN/docs/Web/API/Window/unhandledrejection_event>)` 相应的处理函数来做分析和处理，或只是为了让你的输出更整洁。举例如下：

```
window.addEventListener("unhandledrejection", event => {
  /* 你可以在这里添加一些代码，以便检查
     event.promise 中的 promise 和
     event.reason 中的 rejection 原因 */

  event.preventDefault();
}, false);
```

调用 event 的 `[preventDefault()](<https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault>)` 方法是为了告诉 JavaScript 引擎当 Promise 被拒绝时不要执行默认操作，默认操作一般会包含把错误打印到控制台，Node 就是如此的。

理想情况下，在忽略这些事件之前，我们应该检查所有被拒绝的 Promise，来确认这不是代码中的 bug。

## 在旧式回调 API 中创建 Promise

可以通过 Promise 的构造器从零开始创建 `[Promise](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise>)`。 这种方式（通过构造器的方式）应当只在封装旧 API 的时候用到。

理想状态下，所有的异步函数都已经返回 Promise 了。但有一些 API 仍然使用旧方式来传入的成功（或者失败）的回调。典型的例子就是 `[setTimeout()](<https://developer.mozilla.org/zh-CN/docs/Web/API/WindowTimers/setTimeout>)` 函数：

```
setTimeout(() => saySomething("10 seconds passed"), 10000);
```

混用旧式回调和 Promise 可能会造成运行时序问题。如果 `saySomething` 函数失败了，或者包含了编程错误，那就没有办法捕获它了。这得怪 `setTimeout`。

幸运地是，我们可以用 Promise 来封装它。最好的做法是，将这些有问题的函数封装起来，留在底层，并且永远不要再直接调用它们：

```
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

wait(10000).then(() => saySomething("10 seconds")).catch(failureCallback);
```

通常，Promise 的构造器接收一个执行函数(executor)，我们可以在这个执行函数里手动地 resolve 和 reject 一个 Promise。既然 `setTimeout` 并不会真的执行失败，那么我们可以在这种情况下忽略 reject。

## 组合

`[Promise.resolve()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve>)` 和 `[Promise.reject()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject>)` 是手动创建一个已经 resolve 或者 reject 的 Promise 快捷方法。它们有时很有用。

`[Promise.all()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all>)` 和 `[Promise.race()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race>)` 是并行运行异步操作的两个组合式工具。

我们可以发起并行操作，然后等多个操作全部结束后进行下一步操作，如下：

```
Promise.all([func1(), func2(), func3()])
.then(([result1, result2, result3]) => { /* use result1, result2 and result3 */ });
```

可以使用一些聪明的 JavaScript 写法实现时序组合：

```
[func1, func2, func3].reduce((p, f) => p.then(f), Promise.resolve())
.then(result3 => { /* use result3 */ });
```

通常，我们递归调用一个由异步函数组成的数组时，相当于一个 Promise 链：

```
Promise.resolve().then(func1).then(func2).then(func3);
```

我们也可以写成可复用的函数形式，这在函数式编程中极为普遍：

```
const applyAsync = (acc,val) => acc.then(val);
const composeAsync = (...funcs) => x => funcs.reduce(applyAsync, Promise.resolve(x));
```

`composeAsync()` 函数将会接受任意数量的函数作为其参数，并返回一个新的函数，该函数接受一个通过 composition pipeline 传入的初始值。这对我们来说非常有益，因为任一函数可以是异步或同步的，它们能被保证按顺序执行：

```
const transformData = composeAsync(func1, func2, func3);
const result3 = transformData(data);
```

在 ECMAScript 2017 标准中, 时序组合可以通过使用 `async/await` 而变得更简单：

```
let result;
for (const f of [func1, func2, func3]) {
  result = await f(result);
}
/* use last result (i.e. result3) */
```

## 时序

为了避免意外，即使是一个已经变成 resolve 状态的 Promise，传递给 `[then()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then>)` 的函数也总是会被异步调用：

```
Promise.resolve().then(() => console.log(2));
console.log(1); // 1, 2
```

传递到 `then()` 中的函数被置入到一个微任务队列中，而不是立即执行，这意味着它是在 JavaScript 事件队列的所有运行时结束了，且事件队列被清空之后，才开始执行：

```
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

wait().then(() => console.log(4));
Promise.resolve().then(() => console.log(2)).then(() => console.log(3));
console.log(1); // 1, 2, 3, 4
```

## 嵌套

简便的 Promise 链式编程最好保持扁平化，不要嵌套 Promise，因为嵌套经常会是粗心导致的。可查阅下一节的[常见错误](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises#常见错误)中的例子。

嵌套 Promise 是一种可以限制 `catch` 语句的作用域的控制结构写法。明确来说，嵌套的 `catch` 仅捕捉在其之前同时还必须是其作用域的 failureres，而捕捉不到在其链式以外或者其嵌套域以外的 error。如果使用正确，那么可以实现高精度的错误修复。

```
doSomethingCritical()
.then(result => doSomethingOptional()
  .then(optionalResult => doSomethingExtraNice(optionalResult))
  .catch(e => {console.log(e.message)})) // 即使有异常也会忽略，继续运行;(最后会输出)
.then(() => moreCriticalStuff())
.catch(e => console.log("Critical failure: " + e.message));// 没有输出
```

注意,有些代码步骤是嵌套的，而不是一个简单的纯链式，这些语句前与后都被括号 `()` 包裹着。

这个内部的 `catch` 语句仅能捕获到 `doSomethingOptional()` 和 `doSomethingExtraNice()` 的失败，`之后就恢复到moreCriticalStuff()` 的运行。重要提醒：如果 `doSomethingCritical()` 失败，这个错误仅会被最后的（外部）`catch` 语句捕获到。

## 常见错误

在编写 Promise 链时，需要注意以下示例中展示的几个错误：

```
// 错误示例，包含 3 个问题！

doSomething().then(function(result) {
  doSomethingElse(result) // 没有返回 Promise 以及没有必要的嵌套 Promise
  .then(newResult => doThirdThing(newResult));
}).then(() => doFourthThing());
// 最后，是没有使用 catch 终止 Promise 调用链，可能导致没有捕获的异常
```

第一个错误是没有正确地将事物相连接。当我们创建新 Promise 但忘记返回它时，会发生这种情况。因此，链条被打破，或者更确切地说，我们有两个独立的链条竞争（同时在执行两个异步而非一个一个的执行）。这意味着 `doFourthThing()` 不会等待 `doSomethingElse()` 或 `doThirdThing()` 完成，并且将与它们并行运行，可能是无意的。单独的链也有单独的错误处理，导致未捕获的错误。

第二个错误是不必要地嵌套，实现第一个错误。嵌套还限制了内部错误处理程序的范围，如果是非预期的，可能会导致未捕获的错误。其中一个变体是 [Promise 构造函数反模式](https://stackoverflow.com/questions/23803743/what-is-the-explicit-promise-construction-antipattern-and-how-do-i-avoid-it)，它结合了 Promise 构造函数的多余使用和嵌套。

第三个错误是忘记用 `catch` 终止链。这导致在大多数浏览器中不能终止的 Promise 链里的 rejection。

一个好的经验法则是总是返回或终止 Promise 链，并且一旦你得到一个新的 Promise，返回它。下面是修改后的平面化的代码：

```
doSomething()
.then(function(result) {
  return doSomethingElse(result);
})
.then(newResult => doThirdThing(newResult))
.then(() => doFourthThing())
.catch(error => console.log(error));
```

注意：`() => x` 是 `() => { return x; }` 的简写。

上述代码的写法就是具有适当错误处理的简单明确的链式写法。

使用 [async/await](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function) 可以解决以上大多数错误，使用 `async/await` 时，最常见的语法错误就是忘记了 `[await](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await>)` 关键字。



# Iterators_and_Generators

处理集合中的每个项是很常见的操作。JavaScript 提供了许多迭代集合的方法，从简单的 `[for](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for>)` 循环到 `[map()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map>)` 和 `[filter()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter>)`。迭代器和生成器将迭代的概念直接带入核心语言，并提供了一种机制来自定义 `[for...of](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of>)` 循环的行为。

若想了解更多详情，请参考：

- [迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)
- `[for...of](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of>)`
- `[function*](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*>)` 和 `[Generator](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator>)`
- `[yield](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/yield>)` 和 `[yield*](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/yield*>)`

## 迭代器

在 JavaScript 中，**迭代器**是一个对象，它定义一个序列，并在终止时可能返回一个返回值。 更具体地说，迭代器是通过使用 `next()` 方法实现 [Iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol) 的任何一个对象，该方法返回具有两个属性的对象： `value`，这是序列中的 next 值；和 `done` ，如果已经迭代到序列中的最后一个值，则它为 `true` 。如果 `value` 和 `done` 一起存在，则它是迭代器的返回值。

一旦创建，迭代器对象可以通过重复调用next（）显式地迭代。 迭代一个迭代器被称为消耗了这个迭代器，因为它通常只能执行一次。 在产生终止值之后，对next（）的额外调用应该继续返回{done：true}。Javascript中最常见的迭代器是Array迭代器，它只是按顺序返回关联数组中的每个值。 虽然很容易想象所有迭代器都可以表示为数组，但事实并非如此。 数组必须完整分配，但迭代器仅在必要时使用，因此可以表示无限大小的序列，例如0和无穷大之间的整数范围。

这是一个可以做到这一点的例子。 它允许创建一个简单的范围迭代器，它定义了从开始（包括）到结束（独占）间隔步长的整数序列。 它的最终返回值是它创建的序列的大小，由变量iterationCount跟踪。

```
function makeRangeIterator(start = 0, end = Infinity, step = 1) {
    let nextIndex = start;
    let iterationCount = 0;

    const rangeIterator = {
       next: function() {
           let result;
           if (nextIndex < end) {
               result = { value: nextIndex, done: false }
               nextIndex += step;
               iterationCount++;
               return result;
           }
           return { value: iterationCount, done: true }
       }
    };
    return rangeIterator;
}
```

使用这个迭代器看起来像这样：

```
let it = makeRangeIterator(1, 10, 2);

let result = it.next();
while (!result.done) {
 console.log(result.value); // 1 3 5 7 9
 result = it.next();
}

console.log("Iterated over sequence of size: ", result.value); // 5
```

反射性地知道特定对象是否是迭代器是不可能的。 如果您需要这样做，请使用 [Iterables](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_Generators#Iterables).

## 生成器函数

虽然自定义的迭代器是一个有用的工具，但由于需要显式地维护其内部状态，因此需要谨慎地创建。生成器函数提供了一个强大的选择：它允许你定义一个包含自有迭代算法的函数， 同时它可以自动维护自己的状态。 生成器函数使用 `[function*](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*>)`语法编写。 最初调用时，生成器函数不执行任何代码，而是返回一种称为Generator的迭代器。 通过调用生成器的下一个方法消耗值时，Generator函数将执行，直到遇到yield关键字。

可以根据需要多次调用该函数，并且每次都返回一个新的Generator，但每个Generator只能迭代一次。

我们现在可以调整上面的例子了。 此代码的行为是相同的，但实现更容易编写和读取。

```
function* makeRangeIterator(start = 0, end = Infinity, step = 1) {
    for (let i = start; i < end; i += step) {
        yield i;
    }
}
var a = makeRangeIterator(1,10,2)
a.next() // {value: 1, done: false}
a.next() // {value: 3, done: false}
a.next() // {value: 5, done: false}
a.next() // {value: 7, done: false}
a.next() // {value: 9, done: false}
a.next() // {value: undefined, done: true}
```

## 可迭代对象

若一个对象拥有迭代行为，比如在 `[for...of](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of>)` 中会循环哪些值，那么那个对象便是一个可迭代对象。一些内置类型，如 `[Array](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array>)` 或 `[Map](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Map>)` 拥有默认的迭代行为，而其他类型（比如`[Object](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object>)`）则没有。

为了实现**可迭代**，一个对象必须实现 **@@iterator** 方法，这意味着这个对象（或其[原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain)中的任意一个对象）必须具有一个带 `[Symbol.iterator](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator>)` 键（key）的属性。

可以多次迭代一个迭代器，或者只迭代一次。 程序员应该知道是哪种情况。 只能迭代一次的Iterables（例如Generators）通常从它们的**@@iterator**方法中返回它本身，其中那些可以多次迭代的方法必须在每次调用**@@iterator**时返回一个新的迭代器。

### 自定义的可迭代对象

我们可以像这样实现自己的可迭代对象：

```
var myIterable = {
  *[Symbol.iterator]() {
    yield 1;
    yield 2;
    yield 3;
  }
}

for (let value of myIterable) { 
    console.log(value); 
}
// 1
// 2
// 3

// 或者

[...myIterable]; // [1, 2, 3]
```

### 内置可迭代对象

`[String](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String>)`、`[Array](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array>)`、`[TypedArray](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray>)`、`[Map](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Map>)` 和 `[Set](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set>)` 都是内置可迭代对象，因为它们的原型对象都拥有一个 `[Symbol.iterator](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator>)` 方法。

### 用于可迭代对象的语法

一些语句和表达式专用于可迭代对象，例如 `[for-of](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of>)` 循环，`[展开语法](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_operator>)`，`[yield*](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/yield*>)` 和 `[解构赋值](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment>)`。

```
for (let value of ['a', 'b', 'c']) {
    console.log(value);
}
// "a"
// "b"
// "c"

[...'abc']; // ["a", "b", "c"]

function* gen() {
  yield* ['a', 'b', 'c'];
}

gen().next(); // { value: "a", done: false }

[a, b, c] = new Set(['a', 'b', 'c']);
a; // "a"
```

## 高级生成器

生成器会按需计算它们的产生值，这使得它们能够有效的表示一个计算成本很高的序列，甚至是如上所示的一个无限序列。

The `[next()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator/next>)` 方法也接受一个参数用于修改生成器内部状态。传递给 `next()` 的参数值会被yield接收。要注意的是，传给第一个 `next()` 的值会被忽略。

下面的是斐波那契数列生成器，它使用了 `next(x)` 来重新启动序列：

```
function* fibonacci() {
  var fn1 = 0;
  var fn2 = 1;
  while (true) {  
    var current = fn1;
    fn1 = fn2;
    fn2 = current + fn1;
    var reset = yield current;
    if (reset) {
        fn1 = 0;
        fn2 = 1;
    }
  }
}

var sequence = fibonacci();
console.log(sequence.next().value);     // 0
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 2
console.log(sequence.next().value);     // 3
console.log(sequence.next().value);     // 5
console.log(sequence.next().value);     // 8
console.log(sequence.next(true).value); // 0
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 2
```

你可以通过调用其 `[throw()](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator/throw>)` 方法强制生成器抛出异常，并传递应该抛出的异常值。这个异常将从当前挂起的生成器的上下文中抛出，就好像当前挂起的 `yield` 是一个 `throw value` 语句。

如果在抛出的异常处理期间没有遇到 `yield`，则异常将通过调用 `throw()` 向上传播，对 `next()` 的后续调用将导致 `done` 属性为 `true`。

生成器具有 `[return(value)](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator/return>)` 方法，返回给定的值并完成生成器本身。

