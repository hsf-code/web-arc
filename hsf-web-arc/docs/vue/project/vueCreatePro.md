---
title: vue项目
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

## 1.初始化开发环境



## 1.1 初始化项目

```bash
npm install @vue/cli -g
vue create vue-ketang
```

> [CLI CHANGELOG](https://github.com/vuejs/vue-cli/blob/dev/CHANGELOG.md)

```bash
 (*) Choose Vue version
 (*) Babel
 ( ) TypeScript
 (*) Progressive Web App (PWA) Support
 (*) Router
 (*) Vuex
 (*) CSS Pre-processors
```

> dart-sass 性能更好,后续sass新的特性会优先支持，也解决了node-sass不稳定问题

### 1.2 安装依赖

```text
vue add style-resources-loader
```

```js
const path = require('path');
module.exports = {
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: [path.resolve(__dirname, 'src/assets/common.scss')]
        }
    }
}
```

> 增加全局`scss`变量

```bash
npm i postcss-plugin-px2rem lib-flexible
```

```js
import "lib-flexible"; // main.js
module.exports = {
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require("postcss-plugin-px2rem")({
                        rootValue: 75,
                        exclude: /node_module/,
                    })
                ]
            }
        }
    }
}
```

> 增加`px2rem插件`

```text
npm i vant axios -D
```

```js
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
```

## 1.3 配置目录

```bash
src
    │  App.vue     # 根组件
    │  main.js     # 入口文件
    ├─api          # 存放接口
    ├─assets       # 存放资源
    ├─components   # 组件
    ├─config       # 存放配置文件
    ├─router       # 存放路由配置
    ├─store        # 存放vuex配置
    ├─utils        # 存放工具方法
    └─views        # 存放Vue页面
```

## 2.项目路由搭建

### 2.1 配置`router.js`

```js
const routes = [{
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/lesson',
        name: 'lesson',
        component: () => import('@/views/lesson/index.vue')
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/profile/index.vue')
    }
];
```

### 2.2 使用`vant ui`组件

```vue
<div id="app">
  <router-view></router-view>
  <van-tabbar route>
    <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
    <van-tabbar-item icon="shop-o" to="/lesson">我的课程</van-tabbar-item>
    <van-tabbar-item icon="friends-o" to="/profile">个人中心</van-tabbar-item>
  </van-tabbar>
</div>
```

### 2.3 增加路由loading效果

```js
import Loading from '@/components/loading';
const loadable = (asyncFUnction) => {
    const component = () => ({
        component: asyncFUnction(),
        loading:Loading
    })
    return {
        render(h) {
            return h(component)
        }
    }
}
export default loadable
```

## 3.首页头部导航搭建

### 3.1 头部绘制

```vue
<template>
    <div class="home-header">
        <img src="@/assets/logo.png" />
        <van-dropdown-menu>
            <van-dropdown-item :value="category" :options="categories" @change="change" />
        </van-dropdown-menu>
    </div>
</template>
<script>
export default {
    data() {
        return {
            category: 0,
            categories: [
                { text: '全部课程', value: 0 },
                { text: 'vue课程', value: 1 },
                { text: 'react课程', value: 2 },
            ]
        }
    },
    methods: {
        change(newVal) {
            this.category = newVal
        }
    }
}
</script>
<style lang="scss">
.home-header {
    background: $background;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2.5%;
    position: fixed;
    top: 0;
    left: 0;
    width: 95%;
    img {
        height: 50px;
    }
    .van-dropdown-menu__title {
        color: #fff;
    }
    .van-dropdown-menu__bar {
        background: $background;
    }
}
</style>
```

### 3.2 同步数据

```vue
<template>
    <HomeHeader v-model="currentCategory"></HomeHeader>
</template>
<script>
import HomeHeader from './home-header'
export default {
    data(){
        return {currentCategory:0}
    },
    components:{
        HomeHeader
    }
}
```

```vue
<template>
    <div class="home-header">
        <img src="@/assets/logo.png" />
        <van-dropdown-menu>
            <van-dropdown-item :value="value" :options="categories" @change="change" />
        </van-dropdown-menu>
    </div>
</template>
<script>
export default {
    props:{
        value:Number  
    },
    data() {
        return {
            categories: [
                { text: '全部课程', value: 0 },
                { text: 'vue课程', value: 1 },
                { text: 'react课程', value: 2 },
            ]
        }
    },
    methods: {
        change(newVal) {
            this.$emit('input',newVal);
        }
    }
}
</script>
```

## 4.vuex流程搭建

### 4.1 `vuex`实现模块化

```js
const files = require.context('.',true,/\.js$/);
const modules = {}
files.keys().forEach(key=>{
    const path = key.replace(/(\.\/|\.js)/g, '');
    if(path === 'index') return;
    const [namespace,type] = path.split('/');
    if(!modules[namespace]){
        modules[namespace] = {
            namespaced :true
        }
    }
    modules[namespace][type] = files(key).default;
})
export default modules
```

```bash
─home
    |-- state.js
    |-- actions.js
    |-- mutations.js
─profile
    |-- state.js
    |-- actions.js
    |-- mutations.js
─user
    |-- state.js
    |-- actions.js
    |-- mutations.js
```

```js
import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
Vue.use(Vuex)
export default new Vuex.Store({
  ...modules
})
```

### 4.2 设置分类

- `state.js` 设置`vuex`中的默认状态

```js
const state = {
    category:0
}
export default state;
```

- `action-types.js` 设置`action`类型

```js
export const SET_CATEGORIES = 'SET_CATEGORIES'; // 设置分类
```

- `mutations.js` 增加修改状态方法

```js
import * as Types from '@/store/action-types'
const mutations = {
    [Types.SET_CATEGORIES](state,payload){
        state.category = payload
    }
}
export default mutations
```

```vue
<template>
    <HomeHeader v-model="currentCategory"></HomeHeader>
</template>
<script>
import HomeHeader from './home-header';
import { createNamespacedHelpers } from 'vuex';
import * as Types from '@/store/action-types.js'
const { mapState,mapMutations } = createNamespacedHelpers('home');
export default {
    methods:{
        ...mapMutations([Types.SET_CATEGORIES]),
    },
    computed:{
        ...mapState(['category']),
        currentCategory:{
            get(){
                return this.category
            },
            set(val){
                this[Types.SET_CATEGORIES](val);
            }
        }
    },
    components: {
        HomeHeader
    }
}
</script>
```

## 5.轮播图实现

### 5.1 扩展`axios`

```js
import axios from 'axios';
class HTTP {
    constructor() {
        this.baseURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:7001' :
            '/';
        this.timeout = 3000;
        this.queue = {};
    }
    setInterceptor(instance, url) {
        instance.interceptors.request.use((config) => { // 请求拦截
            this.queue[url] = url;
            return config;
        }, err => {
            return Promise.reject(err);
        });
        instance.interceptors.response.use((res) => {
            delete this.queue[url];
            if (res.data.err === 0) {
                return res.data.data
            } else {
                return Promise.reject(res.data)
            }
        }, err => {
            delete this.queue[url];
            return Promise.reject(err);
        })
    }
    request(options) {
        let instance = axios.create();
        let config = {
            ...options,
            baseURL: this.baseURL,
            timeout: this.timeout
        }
        this.setInterceptor(instance, options.url);
        return instance(config);
    }
    post(url, data) {
        return this.request({
            method: 'post',
            url,
            data
        })
    }
    get(url, config = {}) {
        return this.request({
            method: 'get',
            url: url,
            ...config
        })
    }
}
export default new HTTP
```

### 5.2 接口封装

```js
import axios from "../utils/axios"
// 获取轮播图 
export const fetchSlides = () => axios.get('/api/slider');
```

### 5.3 `vuex`中同步接口数据

```js
const state = {
    category:0,
    slides: []
}
export default state;
```

```js
export const SET_SLIDES = 'SET_SLIDES' // 设置轮播图数据
```

```jsx
import * as Types from '@/store/action-types'
import { fetchSlides } from '@/api/home.js'
const actions = {
    async [Types.SET_SLIDES]({ commit }) {
        let slides = await fetchSlides();
        commit(Types.SET_SLIDES, slides);
    }
}
export default actions
```

```js
import * as Types from '@/store/action-types'
const mutations = {
    [Types.SET_SLIDES](state, slides) {
        state.slides = slides
      }
}
export default mutations
```

```vue
<van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
    <van-swipe-item v-for="(slide,index) in slides" :key="index">
        <img :src="slide.url"></van-swipe-item>
</van-swipe>
<script>
 mounted() {
     if (this.slides.length == 0) {
         this[Types.SET_SLIDES]();
     }
 }
</script>
```



# 项目实战 （一）

## 一.环境搭建

这里我先简单介绍下 `Vue-Cli`各个版本之间的不同。目前我们使用的是`Vue-cli4`版本,

`cli2`和`cli3`的区别很容易看出。整个构建目录的变化及`webpack`的升级，提升了构建项目速度也提供了`vue ui`等，这里主要对比下 `cli3`和`cli4`的区别:

[CHANGELOG](https://github.com/vuejs/vue-cli/blob/dev/CHANGELOG.md)

- `css`预处理器默认`sass`选项改为`dart sass`
- 更新项目中的版本 （`copy-webpack-plugin v5`、`webpack-chain v5`、`css-loader to v2`、`core-js v3` 、`ESLint v5`、`workbox v4`、`nightwatch v1`、`jest v24`...）
- 一些细节更新

> 总结一下主要就是很多依赖的模块都发生了重大的变化。

### 1.初始化

**安装最新的`Vue-cli4`**

```bash
$ npm install @vue/cli -g
```

1

**通过`vue ui`创建项目**

```bash
$ vue ui
```

1

> 添加`vuex`、添加`vue-router`、添加dart sass

**添加插件`element-ui`**:`vue-cli-plugin-element` (import on demand)

**添加依赖 `axios`**

**启动任务！！！**

### 2.配置目录

```bash
src
    │  App.vue     # 根组件
    │  main.js     # 入口文件
    ├─api          # 存放接口
    ├─assets       # 存放资源
    ├─components   # 组件
    ├─plugins      # 生成的插件
    ├─config       # 存放配置文件
    ├─router       # 存放路由配置
    ├─store        # 存放vuex配置
    ├─utils        # 存放工具方法
    └─views        # 存放Vue页面
```

## 二.路由系统配置

通过`require.context`实现路由模块拆分

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);
const routes = [];
const files = require.context('./', true, /\.router.js$/);
files.keys().forEach(key => {
  routes.push(...files(key).default)
});
const router = new VueRouter({
  mode: 'history',
  routes
});
export default router;
```

> 通过`require.context`动态导入路由模块，实现路由的模块化,这样我们可以对路由进行分类了 (这里不建议根据页面自动生成路由，这样项目整个太不灵活了)

**`index.router.js`**

```js
export default [{
    path: '/',
    component: () => import(/*webpackChunkName:'home'*/'@/views/Home.vue')
}, {
    path: '*',
    component: () => import(/*webpackChunkName:'404'*/'@/views/404.vue')
}]
```

**`user.router.js`**

```js
export default [{
        path: '/login',
        name: 'login',
        component: () => import( /*webpackChunkName:'login'*/ '@/views/user/Login.vue')
    },
    {
        path: '/reg',
        name: 'reg',
        component: () => import( /*webpackChunkName:'reg'*/ '@/views/user/Reg.vue')
    }
]
```

## 三. 布局绘制

通过布局组件进行布局

```html
<el-container>
	<el-header>头</el-header>
    <el-main>
    	<router-view></router-view>
    </el-main>
	<el-footer>尾</el-footer>
</el-container>

<style lang="scss">
* {margin: 0;padding: 0;}
img{max-width: 100%;}
.el-header,.el-footer{background: #333;color:#fff}
.el-main{ min-height: calc(100vh - 120px);}
</style>
```

页面中用到的组件需要手动导入注册

```js
import Vue from 'vue'
import { Button, Container, Footer, Header, Main } from 'element-ui'

const components = { Button, Container, Footer, Header, Main }
Object.entries(components).forEach(([key, component]) => {
    Vue.use(component)
});
```

### 1.封装导航组件

通过栅格化布局实现导航组件的划分

```html
<template>
  <el-row class="header-row">
    <el-col :span="18">
      <img src="@/assets/logo.png" class="logo" />
      <el-menu class="menu" mode="horizontal" background-color="#333" text-color="#fff"
        active-text-color="fff" :router="true"
      >
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/">发表文章</el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="6">
      <div class="nav-right">
        <el-menu
          class="el-menu-demo"
          mode="horizontal"
          background-color="#333"
          text-color="#fff"
          active-text-color="fff"
        >
          <el-menu-item index="login">
            <router-link to="/login">登录</router-link>
          </el-menu-item>
          <el-menu-item index="reg">
            <router-link to="/reg">注册</router-link>
          </el-menu-item>
          <el-submenu index="profile">
            <template slot="title">张三</template>
            <el-menu-item index="logout">退出登录</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </el-col>
  </el-row>
</template>
<style lang="scss">
.header-row {
  height: 100%;
  .logo { margin: 5px;height: 50px}
  .menu,.logo { display: inline-block;}
  .nav-right {
    float: right;
    li { display: inline-block;text-align: center;line-height: 60px;}
    a {color: #fff;}
  }
}
</style>
```

### 2.封装导航底部组件

```html
<template>
  <div class="footer-row">课程内容版权均归 珠峰架构课</div>
</template>
<style lang="scss">
.footer-row {line-height: 60px; text-align: center;}
</style>
```

### 3.页面结构

```html
<el-container style="min-width:960px;">
    <el-header>
        <PageHeader></PageHeader>
    </el-header>
    <el-main>
        <router-view></router-view>
    </el-main>
    <el-footer>
        <PageFooter></PageFooter>
    </el-footer>
</el-container>
```

> 引入我们编写的`PageHeader`、`PageFooter`组件

## 四.封装axios请求

`axios`是基于`promise`的`ajax`库，我们一般会设置一些默认属性和拦截器

```js
import axios from 'axios';
import { baseURL } from '@/config'
class Http {
    constructor(baseUrl) {
        this.baseURL = baseURL;
        this.timeout = 3000;
    }
    setInterceptor(instance) {
        instance.interceptors.request.use(config => {
            return config;
        });
        instance.interceptors.response.use(res => {
            if (res.status == 200) {
                return Promise.resolve(res.data);
            } else {
                return Promise.reject(res);
            }
        }, err => {
            return Promise.reject(err);
        });
    }
    mergeOptions(options) {
        return {
            baseURL: this.baseURL,
            timeout: this.timeout,
            ...options
        }
    }
    request(options) {
        const instance = axios.create();
        const opts = this.mergeOptions(options);
        this.setInterceptor(instance);
        return instance(opts);
    }
    get(url, config = {}) {
        return this.request({
            method: 'get',
            url: url,
            ...config
        })
    }
    post(url, data) {
        return this.request({
            method: 'post',
            url,
            data
        })
    }
}
export default new Http;
```

> 每次请求时通过`axios.create()`方法创建axios实例并增添拦截器功能。再次之上我们也再次封装get方法和post方法

## 五.Vuex配置

### 1.模块的基本配置

```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const rootModule = {
    state: {},
    mutations: {},
    actions: {},
    modules: {}
}
const files = require.context('./modules/', false, /\.js$/);
files.keys().forEach((key, index) => {
    let store = files(key).default;
    const moduleName = key.replace(/^\.\//, '').replace(/\.js$/, '');
    const modules = rootModule.modules || {};
    modules[moduleName] = store;
    modules[moduleName].namespaced = true;
    rootModule.modules = modules
});
const store = new Vuex.Store(rootModule);
export default store;
```

> 通过`require.context()`动态加载模块，实现store的状态分割

### 2.抽离根模块

```js
import Vue from 'vue'
import Vuex from 'vuex'
import rootModule from './root'; // 将rootModule单独拿到root文件夹中
Vue.use(Vuex)
```

## 六.前后端联调

### 1. 获取轮播图数据

后端接口:`http://localhost:3000/public/getSlider`

```js
export default {
    getSlider: '/public/getSlider' // 获取轮播图接口
}
```

> 抽离接口路径到`config`中,为了更方便的维护接口

```js
import config from './config/public';
import axios from '@/utils/request';
export const getSlider = (type) => axios.get(config.getSlider);
```

### 2.在`Vuex`中实现对应action

创造对应的`action-types`

```js
export const SET_SLIDERS = 'SET_SLIDERS';
```

```js
import { getSlider } from '../api/public';
import * as types from './action-types';
export default {
    state: {
        sliders: [],
    },
    mutations: {
        [types.SET_SLIDERS](state, sliders) {
            state.sliders = sliders;
        }
    },
    actions: {
        async [types.SET_SLIDERS]({ commit }) {
           let { sliders } = await getSlider();
           commit(types.SET_SLIDERS, sliders);
        }
    }
}
```

### 3.在组件中获取数据

```js
if (res.status == 200) {
    if(res.data.err == 0){ // 如果状态码是0 说明无错误
   	 	return Promise.resolve(res.data);
    }else{
    	return Promise.reject(res.data.data);
    }
}
```

> 我们在`axios`中统一处理错误

```js
import { mapActions, mapState } from "vuex";
import * as types from "@/store/action-types";
export default {
  computed: {
    ...mapState(["sliders"])
  },
  methods: {
    ...mapActions([types.SET_SLIDERS])
  },
  async mounted() {
    try{
      await this[types.SET_SLIDERS]();
    }catch(e){
      console.log(e);
    }
  }
};
```

> 这里我们可以通过辅助函数调用action，并将数据存储到state中。

### 4.渲染轮播图组件

```html
<div class="banner">
      <el-carousel :interval="4000" type="card" height="360px">
        <el-carousel-item v-for="item in sliders" :key="item._id">
          <img :src="item.url" />
        </el-carousel-item>
      </el-carousel>
</div>
```



# **项目实战** (二)

## 一.登录权限

### 1.用户注册模块实现

#### `API`接口定制

后端接口:`http://localhost:3000/public/reg`

```js
export default {
    reg:'/user/reg',
}
```

```js
import config from './config/user';
import axios from '@/utils/request';
export const reg = (options) => axios.post(config.reg,options);
```

#### 调用接口

```js
import * as user from '@/api/user.js'
submitForm(formName) {
    this.$refs[formName].validate(async valid => {
        if (valid) {
            try {
                await user.reg(this.ruleForm);
                this.$message({
                    type:'sucess',
                    message:'注册成功，请登录'
                });
                this.$router.push('/login');
            } catch (e) {
                this.$message({
                    type:'error',
                    message:e
                });
            }
        } else {
            return false;
        }
    });
}
```

### 2.验证码获取

后端接口:`http://localhost:3000/public/getCaptcha`

```text
export default {
    getSlider: '/public/getSlider', // 获取轮播图接口
    getCaptcha:'/public/getCaptcha' // 获取验证码
}
```

需要用户产生唯一标识，可以和验证码对应

```js
export const setLocal = (key, value) => {
    if(typeof value === 'object'){
        return localStorage.setItem(key,JSON.stringify(value));
    }
    localStorage.setItem(key, value);
}
export const getLocal = (key,isObject) => {
    if(isObject){
        return JSON.parse(localStorage.getItem(key)) || {}
    }
    return localStorage.getItem(key) || '';
}
```

> 封装`setLocal`和 `getLocal`本地存储方法

```js
import {getLocal} from '@/utils/local'
export const getCaptcha = () => axios.get(config.getCaptcha, {params: {
    uid:getLocal('uid')
}}); 
```

获取验证码并传入当前用户的唯一标识

```js
import {v4} from 'uuid';
import {setLocal,getLocal} from '@/utils/local';
import {getCaptcha} from '@/api/public.js'
export default {
	async mounted(){
      this.uid = getLocal('uid');
      if(!this.uid){
        setLocal('uid',v4())
      }
      this.getCaptcha();
    },
    methods: {
      async getCaptcha(){
        let {data} = await getCaptcha();
        this.verify = data;
      },
    }
}
```

> 页面加载时获取验证码，同样点击时也可以调用`getCaptcha`切换验证码

### 3.登录实现

后端接口:`http://localhost:3000/user/login`

```js
export default {
    login:'/user/login'
}
```

```js
export const login = (options) => axios.post(config.login, options);
```

#### `Vuex`存储用户信息

```js
// 设置用户信息
export const SET_USER = 'SET_USER'
// 用户登录
export const USER_LOGIN = 'USER_LOGIN';
// 设置以及获取权限
export const SET_PERMISSION = 'SET_PERMISSION'
```

> 定制要实现的功能

```js
import * as user from '@/api/user'
import * as types from '../action-types';
import { setLocal,getLocal } from '@/utils/local'
export default {
    state: {
        userInfo: {},
        hasPermission: false,
    },
    mutations: {
        [types.SET_USER](state, payload) {
            state.userInfo = payload;
            setLocal('token',payload.token);
        },
        [types.SET_PERMISSION](state, has) {
            state.hasPermission = has;
        }
    },
    actions: {
        async [types.SET_USER]({ commit, dispatch }, { payload, hasPermission }) {
            commit(types.SET_USER, payload);
            commit(types.SET_PERMISSION, hasPermission);
        },
        async [types.USER_LOGIN]({ dispatch }, userInfo) {
            let result = await user.login(userInfo);
            dispatch(types.SET_USER, {
                payload: result.data,
                hasPermission: true
            });
            return result;
        }
    }
}
```

#### **实现登录逻辑**

```js
import * as types from "@/store/action-types";
import { createNamespacedHelpers } from "vuex";
let { mapActions } = createNamespacedHelpers("user");
methods: {
    ...mapActions([types.USER_LOGIN]),
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try{
            let {data} = await this[types.USER_LOGIN]({...this.ruleForm,uid:this.uid});
            this.$router.push('/');
          }catch(e){
            this.$message({type:'error',message:e});
          }
        } else {
          alert("失败");
          return false;
        }
      });
    }
}
```

#### 用户菜单控制

```html
<template v-if="!hasPermission">
  <el-menu-item index="login">
    <router-link to="/login">登录</router-link>
  </el-menu-item>
  <el-menu-item index="reg">
    <router-link to="/reg">注册</router-link>
  </el-menu-item>
</template>
<el-submenu index="profile" v-else>
  <template slot="title">{{userInfo.username}}</template>
    <el-menu-item @click="$router.push('/manager')">管理后台</el-menu-item>
  <el-menu-item index="logout">退出登录</el-menu-item>
</el-submenu>
```

```js
import * as types from "@/store/action-types";
import { createNamespacedHelpers } from "vuex";
let { mapActions, mapState, mapMutations } = createNamespacedHelpers("user");
export default {
  computed: {
    ...mapState(["hasPermission", "userInfo"])
  },
};
```

### 4.验证是否登录

后端接口:`http://localhost:3000/user/validate`

```js
export default {
    validate: '/user/validate'
}
```

```js
export const validate = () => axios.get(config.validate);
```

```js
async [types.USER_VALIDATE]({ dispatch }) {
    if (!getLocal('token')) return false;
    try {
        let result = await user.validate();
        dispatch(types.SET_USER, {
            payload: result.data,
            hasPermission: true
        });
        return true;
    } catch (e) {
        dispatch(types.SET_USER, {
            payload: {},
            hasPermission: false
        });
    }
}
```

> 如果没有token返回false,之后通过token校验用户是否登录。

```js
[types.SET_USER](state, payload) {
    state.userInfo = payload;
    if (payload && payload.token) {
        setLocal('token', payload.token);
    } else {
        localStorage.clear('token');
    }
}
```

> 如果token被修改，验证登录失败，清除token信息.

### 5.路由钩子鉴权

遍历hook文件添加钩子方法

```js
import hooks from './hook'
Object.values(hooks).forEach(hook=>{
    router.beforeEach(hook.bind(router));
})
```

```js
import store from '../store';
import * as types from '../store/action-types';
const loginPermission = async function(to, from, next) {
    let flag = await store.dispatch(`user/${types.USER_VALIDATE}`);
    next();
}
```

```js
 config.headers.authorization = 'Bearer '+getLocal('token')
```

> 携带token

### 6.根据是否需要登录增加校验

```text
meta:{
    needLogin:true
}
```

> 给路由增添路由源信息

```js
const loginPermission = async function(to, from, next) {
    // 先判断是否需要登录
    let needLogin = to.matched.some(item => item.meta.needLogin);
    let flag = await store.dispatch(`user/${types.USER_VALIDATE}`);
    if (!store.state.user.hasPermission) {
        if (needLogin) { // 没权限需要登录,那就校验是否登陆过
            if (!flag) { // 没登陆过
                next('/login')
            } else {
                next();
            }
        } else { // 没权限不需要登录
            next();
        }
    } else {
        // 有权限
        if (to.path == '/login') {
            next('/');
        } else {
            next();
        }
    }
}
```

## 二.路由权限

```js
export const ADD_ROUTE  = 'ADD_ROUTE' // 添加路由动作
export const SET_MENU_PERMISSION = 'SET_MENU_PERMISSION' // 表示菜单权限已经拥有
```

```js
export const menuPermission = async function(to, from, next) {
    if (store.state.user.hasPermission) {
        if (!store.state.user.menuPermission) {
            store.dispatch(`user/${types.ADD_ROUTE}`);
            next({...to,replace:true});
        } else {
            next();
        }
    } else {
        next();
    }
}
```

> 根据用户返回的权限过滤需要的路由

```js
import router from '@/router/index'
import per from '@/router/per';
async [types.ADD_ROUTE]({ commit, state }) {
    let authList = state.userInfo.authList;
    if (authList) {
        // 开始 规划路由
        let routes = filterRouter(authList);
        let route = router.options.routes.find(item => item.path === '/manager');
        route.children = routes;
        router.addRoutes([route]);
        commit(types.SET_MENU_PERMISSION, true);
    }
}
```

> 过滤的当前用户支持的路由

```js
const filterRouter = (authList) => {
    let auths = authList.map(item => item.auth);
    const filter = (authRoutes) => {
        let result = authRoutes.filter(route => {
            if (auths.includes(route.meta.auth)) {
                if (route.children) {
                    route.children = filter(route.children);
                }
                return route;
            }
        })
        return result
    }
    return filter(per);
}
```

```js
[types.SET_MENU_PERMISSION](state, has) {
	state.menuPermission = has;
}
```

## 三.菜单权限

### 1.菜单权限的处理

针对不同的用户，提供不同的菜单。

#### 管理员权限

- 用户管理功能
- 用户统计功能
- 信息发布功能
- 文章管理功能

#### 普通用户权限

- 个人中心功能
- 我的收藏功能
- 私信消息功能
- 我的文章功能

```js
import { createNamespacedHelpers } from "vuex";
let { mapState } = createNamespacedHelpers("user");
export default {
    data() {
        return { menuList: [] };
    },
    mounted() {
        this.menuList = this.getMenList(this.userInfo.authList);
    },
    computed: {
        ...mapState(["userInfo"])
    },
    methods: {
        getMenList(authList) {
            let menu = [];
            let sourceMap = {};
            authList.forEach(m => {
                m.children = [];
                sourceMap[m.id] = m;
                if (m.pid === -1) {
                    menu.push(m);
                } else {
                    sourceMap[m.pid] && sourceMap[m.pid].children.push(m);
                }
            });
            return menu;
        }
    },
    render() { // 递归生成菜单
        let renderChildren = (data) => {
            return data.map(child => {
                return child.children.length ?
                    <el-submenu index={child._id}>
                        <div slot="title">{child.name}</div>
                        {renderChildren(child.children)}
                    </el-submenu> :
                    <el-menu-item index={child.path}>{child.name}</el-menu-item>
            })
        }
        return <el-menu
            background-color="#333"
            text-color="#fff"
            default-active={this.$route.path}
            router={true}
        >
            {renderChildren(this.menuList)}
        </el-menu>
    }
}
```

## 四.websocket封装

### 1.通过Vuex创建WebSocket

```js
export const CREATE_WEBSOCKET = 'CREATE_WEBSOCKET';
export const SET_MESSAGE = 'SET_MESSAGE';
```

> 当用户登录后，创建websocket对象

```js
export const createWebsocket = async function(to, from, next) {
    if (store.state.user.hasPermission && !store.state.ws) {
        store.dispatch(`${types.CREATE_WEBSOCKET}`);
        next();
    } else {
        next();
    }
}
```

```js
[types.CREATE_WEBSOCKET](state,ws){
    state.ws = ws;
}
async [types.CREATE_WEBSOCKET]({commit}){
    let ws = new WS();
    ws.create();
    commit(types.CREATE_WEBSOCKET,ws);
}
```

> 将websocket对象保存到vuex中，方便后续使用

### 2.WebSocket封装

- 实现监听消息
- 实现消息发送
- 实现心跳检测
- 实现断线重连

```js
import { getLocal } from './local'
import store from '@/store'
import * as types from '@/store/action-types';
class WS {
    constructor(config = {}) {
        this.url = config.url || 'localhost'
        this.port = config.port || 4000
        this.protocol = config.protocol || 'ws'
        this.time = config.time || 3000 * 10;
    }
    create() {
        this.wsc = new WebSocket(`${this.protocol}://${this.url}:${this.port}`);
        this.wsc.onopen = this.onOpen;
        this.wsc.onmessage = this.onMessage;
        this.wsc.onclose = this.onClose;
        this.wsc.onerror = this.onError
    }
    onOpen = () => {
        this.wsc.send(JSON.stringify({
            type: 'auth',
            data: getLocal('token')
        }))
    }
    onClose = () => {
        this.wsc.close()
    }
    send = (msg) => {
        this.wsc.send(JSON.stringify(msg));
    }
    onMessage = (e) => {
        var {type,data} = JSON.parse(e.data);
        switch (type) {
            case 'noAuth':
                console.log('没权限')
                break;
            case 'heartCheck':
                this.checkServer();
                this.wsc.send(JSON.stringify({ type: 'heartCheck'}))
                break;
            default:
                if(data === 'auth ok') return;
                store.commit(types.SET_MESSAGE,data)
        }
    }
    onError = () => {
        setTimeout(() => {
            this.create()
        }, 1000);
    }
    checkServer() {
        clearTimeout(this.handle);
        this.handle = setTimeout(() => {
            this.onClose();
            this.onError()
        }, this.time + 1000)
    }
}
export default WS;
```

### 3.存放WebSocket信息

```js
[types.SET_MESSAGE](state,msg){
	state.message = msg
}
```