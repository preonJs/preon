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
