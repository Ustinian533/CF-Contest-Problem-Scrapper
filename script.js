#!/usr/bin/env node

const { Command } = require('commander');
const contestDetails = require('./src/contestDetails.js');
const chalk = require('chalk');
const program = new Command();

program
    .command('id <id>')
    .description('CodeForces Contest ID')
    .alias('ID')
    .alias('Id')
    .alias('iD')
    .action((contestId) => {
        const id = parseInt(contestId);
        if (!isNaN(id)) {
            contestDetails(id);
        } else {
            const e = "Error : " + contestId +" is Not a Valid Contest ID";
            console.log(chalk.red(e));
        }
    });
program.parse(process.argv);