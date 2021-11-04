import { Client } from "./client";
import { IRedisOptions } from "./options";

export class Redis {
    private readonly client: Client;

    constructor(options: IRedisOptions) {
        this.client = new Client(options);
    }

    close() {
        return this.client.close();
    }

    sendCommand<T>(...args: string[]) {
        return this.client.sendCommand(...args) as Promise<T>
    }

    keys(pattern: string = '*') {
        return this.client.sendCommand('KEYS', pattern) as Promise<string[]>;
    }

    get(key: string) {
        return this.client.sendCommand('GET', key) as Promise<string>;
    }

    set(key: string, value: string) {
        return this.client.sendCommand('SET', key, value) as Promise<"OK">;
    }

    setex(key: string, value: string, seconds: number) {
        return this.client.sendCommand('SETEX', key, seconds.toString(), value) as Promise<"OK">;
    }

    ttl(key: string) {
        return this.client.sendCommand('TTL', key) as Promise<number>;
    }

    del(key: string) {
        return this.client.sendCommand('DEL', key) as Promise<number>;
    }

    hget(key: string, field: string) {
        return this.client.sendCommand('HGET', key, field) as Promise<string>;
    }

    hgetall(key: string) {
        return this.client.sendCommand('HGETALL', key) as Promise<string[]>;
    }
    
    hkeys(key: string) {
        return this.client.sendCommand('HKEYS', key) as Promise<string[]>;
    }

    hset(key: string, ...args: string[]) {
        return this.client.sendCommand('HSET', key, ...args) as Promise<number>;
    }

    hexists(key: string, field: string) {
        return this.client.sendCommand('HEXISTS', key, field) as Promise<number>;
    }

    hdel(key: string, ...fields: string[]) {
        return this.client.sendCommand('HDEL', key, ...fields) as Promise<number>;
    }

    lrange(key: string, start: number, stop: number) {
        return this.client.sendCommand(
            'LRANGE',
            key,
            start.toString(),
            stop.toString(),
        ) as Promise<string[]>
    }

    lindex(key: string, index: number) {
        return this.client.sendCommand('LINDEX', key, index.toString()) as Promise<string>;
    }

    lpush(key: string, ...elements: string[]) {
        return this.client.sendCommand('LPUSH', key, ...elements) as Promise<number>;
    }
}