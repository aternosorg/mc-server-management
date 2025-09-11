# Minecraft Server Management Protocol Client

## About

This is a TypeScript/JavaScript client library for the Minecraft server management protocol added in 25w35a.

## Features

- Complete type definitions
- Builders for all request parameters
- Full API coverage (including Notifications)
- Authentication support (required since 25w37a)
- Promise-based API
- Automatic reconnection
- TLS support
- Connection interface for custom transports (e.g. proxying over a different connection)
- Custom error classes for errors returned by the server
- Type validation of responses
- ESModule and CommonJS support

## Installation

You can install the library using npm:
```bash
npm install mc-server-management
```

It can be used as an ES or CommonJS module.
```typescript
// ESM
import {WebsocketConnection, MinecraftServer} from 'mc-server-management';
// CJS
const {WebsocketConnection, MinecraftServer} = require('mc-server-management');
```

## Usage

### Creating a Connection

The simplest way to create a connection is using the static `connect` method on `WebSocketConnection`. All you need is
the URL to connect to and the authentication token. The token can be found in the server.properties file of your
Minecraft server.
```typescript
const connection = await WebSocketConnection.connect("wss://<your-server>:<management-port>", "<auth-token>");
```

### Creating a MinecraftServer Instance

The MinecraftServer class is the main entry point for interacting with the server. You can create an instance
by passing in a connection.
```typescript
const server = new MinecraftServer(connection);

const status = await server.getStatus();
console.log(`Server is ${status.started ? "running" : "starting"} on version ${status.version.name} with ${status.players.length} players.`);
// getStatus inteliigently caches the result. It is automatically updated when the server sends a notification and only
// fetched if it has not yet been cached or you use the force option.

// Get just the player list. This method is cached and automatically updated using notifications.
const players = await server.getConnectedPlayers();

// Kick a player
await server.kickPlayers(new KickPlayer(Player.withName("Aternos")));
// You can also kick multiple players at once
await server.kickPlayers(new KickPlayer([Player.withName("Aternos"), Player.withId("player-uuid")]));
// Specifying a message is optional
await server.kickPlayers(new KickPlayer(Player.withName("Aternos"), Message.literal("You have been kicked!")));

// Save the server
await server.save();

// Stop the server
await server.stop();

// Send a system message
await server.sendSystemMessage(new SystemMessage(Message.literal("Hello World!")));
await server.sendSystemMessage(new SystemMessage(Message.translatable("test.translation.key", ["arg1", "arg2"])));

// Get all gamerules. This method is cached and automatically updated using notifications.
const gamerules = await server.getGamerules();
console.log(gamerules);

// Update a gamerule
await server.updateGameRule(new UpdateGamerule("doDaylightCycle", true));
```

### Using player lists

```typescript
// Get an API wrapper for the allowlist (aka whitelist)
const allowlist = server.allowlist();

// Get all players from the allowlist. This method is cached and automatically updated using notifications.
const allowedPlayers = await allowlist.get();
console.log(allowedPlayers);

// Add a player to the allowlist
await allowlist.add(Player.withName("Aternos"));

// Remove a player from the allowlist
await allowlist.remove(Player.withId("player-uuid"));

// Set the entire allowlist
await allowlist.set([Player.withName("Aternos"), Player.withId("player-uuid")]);

// Clear the allowlist
await allowlist.clear();
```

All other player lists are also available and follow the same pattern:
```typescript
const ipBanlist = server.ipBanList();
const banList = server.banList();
const opList = server.operatorList();
```

### Get/Update server settings

```typescript
// Get an API wrapper for the server settings
const settings = server.settings();

const acceptTransfers = await settings.getAcceptTransfers()
await settings.setAcceptTransfers(!acceptTransfers);
```

For a list of all available settings, see the `ServerSettings` class.
