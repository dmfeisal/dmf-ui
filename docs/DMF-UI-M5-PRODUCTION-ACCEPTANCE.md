# M5 production acceptance

Checked 27 October 2026 before M6 implementation. This adds production evidence to [the original M5 report](DMF-UI-M5.md), which remains a record of the local implementation checkpoint.

Local `main` starts at `10e813c3f059b65caed02ad4d5669972e2f2b70c`, aligned with the intended checkpoint and with a clean initial working tree. Netlify deployment `6ae036f85a2eca340fbedcea` reports Ready, production context, that exact commit and project `dmfui`.

| Public HTTP check | Result |
| --- | --- |
| `/blocks/merchant-card` | 301, Location `/components/merchant-card/` |
| `/blocks/merchant-card/` | 301, Location `/components/merchant-card/` |
| `/components/merchant-card/` | 200, correct canonical and Open Graph URL |
| `/docs/installation/` | 200, correct canonical and Open Graph URL |
| `/examples/discovery/?category=cafe` | 200; canonical and Open Graph URL exclude query parameters |
| Fingerprinted `/_astro/DocumentationLayout.36ujGfHU.css` | 200; `public,max-age=31536000,immutable` |
| Sampled HTML and redirects | `public,max-age=0,must-revalidate`; no immutable HTML caching |

No routing, cache or metadata fixes were needed. Production configuration acceptance passes for these sampled routes/assets; this is not a crawl of every external link or an assertion about future deployments.

Owner-selected white CB/HUI filled-primary labels and unchanged brand fills retain approximately 2.57:1 and 4.29:1 normal-text contrast exceptions. They are not WCAG AA passes. Existing outline variants remain available with state-specific verification. Firefox, Safari, physical-device and spoken assistive-technology acceptance remain unverified for the newer Blocks; previous original-adapter evidence is not broadened to them. These manual gaps are recorded separately from the verified production configuration and do not block unrelated local M6 development.

This session made read-only production requests. No manual deployment or other production mutation was performed.
