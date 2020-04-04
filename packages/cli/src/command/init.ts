import * as yargs from 'yargs';
import { YArgsOptionsGroup } from '../cli';
import init from '../init';

exports.command = 'init [options]';

exports.description = 'init preon to an exist npm directory';

exports.options = {
    'npm-client': {
        description: 'npm client',
        type: 'string',
        default: 'npm',
    },
    'extends': {
        description: 'tsconfig extends',
        type: 'string',
    },
} as YArgsOptionsGroup;

exports.builder = (yargs: yargs.Argv) => {
    return yargs;
};

exports.handler = (args: yargs.Arguments) => {
    init({
        ...args,
        npmClient: args['npm-client'] as string,
    });
};
