export default class InvalidResponseError extends Error {
    /**
     * The path in the response that was invalid.
     */
    readonly path: string;
    /**
     * The expected type of the response.
     */
    readonly expectedType: string;
    /**
     * The actual type of the response.
     */
    readonly foundType: string;
    /**
     * The full response received from the server.
     */
    readonly response: any;

    /**
     * Creates a new InvalidResponseError.
     * @param path The path in the response that was invalid.
     * @param expectedType The expected type of the response.
     * @param foundType The actual type of the response.
     * @param response The full response received from the server.
     */
    constructor(expectedType: string, foundType: string, response: any, path: string = '') {
        super("Invalid response from server at '" + path + "'. Expected " + expectedType + ", received " + foundType + ".");
        this.expectedType = expectedType;
        this.foundType = foundType;
        this.response = response;
        this.path = path;
    }
}
