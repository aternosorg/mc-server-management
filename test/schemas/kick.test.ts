import {expect, test} from "vitest";
import {Message, KickPlayer} from "../../src";
import {ATERNOS, EXAROTON} from "../utils.js";

test("Add Player", () => {
    const kick = new KickPlayer([]);
    kick.addPlayer(ATERNOS);
    expect(kick.players).toStrictEqual([ATERNOS]);
    kick.addPlayer(EXAROTON);
    expect(kick.players).toStrictEqual([ATERNOS, EXAROTON]);
});

test("Set Players", () => {
    const kick = new KickPlayer([ATERNOS]);
    expect(kick.players).toStrictEqual([ATERNOS]);
    kick.setPlayers([EXAROTON]);
    expect(kick.players).toStrictEqual([EXAROTON]);
});

test("Set Message", () => {
    const kick = new KickPlayer([], Message.literal("You have been kicked!"));
    expect(kick.message?.literal).toBe("You have been kicked!");
    kick.setMessage(Message.literal("You have been kicked again!"));
    expect(kick.message?.literal).toBe("You have been kicked again!");
    kick.setMessage();
    expect(kick.message).toBeUndefined();
});
