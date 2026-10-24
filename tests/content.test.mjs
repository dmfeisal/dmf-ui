import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const contracts=JSON.parse(await readFile('contracts/components.json','utf8'));
test('0.4.0 content contracts are exported and have verified documentation',async()=>{
 const pkg=JSON.parse(await readFile('package.json','utf8'));
 assert.equal(pkg.exports['./contracts.json'],'./contracts/components.json');
 for(const slug of Object.keys(contracts.components)){
  assert(pkg.exports[`./${slug}`]);
  const html=await readFile(`dist/components/${slug}/index.html`,'utf8');
  assert(html.includes('data-system="dmf"')&&html.includes('data-system="cb-ui"'));
 }
});
test('static content semantics and full labels survive server rendering without controllers',async()=>{
 const html=await readFile('dist/examples/dmf-ui/index.html','utf8');
 assert.match(html,/<article[^>]*data-slot="card"/);
 assert.match(html,/<h5[^>]*data-slot="card-title"/);
 assert.match(html,/<h5[^>]*data-slot="text"/);
 assert.match(html,/<div[^>]*data-slot="alert"[^>]*role="note"/);
 assert(!/<[^>]*data-slot="(?:card|text|badge)"[^>]*(?:role="button"|tabindex="0")/.test(html));
 assert(html.includes('UnpublishedPresetWithAnIntentionallyLongUnbrokenNameForTheWrappingExample'));
 for(const slug of Object.keys(contracts.components)){
  const file=await readFile(`src/components/dmf-ui/${slug}/${slug}.astro`,'utf8');
  assert(!file.includes('<script>'),`${slug} should remain SSR-only`);
 }
});
