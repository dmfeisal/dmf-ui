# M5: Documentation experience and production quality

Production follow-up: [M5 production acceptance](DMF-UI-M5-PRODUCTION-ACCEPTANCE.md) records the verified 27 October routing, cache and metadata results. The original local implementation report below is retained.

Local implementation checkpoint: 27 October 2026. No commit, push, publication, tag or deployment was performed.

## Repository and production checkpoint

- Branch: `main`; HEAD, `origin/main` and a final read-only remote `main` lookup: `d79fb04c151917cde07876ec87579baf11bf7d2a`.
- Netlify project `dmfui`, published production deployment `6adff4f27275b736f3912879`, Ready, points to that exact SHA.
- M5 changes are uncommitted. Package versions remain core `0.4.0` and React `0.1.0-alpha.3`. No dependency or public component API changes. The related portfolio repository was not edited.
- Source-derived coverage remains 80 Astro families, 4 Astro Blocks, 15 experimental React families, 4 experimental React Blocks and 40 React named exports. Website counts read generated metadata rather than these historical numbers.

## Findings and implementation

The old homepage concentrated on generic previews and did not expose the implemented composition architecture. The new homepage uses the existing HeroBlock and MerchantCard, features Merchant Discovery, links the four implemented Blocks and provides actual Astro/React setup paths. It retains Nova/Neutral, shared tokens, light/dark themes and static rendering. Merchant imagery is illustrative, with no invented live merchant claims.

`component-contracts.mjs` derives framework support from actual exports into `contracts/catalog.json`. Component and Block pages show compact support summaries, canonical category, domains where present, imports, source dependencies, limitations and scoped verification. All current implementations remain Experimental; an absent React family is Not implemented. No Stable promotion or parallel component registry was introduced.

The Examples index links six existing working specimens, describes host ownership, and cross-links source Components/Blocks. Merchant Discovery links its three constituent implementations and search/recovery pattern. Examples are included in header navigation and global search. Empty future experience pages were not created.

Mobile navigation now uses the same functional groups as desktop through native disclosures, with the current category open and current page identified. Its scroll area is bounded to the viewport. A long Block title required wrapping at enlarged RTL text; that was corrected. Header tools remain 32px and controls retain natural sizing.

The new implementation guide distinguishes private Astro source and React alpha archives, real exports, style scope, Tailwind consumer configuration, React peers, native events and host-owned services. Canonical and Open Graph URLs are generated from the site pathname, excluding query strings.

Changed areas: `src/pages/index.astro`, `src/layouts/DocumentationLayout.astro`, component/Block catalogs and details, `src/components/docs/ImplementationSupport.astro`, `src/components/docs/ContrastAlternatives.astro`, `src/data/{support,examples,implementation-documentation}.ts`, the Examples index, documentation search/styles, generated contracts, static host configuration and focused regression tests.

## Brand accessibility boundaries

CB and HUI filled primary actions retain owner-selected white labels and unchanged brand fills. Their documented normal-text ratios are approximately 2.57:1 and 4.29:1; hover may reduce contrast further. These remain explicit exceptions, not WCAG AA acceptance. Existing outline Buttons provide an alternative on the accessibility page, without changing authoritative brand specifications. Disabled and overlay states require their own acceptance. No blanket 44px sizing rule was added.

## Routing and caching

Production inspection confirmed `/blocks/merchant-card/` returns HTTP 200 containing an Astro meta refresh. The no-slash URL first redirects to that old slash path. The local `_redirects` contains forced 301 rules for both old paths to `/components/merchant-card/`, so the old generated static file cannot shadow the rule. The compatibility export and Astro fallback remain intact.

Production sampled hashed CSS assets returned `max-age=0,must-revalidate`. The local `_headers` applies one-year immutable caching only to content-hashed `/_astro/*` assets; HTML is not given immutable caching. Both configuration files are copied into the static build. The current canonical MerchantCard destination and direct Installation guide both return HTTP 200. The new rules’ real HTTP behavior remains pending an authorized deployment and live verification.

## Performance and SEO baseline

Measurements use one navigation per route in Chromium at 1280×900, device scale 1, browser network cache disabled, with no CPU/network throttling. LCP/CLS are PerformanceObserver lab samples, not field Core Web Vitals or an INP assessment. Reused browser font caching means zero transfer font entries cannot establish cold font behavior. Production includes an additional Netlify-injected script. Local and production timings are not directly comparable.

| Production route at d79fb04 | LCP ms | CLS | Decoded JS bytes | Decoded CSS bytes |
| --- | ---: | ---: | ---: | ---: |
| Home | 1896 | 0 | 104805 | 460037 |
| Components | 744 | 0.02981 | 78810 | 240795 |
| Merchant Discovery | 1116 | 0.01229 | 326580 | 455639 |

