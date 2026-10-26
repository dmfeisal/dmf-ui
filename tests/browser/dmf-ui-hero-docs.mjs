export async function run({page,baseURL,navigate,mobile,resetBrowser}){
 const assert=(value,message)=>{if(!value)throw Error(message);};
 await resetBrowser();await navigate(baseURL+'/blocks/');await page.click('.docs-entry a[href="/blocks/hero/"]');await page.waitForURL(baseURL+'/blocks/hero/');
 assert(await page.evaluate(()=>document.querySelectorAll('[data-slot=hero-block]').length===2&&document.querySelector('#hero-preview-title').tagName==='H2'&&!document.querySelector('[data-block-demo]')&&document.querySelector('[data-copy-value]')),'Hero docs composition and source-owned code');
 await page.waitForFunction(()=>document.querySelector('#hero-preview img').naturalWidth===640);
 await page.selectOption('[data-contract-preset]','hui');await page.waitForFunction(()=>document.querySelector('[data-docs-preview]').dataset.system==='hui');assert(await page.evaluate(()=>document.querySelector('[data-contract-mode]').disabled),'Light-only preview mode');
 await mobile();await page.evaluate(()=>document.documentElement.dir='rtl');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),'Hero docs standard RTL overflow');
 await page.evaluate(()=>document.documentElement.style.fontSize='200%');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),'Hero docs enlarged overflow');
 await resetBrowser();await navigate(baseURL+'/blocks/hero/');await page.click('#hero-preview a[href="/docs/architecture/"]');await page.waitForURL(baseURL+'/docs/architecture/');
 await page.click('#docs-search-trigger');await page.fill('#docs-search-input','HeroBlock');assert(await page.evaluate(()=>!!document.querySelector('#docs-search-results a[href="/blocks/hero/"]')),'Hero global search entry');await page.keyboard.press('Escape');
 await resetBrowser();console.log('PASS Hero docs: index/search/source examples, image, real guide link, preset/mode controls, standard RTL and enlarged containment.');
}
