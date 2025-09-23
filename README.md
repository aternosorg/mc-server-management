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

## Requirements

- Minecraft 1.21.9-pre4 or later.
- Node 22+ or another ES2022+ compatible environment.

## Installation

You can install the library using npm:
```shell
npm install mc-server-management
```

## Setting up the Minecraft Server
To enable the management protocol set `management-server-enabled`, `management-server-port` and `management-server-host`
in the server.properties file:
```properties
management-server-enabled=true
management-server-port=25585
management-server-host=0.0.0.0
management-server-secret=
```
You can either set `management-server-secret` to a random 40 character long alphanumeric string or leave it empty and
let the Minecraft server generate a random token on startup. You will need this token to connect to the server.

### TLS
By default, TLS is enabled, but the server will crash if you don't provide a certificate. If the management protocol is
not exposed to the internet, or you are using a reverse proxy, the easiest option would be to disable TLS:
```properties
management-server-tls-enabled=false
```

#### Using a custom certificate
If you want to use TLS, you need to provide a PKCS12 keystore file containing the certificate. To convert an existing
certificate and private key to a PKCS12 file you can use OpenSSL:
```shell
openssl pkcs12 -export -in cert.pem -inkey key.pem -out keystore.p12
```

#### Creating a self-signed certificate
To create untrusted local certificates use a tool like [mkcert](https://github.com/FiloSottile/mkcert). You will need to
tell npm to trust the root CA created by mkcert using the `NODE_EXTRA_CA_CERTS` environment variable:
```shell
mkcert -pkcs12 localhost
export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"
```

#### Setting up the keystore
Then set the path to the keystore file and the password in the server.properties file:
```properties
management-server-tls-keystore=keystore.p12
management-server-tls-keystore-password=changeit
```

## Usage

This library can be used as an ES or CommonJS module.
```typescript
// ESM
import {WebsocketConnection, MinecraftServer} from 'mc-server-management';
// CJS
const {WebsocketConnection, MinecraftServer} = require('mc-server-management');
```

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
```

### Getting the Server Status

```typescript
const status = await server.getStatus();
console.log(`Server is ${status.started ? "running" : "starting"} on version ${status.version.name} with ${status.players.length} players.`);
// getStatus inteliigently caches the result. It is automatically updated when the server sends a notification and only
// fetched if it has not yet been cached or you use the force option.

// Get just the player list. This method is cached and automatically updated using notifications.
const players = await server.getConnectedPlayers();
```

### Kicking Players

```typescript
// Kick a player by their username
await server.kickPlayers("Aternos");
// You can also kick multiple players at once. To identify a player by their UUID, not username use `Player.withId(uuid)`.
await server.kickPlayers([Player.withName("Aternos"), Player.withId("player-uuid")]);
// Specifying a message is optional
await server.kickPlayers(Player.withName("Aternos"), "You have been kicked!");
// You can also use a Message object, either for a literal or translated message
await server.kickPlayers(Player.withName("Aternos"), Message.literal("You have been kicked!"));
await server.kickPlayers(Player.withName("Aternos"), Message.translatable("test.translation.key", ["arg1", "arg2"]));
```

### Saving and Stopping the Server

```typescript
// Save the server
await server.save();

// Stop the server
await server.stop();
```

### Sending Chat Messages

```typescript
// Send a system message to all players in the chat
await server.sendSystemMessage("Hello World!");
// Send a system message to specific players in the chat
await server.sendSystemMessage("Hello World!", "Aternos");
await server.sendSystemMessage("Hello World!", ["Aternos", Player.withId("player-uuid")]);
// Show the message as an overlay above the hotbar for all players
await server.sendSystemMessage("Hello World!", "Aternos", true);
```

### Querying and Updating Game Rules

```typescript
// Get all gamerules. This method is cached and automatically updated using notifications.
const gamerules = await server.getGameRules();
console.log(gamerules);

// Update a gamerule
await server.updateGameRule("doDaylightCycle", true);
```

### The Allowlist

```typescript
// Get an API wrapper for the allowlist (aka whitelist)
const allowlist = server.allowlist();

// Get all players from the allowlist. This method is cached and automatically updated using notifications.
const allowedPlayers = await allowlist.get();
console.log(allowedPlayers);

// Add a player to the allowlist
await allowlist.add("Aternos");
await allowlist.add(Player.withName("Aternos"));
await allowlist.add(["Aternos", Player.withId("player-uuid")]);

// Remove a player from the allowlist
await allowlist.remove(Player.withId("player-uuid"));

// Set the entire allowlist
await allowlist.set(["Aternos", Player.withId("player-uuid")]);

// Clear the allowlist
await allowlist.clear();
```

### Operators

```typescript
// Get an API wrapper for the operators
const ops = server.operatorList();

// Get all operators. This method is cached and automatically updated using notifications.
const operators = await ops.get();
console.log(operators);

// Add an operator
await ops.add("Aternos");
// Optionally specify the operator level and whether they bypass the player limit
await ops.add("Aternos", 4, true);
await ops.add(Player.withId("player-uuid"), 2, false);
await ops.add(["Aternos", Player.withId("player-uuid")], 3, true);

// Remove an operator
await ops.remove("Aternos");
await ops.remove(Player.withId("player-uuid"));
await ops.remove(["Aternos", Player.withId("player-uuid")]);

// Set the entire operator list
await ops.set(["Aternos", Player.withId("player-uuid")]);
// You can specify the permission level and whether they bypass the player limit for each operator
// The default level and bypass options are only used for string/Player entries
await ops.set(
    [
        new Operator("Aternos", 4, true), // Aternos with level 4 and bypass
        new Operator(Player.withId("player-uuid"), 2, false), // player-uuid with level 2 and no bypass
        "Aternos", // Aternos with level 3 and bypass
    ],
    3,
    true,
);

// Clear the operator list
await ops.clear();
```

### Bans

```typescript
// Get an API wrapper for the bans
const bans = server.banList();

// Get all bans. This method is cached and automatically updated using notifications.
const banList = await bans.get();
console.log(banList);

// Ban a player by their username or UUID. You can optionally specify a reason, source and when the ban expires.
await bans.add("Aternos");
await bans.add(Player.withId("player-uuid"), "Breaking the rules", "Source", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Expires in 7 days
// The optional fields are only used for input objects that aren't already ban objects.
await bans.add([
    "Aternos", // Expires in 1 day
    Player.withId("player-uuid"), // Expires in 1 day
    new UserBan("Notch"), // Never expires
], "Breaking the rules", "Source", new Date(Date.now() + 24 * 60 * 60 * 1000));

// Unban a player by their username or UUID
await bans.remove("Aternos");
await bans.remove(Player.withId("player-uuid"));
await bans.remove([
    "Aternos",
    Player.withId("player-uuid"),
]);

// Set the entire ban list at once. This will add new bans and remove old ones.
await bans.set([
    new UserBan("Notch"),
    Player.withId("player-uuid"),
]);

// Clear the entire ban list
await bans.clear();
```

### IP Bans

```typescript
// Get an API wrapper for the IP bans
const ipBans = server.ipBanList();

// Get all IP bans. This method is cached and automatically updated using notifications.
const ipBanList = await ipBans.get();
console.log(ipBanList);

// Ban an IP address. You can optionally specify a reason, source and when the ban expires.
await ipBans.add("192.168.1.100");
await ipBans.add("10.0.0.5", "Suspicious activity", "Admin", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Expires in 7 days
await ipBans.add([
    "192.168.1.101", // Expires in 1 day
    "10.0.0.6",      // Expires in 1 day
    IncomingIPBan.withIp("172.16.0.1"), // Never expires
], "Malicious behavior", "Moderator", new Date(Date.now() + 24 * 60 * 60 * 1000));

// Unban an IP address
await ipBans.remove("192.168.1.100");
await ipBans.remove("10.0.0.5");
await ipBans.remove([
    "192.168.1.101",
    "10.0.0.6",
]);

// Set the entire IP ban list at once. This will add new bans and remove old ones.
await ipBans.set([
    new IPBan("172.16.0.1"),
    "10.0.0.5",
]);

// Clear the entire IP ban list
await ipBans.clear();
```


### Get/Update server settings

```typescript
// Get an API wrapper for the server settings
const settings = server.settings();

const acceptTransfers = await settings.getAcceptTransfers()
await settings.setAcceptTransfers(!acceptTransfers);
```

For a list of all available settings, see the `ServerSettings` class.

### Events / Notifications

The Minecraft server sends events as so called `Notifications`. You can listen for these events using the `on` method.
For a list of all available notifications, see the `Notifications` enum.

```typescript
// Subscribe to notifications
server.on(Notifications.SERVER_SAVED, () => console.log("Server saved!"));

// Notifications with data
server.on(Notifications.GAME_RULE_UPDATED, data => console.log(`Game rule ${data.key} updated to ${data.value}`));

// Listen for errors
server.on('error', error => console.error("Error:", error));

// Only listen for a notification once
server.once(Notifications.SERVER_STARTED, () => {
    console.log("Server started!");
});
```
