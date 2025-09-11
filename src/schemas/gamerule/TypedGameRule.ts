import GameRuleType from "./GameRuleType";
import IncorrectTypeError from "../../error/IncorrectTypeError";
import MissingPropertyError from "../../error/MissingPropertyError";
import GameRule from "./GameRule";

type GameRuleValue<T extends GameRuleType> =
    T extends GameRuleType.BOOLEAN ? boolean : number;

export default class TypedGameRule<T extends GameRuleType> extends GameRule<GameRuleValue<T>> {
    /**
     * Type of the game rule.
     * @see GameRuleType
     */
    type: T;

    /**
     * @param data
     * @param result
     * @param path
     * @internal
     */
    static parse(data: unknown, result: unknown = data, ...path: string[]): TypedGameRule<GameRuleType> {
        if (typeof data !== 'object' || data === null) {
            throw new IncorrectTypeError("object", typeof data, result, ...path);
        }

        if (!('key' in data)) {
            throw new MissingPropertyError("key", result, ...path);
        }

        if (!('value' in data)) {
            throw new MissingPropertyError("value", result, ...path);
        }

        if (!('type' in data)) {
            throw new MissingPropertyError("type", result, ...path);
        }

        if (typeof data.key !== 'string') {
            throw new IncorrectTypeError("string", typeof data.key, result, ...path, 'key');
        }

        if (typeof data.value !== 'string') {
            throw new IncorrectTypeError("string", typeof data.value, result, ...path, 'value');
        }

        if (typeof data.type !== 'string') {
            throw new IncorrectTypeError("string", typeof data.type, result, ...path, 'type');
        }

        return new TypedGameRule(data.type as GameRuleType, data.key, JSON.parse(data.value))
    }

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
