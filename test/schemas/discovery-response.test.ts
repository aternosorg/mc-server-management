import {expect, test} from "vitest";
import DiscoveryResponse from "../../src/schemas/discovery/DiscoveryResponse";
import ProtocolInfo from "../../src/schemas/discovery/ProtocolInfo";
import {IncorrectTypeError, MissingPropertyError} from "../../src";

test('Protocol info schema is valid', async () => {
    const data = {openrpc: "1.3.1", info: {title: "Minecraft Server Management", version: "2.0.0"}};
    expect(DiscoveryResponse.parse(data, data)).toStrictEqual(new DiscoveryResponse(
        "1.3.1",
        new ProtocolInfo("Minecraft Server Management", "2.0.0")
    ));
});

test('Data is not an object', async () => {
    const data = "invalid data";
    expect(() => DiscoveryResponse.parse(data, data)).toThrow(new IncorrectTypeError(
        "object",
        typeof data,
        data
    ));
});

test('Missing openrpc property', async () => {
    const data = {info: {title: "Minecraft Server Management", version: "2.0.0"}};
    expect(() => DiscoveryResponse.parse(data, data)).toThrowError(new MissingPropertyError(
        "openrpc",
        data
    ));
});

test('Openrpc property is not a string', async () => {
    const data = {openrpc: 1.3, info: {title: "Minecraft Server Management", version: "2.0.0"}};
    expect(() => DiscoveryResponse.parse(data, data)).toThrowError(new IncorrectTypeError(
        "string",
        typeof data.openrpc,
        data,
        "openrpc"
    ));
});

test('Missing info property', async () => {
    const data = {openrpc: "1.3.1"};
    expect(() => DiscoveryResponse.parse(data, data)).toThrowError(new MissingPropertyError(
        "info",
        data
    ));
});

test('Info property is not an object', async () => {
    const data = {openrpc: "1.3.1", info: "invalid info"};
    expect(() => DiscoveryResponse.parse(data, data)).toThrowError(new IncorrectTypeError(
        "object",
        typeof data.info,
        data,
        "info"
    ));
});
