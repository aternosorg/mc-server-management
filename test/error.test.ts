import {expect, test} from "vitest";
import {JsonRPCError, MissingPropertyError, IncorrectTypeError, JsonRPCErrorCode} from "../src";
import {getConnection} from "./utils";

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

test('Test method not found', async () => {
    const connection = await getConnection();
    await expect(() => connection.call("aternos:invalid-method", {}))
        .rejects.toThrow(new JsonRPCError(JsonRPCErrorCode.METHOD_NOT_FOUND, "Method not found", "Method not found: aternos:invalid-method"));
});

test('Test invalid params', async () => {
    const connection = await getConnection();
    await expect(() => connection.call("minecraft:operators/add", {}))
        .rejects.toThrow(new JsonRPCError(JsonRPCErrorCode.INVALID_PARAMS, "Invalid params", "Params passed by-name, but expected param [add] does not exist"));
});
