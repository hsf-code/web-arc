---
title: es 6
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true

---

# ES6

## 新增声明变量

- **let**

> `let`声明的变量只在自己的块作用域内有效，即大括号`{}`括起来的。不能重复声明。

- const

  > const声明的数值类型不能被修改，但引用类型除外，注意下面的k是对象，对象是引用类型，引用类型最后返回的是对象中存储的那个指针，也就是说下面的k指向的是存储中的指针，而指针是不变的，变的是对象的值。

```js
function last(){
  const PI=3.1415926;

  PI = 33 //报错

  const k={
    a:1
  }

  k.b=3; //正确

  console.log(PI,k);
}
```

## 解构赋值

> 适用于变量交换

#### 数组解构赋值

```javascript
{
  let a,b,reset;
  [a,b] = [1,2];
  console.log(a,b); //1 2
}
{
  let a,b,reset;
  [a,b,...reset] = [1,2,4,5,6,7];
  console.log(a,b,reset); //1 2 [4,5,6,7]
}
```

#### 对象解构赋值

- 一般的对象解构赋值

  ```js
  {
  let a,b;
  ({a,b} = {a:1,b:2})
  console.log(a,b); // 1 2
  }
  ```

- 带有默认值的对象解构赋值

  ```js
  {
  let {a=10,b=5} = {a:3}
  console.log(a,b); // 3 5
  }
  ```

- 嵌套的对象解构赋值

  ```js
  {
  let metaData = {
    title:'abc',
    test:[{
      title:'标题',
      des:'description'
    }]
  }
  let {title:enTitle,test:[{title:cnTitle}]} = metaData;
  console.log(enTitle,cnTitle);//abc 标题
  }
  ```

## 扩展系列

#### 正则表达式扩展

- **构造函数 ES5声明对象 情况一**

> 第一个参数是字符; 第二个是修饰符

```js
let regex = new RegExp('xyz', 'i');

console.log(regex.test('xyz123'), regex.test('xyZ123')); // true true
```

- **构造函数 ES5声明对象 情况二**

> 第一个参数是正则表达式; 但是此时不接受第二个参数是一个修饰符，否则会报错

```js
let regex2 = new RegExp(/xyz/i); // 正确
let regex3 = new RegExp(/xyz/i, 'i'); // 错误；Uncaught TypeError: Cannot supply flags when constructing one RegExp 

console.log(regex2.test('xyz123'), regex2.test('xyZ123')); // true true
```

- **构造函数 ES6中的声明对象**

> ES6改变了此行为，第一个参数是正则表达式，第二个参数也可以在指定修饰符。

```javascript
let regex3 = new RegExp(/abc/ig, 'i');

console.log(regex3.flags); // i
```

以上示例中，原有正则对象的修饰符是ig，它会被第二个参数i覆盖。

#### 字符串扩展

- **Unicode表示法**

```javascript
{
  console.log('a',`\u0061`); //a a
  //乱码，因为\u20bb7转换成二进制以大于0xFFFF，会当做两个字符处理
  console.log('s',`\u20BB7`); //s ₻7

  //ES6中处理大于0xFFFF这种情况，用大括号{}把这种Unicode编码包括起来
  console.log('s',`\u{20BB7}`); //s 𠮷
}
{
  let s='𠮷';
  //取长度，四个字节为两个字符
  console.log('length',s.length); //2

  //ES5中charAt()取字符，charCodeAt()取码值
  console.log('0',s.charAt(0)); //0 �
  console.log('1',s.charAt(1)); //1 �
  console.log('at0',s.charCodeAt(0)); //at0 55362
  console.log('at1',s.charCodeAt(1)); //at1 57271

  //ES6中codePointAt()取码值，toString(16)转换成16进制
  let s1='𠮷a';
  console.log('length',s1.length);
  console.log('code0',s1.codePointAt(0)); //code0 134071
  console.log('code0',s1.codePointAt(0).toString(16)); //code0 20bb7
  console.log('code1',s1.codePointAt(1)); //code1 57271
  console.log('code2',s1.codePointAt(2)); //code2 97
}
{
  //ES5中fromCharCode()处理大于两个字节，会乱码
  console.log(String.fromCharCode("0x20bb7")); //ஷ
  //ES6中fromCodePoint()处理大于两个字节，正常显示
  console.log(String.fromCodePoint("0x20bb7")); //𠮷
}
```

- **遍历接口**

  ```javascript
  //字符串遍历器接口
  let str='\u{20bb7}abc';
  //ES5处理会将{20bb7}按照两个字节处理，造成前一个字符乱码
  for(let i=0;i<str.length;i++){
    console.log('es5',str[i]);
  }
  //输出结果:� � a b c
  
  //ES6使用for of遍历处理，可以自动处理大于0xFFFF这种情况
  for(let code of str){
    console.log('es6',code);
  }
  //输出结果:𠮷 a b c
  ```

- **模板字符串**

```javascript
{
  let name = "张三";
  let info = "我来自China";
  let str = `I am ${name} , ${info}`;
  console.log(str);
}
{
  //row对所有的斜杠进行了转义，原样输出
  console.log(String.raw`Hi\n${1+2}`);//Hi\n3
  console.log(`Hi\n${1+2}`);
}
```

- **标签模板**

> 标签模板其实不是模板，而是函数调用的一种特殊形式。“标签”指的是函数，紧跟在后面的模板字符串就是它的参数。

**两个作用：** 第一在过滤 html 字符串的时候防止 xss 攻击用这个处理，第二可以用于多语言转换

```javascript
{
  let user = {
    name:'zhangsan',
    info:'hello world'
  }
  console.log(abc`I am ${user.name},${user.info}`);
  function abc(s,v1,v2){
    console.log(s,v1,v2);
    return s+v1+v2;
  }
}
```

- **新增方法(10种)**

padStart()、padEnd() 这两个方法是 ES7 的草案中提案的，在 ES6 中使用，需要安装库 `npm install babel-polyfill --save-dev` 打补丁，处理兼容性，在项目中引入 babel-polyfill

```js
import 'babel-polyfill'
{
  let str="string";
  //includes()判断是否包含某个字符
  console.log('includes',str.includes("c"));
  //startsWith()判断是否以某个字符为起始
  console.log('start',str.startsWith('str'));
  //endsWith()判断是否以某个字符为结束
  console.log('end',str.endsWith('ng'));
}
{
  let str="abc";
  //repeat()使字符串重复多少次
  console.log(str.repeat(3));
}
{
  //第一个参数指定要显示的长度，第二个参数表示如果长度不够要添加的字符
  console.log('1'.padStart(2,'0')); //01
  console.log('1'.padEnd(2,'0')); //10
}
```

#### 数值扩展

- **Number.isInteger()**

> 判断是否为整数

```js
console.log('25',Number.isInteger(25)); //true
console.log('25.0',Number.isInteger(25.0)); //true
console.log('25.1',Number.isInteger(25.1)); //false
console.log('25.1',Number.isInteger('25')); //false
```

- **Number.isFinite()**

> 函数用于检查其参数是否是无穷大

```js
console.log('15',Number.isFinite(15)); //true
console.log('NaN',Number.isFinite(NaN)); //false
console.log('1/0',Number.isFinite('true'/0)); //false
console.log('NaN',Number.isNaN(NaN)); //true
console.log('0',Number.isNaN(0)); //false
```

- **Number.isNaN()**

  > 判断一个值是否为NaN

  ```js
  console.log('NaN',Number.isNaN(NaN)); //true
  console.log('0',Number.isNaN(0)); //false
  ```

- **Number.MAX_SAFE_INTEGER**

  > 数的最大上限

- **Number.MIN_SAFE_INTEGER**

  > 数的最小下限

- **Number.isSafeInteger()**

  > 判断给的这个数是否在有效范围内

***注意：\*** ES6中如果一个数不在-2的53方和2的53次方之间就会不准确

```javascript
{
  console.log(Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER);
  console.log('10',Number.isSafeInteger(10));//10 true
  console.log('a',Number.isSafeInteger('a'));//a false
}
```

- **Math.trunc()**

  > 取整

  ```javascript
  {
  console.log(4.1,Math.trunc(4.1)); // 4
  console.log(4.9,Math.trunc(4.9)); // 4
  }
  ```

- **Math.sign()**

  > 返回-1,0,1 小于0返回-1，等于0返回0，大于0返回1,注意参数为数值

  ```javascript
  console.log('-5',Math.sign(-5)); //-1
  console.log('0',Math.sign(0)); //0
  console.log('5',Math.sign(5)); //1
  ```

