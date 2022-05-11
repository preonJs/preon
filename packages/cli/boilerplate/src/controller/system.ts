import { Middleware } from 'preon';

export const version: Middleware = async (ctx) => {
    ctx.version = require('../../package.json').version;
};
