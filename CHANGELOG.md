# 2.0.0

## Breaking Changes
- Removed support for servers older than 1.21.9-pre4
- Remove fallback for old notification namespace used before 1.21.9-pre1.
  - If you are using literal strings to subscribe to notifications, please check they all start with `minecraft:notification/`. 
  - If you are using the `Notifications` enum, no changes are needed.

## Improvements
- Export JsonRPCErrorCode enum
