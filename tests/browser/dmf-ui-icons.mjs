import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,settle,mobile,resetBrowser}){
 const assert=(value,message)=>{if(!value)throw new Error(message);};
 const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
 async function audit(){await settle();await page.evaluate(source=>{if(window.axe)return;const s=document.createElement('script');s.textContent=source;document.head.append(s);},axe);const result=await page.evaluate(async()=>{const r=await window.axe.run();return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.failureSummary)})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))};});assert(!result.violations.length&&!result.incomplete.length,JSON.stringify(result));}
 await resetBrowser();await navigate(`${baseURL}/docs/icons/`);await audit();
 assert(await page.evaluate(()=>document.querySelectorAll('[data-icon-name] svg').length===36),'Missing rendered SVG icons');
 await page.fill('#icon-search','food restaurant');assert(await page.evaluate(()=>document.querySelectorAll('[data-icon-name]:not([hidden])').length===1&&document.querySelector('[data-icon-name=Utensils]').hidden===false),'Purpose search did not match all terms');
 await page.focus('[data-icon-name=Utensils]');await page.keyboard.press('Enter');
 await page.selectOption('#icon-size','32');await page.selectOption('#icon-stroke','1.5');
 assert(await page.evaluate(()=>document.querySelector('[data-icon-name=Utensils]').getAttribute('aria-pressed')==='true'&&document.querySelector('[data-icon-name=Utensils] svg').getAttribute('width')==='32'&&document.querySelector('[data-icon-name=Utensils] svg').getAttribute('stroke-width')==='1.5'&&document.querySelector('#icon-example code').textContent.includes('<Utensils size={32} stroke-width={1.5}')),'Selected icon configuration mismatch');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>window.iconCopied=text}}));await page.click('[data-copy-code=icon-example]');
 assert(await page.evaluate(()=>window.iconCopied===document.querySelector('#icon-example code').textContent&&document.querySelector('#icon-copy-status').textContent==='Code copied.'),'Icon copy mismatch');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Denied');}}}));await page.click('[data-copy-code=icon-example]');assert(await page.evaluate(()=>document.activeElement.id==='icon-example'&&document.querySelector('#icon-copy-status').textContent.includes('Copy unavailable')),'Icon clipboard fallback failed');
 await page.fill('#icon-search','<script>');assert(await page.evaluate(()=>document.querySelector('#icon-count').textContent==='0 icons'&&!document.querySelector('#icon-empty').hidden),'Empty state failed');
 await page.fill('#icon-search','');await page.click('#docs-theme');await page.click('#docs-theme');await audit();
 await page.screenshot({path:'/tmp/dmf-ui-icons-desktop.png'});
 await mobile();await audit();for(const fontSize of ['87.5%','175%']){await page.evaluate(size=>document.documentElement.style.fontSize=size,fontSize);await settle();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=390),'Icon mobile overflow');}
 await page.evaluate(()=>document.querySelector('#icon-gallery').scrollIntoView({block:'start',behavior:'instant'}));await page.screenshot({path:'/tmp/dmf-ui-icons-mobile.png'});
 await page.fill('#icon-search','receipt');await page.focus('[data-icon-name=Receipt]');await page.keyboard.press('Space');assert(await page.evaluate(()=>document.querySelector('#icon-example-title').textContent==='Use Receipt'),'Space selection failed');
 await resetBrowser();console.log('PASS 36 SVGs, purpose search/empty/reset, keyboard selection, size/stroke, copy/fallback, light/dark/mobile axe and enlarged-text containment');
}
