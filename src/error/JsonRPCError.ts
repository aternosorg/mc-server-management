import MissingPropertyError from "./MissingPropertyError.js";
import IncorrectTypeError from "./IncorrectTypeError.js";

/**
 * Enum of standard JSON-RPC error codes.
 * @see https://www.jsonrpc.org/specification#error_object
 */
export enum JsonRPCErrorCode {
    /**
     * Invalid JSON was received by the server.
     * An error occurred on the server while parsing the JSON text.
     */
    PARSE_ERROR = -32700,
    /**
     * The JSON sent is not a valid Request object.
     */
    INVALID_REQUEST = -32600,
    /**
     * The method does not exist / is not available.
     */
    METHOD_NOT_FOUND = -32601,
    /**
     * Invalid method parameter(s).
     */
    INVALID_PARAMS = -32602,
    /**
     * Internal JSON-RPC error.
     */
    INTERNAL_ERROR = -32603,
    /**
     * Server error - Reserved for implementation-defined server-errors.
     * Error codes from and including -32099 to -32000 are reserved for server errors.
     */
    SERVER_ERROR_START = -32099,
    SERVER_ERROR_END = -32000,
}

export default class JsonRPCError extends Error {
    /**
     * JSON-RPC error code.
     * @see JsonRPCErrorCode
     */
    readonly code: number;
    /**
     * Additional error data, if any.
     */
    readonly data?: unknown;

    /**
     * @param error
     * @param path
     * @internal
     */
    static parse(error: object, ...path: string[]): JsonRPCError {
        if (!('code' in error)) {
            throw new MissingPropertyError("code", error, ...path);
        }

        if (typeof error.code !== 'number') {
            throw new IncorrectTypeError("number", typeof error.code, error, ...path, "code");
        }

        if (!('message' in error)) {
            throw new MissingPropertyError("message", error, ...path);
        }

        if (typeof error.message !== 'string') {
            throw new IncorrectTypeError("string", typeof error.message, error, ...path, "message");
        }

        return new JsonRPCError(error.code, error.message, 'data' in error ? error.data : undefined);
    }

    /**
     * Format the error message.
     * @param code
     * @param message
     * @param data
     * @internal
     */
    static formatMessage(code: number, message: string, data?: unknown): string {
        let output = message;

        if (typeof data === 'string') {
            output += ": ";

            if (data.startsWith(message)) {
                output = "";
            }

            output += data;
        }


        return `${output} (code: ${code})`;
    }

    /**
     * Create a new JsonRPCError.
     * @param code JSON-RPC error code.
     * @param message Error message.
     * @param data Additional error data, if any.
     */
    constructor(code: number, message: string, data?: unknown) {
        super(JsonRPCError.formatMessage(code, message, data));
        this.code = code;
        this.data = data;
    }
}
