---
title: vue基础解析1
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

## 一、slot是什么？

​	在HTML中 `slot` 元素 ，作为 `Web Components` 技术套件的一部分，是Web组件内的一个占位符，该占位符可以在后期使用自己的标记语言填充

举个栗子

```html
<template id="element-details-template">
  <slot name="element-name">Slot template</slot>
</template>
<element-details>
  <span slot="element-name">1</span>
</element-details>
<element-details>
  <span slot="element-name">2</span>
</element-details>
```

`template`不会展示到页面中，需要用先获取它的引用，然后添加到`DOM`中，

```jsx
customElements.define('element-details',
  class extends HTMLElement {
    constructor() {
      super();
      const template = document
        .getElementById('element-details-template')
        .content;
      const shadowRoot = this.attachShadow({mode: 'open'})
        .appendChild(template.cloneNode(true));
  }
})
```

**二、使用场景**

通过插槽可以让用户可以拓展组件，去更好地复用组件和对其做定制化处理

如果父组件在使用到一个复用组件的时候，获取这个组件在不同的地方有少量的更改，如果去重写组件是一件不明智的事情

通过`slot`插槽向组件内部指定位置传递内容，完成这个复用组件在不同场景的应用

比如布局组件、表格列、下拉选、弹框显示内容等

**三、分类**

`slot`可以分来以下三种：

- 默认插槽
- 具名插槽
- 作用域插槽

**默认插槽**

子组件用`<slot>`标签来确定渲染的位置，标签里面可以放`DOM`结构，当父组件使用的时候没有往插槽传入内容，标签内`DOM`结构就会显示在页面

父组件在使用的时候，直接在子组件的标签内写入内容即可

子组件`Child.vue`

```
<template>
    <slot>
      <p>插槽后备的内容</p>
    </slot>
</template>
```

父组件

```
<Child>
  <div>默认插槽</div>  
</Child>
```

**具名插槽**

子组件用`name`属性来表示插槽的名字，不传为默认插槽

父组件中在使用时在默认插槽的基础上加上`slot`属性，值为子组件插槽`name`属性值

子组件`Child.vue`

```
<template>
    <slot>插槽后备的内容</slot>
  <slot name="content">插槽后备的内容</slot>
</template>
```

父组件

```
<child>
    <template v-slot:default>具名插槽</template>
    <!-- 具名插槽⽤插槽名做参数 -->
    <template v-slot:content>内容...</template>
</child>
```

**作用域插槽**

子组件在作用域上绑定属性来将子组件的信息传给父组件使用，这些属性会被挂在父组件`v-slot`接受的对象上

父组件中在使用时通过`v-slot:`（简写：#）获取子组件的信息，在内容中使用

子组件`Child.vue`

```
<template> 
  <slot name="footer" testProps="子组件的值">
          <h3>没传footer插槽</h3>
    </slot>
</template>
```

父组件

```
<child> 
    <!-- 把v-slot的值指定为作⽤域上下⽂对象 -->
    <template v-slot:default="slotProps">
      来⾃⼦组件数据：{{slotProps.testProps}}
    </template>
  <template #default="slotProps">
      来⾃⼦组件数据：{{slotProps.testProps}}
    </template>
</child>
```

**小结：**

- `v-slot`属性只能在`<template>`上使用，但在只有默认插槽时可以在组件标签上使用
- 默认插槽名为`default`，可以省略default直接写`v-slot`
- 缩写为`#`时不能不写参数，写成`#default`
- 可以通过解构获取`v-slot={user}`，还可以重命名`v-slot="{user: newName}"`和定义默认值`v-slot="{user = '默认值'}"`

**四、原理分析**

`slot`本质上是返回`VNode`的函数，一般情况下，`Vue`中的组件要渲染到页面上需要经过`template -> render function -> VNode -> DOM` 过程，这里看看`slot`如何实现：

编写一个`buttonCounter`组件，使用匿名插槽

```jsx
Vue.component('button-counter', {
  template: '<div> <slot>我是默认内容</slot></div>'
})
```

使用该组件

```jsx
new Vue({
    el: '#app',
    template: '<button-counter><span>我是slot传入内容</span></button-counter>',
    components:{buttonCounter}
})
```

获取`buttonCounter`组件渲染函数

```jsx
(function anonymous() {
with(this){return _c('div',[_t("default",[_v("我是默认内容")])],2)}
})
```

`_v`表示穿件普通文本节点，`_t`表示渲染插槽的函数

渲染插槽函数`renderSlot`（做了简化）

```jsx
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  // 得到渲染插槽内容的函数    
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  // 如果存在插槽渲染函数，则执行插槽渲染函数，生成nodes节点返回
  // 否则使用默认值
  nodes = scopedSlotFn(props) || fallback;
  return nodes;
}
```

`name`属性表示定义插槽的名字，默认值为`default`，`fallback`表示子组件中的`slot`节点的默认值

关于`this.$scopredSlots`是什么，我们可以先看看`vm.slot`

```jsx
function initRender (vm) {
  ...
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  ...
}
resolveSlots`函数会对`children`节点做归类和过滤处理，返回`slots
function resolveSlots (
    children,
    context
  ) {
    if (!children || !children.length) {
      return {}
    }
    var slots = {};
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i];
      var data = child.data;
      // remove slot attribute if the node is resolved as a Vue slot node
      if (data && data.attrs && data.attrs.slot) {
        delete data.attrs.slot;
      }
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if ((child.context === context || child.fnContext === context) &&
        data && data.slot != null
      ) {
        // 如果slot存在(slot="header") 则拿对应的值作为key
        var name = data.slot;
        var slot = (slots[name] || (slots[name] = []));
        // 如果是tempalte元素 则把template的children添加进数组中，这也就是为什么你写的template标签并不会渲染成另一个标签到页面
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children || []);
        } else {
          slot.push(child);
        }
      } else {
        // 如果没有就默认是default
        (slots.default || (slots.default = [])).push(child);
      }
    }
    // ignore slots that contains only whitespace
    for (var name$1 in slots) {
      if (slots[name$1].every(isWhitespace)) {
        delete slots[name$1];
      }
    }
    return slots
}
_render`渲染函数通过`normalizeScopedSlots`得到`vm.$scopedSlots
vm.$scopedSlots = normalizeScopedSlots(
  _parentVnode.data.scopedSlots,
  vm.$slots,
  vm.$scopedSlots
);
```

作用域插槽中父组件能够得到子组件的值是因为在`renderSlot`的时候执行会传入`props`，也就是上述`_t`第三个参数，父组件则能够得到子组件传递过来的值



## 二、什么是虚拟DOM

​		虚拟 DOM （`Virtual DOM` ）这个概念相信大家都不陌生，从 `React` 到 `Vue` ，虚拟 `DOM` 为这两个框架都带来了跨平台的能力（`React-Native` 和 `Weex`）

实际上它只是一层对真实`DOM`的抽象，以`JavaScript` 对象 (`VNode` 节点) 作为基础的树，用对象的属性来描述节点，最终可以通过一系列操作使这棵树映射到真实环境上

在`Javascript`对象中，虚拟`DOM` 表现为一个 `Object`对象。并且最少包含标签名 (`tag`)、属性 (`attrs`) 和子元素对象 (`children`) 三个属性，不同框架对这三个属性的名命可能会有差别

创建虚拟`DOM`就是为了更好将虚拟的节点渲染到页面视图中，所以虚拟`DOM`对象的节点与真实`DOM`的属性一一照应

在`vue`中同样使用到了虚拟`DOM`技术

定义真实`DOM`

```
<div id="app">
    <p class="p">节点内容</p>
    <h3>{{ foo }}</h3>
</div>
```

实例化`vue`

```
const app = new Vue({
    el:"#app",
    data:{
        foo:"foo"
    }
})
```

观察`render`的`render`，我们能得到虚拟`DOM`

```
(function anonymous() {
 with(this){return _c('div',{attrs:{"id":"app"}},[_c('p',{staticClass:"p"},
       [_v("节点内容")]),_v(" "),_c('h3',[_v(_s(foo))])])}})
```

通过`VNode`，`vue`可以对这颗抽象树进行创建节点,删除节点以及修改节点的操作， 经过`diff`算法得出一些需要修改的最小单位,再更新视图，减少了`dom`操作，提高了性能

## **二、为什么需要虚拟DOM**

`DOM`是很慢的，其元素非常庞大，页面的性能问题，大部分都是由`DOM`操作引起的

真实的

```
DOM
```

节点，哪怕一个最简单的

```
div
```

也包含着很多属性，可以打印出来直观感受一下：

