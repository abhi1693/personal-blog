#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."
image=${1:?Usage: smoke-runtime.sh IMAGE PLATFORM [APP_VERSION]}
platform=${2:?Usage: smoke-runtime.sh IMAGE PLATFORM [APP_VERSION]}
source_version=$(node -p 'require("./package.json").version')
app_version=${3:-$source_version}
test "$app_version" = "$source_version"
next_version=$(node -p 'require("./package-lock.json").packages["node_modules/next"].version')
node_version=$(sed -n 's/^FROM node:\([0-9.]*\)-.*$/\1/p' Dockerfile)
test -n "$node_version"
case "$(uname -m):$platform" in
  x86_64:linux/amd64|aarch64:linux/arm64) ;;
  *) echo 'Runtime smoke requires a matching native runner' >&2; exit 1 ;;
esac
test "$(docker image inspect "$image" --format '{{.Os}}/{{.Architecture}}')" = "$platform"
test "$(docker image inspect "$image" --format '{{json .Config.Cmd}}')" = '["node","server.js"]'
image_version=$(docker image inspect "$image" --format '{{index .Config.Labels "org.opencontainers.image.version"}}')
test "${image_version#v}" = "$source_version"

docker run --rm -i --platform "$platform" --network none --read-only \
  --cap-drop ALL --security-opt no-new-privileges --pids-limit 128 --memory 768m \
  --tmpfs /tmp:rw,noexec,nosuid,mode=1777,size=16m \
  --tmpfs /app/.next/cache:rw,noexec,nosuid,uid=1001,gid=1001,mode=0755,size=32m \
  -e EXPECTED_APP_VERSION="$app_version" -e EXPECTED_NEXT_VERSION="$next_version" \
  -e EXPECTED_NODE_VERSION="$node_version" -e EXPECTED_PLATFORM="$platform" \
  --entrypoint node "$image" --input-type=commonjs < scripts/runtime-smoke.cjs
