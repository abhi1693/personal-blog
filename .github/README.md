# Repository automation

Common CI and image mechanics are maintained in [abhi1693/actions](https://github.com/abhi1693/actions).
Workflows use the released `@v1` reference for centrally maintained compatible updates.
See the [shared release history](https://github.com/abhi1693/actions/releases) for changes.
Repository-owned scripts, triggers, scanner exceptions and application smoke checks
remain alongside the application. Image manifests declare components rather than
copying workflow steps.

`runtime-image.yml` calls the shared `container-images.yml@v1` workflow using
`.github/images.json`, for both native ARM64 pull-request checks and releases.
Pull requests set `publish: false` and never push an image. Publication requires
the exact `<package.json version>` tag (for this release, `0.3.18`): the full ref, tag name, peeled tag commit,
checked-out `HEAD`, and workflow `GITHUB_SHA` must agree. Manual publication from
`master`, `main`, or any other moving branch is rejected. A release event must
also describe that published stable, non-draft release.

Release builds first push only a uniquely named candidate. The native runner
generates an SBOM, rejects high/critical vulnerabilities including unfixed
findings and detected secrets, then runs the real image smoke. Only a verified
candidate can receive the public repository's GitHub provenance attestation.
The shared pipeline then promotes that exact digest to the immutable version
tag and the moving `latest` tag. An existing version pointing to a different digest fails
closed before any final tag is written. Failed builds, scans, smoke checks, or
attestations cannot publish those final tags. All reusable caller levels grant
the required package, identity and attestation permissions.

Build configuration goes directly through `secrets.build-env` as JSON. The upper
workflow selects an opaque JSON string by component id, preserving the minimal
inner configuration without interpreting it. The shared build job writes it
with `umask 077` under its temporary directory, mounts
it with BuildKit, and deletes the temporary file on exit. It is never a workflow
artifact, workspace dotenv file, image layer, or build argument. The repository
loader parses JSON without shell evaluation and rejects unknown/runtime-only
credential names. Existing repository secrets are the boundary; the shared
workflow's `environment` input applies to index assembly, not the build job.
Repository-owned executable workflows and local composite actions cannot call
`actions/upload-artifact` or `actions/download-artifact` directly. The builtins-only
preflight scans every local YAML manifest, including newly added workflow/job
names, and rejects the retired secret artifact/file/helper paths. Approved shared
workflows continue publishing ordinary image plans, SBOMs and scan reports;
ordinary artifacts must never carry credentials. Expiry or deletion of a historical
secret artifact does not prove its credentials were revoked or rotated.
Regression tests exercise release/ref/commit rejection, the actual CLI's moving
branch rejection, and quote/backtick/unicode round trips through the real
workflow's nested configuration template without production secret values.
The GitHub read token uses the app-scoped `BLOG_GITHUB_TOKEN` key in both CI
callers because shared environment guards reserve `GITHUB_*`. Octokit prefers
the app-scoped key and retains `GITHUB_TOKEN` as a runtime compatibility fallback.
Reusable job callsites read the automatic token through `secrets.GITHUB_TOKEN`;
`github.token` is runner-populated only inside execution steps and is null at
these callsites. The regression suite checks this boundary in both actual JSON
payloads without reading real credentials.
Unset optional public analytics IDs and Sanity API version arrive as JSON null
and are omitted by the build loader, preserving existing app defaults. Required
CMS project, dataset, base URL and read token still fail closed when missing or
invalid; unknown keys, non-string values and CR/LF/NUL remain rejected.
The pre-install version job and `npm run test:runtime-build` run the same
builtins-only guard suite from a fresh scratch Git fixture with no ancestor
`node_modules` or `NODE_PATH`. The actual Octokit compatibility test belongs to
the installed, compiled application suite; it cannot add dependencies to the
preflight job.

| Build input                                             | Why it is needed                                                                                                          |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Public Sanity project/dataset/API version and base URL  | Studio manifest, static route generation, canonical URLs, redirects, and SEO metadata.                                    |
| Public analytics/advertising IDs                        | Existing frontend metadata and analytics configuration.                                                                   |
| `SANITY_API_READ_TOKEN`                                 | `defineLive` server initialization and published CMS content used during the real production build.                       |
| Ephemeral `secrets.GITHUB_TOKEN` as `BLOG_GITHUB_TOKEN` | Existing `Reputation` static rendering reads repository/star metadata through Octokit. No build API writes are performed. |

`CRON_SECRET`, `RESEND_API_KEY_FULL`, and the Resend audience ID are runtime
configuration only. The Resend SDK is constructed lazily after request guards;
builds do not need newsletter credentials. The runtime still needs its normal
newsletter and CMS configuration from the deployment.

There is no offline CMS fallback: a build without genuine required CMS read
configuration fails. Static generation, redirects, and production SEO behavior
remain unchanged. CI's smoke disables external networking and verifies the
actual standalone server, Studio HTML and assets, a runtime version response,
native Sharp, and safe newsletter/auth guards without sending email or fetching
CMS content. It does not substitute for live post-deployment CMS validation.

The final image sets `APP_VERSION` and the default `FARO_APP_VERSION` from the
same version build argument as its OCI label and installed package. The native
smoke requires those packaged defaults and checks `/api/faro-config` without
injecting a version override. Explicit operator-provided Faro version overrides
retain their existing priority; the application suite verifies that behavior.
