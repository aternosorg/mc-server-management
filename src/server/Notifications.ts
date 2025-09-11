enum Notifications {
    SERVER_STARTED = 'notification:server/started',
    SERVER_STOPPING = 'notification:server/stopping',
    SERVER_SAVING = 'notification:server/saving',
    SERVER_SAVED = 'notification:server/saved',
    PLAYER_JOINED = 'notification:players/joined',
    PLAYER_LEFT = 'notification:players/left',
    OPERATOR_ADDED = 'notification:operators/added',
    OPERATOR_REMOVED = 'notification:operators/removed',
    ALLOWLIST_ADDED = 'notification:allowlist/added',
    ALLOWLIST_REMOVED = 'notification:allowlist/removed',
    IP_BAN_ADDED = 'notification:ip_bans/added',
    IP_BAN_REMOVED = 'notification:ip_bans/removed',
    BAN_ADDED = 'notification:bans/added',
    BAN_REMOVED = 'notification:bans/removed',
    GAME_RULE_UPDATED = 'notification:gamerules/updated',
    SERVER_STATUS = 'notification:server/status',
}

export default Notifications;
