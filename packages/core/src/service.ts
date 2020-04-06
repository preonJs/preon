import Application from './application';

export default abstract class Service {
    readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }
}
