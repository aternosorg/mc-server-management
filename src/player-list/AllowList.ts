import PlayerList from "./PlayerList.js";
import {Player} from "../schemas/player.js";

export default class AllowList extends PlayerList<Player, Player, Player> {
    protected getName(): string {
        return 'minecraft:allowlist';
    }

    protected parseResult(result: unknown[]): Player[] {
        const players = [];
        for (const [index, entry] of result.entries()) {
            players.push(Player.parse(entry, index.toString(), result))
        }
        return players;
    }
}
