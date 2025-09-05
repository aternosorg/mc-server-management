import {ATERNOS, EXAROTON, getServer} from "./utils.js";
import {expect, test} from "vitest";
import TestConnection from "./TestConnection.js";
import MinecraftServer from "../src/MinecraftServer.js";
import {KickPlayer} from "../src/schemas/kick.js";
import {Player} from "../src/schemas/player.js";
import {Message} from "../src/schemas/message.js";

const server = await getServer();

test('Get connected players', async () => {
    const players = await server.getConnectedPlayers();
    expect(players).toStrictEqual([]);
});

test('Get mocked connected players', async () => {
    const connection = new TestConnection();
    const server = new MinecraftServer(connection);
    connection.addResult([ATERNOS, EXAROTON]);

    const players = await server.getConnectedPlayers();
    expect(players).toStrictEqual([ATERNOS, EXAROTON]);
    const history = connection.shiftRequestHistory();
    expect(history).toStrictEqual({method: 'minecraft:players', parameters: []});
});

test('Kick player', async () => {
    for (const argument of [
        new KickPlayer(Player.withName(ATERNOS.name!)),
        new KickPlayer([Player.withName(ATERNOS.name!), Player.withId(EXAROTON.id!)]),
    ]) {
        const response = await server.kickPlayers(argument)
        expect(response).toStrictEqual([]);
    }
});

test('Kick player with message', async () => {
    const response = await server.kickPlayers(new KickPlayer(
        Player.withName(ATERNOS.name!),
        Message.literal("You have been kicked"),
    ));
    expect(response).toStrictEqual([]);
});

test('Test kick players with result', async () => {
    const connection = new TestConnection();
    const server = new MinecraftServer(connection);
    connection.addResult([ATERNOS, EXAROTON]);

    const response = await server.kickPlayers(new KickPlayer(
        [Player.withName(ATERNOS.name!), Player.withId(EXAROTON.id!)],
        Message.literal("You have been kicked"),
    ));
    expect(response).toStrictEqual([ATERNOS, EXAROTON]);

    const history = connection.shiftRequestHistory();
    expect(history).toEqual({
        method: 'minecraft:players/kick',
        parameters: [{
            players: [
                {id: undefined, name: ATERNOS.name},
                {id: EXAROTON.id, name: undefined}
            ],
            message: {
                literal: "You have been kicked",
                translatable: undefined,
                translatableParams: undefined,
            }
        }]
    });
});


