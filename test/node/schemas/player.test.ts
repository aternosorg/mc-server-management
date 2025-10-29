import {expect, test} from "vitest";
import {IncorrectTypeError, Operator, Player} from "../../../src";
import {ATERNOS, EXAROTON} from "../../constants";

test('Operator', () => {
    const operator = new Operator(ATERNOS);
    expect(operator.player).toBe(ATERNOS);
    operator.setPermissionLevel(4);
    expect(operator.permissionLevel).toBe(4);
    operator.setBypassesPlayerLimit(true);
    expect(operator.bypassesPlayerLimit).toBe(true);
    operator.setPlayer(EXAROTON);
    expect(operator.player).toBe(EXAROTON);
    operator.setPermissionLevel();
    expect(operator.permissionLevel).toBeUndefined();
    operator.setBypassesPlayerLimit();
    expect(operator.bypassesPlayerLimit).toBeUndefined();
});

test('Parse player list wrong type', () => {
    expect(() => Player.parseList(false)).toThrow(
        new IncorrectTypeError("array", "boolean", false)
    );
});

test('Parse player list wrong id type', () => {
    const data = {id: 1, name: "Player"};
    expect(() => Player.parse(data, data)).toThrow(
        new IncorrectTypeError("string", "number", data, 'id')
    )
});

test('Parse player list wrong name type', () => {
    const data = {name: 1, id: "uuid"};
    expect(() => Player.parse(data, data)).toThrow(
        new IncorrectTypeError("string", "number", data, 'name')
    )
});


