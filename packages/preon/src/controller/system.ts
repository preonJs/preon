import { Controller, Context } from '@preon/core';

export default class System_ extends Controller {
    async test(ctx: Context) {
        ctx.raw = 'this is a test method';
    }

    async system(ctx: Context) {
        ctx.json = require('../../package.json');
    }

    async exception(ctx: Context) {
        throw new ctx.Errors.ServiceUnavailable();
    }
}
