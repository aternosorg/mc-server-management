import {expect, test} from "vitest";
import {Client} from "rpc-websockets";
import {getConnection, WS_TOKEN, WS_URL} from "../utils";
import {WebSocketConnection} from "../../src";

test('Open event is forwarded', async () => {
    const client = new Client(WS_URL, {autoconnect: false, headers: {Authorization: `Bearer ${WS_TOKEN}`}});
    const ws = new WebSocketConnection(client);

    await new Promise<void>((resolve, reject) => {
        let timeout = setTimeout(() => {
            reject(new Error("Timeout waiting for open event"));
        }, 1000);
        ws.once('open', () => {
            clearTimeout(timeout);
            resolve();
        });

        client.connect();
    });
});

test('Close event is forwarded', async () => {
    const ws = await getConnection();
    await new Promise<void>((resolve, reject) => {
        let timeout = setTimeout(() => {
            reject(new Error("Timeout waiting for close event"));
        }, 1000);
        ws.once('close', (code, reason) => {
            clearTimeout(timeout);
            try {
                expect(code).toBe(1000);
                expect(reason).toBe("");
            } catch (e) {
                reject(e);
                return;
            }
            resolve();
        });

        ws.close();
    });
});

test('Error event is forwarded', async () => {
    const client = new Client(WS_URL, {autoconnect: false});
    const ws = new WebSocketConnection(client);

    await new Promise<void>((resolve, reject) => {
        let timeout = setTimeout(() => {
            reject(new Error("Timeout waiting for error event"));
        }, 1000);
        ws.once('error', (err) => {
            clearTimeout(timeout);
            try {
                expect(err).toBeInstanceOf(Error);
                expect(err.message).toMatch(/Unexpected server response: 401/);
            } catch (e) {
                reject(e);
                return;
            }
            resolve();
        });

        client.connect();
    });
});
