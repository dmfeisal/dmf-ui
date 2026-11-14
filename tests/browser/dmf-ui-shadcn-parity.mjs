// M15 measuring scenario. For each case on /internal/shadcn-parity/ it builds the shadcn base-nova element (same tag,
// classes, data attributes and text, styled by the compiled Nova reference) beside the rendered DMF UI component, then
// compares computed styles in light and dark. Differences are recorded, not failed: M16 closes them. The scenario fails
// when the set of differences no longer matches docs/DMF-UI-SHADCN-PARITY.json, so a change on either side has to be
// written into the record (npm run shadcn:write -- --measured .dmf-ui-test-results/shadcn-parity-measured.json).
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../../',import.meta.url));
export const properties=['height','paddingTop','paddingRight','paddingBottom','paddingLeft','columnGap','rowGap','borderTopLeftRadius','borderTopWidth','fontSize','fontWeight','lineHeight','letterSpacing','color','backgroundColor','borderTopColor','opacity'];

export async function measure(page){
 return page.evaluate(properties=>{
  const cases=JSON.parse(document.getElementById('parity-cases').textContent);
  const context=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
  const rgba=value=>{context.clearRect(0,0,1,1);context.fillStyle='#000';context.fillStyle=value;context.fillRect(0,0,1,1);return [...context.getImageData(0,0,1,1).data].join(',');};
  const colour=/color$/i;
  const read=element=>{const style=getComputedStyle(element),rect=element.getBoundingClientRect(),out={};
   for(const p of properties)out[p]=p==='height'?Math.round(rect.height*2)/2:colour.test(p)?(style[p]==='rgba(0, 0, 0, 0)'||style[p]==='transparent'?'transparent':rgba(style[p])):style[p];
   out.width=Math.round(rect.width*2)/2;return out;};
  const results=[];
  for(const c of cases){
   const section=document.querySelector(`[data-parity-case="${CSS.escape(c.id)}"]`);
   const dmf=section.querySelector(`[data-parity-side=dmf] [data-slot="${c.slot}"]`);
   const side=section.querySelector('[data-parity-side=shadcn]');
   if(!dmf){results.push({id:c.id,status:'no-dmf-slot'});continue;}
   if(!side.firstElementChild){
    const element=document.createElement(c.reference.tag??dmf.tagName.toLowerCase());
    element.className=c.reference.classes.join(' ');
    for(const [k,v] of Object.entries(c.reference.attributes))element.setAttribute(k,v);
    if(!c.reference.tag)for(const attr of ['type','role'])if(dmf.hasAttribute(attr))element.setAttribute(attr,dmf.getAttribute(attr));
    if(!c.void&&c.text)element.textContent=c.text;
    side.append(element);
   }
   results.push({id:c.id,unsupported:c.unsupported,void:c.void,shadcn:read(side.firstElementChild),dmf:read(dmf)});
  }
  return results;
 },properties);
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
