import PlayerList from "./PlayerList.js";
import {IncomingIPBan, IPBan} from "../schemas/ban.js";
import InvalidResponseError from "../InvalidResponseError.js";

export default class IPBanList extends PlayerList<IPBan, IncomingIPBan, string> {
    protected getName(): string {
        return 'minecraft:ip_bans';
    }

    protected parseResult(result: any[]): IPBan[] {
        const bans: IPBan[] = [];
        for (const [index, entry] of result.entries()) {
            if (typeof entry !== 'object' || entry === null) {
                throw new InvalidResponseError("object", typeof entry, entry, `${index}`);
            }

            if (typeof entry.ip !== 'string') {
                throw new InvalidResponseError("string", typeof entry.id, entry, `${index}.ip`);
            }

            const ban = new IPBan(entry.ip);

            if (entry.reason && typeof entry.reason !== 'string') {
                throw new InvalidResponseError("string", typeof entry.reason, entry, `${index}.reason`);
            }
            ban.reason = entry.reason ?? null;

            if (entry.source && typeof entry.source !== 'string') {
                throw new InvalidResponseError("string", typeof entry.source, entry, `${index}.source`);
            }
            ban.source = entry.source ?? null;

            if (entry.expires && typeof entry.expires !== 'string') {
                throw new InvalidResponseError("string", typeof entry.expires, entry, `${index}.expires`);
            }
            ban.expires = entry.expires ?? null;

            bans.push(ban)
        }
        return bans;
    }
}
