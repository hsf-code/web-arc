---
title: vue项目优化1
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

## 一、SPA（单页应用）首屏加载速度慢怎么解决

## **一、什么是首屏加载**

首屏时间（First Contentful Paint），指的是浏览器从响应用户输入网址地址，到首屏内容渲染完成的时间，此时整个网页不一定要全部渲染完成，但需要展示当前视窗需要的内容

首屏加载可以说是用户体验中**最重要**的环节

### **关于计算首屏时间**

利用`performance.timing`提供的数据：

https://mmbiz.qpic.cn/mmbiz_jpg/gH31uF9VIibSTgK3iccibAVpO22icPkFkWFichmpicAIF8jLzEO26qLgW0Q34LJMdqkMVfJqDzxv1r6uWvC7dE2ibNCqA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

通过`DOMContentLoad`或者`performance`来计算出首屏时间

```
// 方案一：
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('first contentful painting');
});
// 方案二：
performance.getEntriesByName("first-contentful-paint")[0].startTime

// performance.getEntriesByName("first-contentful-paint")[0]
// 会返回一个 PerformancePaintTiming的实例，结构如下：
{
  name: "first-contentful-paint",
  entryType: "paint",
  startTime: 507.80000002123415,
  duration: 0,
};
```

## **二、加载慢的原因**

在页面渲染的过程，导致加载速度慢的因素可能如下：

- 网络延时问题
- 资源文件体积是否过大
- 资源是否重复发送请求去加载了
- 加载脚本的时候，渲染内容堵塞了

## **三、解决方案**

常见的几种SPA首屏优化方式

- 减小入口文件积
- 静态资源本地缓存
- UI框架按需加载
- 图片资源的压缩
- 组件重复打包
- 开启GZip压缩
- 使用SSR

### **减小入口文件体积**

常用的手段是路由懒加载，把不同路由对应的组件分割成不同的代码块，待路由被请求的时候会单独打包路由，使得入口文件变小，加载速度大大增加

https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibSTgK3iccibAVpO22icPkFkWFic7KlQCeMYxibncRHCrMxaT4QLgMTFZNjn11qNOp6v8fuBh6mTDWibkUrg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

在`vue-router`配置路由的时候，采用动态加载路由的形式

```
routes:[ 
    path: 'Blogs',
    name: 'ShowBlogs',
    component: () => import('./components/ShowBlogs.vue')
]
```

以函数的形式加载路由，这样就可以把各自的路由文件分别打包，只有在解析给定的路由时，才会加载路由组件

### **静态资源本地缓存**

后端返回资源问题：

- 采用`HTTP`缓存，设置`Cache-Control`，`Last-Modified`，`Etag`等响应头
- 采用`Service Worker`离线缓存

前端合理利用`localStorage`

### **UI框架按需加载**

在日常使用`UI`框架，例如`element-UI`、或者`antd`，我们经常性直接饮用整个`UI`库

```
import ElementUI from 'element-ui'
Vue.use(ElementUI)
```

但实际上我用到的组件只有按钮，分页，表格，输入与警告 所以我们要按需引用

```
import { Button, Input, Pagination, Table, TableColumn, MessageBox } from 'element-ui';
Vue.use(Button)
Vue.use(Input)
Vue.use(Pagination)
```

### **组件重复打包**

假设`A.js`文件是一个常用的库，现在有多个路由使用了`A.js`文件，这就造成了重复下载

解决方案：在`webpack`的`config`文件中，修改`CommonsChunkPlugin`的配置

```
minChunks: 3
```

`minChunks`为3表示会把使用3次及以上的包抽离出来，放进公共依赖文件，避免了重复加载组件

### **图片资源的压缩**

图片资源虽然不在编码过程中，但它却是对页面性能影响最大的因素

对于所有的图片资源，我们可以进行适当的压缩

对页面上使用到的`icon`，可以使用在线字体图标，或者雪碧图，将众多小图标合并到同一张图上，用以减轻`http`请求压力。

### **开启GZip压缩**

拆完包之后，我们再用`gzip`做一下压缩 安装`compression-webpack-plugin`

```
cnmp i compression-webpack-plugin -D
```

在`vue.congig.js`中引入并修改`webpack`配置

```
const CompressionPlugin = require('compression-webpack-plugin')

configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.mode = 'production'
            return {
                plugins: [new CompressionPlugin({
                    test: /\\.js$|\\.html$|\\.css/, //匹配文件名
                    threshold: 10240, //对超过10k的数据进行压缩
                    deleteOriginalAssets: false //是否删除原文件
                })]
            }
        }
```

在服务器我们也要做相应的配置 如果发送请求的浏览器支持`gzip`，就发送给它`gzip`格式的文件 我的服务器是用`express`框架搭建的 只要安装一下`compression`就能使用

```
const compression = require('compression')
app.use(compression())  // 在其他中间件使用之前调用
```

### **使用SSR**

SSR（Server side ），也就是服务端渲染，组件或页面通过服务器生成html字符串，再发送到浏览器

从头搭建一个服务端渲染是很复杂的，`vue`应用建议使用`Nuxt.js`实现服务端渲染

### **小结：**

减少首屏渲染时间的方法有很多，总的来讲可以分成两大部分 ：资源加载优化 和 页面渲染优化

下图是更为全面的首屏优化的方案

https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibSTgK3iccibAVpO22icPkFkWFicLEYAnF4rBV6bhWTKHKPib0K5pHAD8DdVX44PEKEhkOx0CDYZriawkHFg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

大家可以根据自己项目的情况选择各种方式进行首屏渲染的优化



## 一、新搭建一个 Vue 项目后，我有了这 15 点思考

## **1.分解需求**

### **技术栈**

- 考虑到后续招人和现有人员的技术栈，选择 Vue 作为框架。
- 公司主要业务是 GIS 和 BIM，通常开发一些中大型的系统，所以 vue-router 和 vuex 都是必不可少的。
- 放弃了 Element UI 选择了 Ant Design Vue（最近 Element 好像复活了，麻蛋）。
- 工具库选择 lodash。

### **建立脚手架**

- 搭建 NPM 私服。
- 使用 Node 环境开发 CLI 工具，参考我自己写过的一篇 -【 搭建自己的脚手架—“优雅”生成前端工程】。
- 基于 @vue/cli 搭建基础的模板（大家都比较了解，节省开发时间，远胜于从零开始搭建）。
- 根据业务需求定义各种开发中可能用到的功能（组件库、状态管理、过滤器、指令、CSS内置变量、CSS Mixins、表单验证、工具函数等）。
- 性能优化，例如对 Ant Design Vue 组件库的优化。

### **开发规范**

- 对代码风格、命名规则、目录结构进行统一规范。
- 静态资源的使用规范。
- 单元测试、提交线上测试规范。
- Git 提交记录和多人协作规范。

## **2.样式**

### **CSS 预处理器的选择**

- Sass/Scss ✅
- Less ✅
- Stylus ⭕

为什么选择了两个？因为公司团队跟倾向于使用 scss 开发，less 是为了覆盖 ant design vue 的样式，stylus 只有我自己喜欢这种风格。

