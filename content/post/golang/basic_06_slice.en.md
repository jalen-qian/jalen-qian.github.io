---
title: "Go Basics: Slices"
date: 2021-08-04T16:41:45+08:00
lastmod: 2021-08-04T16:41:45+08:00
draft: false
tags: ["Golang"]
categories: ["Golang Series"]
author: "Jalen"

contentCopyright: '<a rel="license noopener" href="https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License" target="_blank">Creative Commons Attribution-ShareAlike License</a>'
---

> This article primarily introduces the data structure `slice` in Go and its basic usage.

# Introduction

Previously, we introduced arrays in Go. The length of an array is fixed and is part of its type, so arrays have many limitations. For example, consider summing an array:

```go
func arraySum(arr [3]int) {
	sum := 0
	for _, v in range arr{
        sum = sum + v
	}
	return sum
}
```
This sum function only supports the `[3]int` type; no other types are supported.

Another example:
```go
var a = [3]int{1, 2, 3}
```
`a` can contain at most three elements, and no additional elements can be added.

# Slices

A **slice** is a variable-length data structure consisting of elements of the same type. It is an abstraction over array types. Slices are highly flexible and support dynamic capacity expansion.

A slice is a wrapper around an array and is a reference type rather than a value type. Internally, a slice contains `容量`, `长度`, and `指针`.

## Defining a Slice

The syntax for declaring a slice is as follows:
```go
var name []T // T指对应的类型
```
- name: the variable name
- T: the type of elements in the slice

Example:
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

## Slice Length and Capacity

As mentioned earlier, a slice internally encapsulates `容量` and `长度`. We can use Go's built-in `len()` function to obtain the length of a slice and the `cap()` function to obtain its capacity.

```go
var a []int
fmt.Printf("len(a):%v, cap(a):%v\n", len(a), cap(a)) // len(a):0, cap(a):0

b := []int{1, 2, 3}
fmt.Printf("len(b):%v, cap(b):%v\n", len(b), cap(b)) // len(b):3, cap(b):3
```

## Slice Expressions

A slice expression can be written as `var a = b[low:high]`, where the variable `b` can be a **string, array, slice, or a pointer to an array or slice**.

A slice expression is syntax for constructing a substring or subslice from a string, array, array pointer, or slice. (Note: Applying a slice expression to an array produces a slice.)

There are two forms of slice expressions:
1. A simple slice expression, `var a = b[low:high]`, which has two index bounds.
2. A full slice expression, `var a = b[low:high:size]`, which specifies an index that determines the slice capacity in addition to the two index bounds.

### Simple Slice Expressions

A slice is a wrapper around an array, with an array as its underlying storage. Therefore, we can use a slice expression to obtain a slice from an array. In the slice expression

```go
var a = b[low:high]
```

`low` and `high` represent the lower bound (**inclusive**) and upper bound (**exclusive**), respectively. The slice length is `high - low`, and the slice capacity is determined by the length of the operand.

In the following code, the slice `s` contains the elements at index positions `1 <= 索引 < 4` of the array `a`. Its length is `4 - 1 = 3`, and its capacity is based on the array length `5`.

```go
func main(){
    a := [5]int{1, 2, 3, 4, 5}
    s := a[1:4]
    fmt.Printf("s:%v, len(s):%v, cap(s):%v\n", s, len(s), cap(s))
}
```
Output:
```go
s:[2 3 4], len(s):3, cap(s):4
```
For convenience, slice expressions allow the values of `low` and `high` to be omitted. If `low` is omitted, `low` defaults to `0`. If `high` is omitted, `high` defaults to the length of the operand. That is:
```go
a[:3] 等同于 a[0:3]
a[1:] 等同于 a[1:len(a)]
a[:]  等同于 a[0:len(a)]
```
**Note**

For arrays or strings, `0<=low<=high<=len(a)` must be satisfied; otherwise, an out-of-bounds error will occur.

