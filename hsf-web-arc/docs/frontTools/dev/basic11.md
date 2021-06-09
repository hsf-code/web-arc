---
title: JS技巧（二）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# forEach() 和 map() 的区别

forEach()和map()方法通常用于遍历Array元素，但几乎没有区别，我们来一一介绍。

## **1、返回值**

forEach()方法返回undefined ，而map()返回一个包含已转换元素的新数组。

```
const numbers = [1, 2, 3, 4, 5];

// 使用 forEach()
const squareUsingForEach = [];
numbers.forEach(x => squareUsingForEach.push(x*x));

// 使用 map()
const squareUsingMap = numbers.map(x => x*x);

console.log(squareUsingForEach);// [1, 4, 9, 16, 25]
console.log(squareUsingMap);// [1, 4, 9, 16, 25]
```

由于forEach()返回undefined，所以我们需要传递一个空数组来创建一个新的转换后的数组。map()方法不存在这样的问题，它直接返回新的转换后的数组。在这种情况下，建议使用map()方法。

## **2、链接其他方法**

map()方法输出可以与其他方法(如reduce()、sort()、filter())链接在一起，以便在一条语句中执行多个操作。

另一方面，forEach()是一个终端方法，这意味着它不能与其他方法链接，因为它返回undefined。

我们使用以下两种方法找出数组中每个元素的平方和：

```
onst numbers = [1, 2, 3, 4, 5];

// 使用 forEach()
const squareUsingForEach = []
let sumOfSquareUsingForEach = 0;
numbers.forEach(x => squareUsingForEach.push(x*x));
squareUsingForEach.forEach(square => sumOfSquareUsingForEach += square);

// 使用 map()
const sumOfSquareUsingMap = numbers.map(x => x*x).reduce((total, value) => total + value)
;

console.log(sumOfSquareUsingForEach);// 55
console.log(sumOfSquareUsingMap);// 55
```

当需要多个操作时，使用forEach()方法是一项非常乏味的工作。我们可以在这种情况下使用map()方法。

## **3、性能**

```
// Array:
var numbers = [];
for ( var i = 0; i < 1000000; i++ ) {
    numbers.push(Math.floor((Math.random() * 1000) + 1));
}

// 1. forEach()
console.time("forEach");
const squareUsingForEach = [];
numbers.forEach(x => squareUsingForEach.push(x*x));
console.timeEnd("forEach");

// 2. map()
console.time("map");
const squareUsingMap = numbers.map(x => x*x);
console.timeEnd("map");
```

这是在MacBook Pro的 **Google Chrome v83.0.4103.106（64位）** 上运行上述代码后的结果。建议复制上面的代码，然后在自己控制台中尝试一下。

```
forEach: 26.596923828125ms
map:     21.97998046875ms
```

显然，map()方法比forEach()转换元素要好。

## **4、中断遍历**

这两种方法都不能用 break 中断，否则会引发异常：

```
const numbers = [1, 2, 3, 4, 5];

// break; inside forEach()
const squareUsingForEach = [];
numbers.forEach(x => {
  if(x == 3) break;// <- SyntaxError
  squareUsingForEach.push(x*x);
});

// break; inside map()
const squareUsingMap = numbers.map(x => {
  if(x == 3) break;// <- SyntaxError
  return x*x;
});
```

上面代码会抛出 SyntaxError：

```
ⓧ Uncaught SyntaxError: Illegal break statement
```

如果需要中断遍历，则应使用简单的for循环或for-of/for-in循环。

```
const numbers = [1, 2, 3, 4, 5];

//break;insidefor-ofloop
const squareUsingForEach = [];
for(x of numbers){
  if(x == 3) break;
  squareUsingForEach.push(x*x);
};

console.log(squareUsingForEach);//[1,4]
```

## **5、最后**

建议使用map()转换数组的元素，因为它语法短，可链接且性能更好。

如果不想返回的数组或不转换数组的元素，则使用forEach() 方法。

最后，如果要基于某种条件停止或中断数组的便利，则应使用简单的for循环或for-of / for-in循环。



# ES6中常用的对象方法总结

## **1.ES6对象字面量**

### **1.1简化对象属性定义**

**验证(1):**

简化属性定义：

```
// ES5
function test(name, age) {
    return {
        name: name,
        age: age
    }
}
// 等价于
function test(name, age) {
    return {
        name,
        age
    }
}
```

当一个对象的属性和本地变量同名时，可以简单地中写属性名。

### **1.2 对象方法简写**

**验证(2)：**

对象方法可以简写，去掉冒号和function关键字：

```
// ES5
var person = {
    name: "Peter",
    age: 26,
    showAge: function () {
        console.log('age is', this.age)
    }
}
// 等价于
var person = {
    name: "Peter",
    age: 26,
    showAge() {
        console.log('age is', this.age)
    }
}
```

### **1.3同一个对象定义多个同名属性不报错**

**验证(3):**

同一个对象定义多个同名属性不报错

```
var person = {
    name:'Peter',
    name:'Tom'
}
console.log(person.name) // Tom
```

ES5在严格模式下会去校验是否有同名属性，ES6则无论在严格模型下，还是非严格模式下，都不会去校验属性是否重复。

## **2. [Object.is](http://Object.is)() 和Object.assing()**

