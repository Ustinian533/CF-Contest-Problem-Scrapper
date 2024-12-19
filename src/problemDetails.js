const cheerio = require('cheerio');
const fs = require('fs/promises');

async function getProblemDetails(contestId, problem) {
    let result = await fetch("https://codeforces.com/contest/"+contestId+"/problem/" + problem)
        .then((res) => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.text();
        });

    const $ = cheerio.load(result);

    const problemStatement = $('.problem-statement > div > p').not('.input-specification p, .output-specification p, .sample-tests p, .note p').text().trim();
    const inputSpecification = $('.input-specification p')
        .map((i, el) => $(el).text().trim())
        .get()
        .join(' ');

    const outputSpecification = $('.output-specification p')
        .map((i, el) => $(el).text().trim())
        .get()
        .join(' ');

    const inputExample = $('.sample-tests .input pre div')
        .map((_, el) => $(el).text().trim())
        .get()
        .join('\n');

    const outputExample = $('.sample-tests .output pre')
        .text()
        .split('\n')
        .map(line => line.trim())
        .filter(line => line);

    return {
        problemStatement,
        inputSpecification,
        outputSpecification,
        inputExample,
        outputExample
    };
}

module.exports = getProblemDetails;