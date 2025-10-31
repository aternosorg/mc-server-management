import {expect, test, vi} from "vitest";
import {Client} from "rpc-websockets";
import {WS_TOKEN, WS_URL} from "../../constants";
import {getConnection} from "../setup/connections";
import {WebSocketConnection} from "../../../src/index.node";

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
    const client = new Client(WS_URL, {autoconnect: false, reconnect: false});
    const ws = new WebSocketConnection(client);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

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
    expect(error).not.toHaveBeenCalled();
});

test('Connection fails with retires', async () => {
    const connection = WebSocketConnection.connect(WS_URL, "");
    await expect(connection).rejects.toThrow();
});

test('Connection fails without retires', async () => {
    const connection = WebSocketConnection.connect(WS_URL, "", {reconnect: false});
    await expect(connection).rejects.toThrow();
});

test('Errors are logged if no handler is registered', async () => {
    const connection = await getConnection();

    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    connection.client.emit('error', { error: new Error("Connection error") });
    expect(error).toHaveBeenCalled();
});

test('Errors encountered during callRaw are forwarded', async () => {
    const connection = await getConnection();
    const error = new Error("Call error");
    connection.client.call = () => {
        return Promise.reject(error);
    };
    await expect(connection.callRaw("some.method", {})).resolves.toStrictEqual({success: false, error: error});
});
