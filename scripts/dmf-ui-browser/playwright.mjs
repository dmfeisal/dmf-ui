// Headless executor for the DMF UI browser runner (M13), used in CI.
// The runner's bootstrap expects Ego Browser's `taskSpace()` global and a Playwright-shaped `page` with an
// extra `page.cdp(method, params)`. This supplies both on headless Chromium, so scenarios run unchanged.
// Select it with DMF_UI_BROWSER=playwright; Ego Browser remains the default locally.
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

// Matches a common desktop window; scenarios set their own sizes through CDP where they depend on one.
const viewport = { width: 1440, height: 900 };

export async function executePlaywright(source, cwd) {
  // A variable specifier keeps `astro check` from loading Playwright's large type definitions, which pushed
  // the check past its 640MB heap in CI. The module itself is loaded only when this executor runs.
  const playwright = 'playwright';
  const { chromium } = await import(playwright);
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport, acceptDownloads: true });
    const page = await context.newPage();
    const session = await context.newCDPSession(page);
    // Ego Browser's CDP connection has the Page domain enabled, which scenarios rely on for
    // Page.addScriptToEvaluateOnNewDocument (error collectors installed before page scripts run).
    await session.send('Page.enable');
    page.cdp = (method, params = {}) => {
      // A keyDown without text never triggers the key's default action (such as scrolling) in Chromium;
      // send it as rawKeyDown, which is what Chromium itself dispatches for non-character keys.
      if (method === 'Input.dispatchKeyEvent' && params.type === 'keyDown' && !params.text) params = { ...params, type: 'rawKeyDown' };
      return session.send(method, params);
    };
    // Playwright's own screenshot re-applies its viewport emulation and so drops the device metrics that
    // scenarios set through CDP. Capture through CDP instead, which leaves emulation untouched.
    page.screenshot = async ({ path } = {}) => {
      const { data } = await session.send('Page.captureScreenshot', { format: 'png' });
      const bytes = Buffer.from(data, 'base64');
      if (path) await writeFile(path, bytes);
      return bytes;
    };
    // Ego Browser's evaluate waits out a navigation that replaces the document (a redirect, say);
    // Playwright throws instead. Retry once the new document has loaded.
    const evaluate = page.evaluate.bind(page);
    page.evaluate = async (...args) => {
      for (let attempt = 0; ; attempt++) {
        try { return await evaluate(...args); }
        catch (error) {
          if (attempt >= 3 || !/Execution context was destroyed|Cannot find context/.test(String(error))) throw error;
          await page.waitForLoadState('load');
        }
      }
    };
    globalThis.taskSpace = async () => ({
      spaceId: 'playwright',
      page: () => page,
      finish: async () => {},
    });
    // The bootstrap uses top-level await and imports scenarios by file URL, so it runs as a module.
    const entry = join(cwd, '.dmf-ui-test-results', `playwright-run-${process.pid}.mjs`);
    await writeFile(entry, source);
    await import(pathToFileURL(entry).href);
    return 0;
  } catch (error) {
    console.error(error);
    return 1;
  } finally {
    delete globalThis.taskSpace;
    await browser.close();
  }
}