When applying a slice expression to a slice `s` (slicing a slice), the maximum value of `high` is not the length, but the capacity of `s`. Indices must be non-negative and representable by a value of type `int`. For arrays or constant strings, constant indices must also be within the valid range. If both `low` and `high` are constants, they must satisfy `low <= high`. If an index is out of range at runtime, a runtime panic occurs.

```go
func main(){
	a := [5]int{1, 2, 3, 4, 5}
	s := a[1:3]
	fmt.Printf("s:%v, len(s):%v, cap(s):%v\n", s, len(s), cap(s))
	
	s1 := s[3:4]
    fmt.Printf("s1:%v, len(s1):%v, cap(s1):%v\n", s1, len(s1), cap(s1))
}
```
Can you guess what the program will output? Will `s1` cause an index-out-of-range error?

The output is as follows:
```go
s:[2 3], len(s):2, cap(s):4
s1:[5], len(s1):1, cap(s1):1
```
There is no index-out-of-range error, and the number `5`, which is not present in `s`, is printed. This is because `s1` is obtained by slicing the slice `s`, and the maximum value of `high` in the slice expression is the capacity of `s`, which is 4, so the index is not out of bounds.

### Full Slice Expressions

The syntax for a full slice expression is:
```go
a[low:high:max]
```
Full slice expressions can be used with arrays, pointers to arrays, and slices (**note: they cannot be used with strings**). A full slice expression works like a simple slice expression, except that it sets the final slice capacity to the value of `max - low`. The resulting slice has a length of `high - low` and a capacity of `max - low`.

In a full slice expression, only `low` can be omitted. If omitted, it defaults to 0.

```go
func main() {
	a := [6]int{1, 2, 3, 4, 5, 6}
	s1 := a[1:3]    // 普通切片表达式
	s2 := a[1:3:5]  // 完整切片表达式
	fmt.Printf("s1:%v, len(s1):%v, cap(s1):%v\n", s1, len(s1), cap(s1))
	fmt.Printf("s2:%v, len(s2):%v, cap(s2):%v\n", s2, len(s2), cap(s2))
}
```
The output is as follows:
```go
s1:[2 3], len(s1):2, cap(s1):5
s2:[2 3], len(s2):2, cap(s2):4
```
A full slice expression must satisfy `0 <= low <= high <= max <= cap(a)`. Its other properties are the same as those of a simple slice expression.

### Creating Slices with the make() Function

Earlier, we created a slice from an array using a slice expression and also introduced how to create and initialize a slice (`var a = []int{1, 2, 3}`). Neither approach allows the slice capacity to be specified dynamically. The following section explains how to dynamically create a slice using the built-in `make()` function. The syntax is as follows:
```go
make([]T, size, cap)
```
Where:
 - []T: the slice type
 - size: the slice length
 - cap: the allocated capacity

For example:
```go
func main(){
	a := make([]int, 2, 10)
	// a:[0 0], len(a):2, cap(a):10
	fmt.Printf("a:%v, len(a):%v, cap(a):%v", a, len(a), cap(a))
}
```
As you can see, the slice capacity—that is, the allocated storage space—is 10, but only 2 elements are in use, so the slice length is 2. In fact, the memory allocated for the underlying array has a length of 10.

## The Nature of Slices

A slice is essentially a wrapper around an array. Internally, a slice contains:
1. A pointer to an array
2. The slice length `len`
3. The slice capacity `cap`

Suppose there is an array `a := [8]int{0, 1, 2, 3, 4, 5, 6, 7}` and a slice `s1 := a[:5]`, and `s1` is sliced again to produce `s2 := s1[1:3]`. The slices can be illustrated as follows:

