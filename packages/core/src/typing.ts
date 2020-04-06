import * as Koa from 'koa';
import { Context as ExtendContext } from './extend/context';
import Controller from './controller';
import * as KoaRouter from '@koa/router';
import Application from './application';
import Service from './service';

export interface IApplicationOptions {
    cwd: string;
    env: 'production' | 'development' | 'test' | string; // node env
    serverEnv: string; // app env
    port: number;
}

export interface IConfig {

}

export interface Context extends ExtendContext, KoaRouter.RouterParamContext, Koa.Context {
    readonly requestId: string;
    readonly traceId: string

    readonly app: Application
}

export type Controllers<T extends string = string> = {
    [key in T]: Controller
}

export type Services<T extends string = string> = {
    [key in T]: Service
}
