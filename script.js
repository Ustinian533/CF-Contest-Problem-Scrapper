#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const contestDetails = require('./src/contestDetails');

async function main() {
    const program = new Command();

    program
        .name('cf-contest')
        .description('Download Codeforces contest problems and tutorials as Markdown files')
        .argument('<contestId>', 'Contest identifier, e.g. 1971')
        .option('-o, --output <directory>', 'Directory where the Markdown files will be stored', 'output')
        .option('-b, --base-url <url>', 'Base URL of Codeforces instance', 'https://codeforces.com')
        .option('--offline-dir <directory>', 'Use pre-downloaded HTML files from the provided directory instead of making network requests')
        .option('-v, --verbose', 'Enable verbose logging')
        .action(async (contestId, options) => {
            try {
                const { contestName, contestFolder, summary } = await contestDetails(contestId, {
                    baseUrl: options.baseUrl,
                    offlineDir: options.offlineDir,
                    outputDir: options.output,
                    verbose: options.verbose,
                });

                console.log(chalk.green(`\nSaved ${summary.length} problem(s) for ${contestName}`));
                console.log(chalk.green(`Output directory: ${contestFolder}`));
            } catch (error) {
                console.error(chalk.red(error.message));
                process.exitCode = 1;
            }
        });

    await program.parseAsync(process.argv);
}

main();

