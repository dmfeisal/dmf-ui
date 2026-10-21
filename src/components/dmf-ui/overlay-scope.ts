/** Keep relocated source-owned overlays inside their originating preset. */
export function prepareOverlayScope(root: HTMLElement, slot: string) {
  const portal = root.querySelector<HTMLElement>(`[data-slot="${slot}-portal"]`)!;
  const host = root.closest<HTMLElement>('.dmf-ui')!;
  const sync = () => {
    portal.classList.add('dmf-ui');
    portal.dir = getComputedStyle(root).direction;
    for (const key of ['system', 'colorMode'] as const) {
      if (host.dataset[key]) portal.dataset[key] = host.dataset[key];
      else delete portal.dataset[key];
    }
  };
  sync();
  const abort = new AbortController();
  // Preserve native link activation while Data Slot owns menu selection.
  if (slot === 'dropdown-menu') portal.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.isComposing || event.ctrlKey || event.metaKey || event.altKey || !['Enter', ' '].includes(event.key)) return;
    const item = event.target instanceof Element ? event.target.closest('[data-slot="dropdown-menu-item"][href]') : null;
    if (!(item instanceof HTMLAnchorElement) || item.getAttribute('aria-disabled') === 'true') return;
    event.preventDefault(); event.stopPropagation(); item.click();
  }, { capture: true, signal: abort.signal });
  return { sync, cleanup: () => abort.abort() };
}
