import { Middleware } from '@preon/core';
import * as Errors from 'exception.js';

export const test: Middleware = async (ctx) => {
    ctx.body = 'Hello World';
};

export const system: Middleware = async (ctx) => {
    ctx.body = require('../../package.json');
};

export const exception: Middleware = async () => {
    throw new Errors.ServiceUnavailable();
};
