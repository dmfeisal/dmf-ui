import {readFile,mkdir,writeFile,realpath} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';
import {serveBuild} from './dmf-ui-browser/server.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
if(!process.argv[2])throw new Error('Pass the retained consumer directory printed by test:dmf-ui:react-consumer -- --keep.');
const consumer=await realpath(resolve(process.argv[2]));
const manifest=JSON.parse(await readFile(join(consumer,'package.json'),'utf8'));
if(manifest.name!=='dmf-ui-react-consumer-proof')throw new Error('Expected the isolated packed React consumer.');
const spaceId=process.env.DMF_UI_TEST_SPACE_ID?Number(process.env.DMF_UI_TEST_SPACE_ID):null;
if(spaceId!==null&&(!Number.isSafeInteger(spaceId)||spaceId<1))throw new Error('Expected an agent-owned positive test-space ID.');
const artifacts=join(root,'.dmf-ui-test-results/react');await mkdir(artifacts,{recursive:true});
const server=await serveBuild(join(consumer,'dist'));
const config={baseURL:server.baseURL,spaceId,artifacts,runtime:pathToFileURL(join(root,'tests/browser/dmf-ui-runtime.mjs')).href,scenario:pathToFileURL(join(root,'tests/browser/dmf-ui-react-consumer.mjs')).href};
const source=`const config=${JSON.stringify(config)};
const task=await taskSpace(config.spaceId??'dmf-ui-react-browser');const page=task.page('p1');console.log('React browser test space:',task.spaceId);
const helpers=await import(config.runtime);const {run}=await import(config.scenario);
try{await helpers.resetBrowser(page);await run({page,...config,...Object.fromEntries(Object.entries(helpers).map(([key,fn])=>[key,(...args)=>fn(page,...args)]))});if(config.spaceId===null)await task.finish({keep:[]});}
catch(error){console.error('React browser review failed; retain and resume space',task.spaceId);try{await page.screenshot({path:config.artifacts+'/failure.png'});}catch{}throw error;}
`;
try{
 await writeFile(join(artifacts,'run.mjs'),source);
 const child=spawn('ego-browser',['nodejs'],{cwd:root,stdio:['pipe','inherit','inherit']});child.stdin.on('error',()=>{});child.stdin.end(source);
 const code=await new Promise((done,reject)=>{child.on('error',reject);child.on('exit',done);});
 if(code!==0)throw new Error(`React browser acceptance exited ${code}; resume the retained browser space.`);
 if(server.blockedWrites)throw new Error(`The local consumer attempted ${server.blockedWrites} write requests.`);
}finally{await server.close();}
