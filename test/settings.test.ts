import {getServer} from "./utils.js";
import {expect, test} from "vitest";
import {Difficulty, GameMode, IncorrectTypeError, ServerSettings} from "../src";
import TestConnection from "./TestConnection.js";

const server = await getServer();
const settings = server.settings();

test('Auto Save', async () => {
    await settings.setAutoSave(true);
    expect(await settings.getAutoSave()).toBe(true);
    await settings.setAutoSave(false);
    expect(await settings.getAutoSave()).toBe(false);
});

for (const difficulty of Object.values(Difficulty)) {
    test(`Difficulty ${difficulty}`, async () => {
        await settings.setDifficulty(difficulty);
        expect(await settings.getDifficulty()).toBe(difficulty);
    });
}

test('Enforce Allow List', async () => {
    await settings.setEnforceAllowList(true);
    expect(await settings.getEnforceAllowList()).toBe(true);
    await settings.setEnforceAllowList(false);
    expect(await settings.getEnforceAllowList()).toBe(false);
});

test('Use Allow List', async () => {
    await settings.setUseAllowList(true);
    expect(await settings.getUseAllowList()).toBe(true);
    await settings.setUseAllowList(false);
    expect(await settings.getUseAllowList()).toBe(false);
});

test('Max Players', async () => {
    await settings.setMaxPlayers(10);
    expect(await settings.getMaxPlayers()).toBe(10);
    await settings.setMaxPlayers(5);
    expect(await settings.getMaxPlayers()).toBe(5);
});

test('Pause When Empty Seconds', async () => {
    await settings.setPauseWhenEmptySeconds(10);
    expect(await settings.getPauseWhenEmptySeconds()).toBe(10);
    await settings.setPauseWhenEmptySeconds(0);
    expect(await settings.getPauseWhenEmptySeconds()).toBe(0);
});

test('Player Idle Timeout Seconds', async () => {
    await settings.setPlayerIdleTimeout(10);
    expect(await settings.getPlayerIdleTimeout()).toBe(10);
    await settings.setPlayerIdleTimeout(0);
    expect(await settings.getPlayerIdleTimeout()).toBe(0);
});

test('Allow Flight', async () => {
    await settings.setAllowFlight(true);
    expect(await settings.getAllowFlight()).toBe(true);
    await settings.setAllowFlight(false);
    expect(await settings.getAllowFlight()).toBe(false);
});

test('MOTD', async () => {
    await settings.setMOTD("Server Management Protocol Test Server");
    expect(await settings.getMOTD()).toBe("Server Management Protocol Test Server");
    await settings.setMOTD("Another MOTD");
    expect(await settings.getMOTD()).toBe("Another MOTD");
});

test('Spawn Protection Radius', async () => {
    await settings.setSpawnProtectionRadius(10);
    expect(await settings.getSpawnProtectionRadius()).toBe(10);
    await settings.setSpawnProtectionRadius(0);
    expect(await settings.getSpawnProtectionRadius()).toBe(0);
});

test('Force Game Mode', async () => {
    await settings.setForceGameMode(true);
    expect(await settings.getForceGameMode()).toBe(true);
    await settings.setForceGameMode(false);
    expect(await settings.getForceGameMode()).toBe(false);
});

for (const mode of Object.values(GameMode)) {
    test(`Game Mode: ${mode}`, async () => {
        await settings.setGameMode(mode);
        expect(await settings.getGameMode()).toBe(mode);
    });
}

test('View Distance', async () => {
    await settings.setViewDistance(10);
    expect(await settings.getViewDistance()).toBe(10);
    await settings.setViewDistance(5);
    expect(await settings.getViewDistance()).toBe(5);
});

test('Simulation Distance', async () => {
    await settings.setSimulationDistance(10);
    expect(await settings.getSimulationDistance()).toBe(10);
    await settings.setSimulationDistance(5);
    expect(await settings.getSimulationDistance()).toBe(5);
});

test('Accept Transfers', async () => {
    await settings.setAcceptTransfers(true);
    expect(await settings.getAcceptTransfers()).toBe(true);
    await settings.setAcceptTransfers(false);
    expect(await settings.getAcceptTransfers()).toBe(false);
});

test('Status Heartbeat Interval', async () => {
    await settings.setStatusHeartbeatInterval(10);
    expect(await settings.getStatusHeartbeatInterval()).toBe(10);
    await settings.setStatusHeartbeatInterval(5);
    expect(await settings.getStatusHeartbeatInterval()).toBe(5);
});

for (let level = 1; level <= 4; level++) {
    test(`Operator User Permission Level ${level}`, async () => {
        await settings.setOperatorUserPermissionLevel(level);
        expect(await settings.getOperatorUserPermissionLevel()).toBe(level);
    });
}

test('Hide Online Players', async () => {
    await settings.setHideOnlinePlayers(true);
    expect(await settings.getHideOnlinePlayers()).toBe(true);
    await settings.setHideOnlinePlayers(false);
    expect(await settings.getHideOnlinePlayers()).toBe(false);
});

test('Status Replies', async () => {
    await settings.setStatusReplies(false);
    expect(await settings.getStatusReplies()).toBe(false);
    await settings.setStatusReplies(true);
    expect(await settings.getStatusReplies()).toBe(true);
});

test('Entity Broadcast Range', async () => {
    await settings.setEntityBroadcastRange(10);
    expect(await settings.getEntityBroadcastRange()).toBe(10);
    await settings.setEntityBroadcastRange(50);
    expect(await settings.getEntityBroadcastRange()).toBe(50);
});

test('Invalid response boolean', async () => {
    const connection = new TestConnection();
    const settings = new ServerSettings(connection);
    connection.addResponse("not a boolean");
    await expect(settings.setAutoSave(true)).rejects.toThrow(
        new IncorrectTypeError("boolean", "string", "not a boolean")
    );
});

test('Invalid response number', async () => {
    const connection = new TestConnection();
    const settings = new ServerSettings(connection);
    connection.addResponse("not a number");
    await expect(settings.setMaxPlayers(10)).rejects.toThrow(
        new IncorrectTypeError("number", "string", "not a number")
    );
});

test('Invalid response string', async () => {
    const connection = new TestConnection();
    const settings = new ServerSettings(connection);
    connection.addResponse(123);
    await expect(settings.setMOTD("test")).rejects.toThrow(
        new IncorrectTypeError("string", "number", 123)
    );
});
