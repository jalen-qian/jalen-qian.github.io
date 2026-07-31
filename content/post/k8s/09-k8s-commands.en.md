---
title: "K8S Notes 9: Kubernetes Command Summary"
date: 2021-01-18T17:55:00+08:00
lastmod: 2021-01-18T17:55:00+08:00
draft: false
keywords: ["K8S"]
description: ""
tags: ["K8S"]
categories: ["K8S"]
author: "Jalen"
---

 After working through the previous articles, you should now have a basic understanding of Kubernetes. Below is a summary of some basic Kubernetes commands.

- Cluster-related commands

  ```shell
  # View cluster information
  $ kubectl cluster-info
  Kubernetes master is running at https://192.168.233.128:6443
  KubeDNS is running at https://192.168.233.128:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
  ```

- Node-related commands

  ```shell
  # View all nodes
  kubectl get nodes
  
  # View detailed node information
  kubectl describe node名称
  ```

- Deployment-related commands

  ```shell
  # Create a deployment
  kubectl create -f 部署yml文件
  
  # Update the deployment configuration. For the initial deployment, this command is equivalent to kubectl create
  kubectl apply -f 部署yml文件
  
  # View existing deployments
  kubectl get deployment
  
  # Delete a deployment
  kubectl delete deployment 部署名称
  
  # View detailed deployment information
  kubectl describe deployment 部署名称
  
  # Perform a rolling scale-up. For example, increase the number of replicas to 8
  kubectl scale --replicas=8 deployment/deployment名称
  
  # Edit the deployment directly and update the manifest using Vim
  kubectl edit deployment/deployment名称
  
  # Restart a deployment
  kubectl rollout restart deploy 部署名称 [-n namespace名称]
  ```

- Service-related commands
  
  ```shell
  # Create a service and update its configuration in the same way as a deployment
  # View existing services
  kubectl get service
  kubectl get svc
  
  # Delete a service
  kubectl delete service service名称
  
  # View detailed service information
  kubectl describe service service名称
  
  ```


- Pod-related commands

  ```shell
  # View deployed Pods
  kubectl get pod [-o wide]
  
  # View detailed Pod information
  kubectl describe pod pod名称
  
  # View Pod logs; -f enables real-time updates
  kubectl logs [-f] pod名称
  
  # Enter a Pod container
  kubectl exec -it pod名称 /bin/bash
  ```

- NFS file sharing-related commands

  ```shell
  # When using NFS file sharing, verify that the file share was created successfully
  exportfs
  
  # On the host of a worker node, check whether the primary node's NFS file share is accessible
  showmount -e 192.168.233.128
  
  # Mount command for worker nodes
  mount 192.168.233.128:/usr/local/data/www-data /mnt
  
  # Automatically mount after a worker node restarts
  # Add the following configuration to /etc/fstab
  192.168.233.128:/usr/local/data/www-data /mnt nfs defaults 0 0
  ```
