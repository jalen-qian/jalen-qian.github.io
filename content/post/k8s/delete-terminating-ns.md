---
title: "如何删除处于Terminating状态的namespace"
date: 2023-10-08T18:48:17+08:00
lastmod: 2023-10-08T18:48:17+08:00
draft: false
keywords: []
description: ""
tags: ["Kubernetes"]
categories: ["Kubernetes"]
author: "钱文军"
---

# 如何删除处于Terminating状态的namespace

![image-20231008185617416](https://cdn1.jalen-qian.com/Jalen/202310081856178lBSXGWXdL.png)

> 有时候，我们使用kubectl delete ns xxx 删除某个namespace后，会发现这个namespace并没有消失，而是长时间处于Terminating状态。出现这种情况，可能是因为kubelet阻塞导致的，说明还有其他资源在使用这个namespace。即使重启kubelet再删除也不好使，或者使用以下命令强制删除，也发现删除不了。

```shell
kubectl delete ns <namespace-name> --force --grace-period=0
```



# 解决方案

## 1. 查找处于Terminating状态的namespace


```shell
kubectl get ns
```

## 2.获取namespace资源

使用下面的命令，获取JSON格式的namespace资源文件，并查看 spec 下的 finalizer 属性。

```shell
kubectl get namespace <namespace-name> -o json
```

我们可以看到，namespace的信息：

```json
{
    "apiVersion": "v1",
    "kind": "Namespace",
    "metadata": {
        "creationTimestamp": "2023-10-08T01:54:39Z",
        "deletionTimestamp": "2023-10-08T01:56:59Z",
        "labels": {
            "k8slens-edit-resource-version": "v1"
        },
        "name": "slxt-pro-copy-test",
        "resourceVersion": "362142903",
        "selfLink": "/api/v1/namespaces/slxt-pro-copy-test",
        "uid": "ed12052c-02f8-4974-9603-ae087cad1bd1"
    },
    "spec": {
        "finalizers": [
          "kubernetes"
        ]
    },
    "status": {
        ...
        "phase": "Terminating"
    }
}
```

## 3. 将json格式文件保存到本地

可以使用以下命令直接保存文件，或者自行拷贝保存都行

```shell
kubectl get namespace <namespace-name> -o json >ns.json
```

我们执行完，会发现本地多了一个ns.json的文件（或者您任意取一个名字都行）

## 4.编辑ns.json，将finalizers设置为空数组

```json
{
    "apiVersion": "v1",
    "kind": "Namespace",
    "metadata": {
        "creationTimestamp": "2023-10-08T01:54:39Z",
        "deletionTimestamp": "2023-10-08T01:56:59Z",
        "labels": {
            "k8slens-edit-resource-version": "v1"
        },
        "name": "slxt-pro-copy-test",
        "resourceVersion": "362142903",
        "selfLink": "/api/v1/namespaces/slxt-pro-copy-test",
        "uid": "ed12052c-02f8-4974-9603-ae087cad1bd1"
    },
    "spec": {
        "finalizers": []
    },
    "status": {
        "phase": "Terminating"
    }
}
```

## 5. 使用kubectl 开启 proxy

```shell
kubectl proxy
```

此命令默认会在本机的8001端口启动一个代理服务，代理kubernetes集群的api，启动后我们就可以通过8001端口的api接口处理此问题。

![image-20231008190834926](https://cdn1.jalen-qian.com/Jalen/20231008190835YYpiPkX4RT.png)

## 6.使用命令调用api

打开一个新的terminal窗口，并执行以下命令

```shell
curl -k -H "Content-Type: application/json" -X PUT --data-binary @ns.json http://127.0.0.1:8001/api/v1/namespaces/<namespace-name>/finalize
```

其中`<namespace-name>`需要替换成处于Terminating状态的namespace名称。执行命令的命令行所在路径要和 ns.json 所在路径相同，这里我的是home文件夹。

调用的api会输出以下信息

```json
{
  "kind": "Namespace",
  "apiVersion": "v1",
  "metadata": {
    "name": "slxt-pro-copy-test",
    "selfLink": "/api/v1/namespaces/slxt-pro-copy-test/finalize",
    "uid": "ed12052c-02f8-4974-9603-ae087cad1bd1",
    "resourceVersion": "362142903",
    "creationTimestamp": "2023-10-08T01:54:39Z",
    "deletionTimestamp": "2023-10-08T01:56:59Z",
    "labels": {
      "k8slens-edit-resource-version": "v1"
    }
  },
  "spec": {
    
  },
  "status": {
    "phase": "Terminating",
    ...
  }
}
```

## 7.重新检查namespace是否已删除

```shell
kubectl get namespaces
```

