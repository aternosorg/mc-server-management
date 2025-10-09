import Notifications from "../server/Notifications";

type ConnectionEventData = {
    'open': [],
    'close': [number, string],
    'error': [Error],
    [Notifications.SERVER_STARTED]: unknown,
    [Notifications.SERVER_STOPPING]: unknown,
    [Notifications.SERVER_SAVING]: unknown,
    [Notifications.SERVER_SAVED]: unknown,
    [Notifications.SERVER_ACTIVITY]: unknown,
    [Notifications.PLAYER_JOINED]: unknown,
    [Notifications.PLAYER_LEFT]: unknown,
    [Notifications.OPERATOR_ADDED]: unknown,
    [Notifications.OPERATOR_REMOVED]: unknown,
    [Notifications.ALLOWLIST_ADDED]: unknown,
    [Notifications.ALLOWLIST_REMOVED]: unknown,
    [Notifications.IP_BAN_ADDED]: unknown,
    [Notifications.IP_BAN_REMOVED]: unknown,
    [Notifications.BAN_ADDED]: unknown,
    [Notifications.BAN_REMOVED]: unknown,
    [Notifications.GAME_RULE_UPDATED]: unknown,
    [Notifications.SERVER_STATUS]: unknown,
};

export default ConnectionEventData;
