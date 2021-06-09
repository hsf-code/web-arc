---
title: tcp面试题（一）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# TCP（一）

### TCP 的特性

- TCP 提供⼀种⾯向连接的、可靠的字节流服务 
- 在⼀个 TCP 连接中，仅有两⽅进⾏彼此通信。⼴播和多播不能⽤于 TCP 
- TCP 使⽤校验和，确认和重传机制来保证可靠传输 
- TCP 给数据分节进⾏排序，并使⽤累积确认保证数据的顺序不变和⾮重复 
- TCP 使⽤滑动窗⼝机制来实现流量控制，通过动态改变窗⼝的⼤⼩进⾏拥塞控制