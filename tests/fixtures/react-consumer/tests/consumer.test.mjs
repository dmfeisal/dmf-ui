import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {act,createElement as h,createRef,StrictMode} from 'react';
import {userEvent} from '@testing-library/user-event';
import {App,render,identifierPrefix} from '../.test-dist/server.mjs';
import {Button,Input,Switch,Card,Text} from '@dmf-ui/react';
async function withDOM(run,html=''){
 const dom=new JSDOM(`<div id="root">${html}</div><div id="other"></div>`,{url:'https://consumer.test'});
 const saved=new Map();const errors=[];const originalError=console.error;
 for(const name of ['window','document','HTMLElement','HTMLInputElement','FormData','navigator','IS_REACT_ACT_ENVIRONMENT']){
  saved.set(name,Object.getOwnPropertyDescriptor(globalThis,name));Object.defineProperty(globalThis,name,{configurable:true,writable:true,value:name==='IS_REACT_ACT_ENVIRONMENT'?true:dom.window[name]});
 }
 console.error=(...args)=>errors.push(args.join(' '));
 const {createRoot,hydrateRoot}=await import('react-dom/client');const roots=[];
 try{
  const mount=async(element,target='#root')=>{const root=createRoot(document.querySelector(target));roots.push(root);await act(async()=>root.render(h(StrictMode,{},element)));return root;};
  const hydrate=async(element,onRecoverableError)=>{let root;await act(async()=>{root=hydrateRoot(document.querySelector('#root'),h(StrictMode,{},element),{identifierPrefix,onRecoverableError});});roots.push(root);return root;};
  await run({mount,hydrate,user:userEvent.setup({document:dom.window.document})});
  assert.deepEqual(errors,[],'React reported warnings or runtime errors');
 }finally{
  await act(async()=>{for(const root of roots)root.unmount();});console.error=originalError;dom.window.close();
  for(const [name,descriptor]of saved){if(descriptor)Object.defineProperty(globalThis,name,descriptor);else delete globalThis[name];}
 }
}
test('packed consumer owns typed controlled forms, simulated keyboard and independent roots',()=>withDOM(async({mount,user})=>{
 await mount(h(App));await mount(h(App),'#other');
 const ids=[...document.querySelectorAll('[id]')].map(node=>node.id);assert.equal(new Set(ids).size,ids.length,'Independent roots must not duplicate label or heading IDs');
 const host=document.querySelector('#root'),form=host.querySelector('form'),name=form.elements.namedItem('name'),updates=form.elements.namedItem('updates'),consent=form.elements.namedItem('consent');
 assert.equal(form.checkValidity(),false);
 await act(async()=>user.click([...form.querySelectorAll('button')].find(button=>button.type==='submit')));
 assert.equal(host.querySelector('[role=status]').textContent,'No values submitted.');
 await act(async()=>{await user.clear(name);await user.type(name,'DMF React');});
 assert.equal(name.value,'DMF React');
 await act(async()=>{await user.tab();await user.keyboard('[Space]');});
 assert.equal(document.activeElement,updates);assert.equal(updates.checked,true);
 assert.equal(document.querySelector('#other [name=updates]').checked,false);
 await act(async()=>{await user.tab();await user.tab();});
 assert.equal(document.activeElement,consent,'Tab skips the disabled Switch');
 await act(async()=>{await user.keyboard('[Space]');});assert.equal(form.checkValidity(),true);
 const click=async(text)=>{const button=[...host.querySelectorAll('button')].find(button=>button.textContent===text);assert.ok(button,text);await act(async()=>user.click(button));};
 await click('Preview values');assert.deepEqual(JSON.parse(host.querySelector('[role=status]').textContent),{name:'DMF React',updates:'enabled',digest:'on',consent:'on'});
 await click('Focus display name');assert.equal(document.activeElement,name);
 await click('CB UI preset');assert.equal(host.querySelector('main').dataset.system,'cb-ui');assert.equal(host.querySelector('main').dataset.colorMode,'light');
 await click('Dark surroundings');assert.equal(document.documentElement.dataset.theme,'dark');assert.equal(host.querySelector('main').dataset.colorMode,'light');
 await click('DMF preset');assert.equal(host.querySelector('main').hasAttribute('data-color-mode'),false);
 await click('Reset form');assert.equal(name.value,'Feisal');assert.equal(updates.checked,false);assert.equal(consent.checked,false);assert.equal(form.elements.namedItem('digest').checked,true);assert.equal(form.checkValidity(),false);
 assert.equal(document.querySelector('#other [role=status]').textContent,'No values submitted.');
}));
test('all five exported components forward refs to native nodes and clear them on removal',()=>withDOM(async({mount,user})=>{
 const refs=Array.from({length:5},()=>createRef());
 const root=await mount(h(Card,{ref:refs[0]},h(Text,{as:'h2',ref:refs[1]},'Ref proof'),h(Input,{ref:refs[2],'aria-label':'Ref input'}),h(Switch,{ref:refs[3]},'Ref switch'),h(Button,{ref:refs[4]},'Ref button')));
 assert.deepEqual(refs.map(ref=>ref.current.tagName),['DIV','H2','INPUT','INPUT','BUTTON']);
 assert.equal(refs[3].current.type,'checkbox');
 await act(async()=>{refs[2].current.focus();await user.type(refs[2].current,'Native input');});assert.equal(refs[2].current.value,'Native input');
 const button=refs[4].current;assert.equal(button.type,'button');
 await act(async()=>root.render(null));assert.ok(refs.every(ref=>ref.current===null));
}));
test('packed server output hydrates both presets without replacing nodes or reporting mismatches',async()=>{
 assert.equal(typeof globalThis.document,'undefined','Server rendering must not require browser globals');
 for(const preset of ['dmf','cb-ui']){
  const html=render(preset);assert.match(html,/<fieldset[^>]*disabled=""/);
  await withDOM(async({hydrate,user})=>{
   const host=document.querySelector('#root'),input=host.querySelector('[name=name]'),fieldset=host.querySelector('fieldset'),id=input.id;
   assert.equal(fieldset.disabled,true);assert.equal(host.querySelector('label').htmlFor,id);
   const errors=[];
   const root=await hydrate(h(App,{initialPreset:preset}),error=>errors.push(error));
   assert.deepEqual(errors,[]);assert.equal(host.querySelector('[name=name]'),input);assert.equal(input.id,id);assert.equal(fieldset.disabled,false);
   assert.equal(host.querySelector('main').dataset.system,preset);
   await act(async()=>{await user.clear(input);await user.type(input,'Hydrated');await user.click(host.querySelector('[name=consent]'));});
   await act(async()=>user.click([...host.querySelectorAll('button')].find(button=>button.textContent==='Preview values')));
   assert.deepEqual(JSON.parse(host.querySelector('[role=status]').textContent),{name:'Hydrated',digest:'on',consent:'on'});
   await act(async()=>root.render(null));assert.equal(host.childElementCount,0);
  },html);
 }
});
