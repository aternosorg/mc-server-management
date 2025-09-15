import {Player, MinecraftServer, WebSocketConnection} from "../src";

export const ATERNOS = new Player("d6a91995-04bf-4f11-823f-5b18d412062a", "Aternos");
export const EXAROTON = new Player("22c777bb-e823-4ab8-b17b-acd3eef0b597", "exaroton");
export const TEST_DATE = new Date(4102444800_000);
export const TEST_DATE_STRING = "2100-01-01T00:00:00Z";

export async function getServer() {
    return new MinecraftServer(await getConnection());
}

export function getConnection() {
    return WebSocketConnection.connect("ws://localhost:25585", "jrpXKVsPgpCFF3JVVbQUDsEcvDw378gvezbcKqnK");
}

export function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
