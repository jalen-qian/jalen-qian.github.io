---
title: "Greedy Algorithms I: Exploring Greedy Methodology Through a Basic Problem"
slug: "algorithm/greedy-algorithm-01"
date: 2023-11-03T16:55:59+08:00
lastmod: 2023-11-03T16:55:59+08:00
draft: false
keywords: []
description: ""
tags: ["Greedy Algorithms"]
categories: ["Algorithms"]
author: "Wenjun Qian"
---

> A greedy algorithm solves a problem using a greedy strategy. Its core idea is to define a clear and effective strategy that selects the currently optimal solution at each step, with the expectation of reaching the global optimum. In some cases, a greedy strategy produces the optimal solution; in others, it does not. A successful greedy strategy is one that reaches the global optimum.

## Characteristics of Greedy Algorithms

1. Greedy algorithms are among the most "**natural and intelligent**" algorithms. Just as things in nature evolve by choosing the most favorable conditions available at the moment, greedy algorithms make choices based on what is currently most advantageous.
2. A greedy algorithm uses a locally **most self-serving criterion**, always making what appears to be the best choice at the moment.
3. The difficulty of greedy algorithms lies in proving that a locally optimal criterion can produce the global optimum.
4. Learning greedy algorithms primarily involves building knowledge and experience.



## Starting with a Problem

Below, I will begin with a classic greedy algorithm problem, propose different greedy strategies, and prove that one of them leads to the global optimum.

### Problem: Find the Lexicographically Smallest Permutation of a String Array

Given an array of strings `strings`, concatenate all the strings and return the lexicographically smallest result among all possible concatenations.

For example, given `["df", "abd", "d"]`, the result should be `"abdddf"`.

#### What Is Lexicographic Order?

Lexicographic order determines the ordering of two strings in a program. For example, `"abc"` is smaller than `"bbc"`. The comparison works as follows:

1. If two strings have the same length, compare them character by character from the beginning. The string with the larger character at the first differing position is larger, regardless of the characters that follow.

   For example, `"azzz"` is smaller than `"bcde"` because `a` is smaller than `b`. Although the following `z` characters are larger than `c`, `d`, and `e`, the former string is still smaller.

2. If two strings have different lengths, imagine padding the shorter string with the smallest ASCII value until it has the same length as the longer string, and then compare them.

   For example, when comparing `"abcd"` and `"ad"`, treat `"ad"` as `"ad00"` and compare `"abcd"` with `"ad00"` (the `0` here represents an imaginary minimum ASCII value, not the actual character `0`; every character is larger than it). Since `d` is larger than `b`, `"ad"` is larger than `"abcd"`.
   
3. **The essence of lexicographic order is to treat strings as numbers and compare their values.** For example, two strings consisting only of lowercase letters can be treated as two base-26 numbers. Given `"abc"` and `"kaj"`, `"kaj"` is larger because `k`, the higher-order digit, is larger. Similarly, if the character set contains 65,535 characters, a string can be viewed as a base-65,535 number. **The bases differ, but the comparison method is the same: the number with the larger higher-order digit is larger.**

#### A Greedy Approach to the Problem

The solution is straightforward: first sort the array according to a particular strategy, ensuring that concatenating the sorted strings in order produces the lexicographically smallest result among all possible concatenations. Sorting is based on comparisons. For example, when comparing `arr[i]` and `arr[j]`, which one should come first? **This comparison strategy is our greedy strategy.** Each comparison uses this strategy to determine which string comes first and which comes later—the local optimum. Once all strings have been sorted, the resulting concatenation satisfies the problem's requirement—the global optimum.

Therefore, **the key question is: what should this comparison strategy be?**

#### Greedy Strategy 1: Sort All Strings Lexicographically and Then Concatenate Them

For example:

```
["def", "abc", "c"]
By this strategy, the result is:
The end result is "abccdef."
```

The code implementation is:

```go
func minConcatenation(arr []string) string {
  // Incoming comparators, small dictionaries in front, large dictionaries in the back
    sort.Slice(arr, func(i, j int) bool {
        return arr[i] < arr[j]
    })
    return strings.Join(arr, "")
}
```



This strategy ensures that the strings in the array are sorted in ascending lexicographic order, but does it guarantee that **their complete concatenation is lexicographically smallest**?

**The answer is no.**

We can easily construct a counterexample, such as the following:

```
["ba","b"]
After the sequence, the result was "bba."

But obviously, the correct answer is "bab" smaller.
```

**A single counterexample is enough to show that this greedy strategy fails.**

#### Greedy Strategy 2: If a·b < b·a, Place a First; Otherwise, Place b First

Explanation: During sorting, when comparing strings `a` and `b` at positions `i` and `j`, concatenate `a` and `b` in both possible orders before comparing them.

**If a·b < b·a, place a first; otherwise, place b first.**

In the example above, because `"ba·b" < "b·ba"`, `"ba"` will ultimately be placed before `"b"`. The sorted array is:

```
["ba", "b"]
```

