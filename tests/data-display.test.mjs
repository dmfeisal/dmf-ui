import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const source=await readFile('src/components/dmf-ui/slider/validation.ts','utf8');
const code=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {validateSlider}=await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
test('slider rejects ambiguous initial values while accepting decimal grids and any step',()=>{
 const base={min:0,max:100,step:5,value:40};
 for(const patch of [{min:NaN},{max:Infinity},{max:0},{max:-1},{step:0},{step:-1},{step:NaN},{value:-5},{value:105},{value:NaN},{value:42}])assert.throws(()=>validateSlider({...base,...patch}));
 for(const patch of [{value:0},{value:100},{min:-10,max:10,step:0.1,value:0.3},{min:0,max:1,step:'any',value:0.345},{min:1,max:2,step:0.25,value:1.75}])assert.doesNotThrow(()=>validateSlider({...base,...patch}));
});
test('data-display exports preserve semantic table, term/detail and native range markup',async()=>{
 const pkg=JSON.parse(await readFile('package.json','utf8'));
 for(const slug of ['table','description-list','slider'])assert.equal(pkg.exports[`./${slug}`],`./src/components/dmf-ui/${slug}/index.ts`);
 const table=await readFile('dist/components/table/index.html','utf8');assert.match(table,/<caption>Illustrative component records<\/caption>/);assert.match(table,/<thead[^>]*>/);assert.match(table,/<th scope="col"/);assert.match(table,/<th scope="row"/);assert.match(table,/role="region" aria-label="Illustrative component records: scrollable table" tabindex="0"/);assert(!table.includes('role="grid"'));
 const list=await readFile('dist/components/description-list/index.html','utf8');assert.match(list,/<dl[^>]*data-slot="description-list"/);assert.match(list,/<dt[^>]*>Adapter<\/dt>/);assert.match(list,/<dd[^>]*>Astro<\/dd>/);
 const slider=await readFile('dist/components/slider/index.html','utf8');assert.match(slider,/<label for="docs-slider-volume"/);assert.match(slider,/name="volume"[^>]*type="range"[^>]*step="5" value="40"/);assert.match(slider,/data-slider-value aria-hidden="true" hidden/);
});
