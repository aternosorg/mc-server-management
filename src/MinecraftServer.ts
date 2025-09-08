import type Connection from "./connection/Connection.js";
import {SystemMessage} from "./schemas/message.js";
import AllowList from "./player-list/AllowList.js";
import IPBanList from "./player-list/IPBanList.js";
import IncorrectTypeError from "./error/IncorrectTypeError.js";
import BanList from "./player-list/BanList.js";
import {Player} from "./schemas/player.js";
import {KickPlayer} from "./schemas/kick.js";
import OperatorList from "./player-list/OperatorList.js";
import {ServerState} from "./schemas/server.js";
import ServerSettings from "./ServerSettings.js";
import {GameRuleType, TypedGameRule, UntypedGameRule} from "./schemas/gamerule.js";

/**
 * This is the main entrypoint for interacting with the Minecraft server management protocol.
 * It provides methods for retrieving server status, managing players, and accessing various server settings and lists.
 */
export default class MinecraftServer {
    #connection: Connection;
    #allowlist?: AllowList;
    #ipBanList?: IPBanList;
    #banList?: BanList;
    #operatorList?: OperatorList;
    #state?: ServerState;
    #gameRules?: Map<string, TypedGameRule<GameRuleType>>;

    /**
     * This is the main entrypoint for interacting with the server management protocol.
     * You probably want to use {@link WebSocketConnection.connect} to create a connection.
     * @param connection The connection to use for communicating with the server.
     */
    constructor(connection: Connection) {
        this.#connection = connection;
    }

    /**
     * Get the current status of the server.
     * @returns {Promise<ServerState>} The current status of the server.
     */
    public async getStatus(force: boolean = false): Promise<ServerState> {
        if (!this.#state || force) {
            const result = await this.#connection.call('minecraft:server/status', []);
            this.#state = ServerState.parse(result);
        }
        return this.#state;
    }

    /**
     * @returns {Promise<Player[]>} Array of players currently connected to the server.
     */
    public async getConnectedPlayers(): Promise<Player[]> {
        const response = await this.#connection.call('minecraft:players', []);
        return Player.parseList(response);
    }

    /**
     * Kicks one or more players from the server.
     * @param player The player or players to kick.
     * @returns {Promise<Player[]>} A promise that resolves to an array of kicked players.
     */
    public async kickPlayers(player: KickPlayer): Promise<Player[]> {
        const response = await this.#connection.call('minecraft:players/kick', [player]);
        return Player.parseList(response);
    }

    /**
     * Save the server state to disk.
     * @param flush Save chunks to disk immediately.
     * @returns {Promise<boolean>} True if any level was saved.
     */
    public async save(flush: boolean = true): Promise<void> {
        const result = await this.#connection.call('minecraft:server/save', [flush]);
        if (typeof result !== 'boolean') {
            throw new IncorrectTypeError("boolean", typeof result, result);
        }
    }

    /**
     * Stop the server.
     * @returns {Promise<boolean>} Always true.
     */
    public async stop(): Promise<boolean> {
        const result = await this.#connection.call('minecraft:server/stop', []);
        if (typeof result !== 'boolean') {
            throw new IncorrectTypeError("boolean", typeof result, result);
        }
        return result;
    }

    /**
     * Sends a system message to the server.
     * @param {SystemMessage} message The system message to send.
     * @returns {Promise<boolean>} A promise that resolves to true if the message was sent successfully, false otherwise.
     */
    async sendSystemMessage(message: SystemMessage): Promise<boolean> {
        const result = await this.#connection.call('minecraft:server/system_message', [message]);
        if (typeof result !== 'boolean') {
            throw new IncorrectTypeError("boolean", typeof result, result);
        }
        return result;
    }

    /**
     * Get the current game rules of the server.
     * @param force Whether to force a refresh of the game rules from the server.
     * @returns {Promise<Map<string, TypedGameRule<GameRuleType>>>} A map of game rule keys to their corresponding game rule objects.
     */
    async getGameRules(force: boolean = false): Promise<Map<string, TypedGameRule<GameRuleType>>> {
        if (!this.#gameRules || force) {
            const result = await this.#connection.call('minecraft:gamerules', []);
            if (!Array.isArray(result)) {
                throw new IncorrectTypeError("array", typeof result, result);
            }

            const gameRules = new Map<string, TypedGameRule<GameRuleType>>();
            for (const [index, item] of result.entries()) {
                gameRules.set(item.key, TypedGameRule.parse(item, result, `${index}`));
            }
            this.#gameRules = gameRules;
        }
        return this.#gameRules;
    }

    /**
     * Update a game rule on the server.
     * @param key The key of the game rule to update.
     * @param value The new value for the game rule. Must be a string, boolean or number.
     * @returns {Promise<void>} A promise that resolves when the game rule has been updated.
     */
    async updateGameRule<T extends GameRuleType>(key: string, value: number | boolean | string): Promise<TypedGameRule<GameRuleType>> {
        const result = await this.#connection.call(
            'minecraft:gamerules/update',
            [new UntypedGameRule(key, value.toString())],
        );

        const gamerule = TypedGameRule.parse(result, result);
        this.#gameRules?.set(gamerule.key, gamerule);
        return gamerule;
    }

    /**
     * @returns {PlayerList} API wrapper for the server's allowlist
     */
    public allowlist(): AllowList {
        return this.#allowlist ??= new AllowList(this.#connection);
    }

    /**
     * @returns {IPBanList} API wrapper for the server's IP ban list
     */
    public ipBanList(): IPBanList {
        return this.#ipBanList ??= new IPBanList(this.#connection);
    }

    /**
     * @returns {IPBanList} API wrapper for the server's player ban list
     */
    public banList(): BanList {
        return this.#banList ??= new BanList(this.#connection);
    }

    /**
     * @returns {OperatorList} API wrapper for the server's operator list
     */
    public operatorList(): OperatorList {
        return this.#operatorList ??= new OperatorList(this.#connection);
    }

    /**
     * @returns {ServerSettings} API wrapper for the server's settings
     */
    public settings(): ServerSettings {
        return new ServerSettings(this.#connection);
    }
}
