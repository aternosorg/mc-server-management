import {Client, type IWSClientAdditionalOptions, type WebSocketBrowserOptions} from "rpc-websockets";
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

        return new BrowserWebSocketConnection(new Client(url, options))
            .initialConnect(options.reconnect);
    }

    /**
     * Manually create a WebSocket connection. Consider using {@link BrowserWebSocketConnection.connect} instead.
     * @param client
     */
    constructor(client: Client) {
        super(client);
    }
}
