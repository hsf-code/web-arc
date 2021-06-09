# 基础

### 1、为什么 data 是一个函数？

​	组件中的 data 写成一个函数，数据以函数返回值形式定义，这样每复用一次组件，就会返回一份新的 data，类似于给每个组件实例创建一个私有的数据空间，让各个组件实例维护各自的数据。而单纯的写成对象形式，就使得所有组件实例共用了一份 data，就会造成一个变了全都会变的结果；

### 2、Vue 组件通讯有哪几种方式

1. props 和 父组件向子组件传递数据是通过传递的，子组件传递数据给父组件是通过emit 触发事件来做到的
2. children 获取当前组件的父组件和当前组件的子组件
3. `$attrs` 与 `$listeners` A->B->C。Vue 2.4 开始提供了 `$attrs` 和`$listeners`来解决这个问题
4. 父组件中通过 provide 来提供变量，然后在子组件中通过 inject 来注入变量。(官方不推荐在实际业务中使用，但是写组件库时很常用)
5. $refs 获取组件实例
6. eventBus 兄弟组件数据传递 这种情况下可以使用事件总线的方式
7. vuex 状态管理

### 3、Vue 的生命周期方法有哪些 一般在哪一步发请求

**「beforeCreate」** 在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。在当前阶段 data、methods、computed 以及 watch 上的数据和方法都不能被访问

**「created」** 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。这里没有 如果非要想与进行交互，可以通过nextTick 来访问 Dom

**「beforeMount」** 在挂载开始之前被调用：相关的 render 函数首次被调用。

**「mounted」** 在挂载完成后发生，在当前阶段，真实的 Dom 挂载完毕，数据完成双向绑定，可以访问到 Dom 节点

**「beforeUpdate」** 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁（patch）之前。可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程

**「updated」** 发生在更新完成之后，当前阶段组件 Dom 已完成更新。要注意的是避免在此期间更改数据，因为这可能会导致无限循环的更新，该钩子在服务器端渲染期间不被调用。

**「beforeDestroy」** 实例销毁之前调用。在这一步，实例仍然完全可用。我们可以在这时进行善后收尾工作，比如清除计时器。

**「destroyed」** Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务器端渲染期间不被调用。

**「activated」** keep-alive 专属，组件被激活时调用

**「deactivated」** keep-alive 专属，组件被销毁时调用

> ❝
>
> 异步请求在哪一步发起？
>
> ❞

可以在钩子函数 created、beforeMount、mounted 中进行异步请求，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。

如果异步请求不需要依赖 Dom 推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

- 能更快获取到服务端数据，减少页面 loading 时间；
- ssr  不支持 beforeMount 、mounted 钩子函数，所以放在 created 中有助于一致性；

### 4、v-if 和 v-show 的区别

v-if 在编译过程中会被转化成三元表达式,条件不满足时不渲染此节点。

v-show 会被编译成指令，条件不满足时控制样式将对应节点隐藏 （display:none）

**「使用场景」**

v-if 适用于在运行时很少改变条件，不需要频繁切换条件的场景

v-show 适用于需要非常频繁切换条件的场景

> ❝
>
> 扩展补充：display:none、visibility:hidden 和 opacity:0 之间的区别？
>
> ❞

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/gMvNo9rxo404ejQQIePEviaYwUyBQwOZribt0CPRlG5oSMAialnymTh8JzhlFHl6HZ66MTfdOiafhBmaLzp6bMPUqw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)display.png

### 5、说说 vue 内置指令

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/gMvNo9rxo404ejQQIePEviaYwUyBQwOZrHjza2UG4OV5yKzveQvV7SaKbQwx3KG28OF1165t7vrQ3mdDphTKhaw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

### 6、怎样理解 Vue 的单向数据流

数据总是从父组件传到子组件，子组件没有权利修改父组件传过来的数据，只能请求父组件对原始数据进行修改。这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解。

> ❝
>
> 注意：在子组件直接用 v-model 绑定父组件传过来的 prop 这样是不规范的写法 开发环境会报警告
>
> ❞

如果实在要改变父组件的 prop 值 可以再 data 里面定义一个变量 并用 prop 的值初始化它 之后用 $emit 通知父组件去修改，

*总结：利用$emit的方式去修改props的属性值，不可以直接修改；*

### 7、computed 和 watch 的区别和运用的场景

computed 是计算属性，依赖其他属性计算值，并且 computed 的值有缓存，只有当计算值变化才会返回内容，它可以设置 getter 和 setter。

watch 监听到值的变化就会执行回调，在回调中可以进行一些逻辑操作。

计算属性一般用在模板渲染中，某个值是依赖了其它的响应式对象甚至是计算属性计算而来；而侦听属性适用于观测某个值的变化去完成一段复杂的业务逻辑

