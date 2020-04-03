import { flatten, defaultsDeep } from 'lodash';
import Application from '../application';
import Loader from './loader';

const CONFIG_ENV_REGEX = /\/config\.(.+)\.(ts|js)$/i;

export default function loadConfig(loader: Loader, app: Application) {
    const { env, serverEnv } = app;

    const configEnvCache = new Map<string, string>();

    const files = loader.lookupFiles('config');

    const availableEnvNames = [serverEnv, env, 'common', 'base'];

    const groups: { [key: string]: string[] } = {};

    files.forEach((path) => {
        const match = CONFIG_ENV_REGEX.exec(path);

        if (!match) {
            return;
        }
        const envName = match[1];

        if (!availableEnvNames.includes(envName)) {
            return;
        }
        configEnvCache.set(path, envName);
        groups[envName] = groups[envName] || [];
        groups[envName].push(path);
    });

    const configFiles = flatten(Object.keys(groups).sort((a, b) => availableEnvNames.indexOf(a) - availableEnvNames.indexOf(b)).map((envName) => {
        return groups[envName];
    }));

    const contents: object[] = configFiles.map((path) => {
        const content = loader.loadFile(path);

        /**
         * export const xxx = {}
         * export default {}
         * module.exports = {}
         * export default () {}
         */
        const contentModule = content.default ? content.default : content;

        if (typeof contentModule === 'function') {
            return contentModule(app);
        }
        return contentModule;
    });

    return defaultsDeep({}, ...contents);
}
