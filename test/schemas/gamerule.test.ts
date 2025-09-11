import {expect, test} from "vitest";
import {UntypedGameRule} from "../../src";

test('Set key and value', () => {
    const gamerule = new UntypedGameRule("doDaylightCycle", "true");
    gamerule.setKey("maxEntityCramming").setValue("24");
    expect(gamerule.key).toEqual("maxEntityCramming");
    expect(gamerule.value).toEqual("24");
});
