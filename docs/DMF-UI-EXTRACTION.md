# DMF UI ownership and packaging

The initial independent Astro snapshot was extracted from the portfolio. DMF UI now owns component source, tokens, presets, assets and optional examples. The portfolio consumes the versioned npm-pack archive through explicit package exports. See the repository README for installation and update commands.

`src/styles/dmf-ui.css` contains component styling and scoped normalization. `src/styles/dmf-ui-examples.css` is a separate opt-in documentation layout. Nunito lives in `src/assets/fonts/` and is bundled through a relative CSS URL. Notices and provenance have their own package exports. The source repository's documentation page imports both CSS entries; ordinary consumers only need component CSS.

Package archives include component source, styles, font, notices, README and upstream provenance. Site pages, browser tests, lockfiles, export manifests and developer scripts are not distributed in the package. Exact runtime dependencies and Astro/Tailwind peer requirements are declared in package.json. Source code is retained so Astro can compile components and their lifecycle scripts.

The first portfolio pin is a checked-in `vendor/dmf-ui-0.1.0.tgz` plus package-lock SHA-512 integrity. It does not depend on a sibling folder or remote publication. Future updates originate here, receive a new snapshot version, and are deliberately installed and verified in each consumer. Commit/push/publish remain separate requested actions.

React/WordPress adapters, npm release governance, additional engines and real Astro client navigation are future acceptance work. Existing component lifecycle and browser checks remain documented in DMF-UI-PILOT.md. Historical extraction hashes remain in EXPORT-MANIFEST.json; do not interpret them as a current distribution manifest.
