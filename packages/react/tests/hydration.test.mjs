import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {act,createElement,StrictMode} from 'react';
import {renderProof,Proof} from '../.test-dist/server.mjs';
test('hydrates, changes native and controlled switches, resets form and unmounts',async()=>{
 const dom=new JSDOM(`<div id="root">${renderProof()}</div>`,{url:'https://example.test'});
 const saved=new Map();
 for(const name of ['window','document','HTMLElement','HTMLInputElement','FormData','IS_REACT_ACT_ENVIRONMENT']){saved.set(name,Object.getOwnPropertyDescriptor(globalThis,name));Object.defineProperty(globalThis,name,{configurable:true,writable:true,value:name==='IS_REACT_ACT_ENVIRONMENT'?true:dom.window[name]});}
 let root;
 try{
  const {hydrateRoot}=await import('react-dom/client');const errors=[];
  await act(async()=>{root=hydrateRoot(document.querySelector('#root'),createElement(StrictMode,{},createElement(Proof)),{onRecoverableError:error=>errors.push(error)});});
  assert.deepEqual(errors,[]);
  const form=document.querySelector('form'),updates=form.elements.namedItem('updates'),controlled=form.elements.namedItem('controlled'),disabled=form.elements.namedItem('disabled'),consent=form.elements.namedItem('consent');
  assert.equal(form.checkValidity(),false);
  await act(async()=>{updates.click();controlled.click();disabled.click();consent.click();});
  assert.equal(updates.checked,false);assert.equal(controlled.checked,true);assert.equal(disabled.checked,true);assert.equal(form.checkValidity(),true);
  assert.deepEqual(Object.fromEntries(new FormData(form)),{name:'Feisal',controlled:'on',consent:'on'});
  await act(async()=>{form.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));});
  assert.match(document.querySelector('[role=status]').textContent,/controlled/);
  await act(async()=>{form.reset();});
  assert.equal(updates.checked,true);assert.equal(controlled.checked,false);assert.equal(consent.checked,false);assert.equal(form.checkValidity(),false);
  assert.equal(document.querySelector('[role=status]').textContent,'Form reset.');
  await act(async()=>root.unmount());root=null;assert.equal(document.querySelector('#root').childElementCount,0);
 }finally{if(root)await act(async()=>root.unmount());dom.window.close();for(const [name,descriptor] of saved){if(descriptor)Object.defineProperty(globalThis,name,descriptor);else delete globalThis[name];}}
});
