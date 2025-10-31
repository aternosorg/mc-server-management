import {ATERNOS, EXAROTON} from "../constants";
import {getServer} from "./setup/connections";
import TestConnection from "../TestConnection";
import {expect, test} from "vitest";
import {IncorrectTypeError, Message, MinecraftServer, Player} from "../../src";

for (let server of [null, await getServer()]) {
    let testConnection: TestConnection | null = null;
    if (server === null) {
        testConnection = new TestConnection();
        server = new MinecraftServer(testConnection);
    }

    test('Send literal system message without overlay', async () => {
        testConnection?.addSuccess(true);

        const result = await server.sendSystemMessage("Hello World");
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
        testConnection?.addSuccess(true);

        const result = await server.sendSystemMessage(
            Message.translatable("Hello World", ["1"])
        );
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
        testConnection?.addSuccess(true);

        const result = await server.sendSystemMessage(
            Message.translatable("Hello World", ["1"]),
            null,
            true
        );
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
        testConnection?.addSuccess(true);

        const result = await server.sendSystemMessage(
            Message.translatable("Hello World", ["1"]),
            [ATERNOS.name!, Player.withId(EXAROTON.id!)],
        true,
        );
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
    connection.addSuccess("test");

    await expect(server.sendSystemMessage(Message.literal("Hello World"))).rejects.toThrow(
        new IncorrectTypeError("boolean", "string", "test")
    );
});
