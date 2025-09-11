import IncorrectTypeError from "../../error/IncorrectTypeError";
import MissingPropertyError from "../../error/MissingPropertyError";

export default class Version {
    /**
     * Name of the version (e.g., "1.21.9")
     */
    readonly name: string;
    /**
     * Protocol number of the version (e.g., 773 for Minecraft 1.21.9)
     */
    readonly protocol: number;

    /**
     * @param data Data to parse
     * @param response Full response for error context
     * @param path Path to the data in the response for error context
     * @throws {InvalidResponseError}
     * @returns {Version}
     * @internal
     */
    static parse(data: unknown, response: unknown, ...path: string[]): Version {
        if (typeof data !== 'object' || data === null) {
            throw new IncorrectTypeError("object", typeof data, response, ...path);
        }

        if (!("name" in data)) {
            throw new MissingPropertyError("name", data, ...path);
        }

        if (!("protocol" in data)) {
            throw new MissingPropertyError("protocol", response, ...path);
        }

        if (typeof data.name !== 'string') {
            throw new IncorrectTypeError("string", typeof data.name, response, ...path, "name");
        }

        if (typeof data.protocol !== 'number') {
            throw new IncorrectTypeError("number", typeof data.protocol, response, ...path, "protocol");
        }

        return new Version(data.name, data.protocol);
    }

    constructor(name: string, protocol: number) {
        this.name = name;
        this.protocol = protocol;
    }
}
