---
title: "Go Interview Question: Use Three Goroutines to Print cat, dog, and fish 100 Times Each in Sequence"
date: 2023-09-11T19:16:31+08:00
lastmod: 2023-09-11T19:16:31+08:00
draft: false
keywords: []
description: ""
tags: ["Interview Questions"]
categories: ["Golang Series"]
author: "钱文军"
---

# Interview Question

This is a classic Golang interview question that tests your understanding of channels. The requirements are as follows:

1. Start three goroutines.
2. The three goroutines must print `cat dog fish cat dog fish...` in sequence.
3. Each goroutine must print 100 times, for a total of 300 outputs.

# Implementation Approach

We will refer to the three goroutines as `g0`, `g1`, and `g2`. Since they must print alternately in sequence, when `g0` is running, `g1` and `g2` need to block and wait. After `g0` finishes, it must notify `g1` to run. After `g1` finishes, it must notify `g2`, and so on.

We know that receiving a message from an unbuffered channel, or from a buffered channel whose buffer is empty, causes the goroutine to block and wait. Therefore, we can pass two channels to each printing goroutine: one for receiving a signal to execute, and another for notifying the next goroutine to execute.

At the same time, we can use a `sync.waitGroup` to block the main goroutine until all child goroutines have finished.

# Implementation Code

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

# Code Execution

The output is as follows:

![image-20230911195718738](http://cdn1.jalen-qian.com/Jalen/20230911195718p4gM9lkzbt.png)

# Further Considerations

In the code above, can the following three lines be changed to initialize unbuffered channels? If not, why?

```go
chCatOk := make(chan struct{}, 1)
chDogOk := make(chan struct{}, 1)
chFishOk := make(chan struct{}, 1)
```

(The End)
