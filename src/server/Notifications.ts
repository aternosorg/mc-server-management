enum Notifications {
    SERVER_STARTED = 'minecraft:notification/server/started',
    SERVER_STOPPING = 'minecraft:notification/server/stopping',
    SERVER_SAVING = 'minecraft:notification/server/saving',
    SERVER_SAVED = 'minecraft:notification/server/saved',
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


    /** @deprecated Use {@link SERVER_STARTED} instead */
    LEGACY_SERVER_STARTED = 'notification:server/started',
    /** @deprecated Use {@link SERVER_STOPPING} instead */
    LEGACY_SERVER_STOPPING = 'notification:server/stopping',
    /** @deprecated Use {@link SERVER_SAVING} instead */
    LEGACY_SERVER_SAVING = 'notification:server/saving',
    /** @deprecated Use {@link SERVER_SAVED} instead */
    LEGACY_SERVER_SAVED = 'notification:server/saved',
    /** @deprecated Use {@link PLAYER_JOINED} instead */
    LEGACY_PLAYER_JOINED = 'notification:players/joined',
    /** @deprecated Use {@link PLAYER_LEFT} instead */
    LEGACY_PLAYER_LEFT = 'notification:players/left',
    /** @deprecated Use {@link OPERATOR_ADDED} instead */
    LEGACY_OPERATOR_ADDED = 'notification:operators/added',
    /** @deprecated Use {@link OPERATOR_REMOVED} instead */
    LEGACY_OPERATOR_REMOVED = 'notification:operators/removed',
    /** @deprecated Use {@link ALLOWLIST_ADDED} instead */
    LEGACY_ALLOWLIST_ADDED = 'notification:allowlist/added',
    /** @deprecated Use {@link ALLOWLIST_REMOVED} instead */
    LEGACY_ALLOWLIST_REMOVED = 'notification:allowlist/removed',
    /** @deprecated Use {@link IP_BAN_ADDED} instead */
    LEGACY_IP_BAN_ADDED = 'notification:ip_bans/added',
    /** @deprecated Use {@link IP_BAN_REMOVED} instead */
    LEGACY_IP_BAN_REMOVED = 'notification:ip_bans/removed',
    /** @deprecated Use {@link BAN_ADDED} instead */
    LEGACY_BAN_ADDED = 'notification:bans/added',
    /** @deprecated Use {@link BAN_REMOVED} instead */
    LEGACY_BAN_REMOVED = 'notification:bans/removed',
    /** @deprecated Use {@link GAME_RULE_UPDATED} instead */
    LEGACY_GAME_RULE_UPDATED = 'notification:gamerules/updated',
    /** @deprecated Use {@link SERVER_STATUS} instead */
    LEGACY_SERVER_STATUS = 'notification:server/status',
    SERVER_STATUS = 'minecraft:notification/server/status',
}

export default Notifications;
