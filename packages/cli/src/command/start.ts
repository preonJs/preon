import * as yargs from 'yargs';
import { YArgsOptionsGroup } from '../cli';
import start, { IStartOptions } from '../start';

exports.command = 'start [options]';

exports.description = 'start a dev server with watch';

exports.options = {
    port: {
        alias: 'p',
        description: 'listen port',
        type: 'number',
        default: 3000,
    },
    debug: {
        alias: 'd',
        description: 'enable debug mode',
        type: 'string',
        default: '*',
    },
    watch: {
        alias: 'w',
        description: 'enable watch mode',
        type: 'boolean',
        default: true,
    },
    env: {
        alias: 'e',
        description: 'specify env',
        type: 'string',
        default: process.env.NODE_ENV || 'development',
        defaultDescription: 'process.env.NODE_ENV || development',
    },
    serverEnv: {
        alias: 's',
        description: 'specify server env',
        type: 'string',
        default: process.env.SERVER_ENV,
        defaultDescription: 'process.env.SERVER_ENV',
    },
} as YArgsOptionsGroup<keyof IStartOptions>;

exports.builder = (yargs: yargs.Argv) => {
    return yargs.options(exports.options);
};

exports.handler = (args: yargs.Arguments<IStartOptions>) => {
    start(args);
};
