---
title: "Go语言基础之切片"
date: 2021-08-04T16:41:45+08:00
lastmod: 2021-08-04T16:41:45+08:00
draft: false
tags: ["Golang"]
categories: ["Golang专栏"]
author: "Jalen"

contentCopyright: '<a rel="license noopener" href="https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License" target="_blank">Creative Commons Attribution-ShareAlike License</a>'
---

> 本文主要介绍Go语言中的数据结构`slice`，以及基本使用

# 前言

之前介绍了Go语言中的数组，数组的长度是固定的，并且数组长度是类型的一部分，所以使用数组有许多限制，比如对数组求和：

```go
func arraySum(arr [3]int) {
	sum := 0
	for _, v in range arr{
        sum = sum + v
	}
	return sum
}
```
这个求和函数只支持`[3]int`类型，其他类型都不支持了。
再比如：
```go
var a = [3]int{1, 2, 3}
```
a中最多只能有3个元素，无法增加更多的元素。

# 切片
切片（**slice**）是一组相同类型元素的可变长度的数据结构，是对数组类型的抽象。切片非常灵活，支持动态扩容。

切片是对数组的封装，属于引用类型，而不是值类型。一个切片的内部，包含了`容量` 、`长度` 和 `指针`。

## 切片的定义
声明切片的语法如下：
```go
var name []T // T指对应的类型
```
- name ：变量名
- T : 切片内元素的类型

示例如下：
```go
func main() {
	i := 10
	// 声明切片类型
	var a []string              // 声明string类型切片
	var b = []int{}             // 声明int类型切片，并初始化
	var c = []bool{true, false} // 声明bool类型的切片并初始化
	var d = []*int{&i, nil}     // 声明一个整型指针类型，并初始化
	var e = []bool{true, false} // 声明一个bool类型的切片，并初始化
	fmt.Println(a)              // []
	fmt.Println(b)              // []
	fmt.Println(c)              // [true false]
	fmt.Println(d)              // [0xc0000aa058 <nil>]
	fmt.Println(a == nil)       // true
	fmt.Println(b == nil)       // false
	fmt.Println(c == nil)       // false
	fmt.Println(d == nil)       // false
	fmt.Println(c == e)         // 切片不是值类型，只能和nil比较。Invalid operation: c==e (the operator == is not defined on []bool)
}
```

## 切片的长度和容量
前面提到，切片内部封装了`容量` 、`长度`，我们可以使用Go语言内置的`len()`函数求切片的长度，使用`cap()`函数求切片容量。

```go
var a []int
fmt.Printf("len(a):%v, cap(a):%v\n", len(a), cap(a)) // len(a):0, cap(a):0

b := []int{1, 2, 3}
fmt.Printf("len(b):%v, cap(b):%v\n", len(b), cap(b)) // len(b):3, cap(b):3
```

## 切片表达式
切片表达式的写法比如：`var a = b[2:3]`，其中，这里的`b`变量可以是字符串、数组、或者切片类型。
切片表达式是一种可以从字符串、数组、或者切片构造子字符串和子切片的一种语法。（从数组用切片表达式生成的是切片）

切片表达式有两种形式：