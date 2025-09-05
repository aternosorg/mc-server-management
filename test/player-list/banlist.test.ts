import {ATERNOS, EXAROTON, getServer} from "../utils.js";
import {beforeEach, expect, test} from "vitest";
import TestConnection from "../TestConnection.js";
import IncorrectTypeError from "../../src/error/IncorrectTypeError.js";
import MissingPropertyError from "../../src/error/MissingPropertyError.js";
import {UserBan} from "../../src/schemas/ban.js";
import {Player} from "../../src/schemas/player.js";
import BanList from "../../src/player-list/BanList.js";

const server = await getServer();

beforeEach(async () => {
    // https://bugs.mojang.com/browse/MC/issues/MC-301891 - The clear method does not work correctly.
    await server.banList().set([]);
})

test('Get banlist items', async () => {
    const banList = server.banList();
    expect(await banList.get()).toStrictEqual([]);
});

test('Add one item to banlist', async () => {
    const banList = server.banList();
    expect(await banList.get()).toStrictEqual([]);
    expect(await banList.add(new UserBan(Player.withName(ATERNOS.name!)))).toBe(banList);
    expect(await banList.get()).toStrictEqual([new UserBan(ATERNOS)
        .setSource("Management server")
    ]);
});

test('Add item with source to banlist', async () => {
    const banList = server.banList();
    expect(await banList.get()).toStrictEqual([]);
    expect(await banList.add(
        new UserBan(Player.withName(ATERNOS.name!)).setSource("Unit Tests")
    )).toBe(banList);
    expect(await banList.get()).toStrictEqual([new UserBan(ATERNOS)
        .setSource("Unit Tests")
    ]);
});

test('Add item with reason to banlist', async () => {
    const banList = server.banList();
    expect(await banList.get()).toStrictEqual([]);
    expect(await banList.add(
        new UserBan(Player.withName(ATERNOS.name!)).setReason("Test")
    )).toBe(banList);
    expect(await banList.get()).toStrictEqual([new UserBan(ATERNOS)
        .setSource("Management server")
        .setReason("Test")
    ]);
});

test('Add item with expire time to banlist', async () => {
    const banList = server.banList();
    expect(await banList.get()).toStrictEqual([]);
    expect(await banList.add(
        new UserBan(Player.withName(ATERNOS.name!)).setExpires(new Date(4102444800_000))
    )).toBe(banList);
    expect(await banList.get()).toStrictEqual([new UserBan(ATERNOS)
        .setExpires("2100-01-01T00:00:00Z")
        .setSource("Management server")
    ]);

    expect(await banList.add(
        new UserBan(Player.withName(ATERNOS.name!)).setExpires("2100-01-01T00:00:00Z")
    )).toBe(banList);
    expect(await banList.get()).toStrictEqual([new UserBan(ATERNOS)
        .setExpires("2100-01-01T00:00:00Z")
        .setSource("Management server")
    ]);

});

test('Add multiple items to banlist', async () => {
    const banList = server.banList();
    expect(await banList.get()).toStrictEqual([]);
    expect(await banList.add([
        new UserBan(Player.withName(ATERNOS.name!)),
        new UserBan(Player.withId(EXAROTON.id!)),
    ])).toBe(banList);
});

test('Set banlist items', async () => {
    const banList = server.banList();
    expect(await banList.get()).toStrictEqual([]);
    expect(await banList.set([
        new UserBan(Player.withName(ATERNOS.name!)),
        new UserBan(Player.withId(EXAROTON.id!)),
    ])).toBe(banList);
    expect(await banList.get()).toStrictEqual([
        new UserBan(ATERNOS).setSource("Management server"),
        new UserBan(EXAROTON).setSource("Management server"),
    ]);
});

test('Remove one item from banlist', async () => {
    const banList = server.banList();
    expect(await banList.add([
        new UserBan(Player.withName(ATERNOS.name!)),
        new UserBan(Player.withId(EXAROTON.id!)),
    ])).toBe(banList);
    expect(await banList.get()).toStrictEqual([
        new UserBan(ATERNOS).setSource("Management server"),
        new UserBan(EXAROTON).setSource("Management server"),
    ]);
    expect(await banList.remove(Player.withName(ATERNOS.name!))).toBe(banList);
    expect(await banList.get()).toStrictEqual([
        new UserBan(EXAROTON).setSource("Management server"),
    ]);
});

test('Invalid response item not object', async () => {
    const connection = new TestConnection();
    const banList = new BanList(connection);
    const result = connection.addResponse([true]);

    await expect(banList.get()).rejects.toThrow(new IncorrectTypeError("object", "boolean", result, "0"));
});

test('Invalid response missing player', async () => {
    const connection = new TestConnection();
    const banList = new BanList(connection);
    const result = connection.addResponse([{}]);

    await expect(banList.get()).rejects.toThrow(new MissingPropertyError("player", result, "0"));
});

test('Invalid response wrong type for player', async () => {
    const connection = new TestConnection();
    const banList = new BanList(connection);
    const result = connection.addResponse([{player: true}]);

    await expect(banList.get()).rejects.toThrow(new IncorrectTypeError("object", "boolean", result, "0.player"));
});

test('Invalid response wrong type for reason', async () => {
    const connection = new TestConnection();
    const banList = new BanList(connection);
    const result = connection.addResponse([{player: ATERNOS, reason: true}]);

    await expect(banList.get()).rejects.toThrow(new IncorrectTypeError("string", "boolean", result, "0.reason"));
});

test('Invalid response wrong type for source', async () => {
    const connection = new TestConnection();
    const banList = new BanList(connection);
    const result = connection.addResponse([{player: ATERNOS, source: true}]);

    await expect(banList.get()).rejects.toThrow(new IncorrectTypeError("string", "boolean", result, "0.source"));
});

test('Invalid response wrong type for expires', async () => {
    const connection = new TestConnection();
    const banList = new BanList(connection);
    const result = connection.addResponse([{player: ATERNOS, expires: true}]);

    await expect(banList.get()).rejects.toThrow(new IncorrectTypeError("string", "boolean", result, "0.expires"));
});
