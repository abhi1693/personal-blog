#!/usr/bin/env bash
set -euo pipefail

target="${1:-.env.local}"

required_vars=(
	CRON_SECRET
	GITHUB_TOKEN
	NEXT_PUBLIC_BASE_URL
	NEXT_PUBLIC_SANITY_DATASET
	NEXT_PUBLIC_SANITY_PROJECT_ID
	NEXT_RESEND_AUDIENCE_ID
	RESEND_API_KEY_FULL
	SANITY_API_READ_TOKEN
)

optional_vars=(
	NEXT_GOOGLE_ADSENSE_ID
	NEXT_GOOGLE_ANALYTICS_ID
	NEXT_GOOGLE_TAG_MANAGER_ID
	NEXT_PUBLIC_SANITY_API_VERSION
)

for name in "${required_vars[@]}"; do
	if [[ -z "${!name:-}" ]]; then
		echo "Missing required environment variable: ${name}" >&2
		exit 1
	fi
done

: > "${target}"

write_var() {
	local name="$1"
	local value="${!name:-}"

	if [[ -n "${value}" ]]; then
		printf '%s=%s\n' "${name}" "${value}" >> "${target}"
	fi
}

for name in "${required_vars[@]}" "${optional_vars[@]}"; do
	write_var "${name}"
done
