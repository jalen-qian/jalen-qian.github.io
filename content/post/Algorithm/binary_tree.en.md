---
title: "Binary Tree Fundamentals and Related Interview Questions"
date: 2023-10-25T23:17:52+08:00
lastmod: 2023-10-25T23:17:52+08:00
draft: false
keywords: []
description: ""
tags: ["Algorithms","Binary Trees"]
categories: ["Algorithms"]
author: "钱文军"
---

# Binary Trees
A binary tree is a classic data structure. Each node has a Value and two subtrees: a left subtree and a right subtree.

## Binary Tree Traversal
Binary tree traversal is generally divided into three types: **preorder traversal**, **inorder traversal**, and **postorder traversal**.
1. Preorder traversal: Visit the root node first, then the left subtree, and finally the right subtree.
2. Inorder traversal: Visit the left subtree first, then the root node, and finally the right subtree.
3. Postorder traversal: Visit the left subtree first, then the right subtree, and finally the root node.

These three traversal orders are merely conventions. There are actually six possible traversal orders in total. For example, what kind of traversal would visit the right subtree first, then the left subtree, and finally the root node?

Binary trees can also be traversed level by level, visiting the nodes on each level from left to right. For example:
```
      1      
    /   \    
  2       3  
 / \     / \ 
4   5   6   7
遍历就是：1 2 3 4 5 6 7
```

### Traversing a Binary Tree Recursively
#### 1. Preorder Traversal
```go
// Pre 先序遍历
func (r *RecursiveTraversalBT) Pre(root *Node) {
	if root == nil {
		return
	}
	// 先打印根节点
	fmt.Printf("%d ", root.Value)
	// 再打印左子树
	r.Pre(root.Left)
	// 再打印右子树
	r.Pre(root.Right)
}
```

#### 2. Inorder Traversal
```go
// In 中序遍历
func (r *RecursiveTraversalBT) In(root *Node) {
	if root == nil {
		return
	}
	// 先打印左子树
	r.In(root.Left)
	// 再打印自己
	fmt.Printf("%d ", root.Value)
	// 最后打印右子树
	r.In(root.Right)
}
```

#### 3. Postorder Traversal
```go
// Pos 后序遍历
func (r *RecursiveTraversalBT) Pos(root *Node) {
	if root == nil {
		return
	}
	// 先打印左子树
	r.Pos(root.Left)
	// 再打印右子树
	r.Pos(root.Right)
	// 最后打印自己
	fmt.Printf("%d ", root.Value)
}
```

### Recursive Traversal Sequence
The recursive traversal sequence refers to the fact that each node is reached three times during traversal. The first time is when the current node is initially visited, the second time is after the left subtree has been traversed and execution returns to the current node, and the third time is after the right subtree has been traversed and execution returns to the current node.
```go
func f(root *Node) {
	if root == nil {
		return
	}
	fmt.Println("第一次到达")
	// 遍历左子树
	f(root.Left)
	fmt.Println("第二次到达")
	// 遍历右子树
	f(root.Right)
	fmt.Println("第三次到达")
}
```
The essence of preorder traversal is to **process the current node when it is reached for the first time**.<br>
The essence of inorder traversal is to **process the current node when it is reached for the second time**.<br>
The essence of postorder traversal is to **process the current node when it is reached for the third time**.


### Traversing a Binary Tree Iteratively

#### 1. Preorder Traversal
Prepare a stack and follow these steps:
1. Push the root node onto the stack and continue traversing as long as the stack is not empty.
2. Pop the top element into cur and print it immediately.
3. If it has a right subtree, push the right subtree onto the stack. If it has a left subtree, push the left subtree onto the stack. Push the right subtree before the left subtree.
4. Repeat steps 2 and 3 until the stack is empty.

Explanation: For every subtree, its root node is pushed onto the stack first and then popped. Its right subtree is then pushed, followed by its left subtree. Therefore, the nodes are popped in root-left-right order. This applies to every subtree, so the overall order is preorder traversal.


The code is as follows:
```go
// Pre 先序遍历
func (r *UnRecursiveTraversalBT) Pre(root *Node) {
	if root == nil {
		return
	}
	// 创建一个栈，并先把根节点压入
	stack := class_03.NewMyStack[*Node]()
	stack.Push(root)
	for !stack.IsEmpty() {
		cur := stack.Pop()
		// 出栈就打印
		fmt.Printf("%d ", cur.Value)
		// 有右子树，就入栈
		if cur.Right != nil {
			stack.Push(cur.Right)
		}
		// 有左子树，就入栈
		if cur.Left != nil {
			stack.Push(cur.Left)
		}
	}
	fmt.Println()
}
```

#### 2. Postorder Traversal
In the preorder traversal process, we use a stack to print nodes in root-left-right order. The root is pushed onto and then popped from the stack, after which the root's right and left subtrees are pushed onto the stack in that order.

