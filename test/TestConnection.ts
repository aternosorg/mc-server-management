import {Connection} from "../src";
import {CallResponse} from "../src/connection/Connection";

export type RequestHistoryEntry = {
    method: string,
    parameters: object | Array<unknown>,
}

export default class TestConnection extends Connection {
    private responseQueue: CallResponse[] = [];
    private requestHistory: RequestHistoryEntry[] = [];

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

    async callRaw(method: string, parameters: object | Array<unknown>): Promise<CallResponse> {
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
