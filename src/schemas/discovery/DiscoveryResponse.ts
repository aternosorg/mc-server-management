import ProtocolInfo from "./ProtocolInfo";
import IncorrectTypeError from "../../error/IncorrectTypeError";
import MissingPropertyError from "../../error/MissingPropertyError";

export default class DiscoveryResponse {
    /**
     * The OpenRPC specification version supported by the server.
     */
    readonly openrpc: string;
    /**
     * Information about the protocol supported by the server.
     */
    readonly info: ProtocolInfo;

    /**
     * @param data
     * @param response
     * @param path
     * @internal
     */
    static parse(data: unknown, response: unknown = data, ...path: string[]): DiscoveryResponse {
        if (typeof data !== 'object' || data === null) {
            throw new IncorrectTypeError("object", typeof data, response, ...path);
        }

        if (!("openrpc" in data)) {
            throw new MissingPropertyError("openrpc", response, ...path);
        }

        if (typeof data.openrpc !== 'string') {
            throw new IncorrectTypeError("string", typeof data.openrpc, response, ...path, "openrpc");
        }

        if (!("info" in data)) {
            throw new MissingPropertyError("info", response, ...path);
        }

        const info = ProtocolInfo.parse(data.info, response, ...path, "info");

        return new DiscoveryResponse(data.openrpc, info);
    }

    constructor(openrpc: string, info: ProtocolInfo) {
        this.openrpc = openrpc;
        this.info = info;
    }
}
