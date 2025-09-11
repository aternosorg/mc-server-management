import Connection from "../connection/Connection";
import IncorrectTypeError from "../error/IncorrectTypeError";
import Difficulty from "../schemas/server/Difficulty";
import GameMode from "../schemas/server/GameMode";

/**
 * An API wrapper for the settings of the Minecraft server.
 */
export default class ServerSettings {
    #connection: Connection;

    /**
     * Create an API wrapper for the server settings. Use {@link MinecraftServer.settings}.
     * @param connection
     * @internal
     */
    constructor(connection: Connection) {
        this.#connection = connection;
    }

    /**
     * Get whether the server automatically saves the world periodically.
     * @returns {Promise<boolean>} True if the server automatically saves the world, false otherwise.
     */
    async getAutoSave(): Promise<boolean> {
        return this.#assertBoolean(
            await this.#connection.call('minecraft:serversettings/autosave', []),
        );
    }

    /**
     * Set whether the server automatically saves the world periodically.
     * @param value True to enable auto-saving, false to disable it.
     */
    async setAutoSave(value: boolean): Promise<void> {
        this.#assertBoolean(await this.#connection.call('minecraft:serversettings/autosave/set', [value]));
    }

    /**
     * Get the current difficulty level of the server.
     * @returns {Promise<Difficulty>} The current difficulty level.
     */
    async getDifficulty(): Promise<Difficulty> {
        return this.#assertString(
            await this.#connection.call('minecraft:serversettings/difficulty', []),
            "Difficulty"
        ) as Difficulty;
    }

    /**
     * Set the difficulty level of the server.
     * @param value The difficulty level to set.
     */
    async setDifficulty(value: Difficulty): Promise<void> {
        this.#assertString(await this.#connection.call('minecraft:serversettings/difficulty/set', [value]))
    }

    /**
     * Get whether the server immediately kicks players when they are removed from the allowlist.
     * @returns {Promise<boolean>} If true, players are kicked when removed from the allowlist.
     */
    async getEnforceAllowList(): Promise<boolean> {
        return this.#assertBoolean(
            await this.#connection.call('minecraft:serversettings/enforce_allowlist', []),
        );
    }

    /**
     * Set whether the server immediately kicks players when they are removed from the allowlist.
     * @param value True to enable enforcement, false to disable it.
     */
    async setEnforceAllowList(value: boolean): Promise<void> {
        this.#assertBoolean(await this.#connection.call('minecraft:serversettings/enforce_allowlist/set', [value]));
    }

    /**
     * Get whether the server uses the allow list.
     * @returns {Promise<boolean>} True if the server uses the allow list, false otherwise.
     */
    async getUseAllowList(): Promise<boolean> {
        return this.#assertBoolean(
            await this.#connection.call('minecraft:serversettings/use_allowlist', []),
        );
    }

    /**
     * Set whether the server uses the allow list.
     * @param value True to enable the allow list, false to disable it.
     */
    async setUseAllowList(value: boolean): Promise<void> {
        this.#assertBoolean(await this.#connection.call('minecraft:serversettings/use_allowlist/set', [value]));
    }

    /**
     * Get the maximum number of players that can join the server.
     * @returns {Promise<number>} The maximum number of players.
     */
    async getMaxPlayers(): Promise<number> {
        return this.#assertNumber(
            await this.#connection.call('minecraft:serversettings/max_players', [])
        );
    }

    /**
     * Set the maximum number of players that can join the server.
     * @param value The maximum number of players.
     */
    async setMaxPlayers(value: number): Promise<void> {
        this.#assertNumber(await this.#connection.call('minecraft:serversettings/max_players/set', [value]));
    }

    /**
     * Get the number of seconds the server waits before pausing when no players are online.
     * A non-positive value means the server never pauses.
     * @returns {Promise<number>} The number of seconds before pausing when empty.
     */
    async getPauseWhenEmptySeconds(): Promise<number> {
        return this.#assertNumber(
            await this.#connection.call('minecraft:serversettings/pause_when_empty_seconds', [])
        );
    }

    /**
     * Set the number of seconds the server waits before pausing when no players are online.
     * A non-positive value means the server never pauses.
     * @param value The number of seconds before pausing when empty.
     */
    async setPauseWhenEmptySeconds(value: number): Promise<void> {
        this.#assertNumber(await this.#connection.call('minecraft:serversettings/pause_when_empty_seconds/set', [value]));
    }

    /**
     * Get the number of minutes a player can be idle before being kicked.
     * Value 0 means players are never kicked for idling.
     * @returns {Promise<number>} The number of minutes before kicking idle players.
     */
    async getPlayerIdleTimeout(): Promise<number> {
        return this.#assertNumber(
            await this.#connection.call('minecraft:serversettings/player_idle_timeout', [])
        );
    }

    /**
     * Set the number of minutes a player can be idle before being kicked.
     * Value 0 means players are never kicked for idling.
     * @param value The number of minutes before kicking idle players.
     */
    async setPlayerIdleTimeout(value: number): Promise<void> {
        this.#assertNumber(await this.#connection.call('minecraft:serversettings/player_idle_timeout/set', [value]));
    }

    /**
     * Get whether players are allowed to fly on the server. This only changes the flight detection, it does not
     * enable flight for players in survival mode without a hacked client.
     * @returns {Promise<boolean>} True if players are allowed to fly, false otherwise.
     */
    async getAllowFlight(): Promise<boolean> {
        return this.#assertBoolean(
            await this.#connection.call('minecraft:serversettings/allow_flight', []),
        );
    }

    /**
     * Set whether players are allowed to fly on the server. This only changes the flight detection, it does not
     * enable flight for players in survival mode without a hacked client.
     * @param value True to allow flying, false to disable it.
     */
    async setAllowFlight(value: boolean): Promise<void> {
        this.#assertBoolean(await this.#connection.call('minecraft:serversettings/allow_flight/set', [value]));
    }

    /**
     * Get the message of the day (MOTD) of the server.
     * @returns {Promise<string>} The MOTD of the server.
     */
    async getMOTD(): Promise<string> {
        return this.#assertString(
            await this.#connection.call('minecraft:serversettings/motd', [])
        );
    }

    /**
     * Set the message of the day (MOTD) of the server.
     * @param value The MOTD to set.
     */
    async setMOTD(value: string): Promise<void> {
        this.#assertString(await this.#connection.call('minecraft:serversettings/motd/set', [value]));
    }

    /**
     * Get the radius around the world spawn point that is protected from non-operator players.
     * @returns {Promise<number>} The spawn protection radius.
     */
    async getSpawnProtectionRadius(): Promise<number> {
        return this.#assertNumber(
            await this.#connection.call('minecraft:serversettings/spawn_protection_radius', [])
        );
    }

    /**
     * Set the radius around the world spawn point that is protected from non-operator players.
     * @param value The spawn protection radius.
     */
    async setSpawnProtectionRadius(value: number): Promise<void> {
        this.#assertNumber(await this.#connection.call('minecraft:serversettings/spawn_protection_radius/set', [value]));
    }

    /**
     * Get whether players are forced to use the server's game mode when they join.
     * @returns {Promise<boolean>} True if players are forced to use the server's game mode, false otherwise.
     */
    async getForceGameMode(): Promise<boolean> {
        return this.#assertBoolean(
            await this.#connection.call('minecraft:serversettings/force_game_mode', []),
        );
    }

    /**
     * Set whether players are forced to use the server's game mode when they join.
     * @param value True to force the server's game mode, false to allow players to use their own.
     */
    async setForceGameMode(value: boolean): Promise<void> {
        this.#assertBoolean(await this.#connection.call('minecraft:serversettings/force_game_mode/set', [value]));
    }

    /**
     * Get the default game mode for players when they join the server for the first time. If force game mode is
     * enabled the game mode will be applied to all players when they join, not just new ones.
     * @returns {Promise<GameMode>} The default game mode.
     */
    async getGameMode(): Promise<GameMode> {
        return this.#assertString(
            await this.#connection.call('minecraft:serversettings/game_mode', []),
            "GameMode"
        ) as GameMode;
    }

    /**
     * Set the default game mode for players when they join the server for the first time. If force game mode is
     * enabled the game mode will be applied to all players when they join, not just new ones.
     * @param value The default game mode.
     */
    async setGameMode(value: GameMode): Promise<void> {
        this.#assertString(await this.#connection.call('minecraft:serversettings/game_mode/set', [value]));
    }

    /**
     * Get the view distance of the server, in chunks.
     * This is the distance in chunks that the server sends to players around them.
     * @returns {Promise<number>} The view distance in chunks.
     */
    async getViewDistance(): Promise<number> {
        return this.#assertNumber(
            await this.#connection.call('minecraft:serversettings/view_distance', [])
        );
    }

    /**
     * Set the view distance of the server, in chunks.
     * This is the distance in chunks that the server sends to players around them.
     * @param value The view distance in chunks.
     */
    async setViewDistance(value: number): Promise<void> {
        this.#assertNumber(await this.#connection.call('minecraft:serversettings/view_distance/set', [value]));
    }

    /**
     * Get the simulation distance of the server, in chunks.
     * This is the distance in chunks that the server simulates around each player.
     * @returns {Promise<number>} The simulation distance in chunks.
     */
    async getSimulationDistance(): Promise<number> {
        return this.#assertNumber(
            await this.#connection.call('minecraft:serversettings/simulation_distance', [])
        );
    }

    /**
     * Set the simulation distance of the server, in chunks.
     * This is the distance in chunks that the server simulates around each player.
     * @param value The simulation distance in chunks.
     */
    async setSimulationDistance(value: number): Promise<void> {
        this.#assertNumber(await this.#connection.call('minecraft:serversettings/simulation_distance/set', [value]));
    }

    /**
     * Get whether the server accepts players transferred from other servers.
     * @returns {Promise<boolean>} True if the server accepts transferred players, false otherwise.
     */
    async getAcceptTransfers(): Promise<boolean> {
        return this.#assertBoolean(
            await this.#connection.call('minecraft:serversettings/accept_transfers', []),
        );
    }

    /**
     * Set whether the server accepts players transferred from other servers.
     * @param value True to accept transferred players, false to reject them.
     */
    async setAcceptTransfers(value: boolean): Promise<void> {
        this.#assertBoolean(await this.#connection.call('minecraft:serversettings/accept_transfers/set', [value]));
    }

    /**
     * Get the interval in seconds between status heartbeats sent to server management clients.
     * A value of 0 means no heartbeats are sent.
     * @returns {Promise<number>} The status heartbeat interval in seconds.
     */
    async getStatusHeartbeatInterval(): Promise<number> {
        return this.#assertNumber(
            await this.#connection.call('minecraft:serversettings/status_heartbeat_interval', [])
        );
    }

    /**
     * Set the interval in seconds between status heartbeats sent to server management clients.
     * A value of 0 means no heartbeats are sent.
     * @param value The status heartbeat interval in seconds.
     */
    async setStatusHeartbeatInterval(value: number): Promise<void> {
        this.#assertNumber(await this.#connection.call('minecraft:serversettings/status_heartbeat_interval/set', [value]));
    }

    /**
     * Get the permission level granted to new operators.
     * Levels are from 1 to 4, with 4 being the highest.
     * @returns {Promise<number>} The operator user permission level.
     */
    async getOperatorUserPermissionLevel(): Promise<number> {
        return this.#assertNumber(
            await this.#connection.call('minecraft:serversettings/operator_user_permission_level', [])
        );
    }

    /**
     * Set the permission level granted to new operators.
     * Levels are from 1 to 4, with 4 being the highest.
     * @param value The operator user permission level.
     */
    async setOperatorUserPermissionLevel(value: number): Promise<void> {
        this.#assertNumber(await this.#connection.call('minecraft:serversettings/operator_user_permission_level/set', [value]));
    }

    /**
     * Get whether the server hides the list of online players from the server list.
     * @returns {Promise<boolean>} True if the server hides the list of online players, false otherwise.
     */
    async getHideOnlinePlayers(): Promise<boolean> {
        return this.#assertBoolean(
            await this.#connection.call('minecraft:serversettings/hide_online_players', []),
        );
    }

    /**
     * Set whether the server hides the list of online players from the server list.
     * @param value True to hide the list of online players, false to show it.
     */
    async setHideOnlinePlayers(value: boolean): Promise<void> {
        this.#assertBoolean(await this.#connection.call('minecraft:serversettings/hide_online_players/set', [value]));
    }

    /**
     * Get whether the server responds to status requests in the multiplayer server list.
     * @returns {Promise<boolean>} True if the server responds to status requests, false otherwise.
     */
    async getStatusReplies(): Promise<boolean> {
        return this.#assertBoolean(
            await this.#connection.call('minecraft:serversettings/status_replies', []),
        );
    }

    /**
     * Set whether the server responds to status requests in the multiplayer server list.
     * @param value True to respond to status requests, false to ignore them.
     */
    async setStatusReplies(value: boolean): Promise<void> {
        this.#assertBoolean(await this.#connection.call('minecraft:serversettings/status_replies/set', [value]));
    }

    /**
     * Get the range in chunks around each player in which entities are updated to the player. This is a percentage
     * value (100 => 100%) of the default value. Min: 10%, Max: 1000%
     * @returns {Promise<number>} The entity broadcast range percentage.
     */
    async getEntityBroadcastRange(): Promise<number> {
        return this.#assertNumber(
            await this.#connection.call('minecraft:serversettings/entity_broadcast_range', [])
        );
    }

    /**
     * Set the range in chunks around each player in which entities are updated to the player. This is a percentage
     * value (100 => 100%) of the default value. Min: 10%, Max: 1000%
     * @param value The entity broadcast range percentage.
     */
    async setEntityBroadcastRange(value: number): Promise<void> {
        this.#assertNumber(await this.#connection.call('minecraft:serversettings/entity_broadcast_range/set', [value]));
    }

    #assertBoolean(value: unknown): boolean {
        if (typeof value !== 'boolean') {
            throw new IncorrectTypeError("boolean", typeof value, value);
        }
        return value;
    }

    #assertString(value: unknown, expected?: string): string {
        if (typeof value !== 'string') {
            throw new IncorrectTypeError(expected ?? "string", typeof value, value);
        }
        return value;
    }

    #assertNumber(value: unknown): number {
        if (typeof value !== 'number') {
            throw new IncorrectTypeError("number", typeof value, value);
        }
        return value;
    }
}
