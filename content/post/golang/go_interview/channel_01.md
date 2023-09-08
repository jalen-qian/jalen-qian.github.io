---
title: "Go面试题：使用3个协程顺序打印cat、dog、fish各100次"
date: 2023-09-11T19:16:31+08:00
lastmod: 2023-09-11T19:16:31+08:00
draft: false
keywords: []
description: ""
tags: ["面试题"]
categories: ["Golang专栏"]
author: "钱文军"
---

# 面试题
这是一个比较经典的golang面试题，考察的是对channel的使用，下面是题目要求：
1. 启动3个协程处理
2. 3个协程依此输出 cat dog fish cat dog fish...依此类推
3. 每个协程各输出100次，一共300次。

# 实现思路
我们将3个协程分别称为g0,g1和g2，由于要交替依次输出，则g0执行时，g1和g2需要阻塞等待，同时g0执行完后，需要通知g1执行,g1执行完后，需要通知g2执行，依此类推。

我们知道，当从一个无缓冲区的channel接收消息，或者从一个有缓冲区，但是缓冲区为空的channel接收消息，都会阻塞等待。这样我们就可以给每个打印协程都传入两个channel,一个用来接收消息执行，一个用来通知下一个协程执行。

同时，我们可以使用一个`sync.waitGroup`来阻塞主协程等待子协程全部执行完。
# 实现代码如下
```go
package main

import (
	"fmt"
	"sync"
)

// 面试题：每个函数起一个goroutine,轮流打印 cat dog fish 各100次
// 3个goroutine, 打印顺序是 cat dog fish cat dog fish ... 依此类推
var wg sync.WaitGroup

func main() {
	chCatOk := make(chan struct{}, 1)
	chDogOk := make(chan struct{}, 1)
	chFishOk := make(chan struct{}, 1)
	wg.Add(3) // 有3个协程，所以加3
	go printAnimal("cat", chCatOk, chDogOk)
	go printAnimal("dog", chDogOk, chFishOk)
	go printAnimal("fish", chFishOk, chCatOk)
	// 先通知cat执行
	chCatOk <- struct{}{}
	wg.Wait()
	fmt.Println("执行结束")
}

func printAnimal(word string, ch1 <-chan struct{}, ch2 chan<- struct{}) {
	count := 0
	// 退出前标记完成
	defer wg.Done()
	for _ = range ch1 {
		fmt.Println(word)
		count++
		ch2 <- struct{}{} // 通知协程2你可以执行了
		if count == 100 {
			return
		}
	}
}

```

# 代码执行

执行效果如下：

![image-20230911195718738](http://cdn1.jalen-qian.com/Jalen/20230911195718p4gM9lkzbt.png)

# 题后思考

上面的代码中，下面3行能否改成初始化无缓冲区的channel？如果不能，为什么？

```go
chCatOk := make(chan struct{}, 1)
chDogOk := make(chan struct{}, 1)
chFishOk := make(chan struct{}, 1)
```

（完）
