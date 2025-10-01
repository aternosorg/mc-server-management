import JsonRPCError from "../error/JsonRPCError.js";
import {EventEmitter} from "eventemitter3";
import ConnectionEventData from "./ConnectionEventData";
import InvalidResponseError from "../error/InvalidResponseError";

export type SuccessfulCallResponse = {success: true, data: unknown};
export type FailedCallResponse = {success: false, error: unknown};
export type CallResponse = SuccessfulCallResponse | FailedCallResponse;

/**
 * Library independent connection interface.
 * Can be used to proxy calls to different libraries or through intermediate APIs.
 */
export default abstract class Connection extends EventEmitter<ConnectionEventData> {
    /**
     * Call a method on the server with the given parameters.
     * @param method The method name to call.
     * @param parameters The parameters to pass to the method.
     * @returns A promise that resolves to the result of the method call.
     */
    protected abstract callRaw(method: string, parameters: object | Array<unknown>): Promise<CallResponse>;

    /**
     * Call a method on the server with the given parameters. If an error occurs, it throws an error.
     * @param method The method name to call.
     * @param parameters The parameters to pass to the method.
     * @returns A promise that resolves to the result of the method call.
     * @throws JsonRPCError if the server returns an error.
     */
    public async call(method: string, parameters: object | Array<unknown>): Promise<unknown> {
        const response = await this.callRaw(method, parameters);
        if (response.success) {
            return response.data;
        }

        let error = response.error;
        if (typeof error === "object" && error) {
            try {
                error = JsonRPCError.parse(error, "error");
            } catch (e) {
                if (!(e instanceof InvalidResponseError)) {
                    throw e;
                }
            }
        }

        throw error;
    }

    /**
     * Close the connection.
     */
    public abstract close(): void;
}
