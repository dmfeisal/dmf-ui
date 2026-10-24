import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,settle,mobile,resetBrowser}){
 const paths=['/examples/dmf-ui/'];
 const assert=(value,message)=>{if(!value)throw new Error(message);};
 const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');const reports=[];
 async function audit(state){await page.evaluate(source=>{if(!window.axe){const script=document.createElement('script');script.textContent=source;document.head.append(script);}},axe);const result=await page.evaluate(async()=>{const r=await window.axe.run({include:[['.dmf-content-examples']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}});return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>v.id)};});reports.push({state,...result});await writeFile(new URL('../../.dmf-ui-test-results/content-audit.json',import.meta.url),JSON.stringify(reports,null,2));assert(!result.violations.length,`${state}: ${JSON.stringify(result.violations)}`);}
 for(const path of paths){
  await resetBrowser();await navigate(`${baseURL}${path}`);
  assert(await page.evaluate(()=>document.querySelectorAll('[data-content-card]').length===2&&[...document.querySelectorAll('[data-content-card]')].every(e=>e.tagName==='ARTICLE')&&[...document.querySelectorAll('[data-content-alert]')].every(e=>e.getAttribute('role')==='note'&&!e.hasAttribute('aria-live'))),'Content semantics missing');
  const sizes=await page.evaluate(()=>[...document.querySelectorAll('.dmf-content-examples')].map(root=>({normal:parseFloat(getComputedStyle(root.querySelector('[data-content-card] [data-slot=card-content]')).paddingInlineStart),small:parseFloat(getComputedStyle(root.querySelector('[data-content-small] [data-slot=card-content]')).paddingInlineStart)})));
  assert(sizes.every(v=>v.normal>v.small&&v.small>0),`Card size spacing missing: ${JSON.stringify(sizes)}`);
  for(const mode of ['light','dark']){await page.evaluate(mode=>document.documentElement.dataset.theme=mode,mode);await settle();await audit(`${path} ${mode}`);}
  await page.focus('[data-system=dmf] [data-content-link]');await page.keyboard.press('Enter');
  assert((await page.url()).includes('-content-title'),'Native badge link did not navigate');
  await page.evaluate(()=>{for(const details of document.querySelectorAll('.dmf-content-stress'))details.open=true;});
  await mobile();
  for(const direction of ['ltr','rtl']){
   await page.evaluate(direction=>document.documentElement.dir=direction,direction);
   for(const rootSize of ['87.5%']){
    await page.evaluate(size=>document.documentElement.style.fontSize=size,rootSize);await settle();
    const bounds=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,items:[...document.querySelectorAll('.dmf-content-examples [data-slot]')].map(el=>({slot:el.dataset.slot,width:el.clientWidth,scroll:el.scrollWidth,rect:el.getBoundingClientRect().toJSON()})),links:[...document.querySelectorAll('.dmf-content-examples a[data-slot=badge]')].map(el=>el.getBoundingClientRect().toJSON())}));
    assert(bounds.width===390,`Mobile viewport expanded: ${bounds.width}`);
    if(rootSize==='87.5%')assert(bounds.scroll<=390,`Page overflow ${direction}: ${bounds.scroll}`);
    assert(bounds.items.every(v=>v.scroll<=v.width+2&&v.rect.left>=-1&&v.rect.right<=391),`Content clipping ${direction}/${rootSize}: ${JSON.stringify(bounds.items.filter(v=>v.scroll>v.width+2||v.rect.left< -1||v.rect.right>391))}`);
    assert(bounds.links.every(r=>r.width>=44&&r.height>=44),'Badge link target below 44px');
   }
   const enlarged=await page.evaluate(async direction=>{
    const frame=document.createElement('iframe');frame.style.cssText='position:fixed;inset:0;width:390px;height:844px;border:0;z-index:9999';document.body.append(frame);
    try{
     const doc=frame.contentDocument;doc.documentElement.dir=direction;doc.documentElement.dataset.theme='dark';doc.documentElement.style.fontSize='175%';doc.body.style.margin='0';
     await Promise.all([...document.querySelectorAll('link[rel=stylesheet]')].map(source=>new Promise((resolve,reject)=>{const link=doc.createElement('link');link.rel='stylesheet';link.href=source.href;link.onload=resolve;link.onerror=()=>reject(new Error('Content fixture CSS failed to load'));doc.head.append(link);})));
     for(const source of document.querySelectorAll('.dmf-content-examples')){
      const host=doc.createElement('div');host.className='dmf-ui';host.dataset.system=source.closest('[data-system]').dataset.system;if(host.dataset.system==='cb-ui')host.dataset.colorMode='light';host.style.cssText='box-sizing:border-box;padding:20px;min-width:0';host.append(source.cloneNode(true));doc.body.append(host);
     }
     await doc.fonts.ready;
     return {width:doc.documentElement.clientWidth,scroll:doc.documentElement.scrollWidth,clipped:[...doc.querySelectorAll('[data-slot]')].filter(e=>{const r=e.getBoundingClientRect();return e.scrollWidth>e.clientWidth+2||r.left< -1||r.right>391;}).map(e=>({slot:e.dataset.slot,width:e.clientWidth,scroll:e.scrollWidth})),links:[...doc.querySelectorAll('a[data-slot=badge]')].map(e=>e.getBoundingClientRect().toJSON())};
    }finally{frame.remove();}
   },direction);
   assert(enlarged.width===390&&enlarged.scroll<=390&&!enlarged.clipped.length,`Isolated 200% content ${direction}: ${JSON.stringify(enlarged)}`);
   assert(enlarged.links.every(r=>r.width>=44&&r.height>=44),'Enlarged badge link target below 44px');
  }
  await audit(`${path} mobile RTL`);
  await page.evaluate(()=>document.documentElement.style.fontSize='87.5%');await page.evaluate(()=>document.querySelector('[data-content-card]').scrollIntoView({block:'center',behavior:'instant'}));console.log(await page.screenshot({path:'/tmp/dmf-ui-040/content-mobile.png'}));
  await resetBrowser();await navigate(`${baseURL}${path}`);await page.evaluate(()=>document.querySelector('[data-content-card]').scrollIntoView({block:'center',behavior:'instant'}));console.log(await page.screenshot({path:'/tmp/dmf-ui-040/content-desktop.png'}));
  console.log(`PASS ${path}: semantic Text/Card/Badge/Alert, card sizes, native links, preset contrast, long-content reflow, mobile RTL and 200% text`);
 }
}
