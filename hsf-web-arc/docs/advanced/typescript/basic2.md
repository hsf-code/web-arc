---
title: 基础（二）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# 4.函数类型

## 一.函数的两种声明方式

- 通过function关键字来进行声明

  ```ts
  function sum(a: string, b: string):string {
      return a+b;
  }
  sum('a','b')
  ```

  > 可以用来限制函数的参数和返回值类型

- 通过表达式方式声明

  ```ts
  type Sum = (a1: string, b1: string) => string;
  let sum: Sum = (a: string, b: string) => {
      return a + b;
  };
  ```

## 二.可选参数

```js
let sum = (a: string, b?: string):string => {
    return a + b;
};
sum('a'); // 可选参数必须在其他参数的最后面
```

## 三.默认参数

```ts
let sum = (a: string, b: string = 'b'): string => {
    return a + b;
};
sum('a'); // 默认参数必须在其他参数的最后面
```

## 四.剩余参数

```ts
const sum = (...args: string[]): string => {
    return args.reduce((memo, current) => memo += current, '')
}
sum('a', 'b', 'c', 'd')
```

## 五.函数的重载

```js
function toArray(value: number): number[]
function toArray(value: string): string[]
function toArray(value: number | string) {
    if (typeof value == 'string') {
        return value.split('');
    } else {
        return value.toString().split('').map(item => Number(item));
    }
}
toArray(123); // 根据传入不同类型的数据 返回不同的结果
toArray('123');
```

# 5.类

## 一.TS中定义类

```js
class Pointer{
    x!:number; // 实例上的属性必须先声明
    y!:number;
    constructor(x:number,y?:number,...args:number[]){
        this.x = x;
        this.y = y as number;
    }
}
let p = new Pointer(100,200);
```

> 实例上的属性需要先声明在使用，构造函数中的参数可以使用可选参数和剩余参数

## 二.类中的修饰符

- `public`修饰符（谁都可以访问到）

  ```tsx
  class Animal {
      public name!: string; // 不写public默认也是公开的
      public age!: number;
      constructor(name: string, age: number) {
          this.name = name;
          this.age = age;
      }
  }
  class Cat extends Animal {
      constructor(name: string, age: number) {
          super(name, age);
          console.log(this.name,this.age); // 子类访问
      }
  }
  let p = new Cat('Tom', 18);
  console.log(p.name,p.age); // 外层访问
  ```

  ```ts
  class Animal {
      constructor(public name: string, public age: number) {
          this.name = name;
          this.age = age;
      }
  }
  ```

  > 我们可以通过参数属性来简化父类中的代码

- `protected`修饰符 (自己和子类可以访问到)

  ```ts
  class Animal {
      constructor(protected name: string, protected age: number) {
          this.name = name;
          this.age = age;
      }
  }
  class Cat extends Animal {
      constructor(name: string, age: number) {
          super(name, age);
          console.log(this.name, this.age)
      }
  }
  let p = new Cat('Tom', 18);
  console.log(p.name,p.age);// 无法访问
  ```

- `private`修饰符 （除了自己都访问不到）

  ```ts
  class Animal {
      constructor(private name: string, private age: number) {
          this.name = name;
          this.age = age;
      }
  }
  class Cat extends Animal {
      constructor(name: string, age: number) {
          super(name, age);
          console.log(this.name, this.age); // 无法访问
      }
  }
  let p = new Cat('Tom', 18); 
  console.log(p.name,p.age);// 无法访问
  ```

- `readonly`修饰符 （仅读修饰符）

  ```tsx
  class Animal {
      constructor(public readonly name: string, public age: number) {
          this.name = name;
          this.age = age;
      }
      changeName(name:string){
          this.name = name; // 仅读属性只能在constructor中被赋值
      }
  }
  class Cat extends Animal {
      constructor(name: string, age: number) {
          super(name, age);
      }
  }
  let p = new Cat('Tom', 18); 
  p.changeName('Jerry');
  ```

## 三.静态属性和方法

```ts
class Animal {
    static type = '哺乳动物'; // 静态属性
    static getName() { // 静态方法
        return '动物类';
    }
    private _name: string = 'Tom';

    get name() { // 属性访问器
        return this._name;
    }
    set name(name: string) {
        this._name = name;
    }
}
let animal = new Animal();
console.log(animal.name);
```

> 静态属性和静态方法是可以被子类所继承的

## 四.Super属性

```tsx
class Animal {
    say(message:string){
        console.log(message);
    } 
    static getType(){
        return '动物'
    }
}
class Cat extends Animal {
    say(){ // 原型方法中的super指代的是父类的原型
        super.say('猫猫叫');
    }
    static getType(){ // 静态方法中的super指代的是父类
        return super.getType()
    }
}
let cat = new Cat();
console.log(Cat.getType())
```

