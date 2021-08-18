---
title: "K8S笔记7 更新集群配置与资源限定"
date: 2021-01-15T09:47:00+08:00
lastmod: 2021-01-15T09:47:00+08:00
draft: false
keywords: ["K8S","资源限定"]
description: "desc"
tags: ["K8S"]
categories: ["K8S"]
author: "Jalen"
---

在上一篇我们介绍了如何使用NFS实现文件共享以及如何将共享文件挂载到每个pod的容器中。

# 集群配置调整

更新集群配置

```shell
$ kubectl apply -f yml文件路径
```

删除部署或者服务

```shell
# 删除部署
$ kubectl delete deployment 部署名称
# 删除服务
$ kubectl delete service 服务名称
```

# 集群资源限定

我们主要在容器配置中增加`resources` 配置项来进行资源限定

```yaml
containers:
  - name: tomcat-cluster
  image: tomcat:latest
  resources:
    requests:        # 容器运行所需最小资源，不满足则无法运行
      cpu: 1         # 1核cpu 可以是小数，比如 0.5，表示宿主机只要有0.5核cpu是闲置状态，就可以部署这个容器
      memory: 500Mi  # 500M内存
    limits:          # 容器运行过程中，最多占用的资源
      cpu: 2         # 最多占用2核cpu
      memory: 1024Mi # 最多占用1G内存
```

## 测试资源调整部署

我们修改服务器上的`tomcat-deploy.yml`文件，增加资源限定，同时将副本数增加为3个

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: tomcat-deploy
spec: 
  replicas: 3 #副本数量从2改为3个
  template:
    metadata:
      labels:
        app: tomcat-cluster
    spec:
      volumes: 
      - name: web-app
        hostPath:
          path: /mnt
      containers:
      - name: tomcat-cluster
        image: tomcat:latest
        resources: # 增加资源限定
          requests:
            cpu: 0.5
            memory: 200Mi
          limits:
            cpu: 2
            memory: 500Mi
        ports:
        - containerPort: 8080
        volumeMounts:
        - name: web-app
          mountPath: /usr/local/tomcat/webapps
```

更新集群配置

```shell
kubectl apply -f tomcat-deploy.yml
```

查看集群pod信息，发现pod增加为了3个

![image-20210115185712445](http://cdn1.jalen-qian.com/20210115185712GAxJU2nWfi.png)

这里说明一下k8s部署pod的原则是“资源优先”原则，即哪个node上资源更多，就将pod优先部署到这个node上

查看配置生效的情况，使用命令 `kubectl describe pod tomcat-deploy-857545df88-26v5t`

```shell
[root@master tomcat-deploy]# kubectl describe pod tomcat-deploy-857545df88-26v5t
Name:               tomcat-deploy-857545df88-26v5t
Namespace:          default
Priority:           0
PriorityClassName:  <none>
Node:               node2/192.168.233.130
Start Time:         Fri, 15 Jan 2021 18:50:38 +0800
Labels:             app=tomcat-cluster
                    pod-template-hash=857545df88
Annotations:        <none>
Status:             Running
IP:                 10.244.2.11
Controlled By:      ReplicaSet/tomcat-deploy-857545df88
Containers:
  tomcat-cluster:
    Container ID:   docker://8f769d695c7f1713027a043a8e11edcf1ad3cb55ae731ca925c0573482174792
    Image:          tomcat:latest
    Image ID:       docker-pullable://tomcat@sha256:94cc18203335e400dbafcd0633f33c53663b1c1012a13bcad58cced9cd9d1305
    Port:           8080/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Fri, 15 Jan 2021 18:50:43 +0800
    Ready:          True
    Restart Count:  0
    Limits:         # 资源限制已经生效
      cpu:     2
      memory:  500Mi    
    Requests:
      cpu:        500m
      memory:     200Mi
    Environment:  <none>
    Mounts:
      /usr/local/tomcat/webapps from web-app (rw)
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-fkln2 (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             True 
  ContainersReady   True 
  PodScheduled      True 
Volumes:
  web-app:
    Type:          HostPath (bare host directory volume)
    Path:          /mnt
    HostPathType:  
  default-token-fkln2:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-fkln2
    Optional:    false
QoS Class:       Burstable
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
Events:
  Type    Reason     Age    From               Message
  ----    ------     ----   ----               -------
  Normal  Scheduled  8m36s  default-scheduler  Successfully assigned default/tomcat-deploy-857545df88-26v5t to node2
  Normal  Pulling    8m35s  kubelet, node2     Pulling image "tomcat:latest"
  Normal  Pulled     8m31s  kubelet, node2     Successfully pulled image "tomcat:latest"
  Normal  Created    8m31s  kubelet, node2     Created container tomcat-cluster
  Normal  Started    8m31s  kubelet, node2     Started container tomcat-cluster

```

