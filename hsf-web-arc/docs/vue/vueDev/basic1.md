---
title: vue开发的组件
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# 级联组件编写

## 项目构建

```bash
 ◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◯ Router
 ◯ Vuex
 ◉ CSS Pre-processors
 ◉ Linter / Formatter
 ◉ Unit Testing
 ◯ E2E Testing
```

```bash
Please pick a preset: Manually select features
? Check the features needed for your project: Babel, CSS Pre-processors, Linter
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): Stylus
? Pick a linter / formatter config: Airbnb
? Pick additional lint features: Lint on save, Lint and fix on commit
? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.? In dedicated config files
? Save this as a preset for future projects? (y/N) Y
```

> 默认eslint，在vue中使用了yorkie + lint-staged 实现了git hook

## 一.使用Cascader组件

```html
<template>
    <Cascader></Cascader>
</template>

<script>
import Cascader from './components/Cascader';
export default {
    components:{
        Cascader
    }
}
</script>
```

## 二.基本显示结构

```html
<template>
    <div>
        <!-- 点击输入框切换面板显示隐藏 -->
        <div class="trigger" @click="isVisible =!isVisible">
            <slot></slot>
        </div>
        <div class="content" v-if="isVisible">
            显示面板
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {isVisible:true}
    }
}
</script>
<style>
.trigger{
    width: 150px;
    height:25px;
    border: 1px solid #ccc
}
</style>
```

点击输入框以外的内容应该收起面板，此时我们一步到位将功能扩展成指令

```html
<div v-click-outside="close">
  <div class="trigger" @click="toggle">
    <slot></slot>
  </div>
  <div class="content" v-if="isVisible">
    显示面板
  </div>
</div>
```

```javascript
directives:{
    clickOutside:{
        inserted(el,bindings){ // 只在插入时绑定事件
            document.addEventListener('click',(e)=>{
                if(e.target === el || el.contains(e.target)){
                    return;
                }
                bindings.value(); // 点击非自己、或者不是自己的儿子就关闭元素
            });
        }
    }
},
methods:{
    close(){
        this.isVisible = false
    },
    toggle(){
        this.isVisible = ! this.isVisible
    }
},
```

默认指令调用的钩子是bind和update

## 三.传入数据

```html
<Cascader :options="options"></Cascader>
```

1

传入递归数据

```json
[
    {
        "label": "肉类", 
        "children": [
            {
                "label": "猪肉", 
                "children": [
                    {
                        "label": "五花肉"
                    }, 
                    {
                        "label": "里脊肉"
                    }
                ]
            }, 
            {
                "label": "鸡肉", 
                "children": [
                    {
                        "label": "鸡腿"
                    }, 
                    {
                        "label": "鸡翅"
                    }
                ]
            }
        ]
    }, 
    {
        "label": "蔬菜", 
        "children": [
            {
                "label": "叶菜类", 
                "children": [
                    {
                        "label": "大白菜"
                    }, 
                    {
                        "label": "小白菜"
                    }
                ]
            }, 
            {
                "label": "根茎类", 
                "children": [
                    {
                        "label": "萝卜"
                    }, 
                    {
                        "label": "土豆"
                    }
                ]
            }
        ]
    }
]
```

## 四.数据渲染

根据省市级联的效果我们会想到点击左侧面板可以渲染右边的列表，我们先考虑两层的实现

```html
<template>
    <div v-click-outside="close">
        <div class="trigger" @click="toggle">
            <slot></slot>
        </div>
        <div class="content" v-if="isVisible">
            <div class="content-left">
                <div v-for="(item,key) in options" :key="key">
                    <div @click="select(item)">{{item.label}}</div>
                </div>
            </div>
            <div class="content-right" v-if="listsists && lists.length"
                <div v-for="(item,key) in lists" :key="key">
                    <div>{{item.label}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    directives:{
        clickOutside:{
            inserted(el,bindings){ // 只在插入时绑定事件
                document.addEventListener('click',(e)=>{
                    if(e.target === el || el.contains(e.target)){
                        return;
                    }
                    bindings.value(); // 点击非自己、或者不是自己的儿子就关闭元素
                });
            }
        }
    },
    methods:{
        select(item){
            this.currentSelect = item;
        },
        close(){
            this.isVisible = false
        },
        toggle(){
            this.isVisible = ! this.isVisible
        }
    },
    data(){
        return {
            isVisible:true,
            currentSelect:null // 当前点击的第一层儿子
        }
    },
    computed: {
        lists(){
            return this.currentSelect && this.currentSelect.children
        }  
    },
    props:{
        options:{
            type:Array,
            default:()=>[]
        }
    }
}
</script>
<style>
.trigger{
    width: 150px;
    height:25px;
    border: 1px solid #ccc
}
.content{
    display:flex
}
</style>
```