## 五.类的装饰器

### 1.装饰类

```ts
function addSay(target:any){
    target.prototype.say = function(){console.log('say')}
}
@addSay
class Person {
    say!:Function
}
let person = new Person
person.say();
```

> 装饰类可以给类扩展功能,需要开启`experimentalDecorators:true`

### 2.装饰类中属性

```tsx
function toUpperCase(target:any,key:string){
    let value = target[key]; 
    Object.defineProperty(target,key,{
        get(){
            return value.toUpperCase();
        },
        set(newValue){
            value = newValue
        }
    })
}
function double(target: any, key: string) {
    let value = target[key];
    Object.defineProperty(target, key, {
        get() {
            return value * 2;
        },
        set(newValue) {value = newValue}
    })
}
class Person {
    @toUpperCase
    name: string = 'JiangWen'
	@double
    static age: number = 10;
    getName() {
        return this.name;
    }
}
let person = new Person();
console.log(person.getName(),Person.age)
```

> 装饰属性可以对属性的内容进行改写，装饰的是实例属性则target指向类的原型、装饰的是静态属性则target执行类本身~

### 3.装饰类中方法

```tsx
function noEnum(target:any,key:string,descriptor:PropertyDescriptor){
    console.log(descriptor)
    descriptor.enumerable = false;
}
class Person {
    @toUpperCase
    name: string = 'JiangWen'
    @double
    static age: number = 10;
    @noEnum
    getName() {
        return this.name;
    }
}
let person = new Person();
console.log(person); // getName 不可枚举
```

### 4.装饰参数

```ts
function addPrefix(target:any,key:string,paramIndex:number){
    console.log(target,key,paramIndex); // Person.prototype getName  0 
}
class Person {
    @toUpperCase
    name: string = 'JiangWen'
    @double
    static age: number = 10;
    prefix!:string
    @noEnum
    getName(@addPrefix prefix:string) {
        return this.name;
    }
}
```

## 六.抽象类

抽象类无法被实例化，只能被继承，抽象方法不能在抽象类中实现，只能在抽象类的具体子类中实现,而且必须实现。

```ts
abstract class Animal{
    name!:string;
    abstract speak():void
}
class Cat extends Animal {
    speak(){
        console.log('猫猫叫');
    }
}
class Dog extends Animal{
    speak():string{
        console.log('汪汪叫');
        return 'wangwang'
    }
}
```

> 定义类型时`void`表示函数的返回值为空（不关心返回值类型，所有在定义函数时也不关心函数返回值类型）

# 6.接口

接口可以在面向对象编程中表示行为的抽象，也可以描述对象的形状。 *接口*的作用就是为这些类型命名和为你的代码或第三方代码定义契约。 (接口中不能含有具体的实现逻辑)

## 一.函数接口参数

```ts
const fullName = ({firstName,lastName}:{firstName:string,lastName:string}):string =>{
    return firstName + lastName
}
```

> 我们可以约束函数中的参数，但是类型无法复用

```ts
interface IFullName {
    firstName:string,
    lastName:string
}
const fullName = ({firstName,lastName}:IFullName):string =>{
    return firstName + lastName
}
```

> 我们可以通过接口进行描述

## 二.函数类型接口

```ts
interface IFullName {
    firstName:string,
    lastName:string
}
interface IFn {
    (obj:IFullName):string
}
const fullName:IFn = ({firstName,lastName})=>{
    return firstName + lastName
}
```

> 通过接口限制函数的参数类型和返回值类型

## 三.函数混合类型

```ts
interface ICounter {
    (): number; // 限制函数类型
    count: 0 // 限制函数上的属性
}
let fn: any = () => {
    fn.count++;
    return fn.count;
}
fn.count = 0;
let counter:ICounter = fn;
console.log(counter());
console.log(counter());
```

## 四.对象接口

对象接口可以用来描述对象的形状结构

```ts
interface IVegetables {
    readonly color:string,
    size:string
}
interface IVegetables{
    age?:number,
    taste:'sour'|'sweet'
}
const tomato:IVegetables = {
    color:'red',
    size:'10',
    taste:'sour'
}
tomato.color = 'green'; // 仅读属性不能进行修改
```

> ？标识的属性为可选属性, `readOnly`标识的属性则不能修改。多个同名的接口会自动合并

```ts
const tomato:IVegetables = {
    color:'red',
    size:'10',
    taste:'sour',
    type:'蔬菜'
} as IVegetables; // 多余的属性可以使用类型断言
```

## 五.任意属性、可索引接口

```ts
interface Person {
    name: string;
    [key: string]: any
}
let p: Person = {
    name: 'zhufeng',
    age: 10,
    [Symbol()]:'回龙观'
}
```

