import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,settle,mobile,resetBrowser}){
 const assert=(value,message)=>{if(!value)throw Error(message);};const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
 async function audit(){await page.evaluate(()=>document.querySelector('[data-docs-preview]').scrollIntoView({block:'start',behavior:'instant'}));await settle();await page.evaluate(source=>{if(window.axe)return;const s=document.createElement('script');s.textContent=source;document.head.append(s);},axe);const r=await page.evaluate(async()=>{const r=await window.axe.run(document.querySelector('[data-docs-preview]'));return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))};});if(r.violations.length||r.incomplete.length)await page.screenshot({path:'/tmp/dmf-data-audit-failure.png'});assert(!r.violations.length&&!r.incomplete.length,JSON.stringify(r));}
 await resetBrowser();await navigate(`${baseURL}/components/slider/`);
 const volume='#docs-slider-volume',spacing='#docs-slider-spacing';
 await page.focus(volume);await page.keyboard.press('ArrowRight');
 assert(await page.evaluate(()=>{const r=document.querySelector('#docs-slider-volume');return r.value==='45'&&r.getAttribute('aria-valuetext')==='45%'&&r.closest('[data-slot=slider]').querySelector('[data-slider-value]').textContent==='45%';}),'Slider ArrowRight/value caption mismatch');
 await page.keyboard.press('End');assert(await page.evaluate(()=>document.querySelector('#docs-slider-volume').value==='100'),'Slider End boundary');
 await page.keyboard.press('Home');assert(await page.evaluate(()=>document.querySelector('#docs-slider-volume').value==='0'),'Slider Home boundary');
 await page.focus(spacing);await page.keyboard.press('ArrowLeft');assert(await page.evaluate(()=>document.querySelector('#docs-slider-spacing').value==='0.75'),'Fractional step failed');
 await page.click('[data-slider-demo] button[type=submit]');
 assert(await page.evaluate(()=>document.querySelector('[data-slider-status]').textContent.includes('Volume: 0%; spacing: 0.75rem.')),'Native FormData mismatch');
 assert(await page.evaluate(()=>!new FormData(document.querySelector('[data-slider-demo]')).has('unavailable')),'Disabled range leaked into FormData');
 await page.click('[data-slider-demo] button[type=reset]');await settle();
 assert(await page.evaluate(()=>{const r=document.querySelector('#docs-slider-volume');return r.value==='40'&&r.getAttribute('aria-valuetext')==='40%'&&r.closest('[data-slot=slider]').querySelector('[data-slider-value]').textContent==='40%';}),'Reset left stale slider state');
 await page.evaluate(()=>{const r=document.querySelector('#docs-slider-volume');r.value='65';r.dispatchEvent(new Event('input',{bubbles:true}));});
 assert(await page.evaluate(()=>document.querySelector('#docs-slider-volume').getAttribute('aria-valuetext')==='65%'),'Host input event did not sync');
 await page.evaluate(()=>document.querySelector('[data-slider-demo]').addEventListener('reset',event=>event.preventDefault(),{once:true}));await page.click('[data-slider-demo] button[type=reset]');await settle();
 assert(await page.evaluate(()=>{const r=document.querySelector('#docs-slider-volume');return r.value==='65'&&r.getAttribute('aria-valuetext')==='65%';}),'Cancelled reset changed the range or caption');
 await page.evaluate(()=>document.querySelector('[data-docs-preview]').dir='rtl');await page.focus(volume);await page.keyboard.press('ArrowLeft');assert(await page.evaluate(()=>document.querySelector('#docs-slider-volume').value==='70'),'Native RTL arrow direction changed');await audit();
 for(const slug of ['table','description-list','slider']){
  await resetBrowser();await navigate(`${baseURL}/components/${slug}/`);await audit();
  for(const preset of ['cb-ui','horego','portfolio']){await page.evaluate(preset=>document.querySelector('[data-docs-preview]').dataset.system=preset,preset);await audit();}
  await page.evaluate(()=>{document.querySelector('[data-docs-preview]').dataset.system='dmf';document.documentElement.dataset.theme='dark';});await audit();
  await mobile();await page.evaluate(()=>{document.querySelector('[data-docs-preview]').dir='rtl';document.documentElement.style.fontSize='175%';});await settle();await audit();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=390),`${slug}: page overflow at mobile enlarged RTL`);
  if(slug==='description-list')assert(await page.evaluate(()=>{const r=document.querySelector('[data-slot=description-item]');return getComputedStyle(r).gridTemplateColumns.split(' ').length===1;}),'Description rows did not stack');
  await page.screenshot({path:`/tmp/dmf-ui-${slug}-mobile.png`});
 }
 await resetBrowser();await navigate(`${baseURL}/components/table/`);await mobile();
 await page.evaluate(()=>document.querySelector('[data-slot=table]').style.minWidth='800px');await page.focus('[data-docs-preview] .dmf-table-scroll:first-of-type');await page.keyboard.press('ArrowRight');
 await page.waitForFunction(()=>document.querySelector('[data-docs-preview] .dmf-table-scroll').scrollLeft>0);
 assert(await page.evaluate(()=>{const wrapper=document.querySelector('[data-docs-preview] .dmf-table-scroll').getBoundingClientRect();const caption=document.querySelector('[data-docs-preview] caption').getBoundingClientRect();return document.documentElement.scrollWidth<=390&&caption.width<=wrapper.width&&caption.left>=wrapper.left-1&&caption.right<=wrapper.right+1;}),'Table scrolling escaped the wrapper or clipped its caption');
 await page.focus('[data-docs-preview] a[href="/components/slider/"]');await page.keyboard.press('Enter');await page.waitForURL(`${baseURL}/components/slider/`);
 await resetBrowser();await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'forced-colors',value:'active'},{name:'prefers-reduced-motion',value:'reduce'}]});await navigate(`${baseURL}/components/slider/`);await page.focus(volume);await page.keyboard.press('End');assert(await page.evaluate(()=>document.querySelector('#docs-slider-volume').value==='100'),'Forced-colors native input failed');await page.screenshot({path:'/tmp/dmf-ui-slider-forced-colors.png'});
 await resetBrowser();console.log('PASS Table native headings/keyboard scroll/links, stacked descriptions, Slider native keys/RTL/bounds/fractional FormData/reset, four presets, dark/mobile enlarged RTL, forced colors and scoped axe');
}
