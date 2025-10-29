import {getServer} from "../utils";
import {ATERNOS, EXAROTON, TEST_DATE, TEST_DATE_STRING} from "../../constants";
import {beforeEach, expect, test} from "vitest";
import {IncomingIPBan, IncorrectTypeError, IPBan, IPBanList, MissingPropertyError, Player} from "../../../src";
import TestConnection from "../../TestConnection";

const server = await getServer();

beforeEach(async () => {
    await server.ipBanList().clear();
})

test('Get IP banlist items', async () => {
    const ipBanList = server.ipBanList();
    expect(await ipBanList.get()).toStrictEqual([]);
});

test('Add one item to IP banlist', async () => {
    const ipBanList = server.ipBanList();
    expect(await ipBanList.get()).toStrictEqual([]);
    expect(await ipBanList.add(IncomingIPBan.withIp("1.1.1.1"))).toBe(ipBanList);
    expect(await ipBanList.get()).toStrictEqual([new IPBan("1.1.1.1")
        .setSource("Management server")
    ]);
});

test('Add item with source to IP banlist', async () => {
    const ipBanList = server.ipBanList();
    expect(await ipBanList.get()).toStrictEqual([]);
    expect(await ipBanList.add(
        IncomingIPBan.withIp("1.1.1.1").setSource("Unit Tests")
    )).toBe(ipBanList);
    expect(await ipBanList.get()).toStrictEqual([new IPBan("1.1.1.1")
        .setSource("Unit Tests")
    ]);
});

test('Add item with reason to IP banlist', async () => {
    const ipBanList = server.ipBanList();
    expect(await ipBanList.get()).toStrictEqual([]);
    expect(await ipBanList.add(
        IncomingIPBan.withIp("1.1.1.1").setReason("Test")
    )).toBe(ipBanList);
    expect(await ipBanList.get()).toStrictEqual([new IPBan("1.1.1.1")
        .setSource("Management server")
        .setReason("Test")
    ]);
});

test('Add item with expire time to IP banlist', async () => {
    const ipBanList = server.ipBanList();
    expect(await ipBanList.get()).toStrictEqual([]);
    expect(await ipBanList.add(
        IncomingIPBan.withIp("1.1.1.1").setExpires(TEST_DATE)
    )).toBe(ipBanList);
    expect(await ipBanList.get()).toStrictEqual([new IPBan("1.1.1.1")
        .setExpires(TEST_DATE_STRING)
        .setSource("Management server")
    ]);

    expect(await ipBanList.add(
        IncomingIPBan.withIp("1.1.1.1").setExpires(TEST_DATE_STRING)
    )).toBe(ipBanList);
    expect(await ipBanList.get()).toStrictEqual([new IPBan("1.1.1.1")
        .setExpires(TEST_DATE_STRING)
        .setSource("Management server")
    ]);

});

test('Add multiple items to IP banlist', async () => {
    const ipBanList = server.ipBanList();
    expect(await ipBanList.get()).toStrictEqual([]);
    expect(await ipBanList.add([
        IncomingIPBan.withIp("1.1.1.1"),
        IncomingIPBan.withIp("8.8.8.8"),
    ])).toBe(ipBanList);
    expect(await ipBanList.get()).toStrictEqual([
        new IPBan("8.8.8.8", null, "Management server", null),
        new IPBan("1.1.1.1", null, "Management server", null),
    ]);
});

test('Set IP banlist items', async () => {
    const ipBanList = server.ipBanList();
    expect(await ipBanList.get()).toStrictEqual([]);
    expect(await ipBanList.set([
        new IPBan("1.1.1.1"),
        new IPBan("8.8.8.8"),
    ])).toBe(ipBanList);
    expect(await ipBanList.get()).toStrictEqual([
        new IPBan("8.8.8.8", null, "Management server", null),
        new IPBan("1.1.1.1", null, "Management server", null),
    ]);
});

