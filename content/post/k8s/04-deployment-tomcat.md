---
title: "K8S笔记4 利用Deployment部署Tomcat集群"
date: 2021-01-15T09:47:00+08:00
lastmod: 2021-01-15T09:47:00+08:00
draft: false
keywords: ["Deployment"]
description: "desc"
tags: ["K8S","Deployment"]
categories: ["K8S","Deployment"]
author: "Jalen"
---



在上一篇我们介绍了如何用Dashboard可视化界面进行Tomcat集群的部署，但是在实际的集群环境下，我们更多的是通过编写`Deployment` 脚本来部署集群。

# Deployment (部署)

- **Deployment** 是指`Kubernetes` 向`Node` 节点发送指令，创建容器的过程

- `Kubernetes` 支持 `yml` 格式的部署脚本

- 部署命令如下：

```shell
kubectl create -f [部署yml脚本文件]  # 创建部署
```

## Deployment脚本基本格式

```yaml
apiVersion: extensions/v1beta1  # api的版本号
kind: Deployment                # 当前脚本的“类型” Deployment表示部署; Service表示服务；Pod表示Pod脚本
metadata:                       # 元数据，主要用来配置当前部署脚本的基本信息
  name: tomcat-deploy           # 当前部署的名称
spec:                           # 详细定义信息
  replicas: 2                   # 部署副本数量，也就是会起几个pod
  template:                     # 部署模板信息
    metadata:                   # 部署模板的元数据
      labels:                   # pod标签
        app: tomcat-cluster     # 这里指定了自定义的标签 tomcat-cluster
    spec:                       # 模板的详细信息
      containers:               # 容器相关信息
      - name: tomcat-cluster    # 容器的名称
        image: tomcat:latest    # 容器的镜像，这里是tomcat的最新版本镜像 tag为latest
        ports:
        - containerPort: 8080   # 容器对外暴露的端口
```

## 与部署相关的常用kubectl命令

```shell
# 创建部署
kubectl create -f 部署yml文件

# 更新部署配置，如果是第一次部署，这个命令和 kubectl create 等效
kubectl apply -f 部署yml文件

# 查看已部署pod
kubectl get pod [-o wide]

# 查看Pod详细信息
kubectl describe pod pod名称

# 查看pod输出日志 -f 表示是否实时更新
kubectl logs [-f] pod名称

# 查看已经创建的部署
kubectl get deployment

# 删除某个部署
kubectl delete deployment 部署名称
```

## 手动部署tomcat集群

这里我们将部署脚本都放在 `/usr/local/k8s/tomcat-deploy`  目录下，你也可以创建自己的目录存放部署脚本。

- 创建目录

  ```
  $ mkdir /usr/local/k8s/tomcat-deploy
  $ cd /usr/local/k8s/tomcat-deploy
  ```

