import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('product detail components export native form semantics and named avatar fallbacks',async()=>{
 const pkg=JSON.parse(await readFile('package.json','utf8'));
 for(const slug of ['avatar','rating','chip'])assert.equal(pkg.exports[`./${slug}`],`./src/components/dmf-ui/${slug}/index.ts`);
 const avatar=await readFile('dist/components/avatar/index.html','utf8');assert.match(avatar,/role="img" aria-label="DMF UI"/);assert.match(avatar,/data-slot="avatar-fallback"[^>]*>DU</);assert.match(avatar,/data-avatar-image[^>]*alt=""/);
 const rating=await readFile('dist/components/rating/index.html','utf8');assert.match(rating,/aria-label="Illustrative score: 4.5 out of 5"/);assert.match(rating,/type="radio" name="rating" value="1"[^>]*required/);assert.match(rating,/<fieldset[^>]*disabled/);
 const chip=await readFile('dist/components/chip/index.html','utf8');assert.match(chip,/type="checkbox" name="category" value="navigation" checked/);assert.match(chip,/value="unavailable" disabled/);
 for(const slug of ['rating','chip'])assert(!(await readFile(`src/components/dmf-ui/${slug}/${slug}.astro`,'utf8')).includes('<script>'));
});
