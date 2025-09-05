import Connection from "../src/connection/Connection.js";

export default class TestConnection implements Connection {
    private resultQueue: unknown[] = [];

    public addResult<T>(result: T): T {
        this.resultQueue.push(result);
        return result;
    }

    async call(method: string, parameters: object | Array<unknown>): Promise<unknown> {
        if (this.resultQueue.length === 0) {
            throw new Error("No more results in queue");
        }

        return this.resultQueue.shift();
    }

    close(): void {
    }
}
