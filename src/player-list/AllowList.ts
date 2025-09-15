import Player, {PlayerInput} from "../schemas/player/Player";
import PlayerList from "./PlayerList";
import {fromItemOrArray, ItemOrArray} from "../util";

export default class AllowList extends PlayerList<Player> {
    /**
     * Overwrite the existing allowlist with a set of players.
     * This method updates the cached with the resulting list from the server. Use `get()` to retrieve it.
     * @param items list of strings (player names) or Player objects
     */
    async set(items: PlayerInput[]): Promise<this> {
        return this.callAndParse('set', [fromItemOrArray(items).map(Player.fromInput)]);
    }

    /**
     * Add players to the allowlist.
     * This method updates the cached with the resulting list from the server. Use `get()` to retrieve it.
     * @param items list of strings (player names) or Player objects
     */
    async add(items: ItemOrArray<PlayerInput>): Promise<this> {
        return this.callAndParse('add', [fromItemOrArray(items).map(Player.fromInput)]);
    }

    /**
     * Remove players from the allowlist.
     * This method updates the cached with the resulting list from the server. Use `get()` to retrieve it.
     * @param items list of strings (player names) or Player objects
     */
    async remove(items: ItemOrArray<PlayerInput>): Promise<this> {
        return this.callAndParse('remove', [fromItemOrArray(items).map(Player.fromInput)]);
    }

    protected getName(): string {
        return 'minecraft:allowlist';
    }

    protected parseResult(result: unknown[]): Player[] {
        return Player.parseList(result);
    }
}
