import Player from "../Player";
import Ban from "./Ban";

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
