import program from 'commander';

const gendiff = () => {
  program
    .version('0.0.1')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format')
    .arguments('<firstConfig> <secondConfig> []')
    .action(() => {});

  program.parse(process.argv);

  if (!program.args.length) program.help();
};

export default gendiff;
