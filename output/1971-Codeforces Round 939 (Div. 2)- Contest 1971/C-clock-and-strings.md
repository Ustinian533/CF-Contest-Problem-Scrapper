# C. Clock and Strings

- Contest: Codeforces Round 939 (Div. 2): Contest 1971 (1971)
- time limit per test 2 seconds
- memory limit per test 256 megabytes
- input standard input
- output standard output

## Problem Statement

Consider a classic analog clock with marks 1 through 12. You place one string that connects mark a to mark b and another string that connects mark c to mark d. All marks are distinct.

The strings are drawn as straight segments inside the circle. Determine whether the strings intersect strictly inside the clock (that is, they are not only touching at endpoints).

## Input

The first line contains an integer t (1 \le t \le 10^4).

Each test case contains four integers a, b, c, d (1 \le a, b, c, d \le 12). All four numbers are pairwise distinct.

## Output

For each test case output `YES` if the strings intersect strictly inside the clock, and `NO` otherwise.

## Sample Tests

### Sample 1

**Input**

```text
4
3 9 1 7
1 4 2 5
10 1 5 7
2 6 4 12
```

**Output**

```text
YES
NO
YES
NO
```

## Note

For the first case the segments cross between the marks. In the second case the segments share a vertex but do not intersect strictly inside the circle.

## Tutorial

Place the twelve marks on a circle and map the numbers to their cyclic order. Two chords intersect strictly inside the circle if and only if one endpoint of the second chord lies between the endpoints of the first chord in the circular order and the other endpoint lies outside that interval.

Thus, for chord (a, b) sort the endpoints along the circle and check whether c and d fall on different sides of that arc. Repeat the same check when swapping the roles of the chords.
