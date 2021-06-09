---
title: 进阶Vue篇（一）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

## 一.什么是库？什么是框架?

- 库是将代码集合成一个产品,库是我们调用库中的方法实现自己的功能。
- 框架则是为解决一类问题而开发的产品,框架是我们在指定的位置编写好代码，框架帮我们调用。

## 二.MVC 和 MVVM 区别

- 传统的 MVC 指的是,用户操作会请求服务端路由，路由会调用对应的控制器来处理,控制器会获取数据。将结果返回给前端,页面重新渲染
- MVVM :传统的前端会将数据手动渲染到页面上, MVVM 模式不需要用户收到操作 dom 元素,将数据绑定到 viewModel 层上，会自动将数据渲染到页面中，视图变化会通知 viewModel层更新数据。 ViewModel 就是我们 MVVM 模式中的桥梁.

> Vue并没有完全遵循MVVM模型，严格的MVVM模式中,View层不能直接和Model层通信,只能通过ViewModel来进行通信。因为vue中提供了$ref，使其可以直接操作dom

#### Node（后端）中的MVC 与前端中的MVVM之间的区别

- MVC 是后端的分层开发的概念；
- MVVM是前端视图的概念，主要关注与 视图层分离，也就是说：MVVM把前端的视图层，分为了三部分Model，View，VM ViewModel

##### 先了解下MVC

> Model层:职能单一，只负责操作数据库，执行对应的Sql语句，进行数据的CRUD。  **Model是数据模型**，Model定义了这个模块的数据模型。在代码中体现为**数据管理者，Model负责对数据进行获取及存放**。数据不可能凭空生成的，要么是从服务器上面获取到的数据，要么是本地数据库中的数据，也有可能是用户在UI上填写的表单即将上传到服务器上面存放，所以需要有数据来源。Controller不需要知道Model是如何拿到数据的，只管调用就行了。数据存放的地方是Model，而使用数据的地方是在Controller，所以Model应该提供接口供Controller访问其存放的数据。
>  V: View是视图，简单说就是我们在界面上看到的一切。
>  C：这是业务逻辑处理层，在这个模块中，封装了一些具体业务逻辑处理的逻辑代码，但是也是为了保证只能单一，此模块只负责处理业务，不负责处理数据的CRUD（create-read-update-delete），如果涉及到了数据的CRUD需要调用Model层。
>  他还承担起MVC中的数据和视图的协调者，也就是在Controller里面把Model的数据赋值给View来显示（或者是View接收用户输入的数据然后由Controller把这些数据传给Model来保存到本地或者上传到服务器）

综合以上内容，实际上你应该可以通过面向对象的基本思想来推导出controller出现的原因：我们所有的App都是界面和数据的交互，所以需要类来进行界面的绘制，于是出现了View，需要类来管理数据于是出现了Model。我们设计的View应该能显示任意的内容比如UILabel显示的文字应该是任意的而不只是某个特定Model的内容，所以我们不应该在View的实现中去写和Model相关的任何代码，如果这样做了，那么View的可扩展性就相当低了。而Model只是负责处理数据的，它根本不知道数据到时候会拿去干啥，可能拿去作为算法噼里啪啦去了，可能拿去显示给用户了，它既然无法接收用户的交互，它就不应该去管和视图相关的任何信息，所以Model中不应该写任何View相关代码。然而我们的数据和界面应该同步，也就是一定要有个地方要把Model的数据赋值给View，而Model内部和View的内部都不可能去写这样的代码，所以只能新创造一个类出来了，取名为Controller。它被UIKit逐渐完善成了我们现在使用的UIViewController。

##### 关于 MVC可以参考一张思路图去理解

