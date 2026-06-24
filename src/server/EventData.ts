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
    [Notifications.SERVER_ACTIVITY]: [],
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
    [Notifications.WORLD_UPGRADE_STARTED]: [],
    /**
     * The progress is a floating point number between 0 and 1.
     */
    [Notifications.WORLD_UPGRADE_PROGRESS]: [progress: number],
    [Notifications.WORLD_UPGRADE_FINISHED]: [],
    /**
     * The reason is a human-readable sentence (e.g., "The world upgrade failed while reading level.dat").
     */
    [Notifications.WORLD_UPGRADE_FAILED]: [reason: string],
}

export default EventData;
