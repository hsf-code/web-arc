---
title: function
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---
# 函数

> 函数是由事件驱动的或者当它被调用时执行的可重复使用的代码块。

## 函数声明与函数表达式

> 对于**函数声明**解释器会首先读取，并使其在执行任何代码之前可用；对于**函数表达式**，则必须等到解释器执行到它所在的代码行，才会被真正解析。

例如下面例子，函数表达式test2必须声明在其调用之前才可用

```js
console.log(test1(1, 2)); // 3
console.log(test2(1, 2)); // test2 is not defined

//函数声明
function test1(a, b){
    return a + b;
}

//函数表达式
const test2 = function f(a, b){
    return a + b;
}
```

## 函数表达式实现一个阶乘函数

```js
const factorial = (function f(num){
    if(num <= 1){
        return 1;
    }else{
        return num * f(num -1);
    }
});

console.log(factorial(3)); // 6
```

## 内置函数

- **push()**

> 数组添加新值后的返回值，返回当前数组的Length。

`let a = [].push('test'); ` 输出`a`的值为`1`而不是`['test']`，因为`push()`返回的是数组的长度。

```javascript
let a  = [];
a.push('test');
console.log(a); //['test']
```

## arguments对象

​	系统内置的arguments对象，可以用于获取函数参数、参数长度等

> 面试：递归调用实现一个阶乘函数

