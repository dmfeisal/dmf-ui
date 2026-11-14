// M15 measuring scenario. For each case on /internal/shadcn-parity/ it builds the shadcn base-nova element (same tag,
// classes, data attributes and text, styled by the compiled Nova reference) beside the rendered DMF UI component, then
// compares computed styles in light and dark. Differences are recorded, not failed: M16 closes them. The scenario fails
// when the set of differences no longer matches docs/DMF-UI-SHADCN-PARITY.json, so a change on either side has to be
// written into the record (npm run shadcn:write -- --measured .dmf-ui-test-results/shadcn-parity-measured.json).
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../../',import.meta.url));
export const properties=['height','paddingTop','paddingRight','paddingBottom','paddingLeft','columnGap','rowGap','borderTopLeftRadius','borderTopWidth','fontSize','fontWeight','lineHeight','letterSpacing','color','backgroundColor','borderTopColor','opacity'];

// Installs the measuring helpers in the page once: computed-style reading, the shadcn reference builders for single
// and compound cases, and the lookup of a composition's DMF part (inside its case, or inside the open overlay).
async function install(page){
 await page.evaluate(properties=>{
  if(window.__parity)return;
  const cases=JSON.parse(document.getElementById('parity-cases').textContent);
  const context=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
  const rgba=value=>{context.clearRect(0,0,1,1);context.fillStyle='#000';context.fillStyle=value;context.fillRect(0,0,1,1);return [...context.getImageData(0,0,1,1).data].join(',');};
  const colour=/color$/i;
  // Looping animations (Spinner's rotation) change the box from frame to frame; hold them at their first frame.
  const still=()=>{for(const a of document.getAnimations())if(!Number.isFinite(a.effect?.getComputedTiming().endTime)){a.pause();a.currentTime=0;}};
  const read=element=>{still();const style=getComputedStyle(element),rect=element.getBoundingClientRect(),out={};
   for(const p of properties)out[p]=p==='height'?Math.round(rect.height*2)/2:colour.test(p)?(style[p]==='rgba(0, 0, 0, 0)'||style[p]==='transparent'?'transparent':rgba(style[p])):style[p];
   out.width=Math.round(rect.width*2)/2;return out;};
  const section=c=>document.querySelector(`[data-parity-case="${CSS.escape(c.id)}"]`);
  const create=ref=>{const e=document.createElement(ref.tag);e.className=ref.classes.join(' ');for(const [k,v] of Object.entries(ref.attributes))e.setAttribute(k,v);return e;};
  // Builds a composition's shadcn tree once. Nodes without an element (Base UI roots, triggers) pass their children up.
  const buildTree=c=>{
   const side=section(c).querySelector('[data-parity-side=shadcn]');if(side.firstElementChild)return;
   const containers={},byKey=Object.fromEntries(c.nodes.map(n=>[n.key,n]));
   const holder=key=>key===null?side:containers[key]??holder(byKey[key].parent);
   for(const n of c.nodes){
    if(!n.reference)continue;
    const element=create(n.reference);let target=element,measured=element;
    if(n.inner){const inner=create(n.inner);element.append(inner);target=inner;if(n.inner.measured)measured=inner;}
    measured.dataset.parityNode=n.key;
    if(!n.void&&n.text)target.append(n.text);
    holder(n.parent).append(element);containers[n.key]=target;
   }
  };
  const shown=e=>e.getClientRects().length>0&&(typeof e.checkVisibility!=='function'||e.checkVisibility());
  const openContent=c=>{if(!c.open)return null;const content=c.nodes.find(n=>n.inOpen&&n.dmfSlot&&c.nodes.find(p=>p.key===n.parent&&!p.inOpen));
   return [...document.querySelectorAll(`[data-slot="${content.dmfSlot}"]`)].find(e=>!e.closest('[data-parity-side=shadcn]')&&shown(e));};
  const dmfPart=(c,n)=>{
   if(n.inOpen){const content=openContent(c);if(!content)return null;return n.occurrence===0&&content.dataset.slot===n.dmfSlot?content:[...content.querySelectorAll(`[data-slot="${n.dmfSlot}"]`)][n.occurrence-(content.dataset.slot===n.dmfSlot?1:0)]??null;}
   return [...section(c).querySelectorAll(`[data-parity-side=dmf] [data-slot="${n.dmfSlot}"]`)].filter(e=>!openContent(c)?.contains(e))[n.occurrence]??null;
  };
  const single=c=>{
   const at=section(c),dmf=at.querySelector(`[data-parity-side=dmf] [data-slot="${c.slot}"]`),side=at.querySelector('[data-parity-side=shadcn]');
   if(!dmf)return {id:c.id,status:'no-dmf-slot'};
   if(!side.firstElementChild){
    const element=document.createElement(c.reference.tag??dmf.tagName.toLowerCase());
    element.className=c.reference.classes.join(' ');
    for(const [k,v] of Object.entries(c.reference.attributes))element.setAttribute(k,v);
    if(!c.reference.tag)for(const attr of ['type','role'])if(dmf.hasAttribute(attr))element.setAttribute(attr,dmf.getAttribute(attr));
    if(!c.void&&c.text)element.textContent=c.text;
    side.append(element);
   }
   return {id:c.id,unsupported:c.unsupported,void:c.void,shadcn:read(side.firstElementChild),dmf:read(dmf)};
  };
  // `open` false measures the closed parts of a composition, true only the parts inside its open overlay.
  const compound=(c,open)=>{buildTree(c);return c.nodes.filter(n=>n.id&&!!n.inOpen===open).map(n=>{
   const dmf=dmfPart(c,n),ref=section(c).querySelector(`[data-parity-node="${n.key}"]`);
   return dmf?{id:n.id,void:n.void,shadcn:read(ref),dmf:read(dmf)}:{id:n.id,status:'no-dmf-slot'};});};
  window.__parity={cases,single,compound,openContent,shown,section};
 },properties);
}

