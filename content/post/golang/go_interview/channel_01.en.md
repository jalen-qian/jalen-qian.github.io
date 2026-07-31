---
title: "Go Interview Question: Use Three Goroutines to Print cat, dog, and fish 100 Times Each in Sequence"
date: 2023-09-11T19:16:31+08:00
lastmod: 2023-09-11T19:16:31+08:00
draft: false
keywords: []
description: ""
tags: ["Interview Questions"]
categories: ["Golang Series"]
author: "Wenjun Qian"
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

// Interview questions: one goroutine per function, printing cat dog fish every 100 times
// 3 Goroutine, print order is cat dog fish cat dog fish... and so on.
var wg sync.WaitGroup

func main() {
	chCatOk := make(chan struct{}, 1)
	chDogOk := make(chan struct{}, 1)
	chFishOk := make(chan struct{}, 1)
	wg.Add(3) // There were three courses, so I added three.
	go printAnimal("cat", chCatOk, chDogOk)
	go printAnimal("dog", chDogOk, chFishOk)
	go printAnimal("fish", chFishOk, chCatOk)
	// Notify cat first.
	chCatOk <- struct{}{}
	wg.Wait()
	fmt.Println("执行结束")
}

func printAnimal(word string, ch1 <-chan struct{}, ch2 chan<- struct{}) {
	count := 0
	// Mark completed before exit
	defer wg.Done()
	for _ = range ch1 {
		fmt.Println(word)
		count++
		ch2 <- struct{}{} // Notify goroutine 2 that it may proceed.
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
