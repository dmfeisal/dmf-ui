// Run through npm run test:dmf-ui; use DMF_UI_TEST_FILTER to select a suite.
export async function run({page,baseURL,navigate,click,settle,tap,opened,focused}) {
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  for(const [path,prefix] of [['/examples/dmf-ui/','standalone-form']]) {
    await navigate(`${baseURL}${path}`);
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
      console.log(`CHECK ${id}: menu outside dismissal`);
      await page.keyboard.press('Space');await opened('[data-slot=dropdown-menu-content][data-open]');await click(`#${id}-email`);
      await page.waitForFunction(id=>document.getElementById(`${id}-menu-trigger`).getAttribute('aria-expanded')==='false',id);
      await settle();
      console.log(`CHECK ${id}: popover outside dismissal`);
      await page.focus(`#${id}-popover-trigger`);await page.keyboard.press('Space');
      await page.waitForSelector(`#${id}-draft`,{state:'visible'});
      await click(`#${id}-email`);
      await page.waitForFunction(id=>document.getElementById(`${id}-popover-trigger`).getAttribute('aria-expanded')==='false',id);
      await settle();
    }
    // Use protocol input after setting metrics; browser interaction helpers can restore desktop dimensions.
    await page.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    await page.cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
    for(const slot of ['popover','menu']) {
      await page.evaluate(()=>{document.documentElement.dir='rtl';document.documentElement.dataset.theme='dark';});
    await tap(`#${prefix}-cb-ui-${slot}-trigger`);
    const part=slot==='menu'?'dropdown-menu':slot;
    await opened(`[data-slot="${part}-content"][data-open]`);
    const result=await page.evaluate(async slot=>{
        const part=slot==='menu'?'dropdown-menu':slot;
      const content=document.querySelector(`[data-slot="${part}-content"][data-open]`);
      const rect=content.getBoundingClientRect(),style=getComputedStyle(content);
        return {left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,width:document.documentElement.clientWidth,height:innerHeight,bg:style.backgroundColor,dir:style.direction,font:style.fontFamily,targets:[...content.querySelectorAll('[role^=menuitem]')].map(e=>e.getBoundingClientRect().height)};
      },slot);
      assert(result.width===390&&result.left>=0&&result.right<=result.width+1&&result.top>=0&&result.bottom<=result.height+1&&result.bg==='rgb(255, 255, 255)'&&result.dir==='rtl'&&result.font.includes('DMF CB Nunito')&&result.targets.every(h=>h>0),JSON.stringify(result));
      await page.cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
      await page.cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
      await focused(`${prefix}-cb-ui-${slot}-trigger`);
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