我们需要实现多层嵌套效果，那么只能使用递归组件啦！

## 五.递归组件封装

将需要重复的代码单独放到一个组件中，进行递归渲染

在父组件中传入options交给子组件渲染

```html
 <CascaderItem :options="options"></CascaderItem>
```

1

```html
<template>
    <div class="content">
        <div class="content-left">
            <div v-for="(item,key) in options" :key="key">
                <div @click="select(item)">{{item.label}}</div>
            </div>
        </div>
        <div class="content-right" v-if="ists && lists.length">
            <div v-for="(item,key) in lists" :key="key">
                <div>{{item.label}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
             currentSelect:null // 当前点击的第一层儿子
        }
    },
    methods:{
        select(item){
            this.currentSelect = item;
        },
    },
    computed: {
        lists(){
            return this.currentSelect && this.currentSelect.children
        }  
    },
    props:{
        options:{
            type:Array,
            default:()=>[]
        }
    }
}
</script>
```

将逻辑进行拆分，拆分出CascaderItem组件

```html
<template>
    <div class="content cascader-item">
        <div class="content-left">
            <div class="label" v-for="(item,key) in options" :key="key">
                <div @click="select(item)">{{item.label}}</div>
            </div>
        </div>
        <div class="content-right" v-if="ists && lists.length">
            <CascaderItem :options="lists"></CascaderItem>
        </div>
    </div>
</template>

<script>
export default {
    name:"CascaderItem",
    data(){
        return {
             currentSelect:null // 当前点击的第一层儿子
        }
    },
    methods:{
        select(item){
            this.currentSelect = item;
        },
    },
    computed: {
        lists(){
            return this.currentSelect && this.currentSelect.children
        }  
    },
    props:{
        options:{
            type:Array,
            default:()=>[]
        }
    }
}
</script>

<style>
.cascader-item {
 display: flex;
}
.content-left{
    border: 1px solid #ccc;
    min-height: 100px;
}
.content-right{
    margin-left:-1px;
}
.label{
    width:60px;
    font-size: 12px;
    line-height: 20px;
    color: #606266;
    padding-left: 10px;
    cursor: pointer
}
.label:hover{
    background: #f5f7fa;
}
</style>
```

递归组件必须要使用name属性来实现

## 六.统一在父组件获取选中的值

```javascript
<template>
 <Cascader :options="options" v-model="selected"></Cascader>
</template>
selected:[]
```

用户需要获取选中的结果，我们采用贴近用户使用的方式v-model

Cascader.vue

```html
<CascaderItem :options="options" @change="change" :value="value"></CascaderItem>
```

将value传入到子组件中，当值变化后触发change事件

```javascript
methods:{
    close(){
        this.isVisible = false
    },
    toggle(){
        this.isVisible = ! this.isVisible
    },
    change(value){

    }
},
props:{
    value:{ // 用户选择的值
        type:Array,
        default:()=>[]
    },
    options:{
        type:Array,
        default:()=>[]
    }
}
```

CascaderItem.vue

不能在子组件中直接更改props需要拷贝传入的属性

```text
yarn add lodash
```

点击某一项触发选择事件，将当前层级和结果对应上

