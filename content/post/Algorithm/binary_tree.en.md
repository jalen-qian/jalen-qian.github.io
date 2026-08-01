---
title: "Binary Tree Fundamentals and Related Interview Questions"
date: 2023-10-25T23:17:52+08:00
lastmod: 2023-10-25T23:17:52+08:00
draft: false
keywords: []
description: ""
tags: ["Algorithms","Binary Trees"]
categories: ["Algorithms"]
author: "Wenjun Qian"
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
It's like: 1 2 3 4 5 6 7
```

### Traversing a Binary Tree Recursively
#### 1. Preorder Traversal
```go
// Pre performs a preorder traversal.
func (r *RecursiveTraversalBT) Pre(root *Node) {
	if root == nil {
		return
	}
	// Print root nodes first
	fmt.Printf("%d ", root.Value)
	// Print left tree again
	r.Pre(root.Left)
	// Print right subtree again
	r.Pre(root.Right)
}
```

#### 2. Inorder Traversal
```go
// In-Sequence
func (r *RecursiveTraversalBT) In(root *Node) {
	if root == nil {
		return
	}
	// Print left tree first
	r.In(root.Left)
	// Then visit the current node.
	fmt.Printf("%d ", root.Value)
	// Final printing of the right subtree
	r.In(root.Right)
}
```

#### 3. Postorder Traversal
```go
// Post-Pos Sequence
func (r *RecursiveTraversalBT) Pos(root *Node) {
	if root == nil {
		return
	}
	// Print left tree first
	r.Pos(root.Left)
	// Print right subtree again
	r.Pos(root.Right)
	// Finally visit the current node.
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
	// Through the left tree.
	f(root.Left)
	fmt.Println("第二次到达")
	// Through the right tree.
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
// Pre performs a preorder traversal.
func (r *UnRecursiveTraversalBT) Pre(root *Node) {
	if root == nil {
		return
	}
	// Create a stack and push the root node first.
	stack := class_03.NewMyStack[*Node]()
	stack.Push(root)
	for !stack.IsEmpty() {
		cur := stack.Pop()
		// Print when you're out.
		fmt.Printf("%d ", cur.Value)
		// If you have a right tree, you enter it.
		if cur.Right != nil {
			stack.Push(cur.Right)
		}
		// Push the left subtree when present.
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
// Post-Pos1 Sequence
func (r *UnRecursiveTraversalBT) Pos1(root *Node) {
	if root == nil {
		return
	}
	s1 := class_03.NewMyStack[*Node]()
	s2 := class_03.NewMyStack[*Node]()
	s1.Push(root)
	for !s1.IsEmpty() {
		head := s1.Pop()
		// Just go out, don't print, but press into another.
		s2.Push(head)
		// Push the left and right children to produce root-right-left order.
		if head.Left != nil {
			s1.Push(head.Left)
		}
		if head.Right != nil {
			s1.Push(head.Right)
		}
	}
	// Everything's done. Out
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
We take this tree as an example:
      1      
    /   \    
  2       3  
 / \     / \ 
4   5   6   7
1. At the beginning, cur went to the left border until it went to four, went to the inn, stack = one, two, four on the top, and then cur went to the left child, and it was empty.
2. Eject 4 printing. The inn is 12, Cur points to the right child. Cur is empty.
3. Eject 2 print, the stack is 1, Cur points to 5 to the right child, not empty, 5 to the left child, 15 to the left child, is empty
4. Eject 5 print. The stack is 1, Cur points to the right child as empty.
5. Pop one print, the inn is empty, Cur points to the right one, three.
6. 3入栈，栈是3，cur指向3的左孩子6
7. 6入栈，栈是3 6，cur指向6的左孩子，为空
8. Eject 6 print, the inn is 3, Cur points to the right child as empty.
9. Eject 3 printout. The inn is empty. Cur points to the right child of 3.
10.7入栈，栈是7，cur指向7的左孩子，是空
11.Eject 7 printing, Cur points to the right child of 7. It is empty, and it is empty, and Cur is empty and the cycle exits.
So, four, two, five, one, six, three, seven.
```
The code is as follows:
```go
// In-Sequence
func (r *UnRecursiveTraversalBT) In(root *Node) {
	if root == nil {
		return
	}
	// Push nodes while following the left boundary of the tree.
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
We take this tree as an example:
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

In summary, the overall print order is 1 2 3 4 5 6 7 by layer.
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
 
The sequence is: "1,2,4,#, #, 5, #, #, #, 3, 6, #, #, 7, #"

When it's re-sequenced, it's re-established in a priori way.
```

A binary tree can be serialized and deserialized using preorder, postorder, or level-order traversal.
However, a binary tree cannot be serialized and deserialized using inorder traversal.
This is because two different trees may produce the same inorder sequence, even if placeholders for nil nodes are included.
Consider the following two trees:
```
        __2
       /
      1
      
      and
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
// Sequenced and inverse fork tree

// Sets the head node of a fork tree, returns the serialized string
// Rule: Comma-separated between node values and empty node #

// SerializeAndReconstractBT to sequence and inverse the fork tree
type SerializeAndReconstructBT struct{}

// PreSerialize sequenced into string
func (s *SerializeAndReconstructBT) PreSerialize(head *TreeNode) string {
	queue := class_03.NewMyQueue[string]()
	// Sequenced
	s.preSerialize(head, queue)
	// Convert Queue to String
	return s.queueToStr(queue)
}

// Recursively sequenced
func (s *SerializeAndReconstructBT) preSerialize(head *TreeNode, queue *class_03.MyQueue[string]) {
	if head == nil {
		queue.Push("#")
	} else {
		// Let's go first.
		queue.Push(strconv.Itoa(head.Val))
		// Then to the left and the right.
		s.preSerialize(head.Left, queue)
		s.preSerialize(head.Right, queue)
	}
}

// Sequenced sequence of InSerialize
func (s *SerializeAndReconstructBT) InSerialize(head *TreeNode) string {
	queue := class_03.NewMyQueue[string]()
	// Sequenced
	s.inSerialize(head, queue)
	// Convert Queue to String
	return s.queueToStr(queue)
}

// Recursively sequence the middle sequence
func (s *SerializeAndReconstructBT) inSerialize(head *TreeNode, queue *class_03.MyQueue[string]) {
	if head == nil {
		queue.Push("#")
	} else {
		// Do left tree first.
		s.inSerialize(head.Left, queue)
		// Incoming.
		queue.Push(strconv.Itoa(head.Val))
		// And execute the right subtree.
		s.inSerialize(head.Right, queue)
	}
}

// Pos Serialize Sequenced to String
func (s *SerializeAndReconstructBT) PosSerialize(head *TreeNode) string {
	queue := class_03.NewMyQueue[string]()
	// Sequenced
	s.posSerialize(head, queue)
	// Convert Queue to String
	return s.queueToStr(queue)
}

// Recursive sequence
func (s *SerializeAndReconstructBT) posSerialize(head *TreeNode, queue *class_03.MyQueue[string]) {
	if head == nil {
		queue.Push("#")
	} else {
		// Do left tree first.
		s.posSerialize(head.Left, queue)
		// And execute the right subtree.
		s.posSerialize(head.Right, queue)
		// Incoming.
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

// Level Serialize Sequence by Layer
func (s *SerializeAndReconstructBT) LevelSerialize(head *TreeNode) string {
	queue := class_03.NewMyQueue[string]()
	// Sequenced
	// Prepare a Node queue for all layers.
	nodeQueue := NewTreeNodeQueue()
	// First in line.
	nodeQueue.Push(head)
	for !nodeQueue.IsEmpty() {
		// Let's go first.
		head = nodeQueue.Poll()
		// When you're out of the queue, add sequence. It's probably empty.
		if head == nil {
			queue.Push("#")
		} else {
			queue.Push(strconv.Itoa(head.Val))
			// The right and right sub-trees are in the queue. They don't judge empty, because empty is sequenced.
			nodeQueue.Push(head.Left)
			nodeQueue.Push(head.Right)
		}
	}
	// Convert Queue to String
	return s.queueToStr(queue)
}

// Inverse sequence

// BuildByPreSerialize transforms the string back into a tree by sequencing it.
func (s *SerializeAndReconstructBT) BuildByPreSerialize(preSer string) *TreeNode {
	// Empty Tree
	if preSer == "" || preSer == "#" {
		return nil
	}
	// Revert to Serialization Queue
	preQueue := s.getQueue(preSer)
	// Build a target tree by queue
	ans := s.buildByPreQueue(preQueue)
	return ans
}

func (s *SerializeAndReconstructBT) buildByPreQueue(queue *class_03.MyQueue[string]) *TreeNode {
	// Take one out of the queue as header Points
	head := s.buildNodeByQueue(queue)
	// Recursive
	if head != nil {
		head.Left = s.buildByPreQueue(queue)
		head.Right = s.buildByPreQueue(queue)
	}
	return head
}

// BuildByPosSerialize inverse string to tree after serialization
//        1
//       / \
//      2   3
//         /
//        4
// #,#,2,#,#,4,#,3,1
func (s *SerializeAndReconstructBT) BuildByPosSerialize(posSer string) *TreeNode {
	// Empty Tree
	if posSer == "" || posSer == "#" {
		return nil
	}
	// Back-to-back sequences: left right head, first left tree, then right subtree, then head node
	// And we've done it all the time: head, left, right.

	// In reordering the code of the non-retrogression method, we're going to start with the head, left, right, then the head, right, left.
	// And then you reverse it with a stack, and you turn it into a left, right, head sequence, which means you've got to go through it.

	// It's the same here, if the value of the posser is pressed sequentially into a canal, it becomes the head, right, left order, and then we proceed in a sequential way.

	// Revert to Serialized Stack.
	posStack := s.getStack(posSer)
	// Build a target tree by queue
	ans := s.buildByPosStack(posStack)
	return ans
}

func (s *SerializeAndReconstructBT) buildByPosStack(posStack *class_03.MyStack[string]) *TreeNode {
	// The current stack is the head, right, left, first the head, then the right, then the left.
	// 1. Ejection value
	strValue := posStack.Pop()
	if strValue == "#" {
		return nil
	}
	// Build header first
	headValue, _ := strconv.Atoi(strValue)
	head := &TreeNode{Val: headValue}
	// Recursive, build left and right subpoints, note that the order in the stack is head right left, so build follows the order first right and then left
	if head != nil {
		head.Right = s.buildByPosStack(posStack)
		head.Left = s.buildByPosStack(posStack)
	}
	return head
}

// BuildByLevelSerialize back-sequencing in layers
//        1
//       / \
//      2   3
//         /
//        4
// 1,2,3,#,#,4,#,#,#
func (s *SerializeAndReconstructBT) BuildByLevelSerialize(preSer string) *TreeNode {
	// Empty Tree
	if preSer == "" || preSer == "#" {
		return nil
	}
	// Revert to Serialization Queue
	preQueue := s.getQueue(preSer)
	// Build a target tree by queue
	ans := s.buildByLevelQueue(preQueue)
	return ans
}

func (s *SerializeAndReconstructBT) buildByLevelQueue(queue *class_03.MyQueue[string]) *TreeNode {
	head := s.buildNodeByQueue(queue)
	// Build a Node queue
	nodeQueue := NewTreeNodeQueue()
	// Queue front nodes
	nodeQueue.Push(head)
	for !nodeQueue.IsEmpty() {
		// Queue header
		node := nodeQueue.Poll()
		// The next two of the left trees of the current head queue must be the right and right trees of the current node
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

![encode_n_ary_tree](https://cdn1.jalen-qian.com/Jalen/202310252347566kVNEQA8pk.png)

Note that the method above is only an example and may or may not work. You do not need to follow this conversion format; you may devise and implement a different method.

### Approach
The approach can be summarized in one sentence: Suppose `x` is any node in the N-ary tree. Place all children of `x` along the right boundary starting from the left child of `x` in the binary tree.
Here is an example:

Suppose we have the following N-ary tree:

![n-tree](https://cdn1.jalen-qian.com/Jalen/20231025234832tsaA6b8rnU.png)

The binary tree produced using the approach above is as follows:
![image-20231025234850336](https://cdn1.jalen-qian.com/Jalen/20231025234850OkqJCOUeZw.png)

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

// Attach all children along the right boundary of btRoot's left child.
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
The width of the 2rd layer is 2 and returns 2.
Obviously it's not the higher the width of the layers.
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
1. Queue to 1, 1, Curend = 1; queue = [1];

2. 1出队列，count++; 
   1Left child 2 in queue, nextend = 2;
   1Right child 3 in line, nextend = 3;
   As 1=curEnd, the current line ends, max is updated to 1, while curEnd=nextEnd, nextEnd=nil, count zero;
   Final: queue= [3,2]; count=0; max=1; Curend=3; nextend= Neil

3. 2出队列，count++，count=1;
   2Left child 4 in line, nextend = 4;
   2Right child 5 in line, nextend = 5;
   Ultimately: queue= [5,4,3]; count=1; max=1; Curend=3; nextend=5;

4. 3出队列，count++,count=2;
   3No left child, why don't we line up?
   3Right child in line, nextend = 6;
   As 3=curEnd, current line end, max update to 2, while curEnd=nextEnd, nextEnd=nil, count zero
   Final: queue = [6,5,4]; count = 0; max = 2; Curend = 6; nextend = Neil;

5. 4出队列，count++，count=1，4没有孩子，不入队列。

6. 5出队列，count++，count=2；
   5Left child 7 in line, nextend = 7;
   Ultimately: queue = [7,6]; count = 2; max = 2; Curend = 6; nextend = 7;

7. 6出队列，count++，count=3；
   6Right child 8 in line, nextend = 8;
   Due to 6=curEnd, current line end, max update to 3 with curEnd=nextEnd, nextEnd=nil, count zero
   Final: queue = [8,7]; count = 0; max = 3; Curend = 8; nextend = Neil;
   
8. 7出队列，count++,count=1;
   7No children, no queue, 7 is not the same as curend, and the current line continues;
   
9. 8出队列，count++,count=2;
   8No children, no queues;
   As a result of 8=curEnd, the current line ends, max = 3 = 2 = not updated, while curEnd = nextEnd, nextEnd = Nil, count zero.
   Ultimately: queue=[]; count=2; max=3; Curend=nil; nextend=nil;
   At this point, the team is empty and the entire process is over and returns the maximum value 3.

```
Summary: Whenever a node is visited—that is, dequeued—we prepare the final node of the next level in advance and continually move it to the right. When the current level ends, nextEnd will point exactly to the final node of the next level.
At the same time, curNext tells us whether the current level has ended.

### Code Implementation

```go
package class_11_12

import "ZuoShenAlgorithmGo/utils"

// Set a fork tree and return maximum width

// MaxWidth doesn't use containers to make it happen.
func MaxWidth(root *TreeNode) int {
	if root == nil {
		return 0
	}
	// Generate a queue of the FreeNode type
	queue := NewTreeNodeQueue()
	var curEnd = root     // End of current line
	var nextEnd *TreeNode // End of next line
	var count int         // Statistics the width of the current row
	var max int           // Maximum width of the whole tree
	// Enqueue the root node first.
	queue.Push(root)
	// Queue is not empty, but it's going on.
	for !queue.IsEmpty() {
		// Dequeue one node and increment the current level width.
		cur := queue.Poll()
		count++
		// As long as there are right and right trees, it's the next line. Stay.
		if cur.Left != nil {
			queue.Push(cur.Left)
			nextEnd = cur.Left
		}
		if cur.Right != nil {
			queue.Push(cur.Right)
			nextEnd = cur.Right
		}
		// Determines whether the current line is now over, and if the current line is over, calculates max and resets the count, curend, nextend 3 variables
		if cur == curEnd {
			max = utils.Max(max, count)
			count = 0
			curEnd = nextEnd
			nextEnd = nil
		}
	}
	return max
}

// MaxWidthWithMap
func MaxWidthWithMap(root *TreeNode) int {
	if root == nil {
		return 0
	}
	// Generate a queue of the FreeNode type
	queue := NewTreeNodeQueue()
	// Generate a Map to record each node at the first level
	nodeLevelMap := make(map[*TreeNode]int)
	curLevel := 1 // Recording the current level
	count := 0    // Number of current layers of statistics
	max := 0      // Count the maximum width of the whole tree
	// First head node in line, while marking root on the first floor.
	queue.Push(root)
	nodeLevelMap[root] = 1

	// Queue is not empty, but it's going on.
	for !queue.IsEmpty() {
		// Popup a Node
		cur := queue.Poll()
		// Get this node on the first floor.
		curNodeLevel := nodeLevelMap[cur]
		// If current layer, the number of current layer ++
		if curNodeLevel == curLevel {
			count++
		} else {
			// If it's not the current layer, CurLevel jumps to the next layer.
			curLevel = curNodeLevel
			count = 1
		}
		max = utils.Max(max, count)
		// As long as there's a tree on the right and the right, it's the next line.
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

// Sets a node of a fork tree with a parent pointer, returns the node of the node Points

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
	// With right subtree, get the leftmost node of the right subtree
	if node.Right != nil {
		return getLeftMost(node.Right)
	} else {
		// No right tree.
		parent := node.Parent
		for parent != nil && parent.Right == node {
			node = parent
			parent = node.Parent
		}
		return parent
	}
}

// Find the left end of a tree.
func getLeftMost(node *TreeNodeP) *TreeNodeP {
	// Row left until Left is empty.
	cur := node
	for cur.Left != nil {
		cur = cur.Left
	}
	return cur
}

// GetSuccessor NodeNormal common method to find a follow-up node and do a logarithmometer test
func GetSuccessorNodeNormal(node *TreeNodeP) *TreeNodeP {
	if node == nil {
		return nil
	}
	// Found Roots
	root := node
	for root.Parent != nil {
		root = root.Parent
	}
	// Middle Sequence
	inQueue := class_03.NewMyQueue[*TreeNodeP]()
	inTreeNodeP(root, inQueue)
	// Middle-sequence eject and find the next
	for !inQueue.IsEmpty() && inQueue.Peek() != node {
		inQueue.Poll()
	}
	// Popup Current Node
	inQueue.Poll()
	// Popup Next of the current node
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
We're dented, } } } } , and three times folded as follows:

                         1Dent
                    /            \
              2Zoom 2
            /     \                  /      \
        3Zoom. Three. Three.
Go, go, go, go!
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

// The issue of dident tree origami

// PrintAllFolds in the order in which the creases are printed in turn
func PrintAllFolds(n int) {
	// Print from 1st floor (starting with root node) and a total of n, and the creases from 1st layer are dent marks
	process(1, n, true)
	fmt.Println()
}

// Recursive process: Imagine a problem-like fork tree, which is currently at some point in the first layer of the fork tree, with a total of N layers.
// And the crease of the current node is down = true, the dent, the false.
// Print the middle sequence of this subtree
func process(i int, n int, down bool) {
	// If the current layer exceeds the total number, return
	if i > n {
		return
	}
	// First left, then head, and then right.
	// I'll print the left tree. My left tree must have a dent and a layer bigger than me.
	process(i+1, n, true)
	// Print me again.
	if down {
		fmt.Print("凹 ")
	} else {
		fmt.Print("凸 ")
	}
	// Finally printing the right tree, my right tree must be crumbling, and it's one more layer than I am.
	process(i+1, n, false)
}
```



See the code for details:

[code07_paper_folding.go](https://github.com/jalen-qian/ZuoShenAlgorithmGo/blob/master/class_11_12/code07_paper_folding.go)
