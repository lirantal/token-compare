#!/bin/bash
set -e

WORKSPACE_FOLDER="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Starting devcontainer for: $WORKSPACE_FOLDER"
npx --yes @devcontainers/cli@0.84.1 up --workspace-folder "$WORKSPACE_FOLDER"

echo "Dropping into container shell..."
# Resolve TERM to something the container's terminfo knows about.
# Terminals like kitty, ghostty, alacritty set custom TERM values the container won't have.
# Fall back to xterm-256color (truecolor still works via COLORTERM=truecolor).
if ! infocmp "${TERM:-xterm-256color}" &>/dev/null 2>&1; then
    TERM=xterm-256color
fi
TERM="${TERM:-xterm-256color}" npx --yes @devcontainers/cli@0.84.1 exec --workspace-folder "$WORKSPACE_FOLDER" -- env TERM="${TERM:-xterm-256color}" COLORTERM=truecolor bash