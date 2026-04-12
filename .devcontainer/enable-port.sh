#!/bin/bash
# Run this from your HOST machine to apply port forwarding to the devcontainer.
# This recreates the container with the forwardPorts config from devcontainer.json.
# After it completes, reconnect using start.sh.

set -e

WORKSPACE_FOLDER="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Recreating devcontainer with port forwarding enabled..."
npx --yes @devcontainers/cli@0.84.1 up \
    --workspace-folder "$WORKSPACE_FOLDER" \
    --remove-existing-container

echo ""
echo "Done. Run start.sh to reconnect. Port 5173 will be forwarded to localhost:5173."
