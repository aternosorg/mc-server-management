import Player, {PlayerInput} from "../schemas/player/Player";
import Operator, {OperatorInput} from "../schemas/player/Operator";
import {fromItemOrArray, ItemOrArray} from "../util";
import PlayerList from "./PlayerList";

export default class OperatorList extends PlayerList<Operator> {
    /**
     * Overwrite the existing operator list with a set of operators.
     * This method updates the cached with the resulting list from the server. Use `get()` to retrieve it.
     * @param items list of strings (player names), Player objects or Operator objects
     * @param permissionLevel Default permission level if the item is not an Operator object
     * @param bypassesPlayerLimit Default bypassesPlayerLimit if the item is not an Operator object
     */
    async set(
        items: OperatorInput[],
        permissionLevel?: number,
        bypassesPlayerLimit?: boolean,
    ): Promise<this> {
        return this.callAndParse('set', [this.fromInputs(items, permissionLevel, bypassesPlayerLimit)]);
    }

    /**
     * Add players to the operator list.
     * This method updates the cached with the resulting list from the server. Use `get()` to retrieve it.
     * @param items list of strings (player names), Player objects or Operator objects
     * @param permissionLevel Default permission level if the item is not an Operator object
     * @param bypassesPlayerLimit Default bypassesPlayerLimit if the item is not an Operator object
     */
    async add(
        items: ItemOrArray<OperatorInput>,
        permissionLevel?: number,
        bypassesPlayerLimit?: boolean,
    ): Promise<this> {
        return this.callAndParse('add', [this.fromInputs(items, permissionLevel, bypassesPlayerLimit)]);
    }

    /**
     * Remove players from the operator list.
     * This method updates the cached with the resulting list from the server. Use `get()` to retrieve it.
     * @param items list of strings (player names) or Player objects
     */
    async remove(items: ItemOrArray<PlayerInput>): Promise<this> {
        return this.callAndParse('remove', [fromItemOrArray(items).map(Player.fromInput)]);
    }

    protected getName(): string {
        return "minecraft:operators"
    }

    protected fromInputs(inputs: ItemOrArray<OperatorInput>, permissionLevel: number|undefined, bypassesPlayerLimit: boolean|undefined): Operator[] {
        return fromItemOrArray(inputs).map(i => Operator.fromInput(i, permissionLevel, bypassesPlayerLimit));
    }

    protected parseResult(result: unknown[]): Operator[] {
        const ops: Operator[] = [];
        for (const [index, entry] of result.entries()) {
            ops.push(Operator.parse(entry, result, index.toString()));
        }
        return ops;
    }
}
