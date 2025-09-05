import PlayerList from "./PlayerList.js";
import {Player} from "../schemas/player.js";
import InvalidResponseError from "../InvalidResponseError.js";

export default class AllowList extends PlayerList<Player, Player, Player> {
    protected getName(): string {
        return 'minecraft:allowlist';
    }

    protected parseResult(result: any[]): Player[] {
        const players = [];
        for (const [index, entry] of result.entries()) {
            if (typeof entry !== 'object' || entry === null) {
                throw new InvalidResponseError("object", typeof entry, entry, `${index}`);
            }
            if (typeof entry.id !== 'string') {
                throw new InvalidResponseError("string", typeof entry.id, entry, `${index}.id`);
            }
            if (typeof entry.name !== 'string') {
                throw new InvalidResponseError("string", typeof entry.name, entry, `${index}.name`);
            }
            players.push(new Player(entry.id, entry.name))
        }
        return players;
    }
}
