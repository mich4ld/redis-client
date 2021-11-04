import { TLSSocketOptions } from 'tls';

export interface IRedisOptions {
    host?: string;
    port?: number;
    timeout?: number;
    keepAlive?: number;
    tls?: TLSSocketOptions;
    password?: string;
}

export const DEFAULT_HOST = '127.0.0.1';
export const DEFAULT_PORT = 6379;

export const defaultOptions: IRedisOptions = {
    host: DEFAULT_HOST,
    port: DEFAULT_PORT,
}