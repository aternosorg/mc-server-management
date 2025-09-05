import {Player} from "./player.js";

export class Message {
    /**
     * Literal message to send (non-translatable).
     */
    literal?: string;
    /**
     * Translatable message key (e.g. "chat.type.text")
     */
    translatable?: string;
    /**
     * Parameters for the translated message (if any).
     */
    translatableParams?: Array<string>;

    /**
     * Create a literal message.
     * @param literal
     */
    static literal(literal: string): Message {
        return new Message().setLiteral(literal);
    }

    /**
     * Create a translatable message with optional parameters.
     * @param translatable translatable message key
     * @param translatableParams optional parameters for the translated message
     */
    static translatable(translatable: string, translatableParams: Array<string> = []): Message {
        return new Message()
            .setTranslatable(translatable)
            .setTranslatableParams(translatableParams);
    }

    /**
     * Creates a new Message instance.
     * @param literal
     * @param translatable
     * @param translatableParams
     * @internal Use static methods {@link Message.literal()} or {@link Message.translatable()} instead.
     */
    constructor(literal?: string, translatable?: string, translatableParams?: Array<string>) {
        this.literal = literal;
        this.translatable = translatable;
        this.translatableParams = translatableParams;
    }

    /**
     * Sets the literal message.
     * @param literal
     */
    setLiteral(literal?: string): this {
        this.literal = literal;
        return this;
    }

    /**
     * Set the translatable message key.
     * @param translatable
     */
    setTranslatable(translatable?: string): this {
        this.translatable = translatable
        return this;
    }

    /**
     * Add a parameter for the translated message.
     * @param param
     */
    addTranslatableParam(param: string): this {
        this.translatableParams ??= [];
        this.translatableParams.push(param);
        return this;
    }

    /**
     * Set the parameters for the translated message.
     * @param translatableParams
     */
    setTranslatableParams(translatableParams?: Array<string>): this {
        this.translatableParams = translatableParams;
        return this;
    }
}

export class SystemMessage {
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
}
