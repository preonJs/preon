import * as yargs from 'yargs';
import * as glob from 'glob';
import { join } from 'path';

export type YArgsOptionsGroup<T extends string = string> = {
    [key in T]: yargs.Options
}

const packageJson = require('../package.json');

const commandDir = join(__dirname, 'command');

const commands = glob.sync('*.js', {
    cwd: commandDir,
}).map(f => f.replace(/\.js$/, ''));


yargs.usage(`${packageJson.name} ${packageJson.version}
Usage: preon [command] [options]`);

yargs.version(packageJson.version)
    .alias('v', 'version')
    .alias('h', 'help')
    .demandCommand(1, 'Specify --help for available options')
    .completion()
    .help();

// todo: add i18n eg: intl.text('NOT_FOUND', command)  => `command ${command} not found`
// if (yargs.locale() === 'en_US' && process.env.LC_CTYPE) {
//     const lang = process.env.LC_CTYPE.split('.')[0];
//     lang && yargs.locale(lang);
// }

commands.forEach((command: string) => {
    const commandModule = require(join(commandDir, command));
    if (!commandModule) {
        return;
    }

    yargs.command(commandModule);
});

const argv = yargs.argv;

if ('_' in argv && argv._) {
    const cmd = String(argv._[0]);
    if (!commands.includes(cmd)) {
        yargs.showHelp();
    }
}
