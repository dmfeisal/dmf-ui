# Packed React consumer fixture

This is a test template, not a production application. Run `npm run test:dmf-ui:react-consumer` from the repository root; its runner materializes the `.template` files in a temporary directory and installs newly packed core and adapter archives using the fixture lock.

The standalone app uses only public package exports. It offers both presets, dark surroundings and a local form with controlled/uncontrolled controls. No application transport or storage is configured. Vite builds the app; acceptance tests use native ESM, JSDOM and user-event simulation. Asset checks inspect compiled CSS and font bytes, not browser geometry or contrast.

The production build generates server-rendered content, while the client hydrates it using shared ID configuration. Development uses client rendering for its empty host. `useId` keeps label/title associations instance-specific; the demo stays disabled until hydration. The acceptance suite checks actual production HTML, both-preset hydration without input replacement, and local form behavior after hydration. Run the build before invoking fixture tests directly.

`--keep` retains the generated directory, where `npm run dev` starts its preview. `--update-lock` intentionally updates package/dependency metadata; normal verification must use the locked path. Generated archives and dependencies stay outside this repository. See `docs/DMF-UI-REACT.md` for limitations.
