---
title: "Hugo常用命令"
date: 2020-09-10T08:37:56+08:00
lastmod: 2020-09-10T01:37:56+08:00
draft: false
tags: ["hugo"]
categories: ["hugo"]
author: "Jalen"

contentCopyright: '<a rel="license noopener" href="https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License" target="_blank">Creative Commons Attribution-ShareAlike License</a>'


---

hugo是基于命令行的静态网站生成工具, 掌握基本的命令是很有必要的.

## 常用命令列表

通过`hugo help`命令可以获取hugo命令行的帮助文档. 下面会对每个命令做更详细的一些介绍. 在开始之前需要先在本机安装hugo, 并在环境变量中配置好hugo.

### hugo new site

创建一个新的网站(骨架), 例如: hugo new site mysite , 他会在当前目录下创建一个mysite的文件夹, 并在其中填充必须的必须的目录和文件. 也可以指定具体的路径来创建新的网站. 下面是mysite文件夹的结构

```bash
├─archetypes
├─content
├─data
├─layouts
├─resources
│  └─_gen
│      ├─assets
│      └─images
├─static
└─themes
    └─study-theme
        ├─archetypes
        ├─layouts
        │  ├─partials
        │  └─_default
        └─static
            ├─css
            └─js
``` 

content文件夹里面就是用于生成网站的”原材料”, themes里面放的是网站的UI, hugo就是靠这些来创建静态网站的.

### hugo new

添加网站内容. 例如: hugo new about.md, 他会在content目录下生成一个about.md的文件, 根据这个文件可以生成对应的静态页面. 可以在about.md前面添加对应的路径, 但文件会以content为根目录, 也就是说所有添加新文件都会存放在content目录下面.

### hugo new theme

为网站添加UI, 也就是模板文件/主题文件. 例如: hugo new theme mytheme. 这会在themes目录下创建一个mytheme目录, mytheme目录中会默认添加一些基本的文件结构. 所有的模板/主题文件都会保存在themes目录中.

### hugo

hugo本身就是一个命令, 他的作用就是生成静态网站, 默认在生成的静态文件保存在public目录中. 也可以指定路.

### hugo server

hugo自带一个web服务器, 运行hugo server后可以通过 [http://localhost:1313](http://localhost:1313/) 来访问静态网站. 不需要自己去构建服务器环境, 还是很方便的.

下面是`hugo server`常用的参数, 注意大小写:

- `-p 端口`: 修改默认端口
- `-D`: 在使用server预览网站时, draft属性为ture的草稿文件是不会生成预览的. 添加-D后可以预览草稿文件.