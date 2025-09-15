export type ItemOrArray<T> = T | T[];

/**
 * Parse an optional value. If the input is `undefined` or `null`, `undefined` is returned.
 * Otherwise, the input is parsed using the provided function.
 * @param parse
 * @param input
 * @internal
 */
export function optional<Input, Output>(
    parse: (input: Input) => Output,
    input: Input | undefined | null,
): Output|undefined {
    if (input === undefined || input === null) {
        return undefined;
    }

    return parse(input);
}

/**
 * Ensure the input is an array. If the input is already an array, it is returned as-is.
 * @param item
 * @internal
 */
export function fromItemOrArray<T>(item: ItemOrArray<T>): T[] {
    if (Array.isArray(item)) {
        return item;
    }

    return [item];
}
