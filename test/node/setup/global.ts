import {createConnection, wait, waitForProcessExit} from "../utils";
import {ChildProcess, spawn} from 'child_process';
import {NodeWebSocketConnection} from "../../../src/index.node";
import {MinecraftServer} from "../../../src";

let server: ChildProcess | null = null;

async function isStarted(): Promise<boolean> {
    let connection: NodeWebSocketConnection|null = null;
    try {
        connection = await createConnection();
        const server = new MinecraftServer(connection);
        const status = await server.getStatus();
        return status.started;
    } catch (e) {
        return false;
    } finally {
        connection?.close();
    }
}

function callServerScript(...args: string[]): ChildProcess {
    return spawn('./server.sh', args);
}

async function isRunning(): Promise<boolean> {
    const process = callServerScript('is-running');
    return await waitForProcessExit(process) === 0;
}

async function waitForStarted(): Promise<void> {
    console.log(`Server is already running. Waiting for management websocket to come online...`);
    const timeout = serverStartTimeout();
    while (true) {
        if (await isStarted()) {
            clearTimeout(timeout);
            return;
        }

        if (!await isRunning()) {
            console.log("The server we were waiting for shut down:");
            await waitForProcessExit(spawn('./server.sh', ['logs'], {stdio: 'inherit'}));
            console.log("Trying to start it again...");
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

    server = callServerScript('run');
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
        if (await isStarted()) {
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

    if (await isStarted()) {
        return;
    }

    if (await isRunning()) {
        await waitForStarted();
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
        await waitForProcessExit(callServerScript('stop'));
        server = null;
    }
}
