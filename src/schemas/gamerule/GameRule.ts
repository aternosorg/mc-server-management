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
}


