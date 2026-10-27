import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,settle,opened,focused,mobile,tap}){
 const assert=(value,message)=>{if(!value)throw new Error(message);};
 const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');const reports=[];
 async function audit(state){
  await settle();await page.evaluate(source=>{if(window.axe)return;const script=document.createElement('script');script.textContent=source;document.head.append(script);},axe);
  const result=await page.evaluate(async()=>{const result=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}});return {violations:result.violations.map(({id,impact,nodes})=>({id,impact,nodes:nodes.map(({target,failureSummary})=>({target,failureSummary}))})),incomplete:result.incomplete.map(({id})=>id),incompleteDetails:result.incomplete.map(({id,nodes})=>({id,nodes:nodes.map(({target,failureSummary})=>({target,failureSummary}))}))};});
  const decorativeReviews=[];for(const rule of result.incompleteDetails){assert(rule.id==='color-contrast',JSON.stringify(rule));for(const node of rule.nodes){assert(node.failureSummary.includes('due to a background image'),JSON.stringify(node));const review=await page.evaluate(async target=>{const element=document.querySelector(target.join(' '));if(!element?.matches('select[data-contract-preset],select[data-contract-mode]'))return {verified:false};const style=getComputedStyle(element),image=style.backgroundImage,padding=parseFloat(style.paddingInlineEnd),icon=parseFloat(style.backgroundSize);if(!image.startsWith('url("data:image/svg+xml,')||!Number.isFinite(icon)||padding<icon*2)return {verified:false};const previous=element.style.backgroundImage;try{element.style.backgroundImage='none';const check=await window.axe.run(element,{runOnly:['color-contrast']});return {verified:!check.violations.length&&!check.incomplete.length,padding,icon,violations:check.violations.length,incomplete:check.incomplete.length};}finally{element.style.backgroundImage=previous;}},node.target);assert(review.verified,JSON.stringify({node,review}));decorativeReviews.push({target:node.target,...review});}}reports.push({state,...result,decorativeReviews});await writeFile(new URL('../../.dmf-ui-test-results/documentation-audit.json',import.meta.url),JSON.stringify(reports,null,2));
  assert(!result.violations.length,`${state}: ${JSON.stringify(result)}`);
 }
 async function follow(selector,path){await page.focus(selector);await page.keyboard.press('Enter');await page.waitForURL(`${baseURL}${path}`);await settle();}
 await navigate(`${baseURL}/`);
 assert(await page.evaluate(()=>[...document.querySelectorAll('.docs-primary a')].map(a=>a.textContent).join(',')==='Home,Components,Blocks,Examples,Docs,Create'),'Primary documentation navigation missing');
 assert(await page.evaluate(()=>document.querySelector('.docs-header .docs-github').href==='https://github.com/dmfeisal/dmf-ui'&&document.querySelector('#docs-theme [data-theme-icon]:not([hidden])').dataset.themeIcon==='system'),'Header GitHub link or initial theme icon missing');
 await audit('Home light/system');
 assert(await page.evaluate(()=>!document.querySelector('#docs-theme [data-theme-label]')&&document.querySelector('.docs-github svg')&&document.querySelector('[data-github-stars]')),'Compact header markup missing');
 await page.focus('.docs-github');await page.keyboard.press('Tab');await page.waitForFunction(()=>{const tooltip=document.querySelector('#docs-theme-tooltip [data-slot=tooltip-content]');return tooltip&&!tooltip.hidden;});
 assert(await page.evaluate(()=>document.querySelector('[data-theme-description]').textContent==='Theme: System. Switch to Light.'),'Theme tooltip missing');await audit('Header theme tooltip');await page.keyboard.press('Escape');await focused('docs-theme');
 console.log(await page.screenshot({path:'/tmp/dmf-ui-documentation-home.png'}));
 await page.focus('#docs-theme');await page.keyboard.press('Enter');await page.keyboard.press('Enter');
 assert(await page.evaluate(()=>document.documentElement.dataset.theme==='dark'),'Documentation dark theme failed');assert(await page.evaluate(()=>document.querySelector('#docs-theme [data-theme-icon]:not([hidden])').dataset.themeIcon==='dark'&&document.querySelector('#docs-theme').getAttribute('aria-label')==='Theme: Dark'),'Theme icon/name did not update');await audit('Home dark');
 await follow('.docs-primary a[href="/components/"]','/components/');
 await page.fill('#component-search','tooltip');
 assert(await page.evaluate(()=>document.querySelectorAll('[data-component-entry]:not([hidden])').length===1&&document.getElementById('component-count').textContent==='1 component'),'Component search failed');
 await page.fill('#component-search','no-such-component');assert(await page.evaluate(()=>!document.getElementById('component-empty').hidden),'Search empty state missing');
 await page.fill('#component-search','');await audit('Component catalog');
 await follow('#component-catalog a[href="/components/accordion/"]','/components/accordion/');
 await page.focus('#docs-accordion-dmf [data-value=customization] [data-slot=accordion-trigger]');await page.keyboard.press('Enter');
 assert(await page.evaluate(()=>document.querySelector('#docs-accordion-dmf [data-value=customization] [data-slot=accordion-trigger]').getAttribute('aria-expanded')==='true'),'Documentation live Accordion failed');await audit('Accordion detail');

 // Exercise every scripted preview, not just the shared integration page.
 await navigate(`${baseURL}/components/button/`);await page.click('[data-docs-action=Continue]');
 assert(await page.evaluate(()=>document.querySelector('[data-docs-feedback]').textContent.startsWith('Continue selected.')),'Button preview has no feedback');
 await page.click('[data-docs-action=Cancel]');assert(await page.evaluate(()=>document.querySelector('[data-docs-feedback]').textContent.startsWith('Cancel selected.')),'Cancel preview has no feedback');
 await navigate(`${baseURL}/components/checkbox/`);await page.click('label[for=docs-checkbox-dmf]');assert(await page.evaluate(()=>document.getElementById('docs-checkbox-dmf').checked),'Checkbox label activation failed');
 await navigate(`${baseURL}/components/switch/`);await page.focus('#docs-switch-dmf');await page.keyboard.press('Space');assert(await page.evaluate(()=>document.getElementById('docs-switch-dmf').getAttribute('aria-checked')==='false'),'Switch keyboard interaction failed');
 await page.click('label[for=docs-switch-dmf]');assert(await page.evaluate(()=>document.getElementById('docs-switch-dmf').getAttribute('aria-checked')==='true'),'Switch label interaction failed');
 await navigate(`${baseURL}/components/radio-group/`);await page.focus('#docs-radio-group-dmf-weekly');await page.keyboard.press('ArrowDown');assert(await page.evaluate(()=>document.getElementById('docs-radio-group-dmf-monthly').getAttribute('aria-checked')==='true'),'Radio keyboard selection failed');
 await navigate(`${baseURL}/components/select/`);await page.click('#docs-select-dmf');await opened('[data-slot=select-content]');await page.click('[data-slot=select-item][data-value=digest]');assert(await page.evaluate(()=>document.getElementById('docs-select-dmf').textContent.includes('Digest')),'Select choice did not commit');
 await navigate(`${baseURL}/components/tabs/`);await page.focus('#docs-tabs-dmf [data-slot=tabs-trigger][data-value=overview]');await page.keyboard.press('ArrowRight');assert(await page.evaluate(()=>document.querySelector('#docs-tabs-dmf [data-slot=tabs-trigger][data-value=details]').getAttribute('aria-selected')==='true'),'Tabs keyboard interaction failed');
 await navigate(`${baseURL}/components/dialog/`);await page.click('[data-slot=dialog-trigger]');await opened('[data-slot=dialog-content]');await page.keyboard.press('Escape');await settle();assert(await page.evaluate(()=>document.querySelector('[data-dmf-dialog]').dataset.state==='closed'&&document.activeElement.dataset.slot==='dialog-trigger'),'Dialog dismissal/focus return failed');
 await navigate(`${baseURL}/components/popover/`);await page.click('[data-slot=popover-trigger]');await opened('[data-slot=popover-content]');await page.click('[data-slot=popover-close]');await settle();assert(await page.evaluate(()=>document.querySelector('[data-dmf-popover]').dataset.state==='closed'),'Popover Done failed');
 await navigate(`${baseURL}/components/dropdown-menu/`);await page.click('[data-slot=dropdown-menu-trigger]');await opened('[data-slot=dropdown-menu-content]');await page.click('[data-slot=dropdown-menu-item][data-value=preview]');assert(await page.evaluate(()=>document.querySelector('[data-docs-feedback]').textContent.startsWith('Preview selection selected.')),'Menu action has no local result');
 await navigate(`${baseURL}/components/toast/`);await page.click('[data-docs-toast-show]');await page.waitForFunction(()=>document.querySelector('[data-slot=toast-item]')?.textContent.includes('Preview complete'));
 await navigate(`${baseURL}/components/tooltip/`);await page.focus('#docs-tooltip-dmf-trigger');await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await opened('#docs-tooltip-dmf-content');await page.keyboard.press('Escape');
 assert(await page.evaluate(()=>document.querySelectorAll('[data-docs-preview]').length===1&&!document.querySelector('[data-system=cb-ui]')),'Component details still include CB reconstruction');
 await follow('.docs-primary a[href="/docs/"]','/docs/');await follow('.docs-entry a[href="/docs/installation/"]','/docs/installation/');
 assert(await page.evaluate(()=>document.querySelector('.docs-sidebar a[aria-current=page]')?.textContent==='Installation'&&document.querySelector('main pre')?.textContent.includes('git clone')),'Guide navigation or installation content missing');await audit('Installation guide');
 await navigate(`${baseURL}/components/tooltip/`);await mobile();await tap('.docs-mobile-navigation > summary');
 assert(await page.evaluate(()=>document.querySelector('.docs-mobile-navigation').open&&document.documentElement.clientWidth===390&&document.documentElement.scrollWidth<=390),'Mobile section navigation or width failed');
 await tap('.docs-mobile-navigation > summary');
 await page.evaluate(()=>{document.getElementById('docs-tooltip-dmf-trigger').scrollIntoView({block:'center',behavior:'instant'});document.getElementById('docs-tooltip-dmf-trigger').focus({preventScroll:true});});
 await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await opened('#docs-tooltip-dmf-content');
 const bounds=await page.evaluate(()=>{const r=document.getElementById('docs-tooltip-dmf-content').getBoundingClientRect();return {left:r.left,right:r.right,width:document.documentElement.clientWidth};});
 assert(bounds.width===390&&bounds.left>=0&&bounds.right<=391,JSON.stringify(bounds));
 await audit('Mobile Tooltip detail');console.log(await page.screenshot({path:'/tmp/dmf-ui-documentation-mobile.png'}));
 await page.cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await page.cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await focused('docs-tooltip-dmf-trigger');
 await page.evaluate(()=>{const code=document.querySelector('.docs-code');code.scrollIntoView({block:'center',behavior:'instant'});code.focus({preventScroll:true});});
 await page.cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await page.cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
 await page.waitForFunction(()=>document.querySelector('.docs-code').scrollLeft>0);
 console.log('PASS documentation navigation/search/empty state, all scripted previews, local action feedback, guides, themes, mobile navigation/containment and seven axe page states');
}
