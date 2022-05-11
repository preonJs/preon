import { ChildProcess, spawn } from 'child_process';
import { SpawnOptions } from 'child_process';
import { EventEmitter } from 'events';
import * as colors from 'colors';
import { debounce } from 'lodash';

export default class Runner extends EventEmitter {
    protected running = false;

    protected child!: ChildProcess;

    constructor(
        protected readonly command: string,
        protected readonly args: ReadonlyArray<string>,
        protected readonly options: SpawnOptions,
    ) {
        super();

        process.on('exit', (code) => {
            if (this.child && !this.child.killed) {
                this.child.kill(code);
            }
        });

        this.restart = debounce(this.restart.bind(this), 1000);
    }

    public start() {
        if (this.running) {
            return;
        }
        console.warn(colors.yellow(`[RUNNER] START PROCESS`));

        const child = spawn(this.command, this.args, this.options);

        this.running = true;

        child.on('exit', (code) => {
            this.running = false;
            this.emit('exit', code);
        });
        child.once('kill', () => {
            this.running = false;
            this.emit('kill');
        });

        this.child = child;
    }

    public stop() {
        if (!this.running) {
            return;
        }
        console.warn(colors.yellow(`[RUNNER] STOP PROCESS`));
        this.running = false;
        this.child.send && this.child.send('exit');

        if (!this.child.killed) {
            this.child.kill();
        }
    }

    public restart() {
        if (!this.running || !this.child || this.child.killed) {
            this.running = false;
            this.start();
            return;
        }

        this.child.once('exit', () => {
            this.start();
        });

        this.stop();
    }
}
