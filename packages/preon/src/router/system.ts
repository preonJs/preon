import { Context, Router } from '@preon/core';
import * as System from '../controller/system';
import * as Exceptions from 'exception.js';

const router = new Router({});

router.all('/_/test', System.test);

router.get('/_/system', System.system);

router.get('/_/404', (ctx: Context) => {
    ctx.status = 404;
});

router.get('/_/exception', () => {
    const error = new Exceptions.ImATeapot();

    error.subcode = 10086;

    throw error;
});

router.get('/_/api/exception', () => {
    const error = new Exceptions.ImATeapot();

    error.subcode = 10086;

    throw error;
});

router.all(/.*/, (ctx: Context) => {
    ctx.status = 404;
});

export default router;
