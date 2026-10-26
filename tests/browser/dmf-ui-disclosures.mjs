// Run via the managed browser runner; all state checks are bounded, with no sleeps.
export async function run({hover,page,baseURL,navigate,focused,mobile,tap}) {
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  // Finished promises can remain unresolved for paused animations; observe running state with a deadline.
  const settle=()=>page.waitForFunction(()=>document.fonts.status==='loaded'&&!document.getAnimations().some(animation=>{
    const target=animation.effect?.target,end=animation.effect?.getComputedTiming().endTime;
    return animation.playState==='running'&&Number.isFinite(end)&&end<=3000&&(!(target instanceof Element)||target.checkVisibility());
  }),undefined,{timeout:10000});
  const opened=async selector=>{await page.waitForFunction(selector=>{const e=document.querySelector(selector);return !!e&&!e.hidden;},selector,{timeout:10000});await settle();};
  for(const [path,prefix] of [['/examples/dmf-ui/','standalone-form']]) {
    await navigate(`${baseURL}${path}`);
    await page.waitForSelector(`#${prefix}-cb-ui-tooltip[data-dmf-tooltip-ready]`);
    const ssr=await page.evaluate(async()=>{const text=await(await fetch(location.pathname)).text();const doc=new DOMParser().parseFromString(text,'text/html');return [...doc.querySelectorAll('[data-slot=accordion-content][id$="foundation-panel"]')].every(e=>!e.hidden&&e.textContent.includes('Fulldev'));});
    assert(ssr,'Authored default content is not present in server HTML');
    for(const system of ['dmf','cb-ui']) {
      const id=`${prefix}-${system}`;
      await page.focus(`#${id}-accordion-foundation`);await page.keyboard.press('ArrowDown');await focused(`${id}-accordion-customization`);
      await page.keyboard.press('Enter');await settle();
      assert(await page.evaluate(id=>{
        const root=document.getElementById(`${id}-accordion-single`),trigger=document.getElementById(`${id}-accordion-customization`),panel=document.getElementById(trigger.getAttribute('aria-controls'));
        return root.querySelectorAll('[data-slot=accordion-trigger][aria-expanded=true]').length===1&&panel&&!panel.hidden&&panel.getAttribute('aria-labelledby')===trigger.id&&document.getElementById(`${id}-accordion-unavailable`).disabled;
      },id),'Single Accordion ARIA, disabled or expansion failed');
      await page.keyboard.press('Space');await settle();
      assert(await page.evaluate(id=>document.getElementById(`${id}-accordion-customization`).getAttribute('aria-expanded')==='false',id),'Accordion did not collapse');
      await page.keyboard.press('Home');await focused(`${id}-accordion-foundation`);await page.keyboard.press('End');await focused(`${id}-accordion-customization`);
      await page.focus(`#${id}-accordion-behavior`);await page.keyboard.press('Space');await settle();
      assert(await page.evaluate(id=>document.getElementById(`${id}-accordion-multiple`).querySelectorAll('[aria-expanded=true]').length===2,id),'Multiple Accordion collapsed its sibling');
      await hover(`#${id}-tooltip-disabled`);await settle();
      assert(await page.evaluate(id=>document.getElementById(`${id}-tooltip-disabled-trigger`).disabled&&(!document.getElementById(`${id}-tooltip-disabled-content`)||document.getElementById(`${id}-tooltip-disabled-content`).hidden),id),'Disabled Tooltip opened');
      // Pointer hover, hoverable content, Escape, focus description and native links.
      await hover(`#${id}-tooltip-trigger`);await opened(`#${id}-tooltip-content`);
      await hover(`#${id}-tooltip-content`);await settle();
      assert(await page.evaluate(id=>!document.getElementById(`${id}-tooltip-content`).hidden,id),'Hovering Tooltip content dismissed it');
      await page.keyboard.press('Escape');await page.waitForFunction(id=>!document.getElementById(`${id}-tooltip-content`)||document.getElementById(`${id}-tooltip-content`).hidden,id);
      // Keep the pointer outside triggers while native focus scrolling runs.
      await page.cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:1,y:1});
      await page.focus(`#${id}-tooltip-trigger`);await opened(`#${id}-tooltip-content`);
      assert(await page.evaluate(id=>{
        const trigger=document.getElementById(`${id}-tooltip-trigger`),tip=document.getElementById(`${id}-tooltip-content`);
        return trigger.getAttribute('aria-describedby').split(/\s+/).includes(tip.id)&&tip.getAttribute('role')==='tooltip'&&document.activeElement===trigger;
      },id),'Tooltip description, role or focus failed');
      await page.keyboard.press('Escape');await focused(`${id}-tooltip-trigger`);
      await page.focus(`#${id}-tooltip-link-trigger`);await opened(`#${id}-tooltip-link-content`);await page.keyboard.press('Enter');
      assert(await page.evaluate(id=>location.hash===`#${id}-accordion-title`,id),'Tooltip intercepted native link activation');
      await page.focus(`#${id}-accordion-foundation`);await settle();
    }
    await page.evaluate(()=>{document.documentElement.dir='rtl';document.documentElement.dataset.theme='dark';});
    await mobile();await tap(`#${prefix}-cb-ui-tooltip-trigger`);await settle();
    assert(await page.evaluate(prefix=>!document.getElementById(`${prefix}-cb-ui-tooltip-content`)||document.getElementById(`${prefix}-cb-ui-tooltip-content`).hidden,prefix),'Touch tap left a hover-only tooltip open');
    await page.evaluate(prefix=>document.getElementById(`${prefix}-cb-ui-accordion-behavior`).focus({preventScroll:true}),prefix);
    await page.cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await page.cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    await opened(`#${prefix}-cb-ui-tooltip-content`);
    const geometry=await page.evaluate(prefix=>{
      const tip=document.getElementById(`${prefix}-cb-ui-tooltip-content`),rect=tip.getBoundingClientRect(),portal=tip.closest('.dmf-ui'),style=getComputedStyle(tip);
      return {left:rect.left,right:rect.right,width:document.documentElement.clientWidth,overflow:document.documentElement.scrollWidth,dir:style.direction,font:style.fontFamily,system:portal.dataset.system,colorMode:portal.dataset.colorMode,align:getComputedStyle(document.getElementById(`${prefix}-cb-ui-accordion-foundation`)).textAlign};
    },prefix);
    assert(geometry.width===390&&geometry.left>=0&&geometry.right<=391&&geometry.overflow<=390&&geometry.dir==='rtl'&&geometry.font.includes('DMF CB Nunito')&&geometry.system==='cb-ui'&&geometry.colorMode==='light'&&geometry.align==='start',JSON.stringify(geometry));
    console.log(await page.screenshot({path:'/tmp/dmf-ui-expansion/disclosures-mobile.png'}));
    await page.cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await page.cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await page.cdp('Emulation.clearDeviceMetricsOverride');await page.cdp('Emulation.setTouchEmulationEnabled',{enabled:false});
    await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await page.evaluate(()=>{document.dispatchEvent(new Event('astro:page-load'));document.dispatchEvent(new Event('astro:page-load'));});
    await page.focus(`#${prefix}-dmf-accordion-foundation`);await page.keyboard.press('Enter');await settle();
    assert(await page.evaluate(prefix=>document.getElementById(`${prefix}-dmf-accordion-foundation`).getAttribute('aria-expanded')==='true',prefix),'Repeated init duplicated Accordion handlers');
    await page.evaluate(()=>document.dispatchEvent(new Event('astro:before-swap')));
    assert(await page.evaluate(()=>!document.querySelector('[data-dmf-accordion-ready],[data-dmf-tooltip-ready],[data-slot=tooltip-content][data-open]')),'Disclosure teardown failed');
    await page.evaluate(()=>document.dispatchEvent(new Event('astro:page-load')));await page.waitForSelector(`#${prefix}-cb-ui-tooltip[data-dmf-tooltip-ready]`);
    console.log(`PASS ${path}: Accordion defaults/single/multiple/disabled/keyboard/ARIA; Tooltip hover/focus/Escape/link; CB mobile RTL portal; reduced motion and lifecycle`);
  }
}
