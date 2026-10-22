#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
artifact="$repo_dir/dist/apps/web"
deploy_host="${DEPLOY_HOST:?Set DEPLOY_HOST, e.g. deploy@web01}"
identity="${DEPLOY_IDENTITY:-$HOME/.ssh/id_ed25519_antoineleflon_deploy}"
known_hosts="${DEPLOY_KNOWN_HOSTS:-$HOME/.ssh/known_hosts_antoineleflon_deploy}"

[[ -f "$artifact/.version" ]] || {
  echo "Missing release metadata; run npm run build:release first." >&2
  exit 1
}

ssh_options=(
  -F /dev/null -T -o BatchMode=yes -o IdentitiesOnly=yes
  -o ClearAllForwardings=yes -o ForwardAgent=no -o ForwardX11=no
  -o PermitLocalCommand=no -o RequestTTY=no -o StrictHostKeyChecking=yes
  -o "UserKnownHostsFile=$known_hosts" -i "$identity"
)

tar --directory "$artifact" --create --file=- . |
  ssh "${ssh_options[@]}" -- "$deploy_host"
