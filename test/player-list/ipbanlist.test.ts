import {getClient} from "../utils.js";
import {beforeEach, expect, test} from "vitest";
import {IncomingIPBan, IPBan} from "../../src/schemas/ban.js";
import TestConnection from "../TestConnection.js";
import InvalidResponseError from "../../src/InvalidResponseError.js";
import IPBanList from "../../src/player-list/IPBanList.js";

const client = await getClient();

beforeEach(async () => {
    await client.ipBanList().clear();
})

test('Get IP banlist items', async () => {
    const ipBanList = client.ipBanList();
    expect(await ipBanList.get()).toStrictEqual([]);
});

test('Add one item to IP banlist', async () => {
    const ipBanList = client.ipBanList();
    expect(await ipBanList.get()).toStrictEqual([]);
    expect(await ipBanList.add(IncomingIPBan.withIp("1.1.1.1"))).toBe(ipBanList);
    expect(await ipBanList.get()).toStrictEqual([new IPBan("1.1.1.1")
        .setSource("Management server")
    ]);
});

test('Add item with source to IP banlist', async () => {
    const ipBanList = client.ipBanList();
    expect(await ipBanList.get()).toStrictEqual([]);
    expect(await ipBanList.add(
        IncomingIPBan.withIp("1.1.1.1").setSource("Unit Tests")
    )).toBe(ipBanList);
    expect(await ipBanList.get()).toStrictEqual([new IPBan("1.1.1.1")
        .setSource("Unit Tests")
    ]);
});

test('Add item with reason to IP banlist', async () => {
    const ipBanList = client.ipBanList();
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
    const ipBanList = client.ipBanList();
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
    const ipBanList = client.ipBanList();
    expect(await ipBanList.get()).toStrictEqual([]);
    expect(await ipBanList.add([
        IncomingIPBan.withIp("1.1.1.1"),
        IncomingIPBan.withIp("8.8.8.8"),
    ])).toBe(ipBanList);
});

test('Invalid response item not object', async () => {
    const connection = new TestConnection();
    const ipBanList = new IPBanList(connection);
    connection.addResult([true]);

    await expect(ipBanList.get()).rejects.toThrow(new InvalidResponseError("object", "boolean", true, "0"));
});

test('Invalid response missing ip', async () => {
    const connection = new TestConnection();
    const ipBanList = new IPBanList(connection);
    connection.addResult([{}]);

    await expect(ipBanList.get()).rejects.toThrow(new InvalidResponseError("string", "undefined", {}, "0.ip"));
});

test('Invalid response wrong type for reason', async () => {
    const connection = new TestConnection();
    const ipBanList = new IPBanList(connection);
    const result = {ip: '1.1.1.1', reason: true};
    connection.addResult([result]);

    await expect(ipBanList.get()).rejects.toThrow(new InvalidResponseError("string", "boolean", result, "0.reason"));
});

test('Invalid response wrong type for source', async () => {
    const connection = new TestConnection();
    const ipBanList = new IPBanList(connection);
    const result = {ip: '1.1.1.1', source: true};
    connection.addResult([result]);

    await expect(ipBanList.get()).rejects.toThrow(new InvalidResponseError("string", "boolean", result, "0.source"));
});

test('Invalid response wrong type for expires', async () => {
    const connection = new TestConnection();
    const ipBanList = new IPBanList(connection);
    const result = {ip: '1.1.1.1', expires: true};
    connection.addResult([result]);

    await expect(ipBanList.get()).rejects.toThrow(new InvalidResponseError("string", "boolean", result, "0.expires"));
});
