const cheerio = require('cheerio');
const fs = require('fs/promises');

const date = new Date();
const contestId = "2047";
const boilerPlate =`/**
 *    author:  manish-dev
 *    created: ${date}
**/
#include <bits/stdc++.h>
using namespace std;
#define int long long
#define endl "\\n"
#define yes cout << "YES\\n";
#define no cout << "NO\\n";
#define all(x) x.begin(),x.end()
#define pb push_back
#define FOR(i,a,b) for (int i = (a); i < (b); ++i)
#define F0R(i,a) FOR(i,0,a)
#define ROF(i,a,b) for (int i = (b)-1; i >= (a); --i)
#define R0F(i,a) ROF(i,0,a)
#define rep(a) F0R(_,a)
#define each(a,x) for (auto& a: x)
#define vec vector
#define dbg(x) cout << #x << " is " << x << endl;
long long MOD = 1e9 + 7;

void solve(){
}

signed main() {
    ios_base::sync_with_stdio(false); 
    cin.tie(NULL);
    int tst = 1;
    cin >> tst;
    while (tst--) {
        solve();
    }
    return 0;
}`;

async function getProblemDetails(problem) {
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

async function script() {
    let result = await fetch("https://codeforces.com/contest/"+contestId)
        .then((res) => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.text();
        });
    //console.log(result);
    const $ = cheerio.load(result);
    const problemList = [];
    const set = new Set();
    const contestName = $('.rtable .left').first().text().trim();
    console.log(contestName);
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
        const problem = await getProblemDetails(problemList[i].value);
        const directoryPath = './' + contestName + '/' + problemList[i].value;

        await fs.mkdir(directoryPath, { recursive: true });


        let problemStatement ="Problem Statement :-\n\n" + problem.problemStatement + "\n\n\n" + "Input Specification :-\n\n" + problem.inputSpecification + "\n\n\n" + "Output Specification :-\n\n" + problem.outputSpecification + "\n\n\n" + "Input Example :-\n\n" + problem.inputExample + "\n\n\n" + "Output Specification :-\n\n" + problem.outputExample.join('\n');


        await fs.writeFile(directoryPath + '/problemStatement.txt', problemStatement);

        await fs.writeFile(directoryPath + '/inputf.in', problem.inputExample);

        await fs.writeFile(directoryPath + '/outputf.out', problem.outputExample.join('\n'));

        await fs.writeFile(directoryPath + '/solution.cpp', boilerPlate);

        console.log(`Created directory and files for ${problemList[i].value}`);
    }
}

script();
