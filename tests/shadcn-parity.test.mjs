import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {stateHooks,novaRules,readShadcn,build} from '../scripts/shadcn-parity.mjs';

const json=async path=>JSON.parse(await readFile(path,'utf8'));

test('state hooks are read from class variants and slot references are skipped',()=>{
 assert.deepEqual(stateHooks('data-active:bg-x group-data-[variant=line]/tabs-list:a has-data-[icon=inline-end]:pr-2 aria-invalid:ring in-data-[slot=button-group]:rounded-lg data-slot/x'),['aria-invalid','data-active','data-icon','data-variant']);
});

test('Nova rules map cn classes to their utilities',()=>{
 assert.deepEqual(novaRules('.cn-a { @apply h-8 px-2; }\n.cn-b {\n @apply size-4;\n}'),{'cn-a':'h-8 px-2','cn-b':'size-4'});
});

test('shadcn sources give variants, defaults, parts, slots and union axes',async()=>{
 const source=await readFile('vendor/shadcn/base/button.tsx.txt','utf8');
 const nova=novaRules(await readFile('vendor/shadcn/style-nova.css','utf8'));
 const button=readShadcn('button.tsx',source,nova);
 assert.deepEqual(Object.keys(button.cvas.buttonVariants.variants.variant),['default','outline','secondary','ghost','destructive','link']);
 assert.equal(button.components.Button.slot,'button');assert.deepEqual(button.components.Button.props,{variant:'default',size:'default'});assert.equal(button.components.Button.reference.cva,'buttonVariants');
 assert.ok(button.novaClasses.includes('cn-button-size-sm'));
 const avatar=readShadcn('avatar.tsx',await readFile('vendor/shadcn/base/avatar.tsx.txt','utf8'),nova);
 assert.deepEqual(avatar.unionAxes.size,['default','lg','sm']);
});

test('the committed parity record is current and covers every shared family',async()=>{
 const {record,orphans}=await build();
 const committed=await json('docs/DMF-UI-SHADCN-PARITY.json');
 assert.deepEqual(orphans,[]);
 assert.deepEqual(Object.keys(committed.families),Object.keys(record.families));
 assert.deepEqual(committed.totals,record.totals);
 const catalog=await json('contracts/catalog.json'),manifest=await json('vendor/shadcn/MANIFEST.json');
 const shadcn=manifest.files.filter(f=>f.path.startsWith('vendor/shadcn/base/')).map(f=>f.path.match(/base\/(.+)\.tsx\.txt$/)[1]);
 const shared=catalog.components.map(c=>c.slug).filter(s=>shadcn.includes(s)).sort();
 assert.deepEqual(Object.keys(record.families),shared);
 assert.equal(record.families.button.variants.size.find(i=>i.value==='md').status,'intentional');
});

test('shadcn references stay out of the packed archive',async()=>{
 const pkg=await json('package.json');
 assert.ok(!pkg.files.some(f=>f.startsWith('vendor')||f.includes('SHADCN')));
});

test('measured differences tolerate half a pixel and ignore border colour without a border',async()=>{
 const {differences}=await import('./browser/dmf-ui-shadcn-parity.mjs');
 const base={height:32,paddingTop:'0px',borderTopWidth:'0px',borderTopColor:'1,1,1,255',color:'10,10,10,255',width:40};
 const out=differences([{id:'a',void:false,shadcn:{...base},dmf:{...base,height:32.5,borderTopColor:'2,2,2,255'}},{id:'b',void:true,shadcn:{...base},dmf:{...base,paddingTop:'1px',width:44}}]);
 assert.deepEqual(out,{b:[{property:'paddingTop',shadcn:'0px',dmf:'1px'},{property:'width',shadcn:40,dmf:44}]});
});

test('measuring cases are generated for the standalone root components',async()=>{
 const {cases}=await build();
 const committed=await json('src/data/shadcn-parity-cases.json');
 assert.deepEqual(committed.cases,cases);
 assert.equal(cases.filter(c=>c.family==='button').length,48);
 assert.ok(cases.filter(c=>!c.kind).every(c=>c.reference.attributes['data-slot']===c.slot));
});

test('compositions measure compound parts, including open overlays and inner shadcn elements',async()=>{
 const {cases}=await build();
 const compound=cases.filter(c=>c.kind==='compound'),byFamily=Object.fromEntries(compound.map(c=>[c.family,c]));
 assert.ok(compound.length>=15);
 assert.ok(compound.every(c=>c.parts.length&&new Set(c.parts).size===c.parts.length));
 // Table measures shadcn's <table> inside its scroll container; repeated parts get numbered ids.
 const table=byFamily.table.nodes.find(n=>n.component==='Table');
 assert.equal(table.reference.attributes['data-slot'],'table-container');assert.deepEqual([table.inner.tag,table.inner.measured],['table',true]);
 assert.ok(byFamily.table.parts.includes('table/compound#table-cell:4'));
 // Overlay roots and triggers render no shadcn element; the content and its parts are measured open.
 const dialog=byFamily.dialog;
 assert.deepEqual(dialog.open,{trigger:'dialog-trigger',action:'click'});
 assert.equal(dialog.nodes.find(n=>n.component==='Dialog').reference,null);
 assert.ok(dialog.nodes.filter(n=>n.id).every(n=>n.inOpen));
 // A shadcn part that renders another component (FieldLabel renders Label) carries that component's classes.
 const label=byFamily.field.nodes.find(n=>n.component==='FieldLabel');
 assert.equal(label.reference.tag,'label');assert.ok(label.reference.classes.includes('cn-label')&&label.reference.classes.includes('cn-field-label'));
});
