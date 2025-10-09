enum Notifications {
    SERVER_STARTED = 'minecraft:notification/server/started',
    SERVER_STOPPING = 'minecraft:notification/server/stopping',
    SERVER_SAVING = 'minecraft:notification/server/saving',
    SERVER_SAVED = 'minecraft:notification/server/saved',
    /**
     * Indicates that a network connection to the server has been initiated
     * Available since Minecraft 25w41a (1.21.11)
     */
    SERVER_ACTIVITY = 'minecraft:notification/server/activity',
    PLAYER_JOINED = 'minecraft:notification/players/joined',
    PLAYER_LEFT = 'minecraft:notification/players/left',
    OPERATOR_ADDED = 'minecraft:notification/operators/added',
    OPERATOR_REMOVED = 'minecraft:notification/operators/removed',
    ALLOWLIST_ADDED = 'minecraft:notification/allowlist/added',
    ALLOWLIST_REMOVED = 'minecraft:notification/allowlist/removed',
    IP_BAN_ADDED = 'minecraft:notification/ip_bans/added',
    IP_BAN_REMOVED = 'minecraft:notification/ip_bans/removed',
    BAN_ADDED = 'minecraft:notification/bans/added',
    BAN_REMOVED = 'minecraft:notification/bans/removed',
    GAME_RULE_UPDATED = 'minecraft:notification/gamerules/updated',
    SERVER_STATUS = 'minecraft:notification/server/status',
}

export default Notifications;