Similarly, we can produce a root-right-left order by pushing the left subtree first and then the right subtree after popping the root.

Furthermore, the process above **prints a node as soon as it is popped**. We can modify it so that a popped node is not printed immediately but is instead pushed onto another stack. After the entire process is complete, we pop and print the nodes from the second stack.

The final output is therefore the reverse of root-right-left, which is left-right-root, implementing postorder traversal.

The code is as follows:
```go
// Pos1 后序遍历
func (r *UnRecursiveTraversalBT) Pos1(root *Node) {
	if root == nil {
		return
	}
	s1 := class_03.NewMyStack[*Node]()
	s2 := class_03.NewMyStack[*Node]()
	s1.Push(root)
	for !s1.IsEmpty() {
		head := s1.Pop()
		// 只要出栈，不打印，而是压入另一个栈
		s2.Push(head)
		// 弹出后依次压入左和右，实现整体 头 右 左 的顺序弹出
		if head.Left != nil {
			s1.Push(head.Left)
		}
		if head.Right != nil {
			s1.Push(head.Right)
		}
	}
	// 所有事情做完，依次将s2弹出
	for !s2.IsEmpty() {
		fmt.Printf("%d ", s2.Pop().Value)
	}
}
```

#### 4. Implementing Postorder Traversal with Only One Stack
This process is difficult, and even few interviewers know how to implement it. Zuo did not explain it in class and only provided the code. You may choose whether to learn it. The code is as follows:
```java
public static void pos2(Node h) {
	System.out.print("pos-order: ");
	if (h != null) {
		Stack<Node> stack = new Stack<Node>();
		stack.push(h);
		Node c = null;
		while (!stack.isEmpty()) {
			c = stack.peek();
			if (c.left != null && h != c.left && h != c.right) {
				stack.push(c.left);
			} else if (c.right != null && h != c.right) {
				stack.push(c.right);
			} else {
				System.out.print(stack.pop().value + " ");
				h = c;
			}
		}
	}
	System.out.println();
}
```

#### 5. Inorder Traversal
Inorder traversal visits the left subtree first, then the root node, and finally the right subtree. Regardless of how tall a binary tree is, **the first node visited must be the last node on the left boundary**, followed by the root node and the right subtree.<br>
Therefore, the essence of inorder traversal is to **divide the entire tree along its left boundaries**.

The inorder traversal process is as follows:

Prepare a stack and a cur variable. Initially, cur points to the root node. Continue looping while **the stack is not empty or cur is not nil**. Exit when both the stack and cur are empty.
1. If cur is not nil, push cur onto the stack and move cur to its left subtree.
2. If cur is nil, **pop a node from the stack into cur, print it, and then move cur to its right subtree**.
3. Repeat the process until cur is nil and the stack is empty.

A concrete example:
```
我们以这颗树为例：
      1      
    /   \    
  2       3  
 / \     / \ 
4   5   6   7
1. 初始cur不断往左边界走，直到走到4，一直入栈，stack = 1 2 4  栈顶是4，此时cur走到4的左孩子，是空
2. 弹出4打印，栈是 1 2，cur指向4的右孩子，cur又是空
3. 弹出2打印，栈是 1，cur指向2的右孩子为5，不为空，5入栈，栈是 1 5，cur来到5的左孩子，是空
4. 弹出5打印，栈是 1，cur指向5的右孩子为空
5. 弹出1打印，栈是空，cur指向1的右孩子，是3
6. 3入栈，栈是3，cur指向3的左孩子6
7. 6入栈，栈是3 6，cur指向6的左孩子，为空
8. 弹出6打印，栈是3，cur指向6的右孩子为空
9. 弹出3打印，栈为空，cur指向3的右孩子7
10.7入栈，栈是7，cur指向7的左孩子，是空
11.弹出7打印，cur指向7的右孩子，是空，此时栈是空，cur也是空，循环退出。
至此，依次打印了 4 2 5 1 6 3 7
```
The code is as follows:
```go
// In 中序遍历
func (r *UnRecursiveTraversalBT) In(root *Node) {
	if root == nil {
		return
	}
	// 创建一个栈，如果当前节点有左孩子，就压入，并不断往左边界靠
	stack := class_03.NewMyStack[*Node]()
	cur := root
	for !stack.IsEmpty() || cur != nil {
		if cur != nil {
			stack.Push(cur)
			cur = cur.Left
		} else {
			cur = stack.Pop()
			fmt.Printf("%d ", cur.Value)
			cur = cur.Right
		}
	}
	fmt.Println()
}
```

#### 6. Implementing Level-Order Traversal
If a binary tree is viewed as a graph, level-order traversal is breadth-first search and can be implemented using a queue.

Prepare a queue and first enqueue the root node.
1. Dequeue a node, print it, and assign it to cur.
2. If cur has a left child, enqueue the left child. If it has a right child, enqueue the right child.
3. Repeat steps 1 and 2 until the queue is empty.

