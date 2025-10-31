import {getConnection, wait} from "./utils";
import {ChildProcess, spawn} from 'child_process';

let server: ChildProcess | null = null;

async function checkIfServerRunning(): Promise<boolean> {
    try {
        (await getConnection()).close();
        return true;
    } catch (e) {
        return false;
    }
}

export async function setup() {
    if (process.env.DISABLE_SETUP) {
        return;
    }

    if (await checkIfServerRunning()) {
        return;
    }

    console.log("Starting Minecraft server...");
    server = spawn('./server.sh', ['run']);
    let log = '';
    server.stdout?.on('data', (data) => {
        log += data.toString();
    });
    server.stderr?.on('data', (data) => {
        log += data.toString();
    });

    const timeout = setTimeout(() => {
        console.error("Server did not start in time");
        server?.kill();
        console.log(log);
        process.exit(1);
    },  15 * 60 * 1_000);

    while (true) {
        if (server.exitCode !== null) {
            console.error("Server process exited unexpectedly: {}", server.exitCode);
            console.log(log);
            process.exit(1);
        }
        if (await checkIfServerRunning()) {
            break;
        }
        await wait(1000);
    }
    clearTimeout(timeout);
}

export async function teardown() {
    if (process.env.DISABLE_SETUP) {
        return;
    }

    if (server !== null) {
        console.log("Stopping Minecraft server...");
        server = spawn('./server.sh', ['stop']);
    }
}
