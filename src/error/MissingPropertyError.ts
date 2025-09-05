import InvalidResponseError from "./InvalidResponseError.js";

export default class MissingPropertyError extends InvalidResponseError {
    constructor(property: string, response: unknown = null, path: string = '') {
        super(`Missing required property '${property}'.`, response, path ? path + '.' + property : property);
    }
}
