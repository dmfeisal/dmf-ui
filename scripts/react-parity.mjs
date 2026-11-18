// M17 React parity record. Compares the React adapter (packages/react/src/index.tsx) and its shared button variants
// (@dmf-ui/core/button/variants) with shadcn/ui base-nova, using the same extractor and status rules as the Astro record
// (scripts/shadcn-parity.mjs). For each React export that maps to a shadcn family it records exports (parts), data-slot
// names (slots), variant axes, props and their defaults, and data-* attributes. Owner decisions live in
// docs/DMF-UI-REACT-PARITY-DECISIONS.json. `--write` regenerates docs/DMF-UI-REACT-PARITY.json; `--check` fails when it is
// stale or a decision matches nothing. Nothing here is packed. Blocks are not part of shadcn and are listed as shadcnOnly/dmfOnly.
import ts from 'typescript';
import {readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {novaRules,readShadcn,compareSets} from './shadcn-parity.mjs';

const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
const json=async path=>JSON.parse(await read(path));
const sorted=values=>[...new Set(values)].sort();
const name=node=>node?.name?.text??node?.name?.getText?.();
const literal=node=>node&&(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node))?node.text:undefined;
const walk=(node,fn)=>{fn(node);ts.forEachChild(node,n=>walk(n,fn));};
export const recordPath='docs/DMF-UI-REACT-PARITY.json',decisionsPath='docs/DMF-UI-REACT-PARITY-DECISIONS.json';
const ignored=new Set(['className','children','ref','key','style']);

// Which shadcn family each React export belongs to. Blocks and Text are DMF UI's own.
export const families={
 button:{exports:['Button'],variants:'button'},
 input:{exports:['Input']},card:{exports:['Card','CardHeader','CardTitle','CardDescription','CardAction','CardContent','CardFooter']},
 switch:{exports:['Switch']},badge:{exports:['Badge']},
 alert:{exports:['Alert','AlertTitle','AlertDescription','AlertAction']},
 label:{exports:['Label']},textarea:{exports:['Textarea']},checkbox:{exports:['Checkbox']},separator:{exports:['Separator']},
 field:{exports:['Field','FieldGroup','FieldContent','FieldLabel','FieldTitle','FieldDescription','FieldError','FieldSet','FieldLegend','FieldSeparator']},
 'radio-group':{exports:['RadioGroup','RadioGroupItem']},
 select:{exports:['Select','SelectTrigger','SelectValue','SelectContent','SelectGroup','SelectItem','SelectLabel','SelectSeparator']},
};
export const dmfOnly=['Text','OTPVerificationBlock','ResetPasswordBlock','SignUpBlock','PasswordRecoveryBlock','SearchFiltersBlock','SignInBlock','HeroBlock','MerchantListingBlock','MerchantCard'];

