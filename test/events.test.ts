import {afterEach, beforeEach, expect, test} from "vitest";
import TestConnection from "./TestConnection.js";
import {
    GameRuleType,
    IncorrectTypeError,
    IPBan,
    MinecraftServer,
    Notifications,
    Operator,
    ServerState,
    TypedGameRule,
    UserBan,
    Version,
} from "../src"
import {ATERNOS, EXAROTON} from "./utils.js";

let connection: TestConnection;
let err: any = null;
let server: MinecraftServer;
beforeEach(() => {
    connection = new TestConnection();
    server = new MinecraftServer(connection);
    err = null;
    connection.on('error', arg => err = arg);
});

afterEach(() => {
    expect(err).toBeNull()
})

test('Events without data are forwarded', async () => {
    for (const event of [
        Notifications.SERVER_STARTED,
        Notifications.SERVER_STOPPING,
        Notifications.SERVER_SAVING,
        Notifications.SERVER_SAVED,
    ]) {
        let called = false;
        server.once(event, () => {
            called = true;
        });
        connection.emit(event);
        expect(called).toBe(true);
    }
});

test('Player join/leave events are forwarded', async () => {
    for (const event of [
        Notifications.PLAYER_JOINED,
        Notifications.PLAYER_LEFT,
    ] as const) {
        let called = false;
        server.once(event, p => {
            called = true;
            expect(p).toStrictEqual(ATERNOS);
        });
        connection.emit(event, [ATERNOS]);
        expect(called).toBe(true);
    }
});



test('OP add without cache', async () => {
    let called = false;
    const operator = new Operator(ATERNOS, 4, false);
    server.once(Notifications.OPERATOR_ADDED, item => {
        called = true;
        expect(item).toStrictEqual(operator);
    });
    connection.emit(Notifications.OPERATOR_ADDED, [operator]);
    expect(called).toBe(true);
});

test('Allowlist add without cache', async () => {
    let called = false;
    server.once(Notifications.ALLOWLIST_ADDED, item => {
        called = true;
        expect(item).toStrictEqual(ATERNOS);
    });
    connection.emit(Notifications.ALLOWLIST_ADDED, [ATERNOS]);
    expect(called).toBe(true);
});

test('IP Ban add without cache', async () => {
    let called = false;
    const ban = {ip: "1.1.1.1", reason: "reason", source: "source"};
    const banResult = new IPBan(ban.ip, ban.reason, ban.source);
    server.once(Notifications.IP_BAN_ADDED, item => {
        called = true;
        expect(item).toStrictEqual(banResult);
    });
    connection.emit(Notifications.IP_BAN_ADDED, [ban]);
    expect(called).toBe(true);
});

test('Ban add without cache', async () => {
    let called = false;
    const ban = {player: ATERNOS, reason: "reason", source: "source"};
    const banResult = new UserBan(ban.player, ban.reason, ban.source);
    server.once(Notifications.BAN_ADDED, item => {
        called = true;
        expect(item).toStrictEqual(banResult);
    });
    connection.emit(Notifications.BAN_ADDED, [ban]);
    expect(called).toBe(true);
});



test('OP remove without cache', async () => {
    let called = false;
    const operator = new Operator(ATERNOS, 4, false);
    server.once(Notifications.OPERATOR_REMOVED, item => {
        called = true;
        expect(item).toStrictEqual(operator);
    });
    connection.emit(Notifications.OPERATOR_REMOVED, [operator]);
    expect(called).toBe(true);
});

test('Allowlist remove without cache', async () => {
    let called = false;
    server.once(Notifications.ALLOWLIST_REMOVED, item => {
        called = true;
        expect(item).toStrictEqual(ATERNOS);
    });
    connection.emit(Notifications.ALLOWLIST_REMOVED, [ATERNOS]);
    expect(called).toBe(true);
});

test('IP Ban remove without cache', async () => {
    let called = false;
    const ip = "1.1.1.1";
    server.once(Notifications.IP_BAN_REMOVED, item => {
        called = true;
        expect(item).toStrictEqual(ip);
    });
    connection.emit(Notifications.IP_BAN_REMOVED, [ip]);
    expect(called).toBe(true);
});

