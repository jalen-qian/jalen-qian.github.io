---
title: "贪心算法二：贪心解题套路实践－返回最多的会议室宣讲场次"
date: 2023-11-04T11:22:47+08:00
slug: algorithm/greedy-algorithm-02
lastmod: 2023-11-04T11:22:47+08:00
draft: false
keywords: []
description: ""
tags: ["贪心算法"]
categories: ["算法"]
author: "钱文军"
---

> 在上一篇博文中，通过一道比较基本的算法题来讨论了我们在遇到贪心这一类的算法题的时候的解题套路。简单来说，贪心问题实际上都是经验的积累，每道题的贪心策略，如果想要严格的证明其正确性是很难的，而且没有通用性。我们需要实际上并不需要证明，而是直接用实验验证的方式来解决。
>
> 上篇文章介绍了通过**对数器**验证的方式。实际上对数器是我们在验证算法正确性上的一个十分有效的方式，同时在写对数器时的**对比方法**（用暴力方式解决，复杂度高但好实现）、样本数据生成、测试用例等代码时，会对我们的Coding能力有很大的提升。
>
> 这篇我们将用此方式深度实践一个贪心算法问题

# 题目：返回最多的会议室宣讲场次

## 题目描述

假设你只有1个会议室，一些项目要占用这个会议室进行宣讲，会议室不能同时容纳两个项目进行宣讲。给你每一个项目开始的时间和结束的时间，你来安排宣讲的日程，要求会议室进行的宣讲的场次最多，并返回最多的宣讲场次。 一个项目宣讲完，下一个项目才可以宣讲，下一个项目的开始时间必须大于等于前一个项目的结束时间。

```go
// Program 项目会议宣讲
type Program struct {
    Start int // 开始时间
    End   int // 结束时间
}

// BestArrange 返回最多可以安排的场次
func BestArrange(programs []Program) int {
    //...
}
```

这里的开始时间和结束时间，可以理解成时间点，不用考虑在一天内有多少时间。比如一个项目可能是{1,100}，从1号时间点开始，从100号时间点结束。这里的Start和End只会是正整数，但是没有大小限制。

## 题目分析

假如输入的是`[{1,2},{4,5},{2,15},{16,18},{3,4},{7,17}]`

很明显我们应该选择`{1,2} -> {3,4} -> {4,5} -> {7,17}`  或者 `{1,2} -> {3,4} -> {4,5} -> {16,18}`

不管哪个，最终的结果都是`4`

## 贪心策略1：每次选择开始时间最早的

假设我们是安排会议的策划，每次上一个会议结束，都从剩下的项目宣讲中选择一个开始时间>=当前时刻的，且会议开始时间最早的。

这个安排是否合理呢？很明显不合理，无法达到全局最优解。在上面的例子中我们就很容易举出反例：

按照这个策略，最后选择的项目是`{1,2} -> {2,15} -> {16, 18} ` 最后返回3，而正确答案是4。

按照贪心问题的解决套路，如果能举出一个反例，那么就跳过。

## 贪心策略2：每次选择结束时间最早的

这次我们每次选择结束时间最早的，那么上述例子中，我们的会议安排会是：

`{1, 2} -> {3, 4} -> {4, 5} -> {7, 17} ` 

和我们分析的正确答案一致，貌似可行。

那么我们怎么证明这个策略一定是最优的呢？

答案是：无需证明，我们直接写代码验证。

### 贪心策略2代码实现

确定了贪心策略，我们的思路很简单：先将整个数组按照`end`从小到大排序，然后遍历，每次遍历安排一个会议，并记录结束时间。如果项目 `Start >= currentTime` ，则可以安排，最后统计安排的场次。代码实现如下：

```go
// BestArrange2 返回最多可以安排的场次，贪心策略：每次优先选择结束时间最早的。
func BestArrange2(programs []Program) int {
    // 先按照结束之间从早到晚排好序
    sort.Slice(programs, func(i, j int) bool {
        return programs[i].End < programs[j].End
    })
    curTime := 0 //当前时间点，从0开始
    count := 0   // 统计最后安排的次数
    for _, program := range programs {
        if program.Start >= curTime {
            count ++
            curTime = program.End
        }
    }
    return count
}
```

