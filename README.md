# Node.js Redis client
Simple Redis Node.js client (not production ready) WITHOUT any npm dependencies.

It's using Node.js core modules:
- `net`
- `tls`

This client is not perfect and can be not stable. I created it for learning how Redis protocl and TCP works.
### Better production-ready Node.js clients:
- `ioredis` (https://github.com/luin/ioredis)
- `node-redis` (https://github.com/NodeRedis/node-redis)


## Example
`example.ts`
```ts
import { Redis } from './lib';

async function run() {
    const client = new Redis({
        host: 'localhost',
        port: 6379,
        password: 'mypassword',
    });

    try {
        const user = await client.get('user:1');
        const followers = await client.lrange('user:1:followers', 0, 100);

        console.log('User profile:', user);
        console.log('Followers:', followers);

        // should throw error:
        await client.sendCommand('LINDEX', 'list', '2ikfasdkfsdz');
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message)
        }
    }

    client.close();
}

run();
```
