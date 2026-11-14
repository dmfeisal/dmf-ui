import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const json=async path=>JSON.parse(await readFile(path,'utf8'));

test('M16 batches cover every shared shadcn family exactly once, in order',async()=>{
 const {batches}=await json('docs/DMF-UI-M16-BATCHES.json'),record=await json('docs/DMF-UI-SHADCN-PARITY.json');
 const families=batches.flatMap(b=>b.families);
 assert.equal(new Set(families).size,families.length,'a family is in two batches');
 assert.deepEqual([...families].sort(),Object.keys(record.families).sort());
 batches.forEach((b,i)=>assert.ok(b.id.startsWith(`m16-${i+1}-`),`${b.id} is out of order`));
});
