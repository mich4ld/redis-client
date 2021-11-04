import { Socket, connect as tcpConnect } from "net"
import { TLSSocket, connect as tlsConnect } from 'tls';
import { defaultOptions, DEFAULT_HOST, DEFAULT_PORT, IRedisOptions } from "./options";
import { parseCommand, parseReply } from "./parsers";

export class Client {
    private socket: Socket | TLSSocket;
    private queue: ((err: unknown, value: any) => void)[] = [];

    constructor(options: IRedisOptions = defaultOptions) {
        this.socket = this.createSocket(options);

        if (options.timeout) {
            this.socket.setTimeout(options.timeout);
        }

        if (options.keepAlive) {
            this.socket.setKeepAlive(true, options.keepAlive);
        }

        if (options.password) {
            this.auth(options.password);
        }

        this.socket
            .once('connect', () => console.log('Redis client connected'))
            .on('data', (chunk: Buffer) => {
                const replies = parseReply(chunk.toString('utf-8'));
                for (const reply of replies) {
                    const callback = this.queue.shift();
                    if (reply instanceof Error) {
                        callback!(reply, null);
                        return;
                    }
                    
                    callback!(null, reply);
                }
            });
    }

    private createSocket(options: IRedisOptions) {
        if (!options.tls) {
            return tcpConnect({
                port: options.port || DEFAULT_PORT,
                host: options.host || DEFAULT_HOST,
            });
        }
    
        return tlsConnect({
            host: options.host || DEFAULT_HOST,
            port: options.port || DEFAULT_PORT,
            ...options.tls,
        });
    }

    private auth(password: string) {
        return this.sendCommand('AUTH', password);
    }

    sendCommand(...args: string[]) {
        const rawCommand = parseCommand(...args);
        return new Promise((resolve, reject) => {
            this.queue.push((err, value) => {
                err ? reject(err) : resolve(value);
            })

            this.socket.write(rawCommand);
        });
    }

    close() {
        this.socket.destroy();
    }
}