- **Math.cbrt()**

  > 返回一个数的立方根

  ```javascript
  {
  console.log('-1',Math.cbrt(-1)); //-1
  console.log('8',Math.cbrt(8)); //2
  }
  ```

#### 数组扩展

- **Array.of()**

> 把一组`数组变量`转换成数组类型

```javascript
{
  let arr = Array.of(3,4,7,9,11);
  console.log('arr=',arr); //arr= [3, 4, 7, 9, 11]

  //返回空数组
  let empty=Array.of();
  console.log('empty',empty); //empty []
}
```

- **Array.from()**

  ```javascript
  {
  //第一种用法，传入一个参数
  <div id="doc3" class="syy">
      <p>p1</p>
      <p>p2</p>
      <p>p3</p>
  </div>
  //获取所有的p标签
  let p=document.querySelectorAll('p');
  let pArr=Array.from(p);
  pArr.forEach(function(item){
    //textContent是ES5的一个原生方法，获取文本
    console.log(item.textContent);
  });
  //输出 p1 p2 p3
  
  //第二种用法传入两个参数,第二个参数类似于map映射
  console.log(Array.from([1,3,5],function(item){return item*2})); //[2, 6, 10]
  }
  ```

- **fill()**

> 填充,只写一个参数全部替换，三个参数情况下：第一个参数是替换内容，第二个参数是起始位置，第三个参数是结束位置

```javascript
{
  console.log('fill-7',[1,'a',undefined].fill(7)); //[7, 7, 7]
  console.log('fill,pos',['a','b','c'].fill(7,1,3));//["a", 7, 7]
}
```

- **keys()**

  > 获取索引

- **values()**

  > 获取值，是ES7中的一个提案，存在浏览器兼容性需要加载 `import 'babel-polyfill';`

- **entries()**

  > 既获取索引又获取值

  ```javascript
  {
  for(let index of ['1','c','ks'].keys()){
    console.log('keys',index); // 0 1 2
  }
  for(let value of ['1','c','ks'].values()){
    console.log('values',value); //1 c ks
  }
  for(let [index,value] of ['1','c','ks'].entries()){
    console.log('values',index,value); //0 1 1 c 2 ks
  }
  }
  ```

- **copyWithin(target,start,end)**

  - `target(必须)`：从该位置开始替换数据
  - `start(可选)`：从该位置开始读取数据，默认为0
  - `end(可选)`：到该位置前停止读取数据，默认等于数组长度

```js
{
  console.log([1,2,3,4,5].copyWithin(0,3,4)); //[4, 2, 3, 4, 5]
}
```

- **find(fn)**

  > 查找符合条件的第一个元素,查找不到时返回undefined

- **findIndex(fn)**

  > 查找符合条件的第一个元素的下标值，查找不到时返回-1

```js
{
  console.log([1,2,3,4,5,6].find(function(item){return item>3})); //4
  console.log([1,2,3,4,5,6].findIndex(function(item){return item>3})); //3
}
```

- 展开运算符...

  > 数组拼接使用展开运算符可以取代concat的位置

```javascript
const a = ['a', 'b'];
const b = ['c', 'd']
const c = [...a, ...b];

console.log(c); //["a", "b", "c", "d"]

//使用concat
const d = a.concat(b)
console.log(d); //["a", "b", "c", "d"]
```

#### 函数扩展

- **参数默认值**

> ***注意：\*** 默认值后面不能跟没有默认值得变量，如(x, y = 'world',c)c没有默认值错误

```js
{
  function test(x, y = 'world'){
    console.log('默认值',x,y);
  }
  test('hello'); //默认值 hello world
  test('hello','China'); //默认值 hello China
}
```

- **作用域问题**

  ```js
  {
  let x='test';
  function test2(x,y=x){
    console.log('作用域',x,y);
  }
  //参数中第一个x没有值
  test2(); //作用域 undefined undefined
  test2('kill'); //作用域 kill kill
  
  //x为上面let定义的x
  function test3(z,y=x){
    console.log('作用域',z,y);
  }
  test3('kill'); //作用域 kill test
  }
  ```

- **rest参数**

  > rest参数就是在你不确定有多少个参数的时候，把你输入的一系列参数转换成了数组

  ```js
  {
  function test3(...arg){
    for(let v of arg){
      console.log(v);
    }
  }
  test3(1,2,3,4,'a'); // 1 3 4 5 a
  }
  ```

- **扩展运算符**

  > ES6的扩展运算符则可以看作是rest参数的逆运算。可以将数组转化为参数列表

  ```js
  {
  // 把一个数组拆分成离散的值
  console.log(...[1,2,4]); //1 2 4
  console.log('a',...[1,2,4]); //a 1 2 4
  }
  ```

- **箭头函数**

  ```js
  {
  let arrow = v => v*2;
  let arrow2 = () => 5;
  console.log('arrow',arrow(3)); //6
  console.log(arrow2()); //5
  }
  ```

- **this绑定**

- **尾调用**

  > 尾调用存在于函数式编程概念里，函数的最后是不是是一个函数，可以用来提升性能，如果在性能优化过程中，是不断的嵌套其他函数，或者说这个函数依赖于另一个函数的操作，建议用尾调用的形式。

```js
{
  function tail(x){
    console.log('tail',x);
  }
  function fx(x){
    return tail(x)
  }
  fx(123) //tail 123
}
```

#### 对象扩展

- **简洁表示法**

```js
{
  let o=1;
  let k=2;
  //es5属性定义
  let es5={
    o:o,
    k:k
  };
  //es6属性定义
  let es6={
    o,
    k
  };
  console.log(es5,es6);

  //es5定义方法
  let es5_method={
    hello:function(){
      console.log('hello');
    }
  };
  //es6定义方法，更简洁
  let es6_method={
    hello(){
      console.log('hello');
    }
  };
  console.log(es5_method.hello(),es6_method.hello());
}
```

- **属性表达式**

```js
{
  // 属性表达式
  let a='b';
  //es5中key是固定的
  let es5_obj={
    a:'c',
    b:'c'
  };
  //es6中可以使用变量，这块相当于b
  let es6_obj={
    [a]:'c'
  }
  console.log(es5_obj,es6_obj);
  //输出 Object {a: "c", b: "c"} Object {b: "c"}

}
```

- **新增API**
- **Object.is()**

> 在功能上与===一样

```js
{
  console.log('字符串',Object.is('abc','abc'),'abc'==='abc'); //字符串 true true
  // 数组是引用类型，虽然以下是两个空数组，在值上都是空，但这两个数组引用的是不同的地址，因此在严格意义上来讲，他两个不是完全相等的
  console.log('数组',Object.is([],[]),[]===[]); //数组 false false
}
```

- **Object.assign()**

  > 拷贝函数

  ```js
  console.log('拷贝',Object.assign({a:'a'},{b:'b'}));
  //拷贝 Object {a: "a", b: "b"}
  ```

- **Object.entries()**

  > 遍历

  ```js
  let test={k:123,o:456};
  for(let [key,value] of Object.entries(test)){
  console.log([key,value]);
  }
  ```

- **Object.keys()**

  > 对数组排序

  ```javascript
  var anObj = { 100: 'a', 2: 'b', 7: 'c' };
  console.log(Object.keys(anObj).sort( (x,y) => x > y));
  ```

- **对象扩展拷贝**

  > node v8.5.0版本支持

  ```javascript
  const a = {"name": "zhangsan"}
  const b = {"age": 8, "email": "XXX@qq.com"}
  console.log({...a, ...b, "type": "儿童"});
  // {name: "zhangsan", age: 18, email: "XXX@qq.com", type: "成人"}
  ```

# 数据结构Set、Map

> 在整个的数据开发过程中，涉及到数据结构，能用Map就不使用数组，尤其是复杂的数据结构。如果对要求存储的数据有唯一性要求，推荐使用Set。

## set

> 类似于数组，但它的一大特性就是集合中的所有元素都是唯一，没有重复。

- **方法介绍**
  - `add`：添加一个元素
  - `delete`：删除一个元素
  - `clear`：清空所有元素
  - `has`：查看集合中是否包含指定元素
  - `size`：相当于数组中的length
- **使用示例**

```js
{
  let list = new Set(); // 创建一个Set集合
  list.add(5);
  list.add(7);

  console.log('size',list.size); //2
}
{
  let arr=['add','delete','clear','has'];
  let list=new Set(arr);
  list.add('add1');
  console.log('has',list.has('add')); //has true
  console.log('delete',list.delete('add'),list); //delete true Set {"delete", "clear", "has", "add1"}
  list.clear();
  console.log('list',list); //list Set {}
}
```

