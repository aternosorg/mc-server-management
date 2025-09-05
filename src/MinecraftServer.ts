import type Connection from "./connection/Connection.js";
import {SystemMessage} from "./schemas/message.js";
import AllowList from "./player-list/AllowList.js";
import IPBanList from "./player-list/IPBanList.js";
import IncorrectTypeError from "./error/IncorrectTypeError.js";
import BanList from "./player-list/BanList.js";
import {Player} from "./schemas/player.js";
import {KickPlayer} from "./schemas/kick.js";
import OperatorList from "./player-list/OperatorList.js";

export default class MinecraftServer {
    #connection: Connection;
    #allowlist?: AllowList;
    #ipBanList?: IPBanList;
    #banList?: BanList;
    #operatorList?: OperatorList;

    constructor(connection: Connection) {
        this.#connection = connection;
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
    public async kickPlayers(player: KickPlayer): Promise<Player[]>
    {
        const response = await this.#connection.call('minecraft:players/kick', [player]);
        return Player.parseList(response);
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
}
