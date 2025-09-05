import type Connection from "./connection/Connection.js";
import {SystemMessage} from "./schemas/message.js";
import AllowList from "./player-list/AllowList.js";
import IPBanList from "./player-list/IPBanList.js";
import IncorrectTypeError from "./error/IncorrectTypeError.js";
import BanList from "./player-list/BanList.js";

export default class ManagementClient {
    #connection: Connection;
    #allowlist?: AllowList;
    #ipBanList?: IPBanList;
    #banList?: BanList;

    constructor(connection: Connection) {
        this.#connection = connection;
    }

    /**
     * Get an API wrapper for the server's allowlist.
     * @returns {PlayerList}
     */
    public allowlist(): AllowList {
        return this.#allowlist ??= new AllowList(this.#connection);
    }

    /**
     * Get an API wrapper for the server's IP ban list.
     * @returns {IPBanList}
     */
    public ipBanList(): IPBanList {
        return this.#ipBanList ??= new IPBanList(this.#connection);
    }

    /**
     * Get an API wrapper for the server's player ban list.
     * @returns {IPBanList}
     */
    public banList(): BanList {
        return this.#banList ??= new BanList(this.#connection);
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
