---
title: JavaScript 优化技巧
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# **2021 年需要了解的 34 个 JavaScript 优化技巧**

使用先进的语法糖优化你的 JavaScript 代码

开发者需要持续学习新技术，跟以前相比，如今跟随技术变化是比较容易做到的，我写这篇文章的目的是介绍诸如缩写之类的 JavaScript 最佳实践和其中的特性，这些都是我们作为一名前端开发人员必须了解的，因为它会给我们的工作生活带来便利。

可能你已经进行了多年的 JavaScript 开发工作，但有时候你还是会对一些最新的技术不那么了解，而这些新技术可能有助于某些问题的解决而不需要你去编写更多的代码。有时候，这些新技术也能帮助你进行代码优化。此外，如果你今年需要为 JavaScript 面试作准备，本文也是一份实用的参考资料。

在这里，我会介绍一些新的**语法糖**，它可以优化你的 JavaScript 代码，使代码更简洁。下面是一份 **JavaScript 语法糖列表**，你需要了解一下。

# **1. 含有多个条件的 if 语句**

我们可以在数组中存储多个值，并且可以使用数组的 includes 方法。

```
//longhand
if (x === 'abc' || x === 'def' || x === 'ghi' || x ==='jkl') {
    //logic
}
//shorthand
if (['abc', 'def', 'ghi', 'jkl'].includes(x)) {
   //logic
}
```

# **2. If … else 的缩写法**

当我们的 if-else 条件中的逻辑比较简单时，可以使用这种简洁的方式——三元条件运算符。

```
// Longhand
let test: boolean;if (x > 100) {
    test = true;
} else {
    test = false;
}
// Shorthand
let test = (x > 10) ? true : false;
//or we can use directly
let test = x > 10;console.log(test);
```

如果包含嵌套的条件，我们也可以这样写。

```
let x = 300,
test2 = (x > 100) ? 'greater 100' : (x < 50) ? 'less 50' : 'between 50 and 100';console.log(test2); // "greater than 100"
```

# **3. 定义变量**

当我们定义两个值相同或类型相同的变量，可以使用这样的缩写法

```
//Longhand
let test1;
let test2 = 1;
//Shorthand
let test1, test2 = 1;
```

# **4. 对 Null、Undefined、Empty 这些值的检查**

我们创建一个新变量，有时候需要检查是否为 Null 或 Undefined。JavaScript 本身就有一种缩写法能实现这种功能。

```
// Longhand
if (test1 !== null || test1 !== undefined || test1 !== '') {
    let test2 = test1;
}
// Shorthand
let test2 = test1 || '';
```

# **5. 对 Null 值的检查以及默认赋值**

```
let test1 = null,
    test2 = test1 || '';console.log("null check", test2); // output will be ""
```

# **6. 对 Undefined 值的检查以及默认赋值**

```
let test1 = undefined,
    test2 = test1 || '';console.log("undefined check", test2); // output will be ""
```

对正常值的检查

```
let test1 = 'test',
    test2 = test1 || '';console.log(test2); // output: 'test'
```

利好消息：关于第 4、5、6 条还可以使用 ?? 运算符

# **聚合运算符**

- *??**是聚合运算符，如果左值为 null 或 undefined，就返回右值。默认返回左值。

```
const test= null ?? 'default';
console.log(test);
// expected output: "default"const test1 = 0 ?? 2;
console.log(test1);
// expected output: 0
```

# **7. 同时为多个变量赋值**

当我们处理多个变量，并且需要对这些变量赋不同的值，这种缩写法很有用。

```
//Longhand
let test1, test2, test3;
test1 = 1;
test2 = 2;
test3 = 3;
//Shorthand
let [test1, test2, test3] = [1, 2, 3];
```

# **8. 赋值运算符缩写法**

编程中使用算术运算符是很常见的情况。以下是 JavaScript 中赋值运算符的应用。

```
// Longhand
test1 = test1 + 1;
test2 = test2 - 1;
test3 = test3 * 20;
// Shorthand
test1++;
test2--;
test3 *= 20;
```

# **9. 判断变量是否存在的缩写法**

这是普遍使用的缩写法，但在这里应当提一下。

```
// Longhand
if (test1 === true) or if (test1 !== "") or if (test1 !== null)

// Shorthand
//it will check empty string,null and undefined too
if (test1)
```

注意：当 test1 为任何值时，程序都会执行 if(test1){ } 内的逻辑，这种写法在判断 NULL 或 undefined 值时普遍使用。

# **10. 用于多个条件的与(&&)运算符**

