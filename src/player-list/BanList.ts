import PlayerList from "./PlayerList.js";
import {UserBan} from "../schemas/ban.js";
import {Player} from "../schemas/player.js";

export default class BanList extends PlayerList<UserBan, UserBan, Player> {
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
}
