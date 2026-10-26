import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,settle,mobile,resetBrowser}){
 const assert=(value,message)=>{if(!value)throw new Error(message);};
 const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8'),audits=[];
 async function audit(){
  await settle();await page.evaluate(source=>{if(window.axe)return;const script=document.createElement('script');script.textContent=source;document.head.append(script);},axe);
  const result=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}});return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.failureSummary)})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))};});
  const overlapReviews=[];
  for(const rule of result.incomplete){
   assert(rule.id==='color-contrast'&&rule.nodes.every(node=>node.summary?.includes('partially overlaps')),JSON.stringify(result));
   for(const node of rule.nodes){const measured=await page.evaluate(target=>{const element=document.querySelector(target.join(' '));if(!element)throw Error('Missing contrast review target');const style=getComputedStyle(element),canvas=document.createElement('canvas');canvas.width=canvas.height=1;const context=canvas.getContext('2d',{willReadFrequently:true});const read=color=>{context.clearRect(0,0,1,1);context.fillStyle=color;context.fillRect(0,0,1,1);return [...context.getImageData(0,0,1,1).data];};const fg=read(style.color),bg=read(style.backgroundColor);let opaque=true;for(let parent=element;parent;parent=parent.parentElement)if(Number(getComputedStyle(parent).opacity)!==1)opaque=false;const luminance=rgba=>rgba.slice(0,3).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);const a=luminance(fg),b=luminance(bg);return {foreground:style.color,background:style.backgroundColor,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),opaque:opaque&&fg[3]===255&&bg[3]===255};},node.target);assert(measured.opaque&&measured.ratio>=4.5,JSON.stringify({node,measured}));overlapReviews.push({target:node.target,...measured});}
  }
  await writeFile(new URL('../../.dmf-ui-test-results/search-audit.json',import.meta.url),JSON.stringify(audits.push({result,overlapReviews})&&audits,null,2));
  assert(!result.violations.length,JSON.stringify(result));
 }
 await resetBrowser();await navigate(`${baseURL}/components/button/`);
 assert(await page.evaluate(()=>document.querySelectorAll('.docs-sidebar .docs-nav-group').length>1),'Component navigation is not grouped');
 await page.click('#docs-search-trigger');
 assert(await page.evaluate(()=>document.querySelector('#docs-search-dialog').open&&document.activeElement.id==='docs-search-input'),'Search did not open with input focus');
 await page.fill('#docs-search-input','no-such-page');assert(await page.evaluate(()=>document.querySelector('#docs-search-count').textContent==='0 results'&&document.querySelector('.docs-search-empty')),'Search empty state missing');
 await audit();await page.fill('#docs-search-input','radio group');await audit();await page.screenshot({path:'/tmp/dmf-ui-search-desktop.png'});await page.evaluate(()=>document.documentElement.dataset.theme='dark');await audit();await page.evaluate(()=>document.documentElement.dataset.theme='light');assert(await page.evaluate(()=>!!document.querySelector('#docs-search-results a[href="/components/radio-group/"]')),'Multiword search missed Radio Group');
 await page.fill('#docs-search-input','switch');await page.keyboard.press('ArrowDown');
 assert(await page.evaluate(()=>document.activeElement.getAttribute('href')==='/components/switch/'),'Search ArrowDown did not select the matching native link');
 await page.keyboard.press('Enter');await page.waitForURL(`${baseURL}/components/switch/`);await settle();
 await page.focus('#docs-search-trigger');await page.keyboard.press('Control+k');
 await page.fill('#docs-search-input','installation');assert(await page.evaluate(()=>!!document.querySelector('#docs-search-results a[href="/docs/installation/"]')),'Guide search missing');
 await page.keyboard.press('Escape');await settle();assert(await page.evaluate(()=>!document.querySelector('#docs-search-dialog').open&&document.activeElement.id==='docs-search-trigger'),'Search Escape/focus return failed');
 await page.keyboard.press('/');await page.fill('#docs-search-input','preset export');assert(await page.evaluate(()=>!!document.querySelector('#docs-search-results a[href="/create/"]')),'Create search missing');
 await page.fill('#docs-search-input','<script>alert(1)</script>');assert(await page.evaluate(()=>!document.querySelector('#docs-search-results script')&&document.querySelector('#docs-search-count').textContent==='0 results'),'Search text was interpreted as markup');
 await page.keyboard.press('Escape');
 await navigate(`${baseURL}/components/input/`);await page.focus('#docs-input-dmf');await page.keyboard.press('/');
 assert(await page.evaluate(()=>document.getElementById('docs-input-dmf').value==='/'&&!document.querySelector('#docs-search-dialog').open),'Slash shortcut intercepted text entry');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.searchCopied=text;}}}));
 await page.click('[data-copy-code]');assert(await page.evaluate(()=>window.searchCopied===document.querySelector('#usage-input code').textContent&&document.querySelector('#copy-input').textContent==='Code copied.'),'Usage copy mismatch');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Denied');}}}));
 await page.click('[data-copy-code]');assert(await page.evaluate(()=>document.activeElement.id==='usage-input'&&document.querySelector('#copy-input').textContent.includes('Copy unavailable')),'Copy fallback failed');
 await mobile();await page.click('#docs-search-trigger');await page.fill('#docs-search-input','field');await audit();
 for(const size of ['87.5%','175%']){
  await page.evaluate(size=>document.documentElement.style.fontSize=size,size);await settle();
  assert(await page.evaluate(()=>{const r=document.querySelector('#docs-search-dialog').getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&document.documentElement.scrollWidth<=390;}),'Mobile search overflow');
 }
 await page.screenshot({path:'/tmp/dmf-ui-search-mobile.png'});
 await page.keyboard.press('Escape');await resetBrowser();
 console.log('PASS global search: component/guide/Create results, shortcuts, keyboard navigation, Escape/focus return, safe empty states, copy/fallback and enlarged mobile containment');
}
