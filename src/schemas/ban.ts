import {Player} from "./player.js";
import IncorrectTypeError from "../error/IncorrectTypeError.js";

/**
 * Base class for all ban related classes.
 */
class Ban {
    /**
     * Reason for the ban.
     */
    reason: string | null;
    /**
     * Source of the ban (effectively a comment field).
     */
    source: string | null;
    /**
     * Expiration date of the ban in ISO 8601 format. If omitted, the ban is permanent.
     * Use {@link setExpires} to set this field using a Date or bigint.
     */
    expires: string | null = null;

    /**
     * @param reason reason for the ban
     * @param source source of the ban
     * @param expires expiration date of the ban as a Date or string in ISO 8601 format. If omitted, the ban is permanent.
     */
    constructor(
        reason: string | null = null,
        source: string | null = null,
        expires: Date | string | null = null,
    ) {
        this.reason = reason;
        this.source = source;
        this.setExpires(expires);
    }

    /**
     * Sets the reason for the ban.
     * @param reason
     */
    setReason(reason: string | null = null): this {
        this.reason = reason;
        return this;
    }

    /**
     * Sets the source of the ban.
     * @param source
     */
    setSource(source: string | null = null): this {
        this.source = source;
        return this;
    }

    /**
     * Sets the expiration date of the ban.
     * @param expires The expiration date as a Date or string in ISO 8601 format.
     */
    setExpires(expires: Date | string | null): this {
        if (expires instanceof Date) {
            if (isNaN(expires.getTime())) {
                throw new Error("Invalid date.");
            }

            expires = expires.toISOString();
        }

        if (typeof expires != "string" && expires !== null) {
            throw new Error("Expires must be a Date, string in ISO 8601 format or null.");
        }

        this.expires = expires?.toString() ?? null;
        return this;
    }

    /**
     * Gets the expiration date of the ban as a Date object.
     * @returns The expiration date as a Date object, or null if the ban is permanent or the date is invalid.
     */
    getExpiresAsDate(): Date | null {
        if (!this.expires) {
            return null;
        }

        const date = new Date(this.expires);
        if (isNaN(date.getTime())) {
            return null;
        }

        return date;
    }

    /**
     * Parse and apply options from a raw response object.
     * @param data Raw object to parse.
     * @param path Path to the data in the original response, used for errors.
     * @param result The original response object, used for errors.
     * @returns The current UserBan instance.
     * @throws {IncorrectTypeError} If the data is not a valid options object.
     * @internal
     */
    parseAndApplyOptions(data: object, result: unknown, ...path: string[]): this {
        if ("reason" in data) {
            if (typeof data.reason !== 'string') {
                throw new IncorrectTypeError("string", typeof data.reason, result, ...path, 'reason');
            }
            this.reason = data.reason;
        }

        if ("source" in data) {
            if (typeof data.source !== 'string') {
                throw new IncorrectTypeError("string", typeof data.source, result, ...path, 'source');
            }
            this.source = data.source;
        }

        if ("expires" in data) {
            if (typeof data.expires !== 'string') {
                throw new IncorrectTypeError("string", typeof data.expires, result, ...path, 'expires');
            }
            this.expires = data.expires;
        }

        return this;
    }
}

/**
 * Request to ban a player by their IP address.
 */
export class IncomingIPBan extends Ban {
    /**
     * IP address to ban.
     */
    ip: string | null = null;
    /**
     * Connected player who should be banned by their IP address.
     */
    player: Player | null = null;

    /**
     * Creates a new IncomingIPBan instance with the specified IP address.
     * @param ip
     */
    static withIp(ip: string): IncomingIPBan {
        return new IncomingIPBan(ip);
    }

    /**
     * Creates a new IncomingIPBan instance for the specified player.
     * If the player is not currently connected to the server, they can't be banned by their IP address.
     * @param player
     */
    static withConnectedPlayer(player: Player): IncomingIPBan {
        return new IncomingIPBan(undefined, player);
    }

    /**
     * @param ip IP address to ban
     * @param player connected player who should be banned by their IP address
     * @param reason reason for the ban
     * @param source source of the ban
     * @param expires expiration date of the ban as a Date or string in ISO 8601 format. If omitted, the ban is permanent.
     * @internal Use {@link withIp} or {@link withConnectedPlayer} and setters instead.
     */
    constructor(
        ip: string | null = null,
        player: Player | null = null,
        reason: string | null = null,
        source: string | null = null,
        expires: Date | string | null = null,
    ) {
        super(reason, source, expires);
        this.ip = ip;
        this.player = player;
    }

    /**
     * Sets the IP address to ban.
     * @param ip
     */
    setIp(ip: string | null = null): this {
        this.ip = ip;
        return this;
    }

    /**
     * Sets the connected player who should be banned by their IP address.
     * @param player
     */
    setPlayer(player: Player | null = null): this {
        this.player = player;
        return this;
    }
}

/**
 * Entry on the IP ban list
 */
export class IPBan extends Ban {
    /**
     * Banned ip address.
     */
    ip: string;

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
        expires: Date | string | null = null,
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

export class UserBan extends Ban {
    /**
     * Player who should be banned.
     */
    player: Player;

    /**
     * @param player the player to ban
     * @param reason reason for the ban
     * @param source source of the ban
     * @param expires expiration date of the ban as a Date or string in ISO 8601 format. If omitted, the ban is permanent.
     */
    constructor(
        player: Player,
        reason: string | null = null,
        source: string | null = null,
        expires: Date | string | null = null,
    ) {
        super(reason, source, expires);
        this.player = player;
    }

    /**
     * Sets the player to ban.
     * @param player
     */
    setPlayer(player: Player): this {
        this.player = player;
        return this;
    }
}
