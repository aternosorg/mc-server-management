import Player from "../player/Player";
import IncorrectTypeError from "../../error/IncorrectTypeError";
import MissingPropertyError from "../../error/MissingPropertyError";

import Version from "./Version";

export default class ServerState {
    /**
     * List of players that are currently connected to the server.
     */
    readonly players: Array<Player>;
    /**
     * Whether the server is fully started.
     */
    readonly started: boolean;
    /**
     * Version of the server
     */
    readonly version: Version;

    /**
     * @param data
     * @param response
     * @param path
     * @internal
     */
    static parse(data: unknown, response: unknown = data, ...path: string[]): ServerState {
        if (typeof data !== 'object' || data === null) {
            throw new IncorrectTypeError("object", typeof data, response, ...path);
        }

        if (!("started" in data)) {
            throw new MissingPropertyError("started", response, ...path);
        }

        if (typeof data.started !== 'boolean') {
            throw new IncorrectTypeError("boolean", typeof data.started, response, ...path, "started");
        }

        let players: Player[] = [];
        if ("players" in data) {
            players = Player.parseList(data.players, response, ...path, "players");
        }

        if (!("version" in data)) {
            throw new MissingPropertyError("version", response, ...path);
        }
        const version = Version.parse(data.version, response, ...path, "version");

        return new ServerState(players, data.started, version);
    }

    constructor(players: Array<Player>, started: boolean, version: Version) {
        this.players = players;
        this.started = started;
        this.version = version;
    }
}
