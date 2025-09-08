import {expect, test} from "vitest";
import {Message, SystemMessage} from "../../src/schemas/message.js";
import {ATERNOS, EXAROTON} from "../utils.js";

test('Translatable', () => {
    const message = Message.translatable("chat.type.text", ["User", "Hello world!"]);
    expect(message.literal).toBeUndefined();
    expect(message.translatable).toBe("chat.type.text");
    expect(message.translatableParams).toStrictEqual(["User", "Hello world!"]);
    message.setTranslatable("multiplayer.player.joined").setTranslatableParams(["User"]);
    expect(message.translatable).toBe("multiplayer.player.joined");
    expect(message.translatableParams).toStrictEqual(["User"]);
    message.addTranslatableParam("Extra");
    expect(message.translatableParams).toStrictEqual(["User", "Extra"]);
    message.addTranslatableParam(["Params", "Here"]);
    expect(message.translatableParams).toStrictEqual(["User", "Extra", "Params", "Here"]);
});

test('System Message', () => {
    const message = new SystemMessage(Message.literal("Test message."));
    expect(message.message.literal).toBe("Test message.");
    expect(message.overlay).toBe(false);
    expect(message.receivingPlayers).toBeUndefined();
    message.setOverlay(true);
    expect(message.overlay).toBe(true);
    message.setReceivingPlayers([ATERNOS, EXAROTON]);
    expect(message.receivingPlayers).toStrictEqual([ATERNOS , EXAROTON]);
    message.setReceivingPlayers();
    expect(message.receivingPlayers).toBeUndefined();
    message.addReceivingPlayer(ATERNOS);
    expect(message.receivingPlayers).toStrictEqual([ATERNOS]);
    message.addReceivingPlayer([EXAROTON]);
    expect(message.receivingPlayers).toStrictEqual([ATERNOS, EXAROTON]);

    message.setMessage(Message.translatable("multiplayer.player.joined", ["User"]))
    expect(message.message.translatable).toBe("multiplayer.player.joined");
    expect(message.message.translatableParams).toStrictEqual(["User"]);
    expect(message.message.literal).toBeUndefined();
});
