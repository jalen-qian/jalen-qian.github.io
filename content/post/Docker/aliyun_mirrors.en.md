---
title: "【Docker】Configure the Alibaba Cloud Registry Mirror on CentOS"
date: 2020-09-25
lastmod: 2020-09-25
draft: false
tags: ["Docker","CentOS","Registry Mirror","Alibaba Cloud"]
categories: ["Docker"]
author: "Jalen"
---

> As we all know, after installing Docker on CentOS, pulling official Docker images locally can be very slow. In this case, you can configure a registry mirror. Docker and many cloud service providers in China offer registry mirror services, for example:

- NetEase: **https://hub-mirror.c.163.com/**
- Alibaba Cloud: **https://<your-ID>.mirror.aliyuncs.com**
- Qiniu Cloud: **https://reg-mirror.qiniu.com**

Most cloud platforms in China provide image acceleration services. It is recommended that you select the corresponding service provider based on the cloud platform where Docker is hosted.

For example, since my service is deployed on Alibaba Cloud, I will configure the Alibaba Cloud registry mirror here.

#### Obtain the Alibaba Cloud Registry Mirror URL

The Alibaba Cloud registry mirror service is available at [https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors).

After opening the page and logging in, copy the mirror URL from the location shown in the image below:

![](http://cdn1.jalen-qian.com/BlogBase/docker-mirror-cdn.png)

#### Configure the Registry Mirror

This applies primarily to users running Docker client version 1.10.0 or later.

You can use the registry mirror by modifying the daemon configuration file at `/etc/docker/daemon.json`.

```
$sudo mkdir -p /etc/docker

$sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://你的ID.mirror.aliyuncs.com"]
}
EOF
//Reload daemon
$sudo systemctl daemon-reload
$sudo systemctl restart docker
```
