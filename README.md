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

The repository ships with a minimal offline fixture under `fixtures/beta_round_1`. It contains HTML snapshots of **Codeforces Beta Round #1** problem A and its official tutorial. Running the scraper on that fixture produces the Markdown file stored at `output/1-Codeforces Beta Round #1/A-theatre-square.md`.

To reproduce the example:

```bash
node script.js 1 --offline-dir fixtures/beta_round_1 --output output --verbose
```

The command above was executed to generate the committed sample Markdown file.

## Project structure

```
output/
└── <contest id>-<contest name>/
    └── <problem index>-<problem-name>.md
```

Each Markdown document includes the tutorial text at the end. If a problem does not provide a tutorial link, the scraper adds a placeholder message so the absence is explicit.

