---
title: "Go Basics: Variables and Constants"
date: 2020-09-10T16:47:00+08:00
lastmod: 2020-09-10T16:47:00+08:00
draft: false
keywords: ["variables","constants"]
description: ""
tags: ["Golang"]
categories: ["Golang Series"]
author: "Jalen"
---

### Identifiers and Keywords
- Identifiers
> Identifiers are words with special meanings defined by programmers, such as variable names, constant names, and function names. In Go, identifiers can only consist of `letters`, `digits`, and `_`, and they must begin with a letter or `_`, such as `abc`, `_hello`, `_`, `_123`, and `a123`.

- Keywords

> Go has 25 keywords:

```Go
break        default      func         interface    select
case         defer        go           map          struct
chan         else         goto         package      switch
const        fallthrough  if           range        type
continue     for          import       return       var
```

> In addition, Go has 37 reserved words:

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

### Variables in Go
- Origin of Variables
> Data generated while a program is running is stored in memory. To manipulate a piece of data in code, we need to locate it in memory. However, directly accessing variables through memory addresses would make the code difficult to read and prone to errors. Therefore, we use variables to store the memory addresses of data, allowing us to locate the corresponding data in memory through those variables.

- Variable Types
> Variables are used to store data. Different variables may store different types of data. After more than half a century of development, programming languages have largely established a standard set of types. Common variable data types include integers, floating-point numbers, and booleans.<br><br>
**Every variable in Go has its own type and must be declared before it can be used**.

#### Variable Declarations
> Variables in Go must be declared before use. Duplicate declarations are not allowed within the same scope. In addition, variables declared in Go must be used.

##### Standard Declaration
The syntax for declaring a variable in Go is:

```Go
var 变量名 变量类型
```
Summary: A variable declaration begins with the `var` keyword, the variable type follows the variable name, and no semicolon is required at the end of the line.


```Go
var name string
var age  int
var isOk bool
```
##### Grouped Declarations
Writing the `var` keyword for every variable declaration is cumbersome. Go supports grouped variable declarations, as shown below:


```Go
var(
    name string
    age  int
    isOk bool
)
```

##### Variable Initialization
When a variable is declared in Go, its corresponding memory region is automatically initialized. Each variable is initialized with the zero value of its type. For example:
The default value for integer and floating-point variables is `0`. The default value for string variables is an `empty string ""`. The default value for boolean variables is `false`. The default value for slices, functions, and pointer variables is `nil`.

We can also specify an initial value when declaring a variable. The syntax is as follows:


```Go
var 变量名 变量类型 = 表达式
```
For example:
```Go
var name string = "Zhangsan"
var age  int    = 15
var isOk bool   = false
```
Go also supports declaring multiple variables on a single line:
```Go
var name,age = "Lisi",25
```
Note that no variable types are specified here. This is because the Go compiler **infers** the variable types from the types of the values on the right-hand side of the equals sign.

###### Type Inference
When a variable is declared and assigned a value at the same time, its type can be omitted. Go automatically determines the type of the variable on the left-hand side based on the value on the right-hand side. For example:

```Go
var name = "Lisi" //As the value given is a string, the type name compiler will automatically assign it to a string
var age  = 15
```

###### Short Variable Declaration `:=`
Inside a Go function, you can use `:=` to declare and assign variables. For example:
```Go
package main

import "fmt"

var m = 100 //Declares global variablesm, which may not be used after the global variables are declared, and local variables must be used after the declaration

//n: = "str" / error reporting, = non-declarationable global variable

func main() {
	n := "abb"
	m := 100 //Declares the local variable m and uses: =

	//100
	//abb
	fmt.Println(m, n)
}

```
**Note that it cannot be used to declare global variables.**

###### Anonymous Variables

When using multiple assignment, you can use an anonymous variable to ignore a value. An anonymous variable is represented by an underscore, `_`. For example:

```
package main

import "fmt"

/**
 * Returns two variables, name and age
 */
func studentMsg(name string, age int) (string, int) {
	return name, age
}

func main() {
	//If only a name is needed here, age is ignored, an anonymous variable can be used. `Come and receive
	name, _ := studentMsg("张三", 25)
	_, age := studentMsg("李四", 28)
	
	fmt.Println("姓名是", name)
	fmt.Println("年龄是", age)
}
```
> In Go, a function can return multiple values. When receiving the values returned by a function, you can use `_` to ignore any value that is not needed.

#### Constants
Unlike variables, constants are immutable values. They are commonly used to define values that do not change while a program is running. Constant declarations are very similar to variable declarations, except that `var` is replaced with `const`. Constants must be assigned a value when they are defined.

```Go
const pi = 3.1415
const e = 2.7182
```
After the constants `pi` and `e` are declared, their values cannot change throughout the entire execution of the program.

Multiple constants can also be declared together:
```Go
const (
    pi = 3.1415
    e = 2.7182
)
```

When multiple constants are declared together with `const`, omitting a value means that the value from the preceding line is reused. For example:

```Go
const (
    n1 = 100
    n2
    n3
)
```
In the example above, the constants n1, n2, and n3 all have the value 100.

##### iota
`iota` is Go's constant counter and can only be used in constant expressions.

`iota` is reset to 0 whenever the `const` keyword appears. **Each new line of constant declarations within `const` increments the `iota` counter once** (`iota` can be understood as the line index within a `const` block). Using `iota` simplifies definitions and is particularly useful when defining enumerations.

For example:
```Go
const (
		n1 = iota //0
		n2        //1
		n3        //2
		n4        //3
	)
```
###### Several Common iota Examples:

- Using `_` to skip certain values

```Go
const (
		n1 = iota //0
		n2        //1
		_
		n4        //3
	)
```

- Inserting a value in the middle of an `iota` declaration

```Go
const (
		n1 = iota //0
		n2 = 100  //100
		n3 = iota //2
		n4        //3
	)
	const n5 = iota //0
```

- Defining units of magnitude
> Here, `<<` represents the left-shift operation. `1<<10` shifts the binary representation of 1 to the left by 10 bits, changing it from 1 to 10000000000, which is 1024 in decimal. Similarly, `2<<2` shifts the binary representation of 2 to the left by 2 bits, changing it from 10 to 1000, which is 8 in decimal.

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

Defining multiple iota values on a single line:

```Go
const (
		a, b = iota + 1, iota + 2 //1,2
		c, d                      //2,3
		e, f                      //3,4
	)
```