```html
<template>
    <div class="content cascader-item">
        <div class="content-left">
            <div class="label" v-for="(item,key) in options" :key="key">
                <div @click="select(item)">{{item.label}}</div>
            </div>
        </div>
        <div class="content-right" v-if="ists && lists.length">
            <CascaderItem :options="lists"></CascaderItem>
        </div>
    </div>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
    name:"CascaderItem",
    data(){
        return {
             currentSelect:null // 当前点击的第一层儿子
        }
    },
    methods:{
        select(item){
            this.currentSelect = item;
            let cloneValue = cloneDeep(this.value); // 拷贝
            cloneValue[this.level] = item; // 将层级和数组的结果对应上
            this.$emit('change',cloneValue);
        },
    },
    computed: {
        lists(){
            return this.currentSelect && this.currentSelect.children
        }  
    },
    props:{
        level:{ // 获取的层级
            type:Number,
            default:0
        },
        value:{ // 获取数据是数组类型
            type:Array,
            default:()=>[]
        },
        options:{
            type:Array,
            default:()=>[]
        }
    }
}
</script>

<style>
.cascader-item {
 display: flex;
}
.content-left{
    border: 1px solid #ccc;
    min-height: 100px;
}
.content-right{
    margin-left:-1px;
}
.label{
    width:60px;
    font-size: 12px;
    line-height: 20px;
    color: #606266;
    padding-left: 10px;
    cursor: pointer
}
.label:hover{
    background: #f5f7fa;
}
</style>
```

因为是递归展示数据，所以将value和level继续向下传递

```html
<div class="content-right" v-if="lists">
   <CascaderItem :options="lists" @change="change" :value="value" :level="level+1"></CascaderItem>
</div>
```

子组件会触发当前传入的change事件，所以我们要在编写个change事件

```javascript
change(value){
    this.$emit('change',value);
}
```

在父组件中将获得的结果同步给用户,并将选择的结果显示到页面上 Cascader.vue

```html
<div class="trigger" @click="toggle">
    <slot>{{result}}</slot>
</div>
```

```javascript
change(value){
    this.result = value.map(item=>item.label).join('/');
    this.$emit('input',value)
}
```

## 七.计算需要显示出的面板

```javascript
select(item){
    let cloneValue = cloneDeep(this.value); // 拷贝
    cloneValue[this.level] = item; // 将层级和数组的结果对应上
    cloneValue.splice(this.level+1); // 需要将当前选择层级之后的数据清空
    this.$emit('change',cloneValue);
}
```

根据最新的数据查找儿子列表

```javascript
lists(){
    // 因为currentSelect值不会变化 需要重新查找当前点击的是否有儿子
    // 看这一层有没有值
    if( this.value && this.value[this.level]){
        // 找到这一项
        let item = this.options.find(item=>item.label === this.value[this.level].label);
        // 将儿子进行返回
        if(item && item.children){
            return item.children
        }
    }
    //return this.currentSelect && this.currentSelect.children
} 
```

## 八.实现数据动态获取

```javascript
import dataList from './dataList.json';
const fetchData = (id,callback)=>{
    return new Promise((resolve,reject)=>{
       setTimeout(()=>{
        let result = dataList.filter(item=>item.pid === id);
        resolve(result); // 将获取到的数据传递出去
       },300)
    })
}
data() { 
  return {
   selected:[],
   options:[],
  }
},
async mounted(){
    let r = await fetchData(0); // 动态设置数据
    this.options = r;
},
```

## 九.动态添加儿子节点

```html
<Cascader :options="options" v-model="selected" @input="change"></Cascader>
// 手动添加事件监听
```

```javascript
 methods:{
     async change(items){ // 获取到所有数据加载最后一项看是否有子节点
        let item = items[items.length - 1];
        let children = await fetchData(item.id);
        if(children){
            this.$set(item,'children',children)
        }
     }
 },
```

## 十.传入加载函数

```html
<Cascader :options="options" v-model="selected" :lazyLoad="lazyLoad"></Cascader>
```

组件内部默认会调用lazyLoad传入当前的item和回调，用户获取数据后调用callback将获取到的数据回传

```javascript
async lazyLoad(id,callback){
    let children = await fetchData(id);
    callback(children);
},
```

广度遍历找到当前这一项增加儿子节点

```javascript
getNewData(id,children){ // 获取的个字
    // 获取儿子节点后
    let cloneValue = cloneDeep(this.options)
    let stack = [...cloneValue];
    let index = 0;
    let current;
    while(current = stack[index++]){
        if(current.id !== id ){ // 找id相同的
        if(current.children){
                stack = stack.concat(current.children);
        }
        }else{
            break;
        }
    }
    if(current){
        current.children = children;
        this.$emit('update:options',cloneValue); // 将内容回显回去
    }
},
change(value) { 
    this.result = value.map(item => item.label).join("/");
    let lastItem = value[value.length-1];
    if(this.lazyLoad){ // 如果传递加载函数就调用否则不需要加载数据
        this.lazyLoad(lastItem.id,(children)=>{
            this.getNewData(lastItem.id,children); // 动态添加儿子 
        }); 
    }
    this.$emit("input", value);
}
```

