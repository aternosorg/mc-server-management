import {Player} from "./player.js";

/**
 * Base class for all ban related classes.
 */
class Ban {
    /**
     * Reason for the ban.
     */
    reason?: string;
    /**
     * Source of the ban (effectively a comment field).
     */
    source?: string;
    /**
     * Expiration date of the ban in ISO 8601 format. If omitted, the ban is permanent.
     * Use {@link Ban.setExpires} to set this field using a Date or bigint.
     */
    expires?: string;

    /**
     * @param reason reason for the ban
     * @param source source of the ban
     * @param expires expiration date of the ban as a Date or string in ISO 8601 format. If omitted, the ban is permanent.
     */
    constructor(reason?: string, source?: string, expires?: Date|string) {
        this.reason = reason;
        this.source = source;
        if (expires !== undefined && expires !== null) {
            this.setExpires(expires);
        }
    }

    /**
     * Sets the reason for the ban.
     * @param reason
     */
    setReason(reason?: string): this {
        this.reason = reason;
        return this;
    }

    /**
     * Sets the source of the ban.
     * @param source
     */
    setSource(source?: string): this {
        this.source = source;
        return this;
    }

    /**
     * Sets the expiration date of the ban.
     * @param expires The expiration date as a Date or string in ISO 8601 format.
     */
    setExpires(expires?: Date|string): this {
        if (expires instanceof Date) {
            if (isNaN(expires.getTime())) {
                throw new Error("Invalid date.");
            }

            expires = expires.toISOString();
        }

        if (!["undefined", "null", "string"].includes(typeof expires)) {
            throw new Error("Expires must be a Date, string in ISO 8601 format, null or undefined.");
        }

        this.expires = expires?.toString();
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
}

/**
 * Request to ban a player by their IP address.
 */
export class IncomingIPBan extends Ban {
    /**
     * IP address to ban.
     */
    ip?: string;
    /**
     * Active player who should be banned by their IP address.
     */
    player?: Player;

    /**
     * @param ip IP address to ban
     * @param player active player who should be banned by their IP address
     * @param reason reason for the ban
     * @param source source of the ban
     * @param expires expiration date of the ban as a Date or string in ISO 8601 format. If omitted, the ban is permanent.
     */
    constructor(ip?: string, player?: Player, reason?: string, source?: string, expires?: Date|string) {
        super(reason, source, expires);
        this.ip = ip;
        this.player = player;
    }

    /**
     * Sets the IP address to ban.
     * @param ip
     */
    setIp(ip?: string): this {
        this.ip = ip;
        return this;
    }

    /**
     * Sets the active player who should be banned by their IP address.
     * @param player
     */
    setPlayer(player?: Player): this {
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
    constructor(ip: string, reason?: string, source?: string, expires?: Date|string) {
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
     * Active player who should be banned by their IP address.
     */
    player: Player;

    /**
     * @param player the player to ban
     * @param reason reason for the ban
     * @param source source of the ban
     * @param expires expiration date of the ban as a Date or string in ISO 8601 format. If omitted, the ban is permanent.
     */
    constructor(player: Player, reason?: string, source?: string, expires?: Date|string) {
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
