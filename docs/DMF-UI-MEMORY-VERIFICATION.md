# Memory-safe verification

27 October 2026. Follow-up to 534c747. Versions, dependency graphs and UI behavior remain unchanged.

## Findings

The earlier discovery test compared two different React/jsdom form nodes using raw strict equality. A failed identity assertion can ask Node to format the attached cyclic DOM/Fiber graphs. That failed diagnostic took tens of seconds, whereas the corrected test completed normally. Overlapping diagnostic processes added pressure. No historical heap profile was captured, so this is the strongest identified failure path rather than an attribution of every byte of the machine's earlier spike.

No leftover test workers were found during the initial process inspection. A separate, long-running Astro dev server was also using substantial RSS; it and the user's other applications were left running. These changes do not claim to profile or cap those independent processes.

## Safeguards

- The packed consumer's assertion helper reduces DOM identity failures to boolean assertions and short node-name/ID descriptions. It never passes DOM/Fiber objects to Node's diff formatter. A deliberately failing comparison is repeated 100 times with custom inspection hooks that would throw if the graph were visited.
- Repository, adapter and packed-consumer Node tests run with one worker and a 256 MiB V8 old-space limit. Per-test deadlines are 30 seconds for repository tests and 15 seconds for React tests. The fixture exposes GC only for its lifecycle regression measurement, not in application code.
- The packed-consumer runner enforces a 60-second external deadline and 512 MiB sampled RSS budget for its test process group. Build/install/package steps have 180-second deadlines and a 1 GiB budget. The external guard can terminate a blocked worker even when that worker's own event loop cannot run a timeout.
- Stdout and stderr together are capped at 2 MiB, including streamed output. Captured failure tails are limited to 4 KiB. Successful archive JSON remains intact within that budget.
- On this POSIX host, each command has its own process group. Failure, interruption and normal completion clean up that owned group, including background workers. The watchdog samples group RSS every 250ms. Windows retains the heap/deadline protections; equivalent process-group RSS/cleanup is not claimed there.
- An exclusive verification lock prevents overlapping packed-consumer/browser runs. A live owner causes a clear failure rather than another diagnostic process. A dead owner's lock can be reclaimed. AGENTS.md records the workflow and prohibits overlapping retries or raw DOM diff formatting.
- The browser CLI now shares bounded command execution and lock handling. External browser application renderers are outside the CLI's process group and are not covered by its RSS budget.

RSS monitoring is sampled and may overshoot between samples. V8 old-space limits do not cap all native allocations or whole-machine memory. These safeguards bound the identified failure path and stop monitored overruns; they are not a promise that arbitrary future code or unrelated applications can never grow memory.

## Verification

- All 49 repository tests, seven adapter tests and 30 fresh packed-consumer tests pass with the configured serial/heap limits.
- Seven process-guard checks cover locking, synchronous stuck workers, script stdin, stdout/stderr limits, background-worker cleanup and an intentionally memory-growing worker. The memory probe is small and controlled: it is stopped after exceeding its 96 MiB test budget.
- The final packed test command's sampled peak RSS is approximately 315 MiB, below its 512 MiB budget; the production consumer build is approximately 272 MiB. npm installation peaks around 536 MiB under its separate 1 GiB budget. These are process-group measurements, not whole-machine usage or historical peak comparisons.
- After five warm-up cycles, 25 additional discovery mount/unmount cycles retain zero popstate listeners and show no retained-heap growth in this run. This is scoped React/jsdom lifecycle evidence, not a browser-wide leak certification.
- Generated contracts and whitespace checks pass. No dependency, lock graph, app source, browser UI or version change is needed.

Ignored local evidence: react-process-metrics.json under .dmf-ui-test-results and the command logs from this review. No full heap dump or asset data is retained in the report.
