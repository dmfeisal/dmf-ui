import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,astroBaseURL,artifacts,click,resetBrowser}){
 const assert=(value,message)=>{if(!value)throw Error(message);},reports=[];
 const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
 await page.cdp('Page.addScriptToEvaluateOnNewDocument',{source:`window.__signInErrors=[];addEventListener('error',e=>__signInErrors.push(e.message));addEventListener('unhandledrejection',e=>__signInErrors.push(String(e.reason)));const oldError=console.error;console.error=(...a)=>{__signInErrors.push(a.join(' '));oldError.apply(console,a);};`});
 const wait=()=>page.waitForFunction(()=>document.fonts.status==='loaded'&&!document.getAnimations().some(a=>a.playState==='running'&&Number.isFinite(a.effect?.getComputedTiming().endTime)&&a.effect.getComputedTiming().endTime<=3000),undefined,{timeout:10000});
 async function audit(state){await wait();await page.evaluate(source=>{if(!window.axe){const script=document.createElement('script');script.textContent=source;document.head.append(script);}},axe);
  const result=await page.evaluate(async()=>{const r=await window.axe.run();return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary})),ownerPrimaryOnly:v.id==='color-contrast'&&v.nodes.every(n=>{if(n.target.length!==1)return false;const e=document.querySelector(n.target[0]),b=e?.closest('[data-block-submit]');return b?.classList.contains('bg-primary')&&b.classList.contains('text-primary-foreground')&&b.closest('.dmf-ui')?.dataset.system==='hui';})})),incomplete:r.incomplete.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),errors:window.__signInErrors};});
  reports.push({state,...result});await writeFile(artifacts+'/sign-in-audit.json',JSON.stringify(reports,null,2));assert(result.violations.every(v=>v.ownerPrimaryOnly),JSON.stringify({state,...result}));assert(!result.incomplete.length,JSON.stringify(result.incomplete));assert(!result.errors.length,JSON.stringify(result.errors));
 }
 await page.cdp('Emulation.setScriptExecutionDisabled',{value:false});await resetBrowser();await page.goto(baseURL+'/sign-in.html');await page.waitForFunction(()=>!document.querySelector('[data-sign-in-proof] [type=submit]').disabled);
 const f='[data-sign-in-proof]';await click(f+' [type=submit]');assert(await page.evaluate(()=>document.activeElement.name==='email'),'Required email focus');
 await page.fill(f+' [name=email]','reader@example.test');await click(f+' [type=submit]');assert(await page.evaluate(()=>document.activeElement.name==='password'),'Required password focus');
 await page.fill(f+' [name=password]','test-only-password');await page.focus(f+' [name=password]');await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('[data-sign-in-proof] fieldset').disabled);
 assert(await page.evaluate(()=>document.querySelector('[data-sign-in-result]').textContent.includes('not read')&&[...document.querySelectorAll('[data-slot=sign-in-block] fieldset')].every(e=>e.disabled)),'Host submit/disabled independence');await audit('React pending');
 await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});assert(await page.evaluate(()=>getComputedStyle(document.querySelector('.dmf-sign-in-pending')).animationName==='none'),'Reduced motion');
 await page.click('button:text-is("Finish pending")');await page.click('button:text-is("Show local error")');await audit('React error');
 await page.click('button:text-is("Reset sign-in")');assert(await page.evaluate(()=>document.querySelector('[data-sign-in-proof] [name=password]').value===''),'Native reset');
 await page.focus(f+' [name=email]');await page.keyboard.press('Tab');assert(await page.evaluate(()=>document.activeElement.name==='password'),'Native Tab order');assert(await page.evaluate(()=>{const s=getComputedStyle(document.activeElement);return s.outlineStyle!=='none'&&parseFloat(s.outlineWidth)>=2;}),'Visible keyboard focus');
 await click(f+' a[href="#proof-notes"]');assert(await page.evaluate(()=>location.hash==='#proof-notes'),'Footer native link');
 for(const preset of ['dmf','hui']){
  await page.selectOption('[data-sign-in-preset]',preset);await page.waitForFunction(preset=>document.querySelector('main').dataset.system===preset,preset);
  for(const mode of preset==='dmf'?['light','dark']:['light']){
   await page.evaluate(mode=>document.documentElement.dataset.theme=mode,mode);
   for(const width of [1280,820,390]){
    await page.cdp('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===390});
    for(const direction of ['ltr','rtl']){await page.evaluate(dir=>{document.documentElement.dir=dir;document.documentElement.style.fontSize='100%';},direction);await page.selectOption('[data-sign-in-language]',direction==='rtl'?'id':'en');await audit(`${preset} ${mode} ${width} ${direction} standard`);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),'Standard layout overflow');}
   }
  }
 }
 await page.evaluate(()=>document.documentElement.style.fontSize='200%');await audit('HUI RTL enlarged text');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),'Enlarged overflow');
 await page.screenshot({path:artifacts+'/sign-in-enlarged-rtl.png'});
 await page.evaluate(()=>{document.documentElement.dir='rtl';document.documentElement.style.fontSize='100%';});await page.screenshot({path:artifacts+'/sign-in-standard-rtl.png'});
 await resetBrowser();await page.evaluate(()=>{document.documentElement.dir='ltr';document.documentElement.style.fontSize='100%';});await page.selectOption('[data-sign-in-preset]','dmf');await page.waitForFunction(()=>document.querySelector('main').dataset.system==='dmf');await page.evaluate(()=>document.documentElement.dataset.theme='light');await wait();await page.screenshot({path:artifacts+'/sign-in-desktop.png'});
 await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'forced-colors',value:'active'}]});await page.focus(f+' [name=email]');await page.keyboard.press('Tab');assert(await page.evaluate(()=>document.activeElement.name==='password'&&parseFloat(getComputedStyle(document.activeElement).outlineWidth)>=2),'Forced-color keyboard focus');
 await page.cdp('Emulation.setScriptExecutionDisabled',{value:true});
 await page.goto(baseURL+'/sign-in.html');assert(await page.evaluate(()=>document.querySelector('[data-sign-in-proof] [type=submit]').disabled),'No-JS preview guard');
 if(astroBaseURL){
  await page.goto(astroBaseURL+'/');await page.focus('#external-sign-in [type=submit]');await page.keyboard.press('Enter');assert(await page.evaluate(()=>document.activeElement.id==='external-sign-in-password'),'Astro native no-JS required password focus');
  assert(await page.evaluate(()=>{const f=document.querySelector('#external-sign-in');return f.method==='post'&&f.action.endsWith('/account/sign-in')&&!f.querySelector('[type=submit]').disabled&&document.querySelector('#external-disabled fieldset').disabled;}),'Astro native endpoint and disabled instance');
  await page.fill('#external-sign-in [name=email]','changed@example.test');await page.evaluate(()=>document.querySelector('#external-sign-in').reset());assert(await page.evaluate(()=>document.querySelector('#external-sign-in [name=email]').value==='reader@example.test'),'Astro native reset');
 }
 await page.cdp('Emulation.setScriptExecutionDisabled',{value:false});await resetBrowser();
 console.log('PASS packed sign-in: native keyboard/validation/reset, host states, focus, locales, three widths, standard RTL, separate enlarged text, presets, scoped axe and no-JS fallback.');
}
