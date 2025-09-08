import {expect, test} from "vitest";
import JsonRPCError from "../src/error/JsonRPCError.js";
import MissingPropertyError from "../src/error/MissingPropertyError.js";
import IncorrectTypeError from "../src/error/IncorrectTypeError.js";

test("Parse error missing code", () => {
    const data = {message: "Error message"};
    expect(() => JsonRPCError.parse(data)).toThrow(
        new MissingPropertyError("code", data)
    );
});

test("Parse error wrong type code", () => {
    const data = {code: "string", message: "Error message"};
    expect(() => JsonRPCError.parse(data)).toThrow(
        new IncorrectTypeError("number", "string", data, "code")
    );
});

test("Parse error missing message", () => {
    const data = {code: -32600};
    expect(() => JsonRPCError.parse(data)).toThrow(
        new MissingPropertyError("message", data)
    );
});

test("Parse error wrong type message", () => {
    const data = {code: -32600, message: 1};
    expect(() => JsonRPCError.parse(data)).toThrow(
        new IncorrectTypeError("string", "number", data, "message")
    );
});