- 数组去重

  > 以利用这一唯一特性进行数组的去重工作。

```js
{
  let list = new Set();
  list.add(1);
  list.add(2);
  list.add(1);
  console.log('list',list); //list Set {1, 2}

  //数字2 与 字符串'2'严格意义上是不相等的
  let arr=[1,2,3,1,'2'];
  let list2=new Set(arr);
  console.log('unique',list2); //unique Set {1, 2, 3, "2"}
  
  //以数组的形式输出
  console.log([...list2]);   // (4) [1, 2, 3, "2"]
}
```

- **集合遍历**

  ```javascript
  {
  let arr=['add','delete','clear','has'];
  let list=new Set(arr);
  
  for(let key of list.keys()){
    console.log('keys',key);
  }
  //keys add keys delete 5 keys clear  keys has
  
  for(let value of list.values()){
    console.log('value',value);
  }
  //value add  value delete  value clear  value has
  
  for(let [key,value] of list.entries()){
    console.log('entries',key,value);
  }
  //entries add add  entries delete delete  entries clear clear  entries has has
  
  list.forEach(function(item){console.log(item);})
  //add  delete  clear  has
  }
  ```

  ## weakset

> weakset的元素只能是对象，WeakSet中的对象是弱引用，只是把地址拿过来，没有clear属性，不能遍历

```javascript
{
  let weakList=new WeakSet();
  let arg={a:'1'};
  weakList.add(arg);
  weakList.add({b:'2'});
  console.log('weakList',weakList);
  //weakList WeakSet {Object {b: "2"}, Object {a: "1"}}
}
```

## map

> Map中的key可以是任意数据类型：字符串、数组、对象等 要注意集合Set添加元素用add()，而集合Map添加元素用set()

- **第一种定义方式**

```javascript
let map = new Map();
let arr=['123'];
map.set(arr,456);
console.log('map',map,map.get(arr));

//map Map {["123"] => 456} 456
```

- **第二种定义方式**

```js
let map = new Map([['a',123],['b',456]]);
console.log('map args',map);
//map args Map {"a" => 123, "b" => 456}

//size delete clear方法 与 遍历同set一样
console.log('size',map.size); //size 2
console.log('delete',map.delete('a'),map); //delete true Map {"b" => 456}
map.clear();
console.log('clear',map); //clear Map {}
```

## weakmap

> 同WeakSet一样接收的key值必须是对象，没有size属性，clear方法，也是不能遍历

```javascript
{
  let weakmap=new WeakMap();
  let o={};
  weakmap.set(o,123);
  console.log(weakmap.get(o)); //123
}
```

## map与array对比

> Map与Array横向对比增、查、改、删

```js
let map=new Map();
let array=[];
```

- **增**

```js
map.set('t',1);
array.push({t:1});

console.info('map-array',map,array); // map-array Map {"t" => 1} [Object]
```

- **查**

```js
let map_exist=map.has('t');
let array_exist=array.find(item=>item.a);

console.info('map-array',map_exist,!!array_exist); // map-array true false
```

- **改**

```js
map.set('t',2);
array.forEach(item=>item.t?item.t=2:'');

console.info('map-array-modify',map,array); // map-array-modify Map {"t" => 2} [Object]
```

- **删**

```js
map.delete('t');
let index=array.findIndex(item=>item.t);
array.splice(index,1);

console.info('map-array-empty',map,array); // map-array-empty Map {} []
```

## set与array

> Set与Array增、查、改、删对比

```js
let set=new Set();
let array=[];
```

- **增**

```js
set.add({t:1});
array.push({t:1});

// set-array Set {Object {t: 1}} [Object]
console.info('set-array',set,array);
```

- **查**

```js
let set_exist=set.has({t:1}); // 没有对象引用，将一直为false
let array_exist=array.find(item=>item.t);

// set-array false Object {t: 1}
console.info('set-array',set_exist,array_exist);
```

- **改**

```js
set.forEach(item=>item.t?item.t=2:'');
array.forEach(item=>item.t?item.t=2:'');

// set-array-modify Set {Object {t: 2}} [Object]
console.info('set-array-modify',set,array);
```

- **删**

```js
set.forEach(item=>item.t?set.delete(item):'');
let index=array.findIndex(item=>item.t);
array.splice(index,1);

// set-array-empty Set {} []
console.info('set-array-empty',set,array);
```

## 集合map集合set对象三者对比

> Map、Set、Object三者增、查、改、删对比

```js
let item={t:1};
let map=new Map();
let set=new Set();
let obj={};
```

- **增**

```js
map.set('t',1);
set.add(item);
obj['t']=1;

// map-set-obj Object {t: 1} Map {"t" => 1} Set {Object {t: 1}}
console.info('map-set-obj',obj,map,set);
```

- **查**

```js
// Object {map_exist: true, set_exist: true, obj_exist: true}
console.info({
    map_exist:map.has('t'),
    set_exist:set.has(item),
    obj_exist:'t' in obj
})
```

- **改**

```js
map.set('t',2);
item.t=2;
obj['t']=2;

// map-set-obj-modify Object {t: 2} Map {"t" => 2} Set {Object {t: 2}}
console.info('map-set-obj-modify',obj,map,set);
```

- **删**

```js
map.delete('t');
set.delete(item);
delete obj['t'];

// map-set-obj-empty Object {} Map {} Set {}
console.info('map-set-obj-empty',obj,map,set);
```



# [Promise](https://www.nodejs.red/#/es6/promise?id=promise)

在 JavaScript 的世界中，所有代码都是单线程执行的。为了使程序不阻塞执行有了异步（I/O操作、事件操作），但是异步也有其不好之处，例如：异步回调callback 回调地狱的问题，伴随着这些问题有了解决方案 Promise。

## Callback 方式书写

回调函数方式书写，如果异步请求多了，将会很难维护，程序看着很乱，也很容易导致回调地狱。

```js
const ajax = function(callback){
  console.log('执行');
  setTimeout(function(){
    callback && callback()
  });
}

ajax(function(){
  console.log('执行 ajax方法');
})
```

## Promise 方式书写

Promise 标准-状态变化（Pending —— Fulfilled/Rejected），then 函数不明文指定返回实例，返回本身的 Promise 实例，否则返回指定的 Promise 实例。

- **resove**：执行下一步操作
- **reject**：中断当前操作
- **then**：是 `Promise` 返回的对象，执行下一个，如果有两个函数，第一个表示成功 `resolved`，第二个表示失败 `rejected`。

```javascript
const ajax = function(){
  console.log('promise','执行');
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      resolve()
    },1000);
  });
}

ajax().then(function(){
  console.log('promise','执行ajax方法');
});
```

- **执行两个 Promise 的效果**

```javascript
const ajax = function(){
  console.log('promise','执行');
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      resolve()
    },1000);
  });
};
ajax()
  .then(function(){
    return new Promise(function(resolve,reject){
      setTimeout(function(){
        resolve();
      },1000);
    });
  })
  .then(function(){
    console.log('promise3','执行3');
  })
```

- **多个 Promise 实例实现串行操作**

执行 a b c d 如果中间出了错误使用 catch 来捕获

```javascript
let ajax = function(num){
  console.log('执行4');
  return new Promise(function(resolve,reject){
    if (num > 5) {
      resolve();
    }else{
      throw new Error('出错了')
    }
  });
}
ajax(6).then(function(){
  console.log('log','6');
}).catch(function(err){
  console.log('catch',err);
});
ajax(3).then(function(){
  console.log('log','3');
}).catch(function(err){
  console.log('catch','err');
});
// 输出：
// 执行4
// 执行4
// log 6
// catch err
```

## finally

Promise 执行结束后无论结果是 fulfilled 或 rejected 都会触发 finally 指定的回调函数。避免了同样的代码在 then()、catch() 重复书写。

```js
Promise.resolve('success').then(result => {
  console.log('then: ', result)

  return Promise.resolve(result);
}).catch(err => {
  console.error('catch: ', err);

  return Promise.reject(err);
}).finally(result => {
  console.info('finally: ', result);
})

// then:  success
// finally:  undefined
// Promise {<resolved>: "success"}
```

## Promise.all() 并发执行

**Promise.all** 以数组的形式接收多个 Promise 实例，内部好比一个 for 循环同步的执行传入的多个 Promise 实例，一旦其中某个 Promise 实例发生 reject 就会触发 Promise.all() 的 catch() 函数。