test('Ban remove without cache', async () => {
    let called = false;
    server.once(Notifications.BAN_REMOVED, item => {
        called = true;
        expect(item).toStrictEqual(ATERNOS);
    });
    connection.emit(Notifications.BAN_REMOVED, [ATERNOS]);
    expect(called).toBe(true);
});



test('OP add with cache', async () => {
    connection.addSuccess([]);
    const ops = server.operatorList();
    expect(await ops.get()).toStrictEqual([]);

    let called = false;
    const operator = new Operator(ATERNOS, 4, false);
    server.once(Notifications.OPERATOR_ADDED, item => {
        called = true;
        expect(item).toStrictEqual(operator);
    });
    connection.emit(Notifications.OPERATOR_ADDED, [operator]);
    expect(called).toBe(true);

    expect(await ops.get()).toStrictEqual([operator]);
});

test('Allowlist add with cache', async () => {
    connection.addSuccess([]);
    const allowlist = server.allowlist();
    expect(await allowlist.get()).toStrictEqual([]);

    let called = false;
    server.once(Notifications.ALLOWLIST_ADDED, item => {
        called = true;
        expect(item).toStrictEqual(ATERNOS);
    });
    connection.emit(Notifications.ALLOWLIST_ADDED, [ATERNOS]);
    expect(called).toBe(true);

    expect(await allowlist.get()).toStrictEqual([ATERNOS]);
});

test('IP Ban add with cache', async () => {
    connection.addSuccess([]);
    const ipBanList = server.ipBanList();
    expect(await ipBanList.get()).toStrictEqual([]);

    let called = false;
    const ban = {ip: "1.1.1.1", reason: "reason", source: "source"};
    const banResult = new IPBan(ban.ip, ban.reason, ban.source);
    server.once(Notifications.IP_BAN_ADDED, item => {
        called = true;
        expect(item).toStrictEqual(banResult);
    });
    connection.emit(Notifications.IP_BAN_ADDED, [ban]);
    expect(called).toBe(true);

    expect(await ipBanList.get()).toStrictEqual([banResult]);
});

test('Ban add with cache', async () => {
    connection.addSuccess([]);
    const banList = server.banList();
    expect(await banList.get()).toStrictEqual([]);

    let called = false;
    const ban = {player: ATERNOS, reason: "reason", source: "source"};
    const banResult = new UserBan(ban.player, ban.reason, ban.source);
    server.once(Notifications.BAN_ADDED, item => {
        called = true;
        expect(item).toStrictEqual(banResult);
    });
    connection.emit(Notifications.BAN_ADDED, [ban]);
    expect(called).toBe(true);

    expect(await banList.get()).toStrictEqual([banResult]);
});


test('OP remove with cache', async () => {
    const operator = new Operator(ATERNOS, 4, false);
    connection.addSuccess([operator]);
    const ops = server.operatorList();
    expect(await ops.get()).toStrictEqual([operator]);

    let called = false;
    server.once(Notifications.OPERATOR_REMOVED, item => {
        called = true;
        expect(item).toStrictEqual(operator);
    });
    connection.emit(Notifications.OPERATOR_REMOVED, [operator]);
    expect(called).toBe(true);

    expect(await ops.get()).toStrictEqual([]);
});

test('Allowlist remove with cache', async () => {
    connection.addSuccess([ATERNOS]);
    const allowlist = server.allowlist();
    expect(await allowlist.get()).toStrictEqual([ATERNOS]);

    let called = false;
    server.once(Notifications.ALLOWLIST_REMOVED, item => {
        called = true;
        expect(item).toStrictEqual(ATERNOS);
    });
    connection.emit(Notifications.ALLOWLIST_REMOVED, [ATERNOS]);
    expect(called).toBe(true);

    expect(await allowlist.get()).toStrictEqual([]);
});

