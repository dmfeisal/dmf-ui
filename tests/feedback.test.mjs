import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
async function loadState(slug){
 const source=await readFile(`src/components/dmf-ui/${slug}/state.ts`,'utf8');
 const code=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
}
const {setProgressValue}=await loadState('progress');
const {setLoadingButtonState}=await loadState('loading-button');
test('progress rejects invalid values atomically and synchronizes known/unknown state',()=>{
 const native={max:20,value:10,removeAttribute(name){assert.equal(name,'value');this.value=0;}};
 const indicator={hidden:true},output={textContent:'50%'};
 const root={dataset:{indeterminate:'false'},querySelector(selector){return selector==='progress'?native:selector==='.dmf-progress-indicator'?indicator:output;}};
 for(const value of [-1,21,NaN,Infinity])assert.throws(()=>setProgressValue(root,value));
 assert.equal(native.value,10);assert.equal(output.textContent,'50%');
 setProgressValue(root,5);assert.equal(output.textContent,'25%');
 setProgressValue(root);assert.equal(root.dataset.indeterminate,'true');assert.equal(indicator.hidden,false);assert.equal(output.textContent,'Working…');
 setProgressValue(root,20);assert.equal(output.textContent,'100%');assert.equal(indicator.hidden,true);
});
test('loading state retains authored disabled controls and restores idle accessible names',()=>{
 for(const disabled of [true,false]){
  const attributes=new Map();const captions=new Map(),status={textContent:'',hasAttribute:key=>key==='data-loading-status'};
  const button={nextElementSibling:status,dataset:{slot:'loading-button',idleDisabled:String(disabled),label:'Save',loadingLabel:'Saving…',presentation:'icon'},setAttribute:(k,v)=>attributes.set(k,v),removeAttribute:k=>attributes.delete(k),querySelector:s=>({setAttribute:(_name,v)=>captions.set(s,v)})};
  setLoadingButtonState(button,true);assert.equal(button.disabled,true);assert.equal(attributes.get('aria-busy'),'true');assert.equal(button.title,'Save');assert.equal(attributes.get('aria-label'),'Save');
  assert.equal(status.textContent,'Saving…');assert.equal(captions.get('[data-idle-label]'),'false');assert.equal(captions.get('[data-pending-label]'),'true');
  setLoadingButtonState(button,false);assert.equal(button.disabled,disabled);assert.equal(attributes.has('aria-busy'),false);assert.equal(attributes.get('aria-label'),'Save');assert.equal(captions.get('[data-idle-label]'),'false');
  assert.equal(status.textContent,'');
 }
});
test('feedback package paths and built pages preserve native semantics',async()=>{
 const pkg=JSON.parse(await readFile('package.json','utf8'));
 for(const slug of ['skeleton','empty-state','progress','loading-button'])assert.equal(pkg.exports[`./${slug}`],`./src/components/dmf-ui/${slug}/index.ts`);
 const progress=await readFile('dist/components/progress/index.html','utf8');assert.match(progress,/<progress aria-label="Preview completion" value="40" max="100"/);
 const empty=await readFile('dist/components/empty-state/index.html','utf8');assert.match(empty,/<h3>No saved components<\/h3>/);assert.match(empty,/href="\/components\/"/);
 const skeleton=await readFile('dist/components/skeleton/index.html','utf8');assert.match(skeleton,/data-slot="skeleton"[^>]*aria-hidden="true"/);
 const button=await readFile('dist/components/loading-button/index.html','utf8');assert.match(button,/data-idle-disabled="true"[^>]*disabled/);
});
