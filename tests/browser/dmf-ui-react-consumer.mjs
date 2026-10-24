import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,artifacts,settle,mobile,tap,resetBrowser}){
 const assert=(ok,message)=>{if(!ok)throw new Error(message);};
 const reports=[];
 const init=await page.cdp('Page.addScriptToEvaluateOnNewDocument',{source:`window.__dmfErrors=[];window.addEventListener('error',e=>window.__dmfErrors.push(e.message));window.addEventListener('unhandledrejection',e=>window.__dmfErrors.push(String(e.reason)));const original=console.error;console.error=(...args)=>{window.__dmfErrors.push(args.map(String).join(' '));original.apply(console,args);};`});
 const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
 async function audit(state){
  await settle();
  const data=await page.evaluate(async()=>{
   const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}});
   const compact=items=>items.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
   const canvas=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
   const lum=color=>{canvas.clearRect(0,0,1,1);canvas.fillStyle=color;canvas.fillRect(0,0,1,1);return [...canvas.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);};
   const ratio=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
   const background=getComputedStyle(document.querySelector('[data-slot=card]')).backgroundColor;
   const boundaries=[{part:'input border',ratio:ratio(getComputedStyle(document.querySelector('.dmf-react-input')).borderColor,background)}];
   for(const input of document.querySelectorAll('.dmf-react-switch input:not(:disabled)')){
    const track=input.nextElementSibling,thumb=track.firstElementChild,style=getComputedStyle(track);
    boundaries.push({part:input.name+' track outline',ratio:ratio(style.outlineColor,background)},{part:input.name+' thumb',ratio:ratio(getComputedStyle(thumb).backgroundColor,style.backgroundColor)});
   }
   return{violations:compact(r.violations),incomplete:compact(r.incomplete),errors:window.__dmfErrors,boundaries,viewport:{width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}};
  });
  reports.push({state,...data});await writeFile(artifacts+'/report.json',JSON.stringify({browser:await page.evaluate(()=>navigator.userAgent),reports},null,2));
  assert(!data.errors.length,`${state} runtime errors: ${JSON.stringify(data.errors)}`);assert(!data.violations.length,`${state} axe violations: ${JSON.stringify(data.violations)}`);
  assert(data.boundaries.every(item=>item.ratio>=3),`${state} non-text contrast below 3:1: ${JSON.stringify(data.boundaries)}`);
  console.log('PASS audit:',state);
 }
 async function preset(system,dark){
  await page.click(`loc=role:button[name='${system==='dmf'?'DMF preset':'CB UI preset'}']`);
  if(await page.evaluate(()=>document.querySelector('.consumer-actions button:last-child').getAttribute('aria-pressed')==='true')!==dark)await page.click("loc=role:button[name='Dark surroundings']");
  await page.waitForFunction(({system,dark})=>document.querySelector('main').dataset.system===system&&(document.documentElement.dataset.theme==='dark')===dark,{system,dark});await settle();
 }
 try{
  await page.goto(baseURL);await page.waitForFunction(()=>!document.querySelector('fieldset').disabled);await settle();
  await page.evaluate(source=>{const script=document.createElement('script');script.textContent=source;document.head.append(script);},axe);
  await page.focus('input[name=name]');await page.keyboard.press('Tab');
  assert(await page.evaluate(()=>document.activeElement.name==='updates'&&document.activeElement.matches(':focus-visible')),'Tab did not focus Switch visibly');
  const focus=await page.evaluate(()=>{const style=getComputedStyle(document.querySelector('.dmf-react-switch-track'));return{style:style.outlineStyle,width:parseFloat(style.outlineWidth)};});assert(focus.style!=='none'&&focus.width>=2,'Switch keyboard focus outline missing');
  await page.screenshot({path:artifacts+'/keyboard-switch-focus.png'});
  await page.keyboard.press('Shift+Tab');
  assert(await page.evaluate(()=>{const input=document.activeElement,style=getComputedStyle(input);return input.name==='name'&&input.matches(':focus-visible')&&parseFloat(style.outlineWidth)>=2;}),'Input keyboard focus outline missing');
  await page.screenshot({path:artifacts+'/keyboard-input-focus.png'});await page.keyboard.press('Tab');
  await page.keyboard.press('Space');assert(await page.evaluate(()=>document.querySelector('[name=updates]').checked),'Space did not toggle native Switch');
  await page.keyboard.press('Tab');await page.keyboard.press('Tab');assert(await page.evaluate(()=>document.activeElement.name==='consent'),'Disabled Switch did not leave the tab order');await page.keyboard.press('Space');
  await page.fill('input[name=name]','Browser proof');await page.click("loc=role:button[name='Preview values']");
  assert(await page.evaluate(()=>{const data=JSON.parse(document.querySelector('[role=status]').textContent);return data.name==='Browser proof'&&data.updates==='enabled'&&data.consent==='on'&&!('disabled'in data);}), 'Native form values incorrect');
  await page.click("loc=role:button[name='Focus display name']");assert(await page.evaluate(()=>document.activeElement.name==='name'),'Native ref focus failed');
  await page.click("loc=role:button[name='Reset form']");assert(await page.evaluate(()=>!document.querySelector('[name=updates]').checked&&!document.querySelector('[name=consent]').checked&&document.querySelector('[name=digest]').checked&&document.querySelector('[name=name]').value==='Feisal'),'Reset failed');
  await page.click("loc=role:button[name='Preview values']");assert(await page.evaluate(()=>document.activeElement.name==='consent'&&!document.querySelector('form').checkValidity()),'Required consent did not prevent submission');
  for(const system of ['dmf','cb-ui'])for(const dark of [false,true]){
   await preset(system,dark);await audit(`desktop ${system} ${dark?'dark':'light'} surroundings`);
   if(system==='cb-ui'){
    const font=await page.evaluate(async()=>{await document.fonts.load('400 14px "DMF CB Nunito"');await document.fonts.ready;return{family:getComputedStyle(document.querySelector('main')).fontFamily,loaded:[...document.fonts].some(font=>font.family.includes('DMF CB Nunito')&&font.status==='loaded'),primary:getComputedStyle(document.querySelector('main')).getPropertyValue('--dmf-cb-ui-color-primary').trim()};});assert(font.loaded&&font.family.includes('DMF CB Nunito')&&font.primary==='#26ade4',`CB font/primary failed: ${JSON.stringify(font)}`);
   }
   await page.screenshot({path:`${artifacts}/desktop-${system}-${dark?'dark':'light'}.png`});
  }
  await mobile();
  for(const direction of ['ltr','rtl'])for(const system of ['dmf','cb-ui']){
   await page.evaluate(direction=>document.documentElement.dir=direction,direction);await preset(system,true);
   for(const fontSize of ['87.5%','175%']){
    await page.evaluate(fontSize=>document.documentElement.style.fontSize=fontSize,fontSize);await settle();
    const bounds=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,clipped:[...document.querySelectorAll('button,[data-slot=card],[data-slot=text],fieldset,.dmf-react-switch')].filter(el=>{const r=el.getBoundingClientRect();return r.left< -1||r.right>document.documentElement.clientWidth+1||el.scrollWidth>el.clientWidth+2;}).map(el=>({tag:el.tagName,text:el.textContent?.trim().slice(0,40),width:el.clientWidth,scroll:el.scrollWidth})),small:[...document.querySelectorAll('button,.dmf-react-switch,input[name=name]')].filter(el=>{const r=el.getBoundingClientRect();return r.height<44||r.width<44;}).map(el=>el.textContent||el.name)}));
    assert(bounds.width===390&&bounds.scroll<=390&&!bounds.clipped.length,`Mobile overflow ${system}/${direction}/${fontSize}: ${JSON.stringify(bounds)}`);assert(!bounds.small.length,`Coarse-pointer targets too small: ${JSON.stringify(bounds.small)}`);
    await audit(`mobile ${system} ${direction} ${fontSize==='175%'?'200%':'100%'} text`);
    if(direction==='rtl'&&fontSize==='175%')await page.screenshot({path:`${artifacts}/enlarged-${system}-rtl.png`});
   }
   await page.evaluate(()=>document.documentElement.style.fontSize='87.5%');await settle();await page.screenshot({path:`${artifacts}/mobile-${system}-${direction}.png`});
  }
  await tap('label.dmf-react-switch:has(input[name=updates])');
  assert(await page.evaluate(()=>document.querySelector('[name=updates]').checked),'Mobile label touch did not toggle Switch');
  await tap('button[type=reset]');
  assert(await page.evaluate(()=>!document.querySelector('[name=updates]').checked&&document.querySelector('[role=status]').textContent==='Form reset.'),'Mobile reset touch failed');
  console.log('PASS React browser: native keyboard/forms/ref/reset; 12 axe states; bundled CB font; mobile RTL and 200% text');
 }finally{await page.cdp('Page.removeScriptToEvaluateOnNewDocument',{identifier:init.identifier});await resetBrowser();}
}