test('IP Ban remove with cache', async () => {
    const ip = "1.1.1.1";
    const banResult = new IPBan(ip, "reason", "source", new Date());
    connection.addSuccess([banResult]);
    const ipBanList = server.ipBanList();
    expect(await ipBanList.get()).toStrictEqual([banResult]);

    let called = false;
    server.once(Notifications.IP_BAN_REMOVED, item => {
        called = true;
        expect(item).toStrictEqual(ip);
    });
    connection.emit(Notifications.IP_BAN_REMOVED, [ip]);
    expect(called).toBe(true);

    expect(await ipBanList.get()).toStrictEqual([]);
});

test('Ban remove with cache', async () => {
    const banResult = new UserBan(ATERNOS, "reason", "source");
    connection.addSuccess([]);
    const banList = server.banList();
    expect(await banList.get()).toStrictEqual([]);

    let called = false;
    server.once(Notifications.BAN_REMOVED, item => {
        called = true;
        expect(item).toStrictEqual(banResult.player);
    });
    connection.emit(Notifications.BAN_REMOVED, [ATERNOS]);
    expect(called).toBe(true);

    expect(await banList.get()).toStrictEqual([]);
});

test('Game rule updated without cache', async () => {
    let called = false;
    server.once(Notifications.GAME_RULE_UPDATED, rule => {
        called = true;
        expect(rule).toStrictEqual(new TypedGameRule(GameRuleType.BOOLEAN, "doDaylightCycle", false));
    });

    connection.emit(Notifications.GAME_RULE_UPDATED, [{ key: "doDaylightCycle", type: GameRuleType.BOOLEAN, value: "false" }]);
    expect(called).toBe(true);
});

test('Game rule updated with cache', async () => {
    connection.addSuccess([{ key: "doDaylightCycle", type: GameRuleType.BOOLEAN, value: "true" }]);
    expect(await server.getGameRules()).toStrictEqual(new Map([["doDaylightCycle", new TypedGameRule(GameRuleType.BOOLEAN, "doDaylightCycle", true)]]));

    let called = false;
    const postGameRule = new TypedGameRule(GameRuleType.BOOLEAN, "doDaylightCycle", false);
    server.once(Notifications.GAME_RULE_UPDATED, rule => {
        called = true;
        expect(rule).toStrictEqual(postGameRule);
    });

    connection.emit(Notifications.GAME_RULE_UPDATED, [{ key: "doDaylightCycle", type: GameRuleType.BOOLEAN, value: "false" }]);
    expect(called).toBe(true);
    expect(await server.getGameRules()).toStrictEqual(new Map([["doDaylightCycle", postGameRule]]));
});

test('Update server status', async () => {
    const postState = new ServerState([ATERNOS, EXAROTON], true, new Version("1.21.9", 773))
    let called = false;
    server.once(Notifications.SERVER_STATUS, state => {
        called = true;
        expect(state).toStrictEqual(postState);
    });

    connection.emit(Notifications.SERVER_STATUS, [postState]);
    expect(called).toBe(true);
    expect(await server.getStatus()).toStrictEqual(postState);
});

test('Test by name', async () => {
    const postState = new ServerState([ATERNOS, EXAROTON], true, new Version("1.21.9", 773))
    let called = false;
    server.once(Notifications.SERVER_STATUS, state => {
        called = true;
        expect(state).toStrictEqual(postState);
    });

    connection.emit(Notifications.SERVER_STATUS, {status: postState});
    expect(called).toBe(true);
});

test('Remove IP ban incorrect type', async () => {
    let called = false;
    server.on('error', e => {
        expect(e).toStrictEqual(new IncorrectTypeError("string", "number", [123], "0"));
        called = true;
    });
    connection.emit(Notifications.IP_BAN_REMOVED, [123])
    expect(called).toBe(true);
});

test('Missing parameter', async () => {
    let called = false;
    server.on('error', e => {
        expect(e).toStrictEqual(new Error(`Could not get parameter 'player' (0) from notification data: undefined`));
        called = true;
    });
    connection.emit(Notifications.BAN_REMOVED)
    expect(called).toBe(true);
});

