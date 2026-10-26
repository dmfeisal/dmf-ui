import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,settle,mobile,resetBrowser}){
 const assert=(value,message)=>{if(!value)throw Error(message);};
 const manifest=JSON.parse(await readFile(new URL('../../docs/DMF-UI-FULLDEV-CATALOG.json',import.meta.url),'utf8'));
 const names=manifest.components.filter(item=>item.status==='imported').map(item=>item.name);
 const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8'),reports=[];
 async function audit(name,state,selector='[data-docs-preview]'){await settle();await page.evaluate(source=>{if(window.axe)return;const script=document.createElement('script');script.textContent=source;document.head.append(script);},axe);const report=await page.evaluate(async selector=>{const r=await window.axe.run(document.querySelector(selector));return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))};},selector);reports.push({name,state,...report});await writeFile(new URL('../../.dmf-ui-test-results/fulldev-catalog-audit.json',import.meta.url),JSON.stringify(reports,null,2));}
 for(const name of names){
  await resetBrowser();await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await navigate(`${baseURL}/components/${name}/`);
  assert(await page.evaluate(name=>!!document.querySelector(`[data-fulldev-preview="${name}"]`)&&document.querySelector('h1').textContent.length>0,name),`${name}: missing preview`);
  if(name==='image'||name==='aspect-ratio')await page.waitForFunction(()=>{const img=document.querySelector('[data-fulldev-preview] img');return img?.complete&&img.naturalWidth>0;});await audit(name,'light');
  await page.evaluate(()=>document.documentElement.dataset.theme='dark');await audit(name,'dark');
  await mobile();await page.evaluate(()=>{document.querySelector('[data-docs-preview]').dir='rtl';document.documentElement.style.fontSize='175%';document.querySelector('[data-docs-preview]').scrollIntoView({block:'start',behavior:'instant'});});await settle();
  const geometry=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:innerWidth}));assert(geometry.width<=390,`${name}: enlarged RTL overflow ${JSON.stringify(geometry)}`);await audit(name,'mobile-rtl-enlarged');
  await page.screenshot({path:`/tmp/dmf-fulldev-${name}-mobile.png`});
 }
 const violations=reports.filter(r=>r.violations.length);assert(!violations.length,JSON.stringify(violations));
 await resetBrowser();console.log(`PASS ${names.length} imported catalog pages: light, dark and enlarged RTL. Axe incompletes recorded separately.`);
}
