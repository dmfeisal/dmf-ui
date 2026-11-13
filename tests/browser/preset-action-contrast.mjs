import {readFile} from 'node:fs/promises';

// CB and HUI filled primary actions keep white labels by owner preference. contracts/brands.json records each
// as an actionTextPolicy contrast exception with its measured ratio. This review accepts an axe color-contrast
// violation only when the node is that exact pair: white text on the preset's unchanged --primary fill, inside
// that preset, at the recorded ratio. Every other violation is returned unchanged for the caller to fail on.
const {brands}=JSON.parse(await readFile(new URL('../../contracts/brands.json',import.meta.url),'utf8'));
const exceptions=Object.fromEntries(Object.entries(brands).filter(([,brand])=>brand.actionTextPolicy?.status==='known-normal-text-contrast-exception').map(([id,brand])=>[id,{foreground:brand.actionTextPolicy.foreground,ratio:brand.actionTextPolicy.contrastRatio}]));

export async function reviewRecordedActionContrast(page,violations){
 const contrast=violations.find(rule=>rule.id==='color-contrast');
 if(!contrast)return {violations,exceptions:[]};
 const reviews=await page.evaluate(({nodes,exceptions})=>nodes.map(node=>{
  const target=node.target;
  if(target.length!==1)return {target,accepted:false};
  const el=document.querySelector(target[0]),root=el?.closest('[data-system]'),system=root?.dataset.system,policy=exceptions[system];
  if(!el||!policy)return {target,system,accepted:false};
  const ctx=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
  const rgba=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data];};
  const lum=c=>c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
  const probe=document.createElement('span');probe.style.cssText='position:absolute;inline-size:0;block-size:0;background:var(--primary)';root.append(probe);const primary=rgba(getComputedStyle(probe).backgroundColor);probe.remove();
  let fill=null,opaque=true;
  for(let p=el;p;p=p.parentElement){const s=getComputedStyle(p);if(Number(s.opacity)!==1)opaque=false;if(!fill){const bg=rgba(s.backgroundColor);if(bg[3]!==0){fill=bg;if(s.backgroundImage!=='none')opaque=false;}}}
  const fg=rgba(getComputedStyle(el).color),want=rgba(policy.foreground);
  const a=lum(fg),b=lum(fill??[0,0,0,0]),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  const same=(x,y)=>x.every((v,i)=>v===y[i]);
  const accepted=Boolean(fill)&&opaque&&same(fg,want)&&fg[3]===255&&same(fill,primary)&&fill[3]===255&&Math.abs(ratio-policy.ratio)<.005;
  return {target,system,foreground:fg,background:fill,primary,ratio,recordedRatio:policy.ratio,accepted};
 }),{nodes:contrast.nodes,exceptions});
 const remaining=contrast.nodes.filter((_,index)=>!reviews[index].accepted);
 return {violations:violations.flatMap(rule=>rule!==contrast?[rule]:remaining.length?[{...rule,nodes:remaining,reviews:reviews.filter(review=>!review.accepted)}]:[]),exceptions:reviews.filter(review=>review.accepted).map(review=>({...review,reason:'Recorded owner-preference actionTextPolicy exception in contracts/brands.json.'}))};
}
