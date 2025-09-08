import MinecraftServer from "../src/MinecraftServer.js";
import WebSocketConnection from "../src/connection/WebSocketConnection.js";
import {Player} from "../src/schemas/player.js";

export const ATERNOS = new Player("d6a91995-04bf-4f11-823f-5b18d412062a", "Aternos");
export const EXAROTON = new Player("22c777bb-e823-4ab8-b17b-acd3eef0b597", "exaroton");

export async function getServer() {
    return new MinecraftServer(await getConnection());
}

export function getConnection() {
    return WebSocketConnection.connect("ws://localhost:25585");
}

export function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
