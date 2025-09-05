export default class InvalidResponseError extends Error {
    /**
     * The full response received from the server.
     */
    readonly response: unknown;
    /**
     * The path in the response that was invalid.
     */
    readonly path: string;

    constructor(message: string, response: unknown, path: string = '') {
        super("Invalid response from server at '" + path + "'. " + message);
        this.response = response;
        this.path = path;
    }
}
