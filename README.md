# Codeforces Contest Markdown Scraper

This project downloads Codeforces contest problems together with their linked tutorials and stores every pair as a Markdown document. Each generated file contains:

- Contest metadata (name, limits and IO format)
- A cleaned version of the problem statement
- Input and output specifications
- All sample tests with fenced code blocks
- The official tutorial (when a link is published on the problem page)

The tool works with the public Codeforces website, but it can also operate in an offline mode that consumes pre-downloaded HTML snapshots. The repository contains an example snapshot and its generated Markdown output so you can see a successful run without external network access.

## Installation

The CLI runs with Node.js (>= 18). Install the dependencies once:

```bash
npm install
```

## Usage

Download every problem from a contest and write Markdown files into the `output` directory:

```bash
node script.js 1971
```

Key options:

- `-o, --output <dir>` – change the target directory (default: `output`).
- `-b, --base-url <url>` – use a different Codeforces mirror.
- `--offline-dir <dir>` – read HTML from a local folder instead of making HTTP requests.
- `-v, --verbose` – print progress information for every problem.

The command exits with a non-zero status code if the contest cannot be downloaded or a problem is missing its statement.

## Offline fixtures and example output

The repository ships with two offline fixtures that can be executed without external network access:

- `fixtures/beta_round_1` contains HTML snapshots of **Codeforces Beta Round #1** problem A together with its tutorial. Running the scraper on that fixture produces the Markdown file stored at `output/1-Codeforces Beta Round #1/A-theatre-square.md`.
- `fixtures/round_1971` contains offline copies of the first three problems and tutorials from **Codeforces Round 939 (Div. 2)** (contest 1971). The generated Markdown lives under `output/1971-Codeforces Round 939 (Div. 2)- Contest 1971/`.

To reproduce the examples:

```bash
# Codeforces Beta Round #1 fixture
node script.js 1 --offline-dir fixtures/beta_round_1 --output output --verbose

# Codeforces Round 939 (Div. 2) fixture for contest 1971
node script.js 1971 --offline-dir fixtures/round_1971 --output output --verbose
```

The commands above were executed to generate the committed sample Markdown files for both contests.


## Project structure

```
output/
└── <contest id>-<contest name>/
    └── <problem index>-<problem-name>.md
```

Each Markdown document includes the tutorial text at the end. If a problem does not provide a tutorial link, the scraper adds a placeholder message so the absence is explicit.

