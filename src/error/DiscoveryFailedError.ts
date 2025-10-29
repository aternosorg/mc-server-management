export default class DiscoveryFailedError extends Error {
    constructor(options?: ErrorOptions) {
        super("Failed to discover server capabilities", options);
    }
}
