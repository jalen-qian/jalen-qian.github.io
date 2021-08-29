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
切片表达式的写法比如：`var a = b[low:high]`，其中，这里的`b`变量可以是**字符串、数组、切片或者指向数组和切片的指针类型**。
切片表达式是一种可以从字符串、数组、数组指针或者切片构造子字符串或者子切片的一种语法。（注意：从数组用切片表达式生成的是切片）

切片表达式有两种形式：
1. 简单的切片表达式，`var a = b[low:high]`，拥有两个索引界值。
2. 完整的切片表达式，`var a = b[low:high:size]`，除了拥有两个索引界值以外，还指定切片容量的索引位置。

### 简单的切片表达式
切片是对数组的封装，其底层是一个数组。所以可以基于数组通过切片表达式得到一个切片。切片表达式

```go
var a = b[low:high]
```

中的 `low` 和 `high` 分别表示左边界（**包含**）和右边界（**不包含**），切片长度是 `high - low`，切片容量是操作对象的长度。

如下面的代码，切片 `s` 取的是数组 `a`中索引位置 `1 <= 索引 < 4` 的元素，
切片长度是 `4 - 1 = 3`，容量是数组长度 `5`

```go
func main(){
    a := [5]int{1, 2, 3, 4, 5}
    s := a[1:4]
    fmt.Printf("s:%v, len(s):%v, cap(s):%v\n", s, len(s), cap(s))
}
```
输出结果
```go
s:[2 3 4], len(s):3, cap(s):4
```
为了方便，切片表达式支持省略 `low` 和 `high`的值。省略 `low` 则 `low` 值为 `0` ，省略 `high` 则 `high` 值为操作对象的长度。即：
```go
a[:3] 等同于 a[0:3]
a[1:] 等同于 a[1:len(a)]
a[:]  等同于 a[0:len(a)]
```
**注意**

对于数组或者字符串，必须满足 `0<=low<=high<=len(a)`，否则会索引越界（out of bounds）。

对切片`s`执行切片表达式（切片再切片），`high` 的最大值不是长度，而是 `s` 的容量。索引必须是非负的，并且可以用int类型的值表示; 对于数组或常量字符串，常量索引也必须在有效范围内。如果low和high两个指标都是常数，它们必须满足low <= high。如果索引在运行时超出范围，就会发生运行时panic。

```go
func main(){
	a := [5]int{1, 2, 3, 4, 5}
	s := a[1:3]
	fmt.Printf("s:%v, len(s):%v, cap(s):%v\n", s, len(s), cap(s))
	
	s1 := s[3:4]
    fmt.Printf("s1:%v, len(s1):%v, cap(s1):%v\n", s1, len(s1), cap(s1))
}
```
大家猜猜看，程序会输出什么？s1是否会报下标越界呢？
执行结果如下：
```go
s:[2 3], len(s):2, cap(s):4
s1:[5], len(s1):1, cap(s1):1
```
并没有下标越界，并且输出了s中不存在的数字`5`。这是因为s1是对切片s再切片，切片表达式的 `high` 最大值是s的容量4，并没有越界。

### 完整的切片表达式
完整的切片表达式的格式是：
```go
a[low:high:max]
```
对于数组、数组指针、切片，可以使用完整的切片表达式，（**注意：字符串不可以**），完整的切片表达式，和普通切片表达式一样，只不过最终
会把切片的容量设置为 `max - low` 的值。最终得到的是一个长度是 `high - low` , 容量为 `max - low`的切片。

完整切片表达式，只能省略 `low`，如果省略，则默认为0。

```go
func main() {
	a := [6]int{1, 2, 3, 4, 5, 6}
	s1 := a[1:3]    // 普通切片表达式
	s2 := a[1:3:5]  // 完整切片表达式
	fmt.Printf("s1:%v, len(s1):%v, cap(s1):%v\n", s1, len(s1), cap(s1))
	fmt.Printf("s2:%v, len(s2):%v, cap(s2):%v\n", s2, len(s2), cap(s2))
}
```
输出如下：
```go
s1:[2 3], len(s1):2, cap(s1):5
s2:[2 3], len(s2):2, cap(s2):4
```
完整切片表达式必须满足 `0 <= low <= high <= max <= cap(a)`。其他性质和普通切片表达式相同。

### 使用make()函数创建切片
前面通过切片表达式可以从一个数组创建切片，也介绍了创建并初始化一个切片（`var a = []int{1, 2, 3}`）。这两种方式都无法动态指定切片的下面介绍通过内置的 `make()` 函数动态创建切片。格式如下：
```go
make([]T, size, cap)
```
其中：
 - []T  ：切片的类型
 - size ：切片的长度
 - cap  : 分配内存的容量
 举个栗子：
```go
func main(){
	a := make([]int, 2, 10)
	// a:[0 0], len(a):2, cap(a):10
	fmt.Printf("a:%v, len(a):%v, cap(a):%v", a, len(a), cap(a))
}
```
可以看到，切片的容量，也就是分配的存储空间是10，但是只使用了2，所以切片的长度是2。实际上底层数组开辟的内存空间长度是10。

## 切片的本质
切片本质上，是对数组做了一层封装。切片底层包含
1. 指向一个数组的指针
2. 切片的长度 `len`
3. 切片的容量 `cap`

假设存在一个数组 `a := [8]int{0, 1, 2, 3, 4, 5, 6, 7}` ,有一个切片 `s1 := a[:5]`, 同时对 `s1` 再切片：`s2 := s1[1:3]`。那么切片的示意图如下：

