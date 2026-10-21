// Independent consumer acceptance suite; preview must run on port 4402.

{
const resetPage = (await taskSpace('dmf-ui-consumer-20261021')).page('p1');
await resetPage.cdp('Emulation.clearDeviceMetricsOverride');
await resetPage.cdp('Emulation.setTouchEmulationEnabled', {enabled:false});
await resetPage.cdp('Emulation.setEmulatedMedia', {features:[]});
await resetPage.cdp('Emulation.setPageScaleFactor', {pageScaleFactor:1});
// Run: ego-browser nodejs < tests/browser/dmf-ui-pilot.mjs
// Requires the local dev server on port 4402. Uses the ego-browser task runtime.
const task = await taskSpace('dmf-ui-consumer-20261021');
const page = task.page('p1');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
await page.cdp('Emulation.clearDeviceMetricsOverride');
await page.goto('http://127.0.0.1:4402/examples/dmf-ui/');
await page.waitForSelector('html[data-dmf-example-ready="true"]', { state: 'visible' });
await page.evaluate(() => document.querySelector('astro-dev-toolbar')?.remove());
assert(await page.evaluate(() => {
  const assets = performance.getEntriesByType('resource').map(item => item.name);
  return !assets.some(url => /\/css\/|canvas-|components\.js|transition\.js|fonts\.google/.test(url)) &&
    !getComputedStyle(document.body).getPropertyValue('--dmf-color-bg').trim();
}), 'Standalone example loaded portfolio assets or tokens');
for (const id of ['first','second']) {
  await page.click(`text="Open ${id} dialog"`);
  await page.waitForFunction(id => document.querySelector(`#${id}-dialog`)?.contains(document.activeElement), id);
  assert(await page.evaluate(id => [...document.querySelectorAll('[data-slot=dialog-content]')].filter(panel => !panel.hidden).length === 1 && !document.querySelector(`#${id}-dialog`).hidden, id), 'Dialog instances were not independent');
  await page.keyboard.press('Escape');
  await page.waitForFunction(id => document.querySelector(`#${id}-dialog`)?.hidden && document.querySelector(`#${id}-dialog`)?.closest('[data-slot=dialog-portal]')?.querySelector('[data-slot=dialog-overlay]')?.hidden, id);
  await page.waitForFunction(id => document.activeElement?.textContent.trim() === `Open ${id} dialog`, id);
}
await page.click('[data-dmf-example=first] button[type=submit]');
assert(await page.evaluate(() => !document.querySelector('[data-dmf-example=first] form').checkValidity() && !document.querySelector('[data-slot=toast-item]')), 'Required field did not prevent submit');
await page.fill('#first-name', 'Independent visitor');
await page.click('[data-dmf-example=first] button[type=submit]');
await page.waitForSelector('[data-slot=toast-title]:text-is("first name checked")', { state: 'visible' });
assert(await page.evaluate(() => !document.querySelector('#second-toaster [data-slot=toast-item]')), 'First form triggered second notification');
await page.click('#first-toaster [data-slot=toast-close]');
await page.waitForSelector('#first-toaster [data-slot=toast-item]', { state: 'hidden' });
await page.click('text="Show second success"');
await page.waitForSelector('#second-toaster [data-slot=toast-title]:text-is("second success")', { state: 'visible' });
assert(await page.evaluate(() => !document.querySelector('#first-toaster [data-slot=toast-item]')), 'Second notification changed first instance');
await page.click('#second-toaster [data-slot=toast-close]');
await page.waitForSelector('#second-toaster [data-slot=toast-item]', { state: 'hidden' });
await page.click('#example-theme'); // System -> Light
await page.click('#example-theme'); // Light -> Dark
assert(await page.evaluate(() => document.documentElement.dataset.theme === 'dark' && getComputedStyle(document.body).backgroundColor !== 'rgb(255, 255, 255)'), 'Standalone dark theme failed');
await page.cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await page.evaluate(() => document.documentElement.dir = 'rtl');
await page.click('text="Open second dialog"');
await page.waitForFunction(() => document.querySelector('#second-dialog')?.contains(document.activeElement));
assert(await page.evaluate(() => { const rect = document.querySelector('#second-dialog').getBoundingClientRect(); return rect.left >= 0 && rect.right <= innerWidth && document.documentElement.scrollWidth <= innerWidth; }), 'Standalone mobile RTL overflow');
await page.keyboard.press('Escape');
await page.waitForFunction(() => document.querySelector('#second-dialog')?.hidden);
console.log(await page.screenshot({ path: '/tmp/dmf-ui-standalone-mobile.png' }));
await page.cdp('Emulation.clearDeviceMetricsOverride');
await page.evaluate(() => { document.documentElement.dir = 'ltr'; window.scrollTo(0, 0); });
await page.click('#example-theme'); // Dark -> System
await page.click('#example-theme'); // System -> Light
await page.waitForFunction(() => { const b=document.querySelector('[data-dmf-example] button'), p=document.createElement('div'); p.style.backgroundColor='var(--primary)'; b.parentElement.append(p); const expected=getComputedStyle(p).backgroundColor; p.remove(); return getComputedStyle(b).backgroundColor===expected; });
assert(await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.example-surface')).borderRadius) > 0), 'Standalone surface radius depends on missing theme variables');
console.log(await page.screenshot({ path: '/tmp/dmf-ui-standalone-desktop.png' }));
console.log('PASS: standalone assets/tokens, independent dialogs and notifications, native validation, dark theme, mobile RTL');


}

{
const resetPage = (await taskSpace('dmf-ui-consumer-20261021')).page('p1');
await resetPage.cdp('Emulation.clearDeviceMetricsOverride');
await resetPage.cdp('Emulation.setTouchEmulationEnabled', {enabled:false});
await resetPage.cdp('Emulation.setEmulatedMedia', {features:[]});
await resetPage.cdp('Emulation.setPageScaleFactor', {pageScaleFactor:1});
// Run with the local preview on port 4402: ego-browser nodejs < tests/browser/dmf-ui-tabs.mjs
const task = await taskSpace('dmf-ui-consumer-20261021');
const page = task.page('p1');
const assert = (value, message) => { if (!value) throw new Error(message); };
const selected = (id, value) => page.waitForFunction(({ id, value }) => document.querySelector(`#${id} [data-value="${value}"][role=tab]`)?.getAttribute('aria-selected') === 'true', { id, value });
for (const [path, prefix] of [['/examples/dmf-ui/', 'standalone-tabs']]) {
  await page.goto(`http://127.0.0.1:4402${path}`);
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
  await page.click(`#${automatic} [data-value=usage][role=tab]`); await selected(automatic, 'usage');
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
  assert(await page.evaluate(id => {
    const rect = document.querySelector(`#${id} [role=tablist]`).getBoundingClientRect();
    const triggers = [...document.querySelectorAll(`#${id} [role=tab]`)];
    return rect.width <= innerWidth && document.documentElement.scrollWidth <= innerWidth && triggers.every(tab => tab.getBoundingClientRect().height >= 44);
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

{
const resetPage = (await taskSpace('dmf-ui-consumer-20261021')).page('p1');
await resetPage.cdp('Emulation.clearDeviceMetricsOverride');
await resetPage.cdp('Emulation.setTouchEmulationEnabled', {enabled:false});
await resetPage.cdp('Emulation.setEmulatedMedia', {features:[]});
await resetPage.cdp('Emulation.setPageScaleFactor', {pageScaleFactor:1});
// Run: ego-browser nodejs < tests/browser/dmf-ui-forms.mjs (preview on port 4402)
const task = await taskSpace('dmf-ui-consumer-20261021');
const page = task.page('p1');
const assert = (value, message) => { if (!value) throw new Error(message); };
for (const [path, pagePrefix] of [['/examples/dmf-ui/', 'standalone-form']]) {
  await page.goto(`http://127.0.0.1:4402${path}`);
  await page.waitForSelector(`[data-dmf-form="${pagePrefix}-cb-ui"][data-dmf-form-ready=true]`, { state: 'visible' });
  await page.evaluate(() => document.querySelector('astro-dev-toolbar')?.remove());
  assert(await page.evaluate(prefix => {
    return ['dmf','cb-ui'].every(system => {
      const form = document.querySelector(`[data-dmf-form="${prefix}-${system}"]`);
      return form.dataset.dmfFormReady === 'true' && !form.querySelector('[data-form-controls]').disabled && form.querySelector('[data-slot=radio-group]').getAttribute('role') === 'radiogroup';
    });
  }, pagePrefix), 'Form runtimes were not ready');
  assert(await page.evaluate(prefix => {
    return [...document.querySelectorAll(`[data-dmf-form^="${prefix}"] input[id], [data-dmf-form^="${prefix}"] textarea[id], [data-dmf-form^="${prefix}"] button[id]`)].every(control => control.labels?.length > 0);
  }, pagePrefix), 'A visible form control is missing its native label association');
  for (const system of ['dmf','cb-ui']) {
    const prefix = `${pagePrefix}-${system}`, selector = `[data-dmf-form="${prefix}"]`;
    await page.focus(`${selector} button[type=submit]`); await page.keyboard.press("Enter");
    assert(await page.evaluate(selector => {
      const form = document.querySelector(selector);
      return !form.checkValidity() && form.querySelector('[data-form-output]').hidden && form.querySelectorAll('[data-invalid=true]').length >= 4;
    }, selector), 'Native invalid form was not blocked or errors were missing');
    await page.fill(`#${prefix}-name`, 'Example visitor');
    await page.fill(`#${prefix}-email`, 'not-an-email');
    await page.fill(`#${prefix}-message`, 'A complete local message for this example.');
    await page.focus(`#${prefix}-channel`); await page.keyboard.press('Space'); await page.keyboard.press('Home'); await page.keyboard.press('Enter');
    await page.waitForFunction(id => document.activeElement.id === id, `${prefix}-channel`);
    await page.focus(`#${prefix}-weekly`);
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowDown');
    assert(await page.evaluate(prefix => document.querySelector(`#${prefix}-monthly`).getAttribute('aria-checked') === 'true' && document.querySelector(`#${prefix}-daily`).disabled, prefix), 'Radio navigation did not select monthly and skip disabled');
    await page.focus(`#${prefix}-terms`); await page.keyboard.press('Space');
    await page.focus(`#${prefix}-updates`); await page.keyboard.press('Space');
    await page.focus(`${selector} button[type=submit]`); await page.keyboard.press("Enter");
    assert(await page.evaluate(selector => !document.querySelector(selector).checkValidity() && document.querySelector(selector).querySelector('[data-form-output]').hidden, selector), 'Invalid email submitted');
    await page.fill(`#${prefix}-email`, 'visitor@example.com');
    await page.focus(`${selector} button[type=submit]`); await page.keyboard.press("Enter");
    await page.waitForSelector(`${selector} [data-form-output]`, { state: 'visible' });
    assert(await page.evaluate(selector => {
      const form = document.querySelector(selector), data = JSON.parse(form.querySelector('[data-form-output]').textContent);
      return data.channel === 'email' && !('disabled-channel' in data) && data.name === 'Example visitor' && data.email === 'visitor@example.com' && data.schedule === 'monthly' && data.terms === 'accepted' && data.updates === 'no' && data.reference === 'Local example' && !('disabled-field' in data) && !('disabled-switch' in data);
    }, selector), 'Native FormData values did not match the selected controls');
    const other = `${pagePrefix}-${system === 'dmf' ? 'cb-ui' : 'dmf'}`;
    assert(await page.evaluate(prefix => document.querySelector(`#${prefix}-name`).value === '', other), 'Form state leaked into the other preset');
    await page.focus(`${selector} button[type=reset]`); await page.keyboard.press("Enter");
    await page.waitForFunction(prefix => document.querySelector(`#${prefix}-updates`).getAttribute('aria-checked') === 'true', prefix);
    assert(await page.evaluate(({ prefix, selector }) => {
      const form = document.querySelector(selector);
      return !document.querySelector(`#${prefix}-terms`).checked && document.querySelector(`#${prefix}-name`).value === '' && !form.querySelector('[role=radio][aria-checked=true]') && form.querySelector('[data-form-output]').hidden && !form.querySelector('[data-invalid=true]');
    }, { prefix, selector }), 'Native reset or form UI reset failed');
  }
  assert(await page.evaluate(prefix => {
    const cb = document.querySelector(`[data-dmf-form="${prefix}-cb-ui"]`).closest('[data-system]');
    const dmf = document.querySelector(`[data-dmf-form="${prefix}-dmf"]`).closest('[data-system]');
    return getComputedStyle(cb).getPropertyValue('--primary').trim() === '#26ade4' && getComputedStyle(dmf).getPropertyValue('--primary').trim() !== '#26ade4' && getComputedStyle(cb).fontFamily.includes('DMF CB Nunito');
  }, pagePrefix), 'CB preset or font was not scoped');
  await page.evaluate(() => document.documentElement.dataset.theme = 'dark');
  assert(await page.evaluate(prefix => {
    const cb = document.querySelector(`[data-dmf-form="${prefix}-cb-ui"]`).closest('[data-system]');
    const dmf = document.querySelector(`[data-dmf-form="${prefix}-dmf"]`).closest('[data-system]');
    const ctx=document.createElement('canvas').getContext('2d');
    ctx.fillStyle=getComputedStyle(dmf).backgroundColor; ctx.fillRect(0,0,1,1);
    return getComputedStyle(cb).backgroundColor === 'rgb(255, 255, 255)' && Math.max(...ctx.getImageData(0,0,1,1).data.slice(0,3)) < 20;
  }, pagePrefix), 'CB light-only mode or DMF dark theme failed');
  const tabsId = `${pagePrefix}-cb-ui-tabs-automatic`;
  await page.focus(`#${tabsId} [data-value=overview][role=tab]`); await page.keyboard.press('ArrowRight');
  await page.waitForFunction(id => document.querySelector(`#${id} [data-value=details][role=tab]`).getAttribute('aria-selected') === 'true', tabsId);
  await page.cdp('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
  await page.cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await page.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await page.evaluate(() => document.documentElement.dir = 'rtl');
  await page.focus(`#${pagePrefix}-cb-ui-terms`);
  assert(await page.evaluate(prefix => {
    const checkbox = document.querySelector(`#${prefix}-cb-ui-terms`), sw = document.querySelector(`#${prefix}-cb-ui-updates`);
    const label = document.querySelector(`label[for="${prefix}-cb-ui-terms"]`);
    return document.documentElement.scrollWidth <= innerWidth && checkbox.getBoundingClientRect().width === checkbox.getBoundingClientRect().height && sw.getBoundingClientRect().height < 44 && label.getBoundingClientRect().height >= 44 && getComputedStyle(sw).direction === 'ltr';
  }, pagePrefix), 'Mobile RTL overflow, control artwork or label targets failed');
  await page.cdp('Emulation.setPageScaleFactor', { pageScaleFactor: 1 });
  console.log(await page.screenshot({ path: `/tmp/${pagePrefix}-forms-mobile.png` }));
  await page.cdp('Emulation.clearDeviceMetricsOverride');
  await page.cdp('Emulation.setTouchEmulationEnabled', { enabled: false });
  await page.cdp('Emulation.setEmulatedMedia', { features: [] });
  await page.evaluate(() => { document.documentElement.dir = 'ltr'; document.documentElement.dataset.theme = 'light'; document.dispatchEvent(new Event('astro:page-load')); document.dispatchEvent(new Event('astro:page-load')); });
  assert(await page.evaluate(prefix => {
    return ['dmf','cb-ui'].every(system => {
      const form = document.querySelector(`[data-dmf-form="${prefix}-${system}"]`);
      return form.querySelectorAll('[data-radio-group-generated=input]').length === 3;
    });
  }, pagePrefix), 'Repeated initialization duplicated native proxies');
  if (pagePrefix === 'standalone-form') {
    await page.evaluate(() => document.dispatchEvent(new Event('astro:before-swap')));
    assert(await page.evaluate(() => !document.querySelector('[data-dmf-form-ready]') && !document.querySelector('[data-radio-group-generated=input]')), 'Form teardown retained native proxies');
    await page.evaluate(() => document.dispatchEvent(new Event('astro:page-load')));
    await page.waitForSelector(`[data-dmf-form="${pagePrefix}-cb-ui"][data-dmf-form-ready=true]`, { state: 'visible' });
  }
  console.log(`PASS: ${path} both presets, native validation/FormData/reset, keyboard, disabled/readonly, scope, themes, mobile RTL, lifecycle`);
}


}

{
const resetPage = (await taskSpace('dmf-ui-consumer-20261021')).page('p1');
await resetPage.cdp('Emulation.clearDeviceMetricsOverride');
await resetPage.cdp('Emulation.setTouchEmulationEnabled', {enabled:false});
await resetPage.cdp('Emulation.setEmulatedMedia', {features:[]});
await resetPage.cdp('Emulation.setPageScaleFactor', {pageScaleFactor:1});
// Run: ego-browser nodejs < tests/browser/dmf-ui-switch.mjs
const task = await taskSpace('dmf-ui-consumer-20261021');
const page = task.page('p1');
for (const [path, prefix] of [['/examples/dmf-ui/', 'standalone-form']]) {
  await page.goto(`http://127.0.0.1:4402${path}`);
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

{
const resetPage = (await taskSpace('dmf-ui-consumer-20261021')).page('p1');
await resetPage.cdp('Emulation.clearDeviceMetricsOverride');
await resetPage.cdp('Emulation.setTouchEmulationEnabled', {enabled:false});
await resetPage.cdp('Emulation.setEmulatedMedia', {features:[]});
await resetPage.cdp('Emulation.setPageScaleFactor', {pageScaleFactor:1});
// Run: ego-browser nodejs < tests/browser/dmf-ui-select.mjs
const task = await taskSpace('dmf-ui-consumer-20261021');
const page = task.page('p1');
const assert = (value, message) => { if (!value) throw new Error(message); };
for (const [path, prefix] of [['/examples/dmf-ui/', 'standalone-form']]) {
  await page.goto(`http://127.0.0.1:4402${path}`);
  await page.waitForSelector(`[data-dmf-form="${prefix}-cb-ui"][data-dmf-form-ready=true]`);
  await page.evaluate(() => document.querySelector('astro-dev-toolbar')?.remove());
  await page.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  for (const system of ['dmf', 'cb-ui']) {
    const id = `${prefix}-${system}-channel`, form = `[data-dmf-form="${prefix}-${system}"]`;
    assert(await page.evaluate(id => {
      const trigger=document.getElementById(id),root=trigger.closest('[data-dmf-select]'),proxy=root.querySelector('select');
      return trigger.getAttribute('role')==='combobox' && trigger.labels.length===1 && proxy.required && !proxy.validity.valid && document.getElementById(id.replace('channel','disabled-select')).disabled;
    }, id), 'Required validity, label or disabled state failed');
    await page.focus(`#${id}`); await page.keyboard.press('Space');
    await page.keyboard.press('Home'); await page.keyboard.press('ArrowDown');
    assert(await page.evaluate(() => document.activeElement.dataset.value==='digest'), 'Arrow navigation did not skip disabled option');
    await page.keyboard.press('Enter');
    await page.waitForFunction(id => document.activeElement.id===id, id);
    assert(await page.evaluate(({id, form}) => {
      const root=document.getElementById(id).closest('[data-dmf-select]');
      return root.dataset.value==='digest' && root.querySelector('select').validity.valid && new FormData(document.querySelector(form)).get('channel')==='digest' && !new FormData(document.querySelector(form)).has('disabled-channel');
    }, {id, form}), 'Selected form value or focus return failed');
    await page.focus(`#${id}`); await page.keyboard.press('Space'); await page.keyboard.press('Home'); await page.keyboard.press('n');
    assert(await page.evaluate(()=>document.activeElement.dataset.value==='none'), 'Typeahead failed');
    await page.keyboard.press('Escape');
    await page.waitForFunction(id => document.activeElement.id===id, id);
    await page.focus(`${form} button[type=reset]`); await page.keyboard.press('Enter');
    await page.waitForFunction(id=>document.getElementById(id).closest('[data-dmf-select]').querySelector('select').value==='',id);
  }
  await page.reload();
  await page.waitForSelector(`[data-dmf-form="${prefix}-cb-ui"][data-dmf-form-ready=true]`);
  await page.cdp('Emulation.setDeviceMetricsOverride', { width:390,height:844,deviceScaleFactor:1,mobile:true });
  await page.cdp('Emulation.setTouchEmulationEnabled', { enabled:true,maxTouchPoints:1 });
  await page.evaluate(id=>{
    document.documentElement.dir='rtl'; document.documentElement.dataset.theme='dark';
    document.querySelector('astro-dev-toolbar')?.remove();
    const e=document.getElementById(id); e.scrollIntoView({block:'center'}); e.focus();
  }, `${prefix}-cb-ui-channel`);
  await page.cdp('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});
  await page.cdp('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});
  const mobile = await page.evaluate(async()=>{
    await Promise.allSettled(document.querySelector('[data-slot=select-content][data-open]').getAnimations({subtree:true}).map(animation=>animation.finished));
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const content=document.querySelector('[data-slot=select-content][data-open]'),portal=content.closest('[data-slot=select-portal]'),r=content.getBoundingClientRect(),style=getComputedStyle(content);
    return {system:portal.dataset.system,dir:style.direction,font:style.fontFamily,bg:style.backgroundColor,left:r.left,right:r.right,width:document.documentElement.clientWidth,heights:[...content.querySelectorAll('[data-slot=select-item]')].map(e=>e.getBoundingClientRect().height)};
  });
  assert(mobile.system==='cb-ui' && mobile.dir==='rtl' && mobile.font.includes('DMF CB Nunito') && mobile.bg==='rgb(255, 255, 255)' && mobile.left>=0 && mobile.right<=mobile.width+1 && mobile.heights.every(h=>h>=44), JSON.stringify(mobile));
  await page.keyboard.press('Escape');
  await page.cdp('Emulation.clearDeviceMetricsOverride');await page.cdp('Emulation.setTouchEmulationEnabled',{enabled:false});
  await page.evaluate(()=>{document.dispatchEvent(new Event('astro:page-load'));document.dispatchEvent(new Event('astro:page-load'));});
  assert(await page.evaluate(()=>[...document.querySelectorAll('[data-dmf-select]')].every(root=>root.querySelectorAll('[data-form-field-generated]').length===1)), 'Repeated initialization duplicated proxies');
  await page.evaluate(()=>document.dispatchEvent(new Event('astro:before-swap')));
  assert(await page.evaluate(()=>!document.querySelector('[data-dmf-select-ready],select[data-form-field-generated]')), 'Select teardown failed');
  await page.evaluate(()=>document.dispatchEvent(new Event('astro:page-load')));
  await page.waitForSelector(`[data-dmf-form="${prefix}-cb-ui"][data-dmf-form-ready=true]`);
  console.log(`PASS ${path}: Select presets, labels, required/disabled, keyboard/typeahead/Escape/focus, FormData/reset, mobile RTL themes, lifecycle`);
}


}

{
const resetPage = (await taskSpace('dmf-ui-consumer-20261021')).page('p1');
await resetPage.cdp('Emulation.clearDeviceMetricsOverride');
await resetPage.cdp('Emulation.setTouchEmulationEnabled', {enabled:false});
await resetPage.cdp('Emulation.setEmulatedMedia', {features:[]});
await resetPage.cdp('Emulation.setPageScaleFactor', {pageScaleFactor:1});
// Run: ego-browser nodejs < tests/browser/dmf-ui-overlays.mjs
const task=await taskSpace('dmf-ui-consumer-20261021');
const page=task.page('p1');
const assert=(value,message)=>{if(!value)throw new Error(message);};
for(const [path,prefix] of [['/examples/dmf-ui/','standalone-form']]) {
  await page.goto(`http://127.0.0.1:4402${path}`);
  await page.waitForSelector(`#${prefix}-cb-ui-menu[data-dmf-overlay-ready]`);
  await page.evaluate(()=>document.querySelector('astro-dev-toolbar')?.remove());
  for(const system of ['dmf','cb-ui']) {
    const id=`${prefix}-${system}`;
    await page.focus(`#${id}-popover-trigger`);await page.keyboard.press('Space');
    await page.waitForSelector(`#${id}-draft`,{state:'visible'});
    assert(await page.evaluate(id=>{
      const trigger=document.getElementById(`${id}-popover-trigger`),content=document.querySelector('[data-slot=popover-content][data-open]');
      return trigger.getAttribute('aria-expanded')==='true' && content.getAttribute('role')==='dialog' && content.getAttribute('aria-labelledby')===`${id}-popover-title`;
    },id),'Popover ARIA failed');
    await page.fill(`#${id}-draft`,'Updated draft');await page.keyboard.press('Escape');
    await page.waitForFunction(id=>document.activeElement.id===`${id}-popover-trigger`,id);
    await page.keyboard.press('Space');
    assert(await page.evaluate(id=>document.getElementById(`${id}-draft`).value==='Updated draft',id),'Popover draft lost on reopen');
    await page.focus('[data-slot=popover-content][data-open] [data-slot=popover-close]');await page.keyboard.press('Enter');
    await page.waitForFunction(id=>document.activeElement.id===`${id}-popover-trigger`,id);
    await page.focus(`#${id}-menu-trigger`);await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Home');await page.keyboard.press('ArrowDown');
    assert(await page.evaluate(()=>document.activeElement.dataset.value==='hints'),'Menu did not skip disabled item');
    await page.keyboard.press('Space');
    assert(await page.evaluate(()=>document.activeElement.getAttribute('aria-checked')==='false'),'Checkbox menu toggle failed');
    await page.keyboard.press('End');await page.keyboard.press('Enter');
    assert(await page.evaluate(()=>document.activeElement.dataset.value==='compact'&&document.activeElement.getAttribute('aria-checked')==='true'),'Radio menu selection failed');
    await page.keyboard.press('Home');await page.keyboard.press('Enter');
    assert(await page.evaluate(id=>document.querySelector(`[data-overlay-example="${id}"] [data-overlay-status]`).textContent.startsWith('Preview selection selected'),id),'Action feedback missing');
    await page.keyboard.press('Escape');await page.waitForFunction(id=>document.activeElement.id===`${id}-menu-trigger`,id);
    await page.keyboard.press('Space');await page.click(`#${id}-popover-trigger`);
    await page.waitForFunction(id=>document.getElementById(`${id}-menu-trigger`).getAttribute('aria-expanded')==='false',id);
    await page.keyboard.press('Escape');
    await page.waitForFunction(id=>document.activeElement.id===`${id}-popover-trigger`,id);
  }
  // Use protocol input after setting metrics; browser interaction helpers can restore desktop dimensions.
  await page.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await page.cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  for(const slot of ['popover','menu']) {
    const target = await page.evaluate(async ({prefix,slot})=>{
      document.documentElement.dir='rtl';document.documentElement.dataset.theme='dark';
      await document.fonts.ready;
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      const trigger=document.getElementById(`${prefix}-cb-ui-${slot}-trigger`);trigger.scrollIntoView({block:'center',behavior:'instant'});
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      trigger.focus({preventScroll:true});
      const rect=trigger.getBoundingClientRect(); return {x:rect.left+rect.width/2,y:rect.top+rect.height/2};
    },{prefix,slot});
    assert(target.x>=0&&target.x<=390&&target.y>=0&&target.y<=844,JSON.stringify({target,slot}));
    await page.cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...target,id:1}]});
    await page.cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    const result=await page.evaluate(async slot=>{
      const part=slot==='menu'?'dropdown-menu':slot;
      let content;
      await new Promise((resolve,reject)=>{const start=performance.now();function check(){content=document.querySelector(`[data-slot="${part}-content"][data-open]`);if(content)resolve(true);else if(performance.now()-start>3000)reject(new Error(`Touch did not open ${part}`));else requestAnimationFrame(check);}check();});
      await Promise.allSettled(content.getAnimations({subtree:true}).map(a=>a.finished));
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      const rect=content.getBoundingClientRect(),style=getComputedStyle(content);
      return {left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,width:document.documentElement.clientWidth,height:innerHeight,bg:style.backgroundColor,dir:style.direction,font:style.fontFamily,targets:[...content.querySelectorAll('[role^=menuitem]')].map(e=>e.getBoundingClientRect().height)};
    },slot);
    assert(result.left>=0&&result.right<=result.width+1&&result.top>=0&&result.bottom<=result.height+1&&result.bg==='rgb(255, 255, 255)'&&result.dir==='rtl'&&result.font.includes('DMF CB Nunito')&&result.targets.every(h=>h>=44),JSON.stringify(result));
    await page.cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await page.cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await page.evaluate(id=>new Promise((resolve,reject)=>{const start=performance.now();function check(){if(document.activeElement.id===id)resolve(true);else if(performance.now()-start>2000)reject(new Error('Mobile focus return timed out'));else requestAnimationFrame(check);}check();}),`${prefix}-cb-ui-${slot}-trigger`);
  }
  await page.cdp('Emulation.clearDeviceMetricsOverride');await page.cdp('Emulation.setTouchEmulationEnabled',{enabled:false});
  await page.evaluate(()=>{document.dispatchEvent(new Event('astro:page-load'));document.dispatchEvent(new Event('astro:page-load'));});
  await page.focus(`#${prefix}-dmf-menu-trigger`);await page.keyboard.press('Space');
  assert(await page.evaluate(()=>document.querySelectorAll('[data-slot=dropdown-menu-content][data-open]').length===1),'Repeated initialization failed');
  await page.evaluate(()=>document.dispatchEvent(new Event('astro:before-swap')));
  assert(await page.evaluate(()=>!document.querySelector('[data-dmf-overlay-ready],[data-slot=dropdown-menu-content][data-open],[data-slot=popover-content][data-open]')),'Overlay teardown failed');
  await page.evaluate(()=>document.dispatchEvent(new Event('astro:page-load')));
  await page.waitForSelector(`#${prefix}-cb-ui-menu[data-dmf-overlay-ready]`);
  console.log(`PASS ${path}: presets, popover editing/dismissal/focus, menu navigation/disabled/check/radio/action, outside dismissal, mobile RTL/theme/containment, lifecycle`);
}


}

await (await taskSpace('dmf-ui-consumer-20261021')).finish({keep:[]});
