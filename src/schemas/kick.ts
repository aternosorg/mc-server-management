import {Player} from "./player.js";
import {Message} from "./message.js";

/**
 * Request to kick a player
 */
export class KickPlayer {
    /**
     * Players to kick.
     */
    players: Array<Player>;
    /**
     * Message displayed to the player when they are kicked.
     */
    message?: Message;

    /**
     * @param players players to kick
     * @param message message displayed to the player when they are kicked
     */
    constructor(players: Array<Player>, message?: Message) {
        this.players = players;
        this.message = message;
    }

    /**
     * Add a player to the list of players to kick.
     * @param player
     */
    addPlayer(player: Player): this {
        this.players.push(player);
        return this;
    }

    /**
     * Set list of players to kick.
     * @param players
     */
    setPlayers(players: Array<Player>): this {
        this.players = players;
        return this;
    }

    /**
     * Sets the message displayed to the player when they are kicked.
     * @param message
     */
    setMessage(message?: Message): this {
        this.message = message;
        return this;
    }
}
