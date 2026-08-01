---
title: "Greedy Algorithms II: Applying a Practical Problem-Solving Approach—Maximizing the Number of Conference Room Presentations"
date: 2023-11-04T11:22:47+08:00
slug: algorithm/greedy-algorithm-02
lastmod: 2023-11-04T11:22:47+08:00
draft: false
keywords: []
description: ""
tags: ["Greedy Algorithms"]
categories: ["Algorithms"]
author: "Wenjun Qian"
---

> In the previous post, we used a relatively basic algorithm problem to discuss a practical approach to solving greedy algorithm problems. In short, solving greedy problems is largely about accumulating experience. It is difficult to rigorously prove the correctness of the greedy strategy for each problem, and such proofs are not generally applicable. In practice, we do not need to prove it; instead, we can verify it directly through experiments.
>
> The previous article introduced verification using a **testing harness**. A testing harness is highly effective for validating the correctness of an algorithm. At the same time, writing the **reference implementation** used by the harness—solving the problem by brute force, which has high complexity but is easy to implement—as well as sample data generators and test cases can significantly improve our coding skills.
>
> In this article, we will use this approach to explore a greedy algorithm problem in depth.

# Problem: Maximize the Number of Conference Room Presentations

## Problem Description

Suppose you have only one conference room, and several projects need to use it for presentations. The conference room cannot accommodate two project presentations at the same time. Given the start and end times of each project, arrange the presentation schedule so that the maximum number of presentations can be held, and return that maximum number. One project must finish before the next can begin, meaning that the start time of the next project must be greater than or equal to the end time of the previous project.

```go
// Program represents a conference presentation project.
type Program struct {
    Start int // Start time
    End   int // End time
}

// BestArrange returns the maximum number of presentations that can be scheduled.
func BestArrange(programs []Program) int {
    //...
}
```

The start and end times can be understood as points on a timeline, without considering how many time units there are in a day. For example, a project might be represented as {1,100}, starting at time point 1 and ending at time point 100. Here, Start and End are positive integers with no upper limit.

## Problem Analysis

Suppose the input is `[{1,2},{4,5},{2,15},{16,18},{3,4},{7,17}]`

Clearly, we should choose `{1,2} -> {3,4} -> {4,5} -> {7,17}` or `{1,2} -> {3,4} -> {4,5} -> {16,18}`

Either way, the final result is `4`

## Greedy Strategy 1: Always Choose the Earliest Start Time

Suppose we are planning the meetings. Whenever the previous meeting ends, we select from the remaining project presentations one whose start time is greater than or equal to the current time and whose start time is the earliest.

Is this arrangement reasonable? Clearly not, because it cannot achieve the global optimum. Using the example above, we can easily construct a counterexample:

Following this strategy, the selected projects would be `{1,2} -> {2,15} -> {16, 18} `, and the method would return 3, whereas the correct answer is 4.

According to our approach to solving greedy problems, if we can construct a counterexample, we discard the strategy.

## Greedy Strategy 2: Always Choose the Earliest End Time

This time, we always choose the project with the earliest end time. In the example above, our meeting schedule would be:

`{1, 2} -> {3, 4} -> {4, 5} -> {7, 17} ` 

This matches the correct answer from our analysis, so the strategy appears feasible.

How, then, can we prove that this strategy is always optimal?

The answer is: we do not need to prove it. We can verify it directly by writing code.

### Implementation of Greedy Strategy 2

Once the greedy strategy has been determined, the approach is straightforward: first sort the entire array by `end` in ascending order, and then iterate through it. During each iteration, schedule a meeting and record its end time. If the project `Start >= currentTime`, it can be scheduled. Finally, count the number of scheduled presentations. The implementation is as follows:

```go
// BestArrange2 uses a greedy strategy: always choose the project that ends earliest.
func BestArrange2(programs []Program) int {
    // Sort projects by end time in ascending order.
    sort.Slice(programs, func(i, j int) bool {
        return programs[i].End < programs[j].End
    })
    curTime := 0 // Current point on the timeline, starting at 0
    count := 0   // Number of presentations scheduled
    for _, program := range programs {
        if program.Start >= curTime {
            count ++
            curTime = program.End
        }
    }
    return count
}
```

### Verification with a Testing Harness

#### Brute-Force Implementation

First, we implement a brute-force solution to this problem. This method **enumerates every possible arrangement and returns the maximum number of presentations**. Recursion can be used here. The code is as follows:

