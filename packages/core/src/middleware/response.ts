import * as Debug from 'debug';
import * as Stream from 'stream';
import * as Status from 'http-status';
import { Context, Middleware } from '../typings';
import { camelCase, upperFirst } from 'lodash';
import Exception from 'exception.js';

const debug = {
    request: Debug('app:request'),
    response: Debug('app:response'),
    error: Debug('app:response:exception'),
};

const isStream = (stream: unknown): stream is Stream => {
    return stream !== null
        && typeof stream === 'object'
        && typeof (stream as Stream).pipe === 'function';
};

const logResponse = (ctx: Context, data?: any, error?: Error) => {
    if (!data) {
        debug.response(`[RESPONSE] status: ${ctx.status} type: ${ctx.type}`);

        return;
    }

    if (data.code >= 400) {
        debug.error(
            `[RESPONSE] code: ${data.code} subcode: ${data.subcode} error: ${data.error} message: ${data.message}`,
            error,
        );
    } else {
        debug.error(`[RESPONSE] code: ${data.code} subcode: ${data.subcode}`);
    }
};

const responseMore = process.env.NODE_ENV !== 'production';

const renderError = (ctx: Context, error: Exception) => {
    ctx.body = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${error.name || 'Error'}</title>
            <style>
                body {
                    width: 35em;
                    max-width: 90%;
                    margin: 0 auto;
                    font-family: Tahoma, Verdana, Arial, sans-serif;
                }

                pre {
                    font-family: "Roboto", Arial, sans-serif;
                    text-align: left;
                    font-size: 12px;
                    background-color: rgb(245, 245, 245);
                    padding: 24px;
                    overflow: auto;
                    display: block;
                    width: 100%;
                }
            </style>
        </head>
        <body>
            <h1>${error.code}${error.subcode ? `(${error.subcode})` : ''}: ${error.name || 'Error'}</h1>
            <p>${error.message}</p>
            ${error.meta ? `<p>Meta:</p><pre>${JSON.stringify(error.meta, ' ' as any, 4)}</pre>` : ''}
            ${error.stack ? `<p>Stack:</p><pre>${error.stack}</pre>` : ''}
        </body>
    `;
};

const responseMiddleware: Middleware = async function response(ctx, next) {
    debug.request(`[${ctx.method}] ${ctx.requestId} ${ctx.traceId} ${ctx.originalUrl}`);

    try {
        await next();

        const { rawBody } = ctx;

        // including 404
        if (rawBody || rawBody === null) {
            ctx.body = rawBody;

            return;
        }

        const originBody = ctx.body;

        if (originBody === null || Buffer.isBuffer(originBody) || isStream(originBody)) {
            logResponse(ctx);

            return;
        }

        const data: any = {
            code: ctx.status,
            subcode: 0,
            message: 'ok',
            data: originBody,
        };

        if (ctx.status >= 400) {
            const message = Status[ctx.status] as string;
            data.message = message;
            data.error = message ? upperFirst(camelCase(message)) : undefined;
        }

        if (ctx.isApiRequest) {
            ctx.type = 'json';
            ctx.body = JSON.stringify(data);

            logResponse(ctx, data);

            return;
        }

        if (ctx.status >= 400) {
            const error = new Exception(data.message, {} as any);
            error.code = data.code;
            error.subcode = data.subcode;
            data.error && (error.name = data.error);
            data.data && (error.meta.data = data.data);

            if (!responseMore) {
                error.stack = undefined;
            }

            await renderError(ctx, error);

            logResponse(ctx, data, error);

            return;
        }

        if (typeof originBody === 'number') {
            ctx.body = JSON.stringify(originBody);
        }

        logResponse(ctx, data);
    } catch (error: Error | string | any) {
        let code = error?.code || 500;
        let subcode = error?.subcode || 0;

        const originBody = ctx.body;

        if (code > 599 || code < 100) {
            code = 500;
            subcode = code;
        }

        const body: any = {
            code,
            subcode,
            message: error?.message || '',
            error: error?.name || '',
            data: originBody,
        };

        if (responseMore) {
            body.stack = error?.stack || '';
        }

        if (error.meta) {
            body.meta = error.meta;
        }

        if (ctx.isApiRequest) {
            ctx.type = 'json';
            ctx.body = JSON.stringify(body);

            logResponse(ctx, body, error);

            return;
        }

        error.subcode = subcode;
        error.meta = error.meta || {};
        if (body.data) {
            error.meta.data = body.data;
        }
        if (!responseMore) {
            error.stack = undefined;
        }

        logResponse(ctx, body, error);

        return renderError(ctx, error);
    }
};

export default responseMiddleware;
