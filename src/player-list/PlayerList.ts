import type Connection from "../connection/Connection.js";
import IncorrectTypeError from "../error/IncorrectTypeError.js";

export default abstract class PlayerList<ItemType, AddType, RemoveType> {
    #connection: Connection;
    #items?: ItemType[];

    /**
     * Create a player list API wrapper. Use {@link MinecraftServer.allowlist} or similar methods instead.
     * @param connection
     * @internal
     */
    constructor(connection: Connection) {
        this.#connection = connection;
    }

    /**
     * Get the items on the list. If the list is already fetched and force is false, the cached list is returned.
     * @param force Always request the list from the server, even if it was already fetched.
     */
    public async get(force: boolean = false): Promise<ItemType[]> {
        if (!this.#items || force) {
            await this.callAndParse();
        }
        if (!this.#items) {
            throw new Error("Invalid player list.");
        }
        return this.#items;
    }

    /**
     * Overwrite the existing list with a set of entries.
     * This method updates the cached with the resulting list from the server. Use `get()` to retrieve it.
     * @param items
     */
    public set(items: ItemType[]): Promise<this> {
        return this.callAndParse('set', [items]);
    }

    /**
     * Add items to the list.
     * This method updates the cached with the resulting list from the server. Use `get()` to retrieve it.
     * @param items
     */
    public add(items: AddType|AddType[]): Promise<this> {
        if (!Array.isArray(items)) {
            items = [items];
        }
        return this.callAndParse('add', [items]);
    }

    /**
     * Remove items from the list.
     * This method updates the cached with the resulting list from the server. Use `get()` to retrieve it.
     * @param items
     */
    public remove(items: RemoveType|RemoveType[]): Promise<this> {
        if (!Array.isArray(items)) {
            items = [items];
        }
        return this.callAndParse('remove', [items]);
    }

    /**
     * Clear the list.
     * This method updates the cached with the resulting list from the server. Use `get()` to retrieve it.
     */
    public async clear(): Promise<this> {
        const response = await this.call('clear');
        if (response !== true) {
            throw new IncorrectTypeError("true", typeof response, response);
        }
        this.#items = [];
        return this;
    }

    /**
     * Call a method on the player list and return the raw response.
     * @param action Method to call (e.g., 'set', 'add', 'remove', 'clear').
     * @param params Parameters to pass to the method.
     * @returns This PlayerList instance.
     * @protected
     */
    protected async call(action?: string, params: unknown[] = []): Promise<unknown> {
        let method = this.getName();
        if (action) {
            method += "/" + action
        }
        return await this.#connection.call(method, params);
    }

    /**
     * Call a method on the player list. Updates the cached list with the resulting list from the server and returns this.
     * @param action Method to call (e.g., 'set', 'add', 'remove', 'clear').
     * @param params Parameters to pass to the method.
     * @returns This PlayerList instance.
     * @protected
     */
    protected async callAndParse(action?: string, params: unknown[] = []): Promise<this> {
        const result = await this.call(action, params);
        if (!Array.isArray(result)) {
            throw new IncorrectTypeError("array", typeof result, result);
        }

        this.#items = this.parseResult(result);
        return this;
    }

    /**
     * Get the name of the player list for use in API calls.
     * E.g., 'minecraft:allowlist' or 'minecraft:ip_bans'.
     * @protected
     */
    protected abstract getName(): string;

    /**
     * Parse the result from the server.
     * @param result
     * @protected
     */
    protected abstract parseResult(result: unknown[]): ItemType[];
}
