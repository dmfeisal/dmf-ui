import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,settle,resetBrowser,mobile,click}){
 const assert=(v,m)=>{if(!v)throw Error(m);},reports=[],axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
 async function audit(state){await settle();await page.evaluate(source=>{if(window.axe)return;const s=document.createElement('script');s.textContent=source;document.head.append(s);},axe);
  const result=await page.evaluate(async()=>{const r=await window.axe.run(document.querySelector('[data-docs-preview]'));return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary})),ownerPrimaryOnly:v.id==='color-contrast'&&v.nodes.every(n=>{if(n.target.length!==1)return false;const e=document.querySelector(n.target[0]),b=e?.closest('[data-block-submit]');return b?.classList.contains('bg-primary')&&b.classList.contains('text-primary-foreground')&&['cb-ui','hui'].includes(b.closest('.dmf-ui')?.dataset.system);})})),incomplete:r.incomplete.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))};});reports.push({state,...result});await writeFile(new URL('../../.dmf-ui-test-results/blocks-audit.json',import.meta.url),JSON.stringify(reports,null,2));assert(result.violations.every(v=>v.ownerPrimaryOnly),JSON.stringify({state,...result}));
 }
 await navigate(`${baseURL}/blocks/sign-in/`);
 await click('#block-sign-in [data-block-submit]');assert(await page.evaluate(()=>document.activeElement.id==='block-sign-in-email'),'Required email focus');
 await page.fill('#block-sign-in-email','reader@example.test');await click('#block-sign-in [data-block-submit]');assert(await page.evaluate(()=>document.activeElement.id==='block-sign-in-password'),'Required password focus');
 await page.fill('#block-sign-in-password','test-only-password');
 assert(await page.evaluate(()=>{const f=document.querySelector('#block-sign-in'),d=new FormData(f);return d.has('email')&&d.has('password')&&f.method==='post'&&f.checkValidity();}),'Native sign-in values/method');
 await page.focus('#block-sign-in [data-block-submit]');await page.keyboard.press('Enter');assert(await page.evaluate(()=>document.querySelector('#block-sign-in fieldset').disabled&&document.querySelector('#block-sign-in [aria-busy=true]')&&document.querySelector('[data-block-demo-status]').textContent.includes('not read')),'Keyboard submit/host pending/transport boundary');await audit('Sign-in pending');
 await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});assert(await page.evaluate(()=>getComputedStyle(document.querySelector('#block-sign-in .dmf-loading-spinner')).animationName==='none'),'Pending Block reduced motion');
 await click('[data-block-finish]');assert(await page.evaluate(()=>!document.querySelector('#block-sign-in fieldset').disabled&&document.querySelector('#block-sign-in-disabled fieldset').disabled),'Disabled instance independence');
 await click('[data-block-error]');await audit('Sign-in host error');
 assert(await page.evaluate(()=>!!document.querySelector('#block-sign-in [data-slot=card-footer] a[href="/docs/installation/"]')),'Auth footer slot');
 await navigate(`${baseURL}/blocks/search-filters/`);await click('#block-search [data-block-submit]');assert(await page.evaluate(()=>document.activeElement.id==='block-search-query'),'Required search focus');
 await page.fill('#block-search-query','buttons');await page.selectOption('#block-search-choice','forms');
 assert(await page.evaluate(()=>{const d=new FormData(document.querySelector('#block-search'));return d.get('q')==='buttons'&&d.get('category')==='forms'&&d.get('available')==='yes'&&!d.has('archived');}),'Search FormData');
 await page.focus('#block-search [data-block-submit]');await page.keyboard.press('Enter');assert(await page.evaluate(()=>document.querySelector('#block-search fieldset').disabled&&!document.querySelector('#block-search-secondary fieldset').disabled),'Keyboard submit/independent pending');await click('[data-block-finish]');
 await click('#block-search button[type=reset]');assert(await page.evaluate(()=>document.querySelector('#block-search-query').value===''&&document.querySelector('#block-search-secondary-query').value==='initial'&&document.querySelector('#block-search-secondary-choice').value==='navigation'),'Authored reset/customization');
 assert(await page.evaluate(()=>new FormData(document.querySelector('#block-search-secondary')).get('scope')==='docs'),'Custom filters slot native value');
 for(const slug of ['sign-in','search-filters']){
  await resetBrowser();await navigate(`${baseURL}/blocks/${slug}/`);await audit(slug+' DMF light');
  for(const preset of ['cb-ui','hui','qdi','portfolio']){await page.selectOption('[data-contract-preset]',preset);await audit(slug+' '+preset);if(preset==='portfolio'){for(const mode of ['dark','yellow']){await page.evaluate(mode=>document.querySelector('[data-docs-preview]').dataset.colorMode=mode,mode);await audit(slug+' portfolio '+mode);}}}
  await page.selectOption('[data-contract-preset]','dmf');await page.selectOption('[data-contract-mode]','dark');await audit(slug+' DMF dark');
  await mobile();await page.evaluate(()=>{document.documentElement.dir='rtl';document.documentElement.style.fontSize='175%';});await settle();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),'Block RTL overflow '+slug);await audit(slug+' enlarged RTL');
  await page.evaluate(()=>document.querySelector('[data-docs-preview]').scrollIntoView({block:'start',behavior:'instant'}));await page.screenshot({path:`/tmp/dmf-block-${slug}.png`});
 }
 await resetBrowser();await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'forced-colors',value:'active'},{name:'prefers-reduced-motion',value:'reduce'}]});await navigate(`${baseURL}/blocks/search-filters/`);await page.focus('#block-search-filter-0');await page.keyboard.press('Space');assert(await page.evaluate(()=>!document.querySelector('#block-search-filter-0').checked),'Forced-color keyboard checkbox');
 await page.evaluate(()=>{document.dispatchEvent(new Event('astro:page-load'));document.dispatchEvent(new Event('astro:page-load'));});await page.fill('#block-search-query','local');await click('#block-search [data-block-submit]');assert(await page.evaluate(()=>document.querySelector('[data-block-demo-status]').textContent.includes('local')),'Repeated initialization duplicated submission listeners');await click('[data-block-finish]');
 await click('#docs-search-trigger');await page.fill('#docs-search-input','SignInBlock');assert(await page.evaluate(()=>!!document.querySelector('#docs-search-results a[href="/blocks/sign-in/"]')),'Block missing from global search');await page.keyboard.press('Escape');
 await page.cdp('Emulation.setScriptExecutionDisabled',{value:true});
 for(const slug of ['sign-in','search-filters']){await page.goto(`${baseURL}/blocks/${slug}/`);assert(await page.evaluate(()=>[...document.querySelectorAll('[data-block-demo] [data-block-submit]')].every(b=>b.disabled)),'Uninitialized submit exposed');assert(await page.evaluate(()=>[...document.querySelectorAll('[data-block-demo] input')].some(e=>e.required)&&!!document.querySelector('[data-docs-preview] form')),'Native fallback missing');}
 await page.cdp('Emulation.setScriptExecutionDisabled',{value:false});await resetBrowser();
 console.log('PASS Blocks native validation, values, reset, host pending/error, instance independence, four presets, dark/enlarged RTL, keyboard/forced colors, no-JS guards and source composition');
}
