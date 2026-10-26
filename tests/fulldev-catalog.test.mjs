import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const manifest=JSON.parse(await readFile('docs/DMF-UI-FULLDEV-CATALOG.json','utf8'));
const hash=value=>createHash('sha256').update(value).digest('hex');
test('all pinned Fulldev families are represented without replacing retained DMF implementations',async()=>{
 assert.equal(manifest.components.length,65);assert.equal(manifest.components.filter(c=>c.status==='retained-dmf').length,37);assert.equal(manifest.components.filter(c=>c.status==='imported').length,28);
 const pkg=JSON.parse(await readFile('package.json','utf8'));
 for(const item of manifest.components){assert.equal(hash(await readFile(item.payload)),item.sha256);assert(pkg.exports[`./${item.name}`]);await access(`dist/components/${item.name}/index.html`);if(item.status==='imported')for(const file of item.files){const content=await readFile(file.path);assert.equal(hash(content),file.adoptedSha256,file.path);assert(!/(?:from\s+|import\s*)["']@\//.test(content.toString()),`${file.path}: host alias leaked`);}}
 const license=await readFile('vendor/fulldev/LICENCE','utf8');assert.match(license,/Copyright \(c\) 2024 Fulldev, Sil Veltman/);
});
test('adapted document and content utilities remain package-owned and source-safe',async()=>{
 const icon=await readFile('src/components/dmf-ui/icon/icon.astro','utf8');assert(!icon.includes('import.meta.glob'));assert(icon.includes("from 'simple-icons'"));
 const layout=await readFile('src/components/dmf-ui/layout/layout.astro','utf8');assert(!layout.includes('@view-transition'));assert(!layout.includes('@/styles'));
 const docs=await readFile('dist/components/video/index.html','utf8');assert.match(docs,/<template data-fulldev-video-template>[\s\S]*youtube-nocookie/);assert.match(docs,/data-fulldev-video-host><\/div>/);
 const shell=await readFile('dist/examples/layout/index.html','utf8');assert.equal((shell.match(/<html\b/g)??[]).length,1);assert.match(shell,/name="robots" content="noindex/);
 const notices=await readFile('public/dmf-ui-notices.txt','utf8');for(const name of ['Fulldev','David Jerleke','Simple Icons','Lexington'])assert(notices.includes(name));
});