如果需要实现某个变量为 true 时调用一个函数，可以使用 && 运算符。

```
//Longhand
if (test1) {
 callMethod();
} //Shorthand
test1 && callMethod();
```

# **11. foreach 循环缩写法**

这是循环结构对应的缩写法。

```
// Longhand
for (var i = 0; i < testData.length; i++)

// Shorthand
for (let i in testData) or  for (let i of testData)
```

Array for each variable

```
function testData(element, index, array) {
  console.log('test[' + index + '] = ' + element);
}

[11, 24, 32].forEach(testData);
// logs: test[0] = 11, test[1] = 24, test[2] = 32
```

# **12. 比较结果的返回**

在 return 语句中，我们也可以使用比较的语句。这样，原来需要 5 行代码才能实现的功能，现在只需要 1 行，大大减少了代码量。

```
// Longhand
let test;function checkReturn() {
    if (!(test === undefined)) {
        return test;
    } else {
        return callMe('test');
    }
}
var data = checkReturn();
console.log(data); //output testfunction callMe(val) {
    console.log(val);
}// Shorthandfunction checkReturn() {
    return test || callMe('test');
}
```

# **13. 箭头函数**

```
//Longhand
function add(a, b) {
   return a + b;
}
//Shorthand
const add = (a, b) => a + b;
```

再举个例子

```
function callMe(name) {
  console.log('Hello', name);
}callMe = name => console.log('Hello', name);
```

# **14. 简短的函数调用语句**

我们可以使用三元运算符实现如下功能。

```
// Longhand
function test1() {
  console.log('test1');
};
function test2() {
  console.log('test2');
};
var test3 = 1;
if (test3 == 1) {
  test1();
} else {
  test2();
}
// Shorthand
(test3 === 1? test1:test2)();
```

# **15. switch 对应的缩写法**

我们可以把条件值保存在名值对中，基于这个条件使用名值对代替 switch。

```
// Longhand
switch (data) {
  case 1:
    test1();
  break;

  case 2:
    test2();
  break;

  case 3:
    test();
  break;
  // And so on...
}

// Shorthand
var data = {
  1: test1,
  2: test2,
  3: test
};

data[something] && data[something]();
```

# **16. 隐式返回缩写法**

使用箭头函数，我们可以直接得到函数执行结果，不需要写 return 语句。

```
//longhand
function calculate(diameter) {
  return Math.PI * diameter
}
//shorthand
calculate = diameter => (
  Math.PI * diameter;
)
```

# **17. 十进制数的指数形式**

```
// Longhand
for (var i = 0; i < 10000; i++) { ... }

// Shorthand
for (var i = 0; i < 1e4; i++) {
```

# **18. 默认参数值**

```
//Longhand
function add(test1, test2) {
  if (test1 === undefined)
    test1 = 1;
  if (test2 === undefined)
    test2 = 2;
  return test1 + test2;
}
//shorthand
add = (test1 = 1, test2 = 2) => (test1 + test2);add() //output: 3
```

# **19. 延展操作符的缩写法**

```
//longhand// joining arrays using concat
const data = [1, 2, 3];
const test = [4 ,5 , 6].concat(data);
//shorthand// joining arrays
const data = [1, 2, 3];
const test = [4 ,5 , 6, ...data];
console.log(test); // [ 4, 5, 6, 1, 2, 3]
```

我们也可以使用延展操作符来克隆。

```
//longhand

// cloning arrays
const test1 = [1, 2, 3];
const test2 = test1.slice()
//shorthand

// cloning arrays
const test1 = [1, 2, 3];
const test2 = [...test1];
```

# **20. 文本模板**

如果你对使用 + 符号来连接多个变量感到厌烦，这个缩写法可以帮到你。

```
//longhand
const welcome = 'Hi ' + test1 + ' ' + test2 + '.'
//shorthand
const welcome = `Hi ${test1} ${test2}`;
```

# **21. 跟多行文本有关的缩写法**

当我们在代码中处理多行文本时，可以使用这样的技巧

```
//longhand
const data = 'abc abc abc abc abc abc\\n\\t'
    + 'test test,test test test test\\n\\t'
//shorthand
const data = `abc abc abc abc abc abc
         test test,test test test test`
```

# **22. 对象属性的赋值**

```
let test1 = 'a';
let test2 = 'b';
//Longhand
let obj = {test1: test1, test2: test2};
//Shorthand
let obj = {test1, test2};
```

# **23. 字符串转换为数字**

