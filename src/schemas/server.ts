import {Player} from "./player.js";

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

    constructor(name: string, protocol: number) {
        this.name = name;
        this.protocol = protocol;
    }
}