Example:
```
我们以这颗树为例：
      1      
    /   \    
  2       3  
 / \     / \ 
4   5   6   7
1. 1入队列
2. 1弹出，打印，1给cur，cur的左右子树入队列[2,3]
3. 2弹出，打印，2给cur，cur的左右子树入队列[3,4,5]
4. 3弹出，打印，3个cur，cur的左右子树入队列[4,5,6,7]
5. 4弹出，打印，无左右子树，不入队列
6. 5弹出，打印，无左右子树，不入队列
7. 6弹出，打印，无左右子树，不入队列
8. 7弹出，打印，入左右子树，不入队列

综上，整体打印顺序是 1 2 3 4 5 6 7 按照层遍历。
```
Summary: This process traverses the tree level by level, but during traversal, we do not know where each level begins or ends. Some algorithm problems require this information, such as finding the maximum width of a level.


## Binary Tree Serialization and Deserialization
Given a binary tree in memory, we can convert it into a unique string according to a particular set of rules and reconstruct the same unique binary tree from that string. This is serialization and deserialization.

The conventional approaches are **preorder serialization** and **level-order serialization**.

For example, during preorder traversal, nil nodes are not omitted but are represented by #. For non-nil nodes, their values are appended, and all entries are separated by `,`.
```
               1      
        /              \    
        2               3  
     /    \           /     \ 
    4       5        6       7
   /\      / \      / \     / \
 nil nil nil nil   nil nil nil nil
 
先序方式序列化就是： "1,2,4,#,#,5,#,#,3,6,#,#,7,#,#"

反序列化时，也是按照先序的方式重新建树
```

