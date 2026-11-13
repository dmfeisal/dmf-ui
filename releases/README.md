# Release records

Each `releases/<version>/` folder traces one packed `dmf-ui` archive back to its source:

- `SOURCE-COMMIT`: the full commit SHA the archive was packed from.
- `SHA256SUMS`: the archive's SHA-256, in `shasum -a 256 -c` format.
- `pack.json`: `npm pack --json` output, including the SHA-512 `integrity` that consumer lockfiles record.

The archives themselves are ignored by Git; consumers keep the copy they install in their own `vendor/` folder. Records are immutable: once a version is recorded, any change to shipped files needs a new version.

## Version rules

Before 1.0:

- **Minor (`0.x.0`):** any breaking change, new family or new export. For example, removing a stylesheet import that hosts relied on.
- **Patch (`0.x.y`):** fixes only. No API, export or visual-default changes.
- **Prerelease (`-alpha.n`):** an adapter stays a prerelease until a real consumer has used it.
- **Independent packages.** `dmf-ui`, `@dmf-ui/core` and `@dmf-ui/react` each keep their own version line, and a release bumps only the packages whose shipped files changed.
- **Ships in.** Milestones name the release they ship in (see `docs/DMF-UI-ROADMAP.md`). One release may carry several milestones, and milestones that change only tests or docs ship nothing.
- **1.0.0** follows the stable API policy (M28), not a date.

| Command | Purpose |
| --- | --- |
| `npm run release:record` | Pack `HEAD` from a clean Git worktree into `releases/<version>/` and write the records. Refuses an existing version. `-- --commit <rev>` packs another commit. |
| `npm run release:verify -- <archive.tgz>...` | Check archives, such as a consumer's `vendor/dmf-ui-*.tgz`, against the recorded SHA-256. |
| `npm run release:check` | Validate the shape of every record (also covered by `npm test`). |

Versions 0.1.0 to 0.4.0 were recorded on 12 November 2026 by repacking the listed commits; each reproduced the archive vendored in dmf-web byte for byte.

Commits after 0.4.0's source commit still declare version 0.4.0 but pack different files. They have not been released; the next archive must bump the version first.

After 0.5.0, M9 regenerated `contracts/catalog.json` and added a core note to `README.md`, and M10 added the HUI 900 font file. Version 0.6.0 packs those changes; commits after its source commit need another bump before the next archive.

These records cover `dmf-ui` only. `@dmf-ui/core` (0.1.0) and `@dmf-ui/react` archives are packed by the test runners and not yet given to any consumer, so they have no records. The first archive of either given to a consumer is recorded under its own package name, at whatever version it then declares.
