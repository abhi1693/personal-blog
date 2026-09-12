#!/usr/bin/env bash
set -euo pipefail
export GITHUB_TOKEN="$CI_BUILD_GITHUB_TOKEN"
.github/scripts/write-env.sh .env.local
