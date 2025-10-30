# 3.2.0
## Improvements
- Allow discovering the server management protocol version via `connection.discover()`
- Log errors if no error handler is registered
- Log warnings if an unsupported server management protocol version is detected
- WebSocketConnection now forwards the `max_reconnects_reached` event

## Relevant Minecraft changes.
- Gamerules are now stored in registries. This means that all gamerule names have been changed. You can find the new
names [here](https://www.minecraft.net/en-us/article/minecraft-snapshot-25w44a). `server.hasGameRulesRegistry()` can be 
used to determine whether the server uses the old or the new names.


## Fixes
- `WebSocketConnection.connect()` now respects your reconnect settings for the initial connection attempt instead of
always rejecting if the initial connection fails, but attempting to reconnect anyways.

---

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
