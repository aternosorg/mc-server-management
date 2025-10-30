import {expect, test} from "vitest";
import TypedGameRule from "../../src/schemas/gamerule/TypedGameRule";
import GameRuleType from "../../src/schemas/gamerule/GameRuleType";
import {IncorrectTypeError, MissingPropertyError, UnknownEnumVariantError} from "../../src";

test('Boolean game rule is valid', async () => {
    const data = {key: "doDaylightCycle", value: true, type: "boolean"};
    expect(TypedGameRule.parse(data, data)).toStrictEqual(new TypedGameRule(
        GameRuleType.BOOLEAN,
        "doDaylightCycle",
        true
    ));
});

test('Boolean game rule with string value is valid', async () => {
    const data = {key: "doDaylightCycle", value: "false", type: "boolean"};
    expect(TypedGameRule.parse(data, data)).toStrictEqual(new TypedGameRule(
        GameRuleType.BOOLEAN,
        "doDaylightCycle",
        false
    ));
});

test('Integer game rule is valid', async () => {
    const data = {key: "maxEntityCramming", value: 24, type: "integer"};
    expect(TypedGameRule.parse(data, data)).toStrictEqual(new TypedGameRule(
        GameRuleType.INTEGER,
        "maxEntityCramming",
        24
    ));
});

test('Integer game rule with string value is valid', async () => {
    const data = {key: "maxEntityCramming", value: "24", type: "integer"};
    expect(TypedGameRule.parse(data, data)).toStrictEqual(new TypedGameRule(
        GameRuleType.INTEGER,
        "maxEntityCramming",
        24
    ));
});

test('Data is not an object', async () => {
    const data = "invalid data";
    expect(() => TypedGameRule.parse(data, data)).toThrow(new IncorrectTypeError(
        "object",
        typeof data,
        data
    ));
});

test('Missing key property', async () => {
    const data = {value: true, type: "boolean"};
    expect(() => TypedGameRule.parse(data, data)).toThrowError(new MissingPropertyError(
        "key",
        data
    ));
});

test('Key property is not a string', async () => {
    const data = {key: 123, value: true, type: "boolean"};
    expect(() => TypedGameRule.parse(data, data)).toThrowError(new IncorrectTypeError(
        "string",
        typeof data.key,
        data,
        "key"
    ));
});

test('Missing value property', async () => {
    const data = {key: "doDaylightCycle", type: "boolean"};
    expect(() => TypedGameRule.parse(data, data)).toThrowError(new MissingPropertyError(
        "value",
        data
    ));
});

test('Missing type property', async () => {
    const data = {key: "doDaylightCycle", value: true};
    expect(() => TypedGameRule.parse(data, data)).toThrowError(new MissingPropertyError(
        "type",
        data
    ));
});

test('Type property is not a string', async () => {
    const data = {key: "doDaylightCycle", value: true, type: 123};
    expect(() => TypedGameRule.parse(data, data)).toThrowError(new IncorrectTypeError(
        "string",
        typeof data.type,
        data,
        "type"
    ));
});

test('Unknown game rule type', async () => {
    const data = {key: "doDaylightCycle", value: true, type: "unknown"};
    expect(() => TypedGameRule.parse(data, data)).toThrowError(new UnknownEnumVariantError(
        "GameRuleType",
        "unknown",
        data,
        "type"
    ));
});

test('Boolean value is invalid', async () => {
    const data = {key: "doDaylightCycle", value: "invalid", type: "boolean"};
    expect(() => TypedGameRule.parse(data, data)).toThrowError(new IncorrectTypeError(
        "string|boolean",
        typeof data.value,
        data,
        "value"
    ));
});

test('Integer value is not a number', async () => {
    const data = {key: "maxEntityCramming", value: "invalid", type: "integer"};
    expect(() => TypedGameRule.parse(data, data)).toThrowError(new IncorrectTypeError(
        "string|integer",
        typeof data.value,
        data,
        "value"
    ));
});

test('Integer value is a float', async () => {
    const data = {key: "maxEntityCramming", value: 24.5, type: "integer"};
    expect(() => TypedGameRule.parse(data, data)).toThrowError(new IncorrectTypeError(
        "string|integer",
        typeof data.value,
        data,
        "value"
    ));
});

