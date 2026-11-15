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
import {pathToFileURL} from 'node:url';

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
const ignoredProps=new Set(['className','class','props','children','asChild','render','style','ref','data-slot']);

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
   // Also follows local type aliases, e.g. NativeSelect's `NativeSelectProps`.
   const aliases=Object.fromEntries(ast.statements.filter(ts.isTypeAliasDeclaration).map(a=>[a.name.text,a.type]));
   const seenAlias=new Set();
   const readUnions=type=>walk(type,t=>{
    if(ts.isTypeReferenceNode(t)&&ts.isIdentifier(t.typeName)&&aliases[t.typeName.text]&&!seenAlias.has(t.typeName.text)){seenAlias.add(t.typeName.text);readUnions(aliases[t.typeName.text]);}
    if(ts.isPropertySignature(t)&&t.type&&ts.isUnionTypeNode(t.type)&&t.type.types.every(u=>ts.isLiteralTypeNode(u)&&ts.isStringLiteral(u.literal)))unions[name(t)]=t.type.types.map(u=>u.literal.text);});
   if(node.parameters[0]?.type)readUnions(node.parameters[0].type);
   for(const [axis,keys] of Object.entries(unions)){unionAxes[axis]=sorted([...(unionAxes[axis]??[]),...keys]);if(!(axis in props))props[axis]=null;}
   // The root element is the first JSX element with a data-slot. Its className literals, any cva call it makes and
   // the data-* attributes it derives from props are what a reference rendering needs.
   let slot,root;
   walk(node,child=>{if(root||!(ts.isJsxOpeningElement(child)||ts.isJsxSelfClosingElement(child)))return;const a=child.attributes.properties.find(p=>ts.isJsxAttribute(p)&&p.name.getText(ast)==='data-slot'&&p.initializer&&ts.isStringLiteral(p.initializer));if(a){root=child;slot=a.initializer.text;}});
   // A component that marks no element at all (InputGroupButton renders <Button>) takes its first element as root.
   const marked=node.getText(ast).includes('data-slot')||node.getText(ast).includes('useRender');
   if(!root&&!marked)walk(node,child=>{if(!root&&(ts.isJsxOpeningElement(child)||ts.isJsxSelfClosingElement(child)))root=child;});
   const reference={element:root?root.tagName.getText(ast):null,classes:[],cva:null,attributes:{}};
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
   // Every element the component marks with a data-slot, for compositions that need an inner part (Table's <table>,
   // Hover Card's popup inside its portal).
   const elements={};
   walk(node,child=>{
    if(!(ts.isJsxOpeningElement(child)||ts.isJsxSelfClosingElement(child)))return;
    const a=child.attributes.properties.find(p=>ts.isJsxAttribute(p)&&p.name.getText(ast)==='data-slot'&&p.initializer&&ts.isStringLiteral(p.initializer));
    if(!a||elements[a.initializer.text])return;
    const entry={element:child.tagName.getText(ast),classes:[],cva:null};
    for(const p of child.attributes.properties){
     if(!ts.isJsxAttribute(p)||!p.initializer||p.name.getText(ast)!=='className')continue;
     if(ts.isStringLiteral(p.initializer))entry.classes.push(p.initializer.text);
     else walk(p.initializer,c=>{if(ts.isCallExpression(c)&&ts.isIdentifier(c.expression)&&c.expression.text!=='cn')entry.cva=c.expression.text;const t=literal(c);if(t!==undefined&&!(ts.isCallExpression(c.parent)&&c.parent.expression.getText(ast)!=='cn'&&c.parent.arguments.includes(c)))entry.classes.push(t);});
    }
    entry.classes=entry.classes.filter(c=>c.trim());elements[a.initializer.text]=entry;
   });
   components[name(node)]={slot:slot??null,props,reference,unions,elements};
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
  components[component]={slot:part.dataSlots[0]??null,slots:part.dataSlots,props};
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
 'item':{Item:{text:'Item'}},'kbd':{Kbd:{text:'K'}},'label':{Label:{text:'Label'}},
 'separator':{Separator:{void:true,state:{'data-orientation':'horizontal'}}},'skeleton':{Skeleton:{void:true}},'spinner':{Spinner:{void:true}},
 'switch':{Switch:{void:true,tag:'span',state:{'data-unchecked':'',role:'switch'}}},'textarea':{Textarea:{void:true}},'toggle':{Toggle:{text:'Bold',tag:'button',props:{label:'Bold'},state:{'aria-pressed':'false'}}},
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

