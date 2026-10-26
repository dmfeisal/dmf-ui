import {readFile,writeFile} from 'node:fs/promises';
import {reviewNativeDropdowns} from './native-dropdown-contrast.mjs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,settle,mobile,resetBrowser}){
 const assert=(v,m)=>{if(!v)throw Error(m);};const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
 const reports=[];
 async function audit(){await settle();await page.evaluate(source=>{if(window.axe)return;const s=document.createElement('script');s.textContent=source;document.head.append(s);},axe);const r=await page.evaluate(async()=>{const r=await window.axe.run();return {path:location.pathname,violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))};});const reviews=await reviewNativeDropdowns(page,r);reports.push({...r,reviews});await writeFile(new URL('../../.dmf-ui-test-results/navigation-patterns-audit.json',import.meta.url),JSON.stringify(reports,null,2));assert(!r.violations.length,JSON.stringify(r));}
 await resetBrowser();await navigate(`${baseURL}/components/sidebar/`);
 const sidebar='[data-docs-preview] > [data-slot=sidebar]';
 await page.focus(`${sidebar} a[href="/docs/"]`);await page.keyboard.press('Escape');
 assert(await page.evaluate(()=>{const root=document.querySelector('[data-docs-preview] > [data-slot=sidebar]');return !root.querySelector('details').open&&document.activeElement===root.querySelector('summary')&&document.querySelector('[data-example-presentation=label] details').open;}),'Sidebar close/focus/independence failed');
 await page.keyboard.press('Enter');assert(await page.evaluate(()=>document.querySelector('[data-docs-preview] > [data-slot=sidebar] details').open),'Sidebar native reopen failed');
 await audit();await page.screenshot({path:'/tmp/dmf-ui-sidebar-desktop.png'});
 await navigate(`${baseURL}/components/responsive-navigation/`);await mobile();
 const responsive='[data-docs-preview] > [data-slot=responsive-navigation]';
 await page.focus(`${responsive} summary`);await page.keyboard.press('Space');
 assert(await page.evaluate(()=>document.querySelector('[data-docs-preview] > [data-slot=responsive-navigation] details').open),'Mobile menu did not open');await audit();
 await page.focus(`${responsive} .dmf-responsive-mobile a[href="/docs/"]`);await page.keyboard.press('Escape');
 assert(await page.evaluate(()=>{const root=document.querySelector('[data-docs-preview] > [data-slot=responsive-navigation]');return !root.querySelector('details').open&&document.activeElement===root.querySelector('summary');}),'Mobile menu Escape/focus failed');
 await page.keyboard.press('Enter');await page.focus(`${responsive} .dmf-responsive-mobile a[href="/docs/"]`);await page.keyboard.press('Enter');await page.waitForURL(`${baseURL}/docs/`);
 await resetBrowser();
 for(const slug of ['navigation-menu','breadcrumb','pagination','section-navigation','project-action-bar','sidebar','responsive-navigation','avatar','rating','chip','tag-list','button']){
  await navigate(`${baseURL}/components/${slug}/`);assert(await page.evaluate(()=>document.querySelectorAll('[data-example-presentation]').length===3),'Presentation examples missing');await audit();
  await page.evaluate(()=>document.documentElement.dataset.theme='dark');await audit();
  await mobile();await page.evaluate(()=>document.querySelector('[data-docs-preview]').dir='rtl');await audit();
  for(const size of ['87.5%','175%']){await page.evaluate(size=>document.documentElement.style.fontSize=size,size);await settle();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=390),`${slug}: mobile overflow`);}
  if(slug==='responsive-navigation'){await page.evaluate(()=>{document.querySelector('[data-docs-preview] > [data-slot=responsive-navigation] details').open=true;document.querySelector('[data-docs-preview]').scrollIntoView({block:'start',behavior:'instant'});});await page.screenshot({path:'/tmp/dmf-ui-responsive-navigation-mobile.png'});}
  await resetBrowser();
 }
 await navigate(`${baseURL}/components/navigation-menu/`);
 const iconLink='[data-example-presentation=icon] a[href="/docs/"]';await page.evaluate(selector=>document.querySelector(selector).scrollIntoView({block:'center',behavior:'instant'}),iconLink);await settle();await page.focus(iconLink);await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
 await page.waitForFunction(()=>[...document.querySelectorAll('[data-example-presentation=icon] [data-slot=tooltip-content]')].some(node=>!node.hidden));await audit();
 await page.keyboard.press('Escape');assert(await page.evaluate(()=>document.activeElement.getAttribute('href')==='/docs/'),'Tooltip Escape moved link focus');
 await page.keyboard.press('Enter');await page.waitForURL(`${baseURL}/docs/`);
 await navigate(`${baseURL}/components/chip/`);await page.evaluate(()=>document.querySelector('[data-example-presentation=icon] input').scrollIntoView({block:'center',behavior:'instant'}));await settle();await page.focus('[data-example-presentation=icon] input');await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await page.waitForFunction(()=>[...document.querySelectorAll('[data-example-presentation=icon] [data-slot=tooltip-content]')].some(node=>!node.hidden));await page.screenshot({path:'/tmp/dmf-chip-full-flow.png'});await audit();await page.keyboard.press('Space');assert(await page.evaluate(()=>document.querySelector('[data-example-presentation=icon] input').checked),'Icon Chip Space failed');await audit();
 await navigate(`${baseURL}/components/rating/`);await page.focus('[data-example-presentation=icon] input[value="3"]');await page.keyboard.press('ArrowRight');assert(await page.evaluate(()=>document.querySelector('[data-example-presentation=icon] input:checked').value==='4'),'Icon Rating native arrow failed');await audit();
 await resetBrowser();console.log('PASS Sidebar independence/Escape, mobile disclosure/native links, three presentations on 12 pages, icon link/Chip/Rating semantics, open tooltip axe and 200% RTL containment');
}
