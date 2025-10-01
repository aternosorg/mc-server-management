import {expect, test} from "vitest";
import {ATERNOS, EXAROTON} from "../utils.js";
import TestConnection from "../TestConnection.js";
import {AllowList} from "../../src";

test('Calling removeMatching without cached items', async () => {
    const connection = new TestConnection();
    const allowlist = new AllowList(connection);
    expect(allowlist.removeMatching(() => true)).toBe(allowlist);
    connection.addSuccess([]);
    expect(await allowlist.get()).toStrictEqual([]);
    expect(connection.shiftRequestHistory()).toStrictEqual({method: 'minecraft:allowlist', parameters: []});
});

test('Calling removeMatching removes items', async () => {
    const connection = new TestConnection();
    const allowlist = new AllowList(connection);
    connection.addSuccess([ATERNOS, EXAROTON]);
    expect(await allowlist.get()).toStrictEqual([ATERNOS, EXAROTON]);
    expect(await allowlist.get()).toStrictEqual([ATERNOS, EXAROTON]);
    expect(allowlist.removeMatching(() => true)).toBe(allowlist);
    expect(await allowlist.get()).toStrictEqual([]);
});