### **2.1 [Object.is](http://Object.is)()**

有些像“===”运算符，可接受两个参数进行比较。如果两个参数的类型一致，并且值也相同，则返回true。

验证：

```
console.log(Object.is(1,"1")); // false 
Object.is()和===运算符的区别：

console.log(Object.is(+0, -0)); // false
console.log(+0 === -0); // true

console.log(Object.is(NaN, NaN)) // true
console.log(NaN === NaN) // false
```

### **2.2 Object.assign(target,source1,source2,...)**

返回第一个接收对象，可以接受任意个源对象，如果多个源对象有相同的属性，则后面的会覆盖前面的。

验证(1):

```
var target = {};
Object.assign(target, {
    name: 'tony',
    age: '24'
})
console.log(target) // {name: "tony", age: "24"}    
```

**验证(2):**

如果后面的多个源对象source1,source2有同名的属性，则后面的源对象会覆盖前面的

```
var target = {};
Object.assign(target, {
    name: 'tony',
    age: '24'
}, {
        age: '28'
    })
console.log(target) // {name: "tony", age: "28"}
```

**验证(3):**

```
  var target = {};
  function source() { }
  source.prototype = {
      constructor: source,
      hello: function () { console.log('hello~~') }
  }
  Object.assign(target, source.prototype)
  target.hello(); //hello~~   
```

**验证(4):**

忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。

```
var target = {};
var source1 = {
    age: '24'
}
function Person(name) {
    this.name = name;
}
Person.prototype.hello = function () {
    console.log(this.name)
}
var source2 = new Person("tony");
// 使用Object.defineProperty()为source2对象定义一个名为hobby的属性，且设定为可枚举的
Object.defineProperty(source2, "hobby", {
    enumerable: true,
    value: 'reading'
})

Object.assign(target, source1, source2)
console.log(target) // {age: "24", name: "tony", hobby: "reading"} 
```

**去掉上述enumerable属性（默认为false），再看下结果：**

```
var target = {};
var source1 = {
    age: '24'
}
function Person(name) {
    this.name = name;
}
Person.prototype.hello = function () {
    console.log(this.name)
}
var source2 = new Person("tony");
// 使用Object.defineProperty()为source2对象定义一个名为hobby的属性，且设定为不可枚举的
Object.defineProperty(source2, "hobby", {
    value: 'reading'
})

Object.assign(target, source1, source2)
console.log(target) // {age: "24", name: "tony"}    
```

可以看出Object.assign()会忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。

**【补充】有四个操作会忽略enumerable为false的属性，即不可枚举的属性：**

- for...in循环：只遍历对象自身的和继承的可枚举的属性。
- Object.keys()：返回对象自身的所有可枚举的属性的键名。
- JSON.stringify()：只串行化对象自身的可枚举的属性。
- Object.assign()：只拷贝对象自身的可枚举的属性。

## **3.定义了自身属性枚举顺序**

**自有属性枚举顺序的基本规则：**

- 1，所有数字键按升序排序；
- 2，所有字符串键按它们被加入对象的顺序排序；
- 3，所有symbol键按照它们被加入对象的顺序排序；

**验证(1)：**

可以用Object.getOwnPropertyNames(obj)方法查看对象自身的所有属性（不含Symbol属性，包含不可枚举属性）的键名。

```
var obj = {
    2: 1,
    name: 'tony',
    0: 1,
    age: '24',
    hobby: 'reading',
    1: 1
}
console.log(Object.getOwnPropertyNames(obj)) // ["0", "1", "2", "name", "age", "hobby"]
```

可以看出，字符串键是跟在数值键之后，数值键按升序排序，字符串键按加入对象的顺序排序。

【补充】：

ES6 一共有 5 种方法可以遍历对象的属性。

- for...in

for...in循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。

- Object.keys(obj)

Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。

- Object.getOwnPropertyNames(obj)

Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。

- Object.getOwnPropertySymbols(obj)

Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有 Symbol 属性的键名。

- Reflect.ownKeys(obj)

Reflect.ownKeys返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。

## **4.创建对象后修改对象原型：Object.setPrototypeOf()**

Object.setPrototypeOf()方法的作用：改变任意指定对象的原型，接受两个参数：

- - 被改变原型的对象
- - 替代第一个参数原型的对象

**验证(1):**

```
var dog = {
    hello() {
        console.log('a dog barks')
    }
}
var person = {
    hello() {
        console.log('say hello')
    }
}

// 以person为原型
var person1 = Object.create(person);
person1.hello(); // say hello
console.log(person.isPrototypeOf(person1)) // true

// 将person1的原型设置为dog
Object.setPrototypeOf(person1, dog)
person1.hello(); // a dog barks
console.log(person.isPrototypeOf(person1)) // false
console.log(dog.isPrototypeOf(person1)) // true
```

说明：person1的原型原本是person，通过Object.setPrototypeOf(person1,dog)后，把person1的原型设置为了dog。

## **5.super关键字**

ES5中，`this`关键字总是指向函数所在的当前对象。

ES6 中的关键字`super`，指向当前对象的原型对象。

**验证(1)：**

可以用`super`更方便地访问对象的原型，来引用对象原型上所有的方法。

ES5:

```
  var dog = {
      hello() {
          return 'a dog barks'
      }
  }
  var person = {
      hello() {
          return 'say hello'
      }
  }
  var friend = {
      hello() {
          let msg = Object.getPrototypeOf(this).hello.call(this)
          console.log(msg);
      }
  }
  Object.setPrototypeOf(friend, dog);
  friend.hello(); // a dog barks
  Object.setPrototypeOf(friend, person);
  friend.hello(); // say hello
```

Object.getPrototypeOf(this)就是指向对象的原型，ES6中可以用super替换：

```
Object.getPrototypeOf(this).hello.call(this)

// 等价于
super.hello()
var dog = {
    hello() {
        return 'a dog barks'
    }
}
var person = {
    hello() {
        return 'say hello'
    }
}
var friend = {
    hello() {
        let msg = super.hello()
        console.log(msg);
    }
}
Object.setPrototypeOf(friend, dog);
friend.hello(); // a dog barks
Object.setPrototypeOf(friend, person);
friend.hello(); // say hello
```

从结果可以看出效果是一样的。

**验证(2)**

必须要在简写方法的对象中使用super，其他地方声明中使用则会报语法错误。

```
Uncaught SyntaxError: 'super' keyword unexpected here
```

还是上面的示例：

```
 var dog = {
        hello() {
            return 'a dog barks'
        }
    }
    var person = {
        hello() {
            return 'say hello'
        }
    }
    var friend = {
        hello: function () {
            let msg = super.hello()
            console.log(msg);
        }
    }
    Object.setPrototypeOf(friend, dog);
    friend.hello();
    Object.setPrototypeOf(friend, person);
    friend.hello(); // Uncaught SyntaxError: 'super' keyword unexpected here
```

## **6.小结**

本节内容主要总结了ES6中对象的一些扩展。包括对象字面量上的变更、`Object.is()`（注意下和===的区别）、`Object.assign()`方法，对象自身属性的枚举属性的顺序、`Object.setPrototypeOf()`方法可以在创建对象后改变它的原型，以及可以通过super关键字调用对象原型的方法。

# ES6中常用的数组方法总结

## **1.创建数组**

### **1.1 ES5的方式**

回忆下ES5中创建数组的方式：

调用Array的构造函数，即

```
new Array()
new Array(size)
new Array(element0, element1, ..., elementn);
```

用数组字面量语法，例如：

```
var arr1 = [1,2,3];
```

其中，调用Array的构造函数时，要注意下面这三点：

- (1)如果传入了一个数组型的值，则数组的长度`length`属性会被设为该值，而数组的元素都是`undefined`;
- (2)如果传入了一个非数值型的值，则该值会被设为数组中的唯一项；
- (3)如果传入了多个值，则都被设为数组元素；

验证(1)

传入了一个数组型的值：

```
var arr = new Array(3);
console.log(arr); // [empty × 3]
console.log(arr.length); // 3
console.log(arr[0]); // undefined
console.log(arr[1]); // undefined
console.log(arr[2]); // undefined
```

验证(2)

传入了一个非数值型的值：

```
var arr = new Array("3");
console.log(arr); // ["3"]
console.log(arr.length); // 1
console.log(arr[0]); // 3
```

验证(3)

传入了多个值：

```
var arr = new Array(3,"3");
console.log(arr); // [3, "3"]
console.log(arr.length); // 2
console.log(arr[0]); // 3
console.log(arr[1]); // 3
```

可以看出，使用new Array()创建数组时，要特别注意传入一个值时，这个值的类型。而如果想就传入一个数值，且这个值就是数组中的唯一一个元素时，只能用数组字面量语法了。

Luckily，ES6中创建数组的方法就不需要考虑这么多，下面介绍`Array.of()`和`Array.from()`

### **1.2 ES6的方式**

### **1.2.1Array.of()**

针对上述问题，`Array.of()`就可以解决。不论传几个参数、是什么类型的参数，使用`Array.of()`会把所有传入的参数都被设为数组元素

验证(1)

传入了一个数组型的值：

```
let arr = Array.of(3);
console.log(arr); // [3]
console.log(arr.length); // 1
console.log(arr[0]); // 3
```

验证(2)

传入了一个非数值型的值：

```
let arr = Array.of("3");
console.log(arr); // ["3"]
console.log(arr.length); // 1
console.log(arr[0]); // 3
```

验证(3)

传入了多个值：

```
let arr = Array.of(3,"3");
console.log(arr); // [3, "3"]
console.log(arr.length); // 2
console.log(arr[0]); // 3
console.log(arr[1]); // 3
```

可以看出，使用`Array.of()`创建数组时，会把所有传入的参数都被设为数组元素。

### **1.2.2 Array.from()**

用途：可将类似数组的对象、可遍历的对象转为`真正的数组`。

要想把类似数组的对象转为数组，在ES5中的实现方法：

```
Array.prototype.slice.call(arrayLike);
let arrayLike = {
    '0': 'element0',
    '1': 'element1',
    '2': 'element2',
    length: 3
};
let arr = Array.prototype.slice.call(arrayLike); 
console.log(arr); // ["element0", "element1", "element2"]
```

可以说ES5的这种方法语义上不够清晰，在ES6中可以使用`Array.from()`方法实现：

验证：

```
let arrayLike = {
    0: 'element0',
    1: 'element1',
    2: 'element2',
    length: 3
};
let arr = Array.from(arrayLike); 
console.log(arr); // ["element0", "element1", "element2"]
```

