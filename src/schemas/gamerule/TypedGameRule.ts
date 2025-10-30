import GameRuleType from "./GameRuleType";
import IncorrectTypeError from "../../error/IncorrectTypeError";
import MissingPropertyError from "../../error/MissingPropertyError";
import GameRule from "./GameRule";
import UnknownEnumVariantError from "../../error/UnknownEnumVariantError";

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

        if (typeof data.type !== 'string') {
            throw new IncorrectTypeError("string", typeof data.type, result, ...path, 'type');
        }

        if (!Object.values(GameRuleType).includes(data.type as GameRuleType)) {
            throw new UnknownEnumVariantError("GameRuleType", data.type as string, result, ...path, 'type');
        }

        let value = this.parseValue(data.type as GameRuleType, data.value, result, ...path, 'value');

        return new TypedGameRule(data.type as GameRuleType, data.key, value);
    }

    /**
     * @internal
     */
    static parseValue(type: GameRuleType, value: unknown, result: unknown, ...path: string[]): GameRuleValue<GameRuleType> {
        switch (type) {
            case GameRuleType.BOOLEAN:
                if (value === 'true' || value === true) {
                    return true;
                } else if (value === 'false' || value === false) {
                    return false;
                }
                throw new IncorrectTypeError("string|boolean", typeof value, result, ...path);
            case GameRuleType.INTEGER:
                if (typeof value === 'number' && Number.isInteger(value)) {
                    return value;
                }

                if (typeof value !== 'string') {
                    throw new IncorrectTypeError("string|integer", typeof value, result, ...path);
                }

                const parsed = Number(value);
                if (Number.isInteger(parsed)) {
                    return parsed;
                }
                throw new IncorrectTypeError("string|integer", typeof value, result, ...path);
        }
    }

    /**
     * @param type Type of the game rule.
     * @param key Key of the game rule (e.g., "minecraft:advance_time", "maxEntityCramming").
     * @param value Value of the game rule. Must match the type of the game rule.
     */
    constructor(type: T, key: string, value: GameRuleValue<T>) {
        super(key, value);
        this.type = type;
    }
}
