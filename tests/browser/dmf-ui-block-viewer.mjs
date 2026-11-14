// Block viewer: width presets resize the frame, the handle is keyboard operable, Preview/Code swaps panels,
// the index frames load the standalone view route, and the full-screen view renders the block alone.
export async function run({page,baseURL,navigate,mobile,resetBrowser}){
 const assert=(value,message)=>{if(!value)throw Error(message);};
 const inner=selector=>page.evaluate(selector=>{const frame=document.querySelector(selector),style=getComputedStyle(frame);return Math.round(frame.getBoundingClientRect().width-parseFloat(style.borderInlineStartWidth)-parseFloat(style.borderInlineEndWidth));},selector);
 const settled=(selector,width)=>page.waitForFunction(([selector,width])=>{const frame=document.querySelector(selector),style=getComputedStyle(frame);return Math.round(frame.getBoundingClientRect().width-parseFloat(style.borderInlineStartWidth)-parseFloat(style.borderInlineEndWidth))===width;},[selector,width]);
 const noOverflow=()=>page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth);

 await resetBrowser();await navigate(baseURL+'/blocks/sign-in/');
 const viewer='#block-viewer-sign-in',frame=`${viewer} [data-viewer-frame]`;
 await page.waitForFunction(viewer=>document.querySelector(viewer)?.dataset.enhanced==='true',viewer);
 assert(await page.evaluate(viewer=>{const root=document.querySelector(viewer),sizes=root.querySelector('[data-viewer-sizes]'),views=root.querySelector('[data-viewer-views]'),open=root.querySelector('.docs-block-viewer-open'),handle=root.querySelector('[data-viewer-handle]');
  return !sizes.hidden&&sizes.getAttribute('role')==='group'&&sizes.getAttribute('aria-label')==='SignInBlock preview width'&&!views.hidden&&views.getAttribute('role')==='group'&&root.querySelector('[data-viewer-frame] [data-slot=sign-in-block]')&&open.getAttribute('href')==='/blocks/sign-in/view/'&&open.textContent.trim()==='Open SignInBlock in full screen'&&!handle.hidden&&handle.getAttribute('role')==='separator'&&handle.tabIndex===0&&document.getElementById(handle.getAttribute('aria-controls'))===root.querySelector('[data-viewer-frame]')&&Math.round(open.getBoundingClientRect().height)===32&&Math.round(sizes.getBoundingClientRect().height)===32;},viewer),'Viewer toolbar, labelled groups, 32px controls, separator and named full-screen link');
 const pressed=()=>page.evaluate(viewer=>[...document.querySelectorAll(`${viewer} [data-viewer-size]`)].filter(button=>button.getAttribute('aria-pressed')==='true').map(button=>button.dataset.viewerSize).join(),viewer);
 const desktop=await inner(frame),available=await page.evaluate(viewer=>{const root=document.querySelector(viewer),frame=root.querySelector('[data-viewer-frame]'),style=getComputedStyle(frame);return Math.round(root.querySelector('[data-viewer-stage]').clientWidth-root.querySelector('[data-viewer-handle]').offsetWidth-parseFloat(style.borderInlineStartWidth)-parseFloat(style.borderInlineEndWidth));},viewer);
 assert(desktop===available&&desktop>768&&await pressed()==='desktop','Desktop fills the stage');
 await page.click(`${viewer} [data-viewer-size=mobile]`);await settled(frame,375);assert(await pressed()==='mobile','Mobile preset pressed');
 assert(await page.evaluate(()=>document.querySelector('[data-slot=sign-in-block]').getBoundingClientRect().width<=375),'Block reflows inside the mobile frame');
 await page.click(`${viewer} [data-viewer-size=tablet]`);await settled(frame,768);assert(await pressed()==='tablet','Tablet preset pressed');
 await page.click(`${viewer} [data-viewer-size=desktop]`);await settled(frame,desktop);assert(await pressed()==='desktop','Desktop restored');
 await page.focus(`${viewer} [data-viewer-handle]`);await page.keyboard.press('Home');await settled(frame,320);await page.keyboard.press('ArrowRight');await settled(frame,336);
 assert(await pressed()===''&&await page.evaluate(viewer=>document.querySelector(`${viewer} [data-viewer-handle]`).getAttribute('aria-valuetext')==='336 pixels wide',viewer),'Keyboard resize is custom and announced');
 await page.keyboard.press('End');await settled(frame,desktop);
 await page.click(`${viewer} [data-viewer-view=code]`);
 assert(await page.evaluate(viewer=>{const root=document.querySelector(viewer),visible=element=>element.getClientRects().length>0;return visible(root.querySelector('[data-viewer-panel=code] [data-copy-value]'))&&!visible(root.querySelector('[data-viewer-panel=preview]'))&&!visible(root.querySelector('[data-viewer-sizes]'))&&root.querySelector('[data-viewer-view=code]').getAttribute('aria-pressed')==='true';},viewer),'Code view shows the shared Code Block');
 await page.click(`${viewer} [data-viewer-view=preview]`);
 assert(await page.evaluate(viewer=>document.querySelector(`${viewer} [data-viewer-panel=preview]`).getClientRects().length>0&&document.querySelector(`${viewer} [data-viewer-panel=code]`).getClientRects().length===0,viewer),'Preview view restored');

 await page.click(`${viewer} .docs-block-viewer-open`);await page.waitForURL(baseURL+'/blocks/sign-in/view/');
 assert(await page.evaluate(()=>{const content=document.querySelector('[data-block-view-content]');return content&&content.querySelector('[data-slot=sign-in-block]')&&!document.querySelector('.docs-header,.docs-footer,.docs-sidebar')&&Math.round(content.getBoundingClientRect().width)===document.documentElement.clientWidth&&document.querySelector('link[rel=canonical]').href.endsWith('/blocks/sign-in/')&&document.querySelector('meta[name=robots]').content==='noindex';}),'Full-screen view renders the block alone');
 await mobile();assert(await noOverflow()&&await page.evaluate(()=>document.querySelector('[data-slot=sign-in-block]').getBoundingClientRect().right<=390),'Full-screen view at 390px');

 await resetBrowser();await navigate(baseURL+'/blocks/');
 assert(await page.evaluate(()=>{const viewers=[...document.querySelectorAll('[data-block-viewer]')];return viewers.length===8&&viewers.every(root=>{const slug=root.id.replace('block-viewer-',''),iframe=root.querySelector('iframe');return iframe.getAttribute('src')===`/blocks/${slug}/view/`&&iframe.title.endsWith(' preview')&&root.querySelector(`.docs-block-viewer-title a[href="/blocks/${slug}/"]`);});}),'Every block on the index sits in a framed viewer');
 const hero='#block-viewer-hero';await page.evaluate(hero=>document.querySelector(hero).scrollIntoView(),hero);
 await page.waitForFunction(hero=>document.querySelector(`${hero} iframe`).contentDocument?.querySelector('[data-slot=hero-block]')&&parseFloat(document.querySelector(`${hero} iframe`).style.blockSize)>200,hero);
 await page.click(`${hero} [data-viewer-size=mobile]`);await page.waitForFunction(hero=>document.querySelector(`${hero} iframe`).contentWindow.innerWidth===375,hero);
 assert(await page.evaluate(hero=>{const doc=document.querySelector(`${hero} iframe`).contentDocument;return doc.documentElement.scrollWidth<=375&&getComputedStyle(doc.querySelector('#hero-preview .dmf-hero-inner')).gridTemplateColumns.split(' ').length===1;},hero),'Mobile frame is a real 375px viewport with the single-column layout');
 await page.click(`${hero} [data-viewer-size=desktop]`);await page.waitForFunction(hero=>document.querySelector(`${hero} iframe`).contentWindow.innerWidth>768,hero);
 assert(await page.evaluate(hero=>getComputedStyle(document.querySelector(`${hero} iframe`).contentDocument.querySelector('#hero-preview .dmf-hero-inner')).gridTemplateColumns.split(' ').length===2,hero),'Desktop frame uses the split layout');
 await page.evaluate(()=>{document.documentElement.dataset.theme='dark';});await page.waitForFunction(hero=>document.querySelector(`${hero} iframe`).contentDocument.documentElement.dataset.theme==='dark',hero);
 await mobile();for(const path of ['/blocks/','/blocks/sign-in/','/blocks/hero/']){await navigate(baseURL+path);assert(await noOverflow(),`${path} has no horizontal scroll at 390px`);}
 await resetBrowser();console.log('PASS Block viewer: presets, keyboard resize, Preview/Code, framed index, theme sync, full-screen route and 390px containment.');
}
