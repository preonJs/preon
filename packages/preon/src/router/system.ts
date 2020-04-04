import * as Router from '@koa/router';
import Application from '../application';

export const prefix = '/_';

export default function (router: Router, { controller }: Application) {
    router.all('/', controller.System.test);

    router.get('/system', controller.System.system);

    router.get('/exception', controller.System.exception);
}
