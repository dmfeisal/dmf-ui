// M15 optimization baseline, browser part. For each catalog family it opens /components/<family>/ and, inside the
// family's preview ([data-docs-preview]):
//  - runs axe (WCAG 2.2 AA and best practice) in light and dark and records the violated rule ids;
//  - compares what renders with JavaScript disabled against the enhanced page: visible elements, focusable controls
//    and visible text. `static` families ship no client script; `same` means the no-JS render shows the same content
//    and controls (scripts only add behaviour); `reduced` and `more` mean the no-JS render shows less or more.
// Results are recorded in docs/DMF-UI-BASELINE.json, not failed: M16 works from them. The scenario fails when the
// recorded rule ids or statuses change, so a change has to be written into the record
// (npm run baseline:write -- --browser .dmf-ui-test-results/baseline-browser.json).
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const require=createRequire(import.meta.url);
const root=fileURLToPath(new URL('../../',import.meta.url));
const tags=['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice'];

// What a preview shows: elements with a box, focusable controls among them, and the visible text.
export function snapshot(page,slug){
 return page.evaluate(slug=>{
  const preview=document.querySelector(`[data-docs-preview="${CSS.escape(slug)}"]`);
  if(!preview)return null;
  const shown=e=>e.getClientRects().length>0&&(typeof e.checkVisibility!=='function'||e.checkVisibility({visibilityProperty:true,opacityProperty:true}));
  const elements=[...preview.querySelectorAll('*')].filter(shown);
  const focusable=elements.filter(e=>e.matches('a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"]),[contenteditable=true]'));
  return {visible:elements.length,focusable:focusable.length,text:preview.innerText.replace(/\s+/g,' ').trim().length};
 },slug);
}

export function compare(js,noJs,hasScript){
 if(!js||!noJs)return 'no-preview';
 const same=js.visible===noJs.visible&&js.focusable===noJs.focusable&&js.text===noJs.text;
 if(same)return hasScript?'same':'static';
 return noJs.visible<js.visible||noJs.focusable<js.focusable||noJs.text<js.text?'reduced':'more';
}

export async function run({page,baseURL,navigate,settle,resetBrowser}){
 const assert=(value,message)=>{if(!value)throw new Error(message);};
 await resetBrowser();
 const record=JSON.parse(await readFile(`${root}docs/DMF-UI-BASELINE.json`,'utf8'));
 const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
 const families={};
 for(const [slug,entry] of Object.entries(record.families)){
  // Without JavaScript first, so the enhanced run starts from a fresh document.
  let noJs;
  await page.cdp('Emulation.setScriptExecutionDisabled',{value:true});
  try{await page.goto(`${baseURL}/components/${slug}/`);noJs=await snapshot(page,slug);}
  finally{await page.cdp('Emulation.setScriptExecutionDisabled',{value:false});}
  await navigate(`${baseURL}/components/${slug}/`);
  const js=await snapshot(page,slug);
  const result={axe:null,withoutJs:{status:compare(js,noJs,Boolean(entry.js)),js,noJs}};
  if(js){
   await page.evaluate(source=>{if(!window.axe){const s=document.createElement('script');s.textContent=source;document.head.append(s);}},axe);
   result.axe={};
   for(const theme of ['light','dark']){
    await page.evaluate(theme=>{document.documentElement.dataset.theme=theme;},theme);await settle();
    result.axe[theme]=await page.evaluate(async({slug,tags})=>{
     const r=await window.axe.run(document.querySelector(`[data-docs-preview="${CSS.escape(slug)}"]`),{runOnly:{type:'tag',values:tags}});
     return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length})).sort((a,b)=>a.id.localeCompare(b.id));
    },{slug,tags});
   }
  }
  families[slug]=result;
 }
 const browser=await page.evaluate(()=>navigator.userAgent);
 const artifacts=`${root}.dmf-ui-test-results`;await mkdir(artifacts,{recursive:true});
 await writeFile(`${artifacts}/baseline-browser.json`,JSON.stringify({browser:{axe:'4.14.0',tags},families},null,1)+'\n');
 // Compare rule ids and statuses with the record; counts are informative only.
 const keys=source=>Object.entries(source).flatMap(([slug,f])=>[`${slug} withoutJs ${f.withoutJs?.status??'none'}`,...['light','dark'].flatMap(t=>(f.axe?.[t]??[]).map(v=>`${slug} ${t} ${v.id}`))]).sort();
 const committed=keys(record.families),current=keys(families);
 const added=current.filter(k=>!committed.includes(k)),removed=committed.filter(k=>!current.includes(k));
 assert(!added.length&&!removed.length,`DMF UI baseline changed (new: ${added.slice(0,10).join('; ')}${added.length>10?' …':''}; gone: ${removed.slice(0,10).join('; ')}${removed.length>10?' …':''}). Review, then run npm run baseline:write -- --browser .dmf-ui-test-results/baseline-browser.json`);
 const violating=Object.values(families).filter(f=>f.axe&&(f.axe.light.length||f.axe.dark.length)).length;
 console.log(`PASS baseline: ${Object.keys(families).length} families audited; ${violating} with axe violations; without JS unchanged`);
}
