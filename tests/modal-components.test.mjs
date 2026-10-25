import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const source=await readFile('src/components/dmf-ui/modal/state.ts','utf8');
const code=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {setModalOpen}=await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
test('modal state requests use the existing dialog event API and reject unrelated roots',()=>{
 const root=new EventTarget();root.hasAttribute=name=>name==='data-dmf-modal-root';const states=[];
 root.addEventListener('dialog:set',event=>states.push(event.detail.open));setModalOpen(root,true);setModalOpen(root,false);assert.deepEqual(states,[true,false]);
 assert.throws(()=>setModalOpen({hasAttribute:()=>false},true));
});
test('modal exports retain safe cancellation, explicit completion and disabled pre-enhancement triggers',async()=>{
 const pkg=JSON.parse(await readFile('package.json','utf8'));
 for(const slug of ['sheet','alert-dialog'])assert.equal(pkg.exports[`./${slug}`],`./src/components/dmf-ui/${slug}/index.ts`);
 const sheet=await readFile('dist/components/sheet/index.html','utf8');for(const side of ['inline-end','inline-start','top','bottom'])assert.match(sheet,new RegExp(`data-side="${side}" hidden`));assert.match(sheet,/data-dialog-enhancement-trigger[^>]*disabled/);
 const alert=await readFile('dist/components/alert-dialog/index.html','utf8');assert.match(alert,/data-component="alert-dialog"[^>]*data-alert-dialog="true" data-close-on-click-outside="false"/);assert.match(alert,/<button[^>]*data-slot="dialog-close"[^>]*autofocus/);assert.match(alert,/data-slot="alert-dialog-action"/);
 const action=await readFile('src/components/dmf-ui/alert-dialog/alert-dialog-action.astro','utf8');assert(!action.includes('data-slot="dialog-close"'));assert.match(action,/type="button"/);
});
