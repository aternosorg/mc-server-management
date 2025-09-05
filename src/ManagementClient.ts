import type Connection from "./connection/Connection.js";
import {SystemMessage} from "./schemas/message.js";
import AllowList from "./player-list/AllowList.js";
import IPBanList from "./player-list/IPBanList.js";
import InvalidResponseError from "./InvalidResponseError.js";

export default class ManagementClient {
    readonly connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    /**
     * Get an API wrapper for the server's allowlist.
     * @returns {PlayerList}
     */
    public allowlist(): AllowList {
        return new AllowList(this.connection);
    }

    public ipBanList(): IPBanList {
        return new IPBanList(this.connection);
    }



    /**
     * Sends a system message to the server.
     * @param {SystemMessage} message The system message to send.
     * @returns {Promise<boolean>} A promise that resolves to true if the message was sent successfully, false otherwise.
     */
    async sendSystemMessage(message: SystemMessage): Promise<boolean> {
        const result = await this.connection.call('minecraft:server/system_message', [message]);
        if (typeof result !== 'boolean') {
            throw new InvalidResponseError("boolean", typeof result, result);
        }
        return result;
    }
}