## 十一.npm项目发布

修改package.json

```json
{
    "name": "vue-cascader-async", // 发布的项目名称
    "private": false, // 可以提交到公共仓库上
    "version": "0.1.4",// 发布项目版本
    "dist": "vue-cli-service build --target lib --name Cascader  ./src/components/Cascader.vue", // 打包的组件
    "main": "./dist/Cascader.umd.min.js" // 入口文件
}
```

发布包

```bash
npm addUser
npm publish
```



# Vue权限菜单及按钮权限

## 一.服务端数据

Vue权限菜单需要根据后端返回的数据来实现

```javascript
[
    {pid:-1,name:'购物车',id:1,auth:'cart'},
    {pid:1,name:'购物车列表',id:4,auth:'cart-list'},
    {pid:4,name:'彩票',id:5,auth:'lottery'},
    {pid:4,name:'商品',id:6,auth:'product'},
    {pid:-1,name:'商店',id:2,auth:'shop'},
    {pid:-1,name:'个人中心',id:3,auth:'store'},
];
```

通过express返回权限列表

```javascript
const express = require('express');

const app = express();
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  // Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});
app.get('/roleAuth', (req, res) => {
  res.json({
    menuList: [
        {pid:-1,name:'购物车',id:1,auth:'cart'},
        {pid:1,name:'购物车列表',id:4,auth:'cart-list'},
        {pid:4,name:'彩票',id:5,auth:'lottery'},
        {pid:4,name:'商品',id:6,auth:'product'},
        {pid:-1,name:'商店',id:2,auth:'shop'},
        {pid:-1,name:'个人中心',id:3,auth:'store'},
    ]
  });
});
app.listen(3000);
```

## 二.静态菜单

使用element-ui构建静态菜单

```javascript
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
```

```html
<el-menu default-active="2" class="el-menu-vertical-demo">
    <el-submenu index="1">
        <template slot="title">导航一</template>
        <el-submenu index="1-1">
            <template slot="title">选项1-1</template>
            <el-menu-item index="1-1-1">选项1-1-1</el-menu-item>
            <el-menu-item index="1-1-2">选项1-1-2</el-menu-item>
        </el-submenu>
        <el-menu-item index="1-2">选项1-2</el-menu-item>
    </el-submenu>
    <el-menu-item index="2">
        导航二
    </el-menu-item>
    <el-menu-item index="3">
        导航三
    </el-menu-item>
    <el-menu-item index="4">
        导航四
    </el-menu-item>
</el-menu>
```

路由配置

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)
export const authRoutes = [ // 权限路由
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/Cart'),
    children: [
      {
        path: 'cart-list',
        name: 'cart-list',
        component: () => import('@/views/CartList'),
        children: [
          {
            path: 'lottery',
            name: 'lottery',
            component: () => import('@/views/Lottery'),
          },
          {
            path: 'product',
            name: 'product',
            component: () => import('@/views/Product'),
          },
        ],
      },
    ],
  },
];
export default new Router({ // 默认导出 首页和404页面
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path:'*',
      component:{
        render:h=>h('h1',{},'Not Found')
      }
    }
  ]
})
```

## 三.获取权限

根据后端返回的数据，格式化树结构，并提取用户权限

```javascript
// 默认设置没有获取过权限
export default new Vuex.Store({
  state: {
    hasPermission:false
  },
  mutations: {
    setPermission(state){
      state.hasPermission = true
    }
  },
})
```

在路由跳转前看下是否获取过权限，如果没有获取过，就获取权限存入vuex中

```javascript
router.beforeEach(async (to,from,next)=>{
  if(!store.state.hasPermission){
    // 获取最新路由列表
    let newRoutes = await store.dispatch('getRouteList'); 
    router.addRoutes(newRoutes); // 增加新路由
    next({...to,replace:true})
  }else{
    next(); // 获取过就不需要再次获取了
  }
})
```

## 四.获取相关需要数据

```javascript
const getMenListAndAuth = (menuList)=>{
  let menu = [];
  let sourceMap = {};
  let auth = [];
  menuList.forEach(m => {
    m.children = []; // 增加孩子列表
    sourceMap[m.id] = m;
    auth.push(m.auth)
    if(m.pid === -1){
      menu.push(m); // 根节点
    }else{
      sourceMap[m.pid] && sourceMap[m.pid].children.push(m)
    }
  });
  return {menu,auth} // 获取菜单数据和权限数据
}
async getRouteList({dispatch,commit}){
    let auths = await axios.get('http://localhost:3000/roleAuth');
    let menuList = auths.data.menuList;
    let {menu,auth} = getMenListAndAuth(menuList);
}
```

## 五.找到需要添加的路由

```javascript
import {authRoutes} from './router'
const getRoutes = auth => {
  const filter = (authRoutes)=>{
    return authRoutes.filter(route=>{
      // 包含权限
      if(auth.includes(route.name)){
        if(route.children){
          route.children = filter(route.children);
        }
        return true;
      }
    })
  }
  return filter(authRoutes);
};

