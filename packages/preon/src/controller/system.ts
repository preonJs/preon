import { Controller, Context } from '@preon/core';
import * as Errors from 'exception.js';

export default class System_ extends Controller {
    async test(ctx: Context) {
        ctx.raw = 'this is a test method';
    }

    async system(ctx: Context) {
        ctx.json = require('../../package.json');
    }

    async exception() {
        throw new Errors.ServiceUnavailable();
    }
}
