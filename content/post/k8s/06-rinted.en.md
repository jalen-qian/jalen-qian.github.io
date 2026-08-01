---
title: "K8S Notes 6: Implementing Service Load Balancing with Rinetd"
date: 2021-01-15T09:47:00+08:00
lastmod: 2021-01-15T09:47:00+08:00
draft: false
keywords: ["K8S","Rinetd","load balancing"]
description: "desc"
tags: ["K8S","Rinetd","Load Balancing"]
categories: ["K8S","Rinetd","Load Balancing"]
author: "Jalen"
---

In the previous article, we introduced how to use NFS for file sharing and how to mount shared files into the containers of each pod.

# Implementing Load Balancing with Service

![image-20210115172545864](https://cdn1.jalen-qian.com/20210115172546hSu71RHlc7.png)

Here, we use Service load balancing directly instead of exposing ports on the host nodes. Services within the cluster communicate with one another through the K8S internal network. The special pod named tomcat-service handles traffic forwarding and load balancing.

Modify `tomcat-service.yml` as follows:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: tomcat-service
  labels:
    app: tomcat-service # Service is a special pop that needs to be set up.
spec:
#  Type: NodePort #Service
  selector:
    app: tomcat-cluster # Specify bound pod
  ports:
  - port: 8000 # Service was exposed inside the K8s cluster. Port
    targetPort: 8080 # Maped container exposure end mouth
#    # External exposure at every Node node in the cluster Port
```

![image-20210115173037045](https://cdn1.jalen-qian.com/20210115173037bKSm3G3J5X.png)

Apply the Service changes:

```shell
$ kubectl apply -f tomcat-service.yml
# View service status
$ kubectl get service
# Output message
NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
kubernetes       ClusterIP   10.96.0.1       <none>        443/TCP    23h
tomcat-service   ClusterIP   10.99.160.131   <none>        8000/TCP   2m23s
#Here you can see the virtual IP for service is 10.99.160.131.
```

Add the user test file `index.jsp` to the NFS shared directory to verify the load-balancing behavior.

```shell
# Execute the following order in Master Node (NFS Server)
$ mkdir /usr/local/data/www-data/test/
# Prepare a user tested jsp file
$ echo "IP:<%=request.getLocalAddr()%>" > /usr/local/data/www-data/test/index.jsp
# View Service Internal IP
$ kubectl get service tomcat-service
# Using curl testing, 10.99.160.131 for the ClusterIP obtained in the previous step
$ curl 10.99.160.131:8000/test/index.jsp
# Return to ip for processing requested pod containers
# IP:10.244.2.10
# IP:10.244.1.10
```

![image-20210115175024796](https://cdn1.jalen-qian.com/20210115175024xES1QYWxQy.png)

We can see that requests are randomly forwarded to different Pods, as indicated by the different virtual IP addresses displayed.

# Port Forwarding Tool Rinetd

In the preceding steps, we implemented load balancing within the cluster. During testing, the address used to access the `index.jsp` page is `curl 10.99.160.131:8000/test/index.jsp`. This IP is the virtual IP address of the cluster service and cannot be accessed externally. So how can we map the `IP` address `192.168.233.128` of the network interface on the `master` host to this virtual `IP` address? The answer is `Rinted`.

- `Rinetd` is a Transmission Control Protocol redirection tool for the `Linux` operating system
- It forwards data from a source IP address and port to a destination IP address and port
- In `Kubernetes`, it is used to expose Service resources externally

## Installing Rinetd

`Rinetd` can only be installed from source code.

```shell
# Enter to /usr/ local directory
$ cd /usr/local
# Download rinetd installation package
$ wget http://www.boutell.com/rinetd/http/rinetd.tar.gz
# Other Organiser
# Unpressure
$ tar -zxvf rinetd.tar.gz
# Enter the depressure directory
$ cd rinetd
# Modify rinnetd.c in directory, change port range
$ sed -i 's/65536/65535/g' rinetd.c
# Create a rinted dependent directory, which is mandatory for the software, which must be created manually
$ mkdir -p /usr/man/
# Installation of a C-language compiler
$ yum install -y gcc
# Compile and install
$ make && make install
```

## Configuring Rinetd

We need to add the configuration file `/etc/rinetd.conf`.

```shell
$ vim /etc/rinetd.conf
# Add IP map, which means forwarding all requests for access to the 8000 port on the virtual IP 10.99.16.131 mouth
0.0.0.0 8000 10.99.160.131 8000
# Or direct execution of echo "0.0.0.0.8000 10.99.160.131.800 " /etc/rined.conf
```

## Running Rinetd.conf

```shell
$ rinetd -c /etc/rinetd.conf
```

### Checking the Port Mapping

Use `netstat -nptl` to verify that port 8000 is open on `rinetd`.

![image-20210115183018503](https://cdn1.jalen-qian.com/20210115183018AlcBvEmeGi.png)

Use the following address in a browser to access the service provided by `rinted + service`:

http://192.168.233.128:8000/test/index.jsp

![image-20210115183103354](https://cdn1.jalen-qian.com/20210115183103cf3vhLluin.png)
