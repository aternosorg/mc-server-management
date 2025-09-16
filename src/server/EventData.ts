import Player from "../schemas/player/Player";
import Notifications from "./Notifications";
import IPBan from "../schemas/player/ban/IPBan";
import UserBan from "../schemas/player/ban/UserBan";
import GameRuleType from "../schemas/gamerule/GameRuleType";
import TypedGameRule from "../schemas/gamerule/TypedGameRule";
import Operator from "../schemas/player/Operator";
import ServerState from "../schemas/server/ServerState";

type EventData = {
    'error': [Error],
    [Notifications.SERVER_STARTED]: [],
    [Notifications.SERVER_STOPPING]: [],
    [Notifications.SERVER_SAVING]: [],
    [Notifications.SERVER_SAVED]: [],
    [Notifications.PLAYER_JOINED]: [Player],
    [Notifications.PLAYER_LEFT]: [Player],
    [Notifications.OPERATOR_ADDED]: [Operator],
    [Notifications.OPERATOR_REMOVED]: [Operator],
    [Notifications.ALLOWLIST_ADDED]: [Player],
    [Notifications.ALLOWLIST_REMOVED]: [Player],
    [Notifications.IP_BAN_ADDED]: [IPBan],
    [Notifications.IP_BAN_REMOVED]: [string],
    [Notifications.BAN_ADDED]: [UserBan],
    [Notifications.BAN_REMOVED]: [Player],
    [Notifications.GAME_RULE_UPDATED]: [TypedGameRule<GameRuleType>],
    [Notifications.SERVER_STATUS]: [ServerState],

    [Notifications.LEGACY_SERVER_STARTED]: [],
    [Notifications.LEGACY_SERVER_STOPPING]: [],
    [Notifications.LEGACY_SERVER_SAVING]: [],
    [Notifications.LEGACY_SERVER_SAVED]: [],
    [Notifications.LEGACY_PLAYER_JOINED]: [Player],
    [Notifications.LEGACY_PLAYER_LEFT]: [Player],
    [Notifications.LEGACY_OPERATOR_ADDED]: [Operator],
    [Notifications.LEGACY_OPERATOR_REMOVED]: [Operator],
    [Notifications.LEGACY_ALLOWLIST_ADDED]: [Player],
    [Notifications.LEGACY_ALLOWLIST_REMOVED]: [Player],
    [Notifications.LEGACY_IP_BAN_ADDED]: [IPBan],
    [Notifications.LEGACY_IP_BAN_REMOVED]: [string],
    [Notifications.LEGACY_BAN_ADDED]: [UserBan],
    [Notifications.LEGACY_BAN_REMOVED]: [Player],
    [Notifications.LEGACY_GAME_RULE_UPDATED]: [TypedGameRule<GameRuleType>],
    [Notifications.LEGACY_SERVER_STATUS]: [ServerState],
}

export default EventData;