Array.from()支持三个参数：

- 第一个参数是类数组对象或可遍历的对象；
- 第二个参数(可选)是一个函数，可以对一个参数中的对象中的每一个的值进行转换；
- 第三个参数(可选)是函数的this值。

其中，常见的类数组的对象是 ：DOM 操作返回的 `NodeList` 集合，以及函数内部的`arguments`对象。

所谓类似数组的对象，本质特征只有一点，即必须有`length`属性。因此，任何有length属性的对象，都可以通过Array.from方法转为数组。

可遍历的对象：含有`Symbol.iterator`属性的对象，如Set和Map

验证(1)

函数内的arguments对象，转换为数组：

```
function test(){
    let arr = Array.from(arguments);
    return arr;
}
let arr1 = test(1,2,3,4);
console.log(arr1); // [1, 2, 3, 4]
```

验证(2)

传入函数作为第二个参数，转换对象中的每个值

```
function test() {
    let arr = Array.from(arguments, val => val * 2);
    return arr;
}
let arr1 = test(1, 2, 3, 4);
console.log(arr1); // [2, 4, 6, 8]
```

验证(3)

可遍历对象转换为数组

```
let set = new Set(['a', 'b'])
console.log(Array.from(set)) // ['a', 'b']
```

## **2.查找元素**

ES5中可以用`indexOf`、`lastIndexOf()`查找某个值是否出现在字符串中。

ES6中可以用`find()`、`findIndex()`在数组中查找匹配的元素。

其中，`find()`方法是返回查找到的第一个值，而`findIndex()`是返回查找到的第一个值的index，即索引位置。这两个方法都接受两个参数：

- 第一个参数是回调函数；
- 第二个参数(可选)是用于指定回调函数中的this值。

验证：

find()返回的是满足条件的第一个值，findIndex()返回的是满足条件的第一个值的索引。

```
let arr = [1, 2, 3, 4, 5]
console.log(arr.find(item => item > 3)) // 4
console.log(arr.findIndex(item => item > 3)) // 3
```

## **3.填充数组**

### **3.1 fill()**

fill()：用指定的值填充一个到多个数组元素。

其中，当只传入一个值时，会用这个值重写数组中的所有值。

该方法接受三个参数：

- 第一个参数是要填充的值；
- 第二个参数(可选) 表示填充的开始索引；
- 第三个参数(可选) 表示结束索引的前一个索引。

验证(1)

只传入一个值

```
let arr = [1, 2, 3, 4, 5];
console.log(arr.fill(6)); // [6, 6, 6, 6, 6]
```

验证(2)

如果第二个参数或第三个参数为负值，可将值+数组.length来计算位置

```
let arr = [1, 2, 3, 4, 5];
console.log(arr.fill(6, -4, -1)); // [1,6,6,6,5]
```

上面第二个参数和第三个参数为负值，实际计算后的值分别为：-4+5，-1+5，即1,4。那么相当于arr.fill(6,1,4);从索引1到索引4前一个位置，即从索引1到索引3，用数值6填充，结果为：`[1,6,6,6,5]`

类似的方法还有`copyWithin()`方法

### **3.2 copyWithin()**

该方法也可接受三个参数：

- 第一个参数是开始粘贴值的索引位置
- 第二个参数(可选)是开始复制值的索引位置
- 第三个参数(可选)是停止复制值的位置（不包含当前位置）

注意：所有参数都可以是负值，处理方法和fill()一样，需加上arr.length来计算

验证(1)：

copyWithin()传入一个参数：

```
let arr = [1, 2, 3, 4, 5];
// 从索引位置2开始粘贴
// 1,2,3,4,5填充
console.log(arr.copyWithin(2)); // [1, 2, 1, 2, 3]
```

传入两个参数：

```
let arr = [1, 2, 3, 4, 5];
// 从索引位置2开始粘贴
// 从索引位置1开始复制 
// 2，3，4，5填充
// console.log(arr.copyWithin(2, 1)) // [1, 2, 2, 3, 4] 
```

传入三个参数：

```
let arr = [1, 2, 3, 4, 5];
// 从索引位置2开始粘贴
// 从索引位置1开始复制
// 到索引位置2之前结束复制，即到位置1
// 2填充
// console.log(arr.copyWithin(2, 1, 2)) // [1,2,2,4,5]
```

验证(2)：

参数传入负值

```
// 从索引位置-3+5 =2开始复制
// 从索引位置 -1+5=4之前结束复制，即到位置3
// 3,4填充
// 从索引位置2开始粘贴
console.log(arr.copyWithin(2,-3,-1)) // [1,2,3,4,5]
```

## **4.小结**

本文主要总结了ES6中数组部分的扩展。包括两个创建数组的新方法：`Array.of()`、`Array.from()。`两个在数组中根据条件来查找匹配的元素的方法：`find()`、`findIndex()`。还有两个填充数组的方法：`fill()`、`copyWithin()`。如有问题，欢迎指正。

# async 函数和 promises

JavaScript 的异步过程一直被认为是不够快的，更糟糕的是，在 NodeJS 等实时性要求高的场景下调试堪比噩梦。不过，这一切正在改变，这篇文章会详细解释我们是如何优化 V8 引擎（也会涉及一些其它引擎）里的 `async` 函数和 `promises` 的，以及伴随着的开发体验的优化。

