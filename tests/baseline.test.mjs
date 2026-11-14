import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {ownersOf,filterRules,size,stale,merge} from '../scripts/dmf-ui-baseline.mjs';
import {compare} from './browser/dmf-ui-baseline.mjs';

const json=async path=>JSON.parse(await readFile(path,'utf8'));

test('hand-written rules are attributed by class (longest family wins) and by data slot',()=>{
 const slugs=['input','input-group','dialog'],slots=new Map([['dialog-title','dialog'],['dialog-footer','dialog'],['input','input']]);
 assert.deepEqual([...ownersOf('.dmf-input-group-addon > .x',slugs,slots)],['input-group']);
 assert.deepEqual([...ownersOf('.dmf-ui [data-slot="dialog-title"]',slugs,slots)],['dialog']);
 assert.deepEqual([...ownersOf('[data-slot^="dialog-"]',slugs,slots)],['dialog']);
 assert.deepEqual([...ownersOf('.dmf-ui :root',slugs,slots)],[]);
});

test('filtering keeps used keyframes and properties and drops the rest',()=>{
 const css='@property --tw-a{syntax:"*";inherits:false}@property --tw-b{syntax:"*";inherits:false}@keyframes spin{to{rotate:1turn}}@keyframes fade{to{opacity:0}}.keep{animation:spin 1s;--tw-a:1}@media (width>1px){.drop{color:red}}';
 const kept=filterRules(css,selector=>selector==='.keep',{atRules:true});
 assert.match(kept,/--tw-a\{/);assert.doesNotMatch(kept,/--tw-b|fade|\.drop|@media/);assert.match(kept,/keyframes spin/);
 assert.equal(size('.a { color: red; }').bytes,'.a{color:red}'.length);
});

test('gzip sizes tolerate small zlib differences; byte counts do not',()=>{
 assert.deepEqual(stale({css:{bytes:100,gzip:50}},{css:{bytes:100,gzip:54}}),[]);
 assert.deepEqual(stale({css:{bytes:101,gzip:50}},{css:{bytes:100,gzip:50}}),['.css.bytes']);
});

test('without-JavaScript status compares visible elements, controls and text',()=>{
 const a={visible:4,focusable:1,text:10};
 assert.equal(compare(a,{...a},false),'static');
 assert.equal(compare(a,{...a},true),'same');
 assert.equal(compare(a,{...a,focusable:0},true),'reduced');
 assert.equal(compare(a,{...a,visible:6},true),'more');
 assert.equal(compare(null,a,true),'no-preview');
});

test('the committed baseline covers every catalog family and keeps its browser results',async()=>{
 const record=await json('docs/DMF-UI-BASELINE.json'),catalog=await json('contracts/catalog.json');
 assert.deepEqual(Object.keys(record.families),catalog.components.map(c=>c.slug).sort());
 assert.ok(Object.values(record.families).every(f=>Number.isInteger(f.css.total.bytes)&&f.withoutJs));
 const copy=structuredClone(record);for(const f of Object.values(copy.families)){delete f.axe;delete f.withoutJs;}
 assert.deepEqual(merge(copy,record,null).totals,record.totals);
 const pkg=await json('package.json');assert.ok(!pkg.files.some(f=>f.includes('BASELINE')));
});
