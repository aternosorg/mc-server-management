import Player, {PlayerInput} from "../schemas/player/Player";
import UserBan, {UserBanInput} from "../schemas/player/ban/UserBan";
import {fromItemOrArray, ItemOrArray} from "../util";
import PlayerList from "./PlayerList";
import {BanExpiryInput} from "../schemas/player/ban/Ban";

export default class BanList extends PlayerList<UserBan> {
    /**
     * Overwrite the existing list with a set of entries.
     * This method updates the cached with the resulting list from the server. Use `get()` to retrieve it.
     * @param items list of strings (player names), Player objects or UserBan objects
     * @param reason Default reason if input is not a UserBan
     * @param source Default source if input is not a UserBan
     * @param expires Default expiry if input is not a UserBan
     */
    public set(
        items: UserBanInput[],
        reason: string | null = null,
        source: string | null = null,
        expires: BanExpiryInput = null,
    ): Promise<this> {
        return this.callAndParse('set', [this.fromInputs(items, reason, source, expires)]);
    }

    /**
     * Add items to the list.
     * This method updates the cached with the resulting list from the server. Use `get()` to retrieve it.
     * @param items list of strings (player names), Player objects or UserBan objects
     * @param reason Default reason if input is not a UserBan
     * @param source Default source if input is not a UserBan
     * @param expires Default expiry if input is not a UserBan
     */
    public add(
        items: ItemOrArray<UserBanInput>,
        reason: string | null = null,
        source: string | null = null,
        expires: BanExpiryInput = null,
    ): Promise<this> {
        return this.callAndParse('add', [this.fromInputs(items, reason, source, expires)]);
    }

    /**
     * Remove items from the list.
     * This method updates the cached with the resulting list from the server. Use `get()` to retrieve it.
     * @param items list of strings (player names) or Player objects
     */
    public remove(items: ItemOrArray<PlayerInput>): Promise<this> {
        return this.callAndParse('remove', [fromItemOrArray(items).map(Player.fromInput)]);
    }

    protected getName(): string {
        return 'minecraft:bans';
    }

    protected parseResult(result: unknown[]): UserBan[] {
        const bans: UserBan[] = [];
        for (const [index, entry] of result.entries()) {
            bans.push(UserBan.parse(entry, result, index.toString()));
        }
        return bans;
    }

    /**
     * Convert input list or item to UserBan instances.
     * @param inputs input list or item
     * @param reason Default reason if input is not a UserBan
     * @param source Default source if input is not a UserBan
     * @param expires Default expiry if input is not a UserBan
     * @protected
     */
    protected fromInputs(
        inputs: ItemOrArray<UserBanInput>,
        reason: string | null,
        source: string | null,
        expires: BanExpiryInput,
    ): UserBan[] {
        return fromItemOrArray(inputs).map((input) => UserBan.fromInput(input, reason, source, expires));
    }
}
