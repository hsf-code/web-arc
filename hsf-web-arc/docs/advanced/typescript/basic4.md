---
title: 基础（四）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# 12.条件类型

## 一.条件类型基本使用

可以使用`extends`关键字和三元表达式，实现条件判断

```ts
interface Fish {
    name1: string
}
interface Water {
    name2: string
}
interface Bird {
    name3: string
}
interface Sky {
    name4: string
}
type Condition<T> = T extends Fish ? Water : Sky;
let con1: Condition<Fish> = { name2: '水' }
```

## 二.条件类型分发

```ts
let con2: Condition<Fish|Bird> = { name2: '水' } 
```

> 这里会用每一项依次进行分发,最终采用联合类型作为结果,等价于:

```ts
type c1 = Condition<Fish>;
type c2 = Condition<Bird>;
type c = c1 | c2
```

## 三.内置条件类型

- 1.`Exclude`排除类型

```ts
type Exclude<T, U> = T extends U ? never : T;
type MyExclude = Exclude<'1' | '2' | '3', '1' | '2'>
```

- 2.`Extract`抽取类型

```ts
type Extract<T, U> = T extends U ? T : never;
type MyExtract = Extract<'1' | '2' | '3', '1' | '2'>
```

- 3.`NoNullable` 非空检测

```ts
type NonNullable<T> = T extends null | undefined ? never : T
type MyNone = NonNullable<'a' | null | undefined>
```

## 四.infer类型推断

- 1.`ReturnType`返回值类型

```ts
function getUser(a: number, b: number) {
  return { name: 'zf', age: 10 }
}
type ReturnType<T> = T extends (...args: any) => infer R ? R : never
type MyReturn = ReturnType<typeof getUser>
```

- 2.`Parameters` 参数类型

```ts
type Parameters<T> = T extends (...args: infer R) => any ? R : any;
type MyParams = Parameters<typeof getUser>;
```

- 3.`ConstructorParameters`构造函数参数类型

```ts
class Person {
  constructor(name: string, age: number) { }
}
type ConstructorParameters<T> = T extends { new(...args: infer R): any } ? R : never
type MyConstructor = ConstructorParameters<typeof Person>
```

- 4.`InstanceType` 实例类型

```ts
type InstanceType<T> = T extends { new(...args: any): infer R } ? R : any
type MyInstance = InstanceType<typeof Person>
```

## 五.infer实践

将数组类型转化为联合类型

```ts
type ElementOf<T> = T extends Array<infer E> ? E : never;
type TupleToUnion = ElementOf<[string, number, boolean]>;
```

将两个函数的参数转化为交叉类型

```ts
type T1 = { name: string };
type T2 = { age: number };
type ToIntersection<T> = T extends ([(x: infer U) => any, (x: infer U) => any]) ? U : never;
type t3 = ToIntersection<[(x:T1)=>any,(x:T2)=>any]>
```

> 表示要把`T1`、`T2`赋予给x，那么x的值就是`T1`、`T2`的交集。（参数是逆变的可以传父类）

> TS的类型：TS主要是为了代码的安全性来考虑。所以所有的兼容性问题都要从安全性来考虑!

# 13.内置类型

## 一.Partial转化可选属性

```ts
interface Company {
    num: number
}
interface Person {
    name: string,
    age: string,
    company: Company
}
// type Partial<T> = { [K in keyof T]?: T[K] }; 实现原理
type PartialPerson = Partial<Person>;
```

> 遍历所有的属性将属性设置为可选属性,但是无法实现深度转化!

```ts
type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
type DeepPartialPerson = DeepPartial<Person>;
```

> 我们可以实现深度转化,如果值是对象继续深度转化。

## 二.Required转化必填属性

```ts
interface Company {
    num: number
}
interface Person {
    name: string,
    age: string,
    company: Company
}
type PartialPerson = Partial<Person>;
type Required<T> = {[K in keyof T]-?:T[K]} 
type RequiredPerson = Required<PartialPerson>
```

