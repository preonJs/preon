import { defaultsDeep } from 'lodash';
import { IApplicationOptions } from '../typings';
import getEnv from './get-env';

const DEFAULT_OPTIONS: Partial<IApplicationOptions> = {
    cwd: process.cwd(),
    env: getEnv('NODE_ENV', 'development'),
    port: 3000,
};

export default function mergeOptions(options: Partial<IApplicationOptions>): IApplicationOptions {
    const mergedOptions: IApplicationOptions = defaultsDeep(options, DEFAULT_OPTIONS);

    if (!('serverEnv' in mergedOptions)) {
        mergedOptions!.serverEnv = mergedOptions!.env;
    }

    return mergedOptions;
}
