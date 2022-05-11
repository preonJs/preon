import { Router } from '@preon/core';
import * as System from '../controller/system';

const router = new Router({
    prefix: '/_',
});

router.all('/', System.test);

router.get('/system', System.system);

router.get('/exception', System.exception);
