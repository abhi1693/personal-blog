# Studio compatibility helpers

These app-owned helpers replace the small API previously imported from
`sanitypress-utils@0.0.8`. That package requires React 18 peers and Sanity 3,
which cannot share the current React 19 / Sanity 6 dependency tree without
bypassing peer checks. This app no longer installs it or overrides its peers.

The local preview helpers preserve block separators and preset titles. The
Studio inputs use current Sanity `set`/`unset` patches and respect read-only
fields; structure helpers retain singleton document IDs and groups. The Studio
info widget displays this application's version and the Sanity documentation.
Sanity UI 4 components use the new subpath imports, stylesheet, and `gap` API.

Run `npm run typecheck`, `npm run lint`, and `npm test` to check compatibility.
The main CI build also extracts the Studio manifest and builds the application
with its existing read-only CMS environment.
