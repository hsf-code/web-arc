---
title: 基础（五）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# 16.unknown

## 一.unknown类型

`unknown`类型，任何类型都可以赋值为`unknown`类型。 它是 any 类型对应的安全类型

```ts
let unknown:unknown;
unknown = 'zf';
unknown = 11;
```

> 不能访问unknown类型上的属性，不能作为函数、类来使用

- 联合类型中的`unknown`

  ```ts
  type UnionUnknown = unknown | null | string | number
  ```

  > 联合类型与`unknown`都是`unknown`类型

- 交叉类型中的`unknown`

  ```ts
  type inter = unknown & null
  ```

  > 交叉类型与`unknown`都是其他类型

## 二.unknown特性

- never是unknown的子类型

  ```ts
  type isNever = never extends unknown ? true : false;=
  ```

- keyof unknown 是never

  ```ts
  type key = keyof unknown;
  ```

- unknown类型不能被遍历

  ```ts
  type IMap<T> = {
      [P in keyof T]:number
  }
  type t = IMap<unknown>;
  ```

> unknown类型不能和number类型进行 `+`运算,可以用于等或不等操作

# 17.模块和命名空间

> 默认情况下 ,我们编写的代码处于全局命名空间中

## 一.模块

文件模块： 如果在你的 TypeScript 文件的根级别位置含有 import 或者 export，那么它会在这个文件中创建一个本地的作用域 。

```ts
// a.ts导出
export default 'zf'

// index.ts导入
import name from './a'
```

## 二.命名空间

> 命名空间可以用于组织代码，避免文件内命名冲突

- 命名空间的使用

  ```ts
  export namespace zoo {
      export class Dog { eat() { console.log('zoo dog'); } }
  }
  export namespace home {
      export class Dog { eat() { console.log('home dog'); } }
  }
  
  let dog_of_zoo = new zoo.Dog();
  dog_of_zoo.eat();
  let dog_of_home = new home.Dog();
  dog_of_home.eat();
  ```

- 命名空间嵌套使用

  ```ts
  export namespace zoo {
      export class Dog { eat() { console.log('zoo dog'); } }
      export namespace bear{
          export const name = '熊'
      } 
  }
  console.log(zoo.bear.name); 
  ```

  > 命名空间中导出的变量可以通过命名空间使用。

  

# 18.类型声明

## 一.声明全局变量

- 普通类型声明

```ts
declare let age: number;
declare function sum(a: string, b: string): void;
declare class Animal { };
declare const enum Seaons{
    Spring,
    Summer,
    Autumn,
    Winter
}
declare interface Person {
    name:string,
    age:number
}
```

> 类型声明在编译的时候都会被删除，不会影响真正的代码。目的是不重构原有的js代码，而且可以得到很好的TS支持

练习: 声明jQuery类型

jquery通过外部CDN方式引入，想在代码中直接使用

```ts
declare const $:(selector:string)=>{
    height(num?:number):void
    width(num?:number):void
};
$('').height();
```

- 命名空间声明

```ts
declare namespace jQuery {
    function ajax(url:string,otpions:object):void;
    namespace fn {
        function extend(obj:object):void
    }
}
jQuery.ajax('/',{});
jQuery.fn.extend({});
```

> `namespace`表示一个全局变量包含很多子属性 , 命名空间内部不需要使用 declare 声明属性或方法

## 二. 类型声明文件

> 类型声明文件以`.d.ts`结尾。默认在项目编译时会查找所有以`.d.ts`结尾的文件

```ts
// jquery.d.ts
declare const $:(selector:string)=>{
    height(num?:number):void
    width(num?:number):void
};

declare namespace jQuery {
    function ajax(url:string,otpions:object):void;
    namespace fn {
        function extend(obj:object):void
    }
}
```

## 三.编写第三方声明文件

配置`tsconfig.json`

- jquery声明文件

```ts
"moduleResolution": "node",
"baseUrl": "./",
"paths": {
    "*": ["types/*"]
},
```

```ts
// types/jquery/index.d.ts

declare function jQuery(selector: string): HTMLElement;
declare namespace jQuery {
    function ajax(url: string): void
}
export = jQuery;
```

- events模块声明文件

```ts
import { EventEmitter } from "zf-events";
var e = new EventEmitter();
e.on('message', function (text) {
   console.log(text)
})
e.emit('message', 'hello');
```

```ts
export type Listener = (...args: any[]) => void;
export type Type = string | symbol

export class EventEmitter {
   static defaultMaxListeners: number;
   emit(type: Type, ...args: any[]): boolean;
   addListener(type: Type, listener: Listener): this;
   on(type: Type, listener: Listener): this;
   once(type: Type, listener: Listener): this;
}
```

## 四.模块导入导出

```ts
import $ from 'jquery'  // 只适用于 export default $

const $ = require('jquery'); // 没有声明文件可以直接使用 require语法

import * as $ from 'jquery'  // 为了支持 Commonjs规范 和 AMD规范 导出时采用export = jquery

import $ = require('jquery')  // export = jquery 在commonjs规范中使用
```

## 五.第三方声明文件

@types是一个约定的前缀，所有的第三方声明的类型库都会带有这样的前缀

```ts
npm install @types/jquery -S
```

1

> 当使用jquery时默认会查找 `node_modules/@types/jquery/index.d.ts` 文件

### 查找规范

- node_modules/jquery/package.json 中的types字段
- node_modules/jquery/index.d.ts
- node_modules/@types/jquery/index.d.ts



# 19、扩展全局变量类型



## 一.扩展局部变量

> 可以直接使用接口对已有类型进行扩展

```ts
interface String {
    double():string
}
String.prototype.double = function () {
    return this as string + this;
}
let str = 'zhufeng';
```

```ts
interface Window {
    mynane:string
}
console.log(window.mynane)
```

## 二.模块内全局扩展

```ts
declare global{
    interface String {
        double():string;
    }
    interface Window{
        myname:string
    }
}
```

> 声明全局表示对全局进行扩展

## 三.声明合并

同一名称的两个独立声明会被合并成一个单一声明，合并后的声明拥有原先两个声明的特性。

### 1.同名接口合并

```ts
interface Animal {
    name:string
}
interface Animal {
    age:number
}
let a:Animal = {name:'zf',age:10};
```

## 2.命名空间的合并

- 扩展类

  ```ts
  class Form {}
  namespace Form {
      export const type = 'form'
  }
  ```

- 扩展方法

  ```ts
  function getName(){}
  namespace getName {
      export const type = 'form'
  }
  ```

- 扩展枚举类型

  ```ts
  enum Seasons {
      Spring = 'Spring',
      Summer = 'Summer'
  }
  namespace Seasons{
      export let Autum = 'Autum';
      export let Winter = 'Winter'
  }
  ```

## 3.交叉类型合并

```ts
import { createStore, Store } from 'redux';
type StoreWithExt = Store & {
    ext:string
}
let store:StoreWithExt
```

## 四.生成声明文件

> 配置`tsconfig.json` 为true 生成声明文件

```ts
"declaration": true
```