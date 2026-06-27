const { Command } = require('commander');
const fs = require('fs');
const { open } = require('node:fs/promises');
const program = new Command();
let path;

program
    .name('word reader')
    .description('read lines from the file')
    .version('0.0.0');

program.command('count')
    .description('reads number of lines from the file')
    .argument('<string>', 'read number of lines in this file location')
    .action((str, options) => {
        path = str
    })

program.parse();

(
    async () => {
        const file = await open(path);

        let count = 0;

        for await (const line of file.readLines()) {
            count++;
        }

        console.log(count);

        await file.close();
    }

)();