import MinecraftServer from "../src/MinecraftServer.js";
import WebSocketConnection from "../src/connection/WebSocketConnection.js";
import {Player} from "../src/schemas/player.js";

export const ATERNOS = new Player("d6a91995-04bf-4f11-823f-5b18d412062a", "Aternos");
export const EXAROTON = new Player("22c777bb-e823-4ab8-b17b-acd3eef0b597", "exaroton");

export async function getServer() {
    const connection = await WebSocketConnection.connect("ws://localhost:25585")
    return new MinecraftServer(connection)
}
