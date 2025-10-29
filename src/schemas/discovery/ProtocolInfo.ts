import IncorrectTypeError from "../../error/IncorrectTypeError";
import MissingPropertyError from "../../error/MissingPropertyError";

/**
 * Information about the server management protocol.
 */
export default class ProtocolInfo {
    /**
     * Name of the protocol.
     */
    readonly title: string;
    /**
     * Version of the protocol.
     */
    readonly version: string;

    /**
     * @param data
     * @param response
     * @param path
     * @internal
     */
    static parse(data: unknown, response: unknown = data, ...path: string[]): ProtocolInfo {
        if (typeof data !== 'object' || data === null) {
            throw new IncorrectTypeError("object", typeof data, response, ...path);
        }

        if (!("title" in data)) {
            throw new MissingPropertyError("title", response, ...path);
        }

        if (typeof data.title !== 'string') {
            throw new IncorrectTypeError("string", typeof data.title, response, ...path, "title");
        }

        if (!("version" in data)) {
            throw new MissingPropertyError("version", response, ...path);
        }

        if (typeof data.version !== 'string') {
            throw new IncorrectTypeError("string", typeof data.version, response, ...path, "version");
        }

        return new ProtocolInfo(data.title, data.version);
    }

    constructor(title: string, version: string) {
        this.title = title;
        this.version = version;
    }
}
