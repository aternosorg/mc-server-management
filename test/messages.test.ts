import {ATERNOS, EXAROTON, getServer} from "./utils.js";
import TestConnection from "./TestConnection.js";
import {expect, test} from "vitest";
import {IncorrectTypeError, Message, MinecraftServer, Player, SystemMessage} from "../src";

for (let server of [null, await getServer()]) {
    let testConnection: TestConnection|null = null;
    if (server === null) {
        testConnection = new TestConnection();
        server = new MinecraftServer(testConnection);
    }

    test('Send literal system message without overlay', async () => {
        testConnection?.addResponse(true);

        const result = await server.sendSystemMessage(new SystemMessage(Message.literal("Hello World")));
        expect(result).toBe(true);

        if (testConnection) {
            const history = testConnection.shiftRequestHistory();
            expect(history).toEqual({
                method: 'minecraft:server/system_message',
                parameters: [{
                    message: {literal: "Hello World"},
                    overlay: false
                }]
            });
        }
    });

    test('Send translatable system message without overlay', async () => {
        testConnection?.addResponse(true);

        const result = await server.sendSystemMessage(new SystemMessage(
            Message.translatable("Hello World", ["1"])
        ));
        expect(result).toBe(true);

        if (testConnection) {
            const history = testConnection.shiftRequestHistory();
            expect(history).toEqual({
                method: 'minecraft:server/system_message',
                parameters: [{
                    message: {translatable: "Hello World", translatableParams: ["1"]},
                    overlay: false
                }]
            });
        }
    });

    test('Send translatable system message with overlay', async () => {
        testConnection?.addResponse(true);

        const result = await server.sendSystemMessage(new SystemMessage(
            Message.translatable("Hello World", ["1"]),
            true
        ));
        expect(result).toBe(true);

        if (testConnection) {
            const history = testConnection.shiftRequestHistory();
            expect(history).toEqual({
                method: 'minecraft:server/system_message',
                parameters: [{
                    message: {translatable: "Hello World", translatableParams: ["1"]},
                    overlay: true
                }]
            });
        }
    });

    test('Send translatable system message with overlay to targets', async () => {
        testConnection?.addResponse(true);

        const result = await server.sendSystemMessage(new SystemMessage(
            Message.translatable("Hello World", ["1"]),
            true,
            [Player.withName(ATERNOS.name!), Player.withId(EXAROTON.id!)]
        ));
        expect(result).toBe(true);

        if (testConnection) {
            const history = testConnection.shiftRequestHistory();
            expect(history).toEqual({
                method: 'minecraft:server/system_message',
                parameters: [{
                    message: {translatable: "Hello World", translatableParams: ["1"]},
                    overlay: true,
                    receivingPlayers: [{
                        name: ATERNOS.name
                    }, {
                        id: EXAROTON.id
                    }],
                }]
            });
        }
    });
}

test('Check system message incorrect type', async () => {
    const connection = new TestConnection();
    const server = new MinecraftServer(connection);
    connection.addResponse("test");

    await expect(server.sendSystemMessage(new SystemMessage(Message.literal("Hello World")))).rejects.toThrow(
        new IncorrectTypeError("boolean", "string", "test")
    );
});
