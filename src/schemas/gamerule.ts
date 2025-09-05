export enum GameRuleType {
    BOOLEAN = "boolean",
    INTEGER = "integer",
}

export class GameRule<T> {
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

export class UntypedGameRule extends GameRule<string> {

}

type GameRuleValue<T extends GameRuleType> =
    T extends GameRuleType.BOOLEAN ? boolean : number;

export class TypedGameRule<T extends GameRuleType> extends GameRule<GameRuleValue<T>> {
    /**
     * Type of the game rule.
     * @see GameRuleType
     */
    type: T;

    /**
     * @param type Type of the game rule.
     * @param key Key of the game rule (e.g., "doDaylightCycle", "maxEntityCramming").
     * @param value Value of the game rule. Must match the type of the game rule.
     */
    constructor(type: T, key: string, value: GameRuleValue<T>) {
        super(key, value);
        this.type = type;
    }
}
