---
title: vue基础解析2
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

**Vue中给对象添加新属性界面不刷新**

## **一、直接添加属性的问题**

我们从一个例子开始

定义一个`p`标签，通过`v-for`指令进行遍历

然后给`botton`标签绑定点击事件，我们预期点击按钮时，数据新增一个属性，界面也新增一行

```
<p v-for="(value,key) in item" :key="key">
    {{ value }}
</p>
<button @click="addProperty">动态添加新属性</button>
```

实例化一个`vue`实例，定义`data`属性和`methods`方法

```
const app = new Vue({
    el:"#app",
    data:()=>{
        item:{
            oldProperty:"旧属性"
        }
    },
    methods:{
        addProperty(){
            this.items.newProperty = "新属性"  // 为items添加新属性
            console.log(this.items)  // 输出带有newProperty的items
        }
    }
})
```

点击按钮，发现结果不及预期，数据虽然更新了（`console`打印出了新属性），但页面并没有更新

## **二、原理分析**

为什么产生上面的情况呢？

下面来分析一下

`vue2`是用过`Object.defineProperty`实现数据响应式

```
const obj = {}
Object.defineProperty(obj, 'foo', {
        get() {
            console.log(`get foo:${val}`);
            return val
        },
        set(newVal) {
            if (newVal !== val) {
                console.log(`set foo:${newVal}`);
                val = newVal
            }
        }
    })
}
```

当我们访问`foo`属性或者设置`foo`值的时候都能够触发`setter`与`getter`

```
obj.foo   
obj.foo = 'new'
```

但是我们为`obj`添加新属性的时候，却无法触发事件属性的拦截

```
obj.bar  = '新属性'
```

原因是一开始`obj`的`foo`属性被设成了响应式数据，而`bar`是后面新增的属性，并没有通过`Object.defineProperty`设置成响应式数据

## **三、解决方案**

`Vue` 不允许在已经创建的实例上动态添加新的响应式属性

若想实现数据与视图同步更新，可采取下面三种解决方案：

- Vue.set()
- Object.assign()
- $forcecUpdated()

### **Vue.set()**

Vue.set( target, propertyName/index, value )

参数

- `{Object | Array} target`
- `{string | number} propertyName/index`
- `{any} value`

返回值：设置的值

通过`Vue.set`向响应式对象中添加一个`property`，并确保这个新 `property`同样是响应式的，且触发视图更新

关于`Vue.set`源码（省略了很多与本节不相关的代码）

源码位置：`src\\core\\observer\\index.js`

```
function set (target: Array<any> | Object, key: any, val: any): any {
  ...
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```

这里无非再次调用`defineReactive`方法，实现新增属性的响应式

关于`defineReactive`方法，内部还是通过`Object.defineProperty`实现属性拦截

大致代码如下：

```
function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
        get() {
            console.log(`get ${key}:${val}`);
            return val
        },
        set(newVal) {
            if (newVal !== val) {
                console.log(`set ${key}:${newVal}`);
                val = newVal
            }
        }
    })
}
```

### **Object.assign()**

直接使用`Object.assign()`添加到对象的新属性不会触发更新

应创建一个新的对象，合并原对象和混入对象的属性

```
this.someObject = Object.assign({},this.someObject,{newProperty1:1,newProperty2:2 ...})
```

### **$forceUpdate**

如果你发现你自己需要在 `Vue`中做一次强制更新，99.9% 的情况，是你在某个地方做错了事

`$forceUpdate`迫使`Vue` 实例重新渲染

PS：仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。

### **小结**

- 如果为对象添加少量的新属性，可以直接采用`Vue.set()`
- 如果需要为新对象添加大量的新属性，则通过`Object.assign()`创建新对象
- 如果你需要进行强制刷新时，可采取`$forceUpdate()` (不建议)

PS：`vue3`是用过`proxy`实现数据响应式的，直接动态添加新属性仍可以实现数据响应式



**为什么data属性是一个函数而不是一个对象**

## **一、实例和组件定义data的区别**

`vue`实例的时候定义`data`属性既可以是一个对象，也可以是一个函数

```
const app = new Vue({
    el:"#app",
    // 对象格式
    data:{
        foo:"foo"
    },
    // 函数格式
    data(){
        return {
             foo:"foo"
        }
    }
})
```

组件中定义`data`属性，只能是一个函数

如果为组件`data`直接定义为一个对象

```
Vue.component('component1',{
    template:`<div>组件</div>`,
    data:{
        foo:"foo"
    }
})
```

则会得到警告信息

https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibQKXuicjOApiaic6QVdw4rhYVpdv5Xs7cO2OIx2vVs84EiakRVaibG0phnnAOAW68CbzK7SwTg5H834Iyw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

警告说明：返回的`data`应该是一个函数在每一个组件实例中

## **二、组件data定义函数与对象的区别**

上面讲到组件`data`必须是一个函数，不知道大家有没有思考过这是为什么呢？

在我们定义好一个组件的时候，`vue`最终都会通过`Vue.extend()`构成组件实例

这里我们模仿组件构造函数，定义`data`属性，采用对象的形式

```
function Component(){
 
}
Component.prototype.data = {
 count : 0
}
```

创建两个组件实例

```
const componentA = new Component()
const componentB = new Component()
```