```
//Longhand
let test1 = parseInt('123');
let test2 = parseFloat('12.3');
//Shorthand
let test1 = +'123';
let test2 = +'12.3';
```

# **24. 解构赋值缩写法**

```
//longhand
const test1 = this.data.test1;
const test2 = this.data.test2;
const test2 = this.data.test3;
//shorthand
const { test1, test2, test3 } = this.data;
```

# **25. Array.find 缩写法**

当我们需要在一个对象数组中按属性值查找特定对象时，find 方法很有用。

```
const data = [{
        type: 'test1',
        name: 'abc'
    },
    {
        type: 'test2',
        name: 'cde'
    },
    {
        type: 'test1',
        name: 'fgh'
    },
]function findtest1(name) {
    for (let i = 0; i < data.length; ++i) {
        if (data[i].type === 'test1' && data[i].name === name) {
            return data[i];
        }
    }
}
//Shorthand
filteredData = data.find(data => data.type === 'test1' && data.name === 'fgh');
console.log(filteredData); // { type: 'test1', name: 'fgh' }
```

# **26. 查询条件缩写法**

如果我们要检查类型，并根据类型调用不同的函数，我们既可以使用多个 else if 语句，也可以使用 switch，除此之外，如果有缩写法，代码会是怎么样呢？

```
// Longhand
if (type === 'test1') {
  test1();
}
else if (type === 'test2') {
  test2();
}
else if (type === 'test3') {
  test3();
}
else if (type === 'test4') {
  test4();
} else {
  throw new Error('Invalid value ' + type);
}
// Shorthand
var types = {
  test1: test1,
  test2: test2,
  test3: test3,
  test4: test4
};

var func = types[type];
(!func) && throw new Error('Invalid value ' + type); func();
```

# **27. 按位非和 indexOf 缩写法**

我们以查找特定值为目的迭代一个数组，通常用到 **indexOf()** 方法。

```
//longhand
if(arr.indexOf(item) > -1) { // item found
}
if(arr.indexOf(item) === -1) { // item not found
}
//shorthand
if(~arr.indexOf(item)) { // item found
}
if(!~arr.indexOf(item)) { // item not found
}
```

对除 `-1` 外的任何数进行 `按位非(~)` 运算都会返回真值。把按位非的结果再次进行逻辑取反就是 `!~`，这非常简单。或者我们也可以使用 `includes()` 函数：

```
if (arr.includes(item)) {
// true if the item found
}
```

# **28. Object.entries()**

该特性可以把对象转换成一个由若干对象组成的数组。

```
const data = { test1: 'abc', test2: 'cde', test3: 'efg' };
const arr = Object.entries(data);
console.log(arr);/** Output:
[ [ 'test1', 'abc' ],
  [ 'test2', 'cde' ],
  [ 'test3', 'efg' ]
]
**/
```

# **29. Object.values()**

这也是 ES8 中介绍的一个新特性，它的功能与 `Object.entries()` 类似，但没有其核心功能：

```
const data = { test1: 'abc', test2: 'cde' };
const arr = Object.values(data);
console.log(arr);/** Output:
[ 'abc', 'cde']
**/
```

# **30. 两个位运算符缩写**

**(两个按位非运算符只适用于 32 位整型)**

```
// Longhand
Math.floor(1.9) === 1 // true

// Shorthand
~~1.9 === 1 // true
```

# **31. 把一个字符串重复多次**

我们可以使用 for 循环把一个字符串反复输出多次，那这种功能有没有缩写法呢？

```
//longhand
let test = '';
for(let i = 0; i < 5; i ++) {
  test += 'test ';
}
console.log(str); // test test test test test
//shorthand
'test '.repeat(5);
```

# **32. 找出一个数组中最大和最小的值**

```
const arr = [1, 2, 3];
Math.max(…arr); // 3
Math.min(…arr); // 1
```

# **33. 获取字符串中的字符**

```
let str = 'abc';
//Longhand
str.charAt(2); // c
//Shorthand
//注意：如果事先知道目标字符在字符串中的索引，我们可以直接使用该索引值。如果索引值不确定，运行时就有可能抛出 undefined。
str[2]; // c
```

# **34. 幂运算的缩写法**

指数幂函数的缩写法:

```
//longhand
Math.pow(2,3); // 8
//shorthand
2**3 // 8
```





# JavaScript 复杂判断的更优雅写法

# **前言**

我们编写js代码时经常遇到复杂逻辑判断的情况，通常大家可以用if/else或者switch来实现多个条件判断，但这样会有个问题，随着逻辑复杂度的增加，代码中的if/else/switch会变得越来越臃肿，越来越看不懂，那么如何更优雅的写判断逻辑，本文带你试一下。

