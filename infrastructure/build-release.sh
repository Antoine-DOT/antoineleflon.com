#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_dir"

if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  echo "Tracked files must be committed before building a release." >&2
  exit 1
fi

commit="$(git rev-parse HEAD)"
source_date_epoch="$(git show -s --format=%ct HEAD)"
export SOURCE_DATE_EPOCH="$source_date_epoch"

npm ci
npm run lint
npm run build

node -e '
  const fs = require("node:fs");
  const data = {
    commit: process.argv[1],
    built_at: new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString(),
  };
  fs.writeFileSync("dist/apps/web/.version", JSON.stringify(data) + "\n");
' "$commit"

echo "Release built for $commit in dist/apps/web"
