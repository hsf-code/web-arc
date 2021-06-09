---
title: vue（一）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

#### 12 vue3.0 用过吗 了解多少

- 响应式原理的改变 Vue3.x 使用 Proxy 取代 Vue2.x 版本的 Object.defineProperty
- 组件选项声明方式 Vue3.x 使用 Composition API setup 是 Vue3.x 新增的一个选项， 他是组件内使用 Composition API 的入口。
- 模板语法变化 slot 具名插槽语法 自定义指令 v-model 升级
- 其它方面的更改 Suspense 支持 Fragment（多个根节点）和 Protal（在 dom 其他部分渲染组建内容）组件，针对一些特殊的场景做了处理。基于 treeshaking 优化，提供了更多的内置功能。

Vue3.0 新特性以及使用经验总结 传送门[5]

#### 13 Vue3.0 和 2.0 的响应式原理区别

Vue3.x 改用 Proxy 替代 Object.defineProperty。因为 Proxy 可以直接监听对象和数组的变化，并且有多达 13 种拦截方法。

相关代码如下

```
import { mutableHandlers } from "./baseHandlers"; // 代理相关逻辑
import { isObject } from "./util"; // 工具方法

export function reactive(target) {
  // 根据不同参数创建不同响应式对象
  return createReactiveObject(target, mutableHandlers);
}
function createReactiveObject(target, baseHandler) {
  if (!isObject(target)) {
    return target;
  }
  const observed = new Proxy(target, baseHandler);
  return observed;
}

const get = createGetter();
const set = createSetter();

function createGetter() {
  return function get(target, key, receiver) {
    // 对获取的值进行放射
    const res = Reflect.get(target, key, receiver);
    console.log("属性获取", key);
    if (isObject(res)) {
      // 如果获取的值是对象类型，则返回当前对象的代理对象
      return reactive(res);
    }
    return res;
  };
}
function createSetter() {
  return function set(target, key, value, receiver) {
    const oldValue = target[key];
    const hadKey = hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (!hadKey) {
      console.log("属性新增", key, value);
    } else if (hasChanged(value, oldValue)) {
      console.log("属性值被修改", key, value);
    }
    return result;
  };
}
export const mutableHandlers = {
  get, // 当获取属性时调用此方法
  set, // 当修改属性时调用此方法
};
复制代码
```

#### 21 谈一下对 vuex 的个人理解

vuex 是专门为 vue 提供的全局状态管理系统，用于多个组件中数据共享、数据缓存等。（无法持久化、内部核心原理是通过创造一个全局实例 new Vue）

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/gMvNo9rxo404ejQQIePEviaYwUyBQwOZrtlVsM6Mdm3MgVIhwNspfyOEnajibPTeXAZsK8KI54zPwyU1dV8De6Pw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)主要包括以下几个模块：

- State：定义了应用状态的数据结构，可以在这里设置默认的初始状态。
- Getter：允许组件从 Store 中获取数据，mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性。
- Mutation：是唯一更改 store 中状态的方法，且必须是同步函数。
- Action：用于提交 mutation，而不是直接变更状态，可以包含任意异步操作。
- Module：允许将单一的 Store 拆分为多个 store 且同时保存在单一的状态树中。

#### 22 Vuex 页面刷新数据丢失怎么解决

需要做 vuex 数据持久化 一般使用本地存储的方案来保存数据 可以自己设计存储方案 也可以使用第三方插件

推荐使用 vuex-persist 插件，它就是为 Vuex 持久化存储而生的一个插件。不需要你手动存取 storage ，而是直接将状态保存至 cookie 或者 localStorage 中

#### 23 Vuex 为什么要分模块并且加命名空间

**「模块」**:由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块。

**「命名空间」**：默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应。如果希望你的模块具有更高的封装度和复用性，你可以通过添加 namespaced: true 的方式使其成为带命名空间的模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。

#### 24 使用过 Vue SSR 吗？说说 SSR

SSR 也就是服务端渲染，也就是将 Vue 在客户端把标签渲染成 HTML 的工作放在服务端完成，然后再把 html 直接返回给客户端。

**「优点：」**

