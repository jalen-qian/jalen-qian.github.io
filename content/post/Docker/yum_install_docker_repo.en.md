---
title: "【Docker】Fixing the Repository Not Found Error When Installing Docker with yum on CentOS 8.0"
date: 2020-09-25
lastmod: 2020-09-25
draft: false
tags: ["Docker","Centos","yum"]
categories: ["Docker"]
author: "Jalen"
---

> When installing Docker on an Alibaba Cloud server running CentOS 8, a repository not found error occurred, as shown below:

![img](http://cdn1.jalen-qian.com/BlogBase/yum_install_docker_fail.png)

### Solution

Approach: Install Docker using the Docker repository.

#### Set Up the Repository

Install the required packages. Here, `yum-utils` is installed; `yum-utils` provides `yum-config-manager`, while the `device mapper` storage driver requires `device-mapper-persistent-data` and `lvm2`.
```
sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2
```

#### Configure the Alibaba Cloud Mirror in China

```
sudo yum-config-manager \
    --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

#### Install docker-ce

```
sudo yum install docker-ce docker-ce-cli containerd.io
```

P.S. If the installation fails, [click here](/post/docker/install-docker-error/).
