#!/usr/bin/bash
set -e

PROJECT_DIR="$(dirname "${BASH_SOURCE[0]}")"
SERVER_DIR="server"
MINECRAFT_VERSION="snapshot"
MC_PORT="${MC_PORT:-25565}"
MANAGEMENT_PORT="${MANAGEMENT_PORT:-25585}"
PROPERTIES=(
 "server-port=25565"
 "management-server-enabled=true"
 "management-server-port=25585"
 "management-server-host=0.0.0.0"
 "management-server-tls-enabled=false"
 "management-server-secret=jrpXKVsPgpCFF3JVVbQUDsEcvDw378gvezbcKqnK"
)

function error() {
    echo "Error: $1" >&2
}

function show-help() {
    echo "Usage: ./spec.sh {command}"
    echo ""
    echo "Commands:"
    echo "  update-properties               Update server.properties with required properties"
    echo "  run-server                      Run the Minecraft server with management protocol enabled"
    echo "  stop-server                     Stop the Minecraft server"
    echo "  update-spec                     Update the JSON-RPC API schema file"
    echo ""
    echo "Environment variables:"
    echo "  MC_PORT                         Port for Minecraft server (default: 25565)"
    echo "  MANAGEMENT_PORT                 Port for management protocol server (default: 25585)"
    echo "  EXTRA_ARGS                      Extra arguments to pass to the Minecraft server"
    echo "  JVM_OPTS                        Extra JVM options to pass to the Minecraft server"
    echo ""
}


function update-properties() {
    echo "Updating server properties in $SERVER_DIR/server.properties"
    # Create server.properties if it doesn't exist
    touch "$SERVER_DIR/server.properties"

    # Update server.properties or create them if they don't exist
    for PROPERTY in "${PROPERTIES[@]}" ; do
        # split in key and value by first '='
        KEY="${PROPERTY%%=*}"
        VALUE="${PROPERTY#*=}"
        # if key exists, update value
        if grep -q "^${KEY}=" "$SERVER_DIR/server.properties" 2>/dev/null; then
            sed -i "s/^${KEY}=.*/${KEY}=${VALUE}/" "$SERVER_DIR/server.properties"
        else
            echo "${KEY}=${VALUE}" >> "$SERVER_DIR/server.properties"
        fi
    done
}

function run-server() {
    mkdir -p "$SERVER_DIR"
    update-properties
    docker run \
        --rm \
        --name "mc-management-protocol-server" \
        -v "./$SERVER_DIR:/data" \
        -e EULA=true \
        -e VERSION="$MINECRAFT_VERSION" \
        -p "$MC_PORT":25565 \
        -p "$MANAGEMENT_PORT":25585 \
        -e EXTRA_ARGS="$EXTRA_ARGS" \
        -e JVM_OPTS="$JVM_OPTS" \
        ghcr.io/itzg/minecraft-server
}

function stop-server() {
    docker stop "mc-management-protocol-server" || true
}

function update-spec() {
    EXTRA_ARGS="--reports" JVM_OPTS="-DbundlerMainClass=net.minecraft.data.Main" run-server
    mv "$SERVER_DIR/generated/reports/json-rpc-api-schema.json" "$PROJECT_DIR"
}

COMMAND="${1}"

type -t "${COMMAND}" | grep -q 'function' || {
    error "Command \`${COMMAND}\` not found"
    show-help
    exit 1
}

$COMMAND
