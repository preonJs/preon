export * from './dist/index';

export { Application as default } from './dist/index';

declare module '@preon/core' {
    interface IConfig extends Core.IConfig {

    }
}
