---
title: "[Nacos]通过docker启动一个Nacos"
date: 2021-05-19T17:31:56+08:00
lastmod: 2021-05-19T17:37:56+08:00
draft: false
tags: ["Nacos"]
categories: ["云原生相关"]
author: "Jalen"

contentCopyright: '<a rel="license noopener" href="https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License" target="_blank">Creative Commons Attribution-ShareAlike License</a>'

---

> 前言：今天接到一个需求，由于客户集群的应用多是基于需要将配置中心的配置推送到`Nacos`中，手动研究了一下，通过docker快速启动了一个本地的`Nacos`

# Nacos是什么

`Nacos` 是阿里巴巴推出来的一个新开源项目，这是一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。

`Nacos` 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。

`Nacos` 帮助您更敏捷和容易地构建、交付和管理微服务平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施。

[官方文档](https://nacos.io/zh-cn/docs/what-is-nacos.html)

# 使用Docker启动Nacos

**这里部署的是单机模式**

### 拉取官方镜像

```shell
docker pull nacos/nacos-server
```

### 启动docker容器

```shell
docker run --name nacos-standalone -e MODE=standalone -p 8848:8848 -d nacos/nacos-server:latest
```

### 查看是否部署成功

服务是在本机的8848端口启动的，打开浏览器访问

[http://127.0.0.1:8848/nacos/index.html](http://127.0.0.1:8848/nacos/index.html)

默认的用户名和密码都是 `nacos`

![image-20210519194118405](https://cdn1.jalen-qian.com/Hugo/20210519194118BgB4YVCEr6.png)

登录之后，可以在配置管理里面添加配置

![image-20210519194213398](https://cdn1.jalen-qian.com/Hugo/20210519194213s8MBkfHGV3.png)