// Reads each exported function: its props (destructured with defaults), the data-slot and classes of its root JSX,
// and the data-* attributes it writes.
export function readReact(source){
 const ast=ts.createSourceFile('index.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const components={};
 for(const statement of ast.statements){
  if(!ts.isFunctionDeclaration(statement)||!statement.name||!statement.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword))continue;
  const component=name(statement),props={};
  const binding=statement.parameters[0]?.name;
  if(binding&&ts.isObjectBindingPattern(binding))for(const el of binding.elements){
   if(el.dotDotDotToken)continue;const prop=el.propertyName?.getText(ast)??el.name.getText(ast);
   if(ignored.has(prop))continue;
   props[prop]=el.initializer?el.initializer.getText(ast).replace(/^(["'])([^"']*)\1$/,'$2'):null;
  }
  let slot=null;const slots=new Set();const classes=[];const attributes=new Set();
  walk(statement,node=>{
   if(!(ts.isJsxOpeningElement(node)||ts.isJsxSelfClosingElement(node)))return;
   for(const attr of node.attributes.properties){
    if(!ts.isJsxAttribute(attr)||!attr.initializer)continue;
    const attrName=attr.name.getText(ast);
    if(attrName==='data-slot'){const value=literal(attr.initializer)??(ts.isJsxExpression(attr.initializer)?literal(attr.initializer.expression):undefined);if(value){slots.add(value);if(!slot)slot=value;}}
    else if(attrName.startsWith('data-'))attributes.add(attrName);
    if(attrName==='className'){walk(attr.initializer,c=>{const t=literal(c);if(t)classes.push(t);});}
   }
  });
  components[component]={props,slot,slots:sorted([...slots]),classes:sorted(classes.join(' ').split(/\s+/).filter(Boolean)),attributes:sorted([...attributes])};
 }
 return components;
}

export async function build(){
 const nova=novaRules(await read('vendor/shadcn/style-nova.css'));
 const manifest=await json('vendor/shadcn/MANIFEST.json');
 const decisions=await json(decisionsPath).catch(()=>({families:{}}));
 const react=readReact(await read('packages/react/src/index.tsx')+'\n'+await read('packages/react/src/select.tsx'));
 const buttonVariants=readShadcn('button-variants.ts',await read('src/components/dmf-ui/button/button-variants.ts'),nova);
 const out={};
 for(const [slug,map] of Object.entries(families)){
  const shadcnSource=await read(`vendor/shadcn/base/${slug}.tsx.txt`),s=readShadcn(`${slug}.tsx`,shadcnSource,nova);
  const dec=decisions.families?.[slug]??{};
  const reactExports=map.exports.filter(e=>react[e]);
  const missing=map.exports.filter(e=>!react[e]);
  const components=Object.fromEntries(reactExports.map(e=>[e,react[e]]));
  const slots=sorted(reactExports.flatMap(e=>components[e].slots));
  const shadcnSlots=s.slots;
  const parts=compareSets(s.exports.filter(e=>/^[A-Z]/.test(e)),reactExports,dec,'parts');
  const slotItems=compareSets(shadcnSlots,slots,dec,'slots');
  const props=[];
  for(const e of reactExports){
   const sc=s.components[e];const dc=components[e];
   if(!sc)continue;
   for(const prop of sorted([...Object.keys(sc.props),...Object.keys(dc.props)])){
    const id=`props.${e}.${prop}`,inS=prop in sc.props,inD=prop in dc.props;
    const same=inS&&inD&&(sc.props[prop]===dc.props[prop]||sc.props[prop]===null||dc.props[prop]===null);
    const reason=same?undefined:dec[id];
    const status=same?'match':reason?'intentional':inS&&!inD?'gap':!inS?'extra':'differs';
    props.push({id,component:e,prop,shadcn:inS?{default:sc.props[prop]}:null,react:inD?{default:dc.props[prop]}:null,status,...(reason?{reason}:{})});
   }
  }
  const variants=map.variants?compareSets(sorted(Object.keys(buttonVariants.cvas.buttonVariants.variants.variant)),sorted(Object.keys(buttonVariants.cvas.buttonVariants.variants.variant)),dec,'variants.variant'):[];
  const sections={parts,slots:slotItems,props,variants};
  const all=Object.values(sections).flat();
  const counts=Object.fromEntries(['match','intentional','gap','differs','extra'].map(k=>[k,all.filter(i=>i.status===k).length]));
  out[slug]={exports:reactExports,missingExports:missing,counts,...sections,shadcn:{source:`vendor/shadcn/base/${slug}.tsx.txt`,sha256:manifest.files.find(f=>f.path===`vendor/shadcn/base/${slug}.tsx.txt`)?.sha256??null}};
 }
 const totals={families:Object.keys(out).length};
 for(const k of ['match','intentional','gap','differs','extra'])totals[k]=Object.values(out).reduce((n,f)=>n+f.counts[k],0);
 const orphans=[];
 for(const [slug,dec] of Object.entries(decisions.families??{}))for(const id of Object.keys(dec)){
  const f=out[slug];const items=f?Object.values(f).flatMap(v=>Array.isArray(v)?v:[]):[];
  const hit=id.endsWith('*')?items.some(i=>i.id?.startsWith(id.slice(0,-1))):items.some(i=>i.id===id);
  if(!hit)orphans.push(`${slug}/${id}`);
 }
 return {record:{schemaVersion:1,milestone:'M17',about:'React adapter parity with shadcn/ui base-nova (static). Generated by scripts/react-parity.mjs.',reference:{repository:manifest.repository,revision:manifest.revision,style:manifest.style},
  limits:['Static: names, data-slot values, props and defaults, and button variant axes. Rendered measurement is not part of this record yet.','Blocks, Text and the adapter\u2019s own helpers are not shadcn families and are listed in dmfOnly.'],
  dmfOnly,totals,families:out},orphans};
}

const format=value=>JSON.stringify(value,null,1)+'\n';
const main=process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href;
if(main&&(process.argv.includes('--write')||process.argv.includes('--check'))){
 const {record,orphans}=await build();
 if(orphans.length){console.error(`Decisions that no longer match a difference:\n ${orphans.join('\n ')}`);process.exit(1);}
 if(process.argv.includes('--write')){await writeFile(new URL(recordPath,root),format(record));console.log(`Wrote ${recordPath}:`,record.totals);}
 else{const existing=await read(recordPath).catch(()=>null);if(existing!==format(record)){console.error(`${recordPath} is stale; run npm run react:write`);process.exit(1);}console.log('React parity record is current:',record.totals);}
}