# **举个例子**

先看一段代码

```
/**
     * 按钮点击事件
     * @param {number} status 活动状态：1 开团进行中 2 开团失败 3 商品售罄 4 开团成功 5 系统取消
     */const onButtonClick = (status)=>{
      if(status == 1){
        sendLog('processing')
        jumpTo('IndexPage')
      }elseif(status == 2){
        sendLog('fail')
        jumpTo('FailPage')
      }elseif(status == 3){
        sendLog('fail')
        jumpTo('FailPage')
      }elseif(status == 4){
        sendLog('success')
        jumpTo('SuccessPage')
      }elseif(status == 5){
        sendLog('cancel')
        jumpTo('CancelPage')
      }else {
        sendLog('other')
        jumpTo('Index')
      }
    }
```

通过代码可以看到这个按钮的点击逻辑：根据不同活动状态做两件事情，发送日志埋点和跳转到对应页面，大家可以很轻易的提出这段代码的改写方案，switch出场：

```
/**
     * 按钮点击事件
     * @param {number} status 活动状态：1 开团进行中 2 开团失败 3 商品售罄 4 开团成功 5 系统取消
     */const onButtonClick = (status)=>{
      switch (status){
        case1:
          sendLog('processing')
          jumpTo('IndexPage')
          breakcase2:
        case3:
          sendLog('fail')
          jumpTo('FailPage')
          breakcase4:
          sendLog('success')
          jumpTo('SuccessPage')
          breakcase5:
          sendLog('cancel')
          jumpTo('CancelPage')
          breakdefault:
          sendLog('other')
          jumpTo('Index')
          break
      }
    }
```

嗯，这样看起来比if/else清晰多了，细心的同学也发现了小技巧，case 2和case 3逻辑一样的时候，可以省去执行语句和break，则case 2的情况自动执行case 3的逻辑。

这时有同学会说，还有更简单的写法：

```
    const actions = {
      '1': ['processing','IndexPage'],
      '2': ['fail','FailPage'],
      '3': ['fail','FailPage'],
      '4': ['success','SuccessPage'],
      '5': ['cancel','CancelPage'],
      'default': ['other','Index'],
    }
/**
     * 按钮点击事件
     * @param {number} status 活动状态：1开团进行中 2开团失败 3 商品售罄 4 开团成功 5 系统取消
     */const onButtonClick = (status)=>{
      let action = actions[status] || actions['default'],
          logName = action[0],
          pageName = action[1]
      sendLog(logName)
      jumpTo(pageName)
    }
```

上面代码确实看起来更清爽了，这种方法的聪明之处在于：将判断条件作为对象的属性名，将处理逻辑作为对象的属性值，在按钮点击的时候，通过对象属性查找的方式来进行逻辑判断，这种写法特别适合一元条件判断的情况。

是不是还有其他写法呢？有的：

```
    const actions = newMap([
      [1, ['processing','IndexPage']],
      [2, ['fail','FailPage']],
      [3, ['fail','FailPage']],
      [4, ['success','SuccessPage']],
      [5, ['cancel','CancelPage']],
      ['default', ['other','Index']]
    ])
/**
     * 按钮点击事件
     * @param {number} status 活动状态：1 开团进行中 2 开团失败 3 商品售罄 4 开团成功 5 系统取消
     */const onButtonClick = (status)=>{
      let action = actions.get(status) || actions.get('default')
      sendLog(action[0])
      jumpTo(action[1])
    }
```

这样写用到了es6里的Map对象，是不是更爽了？Map对象和Object对象有什么区别呢？

1. 一个对象通常都有自己的原型，所以一个对象总有一个"prototype"键。
2. 一个对象的键只能是字符串或者Symbols，但一个Map的键可以是任意值。
3. 你可以通过size属性很容易地得到一个Map的键值对个数，而对象的键值对个数只能手动确认。

我们需要把问题升级一下，以前按钮点击时候只需要判断status，现在还需要判断用户的身份：

```jsx
/**
     * 按钮点击事件
     * @param {number} status 活动状态：1开团进行中 2开团失败 3 开团成功 4 商品售罄 5 有库存未开团
     * @param {string} identity 身份标识：guest客态 master主态
     */const onButtonClick = (status,identity)=>{
      if(identity == 'guest'){
        if(status == 1){
//do sth
        }elseif(status == 2){
//do sth
        }elseif(status == 3){
//do sth
        }elseif(status == 4){
//do sth
        }elseif(status == 5){
//do sth
        }else {
//do sth
        }
      }elseif(identity == 'master') {
        if(status == 1){
//do sth
        }elseif(status == 2){
//do sth
        }elseif(status == 3){
//do sth
        }elseif(status == 4){
//do sth
        }elseif(status == 5){
//do sth
        }else {
//do sth
        }
      }
    }
```

