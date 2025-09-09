import {Player} from "./player.js";
import IncorrectTypeError from "../error/IncorrectTypeError.js";
import MissingPropertyError from "../error/MissingPropertyError.js";

export class ServerState {
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

export class Version {
    /**
     * Name of the version (e.g., "1.21.9")
     */
    readonly name: string;
    /**
     * Protocol number of the version (e.g., 773 for Minecraft 1.21.9)
     */
    readonly protocol: number;

    /**
     * @param data Data to parse
     * @param response Full response for error context
     * @param path Path to the data in the response for error context
     * @throws {InvalidResponseError}
     * @returns {Version}
     * @internal
     */
    static parse(data: unknown, response: unknown, ...path: string[]): Version {
        if (typeof data !== 'object' || data === null) {
            throw new IncorrectTypeError("object", typeof data, response, ...path);
        }

        if (!("name" in data)) {
            throw new MissingPropertyError("name", data, ...path);
        }

        if (!("protocol" in data)) {
            throw new MissingPropertyError("protocol", response, ...path);
        }

        if (typeof data.name !== 'string') {
            throw new IncorrectTypeError("string", typeof data.name, response, ...path, "name");
        }

        if (typeof data.protocol !== 'number') {
            throw new IncorrectTypeError("number", typeof data.protocol, response, ...path, "protocol");
        }

        return new Version(data.name, data.protocol);
    }

    constructor(name: string, protocol: number) {
        this.name = name;
        this.protocol = protocol;
    }
}

export enum Difficulty {
    PEACEFUL = "peaceful",
    EASY = "easy",
    NORMAL = "normal",
    HARD = "hard",
}

export enum GameMode {
    SURVIVAL = "survival",
    CREATIVE = "creative",
    SPECTATOR = "spectator",
    ADVENTURE = "adventure",
}
