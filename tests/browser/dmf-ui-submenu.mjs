// Dropdown Menu submenus (M16 batch 4): keyboard open and close, hover open, and selection from a submenu.
export async function run({page,baseURL,navigate,settle,resetBrowser}) {
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  const state=()=>page.evaluate(()=>{
    const sub=document.querySelector('[data-slot=dropdown-menu-sub-content]');
    const trigger=document.querySelector('[data-slot=dropdown-menu-sub-trigger]');
    const menu=sub?.closest('[data-slot=dropdown-menu-content]');
    return {menuOpen:!!menu&&!menu.hidden,subOpen:!!sub&&!sub.hidden,expanded:trigger?.getAttribute('aria-expanded'),focused:document.activeElement?.textContent.trim()};
  });
  const menuTrigger='[data-slot=dropdown-menu-trigger]';
  await resetBrowser();
  await navigate(`${baseURL}/components/dropdown-menu/`);
  await settle();
  await page.click(`${menuTrigger}:has-text("Actions")`);
  await page.waitForFunction(()=>{const sub=document.querySelector('[data-slot=dropdown-menu-sub-content]');return !sub.closest('[data-slot=dropdown-menu-content]').hidden;});
  assert((await state()).subOpen===false,'Submenu open before its trigger was used');
  // Keyboard: Enter opens the submenu and focuses its first enabled item.
  await page.focus('[data-slot=dropdown-menu-sub-trigger]');
  await page.keyboard.press('Enter');
  assert((await state()).subOpen&&(await state()).expanded==='true'&&(await state()).focused==='PDF','Enter did not open the submenu on PDF');
  // Arrow keys stay inside the submenu and skip the disabled item.
  await page.keyboard.press('ArrowDown');
  assert((await state()).focused==='CSV','ArrowDown did not move to CSV');
  await page.keyboard.press('ArrowDown');
  assert((await state()).focused==='PDF','ArrowDown did not wrap past the disabled JSON item');
  // Escape closes the submenu only and returns focus to its trigger.
  await page.keyboard.press('Escape');
  const afterEscape=await state();
  assert(!afterEscape.subOpen&&afterEscape.menuOpen&&afterEscape.focused==='Export as','Escape did not close only the submenu');
  // Enter on the trigger reopens; Enter on an item selects it and closes the whole menu.
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelector('[data-slot=dropdown-menu-sub-content]').closest('[data-slot=dropdown-menu-content]').hidden);
  // Pointer: hover opens the submenu, and a click selects an item.
  await page.click(`${menuTrigger}:has-text("Actions")`);
  await page.waitForFunction(()=>!document.querySelector('[data-slot=dropdown-menu-sub-content]').closest('[data-slot=dropdown-menu-content]').hidden);
  await page.hover('[data-slot=dropdown-menu-sub-trigger]');
  await page.waitForFunction(()=>!document.querySelector('[data-slot=dropdown-menu-sub-content]').hidden);
  // The panel must sit beside its trigger, not at the menu's containing block's origin.
  assert(await page.evaluate(()=>{const s=document.querySelector('[data-slot=dropdown-menu-sub-content]').getBoundingClientRect();const t=document.querySelector('[data-slot=dropdown-menu-sub-trigger]').getBoundingClientRect();return s.left>=t.right-1&&s.top<innerHeight&&s.top>=0;}),'Submenu panel is not beside its trigger');
  await page.click('[data-slot=dropdown-menu-sub-content] [data-value=pdf]');
  await page.waitForFunction(()=>document.querySelector('[data-slot=dropdown-menu-sub-content]').closest('[data-slot=dropdown-menu-content]').hidden);
  console.log('PASS submenu: keyboard open, arrows with disabled skip, Escape closes only the submenu, selection closes the menu, hover opens, pointer selection, panel placement');
}
