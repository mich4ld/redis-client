import { Redis } from './lib';

async function run() {
    const client = new Redis({
        host: 'localhost',
        port: 6379,
        password: 'mypassword',
    });

    try {
        const user = await client.get('user:1');
        client.keys();
        const followers = await client.lrange('user:1:followers', 0, 100);

        console.log('User profile:', user);
        console.log('Followers:', followers);

        await client.sendCommand('LINDEX', 'lista', '2ikfasdkfsd');
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message)
        }
    }

    client.close();
}

run();