**温馨提示：** 这里有个 视频：https://www.youtube.com/watch?v=DFP5DKDQfOc，你可以结合着文章看。

## **异步编程的新方案**

### **从 callbacks 到 promises，再到 async 函数**

在 promises 正式成为 JavaScript 标准的一部分之前，回调被大量用在异步编程中，下面是个例子：

```
function handler(done) {
  validateParams((error) => {
    if (error) return done(error);
    dbQuery((error, dbResults) => {
      if (error) return done(error);
      serviceCall(dbResults, (error, serviceResults) => {
        console.log(result);
        done(error, serviceResults);
      });
    });
  });
}
```

类似以上深度嵌套的回调通常被称为「回调黑洞」，因为它让代码可读性变差且不易维护。

幸运地是，现在 promises 成为了 JavaScript 语言的一部分，以下实现了跟上面同样的功能：

```
function handler() {
  return validateParams()
    .then(dbQuery)
    .then(serviceCall)
    .then(result => {
      console.log(result);
      return result;
    });
}
```

最近，JavaScript 支持了 async 函数，上面的异步代码可以写成像下面这样的同步的代码：

```
async function handler() {
  await validateParams();
  const dbResults = await dbQuery();
  const results = await serviceCall(dbResults);
  console.log(results);
  return results;
}
```

借助 async 函数，代码变得更简洁，代码的逻辑和数据流都变得更可控，当然其实底层实现还是异步。（注意，JavaScript 还是单线程执行，async 函数并不会开新的线程。）

### **从事件监听回调到 async 迭代器**

NodeJS 里 ReadableStreams 作为另一种形式的异步也特别常见，下面是个例子：

```
const http = require('http');

http.createServer((req, res) => {
  let body = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    res.write(body);
    res.end();
  });
}).listen(1337);
```

这段代码有一点难理解：只能通过回调去拿 chunks 里的数据流，而且数据流的结束也必须在回调里处理。如果你没能理解到函数是立即结束但实际处理必须在回调里进行，可能就会引入 bug。

同样很幸运，ES2018 特性里引入的一个很酷的 async 迭代器 可以简化上面的代码：

```
const http = require('http');

http.createServer(async (req, res) => {
  try {
    let body = '';
    req.setEncoding('utf8');
    for await (const chunk of req) {
      body += chunk;
    }
    res.write(body);
    res.end();
  } catch {
    res.statusCode = 500;
    res.end();
  }
}).listen(1337);
```

你可以把所有数据处理逻辑都放到一个 async 函数里使用 `for await…of` 去迭代 chunks，而不是分别在 `'data'` 和 `'end'` 回调里处理，而且我们还加了 `try-catch` 块来避免 `unhandledRejection` 问题。

以上这些特性你今天就可以在生成环境使用！async 函数**从 Node.js 8 (V8 v6.2 / Chrome 62) 开始就已全面支持**，async 迭代器**从 Node.js 10 (V8 v6.8 / Chrome 68) 开始支持**。

## **async 性能优化**

从 V8 v5.5 (Chrome 55 & Node.js 7) 到 V8 v6.8 (Chrome 68 & Node.js 10)，我们致力于异步代码的性能优化，目前的效果还不错，你可以放心地使用这些新特性。

https://mmbiz.qpic.cn/mmbiz_svg/PL5y7QQHZgKopY27ibGcHXReEyoDibicSeESMjS5z6sW2MibuH4mhNicnmxORRALpMwfib1iba0re7B3jpgUziaHFjDPAHqriaR7jaHLT/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

上面的是 doxbee 基准测试，用于反应重度使用 promise 的性能，图中纵坐标表示执行时间，所以越小越好。

另一方面，parallel 基准测试 反应的是重度使用 Promise.all() 的性能情况，结果如下：

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

`Promise.all` 的性能提高了**八倍**！

然后，上面的测试仅仅是小的 DEMO 级别的测试，V8 团队更关心的是 实际用户代码的优化效果。

https://mmbiz.qpic.cn/mmbiz_svg/PL5y7QQHZgKopY27ibGcHXReEyoDibicSeEH7s4FQFHOnXVQmxe0ibn9945h7kbG2EE72URJcSc07futxkvvicH8og0454I0ib8e31/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

上面是基于市场上流行的 HTTP 框架做的测试，这些框架大量使用了 promises 和 `async` 函数，这个表展示的是每秒请求数，所以跟之前的表不一样，这个是数值越大越好。从表可以看出，从 Node.js 7 (V8 v5.5) 到 Node.js 10 (V8 v6.8) 性能提升了不少。

性能提升取决于以下三个因素：

- TurboFan，新的优化编译器 🎉
- Orinoco，新的垃圾回收器 🚛
- 一个 Node.js 8 的 bug 导致 await 跳过了一些微 tick（microticks） 🐛

当我们在 Node.js 8 里 启用 TurboFan 的后，性能得到了巨大的提升。

同时我们引入了一个新的垃圾回收器，叫作 Orinoco，它把垃圾回收从主线程中移走，因此对请求响应速度提升有很大帮助。

