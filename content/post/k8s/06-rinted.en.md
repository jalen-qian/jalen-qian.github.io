---
title: "K8S Notes 6: Implementing Service Load Balancing with Rinetd"
date: 2021-01-15T09:47:00+08:00
lastmod: 2021-01-15T09:47:00+08:00
draft: false
keywords: ["K8S","Rinetd","负载均衡"]
description: "desc"
tags: ["K8S","Rinetd","Load Balancing"]
categories: ["K8S","Rinetd","Load Balancing"]
author: "Jalen"
---

In the previous article, we introduced how to use NFS for file sharing and how to mount shared files into the containers of each pod.

# Implementing Load Balancing with Service

![image-20210115172545864](http://cdn1.jalen-qian.com/20210115172546hSu71RHlc7.png)

Here, we use Service load balancing directly instead of exposing ports on the host nodes. Services within the cluster communicate with one another through the K8S internal network. The special pod named tomcat-service handles traffic forwarding and load balancing.

Modify `tomcat-service.yml` as follows:

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

Apply the Service changes:

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

Add the user test file `index.jsp` to the NFS shared directory to verify the load-balancing behavior.

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

We can see that requests are randomly forwarded to different Pods, as indicated by the different virtual IP addresses displayed.

# Port Forwarding Tool Rinetd

In the preceding steps, we implemented load balancing within the cluster. During testing, the address used to access the `index.jsp` page is `curl 10.99.160.131:8000/test/index.jsp`. This IP is the virtual IP address of the cluster service and cannot be accessed externally. So how can we map the `IP` address `192.168.233.128` of the network interface on the `master` host to this virtual `IP` address? The answer is `Rinted`.

- `Rinetd` is a Transmission Control Protocol redirection tool for the `Linux` operating system
- It forwards data from a source IP address and port to a destination IP address and port
- In `Kubernetes`, it is used to expose Service resources externally

## Installing Rinetd

`Rinetd` can only be installed from source code.

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

## Configuring Rinetd

We need to add the configuration file `/etc/rinetd.conf`.

```shell
$ vim /etc/rinetd.conf
# 增加IP映射，这句的意思是，将所有访问本机8000端口的请求，都转发到虚拟IP 10.99.160.131的8000端口
0.0.0.0 8000 10.99.160.131 8000
# 或者直接执行 echo "0.0.0.0 8000 10.99.160.131 8000" > /etc/rinetd.conf
```

## Running Rinetd.conf

```shell
$ rinetd -c /etc/rinetd.conf
```

### Checking the Port Mapping

Use `netstat -nptl` to verify that port 8000 is open on `rinetd`.

![image-20210115183018503](http://cdn1.jalen-qian.com/20210115183018AlcBvEmeGi.png)

Use the following address in a browser to access the service provided by `rinted + service`:

http://192.168.233.128:8000/test/index.jsp

![image-20210115183103354](http://cdn1.jalen-qian.com/20210115183103cf3vhLluin.png)
