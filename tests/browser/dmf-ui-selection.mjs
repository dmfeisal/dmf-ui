import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,settle,mobile,resetBrowser}){
 const assert=(v,m)=>{if(!v)throw Error(m);};const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8'),audits=[];
 async function audit(selector='[data-docs-preview]'){await settle();await page.evaluate(source=>{if(window.axe)return;const s=document.createElement('script');s.textContent=source;document.head.append(s);},axe);const r=await page.evaluate(async selector=>{const r=await window.axe.run(document.querySelector(selector));return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))};},selector);if(r.violations.length||r.incomplete.length)await page.screenshot({path:'/tmp/dmf-selection-audit-failure.png'});const clippingReviews=[];
 for(const rule of r.incomplete){
  assert(rule.id==='color-contrast'&&rule.nodes.every(node=>node.summary?.includes('partially obscured')),JSON.stringify(r));
  for(const node of rule.nodes){const review=await page.evaluate(async target=>{const element=document.querySelector(target.join(' ')),list=element?.closest('[role=listbox]');if(!element||!list)return {accepted:false};const rect=element.getBoundingClientRect(),clip=list.getBoundingClientRect();if(!(rect.top<clip.top||rect.bottom>clip.bottom))return {accepted:false};const before=list.scrollTop;list.scrollTop+=rect.top-clip.top;await new Promise(resolve=>requestAnimationFrame(resolve));const visible=element.getBoundingClientRect();const contained=visible.top>=clip.top-1&&visible.bottom<=clip.bottom+1;const result=await window.axe.run(element,{runOnly:{type:'rule',values:['color-contrast']}});list.scrollTop=before;return {accepted:contained&&!result.violations.length&&!result.incomplete.length,contained,violations:result.violations.map(x=>x.id),incomplete:result.incomplete.map(x=>x.id)};},node.target);assert(review.accepted,JSON.stringify({node,review}));clippingReviews.push({target:node.target,...review});}
 }
 const ownerExceptions=[];
 for(const rule of r.violations){
  const accepted=rule.id==='color-contrast'&&await page.evaluate(nodes=>nodes.every(node=>{if(node.target.length!==1)return false;const el=document.querySelector(node.target[0]);return el?.matches('[data-combobox-demo] button[type=submit][data-slot=button]')&&['cb-ui','hui'].includes(el.closest('[data-docs-preview]')?.dataset.system);}),rule.nodes);
  assert(accepted,JSON.stringify(r));ownerExceptions.push({id:rule.id,reason:'Owner-selected white CB/HUI primary label; brand fill preserved.'});
 }
 audits.push({selector,result:r,clippingReviews,ownerExceptions});await writeFile(new URL('../../.dmf-ui-test-results/selection-audit.json',import.meta.url),JSON.stringify(audits,null,2));}
 await resetBrowser();await navigate(`${baseURL}/components/collapsible/`);
 await page.focus('[data-example-presentation=label] summary');await page.keyboard.press('Space');
 assert(await page.evaluate(()=>document.querySelector('[data-example-presentation=label] details').open&&document.querySelector('[data-example-presentation=icon-label] details').open),'Independent disclosures failed');
 await page.focus('[data-example-presentation=label] a');await page.keyboard.press('Escape');assert(await page.evaluate(()=>!document.querySelector('[data-example-presentation=label] details').open&&document.activeElement.matches('[data-example-presentation=label] summary')),'Disclosure Escape focus failed');
 await navigate(`${baseURL}/components/toggle/`);
 for(const presentation of ['label','icon-label','icon']){
  const selector=`[data-example-presentation=${presentation}] [data-dmf-toggle]`;
  await page.focus(selector);await page.keyboard.press('Space');
  assert(await page.evaluate(s=>{const b=document.querySelector(s);return b.getAttribute('aria-pressed')==='true'&&b.textContent.trim()==='Bold'&&b.closest('[data-toggle-demo]').querySelector('[data-toggle-sample]').style.fontWeight==='700';},selector),`${presentation}: Toggle state/effect failed`);
  await page.keyboard.press('Enter');assert(await page.evaluate(s=>document.querySelector(s).getAttribute('aria-pressed')==='false',selector),'Toggle Enter did not release');
 }
 await page.keyboard.press('Escape');await page.focus('[data-example-presentation=label] [data-dmf-toggle]');await page.focus('[data-example-presentation=icon] [data-dmf-toggle]');await page.waitForFunction(()=>{const tip=document.querySelector('[data-example-presentation=icon] [data-slot=tooltip-content]');return tip&&!tip.hidden;});await audit('[data-example-presentation=icon] [data-dmf-tooltip]');await page.keyboard.press('Escape');
 await navigate(`${baseURL}/components/toggle-group/`);
 await page.click('[data-example-presentation=label] [data-value=bold]');await page.click('[data-example-presentation=label] [data-value=italic]');
 assert(await page.evaluate(()=>document.querySelectorAll('[data-example-presentation=label] [aria-pressed=true]').length===2),'Multiple group did not retain both states');
 await page.click('[aria-label="Sample alignment"] [data-value=center]');assert(await page.evaluate(()=>document.querySelectorAll('[aria-label="Sample alignment"] [aria-pressed=true]').length===1&&document.querySelector('[aria-label="Sample alignment"] [data-value=center]').getAttribute('aria-pressed')==='true'),'Single group failed exclusivity');
 await page.click('[aria-label="Sample alignment"] [data-value=center]');assert(await page.evaluate(()=>!document.querySelector('[aria-label="Sample alignment"] [aria-pressed=true]')),'Single group should permit deselection');
 assert(await page.evaluate(()=>document.querySelector('[data-example-presentation=label] [data-value=underline]').disabled),'Disabled command enabled');await audit();
 await navigate(`${baseURL}/components/combobox/`);const input='#docs-combobox-component';
 assert(await page.evaluate(()=>!document.querySelector('[data-combobox-demo]').checkValidity()),'Required combobox should be invalid');
 await page.focus(input);await page.keyboard.press('ArrowDown');
 assert(await page.evaluate(()=>{const i=document.querySelector('#docs-combobox-component');return i.getAttribute('aria-expanded')==='true'&&document.activeElement===i&&document.getElementById(i.getAttribute('aria-activedescendant')).dataset.value==='button';}),'Combobox active descendant/focus failed');await audit('[data-combobox-demo] > [data-slot=combobox]');
 await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');
 assert(await page.evaluate(()=>document.querySelector('#docs-combobox-component').value==='Card'&&new FormData(document.querySelector('[data-combobox-demo]')).get('component')==='card'),'Combobox commit/FormData failed');
 await page.fill(input,'not-a-component');assert(await page.evaluate(()=>!document.querySelector('#docs-combobox-component-list').parentElement.querySelector('[data-combobox-empty]').hidden),'No match state missing');await audit('[data-combobox-demo] > [data-slot=combobox]');
 await page.keyboard.press('Escape');assert(await page.evaluate(()=>document.querySelector('#docs-combobox-component').value==='Card'),'Escape lost committed value');
 await page.fill(input,'sli');await page.keyboard.press('ArrowDown');await page.keyboard.press('Tab');assert(await page.evaluate(()=>document.querySelector('#docs-combobox-component').value==='Card'),'Tab committed a mere highlight');
 await page.fill(input,'sli');await page.click('#docs-combobox-component-list [data-value=slider]');
 assert(await page.evaluate(()=>document.querySelector('#docs-combobox-component').value==='Slider'),'Pointer option did not commit');
 await page.focus(input);await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');
 assert(await page.evaluate(()=>document.getElementById(document.querySelector('#docs-combobox-component').getAttribute('aria-activedescendant')).dataset.value==='slider'),'Disabled option was not skipped');
 await page.keyboard.press('Escape');await page.click('[data-combobox-demo] button[type=submit]');assert(await page.evaluate(()=>document.querySelector('[data-combobox-demo-status]').textContent.includes('Component: slider; reference: card')),'Demo submit did not read native values');
 await page.click('[data-combobox-demo] button[type=reset]');await page.waitForFunction(()=>document.querySelector('#docs-combobox-component').value===''&&document.querySelector('#docs-combobox-reference').value==='Card');
 await page.focus('#docs-combobox-reference');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');assert(await page.evaluate(()=>new FormData(document.querySelector('[data-combobox-demo]')).get('reference')===''),'Optional clear selection failed');
 assert(await page.evaluate(()=>!new FormData(document.querySelector('[data-combobox-demo]')).has('unavailable')),'Disabled combobox leaked FormData');
 for(const slug of ['collapsible','toggle','toggle-group','combobox']){
  await resetBrowser();await navigate(`${baseURL}/components/${slug}/`);await audit();
  for(const preset of ['cb-ui','hui','portfolio']){await page.evaluate(preset=>document.querySelector('[data-docs-preview]').dataset.system=preset,preset);await audit();}
  await page.evaluate(()=>{document.querySelector('[data-docs-preview]').dataset.system='dmf';document.documentElement.dataset.theme='dark';});await audit();
  await mobile();await page.evaluate(()=>{document.querySelector('[data-docs-preview]').dir='rtl';document.documentElement.style.fontSize='175%';});await settle();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=390),`${slug}: enlarged mobile RTL overflow`);await audit();
  if(slug==='combobox'){await page.focus(input);await page.keyboard.press('ArrowDown');await audit('[data-combobox-demo] > [data-slot=combobox]');assert(await page.evaluate(()=>{const r=document.querySelector('[data-combobox-popup]:not([hidden])').getBoundingClientRect();const input=document.querySelector('#docs-combobox-component').getBoundingClientRect();const header=document.querySelector('.docs-header').getBoundingClientRect();const valid=r.left>=0&&r.right<=390&&r.top>=header.bottom&&r.bottom<=innerHeight&&input.top>=header.bottom&&input.bottom<=innerHeight;if(!valid)throw Error(JSON.stringify({popup:r.toJSON(),input:input.toJSON(),header:header.toJSON(),innerHeight}));return valid;}),'Popup or input escaped the usable viewport');}
  await page.screenshot({path:`/tmp/dmf-ui-${slug}-mobile.png`});
 }
 await resetBrowser();await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'forced-colors',value:'active'},{name:'prefers-reduced-motion',value:'reduce'}]});await navigate(`${baseURL}/components/combobox/`);await page.focus(input);await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');assert(await page.evaluate(()=>document.querySelector('#docs-combobox-component').value==='Button'),'Forced-colors selection failed');await page.screenshot({path:'/tmp/dmf-ui-combobox-forced-colors.png'});await navigate(`${baseURL}/components/toggle/`);await page.focus('[data-example-presentation=label] [data-dmf-toggle]');await page.keyboard.press('Space');assert(await page.evaluate(()=>document.querySelector('[data-example-presentation=label] [data-dmf-toggle]').getAttribute('aria-pressed')==='true'),'Forced-colors toggle failed');
 await resetBrowser();console.log('PASS native disclosures, stable-name Toggle presentations, single/multiple groups, combobox filtering/manual commit/Escape/Tab/clear/required/disabled/reset/FormData, four presets, dark/mobile RTL and scoped axe');
}
