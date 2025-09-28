# A. My First Sorting Problem

- Contest: Codeforces Round 939 (Div. 2): Contest 1971 (1971)
- time limit per test 1 second
- memory limit per test 256 megabytes
- input standard input
- output standard output

## Problem Statement

You have just started to learn how sorting works. To warm up, you want to sort a list that contains exactly two integers.

For each test case you are given two integers a and b. Output them in non-decreasing order.

## Input

The first line contains a single integer t (1 \le t \le 10^4) — the number of test cases.

The following t lines each contain two integers a and b (0 \le a, b \le 10^9).

## Output

For each test case output two integers separated by a space — the values a and b written in non-decreasing order.

## Sample Tests

### Sample 1

**Input**

```text
4
3 2
7 7
0 5
10 1
```

**Output**

```text
2 3
7 7
0 5
1 10
```

## Tutorial

The two numbers can already be compared directly. Print `min(a, b)` first and `max(a, b)` second.

No additional constraints apply, so a simple swap when a > b solves the task in constant time.
