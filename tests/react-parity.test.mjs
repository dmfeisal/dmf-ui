import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {readReact,build,families} from '../scripts/react-parity.mjs';

const json=async path=>JSON.parse(await readFile(path,'utf8'));

test('the React reader finds exports, props with defaults, data-slot and data attributes',()=>{
 const r=readReact(`export function Badge({variant='default',className,...props}:BadgeProps){return <span {...props} data-slot="badge" data-variant={variant} className={join('x')}/>;}`);
 assert.deepEqual(r.Badge.props,{variant:'default'});
 assert.equal(r.Badge.slot,'badge');
 assert.deepEqual(r.Badge.attributes,['data-variant']);
});

test('the committed React record is current and covers every mapped family',async()=>{
 const {record,orphans}=await build();
 const committed=await json('docs/DMF-UI-REACT-PARITY.json');
 assert.deepEqual(orphans,[]);
 assert.deepEqual(committed.totals,record.totals);
 assert.deepEqual(Object.keys(committed.families),Object.keys(families));
});
