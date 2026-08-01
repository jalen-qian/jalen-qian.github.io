---
title: "Installing and Activating Typora on macOS"
Image: https://cdn1.jalen-qian.com/Jalen/20230909002959sJgfBGQ7lE.webp
date: 2023-09-08T22:58:56+08:00
lastmod: 2023-09-08T22:58:56+08:00
draft: false
keywords: []
description: ""
tags: [""]
categories: ["Practice"]
author: "Jalen"
---

> [Typora](https://typoraio.cn) is an excellent Markdown editor that provides a WYSIWYG editing experience while supporting rich styles, mathematical formulas, and more. Since I recently switched to a Mac, I looked into how to install and activate Typora on macOS.

# 1. Installing Typora

## 1. Download the Installation Image

Go to Typora's [Chinese website, typoraio.cn](https://typoraio.cn), or visit [https://typora.io](https://typora.io) to download the installer. In my experience, the international website seems to be inaccessible from mainland China, while the Chinese website works.

<img src="https://cdn1.jalen-qian.com/Jalen/20230908234853J3OD1R2fT0.png" alt="image-20230908234853299" style="zoom: 50%;" />

Click the **Download Now** button shown above to download the macOS installer. By default, it will be downloaded to the Mac's `/Users/{user}/Downloads` directory, which is the Downloads folder.

Open Finder and navigate to the Downloads folder. You should see the downloaded Typora installation image, `Typora.dmg`.

![image-20230908235610641](https://cdn1.jalen-qian.com/Jalen/2023090823561037HmqQlYLb.png)

## 2. Install Typora

Double-click the image file, then drag Typora into the Applications folder to complete the installation. Installing applications on macOS is that simple.

![img-2023090823591415rIFSBYe9](https://cdn1.jalen-qian.com/Jalen/2023090823591415rIFSBYe9.png)

When you open Typora, it will not yet be activated, but you can use it for free for 14 days.

# 2. Activating Typora

Open Finder and press `Command+Shift+G` to quickly open the directory navigation dialog. Enter `/Applications/Typora.app/Contents/Resources/TypeMark` and press Enter to navigate to the directory.

![image-20230909000558883](https://cdn1.jalen-qian.com/Jalen/20230909000558GDN7A2H6Ve.png)

Open this directory in an editor. For example, you can drag it into VS Code for easier operation. For those who do not have VS Code installed, I will open the file directly here.

Locate the following file in this directory:

```
page-dist/static/js/LicenseIndex.180dd4c7.54395836.chunk.js
```

![image-20230909001445550](https://cdn1.jalen-qian.com/Jalen/20230909001445Ry8SKzAna2.png)

Open the file in a text editor, search for `hasActivated="true"==e.hasActivated`, and replace it with **`hasActivated="true"=="true"`**. Remember to save the file.

![image-20230909001801932](https://cdn1.jalen-qian.com/Jalen/20230909001801Xkhgqo14aO.png)

After saving the file, reopen Typora and click Typora in the upper-left menu, then select My License. You will see that Typora has been successfully activated!

![image-20230909002004443](https://cdn1.jalen-qian.com/Jalen/20230909002004j8V1nRAloQ.png)



(The End)
