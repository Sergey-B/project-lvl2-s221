#! /usr/bin/env node

import fs from 'fs';
import program from 'commander';
import { version } from '../../package.json';
import gendiff from '..';

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const firstConfigObject = JSON.parse(fs.readFileSync(firstConfig));
    const secondConfigObject = JSON.parse(fs.readFileSync(secondConfig));

    console.log(gendiff(firstConfigObject, secondConfigObject));
  });

program.parse(process.argv);

if (!program.args.length) program.help();
