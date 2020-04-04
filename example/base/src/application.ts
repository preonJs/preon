import Preon from 'preon';
import System from './controller/system';

export default class Application extends Preon {
    controller: { System: System };
}
