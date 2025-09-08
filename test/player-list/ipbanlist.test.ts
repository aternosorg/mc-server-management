import {getServer} from "../utils.js";
import {beforeEach, expect, test} from "vitest";
import {IncomingIPBan, IPBan} from "../../src/schemas/ban.js";
import TestConnection from "../TestConnection.js";
import IncorrectTypeError from "../../src/error/IncorrectTypeError.js";
import IPBanList from "../../src/player-list/IPBanList.js";
import MissingPropertyError from "../../src/error/MissingPropertyError.js";

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
        IncomingIPBan.withIp("1.1.1.1").setExpires(new Date(4102444800_000))
    )).toBe(ipBanList);
    expect(await ipBanList.get()).toStrictEqual([new IPBan("1.1.1.1")
        .setExpires("2100-01-01T00:00:00Z")
        .setSource("Management server")
    ]);

    expect(await ipBanList.add(
        IncomingIPBan.withIp("1.1.1.1").setExpires("2100-01-01T00:00:00Z")
    )).toBe(ipBanList);
    expect(await ipBanList.get()).toStrictEqual([new IPBan("1.1.1.1")
        .setExpires("2100-01-01T00:00:00Z")
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
    const result = connection.addResponse([true]);

    await expect(ipBanList.get()).rejects.toThrow(new IncorrectTypeError("object", "boolean", result, "0"));
});

test('Invalid response missing ip', async () => {
    const connection = new TestConnection();
    const ipBanList = new IPBanList(connection);
    const result = connection.addResponse([{}]);

    await expect(ipBanList.get()).rejects.toThrow(new MissingPropertyError("ip", result, "0"));
});

test('Invalid response wrong type for ip', async () => {
    const connection = new TestConnection();
    const ipBanList = new IPBanList(connection);
    const result = connection.addResponse([{ip: true}]);

    await expect(ipBanList.get()).rejects.toThrow(new IncorrectTypeError("string", "boolean", result, "0", "ip"));
});

test('Invalid response wrong type for reason', async () => {
    const connection = new TestConnection();
    const ipBanList = new IPBanList(connection);
    const result = connection.addResponse([{ip: '1.1.1.1', reason: true}]);

    await expect(ipBanList.get()).rejects.toThrow(new IncorrectTypeError("string", "boolean", result, "0", "reason"));
});

test('Invalid response wrong type for source', async () => {
    const connection = new TestConnection();
    const ipBanList = new IPBanList(connection);
    const result = connection.addResponse([{ip: '1.1.1.1', source: true}]);

    await expect(ipBanList.get()).rejects.toThrow(new IncorrectTypeError("string", "boolean", result, "0", "source"));
});

test('Invalid response wrong type for expires', async () => {
    const connection = new TestConnection();
    const ipBanList = new IPBanList(connection);
    const result = connection.addResponse([{ip: '1.1.1.1', expires: true}]);

    await expect(ipBanList.get()).rejects.toThrow(new IncorrectTypeError("string", "boolean", result, "0", "expires"));
});
