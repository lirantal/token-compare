#!/bin/bash
set -e

WORKSPACE_FOLDER="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Starting devcontainer for: $WORKSPACE_FOLDER"
npx --yes @devcontainers/cli@0.84.1 up --workspace-folder "$WORKSPACE_FOLDER"

echo "Dropping into container shell..."
# Pass the host TERM (or default to xterm-256color for rich color support)
TERM="${TERM:-xterm-256color}" npx --yes @devcontainers/cli@0.84.1 exec --workspace-folder "$WORKSPACE_FOLDER" -- env TERM="${TERM:-xterm-256color}" COLORTERM=truecolor bash