# 3.1.0
## Improvements
- Add `SERVER_ACTIVITY` notification

---

# 3.0.0

## Breaking Changes
- Errors returned by the server are now correctly converted to JsonRPCError objects.
- `Connection#callRaw` now returns an object with a success boolean and either a data field (if successful) or an error field (if failed).

## Other Improvements
- Improve JsonRPCError message formatting

---

# 2.0.0

## Breaking Changes
- Removed support for servers older than 1.21.9-pre4
- Remove fallback for old notification namespace used before 1.21.9-pre1.
  - If you are using literal strings to subscribe to notifications, please check they all start with `minecraft:notification/`. 
  - If you are using the `Notifications` enum, no changes are needed.

## Improvements
- Export JsonRPCErrorCode enum