// 获取需要添加的路由列表
async getRouteList({ dispatch, commit }) {
    let auths = await axios.get("http://localhost:3000/roleAuth");
    let menuList = auths.data.menuList;
    let { menu, auth } = getMenListAndAuth(menuList);
    commit("setMenu", menu); // 将菜单数据保存起来
    commit("setPermission"); // 权限获取完毕
    // 通过auth查找需要添加的路由
    return getRoutes(auth);
}
```

## 六.递归渲染菜单

渲染Menu组件提取公共部分

```html
<template>
 <div>
  <el-menu>
   <template v-for="menu in $store.state.menu">
    <el-submenu v-if="menu.children.length" :key="menu.auth" :index="menu.auth">
     <template slot="title">{{menu.name}}</template>
     <!-- 此处需要不停的递归 el-submenu  -->
    </el-submenu>
    <el-menu-item v-else :key="menu.auth" :index="menu.auth">{{menu.name}}</el-menu-item>
   </template>
  </el-menu>
 </div>
</template>
```

编写递归组件

```html
<template>
    <el-submenu :index="menu.auth">
         <template slot="title">{{menu.name}}</template>
         <template v-for="(child,index) in menu.children">  
            <el-menu-item v-if="!child.children.length" :key="index"> 
               <router-link :to="{name:child.auth}"> {{child.name}}</router-link>
            </el-menu-item>
            <!-- 如果有儿子继续递归组件 -->
            <ResubMenu :menu="child" v-else :key="index"></ResubMenu>
         </template>
    </el-submenu>
</template>
<script>
export default {
    name:'ResubMenu',
    props:{
        menu:{}
    }
}
</script>
```

## 七.权限按钮控制

```javascript
state: {
    hasPermission: false,
    menu: [], // 菜单权限
    btnPermission:{ // 按钮权限
        edit:false,
        add:true
    }
},
```

查看当前按钮是否有权限

```html
<el-button v-has="'edit'">编辑</el-button>
<el-button v-has="'add'">添加</el-button>
```

自定义指令的使用

```javascript
directives: {
  has: {
   inserted(el, bindings, vnode) {
     let value = bindings.value;
     // 在vuex中查看是否有按钮权限
     let flag = vnode.context.$store.state.btnPermission[value];
     // 如果没有全选则将按钮删除即可
     !flag && el.parentNode.removeChild(el);
   }
  }
 }
