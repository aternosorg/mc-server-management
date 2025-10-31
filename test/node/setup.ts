import {getConnection, wait} from "./utils";
import {ChildProcess, spawn} from 'child_process';

let server: ChildProcess | null = null;

async function isConnectable(): Promise<boolean> {
    try {
        (await getConnection()).close();
        return true;
    } catch (e) {
        return false;
    }
}

async function isRunning(): Promise<boolean> {
    const process = spawn('./server.sh', ['is-running']);
    return new Promise<boolean>(resolve => {
        process.on('exit', (code) => {
            resolve(code === 0);
        });
    });
}

async function waitForConnectable(): Promise<void> {
    console.log(`Server is already running. Waiting for management websocket to come online...`);
    const timeout = serverStartTimeout();
    while (true) {
        if (await isConnectable()) {
            clearTimeout(timeout);
            return;
        }

        if (!await isRunning()) {
            clearTimeout(timeout);
            return await startServer();
        }
        await wait(1000);
    }
}

function serverStartTimeout(log?: string): NodeJS.Timeout {
    return setTimeout(() => {
        console.error("Server did not start in time");
        server?.kill();
        if (log) {
            console.log(log);
        }
        process.exit(1);
    }, 15 * 60 * 1_000);
}

async function startServer(): Promise<void> {
    console.log("Starting Minecraft server...");

    server = spawn('./server.sh', ['run']);
    let log = '';
    server.stdout?.on('data', (data) => {
        log += data.toString();
    });
    server.stderr?.on('data', (data) => {
        log += data.toString();
    });

    const timeout = serverStartTimeout();
    while (true) {
        if (server.exitCode !== null) {
            console.error("Server process exited unexpectedly: {}", server.exitCode);
            console.log(log);
            process.exit(1);
        }
        if (await isConnectable()) {
            clearTimeout(timeout);
            return;
        }
        await wait(1000);
    }
}

// noinspection JSUnusedGlobalSymbols
export async function setup() {
    if (process.env.DISABLE_SETUP) {
        return;
    }

    if (await isConnectable()) {
        return;
    }

    if (await isRunning()) {
        await waitForConnectable();
        return;
    }

    await startServer();
}

// noinspection JSUnusedGlobalSymbols
export async function teardown() {
    if (process.env.DISABLE_SETUP) {
        return;
    }

    if (server !== null) {
        console.log("Stopping Minecraft server...");
        spawn('./server.sh', ['stop']);
        server = null;
    }
}
