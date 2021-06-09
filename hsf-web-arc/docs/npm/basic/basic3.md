---
title: 搭一个私有Npm仓库
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

### **什么是私有Npm仓库**

开局一张图

https://mmbiz.qpic.cn/mmbiz_png/1NOXMW586uv8DM8OtK16Ku36vKBiaIuhiayFhgdRXZQvkwKY8WepF0nsibZEzgcKFBP8uVqavMcJI3vE1bqgo2Blw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

从图中我们可以看到User到Npm中间多了一层`private package storage`, 也就意味着如果我们使用了私有的Npm, 当我们在执行 `npm i` 的时候会先经过`private`这一层, 检查当前模块是否是我们的私有模块，或者是已经被我们缓过的模块，如果是则直接返回给用户，否则则前往上游服务器，在这里也就是Npm仓库去拉取模块再返给用户

### **从应用场景谈起**

> 不解决业务痛点的技术都是耍流氓

日常开发中, 多个项目中多个模块可以抽成公共模块的例子多不胜数, 如果不抽成公共模块，那就只能CV大法，维护跟扩展都是异常肉疼

这时有同学会提问，发布成Npm包不就完事了吗？额，是的，只要你的BOSS不拿铅笔刀架你脖子上就行

我们常规操作发布的包是公开的(当然Npm也提供私有化付费服务)，相当于所有人都能看到你这个包里的内容并取之用之, 如果是跟业务强相关的显然不适合

这时候私有Npm服务登场

从上面图及应用场景我们先总结一下私有Npm的优势

- 安全性(布署在内网，资产安全性高)
- 复用性，开发效率，版本管理(立足之根本)
- 下载速度提升
- 技术资产积累

### **私有Npm有哪些**

一些主流的方案, 可以结合团队实现情况进行决择

- Npm 付费服务
- Sinopia: https://github.com/rlidwka/sinopia (不再维护)
- Verdaccio: https://verdaccio.org (基于Sinopia)
- cnpm: https://cnpmjs.org

### **回到主题**

我们选择的是Verdaccio，摘一句来自gayhub的简介

> A lightweight private npm proxy registry

### **动起手来**

1. 安装`npm install -g verdaccio`

2. Run`verdaccio`

3. Show 按照提示我们打开`http://localhost:4873/`, 界面还不错, 清爽

   https://mmbiz.qpic.cn/mmbiz_png/1NOXMW586uv8DM8OtK16Ku36vKBiaIuhiabBEyibmXOBzfqU65RIBLIQ7Y9PaTNKa2VlHQZk6Q7jRDlM88Ca1WHjA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

这个过程不要太简单，So easy, 布署到服务器也是一样，加一个进程守护就OK,  如: `pm2 start verdaccio`, 再加一个Nginx Proxy即可

布署好后，其它的操作就跟Npm一致了，如`addUser` , `publish`

帅编使用的Docker布署, 也很简单，这里顺带一嘴，目录结构如下

```
.
├── config // verdaccio 配置存放目录
├── docker-compose.yml // docker-compose 配置文件
├── plugins // verdaccio 插件存放目录
├── readme.md
└── storage // 模块缓存目录
```

### **咱们再看一眼`docker-compose.yml`配置**

```
version: '3.4'

services:
  verdaccio:
    image: verdaccio/verdaccio
    container_name: "verdaccio-vueclub"
    networks:
      - node-network
    environment:
      - VERDACCIO_PORT=4873
    ports:
      - "4873:4873"
    volumes:
      - "./storage:/verdaccio/storage"
      - "./config:/verdaccio/conf"
      - "./plugins:/verdaccio/plugins"
networks:
  node-network:
    driver: bridge
```

Docker基础知识大家可以去看官网，这里唯一值得一提的就是volumes(数据卷), 在上面配置里的意思就是将当前目录下的几个文件挂载到容器中对应的位置

### **verdaccio 配置**

verdaccio 配置很人性化，这里只用到一小部分，更多的可以移步官网了解 `https://verdaccio.org/`

```
storage: /verdaccio/storage
auth:
  htpasswd:
    # 存放用户信息的文件
    file: /verdaccio/conf/htpasswd
    # 最大用户数，-1 为不允许注册
    max_users: -1
web:
  # web是否启用，设为false网页将不允许访问
  enable: true
  # 自定义网站名称
  title: "Vue组件库"
  # 自定logo
  logo: "logo.png"
  # 自定义主题色
  primary_color: "#cd0806"
uplinks:
  npmjs:
    # 上游Npm地址, 这里填的taobao
    url: <https://registry.npm.taobao.org/>
packages:
  '**':
    // 访问权限, 这里设置的只有login才能访问
    access: $authenticated
    // 发布权限, 这里设置的只有login才能发布
    publish: $authenticated
    proxy: npmjs
logs:
  - {type: stdout, format: pretty, level: http}
```

### **检验成果**

https://mmbiz.qpic.cn/mmbiz_png/1NOXMW586uv8DM8OtK16Ku36vKBiaIuhiakNovAqiapfialx0NcTXsNFsPpH2RMLLRddtxibXMx1QI4f5nYKw1ZU9OA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

