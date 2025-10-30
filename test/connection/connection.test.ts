import {expect, test, vi} from "vitest";
import TestConnection from "../TestConnection";
import {JsonRPCError, JsonRPCErrorCode, MinecraftServer, MissingPropertyError} from "../../src";
import {getConnection, wait} from "../utils";
import DiscoveryResponse from "../../src/schemas/discovery/DiscoveryResponse";
import ProtocolInfo from "../../src/schemas/discovery/ProtocolInfo";
import DiscoveryFailedError from "../../src/error/DiscoveryFailedError";

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

test('Throw non-json rpc errors as is', async () => {
    const connection = new TestConnection();
    const error = new Error("Connection failed");
    connection.addError(error);
    const server = new MinecraftServer(connection);
    await expect(server.getStatus()).rejects.toThrow(error);
});

test('Exceptions while parsing JSONRPCError are thrown', async () => {
    const connection = new TestConnection();
    connection.addError({
        code: -32601,
        message: "Method not found"
    });

    const error = new Error("Unexpected error");
    vi.spyOn(JsonRPCError, 'parse').mockImplementation(() => {
        throw error;
    });

    const server = new MinecraftServer(connection);
    await expect(server.getStatus()).rejects.toThrow(error);
});

test('Test closing connection', async () => {
    const connection = await getConnection();
    connection.close();

    expect(() => connection.close()).not.toThrow();
    const server = new MinecraftServer(connection);
    await expect(server.getStatus()).rejects.toThrow();
});

test('Unsupported major version', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const connection = new TestConnection();
    connection.setDiscoveryResponse(new DiscoveryResponse("1.151.51", new ProtocolInfo("Minecraft Server Management", "100000.0.0")));
    await wait(1);
    expect(warn).toHaveBeenCalledWith("Warning: The server you're connecting to provides server management protocol version 100000.0.0. This version is not supported by mc-server-management, some features may not work as expected.");
});

test('Failed discovery', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    const connection = new TestConnection();
    connection.setDiscoveryResponse({});

    connection.emit('open');
    await wait(1);
    expect(error).toHaveBeenCalledWith("Unhandled discovery error:", new DiscoveryFailedError({cause: new MissingPropertyError("openrpc", {})}));
});
