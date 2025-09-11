import IncorrectTypeError from "../../error/IncorrectTypeError";
import MissingPropertyError from "../../error/MissingPropertyError";
import Player from "./Player";

export default class Operator {
    /**
     * The player who is being made an operator.
     */
    player: Player;
    /**
     * Which permissions level the operator has.
     */
    permissionLevel?: number;
    /**
     * Whether the operator bypasses the player limit.
     */
    bypassesPlayerLimit?: boolean;

    /**
     * Parse an Operator instance from a raw object.
     * @param data Raw object to parse.
     * @param response Full response received from the server, used for errors.
     * @param path Path to the data in the original response, used for errors.
     * @returns Parsed Operator instance.
     * @throws {IncorrectTypeError} If the data is not a valid Operator object.
     * @internal
     */
    static parse(data: unknown, response: unknown = data, ...path: string[]): Operator {
        if (typeof data !== 'object' || data === null) {
            throw new IncorrectTypeError("object", typeof data, response, ...path);
        }

        if (!("player" in data)) {
            throw new MissingPropertyError("player", response, ...path);
        }

        const operator = new Operator(Player.parse(data.player, response, ...path, "player"));
        if ("permissionLevel" in data) {
            if (typeof data.permissionLevel !== 'number') {
                throw new IncorrectTypeError(
                    "number",
                    typeof data.permissionLevel,
                    response,
                    ...path,
                    'permissionLevel'
                );
            }
            operator.permissionLevel = data.permissionLevel;
        }

        if ("bypassesPlayerLimit" in data) {
            if (typeof data.bypassesPlayerLimit !== 'boolean') {
                throw new IncorrectTypeError(
                    "boolean",
                    typeof data.bypassesPlayerLimit,
                    response,
                    ...path,
                    'bypassesPlayerLimit',
                );
            }
            operator.bypassesPlayerLimit = data.bypassesPlayerLimit;
        }

        return operator;
    }

    /**
     * @param player The player who is being made an operator.
     * @param permissionLevel Which permissions level the operator has.
     * @param bypassesPlayerLimit Whether the operator bypasses the player limit.
     */
    constructor(player: Player, permissionLevel?: number, bypassesPlayerLimit?: boolean) {
        this.player = player;
        this.permissionLevel = permissionLevel;
        this.bypassesPlayerLimit = bypassesPlayerLimit;
    }

    /**
     * Sets the player who is being made an operator.
     * @param player
     */
    setPlayer(player: Player): this {
        this.player = player;
        return this;
    }

    /**
     * Sets which permissions level the operator has.
     * @param permissionLevel
     */
    setPermissionLevel(permissionLevel?: number): this {
        this.permissionLevel = permissionLevel;
        return this;
    }

    /**
     * Sets whether the operator bypasses the player limit.
     * @param bypassesPlayerLimit
     */
    setBypassesPlayerLimit(bypassesPlayerLimit?: boolean): this {
        this.bypassesPlayerLimit = bypassesPlayerLimit;
        return this;
    }
}
