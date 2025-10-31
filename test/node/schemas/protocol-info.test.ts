import {expect, test} from "vitest";
import ProtocolInfo from "../../../src/schemas/discovery/ProtocolInfo";
import {IncorrectTypeError, MissingPropertyError} from "../../../src";

test('Protocol info schema is valid', async () => {
    const data = {title: "Minecraft Server Management", version: "2.0.0"};
    expect(ProtocolInfo.parse(data, data)).toStrictEqual(new ProtocolInfo("Minecraft Server Management", "2.0.0"));
});

test('Data is not an object', async () => {
    const data = "invalid data";
    expect(() => ProtocolInfo.parse(data, data)).toThrow(new IncorrectTypeError(
        "object",
        typeof data,
        data
    ));
});

test('Missing title property', async () => {
    const data = {version: "2.0.0"};
    expect(() => ProtocolInfo.parse(data, data)).toThrow(new MissingPropertyError(
        "title",
        data
    ));
});

test('Title property is not a string', async () => {
    const data = {title: 123, version: "2.0.0"};
    expect(() => ProtocolInfo.parse(data, data)).toThrow(new IncorrectTypeError(
        "string",
        typeof data.title,
        data,
        "title"
    ));
});

test('Missing version property', async () => {
    const data = {title: "Minecraft Server Management"};
    expect(() => ProtocolInfo.parse(data, data)).toThrow(new MissingPropertyError(
        "version",
        data
    ));
});

test('Version property is not a string', async () => {
    const data = {title: "Minecraft Server Management", version: 2.0};
    expect(() => ProtocolInfo.parse(data, data)).toThrow(new IncorrectTypeError(
        "string",
        typeof data.version,
        data,
        "version"
    ));
});
