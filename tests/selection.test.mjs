import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const source=await readFile('src/components/dmf-ui/toggle/state.ts','utf8');
const code=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {setTogglePressed}=await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
class Toggle extends EventTarget{
 constructor(value,group,pressed=false){super();this.dataset={value};this.group=group;this.attrs=new Map([['aria-pressed',String(pressed)]]);this.name='Stable label';}
 hasAttribute(name){return name==='data-dmf-toggle';}closest(){return this.group;}getAttribute(name){return this.attrs.get(name);}setAttribute(name,value){this.attrs.set(name,value);}
}
test('toggle helper enforces single selection and emits one complete group state',()=>{
 const group=new EventTarget();group.dataset={type:'single'};
 const first=new Toggle('first',group,true),second=new Toggle('second',group);const buttons=[first,second];
 group.querySelectorAll=selector=>selector.includes('aria-pressed')?buttons.filter(b=>b.getAttribute('aria-pressed')==='true'):buttons;
 const states=[];group.addEventListener('toggle-group:change',event=>states.push(event.detail.values));
 setTogglePressed(second,true);assert.equal(first.getAttribute('aria-pressed'),'false');assert.equal(second.getAttribute('aria-pressed'),'true');assert.deepEqual(states,[['second']]);
 setTogglePressed(second,true);assert.equal(states.length,1);
 setTogglePressed(second,false);assert.deepEqual(states,[['second'],[]]);assert.equal(second.name,'Stable label');
 group.dataset.type='multiple';setTogglePressed(first,true);setTogglePressed(second,true);assert.equal(first.getAttribute('aria-pressed'),'true');assert.equal(second.getAttribute('aria-pressed'),'true');
 assert.throws(()=>setTogglePressed({hasAttribute:()=>false},true));
});
test('selection exports and built HTML retain native disclosure and select fallbacks',async()=>{
 const pkg=JSON.parse(await readFile('package.json','utf8'));
 for(const slug of ['collapsible','toggle','toggle-group','combobox'])assert.equal(pkg.exports[`./${slug}`],`./src/components/dmf-ui/${slug}/index.ts`);
 const disclosure=await readFile('dist/components/collapsible/index.html','utf8');assert.match(disclosure,/<details[^>]*data-slot="collapsible"/);assert.match(disclosure,/<summary[^>]*>/);
 const toggle=await readFile('dist/components/toggle/index.html','utf8');assert.match(toggle,/type="button"[^>]*data-dmf-toggle[^>]*disabled aria-pressed="false"/);
 const group=await readFile('dist/components/toggle-group/index.html','utf8');assert.match(group,/data-slot="toggle-group" role="group"/);assert(!group.includes('role="toolbar"'));
 const combo=await readFile('dist/components/combobox/index.html','utf8');assert.match(combo,/<select id="docs-combobox-component-native" name="component" required/);assert.match(combo,/data-combobox-enhanced hidden/);assert.match(combo,/<input[^>]*id="docs-combobox-component"[^>]*disabled required/);assert.match(combo,/role="listbox"/);
});
