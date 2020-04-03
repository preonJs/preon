import * as Crypto from 'crypto';
import { Context } from 'koa';
import { v4 as uuid } from 'uuid';

const generateRequestId = (ctx: Context) => {
    const hash = Crypto.createHash('md5');

    hash.update([ctx.get('user-agent'), Date.now(), uuid()].join('_'));

    return hash.digest('hex').toUpperCase();
};

export default generateRequestId;
