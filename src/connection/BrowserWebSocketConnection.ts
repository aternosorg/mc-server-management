import {Client, type IWSClientAdditionalOptions, type WebSocketBrowserOptions} from "rpc-websockets/browser";
import CommonWebSocketConnection from "./CommonWebSocketConnection";

export default class BrowserWebSocketConnection extends CommonWebSocketConnection {
    /**
     * Connect to a WebSocket server and return a WebSocketConnection instance.
     * @param url The WebSocket server URL.
     * @param token authorization token for the WebSocket connection.
     * @param options Additional options for the WebSocket client.
     */
    static async connect(url: string, token: string, options?: IWSClientAdditionalOptions & WebSocketBrowserOptions): Promise<BrowserWebSocketConnection> {
        options ??= {};
        options.protocols ??= ["minecraft-v1", token];
        const client = new Client(url, options);
        await new Promise<void>((resolve, reject) => {
            client.once('open', () => {
                client.removeListener('error', reject);
                resolve();
            });
            client.once('error', reject);
        });
        return new BrowserWebSocketConnection(client);
    }

    /**
     * Manually create a WebSocket connection. Consider using {@link BrowserWebSocketConnection.connect} instead.
     * @param client
     */
    constructor(client: Client) {
        super(client);
    }
}
