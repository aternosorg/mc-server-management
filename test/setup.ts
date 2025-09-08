import {ChildProcess, spawn } from 'child_process';
import {getConnection, wait} from "./utils.js";

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
    server = spawn('./spec.sh', ['run-server']);

    const timeout = setTimeout(() => {
        console.error("Server did not start in time");
        server?.kill();
    }, 120_000);

    while (true) {
        if (server.exitCode !== null) {
            throw new Error("Server process exited unexpectedly");
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
        server = spawn('./spec.sh', ['stop-server']);
    }
}
