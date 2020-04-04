import * as Router from '@koa/router';
import { Application} from '../application';

export const prefix = '/_';

export default function (router: Router, { controller }: Application) {
    router.all('/', controller.System_.test);

    router.get('/system', controller.System_.system);

    router.get('/exception', controller.System_.exception);
}
