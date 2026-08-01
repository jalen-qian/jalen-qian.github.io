---
title: "【docker】Centos下给Doctor配置阿里云镜像加速器"
date: 2020-09-25
lastmod: 2020-09-25
draft: false
tags: ["Docker","Centos","镜像加速器","阿里云"]
categories: ["Docker"]
author: "Jalen"
---

> 众所周知，我们在Centos下安装完Docker后，获取Docker官方镜像到本地是很慢的。此时可以配置镜像加速器。Docker 官方和国内很多云服务商都提供了国内加速器服务，例如：

- 网易：**https://hub-mirror.c.163.com/**
- 阿里云：**https://<你的ID>.mirror.aliyuncs.com**
- 七牛云加速器：**https://reg-mirror.qiniu.com**

国内的云平台基本都提供了镜像云加速服务，建议根据你的Docker云平台选择对应的服务商。

比如我的服务是部署在阿里云上，我这里就配置阿里云的镜像加速。

#### 获取阿里云镜像加速地址

阿里云的镜像加速服务获取地址是 [https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)

点击进入并登陆后，在下图所示地方复制加速地址：

![](https://cdn1.jalen-qian.com/BlogBase/docker-mirror-cdn.png)

#### 配置镜像加速器

主要针对Docker客户端版本大于 1.10.0 的用户

我们可以通过修改daemon配置文件/etc/docker/daemon.json来使用加速器

```
$sudo mkdir -p /etc/docker

$sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://你的ID.mirror.aliyuncs.com"]
}
EOF
//重新加载daemon
$sudo systemctl daemon-reload
$sudo systemctl restart docker
```



