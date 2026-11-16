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
  console.log('PASS parts: avatar picture fallback and group count; table caption; progress track value and label');
}