```javascript
// 所有图片加载完在添加到页面上
function loadImg(src){
  return new Promise((resolve,reject) => {
    let img = document.createElement('img');
    img.src = src;
    img.onload = () => {
      resolve(img);
    }
    img.onerror = (err) => {
      reject(err)
    }
  })
}

function showImgs(imgs){
  imgs.forEach(function(img){
    document.body.appendChild(img)
  })
}

Promise.all([
  loadImg('http://www.qzfweb.com/uploads/20170512190539489.jpeg'),
  loadImg('http://www.qzfweb.com/uploads/20170225143135972.jpg'),
  loadImg('http://www.qzfweb.com/uploads/20170217225453679.jpg')
]).then(showImgs)
```

## Promise.race() 率先执行

**Promise.race()** 只要其中一个 Promise 实例率先发生改变，`Promise.race()` 实例也将发生改变，其他的将不在响应。

```js
// 有一个图片加载完就添加到页面上
function loadImg(src){
  return new Promise((resolve,reject) => {
    let img = document.createElement('img');
    img.src = src;
    img.onload = () => {
      resolve(img);
    }
    img.onerror = (err) => {
      reject(err)
    }
  })
}

function showImgs(img){
  let p = document.createElement('p');
  p.appendChild(img);
  document.body.appendChild(p);
}

Promise.race([
  loadImg('http://www.qzfweb.com/uploads/20170512190539489.jpeg'),
  loadImg('http://www.qzfweb.com/uploads/20170225143135972.jpg'),
  loadImg('http://www.qzfweb.com/uploads/20170217225453679.jpg')
]).then(showImgs)
```

## 错误捕获

Promise 实例提供了两种错误捕获的方式，一种是 Promise.then() 方法的第二个参数，另一种是 Promise 实例的 catch() 函数。

### [**.then 第二参数捕获错误**](https://www.nodejs.red/#/es6/promise?id=then-第二参数捕获错误)

`.then()` 第二个回调参数捕获错误具有就近的原则，不会影响后续 then 的进行。

```js
const ajax = function(){
  console.log('promise开始执行');
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      reject(`There's a mistake`);
    },1000);
  });
}

ajax()
  .then(function(){
    console.log('then1');
    return Promise.resolve();
  }, err => {
    console.log('then1里面捕获的err: ', err);
  })
  .then(function(){
    console.log('then2');
    return Promise.reject(`There's a then mistake`);
  })
  .catch(err => {
    console.log('catch里面捕获的err: ', err);
  });

// 输出
// promise开始执行
// then1里面捕获的err:  There's a mistake
// then2
// catch里面捕获的err:  There's a then mistake
```

### [**catch() 捕获错误**](https://www.nodejs.red/#/es6/promise?id=catch-捕获错误)

Promise 抛错具有冒泡机制，能够不断传递，可以使用 catch() 统一处理，下面代码中不会输出 then1、then2，直接执行 catch() 处理错误。

```javascript
const ajax = function(){
  console.log('promise开始执行');
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      reject(`There's a mistake`);
    },1000);
  });
}

ajax()
  .then(function(){
    console.log('then1');
    return Promise.resolve();
  })
  .then(function(){
    console.log('then2');
    return Promise.reject(`There's a then mistake`);
  })
  .catch(err => {
    console.log('catch里面捕获的err: ', err);
  })

// 输出
// promise开始执行
// catch里面捕获的err:  There's a mistake
```

不论是 Promise 还是 async/await 在写法上解决了异步回调 Callback 的问题，但是任何写法都不会改变 JavaScript 单线程、异步的本质，除非 JavaScript 执行引擎发生变化。

## 手写 Promise 代码

这是一个经典的面试问题了，我将它放了最后，理清了 Promise 的实现原理，很多问题自然就迎刃而解了，不废话直接上代码，共分为 5 部份完成，实现思路如下：

1. 声明 MayJunPromise 类
2. Then 方法
3. Promise 解决过程
4. 验证你的 Promise 是否正确
5. catch、resolve、reject、all、race 方法实现
6. 并发请求控制

### 1. 声明 MayJunPromise 类

主要在构造函数里做一些初始化操作

- 行 {1} 初始化一些默认值，Promise 的状态、成功时的 value、失败时的原因
- 行 {2} onResolvedCallbacks 用于一些异步处理 const p = new Promise(resolve => { setTimeout(function(){ resolve(1) }, 5000) })，当 resolve 在 setTimeout 里时，我们调用 p.then() 此时的状态为 pending，因此我们需要一个地方来保存，此处就是用于保存 Promise resolve 时的回调函数集合
- 行 {3} onRejectedCallbacks 与行 {2} 同理，保存 Promise reject 回调函数集合
- 行 {4} 成功时回调，先进行状态判断是不可逆的，如果 status = pending 修改状态和成功时的 value
- 行 {5} 失败时回调，与上面行 {4} 同理，例如 resolve(1); reject('err'); 第二个 reject 就无法覆盖
- 行 {6} 自执行
- 行 {7} 运行失败错误捕获

```javascript
/**
 * 封装一个自己的 Promise
 */
class MayJunPromise {
  constructor(fn) {
    // {1} 初始化一些默认值
    this.status = 'pending'; // 一个 promise 有且只有一个状态 (pending | fulfilled | rejected)
    this.value = undefined; // 一个 JavaScript 合法值（包括 undefined，thenable，promise）
    this.reason = undefined; // 是一个表明 promise 失败的原因的值
    this.onResolvedCallbacks = []; // {2}
    this.onRejectedCallbacks = []; // {3}

    // {4} 成功回调
    let resolve = value => {
      if (this.status === 'pending') {
        this.status = 'fulfilled'; // 终态
        this.value = value; // 终值
        this.onResolvedCallbacks.forEach(itemFn => {
          itemFn()
        });
      }
    }

    // {5} 失败回调
    let reject = reason => {
      if (this.status === 'pending') { // 状态不可逆，例如 resolve(1);reject('err'); 第二个 reject 就无法覆盖
        this.status = 'rejected'; // 终态
        this.reason = reason; // 终值
        this.onRejectedCallbacks.forEach(itemFn => itemFn());
      }
    }
    
    try {
      // {6} 自执行
      fn(resolve, reject);
    } catch(err) {
      reject(err); // {7} 失败时捕获
    }
  }
}
```

### 2. Then 方法

- 一个 promise 必须提供一个 then 方法以访问其当前值、终值和据因

- 行 {8} onFulfilled、onRejected 这两个参数可选，由于 Promise .then 是可以链式调用的，对于值穿透的场景要做判断，如果不传，则返回一个函数，也就是将上个结果进行传递

- 行 {9} then 方法必须返回一个 promise 对象

- 行 {10}、{11} 、{12} 也是 then 方法内实现的三种情况，相类似，次数只拿状态等于 fulfilled 进行说明

- 行 {10.1} Promise/A+ 规范定义：要确保 onFulfilled、onRejected 在下一轮事件循环中被调用，你可以使用 setTimeout 来实现，因为我这里是在 Node.js 环境下，因此推荐使用了 setImmediate 来注册事件（因为可以避免掉 setTimeout 的延迟）

- 行 {10.2} Promise/A+ 标准规定：如果 onFulfilled 或 onRejected 返回的是一个 x，那么它会以 [[Resolve]](promise2, x) 处理解析，我们定义解析的函数 resolveMayJunPromise，也是一个核心函数，下面进行讲解 ```javascript /**

- 封装一个自己的 Promise

- / class MayJunPromise { ...

  /**

  - 一个 promise 必须提供一个 then 方法以访问其当前值、终值和据因

  - @param { Function } onFulfilled 可选，如果是一个函数一定是在状态为 fulfilled 后调用，并接受一个参数 value

  - @param { Function } onRejected 可选，如果是一个函数一定是在状态为 rejected 后调用，并接受一个参数 reason

  - @returns { Promise } 返回值必须为 Promise

  - / then(onFulfilled, onRejected) { // {8} 值穿透，把 then 的默认值向后传递，因为标准规定 onFulfilled、onRejected 是可选参数 // 场景：new Promise(resolve => resolve(1)).then().then(value => console.log(value)); onFulfilled = Object.prototype.toString.call(onFulfilled) === '[object Function]' ? onFulfilled : function(value) {return value}; onRejected = Object.prototype.toString.call(onRejected) === '[object Function]' ? onRejected : function(reason) {throw reason};

    // {9} then 方法必须返回一个 promise 对象 const promise2 = new MayJunPromise((resolve, reject) => { // {10} if (this.status === 'fulfilled') { // 这里的 this 会继承外层上下文绑定的 this

    ```markup
    // {10.1} Promise/A+ 规定：确保 onFulfilled、onRejected 在下一轮事件循环中被调用
    // 可以使用宏任务 (setTimeout、setImmediate) 或微任务（MutationObsever、process.nextTick）
    setImmediate(() => {
      try {
        // {10.2} Promise/A+ 标准规定：如果 onFulfilled 或 onRejected 返回的是一个 x，那么它会以 [[Resolve]](promise2, x) 处理解析
        const x = onFulfilled(this.value);
        // 这里定义解析 x 的函数为 resolveMayJunPromise
        resolveMayJunPromise(promise2, x, resolve, reject);
      } catch (e) {
        reject(e);
      }
    });
    ```

    }

    // {11} if (this.status === 'rejected') {

    ```markup
    setImmediate(() => {
      try {
        const x = onRejected(this.reason)
        resolveMayJunPromise(promise2, x, resolve, reject);
      } catch (e) {
        reject(e);
      }
    });
    ```

    }

    // {12} // 有些情况无法及时获取到状态，初始值仍是 pending，例如： // return new Promise(resolve => { setTimeout(function() { resolve(1) }, 5000) }) // .then(result => { console.log(result) }) if (this.status === 'pending') {

    ```markup
    this.onResolvedCallbacks.push(() => {
      setImmediate(() => {
        try {
          const x = onFulfilled(this.value);
          resolveMayJunPromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    });
    
    this.onRejectedCallbacks.push(() => {
      setImmediate(() => {
        try {
          const x = onRejected(this.reason)
          resolveMayJunPromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    });
    ```

    } });

    return promise2; } }

    ```
    
    ```

### 3. Promise 解决过程

声明函数 resolveMayJunPromise()，**Promise 解决过程**是一个抽象的操作，在这里可以做到与系统的 Promise 或一些遵循 Promise/A+ 规范的 Promise 实现相互交互，以下代码建议跟随 Promise/A+ 规范进行阅读，规范上面也写的很清楚。

注意：在实际编码测试过程中规范 [2.3.2] 样写还是有点问题，你要根据其它的 Promise 的状态值进行判断，此处注释掉了，建议使用 [2.3.3] 也是可以兼容的 。

```javascript
/**
 * Promise 解决过程
 * @param { Promise } promise2 
 * @param { any } x 
 * @param { Function } resolve 
 * @param { Function } reject 
 */
