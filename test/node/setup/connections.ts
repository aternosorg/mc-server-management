import {MinecraftServer} from "../../../src";
import {NodeWebSocketConnection} from "../../../src/index.node";
import {afterAll} from "vitest";
import {createConnection} from "../utils";

let connection: NodeWebSocketConnection | null = null;

afterAll(() => {
    if (connection !== null) {
        connection.close();
    }
})

export async function getServer(): Promise<MinecraftServer> {
    return new MinecraftServer(await getConnection());
}

export async function getConnection(): Promise<NodeWebSocketConnection> {
    return connection ??= await createConnection();
}
