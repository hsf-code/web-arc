---
title: 对象
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---
# 对象

> Object对象是Javascript中的基本数据类型，笔者将围绕对象中三种创建方式分别在每种创建方式中通过实例介绍对象的一些特性及需注意的问题。

## 对象的三种类型介绍

- 内置对象，（String、Number、Boolean、Object、Function、Array）
- 宿主对象，由Javascript解释器所嵌入的宿主环境定义的，表示网页结构的HTMLElement对象均是宿主对象，也可以当成内置对象
- 自定义对象

## 创建对象的四种方法

- 对象字面量 `var obj = { a: 1 }`
- 使用new关键字构造形式创建 `var obj = new Object({ a: 1})`
- 原型（prototype）创建
- ES5的Object.create() 方法创建

### 1、对象字面量创建

#### 对象字面量是由若干个键／值对组成的映射表，整个映射表用{}包括起来

```js
var obj = { a: 1 };

console.log(obj.a);
```

#### 在ES6中增加了可计算属性名

这在一些业务场景中，如果key是预先不能定义的，可以向下面传入变量或者值进行动态计算

```js
var variable = 2;
var obj = {
    [1 + variable]: '我是一个可计算属性名'
}

console.log(obj); // {3: "我是一个可计算属性名"}
```

#### 对象的内容访问

对象值的存入方式是多种多样的，存入在对象容器中的是这些属性的名称，学过C的同学可以想象一下指针的引用，在js中可以理解为对象的引用。内容访问可以通过以下两种符号:

- `.` 指属性访问
- `[]` 指键访问

注意：对象中属性名永远必将是字符串，obj[2]看似2是整数，在对象属性名中数字是会被转换为字符串的

```js
var obj = {
    'a': '属性访问',
    2: '键访问'
}

console.log(obj.a); // 属性访问
console.log(obj[2]); // 键访问
```

### 2、使用new关键字构造形式创建

先介绍下new操作符构造对象的整个过程，这个很重要，明白之后有助于对后续的理解

#### new操作符构造对象过程

- 创建一个全新的对象
- 新对象会被执行prototype操作（prototype之后会写文章专门进行介绍，感兴趣的童鞋可以先关注下）
- 新对象会被绑定到函数调用的this
- 如果函数没有返回新对象，new表达式中的函数调用会自动返回这个新对象（对于一个构造函数，即使它内部没有return，也会默认返回return this）

看一道曾经遇到的面试题，如果在看本篇文章介绍之前，你能够正确理解并读出下面语句，那么恭喜你对这块理解很透彻

```js
var p = [2, 3];
var A = new Function();
    A.prototype = p;

console.log(A.prototype)

var a = new A;

console.log(a.__proto__)

a.push(1);

console.log(a.length); // 3
console.log(p.length); // 2
```

`new A` 时发生了什么?

1. 创建一个新的对象obj

```js
var obj = {}
```

​    2、新对象执行prototype操作，设置新对象的_proto_属性指向构造函数的A.prototype

```js
obj._proto_ = A.prototype
```

​    3、构造函数的作用域（this）赋值给新对象

```js
A.apply(obj)
```

​    4、返回该对象

​	上面示例中实例a已经不是一个对象，而是一个数组对象，感兴趣的童鞋可以在电脑上操作看下 `A.prototype` 和 `a.__proto__` 的实际输出结果

#### new操作符创建数组对象

数组属于内置对象，所以可以当作一个普通的键/值对来使用。

```js
var arr = new Array('a', 'b', 'c'); // 类似于 ['a', 'b', 'c']

console.log(arr[0]); // a
console.log(arr[1]); // b
console.log(arr[2]); // c 
console.log(arr.length); // 3

arr[3] = 'd';
console.log(arr.length); // 4
```

### 3、对象的create方法创建

Object.create(obj, [options])方法是ECMAScript5中定义的方法

- `obj` 第一个参数是创建这个对象的原型
- `options` 第二个为可选参数，用于描述对象的属性

#### null创建一个没有原型的新对象

```js
var obj = Object.create(null)

console.log(obj.prototype); // undefined
```

#### 创建一个空对象

以下 `Object.create(Object.prototype)` 等价于 `{}` 或 `new Object()`

```js
var obj = Object.create(Object.prototype)

console.log(obj.prototype); // {constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, …}
```

#### 创建原型对象

```js
var obj = Object.create({ a: 1, b: 2 })

console.log(obj.b); // 2 
```

### 4、原型prototype创建

​	除了 `null` 之外的每一个对象都从原型继承属性，关于javascript的原型之后会有一篇文章进行讲解，本次主要讨论对象的一些内容，所以在这里不做过多讨论

