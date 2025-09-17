import JsonRPCError from "../error/JsonRPCError.js";
import {EventEmitter} from "eventemitter3";
import EventData from "../server/EventData";
import {LEGACY_NOTIFICATION_PREFIX, MODERN_NOTIFICATION_PREFIX} from "../util";
import ConnectionEventData from "./ConnectionEventData";

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
    protected abstract callRaw(method: string, parameters: object | Array<unknown>): Promise<unknown>;

    /**
     * Call a method on the server with the given parameters. If an error occurs, it throws an error.
     * @param method The method name to call.
     * @param parameters The parameters to pass to the method.
     * @returns A promise that resolves to the result of the method call.
     * @throws JsonRPCError if the server returns an error.
     */
    public async call(method: string, parameters: object | Array<unknown>): Promise<unknown> {
        const data = await this.callRaw(method, parameters);
        if (typeof data === 'object' && data && 'error' in data && typeof data.error === 'object' && data.error) {
            throw JsonRPCError.parse(data.error, "error");
        }
        return data;
    }

    /**
     * Close the connection.
     */
    public abstract close(): void;

    emit<T extends EventEmitter.EventNames<ConnectionEventData>>(
        event: T,
        ...args: EventEmitter.EventArgs<ConnectionEventData, T>
    ): boolean {
        let result = super.emit(event, ...args);
        if (event.startsWith(LEGACY_NOTIFICATION_PREFIX)) {
            if (super.emit(
                event.replace(LEGACY_NOTIFICATION_PREFIX, MODERN_NOTIFICATION_PREFIX) as keyof EventData,
                ...args as EventEmitter.EventArgs<ConnectionEventData, T>
            )) {
                result = true;
            }
        }

        return result;
    }
}
