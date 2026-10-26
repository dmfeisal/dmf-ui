import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,mobile,resetBrowser,settle}){
 const assert=(value,message)=>{if(!value)throw Error(message);};
 const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8'),reports=[];
 const audit=async(selector,state)=>{
  await settle();await page.evaluate(source=>{if(window.axe)return;const s=document.createElement('script');s.textContent=source;document.head.append(s);},axe);
  const result=await page.evaluate(async selector=>{const r=await window.axe.run(document.querySelector(selector));return {violations:r.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),incomplete:r.incomplete.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))};},selector);
  reports.push({state,...result});await writeFile(new URL('../../.dmf-ui-test-results/m1-architecture-audit.json',import.meta.url),JSON.stringify(reports,null,2));assert(!result.violations.length,JSON.stringify({state,...result}));
 };
 await navigate(`${baseURL}/components/button/`);
 const props='[data-button-contract]',button='[data-contract-button]';
 for(const [size,height] of [['xs',24],['sm',28],['default',32],['md',32],['lg',36]]){
  await page.selectOption(`${props} [name=size]`,size);
  await settle();
  assert(await page.evaluate(height=>Math.abs(document.querySelector('[data-contract-button]').getBoundingClientRect().height-height)<.1,height),'Compact Button scale '+size);
  await page.selectOption(`${props} [name=icons]`,'icon');
  await settle();
  assert(await page.evaluate(height=>{const b=document.querySelector('[data-contract-button]'),r=b.getBoundingClientRect();return Math.abs(r.width-height)<.1&&Math.abs(r.height-height)<.1&&b.getAttribute('aria-label')==='Search example';},height),'Icon scale/name '+size);
  await page.selectOption(`${props} [name=icons]`,'label');
 }
 await page.selectOption(`${props} [name=size]`,'md');
 await page.selectOption(`${props} [name=width]`,'fill');
 await settle();
 assert(await page.evaluate(()=>{const b=document.querySelector('[data-contract-button]'),p=b.parentElement,s=getComputedStyle(p);return Math.abs(b.getBoundingClientRect().width-(p.clientWidth-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight)))<1&&b.getBoundingClientRect().height===32;}),'Width changed size or failed to fill');
 for(const content of ['label','leading','trailing','both','icon']){
  await page.selectOption(`${props} [name=icons]`,content);
  assert(await page.evaluate(()=>document.querySelector('[data-copy-target="contract-button-code"]').dataset.copyValue===document.querySelector('#contract-button-code code').textContent),'Configured source/copy drift');
 }
 await page.evaluate(()=>{window.m1Copied='';Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.m1Copied=text;}}});});
 await page.focus('[data-copy-target="contract-button-code"]');await page.keyboard.press('Enter');
 assert(await page.evaluate(()=>window.m1Copied.includes('class="w-full"')&&window.m1Copied.includes('aria-label="Search example"')),'Configured copy not exact');
 await page.focus(button);await page.keyboard.press('Space');
 assert(await page.evaluate(()=>document.querySelector('[data-contract-action-status]').textContent.includes('activated')),'Native Button Space');
 await audit(props,'Button configured icon fill');
 await page.focus(`${props} button[type=reset]`);await page.keyboard.press('Enter');
 await page.waitForFunction(()=>{const b=document.querySelector('[data-contract-button]');return !b.disabled&&b.dataset.size==='default'&&!b.classList.contains('w-full')&&!document.querySelector('[data-contract-label]').hidden;});
 await page.evaluate(()=>document.querySelector('[data-button-contract]').style.setProperty('--dmf-button-height','2.5rem'));
 await settle();
 assert(await page.evaluate(()=>document.querySelector('[data-contract-button]').getBoundingClientRect().height===40),'Shared component token override ignored');
 await page.evaluate(()=>document.querySelector('[data-button-contract]').style.removeProperty('--dmf-button-height'));
 await mobile();await page.evaluate(()=>{document.documentElement.dir='rtl';document.documentElement.dataset.theme='dark';document.documentElement.style.fontSize='175%';});
 await settle();
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=390),'Button documentation RTL overflow');
 await audit(props,'Button enlarged RTL dark');
 await page.evaluate(()=>document.querySelector('[data-button-contract]').scrollIntoView({block:'center',behavior:'instant'}));await page.screenshot({path:'/tmp/dmf-m1-button-mobile.png'});
 await resetBrowser();await navigate(`${baseURL}/components/loading-button/`);
 await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 for(const presentation of ['label','icon-label','icon']){
  const selector=`[data-example-presentation=${presentation}] [data-slot=loading-button]`;
  const before=await page.evaluate(s=>{const b=document.querySelector(s),r=b.getBoundingClientRect();return {width:r.width,height:r.height,name:b.getAttribute('aria-label')};},selector);
  await page.focus(selector);await page.keyboard.press('Space');
  assert(await page.evaluate(({selector,before})=>{const b=document.querySelector(selector),r=b.getBoundingClientRect(),label=b.querySelector('[data-idle-label]');return b.disabled&&b.getAttribute('aria-busy')==='true'&&b.getAttribute('aria-label')===before.name&&b.nextElementSibling.textContent==='Saving draft…'&&(!label||getComputedStyle(label).visibility==='visible')&&r.width===before.width&&r.height===before.height&&(!b.querySelector('.dmf-loading-spinner')||getComputedStyle(b.querySelector('.dmf-loading-spinner')).animationName==='none');},{selector,before}),'Pending name/geometry/reduced motion '+presentation);
  await audit('[data-docs-preview]','Loading '+presentation);
  await page.focus('[data-feedback-action=finish]');await page.keyboard.press('Enter');
 }
 await resetBrowser();await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'forced-colors',value:'active'}]});
 await navigate(`${baseURL}/components/switch/`);
 const toggle='[data-selection-state=default] [role=switch]';
 for(const preset of ['dmf','cb-ui','hui','qdi']){
  await page.selectOption('[data-selection-properties] [name=preset]',preset);await page.focus(toggle);await page.keyboard.press('Space');await page.keyboard.press('Space');
  await settle();
  assert(await page.evaluate(()=>{
   const b=document.querySelector('[data-selection-state=default] [role=switch]'),s=getComputedStyle(b),thumb=getComputedStyle(b.querySelector('[data-slot=switch-thumb]'));
   const ctx=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
   const lum=color=>{ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);};
   const a=lum(s.backgroundColor),c=lum(thumb.backgroundColor),ratio=(Math.max(a,c)+.05)/(Math.min(a,c)+.05);
   return b.getAttribute('aria-checked')==='true'&&ratio>=3&&parseFloat(s.borderWidth)>=1&&parseFloat(s.outlineWidth)>=2;
  }),'Forced-color Switch track/thumb/focus '+preset);
 }
 await resetBrowser();await navigate(`${baseURL}/components/checkbox/`);
 await page.evaluate(()=>document.querySelector('#selection-checkbox-default').scrollIntoView({block:'center',behavior:'instant'}));
 await page.click('label[for=selection-checkbox-default]');
 assert(await page.evaluate(()=>document.querySelector('#selection-checkbox-default').checked),'Checkbox label activation');
 await page.focus('#selection-checkbox-default');await page.keyboard.press('Space');
 assert(await page.evaluate(()=>!document.querySelector('#selection-checkbox-default').checked),'Checkbox Space activation');
 console.log('PASS M1 Button compact/icon scale, independent width, token override, exact shared copy, keyboard, RTL dark; stable-name LoadingButton without shift; forced-color Switch; Checkbox label/Space');
}
