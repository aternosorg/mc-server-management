import Connection from './Connection.js';
import {Client, type IWSClientAdditionalOptions} from "rpc-websockets";
import {Notifications} from "../MinecraftServer.js";
import type {WebSocket} from "ws";

export default class WebSocketConnection extends Connection {
    protected impl: Client;

    /**
     * Connect to a WebSocket server and return a WebSocketConnection instance.
     * @param url The WebSocket server URL.
     * @param token authorization token for the WebSocket connection.
     * @param options Additional options for the WebSocket client.
     */
    static async connect(url: string, token: string, options?: IWSClientAdditionalOptions & WebSocket.ClientOptions): Promise<WebSocketConnection> {
        options ??= {};
        options.headers ??= {};
        options.headers['Authorization'] ??= `Bearer ${token}`;
        const client = new Client(url, options);
        await new Promise<void>((resolve, reject) => {
            client.once('open', () => {
                client.removeListener('error', reject);
                resolve();
            });
            client.once('error', reject);
        });
        return new WebSocketConnection(client);
    }

    /**
     * Manually create a WebSocket connection. Use {@link WebSocketConnection.connect} instead.
     * @param impl
     */
    constructor(impl: Client) {
        super();
        this.impl = impl;

        for (const notification of Object.values(Notifications)) {
            this.impl.on(notification, (data: unknown) => this.emit(notification, data));
        }
    }

    callRaw(method: string, parameters: object | Array<unknown>): Promise<unknown> {
        return this.impl.call(method, parameters);
    }

    close() {
        this.impl.close();
    }
}
