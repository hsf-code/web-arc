---
title: 工程化（一）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

### Babel的原理是什么?

babel 的转译过程也分为三个阶段，这三步具体是：

- 解析 Parse: 将代码解析⽣成抽象语法树( 即AST )，即词法分析与语法分析的过程 
- 转换 Transform: 对于 AST 进⾏变换⼀系列的操作，babel 接受得到 AST 并通过 babel-traverse 对其进⾏遍历，在 此过程中进⾏添加、更新及移除等操作 
- ⽣成 Generate: 将变换后的 AST 再转换为 JS 代码, 使⽤到的模块是 babel-generator

![](D:\resDoc\hsf-web-arc\docs\interview\web\engineering\img\babel-parser.jpg)