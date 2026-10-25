import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('navigation patterns export native disclosures and retain named icon examples',async()=>{
 const pkg=JSON.parse(await readFile('package.json','utf8'));
 for(const slug of ['sidebar','responsive-navigation']){
  assert.equal(pkg.exports[`./${slug}`],`./src/components/dmf-ui/${slug}/index.ts`);
  const html=await readFile(`dist/components/${slug}/index.html`,'utf8');assert(html.includes('data-dmf-nav-disclosure'));assert(!html.includes('role="menubar"'));
 }
 for(const slug of ['navigation-menu','breadcrumb','pagination','section-navigation','project-action-bar','avatar','rating','chip','tag-list']){
  const html=await readFile(`dist/components/${slug}/index.html`,'utf8');for(const mode of ['label','icon-label','icon'])assert(html.includes(`data-example-presentation="${mode}"`),`${slug}: ${mode}`);
 }
 const pagination=await readFile('dist/components/pagination/index.html','utf8');assert(pagination.includes('aria-label="Page 2"'));assert(pagination.includes('aria-current="page"'));
 const sidebar=await readFile('dist/components/sidebar/index.html','utf8');assert(sidebar.includes('class="dmf-product-sr">Docs</span>'));
});
