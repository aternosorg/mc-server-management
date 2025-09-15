import Player from "./Player";
import Message from "../message/Message";

/**
 * Request to kick a player
 */
export default class KickPlayer {
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
    constructor(players: Player[] = [], message?: Message) {
        this.players = players;
        this.message = message;
    }
}
