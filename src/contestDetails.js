const cheerio = require('cheerio');
const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk');
const getProblemDetails = require('./problemDetails');

function sanitizePathSegment(name) {
    return name.replace(/[\\/:*?"<>|]/g, '-').trim();
}

function createFetcher({ baseUrl, offlineDir }) {
    return async function fetchPage(resourcePath, meta = {}) {
        if (offlineDir) {
            const localFile = resolveOfflinePath(offlineDir, resourcePath, meta);
            return fs.readFile(localFile, 'utf8');
        }

        const url = resourcePath.startsWith('http') ? resourcePath : `${baseUrl.replace(/\/$/, '')}${resourcePath}`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'cf-contest-problem-scraper/1.0',
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        }
        return response.text();
    };
}

function resolveOfflinePath(rootDir, resourcePath, meta) {
    if (meta.kind === 'contest') {
        return path.join(rootDir, 'contest.html');
    }

    if (meta.kind === 'problem') {
        return path.join(rootDir, `problem_${meta.index}.html`);
    }

    if (meta.kind === 'tutorial') {
        return path.join(rootDir, `tutorial_${meta.index}.html`);
    }

    const normalized = resourcePath.replace(/[\\/:*?"<>|]/g, '_');
    return path.join(rootDir, normalized);
}

async function contestDetails(contestId, options) {
    const { baseUrl = 'https://codeforces.com', offlineDir, outputDir = 'output', verbose } = options || {};
    const fetchPage = createFetcher({ baseUrl, offlineDir });

    const contestHtml = await fetchPage(`/contest/${contestId}`, { kind: 'contest' });
    const $ = cheerio.load(contestHtml);
    const contestName = $('.rtable .left').first().text().trim().replace(/:\s*$/, '') || `Contest ${contestId}`;
    const problems = [];

    $('table.problems tr').each((_, row) => {
        const index = $(row).find('td').first().text().trim().split('\n')[0].trim();
        const name = $(row).find('td').eq(1).text().trim();
        if (index && name) {
            problems.push({ index, name });
        }
    });

    if (!problems.length) {
        throw new Error('No problems found on contest page.');
    }

    const contestFolder = path.join(outputDir, `${contestId}-${sanitizePathSegment(contestName)}`);
    await fs.mkdir(contestFolder, { recursive: true });

    const summary = [];

    for (const problem of problems) {
        const logPrefix = `${problem.index} ${problem.name}`;
        verbose && console.log(chalk.cyan(`Fetching ${logPrefix}`));
        const details = await getProblemDetails(fetchPage, contestId, problem.index);
        const fileName = `${problem.index}-${sanitizePathSegment(details.title).toLowerCase().replace(/\s+/g, '-')}.md`;
        const filePath = path.join(contestFolder, fileName);
        await fs.writeFile(filePath, renderMarkdown(contestName, contestId, problem, details));
        summary.push({
            index: problem.index,
            name: problem.name,
            file: filePath,
            hasTutorial: Boolean(details.tutorialMarkdown),
        });
        console.log(chalk.green(`Saved ${problem.index} -> ${path.relative(process.cwd(), filePath)}`));
    }

    return { contestName, contestFolder, summary };
}

function renderMarkdown(contestName, contestId, problem, details) {
    const lines = [];
    lines.push(`# ${problem.index}. ${details.title}`);
    lines.push('');
    lines.push(`- Contest: ${contestName} (${contestId})`);
    if (details.timeLimit) lines.push(`- ${details.timeLimit}`);
    if (details.memoryLimit) lines.push(`- ${details.memoryLimit}`);
    if (details.inputFile) lines.push(`- ${details.inputFile}`);
    if (details.outputFile) lines.push(`- ${details.outputFile}`);
    lines.push('');

    if (details.statementMarkdown) {
        lines.push('## Problem Statement');
        lines.push('');
        lines.push(details.statementMarkdown);
        lines.push('');
    }

    if (details.inputMarkdown) {
        lines.push('## Input');
        lines.push('');
        lines.push(details.inputMarkdown);
        lines.push('');
    }

    if (details.outputMarkdown) {
        lines.push('## Output');
        lines.push('');
        lines.push(details.outputMarkdown);
        lines.push('');
    }

    if (details.samples && details.samples.length) {
        lines.push('## Sample Tests');
        lines.push('');
        for (const sample of details.samples) {
            lines.push(`### Sample ${sample.index}`);
            lines.push('');
            lines.push('**Input**');
            lines.push('');
            lines.push('```text');
            lines.push(sample.input);
            lines.push('```');
            lines.push('');
            lines.push('**Output**');
            lines.push('');
            lines.push('```text');
            lines.push(sample.output);
            lines.push('```');
            lines.push('');
            if (sample.explanation) {
                lines.push('**Explanation**');
                lines.push('');
                lines.push(sample.explanation);
                lines.push('');
            }
        }
    }

    if (details.noteMarkdown) {
        lines.push('## Note');
        lines.push('');
        lines.push(details.noteMarkdown);
        lines.push('');
    }

    if (details.tutorialMarkdown) {
        lines.push('## Tutorial');
        lines.push('');
        lines.push(details.tutorialMarkdown);
        lines.push('');
    } else {
        lines.push('## Tutorial');
        lines.push('');
        lines.push('_Tutorial link was not found on the problem page._');
        lines.push('');
    }

    return lines.join('\n');
}

module.exports = contestDetails;

