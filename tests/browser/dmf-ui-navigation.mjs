// Real link/history navigation only: never dispatch synthetic Astro lifecycle events.
export async function run({page,baseURL,navigate,settle,opened,focused}) {
  const assert=(condition,message)=>{if(!condition)throw new Error(message);};
  await navigate(`${baseURL}/a/`);
  await page.waitForSelector('[data-dmf-form="nav-cb-ui"][data-dmf-form-ready=true]');
  await page.evaluate(()=>{
    window.__dmfNavigation={identity:Math.random(),loads:0,swaps:0,old:[]};
    document.addEventListener('astro:page-load',()=>window.__dmfNavigation.loads++);
    document.addEventListener('astro:before-swap',()=>window.__dmfNavigation.swaps++);
  });
  const identity=await page.evaluate(()=>window.__dmfNavigation.identity);
  async function ready(step) {
    await page.waitForFunction(step=>document.body.dataset.fixtureStep===step,step);
    if(step!=='empty')await page.waitForSelector('[data-dmf-form="nav-cb-ui"][data-dmf-form-ready=true]');
    await settle();
    assert(await page.evaluate(identity=>window.__dmfNavigation?.identity===identity,identity),'Navigation performed a hard reload');
    assert(await page.evaluate(()=>window.__dmfNavigation.old.every(root=>!root.isConnected&&!root.hasAttribute('data-dmf-overlay-ready')&&!root.hasAttribute('data-dmf-select-ready')&&!root.hasAttribute('data-dmf-tabs-ready'))),'Old owners were retained or not torn down');
    assert(await page.evaluate(()=>!document.querySelector('[data-slot=dropdown-menu-content][data-open],[data-slot=popover-content][data-open],[data-slot=select-content][data-open],[data-slot=toast-item]')),'Navigation leaked open panels or notifications');
  }
  async function retain() { await page.evaluate(()=>{window.__dmfNavigation.old=[...document.querySelectorAll('[data-dmf-dropdown-menu],[data-dmf-popover],[data-dmf-select],[data-dmf-tabs]')];}); }
  async function link(step) { await retain();await page.focus(`#nav-${step}`);await page.keyboard.press('Enter');await ready(step); }
  async function interact() {
    await page.focus('#nav-dialog-trigger');await page.keyboard.press('Enter');
    await page.waitForFunction(()=>document.getElementById('nav-dialog').contains(document.activeElement));
    await page.keyboard.press('Escape');await focused('nav-dialog-trigger');
    await page.focus('#nav-dmf-tabs-automatic [data-value=overview][data-slot=tabs-trigger]');
    await page.keyboard.press('ArrowRight');
    assert(await page.evaluate(()=>document.querySelector('#nav-dmf-tabs-automatic [data-value=details][data-slot=tabs-trigger]').getAttribute('aria-selected')==='true'),'Tabs not rebound after navigation');
    await page.focus('#nav-dmf-updates');
    const before=await page.evaluate(()=>document.getElementById('nav-dmf-updates').getAttribute('aria-checked'));
    await page.keyboard.press('Space');
    assert(await page.evaluate(before=>document.getElementById('nav-dmf-updates').getAttribute('aria-checked')!==before,before),'Switch handlers missing or duplicated after navigation');
    await page.focus('#nav-cb-ui-channel');await page.keyboard.press('Space');await page.keyboard.press('Home');await page.keyboard.press('Enter');await focused('nav-cb-ui-channel');
    assert(await page.evaluate(()=>new FormData(document.querySelector('[data-dmf-form=nav-cb-ui]')).get('channel')==='email'),'Select form binding missing after navigation');
    await page.focus('#nav-notify');await page.keyboard.press('Enter');
    assert(await page.evaluate(()=>document.querySelectorAll('[data-slot=toast-item]').length===1),'Notification handlers missing or duplicated');
  }
  await interact();
  await page.focus('#nav-dmf-menu-trigger');await page.keyboard.press('Space');await opened('[data-slot=dropdown-menu-content][data-open]');
  await link('b');await interact();
  await page.focus('#nav-cb-ui-popover-trigger');await page.keyboard.press('Space');await opened('[data-slot=popover-content][data-open]');
  await link('empty');
  assert(await page.evaluate(()=>!document.querySelector('[data-slot=dropdown-menu-content],[data-slot=popover-content],[data-slot=select-content]')),'Portals survived navigation to an empty page');
  await page.evaluate(()=>history.back());await ready('b');await interact();
  await retain();await page.evaluate(()=>history.forward());await ready('empty');
  await link('a');await interact();
  assert(await page.evaluate(()=>window.__dmfNavigation.loads>=5&&window.__dmfNavigation.swaps>=5),'Real Astro lifecycle events missing');
  // Leave a Select open during one final swap, covering its portal teardown as well.
  await page.focus('#nav-dmf-channel');await page.keyboard.press('Space');await opened('[data-slot=select-content][data-open]');
  await link('empty');
  await page.evaluate(()=>{window.__dmfNavigation.old=[];});
  console.log('PASS real Astro links, Back/Forward, empty-page return, open menu/popover/Select and toast teardown, form bindings, dialog focus and non-duplicated handlers');
}
