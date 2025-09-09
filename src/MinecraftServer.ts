import type Connection from "./connection/Connection.js";
import {SystemMessage} from "./schemas/message.js";
import AllowList from "./player-list/AllowList.js";
import IPBanList from "./player-list/IPBanList.js";
import IncorrectTypeError from "./error/IncorrectTypeError.js";
import BanList from "./player-list/BanList.js";
import {Operator, Player} from "./schemas/player.js";
import {KickPlayer} from "./schemas/kick.js";
import OperatorList from "./player-list/OperatorList.js";
import {ServerState} from "./schemas/server.js";
import ServerSettings from "./ServerSettings.js";
import {GameRuleType, TypedGameRule, UntypedGameRule} from "./schemas/gamerule.js";
import {IPBan, UserBan} from "./schemas/ban.js";
import {EventEmitter} from "eventemitter3";

export enum Notifications {
    SERVER_STARTED = 'notification:server/started',
    SERVER_STOPPING = 'notification:server/stopping',
    SERVER_SAVING = 'notification:server/saving',
    SERVER_SAVED = 'notification:server/saved',
    PLAYER_JOINED = 'notification:players/joined',
    PLAYER_LEFT = 'notification:players/left',
    OPERATOR_ADDED = 'notification:operators/added',
    OPERATOR_REMOVED = 'notification:operators/removed',
    ALLOWLIST_ADDED = 'notification:allowlist/added',
    ALLOWLIST_REMOVED = 'notification:allowlist/removed',
    IP_BAN_ADDED = 'notification:ip_bans/added',
    IP_BAN_REMOVED = 'notification:ip_bans/removed',
    BAN_ADDED = 'notification:bans/added',
    BAN_REMOVED = 'notification:bans/removed',
    GAME_RULE_UPDATED = 'notification:gamerules/updated',
    SERVER_STATUS = 'notification:server/status',
}

export type EventData = {
    'error': [Error],
    [Notifications.SERVER_STARTED]: [],
    [Notifications.SERVER_STOPPING]: [],
    [Notifications.SERVER_SAVING]: [],
    [Notifications.SERVER_SAVED]: [],
    [Notifications.PLAYER_JOINED]: [Player],
    [Notifications.PLAYER_LEFT]: [Player],
    [Notifications.OPERATOR_ADDED]: [Operator],
    [Notifications.OPERATOR_REMOVED]: [Operator],
    [Notifications.ALLOWLIST_ADDED]: [Player],
    [Notifications.ALLOWLIST_REMOVED]: [Player],
    [Notifications.IP_BAN_ADDED]: [IPBan],
    [Notifications.IP_BAN_REMOVED]: [string],
    [Notifications.BAN_ADDED]: [UserBan],
    [Notifications.BAN_REMOVED]: [Player],
    [Notifications.GAME_RULE_UPDATED]: [TypedGameRule<GameRuleType>],
    [Notifications.SERVER_STATUS]: [ServerState],
}

/**
 * This is the main entrypoint for interacting with the Minecraft server management protocol.
 * It provides methods for retrieving server status, managing players, and accessing various server settings and lists.
 */
export default class MinecraftServer extends EventEmitter<EventData> {
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
        super();
        this.#connection = connection;

        this.#connection.on(Notifications.SERVER_STARTED, () => this.emit(Notifications.SERVER_STARTED));
        this.#connection.on(Notifications.SERVER_STOPPING, () => this.emit(Notifications.SERVER_STOPPING));
        this.#connection.on(Notifications.SERVER_SAVING, () => this.emit(Notifications.SERVER_SAVING));
        this.#connection.on(Notifications.SERVER_SAVED, () => this.emit(Notifications.SERVER_SAVED));
        this.#connection.on(Notifications.PLAYER_JOINED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            this.emit(Notifications.PLAYER_JOINED, Player.parse(param, data, ...path))
        });
        this.#connection.on(Notifications.PLAYER_LEFT, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            this.emit(Notifications.PLAYER_LEFT, Player.parse(param, data, ...path))
        });
        this.#connection.on(Notifications.OPERATOR_ADDED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            const op = Operator.parse(param, data, ...path);
            this.emit(Notifications.OPERATOR_ADDED, op);
            this.#operatorList?.addItem(op);
        });
        this.#connection.on(Notifications.OPERATOR_REMOVED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            const op = Operator.parse(param, data, ...path);
            this.emit(Notifications.OPERATOR_REMOVED, op);
            this.#operatorList?.removeMatching(item => item.player.id === op.player.id);
        });
        this.#connection.on(Notifications.ALLOWLIST_ADDED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            const player = Player.parse(param, data, ...path);
            this.emit(Notifications.ALLOWLIST_ADDED, player);
            this.#allowlist?.addItem(player);
        });
        this.#connection.on(Notifications.ALLOWLIST_REMOVED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            const player = Player.parse(param, data, ...path);
            this.emit(Notifications.ALLOWLIST_REMOVED, player);
            this.#allowlist?.removeMatching(item => item.id === player.id);
        });
        this.#connection.on(Notifications.IP_BAN_ADDED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            const ban = IPBan.parse(param, data, ...path);
            this.emit(Notifications.IP_BAN_ADDED, ban);
            this.#ipBanList?.addItem(ban);
        });
        this.#connection.on(Notifications.IP_BAN_REMOVED, (data: unknown) => {
            const [path, ip] = this.#getByNameOrPos(data, "player");

            if (typeof ip !== 'string') {
                throw new IncorrectTypeError("string", typeof ip, data, ...path);
            }

            this.emit(Notifications.IP_BAN_REMOVED, ip);
            this.#ipBanList?.removeMatching(item => item.ip === ip);
        });
        this.#connection.on(Notifications.BAN_ADDED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            const ban = UserBan.parse(param, data, ...path);
            this.emit(Notifications.BAN_ADDED, ban);
            this.#banList?.addItem(ban);
        });
        this.#connection.on(Notifications.BAN_REMOVED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            const player = Player.parse(param, data, ...path);
            this.emit(Notifications.BAN_REMOVED, player);
            this.#banList?.removeMatching(item => item.player.id === player.id);
        });
        this.#connection.on(Notifications.GAME_RULE_UPDATED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "gamerule");
            const rule = TypedGameRule.parse(param, data, ...path);
            this.emit(Notifications.GAME_RULE_UPDATED, rule);
            this.#gameRules?.set(rule.key, rule);
        });
        this.#connection.on(Notifications.SERVER_STATUS, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "status");
            this.#state = ServerState.parse(param, data, ...path);
            this.emit(Notifications.SERVER_STATUS, this.#state);
        });
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

    /**
     * Get parameter by name or position.
     * @param data The data to get the parameter from.
     * @param name The name of the parameter.
     * @param pos The position of the parameter.
     * @return [path: string[], value: unknown] The parameter value and the path used to retrieve it.
     * @private
     */
    #getByNameOrPos(data: unknown, name: string, pos: number = 0): [string[], unknown] {
        if (Array.isArray(data) && data.length > pos) {
            return [[pos.toString()], data[pos]];
        }

        if (typeof data === 'object' && data !== null && name in data) {
            return [[name], (data as Record<string, unknown>)[name]];
        }

        throw new Error(`Could not get parameter '${name}' (${pos}) from notification data: ${JSON.stringify(data)}`);
    }
}