![img](https:////upload-images.jianshu.io/upload_images/18780212-8efe84d0d6a8497e.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

image.png

![img](https:////upload-images.jianshu.io/upload_images/18780212-1c35035ad4a9f3cb.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/1127/format/webp)

mvc.jpg

##### 什么是MVVM？

> MVVM是前端视图层的分层开发思想，主要把每个页面，分成了M，V和VM。其中VM是MVVM思想的核心；因为VM是M和V之间的调度者。

##### 前端使用MVVM思想的好处

> 主要是为了让我们开发更加方便，因为MVVM提供了数据的双向绑定；注意：数据的双向绑定是由VM提供的。

##### 参考一张思路图

![img](https:////upload-images.jianshu.io/upload_images/18780212-c9fb723c62340f54.png?imageMogr2/auto-orient/strip|imageView2/2/w/1188/format/webp)

image.png

##### vue代码与MVVM的对应刨析图

![img](https:////upload-images.jianshu.io/upload_images/18780212-a8fc88d2375c10fe.png?imageMogr2/auto-orient/strip|imageView2/2/w/1130/format/webp)

## 三.Vue的基本使用

### 1、快速安装

```bash
$ npm init -y  // npm 的初始化
$ npm install vue // 安装vue的包
```

### 2、Vue中的模板

```html
<script src="node_modules/vue/dist/vue.js"></script>
<!-- 3.外部模板 -->
<div id="app">{{name}}</div>
<script>
    const vm = new Vue({
        el:'#app',
        data:{
            name:'jw',
            age: 22
        },
        // 2.内部模板
        template:'<div>{{age}}</div>',
        // 1.render函数
        render(h){
            return h('h1',['hello,',this.name,this.age])
        }
    });
</script>
```

> 我们默认使用的是 `runtime-with-compiler`版本的vue,带compiler的版本才能使用template属性，内部会将template编译成render函数，（其实vue内部最终的渲染使用是render函数）
>
> ​	vue模板的查找流程：

- 1、渲染流程，会先查找用户传入的render

- 2、如果没有传入render则查找template属性

- 3、如果没有传入template则查找el属性，如果有el，则采用el的模板 

  ###### 总结：1、首先如果用户在vue对象实例中没有传入上面的render、template、el，就是通常在.vue文件会有template标签，vue拿到标签之后进行html的词法解析，

  ###### 2、对html标签进行parser之后，解析成ast语法树（后面会将ast），通过codegen将这些ast语法树变成  _c('div',{},'hello') => 让字符串执行（实际render函数中就是类似这样的 _c('div',{},'hello')字符串）

我们可以在vue中使用表达式语法，表达式会在所属 Vue 实例的数据作用域下作为 JavaScript 被解析。

```html
<div id="app">
    <!-- 可以放入运算的结果 -->
    {{ 1+ 1 }}
    <!-- 当前这个表达式 最后会被编译成函数 _v(msg === 'hello'? true:false) -->
    {{msg === 'hello'? true:false}}
    <!-- 取值操作，函数返回结果 -->
    {{obj.a}}  {{fn()}}
</div>
```

> 这里不能使用js语句(`var a = 1`)，带有返回值的都可以应用在模板语法中。

### 3、响应式原则 

- 1、Vue内部会递归的去循环vue中的data属性,会给每个属性都增加getter和setter，当属性值变化时会更新视图（实际是触发watcher监听函数的执行，比对dom是否重新渲染dom，已达到更新视图）。
- 2、重写了数组中的方法，当调用数组方法时会触发更新,也会对数组中的数据(对象类型)进行了监控（主要修改了'push','shift','unshift','pop','reverse','sort','splice'）这些会改变数组本身的api

** 通过以上两点可以发现Vue中的缺陷: **

- 1、对象默认只监控自带的属性，新增的属性响应式不生效 (层级过深，性能差) , 所以在一开始vue实例中如果用到哪些属性，就要提前在data声明出来
- 2、数组通过索引进行修改 或者 修改数组的长度，响应式不生效

Vue额外提供的API:

```js
// $set其实就是将设置的属性，重新变成响应式的
vm.$set(vm.arr,0,100); // 修改数组内部使用的是splice方法 
vm.$set(vm.address,'number','6-301'); // 新增属性通过内部会将属性定义成响应式数据        
vm.$delete(vm.arr,0);  // 删除索引，属性
```

> 为了解决以上问题,Vue3.0使用Proxy来解决

```js
let obj = {
    name: {name: 'jw'},
    arr: ['吃', '喝', '玩']
}
let handler = {
    get(target,key){
        if(typeof target[key] === 'object' && target[key] !== null){
            return new Proxy(target[key],handler);
        }
        return Reflect.get(target,key);
    },
    set(target,key,value){ 
        let oldValue = target[key];
        if(!oldValue){
            console.log('新增属性')
        }else if(oldValue !== value){
            console.log('修改属性')
        }
        return Reflect.set(target,key,value);
    }
}
let proxy = new Proxy(obj,handler);
```

> 代理 get、set方法,可以实现懒代理。并且兼容数组索引和长度变化

### 4、实例方法

- vm._uid (每个实例的唯一标识)
- vm.$data === vm._data (实例的数据源)
- vm.$options (用户传入的属性)
- vm.$el (当前组件的真实dom)
- vm.$nextTick (等待同步代码执行完毕) 一般使用的时候是在数据更改之后，以后dom更新之后需要处理逻辑，才会去执行这个方法
- vm.$mount (手动挂载实例)
- vm.$watch (监控数据变化)

> 这些属性后续都会经常被应用，当然还有一些其他比较重要的属性，后续会在详细介绍。

## 四.指令的使用

vue中的指令,vue中都是以v-开头 (一般用来操作`dom`)

### 常见指令

- `v-once` 渲染一次 (可用作优化，但是使用频率极少)
- `v-html` 将字符串转化成`dom`插入到标签中 (会导致xss攻击问题,并且覆盖子元素)
- `v-if/v-else/v-else-if` 不满足时`dom`不存在(可以使用template标签)
- `v-show` 不满足时`dom`隐藏 (不能使用template标签)
- `v-for` 循环字符串、对象、数字、数组 (循环时必须加key，尽量不采用索引，索引并不是唯一标识)
- `v-bind` 可以简写成: 属性(style、class...)绑定
- `v-on` 可以简写成@ 给元素绑定事件 (常用修饰符 .stop、.prevent、.self、.once、.passive)
- `v-model`双向绑定 (支持.trim、.number修饰符)

**常考点：**

### 1、v-show和v-if区别

- v-if 如果条件不成立不会渲染当前指令所在节点的 dom 元素
- v-show 只是切换当前 dom 的显示或者隐藏

```js
const VueTemplateCompiler = require('vue-template-compiler'); 
let r1 = VueTemplateCompiler.compile(`
    <div v-if="true"><span v-for="i in 3">hello</span></div>`
); 
// vue的编译模板的时候，如果你的标签中存在v-if的话，拿到值，也是同样会解析成_c()这样的函数，但是在执行时候，会根据v-if的值来是否执行render函数
/** with(this) { 
 *   return (true) ? _c('div', _l((3), function (i) { return _c('span', [_v("hello")]) }), 0) : _e() 
 * }
**/
```

> ```
> v-show` 会解析成指令,变为`display:none
> ```

### 2、v-for和v-if连用问题

- v-for 会比 v-if 的优先级高一些,如果连用的话会把 v-if 给每个元素都添加一下,会造成性能问题 (使用计算属性优化)

```js
const VueTemplateCompiler = require('vue-template-compiler'); 
let r1 = VueTemplateCompiler.compile(`<div v-if="false" v-for="i in 3">hello</div>`); 
/** with(this) { 
 *    return _l((3), function (i) { return (false) ? _c('div', [_v("hello")]) : _e() }) 
 *  }
**/;
```

### 3、v-for为什么要加key

为了在比对过程中进行复用 

**没有key**

```html
 <div id="app">
    <div>
      <input type="text" v-model="name">
      <button @click="add">添加</button>
    </div>
    <ul>
      <li v-for="(item, i) in list">
        <input type="checkbox"> {{item.name}}
      </li>
    </ul>
<script>
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        name: '',
        newId: 3,
        list: [
          { id: 1, name: '李斯' },
          { id: 2, name: '吕不韦' },
          { id: 3, name: '嬴政' }
        ]
      },
      methods: {
        add() {
         //注意这里是unshift
          this.list.unshift({ id: ++this.newId, name: this.name })
          this.name = ''
        }
      }
    });
  </script>
  </div>
```

> 当选中吕不为时，添加楠楠后选中的确是李斯，并不是我们想要的结果，我们想要的是当添加楠楠后，一种选中的是吕不为

![img](https:////upload-images.jianshu.io/upload_images/3973616-ff6a298524fd39dc.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/500/format/webp)

key1.jpg

![img](https:////upload-images.jianshu.io/upload_images/3973616-281b0c8ae857f17f.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/534/format/webp)

key3.jpg

**有key**

```html
  <div id="app">
    <div>
      <input type="text" v-model="name">
      <button @click="add">添加</button>
    </div>
    <ul>
      <li v-for="(item, i) in list" :key="item.id">
        <input type="checkbox"> {{item.name}}
      </li>
    </ul>
<script>
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        name: '',
        newId: 3,
        list: [
          { id: 1, name: '李斯' },
          { id: 2, name: '吕不韦' },
          { id: 3, name: '嬴政' }
        ]
      },
      methods: {
        add() {
         //注意这里是unshift
          this.list.unshift({ id: ++this.newId, name: this.name })
          this.name = ''
        }
      }
    });
  </script>
  </div>
```

> 同样当选中吕不为时，添加楠楠后依旧选中的是吕不为。

![img](https:////upload-images.jianshu.io/upload_images/3973616-c34bc534f49544a0.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/500/format/webp)

key1.jpg

![img](https:////upload-images.jianshu.io/upload_images/3973616-ef133a0c7dff8d82.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/478/format/webp)

key2.jpg

```
可以简单的这样理解：加了key(一定要具有唯一性) id的checkbox跟内容进行了一个关联。是我们想达到的效果
```

查过相关文档，图例说明很清晰。

vue和react的虚拟DOM的Diff算法大致相同，其核心是基于两个简单的假设
 首先讲一下diff算法的处理方法，对操作前后的dom树同一层的节点进行对比，一层一层对比，如下图：



![img](https:////upload-images.jianshu.io/upload_images/3973616-cbe6ef9bad920f51.png?imageMogr2/auto-orient/strip|imageView2/2/w/576/format/webp)

before.png

当某一层有很多相同的节点时，也就是列表节点时，Diff算法的更新过程默认情况下也是遵循以上原则。
 比如一下这个情况：



![img](https:////upload-images.jianshu.io/upload_images/3973616-6d930e85939f0a3e.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/477/format/webp)



我们希望可以在B和C之间加一个F，Diff算法默认执行起来是这样的：



![img](https:////upload-images.jianshu.io/upload_images/3973616-c93a83cb2203fa54.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/572/format/webp)


 即把C更新成F，D更新成C，E更新成D，最后再插入E，是不是很没有效率？

所以我们需要使用key来给每个节点做一个唯一标识，Diff算法就可以正确的识别此节点，找到正确的位置区插入新的节点。



![img](https:////upload-images.jianshu.io/upload_images/3973616-25f6c171772b50b6.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/452/format/webp)

3297464-650689b4bd4b9eb6.jpg



vue中列表循环需加:key="唯一标识" 唯一标识可以是item里面id index等，因为vue组件高度复用增加Key可以标识组件的唯一性，为了更好地区别各个组件 key的作用主要是为了高效的更新虚拟DOM

![img](http://www.zhufengpeixun.com/jg-vue/assets/img/diff-key.5862ebbc.jpg)

### 4、v-model原理

内部会根据标签的不同解析出，不同的语法

- 例如 文本框会被解析成 value + input事件
- 例如 复选框会被解析成 checked + change事件
- ...

## 五.自定义指令

我们可以自定义Vue中的指令来实现功能的封装 (全局指令、局部指令)

### 钩子函数

指令定义对象可以提供如下几个钩子函数:

- bind：只调用一次，指令第一次绑定到元素时调用
- inserted：被绑定元素插入父节点时调用
- update：所在组件的 VNode 更新时调用,组件更新前状态
- componentUpdated：所在组件的 VNode 更新时调用,组件更新后的状态
- unbind：只调用一次，指令与元素解绑时调用。

```js
// 1.el 指令所绑定的元素，可以用来直接操作 DOM
// 2.bindings 绑定的属性
// 3.Vue编译生成的虚拟节点  (context)当前指令所在的上下文
bind(el,bindings,vnode,oldVnode){ // 无法拿到父元素 父元素为null
    console.log(el.parentNode,oldVnode)
},
inserted(el){ // 父元素已经存在
    console.log(el.parentNode)
},
update(el){ // 组件更新前
    console.log(el.innerHTML)
},
componentUpdated(el){ // 组件更新后
    console.log(el.innerHTML)
},
unbind(el){ // 可用于解除事件绑定
    console.log(el)
}
```

### 练习1.clickOutSide

```html
<div v-click-outside="hide">
    <input type="text" @focus="show">
    <div v-if="isShow">显示面板</div>
</div>
```

指令的编写

```js
Vue.directive(clickOutside,{
    bind(el,bindings,vnode){
        el.handler = function (e) {
            if(!el.contains(e.target)){
                let method = bindings.expression;
                vnode.context[method]();
            }
        } 
        document.addEventListener('click',el.handler)
    },
    unbind(el){ 
        document.removeEventListener('click',el.handler)
    }
})
```

### 练习2.v-lazy

提供的`server.js`

```js
const express =require('express');
const app = express();
app.use(express.static(__dirname+'\\images'))
app.listen(3000);
const arr = [];
for(let i = 10; i <=20;i++){
    arr.push(`${i}.jpeg`)
}
app.get('/api/img',(req,res)=>{
    res.json(arr)
})
```

**插件使用**

其实内部使用install方法将将插件绑定到Vue构造函数上

```html
<script src="node_modules/vue/dist/vue.js"></script>
<script src="node_modules/axios/dist/axios.js"></script>
<script src="./vue-lazyload.js"></script>
<div id="app">
    <div class="box">
        <li v-for="img in imgs" :key="img">
            <img v-lazy="img">
        </li>        
    </div>
</div>
<script>
    const loading = 'http://localhost:3000/images/1.gif';
    Vue.use(VueLazyload,{
        preLoad: 1.3, // 可见区域的1.3倍
        loading, // loading图
    })
    const vm = new Vue({
        el:'#app',
        data() {
            return {
                imgs: []
            }
        },
        created() {
            axios.get('http://localhost:3000/api/img').then(({data})=>{
                this.imgs = data;
            })
        }
    });
</script>
<style>
    .box {
        height: 300px;
        overflow: scroll;
        width: 200px;
    }
    img {
        width: 100px;
        height: 100px;
    }
</style>
```

**定义插件**

```js
const Lazy = (Vue) => {
    return class LazyClass {
        constructor(options){
            this.options = options;
        }
        add(el,bindings,vnode){}
    }
}
const VueLazyload = {
    install(Vue) {
        const LazyClass = Lazy(Vue);
        const lazy = new LazyClass(options);
        Vue.directive('lazy', {
            bind: lazy.add.bind(lazy)
        });
    }
}
```

**获取滚动元素**

```js
const scrollParent = (el) =>{
    let parent = el.parentNode;
    while(parent){
        if(/scroll/.test(getComputedStyle(parent)['overflow'])){
            return parent;
        }
        parent = parent.parentNode;
    }
    return parent;
}
const Lazy = (Vue) => {
    return class LazyClass {
        constructor(options){
            this.options = options;
        }
        add(el,bindings,vnode){
            Vue.nextTick(()=>{
                // 获取滚动元素
                let parent = scrollParent(el);
                // 获取链接
                let src = bindings.value;
            });
        }
    }
}
```

**触发事件**

```js
const Lazy = (Vue) => {
    class ReactiveListener {
        constructor({el,src,elRenderer,options}){
            this.el = el;
            this.src = src;
            this.elRenderer = elRenderer;
            this.options = options;
            // 定义状态
            this.state = {loading:false}
        }
    }
    return class LazyClass {
        constructor(options) {
            this.options = options;
            this.listenerQueue = [];
            this.bindHandler = false;
        }
        lazyLoadHandler() {
            console.log('绑定')
        }
        add(el, bindings, vnode) {
            Vue.nextTick(() => {
                // 获取滚动元素
                let parent = scrollParent(el);
                // 获取链接
                let src = bindings.value;

                // 绑定事件
                if (!this.bindHandler) {
                    this.bindHandler = true;
                    parent.addEventListener('scroll', this.lazyLoadHandler.bind(this))
                }
                // 给每个元素创建个实例，放到数组中
                const listener = new ReactiveListener({
                    el, // 当前元素
                    src, // 真实路径
                    elRenderer: this.elRenderer.bind(this), // 传入渲染器
                    options: this.options
                });
                this.listenerQueue.push(listener);
                // 检测需要默认加载哪些数据
                this.lazyLoadHandler();
            });
        }
        elRenderer(listener, state) {
            let el = listener.el;
            let src = '';
            switch (state) {
                case 'loading':
                    src = listener.options.loading || ''
                    break;
                case 'error':
                    src = listener.options.error || ''
                default:
                    src = listener.src;
                    break;
            }
            el.setAttribute('src',src)
        }
    }
}
```

**加载图片**

```js
const loadImageAsync = (src,resolve,reject) => {
    let image = new Image();
    image.src = src;
    image.onload = resolve;
    image.onerror = reject
}
class ReactiveListener {
    constructor({el,src,elRenderer,options}){
        this.el = el;
        this.src = src;
        this.elRenderer = elRenderer;
        this.options = options;
        // 定义状态
        this.state = {loading:false}
    }
    checkInView(){
        let {top} = this.el.getBoundingClientRect(); 
        return top < window.innerHeight * this.options.preLoad
    }
    load(){
        this.elRenderer(this,'loading');
        loadImageAsync(this.src,()=>{
            this.state.loading = true; // 加载完毕了
            this.elRenderer(this,'loaded');
        },()=>{
            this.elRenderer(this,'error');
        }); 
    }
}
```

**增加滚动节流**

```js
const throttle = (cb, delay) => {
    let prev = Date.now();
    return () => {
        let now = Date.now();
        if (now - prev >= delay) {
            cb();
            prev = Date.now();
        }
    }
}
this.lazyHandler = throttle(this.lazyLoadHandler.bind(this),500);
parent.addEventListener('scroll', this.lazyHandler.bind(this));
```

<marquee>
<Boxx :blockStyle="blockStyle"  />
<Boxx type="warning" :blockStyle="titleStyle" :titleStyle="titleStyle" changeTime="1000" title="我是一个大大的且变化的 title"/>
<Boxx type="danger" :blockStyle="contentStyle" :contentStyle="contentStyle" content="我是一个小小的<br><marquee>content</marquee>"/>
</marquee>

<script>
	export default {
		data() {
			return {
				blockStyle: {'background':'#eee','color':'red'},
                titleStyle: {'margin-right': '10%','font-size':'16px'},
                contentStyle: {'margin-right': '20%','font-size':'10px',
                               "margin-top": "1rem","margin-bottom": "0.4rem"},
			}
		}
	}
</script>