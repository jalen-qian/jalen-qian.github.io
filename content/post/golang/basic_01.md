---
title: "Go语言基础之变量与常量"
date: 2020-09-10T16:47:00+08:00
lastmod: 2020-09-10T16:47:00+08:00
draft: false
keywords: ["变量","常量"]
description: ""
tags: ["Golang"]
categories: ["Golang专栏"]
author: "Jalen"
---

[参考文章](https://www.liwenzhou.com/posts/Go/01_var_and_const/)

### 标识符与关键字
- 标识符
> 标识符就是程序员自己定义的特殊意义的词，比如变量名、常量名、函数名等，GO语言中只能用`字母`、`数字`和`_`来组成，并且只能以字母和`_`开头，比如`abc`、`_hello`、`_`、`_123`、`a123`

- 关键字

> Go语言中的关键字有25个:

```Go
break        default      func         interface    select
case         defer        go           map          struct
chan         else         goto         package      switch
const        fallthrough  if           range        type
continue     for          import       return       var
```

> 此外，Go语言中还有37个保留字

```Go
Constants:    true  false  iota  nil

    Types:    int  int8  int16  int32  int64  
              uint  uint8  uint16  uint32  uint64  uintptr
              float32  float64  complex128  complex64
              bool  byte  rune  string  error

Functions:   make  len  cap  new  append  copy  close  delete
             complex  real  imag
             panic  recover
```

### Go语言中的变量
- 变量的来历
> 程序运行过程中的数据都是保存在内存中，我们想要在代码中操作某个数据时就需要去内存上找到这个变量，但是如果我们直接在代码中通过内存地址去操作变量的话，代码的可读性会非常差而且还容易出错，所以我们就利用变量将这个数据的内存地址保存起来，以后直接通过这个变量就能找到内存上对应的数据了。

- 变量类型
> 变量（Variable）的功能是存储数据。不同的变量保存的数据类型可能会不一样。经过半个多世纪的发展，编程语言已经基本形成了一套固定的类型，常见变量的数据类型有：整型、浮点型、布尔型等。<br><br>
**Go语言中的每一个变量都有自己的类型，并且变量必须经过声明才能开始使用**。

#### 变量声明
> Go语言中的变量需要声明后才能使用，同一作用域内不支持重复声明。 并且Go语言的变量声明后必须使用。

##### 标准声明
GO语言中的变量声明格式为：

```Go
var 变量名 变量类型
```
总结：以`var`关键字开头，变量类型放在变量后面，行尾无需分号


```Go
var name string
var age  int
var isOk bool
```
##### 批量声明
每声明一个变量就写一个`var`关键字很繁琐，Go语言支持批量声明变量，例如下：


```Go
var(
    name string
    age  int
    isOk bool
)
```

##### 变量初始化
Go语言在声明变量的时候，会自动对变量对应的内存区域进行初始化操作。每个变量会被初始化成其类型的默认值，例如：
整型和浮点型变量的默认值为`0`。 字符串变量的默认值为`空字符串""`。 布尔型变量默认为`false`。 切片、函数、指针变量的默认为`nil`。

我们也可以在声明变量的时候指定初始值，格式如下：


```Go
var 变量名 变量类型 = 表达式
```
比如：
```Go
var name string = "Zhangsan"
var age  int    = 15
var isOk bool   = false
```
Go还支持在一行中声明多个变量
```Go
var name,age = "Lisi",25
```
注意这里没有指定变量类型，这是因为Go编译器会根据等号右边的数据类型**反向推导**变量类型

###### 类型推导
如果声明变量的同时赋值，这时候可以不指定变量类型，Go语言编辑器会自动根据等号右边的值来确定等号左边变量的类型，例如

```Go
var name = "Lisi" //由于赋值的值是字符串，所以name的类型编译器会自动指定为字符串
var age  = 15
```

###### 短变量声明`:=`
Go语言中函数内部可以使用`:=`来声明并赋值变量，例如
```Go
package main

import "fmt"

var m = 100 //声明全局变量m，全局变量声明后可以不使用，局部变量声明后必须使用

//n := "str" //报错，:=不可声明全局变量

func main() {
	n := "abb"
	m := 100 //声明局部变量m，并使用:=

	//100
	//abb
	fmt.Println(m, n)
}

```
**注意不能用来声明全局变量**

###### 匿名变量

在使用多重赋值时，如果想要忽略某个值，可以使用匿名变量（anonymous variable）。 匿名变量用一个下划线`_`表示，例如：

```
package main

import "fmt"

/**
 * 返回两个变量，姓名和年龄
 */
func studentMsg(name string, age int) (string, int) {
	return name, age
}

func main() {
	//这里如果只需要姓名，年龄忽略，可以用匿名变量`_`来接收
	name, _ := studentMsg("张三", 25)
	_, age := studentMsg("李四", 28)
	
	fmt.Println("姓名是", name)
	fmt.Println("年龄是", age)
}
```
> 在Go语言中，一个函数支持返回多个值，接收函数返回的值的时候，如果某个值不需要使用，就可以用`_`来忽略它。

#### 常量
相对于变量，常量是恒定不变的值，多用于定义程序运行期间不会改变的那些值。 常量的声明和变量声明非常类似，只是把var换成了const，常量在定义的时候必须赋值。

```Go
const pi = 3.1415
const e = 2.7182
```
声明了`pi`和`e`这两个常量之后，在整个程序运行期间它们的值都不能再发生变化了。

多个常量也可以一起声明：
```Go
const (
    pi = 3.1415
    e = 2.7182
)
```

const同时声明多个常量时，如果省略了值则表示和上面一行的值相同。 例如：

```Go
const (
    n1 = 100
    n2
    n3
)
```
上面示例中，常量n1、n2、n3的值都是100。

##### iota
`iota`是go语言的常量计数器，只能在常量的表达式中使用。

`iota`在const关键字出现时将被重置为0。**const中每新增一行常量声明将使`iota`计数一次**(iota可理解为const语句块中的行索引)。 使用iota能简化定义，在定义枚举时很有用。

举个例子：
```Go
const (
		n1 = iota //0
		n2        //1
		n3        //2
		n4        //3
	)
```
###### 几个常见的iota示例:

- 使用`_`跳过某些值

```Go
const (
		n1 = iota //0
		n2        //1
		_
		n4        //3
	)
```

- `iota`声明中间插队

```Go
const (
		n1 = iota //0
		n2 = 100  //100
		n3 = iota //2
		n4        //3
	)
	const n5 = iota //0
```

- 定义数量级 
>这里的`<<`表示左移操作，`1<<10`表示将1的二进制表示向左移10位，也就是由1变成了10000000000，也就是十进制的1024。同理`2<<2`表示将2的二进制表示向左移2位，也就是由10变成了1000，也就是十进制的8。

```Go
const (
		_  = iota
		KB = 1 << (10 * iota)
		MB = 1 << (10 * iota)
		GB = 1 << (10 * iota)
		TB = 1 << (10 * iota)
		PB = 1 << (10 * iota)
	)
```

多个iota定义在一行

```Go
const (
		a, b = iota + 1, iota + 2 //1,2
		c, d                      //2,3
		e, f                      //3,4
	)
```
