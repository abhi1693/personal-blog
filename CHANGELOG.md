# Release notes

## 0.3.18 (prepared, unreleased)

- Refresh runtime and development dependencies and regenerate the npm lockfile.
- Use Next.js 16.4.2 and React 19.3.1, with Node.js 26.12.1 for container and local validation.
- Keep ESLint 9.39.5 and TypeScript 6.0.3: the latest stable Next.js lint plugins do not yet accept ESLint 10 or TypeScript 7. No peer-dependency checks are bypassed.
- Upgrade Sanity Studio to 6.20 and Sanity UI to 4.4, including subpath imports and the required stylesheet. Retain the compatible Sanity ESLint configuration 6.x while its 7.x release requires ESLint 10.
- Replace incompatible sanitypress-utils (React18/Sanity3 peers) with small app-owned schema preview, preset-input, structure, and Studio-info helpers; remove forced starter overrides and legacy-peer installation.
- Keep React elements intact when cleaning preview strings and update custom HTML effects for the current React lint rules.

- Apply the reviewed MIT-licensed bounded braces parser/AST patch for CVE-2026-93687 to every transitive consumer, with actual-consumer and malicious-input regression tests; keep the normal audit policy.
- Keep the current upstream typeid-js UUID10 dependency advisory visible: its supported UUID10 range has no compatible patched release; no incompatible UUID major or crypto fork is forced.

- Replace the Debian runtime with a verified Node.js 26.12.1 Alpine base across all stages and remove unused npm/Corepack/Yarn from the standalone runtime.
- Remove plaintext build-secret artifact transport. Pass only required CMS/public build configuration and the repository-read token directly through the shared job's private BuildKit secret; keep newsletter credentials runtime-only with lazy Resend initialization.
- Use an app-scoped GitHub read-token key in CI while preserving the production token fallback; handle unset optional public build variables without relaxing required CMS validation or changing content generation.
- Require native ARM64 pull-request SBOM, strict vulnerability/secret scans including unfixed high/critical findings, source/release version parity, and the same isolated HTTP/native-module smoke before release promotion. Production CMS generation and SEO remain intact; genuine CMS read configuration is required.
- Publish only uniquely named candidates before image checks; attest verified digests with GitHub provenance before immutable version/latest promotion. Reject moving-branch manual publication and require matching version tag, peeled commit, checkout and workflow SHA, with release identity regression tests.

This change prepares a patch release only. It does not publish a release, container, database migration, or deployment.
