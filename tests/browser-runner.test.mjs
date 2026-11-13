import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shard } from '../scripts/dmf-ui-browser/runner.mjs';

test('DMF_UI_TEST_SHARD splits a suite into disjoint shards that cover every scenario', () => {
  const names = Array.from({ length: 25 }, (_, index) => `s${index}`);
  const parts = [1, 2, 3, 4].map(index => shard(names, `${index}/4`));
  assert.deepEqual(parts.flat().sort(), [...names].sort());
  assert.equal(new Set(parts.flat()).size, names.length);
  assert.deepEqual(parts.map(part => part.length), [7, 6, 6, 6]);
  assert.deepEqual(shard(names, undefined), names);
  for (const bad of ['0/4', '5/4', '1/0', 'x', '1-4']) assert.throws(() => shard(names, bad), /DMF_UI_TEST_SHARD/);
});
