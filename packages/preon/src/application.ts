import PreonCore, { IApplicationOptions } from '@preon/core';
import System from './controller/system';

export interface Application extends Preon {
    controller: { System_: System };
}

export default class Preon extends PreonCore {
    constructor(options?: Partial<IApplicationOptions>) {
        super(options);
    }

    get path() {
        return __dirname;
    }
}
