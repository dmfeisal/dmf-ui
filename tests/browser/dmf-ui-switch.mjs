// Run through npm run test:dmf-ui; use DMF_UI_TEST_FILTER to select a suite.
export async function run({page,baseURL,navigate}) {
  for (const [path, prefix] of [['/examples/dmf-ui/', 'standalone-form']]) {
    await navigate(`${baseURL}${path}`);
    await page.waitForSelector(`#${prefix}-dmf-updates[data-dmf-switch-ready=true]`);
    await page.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    for (const fontSize of [14, 16, 28]) for (const dir of ['ltr', 'rtl']) for (const size of ['default', 'sm']) {
      await page.evaluate(({ fontSize, dir, size }) => {
        document.documentElement.style.fontSize = `${fontSize}px`;
        document.documentElement.dir = dir;
        document.querySelectorAll('[data-slot=switch]').forEach(el => { el.dataset.size = size; el.style.transition = 'none'; el.firstElementChild.style.transition = 'none'; });
      }, { fontSize, dir, size });
      for (const system of ['dmf', 'cb-ui']) for (let toggle = 0; toggle < 2; toggle++) {
        const selector = `#${prefix}-${system}-updates`;
        await page.focus(selector); await page.keyboard.press('Space');
        const geometry = await page.evaluate(selector => {
          const el = document.querySelector(selector), track = el.getBoundingClientRect(), thumb = el.firstElementChild.getBoundingClientRect();
          const checked = el.getAttribute('aria-checked') === 'true';
          return { checked, inset: checked ? track.right - thumb.right : thumb.left - track.left,
            top: thumb.top - track.top, bottom: track.bottom - thumb.bottom,
            contained: thumb.left >= track.left && thumb.right <= track.right };
        }, selector);
        if (!geometry.contained || [geometry.inset, geometry.top, geometry.bottom].some(n => Math.abs(n - 2) > 0.1)) throw new Error(JSON.stringify({ path, fontSize, dir, size, system, geometry }));
      }
    }
    console.log(`PASS ${path}: both presets, sizes, states, RTL and 14/16/28px roots; equal 2px thumb insets and keyboard toggling`);
  }
}