### **局部样式与全局样式**

### **局部样式**

一般都是使用 scoped 方案：

```
<style lang="scss" scoped>
  ...
</style>
复制代码
```

### **全局样式**

全局样式 目录：@/styles

variable.scss: 全局变量管理 mixins.scss: 全局 Mixins 管理 global.scss: 全局样式

其中 variable.scss 和 mixins.scss 会优先于 global.css 加载，并且可以不通过 import 的方式在项目中任何位置使用这些变量和 mixins。

```
// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
        @import '@/styles/variable.scss';
        @import '@/styles/mixins.scss';
        `,
      },
    },
  },
}
复制代码
```

### **体验优化**

### **页面载入进度条**

使用 nprogress 对路由跳转时做一个伪进度条，这样做在网络不好的情况下可以让用户知道页面已经在加载了：

```
import NProgress from 'nprogress';

router.beforeEach(() => {
  NProgress.start();
});

router.afterEach(() => {
  NProgress.done();
});

复制代码
```

### **美化滚动条**

一直用 Mac 做前端，突然发现同事的 Windows 上出现了十分丑陋的滚动条，为了保持一致：

```
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  width: 6px;
  background: rgba(#101F1C, 0.1);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(#101F1C, 0.5);
  background-clip: padding-box;
  min-height: 28px;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(#101F1C, 1);
}
复制代码
```

### **静态资源加载页面**

首次加载页面时，会产生大量的白屏时间，这时做一个 loading 效果看起来会很友好，其实很简单，直接在 public/index.html 里写一些静态的样式即可。

### **移动端 100vh 问题**

在移动端使用 100vh 时，发现在 Chrome、Safari 浏览器中，因为浏览器栏和一些导航栏、链接栏导致不一样的呈现：

你以为的 100vh === 视口高度

实际上 100vh === 视口高度 + 浏览器工具栏（地址栏等等）的高度

### **解决方案**

安装 vh-check `npm install vh-check \\--save`

```
import vhCheck from 'vh-check';
vhCheck('browser-address-bar');
复制代码
```

定义一个 CSS Mixin

```
@mixin vh($height: 100vh) {
  height: $height;
  height: calc(#{$height} - var(--browser-address-bar, 0px));
}
复制代码
```

之后就是哪里不会点哪里。

## **3.组件库**

因为 Element UI 长期没更新，并且之前使用过 React 的 Ant Design（重点），所以组件库选择了Ant Design Vue。

### **覆盖 Ant Design Vue 样式**

设计师眼中的 Ant Design === '丑'（心酸）。

### **1.使用 .less 文件**

Ant Design Vue 的样式使用了 Less 作为开发语言，并定义了一系列全局/组件的样式变量，所以需要安装了 less、less-loader，在 `@/styles/antd-theme.less` 可以覆盖默认样式。

**优点是：**

方便快捷，可以修改 class，覆盖默认变量。

**缺点是：**

必须引入 `@import '~ant-design-vue/dist/antd.less';` ，引入后会将所有的组件样式全部引入，导致打包后的 css 体积达到 500kb 左右。

### **2.使用 JavaScript 对象**

通过 JavaScript 对象的方式可以修改内置变量，需要对 Less 进行配置：

```
// vue.config.js
const modifyVars = require('./src/styles/antdTheme.js');

module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars,
        },
      },
    },
  },
}
复制代码
```

这一步还可以继续优化，通过 babel-plugin-import 使 Ant Design Vue 的组件样式可以按需加载：

```
// babel.config.js
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  plugins: [
    [
      'import',
      { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: true },
    ],
  ],
};
复制代码
```

**优点是：**

可以按需引入，打包后的 CSS 体积取决于你引用了多少个组件。

**缺点是：**

不能使用 class 进行样式覆盖。

### **干掉无用的图标**

Ant Design Vue 把所有的 Icon 一次性引入（不管你因用了多少个组件），这使得体积打包后图标所占的体积竟然有几百 kb 之多。这些图标大多数不会被设计师所采纳，所以部分图标都应该被干掉：

创建一个 icons.js 来管理 Ant Design Vue 图标，这里以一个 Loading 图标为例：

```
// @/src/assets/icons.js
export { default as LoadingOutline } from '@ant-design/icons/lib/outline/LoadingOutline';
复制代码
```

**如何知道你要加载的图标在什么路径下？**

在 @ant-design/icons/lib 目录下有三种风格的图标，分别是 fill、outline、twotone，这里面内部的文件并不是 svg 格式，而是 js 和 ts 格式，这就是为什么我们可以这么引入图标的关键所在了。

下一步是通过配置 vue.config.js 将这个文件引入进来：

```
// vue.config.js
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@ant-design/icons/lib/dist$': path.resolve(__dirname, './src/assets/icons.js'),
      },
    },
  },
}
复制代码
```

### **解决 Moment 多国语**

解决到这之后，Ant Design Vue 居然还很大，这是因为 moment 是 Ant Design Vue 中有强依赖该插件，所以使用 webpack 插件减小打包体积，这里我们只保留 zh-cn 语言包：

```
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config
      .plugin('ContextReplacementPlugin')
      .use(webpack.ContextReplacementPlugin, [/moment[/\\\\]locale$/, /zh-cn/]);
  },
}
复制代码
```

### **部分组件需要在页面内引用**

Ant Design Vue 中部分体积较大的组件，例如 `DatePicker`，根据业务需求，应考虑在页面中进行加载，尽量保证首屏加载的速度：

```
<script>
import { DatePicker } from 'ant-design-vue';
export default {
  components: {
    ADatePicker: DatePicker,
  },
}
</script>
复制代码
```

## **4.静态资源与图标**

### **静态资源**

所有的静态资源文件都会上传到 阿里云 OSS 上，所以在环境变量上加以区分。

`.env.development` 与 `.env.production` 的 `VUE_APP_STATIC_URL` 属性分别配置了本地的静态资源服务器地址和线上 OSS 的地址。

本地的静态资源服务器是通过 pm2 + http-server 创建的，设计师切完直接扔进来就好了。

### **自动注册 Svg 图标**

在日常的开发中，总是会有着大量的图标需要使用，这里我们直接选择使用 SVG 图标。但是如果每次使用图标还需要通过路径找到这张图标岂不是很麻烦？

下面这种才是我想要的方案（直接 name 等于 文件名即可）：

```
<template>
	<svg name="logo" />
</template>
复制代码
```

而且最后打包后需要合并成一张雪碧图。

首先需要对 `@/assets/icons` 文件夹下的 svg 图标进行自动注册，需要对 webpack 和 svg-sprite-loader 进行了相关设置，文件全部打包成 svg-sprite。

```
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end();

    config.module
      .rule('icons')
      .test(/\\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader');
  },
}
复制代码
```

写一个全局用的 Vue 组件 `<m-svg />`:

// @/components/m-svg/index.js

```
const requireAll = (requireContext) => requireContext.keys().map(requireContext);
const req = require.context('@/assets/icons', false, /\\.svg$/);
requireAll(req);
复制代码
```

@/components/m-svg/index.vue

```
<template>
  <svg class="mw-svg" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>
