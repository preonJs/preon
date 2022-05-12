import * as path from 'path';
import { uniq, defaultsDeep } from 'lodash';
import * as fs from 'fs';
import Runner from './runner';
import { checkFile, getFiles } from './util';
import * as colors from 'colors';

export interface IStartOptions {
    port: number,
    debug: string,
    watch: boolean,
    env: string,
    serverEnv: string
}

const CWD = process.cwd();

const BLACK_LIST = [
    /\.\w+rc.*$/,
    /\.(idea|git|vscode)/,
    /(logs|run|typings?|script|dist)/,
    /\.(md|js|d\.ts|map|log|lock|pid)$/,
    /test/,
    /\..*ignore$/,
    /tsconfig.*\.json$/,
    'tsconfig.json',
    'package.json',
    'lerna.json',
    'LICENSE',
    'package-lock.json',
    '.editorconfig',
    'Dockerfile'
];

const TSNODE = require.resolve('ts-node/dist/bin.js');

const ENTRY = path.resolve(CWD, 'src/index.ts');

export default async function start(options: Partial<IStartOptions>) {
    const { port = process.env.PORT || 3000, debug = process.env.DEBUG || '*', watch = true, env, serverEnv } = options;

    const runner = new Runner('node', [
        TSNODE,
        '--log-error',
        ENTRY,
    ], {
        stdio: 'inherit',
        detached: false,
        cwd: CWD,
        env: defaultsDeep({
            PORT: String(port),
            DEBUG: debug,
            NODE_ENV: env,
            SERVER_ENV: serverEnv,
        }, process.env),
    });

    runner.start();

    if (!watch) {
        runner.once('exit', (code) => {
            process.exit(code);
        });
        runner.once('kill', (code) => {
            process.exit(code);
        });

        return;
    }

    const list: string[] = uniq([
        ...(await getFiles(CWD)).filter((name: string) => {
            return checkFile(name, BLACK_LIST);
        }).map((name: string) => {
            return path.resolve(CWD, name);
        }),
    ]);

    list.forEach((file) => {
        fs.watch(file, {
            persistent: true,
            recursive: true,
            encoding: 'utf8',
        }, handler);

        console.warn(colors.yellow(`[WATCHING] ${file}`));
    });

    function handler(eventType: string, filename: string) {
        if (!checkFile(filename, BLACK_LIST)) {
            return;
        }
        console.warn(colors.yellow(`[FILE CHANGED] [${eventType}] ${filename}`));
        runner.restart();
    }
}
