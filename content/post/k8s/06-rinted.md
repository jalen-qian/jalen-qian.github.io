---
title: "K8S笔记6 基于Rinetd的Service负载均衡实现"
date: 2021-01-15T09:47:00+08:00
lastmod: 2021-01-15T09:47:00+08:00
draft: false
keywords: ["K8S","Rinetd","负载均衡"]
description: "desc"
tags: ["K8S","Rinetd","负载均衡"]
categories: ["K8S","Rinetd","负载均衡"]
author: "Jalen"
---

在上一篇我们介绍了如何使用NFS实现文件共享以及如何将共享文件挂载到每个pod的容器中。

# Service实现负载均衡

![image-20210115172545864](http://cdn1.jalen-qian.com/20210115172546hSu71RHlc7.png)

这里我们直接使用Service的负载均衡，不再将端口直接暴露在宿主机节点上，集群内部通过k8s内部网络相互访问。由tomcat-service这个特殊的pod来实现流量转发与负载均衡。

修改`tomcat-service.yml`如下：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: tomcat-service
  labels:
    app: tomcat-service # Service也是一个特殊的pod，需要设置lables
spec:
#  type: NodePort # Service类型
  selector:
    app: tomcat-cluster # 指定绑定的pod
  ports:
  - port: 8000 # Service在k8s集群内部暴露的端口
    targetPort: 8080 # 被映射的容器暴露端口
#    nodePort: 32500 # 集群每个Node节点上对外暴露的端口
```

![image-20210115173037045](http://cdn1.jalen-qian.com/20210115173037bKSm3G3J5X.png)

变更service

```shell
$ kubectl apply -f tomcat-service.yml
# 查看服务状态
$ kubectl get service
# 输出信息如下
NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
kubernetes       ClusterIP   10.96.0.1       <none>        443/TCP    23h
tomcat-service   ClusterIP   10.99.160.131   <none>        8000/TCP   2m23s
#这里可以看到服务的虚拟IP为 10.99.160.131 
```

在NFS共享目录中增加用户测试的 `index.jsp`，验证负载均衡效果

```shell
# 在Master节点（NFS Server）中执行如下命令
$ mkdir /usr/local/data/www-data/test/
# 编写一个用户测试的jsp文件
$ echo "IP:<%=request.getLocalAddr()%>" > /usr/local/data/www-data/test/index.jsp
# 查看Service内部IP
$ kubectl get service tomcat-service
# 使用curl测试，10.99.160.131 为上一步中获取的 ClusterIP
$ curl 10.99.160.131:8000/test/index.jsp
# 返回处理请求的pod容器的ip
# IP:10.244.2.10
# IP:10.244.1.10
```

![image-20210115175024796](http://cdn1.jalen-qian.com/20210115175024xES1QYWxQy.png)

我们发现，请求被随机转发到了不同的Pod（打印的虚拟IP不同）

# 端口转发工具Rinetd

在上面的步骤中，我们实现了集群内的负载均衡。在测试时我们访问`index.jsp`页面的地址是 `curl 10.99.160.131:8000/test/index.jsp` ，这个IP是集群服务的虚拟IP地址，我们无法从外部访问。那么怎么将`master`主机的网卡`IP`地址`192.168.233.128` 映射到这个虚拟`IP`地址，呢？答案是通过`Rinted`

- `Rinetd`是`Linux`操作系统中为重定向传输控制协议工具
- 可将源IP端口数据转发至目标IP端口
- 在`Kubernetes`中用于将service服务对外暴露

## 安装Rinetd

`Rinetd`只能通过源代码安装

```shell
# 进入到 /usr/local目录
$ cd /usr/local
# 下载rinetd安装包
$ wget http://www.boutell.com/rinetd/http/rinetd.tar.gz
# 如果没有wget yum install wget 下载
# 解压
$ tar -zxvf rinetd.tar.gz
# 进入解压的目录
$ cd rinetd
# 修改目录下的 rinetd.c ,改变端口范围
$ sed -i 's/65536/65535/g' rinetd.c
# 创建rinted依赖目录，这个目录是rinetd这个软件强制要求，必须手动创建
$ mkdir -p /usr/man/
# 安装C语言编译器
$ yum install -y gcc
# 编译并安装
$ make && make install
```

## 配置Rinetd

我们需要增加配置文件 `/etc/rinetd.conf`

```shell
$ vim /etc/rinetd.conf
# 增加IP映射，这句的意思是，将所有访问本机8000端口的请求，都转发到虚拟IP 10.99.160.131的8000端口
0.0.0.0 8000 10.99.160.131 8000
# 或者直接执行 echo "0.0.0.0 8000 10.99.160.131 8000" > /etc/rinetd.conf
```

## 运行Rinetd.conf

```shell
$ rinetd -c /etc/rinetd.conf
```

### 查看映射情况

使用`netstat -nptl`可以看到`rinetd`开启了8000端口

![image-20210115183018503](http://cdn1.jalen-qian.com/20210115183018AlcBvEmeGi.png)

使用如下地址可在浏览器中访问`rinted + service`提供的服务

http://192.168.233.128:8000/test/index.jsp

![image-20210115183103354](http://cdn1.jalen-qian.com/20210115183103cf3vhLluin.png)