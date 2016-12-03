import * as program from 'commander';

program
   .version('0.0.1')
   .option('-d, --dev', 'Dev mode ')
   .parse(process.argv);


export const devMode = program['dev'];