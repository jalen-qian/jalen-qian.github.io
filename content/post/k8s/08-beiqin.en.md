---
title: "K8S Notes 8: Deploying the Pigeon Baby & Child Store with K8S"
date: 2021-01-18T09:47:00+08:00
lastmod: 2021-01-18T09:47:00+08:00
draft: false
keywords: ["K8S","贝亲商城"]
description: "desc"
tags: ["K8S"]
categories: ["K8S"]
author: "Jalen"
---

After studying the previous articles, we now have a basic understanding of how to deploy an application, create shared storage, implement load balancing through services, and expose services externally through `Renetd`. Next, we will move on to a practical exercise: deploying the Pigeon Store, an e-commerce web application developed with `Spring Boot`.

# Deployment Topology

![image-20210115201331863](http://cdn1.jalen-qian.com/20210115201332odau4FI8RN.png)

From this topology diagram, we can see that:

- The shared storage area on the master node contains database scripts used to initialize the `MySql` database, which is deployed in a pod.
- The `MySql` service is exposed within the cluster through the `beiqin-db-service` service.
- The web service, developed with Spring Boot, is deployed using the `openjdk:8u222` base image, and the container exposes port 80.
- The Pigeon Store application is exposed externally through the `beiqin-app-service` service, also on port 80.
- `Renetd` is used to map the host IP to the virtual IP of the `beiqin-app-service` service, ultimately making the service accessible from outside the cluster.

# Deploying the Pigeon Store

## Deployment Resources

We will place the deployment scripts, service JAR package, MySQL script files, and other resources in the `/usr/local/data/www-data/beiqin/` directory.

Here, `/usr/local/data/www-data/` is the shared storage area configured in the previous article.

The following are all the resource files required to deploy the Pigeon Store application. We will create and deploy them one by one.

```shell
[root@master www-data]# tree beiqin
beiqin
├── beiqin-app-deploy.yml   # web应用部署脚本文件
├── beiqin-app-service.yml  # web应用服务部署脚本文件
├── beiqin-db-deploy.yml    # mysql部署脚本文件
├── beiqin-db-service.yml   # mysql服务部署脚本文件
├── dist
│   ├── application.yml     # 应用程序配置文件
│   └── beiqin-app.jar      # spring-boot开发的应用程序jar包，可以在openjdk容器中直接运行
└── sql
    └── beiqin.sql          # mysql脚本文件
```

## Deploying the Pigeon Store

### 1. Create an NFS File Share on the Master and Mount It on the Node

Here, we will reuse the configuration from [K8S Notes 5: NFS-Based Cluster File Sharing](http://www.jalen-qian.com/post/k8s/05-nfs/), mounting the master node's `/usr/local/data/www-data/` directory to the `/mnt` directory on the node host. The details will not be repeated here.

### 2. Deploy and Initialize the Database

#### 2.1 Create the `beiqin-db-deploy.yml` File

```yaml
apiVersion: apps/v1beta1         # 新版的k8s,版本号写法
kind: Deployment                 # 脚本类型：创建部署
metadata:
  name: beiqin-db-deploy         # 部署名称
spec:
  replicas: 1                    # 副本数，由于是mysql，只需要1个即可
  template:
    metadata:
      labels:
        app: beiqin-db-deploy    # pod标签
    spec:
      volumes:                   # 创建挂载卷
      - name: beiqin-db-volume   # 挂载卷名称
        hostPath: 
          path: /mnt/beiqin/sql # 挂载路径（数据卷在Node宿主机上的路径）
      containers:
      - name: beiqin-db-deploy
        image: mysql:5.7        # 使用镜像：mysql:5.7
        ports:
        - containerPort: 3306   # 容器对集群暴露的端口号：3306
        env:                    # 注意：env是之前没配置过的，表示容器的环境变量
        - name: MYSQL_ROOT_PASSWORD  # 环境变量1：mysql root密码
          value: "root"              # 环境变量的值，注意字符串要用""包起来
        volumeMounts:                # 容器挂载信息
        - name: beiqin-db-volume
          mountPath: /docker-entrypoint-initdb.d  # 挂载路径，挂载到这个目录，容器启动时会自动加载里面的sql脚本文件

```

#### 2.2 Deploy MySQL to the Cluster

```shell
# cd /usr/local/data/www-data/beiqin
$ kubectl create -f beiqin-db-deploy.yml
```

#### 2.3 Check the Deployment Status

```shell
# 查看部署的pod
$ kubectl get pod -o wide
NAME                                READY   STATUS    RESTARTS   AGE     IP            NODE    NOMINATED NODE   READINESS GATES
beiqin-db-deploy-757d87dc77-g5wrf   1/1     Running   0          5m17s   10.244.1.12   node1   <none>           <none>

# 进入pod容器内部，查看mysql是否能登录 & 是否执行了脚本创建了数据库和表
$ kubectl exec -it beiqin-db-deploy-757d87dc77-g5wrf /bin/bash

# 在容器内部，登录mysql
$ mysql -uroot -proot
# 查看数据库，可以发现数据库已经创建
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| beiqin             |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.06 sec)

# 查看表，发现表也已经创建
mysql> use beiqin;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables;
+---------------------+
| Tables_in_beiqin    |
+---------------------+
| t_category          |
| t_evaluate          |
| t_goods             |
| t_goods_cover       |
| t_goods_detail      |
| t_goods_param       |
| t_promotion_seckill |
+---------------------+
7 rows in set (0.00 sec)

```

#### 2.4 Edit the Database Service Script

Create `beiqin-db-service.yml`. This script is much simpler than the deployment script.

```yaml
apiVersion: v1
kind: Service # 类型：服务
metadata:
  name: beiqin-db-service # 服务名称
  labels: # 服务也是一个特殊的pod，也需要配置标签
    app: beiqin-db-service
spec:
  selector: # 选择关联的pod标签，也就是上一步创建的db部署pod
    app: beiqin-db-deploy
  ports:
  - port: 3310 # 服务对外暴露端口，对外指的是容器外，集群内
    targetPort: 3306 # 服务容器内端口
```

#### 2.5 Deploy the Service

```shell
$ kubectl create -f beiqin-db-service.yml
# 验证服务是否正常 kubectl get svc 和 kubectl get service 完全等效
$ kubectl get svc
NAME                TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
beiqin-db-service   ClusterIP   10.107.5.137   <none>        3310/TCP   7s
kubernetes          ClusterIP   10.96.0.1      <none>        443/TCP    27h
# 这里我们可以看到，服务的虚拟IP是 10.107.5.137 ，对外暴露端口是 3310（pod外，集群内）

# 进一步查看服务的详细信息
$ kubectl describe svc beiqin-db-service
Name:              beiqin-db-service
Namespace:         default
Labels:            app=beiqin-db-service
Annotations:       <none>
Selector:          app=beiqin-db-deploy
Type:              ClusterIP
IP:                10.107.5.137 # 虚拟IP
Port:              <unset>  3310/TCP # 对外暴露的端口
TargetPort:        3306/TCP # 目标端口
Endpoints:         10.244.1.12:3306 # 关联的pod虚拟IP和端口号，10.244.1.12是启动的那个db部署pod的虚拟IP
Session Affinity:  None
Events:            <none>

```

### 3. Deploy the Web Application and Initialize the Service

#### 3.1 Create the Deployment Script

Edit the `beiqin-app-deploy.yml` file.

```yaml
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: beiqin-app-deploy
spec:
  replicas: 2 # 副本数：2
  template:
    metadata:
      labels:
        app: beiqin-app-deploy
    spec:
      volumes:
      - name : beqin-app-volume
        hostPath:
          path: /mnt/beiqin/dist # 数据卷宿主机挂载目录，存放jar包和应用配置
      containers:
      - name: beiqin-app-deploy
        image: openjdk:8u222-jre  # 容器镜像，使用openjdk:8u222-jre
        command: ["/bin/sh"] # 注意：这里 command表示容器启动时执行的指令，这里执行shell命令
        args: ["-c","cd /usr/local/beiqin/dist;java -jar beiqin-app.jar"] # 指令参数
        volumeMounts:
        - name: beqin-app-volume
          mountPath: /usr/local/beiqin/dist # 容器内挂载的目录
```

#### 3.2 Create the Deployment

```shell
$ kubectl create -f beiqin-app-deploy.yml
deployment.apps/beiqin-app-deploy created
$ kubectl get pod -o wide
NAME                                 READY   STATUS    RESTARTS   AGE     IP            NODE    NOMINATED NODE   READINESS GATES
beiqin-app-deploy-5958f57879-n9p9b   1/1     Running   0          75s     10.244.2.17   node2   <none>           <none>
beiqin-app-deploy-5958f57879-nfs8s   1/1     Running   0          75s     10.244.1.19   node1   <none>           <none>
beiqin-db-deploy-757d87dc77-g5wrf    1/1     Running   2          2d19h   10.244.1.17   node1   <none>           <none>
```

#### 3.3 Create the Service

Edit the service script and add the following content:

```shell
$ vim beiqin-app-service.yml
apiVersion: v1
kind: Service
metadata:
  name: beiqin-app-service
  labels:
    app: beiqin-app-service
spec:
  selector:
    app: beiqin-app-deploy
  ports:
  - port: 80
    targetPort: 80
```

Create the service in the cluster:

```shell
$ kubectl create -f beiqin-app-service.yml 
service/beiqin-app-service created
# 查看服务pod状态
$ kubectl get svc
NAME                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
beiqin-app-service   ClusterIP   10.97.138.238   <none>        80/TCP     58s
beiqin-db-service    ClusterIP   10.107.5.137    <none>        3310/TCP   2d19h
kubernetes           ClusterIP   10.96.0.1       <none>        443/TCP    3d22h
```

At this point, the Pigeon Store has been fully deployed to the cluster environment. We can see that the service's virtual IP is `10.97.138.238`. We can now verify whether port 80 on this service IP is accessible.

#### 3.4 Verify the Service

```shell
$ curl http://10.97.138.238/goods?gid=1791
```

![image-20210118164458934](http://cdn1.jalen-qian.com/20210118164459zV77gl1lzt.png)

### 4. Expose the Service Externally Using Rinetd

```shell
$ vim /etc/rinetd.conf
0.0.0.0 80 10.97.138.238 80
$ rinetd -c /etc/rinetd.conf
```

Finally, we successfully accessed the service locally through the IP address of the virtual machine's master node.

![image-20210118165010644](http://cdn1.jalen-qian.com/202101181650106mkwc9OHF9.png)
