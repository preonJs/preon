import Loader from './loader';
import Application from '../application';
import { flatten } from 'lodash';
import * as path from 'path';
import { Controllers } from '../typing';

export default function loadController(loader: Loader, app: Application): Controllers {
    const basePaths = loader.paths;

    const files = flatten(
        basePaths.map((baseDir) => {
            const currentFiles = loader.lookupFiles('controller', { baseDir });

            const indexPathJS = path.resolve(baseDir, 'controller/index.js');
            const indexPathTS = path.resolve(baseDir, 'controller/index.ts');

            // if controller/index.ts exist, only return it
            if (currentFiles.includes(indexPathTS)) {
                return [indexPathTS];
            }
            if (currentFiles.includes(indexPathJS)) {
                return [indexPathJS];
            }
            return currentFiles;
        }),
    );

    let controllers: Controllers = {};

    const loadController = (baseName: string, ControllerClass: any) => {
        if (ControllerClass.constructor) {
            const name = ControllerClass.name || baseName;
            controllers[name] = new ControllerClass(app);
            return;
        }

        controllers[baseName] = ControllerClass;
    };

    files.forEach((filePath) => {
        const content = loader.loadFile(filePath);

        const baseName = path.basename(filePath, path.extname(filePath));

        const contentModule = content.default ? content.default : content;

        loadController(baseName, contentModule);
    });

    return controllers;
}
