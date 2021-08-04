---
title: "Go语言基础之数据类型"
date: 2020-09-10T08:37:56+08:00
lastmod: 2020-09-10T01:37:56+08:00
draft: false
tags: ["Golang"]
categories: ["Golang专栏"]
author: "钱文军"
---

[参考文章](https://www.liwenzhou.com/posts/Go/02_datatype/)

Go语言包含丰富的数据类型，除了基本的整型、浮点型、字符串、布尔型外，还有数组、切片(slice)、函数、Map、结构体、通道(Channel)等等。Go语言的基本数据类型与其他语言大同小异。

## 基本数据类型
### 整型
整型分为以下两个大类： 按长度分为：`int8`、`int16`、`int32`、`int64` 对应的无符号整型：`uint8`、`uint16`、`uint32`、`uint64`

其中，`uint8`就是我们熟知的`byte`型，`int16`对应C语言中的`short`型，`int64`对应C语言中的`long`型。

| 类型   | 描述                                                         |
| ------ | ------------------------------------------------------------ |
| uint8  | 无符号 8位整型 (0 到 255)                                    |
| uint16 | 无符号 16位整型 (0 到 65535)                                 |
| uint32 | 无符号 32位整型 (0 到 4294967295)                            |
| uint64 | 无符号 64位整型 (0 到 18446744073709551615)                  |
| int8   | 有符号 8位整型 (-128 到 127)                                 |
| int16  | 有符号 16位整型 (-32768 到 32767)                            |
| int32  | 有符号 32位整型 (-2147483648 到 2147483647)                  |
| int64  | 有符号 64位整型 (-9223372036854775808 到 9223372036854775807) |

### 特殊整型


| 类型    | 描述                                               |
| ------- | -------------------------------------------------- |
| uint    | 32位操作系统上就是uint32，64位操作系统上就是uint64 |
| int     | 32位操作系统上就是int32，64位操作系统上就是int64   |
| uintptr | 无符号整型，用于存放一个指针                       |

**注意：** 在使用`int`和`uint`类型时，不能假定它们是64位或者32位的整型，而是需要考虑到不同操作系统平台的差异。

**注意事项**获取对象的长度的内建`len()`函数返回的长度可以根据不同平台的字节长度进行变化。实际使用中，切片或 `map` 的元素数量等都可以用int来表示。在涉及到二进制传输、读写文件的结构描述时，为了保持文件的结构不会受到不同编译目标平台字节长度的影响，不要使用`int`和 `uint`。

### 数字字面向量法
Go1.13版本之后引入了数字字面量语法，这样便于开发者以二进制、八进制或十六进制浮点数的格式定义数字，例如：

v := 0b00101101， 代表二进制的 101101，相当于十进制的 45。 v := 0o377，代表八进制的 377，相当于十进制的 255。 v := 0x1p-2，代表十六进制的 1 除以 2²，也就是 0.25。 而且还允许我们用 _ 来分隔数字，比如说：

v := 123_456 等于 123456。

我们可以借助fmt函数来将一个整数以不同进制形式展示。

```go
package main

import "fmt"

func main() {
    //Go语言整型没有二进制的形式，但是可以通过%b输出二进制
    var a int = 10
    //输出二进制
    fmt.Printf("a的二进制是%b\n", a) //a的二进制是1010

    //八进制整数，以0开头
    var b int = 077
    fmt.Printf("b的十进制是%d\n", b) // b的十进制是63
    fmt.Printf("b的八进制是%o\n", b) // b的八进制是77

    //十六进制整数
    c := 0xff
    fmt.Println(c)               // 255 默认以十进制整数输出
    fmt.Printf("c的十六进制是%x\n", c) // c的十六进制是ff

}

```

### 浮点型
Go语言支持两种浮点数：`float32`和`float64`。这两种浮点型数据格式遵循`IEEE 754`标准： `float32` 的浮点数的最大范围约为 `3.4e38`，可以使用常量定义：`math.MaxFloat32`。 `float64` 的浮点数的最大范围约为 `1.8e308`，可以使用一个常量定义：`math.MaxFloat64`。

打印浮点数时，可以使用`fmt`包配合动词`%f`，代码如下：


```go
package main

import "fmt"

func main() {
    a := 3.24322
    fmt.Printf("a=%f\n", a) //a=3.243220
    //打印a的类型，说明默认是float64
    fmt.Printf("a的类型是%T\n",a) //a的类型是float64

    var b float32 = 3.22
    fmt.Printf("b=%f\n",b)//b=3.220000

    //将b赋值给a，报错，不能赋值
    //a = b //cannot use b (type float32) as type float64 in assignment

    //如果要赋值，使用强制类型转换
    a = float64(b)
    fmt.Printf("a=%f,a的类型是%T\n",a,a) //a=3.220000,a的类型是float64
}
```

### 复数
`complex64`和`complex128`
复数有实部和虚部，`complex64`实部和虚部各占32位；`complex128`实部和虚部各占64位。

```go
package main

import "fmt"

func main() {
    var a complex64 = 2 + 3i
    fmt.Println(a) //(2+3i)

    var b complex128 = 3 + 4i
    fmt.Println(b) //(3+4i)

    //默认为complex128
    var c = 4 + 5i
    fmt.Printf("c的类型为%T", c) //c的类型为complex128
}

```

### 布尔值
Go语言中以`bool`类型声明布尔型数据，布尔型只有`true(真)`和`false(假)`两个值。
> 1. 布尔型变量默认值是`false`。<br>
> 2. Go语言中不允许将整型强转为布尔型。
> 3. 布尔型无法参与数值运算，也无法与其他类型进行转换。

### 字符串
Go语言中的字符串以原生数据类型出现，使用字符串就像使用其他原生数据类型（int、bool、float32、float64 等）一样。 Go 语言里的字符串的内部实现使用`UTF-8`编码。 字符串的值为`双引号(")`中的内容，可以在Go语言的源码中直接添加非ASCII码字符，例如：

```go
var a = "hello"
var b = "你好"
var c = "初めまして"
```

##### 字符串转义符

| 转义符 | 含义                               |
| ------ | ---------------------------------- |
| \r     | 回车符（返回行首）                 |
| \n     | 换行符（直接跳到下一行的同列位置） |
| \t     | 制表符                             |
| \'     | 单引号                             |
| \"     | 双引号                             |
| \\     | 反斜杠                             |

举个例子，我们要打印一个Windows平台下的一个文件路径：

```go
package main

import "fmt"

func main() {
    dir := "C:\\Windows\\System32\\drivers\\etc"
    fmt.Println(dir)//C:\Windows\System32\drivers\etc
}

```

##### 多行字符串
使用`反引号` 来定义一个多行字符串：
```go
package main

import "fmt"

func main() {
    /*

            第一行
            第二行
        第三行
                哈哈哈
     */
    var multiLine = `
        第一行
        第二行
    第三行
            哈哈哈
    
    `
    fmt.Println(multiLine)
}
```
##### 字符串常用操作
| 方法                                | 介绍           |
| ----------------------------------- | -------------- |
| len(str)                            | 求长度         |
| +或fmt.Sprintf                      | 拼接字符串     |
| strings.Split                       | 分割           |
| strings.contains                    | 判断是否包含   |
| strings.HasPrefix,strings.HasSuffix | 前缀/后缀判断  |
| strings.Index(),strings.LastIndex() | 子串出现的位置 |
| strings.Join(a[]string, sep string) | join操作       |

具体用法如下：

```go
package main

import (
    "fmt"
    "strings"
)

func main() {
    //求长度
    s1 := "hello world"
    length := len(s1)
    fmt.Printf("s1的长度是%d\n", length) //s1的长度是11
    //len返回int类型
    fmt.Printf("%T\n", length) //int

    //拼接字符串
    s2 := "面朝大海"
    s3 := "春暖花开"
    fmt.Println(s2 + "," + s3) //面朝大海,春暖花开
    s4 := fmt.Sprintf("%s,%s", s2, s3)
    fmt.Println(s4) //面朝大海,春暖花开

    //分割字符串
    //strings.Split 可以将字符串用特定符号分割成字符串数组
    s5 := "床前明月光，疑似地上霜，举头望明月，低头思故乡"
    s6 := strings.Split(s5, "，")
    fmt.Printf("%v\n", s6) //[床前明月光 疑似地上霜 举头望明月 低头思故乡]
    fmt.Println(s6[2])     //举头望明月

    //判断是否包含
    //不包含
    if strings.Contains(s5, "s") {
        fmt.Println("包含")
    } else {
        fmt.Println("不包含")
    }
    //判断前缀、后缀
    if strings.HasPrefix(s5, "床前") {
        fmt.Println("包含前缀\"床前\"")
    }
    if strings.HasSuffix(s5, "故乡") {
        fmt.Println("包含后缀\"故乡\"")
    }

    //判断子串出现的位置
    //子串"明月"出现的位置是：6
    //因为一个字符是一个字节，一个rune占3个字节
    fmt.Printf("子串\"明月\"出现的位置是：%d\n",strings.Index(s5,"明月"))
    //子串"明月"最后出现的位置是：45
    fmt.Printf("子串\"明月\"最后出现的位置是：%d\n",strings.LastIndex(s5,"明月"))

    //join
    var arr = []string{"hello","world"}
    arr2 := strings.Join(arr," ")
    //将切片中的字符串用“空格”拼接
    fmt.Println(arr2)//hello world
}
```

##### byte与rune类型
组成每个字符串的元素叫做“字符”，可以通过遍历或者单个获取字符串元素获得字符。 字符用单引号（’）包裹起来，如：
```go
var a = '中'
var b = 's'
```
Go语言中的字符类型有两种：
1. `uint8`类型，或者叫做`byte`类型，代表了`ASCII`码的一个字符。
2. `rune`类型，完全等同于`int32`类型，代表了一个`utf-8`编码的字符，比如中文、日文字符。

Go 使用了特殊的 rune 类型来处理 Unicode，让基于 Unicode 的文本处理更为方便，也可以使用 byte 型进行默认字符串处理，性能和扩展性都有照顾。

```go
package main

import "fmt"

func main() {
    a := '中'
    b := 'a'
    //rune类型实际上是int32
    fmt.Printf("a的类型是 %T, b的类型是%T\n", a, b) //a的类型是 int32, b的类型是int32

    //这里uint8范围是0-255，而字符'中'超过了uint8的范围，utf-8编码'中'的编码是20013
    //var c uint8 = '中'
    //fmt.Println(c) //constant 20013 overflows uint8

    var c uint32 = '中'
    fmt.Println(c)//20013

    var d rune = '人'
    fmt.Println(d)//20154
    fmt.Printf("%T\n",d)//int32 所以说int32 == rune

    //int32类型变量能直接赋值给rune类型，也进一步说明了rune与int32是同一种类型
    var f int32 = '民'
    d = f
    fmt.Printf("%c\n",d)//民

    s := "hello沙河"
    //输出：
    //104(h) 101(e) 108(l) 108(l) 111(o) 230(æ) 178(²) 153() 230(æ) 178(²) 179(³)
    for i := 0; i < len(s); i++ { //byte
        fmt.Printf("%v(%c) ", s[i], s[i])
    }
    fmt.Println()
    //104(h) 101(e) 108(l) 108(l) 111(o) 27801(沙) 27827(河)
    for _, r := range s { //rune
        fmt.Printf("%v(%c) ", r, r)
    }
    fmt.Println()
}
```

##### 修改字符串
在Go中字符串是不可修改的变量，如果要改变字符串，需要先将字符串强制转为`[]byte`或者`[]rune`，之后再重新强制转换为字符串。
在这个过程中意味着内存重新分配，转换后的字符串已经不是原来的字符串了。

```go
package main

import "fmt"

func main() {
    //这首诗写错了，需要将“皓月”改为“明月”
    s := "床前皓月光，疑似地上霜。举头望皓月，低头思故乡。"
    fmt.Println(&s)//0xc00004e1c0
    //强制类型转换为rune数组数组
    strArr := []rune(s)
    //遍历，将皓改为明
    for i,c := range strArr{
        if c == '皓'{
            strArr[i] = '明'
        }
    }
    //强制转换回字符串
    s = string(strArr)//床前明月光，疑似地上霜。举头望明月，低头思故乡。
    //打印改变后的字符串和地址
    fmt.Println(s)
    fmt.Println(&s)//0xc00004e1c0
}
```

#### 类型转换
Go语言中只有强制类型转换，没有隐式类型转换。该语法只能在两个类型之间支持相互转换的时候使用。

强制类型转换的基本语法如下：
```go
T(表达式)
```
其中，T表示要转换的类型。表达式包括变量、复杂算子和函数返回值等.

比如计算直角三角形的斜边长时使用math包的Sqrt()函数，该函数接收的是float64类型的参数，而变量a和b都是int类型的，这个时候就需要将a和b强制类型转换为float64类型。
```go
func sqrtDemo() {
    var a, b = 3, 4
    var c int
    // math.Sqrt()接收的参数是float64类型，需要强制转换
    c = int(math.Sqrt(float64(a*a + b*b)))
    fmt.Println(c)
}
```

#### 练习
1. 编写程序，统计字符串 "hello沙河小王子なつめ"中汉字的个数
```go
package main

import (
    "fmt"
    "unicode"
)

//判断是否字符是汉字
func isHan(char rune) bool {
    return unicode.Is(unicode.Han, char)
}

func main() {
    /*
        练习题：编写程序，统计字符串 "hello沙河小王子なつめ"中汉字的个数
    */
    str := "hello沙河小王子なつめ"
    var hanNums int
    for _, c := range str {
        if isHan(c) {
            hanNums++
        }
    }
    fmt.Printf("汉字个数是%d\n", hanNums)//汉字个数是5

}

```