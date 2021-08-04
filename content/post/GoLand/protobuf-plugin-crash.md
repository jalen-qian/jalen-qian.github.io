---
title: "GoLand 安装了protobuf插件导致启动闪退问题"
date: 2021-04-15
lastmod: 2021-04-15
draft: false
tags: ["GoLand", "Idea"]
categories: ["GoLand", "Idea"]
author: "Jalen"
---

## 问题描述

> 在用Goland编写`proto`文件时，编辑器提示安装proto插件，手欠点击了安装。下次启动Goland时，直接就闪退了。

![image-20210415145243661](http://cdn1.jalen-qian.com/Hugo/202104151452442aNsHDGzUy.png)

> 查找IDEA的日志文件
>
> 日志文件路径：我的是windows系统，在 `%APPDATA%\JetBrains\Local\JetBrains\<product><version>\plugins` ， 比如我的是：`C:\Users\qianwj01\AppData\Local\JetBrains\GoLand2021.1\log`
>
> 发现如下的报错：

```
2021-04-15 11:41:56,788 [   2074]  ERROR - Types.impl.FileTypeManagerImpl - Trying to override already registered file type 'prototext' [Plugin: idea.plugin.protoeditor] 
com.intellij.diagnostic.PluginException: Trying to override already registered file type 'prototext' [Plugin: idea.plugin.protoeditor]
	at com.intellij.openapi.fileTypes.impl.FileTypeManagerImpl.loadFileTypeBeans(FileTypeManagerImpl.java:341)
	at com.intellij.openapi.fileTypes.impl.FileTypeManagerImpl.initStandardFileTypes(FileTypeManagerImpl.java:232)
	at com.intellij.openapi.fileTypes.impl.FileTypeManagerImpl.<init>(FileTypeManagerImpl.java:177)
	at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
	at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
	at java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
	at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:490)
	at com.intellij.serviceContainer.ConstructorInjectionKt.instantiateUsingPicoContainer(constructorInjection.kt:47)
	at com.intellij.serviceContainer.ComponentManagerImpl.instantiateClassWithConstructorInjection(ComponentManagerImpl.kt:733)
	at com.intellij.serviceContainer.ServiceComponentAdapter.createAndInitialize(ServiceComponentAdapter.kt:49)
	at com.intellij.serviceContainer.ServiceComponentAdapter.doCreateInstance(ServiceComponentAdapter.kt:37)
	at com.intellij.serviceContainer.BaseComponentAdapter.getInstanceUncached(BaseComponentAdapter.kt:113)
	at com.intellij.serviceContainer.BaseComponentAdapter.getInstance(BaseComponentAdapter.kt:67)
	at com.intellij.serviceContainer.BaseComponentAdapter.getInstance$default(BaseComponentAdapter.kt:60)
	at com.intellij.serviceContainer.ComponentManagerImpl$preloadServices$future$1.run(ComponentManagerImpl.kt:890)
	at java.base/java.util.concurrent.CompletableFuture$AsyncRun.run(CompletableFuture.java:1736)
	at com.intellij.util.concurrency.BoundedTaskExecutor.doRun(BoundedTaskExecutor.java:216)
	at com.intellij.util.concurrency.BoundedTaskExecutor.access$200(BoundedTaskExecutor.java:27)
	at com.intellij.util.concurrency.BoundedTaskExecutor$1.execute(BoundedTaskExecutor.java:195)
	at com.intellij.util.concurrency.BoundedTaskExecutor$1.run(BoundedTaskExecutor.java:187)
	at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1128)
	at java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:628)
	at java.base/java.util.concurrent.Executors$PrivilegedThreadFactory$1$1.run(Executors.java:668)
	at java.base/java.util.concurrent.Executors$PrivilegedThreadFactory$1$1.run(Executors.java:665)
	at java.base/java.security.AccessController.doPrivileged(Native Method)
	at java.base/java.util.concurrent.Executors$PrivilegedThreadFactory$1.run(Executors.java:665)
	at java.base/java.lang.Thread.run(Thread.java:834)
2021-04-15 11:41:56,789 [   2075]  ERROR - Types.impl.FileTypeManagerImpl - GoLand 2020.3.2  Build #GO-203.7148.71 
2021-04-15 11:41:56,789 [   2075]  ERROR - Types.impl.FileTypeManagerImpl - JDK: 11.0.9.1; VM: OpenJDK 64-Bit Server VM; Vendor: JetBrains s.r.o. 
2021-04-15 11:41:56,789 [   2075]  ERROR - Types.impl.FileTypeManagerImpl - OS: Windows 10 
2021-04-15 11:41:56,789 [   2075]  ERROR - Types.impl.FileTypeManagerImpl - Plugin to blame: Protocol Buffer Editor version: 2.2.1 
```

```
2021-04-15 14:35:38,854 [   1399]  ERROR - Types.impl.FileTypeManagerImpl - Trying to override already registered file type 'protobuf' [Plugin: idea.plugin.protoeditor] 
com.intellij.diagnostic.PluginException: Trying to override already registered file type 'protobuf' [Plugin: idea.plugin.protoeditor]
	at com.intellij.openapi.fileTypes.impl.FileTypeManagerImpl.loadFileTypeBeans(FileTypeManagerImpl.java:342)
	at com.intellij.openapi.fileTypes.impl.FileTypeManagerImpl.initStandardFileTypes(FileTypeManagerImpl.java:233)
	at com.intellij.openapi.fileTypes.impl.FileTypeManagerImpl.<init>(FileTypeManagerImpl.java:178)
	at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
	at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
	at java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
	at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:490)
	at com.intellij.serviceContainer.ConstructorInjectionKt.instantiateUsingPicoContainer(constructorInjection.kt:47)
	at com.intellij.serviceContainer.ComponentManagerImpl.instantiateClassWithConstructorInjection(ComponentManagerImpl.kt:771)
	at com.intellij.serviceContainer.ServiceComponentAdapter.createAndInitialize(ServiceComponentAdapter.kt:49)
	at com.intellij.serviceContainer.ServiceComponentAdapter.doCreateInstance(ServiceComponentAdapter.kt:37)
	at com.intellij.serviceContainer.BaseComponentAdapter.getInstanceUncached(BaseComponentAdapter.kt:110)
	at com.intellij.serviceContainer.BaseComponentAdapter.getInstance(BaseComponentAdapter.kt:64)
	at com.intellij.serviceContainer.BaseComponentAdapter.getInstance$default(BaseComponentAdapter.kt:57)
	at com.intellij.serviceContainer.ComponentManagerImpl$preloadServices$future$1.run(ComponentManagerImpl.kt:906)
	at java.base/java.util.concurrent.CompletableFuture$AsyncRun.run(CompletableFuture.java:1736)
	at com.intellij.util.concurrency.BoundedTaskExecutor.doRun(BoundedTaskExecutor.java:216)
	at com.intellij.util.concurrency.BoundedTaskExecutor.access$200(BoundedTaskExecutor.java:27)
	at com.intellij.util.concurrency.BoundedTaskExecutor$1.execute(BoundedTaskExecutor.java:195)
	at com.intellij.util.concurrency.BoundedTaskExecutor$1.run(BoundedTaskExecutor.java:187)
	at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1128)
	at java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:628)
	at java.base/java.util.concurrent.Executors$PrivilegedThreadFactory$1$1.run(Executors.java:668)
	at java.base/java.util.concurrent.Executors$PrivilegedThreadFactory$1$1.run(Executors.java:665)
	at java.base/java.security.AccessController.doPrivileged(Native Method)
	at java.base/java.util.concurrent.Executors$PrivilegedThreadFactory$1.run(Executors.java:665)
	at java.base/java.lang.Thread.run(Thread.java:834)
```

## 解决办法

1. 找到`protobuf`插件保存的位置 可参考 https://www.jetbrains.com/help/idea/tuning-the-ide.html#plugins-directory
2. 删除文件