- new Object或者{}创建的对象，原型是 Object.prototype
- new Array创建的对象，原型是 Array.prototype
- new Date创建的对象，原型是 Date.prototype

总结：你通过那个构造函数创建的对象，其该对象的构造器是构造函数本身，其原型是构造函数的原型;

## 对象属性描述符

ES5之后才拥有了描述对象检测对象属性的方法

- 属性描述符含义
  - `{value: 1, writable: true, enumerable: true, configurable: true}`
  - `value` 属性值
  - `writable` 属性值是否可以修改
  - `enumerable` 是否希望某些属性出现在枚举中
  - `configurable` 属性是否可以配置，如果是可配置，可以结合 `Object.defineProperty()` 方法使用
- Object.getOwnPropertyDescriptor(obj, prop)
  - 获取指定对象的自身属性描述符
  - `obj` 属性对象
  - `prop` 属性名称

```js
var obj = { a: 1 }
var propertyDesc = Object.getOwnPropertyDescriptor(obj, 'a');

console.log(propertyDesc); // {value: 1, writable: true, enumerable: true, configurable: true}
```

- Object.defineProperty(obj, prop, descriptor)
  - 该方法会直接在一个对象上定义一个新属性，或者修改一个已经存在的属性， 并返回这个对象
  - `obj` 属性对象
  - `prop` 属性名称

```js
var obj = { a: 1 };

Object.defineProperty(obj, 'a', {
    writable: false, // 不可写
    configurable: false, // 设置为不可配置后将无法使用delete 删除
})

obj.a = 2;

console.log(obj.a); // 1

delete obj.a;

console.log(obj.a); // 1 
```

- Object.preventExtensions(obj)
  - 禁止一个对象添加新的属性
  - `obj` 属性对象

```js
var obj = { a: 1 };

Object.preventExtensions(obj)

obj.b = 2;

console.log(obj.b); // undefined
```

## 对象的存在性检测

区分对象中的某个属性是否存在

#### 操作符in检查

in操作符除了检查属性是否在对象中存在之外还会检查在原型是否存在

```js
var obj = { a: 1 };

console.log('a' in obj); // true
```

#### hasOwnProperty

```js
var obj = { a: 1 };

console.log(obj.hasOwnProperty('a')); // true
```

## 对象引用传递

> 对象属于引用类型是属性和方法的集合。引用类型可以拥有属性和方法，属性也可以是基本类型和引用类型。

> javascript不允许直接访问内存中的位置，不能直接操作对象的内存空间。实际上操作的是对象的引用，所以引用类型的值是按引用访问的。准确说引用类型的存储需要内存的栈区和堆区(堆内存)共同完成，栈区内保存变量标识符和指向堆内存中该对象的指针(也可以说该对象在堆内存中的地址)。

#### 引用类型示例分析

1. 引用类型比较

引用类型是按照引用访问的，因此对象(引用类型)比较的是堆内存中的地址是否一致，很明显a和b在内存中的地址是不一样的。

```javascript
const a = {};
const b = {};

a == b //false
```

1. 引用类型比较

下面对象d是对象c的引用，这个值d的副本实际上是一个指针，而这个指针指向堆内存中的一个对。因此赋值操作后两个变量指向了同一个对象地址，只要改变同一个对象的值另外一个也会发生改变。

```javascript
const c = {};
const d = c;

c == d //true

c.name = 'zhangsan';
d.age = 24;

console.log(c); //{name: "zhangsan", age: 24}
console.log(d); //{name: "zhangsan", age: 24}
```

#### 对象copy实现

- 利用json实现

可以利用JSON，将对象先序列化为一个JSON字符串，在用JSON.parse()反序列化，可能不是一种很好的方法，但能适用于部分场景

```js
const a = {
    name: 'zhangsan',
    school: {
        university: 'shanghai',
    }
};

const b = JSON.parse(JSON.stringify(a));

b.school.university = 'beijing';

console.log(a.school.university); // shanghai
console.log(b.school.university); // beijing
```

- es6内置方法

ES6内置的 `Object.assign(target,source1,source2, ...)` ，第一个参数是目标参数，后面是需要合并的源对象可以有多个，后合并的属性（方法）会覆盖之前的同名属性（方法），需要注意 `Object.assign()` 进行的拷贝是浅拷贝

```js
const obj1 = {a: {b: 1}};
const obj2 = Object.assign({}, obj1);
 
obj2.a.b = 3;
obj2.aa = 'aa';

console.log(obj1.a.b) // 3
console.log(obj2.a.b) // 3

console.log(obj1.aa) // undefined
console.log(obj2.aa) // aa
```