// Compositions for parts that need a parent, children or an open overlay. Each node is
// [Component, options, children]; options are `text`, `void`, `props` (DMF props), `values` (variant values for
// both sides), `state` (the attributes Base UI
// sets at runtime, such as data-open), `tag` (the element a Base UI primitive renders), `part` (measure an inner
// shadcn element by its slot instead of the component root), `inner` (shadcn element the children go into), `dmfSlot` (the DMF slot when the part renders another component), `inner_values` (variant values the part passes
// to the component it renders, such as InputGroupButton's ghost Button) and
// `measure: false` for nodes that only hold the composition together. `open` names the DMF trigger slot to activate
// and how (click, focus, or `event` dispatched on the DMF `root` slot), so overlay contents are measured open.
export const compositions={
 card:['Card',{},[['CardHeader',{},[['CardTitle',{text:'Title'}],['CardDescription',{text:'Description'}],['CardAction',{text:'Action'}]]],['CardContent',{text:'Content'}],['CardFooter',{text:'Footer'}]]],
 alert:['Alert',{},[['AlertTitle',{text:'Title'}],['AlertDescription',{text:'Description'}],['AlertAction',{text:'Action'}]]],
 table:['Table',{props:{caption:'Caption'},inner:'table',part:'table'},[
  ['TableHeader',{},[['TableRow',{},[['TableHead',{text:'Name'}],['TableHead',{text:'Status'}]]]]],
  ['TableBody',{},[['TableRow',{},[['TableCell',{text:'Ada'}],['TableCell',{text:'Active'}]]]]],
  ['TableFooter',{},[['TableRow',{},[['TableCell',{text:'Total'}],['TableCell',{text:'1'}]]]]]]],
 field:['FieldSet',{},[['FieldLegend',{text:'Profile'}],['FieldGroup',{},[
  ['Field',{},[['FieldLabel',{text:'Name'}],['FieldDescription',{text:'Description'}]]],
  ['FieldSeparator',{text:'Or'}],
  ['Field',{},[['FieldContent',{},[['FieldTitle',{text:'Title'}]]],['FieldError',{text:'Error'}]]]]]]],
 item:['ItemGroup',{},[['Item',{},[['ItemMedia',{text:'•'}],['ItemContent',{},[['ItemTitle',{text:'Title'}],['ItemDescription',{text:'Description'}]]],['ItemActions',{text:'Action'}]]],['ItemSeparator',{void:true,state:{'data-orientation':'horizontal'}}],['Item',{},[['ItemHeader',{text:'Header'}],['ItemFooter',{text:'Footer'}]]]]],
 empty:['Empty',{},[['EmptyHeader',{},[['EmptyMedia',{text:'•'}],['EmptyTitle',{text:'Title'}],['EmptyDescription',{text:'Description'}]]],['EmptyContent',{text:'Content'}]]],
 'native-select':['NativeSelect',{inner:'native-select',part:'native-select',props:{'aria-label':'Fruit'}},[['NativeSelectOption',{text:'Apple',props:{value:'apple'},measure:false}]]],
 'toggle-group':['ToggleGroup',{props:{label:'Format'},values:{variant:'outline'},state:{'data-orientation':'horizontal','data-spacing':'2',style:'--gap:2'}},[['ToggleGroupItem',{text:'Bold',props:{label:'Bold',value:'bold'},values:{variant:'outline'},state:{'aria-pressed':'false'}}],['ToggleGroupItem',{text:'Italic',props:{label:'Italic',value:'italic'},values:{variant:'outline'},state:{'aria-pressed':'false'}}]]],
 'input-group':['InputGroup',{},[['InputGroupAddon',{text:'@'}],['InputGroupInput',{void:true,props:{'aria-label':'Handle'}}],['InputGroupAddon',{values:{align:'inline-end'}},[['InputGroupButton',{text:'Go',dmfSlot:'button',inner_values:{variant:'ghost'}}]]]]],
 'button-group':['ButtonGroup',{},[['ButtonGroupText',{text:'Text'}],['ButtonGroupSeparator',{void:true,state:{'data-orientation':'vertical'}}]]],
 kbd:['KbdGroup',{},[['Kbd',{text:'Ctrl'}],['Kbd',{text:'K'}]]],
 tabs:['Tabs',{props:{defaultValue:'one'},state:{'data-orientation':'horizontal'}},[['TabsList',{state:{'data-orientation':'horizontal'}},[['TabsTrigger',{props:{value:'one'},text:'One',state:{'data-active':'','aria-selected':'true'}}],['TabsTrigger',{props:{value:'two'},text:'Two',state:{'aria-selected':'false'}}]]],['TabsContent',{props:{value:'one'},text:'Panel'}]]],
 accordion:['Accordion',{props:{defaultValue:'one'}},[['AccordionItem',{props:{value:'one'},state:{'data-open':''}},[['AccordionTrigger',{props:{'aria-expanded':'true'},text:'Question',state:{'data-panel-open':''}}],['AccordionContent',{props:{hidden:false},text:'Answer',state:{'data-open':'',style:'--accordion-panel-height:auto;animation:none'}}]]]]],
 'radio-group':['RadioGroup',{props:{name:'parity-radio',defaultValue:'one','aria-label':'Choice'}},[['RadioGroupItem',{void:true,tag:'span',props:{value:'one','aria-label':'One'},state:{'data-checked':'',role:'radio'}}],['RadioGroupItem',{void:true,tag:'span',props:{value:'two','aria-label':'Two'},state:{'data-unchecked':'',role:'radio'}}]]],
 dialog:['Dialog',{element:false,measure:false,open:{trigger:'dialog-trigger',action:'click'}},[['DialogTrigger',{element:false,text:'Open',measure:false}],['DialogContent',{state:{'data-open':''}},[['DialogHeader',{},[['DialogTitle',{text:'Title'}],['DialogDescription',{text:'Description'}]]],['DialogFooter',{text:'Footer'}]]]]],
 popover:['Popover',{element:false,measure:false,open:{trigger:'popover-trigger',action:'click'}},[['PopoverTrigger',{element:false,text:'Open',measure:false}],['PopoverContent',{state:{'data-open':'','data-side':'bottom'}},[['PopoverHeader',{},[['PopoverTitle',{text:'Title'}],['PopoverDescription',{text:'Description'}]]]]]]],
 'dropdown-menu':['DropdownMenu',{element:false,measure:false,open:{trigger:'dropdown-menu-trigger',action:'click'}},[['DropdownMenuTrigger',{element:false,text:'Open',measure:false}],['DropdownMenuContent',{state:{'data-open':'','data-side':'bottom'}},[['DropdownMenuGroup',{},[['DropdownMenuLabel',{text:'Label'}],['DropdownMenuItem',{text:'Item'}]]],['DropdownMenuSeparator',{void:true}],['DropdownMenuItem',{text:'Other'}]]]]],
 select:['Select',{measure:false,props:{name:'parity-select',defaultValue:'apple'},open:{trigger:'select-trigger',action:'click'}},[['SelectTrigger',{measure:false},[['SelectValue',{measure:false,void:true}]]],['SelectContent',{state:{'data-open':'','data-side':'bottom'}},[['SelectGroup',{},[['SelectLabel',{text:'Fruit'}],['SelectItem',{props:{value:'apple'},text:'Apple'}],['SelectItem',{props:{value:'pear'},text:'Pear'}]]],['SelectSeparator',{void:true}]]]]],
 tooltip:['Tooltip',{element:false,measure:false,props:{portal:false},open:{trigger:'tooltip-trigger',action:'focus'}},[['TooltipTrigger',{element:false,text:'Help',measure:false}],['TooltipContent',{text:'Tip',state:{'data-open':'','data-side':'top'}}]]],
 'hover-card':['HoverCard',{element:false,measure:false,open:{trigger:'hover-card-trigger',action:'event',root:'hover-card',event:'hover-card:set'}},[['HoverCardTrigger',{element:false,props:{href:'#parity-cases'},text:'Link',measure:false}],['HoverCardContent',{text:'Card',part:'hover-card-content',state:{'data-open':'','data-side':'bottom'}}]]],
};

