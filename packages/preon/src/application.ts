import PreonCore, { ApplicationOptions } from '@preon/core';

export interface Application extends Preon {

}

export default class Preon extends PreonCore {
    constructor(options?: Partial<ApplicationOptions>) {
        super(options);
    }

    get path() {
        return __dirname;
    }
}
