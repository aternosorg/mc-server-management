export class Player {
    /**
     * Unique identifier of the player (UUID format).
     */
    id?: string;
    /**
     * Username of the player.
     */
    name?: string;

    /**
     * Creates a Player instance with the specified UUID.
     * @param id
     */
    static withId(id: string): Player {
        return new Player().setId(id);
    }

    /**
     * Creates a Player instance with the specified username.
     * @param name
     */
    static withName(name: string): Player {
        return new Player().setName(name);
    }

    /**
     * @param id Unique identifier of the player (UUID format).
     * @param name Username of the player.
     * @internal Use static methods {@link withId} or {@link withName} to create instances.
     */
    constructor(id?: string, name?: string) {
        this.id = id;
        this.name = name;
    }

    /**
     * Sets the unique identifier of the player.
     * @param id
     */
    setId(id?: string): this {
        this.id = id;
        return this;
    }

    /**
     * Sets the username of the player.
     * @param name
     */
    setName(name?: string): this {
        this.name = name;
        return this;
    }
}

export class Operator {
    /**
     * The player who is being made an operator.
     */
    player: Player;
    /**
     * Which permissions level the operator has.
     */
    permissionLevel?: number;
    /**
     * Whether the operator bypasses the player limit.
     */
    bypassesPlayerLimit?: boolean;

    /**
     * @param player The player who is being made an operator.
     * @param permissionLevel Which permissions level the operator has.
     * @param bypassesPlayerLimit Whether the operator bypasses the player limit.
     */
    constructor(player: Player, permissionLevel?: number, bypassesPlayerLimit?: boolean) {
        this.player = player;
        this.permissionLevel = permissionLevel;
        this.bypassesPlayerLimit = bypassesPlayerLimit;
    }

    /**
     * Sets the player who is being made an operator.
     * @param player
     */
    setPlayer(player: Player): this {
        this.player = player;
        return this;
    }

    /**
     * Sets which permissions level the operator has.
     * @param permissionLevel
     */
    setPermissionLevel(permissionLevel?: number): this {
        this.permissionLevel = permissionLevel;
        return this;
    }

    /**
     * Sets whether the operator bypasses the player limit.
     * @param bypassesPlayerLimit
     */
    setBypassesPlayerLimit(bypassesPlayerLimit?: boolean): this {
        this.bypassesPlayerLimit = bypassesPlayerLimit;
        return this;
    }
}