function resolveMayJunPromise(promise2, x, resolve, reject){
  // [2.3.1] promise 和 x 不能指向同一对象，以 TypeError 为据因拒绝执行 promise，例如：
  // let p = new MayJunPromise(resolve => resolve(1))
  // let p2 = p.then(() => p2); // 如果不做判断，这样将会陷入死循环
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }
  
  // [2.3.2] 判断 x 是一个 Promise 实例，可以能使来自系统的 Promise 实例，要兼容，例如：
  // new MayJunPromise(resolve => resolve(1))
  //        .then(() => new Promise( resolve => resolve(2)))
  // 这一块发现也无需，因为 [2.3.3] 已经包含了
  // if (x instanceof Promise) {
  //     // [2.3.2.1] 如果 x 是 pending 状态，那么保留它（递归执行这个 resolveMayJunPromise 处理程序）
  //     // 直到 pending 状态转为 fulfilled 或 rejected 状态
  //     if (x.status === 'pending') {
  //         x.then(y => {
  //             resolveMayJunPromise(promise2, y, resolve, reject);
  //         }, reject)
  //     } else if (x.status === 'fulfilled') { // [2.3.2.2] 如果 x 处于执行态，resolve 它
  //         x.then(resolve); 
  //     } else if (x.status === 'rejected') { // [2.3.2.3] 如果 x 处于拒绝态，reject 它
  //         x.then(reject);
  //     }
  //     return;
  // }

  // [2.3.3] x 为对象或函数，这里可以兼容系统的 Promise
  // new MayJunPromise(resolve => resolve(1))
  //        .then(() => new Promise( resolve => resolve(2)))
  if (x != null && (x instanceof Promise || typeof x === 'object' || typeof x === 'function')) {
    let called = false;
    try {
      // [2.3.3.1] 把 x.then 赋值给 then
      // 存储了一个指向 x.then 的引用，以避免多次访问 x.then 属性，这种预防措施确保了该属性的一致性，因为其值可能在检索调用时被改变。
      const then = x.then;

      // [2.3.3.3] 如果 then 是函数（默认为是一个 promise），将 x 作为函数的作用域 this 调用之。
      // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise (成功回调) ，第二个参数叫做 rejectPromise（失败回调）
      if (typeof then === 'function') {

        // then.call(x, resolvePromise, rejectPromise) 等价于 x.then(resolvePromise, rejectPromise)，笔者理解此时会调用到 x 即 MayJunPromise 我们自己封装的 then 方法上
        then.call(x, y => { // [2.3.3.3.1] 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
            if (called) return;
            called = true;
            resolveMayJunPromise(promise2, y, resolve, reject);
        }, e => { // [2.3.3.3.2] 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          if (called) return;
          called = true;

          reject(e);
        });
      } else {
        // [2.3.3.4 ] 如果 then 不是函数，以 x 为参数执行 promise
        resolve(x)
      }
    } catch(e) { // [2.3.3.2] 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      if (called) return;
      called = true;

      reject(e);
    }
  } else {
    resolve(x);
  }
}
```

### 4. 验证你的 Promise 是否正确

Promise 提供了一个测试脚本，进行正确性验证。

```javascript
npm i -g promises-aplus-tests
promises-aplus-tests mayjun-promise.js
```


同时需要暴露出一个 deferred 方法。

```javascript
MayJunPromise.defer = MayJunPromise.deferred = function () {
  let dfd = {}
  dfd.promise = new MayJunPromise((resolve,reject)=>{
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

module.exports = MayJunPromise;
```

### 5. catch、resolve、reject、all、race 方法实现

Promise/A+ 规范中只提供了 then 方法，但是我们使用的 catch、Promise.all、Promise.race 等都可以在 then 方法的基础上进行实现

```javascript
class MayJunPromise {
   constructor(fn){...}
  then(){...},
  /**
   * 捕获错误
   * @param { Function } onRejected 
   */
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
}

/**
 * 仅返回成功态，即 status = fulfilled
 */
MayJunPromise.resolve = function(value) {
  return (value instanceof Promise || value instanceof MayJunPromise) ? value // 如果是 Promise 实例直接返回
    : new MayJunPromise(resolve => resolve(value));
}

/**
 * 仅返回失败态，即 status = rejected
 */
MayJunPromise.reject = function(value) {
  return (value instanceof Promise || value instanceof MayJunPromise) ? value : new MayJunPromise(reject => reject(value));
}

/**
 * MayJunPromise.all() 并行执行
 * @param { Array } arr
 * @returns { Array }
 */
MayJunPromise.all = function(arr) {
  return new MayJunPromise((resolve, reject) => {
    const length = arr.length;
    let results = []; // 保存执行结果
    let count = 0; // 计数器

    for (let i=0; i<length; i++) {
      MayJunPromise.resolve(arr[i]).then(res => {
        results[i] = res;
        count++;

        if (count === length) { // 全部都变为 fulfilled 之后结束
          resolve(results);
        }
      }, err => reject(err)); // 只要有一个失败，就将失败结果返回
    }
  });
}

/**
 * MayJunPromise.race() 率先执行，只要一个执行完毕就返回结果;
 */
MayJunPromise.race = function(arr) {
  return new MayJunPromise((resolve, reject) => {
    for (let i=0; i<arr.length; i++) {
      MayJunPromise.resolve(arr[i])
        .then(result => resolve(result), err => reject(err));
    }
  })
}
```

### 6. 并发请求控制

Promise.all 同时将请求发出，假设我现在有上万条请求，势必会造成服务器的压力，如果我想限制在最大并发 100 该怎么做？例如，在 Chrome 浏览器中就有这样的限制，Chrome 中每次最大并发链接为 6 个，其余的链接需要等待其中任一个完成，才能得到执行，下面定义 allByLimit 方法实现类似功能。

```javascript
/**
 * 并发请求限制
 * @param { Array } arr 并发请求的数组
 * @param { Number } limit 并发限制数
 */
MayJunPromise.allByLimit = function(arr, limit) {
  const length = arr.length;
  const requestQueue = [];
  const results = [];
  let index = 0;

  return new MayJunPromise((resolve, reject) => {
    const requestHandler = function() {    
      console.log('Request start ', index);
      const request = arr[index]().then(res => res, err => {
        console.log('Error', err);

        return err;
      }).then(res => {
        console.log('Number of concurrent requests', requestQueue.length)
        const count = results.push(res); // 保存所有的结果

        requestQueue.shift(); // 每完成一个就从请求队列里剔除一个

        if (count === length) { // 所有请求结束，返回结果
          resolve(results);
        } else if (count < length && index < length - 1) {
          ++index;
          requestHandler(); // 继续下一个请求
        }
      });

      if (requestQueue.push(request) < limit) {
        ++index;
        requestHandler();
      }
    };

    requestHandler()
  });
}
```

测试，定义一个 sleep 睡眠函数，模拟延迟执行

```javascript
/**
 * 睡眠函数
 * @param { Number } ms 延迟时间|毫秒
 * @param { Boolean } flag 默认 false，若为 true 返回 reject 测试失败情况
 */
const sleep = (ms=0, flag=false) => new Promise((resolve, reject) => setTimeout(() => {
  if (flag) {
    reject('Reject ' + ms);
  } else {
    resolve(ms);
  }
}, ms));

MayJunPromise.allByLimit([
  () => sleep(5000, true),
  () => sleep(1000),
  () => sleep(1000),
  () => sleep(4000),
  () => sleep(10000),
], 3).then(res => {
  console.log(res);
});

// 以下为运行结果
Request start  0
Request start  1
Request start  2
Number of concurrent requests 3
Request start  3
Number of concurrent requests 3
Request start  4
Error Reject 5000
Number of concurrent requests 3
Number of concurrent requests 2
Number of concurrent requests 1
[ 1000, 1000, 'Reject 5000', 4000, 10000 ]
```

### [7. Promise reference](https://www.nodejs.red/#/es6/promise?id=_7-promise-reference)

- https://zhuanlan.zhihu.com/p/21834559
- https://juejin.im/post/5b2f02cd5188252b937548ab
- https://promisesaplus.com/
- https://www.ituring.com.cn/article/66566



# Iterator 迭代器

JavaScript 中除了 Array 之外，ES6 还新增加了 Map、Set 结构，当我们需要操作这些数据时，就需要一种统一的接口来处理这些不同的数据结构。ES6 中新增加的 Iterator（迭代器）就提供了这样一种机制。

## Symbol.iterator 支持的数据结构

ES6 中提供了 Symbol.iterator 方法，该方法返回一个迭代器对象，目前 Array、Set、Map 这些数据结构默认具有 Symbol.iterator 属性，如下所示，可以看到 Object 类型是没有的。

```javascript
console.log([][Symbol.iterator]()); // Object [Array Iterator] {}
console.log((new Map())[Symbol.iterator]()); // [Map Entries] {  }
console.log((new Set())[Symbol.iterator]()); // [Set Iterator] {  }
console.log({}[Symbol.iterator]); // undefined
```

除了上面提到这些数据结构，JavaScript 中一些类似数组的对象也默认具有 Symbol.iterator 属性，例如：字符串、arguments 对象、DOM 的 NodeList 对象。

- 字符串

```javascript
const str = 'nodejs';
console.log(str[Symbol.iterator]()); // Object [String Iterator] {}

for (const val of str) {
  console.log(val); // n o d e j s
}
```

- arguments 对象

```javascript
function print() {
  console.log(arguments[Symbol.iterator]()); // Object [Array Iterator] {}
  for (const val of arguments) {
    console.log(val); // n o d e
  }
}
print('n', 'o', 'd', 'e')
```

- DOM NodeList 对象

```javascript
const divNodeList = document.getElementsByTagName('div')
console.log(divNodeList[Symbol.iterator]()) // Array Iterator {}
for (const div of divNodeList) {
    // 会输出每个 div 标签
    console.log(div);
}
```

## 迭代器对象的 next 方法

调用可迭代对象的 Symbol.iterator 方法会返回一个迭代器对象，它的接口中有一个 next 方法，该方法返回 value 和 done 两个属性，其中 value 属性是当前成员的值，done 属性表示遍历是否结束。

了解生成器函数（Generator）的可能不会陌生，同样的当你执行一个生成器函数也会得到一个迭代器对象，但是要区分 **生成器和迭代器不是一个概念**。

```javascript
const arr = ['N', 'o', 'd', 'e'];
const iterator = arr[Symbol.iterator]();

console.log(iterator.next()); // { value: 'N', done: false }
console.log(iterator.next()); // { value: 'o', done: false }
console.log(iterator.next()); // { value: 'd', done: false }
console.log(iterator.next()); // { value: 'e', done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

上例中声明一个数组 arr，调用 arr 的 Symbol.iterator 方法创建了一个迭代器对象 iterator 之后不断调用 next 方法返回当前数组内容，直到 next 方法返回值 done 为 true 则该数组访问完毕。

## Iterator 接口遍历

### 解构赋值

数组、Set、Map 解构赋值时，会默认调用 Symbol.iterator 方法。注意 Map 调用 Symbol.iterator 方法返回的是一个 entries 方法，该方法返回的是一个新的迭代器对象且按插入顺序包含了 Map 对象中每个元素的 [key, value] 数组，所以调用 Map 实例的 keys 或 values 方法也会返回一个新的迭代器对象。

```javascript
const set = new Set().add('n').add('o');
const map = new Map().set('d').set('e');
const [xSet, ySet] = set;
console.log(xSet, ySet) // n o
const [xMap, yMap] = map.keys();
console.log(xMap, yMap) // d e
```

### 扩展运算符

ES6 中的扩展运算符（...）也会默认调用数组、Set、Map 等结构的 Symbol.iterator 方法。

```javascript
const set = new Set('node');
const [x, y, ...z] = set;
console.log(x, y, z); // n o [ 'd', 'e' ]
```

### for...of 循环

ES6 借鉴了 C++、Python 等语言引入了 for...of 循环，该循环内部也会调用 Symbol.iterator 方法，只要具有 Iterator 接口的数据结构都可以使用。

```javascript
const set = new Set().add('n').add('o');

for (const val of set) {
  console.log(val);
}
```

for...of 循环在执行中还可以使用 break; 中断迭代器的执行。以下示例，修改循环语句在执行第一次 val 等于 n 之后执行 break。

```javascript
for (const val of set) {
  console.log(val); // n
  if (val === 'n') break;
}
```

### 其它方法

数组默认是支持 Iterator 接口，所以任何接收数组做为参数的方法也都会默认调用 Symbol.iterator 方法，如下所示：

```javascript
const set = new Set().add('n').add('o');
console.log(Array.from(set)); // [ 'n', 'o' ]
Promise.all(set).then(val => console.log(val)) // [ 'n', 'o' ]
Promise.race(set).then(val => console.log(val)) // n
```

## 自定义迭代器

### 迭代协议

- 参照可迭代协议，要成为可迭代对象首先要有一个 **@@iterator **即（Symbol.iterator）属性，该属性为一个无参数的函数，返回一个符合迭代器协议的对象。
- 根据迭代器协议定义这个迭代器对象要返回一个 next() 方法，这个 next() 方法返回一个包含 value、done 属性的对象。

```javascript
const  myIterator = {
  // for...of 循环会用到
  [Symbol.iterator]: function() { return this },
  
  // 标准的迭代器接口方法
  next: function() {
      // ...
  }
}
```

如果用 TypeScript 写法描述如下：

```typescript
// 遍历器接口 Iterable
interface Iterable {
    [Symbol.iterator]: Iterator
}

// 迭代器对象
interface Iterator {
    next(value?: any): IterationResult,
}

// next 方法返回值定义
interface IterationResult {
    value: any,
  done: boolean
}
```

### 基于普通函数的迭代器实现

迭代器的函数实现可以是一个普通函数也可以是一个生成器函数，我们先以普通函数为例，定义一个 Range 构造函数，用来输出两个数值区域的所有值。

```typescript
function Range(start, end) {
  this.id = start;
  this.end = end;
}
Range.prototype[Symbol.iterator] = function() { return this }
Range.prototype.next = function next() {
  if (this.id > this.end) {
    return { value: undefined, done: true }
  }

  return { value: this.id++, done: false }
}
const r1 = new Range(0, 3);
const it = r1[Symbol.iterator]()
for (const id of r1) {
  console.log(id); // 0,1,2,3
}
```

### 基于生成器函数的迭代器实现

使用生成器函数（Generator）实现是最简单的，只要使用 yield 语句返回每一次的值即可。如下所示：

```typescript
Range.prototype[Symbol.iterator] = function* () {
  while (this.id <= this.end) {
    yield this.id++;
  }
}
```

## 异步迭代器

到目前为止我们上面讲解的都是同步模式的迭代器，这个很好理解，因为我们的数据源本身也就是同步的，但是在 Node.js 中一次网络 I/O 请求或者一次文件 I/O 请求，它们都是基于事件是异步的，所以我们就不能像使用 Symbol.iterator 的方式来使用。

ECMAScript 2018 标准中提供了 **Symbol.asyncIterator **属性，这是一个异步迭代器，如果一个对象设置了该属性，它就是异步可迭代对象，相应的我们要使用 for await...of 循环遍历数据。

### 自定义异步迭代器

```typescript
function Range(start, end) {
  this.id = start;
  this.end = end;
}
// 与上面不同，function 前我们增加了 async 关键字
Range.prototype[Symbol.asyncIterator] = async function* () {
  while (this.id <= this.end) {
    yield this.id++;
  }
}
const r1 = new Range(0, 3);
console.log(r1[Symbol.asyncIterator]()); // Object [AsyncGenerator] {}
for await (const id of r1) {
  console.log(id); // 0,1,2,3
}
```

### 与同步迭代器的不同

- 同步迭代器返回的是一个常规的  { value, done } 对象，而异步迭代器返回的是一个包含  { value, done } 的 Promise 对象。
- 同步可迭代协议具有 Symbol.iterator 属性，异步可迭代协议具有 Symbol.asyncIterator 属性。
- 同步迭代器使用 for...of 循环遍历，异步迭代器使用 for await...of 循环遍历。

### 异步迭代器的支持

> 目前没有默认设定了 [Symbol.asyncIterator] 属性的 JavaScript 内建的对象。不过，WHATWG（网页超文本应用技术工作小组）Streams 会被设定为第一批异步可迭代对象，[Symbol.asyncIterator] 最近已在设计规范中落地。

下一节我们将会讲解异步迭代器在 Node.js 中的使用，欢迎关注。

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator)



# Decorators修饰器

> 修饰器是一个函数，通过修饰器能修改类的行为，也可理解为扩展类的功能，在类这个范围内有效。

## 插件

> 使用修饰器还需要安装一个插件 `import babel-plugin-transform-decorators-legacy`在.babelrc文件中引入如下文件：

```
.babelrc
{
  "plugins":["transform-decorators-legacy"]
}
```

**`注意：`** ES6中默认开启严格模式，要在ES5中使用需要有这句命令 `use strict` 强制开启严格模式。

## 案例

- **案例一：限制某个属性为只读**

> 修饰器的第三方js库:core-decorators; npm install core-decorators，import引入后，直接在项目中写@readonly就可以了，不用向下面在定义readonly

```javascript
{
  let readonly = function(target,name,descriptor){
    descriptor.writable = false;
    return descriptor;
  }

  class Test{
    @readonly
    time(){
      return '2017-06-14';
    }
  }

  let t1 = new Test();
  console.log(t1.time()); //2017-06-14

  let t2 = new Test();

  //此时 time为只读 再次设置将会报下面错误
  t2.time = function(){
    console.log('reset time');
  }

  console.log(t2.time());
  //Uncaught TypeError: Cannot assign to read only property 'time' of object '#<Test>'
}
```

- **案例一：点击统计**

> 日志系统，比如广告，我们会为其做展示、点击统计

```javascript
{
  //先写一个修饰器，type表示的是show 还是 click
  let log = (type) => {
    return function(target,name,descriptor){
      //保存一下原始的函数体
      let src_method = descriptor.value;
      //重新进行赋值
      descriptor.value = (...arg) => {
        src_method.apply(target,arg);
        //如果将来发送买点接口变了，只需要改log对应的这个方法就可以了
        console.info(`log ${type} `);
      }
    }
  }

  class AD{
    @log('show')
    show(){
      console.info('ad is show');
    }

    @log('click')
    click(){
      console.info('ad is click');
    }
  }

  let ad = new AD();

  ad.show();
  ad.click();
}
```

[ PREVIOUS](https://www.nodejs.red/#/es6/iterator)



# Symbol

> ES6引入了一种新的数据类型Symbol，表示独一无二的值。

## 变量定义

- **Symbol()**

> Symbol声明的变量都是唯一的

```js
let a1=Symbol();
let a2=Symbol();

console.log(a1===a2); //false
```

- **Symbol.for()**

> Symbol.for(str)首先会在全局中搜索有没有以该参数作为名称的Symbol值，如果有直接返回；如果没有，新建并返回一个以该字符串为名称的Symbol值。

```js
let a3=Symbol.for('a3');
let a4=Symbol.for('a3');

console.log(a3===a4); // true
```

## 遍历

```js
let a1=Symbol.for('abc');
let obj={
    [a1]:'123',
    'abc':345,
    'c':456
};

console.log('obj',obj); // obj Object {abc: 345, c: 456, Symbol(abc): "123"}
```

- **for of**

> 使用for of不能遍历出Symbol定义的变量

```js
for(let [key,value] of Object.entries(obj)){
  console.log('let of',key,value);
}

// 输出：let of abc 345 let of c 456
```

- **getOwnPropertySymbols()**

> getOwnPropertySymbols()只获取Symbol定义的值

```js
Object.getOwnPropertySymbols(obj).forEach(function(item){
  console.log(obj[item]); //123
})
```

- **ownKeys**

> 遍历出所有的值

```js
Reflect.ownKeys(obj).forEach(function(item){
  console.log('ownkeys',item,obj[item]);
})

// 输出：
// ownkeys abc 345
// ownkeys c 456
// ownkeys Symbol(abc) 123
```

## iterator

> for-of 语句，它首先调用被遍历集合对象的Symbol.iterator() 方法，该方法返回一个迭代器对象，迭代器对象可以是拥有 .next 方法的任何对象；然后，在 for-of 的每次循环中，都将调用该迭代器对象上的 .next 方法。

```javascript
{
  let arr=['hello','world'];
  // 下面这种写法 数组直接调用Symbol.iterator这个接口，这个接口是数组内部已经帮我们实现了的，我们直接调用即可。
  let map=arr[Symbol.iterator]();
  
  console.log(map.next());
  console.log(map.next());
  console.log(map.next());
  // 输出结果：done是ture表示没有下一步了，如果是false说明循环并没有结束
  // Object {value: "hello", done: false}
  // Object {value: "world", done: false}
  // Object {value: undefined, done: true}
}

{
  //数组索引是从0开始，内置了iterator接口，但是Object并没有帮我们部署Iterator接口。
  //对对象 自定义iterator接口，使其可以实现for of循环
  let obj={
    start:[1,3,2],
    end:[7,9,8],
    [Symbol.iterator](){
      let self=this;
      let index=0;
      //start 和 end 合并成一个数组
      let arr=self.start.concat(self.end);
      let len=arr.length;
      return {
        next(){
          if(index<len){
            return {
              value:arr[index++],
              done:false
            }
          }else{
            return {
              value:arr[index++],
              done:true
            }
          }
        }
      }
    }
  }
  for(let key of obj){
    console.log(key);
  }
}

{
  let arr=['hello','world'];
  for(let value of arr){
    console.log('value',value);
  }
}
```



# Generator

> Generator是一种异步编程的解决方案，异步编程早期使用回调之后Promise也可以解决这个问题，而Generator也是用来解决这个问题的，但是相对于Promise会更高级一点。Generator返回的就是一个Iterator接口。

**`提示：`** `index.js:126 Uncaught ReferenceError: regeneratorRuntime is not defined` **`需要：`** `import 'babel-polyfill'`

```javascript
{
  let tell = function* (){
    yield 'a';
    yield 'b';
    return 'c';
  }
  let t = tell();
  console.log(t.next());
  console.log(t.next());
  console.log(t.next());
  //Object {value: "a", done: false}
  //Object {value: "b", done: false}
  //Object {value: "c", done: true}
}
```

> Generator就是一个遍历器生成函数，所以我们直接可以把它赋值Symbol.iterator,从而使这个对象也具备这个iterator接口

```javascript
 //Generator一种新的应用
 {
   let obj = {};
   obj[Symbol.iterator] = function* (){
     yield 1;
     yield 2
     yield 3;
   }
   for(let value of obj){
     console.log('value',value);
   }
   //运行结果:
   //value 1
   //value 2
   //value 3
 }
```

> Generator最好是用在状态机，是JS编程中比较高级的用法，比如我们需要有a b c三种状态去描述一个事物，也就是这个事务只存在3种状态a-b b-c c-a 总之就是三种循环，永远跑不出第四种状态，用Generator函数去处理这种状态机是特别适用的

```javascript
{
  let state = function* (){
    while(1){
      yield 'A';
      yield 'B';
      yield 'C';
    }
  }
  let status = state();
  /*
    console.log(status.next()); //A
    console.log(status.next()); //B
    console.log(status.next()); //C
    console.log(status.next()); //A
    console.log(status.next()); //B  
  */
  setInterval(function(){
    console.log(status.next());
  },1000);
}
{
  //async await这种写法并不是一种新的写法，只是Generator的一种语法糖
  let state = async function(){
    while(1){
      await 'A';
      await 'B';
      await 'C';
    }
  }
  let status = state();
  console.log(status.next());
  console.log(status.next());
  console.log(status.next());
  console.log(status.next());
  console.log(status.next());
}
```

通过Generator实现抽奖

```javascript
{
  let draw = function(count){
    //具体抽奖逻辑
    console.log(`剩余${count}次`);
  }
  let residue = function* (count){
    while(count > 0){
      count--;
      yield draw(count);
    }
  }
  let start = residue(5);
  let btn = document.createElement('button');
  btn.id = 'start';
  btn.textContent = '抽奖';
  document.body.appendChild(btn);
  document.getElementById('start').addEventListener('click',function(){
    start.next();
  },false);
}
```

如果服务端的某个数据状态定期的去变化，那么前端需要定时的去服务端取这个状态，因为http是无状态的链接，如果要实时的去取服务端的这种变化有两种方法，一个是长轮询，一个是通过websocket，websocket浏览器兼容性不好，因此长轮询还是一个普遍的用法 一种做法是通过定时器，不断的去访问接口 第二种是使用Generator

```javascript
{
  //长轮询
  let ajax = function* (){
    yield new Promise(function(resolve,reject){
      //这里模拟api成功执行后 执行resolve,比如下面的{code:0}，意思是返回接口成功执行后的数据
      setTimeout(function(){
        resolve({code:1})
      },200);
    });
  }

  let pull = function(){
    let generator = ajax();
    let step = generator.next(); //会返回一个promise对象实例，会对服务器端接口进行一次查询链接，上面采用setTimeout200毫秒来模拟
    //这个value就是代表了 promise实例，then是异步操作
    step.value.then(function(d){ //这个d是后端通讯的数据，这里就是上面的{code:0}
      if (d.code != 0) {
        //如果不等于 不是最新的数据，我们让每1秒钟执行一次
        setTimeout(function(){
          console.info('wait');
          pull();
        },1000)
      }else{
        //如果拿到最新数据，这里就打印出来
        console.log(d);
      }
    })
  }
  pull()
}
```

****

# Generator 实现

Generator 是 ES6 中新增的语法，和 Promise 一样，都可以用来异步编程

```js
// 使用 * 表示这是一个 Generator 函数// 内部可以通过 yield 暂停代码// 通过调用 next 恢复执行function* test() {  let a = 1 + 2;  yield 2;  yield 3;}let b = test();console.log(b.next()); // >  { value: 2, done: false }console.log(b.next()); // >  { value: 3, done: false }console.log(b.next()); // >  { value: undefined, done: true }
```

从以上代码可以发现，加上 `*` 的函数执行后拥有了 `next` 函数，也就是说函数执行后返回了一个对象。每次调用 `next` 函数可以继续执行被暂停的代码。以下是 Generator 函数的简单实现

```js
 复制代码// cb 也就是编译过的 test 函数function generator(cb) {  return (function() {    var object = {      next: 0,      stop: function() {}    };    return {      next: function() {        var ret = cb(object);        if (ret === undefined) return { value: undefined, done: true };        return {          value: ret,          done: false        };      }    };  })();}// 如果你使用 babel 编译后可以发现 test 函数变成了这样function test() {  var a;  return generator(function(_context) {    while (1) {      switch ((_context.prev = _context.next)) {        // 可以发现通过 yield 将代码分割成几块        // 每次执行 next 函数就执行一块代码        // 并且表明下次需要执行哪块代码        case 0:          a = 1 + 2;          _context.next = 4;          return 2;        case 4:          _context.next = 6;          return 3;        // 执行完毕        case 6:        case "end":          return _context.stop();      }    }  });}
```



# Map、FlatMap 和 Reduce

`Map` 作用是生成一个新数组，遍历原数组，将每个元素拿出来做一些变换然后 `append` 到新的数组中。

```js
[1, 2, 3].map((v) => v + 1)// -> [2, 3, 4]
```

`Map` 有三个参数，分别是当前索引元素，索引，原数组

```js
['1','2','3'].map(parseInt)//  parseInt('1', 0) -> 1//  parseInt('2', 1) -> NaN//  parseInt('3', 2) -> NaN
```

`FlatMap` 和 `map` 的作用几乎是相同的，但是对于多维数组来说，会将原数组降维。可以将 `FlatMap` 看成是 `map` + `flatten` ，目前该函数在浏览器中还不支持。

```js
[1, [2], 3].flatMap((v) => v + 1)// -> [2, 3, 4]
```

如果想将一个多维数组彻底的降维，可以这样实现

```js
const flattenDeep = (arr) => Array.isArray(arr)  ? arr.reduce( (a, b) => [...a, ...flattenDeep(b)] , [])  : [arr]flattenDeep([1, [[2], [3, [4]], 5]])
```

`Reduce` 作用是数组中的值组合起来，最终得到一个值

```js
 复制代码function a() {    console.log(1);}function b() {    console.log(2);}[a, b].reduce((a, b) => a(b()))// -> 2 1
```



# async 和 await

一个函数如果加上 `async` ，那么该函数就会返回一个 `Promise`

```js
async function test() {  return "1";}console.log(test()); // -> Promise {<resolved>: "1"}
```

可以把 `async` 看成将函数返回值使用 `Promise.resolve()` 包裹了下。

`await` 只能在 `async` 函数中使用

```js
function sleep() {  return new Promise(resolve => {    setTimeout(() => {      console.log('finish')      resolve("sleep");    }, 2000);  });}async function test() {  let value = await sleep();  console.log("object");}test()
```

上面代码会先打印 `finish` 然后再打印 `object` 。因为 `await` 会等待 `sleep` 函数 `resolve` ，所以即使后面是同步代码，也不会先去执行同步代码再来执行异步代码。

`async 和 await` 相比直接使用 `Promise` 来说，优势在于处理 `then` 的调用链，能够更清晰准确的写出代码。缺点在于滥用 `await` 可能会导致性能问题，因为 `await` 会阻塞代码，也许之后的异步代码并不依赖于前者，但仍然需要等待前者完成，导致代码失去了并发性。

下面来看一个使用 `await` 的代码。

```js
var a = 0var b = async () => {  a = a + await 10  console.log('2', a) // -> '2' 10  a = (await 10) + a  console.log('3', a) // -> '3' 20}b()a++console.log('1', a) // -> '1' 1
```

对于以上代码你可能会有疑惑，这里说明下原理

- 首先函数 `b` 先执行，在执行到 `await 10` 之前变量 `a` 还是 0，因为在 `await` 内部实现了 `generators` ，`generators` 会保留堆栈中东西，所以这时候 `a = 0` 被保存了下来
- 因为 `await` 是异步操作，遇到`await`就会立即返回一个`pending`状态的`Promise`对象，暂时返回执行代码的控制权，使得函数外的代码得以继续执行，所以会先执行 `console.log('1', a)`
- 这时候同步代码执行完毕，开始执行异步代码，将保存下来的值拿出来使用，这时候 `a = 10`
- 然后后面就是常规执行代码了



# Proxy

Proxy 是 ES6 中新增的功能，可以用来自定义对象中的操作

```js
let p = new Proxy(target, handler);// `target` 代表需要添加代理的对象// `handler` 用来自定义对象中的操作
```

可以很方便的使用 Proxy 来实现一个数据绑定和监听

```js
 复制代码let onWatch = (obj, setBind, getLogger) => {  let handler = {    get(target, property, receiver) {      getLogger(target, property)      return Reflect.get(target, property, receiver);    },    set(target, property, value, receiver) {      setBind(value);      return Reflect.set(target, property, value);    }  };  return new Proxy(obj, handler);};let obj = { a: 1 }let valuelet p = onWatch(obj, (v) => {  value = v}, (target, property) => {  console.log(`Get '${property}' = ${target[property]}`);})p.a = 2 // bind `value` to `2`p.a // -> Get 'a' = 2
```

