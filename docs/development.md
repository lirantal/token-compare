# Development

## Prerequisites

- Node.js compatible with this repository's packages and tooling.
- pnpm for dependency installation and scripts.

## Setup

```sh
pnpm install
```

## Common Commands

- `pnpm build` - builds the project.
- `pnpm dev` - runs local development workflows.

## Repository Notes

This repository is organized around the root package `token-compare`.

## Package-manager pin

Use the exact pnpm version in `package.json#packageManager` locally and in CI.
From the repository root, install it with:

```sh
npm install --global "$(node -p 'require("./package.json").packageManager')"
pnpm install --frozen-lockfile
```

Upgrade the pin and matching lockfile metadata together in a maintenance PR.
Choose a release at least 30 days old and run the project checks with it.
Keep `.npmrc` and `pnpm-workspace.yaml` security policies enabled.
Periodic upgrade automation is not configured.