```



# `Vue3` 实现Tree组件

## 一.组件初始化操作

### 1.创建树组件

```jsx
export default {
    name: 'ZfTree',
    setup() {
        return () => <h1>hello tree</h1>
    }
}
```

### 2.注册树组件

```js
import Tree from './tree.jsx'
import '../../style/tree.scss'
Tree.install = (app) => {
    app.component(Tree.name, Tree)
}
export default Tree
```

> 此时树组件已经变为全局，可以直接被使用了

## 二.通过数据渲染树组件

### 1.组件的递归渲染

```js
const state = reactive({
    treeData: [
    {
        id: "1",name: "菜单1", children: [
          {id: "1-1",name: "菜单1-1",children: [{ id: "1-1-1", name: "菜单1-1-1" }]}
        ]
    },
    {
        id: "2", name: "菜单2",children: [
          {id: "2-1",name: "菜单2-1",children: [{id: "2-1-1",name: "菜单2-1-1"}]},
          {id: "2-2",name: "菜单2-2",children: [{id: "2-2-1",name: "菜单2-2-1" }]},
        ]
    },
    ]
});
```

```jsx
export default {
    name: 'ZfTree',
    props: {
        data: {
            type: Array,
            default: () => []
        },
    },
    setup(props) {
        const data = props.data;
        function renderNode(data) {
            if (data && data.length == 0) { // 无节点情况
                return <div>无任何节点</div>
            }
            function renderChild(item) {  // 渲染每一个节点
                return <div class="zf-tree-node">
                    <div class="zf-tree-label">{item.name}</div>
                    {item.children && item.children.map(child => renderChild(child))}
                </div>
            }
            return data.map(item => renderChild(item));
        }
        return () => <div class="zf-tree">
            {renderNode(data)}
        </div>
    }
}
```

> 递归渲染树组件，但是我们把逻辑都放在Tree组件中，显得过于臃肿。我们可以将子节点渲染单独拿到一个组件中进行!

### 2.组件的分割

```jsx
import TreeNode from './tree-node'
export default {
    components:{
        [TreeNode.name]:TreeNode
    },
    setup(props) {
        const data = props.data;
        function renderNode(data) {
            if (data && data.length == 0) { // 无节点情况
                return <div>无任何节点</div>
            }
            // 渲染子节点
            return data.map(item => <zf-tree-node data={item}></zf-tree-node>);
        }
        return () => <div class="zf-tree">
            {renderNode(data)}
        </div>
    }
}
```

```jsx
export default {
    name: 'ZfTreeNode',
    props: {
        data: {
            type: Object
        }
    },
    setup(props) {
        const data = props.data;
        return () => {
            return <div class="zf-tree-node">
                <div class="zf-tree-label">{data.name}</div>
                <div class="zf-tree-list">
                    {data.children && data.children.map(child => <zf-tree-node data={child}></zf-tree-node>)}
                </div>
            </div>
        }
    }
}
```

### 3.美化树组件样式

```scss
@import './common/_var.scss';
@import './mixins/mixins.scss';

@include blockquote(tree){
    position: relative;
    .zf-tree-label {
        padding-left: 24px;
    }
    .zf-tree-list {
        padding-left: 34px;
    }
}
```

## 三.组件展开收缩功能

### 1.显示展开图标

```jsx
const showArrow = computed(() => { // 是否显示箭头
    return data.children && data.children.length > 0
});
const classes = computed(() => [
    'zf-tree-node',
    !showArrow.value && 'zf-tree-no-expand'
]);
<div class={classes.value}></div>
```

> 通过计算属性的方式绑定样式

```scss
@include blockquote(tree){
    position: relative;
    .zf-tree-node{
        user-select: none;
        &.zf-tree-no-expand{
            .zf-icon{
                visibility: hidden;
            }
        }
    }
}
```

### 2.增加树的折叠功能

```jsx
const methods = {
    handleExpand(){
   		data.expand = !data.expand;
    }
}
<div class="zf-tree-label" onClick={methods.handleExpand}>
    <zf-icon icon="right"></zf-icon>
    <span>{data.name}</span>
</div>
```

> 实现树的展开折叠功能

## 四.增加选择功能

增加`checkbox` 切换选择时动态给当前数据增加checked属性

```jsx
const methods = {
    handleChange() {
        data.checked = !data.checked; // 切换选中功能
    }
}
<div class={classes.value}>
    <div class="zf-tree-label" onClick={methods.handleExpand}>
        <zf-icon icon="right"></zf-icon>
        <input type="checkbox" checked={data.checked} onClick={withModifiers(methods.handleChange, ['stop'])} />
        <span>{data.name}</span>
    </div>
    <div class="zf-tree-list" vShow={data.expand}>
        {data.children && data.children.map(child => <zf-tree-node data={child}></zf-tree-node>)}
    </div>
