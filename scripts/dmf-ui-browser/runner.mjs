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
    try{const state=await page.evaluate(()=>({url:location.href,width:document.documentElement.clientWidth,height:innerHeight,direction:document.documentElement.dir,theme:document.documentElement.dataset.theme,coarse:matchMedia('(pointer:coarse)').matches,focusedId:document.activeElement?.id}));const fs=await import('node:fs/promises');await fs.writeFile(config.artifacts+'/'+name+'-state.json',JSON.stringify(state,null,2));}catch{}
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
export async function runBrowserSuite({root,scenarios,taskName,executeBrowser=execute,spaceId=null,buildDir=join(root,'dist')}) {
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
    const options={finish:spaceId===null&&process.env.DMF_UI_TEST_KEEP_SPACE!=='1',baseURL:server.baseURL,taskName,spaceId,artifacts,runtime:pathToFileURL(join(root,'tests/browser/dmf-ui-runtime.mjs')).href,scenarios:scenarios.filter(name=>!selected||selected.includes(name)).map(name=>[name,pathToFileURL(join(root,`tests/browser/dmf-ui-${name}.mjs`)).href])};
    const source=bootstrap(options);await writeFile(join(artifacts,'run.mjs'),source);
    const code=await executeBrowser(source,root);
    if(server.blockedWrites)throw new Error(`Browser tests attempted ${server.blockedWrites} write request(s); all were blocked.`);
    if(code!==0)throw new Error(`DMF UI browser suite failed (exit ${code}); inspect ${artifacts} and resume the retained test space.`);
  }finally{await server?.close();await rm(snapshot,{recursive:true,force:true});}
}