export async function measure(page){
 await install(page);
 const results=await page.evaluate(()=>{const {cases,single,compound}=window.__parity;return cases.flatMap(c=>c.kind==='compound'?compound(c,false):[single(c)]);});
 // Overlay contents one at a time: open from the DMF trigger, measure, then close with Escape.
 const open=await page.evaluate(()=>window.__parity.cases.filter(c=>c.open).map(c=>c.id));
 for(const id of open){
  const ready=await page.evaluate(async id=>{
   const {cases,section,openContent}=window.__parity,c=cases.find(c=>c.id===id);
   const trigger=section(c).querySelector(`[data-parity-side=dmf] [data-slot="${c.open.trigger}"]`);
   if(!trigger)return false;
   if(c.open.action==='focus')trigger.focus();
   else if(c.open.action==='event')trigger.closest(`[data-slot="${c.open.root}"]`).dispatchEvent(new CustomEvent(c.open.event,{detail:{open:true}}));
   else trigger.click();
   for(let i=0;i<60&&!openContent(c);i++)await new Promise(r=>setTimeout(r,50));
   await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
   // Let the opening transition finish; looping animations (spinners) never do, so only finite ones count.
   const finite=document.getAnimations().filter(a=>Number.isFinite(a.effect?.getComputedTiming().endTime));
   await Promise.race([Promise.all(finite.map(a=>a.finished.catch(()=>{}))),new Promise(r=>setTimeout(r,1500))]);
   return !!openContent(c);
  },id);
  results.push(...await page.evaluate(({id,ready})=>{const {cases,compound}=window.__parity,c=cases.find(c=>c.id===id);
   return ready?compound(c,true):c.nodes.filter(n=>n.id&&n.inOpen).map(n=>({id:n.id,status:'not-opened'}));},{id,ready}));
  await page.keyboard.press('Escape');
  await page.evaluate(async id=>{const {cases,openContent}=window.__parity,c=cases.find(c=>c.id===id);
   document.activeElement?.blur?.();for(let i=0;i<60&&openContent(c);i++)await new Promise(r=>setTimeout(r,50));},id);
 }
 return results;
}