https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibQwLUpw2ZXnTtxFdNPpseicQGBDtbnpvqtSrwuYib1IRvP861EfMuhToJC44gCdEOcDXnicpWVqQAhLw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

由此可见，操作`DOM`的代价仍旧是昂贵的，频繁操作还是会出现页面卡顿，影响用户的体验

**举个例子：**

你用传统的原生`api`或`jQuery`去操作`DOM`时，浏览器会从构建`DOM`树开始从头到尾执行一遍流程

当你在一次操作时，需要更新10个`DOM`节点，浏览器没这么智能，收到第一个更新`DOM`请求后，并不知道后续还有9次更新操作，因此会马上执行流程，最终执行10次流程

而通过`VNode`，同样更新10个`DOM`节点，虚拟`DOM`不会立即操作`DOM`，而是将这10次更新的`diff`内容保存到本地的一个`js`对象中，最终将这个`js`对象一次性`attach`到`DOM`树上，避免大量的无谓计算

> 很多人认为虚拟 DOM 最大的优势是 diff 算法，减少 JavaScript 操作真实 DOM 的带来的性能消耗。虽然这一个虚拟 DOM 带来的一个优势，但并不是全部。虚拟 DOM 最大的优势在于抽象了原本的渲染过程，实现了跨平台的能力，而不仅仅局限于浏览器的 DOM，可以是安卓和 IOS 的原生组件，可以是近期很火热的小程序，也可以是各种GUI

## **三、如何实现虚拟DOM**

首先可以看看`vue`中`VNode`的结构

源码位置：src/core/vdom/vnode.js

```
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  functionalContext: Component | void; // only for functional component root nodes
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions
  ) {
    /*当前节点的标签名*/
    this.tag = tag
    /*当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息*/
    this.data = data
    /*当前节点的子节点，是一个数组*/
    this.children = children
    /*当前节点的文本*/
    this.text = text
    /*当前虚拟节点对应的真实dom节点*/
    this.elm = elm
    /*当前节点的名字空间*/
    this.ns = undefined
    /*编译作用域*/
    this.context = context
    /*函数化组件作用域*/
    this.functionalContext = undefined
    /*节点的key属性，被当作节点的标志，用以优化*/
    this.key = data && data.key
    /*组件的option选项*/
    this.componentOptions = componentOptions
    /*当前节点对应的组件的实例*/
    this.componentInstance = undefined
    /*当前节点的父节点*/
    this.parent = undefined
    /*简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false*/
    this.raw = false
    /*静态节点标志*/
    this.isStatic = false
    /*是否作为跟节点插入*/
    this.isRootInsert = true
    /*是否为注释节点*/
    this.isComment = false
    /*是否为克隆节点*/
    this.isCloned = false
    /*是否有v-once指令*/
    this.isOnce = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next <https://github.com/answershuto/learnVue*/>
  get child (): Component | void {
    return this.componentInstance
  }
}
```

这里对`VNode`进行稍微的说明：

- 所有对象的 `context` 选项都指向了 `Vue` 实例
- `elm` 属性则指向了其相对应的真实 `DOM` 节点

```
vue`是通过`createElement`生成`VNode
```

源码位置：src/core/vdom/create-element.js

```
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}
```

上面可以看到`createElement` 方法实际上是对 `_createElement` 方法的封装，对参数的传入进行了判断

```
export function _createElement(
    context: Component,
    tag?: string | Class<Component> | Function | Object,
    data?: VNodeData,
    children?: any,
    normalizationType?: number
): VNode | Array<VNode> {
    if (isDef(data) && isDef((data: any).__ob__)) {
        process.env.NODE_ENV !== 'production' && warn(
            `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\\n` +
            'Always create fresh vnode data objects in each render!',
            context`
        )
        return createEmptyVNode()
    }
    // object syntax in v-bind
    if (isDef(data) && isDef(data.is)) {
        tag = data.is
    }
    if (!tag) {
        // in case of component :is set to falsy value
        return createEmptyVNode()
    }
    ... 
    // support single function children as default scoped slot
    if (Array.isArray(children) &&
        typeof children[0] === 'function'
    ) {
        data = data || {}
        data.scopedSlots = { default: children[0] }
        children.length = 0
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
        children = normalizeChildren(children)
    } else if ( === SIMPLE_NORMALIZE) {
        children = simpleNormalizeChildren(children)
    }
 // 创建VNode
    ...
}
```

可以看到`_createElement`接收5个参数：

- `context` 表示 `VNode` 的上下文环境，是 `Component` 类型
- tag 表示标签，它可以是一个字符串，也可以是一个 `Component`
- `data` 表示 `VNode` 的数据，它是一个 `VNodeData` 类型
- `children` 表示当前 `VNode`的子节点，它是任意类型的
- `normalizationType` 表示子节点规范的类型，类型不同规范的方法也就不一样，主要是参考 `render` 函数是编译生成的还是用户手写的

根据`normalizationType` 的类型，`children`会有不同的定义

```
if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
} else if ( === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
}
```

`simpleNormalizeChildren`方法调用场景是 `render` 函数是编译生成的

`normalizeChildren`方法调用场景分为下面两种：

- `render` 函数是用户手写的
- 编译 `slot`、`v-for` 的时候会产生嵌套数组

无论是`simpleNormalizeChildren`还是`normalizeChildren`都是对`children`进行规范（使`children` 变成了一个类型为 `VNode` 的 `Array`），这里就不展开说了

规范化`children`的源码位置在：src/core/vdom/helpers/normalzie-children.js

在规范化`children`后，就去创建`VNode`

```
let vnode, ns
// 对tag进行判断
if (typeof tag === 'string') {
  let Ctor
  ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
  if (config.isReservedTag(tag)) {
    // 如果是内置的节点，则直接创建一个普通VNode
    vnode = new VNode(
      config.parsePlatformTagName(tag), data, children,
      undefined, undefined, context
    )
  } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
    // component
    // 如果是component类型，则会通过createComponent创建VNode节点
    vnode = createComponent(Ctor, data, context, children, tag)
  } else {
    vnode = new VNode(
      tag, data, children,
      undefined, undefined, context
    )
  }
} else {
  // direct component options / constructor
  vnode = createComponent(tag, data, context, children)
}
createComponent`同样是创建`VNode
```

源码位置：src/core/vdom/create-component.js

```
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return
  }
 // 构建子类构造函数 
  const baseCtor = context.$options._base

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(`Invalid Component definition: ${String(Ctor)}`, context)
    }
    return
  }

  // async component
  let asyncFactory
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context)
    if (Ctor === undefined) {
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {}

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor)

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data)
  }

  // extract props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag)

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn

  if (isTrue(Ctor.options.abstract)) {
    const slot = data.slot
    data = {}
    if (slot) {
      data.slot = slot
    }
  }

  // 安装组件钩子函数，把钩子函数合并到data.hook中
  installComponentHooks(data)

  //实例化一个VNode返回。组件的VNode是没有children的
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )
  if (__WEEX__ && isRecyclableComponent(vnode)) {
    return renderRecyclableComponentTemplate(vnode)
  }

  return vnode
}
```

稍微提下`createComponent`生成`VNode`的三个关键流程：

- 构造子类构造函数`Ctor`
- `installComponentHooks`安装组件钩子函数
- 实例化 `vnode`





## **一、mixin是什么**

`Mixin`是面向对象程序设计语言中的类，提供了方法的实现。其他类可以访问`mixin`类的方法而不必成为其子类

`Mixin`类通常作为功能模块使用，在需要该功能时“混入”，有利于代码复用又避免了多继承的复杂

### **Vue中的mixin**

先来看一下官方定义

> mixin（混入），提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。

本质其实就是一个`js`对象，它可以包含我们组件中任意功能选项，如`data`、`components`、`methods`、`created`、`computed`等等

我们只要将共用的功能以对象的方式传入 `mixins`选项中，当组件使用 `mixins`对象时所有`mixins`对象的选项都将被混入该组件本身的选项中来

在`Vue`中我们可以**局部混入**跟**全局混入**

### **局部混入**

定义一个`mixin`对象，有组件`options`的`data`、`methods`属性

```jsx
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}
```

组件通过`mixins`属性调用`mixin`对象

```
Vue.component('componentA',{
  mixins: [myMixin]
})
```

该组件在使用的时候，混合了`mixin`里面的方法，在自动执行`create`生命钩子，执行`hello`方法

### **全局混入**

通过`Vue.mixin()`进行全局的混入

```jsx
Vue.mixin({
  created: function () {
      console.log("全局混入")
    }
})
```

使用全局混入需要特别注意，因为它会影响到每一个组件实例（包括第三方组件）

PS：全局混入常用于插件的编写

### **注意事项：**

当组件存在与`mixin`对象相同的选项的时候，进行递归合并的时候组件的选项会覆盖`mixin`的选项

但是如果相同选项为生命周期钩子的时候，会合并成一个数组，先执行`mixin`的钩子，再执行组件的钩子

## **二、使用场景**

在日常的开发中，我们经常会遇到在不同的组件中经常会需要用到一些相同或者相似的代码，这些代码的功能相对独立

这时，可以通过`Vue`的`mixin`功能将相同或者相似的代码提出来

举个例子

定义一个`modal`弹窗组件，内部通过`isShowing`来控制显示

```jsx
const Modal = {
  template: '#modal',
  data() {
    return {
      isShowing: false
    }
  },
  methods: {
    toggleShow() {
      this.isShowing = !this.isShowing;
    }
  }
}
```

定义一个`tooltip`提示框，内部通过`isShowing`来控制显示

```jsx
const Tooltip = {
  template: '#tooltip',
  data() {
    return {
      isShowing: false
    }
  },
  methods: {
    toggleShow() {
      this.isShowing = !this.isShowing;
    }
  }
}
```

通过观察上面两个组件，发现两者的逻辑是相同，代码控制显示也是相同的，这时候`mixin`就派上用场了

首先抽出共同代码，编写一个`mixin`

```jsx
const toggle = {
  data() {
    return {
      isShowing: false
    }
  },
  methods: {
    toggleShow() {
      this.isShowing = !this.isShowing;
    }
  }
}
```

两个组件在使用上，只需要引入`mixin`

```jsx
const Modal = {
  template: '#modal',
  mixins: [toggle]
};
 