<script>
export default {
  name: 'm-svg',
  props: {
    name: { type: String, default: '' },
  },
  computed: {
    iconName() {
      return `#${this.name}`;
    },
  },
};
</script>
<style lang="scss" scoped>
.mw-svg {
  width: 1.4em;
  height: 1.4em;
  fill: currentColor;
  overflow: hidden;
  line-height: 1em;
  display: inline-block;
}
</style>
复制代码
```

参数 name

- 类型：String
- 默认值：null
- 说明：放置在 `@/assets/icons` 文件夹下的文件名

样式

- 图标的大小可以通过 width + height 属性改变。
- 通过改变 font-size 属性改变，宽高 = font-zise * 1.4

## **5.异步请求**

### **封装 Axios**

在 `@/libs/request.js` 路径下对 Axios 进行封装，封装了请求参数，请求头，以及错误提示信息、 request 拦截器、response 拦截器、统一的错误处理、baseURL 设置等。

废话不说直接贴代码：

```
import axios from 'axios';
import get from 'lodash/get';
import storage from 'store';
// 创建 axios 实例
const request = axios.create({
 // API 请求的默认前缀
 baseURL: process.env.VUE_APP_BASE_URL,
 timeout: 10000, // 请求超时时间
});

// 异常拦截处理器
const errorHandler = (error) => {
 const status = get(error, 'response.status');
 switch (status) {
   /* eslint-disable no-param-reassign */
   case 400: error.message = '请求错误'; break;
   case 401: error.message = '未授权，请登录'; break;
   case 403: error.message = '拒绝访问'; break;
   case 404: error.message = `请求地址出错: ${error.response.config.url}`; break;
   case 408: error.message = '请求超时'; break;
   case 500: error.message = '服务器内部错误'; break;
   case 501: error.message = '服务未实现'; break;
   case 502: error.message = '网关错误'; break;
   case 503: error.message = '服务不可用'; break;
   case 504: error.message = '网关超时'; break;
   case 505: error.message = 'HTTP版本不受支持'; break;
   default: break;
   /* eslint-disabled */
 }
 return Promise.reject(error);
};

// request interceptor
request.interceptors.request.use((config) => {
 // 如果 token 存在
 // 让每个请求携带自定义 token 请根据实际情况自行修改
 // eslint-disable-next-line no-param-reassign
 config.headers.Authorization = `bearer ${storage.get('ACCESS_TOKEN')}`;
 return config;
}, errorHandler);

// response interceptor
request.interceptors.response.use((response) => {
 const dataAxios = response.data;
 // 这个状态码是和后端约定的
 const { code } = dataAxios;
 // 根据 code 进行判断
 if (code === undefined) {
   // 如果没有 code 代表这不是项目后端开发的接口
   return dataAxios;
 // eslint-disable-next-line no-else-return
 } else {
   // 有 code 代表这是一个后端接口 可以进行进一步的判断
   switch (code) {
     case 200:
       // [ 示例 ] code === 200 代表没有错误
       return dataAxios.data;
     case 'xxx':
       // [ 示例 ] 其它和后台约定的 code
       return 'xxx';
     default:
       // 不是正确的 code
       return '不是正确的code';
   }
 }
}, errorHandler);

export default request;
复制代码
```

- 通过 VUE_APP_BASE_URL 区分线上与开发环境的 API 地址。
- code 起到一个比较关键的作用，例如 token 过期时的验证。
- 使用了一个叫 sotre 的包作为本地储存的工具用来存储 token。

### **跨域问题**

跨域问题一般情况直接找后端解决了，你要是不好意思打扰他们的话，可以用 devServer 提供的 proxy 代理：

```
// vue.config.js
devServer: {
  proxy: {
    '/api': {
      target: '<http://47.100.186.132/your-path/api>',
      ws: true,
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}
复制代码
```

### **Mock 数据**

一个很常见的情况，后端接口没出来，前端在这干瞪眼。

Mock 数据功能是基于 mock.js (opens new window)开发，通过 webpack 进行自动加载 mock 配置文件。

### **规则**

- 所有的 mock 配置文件均应放置在 `@/mock/services` 路径内。
- 在 `@/mock/services` 内部可以建立业务相关的文件夹分类存放配置文件。
- 所有的配置文件应按照 `**.mock.js` 的命名规范创建。
- 配置文件使用 ES6 Module 导出 `export default` 或 `export` 一个数组。

### **入口文件**

```
import Mock from 'mockjs';

Mock.setup({
  timeout: '500-800',
});

const context = require.context('./services', true, /\\.mock.js$/);

context.keys().forEach((key) => {
  Object.keys(context(key)).forEach((paramKey) => {
    Mock.mock(...context(key)[paramKey]);
  });
});
复制代码
```

### **示例模板**

```
import Mock from 'mockjs';

const { Random } = Mock;

export default [
  RegExp('/example.*'),
  'get',
  {
    'range|50-100': 50,
    'data|10': [
      {
        // 唯一 ID
        id: '@guid()',
        // 生成一个中文名字
        cname: '@cname()',
        // 生成一个 url
        url: '@url()',
        // 生成一个地址
        county: Mock.mock('@county(true)'),
        // 从数组中随机选择一个值
        'array|1': ['A', 'B', 'C', 'D', 'E'],
        // 随机生成一个时间
        time: '@datetime()',
        // 生成一张图片
        image: Random.dataImage('200x100', 'Mock Image'),
      },
    ],
  },
];
复制代码
```

## **6.路由**

### **Layout**

布局暂时分为三大类：

- frameIn：基于 `BasicLayout`，通常需要登录或权限认证的路由。
- frameOut：不需要动态判断权限的路由，如登录页或通用页面。
- errorPage：例如404。

### **权限验证**

通过获取当前用户的权限去比对路由表，生成当前用户具的权限可访问的路由表，通过 router.addRoutes 动态挂载到 router 上。

- 判断页面是否需要登陆状态，需要则跳转到 /user/login
- 本地存储中不存在 token 则跳转到 /user/login
- 如果存在 token，用户信息不存在，自动调用 vuex '/system/user/getInfo'

在路由中，集成了权限验证的功能，需要为页面增加权限时，在 meta 下添加相应的 key：

### **auth**

- 类型：Boolean
- 说明：当 auth 为 true 时，此页面需要进行登陆权限验证，只针对 frameIn 路由有效。

### **permissions**

- 类型：Object
- 说明：permissions 每一个 key 对应权限功能的验证，当 key 的值为 true 时，代表具有权限，若 key 为 false，配合 `v-permission` 指令，可以隐藏相应的 DOM。

在这里贴一下路由跳转时权限验证的代码：

```
import router from '@/router';
import store from '@/store';
import storage from 'store';
import util from '@/libs/utils';

// 进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const loginRoutePath = '/user/login';
const defaultRoutePath = '/home';

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 进度条
  NProgress.start();
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (to.matched.some((r) => r.meta.auth)) {
    // 是否存有token作为验证是否登录的条件
    const token = storage.get('ACCESS_TOKEN');
    if (token && token !== 'undefined') {
      // 是否处于登录页面
      if (to.path === loginRoutePath) {
        next({ path: defaultRoutePath });
        // 查询是否储存用户信息
      } else if (Object.keys(store.state.system.user.info).length === 0) {
        store.dispatch('system/user/getInfo').then(() => {
          next();
        });
      } else {
        next();
      }
    } else {
      // 没有登录的时候跳转到登录界面
      // 携带上登陆成功之后需要跳转的页面完整路径
      next({
        name: 'Login',
        query: {
          redirect: to.fullPath,
        },
      });
      NProgress.done();
    }
  } else {
    // 不需要身份校验 直接通过
    next();
  }
});

