import Player from "../Player";
import Ban, {BanExpiryInput} from "./Ban";

/**
 * A IncomingIPBan object or an IP address or a connected Player.
 */
export type IncomingIPBanInput = IncomingIPBan | string | Player;

/**
 * Request to ban a player by their IP address.
 */
export default class IncomingIPBan extends Ban {
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
     * Creates a IncomingIPBan instance from a IPBanInput.
     * @param input
     * @param reason Default reason if input is not an IncomingIPBan
     * @param source Default source if input is not an IncomingIPBan
     * @param expires Default expiry if input is not an IncomingIPBan
     * @internal
     */
    static fromInput(
        input: IncomingIPBanInput,
        reason: string | null,
        source: string | null,
        expires: BanExpiryInput,
    ): IncomingIPBan {
        if (input instanceof IncomingIPBan) {
            return input;
        }

        return (typeof input === "string" ? IncomingIPBan.withIp(input) : IncomingIPBan.withConnectedPlayer(input))
            .setReason(reason)
            .setSource(source)
            .setExpires(expires);
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
        expires: BanExpiryInput = null,
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
