import Connection, {CallResponse} from "./Connection";
import {Client, CommonClient} from "rpc-websockets";
import Notifications from "../server/Notifications";

export default abstract class CommonWebSocketConnection extends Connection {
    readonly client: Client;

    /**
     * Manually create a WebSocket connection. Consider using {@link WebSocketConnection.connect} instead.
     * @param client
     */
    protected constructor(client: CommonClient) {
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
