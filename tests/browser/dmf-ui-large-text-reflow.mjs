// Pages that scrolled sideways at 390px, right-to-left, with 200% root text: component previews and demos whose
// grid tracks or headings grew to their content. Verdana stands in for the wider fallback fonts on Linux; where it
// is not installed, the page's own fallback font applies, which is the case CI covers.
const pages=['/components/carousel/','/docs/foundation-spacing/','/components/empty-state/','/components/sidebar/','/docs/foundation-accessibility/','/examples/dmf-ui/','/examples/layout/'];
export async function run({page,baseURL,navigate,settle,resetBrowser}){
 const assert=(v,m)=>{if(!v)throw Error(m);};
 await resetBrowser();
 await page.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
 for(const path of pages){
  await navigate(baseURL+path);
  for(const font of ['page','Verdana']){
   await page.evaluate(font=>{document.documentElement.dir='rtl';document.documentElement.style.fontSize='200%';let style=document.getElementById('dmf-ui-test-font');if(font==='page'){style?.remove();return;}style??=document.head.appendChild(Object.assign(document.createElement('style'),{id:'dmf-ui-test-font'}));style.textContent=`*,*::before,*::after{font-family:${font},sans-serif !important}`;},font);
   await settle();
   const geometry=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
   assert(geometry.client===390&&geometry.scroll<=geometry.client,`${path} ${font} font: horizontal scroll ${JSON.stringify(geometry)}`);
  }
 }
 // Wrapping tabs keep the single-row height they had before (Nova 2rem row, trigger 7px shorter) and stay on the
 // page when they wrap.
 await resetBrowser();await page.cdp('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});
 await navigate(baseURL+'/examples/dmf-ui/');
 const tabs=()=>page.evaluate(()=>{const list=document.querySelector('#standalone-tabs-automatic [data-slot=tabs-list]'),rem=parseFloat(getComputedStyle(document.documentElement).fontSize),l=list.getBoundingClientRect();return {rem,list:l.height,width:l.width,triggers:[...list.querySelectorAll('[data-slot=tabs-trigger]')].map(t=>({height:t.getBoundingClientRect().height,top:Math.round(t.getBoundingClientRect().top-l.top)}))};});
 const single=await tabs();
 assert(Math.abs(single.list-2*single.rem)<.5&&single.triggers.every(t=>Math.abs(t.height-(2*single.rem-7))<.5&&t.top===single.triggers[0].top),`Single-row tabs changed size: ${JSON.stringify(single)}`);
 await page.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
 await page.evaluate(()=>{document.documentElement.dir='rtl';document.documentElement.style.fontSize='200%';});await settle();
 const wrapped=await tabs();
 assert(new Set(wrapped.triggers.map(t=>t.top)).size>1&&wrapped.width<=390&&wrapped.list>=2*wrapped.rem*2-1,`Tabs did not wrap within the page: ${JSON.stringify(wrapped)}`);
 await resetBrowser();
 console.log('PASS seven component and example pages reflow at 390px RTL with 200% text in page and Verdana fonts; tabs wrap and keep their single-row height');
}
