import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,settle,mobile,resetBrowser}){
 const assert=(v,m)=>{if(!v)throw Error(m);};const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
 async function audit(){await settle();await page.evaluate(source=>{if(window.axe)return;const s=document.createElement('script');s.textContent=source;document.head.append(s);},axe);const r=await page.evaluate(async()=>{const r=await window.axe.run();return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.failureSummary)})),incomplete:r.incomplete.map(v=>v.id)};});assert(!r.violations.length&&!r.incomplete.length,JSON.stringify(r));}
 await resetBrowser();await navigate(`${baseURL}/examples/navigation/1/`);
 assert(await page.evaluate(()=>document.querySelector('[data-slot=pagination] [aria-disabled]').textContent.includes('Previous')&&!document.querySelector('[data-slot=pagination] [rel=prev]')),'First-page boundary wrong');
 await page.focus('[data-slot=pagination] [rel=next]');await page.keyboard.press('Enter');await page.waitForURL(`${baseURL}/examples/navigation/2/`);await settle();
 assert(await page.evaluate(()=>document.querySelector('[data-slot=pagination] [aria-current]').textContent==='2'),'Current page did not change');
 await page.focus('[data-slot=pagination] [rel=next]');await page.keyboard.press('Enter');await page.waitForURL(`${baseURL}/examples/navigation/3/`);await settle();
 assert(await page.evaluate(()=>!document.querySelector('[data-slot=pagination] [rel=next]')&&document.querySelector('[data-slot=pagination] [aria-disabled]').textContent.includes('Next')),'Last-page boundary wrong');
 await page.focus('[data-slot=pagination] [rel=prev]');await page.keyboard.press('Enter');await page.waitForURL(`${baseURL}/examples/navigation/2/`);await settle();
 await audit();
 for(const slug of ['breadcrumb','pagination','navigation-menu']){
  await navigate(`${baseURL}/components/${slug}/`);
  for(const system of ['dmf','cb-ui','horego']){
   await page.evaluate(system=>{const root=document.querySelector('[data-docs-preview]');root.dataset.system=system;if(system!=='dmf')root.dataset.colorMode='light';else delete root.dataset.colorMode;},system);await audit();
  }
  await page.evaluate(()=>document.documentElement.dataset.theme='dark');await audit();
  await mobile();await page.evaluate(()=>document.querySelector('[data-docs-preview]').dir='rtl');await audit();
  for(const size of ['87.5%','175%']){await page.evaluate(size=>document.documentElement.style.fontSize=size,size);await settle();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=390),'Navigation overflow');}
  await resetBrowser();
 }
 await navigate(`${baseURL}/components/navigation-menu/`);
 assert(await page.evaluate(()=>{const root=document.querySelector('[data-docs-preview] [data-slot=navigation-menu]');return root.querySelector('[aria-disabled]')?.tagName==='SPAN'&&root.querySelectorAll('[aria-current=page]').length===1&&!root.querySelector('[role=menubar]');}),'Navigation semantics wrong');
 await page.focus('[data-docs-preview] [data-slot=navigation-menu] a[href="/docs/presets/"]');await page.keyboard.press('Enter');await page.waitForURL(`${baseURL}/docs/presets/`);
 await resetBrowser();console.log('PASS native pagination 1→2→3→2, boundaries, menu link semantics and 16 axe/theme/preset/mobile states with enlarged RTL containment');
}
