import { Router } from '@preon/core';
import Application from '../application';

export const prefix = '/_';

const creatrRouter = (router: Router, app: Application) => {
    router.get('/version', app.controller.System.version);

    return router;
};

export default creatrRouter;
