import Player from "../player/Player";
import Message from "./Message";

export default class SystemMessage {
    /**
     * The message to send.
     */
    message: Message
    /**
     * Whether to display the message as an overlay above the hotbar (true) or in the chat (false).
     */
    overlay: boolean
    /**
     * An optional list of players to receive the message. If omitted, all players will receive the message.
     */
    receivingPlayers?: Array<Player>

    /**
     * Creates a new SystemMessage instance.
     * @param message The message to send.
     * @param overlay Whether to display the message as an overlay above the hotbar (true) or in the chat (false).
     * @param receivingPlayers An optional list of players to receive the message. If omitted, all players will receive the message.
     */
    constructor(message: Message, receivingPlayers?: Array<Player>, overlay: boolean = false) {
        this.message = message;
        this.overlay = overlay;
        this.receivingPlayers = receivingPlayers;
    }
}
