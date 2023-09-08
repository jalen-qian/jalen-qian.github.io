---
title: "mac安装并激活Typora"
Image: http://cdn1.jalen-qian.com/Jalen/20230909002959sJgfBGQ7lE.webp
date: 2023-09-08T22:58:56+08:00
lastmod: 2023-09-08T22:58:56+08:00
draft: false
keywords: []
description: ""
tags: [""]
categories: ["实践"]
author: "Jalen"
---

> [Typora](https://typoraio.cn)是一款非常好用的Markdown编辑器，能做到所见即所得，同时支持丰富的样式和数学公式等。刚好最近更换了mac电脑，就研究了下如何在mac上安装和激活Typora.

# 一、安装Typora

## 1. 下载安装镜像文件

进入Typora的[中文官网typoraio.cn](https://typoraio.cn) 或者进入[https://typora.io](https://typora.io)，下载安装包。个人试了下在国内官网好像是无法访问的，中国官网可以。

<img src="http://cdn1.jalen-qian.com/Jalen/20230908234853J3OD1R2fT0.png" alt="image-20230908234853299" style="zoom: 50%;" />

点击上图中的**立即下载**按钮，下载mac版本的安装包。默认会下载到mac的`/Users/{user}/Downloads`目录，也就是下载目录。

打开访达，进入下载文件目录，能看到下载的Typora安装镜像文件`Typora.dmg`。

![image-20230908235610641](http://cdn1.jalen-qian.com/Jalen/2023090823561037HmqQlYLb.png)

## 2. 安装

双击镜像文件，并拖动到应用程序中，完成安装。mac电脑系统安装应用程序就是如此简单。

<img src="http://cdn1.jalen-qian.com/Jalen/2023090823591415rIFSBYe9.png" alt="image-20230908235914499" style="zoom: 50%;" />

此时打开Typora，是未激活的状态，但是有14天的免费使用期限。

# 二、激活Typora

打开访达，输入快捷键`Command+Shift+G` 快捷进入目录，并输入 `/Applications/Typora.app/Contents/Resources/TypeMark`并回车，快速进入目录。

![image-20230909000558883](http://cdn1.jalen-qian.com/Jalen/20230909000558GDN7A2H6Ve.png)

将这个目录在编辑器中打开，比如拖动到VsCode中，比较方便操作。为了方便没有安装VsCode的同学，我这里直接打开。

找到这个目录下的下面这个文件。

```
page-dist/static/js/LicenseIndex.180dd4c7.54395836.chunk.js
```

![image-20230909001445550](http://cdn1.jalen-qian.com/Jalen/20230909001445Ry8SKzAna2.png)

用文本编辑器打开这个文件，搜索`hasActivated="true"==e.hasActivated`,并将这段替换为**`hasActivated="true"=="true"`**，记得保存哦。

<img src="http://cdn1.jalen-qian.com/Jalen/20230909001801Xkhgqo14aO.png" alt="image-20230909001801932" style="zoom:50%;" />

保存之后，重新打开Typora，并点击左上角 Typora菜单->我的许可证，会发现已经激活成功了！

![image-20230909002004443](http://cdn1.jalen-qian.com/Jalen/20230909002004j8V1nRAloQ.png)



（完）