const Tooltip = {
  template: '#tooltip',
  mixins: [toggle]
}
```

通过上面小小的例子，让我们知道了`Mixin`对于封装一些可复用的功能如此有趣、方便、实用

## **三、源码分析**

首先从`Vue.mixin`入手

源码位置：/src/core/global-api/mixin.js

```jsx
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```

主要是调用`merOptions`方法

源码位置：/src/core/util/options.js

```jsx
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object {

if (child.mixins) { // 判断有没有mixin 也就是mixin里面挂mixin的情况 有的话递归进行合并
    for (let i = 0, l = child.mixins.length; i < l; i++) {
    parent = mergeOptions(parent, child.mixins[i], vm)
    }
}

  const options = {} 
  let key
  for (key in parent) {
    mergeField(key) // 先遍历parent的key 调对应的strats[XXX]方法进行合并
  }
  for (key in child) {
    if (!hasOwn(parent, key)) { // 如果parent已经处理过某个key 就不处理了
      mergeField(key) // 处理child中的key 也就parent中没有处理过的key
    }
  }
  function mergeField (key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key) // 根据不同类型的options调用strats中不同的方法进行合并
  }
  return options
}
```

从上面的源码，我们得到以下几点：

- 优先递归处理 `mixins`
- 先遍历合并`parent` 中的`key`，调用`mergeField`方法进行合并，然后保存在变量`options`
- 再遍历 `child`，合并补上 `parent` 中没有的`key`，调用`mergeField`方法进行合并，保存在变量`options`
- 通过 `mergeField` 函数进行了合并

下面是关于`Vue`的几种类型的合并策略

- 替换型
- 合并型
- 队列型
- 叠加型

### **替换型**

替换型合并有`props`、`methods`、`inject`、`computed`

```jsx
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  if (!parentVal) return childVal // 如果parentVal没有值，直接返回childVal
  const ret = Object.create(null) // 创建一个第三方对象 ret
  extend(ret, parentVal) // extend方法实际是把parentVal的属性复制到ret中
  if (childVal) extend(ret, childVal) // 把childVal的属性复制到ret中
  return ret
}
strats.provide = mergeDataOrFn
```

同名的`props`、`methods`、`inject`、`computed`会被后来者代替

### **合并型**

和并型合并有：`data`

```jsx
strats.data = function(parentVal, childVal, vm) {    
    return mergeDataOrFn(
        parentVal, childVal, vm
    )
};

function mergeDataOrFn(parentVal, childVal, vm) {    
    return function mergedInstanceDataFn() {        
        var childData = childVal.call(vm, vm) // 执行data挂的函数得到对象
        var parentData = parentVal.call(vm, vm)        
        if (childData) {            
            return mergeData(childData, parentData) // 将2个对象进行合并                                 
        } else {            
            return parentData // 如果没有childData 直接返回parentData
        }
    }
}

function mergeData(to, from) {    
    if (!from) return to    
    var key, toVal, fromVal;    
    var keys = Object.keys(from);   
    for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        toVal = to[key];
        fromVal = from[key];    
        // 如果不存在这个属性，就重新设置
        if (!to.hasOwnProperty(key)) {
            set(to, key, fromVal);
        }      
        // 存在相同属性，合并对象
        else if (typeof toVal =="object" && typeof fromVal =="object") {
            mergeData(toVal, fromVal);
        }
    }    
    return to
}
```

`mergeData`函数遍历了要合并的 data 的所有属性，然后根据不同情况进行合并：

- 当目标 data 对象不包含当前属性时，调用 `set` 方法进行合并（set方法其实就是一些合并重新赋值的方法）
- 当目标 data 对象包含当前属性并且当前值为纯对象时，递归合并当前对象值，这样做是为了防止对象存在新增属性

### **队列型**

队列型合并有：全部生命周期和`watch`

```jsx
function mergeHook (
  parentVal: ?Array<Function>,
  childVal: ?Function | ?Array<Function>
): ?Array<Function> {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

// watch
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};
```

生命周期钩子和`watch`被合并为一个数组，然后正序遍历一次执行

### **叠加型**

叠加型合并有：`component`、`directives`、`filters`

```jsx
strats.components=
strats.directives=

strats.filters = function mergeAssets(
    parentVal, childVal, vm, key
) {    
    var res = Object.create(parentVal || null);    
    if (childVal) { 
        for (var key in childVal) {
            res[key] = childVal[key];
        }   
    } 
    return res
}
```

叠加型主要是通过原型链进行层层的叠加

### **小结：**

- 替换型策略有`props`、`methods`、`inject`、`computed`，就是将新的同名参数替代旧的参数
- 合并型策略是`data`, 通过`set`方法进行合并和重新赋值
- 队列型策略有生命周期函数和`watch`，原理是将函数存入一个数组，然后正序遍历依次执行
- 叠加型有`component`、`directives`、`filters`，通过原型链进行层层的叠加





## **一、Keep-alive 是什么**

```
keep-alive`是`vue`中的内置组件，能在组件切换过程中将状态保留在内存中，防止重复渲染`DOM
```

`keep-alive` 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们

`keep-alive`可以设置以下`props`属性：

- `include` - 字符串或正则表达式。只有名称匹配的组件会被缓存
- `exclude` - 字符串或正则表达式。任何名称匹配的组件都不会被缓存
- `max` - 数字。最多可以缓存多少组件实例

关于`keep-alive`的基本用法：

```
<keep-alive>
  <component :is="view"></component>
</keep-alive>
```

使用`includes`和`exclude`：

```
<keep-alive include="a,b">
  <component :is="view"></component>
</keep-alive>

<!-- 正则表达式 (使用 `v-bind`) -->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>

<!-- 数组 (使用 `v-bind`) -->
<keep-alive :include="['a', 'b']">
  <component :is="view"></component>
</keep-alive>
```

匹配首先检查组件自身的 `name` 选项，如果 `name` 选项不可用，则匹配它的局部注册名称 (父组件 `components` 选项的键值)，匿名组件不能被匹配

设置了 keep-alive 缓存的组件，会多出两个生命周期钩子（`activated`与`deactivated`）：

- 首次进入组件时：`beforeRouteEnter` > `beforeCreate` > `created`> `mounted` > `activated` > ... ... > `beforeRouteLeave` > `deactivated`
- 再次进入组件时：`beforeRouteEnter` >`activated` > ... ... > `beforeRouteLeave` > `deactivated`

## **二、使用场景**

使用原则：当我们在某些场景下不需要让页面重新加载时我们可以使用`keepalive`

举个栗子:

当我们从`首页`–>`列表页`–>`商详页`–>`再返回`，这时候列表页应该是需要`keep-alive`

从`首页`–>`列表页`–>`商详页`–>`返回到列表页(需要缓存)`–>`返回到首页(需要缓存)`–>`再次进入列表页(不需要缓存)`，这时候可以按需来控制页面的`keep-alive`

在路由中设置`keepAlive`属性判断是否需要缓存

```
{
  path: 'list',
  name: 'itemList', // 列表页
  component (resolve) {
    require(['@/pages/item/list'], resolve)
 },
 meta: {
  keepAlive: true,
  title: '列表页'
 }
}
```

使用`<keep-alive>`

```
<div id="app" class='wrapper'>
    <keep-alive>
        <!-- 需要缓存的视图组件 --> 
        <router-view v-if="$route.meta.keepAlive"></router-view>
     </keep-alive>
      <!-- 不需要缓存的视图组件 -->
     <router-view v-if="!$route.meta.keepAlive"></router-view>
