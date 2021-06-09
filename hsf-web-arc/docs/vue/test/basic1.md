---
title: 前端自动化测试
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# 前端自动化测试（一）

目前开发大型应用，测试是一个非常重要的环节，但是大多数前端开发者对测试相关的知识是比较缺乏的，因为可能项目开发周期短根本没有机会写。所以你没有办法体会到前端自动化测试的重要性！

来说说为什么前端自动化测试如此重要！

先看看前端常见的问题:

- 修改某个模块功能时，其它模块也受影响，很难快速定位bug
- 多人开发代码越来越难以维护
- 不方便迭代,代码无法重构
- 代码质量差

增加自动化测试后：

- 我们为核心功能编写测试后可以保障项目的可靠性
- 强迫开发者,编写更容易被测试的代码，提高代码质量
- 编写的测试有文档的作用，方便维护

## 1.测试

### 1.1 黑盒测试和白盒测试

- 黑盒测试一般也被称为功能测试，黑盒测试要求测试人员将程序看作一个整体，不考虑其内部结构和特性，只是按照期望验证程序是否能正常工作
- 白盒测试是基于代码本身的测试，一般指对代码逻辑结构的测试。

### 1.2 测试分类

```
单元测试(Unit Testing)
```

单元测试是指对程序中最小可测试单元进行的测试,例如测试`一个函数`、`一个模块`、`一个组件`...

```
集成测试(Integration Testing)
```

将已测试过的单元测试函数进行组合集成暴露出的高层函数或类的封装，对这些函数或类进行的测试

`端到端测试(E2E Testing)` 打开应用程序模拟输入，检查功能以及界面是否正确

### 1.3 TDD & BDD

```
TDD是测试驱动开发(Test-Driven Development)
```

TDD的原理是在开发功能代码之前，先编写单元测试用例代码

```
BDD是行为驱动开发(Behavior-Driven Development)
```

系统业务专家、开发者、测试人员一起合作，分析软件的需求，然后将这些需求写成一个个的故事。开发者负责填充这些故事的内容,保证程序实现效果与用户需求一致。

总结： TDD是先写测试在开发 （一般都是单元测试，白盒测试），而BDD则是按照用户的行为来开发，在根据用户的行为编写测试用例 （一般都是集成测试，黑盒测试）

### 1.4 测试框架

- **Karma** Karma为前端自动化测试提供了跨浏览器测试的能力，可以在浏览器中执行测试用例
- **Mocha** 前端自动化测试框架,需要配合其他库一起使用，像chai、sinon...
- **Jest** Jest 是facebook推出的一款测试框架,集成了 Mocha,chai,jsdom,sinon等功能。
- ...

看到这`facebook` 都在推Jest,你还不学吗? Jest也有一些缺陷就是不能像`karam`这样直接跑早浏览器上，它采用的是`jsdom`，优势是简单、0配置！ 后续我们通过jest来聊前端自动化测试

## 2.Jest的核心应用

在说`Jest`测试之前，先来看看以前我们是怎样测试的

```javascript
const parser = (str) =>{
    const obj = {};
    str.replace(/([^&=]*)=([^&=]*)/g,function(){
        obj[arguments[1]] = arguments[2];
    });
    return obj;
}
const stringify = (obj) =>{
    const arr = [];
    for(let key in obj){
        arr.push(`${key}=${obj[key]}`);
    }
    return arr.join('&');
}
// console.log(parser('name=zf')); // {name:'zf'}
// console.log(stringify({name:'zf'})) // name=zf
```

我们每写完一个功能，会先手动测试功能是否正常，测试后可能会将测试代码注释起来。这样会产生一系列问题，因为会污染源代码，所有的测试代码和源代码混合在一起。如果删除掉，下次测试还需要重新编写。

所以测试框架就帮我们解决了上述的问题

### 2.1 分组、用例

Jest是基于模块的，我们需要将代码包装成模块的方式,分别使用 `export` 将 `parser`、`stringify`这两个方法导出

安装`jest`

```bash
npm init -y # 初始化pacakge.json
npm i jest 
```

我们建立一个`qs.test.js`来专门编写测试用例，这里的用例你可以认为就是一条测试功能 （后缀要以.test.js结尾，这样jest测试时默认会调用这个文件）

```javascript
import {parser,stringify} from './qs';

it('测试 parser 是否能正常解析结果',()=>{
    // expect 断言，判断解析出来的结果是否和 {name:'zf'}相等
    expect(parser(`name=zf`)).toEqual({name:'zf'});
})
```

