export default interface Connection {
    call(method: string, parameters: object | Array<any>): Promise<unknown>;
    disconnect(): void;
}
