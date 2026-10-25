export async function run({page,baseURL,navigate,settle,resetBrowser}){
 const assert=(v,m)=>{if(!v)throw Error(m);};
 await resetBrowser();
 for(const [width,height] of [[1440,1000],[1280,900],[1024,768],[820,900],[390,844],[375,812],[844,390]]){
  await page.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  await navigate(`${baseURL}/components/tabs/`);await settle();
  assert(await page.evaluate(()=>Math.abs(parseFloat(document.documentElement.style.getPropertyValue('--docs-header-height'))-document.querySelector('.docs-header').getBoundingClientRect().height)<2),'Header clearance was not measured');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Page overflow at ${width}`);
  assert(await page.evaluate(()=>{const aside=document.querySelector('.docs-sidebar');return getComputedStyle(aside).display==='none'||getComputedStyle(aside).position==='sticky';}),'Sidebar is not independently contained');
 }
 await resetBrowser();await navigate(`${baseURL}/components/tabs/`);
 await page.click('.docs-toc a[href="#options"]');
 await page.waitForFunction(()=>{const r=document.querySelector('#options').getBoundingClientRect(),h=document.querySelector('.docs-header').getBoundingClientRect();return r.top>=h.bottom&&r.top<innerHeight*.65;});
 await page.waitForFunction(()=>document.querySelector('.docs-toc a[href="#options"]').getAttribute('aria-current')==='location');
 assert(await page.evaluate(()=>{const aside=document.querySelector('.docs-sidebar'),header=document.querySelector('.docs-header'),a=aside.getBoundingClientRect(),h=header.getBoundingClientRect(),hit=document.elementFromPoint(a.left+8,h.bottom-4);return Math.abs(h.top)<1&&a.top>=h.bottom&&!!hit?.closest('.docs-header');}),'Sidebar painted above the header');
 await page.evaluate(()=>document.querySelector('.docs-sidebar details[open] a:last-of-type')?.focus());await settle();
 assert(await page.evaluate(()=>{const r=document.activeElement.getBoundingClientRect(),h=document.querySelector('.docs-header').getBoundingClientRect();return r.top>=h.bottom&&r.bottom<=innerHeight;}),'Focused sidebar link is obscured');
 await page.screenshot({path:'/tmp/dmf-ui-layout-desktop.png'});
 await page.evaluate(()=>document.documentElement.style.fontSize='175%');await settle();
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Enlarged layout overflow');
 await page.screenshot({path:'/tmp/dmf-ui-layout-enlarged.png'});
 await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 assert(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior==='auto'),'Reduced motion still smooth-scrolls');
 await page.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await navigate(`${baseURL}/components/tabs/`);await settle();
 assert(await page.evaluate(()=>getComputedStyle(document.querySelector('.docs-sidebar')).display==='none'&&getComputedStyle(document.querySelector('.docs-mobile-navigation')).display==='block'),'Mobile navigation did not replace the rail');
 await page.screenshot({path:'/tmp/dmf-ui-layout-mobile.png'});
 await resetBrowser();console.log('PASS measured header, contained sidebar/layers/focus, anchor clearance and active contents, seven viewports, enlarged text and reduced-motion scrolling');
}
