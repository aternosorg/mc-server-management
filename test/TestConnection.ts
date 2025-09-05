import Connection from "../src/connection/Connection.js";

export type RequestHistoryEntry = {
    method: string,
    parameters: object | Array<unknown>,
}

export default class TestConnection implements Connection {
    private resultQueue: unknown[] = [];
    private requestHistory: RequestHistoryEntry[] = [];

    public addResult<T>(result: T): T {
        this.resultQueue.push(result);
        return result;
    }

    public shiftRequestHistory(): RequestHistoryEntry|null {
        return this.requestHistory.shift() ?? null;
    }

    async call(method: string, parameters: object | Array<unknown>): Promise<unknown> {
        this.requestHistory.push({method, parameters});
        if (this.resultQueue.length === 0) {
            throw new Error("No more results in queue");
        }

        return this.resultQueue.shift();
    }

    close(): void {
    }
}
