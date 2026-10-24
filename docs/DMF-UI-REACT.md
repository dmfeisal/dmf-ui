# React web alpha

24 October 2026. A separate private `@dmf-ui/react` proof at `packages/react`, version `0.1.0-alpha.1`, implements five web primitives: Button, Text, Input, Switch and Card. The Astro archive remains 0.4.0. This alpha is not a stable release, native adapter or published package.

## Ownership and setup

Core semantic tokens, preset CSS and Button variants remain authoritative shared web inputs. React owns rendering and native input events, without Data Slot initialization or global Astro listeners. Adapter-specific checkbox track CSS is scoped to the React label. Tailwind discovers the adapter source through its stylesheet. Hosts retain theme selection, `.dmf-ui` scope, routing, transport and root lifetime.

Run root `npm ci`, then `npm ci --prefix packages/react`. Source CI installs this independent lockfile, runs the React suite, and builds the documentation proof at `/examples/react/`. React dependencies remain outside the Astro distribution files and portfolio pin. The alpha package exports TSX source and requires a compatible compiler and React 19 host. A separately packed consumer integration remains a later acceptance step.

See the package README for APIs and deliberate limitations. Native checkbox state gives uncontrolled Switch validation, form exclusion while disabled and browser reset. Controlled state must be reset by the host; the proof demonstrates that ownership. Read-only Switch is not supported. Card currently exposes a root only, rather than the full Astro slot family.

## Verification

Type checking, server markup and JSDOM hydration/form/reset/unmount tests pass. The documentation build includes the server-rendered proof. Browser screenshots, computed contrast, focus, mobile/RTL and theme comparisons remain pending until the missing browser test space can be replaced with owner approval. Do not infer layout or assistive-technology conformance from JSDOM.

## Direction

Keep this a small web proof before expanding the React catalog. Next acceptance work: real-browser parity, separate packed-consumer build and application integration. React Native and SwiftUI need separate implementations using shared token data and contracts; they do not reuse React web CSS or DOM behavior.

References: [React native input contracts](https://react.dev/reference/react-dom/components/input), [React root ownership and unmount](https://react.dev/reference/react-dom/client/createRoot).