router.afterEach((to) => {
  // 进度条
  NProgress.done();
  util.title(to.meta.title);
});
复制代码
```

### **页面开发**

- 根据业务需要划分，按照路由层级在 views 中创建相对应的页面组件，以文件夹的形式创建，并在文件夹内创建 index.vue 文件作为页面的入口文件。
- 页面内的组件：在页面文件夹下创建 components 文件夹，在其内部对应创建相应的组件文件，如果是复杂组件，应以文件夹的形式创建组件。
- 工具模块：能够高度抽象的工具模块，应创建在 @/src/libs 内创建 js 文件。

## **7、构建优化**

### **包分析工具**

构建代码之后，到底是什么占用了这么多空间？靠直觉猜测或者使用 webpack-bundle-analyzer。

```
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer');

module.exports = {
  chainWebpack: (config) => {
    if (process.env.use_analyzer) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(WebpackBundleAnalyzer.BundleAnalyzerPlugin);
    }
  },
};
复制代码
```

### **开启 Gzip**

对，这这么一句话，后端就得支持你的 .gz 文件了，而你只需要坐着等老板夸：

```
chainWebpack: (config) => {
  config
    .plugin('CompressionPlugin')
    .use(CompressionPlugin, []);
},
复制代码
```

### **路由懒加载**

这块 @vue/cli 已经帮忙处理好了，但也需要了解一下他的原理和如何配置。

```
{
  path: 'home',
  name: 'Home',
  component: () => import(
    /* webpackChunkName: "home" */ '@/views/home/index.vue'
  ),
},
复制代码
```

webpackChunkName 这条注释还是很有必要加的，至少你打包后知道又是哪个页面变得又臭又大。

### **Preload & Prefetch**

不清楚这两个功能的去 @vue/cli 补课，这两个功能非常有助于你处理加载的性能。

## **8.测试框架**

直接使用了官方提供的 Vue Test Utils，这东西可以对组件进行测试，很不错。

写单元测试在团队里其实很难推进，不知道大家怎么看。

## **9.组件库**

对于很多第三方的工具，我坚持认为二次封装成 vue 插件并没有多少开发成本，反而让你在后续的开发中变得很灵活。

我对以下库进行了 vue 插件的封装，并提交到 npm 私服：

- 数字动画
- 代码高亮
- 大文件上传（切片、断点续传、秒传）需要与后端配合
- 图片预览
- Excel 导入导出
- 富文本编辑器
- Markdown 编辑器
- 代码编辑器

> 大文件上传有兴趣的可以留言，我后续单独拎出来详细的写一下这块。

## **10.Vuex**

内置一些功能，主要是对以下这些功能做了一些封装：

- 用户信息管理（储存信息、对 token 进行操作等）
- 登陆（调接口）
- 菜单管理（储存路由信息，生成菜单，模糊查询等功能）
- UA信息
- 全屏操作
- Loading
- 日志管理（消息提醒、日志留存、日志上报）

## **11.过滤器**

过滤器是 Vue 提供的一个很好用的功能，听说 vue3 没了？

```
{{ message | capitalize }}
复制代码
```

我写了几个常用的过滤器：

- 日期时间
- 剩余时间
- 区分环境的链接（主要针对本地静态资源服务器和 OSS ）
- 文件大小
- 数字金额
- 浮点型精度

## **12.指令**

自定义指令可以提供很好的帮助：

- 组件权限验证
- 文本复制
- 快捷键绑定
- 滚动至指定位置
- 图片懒加载
- 焦点

## **13.开发规范**

### **ESLint**

不管是多人合作还是个人项目，代码规范都是很重要的。这样做不仅可以很大程度地避免基本语法错误，也保证了代码的可读性。

这里我们采用了 Airbnb JavaScript Style Guide。

这套规范给我的感觉就是 **很严谨**！

### **CSS 规范**

### **降低选择器复杂性**

浏览器读取选择器，遵循的原则是从选择器的右边到左边读取。

```
#block .text p {
 color: red;
}
复制代码
```

- 查找所有 P 元素。
- 查找结果 1 中的元素是否有类名为 text 的父元素
- 查找结果 2 中的元素是否有 id 为 block 的父元素

### **选择器优先级**

> 内联 > ID选择器 > 类选择器 > 标签选择器

- 选择器越短越好。
- 尽量使用高优先级的选择器，例如 ID 和类选择器。
- 避免使用通配符 *。

### **使用 flexbox**

在早期的 CSS 布局方式中我们能对元素实行绝对定位、相对定位或浮动定位。而现在，我们有了新的布局方式 flexbox，它比起早期的布局方式来说有个优势，那就是性能比较好。不过 flexbox 兼容性还是有点问题，不是所有浏览器都支持它，所以要谨慎使用。 各浏览器兼容性：

- Chrome 29+
- Firefox 28+
- Internet Explorer 11
- Opera 17+
- Safari 6.1+ (prefixed with -webkit-)
- Android 4.4+
- iOS 7.1+ (prefixed with -webkit-)

### **动画性能优化**

在 CSS 中，transforms 和 opacity 这两个属性更改不会触发重排与重绘，它们是可以由合成器（composite）单独处理的属性。

### **属性值**

- 当数值为 0 - 1 之间的小数时，建议省略整数部分的 0。
- 当长度为 0 时建议省略单位。
- 建议不使用命名色值。
- 建议当元素需要撑起高度以包含内部的浮动元素时，通过对伪类设置 clear 或触发 BFC 的方式进行 clearfix。尽量不使用增加空标签的方式。
- 除公共样式之外，在业务代码中尽量不能使用 !important。
- 建议将 z-index 进行分层，对文档流外绝对定位元素的视觉层级关系进行管理。

### **字体排版**

- 字号应不小于 12px（PC端）。
- font-weight 属性建议使用数值方式描述。
- line-height 在定义文本段落时，应使用数值。

### **Vue 代码规范**

### **常规**

- 当在组件中使用 data 属性的时候 (除了 new Vue 外的任何地方)，它的值必须是返回一个对象的函数 `data() { return {...} }`。
- prop 的定义应该尽量详细，至少需要指定其类型。
- 布尔类型的 attribute， 为 true 时直接写属性值。
- 不要在computed中对vue变量进行操作。
- 应该优先通过 prop 和事件进行父子组件之间的通信，而不是 this.$parent 或改变 prop。
- 在组件上总是必须用 key 配合 v-for，以便维护内部组件及其子树的状态。
- v-if 和 v-for 不能同时使用
- 公共方法尽量不要挂到原型上, 可以写在 utils 文件，也可以使用 mixin 文件。不要将业务公共组件注册到全局。
- 不要将任何第三方插件挂载到 vue 原型上。
- 具有高度通用性的方法，要封装到 libs、全局组件或指令集里。
- 为组件样式设置作用域。
- 尽量使用指令缩写。

### **vuex**

State (opens new window)为单一状态树，在 state 中需要定义我们所需要管理的数组、对象、字符串等等，只有在这里定义了，在 vue 的组件中才能获取你定义的这个对象的状态。

- 修改 `state` 中数据必须通过 `mutations`。
- 每一个可能发生改变的 `state` 必须同步创建一条或多条用来改变它的 `mutations`。
- 服务端获取的数据存放在 `state` 中，作为原始数据保留，不可变动。

Getters (opens new window)有点类似 vue.js 的计算属性，当我们需要从 store 的 state 中派生出一些状态，那么我们就需要使用 getters，getters 会接收 state 作为第一个参数，而且 getters 的返回值会根据它的依赖被缓存起来，只有 getters 中的依赖值（state 中的某个需要派生状态的值）发生改变的时候才会被重新计算。

- 通过 `getters` 处理你需要得到的数据格式，而不是通过修改 `state` 原始数据。
- 组件内不强制使用 `mapGetters`，因为你可能需要使用 `getter` 和 `setter`。
- 改变 `state` 的唯一方法就是提交 mutations (opens new window)。
- 组件内使用 `mapMutations` 辅助函数将组件中的 `methods` 映射为 `store.commit` 调用。
- 命名采用 `大写字母` + `下划线` 的规则。
- 定义 `CLEAR`，以确保路由切换时可以初始化数据。

Actions

- 页面重的数据接口尽量在 actions (opens new window)中调用。
- 服务端返回的数据尽量不作处理，保留原始数据。
- 获取到的数据必须通过调用 `mutations` 改变 `state`。

Modules

- 通常情况下按照页面划分 modules (opens new window)。
- 默认内置了 `system` 保证了脚手架的基础功能。
- 每个页面模块或页面的子模块添加属性 `namespaced: true`。

## **14.完成详细的使用文档**

不论是功能还是组件库等等的工具，都需要完善的文档提供查阅，即使是轮子的构建者，也抵不住时间长了会忘记许多细节。

这里我使用 vuepress 构建文档，方便快捷。

参考【拯救懒癌文档君 - VuePress + Travis CI + Github Pages 自动线上生成文档】

## **15.Git 多人协作流程**

公司使用内部搭建的 GitLab 托管代码

### **Root 仓库**

项目启动时，由项目管理者搭建起最原始的仓库，称为 Root 仓库（源仓库）。

源仓库的有个作用 :

- 汇总参与该项目的各个开发者的代码。
- 存放趋于稳定和可发布的代码。
- 向 Master 分支提交 Merge Requests 可以触发测试环境构建（CI/CD）。
- 源仓库是受保护的，开发者不可直接对其进行开发工作。

### **开发者仓库**

任何开发者都没有权限对 Root 仓库进行直接的操作，源仓库建立以后，每个开发者需要做的事情就是把源仓库的 Fork 一份，作为自己日常开发的仓库。

- 每个开发者所Fork的仓库是完全独立的，互不干扰。
- 每个开发者提交到代码到自己的仓库中，开发工作完成以后，开发者可以向源仓库发送 Pull Request ，本地仓库先合并源仓库，解决冲突。
- 发起 Merge Request 请求管理员把自己的代码合并到源仓库中的 master 或 其他分支。

### **Git 流程**

https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHqJia2NlR65RIQ4cibNOUQb5DpicPxV1f9Bwkav1Bf0oJo4wgrCrySqFFdb7k4qPssPKicA2icTmCWZ63w/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

- 前端项目会在 `Root` 仓库下创建 `dev` 分支，用于代码的拉取和合并，如果有多个不同的测试环境，按照测试环境创建分支。
- 在本地的仓库中创建你的 `dev` 分支和其他功能性的分支。
- 开发过程中不允许直接在 `master` 分支上开发，创建一个新的分支进行开发，`git checkout –b {branch_name}`。
- 规范且详细的书写 `commit` ，推荐使用 `git-cz` 工具进行提交。
- 完成开发后将相应的分支合并到自己仓库的 `master` 分支。
- 将 `master` 分支 `push` 到自己的远程仓库（Fork仓库）。
- 向 `Root` 仓库 `dev` 分支提交 `Merge Requests`。
- 提醒前端负责人审查代码、解决冲突或测试环境上线。
- 解决冲突后 `git pull upstream dev` 拉取解决后的最新代码。



## 一、Vue 团队开发的一些基本配置

## **简介**

本篇文章主要带来的是 `vue 基础架构` 篇，大家都知道， `Vue3.0` 后 `Vue2.0` 会有一个终结版出来，也就说明 `Vue` 迎来了新时代，但是并不是所有项目都能够一起迈向新时代的轮船。本文主要是承接上篇优化的技巧文章做一个续篇吧，这个续篇主要是针对团队开发相关的东西，相关插件和库只是微微带过，如果本文能够推动你们的生产线，就点个赞吧。

> 配置相关类的可以去搜索对应的分享贴，或者看我之前的文章，本文内容较为贴合团队开发，非工具链分享文，大部分都能引发一些技术层面的思考。

## **前言**

在很多时候，对于 `vue` 项目来说，很多刚入门，或者是受业务妥协的朋友大都是从百度`CV` 一套看得过去的架子，如常见的 `D2Admin` ， `vue-element-admin` ，进行一个二次迭代的开发，其项目本身非常的优质，而在其 `template` 中去进行一个更改能够使得项目在一开始有一个很好的基础环境，但是如果没有花时间去琢磨透其中三分明细。在后续排雷来说，无疑是非常的困难的，因此大部分前端团队都会重构出自己的一套基础脚手架封装，有通过`webpack`进行处理的，也有基于 `VueCli` 打造的，最终都是自身团队的财产，从技术分享都细分实践都能给团队的小伙伴或多或少带来一些开发上面的便利。对后续团队人员的变动也能快速的投入生产当中。

## **做了什么？**

- 基本 HTTP 请求封装
- 约定式 HTTP 请求管理
- Mmixin 数据管理
- jsdoc 项目文档
- log 异常处理
- 组件和页面管理
- 常用的指令
- 使用 sass 还是 scss？
- @mixin 和 %placeholder
- eslint

## **基本 HTTP 请求做了什么?**

### **错误处理**

在这里选用的是现如今兼容性比较好的 `axios` ，可以说是比较好的一个请求库，相比于 `fetch` 来说，两者各有优势，（我已经开始使用 `fetch` ）。这一部分其实无非就是封装一些公共调用时需要处理的行为，如：`token` ， `请求拦截` ， `响应拦截` ， `错误码约定` ， `异常上报` ，`中间件` 等一系列基础的行为模式。

如下实例，当 `HTTP` 请求出现错误的时候，首先通过 `getEnv` 获取当前的开发环境，如果是`dev(开发环境下)` 只做一个简单的 `console.log`，非开发环境下，则是上报进行异常监听，对于前后端来说都

```
function handleError ( error, msg) {
  if (getEnv() === 'dev') {
    tools.log.danger('>>>>>> HTTP Error >>>>>>')
    console.log(error, msg)
  } else {
    Store.dispatch('logs/push', {
      message: msg,
      type: 'danger'
    })
  }
}
```

### **RESTFul**

相对于一些拦截器来说，都非常的简单，需要注意的无非就是根据团队的一些规范制定一些规则，如常见的 `code` 码等方法，大部分情况下，如无意外，99% 的接口都是请求成功的，但因为特殊性，内部会有一个 `code` 的状态来定义正反向。同样的，在操作接口时，一些状态也是需要和接口的请求方式同步，参考如下：

- GET: 200 OK
- POST: 201 Created
- PUT: 200 OK
- DELETE: 204 No Content

现如今大部分的接口的规范都使用 `RESTful` ，如果不知道 `RESTful` 是什么，可以看看 `@阮一峰` 的文章来初步了解。RESTful API 最佳实践 @阮一峰的网络日志

### **状态码机制**

同样的

```
code
```

中我们也自定义日常开发中的一些状态码，当我们需要用到

```
第三方API
```

的时候，前后端都需要快速的定位是自身服务的问题，还是其他服务（例如中台）的问题，因此对接服务我们都自定义了一些

```
code
```

来陈述这一类错误的处理。可以参考如下，这些其实都是创建在一个对象当中的：

https://mmbiz.qpic.cn/mmbiz_png/5Xv0xlEBe9ib478QQ4s6JHm3hx1LJ1EQq12fGMkDTJBOO6KwlAicfhfO65Ck0ksg37jw2Al8hibGQ4GwhoPaPswbA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

自定义 code

[Untitled](https://www.notion.so/989d7ed1cfa24a0faae2ab2eab129d2f)

当我们细化一些异常时，这时候是可以划分的非常细致的，这里给出微信的一些参考：

[Untitled](https://www.notion.so/288fdfa8bacd424d8483024a5c26caec)

```
function createHttpService (settings) {
  const service = Axios.create(settings)
  service.interceptors.request.use(
    config => {

      const token = localStorage.getItem('access_token')
      config.headers.token = token
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  service.interceptors.response.use(
    response => {
      console.log(response)
      const { code, message, data } = response.data

      if (code >= 30000) {
        console.log('>>> 自定义错误信息，全局提示处理', message)
        return data
      }

      if (code >= 200 && code < 300) {
        return data
      }

      if (code >= 300 && code < 600) {
        return Promise.reject(response.data)
      }
    },
    error => {
      const { status = 404 } = error?.response
      if (Object.prototype.hasOwnProperty.call(codeMessage, status)) {
        handleError(error, codeMessage[status])
      }
      throw error
    }
  )
  return service
}

const http = createHttpService({
  withCredentials,
  timeout,
  baseURL
})
```

## **约定式 http 请求**

看过我上几篇文章的文章大家都大致清楚，约定式请求可以很好的简化请求封装的复杂度，同样的当你公司存在小白或者是实习生的话，对于请求的拆封是没有考虑的，当你交付一个任务，完成并不是等于较为好的完成。

约定式除了减少新手开发者在团队中不稳定的代码因素的同时，也减少了开发时一个个的写`AxiosPromise` 函数的重复行为。下面是一个基本的接口约定，在 `login-api.js` 下写的文件，都将被映射成为 `请求函数`

```
export default {
  getPerson: 'GET /person',
  setPerson: 'POST /person',
  updatePerson: 'PUT /person/:id',
  deletePerson: 'DELETE /person/:id'
}
```

如

```
log.js
```

打印的结果，团队开发人员不需要关注函数本身，只需要关注调用。同时，

```
开发环境下
```

所有的接口信息都会通过

```
console.table
```

输出到控制台，在没有很好的类型推导的情况下，依旧可以快速的调用对应接口来获取后端数据。

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

> 本身 api 函数拆分出来，其实都是一个重复的工作，对开发者成长是毫无意义的。

### **不同的调用方式**

为了统一的调用，也适当的给出了两种使用方式，大多数场景下使用都是通用的，第一种方式较为的保守，其本质上是交由成员来处理任务，实例：

```
<script>

import { useServices } from 'framework'

const { getPerson } = useServices()

export default {
  name: 'home',
  created () {

    getPerson().then(res => {
      console.log(res)
      alert('接口请求成功')
    }, err => {
      console.log(err)
      alert('接口请求失败')
    })
  }
}
</script>
```

上述实例非常的简单，相信有一点基础的同学都可以看得出来，第一种方法非常的普遍，适用于大多数人群，但是弊端也很明显，如果每一个接口都需要做一次 `then & catch & finally` 的话无疑是一个灾难，因此第二种方法诞生了，对于新手来说，更加的友好。如下实例：

```
<script>

import { useServices } from 'framework'

const Admin = {
  created () {
    this.getPersonData()
  },
  methods: {

    async getPersonData () {
      const [, err] = await useServices('getPerson')
      if (err) {
        alert('接口请求失败')
      } else {
        alert('接口请求成功')
      }
    }
  }
}
export default Admin
</script>
```

在原先 api 的基础上， `useServices` 为 `Promise` 的行为包裹了一层中间件，当你决定使用非常态请求时，这个 `promise中间件` 行为会被触发。且将 `Promise` 后的结果形态抽象成为了一个数组返回出来，那么在逻辑块中，我们只需要简单的通过 `async & await` 对结果中的数据进行处理，而不必关注无意义的 `try catch` 和 `then catch` 。

> 兼容两种方式的原因是不同开发者不同习惯问题，有些时候开发者认为，错误的处理还是交由处理人去解决，从而达到错误解决目的。

## **Mixin 数据管理 (model)**

有了约定式的请求，很统一的解决我们请求的问题，但随之而来的就是异步数据的管理问题，很长一段时间中，Vue 开发者都习惯性的将接口请求，数据逻辑处理放在 vue 文件中，比如最常见的 `分页表格数据` ， `基础表单显示`，每一个页面中都声明了非常多的 `total` ，`pageSize` ， `currentPage` ，`tableData` 等字段，并且乐此不疲的反复 CV，结束忙碌的一天后美滋滋觉得今天又完成了 10 多个页面。其实细心的同学也发现了，不管你 CV 多少次代码，对自身的提升是有限度的，无非就是孰能生巧，复制粘贴的速度更加快了，就好比你写了 4000 次 `hello` 不代表你有了 4000 个词汇一般。

因此就产生了封装自己的表格组件，只需要传递很小一部分参数进去（如 HTTP 请求方法），就可以达到渲染表格的实现。同样的，也有小伙伴们封装了 `Global Mixin` 来解决这部分的任务。同样的，为了很好的管理数据层，我也在尝试不同的数据管理，随着业务逻辑增大，大部分的页面的异步数据都难以管理，或多或少会和页面的逻辑数据混淆，过一段时间后，需要将`$data` 中的数据解构重新梳理，才能泡通逻辑。

因此，在尝试不同的解决方案后， `mixin` 成了首当其冲的方案，它并不像 `vuex` 一般会在全局生效，而只对混入的页面生效，所以在简单的尝试后，对 mixin 进行了包装，抽象成为了一个 `model` 层，这个 `model` 层的作用主要是处理菜单级页面的异步数据的流向打造的，视图页面数据在 `.vue` 中声明， `后端数据` 在 `model.js` 中。

一个基本的 model.js 它看起来是这样的

```
export default {
  namespace: 'Home',
  state: {
    move: {},
    a: 1,
    b: 2
  },
  actions: {

    async setUser (state, { payload, set }) {
      const data = await test()
      await set(state, 'move', data)
      return state.move
    }
  }
}

const test = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        user: 'wangly',
        age: 21
      })
    }, 2000)
  })
}
```

那么在页面中，声明的组件都会被传入到 `useModels` 中进行混入，混入后的 `Mixin` 命名格式已经比较复杂了，这个时候来使用的就不是当前的 `this.xxx` ，而是统一执行 `this.useDispatch` 进行处理，并没有直接去触发 `model methods` ，同样的对所有的 `model` 状态都在发生改变，内部会有不同的 loading。

### **一个简单的实例**

通过一个简单的实例来模拟一次服务端数据加载，从无到有的过程，纯 `model.js` 控制数据和状态 通过下面 test 模拟一个数据接口，在 `getDesserts` 进行获取，为了保证阅读质量，模拟的数据就截断了，可以参考 vuetifyUI Table Demo 数据。

```
export default {
  namespace: 'Admin',
  state: {
    mockTabData: [],
    headers: [
      { text: 'Dessert (100g serving)', value: 'name' },
      { text: 'Calories', value: 'calories' },
      { text: 'Fat (g)', value: 'fat' },
      { text: 'Carbs (g)', value: 'carbs' },
      { text: 'Protein (g)', value: 'protein' },
      { text: 'Iron (%)', value: 'iron' }
    ]
  },
  actions: {

    async getDesserts (state, { payload, set }) {
      const data = await test()
      console.log(data)
      if (data) {
        state.mockTabData = data
      }
    }
  }
}

