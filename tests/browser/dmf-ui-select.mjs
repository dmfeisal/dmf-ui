// Run through npm run test:dmf-ui; use DMF_UI_TEST_FILTER to select a suite.
export async function run({page,baseURL,navigate,tap,opened}) {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  for (const [path, prefix] of [['/examples/dmf-ui/', 'standalone-form']]) {
    await navigate(`${baseURL}${path}`);
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
    await page.evaluate(()=>{document.documentElement.dir='rtl';document.documentElement.dataset.theme='dark';document.querySelector('astro-dev-toolbar')?.remove();});
    await tap(`#${prefix}-cb-ui-channel`);
    await opened('[data-slot=select-content][data-open]');
    const mobile = await page.evaluate(async()=>{
      await Promise.allSettled(document.querySelector('[data-slot=select-content][data-open]').getAnimations({subtree:true}).map(animation=>animation.finished));
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const content=document.querySelector('[data-slot=select-content][data-open]'),portal=content.closest('[data-slot=select-portal]'),r=content.getBoundingClientRect(),style=getComputedStyle(content);
      return {system:portal.dataset.system,dir:style.direction,font:style.fontFamily,bg:style.backgroundColor,left:r.left,right:r.right,width:document.documentElement.clientWidth,heights:[...content.querySelectorAll('[data-slot=select-item]')].map(e=>e.getBoundingClientRect().height)};
    });
    assert(mobile.width===390 && mobile.system==='cb-ui' && mobile.dir==='rtl' && mobile.font.includes('DMF CB Nunito') && mobile.bg==='rgb(255, 255, 255)' && mobile.left>=0 && mobile.right<=mobile.width+1 && mobile.heights.every(h=>h>0), JSON.stringify(mobile));
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
