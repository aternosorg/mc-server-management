import JsonRPCError from "../error/JsonRPCError.js";
import {EventEmitter} from "eventemitter3";
import ConnectionEventData from "./ConnectionEventData";
import InvalidResponseError from "../error/InvalidResponseError";
import DiscoveryFailedError from "../error/DiscoveryFailedError";
import DiscoveryResponse from "../schemas/discovery/DiscoveryResponse";
import * as semver from "semver";

export type SuccessfulCallResponse = { success: true, data: unknown };
export type FailedCallResponse = { success: false, error: unknown };
export type CallResponse = SuccessfulCallResponse | FailedCallResponse;

/**
 * Library independent connection interface.
 * Can be used to proxy calls to different libraries or through intermediate APIs.
 */
export default abstract class Connection extends EventEmitter<ConnectionEventData> {
    #discovery?: DiscoveryResponse;

    constructor() {
        super();
        this.on('open', this.#discoverCapabilities);
    }

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

    /**
     * Discover the server capabilities. This method is cached and automatically called when a new connection is opened.
     * @returns A promise that resolves to the discovery response.
     */
    public async discover(): Promise<DiscoveryResponse> {
        if (!this.#discovery) {
            return this.#discover();
        }

        return this.#discovery;
    }

    async #discoverCapabilities() {
        try {
            const response = await this.#discover();
            if (!semver.satisfies(response.info.version, "^1 || ^2")) {
                console.warn("Warning: The server you're connecting to provides server management protocol version " +
                    response.info.version + ". This version is not supported by mc-server-management, some features " +
                    "may not work as expected.");
            }
        } catch (e) {
            let error = new DiscoveryFailedError({cause: e});
            if (!this.emit("error", error)) {
                console.error("Unhandled discovery error:", error);
            }
        }
    }

    async #discover(): Promise<DiscoveryResponse> {
        const response = await this.call("rpc.discover", []);
        this.#discovery = DiscoveryResponse.parse(response, response);
        return this.#discovery;
    }
}