下面程序最终输出结果为`6`，实现了一个`3 * 2 * 1`的阶乘函数，不明白之处，参考 [知乎讨论](https://www.zhihu.com/question/268265380/answer/335099064)

```javascript
function sum(num){
    if(num <= 1){

        //获取参数长度
        console.log('arguments.length: ', arguments.length);

        return 1;
    }else{
        return num * arguments.callee(num-1);
    }
}

console.log(sum(3));
```

## call和apply的使用与区别

- **apply使用情况**

```javascript
function box(num1,num2){
    return num1+num2;
}

function sum(num1,num2){
    //this 表示全局作用域，浏览器环境下window，node环境global，[]表示传递的参数
    return box.apply(this,[num1,num2]);

    //或者下面写法arguments可以当数组传递
    //return box.apply(this,arguments);
}

console.log(sum(10,10)); //输出结果: 20
```

- **call的使用示例**

```javascript
function box(num1,num2){
    return num1+num2;
}

function sum2(num1,num2){
    return box.call(this,num1,num2);
}

console.log(sum(10,10)); //输出结果: 20
```

***总结两种情况区别：\*** `apply`传递参数是按照数组传递，`call`是一个一个传递

## 引用传递

> javascript没有引用传递，如果传递的参数是一个值，是按值传递；如果传递的是一个对象，则传递的是一个对象的引用。

- **示例一：js代码按值传递**

如果按引用传递，那么函数里面的num会变成类似全局变量，最后输出60

```js
function box(num){ // 按值传递
    num+=10;
    return num;
}
var num=50;

console.log(box(num));  // 60
console.log(num);        // 50
```

- **示例二：php代码传递一个参数：**

php中的引用传递，会改变外部的num值，最后num也会输出60。

```js
function box(&$num){ 
    //加上&符号将num变成全局变量
    $num+=10;
    return $num;
}
$num = 50;
echo box($num);    // 60
echo $num;    // 60
```

- **示例三：js代码传递一个对象**

```js
function box(obj){ // 按对象传递
    obj.num+=10;

    return obj.num;
}
var obj = { num: 50 };

console.log(box(obj));  // 60
console.log(obj.num);    // 60
```

## 匿名函数与闭包

> 匿名函数就是没有名字的函数，闭包是可访问一个函数作用域里变量的函数，由于闭包作用域返回的局部变量资源不会被立刻销毁回收，所以可能会占用更多的内存。过度使用闭包会导致性能下降，建议在非常有必要的时候才使用闭包。

#### 匿名函数的自我执行

```js
(function(num){
        return num;
    })(1) //1
```

#### 函数里放一个匿名函数将会产生闭包

1. 使用局部变量实现累加功能。
2. 定义函数`test1`，返回一个匿名函数形成一个闭包
3. 将`test1`赋给`test2`，此时`test2`会初始化变量a，值为`test1`返回的匿名函数
4. 执行`test2()`

```js
{
function test1(){
    var a = 1;

    return function(){
        // a++;
        // return a;
        // 或以下写法
        return ++a;
    }
}

var test2 = test1();

console.log(test2()); // 2
console.log(test2()); // 3
console.log(test2()); // 4

//不能这样写,这样外层函数每次也会执行，从而age每次都会初始化
console.log(test1()()); // 2
console.log(test1()()); // 2
console.log(test1()()); // 2
}
```

#### 闭包中使用this对象将会导致的一些问题

> 在闭包中使用this对象也可能会导致一些问题，this对象是在运行时基于函数的执行环境绑定的，如果this在全局范围就是window，如果在对象内部就指向这个对象。而闭包却在运行时指向window的，因为闭包并不属于这个对象的属性或方法

**返回`object`**

```js
var box={
    getThis:function(){
        return this;
    }
}

console.log(box.getThis()); // { getThis: [Function: getThis] }
```

闭包中的`this`将返回全局对象，浏览器中`window`对象，`Node.js`中`global`对象，可以使用对象冒充或者赋值来解决闭包中`this`全局对象问题。

```js
var box={
    user: 'zs',
    getThis:function(){
        return function(){
            return this;   
        };
    }
}

console.log(box.getThis()());
```

**对象冒充**

```js
var box={
    user: 'zs',
    getThis:function(){
        return function(){
            return this;   
        };
    }
}

console.log(box.getThis().call(box)); // { user: 'zs', getThis: [Function: getThis] }
```

**赋值**

```js
var box={
    user: 'zs',
    getThis:function(){
        var that = this; // 此时的this指的是box对象
        return function(){
            return that.user;   
        };
    }
}

console.log(box.getThis()()); 
```

#### 一个例子看懂循环和闭包之间的关系

下例，循环中的每个迭代器在运行时都会给自己捕获一个i的副本，但是根据作用域的工作原理，尽管循环中的五个函数分别是在各个迭代器中分别定义的，但是它们都会被封闭在一个共享的全局作用域中，实际上只有一个i，结果每次都会输出6

```js
for(var i=1; i <= 5; i++){
    setTimeout(function(){
        console.log(i);
    })
}
```

解决上面的问题，在每个循环迭代中都需要一个闭包作用域，下面示例，循环中的每个迭代器都会生成一个新的作用域。

```js
for(var i=1; i <= 5; i++){
    (function(j){
        setTimeout(function(){
            console.log(j);
        })
    })(i)
}
```

也可以使用let解决，let声明，可以用来劫持块作用域，并且在这个块作用域中声明一个变量。

```js
for(let i=1; i <= 5; i++){
    setTimeout(function(){
        console.log(i);
    })
}
```

# 防抖

你是否在日常开发中遇到一个问题，在滚动事件中需要做个复杂计算或者实现一个按钮的防二次点击操作。

​	这些需求都可以通过函数防抖动来实现。尤其是第一个需求，如果在频繁的事件回调中做复杂计算，很有可能导致页面卡顿，不如将多次计算合并为一次计算，只在一个精确点做操作。

​	PS：防抖和节流的作用都是防止函数多次调用。区别在于，假设一个用户一直触发这个函数，且每次触发函数的间隔小于wait，防抖的情况下只会调用一次，而节流的 情况会每隔一定时间（参数wait）调用函数。

我们先来看一个袖珍版的防抖理解一下防抖的实现：

```js
// func是用户传入需要防抖的函数
// wait是等待时间
const debounce = (func, wait = 50) => {  
// 缓存一个定时器id 
let timer = 0  
// 这里返回的函数是每次用户实际调用的防抖函数  
// 如果已经设定过定时器了就清空上一次的定时器  
// 开始一个新的定时器，延迟执行用户传入的方法  
return function(...args) {    
    if (timer) 
        clearTimeout(timer)    
    timer = setTimeout(() => {      
        func.apply(this, args)    
    }, wait)  
}}
// 不难看出如果用户调用该函数的间隔小于wait的情况下，上一次的时间还未到就被清除了，并不会执行函数
```

​	这是一个简单版的防抖，但是有缺陷，这个防抖只能在最后调用。一般的防抖会有immediate选项，表示是否立即调用。这两者的区别，举个栗子来说：

- 例如在搜索引擎搜索问题的时候，我们当然是希望用户输入完最后一个字才调用查询接口，这个时候适用`延迟执行`的防抖函数，它总是在一连串（间隔小于wait的）函数触发之后调用。
- 例如用户给interviewMap点star的时候，我们希望用户点第一下的时候就去调用接口，并且成功之后改变star按钮的样子，用户就可以立马得到反馈是否star成功了，这个情况适用`立即执行`的防抖函数，它总是在第一次调用，并且下一次调用必须与前一次调用的时间间隔大于wait才会触发。

下面我们来实现一个带有立即执行选项的防抖函数

```js
// 这个是用来获取当前时间戳的
function now() {  
    return +new Date()
}
/** * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行 * * @param  {function} func        回调函数 * @param  {number}   wait        表示时间窗口的间隔 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数 * @return {function}             返回客户调用函数 */
function debounce (func, wait = 50, immediate = true) {  
    let timer, context, args 
    // 延迟执行函数  
    const later = () => setTimeout(() => {    
        // 延迟函数执行完毕，清空缓存的定时器序号    
        timer = null    
        // 延迟执行的情况下，函数会在延迟函数中执行    
        // 使用到之前缓存的参数和上下文    
        if (!immediate) {      
            func.apply(context, args)     
            context = args = null   
        }  
    }, wait)  
    // 这里返回的函数是每次实际调用的函数 
    return function(...params) {    
        // 如果没有创建延迟执行函数（later），就创建一个    
        if (!timer) {      
            timer = later()     
            // 如果是立即执行，调用函数      
            // 否则缓存参数和调用上下文      
            if (immediate) {       
                func.apply(this, params)      
            } else {       
                context = this        
                args = params      
            }    
// 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个    
            // 这样做延迟函数会重新计时    
        } else {     
            clearTimeout(timer)     
            timer = later()    
        }  
    }}
```

整体函数实现的不难，总结一下。

- 对于按钮防点击来说的实现：如果函数是立即执行的，就立即调用，如果函数是延迟执行的，就缓存上下文和参数，放到延迟函数中去执行。一旦我开始一个定时器，只要我定时器还在，你每次点击我都重新计时。一旦你点累了，定时器时间到，定时器重置为 `null`，就可以再次点击了。
- 对于延时执行函数来说的实现：清除定时器ID，如果是延迟调用就调用函数



# 节流

​	防抖动和节流本质是不一样的。防抖动是将多次执行变为最后一次执行，节流是将多次执行变成每隔一段时间执行。

```js
/** * underscore 节流函数，返回函数连续调用时，func 执行频率限定为 次 / wait * * @param  {function}   func      回调函数 * @param  {number}     wait      表示时间窗口的间隔 * @param  {object}     options   如果想忽略开始函数的的调用，传入{leading: false}。 *                                如果想忽略结尾函数的调用，传入{trailing: false} *                                两者不能共存，否则函数不能执行 * @return {function}             返回客户调用函数    */
_.throttle = function(func, wait, options) {    
    var context, args, result;    
    var timeout = null;    
    // 之前的时间戳    
    var previous = 0;   
    // 如果 options 没传则设为空对象    
    if (!options) options = {};   
    // 定时器回调函数    
    var later = function() {      
        // 如果设置了 leading，就将 previous 设为 0      
        // 用于下面函数的第一个 if 判断      
        previous = options.leading === false ? 0 : _.now();      
        // 置空一是为了防止内存泄漏，二是为了下面的定时器判断      
        timeout = null;     
        result = func.apply(context, args);      
        if (!timeout) 
            context = args = null;    
    };    
    return function() {      
        // 获得当前时间戳      
        var now = _.now();      
        // 首次进入前者肯定为 true     
        // 如果需要第一次不执行函数     
        // 就将上次时间戳设为当前的     
        // 这样在接下来计算 remaining 的值时会大于0      
        if (!previous && options.leading === false) 
            previous = now;     
        // 计算剩余时间      
        var remaining = wait - (now - previous);      
        context = this;     
        args = arguments;      
        // 如果当前调用已经大于上次调用时间 + wait     
        // 或者用户手动调了时间      
        // 如果设置了 trailing，只会进入这个条件      
        // 如果没有设置 leading，那么第一次会进入这个条件      
        // 还有一点，你可能会觉得开启了定时器那么应该不会进入这个 if 条件了      
        // 其实还是会进入的，因为定时器的延时      
        // 并不是准确的时间，很可能你设置了2秒      
        // 但是他需要2.2秒才触发，这时候就会进入这个条件     
        if (remaining <= 0 || remaining > wait) {       
            // 如果存在定时器就清理掉否则会调用二次回调        
            if (timeout) {          
                clearTimeout(timeout);          
                timeout = null;        
            }        
            previous = now;        
            result = func.apply(context, args);        
            if (!timeout) 
                context = args = null;      
        } else if (!timeout && options.trailing !== false) {       
            // 判断是否设置了定时器和 trailing        
            // 没有的话就开启一个定时器        
            // 并且不能不能同时设置 leading 和 trailing        
            timeout = setTimeout(later, remaining);      
        }      
        return result;   
    };  
};
```

# 函数其他

## **Apply**

> apply的作用是修改调用函数的当前执行上下文，在理解其作用的基础上思考模拟实现apply的大概思路，更有助于个人成长，切勿不理解时死记硬背一些代码片段

```jsx
Function.prototype._apply = function (targetObject, argsArray) {
  // 若是没有传递，则置为空数组
  if(typeof argsArray === 'undefined' || argsArray === null) {
    argsArray = []
  }

  // 是否传入执行上下文，若没有指定，则指向 window
  if(typeof targetObject === 'undefined' || targetObject === null){
      targetObject = window
  }

  // 利用Symbol的特性，设置为key
  const targetFnKey = Symbol('key')
  // 将调用_apply的函数赋值
  targetObject[targetFnKey] = this
  // 执行函数，并在删除之后返回
  const result = targetObject[targetFnKey](...argsArray)
  delete targetObject[targetFnKey]
  return result
}
```

> 使用Symbol作为key，是为了防止重复，例如targetFnKey设置为cb，当传入的targetObject自身拥有cb这个方法，就会导致执行之后便呗delete，导致问题

## **New**

- 执行过程
  1. 创建一个空对象，作为将要返回的对象实例
  2. 将这个空对象的原型指向构造函数的prototype属性
  3. 将这个空对象赋值给函数内部的this
  4. 执行构造函数内部代码

```javascript
function _new(/* 构造函数 */ constructor, /* 构造函数参数 */ params) {
  // 将 arguments 对象转为数组
  var args = [].slice.call(arguments);
  // 取出构造函数
  var constructor = args.shift();
  // 创建一个空对象，继承构造函数的 prototype 属性
  var context = Object.create(constructor.prototype);
  // 执行构造函数
  var result = constructor.apply(context, args);
  // 如果返回结果是对象，就直接返回，否则返回 context 对象
  return (typeof result === 'object' && result != null) ? result : context;
}
```

> 在理解new的原理，需要补充两个小的知识点

1. new.target, 函数内部可以使用它，如果当前函数是使用 new进行调用，那么new.target指向当前函数，否则为undefined

```javascript
function NewTargetTest() {
  console.log(new.target === NewTargetTest)
}

NewTargetTest() // false
new NewTargetTest() // true
```

1. 构造函数隐藏的return

- 构造函数会默认返回构造后的this对象

```js
function ReturnTest(name) {
  this.name = name
}

const returnText = new ReturnTest('wy')
console.log(returnText.name) // wy
```

- 将上面的代码稍加改造，显示的返回一个空对象{},此时会覆盖默认返回的this对象

```js
function ReturnTest(name) {
  this.name = name
  return {}
}

const returnText = new ReturnTest('wy')
console.log(returnText.name) // undefined
```

- 将上面的代码稍加改造，显示的返回一个基本类型的数据，此时将不会影响构造函数返回的this对象

```js
function ReturnTest(name) {
  this.name = name
  return 'test'
}

const returnText = new ReturnTest('wy')
console.log(returnText.name) // wy
```

> 总结：在构造函数中，若显示的返回一个对象，则会覆盖默认的this对象，基本数据类型则不会

## **单例模式**

> 单例模式是一种常见的设计模式，单例模式能够保证一个类仅有唯一的实例，并提供一个全局访问点，可以很好节省内存。在js中，可以结合必包实现

```js
function Animal(name) {
  this.name = name
}

const AnimalSingle = (function () {
  let animalSingle = null
  
  return function (name) {
    if(animalSingle){
      return animalSingle
    }
    return animalSingle = new Animal(name)
  }
})();

const animal1 = new AnimalSingle('dog')
const animal2 = new AnimalSingle('cat')

console.log(animal1.name); // dog
console.log(animal2.name); // dog
```

> Animal只会被实例化一次，且之后的每次的实例化都会返回第一次的。

## **compose**

> compose 是函数式编程中很重要的函数之一， 因为其巧妙的设计而被广泛使用。compose函数的作用就是组合函数的，将函数串联起来执行，将多个函数组合起来，一个函数的输出结果是另一个函数的输入参数，一旦第一个函数开始执行，就会像多米诺骨牌一样推导执行了

- lodash 版本

```js
var compose = function(funcs) {
    var length = funcs.length
    var index = length
    while (index--) {
        if (typeof funcs[index] !== 'function') {
            throw new TypeError('Expected a function');
        }
    }
    return function(...args) {
        var index = 0
        var result = length ? funcs.reverse()[index].apply(this, args) : args[0]
        while (++index < length) {
            result = funcs[index].call(this, result)
        }
        return result
    }
}
```

- Redux 版本

```js
function compose(...funcs) {
    if (funcs.length === 0) {
        return arg => arg
    }

    if (funcs.length === 1) {
        return funcs[0]
    }

    return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

- 测试代码

```js
function composeReduce1(arg) {
  console.log('composeReduce1', arg);
  return 'composeReduce1'
}
function composeReduce2(arg) {
  console.log('composeReduce2', arg);
  return 'composeReduce2'
}
function composeReduce3(arg) {
  console.log('composeReduce3',arg);
}

// lodash版本的 compose参数是一个数组 [composeReduce1, composeReduce2, composeReduce3]
let composeChild = compose(composeReduce1, composeReduce2, composeReduce3)
composeChild('init')

// 输出
// composeReduce3 init
// composeReduce2 composeReduce3
// composeReduce1 composeReduce2
```

## 

## **面试题分析**

以下几道大厂必考的面试题，完美呈现出 `toString` 与 `valueOf` 的作用。

### **1. a===1&&a===2&&a===3 为 true**

双等号(==)：会触发`隐式类型转换`，所以可以使用 `valueOf` 或者 `toString` 来实现。

每次判断都会触发`valueOf`方法，同时让`value+1`，才能使得下次判断成立。

```js
class A {
    constructor(value) {
        this.value = value;
    }
    valueOf() {
        return this.value++;
    }
}
const a = new A(1);
if (a == 1 && a == 2 && a == 3) {
    console.log("Hi Libai!");
}
```

全等(===)：严格等于不会进行`隐式转换`，这里使用 `Object.defineProperty` 数据劫持的方法来实现

```js
let value = 1;
Object.defineProperty(window, 'a', {
    get() {
        return value++
    }
})
if (a === 1 && a === 2 && a === 3) {
    console.log("Hi Libai!")
}
```

上面我们就是劫持全局`window`上面的`a`，当`a`每一次做判断的时候都会触发`get`属性获取值，并且每一次获取值都会触发一次函数实行一次自增，判断三次就自增三次，所以最后会让公式成立。

- 注：`defineProperty` 可参考这篇文章学习，点我进入传送门
- 自：大厂面试题分享：如何让(a===1&&a===2&&a===3)的值为true?

### **2. 实现一个无限累加函数**

问题：用 JS 实现一个无限累加的函数 `add`，示例如下：

```js
add(1); // 1
add(1)(2);  // 3
add(1)(2)(3)； // 6
add(1)(2)(3)(4)； // 10 

// 以此类推
function add(a) {
    function sum(b) { // 使用闭包
        a = b ? a + b : a; // 累加
        return sum;
    }
    sum.toString = function() { // 只在最后一次调用
        return a;
    }
    return sum; // 返回一个函数
}

add(1)              // 1
add(1)(2)           // 3
add(1)(2)(3)        // 6
add(1)(2)(3)(4)     // 10 
```

- `add`函数内部定义`sum`函数并返回，实现连续调用
- `sum`函数形成了一个闭包，每次调用进行累加值，再返回当前函数`sum`
- `add()`每次都会返回一个函数`sum`，直到最后一个没被调用，默认会触发`toString`方法，所以我们这里重写`toString`方法，并返回累计的最终值`a`

这样说才能理解:

`add(10)`: 执行函数`add(10)`，返回了`sum`函数，注意这一次没有调用`sum`，默认执行`sum.toString`方法。所以输出`10`；

`add(10)(20)`: 执行函数`add(10)`，返回sum(此时a为10)，再执行`sum(20)`，此时`a为30`，返回`sum`，最后调用`sum.toString()`输出`30`。add(10)(20)...(n)依次类推。

### **3. 柯里化实现多参累加**

这里是上面累加的升级版，实现多参数传递累加。

```js
add(1)(3,4)(3,5)    // 16
add(2)(2)(3,5)      // 12
function add(){
    // 1 把所有参数转换成数组
    let args = Array.prototype.slice.call(arguments)
    // 2 再次调用add函数，传递合并当前与之前的参数
    let fn = function() {
        let arg_fn = Array.prototype.slice.call(arguments)
        return add.apply(null, args.concat(arg_fn))
    }
    // 3 最后默认调用，返回合并的值
    fn.toString = function() {
        return args.reduce(function(a, b) {
            return a + b
        })
    }
    return fn
}

// ES6写法
function add () {
    let args = [...arguments];
    let fn = function(){
        return add.apply(null, args.concat([...arguments]))
    } 
    fn.toString = () => args.reduce((a, b) => a + b)
    return fn;
}
```



# JavaScript 函数执行机制

## 一、作用域&上下文

### 1、 作用域

作用域就是JS函数和变量的可访问范围，分为全局作用域、局部作用域和块级作用域。全局作用域是整个程序都能访问到的区域，web环境下为window对象，node环境下为Global对象。局部作用域也就是函数作用域，在函数内部形成一个独立的作用域，函数执行结束就销毁，函数内部的变量只能在函数内部访问。块级作用域，使用let或const关键字声明变量之后，会生成块级作用域，声明的变量只在这个块中有效，并且在这个块中let或const声明的变量必须先声明后使用。

```js
var a = 10; // 全局变量
if (true) {
    console.log(b) // error 必须先定义后使用
    let b = 20; // 块内变量
    console.log(b) // 20
    console.log(a) // 10
}
console.log(a) // 10
console.log(b) // error not defined
function add (a, b) {
    var c = 0; // 局部变量
    console.log(c) // 0
    return a + b + c;
}
console.log(c) // error not defined
```

当JS引擎检测到有块级作用域产生时，系统会生成一个**暂时性死区**，存储所有let或const声明的变量名。当访问暂时性死区中保存的变量时，系统会抛出错误，提示需要先声明再使用，当碰到变量声明语句时，声明变量，并从暂时性死区中删除该变量，后面就能正常访问了。

### 2、上下文

context上下文代表代码执行中this代表的值，JS函数中的this总是指向调用这个函数的对象；使用call，apply，bind等修改this指向的除外。

## 二、函数执行

1. 执行期上下文执行期上下文是在函数执行的时候生成的，定义了函数在执行时，函数内部生成的代表当前执行函数的具体信息。产生执行期上下文第一步是**创建激活对象**AO（Activation Object）将AO保存到作用域链的顶端设置上下文 this 的值在AO创建之后，在函数开始执行之前，需要将函数内部可访问的变量在AO中进行声明和必要的初始化将函数内部定义的**变量以及函数参数**放入AO中，**初始值为undefined**。将函数的**实际参数赋值**给AO中的变量。将**函数内部声明的函数**放入到AO中，初始值为 函数本身。看一个例子：

```js
function add (a, b) {
    debugger
    var temp1 = 100;
    function validateNum (n) {
        return typeof n === "number";
    }
    var validateNum = 100;
    return a + b;
}
console.log(add(1, 2))
```

![图片](https://mmbiz.qpic.cn/mmbiz_png/ndgH50E7pIo1WhHBvzt1rWZEst4OSRNhmAZWDBWPYTic4rqeHale13ZlnEgBtBJibSIHmy6tPbiaJoQl9pQJC9Vcw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)可以看到，在函数开始执行时，函数的实际参数会提前赋值给对应的变量，但是函数内部声明的变量的值则被初始化为undefined 。

\2. 作用域链上面说到，JS内部是分为很多个作用域的，其中函数内部能访问的变量有很多，那这些变量又是从哪里来的，其中包含哪些作用域里的变量呢？这个问题需要从作用域链着手。在JS中，采用的是词法作用域，在函数声明时，它的作用域就已经确定了，不会再改变，函数的作用域保存在[[scope]]变量中，仅供JS引擎调用，我们从最简单的例子来看函数作用域包含些什么：

```js
function add (a: number, b: number): number {
    return a + b;
}
```

Add 函数生成的作用域包含如下：![图片](https://mmbiz.qpic.cn/mmbiz_png/ndgH50E7pIo1WhHBvzt1rWZEst4OSRNhQR3sIvmHZT2cSqRTrkT839qy9b09syGRjypNrsGunVr67ibZr8nGiagw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)可以看到，函数的作用域[[scope]]是一个数组，里面包含一个window对象，即全局对象。如果函数不是直接在全局作用域中定义，生成的作用域又是什么样子呢？

```js
function add (a, b) {
    function validateNum (n) {
        console.log(a, b)
        return typeof n === "number";
    }
    debugger
    if (!validateNum(a) || !validateNum(b)) {
    throw new Error('type error');
    }
    return a + b;
}
console.log(add(1,2))
console.log(add(2,3))
```

![图片](https://mmbiz.qpic.cn/mmbiz_png/ndgH50E7pIo1WhHBvzt1rWZEst4OSRNhM8UUM1fPLfYVoh8sSslria5RiaAZRUeQYTiboMw3vVMz522nH1oBKw3qg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)从上图能看出，函数的作用域[[scope]]中包含两个对象，一个是全局对象，一个是add函数内部的值。由此可知，函数作用域的生成是基于函数定义环境的，它会保存定义时当前环境的数据。经过上面的过程，我们能够整理出整个函数执行的过程：![图片](https://mmbiz.qpic.cn/mmbiz_png/ndgH50E7pIo1WhHBvzt1rWZEst4OSRNh3pD7wotAakyHCLWLGNSLt9hmyEM9Mic8Lg1icQKfcEz0zqLLEdTiaFPSw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)可以看到validateNum函数的作用域链上保存了函数可以访问的全部变量或函数，首先是自己生成的激活对象AO内的变量，包含函数内部定义的变量和函数以及实参变量

## 二、函数执行结束，内存释放

函数执行结束之后，函数释放自己执行时创建的激活对象AO，在一段时间之后AO对象以及内部的变量会被当作垃圾回收掉，释放内存空间。validateNum 函数执行完之后， validateNum AO 被释放，但是[[scope]]属性仍然存在validateNum函数对象中。Add 函数执行结束之后，add AO 对象被释放，AO对象中validateNum函数也被释放，但是add函数的仍然存在。最终内存中的状态是这样的。![图片](https://mmbiz.qpic.cn/mmbiz_png/ndgH50E7pIo1WhHBvzt1rWZEst4OSRNhTrRLg1m5rpn6SXKHcO84GM0Fdk9ibsdfHh4kpoibfvmV4n1HcNTQC2Uw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 三、闭包

闭包是一块内存空间始终被系统中某个变量引用着，导致这块内存一直不会被释放，形成一个封闭的内存空间，寻常不可见，只有引用它的变量可访问。

正常情况下，函数执行结束之后，所产生的所有变脸都会被内存回收，但是有例外情况，就是，如果所产生的内存空间仍然被其他地方的变量所引用，那么，这些空间不会被内存回收，成为隐藏在内存空间里的黑户，只会被引用这片空间的变量访问，如果这种情况存在很多，那么势必会造成内存不会释放，造成内存泄漏。例如：

```js
var el = document.getElementById('id');
function add (a, b) {
    function validateNum (n) {
        return typeof n === "number";
    }
    el.onclick = function clickHandle () {
    console.log(a, b)
    }
    if (!validateNum(a) || !validateNum(b)) {
    throw new Error('type error');
    }
    return a + b;
}
console.log(add(1, 2))
```

当add函数执行时，会定义el元素的点击事件函数clickHandle，clickHandle的[[scope]]中会保存add函数产生的AO。clickHandle 函数会被绑定在el元素上，只要el元素存在并且绑定了clickHandle事件响应函数，那么clickHandle函数也会一直存在，导致clickHandle函数对象中[[scope]]中保存的add函数的AO对象也会一直存在，不会被内存释放，就像有一个小黑屋，把add函数的AO对象关起来了，垃圾回收机制会忽略这块内存。闭包本质上是保存了其他函数执行时产生的激活对象AO。![图片](https://mmbiz.qpic.cn/mmbiz_png/ndgH50E7pIo1WhHBvzt1rWZEst4OSRNhZiagnAr5Zxen86GcmpiaH1VesBcjFsL2VJPTlPGjfyUialjWgXUP6vAgg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 四、后续

当函数内部的函数不引用外部变量时，不会形成闭包

```js
function add (a, b) {
    function validateNum (n) {
        return typeof n === "number";
    }
    debugger
    if (!validateNum(a) || !validateNum(b)) {
    throw new Error('type error');
    }
    return a + b;
}
console.log(add(1, 2))
```

生成的作用域链如下：![图片](https://mmbiz.qpic.cn/mmbiz_png/ndgH50E7pIo1WhHBvzt1rWZEst4OSRNhr2cbHyMZ2PdjeiahZmKK9R6ZkRVOibhmZiauRqtZGEPSWickZWZnJ0ryAw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)可以看到，如果函数内部生命的函数没有使用到外部AO中的变量，那么在函数的[[scope]]作用域链中不会包含该AO。

```js
function add (a, b) {
    function validateNum (n) {
        console.log(a)
        return typeof n === "number";
    }
    debugger
    if (!validateNum(a) || !validateNum(b)) {
    throw new Error('type error');
    }
    return a + b;
}
console.log(add(1, 2))
```

执行阶段看到的作用域链如下：![图片](https://mmbiz.qpic.cn/mmbiz_png/ndgH50E7pIo1WhHBvzt1rWZEst4OSRNhDfyD9MDvzFzZAubmwOYTsNyMbt0ibVy9jBazocpSgrXIvUwtzEN6JIw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)可以看到在chrome中如果出现闭包，那么JS引擎会根据引用到的变量，做一波优化，只保存用到的变量，并且会把这部分变量从JS执行栈中转移出去，减少执行栈内存占用。函数内部不会被用到的函数不会声明，而普通变量的声明则不受影响validateNum 函数不会被调用的情况下：![图片](https://mmbiz.qpic.cn/mmbiz_png/ndgH50E7pIo1WhHBvzt1rWZEst4OSRNhib1IFoX5Z4CkdgDAN5KKErelVPzg4RfJH8bs3CghaUTStVjyEoYd7ibQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)validateNum 函数会被调用的情况下：![图片](https://mmbiz.qpic.cn/mmbiz_png/ndgH50E7pIo1WhHBvzt1rWZEst4OSRNhQ2a3ZgibtQqUttt2P2DJhBvN91c9d5yhdyX72ERrZweEw29aBq05xOw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 五、react 函数式组件中的闭包

```js
const [value, setValue] = useState([]);

useEffect(() => {
    notificationCenter.on(EVENT_NAME, eventListener);
    return () => {
        notificationCenter.off(EVENT_NAME, eventListener);
    };
}, []);

function eventListener(chatId?: string) {
     console.log(value);
}
```

在事件监听函数执行过程中，发现**无法访问到最新的 value 数据**原因是因为在组件第一次渲染时，绑定了事件监听函数，此时声明的函数的**作用域链中保存了当时的数据状态（value）的初始值**，当页面状态发生变化时，函数组件会重新渲染执行，**但是事件监听函数仍然还是第一次生成的，[[scope]]中保存了初始的value值，所以在函数执行过程中，从作用域链中访问到的value始终是初始值**。在setTimeout以及其他延时回调中也存在类似的情况。

针对这种情况有两种解决办法：

- 第一种：类似事件监听的场景，在useEffect中，添加需要用到的依赖，当依赖发生变化时，重新注册监听事件。

```js
const [value, setValue] = useState([]);

useEffect(() => {
    notificationCenter.on(EVENT_NAME, eventListener);
    return () => {
        notificationCenter.off(EVENT_NAME, eventListener);
    };
}, [value]);
```

- 第二种：使用ref将需要使用到的变量变为引用类型，当外部修改以及函数内部访问的时候实际上是都是在访问同一个引用里面的属性，都能确保拿到的是最新数据。

```js
const valueRef = useRef([]);

useEffect(() => {
    notificationCenter.on(EVENT_NAME, eventListener);
    return () => {
        notificationCenter.off(EVENT_NAME, eventListener);
    };
}, []);

function eventListener(chatId?: string) {
     console.log(valueRef.curremt);
}
```