最后，Node.js 8 中引入了一个 bug 在某些时候会让 `await` 跳过一些微 tick，这反而让性能变好了。这个 bug 是因为无意中违反了规范导致的，但是却给了我们优化的一些思路。这里我们稍微解释下：

```
const p = Promise.resolve();

(async () => {
  await p; console.log('after:await');
})();

p.then(() => console.log('tick:a'))
 .then(() => console.log('tick:b'));
```

上面代码一开始创建了一个已经完成状态的 promise `p`，然后`await` 出其结果，又同时链了两个 `then`，那最终的 `console.log` 打印的结果会是什么呢？

因为 `p` 是已完成的，你可能认为其会先打印 `'after:await'`，然后是剩下两个 `tick`, 事实上 Node.js 8 里的结果是：

https://mmbiz.qpic.cn/mmbiz_svg/PL5y7QQHZgKopY27ibGcHXReEyoDibicSeEw8vVGHsYZ2Qfzlc6RUsxmW3YD1y711Giaf2hNQyX8JzTGeDuvKUuX7z4PCl8ZDSaC/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

虽然以上结果符合预期，但是却不符合规范。Node.js 10 纠正了这个行为，会先执行 `then` 链里的，然后才是 async 函数。

https://mmbiz.qpic.cn/mmbiz_svg/PL5y7QQHZgKopY27ibGcHXReEyoDibicSeEtxuuicy37Z1b0QDOEtRNhFvffQaiauREVVHMh5LZOVbE7hEjWdv1bDnibTOic8jcI2RL/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

这个「正确的行为」看起来并不正常，甚至会让很多 JavaScript 开发者感到吃惊，还是有必要再详细解释下。在解释之前，我们先从一些基础开始。

### **任务（tasks）vs. 微任务（microtasks）**

从某层面上来说，JavaScript 里存在任务和微任务。任务处理 I/O 和计时器等事件，一次只处理一个。微任务是为了 `async`/`await` 和 promise 的延迟执行设计的，每次任务最后执行。在返回事件循环（event loop）前，微任务的队列会被清空。

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

可以通过 Jake Archibald 的 tasks, microtasks, queues, and schedules in the browser 了解更多。Node.js 里任务模型与此非常类似。

### **async 函数**

根据 MDN，async 函数是一个通过异步执行并隐式返回 promise 作为结果的函数。从开发者角度看，async 函数让异步代码看起来像同步代码。

一个最简单的 async 函数：

```
async function computeAnswer() {
  return 42;
}
```

函数执行后会返回一个 promise，你可以像使用其它 promise 一样用其返回的值。

```
const p = computeAnswer();
// → Promise

p.then(console.log);
// prints 42 on the next turn
```

你只能在下一个微任务执行后才能得到 promise `p` 返回的值，换句话说，上面的代码语义上等价于使用 `Promise.resolve` 得到的结果：

```
function computeAnswer() {
  return Promise.resolve(42);
}
```

async 函数真正强大的地方来源于 `await` 表达式，它可以让一个函数执行暂停直到一个 promise 已接受（resolved），然后等到已完成（fulfilled）后恢复执行。已完成的 promise 会作为 `await` 的值。这里的例子会解释这个行为：

```
async function fetchStatus(url) {
  const response = await fetch(url);
  return response.status;
}
```

`fetchStatus` 在遇到 `await` 时会暂停，当 `fetch` 这个 promise 已完成后会恢复执行，这跟直接链式处理 `fetch` 返回的 promise 某种程度上等价。

```
function fetchStatus(url) {
  return fetch(url).then(response => response.status);
}
```

链式处理函数里包含了之前跟在 `await` 后面的代码。

正常来说你应该在 `await` 后面放一个 `Promise`，不过其实后面可以跟任意 JavaScript 的值，如果跟的不是 promise，会被制转为 promise，所以 `await 42` 效果如下：

```
async function foo() {
  const v = await 42;
  return v;
}

const p = foo();
// → Promise

p.then(console.log);
// prints `42` eventually
```

更有趣的是，`await` 后可以跟任何 “thenable”，例如任何含有 `then`方法的对象，就算不是 promise 都可以。因此你可以实现一个有意思的 类来记录执行时间的消耗：

```
class Sleep {
  constructor(timeout) {
    this.timeout = timeout;
  }
  then(resolve, reject) {
    const startTime = Date.now();
    setTimeout(() => resolve(Date.now() - startTime),
               this.timeout);
  }
}

(async () => {
  const actualTime = await new Sleep(1000);
  console.log(actualTime);
})();
```

一起来看看 V8 规范 里是如何处理 `await` 的。下面是很简单的 async 函数 `foo`：

```
async function foo(v) {
  const w = await v;
  return w;
}
```

执行时，它把参数 `v` 封装成一个 `promise` ，然后会暂停直到`promise` 完成，然后 `w` 赋值为已完成的 `promise` ，最后 `async` 返回了这个值。

### **神秘的 `await`**

首先，V8 会把这个函数标记为可恢复的，意味着执行可以被暂停并恢复（从 `await` 角度看是这样的）。然后，会创建一个所谓的 `implicit_promise`（用于把 async 函数里产生的值转为 promise）。

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

然后是有意思的东西来了：真正的 `await`。首先，跟在 `await` 后面的值被转为 promise。然后，处理函数会绑定这个 promise 用于在 promise 完成后恢复主函数，此时 async 函数被暂停了，返回 `implicit_promise` 给调用者。一旦 `promise` 完成了，函数会恢复并拿到从 `promise` 得到值 `w`，最后，`implicit_promise` 会用 `w` 标记为已接受。

