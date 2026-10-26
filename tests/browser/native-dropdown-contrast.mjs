export async function reviewNativeDropdowns(page,result){
 const reviews=await page.evaluate(incomplete=>incomplete.flatMap(rule=>rule.nodes.map(node=>{
  const target=node.target;
  if(rule.id!=='color-contrast'||target.length!==1)return {target,accepted:false};
  const el=document.querySelector(target[0]);
  if(!el?.matches('select')||!el.closest('.contract-controls'))return {target,accepted:false};
  const s=getComputedStyle(el),ctx=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
  const rgba=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data];};
  const fg=rgba(s.color),bg=rgba(s.backgroundColor),lum=rgba=>rgba.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
  const a=lum(fg),b=lum(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  return {target,ratio,accepted:fg[3]===255&&bg[3]===255&&ratio>=4.5&&s.backgroundImage!=='none'&&parseFloat(s.paddingInlineEnd)>=26,reason:'Opaque native-dropdown text measured independently; chevron image is outside reserved text padding. Raw axe incomplete retained.'};
 })),result.incomplete);
 if(reviews.some(review=>!review.accepted))throw Error('Unreviewed audit incomplete: '+JSON.stringify({result,reviews}));
 return reviews;
}
