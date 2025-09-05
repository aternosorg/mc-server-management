/**
 * Library independent connection interface.
 * Can be used to proxy calls to different libraries or through intermediate APIs.
 */
export default interface Connection {
    /**
     * Call a method on the server with the given parameters.
     * @param method The method name to call.
     * @param parameters The parameters to pass to the method.
     * @returns A promise that resolves to the result of the method call.
     */
    call(method: string, parameters: object | Array<unknown>): Promise<unknown>;

    /**
     * Close the connection.
     */
    close(): void;
}
