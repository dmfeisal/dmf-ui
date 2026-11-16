import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('native navigation exports and static pagination pages have real destinations and boundaries',async()=>{
 const pkg=JSON.parse(await readFile('package.json','utf8'));
 for(const slug of ['breadcrumb','pagination','navigation-menu']){
  assert.equal(pkg.exports[`./${slug}`],`./src/components/dmf-ui/${slug}/index.ts`);
 }
 for(const slug of ['breadcrumb','pagination']){const source=await readFile(`src/components/dmf-ui/${slug}/${slug}.astro`,'utf8');assert(!source.includes('<script>'));}
 // The navigation menu's panels need its runtime (as shadcn's do); the script only loads that runtime.
 const menu=await readFile('src/components/dmf-ui/navigation-menu/navigation-menu.astro','utf8');assert.deepEqual(menu.match(/<script>[\s\S]*?<\/script>/g),['<script>import \'./navigation-menu-runtime\';</script>']);
 for(const page of [1,2,3]){
  const html=await readFile(`dist/examples/navigation/${page}/index.html`,'utf8');
  const nav=html.match(/<nav data-slot="pagination"[\s\S]*?<\/nav>/)?.[0];assert(nav);
  assert.match(nav,new RegExp(`href="/examples/navigation/${page}/"[^>]*aria-current="page"`));
  assert.equal((nav.match(/aria-current="page"/g)??[]).length,1);
  assert.equal(nav.includes('rel="prev"'),page>1);assert.equal(nav.includes('rel="next"'),page<3);
  assert(!nav.includes('role="menu"'));assert(!nav.includes('<button'));
 }
});
