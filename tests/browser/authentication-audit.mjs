import {readFile,writeFile} from 'node:fs/promises';
import {settle} from './dmf-ui-runtime.mjs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function authenticationAudit(page,path){
 const source=await readFile(require.resolve('axe-core/axe.min.js'),'utf8'),reports=[];
 return async(state,scope=null)=>{
  await settle(page,scope??'body');await page.evaluate(async source=>{await document.fonts.ready;if(!window.axe){const script=document.createElement('script');script.textContent=source;document.head.append(script);}},source);
  const result=await page.evaluate(async scope=>{const r=await window.axe.run(scope?document.querySelector(scope):document);return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary})),ownerException:v.id==='color-contrast'&&v.nodes.every(n=>{if(n.target.length!==1)return false;const button=document.querySelector(n.target[0])?.closest('[data-block-submit]');return button?.classList.contains('bg-primary')&&button.classList.contains('text-primary-foreground')&&['cb-ui','hui'].includes(button.closest('.dmf-ui')?.dataset.system);})})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,errors:window.__authErrors??[]};},scope);
  reports.push({state,scope:scope??'full page',...result});await writeFile(path,JSON.stringify(reports,null,2));
  if(result.violations.some(v=>!v.ownerException)||result.incomplete.length||result.overflow||result.errors.length)throw Error(JSON.stringify({state,...result}));
 };
}
