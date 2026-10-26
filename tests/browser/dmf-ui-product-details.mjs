import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,settle,mobile,resetBrowser}){
 const assert=(v,m)=>{if(!v)throw Error(m);};const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
 async function audit(){await settle();await page.evaluate(source=>{if(window.axe)return;const s=document.createElement('script');s.textContent=source;document.head.append(s);},axe);const r=await page.evaluate(async()=>{const r=await window.axe.run();return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.failureSummary)})),incomplete:r.incomplete.map(v=>v.id)};});assert(!r.violations.length&&!r.incomplete.length,JSON.stringify(r));}
 await resetBrowser();await navigate(`${baseURL}/components/avatar/`);
 await page.waitForFunction(()=>document.querySelector('[data-avatar-image]').hidden);
 assert(await page.evaluate(()=>document.querySelector('[data-docs-preview] [aria-label="Image unavailable"] [data-slot=avatar-fallback]').textContent==='IU'),'Avatar error fallback missing');
 await page.evaluate(()=>document.querySelector('[data-avatar-image]').src='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="black"/></svg>'));
 await page.waitForFunction(()=>{const image=document.querySelector('[data-avatar-image]');return image.naturalWidth>0&&!image.hidden;});
 await navigate(`${baseURL}/components/rating/`);
 assert(await page.evaluate(()=>!document.querySelector('[data-product-form]').checkValidity()),'Required empty rating is valid');
 await page.focus('input[name=rating][value="1"]');await page.keyboard.press('Space');await page.keyboard.press('ArrowRight');
 assert(await page.evaluate(()=>document.querySelector('input[name=rating]:checked').value==='2'&&new FormData(document.querySelector('[data-product-form]')).get('rating')==='2'),'Native rating keyboard/FormData failed');
 await page.click('[data-product-form] button[type=submit]');assert(await page.evaluate(()=>document.querySelector('[data-product-status]').textContent.includes('Selected: 2')),'Rating submission feedback failed');
 await page.click('[data-product-form] button[type=reset]');assert(await page.evaluate(()=>!document.querySelector('input[name=rating]:checked')&&!document.querySelector('[data-product-form]').checkValidity()),'Rating reset failed');
 await navigate(`${baseURL}/components/chip/`);await page.focus('input[value=forms]');await page.keyboard.press('Space');
 assert(await page.evaluate(()=>JSON.stringify(new FormData(document.querySelector('[data-product-form]')).getAll('category'))==='["navigation","forms"]'&&document.querySelector('input[value=unavailable]').disabled),'Chip native state/FormData failed');
 await page.click('[data-product-form] button[type=submit]');assert(await page.evaluate(()=>document.querySelector('[data-product-status]').textContent.includes('navigation, forms')),'Chip feedback failed');
 await page.click('[data-product-form] button[type=reset]');assert(await page.evaluate(()=>document.querySelector('input[value=navigation]').checked&&!document.querySelector('input[value=forms]').checked),'Chip reset failed');
 for(const slug of ['avatar','rating','chip']){
  await navigate(`${baseURL}/components/${slug}/`);
  for(const system of ['dmf','cb-ui','hui']){await page.evaluate(system=>{const root=document.querySelector('[data-docs-preview]');root.dataset.system=system;if(system!=='dmf')root.dataset.colorMode='light';else delete root.dataset.colorMode;},system);await audit();}
  await page.evaluate(()=>document.documentElement.dataset.theme='dark');await audit();
  await mobile();await page.evaluate(()=>document.querySelector('[data-docs-preview]').dir='rtl');await audit();if(slug==='rating')assert(await page.evaluate(()=>getComputedStyle(document.querySelector('.dmf-rating-score')).direction==='ltr'),'RTL rating reversed its numeric score');
  for(const size of ['87.5%','175%']){await page.evaluate(size=>document.documentElement.style.fontSize=size,size);await settle();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=390),'Product component mobile overflow');}
  await page.evaluate(()=>document.querySelector('[data-docs-preview]').scrollIntoView({block:'start',behavior:'instant'}));await page.screenshot({path:`/tmp/dmf-ui-${slug}-mobile.png`});await resetBrowser();
 }
 console.log('PASS avatar failure/recovery, native rating required/arrows/reset, chip Space/FormData/reset and 15 preset/theme/mobile axe states with enlarged RTL containment');
}
