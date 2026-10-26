import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {dirname,relative,resolve,sep} from 'node:path';
import {createHash} from 'node:crypto';
const manifest=JSON.parse(await readFile('docs/DMF-UI-FULLDEV-CATALOG.json','utf8'));
const hash=value=>createHash('sha256').update(value).digest('hex');
const root=resolve('src/components/dmf-ui');
const write=process.argv.includes('--write');
const record=process.argv.includes('--record');
let count=0;
for(const entry of manifest.components){
 const raw=await readFile(entry.payload);if(hash(raw)!==entry.sha256)throw Error(`Pinned payload changed: ${entry.name}`);
 if(entry.status!=='imported'){await access(`${root}/${entry.name}/index.ts`);continue;}
 const payload=JSON.parse(raw);const expected=new Map((entry.files??[]).map(file=>[file.path,file.adoptedSha256]));entry.files=[];
 for(const file of payload.files){
  const prefix=`src/components/ui/${entry.name}/`;
  if(!file.path.startsWith(prefix))throw Error(`Unexpected source path: ${file.path}`);
  const destination=resolve(root,entry.name,file.path.slice(prefix.length));
  if(!destination.startsWith(root+sep))throw Error('Source path escapes component tree');
  const localImport=path=>{let value=relative(dirname(destination),path).split(sep).join('/');return value.startsWith('.')?value:`./${value}`;};
  let content=file.content.replace(/@\/lib\/utils/g,localImport(`${root}/utils`)).replace(/@\/components\/ui\/([a-z0-9-]+)/g,(_,name)=>localImport(`${root}/${name}`)).replace(/@\/styles\/global\.css/g,localImport(resolve('src/styles/dmf-ui.css')));
  if(write){try{await access(destination);}catch{await mkdir(dirname(destination),{recursive:true});await writeFile(destination,content);}}
  const adopted=await readFile(destination);
  const localPath=relative(resolve('.'),destination).split(sep).join('/');
  if(!write&&!record&&expected.get(localPath)!==hash(adopted))throw Error(`Adapted source changed without a record update: ${localPath}`);
  entry.files.push({path:relative(resolve('.'),destination).split(sep).join('/'),upstreamSha256:hash(file.content),adoptedSha256:hash(adopted)});count++;
 }
}
if(record)await writeFile('docs/DMF-UI-FULLDEV-CATALOG.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Verified ${manifest.components.length} pinned families; ${count} adapted files. Existing DMF source is retained.`);