</div>
```

## **三、原理分析**

`keep-alive`是`vue`中内置的一个组件

源码位置：src/core/components/keep-alive.js

```
export default {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },

  created () {
    this.cache = Object.create(null)
    this.keys = []
  },

  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  render() {
    /* 获取默认插槽中的第一个组件节点 */
    const slot = this.$slots.default
    const vnode = getFirstComponentChild(slot)
    /* 获取该组件节点的componentOptions */
    const componentOptions = vnode && vnode.componentOptions

    if (componentOptions) {
      /* 获取该组件节点的名称，优先获取组件的name字段，如果name不存在则获取组件的tag */
      const name = getComponentName(componentOptions)

      const { include, exclude } = this
      /* 如果name不在inlcude中或者存在于exlude中则表示不缓存，直接返回vnode */
      if (
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      /* 获取组件的key值 */
      const key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
     /*  拿到key值后去this.cache对象中去寻找是否有该值，如果有则表示该组件有缓存，即命中缓存 */
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      }
        /* 如果没有命中缓存，则将其设置进缓存 */
        else {
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        /* 如果配置了max并且缓存的长度超过了this.max，则从缓存中删除第一个 */
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
```

可以看到该组件没有`template`，而是用了`render`，在组件渲染的时候会自动执行`render`函数

`this.cache`是一个对象，用来存储需要缓存的组件，它将以如下形式存储：

```
this.cache = {
    'key1':'组件1',
    'key2':'组件2',
    // ...
}
```

在组件销毁的时候执行`pruneCacheEntry`函数

```
function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  /* 判断当前没有处于被渲染状态的组件，将其销毁*/
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}
```

在`mounted`钩子函数中观测 `include` 和 `exclude` 的变化，如下：

```
mounted () {
    this.$watch('include', val => {
        pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
        pruneCache(this, name => !matches(val, name))
    })
}
```

如果`include` 或`exclude` 发生了变化，即表示定义需要缓存的组件的规则或者不需要缓存的组件的规则发生了变化，那么就执行`pruneCache`函数，函数如下：

```
function pruneCache (keepAliveInstance, filter) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode = cache[key]
    if (cachedNode) {
      const name = getComponentName(cachedNode.componentOptions)
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}
```

在该函数内对`this.cache`对象进行遍历，取出每一项的`name`值，用其与新的缓存规则进行匹配，如果匹配不上，则表示在新的缓存规则下该组件已经不需要被缓存，则调用`pruneCacheEntry`函数将其从`this.cache`对象剔除即可

关于`keep-alive`的最强大缓存功能是在`render`函数中实现

首先获取组件的`key`值：

```
const key = vnode.key == null? 
componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
: vnode.key
```

拿到`key`值后去`this.cache`对象中去寻找是否有该值，如果有则表示该组件有缓存，即命中缓存，如下：

```
/* 如果命中缓存，则直接从缓存中拿 vnode 的组件实例 */
if (cache[key]) {
    vnode.componentInstance = cache[key].componentInstance
    /* 调整该组件key的顺序，将其从原来的地方删掉并重新放在最后一个 */
    remove(keys, key)
    keys.push(key)
} 
```

直接从缓存中拿 `vnode` 的组件实例，此时重新调整该组件`key`的顺序，将其从原来的地方删掉并重新放在`this.keys`中最后一个

`this.cache`对象中没有该`key`值的情况，如下：

```
/* 如果没有命中缓存，则将其设置进缓存 */
else {
    cache[key] = vnode
    keys.push(key)
    /* 如果配置了max并且缓存的长度超过了this.max，则从缓存中删除第一个 */
    if (this.max && keys.length > parseInt(this.max)) {
        pruneCacheEntry(cache, keys[0], keys, this._vnode)
    }
}
```

表明该组件还没有被缓存过，则以该组件的`key`为键，组件`vnode`为值，将其存入`this.cache`中，并且把`key`存入`this.keys`中

此时再判断`this.keys`中缓存组件的数量是否超过了设置的最大缓存数量值`this.max`，如果超过了，则把第一个缓存组件删掉

## **四、思考题：缓存后如何获取数据**

解决方案可以有以下两种：

- beforeRouteEnter
- actived

### **beforeRouteEnter**

每次组件渲染的时候，都会执行`beforeRouteEnter`

```
beforeRouteEnter(to, from, next){
    next(vm=>{
        console.log(vm)
        // 每次进入路由执行
        vm.getData()  // 获取数据
    })
},
```

### **actived**

在`keep-alive`缓存的组件被激活的时候，都会执行`actived`钩子

```
activated(){
   this.getData() // 获取数据
},
```

注意：服务器端渲染期间`avtived`不被调用





## **一、生命周期是什么**

生命周期`（Life Cycle）`的概念应用很广泛，特别是在政治、经济、环境、技术、社会等诸多领域经常出现，其基本涵义可以通俗地理解为“从摇篮到坟墓”`（Cradle-to-Grave）`的整个过程

在`Vue`中实例从创建到销毁的过程就是生命周期，即指从创建、初始化数据、编译模板、挂载Dom→渲染、更新→渲染、卸载等一系列过程

我们可以把组件比喻成工厂里面的一条流水线，每个工人（生命周期）站在各自的岗位，当任务流转到工人身边的时候，工人就开始工作

PS：在`Vue`生命周期钩子会自动绑定 `this` 上下文到实例中，因此你可以访问数据，对 `property` 和方法进行运算

这意味着**你不能使用箭头函数来定义一个生命周期方法** (例如 `created: () => this.fetchTodos()`)

## **二、生命周期有哪些**

Vue生命周期总共可以分为8个阶段：创建前后, 载入前后,更新前后,销毁前销毁后，以及一些特殊场景的生命周期

[Untitled](https://www.notion.so/0a673ea5a58549bbbc95cb4392b66c45)

## **三、生命周期整体流程**

`Vue`生命周期流程图

https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibRnRqr8gjUD4SdU5E0icPJe7SyfqO4YWhaqxTW91ibDialILLAsFGvLaNAo6gTqnqzOP2Bia9YDIaKLCg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

### **具体分析**

**beforeCreate -> created**

- 初始化`vue`实例，进行数据观测

**created**

- 完成数据观测，属性与方法的运算，`watch`、`event`事件回调的配置
- 可调用`methods`中的方法，访问和修改data数据触发响应式渲染`dom`，可通过`computed`和`watch`完成数据计算
- 此时`vm.$el` 并没有被创建

**created -> beforeMount**

- 判断是否存在`el`选项，若不存在则停止编译，直到调用`vm.$mount(el)`才会继续编译
- 优先级：`render` > `template` > `outerHTML`
- `vm.el`获取到的是挂载`DOM`的

**beforeMount**

- 在此阶段可获取到`vm.el`
- 此阶段`vm.el`虽已完成DOM初始化，但并未挂载在`el`选项上

**beforeMount -> mounted**

- 此阶段`vm.el`完成挂载，`vm.$el`生成的`DOM`替换了`el`选项所对应的`DOM`

**mounted**

- `vm.el`已完成`DOM`的挂载与渲染，此刻打印`vm.$el`，发现之前的挂载点及内容已被替换成新的DOM

**beforeUpdate**

- 更新的数据必须是被渲染在模板上的（`el`、`template`、`rende`r之一）
- 此时`view`层还未更新
- 若在`beforeUpdate`中再次修改数据，不会再次触发更新方法

**updated**

- 完成`view`层的更新
- 若在`updated`中再次修改数据，会再次触发更新方法（`beforeUpdate`、`updated`）

**beforeDestroy**

- 实例被销毁前调用，此时实例属性与方法仍可访问

**destroyed**

- 完全销毁一个实例。可清理它与其它实例的连接，解绑它的全部指令及事件监听器
- 并不能清除DOM，仅仅销毁实例

**使用场景分析**

[Untitled](https://www.notion.so/53da87ca090d46b78354a69d4cb22970)

## **四、题外话：数据请求在created和mouted的区别**

`created`是在组件实例一旦创建完成的时候立刻调用，这时候页面`dom`节点并未生成

`mounted`是在页面`dom`节点渲染完毕之后就立刻执行的

触发时机上`created`是比`mounted`要更早的

两者相同点：都能拿到实例对象的属性和方法

讨论这个问题本质就是触发的时机，放在`mounted`请求有可能导致页面闪动（页面`dom`结构已经生成），但如果在页面加载前完成则不会出现此情况

建议：放在`create`生命周期当中





## **一、v-show与v-if的共同点**

我们都知道在 `vue` 中 `v-show` 与 `v-if` 的作用效果是相同的(不含v-else)，都能控制元素在页面是否显示

在用法上也是相同的

```
<Model v-show="isShow" />
<Model v-if="isShow" />
```

- 当表达式为`true`的时候，都会占据页面的位置
- 当表达式都为`false`时，都不会占据页面位置

## **二、v-show与v-if的区别**

- 控制手段不同
- 编译过程不同
- 编译条件不同
- 性能消耗不同

控制手段：`v-show`隐藏则是为该元素添加`css--display:none`，`dom`元素依旧还在。`v-if`显示隐藏是将`dom`元素整个添加或删除

编译过程：`v-if`切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件；`v-show`只是简单的基于css切换

编译条件：`v-if`是真正的条件渲染，它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。只有渲染条件为假时，并不做操作，直到为真才渲染

- `v-show` 由`false`变为`true`的时候不会触发组件的生命周期
- `v-if`由`false`变为`true`的时候，触发组件的`beforeCreate`、`create`、`beforeMount`、`mounted`钩子，由`true`变为`false`的时候触发组件的`beforeDestroy`、`destroyed`方法

性能消耗：`v-if`有更高的切换消耗；`v-show`有更高的初始渲染消耗

## **三、v-show与v-if原理分析**

具体解析流程这里不展开讲，大致流程如下

- 将模板`template`转为`ast`结构的`JS`对象
- 用`ast`得到的`JS`对象拼装`render`和`staticRenderFns`函数
- `render`和`staticRenderFns`函数被调用后生成虚拟`VNODE`节点，该节点包含创建`DOM`节点所需信息
- `vm.patch`函数通过虚拟`DOM`算法利用`VNODE`节点创建真实`DOM`节点

### **v-show原理**

不管初始条件是什么，元素总是会被渲染

我们看一下在`vue`中是如何实现的

代码很好理解，有`transition`就执行`transition`，没有就直接设置`display`属性

```
// <https://github.com/vuejs/vue-next/blob/3cd30c5245da0733f9eb6f29d220f39c46518162/packages/runtime-dom/src/directives/vShow.ts>
export const vShow: ObjectDirective<VShowElement> = {
  beforeMount(el, { value }, { transition }) {
    el._vod = el.style.display === 'none' ? '' : el.style.display
    if (transition && value) {
      transition.beforeEnter(el)
    } else {
      setDisplay(el, value)
    }
  },
  mounted(el, { value }, { transition }) {
    if (transition && value) {
      transition.enter(el)
    }
  },
  updated(el, { value, oldValue }, { transition }) {
    // ...
  },
  beforeUnmount(el, { value }) {
    setDisplay(el, value)
  }
}
```

### **v-if原理**

`v-if`在实现上比`v-show`要复杂的多，因为还有`else` `else-if` 等条件需要处理，这里我们也只摘抄源码中处理 `v-if` 的一小部分

返回一个`node`节点，`render`函数通过表达式的值来决定是否生成`DOM`

```
// <https://github.com/vuejs/vue-next/blob/cdc9f336fd/packages/compiler-core/src/transforms/vIf.ts>
export const transformIf = createStructuralDirectiveTransform(
  /^(if|else|else-if)$/,
  (node, dir, context) => {
    return processIf(node, dir, context, (ifNode, branch, isRoot) => {
      // ...
      return () => {
        if (isRoot) {
          ifNode.codegenNode = createCodegenNodeForBranch(
            branch,
            key,
            context
          ) as IfConditionalExpression
        } else {
          // attach this branch's codegen node to the v-if root.
          const parentCondition = getParentCondition(ifNode.codegenNode!)
          parentCondition.alternate = createCodegenNodeForBranch(
            branch,
            key + ifNode.branches.length - 1,
            context
          )
        }
      }
    })
  }
)
```

## **四、v-show与v-if的使用场景**

`v-if` 与 `v-show` 都能控制`dom`元素在页面的显示

`v-if` 相比 `v-show` 开销更大（直接操作`dom`节点增加与删除）

如果需要非常频繁地切换，则使用 v-show 较好

如果在运行时条件很少改变，则使用 v-if 较好

## **一、作用**

`v-if` 指令用于条件性地渲染一块内容。这块内容只会在指令的表达式返回 `true`值的时候被渲染

`v-for` 指令基于一个数组来渲染一个列表。`v-for` 指令需要使用 `item in items` 形式的特殊语法，其中 `items` 是源数据数组或者对象，而 `item` 则是被迭代的数组元素的别名

在 `v-for` 的时候，建议设置`key`值，并且保证每个`key`值是独一无二的，这便于`diff`算法进行优化

两者在用法上

```
<Modal v-if="isShow" />

<li v-for="item in items" :key="item.id">
    {{ item.label }}
</li>
```

## **二、优先级**

`v-if`与`v-for`都是`vue`模板系统中的指令

在`vue`模板编译的时候，会将指令系统转化成可执行的`render`函数

### **示例**

编写一个`p`标签，同时使用`v-if`与 `v-for`

```html
<div id="app">
    <p v-if="isShow" v-for="item in items">
        {{ item.title }}
    </p>
</div>
```

创建`vue`实例，存放`isShow`与`items`数据

```jsx
const app = new Vue({
  el: "#app",
  data() {
    return {
      items: [
        { title: "foo" },
        { title: "baz" }]
    }
  },
  computed: {
    isShow() {
      return this.items && this.items.length > 0
    }
  }
})
```

模板指令的代码都会生成在`render`函数中，通过`app.$options.render`就能得到渲染函数

```jsx
ƒ anonymous() {
  with (this) { return 
    _c('div', { attrs: { "id": "app" } }, 
    _l((items), function (item) 
    { return (isShow) ? _c('p', [_v("\\n" + _s(item.title) + "\\n")]) : _e() }), 0) }
}
```

`_l`是`vue`的列表渲染函数，函数内部都会进行一次`if`判断

初步得到结论：`v-for`优先级是比`v-if`高

再将`v-for`与`v-if`置于不同标签

```html
<div id="app">
    <template v-if="isShow">
        <p v-for="item in items">{{item.title}}</p>
    </template>
</div>
```

再输出下`render`函数

```jsx
ƒ anonymous() {
  with(this){return 
    _c('div',{attrs:{"id":"app"}},
    [(isShow)?[_v("\\n"),
    _l((items),function(item){return _c('p',[_v(_s(item.title))])})]:_e()],2)}
}
```

这时候我们可以看到，`v-for`与`v-if`作用在不同标签时候，是先进行判断，再进行列表的渲染

我们再在查看下`vue`源码

源码位置：`\\vue-dev\\src\\compiler\\codegen\\index.js`

```jsx
export function genElement (el: ASTElement, state: CodegenState): string {
  if (el.parent) {
    el.pre = el.pre || el.parent.pre
  }
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    ...
}
```

在进行`if`判断的时候，`v-for`是比`v-if`先进行判断

最终结论：`v-for`优先级比`v-if`高

## **三、注意事项**

1. 永远不要把 `v-if` 和 `v-for` 同时用在同一个元素上，带来性能方面的浪费（每次渲染都会先循环再进行条件判断）
2. 如果避免出现这种情况，则在外层嵌套`template`（页面渲染不生成`dom`节点），在这一层进行v-if判断，然后在内部进行v-for循环

```html
<template v-if="isShow">
    <p v-for="item in items">
</template>
```

1. 如果条件出现在循环内部，可通过计算属性`computed`提前过滤掉那些不需要显示的项

```jsx
computed: {
    items: function() {
      return this.list.filter(function (item) {
        return item.isShow
      })
    }
}
```





## **一、什么是双向绑定**

我们先从单向绑定切入

单向绑定非常简单，就是把`Model`绑定到`View`，当我们用`JavaScript`代码更新`Model`时，`View`就会自动更新

双向绑定就很容易联想到了，在单向绑定的基础上，用户更新了`View`，`Model`的数据也自动被更新了，这种情况就是双向绑定

举个栗子

https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibQ6eqsjtXsXNnchJHic19t8Wiaaaajxy4DGGbnSfRkM9SRXDlib5do8m5H4V2ibM9TeTqjPXdb0ydhJjQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

当用户填写表单时，`View`的状态就被更新了，如果此时可以自动更新`Model`的状态，那就相当于我们把`Model`和`View`做了双向绑定

关系图如下

https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibQ6eqsjtXsXNnchJHic19t8WXZRK9oLoPiaeIicH4Uw6MQGQrGia1529X555Ub3f69dRsgNZjg3pv7MlA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

## **二、双向绑定的原理是什么**

我们都知道 `Vue` 是数据双向绑定的框架，双向绑定由三个重要部分构成

- 数据层（Model）：应用的数据及业务逻辑
- 视图层（View）：应用的展示效果，各类UI组件
- 业务逻辑层（ViewModel）：框架封装的核心，它负责将数据与视图关联起来

而上面的这个分层的架构方案，可以用一个专业术语进行称呼：`MVVM`

这里的控制层的核心功能便是 “数据双向绑定” 。自然，我们只需弄懂它是什么，便可以进一步了解数据绑定的原理

### **理解ViewModel**

它的主要职责就是：

- 数据变化后更新视图
- 视图变化后更新数据

当然，它还有两个主要部分组成

- 监听器（Observer）：对所有数据的属性进行监听
- 解析器（Compiler）：对每个元素节点的指令进行扫描跟解析,根据指令模板替换数据,以及绑定相应的更新函数

### **三、实现双向绑定**

我们还是以`Vue`为例，先来看看`Vue`中的双向绑定流程是什么的

1. `new Vue()`首先执行初始化，对`data`执行响应化处理，这个过程发生`Observe`中
2. 同时对模板执行编译，找到其中动态绑定的数据，从`data`中获取并初始化视图，这个过程发生在`Compile`中
3. 同时定义⼀个更新函数和`Watcher`，将来对应数据变化时`Watcher`会调用更新函数
4. 由于`data`的某个`key`在⼀个视图中可能出现多次，所以每个`key`都需要⼀个管家`Dep`来管理多个`Watcher`
5. 将来data中数据⼀旦发生变化，会首先找到对应的`Dep`，通知所有`Watcher`执行更新函数

流程图如下：

https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibQ6eqsjtXsXNnchJHic19t8WatmicdwRcGWXlEWEZBOh9HqQTuM60K70d8J2FuPdJeGDPmqDFWFgp4w/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

### **实现**

先来一个构造函数：执行初始化，对`data`执行响应化处理

```
class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
      
    // 对data选项做响应式处理
    observe(this.$data);
      
    // 代理data到vm上
    proxy(this);
      
    // 执行编译
    new Compile(options.el, this);
  }
}
```

对`data`选项执行响应化具体操作

```
function observe(obj) {
  if (typeof obj !== "object" || obj == null) {
    return;
  }
  new Observer(obj);
}

