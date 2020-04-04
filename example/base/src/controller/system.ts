import { Controller, Context } from 'preon';

export default class System extends Controller {
    async version(ctx: Context) {
        ctx.json = require('../../package.json');
    }
}
