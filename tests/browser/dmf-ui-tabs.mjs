// Run through npm run test:dmf-ui; use DMF_UI_TEST_FILTER to select a suite.
export async function run({page,baseURL,navigate,click,mobile:setMobile,settle}) {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const selected = async (id,value) => {
    try { await page.waitForFunction(({id,value})=>document.querySelector(`#${id} [data-value="${value}"][role=tab]`)?.getAttribute('aria-selected')==='true',{id,value}); }
    catch(error) { throw new Error(`Tabs ${id}: expected selection ${value}`,{cause:error}); }
  };
  for (const [path, prefix] of [['/examples/dmf-ui/', 'standalone-tabs']]) {
    await navigate(`${baseURL}${path}`);
    await page.waitForSelector(`#${prefix}-automatic[data-dmf-tabs-ready="true"]`, { state: 'visible' });
    await page.evaluate(() => document.querySelector('astro-dev-toolbar')?.remove());
    assert(await page.evaluate(async path => {
      const doc = new DOMParser().parseFromString(await (await fetch(path)).text(), 'text/html');
      return [...doc.querySelectorAll('[data-dmf-tabs]')].every(root => {
        const visible = [...root.querySelectorAll('[data-slot=tabs-content]')].filter(panel => !panel.hasAttribute('hidden'));
        return visible.length === 1 && visible[0].getAttribute('data-value') === root.getAttribute('data-default-value');
      });
    }, path), 'Initial panels were not present in server HTML');
    assert(await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
      if (new Set(ids).size !== ids.length) return false;
      return [...document.querySelectorAll('[data-dmf-tabs]')].every(root => {
        const list = root.querySelector('[role=tablist]');
        return !!list?.getAttribute('aria-label') && [...root.querySelectorAll('[role=tab]')].every(tab => {
          const panel = document.getElementById(tab.getAttribute('aria-controls'));
          return panel?.getAttribute('role') === 'tabpanel' && panel.getAttribute('aria-labelledby') === tab.id && tab.getAttribute('type') === 'button';
        });
      });
    }), 'Tabs ARIA associations or unique IDs failed');
    const automatic = `${prefix}-automatic`, manual = `${prefix}-manual`, vertical = `${prefix}-vertical`;
    await page.focus(`#${automatic} [data-value=overview][role=tab]`);
    await page.keyboard.press('ArrowRight'); await selected(automatic, 'details');
    await selected(manual, 'details'); await selected(vertical, 'overview');
    await click(`#${automatic} [data-value=usage][role=tab]`); await selected(automatic, 'usage');
    await page.keyboard.press('End'); await selected(automatic, 'usage');
    await page.keyboard.press('Home'); await selected(automatic, 'overview');
    assert(await page.evaluate(id => {
      const root = document.getElementById(id);
      return root.querySelector('[data-value=unavailable][role=tab]').disabled &&
        root.querySelectorAll('[role=tab][tabindex="0"]').length === 1 && root.querySelectorAll('[role=tabpanel]:not([hidden])').length === 1;
    }, automatic), 'Disabled, roving focus or panel visibility failed');
    await page.focus(`#${manual} [data-value=details][role=tab]`);
    await page.keyboard.press('Home');
    assert(await page.evaluate(id => document.activeElement === document.querySelector(`#${id} [data-value=overview][role=tab]`), manual), 'Manual Home did not move focus');
    await selected(manual, 'details');
    await page.keyboard.press('Enter'); await selected(manual, 'overview');
    await page.keyboard.press('ArrowRight'); await selected(manual, 'overview');
    await page.keyboard.press('Space'); await selected(manual, 'details');
    await page.focus(`#${vertical} [data-value=overview][role=tab]`);
    await page.keyboard.press('ArrowDown'); await selected(vertical, 'details');
    await page.keyboard.press('ArrowUp'); await selected(vertical, 'overview');
    await page.evaluate(() => document.documentElement.dir = 'rtl');
    await page.focus(`#${automatic} [data-value=overview][role=tab]`);
    await page.keyboard.press('ArrowLeft'); await selected(automatic, 'details');
    await page.keyboard.press('Home'); await selected(automatic, 'overview');
    await page.keyboard.press('ArrowRight'); await selected(automatic, 'usage');
    await page.focus(`#${manual} [data-value=details][role=tab]`);
    await page.keyboard.press('ArrowRight'); await selected(manual, 'details');
    assert(await page.evaluate(id => document.activeElement.dataset.value === 'overview' && document.activeElement.closest('[data-dmf-tabs]').id === id, manual), 'RTL manual focus failed');
    await page.keyboard.press('Enter'); await selected(manual, 'overview');
    await page.cdp('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
    await page.cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await page.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await page.waitForFunction(() => matchMedia('(pointer: coarse)').matches);
    await page.focus(`#${automatic} [data-value=overview][role=tab]`);
    await page.keyboard.press('Home');
    await page.keyboard.press('ArrowLeft'); await selected(automatic, 'details');
    await setMobile(); await settle();
    assert(await page.evaluate(id => {
      const rect = document.querySelector(`#${id} [role=tablist]`).getBoundingClientRect();
      const triggers = [...document.querySelectorAll(`#${id} [role=tab]`)];
      return document.documentElement.clientWidth === 390 && rect.width <= document.documentElement.clientWidth && document.documentElement.scrollWidth <= document.documentElement.clientWidth && triggers.every(tab => tab.getBoundingClientRect().height >= 44);
    }, automatic), 'Mobile RTL tab targets or containment failed');
    console.log(await page.screenshot({ path: `/tmp/${prefix}-mobile-tabs.png` }));
    await page.cdp('Emulation.clearDeviceMetricsOverride');
    await page.cdp('Emulation.setTouchEmulationEnabled', { enabled: false });
    await page.cdp('Emulation.setEmulatedMedia', { features: [] });
    await page.evaluate(() => { document.documentElement.dir = 'ltr'; document.documentElement.dataset.theme = 'dark'; document.dispatchEvent(new Event('astro:page-load')); document.dispatchEvent(new Event('astro:page-load')); });
    await page.focus(`#${automatic} [data-value=details][role=tab]`);
    await page.keyboard.press('ArrowRight'); await selected(automatic, 'usage'); // duplicate listeners would wrap again
    assert(await page.evaluate(id => { const ctx=document.createElement('canvas').getContext('2d'); ctx.fillStyle=getComputedStyle(document.getElementById(id)).getPropertyValue('--background'); ctx.fillRect(0,0,1,1); return Math.max(...ctx.getImageData(0,0,1,1).data.slice(0,3))<20; }, automatic), 'Dark tabs did not inherit theme');
    if (prefix === 'standalone-tabs') {
      await page.evaluate(() => document.dispatchEvent(new Event('astro:before-swap')));
      assert(await page.evaluate(() => !document.querySelector('[data-dmf-tabs-ready]')), 'Tabs teardown retained ready roots');
      await page.evaluate(() => document.dispatchEvent(new Event('astro:page-load')));
      await page.waitForSelector(`#${automatic}[data-dmf-tabs-ready="true"]`, { state: 'visible' });
      await page.focus(`#${automatic} [data-value=overview][role=tab]`);
      await page.keyboard.press('ArrowRight'); await selected(automatic, 'details');
    }
    console.log(`PASS: ${path} Tabs SSR, ARIA, automatic/manual, disabled, vertical, RTL, mobile, themes and lifecycle`);
  }
}