class Observer {
  constructor(value) {
    this.value = value;
    this.walk(value);
  }
  walk(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key]);
    });
  }
}
```

### **编译`Compile`**

对每个元素节点的指令进行扫描跟解析,根据指令模板替换数据,以及绑定相应的更新函数

https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibQ6eqsjtXsXNnchJHic19t8WlRxq6IlsvZTNQTj7AJ7p6YYns3DtPp0KMvhKic2rs8GI4LGzWcGfMQA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

```
class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);  // 获取dom
    if (this.$el) {
      this.compile(this.$el);
    }
  }
  compile(el) {
    const childNodes = el.childNodes; 
    Array.from(childNodes).forEach((node) => { // 遍历子元素
      if (this.isElement(node)) {   // 判断是否为节点
        console.log("编译元素" + node.nodeName);
      } else if (this.isInterpolation(node)) {
        console.log("编译插值⽂本" + node.textContent);  // 判断是否为插值文本 {{}}
      }
      if (node.childNodes && node.childNodes.length > 0) {  // 判断是否有子元素
        this.compile(node);  // 对子元素进行递归遍历
      }
    });
  }
  isElement(node) {
    return node.nodeType == 1;
  }
  isInterpolation(node) {
    return node.nodeType == 3 && /\\{\\{(.*)\\}\\}/.test(node.textContent);
  }
}
```

### **依赖收集**

视图中会用到`data`中某`key`，这称为依赖。同⼀个`key`可能出现多次，每次都需要收集出来用⼀个`Watcher`来维护它们，此过程称为依赖收集

多个`Watcher`需要⼀个`Dep`来管理，需要更新时由`Dep`统⼀通知

https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibQ6eqsjtXsXNnchJHic19t8WzHR48eb8FBy7NcHsYmZoQyl8zMq1MvgMiaCWsfib5D33icyFkbeDwOdKA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

实现思路

1. `defineReactive`时为每⼀个`key`创建⼀个`Dep`实例
2. 初始化视图时读取某个`key`，例如`name1`，创建⼀个`watcher1`
3. 由于触发`name1`的`getter`方法，便将`watcher1`添加到`name1`对应的Dep中
4. 当`name1`更新，`setter`触发时，便可通过对应`Dep`通知其管理所有`Watcher`更新

```
// 负责更新视图
class Watcher {
  constructor(vm, key, updater) {
    this.vm = vm
    this.key = key
    this.updaterFn = updater

    // 创建实例时，把当前实例指定到Dep.target静态属性上
    Dep.target = this
    // 读一下key，触发get
    vm[key]
    // 置空
    Dep.target = null
  }

