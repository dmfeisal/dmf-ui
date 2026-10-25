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
   const textarea=document.querySelector('.dmf-react-textarea'),surfaces=[];
   for(let node=textarea;node;node=node.parentElement)surfaces.unshift(getComputedStyle(node).backgroundColor);
   canvas.clearRect(0,0,1,1);canvas.fillStyle='white';canvas.fillRect(0,0,1,1);
   for(const color of surfaces){canvas.fillStyle=color;canvas.fillRect(0,0,1,1);}
   const textareaBackground='rgb('+[...canvas.getImageData(0,0,1,1).data].slice(0,3).join(',')+')';
   boundaries.push({part:'textarea border',ratio:ratio(getComputedStyle(textarea).borderColor,textareaBackground)});
   for(const input of document.querySelectorAll('.dmf-react-switch input:not(:disabled)')){
    const track=input.nextElementSibling,thumb=track.firstElementChild,style=getComputedStyle(track);
    boundaries.push({part:input.name+' track outline',ratio:ratio(style.outlineColor,background)},{part:input.name+' thumb',ratio:ratio(getComputedStyle(thumb).backgroundColor,style.backgroundColor)});
   }
   return{violations:compact(r.violations),incomplete:compact(r.incomplete),errors:window.__dmfErrors,boundaries,viewport:{width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}};
  });
  reports.push({state,...data});await writeFile(artifacts+'/report.json',JSON.stringify({browser:await page.evaluate(()=>navigator.userAgent),reports},null,2));
  assert(!data.errors.length,`${state} runtime errors: ${JSON.stringify(data.errors)}`);assert(!data.violations.length,`${state} axe violations: ${JSON.stringify(data.violations)}`);
  assert(data.boundaries.every(item=>item.ratio>=3),`${state} non-text contrast below 3:1: ${JSON.stringify(data.boundaries)}`);
  assert(await page.evaluate(expected=>getComputedStyle(document.querySelector('[data-slot=field][data-orientation=responsive]')).flexDirection===expected,state.startsWith('mobile')?'column':'row'),'Field responsive orientation did not follow its container');
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
  await page.evaluate(()=>document.querySelector('[name=notes]').setAttribute('aria-invalid','true'));
  assert(await page.evaluate(()=>{const el=document.querySelector('[name=notes]'),c=document.createElement('canvas').getContext('2d');c.fillStyle=getComputedStyle(el).getPropertyValue('--destructive');const expected=c.fillStyle;c.fillStyle=getComputedStyle(el).borderColor;return c.fillStyle===expected;}),'Textarea authored invalid border styling missing');
  await page.evaluate(()=>document.querySelector('[name=notes]').removeAttribute('aria-invalid'));
  await page.fill('textarea[name=notes]','Native multiline\nnotes');
  await page.focus('textarea[name=notes]');await page.keyboard.press('Tab');
  assert(await page.evaluate(()=>document.activeElement.name==='accepted'&&document.activeElement.matches(':focus-visible')),'Checkbox native Tab focus missing');
  await page.keyboard.press('Space');await page.keyboard.press('Tab');await page.keyboard.press('Tab');
  assert(await page.evaluate(()=>document.activeElement.textContent==='Preview notes'),'Disabled Checkbox remained in tab order');
  await page.click('form[data-basic-controls] button[type=submit]');
  assert(await page.evaluate(()=>{const values=JSON.parse(document.querySelector('[data-basic-result]').textContent);return values.notes==='Native multiline\nnotes'&&values.accepted==='on'&&values.extras==='on'&&!('unavailable'in values);}), 'Native Textarea/Checkbox submission failed');
  await page.click('form[data-basic-controls] button[type=reset]');
  assert(await page.evaluate(()=>document.querySelector('[name=notes]').value===''&&!document.querySelector('[name=accepted]').checked&&document.querySelector('[name=extras]').checked),'Basic controls reset failed');
  await page.click('form[data-basic-controls] button[type=submit]');
  assert(await page.evaluate(()=>!document.querySelector('form[data-basic-controls]').checkValidity()&&document.activeElement.name==='notes'),'Required Textarea failed validation');
  await page.waitForFunction(()=>document.querySelector('[data-slot=field-error]')?.textContent==='Enter preview notes.');
  assert(await page.evaluate(()=>{const textarea=document.querySelector('[name=notes]'),error=document.querySelector('[data-slot=field-error]');return textarea.getAttribute('aria-invalid')==='true'&&textarea.getAttribute('aria-describedby').split(' ').includes(error.id)&&error.getAttribute('role')==='alert';}),'Host-owned Field error association missing');
  await page.focus('[name=delivery][value=weekly]');await page.keyboard.press('ArrowDown');
  assert(await page.evaluate(()=>document.activeElement.value==='monthly'&&document.querySelector('[name=delivery][value=monthly]').checked),'Native radio arrows did not skip the disabled choice');
  await page.selectOption('select[name=channel]','digest');await page.focus('select[name=channel]');await page.keyboard.press('e');
  assert(await page.evaluate(()=>document.querySelector('select[name=channel]').value==='email'),'Native Select typeahead failed');
  assert(await page.evaluate(()=>document.querySelector('select[name=channel] option[value=sms]').matches(':disabled')),'Native optgroup disabled semantics missing');
  await page.selectOption('select[name=channel]','digest');
  await page.click('form[data-choice-controls] button[type=submit]');
  assert(await page.evaluate(()=>{const v=JSON.parse(document.querySelector('[data-choice-result]').textContent);return v.delivery==='monthly'&&v.format==='summary'&&v.channel==='digest';}),'Selection form submission failed');
  await page.click('form[data-choice-controls] button[type=reset]');assert(await page.evaluate(()=>document.querySelector('[name=delivery][value=weekly]').checked&&document.querySelector('select[name=channel]').value===''),'Selection host reset failed');
  await page.click('form[data-choice-controls] button[type=submit]');assert(await page.evaluate(()=>document.activeElement.name==='channel'&&!document.querySelector('form[data-choice-controls]').checkValidity()),'Required Select validation failed');
  for(const system of ['dmf','cb-ui'])for(const dark of [false,true]){
   await preset(system,dark);await audit(`desktop ${system} ${dark?'dark':'light'} surroundings`);
   if(system==='cb-ui'){
    const font=await page.evaluate(async()=>{await document.fonts.load('400 14px "DMF CB Nunito"');await document.fonts.ready;return{family:getComputedStyle(document.querySelector('main')).fontFamily,loaded:[...document.fonts].some(font=>font.family.includes('DMF CB Nunito')&&font.status==='loaded'),primary:getComputedStyle(document.querySelector('main')).getPropertyValue('--dmf-cb-ui-color-primary').trim()};});assert(font.loaded&&font.family.includes('DMF CB Nunito')&&font.primary==='#26ade4',`CB font/primary failed: ${JSON.stringify(font)}`);
   }
   await page.screenshot({path:`${artifacts}/desktop-${system}-${dark?'dark':'light'}.png`});
  }
  await page.focus('section .consumer-actions a[data-slot=badge]');
  await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');
  assert(await page.evaluate(()=>document.activeElement.tagName==='A'&&document.activeElement.matches(':focus-visible')&&parseFloat(getComputedStyle(document.activeElement).outlineWidth)>=2),'Badge link keyboard focus missing');
  await page.keyboard.press('Enter');
  assert(await page.evaluate(()=>decodeURIComponent(location.hash.slice(1))===document.querySelector('input[name=name]').id),'Badge link did not navigate to its authored target');
  assert(await page.evaluate(()=>[...document.querySelectorAll('[data-slot=alert]')].every(el=>el.getAttribute('role')==='note'&&!el.hasAttribute('aria-live'))),'Static Alerts became live announcements');
  await mobile();
  for(const direction of ['ltr','rtl'])for(const system of ['dmf','cb-ui']){
   await page.evaluate(direction=>document.documentElement.dir=direction,direction);await preset(system,true);
   for(const fontSize of ['87.5%','175%']){
    await page.evaluate(fontSize=>document.documentElement.style.fontSize=fontSize,fontSize);await settle();
    const bounds=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,clipped:[...document.querySelectorAll('button,[data-slot=card],[data-slot=text],fieldset,.dmf-react-switch,.dmf-react-textarea,.consumer-check-label')].filter(el=>{const r=el.getBoundingClientRect();return r.left< -1||r.right>document.documentElement.clientWidth+1||el.scrollWidth>el.clientWidth+2;}).map(el=>({tag:el.tagName,text:el.textContent?.trim().slice(0,40),width:el.clientWidth,scroll:el.scrollWidth})),small:[...document.querySelectorAll('button,.dmf-react-switch,input[name=name]')].filter(el=>{const r=el.getBoundingClientRect();return r.height<44||r.width<44;}).map(el=>el.textContent||el.name)}));
    assert(bounds.width===390&&bounds.scroll<=390&&!bounds.clipped.length,`Mobile overflow ${system}/${direction}/${fontSize}: ${JSON.stringify(bounds)}`);assert(!bounds.small.length,`Coarse-pointer targets too small: ${JSON.stringify(bounds.small)}`);
    await audit(`mobile ${system} ${direction} ${fontSize==='175%'?'200%':'100%'} text`);
    if(direction==='rtl'&&fontSize==='175%')await page.screenshot({path:`${artifacts}/enlarged-${system}-rtl.png`});
   }
   await page.evaluate(()=>document.documentElement.style.fontSize='87.5%');await settle();await page.screenshot({path:`${artifacts}/mobile-${system}-${direction}.png`});
  }
  await tap('label.dmf-react-switch:has(input[name=updates])');
  assert(await page.evaluate(()=>document.querySelector('[name=updates]').checked),'Mobile label touch did not toggle Switch');
  await tap('form:not([data-basic-controls]):not([data-choice-controls]) button[type=reset]');
  assert(await page.evaluate(()=>!document.querySelector('[name=updates]').checked&&document.querySelector('[role=status]').textContent==='Form reset.'),'Mobile reset touch failed');
  await resetBrowser();
  await page.evaluate(()=>{document.documentElement.dir='ltr';document.documentElement.style.fontSize='87.5%';});
  const forced=[];
  for(const scheme of ['light','dark']){
   await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'forced-colors',value:'active'},{name:'prefers-color-scheme',value:scheme}]});
   for(const system of ['dmf','cb-ui']){
    await preset(system,scheme==='dark');
    await page.focus('input[name=name]');await page.keyboard.press('Tab');
    const state=await page.evaluate(()=>{
     const controls=[...document.querySelectorAll('.dmf-react-switch input')].map(input=>{
      const track=input.nextElementSibling,thumb=track.firstElementChild,t=getComputedStyle(track),s=getComputedStyle(thumb),a=track.getBoundingClientRect(),b=thumb.getBoundingClientRect();
      return{name:input.name,checked:input.checked,disabled:input.disabled,track:t.backgroundColor,thumb:s.backgroundColor,outline:t.outlineColor,outlineWidth:parseFloat(t.outlineWidth),offset:b.left-a.left};
     });
     return{active:matchMedia('(forced-colors: active)').matches,focused:document.activeElement.name,visible:document.activeElement.matches(':focus-visible'),controls};
    });
    assert(state.active&&state.focused==='updates'&&state.visible,'Forced colors keyboard focus failed');
    assert(state.controls.every(control=>control.thumb!==control.track&&control.outlineWidth>=1),'Forced colors erased a Switch indicator');
    assert(state.controls.find(c=>c.name==='digest').offset>state.controls.find(c=>c.name==='updates').offset+5,'Forced colors lost checked position');
    assert(state.controls.find(c=>c.name==='updates').outlineWidth>=2,'Forced colors focus outline missing');
    await page.keyboard.press('Space');assert(await page.evaluate(()=>document.querySelector('[name=updates]').checked),'Forced colors Space toggle failed');
    await page.click('form:not([data-basic-controls]):not([data-choice-controls]) button[type=reset]');assert(await page.evaluate(()=>!document.querySelector('[name=updates]').checked),'Forced colors reset failed');
    await page.focus('textarea[name=notes]');await page.keyboard.press('Tab');
    assert(await page.evaluate(()=>document.activeElement.name==='accepted'&&document.activeElement.matches(':focus-visible')&&getComputedStyle(document.activeElement).appearance==='auto'&&parseFloat(getComputedStyle(document.activeElement).outlineWidth)>=2),'Forced colors native Checkbox focus missing');
    await page.keyboard.press('Space');assert(await page.evaluate(()=>document.querySelector('[name=accepted]').checked),'Forced colors Checkbox Space toggle failed');
    await page.click('form[data-basic-controls] button[type=reset]');
    await page.focus('[name=delivery][value=weekly]');await page.keyboard.press('ArrowDown');
    assert(await page.evaluate(()=>document.activeElement.value==='monthly'&&document.activeElement.checked&&getComputedStyle(document.activeElement).appearance==='auto'&&parseFloat(getComputedStyle(document.activeElement).outlineWidth)>=2),'Forced-colors native radio state/focus failed');
    await page.selectOption('select[name=channel]','digest');await page.focus('select[name=channel]');
    assert(await page.evaluate(()=>document.activeElement.value==='digest'&&getComputedStyle(document.activeElement).appearance==='auto'&&parseFloat(getComputedStyle(document.activeElement).outlineWidth)>=2),'Forced-colors native Select focus failed');
    await page.click('form[data-choice-controls] button[type=reset]');
    forced.push({scheme,system,...state});await page.screenshot({path:`${artifacts}/forced-${system}-${scheme}.png`});
   }
  }
  await writeFile(artifacts+'/forced-colors-report.json',JSON.stringify({scope:'Chromium forced-colors emulation; not Windows high-contrast device evidence',forced},null,2));
  console.log('PASS React browser: native keyboard/forms/ref/reset; 12 axe states; bundled CB font; mobile RTL and 200% text; four forced-colors states');
 }finally{await page.cdp('Page.removeScriptToEvaluateOnNewDocument',{identifier:init.identifier});await resetBrowser();}
}
