import * as path from 'path';
import * as fs from 'fs';
import { copyIfNotExist, writeIfNotExist, run } from './util';
import { writeFileSync } from 'fs';

const CWD = process.cwd();

const BOILERPLATE_ROOT = path.resolve(__dirname, '../boilerplate');

export interface IInitOptions {
    npmClient?: 'npm' | 'yarn' | 'tnpm' | string
    extends?: string
}

const baseTsConfig = {
    'compileOnSave': true,
    'compilerOptions': {
        'allowJs': false,
        'alwaysStrict': true,
        'charset': 'utf8',
        'declaration': true,
        'experimentalDecorators': true,
        'forceConsistentCasingInFileNames': true,
        'importHelpers': false,
        'lib': [
            'esnext',
        ],
        'module': 'commonjs',
        'moduleResolution': 'node',
        'newLine': 'lf',
        'noFallthroughCasesInSwitch': true,
        'noImplicitAny': true,
        'noImplicitReturns': true,
        'noImplicitUseStrict': false,
        'noUnusedLocals': true,
        'noUnusedParameters': true,
        'preserveConstEnums': true,
        'pretty': true,
        'removeComments': false,
        'resolveJsonModule': true,
        'sourceMap': true,
        'skipLibCheck': true,
        'strictNullChecks': true,
        'target': 'es2019',
        'typeRoots': [
            'node_modules/@types',
        ],
    },
};

const extendTsConfig = {
    compileOnSave: true,
    compilerOptions: {
        sourceRoot: './src',
        baseUrl: './src',
        outDir: './dist',
    },
    include: [
        'src',
    ],
};

export default async function init(options: IInitOptions = {}) {
    const { npmClient = 'npm', extends: extendPath } = options;

    const packageJsonPath = path.resolve(CWD, 'package.json');

    if (!fs.existsSync(packageJsonPath) || !fs.statSync(packageJsonPath).isFile()) {
        console.error('Cannot find package.json, please init with `npm init` first');
        process.exit(-1);
    }

    const packageJson = require(packageJsonPath);

    run(`mkdir -p ${path.resolve(CWD, 'src/router')}`);
    run(`mkdir -p ${path.resolve(CWD, 'src/controller')}`);
    run(`mkdir -p ${path.resolve(CWD, 'src/service')}`);
    run(`mkdir -p ${path.resolve(CWD, 'src/middleware')}`);
    run(`mkdir -p ${path.resolve(CWD, 'src/plugin')}`);
    run(`mkdir -p ${path.resolve(CWD, 'src/config')}`);
    run(`mkdir -p ${path.resolve(CWD, 'typings')}`);

    copyIfNotExist(path.resolve(BOILERPLATE_ROOT, 'src/index.ts'), path.resolve(CWD, 'src/index.ts'));
    copyIfNotExist(path.resolve(BOILERPLATE_ROOT, 'src/application.ts'), path.resolve(CWD, 'src/application.ts'));
    copyIfNotExist(path.resolve(BOILERPLATE_ROOT, 'src/router/system.ts'), path.resolve(CWD, 'src/router/system.ts'));
    copyIfNotExist(path.resolve(BOILERPLATE_ROOT, 'src/controller/system.ts'), path.resolve(CWD, 'src/controller/system.ts'));

    if (!extendPath) {
        copyIfNotExist(path.resolve(BOILERPLATE_ROOT, 'editorconfig'), path.resolve(CWD, '.editorconfig'));
        copyIfNotExist(path.resolve(BOILERPLATE_ROOT, 'gitignore'), path.resolve(CWD, '.gitignore'));
    }

    const configStr = `export default ${JSON.stringify({ app: { name: packageJson.name } }, ' ' as any, 4)}`;

    const prodConfigStr = `export default ${JSON.stringify({}, ' ' as any, 4)}`;

    writeIfNotExist(path.resolve(CWD, 'src/config/config.base.ts'), configStr);
    writeIfNotExist(path.resolve(CWD, 'src/config/config.development.ts'), prodConfigStr);
    writeIfNotExist(path.resolve(CWD, 'src/config/config.production.ts'), prodConfigStr);

    packageJson.scripts = packageJson.scripts || {};

    if (!packageJson.scripts.start) {
        packageJson.scripts.start = 'preon start';
    }
    if (!packageJson.scripts.build) {
        packageJson.scripts.build = 'tsc';
    }
    if (!packageJson.scripts['test:type']) {
        packageJson.scripts['test:type'] = 'tsc --noEmit';
    }
    if (!packageJson.scripts.test) {
        packageJson.scripts.test = 'npm run test:type';
    }

    writeFileSync(packageJsonPath, JSON.stringify(packageJson, ' ' as any, 2));

    const tsConfig = extendPath ? {
        extends: extendPath,
        ...extendTsConfig,
    } : {
        ...baseTsConfig,
        compilerOptions: {
            ...baseTsConfig.compilerOptions,
            ...extendTsConfig.compilerOptions,
        },
    };

    writeIfNotExist(path.resolve(CWD, 'tsconfig.json'), JSON.stringify(tsConfig, ' ' as any, 2));

    const installCmd = npmClient === 'yarn' ? 'add' : 'install';

    run(`${npmClient} ${installCmd} preon --save`);
    run(`${npmClient} ${installCmd} @preon/cli typescript@3.8.3 ${extendPath ? '' : '@types/node'} ${npmClient === 'yarn' ?
        '--dev' :
        '--save-dev'}`);
}