const test = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%'
        },

      ])
    }, 2000)
  })
}
```

在页面中，在 `created` 钩子中，通过调用 `this.useDispatch('Admin/getDesserts')` 进行数据获取，然后将 `Admin.headers` ， `Admin.mockTabData` 赋值到对应的组件参数上去，同时通过 `当前model` 方法的副作用进行骨架屏的控制。

> 所有的 model 方法都会在 data 中生成一个副作用状态，为避免冲突，data 中避免定义 model ，以免被 model.js 覆盖。

```
<template>
  <div>
    <v-data-table
      v-if="!model['Admin/getDesserts']"
      :headers="Admin.headers"
      :items="Admin.mockTabData"
    ></v-data-table>
    <v-sheet v-else>
      <v-skeleton-loader :boilerplate="false" type="table"></v-skeleton-loader>
    </v-sheet>
  </div>
</template>

<script>
import { useModels } from 'framework'

const Admin = {
  created () {
    this.useDispatch('Admin/getDesserts')
  }
}
export default useModels(Admin, ['Admin'])
</script>
```

看看效果把，非常的简单的控制数据响应变化：

https://mmbiz.qpic.cn/mmbiz_gif/5Xv0xlEBe9ib478QQ4s6JHm3hx1LJ1EQqZTBaDQE6qciceqCvAJSzW4XaM9EEOx6F3xnM7Z2JyNspfZ9VwDCrP1A/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1

> 该特性实验中，只作为参考。性能压测还在进行中 QAQ。

## **jsDoc 项目文档**

项目文档是一个非常重要的事情，不要过度相信自己的代码，如果业务大的话，3 个月左右的时间，你经手的项目可能就会丢失一部分直观的记忆，这个时候不论是你继续维护还是新人继续维护都是一件非常头疼的事情，同时需要考虑的是当项目进行到一般，后面有新人加入的时候，庞大的 `components` ， `utils` ， `api` 都会让新人感到无从下手的感觉，因此一份文档就显得格外珍贵了。那么有同学问了，我业务都忙不过，还要花时间整理文档，其他人的事情关我什么事？

一个好的项目必然会有一个好的文档，基于这类问题，所以才引入了一个文档工具来生成文档，在这个期间，也同时的对文档进行了改进，更加的贴合 `vue` 本身，首先就是对文档语法 `@module` 进行了改造，同时通过 `@page` 来声明页面，通过 `@component` 声明公共组件，如下示例：

```
<template>
  <div>2222</div>
