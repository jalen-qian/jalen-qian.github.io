---
title: "Go Basics: Flow Control"
date: 2020-09-11T08:37:56+08:00
lastmod: 2020-09-11T01:37:56+08:00
draft: false
tags: ["Golang"]
categories: ["Golang Column"]
author: "Jalen"
---

Flow control is an essential part of every programming language for controlling the direction of logic and the order of execution. It can be regarded as the “meridians” of a programming language.

The most commonly used flow control constructs in Go are `if` and `for`, while `switch` and `goto` are extended flow control constructs primarily designed to simplify code and reduce duplication.

## if else (Branching Structure)

### Basic Syntax for if Conditions

The syntax for `if` conditional statements in Go is as follows:

```go
if 表达式1 {
    Branch 1
} else if 表达式2 {
    Branch 2
} else{
    Branch 3
}
```

When expression 1 evaluates to `true`, branch 1 is executed. Otherwise, expression 2 is evaluated. If it is satisfied, branch 2 is executed. If neither condition is satisfied, branch 3 is executed. Both `else if` and `else` in an if statement are optional and can be included as needed.

Go requires the opening brace `{` that corresponds to `if` to appear on the same line as the `if` expression. Placing `{` elsewhere will trigger a compilation error. Similarly, `{` corresponding to `else` must appear on the same line as `else`, and `else` must also appear on the same line as the closing brace of the preceding `if` or `else if`.

For example:

```go
func ifDemo1() {
    score := 65
    if score >= 90 {
        fmt.Println("A")
    } else if score > 75 {
        fmt.Println("B")
    } else {
        fmt.Println("C")
    }
}
```

### Special Syntax for if Conditions

There is also a special syntax for if conditions. You can add an execution statement before the if expression and then evaluate the variable's value. For example:

```go
func ifDemo2() {
    if score := 65; score >= 90 {
        fmt.Println("A")
    } else if score > 75 {
        fmt.Println("B")
    } else {
        fmt.Println("C")
    }
}
```

**Question:** What is the difference between the two approaches above?

## for (Loop Structure)

All types of loops in Go can be implemented using the `for` keyword.

The basic syntax of a for loop is as follows:

```bash
for 初始语句;条件表达式;结束语句{
    Cycle statement
}
```

The loop body continues to execute while the conditional expression evaluates to `true`. The loop exits automatically when the conditional expression evaluates to `false`.

```go
func forDemo() {
    for i := 0; i < 10; i++ {
        fmt.Println(i)
    }
}
```

The initialization statement of a for loop can be omitted, but the semicolon following it must still be included. For example:

```go
func forDemo2() {
    i := 0
    for ; i < 10; i++ {
        fmt.Println(i)
    }
}
```

Both the initialization and post statements of a for loop can be omitted. For example:

```go
func forDemo3() {
    i := 0
    for i < 10 {
        fmt.Println(i)
        i++
    }
}
```

This syntax is similar to `while` in other programming languages. A conditional expression is added after `while`, and the loop continues while the condition is satisfied; otherwise, the loop terminates.

### Infinite Loop

```go
for {
    Cycle statement
}
```

A for loop can be forcibly exited using the `break`, `goto`, `return`, or `panic` statement.

## for range (Key-Value Iteration)

In Go, `for range` can be used to iterate over arrays, slices, strings, maps, and channels. Values returned when iterating with `for range` follow these rules:

1. Arrays, slices, and strings return an index and a value.
2. Maps return a key and a value.
3. Channels return only the values received from the channel.

## switch case

The `switch` statement provides a convenient way to perform conditional checks against a large number of values.

```go
func switchDemo1() {
    finger := 3
    switch finger {
    case 1:
        fmt.Println("大拇指")
    case 2:
        fmt.Println("食指")
    case 3:
        fmt.Println("中指")
    case 4:
        fmt.Println("无名指")
    case 5:
        fmt.Println("小拇指")
    default:
        fmt.Println("无效的输入！")
    }
}
```

Go allows each `switch` to have only one `default` branch.

A branch can contain multiple values, with multiple case values separated by commas.

```go
func testSwitch3() {
    switch n := 7; n {
    case 1, 3, 5, 7, 9:
        fmt.Println("奇数")
    case 2, 4, 6, 8:
        fmt.Println("偶数")
    default:
        fmt.Println(n)
    }
}
```

Expressions can also be used in branches. In this case, the switch statement does not need to be followed by a variable to evaluate. For example:

```go
func switchDemo4() {
    age := 30
    switch {
    case age < 25:
        fmt.Println("好好学习吧")
    case age > 25 && age < 35:
        fmt.Println("好好工作吧")
    case age > 60:
        fmt.Println("好好享受吧")
    default:
        fmt.Println("活着真好")
    }
}
```

The `fallthrough` syntax executes the case following the matching case. It was designed for compatibility with case behavior in C.

```go
func switchDemo5() {
    s := "a"
    switch {
    case s == "a":
        fmt.Println("a")
        fallthrough
    case s == "b":
        fmt.Println("b")
    case s == "c":
        fmt.Println("c")
    default:
        fmt.Println("...")
    }
}
```

Output:

```bash
a
b
```

## goto (Jump to a Specified Label)

The `goto` statement performs an unconditional jump between sections of code using a label. The `goto` statement can be useful for quickly exiting loops and avoiding repeated exit logic. In Go, the `goto` statement can simplify the implementation of certain code. For example, when exiting a doubly nested for loop:

```go
func gotoDemo1() {
    var breakFlag bool
    for i := 0; i < 10; i++ {
        for j := 0; j < 10; j++ {
            if j == 2 {
                // Set Exit Tab
                breakFlag = true
                break
            }
            fmt.Printf("%v-%v\n", i, j)
        }
        // Outer for circulation judgement
        if breakFlag {
            break
        }
    }
}
```

Using the `goto` statement simplifies the code:

```go
func gotoDemo2() {
    for i := 0; i < 10; i++ {
        for j := 0; j < 10; j++ {
            if j == 2 {
                // Set Exit Tab
                goto breakTag
            }
            fmt.Printf("%v-%v\n", i, j)
        }
    }
    return
    // Label
breakTag:
    fmt.Println("结束for循环")
}
```

## break (Exit a Loop)

The `break` statement can terminate the code block of a `for`, `switch`, or `select` statement.

A label can also be added after a `break` statement to indicate that the code block associated with that label should be exited. The label must be defined on the corresponding `for`, `switch`, or `select` code block. For example:

```go
func breakDemo1() {
BREAKDEMO1:
    for i := 0; i < 10; i++ {
        for j := 0; j < 10; j++ {
            if j == 2 {
                break BREAKDEMO1
            }
            fmt.Printf("%v-%v\n", i, j)
        }
    }
    fmt.Println("...")
}
```

## continue (Continue to the Next Iteration)

The `continue` statement terminates the current iteration and begins the next iteration of the loop. It can only be used within a `for` loop.

When a label is added after a `continue` statement, the next iteration of the loop associated with that label begins. For example:

```go
func continueDemo() {
forloop1:
    for i := 0; i < 5; i++ {
        // forloop2:
        for j := 0; j < 5; j++ {
            if i == 2 && j == 2 {
                continue forloop1
            }
            fmt.Printf("%v-%v\n", i, j)
        }
    }
}
```

# Exercises

1. Write code to print a 9×9 multiplication table.