  // 未来执行dom更新函数，由dep调用的
  update() {
    this.updaterFn.call(this.vm, this.vm[this.key])
  }
}
```

声明`Dep`

```
class Dep {
  constructor() {
    this.deps = [];  // 依赖管理
  }
  addDep(dep) {
    this.deps.push(dep);
  }
  notify() { 
    this.deps.forEach((dep) => dep.update());
  }
}
```

创建`watcher`时触发`getter`

```
class Watcher {
  constructor(vm, key, updateFn) {
    Dep.target = this;
    this.vm[this.key];
    Dep.target = null;
  }
}
```

依赖收集，创建`Dep`实例

```
function defineReactive(obj, key, val) {
  this.observe(val);
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      Dep.target && dep.addDep(Dep.target);// Dep.target也就是Watcher实例
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      dep.notify(); // 通知dep执行更新方法
    },
  });
}
```



## 一、深挖Watch、Computed

这篇文章将带大家全面理解`vue`的`watcher`、`computed`和`user watcher`，其实`computed`和`user watcher`都是基于`Watcher`来实现的，我们通过一个一个功能点去敲代码，让大家全面理解其中的实现原理和核心思想。所以这篇文章将实现以下这些功能点：

- 实现数据响应式
- 基于渲染`wather`实现首次数据渲染到界面上
- 数据依赖收集和更新
- 实现数据更新触发渲染`watcher`执行，从而更新ui界面
- 基于`watcher`实现`computed`
- 基于`watcher`实现`user watcher`

废话不要多说，先看下面的最终例子。

https://mmbiz.qpic.cn/mmbiz_gif/1NOXMW586uuT9gETTZ8EcwWvSW3aeTkic28BnWOUibT7aCL5T90XBicx0S7vMXlyHo4FjvoQV94fI9XQg6pnEJxlA/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1

例子看完之后我们就直接开工了。

## **准备工作**

首先我们准备了一个`index.html`文件和一个`vue.js`文件，先看看`index.html`的代码

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>全面理解vue的渲染watcher、computed和user atcher</title>
</head>
<body>
  <div id="root"></div>
  <script src="./vue.js"></script>
  <script>
    const root = document.querySelector('#root')
    var vue = new Vue({
      data() {
        return {
          name: '张三',
          age: 10
        }
      },
      render() {
        root.innerHTML = `${this.name}----${this.age}`
      }
    })
  </script>
</body>
</html>
```

`index.html`里面分别有一个id是root的div节点，这是跟节点，然后在script标签里面，引入了`vue.js`，里面提供了Vue构造函数，然后就是实例化Vue，参数是一个对象，对象里面分别有data 和 render 函数。然后我们看看`vue.js`的代码：

```
function Vue (options) {
  this._init(options) // 初始化
  this.$mount() // 执行render函数
}
Vue.prototype._init = function (options) {
  const vm = this
  vm.$options = options // 把options挂载到this上
  if (options.data) {
    initState(vm) // 数据响应式
  }
  if (options.computed) {
    initComputed(vm) // 初始化计算属性
  }
  if (options.watch) {
    initWatch(vm) // 初始化watch
  }
}
```

`vue.js`代码里面就是执行`this._init()`和`this.$mount()`，`this._init`的方法就是对我们的传进来的配置进行各种初始化，包括数据初始化`initState(vm)`、计算属性初始化`initComputed(vm)`、自定义watch初始化`initWatch(vm)`。`this.$mount`方法把`render`函数渲染到页面中去、这些方法我们后面都写到，先让让大家了解整个代码结构。下面我们正式去填满我们上面写的这些方法。

