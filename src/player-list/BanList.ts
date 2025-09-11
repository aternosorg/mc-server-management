import PlayerList from "./PlayerList.js";
import Player from "../schemas/player/Player";
import UserBan from "../schemas/player/ban/UserBan";

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
