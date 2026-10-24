import {mkdtemp,cp,readFile,writeFile,mkdir,rename,rm,readdir,lstat,realpath} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const template=join(root,'tests/fixtures/react-consumer');
const scratch=await realpath(await mkdtemp(join(tmpdir(),'dmf-ui-react-consumer-')));
const update=process.argv.includes('--update-lock');
const keep=process.argv.includes('--keep');
const npm=process.platform==='win32'?'npm.cmd':'npm';
async function run(command,args,cwd,{capture=false}={}){
 const child=spawn(command,args,{cwd,stdio:['ignore',capture?'pipe':'inherit','inherit']});
 let output='';child.stdout?.on('data',chunk=>output+=chunk);
 const code=await new Promise((done,reject)=>{child.on('error',reject);child.on('exit',done);});
 if(code!==0)throw new Error(`${command} ${args.join(' ')} exited ${code}`);
 return output;
}
async function materialize(directory){
 for(const entry of await readdir(directory,{withFileTypes:true})){
  const path=join(directory,entry.name);
  if(entry.isDirectory())await materialize(path);
  else if(entry.name.endsWith('.template'))await rename(path,path.slice(0,-9));
 }
}
try{
 console.log(`Isolated React consumer: ${scratch}`);
 await run(npm,['run','build'],join(root,'packages/react'));
 await cp(template,scratch,{recursive:true});await materialize(scratch);await mkdir(join(scratch,'vendor'));
 const packages=[['core',root],['react',join(root,'packages/react')]];
 const packed=[];
 for(const [name,cwd] of packages){
  const [info]=JSON.parse(await run(npm,['pack','--ignore-scripts','--json','--pack-destination',join(scratch,'vendor')],cwd,{capture:true}));
  await rename(join(scratch,'vendor',info.filename),join(scratch,'vendor',`${name}.tgz`));packed.push({...info,archiveName:name});
 }
 if(update){
  const lock=JSON.parse(await readFile(join(scratch,'package-lock.json'),'utf8').catch(()=>'{}'));
  if(lock.packages){
   delete lock.packages['node_modules/dmf-ui'];delete lock.packages['node_modules/@dmf-ui/react'];
   await writeFile(join(scratch,'package-lock.json'),JSON.stringify(lock,null,2)+'\n');
  }
  await run(npm,['install','--package-lock-only','--ignore-scripts','--no-audit','--no-fund'],scratch);
  await cp(join(scratch,'package-lock.json'),join(template,'package-lock.json.template'));
 }else{
  const lock=JSON.parse(await readFile(join(scratch,'package-lock.json'),'utf8'));
  for(const info of packed){
   const name=info.archiveName==='core'?'dmf-ui':'@dmf-ui/react';
   const entry=lock.packages[`node_modules/${name}`];
   assert.equal(entry.version,info.version,`${name} changed version; regenerate the fixture lock`);
   const manifest=JSON.parse(await readFile(join(info.archiveName==='core'?root:join(root,'packages/react'),'package.json'),'utf8'));
   for(const field of ['dependencies','peerDependencies'])assert.deepEqual(entry[field]??{},manifest[field]??{},`${name} ${field} changed; regenerate the fixture lock`);
   // Only generated archive bytes change; the locked dependency graph stays fixed.
   entry.integrity=info.integrity;
  }
  await writeFile(join(scratch,'package-lock.json'),JSON.stringify(lock,null,2)+'\n');
 }
 await run(npm,['ci','--ignore-scripts','--no-audit','--no-fund'],scratch);
 for(const name of ['dmf-ui','@dmf-ui/react']){
  const path=join(scratch,'node_modules',name);
  assert.equal((await lstat(path)).isSymbolicLink(),false,`${name} must be installed, not linked`);
  assert.ok((await realpath(path)).startsWith(scratch+'/'),`${name} escapes the isolated consumer`);
  const installed=JSON.parse(await readFile(join(path,'package.json'),'utf8'));
  assert.equal(installed.version,packed.find(info=>info.name===name).version,`${name} installed stale archive metadata`);
 }
 await run(npm,['run','build'],scratch);
 await run(npm,['test'],scratch);
 console.log(`PASS packed React consumer: ${scratch}`);
 if(keep)console.log('Retained consumer; run npm run dev in that directory to inspect it.');
}finally{if(!keep)await rm(scratch,{recursive:true,force:true});}
