import * as path from 'path';
import * as assert from 'assert';
import * as fs from 'fs';
import { uniq } from 'lodash';
import * as globby from 'globby';
import { IApplicationOptions } from '../typing';
import Application, { CORE_DIR } from '../application';

export interface IBaseLoaderOptions extends IApplicationOptions {
}

interface ILookupOptions {
    patterns?: string | string[]
    baseDir?: string | string[]
}

export default class Loader {
    private readonly options: IBaseLoaderOptions;

    public readonly paths: string[];

    private readonly app: Application;

    constructor(options: IBaseLoaderOptions, app: Application) {
        this.options = options;

        this.app = app;

        this.paths = this.lookPath();
    }

    // find framework paths
    private lookPath() {
        const paths: string[] = [
            path.resolve(this.options.cwd, this.app.env === 'development' ? 'src' : 'dist'),
            path.resolve(this.options.cwd),
        ];

        let proto = this.app;

        while (proto) {
            proto = Object.getPrototypeOf(proto);

            if (proto === Object.prototype || proto === Application.prototype) {
                break;
            }

            if (proto.path) {
                const realPath = path.resolve(proto.path);

                assert(fs.existsSync(realPath), `path ${realPath} not exist`);
                assert(fs.statSync(realPath).isDirectory(), `path ${realPath} should be directory`);

                paths.push(realPath);
            }
        }

        paths.push(CORE_DIR);

        return uniq(paths);
    }

    // get all files in the directory
    public lookupFiles(dir: string = '', {
        patterns = [
            '*.ts',
            '!*.d.ts',
            '*.js',
        ],
        baseDir = this.paths,
    }: ILookupOptions = {}) {
        const files: string[] = [];

        patterns = Array.isArray(patterns) ? patterns : patterns;

        const baseDirs = Array.isArray(baseDir) ? baseDir : [baseDir];

        for (const basePath of baseDirs) {
            const realPath = path.resolve(basePath, dir);

            const res = globby.sync(patterns, {
                cwd: realPath,
                absolute: true,
            });

            files.push(...res);
        }

        return uniq(files);
    }

    public loadFile(path: string): any {
        return require(path);
    }
}
