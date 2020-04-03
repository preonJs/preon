import PreonCore, { IApplicationOptions, IConfig as ICoreConfig } from '@preon/core';
import System from './controller/system';

export interface IConfig extends ICoreConfig {

}

export default class Preon extends PreonCore {
    public config: IConfig;

    controller: { System: System };

    constructor(options?: Partial<IApplicationOptions>) {
        super(options);
    }

    get path() {
        return __dirname;
    }
}
