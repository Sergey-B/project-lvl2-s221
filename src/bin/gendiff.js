#! /usr/bin/env node

import program from 'commander';
import { version } from '../../package.json';
import gendiff from '..';

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    console.log(gendiff(firstConfig, secondConfig));
  });

program.parse(process.argv);

if (!program.args.length) program.help();
