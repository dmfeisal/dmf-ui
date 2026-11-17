// M16 batches 5-6: the Avatar, Table and Progress parts. A missing avatar picture hides itself and the fallback shows; the
// group count is visible; the table caption is a real caption; the progress track carries the value to assistive technology.
export async function run({page,baseURL,navigate,settle,resetBrowser}) {
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  await resetBrowser();
  await navigate(`${baseURL}/components/avatar/`);
  await page.waitForFunction(()=>{const image=document.querySelector('[data-avatar-parts] [data-avatar-image]');return image&&(image.complete||image.hidden);});
  await settle();
  assert(await page.evaluate(()=>{const image=document.querySelector('[data-avatar-parts] [data-avatar-image]');const fallback=document.querySelector('[data-avatar-parts] [data-slot=avatar-fallback]');return image.hidden&&fallback.textContent.trim()==='DM'&&fallback.checkVisibility();}),'Missing avatar picture did not hide and show its fallback');
  assert(await page.evaluate(()=>document.querySelector('[data-slot=avatar-group-count]').textContent.trim()==='+3'&&document.querySelector('[data-slot=avatar-group-count]').checkVisibility()),'Avatar group count is not visible');
  await navigate(`${baseURL}/components/table/`);await settle();
  assert(await page.evaluate(()=>{const caption=document.querySelector('[data-table-parts] caption[data-slot=table-caption]');return caption&&caption.textContent.trim()==='Parts example'&&caption.parentElement.tagName==='TABLE';}),'Table caption part is not a caption of its table');
  await navigate(`${baseURL}/components/progress/`);await settle();
  assert(await page.evaluate(()=>{const progress=document.querySelector('[data-progress-parts] progress');return progress&&progress.value===40&&progress.max===100&&progress.getAttribute('aria-label')==='Parts upload';}),'Progress track did not carry the value, maximum and label');
  // Multi-select chips: Enter adds an option, its chip shows, the chip's button and Backspace remove it.
  await navigate(`${baseURL}/components/combobox/`);await settle();
  const chipState=()=>page.evaluate(()=>{const r=document.querySelector('[data-combobox-chips]');return {selected:[...r.querySelector('select').selectedOptions].map(o=>o.value),chips:[...r.querySelectorAll('[data-slot=combobox-chip]')].filter(c=>!c.hidden).map(c=>c.dataset.value)};});
  assert(JSON.stringify((await chipState()).selected)==='["astro"]','Multi-select did not start with its default');
  await page.click('#docs-combobox-chips');await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');
  assert(JSON.stringify((await chipState()).chips)==='["astro","eleventy"]','Enter did not add a chip');
  await page.click('[data-combobox-chips] [data-slot=combobox-chip][data-value=eleventy] [data-slot=combobox-chip-remove]',{force:true});
  assert(JSON.stringify((await chipState()).chips)==='["astro"]','Chip remove button did not remove its option');
  await page.focus('[data-slot=combobox-chip-input]');await page.keyboard.press('Backspace');
  assert((await chipState()).selected.length===0&&(await chipState()).chips.length===0,'Backspace did not remove the last chip');
  console.log('PASS parts: avatar picture fallback and group count; table caption; progress track value and label; multi-select chips');
}
