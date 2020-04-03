import { Context, Middleware } from 'koa';
import * as Debug from 'debug';

const debug = Debug('app:request');

const accessLogMiddleware: Middleware = async function accessLog(ctx: Context, next) {
    debug(`[${ctx.method}] ${ctx.requestId} ${ctx.traceId} ${ctx.originalUrl} ${JSON.stringify(ctx.data)} ${JSON.stringify(ctx.request.headers)}`);

    return next();
};

export default accessLogMiddleware;