</div>
```

### 1.获取选中的节点

先将所有数据拍平获得checked值为true的节点,并标记父节点。给所有节点增加唯一标识

```js
export const flattenTree = (data) => {
    let key = 0;
    function flat(data,parent){
        return data.reduce((obj,currentNode)=>{
            currentNode.key = key;
            obj[key] = {
                parent,
                node:currentNode
            }
            key++;
            if(currentNode.children){
                obj = {...obj,...flat(currentNode.children,currentNode)}
            }
            return obj;
        },{})
    }
    return flat(data);
}
```

### 2.将方法暴露到上下文中

```jsx
const flatMap = flattenTree(data);
const methods = {
    getCheckNodes(){ // 获取所有选中的节点
        return Object.values(flatMap).filter(item=>item.node.checked) 
    }
}
const instance = getCurrentInstance();
// 将方法暴露在当前实例的上下文中
instance.ctx.getCheckNodes = getCheckNodes;
```

### 3.通过ref进行获取

```jsx
<zf-tree :data="treeData" ref="tree"></zf-tree>
export default {
  setup() {
	
    let tree = ref(null); // 设置ref
    function getCheckedNodes() { 
      console.log(tree.value.getCheckNodes()); // 获取所有节点
    }
    return {
      ...toRefs(state),
      tree,
      getCheckedNodes,
    };
  },
};
```

## 五.设置级联选中状态

```js
updateTreeDown(node,checked){
    if(node.children){
        node.children.forEach(child=>{
            child.checked = checked;
            methods.updateTreeDown(child,checked)
        })
    }
}
updateTreeUp(node,checked){
    let parentNode = flatMap[node.key].parent;
    if(!parentNode) return;
    let parentKey = parentNode.key;
    const parent = flatMap[parentKey].node; // 找到爸爸节点
    if(checked){ // 看爸爸里儿子是否有选中的项
        parent.checked = parent.children.every(node=>node.checked);
    }else{
        parent.checked = false;
    }
    methods.updateTreeUp(parent,checked);
}
```

```js
provide('TREE_PROVIDER', {
    treeMethods: methods
});
```

> 在父组件中将方法暴露出去, 以便子组件调用这些方法

```js
let {treeMethods} = inject('TREE_PROVIDER')
const methods = {
    handleExpand() {
        data.expand = !data.expand;
    },
    handleChange() {
        data.checked = !data.checked;
        treeMethods.updateTreeDown(data,data.checked); // 通知下层元素
        treeMethods.updateTreeUp(data,data.checked) // 通知上层元素
    }
}
```

## 六.异步加载

### 1.传递异步方法

```js
<zf-tree :data="treeData" ref="tree" :load="loadFn"></zf-tree>
function loadFn(data, cb) {
    if (data.id == 1) {
    setTimeout(() => {
        cb([
        {
            id: "1-1",
            name: "菜单1-1",
            children: [],
        },
        ]);
    }, 1000);
    } else if (data.id == "1-1") {
    setTimeout(() => {
        cb([{ id: "1-1-1", name: "菜单1-1-1" }]);
    }, 1000);
    }
}
```

```js
provide('TREE_PROVIDER', {
    treeMethods: methods,
    load:props.load
});
```

```jsx
let { treeMethods,load } = inject('TREE_PROVIDER');
const methods = {
    handleExpand() {
        if(data.children && data.children.length == 0){// 如果没有儿子是空的
            if(load){ // 有加载方法就进行加载
                data.loading = true; // 正在加载
                load(data,(children)=>{
                    data.children = children;
                    data.loading = false;// 加载完毕
                })
            }
        }
        data.expand = !data.expand;
    },
    handleChange() {
        data.checked = !data.checked;
        treeMethods.updateTreeDown(data, data.checked);
        treeMethods.updateTreeUp(data, data.checked)
    }
}
```

```js
const isLoaded = ref(false); // 用来标识加载完毕
const showArrow = computed(() => { // 是否显示箭头  没儿子 而且也加载完了
    return (data.children && data.children.length > 0) || (load && !isLoaded.value)
});

