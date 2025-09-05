import PlayerList from "./PlayerList.js";
import {IncomingIPBan, IPBan, UserBan} from "../schemas/ban.js";
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
                throw new IncorrectTypeError("object", typeof entry, result, `${index}`);
            }

            if (!("player" in entry)) {
                throw new MissingPropertyError("player", result, index.toString());
            }

            bans.push(new UserBan(Player.parse(entry.player, index + ".player", result)).parseAndApplyOptions(entry, index.toString(), result))
        }
        return bans;
    }
}
