import type Connection from "../connection/Connection";
import AllowList from "../player-list/AllowList";
import IPBanList from "../player-list/IPBanList";
import IncorrectTypeError from "../error/IncorrectTypeError";
import BanList from "../player-list/BanList";
import Player, {PlayerInput} from "../schemas/player/Player";
import KickPlayer from "../schemas/player/KickPlayer";
import OperatorList from "../player-list/OperatorList";
import ServerSettings from "./ServerSettings";
import {EventEmitter} from "eventemitter3";
import EventData from "./EventData";
import {
    GameRuleType,
    IPBan,
    Notifications,
    Operator, ServerState,
    TypedGameRule,
    UserBan
} from "../index";
import Message, {MessageInput} from "../schemas/message/Message";
import {fromItemOrArray, ItemOrArray, optional} from "../util";
import SystemMessage from "../schemas/message/SystemMessage";
import UntypedGameRule from "../schemas/gamerule/UntypedGameRule";
import ConnectionEventData from "../connection/ConnectionEventData";
import EventArgs = EventEmitter.EventArgs;
import EventNames = EventEmitter.EventNames;
import semver from "semver/preload";

/**
 * This is the main entrypoint for interacting with the Minecraft server management protocol.
 * It provides methods for retrieving server status, managing players, and accessing various server settings and lists.
 */
export default class MinecraftServer extends EventEmitter<EventData> {
    readonly #connection: Connection;
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

