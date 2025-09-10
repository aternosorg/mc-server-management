import {ATERNOS, EXAROTON, getServer} from "./utils.js";
import {expect, test} from "vitest";
import TestConnection from "./TestConnection.js";
import MinecraftServer from "../src/MinecraftServer.js";
import {KickPlayer} from "../src/schemas/kick.js";
import {Player} from "../src/schemas/player.js";
import {Message} from "../src/schemas/message.js";
import IncorrectTypeError from "../src/error/IncorrectTypeError.js";
import {GameRuleType, TypedGameRule} from "../src/schemas/gamerule.js";
import MissingPropertyError from "../src/error/MissingPropertyError.js";

const server = await getServer();

test('Get real server status', async () => {
    const status = await server.getStatus();
    expect(status.started).toBeTypeOf("boolean");
    expect(status.players.length).toStrictEqual(0);
    expect(status.version).toBeDefined();
    expect(status.version.name).toBeDefined();
    expect(status.version.protocol).toBeGreaterThan(772);
});

test('Get test server status', async () => {
    const connection = new TestConnection();
    const server = new MinecraftServer(connection);
    connection.addResponse({
        started: true,
        players: [{id: ATERNOS.id, name: ATERNOS.name}],
        version: {name: "1.21.9", protocol: 773}
    });
    const status = await server.getStatus();
    expect(status.started).toStrictEqual(true);
    expect(status.players).toStrictEqual([ATERNOS]);
    expect(status.version.name).toStrictEqual("1.21.9");
    expect(status.version.protocol).toStrictEqual(773);

    const history = connection.shiftRequestHistory();
    expect(history).toStrictEqual({method: 'minecraft:server/status', parameters: []});
});

test('Save server', async () => {
    await server.save();
    await server.save(true);
});

test('Save server invalid response', async () => {
    const connection = new TestConnection();
    const server = new MinecraftServer(connection);
    connection.addResponse("invalid");

    await expect(server.save()).rejects.toThrow(
        new IncorrectTypeError("boolean", "string", "invalid")
    );
});

test('Get connected players', async () => {
    const players = await server.getConnectedPlayers();
    expect(players).toStrictEqual([]);
});