SSR 有着更好的 SEO、并且首屏加载速度更快

**「缺点：」** 开发条件会受到限制，服务器端渲染只支持 beforeCreate 和 created 两个钩子，当我们需要一些外部扩展库时需要特殊处理，服务端渲染应用程序也需要处于 Node.js 的运行环境。

服务器会有更大的负载需求

# Jenkins 帮你自动布署 Vue 项目

### 实现目标 

本地push代码到GitHub，Webhook自动触发jenkins上的构建动作,完成安装node插件并且打包，然后通过Publish Over SSH插件，将打包出来的文件，部署到目标服务器上。

### 前期准备

1. github 账号和项目
2. centos 服务器;
3. 服务器安装 Java SDK;
4. 服务器安装 nginx + 启动；
5. 服务器安装jenkins + 启动；

### jenkins介绍

Jenkins是开源的,使用Java编写的持续集成的工具，在Centos上可以通过yum命令行直接安装。Jenkins只是一个平台，真正运作的都是插件。这就是jenkins流行的原因，因为jenkins什么插件都有。

#### 首先登录服务器更新系统软件

```
$ yum update
```

#### 安装Java和git

```
$ yum install java
$ yum install git
```

#### 安装nginx

```
$ yum install nginx //安装
$ service nginx start //启动
```

出现Redirecting to /bin/systemctl start nginx.service

说明nginx已经启动成功了，访问http://你的ip/，如果成功安装会出来nginx默认的欢迎界面



