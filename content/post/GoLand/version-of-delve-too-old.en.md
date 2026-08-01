---
title: "GoLand Debug Error: Version of Delve Is Too Old for..."
date: 2020-09-15
lastmod: 2020-09-15
draft: false
tags: ["GoLand"]
categories: ["GoLand"]
author: "jalen"
---

## Problem Description

> A few days ago, I upgraded Go to `go1.14`. When I needed to debug some code, GoLand displayed the following error:
>
> <span style="color:red">Version of Delve is too old for this version of Go(maximum supported version 1.12, suppress this error with --check-go-version=false)</span>

![Problem](https://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200915183807.png)

This issue occurs because Go 1.14 does not install the `delve` tool by default, while `debug` requires it.

## Solution

### Download Delve

Open a terminal and navigate to the `$GOPATH\src` directory (`$GOPATH` is the goPath directory configured on your computer; mine, for example, is `C:\Jalen\Programming\GoPath\src`), then run the following command:

```
go get -u github.com/go-delve/delve/cmd/dlv
```

This process may take a while because it downloads the Delve package locally and compiles it into an executable file.

If the command succeeds, it will create the `\github.com\go-delve\delve\` folder under the `src` directory and download the `delve` project into it, as shown below:

![](https://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200915222715.png?imageView2/2/w/450)

At the same time, the compiled `dlv.exe` file will be generated in the `$GOPATH\bin\` directory, as shown below:

![](https://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200915223303.png)

### Solution for Download Failures

On some computers, running `go get -u github.com/go-delve/delve/cmd/dlv` may hang with no response in the command line, and the `dlv.exe` file is not generated. In this case, we can manually download the Delve project locally.

1. Create the `$GOPATH\src\github.com\go-delve\` folder.

2. In this folder, run `git clone https://github.com/go-delve/delve.git` to clone the project code locally.

3. Navigate to `$GOPATH\src\github.com\go-delve\delve` in the terminal and run the following command:

```
go install github.com/go-delve/delve/cmd/dlv
```

4. After the command finishes, the `dlv.exe` executable file will be generated in the `$GOPATH\bin` directory.

5. Configure GoLand to use this file by clicking **Help > Edit Custom Properties...**, as shown below.

If you have not configured this in GoLand before, a `create` dialog box will appear. Click `create`.

![image-20200915224704239](https://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200915224801.png)

![create](https://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200915225207.png?imageView2/2/w/500)

6. Enter `dlv.path=$GOPATH\bin\dlv.exe`. For example, on my computer, I entered:

```
# custom GoLand properties
dlv.path=C:\\Jalen\\Programming\\GoPath\\bin\\dlv.exe
```

Note that on Windows, you need to use double backslashes in the path: `\\`. **You can also use forward slashes: `/`.**

7. Restart GoLand, and you will be able to use the debugger normally. Problem solved! ^_^
