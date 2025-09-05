import {beforeEach, expect, test} from "vitest";
import {getClient} from "../utils.js";
import {Player} from "../../src/schemas/player.js";
import AllowList from "../../src/player-list/AllowList.js";
import InvalidResponseError from "../../src/InvalidResponseError.js";

const ATERNOS = new Player("d6a91995-04bf-4f11-823f-5b18d412062a", "Aternos");
const EXAROTON = new Player("22c777bb-e823-4ab8-b17b-acd3eef0b597", "exaroton");

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


class TestAllowlist extends AllowList {
    private resultQueue: any[] = [];

    public addResult(result: any) {
        this.resultQueue.push(result);
    }

    protected async call(action?: string, params: any[] = []): Promise<any> {
        if (this.resultQueue.length === 0) {
            throw new Error("No more results in queue");
        }

        return this.resultQueue.shift();
    }
}

test('Invalid response not array', async () => {
    const allowlist = new TestAllowlist(client.connection);
    allowlist.addResult(true);

    await expect(allowlist.get()).rejects.toThrow(new InvalidResponseError("array", "boolean", true));
});

test('Invalid response clear', async () => {
    const allowlist = new TestAllowlist(client.connection);
    allowlist.addResult("test");

    await expect(allowlist.clear()).rejects.toThrow(new InvalidResponseError("true", "string", "test"));
});

test('Invalid response item not object', async () => {
    const allowlist = new TestAllowlist(client.connection);
    allowlist.addResult([true]);

    await expect(allowlist.get()).rejects.toThrow(new InvalidResponseError("object", "boolean", true, "0"));
});

test('Invalid response item missing id', async () => {
    const allowlist = new TestAllowlist(client.connection);
    allowlist.addResult([{"name": ATERNOS.name}]);

    await expect(allowlist.get()).rejects.toThrow(new InvalidResponseError("string", "undefined", {"name": "Aternos"}, "0.id"));
});

test('Invalid response item missing name', async () => {
    const allowlist = new TestAllowlist(client.connection);
    allowlist.addResult([{"id": ATERNOS.id}]);

    await expect(allowlist.get()).rejects.toThrow(new InvalidResponseError("string", "undefined", {"id": "d6a91995-04bf-4f11-823f-5b18d412062a"}, "0.name"));
});

test('Validate that all methods use cached list', async () => {
    const allowlist = new TestAllowlist(client.connection);
    allowlist.addResult([ATERNOS]);

    expect(await allowlist.get()).toStrictEqual([ATERNOS]);
    allowlist.addResult([ATERNOS, EXAROTON]);
    expect(await allowlist.add(Player.withName(EXAROTON.name!))).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([ATERNOS, EXAROTON]);
    allowlist.addResult([ATERNOS]);
    expect(await allowlist.remove(Player.withName(EXAROTON.name!))).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([ATERNOS]);
    allowlist.addResult(true);
    expect(await allowlist.clear()).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([]);
});

class TestPlayerList extends AllowList {
    protected async callAndParse(action?: string, params: any[] = []): Promise<this> {
        // Noop to create invalid state where items is not updated
        return this;
    }
}

test('Invalid allowlist add not updated', async () => {
    const allowlist = new TestPlayerList(client.connection);
    await expect(allowlist.get()).rejects.toThrow("Invalid player list.");
});
