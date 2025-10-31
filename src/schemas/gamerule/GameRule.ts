export default class GameRule<T> {
    /**
     * Key of the game rule (e.g., "minecraft:advance_time", "minecraft:max_entity_cramming").
     * On 1.21.10 or older the names are camelCase and there's no minecraft: prefix (e.g. "doDaylightCycle", "maxEntityCramming").
     * @see {MinecraftServer#hasGameRuleRegistry()}
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


