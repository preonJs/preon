import * as Koa from 'koa';
import * as KoaBody from 'koa-bodyparser';
import * as assert from 'assert';
import * as fs from 'fs';
import * as Debug from 'debug';
import * as path from 'path';
import * as http from 'http';
import mergeOptions from './util/merge-options';
import { Controllers, Services, IApplicationOptions, IConfig } from './typing';
import Loader from './loader/loader';
import loadConfig from './loader/load-config';
import accessMiddleware from './middleware/access';
import accessLogMiddleware from './middleware/access-log';
import responseMiddleware from './middleware/response';
import traceMiddleware from './middleware/trace';
import Context from './extend/context';
import loadRouter from './loader/load-router';
import loadController from './loader/load-controller';
import loadService from './loader/load-service';

const debug = Debug('preon:core');

export const CORE_DIR = path.resolve(__dirname);

export default abstract class Application extends Koa {
    public controller: Controllers;

    public service: Services;

    private readonly options: IApplicationOptions;

    public readonly config: IConfig;

    private readonly loader: Loader;

    public readonly server: http.Server;

    constructor(options: Partial<IApplicationOptions> = {}) {
        super();

        assert(Object.getPrototypeOf(this) !== Application.prototype, `Can not create instance of @preon/core directly, you can create framework extends @preon/core or use \`preon\``);

        const { cwd, env } = this.options = mergeOptions(options);

        this.env = env;

        if (env === 'development' && !process.env.DEBUG) {
            process.env.DEBUG = '*';
            Debug.enable('*');
        }

        debug('[OPTIONS]', JSON.stringify(options));
        debug('[OPTIONS MERGED]', JSON.stringify(this.options));

        assert(typeof cwd === 'string', `options.cwd must be string, but got ${typeof cwd}`);
        assert(fs.existsSync(cwd), `Directory options.cwd: ${cwd} not exist`);
        assert(fs.statSync(cwd).isDirectory(), `Directory options.cwd: ${cwd} is not a directory`);

        this.context = Object.create(this.context, Object.getOwnPropertyDescriptors(Context));

        this.loader = new Loader(this.options, this);

        this.config = this.loadConfig();

        this.loadMiddleware();
        this.service = this.loadService();
        this.controller = this.loadController();
        this.loadRouter();

        this.server = http.createServer(this.callback());
    }

    get path() {
        return __dirname;
    }

    get cwd() {
        return this.options.cwd;
    }

    get port() {
        return this.options.port;
    }

    get serverEnv() {
        return this.options.serverEnv;
    }

    // load config and middleware, plugins options
    protected loadConfig() {
        return loadConfig(this.loader, this);
    }

    // todo: support custom middleware config
    // how to configuration middlewares? app.use(middleware) => app.middlewares.append() => koa.use
    protected loadMiddleware() {
        this.use(accessMiddleware);
        this.use(KoaBody());
        this.use(traceMiddleware);
        this.use(accessLogMiddleware);
        this.use(responseMiddleware);
    }

    protected loadRouter() {
        return loadRouter(this.loader, this);
    }

    protected loadController() {
        return loadController(this.loader, this);
    }

    protected loadService() {
        return loadService(this.loader, this);
    }

    protected async beforeStart() {

    }

    protected async afterStart() {

    }

    public async start(): Promise<http.Server> {
        await this.beforeStart();

        const server = this.server;

        return new Promise((resolve, reject) => {
            let returned = false;

            server.once('error', (error) => {
                if (!returned) {
                    reject(error);
                    returned = true;
                }
            });

            server.listen({
                port: this.port,
            }, () => {
                debug(`[START] Server start listening at ${this.port}`);

                this.afterStart();

                if (!returned) {
                    resolve(server);
                    returned = true;
                }
            });
        });
    }

    public async close() {
        return new Promise((resolve, reject) => {
            this.server.close((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}
