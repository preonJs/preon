import { defaultTo } from 'lodash';

export default function getEnv(key:string | keyof NodeJS.ProcessEnv): string | undefined
export default function getEnv(key: string | keyof NodeJS.ProcessEnv, defaultValue: string): string
export default function getEnv(key: string | keyof NodeJS.ProcessEnv, defaultValue?: string): string | undefined {
    const value = process.env[key];

    return defaultValue ? defaultTo(process.env[key], defaultValue) : value;
}