简单说，`await v` 初始化步骤有以下组成：

1. 把 `v` 转成一个 promise（跟在 `await` 后面的）。
2. 绑定处理函数用于后期恢复。
3. 暂停 async 函数并返回 `implicit_promise` 给掉用者。

我们一步步来看，假设 `await` 后是一个 promise，且最终已完成状态的值是 `42`。然后，引擎会创建一个新的 `promise` 并且把 `await` 后的值作为 resolve 的值。借助标准里的 PromiseResolveThenableJob这些 promise 会被放到下个周期执行。

https://mmbiz.qpic.cn/mmbiz_svg/PL5y7QQHZgKopY27ibGcHXReEyoDibicSeEzltVld5DpqyDRYNic7vhiaSBpLZP2YHkSkcYu7tLn1s1TSjd8uhzFYIYFAJkI5nokw/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

然后，引擎创建了另一个叫做 `throwaway` 的 promise。之所以叫这个名字，因为没有其它东西链过它，仅仅是引擎内部用的。`throwaway`promise 会链到含有恢复处理函数的 `promise` 上。这里 `performPromiseThen` 操作其实内部就是 Promise.prototype.then()。最终，该 async 函数会暂停，并把控制权交给调用者。

https://mmbiz.qpic.cn/mmbiz_svg/PL5y7QQHZgKopY27ibGcHXReEyoDibicSeEO2TUmMnENoicm4zaHAsY54GZ2Uv9v1eDneO0IZzcD3GsZDDE6YLibDyrKsAO8AicUic5/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

调用者会继续执行，最终调用栈会清空，然后引擎会开始执行微任务：运行之前已准备就绪的 PromiseResolveThenableJob，首先是一个 PromiseReactionJob，它的工作仅仅是在传递给 `await` 的值上封装一层 `promise`。然后，引擎回到微任务队列，因为在回到事件循环之前微任务队列必须要清空。

https://mmbiz.qpic.cn/mmbiz_svg/PL5y7QQHZgKopY27ibGcHXReEyoDibicSeErRfTUicANqxU62N3gcCD76Md8DQ6ExGqeQuRt5F4G2Mb9nA5v5WX6LhLQG3fFue0ia/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

然后是另一个 PromiseReactionJob，等待我们正在 `await`（我们这里指的是 `42`）这个 `promise` 完成，然后把这个动作安排到 `throwaway` promise 里。引擎继续回到微任务队列，因为还有最后一个微任务。

https://mmbiz.qpic.cn/mmbiz_svg/PL5y7QQHZgKopY27ibGcHXReEyoDibicSeEL3tuhDMkGecUz8ibSgx0gRw0jEZrS4fHN8lgib18GCiaPnpuibA3ka9ASyCIL1u2FDhl/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

现在这第二个 PromiseReactionJob 把决定传达给 `throwaway`promise，并恢复 async 函数的执行，最后返回从 `await` 得到的`42`。

https://mmbiz.qpic.cn/mmbiz_svg/PL5y7QQHZgKopY27ibGcHXReEyoDibicSeEInNtuJRia8Tyqhks2X3PC13iaDyQ9f5b5YiblxhAleTic34iaZPNItQkUJzuXbWW5JN9l/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

总结下，对于每一个 `await` 引擎都会创建**两个额外**的 promise（即使右值已经是一个 promise），并且需要**至少三个**微任务。谁会想到一个简单的 `await` 竟然会有如此多冗余的运算？！

https://mmbiz.qpic.cn/mmbiz_svg/PL5y7QQHZgKopY27ibGcHXReEyoDibicSeEzhlZy80AdHHd9fLCmWA6QSamGLFwACCbCgyVpSMSIxQBDH6nB1OccIrjU4TGgj7N/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

我们来看看到底是什么引起冗余。第一行的作用是封装一个 promise，第二行为了 resolve 封装后的 promose `await` 之后的值`v`。这两行产生个冗余的 promise 和两个冗余的微任务。如果 `v` 已经是 promise 的话就很不划算了（大多时候确实也是如此）。在某些特殊场景 `await` 了 `42` 的话，那确实还是需要封装成 promise 的。

因此，这里可以使用 promiseResolve 操作来处理，只有必要的时候才会进行 promise 的封装：

https://mmbiz.qpic.cn/mmbiz_svg/PL5y7QQHZgKopY27ibGcHXReEyoDibicSeEOt3fhjS0yEpc3zXNBQ56sCV5NMic9via2wxCGeWFAI8KAZFia6eBm1QgTia2UL66zW32/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

如果入参是 promise，则原封不动地返回，只封装必要的 promise。这个操作在值已经是 promose 的情况下可以省去一个额外的 promise 和两个微任务。此特性可以通过 `--harmony-await-optimization`参数在 V8（从 v7.1 开始）中开启，同时我们 向 ECMAScript 发起了一个提案，目测很快会合并。

下面是简化后的 `await` 执行过程：

https://mmbiz.qpic.cn/mmbiz_svg/PL5y7QQHZgKopY27ibGcHXReEyoDibicSeE5KmxI7icUOKQs7QM4hPQIHbTUNXcqRxoFPRZtysS41YsDibpxdrqrggWowZDRyHHSb/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

