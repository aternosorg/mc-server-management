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
    constructor(message: Message, overlay: boolean = false, receivingPlayers?: Array<Player>) {
        this.message = message;
        this.overlay = overlay;
        this.receivingPlayers = receivingPlayers;
    }

    /**
     * Sets the message to send.
     * @param message The message to send.
     */
    setMessage(message: Message): this {
        this.message = message;
        return this;
    }

    /**
     * Sets whether to display the message as an overlay above the hotbar (true) or in the chat (false).
     * @param overlay
     */
    setOverlay(overlay: boolean): this {
        this.overlay = overlay;
        return this;
    }

    /**
     * Sets the list of players to receive the message. If omitted, all players will receive the message.
     * @param receivingPlayers
     */
    setReceivingPlayers(receivingPlayers?: Array<Player>): this {
        this.receivingPlayers = receivingPlayers;
        return this;
    }

    /**
     * Adds one or more players to the list of players to receive the message.
     * @param player one or more players to add
     */
    addReceivingPlayer(player: Player | Player[]): this {
        this.receivingPlayers ??= [];
        if (Array.isArray(player)) {
            this.receivingPlayers.push(...player);
        } else {
            this.receivingPlayers.push(player);
        }
        return this;
    }
}
