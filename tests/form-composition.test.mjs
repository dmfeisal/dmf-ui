import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const source=await readFile('src/components/dmf-ui/number-field/validation.ts','utf8');
const code=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {validateNumberField}=await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
test('number field validates finite bounds and the native min/value step base',()=>{
 const base={min:0,max:5,step:1,value:2};
 for(const patch of [{min:NaN},{max:Infinity},{min:6},{step:0},{step:-1},{step:Infinity},{value:NaN},{value:6},{value:-1},{value:0.5}])assert.throws(()=>validateNumberField({...base,...patch}));
 for(const options of [{step:1},{min:3,max:3,step:1,value:3},{min:-1,max:2,step:0.1,value:0.3},{step:1,value:0.5},{min:0,step:0.25,value:0.75}])assert.doesNotThrow(()=>validateNumberField(options));
});
test('form composition exports preserve labels, successful native inputs and correct multiple booleans',async()=>{
 const pkg=JSON.parse(await readFile('package.json','utf8'));
 for(const slug of ['input-group','number-field','file-input'])assert.equal(pkg.exports[`./${slug}`],`./src/components/dmf-ui/${slug}/index.ts`);
 const group=await readFile('dist/components/input-group/index.html','utf8');assert.match(group,/for="docs-group-address"/);assert.match(group,/aria-describedby="docs-group-prefix docs-group-suffix"/);assert.match(group,/name="slug" value="dmf-ui"/);
 const number=await readFile('dist/components/number-field/index.html','utf8');assert.match(number,/id="docs-number-label" type="number" value="2" min="1" max="5" step="1"/);assert.match(number,/data-number-controls hidden/);assert.match(number,/data-number-step="1"[^>]*disabled/);
 const file=await readFile('dist/components/file-input/index.html','utf8');assert.match(file,/id="docs-file-attachments" type="file" multiple/);assert.match(file,/id="docs-file-single" type="file"(?! multiple)/);assert.match(file,/data-file-selection hidden/);assert(!file.includes('multiple="false"'));
});
