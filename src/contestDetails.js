const cheerio = require('cheerio');
const fs = require('fs/promises');
const boilerPlate = require('./boilerplate.js');
const getProblemDetails = require('./problemDetails.js');
const chalk = require('chalk');

async function contestDetails(contestId) {
    let result = await fetch("https://codeforces.com/contest/"+contestId)
        .then((res) => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.text();
        });
    //console.log(result);
    const $ = cheerio.load(result);
    const problemList =[];
    const set = new Set();
    const contestName = $('.rtable .left').first().text().trim();
    console.log(chalk.yellow(contestName));
    await fs.mkdir('./'+contestName, { recursive: true });
    $('select[name="submittedProblemIndex"] option').each((index, element) => {
        const value = $(element).attr('value');
        const name = $(element).text().trim();
        if (value && !set.has(value) && value.length <= 2) {
            set.add(value);
            problemList.push({ value, name });
        }
    });

    for (let i = 0; i < problemList.length; i++) {
        const problem = await getProblemDetails(contestId, problemList[i].value);
        const directoryPath = './' + contestName + '/' + problemList[i].value;

        await fs.mkdir(directoryPath, { recursive: true });


        let problemStatement ="Problem Statement :-\n\n" + problem.problemStatement + "\n\n\n" + "Input Specification :-\n\n" + problem.inputSpecification + "\n\n\n" + "Output Specification :-\n\n" + problem.outputSpecification + "\n\n\n" + "Input Example :-\n\n" + problem.inputExample + "\n\n\n" + "Output Specification :-\n\n" + problem.outputExample.join('\n');


        await fs.writeFile(directoryPath + '/problemStatement.txt', problemStatement);

        await fs.writeFile(directoryPath + '/inputf.in', problem.inputExample);

        await fs.writeFile(directoryPath + '/outputf.out', problem.outputExample.join('\n'));

        await fs.writeFile(directoryPath + '/solution.cpp', boilerPlate);

        const msg = `Created directory and files for PROBLEM ${problemList[i].value}`;
        console.log(chalk.grey(msg));
    }
    console.clear();
    const msg = `Successfully Fetched Problem Details \n Successfully Created the Folder Structure for ${contestName}`;
    console.log(chalk.green(msg));
}
module.exports = contestDetails;