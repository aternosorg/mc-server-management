import {beforeEach, expect, test} from "vitest";
import {ATERNOS, EXAROTON, getClient} from "../utils.js";
import {Player} from "../../src/schemas/player.js";
import AllowList from "../../src/player-list/AllowList.js";
import IncorrectTypeError from "../../src/error/IncorrectTypeError.js";
import TestConnection from "../TestConnection.js";
import MissingPropertyError from "../../src/error/MissingPropertyError.js";


const client = await getClient();

beforeEach(async () => {
    await client.allowlist().clear();
})

test('Get allowlist items', async () => {
    const allowlist = client.allowlist();
    expect(await allowlist.get()).toStrictEqual([]);
})

test('Add one item to allowlist', async () => {
    const allowlist = client.allowlist();
    expect(await allowlist.get()).toStrictEqual([]);
    expect(await allowlist.add(Player.withName(ATERNOS.name!))).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([ATERNOS]);
})

test('Add multiple items to allowlist', async () => {
    const allowlist = client.allowlist();
    expect(await allowlist.get()).toStrictEqual([]);
    expect(await allowlist.add([Player.withName(ATERNOS.name!), Player.withId(EXAROTON.id!)])).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([ATERNOS, EXAROTON]);
})

test('Set allowlist items', async () => {
    const allowlist = client.allowlist();
    expect(await allowlist.get()).toStrictEqual([]);

    expect(await allowlist.set([Player.withName(ATERNOS.name!)])).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([ATERNOS]);

    expect(await allowlist.set([Player.withId(EXAROTON.id!)])).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([EXAROTON]);
})

test('Remove allowlist items', async () => {
    const allowlist = client.allowlist();
    expect(await allowlist.get()).toStrictEqual([]);
    expect(await allowlist.set([Player.withName(ATERNOS.name!), Player.withId(EXAROTON.id!)])).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([ATERNOS, EXAROTON]);

    expect(await allowlist.remove(Player.withName(ATERNOS.name!))).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([EXAROTON]);
})

test('Invalid response not array', async () => {
    const connection = new TestConnection();
    const allowlist = new AllowList(connection);
    connection.addResult(true);

    await expect(allowlist.get()).rejects.toThrow(new IncorrectTypeError("array", "boolean", true));
});

test('Invalid response clear', async () => {
    const connection = new TestConnection();
    const allowlist = new AllowList(connection);
    connection.addResult("test");

    await expect(allowlist.clear()).rejects.toThrow(new IncorrectTypeError("true", "string", "test"));
});

test('Invalid response item not object', async () => {
    const connection = new TestConnection();
    const allowlist = new AllowList(connection);
    const result = connection.addResult([true]);

    await expect(allowlist.get()).rejects.toThrow(new IncorrectTypeError("object", "boolean", result, "0"));
});

test('Invalid response item missing id', async () => {
    const connection = new TestConnection();
    const allowlist = new AllowList(connection);
    const result = connection.addResult([{"name": ATERNOS.name}]);

    await expect(allowlist.get()).rejects.toThrow(new MissingPropertyError("id", result, "0"));
});

test('Invalid response item missing name', async () => {
    const connection = new TestConnection();
    const allowlist = new AllowList(connection);
    const result = connection.addResult([{"id": ATERNOS.id}]);

    await expect(allowlist.get()).rejects.toThrow(new MissingPropertyError("name", result, "0"));
});

test('Validate that all methods use cached list', async () => {
    const connection = new TestConnection();
    const allowlist = new AllowList(connection);
    connection.addResult([ATERNOS]);

    expect(await allowlist.get()).toStrictEqual([ATERNOS]);
    connection.addResult([ATERNOS, EXAROTON]);
    expect(await allowlist.add(Player.withName(EXAROTON.name!))).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([ATERNOS, EXAROTON]);
    connection.addResult([ATERNOS]);
    expect(await allowlist.remove(Player.withName(EXAROTON.name!))).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([ATERNOS]);
    connection.addResult(true);
    expect(await allowlist.clear()).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([]);
});

class TestPlayerList extends AllowList {
    protected async callAndParse(action?: string, params: unknown[] = []): Promise<this> {
        // Noop to create invalid state where items is not updated
        return this;
    }
}

test('Invalid allowlist add not updated', async () => {
    const allowlist = new TestPlayerList(new TestConnection());
    await expect(allowlist.get()).rejects.toThrow("Invalid player list.");
});