> 将所有的属性转化成必填属性

## 三.Readonly转化仅读属性

```ts
type Readonly<T> = { readonly [K in keyof T]: T[K] }
type RequiredPerson = Readonly<Person>
```

> 将所有属性变为仅读状态

## 四.Pick挑选所需的属性

```ts
type Pick<T, U extends keyof T> = { [P in U]: T[P] }
type PickPerson = Pick<Person, 'name' | 'age'>
```

> 在已有类型中挑选所需属性

## 五.Record记录类型

```ts
type Record<K extends keyof any, T> = { [P in K]  : T }
let person: Record<string, any> = { name: 'zf', age: 11 };
```

实现map方法，我们经常用record类型表示映射类型

```ts
function map<T extends keyof any, K, U>(obj: Record<T, K>, callback: (item: K, key: T) => U) {
    let result = {} as Record<T, U>
    for (let key in obj) {
        result[key] = callback(obj[key], key)
    }
    return result
}
const r = map({ name: 'zf', age: 11 }, (item, key) => {
    return item
});
```

## 六.Omit忽略属性

```ts
let person = {
    name: 'zhufeng',
    age: 11,
    address: '回龙观'
}
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type OmitAddress = Omit<typeof person, 'address'>
```

> 忽略person中的address属性 (先排除掉不需要的key，在通过key选出需要的属性)

# 14.装包和拆包

## 一.装包

```ts
type Proxy<T> = {
    get():T,
    set(value:T):void
}
type Proxify<T> = {
    [P in keyof T]: Proxy<T[P]>
} 
let props = {
    name: 'zhufeng',
    age: 11
}
function proxify<T>(obj:T):Proxify<T>{
    let result = {} as Proxify<T>;
    for(let key in obj){
        let value = obj[key];
        result[key] = {
            get(){
                return value
            },
            set:(newValue)=>value = newValue
        }
    }
    return result
}
let proxpProps = proxify(props);
```

## 二.拆包

```ts
function unProxify<T>(proxpProps:Proxify<T>):T{
    let result = {} as T;
    for(let key in proxpProps){
        let value = proxpProps[key];
        result[key] = value.get()
    }
    return result
}
let proxy = unProxify(proxpProps)
```

# 15.自定义类型

## 一.Diff实现

求两个对象不同的部分

```ts
let person1 = {
    name: 'zhufeng',
    age: 11,
    address: '回龙观'
}
let person2 = {
    address: '回龙观',
}
type Diff<T extends object,K extends Object> = Omit<T,keyof K>
type DiffPerson = Diff<typeof person1,typeof person2>
```

## 二.InterSection交集

```ts
let person1 = {
    name: 'zhufeng',
    age: 11,
    address: '回龙观'
}
let person2 = {
    address: '回龙观',
}
type InterSection<T extends object, K extends object> = Pick<T, Extract<keyof T, keyof K>>
type InterSectionPerson = InterSection<typeof person1, typeof person2>
```

## 三.Overwrite属性覆盖

```ts
type OldProps = { name: string, age: number, visible: boolean };
type NewProps = { age: string, other: string };

type Diff<T extends object,K extends Object> = Omit<T,keyof K>
type InterSection<T extends object, K extends object> = Pick<T, Extract<keyof T, keyof K>>
type Overwrite<T extends object, K extends object, I = Diff<T,K> & InterSection<K,T>> = Pick<I,keyof I>
type ReplaceProps = Overwrite<OldProps, NewProps>
```

> 如果存在已有属性则使用新属性类型进行覆盖操作

## 四.Merge对象合并

```ts
type Compute<A extends any> = { [K in keyof A]: A[K] };
type Merge<T, K> = Compute<Omit<T, keyof K> & K>;
type MergeObj = Merge<OldProps,NewProps>
```

> 将两个对象类型进行合并操作