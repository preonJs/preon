import { Middleware } from 'koa';
import * as Debug from 'debug';
import * as Stream from 'stream';

const debug = {
    response: Debug('app:response'),
    error: Debug('app:response:exception'),
};

const responseMiddleware: Middleware = async function response(ctx, next) {
    try {
        await next();

        const { body, status, raw } = ctx;

        if (!body && raw) {
            if (typeof raw === 'object' && !ctx.response.type && !(raw instanceof Buffer) && !(raw instanceof Stream)) {
                ctx.response.type = 'json';
                ctx.body = JSON.stringify(raw);
                return;
            }
            ctx.body = raw;

            debug.response(ctx.requestId, ctx.status, ctx.body);

            return;
        }

        if (ctx.response.type || body instanceof Buffer || body instanceof Stream) {
            debug.response(ctx.requestId, ctx.status, ctx.body);

            return;
        }

        switch (ctx.accepts('*', 'text', 'json', 'html')) {
            case '*':
            case 'html':
            case 'text':
            case 'json': {
                const res: any = {
                    code: status,
                    data: null,
                    message: ctx.message,
                    requestId: ctx.requestId,
                };

                if (status === 200) {
                    res.data = body;
                }
                ctx.response.type = 'json';
                ctx.body = JSON.stringify(res);

                debug.response(ctx.requestId, ctx.status, ctx.body);
                return;
            }
            default: {
                debug.response(ctx.requestId, ctx.status, ctx.body);
                return;
            }
        }
    } catch (e) {
        const res: any = {
            code: e.code || e.statusCode || 500,
            data: null,
            name: e.name,
            message: e.message,
            requestId: ctx.requestId,
        };

        if (process.env.NODE_ENV !== 'production') {
            res.stack = e.stack;
        }

        const status = res.code ?
            (res.code >= 400 && res.code < 600 ? res.code : 500) :
            (e instanceof Error ? 500 : ctx.status);

        ctx.response.type = 'json';

        ctx.body = JSON.stringify(res);

        ctx.status = status;

        debug.error(ctx.requestId, ctx.status, ctx.body, e);
    }
};

export default responseMiddleware;