```go
// BestArrange1 uses brute force to enumerate every possible schedule and returns the maximum count.
// It is implemented recursively.
func BestArrange1(programs []Program) int {
    // Start with all projects, a timeline at 0, and no presentations scheduled.
    return bestArrange1Process(programs, 0, 0)
}

// @param leftPrograms contains the projects remaining after one has been selected.
// @param timeLine is the current time after the selected presentation ends.
// @param done is the number of presentations already scheduled.
// Returns the maximum number of presentations achievable from this state.
func bestArrange1Process(leftPrograms []Program, timeLine int, done int) int {
    // If no projects remain, return the number already scheduled.
    if len(leftPrograms) == 0 {
        return done
    }
    max := done
    // Try every remaining project that can start at the current time.
    for i := 0; i < len(leftPrograms); i++ {
        // Remove the selected project, copy the remainder, and recurse.
        if leftPrograms[i].Start >= timeLine {
            next := copyButExcept(leftPrograms, i)
            // Advance the timeline to this project's end and increment the completed count.
            max = utils.Max(max, bestArrange1Process(next, leftPrograms[i].End, done+1))
        }
    }
    return max
}

func copyButExcept(leftPrograms []Program, index int) []Program {
    var ans []Program
    for i, program := range leftPrograms {
        if i != index {
            ans = append(ans, program)
        }
    }
    return ans
}
```

Code explanation:

**1. Recursive function bestArrange1Process**

After some projects have already been selected through brute-force enumeration, this recursive function considers the remaining projects, with the timeline advanced to the point when the previously selected projects have finished. It **enumerates every remaining project as the next project and returns the maximum number of presentations that can be scheduled.**

This function has three parameters:

1. **leftPrograms**: the list of remaining projects
2. **timeLine**: the time point reached after the previously selected projects have finished
3. **done**: the number of presentations already completed

Therefore, the main function invokes it as follows:

```go
func BestArrange1(programs []Program) int {
    // Start with all projects, a timeline at 0, and no presentations scheduled.
    return bestArrange1Process(programs, 0, 0)
}
```

**2. Function copyButExcept**  

After the recursive function selects a project to execute through brute force, copyButExcept removes the selected project from all remaining projects and returns the rest. The remaining projects are then passed into the recursive call, which returns the maximum number of additional presentations.

#### Testing with the Harness

```go
func TestBestArrange(t *testing.T) {
    testTimes := 100000 // Number of tests
    maxSize := 100
    timeMax := 100
    t.Log("测试开始...")
    for i := 0; i < testTimes; i++ {
        programs := generateRandomPrograms(maxSize, timeMax)
        ans1 := BestArrange1(programs)
        ans2 := BestArrange2(programs)
        if ans1 != ans2 {
            t.Errorf("测试失败 \n 样本：%v \n ans1:%d \n ans2:%d", programs, ans1, ans2)
            return
        }
    }
    t.Log("测试成功")
}

// Returns a random sample of projects.
// maxSize is the maximum number of projects.
// timeMax is the maximum time value for each project.
func generateRandomPrograms(maxSize int, timeMax int) []Program {
    myRand := rand.New(rand.NewSource(time.Now().UnixNano()))
    ans := make([]Program, myRand.Intn(maxSize+1))
    for i := 0; i < len(ans); i++ {
        t1 := myRand.Intn(timeMax + 1)
        t2 := myRand.Intn(timeMax + 1)
        if t1 == t2 {
            ans[i] = Program{Start: t1, End: t1 + 1}
        } else {
            ans[i] = Program{Start: utils.Min(t1, t2), End: utils.Max(t1, t2)}
        }
    }
    return ans
}
```

After testing 100,000 sets of randomly generated test cases, **the results of both implementations are identical, which is sufficient to demonstrate the correctness of Greedy Strategy 2.**

![image-20231106151822766](https://cdn1.jalen-qian.com/Jalen/20231106151822pL1N19lHvc.png)

## Summary

In this article, we applied our **problem-solving approach** for greedy algorithms to a real greedy algorithm problem.

For this problem, we considered two greedy strategies. We easily constructed a counterexample for the first strategy, so we rejected it. The second strategy worked for our example, so after implementing it, we experimentally verified its correctness using a testing harness.

As mentioned in the previous article, greedy algorithms require continuous accumulation of experience, but they are also among the most natural and elegant types of algorithms. In this example, Greedy Strategy 2 is correct because each step makes the meeting end as early as possible by prioritizing the project with the earliest end time. This leaves more time for other projects, allowing the maximum number of presentations to be scheduled. As you can see, the reasoning is both sensible and natural.

When encountering a greedy problem, we should draw on our accumulated experience to identify possible greedy strategies. We do not need to rigorously prove their correctness. Practice is the sole criterion for testing truth: **verify the strategy directly with a testing harness.**