</template>

<script>
import { useModels, useServices } from 'framework'

const Admin = {
  created () {
    this.getPersonData()
  },
  data: () => ({

    discount: false,

    currentTab: 1
  }),
  methods: {

    async getPersonData () {
      const [, err] = await useServices('getPerson')
      if (err) {
        alert('接口请求失败')
      } else {
        alert('接口请求成功')
      }
    }
  }
}
export default useModels(Admin, ['Admin'])
</script>
```

那么最终通过 `yarn doc` 命令生成文档：

> yarn doc

效果看上去是下面这样的

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

可以看到，现在的一些注释就已经很规范了，但依旧不完美，主要因素是来自于

```
jsdoc
```

文档的主题问题，如果团队需要的话，可以自己重构一套出来，也相对来说简单。

> 文中实例仅限参考，注释文档请移步：jsdoc

## **自定义开发日志 log**

对于 `console` 的使用，当时在看 `D2Admin` 的时候将其克隆了一份过来，对于抛错的日志来说，我们并不需要将自身的一些 `consle` 也进行收集，但是 `console` 之间也存在等级，如果通过 `console.error` 进行的话，可能会被捕捉从而传入给后台，因此，重写了一份 log.js 用于开发版和测试版的调试使用。

```
const log = {}

function typeColor (type = 'default') {
  let color = ''
  switch (type) {
    case 'default':
      color = '#303133'
      break
    case 'primary':
      color = '#409EFF'
      break
    case 'success':
      color = '#67C23A'
      break
    case 'warning':
      color = '#E6A23C'
      break
    case 'danger':
      color = '#F56C6C'
      break
    default:
      break
  }
  return color
}

