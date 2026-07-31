---
title: "Go Basics: Data Types"
date: 2020-09-10T08:37:56+08:00
lastmod: 2020-09-10T01:37:56+08:00
draft: false
tags: ["Golang"]
categories: ["Golang Series"]
author: "Jalen"
---

[Reference Article](https://www.liwenzhou.com/posts/Go/02_datatype/)

Go provides a rich set of data types. In addition to basic integer, floating-point, string, and boolean types, it also includes arrays, slices, functions, maps, structs, channels, and more. Go's basic data types are largely similar to those in other programming languages.

## Basic Data Types
### Integers
Integer types can be divided into two main categories. By size, they are: `int8`, `int16`, `int32`, and `int64`. Their corresponding unsigned integer types are: `uint8`, `uint16`, `uint32`, and `uint64`.

Among them, `uint8` is the familiar `byte` type, `int16` corresponds to the `short` type in C, and `int64` corresponds to the `long` type in C.

| Type   | Description                                                         |
| ------ | ------------------------------------------------------------------- |
| uint8  | Unsigned 8-bit integer (0 to 255)                                   |
| uint16 | Unsigned 16-bit integer (0 to 65535)                                |
| uint32 | Unsigned 32-bit integer (0 to 4294967295)                           |
| uint64 | Unsigned 64-bit integer (0 to 18446744073709551615)                 |
| int8   | Signed 8-bit integer (-128 to 127)                                  |
| int16  | Signed 16-bit integer (-32768 to 32767)                             |
| int32  | Signed 32-bit integer (-2147483648 to 2147483647)                   |
| int64  | Signed 64-bit integer (-9223372036854775808 to 9223372036854775807) |

### Special Integer Types

| Type    | Description                                                                  |
| ------- | ---------------------------------------------------------------------------- |
| uint    | Equivalent to uint32 on 32-bit operating systems and uint64 on 64-bit systems |
| int     | Equivalent to int32 on 32-bit operating systems and int64 on 64-bit systems   |
| uintptr | An unsigned integer type used to store a pointer                              |

**Note:** When using the `int` and `uint` types, you cannot assume that they are 64-bit or 32-bit integers. You must account for differences between operating system platforms.

**Important:** The length returned by the built-in `len()` function for an object may vary according to the byte size of the platform. In practice, the number of elements in a slice or `map` can be represented using int. When binary transmission or file structure definitions are involved, do not use `int` or `uint`, so that the file structure is not affected by differences in byte size across compilation target platforms.

### Numeric Literal Syntax
Go 1.13 introduced numeric literal syntax, making it easier for developers to define numbers in binary, octal, or hexadecimal floating-point format. For example:

v := 0b00101101 represents the binary number 101101, which is equivalent to decimal 45. v := 0o377 represents the octal number 377, which is equivalent to decimal 255. v := 0x1p-2 represents hexadecimal 1 divided by 2², which is 0.25. Underscores can also be used to separate digits. For example:

v := 123_456 is equal to 123456.

We can use functions from fmt to display an integer in different numeral systems.

```go
package main

import "fmt"

func main() {
    //Go language integer does not take binary form, but can output binary by %b Production
    var a int = 10
    //Output Binary
    fmt.Printf("a的二进制是%b\n", a) //A binary is 1010.

    //Octal integer, beginning with 0
    var b int = 077
    fmt.Printf("b的十进制是%d\n", b) // The decimal for b is 63.
    fmt.Printf("b的八进制是%o\n", b) // The octal for b is 77.

    //Hexadecimal integer
    c := 0xff
    fmt.Println(c)               // 255 Default output integer in decimal
    fmt.Printf("c的十六进制是%x\n", c) // Hexadecimal for c is ff.

}

```

### Floating-Point Numbers
Go supports two floating-point types: `float32` and `float64`. Both floating-point formats comply with the `IEEE 754` standard. The maximum range of `float32` floating-point numbers is approximately `3.4e38` and can be defined using the constant `math.MaxFloat32`. The maximum range of `float64` floating-point numbers is approximately `1.8e308` and can be defined using the constant `math.MaxFloat64`.

When printing floating-point numbers, you can use the `fmt` package with the `%f` verb, as shown below:

```go
package main

import "fmt"

func main() {
    a := 3.24322
    fmt.Printf("a=%f\n", a) //a=3.243220
    //Type of printa indicating default is float64
    fmt.Printf("a的类型是%T\n",a) //A type is float64.

    var b float32 = 3.22
    fmt.Printf("b=%f\n",b)//b=3.220000

    //Give a value to b.
    //a = b //cannot use b (type float32) as type float64 in assignment

    //If you want value, use mandatory type conversion
    a = float64(b)
    fmt.Printf("a=%f,a的类型是%T\n",a,a) //a=3.220000, a type is float64
}
```

### Complex Numbers
`complex64` and `complex128`

Complex numbers have real and imaginary parts. The real and imaginary parts of `complex64` each occupy 32 bits, while those of `complex128` each occupy 64 bits.

```go
package main

import "fmt"

func main() {
    var a complex64 = 2 + 3i
    fmt.Println(a) //(2+3i)

    var b complex128 = 3 + 4i
    fmt.Println(b) //(3+4i)

    //Default is complex128
    var c = 4 + 5i
    fmt.Printf("c的类型为%T", c) //Type of c is complex128
}

```

### Booleans
In Go, boolean data is declared using the `bool` type. A boolean can have only two values: `true` and `false`.
> 1. The default value of a boolean variable is `false`.<br>
> 2. Go does not allow integers to be explicitly converted to booleans.
> 3. Booleans cannot participate in arithmetic operations or be converted to other types.

### Strings
Strings are native data types in Go and can be used in the same way as other native data types such as int, bool, float32, and float64. Strings in Go are internally encoded using `UTF-8`. A string's value is the content enclosed in `double quotes (")`. Non-ASCII characters can be included directly in Go source code. For example:

```go
var a = "hello"
var b = "你好"
var c = "初めまして"
```

##### String Escape Sequences

| Escape Sequence | Meaning                                                      |
| --------------- | ------------------------------------------------------------ |
| \r              | Carriage return (returns to the beginning of the line)       |
| \n              | Line feed (moves directly to the same column on the next line) |
| \t              | Tab                                                          |
| \'              | Single quotation mark                                        |
| \"              | Double quotation mark                                        |
| \\              | Backslash                                                    |

For example, suppose we want to print a file path on Windows:

```go
package main

import "fmt"

func main() {
    dir := "C:\\Windows\\System32\\drivers\\etc"
    fmt.Println(dir)//C:\Windows\System32\drivers\etc
}

```

##### Multiline Strings
Use `backticks` to define a multiline string:
```go
package main

import "fmt"

func main() {
    /*

            First line
            Second line
        Third line
                Ha ha ha!
     */
    var multiLine = `
        First line
        Second line
    Third line
            Ha ha ha!
    
    `
    fmt.Println(multiLine)
}
```
##### Common String Operations
| Method                              | Description                    |
| ----------------------------------- | ------------------------------ |
| len(str)                            | Get the length                 |
| + or fmt.Sprintf                    | Concatenate strings            |
| strings.Split                       | Split                          |
| strings.contains                    | Check whether it contains      |
| strings.HasPrefix,strings.HasSuffix | Check the prefix/suffix        |
| strings.Index(),strings.LastIndex() | Find the position of a substring |
| strings.Join(a[]string, sep string) | Join operation                 |

The specific usage is as follows:

```go
package main

import (
    "fmt"
    "strings"
)

func main() {
    //Length requested
    s1 := "hello world"
    length := len(s1)
    fmt.Printf("s1的长度是%d\n", length) //The length of s1 is 11.
    //Len returns int type
    fmt.Printf("%T\n", length) //int

    //Collapse String
    s2 := "面朝大海"
    s3 := "春暖花开"
    fmt.Println(s2 + "," + s3) //Face to sea. Spring blossoms.
    s4 := fmt.Sprintf("%s,%s", s2, s3)
    fmt.Println(s4) //Face to sea. Spring blossoms.

    //Split String
    //You can divide strings into string numbers by a specific symbol. Group
    s5 := "床前明月光，疑似地上霜，举头望明月，低头思故乡"
    s6 := strings.Split(s5, "，")
    fmt.Printf("%v\n", s6) //[Moonlight before bed, suspected frost on the ground, look up to the moon, look down at home]
    fmt.Println(s6[2])     //Look up at the moon.

    //Whether or not to include
    //Other Organiser
    if strings.Contains(s5, "s") {
        fmt.Println("包含")
    } else {
        fmt.Println("不包含")
    }
    //Prefix, postfix.
    if strings.HasPrefix(s5, "床前") {
        fmt.Println("包含前缀\"床前\"")
    }
    if strings.HasSuffix(s5, "故乡") {
        fmt.Println("包含后缀\"故乡\"")
    }

    //The location of the substring
    //The sub-string "Tomorrow Moon" appears at 6:
    //Because a character is a byte and a rune is three bytes.
    fmt.Printf("子串\"明月\"出现的位置是：%d\n",strings.Index(s5,"明月"))
    //The last location of the sub-string is 45
    fmt.Printf("子串\"明月\"最后出现的位置是：%d\n",strings.LastIndex(s5,"明月"))

    //join
    var arr = []string{"hello","world"}
    arr2 := strings.Join(arr," ")
    //Collapse the string in the slice with the Space
    fmt.Println(arr2)//hello world
}
```

##### byte and rune Types
The elements that make up a string are called "characters." Characters can be obtained by iterating over the string or accessing individual string elements. Character literals are enclosed in single quotation marks (’), for example:
```go
var a = '中'
var b = 's'
```
Go has two character types:
1. The `uint8` type, also known as the `byte` type, represents a character in the `ASCII` character set.
2. The `rune` type, which is exactly equivalent to the `int32` type, represents a character encoded in `utf-8`, such as a Chinese or Japanese character.

Go uses the special rune type to handle Unicode, making Unicode-based text processing more convenient. The byte type can also be used for default string processing, providing both performance and extensibility.

```go
package main

import "fmt"

func main() {
    a := '中'
    b := 'a'
    //Rune type is actually in 32.
    fmt.Printf("a的类型是 %T, b的类型是%T\n", a, b) //A type is int32, b type is int32

    //Here's the range of uint8 is 0-255, and the character's "above the range of uint8", the code of utf-8 is 20013.
    //var c uint8 = 'in'
    //fmt.Println(c) //constant 20013 overflows uint8

    var c uint32 = '中'
    fmt.Println(c)//20013

    var d rune = '人'
    fmt.Println(d)//20154
    fmt.Printf("%T\n",d)//= rune

    //Int32 variable types can be given a direct value to the rune type, which further explains that rune is the same type as int32
    var f int32 = '民'
    d = f
    fmt.Printf("%c\n",d)//Min

    s := "hello沙河"
    //Output:
    //104(h) 101(e) 108(l) 108(l) 111(o) 230(æ) 178(²) 153() 230(æ) 178(²) 179(³)
    for i := 0; i < len(s); i++ { //byte
        fmt.Printf("%v(%c) ", s[i], s[i])
    }
    fmt.Println()
    //104 (h) 101 (e) 108 (l) 108 (l) 111 (o) 27801 (sa) 27827 (river)
    for _, r := range s { //rune
        fmt.Printf("%v(%c) ", r, r)
    }
    fmt.Println()
}
```

##### Modifying Strings
Strings are immutable in Go. To modify a string, you must first explicitly convert it to `[]byte` or `[]rune`, and then convert it back to a string.

This process involves reallocating memory, so the converted string is no longer the original string.

```go
package main

import "fmt"

func main() {
    //This poem is wrong. We need to change the word "Moon" to "Moon".
    s := "床前皓月光，疑似地上霜。举头望皓月，低头思故乡。"
    fmt.Println(&s)//0xc00004e1c0
    //Force type to rune arrays Group
    strArr := []rune(s)
    //Let's go through it.
    for i,c := range strArr{
        if c == '皓'{
            strArr[i] = '明'
        }
    }
    //Force conversion back to string
    s = string(strArr)//In front of the bed, the moonlight appears to be frost. Look forward to the moon tomorrow and think back home.
    //Print changed string and address
    fmt.Println(s)
    fmt.Println(&s)//0xc00004e1c0
}
```

#### Type Conversion
Go supports only explicit type conversion, not implicit type conversion. This syntax can be used only when conversion between the two types is supported.

The basic syntax for explicit type conversion is as follows:
```go
T(表达式)
```
Here, T represents the target type. The expression may be a variable, a complex operation, a function return value, and so on.

For example, when calculating the hypotenuse of a right triangle using the Sqrt() function from the math package, the function accepts a float64 argument, while the variables a and b are both of type int. Therefore, a and b must be explicitly converted to float64.
```go
func sqrtDemo() {
    var a, b = 3, 4
    var c int
    // Math.Sqrt() accepted parameter is float64 type, mandatory conversion required
    c = int(math.Sqrt(float64(a*a + b*b)))
    fmt.Println(c)
}
```

#### Exercise
1. Writer a program to count the number of Chinese princes in the string "hello"
```go
package main

import (
    "fmt"
    "unicode"
)

//Whether the characters are Han
func isHan(char rune) bool {
    return unicode.Is(unicode.Han, char)
}

func main() {
    /*
        Practice question: Writing program, counting the number of Chinese characters in the string "Hello Shai"
    */
    str := "hello沙河小王子なつめ"
    var hanNums int
    for _, c := range str {
        if isHan(c) {
            hanNums++
        }
    }
    fmt.Printf("汉字个数是%d\n", hanNums)//The Han count is five.

}

```
