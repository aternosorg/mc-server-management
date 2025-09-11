import {beforeEach, expect, test} from "vitest";
import {ATERNOS, EXAROTON, getServer} from "../utils.js";
import {IncorrectTypeError, MissingPropertyError, Operator, OperatorList, Player} from "../../src";
import TestConnection from "../TestConnection.js";

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
    const result = connection.addResponse([true]);
    const ops = new OperatorList(connection);

    await expect(ops.get()).rejects.toThrowError(new IncorrectTypeError("object", "boolean", result, "0"));
});

test('Invalid response missing player', async () => {
    const connection = new TestConnection();
    const ops = new OperatorList(connection);
    const result = connection.addResponse([{}]);

    await expect(ops.get()).rejects.toThrow(new MissingPropertyError("player", result, "0"));
});

test('Invalid response wrong type for player', async () => {
    const connection = new TestConnection();
    const ops = new OperatorList(connection);
    const result = connection.addResponse([{player: true}]);

    await expect(ops.get()).rejects.toThrow(new IncorrectTypeError("object", "boolean", result, "0", "player"));
});

test('Invalid response wrong type for permissionLevel', async () => {
    const connection = new TestConnection();
    const ops = new OperatorList(connection);
    const result = connection.addResponse([{player: {id: EXAROTON.id, name: EXAROTON.name}, permissionLevel: "4"}]);

    await expect(ops.get()).rejects.toThrow(new IncorrectTypeError("number", "string", result, "0", "permissionLevel"));
});

test('Invalid response wrong type for bypassesPlayerLimit', async () => {
    const connection = new TestConnection();
    const ops = new OperatorList(connection);
    const result = connection.addResponse([{player: {id: EXAROTON.id, name: EXAROTON.name}, bypassesPlayerLimit: "false"}]);

    await expect(ops.get()).rejects.toThrow(new IncorrectTypeError("boolean", "string", result, "0", "bypassesPlayerLimit"));
});
