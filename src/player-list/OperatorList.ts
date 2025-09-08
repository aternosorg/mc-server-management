import {Operator, Player} from "../schemas/player.js";
import PlayerList from "./PlayerList.js";
import IncorrectTypeError from "../error/IncorrectTypeError.js";
import MissingPropertyError from "../error/MissingPropertyError.js";

export default class OperatorList extends PlayerList<Operator, Operator, Player> {
    protected getName(): string {
        return "minecraft:operators"
    }

    protected parseResult(result: unknown[]): Operator[] {
        const ops: Operator[] = [];
        for (const [index, entry] of result.entries()) {
            if (typeof entry !== 'object' || entry === null) {
                throw new IncorrectTypeError("object", typeof entry, result, index.toString());
            }

            if (!("player" in entry)) {
                throw new MissingPropertyError("player", result, index.toString());
            }

            const operator = new Operator(Player.parse(entry.player, result, index.toString(), "player"));
            if ("permissionLevel" in entry) {
                if (typeof entry.permissionLevel !== 'number') {
                    throw new IncorrectTypeError(
                        "number",
                        typeof entry.permissionLevel,
                        result,
                        index.toString(),
                        'permissionLevel'
                    );
                }
                operator.permissionLevel = entry.permissionLevel;
            }

            if ("bypassesPlayerLimit" in entry) {
                if (typeof entry.bypassesPlayerLimit !== 'boolean') {
                    throw new IncorrectTypeError(
                        "boolean",
                        typeof entry.bypassesPlayerLimit,
                        result,
                        index.toString(),
                        'bypassesPlayerLimit',
                    );
                }
                operator.bypassesPlayerLimit = entry.bypassesPlayerLimit;
            }

            ops.push(operator);
        }
        return ops;
    }
}
