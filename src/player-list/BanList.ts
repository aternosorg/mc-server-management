import PlayerList from "./PlayerList.js";
import {UserBan} from "../schemas/ban.js";
import IncorrectTypeError from "../error/IncorrectTypeError.js";
import {Player} from "../schemas/player.js";
import MissingPropertyError from "../error/MissingPropertyError.js";

export default class IPBanList extends PlayerList<UserBan, UserBan, Player> {
    protected getName(): string {
        return 'minecraft:bans';
    }

    protected parseResult(result: unknown[]): UserBan[] {
        const bans: UserBan[] = [];
        for (const [index, entry] of result.entries()) {
            if (typeof entry !== 'object' || entry === null) {
                throw new IncorrectTypeError("object", typeof entry, result, index.toString());
            }

            if (!("player" in entry)) {
                throw new MissingPropertyError("player", result, index.toString());
            }

            const ban = new UserBan(Player.parse(entry.player, result, index.toString(), "player"));
            ban.parseAndApplyOptions(entry, result, index.toString());
            bans.push(ban);
        }
        return bans;
    }
}
