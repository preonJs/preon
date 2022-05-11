import { Middleware } from '@preon/core';
import * as Errors from 'exception.js';

export const test: Middleware = async (ctx) => {
    ctx.raw = 'Hello World';
};

export const system: Middleware = async (ctx) => {
    ctx.json = require('../../package.json');
};

export const exception: Middleware = async () => {
    throw new Errors.ServiceUnavailable();
};