This produces the correct answer, `"bab"`. It satisfies the requirement, and the overall solution is as expected.

The code implementation is:

```go
func minConcatenation(arr []string) string {
  // The imported comparator, which will be compared after a.b < b.a., and a row in front, or b row in front
    sort.Slice(arr, func(i, j int) bool {
        return arr[i]+arr[j] < arr[j]+arr[i]
    })
    return strings.Join(arr, "")
}
```

How can we prove that this strategy is indeed a correct greedy strategy?

#### Proving the Correctness of Greedy Strategy 2

##### 1. Prove That the Sorting Strategy in Greedy Strategy 2 Is Transitive

Under the strategy above, suppose:

- a·b <= b·a
- b·c <= c·b

If we can derive `a·c <= c·a`, then the strategy is transitive. The conclusion is that we can indeed derive it. The proof follows:

As mentioned above, comparing strings lexicographically is essentially equivalent to converting them into numbers and comparing their values. For example:

Concatenating `"123"` and `"456"` produces `"123456"`, which is effectively `123 * 1000 + 456`.

a·b is essentially a base-`k` number.

Its value is `a * k^len(b) + b` (`a` multiplied by `k` raised to the power of the length of `b`, plus `b`).

For convenience in the mathematical description, suppose ` k^len(b)` is represented by a function `m(b)`. We then have:

```
, which can be defined as:
1) a·b = a*m(b) + b
2) b·a = b*m(a) + a
3) b·c = b*m(c) + c
4) c·b = c*m(b) + b

For example:
1) a*m(b) + b <= b*m(a) + a
2) b*m(c) + c <= c*m(b) + b

We're going to split it by two steps, minus one b, then multiply it by one c. Since c is a string and is a non-negative number, no sign direction is changed after multiplying)
=> a*m(b) <= b*m(a) + a - b
=> a*m(b)*c <= b*m(a)* c + a*c - b*c

We'll divide them by one b and multiply them by a.
=> b*m(c) + c - b <= c*m(b)
=> b*m(c)*a + a*c - a*b <= a*m(b)*c

Thus: b*m(c)*a + a*c - a*b < = a*m(b)*c < = b*m(a)*c + a*c - b*c
Thus: b*m(c)*a + a*c - a*b < = b*m(a)*c + a*c - b*c
There's a*c on both sides.
a*b*m(c) - a*b <= b*c*m(a) - b*c
Remove the b on both sides.
a*m(c) - a <= c*m(a) - c
And this is: a c < = c a
```

From the derivation above, **we have proven that the sorting rule in Greedy Strategy 2 is transitive**.

##### 2. Prove That the Entire Sorted Array Is Lexicographically Smallest

After sorting, suppose `a` is any string that appears earlier and `b` is any string that appears later, as shown below:

```
[......a.......b......]
```

We now need to prove that **swapping the positions of `a` and `b` necessarily increases the lexicographic order of the entire result**. The proof is as follows:

```
We assume that there are only two strings m1 and m2 between a and b, as follows:
[......a,m1,m2,b......]
As this is sequenced, a.m1 sure < = m1a
[......a,m1,m2,b......] <= [......m1,a,m2,b......]
a Before m2, a. m2 < = m2 a, so if the exchange of m2 and a continues, yes
[......m1,a,m2,b......] <= [......m1,m2,a,b......]
The same thing.
[......m1,m2,a,b......] <= [......m1,m2,b,a......]
[......m1,m2,b,a......] <= [......m1,b,m2,a......]
[......m1,b,m2,a......] <= [......b,m1,m2,a......]
As this sorting strategy has been shown to be transmissible, it is ultimately:
[......a,m1,m2,b......] <= [......b,m1,m2,a......]
Note: Any exchange of any two strings in the final array increases the final dictionary sequence.
```

Although the example above contains only two strings between `a` and `b`, it is easy to see that regardless of how many strings lie between them, swapping any such `a` and `b` will increase the lexicographic order of the final result. Therefore, after sorting, the overall concatenation must be lexicographically smallest. This completes the proof.

## Greedy Methodology

We can see that the rigorous proof above applies only to this specific strategy for this particular problem. Once the problem or strategy changes, the proof is no longer useful. In practice, rigorously proving a greedy strategy mathematically is very difficult.

**Moreover, we always propose a greedy strategy first and then attempt to prove it.**

Therefore, we only need to verify whether a greedy strategy can produce the global optimum—that is, whether it is correct. We can use the following methods:

1. If a **counterexample can quickly be found for a strategy**, the greedy strategy has failed and should be discarded immediately.

2. If no counterexample can be found, then in addition to a rigorous mathematical derivation like the one above, we can simply **verify it experimentally** using a **test harness**.

**The test harness works as follows:**

1. First, implement a brute-force solution that has high complexity but is easy to write. It does not have to use a greedy approach.
2. Implement the greedy strategy we devised.
3. Generate random test data in code.
4. Write a test function that runs against the random samples 100,000 times—or more or fewer, depending on the situation. **If the brute-force and greedy solutions produce the same result every time, this verifies that the greedy strategy is correct.**
5. If the results differ, the greedy strategy is incorrect. Devise a new greedy strategy and repeat step 4 until a correct one is found.