// Numeric values within half a pixel match; everything else must be equal. Width is compared only for void
// elements, whose size does not depend on text.
export function differences(results){
 const out={};
 for(const r of results){
  if(!r.shadcn){out[r.id]=[{property:'slot',shadcn:'present',dmf:r.status}];continue;}
  const diffs=[];
  for(const p of [...properties,...(r.void?['width']:[])]){
   // A border colour only shows when a border does.
   if(p==='borderTopColor'&&!parseFloat(r.shadcn.borderTopWidth)&&!parseFloat(r.dmf.borderTopWidth))continue;
   const a=r.shadcn[p],b=r.dmf[p],na=parseFloat(a),nb=parseFloat(b);
   const same=a===b||(!Number.isNaN(na)&&!Number.isNaN(nb)&&/^-?[\d.]+(px)?$/.test(String(a))&&/^-?[\d.]+(px)?$/.test(String(b))&&Math.abs(na-nb)<=0.5);
   if(!same)diffs.push({property:p,shadcn:a,dmf:b});
  }
  if(diffs.length)out[r.id]=diffs;
 }
 return out;
}

export async function run({page,baseURL,navigate,settle,resetBrowser}){
 const assert=(value,message)=>{if(!value)throw new Error(message);};
 await resetBrowser();
 await navigate(`${baseURL}/internal/shadcn-parity/`);await settle();
 assert(await page.evaluate(()=>[...document.styleSheets].some(s=>{try{return [...s.cssRules].some(r=>r.cssText.includes('.cn-button-size-sm'));}catch{return false;}})),'Nova reference stylesheet did not load');
 const measured={};
 for(const theme of ['light','dark']){
  await page.evaluate(theme=>{if(theme==='dark')document.documentElement.dataset.theme='dark';else delete document.documentElement.dataset.theme;},theme);await settle();
  const results=await measure(page);
  assert(results.length>0,'No parity cases rendered');
  measured[theme]={results,differences:differences(results)};
 }
 const artifacts=`${root}.dmf-ui-test-results`;await mkdir(artifacts,{recursive:true});
 const summary={cases:measured.light.results.length,differences:{light:measured.light.differences,dark:measured.dark.differences}};
 await writeFile(`${artifacts}/shadcn-parity-measured.json`,JSON.stringify(summary,null,1)+'\n');
 // Compare the set of differing (case, property, theme) keys with the committed record; values are informative only.
 const record=JSON.parse(await readFile(`${root}docs/DMF-UI-SHADCN-PARITY.json`,'utf8'));
 const keys=source=>Object.entries(source).flatMap(([theme,cases])=>Object.entries(cases).flatMap(([id,diffs])=>diffs.map(d=>`${theme} ${id} ${d.property}`))).sort();
 const committed=keys(Object.fromEntries(['light','dark'].map(theme=>[theme,Object.assign({},...Object.values(record.families).map(f=>f.measured?.differences?.[theme]??{}))]))),current=keys(summary.differences);
 const added=current.filter(k=>!committed.includes(k)),removed=committed.filter(k=>!current.includes(k));
 assert(!added.length&&!removed.length,`shadcn parity measurements changed (new: ${added.slice(0,10).join('; ')}${added.length>10?' …':''}; gone: ${removed.slice(0,10).join('; ')}${removed.length>10?' …':''}). Review, then run npm run shadcn:write -- --measured .dmf-ui-test-results/shadcn-parity-measured.json`);
 console.log(`PASS shadcn parity: ${summary.cases} cases measured in light and dark; ${current.length} recorded differences unchanged`);
}
