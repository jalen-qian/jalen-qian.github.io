---
title: "GoLand Debug出现Version Of Delve is too old for..."
date: 2020-09-15
lastmod: 2020-09-15
draft: false
tags: ["GoLand"]
categories: ["GoLand"]
author: "jalen"
---

## 问题描述

> 前几天升级了Go版本到`go1.14`,写程序的时候有段代码需要debug调试，GoLand出现如下的错误：
>
> <span style="color:red">Version of Delve is too old for this version of Go(maximum supported version 1.12, suppress this error with --check-go-version=false)</span>

![问题](https://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200915183807.png)

这个问题出现的原因是因为Go1.14版本默认没有安装 `delve` 这个工具，而`debug`需要用到

## 解决办法

### 下载delve

打开终端，进入到`$GOPATH\src`目录下（`$GOPATH`是你在自己电脑中配置的goPath目录，比如我的是`C:\Jalen\Programming\GoPath\src`），执行以下命令

```
go get -u github.com/go-delve/delve/cmd/dlv
```

这个执行过程会有些慢，因为会下载delve包到本地，并编译成可执行文件。

如果执行成功，会在`src`目录下创建`\github.com\go-delve\delve\`文件夹，并将`delve`项目下载到此目录，如下图所示：

![](https://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200915222715.png?imageView2/2/w/450)

同时，`$GOPATH\bin\`目录下，会生成编译好了的`dlv.exe`文件，如下：

![](https://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200915223303.png)

### 下载失败解决办法

有些朋友的电脑上，执行`go get -u github.com/go-delve/delve/cmd/dlv`时，会卡住了，命令行没有反应，而且`dlv.exe`文件也没有生成，这个时候我们可以手动下载delve项目到本地

1.创建`$GOPATH\src\github.com\go-delve\`文件夹

2.在该文件夹下，执行`git clone https://github.com/go-delve/delve.git`将项目代码克隆到本地

3.从终端进入`$GOPATH\src\github.com\go-delve\delve`，执行下面的命令

```
go install github.com/go-delve/delve/cmd/dlv
```

4.执行完之后，在`$GOPATH\bin`目录下，会生成`dlv.exe`可执行文件

5.将这个文件绑定到GoLand，点击Help-Edit Custom Properties...这个选项，如下图所示

这时候如果你的GoLand没有添加过，会弹出一个`create`的框，点击`create`即可

![image-20200915224704239](https://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200915224801.png)

![create](https://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200915225207.png?imageView2/2/w/500)

6.输入`dlv.path=$GOPATH\bin\dlv.exe`，比如我的电脑上，输入的是

```
# custom GoLand properties
dlv.path=C:\\Jalen\\Programming\\GoPath\\bin\\dlv.exe
```

注意windows下你需要用双反斜线表示路径`\\`，**也可以用正斜线`/`**

7.重启GoLand，就可以正常使用Debug啦，这个问题完美解决^_^