Note: During testing, the sample size, number of test runs, and other parameters can be adjusted as needed to achieve the verification objective.

This is the proper way to solve greedy algorithm problems. **We do not need to prove the strategy; instead, we can directly verify its correctness through experiments.**

### Solving the Problem Above with a Test Harness

Now that we have introduced experimental verification using a test harness, we can solve the previous problem again in this way. First, we need to implement a purely brute-force solution. The brute-force approach is as follows:

1. Exhaustively generate **the strings produced by all possible permutations** of the string array.
2. Find the lexicographically smallest string among all concatenated permutation results.

The brute-force code is as follows:

```go
// Method I: Violent methods, with all possible sequencing and least dictionaries
func minConcatenation1(arr []string) string {
    if len(arr) == 0 {
        return ""
    }
    // Get the results of all possible grouping.
    ans := process1(arr)
    // Sort the results from small to large by dictionary
    sort.Slice(ans, func(i,j int) bool {
        return ans[i] < ans[j]
    })
    // Number one is the return value.
    return ans[0]
}

// Enter a string array and return the result of the string spelled after all grouping
// Like in.
// Will return ["abcd", "cdab"]
func process1(arr []string) []string {
    ans := make([]string, 0)
    if len(arr) == 0 {
        ans = append(ans, "")
        return ans
    }
    // Starts with the string of the i position, and after the string of the i position is removed, the remaining string list continues to be organized and the characters of the i position are spelled on the head Thread
    for i := 0; i < len(arr); i++ {
        first := arr[i]
        removedList := removeIndexString(arr, i)
        next := process1(removedList)
        for _, cur := range next {
            ans = append(ans, first + cur)
        }
    }
    return ans
}

// Remove string from i position, return new number Group
func removeIndexString(arr []string, index int) []string {
    N := len(arr)
    if N == 0 {
        return nil
    }
    ans := make([]string, N-1)
    ansIndex := 0
    for i:=0; i < N; i ++ {
        if i != index {
            ans[ansIndex] = arr[i]
        }
    }
    return ans
}
```

**Our greedy solution is as follows:**

```go
func minConcatenation2(arr []string) string {
    sort.Slice(arr, func(i, j int) bool {
        return arr[i]+arr[j] < arr[j]+arr[i]
    })
    return strings.Join(arr, "")
}
```

**The test harness code is as follows:**

```go
package class_14

import (
    "math/rand"
    "testing"
    "time"
)

func TestMinConcatenation(t *testing.T) {
    testTimes := 100000 // Number of tests
    maxStrLength := 5   // Maximum string length in sample
    maxArrayLength := 6 // Maximum size of array in sample
    t.Log("测试开始...")
    for i := 0; i < testTimes; i++ {
        arr := generateRandomStrArr(maxStrLength, maxArrayLength)
        arr1 := copyStringArray(arr)
        arr2 := copyStringArray(arr)
        ans1 := minConcatenation1(arr)
        ans2 := minConcatenation2(arr1)
        if ans1 != ans2 {
            t.Errorf("测试失败\n 数组为：%v\n 暴力方法结果：%s\n 贪心方法结果: %s", arr2, ans1, ans2)
            return
        }
    }
    t.Log("测试成功")
}

const letterBytes = "abcdefghijklmnopqrstuvwxyz"

func generateRandomStrArr(maxStrLength, maxLength int) []string {
    myRand := rand.New(rand.NewSource(time.Now().UnixNano()))
    ans := make([]string, 0)
    n := myRand.Intn(maxLength + 1)
    for i := 0; i < n; i++ {
        ans = append(ans, generateRandomString(maxStrLength))
    }
    return ans
}

func generateRandomString(maxLength int) string {
    myRand := rand.New(rand.NewSource(time.Now().UnixNano()))
    length := myRand.Intn(maxLength+1) + 1
    b := make([]byte, length)
    for i := range b {
        b[i] = letterBytes[myRand.Intn(len(letterBytes))]
    }
    return string(b)
}

func copyStringArray(arr []string) []string {
    // Create a new string array with the same length as the input array
    copiedArray := make([]string, len(arr))

    // Use a cycle to copy each element to a new array Medium
    for i, value := range arr {
        copiedArray[i] = value
    }

    return copiedArray
}

```

**The test result is shown below:**

![image-20231104011721591](https://cdn1.jalen-qian.com/Jalen/20231104011721zgyD85oRln.png)

## A Standard Approach to Solving Greedy Algorithm Problems

1. Implement a solution X that does not rely on a greedy strategy. It can use the most straightforward brute-force approach.

2. Come up with Greedy Strategy A, Greedy Strategy B, Greedy Strategy C, and so on.

3. Use solution X and a test harness to experimentally determine which greedy strategy is correct.

4. Do not get hung up on proving the greedy strategy.
