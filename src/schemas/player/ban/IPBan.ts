import IncorrectTypeError from "../../../error/IncorrectTypeError";
import MissingPropertyError from "../../../error/MissingPropertyError";
import Ban, {BanExpiryInput} from "./Ban";

export type IPBanInput = IPBan | string;

/**
 * Entry on the IP ban list
 */
export default class IPBan extends Ban {
    /**
     * Banned ip address.
     */
    ip: string;

    /**
     * Creates a IPBan instance from a IPBanInput.
     * @param input
     * @param reason Default reason if input is not an IPBan
     * @param source Default source if input is not an IPBan
     * @param expires Default expiry if input is not an IPBan
     * @internal
     */
    static fromInput(
        input: IPBanInput,
        reason: string | null,
        source: string | null,
        expires: BanExpiryInput,
        ): IPBan {
        if (input instanceof IPBan) {
            return input;
        }

        return new IPBan(input, reason, source, expires);
    }

    /**
     * Parse an IPBan instance from a raw object.
     * @param data Raw object to parse.
     * @param response Full response received from the server, used for errors.
     * @param path Path to the data in the original response, used for errors.
     * @returns Parsed IPBan instance.
     * @throws {IncorrectTypeError} If the data is not a valid IPBan object.
     * @internal
     */
    static parse(data: unknown, response: unknown = data, ...path: string[]): IPBan {
        if (typeof data !== 'object' || data === null) {
            throw new IncorrectTypeError("object", typeof data, response, ...path);
        }

        if (!("ip" in data)) {
            throw new MissingPropertyError("ip", response, ...path);
        }

        if (typeof data.ip !== 'string') {
            throw new IncorrectTypeError("string", typeof data.ip, response, ...path, `ip`);
        }

        return new IPBan(data.ip).parseAndApplyOptions(data, response, ...path);
    }

    /**
     * @param ip banned IP address
     * @param reason reason for the ban
     * @param source source of the ban
     * @param expires expiration date of the ban as a Date or string in ISO 8601 format. If omitted, the ban is permanent.
     */
    constructor(
        ip: string,
        reason: string | null = null,
        source: string | null = null,
        expires: BanExpiryInput = null,
    ) {
        super(reason, source, expires);
        this.ip = ip;
    }

    /**
     * Sets the banned IP address.
     * @param ip
     */
    setIp(ip: string): this {
        this.ip = ip;
        return this;
    }
}