原谅我不写每个判断里的具体逻辑了，因为代码太冗长了。

原谅我又用了if/else，因为我看到很多人依然在用if/else写这种大段的逻辑判断。

从上面的例子我们可以看到，当你的逻辑升级为二元判断时，你的判断量会加倍，你的代码量也会加倍，这时怎么写更清爽呢？

```
    const actions = newMap([
      ['guest_1', ()=>{/*do sth*/}],
      ['guest_2', ()=>{/*do sth*/}],
      ['guest_3', ()=>{/*do sth*/}],
      ['guest_4', ()=>{/*do sth*/}],
      ['guest_5', ()=>{/*do sth*/}],
      ['master_1', ()=>{/*do sth*/}],
      ['master_2', ()=>{/*do sth*/}],
      ['master_3', ()=>{/*do sth*/}],
      ['master_4', ()=>{/*do sth*/}],
      ['master_5', ()=>{/*do sth*/}],
      ['default', ()=>{/*do sth*/}],
    ])

/**
     * 按钮点击事件
     * @param {string} identity 身份标识：guest客态 master主态
     * @param {number} status 活动状态：1 开团进行中 2 开团失败 3 开团成功 4 商品售罄 5 有库存未开团
     */const onButtonClick = (identity,status)=>{
      let action = actions.get(`${identity}_${status}`) || actions.get('default')
      action.call(this)
    }
```

上述代码核心逻辑是：把两个条件拼接成字符串，并通过以条件拼接字符串作为键，以处理函数作为值的Map对象进行查找并执行，这种写法在多元条件判断时候尤其好用。

当然上述代码如果用Object对象来实现也是类似的：

```
    const actions = {
      'guest_1':()=>{/*do sth*/},
      'guest_2':()=>{/*do sth*/},
//....
    }

    const onButtonClick = (identity,status)=>{
      let action = actions[`${identity}_${status}`] || actions['default']
      action.call(this)
    }
```

如果有些同学觉得把查询条件拼成字符串有点别扭，那还有一种方案，就是用Map对象，以Object对象作为key：

```
    const actions = newMap([
      [{identity:'guest',status:1},()=>{/*do sth*/}],
      [{identity:'guest',status:2},()=>{/*do sth*/}],
//...
    ])

    const onButtonClick = (identity,status)=>{
      let action = [...actions].filter(([key,value])=>(key.identity == identity && key.status == status))
      action.forEach(([key,value])=>value.call(this))
    }
```

是不是又高级了一点点？

这里也看出来Map与Object的区别，Map可以用任何类型的数据作为key。

我们现在再将难度升级一点点，假如guest情况下，status1-4的处理逻辑都一样怎么办，最差的情况是这样：

```
    const actions = newMap([
      [{identity:'guest',status:1},()=>{/* functionA */}],
      [{identity:'guest',status:2},()=>{/* functionA */}],
      [{identity:'guest',status:3},()=>{/* functionA */}],
      [{identity:'guest',status:4},()=>{/* functionA */}],
      [{identity:'guest',status:5},()=>{/* functionB */}],
//...
    ])
```

好一点的写法是将处理逻辑函数进行缓存：

```
    const actions = ()=>{
      const functionA = ()=>{/*do sth*/}
      const functionB = ()=>{/*do sth*/}
      returnnewMap([
        [{identity:'guest',status:1},functionA],
        [{identity:'guest',status:2},functionA],
        [{identity:'guest',status:3},functionA],
        [{identity:'guest',status:4},functionA],
        [{identity:'guest',status:5},functionB],
//...
      ])
    }

    const onButtonClick = (identity,status)=>{
      let action = [...actions()].filter(([key,value])=>(key.identity == identity && key.status == status))
      action.forEach(([key,value])=>value.call(this))
    }
```

这样写已经能满足日常需求了，但认真一点讲，上面重写了4次functionA还是有点不爽，假如判断条件变得特别复杂，比如identity有3种状态，status有10种状态，那你需要定义30条处理逻辑，而往往这些逻辑里面很多都是相同的，这似乎也是笔者不想接受的，那可以这样实现:

