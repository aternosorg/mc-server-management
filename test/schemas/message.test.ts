import {expect, test} from "vitest";
import {Message} from "../../src";

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
