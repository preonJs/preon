import { execSync } from 'child_process';

const fs = require('fs');

export const getFiles = async (cwd: string) => {
    return fs.promises.readdir(cwd);
};

export const checkFile = (path: string, blackList: Array<string | RegExp>) => {
    return !blackList.some(rule => {
        if (typeof rule === 'string') {
            return rule === path;
        }
        if (rule instanceof RegExp) {
            return rule.exec(path);
        }
        return true;
    });
};

export const writeIfNotExist = (path: string, data: string) => {
    if (fs.existsSync(path)) {
        return;
    }

    return fs.writeFileSync(path, data, 'utf8');
};

export const copyIfNotExist = (from: string, to: string) => {
    const data = fs.readFileSync(from, 'utf8');

    writeIfNotExist(to, data);
};

export const run = (cmd: string) => {
    return execSync(cmd, {
        stdio: 'inherit',
    });
};
