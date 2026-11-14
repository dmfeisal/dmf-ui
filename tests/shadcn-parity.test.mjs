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
 assert.deepEqual(button.components.Button,{slot:'button',props:{variant:'default',size:'default'}});
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
