# Product details components

The first Product Details batch adds Avatar, Rating and Chip to the Astro adapter, bringing the catalog to 27 families alongside the pending navigation batch. Core remains 0.4.0; React remains 0.1.0-alpha.3. React counterparts, release tags and npm publication are outside this change.

## Avatar

`dmf-ui/avatar` renders a named outer image role with visible fallback initials and an optional decorative child image. Authors provide the actual name and approved image URL; `decorative=true` suppresses repeated identity when adjacent text supplies it. Sizes are sm/default/lg. A fallback override supports names that should not use derived initials.

Image load/error handling hides failed images and restores them on recovery. Listeners are bound once per image and aborted before Astro swaps; server HTML contains initials even before enhancement. Image-error recovery needs JavaScript. No online status, profile fetch or invented customer identity is added.

## Rating

`dmf-ui/rating` defaults to a read-only score, supporting fractional values and a visible number alongside decorative stars. The image role states the label, score and maximum. `max` is an integer from 1 to 10 and values must be within range.

Editable ratings use `readOnly=false`, an explicit `name`, an integer initial value, a visible legend and native radio inputs. Browser-owned required validation, arrows, checked state, form values, disabled fieldsets and reset remain available. The selected numbered score is highlighted; hover previews and cumulative interactive-star painting are not implemented. No submission, review aggregation or external persistence is built in.

## Chip

`dmf-ui/chip` is a native checkbox filter with a wrapping label, selected checkmark, visible focus and 44px targets. Input attributes such as name/value/checked/disabled/required pass through. Repeated names support FormData.getAll. The small size adjusts typography and padding while retaining target height.

Chip does not duplicate static Badge, act as a navigation link, or supply a removal action. Authors group related choices in a named fieldset and apply selected filters to their own data. Native required applies per checkbox, not to an arbitrary set. Preview feedback reports local selections only.

## Evidence and verification — 2026-10-25

Preview scores are clearly illustrative; avatar initials identify generic project/team examples. An intentionally invalid data image demonstrates failure handling without fetching unrelated remote media. No customer reviews, ratings or identities are represented as real.

Astro check: 213 files with zero errors/warnings/hints. Production build: 44 pages. All 20 source tests pass, including root/individual exports, local links, native markup, fallback names and existing navigation/package/token contracts.

Isolated Chrome passed Avatar failure and recovery, required Rating validity, native arrow selection, FormData and reset, Chip Space selection, repeated-name form values, disabled exclusion and reset. Fifteen axe states had zero violations/incomplete items across DMF, CB, Horego, dark surroundings and mobile RTL. At 200% text, previews stayed within the viewport. Numeric scores remain isolated left-to-right inside RTL layouts. The preceding navigation batch and global search also passed again. No page errors or failed document/script/style requests were observed.

Safari/Firefox, spoken screen readers and physical-device checks remain pending. These automated checks do not establish full accessibility certification. Component detail pages remain DMF-only; preset changes in the browser suite verify shared styling without adding product replicas to those pages.
