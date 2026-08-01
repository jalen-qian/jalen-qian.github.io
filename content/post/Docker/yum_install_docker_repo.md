---
title: "【docker】在Centos8.0下用yum安装Docker报找不到源解决办法"
date: 2020-09-25
lastmod: 2020-09-25
draft: false
tags: ["Docker","Centos","yum"]
categories: ["Docker"]
author: "Jalen"
---

> 在阿里云服务器（Centos8系统）安装doker时，报找不到源，如下图：

![img](https://cdn1.jalen-qian.com/BlogBase/yum_install_docker_fail.png)

### 解决

方案：使用 Docker 仓库进行安装

#### 设置仓库

安装需要的软件包，这里安装了`yum-utils`，`yum-utils` 提供了 `yum-config-manager` ，并且 `device mapper` 存储驱动程序需要 `device-mapper-persistent-data` 和 `lvm2` 
```
sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2
```

#### 配置使用国内阿里云的源地址

```
sudo yum-config-manager \
    --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

#### 安装docker-ce

```
sudo yum install docker-ce docker-ce-cli containerd.io
```

ps:如安装失败[请戳这里](/post/docker/install-docker-error/)