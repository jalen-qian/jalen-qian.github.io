---
title: "K8S笔记5 基于NFS的集群文件共享"
date: 2021-01-15T09:47:00+08:00
lastmod: 2021-01-15T09:47:00+08:00
draft: false
keywords: ["NFS"]
description: "desc"
tags: ["K8S","NFS"]
categories: ["K8S", "NFS", "文件共享"]
author: "Jalen"
---

在上一篇我们介绍了如何用`yml`脚本和`kubectl`命令的方式部署Tomcat集群，主要讲了如何创建部署，以及创建服务对外暴露端口供外部访问。这里部署的服务起到了转发和负载均衡器的作用。

由于多个`pod`同时提供服务，在处理公共的数据或者文件时，就不太好处理，这一节我们讲一个方案：通过NFS将一台服务器中的文件共享，并通过挂载命令将共享文件夹挂载到pod容器中。这样任何一个pod中访问到的都是同一份文件，任何pod修改了文件，也会实时变更到整个集群中。

# NFS介绍

`NFS`(Network File System)，网络文件系统，是由SUN公司研制的`Unix表示层协议 (presentation layer protocol)`，能使使用者访问网络上别处的文件就像在使用自己的计算机一样。

`NFS`是一个基于TCP协议的应用，主要实现原理是采用`RPC (Remote Procedure Call) 远程过程调用`，实现文件的传输，同时保证了调用端使用文件时，就像使用本地文件一样方便。

# 集群文件共享

集群中多个 `Pod` 如何实现读取和写入同一份数据呢？看下面的图，我们可以新起一个节点，这个节点提供`NFS`服务，我们的`Tomcat Pod`通过`NFS`和这个节点通信。

- 首先，nfs服务的共享文件夹是`www-data`
- 然后，`node1` 和 `node2` 的 `/mnt` 文件夹通过 NFS 协议与 `www-data` 绑定
- 最后，通过挂在命令，将每个节点的 `/mnt` 文件夹，挂在到容器中的 `/tomcat/webapps` 文件夹

![image-20210115143239403](http://cdn1.jalen-qian.com/2021011514323947i7kcJiXa.png)

## 操作步骤

这里需要一个Node节点作为NFS服务节点，我们直接将`master`节点作为共享文件节点，在master上如下操作：

1. 先安装`NFS 工具` 以及 `rpcbind`

   ```shell
   $ yum install -y nfs-utils rpcbind
   ```

2. 创建共享文件夹，我这里是`/usr/local/data/www-data`

   ```shell
   $ mkdir /usr/local/data/www-data
   ```

3. 设置NFS共享文件指令

   ```shell
   # 注意这里 192.168.233.128 是master的IP，rw表示可读可写，sync表示同步共享
   $ echo "/usr/local/data/www-data 192.168.233.128/24(rw,sync)" > /etc/exports
   ```

4. 启动`nfs` `rpc`服务，并将这两个服务设置为开机启动

   ```shell
   $ systemctl start nfs
   $ systemctl start rpcbind
   # 设置为开机启动
   $ systemctl enable nfs
   $ systemctl enable rpcbind
   ```

5. 查看`nfs`文件共享是否成功

   ```shell
   $ exportfs
   # 输出如下信息表示nfs共享文件夹设置成功
   /usr/local/data/www-data
   		192.168.233.128/24
   ```

## 客户端使用NFS服务

1. 在客户端Node所在主机，安装`nfs工具集` ，只需要安装`nfs-tools` ，不需要安装`rpcbind`

   ```shell
   $ yum install -y nfs-utils
   $ systemctl enable nfs #设置开机启动
   ```

2. 查看能否访问到主节点上的nfs服务

   ```shell
   $ showmount -e 192.168.233.128 #192.168.233.128是nfs服务提供方，也就是master node所在主机的IP地址
   # 输出如下信息，表示能正常访问
   Export list for 192.168.233.128:
   /usr/local/data/www-data 192.168.233.128/24
   ```

3. 使用`mount`命令进行挂载

   ```shell
   $ mount 192.168.233.128:/usr/local/data/www-data /mnt
   ```

4. 验证挂载是否成功

   我们在主节点的`www-data`文件夹编写一个文件 `test.txt`

   ```shell
   $ echo "我是主节点，hello" > /usr/local/data/www-data/test.txt
   ```

   然后在客户端节点的`/mnt` 目录查看是否存在该文件

   ![image-20210115150441356](http://cdn1.jalen-qian.com/202101151504414gLoihKjyh.png)

   发现能访问，说明挂载成功。

## 容器中使用NFS共享文件

我们通过上一步，已经将共享文件挂载到了每一个节点。现在需要将每个节点中的`/mnt`文件夹挂载到pod中的tomcat容器中。

变更这个Tomcat集群可以通过`kubel apply`命令修改集群，或者使用`kubel delete`删除集群相关资源，再创建集群。这里我们使用第二种方法。

1. 将旧的Tomcat Deployment 和 Service清理掉

   ```shell
   # 查看deployment列表
   $ kubectl get deployment
   # 删除名为tomcat-deploy的deployment
   $ kubectl delete deployment tomcat-deploy
   # 查看service列表
   $ kubectl get service
   # 删除名为tomcat-deploy的service
   $ kubectl delete service tomcat-deploy
   ```

2. 修改`Deployment` 配置文件，添加挂载信息，我在添加的行都加了注释

   ```
   apiVersion: extensions/v1beta1
   kind: Deployment
   metadata:
     name: tomcat-deploy
   spec: 
     replicas: 2
     template:
       metadata:
         labels:
           app: tomcat-cluster
       spec:
         volumes: # 创建挂载数据卷
         - name: web-app # 数据卷名称
           hostPath: # 数据卷在宿主机上的路径
             path: /mnt
         containers:
         - name: tomcat-cluster
           image: tomcat:latest
           ports:
           - containerPort: 8080
           volumeMounts: # 创建容器数据卷
           - name: web-app # 数据卷名称
             mountPath: /usr/local/tomcat/webapps # 挂载到容器中的路径
   ```

3. 重新创建`deployment`

   ```shell
   # 创建deployment
   $ kubectl create -f tomcat-deploy.yml
   # 查看deployment状态
   $ kubectl get deployment
   ```

4. 查看挂载是否成功

   我们可以进入到每个pod所在的主机，然后通过`docker ps` 查看正在运行的容器，如下图

   ![image-20210115152217018](http://cdn1.jalen-qian.com/20210115152217itk483FhMn.png)

   然后我们可以通过 `docker exec -it [容器ID] /bin/bash` 命令进入到容器中，查看`/usr/local/tomcat/webapps`文件夹是否存在挂载的文件

   ![image-20210115152446645](http://cdn1.jalen-qian.com/20210115152446Llz9LzoBkf.png)

   这样太麻烦了，在`master` 节点能否通过 `kubectl` 命令进入到子节点的容器呢？答案是肯定的

   ```shell
   # 查看pod状态
   $ kubectl get pod
   # 进入容器
   $ kubectl exec -it [pod名称] /bin/bash
   ```

   ![image-20210115152927484](http://cdn1.jalen-qian.com/20210115152927eyk00JKVhK.png)

至此就完成了基于NFS的K8S集群文件共享设置。

## 配置客户端NFS自动挂载

使用mount命令挂载，重启系统后将失效，需配置 `/etc/fstab`

```shell
# /etc/fstab中添加如下配置
192.168.233.128:/usr/local/data/www-data /mnt nfs defaults 0 0
```