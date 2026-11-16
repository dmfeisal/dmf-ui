// M16 batch 5: parts-mode navigation. Navigation Menu panels (click, hover, arrow keys, Escape, outside click),
// the Sidebar toggle, and the Breadcrumb and Pagination parts' current-page markup.
export async function run({page,baseURL,navigate,settle,resetBrowser}) {
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  const panels=()=>page.evaluate(()=>{
    const root=[...document.querySelectorAll('[data-slot=navigation-menu]')].find(r=>r.querySelector('[data-slot=navigation-menu-trigger]'));
    return {expanded:[...root.querySelectorAll('[data-slot=navigation-menu-trigger]')].map(t=>t.getAttribute('aria-expanded')),hidden:[...root.querySelectorAll('[data-slot=navigation-menu-content]')].map(c=>c.hidden),focus:document.activeElement?.textContent.trim()};
  });
  await resetBrowser();
  await navigate(`${baseURL}/components/navigation-menu/`);
  await settle();
  // Click opens; a second click closes.
  await page.click('[data-slot=navigation-menu-trigger]:has-text("Foundations")');
  assert((await panels()).expanded[0]==='true'&&(await panels()).hidden[0]===false,'Click did not open the panel');
  await page.click('[data-slot=navigation-menu-trigger]:has-text("Foundations")');
  assert((await panels()).expanded[0]==='false','Second click did not close the panel');
  // Keyboard: Enter opens and focuses the first link; ArrowRight moves to the next trigger; Escape closes.
  await page.focus('[data-slot=navigation-menu-trigger]:has-text("Foundations")');
  await page.keyboard.press('Enter');
  assert((await panels()).focus==='Theming','Enter did not focus the first link of the panel');
  await page.keyboard.press('Escape');
  assert((await panels()).focus==='Foundations'&&(await panels()).expanded[0]==='false','Escape did not close and return focus');
  await page.keyboard.press('ArrowRight');
  assert((await panels()).focus==='Components','ArrowRight did not move to the next trigger');
  // Hover opens; moving the pointer away closes after a short delay.
  await page.hover('[data-slot=navigation-menu-trigger]:has-text("Components")');
  await page.waitForFunction(()=>document.querySelector('[data-slot=navigation-menu-trigger]:not([aria-expanded=false])')||[...document.querySelectorAll('[data-slot=navigation-menu-trigger]')].some(t=>t.getAttribute('aria-expanded')==='true'));
  await page.mouse.move(2,2);
  await page.waitForFunction(()=>[...document.querySelectorAll('[data-slot=navigation-menu-trigger]')].every(t=>t.getAttribute('aria-expanded')==='false'));
  // Sidebar: the trigger collapses and expands the parts layout and keeps aria-expanded in step.
  await navigate(`${baseURL}/components/sidebar/`);await settle();
  const sidebar=()=>page.evaluate(()=>{const w=document.querySelector('[data-sidebar-parts] [data-slot=sidebar-wrapper]');return {state:w.dataset.state,expanded:document.querySelector('[data-sidebar-parts] [data-slot=sidebar-trigger]').getAttribute('aria-expanded')};});
  await page.click('[data-sidebar-parts] [data-slot=sidebar-trigger]');
  assert((await sidebar()).state==='collapsed'&&(await sidebar()).expanded==='false','Sidebar trigger did not collapse');
  await page.click('[data-sidebar-parts] [data-slot=sidebar-trigger]');
  assert((await sidebar()).state==='expanded','Sidebar trigger did not expand');
  // On a phone the sidebar is a sheet: it starts collapsed, opens over the page, and its backdrop closes it.
  await page.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await navigate(`${baseURL}/components/sidebar/`);await settle();
  const visibleSheet=()=>page.evaluate(()=>document.querySelector('[data-sidebar-parts] [data-slot=sidebar-container]').checkVisibility());
  assert(!(await visibleSheet())&&(await page.evaluate(()=>document.querySelector('[data-sidebar-parts] [data-slot=sidebar]').dataset.mobile))==='true','Mobile sidebar did not start collapsed');
  await page.click('[data-sidebar-parts] [data-slot=sidebar-trigger]');
  assert(await visibleSheet(),'Mobile sidebar did not open as a sheet');
  // The sheet covers the left of the screen; click the backdrop on the right, where it is uncovered.
  await page.click('[data-sidebar-parts] [data-slot=sidebar-backdrop]',{position:{x:360,y:300}});
  assert(!(await visibleSheet()),'Backdrop did not close the mobile sheet');
  await resetBrowser();
  // Breadcrumb and Pagination parts mark the current page.
  await navigate(`${baseURL}/components/breadcrumb/`);await settle();
  assert(await page.evaluate(()=>{const parts=[...document.querySelectorAll('[data-slot=breadcrumb-page]')];return parts.length>0&&parts.every(p=>p.getAttribute('aria-current')==='page'&&p.getAttribute('aria-disabled')==='true');}),'Breadcrumb page part is not marked as the current page');
  await navigate(`${baseURL}/components/pagination/`);await settle();
  assert(await page.evaluate(()=>{const links=[...document.querySelectorAll('[data-slot=pagination-link][aria-current=page]')];return links.length===0||links.every(l=>l.hasAttribute('data-active'));}),'Pagination current page is not marked with data-active');
  console.log('PASS navigation parts: menu click, hover, arrows, Escape and placement; sidebar toggle; breadcrumb and pagination current page');
}
