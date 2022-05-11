import { Middleware } from 'preon';

const p = require('../../package.json');

export const version: Middleware = async (ctx) => {
    ctx.body = `${p.name} v${p.version}`;
};