![image-20210820161940647](http://cdn1.jalen-qian.com/Hugo/20210820161940aTzlPKPbDY.png)

Because `s2` is obtained by slicing `s1`, they share the same underlying array, as illustrated below:

![image-20210820163022314](http://cdn1.jalen-qian.com/Hugo/20210820163022KSTMpTULbL.png)

What happens if we now change the second element of `s2` to 100?
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
The result is as follows:
```java
s1:[0 1 2 3 4], len(s1):5, cap(s1):8

s2:[1 2], len(s2):2, cap(s2):7

a:[0 1 100 3 4 5 6 7], s1:[0 1 100 3 4], s2:[1 100]
```
We can see that the values at the corresponding positions in array `a` and **slices `s1` and `s2` have all changed to 100**. This demonstrates that the underlying arrays of `s1` and `s2` are both array `a`. This is something we need to keep in mind. If we do not want to modify the original array or slice during development, we should use the `copy()` function to make a copy.

## Slice Characteristics

### Slices Cannot Be Compared Directly

Slices are reference types, so we cannot use the `==` operator to determine whether the elements in two slices are exactly equal. The only valid comparison operation for a slice is comparing it with `nil`. When a slice is `nil`, it has no underlying array. A slice with a value of `nil` has both a length and capacity of 0.

### How Do You Determine Whether a Slice Is Empty?

First, what does “empty” mean? Generally, when determining whether a slice is empty, we want to determine whether **the slice contains any data**.

We know that a slice is a reference type and can only be compared with `nil`. When a slice equals `nil`, it means no memory has been allocated for the slice. In this case, the slice can certainly be considered empty.

However, there is another case: memory has been allocated, but the slice's `len` value is 0. Although space has been allocated for the underlying array, the slice does not contain any data. According to the definition above, the slice should also be considered empty.

```go
var s1 []int         //len(s1)=0;cap(s1)=0;s1==nil
s2 := []int{}        //len(s2)=0;cap(s2)=0;s2!=nil
s3 := make([]int, 0) //len(s3)=0;cap(s3)=0;s3!=nil
```

When a slice is `nil`, `len(s)` also returns 0. Therefore, to determine whether a slice is empty, use `len(s) == 0` rather than `s == nil`.

### Assigning and Copying Slices

When a slice is copied through assignment, both slices share the same underlying array. Therefore, modifying an element in the copied slice also changes the corresponding value in the original array. For example:

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

The output is as follows:

```go
s1:[10 20 30], len(s1):3, cap(s1):3
s2:[10 20 30], len(s2):3, cap(s2):3

a:[100 20 30]
s1:[100 20 30]
s2:[100 20 30]
```

We can see that after changing the value of element 0 in `s2`, the values of element 0 in array `a` and slice `s1` also become 100. This demonstrates that:

- When an array is sliced, the array becomes the underlying array of the new slice.
- When a slice is copied through assignment, the new slice and the original slice share the same underlying array.

**After copying a slice through assignment, modifying the new slice affects the values in the original slice.** This requires special attention.

### Iterating Over Slices

Slices can be iterated over in the same way as arrays. Two iteration methods are supported: index-based iteration and `for range` iteration.

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

## Adding Elements with the append() Function

Go's built-in `append()` function can dynamically add elements to a slice. You can add a single element, multiple elements, or append another slice to the end of the current slice by adding `...` after the argument. Note that the argument cannot be an array; it must be another slice.

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
**Note**: Elements can be added directly with `append()` to a zero-value slice declared using the `var` keyword. The `append` function will allocate memory.

```go
func main(){
    var s []int
    s = append(s, 1, 2, 3)
    fmt.Printf("s:%v\n", s) // [1 2 3]
}
```

Although there is nothing wrong with the following code, it is unnecessary:

```go
// 没有必要初始化
s := []int{}
s = append(s, 1, 2, 3)
// 没有必要初始化
s1 := make([]int)
s1 = append(s1, 1, 2, 3)
```

Every slice points to an underlying array. If the array has enough capacity, new elements are added to it. When the underlying array cannot accommodate the new elements, the slice automatically grows according to a certain strategy, and its underlying array is replaced. This “capacity expansion” often occurs when the `append()` function is called, so we need to assign the value returned by the `append()` function back to the original variable.
