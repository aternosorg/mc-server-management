import Player from "./Player";
import Message from "../message/Message";

/**
 * Request to kick a player
 */
export default class KickPlayer {
    /**
     * Players to kick.
     */
    player: Player;
    /**
     * Message displayed to the player when they are kicked.
     */
    message?: Message;

    /**
     * @param player players to kick
     * @param message message displayed to the player when they are kicked
     */
    constructor(player: Player, message?: Message) {
        this.player = player;
        this.message = message;
    }
}
