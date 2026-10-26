import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('Blocks remain a separate exported composition inventory with native form fallbacks',async()=>{
 const pkg=JSON.parse(await readFile('package.json','utf8')),catalog=JSON.parse(await readFile('contracts/catalog.json','utf8'));
 assert.equal(pkg.exports['./blocks'],'./src/components/dmf-ui/blocks/index.ts');
 assert.deepEqual(catalog.blocks.map(b=>b.slug),['merchant-card','merchant-listing','hero','sign-in','search-filters']);
 assert(!catalog.components.some(c=>c.slug==='blocks'));
 for(const block of catalog.blocks){assert.match(block.sha256,/^[a-f0-9]{64}$/);assert(block.declaration.includes('HTMLAttributes'));if(block.slug!=='merchant-card')assert(block.slots.includes('default'));assert.equal(block.framework,'Astro');const html=await readFile(`dist/blocks/${block.slug}/index.html`,'utf8');assert(html.includes('data-docs-preview'));if(block.slug==='merchant-card'){assert(html.includes('data-slot="merchant-card"'));assert(html.includes('Rush Hour Kelapa Gading'));}else if(block.slug==='merchant-listing'){assert(block.slots.includes('item'));assert(html.includes('data-slot="merchant-listing-block"'));assert(html.includes('Sample café A'));}else if(block.slug==='hero'){assert(html.includes('data-slot="hero-block"'));assert(html.includes('aria-labelledby="hero-preview-title"'));}else assert(html.includes('data-block-submit'));assert(html.includes('data-copy-value'));}
 const auth=await readFile('dist/blocks/sign-in/index.html','utf8');
 assert.match(auth,/method="post"/);assert.match(auth,/autocomplete="current-password"/);assert(!/<input[^>]*type="password"[^>]*value=/.test(auth));
 assert.match(auth,/aria-describedby="block-sign-in-disabled-email-error"/);assert.match(auth,/id="block-sign-in-disabled-email-error"/);
 const filters=await readFile('dist/blocks/search-filters/index.html','utf8');assert.match(filters,/method="get"/);assert.match(filters,/name="category"/);assert.match(filters,/value="initial"/);
 for(const slug of ['breadcrumb','pagination','navigation-menu','sidebar','responsive-navigation','section-navigation','accordion','collapsible'])assert(catalog.components.find(c=>c.slug===slug).reviewedContract?.fallback,slug);
});
