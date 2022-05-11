import * as Stream from 'stream';
import { Context } from '../typings';

export interface ExtendedContext {
    rawBody?: string | Buffer | Stream | ArrayBuffer;

    readonly isApiRequest: boolean;
}

const context: Context = {
    get isApiRequest() {
        if (this.path.includes('/api/')) {
            return true;
        }

        if (this.path.endsWith('.json')) {
            return true;
        }

        return !(this.accepts('html') && !this.accepts('*'));
    },
} as any;

export default context;
