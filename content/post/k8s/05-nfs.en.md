---
title: "K8S Notes 5: NFS-Based Cluster File Sharing"
date: 2021-01-15T09:47:00+08:00
lastmod: 2021-01-15T09:47:00+08:00
draft: false
keywords: ["NFS"]
description: "desc"
tags: ["K8S","NFS"]
categories: ["K8S", "NFS", "File Sharing"]
author: "Jalen"
---

In the previous article, we introduced how to deploy a Tomcat cluster using an `yml` script and the `kubectl` command. We mainly covered how to create a deployment and a service that exposes ports for external access. The deployed service acts as a proxy and load balancer.

Because multiple `pod` instances provide services simultaneously, handling shared data or files can be difficult. In this section, we will introduce a solution: sharing files from a server through NFS and using a mount command to mount the shared folder into pod containers. This way, every pod accesses the same files, and any file modified by one pod is updated across the entire cluster in real time.

# Introduction to NFS

`NFS` (Network File System) is a network file system developed by SUN. It is a Unix presentation-layer protocol that allows users to access files elsewhere on a network as if they were using their own computer.

`NFS` is a TCP-based application. Its core implementation uses `RPC (Remote Procedure Call)` to transfer files while ensuring that the caller can use remote files as conveniently as local files.

# Cluster File Sharing

How can multiple `Pod` instances in a cluster read and write the same data? As shown in the diagram below, we can add a new node that provides an `NFS` service, while our `Tomcat Pod` communicates with this node through `NFS`.

- First, the shared folder of the NFS service is `www-data`
- Then, the `/mnt` folders of `node1` and `node2` are bound to `www-data` through the NFS protocol
- Finally, use the mount command to mount the `/mnt` folder of each node to the `/tomcat/webapps` folder in the container

![image-20210115143239403](https://cdn1.jalen-qian.com/2021011514323947i7kcJiXa.png)

## Procedure

A Node is required as the NFS service node. We will directly use the `master` node as the shared file node. Perform the following operations on the master:

1. First, install the `NFS tools` and `rpcbind`.

   ```shell
   $ yum install -y nfs-utils rpcbind
   ```

2. Create a shared folder. In this example, it is `/usr/local/data/www-data`

   ```shell
   $ mkdir /usr/local/data/www-data
   ```

3. Configure the NFS shared directory

   ```shell
   # Note that 192.168.233.128 is the master's IP address, rw means readable and writable, and sync means synchronous sharing
   $ echo "/usr/local/data/www-data 192.168.233.128/24(rw,sync)" > /etc/exports
   ```

4. Start the `nfs` and `rpc` services, and configure both services to start automatically at boot

   ```shell
   $ systemctl start nfs
   $ systemctl start rpcbind
   # Configure the services to start automatically at boot
   $ systemctl enable nfs
   $ systemctl enable rpcbind
   ```

5. Check whether the `nfs` file share was configured successfully

   ```shell
   $ exportfs
   # The following output indicates that the NFS shared folder was configured successfully
   /usr/local/data/www-data
   		192.168.233.128/24
   ```

## Using the NFS Service on Clients

1. On the host where the client Node is located, install the `NFS toolset`. You only need to install `nfs-tools`; there is no need to install `rpcbind`.

   ```shell
   $ yum install -y nfs-utils
   $ systemctl enable nfs # Configure it to start automatically at boot
   ```

2. Check whether the NFS service on the master node is accessible

   ```shell
   $ showmount -e 192.168.233.128 # 192.168.233.128 is the NFS service provider, namely the IP address of the host where the master node is located
   # The following output indicates that the service is accessible
   Export list for 192.168.233.128:
   /usr/local/data/www-data 192.168.233.128/24
   ```

3. Use the `mount` command to mount the directory

   ```shell
   $ mount 192.168.233.128:/usr/local/data/www-data /mnt
   ```

4. Verify that the mount was successful

   Create a file named `test.txt` in the `www-data` folder on the master node

   ```shell
   $ echo "我是主节点，hello" > /usr/local/data/www-data/test.txt
   ```

   Then check whether the file exists in the `/mnt` directory on the client node

   ![image-20210115150441356](https://cdn1.jalen-qian.com/202101151504414gLoihKjyh.png)

   The file is accessible, indicating that the mount was successful.

## Using NFS Shared Files in Containers

In the previous step, we mounted the shared files on every node. We now need to mount the `/mnt` folder on each node into the Tomcat container in the pod.

You can update this Tomcat cluster using the `kubel apply` command, or use `kubel delete` to delete the cluster-related resources and then recreate the cluster. Here, we will use the second method.

1. Remove the old Tomcat Deployment and Service

   ```shell
   # View the deployment list
   $ kubectl get deployment
   # Delete the deployment named tomcat-deploy
   $ kubectl delete deployment tomcat-deploy
   # View the service list
   $ kubectl get service
   # Delete the service named tomcat-deploy
   $ kubectl delete service tomcat-deploy
   ```

2. Modify the `Deployment` configuration file and add the mount configuration. Comments have been added to all newly added lines

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
         volumes: # Create a mounted data volume
         - name: web-app # Data volume name
           hostPath: # Path of the data volume on the host
             path: /mnt
         containers:
         - name: tomcat-cluster
           image: tomcat:latest
           ports:
           - containerPort: 8080
           volumeMounts: # Create a container data volume
           - name: web-app # Data volume name
             mountPath: /usr/local/tomcat/webapps # Path mounted in the container
   ```

3. Recreate `deployment`

   ```shell
   # Create the deployment
   $ kubectl create -f tomcat-deploy.yml
   # Check the deployment status
   $ kubectl get deployment
   ```

4. Check whether the mount was successful

   We can log in to the host where each pod is located and use `docker ps` to view the running containers, as shown below

   ![image-20210115152217018](https://cdn1.jalen-qian.com/20210115152217itk483FhMn.png)

   We can then use the `docker exec -it [container-ID] /bin/bash` command to enter the container and check whether the mounted files exist in the `/usr/local/tomcat/webapps` folder.

   ![image-20210115152446645](https://cdn1.jalen-qian.com/20210115152446Llz9LzoBkf.png)

   This approach is too cumbersome. Can we use the `kubectl` command on the `master` node to enter a container on a child node? The answer is yes.

   ```shell
   # Check the pod status
   $ kubectl get pod
   # Enter the container
   $ kubectl exec -it [pod名称] /bin/bash
   ```

   ![image-20210115152927484](https://cdn1.jalen-qian.com/20210115152927eyk00JKVhK.png)

This completes the configuration of NFS-based file sharing for the K8S cluster.

## Configuring Automatic NFS Mounting on Clients

Mounts created using the mount command will be lost after the system restarts, so `/etc/fstab` must be configured.

```shell
# Add the following configuration to /etc/fstab
192.168.233.128:/usr/local/data/www-data /mnt nfs defaults 0 0
```