        this.#onConnectionEvent(Notifications.SERVER_STARTED, () => this.emit(Notifications.SERVER_STARTED));
        this.#onConnectionEvent(Notifications.SERVER_STOPPING, () => this.emit(Notifications.SERVER_STOPPING));
        this.#onConnectionEvent(Notifications.SERVER_SAVING, () => this.emit(Notifications.SERVER_SAVING));
        this.#onConnectionEvent(Notifications.SERVER_SAVED, () => this.emit(Notifications.SERVER_SAVED));
        this.#onConnectionEvent(Notifications.SERVER_ACTIVITY, () => this.emit(Notifications.SERVER_ACTIVITY));
        this.#onConnectionEvent(Notifications.PLAYER_JOINED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            this.emit(Notifications.PLAYER_JOINED, Player.parse(param, data, ...path))
        });
        this.#onConnectionEvent(Notifications.PLAYER_LEFT, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            this.emit(Notifications.PLAYER_LEFT, Player.parse(param, data, ...path))
        });
        this.#onConnectionEvent(Notifications.OPERATOR_ADDED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            const op = Operator.parse(param, data, ...path);
            this.emit(Notifications.OPERATOR_ADDED, op);
            this.#operatorList?.addItem(op);
        });
        this.#onConnectionEvent(Notifications.OPERATOR_REMOVED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            const op = Operator.parse(param, data, ...path);
            this.emit(Notifications.OPERATOR_REMOVED, op);
            this.#operatorList?.removeMatching(item => item.player.id === op.player.id);
        });
        this.#onConnectionEvent(Notifications.ALLOWLIST_ADDED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            const player = Player.parse(param, data, ...path);
            this.emit(Notifications.ALLOWLIST_ADDED, player);
            this.#allowlist?.addItem(player);
        });
        this.#onConnectionEvent(Notifications.ALLOWLIST_REMOVED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            const player = Player.parse(param, data, ...path);
            this.emit(Notifications.ALLOWLIST_REMOVED, player);
            this.#allowlist?.removeMatching(item => item.id === player.id);
        });
        this.#onConnectionEvent(Notifications.IP_BAN_ADDED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            const ban = IPBan.parse(param, data, ...path);
            this.emit(Notifications.IP_BAN_ADDED, ban);
            this.#ipBanList?.addItem(ban);
        });
        this.#onConnectionEvent(Notifications.IP_BAN_REMOVED, (data: unknown) => {
            const [path, ip] = this.#getByNameOrPos(data, "player");

            if (typeof ip !== 'string') {
                throw new IncorrectTypeError("string", typeof ip, data, ...path);
            }

            this.emit(Notifications.IP_BAN_REMOVED, ip);
            this.#ipBanList?.removeMatching(item => item.ip === ip);
        });
        this.#onConnectionEvent(Notifications.BAN_ADDED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            const ban = UserBan.parse(param, data, ...path);
            this.emit(Notifications.BAN_ADDED, ban);
            this.#banList?.addItem(ban);
        });
        this.#onConnectionEvent(Notifications.BAN_REMOVED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "player");
            const player = Player.parse(param, data, ...path);
            this.emit(Notifications.BAN_REMOVED, player);
            this.#banList?.removeMatching(item => item.player.id === player.id);
        });
        this.#onConnectionEvent(Notifications.GAME_RULE_UPDATED, (data: unknown) => {
            const [path, param] = this.#getByNameOrPos(data, "gamerule");
            const rule = TypedGameRule.parse(param, data, ...path);
            this.emit(Notifications.GAME_RULE_UPDATED, rule);
            this.#gameRules?.set(rule.key, rule);
        });
        this.#onConnectionEvent(Notifications.SERVER_STATUS, (data: unknown) => {
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
    public async getConnectedPlayers(force: boolean = false): Promise<Player[]> {
        if (this.#state && !force) {
            return this.#state.players;
        }

        const response = await this.#connection.call('minecraft:players', []);
        return Player.parseList(response);
    }

    /**
     * Kicks one or more players from the server. To specify individual kick messages per user, use the KickPlayer class.
     * @param player The player or players to kick. Can be a PlayerInput, KickPlayer, or an array of either.
     * @param message optional default message when player is not an instance of KickPlayer.
     * @returns {Promise<Player[]>} A promise that resolves to an array of kicked players.
     */
    public async kickPlayers(player: ItemOrArray<PlayerInput|KickPlayer>, message?: MessageInput|null): Promise<Player[]> {
        const items = fromItemOrArray(player)
            .map(item => {
                if (item instanceof KickPlayer) {
                    return item;
                }

                return new KickPlayer(
                    Player.fromInput(item),
                    optional(Message.fromInput, message),
                );
            });

        const response = await this.#connection.call('minecraft:players/kick', [
            items
        ]);
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
     * @param message The message content to send.
     * @param players An optional list of players to receive the message. If omitted, all players will receive the message.
     * @param overlay Whether to display the message as an overlay above the hotbar (true) or in the chat (false). Default is false.
     * @returns {Promise<boolean>} A promise that resolves to true if the message was sent successfully, false otherwise.
     */
    async sendSystemMessage(
        message: MessageInput,
        players?: ItemOrArray<PlayerInput>|null,
        overlay: boolean = false,
    ): Promise<boolean> {
        const result = await this.#connection.call('minecraft:server/system_message', [
            new SystemMessage(
                Message.fromInput(message),
                optional(t => fromItemOrArray(t).map(Player.fromInput), players),
                overlay,
            )
        ]);
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
    async updateGameRule(key: string, value: number | boolean | string): Promise<TypedGameRule<GameRuleType>> {
        value = await this.hasGameRulesRegistry() ? value : JSON.stringify(value)

        const result = await this.#connection.call(
            'minecraft:gamerules/update',
            [new UntypedGameRule(key, value)],
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
     * Whether this server has the new game rules registry (Minecraft 1.21.11+).
     * GameRules are prefixed with "minecraft:" in this version.
     * @returns {Promise<boolean>} True if the server has the new game rules registry, false otherwise.
     */
    public async hasGameRulesRegistry(): Promise<boolean> {
        const discovery = await this.#connection.discover();
        return semver.gte(discovery.info.version, "2.0.0")
    }

    /**
     * Listen to a connection event and emit errors in the callback as 'error' events on this instance.
     * @param event The event name to listen to.
     * @param callback The callback to invoke when the event is emitted.
     * @private
     */
    #onConnectionEvent<T extends EventNames<ConnectionEventData>>(
        event: T,
        callback: (...args: EventArgs<ConnectionEventData, T>) => void
    ): void {
        this.#connection.on(event, (...args) => {
            try {
                callback.call(this, ...args);
            } catch (e) {
                this.emit('error', e as Error);
            }
        });
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