A binary tree can be serialized and deserialized using preorder, postorder, or level-order traversal.
However, a binary tree cannot be serialized and deserialized using inorder traversal.
This is because two different trees may produce the same inorder sequence, even if placeholders for nil nodes are included.
Consider the following two trees:
```
        __2
       /
      1
      
      和
      1__
         \
          2
```
After filling in the nil positions, both produce the same inorder traversal result: { null, 1, null, 2, null} (#,1,#,2,#).

### Empty Trees
If the serialized string is "#", whether preorder, postorder, or level-order serialization is used, it represents a single nil node—that is, an empty tree. An empty string can also represent an empty tree.
To avoid ambiguity, we specify that an empty tree must always be serialized as "#". During deserialization, both an empty string and "#" are deserialized as an empty tree.

### Code Implementation

```go
// 序列化和反序列化二叉树

// 给定一个二叉树的头节点，返回序列化后的字符串
// 规则：节点值之间用逗号隔开，空节点用#表示

// SerializeAndReconstructBT 实现二叉树的序列化和反序列化
type SerializeAndReconstructBT struct{}

// PreSerialize 先序方式序列化成字符串
func (s *SerializeAndReconstructBT) PreSerialize(head *TreeNode) string {
	queue := class_03.NewMyQueue[string]()
	// 序列化
	s.preSerialize(head, queue)
	// 将队列转换成字符串
	return s.queueToStr(queue)
}

// 递归方式实现先序序列化
func (s *SerializeAndReconstructBT) preSerialize(head *TreeNode, queue *class_03.MyQueue[string]) {
	if head == nil {
		queue.Push("#")
	} else {
		// 先入队
		queue.Push(strconv.Itoa(head.Val))
		// 再递归左子树和右子树
		s.preSerialize(head.Left, queue)
		s.preSerialize(head.Right, queue)
	}
}

// InSerialize 中序方式序列化成字符串
func (s *SerializeAndReconstructBT) InSerialize(head *TreeNode) string {
	queue := class_03.NewMyQueue[string]()
	// 序列化
	s.inSerialize(head, queue)
	// 将队列转换成字符串
	return s.queueToStr(queue)
}

// 递归方式实现中序序列化
func (s *SerializeAndReconstructBT) inSerialize(head *TreeNode, queue *class_03.MyQueue[string]) {
	if head == nil {
		queue.Push("#")
	} else {
		// 先执行左子树
		s.inSerialize(head.Left, queue)
		// 再入队
		queue.Push(strconv.Itoa(head.Val))
		// 再执行右子树
		s.inSerialize(head.Right, queue)
	}
}

// PosSerialize 后序方式序列化成字符串
func (s *SerializeAndReconstructBT) PosSerialize(head *TreeNode) string {
	queue := class_03.NewMyQueue[string]()
	// 序列化
	s.posSerialize(head, queue)
	// 将队列转换成字符串
	return s.queueToStr(queue)
}

// 递归方式实现后序序列化
func (s *SerializeAndReconstructBT) posSerialize(head *TreeNode, queue *class_03.MyQueue[string]) {
	if head == nil {
		queue.Push("#")
	} else {
		// 先执行左子树
		s.posSerialize(head.Left, queue)
		// 再执行右子树
		s.posSerialize(head.Right, queue)
		// 再入队
		queue.Push(strconv.Itoa(head.Val))
	}
}

func (s *SerializeAndReconstructBT) queueToStr(queue *class_03.MyQueue[string]) string {
	if queue == nil || queue.IsEmpty() {
		return ""
	}
	var ans string
	isFirst := true
	for !queue.IsEmpty() {
		if isFirst {
			ans += queue.Poll()
			isFirst = false
		} else {
			ans += "," + queue.Poll()
		}
	}
	return ans
}

// LevelSerialize 按层遍历序列化
func (s *SerializeAndReconstructBT) LevelSerialize(head *TreeNode) string {
	queue := class_03.NewMyQueue[string]()
	// 序列化
	// 准备一个Node队列，用来实现按层遍历的
	nodeQueue := NewTreeNodeQueue()
	// 头节点先入队列
	nodeQueue.Push(head)
	for !nodeQueue.IsEmpty() {
		// 先出队列一个
		head = nodeQueue.Poll()
		// 出队列就加入序列化，可能是空，要判断，空就序列化成#
		if head == nil {
			queue.Push("#")
		} else {
			queue.Push(strconv.Itoa(head.Val))
			// 左右子树入队列，不判断空，因为空也要序列化
			nodeQueue.Push(head.Left)
			nodeQueue.Push(head.Right)
		}
	}
	// 将队列转换成字符串
	return s.queueToStr(queue)
}

// 反序列化

// BuildByPreSerialize 通过先序遍历序列化后的字符串反序列化成树
func (s *SerializeAndReconstructBT) BuildByPreSerialize(preSer string) *TreeNode {
	// 空树
	if preSer == "" || preSer == "#" {
		return nil
	}
	// 还原成序列化队列
	preQueue := s.getQueue(preSer)
	// 根据队列来构建目标树
	ans := s.buildByPreQueue(preQueue)
	return ans
}

func (s *SerializeAndReconstructBT) buildByPreQueue(queue *class_03.MyQueue[string]) *TreeNode {
	// 从队列中取出一个，作为头节点
	head := s.buildNodeByQueue(queue)
	// 递归
	if head != nil {
		head.Left = s.buildByPreQueue(queue)
		head.Right = s.buildByPreQueue(queue)
	}
	return head
}

// BuildByPosSerialize 通过后序遍历序列化后的字符串反序列化成树
//        1
//       / \
//      2   3
//         /
//        4
// #,#,2,#,#,4,#,3,1
func (s *SerializeAndReconstructBT) BuildByPosSerialize(posSer string) *TreeNode {
	// 空树
	if posSer == "" || posSer == "#" {
		return nil
	}
	// 后序遍历队列顺序：左 右 头， 先是左子树，再是右子树，最后是头节点
	// 而先序遍历我们已经实现了，先序遍历为：头，左，右。

	// 在改后序遍历非递归方法的代码时，我们是先将先序遍历的 头，左，右 改成 头，右，左 （这个改动很简单，交换两行代码顺序就能做到，本质是一样的）
	// 然后再用一个栈来逆序，改成了 左，右，头的顺序，也就是实现了后序遍历（每次要打印时，不打印，而是入栈，最后弹出）

	// 这里也是一样，如果将posSer的值按顺序压入一个栈中，则变成了 头，右，左的顺序，然后我们再按照先序遍历的方式处理

	// 还原成序列化栈
	posStack := s.getStack(posSer)
	// 根据队列来构建目标树
	ans := s.buildByPosStack(posStack)
	return ans
}

func (s *SerializeAndReconstructBT) buildByPosStack(posStack *class_03.MyStack[string]) *TreeNode {
	// 当前栈是 头 右 左的顺序，先弹出的是头，再弹出的是右子树，再弹出的是左子树
	// 1. 弹出头的值
	strValue := posStack.Pop()
	if strValue == "#" {
		return nil
	}
	// 先构建头节点
	headValue, _ := strconv.Atoi(strValue)
	head := &TreeNode{Val: headValue}
	// 递归，构建左右子节点，注意栈中的顺序是 头 右 左，所以构建时，也要遵循先右后左的顺序
	if head != nil {
		head.Right = s.buildByPosStack(posStack)
		head.Left = s.buildByPosStack(posStack)
	}
	return head
}

// BuildByLevelSerialize 按层遍历的方式反序列化
//        1
//       / \
//      2   3
//         /
//        4
// 1,2,3,#,#,4,#,#,#
func (s *SerializeAndReconstructBT) BuildByLevelSerialize(preSer string) *TreeNode {
	// 空树
	if preSer == "" || preSer == "#" {
		return nil
	}
	// 还原成序列化队列
	preQueue := s.getQueue(preSer)
	// 根据队列来构建目标树
	ans := s.buildByLevelQueue(preQueue)
	return ans
}

func (s *SerializeAndReconstructBT) buildByLevelQueue(queue *class_03.MyQueue[string]) *TreeNode {
	head := s.buildNodeByQueue(queue)
	// 构建一个Node队列
	nodeQueue := NewTreeNodeQueue()
	// 头节点入队列
	nodeQueue.Push(head)
	for !nodeQueue.IsEmpty() {
		// 头节点出队列
		node := nodeQueue.Poll()
		// 构建当前head的左子树 queue中的下两个一定是当前节点的左右子树
		left := s.buildNodeByQueue(queue)
		right := s.buildNodeByQueue(queue)
		if node != nil {
			node.Left = left
			node.Right = right
			if left != nil {
				nodeQueue.Push(left)
			}
			if right != nil {
				nodeQueue.Push(right)
			}
		}
	}
	return head
}

func (s *SerializeAndReconstructBT) getQueue(serialized string) *class_03.MyQueue[string] {
	queue := class_03.NewMyQueue[string]()
	for _, str := range strings.Split(serialized, ",") {
		queue.Push(str)
	}
	return queue
}

func (s *SerializeAndReconstructBT) getStack(serialized string) *class_03.MyStack[string] {
	stack := class_03.NewMyStack[string]()
	for _, str := range strings.Split(serialized, ",") {
		stack.Push(str)
	}
	return stack
}

func (s *SerializeAndReconstructBT) buildNodeByQueue(queue *class_03.MyQueue[string]) *TreeNode {
	if queue.IsEmpty() {
		return nil
	}
	v := queue.Poll()
	if v == "#" {
		return nil
	} else {
		nodeValue, _ := strconv.Atoi(v)
		return &TreeNode{Val: nodeValue}
	}
}
```

See the code for details:

[code04_serialize_and_reconstruct_tree.go](https://github.com/jalen-qian/ZuoShenAlgorithmGo/blob/master/class_11_12/code04_serialize_and_reconstruct_tree.go)

## Algorithm Interview Question: Encode an N-ary Tree as a Binary Tree
Encode N-ary Tree to Binary Tree

Original LeetCode problem: [https://leetcode.cn/problems/encode-n-ary-tree-to-binary-tree/](https://leetcode.cn/problems/encode-n-ary-tree-to-binary-tree/)

Design an algorithm that encodes an N-ary tree into a binary tree and decodes the binary tree back into the original N-ary tree. An N-ary tree is a rooted tree in which each node has no more than N children. Similarly, a binary tree is a rooted tree in which each node has no more than two children. There are no restrictions on the implementation of your encoding and decoding algorithms. You only need to ensure that an N-ary tree can be encoded into a binary tree and that the binary tree can be decoded back into the original N-ary tree.

The binary tree can be viewed as the serialized representation of the N-ary tree, from which the original N-ary tree can be reconstructed.

For example, you could encode the following ternary tree in this way:

![encode_n_ary_tree](http://cdn1.jalen-qian.com/Jalen/202310252347566kVNEQA8pk.png)

Note that the method above is only an example and may or may not work. You do not need to follow this conversion format; you may devise and implement a different method.

### Approach
The approach can be summarized in one sentence: Suppose `x` is any node in the N-ary tree. Place all children of `x` along the right boundary starting from the left child of `x` in the binary tree.
Here is an example:

Suppose we have the following N-ary tree:

![n-tree](http://cdn1.jalen-qian.com/Jalen/20231025234832tsaA6b8rnU.png)

The binary tree produced using the approach above is as follows:
![image-20231025234850336](http://cdn1.jalen-qian.com/Jalen/20231025234850OkqJCOUeZw.png)

As we can see, all of a's children are attached along the right boundary of a's left subtree: b->c->d.

The children of b are also attached along the right boundary beginning with b's left child: e->f.

All of c's children are attached along the right boundary beginning with c's left child: g->h->i->j.

### Detailed Code Explanation

```go
/**
 * Definition for a Node.
 * type Node struct {
 *     Val int
 *     Children []*Node
 * }
 */

/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */


type Codec struct {
}

func Constructor() *Codec {
	return &Codec{}
}

func (this *Codec) encode(root *Node) *TreeNode {
	if root == nil {
		return nil
	}
	btRoot := &TreeNode{Val: root.Val}
	btRoot.Left = this.ec(root.Children)
	return btRoot
}

// 将所有孩子挂在btRoot的左孩子右边界上
func (this *Codec) ec(children []*Node) *TreeNode {
	var head *TreeNode
	var cur *TreeNode
	for _, child := range children {
		childBT := &TreeNode{Val: child.Val}
		if head == nil {
			head = childBT
		} else {
			cur.Right = childBT
		}
		cur = childBT
		cur.Left = this.ec(child.Children)
	}
	return head
}

func (this *Codec) decode(root *TreeNode) *Node {
	if root == nil {
		return nil
	}
	nRoot := &Node{Val: root.Val, Children: this.dc(root.Left)}
	return nRoot
}

func (this *Codec) dc(left *TreeNode) []*Node {
	var children []*Node
	cur := left
	for cur != nil {
		n := &Node{Val: cur.Val, Children: this.dc(cur.Left)}
		children = append(children, n)
		cur = cur.Right
	}
	return children
}
```

See the code for details:

[code05_encode_nary_tree_to_binary_tree.go](https://github.com/jalen-qian/ZuoShenAlgorithmGo/blob/master/class_11_12/code05_encode_nary_tree_to_binary_tree.go)

## Algorithm Interview Question: Given a Binary Tree, Return Its Maximum Width
For example:
```
             1
            / \
           2   3
               / \
              4   5
              /
              6
               \
                7
第2 3层的宽度都是2，则返回2。
显然不是层数越高宽度越高。
```

### Approach
We have already implemented level-order traversal. If we can keep track of where the current level begins and ends during traversal, we can calculate the width of each level. This assumes that you are already familiar with the level-order traversal process. If not, refer to the earlier level-order traversal code. We only need a few variables, defined as follows:
1. max: Records the maximum width globally. Whenever the width of a level exceeds max, update max. Finally, return max.
2. curEnd (*TreeNode type): Records the final node of the level currently being traversed.
3. nextEnd (*TreeNode type): Records the final node of the next level to be traversed, preparing for traversal of that level.
4. count: Records the width of the current level. Whenever a node from the current level is dequeued, increment count.

The process is illustrated below:<br>
Suppose a tree has the following structure:
```
                1
              /   \
             2     3
            / \     \
           4   5     6 
               /      \
              7        8
```
The process proceeds as follows:
```
max=0; curEnd=nil; nextEnd=nil; count=0;
1. 遍历到1,1入队列，curEnd = 1; queue = [1];

2. 1出队列，count++; 
   1左孩子2入队列，nextEnd=2; 
   1右孩子3入队列，nextEnd=3; 
   由于1==curEnd，当前行结束，max更新为1，同时curEnd=nextEnd,nextEnd=nil, count清零; 
   最终：queue=[3,2]; count=0; max=1; curEnd=3; nextEnd=nil

3. 2出队列，count++，count=1;
   2左孩子4入队列，nextEnd=4;
   2右孩子5入队列，nextEnd=5;
   最终：queue=[5,4,3]; count=1; max=1; curEnd=3; nextEnd=5;

4. 3出队列，count++,count=2;
   3没有左孩子，不如队列
   3右孩子入队列，nextEnd=6;
   由于3==curEnd，当前行结束，max更新为2，同时curEnd=nextEnd,nextEnd=nil, count清零
   最终：queue=[6,5,4]；count=0; max=2; curEnd=6; nextEnd=nil;

5. 4出队列，count++，count=1，4没有孩子，不入队列。

6. 5出队列，count++，count=2；
   5的左孩子7入队列，nextEnd=7;
   最终：queue=[7,6]; count=2; max=2; curEnd=6; nextEnd=7;

7. 6出队列，count++，count=3；
   6的右孩子8入队列，nextEnd=8;
   由于6==curEnd，当前行结束，max更新为3，同时curEnd=nextEnd,nextEnd=nil, count清零
   最终：queue=[8,7]; count=0; max=3; curEnd=8; nextEnd=nil;
   
8. 7出队列，count++,count=1;
   7没有孩子，不入队列，7也不等于curEnd，当前行继续;
   
9. 8出队列，count++,count=2;
   8没有孩子，不入队列；
   由于8==curEnd，当前行结束，max=3比2大不更新，同时curEnd=nextEnd,nextEnd=nil, count清零。
   最终：queue=[]; count=2; max=3; curEnd=nil; nextEnd=nil;
   此时队列为空，整个遍历流程结束，返回最大值3。

```
Summary: Whenever a node is visited—that is, dequeued—we prepare the final node of the next level in advance and continually move it to the right. When the current level ends, nextEnd will point exactly to the final node of the next level.
At the same time, curNext tells us whether the current level has ended.

### Code Implementation

```go
package class_11_12

import "ZuoShenAlgorithmGo/utils"

// 给定一颗二叉树，返回最大的宽度

// MaxWidth 不使用容器实现
func MaxWidth(root *TreeNode) int {
	if root == nil {
		return 0
	}
	// 生成一个TreeNode类型的队列
	queue := NewTreeNodeQueue()
	var curEnd = root     // 当前行的结束
	var nextEnd *TreeNode // 下一行的结束
	var count int         // 统计当前行的宽度
	var max int           // 整个树最大的宽度
	// 先将头节点入队
	queue.Push(root)
	// 队列不为空，则一直进行
	for !queue.IsEmpty() {
		// 弹出一个节点，就统计当前行宽度+1
		cur := queue.Poll()
		count++
		// 只要有左右子树，则一定是下一行的，下一行结束节点先记住
		if cur.Left != nil {
			queue.Push(cur.Left)
			nextEnd = cur.Left
		}
		if cur.Right != nil {
			queue.Push(cur.Right)
			nextEnd = cur.Right
		}
		// 判断当前行是否现在结束了，如果当前行结束了，则统计max，并重置count,curEnd,nextEnd 3个变量
		if cur == curEnd {
			max = utils.Max(max, count)
			count = 0
			curEnd = nextEnd
			nextEnd = nil
		}
	}
	return max
}

// MaxWidthWithMap 使用容器实现
func MaxWidthWithMap(root *TreeNode) int {
	if root == nil {
		return 0
	}
	// 生成一个TreeNode类型的队列
	queue := NewTreeNodeQueue()
	// 生成一个map记录每个节点在第几层
	nodeLevelMap := make(map[*TreeNode]int)
	curLevel := 1 // 记录当前在第几层
	count := 0    // 统计当前层的个数
	max := 0      // 统计整棵树最大的宽度
	// 先将头节点入队，同时标记root在第1层
	queue.Push(root)
	nodeLevelMap[root] = 1

	// 队列不为空，则一直进行
	for !queue.IsEmpty() {
		// 弹出一个节点
		cur := queue.Poll()
		// 获取这个节点在第几层
		curNodeLevel := nodeLevelMap[cur]
		// 如果还是当前层，则当前层的数量++
		if curNodeLevel == curLevel {
			count++
		} else {
			// 如果不是当前层了，则curLevel跳到下一层
			curLevel = curNodeLevel
			count = 1
		}
		max = utils.Max(max, count)
		// 只要有左右子树，则一定是下一行的，入队同时将层数记录下来
		if cur.Left != nil {
			queue.Push(cur.Left)
			nodeLevelMap[cur.Left] = curLevel + 1
		}
		if cur.Right != nil {
			queue.Push(cur.Right)
			nodeLevelMap[cur.Right] = curLevel + 1
		}
	}
	return max
}
```

See the code for details:

[code05_tree_max_width.go](https://github.com/jalen-qian/ZuoShenAlgorithmGo/blob/master/class_11_12/code05_tree_max_width.go)

## Interview Question: Given a Node in a Binary Tree with Parent Pointers, Return Its **Successor Node**
The binary tree node structure is as follows:
```go
type TreeNodeP struct {
	Val int
	Parent *TreeNodeP
	Left *TreeNodeP
	Right *TreeNodeP
}
```
Given a node in this binary tree, return its successor node. If it has no successor, return nil.

### Successor Node
A successor node is the node immediately following a given node when the binary tree's nodes are arranged in inorder traversal order. For example, consider the following binary tree:
```
                  a
               /     \
              b       c
             / \     / \
            d   e   f   g
                   / \
                  h   i
                       \
                        j
```
Its inorder traversal is `dbeahfijcg`. Therefore, the successor of `b` is `e`, and the successor of `c` is `g`.

### Approach
Normally, to find the successor of a node in a binary tree, we need both the root node and the target node X. We first generate the inorder traversal sequence from the root node and then find the node following X in that sequence.
The time complexity of this process is O(N), where N is the number of nodes.

Now that node X can access its parent, we can solve the problem using only X, without being given the root node. This is because X can repeatedly move upward until it reaches the root, after which the inorder traversal can be generated.

However, this method still has O(N) time complexity. Is there a way to achieve O(K) time complexity, where K is the distance between the current node and its successor? For example, in the tree above, the successor of node `e` is the root node `a`, and the distance between `e` and `a` is only 2, while traversing the entire tree involves 10 nodes.

The answer is yes. The process is as follows:
1. If X has a right child, the successor of X is the leftmost node in X's right subtree. For example, the successor of a above is h, the leftmost node in its right subtree.
2. If X has no right child, follow its parent pointers upward. If X is the right child of its parent, continue moving upward until reaching a node that is the left child of its parent. That parent is the successor of X.<br>
   For example, starting from node j above, we find its parent i. Since j is the right child of i, continue. We then find i's parent f. Since i is the right child of f, continue. Next, we find f's parent c. Since f is the left child of c, stop. Therefore, c is the successor of i.
3. If step 2 reaches nil without finding a node that is the left child of its parent, **the original node is the rightmost node in the entire tree and has no successor**.

The time complexity of this process is O(K).

### Code Implementation

```go
package class_11_12

import "ZuoShenAlgorithmGo/class_03"

// 给定一个有父指针的二叉树的某个节点，返回该节点的后继节点

type TreeNodeP struct {
	Val    int
	Parent *TreeNodeP
	Left   *TreeNodeP
	Right  *TreeNodeP
}

func GetSuccessorNode(node *TreeNodeP) *TreeNodeP {
	if node == nil {
		return nil
	}
	// 有右子树，则获取右子树最左侧的节点
	if node.Right != nil {
		return getLeftMost(node.Right)
	} else {
		// 没有右子树
		parent := node.Parent
		for parent != nil && parent.Right == node {
			node = parent
			parent = node.Parent
		}
		return parent
	}
}

// 找一棵树最左侧的节点
func getLeftMost(node *TreeNodeP) *TreeNodeP {
	// 一直往左划，直到划到Left为空
	cur := node
	for cur.Left != nil {
		cur = cur.Left
	}
	return cur
}

// GetSuccessorNodeNormal 普通方法找到后继节点，同时做对数器测试
func GetSuccessorNodeNormal(node *TreeNodeP) *TreeNodeP {
	if node == nil {
		return nil
	}
	// 找到根节点
	root := node
	for root.Parent != nil {
		root = root.Parent
	}
	// 中序遍历
	inQueue := class_03.NewMyQueue[*TreeNodeP]()
	inTreeNodeP(root, inQueue)
	// 中序遍历顺序弹出，并找下一个
	for !inQueue.IsEmpty() && inQueue.Peek() != node {
		inQueue.Poll()
	}
	// 弹出当前节点
	inQueue.Poll()
	// 弹出当前节点的下一个
	return inQueue.Poll()
}

func inTreeNodeP(root *TreeNodeP, inQueue *class_03.MyQueue[*TreeNodeP]) {
	if root == nil {
		return
	}
	inTreeNodeP(root.Left, inQueue)
	inQueue.Push(root)
	inTreeNodeP(root.Right, inQueue)
}
```

See the code for details:

[code06_successor_node.go](https://github.com/jalen-qian/ZuoShenAlgorithmGo/blob/master/class_11_12/code06_successor_node.go)


## Microsoft Interview Question: The Binary Tree Paper-Folding Problem
Place a strip of paper vertically on a table. Fold it once from the bottom upward, press it to create a crease, and then unfold it. The crease is now concave, meaning that its raised side points toward the back of the paper. If the strip is folded twice consecutively from the bottom upward and then unfolded, there will be three creases. From top to bottom, they are a down crease, a down crease, and an up crease.
Given an input parameter N, representing the number of times the strip is folded consecutively from the bottom upward, print the directions of all creases from top to bottom.
For example, when N=1, print: down. When N=2, print: down down up.

### Approach
After folding once, one concave crease appears, which we denote as 1-concave.<br>
After folding twice, a concave crease and a convex crease appear above and below the first crease, respectively. We denote them as 2-concave and 2-convex. The resulting order is concave, concave, convex.<br>
After folding three times, a concave crease and a convex crease appear above and below each crease introduced during the second fold. We denote them as 3-concave and 3-convex. The resulting order is concave, concave, convex, concave, concave, convex, convex.<br>

In other words, each time we fold the paper, a concave crease and a convex crease appear above and below every crease introduced during the previous fold. This forms a complete binary tree, as shown below:

```                      
我们用|表示凹折痕，用}表示凸折痕，对折3次的样子如下：

                         1凹
                    /            \
              2凹                       2凸
            /     \                  /      \
        3凹        3凸           3凹           3凸        
上 【    |    |     }     |       |      }      }     】 下
```

The objective of the problem is to print the inorder traversal of the tree above.

This binary tree has the following characteristics:
1. The root node is concave.
2. The root node of every left subtree is concave.
3. The root node of every right subtree is convex.

### Code Implementation

```go
package class_11_12

import "fmt"

// 二叉树折纸问题

// PrintAllFolds 折N次依次打印折痕顺序
func PrintAllFolds(n int) {
	// 从第1层开始打印（从根节点开始），而且总共有n，且第1层的折痕是凹折痕
	process(1, n, true)
	fmt.Println()
}

// 递归过程：想象一个如题的二叉树，当前是在这个二叉树的第i层的某个节点，总共有N层。
// 并且当前节点的折痕是 down == true 则是凹折痕，false 则为凸折痕
// 打印这个子树的中序遍历
func process(i int, n int, down bool) {
	// 如果当前层已经超过了总层数，则返回
	if i > n {
		return
	}
	// 先左再头再右，中序遍历。
	// 先打印左子树，我的左子树一定是凹折痕，且层数比我大1
	process(i+1, n, true)
	// 再打印我自己
	if down {
		fmt.Print("凹 ")
	} else {
		fmt.Print("凸 ")
	}
	// 最后打印右子树，我的右子树一定是凸折痕，且层数比我大1
	process(i+1, n, false)
}
```



See the code for details:

[code07_paper_folding.go](https://github.com/jalen-qian/ZuoShenAlgorithmGo/blob/master/class_11_12/code07_paper_folding.go)