`jest`默认自带断言功能，断言的意思就是判断是不是这个样子，我断定你今天没吃饭~，结果你吃了。说明这次断言就失败了，测试就无法通过

通过配置`scripts` 来执行命令

```json
"scripts": {
    "test": "jest"
}
```

执行 `npm run test`,可惜的是默认在`node`环境下不支持`es6模块`的语法，需要`babel`转义,当然你也可以直接使用commonjs规范来导出方法，因为大多数现在开发都采用es6模块，所以就安装一下~

```bash
# core是babel的核心包 preset-env将es6转化成es5
npm i @babel/core @babel/preset-env --save-dev
```

并且配置`.babelrc`文件，告诉babel用什么来转义

```json
{
    "presets":[
        [
            "@babel/preset-env",{
                "targets": {"node":"current"}
            }
        ]
    ]
}
```

默认jest中集成了`babel-jest`,运行时默认会调用`.babelrc`进行转义，可以直接将es6转成es5语法
运行 `npm run test` 出现:

![img](http://img.fullstackjavascript.cn/unit1.png)

继续编写第二个用例

```javascript
import {parser,stringify} from './qs';
describe('测试qs 库',()=>{
    it('测试 parser 是否能正常解析结果',()=>{
        expect(parser(`name=zf`)).toEqual({name:'zf'});
    })
    
    it('测试 stringify 是否正常使用stringify',()=>{
        expect(stringify({name:'zf'})).toEqual(`name=zf`)
    })
});
```

> describe的功能是给用例分组，这样可以更好的给用例分类，其实这就是我们所谓的单元测试，对某个具体函数和功能进行测试

### 2.2 matchers匹配器

在写第一个测试用例时，我们一直在使用`toEqual`其实这就是一个匹配器，那我们来看看`jest`中常用的匹配器有哪些？因为匹配器太多了，所以我就讲些常用的！

为了方便理解，我把匹配器分为三类、判断相等、不等、是否包含

```javascript
it('判断是否相等',()=>{
    expect(1+1).toBe(2); // 相等于 js中的===
    expect({name:'zf'}).toEqual({name:'zf'}); // 比较内容是否相等
    expect(true).toBeTruthy(); // 是否为 true / false 也可以用toBe(true)
    expect(false).toBeFalsy();
});

it('判断不相等关系',()=>{
    expect(1+1).not.toBe(3); // not取反
    expect(1+1).toBeLessThan(5); // js中的小于
    expect(1+1).toBeGreaterThan(1); // js中的大于
});

it('判断是否包含',()=>{
    expect('hello world').toContain('hello'); // 是否包含
    expect('hello world').toMatch(/hello/); // 正则
});
```

### 2.3 测试操作节点方法

说了半天，我们自己来写个功能测试一下!

```javascript
export const removeNode = (node) => {
    node.parentNode.removeChild(node)
};
```

核心就是测试传入一个节点，这个节点是否能从`DOM`中删除

```javascript
import { removeNode } from './dom'
it('测试删除节点',()=>{
    document.body.innerHTML = `<div><button data-btn="btn"></button</div>`
    let btn = document.querySelector('[data-btn="btn"]')
    expect(btn).not.toBeNull()
    removeNode(btn);
    btn = document.querySelector('[data-btn="btn"]');
    expect(btn).toBeNull()
})
```

这个就是我们所说的jsdom，在node中操作dom元素

### 2.4 Jest常用命令

我们希望每次更改测试后，自动重新执行测试,修改执行命令:

```json
"scripts": {
    "test": "jest --watchAll"
}
```

重新执行 `npm run test`，这时就会监控用户的修改 ![img](http://img.fullstackjavascript.cn/unit2.png)

提示我们按下`w`，显示更多信息



# 前端自动化测试（二）

上一章节，我们已经讲述了Jest中的基本使用,这一章我们来深度使用Jest

在测试中我们会遇到很多问题，像如何测试异步逻辑，如何mock接口数据等...

通过这一章节，可以让你在开发中对Jest的应用游刃有余，我们来逐一击破吧！

## 1.Jest进阶使用

### 1.1 异步函数的测试

提到异步无非就两种情况，一种是回调函数的方式，一种就是现在流行的promise方式

```javascript
export const getDataThroughCallback = fn => {
  setTimeout(() => {
    fn({ name: "zf" });
  }, 1000);
};

export const getDataThroughPromise = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ name: "zf" });
    }, 1000);
  });
};
```

我们编写`async.test.js`方法

```javascript
import {getDataThroughCallback,getDataThroughPromise} from './3.getData';

// 默认测试用例不会等待测试完成，所以增加done参数，当完成时调用done函数
it('测试传入回调函数 获取异步返回结果',(done)=>{ // 异步测试方法可以通过done
    getDataThroughCallback((data)=>{
        expect(data).toEqual({name:'zf'});
        done();
    })
})
// 返回一个promise 会等待这个promise执行完成
it('测试promise 返回结果 1',()=>{
    return getDataThroughPromise().then(data=>{
        expect(data).toEqual({name:'zf'});
    })
})
// 直接使用async + await语法
it('测试promise 返回结果 2',async ()=>{
    let data = await getDataThroughPromise();
    expect(data).toEqual({name:'zf'});
})
// 使用自带匹配器
it('测试promise 返回结果 3',async ()=>{
    expect(getDataThroughPromise()).resolves.toMatchObject({name:'zf'})
})
```

## 2.Jest中的mock

### 2.1 模拟函数jest.fn()

为什么要模拟函数呢？来看下面这种场景，你要如何测试

```javascript
export const myMap = (arr,fn) =>{
   return arr.map(fn)
}
```

打眼一看很简单啊，我只需要判断函数的返回结果就可以啦,像这样

```javascript
import { myMap } from "./map";
it("测试 map方法", () => {
  let fn = item => item * 2;
  expect(myMap([1, 2, 3], fn)).toEqual([2, 4, 6]);
});
```

但是我想更细致一些，像每一次调用函数传入的是否是数组的每一项，函数是否被调用了三次,说的更明确些就是想追溯函数具体的执行过程！

```javascript
import { myMap } from "./map";
it("测试 map 方法", () => {
  // 通过jest.fn声明的函数可以被追溯
  let fn = jest.fn(item => (item *= 2));
  expect(myMap([1, 2, 3], fn)).toEqual([2, 4, 6]);
  // 调用3次
  expect(fn.mock.calls.length).toBe(3); 
  // 每次函数返回的值是 2,4,6
  expect(fn.mock.results.map(item=>item.value)).toEqual([2,4,6])
});
```

> 详细看下这个mock中都有什么东东

![img](http://img.fullstackjavascript.cn/unit4.png)

### 2.2 模拟文件jest.mock()

我们希望对接口进行mock，可以直接在`__mocks__`目录下创建同名文件,将整个文件mock掉，例如当前文件叫`api.js`

```javascript
import axios from "axios";

export const fetchUser = ()=>{
    return axios.get('/user')
}
export const fetchList = ()=>{
    return axios.get('/list')
}
```

创建`__mocks__/api.js`

```javascript
export const fetchUser = ()=>{
    return new Promise((resolve,reject)=> resolve({user:'zf'}))
}
export const fetchList = ()=>{
    return new Promise((resolve,reject)=>resolve(['香蕉','苹果']))
}
```

开始测试

```javascript
jest.mock('./api.js'); // 使用__mocks__ 下的api.js
import {fetchList,fetchUser} from './api'; // 引入mock的方法
it('fetchUser测试',async ()=>{
    let data = await fetchUser();
    expect(data).toEqual({user:'zf'})
})

it('fetchList测试',async ()=>{
    let data = await fetchList();
    expect(data).toEqual(['香蕉','苹果'])
})
```

这里需要注意的是，如果mock的`api.js`方法不全，在测试时可能还需要引入原文件的方法，那么需要使用`jest.requireActual('./api.js')` 引入真实的文件。

这里我们想这样做是不是有些麻烦呢，其实只是想将真正的请求mock掉而已，那么我们是不是可以直接`mock axios`方法呢？

在`__mocks__`下创建 `axios.js` 重写get方法

```javascript
export default {
    get(url){
        return new Promise((resolve,reject)=>{
            if(url === '/user'){
                resolve({user:'zf'});
            }else if(url === '/list'){
                resolve(['香蕉','苹果']);
            }
        })
    }
}
```

当方法中调用`axios`时默认会找`__mocks__/axios.js`

```javascript
jest.mock('axios'); // mock axios方法
import {fetchList,fetchUser} from './api';
it('fetchUser测试',async ()=>{
    let data = await fetchUser();
    expect(data).toEqual({user:'zf'})
})

it('fetchList测试',async ()=>{
    let data = await fetchList();
    expect(data).toEqual(['香蕉','苹果'])
})
```

### 2.3 模拟Timer

接着来看下个案例，我们期望传入一个callback，想看下callback能否被调用！

```javascript
export const timer = callback=>{
    setTimeout(()=>{
        callback();
    },2000)
}
```

因此我们很容易写出了这样的测试用例

```javascript
import {timer} from './timer';
it('callback 是否会执行',(done)=>{
    let fn = jest.fn();
    timer(fn);
    setTimeout(()=>{
        expect(fn).toHaveBeenCalled();
        done();
    },2500)
});
```

有没有觉得很愚蠢，如果时间很长呢？ 很多个定时器呢？这时候我们想到了`mock Timer`

```javascript
import {timer} from './timer';
jest.useFakeTimers();
it('callback 是否会执行',()=>{
    let fn = jest.fn();
    timer(fn);
    // 运行所有定时器，如果需要测试的代码是个秒表呢？
    // jest.runAllTimers();
    
    // 将时间向后移动2.5s
    // jest.advanceTimersByTime(2500);

    // 只运行当前等待定时器
    jest.runOnlyPendingTimers();
    expect(fn).toHaveBeenCalled();
});
```

## 3. Jest中的钩子函数

为了测试的便利，Jest中也提供了类似于Vue一样的钩子函数，可以在执行测试用例前或者后来执行

```javascript
class Counter {
  constructor() {
    this.count = 0;
  }
  add(count) {
    this.count += count;
  }
}
module.exports = Counter;
```

我们要测试`Counter`类中`add`方法是否符合预期,来编写测试用例

```javascript
import Counter from './hook'
it('测试  counter增加 1 功能',()=>{
    let counter = new Counter; // 每个测试用例都需要创建一个counter实例，防止相互影响
    counter.add(1);
    expect(counter.count).toBe(1)
})

it('测试  counter增加 2 功能',()=>{
    let counter = new Counter;
    counter.add(2);
    expect(counter.count).toBe(2)
})
```

我们发现每个测试用例都需要基于一个新的`counter`实例来测试，防止测试用例间的相互影响,这时候我们可以把重复的逻辑放到钩子中！

**钩子函数**

- beforeAll 在所有测试用例执行前执行
- afteraAll 在所有测试用例执行后
- beforeEach 在每个用例执行前
- afterEach 在每个用例执行后

```javascript
import Counter from "./hook";
let counter = null;
beforeAll(()=>{
    console.log('before all')
})
afterAll(()=>{
    console.log('after all')
})
beforeEach(() => {
  console.log('each')
  counter = new Counter();
});
afterEach(()=>{
    console.log('after');
})
it("测试  counter增加 1 功能", () => {
  counter.add(1);
  expect(counter.count).toBe(1);
});
it("测试  counter增加 2 功能", () => {
  counter.add(2);
  expect(counter.count).toBe(2);
});
```

> 钩子函数可以多次注册，一般我们通过describe 来划分作用域

```javascript
import Counter from "./hook";
let counter = null;
beforeAll(() => console.log("before all"));
afterAll(() => console.log("after all"));
beforeEach(() => {
  counter = new Counter();
});
describe("划分作用域", () => {
  beforeAll(() => console.log("inner before")); // 这里注册的钩子只对当前describe下的测试用例生效
  afterAll(() => console.log("inner after"));
  it("测试  counter增加 1 功能", () => {
    counter.add(1);
    expect(counter.count).toBe(1);
  });
});
it("测试  counter增加 2 功能", () => {
  counter.add(2);
  expect(counter.count).toBe(2);
});
// before all => inner before=> inner after => after all
// 执行顺序很像洋葱模型 ^-^
```

## 4.Jest中的配置文件

我们可以通过jest命令生成jest的配置文件

```bash
npx jest --init
```

会提示我们选择配置项：

```bash
➜  unit npx jest --init
The following questions will help Jest to create a suitable configuration for your project
# 使用jsdon
✔ Choose the test environment that will be used for testing › jsdom (browser-like)
# 添加覆盖率
✔ Do you want Jest to add coverage reports? … yes
# 每次运行测试时会清除所有的mock
✔ Automatically clear mock calls and instances between every test? … yes
```

在当前目录下会产生一个`jest.config.js`的配置文件

## 5.Jest覆盖率

刚才产生的配置文件我们已经勾选需要产生覆盖率报表，所有在运行时我们可以直接增加 `--coverage`参数

```json
"scripts": {
    "test": "jest --coverage"
}
```

可以直接执行`npm run test`,此时我们当前项目下就会产生coverage报表来查看当前项目的覆盖率

```bash
---------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |      100 |      100 |      100 |      100 |                   |
 hook.js  |      100 |      100 |      100 |      100 |                   |
----------|----------|----------|----------|----------|-------------------|
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.856s, estimated 2s
```

> 命令行下也会有报表的提示，jest增加覆盖率还是非常方便的~

- Stmts表示语句的覆盖率
- Branch表示分支的覆盖率(if、else)
- Funcs函数的覆盖率
- Lines代码行数的覆盖率

到此我们的`Jest`常见的使用已经基本差不多了！接下我们来看看如何利用Jest来测试Vue项目！





# 前端自动化测试（三）

通过前两章节的学习，我相信大家对`Jest`的核心用法已经可以说是掌握了，这一节我们来在Vue中，使用`Jest`

## 1.Vue中集成Jest

我们可以通过`vue`官方提供的`@vue/cli` 直接创建Vue项目,在创建前需要先安装好@vue/cli~

这里直接创建项目:

```javascript
vue create vue-unit-project
```

```bash
? Please pick a preset:
  default (babel, eslint)
❯ Manually select features # 手动选择
```

```bash
? Check the features needed for your project:
 ◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◉ Router
 ◉ Vuex
 ◯ CSS Pre-processors
 ◯ Linter / Formatter
❯◉ Unit Testing
 ◯ E2E Testing
```

```bash
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, Router, Vuex, Unit
? Use history mode for router?  # history模式
ion) Yes
? Pick a unit testing solution: Jest # 测试框架选择Jest
? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.? In dedicated config  # 将配置文件产生独立的文件
 files
? Save this as a preset for future projects? (y/N) # 是否保存配置
```

初始化成功后，我们先来查看项目文件，因为我们主要关注的是测试，所以先来查看下`jest.config.js`文件

```javascript
module.exports = {
  moduleFileExtensions: [ // 测试的文件类型
    'js','jsx','json','vue'
  ],
  transform: { // 转化方式
    '^.+\\.vue$': 'vue-jest', // 如果是vue文件使用vue-jest解析
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub', // 如果是图片样式则使用 jest-transform-stub
    '^.+\\.jsx?$': 'babel-jest' // 如果是jsx文件使用 babel-jest
  },
  transformIgnorePatterns: [ // 转化时忽略 node_modules
    '/node_modules/'
  ],
  moduleNameMapper: { // @符号 表示当前项目下的src
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: [ // 快照的配置
    'jest-serializer-vue'
  ],
  testMatch: [ // 默认测试 /test/unit中包含.spec的文件 和__tests__目录下的文件
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  testURL: 'http://localhost/', // 测试地址
  watchPlugins: [ // watch提示插件
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
}
```

通过配置文件的查看我们知道了所有测试都应该放在`tests/unit`目录下!

我们可以查看`pacakge.json`来执行对应的测试命令

```json
"scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "test:unit": "vue-cli-service test:unit --watch" // 这里增加个 --watch参数
},
```

开始测试 `npm run test:unit`

## 2.测试Vue组件

我们先忽略默认`example.spec.js`文件，先来自己尝试下如何测试`Vue组件`

### 2.1 测试HelloWorld组件

```javascript
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>
<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>
```

`HelloWorld`组件需要提供一个msg属性，将msg属性渲染到`h1`标签中，ok我们来编写测试用例

在`tests/unit`下创建 `HelloWorld.spec.js`

```javascript
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld'
describe('测试HelloWolrd 组件',()=>{
    it('传入 msg 属性看能否渲染到h1标签内',()=>{
        const  baseExtend = Vue.extend(HelloWorld);
        // 获取当前组件的构造函数，并且挂载此组件
        const vm = new baseExtend({
            propsData:{
                msg:'hello'
            }
        }).$mount();
        expect(vm.$el.innerHTML).toContain('hello');
    })
});
```

这样一个简单的Vue组件就测试成功了,但是写起来感觉不简洁也不方便！所以为了更方便的测试Vue官方提供给我们了个测试工具`Vue Test Utils`,而且这个工具为了方便应用，采用了同步的更新策略

```javascript
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld';
import {shallowMount} from '@vue/test-utils'
describe('测试HelloWolrd 组件',()=>{
    it('传入 msg 属性看能否渲染到h1标签内',()=>{
        const wrapper = shallowMount(HelloWorld,{
            propsData:{
                msg:'hello'
            }
        })
        expect(wrapper.find('h1').text()).toContain('hello')
    });
});
```

这样写测试是不是很hi,可以直接渲染组件传入属性，默认返回`wrapper`，`wrapper`上提供了一系列方法，可以快速的获取dom元素! 其实这个测试库的核心也是在 `wrapper`的方法上, 更多方法请看 [Vue Test Utils](https://vue-test-utils.vuejs.org/zh/api/wrapper/)

这里的`shallowMount`被译为潜渲染，也就是说`HelloWorld`中引入其他组件是会被忽略掉的，当然也有深度渲染`mount`方法！

刚才写测试的这种方式就是**先编写功能**！编写完成后,我们来**模拟用户的行为进行测试**，而且只测试其中的某个具体的功能！ 这就是我们所谓的 **BDD形式的单元测试**。接下来，我们再来换种思路再来写个组件！

### 2.2 测试Todo组件

这回呢，我们来采用**TDD的方式**来测试，也就是**先编写测试用例**

先指定测试的功能: 我们要编写个Todo组件

- 当输入框输入内容时会将数据映射到组件实例上
- 如果输入框为空则不能添加,不为空则新增一条
- 增加的数据内容为刚才输入的内容

编写`Todo.spec.js`

```javascript
import Todo from '@/components/Todo.vue';
import {shallowMount} from '@vue/test-utils'
describe('测试Todo组件',()=>{
    it('当输入框输入内容时会将数据映射到组件实例上',()=>{
        // 1) 渲染Todo组件
        let wrapper = shallowMount(Todo);
        let input = wrapper.find('input');
        // 2.设置value属性 并触发input事件
        input.setValue('hello world');
        // 3.看下数据是否被正确替换
        expect(wrapper.vm.value).toBe('hello world')
    });
    it('如果输入框为空则不能添加,不为空则新增一条',()=>{
        let wrapper = shallowMount(Todo);
        let button = wrapper.find('button');
        // 点击按钮新增一条
        wrapper.setData({value:''});// 设置数据为空
        button.trigger('click');
        expect(wrapper.findAll('li').length).toBe(0);
        wrapper.setData({value:'hello'});// 写入内容
        button.trigger('click');
        expect(wrapper.findAll('li').length).toBe(1);
    });
    it('增加的数据内容为刚才输入的内容',()=>{
        let wrapper = shallowMount(Todo);
        let input = wrapper.find('input');
        let button = wrapper.find('button');
        input.setValue('hello world');
        button.trigger('click');
        expect(wrapper.find('li').text()).toMatch(/hello world/);
    });
});
```

我们为了跑通这些测试用例,只能被迫写出对应的代码!

```vue
<template>
 <div>
  <input type="text" v-model="value" />
  <button @click="addTodo"></button>
  <ul>
   <li v-for="(todo,index) in todos" :key="index">{{todo}}</li>
  </ul>
 </div>
</template>
<script>
export default {
 methods: {
  addTodo() {
   this.value && this.todos.push(this.value)
  }
 },
 data() {
  return {
   value: "",
   todos: []
  };
 }
};
</script>
```

以上就是我们针对Todo这个组件进行了单元测试，但是真实的场景中可能会更加复杂,在真实的开发中，我们可能将这个`Todo`组件进行拆分，拆分成`TodoInput`组件和`TodoList`组件和`TodoItem`组件，如果采用单元测试的方式,就需要依次测试每个组件(**单元测试是以最小单元来测试**) 但是单元测试无法保证整个流程是可以跑通的，所以我们在单元测试的基础上还要采用**集成测试**

总结：

**1.单元测试可以保证测试覆盖率高，但是相对测试代码量大，缺点是无法保证功能正常运行**

**2.集成测试粒度大，普遍覆盖率低，但是可以保证测试过的功能正常运行**

**3.一般业务逻辑会采用BDD方式使用集成测试（像测试某个组件的功能是否符合预期）一般工具方法会采用TDD的方式使用单元测试**

**4.对于 UI 组件来说，我们不推荐一味追求行级覆盖率，因为它会导致我们过分关注组件的内部实现细节，从而导致琐碎的测试**

### 2.3 测试Vue中的异步逻辑

在测试Vue项目中，我们可能会在组件中发送请求，这时我们仍然需要对请求进行mock

```vue
<template>
  <ul>
   <li v-for="(list,index) in lists" :key="index">{{list}}</li>
  </ul>
</template>
<script>
import axios from 'axios'
export default {
 async mounted(){
    let {data} = await axios.get('/list');
    this.lists = data;
 },
 data() {
  return {
   lists: []
  };
 }
};
</script>
```

可以参考上一章节 如何实现`jest`进行方法的`mock`

```javascript
import List from "@/components/List.vue";
import { shallowMount } from "@vue/test-utils";
jest.mock("axios");
it("测试List组件", done => {
  let wrapper = shallowMount(List);
  setTimeout(() => {
    expect(wrapper.findAll("li").length).toBe(3);
    done();
  });
});
```

> 这里使用setTimeout的原因是我们自己mock的方法是promise,所以是微任务，我们期望微任务执行后在进行断言,所以采用setTimeout进行包裹，保证微任务已经执行完毕! 如果组件中使用的不是 `async、await`形式，也可以使用 `$nextTick`, (新版node中`await`后的代码会延迟到下一轮微任务执行)

举个例子:

```javascript
function fn(){
    return new Promise((resolve,reject)=>{
        resolve([1,2,3]);
    })
}
async function getData(){
    await fn(); 
    // await fn()  会编译成
    // new Promise((resolve)=>resolve(fn())).then(()=>{
    //     console.log(1)
    // })
    console.log(1);
}
getData();
Promise.resolve().then(data=>{
    console.log(2);
});
```

> 当然不同版本执行效果可能会有差异

来简单看下不是`async、await`的写法~~~

```javascript
axios.get('/list').then(res=>{
    this.lists = res.data;
})
```

```javascript
it('测试List组件',()=>{
    let wrapper = shallowMount(List);
    // nextTick方法会返回一个promise,因为微任务是先进先出,所以nextTick之后的内容，会在数据获取之后执行
    return wrapper.vm.$nextTick().then(()=>{
        expect(wrapper.vm.lists).toEqual([1,2,3])
    })
})
```

### 2.4 测试Vue中的自定义事件

我们写了一个切换显示隐藏的组件，当子组件触发change事件时可以切换p标签的显示和隐藏效果

```vue
<template>
    <div>
        <Head @change="change"></Head>
        <p v-if="visible">这是现实的内容</p>
    </div>
</template>
<script>
import Head from './Head'
export default {
    methods:{
        change(){
            this.visible = !this.visible;
        }
    },
    data(){
        return {visible:false}
    },
    components:{
        Head
    }
}
</script>
```

我们来测试它！可以直接通过`wrapper.find`方法找到对应的组件来发射事件

```javascript
import Modal from '@/components/Modal';
import Head from '@/components/Head';
import {mount, shallowMount} from '@vue/test-utils'
it('测试 触发change事件后 p标签是否可以切换显示',()=>{
    let wrapper = shallowMount(Modal);
    let childWrapper = wrapper.find(Head);
    expect(wrapper.find('p').exists()).toBeFalsy()
    childWrapper.vm.$emit('change');
    expect(childWrapper.emitted().change).toBeTruthy(); // 检验方法是否被触发
    expect(wrapper.find('p').exists()).toBeTruthy(); // 检验p标签是否显示
})
```

到这里我们对`vue`的组件测试已经基本搞定了，接下来我们再来看下如何对Vue中的`Vuex`、`Vue-router`进行处理



# 前端自动化测试（四）

在Vue项目中测试组件时会引用全局组件，那么如何处理这些全局组件呢？ 还有Vue中比较重要的一个点`Vuex`如何进行测试？

## 1.测试时使用VueRouter

### 1.1 存根

在你的组件中引用了全局组件 `router-link` 或者 `router-view`组件时，我们使用`shallowMount`来渲染会提示无法找到这两个组件，我们可以使用存根的方式`mock`掉相关的组件，

```javascript
<template>
    <div>
        <h1>当前路由:{{this.$route.path}}</h1>
        <router-link to="/">首页</router-link>
        <router-link to="/about">关于页面</router-link>

        <router-view></router-view>
    </div>
</template>
```

```javascript
import Nav from "@/components/Nav.vue";
import { shallowMount } from "@vue/test-utils";
it("测试Nav组件", () => {
  let wrapper = shallowMount(Nav,{
      // 忽略这两个组件
      stubs:['router-link','router-view'],
      mocks:{ // mock一些数据传入到Nav组件中
        $route:{path:'/'}
      }
  });
  expect(wrapper.find('h1').text()).toContain('/')
});
```

> 同理：我们可以mock掉一些全局组件，也可以mock一些参数传入到组件中。

## 1.2 安装VueRouter

我们可以也创建一个`localVue`来安装VueRouter,传入到组件中进行渲染。 安装 `Vue Router` 之后 Vue 的原型上会增加 `$route` 和 `$router` 这两个只读属性。所以不要挂载到基本的Vue构造函数上,同时也不能通过`mocks`参数重写这两个属性

```javascript
const localVue = createLocalVue();
localVue.use(VueRouter);

it("测试Nav组件", () => {
    let router = new VueRouter({
        routes:[
          {path:'/',component:Home},
          {path:'/about',component:About}
        ]
    });
    let wrapper = mount(Nav,{
        localVue,
        router
    });
    router.push('/about');
    expect(wrapper.find('h1').text()).toMatch(/about/)
});
```

## 2.Vuex的测试

我们通过一个计数器的例子来掌握如何测试vuex

```vue
<template>
    <div>
        {{this.$store.state.number}}
        <button @click="add(3)">添加</button>
    </div>
</template>
<script>
import {mapActions} from 'vuex';
export default {
    methods:{
        ...mapActions({'add':'increment'})
    }
}
</script>
```

编写`store/index.js`

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import config from './config'
Vue.use(Vuex)
export default new Vuex.Store(config)
```

编写`store/mutations.js`

```javascript
export default {
    increment(state,count){
        state.number+=count
    }
}
```

编写`store/actions.js`

```javascript
export default {
  increment({ commit }, count) {
    setTimeout(() => {
      commit("increment", count);
    }, 1000);
  }
};
```

编写`store/config.js`

```javascript
import mutations from "./mutations";
import actions from "./actions";
export default {
  state: {
    number: 0
  },
  mutations,
  actions
};
```

这里我们就不过多的详细讲解vuex的执行过程了，直接开始测试啦！

### 2.1 单元化测试store

我们可以直接把store中的方法一一进行单元测试

就是一个个测试函数，但是需要mock `commit`和`dispatch`方法

```javascript
import mutations from '../mutations';
import actions from '../actions';
jest.useFakeTimers();
it('测试mutation',()=>{
    const state = {number:0}
    mutations.increment(state,2);
    expect(state.number).toBe(2);
});

it('测试action',()=>{
    let commit = jest.fn();
    actions.increment({commit},2);
    jest.advanceTimersByTime(2000);
    expect(commit).toBeCalled();
    expect(commit.mock.calls[0][1]).toBe(2);
});
```

### 2.2 测试运行的store

就是产生一个store,进行测试 好处是不需要`mock`任何方法

```javascript
import Vuex from 'vuex';
import {createLocalVue} from '@vue/test-utils'
import config from '../config';
jest.useFakeTimers();
it('测试是否可以异步增加 1',()=>{
    let localVue = createLocalVue();
    localVue.use(Vuex);
    let store = new Vuex.Store(config); // 创建一个运行store
    expect(store.state.number).toBe(0);
    store.dispatch('increment',2);
    jest.advanceTimersByTime(2000); // 前进2s
    expect(store.state.number).toBe(2); 
});
```

> config文件最好每次测试时克隆一份，保证每个用例间互不干扰！

### 2.3 测试组件中的Vuex

`mock store`传入组件中，看函数是否能够如期调用

```javascript
import Vuex from 'vuex';
import Counter from '@/components/Counter';
import {createLocalVue,shallowMount} from '@vue/test-utils'

let localVue = createLocalVue();
localVue.use(Vuex);
let store;
let actions;
beforeEach(()=>{
    actions = {
        increment:jest.fn()
    }
    store = new Vuex.Store({
        actions,
        state:{}
    });
});
it('测试组件中点击按钮 是否可以 1',()=>{
    let wrapper = shallowMount(Counter,{
        localVue,
        store
    });
    wrapper.find('button').trigger('click');
    // 测试actions中的increment 方法是否能正常调用
    expect(actions.increment).toBeCalled();
})
```

> 到这里`Vuex`测试的方式我们就讲解完毕了, 其实前端自动化测试并不难~，大家多多练习就可以完全掌握啦!