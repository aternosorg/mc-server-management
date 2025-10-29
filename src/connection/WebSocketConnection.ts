import Connection, {CallResponse} from './Connection.js';
import {Client, type IWSClientAdditionalOptions} from "rpc-websockets";
import type {ClientOptions} from "ws";
import Notifications from "../server/Notifications";

export default class WebSocketConnection extends Connection {
    readonly client: Client;

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
        const connection = new WebSocketConnection(client);
        await new Promise<void>((resolve, reject) => {
            client.once('open', () => {
                client.removeListener('error', reject);
                resolve();
            });
            client.once('error', reject);
        });
        return connection;
    }

    /**
     * Manually create a WebSocket connection. Use {@link WebSocketConnection.connect} instead.
     * @param client
     */
    constructor(client: Client) {
        super();
        this.client = client;

        this.client.on('open', () => this.emit('open'));
        this.client.on('error', (e: ErrorEvent) => {
            if (!this.emit('error', e.error)) {
                console.error('Unhandled connection error:', e.error);
            }
        });
        this.client.on('close', (code, reason) => this.emit('close', code, reason));
        for (const notification of Object.values(Notifications)) {
            this.client.on(notification, (data: unknown) => this.emit(notification, data));
        }
    }

    async callRaw(method: string, parameters: object | Array<unknown>): Promise<CallResponse> {
        try {
            const result = await this.client.call(method, parameters);
            return {success: true, data: result};
        } catch (error) {
            return {success: false, error: error};
        }
    }

    close() {
        this.client.close();
    }
}