- 编写部署脚本

  ```yaml
  $ vim tomcat-deployment.yml
  # 输入如下的内容
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
        containers:
        - name: tomcat-cluster
          image: tomcat:latest
          ports:
          - containerPort: 8080
  ```

  ![image-20210115114226596](http://cdn1.jalen-qian.com/20210115114226nVBdc7WHSG.png)

- 部署 tomcat 集群

  ```shell
  $ kubectl create -f tomcat-deploy.yml
  deployment.extensions/tomcat-deploy created
  ```

- 查看部署的 pod

  ```
  [root@master tomcat-deploy]# kubectl get pods
  NAME                             READY   STATUS    RESTARTS   AGE
  tomcat-deploy-5fd4fc7ddb-7vw4f   1/1     Running   0          98s
  tomcat-deploy-5fd4fc7ddb-t4wvp   1/1     Running   0          98s
  ```

  我们看到，已经启动了两个`pod`，且都是`Running`状态，这两个`pod`分别部署在`node1`和`node2`

- 至此，tomcat集群已经部署完毕，我们可以通过`kubectl describe pod [pod名称]`命令查看pod部署的详细信息

  ```shell
  $ kubectl describe pod tomcat-deploy-5fd4fc7ddb-7vw4f
  Name:               tomcat-deploy-5fd4fc7ddb-7vw4f
  Namespace:          default
  Priority:           0
  PriorityClassName:  <none>
  Node:               node1/192.168.233.129
  Start Time:         Fri, 15 Jan 2021 11:43:22 +0800
  Labels:             app=tomcat-cluster
                      pod-template-hash=5fd4fc7ddb
  Annotations:        <none>
  Status:             Running
  IP:                 10.244.1.7
  Controlled By:      ReplicaSet/tomcat-deploy-5fd4fc7ddb
  Containers:
    tomcat-cluster:
      Container ID:   docker://fa36632bdf28f58e1ad61dee3c93da88df348d3a98c34531d4b6fa12a73a18f8
      Image:          tomcat:latest
      Image ID:       docker-pullable://tomcat@sha256:94cc18203335e400dbafcd0633f33c53663b1c1012a13bcad58cced9cd9d1305
      Port:           8080/TCP
      Host Port:      0/TCP
      State:          Running
        Started:      Fri, 15 Jan 2021 11:43:38 +0800
      Ready:          True
      Restart Count:  0
      Environment:    <none>
      Mounts:
        /var/run/secrets/kubernetes.io/serviceaccount from default-token-fkln2 (ro)
  Conditions:
    Type              Status
    Initialized       True 
    Ready             True 
    ContainersReady   True 
    PodScheduled      True 
  Volumes:
    default-token-fkln2:
      Type:        Secret (a volume populated by a Secret)
      SecretName:  default-token-fkln2
      Optional:    false
  QoS Class:       BestEffort
  Node-Selectors:  <none>
  Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                   node.kubernetes.io/unreachable:NoExecute for 300s
  Events:
    Type    Reason     Age    From               Message
    ----    ------     ----   ----               -------
    Normal  Scheduled  4m1s   default-scheduler  Successfully assigned default/tomcat-deploy-5fd4fc7ddb-7vw4f to node1
    Normal  Pulling    4m     kubelet, node1     Pulling image "tomcat:latest"
    Normal  Pulled     3m45s  kubelet, node1     Successfully pulled image "tomcat:latest"
    Normal  Created    3m45s  kubelet, node1     Created container tomcat-cluster
    Normal  Started    3m45s  kubelet, node1     Started container tomcat-cluster
  ```

# 从外部访问Tomcat集群（NodePort)方式

上面我们部署了`tomcat`集群，但是这个集群只能在集群内部访问，如何将`tomcat`暴露给外部使用呢？回顾我们的`Deployment`部署脚本，有如下两行：

```
# tomcat-deploy.yml文件
ports:
        - containerPort: 8080
```

我们只设置了容器对外暴露的端口是8080，但是没有配置任何对外暴露的设置。

如下图，我们可以部署一个`服务`，这个`服务`也是一个pod，也有自己的虚拟IP和端口，服务pod是部署在master节点上的，当一个外部的请求进来时，会先送达给服务的8000端口。再按照负载均衡的规则分发给两个tomcat容器。这里的服务可以理解为K8S集群上的负载均衡器。

![image-20210115120623179](http://cdn1.jalen-qian.com/20210115120623ZjBsrcRTfZ.png)

## 创建Tomcat服务

- 创建脚本

  和部署`Deployment`类似，我们在`/usr/local/k8s/tomcat-service/`目录下面，创建一个服务的脚本文件

  ```shell
  $ cd /usr/local/k8s/tomcat-service
  $ vim tomcat-service.yml
  apiVersion: v1          # 版本号
  kind: Service           # 部署类型：服务
  metadata:               # 元数据
    name: tomcat-service  # 服务名称是 tomcat-service
    labels:               # pod标签（因为服务也是一个pod）
      app: tomcat-service # 自定义标签名 tomcat-service
  spec:                   # 详细信息
    type: NodePort        # 设置服务的类型是“节点端口”，含义是我们将要开辟端口，来和tomcat容器进行端口映射
    selector:             # 选择器，通过标签来选择我这个服务要绑定的 pod 
      app: tomcat-cluster # 选择 tomcat-cluster 标签的pod,也就是上一步我们已经部署的tomcat pod
    ports:                # 端口设置
    - port: 8000          # 当前服务的接收数据的端口
      targetPort: 8080    # 目标端口，也就是指向子 tomcat 容器的端口
      nodePort: 32500     # tomcat子容器对外暴露的端口（从外部可以直接访问）
  
  ```

- 部署服务

  ```shell
  $ kubectl create -f tomcat-service.yml
  service/tomcat-service created
  ```
  这里提示我们服务已经创建了

- 查看服务详情

  ```shell
  $ kubectl get service
  NAME             TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
  kubernetes       ClusterIP   10.96.0.1        <none>        443/TCP          18h
  tomcat-service   NodePort    10.107.253.196   <none>        8000:32500/TCP  /+++++ 2m3s
  ```

  