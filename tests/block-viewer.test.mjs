import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import catalog from '../contracts/catalog.json' with {type:'json'};

// Checks the built documentation site (CI runs `npm run build` before `npm test`).
const built=existsSync('dist/index.html');
test('every block has a viewer, a standalone view route and a no-JavaScript fallback',{skip:!built&&'run npm run build first'},async()=>{
 const index=await readFile('dist/blocks/index.html','utf8');
 const blocks=catalog.blocks.filter(block=>block.slug!=='merchant-card');
 assert.equal(blocks.length,8);
 for(const block of blocks){
  const page=await readFile(`dist/blocks/${block.slug}/index.html`,'utf8'),view=await readFile(`dist/blocks/${block.slug}/view/index.html`,'utf8');
  for(const html of [index,page]){
   const viewer=html.slice(html.indexOf(`id="block-viewer-${block.slug}"`));
   assert(viewer.includes(`href="/blocks/${block.slug}/view/"`),`${block.slug}: plain full-screen link`);
   assert.match(viewer,/data-viewer-sizes hidden/,`${block.slug}: size toggles wait for JavaScript`);
   assert.match(viewer,/data-viewer-handle hidden/,`${block.slug}: resize handle waits for JavaScript`);
  }
  assert(index.includes(`<iframe src="/blocks/${block.slug}/view/"`),`${block.slug}: index frames the view route`);
  assert(view.includes('data-block-view-content')&&view.includes('name="robots" content="noindex"')&&view.includes(`rel="canonical" href="https://ui.feisal.id/blocks/${block.slug}/"`),`${block.slug}: standalone view`);
  assert(!view.includes('docs-header')&&!view.includes('docs-search-dialog'),`${block.slug}: view renders the block alone`);
 }
});
