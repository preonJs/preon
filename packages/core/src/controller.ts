import Application from './application';

export default abstract class Controller {
    protected readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }
}
