import { defaultsDeep } from 'lodash';
import { IApplicationOptions } from '../typing';
import getEnv from './get-env';

const DEFAULT_OPTIONS: Partial<IApplicationOptions> = {
    cwd: process.cwd(),
    env: getEnv('NODE_ENV', 'development'),
    serverEnv: getEnv('SERVER_ENV'),
    port: Number(getEnv('PORT', '3000')),
};

export default function mergeOptions(options: Partial<IApplicationOptions>): IApplicationOptions {
    const mergedOptions: IApplicationOptions = defaultsDeep(options, DEFAULT_OPTIONS);

    if (mergedOptions.serverEnv) {
        mergedOptions.serverEnv = mergedOptions.env;
    }

    return mergedOptions;
}
