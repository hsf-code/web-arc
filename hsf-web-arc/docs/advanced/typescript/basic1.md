---
title: 基础（一）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# 1.环境配置和搭建

## 一.什么是Typescript

![img](http://img.zhufengpeixun.cn/typescript.jpg)

`TypeScript`是`Javascript`的超集，遵循最新的`ES5/ES6`规范。`Typescript`扩展了`Javascript`语法。

- Typescript更像后端JAVA,让`JS`可以开发大型企业应用
- TS提供的类型系统可以帮助我们在写代码时提供丰富的语法提示
- 在编写代码时会对代码进行类型检查从而避免很多线上错误

> `TypeScript`不会取代`JS`, **尤雨溪：** 我认为将类型添加到`JS`本身是一个漫长的过程 。让委员会设计一个类型系统是（根据`TC39`的经历来判断）不切实际的 。

## 二.环境配置

### 1.全局编译TS文件

全局安装`typescript`对`TS`进行编译

```bash
npm install typescript -g
tsc --init # 生成tsconfig.json
```

```bash
tsc # 可以将ts文件编译成js文件
tsc --watch # 监控ts文件变化生成js文件
```

### 2.配置`webpack`环境

- 安装依赖

  ```bash
  npm install rollup typescript rollup-plugin-typescript2 @rollup/plugin-node-resolve rollup-plugin-serve -D
  ```

- 初始化`TS`配置文件

  ```bash
  npx tsc --init
  ```

- `webpack`配置操作

  ```js
  // rollup.config.js
  import ts from 'rollup-plugin-typescript2'
  import {nodeResolve} from '@rollup/plugin-node-resolve';
  import serve from 'rollup-plugin-serve';
  import path from 'path'
  export default {
      input:'src/index.ts',
      output:{
          format:'iife',
          file:path.resolve('dist/bundle.js'), 
          sourcemap:true
      },
      plugins:[
          nodeResolve({
              extensions:['.js','.ts']
          }),
          ts({
              tsconfig:path.resolve(__dirname,'tsconfig.json')
          }),
          serve({
              open:true,
              openPage:'/public/index.html',
              port:3000,
              contentBase:''
          })
      ]
  }
  ```

- `package.json`配置

  ```json
  "scripts": {
        "dev": "rollup -c -w"
  }
  ```

> 我们可以通过`npm run start`启动服务来使用typescript啦~

# 2.基础类型

TS中冒号后面的都为类型标识

## 一.布尔、数字、字符串类型

```ts
let bool:boolean = true;
let num:number = 10;
let str:string = 'hello zf';
```

## 二.元组类型

限制长度个数、类型一一对应

```ts
let tuple:[string,number,boolean] = ['zf',10,true];
// 像元组中增加数据，只能增加元组中存放的类型
tuple.push('回龙观');
```

## 三.数组

声明数组中元素数据类型

```ts
let arr1:number[] = [1,2,3];
let arr2:string[] = ['1','2','3'];
let arr3:(number|string)[] = [1,'2',3];
let arr4:Array<number | string> = [1,'2',3]; // 泛型方式来声明
```

## 四.枚举类型

```ts
enum USER_ROLE {
    USER, // 默认从0开始
    ADMIN,
    MANAGER
}
// {0: "USER", 1: "ADMIN", 2: "MANAGER", USER: 0, ADMIN: 1, MANAGER: 2}
```

> 可以枚举，也可以反举

```ts
// 编译后的结果
(function (USER_ROLE) {
    USER_ROLE[USER_ROLE["USER"] = 0] = "USER";
    USER_ROLE[USER_ROLE["ADMIN"] = 1] = "ADMIN";
    USER_ROLE[USER_ROLE["MANAGER"] = 2] = "MANAGER";
})(USER_ROLE || (USER_ROLE = {}));
```

- 异构枚举

  ```ts
  enum USER_ROLE {
      USER = 'user',
      ADMIN = 1,
      MANAGER,
  }
  ```

- 常量枚举

  ```ts
  const enum USER_ROLE {
      USER,
      ADMIN,
      MANAGER,
  }
  console.log(USER_ROLE.USER)// console.log(0 /* USER */);
  ```

## 五.any类型

不进行类型检测

```ts
let arr:any = ['jiagou',true,{name:'zf'}]
```

## 六.null 和 undefined

任何类型的子类型,如果`strictNullChecks`的值为true，则不能把null 和 undefined付给其他类型

```ts
let name:number | boolean;
name = null;
```

## 七.void类型

只能接受null，undefined。一般用于函数的返回值

```js
let a:void;
a = undefined;
```

> 严格模式下不能将`null`赋予给void

## 八.never类型

任何类型的子类型,never代表不会出现的值。不能把其他类型赋值给never

```ts
function error(message: string): never {
    throw new Error("err");
}
function loop(): never {
    while (true) { }
}
function fn(x:number | string){
    if(typeof x == 'number'){

    }else if(typeof x === 'string'){

    }else{
        console.log(x); // never
    }
}
```

## 九.Symbol类型

Symbol表示独一无二

```ts
const s1 = Symbol('key');
const s2 = Symbol('key');
console.log(s1 == s2); // false
```

## 十.BigInt类型

```ts
const num1 = Number.MAX_SAFE_INTEGER + 1;
const num2 = Number.MAX_SAFE_INTEGER + 2;
console.log(num1 == num2)// true


let max: bigint = BigInt(Number.MAX_SAFE_INTEGER)
console.log(max + BigInt(1) === max + BigInt(2))
```

> `number`类型和`bigInt`类型是不兼容的

## 十一.object对象类型

`object`表示非原始类型

```ts
let create = (obj:object):void=>{}
create({});
create([]);
create(function(){})
```

# 3.类型推导

## 一.类型推导

- 声明变量没有赋予值时默认变量是`any`类型

  ```js
  let name; // 类型为any
  name = 'zhufeng'
  name = 10;
  ```

- 声明变量赋值时则以赋值类型为准

  ```ts
  let name = 'zhufeng'; // name被推导为字符串类型 
  name = 10;
  ```

## 二.包装对象

我们在使用基本数据类型时，调用基本数据类型上的方法，默认会将原始数据类型包装成对象类型

```ts
let bool1:boolean = true;
let bool2:boolean = Boolean(1); 
let bool3:Boolean = new Boolean(2);
```

> *boolean*是基本数据类型 , *Boolean*是他的封装类

## 三.联合类型

在使用联合类型时，没有赋值只能访问联合类型中共有的方法和属性

```ts
let name:string | number // 联合类型  
console.log(name!.toString()); // 公共方法
name = 10;
console.log(name!.toFixed(2)); // number方法
name = 'zf';
console.log(name!.toLowerCase()); // 字符串方法
```

> 这里的!表示此值非空

```ts
let ele: HTMLElement | null = document.getElementById('#app');
ele!.style.color = 'red'; // 断定ele元素一定有值
```

## 四.类型断言

- 类型断言

  ```ts
  let name: string | number;
  (name! as number).toFixed(2); // 强制
  ((<number>name!).toFixed(2));
  ```

  > 尽量使用第一种类型断言因为在react中第二种方式会被认为是`jsx`语法

- 双重断言

  ```ts
  let name: string | boolean;
  ((name! as any) as string);
  ```

  > 尽量不要使用双重断言，会破坏原有类型关系，断言为any是因为any类型可以被赋值给其他类型

## 五.字面量类型

```ts
type Direction = 'Up' | 'Down' | 'Left' | 'Right';
let direction:Direction = 'Down';
```

> 可以用字面量当做类型，同时也表明只能采用这几个值（限定值）。类似枚举。