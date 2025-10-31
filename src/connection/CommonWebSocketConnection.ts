import Connection, {CallResponse} from "./Connection";
import {Client, CommonClient, type IWSClientAdditionalOptions} from "rpc-websockets";
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
        this.client.on('max_reconnects_reached', (code, reason) => this.emit('max_reconnects_reached', code, reason));
        for (const notification of Object.values(Notifications)) {
            this.client.on(notification, (data: unknown) => this.emit(notification, data));
        }
    }

    /**
     * @internal
     */
    async initialConnect(reconnect?: boolean): Promise<this> {
        const promise = new Promise<this>((resolve, reject) => {
            let lastError: Error | null = null;
            const errorHandler = (e: Error) => {
                if (reconnect ?? true) {
                    lastError = e;
                    return;
                }
                reject(e);
            };
            this.once('open', () => {
                this.removeListener('max_reconnects_reached', reject);
                this.removeListener('error', errorHandler);
                resolve(this);
            });
            this.once('max_reconnects_reached', (code: number, reason: string) => {
                reject(lastError);
            });
            this.on('error', errorHandler);
        });
        this.client.connect();

        return await promise;
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
