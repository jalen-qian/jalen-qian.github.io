---
title: "K8S Notes 4: Deploying a Tomcat Cluster with Deployment"
date: 2021-01-15T09:47:00+08:00
lastmod: 2021-01-15T09:47:00+08:00
draft: false
keywords: ["Deployment"]
description: "desc"
tags: ["K8S","Deployment"]
categories: ["K8S","Deployment"]
author: "Jalen"
---



In the previous article, we introduced how to deploy a Tomcat cluster using the Dashboard's graphical interface. However, in an actual cluster environment, we usually deploy the cluster by writing `Deployment` scripts.

# Deployment

- **Deployment** refers to the process in which `Kubernetes` sends instructions to `Node` nodes to create containers.

- `Kubernetes` supports deployment scripts in `yml` format.

- The deployment command is as follows:

```shell
kubectl create -f [部署yml脚本文件]  # 创建部署
```

## Basic Deployment Script Format

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

## Common kubectl Commands Related to Deployment

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

## Manually Deploying a Tomcat Cluster

Here, we store all deployment scripts in the `/usr/local/k8s/tomcat-deploy` directory. You can also create your own directory for storing deployment scripts.

- Create the directory

  ```
  $ mkdir /usr/local/k8s/tomcat-deploy
  $ cd /usr/local/k8s/tomcat-deploy
  ```

- Write the deployment script

  ```yaml
  $ vim tomcat-deployment.yml
  # Enter the following content
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

- Deploy the Tomcat cluster

  ```shell
  $ kubectl create -f tomcat-deploy.yml
  deployment.extensions/tomcat-deploy created
  ```

- View the deployed pods

  ```
  [root@master tomcat-deploy]# kubectl get pods
  NAME                             READY   STATUS    RESTARTS   AGE
  tomcat-deploy-5fd4fc7ddb-7vw4f   1/1     Running   0          98s
  tomcat-deploy-5fd4fc7ddb-t4wvp   1/1     Running   0          98s
  ```

  We can see that two `pod` have been started, and both are in the `Running` state. These two `pod` are deployed on `node1` and `node2`, respectively.

- At this point, the Tomcat cluster has been deployed. We can use the `kubectl describe pod [pod名称]` command to view detailed information about the pod deployment.

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

# Accessing the Tomcat Cluster Externally Using NodePort

We deployed an `tomcat` cluster above, but this cluster can only be accessed from within the cluster. How can we expose `tomcat` for external access? Looking back at our `Deployment` deployment script, we can see the following two lines:

```
# tomcat-deploy.yml文件
ports:
        - containerPort: 8080
```

We only set the container's exposed port to 8080, without configuring any settings for external access.

As shown below, we can deploy a `服务`. This `服务` is also a pod and has its own virtual IP address and port. The service pod is deployed on the master node. When an external request arrives, it is first sent to port 8000 of the service and then distributed to the two Tomcat containers according to the load-balancing rules. The service here can be understood as a load balancer on the K8S cluster.

![image-20210115120623179](http://cdn1.jalen-qian.com/20210115120623ZjBsrcRTfZ.png)

## Creating a Tomcat Service

- Create the script

  Similar to deploying `Deployment`, we create a service script file in the `/usr/local/k8s/tomcat-service/` directory.

  ```shell
  $ cd /usr/local/k8s/tomcat-service
  $ vim tomcat-service.yml
  apiVersion: v1          # Version
  kind: Service           # Deployment type: Service
  metadata:               # Metadata
    name: tomcat-service  # The service name is tomcat-service
    labels:               # Pod labels (because a service is also a pod)
      app: tomcat-service # Custom label name: tomcat-service
  spec:                   # Detailed configuration
    type: NodePort        # Set the service type to NodePort, meaning that a port will be opened and mapped to the Tomcat container
    selector:             # Selector used to select the pods to which this service will bind by label
      app: tomcat-cluster # Select pods with the tomcat-cluster label, namely the Tomcat pods deployed in the previous step
    ports:                # Port configuration
    - port: 8000          # Port on which the current service receives data
      targetPort: 8080    # Target port, which points to the port of the child Tomcat containers
      nodePort: 32500     # Port exposed externally by the child Tomcat containers (directly accessible from outside)
  
  ```

- Deploy the service

  ```shell
  $ kubectl create -f tomcat-service.yml
  service/tomcat-service created
  ```
  This message indicates that the service has been created.

- View the service details

  ```shell
  $ kubectl get service
  NAME             TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
  kubernetes       ClusterIP   10.96.0.1        <none>        443/TCP          18h
  tomcat-service   NodePort    10.107.253.196   <none>        8000:32500/TCP  /+++++ 2m3s
  ```
