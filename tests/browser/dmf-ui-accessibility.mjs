import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
export async function run({hover,page,baseURL,navigate,settle,opened,focused}) {
  const assert=(condition,message)=>{if(!condition)throw new Error(message);};
  const source=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
  const browser=await page.evaluate(()=>navigator.userAgent);
  const reports=[];
  const file=new URL('../../.dmf-ui-test-results/accessibility-report.json',import.meta.url);
  async function audit(state) {
    await settle();
    const result=await page.evaluate(async()=>{
      const result=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}});
      const compact=items=>items.map(({id,impact,help,helpUrl,tags,nodes})=>({id,impact,help,helpUrl,tags,nodes:nodes.map(({target,failureSummary})=>({target,failureSummary}))}));
      return {violations:compact(result.violations),incomplete:compact(result.incomplete),passes:result.passes.length};
    });
    reports.push({state,...result});
    await writeFile(file,JSON.stringify({engine:'axe-core',version:'4.14.0',browser,reports},null,2));
    console.log(`AUDIT ${state}: ${result.violations.length} violations; ${result.incomplete.length} manual-review rules`);
  }
  await navigate(`${baseURL}/examples/dmf-ui/`);
  await page.waitForSelector('[data-dmf-form="standalone-form-cb-ui"][data-dmf-form-ready=true]');
  await page.evaluate(source=>{const script=document.createElement('script');script.textContent=source;document.head.append(script);},source);
  for(const theme of ['light','dark']) {
    await page.evaluate(theme=>{document.documentElement.dataset.theme=theme;},theme);
    await audit(`${theme}: closed/default (DMF and CB)`);
    for(const system of ['dmf','cb-ui']) {
      const id=`standalone-form-${system}`;
      for(const [name,selector,content] of [
        ['select',`#${id}-channel`,'[data-slot=select-content][data-open]'],
        ['popover',`#${id}-popover-trigger`,'[data-slot=popover-content][data-open]'],
        ['menu',`#${id}-menu-trigger`,'[data-slot=dropdown-menu-content][data-open]'],
      ]) {
        await page.focus(selector);await page.keyboard.press('Space');await opened(content);
        await audit(`${theme}: ${system} ${name} open`);
        await page.keyboard.press('Escape');await focused(selector.slice(1));
      }
    }
    for(const system of ['dmf','cb-ui']) {
      await hover(`[data-system=${system}] > .dmf-pilot-row button[data-variant=default]:not(:disabled)`);
      await audit(`${theme}: ${system} primary hover`);
    }
    for(const system of ['dmf','cb-ui']) {
      const id=`standalone-form-${system}`;
      await page.cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:1,y:1});
      await page.focus(`#${id}-accordion-customization`);
      if(await page.evaluate(id=>document.getElementById(`${id}-accordion-customization`).getAttribute('aria-expanded')==='false',id))await page.keyboard.press('Space');
      await audit(`${theme}: ${system} Accordion open`);
      await page.focus(`#${id}-tooltip-trigger`);await opened(`#${id}-tooltip-content`);
      await audit(`${theme}: ${system} Tooltip open`);
      await page.keyboard.press('Escape');await focused(`${id}-tooltip-trigger`);
    }
    for(const system of ['dmf','cb-ui']) {
      const form=`[data-dmf-form=standalone-form-${system}]`;
      await page.focus(`${form} button[type=submit]`);await page.keyboard.press('Enter');
      await audit(`${theme}: ${system} invalid form`);
      assert(await page.evaluate(form=>document.querySelector(`${form} [aria-invalid=true]`)&&document.querySelector(`${form} [data-form-status]`).getAttribute('role')==='status',form),'Validation semantics missing');
      await page.focus(`${form} button[type=reset]`);await page.keyboard.press('Enter');
    }
    await page.focus('[data-dmf-example=first] [data-slot=dialog-trigger]');await page.keyboard.press('Enter');
    await page.waitForFunction(()=>document.getElementById('first-dialog').contains(document.activeElement));
    await page.focus('#first-dialog [data-slot=dialog-close][aria-label="Close dialog"]');
    await page.keyboard.press('Tab');await focused('first-dialog-name');
    await page.keyboard.press('Shift+Tab');
    assert(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')==='Close dialog'),'Dialog Shift+Tab did not wrap');
    await audit(`${theme}: dialog open`);await page.keyboard.press('Escape');
    await page.waitForFunction(()=>document.getElementById('first-dialog').hidden);
    await page.waitForFunction(()=>document.activeElement?.textContent.trim()==='Open first dialog');
    await page.focus('[data-dmf-example=first] [data-example-notify=success]');await page.keyboard.press('Enter');
    await page.waitForSelector('[data-slot=toast-item]');await audit(`${theme}: notification`);
    const dom=await page.cdp('DOM.getDocument');
    const {nodeId}=await page.cdp('DOM.querySelector',{nodeId:dom.root.nodeId,selector:'#first-toaster [data-slot=toast-item]'});
    const ax=await page.cdp('Accessibility.getPartialAXTree',{nodeId,fetchRelatives:false});
    assert(ax.nodes.some(n=>n.role?.value==='status'&&n.properties?.some(p=>p.name==='live'&&p.value.value==='polite')),'Toast is not exposed as a polite live status');
    await page.focus('#first-toaster [data-slot=toast-close]');await page.keyboard.press('Enter');
    await page.waitForSelector('[data-slot=toast-item]',{state:'hidden'});
  }
  await writeFile(file,JSON.stringify({engine:'axe-core',version:'4.14.0',browser,reports},null,2));
  // Transient, named popup portals are deliberately outside document landmarks.
  // Keep this narrow best-practice review visible; every other violation still fails.
  const reviewed=v=>v.id==='region'&&v.nodes.every(n=>n.target.length===1&&/^div\[data-slot="(?:select|dropdown-menu|tooltip)-portal"\]/.test(n.target[0]));
  const violations=reports.flatMap(report=>report.violations.filter(v=>!reviewed(v)).map(v=>`${report.state}: ${v.id}: ${v.nodes.map(n=>n.target).join('; ')}`));
  if(violations.length)throw new Error(`Accessibility violations:\n${violations.join('\n')}`);
  console.log(`PASS ${reports.length} accessibility states; inspect incomplete rules in ${file.pathname}. Automated checks do not certify screen-reader speech or full WCAG compliance.`);
}
