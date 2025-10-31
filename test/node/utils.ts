import {ChildProcess} from "child_process";
import {NodeWebSocketConnection} from "../../src/index.node";
import {WS_TOKEN, WS_URL} from "../constants";

export async function createConnection() {
    return await NodeWebSocketConnection.connect(WS_URL, WS_TOKEN);
}

export function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function waitForProcessExit(process: ChildProcess): Promise<number | null> {
    return new Promise<number | null>(resolve => {
        process.on('exit', resolve);
    });
}
