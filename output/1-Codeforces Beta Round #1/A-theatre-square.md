# A. Theatre Square

- Contest: Codeforces Beta Round #1 (1)
- Time limit per test 1 second
- Memory limit per test 256 megabytes
- Input standard input
- Output standard output

## Problem Statement

Theatre Square in the capital city of Berland has a rectangular shape of n × m meters. Some corporation has bought an arena in this square and is planning to pave the Square with square granite flagstones. Each flagstone is a square of a × a meters.

What is the least number of flagstones needed to pave the Square? It is allowed to cover the surface larger than the Theater Square, but the Square has to be fully covered. It is not allowed to break the flagstones. The sides of flagstones should be parallel to the sides of the Square.

## Input

The only line of the input contains three positive integer numbers n, m and a (1 ≤ n, m, a ≤ 10^9).

## Output

Write the needed number of flagstones.

## Sample Tests

### Sample 1

**Input**

```text
6 6 4
```

**Output**

```text
4
```

## Note

In the sample, the Theatre Square can be covered by four flagstones sized 4 × 4.

## Tutorial

The task asks for the minimum number of square tiles of side *a* required to cover an *n* by *m* rectangle.

The answer is the product of the horizontal and vertical counts. Each count equals the ceiling of the dimension divided by *a*: `ceil(n / a) * ceil(m / a)`.

Use integer arithmetic: `((n + a - 1) / a) * ((m + a - 1) / a)` with 64-bit integers.
