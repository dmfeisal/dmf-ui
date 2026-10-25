import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,settle,mobile,resetBrowser}){
 const assert=(value,message)=>{if(!value)throw new Error(message);};
 const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');const reports=[];
 for(const slug of ['text','card','badge','alert']){
  await resetBrowser();await navigate(`${baseURL}/components/${slug}/`);
  assert(await page.evaluate(slug=>document.querySelectorAll(`[data-docs-preview="${slug}"]`).length===1,slug),`Expected one DMF preview: ${slug}`);
  for(const mode of ['light','dark']){
   await page.evaluate(mode=>document.documentElement.dataset.theme=mode,mode);await settle();
   await page.evaluate(source=>{if(!window.axe){const script=document.createElement('script');script.textContent=source;document.head.append(script);}},axe);
   const result=await page.evaluate(async()=>{const r=await window.axe.run();return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>v.id)};});reports.push({slug,mode,...result});await writeFile(new URL('../../.dmf-ui-test-results/content-docs-audit.json',import.meta.url),JSON.stringify(reports,null,2));assert(!result.violations.length,`${slug}/${mode}: ${JSON.stringify(result.violations)}`);
  }
  await mobile();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=390),`Mobile documentation overflow: ${slug}`);
 }
 await resetBrowser();await navigate(`${baseURL}/components/card/`);await page.focus('[data-docs-preview=card][data-system=dmf] a');await page.keyboard.press('Enter');await page.waitForURL(`${baseURL}/create/`);
 assert(await page.evaluate(()=>!!document.querySelector('[data-create-card] [data-slot=text]')&&!!document.querySelector('[data-create-card] [data-slot=badge]')&&!!document.querySelector('[data-create-card] [data-slot=alert]')),'Create does not compose all new content primitives');
 await navigate(`${baseURL}/docs/contracts/`);assert(await page.evaluate(()=>document.querySelector('h1').textContent==='Component contracts'),'Contract guide missing');
 console.log('PASS four content documentation pages, DMF light-dark axe states, mobile width, native Card navigation and Create composition');
}
