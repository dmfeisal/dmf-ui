import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
export const groups=['dmf.light','dmf.dark','cb.light'];
const dimension=value=>{
 if(!value||!Number.isFinite(value.value)||!['px','rem'].includes(value.unit))throw new Error('Invalid dimension');
 return `${value.value}${value.unit}`;
};
const number=value=>{if(!Number.isFinite(value))throw new Error('Invalid number');return String(value);};
function color(value){
 if(!value||!['srgb','oklch'].includes(value.colorSpace)||!Array.isArray(value.components)||value.components.length!==3||!value.components.every(Number.isFinite)||!Number.isFinite(value.alpha)||value.alpha<0||value.alpha>1)throw new Error('Invalid color');
 if(value.colorSpace==='srgb'&&value.components.some(n=>n<0||n>1))throw new Error('sRGB color out of range');
 if(value.hex){
  if(value.colorSpace!=='srgb'||!/^#[\da-f]{6}$/i.test(value.hex)||value.alpha!==1||value.components.some((n,i)=>Math.abs(n-parseInt(value.hex.slice(1+i*2,3+i*2),16)/255)>1e-12))throw new Error('Color hex fallback differs from its components');
  return value.hex;
 }
 if(value.colorSpace==='oklch')return `oklch(${value.components.map(number).join(' ')}${value.alpha===1?'':` / ${value.alpha}`})`;
 if(value.components.every(n=>n===0))return `hsl(0 0% 0% / ${value.alpha})`;
 return `color(srgb ${value.components.map(number).join(' ')} / ${value.alpha})`;
}
function serialize(type,value){
 if(type==='color')return color(value);
 if(type==='dimension')return dimension(value);
 if(type==='fontFamily'){
  if(!Array.isArray(value)||!value.length||value.some(v=>typeof v!=='string'||!v.length||/['";{}\n]/.test(v)))throw new Error('Invalid font family');
  return value.map(v=>/^(sans-serif|serif|monospace|system-ui)$/.test(v)?v:`'${v}'`).join(', ');
 }
 if(type==='shadow'){
  if(!Array.isArray(value)||!value.length)throw new Error('Invalid shadow');
  if(value.some(shadow=>shadow.blur?.value<0))throw new Error('Shadow blur must be non-negative');
  return value.map(shadow=>`${dimension(shadow.offsetX)} ${dimension(shadow.offsetY)} ${dimension(shadow.blur)} ${dimension(shadow.spread)} ${color(shadow.color)}`).join(', ');
 }
 throw new Error(`Unsupported token type: ${type}`);
}
function flatten(group,path='',result=new Map()){
 for(const [name,value] of Object.entries(group)){
  if(name.startsWith('$'))continue;
  if(/[.{}]/.test(name)||!value||typeof value!=='object')throw new Error(`Invalid token name or group: ${name}`);
  const key=path?`${path}.${name}`:name;
  if('$value' in value){if(!value.$type)throw new Error(`Missing token type: ${key}`);result.set(key,value);}
  else flatten(value,key,result);
 }return result;
}
export function compileTokens(source){
 const tokens=flatten(source);
 for(const path of tokens.keys())if(!groups.some(group=>path.startsWith(`${group}.`)))throw new Error(`Unsupported output group: ${path}`);
 const resolved=new Map();
 function resolve(path,chain=[]){
  if(chain.includes(path))throw new Error(`Token alias cycle: ${[...chain,path].join(' -> ')}`);
  if(resolved.has(path))return resolved.get(path);
  const token=tokens.get(path);if(!token)throw new Error(`Unknown token alias: ${path}`);
  let value=token.$value;
  if(typeof value==='string'){
   if(!/^\{[^{}]+\}$/.test(value))throw new Error(`Invalid alias: ${path}`);
   const target=value.slice(1,-1);if(tokens.get(target)?.$type!==token.$type)throw new Error(`Alias type mismatch: ${path}`);
   value=resolve(target,[...chain,path]);
  }
  serialize(token.$type,value);resolved.set(path,value);return value;
 }
 for(const path of tokens.keys())resolve(path);
 const declarations=group=>{
  const entries=[...tokens].filter(([path])=>path.startsWith(`${group}.`));if(!entries.length)throw new Error(`Missing token group: ${group}`);
  return entries.map(([path,token])=>{
   const name=path.slice(group.length+1);if(!/^[a-z][a-z0-9-]*$/.test(name))throw new Error(`Invalid CSS token name: ${name}`);
   let css=serialize(token.$type,resolved.get(path));
   if(typeof token.$value==='string'){
    const target=token.$value.slice(1,-1);if(!target.startsWith(`${group}.`))throw new Error('Web aliases must stay within their theme group');
    css=`var(--${target.slice(group.length+1)})`;
   }
   const extension=token.$extensions?.['io.dmf.web']?.css;
   if(extension){
    // Preserve authored CSS mixes only when they equal the portable color.
    const mix=extension.match(/^color-mix\(in srgb, (#[\da-f]{6}) (\d+(?:\.\d+)?)%, (#[\da-f]{6})\)$/i);
    const value=resolved.get(path),weight=mix?Number(mix[2])/100:NaN;
    if(!mix||weight<0||weight>1||token.$type!=='color'||value.colorSpace!=='srgb'||value.alpha!==1||value.components.some((component,i)=>Math.abs(component-(parseInt(mix[1].slice(1+i*2,3+i*2),16)*weight+parseInt(mix[3].slice(1+i*2,3+i*2),16)*(1-weight))/255)>1e-12))throw new Error('Unsupported or inconsistent CSS extension');
    css=extension;
   }
   return `  --${name}: ${css};`;
  }).join('\n');
 };
 const header='/* Generated from tokens/design.tokens.json. Run npm run tokens:build.\n   Fulldev / CB reconstruction provenance: docs/DMF-UI-UPSTREAM.json. */\n';
 const light=declarations('dmf.light'),dark=declarations('dmf.dark');
 const foundation=`${header}.dmf-ui {\n${light}\n}\n\n:root[data-theme="dark"] .dmf-ui {\n${dark}\n}\n\n@media (prefers-color-scheme: dark) {\n:root:not([data-theme]) .dmf-ui {\n${dark}\n}\n}\n`;
 const cb=`${header}/* Present-day CB UI reconstruction; light-only, not historical shipped UI. */\n@font-face {\n font-family: 'DMF CB Nunito'; src: url('../assets/fonts/nunito.ttf') format('truetype');\n font-style: normal; font-weight: 200 900; font-display: swap;\n}\n:root .dmf-ui[data-system="cb-ui"] {\n${declarations('cb.light')}\n}\n`;
 const portable={schemaVersion:1,description:'Alias-resolved authored groups, not complete platform themes. dmf.dark overrides dmf.light; cb.light overrides the ambient DMF theme. No pixel-density, text-scaling or native component policy is implied.',groups:Object.fromEntries(groups.map(group=>[group,Object.fromEntries([...tokens].filter(([path])=>path.startsWith(`${group}.`)).map(([path,token])=>[path.slice(group.length+1),{type:token.$type,value:resolved.get(path)}]))]))};
 return {'src/styles/dmf-ui-tokens.css':foundation,'src/styles/dmf-ui-cb.css':cb,'tokens/resolved.json':JSON.stringify(portable,null,2)+'\n'};
}
export async function buildTokens({check=false}={}){
 const source=JSON.parse(await readFile(new URL('tokens/design.tokens.json',root),'utf8'));
 for(const [path,content] of Object.entries(compileTokens(source))){
  const url=new URL(path,root);let previous;try{previous=await readFile(url,'utf8');}catch(error){if(error.code!=='ENOENT')throw error;}
  if(previous===content)continue;
  if(check)throw new Error(`Stale generated tokens: ${path}. Run npm run tokens:build.`);
  await writeFile(url,content);
 }
}
if(process.argv[1]===fileURLToPath(import.meta.url))await buildTokens({check:process.argv.includes('--check')});
