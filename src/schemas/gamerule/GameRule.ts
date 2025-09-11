export default class GameRule<T> {
    /**
     * Key of the game rule (e.g., "doDaylightCycle", "maxEntityCramming").
     */
    key: string;
    /**
     * Value of the game rule.
     */
    value: T;

    constructor(key: string, value: T) {
        this.key = key;
        this.value = value;
    }

    /**
     * Sets the type of the game rule.
     * @param key
     */
    setKey(key: string): this {
        this.key = key;
        return this;
    }

    /**
     * Sets the value of the game rule. Must match the type of the game rule.
     * @param value
     */
    setValue(value: T): this {
        this.value = value;
        return this;
    }
}


