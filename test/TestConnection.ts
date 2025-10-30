import {Connection} from "../src";
import {CallResponse} from "../src/connection/Connection";
import ProtocolInfo from "../src/schemas/discovery/ProtocolInfo";
import DiscoveryResponse from "../src/schemas/discovery/DiscoveryResponse";

export type RequestHistoryEntry = {
    method: string,
    parameters: object | Array<unknown>,
}

export default class TestConnection extends Connection {
    private responseQueue: CallResponse[] = [];
    private requestHistory: RequestHistoryEntry[] = [];
    private discoveryResponse: unknown = new DiscoveryResponse(
        "1.3.1",
        new ProtocolInfo("Minecraft Server Management", "2.0.0")
    );

    public addSuccess<T>(result: T): T {
        this.responseQueue.push({success: true, data: result});
        return result;
    }

    public addError<T>(result: T): T {
        this.responseQueue.push({success: false, error: result});
        return result;
    }

    public shiftRequestHistory(): RequestHistoryEntry | null {
        return this.requestHistory.shift() ?? null;
    }

    public setDiscoveryResponse(response: unknown): void {
        this.discoveryResponse = response;
    }

    async callRaw(method: string, parameters: object | Array<unknown>): Promise<CallResponse> {
        if (method === 'rpc.discover') {
            return {
                success: true,
                data: this.discoveryResponse,
            };
        }

        this.requestHistory.push({method, parameters});
        const result = this.responseQueue.shift();
        if (result === undefined) {
            throw new Error("No more results in queue");
        }

        return result;
    }

    close(): void {
    }
}
