import { spawn } from 'node:child_process';
import { mkdir, writeFile, mkdtemp, cp, rm, access } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { constants } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { serveBuild } from './server.mjs';

export function bootstrap({baseURL, taskName, spaceId, scenarios, runtime, artifacts,finish=true}) {
  const config=JSON.stringify({baseURL,taskName,spaceId,scenarios,runtime,artifacts,finish});
  return `const config=${config};
const task=await taskSpace(config.spaceId??config.taskName); const page=task.page('p1');
console.log('DMF UI test space:',task.spaceId);
const helpers=await import(config.runtime);
for(const [name,url] of config.scenarios){
  try{
    await helpers.resetBrowser(page);
    const {run}=await import(url);
    const navigate=async url=>{await page.goto(url);await helpers.settle(page);};
    await run({task,page,baseURL:config.baseURL,navigate,...Object.fromEntries(Object.entries(helpers).map(([key,fn])=>[key,(...args)=>fn(page,...args)]))});
    console.log('PASS suite:',name);
  }catch(error){
    if(!/EGO_|inactive|unassigned|user.*control|control.*(?:lost|taken)/i.test(String(error))){
    try{const state=await page.evaluate(()=>{const width=document.documentElement.clientWidth;const describe=element=>element.tagName.toLowerCase()+(element.id?'#'+element.id:'')+[...element.classList].slice(0,3).map(name=>'.'+name).join('');const overflowing=[...document.body.querySelectorAll('*')].map(element=>({element,rect:element.getBoundingClientRect()})).filter(({element,rect})=>rect.width>0&&(rect.right>width+1||rect.left<-1)&&!element.closest('[hidden],dialog:not([open])')).filter(({element})=>{for(let e=element.parentElement;e&&e!==document.body;e=e.parentElement){if(getComputedStyle(e).overflowX!=='visible')return false;}return true;}).filter(({element},index,list)=>!list.some(other=>other.element!==element&&element.contains(other.element))).slice(0,8).map(({element,rect})=>({element:describe(element),left:Math.round(rect.left),right:Math.round(rect.right),width:Math.round(rect.width),text:element.textContent.trim().slice(0,60)}));return {url:location.href,width,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,direction:document.documentElement.dir,theme:document.documentElement.dataset.theme,coarse:matchMedia('(pointer:coarse)').matches,focusedId:document.activeElement?.id,overflowing};});const fs=await import('node:fs/promises');await fs.writeFile(config.artifacts+'/'+name+'-state.json',JSON.stringify(state,null,2));}catch{}
    try{await page.screenshot({path:config.artifacts+'/'+name+'-failure.png'});}catch{}
    }
    console.error('FAILED suite:',name,'; test space retained:',task.spaceId);
    throw error;
  }
}
if(config.finish)await task.finish({keep:[]});
`;
}
async function execute(source, cwd) {
  const child=spawn('ego-browser',['nodejs'],{cwd,stdio:['pipe','inherit','inherit']});
  child.stdin.on('error',()=>{}); child.stdin.end(source);
  const interrupt=()=>child.kill('SIGINT');
  process.once('SIGINT',interrupt);process.once('SIGTERM',interrupt);
  try{return await new Promise((resolve,reject)=>{
    child.once('error',error=>reject(new Error(error.code==='ENOENT'?'Browser tests require the installed Ego Browser CLI (ego-browser).':error.message)));
    child.once('exit',code=>resolve(code??1));
  });}finally{process.removeListener('SIGINT',interrupt);process.removeListener('SIGTERM',interrupt);}
}
// DMF_UI_BROWSER=playwright runs headless Chromium (CI); otherwise the installed Ego Browser CLI.
async function selectedExecutor(){
  if(process.env.DMF_UI_BROWSER==='playwright'){const {executePlaywright}=await import('./playwright.mjs');return executePlaywright;}
  if(process.env.DMF_UI_BROWSER&&process.env.DMF_UI_BROWSER!=='ego')throw new Error('DMF_UI_BROWSER must be ego or playwright.');
  return execute;
}
// DMF_UI_TEST_SHARD=i/n keeps every n-th scenario starting at the i-th, so CI can split a suite across jobs.
export function shard(names,value=process.env.DMF_UI_TEST_SHARD){
  if(!value)return names;
  const match=/^(\d+)\/(\d+)$/.exec(value);const index=Number(match?.[1]),count=Number(match?.[2]);
  if(!match||count<1||index<1||index>count)throw new Error('DMF_UI_TEST_SHARD must look like 1/4.');
  return names.filter((_,position)=>position%count===index-1);
}
export async function runBrowserSuite({root,scenarios,taskName,executeBrowser,spaceId=null,buildDir=join(root,'dist')}) {
  executeBrowser??=await selectedExecutor();
  const selected=process.env.DMF_UI_TEST_FILTER?.split(',').map(x=>x.trim()).filter(Boolean);
  if(selected&&selected.length===0)throw new Error('Select at least one DMF UI suite.');
  if(selected?.some(name=>!scenarios.includes(name)))throw new Error(`Unknown DMF UI suite; choose ${scenarios.join(', ')}`);
  if(spaceId!==null&&(!Number.isSafeInteger(spaceId)||spaceId<1))throw new Error('DMF_UI_TEST_SPACE_ID must be an agent-owned positive test-space number.');
  await access(join(buildDir,'index.html')).catch(()=>{throw new Error('Build the site first, or run npm run test:dmf-ui.');});
  const artifacts=join(root,'.dmf-ui-test-results');await mkdir(artifacts,{recursive:true});
  const snapshot=await mkdtemp(join(tmpdir(),'dmf-ui-browser-build-'));
  let server;
  try {
    await cp(buildDir,snapshot,{recursive:true,mode:constants.COPYFILE_FICLONE});
    server=await serveBuild(snapshot);
    const options={finish:spaceId===null&&process.env.DMF_UI_TEST_KEEP_SPACE!=='1',baseURL:server.baseURL,taskName,spaceId,artifacts,runtime:pathToFileURL(join(root,'tests/browser/dmf-ui-runtime.mjs')).href,scenarios:shard(scenarios.filter(name=>!selected||selected.includes(name))).map(name=>[name,pathToFileURL(join(root,`tests/browser/dmf-ui-${name}.mjs`)).href])};
    const source=bootstrap(options);await writeFile(join(artifacts,'run.mjs'),source);
    const code=await executeBrowser(source,root);
    if(server.blockedWrites)throw new Error(`Browser tests attempted ${server.blockedWrites} write request(s); all were blocked.`);
    if(code!==0)throw new Error(`DMF UI browser suite failed (exit ${code}); inspect ${artifacts} and resume the retained test space.`);
  }finally{await server?.close();await rm(snapshot,{recursive:true,force:true});}
}
