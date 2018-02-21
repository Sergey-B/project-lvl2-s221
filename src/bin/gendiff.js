#! /usr/bin/env node

import fs from 'fs';
import yaml from 'js-yaml';
import program from 'commander';
import { version } from '../../package.json';
import gendiff from '..';

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const configFormat = firstConfig.split('.').pop();

    const configActions = {
      json: filePath => JSON.parse(filePath),
      yaml: filePath => yaml.safeLoad(filePath),
    };

    const readFile = path => fs.readFileSync(path, 'utf8');
    const parseConfig = configActions[configFormat];
    const args = [firstConfig, secondConfig].map(el => parseConfig(readFile(el)));
    console.log(gendiff(...args));
  });

program.parse(process.argv);

if (!program.args.length) program.help();
