export default class Message {
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
     * Add parameters for the translated message.
     * @param params one or more parameters to add
     */
    addTranslatableParam(params: string | string[]): this {
        this.translatableParams ??= [];
        if (Array.isArray(params)) {
            this.translatableParams.push(...params);
        } else {
            this.translatableParams.push(params);
        }
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

