import Connection from './Connection.js';
import {Client, type IWSClientAdditionalOptions} from "rpc-websockets";
import type {ClientOptions} from "ws";
import Notifications from "../server/Notifications";

export default class WebSocketConnection extends Connection {
    protected impl: Client;

    /**
     * Connect to a WebSocket server and return a WebSocketConnection instance.
     * @param url The WebSocket server URL.
     * @param token authorization token for the WebSocket connection.
     * @param options Additional options for the WebSocket client.
     */
    static async connect(url: string, token: string, options?: IWSClientAdditionalOptions & ClientOptions): Promise<WebSocketConnection> {
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

        this.impl.on('open', () => this.emit('open'));
        this.impl.on('error', (e: ErrorEvent) => this.emit('error', e.error));
        this.impl.on('close', (code, reason) => this.emit('close', code, reason));
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
