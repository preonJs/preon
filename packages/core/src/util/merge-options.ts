import { defaultsDeep } from 'lodash';
import { ApplicationOptions } from '../typings';
import getEnv from './get-env';

const DEFAULT_OPTIONS: Partial<ApplicationOptions> = {
    cwd: process.cwd(),
    env: getEnv('NODE_ENV', 'development'),
    serverEnv: getEnv('SERVER_ENV'),
    port: Number(getEnv('PORT', '3000')),
};

export default function mergeOptions(options: Partial<ApplicationOptions>): ApplicationOptions {
    const mergedOptions: ApplicationOptions = defaultsDeep(options, DEFAULT_OPTIONS);

    if (mergedOptions.serverEnv) {
        mergedOptions.serverEnv = mergedOptions.env;
    }

    return mergedOptions;
}
