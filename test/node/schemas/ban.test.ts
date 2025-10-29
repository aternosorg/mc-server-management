import {expect, test} from "vitest";
import {IncomingIPBan, IPBan, UserBan} from "../../../src";
import {ATERNOS, EXAROTON} from "../../constants";

test('Get expires as date', () => {
    const ban = new UserBan(ATERNOS).setExpires("2024-12-31T23:59:59Z");
    expect(ban.getExpiresAsDate()).toStrictEqual(new Date("2024-12-31T23:59:59Z"));
});

test('Get expires as date null', () => {
    const ban = new UserBan(ATERNOS).setExpires(null);
    expect(ban.getExpiresAsDate()).toBeNull();
});

test('Get expires as date invalid', () => {
    const ban = new UserBan(ATERNOS).setExpires("invalid date");
    expect(ban.getExpiresAsDate()).toBeNull();
});

test('Set expires invalid date', () => {
    expect(() => {
        const ban = new UserBan(ATERNOS).setExpires(new Date("invalid date"));
    }).toThrow("Invalid date.");
});

test('Set expires invalid type', () => {
    expect(() => {
        // @ts-ignore
        const ban = new UserBan(ATERNOS).setExpires(123);
    }).toThrow("Expires must be a Date, string in ISO 8601 format or null.");
});

test('IPBan with online player', () => {
    const ban = IncomingIPBan.withConnectedPlayer(ATERNOS);
    expect(ban.player).toStrictEqual(ATERNOS);
});

test('IncomingIPBan set ip', () => {
    const ban = new IncomingIPBan().setIp("1.1.1.1");
    expect(ban.ip).toBe("1.1.1.1");
});

test('IncomingIPBan set player', () => {
    const ban = new IncomingIPBan().setPlayer(ATERNOS);
    expect(ban.player).toBe(ATERNOS);
});

test('IPBan set ip', () => {
    const ban = new IPBan("1.1.1.1").setIp("8.8.8.8");
    expect(ban.ip).toBe("8.8.8.8");
});

test('UserBan set player', () => {
    const ban = new UserBan(ATERNOS).setPlayer(EXAROTON);
    expect(ban.player).toBe(EXAROTON);
});
