import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function run({page,baseURL,navigate,settle,mobile,resetBrowser}){
 const assert=(v,m)=>{if(!v)throw Error(m);};const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
 async function audit(){await settle();await page.evaluate(source=>{if(window.axe)return;const s=document.createElement('script');s.textContent=source;document.head.append(s);},axe);const r=await page.evaluate(async()=>{const r=await window.axe.run();return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.failureSummary)})),incomplete:r.incomplete.map(v=>v.id)};});assert(!r.violations.length&&!r.incomplete.length,JSON.stringify(r));}
 await resetBrowser();await navigate(`${baseURL}/create/?system=portfolio`);
 assert(await page.evaluate(async()=>{const body=await document.fonts.load('400 14px "DMF Portfolio Inter"'),heading=await document.fonts.load('700 20px "DMF Portfolio Jakarta"');return body.length>0&&heading.length>0;}),'Portfolio fonts failed');
 for(const [mode,color] of [['light','rgb(244, 243, 239)'],['dark','rgb(17, 17, 17)'],['yellow','rgb(242, 212, 61)']]){
  await page.selectOption('#preset-mode',mode);await audit();assert(await page.evaluate(color=>getComputedStyle(document.querySelector('#preset-surface')).backgroundColor===color,color),'Portfolio mode color mismatch');
 }
 await page.evaluate(()=>document.documentElement.dataset.theme='dark');await audit();
 assert(await page.evaluate(()=>getComputedStyle(document.querySelector('#preset-surface')).backgroundColor==='rgb(242, 212, 61)'&&document.querySelector('#preset-code').textContent.includes('data-color-mode="yellow"')),'Yellow isolation/export failed');
 await page.reload();await settle();assert(await page.evaluate(()=>document.querySelector('#preset-system').value==='portfolio'&&document.querySelector('#preset-mode').value==='yellow'),'Portfolio URL restore failed');
 const pending=page.waitForEvent('download',{timeout:10000});await page.click('#preset-download');const download=await pending;await download.saveAs('/tmp/dmf-ui-portfolio-preset.json');const data=JSON.parse(await readFile('/tmp/dmf-ui-portfolio-preset.json','utf8'));assert(data.system==='portfolio'&&data.mode==='yellow'&&data.css.includes('dmf-ui/presets/portfolio.css'),'Portfolio JSON mismatch');
 await page.selectOption('#preset-system','dmf');assert(await page.evaluate(()=>document.querySelector('#preset-mode').value==='light'&&document.querySelector('#preset-mode option[value=yellow]').disabled),'Yellow leaked to DMF');
 await navigate(`${baseURL}/examples/portfolio/`);await audit();
 await page.focus('[data-dmf-section-nav] a[href="#portfolio-dark"]');await page.keyboard.press('Enter');await page.waitForFunction(()=>location.hash==='#portfolio-dark'&&document.querySelector('[data-dmf-section-nav] a[href="#portfolio-dark"]').getAttribute('aria-current')==='location');
 await page.screenshot({path:'/tmp/dmf-ui-portfolio-desktop.png'});
 await mobile();await page.evaluate(()=>document.querySelector('.docs-page').dir='rtl');await audit();
 for(const size of ['87.5%','175%']){await page.evaluate(size=>document.documentElement.style.fontSize=size,size);await settle();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=390),'Portfolio mobile overflow');}
 await page.screenshot({path:'/tmp/dmf-ui-portfolio-mobile.png'});
 await resetBrowser();for(const slug of ['archive-index','tag-list','project-action-bar','section-navigation']){await navigate(`${baseURL}/components/${slug}/`);await audit();}
 await page.focus('[data-docs-preview] [data-dmf-section-nav] a[href$=overview]');await page.keyboard.press('Enter');assert(await page.evaluate(()=>location.hash.includes('overview')),'Section native link failed');
 console.log('PASS Portfolio fonts, Light/Dark/Yellow isolation, share/JSON/normalization, native section navigation, extracted patterns and 10 axe states with mobile RTL/enlarged text');
}
