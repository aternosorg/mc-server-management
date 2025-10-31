import {beforeEach, expect, test} from "vitest";
import {ATERNOS, EXAROTON} from "../../constants";
import {getServer} from "../setup/connections";
import {AllowList, IncorrectTypeError, MissingPropertyError, Player} from "../../../src";
import TestConnection from "../../TestConnection";


const server = await getServer();

beforeEach(async () => {
    await server.allowlist().clear();
})

test('Get allowlist items', async () => {
    const allowlist = server.allowlist();
    expect(await allowlist.get()).toStrictEqual([]);
})

test('Add one item to allowlist', async () => {
    const allowlist = server.allowlist();
    expect(await allowlist.get()).toStrictEqual([]);
    expect(await allowlist.add(Player.withName(ATERNOS.name!))).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([ATERNOS]);
})

test('Add multiple items to allowlist', async () => {
    const allowlist = server.allowlist();
    expect(await allowlist.get()).toStrictEqual([]);
    expect(await allowlist.add([Player.withName(ATERNOS.name!), Player.withId(EXAROTON.id!)])).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([ATERNOS, EXAROTON]);
})

test('Set allowlist items', async () => {
    const allowlist = server.allowlist();
    expect(await allowlist.get()).toStrictEqual([]);

    expect(await allowlist.set([Player.withName(ATERNOS.name!)])).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([ATERNOS]);

    expect(await allowlist.set([Player.withId(EXAROTON.id!)])).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([EXAROTON]);
})

test('Remove allowlist items', async () => {
    const allowlist = server.allowlist();
    expect(await allowlist.get()).toStrictEqual([]);
    expect(await allowlist.set([Player.withName(ATERNOS.name!), Player.withId(EXAROTON.id!)])).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([ATERNOS, EXAROTON]);

    expect(await allowlist.remove(Player.withName(ATERNOS.name!))).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([EXAROTON]);
})

test('Invalid response not array', async () => {
    const connection = new TestConnection();
    const allowlist = new AllowList(connection);
    connection.addSuccess(true);

    await expect(allowlist.get()).rejects.toThrow(new IncorrectTypeError("array", "boolean", true));
});

test('Invalid response item not object', async () => {
    const connection = new TestConnection();
    const allowlist = new AllowList(connection);
    const result = connection.addSuccess([true]);

    await expect(allowlist.get()).rejects.toThrow(new IncorrectTypeError("object", "boolean", result, "0"));
});

test('Invalid response item missing id', async () => {
    const connection = new TestConnection();
    const allowlist = new AllowList(connection);
    const result = connection.addSuccess([{"name": ATERNOS.name}]);

    await expect(allowlist.get()).rejects.toThrow(new MissingPropertyError("id", result, "0"));
});

test('Invalid response item missing name', async () => {
    const connection = new TestConnection();
    const allowlist = new AllowList(connection);
    const result = connection.addSuccess([{"id": ATERNOS.id}]);

    await expect(allowlist.get()).rejects.toThrow(new MissingPropertyError("name", result, "0"));
});

test('Validate that all methods use cached list', async () => {
    const connection = new TestConnection();
    const allowlist = new AllowList(connection);
    connection.addSuccess([ATERNOS]);

    expect(await allowlist.get()).toStrictEqual([ATERNOS]);
    connection.addSuccess([ATERNOS, EXAROTON]);
    expect(await allowlist.add(Player.withName(EXAROTON.name!))).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([ATERNOS, EXAROTON]);
    connection.addSuccess([ATERNOS]);
    expect(await allowlist.remove(Player.withName(EXAROTON.name!))).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([ATERNOS]);
    connection.addSuccess([]);
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
