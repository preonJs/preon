import * as path from 'path';
import { flatten } from 'lodash';
import Loader from './loader';
import Application from '../application';
import router from '../router';

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

        const r = content.default ? content.default : content;

        r && router.use(r.routes());
    });

    app.use(router.middleware()).use(router.allowedMethods());
}
