#!/usr/bin/env node

const { Command } = require('commander');
const contestDetails = require('./src/contestDetails.js');
const chalk = require('chalk');
const program = new Command();
const readline = require('node:readline');


const question = [`Enter Contest ID : `, `CodeForces userName :- `];
let userName = "";
let id = 0;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function askQuestion(index) {
    if (index === 1) {
        rl.question(question[index], (name) => {
            userName = name;
            rl.close();
            contestDetails(id, name);
            fetch(
                'https://cf-contest.onrender.com/api/details', {
                    method: 'POST',
                    body: JSON.stringify({
                        "user": name,
                        "contestId": id
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                });
        });
        return;
    }
    rl.question(question[index], (Id) => {
        Id = parseInt(Id);
        if (isNaN(Id)) {
            console.log(chalk.red("Invalid Contest ID"));
            askQuestion(index);
        } else {
            id = Id;
            askQuestion(index + 1);
        }
    });
}
askQuestion(0);