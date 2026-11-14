// M15 shadcn parity record.
// Reads the vendored shadcn base-nova sources (vendor/shadcn) and DMF UI's catalog and family sources, then writes
// docs/DMF-UI-SHADCN-PARITY.json: per shared family, shadcn's value, DMF's value and a status for variants, sizes,
// parts, slots, props and defaults, attributes and styled state hooks, plus the Nova utilities each slot, variant and
// size applies. Owner decisions live in docs/DMF-UI-SHADCN-PARITY-DECISIONS.json and turn a difference into
// `intentional`. `--write` regenerates; `--check` fails when the record is stale or a decision is orphaned.
// Gaps are reported, not failed: M16 closes them. Nothing here is packed.
import ts from 'typescript';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
const json=async path=>JSON.parse(await read(path));
const hash=value=>createHash('sha256').update(value).digest('hex');
const parse=(path,text)=>ts.createSourceFile(path,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const walk=(node,fn)=>{fn(node);ts.forEachChild(node,n=>walk(n,fn));};
const name=node=>node?.name?.text??node?.name?.getText?.();
const literal=node=>node&&(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node))?node.text:undefined;
const sorted=values=>[...new Set(values)].sort();
const pascal=slug=>slug.split('-').map(p=>p[0].toUpperCase()+p.slice(1)).join('');
const casesPath='src/data/shadcn-parity-cases.json',recordPath='docs/DMF-UI-SHADCN-PARITY.json',decisionsPath='docs/DMF-UI-SHADCN-PARITY-DECISIONS.json';
// Props every component forwards; they say nothing about parity.
const ignoredProps=new Set(['className','class','props','children','asChild','render','style','ref']);

// Attribute and state hooks named in class strings: data-active:, data-[variant=line]/tabs-list:, aria-invalid:,
// has-data-[icon=inline-end]:. Slot references (data-[slot=…]) describe nesting, not state, and are skipped.
export function stateHooks(text){
 const hooks=[];
 for(const match of text.matchAll(/(?<![\w-])(?:[a-z-]*?-)?((?:data|aria)-(?:\[[^\]\s]+\]|[a-z][a-z-]*))(?=[:/])/g)){
  let hook=match[1];
  if(/^data-\[slot[=~^$*|]/.test(hook)||hook==='data-slot')continue;
  hook=hook.replace(/^(data|aria)-\[([a-z-]+)(?:[=~^$*|].*)?\]$/,'$1-$2');
  hooks.push(hook);
 }
 return sorted(hooks);
}

