import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const json=async path=>JSON.parse(await readFile(path,'utf8'));
test('canonical taxonomy covers public families exactly once and keeps domain tags secondary',async()=>{
 const taxonomy=await json('contracts/taxonomy.json'),catalog=await json('contracts/catalog.json'),pkg=await json('package.json');
 assert.equal(taxonomy.categories.length,8);assert.equal(taxonomy.collections.length,6);
 assert.deepEqual(Object.keys(taxonomy.components).sort(),catalog.components.map(c=>c.slug).sort());
 for(const c of catalog.components){assert(taxonomy.categories.includes(c.category));assert.equal(c.kind,'component');assert.equal(c.category,taxonomy.components[c.slug].category);assert.deepEqual(c.domains,taxonomy.components[c.slug].domains);assert.equal(new Set(c.domains).size,c.domains.length);for(const domain of c.domains)assert(taxonomy.collections.includes(domain));assert(pkg.exports[`./${c.slug}`]);}
 assert(!catalog.blocks.some(b=>taxonomy.components[b.slug]));assert.equal(catalog.components.find(c=>c.slug==='merchant-card').category,'Data Display');assert(catalog.react.domainComponents.some(c=>c.name==='MerchantCard'));assert(!catalog.react.blocks.some(c=>c.name==='MerchantCard'));assert.equal(new Set(catalog.react.exports).size,catalog.react.exports.length);
});
test('built catalog, foundation icons and MerchantCard redirect retain discoverability without duplicate pages',async()=>{
 const html=await readFile('dist/components/index.html','utf8'),canonical=await readFile('dist/components/merchant-card/index.html','utf8'),legacy=await readFile('dist/blocks/merchant-card/index.html','utf8'),foundations=await readFile('dist/docs/foundations/index.html','utf8');
 assert.equal((html.match(/<article[^>]*data-component-entry/g)||[]).length,80);assert(html.includes('component-category'));assert(html.includes('component-collection'));assert(canonical.includes('data-slot="merchant-card"'));assert(legacy.includes('/components/merchant-card/'));assert(!legacy.includes('data-slot="merchant-card"'));
 for(const slug of ['colors','typography','spacing','layout','radius','elevation','motion','iconography','accessibility']){assert(foundations.includes(`data-nav-icon="foundation-${slug}"`));const page=await readFile(`dist/docs/foundation-${slug}/index.html`,'utf8');assert(page.includes(`data-nav-icon="foundation-${slug}"`));}
});
