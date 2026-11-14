// M15 optimization baseline: what each DMF UI family costs today, so M16 changes can be measured against it.
// For every catalog family it records
//  - CSS: the Tailwind utilities its own sources emit (compiled against DMF UI's theme, the way a consumer builds them)
//    plus the hand-written rules in the shipped stylesheets that target its `.dmf-<family>` classes or its data slots;
//  - shadcn CSS, for shared families: the base-nova rules for its cn-* classes plus the utilities its source emits,
//    compiled against the same theme;
//  - JavaScript: its own client <script> blocks bundled and minified with their imports (Data Slot and DMF helpers);
//  - axe results and how it renders without JavaScript, both written by the `baseline` browser scenario.
// Sizes are minified bytes and gzip bytes (level 9). Families share utilities and helpers, so the per-family numbers
// are each family's cost on its own and do not add up to the package. The record is docs/DMF-UI-BASELINE.json.
// `--write` regenerates the static part, `--browser <file>` merges a scenario result, `--check` fails when the static
// part is stale. Nothing here is packed.
import {compile} from '@tailwindcss/node';
import {Scanner} from '@tailwindcss/oxide';
import {transform} from 'lightningcss';
import postcss from 'postcss';
import {rolldown} from 'rolldown';
import {gzipSync} from 'node:zlib';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {novaRules,readShadcn} from './shadcn-parity.mjs';

const root=new URL('../',import.meta.url);
const rootPath=fileURLToPath(root);
const styles=fileURLToPath(new URL('src/styles/',root));
const read=path=>readFile(new URL(path,root),'utf8');
const json=async path=>JSON.parse(await read(path));
export const recordPath='docs/DMF-UI-BASELINE.json';

export function size(css){
 const code=transform({code:Buffer.from(css),minify:true,filename:'baseline.css'}).code;
 return {bytes:code.length,gzip:gzipSync(code,{level:9}).length};
}
const jsSize=code=>({bytes:Buffer.byteLength(code),gzip:gzipSync(code,{level:9}).length});
const stripComments=css=>{const tree=postcss.parse(css);tree.walkComments(c=>c.remove());return tree.toString();};

// A fresh compiler per family, because a compiler keeps every candidate it has built.
async function utilities(input,pattern){
 const compiler=await compile(input,{base:styles,onDependency(){}});
 const scanner=new Scanner({sources:[{base:rootPath,pattern,negated:false}]});
 return stripComments(compiler.build(scanner.scan()));
}

