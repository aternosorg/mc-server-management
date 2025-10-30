import {expect, test, vi} from "vitest";
import TestConnection from "../TestConnection";
import DiscoveryResponse from "../../src/schemas/discovery/DiscoveryResponse";
import ProtocolInfo from "../../src/schemas/discovery/ProtocolInfo";
import {wait} from "../utils";
import DiscoveryFailedError from "../../src/error/DiscoveryFailedError";
import {MissingPropertyError} from "../../src";

test('Unsupported major version', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const connection = new TestConnection();
    connection.setDiscoveryResponse(new DiscoveryResponse("1.151.51", new ProtocolInfo("Minecraft Server Management", "100000.0.0")));

    connection.emit('open');
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
