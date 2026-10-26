import ts from 'typescript';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
const parse=(path,text)=>ts.createSourceFile(path,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const name=node=>node.name?.text??node.name?.getText();
const prop=(node,key)=>node.properties?.find(p=>name(p)===key)?.initializer;
const strings=node=>node&&ts.isArrayLiteralExpression(node)?node.elements.filter(ts.isStringLiteral).map(n=>n.text):[];
const text=node=>node&&(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node))?node.text:undefined;
const hash=value=>createHash('sha256').update(value).digest('hex');
const walk=(node,fn)=>{fn(node);ts.forEachChild(node,n=>walk(n,fn));};
const states={interaction:['default','hover','pressed','focus','focus-visible','disabled'],selection:['unselected','selected','checked','unchecked','indeterminate','on','off','current'],disclosure:['open','closed','expanded','collapsed'],validation:['valid','invalid','warning','required'],async:['idle','loading','pending','success','error','empty','skeleton'],specialized:['highlighted','dragging','drag-over','sorting','resizing','editing','read-only','visited']};
export async function inventory(){
 const reviewedSource=await read('contracts/selection.json'),reviewed=JSON.parse(reviewedSource);
 const docs=[];
 for(const file of (await readdir(new URL('src/data/',root))).filter(f=>f.endsWith('documentation.ts'))){
  walk(parse(file,await read(`src/data/${file}`)),node=>{if(!ts.isObjectLiteralExpression(node))return;const slug=text(prop(node,'slug')),title=text(prop(node,'name')),category=text(prop(node,'category'));if(!slug||!title||!category)return;
   docs.push({slug,name:title,category,description:text(prop(node,'description')),options:prop(node,'options')?.elements?.map(row=>row.elements.map(text))??[],accessibility:strings(prop(node,'notes')),documentation:`src/data/${file}`});
  });
 }
 const pkg=JSON.parse(await read('package.json')),exports=pkg.exports;
 const testFiles=[];
 for(const dir of ['tests','tests/browser'])for(const f of await readdir(new URL(`${dir}/`,root)))if(/\.(?:test\.)?mjs$/.test(f))testFiles.push([`${dir}/${f}`,await read(`${dir}/${f}`)]);
 const components=[];
 for(const doc of docs.sort((a,b)=>a.slug.localeCompare(b.slug))){
  const entry=exports[`./${doc.slug}`];if(!entry)throw Error(`Missing family export ${doc.slug}`);
  const dir=entry.replace(/^\.\//,'').replace(/\/index\.ts$/,'');
  const files=(await readdir(new URL(`${dir}/`,root))).filter(f=>/\.(astro|ts)$/.test(f)).sort();
  const parts=[],sources=[],variants={},defaults={};let combined='';
  for(const f of files){
   const path=`${dir}/${f}`,source=await read(path);sources.push({path,sha256:hash(source)});combined+='\n'+source;
   const script=f.endsWith('.astro')?source.split('---')[1]??'':source,ast=parse(path,script);
   const declarations=[],properties=[],native=[];
   walk(ast,node=>{
    if((ts.isTypeAliasDeclaration(node)||ts.isInterfaceDeclaration(node))&&name(node)==='Props'){
     declarations.push(node.getText(ast));walk(node,child=>{if(ts.isPropertySignature(child))properties.push({name:name(child),type:child.type?.getText(ast)??'unknown',optional:!!child.questionToken});if(ts.isTypeReferenceNode(child)&&/HTMLAttributes|Polymorphic/.test(child.typeName.getText(ast)))native.push(child.getText(ast));});
    }
    if(ts.isVariableDeclaration(node)&&ts.isObjectBindingPattern(node.name)&&node.initializer?.getText(ast)==='Astro.props')for(const item of node.name.elements){if(item.dotDotDotToken)continue;const key=item.propertyName?.text??item.name.getText(ast);if(item.initializer)defaults[`${f}:${key}`]=item.initializer.getText(ast);}
    if(ts.isPropertyAssignment(node)&&name(node)==='variants'&&ts.isObjectLiteralExpression(node.initializer))for(const axis of node.initializer.properties){if(ts.isPropertyAssignment(axis)&&ts.isObjectLiteralExpression(axis.initializer))variants[name(axis)]=[...new Set([...(variants[name(axis)]??[]),...axis.initializer.properties.map(name)])];}
   });
   if(f.endsWith('.astro'))parts.push({file:path,slots:[...new Set([...source.matchAll(/<slot(?:\s+name="([^"]+)")?/g)].map(m=>m[1]??'default'))],dataSlots:[...new Set([...source.matchAll(/data-slot="([^"]+)"/g)].map(m=>m[1]))],properties,native:[...new Set(native)],declaration:declarations.join('\n')||'Props inherited through the source imports; inspect source before use.'});
  }
  const observed={hover:/hover:|:hover/.test(combined),pressed:/active:|aria-pressed/.test(combined),'focus-visible':/focus-visible/.test(combined),focus:/focus\(|focus:|focusin/.test(combined),disabled:/disabled/.test(combined),selected:/selected/.test(combined),checked:/checked/.test(combined),unchecked:/unchecked/.test(combined),indeterminate:/indeterminate/.test(combined),current:/aria-current|current\??:/.test(combined),open:/defaultOpen|data-open|aria-expanded|open\??:/.test(combined),closed:/data-closed|closed/.test(combined),expanded:/expanded/.test(combined),collapsed:/collapsed/.test(combined),invalid:/invalid/.test(combined),required:/required/.test(combined),loading:/loading/.test(combined),pending:/pending/.test(combined),empty:/empty/.test(combined),error:/error/.test(combined),success:/success/.test(combined),highlighted:/highlighted/.test(combined),resizing:/resiz/.test(combined),'read-only':/readonly|readOnly/.test(combined),visited:/visited:/.test(combined)};
  const stateMatrix=Object.fromEntries(Object.values(states).flat().map(state=>[state,{status:state==='default'?'authored-default':observed[state]?'source-evidence':'not-established',note:state==='default'?'Default authored composition.':observed[state]?'Source contains this state vocabulary; not a certification of every part or combination.':'No automatic support claim. Native or child composition may apply; otherwise unsupported until reviewed.'}]));
  const tokens=[...new Set([...combined.matchAll(/var\(--([\w-]+)/g)].map(m=>m[1]).concat([...combined.matchAll(/(?:bg|text|border|ring|shadow)-(primary(?:-foreground)?|secondary(?:-foreground)?|foreground|background|muted(?:-foreground)?|accent(?:-foreground)?|card(?:-foreground)?|popover(?:-foreground)?|destructive|input|ring|border)\b/g)].map(m=>m[1])))].sort();
  components.push({...doc,package:'dmf-ui',entry,parts,variants,defaults,states:stateMatrix,tokens,reviewedContract:reviewed.components[doc.slug]??null,presets:{scope:'Shared semantic CSS variables; per-family brand acceptance remains partial.',available:['dmf','cb-ui','hui','portfolio','qdi']},tests:{status:'references-only',sources:testFiles.filter(([,body])=>body.includes(doc.slug)).map(([path])=>path)},status:'partial',sources,gaps:['Source extraction does not resolve imported runtime option types or expand every inherited native attribute.','State evidence is lexical; manual applicability, behavior and preset acceptance must be reviewed per part.','Do not infer loading, controlled state or a size option from another family.']});
 }
 const blocks=[];
 const blockDocs=[];walk(parse('blocks.ts',await read('src/data/blocks.ts')),node=>{if(!ts.isObjectLiteralExpression(node))return;const slug=text(prop(node,'slug')),title=text(prop(node,'title'));if(slug&&title)blockDocs.push({slug,title,category:text(prop(node,'category')),description:text(prop(node,'description')),components:strings(prop(node,'components')),limitations:text(prop(node,'limitations'))});});
 for(const doc of blockDocs){
  const path=`src/components/dmf-ui/blocks/${doc.slug}.astro`,source=await read(path),ast=parse(path,source.split('---')[1]);let declaration='';const defaults={};
  walk(ast,node=>{if(ts.isInterfaceDeclaration(node)&&name(node)==='Props')declaration=node.getText(ast);if(ts.isVariableDeclaration(node)&&ts.isObjectBindingPattern(node.name)&&node.initializer?.getText(ast)==='Astro.props')for(const item of node.name.elements){if(item.initializer)defaults[item.propertyName?.text??item.name.getText(ast)]=item.initializer.getText(ast);}});
  blocks.push({...doc,entry:'dmf-ui/blocks',framework:'Astro',source:path,sha256:hash(source),declaration,defaults,slots:[...source.matchAll(/<slot(?:\s+name="([^"]+)")?/g)].map(m=>m[1]??'default'),status:'partial',acceptance:'Native behavior and scoped browser evidence; cross-browser, real device and spoken AT remain separate.'});
 }
 const react=await read('packages/react/src/index.tsx');
 const reactDeclarations=[];walk(parse('index.tsx',react),node=>{if(ts.isTypeAliasDeclaration(node)&&node.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword))reactDeclarations.push({name:name(node),declaration:node.getText()});});
 const reactBlockPath='packages/react/src/blocks/sign-in.tsx',reactBlockSource=await read(reactBlockPath);
 const reactBlockTypes=[];walk(parse('sign-in.tsx',reactBlockSource),node=>{if(ts.isTypeAliasDeclaration(node)&&node.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword))reactBlockTypes.push({name:name(node),declaration:node.getText()});});
 const reactBlocks=[{name:'SignInBlock',entry:'@dmf-ui/react',source:reactBlockPath,sha256:hash(reactBlockSource),types:reactBlockTypes,status:'experimental',stateOwnership:'Native uncontrolled fields; host owns submission, pending, errors and reset policy.'}];
 const reactExports=[...react.matchAll(/export function (\w+)/g)].map(m=>m[1]).concat(reactBlocks.map(block=>block.name));
 return {blocks,schemaVersion:1,contractVersion:reviewed.contractVersion,status:'experimental',reviewSource:{path:'contracts/selection.json',sha256:hash(reviewedSource)},scope:'All documented Astro families, separately inventoried source-owned Blocks and React exports; reviewed applicability, lexical source evidence and browser acceptance are distinct.',conventions:{variants:'Keep existing default/secondary/outline/ghost/destructive/link names. No universal variant list.',sizes:'default remains the compatible medium size. Button also accepts md. XS/SM/MD/LG/XL are conceptual labels, not universal props.',icons:'Use authored slots or the existing presentation prop. Icon-only controls require an accessible name.',states:'Native HTML and existing runtimes own state. State demonstration does not create a visual state prop.',width:'Use class/style layout unless a family already exposes a width prop.',density:'Only opt-in foundation tokens; no universal density prop.',compatibility:'No existing prop is removed or renamed.'},stateTaxonomy:states,react:{blocks:reactBlocks,package:'@dmf-ui/react',version:JSON.parse(await read('packages/react/package.json')).version,exports:reactExports,types:reactDeclarations,source:'packages/react/src/index.tsx',sha256:hash(react),status:'separate-web-alpha',note:'React native props and controlled/uncontrolled patterns differ from Astro. No Astro parity claim.'},components};
}
export async function buildContracts({check=false}={}){
 const data=await inventory(),path='contracts/catalog.json',content=JSON.stringify(data,null,2)+'\n';
 if(check){if(await read(path)!==content)throw Error('Component inventory is stale. Run npm run contracts:build.');}
 else await writeFile(new URL(path,root),content);
 return data;
}
if(process.argv[1]===fileURLToPath(import.meta.url))await buildContracts({check:process.argv.includes('--check')});