![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1er4kPMWhbGibor8mFnKVbqrJkc6rJ5CAdYY5L87JiaRRvUdbLxzla9y8Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image



#### 安装Jenkins

```
$ wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat/jenkins.repo
rpm --import https://jenkins-ci.org/redhat/jenkins-ci.org.key 

$ yum install jenkins //完成之后直接使用 yum 命令安装 Jenkins

$ service jenkins restart  //启动 jenkins
```

jenkins启动成功后默认的是8080端口，浏览器输入你的服务器 ip 地址加8080 端口就可以访问了。



![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1er4kPMWhbGibor8mFnKVbqrJkc6rJ5CAdYY5L87JiaRRvUdbLxzla9y8Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image



输入 cat /var/lib/jenkins/secrets/initialAdminPassword 查看初始密码

这里我们选择推荐通用插件安装即可，选择后等待完成插件安装以及初始化账户



![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)image

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)image

![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1e0jDcdnYRxA7QhlibBz3R6WfNaFTRLe36fnpeM2fwqMVgc1z0gdFj1PA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image



然后安装两个推荐的插件 Rebuilder
SafeRestart

### 在jenkins中安装nodeJs插件

因为我们的项目是要用到node打包的，所以先在jenkins中安装nodeJs插件，安装后进入全局工具配置，配置一个我们要用到的node版本。



![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1eapkpA1DAPupE1DMGtnhkictiaEViaujiaiaP3RqovTSMkPJjEibK87ZaS8JA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image

![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1e0mA8PF1HbNP1ykfRiaViaxsqk9I2NjFOHro3mDdiaXMtxqw8K3rR75uFw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image



### 创建任务

1. 点击创建一个新任务



![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1eWialic3WXEHto7icjibrJibnPYlNkDIWmicRmlP8W2yFema94yRWZXJSpOlg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image

![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1eqAWVr2A0IaRWPZRt3ExwicO3CpeXAJX205te1VJFXr43uMsqzxHblYw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image



1. jenkins关联 GitHub项目地址



![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1e07HdkSCqyyWhDDWuIiaddicxvgqyxIRRQHzgInD6m36Uiaicr6DiaVEE6Yg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image



1. 选择构建环境并编写shell 命令



![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1eZUx3SasBdITpQkbENAq5icq830TXiccfIZQZ0p75fUib42n6W36r2O9uw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image



配置完成后点击立即构建，等待构建完，点击工作空间，可以发现已经多出一个打包后的dist目录。点击控制台输出可以查看详细构建log



![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1eVNe8Yx8eeCRNDopU8BYzo6icXOWOzkmkRMW6G75NfSyNQ30lPqviaEuQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image

![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1eDCvPQEQQKhI2FkNOSyK3pDII3XAOiaiciaia8y6eKr4jibKq13pBibQI0Wibw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image

![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1e9nkv0HAkzgj2Mr7wLeUNAicCiceRlvhgvsrDJqrKLh3fhpnEicv9pJ7xA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image



到这里已经实现了本地代码提交到github，然后在jenkins上点击构建，可以拉取代码并且打包，下一步实现打包后的dist目录放到目标服务器上。

### 安装Publish Over SSH 插件，我们将通过这个工具实现服务器部署功能。

安装完成后在系统管理-> 系统设置->Publish over SSH
里设置服务器信息

```
Passphrase：密码（key的密码，没设置就是空）
Path to key：key文件（私钥）的路径
Key：将私钥复制到这个框中(path to key和key写一个即可)

SSH Servers的配置：
SSH Server Name：标识的名字（随便你取什么）
Hostname：需要连接ssh的主机名或ip地址（建议ip）
Username：用户名
Remote Directory：远程目录（上面第二步建的testjenkins文件夹的路径）

高级配置：
Use password authentication, or use a different key：勾选这个可以使用密码登录，不想配ssh的可以用这个先试试
Passphrase / Password：密码登录模式的密码
Port：端口（默认22）
Timeout (ms)：超时时间（毫秒）默认300000
```

这里配置的是账号密码登录，填写完后点击test，出现Success说明配置成功



![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1ejficXADwRDyic0LP20kTs2qGdqJpCvSqIXWZHl1LxomyEh2zib3r7qAxQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image



在刚才的testJenkins工程中配置**构建后操作**，选择send build artificial over SSH， 参数说明：

```
Name:选择一个你配好的ssh服务器
Source files ：写你要传输的文件路径
Remove prefix ：要去掉的前缀，不写远程服务器的目录结构将和Source files写的一致
Remote directory ：写你要部署在远程服务器的那个目录地址下，不写就是SSH Servers配置里默认远程目录
Exec command ：传输完了要执行的命令，我这里执行了进入test目录,解压缩,解压缩完成后删除压缩包三个命令
```

注意在构建中添加压缩dist目录命令



![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1eCharJSiamWibibBgPUPPHPmeWvAOoFf2k2Zx51tccoJDMibtRzznYib6SdA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image



填完后执行构建。成功后登录我们目标服务器发现test目录下有了要运行的文件



![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1ewzjty88rJbn7r4v8cqarlAsZibZW4fjzDRRrYEI5hre4zpZvHsgMMbA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image



访问域名发现项目可以访问了



![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1eiccjjzNseTY6JqbD4IUu88dxdXYKTMK6V7feO1meSvtnhFeYFASjlaw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image



接下来实现开发本地push代码到github上后，触发Webhook，jenkins自动执行构建。

1. jenkins安装Generic Webhook Trigger 插件
2. github添加触发器

### 配置方法

1.在刚才的testJenkins工程中点击构建触发器中选择Generic Webhook Trigger，填写token



![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1eRgygrqgPrhJW8nzYkeicnsql3qfKvyODYObyB1OYWEvktqH4jKR1icXg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image



2.github配置Webhook
选择github项目中的Settings->Webhooks>add webhook
配置方式按上图红框中的格式，选择在push代码时触发webhook，成功后会在下方出现一个绿色的小勾勾



![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1e1JfiaZZPicj6UEMVpsg3AD5SYGtyK5RfT1ANC4ASDRict9Uvrq7SHTP6A/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image



测试一下，把vue项目首页的9900去了，然后push代码去github，发现Jenkins中的构建已经自动执行，



![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1e5CABEDm2lGeWW8317eLcKxjK7DznN6H9Gib4YeQdOpT6D2w8tGrztrw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image



查看页面也是ok的



![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQRNQpor2DVnHiaa4bFUoYI1evH2ybp2rtbXeHKYXHxnoTLFvoe2WIPnw43I8svibu9R9W9tpicpvl3cA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image



一套简单的前端自动化工作流就搭建完成，是选择代码push后在Jenkins中手动构建，还是push后自动构建，看公司情况使用