> 任意属性可以对某一部分必填属性做限制，其余的可以随意增减

```ts
interface IArr {
    [key: number]: any
}
let p: IArr = {
    0:'1',1:'2',3:'3'
}
let arr:IArr = [1,'d','c'];
```

> 可索引接口可以用于标识数组

## 六.类接口

这里先来强调一下抽象类和接口的区别,抽象类中可以包含具体方法实现。接口中不能包含实现

```ts
interface Speakable {
    name:string;
    speak():void;
}
interface ChineseSpeakable{
    speakChinese():void
}
class Speak implements Speakable,ChineseSpeakable{
    name!:string
    speak(){}
    speakChinese(){}
}
```

> 一个类可以实现多个接口，在类中必须实现接口中的方法和属性

## 七.接口继承

```ts
interface Speakable {
    speak():void
}
interface SpeakChinese extends Speakable{
    speakChinese():void
}
class Speak implements SpeakChinese{
    speakChinese(): void {
        throw new Error("Method not implemented.");
    }
    speak(): void {
        throw new Error("Method not implemented.");
    }
}
```

## 八.构造函数类型

```ts
interface Clazz {
    new (name:string):any
}
function createClass(target:Clazz,name:string){
    return new target(name); // 传入的是一个构造函数
}
class Animal {
    constructor(public name:string){
        this.name = name;
    }
}
let r = createClass(Animal,'Tom');
```

> 这里无法标识返回值类型

```ts
interface Clazz<T> {
    new(name: string): T
}
function createClass<T>(target: Clazz<T>, name: string):T {
    return new target(name)
}
class Animal {
    constructor(public name: string) {
        this.name = name;
    }
}
let r = createClass(Animal, 'Tom');
```

> new() 表示当前是一个构造函数类型,这里捎带使用了下泛型。 在使用`createClass`时动态传入类型。

# 7.泛型

## 一.指定函数参数类型

- 单个泛型

```ts
const getArray = <T>(times:number,val:T):T[]=>{
    let result:T[] = [];
    for(let i = 0; i<times;i++){
        result.push(val);
    }
    return result;
}
getArray(3,3); // 3 => T => number
```

- 多个泛型

```ts
function swap<T, K>(tuple: [T, K]): [K, T] {
    return [tuple[1], tuple[0]]
}
console.log(swap(['a','b']))
```

## 二.函数标注的方式

- 类型别名

```ts
type TArray = <T, K>(tuple: [T, K]) => [K, T];
const getArray:TArray = <T, K>(tuple: [T, K]): [K, T] => {
    return [tuple[1], tuple[0]]
}
```

> 可以使用类型别名，但是类型别名不能被继承和实现。一般联合类型可以使用类型别名来声明

- 接口

```ts
interface IArray{
    <T,K>(typle:[T,K]):[K,T]
}
const getArray:IArray = <T, K>(tuple: [T, K]): [K, T] => {
    return [tuple[1], tuple[0]]
}
```

> 能使用interface尽量使用interface

## 三.泛型接口使用

```ts
interface ISum<T> { // 这里的T是使用接口的时候传入
    <U>(a: T, b: T): U // 这里的U是调用函数的时候传入
}
let sum: ISum<number> = (a:number, b:number) => {
    return 3 as any
}
```

## 四.默认泛型

```ts
interface T2<T=string>{
    name:T
}
type T22 = T2;
let name1:T22 = {name:'zf'}
```

> 可以指定泛型的默认类型，方便使用

## 五.类中的泛型

- 创建实例时提供类型

```ts
class MyArray<T>{ // T => number
    arr: T[] = [];
    add(num: T) {
        this.arr.push(num);
    }
    getMaxNum(): T {
        let arr = this.arr
        let max = arr[0];
        for (let i = 1; i < arr.length; i++) {
            let current = arr[i];
            current > max ? max = current : null
        }
        return max;
    }
}
let myArr = new MyArray<number>();
myArr.add(3);
myArr.add(1);
myArr.add(2);
console.log(myArr.getMaxNum());
```

- 校验构造函数类型

```ts
const createClass = <T>(clazz: new(name:string,age:number)=>T):T =>{
    return new clazz(name,age);
}
createClass<Person2>(Person2)
```

## 六.泛型约束

- 泛型必须包含某些属性

```ts
interface IWithLength {
    length:number
}
function getLen<T extends IWithLength>(val:T){
    return val.length;
}
getLen('hello');
```

```ts
const sum = <T extends number>(a: T, b: T): T => {
    return (a + b) as T
}
let r = sum<number>(1, 2); 
```

- 返回泛型中指定属性

```ts
const getVal = <T,K extends keyof T>(obj:T,key:K) : T[K]=>{
    return obj[key];
}
```