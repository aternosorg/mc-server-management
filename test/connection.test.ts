import {expect, test} from "vitest";
import TestConnection from "./TestConnection.js";
import {JsonRPCError, JsonRPCErrorCode, MinecraftServer} from "../src";
import {getConnection} from "./utils.js";

test('Convert json rpc errors to errors', async () => {
    const connection = new TestConnection();
    const server = new MinecraftServer(connection);
    connection.addError({
        code: -32601,
        message: "Method not found"
    });
    await expect(server.getStatus()).rejects.toThrow(new JsonRPCError(JsonRPCErrorCode.METHOD_NOT_FOUND, "Method not found"));

    connection.addError({
        code: -32601,
        message: "Method not found",
        data: {extra: "info"}
    });
    await expect(server.getStatus()).rejects.toThrow(new JsonRPCError(JsonRPCErrorCode.METHOD_NOT_FOUND, "Method not found", {extra: "info"}));

    connection.addError({
        code: -32601,
        message: "Method not found",
        data: "More info"
    });
    await expect(server.getStatus()).rejects.toThrow(new JsonRPCError(JsonRPCErrorCode.METHOD_NOT_FOUND, "Method not found", "More info"));
});

test('Test closing connection', async () => {
    const connection = await getConnection();
    connection.close();

    expect(() => connection.close()).not.toThrow();
    const server = new MinecraftServer(connection);
    await expect(server.getStatus()).rejects.toThrow();
});
