import {InvalidResponseError} from "../index";

export default class UnknownEnumVariantError extends InvalidResponseError {
    /**
     * The expected enum.
     */
    readonly enum: string;
    /**
     * The actual value.
     */
    readonly value: string;

    /**
     * Creates a new InvalidResponseError.
     * @param path The path in the response that was invalid.
     * @param enumName The expected type of the response.
     * @param value The actual type of the response.
     * @param response The full response received from the server.
     * @internal
     */
    constructor(enumName: string, value: string, response: unknown, ...path: string[]) {
        super("Unknown enum value " + value + " for enum " + enumName + ".", response, path);
        this.enum = enumName;
        this.value = value;
    }
}
