import Player from "../Player";
import IncorrectTypeError from "../../../error/IncorrectTypeError";
import MissingPropertyError from "../../../error/MissingPropertyError";
import Ban from "./Ban";

export default class UserBan extends Ban {
    /**
     * Player who should be banned.
     */
    player: Player;

    /**
     * Parse an UserBan instance from a raw object.
     * @param data Raw object to parse.
     * @param response Full response received from the server, used for errors.
     * @param path Path to the data in the original response, used for errors.
     * @returns Parsed UserBan instance.
     * @throws {IncorrectTypeError} If the data is not a valid UserBan object.
     * @internal
     */
    static parse(data: unknown, response: unknown = data, ...path: string[]): UserBan {
        if (typeof data !== 'object' || data === null) {
            throw new IncorrectTypeError("object", typeof data, response, ...path);
        }

        if (!("player" in data)) {
            throw new MissingPropertyError("player", response, ...path);
        }

        const ban = new UserBan(Player.parse(data.player, response, ...path, "player"));
        return ban.parseAndApplyOptions(data, response, ...path);
    }

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
