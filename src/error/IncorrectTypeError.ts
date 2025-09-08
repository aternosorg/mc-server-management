import InvalidResponseError from "./InvalidResponseError.js";

export default class IncorrectTypeError extends InvalidResponseError {
    /**
     * The expected type of the response.
     */
    readonly expectedType: string;
    /**
     * The actual type of the response.
     */
    readonly foundType: string;

    /**
     * Creates a new InvalidResponseError.
     * @param path The path in the response that was invalid.
     * @param expectedType The expected type of the response.
     * @param foundType The actual type of the response.
     * @param response The full response received from the server.
     * @internal
     */
    constructor(expectedType: string, foundType: string, response: unknown, ...path: string[]) {
        super("Expected " + expectedType + ", received " + foundType + ".", response, path);
        this.expectedType = expectedType;
        this.foundType = foundType;
    }
}