All three production samples lacked canonical tags. Local M5 adds canonical tags consistently through the shared documentation layout. Final before/after local samples (single samples, not statistical performance claims):

| Route | LCP ms before → after | CLS before → after | Decoded JS bytes before → after | Decoded CSS bytes before → after |
| --- | ---: | ---: | ---: | ---: |
| Home | 116 → 68 | 0 → 0 | 68950 → 42973 | 460037 → 242916 |
| Components | 72 → 68 | 0.02964 → 0.02964 | 42955 → 42973 | 240795 → 242916 |
| Merchant Discovery | 60 → 60 | 0.01229 → 0.01229 | 290725 → 290743 | 455639 → 457760 |

Homepage HTML changes from 62,191 to 68,864 decoded bytes; inline search data from 24,946 to 26,735 bytes. The final component catalog sample still shows approximately 0.03 CLS; an earlier zero-CLS local sample was not repeatable, so no CLS fix is claimed.

Removing generic homepage preview infrastructure reduced application script count from 9 to 4 and decoded homepage JavaScript from 68,950 to 42,973 bytes. Shared preview CSS is no longer pulled into the homepage. Homepage HTML increased to provide useful navigation and source information. Three homepage images use generated 220×220 WebP assets totaling approximately 34KB instead of multi-megabyte originals; source images remain unchanged.

Remaining measured opportunities: the inline search index is about 27KB per documentation page; Discovery loads core and adapter styles, about 458KB decoded together. Separate caching of search data and CSS deduplication need targeted measurement before architectural changes. Field INP/CrUX and full cold-font/loading waterfalls remain unverified.

## Release gates and next work

Must verify before production acceptance: deploy only after explicit authorization; confirm both legacy URLs return real HTTP 301 to the canonical component URL, destination 200, no redirect loop, and immutable headers only on hashed assets. Recheck live canonical metadata and caching.

Recommended manual follow-up: Firefox, Safari, physical mobile/tablet devices and spoken screen readers. Chromium automation does not establish those results or WCAG conformance. Repeat lab samples and obtain field data as traffic permits.

Intentionally deferred: native adapters, new domain families, a Templates registry, publication and experience expansion. After M5 production/manual gates, prefer Authentication Blocks expansion: existing SignInBlock and form contracts provide a bounded basis for recovery and verification flows. Hosts must still own endpoints, session/CSRF policy, validation and persistence. Marketing Blocks are a later option; Food Discovery Templates, dashboards and tablet POS need additional interaction and data requirements first.

## Local verification

- `npm run check`: 585 files, zero errors, warnings or hints; token, foundation, upstream provenance and generated contract prechecks passed.
- `npm run build`: 125 static pages, three optimized homepage images, no build failures.
- `npm test`: 54 passing tests, including built local documentation links/fragments, source-derived support on every family/Block page, canonical URLs and emitted redirect/cache configuration.
- Adapter unit/DOM suite: 7 passing tests.
- Guarded packed React consumer: 30 passing tests against the actual private archives. Consumer install peak sampled process-tree RSS approximately 540MiB; production consumer build 266MiB and tests 315MiB. Discovery lifecycle soak retained no history listeners (sampled heap delta −378KiB). These are bounded samples, not a guarantee against all future memory regressions.
- Focused M5 Chromium suite passes: full-page home axe at desktop/tablet/mobile, light/dark, RTL and 200% root text; Examples/search keyboard navigation and Escape focus return; generated support on representative available/unavailable runtimes; grouped touch/keyboard/current-page navigation; no-JavaScript support/navigation; outline alternative axe; discovery hydration, empty state/reset and clean canonical URL; no captured runtime errors in changed flows.
- M5 axe findings have no violations. Retained incompletes on partially clipped syntax tokens were separately checked against composited solid backgrounds and met 4.5:1; no non-code targets or other incomplete rules are silently accepted. Existing contract-preview select chevrons can also cause axe background-image incompletes; focused text-contrast rechecks temporarily exclude only the known decorative image, verify spacing, and restore it. Raw findings and review results remain in ignored browser audit artifacts.
- Broader documentation regression passes: all scripted previews, guide navigation, theme switching, local feedback, mobile containment and seven axe page states. Global search regression passes its four audit states, shortcuts, result navigation, Escape/focus return, empty results and copy/fallback. Documentation layout passes seven viewports, focus/layer containment, anchor clearance, active contents, enlarged text and reduced-motion scrolling. Tooltip tests enter through actual Tab navigation instead of assuming programmatic focus establishes keyboard modality.
- Screenshots reviewed: homepage desktop and enlarged RTL/mobile. Chromium viewport emulation does not establish physical-device or spoken-AT acceptance.

Artifacts are local, ignored files under `.dmf-ui-test-results/`; bounded logs and lab samples are under `/tmp/dmf-m5-*`. They are not packaged or published.