```
    const actions = ()=>{
      const functionA = ()=>{/*do sth*/}
      const functionB = ()=>{/*do sth*/}
      returnnewMap([
        [/^guest_[1-4]$/,functionA],
        [/^guest_5$/,functionB],
//...
      ])
    }

    const onButtonClick = (identity,status)=>{
      let action = [...actions()].filter(([key,value])=>(key.test(`${identity}_${status}`)))
      action.forEach(([key,value])=>value.call(this))
    }
```

这里Map的优势更加凸显，可以用正则类型作为key了，这样就有了无限可能，假如需求变成，凡是guest情况都要发送一个日志埋点，不同status情况也需要单独的逻辑处理，那我们可以这样写:

```
    const actions = ()=>{
      const functionA = ()=>{/*do sth*/}
      const functionB = ()=>{/*do sth*/}
      const functionC = ()=>{/*send log*/}
      returnnewMap([
        [/^guest_[1-4]$/,functionA],
        [/^guest_5$/,functionB],
        [/^guest_.*$/,functionC],
//...
      ])
    }

    const onButtonClick = (identity,status)=>{
      let action = [...actions()].filter(([key,value])=>(key.test(`${identity}_${status}`)))
      action.forEach(([key,value])=>value.call(this))
    }
```

也就是说利用数组循环的特性，符合正则条件的逻辑都会被执行，那就可以同时执行公共逻辑和单独逻辑，因为正则的存在，你可以打开想象力解锁更多的玩法，本文就不赘述了。

# **总结**

本文已经教你了8种逻辑判断写法，包括：

1. if/else
2. switch
3. 一元判断时：存到Object里
4. 一元判断时：存到Map里
5. 多元判断时：将condition拼接成字符串存到Object里
6. 多元判断时：将condition拼接成字符串存到Map里
7. 多元判断时：将condition存为Object存到Map里
8. 多元判断时：将condition写作正则存到Map里

至此，本文也将告一段落，愿你未来的人生里，不只是有if/else/switch



# Map实际应用场景

首先我们先有请

**「Map」**

简单介绍下自己

https://mmbiz.qpic.cn/mmbiz_jpg/FA2X8PheJ1ZV6392z5sD26qPeUDDvERlW9TwwwYFian4JxfXKvD728RgXSUx6mgee0VVv7T3Xka4njCN4SdJqbw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

https://mmbiz.qpic.cn/mmbiz_png/FA2X8PheJ1ZV6392z5sD26qPeUDDvERlLoOYYAicYILlkICS1kbqV84zbOlxgNM5rQUQJ6n5Xl78b97o8C0XNQg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

**「Map」**

映射是一种经典的数据结构类型，其中数据以

**「key/value」**

的键值对形式存在

