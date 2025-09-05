import ManagementClient from "../src/ManagementClient.js";
import WebSocketConnection from "../src/connection/WebSocketConnection.js";

export async function getClient() {
    const connection = await WebSocketConnection.connect("ws://localhost:25585")
    return new ManagementClient(connection)
}