![image-20210820161940647](http://cdn1.jalen-qian.com/Hugo/20210820161940aTzlPKPbDY.png)

由于 `s2` 是对 `s1` 再切片，它们的底层数组是同一个，示意图如下：

![image-20210820163022314](http://cdn1.jalen-qian.com/Hugo/20210820163022KSTMpTULbL.png)

这时候，如果我们将s2的第二个元素改为100，会怎样呢？
```go
func main() {
	a := [8]int{0, 1, 2, 3, 4, 5, 6, 7}
	s1 := a[:5]
	s2:= s1[1:3]
	fmt.Printf("s1:%v, len(s1):%v, cap(s1):%v\n", s1, len(s1), cap(s1))
	fmt.Printf("s2:%v, len(s2):%v, cap(s2):%v\n", s2, len(s2), cap(s2))
	s2[1] = 100
	fmt.Printf("a:%v, s1:%v, s2:%v\n", a, s1, s2)
}
```
结果如下：
```java
s1:[0 1 2 3 4], len(s1):5, cap(s1):8

s2:[1 2], len(s2):2, cap(s2):7

a:[0 1 100 3 4 5 6 7], s1:[0 1 100 3 4], s2:[1 100]
```
我们发现数组a，**切片s1和s2的对应位置的值都变成了100**。这说明 `s1` 和 `s2` 的底层数组都是数组`a`。这是我们需要注意的地方，如果在实际开发中，我们不希望改动到切片的原始数组或者原始切片，我们应该使用`copy()`函数拷贝。

## 切片的特性

### 切片不能直接比较

切片是引用类型，我们不能用 `==` 操作符来判断两个切片中的元素是否完全相等。切片唯一合法的比较操作是和`nil`比较。当切片是 `nil` 时，切片并没有底层数组。一个 `nil` 值切片的长度和容量都是0。

### 如何判断切片是否为空？
首先定义什么是为空？一般来讲，我们判断切片是否为空，是想判断**切片中存储的数据是否是空的**。

我们知道，切片是一种引用类型，只能和 `nil` 比较，当某个切片等于 `nil` 时，表示这个切片没有分配内存，这种时候当然可以说这个切片是空的。

但是还有另一种情况，我们分配了内存，但是切片的`len`值为0，这时虽然底层数组开辟了空间，但是切片没有存储任何数据，按照上面的定义，切片也应该判定为空的。

```go
var s1 []int         //len(s1)=0;cap(s1)=0;s1==nil
s2 := []int{}        //len(s2)=0;cap(s2)=0;s2!=nil
s3 := make([]int, 0) //len(s3)=0;cap(s3)=0;s3!=nil
```

当切片为`nil`时，`len(s)`也会返回0，所以判断切片是否为空，请使用`len(s) == 0`来判断，而不要使用 `s == nil`来判断。

### 切片的赋值拷贝

切片的赋值拷贝，底层数组是同一个，所以对拷贝之后的切片改变其内部元素的值，原始数组的值也会被改变。示例如下：

```go
func main() {
	a := [3]int{10, 20, 30}
	// s1切片由a数组通过切片表达式获得
	s1 := a[:]
	// 通过赋值拷贝得到s2切片
	s2 := s1
	fmt.Printf("s1:%v, len(s1):%v, cap(s1):%v\n", s1, len(s1), cap(s1))
	fmt.Printf("s2:%v, len(s2):%v, cap(s2):%v\n", s2, len(s2), cap(s2))
	s2[0] = 100
    fmt.Println()
	fmt.Printf("a:%v\ns1:%v\ns2:%v", a, s1, s2)
}
```

输出结果如下：

```go
s1:[10 20 30], len(s1):3, cap(s1):3
s2:[10 20 30], len(s2):3, cap(s2):3

a:[100 20 30]
s1:[100 20 30]
s2:[100 20 30]
```

我们发现，改变 `s2` 的第0个元素的值，数组 `a` 和切片 `s1` 的第0个元素的值也变成了100。说明：

-  对数组进行切片，则数组就是新切片的底层数组
- 对切片进行赋值拷贝，则新切片和原来的切片共享一个底层数组。

**切片赋值拷贝后，对新切片改变值，会影响原来的切片的值**，这点需要特别注意。

### 切片的遍历

切片的遍历和数组相同。支持两种遍历方式，索引遍历和 `for range`  遍历。

```go
func main() {
	s := []int{1, 2, 3, 4, 5}
	// 通过索引进行遍历
	for i := 0; i < len(s); i++{
		fmt.Printf("index:%d, value:%d\n", i, s[i])
	}
	// 通过for range进行遍历
	for i, v := range s {
		fmt.Printf("index:%d, value:%d\n", i, v)
	}
}
```

## 使用append()函数添加元素。

Go语言内置的 `append()` 函数可以给切片动态添加元素。你可以只添加一个元素，也可以添加多个，也可以将另一个切片添加到该切片末尾（参数后面加...，注意不能是数组，只能是另一个切片）

```go
func main() {
	s1 := []int{1, 2, 3}  // [1 2 3]
	s1 = append(s1, 4)    // [1 2 3 4]
	s1 = append(s1, 5, 6) // [1 2 3 4 5 6]
	a := [3]int{7, 8, 9}
	s1 = append(s1, a...) // 编译不通过，不能用数组
	s1 = append(s1, []int{7, 8, 9}...) // [1 2 3 4 5 6 7 8 9]
}
```
注意：通过 `var` 关键字声明的零值切片可以直接`append()`添加元素，append函数会分配内存空间。

```go
func main(){
    var s []int
    s = append(s, 1, 2, 3)
    fmt.Printf("s:%v\n", s) // [1 2 3]
}
```

下面的代码虽然没有问题，但是是没必要的：

```go
// 没有必要初始化
s := []int{}
s = append(s, 1, 2, 3)
// 没有必要初始化
s1 := make([]int)
s1 = append(s1, 1, 2, 3)
```