修改`componentA`组件`data`属性的值，`componentB`中的值也发生了改变

```
console.log(componentB.data.count)  // 0
componentA.data.count = 1
console.log(componentB.data.count)  // 1
```

产生这样的原因这是两者共用了同一个内存地址，`componentA`修改的内容，同样对`componentB`产生了影响

如果我们采用函数的形式，则不会出现这种情况（函数返回的对象内存地址并不相同）

```
function Component(){
 this.data = this.data()
}
Component.prototype.data = function (){
    return {
     count : 0
    }
}
```

修改`componentA`组件`data`属性的值，`componentB`中的值不受影响

```
console.log(componentB.data.count)  // 0
componentA.data.count = 1
console.log(componentB.data.count)  // 0
```

`vue`组件可能会有很多个实例，采用函数返回一个全新`data`形式，使每个实例对象的数据不会受到其他实例对象数据的污染

## **三、原理分析**

首先可以看看`vue`初始化`data`的代码，`data`的定义可以是函数也可以是对象

源码位置：`/vue-dev/src/core/instance/state.js`

```
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
    ...
}
```

`data`既能是`object`也能是`function`，那为什么还会出现上文警告呢？

别急，继续看下文

组件在创建的时候，会进行选项的合并

源码位置：`/vue-dev/src/core/util/options.js`

自定义组件会进入`mergeOptions`进行选项合并

```
Vue.prototype._init = function (options?: Object) {
    ...
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    ...
  }
```

定义`data`会进行数据校验

源码位置：`/vue-dev/src/core/instance/init.js`

这时候`vm`实例为`undefined`，进入`if`判断，若`data`类型不是`function`，则出现警告提示

```
strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    if (childVal && typeof childVal !== "function") {
      process.env.NODE_ENV !== "production" &&
        warn(
          'The "data" option should be a function ' +
            "that returns a per-instance value in component " +
            "definitions.",
          vm
        );

      return parentVal;
    }
    return mergeDataOrFn(parentVal, childVal);
  }
  return mergeDataOrFn(parentVal, childVal, vm);
};
```

### **四、总结**

- 根实例对象`data`可以是对象也可以是函数（根实例是单例），不会产生数据污染情况
- 组件实例对象`data`必须为函数，目的是为了防止多个组件实例对象之间共用一个`data`，产生数据污染。采用函数的形式，`initData`时会将其作为工厂函数都会返回全新`data`对象



## 一、Vue.use中都发生了什么

Vue.use中都发生了什么？

> 源码地址: https://github.com/vuejs/vue/blob/dev/src/core/global-api/use.js

### **定义**

vue.use()往全局注入一个插件，供全局真接使用, 不需要单独引用

代码理解:

```
import Router from 'vue-router'

// 入口文件全局注入vue-router, 从而可以在全局使用this.$route
Vue.use(Router)

如果不使用vue.use 那么需在组件中使用都得单独引入

// a.vue
import Router from 'vue-router'

// b.vue
import Router from 'vue-router'
```

理解了其基本使用及作用，我们来看一下vue.use中都发生了什么

源码很少，所以直接摘抄了

```
  Vue.use = function (plugin: Function | Object) {  // flow语法, 检测参数是否是函数或对象
  
    // 拿到已安装插件列表
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    
    // 如果已经安装，直接跳出方法
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    
    // 取vue.use() 传入的参数
    const args = toArray(arguments, 1)
    
    // 将vue对象填充到第一位, 最后的结构为[vue,arg1,arg2,...]
    args.unshift(this)
    
    // 判断插件是否有install方法，如果有执行install方法，如果没有直接把插件当install执行
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    
    // 注册完成填充至已安装列表，保证每个插件只安装一次
    installedPlugins.push(plugin)
    return this
  }
```

结合代码理解

```
// 代码摘抄自elementui入口文件

实现上就是在install中执行了全局注册的操作

// index.js

const install = function(Vue, opts = {}) {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);

  components.forEach(component => {
    Vue.component(component.name, component);
  });
  ...
}

export default {
  version: '2.5.4',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  CollapseTransition,
  Loading,
  ...
}

//  main.js
import demo from './idnex'
vue.use(demo)
```

### **总结**

vue.use()为注册全局插件所用，接收函数或者一个包含install属性的对象为参数，如果参数带有install就执行install, 如果没有就直接将参数当install执行, 第一个参数始终为vue对象, 注册过的插件不会重新注册





**Vue 项目性能优化—实践指南**

## **前言**

Vue 框架通过数据双向绑定和虚拟 DOM 技术，帮我们处理了前端开发中最脏最累的 DOM 操作部分， 我们不再需要去考虑如何操作 DOM 以及如何最高效地操作 DOM；但 Vue 项目中仍然存在项目首屏优化、Webpack 编译配置优化等问题，所以我们仍然需要去关注 Vue 项目性能方面的优化，使项目具有更高效的性能、更好的用户体验。本文是作者通过实际项目的优化实践进行总结而来，希望读者读完本文，有一定的启发思考，从而对自己的项目进行优化起到帮助。本文内容分为以下三部分组成：

- Vue 代码层面的优化；
- webpack 配置层面的优化；
- 基础的 Web 技术层面的优化。

