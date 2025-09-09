import {Operator, Player} from "../schemas/player.js";
import PlayerList from "./PlayerList.js";

export default class OperatorList extends PlayerList<Operator, Operator, Player> {
    protected getName(): string {
        return "minecraft:operators"
    }

    protected parseResult(result: unknown[]): Operator[] {
        const ops: Operator[] = [];
        for (const [index, entry] of result.entries()) {
            ops.push(Operator.parse(entry, result, index.toString()));
        }
        return ops;
    }
}
