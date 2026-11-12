# Release records

Each `releases/<version>/` folder traces one packed `dmf-ui` archive back to its source:

- `SOURCE-COMMIT`: the full commit SHA the archive was packed from.
- `SHA256SUMS`: the archive's SHA-256, in `shasum -a 256 -c` format.
- `pack.json`: `npm pack --json` output, including the SHA-512 `integrity` that consumer lockfiles record.

The archives themselves are ignored by Git; consumers keep the copy they install in their own `vendor/` folder. Records are immutable: once a version is recorded, any change to shipped files needs a new version.

| Command | Purpose |
| --- | --- |
| `npm run release:record` | Pack `HEAD` from a clean Git worktree into `releases/<version>/` and write the records. Refuses an existing version. `-- --commit <rev>` packs another commit. |
| `npm run release:verify -- <archive.tgz>...` | Check archives, such as a consumer's `vendor/dmf-ui-*.tgz`, against the recorded SHA-256. |
| `npm run release:check` | Validate the shape of every record (also covered by `npm test`). |

Versions 0.1.0 to 0.4.0 were recorded on 12 November 2026 by repacking the listed commits; each reproduced the archive vendored in dmf-web byte for byte.

Commits after 0.4.0's source commit still declare version 0.4.0 but pack different files. They have not been released; the next archive must bump the version first.

The same applies after 0.5.0: M9 regenerated `contracts/catalog.json` for React `0.1.0-alpha.5` and added a core note to `README.md`, so `dmf-ui` packs the same file list as 0.5.0 but different bytes in those two files. The next `dmf-ui` archive given to a consumer needs a version bump first.

M10 then added the HUI 900 font file, so the next `dmf-ui` and `@dmf-ui/core` archives both need a version bump.

These records cover `dmf-ui` only. `@dmf-ui/core` and `@dmf-ui/react` archives are packed by the test runners and not yet given to any consumer, so they have no records.
