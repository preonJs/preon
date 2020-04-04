import PreonCore, { IApplicationOptions } from '@preon/core';
import System from './controller/system';

export default class Preon extends PreonCore {
    controller: { System: System };

    constructor(options?: Partial<IApplicationOptions>) {
        super(options);
    }

    get path() {
        return __dirname;
    }
}
