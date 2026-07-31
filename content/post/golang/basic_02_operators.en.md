---
title: "Go Fundamentals: Operators"
date: 2020-09-10T08:37:56+08:00
lastmod: 2020-09-10T01:37:56+08:00
draft: false
tags: ["Golang"]
categories: ["Golang Column"]
author: "Jalen"
---

Operators are used to perform mathematical or logical operations while a program is running.

## Operators
Go has the following built-in operators:
1. Arithmetic operators
2. Relational operators
3. Logical operators
4. Bitwise operators
5. Assignment operators
6. Arithmetic operators

### Arithmetic Operators

| Operator | Description |
| -------- | ----------- |
| +        | Addition    |
| -        | Subtraction |
| *        | Multiplication |
| /        | Division    |
| %        | Modulus     |

Note: In Go, ++ (increment) and -- (decrement) are standalone statements, not operators.

### Relational Operators

| Operator | Description |
| -------- | ----------- |
| ==       | Checks whether two values are equal. Returns True if they are equal; otherwise, returns False. |
| !=       | Checks whether two values are not equal. Returns True if they are not equal; otherwise, returns False. |
| >        | Checks whether the left operand is greater than the right operand. Returns True if it is; otherwise, returns False. |
| >=       | Checks whether the left operand is greater than or equal to the right operand. Returns True if it is; otherwise, returns False. |
| <        | Checks whether the left operand is less than the right operand. Returns True if it is; otherwise, returns False. |
| <=       | Checks whether the left operand is less than or equal to the right operand. Returns True if it is; otherwise, returns False. |

### Logical Operators
| Operator | Description |
| -------- | ----------- |
| &&       | Logical AND operator. Returns True if both operands are True; otherwise, returns False. |
|          |             |
| !        | Logical NOT operator. Returns False if the condition is True; otherwise, returns True. |

### Bitwise Operators
Bitwise operators operate on the binary representation of integers in memory.

| Operator | Description |
| -------- | ----------- |
| &        | Performs a bitwise AND on the corresponding bits of two operands. (The result is 1 only when both bits are 1.) |
| `|`    | Performs a bitwise OR on the corresponding bits of two operands. (The result is 1 when either bit is 1.) |
| ^        | Performs a bitwise XOR on the corresponding bits of two operands. The result is 1 when the corresponding bits differ. |
| <<       | Shifting left by n bits is equivalent to multiplying by 2 to the power of n. “a<<b” shifts all binary bits of a to the left by b positions, discarding the high-order bits and filling the low-order bits with 0s. |
| >>       | Shifting right by n bits is equivalent to dividing by 2 to the power of n. “a>>b” shifts all binary bits of a to the right by b positions. |

### Assignment Operators
| Operator | Description |
| -------- | ----------- |
| =        | Simple assignment operator that assigns the value of an expression to an lvalue |
| +=       | Adds and assigns |
| -=       | Subtracts and assigns |
| *=       | Multiplies and assigns |
| /=       | Divides and assigns |
| %=       | Computes the remainder and assigns |
| <<=      | Shifts left and assigns |
| >>=      | Shifts right and assigns |
| &=       | Performs bitwise AND and assigns |
|          | = |
| ^=       | Performs bitwise XOR and assigns |
