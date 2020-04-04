import * as Core from '@preon/core';
import Application from './dist/index';

export * from './dist/index';

export default Application;

declare module '@preon/core' {
    interface IConfig extends Core.IConfig {

    }
}