test('Get mocked connected players', async () => {
    const connection = new TestConnection();
    const server = new MinecraftServer(connection);
    connection.addResponse([ATERNOS, EXAROTON]);

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
    connection.addResponse([ATERNOS, EXAROTON]);

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

test('Stop server', async () => {
    const connection = new TestConnection();
    const server = new MinecraftServer(connection);
    connection.addResponse(true);

    const result = await server.stop();
    expect(result).toStrictEqual(true);
});

test('Stop server invalid response', async () => {
    const connection = new TestConnection();
    const server = new MinecraftServer(connection);
    connection.addResponse("invalid");

    await expect(server.stop()).rejects.toThrow(
        new IncorrectTypeError("boolean", "string", "invalid")
    );
});

test('Get game rules', async () => {
    const gameRules = await server.getGameRules();
    expect(gameRules).toBeInstanceOf(Map);
    expect(gameRules.size).toBeGreaterThan(0);
    expect(gameRules.get("randomTickSpeed")?.value).toBeTypeOf("number");
    expect(gameRules.get("randomTickSpeed")?.type).toStrictEqual(GameRuleType.INTEGER);
    expect(gameRules.get("randomTickSpeed")?.key).toStrictEqual("randomTickSpeed");
});

test('Update game rules', async () => {
    let res = await server.updateGameRule("randomTickSpeed", 0);
    expect(res.key).toStrictEqual("randomTickSpeed");
    expect(res.value).toStrictEqual(0);
    expect(res.type).toStrictEqual(GameRuleType.INTEGER);

    res = await server.updateGameRule("randomTickSpeed", 3);
    expect(res.key).toStrictEqual("randomTickSpeed");
    expect(res.value).toStrictEqual(3);
    expect(res.type).toStrictEqual(GameRuleType.INTEGER);

    res = await server.updateGameRule("doDaylightCycle", false);
    expect(res.key).toStrictEqual("doDaylightCycle");
    expect(res.value).toStrictEqual(false);
    expect(res.type).toStrictEqual(GameRuleType.BOOLEAN);
});

test('Test gamerule caching', async () => {
    const connection = new TestConnection();
    const server = new MinecraftServer(connection);

    connection.addResponse([
        {key: "doDaylightCycle", value: "true", type: "boolean"},
        {key: "maxEntityCramming", value: "24", type: "integer"},
    ]);

    let gameRules = await server.getGameRules();
    expect(gameRules.size).toStrictEqual(2);
    expect(gameRules.get("doDaylightCycle")).toStrictEqual(new TypedGameRule(
        GameRuleType.BOOLEAN,
        "doDaylightCycle",
        true,
    ));
    expect(gameRules.get("maxEntityCramming")).toStrictEqual(new TypedGameRule(
        GameRuleType.INTEGER,
        "maxEntityCramming",
        24,
    ));

    // Call again, should use cache
    gameRules = await server.getGameRules();
    expect(gameRules.size).toStrictEqual(2);
    expect(gameRules.get("doDaylightCycle")).toStrictEqual(new TypedGameRule(
        GameRuleType.BOOLEAN,
        "doDaylightCycle",
        true,
    ));
    expect(gameRules.get("maxEntityCramming")).toStrictEqual(new TypedGameRule(
        GameRuleType.INTEGER,
        "maxEntityCramming",
        24,
    ));

    // Update a gamerule, should update cache
    connection.addResponse({key: "maxEntityCramming", value: "10", type: "integer"});
    const updatedRule = await server.updateGameRule("maxEntityCramming", 10);
    expect(updatedRule.key).toStrictEqual("maxEntityCramming");
    expect(updatedRule.value).toStrictEqual(10);
    expect(updatedRule.type).toStrictEqual(GameRuleType.INTEGER);

    gameRules = await server.getGameRules();
    expect(gameRules.size).toStrictEqual(2);
    expect(gameRules.get("doDaylightCycle")).toStrictEqual(new TypedGameRule(
        GameRuleType.BOOLEAN,
        "doDaylightCycle",
        true,
    ));
    expect(gameRules.get("maxEntityCramming")).toStrictEqual(new TypedGameRule(
        GameRuleType.INTEGER,
        "maxEntityCramming",
        10,
    ));
});

test('Test GameRules invalid response', async () => {
    const connection = new TestConnection();
    const server = new MinecraftServer(connection);

    let response: unknown = connection.addResponse("invalid");
    await expect(server.getGameRules(true)).rejects.toThrow(
        new IncorrectTypeError("array", "string", response)
    );

    response = connection.addResponse(["invalid"]);
    await expect(server.getGameRules(true)).rejects.toThrow(
        new IncorrectTypeError("object", "string", response, '0')
    );

    response = connection.addResponse([{}]);
    await expect(server.getGameRules(true)).rejects.toThrow(
        new MissingPropertyError("key", response, "0")
    );

    response = connection.addResponse([{key: 123, value: "true", type: "boolean"}]);
    await expect(server.getGameRules(true)).rejects.toThrow(
        new IncorrectTypeError("string", "number", response, "0", "key")
    );

    response = connection.addResponse([{key: "doDaylightCycle"}]);
    await expect(server.getGameRules(true)).rejects.toThrow(
        new MissingPropertyError("value", response, "0")
    );

    response = connection.addResponse([{key: "doDaylightCycle", value: true, type: "boolean"}]);
    await expect(server.getGameRules(true)).rejects.toThrow(
        new IncorrectTypeError("string", "boolean", response, "0", "value")
    );

    response = connection.addResponse([{key: "doDaylightCycle", value: "true"}]);
    await expect(server.getGameRules(true)).rejects.toThrow(
        new MissingPropertyError("type", response, "0")
    );

    response = connection.addResponse([{key: "doDaylightCycle", value: "true", type: 123}]);
    await expect(server.getGameRules(true)).rejects.toThrow(
        new IncorrectTypeError("string", "number", response, "0", "type")
    );
});
