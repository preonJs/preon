import Preon from 'preon';

class App extends Preon {
    constructor() {
        super();
    }

    get path() {
        return __dirname;
    }
}

const app = new App();

app.start();
