import {expect, test} from "vitest";
import {IncorrectTypeError, MissingPropertyError, ServerState, Version} from "../../src";

test('Parse Server State wrong type', () => {
    expect(() => ServerState.parse(false)).toThrow(
        new IncorrectTypeError("object", "boolean", false)
    );
});

test('Parse Server State no started field', () => {
    expect(() => ServerState.parse({})).toThrow(
        new MissingPropertyError("started", {})
    );
});

test('Parse Server State started wrong type', () => {
    const data = {started: "string"};
    expect(() => ServerState.parse(data)).toThrow(
        new IncorrectTypeError("boolean", "string", data, "started")
    );
});

test('Parse Server State no version field', () => {
    const data = {started: false};
    expect(() => ServerState.parse(data)).toThrow(
        new MissingPropertyError("version", data)
    );
});

test('Parse Version wrong type', () => {
    const data = "string";
    expect(() => Version.parse(data, data)).toThrow(
        new IncorrectTypeError("object", "string", "string")
    );
});

test('Parse Version missing property name', () => {
    const data = {};
    expect(() => Version.parse(data, data)).toThrow(
        new MissingPropertyError("name", data)
    );
});

test('Parse Version missing property protocol', () => {
    const data = {name: "1.21.9"};
    expect(() => Version.parse(data, data)).toThrow(
        new MissingPropertyError("protocol", data)
    );
});

test('Parse Version missing wrong type name', () => {
    const data = {name: 1, protocol: "string"};
    expect(() => Version.parse(data, data)).toThrow(
        new IncorrectTypeError("string", "number", data, "name")
    );
});

test('Parse Version missing wrong type protocol', () => {
    const data = {name: "1.21.9", protocol: "string"};
    expect(() => Version.parse(data, data)).toThrow(
        new IncorrectTypeError("number", "string", data, "protocol")
    );
});

