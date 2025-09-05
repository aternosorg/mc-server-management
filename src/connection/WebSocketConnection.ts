import type Connection from './Connection.js';
import {Client, type IWSClientAdditionalOptions} from "rpc-websockets";

export default class WebSocketConnection implements Connection {
    protected impl: Client;

    static async connect(url: string, options?: IWSClientAdditionalOptions): Promise<WebSocketConnection> {
        const client = new Client(url, options);
        await new Promise<void>((resolve, reject) => {
            client.on('open', () => resolve());
            client.on('error', (err) => reject(err));
        });
        return new WebSocketConnection(client);
    }

    constructor(impl: Client) {
        this.impl = impl;
    }

    call(method: string, parameters: object | Array<any>): Promise<unknown> {
        return this.impl.call(method, parameters);
    }

    disconnect() {
        this.impl.close();
    }
}