[Untitled](https://www.notion.so/8f141a2eef964fc5b6cbd9a081c18854)

## **Map 基本用法**

> 接受任何类型的键 划重点，是任何 any!!!

https://mmbiz.qpic.cn/mmbiz_jpg/FA2X8PheJ1ZV6392z5sD26qPeUDDvERlE1fFibowItI9tUXQ9L5dW6JYicHdzHB3Avp7LywPHwBfU9CWkk1QZYIA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

```
const testMap = new Map()

let str = '今天不学习',
    num = 666,
    keyFunction = function () {},
    keySymbol = Symbol('Web'),
    keyNull = null,
    keyUndefined = undefined,
    keyNaN = NaN
//添加键值对
//基本用法
testMap.set('key', 'value')// Map(1) {"key" => "value"}

testMap.set(str, '明天变辣鸡')
testMap.set(num, '前端Sneaker')
testMap.set(keyFunction, '你的函数写的好棒棒哦')
testMap.set(keySymbol, '大前端')
testMap.set(keyNull, '我是个Null')
testMap.set(keyUndefined, '我是个Undifined')
testMap.set(keyNaN, '我是个NaN')

testMap.get(function () {})//undefined
testMap.get(Symbol('Web'))//undefined

//虽然NaN !== NaN 但是作为Map键名并无区别
testMap.get(NaN)//"我是个NaN"
testMap.get(Number('NaN'))//"我是个NaN"
```

> 除了NaN比较特殊外，其他「Map」的get方法都是通过对比键名是否相等（===）来获取，不相等则返回undefined

## **比较 Map 和 Object**

### **定义**

```
//Map
const map = new Map();
map.set('key', 'value');// Map(1) {"key" => "value"}
map.get('key');// 'value'

//Object
const someObject = {};
someObject.key = 'value';
someObject.key;// 'value'
```

这里可以明显看出其实其定义行为是十分相似的，想必看到这里大家还没看出来**「Map」**到底在何时使用才是最佳实践，别急接着来。

### **键名类型**

JavaScript **「Object」**只接收两种类型的键名 String 和 Symbol，你可以使用其他类型的键名，但是最终 JavaScript 都会隐式转换为字符串

```
const obj = {}
//直接看几种比较特殊的键名
obj[true] = 'Boolean'
obj[1] = 'Number'
obj[{'前端':'Sneaker'}] = '666'

Object.keys(obj)// ["1", "true", "[object Object]"]
```

再来看看 **「Map」** 的，其接收任何类型的键名并保留其键名类型 (此处简单举例，详细可看文章开头**「Map」**基本使用)

```
const map = new Map();
map.set(1, 'value');
map.set(true, 'value');
map.set({'key': 'value'}, 'value');
for (const key of map.keys()) {
  console.log(key);
}
// 1
// true
// {key: "value"}

//除此之外，Map还支持正则作为键名
map.set(/^1[3456789]\\d{9}$/,'手机号正则')
//Map(1) {/^1[3456789]\\d{9}$/ => "手机号正则"}
```

> 「Map」支持正则表达式作为键名，这在Object是不被允许的直接报错

### **原型 Prototype**

**「Object」\**不同于\**「Map」**，它不仅仅是表面所看到的。**「Map」**只包含你所定义的键值对，但是**「Object」**对象具有其原型中的一些内置属性

```
const newObject = {};
newObject.constructor;// ƒ Object() { [native code] }
```

如果操作不当没有正确遍历对象属性，可能会导致出现问题，产生你意料之外的 bug

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

https://mmbiz.qpic.cn/mmbiz_jpg/FA2X8PheJ1ZV6392z5sD26qPeUDDvERlpuWLox2MwAibZ7iatag0ErKOLwFTyH1sFIqOicPFe9fH7rRrM0O4kBu3g/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

```
const countWords = (words) => {
  const counts = { };
  for (const word of words) {
    counts[word] = (counts[word] || 0) + 1;
  }
  return counts;
};
const counts = countWords(['constructor', 'creates', 'a', 'bug']);
// {constructor: "function Object() { [native code] }1", creates: 1, a: 1, bug: 1}
```

这个例子灵感来源于**《Effective TypeScript》**[1]一书

### **迭代器**

**「Map」** 是可迭代的，可以直接进行迭代，例如forEach循环或者for...of...循环

```
//forEach
const map = new Map();
map.set('key1', 'value1');
map.set('key2', 'value2');
map.set('key3', 'value3');
map.forEach((value, key) => {
  console.log(key, value);
});
// key1 value1
// key2 value2
// key3 value3

//for...of...
for(const entry of map) {
  console.log(entry);
}
// ["key1", "value1"]
// ["key2", "value2"]
// ["key3", "value3"]
```

但是对于

**「Object」**

是不能直接迭代的，当你尝试迭代将导致报错

https://mmbiz.qpic.cn/mmbiz_jpg/FA2X8PheJ1ZV6392z5sD26qPeUDDvERlXxqXpTmWibZFmDJATlf9RYZGiaYXLbiaal43VMZRsicje8QBG3OQClicfZg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

```
const object = {
  key1: 'value1',
  key2: 'value2',
  key3: 'value3',
};
for(const entry of object) {
  console.log(entry);
}
// Uncaught TypeError: object is not iterable
```

这时候你就需要一个额外的步骤来检索其键名、键值或者键值对

```
for(const key of Object.keys(object)) {
  console.log(key);
}
// key1
// key2
// key3

for(const value of Object.values(object)) {
  console.log(value);
}
// value1
// value2
// value3

for(const entry of Object.entries(object)) {
  console.log(entry);
}
// ["key1", "value1"]
// ["key2", "value2"]
// ["key3", "value3"]

for(const [key,value] of Object.entries(object)) {
  console.log(key,value);
}
//"key1", "value1"
//"key2", "value2"
//"key3", "value3"
```

当然也可以使用for...in...进行遍历循环键名

```
for(const key in object) {
  console.log(key);
}
// key1
// key2
// key3
```

### **元素顺序和长度**

Map 保持对长度的跟踪，使其能够在O(1)复杂度中进行访问

```
const map = new Map();
map.set('key1', 'value1');
map.set('key2', 'value2');
map.set('key3', 'value3');
map.size;// 3
```

而另一方面，对于**「Object」**而言，想要获得对象的属性长度，需要手动对其进行迭代，使其为O(n)复杂度，属性长度为n

在上文提及的示例中，我们可以看到**「Map」**始终保持按插入顺序返回键名。但**「Object」**却不是。从 ES6 开始，String和Symbol键是按顺序保存起来的，但是通过隐式转换保存成String的键就是乱序的

```
const object = { };
object['key1'] = 'value1';
object['key0'] = 'value0';
object;// {key1: "value1", key0: "value0"}
object[20] = 'value20';
object;// {20: "value20", key1: "value1", key0: "value0"}

Object.keys(object).length;//3
```

## **Object/Map 何为最佳实践**

如上就是 **「Map」** 和 **「Object」** 的基本区别，在解决问题考虑两者的时候就需要考虑两者的区别。

- 当插入顺序是你解决问题时需要考虑的，并且当前需要使用除 String 和 Symbol 以外的键名时，那么 **「Map」** 就是个最佳解决方案
- 如果需要遍历键值对（并且需要考虑顺序）,那我觉得还是需要优先考虑 **「Map」**。
- **Map**是一个纯哈希结构，而**Object**不是（它拥有自己的内部逻辑）。**Map** 在频繁增删键值对的场景下表现更好，性能更高。因此当你需要频繁操作数据的时候也可以优先考虑**Map**
- 再举一个实际的例子，比如有一个自定义字段的用户操作功能，用户可以通过表单自定义字段，那么这时候最好是使用 Map，因为很有可能会破坏原有的对象

```
const userCustomFields = {
  'color':    'blue',
  'size':     'medium',
  'toString': 'A blue box'
};
```

此时用户自定义的 toString 就会破坏到原有的对象 而 **「Map」** 键名接受任何类型，没有影响

```
function isMap(value) {
  return value.toString() === '[object Map]';
}

const actorMap = new Map();

actorMap.set('name', 'Harrison Ford');
actorMap.set('toString', 'Actor: Harrison Ford');

// Works!
isMap(actorMap);// => true
```

- 当你需要处理一些属性，那么 **「Object」** 是完全受用的，尤其是需要处理 JSON 数据的时候。由于 **「Map」** 可以是任意类型，因此没有可以将其转化为 JSON 的原生方法。

```
var map = new Map()
map.set('key','value')
JSON.stringify(map)//"{}"
```

- 当你需要通正则表达式判断去处理一些业务逻辑时，**「Map」**将是你的最佳解决方案

```
const actions = ()=>{
  const functionA = ()=>{/*do sth*/}
  const functionB = ()=>{/*do sth*/}
  const functionC = ()=>{/*send log*/}
  returnnewMap([
    [/^guest_[1-4]$/,functionA],
    [/^guest_5$/,functionB],
    [/^guest_.*$/,functionC],
//...
  ])
}

const onButtonClick = (identity,status)=>{
  let action = [...actions()].filter(([key,value])=>(key.test(`${identity}_${status}`)))
  action.forEach(([key,value])=>value.call(this))
}
```

利用数组循环的特性，符合正则条件的逻辑都会被执行，那就可以同时执行公共逻辑和单独逻辑，因为正则的存在，你可以打开想象力解锁更多的玩法,更多相关 Map 用法样例可以查看[JavaScript 复杂判断的更优雅写法](https://mp.weixin.qq.com/s?__biz=MzAwNzQ2ODEyMQ==&mid=2247484997&idx=1&sn=e03a05eb82fb1f8a191e58ae307a5113&scene=21#wechat_redirect)

## **总结：**

**「Object」**对象通常可以很好的保存结构化数据，但是也有相应的局限性：

1. 键名接受类型只能用 String 或者 Symbol
2. 自定义的键名容易与原型继承的属性键名冲突（例如 toString，constructor 等）
3. 对象/正则无法用作键名 而这些问题通过 **「Map」** 都可以解决，并且提供了诸如迭代器和易于进行大小查找之类的好处

> 不要将「Map」作为普通「Object」的替代品，而应该是普通对象的补充

https://mmbiz.qpic.cn/mmbiz_jpg/FaeDdIfeuq4aNDlOOZnaAsvrbunvxJ7ZqBQctP5wrN8iaicV6j3jUYpzCVeFKQIKrq2KymBLQia9fahMzC6kBbVAA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

### **参考资料**

[1]

**《Effective TypeScript》Dan Vanderkam**

[2]

**https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map**

[3]

**https://dmitripavlutin.com/maps-vs-plain-objects-javascript**

[4]

**https://medium.com/javascript-in-plain-english**



