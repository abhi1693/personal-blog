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

This change prepares a patch release only. It does not publish a release, container, database migration, or deployment.
