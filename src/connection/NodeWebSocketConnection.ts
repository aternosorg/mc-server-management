import {Client, type IWSClientAdditionalOptions} from "rpc-websockets";
import type {ClientOptions} from "ws";
import CommonWebSocketConnection from "./CommonWebSocketConnection";

export default class NodeWebSocketConnection extends CommonWebSocketConnection {
    /**
     * Connect to a WebSocket server and return a WebSocketConnection instance.
     * @param url The WebSocket server URL.
     * @param token authorization token for the WebSocket connection.
     * @param options Additional options for the WebSocket client.
     */
    static async connect(url: string, token: string, options?: IWSClientAdditionalOptions & ClientOptions): Promise<NodeWebSocketConnection> {
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
        return new NodeWebSocketConnection(client);
    }

    /**
     * Manually create a WebSocket connection. Consider using {@link NodeWebSocketConnection.connect} instead.
     * @param client
     */
    constructor(client: Client) {
        super(client);
    }
}
