---
title: "How to Delete a Namespace Stuck in the Terminating State"
date: 2023-10-08T18:48:17+08:00
lastmod: 2023-10-08T18:48:17+08:00
draft: false
keywords: []
description: ""
tags: ["Kubernetes"]
categories: ["Kubernetes"]
author: "Wenjun Qian"
---

# How to Delete a Namespace Stuck in the Terminating State

![image-20231008185617416](http://cdn1.jalen-qian.com/Jalen/202310081856178lBSXGWXdL.png)

> Sometimes, after using `kubectl delete ns xxx` to delete a namespace, you may find that the namespace does not disappear and remains in the Terminating state for a long time. This may occur because the kubelet is blocked, indicating that other resources are still using the namespace. Restarting the kubelet and trying to delete it again may not work, and even forcing the deletion with the following command may fail.

```shell
kubectl delete ns <namespace-name> --force --grace-period=0
```



# Solution

## 1. Find the Namespace in the Terminating State


```shell
kubectl get ns
```

## 2. Retrieve the Namespace Resource

Use the following command to retrieve the namespace resource file in JSON format, and inspect the `finalizer` property under `spec`.

```shell
kubectl get namespace <namespace-name> -o json
```

We can see the namespace information:

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

## 3. Save the JSON File Locally

You can use the following command to save the file directly, or copy and save it manually.

```shell
kubectl get namespace <namespace-name> -o json >ns.json
```

After running the command, you will find a new file named `ns.json` locally. You may also use any other filename.

## 4. Edit `ns.json` and Set `finalizers` to an Empty Array

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

## 5. Start the Proxy Using `kubectl`

```shell
kubectl proxy
```

By default, this command starts a proxy service on local port 8001 to proxy the Kubernetes cluster API. Once it is running, we can use the API endpoint on port 8001 to resolve this issue.

![image-20231008190834926](http://cdn1.jalen-qian.com/Jalen/20231008190835YYpiPkX4RT.png)

## 6. Call the API Using the Command

Open a new terminal window and run the following command:

```shell
curl -k -H "Content-Type: application/json" -X PUT --data-binary @ns.json http://127.0.0.1:8001/api/v1/namespaces/<namespace-name>/finalize
```

Replace `<namespace-name>` with the name of the namespace in the Terminating state. Run the command from the same directory where `ns.json` is located. In this example, it is the home directory.

The API call will output the following information:

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

## 7. Verify That the Namespace Has Been Deleted

```shell
kubectl get namespaces
```