- 实现一个数组对象深度拷贝

> 对于下面这样一个复杂的数组对象，要做到深度拷贝(采用递归的方式)，在每次遍历之前创建一个新的对象或者数组，从而开辟一个新的存储地址，这样就切断了引用对象的指针联系。

```js
/**
 * [copy 深度copy函数]
 * @param { Object } elments [需要赋值的目标对象]]
 */
function copy(elments){
    //根据传入的元素判断是数组还是对象
    let newElments = elments instanceof Array ? [] : {};

    for(let key in elments){
        //注意数组也是对象类型，如果遍历的元素是对象，进行深度拷贝
        newElments[key] = typeof elments[key] === 'object' ? copy(elments[key]) : elments[key];
    }

    return newElments;
}
```

需要赋值的目标对象

```js
const a = {
    name: 'zhangsan',
    school: {
        university: 'shanghai',
    },
    hobby: ['篮球', '足球'],
    classmates: [
        {
            name: 'lisi',
            age: 22,
        },
        {
            name: 'wangwu',
            age: 21,
        }
    ]
};
```

测试验证，复制出来的对象b完全是一个新的对象，修改b的值，不会在对a进行影响。

```js
const b = copy(a);

b.age = 24;
b.school.highSchool = 'jiangsu';
b.hobby.push('🏃');
b.classmates[0].age = 25;

console.log(JSON.stringify(a)); 
//{"name":"zhangsan","school":{"university":"shanghai"},"hobby":["篮球","足球"],"classmates":[{"name":"lisi","age":22},{"name":"wangwu","age":21}]}
console.log(JSON.stringify(b));

//{"name":"zhangsan","school":{"university":"shanghai","highSchool":"jiangsu"},"hobby":["篮球","足球","🏃"],"classmates":[{"name":"lisi","age":25},{"name":"wangwu","age":21}],"age":24}
```





# 原型

> 原型是javascript的核心概念也是较难理解的，本篇主要介绍原型的一些概念，且与构造函数属性、构造函数方法的区别，最后结合Jquery与Zepto在实际工作中的应用进行分析介绍，希望对您有帮助。

## 原型概念

> 我们所创建的每个原型都有一个(原型)属性，这个属性是一个对象。

#### [原型模式的执行流程](https://www.nodejs.red/#/javascript/prototype?id=原型模式的执行流程)

1. 先查找构造函数实例里的属性或方法，如果有，立刻返回
2. 如果构造函数实例里没有，则去它的原型对象里找，如果有，就返回

#### [构造函数实例属性方法](https://www.nodejs.red/#/javascript/prototype?id=构造函数实例属性方法)

```js
function Box(name,age){
    this.name=name;     //实例属性
    this.age=age;
    this.run=function(){ //实例方法
        return this.name+this.age+"运行中.....";
    };
}

var box1=new Box('zhangsan',20);
var box2=new Box('lisi',18);
alert(box1.run==box2.run); //false
```

#### [构建原型属性方法](https://www.nodejs.red/#/javascript/prototype?id=构建原型属性方法)

构造函数体内什么都没有，这里如果有，叫作实例属性，实例方法

```js
function Box(){}
Box.prototype.name='lee'; //原型属性
Box.prototype.age=23;
Box.prototype.run=function(){//原型方法
    return this.name+this.age+"运行中......";
};
```

如果是实例化方法，不同的实例化，他们的地址是不一样的，是唯一的，如果是原型方法，那么他们地址是共享的，大家都一样，看以下示例`box1.run==box2.run`。

```js
var box1=new Box();
var box2=new Box();
alert(box1.run==box2.run);  // true
```

这个属性是一个对象，访问不到

```js
alert(box1.prototype);
```

这个属性是一个指针指向prototype原型对象

```js
 alert(box1.__proto__);
```

构造属性可以获取构造函数本身，作用是被原型指针定位，然后得到构造函数本身，其实就是对象实例对应的原型对象的作用

```js
alert(box1.constructor);
```

## [原型字面量创建对象](https://www.nodejs.red/#/javascript/prototype?id=原型字面量创建对象)

> 使用构造函数创建原型对象和使用字面量创建对象在使用上基本相同，但还是有一些区别，字面量创建的方式使用constructor属性不会指向实例，而会指向Object，构造函数则相反。

#### 字面量创建对象

```js
function Box(){}
```

使用字面量的方式创建原型对象，这里{}就是对象(Object),new Object就相当于{}

```js
Box.prototype={
    name:'lee',
    age:20,
    run:function(){
        return this.name+this.age+"运行中.......";
    }
};

var box1=new Box();
alert(box1.constructor);//返回function Object(){}对象
```

