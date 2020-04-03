import { Context, Middleware } from 'koa';

const accessMiddleware: Middleware = async function access(ctx: Context, next) {
    if (ctx.method.toUpperCase() === 'HEAD') {
        ctx.body = 'success';
        ctx.status = 200;
        return;
    }
    if (ctx.method.toUpperCase() === 'OPTIONS') {
        // Do not support cors now
        return;
    }

    if (ctx.url === '/favicon.ico') {
        return;
    }

    return next();
};

export default accessMiddleware;
