import * as path from 'path';
import { flatten } from 'lodash';
import Loader from './loader';
import Application from '../application';
import * as Router from '@koa/router';

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

    const router = new Router();

    files.forEach((filePath) => {
        const content = loader.loadFile(filePath);

        const contentModule = content.default ? content.default : content;

        const prefix = content.prefix || contentModule.prefix;

        const currentRouter = prefix ? new Router({ prefix }) : router;

        const routerMiddleware: typeof currentRouter = contentModule(currentRouter, app) || currentRouter;

        if (prefix) {
            app.use(routerMiddleware.middleware()).use(routerMiddleware.allowedMethods());
        }
    });

    app.use(router.middleware()).use(router.allowedMethods());
}
