import { router } from 'preon';
import * as System from '../controller/system';

router.get('/_/version', System.version);
