import * as Koa from 'koa';
import * as compose from 'koa-compose';
import { type ExtendedContext } from './extend/context';
import * as KoaRouter from '@koa/router';
import Application from './application';

export interface ApplicationOptions {
    cwd: string;
    env: 'production' | 'development' | 'test' | string; // node env
    serverEnv: string; // app env
    port: number;
}

export interface ApplicationConfig {

}

// todo: generic type support ctx.params/query/body
export interface Context extends ExtendedContext, KoaRouter.RouterParamContext, Koa.Context {
    readonly requestId: string;
    readonly traceId: string;

    readonly app: Application;
}

export type Middleware = compose.Middleware<Context>;
