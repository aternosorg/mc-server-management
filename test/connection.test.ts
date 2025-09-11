import {expect, test} from "vitest";
import TestConnection from "./TestConnection.js";
import {JsonRPCError, MinecraftServer} from "../src";
import {getConnection} from "./utils.js";

test('Convert json rpc errors to errors', async () => {
    const connection = new TestConnection();
    const server = new MinecraftServer(connection);
    connection.addResponse({
        "error": {
            code: -32601,
            message: "Method not found"
        }
    });
    await expect(server.getStatus()).rejects.toThrow(new JsonRPCError(-32601, "Method not found"));

    connection.addResponse({
        "error": {
            code: -32601,
            message: "Method not found",
            data: {extra: "info"}
        }
    });
    await expect(server.getStatus()).rejects.toThrow(new JsonRPCError(-32601, "Method not found", {extra: "info"}));

    connection.addResponse({
        "error": {
            code: -32601,
            message: "Method not found",
            data: "More info"
        }
    });
    await expect(server.getStatus()).rejects.toThrow(new JsonRPCError(-32601, "Method not found", "More info"));
});

test('Test closing connection', async () => {
    const connection = await getConnection();
    connection.close();

    expect(() => connection.close()).not.toThrow();
    const server = new MinecraftServer(connection);
    await expect(server.getStatus()).rejects.toThrow();
});