## **实现数据响应式**

要实现这些`watcher`首先去实现数据响应式，也就是要实现上面的`initState(vm)`这个函数。相信大家都很熟悉响应式这些代码，下面我直接贴上来。

```
function initState(vm) {
  let data = vm.$options.data; // 拿到配置的data属性值
  // 判断data 是函数还是别的类型
  data = vm._data = typeof data === 'function' ? data.call(vm, vm) : data || {};
  const keys = Object.keys(data);
  let i = keys.length;
  while(i--) {
    // 从this上读取的数据全部拦截到this._data到里面读取
    // 例如 this.name 等同于  this._data.name
    proxy(vm, '_data', keys[i]);
  }
  observe(data); // 数据观察
}

// 数据观察函数
function observe(data) {
  if (typeof data !== 'object' && data != null) {
    return;
  }
  return new Observer(data)
}

// 从this上读取的数据全部拦截到this._data到里面读取
// 例如 this.name 等同于  this._data.name
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key] // this.name 等同于  this._data.name
    },
    set(newValue) {
      return vm[source][key] = newValue
    }
  })
}

class Observer{
  constructor(value) {
    this.walk(value) // 给每一个属性都设置get set
  }
  walk(data) {
    let keys = Object.keys(data);
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      let value = data[key]
      defineReactive(data, key, value) // 给对象设置get set
    }
  }
}

function defineReactive(data, key, value) {
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      if (newValue == value) return
      observe(newValue) // 给新的值设置响应式
      value = newValue
    }
  })
  observe(value); // 递归给数据设置get set
}
```

重要的点都在注释里面，主要核心就是给递归给`data`里面的数据设置`get`和`set`，然后设置数据代理，让 `this.name` 等同于 `this._data.name`。设置完数据观察，我们就可以看到如下图的数据了。

https://mmbiz.qpic.cn/mmbiz_png/1NOXMW586uuT9gETTZ8EcwWvSW3aeTkicqQeobT5rRezcK9U21ricksxYQQ8Z91hFukLEEXicG7LXn4lSHASH00Rw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

```
console.log(vue.name) // 张三
console.log(vue.age) // 10
```

> ps: 数组的数据观察大家自行去完善哈，这里重点讲的是watcher的实现。

## **首次渲染**

数据观察搞定了之后，我们就可以把`render`函数渲染到我们的界面上了。在`Vue`里面我们有一个`this.$mount()`函数，所以要实现`Vue.prototype.$mount`函数：

```
// 挂载方法
Vue.prototype.$mount = function () {
  const vm = this
  new Watcher(vm, vm.$options.render, () => {}, true)
}
```

以上的代码终于牵扯到我们`Watcher`这个主角了，这里其实就是我们的渲染`wather`，这里的目的是通过`Watcher`来实现执行`render`函数，从而把数据插入到root节点里面去。下面看最简单的Watcher实现

```
let wid = 0
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm // 把vm挂载到当前的this上
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn // 把exprOrFn挂载到当前的this上，这里exprOrFn 等于 vm.$options.render
    }
    this.cb = cb // 把cb挂载到当前的this上
    this.options = options // 把options挂载到当前的this上
    this.id = wid++
    this.value = this.get() // 相当于运行 vm.$options.render()
  }
  get() {
    const vm = this.vm
    let value = this.getter.call(vm, vm) // 把this 指向到vm
    return value
  }
}
```

通过上面的一顿操作，终于在`render`中终于可以通过`this.name` 读取到`data`的数据了，也可以插入到`root.innerHTML`中去。阶段性的工作我们完成了。如下图，完成的首次渲染✌️

https://mmbiz.qpic.cn/mmbiz_png/1NOXMW586uuT9gETTZ8EcwWvSW3aeTkic2JwmpXliaLLKMds15ny8Pa0ciaLxp7B745ySDHGLajZX64icdFxa0PVVw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

## **数据依赖收集和更新**

首先数据收集，我们要有一个收集的地方，就是我们的`Dep`类，下面呢看看我们去怎么实现这个`Dep`。

```
// 依赖收集
let dId = 0
class Dep{
  constructor() {
    this.id = dId++ // 每次实例化都生成一个id
    this.subs = [] // 让这个dep实例收集watcher
  }
  depend() {
    // Dep.target 就是当前的watcher
    if (Dep.target) {
      Dep.target.addDep(this) // 让watcher,去存放dep，然后里面dep存放对应的watcher，两个是多对多的关系
    }
  }
  notify() {
    // 触发更新
    this.subs.forEach(watcher => watcher.update())
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
}

let stack = []
// push当前watcher到stack 中，并记录当前watcer
function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
}
// 运行完之后清空当前的watcher
function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}
```

`Dep`收集的类是实现了，但是我们怎么去收集了，就是我们数据观察的`get`里面实例化`Dep`然后让`Dep`收集当前的`watcher`。下面我们一步步来：

- 1、在上面`this.$mount()`的代码中，我们运行了`new Watcher(vm, vm.$options.render, () => {}, true)`，这时候我们就可以在`Watcher`里面执行`this.get()`，然后执行`pushTarget(this)`，就可以执行这句话`Dep.target = watcher`，把当前的`watcher`挂载`Dep.target`上。下面看看我们怎么实现。

```
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }
    this.cb = cb
    this.options = options
    this.id = wid++
    this.id = wId++
+    this.deps = []
+    this.depsId = new Set() // dep 已经收集过相同的watcher 就不要重复收集了
    this.value = this.get()
  }
  get() {
    const vm = this.vm
+   pushTarget(this)
    let value = this.getter.call(vm, vm) // 执行函数
+   popTarget()
    return value
  }
+  addDep(dep) {
+    let id = dep.id
+    if (!this.depsId.has(id)) {
+      this.depsId.add(id)
+      this.deps.push(dep)
+      dep.addSub(this);
+    }
+  }
+  update(){
+    this.get()
+  }
}
```

- 2、知道`Dep.target`是怎么来之后，然后上面代码运行了`this.get()`，相当于运行了`vm.$options.render`，在`render`里面回执行`this.name`，这时候会触发`Object.defineProperty·get`方法，我们在里面就可以做些依赖收集(dep.depend)了，如下代码

```
function defineReactive(data, key, value) {
  let dep = new Dep()
  Object.defineProperty(data, key, {
    get() {
+      if (Dep.target) { // 如果取值时有watcher
+        dep.depend() // 让watcher保存dep，并且让dep 保存watcher，双向保存
+      }
      return value
    },
    set(newValue) {
      if (newValue == value) return
      observe(newValue) // 给新的值设置响应式
      value = newValue
+      dep.notify() // 通知渲染watcher去更新
    }
  })
  // 递归给数据设置get set
  observe(value);
}
```

- 3、调用的`dep.depend()` 实际上是调用了 `Dep.target.addDep(this)`, 此时`Dep.target`等于当前的`watcher`，然后就会执行

```
addDep(dep) {
  let id = dep.id
  if (!this.depsId.has(id)) {
    this.depsId.add(id)
    this.deps.push(dep) // 当前的watcher收集dep
    dep.addSub(this); // 当前的dep收集当前的watcer
  }
}
```

这里双向保存有点绕，大家可以好好去理解一下。下面我们看看收集后的`des`是怎么样子的。

https://mmbiz.qpic.cn/mmbiz_png/1NOXMW586uuT9gETTZ8EcwWvSW3aeTkicdhOW846EP1If94JRzAjpGcO4vmvU3tfgcicLGkTdcgP2gyY8ibaiaAKYQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 4、数据更新，调用`this.name = '李四'`的时候回触发`Object.defineProperty.set`方法，里面直接调用`dep.notify()`，然后循环调用所有的`watcer.update`方法更新所有`watcher`，例如：这里也就是重新执行`vm.$options.render`方法。

有了依赖收集个数据更新，我们也在`index.html`增加修改`data`属性的定时方法:

```
// index.html
<button onClick="changeData()">改变name和age</button>
// -----
// .....省略代码
function changeData() {
  vue.name = '李四'
  vue.age = 20
}
```

运行效果如下图

https://mmbiz.qpic.cn/mmbiz_gif/1NOXMW586uuT9gETTZ8EcwWvSW3aeTkicsSTnvBgwzOAprvKFo2h8C33kicTAYoN79VFDwcNP3DJ0yaEKKCfYyAg/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1

到这里我们`渲染watcher`就全部实现了。

## **实现computed**

首先我们在`index.html`里面配置一个`computed，script`标签的代码就如下：