log.capsule = function (title, info, type = 'primary') {
  console.log(
    `%c ${title} %c ${info} %c`,
    'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
    `background:${typeColor(
      type
    )}; padding: 1px; border-radius: 0 3px 3px 0;  color:#fff;`,
    'background:transparent'
  )
}

log.colorful = function (textArr) {
  console.log(
    `%c${textArr.map(t => t.text || '').join('%c')}`,
    ...textArr.map(t => `color: ${typeColor(t.type)};`)
  )
}

log.default = function (text) {
  log.colorful([{ text }])
}

log.primary = function (text) {
  log.colorful([{ text, type: 'primary' }])
}

log.success = function (text) {
  log.colorful([{ text, type: 'success' }])
}

log.warning = function (text) {
  log.colorful([{ text, type: 'warning' }])
}

log.danger = function (text) {
  log.colorful([{ text, type: 'danger' }])
}

export default log
```

如下图效果：

```
log.default('>>> 我是一些默认提示')
log.primary('>>> 我是一些标记提示')
log.success('>>> 我是一些成功提示')
log.warning('>>> 我是一些警告提示')
log.danger('>>> 我是一些错误提示')
```

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

## **组件和页面管理**

在开发过程中，同样养成一些好习惯对于项目体验会有很好的帮助，写代码就和针线活一样，细心谨慎，逻辑分明才能学到更多，减少 `P0 BUG` 的出现，如果你项目不赶，还一直出现同一个问题，感官是非常差的。因此，牢记以下小技巧，希望对你有帮助

### **页面文件**

在这里推荐所有的页面级别都放在一个树下，目录菜单使用文件夹且默认视图为

```
index.vue
```

，名称都为小写驼峰，最好是一句小写涵盖如：

```
home
```

，

```
user
```

。等等，组件统一放在起始页面的

```
components
```

下，且名称为大驼峰带模块名，如

```
Admin
```

下的

```
Header
```

组件为

```
AdminHeader.vue
```

，使用时则为：

```
<admin-header/>
```

，引入时，统一使用

```
@/views/admin/components/xxx
```

引入。菜单在深都是在一级菜单下的东西，带上页面名称是为了更好的区分，防止组件混淆。

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

### **方法导出**

很多时候，不同的团队成员在编写 `utils` 时，有使用箭头函数，也有使用 `function` 来声明的，因此，在这里推荐统一使用 `export function` 的形式进行 `js` 的声明，如下方法：

```
import asyncAxiosInstance from '@/plugin/createService'
import currentModels from '@/plugin/createModel'

