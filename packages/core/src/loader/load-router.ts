import * as path from 'path';
import { flatten } from 'lodash';
import Loader from './loader';
import Application from '../application';
import router from '../router';
import * as Exceptions from 'exception.js';
import * as Debug from 'debug';

const debug = Debug('preon:loader:router');

export default function loadRouter(loader: Loader, app: Application) {
    const basePaths = loader.paths;

    const files = flatten(
        basePaths.map((baseDir) => {
            const currentFiles = loader.lookupFiles('router', { baseDir });

            const indexPath = path.resolve(baseDir, 'router/index.js');

            // if router/index.ts exist, only return it
            if (currentFiles.includes(indexPath)) {
                return [indexPath];
            }
            return currentFiles;
        }),
    );

    files.forEach((filePath) => {
        const content = loader.loadFile(filePath);

        debug(`load ${filePath}`);

        const r = content.default ? content.default : content;

        r?.routes && router.use(r.routes());
    });

    app.use(router.routes()).use(router.allowedMethods({
        throw: true,
        notImplemented: () => new Exceptions.NotImplemented(),
        methodNotAllowed: () => new Exceptions.MethodNotAllowed(),
    }));
}