```
const root = document.querySelector('#root')
var vue = new Vue({
  data() {
    return {
      name: '张三',
      age: 10
    }
  },
  computed: {
    info() {
      return this.name + this.age
    }
  },
  render() {
    root.innerHTML = `${this.name}----${this.age}----${this.info}`
  }
})
function changeData() {
  vue.name = '李四'
  vue.age = 20
}
```

上面的代码，注意`computed`是在`render`里面使用了。

在vue.js中，之前写了下面这行代码。

```
if (options.computed) {
  // 初始化计算属性
  initComputed(vm)
}
```

我们现在就实现这个`initComputed`，代码如下

```
// 初始化computed
function initComputed(vm) {
  const computed = vm.$options.computed // 拿到computed配置
  const watchers = vm._computedWatchers = Object.create(null) // 给当前的vm挂载_computedWatchers属性，后面会用到
  // 循环computed每个属性
  for (const key in computed) {
    const userDef = computed[key]
    // 判断是函数还是对象
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    // 给每一个computed创建一个computed watcher 注意{ lazy: true }
    // 然后挂载到vm._computedWatchers对象上
    watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true })
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    }
  }
}
```

大家都知道`computed`是有缓存的，所以创建`watcher`的时候，会传一个配置`{ lazy: true }`，同时也可以区分这是`computed watcher`，然后到`watcer`里面接收到这个对象

```
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }
+    if (options) {
+      this.lazy = !!options.lazy // 为computed 设计的
+    } else {
+      this.lazy = false
+    }
+    this.dirty = this.lazy
    this.cb = cb
    this.options = options
    this.id = wId++
    this.deps = []
    this.depsId = new Set()
+    this.value = this.lazy ? undefined : this.get()
  }
  // 省略很多代码
}
```

从上面这句`this.value = this.lazy ? undefined : this.get()`代码可以看到，`computed`创建`watcher`的时候是不会指向`this.get`的。只有在`render`函数里面有才执行。

现在在`render`函数通过`this.info`还不能读取到值，因为我们还没有挂载到vm上面，上面`defineComputed(vm, key, userDef)`这个函数功能就是`让computed`挂载到`vm`上面。下面我们实现一下。

```
// 设置comoputed的 set个set
function defineComputed(vm, key, userDef) {
  let getter = null
  // 判断是函数还是对象
  if (typeof userDef === 'function') {
    getter = createComputedGetter(key)
  } else {
    getter = userDef.get
  }
  Object.defineProperty(vm, key, {
    enumerable: true,
    configurable: true,
    get: getter,
    set: function() {} // 又偷懒，先不考虑set情况哈，自己去看源码实现一番也是可以的
  })
}
// 创建computed函数
function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {// 给computed的属性添加订阅watchers
        watcher.evaluate()
      }
      // 把渲染watcher 添加到属性的订阅里面去，这很关键
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```

上面代码有看到在`watcher`中调用了`watcher.evaluate()`和`watcher.depend()`，然后去`watcher`里面实现这两个方法，下面直接看`watcher`的完整代码。

```
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }
    if (options) {
      this.lazy = !!options.lazy // 为computed 设计的
    } else {
      this.lazy = false
    }
    this.dirty = this.lazy
    this.cb = cb
    this.options = options
    this.id = wId++
    this.deps = []
    this.depsId = new Set() // dep 已经收集过相同的watcher 就不要重复收集了
    this.value = this.lazy ? undefined : this.get()
  }
  get() {
    const vm = this.vm
    pushTarget(this)
    // 执行函数
    let value = this.getter.call(vm, vm)
    popTarget()
    return value
  }
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this);
    }
  }
  update(){
    if (this.lazy) {
      this.dirty = true
    } else {
      this.get()
    }
  }
  // 执行get，并且 this.dirty = false
+  evaluate() {
+    this.value = this.get()
+    this.dirty = false
+  }
  // 所有的属性收集当前的watcer
+  depend() {
+    let i = this.deps.length
+    while(i--) {
+      this.deps[i].depend()
+    }
+  }
}
```

代码都实现王完成之后，我们说下流程，

- 1、首先在`render`函数里面会读取`this.info`，这个会触发`createComputedGetter(key)`中的`computedGetter(key)`；
- 2、然后会判断`watcher.dirty`，执行`watcher.evaluate()`；
- 3、进到`watcher.evaluate()`，才真想执行`this.get`方法，这时候会执行`pushTarget(this)`把当前的`computed watcher` push到stack里面去，并且把`Dep.target 设置成当前的`computed watcher`；
- 4、然后运行`this.getter.call(vm, vm)` 相当于运行`computed`的`info: function() { return this.name + this.age }`，这个方法；
- 5、`info`函数里面会读取到`this.name`，这时候就会触发数据响应式`Object.defineProperty.get`的方法，这里`name`会进行依赖收集，把`watcer`收集到对应的`dep`上面；并且返回`name = '张三'`的值，`age`收集同理；
- 6、依赖收集完毕之后执行`popTarget()`，把当前的`computed watcher`从栈清除，返回计算后的值('张三+10')，并且`this.dirty = false`；
- 7、`watcher.evaluate()`执行完毕之后，就会判断`Dep.target` 是不是`true`，如果有就代表还有`渲染watcher`，就执行`watcher.depend()`，然后让`watcher`里面的`deps`都收集`渲染watcher`，这就是双向保存的优势。
- 8、此时`name`都收集了`computed watcher` 和 `渲染watcher`。那么设置`name`的时候都会去更新执行`watcher.update()`
- 9、如果是`computed watcher`的话不会重新执行一遍只会把`this.dirty` 设置成 `true`，如果数据变化的时候再执行`watcher.evaluate()`进行`info`更新，没有变化的的话`this.dirty` 就是`false`，不会执行`info`方法。这就是computed缓存机制。

实现了之后我们看看实现效果：

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

> 这里conputed的对象set配置没有实现，大家可以自己看看源码

## **watch实现**

先在script标签配置watch配置如下代码：

```
const root = document.querySelector('#root')
var vue = new Vue({
  data() {
    return {
      name: '张三',
      age: 10
    }
  },
  computed: {
    info() {
      return this.name + this.age
    }
  },
  watch: {
    name(oldValue, newValue) {
      console.log(oldValue, newValue)
    }
  },
  render() {
    root.innerHTML = `${this.name}----${this.age}----${this.info}`
  }
})
function changeData() {
  vue.name = '李四'
  vue.age = 20
}
```

知道了`computed`实现之后，`自定义watch`实现很简单，下面直接实现`initWatch`

```
function initWatch(vm) {
  let watch = vm.$options.watch
  for (let key in watch) {
    const handler = watch[key]
    new Watcher(vm, key, handler, { user: true })
  }
}
```

然后修改一下Watcher,直接看Wacher的完整代码。

```
let wId = 0
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    } else {
+      this.getter = parsePath(exprOrFn) // user watcher 
    }
    if (options) {
      this.lazy = !!options.lazy // 为computed 设计的
+      this.user = !!options.user // 为user wather设计的
    } else {
+      this.user = this.lazy = false
    }
    this.dirty = this.lazy
    this.cb = cb
    this.options = options
    this.id = wId++
    this.deps = []
    this.depsId = new Set() // dep 已经收集过相同的watcher 就不要重复收集了
    this.value = this.lazy ? undefined : this.get()
  }
  get() {
    const vm = this.vm
    pushTarget(this)
    // 执行函数
    let value = this.getter.call(vm, vm)
    popTarget()
    return value
  }
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this);
    }
  }
  update(){
    if (this.lazy) {
      this.dirty = true
    } else {
+      this.run()
    }
  }
  // 执行get，并且 this.dirty = false
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }
  // 所有的属性收集当前的watcer
  depend() {
    let i = this.deps.length
    while(i--) {
      this.deps[i].depend()
    }
  }
+  run () {
+    const value = this.get()
+    const oldValue = this.value
+    this.value = value
    // 执行cb
+    if (this.user) {
+      try{
+        this.cb.call(this.vm, value, oldValue)
+      } catch(error) {
+        console.error(error)
+      }
+    } else {
+      this.cb && this.cb.call(this.vm, oldValue, value)
+    }
+  }
}
function parsePath (path) {
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
```

最后看看效果

https://mmbiz.qpic.cn/mmbiz_gif/1NOXMW586uuT9gETTZ8EcwWvSW3aeTkic28BnWOUibT7aCL5T90XBicx0S7vMXlyHo4FjvoQV94fI9XQg6pnEJxlA/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1

当然很多配置没有实现，比如说`options.immediate` 或者`options.deep`等配置都没有实现。篇幅太长了。自己也懒～～～ 完结撒花

详细代码：https://github.com/naihe138/write-vue





