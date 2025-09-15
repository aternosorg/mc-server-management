import IncorrectTypeError from "../../../error/IncorrectTypeError";

export type BanExpiryInput = Date | string | null;

/**
 * Base class for all ban related classes.
 */
export default class Ban {
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
        expires: BanExpiryInput = null,
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
    setExpires(expires: BanExpiryInput): this {
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