**辛苦整理良久，还望手动点赞鼓励~**

**github地址为：**[github.com/fengshi123/…，汇总了作者的所有博客，也欢迎关注及](http://github.com/fengshi123/…，汇总了作者的所有博客，也欢迎关注及) star ~

## **一、代码层面的优化**

### **1.1、v-if 和 v-show 区分使用场景**

**v-if** 是 **真正** 的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建；也是**惰性的**：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。

**v-show** 就简单得多， 不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 的 display 属性进行切换。

所以，v-if 适用于在运行时很少改变条件，不需要频繁切换条件的场景；v-show 则适用于需要非常频繁切换条件的场景。

### **1.2、computed 和 watch 区分使用场景**

**computed：** 是计算属性，依赖其它属性值，并且 computed 的值有缓存，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed 的值；

**watch：** 更多的是「观察」的作用，类似于某些数据的监听回调 ，每当监听的数据变化时都会执行回调进行后续操作；

**运用场景：**

- 当我们需要进行数值计算，并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时，都要重新计算；
- 当我们需要在数据变化时执行异步或开销较大的操作时，应该使用 watch，使用 watch 选项允许我们执行异步操作 ( 访问一个 API )，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。

### **1.3、v-for 遍历必须为 item 添加 key，且避免同时使用 v-if**

**（1）v-for 遍历必须为 item 添加 key**

在列表数据进行遍历渲染时，需要为每一项 item 设置唯一 key 值，方便 Vue.js 内部机制精准找到该条列表数据。当 state 更新时，新的状态值和旧的状态值对比，较快地定位到 diff 。

**（2）v-for 遍历避免同时使用 v-if**

v-for 比 v-if 优先级高，如果每一次都需要遍历整个数组，将会影响速度，尤其是当之需要渲染很小一部分的时候，必要情况下应该替换成 computed 属性。

**推荐：**

```
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id">
    {{ user.name }}
  </li>
</ul>
computed: {
  activeUsers: function () {
    return this.users.filter(function (user) {
	 return user.isActive
    })
  }
}
复制代码
```

**不推荐：**

```
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id">
    {{ user.name }}
  </li>
</ul>
复制代码
```

### **1.4、长列表性能优化**

Vue 会通过 Object.defineProperty 对数据进行劫持，来实现视图响应数据的变化，然而有些时候我们的组件就是纯粹的数据展示，不会有任何改变，我们就不需要 Vue 来劫持我们的数据，在大量数据展示的情况下，这能够很明显的减少组件初始化的时间，那如何禁止 Vue 劫持我们的数据呢？可以通过 Object.freeze 方法来冻结一个对象，一旦被冻结的对象就再也不能被修改了。

```
export default {
  data: () => ({
    users: {}
  }),
  async created() {
    const users = await axios.get("/api/users");
    this.users = Object.freeze(users);
  }
};
复制代码
```

### **1.5、事件的销毁**

Vue 组件销毁时，会自动清理它与其它实例的连接，解绑它的全部指令及事件监听器，但是仅限于组件本身的事件。如果在 js 内使用 addEventListene 等方式是不会自动销毁的，我们需要在组件销毁时手动移除这些事件的监听，以免造成内存泄露，如：

```
created() {
  addEventListener('click', this.click, false)
},
beforeDestroy() {
  removeEventListener('click', this.click, false)
}
复制代码
```

### **1.6、图片资源懒加载**

对于图片过多的页面，为了加速页面加载速度，所以很多时候我们需要将页面内未出现在可视区域内的图片先不做加载， 等到滚动到可视区域后再去加载。这样对于页面加载性能上会有很大的提升，也提高了用户体验。我们在项目中使用 Vue 的 vue-lazyload 插件：

（1）安装插件

```
npm install vue-lazyload --save-dev
复制代码
```

（2）在入口文件 man.js 中引入并使用

```
import VueLazyload from 'vue-lazyload'
复制代码
```

然后再 vue 中直接使用

```
Vue.use(VueLazyload)
复制代码
```

或者添加自定义选项

```
Vue.use(VueLazyload, {
preLoad: 1.3,
error: 'dist/error.png',
loading: 'dist/loading.gif',
attempt: 1
})
复制代码
```

（3）在 vue 文件中将 img 标签的 src 属性直接改为 v-lazy ，从而将图片显示方式更改为懒加载显示：

```
<img v-lazy="/static/img/1.png">
复制代码
```

以上为 vue-lazyload 插件的简单使用，如果要看插件的更多参数选项，可以查看 vue-lazyload 的 github 地址。

### **1.7、路由懒加载**

Vue 是单页面应用，可能会有很多的路由引入 ，这样使用 webpcak 打包后的文件很大，当进入首页时，加载的资源过多，页面会出现白屏的情况，不利于用户体验。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应的组件，这样就更加高效了。这样会大大提高首屏显示的速度，但是可能其他的页面的速度就会降下来。

**路由懒加载：**

```
const Foo = () => import('./Foo.vue')
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
复制代码
```

### **1.8、第三方插件的按需引入**

我们在项目中经常会需要引入第三方插件，如果我们直接引入整个插件，会导致项目的体积太大，我们可以借助 `babel-plugin-component`，然后可以只引入需要的组件，以达到减小项目体积的目的。以下为项目中引入 element-ui 组件库为例：

（1）首先，安装 `babel-plugin-component` ：

```
npm install babel-plugin-component -D
复制代码
```

（2）然后，将 .babelrc 修改为：

```
{
  "presets": [["es2015", { "modules": false }]],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
复制代码
```

（3）在 main.js 中引入部分组件：

```
import Vue from 'vue';
import { Button, Select } from 'element-ui';

 Vue.use(Button)
 Vue.use(Select)
复制代码
```

### **1.9、优化无限列表性能**

如果你的应用存在非常长或者无限滚动的列表，那么需要采用 窗口化 的技术来优化性能，只需要渲染少部分区域的内容，减少重新渲染组件和创建 dom 节点的时间。你可以参考以下开源项目 vue-virtual-scroll-list 和 vue-virtual-scroller 来优化这种无限列表的场景的。

### **1.10、服务端渲染 SSR or 预渲染**

服务端渲染是指 Vue 在客户端将标签渲染成的整个 html 片段的工作在服务端完成，服务端形成的 html 片段直接返回给客户端这个过程就叫做服务端渲染。

**（1）服务端渲染的优点：**

- 更好的 SEO：因为 SPA 页面的内容是通过 Ajax 获取，而搜索引擎爬取工具并不会等待 Ajax 异步完成后再抓取页面内容，所以在 SPA 中是抓取不到页面通过 Ajax 获取到的内容；而 SSR 是直接由服务端返回已经渲染好的页面（数据已经包含在页面中），所以搜索引擎爬取工具可以抓取渲染好的页面；
- 更快的内容到达时间（首屏加载更快）：SPA 会等待所有 Vue 编译后的 js 文件都下载完成后，才开始进行页面的渲染，文件下载等需要一定的时间等，所以首屏渲染需要一定的时间；SSR 直接由服务端渲染好页面直接返回显示，无需等待下载 js 文件及再去渲染等，所以 SSR 有更快的内容到达时间；

**（2）服务端渲染的缺点：**

- 更多的开发条件限制：例如服务端渲染只支持 beforCreate 和 created 两个钩子函数，这会导致一些外部扩展库需要特殊处理，才能在服务端渲染应用程序中运行；并且与可以部署在任何静态文件服务器上的完全静态单页面应用程序 SPA 不同，服务端渲染应用程序，需要处于 Node.js server 运行环境；
- 更多的服务器负载：在 Node.js 中渲染完整的应用程序，显然会比仅仅提供静态文件的 server 更加大量占用CPU 资源，因此如果你预料在高流量环境下使用，请准备相应的服务器负载，并明智地采用缓存策略。

如果你的项目的 SEO 和 首屏渲染是评价项目的关键指标，那么你的项目就需要服务端渲染来帮助你实现最佳的初始加载性能和 SEO，具体的 Vue SSR 如何实现，可以参考作者的另一篇文章《Vue SSR 踩坑之旅》。如果你的 Vue 项目只需改善少数营销页面（例如  `/， /about， /contac`t 等）的 SEO，那么你可能需要**预渲染**，在构建时 (build time) 简单地生成针对特定路由的静态 HTML 文件。优点是设置预渲染更简单，并可以将你的前端作为一个完全静态的站点，具体你可以使用 prerender-spa-plugin 就可以轻松地添加预渲染 。

## **二、Webpack 层面的优化**

### **2.1、Webpack 对图片进行压缩**

在 vue 项目中除了可以在 `webpack.base.conf.js` 中 url-loader 中设置 limit 大小来对图片处理，对小于 limit 的图片转化为 base64 格式，其余的不做操作。所以对有些较大的图片资源，在请求资源的时候，加载会很慢，我们可以用 `image-webpack-loader`来压缩图片：

（1）首先，安装 image-webpack-loader ：

```
npm install image-webpack-loader --save-dev
复制代码
```

（2）然后，在 webpack.base.conf.js 中进行配置：

```
{
  test: /\\.(png|jpe?g|gif|svg)(\\?.*)?$/,
  use:[
    {
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: utils.assetsPath('img/[name].[hash:7].[ext]')
      }
    },
    {
      loader: 'image-webpack-loader',
      options: {
        bypassOnDebug: true,
      }
    }
  ]
}
复制代码
```

### **2.2、减少 ES6 转为 ES5 的冗余代码**

Babel 插件会在将 ES6 代码转换成 ES5 代码时会注入一些辅助函数，例如下面的 ES6 代码：

```
class HelloWebpack extends Component{...}
复制代码
```

这段代码再被转换成能正常运行的 ES5 代码时需要以下两个辅助函数：

```
babel-runtime/helpers/createClass  // 用于实现 class 语法
babel-runtime/helpers/inherits  // 用于实现 extends 语法
复制代码
```

在默认情况下， Babel 会在每个输出文件中内嵌这些依赖的辅助函数代码，如果多个源代码文件都依赖这些辅助函数，那么这些辅助函数的代码将会出现很多次，造成代码冗余。为了不让这些辅助函数的代码重复出现，可以在依赖它们时通过 `require('babel-runtime/helpers/createClass')` 的方式导入，这样就能做到只让它们出现一次。`babel-plugin-transform-runtime` 插件就是用来实现这个作用的，将相关辅助函数进行替换成导入语句，从而减小 babel 编译出来的代码的文件大小。

（1）首先，安装 `babel-plugin-transform-runtime` ：

```
npm install babel-plugin-transform-runtime --save-dev
复制代码
```

（2）然后，修改 .babelrc 配置文件为：

```
"plugins": [
    "transform-runtime"
]
复制代码
```

如果要看插件的更多详细内容，可以查看babel-plugin-transform-runtime 的 详细介绍。

### **2.3、提取公共代码**

如果项目中没有去将每个页面的第三方库和公共模块提取出来，则项目会存在以下问题：

- 相同的资源被重复加载，浪费用户的流量和服务器的成本。
- 每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。

所以我们需要将多个页面的公共代码抽离成单独的文件，来优化以上问题 。Webpack 内置了专门用于提取多个Chunk 中的公共部分的插件 CommonsChunkPlugin，我们在项目中 CommonsChunkPlugin 的配置如下：

```
// 所有在 package.json 里面依赖的包，都会被打包进 vendor.js 这个文件中。
new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: function(module, count) {
    return (
      module.resource &&
      /\\.js$/.test(module.resource) &&
      module.resource.indexOf(
        path.join(__dirname, '../node_modules')
      ) === 0
    );
  }
}),
// 抽取出代码模块的映射关系
new webpack.optimize.CommonsChunkPlugin({
  name: 'manifest',
  chunks: ['vendor']
})
复制代码
```

如果要看插件的更多详细内容，可以查看 CommonsChunkPlugin 的 详细介绍。

### **2.4、模板预编译**

当使用 DOM 内模板或 JavaScript 内的字符串模板时，模板会在运行时被编译为渲染函数。通常情况下这个过程已经足够快了，但对性能敏感的应用还是最好避免这种用法。

预编译模板最简单的方式就是使用单文件组件——相关的构建设置会自动把预编译处理好，所以构建好的代码已经包含了编译出来的渲染函数而不是原始的模板字符串。

如果你使用 webpack，并且喜欢分离 JavaScript 和模板文件，你可以使用 vue-template-loader，它也可以在构建过程中把模板文件转换成为 JavaScript 渲染函数。

### **2.5、提取组件的 CSS**

当使用单文件组件时，组件内的 CSS 会以 style 标签的方式通过 JavaScript 动态注入。这有一些小小的运行时开销，如果你使用服务端渲染，这会导致一段 “无样式内容闪烁 (fouc) ” 。将所有组件的 CSS 提取到同一个文件可以避免这个问题，也会让 CSS 更好地进行压缩和缓存。

查阅这个构建工具各自的文档来了解更多：

- webpack + vue-loader ( vue-cli 的 webpack 模板已经预先配置好)
- Browserify + vueify
- Rollup + rollup-plugin-vue

### **2.6、优化 SourceMap**

我们在项目进行打包后，会将开发中的多个文件代码打包到一个文件中，并且经过压缩、去掉多余的空格、babel编译化后，最终将编译得到的代码会用于线上环境，那么这样处理后的代码和源代码会有很大的差别，当有 bug的时候，我们只能定位到压缩处理后的代码位置，无法定位到开发环境中的代码，对于开发来说不好调式定位问题，因此 sourceMap 出现了，它就是为了解决不好调式代码问题的。

SourceMap 的可选值如下（+ 号越多，代表速度越快，- 号越多，代表速度越慢, o 代表中等速度 ）

https://mmbiz.qpic.cn/mmbiz/1NOXMW586uuZnAApLr38mFVUApdS1l7pxWJBXQWCcpo02gia9Py9xx27CvQOnOmVEkJtKXibzcCCtJuRl9Ujwx3Q/640?wx_fmt=other&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

1.png

**开发环境推荐：cheap-module-eval-source-map**

**生产环境推荐：cheap-module-source-map**

原因如下：

- **cheap**：源代码中的列信息是没有任何作用，因此我们打包后的文件不希望包含列相关信息，只有行信息能建立打包前后的依赖关系。因此不管是开发环境或生产环境，我们都希望添加 cheap 的基本类型来忽略打包前后的列信息；
- **module** ：不管是开发环境还是正式环境，我们都希望能定位到bug的源代码具体的位置，比如说某个 Vue 文件报错了，我们希望能定位到具体的 Vue 文件，因此我们也需要 module 配置；
- **soure-map** ：source-map 会为每一个打包后的模块生成独立的 soucemap 文件 ，因此我们需要增加source-map 属性；
- **eval-source-map**：eval 打包代码的速度非常快，因为它不生成 map 文件，但是可以对 eval 组合使用 eval-source-map 使用会将 map 文件以 DataURL 的形式存在打包后的 js 文件中。在正式环境中不要使用 eval-source-map, 因为它会增加文件的大小，但是在开发环境中，可以试用下，因为他们打包的速度很快。

### **2.7、构建结果输出分析**

Webpack 输出的代码可读性非常差而且文件非常大，让我们非常头疼。为了更简单、直观地分析输出结果，社区中出现了许多可视化分析工具。这些工具以图形的方式将结果更直观地展示出来，让我们快速了解问题所在。接下来讲解我们在 Vue 项目中用到的分析工具：`webpack-bundle-analyzer` 。

我们在项目中 `webpack.prod.conf.js` 进行配置：

```
if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin =   require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}
复制代码
```

执行 `$ npm run build \\--report` 后生成分析报告如下：

https://mmbiz.qpic.cn/mmbiz_gif/1NOXMW586uuZnAApLr38mFVUApdS1l7pTU6eP6ic6c4IT4h26QO5h8jkiaiajylBbRAuqyMtjs7zbGWOvoC1E2icEQ/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1

1.png

### **2.8、Vue 项目的编译优化**

如果你的 Vue 项目使用 Webpack 编译，需要你喝一杯咖啡的时间，那么也许你需要对项目的 Webpack 配置进行优化，提高 Webpack 的构建效率。具体如何进行 Vue 项目的 Webpack 构建优化，可以参考作者的另一篇文章《 Vue 项目 Webpack 优化实践》

## **三、基础的 Web 技术优化**

### **3.1、开启 gzip 压缩**

gzip 是 GNUzip 的缩写，最早用于 UNIX 系统的文件压缩。HTTP 协议上的 gzip 编码是一种用来改进 web 应用程序性能的技术，web 服务器和客户端（浏览器）必须共同支持 gzip。目前主流的浏览器，Chrome，firefox，IE等都支持该协议。常见的服务器如 Apache，Nginx，IIS 同样支持，gzip 压缩效率非常高，通常可以达到 70% 的压缩率，也就是说，如果你的网页有 30K，压缩之后就变成了 9K 左右

以下我们以服务端使用我们熟悉的 express 为例，开启 gzip 非常简单，相关步骤如下：

- 安装：

```
npm install compression --save
复制代码
```

- 添加代码逻辑：

```
var compression = require('compression');
var app = express();
app.use(compression())
复制代码
```

- 重启服务，观察网络面板里面的 response header，如果看到如下红圈里的字段则表明 gzip 开启成功 ：

  https://mmbiz.qpic.cn/mmbiz/1NOXMW586uuZnAApLr38mFVUApdS1l7p2GGE5klNlnnqE31bjibxSzmcrVe6HDXVILuicMUC0rycY4T8smKNXNvw/640?wx_fmt=other&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

  1.png

### **3.2、浏览器缓存**

为了提高用户加载页面的速度，对静态资源进行缓存是非常必要的，根据是否需要重新向服务器发起请求来分类，将 HTTP 缓存规则分为两大类（强制缓存，对比缓存），如果对缓存机制还不是了解很清楚的，可以参考作者写的关于 HTTP 缓存的文章《深入理解HTTP缓存机制及原理》，这里不再赘述。

### **3.3、CDN 的使用**

浏览器从服务器上下载 CSS、js 和图片等文件时都要和服务器连接，而大部分服务器的带宽有限，如果超过限制，网页就半天反应不过来。而 CDN 可以通过不同的域名来加载文件，从而使下载文件的并发连接数大大增加，且CDN 具有更好的可用性，更低的网络延迟和丢包率 。

### **3.4、使用 Chrome Performance 查找性能瓶颈**

Chrome 的 Performance 面板可以录制一段时间内的 js 执行细节及时间。使用 Chrome 开发者工具分析页面性能的步骤如下。

1. 打开 Chrome 开发者工具，切换到 Performance 面板
2. 点击 Record 开始录制
3. 刷新页面或展开某个节点
4. 点击 Stop 停止录制

https://mmbiz.qpic.cn/mmbiz/1NOXMW586uuZnAApLr38mFVUApdS1l7pVB8h36MDeQMVnx3KGEjjCoP2aY0YmichWEED4z9rYpurYL3zwQjS2gA/640?wx_fmt=other&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

1.png

更多关于 Performance 的内容可以点击这里查看。



## 一、Virtual DOM 认知误区

在当下最流行的两个前端框架都存在 Virtual DOM 的前提下， 渐渐比较多的听到类似“使用 Virtual DOM 有什么优势？” 的面试题，但一直没有太在意。直到今天在写一个文档时，突让想到要把“为什么需要 Virtual DOM ？”也写进去，待我流畅的写好答案，略一思索——漏洞百出！也不知道是接纳了哪方的知识，让我一直有能轻松回答这个问题的错觉， 其实对于这个问题我是缺乏思考的。

你或许还不清楚我想说什么，但请耐下心来，先来看看网络上关于此问题的一些见解：

1. 虚拟DOM同样也是操作DOM，为啥说它快？-- Segmentfault[1]
   1. 虚拟DOM不会进行排版与重绘操作
   2. 虚拟DOM进行频繁修改，然后一次性比较并修改真实DOM中需要改的部分（注意！），最后并在真实DOM中进行排版与重绘，减少过多DOM节点排版与重绘损耗
   3. 真实DOM频繁排版与重绘的效率是相当低的
   4. 虚拟DOM有效降低大面积（真实DOM节点）的重绘与排版，因为最终与真实DOM比较差异，可以只渲染局部（同2）
2. Virtual Dom 的优势在哪里？-- Github[2]
   1. 具备跨平台的优势，由于 Virtual DOM 是以 JavaScript 对象为基础而不依赖真实平台环境，所以使它具有了跨平台的能力，比如说浏览器平台、Weex、Node 等。
   2. 操作 DOM 慢，js运行效率高。我们可以将DOM对比操作放在JS层，提高效率。因为DOM操作的执行速度远不如Javascript的运算速度快，因此，把大量的DOM操作搬运到Javascript中，运用patching算法来计算出真正需要更新的节点，最大限度地减少DOM操作，从而显著提高性能。
   3. 提升渲染性能 Virtual DOM的优势不在于单次的操作，而是在大量、频繁的数据更新下，能够对视图进行合理、高效的更新。
3. Virtual Dom的优势 -- 掘金[3]
   1. 不会立即进行排版与重绘;
   2. VDOM频繁修改，一次性比较并修改真实DOM中需要修改的部分，最后在真实DOM中进行重排 重绘，减少过多DOM节点重排重绘的性能消耗；
   3. VDOM有效降低大面积真实DOM的重绘与重排，与真实DOM比较差异，进行局部渲染；

上面是从 Google 搜索到的三个平台中的分析摘选，总结下来大概四点：

1. 操作 DOM 太慢，操作 Virtual DOM 对象快
2. 使用 Virtual DOM 可以避免频繁操作 DOM ，能有效减少回流和重绘次数（如果有的话）
3. 有 diff 算法，可以减少没必要的 DOM 操作
4. 跨平台优势，只要有 JS 引擎就能运行在任何地方（Weex/SSR）

它们的理解正确吗？

*本文测试数据都基于 Chrome 86.0.4240.198*

## **Virtual DOM 快？**

有人认为操作 Virtual DOM 速度很快？Virtual DOM 是一个用来描述 DOM（注意，并不一定一一对应）的 Javascript 对象，Javascript 操作 Javascript 对象自然是快的。

但 Virtual DOM 仍然需要调用 DOM API 去生成真实的 DOM ，而你其实是可以直接调用它们的，所有就有一个很有意思结论，正数再小也不可能比零还小——**Virtual DOM 很快，但这并不是它的优势，因你本可以选择不使用 Virtual DOM** 。除了速度不是优势，Virtual DOM 还有个最大的问题——**额外的内存占用**，以 Vue 的 Virtual DOM 对象为例，100W 个空的 Virtual DOM(Vue) 会占用 110M 内存。

内存占用截图：

https://mmbiz.qpic.cn/mmbiz_png/HLN2IKtpicicFqre3jIjqd5rlXVDvRwPu641JxoHrLIq0ywY87H7SiaVBk57FWe9GCzcias0kNZvmGdSAmWoKFzBRg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

测试代码：

```
let creatVNode = function(type) {
  return {
    __v_isVNode: true,
    SKIP: true,
    type,
    props: null,
    key: null,
    ref: null,
    scopeId: 0,
    children: null,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: 0,
    patchFlag: 0,
    dynamicProps: null,
    dynamicChildren: null,
    appContext: null
  }
}

let counts = 1000000
let list = []
let start = performance.now()
// 创建 VNode(Vue)
// 10000: 1120k
for (let i = 0; i < counts; i++) {
  list.push(creatVNode('div'))
}

// 创建 DOM
// 10000: 320k
// for (let i = 0; i < counts; i++) {
//   list.push(document.createElement('div'))
// }

console.log(performance.now() - start)
```

*令人意外的是 100W 个空的 DOM 对象只占用 45M 内存，不清楚在 DOM 属性明显更多的情况下 Chrome 是如何优化的，或则是 Dev Tools 存在问题，希望有人能替我解惑。*

你看 Virtual DOM 不但执行快没有用，还增加了大量的内存消耗，所以我们说它快自然是有问题的，因为没有 Virtual DOM 时更快。

## **Virtual DOM 减少回流和重绘？**

也有人认为 Virtual DOM 能减少页面的 relayout 和 repaint ？通常有两个原因来支撑这个观点：

1. DOM 操作会先改变 Virtual DOM ，所以一些无效该变（比如把文本 A 修改为 B ，然后再修改为 A）就不会调用 DOM API ，也就不会导致浏览做无效的回流和重绘。
2. DOM 操作会先改变 Virtual DOM ，最终由 Virtual DOM 调用 `patch` 方法批量操作 DOM ，批量操作就不会导致过程中出现无意义的回流和重绘。

### **无效回流与重绘**

第一个观点看着很有道理，但有个问题很难解释：浏览器的 UI 线程在什么时候去执行回流和重绘？要知道现代浏览器在设计上为了避免高复杂度，Javascript 线程和 UI 线程是互斥的，即如果浏览器要在 Javascript 执行期间触发 relayout/repaint 则必须先挂起 Javascript 线程，这是个连我都觉得蠢的设计，显然不会出现在各大浏览器身上。

事实上也确实如此，**无论你在一次事件循环中调用多少次的 DOM API ，浏览器也只会触发一次回流与重绘（如果需要），并且如果多次调用并没有修改 DOM 状态，那么回流与重绘一次都不会发生**。

Timeline 截图（没有回流和重绘发生）：

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

测试代码：

```
<body>
  <div class="app"></div>
  <script> let counts = 1000
    let $app = document.querySelector('.app')
    setTimeout(() => {
      for (let i = 0; i < counts; i++) {
        $app.innerHTML = 'aaaa'
        $app.style = 'margin-top: 100px'
        $app.innerHTML = ''
        $app.style = ''
      }
    }, 1000) </script>
</body>
```

### **无意义的回流与重绘**

第二个观点是比较有意思的，虽然看了上面的分析，你应该也知道它是错的，批量操作并不能减少回流与重绘，因为它们本身就只会触发一次。但我还是要列出来证明一下，因为这是我们当下众多前端的一个固有思维，我在准备写这篇文章前问了一下众神交流群的朋友们，他们几乎都掉进了这个认知陷阱中，认为批量操作会减少回流与重绘。

**批量操作并不能减少回流与重绘**，原因也和上文一致，Javascript 是单线程且与 UI 线程互斥，所以直接放测试数据：

Javascript 执行耗时（数据取3次平均值）：

https://mmbiz.qpic.cn/mmbiz_png/HLN2IKtpicicFqre3jIjqd5rlXVDvRwPu6BQ5X7QeeFstjfmS5cqwTTzZXXXYPQgNvfs2hRGIbneQf3kh7eLJpWQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

https://mmbiz.qpic.cn/mmbiz_png/HLN2IKtpicicFqre3jIjqd5rlXVDvRwPu6MNUwgYn24ibASnhiatibVlT8e7eLHCM4cc8CiaUUYNXxf2PVe0pbg08yzQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

Layout 耗时（数据取3次平均值）：

https://mmbiz.qpic.cn/mmbiz_png/HLN2IKtpicicFqre3jIjqd5rlXVDvRwPu6WwOShXReeF4HEMeYBIoFcdaicWKtnOgD9q1yI2NE0BVrfaOuuK9G4Cw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

https://mmbiz.qpic.cn/mmbiz_png/HLN2IKtpicicFqre3jIjqd5rlXVDvRwPu6f0Fsae1RxAiaeA5yYV8FRG7EEN694rRs3KQb3epSXib8Huw5zTK4TbWg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

测试代码：

```
<body>
  <div class="app"></div>
  <script> let counts = 1000
    let $app = document.querySelector('.app')
    let start = performance.now()
// 单独操作
// for (let i = 0; i < counts; i++) {
//   let node = document.createTextNode(`${i}, `)
//   $app.append(node)
// }

// 批量操作
    let $tempContainer = document.createElement('div')
    for (let i = 0; i < counts; i++) {
      let node = document.createTextNode('node,')
      $tempContainer.append(node)
    }
    $app.append($tempContainer)

    console.log(performance.now() - start) </script>
</body>
```

可以看到的是，批量处理和单次处理再 Layout 期间耗时是几乎一致的，虽然在 script 执行阶段还是存在一定的性能优势（大概 30%），但大抵上只要你用好 DOM 操作，批量或不批量带来的性能影响是很小的（ 10W 次调用多损耗 27ms ）。

题外话：这里提出一个问题，为什么在 script 执行阶段还是存在一定的性能差距？答案会在晚些时候公布（等我看完这部分逻辑）

## **Virtual DOM 有 diff 算法？**

严格来说 diff 算法和 Virtual DOM 是两个独立的东西，二者互相之间也没有充分必要的关联，比如 svelte[4] 没有 Virtual DOM 也有其自己的 diff 算法。

但由于前端框架存在 Virtual DOM 就总有 diff 算法，并且使用了 Virtual DOM 对 diff 算法也有两个助力：

1. 得益于 Virtual DOM 的抽象能力，diff 算法更容易被实现和理解
2. 得益于 Virtual DOM Tree 总是在内存中， diff 算法功能可以更强大（比如组件移动，没有完整的 Tree 结构是不可能实现的）

diff 算法能减少 DOM API 调用，显然是存在设计和性能优势的，而**由于 Virtual DOM 的存在，diff 算法可以更方便且更强大**，所以我认同这是 Virtual DOM 的优势，但不能用“Virtual DOM 有 diff 算法”这样的表述。

## **Virtual DOM 有跨平台优势？**

上文提到的 svelte 没有 Virtual DOM ，但一样可以实现服务端渲染，这说明跨平台并不依赖于 Virtual DOM 。

其实只要 Javascript 框架有实现平台 API 分发机制，就能在不同平台执行不同的渲染方法，即拥有跨平台能力。这个能力的根本，是 Javascript 代码能**低代价地**在各个平台运行（得利于浏览器在各个平台的普及和 NodeJS），也就是常说的 Javascript 的优势之一是跨平台。所以把跨平台当做 Virtual DOM 的优势，其实是不正确的，但我们或许应该去思考下他们为什么会这么认为。

我的想法，可能是这两个原因：

1. Virtual DOM 的优势，**可以在不接触真实 DOM 的情况下操作 DOM**，并且性能更好

   在 Virutal DOM 上的改动，最终还是会调用平台 API 去操作真实的 DOM ，所以没有 Virtual DOM 只是相当于少了一个中间抽象层，并不影响跨平台能力有无。但还是需要明白，就目前的分析来看，这个抽象层对跨平台能力还是提供了相当大的方便（或者说助力）的。

2. Virtual DOM 在 Vue 中很重要，Vue 本身就是一个围绕 Virtual DOM 创建起来的框架，脱离了 Virtual DOM 其设计思想必然会和当下迥乎不同