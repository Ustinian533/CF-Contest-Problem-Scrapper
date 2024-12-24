# CF-Contest-Problem-Scrapper

CF-Contest-Problem-Scrapper is a JavaScript-based tool designed to scrape contest problems from Codeforces. This tool helps users to collect and organize problems from various contests for easy access and analysis.

## Features

- Scrape contest problems from Codeforces.
- Organize and save problem data in a structured format.

## Usage

To use the CF-Contest-Problem-Scrapper, run the following command:

```sh
npm cf-contest id <contestId>
```

# Folder Structure for Contest

Below is the folder structure for organizing contest problems and their respective files.

```
contest-name/
│
├── A/
│   ├── input.in
│   ├── output.out
│   ├── expected.out
│   ├── problemstatement.txt
│   └── solution.cpp
│
├── B/
│   ├── input.in
│   ├── output.out
│   ├── expected.out
│   ├── problemstatement.txt
│   └── solution.cpp
│
├── C/
│   ├── input.in
│   ├── output.out
│   ├── expected.out
│   ├── problemstatement.txt
│   └── solution.cpp
│
└── ...
```

## Explanation
1. **`contest-name/`**  
   The root folder representing the name of the contest.  

2. **`A/`, `B/`, `C/`**  
   Subdirectories named after individual contest problems.  

3. **Files in Each Problem Directory**  
   - **`input.in`**: The input file for the problem.  
   - **`output.out`**: The generated output after running the solution.  
   - **`expected.out`**: The expected correct output for comparison.  
   - **`problemstatement.txt`**: The text file containing the problem statement.  
   - **`solution.cpp`**: The solution code written in C++.  

Add additional problem folders as needed using the same structure (`D/`, `E/`, etc.).  
