import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,settle,mobile,resetBrowser}){
 const assert=(value,message)=>{if(!value)throw new Error(message);};
 const reports=[];const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
 async function audit(state){await settle();await page.evaluate(source=>{if(!window.axe){const script=document.createElement('script');script.textContent=source;document.head.append(script);}},axe);const result=await page.evaluate(async()=>{const r=await window.axe.run();return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>v.id)};});reports.push({state,...result});await writeFile(new URL('../../.dmf-ui-test-results/create-audit.json',import.meta.url),JSON.stringify(reports,null,2));assert(!result.violations.length,JSON.stringify(result.violations));}
 await navigate(`${baseURL}/create/`);await audit('Default');
 await page.selectOption('#preset-accent','violet');await page.selectOption('#preset-radius','large');await page.selectOption('#preset-font','nunito');await page.selectOption('#preset-mode','dark');
 assert(await page.evaluate(()=>document.getElementById('preset-code').textContent.includes('--primary: #6d28d9')&&getComputedStyle(document.getElementById('preset-surface')).getPropertyValue('--radius').trim()==='1rem'&&getComputedStyle(document.getElementById('preset-surface')).fontFamily.includes('DMF CB Nunito')),'Custom tokens did not apply');
 await audit('Custom dark');
 await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.copiedPreset=text;}}});});
 await page.focus('#preset-copy');await page.keyboard.press('Enter');
 assert(await page.evaluate(()=>window.copiedPreset===document.getElementById('preset-code').textContent&&document.getElementById('preset-status').textContent==='CSS copied.'),'CSS copy mismatch');
 await page.focus('#preset-link');await page.keyboard.press('Enter');
 assert(await page.evaluate(()=>window.copiedPreset===location.href),'Share link mismatch');
 const share=await page.url();await page.reload();await settle();assert(await page.evaluate(()=>document.getElementById('preset-radius').value==='large'&&document.getElementById('preset-mode').value==='dark'),'Shared settings did not restore');
 const pending=page.waitForEvent('download',{timeout:10000});await page.focus('#preset-download');await page.keyboard.press('Enter');const download=await pending;await download.saveAs('/tmp/dmf-ui-create-preset.json');
 const preset=JSON.parse(await readFile('/tmp/dmf-ui-create-preset.json','utf8'));assert(preset.platform==='astro'&&preset.accent==='violet'&&preset.css.includes('--primary: #6d28d9'),'Downloaded preset mismatch');
 await page.selectOption('#preset-system','cb-ui');
 assert(await page.evaluate(()=>document.getElementById('preset-accent').disabled&&document.getElementById('preset-mode').disabled&&document.getElementById('preset-mode').value==='light'&&getComputedStyle(document.getElementById('preset-surface')).getPropertyValue('--dmf-cb-ui-color-primary').trim()==='#26ade4'&&!document.getElementById('preset-code').textContent.includes('--primary:')),'CB foundation restrictions failed');
 await page.selectOption('#preset-direction','rtl');await audit('CB RTL');
 await page.focus('#preview-updates');await page.keyboard.press('Space');assert(await page.evaluate(()=>document.getElementById('preview-updates').getAttribute('aria-checked')==='false'),'Live Switch failed');
 await page.focus('#create-preview-tabs [data-value=team]');await page.keyboard.press('Enter');assert(await page.evaluate(()=>document.querySelector('#create-preview-tabs [role=tab][data-value=team]').getAttribute('aria-selected')==='true'),'Live Tabs failed');
 await page.focus('#preset-controls button[type=reset]');await page.keyboard.press('Enter');await settle();assert(await page.evaluate(()=>!location.search&&document.getElementById('preset-system').value==='dmf'&&!document.getElementById('preset-accent').disabled),'Reset failed');
 await navigate(`${baseURL}/create/?system=invalid&accent=%3Cscript%3E&radius=oops&mode=invalid`);assert(await page.evaluate(()=>!location.search&&document.getElementById('preset-system').value==='dmf'),'Invalid query was not normalized');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Denied');}}}));await page.focus('#preset-copy');await page.keyboard.press('Enter');assert(await page.evaluate(()=>document.getElementById('preset-status').textContent.includes('Copy unavailable')&&document.activeElement.classList.contains('docs-code')),'Clipboard failure fallback missing');
 await page.selectOption('#preset-direction','rtl');await mobile();await audit('Mobile RTL');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=390),'Mobile horizontal overflow');
 await page.evaluate(()=>document.getElementById('preset-preview').scrollIntoView({block:'start',behavior:'instant'}));console.log(await page.screenshot({path:'/tmp/dmf-ui-create-mobile.png'}));
 await resetBrowser();await navigate(share);console.log(await page.screenshot({path:'/tmp/dmf-ui-create-desktop.png'}));
 console.log('PASS Create presets, tokens, shared URL restoration, JSON download, copy/fallback, reset, live controls, mobile RTL and four axe states');
}