// Base UI primitives and composed shadcn components, by the element they render.
const primitiveTags={Root:'div',List:'div',Tab:'button',Panel:'div',Item:'div',Trigger:'button',Popup:'div',Title:'h2',Description:'p',Group:'div',GroupLabel:'div',Separator:'div',Header:'h3'};
export const composedComponents={Label:['label','Label'],Input:['input','Input'],Separator:['separator','Separator'],Button:['button','Button']};
const namedTags={InputPrimitive:'input',ButtonPrimitive:'button',TogglePrimitive:'button'};
const tagOf=element=>!element||element==='null'?'div':/^[a-z]/.test(element)?element:namedTags[element]??primitiveTags[element.split('.').pop()]??'div';

function compositionCase(slug,s,d,composed){
 const spec=compositions[slug];if(!spec)return [];
 const nodes=[],seen={};let open=null,openKey=null;
 const visit=([component,options,children=[]],parent,inOpen)=>{
  const sc=s.components[component],dc=d.components[component];
  if(!dc||!sc&&options.measure!==false&&options.element!==false)throw Error(`${slug}: ${component} is not exported by both sides`);
  // A Base UI root such as Dialog renders no element of its own; its children go straight into the parent.
  if(!sc||options.element===false){const key=String(nodes.length);nodes.push({key,parent,component,id:null,dmfSlot:null,occurrence:0,inOpen,text:'',void:false,reference:null,inner:null});if(options.open)open=options.open;return {component,props:options.props??{},text:options.text??'',void:!!options.void,children:children.map(child=>visit(child,key,inOpen))};}
  // `part` alone measures that inner element in place of the root; with `inner` the root stays and the part sits inside it.
  const asPart=options.part&&!options.inner;
  let shadcnSlot=options.part??sc.slot;const source=asPart?sc.elements[options.part]:{element:sc.reference.element,classes:sc.reference.classes,cva:sc.reference.cva};
  if(!source)throw Error(`${slug}: ${component} has no ${options.part} element`);
  const innerSource=options.inner?sc.elements[options.inner]:null;
  if(options.inner&&!innerSource)throw Error(`${slug}: ${component} has no ${options.inner} element`);
  // A shadcn component that renders another (FieldLabel renders Label) gets that component's classes first.
  let element=source.element,classes=[...source.classes],cvaName=source.cva;
  const via=composedComponents[element];let viaSlot=null;
  if(via){const inner=composed[via[0]].components[via[1]];element=inner.reference.element;viaSlot=inner.slot;const cva=inner.reference.cva?composed[via[0]].cvas[inner.reference.cva]:null;classes=[...inner.reference.classes,...(cva?[cva.base,...Object.entries(cva.variants).map(([a,k])=>k[options.inner_values?.[a]??cva.defaults[a]]??'')]:[]),...classes];}
  // A cva imported from another family (ToggleGroupItem uses Toggle's toggleVariants) is looked up there.
  const cva=cvaName?s.cvas[cvaName]??Object.values(composed).find(f=>f.cvas[cvaName])?.cvas[cvaName]??null:null;
  // `values` picks variant values (Input Group addon `align`); the DMF side gets them as props too.
  const values={...(cva?.defaults??{}),...(options.values??{})};
  if(cva)classes.push(cva.base,...Object.entries(cva.variants).map(([a,k])=>k[values[a]]??''));
  // A part without its own slot that renders another component (InputGroupButton renders Button) takes that slot.
  if(!shadcnSlot&&viaSlot)shadcnSlot=viaSlot;
  const attributes={'data-slot':asPart||!options.part?shadcnSlot:sc.slot};
  for(const [attr,src] of Object.entries(asPart?{}:sc.reference.attributes))if(src.value!==undefined)attributes[attr]=src.value;else{const v=options.values?.[src.prop]??cva?.defaults[src.prop]??sc.props[src.prop];if(v!=null&&v!=='false')attributes[attr]=String(v);}
  Object.assign(attributes,options.state??{});
  const dmfSlot=options.dmfSlot??(dc.slots.includes(shadcnSlot)?shadcnSlot:dc.slot);
  const key=String(nodes.length),measure=options.measure!==false&&!!dmfSlot;
  let id=null;if(measure){const base=`${slug}/compound#${shadcnSlot}`;seen[base]=(seen[base]??0)+1;id=seen[base]>1?`${base}:${seen[base]}`:base;}
  const occurrence=nodes.filter(n=>n.dmfSlot===dmfSlot&&n.inOpen===inOpen).length;
  const node={key,parent,component,id,dmfSlot,occurrence,inOpen,text:options.text??'',void:!!options.void,reference:{tag:options.tag??tagOf(element),classes:sorted(classes.join(' ').split(/\s+/).filter(Boolean)),attributes},
   inner:innerSource?{tag:tagOf(innerSource.element),classes:sorted(innerSource.classes.join(' ').split(/\s+/).filter(Boolean)),attributes:{'data-slot':options.inner},measured:options.part===options.inner}:null};
  nodes.push(node);
  if(options.open){open=options.open;}
  const contentHere=Boolean(open&&!inOpen&&parent!==null&&!openKey&&component.endsWith('Content'));
  if(contentHere){openKey=key;node.inOpen=true;node.occurrence=0;}
  const dmf={component,props:{...(options.values??{}),...(options.props??{})},text:options.text??'',void:!!options.void,children:children.map(child=>visit(child,key,inOpen||contentHere))};
  return dmf;
 };
 const tree=visit(spec,null,false);
 const parts=nodes.filter(n=>n.id).map(n=>n.id);
 return [{id:`${slug}/compound`,family:slug,kind:'compound',open,tree,nodes,parts}];
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
 const composed={};for(const family of new Set([...Object.values(composedComponents).map(([family])=>family),'toggle'])){const path=`vendor/shadcn/base/${family}.tsx.txt`;composed[family]=readShadcn(path,await read(path),nova);}
 for(const slug of shared){
  const path=`vendor/shadcn/base/${slug}.tsx.txt`,s=readShadcn(path,await read(path),nova),d=await readDmf(dmfBySlug[slug]);
  // A cva imported from another family (ToggleGroup uses Toggle's toggleVariants) counts as this family's too.
  for(const c of Object.values(s.components))if(c.reference.cva&&!s.cvas[c.reference.cva]){const from=Object.values(composed).find(f=>f.cvas[c.reference.cva]);if(from)s.cvas[c.reference.cva]=from.cvas[c.reference.cva];}
  const decisions=decisionsFile.families?.[slug]??{};
  cases.push(...casesFor(slug,s,d),...compositionCase(slug,s,d,composed));
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
  if(id.startsWith('measured.'))continue;// Checked against the measured differences, see applyMeasuredDecisions.
  if(!hits.some(i=>i.status==='intentional'))orphans.push(`${slug}/${id}`);
 }
 const totals={families:shared.length};for(const k of ['match','intentional','gap','differs','extra'])totals[k]=Object.values(families).reduce((n,f)=>n+f.counts[k],0);
 return {decisions:decisionsFile,record:{
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

// Owner decisions on measured differences use ids `measured.<property>:<case or part id>`, where the id may end in
// `*`, e.g. `measured.color:button/Button?variant=destructive*`. A matching difference stays in the record with
// status `intentional` and the reason; `accepted` counts cases whose remaining differences are all intentional.
export function applyMeasuredDecisions(families,decisionsFile){
 const orphans=[];
 for(const [slug,f] of Object.entries(families)){
  const decisions=Object.entries(decisionsFile.families?.[slug]??{}).filter(([id])=>id.startsWith('measured.'));
  const used=new Set();
  if(f.measured)for(const theme of ['light','dark'])for(const [id,diffs] of Object.entries(f.measured.differences[theme]))for(const d of diffs){
   delete d.status;delete d.reason;
   const hit=decisions.find(([key])=>{const [prop,target]=key.slice('measured.'.length).split(/:(.*)/s);return prop===d.property&&(target.endsWith('*')?id.startsWith(target.slice(0,-1)):id===target);});
   if(hit){d.status='intentional';d.reason=hit[1];used.add(hit[0]);}
  }
  if(f.measured){const accepted=theme=>Object.values(f.measured.differences[theme]).filter(diffs=>diffs.every(d=>d.status==='intentional')).length;f.measured.accepted={light:accepted('light'),dark:accepted('dark')};}
  for(const [key] of decisions)if(!used.has(key))orphans.push(`${slug}/${key}`);
 }
 return orphans;
}

const format=value=>JSON.stringify(value,null,1)+'\n';
// Run only as a script, so other scripts can import the extractor without triggering this CLI.
const main=process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href;
if(main&&(process.argv.includes('--write')||process.argv.includes('--check'))){
 const {record,cases,orphans,decisions}=await build();
 const casesText=format({about:'Generated by scripts/shadcn-parity.mjs for the internal shadcn parity page and scenario.',cases});
 const existing=await read(recordPath).catch(()=>null);
 if(existing){const previous=JSON.parse(existing);for(const [slug,f] of Object.entries(record.families))f.measured=previous.families?.[slug]?.measured??null;}
 // --measured <file> stores the scenario's differences per family: case count and, per theme, differing properties.
 const measuredArg=process.argv.indexOf('--measured');
 if(measuredArg>0){
  const summary=JSON.parse(await readFile(process.argv[measuredArg+1],'utf8'));
  for(const [slug,f] of Object.entries(record.families)){
   const ids=cases.filter(c=>c.family===slug).flatMap(c=>c.parts??[c.id]);
   if(!ids.length){f.measured=null;continue;}
   const pick=theme=>Object.fromEntries(Object.entries(summary.differences[theme]).filter(([id])=>ids.includes(id)));
   const differences={light:pick('light'),dark:pick('dark')};
   f.measured={cases:ids.length,matching:{light:ids.length-Object.keys(differences.light).length,dark:ids.length-Object.keys(differences.dark).length},differences};
  }
  const all=cases.flatMap(c=>c.parts??[c.id]),compound=cases.filter(c=>c.parts).flatMap(c=>c.parts);
  const matching=(ids,theme)=>ids.filter(id=>!summary.differences[theme][id]).length;
  record.measuredTotals={cases:all.length,matching:{light:matching(all,'light'),dark:matching(all,'dark')},compoundParts:{parts:compound.length,matching:{light:matching(compound,'light'),dark:matching(compound,'dark')}}};
 }else if(existing)record.measuredTotals=JSON.parse(existing).measuredTotals;
 orphans.push(...applyMeasuredDecisions(record.families,decisions));
 if(record.measuredTotals){const sum=theme=>Object.values(record.families).reduce((n,f)=>n+(f.measured?.accepted?.[theme]??0),0);record.measuredTotals.accepted={light:sum('light'),dark:sum('dark')};}
 if(orphans.length){console.error(`Decisions that no longer match a difference:\n ${orphans.join('\n ')}`);process.exit(1);}
 if(process.argv.includes('--write')){await writeFile(new URL(recordPath,root),format(record));await writeFile(new URL(casesPath,root),casesText);console.log(`Wrote ${recordPath} and ${cases.length} cases:`,record.totals);}
 else if(existing!==format(record)||await read(casesPath).catch(()=>null)!==casesText){console.error(`${recordPath} or ${casesPath} is stale; run npm run shadcn:write`);process.exit(1);}
 else console.log('shadcn parity record is current:',record.totals);
}
