---
title: "Go Fundamentals: Arrays"
date: 2020-09-10T17:17:28+08:00
lastmod: 2020-10-20T17:17:28+08:00
draft: false
keywords: ["Go语言基础"]
description: ""
tags: ["Golang"]
categories: ["Golang Column"]
author: "Jalen"
---

This article introduces arrays and their basic usage in Go.

# Array

An array is a collection of elements of the same data type. In Go, an array's size is determined when it is declared. Its elements can be modified, but its size cannot be changed. The basic syntax is:

```go
// 定义一个长度为3元素类型为int的数组a
var a [3]int
```

## Array Definition

```bash
var 数组变量名 [元素数量]T
```

For example: `var a [5]int`. The length of an array must be a constant, and the length is part of the array's type. Once defined, the length cannot be changed. `[5]int` and `[10]int` are different types.

```go
var a [3]int
var b [4]int
a = b //不可以这样做，因为此时a和b是不同的类型
```

Array elements can be accessed by index. Indexes start at `0`, and the index of the last element is `len-1`. Accessing an index outside the valid range causes an out-of-bounds access and triggers a panic.

## Array Initialization

There are several ways to initialize an array.

### Method 1

When initializing an array, you can use an initializer list to set the values of its elements.

```go
func main() {
    var testArray [3]int                        //数组会初始化为int类型的零值
    var numArray = [3]int{1, 2}                 //使用指定的初始值完成初始化
    var cityArray = [3]string{"北京", "上海", "深圳"} //使用指定的初始值完成初始化
    fmt.Println(testArray)                      //[0 0 0]
    fmt.Println(numArray)                       //[1 2 0]
    fmt.Println(cityArray)                      //[北京 上海 深圳]
}
```

### Method 2

With the method above, you must ensure that the number of initial values matches the array length. Generally, you can let the compiler infer the array length from the number of initial values. For example:

```go
func main() {
    var testArray [3]int
    var numArray = [...]int{1, 2}
    var cityArray = [...]string{"北京", "上海", "深圳"}
    fmt.Println(testArray)                          //[0 0 0]
    fmt.Println(numArray)                           //[1 2]
    fmt.Printf("type of numArray:%T\n", numArray)   //type of numArray:[2]int
    fmt.Println(cityArray)                          //[北京 上海 深圳]
    fmt.Printf("type of cityArray:%T\n", cityArray) //type of cityArray:[3]string
}
```

### Method 3

You can also initialize an array by specifying values at particular indexes. For example:

```go
func main() {
    a := [...]int{1: 1, 3: 5}
    fmt.Println(a)                  // [0 1 0 5]
    fmt.Printf("type of a:%T\n", a) //type of a:[4]int
}
```

## Iterating Over an Array

There are two ways to iterate over array `a`:

```go
func main() {
    var a = [...]string{"北京", "上海", "深圳"}
    // 方法1：for循环遍历
    for i := 0; i < len(a); i++ {
        fmt.Println(a[i])
    }

    // 方法2：for range遍历
    for index, value := range a {
        fmt.Println(index, value)
    }
}
```

## Multidimensional Arrays

Go supports multidimensional arrays. Here, we use a two-dimensional array as an example—an array containing nested arrays.

### Defining a Two-Dimensional Array

```go
func main() {
    a := [3][2]string{
        {"北京", "上海"},
        {"广州", "深圳"},
        {"成都", "重庆"},
    }
    fmt.Println(a) //[[北京 上海] [广州 深圳] [成都 重庆]]
    fmt.Println(a[2][1]) //支持索引取值:重庆
}
```

### Iterating Over a Two-Dimensional Array

```go
func main() {
    a := [3][2]string{
        {"北京", "上海"},
        {"广州", "深圳"},
        {"成都", "重庆"},
    }
    for _, v1 := range a {
        for _, v2 := range v1 {
            fmt.Printf("%s\t", v2)
        }
        fmt.Println()
    }
}
```

Output:

```bash
北京    上海    
广州    深圳    
成都    重庆    
```

**Note:** For multidimensional arrays, **only the first dimension** can use `...` to let the compiler infer the array length. For example:

```go
//支持的写法
a := [...][2]string{
    {"北京", "上海"},
    {"广州", "深圳"},
    {"成都", "重庆"},
}
//不支持多维数组的内层使用...
b := [3][...]string{
    {"北京", "上海"},
    {"广州", "深圳"},
    {"成都", "重庆"},
}
```

## Arrays Are Value Types

Arrays are value types. Assigning or passing an array as an argument copies the entire array. Therefore, modifying the copy does not affect the original array.

```go
func modifyArray(x [3]int) {
    x[0] = 100
}

func modifyArray2(x [3][2]int) {
    x[2][0] = 100
}
func main() {
    a := [3]int{10, 20, 30}
    modifyArray(a) //在modify中修改的是a的副本x
    fmt.Println(a) //[10 20 30]
    b := [3][2]int{
        {1, 1},
        {1, 1},
        {1, 1},
    }
    modifyArray2(b) //在modify中修改的是b的副本x
    fmt.Println(b)  //[[1 1] [1 1] [1 1]]
}
```

**Notes:**

1. Arrays support the `==` and `!=` operators because their memory is always initialized.
2. `[n]*T` represents an array of pointers, while `*[n]T` represents a pointer to an array.

## Exercises

1. Calculate the sum of all elements in the array `[1, 3, 5, 7, 8]`.
2. Find the indexes of two elements in an array whose sum equals a specified value. For example, in the array `[1, 3, 5, 7, 8]`, the indexes of the two elements whose sum is 8 are `(0,3)` and `(1,2)`.