test('Remove one item from IP banlist', async () => {
    const ipBanList = server.ipBanList();
    expect(await ipBanList.add([
        IncomingIPBan.withIp("1.1.1.1"),
        IncomingIPBan.withIp("8.8.8.8"),
    ])).toBe(ipBanList);
    expect(await ipBanList.get()).toStrictEqual([
        new IPBan("8.8.8.8", null, "Management server", null),
        new IPBan("1.1.1.1", null, "Management server", null),
    ]);
    expect(await ipBanList.remove("1.1.1.1")).toBe(ipBanList);
    expect(await ipBanList.get()).toStrictEqual([
        new IPBan("8.8.8.8", null, "Management server", null),
    ]);
});

test('Invalid response item not object', async () => {
    const connection = new TestConnection();
    const ipBanList = new IPBanList(connection);
    const result = connection.addSuccess([true]);

    await expect(ipBanList.get()).rejects.toThrow(new IncorrectTypeError("object", "boolean", result, "0"));
});

test('Invalid response missing ip', async () => {
    const connection = new TestConnection();
    const ipBanList = new IPBanList(connection);
    const result = connection.addSuccess([{}]);

    await expect(ipBanList.get()).rejects.toThrow(new MissingPropertyError("ip", result, "0"));
});

test('Invalid response wrong type for ip', async () => {
    const connection = new TestConnection();
    const ipBanList = new IPBanList(connection);
    const result = connection.addSuccess([{ip: true}]);

    await expect(ipBanList.get()).rejects.toThrow(new IncorrectTypeError("string", "boolean", result, "0", "ip"));
});

test('Invalid response wrong type for reason', async () => {
    const connection = new TestConnection();
    const ipBanList = new IPBanList(connection);
    const result = connection.addSuccess([{ip: '1.1.1.1', reason: true}]);

    await expect(ipBanList.get()).rejects.toThrow(new IncorrectTypeError("string", "boolean", result, "0", "reason"));
});

test('Invalid response wrong type for source', async () => {
    const connection = new TestConnection();
    const ipBanList = new IPBanList(connection);
    const result = connection.addSuccess([{ip: '1.1.1.1', source: true}]);

    await expect(ipBanList.get()).rejects.toThrow(new IncorrectTypeError("string", "boolean", result, "0", "source"));
});

test('Invalid response wrong type for expires', async () => {
    const connection = new TestConnection();
    const ipBanList = new IPBanList(connection);
    const result = connection.addSuccess([{ip: '1.1.1.1', expires: true}]);

    await expect(ipBanList.get()).rejects.toThrow(new IncorrectTypeError("string", "boolean", result, "0", "expires"));
});

test('Defaults for reason, source and expires (add)', async () => {
    const connection = new TestConnection();
    const banList = new IPBanList(connection);
    connection.addSuccess([]);
    await banList.add(["1.1.1.1", Player.withId(EXAROTON.id!), IncomingIPBan.withConnectedPlayer(Player.withId(ATERNOS.id!))],
        "reason", "Unit Tests", TEST_DATE);
    expect(connection.shiftRequestHistory()).toStrictEqual({
        method: "minecraft:ip_bans/add",
        parameters: [[
            new IncomingIPBan("1.1.1.1", undefined, "reason", "Unit Tests", TEST_DATE.toISOString()),
            new IncomingIPBan(undefined, Player.withId(EXAROTON.id!), "reason", "Unit Tests", TEST_DATE.toISOString()),
            new IncomingIPBan(undefined, Player.withId(ATERNOS.id!)),
        ]]
    });
});

test('Defaults for reason, source and expires (set)', async () => {
    const connection = new TestConnection();
    const banList = new IPBanList(connection);
    connection.addSuccess([]);
    await banList.set(["1.1.1.1", new IPBan("8.8.8.8")], "reason", "Unit Tests", TEST_DATE);
    expect(connection.shiftRequestHistory()).toStrictEqual({
        method: "minecraft:ip_bans/set",
        parameters: [[
            new IPBan("1.1.1.1", "reason", "Unit Tests", TEST_DATE.toISOString()),
            new IPBan("8.8.8.8"),
        ]]
    });
});
