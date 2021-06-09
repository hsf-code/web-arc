---
title: 基础（三）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# 8.兼容性

TS中的兼容性，主要看结构是否兼容。（核心是考虑安全性）

## 一.基本数据类型的兼容性

```ts
let temp:string | number;
let num!:number;
temp = num;
```

> 你要的我有就可以

```ts
let num:{
    toString():string
}
let str:string = 'zf';
num = str; // 字符串中具备toString()方法，所以可以进行兼容
```

## 二.接口兼容性

```ts
interface IAnimal {
    name: string,
    age: number
}
interface IPerson {
    name: string,
    age: number,
    address: string
}
let animal: IAnimal;
let person: IPerson = {
    name: 'zf',
    age: 11,
    address: '回龙观'
};
animal = person;
```

> 接口的兼容性，只要满足接口中所需要的类型即可！

## 三.函数的兼容性

函数的兼容性主要是比较参数和返回值

- 参数

  ```ts
  let sum1 = (a: string, b: string) => a + b;
  let sum2 = (a: string) => a;
  sum1 = sum2
  ```

  > 赋值函数的参数要少于等于被赋值的函数，与对象相反,例如:

  ```ts
  type Func<T> = (item: T, index: number) => void
  function forEach<T>(arr: T[], cb: Func<T>) {
      for (let i = 0; i < arr.length; i++) {
          cb(arr[i], i);
      }
  }
  forEach([1, 2, 3], (item) => {
      console.log(item);
  });
  ```

- 返回值

  ```ts
  type sum1 = () => string | number
  type sum2 = () => string;
  
  let fn1: sum1;
  let fn2!: sum2;
  fn1 = fn2;
  ```

## 四.函数的逆变与协变

函数的参数是逆变的，返回值是协变的 （在非严格模式下函数的参数是双向协变的）

```ts
class Parent {
    address: string = '回龙观'
}
class Child extends Parent {
    money: number = 100
}
class Grandsom extends Child {
    name: string = '吉姆';
}
type Callback = (person: Child) => Child
function execCallback(cb: Callback) { }
let fn = (person: Parent) => new Grandsom;
execCallback(fn);
```

> 通过这个案例可以说明，函数参数可以接收父类，返回值可以返回子类

## 五.类的兼容性

```ts
class Perent {
    name: string = 'zf';
    age: number = 11
}
class Parent1 {
    name: string = 'zf';
    age: number = 11
}
let parent: Perent = new Parent1
```

> 这里要注意的是，只要有private或者protected关键字类型就会不一致;但是继承的类可以兼容

```ts
class Parent1 {
    protected name: string = 'zf';
    age: number = 11
}
class Child extends Parent1{} 
let child:Parent1 = new Child;
```

## 六.泛型的兼容性

```ts
interface IT<T>{}
let obj1:IT<string>;
let obj2!:IT<number>;
obj1 = obj2;
```

## 七.枚举的兼容性

```ts
enum USER1 {
    role = 1
}
enum USER2 {
    role = 1
}
let user1!:USER1
let user2!:USER2
user1 = user2 // 错误语法
```

> 不同的枚举类型不兼容

# 9.类型保护

通过判断识别所执行的代码块，自动识别变量属性和方法

## 一.typeof类型保护

```ts
function double(val: number | string) {
    if (typeof val === 'number') {
        val
    } else {
        val
    }
}
```

## 二.instanceof类型保护

```ts
class Cat { }
class Dog { }

const getInstance = (clazz: { new(): Cat | Dog }) => {
    return new clazz();
}
let r = getInstance(Cat);
if(r instanceof Cat){
    r
}else{
    r
}
```

## 三.in类型保护

```ts
interface Fish {
    swiming: string,
}
interface Bird {
    fly: string,
    leg: number
}
function getType(animal: Fish | Bird) {
    if ('swiming' in animal) {
        animal // Fish
    } else {
        animal // Bird
    }
}
```

## 四.可辨识联合类型

```ts
interface WarningButton {
    class: 'warning'
}
interface DangerButton {
    class: 'danger'
}
function createButton(button: WarningButton | DangerButton) {
    if (button.class == 'warning') {
        button // WarningButton
    } else {
        button // DangerButton
    }
}
```

## 五.null保护

```ts
const addPrefix = (num?: number) => {
    num = num || 1.1;
    function prefix(fix: string) {
        return fix + num?.toFixed()
    }
    return prefix('zf');
}
console.log(addPrefix());
```

> 这里要注意的是ts无法检测内部函数变量类型

## 六.自定义类型保护

```ts
interface Fish {
    swiming: string,
}
interface Bird {
    fly: string,
    leg: number
}
function isBird(animal: Fish | Bird):animal is Bird {
    return 'swiming' in animal
}
function getAniaml (animal:Fish | Bird){
    if(isBird(animal)){
        animal
    }else{
        animal
    }
}
```

## 七.完整性保护

```ts
interface ICircle {
    kind: 'circle',
    r: number
}
interface IRant {
    kind: 'rant',
    width: number,
    height: number
}
interface ISquare {
    kind: 'square',
    width: number
}
type Area = ICircle | IRant | ISquare
const isAssertion = (obj: never) => { }
const getArea = (obj: Area) => {
    switch (obj.kind) {
        case 'circle':
            return 3.14 * obj.r ** 2
        default:
            return isAssertion(obj); // 必须实现所有逻辑
    }
}
```

# 10.类型推断

## 一.赋值推断

赋值时推断，类型从右像左流动,会根据赋值推断出变量类型

```ts
let str = 'zhufeng';
let age = 11;
let boolean = true;
```

## 二.返回值推断

自动推断函数返回值类型

```ts
function sum(a: string, b: string) {
    return a + b;
}
sum('a','b');
```

## 三.函数推断

函数从左到右进行推断

```ts
type Sum = (a: string, b: string) => string;
const sum: Sum = (a, b) => a + b;
```

## 四.属性推断

可以通过属性值,推断出属性的类型

```ts
let person = {
    name:'zf',
    age:11
}
let {name,age} = person;
```

## 五.类型反推

可以使用`typeof`关键字反推变量类型

```ts
let person = {
    name:'zf',
    age:11
}
type Person = typeof person
```

## 六.索引访问操作符

```ts
interface IPerson {
    name:string,
    age:number,
    job:{
        address:string
    }
}
type job = IPerson['job']
```

## 七.类型映射

```ts
interface IPerson {
    name:string,
    age:number
}
type MapPerson = {[key in keyof IPerson]:IPerson[key]}
```

# 11.交叉类型

交叉类型(Intersection Types)是将多个类型合并为一个类型

```ts
interface Person1 {
    handsome: string,
}
interface Person2 {
    high: string,
}
type P1P2 = Person1 & Person2;
let p: P1P2 = { handsome: '帅', high: '高' }
```

> 举例：我们提供两拨人，一拨人都很帅、另一拨人很高。我们希望找到他们的交叉部分 => 又高又帅的人

- 交叉类型

```ts
function mixin<T, K>(a: T, b: K): T & K {
    return { ...a, ...b }
}
const x = mixin({ name: 'zf' }, { age: 11 })
```

```ts
interface IPerson1 {
    name:string,
    age:number
}

interface IPerson2 {
    name:number
    age:number
}
type person = IPerson1 & IPerson2
let name!:never
let person:person = {name,age:11};  // 两个属性之间 string & number的值为never
```