export function getEnv () {
  return process.env.VUE_APP_MODE || 'dev'
}

export function useModels (component, models, isDispatch = true) {
  const current = []
  currentModels.forEach(item => {
    if (models.includes(item.name)) {
      current.push(item.mixin)
    }
  })
  if (isDispatch && current.length > 0) {
    current.push(currentModels[0].mixin)
  }
  console.log(current)
  if (component?.mixins) {
    const preMixin = component.mixins
    component.mixins = current.concat(preMixin)
    return component
  }
  component.mixins = [...current]
  console.log(component)
  return component
}
```

## **常用的指令**

日常开发中，一些指令能够达到事半功倍的效果，但是指令需要贴合业务进行，同时设计者在设计时，同样需要标注文档，方便团队成员查看。下面的一些指令推荐在进行注册掉：

- v-click-outside 外部点击指令：当点击非绑定元素会进行元素隐藏
- v-intersect 元素监视器：检测元素在用户视图中是否可见
- v-resize 缩放监听器：窗口进行缩放时的监听指令
- v-scroll 滚动监视器：可以灵活观察绑定的元素滚动变化
- v-touch 触控监视器：可以灵活监视移动端当中的触摸行为，并产生回调
- v-auth 权限监视器：重写自 `v-permission` 主要做按钮级别权限校验和页面权限校验

> 指令资源

## **使用 SASS 还是 SCSS？**

现如今最好的 `CSS扩展语言` 依旧是 `SASS` 和 `LESS` ，两者大差不差，可以根据团队需要进行更换，使用起来没有啥差别。在开发项目中，对于 `SASS` 我是首先推荐的（非 SCSS），如果没有熟悉使用 `SASS` 的同学会觉得非常反人类，但如果你的规范好的话，我想你可以看下下面的这段 `SASS` 代码：

```
@mixin flex ($mod: flex, $justifyContent: center, $alignItems: center, $direction: initial)
  display: $mod
  justify-content: $justifyContent
  align-items: $alignItems
  flex-direction: $direction
// end flex mixin ...
```

在写 CSS 时，都建议在末尾加上一段 `end` 注释来作为逻辑符号的完成，用于区分样式块的代码，防止逻辑混乱，当大量的样式维护较差时，我想 `SCSS` 给的安全感是比较高的，同理，当维护的好的时候， `SASS` 无疑是更加简洁。当然也容易出错。

> 两者殊途同归，可以根据团队成员习惯选择。

## **@mixin 和 %placeholder**

首先， `@mixin` 适合用来写一些具有逻辑性的 `css` ，如最基本的 `flex` ，可以通过传递的 `params` 进行不同的设置，这是 `%placeholder` 欠缺的，但是 `%placeholder` 在静态样式的继承上，可以减少重复 `css` 的调用，减少重复代码，运用的多数场景为：`基本卡片样式` ， `统一的组件样式` 等设计稿无偏差的时候使用，因此不需要无脑使用 `@mixin` ，有时候`%placeholder` 更香。

使用一个实例进行比对：

```
%demo
  color: red
  font-size: 20px
  border: 1px solid red
 // end ...

.test1
  @extend %demo
// end ...

.test2
  @extend %demo
// end ...

.test3
  @extend %demo
复制代码
```

如上代码，使用 `%placeholder` 最终会生成的样式是下面这样的：

```
.test1, .test2, .test3 {
  color: red
  font-size: 20px
  border: 1px solid red
}
```

而如果换成 `@mixin` ，他们的结果是这样的：

```
@mixin demo()
  color: red
  font-size: 20px
  border: 1px solid red
// end ...

.test1
  @include demo()
// end ...

.test2
  @@include demo()
// end ...

.test3
  @@include demo()
// end ...
```

编译后：

```
.test1 {
  color: red
  font-size: 20px
  border: 1px solid red
}
.test2 {
  color: red
  font-size: 20px
  border: 1px solid red
}
.test3 {
  color: red
  font-size: 20px
  border: 1px solid red
}
```

> 不用我说，你应该知道怎么用了吧。

## **ESLint**

理想的情况下，大部分前端团队都会存在有 `Eslint` ，作为一个代码质量的标准，但也仅仅只是一个标准，配合 `Git Commit` 前置动作可以执行代码检阅是否合格来防止低于标准的代码提交到存储库中，这一个动作需要开发者自身养成良好的编码习惯和代码质量意识。

如果使用的是

```
VS CODE
```

那么就需要在编译器中进行配置来开启规则检查，当违背了语法警告的同时，会提示如下警告：

https://mmbiz.qpic.cn/mmbiz_png/5Xv0xlEBe9ib478QQ4s6JHm3hx1LJ1EQquUAIOvEM0VARV2RFNtTRZTSQNVNvWg1iblVEgtr0liaY5K2J9PyVu8rw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

> 不推荐直接 commit 时直接编译化代码，Eslint 是帮助开发者代码成长的，而不是一个表面功夫的工具。

## **源码和资源**

> jsDoc: 立即前往源码地址：立即前往vuetifyjs：立即前往model 管理数据思考：点击前往api 约定式: 点击前往