handleExpand() {
    if (data.children && data.children.length == 0) { // 如果没有儿子是空的
        if (load) { // 有加载方法就进行加载
            data.loading = true; // 正在加载
            load(data, (children) => {
                data.children = children;
                data.loading = false; // 加载完毕
                isLoaded.value = true;
            })
        }
    }else{
        isLoaded.value = true;
    }
    data.expand = !data.expand;
}
```

> 实现tree组件数据的异步加载。这里要注意数据新增后要重新构建父子关系

```js
watch(data,()=>{
    flatMap = flattenTree(data);
});
```

> 监控数据变化重新格式化数据。

## 七.定制化节点插槽实现

```html
<zf-tree :data="treeData" ref="tree" :load="loadFn">
        <template v-slot="{name}">
           <b>{{name}}</b>
        </template>
</zf-tree>
```

```js
provide('TREE_PROVIDER', {
    treeMethods: methods,
    load: props.load,
    slot:context.slots.default
});
```

```jsx
let { treeMethods, load, slot } = inject('TREE_PROVIDER')
{slot ? slot(data) : <span>{data.name}</span>}
```

> 通过作用域插槽将组件内的数据传递给父组件

## 八.拖拽实现

```js
const classes = computed(() => [
    'zf-tree-node',
    !showArrow.value && 'zf-tree-no-expand',
    draggable && 'zf-tree-draggable'
]);
const instance = getCurrentInstance()
const dragEvent = {
    ...(draggable ? {
        onDragstart(e) {
            e.stopPropagation();
            treeMethods.treeNodeDragStart(e,instance, data);
        },
        onDragover(e) {
            e.stopPropagation();
            treeMethods.treeNodeDragOver(e,instance, data);
        },
        onDragend(e) {
            e.stopPropagation();
            treeMethods.treeNodeDragEnd(e,instance, data);
        }
    } : {})
}
<div class={classes.value} {...dragEvent}>
```

> 根据`draggable`属性决定是否添加拖拽事件

```scss
.zf-tree-node {
        &.zf-tree-draggable {
            user-select: none;
            -webkit-user-drag: element;
        }
}
```

> 设置文字不能选择，元素可以拖动

### 1.拖动线设置

```html
<div class="zf-tree-indicator" ref="indicator" vShow={state.showDropIndicator}></div>
```

```scss
.zf-tree-indicator{
        position: absolute;
        height: 1px;
        right:0;
        left:0;
        background-color:#409eff;
}
```

### 2.拖动事件处理逻辑

```js
const state = reactive({
    dropPosition: '', // 拖拽的位置
    dragNode: null, // 拖的是谁数据
    showDropIndicator: false, // 推拽标尺
    draggingNode: null // 拖拽的节点
})
treeNodeDragStart(e,nodeInstance, data) {
    state.draggingNode = nodeInstance; // 拖拽的实例
    state.dragNode = data; // 拖拽的数据
},
treeNodeDragOver(e,nodeInstance, data) {
    // 在自己身上滑来滑去
    if(state.dragNode.key == data.key){
        return;
    }
    let overEl= nodeInstance.ctx.$el; // 经过的el，是当前拖住的儿子
    if(state.draggingNode.ctx.$el.contains(overEl)){
        return 
    }
    // 获取目标节点label的位置
    let targetPosition = overEl.firstElementChild.getBoundingClientRect();
    // 树的位置
    let treePosition = instance.ctx.$el.getBoundingClientRect(); 
    let distance = e.clientY - targetPosition.top; // 鼠标相对于 文本的位置 

    if(distance < targetPosition.height * 0.2){
        state.dropPosition = 1;
    }else if(distance > targetPosition.height* 0.8){
        state.dropPosition = -1; // 后面
    }else{
        state.dropPosition = 0;
    }
    let iconPosition = overEl.querySelector('.zf-icon').getBoundingClientRect();
    let indicatorTop = -9999;
    if(state.dropPosition == 1){
        indicatorTop = iconPosition.top - treePosition.top; // 获取线相对于树的位置
    }else if(state.dropPosition == -1){
        indicatorTop = iconPosition.bottom - treePosition.top; 
    }
    state.showDropIndicator = (state.dropPosition == 1) || (state.dropPosition == -1);
    const indicator = instance.ctx.$refs.indicator;
    indicator.style.top = indicatorTop + 'px';
    indicator.style.left = iconPosition.right - treePosition.left + 'px';
},
treeNodeDragEnd(e,nodeInstance, data) {
    state.showDropIndicator = false;
    state.dropPosition = '';
    state.dragNode = null;
    state.draggingNode = null;
}
```