感谢神奇的 promiseResolve，现在我们只需要传 `v` 即可而不用关心它是什么。之后跟之前一样，引擎会创建一个 `throwaway` promise 并放到 PromiseReactionJob 里为了在下一个 tick 时恢复该 async 函数，它会先暂停函数，把自身返回给掉用者。

https://mmbiz.qpic.cn/mmbiz_svg/PL5y7QQHZgKopY27ibGcHXReEyoDibicSeEbbCv8Y1rNQyQdQuvmLtYQZKXNnpiaqJiaQqsND4NUe2q7ia9oS56JUlNnp72NoAnCsz/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

当最后所有执行完毕，引擎会跑微任务队列，会执行 PromiseReactionJob。这个任务会传递 `promise`结果给`throwaway`，并且恢复 async 函数，从 `await` 拿到 `42`。

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

尽管是内部使用，引擎创建 `throwaway` promise 可能还是会让人觉得哪里不对。事实证明，`throwaway`promise 仅仅是为了满足规范里 `performPromiseThen` 的需要。

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

这是最近提议给 ECMAScript 的 变更，引擎大多数时候不再需要创建`throwaway` 了。

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

对比 `await` 在 Node.js 10 和优化后（应该会放到 Node.js 12 上）的表现：

https://mmbiz.qpic.cn/mmbiz_svg/PL5y7QQHZgKopY27ibGcHXReEyoDibicSeEN682ILm8bePdkicicCuGC9hVKDkrHnk995kicZv7CukOtrSxPvIPJhH3p1Qfb0pMmBG/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

**async/await 性能超过了手写的 promise 代码**。关键就是我们减少了 async 函数里一些不必要的开销，不仅仅是 V8 引擎，其它 JavaScript 引擎都通过这个 补丁 实现了优化。

## **开发体验优化**

除了性能，JavaScript 开发者也很关心问题定位和修复，这在异步代码里一直不是件容易的事。Chrome DevTools 现在支持了异步栈追踪：

https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQS7OKGeypZFFc2fE8EMcFmNMaEEicQTqd29mM1ia98toCla6yEvAhJKJbGpNaAQicUarq0q2CZ56X4gw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

在本地开发时这是个很有用的特性，不过一旦应用部署了就没啥用了。调试时，你只能看到日志文件里的 `Error#stack` 信息，这些并不会包含任何异步信息。

最近我们搞的 零成本异步栈追踪 使得 `Error#stack` 包含了 async 函数的调用信息。「零成本」听起来很让人兴奋，对吧？当 Chrome DevTools 功能带来重大开销时，它如何才能实现零成本？举个例子，`foo` 里调用 `bar`，`bar` 在 await 一个 promise 后抛一个异常：

```
async function foo() {
  await bar();
  return 42;
}

async function bar() {
  await Promise.resolve();
  throw new Error('BEEP BEEP');
}

foo().catch(error => console.log(error.stack));
```

这段代码在 Node.js 8 或 Node.js 10 运行结果如下：

```
$ node index.js
Error: BEEP BEEP
    at bar (index.js:8:9)
    at process._tickCallback (internal/process/next_tick.js:68:7)
    at Function.Module.runMain (internal/modules/cjs/loader.js:745:11)
    at startup (internal/bootstrap/node.js:266:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:595:3)
```

注意到，尽管是 `foo()` 里的调用抛的错，`foo` 本身却不在栈追踪信息里。如果应用是部署在云容器里，这会让开发者很难去定位问题。

有意思的是，引擎是知道 `bar` 结束后应该继续执行什么的：即 `foo`函数里 `await` 后。恰好，这里也正是 `foo` 暂停的地方。引擎可以利用这些信息重建异步的栈追踪信息。有了以上优化，输出就会变成这样：

```
$ node --async-stack-traces index.js
Error: BEEP BEEP
    at bar (index.js:8:9)
    at process._tickCallback (internal/process/next_tick.js:68:7)
    at Function.Module.runMain (internal/modules/cjs/loader.js:745:11)
    at startup (internal/bootstrap/node.js:266:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:595:3)
    at async foo (index.js:2:3)
```

在栈追踪信息里，最上层的函数出现在第一个，之后是一些异步调用栈，再后面是 `foo` 里面 `bar` 上下文的栈信息。这个特性的启用可以通过 V8 的 `--async-stack-traces` 参数启用。

然而，如果你跟上面 Chrome DevTools 里的栈信息对比，你会发现栈追踪里异步部分缺失了 `foo` 的调用点信息。这里利用了 `await` 恢复和暂停位置是一样的特性，但 Promise#then() 或 Promise#catch()就不是这样的。可以看 Mathias Bynens 的文章 await beats Promise#then() 了解更多。

## **结论**

async 函数变快少不了以下两个优化：

- 移除了额外的两个微任务
- 移除了 `throwaway` promise

除此之外，我们通过 零成本异步栈追踪 提升了 `await` 和 `Promise.all()` 开发调试体验。

我们还有些对 JavaScript 开发者友好的性能建议：

多使用 `async` 和 `await` 而不是手写 `promise` 代码，多使用 JavaScript 引擎提供的 `promise` 而不是自己去实现。

