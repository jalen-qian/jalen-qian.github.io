---
title: "K8S笔记9 Kubernetes命令总结"
date: 2021-01-18T17:55:00+08:00
lastmod: 2021-01-18T17:55:00+08:00
draft: false
keywords: ["K8S"]
description: ""
tags: ["K8S"]
categories: ["K8S"]
author: "Jalen"
---

 经过前几篇的学习，基本入门了Kubernetes，下面我将一些基本的Kubernetes命令总结一下

- 集群相关

  ```shell
  # 查看集群信息
  $ kubectl cluster-info
  Kubernetes master is running at https://192.168.233.128:6443
  KubeDNS is running at https://192.168.233.128:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
  ```

- node相关

  ```shell
  # 查看所有的node节点
  kubectl get nodes
  
  # 查看node详细信息
  kubectl describe node名称
  ```

- deployment 相关

  ```shell
  # 创建部署
  kubectl create -f 部署yml文件
  
  # 更新部署配置，如果是第一次部署，这个命令和 kubectl create 等效
  kubectl apply -f 部署yml文件
  
  # 查看已经创建的部署
  kubectl get deployment
  
  # 删除某个部署
  kubectl delete deployment 部署名称
  
  # 查看部署详细信息
  kubectl describe deployment 部署名称
  
  # 滚动升级，将部署副本数滚动增加，比如这里将副本数增加为8个
  kubectl scale --replicas=8 deployment/deployment名称
  
  # 直接编辑deployment，更新manifest，编写方式是vim
  kubectl edit deployment/deployment名称
  
  # 重启部署
  kubectl rollout restart deploy 部署名称 [-n namespace名称]
  ```

- service 相关
  
  ```shell
  # 创建服务 & 更新服务部署配置，与部署一样
  # 查看已经创建的服务
  kubectl get service
  kubectl get svc
  
  # 删除服务
  kubectl delete service service名称
  
  # 查看服务详细信息
  kubectl describe service service名称
  
  ```


- pod相关

  ```shell
  # 查看已部署pod
  kubectl get pod [-o wide]
  
  # 查看Pod详细信息
  kubectl describe pod pod名称
  
  # 查看pod输出日志 -f 表示是否实时更新
  kubectl logs [-f] pod名称
  
  # 进入pod容器
  kubectl exec -it pod名称 /bin/bash
  ```

- nfs文件共享相关

  ```shell
  # nfs文件共享时，查看文件共享是否创建成功
  exportfs
  
  # 在子node所在宿主机中，查看主节点的nfs文件共享能否访问
  showmount -e 192.168.233.128
  
  # 子节点挂载命令
  mount 192.168.233.128:/usr/local/data/www-data /mnt
  
  # 子节点重启自动挂载
  # /etc/fstab中添加如下配置
  192.168.233.128:/usr/local/data/www-data /mnt nfs defaults 0 0
  ```


