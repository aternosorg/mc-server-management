import IncomingIPBan, {IncomingIPBanInput} from "../schemas/player/ban/IncomingIPBan";
import IPBan, {IPBanInput} from "../schemas/player/ban/IPBan";
import {fromItemOrArray, ItemOrArray} from "../util";
import PlayerList from "./PlayerList";
import {BanExpiryInput} from "../schemas/player/ban/Ban";

export default class IPBanList extends PlayerList<IPBan> {
    /**
     * Overwrite the existing list with a set of entries.
     * This method updates the cached with the resulting list from the server. Use `get()` to retrieve it.
     * @param items
     * @param reason Default reason if input is not an IPBan
     * @param source Default source if input is not an IPBan
     * @param expires Default expiry if input is not an IPBan
     */
    public set(
        items: IPBanInput[],
        reason: string | null = null,
        source: string | null = null,
        expires: BanExpiryInput = null,
    ): Promise<this> {
        return this.callAndParse('set', [
            items.map((input) => IPBan.fromInput(input, reason, source, expires))
        ]);
    }

    /**
     * Ban IP addresses.
     * This method updates the cached with the resulting list from the server. Use `get()` to retrieve it.
     * @param items list of ip addresses as strings, IncomingIPBan objects or Player objects of connected players
     * @param reason Default reason if input is not an IncomingIPBan
     * @param source Default source if input is not an IncomingIPBan
     * @param expires Default expiry if input is not an IncomingIPBan
     */
    public add(
        items: ItemOrArray<IncomingIPBanInput>,
        reason: string | null = null,
        source: string | null = null,
        expires: BanExpiryInput = null,
    ): Promise<this> {
        return this.callAndParse('add', [fromItemOrArray(items).map(i => IncomingIPBan.fromInput(i, reason, source, expires))]);
    }

    /**
     * Unban IP addresses.
     * This method updates the cached with the resulting list from the server. Use `get()` to retrieve it.
     * @param ips list of IP addresses as strings
     */
    public remove(ips: ItemOrArray<string>): Promise<this> {
        return this.callAndParse('remove', [fromItemOrArray(ips)]);
    }

    protected getName(): string {
        return 'minecraft:ip_bans';
    }

    protected parseResult(result: unknown[]): IPBan[] {
        const bans: IPBan[] = [];
        for (const [index, entry] of result.entries()) {
            bans.push(IPBan.parse(entry, result, index.toString()))
        }
        return bans;
    }
}
