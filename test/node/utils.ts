import {MinecraftServer} from "../../src";
import {NodeWebSocketConnection} from "../../src/index.node";
import {WS_TOKEN, WS_URL} from "../constants";

export async function getServer() {
    return new MinecraftServer(await getConnection());
}

export function getConnection() {
    return NodeWebSocketConnection.connect(WS_URL, WS_TOKEN);
}

export function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
