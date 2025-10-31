import {beforeEach, expect, test} from "vitest";
import {ATERNOS, EXAROTON} from "../../constants";
import {getServer} from "../setup/connections";
import {IncorrectTypeError, MissingPropertyError, Operator, OperatorList, Player} from "../../../src";
import TestConnection from "../../TestConnection";

const server = await getServer();

beforeEach(async () => {
    await server.operatorList().clear();
});

test('Get operators', async () => {
    const ops = server.operatorList();
    expect(await ops.get()).toStrictEqual([]);
});

test('Add one operator', async () => {
    const ops = server.operatorList();
    expect(await ops.get()).toStrictEqual([]);
    expect(await ops.add(new Operator(Player.withName(ATERNOS.name!)))).toBe(ops);
    expect(await ops.get()).toStrictEqual([new Operator(ATERNOS, 4, false)]);
});

test('Add one operator with options', async () => {
    const ops = server.operatorList();
    expect(await ops.get()).toStrictEqual([]);
    expect(await ops.add(new Operator(Player.withId(EXAROTON.id!))
        .setPermissionLevel(2)
        .setBypassesPlayerLimit(true)
    )).toBe(ops);
    expect(await ops.get()).toStrictEqual([new Operator(EXAROTON, 2, true)]);
});

test('Add multiple operators', async () => {
    const ops = server.operatorList();
    expect(await ops.get()).toStrictEqual([]);
    expect(await ops.add([
        new Operator(Player.withName(ATERNOS.name!)),
        new Operator(Player.withId(EXAROTON.id!))
    ])).toBe(ops);
    expect(await ops.get()).toStrictEqual([
        new Operator(ATERNOS, 4, false),
        new Operator(EXAROTON, 4, false)
    ]);
});

test('Set operators', async () => {
    const ops = server.operatorList();
    expect(await ops.get()).toStrictEqual([]);
    expect(await ops.set([
        new Operator(Player.withName(ATERNOS.name!)),
        new Operator(Player.withId(EXAROTON.id!))
    ])).toBe(ops);
    expect(await ops.get()).toStrictEqual([
        new Operator(ATERNOS, 4, false),
        new Operator(EXAROTON, 4, false)
    ]);
});

test('Remove one operator', async () => {
    const ops = server.operatorList();
    expect(await ops.add([
        new Operator(Player.withName(ATERNOS.name!)),
        new Operator(Player.withId(EXAROTON.id!))
    ])).toBe(ops);
    expect(await ops.get()).toStrictEqual([
        new Operator(ATERNOS, 4, false),
        new Operator(EXAROTON, 4, false)
    ]);
    expect(await ops.remove(Player.withName(ATERNOS.name!))).toBe(ops);
    expect(await ops.get()).toStrictEqual([
        new Operator(EXAROTON, 4, false)
    ]);
});

test('Invalid response item not object', async () => {
    const connection = new TestConnection();
    const result = connection.addSuccess([true]);
    const ops = new OperatorList(connection);

    await expect(ops.get()).rejects.toThrowError(new IncorrectTypeError("object", "boolean", result, "0"));
});

test('Invalid response missing player', async () => {
    const connection = new TestConnection();
    const ops = new OperatorList(connection);
    const result = connection.addSuccess([{}]);

    await expect(ops.get()).rejects.toThrow(new MissingPropertyError("player", result, "0"));
});

test('Invalid response wrong type for player', async () => {
    const connection = new TestConnection();
    const ops = new OperatorList(connection);
    const result = connection.addSuccess([{player: true}]);

    await expect(ops.get()).rejects.toThrow(new IncorrectTypeError("object", "boolean", result, "0", "player"));
});

test('Invalid response wrong type for permissionLevel', async () => {
    const connection = new TestConnection();
    const ops = new OperatorList(connection);
    const result = connection.addSuccess([{player: {id: EXAROTON.id, name: EXAROTON.name}, permissionLevel: "4"}]);

    await expect(ops.get()).rejects.toThrow(new IncorrectTypeError("number", "string", result, "0", "permissionLevel"));
});

test('Invalid response wrong type for bypassesPlayerLimit', async () => {
    const connection = new TestConnection();
    const ops = new OperatorList(connection);
    const result = connection.addSuccess([{player: {id: EXAROTON.id, name: EXAROTON.name}, bypassesPlayerLimit: "false"}]);

    await expect(ops.get()).rejects.toThrow(new IncorrectTypeError("boolean", "string", result, "0", "bypassesPlayerLimit"));
});

test('Defaults for permissionLevel and bypassPlayerLimit', async () => {
    const connection = new TestConnection();
    const ops = new OperatorList(connection);
    connection.addSuccess([]);
    await ops.add([ATERNOS.name!, Player.withId(EXAROTON.id!), new Operator(Player.withId(ATERNOS.id!))], 2, true);
    expect(connection.shiftRequestHistory()).toStrictEqual({
        method: 'minecraft:operators/add',
        parameters: [[
            new Operator(ATERNOS.name!, 2, true),
            new Operator(Player.withId(EXAROTON.id!), 2, true),
            new Operator(Player.withId(ATERNOS.id!)),
        ]]
    });
});
