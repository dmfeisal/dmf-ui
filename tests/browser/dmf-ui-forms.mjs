// Run through npm run test:dmf-ui; use DMF_UI_TEST_FILTER to select a suite.
export async function run({page,baseURL,navigate,mobile:setMobile,settle}) {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  for (const [path, pagePrefix] of [['/examples/dmf-ui/', 'standalone-form']]) {
    await navigate(`${baseURL}${path}`);
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
    await setMobile(); await settle();
    assert(await page.evaluate(prefix => {
      const checkbox = document.querySelector(`#${prefix}-cb-ui-terms`), sw = document.querySelector(`#${prefix}-cb-ui-updates`);
      const label = document.querySelector(`label[for="${prefix}-cb-ui-terms"]`);
      return document.documentElement.clientWidth === 390 && document.documentElement.scrollWidth <= document.documentElement.clientWidth && checkbox.getBoundingClientRect().width === checkbox.getBoundingClientRect().height && sw.getBoundingClientRect().height < 44 && label.getBoundingClientRect().height > 0 && getComputedStyle(sw).direction === 'ltr';
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
