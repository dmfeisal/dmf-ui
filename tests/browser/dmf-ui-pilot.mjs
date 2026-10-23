// Run through npm run test:dmf-ui; use DMF_UI_TEST_FILTER to select a suite.
export async function run({page,baseURL,navigate}) {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  await page.cdp('Emulation.clearDeviceMetricsOverride');

  await navigate(`${baseURL}/examples/dmf-ui/`);
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
  await page.focus('#first-toaster [data-slot=toast-close]');
  await page.keyboard.press('Enter');
  await page.waitForSelector('#first-toaster [data-slot=toast-item]', { state: 'hidden' });
  await page.click('text="Show second success"');
  await page.waitForSelector('#second-toaster [data-slot=toast-title]:text-is("second success")', { state: 'visible' });
  assert(await page.evaluate(() => !document.querySelector('#first-toaster [data-slot=toast-item]')), 'Second notification changed first instance');
  await page.focus('#second-toaster [data-slot=toast-close]');
  await page.keyboard.press('Enter');
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