### 写对数器验证

#### 暴力实现

我们先用暴力方式实现这个题目。在这个方法中，我们**穷举所有的可能情况，并返回最大的场数**。在这里可以使用递归。具体代码如下：

```go
// BestArrange1 暴力方法：穷举所有情况，并返回选择的会议场数最多情况下的场数
// 使用递归实现
func BestArrange1(programs []Program) int {
    // 主函数传入所有项目，开始时间是0，之前已经安排的场数也是0
    return bestArrange1Process(programs, 0, 0)
}

// @param leftPrograms表示选择了某个项目后，还剩下的所有项目
// @param timeLine 选择完某个项目开完会议后的当前时间线
// @param done 之前已经安排了多少场会议
// 返回这种情况下，最大的场数
func bestArrange1Process(leftPrograms []Program, timeLine int, done int) int {
    // 如果剩下的项目为空，则直接返回之前已经安排的场数
    if len(leftPrograms) == 0 {
        return done
    }
    max := done
    // 穷举选择剩下的项目中，所有的项目，从当前时间开始，看哪一场最好
    for i := 0; i < len(leftPrograms); i++ {
        // 当前已经选了，将剩下的项目，除去当前已经选的，拷贝所有的，并递归
        if leftPrograms[i].Start >= timeLine {
            next := copyButExcept(leftPrograms, i)
            // 递归，时间线是当前选择的项目结束时间，已经完成的场次是当前done+1
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

代码解释：

**1. 递归函数 bestArrange1Process**

这个递归函数会在已经选择了一些项目（这个选择是暴力穷举的），还剩下了一些项目，时间线来到执行完之前那些项目的情况下，**穷举所有剩余的项目作为下一个，并返回最大的场次数。**

这个函数的参数有3个

1. **leftPrograms**  还剩余的项目列表
2. **timeLine** 之前执行完后，来到的时间点
3. **done** 之前的项目已经执行的会议场数

所以主函数这样调用：

```go
func BestArrange1(programs []Program) int {
    // 主函数传入所有项目，开始时间是0，之前已经安排的场数也是0
    return bestArrange1Process(programs, 0, 0)
}
```

**2. 函数 copyButExcept**  

在递归函数暴力选择了一个项目执行后，这个 copyButExcept 将剩下的所有项目，删除掉已经选择的项目，返回剩下的。并将这个剩下的执行递归，返回剩下的最大场数。

#### 对数器测试

```go
func TestBestArrange(t *testing.T) {
    testTimes := 100000 // 测试次数
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

// 返回随机的项目样本
// maxSize 最大项目个数
// timeMax 每个项目，最大的时间
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

在测试了十万组随机测试用例之后，**两种实现的结果都是一致的，足以说明贪心策略2的正确性**

![image-20231106151822766](http://cdn1.jalen-qian.com/Jalen/20231106151822pL1N19lHvc.png)

## 总结

在这篇文章中，通过一道真实的贪心算法题，实践了一遍我们在练习贪心算法时的**解题套路**。

在这个题目中，我们一共想了两个贪心策略。其中第一个我们很容易举出了反例，所以推翻跳过了。第二个策略能验证我们的例子，所以通过代码实现后，用对数器的方式实验验证了它的正确性。

在前一篇文章中也提到，贪心是一类需要不断积累经验的算法题，也是最自然且智慧的。在这个例子中，之所以贪心策略2是对的，是因为它每一步尽可能让会议更早结束（优先选择更早结束的项目），这样就能剩余更多的时间给其他项目，所以最后才能安排最多的场次。你看，多么合理且自然。

在遇到一个贪心问题时，我们需要根据积累的经验，分析出可能的贪心策略，然后我们不需要去严格证明它的正确性，实践是检验真理的唯一标准，**直接通过对数器的方式来验证。**

