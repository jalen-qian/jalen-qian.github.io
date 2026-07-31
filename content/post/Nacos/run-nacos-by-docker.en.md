---
title: "[Nacos] Starting Nacos with Docker"
date: 2021-05-19T17:31:56+08:00
lastmod: 2021-05-19T17:37:56+08:00
draft: false
tags: ["Nacos"]
categories: ["Cloud Native"]
author: "Jalen"

contentCopyright: '<a rel="license noopener" href="https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License" target="_blank">Creative Commons Attribution-ShareAlike License</a>'

---

> Preface: I received a requirement today. Since most applications in the customer's cluster require configuration from the configuration center to be pushed to `Nacos`, I did some research and quickly started a local `Nacos` using Docker.

# What Is Nacos?

`Nacos` is a new open-source project launched by Alibaba. It is a dynamic service discovery, configuration management, and service management platform that makes it easier to build cloud-native applications.

`Nacos` is committed to helping you discover, configure, and manage microservices. Nacos provides a simple and easy-to-use set of features that helps you quickly implement dynamic service discovery, service configuration, service metadata, and traffic management.

`Nacos` helps you build, deliver, and manage microservice platforms more easily and efficiently. Nacos is service infrastructure for building modern service-centric application architectures, such as the microservices and cloud-native paradigms.

[Official Documentation](https://nacos.io/zh-cn/docs/what-is-nacos.html)

# Starting Nacos with Docker

**This deployment uses standalone mode.**

### Pull the Official Image

```shell
docker pull nacos/nacos-server
```

### Start the Docker Container

```shell
docker run --name nacos-standalone -e MODE=standalone -p 8848:8848 -d nacos/nacos-server:latest
```

### Verify the Deployment

The service is started on port 8848 of the local machine. Open a browser and visit:

[http://127.0.0.1:8848/nacos/index.html](http://127.0.0.1:8848/nacos/index.html)

The default username and password are both `nacos`.

![image-20210519194118405](http://cdn1.jalen-qian.com/Hugo/20210519194118BgB4YVCEr6.png)

After logging in, you can add configurations under Configuration Management.

![image-20210519194213398](http://cdn1.jalen-qian.com/Hugo/20210519194213s8MBkfHGV3.png)
