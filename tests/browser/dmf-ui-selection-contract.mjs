import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,settle,mobile,resetBrowser}){
  const assert=(value,message)=>{if(!value)throw Error(message);};
  const reports=[],axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
  const activate=async selector=>{await page.focus(selector);await page.keyboard.press('Enter');};
  async function audit(state){
    await settle();
    await page.evaluate(source=>{if(!window.axe){const script=document.createElement('script');script.textContent=source;document.head.append(script);}},axe);
    const result=await page.evaluate(async()=>{const r=await window.axe.run(document.querySelector('[data-selection-contract]'));return {violations:r.violations.map(({id,nodes})=>({id,targets:nodes.map(n=>n.target),primaryLabelsOnly:nodes.every(n=>n.target.length===1&&document.querySelector(n.target[0])?.matches('[data-selection-inspect]'))})),incomplete:r.incomplete.map(({id,nodes})=>({id,targets:nodes.map(n=>n.target)}))};});
    reports.push({state,...result});await writeFile(new URL('../../.dmf-ui-test-results/selection-contract-audit.json',import.meta.url),JSON.stringify(reports,null,2));
    const expected= / (cb-ui|hui)$/.test(state);
    const unknown=result.violations.filter(v=>!(expected&&v.id==='color-contrast'&&v.primaryLabelsOnly));
    assert(!unknown.length,JSON.stringify({state,...result}));
  }
  for(const slug of ['checkbox','switch','radio-group','select','combobox']){
    await resetBrowser();await navigate(`${baseURL}/components/${slug}/`);
    const properties='[data-selection-properties]',current='[data-selection-state]:not([hidden])';
    await page.waitForSelector(`${properties}:not([hidden])`);
    await audit(`${slug} default`);
    await page.selectOption(`${properties} [name=state]`,'disabled');
    await activate(`${current} [data-selection-inspect]`);
    assert(await page.evaluate(()=>document.querySelector('[data-selection-state=disabled] [data-selection-status]').textContent.includes('omitted')),'Disabled value submitted: '+slug);
    await page.selectOption(`${properties} [name=state]`,'required');
    await activate(`${current} [data-selection-inspect]`);
    assert(await page.evaluate(()=>{const target=document.querySelector('[data-selection-state=required] [aria-invalid=true]'),error=document.querySelector('[data-selection-state=required] [data-selection-error]');return target===document.activeElement&&target.getAttribute('aria-describedby')?.split(/\s+/).includes(error.id);}), 'Invalid focus/error relationship: '+slug);
    await audit(`${slug} required error`);
    if(slug==='checkbox'||slug==='switch')await page.keyboard.press('Space');
    if(slug==='radio-group')await page.keyboard.press('End');
    if(slug==='select'){await page.keyboard.press('Space');await page.keyboard.press('End');await page.keyboard.press('Enter');}
    if(slug==='combobox'){await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');}
    await activate(`${current} [data-selection-inspect]`);
    assert(await page.evaluate(()=>{const f=document.querySelector('[data-selection-state=required]');return f.checkValidity()&&!!new FormData(f).get('choice')&&!f.querySelector('[data-selection-error]').textContent;}),'Selection / validation failed: '+slug);
    await activate(`${current} button[type=reset]`);
    await page.waitForFunction(()=>!document.querySelector('[data-selection-state=required]').checkValidity());
    if(['switch','radio-group'].includes(slug)){
      await page.selectOption(`${properties} [name=state]`,'readonly');
      await page.focus(`${current} ${slug==='switch'?'[role=switch]':'[role=radio][data-value=weekly]'}`);await page.keyboard.press('Space');await page.keyboard.press('ArrowDown');
      assert(await page.evaluate(()=>new FormData(document.querySelector('[data-selection-state=readonly]')).get('choice')==='weekly'),'Read-only value changed: '+slug);
    }
    if(slug==='checkbox'){
      await page.selectOption(`${properties} [name=state]`,'mixed');
      assert(await page.evaluate(()=>{const i=document.querySelector('[data-selection-state=mixed] input');return i.indeterminate&&!i.checked;}),'Mixed initial state');
      await page.focus(`${current} input`);await page.keyboard.press('Space');
      assert(await page.evaluate(()=>{const i=document.querySelector('[data-selection-state=mixed] input');return !i.indeterminate&&i.checked;}),'Mixed activation');
      await activate(`${current} button[type=reset]`);
      assert(await page.evaluate(()=>document.querySelector('[data-selection-state=mixed] input').indeterminate),'Mixed reset');
    }
    await page.selectOption(`${properties} [name=state]`,'default');
    for(const preset of ['qdi','cb-ui','hui']){
      await page.selectOption(`${properties} [name=preset]`,preset);
      await audit(`${slug} ${preset}`);
      if(slug==='select'){
        await page.focus(`${current} [data-slot=select-trigger]`);await page.keyboard.press('Space');
        assert(await page.evaluate(preset=>document.querySelector('[data-slot=select-content][data-open]').closest('[data-slot=select-portal]').dataset.system===preset,preset),'Portal preset stale');await page.keyboard.press('Escape');
      }
    }
    await page.selectOption(`${properties} [name=preset]`,'dmf');
    if(['switch','select'].includes(slug)){
      await page.selectOption(`${properties} [name=size]`,'sm');
      assert(await page.evaluate(slug=>{const el=document.querySelector(`[data-selection-state=default] [data-slot=${slug==='switch'?'switch':'select-trigger'}]`);return el.dataset.size==='sm'&&el.getBoundingClientRect().height<32;},slug),'Small variant geometry');
    }
    await page.focus(`${properties} button[type=reset]`);await page.keyboard.press('Enter');
    await page.waitForFunction(()=>document.querySelector('[data-selection-state=default]').hidden===false&&document.querySelector('[data-selection-surface]').dataset.system==='dmf'&&[...document.querySelectorAll('[data-selection-state=default] [data-size]')].every(e=>e.dataset.size==='default'));
    await mobile();await page.evaluate(()=>{document.documentElement.dir='rtl';document.documentElement.dataset.theme='dark';document.documentElement.style.fontSize='175%';});
    await audit(`${slug} dark enlarged RTL`);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),'Overflow: '+slug);
    await page.focus(`${current} [data-selection-inspect]`);
    await page.evaluate(()=>document.querySelector('[data-selection-state]:not([hidden])').scrollIntoView({block:'center',behavior:'instant'}));
    await page.screenshot({path:`/tmp/dmf-selection-contract-${slug}.png`});
  }
  await resetBrowser();await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'forced-colors',value:'active'}]});
  await navigate(`${baseURL}/components/checkbox/`);await page.focus('[data-selection-state=default] input');await page.keyboard.press('Space');
  assert(await page.evaluate(()=>{const input=document.querySelector('[data-selection-state=default] input');return input.checked&&getComputedStyle(input).appearance==='auto'&&getComputedStyle(input).outlineStyle!=='none';}),'Forced colors native Checkbox and focus cue');
  await page.evaluate(()=>{document.dispatchEvent(new Event('astro:page-load'));document.dispatchEvent(new Event('astro:page-load'));});
  assert(await page.evaluate(()=>document.querySelectorAll('[data-selection-state=mixed] input[data-indeterminate]').length===1),'Duplicate mixed initializer markup');
  await page.cdp('Emulation.setScriptExecutionDisabled',{value:true});
  for(const slug of ['checkbox','switch','radio-group','select','combobox']){
    await page.goto(`${baseURL}/components/${slug}/`);
    assert(await page.evaluate(()=>document.querySelector('[data-selection-properties]').hidden&&[...document.querySelectorAll('[data-selection-inspect]')].every(b=>b.disabled)),'Uninitialized controls exposed: '+slug);
    if(slug==='combobox')assert(await page.evaluate(()=>!document.querySelector('[data-selection-state=required] [data-combobox-fallback]').hidden&&document.querySelector('[data-selection-state=required] select').required),'Native Combobox fallback lost');
  }
  await page.cdp('Emulation.setScriptExecutionDisabled',{value:false});
  console.log('PASS five selection contracts: native values, disabled omission, required focus, reset, read-only, mixed, sizes, presets/portals, dark enlarged RTL, forced colors');
}