#### 构造函数创建对象

```js
function Box(name,age){
    this.name=name;
    this.age=age;
    this.run=function(){
        return this.name+this.age+"运行中....";
    };
}

var box1=new Box('zhangsan',20);
alert(box1.constructor); //返回的是function Box(){}
```

#### 原型对象的重写需要注意的问题

1. 重写原型对象之后，不会保存之前原型的任何信息
2. 把原来的原型对象和构造函数对象实例之间的关系切断了

```js
function Box(){}

Box.prototype={
    constructor:Box,//让它强制指向Box
    name:'lee',
    age:20,
    run:function(){
        return this.name+this.age+"运行中.......";
    }
};
```

重写原型

```js
Box.prototype={
    age:21
}
var box1=new Box();
alert(box1.name); // undefined
```

可以使用addstring()方法向原型添加内容，这样可以避免原型重写

```js
String.prototype.addstring=function(){
    return this+'，被添加了！';
};

var box1=new Box();
alert(box1.name.addstring()); // lee，被添加了！
```

## 原型图

![prototype](https://static.sitestack.cn/projects/CS-Interview-Knowledge-Map/72972e9791a4c241dac10edaeed47dcf.png)

每个函数都有 `prototype` 属性，除了 `Function.prototype.bind()`，该属性指向原型。

每个对象都有 `__proto__` 属性，指向了创建该对象的构造函数的原型。其实这个属性指向了 `[[prototype]]`，但是 `[[prototype]]` 是内部属性，我们并不能访问到，所以使用 `_proto_` 来访问。

对象可以通过 `__proto__` 来寻找不属于该对象的属性，`__proto__` 将对象连接起来组成了原型链。

如果你想更进一步的了解原型，可以仔细阅读 [深度解析原型中的各个难点](https://github.com/KieSun/Blog/issues/2)。



## 原型的实际应用

1. 先找到入口函数`window.$`
2. 根据入口函数找到构造函数`new ...`
3. 根据构造函数找到原型的定义`zepto.Z.prototype`

### 实例

以下实例中通过Jquery或Zepto操作dom元素，例如css方法、text方法都是操作的原型上的的方法。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Zepto</title>
    <!--<script src="https://cdn.bootcss.com/zepto/1.1.6/zepto.js"></script>
    <script src="zepto.js"></script>
    <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.js"></script> -->
    <script src="jquery.js"></script>
</head>
<body>
    <div> 这是一个测试 </div>
    <div> 这是一个测试2 </div>
    <script>
        var div = $('div'); // 得到一个实例
        div.css('color', 'red'); // 原型方法css
        alert(div.text()); // 原型方法text
    </script>
</body>
</html>
```

### zepto中原型的应用

Zepto源码地址：https://cdn.bootcss.com/zepto/1.1.6/zepto.js

以下实例也是取了关于原型部分的源码

```js
var Zepto = (function() {
    var $, zepto={}, emptyArray=[], slice=emptyArray.slice, document=window.document;

    // 构造函数
    zepto.Z = function(dom, selector) {
        dom = dom || []
        dom.__proto__ = $.fn
        dom.selector = selector || '';

        return dom
    }

    zepto.init = function(selector) {
        var dom;

        // 如果选择器不存在，返回一个空的Zepto集合
        if (!selector) return zepto.Z();

        // 优化字符串选择器
        if (typeof selector === 'string') {
            selector = selector.trim();

            // 还有一系列的判断此处忽略，进行简化 ...
            dom = slice.call(document.querySelectorAll(selector))
        } else {
            // 更多可以去查看源码 ...
        }

        return zepto.Z(dom, selector)
    }

    $ = function(selector) {
        return zepto.init(selector);
    } 

    $.fn = {
        text: function() {
            return (0 in this ? this[0].textContent : null)
        },
        css: function() {
            alert('css');
        }
    }

    // $.fn赋值给构造函数的原型
    zepto.Z.prototype = $.fn;

    return $;
})()

window.Zepto = Zepto;
window.$ === undefined && (window.$ = Zepto); // 如果window.$不存在，赋予window.$为Zepto;
```

### jquery中原型应用

Jquery源码地址：https://cdn.bootcss.com/jquery/3.3.1/jquery.js

```js
(function(global, factory) {
    // 浏览器环境、Node环境判断
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        // Node环境处理，这里不做阐述，具体参考源码
        // factory(global, true);
    } else {
        // 进入浏览器环境
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
    var Jquery = function(selector) {
        return new jQuery.fn.init(selector);
    }

    Jquery.fn = Jquery.prototype = {
        css: function() {
            alert('css');
        },
        text: function() {
            return (0 in this ? this[0].textContent : null);
        }
    };

    // 定义构造函数
    var init = Jquery.fn.init = function(selector) {
        var slice = Array.prototype.slice;
        var dom = slice.call(document.querySelectorAll(selector));

        var i, len=dom ? dom.length : 0;
        for (i=0; i<len; i++) {
            this[i] = dom[i];
        }
        this.length = len;
        this.selector = selector || '';
    }

    // 构造函数原型赋值
    init.prototype = Jquery.fn;

    if ( !noGlobal ) { // 判断是否为浏览器环境
        window.jQuery = window.$ = Jquery;
    }    
})
```

## 原型的扩展

1. 插件扩展在`$.fn`之上，并不是扩展在构造函数的原型
2. 对外开放的只有`$`，构造函数并没有开放

在Zepto中把原型方法放在$.fn上，在Jquery中把原型方法放在Jquery.fn之上，之所以这样做是为了后期插件扩展所需。

实例:

```html
<body>
    <script>
        // 插件扩展：获取tagName
        $.fn.getTagName = function() {
            return (0 in this ? this[0].tagName : '');
        }    
    </script>
    <div> 这是一个测试 </div>
    <div> 这是一个测试2 </div>
    <script>
        var div = $('div'); // 得到一个实例
        alert(div.getTagName()); // 封装的插件
    </script>
</body>
```

# 深浅拷贝

```js
let a = {    age: 1}
let b = a
a.age = 2
console.log(b.age) // 2
```

​	从上述例子中我们可以发现，如果给一个变量赋值一个对象，那么两者的值会是同一个引用，其中一方改变，另一方也会相应改变。

通常在开发中我们不希望出现这样的问题，我们可以使用浅拷贝来解决这个问题。

## 浅拷贝

首先可以通过 `Object.assign` 来解决这个问题。

```JavaScript
let a = {    age: 1}
let b = Object.assign({}, a)
a.age = 2
console.log(b.age) // 1
```

当然我们也可以通过展开运算符（…）来解决

```JavaScript
let a = {    age: 1}
let b = {...a}
a.age = 2
console.log(b.age) // 1
```

通常浅拷贝就能解决大部分问题了，但是当我们遇到如下情况就需要使用到深拷贝了

```JavaScript
let a = {    
    age: 1,    
    jobs: {        
        first: 'FE'    
    }}
let b = {...a}
a.jobs.first = 'native'
console.log(b.jobs.first) // native
```

浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话，那么就又回到刚开始的话题了，两者享有相同的引用。要解决这个问题，我们需要引入深拷贝。

## 深拷贝

这个问题通常可以通过 `JSON.parse(JSON.stringify(object))` 来解决。

```JavaScript
let a = {    
    age: 1,    
    jobs: {       
        first: 'FE'    
    }}
let b = JSON.parse(JSON.stringify(a))
a.jobs.first = 'native'
console.log(b.jobs.first) // FE
```

但是该方法也是有局限性的：

- 会忽略 `undefined`
- 会忽略 `symbol`
- 不能序列化函数
- 不能解决循环引用的对象

```JavaScript
let obj = {  
    a: 1, 
    b: {    
        c: 2,    d: 3,  
    },
}
obj.c = obj.b
obj.e = obj.a
obj.b.c = obj.c
obj.b.d = obj.b
obj.b.e = obj.b.c
let newObj = JSON.parse(JSON.stringify(obj))
console.log(newObj)
```

如果你有这么一个循环引用对象，你会发现你不能通过该方法深拷贝

![深浅拷贝 - 图1](https://static.sitestack.cn/projects/CS-Interview-Knowledge-Map/4a5d48954e964d64798ab875e734bf64.png)

在遇到函数、 `undefined` 或者 `symbol` 的时候，该对象也不能正常的序列化

```JavaScript
let a = {    
    age: undefined,    
    sex: Symbol('male'),    
    jobs: function() {},    
    name: 'yck'
}
let b = JSON.parse(JSON.stringify(a))
console.log(b) // {name: "yck"}
```

​	你会发现在上述情况中，该方法会忽略掉函数和 `undefined` 。

但是在通常情况下，复杂数据都是可以序列化的，所以这个函数可以解决大部分问题，并且该函数是内置函数中处理深拷贝性能最快的。当然如果你的数据中含有以上三种情况下，可以使用 [lodash 的深拷贝函数](https://lodash.com/docs#cloneDeep)。

如果你所需拷贝的对象含有内置类型并且不包含函数，可以使用 `MessageChannel`

```javascript
 function structuralClone(obj) { 
     return new Promise(resolve => {    
         const {port1, port2} = new MessageChannel();    
         port2.onmessage = ev => resolve(ev.data);    
         port1.postMessage(obj);  
     });
 }
var obj = {a: 1, b: {    c: b}}// 注意该方法是异步的// 可以处理 undefined 和循环引用对象(async () => {  const clone = await structuralClone(obj)})()
```

# 

# 继承

在 ES5 中，我们可以使用如下方式解决继承的问题

```js
function Super() {}
Super.prototype.getNumber = function() {  return 1}
function Sub() {}
let s = new Sub()
Sub.prototype = Object.create(Super.prototype, {  
    constructor: {    value: Sub,    enumerable: false,    writable: true,    configurable: true  }
})
```

以上继承实现思路就是将子类的原型设置为父类的原型

在 ES6 中，我们可以通过 `class` 语法轻松解决这个问题

```js
class MyDate extends Date {  
    test() {    
        return this.getTime()  
    }}
let myDate = new MyDate()myDate.test()
```

但是 ES6 不是所有浏览器都兼容，所以我们需要使用 Babel 来编译这段代码。

如果你使用编译过得代码调用 `myDate.test()` 你会惊奇地发现出现了报错

![继承 - 图1](https://static.sitestack.cn/projects/CS-Interview-Knowledge-Map/2b6a72bd0e00cd04cab33b40192c34b5.png)

因为在 JS 底层有限制，如果不是由 `Date` 构造出来的实例的话，是不能调用 `Date` 里的函数的。所以这也侧面的说明了：**ES6 中的 `class` 继承与 ES5 中的一般继承写法是不同的**。

既然底层限制了实例必须由 `Date` 构造出来，那么我们可以改变下思路实现继承

```js
function MyData() {}
MyData.prototype.test = function () {  
    return this.getTime()}
let d = new Date()
Object.setPrototypeOf(d, MyData.prototype)
Object.setPrototypeOf(MyData.prototype, Date.prototype)
```

以上继承实现思路：**先创建父类实例** => 改变实例原先的 `_proto__` 转而连接到子类的 `prototype` => 子类的 `prototype` 的 `__proto__` 改为父类的 `prototype`。

通过以上方法实现的继承就可以完美解决 JS 底层的这个限制。

# JS对象的方法

## **JSON.parse**

> JSON.parse(JSON.stringify(obj)) 常用来进行深拷贝，使用起来简单便利，但是大部分开发者在使用时往往会忽略其存在的问题

- 问题

1. 他无法实现对函数 、RegExp等特殊对象的克隆
2. 会抛弃对象的constructor,所有的构造函数会指向Object
3. 对象有循环引用,会报错

```jsx
// 构造函数
function person(pname) {
  this.name = pname;
}

const Messi = new person('Messi');

// 函数
function say() {
  console.log('hi');
};

const oldObj = {
  a: say,
  b: new Array(1),
  c: new RegExp('ab+c', 'i'),
  d: Messi
};

const newObj = JSON.parse(JSON.stringify(oldObj));

// 无法复制函数
console.log(newObj.a, oldObj.a); // undefined [Function: say]
// 稀疏数组复制错误
console.log(newObj.b[0], oldObj.b[0]); // null undefined
// 无法复制正则对象
console.log(newObj.c, oldObj.c); // {} /ab+c/i
// 构造函数指向错误
console.log(newObj.d.constructor, oldObj.d.constructor); // [Function: Object] [Function: person]
```

## **属性读取**

> cannot read property of undefined 是一个常见的错误，如果意外的得到了一个空对象或者空值，便会报错

- 数据结构

```js
const obj = {
  user: {
      posts: [
          { title: 'Foo', comments: [ 'Good one!', 'Interesting...' ] },
          { title: 'Bar', comments: [ 'Ok' ] },
          { title: 'Baz', comments: []}
      ],
      comments: []
  }
}
```

- && 短路运算符进行可访问性嗅探

```js
obj.user && obj.user.posts
```

- try...catch

```js
let result
try {
    result = obj.user.posts[0].comments
}
catch {
    result = null
}
```

- 提取方法 - reduce

```js
const getByReduce = (attrArr, resObj) =>{
  return  attrArr.reduce((res, key) => {
    return (res && res[key]) ? res[key] : null
  }, resObj)
}

console.log(getByReduce(['user', 'posts', 0, 'comments'], obj)) // [ 'Good one!', 'Interesting...' ]
console.log(getByReduce(['user', 'post', 0, 'comments'], obj)) // null
```

- 提取方法 - 柯理化

```js
const getByCurry = attrArr => {
  return resObj => {
    return attrArr.reduce((res, key) => {
      return res && res[key] ? res[key] : null;
    }, resObj);
  };
};

const getUserComments = getByCurry(['user', 'posts', 0, 'comments']);

console.log(getUserComments(obj)); // [ 'Good one!', 'Interesting...' ]
console.log(getUserComments({ user: { posts: [] } })); // null
```

## **原型污染**

> 通过原型可以将原型链上面的方式和属性进行污染

```js
let person = {name: 'lucas'}

console.log(person.name)

person.__proto__.toString = () => {alert('evil')}

console.log(person.name)

let person2 = {}

console.log(person2.toString())
```

- 解决
  - 冻结 `Object.prototype`，使原型不能扩充属性
  - 遇见 `constructor` 以及 `__proto__` 敏感属性，阻止其操作

## **JSONP**

> 实现一个jsonp，虽然现在jsonp还是存在部分的使用场景的，即使其只能支持get类型的请求等缺陷，但是还是需要掌握其整个流程是怎么样的以百度搜索为例，当在百度搜索时，当输入框的内容变化便会去搜素关键字，就是通过jsonp实现的

```js
function jsonp(url, callback, successCallback) {
  let script = document.createElement('script');
  script.src = url;
  script.async = true;
  script.type = 'text/javascript';

  window[callback] = function(data) {
    successCallback && successCallback(data);
  };

  document.body.appendChild(script);
}

jsonp(
  '<https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=1461,21119,18559,29522,29720,29567,29221&wd=%E5%88%98%E5%BE%B7%E5%8D%8E%20&bs=%E5%88%98%E5%BE%B7%E5%8D%8E&pbs=%E5%88%98%E5%BE%B7%E5%8D%8E&csor=4&pwd=%E5%88%98%E5%BE%B7%E5%8D%8E&cb=jQuery1102024053669643223596_1570162206732&_=1570162206766>',
  'jQuery1102024053669643223596_1570162206732',
  function(data) {
    console.log(data);
  }
);
```



## **toString**

> 返回一个表示该对象的字符串，当对象表示为文本值或以期望的字符串方式被引用时，toString方法被自动调用。

### **1. 手动调用看看什么效果**

嗯，跟介绍的一样，没骗人，全部都转成了字符串。

比较特殊的地方就是，表示对象的时候，变成`[object Object]`，表示数组的时候，就变成数组内容以逗号连接的字符串，相当于`Array.join(',')`。

```js
let a = {}
let b = [1, 2, 3]
let c = '123'
let d = function(){ console.log('fn') }

console.log(a.toString())   // '[object Object]'
console.log(b.toString())   // '1,2,3'
console.log(c.toString())   // '123'
console.log(d.toString())   // 'function(){ console.log('fn') }'
```

### **2. 最精准的类型判断**

这种属于更精确的判断方式，在某种场合会比使用 `typeof` & `instanceof` 来的更高效和准确些。

```js
toString.call(()=>{})       // [object Function]
toString.call({})           // [object Object]
toString.call([])           // [object Array]
toString.call('')           // [object String]
toString.call(22)           // [object Number]
toString.call(undefined)    // [object undefined]
toString.call(null)         // [object null]
toString.call(new Date)     // [object Date]
toString.call(Math)         // [object Math]
toString.call(window)       // [object Window]
```

### **3. 什么时候会自动调用呢**

使用操作符的时候，如果其中一边为对象，则会先调用`toSting`方法，也就是`隐式转换`，然后再进行操作。

```js
let c = [1, 2, 3]
let d = {a:2}
Object.prototype.toString = function(){
    console.log('Object')
}
Array.prototype.toString = function(){
    console.log('Array')
    return this.join(',')   // 返回toString的默认值（下面测试）
}
Number.prototype.toString = function(){
    console.log('Number')
}
String.prototype.toString = function(){
    console.log('String')
}
console.log(2 + 1)  // 3
console.log('s')    // 's'
console.log('s'+2)  // 's2'
console.log(c < 2)  // false        (一次 => 'Array')
console.log(c + c)  // "1,2,31,2,3" (两次 => 'Array')
console.log(d > d)  // false        (两次 => 'Object')
```

### **4. 重写`toString`方法**

既然知道了有 `toString` 这个默认方法，那我们也可以来重写这个方法

```js
class A {
    constructor(count) {
        this.count = count
    }
    toString() {
        return '我有这么多钱：' + this.count
    }
}
let a = new A(100)

console.log(a)              // A {count: 100}
console.log(a.toString())   // 我有这么多钱：100
console.log(a + 1)          // 我有这么多钱：1001
```

Nice.

## **valueOf**

> 返回当前对象的原始值。

具体功能与`toString`大同小异，同样具有以上的自动调用和重写方法。

这里就没什么好说的了，主要为两者间的区别，有请继续往下看🙊🙊

```js
let c = [1, 2, 3]
let d = {a:2}

console.log(c.valueOf())    // [1, 2, 3]
console.log(d.valueOf())    // {a:2}
```

## **两者区别**

- 共同点：在输出对象时会自动调用。
- 不同点：**默认返回值不同，且存在优先级关系**。

二者并存的情况下，在**数值**运算中，优先调用了`valueOf`，**字符串**运算中，优先调用了`toString`。

看代码方可知晓：

```js
class A {
    valueOf() {
        return 2
    }
    toString() {
        return '哈哈哈'
    }
}
let a = new A()

console.log(String(a))  // '哈哈哈'   => (toString)
console.log(Number(a))  // 2         => (valueOf)
console.log(a + '22')   // '222'     => (valueOf)
console.log(a == 2)     // true      => (valueOf)
console.log(a === 2)    // false     => (严格等于不会触发隐式转换)
```

结果给人的感觉是，如果转换为字符串时调用`toString`方法，如果是转换为数值时则调用`valueOf`方法。

但其中的 `a + '22'` 很不和谐，字符串合拼应该是调用`toString`方法。为了追究真相，我们需要更严谨的实验。

- 暂且先把 `valueOf` 方法去掉

```js
class A {
    toString() {
        return '哈哈哈'
    }
}
let a = new A()

console.log(String(a))  // '哈哈哈'     => (toString)
console.log(Number(a))  // NaN         => (toString)
console.log(a + '22')   // '哈哈哈22'   => (toString)
console.log(a == 2)     // false       => (toString)
```

- 去掉 `toString` 方法看看

```js
class A {
    valueOf() {
        return 2
    }
}
let a = new A()

console.log(String(a))  // '[object Object]'    => (toString)
console.log(Number(a))  // 2                    => (valueOf)
console.log(a + '22')   // '222'                => (valueOf)
console.log(a == 2)     // true                 => (valueOf)
```

发现有点不同吧？！它没有像上面 `toString` 那样统一规整。对于那个 `[object Object]`，我估计是从 `Object` 那里继承过来的，我们再去掉它看看。

```js
class A {
    valueOf() {
        return 2
    }
}
let a = new A()

Object.prototype.toString = null; 

console.log(String(a))  // 2        => (valueOf)
console.log(Number(a))  // 2        => (valueOf)
console.log(a + '22')   // '222'    => (valueOf)
console.log(a == 2)     // true     => (valueOf)
```

总结：`valueOf`偏向于运算，`toString`偏向于显示。

1. 在进行对象转换时，将优先调用`toString`方法，如若没有重写 `toString`，将调用 `valueOf` 方法；如果两个方法都没有重写，则按`Object`的`toString`输出。
2. 在进行**强转字符串类型**时，将优先调用 `toString` 方法，强转为数字时优先调用 `valueOf`。
3. 使用运算操作符的情况下，`valueOf`的优先级高于`toString`。

## **[Symbol.toPrimitive]**

> MDN：Symbol.toPrimitive 是一个内置的 Symbol 值，它是作为对象的函数值属性存在的，当一个对象转换为对应的原始值时，会调用此函数。

是不是有点懵？？？把它当做一个函数就行了~~

- 作用：同`valueOf()`和`toString()`一样，但是**优先级要高于这两者**；

- 该函数被调用时，会被传递一个字符串参数

  ```
  hint
  ```

  ，表示当前运算的模式，一共有三种模式：

  - string：字符串类型
  - number：数字类型
  - default：默认

下面来看看实现吧：

```js
class A {
    constructor(count) {
        this.count = count
    }
    valueOf() {
        return 2
    }
    toString() {
        return '哈哈哈'
    }
    // 我在这里
    [Symbol.toPrimitive](hint) {
        if (hint == "number") {
            return 10;
        }
        if (hint == "string") {
            return "Hello Libai";
        }
        return true;
    }
}

const a = new A(10)

console.log(`${a}`)     // 'Hello Libai' => (hint == "string")
console.log(String(a))  // 'Hello Libai' => (hint == "string")
console.log(+a)         // 10            => (hint == "number")
console.log(a * 20)     // 200           => (hint == "number")
console.log(a / 20)     // 0.5           => (hint == "number")
console.log(Number(a))  // 10            => (hint == "number")
console.log(a + '22')   // 'true22'      => (hint == "default")
console.log(a == 10)     // false        => (hint == "default")
```

比较特殊的是(+)拼接符，这个属于`default`的模式。

**划重点：此方法不兼容IE，尴尬到我不想写出来了~~**

