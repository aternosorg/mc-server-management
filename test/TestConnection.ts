import Connection from "../src/connection/Connection.js";

export type RequestHistoryEntry = {
    method: string,
    parameters: object | Array<unknown>,
}

export default class TestConnection extends Connection {
    private responseQueue: unknown[] = [];
    private requestHistory: RequestHistoryEntry[] = [];

    public addResponse<T>(result: T): T {
        this.responseQueue.push(result);
        return result;
    }

    public shiftRequestHistory(): RequestHistoryEntry|null {
        return this.requestHistory.shift() ?? null;
    }

    async callRaw(method: string, parameters: object | Array<unknown>): Promise<unknown> {
        this.requestHistory.push({method, parameters});
        if (this.responseQueue.length === 0) {
            throw new Error("No more results in queue");
        }

        return this.responseQueue.shift();
    }

    close(): void {
    }
}
