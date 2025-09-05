import Connection from "../src/connection/Connection.js";

export default class TestConnection implements Connection {
    private resultQueue: any[] = [];

    public addResult(result: any) {
        this.resultQueue.push(result);
    }

    call(method: string, parameters: object | Array<any>): Promise<unknown> {
        if (this.resultQueue.length === 0) {
            throw new Error("No more results in queue");
        }

        return this.resultQueue.shift();
    }
    
    close(): void {
    }
}
