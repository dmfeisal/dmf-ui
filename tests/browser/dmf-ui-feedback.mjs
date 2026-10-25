import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,settle,mobile,resetBrowser}){
 const assert=(value,message)=>{if(!value)throw Error(message);};
 const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
 async function audit(){await settle();await page.evaluate(source=>{if(window.axe)return;const s=document.createElement('script');s.textContent=source;document.head.append(s);},axe);const result=await page.evaluate(async()=>{const r=await window.axe.run(document.querySelector('[data-docs-preview]'));return {violations:r.violations,incomplete:r.incomplete};});assert(!result.violations.length&&!result.incomplete.length,JSON.stringify(result));}
 await resetBrowser();await navigate(`${baseURL}/components/progress/`);
 const root='[data-feedback-demo=progress]';
 await page.click(`${root} [data-feedback-action=advance]`);
 assert(await page.evaluate(()=>{const r=document.querySelector('[data-feedback-demo=progress]');return r.querySelector('progress').value===60&&r.querySelector('[data-progress-value]').textContent==='60%';}),'Progress update mismatch');
 await page.click(`${root} [data-feedback-action=unknown]`);
 assert(await page.evaluate(()=>{const r=document.querySelector('[data-feedback-demo=progress]');return !r.querySelector('progress').hasAttribute('value')&&r.querySelector('[data-progress-value]').textContent==='Working…'&&!r.querySelector('.dmf-progress-indicator').hidden;}),'Unknown progress is not native indeterminate');await audit();
 await page.click(`${root} [data-feedback-action=reset]`);
 assert(await page.evaluate(()=>{const r=document.querySelector('[data-feedback-demo=progress]');return r.querySelector('progress').value===40&&r.querySelector('.dmf-progress-indicator').hidden;}),'Progress reset left stale marker');
 for(let i=0;i<4;i++)await page.click(`${root} [data-feedback-action=advance]`);
 assert(await page.evaluate(()=>document.querySelector('[data-feedback-demo=progress] progress').value===100),'Progress should stop at max');
 await navigate(`${baseURL}/components/loading-button/`);
 for(const presentation of ['label','icon-label','icon']){
  const selector=`[data-example-presentation=${presentation}] button`;
  const width=await page.evaluate(s=>document.querySelector(s).getBoundingClientRect().width,selector);
  await page.focus(selector);await page.keyboard.press('Enter');
  assert(await page.evaluate(s=>{const b=document.querySelector(s);return b.disabled&&b.getAttribute('aria-busy')==='true'&&b.getAttribute('aria-label')==='Saving draft…';},selector),`${presentation}: pending semantics`);
  assert(await page.evaluate(s=>document.querySelector(s).getBoundingClientRect().width,selector)===width,`${presentation}: width changed`);
  if(presentation!=='label')assert(await page.evaluate(s=>{const b=document.querySelector(s);return getComputedStyle(b.querySelector('.dmf-loading-spinner')).visibility==='visible'&&getComputedStyle(b.querySelector('.dmf-loading-idle-icon')).visibility==='hidden';},selector),`${presentation}: pending icon visibility`);
  await audit();await page.click('[data-feedback-action=finish]');
  assert(await page.evaluate(s=>{const b=document.querySelector(s);return !b.disabled&&!b.hasAttribute('aria-busy')&&b.getAttribute('aria-label')==='Save draft';},selector),`${presentation}: idle state not restored`);
 }
 assert(await page.evaluate(()=>document.querySelector('[data-label="Unavailable action"]').disabled),'Authored disabled state was lost');
 for(const slug of ['skeleton','empty-state','progress','loading-button']){
  await navigate(`${baseURL}/components/${slug}/`);await audit();
  if(slug==='skeleton')assert(await page.evaluate(()=>[...document.querySelectorAll('[data-slot=skeleton]')].every(n=>n.getAttribute('aria-hidden')==='true')),'Skeleton exposed to AT');
  for(const preset of ['cb-ui','horego','portfolio']){await page.evaluate(preset=>{document.querySelector('[data-docs-preview]').dataset.system=preset;},preset);await audit();}
  await page.evaluate(()=>document.documentElement.dataset.theme='dark');await audit();
  await mobile();await page.evaluate(()=>{document.querySelector('[data-docs-preview]').dir='rtl';document.documentElement.style.fontSize='175%';});await settle();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=390),`${slug}: mobile RTL enlarged-text overflow`);await audit();
  await resetBrowser();
 }
 await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await navigate(`${baseURL}/components/skeleton/`);
 assert(await page.evaluate(()=>getComputedStyle(document.querySelector('[data-slot=skeleton]')).animationName==='none'),'Skeleton ignores reduced motion');
 await navigate(`${baseURL}/components/progress/`);await page.click('[data-feedback-action=unknown]');
 assert(await page.evaluate(()=>getComputedStyle(document.querySelector('.dmf-progress-indicator')).animationName==='none'),'Progress ignores reduced motion');
 await navigate(`${baseURL}/components/loading-button/`);await page.click('[data-example-presentation=icon-label] button');
 assert(await page.evaluate(()=>getComputedStyle(document.querySelector('[data-example-presentation=icon-label] .dmf-loading-spinner')).animationName==='none'),'Spinner ignores reduced motion');
 await page.screenshot({path:'/tmp/dmf-ui-feedback-loading.png'});await resetBrowser();
 console.log('PASS feedback native states, presentation names and stable widths, disabled restoration, four preset previews, dark/mobile RTL enlarged text, reduced motion, scoped axe');
}