// Nova utilities per cn-* class, from the vendored style-nova.css.
export function novaRules(css){
 const rules={};
 for(const match of css.matchAll(/\.(cn-[a-z0-9-]+)\s*\{\s*@apply\s+([^;]+);/g))rules[match[1]]=(rules[match[1]]?rules[match[1]]+' ':'')+match[2].trim();
 return rules;
}

export function readShadcn(path,source,nova){
 const ast=parse(path,source);
 const components={},cvas={},exports=[],dataAttributes=new Set(),slots=new Set(),unionAxes={};let classText='';
 walk(ast,node=>{
  const text=literal(node);if(text!==undefined&&!ts.isImportDeclaration(node.parent))classText+=' '+text;
  if(ts.isExportDeclaration(node)&&node.exportClause&&ts.isNamedExports(node.exportClause))exports.push(...node.exportClause.elements.map(e=>e.name.text));
  if(ts.isCallExpression(node)&&node.expression.getText(ast)==='cva'){
   const owner=ts.isVariableDeclaration(node.parent)?name(node.parent):'cva';
   const config=node.arguments[1],entry={base:literal(node.arguments[0])??'',variants:{},defaults:{}};
   if(config&&ts.isObjectLiteralExpression(config))for(const p of config.properties){
    if(!ts.isPropertyAssignment(p)||!ts.isObjectLiteralExpression(p.initializer))continue;
    if(name(p)==='variants')for(const axis of p.initializer.properties)if(ts.isPropertyAssignment(axis)&&ts.isObjectLiteralExpression(axis.initializer))entry.variants[name(axis)]=Object.fromEntries(axis.initializer.properties.filter(ts.isPropertyAssignment).map(k=>[name(k),literal(k.initializer)??'']));
    if(name(p)==='defaultVariants')for(const d of p.initializer.properties)if(ts.isPropertyAssignment(d))entry.defaults[name(d)]=literal(d.initializer)??d.initializer.getText(ast);
   }
   cvas[owner]=entry;
  }
  if(ts.isJsxAttribute(node)){
   const attr=node.name.getText(ast);
   const value=node.initializer&&ts.isStringLiteral(node.initializer)?node.initializer.text:undefined;
   if(attr==='data-slot'&&value)slots.add(value);
   else if(attr.startsWith('data-'))dataAttributes.add(attr);
  }
  if(ts.isFunctionDeclaration(node)&&name(node)&&/^[A-Z]/.test(name(node))){
   const props={};const binding=node.parameters[0]?.name;
   if(binding&&ts.isObjectBindingPattern(binding))for(const el of binding.elements){
    if(el.dotDotDotToken)continue;const prop=el.propertyName?.getText(ast)??el.name.getText(ast);
    if(ignoredProps.has(prop))continue;props[prop]=el.initializer?el.initializer.getText(ast).replace(/^(["'])([^"']*)\1$/,'$2'):null;
   }
   // Literal-union props declared inline, e.g. `& { size?: "default" | "sm" | "lg" }`, are variant axes too.
   const unions={};
   if(node.parameters[0]?.type)walk(node.parameters[0].type,t=>{if(ts.isPropertySignature(t)&&t.type&&ts.isUnionTypeNode(t.type)&&t.type.types.every(u=>ts.isLiteralTypeNode(u)&&ts.isStringLiteral(u.literal)))unions[name(t)]=t.type.types.map(u=>u.literal.text);});
   for(const [axis,keys] of Object.entries(unions)){unionAxes[axis]=sorted([...(unionAxes[axis]??[]),...keys]);if(!(axis in props))props[axis]=null;}
   // The root element is the first JSX element with a data-slot. Its className literals, any cva call it makes and
   // the data-* attributes it derives from props are what a reference rendering needs.
   let slot,root;
   walk(node,child=>{if(root||!(ts.isJsxOpeningElement(child)||ts.isJsxSelfClosingElement(child)))return;const a=child.attributes.properties.find(p=>ts.isJsxAttribute(p)&&p.name.getText(ast)==='data-slot'&&p.initializer&&ts.isStringLiteral(p.initializer));if(a){root=child;slot=a.initializer.text;}});
   const reference={classes:[],cva:null,attributes:{}};
   if(root)for(const a of root.attributes.properties){
    if(!ts.isJsxAttribute(a)||!a.initializer)continue;const attr=a.name.getText(ast);
    if(attr==='className'){
     if(ts.isStringLiteral(a.initializer))reference.classes.push(a.initializer.text);
     else walk(a.initializer,c=>{if(ts.isCallExpression(c)&&ts.isIdentifier(c.expression)&&c.expression.text!=='cn')reference.cva=c.expression.text;const t=literal(c);if(t!==undefined&&!(ts.isCallExpression(c.parent)&&c.parent.expression.getText(ast)!=='cn'&&c.parent.arguments.includes(c)))reference.classes.push(t);});
    }else if(attr.startsWith('data-')&&attr!=='data-slot'){
     if(ts.isStringLiteral(a.initializer))reference.attributes[attr]={value:a.initializer.text};
     else if(ts.isJsxExpression(a.initializer)&&a.initializer.expression&&ts.isIdentifier(a.initializer.expression))reference.attributes[attr]={prop:a.initializer.expression.text};
    }
   }
   // useRender components (Badge, Item, …) name their slot and data attributes in `state` and their classes in props.
   if(!root)walk(node,c=>{
    if(slot||!ts.isCallExpression(c)||c.expression.getText(ast)!=='useRender')return;const options=c.arguments[0];if(!options||!ts.isObjectLiteralExpression(options))return;
    const state=options.properties.find(p=>name(p)==='state');
    if(state&&ts.isPropertyAssignment(state)&&ts.isObjectLiteralExpression(state.initializer))for(const p of state.initializer.properties){
     if(name(p)==='slot'&&ts.isPropertyAssignment(p))slot=literal(p.initializer);
     else if(ts.isShorthandPropertyAssignment(p))reference.attributes[`data-${name(p)}`]={prop:name(p)};
     else if(ts.isPropertyAssignment(p)&&ts.isIdentifier(p.initializer))reference.attributes[`data-${name(p)}`]={prop:p.initializer.text};
    }
    walk(options,k=>{if(ts.isPropertyAssignment(k)&&name(k)==='className')walk(k.initializer,v=>{if(ts.isCallExpression(v)&&ts.isIdentifier(v.expression)&&v.expression.text!=='cn')reference.cva=v.expression.text;const t=literal(v);if(t!==undefined&&!(ts.isCallExpression(v.parent)&&v.parent.expression.getText(ast)!=='cn'))reference.classes.push(t);});});
   });
   reference.classes=reference.classes.filter(c=>c.trim());
   components[name(node)]={slot:slot??null,props,reference,unions};
  }
 });
 const used=sorted([...classText.matchAll(/(?<![\w-])(cn-[a-z0-9-]+)/g)].map(m=>m[1]));
 const novaText=used.map(c=>nova[c]??'').join(' ');
 return {exports:sorted(exports),components,cvas,unionAxes,slots:sorted(slots),dataAttributes:sorted(dataAttributes),stateHooks:sorted([...stateHooks(classText),...stateHooks(novaText)]),novaClasses:used};
}

async function readDmf(family){
 const dir=family.entry.replace(/^\.\//,'').replace(/\/index\.ts$/,'');
 const index=await read(`${dir}/index.ts`);
 const fileToExport={};
 for(const m of index.matchAll(/export\s*\{\s*default\s+as\s+(\w+)\s*\}\s*from\s*["']\.\/([\w.-]+)["']/g))fileToExport[m[2]]=m[1];
 const exports=sorted([...index.matchAll(/export\s*\{([^}]+)\}/g)].flatMap(m=>m[1].split(',').map(s=>s.trim().split(/\s+as\s+/).pop()).filter(Boolean)).concat([...index.matchAll(/export\s+(?:const|function|type)\s+(\w+)/g)].map(m=>m[1])).filter(n=>!/^type\s/.test(n)));
 const components={},axes={};
 for(const [axis,keys] of Object.entries(family.variants??{}))axes[axis]=sorted(keys);
 for(const part of family.parts){
  const file=part.file.split('/').pop(),component=fileToExport[file]??pascal(file.replace(/\.astro$/,''));
  const props={};
  for(const p of part.properties){
   if(ignoredProps.has(p.name))continue;
   const key=`${file}:${p.name}`;props[p.name]=key in family.defaults?family.defaults[key].replace(/^(["'])([^"']*)\1$/,'$2'):null;
   const union=p.type.split('|').map(s=>s.trim());
   if(p.name!=='as'&&union.length>1&&union.every(s=>/^["'][^"']+["']$/.test(s)))axes[p.name]=sorted([...(axes[p.name]??[]),...union.map(s=>s.slice(1,-1))]);
  }
  for(const [key,value] of Object.entries(family.defaults))if(key.startsWith(file+':')){const prop=key.slice(file.length+1);if(!ignoredProps.has(prop)&&prop!=='as')props[prop]=value.replace(/^(["'])([^"']*)\1$/,'$2');}
  components[component]={slot:part.dataSlots[0]??null,props};
 }
 let source='';const dataAttributes=new Set();
 for(const f of (await readdir(new URL(`${dir}/`,root))).filter(f=>/\.(astro|ts)$/.test(f))){
  const text=await read(`${dir}/${f}`);source+='\n'+text;
  for(const m of text.matchAll(/(?<![\w-])(data-[a-z][a-z-]*)\s*=/g))if(m[1]!=='data-slot')dataAttributes.add(m[1]);
  for(const m of text.matchAll(/setAttribute\(\s*["'](data-[a-z-]+)["']/g))dataAttributes.add(m[1]);
  for(const m of text.matchAll(/dataset\.([a-zA-Z]+)\s*=/g))dataAttributes.add('data-'+m[1].replace(/[A-Z]/g,c=>'-'+c.toLowerCase()));
 }
 return {exports,components,axes,slots:sorted(family.parts.flatMap(p=>p.dataSlots)),dataAttributes:sorted(dataAttributes),stateHooks:stateHooks(source)};
}

// Root components the measuring scenario renders standalone, with the text they get as children (void: none).
// Parts that need a parent, children (Progress needs its track, Table its rows), an open overlay or script state are
// measured in a later round. `tag` and `state` stand in for the element and resting data attributes Base UI renders.
export const measured={
 'alert':{Alert:{text:'Alert'}},'aspect-ratio':{AspectRatio:{text:'',props:{ratio:1.5}}},'avatar':{Avatar:{void:true,props:{name:'Ada Byron'}}},'badge':{Badge:{text:'Badge'}},
 'button':{Button:{text:'Label'}},'button-group':{ButtonGroup:{text:'Group'}},'card':{Card:{text:'Card'}},'checkbox':{Checkbox:{void:true,tag:'span',state:{'data-unchecked':'',role:'checkbox'}}},
 'empty':{Empty:{text:'Empty'}},'field':{Field:{text:'Field'}},'input':{Input:{void:true}},'input-group':{InputGroup:{text:''}},
 'item':{Item:{text:'Item'}},'kbd':{Kbd:{text:'K'}},'label':{Label:{text:'Label'}},'native-select':{NativeSelect:{void:true}},
 'separator':{Separator:{void:true,state:{'data-orientation':'horizontal'}}},'skeleton':{Skeleton:{void:true}},'spinner':{Spinner:{void:true}},
 'switch':{Switch:{void:true,tag:'span',state:{'data-unchecked':'',role:'switch'}}},'textarea':{Textarea:{void:true}},'toggle':{Toggle:{text:'Bold',tag:'button'}},
};

// One case per variant combination: the full product of the component's axes when it is small (Button's 6 variants x
// 8 sizes), otherwise each axis value with the others at their defaults.
function casesFor(slug,s,d){
 const out=[];
 for(const [component,options] of Object.entries(measured[slug]??{})){
  const sc=s.components[component];if(!sc||!d.components[component])throw Error(`${slug}: ${component} is not exported by both sides`);
  const cva=sc.reference.cva?s.cvas[sc.reference.cva]:null,axes={...(cva?Object.fromEntries(Object.entries(cva.variants).map(([a,k])=>[a,Object.keys(k)])):{}),...sc.unions};
  const defaults={...(cva?.defaults??{})};for(const a of Object.keys(axes))defaults[a]??=sc.props[a]??axes[a][0];
  const names=Object.keys(axes),product=names.reduce((n,a)=>n*axes[a].length,1);
  let combos=[{}];
  if(product<=72)for(const a of names)combos=combos.flatMap(c=>axes[a].map(v=>({...c,[a]:v})));
  else combos=[{...defaults},...names.flatMap(a=>axes[a].filter(v=>v!==defaults[a]).map(v=>({...defaults,[a]:v})))];
  for(const combo of combos){
   const values={...defaults,...combo};
   const classes=[...sc.reference.classes,...(cva?[cva.base,...Object.entries(cva.variants).map(([a,k])=>k[values[a]]??'')]:[])].join(' ').split(/\s+/).filter(Boolean);
   const attributes={'data-slot':sc.slot,...(options.state??{})};
   for(const [attr,source] of Object.entries(sc.reference.attributes))attributes[attr]=source.value??values[source.prop]??sc.props[source.prop]??'';
   const dmfProps={...(options.props??{})},unsupported=[];
   for(const [axis,value] of Object.entries(values)){if(d.axes[axis]?.includes(value))dmfProps[axis]=value;else unsupported.push(axis);}
   const query=Object.entries(values).map(([a,v])=>`${a}=${v}`).join('&');
   out.push({id:`${slug}/${component}${query?'?'+query:''}`,family:slug,component,slot:sc.slot,values,text:options.text??'',void:!!options.void,reference:{tag:options.tag??null,classes:sorted(classes),attributes},dmf:{props:dmfProps},unsupported});
  }
 }
 return out;
}

const shadcnAxes=s=>{const axes=structuredClone(s.unionAxes);for(const c of Object.values(s.cvas))for(const [axis,keys] of Object.entries(c.variants))axes[axis]=sorted([...(axes[axis]??[]),...Object.keys(keys)]);return axes;};

// A decision id may end in `*` to cover every item with that prefix, e.g. `dataAttributes:data-close-*`.
const decide=(decisions,id)=>decisions[id]??Object.entries(decisions).find(([k])=>k.endsWith('*')&&id.startsWith(k.slice(0,-1)))?.[1];

// Compare two name lists. A shadcn-only item is a gap; a DMF-only item is an extra until a decision explains it.
function compareSets(shadcn,dmf,decisions,prefix){
 const s=new Set(shadcn),d=new Set(dmf),items=[];
 for(const v of sorted([...s,...d])){
  const id=`${prefix}:${v}`,both=s.has(v)&&d.has(v);
  const reason=both?undefined:decide(decisions,id);
  const status=both?'match':reason?'intentional':s.has(v)?'gap':'extra';
  items.push({id,value:v,shadcn:s.has(v),dmf:d.has(v),status,...(reason?{reason}:{})});
 }
 return items;
}

export async function build(){
 const catalog=await json('contracts/catalog.json'),manifest=await json('vendor/shadcn/MANIFEST.json');
 const novaSource=await read('vendor/shadcn/style-nova.css'),nova=novaRules(novaSource);
 const decisionsFile=await json(decisionsPath).catch(()=>({families:{}}));
 const shadcnFamilies=manifest.files.filter(f=>f.path.startsWith('vendor/shadcn/base/')).map(f=>f.path.match(/base\/(.+)\.tsx\.txt$/)[1]);
 const dmfBySlug=Object.fromEntries(catalog.components.map(c=>[c.slug,c]));
 const shared=shadcnFamilies.filter(f=>dmfBySlug[f]).sort();
 const families={},used=new Set(),cases=[];
 for(const slug of shared){
  const path=`vendor/shadcn/base/${slug}.tsx.txt`,s=readShadcn(path,await read(path),nova),d=await readDmf(dmfBySlug[slug]);
  const decisions=decisionsFile.families?.[slug]??{};
  cases.push(...casesFor(slug,s,d));
  const sAxes=shadcnAxes(s),axes={};
  for(const axis of sorted([...Object.keys(sAxes),...Object.keys(d.axes)]))axes[axis]=compareSets(sAxes[axis]??[],d.axes[axis]??[],decisions,`variants.${axis}`);
  // Defaults and props per component that both sides export.
  const props=[];
  for(const component of sorted([...Object.keys(s.components),...Object.keys(d.components)])){
   const sc=s.components[component],dc=d.components[component];if(!sc||!dc)continue;
   for(const prop of sorted([...Object.keys(sc.props),...Object.keys(dc.props)])){
    const id=`props.${component}.${prop}`,inS=prop in sc.props,inD=prop in dc.props;
    const same=inS&&inD&&(sc.props[prop]===dc.props[prop]||sc.props[prop]===null||dc.props[prop]===null);
    const reason=same?undefined:decide(decisions,id);
    const status=same?'match':reason?'intentional':inS&&!inD?'gap':!inS?'extra':'differs';
    props.push({id,component,prop,shadcn:inS?{default:sc.props[prop]}:null,dmf:inD?{default:dc.props[prop]}:null,status,...(reason?{reason}:{})});
   }
  }
  // Nova specification: utilities per variant and size key, and per slot's base classes.
  const spec={};
  for(const [owner,c] of Object.entries(s.cvas)){
   spec[owner]={base:sorted(c.base.split(/\s+/).filter(t=>t.startsWith('cn-'))).map(cls=>({class:cls,utilities:nova[cls]??null})),defaults:c.defaults,variants:{}};
   for(const [axis,keys] of Object.entries(c.variants))spec[owner].variants[axis]=Object.fromEntries(Object.entries(keys).map(([k,cls])=>[k,{classes:cls,utilities:cls.split(/\s+/).filter(t=>t.startsWith('cn-')).map(t=>nova[t]).filter(Boolean).join(' ')||null}]));
  }
  const sections={
   parts:compareSets(s.exports.filter(e=>/^[A-Z]/.test(e)),d.exports.filter(e=>/^[A-Z]/.test(e)),decisions,'parts'),
   slots:compareSets(s.slots,d.slots,decisions,'slots'),
   variants:axes,
   props,
   dataAttributes:compareSets(s.dataAttributes,d.dataAttributes,decisions,'dataAttributes'),
   stateHooks:compareSets(s.stateHooks,d.stateHooks,decisions,'stateHooks'),
  };
  const all=[...sections.parts,...sections.slots,...Object.values(axes).flat(),...props,...sections.dataAttributes,...sections.stateHooks];
  for(const id of Object.keys(decisions))used.add(`${slug}/${id}`);
  const counts=Object.fromEntries(['match','intentional','gap','differs','extra'].map(k=>[k,all.filter(i=>i.status===k).length]));
  families[slug]={name:dmfBySlug[slug].name,shadcn:{source:path,sha256:manifest.files.find(f=>f.path===path).sha256,docs:`vendor/shadcn/docs/${slug}.mdx`},counts,...sections,nova:{classes:s.novaClasses,cva:spec},measured:null};
 }
 const orphans=[];
 for(const [slug,decisions] of Object.entries(decisionsFile.families??{}))for(const id of Object.keys(decisions)){
  const f=families[slug];const items=f?[...f.parts,...f.slots,...Object.values(f.variants).flat(),...f.props,...f.dataAttributes,...f.stateHooks]:[];
  const hits=id.endsWith('*')?items.filter(i=>i.id.startsWith(id.slice(0,-1))):items.filter(i=>i.id===id);
  if(!hits.some(i=>i.status==='intentional'))orphans.push(`${slug}/${id}`);
 }
 const totals={families:shared.length};for(const k of ['match','intentional','gap','differs','extra'])totals[k]=Object.values(families).reduce((n,f)=>n+f.counts[k],0);
 return {record:{
  schemaVersion:1,
  milestone:'M15',
  reference:{repository:manifest.repository,revision:manifest.revision,style:manifest.style,stylesheet:{path:'vendor/shadcn/style-nova.css',sha256:hash(novaSource)}},
  statuses:{match:'Same name or value on both sides.',intentional:'Differs on purpose; the reason comes from the decisions file.',gap:'shadcn has it and DMF UI does not. M16 closes it.',differs:'Both have it with different defaults. M16 matches it or records a decision.',extra:'DMF UI has it and shadcn does not. Needs a decision: keep (intentional) or remove.'},
  limits:['Names are compared statically. Base UI sets some ARIA and data attributes at runtime; those appear only where shadcn styles them (stateHooks).','Variant axes are merged per family on both sides.','Rendered dimensions are measured by the shadcn-parity browser scenario and stored under `measured`.'],
  shadcnOnly:shadcnFamilies.filter(f=>!dmfBySlug[f]).sort(),
  totals,
  families,
 },cases,orphans};
}

const format=value=>JSON.stringify(value,null,1)+'\n';
if(process.argv.includes('--write')||process.argv.includes('--check')){
 const {record,cases,orphans}=await build();
 const casesText=format({about:'Generated by scripts/shadcn-parity.mjs for the internal shadcn parity page and scenario.',cases});
 const existing=await read(recordPath).catch(()=>null);
 if(existing){const previous=JSON.parse(existing);for(const [slug,f] of Object.entries(record.families))f.measured=previous.families?.[slug]?.measured??null;}
 // --measured <file> stores the scenario's differences per family: case count and, per theme, differing properties.
 const measuredArg=process.argv.indexOf('--measured');
 if(measuredArg>0){
  const summary=JSON.parse(await readFile(process.argv[measuredArg+1],'utf8'));
  for(const [slug,f] of Object.entries(record.families)){
   const ids=cases.filter(c=>c.family===slug).map(c=>c.id);
   if(!ids.length){f.measured=null;continue;}
   const pick=theme=>Object.fromEntries(Object.entries(summary.differences[theme]).filter(([id])=>ids.includes(id)));
   const differences={light:pick('light'),dark:pick('dark')};
   f.measured={cases:ids.length,matching:{light:ids.length-Object.keys(differences.light).length,dark:ids.length-Object.keys(differences.dark).length},differences};
  }
  record.measuredTotals={cases:cases.length,matching:{light:cases.length-Object.keys(summary.differences.light).length,dark:cases.length-Object.keys(summary.differences.dark).length}};
 }else if(existing)record.measuredTotals=JSON.parse(existing).measuredTotals;
 if(orphans.length){console.error(`Decisions that no longer match a difference:\n ${orphans.join('\n ')}`);process.exit(1);}
 if(process.argv.includes('--write')){await writeFile(new URL(recordPath,root),format(record));await writeFile(new URL(casesPath,root),casesText);console.log(`Wrote ${recordPath} and ${cases.length} cases:`,record.totals);}
 else if(existing!==format(record)||await read(casesPath).catch(()=>null)!==casesText){console.error(`${recordPath} or ${casesPath} is stale; run npm run shadcn:write`);process.exit(1);}
 else console.log('shadcn parity record is current:',record.totals);
}
