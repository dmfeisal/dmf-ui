import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,settle,mobile,resetBrowser}){
 const assert=(value,message)=>{if(!value)throw Error(message);};
 const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8'),reports=[];
 async function audit(state,selector='document',knownPreset=false){
  await settle();await page.evaluate(source=>{if(window.axe)return;const script=document.createElement('script');script.textContent=source;document.head.append(script);},axe);
  const result=await page.evaluate(async selector=>{const r=await window.axe.run(selector==='document'?document:document.querySelector(selector),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}});return {violations:r.violations.map(({id,nodes})=>({id,nodes:nodes.map(({target,failureSummary})=>({target,failureSummary}))})),incomplete:r.incomplete.map(({id,nodes})=>({id,nodes:nodes.map(({target})=>target)}))};},selector);
  reports.push({state,knownPreset,...result});await writeFile(new URL('../../.dmf-ui-test-results/nova-docs-audit.json',import.meta.url),JSON.stringify(reports,null,2));
  if(knownPreset){assert(result.violations.every(rule=>rule.id==='color-contrast'),JSON.stringify({state,result}));for(const rule of result.violations)for(const node of rule.nodes)assert(await page.evaluate(target=>{const e=document.querySelector(target.join(' '));return !!e?.closest('[data-variant="default"]');},node.target),'Unexpected preset contrast node');}
  else assert(!result.violations.length,JSON.stringify({state,result}));
 }
 await resetBrowser();await navigate(`${baseURL}/components/code-block/`);
 assert(await page.evaluate(()=>document.body.dataset.designStyle==='nova'&&document.body.dataset.baseColor==='neutral'&&document.body.dataset.themeColor==='neutral'),'Missing default design profile');
 for(const width of [1440,1024,390]){await page.cdp('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===390});await settle();assert(await page.evaluate(()=>['#docs-search-trigger','.docs-github','#docs-theme'].every(selector=>Math.abs(document.querySelector(selector).getBoundingClientRect().height-32)<.1)),'Header control heights differ from 32px');}
 await resetBrowser();
 const example='[data-fulldev-preview="code-block"] .dmf-code-snippet[data-language="ts"]';
 assert(await page.evaluate(selector=>{const root=document.querySelector(selector);return root.querySelectorAll('[data-code-line]').length===2&&root.querySelector('[data-code-line="1"]').hasAttribute('data-highlighted')&&root.querySelector('pre code span[style]');},example),'Missing highlighted, numbered source');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.novaCopied=value;}}}));
 await page.click(example+' [data-code-copy]');await page.waitForFunction(()=>window.novaCopied==='const ready = true;\nexport { ready };');
 assert(await page.evaluate(selector=>document.querySelector(selector+' [data-code-copy]').getAttribute('aria-label')==='Copy code',example),'Copy name must stay stable');
 await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw Error('Denied');};});await page.click(example+' [data-code-copy]');await page.waitForFunction(()=>document.activeElement?.getAttribute('data-slot')==='code-block-content');assert(await page.evaluate(()=>getSelection().toString()==='const ready = true;\nexport { ready };'),'Manual copy selection differs from source');await audit('Code Block light');await page.selectOption('[data-contract-mode]','dark');await audit('Code Block scoped dark preview');await page.selectOption('[data-contract-mode]','inherit');
 await page.evaluate(()=>document.documentElement.dataset.theme='dark');await audit('Code Block dark');
 await mobile();await page.evaluate(()=>{document.documentElement.dir='rtl';document.documentElement.style.fontSize='200%';});await audit('Code Block dark enlarged RTL');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),'Code page overflow');await page.evaluate(selector=>document.querySelector(selector).scrollIntoView({block:'start',behavior:'instant'}),example);await settle();await page.screenshot({path:'/tmp/dmf-nova-code-mobile.png'});
 await resetBrowser();await navigate(`${baseURL}/components/code-tabs/`);await page.focus('[data-docs-preview] [role=tab][data-value="astro"]');await page.keyboard.press('ArrowRight');await settle();assert(await page.evaluate(()=>document.querySelector('[data-docs-preview] [role=tab][aria-selected=true]').textContent.trim()==='React'),'Code tabs keyboard selection');await audit('Code Tabs active React');
 await navigate(`${baseURL}/components/command-block/`);await page.click('[data-docs-preview] [role=tab][data-value="pnpm"]');await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.novaCopied=value;}}}));await page.click('[data-docs-preview] [data-slot=tabs-content]:not([hidden]) [data-code-copy]');await page.waitForFunction(()=>window.novaCopied==='pnpm add @lucide/astro');await audit('Command Block pnpm');
 await navigate(`${baseURL}/components/button/`);
 for(const preset of ['cb-ui','hui']){await page.selectOption('[data-contract-preset]',preset);await page.cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0});await settle();assert(await page.evaluate(()=>getComputedStyle(document.querySelector('[data-docs-preview] [data-slot=button][data-variant=default]')).color==='rgb(255, 255, 255)'),preset+' primary text is not white');await audit(preset+' owner-selected white primary labels','[data-docs-preview]',true);}
 await navigate(`${baseURL}/docs/design-profile/`);await audit('Design profile guide');await page.screenshot({path:'/tmp/dmf-nova-profile.png'});
 await navigate(`${baseURL}/components/code-block/`);await page.screenshot({path:'/tmp/dmf-nova-code-desktop.png'});
 console.log('PASS Nova/Neutral metadata, 32px header tools, highlighted/numbered/wrapped code, exact copy/fallback, Code Tabs, Command Block, themes and enlarged RTL; preset contrast exceptions retained.');
}
