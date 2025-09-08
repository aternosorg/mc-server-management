import Connection from './Connection.js';
import {Client, type IWSClientAdditionalOptions} from "rpc-websockets";

export default class WebSocketConnection extends Connection {
    protected impl: Client;

    /**
     * Connect to a WebSocket server and return a WebSocketConnection instance.
     * @param url The WebSocket server URL.
     * @param options Additional options for the WebSocket client.
     */
    static async connect(url: string, options?: IWSClientAdditionalOptions): Promise<WebSocketConnection> {
        const client = new Client(url, options);
        await new Promise<void>((resolve, reject) => {
            client.on('open', () => resolve());
            client.on('error', (err) => reject(err));
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
    }

    callRaw(method: string, parameters: object | Array<unknown>): Promise<unknown> {
        return this.impl.call(method, parameters);
    }

    close() {
        this.impl.close();
    }
}
