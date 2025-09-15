import type Connection from "../connection/Connection.js";
import IncorrectTypeError from "../error/IncorrectTypeError.js";

export default abstract class PlayerList<ItemType> {
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
     * Clear the list.
     * This method updates the cached with the resulting list from the server. Use `get()` to retrieve it.
     */
    public async clear(): Promise<this> {
        return this.callAndParse('clear', []);
    }

    /**
     * Add an item to the cached list. Does not update the server.
     * @param item
     * @internal
     */
    public addItem(item: ItemType): this {
        this.#items?.push(item);
        return this;
    }

    /**
     * Remove all items matching this callback from the cached list. Does not update the server.
     * If the cached list is not available, this method does nothing.
     * @param filter
     * @internal
     */
    public removeMatching(filter: (item: ItemType) => boolean): this {
        if (!this.#items) {
            return this;
        }

        this.#items = this.#items.filter(item => !filter(item));
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
