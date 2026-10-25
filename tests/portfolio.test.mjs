import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {compileTokens} from '../scripts/design-tokens.mjs';
test('portfolio extraction exports scoped presets, reusable patterns and source provenance',async()=>{
 const pkg=JSON.parse(await readFile('package.json','utf8'));
 for(const slug of ['archive-index','tag-list','project-action-bar','section-navigation'])assert.equal(pkg.exports[`./${slug}`],`./src/components/dmf-ui/${slug}/index.ts`);
 assert.equal(pkg.exports['./presets/portfolio.css'],'./src/styles/dmf-ui-portfolio.css');
 const output=compileTokens(JSON.parse(await readFile('tokens/design.tokens.json','utf8'))),groups=JSON.parse(output['tokens/resolved.json']).groups;
 for(const [mode,hex] of [['light','#f4f3ef'],['dark','#111111'],['yellow','#f2d43d']])assert.equal(groups[`portfolio.${mode}`].background.value.hex,hex);
 assert(output['src/styles/dmf-ui-portfolio.css'].includes('[data-color-mode="yellow"]'));
 const provenance=JSON.parse(await readFile('docs/DMF-UI-PORTFOLIO-SOURCE.json','utf8'));assert.equal(provenance.sourceRepository,'dmfeisal/dmf-web');assert(provenance.files.every(file=>/^[a-f0-9]{64}$/.test(file.sha256)));
 const html=await readFile('dist/examples/portfolio/index.html','utf8');for(const mode of ['light','dark','yellow'])assert(html.includes(`id="portfolio-${mode}"`));
 const tags=await readFile('dist/components/tag-list/index.html','utf8');assert.match(tags,/<ul data-slot="tag-list"/);assert(!/<[^>]*data-slot="tag-list"[^>]*role="button"/.test(tags));
});
