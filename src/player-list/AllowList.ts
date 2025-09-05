import PlayerList from "./PlayerList.js";
import {Player} from "../schemas/player.js";

export default class AllowList extends PlayerList<Player, Player, Player> {
    protected getName(): string {
        return 'minecraft:allowlist';
    }

    protected parseResult(result: unknown[]): Player[] {
        return Player.parseList(result);
    }
}
