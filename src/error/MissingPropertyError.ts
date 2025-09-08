import InvalidResponseError from "./InvalidResponseError.js";

export default class MissingPropertyError extends InvalidResponseError {
    /**
     * Name of the missing property.
     */
    readonly property: string;

    /**
     * Creates a new MissingPropertyError.
     * @param property Name of the missing property.
     * @param response The full response received from the server.
     * @param path The path in the response that was invalid.
     * @internal
     */
    constructor(property: string, response: unknown = null, ...path: string[]) {
        super(`Missing required property '${property}'.`, response, path.concat(property));
        this.property = property;
    }
}
