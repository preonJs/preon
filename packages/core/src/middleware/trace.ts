import { Context, Middleware } from 'koa';
import generateRequestId from '../util/generate-request-id';

const traceMiddleware: Middleware = async function trace(ctx: Context, next) {
    const requestId = ctx.get('X-Request-Id') || generateRequestId(ctx);
    const traceId = ctx.get('X-Trace-Id') || '0';

    ctx.requestId = requestId;
    ctx.traceId = traceId;

    await next();

    ctx.set('X-Request-Id', requestId);
    ctx.set('X-Trace-Id', traceId);
};

export default traceMiddleware;
