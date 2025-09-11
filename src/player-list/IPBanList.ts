import PlayerList from "./PlayerList.js";
import IncomingIPBan from "../schemas/player/ban/IncomingIPBan";
import IPBan from "../schemas/player/ban/IPBan";

export default class IPBanList extends PlayerList<IPBan, IncomingIPBan, string> {
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
