import Application from './application';
import { Context } from './typings';

export default abstract class Service {
    readonly app: Application;

    get config() {
        return this.app.config;
    }

    constructor(readonly ctx: Context) {
        this.app = ctx.app;
        this.ctx = ctx;
    }
}
