import PlayerList from "./PlayerList.js";
import {IncomingIPBan, IPBan} from "../schemas/ban.js";
import IncorrectTypeError from "../error/IncorrectTypeError.js";
import MissingPropertyError from "../error/MissingPropertyError.js";

export default class IPBanList extends PlayerList<IPBan, IncomingIPBan, string> {
    protected getName(): string {
        return 'minecraft:ip_bans';
    }

    protected parseResult(result: unknown[]): IPBan[] {
        const bans: IPBan[] = [];
        for (const [index, entry] of result.entries()) {
            if (typeof entry !== 'object' || entry === null) {
                throw new IncorrectTypeError("object", typeof entry, result, `${index}`);
            }

            if (!("ip" in entry)) {
                throw new MissingPropertyError("ip", result, index.toString());
            }

            if (typeof entry.ip !== 'string') {
                throw new IncorrectTypeError("string", typeof entry.ip, result, `${index}.ip`);
            }

            bans.push(new IPBan(entry.ip).parseAndApplyOptions(entry, index.toString(), result))
        }
        return bans;
    }
}
