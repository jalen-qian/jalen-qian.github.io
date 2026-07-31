---
title: "GoLand Crashes on Startup After Installing the Protobuf Plugin"
date: 2021-04-15
lastmod: 2021-04-15
draft: false
tags: ["GoLand", "IDEA"]
categories: ["GoLand", "IDEA"]
author: "Jalen"
---

## Problem Description

> While editing an `proto` file in GoLand, the editor prompted me to install the proto plugin, and I clicked Install. The next time I started GoLand, it crashed immediately.

![image-20210415145243661](http://cdn1.jalen-qian.com/Hugo/202104151452442aNsHDGzUy.png)

> Locate the IDEA log file.
>
> Log file path: I am using Windows, so it is located at `%APPDATA%\JetBrains\Local\JetBrains\<product><version>\plugins`. For example, mine is: `C:\Users\qianwj01\AppData\Local\JetBrains\GoLand2021.1\log`
>
> The following errors were found:

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

## Solution

1. Locate the directory where the `protobuf` plugin is stored. For reference, see https://www.jetbrains.com/help/idea/tuning-the-ide.html#plugins-directory
2. Delete the files