// Which families a hand-written selector targets: `.dmf-<slug>` classes (longest slug wins, so `.dmf-input-group-x`
// is Input Group) and data-slot selectors, exact or by prefix.
export function ownersOf(selector,slugs,slotOwner){
 const owners=new Set();
 for(const [,name] of selector.matchAll(/\.dmf-([a-z][a-z0-9-]*)/g)){
  const slug=slugs.filter(s=>name===s||name.startsWith(`${s}-`)).sort((a,b)=>b.length-a.length)[0];
  if(slug)owners.add(slug);
 }
 for(const [,op,slot] of selector.matchAll(/data-slot\s*([~^$*|]?)=\s*["']?([a-z0-9-]+)/g)){
  for(const [s,owner] of slotOwner)if(op==='^'?s.startsWith(slot):s===slot)owners.add(owner);
 }
 return owners;
}

// Keeps the rules a predicate accepts, with their at-rule parents, and drops whatever is left empty. Keyframes stay
// when a kept rule animates with them. @property and @font-face stay only with `atRules` (they belong to utilities).
export function filterRules(css,keep,{atRules=false}={}){
 const tree=postcss.parse(css);
 const inKeyframes=node=>{for(let p=node.parent;p;p=p.parent)if(p.type==='atrule'&&/keyframes$/.test(p.name))return true;return false;};
 tree.walkRules(rule=>{if(rule.parent?.type==='rule'||inKeyframes(rule))return;if(!keep(rule.selector))rule.remove();});
 if(!atRules)tree.walkAtRules(at=>{if(['property','font-face'].includes(at.name)||at.name==='layer'&&!at.nodes)at.remove();});
 // Tailwind registers every --tw-* variable the whole stylesheet uses; keep the ones the kept rules use.
 const inProperties=node=>{for(let p=node.parent;p;p=p.parent)if(p.type==='atrule'&&p.name==='layer'&&p.params==='properties')return true;return false;};
 const used=new Set();
 tree.walkDecls(decl=>{if(inProperties(decl))return;if(decl.prop.startsWith('--'))used.add(decl.prop);for(const [,v] of decl.value.matchAll(/var\(\s*(--[\w-]+)/g))used.add(v);});
 tree.walkAtRules('property',at=>{if(!used.has(at.params.trim()))at.remove();});
 tree.walkDecls(decl=>{if(inProperties(decl)&&decl.prop.startsWith('--')&&!used.has(decl.prop))decl.remove();});
 tree.walkRules(rule=>{if(!rule.nodes.length)rule.remove();});
 const animated=new Set();
 tree.walkDecls(/^animation(-name)?$/,decl=>{if(!inKeyframes(decl))for(const word of decl.value.split(/[\s,]+/))animated.add(word);});
 tree.walkAtRules(/keyframes$/,at=>{if(!animated.has(at.params.trim()))at.remove();});
 let removed=true;
 while(removed){removed=false;tree.walkAtRules(at=>{if(at.nodes&&!at.nodes.length){at.remove();removed=true;}});}
 return tree.toString();
}

// Each family's own <script> blocks, bundled together with what they import.
async function scripts(slug){
 const dir=fileURLToPath(new URL(`src/components/dmf-ui/${slug}/`,root));
 const modules=new Map();
 for(const file of (await readdir(dir)).filter(f=>f.endsWith('.astro')).sort()){
  const text=await readFile(dir+file,'utf8');
  [...text.matchAll(/<script(?![^>]*is:inline)[^>]*>([\s\S]*?)<\/script>/g)].forEach((m,i)=>modules.set(`${dir}${file}.script-${i}.ts`,m[1]));
 }
 // Runtime the family re-exports for consumers to start themselves, such as Toast's createToast.
 const index=await readFile(dir+'index.ts','utf8').catch(()=>'');
 let consumer=0;
 for(const [,names,pkg] of index.matchAll(/^export\s*\{([^}]*)\}\s*from\s*["'](@data-slot\/[a-z-]+)["']/gm)){
  const values=names.split(',').map(n=>n.trim()).filter(n=>n&&!n.startsWith('type '));
  if(values.length){modules.set(`${dir}index.ts.runtime-${consumer++}.ts`,`import {${values.join(',')}} from ${JSON.stringify(pkg)};\nglobalThis.__dmfBaseline=[${values.join(',')}];`);}
 }
 if(!modules.size)return null;
 const entry='\0dmf-ui-baseline-entry';
 const bundle=await rolldown({input:entry,logLevel:'silent',plugins:[{name:'astro-scripts',
  resolveId(id){if(id===entry||modules.has(id))return id;},
  load(id){if(id===entry)return [...modules.keys()].map(k=>`import ${JSON.stringify(k)};`).join('\n');return modules.get(id);}}]});
 try{
  const {output}=await bundle.generate({format:'esm',minify:true});
  const code=output.filter(o=>o.type==='chunk').map(o=>o.code).join('');
  return {scripts:modules.size-consumer,consumerRuntime:consumer>0,...jsSize(code)};
 }finally{await bundle.close();}
}

export async function build(){
 const catalog=await json('contracts/catalog.json');
 const slugs=catalog.components.map(c=>c.slug).sort();
 const slotOwner=new Map(catalog.components.flatMap(c=>c.parts.flatMap(p=>p.dataSlots).map(s=>[s,c.slug])));
 // The shipped stylesheet without utilities: theme, tokens, presets and hand-written component rules.
 const sheet=stripComments((await compile('@import "./dmf-ui.css";',{base:styles,onDependency(){}})).build([]));
 const sheetSize=size(sheet);
 const attributed=filterRules(sheet,selector=>ownersOf(selector,slugs,slotOwner).size>0);
 const nova=await read('vendor/shadcn/style-nova.css');
 const novaMap=novaRules(nova);
 const manifest=await json('vendor/shadcn/MANIFEST.json');
 const shadcnFamilies=new Set(manifest.files.map(f=>f.path.match(/base\/(.+)\.tsx\.txt$/)?.[1]).filter(Boolean));
 const families={};
 for(const slug of slugs){
  const own=await utilities('@reference "./dmf-ui.css";\n@tailwind utilities source(none);',`src/components/dmf-ui/${slug}/**/*`);
  const rules=filterRules(sheet,selector=>ownersOf(selector,slugs,slotOwner).has(slug));
  const css={utilities:size(own),rules:size(rules),total:size(own+rules)};
  let shadcn=null;
  if(shadcnFamilies.has(slug)){
   const path=`vendor/shadcn/base/${slug}.tsx.txt`;
   const classes=new Set(readShadcn(`${slug}.tsx`,await read(path),novaMap).novaClasses);
   const compiled=await utilities('@reference "./dmf-ui.css";\n@import "../../vendor/shadcn/style-nova.css";\n@tailwind utilities source(none);',path);
   // Nova rules for this family's cn-* classes, plus the utilities its source writes inline.
   const kept=filterRules(compiled,selector=>{const used=[...selector.matchAll(/\.(cn-[a-z0-9-]+)/g)].map(m=>m[1]);return !used.length||used.some(c=>classes.has(c));},{atRules:true});
   shadcn={css:size(kept),novaClasses:classes.size};
  }
  families[slug]={shadcn:shadcnFamilies.has(slug),css,shadcnCss:shadcn?.css??null,js:await scripts(slug)};
 }
 const sum=(list,pick)=>list.reduce((a,f)=>{const v=pick(f);return v?{bytes:a.bytes+v.bytes,gzip:a.gzip+v.gzip}:a;},{bytes:0,gzip:0});
 const list=Object.values(families),shared=list.filter(f=>f.shadcnCss);
 return {
  about:'M15 optimization baseline. Generated by scripts/dmf-ui-baseline.mjs (static sizes) and the `baseline` browser scenario (axe, withoutJs). Sizes are minified and gzip (level 9) bytes for each family on its own; families share utilities and helpers, so they do not add up to the package.',
  tools:{tailwindcss:(await json('node_modules/tailwindcss/package.json')).version,rolldown:(await json('node_modules/rolldown/package.json')).version,lightningcss:(await json('node_modules/lightningcss/package.json')).version},
  stylesheet:{compiled:sheetSize,componentRules:size(attributed),note:'dmf-ui.css compiled without utilities: theme, tokens, presets and hand-written rules. componentRules is the part attributed to a family; the rest is shared.'},
  totals:{
   families:slugs.length,
   withScripts:list.filter(f=>f.js).length,
   js:sum(list,f=>f.js),
   sharedFamilies:{count:shared.length,dmfCss:sum(shared,f=>f.css.total),shadcnCss:sum(shared,f=>f.shadcnCss),smallerThanShadcn:shared.filter(f=>f.css.total.bytes<f.shadcnCss.bytes).length},
  },
  families,
 };
}

// Browser fields survive regeneration; --browser <file> replaces them with a scenario result.
export function merge(record,previous,browser){
 for(const [slug,f] of Object.entries(record.families)){
  const from=browser?.families?.[slug]??previous?.families?.[slug];
  f.axe=from?.axe??null;f.withoutJs=from?.withoutJs??null;
 }
 const source=browser??previous;
 if(source?.browser)record.browser=source.browser;
 const values=Object.values(record.families);
 record.totals.axe={audited:values.filter(f=>f.axe).length,withViolations:values.filter(f=>f.axe&&(f.axe.light.length||f.axe.dark.length)).length};
 record.totals.withoutJs=Object.fromEntries(['static','same','reduced','more','no-preview'].map(k=>[k,values.filter(f=>f.withoutJs?.status===k).length]));
 return record;
}

// Byte counts must match exactly; gzip output may differ by a few bytes between zlib builds.
export function stale(current,committed,path=''){
 if(path.endsWith('.gzip')&&typeof current==='number'&&typeof committed==='number')return Math.abs(current-committed)>Math.max(8,committed*0.02)?[path]:[];
 if(current&&committed&&typeof current==='object'&&typeof committed==='object'){
  const keys=new Set([...Object.keys(current),...Object.keys(committed)]);
  return [...keys].flatMap(k=>stale(current[k],committed[k],`${path}.${k}`));
 }
 return JSON.stringify(current)===JSON.stringify(committed)?[]:[path];
}

const format=value=>JSON.stringify(value,null,1)+'\n';
const main=process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href;
if(main){
 const write=process.argv.includes('--write'),check=process.argv.includes('--check'),browserArg=process.argv.indexOf('--browser');
 if(!write&&!check&&browserArg<0){console.error('Usage: node scripts/dmf-ui-baseline.mjs --write [--browser <file>] | --check');process.exit(2);}
 const previous=await read(recordPath).then(JSON.parse).catch(()=>null);
 const browser=browserArg>0?JSON.parse(await readFile(process.argv[browserArg+1],'utf8')):null;
 const record=merge(await build(),previous,browser);
 if(check){
  const diffs=previous?stale(record,previous):['(missing)'];
  if(diffs.length){console.error(`${recordPath} is stale (${diffs.slice(0,8).join(', ')}${diffs.length>8?' …':''}); run npm run baseline:write`);process.exit(1);}
  console.log('DMF UI baseline is current:',JSON.stringify(record.totals));
 }else{await writeFile(new URL(recordPath,root),format(record));console.log(`Wrote ${recordPath}:`,JSON.stringify(record.totals));}
}
